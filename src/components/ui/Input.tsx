import { forwardRef, type ReactNode } from 'react';
import { StyleSheet, Text, TextInput, type TextInputProps, View } from 'react-native';
import { colors, fontSize, fontWeight, radii, spacing } from '@/theme';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  left?: ReactNode;
  right?: ReactNode;
}

export const Input = forwardRef<TextInput, Props>(function Input(
  { label, error, hint, left, right, style, ...rest },
  ref,
) {
  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.field, error ? styles.fieldError : null]}>
        {left ? <View style={styles.icon}>{left}</View> : null}
        <TextInput
          ref={ref}
          placeholderTextColor={colors.textMuted}
          style={[styles.input, style]}
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
  wrap: { gap: spacing.xs },
  label: { fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: colors.text },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  fieldError: { borderColor: colors.error },
  icon: { justifyContent: 'center' },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: fontSize.md,
    color: colors.text,
  },
  error: { fontSize: fontSize.xs, color: colors.error },
  hint: { fontSize: fontSize.xs, color: colors.textMuted },
});
