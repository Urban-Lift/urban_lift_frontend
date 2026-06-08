import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, fontWeight, radii, spacing } from '@/theme';
import type { BookingStatus } from '@/types';

type Tone = 'success' | 'warning' | 'error' | 'neutral' | 'info';

const toneColors: Record<Tone, { bg: string; fg: string }> = {
  success: { bg: colors.lightGreen, fg: colors.primaryDark },
  warning: { bg: colors.warningLight, fg: colors.warning },
  error: { bg: colors.errorLight, fg: colors.error },
  neutral: { bg: colors.borderLight, fg: colors.textMuted },
  info: { bg: '#DBEAFE', fg: '#2563EB' },
};

const statusToTone: Record<BookingStatus, Tone> = {
  confirmed: 'success',
  pending: 'warning',
  cancelled: 'error',
  completed: 'neutral',
};

export function Badge({ label, tone = 'neutral' }: { label: string; tone?: Tone }) {
  const c = toneColors[tone];
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      <Text style={[styles.text, { color: c.fg }]}>{label}</Text>
    </View>
  );
}

export function StatusBadge({ status }: { status: BookingStatus }) {
  return <Badge label={status[0].toUpperCase() + status.slice(1)} tone={statusToTone[status]} />;
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
  },
  text: { fontSize: fontSize.xs, fontWeight: fontWeight.semibold },
});
