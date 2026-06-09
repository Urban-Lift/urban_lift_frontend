import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { BadgeCheck, Car } from 'lucide-react-native';
import { Avatar, Badge, Button, Header, Input, Screen, StarRating, Txt } from '@/components';
import { rideService } from '@/services/rideService';
import { colors, radii, spacing } from '@/theme';

const TAGS = ['Safe driver', 'Clean car', 'Friendly', 'On time', 'Great music'];
const LABELS = ['', 'Poor', 'Fair', 'Okay', 'Good', 'Excellent'];

export default function RateTrip() {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const { data: bookings } = useQuery({ queryKey: ['bookings'], queryFn: rideService.myBookings });
  const booking = bookings?.find((b) => b.id === tripId);
  const driver = booking?.ride.driver;

  const [rating, setRating] = useState(4);
  const [tags, setTags] = useState<string[]>(['Clean car']);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  function toggle(tag: string) {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  async function submit() {
    setSaving(true);
    try {
      await rideService.review({
        rideId: booking?.ride.id ?? tripId!,
        rating,
        comment: tags.join(', '),
        note,
      });
    } catch {
      /* surface-free: still leave the screen */
    }
    setSaving(false);
    router.replace('/my-rides');
  }

  return (
    <Screen
      scroll
      footer={
        <View style={styles.actions}>
          <Button label="Submit Review" onPress={submit} loading={saving} />
          <Button label="Skip" variant="ghost" onPress={() => router.replace('/my-rides')} />
        </View>
      }
    >
      <Header title="Rate Your Trip" />

      <View style={styles.driver}>
        <View style={styles.avatarWrap}>
          <Avatar name={driver?.name ?? 'Driver'} uri={driver?.avatarUrl} size={88} />
          <View style={styles.verified}>
            <BadgeCheck size={18} color={colors.white} fill={colors.primary} />
          </View>
        </View>
        <Txt variant="h2">{driver?.name?.split(' ')[0] ?? 'Driver'}</Txt>
        {driver ? (
          <View style={styles.vehicle}>
            <Car size={14} color={colors.textMuted} />
            <Txt variant="caption">{driver.vehicle.make} {driver.vehicle.model} · {driver.vehicle.plate}</Txt>
          </View>
        ) : null}
        {booking ? <Badge label={`${booking.pickup} to ${booking.dropoff}`} tone="success" /> : null}
      </View>

      <View style={styles.rateBlock}>
        <Txt variant="h3" center>How was your ride?</Txt>
        <View style={styles.stars}>
          <StarRating rating={rating} onChange={setRating} size={40} />
        </View>
        <Txt variant="captionStrong" center color={colors.textMuted}>{LABELS[rating]}</Txt>
      </View>

      <View style={styles.tagsBlock}>
        <Txt variant="label">What went well?</Txt>
        <View style={styles.tags}>
          {TAGS.map((tag) => {
            const active = tags.includes(tag);
            return (
              <Pressable key={tag} onPress={() => toggle(tag)} style={[styles.tag, active && styles.tagActive]}>
                <Txt variant="captionStrong" color={active ? colors.forest : colors.textMuted}>{tag}</Txt>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Input label="Add a note (optional)" placeholder="Tell us more about your trip…" value={note} onChangeText={setNote} multiline numberOfLines={4} style={styles.note} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  driver: { alignItems: 'center', gap: spacing.xs, marginTop: spacing.sm },
  avatarWrap: { marginBottom: spacing.xs },
  verified: { position: 'absolute', right: -2, bottom: -2, backgroundColor: colors.primary, borderRadius: radii.full, padding: 2, borderWidth: 2, borderColor: colors.background },
  vehicle: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  rateBlock: { alignItems: 'center', gap: spacing.sm, marginTop: spacing.xl },
  stars: { marginVertical: spacing.xs },
  tagsBlock: { gap: spacing.sm, marginTop: spacing.xl },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  tag: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: radii.full, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface },
  tagActive: { borderColor: colors.primary, backgroundColor: colors.lightGreen },
  note: { minHeight: 96, textAlignVertical: 'top' },
  actions: { gap: spacing.xs },
});
