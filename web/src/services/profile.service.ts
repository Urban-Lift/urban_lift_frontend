import { mockProfileApi } from '@/mocks/profile.mock'
import type { SavedRoute } from '@/types'

export const profileService = {
  getSavedRoutes: (): Promise<SavedRoute[]> => mockProfileApi.getSavedRoutes(),
  addSavedRoute:  (data: Omit<SavedRoute, 'id' | 'userId'>) => mockProfileApi.addSavedRoute(data),
  deleteSavedRoute: (id: string) => mockProfileApi.deleteSavedRoute(id),
  getNotificationPrefs: (): Promise<Record<string, boolean>> => mockProfileApi.getNotificationPrefs(),
  updateNotificationPref: (key: string, value: boolean) => mockProfileApi.updateNotificationPref(key, value),
  updateProfile: (data: { fullName: string; email?: string; emergencyContact?: string }) =>
    mockProfileApi.updateProfile(data),
}
