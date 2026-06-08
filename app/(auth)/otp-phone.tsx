import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Button, Header, OTPInput, Screen, Txt } from '@/components';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';
import { spacing } from '@/theme';

export default function OtpPhone() {
  const draft = useAuthStore((s) => s.draft);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  async function verify() {
    setLoading(true);
    setError(undefined);
    const { verified } = await authService.verifyPhoneOtp(draft?.phone ?? '', code);
    setLoading(false);
    if (verified) router.push('/otp-email');
    else setError('That code is not valid. Enter the 6 digits we sent you.');
  }

  return (
    <Screen scroll footer={<Button label="Verify" onPress={verify} disabled={code.length < 6} loading={loading} />}>
      <Header title="Verify your phone" />
      <View style={styles.body}>
        <Txt variant="muted">
          Enter the 6-digit code sent to {draft?.phone ?? 'your number'}.
        </Txt>
        <OTPInput value={code} onChange={setCode} />
        {error ? <Txt variant="caption" color="#DC2626">{error}</Txt> : null}
        <Txt variant="caption">Tip: in this demo any 6 digits work.</Txt>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { gap: spacing.xl, marginTop: spacing.md },
});
