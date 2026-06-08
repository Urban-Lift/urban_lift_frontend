import { useEffect, useState } from 'react';
import { Alert, Platform, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { MessageCircle, Phone, Share2, ShieldAlert } from 'lucide-react-native';
import { Button, Card, DriverCard, MapView, Screen, Spinner, Txt } from '@/components';
import { rideService } from '@/services/rideService';
import { useBookingStore } from '@/store/bookingStore';
import { useTripTracking } from '@/hooks/useTripTracking';
import { colors, radii, spacing } from '@/theme';

export default function Tracking() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lastBooking = useBookingStore((s) => s.lastBooking);
  const clearTrip = useBookingStore((s) => s.clearTrip);

  const { data: bookings } = useQuery({ queryKey: ['bookings'], queryFn: rideService.myBookings });
  const booking =
    lastBooking?.id === id ? lastBooking : bookings?.find((b) => b.id === id) ?? lastBooking ?? null;

  const [done, setDone] = useState(false);
  const trip = useTripTracking(booking, () => setDone(true));

  useEffect(() => {
    return () => clearTrip();
  }, [clearTrip]);

  if (!booking || !trip) return <Spinner />;

  const inTrip = trip.status === 'in_trip' || trip.status === 'completed';

  return (
    <Screen
      padded={false}
      footer={
        <View style={styles.footer}>
          {!inTrip ? (
            <>
              <Button
                label="Cancel ride"
                variant="outline"
                onPress={() =>
                  confirmCancel(async () => {
                    await rideService.cancel(booking.id);
                    router.replace('/my-rides');
                  })
                }
              />
              <Button label="Share trip" variant="ghost" icon={<Share2 size={18} color={colors.text} />} onPress={shareTrip} />
            </>
          ) : done ? (
            <Button label="Rate your trip" onPress={() => router.replace(`/rate/${booking.id}`)} />
          ) : (
            <Button
              label="Cancel trip"
              variant="outline"
              onPress={() =>
                confirmCancel(async () => {
                  await rideService.cancel(booking.id);
                  router.replace('/my-rides');
                })
              }
            />
          )}
        </View>
      }
    >
      <View style={styles.body}>
        <View style={styles.statusBar}>
          <Txt variant="h3">
            {trip.status === 'navigating_to_pickup'
              ? 'Driver is on the way'
              : trip.status === 'in_trip'
                ? 'Heading to your destination'
                : 'You have arrived 🎉'}
          </Txt>
          <Txt variant="muted">
            {trip.status === 'completed'
              ? 'Hope you enjoyed the ride!'
              : `${trip.etaMin} min · ${inTrip ? 'to drop-off' : 'to pickup'}`}
          </Txt>
        </View>

        <MapView
          origin={trip.ride.originCoord}
          destination={trip.ride.destinationCoord}
          progress={trip.progressPct / 100}
          etaMin={trip.etaMin}
          height={300}
        />

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${trip.progressPct}%` }]} />
        </View>

        <Card>
          <DriverCard driver={trip.ride.driver} />
          <View style={styles.contactRow}>
            <Button label="Call" size="sm" variant="secondary" icon={<Phone size={16} color={colors.primaryDark} />} onPress={() => {}} />
            <Button label="Message" size="sm" variant="outline" icon={<MessageCircle size={16} color={colors.primary} />} onPress={() => {}} />
          </View>
        </Card>

        <Card style={styles.sos} onPress={() => Alert.alert('Emergency', 'This would alert UrbanLift safety & your emergency contact.')}>
          <View style={styles.sosRow}>
            <ShieldAlert size={20} color={colors.error} />
            <View style={styles.flex}>
              <Txt variant="bodyStrong" color={colors.error}>
                Emergency SOS
              </Txt>
              <Txt variant="caption">Tap to alert safety team and share your live location.</Txt>
            </View>
          </View>
        </Card>
      </View>
    </Screen>
  );
}

function confirmCancel(onConfirm: () => void) {
  if (Platform.OS === 'web') {
    onConfirm();
    return;
  }
  Alert.alert('Cancel ride?', 'You may be charged a small fee.', [
    { text: 'Keep ride', style: 'cancel' },
    { text: 'Cancel ride', style: 'destructive', onPress: onConfirm },
  ]);
}

function shareTrip() {
  Alert.alert('Trip shared', 'A live tracking link was copied — share it with a friend.');
}

const styles = StyleSheet.create({
  body: { padding: spacing.xl, gap: spacing.md },
  statusBar: { gap: 2 },
  progressTrack: { height: 6, borderRadius: radii.full, backgroundColor: colors.borderLight, overflow: 'hidden' },
  progressFill: { height: 6, borderRadius: radii.full, backgroundColor: colors.primary },
  contactRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  sos: { borderColor: colors.errorLight, backgroundColor: colors.errorLight },
  sosRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1 },
  footer: { gap: spacing.sm },
});
