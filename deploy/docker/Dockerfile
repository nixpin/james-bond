# @TODO: full featured Dockerfile for JamesDSP + server + web client

# Stage 1: Build JamesDSP
FROM ubuntu:22.04 AS jdsp-builder

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    wget \
    git \
    build-essential \
    qt6-base-dev \
    libqt6svg6-dev \
    libpipewire-0.3-dev \
    libspa-0.2-dev \
    libglib2.0-dev \
    libglibmm-2.4-dev \
    libarchive-dev \
    binutils \
    && rm -rf /var/lib/apt/lists/*

RUN git clone --recursive --branch 2.7.0 https://github.com/Audio4Linux/JDSP4Linux.git /src \
    && cd /src \
    && mkdir build && cd build \
    && qmake6 .. CONFIG+=HEADLESS \
    && make -j$(nproc) \
    && strip --strip-unneeded src/jamesdsp

# Stage 2: Build web client
FROM node:22-alpine AS web-builder
WORKDIR /app
COPY web-client/package*.json ./
RUN npm install
COPY web-client/ ./
RUN npm run build

# Stage 3: Build server, embed web client into server binary
FROM golang:1.26-alpine AS server-builder
WORKDIR /app
COPY server/go.mod server/go.sum ./
RUN go mod download
COPY server/ ./
COPY --from=web-builder /app/dist ./internal/web/dist
RUN CGO_ENABLED=0 GOOS=linux go build -o /server main.go

# Stage 4: Create final runtime image with JamesDSP + server + web client
FROM ubuntu:22.04

LABEL maintainer="Sergey Gri"

ARG UID=1000
ARG GID=1000

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    libpipewire-0.3-0 \
    libqt6gui6 \
    libqt6svg6 \
    libglibmm-2.4-1v5 \
    libarchive13 \
    dbus-x11 \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY --from=jdsp-builder /src/build/src/jamesdsp /usr/local/bin/jamesdsp-headless
COPY --from=server-builder /server /usr/local/bin/james-bond-server

# Create user matching host PUID/PGID (default 1000:1000)
RUN groupadd -g ${GID} appgroup && useradd -u ${UID} -g appgroup -m appuser

# Runtime dir owned by the user
RUN mkdir -p /tmp/runtime && chown ${UID}:${GID} /tmp/runtime && chmod 700 /tmp/runtime
RUN mkdir -p /app/data && chown ${UID}:${GID} /app/data

USER ${UID}

ENV XDG_RUNTIME_DIR=/tmp/runtime
ENV PIPEWIRE_RUNTIME_DIR=/run/user/${UID}
ENV JB_DATA_DIR=/app/data

EXPOSE 8080

# Start a private D-Bus session, then launch JamesDSP in background and the server in foreground
CMD ["sh", "-c", "eval $(dbus-launch --sh-syntax) && (jamesdsp-headless --watch &) && exec james-bond-server"]
