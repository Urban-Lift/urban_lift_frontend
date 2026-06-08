import { type ReactNode } from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import { colors, radii, shadow, spacing } from '@/theme';

interface Props {
  children: ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  padded?: boolean;
}

export function Card({ children, onPress, style, padded = true }: Props) {
  const content = (
    <View style={[styles.card, padded && styles.padded, style]}>{children}</View>
  );
  if (!onPress) return content;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadow.card,
  },
  padded: { padding: spacing.lg },
  pressed: { opacity: 0.92 },
});
