import { type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { colors, fontSize, fontWeight, spacing } from '@/theme';

interface Props {
  title?: string;
  subtitle?: string;
  back?: boolean;
  onBack?: () => void;
  right?: ReactNode;
}

/** Lightweight in-screen header. Screens use this instead of the native nav
 *  header so the look is consistent across web and native. */
export function Header({ title, subtitle, back = true, onBack, right }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        {back ? (
          <Pressable
            onPress={onBack ?? (() => (router.canGoBack() ? router.back() : router.replace('/')))}
            hitSlop={8}
            style={styles.backBtn}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <ChevronLeft size={24} color={colors.text} />
          </Pressable>
        ) : null}
        {title ? (
          <View>
            <Text style={styles.title}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>
        ) : null}
      </View>
      {right ? <View>{right}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1 },
  backBtn: { marginLeft: -spacing.xs },
  title: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.text },
  subtitle: { fontSize: fontSize.sm, color: colors.textMuted },
});
