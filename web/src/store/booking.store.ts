import { create } from 'zustand'
import type { Booking } from '@/types'

interface BookingState {
  currentBooking: Booking | null
  upcoming: Booking[]
  past: Booking[]
  isLoading: boolean

  setCurrentBooking: (booking: Booking | null) => void
  setMyRides: (data: { upcoming: Booking[]; past: Booking[] }) => void
  setLoading: (v: boolean) => void
}

export const useBookingStore = create<BookingState>()((set) => ({
  currentBooking: null,
  upcoming:       [],
  past:           [],
  isLoading:      false,

  setCurrentBooking: (currentBooking) => set({ currentBooking }),
  setMyRides:        ({ upcoming, past }) => set({ upcoming, past }),
  setLoading:        (isLoading) => set({ isLoading }),
}))
