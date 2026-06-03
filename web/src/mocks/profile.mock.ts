import type { SavedRoute } from '@/types'

const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

export const mockSavedRoutes: SavedRoute[] = [
  { id: 'sr-001', userId: 'usr-001', label: 'Morning commute', pickupLocation: 'East Legon', dropoffLocation: 'Accra Central' },
  { id: 'sr-002', userId: 'usr-001', label: 'Uni run',         pickupLocation: 'Madina Station', dropoffLocation: 'Legon Campus' },
]

export const mockNotificationPrefs: Record<string, boolean> = {
  ride_updates: true,
  payments:     true,
  promotions:   false,
  community:    true,
  safety:       true,
}

export const mockProfileApi = {
  async getSavedRoutes(): Promise<SavedRoute[]> {
    await delay(500)
    return [...mockSavedRoutes]
  },

  async addSavedRoute(data: Omit<SavedRoute, 'id' | 'userId'>): Promise<SavedRoute> {
    await delay(600)
    const route: SavedRoute = { id: `sr-${Date.now()}`, userId: 'usr-001', ...data }
    mockSavedRoutes.push(route)
    return route
  },

  async deleteSavedRoute(id: string): Promise<void> {
    await delay(400)
    const idx = mockSavedRoutes.findIndex(r => r.id === id)
    if (idx !== -1) mockSavedRoutes.splice(idx, 1)
  },

  async getNotificationPrefs(): Promise<Record<string, boolean>> {
    await delay(400)
    return { ...mockNotificationPrefs }
  },

  async updateNotificationPref(key: string, value: boolean): Promise<void> {
    await delay(300)
    mockNotificationPrefs[key] = value
  },

  async updateProfile(data: { fullName: string; email?: string; emergencyContact?: string }): Promise<void> {
    await delay(800)
    // In a real app, would update user record
    void data
  },
}
