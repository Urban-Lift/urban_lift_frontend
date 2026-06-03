import { create } from 'zustand'
import type { DriverStats, PassengerRequest, DriverTrip } from '@/types'

interface DriverState {
  isOnline:    boolean
  stats:       DriverStats | null
  requests:    PassengerRequest[]
  activeTrip:  DriverTrip | null
  isLoading:   boolean

  setOnline:      (online: boolean) => void
  setStats:       (stats: DriverStats) => void
  setRequests:    (requests: PassengerRequest[]) => void
  removeRequest:  (id: string) => void
  setActiveTrip:  (trip: DriverTrip | null) => void
  setLoading:     (loading: boolean) => void
}

export const useDriverStore = create<DriverState>((set) => ({
  isOnline:   false,
  stats:      null,
  requests:   [],
  activeTrip: null,
  isLoading:  false,

  setOnline:     (isOnline)  => set({ isOnline }),
  setStats:      (stats)     => set({ stats }),
  setRequests:   (requests)  => set({ requests }),
  removeRequest: (id)        => set(s => ({ requests: s.requests.filter(r => r.id !== id) })),
  setActiveTrip: (activeTrip) => set({ activeTrip }),
  setLoading:    (isLoading) => set({ isLoading }),
}))
