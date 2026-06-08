/**
 * Axios instance + the mock toggle. Every service in this folder returns the
 * same shapes whether data comes from fixtures or a real backend, so flipping
 * USE_MOCK_API to false (and pointing API_BASE_URL at a server) is all it
 * takes to go live.
 */
import axios from 'axios';

export const USE_MOCK_API = true;
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'https://api.urbanlift.example';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// Auth token is injected here once we have a real backend. The authStore
// calls setAuthToken() after login so every request is authenticated.
let authToken: string | null = null;
export function setAuthToken(token: string | null) {
  authToken = token;
}
api.interceptors.request.use((config) => {
  if (authToken) config.headers.Authorization = `Bearer ${authToken}`;
  return config;
});

/** Simulate network latency so loading states are exercised in mock mode. */
export function delay<T>(value: T, ms = 600): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}
