import { StyleSheet, View } from 'react-native';
import { Clock, Users } from 'lucide-react-native';
import type { Ride } from '@/types';
import { colors, spacing } from '@/theme';
import { departLabel, ghsCompact } from '@/utils/format';
import { Card } from './ui/Card';
import { Avatar } from './ui/Avatar';
import { StarRating } from './ui/StarRating';
import { Badge } from './ui/Badge';
import { Txt } from './ui/Typography';
import { RouteLine } from './RouteLine';

interface Props {
  ride: Ride;
  onPress?: () => void;
  compact?: boolean;
}

export function RideCard({ ride, onPress, compact }: Props) {
  return (
    <Card onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.driver}>
          <Avatar name={ride.driver.name} uri={ride.driver.avatarUrl} size={40} />
          <View>
            <Txt variant="bodyStrong">{ride.driver.name}</Txt>
            <StarRating rating={ride.driver.rating} showValue size={13} />
          </View>
        </View>
        <View style={styles.priceWrap}>
          <Txt variant="h3" color={colors.primary}>
            {ghsCompact(ride.pricePerSeat)}
          </Txt>
          <Txt variant="caption">per seat</Txt>
        </View>
      </View>

      <RouteLine origin={ride.origin} destination={ride.destination} />

      {!compact && (
        <View style={styles.metaRow}>
          <View style={styles.meta}>
            <Clock size={14} color={colors.textMuted} />
            <Txt variant="caption">{departLabel(ride.departAt)}</Txt>
          </View>
          <View style={styles.meta}>
            <Users size={14} color={colors.textMuted} />
            <Txt variant="caption">{ride.seatsAvailable} seats left</Txt>
          </View>
        </View>
      )}

      {!compact && ride.amenities.length > 0 && (
        <View style={styles.amenities}>
          {ride.amenities.map((a) => (
            <Badge key={a} label={a} tone="neutral" />
          ))}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  driver: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  priceWrap: { alignItems: 'flex-end' },
  metaRow: { flexDirection: 'row', gap: spacing.lg, marginTop: spacing.md },
  meta: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  amenities: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginTop: spacing.md },
});
