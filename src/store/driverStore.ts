/**
 * Driver-side session state: online toggle, the request currently being acted
 * on, and the trip state machine (pending → navigating_to_pickup → in_trip →
 * completed) used by the driver navigation screens.
 */
import { create } from 'zustand';
import type { RideRequest, TripStatus } from '@/types';

interface DriverState {
  online: boolean;
  activeRequest: RideRequest | null;
  tripStatus: TripStatus;
  setOnline: (v: boolean) => void;
  acceptRequest: (r: RideRequest) => void;
  setTripStatus: (s: TripStatus) => void;
  reset: () => void;
}

export const useDriverStore = create<DriverState>((set) => ({
  online: false,
  activeRequest: null,
  tripStatus: 'pending',
  setOnline: (online) => set({ online }),
  acceptRequest: (activeRequest) =>
    set({ activeRequest, tripStatus: 'navigating_to_pickup' }),
  setTripStatus: (tripStatus) => set({ tripStatus }),
  reset: () => set({ activeRequest: null, tripStatus: 'pending' }),
}));
