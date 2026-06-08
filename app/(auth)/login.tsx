import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Car, User as UserIcon } from 'lucide-react-native';
import { Button, Header, Input, Screen, Txt } from '@/components';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';
import type { Role } from '@/types';
import { colors, radii, spacing } from '@/theme';

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
      <Header back={false} />
      <View style={styles.body}>
        <Txt variant="h1">Welcome to UrbanLift</Txt>
        <Txt variant="muted">Choose how you want to ride, then enter your phone number.</Txt>

        <View style={styles.roles}>
          <RoleTile
            active={role === 'passenger'}
            onPress={() => setRole('passenger')}
            icon={<UserIcon size={26} color={role === 'passenger' ? colors.primary : colors.textMuted} />}
            title="Passenger"
            subtitle="Find and book rides"
          />
          <RoleTile
            active={role === 'driver'}
            onPress={() => setRole('driver')}
            icon={<Car size={26} color={role === 'driver' ? colors.primary : colors.textMuted} />}
            title="Driver"
            subtitle="Offer rides, earn"
          />
        </View>

        <Input
          label="Phone number"
          placeholder="24 123 4567"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          left={<Txt variant="bodyStrong" color={colors.textMuted}>+233</Txt>}
          hint="We'll send a 6-digit code to verify this number."
        />
      </View>

      <Button label="Continue" onPress={onContinue} disabled={!valid} loading={loading} />
    </Screen>
  );
}

function RoleTile({
  active,
  onPress,
  icon,
  title,
  subtitle,
}: {
  active: boolean;
  onPress: () => void;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.tile, active && styles.tileActive]}>
      {icon}
      <Txt variant="bodyStrong" color={active ? colors.primaryDark : colors.text}>
        {title}
      </Txt>
      <Txt variant="caption" center>
        {subtitle}
      </Txt>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, gap: spacing.lg, marginTop: spacing.md },
  roles: { flexDirection: 'row', gap: spacing.md },
  tile: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
    padding: spacing.lg,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  tileActive: { borderColor: colors.primary, backgroundColor: colors.lightGreen },
});
