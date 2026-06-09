import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, MessageCircle, Phone, Share2, ShieldAlert } from 'lucide-react-native';
import { Avatar, Button, MapView, Spinner, Txt } from '@/components';
import { rideService } from '@/services/rideService';
import { useBookingStore } from '@/store/bookingStore';
import { useTripTracking } from '@/hooks/useTripTracking';
import { clockTime, ghs } from '@/utils/format';
import { colors, radii, shadow, spacing } from '@/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Tracking() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { height } = useWindowDimensions();
  const lastBooking = useBookingStore((s) => s.lastBooking);
  const clearTrip = useBookingStore((s) => s.clearTrip);

  const { data: bookings } = useQuery({ queryKey: ['bookings'], queryFn: rideService.myBookings });
  const booking = lastBooking?.id === id ? lastBooking : bookings?.find((b) => b.id === id) ?? lastBooking ?? null;

  const [done, setDone] = useState(false);
  const trip = useTripTracking(booking, () => setDone(true));

  useEffect(() => () => clearTrip(), [clearTrip]);

  if (!booking || !trip) return <Spinner />;

  const inTrip = trip.status === 'in_trip' || trip.status === 'completed';
  const v = booking.ride.driver.vehicle;
  const statusLabel = trip.status === 'navigating_to_pickup' ? 'On the way to Pickup' : trip.status === 'in_trip' ? 'Heading to Destination' : 'Arrived';

  async function cancel() {
    await rideService.cancel(booking!.id);
    router.replace('/my-rides');
  }

  async function sos() {
    try {
      await rideService.sos(booking!.id);
    } catch {
      /* ignore */
    }
    Alert.alert('Emergency', 'Safety team alerted and your live location shared.');
  }

  return (
    <View style={styles.root}>
      <View style={{ height: height * 0.58 }}>
        <MapView
          origin={trip.ride.originCoord}
          destination={trip.ride.destinationCoord}
          progress={trip.progressPct / 100}
          height={height * 0.58}
        />
        <SafeAreaView style={styles.overlay} pointerEvents="box-none">
          <View style={styles.topRow}>
            <Pressable style={styles.roundBtn} onPress={() => router.replace('/my-rides')}>
              <ChevronLeft size={22} color={colors.text} />
            </Pressable>
            <View style={styles.statusPill}>
              <View style={styles.statusDot} />
              <Txt variant="captionStrong" color={colors.forest}>{statusLabel}</Txt>
            </View>
            {inTrip ? (
              <Pressable style={[styles.roundBtn, styles.sosRound]} onPress={sos}>
                <Txt variant="captionStrong" color={colors.white}>SOS</Txt>
              </Pressable>
            ) : (
              <View style={styles.roundBtn} />
            )}
          </View>
        </SafeAreaView>
      </View>

      <View style={styles.sheet}>
        <View style={styles.handle} />
        <View style={styles.etaRow}>
          <View>
            <Txt variant="caption">{done ? 'Completed' : inTrip ? 'Heading to destination' : 'Arriving in'}</Txt>
            <Txt variant="display" color={colors.forest}>{done ? '🎉' : `${trip.etaMin} mins`}</Txt>
            {inTrip ? <Txt variant="caption">{(trip.ride.distanceKm * (1 - trip.progressPct / 100)).toFixed(1)} km remaining</Txt> : null}
          </View>
          {!done ? (
            <View style={styles.kmBadge}>
              <Txt variant="captionStrong" color={colors.forest}>{trip.ride.distanceKm.toFixed(1)} km</Txt>
            </View>
          ) : null}
        </View>

        <View style={styles.driverRow}>
          <Avatar name={booking.ride.driver.name} uri={booking.ride.driver.avatarUrl} size={48} />
          <View style={styles.flex}>
            <Txt variant="bodyStrong">{booking.ride.driver.name.split(' ')[0]}</Txt>
            <Txt variant="caption">{v.make} {v.model} · {v.plate}</Txt>
          </View>
          <Pressable style={styles.iconCircle}><MessageCircle size={18} color={colors.text} /></Pressable>
          <Pressable style={[styles.iconCircle, styles.callCircle]}><Phone size={18} color={colors.forest} /></Pressable>
        </View>

        <View style={styles.actions}>
          {done ? (
            <Button label="Rate your trip" onPress={() => router.replace(`/rate/${booking.id}`)} />
          ) : inTrip ? (
            <>
              <View style={styles.flex}>
                <Button label="Cancel Trip" variant="outline" onPress={cancel} />
              </View>
              <View style={styles.flex}>
                <Button label="Emergency SOS" variant="danger" icon={<ShieldAlert size={16} color={colors.white} />} onPress={sos} />
              </View>
            </>
          ) : (
            <>
              <View style={styles.flex}>
                <Button label="SOS" variant="outline" onPress={sos} />
              </View>
              <View style={styles.flex2}>
                <Button label="Share Trip" icon={<Share2 size={18} color={colors.onPrimary} />} onPress={() => Alert.alert('Trip shared', 'Live tracking link copied.')} />
              </View>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  roundBtn: { width: 44, height: 44, borderRadius: radii.full, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', ...shadow.card },
  sosRound: { backgroundColor: colors.error },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.surface, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radii.full, ...shadow.card },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  sheet: {
    flex: 1,
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii['2xl'],
    borderTopRightRadius: radii['2xl'],
    marginTop: -24,
    padding: spacing.xl,
    gap: spacing.lg,
    ...shadow.floating,
  },
  handle: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border },
  etaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  kmBadge: { backgroundColor: colors.lightGreen, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radii.full },
  driverRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingTop: spacing.lg, borderTopWidth: 1, borderTopColor: colors.borderLight },
  flex: { flex: 1 },
  flex2: { flex: 2 },
  iconCircle: { width: 44, height: 44, borderRadius: radii.full, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  callCircle: { backgroundColor: colors.lightGreen },
  actions: { flexDirection: 'row', gap: spacing.sm },
});
