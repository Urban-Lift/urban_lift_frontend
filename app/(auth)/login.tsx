import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { ArrowRight, Car, ChevronDown, User as UserIcon } from 'lucide-react-native';
import { Button, Header, Screen, Segmented, Txt } from '@/components';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';
import type { Role } from '@/types';
import { colors, fonts, fontSize, radii, spacing } from '@/theme';

export default function Login() {
  const startSignup = useAuthStore((s) => s.startSignup);
  const [role, setRole] = useState<Role>('passenger');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const valid = phone.replace(/\D/g, '').length >= 9;

  async function onContinue() {
    setLoading(true);
    const fullPhone = '+233' + phone.replace(/\D/g, '').replace(/^0/, '');
    startSignup(role, fullPhone);
    await authService.requestOtp(fullPhone);
    setLoading(false);
    router.push('/otp-phone');
  }

  return (
    <Screen scroll>
      <Header title="UrbanLift" />
      <View style={styles.body}>
        <View style={styles.intro}>
          <Txt variant="h1">Let's get started</Txt>
          <Txt variant="muted">Choose your role and enter your number to begin.</Txt>
        </View>

        <View style={styles.section}>
          <Txt variant="label">I am a</Txt>
          <Segmented
            value={role}
            onChange={setRole}
            options={[
              { key: 'passenger', label: 'Passenger', icon: <UserIcon size={18} color={role === 'passenger' ? colors.text : colors.textMuted} /> },
              { key: 'driver', label: 'Driver', icon: <Car size={18} color={role === 'driver' ? colors.text : colors.textMuted} /> },
            ]}
          />
        </View>

        <View style={styles.section}>
          <Txt variant="label">Phone Number</Txt>
          <View style={styles.phoneRow}>
            <Pressable style={styles.prefix}>
              <Txt style={styles.flag}>🇬🇭</Txt>
              <Txt variant="bodyStrong">+233</Txt>
              <ChevronDown size={16} color={colors.textMuted} />
            </Pressable>
            <View style={styles.phoneField}>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="020 123 4567"
                placeholderTextColor={colors.textLight}
                keyboardType="phone-pad"
                style={styles.phoneInput}
              />
            </View>
          </View>
          <Txt variant="caption">Standard message and data rates may apply.</Txt>
        </View>

        <Button label="Continue" icon={<ArrowRight size={20} color={colors.onPrimary} />} onPress={onContinue} disabled={!valid} loading={loading} />

        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Txt variant="caption">Or continue with</Txt>
          <View style={styles.divider} />
        </View>

        <Button
          label="Login with Google"
          variant="outline"
          icon={<View style={styles.gIcon}><Txt style={styles.gText}>G</Txt></View>}
          onPress={() => {}}
        />

        <Txt variant="caption" center style={styles.terms}>
          By continuing, you agree to our{' '}
          <Txt variant="caption" color={colors.forest}>Terms of Service</Txt> and{' '}
          <Txt variant="caption" color={colors.forest}>Privacy Policy</Txt>.
        </Txt>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { gap: spacing.xl, marginTop: spacing.sm },
  intro: { gap: spacing.xs },
  section: { gap: spacing.sm },
  phoneRow: { flexDirection: 'row', gap: spacing.sm },
  prefix: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  flag: { fontSize: 18 },
  phoneField: { flex: 1, backgroundColor: colors.surfaceAlt, borderRadius: radii.md, paddingHorizontal: spacing.lg, justifyContent: 'center' },
  phoneInput: { fontFamily: fonts.medium, fontSize: fontSize.md, color: colors.text, paddingVertical: 15 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  divider: { flex: 1, height: 1, backgroundColor: colors.border },
  gIcon: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.infoLight, alignItems: 'center', justifyContent: 'center' },
  gText: { fontFamily: fonts.bold, fontSize: 13, color: colors.info },
  terms: { marginTop: spacing.xs, lineHeight: 18 },
});
