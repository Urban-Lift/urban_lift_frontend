import { StyleSheet, View } from 'react-native';
import { BadgeCheck, Car } from 'lucide-react-native';
import type { Driver } from '@/types';
import { colors, spacing } from '@/theme';
import { Avatar } from './ui/Avatar';
import { StarRating } from './ui/StarRating';
import { Txt } from './ui/Typography';

interface Props {
  driver: Driver;
  /** Show the vehicle row beneath the name. */
  showVehicle?: boolean;
}

export function DriverCard({ driver, showVehicle = true }: Props) {
  const v = driver.vehicle;
  return (
    <View style={styles.row}>
      <Avatar name={driver.name} uri={driver.avatarUrl} size={56} />
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Txt variant="h3">{driver.name}</Txt>
          {driver.verified ? <BadgeCheck size={18} color={colors.primary} /> : null}
        </View>
        <View style={styles.metaRow}>
          <StarRating rating={driver.rating} showValue size={14} />
          <Txt variant="caption">· {driver.tripsCount} trips</Txt>
        </View>
        {showVehicle && (
          <View style={styles.metaRow}>
            <Car size={14} color={colors.textMuted} />
            <Txt variant="caption">
              {v.color} {v.make} {v.model} · {v.plate}
            </Txt>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  info: { flex: 1, gap: 2 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
});
