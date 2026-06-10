/**
 * App configuration. The real backend lives at API_BASE_URL.
 *
 * `MOCK` flags mark the few things the backend still doesn't expose. Everything
 * else (auth, rides, bookings, wallet, payment methods, saved routes, community
 * groups & chat, driver earnings, admin) talks to the live API.
 */
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'https://urban-lift-api.onrender.com';

export const MOCK = {
  /** Driver "incoming ride requests" — the API is offer-based (no such endpoint). */
  driverRequests: true,
  /** Passenger notification settings — no endpoint (driver notifications do exist). */
  notifications: true,
} as const;
