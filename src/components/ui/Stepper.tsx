import { Pressable, StyleSheet, View } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import { colors, radii, spacing } from '@/theme';
import { Txt } from './Typography';

interface Props {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  /** Optional suffix shown next to the value, e.g. "Passenger". */
  suffix?: string;
}

/** Boxed +/- stepper used for seat selection. */
export function Stepper({ value, onChange, min = 1, max = 4, suffix }: Props) {
  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={() => onChange(Math.max(min, value - 1))}
        style={[styles.btn, value <= min && styles.btnDisabled]}
        hitSlop={6}
      >
        <Minus size={18} color={value <= min ? colors.textLight : colors.text} />
      </Pressable>
      <View style={styles.valueWrap}>
        <Txt variant="bodyStrong">{value}</Txt>
        {suffix ? <Txt variant="caption">{suffix}</Txt> : null}
      </View>
      <Pressable
        onPress={() => onChange(Math.min(max, value + 1))}
        style={[styles.btnPrimary, value >= max && styles.btnDisabled]}
        hitSlop={6}
      >
        <Plus size={18} color={value >= max ? colors.textLight : colors.onPrimary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.md,
    padding: 6,
  },
  btn: {
    width: 40,
    height: 40,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimary: {
    width: 40,
    height: 40,
    borderRadius: radii.sm,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDisabled: { opacity: 0.5 },
  valueWrap: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
