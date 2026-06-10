/** Passenger ride endpoints (search, book, bookings, review, track, SOS). */
import type { Booking, PaymentProvider, Ride, Trip } from '@/types';
import { http } from './api';
import { asList, mapBooking, mapRide, mapTrip } from './mappers';

export interface SearchParams {
  origin?: string;
  destination?: string;
  seats?: number;
  tripType?: 'one-way' | 'round';
}

const PROVIDER_TO_METHOD: Record<PaymentProvider, string> = {
  mtn: 'mobile_money',
  vodafone: 'mobile_money',
  at: 'mobile_money',
  card: 'wallet',
};

export const rideService = {
  /** Search available rides. `trip_type` is required by the API. */
  async search(params: SearchParams): Promise<Ride[]> {
    const res = await http.get('/passenger/ride/search', {
      trip_type: params.tripType === 'round' ? 'round_trip' : 'one_way',
      pickup_location: params.origin || undefined,
      dropoff_location: params.destination || undefined,
      available_seats: params.seats,
    });
    return asList(res).map(mapRide);
  },

  async getRide(id: string): Promise<Ride | undefined> {
    // Driver ride detail endpoint; passengers normally arrive with the ride
    // already selected from search. Falls back to undefined on error.
    try {
      const res = await http.get(`/drivers/rides/${id}`);
      return mapRide(res?.ride ?? res);
    } catch {
      return undefined;
    }
  },

  async book(input: { rideId: string; seats: number; pickup: string; dropoff: string; method?: PaymentProvider }): Promise<Booking> {
    const res = await http.postForm('/passenger/ride/book', {
      ride_id: input.rideId,
      seats_booked: input.seats,
      payment_method: input.method ? PROVIDER_TO_METHOD[input.method] : 'cash',
      pickup_location: input.pickup,
      dropoff_location: input.dropoff,
    });
    // The book endpoint returns {message, distance_km, duration_min, total_price}
    // (no booking row), so refetch and take the newest booking for this ride.
    const list = await rideService.myBookings();
    const mine = list.filter((b) => b.ride.id === input.rideId);
    return (mine[mine.length - 1] ?? list[list.length - 1] ?? mapBooking(res)) as Booking;
  },

  async myBookings(): Promise<Booking[]> {
    const res = await http.get('/passenger/ride/booking');
    return asList(res).map(mapBooking);
  },

  /** Completed ride history (richer — joins ride details for passengers). */
  async history(): Promise<Booking[]> {
    const res = await http.get('/rides/history');
    return asList(res?.completed_rides ? { data: res.completed_rides } : res).map(mapBooking);
  },

  async cancel(_bookingId: string): Promise<{ ok: true }> {
    // No cancel endpoint exposed yet; treated as a no-op success.
    return { ok: true };
  },

  async review(input: { rideId: string; rating: number; comment?: string; note?: string }): Promise<void> {
    await http.postForm('/passenger/ride/review', {
      ride_id: input.rideId,
      rating: input.rating,
      comment: input.comment,
      note: input.note,
    });
  },

  async sos(bookingId: string): Promise<void> {
    await http.postQuery(`/passenger/ride/sos/${bookingId}`, {});
  },

  /** Poll live trip telemetry for a booking. */
  async pollTrip(prev: Trip): Promise<Trip> {
    try {
      const res = await http.get(`/passenger/ride/track/${prev.bookingId}`);
      return mapTrip(res?.tracking ?? res, prev);
    } catch {
      return prev;
    }
  },
};
