/**
 * HTTP client for the UrbanLift backend (FastAPI).
 *
 * The API quirks this wrapper hides from the rest of the app:
 *  • Most POST/PATCH bodies are **form-encoded** (application/x-www-form-urlencoded),
 *    NOT JSON. profile/registration uploads are **multipart** (files).
 *  • Auth is a **Bearer** JWT obtained from /users/verify/otp.
 *  • Phone numbers use **local** Ghana format (e.g. 0241234567).
 *  • The Render free dyno can cold-start, so timeouts are generous.
 */
import axios, { type AxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '@/config';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
});

// Bearer token — set by the auth store after OTP verification and on rehydrate.
let authToken: string | null = null;
export function setAuthToken(token: string | null) {
  authToken = token;
}

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

/** Normalise axios errors to a readable message (FastAPI uses `detail`). */
export function apiError(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const detail = err.response?.data?.detail;
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail) && detail[0]?.msg) return detail[0].msg;
    return err.message;
  }
  return err instanceof Error ? err.message : 'Something went wrong';
}

function toForm(data: Record<string, unknown>): string {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(data)) {
    if (v !== undefined && v !== null) params.append(k, String(v));
  }
  return params.toString();
}

const FORM_HEADERS = { 'Content-Type': 'application/x-www-form-urlencoded' };
const MULTIPART_HEADERS = { 'Content-Type': 'multipart/form-data' };

export const http = {
  get: async <T = any>(path: string, params?: Record<string, unknown>, config?: AxiosRequestConfig) =>
    (await api.get<T>(path, { params, ...config })).data,

  postForm: async <T = any>(path: string, data: Record<string, unknown>) =>
    (await api.post<T>(path, toForm(data), { headers: FORM_HEADERS })).data,

  postMultipart: async <T = any>(path: string, form: FormData) =>
    (await api.post<T>(path, form, { headers: MULTIPART_HEADERS })).data,

  patchForm: async <T = any>(path: string, data: Record<string, unknown>) =>
    (await api.patch<T>(path, toForm(data), { headers: FORM_HEADERS })).data,

  patchMultipart: async <T = any>(path: string, form: FormData) =>
    (await api.patch<T>(path, form, { headers: MULTIPART_HEADERS })).data,

  postQuery: async <T = any>(path: string, params: Record<string, unknown>) =>
    (await api.post<T>(path, undefined, { params })).data,

  del: async <T = any>(path: string, data?: Record<string, unknown>) =>
    (await api.delete<T>(path, data ? { data: toForm(data), headers: FORM_HEADERS } : undefined)).data,
};

/** Build a React Native multipart file part from a local uri. */
export function filePart(uri: string, name = 'upload.jpg') {
  const ext = uri.split('.').pop()?.toLowerCase() ?? 'jpg';
  const type = ext === 'png' ? 'image/png' : 'image/jpeg';
  // RN FormData accepts this shape for files.
  return { uri, name: `${name.replace(/\.\w+$/, '')}.${ext}`, type } as unknown as Blob;
}

/** Simulate latency for the remaining mock services. */
export function delay<T>(value: T, ms = 500): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}
