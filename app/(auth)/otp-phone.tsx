import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { CheckCircle2, Clock, Lock } from 'lucide-react-native';
import { Button, Header, OTPInput, Screen, Txt } from '@/components';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';
import { colors, radii, spacing } from '@/theme';

export default function OtpPhone() {
  const draft = useAuthStore((s) => s.draft);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [seconds, setSeconds] = useState(45);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  async function verify() {
    setLoading(true);
    setError(undefined);
    const { verified } = await authService.verifyPhoneOtp(draft?.phone ?? '', code);
    setLoading(false);
    if (verified) router.push('/otp-email');
    else setError('That code is not valid. Enter the 6 digits we sent you.');
  }

  return (
    <Screen
      scroll
      footer={
        <View style={styles.footer}>
          <Button label="Verify & Continue" icon={<CheckCircle2 size={20} color={colors.onPrimary} />} onPress={verify} disabled={code.length < 6} loading={loading} />
          <View style={styles.changeRow}>
            <Txt variant="caption">Wrong number?</Txt>
            <Pressable onPress={() => router.back()} hitSlop={8}>
              <Txt variant="captionStrong" color={colors.text}>Change it</Txt>
            </Pressable>
          </View>
        </View>
      }
    >
      <Header roundBack />
      <View style={styles.body}>
        <View style={styles.badge}>
          <Lock size={26} color={colors.forest} />
        </View>
        <Txt variant="h1">Verify Phone Number</Txt>
        <Txt variant="muted">
          Enter the 6-digit code sent to{' '}
          <Txt variant="bodyStrong">{draft?.phone ?? 'your number'}</Txt>.
        </Txt>

        <View style={styles.otp}>
          <OTPInput value={code} onChange={setCode} />
        </View>

        {error ? (
          <Txt variant="caption" color={colors.error} center>{error}</Txt>
        ) : (
          <View style={styles.resend}>
            <Clock size={14} color={colors.textMuted} />
            {seconds > 0 ? (
              <Txt variant="caption">
                Resend code in{' '}
                <Txt variant="captionStrong" color={colors.forest}>
                  0:{seconds.toString().padStart(2, '0')}
                </Txt>
              </Txt>
            ) : (
              <Pressable onPress={() => setSeconds(45)} hitSlop={8}>
                <Txt variant="captionStrong" color={colors.forest}>Resend code</Txt>
              </Pressable>
            )}
          </View>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { gap: spacing.md, marginTop: spacing.lg },
  badge: {
    width: 56,
    height: 56,
    borderRadius: radii.lg,
    backgroundColor: colors.lightGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  otp: { marginTop: spacing.lg },
  resend: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, marginTop: spacing.md },
  footer: { gap: spacing.md },
  changeRow: { flexDirection: 'row', justifyContent: 'center', gap: spacing.xs },
});
