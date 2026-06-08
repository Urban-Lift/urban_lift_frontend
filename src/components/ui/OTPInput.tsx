import { useRef } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { colors, fontSize, fontWeight, radii } from '@/theme';

interface Props {
  value: string;
  onChange: (code: string) => void;
  length?: number;
}

/** Six-box OTP field. Keeps a single string value; each box shows one digit. */
export function OTPInput({ value, onChange, length = 6 }: Props) {
  const refs = useRef<(TextInput | null)[]>([]);

  function handle(text: string, index: number) {
    const digit = text.replace(/\D/g, '').slice(-1);
    const next = value.split('');
    next[index] = digit;
    const joined = next.join('').slice(0, length);
    onChange(joined);
    if (digit && index < length - 1) refs.current[index + 1]?.focus();
  }

  function handleKey(key: string, index: number) {
    if (key === 'Backspace' && !value[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  }

  return (
    <View style={styles.row}>
      {Array.from({ length }).map((_, i) => (
        <TextInput
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          value={value[i] ?? ''}
          onChangeText={(t) => handle(t, i)}
          onKeyPress={({ nativeEvent }) => handleKey(nativeEvent.key, i)}
          keyboardType="number-pad"
          maxLength={1}
          style={[styles.box, value[i] ? styles.boxFilled : null]}
          textAlign="center"
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  box: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: 52,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  boxFilled: { borderColor: colors.primary, backgroundColor: colors.lightGreen },
});
