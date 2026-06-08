/** Profile update + saved-routes CRUD + review submission. */
import type { Review, SavedRoute, User } from '@/types';
import { savedRoutes } from '@/mocks/data';
import { refId } from '@/utils/format';
import { delay } from './api';

export const profileService = {
  async updateProfile(patch: Partial<User>): Promise<Partial<User>> {
    return delay(patch, 700);
  },

  async getSavedRoutes(): Promise<SavedRoute[]> {
    return delay(savedRoutes, 400);
  },

  async addSavedRoute(input: Omit<SavedRoute, 'id'>): Promise<SavedRoute> {
    return delay({ id: refId('SR'), ...input }, 500);
  },

  async deleteSavedRoute(id: string): Promise<{ ok: true }> {
    return delay({ ok: true }, 300);
  },

  async submitReview(review: Review): Promise<{ ok: true }> {
    return delay({ ok: true }, 700);
  },
};
