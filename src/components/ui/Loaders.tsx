import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { colors, radii, spacing } from '@/theme';

export function Spinner({ size = 'large' }: { size?: 'small' | 'large' }) {
  return (
    <View style={styles.center}>
      <ActivityIndicator size={size} color={colors.primary} />
    </View>
  );
}

/** Shimmering placeholder block used while list/detail data loads. */
export function Skeleton({ height = 16, width, style }: { height?: number; width?: number | string; style?: ViewStyle }) {
  const opacity = useSharedValue(0.4);
  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 800 }), -1, true);
  }, [opacity]);
  const animated = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return (
    <Animated.View
      style={[styles.skeleton, { height, width: (width as any) ?? '100%' }, animated, style]}
    />
  );
}

export function SkeletonCard() {
  return (
    <View style={styles.card}>
      <Skeleton height={20} width="60%" />
      <Skeleton height={14} width="90%" />
      <Skeleton height={14} width="40%" />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { padding: spacing.xl, alignItems: 'center', justifyContent: 'center' },
  skeleton: { backgroundColor: colors.borderLight, borderRadius: radii.sm },
  card: {
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
});
