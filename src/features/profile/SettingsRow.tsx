import { type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { colors, radii, spacing } from '@/theme';
import { Txt } from '@/components';

interface Props {
  icon: ReactNode;
  label: string;
  subtitle?: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
  last?: boolean;
}

export function SettingsRow({ icon, label, subtitle, value, onPress, danger, last }: Props) {
  return (
    <Pressable onPress={onPress} style={[styles.row, !last && styles.divider]}>
      <View style={[styles.iconWrap, danger && styles.iconDanger]}>{icon}</View>
      <View style={styles.flex}>
        <Txt variant="bodyStrong" color={danger ? colors.error : colors.text}>{label}</Txt>
        {subtitle ? <Txt variant="caption">{subtitle}</Txt> : null}
      </View>
      {value ? <Txt variant="caption">{value}</Txt> : null}
      {onPress && !danger ? <ChevronRight size={18} color={colors.textLight} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg },
  divider: { borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  iconWrap: { width: 40, height: 40, borderRadius: radii.sm, backgroundColor: colors.lightGreen, alignItems: 'center', justifyContent: 'center' },
  iconDanger: { backgroundColor: colors.errorLight },
  flex: { flex: 1 },
});
