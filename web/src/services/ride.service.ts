import { mockRideApi } from '@/mocks/ride.mock'
import type { Ride, Booking, Trip } from '@/types'

const api = mockRideApi

export const rideService = {
  searchRides: (params: { pickupLocation: string; dropoffLocation: string; date: string; seats: number }) =>
    api.searchRides(params),

  getRideById: (id: string): Promise<Ride> =>
    api.getRideById(id),

  bookRide: (rideId: string, seatsBooked: number, paymentMethod: 'cash' | 'mobile_money' | 'wallet'): Promise<Booking> =>
    api.bookRide(rideId, seatsBooked, paymentMethod),

  cancelBooking: (bookingId: string): Promise<void> =>
    api.cancelBooking(bookingId),

  getMyBookings: (): Promise<{ upcoming: Booking[]; past: Booking[] }> =>
    api.getMyBookings(),

  submitReview: (data: { tripId: string; rating: number; tags: string[]; note?: string }): Promise<void> =>
    api.submitReview(data),

  getActiveTrip: (): Promise<Trip | null> =>
    api.getActiveTrip(),
}
