import { StyleSheet, Text, type TextProps } from 'react-native';
import { colors, fonts, fontSize } from '@/theme';

type Variant =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'body'
  | 'bodyStrong'
  | 'caption'
  | 'captionStrong'
  | 'muted'
  | 'label'
  | 'overline';

interface Props extends TextProps {
  variant?: Variant;
  color?: string;
  center?: boolean;
}

/** All app text flows through this so the Plus Jakarta font + scale stay consistent. */
export function Txt({ variant = 'body', color, center, style, ...rest }: Props) {
  return (
    <Text
      style={[styles[variant], color ? { color } : null, center ? styles.center : null, style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  display: { fontFamily: fonts.extrabold, fontSize: fontSize['5xl'], lineHeight: 46, color: colors.text, letterSpacing: -0.5 },
  h1: { fontFamily: fonts.extrabold, fontSize: fontSize['4xl'], lineHeight: 40, color: colors.text, letterSpacing: -0.4 },
  h2: { fontFamily: fonts.bold, fontSize: fontSize['2xl'], lineHeight: 30, color: colors.text, letterSpacing: -0.3 },
  h3: { fontFamily: fonts.bold, fontSize: fontSize.lg, lineHeight: 24, color: colors.text, letterSpacing: -0.2 },
  body: { fontFamily: fonts.regular, fontSize: fontSize.md, lineHeight: 22, color: colors.text },
  bodyStrong: { fontFamily: fonts.semibold, fontSize: fontSize.md, lineHeight: 22, color: colors.text },
  caption: { fontFamily: fonts.regular, fontSize: fontSize.sm, lineHeight: 18, color: colors.textMuted },
  captionStrong: { fontFamily: fonts.semibold, fontSize: fontSize.sm, lineHeight: 18, color: colors.text },
  muted: { fontFamily: fonts.regular, fontSize: fontSize.md, lineHeight: 22, color: colors.textMuted },
  label: { fontFamily: fonts.semibold, fontSize: fontSize.sm, lineHeight: 18, color: colors.text },
  overline: { fontFamily: fonts.bold, fontSize: fontSize.xs, lineHeight: 16, color: colors.textMuted, letterSpacing: 0.6, textTransform: 'uppercase' },
  center: { textAlign: 'center' },
});
