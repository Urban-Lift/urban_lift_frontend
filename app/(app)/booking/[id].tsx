import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { CheckCircle2 } from 'lucide-react-native';
import { Button, Card, DriverCard, RouteLine, Screen, Txt } from '@/components';
import { useBookingStore } from '@/store/bookingStore';
import { departLabel, ghs } from '@/utils/format';
import { colors, radii, spacing } from '@/theme';

export default function BookingConfirmation() {
  const booking = useBookingStore((s) => s.lastBooking);

  if (!booking) {
    return (
      <Screen>
        <Txt variant="muted" center>
          No booking to show.
        </Txt>
        <Button label="Back home" onPress={() => router.replace('/home')} />
      </Screen>
    );
  }

  return (
    <Screen
      scroll
      footer={
        <View style={styles.actions}>
          <Button label="Track your ride" onPress={() => router.replace(`/tracking/${booking.id}`)} />
          <Button label="Done" variant="ghost" onPress={() => router.replace('/my-rides')} />
        </View>
      }
    >
      <View style={styles.hero}>
        <View style={styles.iconWrap}>
          <CheckCircle2 size={56} color={colors.primary} />
        </View>
        <Txt variant="h1" center>
          Booking confirmed!
        </Txt>
        <Txt variant="muted" center>
          {booking.ride.driver.name} will pick you up · {departLabel(booking.ride.departAt)}
        </Txt>
      </View>

      <Card>
        <DriverCard driver={booking.ride.driver} />
      </Card>

      <Card>
        <RouteLine origin={booking.pickup} destination={booking.dropoff} />
      </Card>

      <Card>
        <Row label="Seats booked" value={String(booking.seats)} />
        <Row label="Departure" value={departLabel(booking.ride.departAt)} />
        <Row label="Reference" value={booking.id} />
        <View style={styles.divider} />
        <Row label="Total paid" value={ghs(booking.totalPrice)} strong />
      </Card>
    </Screen>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <View style={styles.row}>
      <Txt variant="caption">{label}</Txt>
      <Txt variant={strong ? 'bodyStrong' : 'body'} color={strong ? colors.primary : colors.text}>
        {value}
      </Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.lg },
  iconWrap: {
    width: 96,
    height: 96,
    borderRadius: radii.full,
    backgroundColor: colors.lightGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: spacing.xs },
  divider: { height: 1, backgroundColor: colors.borderLight, marginVertical: spacing.sm },
  actions: { gap: spacing.sm },
});
