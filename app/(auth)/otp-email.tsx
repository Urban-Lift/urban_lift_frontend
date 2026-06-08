import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Mail } from 'lucide-react-native';
import { Button, Header, Input, OTPInput, Screen, Txt } from '@/components';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';
import { colors, spacing } from '@/theme';

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
    if (verified) {
      router.push(draft?.role === 'driver' ? '/setup-driver' : '/setup-passenger');
    }
  }

  return (
    <Screen
      scroll
      footer={
        sent ? (
          <Button label="Verify email" onPress={verify} disabled={code.length < 6} loading={loading} />
        ) : (
          <Button label="Send code" onPress={sendCode} disabled={!emailValid} loading={loading} />
        )
      }
    >
      <Header title="Verify your email" />
      <View style={styles.body}>
        <Txt variant="muted">We use your email for receipts and account recovery.</Txt>
        <Input
          label="Email address"
          placeholder="you@example.com"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          editable={!sent}
          left={<Mail size={18} color={colors.textMuted} />}
        />
        {sent ? (
          <View style={styles.otpBlock}>
            <Txt variant="caption">Enter the 6-digit code sent to {email}.</Txt>
            <OTPInput value={code} onChange={setCode} />
          </View>
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { gap: spacing.lg, marginTop: spacing.md },
  otpBlock: { gap: spacing.md, marginTop: spacing.sm },
});
