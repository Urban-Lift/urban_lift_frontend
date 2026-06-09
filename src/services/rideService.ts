/** Passenger ride endpoints (search, book, bookings, review, track, SOS). */
import type { Booking, PaymentProvider, Ride, Trip } from '@/types';
import { http } from './api';
import { asList, mapBooking, mapRide, mapTrip } from './mappers';

export interface SearchParams {
  origin?: string;
  destination?: string;
  seats?: number;
}

const PROVIDER_TO_METHOD: Record<PaymentProvider, string> = {
  mtn: 'mobile_money',
  vodafone: 'mobile_money',
  at: 'mobile_money',
  card: 'wallet',
};

export const rideService = {
  /** Search available rides by pickup/destination. */
  async search(params: SearchParams): Promise<Ride[]> {
    const res = await http.get('/passenger/ride/search', {
      pickup_location: params.origin,
      dropoff_location: params.destination,
      seats_needed: params.seats,
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
      payment_method: PROVIDER_TO_METHOD[input.method ?? 'mtn'],
      pickup_location: input.pickup,
      dropoff_location: input.dropoff,
    });
    // Some APIs return the created booking; otherwise refetch the list head.
    if (res && (res.id || res.booking_id || res.ride)) return mapBooking(res);
    const list = await rideService.myBookings();
    return list[0];
  },

  async myBookings(): Promise<Booking[]> {
    const res = await http.get('/passenger/ride/booking');
    return asList(res).map(mapBooking);
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
