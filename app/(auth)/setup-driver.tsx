import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { ArrowRight, Camera, IdCard, Mail, User as UserIcon } from 'lucide-react-native';
import { Avatar, Button, Header, Input, Screen, Txt } from '@/components';
import { useAuthStore } from '@/store/authStore';
import { colors, radii, spacing } from '@/theme';

/** Driver setup — step 1 of 2: personal info. Vehicle details follow. */
export default function SetupDriverPersonal() {
  const draft = useAuthStore((s) => s.draft);
  const updateDraft = useAuthStore((s) => s.updateDraft);
  const [name, setName] = useState('');
  const [email, setEmail] = useState(draft?.email ?? '');
  const [emergency, setEmergency] = useState('');

  function next() {
    updateDraft({ name: name.trim(), email });
    router.push('/setup-driver-vehicle');
  }

  return (
    <Screen scroll footer={<Button label="Next: Vehicle Details" icon={<ArrowRight size={20} color={colors.onPrimary} />} onPress={next} disabled={name.trim().length < 2} />}>
      <Header title="Complete Profile" subtitle="Step 1 of 2" />
      <View style={styles.avatarBlock}>
        <Pressable style={styles.avatarWrap}>
          <Avatar name={name || 'Driver'} size={92} />
          <View style={styles.cameraBadge}>
            <Camera size={16} color={colors.white} />
          </View>
        </Pressable>
        <Txt variant="h2" center style={styles.photoTitle}>Add a Profile Photo</Txt>
        <Txt variant="caption" center>Help passengers identify you</Txt>
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
