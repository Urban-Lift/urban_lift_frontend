import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Camera } from 'lucide-react-native';
import { Avatar, Button, Header, Input, Screen, Txt } from '@/components';
import { useAuthStore } from '@/store/authStore';
import { profileService } from '@/services/profileService';
import { apiError } from '@/services/api';
import { pickImage } from '@/utils/image';
import { colors, radii, spacing } from '@/theme';

export default function EditProfile() {
  const user = useAuthStore((s) => s.user);
  const patchUser = useAuthStore((s) => s.patchUser);
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [emergency, setEmergency] = useState(user?.emergencyContact ?? '');
  const [photoUri, setPhotoUri] = useState<string | undefined>(user?.avatarUrl);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();

  async function changePhoto() {
    const uri = await pickImage();
    if (uri) setPhotoUri(uri);
  }

  async function save() {
    setSaving(true);
    setError(undefined);
    try {
      await profileService.updateProfile({
        fullName: name,
        email,
        emergencyNumber: emergency,
        photoUri: photoUri !== user?.avatarUrl ? photoUri : undefined,
      });
      patchUser({ name, email, emergencyContact: emergency, avatarUrl: photoUri });
      router.back();
    } catch (e) {
      setError(apiError(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen scroll footer={<Button label="Save changes" onPress={save} loading={saving} disabled={name.trim().length < 2} />}>
      <Header title="Edit profile" />
      <View style={styles.body}>
        <Pressable style={styles.avatarWrap} onPress={changePhoto}>
          <Avatar name={name || 'User'} uri={photoUri} size={88} />
          <View style={styles.cameraBadge}>
            <Camera size={16} color={colors.white} />
          </View>
        </Pressable>
        <Txt variant="caption" center>
          Tap to change photo
        </Txt>
        {error ? <Txt variant="caption" center color={colors.error}>{error}</Txt> : null}

        <Input label="Full name" value={name} onChangeText={setName} />
        <Input label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <Input label="Phone" value={user?.phone ?? ''} editable={false} />
        <Input
          label="Emergency contact"
          placeholder="+233 24 000 0000"
          value={emergency}
          onChangeText={setEmergency}
          keyboardType="phone-pad"
          hint="Shared with the safety team if you trigger SOS."
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { gap: spacing.lg, marginTop: spacing.md },
  avatarWrap: { alignSelf: 'center' },
  cameraBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 30,
    height: 30,
    borderRadius: radii.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
});
