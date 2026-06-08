import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { User as UserIcon } from 'lucide-react-native';
import { Avatar, Button, Header, Input, Screen, Txt } from '@/components';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';
import { colors, spacing } from '@/theme';

export default function SetupPassenger() {
  const draft = useAuthStore((s) => s.draft);
  const login = useAuthStore((s) => s.login);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  async function finish() {
    setLoading(true);
    const user = await authService.createPassenger({
      name: name.trim(),
      phone: draft?.phone ?? '',
      email: draft?.email,
    });
    login(user, 'mock-token-' + user.id);
    setLoading(false);
    router.replace('/home');
  }

  return (
    <Screen scroll footer={<Button label="Start riding" onPress={finish} disabled={name.trim().length < 2} loading={loading} />}>
      <Header title="Set up your profile" />
      <View style={styles.body}>
        <View style={styles.avatarRow}>
          <Avatar name={name || 'New Rider'} size={72} />
          <Txt variant="caption">Add a photo later from your profile.</Txt>
        </View>
        <Input
          label="Full name"
          placeholder="e.g. Yaa Asantewaa"
          value={name}
          onChangeText={setName}
          left={<UserIcon size={18} color={colors.textMuted} />}
        />
        <Input label="Phone" value={draft?.phone ?? ''} editable={false} />
        {draft?.email ? <Input label="Email" value={draft.email} editable={false} /> : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { gap: spacing.lg, marginTop: spacing.md },
  avatarRow: { alignItems: 'center', gap: spacing.sm },
});
