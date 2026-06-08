/**
 * The most recent booking plus the live trip derived from it. The tracking
 * screens read `activeTrip` and replace it on every poll tick; the booking
 * confirmation screen reads `lastBooking`.
 */
import { create } from 'zustand';
import type { Booking, Trip } from '@/types';

interface BookingState {
  lastBooking: Booking | null;
  activeTrip: Trip | null;
  setLastBooking: (b: Booking) => void;
  startTrip: (trip: Trip) => void;
  updateTrip: (trip: Trip) => void;
  clearTrip: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  lastBooking: null,
  activeTrip: null,
  setLastBooking: (lastBooking) => set({ lastBooking }),
  startTrip: (activeTrip) => set({ activeTrip }),
  updateTrip: (activeTrip) => set({ activeTrip }),
  clearTrip: () => set({ activeTrip: null }),
}));

/** Build the initial Trip for a booking before polling begins. */
export function tripFromBooking(b: Booking): Trip {
  return {
    id: 'trip_' + b.id,
    bookingId: b.id,
    ride: b.ride,
    status: 'navigating_to_pickup',
    driverLocation: b.ride.originCoord,
    etaMin: 6,
    progressPct: 0,
  };
}
