import { type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, radii, shadow, spacing } from '@/theme';
import { Txt } from './Typography';

interface Option<T extends string> {
  key: T;
  label: string;
  icon?: ReactNode;
}

interface Props<T extends string> {
  options: Option<T>[];
  value: T;
  onChange: (key: T) => void;
}

/** Pill segmented control — light track, white active segment with a soft shadow. */
export function Segmented<T extends string>({ options, value, onChange }: Props<T>) {
  return (
    <View style={styles.track}>
      {options.map((o) => {
        const active = o.key === value;
        return (
          <Pressable
            key={o.key}
            onPress={() => onChange(o.key)}
            style={[styles.seg, active && styles.segActive]}
          >
            {o.icon}
            <Txt variant="bodyStrong" color={active ? colors.text : colors.textMuted}>
              {o.label}
            </Txt>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.md,
    padding: 5,
    gap: 4,
  },
  seg: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    borderRadius: radii.sm,
  },
  segActive: { backgroundColor: colors.surface, ...shadow.card },
});
