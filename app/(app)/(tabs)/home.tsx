import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Circle, MapPin, Minus, Plus } from 'lucide-react-native';
import { Button, Card, Input, Screen, Txt } from '@/components';
import { useAuthStore } from '@/store/authStore';
import { useRideStore } from '@/store/rideStore';
import { colors, radii, spacing } from '@/theme';

type TripType = 'one-way' | 'round';

export default function PassengerHome() {
  const user = useAuthStore((s) => s.user);
  const setSearchParams = useRideStore((s) => s.setSearchParams);

  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [seats, setSeats] = useState(1);
  const [tripType, setTripType] = useState<TripType>('one-way');

  function search() {
    setSearchParams({ origin: origin || undefined, destination: destination || undefined, seats });
    router.push('/rides');
  }

  return (
    <Screen scroll>
      <View style={styles.greeting}>
        <Txt variant="caption">Good day,</Txt>
        <Txt variant="h2">{user?.name?.split(' ')[0] ?? 'Rider'} 👋</Txt>
        <Txt variant="muted">Where are you heading today?</Txt>
      </View>

      <Card>
        <Input
          label="Pickup"
          placeholder="East Legon"
          value={origin}
          onChangeText={setOrigin}
          left={<Circle size={14} color={colors.primary} fill={colors.primary} />}
        />
        <View style={styles.gap} />
        <Input
          label="Destination"
          placeholder="Airport City"
          value={destination}
          onChangeText={setDestination}
          left={<MapPin size={16} color={colors.warning} />}
        />

        <View style={styles.gap} />
        <Txt variant="label">Seats</Txt>
        <View style={styles.stepperRow}>
          <Stepper value={seats} onChange={setSeats} />
          <View style={styles.tripTypes}>
            {(['one-way', 'round'] as TripType[]).map((t) => (
              <Pressable
                key={t}
                onPress={() => setTripType(t)}
                style={[styles.chip, tripType === t && styles.chipActive]}
              >
                <Txt variant="caption" color={tripType === t ? colors.primaryDark : colors.textMuted}>
                  {t === 'one-way' ? 'One-way' : 'Round trip'}
                </Txt>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.gap} />
        <Button label="Find a ride" onPress={search} />
      </Card>

      <Card>
        <Txt variant="h3">Popular routes</Txt>
        {[
          ['Madina', 'Legon Campus'],
          ['East Legon', 'Airport City'],
          ['Osu', 'Tema'],
        ].map(([from, to]) => (
          <Pressable
            key={from + to}
            style={styles.popular}
            onPress={() => {
              setOrigin(from);
              setDestination(to);
            }}
          >
            <MapPin size={16} color={colors.textMuted} />
            <Txt variant="body">
              {from} → {to}
            </Txt>
          </Pressable>
        ))}
      </Card>
    </Screen>
  );
}

function Stepper({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <View style={styles.stepper}>
      <Pressable onPress={() => onChange(Math.max(1, value - 1))} style={styles.stepBtn} hitSlop={6}>
        <Minus size={16} color={colors.text} />
      </Pressable>
      <Txt variant="bodyStrong">{value}</Txt>
      <Pressable onPress={() => onChange(Math.min(4, value + 1))} style={styles.stepBtn} hitSlop={6}>
        <Plus size={16} color={colors.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  greeting: { gap: 2 },
  gap: { height: spacing.md },
  stepperRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.xs },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  stepBtn: {
    width: 34,
    height: 34,
    borderRadius: radii.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tripTypes: { flexDirection: 'row', gap: spacing.xs },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.full,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  chipActive: { borderColor: colors.primary, backgroundColor: colors.lightGreen },
  popular: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.md },
});
