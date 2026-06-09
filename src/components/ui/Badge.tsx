import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, fontSize, radii, spacing } from '@/theme';
import type { BookingStatus } from '@/types';

type Tone = 'success' | 'warning' | 'error' | 'neutral' | 'info' | 'purple' | 'solid';

const toneColors: Record<Tone, { bg: string; fg: string }> = {
  success: { bg: colors.lightGreen, fg: colors.forest },
  warning: { bg: colors.warningLight, fg: '#B45309' },
  error: { bg: colors.errorLight, fg: '#B42318' },
  neutral: { bg: colors.surfaceAlt, fg: colors.textMuted },
  info: { bg: colors.infoLight, fg: '#1D4ED8' },
  purple: { bg: colors.purpleLight, fg: colors.purple },
  solid: { bg: colors.lightGreen, fg: colors.forest },
};

const statusToTone: Record<BookingStatus, Tone> = {
  confirmed: 'success',
  pending: 'warning',
  cancelled: 'error',
  completed: 'neutral',
};

export function Badge({ label, tone = 'neutral', icon }: { label: string; tone?: Tone; icon?: React.ReactNode }) {
  const c = toneColors[tone];
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      {icon}
      <Text style={[styles.text, { color: c.fg }]}>{label}</Text>
    </View>
  );
}

export function StatusBadge({ status }: { status: BookingStatus }) {
  return <Badge label={status[0].toUpperCase() + status.slice(1)} tone={statusToTone[status]} />;
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radii.full,
  },
  text: { fontFamily: fonts.semibold, fontSize: fontSize.xs },
});
