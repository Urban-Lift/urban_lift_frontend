import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button, Card, Input, Screen, StarRating, Txt } from '@/components';
import { profileService } from '@/services/profileService';
import { colors, radii, spacing } from '@/theme';

const TAGS = ['Friendly', 'Safe driving', 'On time', 'Clean car', 'Great music', 'Good conversation'];

export default function RateTrip() {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const [rating, setRating] = useState(5);
  const [tags, setTags] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  function toggle(tag: string) {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  async function submit() {
    setSaving(true);
    await profileService.submitReview({ tripId: tripId!, rating, tags, note });
    setSaving(false);
    router.replace('/my-rides');
  }

  return (
    <Screen
      scroll
      footer={
        <View style={styles.actions}>
          <Button label="Submit review" onPress={submit} loading={saving} />
          <Button label="Skip" variant="ghost" onPress={() => router.replace('/my-rides')} />
        </View>
      }
    >
      <View style={styles.hero}>
        <Txt variant="h2" center>
          How was your ride?
        </Txt>
        <Txt variant="muted" center>
          Your feedback keeps the community safe and friendly.
        </Txt>
        <View style={styles.stars}>
          <StarRating rating={rating} onChange={setRating} size={40} />
        </View>
      </View>

      <Card>
        <Txt variant="h3">What went well?</Txt>
        <View style={styles.tags}>
          {TAGS.map((tag) => {
            const active = tags.includes(tag);
            return (
              <Pressable key={tag} onPress={() => toggle(tag)} style={[styles.tag, active && styles.tagActive]}>
                <Txt variant="caption" color={active ? colors.primaryDark : colors.textMuted}>
                  {tag}
                </Txt>
              </Pressable>
            );
          })}
        </View>
      </Card>

      <Input
        label="Add a note (optional)"
        placeholder="Share more about your experience…"
        value={note}
        onChangeText={setNote}
        multiline
        numberOfLines={4}
        style={styles.note}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.lg },
  stars: { marginTop: spacing.sm },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md },
  tag: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.full,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  tagActive: { borderColor: colors.primary, backgroundColor: colors.lightGreen },
  note: { minHeight: 96, textAlignVertical: 'top' },
  actions: { gap: spacing.sm },
});
