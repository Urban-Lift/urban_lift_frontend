import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { ArrowRight, Camera, IdCard, Mail, User as UserIcon } from 'lucide-react-native';
import { Avatar, Button, Header, Input, Screen, Txt } from '@/components';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';
import { colors, radii, spacing } from '@/theme';

export default function SetupPassenger() {
  const draft = useAuthStore((s) => s.draft);
  const login = useAuthStore((s) => s.login);
  const [name, setName] = useState('');
  const [email, setEmail] = useState(draft?.email ?? '');
  const [emergency, setEmergency] = useState('');
  const [loading, setLoading] = useState(false);

  async function finish() {
    setLoading(true);
    const user = await authService.createPassenger({ name: name.trim(), phone: draft?.phone ?? '', email });
    login({ ...user, emergencyContact: emergency }, 'mock-token-' + user.id);
    setLoading(false);
    router.replace('/home');
  }

  return (
    <Screen scroll footer={<Button label="Create Account" icon={<ArrowRight size={20} color={colors.onPrimary} />} onPress={finish} disabled={name.trim().length < 2} loading={loading} />}>
      <Header title="Complete Profile" />
      <View style={styles.avatarBlock}>
        <Pressable style={styles.avatarWrap}>
          <Avatar name={name || 'New Rider'} size={92} />
          <View style={styles.cameraBadge}>
            <Camera size={16} color={colors.white} />
          </View>
        </Pressable>
        <Txt variant="h2" center style={styles.photoTitle}>Add a Profile Photo</Txt>
        <Txt variant="caption" center>Help drivers identify you for pickup</Txt>
      </View>

      <View style={styles.body}>
        <Input label="Full Name" placeholder="Kwame Mensah" value={name} onChangeText={setName} left={<UserIcon size={18} color={colors.textMuted} />} />
        <Input label="Email (Optional)" placeholder="kwame@example.com" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" left={<Mail size={18} color={colors.textMuted} />} />
        <Input
          label="Emergency Contact Number"
          placeholder="XX XXX XXXX"
          value={emergency}
          onChangeText={setEmergency}
          keyboardType="phone-pad"
          left={<View style={styles.prefix}><Txt style={styles.flag}>🇬🇭</Txt><Txt variant="captionStrong">+233</Txt></View>}
          right={<IdCard size={18} color={colors.textLight} />}
          hint="We'll only share ride details with this contact during active trips."
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  avatarBlock: { alignItems: 'center', gap: spacing.xs, marginTop: spacing.sm },
  avatarWrap: { marginBottom: spacing.sm },
  cameraBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 30,
    height: 30,
    borderRadius: radii.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.background,
  },
  photoTitle: { marginTop: spacing.xs },
  body: { gap: spacing.lg, marginTop: spacing.xl },
  prefix: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  flag: { fontSize: 16 },
});
