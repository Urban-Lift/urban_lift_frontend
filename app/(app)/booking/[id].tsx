import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { CalendarPlus, Check, Clock, MapPin, Receipt, X } from 'lucide-react-native';
import { Avatar, Button, Card, Screen, StarRating, Txt } from '@/components';
import { useBookingStore } from '@/store/bookingStore';
import { clockTime, ghs } from '@/utils/format';
import { colors, radii, shadow, spacing } from '@/theme';

export default function BookingConfirmation() {
  const booking = useBookingStore((s) => s.lastBooking);

  if (!booking) {
    return (
      <Screen>
        <Txt variant="muted" center>No booking to show.</Txt>
        <Button label="Back home" onPress={() => router.replace('/home')} />
      </Screen>
    );
  }

  const v = booking.ride.driver.vehicle;

  return (
    <Screen
      padded={false}
      footer={<Button label="Back to Home" onPress={() => router.replace('/home')} />}
    >
      <View style={styles.topbar}>
        <Pressable onPress={() => router.replace('/my-rides')} hitSlop={8}>
          <X size={24} color={colors.text} />
        </Pressable>
        <Txt variant="h3">Booking Confirmed</Txt>
        <Txt variant="captionStrong" color={colors.forest}>Help</Txt>
      </View>

      <View style={styles.body}>
        <View style={styles.heroWrap}>
          <View style={styles.glow} />
          <View style={styles.check}>
            <Check size={44} color={colors.white} strokeWidth={3} />
          </View>
        </View>
        <Txt variant="display" center>Success!</Txt>
        <Txt variant="muted" center style={styles.sub}>
          Your ride with {booking.ride.driver.name.split(' ')[0]} is confirmed. Get ready to roll!
        </Txt>

        <Card style={styles.driverCard}>
          <View style={styles.flex}>
            <Txt variant="overline" color={colors.forest}>Driver</Txt>
            <View style={styles.driverNameRow}>
              <Txt variant="h3">{booking.ride.driver.name.split(' ')[0]}</Txt>
              <View style={styles.ratePill}>
                <StarRating rating={booking.ride.driver.rating} showValue size={12} />
              </View>
            </View>
            <Txt variant="caption">{v.make} {v.model} · {v.plate}</Txt>
          </View>
          <Avatar name={booking.ride.driver.name} uri={booking.ride.driver.avatarUrl} size={56} />
        </Card>

        <Card padded={false} style={styles.grid}>
          <View style={styles.gridRow}>
            <GridCell icon={<Clock size={16} color={colors.textMuted} />} label="Time" value={clockTime(booking.ride.departAt)} />
            <View style={styles.vline} />
            <GridCell icon={<Receipt size={16} color={colors.textMuted} />} label="Price" value={ghs(booking.totalPrice)} />
          </View>
          <View style={styles.hline} />
          <View style={styles.gridRow}>
            <GridCell dot={colors.primary} label="Pick-up" value={booking.pickup} />
            <View style={styles.vline} />
            <GridCell dot={colors.gold} label="Drop-off" value={booking.dropoff} />
          </View>
        </Card>

        <Button label="Add to Calendar" variant="outline" icon={<CalendarPlus size={18} color={colors.text} />} onPress={() => {}} style={styles.calBtn} />
      </View>
    </Screen>
  );
}

function GridCell({ icon, dot, label, value }: { icon?: React.ReactNode; dot?: string; label: string; value: string }) {
  return (
    <View style={styles.cell}>
      <View style={styles.cellHead}>
        {dot ? <View style={[styles.cellDot, { backgroundColor: dot }]} /> : icon}
        <Txt variant="overline">{label}</Txt>
      </View>
      <Txt variant="bodyStrong" numberOfLines={1}>{value}</Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  topbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.xl, paddingVertical: spacing.md },
  body: { paddingHorizontal: spacing.xl, alignItems: 'center', gap: spacing.md },
  flex: { flex: 1 },
  heroWrap: { alignItems: 'center', justifyContent: 'center', marginTop: spacing.lg, marginBottom: spacing.sm },
  glow: { position: 'absolute', width: 120, height: 120, borderRadius: 60, backgroundColor: colors.lightGreen },
  check: { width: 88, height: 88, borderRadius: 44, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', ...shadow.primary },
  sub: { maxWidth: 300 },
  driverCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, alignSelf: 'stretch', marginTop: spacing.md },
  driverNameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  ratePill: { backgroundColor: colors.warningLight, borderRadius: radii.full, paddingHorizontal: spacing.sm, paddingVertical: 2 },
  grid: { alignSelf: 'stretch' },
  gridRow: { flexDirection: 'row' },
  cell: { flex: 1, padding: spacing.lg, gap: spacing.xs },
  cellHead: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cellDot: { width: 8, height: 8, borderRadius: 4 },
  vline: { width: 1, backgroundColor: colors.borderLight },
  hline: { height: 1, backgroundColor: colors.borderLight },
  calBtn: { alignSelf: 'stretch', marginTop: spacing.xs },
});
