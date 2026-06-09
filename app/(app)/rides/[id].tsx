import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { addMinutes } from 'date-fns';
import { ArrowRight, Car, IdCard, Music, PawPrint, Share2, Shield, Snowflake } from 'lucide-react-native';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Header,
  MapView,
  Screen,
  Spinner,
  StarRating,
  Stepper,
  Txt,
} from '@/components';
import { rideService } from '@/services/rideService';
import { useRideStore } from '@/store/rideStore';
import { useBookingStore } from '@/store/bookingStore';
import { clockTime, ghs, ghsCompact } from '@/utils/format';
import { colors, radii, spacing } from '@/theme';

const AMENITIES = [
  { key: 'AC', label: 'AC', Icon: Snowflake },
  { key: 'Music', label: 'Music', Icon: Music },
  { key: 'Pets', label: 'No Pets', Icon: PawPrint },
];

export default function RideDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const selected = useRideStore((s) => s.selectedRide);
  const setLastBooking = useBookingStore((s) => s.setLastBooking);

  const haveSelected = selected?.id === id;
  const { data: ride } = useQuery({
    queryKey: ['ride', id],
    queryFn: () => rideService.getRide(id!),
    initialData: haveSelected ? selected : undefined,
    // Don't refetch if we already have the ride from search — the detail
    // endpoint is driver-scoped and would otherwise blank the screen.
    enabled: !!id && !haveSelected,
  });

  const [seats, setSeats] = useState(1);
  const [booking, setBooking] = useState(false);

  if (!ride) return <Spinner />;

  const total = ride.pricePerSeat * seats;
  const arrival = clockTime(addMinutes(new Date(ride.departAt), ride.durationMin).toISOString());

  async function book() {
    setBooking(true);
    const result = await rideService.book({ rideId: ride!.id, seats, pickup: ride!.origin, dropoff: ride!.destination });
    setLastBooking(result);
    setBooking(false);
    router.push(`/booking/${result.id}`);
  }

  return (
    <Screen
      padded={false}
      footer={<Button label={`Book Seat${seats > 1 ? 's' : ''} · ${ghs(total)}`} icon={<ArrowRight size={20} color={colors.onPrimary} />} onPress={book} loading={booking} />}
    >
      <Header title="Ride Details" right={<Share2 size={20} color={colors.text} />} />
      <View style={styles.body}>
        <View style={styles.mapWrap}>
          <MapView origin={ride.originCoord} destination={ride.destinationCoord} height={170} />
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Txt variant="captionStrong" color={colors.forest}>Live Tracking Available</Txt>
          </View>
        </View>

        <Card>
          <View style={styles.driverRow}>
            <Avatar name={ride.driver.name} uri={ride.driver.avatarUrl} size={52} />
            <View style={styles.flex}>
              <Txt variant="h3">{ride.driver.name}</Txt>
              <View style={styles.ratingRow}>
                <StarRating rating={ride.driver.rating} showValue size={13} />
                <Txt variant="caption">· {ride.driver.tripsCount} rides</Txt>
              </View>
            </View>
            {ride.driver.verified ? <Badge label="Super Driver" tone="success" /> : null}
          </View>
          <View style={styles.vehicleRow}>
            <View style={styles.vehicleCol}>
              <Txt variant="caption">Vehicle</Txt>
              <View style={styles.vehicleVal}>
                <Car size={16} color={colors.text} />
                <Txt variant="bodyStrong">{ride.driver.vehicle.make} {ride.driver.vehicle.model}</Txt>
              </View>
            </View>
            <View style={styles.vehicleCol}>
              <Txt variant="caption">License Plate</Txt>
              <View style={styles.vehicleVal}>
                <IdCard size={16} color={colors.text} />
                <Txt variant="bodyStrong">{ride.driver.vehicle.plate}</Txt>
              </View>
            </View>
          </View>
        </Card>

        <Card>
          <Timeline time={clockTime(ride.departAt)} place={ride.origin} tag="Pick-up" />
          <View style={styles.timelineLine} />
          <Timeline time={arrival} place={ride.destination} tag="Drop-off" pin />
        </Card>

        <View>
          <Txt variant="h3" style={styles.sectionTitle}>Select Seats</Txt>
          <Card style={styles.seatCard}>
            <View style={styles.flex}>
              <Stepper value={seats} onChange={setSeats} max={ride.seatsAvailable} />
            </View>
            <View style={styles.priceCol}>
              <Txt variant="h2" color={colors.text}>{ghsCompact(total)}</Txt>
              <Txt variant="caption">Total Price</Txt>
            </View>
          </Card>
        </View>

        <View style={styles.amenities}>
          {AMENITIES.map(({ key, label, Icon }) => {
            const on = ride.amenities.includes(key);
            return (
              <View key={key} style={[styles.amenity, on && styles.amenityOn]}>
                <Icon size={22} color={on ? colors.forest : colors.textLight} />
                <Txt variant="captionStrong" color={on ? colors.text : colors.textLight}>{label}</Txt>
              </View>
            );
          })}
        </View>

        <View style={styles.safety}>
          <Shield size={20} color={colors.info} />
          <View style={styles.flex}>
            <Txt variant="captionStrong" color="#1D4ED8">Safety First</Txt>
            <Txt variant="caption" color="#1D4ED8">This trip is monitored via GPS. Share your ride details with family and friends for added safety.</Txt>
          </View>
        </View>
      </View>
    </Screen>
  );
}

function Timeline({ time, place, tag, pin }: { time: string; place: string; tag: string; pin?: boolean }) {
  return (
    <View style={styles.tlRow}>
      <View style={[styles.tlDot, pin && styles.tlPin]} />
      <View style={styles.flex}>
        <Txt variant="h3">{time}</Txt>
        <Txt variant="caption">{place}</Txt>
      </View>
      <Badge label={tag} tone="neutral" />
    </View>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.xl, gap: spacing.md },
  flex: { flex: 1 },
  mapWrap: { position: 'relative' },
  liveBadge: { position: 'absolute', bottom: spacing.md, left: spacing.md, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.surface, paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radii.full },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  driverRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  vehicleRow: { flexDirection: 'row', marginTop: spacing.lg, paddingTop: spacing.lg, borderTopWidth: 1, borderTopColor: colors.borderLight },
  vehicleCol: { flex: 1, gap: 4 },
  vehicleVal: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  tlRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  tlDot: { width: 14, height: 14, borderRadius: 7, borderWidth: 3, borderColor: colors.text },
  tlPin: { borderColor: colors.primary, backgroundColor: colors.primary },
  timelineLine: { width: 2, height: 20, backgroundColor: colors.border, marginLeft: 6, marginVertical: 4 },
  sectionTitle: { marginBottom: spacing.sm },
  seatCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  priceCol: { alignItems: 'flex-end' },
  amenities: { flexDirection: 'row', gap: spacing.md },
  amenity: { flex: 1, alignItems: 'center', gap: spacing.xs, paddingVertical: spacing.lg, borderRadius: radii.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.borderLight },
  amenityOn: { backgroundColor: colors.mint, borderColor: colors.lightGreen },
  safety: { flexDirection: 'row', gap: spacing.md, backgroundColor: colors.infoLight, borderRadius: radii.md, padding: spacing.lg },
});
