/** Holds the passenger's current search and the ride they're viewing/booking. */
import { create } from 'zustand';
import type { Ride } from '@/types';
import type { SearchParams } from '@/services/rideService';

interface RideState {
  searchParams: SearchParams;
  selectedRide: Ride | null;
  setSearchParams: (p: SearchParams) => void;
  selectRide: (r: Ride) => void;
}

export const useRideStore = create<RideState>((set) => ({
  searchParams: {},
  selectedRide: null,
  setSearchParams: (searchParams) => set({ searchParams }),
  selectRide: (selectedRide) => set({ selectedRide }),
}));
