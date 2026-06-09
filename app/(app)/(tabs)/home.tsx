import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { addDays, format } from 'date-fns';
import { ChevronDown, Clock, History, LocateFixed, MapPin, Search } from 'lucide-react-native';
import { Button, Card, Screen, Segmented, Stepper, Txt } from '@/components';
import { useRideStore } from '@/store/rideStore';
import { colors, fonts, fontSize, radii, spacing } from '@/theme';

type TripType = 'one-way' | 'round';

const DAYS = Array.from({ length: 4 }).map((_, i) => addDays(new Date(), i));

export default function PassengerHome() {
  const setSearchParams = useRideStore((s) => s.setSearchParams);
  const [origin, setOrigin] = useState('Accra Mall, Tetteh Quarshie');
  const [destination, setDestination] = useState('');
  const [seats, setSeats] = useState(1);
  const [tripType, setTripType] = useState<TripType>('one-way');
  const [dayIdx, setDayIdx] = useState(0);

  function search() {
    setSearchParams({ origin: origin || undefined, destination: destination || undefined, seats });
    router.push('/rides');
  }

  return (
    <Screen scroll footer={<Button label="Search Rides" icon={<Search size={20} color={colors.onPrimary} />} onPress={search} />}>
      <Txt variant="h3" center style={styles.title}>Find a Ride</Txt>

      <Card>
        <Segmented
          value={tripType}
          onChange={setTripType}
          options={[
            { key: 'one-way', label: 'One-way' },
            { key: 'round', label: 'Round trip' },
          ]}
        />

        <View style={styles.locations}>
          <View style={styles.rail}>
            <LocateFixed size={18} color={colors.primary} />
            <View style={styles.railLine} />
            <MapPin size={18} color={colors.gold} />
          </View>
          <View style={styles.locFields}>
            <LocationField label="PICKUP LOCATION" value={origin} onChangeText={setOrigin} placeholder="Pickup location" />
            <View style={styles.fieldDivider} />
            <LocationField label="DESTINATION" value={destination} onChangeText={setDestination} placeholder="Where to?" />
          </View>
        </View>

        <View style={styles.hr} />

        <View style={styles.dateHeader}>
          <Txt variant="bodyStrong">Date & Time</Txt>
          <Txt variant="captionStrong" color={colors.forest}>See Calendar</Txt>
        </View>
        <View style={styles.days}>
          {DAYS.map((d, i) => {
            const active = i === dayIdx;
            return (
              <Pressable key={i} onPress={() => setDayIdx(i)} style={[styles.day, active && styles.dayActive]}>
                <Txt variant="caption" color={active ? colors.white : colors.textMuted}>
                  {i === 0 ? 'Today' : format(d, 'EEE')}
                </Txt>
                <Txt variant="h3" color={active ? colors.white : colors.text}>{format(d, 'd')}</Txt>
                <Txt variant="caption" color={active ? 'rgba(255,255,255,0.8)' : colors.textMuted}>
                  {format(d, 'MMM')}
                </Txt>
              </Pressable>
            );
          })}
        </View>

        <Pressable style={styles.timeRow}>
          <Clock size={18} color={colors.textMuted} />
          <Txt variant="bodyStrong" style={styles.flex}>08:30 AM</Txt>
          <ChevronDown size={18} color={colors.textMuted} />
        </Pressable>

        <View style={styles.seatsBlock}>
          <Txt variant="bodyStrong">Seats Needed</Txt>
          <Stepper value={seats} onChange={setSeats} suffix={seats > 1 ? 'Passengers' : 'Passenger'} />
        </View>
      </Card>

      <View style={styles.recentHeader}>
        <Txt variant="overline">Recent Searches</Txt>
        <Txt variant="captionStrong" color={colors.forest}>Clear All</Txt>
      </View>
      {[
        { from: 'East Legon', to: 'Osu, Oxford St', meta: '1 passenger · Yesterday' },
        { from: 'Kwame Nkrumah Circle', to: 'Spintex Road', meta: '2 passengers · 12 Oct' },
      ].map((r) => (
        <Card key={r.from} style={styles.recent} onPress={() => { setOrigin(r.from); setDestination(r.to); }}>
          <View style={styles.recentIcon}>
            <History size={18} color={colors.textMuted} />
          </View>
          <View style={styles.flex}>
            <View style={styles.recentRoute}>
              <Txt variant="bodyStrong" numberOfLines={1} style={styles.flex}>{r.from}</Txt>
              <Txt variant="caption">→</Txt>
              <Txt variant="bodyStrong" numberOfLines={1} style={styles.flex}>{r.to}</Txt>
            </View>
            <Txt variant="caption">{r.meta}</Txt>
          </View>
        </Card>
      ))}
    </Screen>
  );
}

function LocationField({ label, value, onChangeText, placeholder }: { label: string; value: string; onChangeText: (t: string) => void; placeholder: string }) {
  return (
    <View style={styles.locField}>
      <Txt variant="overline">{label}</Txt>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textLight}
        style={styles.locInput}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: { marginBottom: spacing.sm },
  flex: { flex: 1 },
  locations: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  rail: { alignItems: 'center', paddingTop: 24 },
  railLine: { width: 2, flex: 1, minHeight: 26, backgroundColor: colors.border, marginVertical: 6, borderRadius: 1 },
  locFields: { flex: 1 },
  locField: { backgroundColor: colors.surfaceAlt, borderRadius: radii.md, padding: spacing.md, gap: 2 },
  locInput: { fontFamily: fonts.semibold, fontSize: fontSize.md, color: colors.text, padding: 0 },
  fieldDivider: { height: spacing.sm },
  hr: { height: 1, backgroundColor: colors.borderLight, marginVertical: spacing.lg },
  dateHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  days: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  day: { flex: 1, alignItems: 'center', paddingVertical: spacing.md, borderRadius: radii.md, backgroundColor: colors.surfaceAlt, gap: 2 },
  dayActive: { backgroundColor: colors.textStrong },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.surfaceAlt, borderRadius: radii.md, padding: spacing.lg, marginTop: spacing.md },
  seatsBlock: { gap: spacing.sm, marginTop: spacing.lg },
  recentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.sm },
  recent: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  recentIcon: { width: 38, height: 38, borderRadius: radii.full, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  recentRoute: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
});
