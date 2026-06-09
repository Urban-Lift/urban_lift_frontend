import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '@/theme';
import { Txt } from './ui/Typography';

interface Props {
  origin: string;
  destination: string;
  originLabel?: string;
  destinationLabel?: string;
  originTime?: string;
  destinationTime?: string;
  compact?: boolean;
}

/** Origin → destination timeline with the dot / connector / pin motif. */
export function RouteLine({
  origin,
  destination,
  originLabel = 'Pickup',
  destinationLabel = 'Drop-off',
  originTime,
  destinationTime,
  compact,
}: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.rail}>
        <View style={styles.dotOuter}>
          <View style={styles.dotInner} />
        </View>
        <View style={styles.line} />
        <View style={styles.pin} />
      </View>
      <View style={[styles.labels, compact && styles.labelsCompact]}>
        <Point label={originLabel} place={origin} time={originTime} />
        <Point label={destinationLabel} place={destination} time={destinationTime} />
      </View>
    </View>
  );
}

function Point({ label, place, time }: { label: string; place: string; time?: string }) {
  return (
    <View style={styles.point}>
      <View style={styles.pointText}>
        <Txt variant="caption">{label}</Txt>
        <Txt variant="bodyStrong">{place}</Txt>
      </View>
      {time ? <Txt variant="captionStrong">{time}</Txt> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
  rail: { alignItems: 'center', paddingTop: 4 },
  dotOuter: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotInner: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.text },
  line: { width: 2, flex: 1, minHeight: 22, backgroundColor: colors.border, marginVertical: 3 },
  pin: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary, marginBottom: 2 },
  labels: { flex: 1, justifyContent: 'space-between', gap: spacing.lg },
  labelsCompact: { gap: spacing.md },
  point: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  pointText: { flex: 1 },
});
