import { useState } from 'react';
import { Pressable, StyleSheet, Switch, View } from 'react-native';
import { router } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { Users } from 'lucide-react-native';
import { Button, Card, Header, Input, Screen, Txt } from '@/components';
import { communityService } from '@/services/communityService';
import type { CommunityGroup } from '@/types';
import { colors, radii, spacing } from '@/theme';

const COVERS = ['#1A7A3C', '#D97706', '#2563EB', '#7C3AED', '#DC2626', '#0891B2'];

export default function CreateGroup() {
  const qc = useQueryClient();
  const [name, setName] = useState('');
  const [route, setRoute] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [cover, setCover] = useState(COVERS[0]);
  const [saving, setSaving] = useState(false);

  async function create() {
    setSaving(true);
    const group = await communityService.create({ name, route, description, isPrivate, coverColor: cover });
    qc.setQueryData<CommunityGroup[]>(['groups'], (old) => [group, ...(old ?? [])]);
    setSaving(false);
    router.replace(`/community/${group.id}/chat`);
  }

  return (
    <Screen scroll footer={<Button label="Create group" onPress={create} loading={saving} disabled={name.trim().length < 3 || !route} />}>
      <Header title="Create a group" />
      <View style={styles.body}>
        <View style={[styles.cover, { backgroundColor: cover }]}>
          <Users size={36} color={colors.white} />
        </View>
        <View style={styles.swatches}>
          {COVERS.map((c) => (
            <Pressable key={c} onPress={() => setCover(c)} style={[styles.swatch, { backgroundColor: c }, cover === c && styles.swatchActive]} />
          ))}
        </View>

        <Input label="Group name" placeholder="e.g. Spintex Movers" value={name} onChangeText={setName} />
        <Input label="Primary route" placeholder="Spintex ↔ Circle" value={route} onChangeText={setRoute} />
        <Input
          label="Description"
          placeholder="What is this group about?"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          style={styles.textArea}
        />

        <Card style={styles.privacyRow}>
          <View style={styles.flex}>
            <Txt variant="bodyStrong">Private group</Txt>
            <Txt variant="caption">Members must be approved before joining.</Txt>
          </View>
          <Switch value={isPrivate} onValueChange={setIsPrivate} trackColor={{ true: colors.primary, false: colors.border }} thumbColor={colors.white} />
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { gap: spacing.lg, marginTop: spacing.md },
  cover: { height: 96, borderRadius: radii.lg, alignItems: 'center', justifyContent: 'center' },
  swatches: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'center' },
  swatch: { width: 32, height: 32, borderRadius: radii.full, borderWidth: 2, borderColor: 'transparent' },
  swatchActive: { borderColor: colors.text },
  textArea: { minHeight: 72, textAlignVertical: 'top' },
  privacyRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1, gap: 2 },
});
