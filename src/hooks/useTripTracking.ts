import { useEffect, useRef } from 'react';
import type { Booking, Trip } from '@/types';
import { rideService } from '@/services/rideService';
import { useBookingStore, tripFromBooking } from '@/store/bookingStore';

/**
 * Drives the mock live-trip state machine for a booking:
 *   navigating_to_pickup → (reaches pickup) → in_trip → (arrives) → completed
 *
 * It seeds the trip from the booking, then polls `rideService.pollTrip` on an
 * interval, writing each tick into the booking store so the tracking screen
 * re-renders. Swap the interval for a WebSocket later — the screen doesn't
 * change. `onComplete` fires once when the trip finishes.
 */
export function useTripTracking(booking: Booking | null, onComplete?: () => void) {
  const activeTrip = useBookingStore((s) => s.activeTrip);
  const startTrip = useBookingStore((s) => s.startTrip);
  const updateTrip = useBookingStore((s) => s.updateTrip);
  const completedRef = useRef(false);

  useEffect(() => {
    if (!booking) return;
    if (!activeTrip || activeTrip.bookingId !== booking.id) {
      startTrip(tripFromBooking(booking));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booking?.id]);

  useEffect(() => {
    if (!booking) return;
    const interval = setInterval(async () => {
      const current = useBookingStore.getState().activeTrip;
      if (!current || current.status === 'completed') return;

      const next: Trip = await rideService.pollTrip(current);

      // pickup leg finished → start the in-trip leg fresh
      if (current.status === 'navigating_to_pickup' && next.progressPct >= 100) {
        updateTrip({
          ...next,
          status: 'in_trip',
          progressPct: 0,
          etaMin: current.ride.durationMin,
        });
        return;
      }

      // in-trip leg finished → completed
      if (current.status === 'in_trip' && next.progressPct >= 100) {
        updateTrip({ ...next, status: 'completed', progressPct: 100, etaMin: 0 });
        if (!completedRef.current) {
          completedRef.current = true;
          onComplete?.();
        }
        return;
      }

      updateTrip(next);
    }, 2500);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booking?.id]);

  return activeTrip;
}
