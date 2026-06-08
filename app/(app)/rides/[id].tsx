import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Check, Minus, Plus } from 'lucide-react-native';
import {
  Badge,
  Button,
  Card,
  DriverCard,
  Header,
  MapView,
  RouteLine,
  Screen,
  Spinner,
  Txt,
} from '@/components';
import { rideService } from '@/services/rideService';
import { useRideStore } from '@/store/rideStore';
import { useBookingStore } from '@/store/bookingStore';
import { ghs } from '@/utils/format';
import { colors, radii, spacing } from '@/theme';

export default function RideDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const selected = useRideStore((s) => s.selectedRide);
  const setLastBooking = useBookingStore((s) => s.setLastBooking);

  const { data: ride } = useQuery({
    queryKey: ['ride', id],
    queryFn: () => rideService.getRide(id!),
    initialData: selected?.id === id ? selected : undefined,
    enabled: !!id,
  });

  const [seats, setSeats] = useState(1);
  const [booking, setBooking] = useState(false);

  if (!ride) return <Spinner />;

  const total = ride.pricePerSeat * seats;
  const serviceFee = 1;

  async function book() {
    setBooking(true);
    const result = await rideService.book({
      rideId: ride!.id,
      seats,
      pickup: ride!.origin,
      dropoff: ride!.destination,
    });
    setLastBooking(result);
    setBooking(false);
    router.push(`/booking/${result.id}`);
  }

  return (
    <Screen
      padded={false}
      footer={
        <View style={styles.footer}>
          <View>
            <Txt variant="caption">Total</Txt>
            <Txt variant="h3" color={colors.primary}>
              {ghs(total + serviceFee)}
            </Txt>
          </View>
          <View style={styles.bookBtn}>
            <Button label={`Book ${seats} seat${seats > 1 ? 's' : ''}`} onPress={book} loading={booking} />
          </View>
        </View>
      }
    >
      <Header title="Ride details" />
      <View style={styles.body}>
        <MapView origin={ride.originCoord} destination={ride.destinationCoord} height={180} />

        <Card>
          <DriverCard driver={ride.driver} />
        </Card>

        <Card>
          <RouteLine origin={ride.origin} destination={ride.destination} />
          <View style={styles.tripMeta}>
            <Txt variant="caption">{ride.distanceKm} km</Txt>
            <Txt variant="caption">· {ride.durationMin} min</Txt>
            <Txt variant="caption">· departs {new Date(ride.departAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Txt>
          </View>
        </Card>

        <Card>
          <Txt variant="h3">Amenities</Txt>
          <View style={styles.amenities}>
            {ride.amenities.map((a) => (
              <Badge key={a} label={a} tone="success" />
            ))}
          </View>
        </Card>

        <Card>
          <Txt variant="h3">Seats</Txt>
          <View style={styles.seatRow}>
            <Txt variant="muted">{ride.seatsAvailable} available</Txt>
            <View style={styles.stepper}>
              <Pressable onPress={() => setSeats(Math.max(1, seats - 1))} style={styles.stepBtn} hitSlop={6}>
                <Minus size={16} color={colors.text} />
              </Pressable>
              <Txt variant="bodyStrong">{seats}</Txt>
              <Pressable
                onPress={() => setSeats(Math.min(ride.seatsAvailable, seats + 1))}
                style={styles.stepBtn}
                hitSlop={6}
              >
                <Plus size={16} color={colors.text} />
              </Pressable>
            </View>
          </View>

          <View style={styles.divider} />
          <PriceRow label={`Seats (${seats} × ${ghs(ride.pricePerSeat)})`} value={ghs(total)} />
          <PriceRow label="Service fee" value={ghs(serviceFee)} />
          <PriceRow label="Total" value={ghs(total + serviceFee)} strong />
        </Card>

        <View style={styles.assurance}>
          <Check size={16} color={colors.primary} />
          <Txt variant="caption">Verified driver · Free cancellation up to 1 hour before</Txt>
        </View>
      </View>
    </Screen>
  );
}

function PriceRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <View style={styles.priceRow}>
      <Txt variant={strong ? 'bodyStrong' : 'caption'}>{label}</Txt>
      <Txt variant={strong ? 'bodyStrong' : 'caption'} color={strong ? colors.primary : colors.text}>
        {value}
      </Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.xl, gap: spacing.md },
  tripMeta: { flexDirection: 'row', gap: spacing.xs, marginTop: spacing.md },
  amenities: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginTop: spacing.sm },
  seatRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.md },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  stepBtn: {
    width: 34,
    height: 34,
    borderRadius: radii.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: { height: 1, backgroundColor: colors.borderLight, marginVertical: spacing.md },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xs },
  assurance: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, justifyContent: 'center' },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.lg },
  bookBtn: { flex: 1 },
});
