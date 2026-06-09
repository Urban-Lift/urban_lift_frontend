import { ActivityIndicator, Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import type { ReactNode } from 'react';
import { colors, fonts, fontSize, radii, shadow, spacing } from '@/theme';
import { Gradient } from './Gradient';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'dark';
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

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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
  const isGradient = variant === 'primary';

  const scale = useSharedValue(1);
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const inner = loading ? (
    <ActivityIndicator color={v.fg} />
  ) : (
    <View style={styles.row}>
      <Text style={[styles.label, { color: v.fg, fontSize: s.fs }]}>{label}</Text>
      {icon}
    </View>
  );

  const padding = { paddingVertical: s.py, paddingHorizontal: spacing.xl };

  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={isDisabled}
      onPressIn={() => (scale.value = withTiming(0.97, { duration: 90 }))}
      onPressOut={() => (scale.value = withTiming(1, { duration: 140 }))}
      style={[
        animated,
        styles.base,
        fullWidth && styles.fullWidth,
        (variant === 'primary' || variant === 'dark') && !isDisabled && (variant === 'primary' ? shadow.primary : shadow.card),
        isDisabled && styles.disabled,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {isGradient ? (
        <Gradient name="primary" style={[styles.fill, padding]}>
          {inner}
        </Gradient>
      ) : (
        <View style={[styles.fill, padding, { backgroundColor: v.bg, borderColor: v.border, borderWidth: v.border === 'transparent' ? 0 : 1.5 }]}>
          {inner}
        </View>
      )}
    </AnimatedPressable>
  );
}

const variantStyles: Record<Variant, { bg: string; fg: string; border: string }> = {
  primary: { bg: colors.primary, fg: colors.onPrimary, border: colors.primary },
  secondary: { bg: colors.lightGreen, fg: colors.forest, border: colors.lightGreen },
  outline: { bg: colors.surface, fg: colors.text, border: colors.border },
  ghost: { bg: 'transparent', fg: colors.textMuted, border: 'transparent' },
  danger: { bg: colors.error, fg: colors.white, border: colors.error },
  dark: { bg: colors.textStrong, fg: colors.white, border: colors.textStrong },
};

const sizeStyles: Record<Size, { py: number; fs: number }> = {
  sm: { py: 10, fs: fontSize.sm },
  md: { py: 16, fs: fontSize.md },
  lg: { py: 18, fs: fontSize.lg },
};

const styles = StyleSheet.create({
  base: { borderRadius: radii.md },
  fullWidth: { alignSelf: 'stretch' },
  fill: { alignItems: 'center', justifyContent: 'center', borderRadius: radii.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  label: { fontFamily: fonts.bold },
  disabled: { opacity: 0.45 },
});
