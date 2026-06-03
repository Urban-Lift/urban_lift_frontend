import { create } from 'zustand'
import type { Ride, RideSearchParams } from '@/types'

interface RideState {
  searchParams: RideSearchParams | null
  availableRides: Ride[]
  selectedRide: Ride | null
  isLoading: boolean

  setSearchParams: (params: RideSearchParams) => void
  setAvailableRides: (rides: Ride[]) => void
  setSelectedRide: (ride: Ride | null) => void
  setLoading: (v: boolean) => void
  clearSearch: () => void
}

export const useRideStore = create<RideState>()((set) => ({
  searchParams:   null,
  availableRides: [],
  selectedRide:   null,
  isLoading:      false,

  setSearchParams:   (searchParams)   => set({ searchParams }),
  setAvailableRides: (availableRides) => set({ availableRides }),
  setSelectedRide:   (selectedRide)   => set({ selectedRide }),
  setLoading:        (isLoading)      => set({ isLoading }),
  clearSearch: () => set({ searchParams: null, availableRides: [], selectedRide: null }),
}))
