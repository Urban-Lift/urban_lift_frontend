import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { Camera, Car, Globe, Lock, Plus, Users } from 'lucide-react-native';
import { Button, Header, Input, Screen, Txt } from '@/components';
import { communityService } from '@/services/communityService';
import type { CommunityGroup } from '@/types';
import { colors, radii, spacing } from '@/theme';

const COVERS = ['#1A7A3C', '#D97706', '#2563EB', '#7C3AED'];

export default function CreateGroup() {
  const qc = useQueryClient();
  const [name, setName] = useState('');
  const [route, setRoute] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [saving, setSaving] = useState(false);

  async function create() {
    setSaving(true);
    const group = await communityService.create({ name, route, description, isPrivate, coverColor: COVERS[Math.floor(Math.random() * COVERS.length)] });
    qc.setQueryData<CommunityGroup[]>(['groups'], (old) => [group, ...(old ?? [])]);
    setSaving(false);
    router.replace(`/community/${group.id}/chat`);
  }

  return (
    <Screen
      scroll
      footer={<Button label="Create Group" icon={<Plus size={18} color={colors.onPrimary} />} onPress={create} loading={saving} disabled={name.trim().length < 3 || !route} />}
    >
      <Header title="Create Community Group" />

      <Pressable style={styles.cover}>
        <View style={styles.coverIcon}><Camera size={22} color={colors.forest} /></View>
        <Txt variant="bodyStrong">Upload Cover Image</Txt>
        <Txt variant="caption">Tap to browse gallery</Txt>
      </Pressable>

      <View style={styles.body}>
        <Input label="Group Name" placeholder="e.g., East Legon Commuters" value={name} onChangeText={setName} left={<Users size={18} color={colors.textMuted} />} />
        <Input label="Primary Route" placeholder="e.g., East Legon to Circle" value={route} onChangeText={setRoute} left={<Car size={18} color={colors.textMuted} />} />

        <View style={styles.privacy}>
          <Txt variant="label">Privacy Settings</Txt>
          <View style={styles.privacyRow}>
            <PrivacyCard active={!isPrivate} onPress={() => setIsPrivate(false)} icon={<Globe size={20} color={!isPrivate ? colors.forest : colors.textMuted} />} title="Public" sub="Anyone can find and join this group." />
            <PrivacyCard active={isPrivate} onPress={() => setIsPrivate(true)} icon={<Lock size={20} color={isPrivate ? colors.forest : colors.textMuted} />} title="Private" sub="Invite only. Hidden from search." />
          </View>
        </View>

        <Input label="Description" placeholder="Describe your community group, rules, and schedule…" value={description} onChangeText={setDescription} multiline numberOfLines={4} style={styles.textArea} />
      </View>
    </Screen>
  );
}

function PrivacyCard({ active, onPress, icon, title, sub }: { active: boolean; onPress: () => void; icon: React.ReactNode; title: string; sub: string }) {
  return (
    <Pressable onPress={onPress} style={[styles.privacyCard, active && styles.privacyCardActive]}>
      <View style={styles.privacyHead}>
        {icon}
        <View style={[styles.radio, active && styles.radioOn]}>{active ? <View style={styles.radioDot} /> : null}</View>
      </View>
      <Txt variant="bodyStrong" color={active ? colors.forest : colors.text}>{title}</Txt>
      <Txt variant="caption">{sub}</Txt>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cover: {
    height: 150,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  coverIcon: { width: 44, height: 44, borderRadius: radii.full, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xs },
  body: { gap: spacing.lg, marginTop: spacing.lg },
  privacy: { gap: spacing.sm },
  privacyRow: { flexDirection: 'row', gap: spacing.md },
  privacyCard: { flex: 1, gap: 4, padding: spacing.lg, borderRadius: radii.md, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface },
  privacyCardActive: { borderColor: colors.primary, backgroundColor: colors.mint },
  privacyHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  radioOn: { borderColor: colors.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  textArea: { minHeight: 96, textAlignVertical: 'top' },
});
