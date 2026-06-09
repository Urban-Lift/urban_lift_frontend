import { StyleSheet, View } from 'react-native';
import { ArrowRight, BadgeCheck } from 'lucide-react-native';
import { addMinutes } from 'date-fns';
import type { Ride } from '@/types';
import { colors, spacing } from '@/theme';
import { clockTime, ghsCompact } from '@/utils/format';
import { Card } from './ui/Card';
import { Avatar } from './ui/Avatar';
import { StarRating } from './ui/StarRating';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Txt } from './ui/Typography';
import { RouteLine } from './RouteLine';

interface Props {
  ride: Ride;
  onPress?: () => void;
  compact?: boolean;
}

export function RideCard({ ride, onPress, compact }: Props) {
  const arrival = clockTime(addMinutes(new Date(ride.departAt), ride.durationMin).toISOString());
  const full = ride.seatsAvailable === 0;

  return (
    <Card onPress={compact ? onPress : undefined} style={compact ? styles.compact : undefined}>
      <View style={styles.header}>
        <View style={styles.driver}>
          <Avatar name={ride.driver.name} uri={ride.driver.avatarUrl} size={44} />
          <View style={styles.driverText}>
            <View style={styles.nameRow}>
              <Txt variant="bodyStrong">{ride.driver.name}</Txt>
              {ride.driver.verified ? <BadgeCheck size={15} color={colors.primary} /> : null}
            </View>
            <View style={styles.ratingRow}>
              <StarRating rating={ride.driver.rating} showValue size={12} />
              <Txt variant="caption">· {ride.driver.tripsCount} rides</Txt>
            </View>
          </View>
        </View>
        <View style={styles.priceWrap}>
          <Txt variant="h3" color={full ? colors.textMuted : colors.forest}>
            {ghsCompact(ride.pricePerSeat)}
          </Txt>
          <Txt variant="caption">per seat</Txt>
        </View>
      </View>

      <RouteLine
        origin={ride.origin}
        destination={ride.destination}
        originLabel={clockTime(ride.departAt)}
        destinationLabel={arrival}
        compact
      />

      {!compact && (
        <>
          <View style={styles.tags}>
            {ride.amenities.slice(0, 2).map((a) => (
              <Badge key={a} label={a} tone="neutral" />
            ))}
            {full ? (
              <Badge label="Full" tone="error" />
            ) : (
              <Badge label={`${ride.seatsAvailable} seats left`} tone="info" />
            )}
          </View>
          <View style={styles.divider} />
          <Button
            label={full ? 'Filled' : 'View Details'}
            disabled={full}
            onPress={onPress}
            icon={full ? undefined : <ArrowRight size={18} color={colors.onPrimary} />}
          />
        </>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  compact: { padding: spacing.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  driver: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1 },
  driverText: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  priceWrap: { alignItems: 'flex-end' },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginTop: spacing.md },
  divider: { height: 1, backgroundColor: colors.borderLight, marginVertical: spacing.md },
});
