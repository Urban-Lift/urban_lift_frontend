import { ActivityIndicator, Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import type { ReactNode } from 'react';
import { colors, fontSize, fontWeight, radii, spacing } from '@/theme';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface Props {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
  style?: ViewStyle;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled,
  loading,
  fullWidth = true,
  icon,
  style,
}: Props) {
  const v = variantStyles[variant];
  const s = sizeStyles[size];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: v.bg, borderColor: v.border, paddingVertical: s.py, borderRadius: radii.md },
        fullWidth && styles.fullWidth,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {loading ? (
        <ActivityIndicator color={v.fg} />
      ) : (
        <View style={styles.row}>
          {icon}
          <Text style={[styles.label, { color: v.fg, fontSize: s.fs }]}>{label}</Text>
        </View>
      )}
    </Pressable>
  );
}

const variantStyles: Record<Variant, { bg: string; fg: string; border: string }> = {
  primary: { bg: colors.primary, fg: colors.white, border: colors.primary },
  secondary: { bg: colors.lightGreen, fg: colors.primaryDark, border: colors.lightGreen },
  outline: { bg: 'transparent', fg: colors.primary, border: colors.primary },
  ghost: { bg: 'transparent', fg: colors.text, border: 'transparent' },
  danger: { bg: colors.error, fg: colors.white, border: colors.error },
};

const sizeStyles: Record<Size, { py: number; fs: number }> = {
  sm: { py: spacing.sm, fs: fontSize.sm },
  md: { py: spacing.md + 2, fs: fontSize.md },
  lg: { py: spacing.lg, fs: fontSize.lg },
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    paddingHorizontal: spacing.lg,
  },
  fullWidth: { alignSelf: 'stretch' },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  label: { fontWeight: fontWeight.semibold },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.5 },
});
