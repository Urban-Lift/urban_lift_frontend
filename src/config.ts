/**
 * App configuration. The real backend lives at API_BASE_URL.
 *
 * `MOCK` flags mark features the backend does NOT expose yet, so the app keeps
 * working for them via local fixtures. Everything not listed here talks to the
 * live API. Flip a flag to false once a real endpoint exists.
 */
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'https://urban-lift-api.onrender.com';

export const MOCK = {
  /** No /wallet endpoints on the API yet. */
  wallet: true,
  /** No community/groups/chat endpoints on the API yet. */
  community: true,
  /** No driver earnings/stats or incoming-request endpoints on the API yet. */
  driverStats: true,
  /** No saved-routes endpoints on the API yet. */
  savedRoutes: true,
} as const;
