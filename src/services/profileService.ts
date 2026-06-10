/** Profile edits + saved routes (live API). */
import type { SavedRoute } from '@/types';
import { http } from './api';
import { asList, mapSavedRoute } from './mappers';
import { authService } from './authService';
import { geoService } from './geoService';

export const profileService = {
  async updateProfile(patch: { fullName?: string; emergencyNumber?: string; email?: string; photoUri?: string }): Promise<void> {
    await authService.editProfile(patch);
  },

  async getSavedRoutes(): Promise<SavedRoute[]> {
    const res = await http.get('/passenger/saved-routes');
    return asList(res?.saved_routes ? { data: res.saved_routes } : res).map(mapSavedRoute);
  },

  /** Saving a route needs coordinates, so we geocode pickup + dropoff first. */
  async addSavedRoute(input: Omit<SavedRoute, 'id'>): Promise<SavedRoute> {
    const [from, to] = await Promise.all([geoService.geocode(input.pickup), geoService.geocode(input.dropoff)]);
    if (!from || !to) throw new Error('Could not find one of those locations. Try a more specific name.');
    await http.postForm('/passenger/saved-routes', {
      route_name: input.label,
      pickup_location: input.pickup,
      dropoff_location: input.dropoff,
      pickup_lat: from.coord.lat,
      pickup_lng: from.coord.lng,
      dropoff_lat: to.coord.lat,
      dropoff_lng: to.coord.lng,
    });
    const list = await profileService.getSavedRoutes();
    return list[list.length - 1] ?? { id: '', ...input };
  },

  async deleteSavedRoute(id: string): Promise<{ ok: true }> {
    await http.del(`/passenger/saved-routes/${id}`);
    return { ok: true };
  },
};
