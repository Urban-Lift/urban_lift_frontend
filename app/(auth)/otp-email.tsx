import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Lightbulb, Mail } from 'lucide-react-native';
import { Button, Header, Input, OTPInput, Screen, Txt } from '@/components';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';
import { colors, radii, spacing } from '@/theme';

export default function OtpEmail() {
  const draft = useAuthStore((s) => s.draft);
  const updateDraft = useAuthStore((s) => s.updateDraft);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  async function sendCode() {
    setLoading(true);
    updateDraft({ email });
    await authService.requestOtp(email);
    setLoading(false);
    setSent(true);
  }

  async function verify() {
    setLoading(true);
    const { verified } = await authService.verifyEmailOtp(email, code);
    setLoading(false);
    if (verified) router.push(draft?.role === 'driver' ? '/setup-driver' : '/setup-passenger');
  }

  return (
    <Screen
      scroll
      footer={
        sent ? (
          <View style={styles.footer}>
            <Button label="Verify Email" onPress={verify} disabled={code.length < 6} loading={loading} />
            <View style={styles.resend}>
              <Txt variant="caption">Didn't receive code?</Txt>
              <Pressable onPress={sendCode} hitSlop={8}>
                <Txt variant="captionStrong" color={colors.forest}>Resend Email</Txt>
              </Pressable>
            </View>
          </View>
        ) : (
          <Button label="Send code" onPress={sendCode} disabled={!emailValid} loading={loading} />
        )
      }
    >
      <Header roundBack />
      <View style={styles.body}>
        <View style={styles.badge}>
          <Mail size={28} color={colors.forest} />
          <View style={styles.badgeDot} />
        </View>
        <Txt variant="h1" center>Verify Your Email</Txt>

        {sent ? (
          <>
            <Txt variant="muted" center>
              Please enter the 6-digit code sent to{'\n'}
              <Txt variant="bodyStrong">{email}</Txt>
            </Txt>
            <View style={styles.otp}>
              <OTPInput value={code} onChange={setCode} />
            </View>
            <View style={styles.tip}>
              <Lightbulb size={18} color={colors.gold} />
              <Txt variant="caption" style={styles.tipText}>
                Can't find the email? Check your <Txt variant="captionStrong">Spam</Txt> or{' '}
                <Txt variant="captionStrong">Junk</Txt> folder just in case.
              </Txt>
            </View>
          </>
        ) : (
          <>
            <Txt variant="muted" center>We use your email for receipts and account recovery.</Txt>
            <View style={styles.inputWrap}>
              <Input
                placeholder="you@example.com"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                left={<Mail size={18} color={colors.textMuted} />}
              />
            </View>
          </>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { alignItems: 'center', gap: spacing.md, marginTop: spacing.lg },
  badge: {
    width: 64,
    height: 64,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  badgeDot: { position: 'absolute', top: -3, right: -3, width: 16, height: 16, borderRadius: 8, backgroundColor: colors.gold, borderWidth: 2, borderColor: colors.background },
  otp: { alignSelf: 'stretch', marginTop: spacing.lg },
  inputWrap: { alignSelf: 'stretch', marginTop: spacing.sm },
  tip: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
    backgroundColor: colors.warningLight,
    borderRadius: radii.md,
    padding: spacing.lg,
    marginTop: spacing.md,
  },
  tipText: { flex: 1, lineHeight: 18 },
  footer: { gap: spacing.md },
  resend: { flexDirection: 'row', justifyContent: 'center', gap: spacing.xs },
});
