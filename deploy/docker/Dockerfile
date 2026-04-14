# @TODO: full featured Dockerfile for JamesDSP + server + web client

# Stage 1: Build JamesDSP

# Stage 1: Build JamesDSP
FROM ubuntu:22.04 AS builder

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


# Stage 2: Build server, embed web client into server binary
# @TODO: run build server

# Stage 3: Build web client
# @TODO: Build frontend

# Stage 4: Create final runtime image with JamesDSP + server + web client
FROM ubuntu:22.04

LABEL maintainer="Sergey Gri"

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    libpipewire-0.3-0 \
    libqt6gui6 \
    libqt6svg6 \
    libglibmm-2.4-1v5 \
    libarchive13 \
    dbus-x11 \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /src/build/src/jamesdsp /usr/local/bin/jamesdsp-headless

# Create user matching host PUID/PGID (default 1000:1000)
RUN groupadd -g 1000 appgroup && useradd -u 1000 -g appgroup -m appuser

# Runtime dir owned by the user
RUN mkdir -p /tmp/runtime && chown 1000:1000 /tmp/runtime && chmod 700 /tmp/runtime

USER 1000

ENV XDG_RUNTIME_DIR=/tmp/runtime
ENV PIPEWIRE_RUNTIME_DIR=/run/user/1000

# Start a private D-Bus session and then launch JamesDSP
CMD ["sh", "-c", "eval $(dbus-launch --sh-syntax) && exec jamesdsp-headless --watch"]
