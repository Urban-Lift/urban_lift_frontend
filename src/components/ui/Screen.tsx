import { type ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { colors, spacing } from '@/theme';

interface Props {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  edges?: Edge[];
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  /** Sticky footer pinned to the bottom (e.g. a primary CTA). */
  footer?: ReactNode;
}

export function Screen({
  children,
  scroll = false,
  padded = true,
  edges = ['top'],
  style,
  contentStyle,
  footer,
}: Props) {
  const inner = padded ? [styles.padded, contentStyle] : contentStyle;
  return (
    <SafeAreaView edges={edges} style={[styles.safe, style]}>
      {scroll ? (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[styles.scrollContent, inner]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.flex, inner]}>{children}</View>
      )}
      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  padded: { paddingHorizontal: spacing.xl },
  scrollContent: { paddingVertical: spacing.lg, gap: spacing.lg, flexGrow: 1 },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    backgroundColor: colors.surface,
  },
});
