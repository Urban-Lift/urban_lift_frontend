import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { IdCard, User as UserIcon } from 'lucide-react-native';
import { Button, Header, Input, Screen, Txt } from '@/components';
import { useAuthStore } from '@/store/authStore';
import { colors, spacing } from '@/theme';

/** Driver setup — step 1 of 2: personal info. Vehicle details follow. */
export default function SetupDriverPersonal() {
  const draft = useAuthStore((s) => s.draft);
  const updateDraft = useAuthStore((s) => s.updateDraft);
  const [name, setName] = useState('');
  const [license, setLicense] = useState('');

  function next() {
    updateDraft({ name: name.trim() });
    router.push('/setup-driver-vehicle');
  }

  return (
    <Screen scroll footer={<Button label="Next: vehicle details" onPress={next} disabled={name.trim().length < 2 || license.length < 4} />}>
      <Header title="Driver setup" subtitle="Step 1 of 2 · Personal info" />
      <View style={styles.body}>
        <Txt variant="muted">Tell us who you are. We verify drivers before they go live.</Txt>
        <Input
          label="Full name"
          placeholder="e.g. Kwame Mensah"
          value={name}
          onChangeText={setName}
          left={<UserIcon size={18} color={colors.textMuted} />}
        />
        <Input
          label="Driver's licence number"
          placeholder="GHA-DL-0000000"
          autoCapitalize="characters"
          value={license}
          onChangeText={setLicense}
          left={<IdCard size={18} color={colors.textMuted} />}
        />
        <Input label="Phone" value={draft?.phone ?? ''} editable={false} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { gap: spacing.lg, marginTop: spacing.md },
});
