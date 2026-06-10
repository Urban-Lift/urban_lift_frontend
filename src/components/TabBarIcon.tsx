import { StyleSheet, View, type ColorValue } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { colors, radii } from '@/theme';

interface Props {
  Icon: LucideIcon;
  color: ColorValue;
  focused: boolean;
  /** Show a small notification dot (e.g. unread messages). */
  dot?: boolean;
}

/** Shared bottom-tab icon: pill highlight when active, optional alert dot. */
export function TabBarIcon({ Icon, color, focused, dot }: Props) {
  return (
    <View style={[styles.wrap, focused && styles.wrapActive]}>
      <Icon size={22} color={color as string} strokeWidth={focused ? 2.4 : 2} />
      {dot ? <View style={styles.dot} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: 56, height: 30, borderRadius: radii.full, alignItems: 'center', justifyContent: 'center' },
  wrapActive: { backgroundColor: colors.lightGreen },
  dot: {
    position: 'absolute',
    top: 2,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
    borderWidth: 1.5,
    borderColor: colors.surface,
  },
});
