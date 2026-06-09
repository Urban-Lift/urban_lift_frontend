/**
 * Profile + saved routes. Profile edits hit the real API; saved routes have no
 * backend endpoint yet, so they stay local (see MOCK.savedRoutes in config).
 */
import type { SavedRoute } from '@/types';
import { savedRoutes } from '@/mocks/data';
import { refId } from '@/utils/format';
import { authService } from './authService';
import { delay } from './api';

export const profileService = {
  async updateProfile(patch: { fullName?: string; emergencyNumber?: string; email?: string; photoUri?: string }): Promise<void> {
    await authService.editProfile(patch);
  },

  // ── Saved routes: no API endpoint yet (local only) ──────────────────────────
  async getSavedRoutes(): Promise<SavedRoute[]> {
    return delay(savedRoutes, 300);
  },
  async addSavedRoute(input: Omit<SavedRoute, 'id'>): Promise<SavedRoute> {
    return delay({ id: refId('SR'), ...input }, 300);
  },
  async deleteSavedRoute(_id: string): Promise<{ ok: true }> {
    return delay({ ok: true }, 200);
  },
};
