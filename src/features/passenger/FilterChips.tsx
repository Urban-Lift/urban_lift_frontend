import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { colors, radii, spacing } from '@/theme';
import { Txt } from '@/components';

interface Option {
  key: string;
  label: string;
}

interface Props {
  options: Option[];
  value: string;
  onChange: (key: string) => void;
}

/** Horizontal, scrollable single-select chip row used by list filters. */
export function FilterChips({ options, value, onChange }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {options.map((o) => {
        const active = o.key === value;
        return (
          <Pressable
            key={o.key}
            onPress={() => onChange(o.key)}
            style={[styles.chip, active && styles.chipActive]}
          >
            <Txt variant="caption" color={active ? colors.white : colors.textMuted}>
              {o.label}
            </Txt>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { paddingHorizontal: spacing.xl, gap: spacing.sm, paddingVertical: spacing.sm },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radii.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
});
