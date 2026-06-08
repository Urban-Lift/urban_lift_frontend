/** Search rides, ride detail, book + cancel, and mock live-trip polling. */
import type { Booking, Ride, Trip } from '@/types';
import { bookings as seedBookings, rides } from '@/mocks/data';
import { refId } from '@/utils/format';
import { delay } from './api';

export interface SearchParams {
  origin?: string;
  destination?: string;
  seats?: number;
}

export const rideService = {
  async search(params: SearchParams): Promise<Ride[]> {
    let results = rides.filter((r) => r.seatsAvailable >= (params.seats ?? 1));
    if (params.origin) {
      results = results.filter((r) =>
        r.origin.toLowerCase().includes(params.origin!.toLowerCase()),
      );
    }
    if (params.destination) {
      results = results.filter((r) =>
        r.destination.toLowerCase().includes(params.destination!.toLowerCase()),
      );
    }
    return delay(results, 700);
  },

  async getRide(id: string): Promise<Ride | undefined> {
    return delay(rides.find((r) => r.id === id), 400);
  },

  async book(input: {
    rideId: string;
    seats: number;
    pickup: string;
    dropoff: string;
  }): Promise<Booking> {
    const ride = rides.find((r) => r.id === input.rideId)!;
    return delay(
      {
        id: refId('BK'),
        ride,
        seats: input.seats,
        totalPrice: ride.pricePerSeat * input.seats,
        status: 'confirmed',
        pickup: input.pickup,
        dropoff: input.dropoff,
        createdAt: new Date().toISOString(),
      },
      900,
    );
  },

  async myBookings(): Promise<Booking[]> {
    return delay(seedBookings, 500);
  },

  async cancel(bookingId: string): Promise<{ ok: true }> {
    return delay({ ok: true }, 500);
  },

  /**
   * One tick of mock live-trip telemetry. Given the previous trip we advance
   * the driver toward the destination and shrink the ETA — the screens poll
   * this on an interval. Wire a WebSocket here later.
   */
  async pollTrip(prev: Trip): Promise<Trip> {
    const step = prev.status === 'in_trip' ? 14 : 18;
    const progress = Math.min(100, prev.progressPct + step);
    const etaMin = Math.max(0, prev.etaMin - 1);
    const from = prev.ride.originCoord;
    const to = prev.ride.destinationCoord;
    const t = progress / 100;
    return delay(
      {
        ...prev,
        progressPct: progress,
        etaMin,
        driverLocation: {
          lat: from.lat + (to.lat - from.lat) * t,
          lng: from.lng + (to.lng - from.lng) * t,
        },
        status:
          prev.status === 'navigating_to_pickup' && progress >= 100
            ? 'in_trip'
            : prev.status,
      },
      1500,
    );
  },
};
