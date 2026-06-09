import { forwardRef, useState, type ReactNode } from 'react';
import { StyleSheet, Text, TextInput, type TextInputProps, View } from 'react-native';
import { colors, fonts, fontSize, radii, spacing } from '@/theme';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  left?: ReactNode;
  right?: ReactNode;
}

export const Input = forwardRef<TextInput, Props>(function Input(
  { label, error, hint, left, right, style, onFocus, onBlur, ...rest },
  ref,
) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.field, focused && styles.fieldFocused, error ? styles.fieldError : null]}>
        {left ? <View style={styles.icon}>{left}</View> : null}
        <TextInput
          ref={ref}
          placeholderTextColor={colors.textLight}
          style={[styles.input, style]}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />
        {right ? <View style={styles.icon}>{right}</View> : null}
      </View>
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : hint ? (
        <Text style={styles.hint}>{hint}</Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm },
  label: { fontFamily: fonts.semibold, fontSize: fontSize.sm, color: colors.text },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1.5,
    borderColor: 'transparent',
    borderRadius: radii.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  fieldFocused: { borderColor: colors.primary, backgroundColor: colors.surface },
  fieldError: { borderColor: colors.error, backgroundColor: colors.surface },
  icon: { justifyContent: 'center' },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontFamily: fonts.medium,
    fontSize: fontSize.md,
    color: colors.text,
  },
  error: { fontFamily: fonts.regular, fontSize: fontSize.xs, color: colors.error },
  hint: { fontFamily: fonts.regular, fontSize: fontSize.xs, color: colors.textMuted },
});
