import { type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { colors, radii, spacing } from '@/theme';
import { Txt } from './Typography';

interface Props {
  title?: string;
  subtitle?: string;
  back?: boolean;
  onBack?: () => void;
  right?: ReactNode;
  /** Center the title (default). Set false for a left-aligned large title. */
  centered?: boolean;
  /** Circular back button (used over maps / hero sheets). */
  roundBack?: boolean;
}

export function Header({ title, subtitle, back = true, onBack, right, centered = true, roundBack = false }: Props) {
  const handleBack = onBack ?? (() => (router.canGoBack() ? router.back() : router.replace('/')));

  if (!centered) {
    return (
      <View style={styles.rowLeft}>
        <View style={styles.left}>
          {back ? (
            <Pressable onPress={handleBack} hitSlop={8} style={[styles.backBtn, roundBack && styles.roundBack]}>
              <ChevronLeft size={24} color={colors.text} />
            </Pressable>
          ) : null}
          {title ? (
            <View>
              <Txt variant="h1">{title}</Txt>
              {subtitle ? <Txt variant="caption">{subtitle}</Txt> : null}
            </View>
          ) : null}
        </View>
        {right ? <View>{right}</View> : null}
      </View>
    );
  }

  return (
    <View style={styles.row}>
      <View style={styles.side}>
        {back ? (
          <Pressable onPress={handleBack} hitSlop={8} style={[styles.backBtn, roundBack && styles.roundBack]}>
            <ChevronLeft size={24} color={colors.text} />
          </Pressable>
        ) : null}
      </View>
      <View style={styles.center}>
        {title ? <Txt variant="h3" center>{title}</Txt> : null}
        {subtitle ? <Txt variant="caption" center>{subtitle}</Txt> : null}
      </View>
      <View style={[styles.side, styles.sideRight]}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    minHeight: 56,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1 },
  side: { width: 64, justifyContent: 'center' },
  sideRight: { alignItems: 'flex-end' },
  center: { flex: 1, alignItems: 'center' },
  backBtn: { marginLeft: -spacing.xs },
  roundBack: {
    width: 40,
    height: 40,
    borderRadius: radii.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 0,
    ...{ shadowColor: '#101828', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 4 },
  },
});
