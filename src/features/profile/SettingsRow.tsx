import { type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { colors, radii, spacing } from '@/theme';
import { Txt } from '@/components';

interface Props {
  icon: ReactNode;
  label: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
  last?: boolean;
}

export function SettingsRow({ icon, label, value, onPress, danger, last }: Props) {
  return (
    <Pressable onPress={onPress} style={[styles.row, !last && styles.divider]}>
      <View style={[styles.iconWrap, danger && styles.iconDanger]}>{icon}</View>
      <Txt variant="body" color={danger ? colors.error : colors.text} style={styles.label}>
        {label}
      </Txt>
      {value ? <Txt variant="caption">{value}</Txt> : null}
      {onPress && !danger ? <ChevronRight size={18} color={colors.textMuted} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg },
  divider: { borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: radii.sm,
    backgroundColor: colors.lightGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconDanger: { backgroundColor: colors.errorLight },
  label: { flex: 1 },
});
