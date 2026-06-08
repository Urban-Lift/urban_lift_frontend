import { StyleSheet, Text, type TextProps } from 'react-native';
import { colors, fontSize, fontWeight } from '@/theme';

type Variant = 'h1' | 'h2' | 'h3' | 'body' | 'bodyStrong' | 'caption' | 'muted' | 'label';

interface Props extends TextProps {
  variant?: Variant;
  color?: string;
  center?: boolean;
}

export function Txt({ variant = 'body', color, center, style, ...rest }: Props) {
  return (
    <Text
      style={[styles[variant], color ? { color } : null, center ? styles.center : null, style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  h1: { fontSize: fontSize['3xl'], fontWeight: fontWeight.bold, color: colors.text },
  h2: { fontSize: fontSize['2xl'], fontWeight: fontWeight.bold, color: colors.text },
  h3: { fontSize: fontSize.lg, fontWeight: fontWeight.semibold, color: colors.text },
  body: { fontSize: fontSize.md, fontWeight: fontWeight.regular, color: colors.text },
  bodyStrong: { fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: colors.text },
  caption: { fontSize: fontSize.sm, color: colors.textMuted },
  muted: { fontSize: fontSize.md, color: colors.textMuted },
  label: { fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: colors.text },
  center: { textAlign: 'center' },
});
