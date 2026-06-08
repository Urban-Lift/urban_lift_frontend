import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '@/theme';
import { Txt } from './ui/Typography';

interface Props {
  origin: string;
  destination: string;
  originLabel?: string;
  destinationLabel?: string;
}

/** Origin → destination with the dotted connector dot/line/pin motif. */
export function RouteLine({ origin, destination, originLabel = 'Pickup', destinationLabel = 'Drop-off' }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.rail}>
        <View style={styles.dot} />
        <View style={styles.line} />
        <View style={[styles.dot, styles.dotEnd]} />
      </View>
      <View style={styles.labels}>
        <View>
          <Txt variant="caption">{originLabel}</Txt>
          <Txt variant="bodyStrong">{origin}</Txt>
        </View>
        <View>
          <Txt variant="caption">{destinationLabel}</Txt>
          <Txt variant="bodyStrong">{destination}</Txt>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
  rail: { alignItems: 'center', paddingTop: 4 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  dotEnd: { backgroundColor: colors.warning },
  line: { width: 2, flex: 1, minHeight: 24, backgroundColor: colors.border, marginVertical: 2 },
  labels: { flex: 1, justifyContent: 'space-between', gap: spacing.lg },
});
