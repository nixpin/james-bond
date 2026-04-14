const API_BASE = '/api/dsp';
const AUTH_BASE = '/api/auth';

export interface LoginRequest {
  username: string;
  password?: string;
}

export interface TokenResponse {
  token: string;
  role: string;
  expires_at: string;
}

export interface BassBoost {
  enabled: boolean;
  max_gain: number;
}

export interface Master {
  enabled: boolean;
  limiter_release: number;
  limiter_threshold: number;
  post_gain: number;
}

export interface Equalizer {
  enabled: boolean;
  bands: number[];
  gains: number[];
  filter_type: number;
  interpolation: number;
}

export interface Tube {
  enabled: boolean;
  pre_gain: number;
}

export interface Convolver {
  enabled: boolean;
  file: string;
  optimization_mode: number;
  waveform_edit: string;
}

export interface SoundPosition {
  crossfeed_enabled: boolean;
  crossfeed_mode: number;
  crossfeed_feed: number;
  crossfeed_fcut: number;
  stereowide_enabled: boolean;
  stereowide_level: number;
}

const STORAGE_KEY = 'jb_token';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem(STORAGE_KEY);
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.status === 401) {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('jb-unauthorized'));
    throw new Error('Unauthorized');
  }
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || res.statusText);
  }
  return res.json();
}

function authFetch(url: string, options: RequestInit = {}) {
  const headers = {
    ...options.headers,
    ...getAuthHeaders(),
  };
  return fetch(url, { ...options, headers });
}

export const dspApi = {
  isAuthenticated: () => !!localStorage.getItem(STORAGE_KEY),

  login: async (req: LoginRequest) => {
    const res = await fetch(`${AUTH_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req)
    });
    const data = await handleResponse<TokenResponse>(res);
    localStorage.setItem(STORAGE_KEY, data.token);
    window.dispatchEvent(new CustomEvent('jb-auth-change'));
    return data;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('jb-auth-change'));
  },

  getBass: () => authFetch(`${API_BASE}/bass`).then(res => handleResponse<BassBoost>(res)),
  setBass: (data: BassBoost) => authFetch(`${API_BASE}/bass`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => handleResponse<BassBoost>(res)),

  getMaster: () => authFetch(`${API_BASE}/master`).then(res => handleResponse<Master>(res)),
  setMaster: (data: Master) => authFetch(`${API_BASE}/master`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => handleResponse<Master>(res)),

  getEqualizer: () => authFetch(`${API_BASE}/equalizer`).then(res => handleResponse<Equalizer>(res)),
  setEqualizer: (data: Equalizer) => authFetch(`${API_BASE}/equalizer`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => handleResponse<Equalizer>(res)),

  getTube: () => authFetch(`${API_BASE}/tube`).then(res => handleResponse<Tube>(res)),
  setTube: (data: Tube) => authFetch(`${API_BASE}/tube`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => handleResponse<Tube>(res)),

  getConvolver: () => authFetch(`${API_BASE}/convolver`).then(res => handleResponse<Convolver>(res)),
  setConvolver: (data: Convolver) => authFetch(`${API_BASE}/convolver`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => handleResponse<Convolver>(res)),

  getSoundPosition: () => authFetch(`${API_BASE}/sound-position`).then(res => handleResponse<SoundPosition>(res)),
  setSoundPosition: (data: SoundPosition) => authFetch(`${API_BASE}/sound-position`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => handleResponse<SoundPosition>(res)),
};
