import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { CalendarClock } from 'lucide-react-native';
import {
  Button,
  Card,
  EmptyState,
  Header,
  RouteLine,
  Screen,
  SkeletonCard,
  StatusBadge,
  Txt,
} from '@/components';
import { rideService } from '@/services/rideService';
import type { Booking } from '@/types';
import { departLabel, ghs } from '@/utils/format';
import { colors, radii, spacing } from '@/theme';

type Tab = 'upcoming' | 'past';

export default function MyRides() {
  const [tab, setTab] = useState<Tab>('upcoming');
  const { data, isLoading } = useQuery({ queryKey: ['bookings'], queryFn: rideService.myBookings });

  const filtered = useMemo(() => {
    const list = data ?? [];
    return tab === 'upcoming'
      ? list.filter((b) => b.status === 'confirmed' || b.status === 'pending')
      : list.filter((b) => b.status === 'completed' || b.status === 'cancelled');
  }, [data, tab]);

  return (
    <Screen padded={false}>
      <Header title="My rides" back={false} />
      <View style={styles.segment}>
        {(['upcoming', 'past'] as Tab[]).map((t) => (
          <Pressable key={t} onPress={() => setTab(t)} style={[styles.segBtn, tab === t && styles.segActive]}>
            <Txt variant="bodyStrong" color={tab === t ? colors.primaryDark : colors.textMuted}>
              {t === 'upcoming' ? 'Upcoming' : 'Past'}
            </Txt>
          </Pressable>
        ))}
      </View>

      {isLoading ? (
        <View style={styles.list}>
          <SkeletonCard />
          <SkeletonCard />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(b) => b.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <BookingItem booking={item} tab={tab} />}
          ListEmptyComponent={
            <EmptyState
              icon={<CalendarClock size={30} color="#1A7A3C" />}
              title={tab === 'upcoming' ? 'No upcoming rides' : 'No past rides yet'}
              message={tab === 'upcoming' ? 'Book a ride and it will show up here.' : 'Completed and cancelled rides appear here.'}
              action={tab === 'upcoming' ? <Button label="Find a ride" onPress={() => router.push('/home')} /> : undefined}
            />
          }
        />
      )}
    </Screen>
  );
}

function BookingItem({ booking, tab }: { booking: Booking; tab: Tab }) {
  return (
    <Card>
      <View style={styles.cardHeader}>
        <Txt variant="bodyStrong">{booking.ride.driver.name}</Txt>
        <StatusBadge status={booking.status} />
      </View>
      <RouteLine origin={booking.pickup} destination={booking.dropoff} />
      <View style={styles.cardFooter}>
        <Txt variant="caption">{departLabel(booking.ride.departAt)}</Txt>
        <Txt variant="bodyStrong" color={colors.primary}>
          {ghs(booking.totalPrice)}
        </Txt>
      </View>
      {tab === 'upcoming' && booking.status === 'confirmed' ? (
        <View style={styles.action}>
          <Button label="Track ride" size="sm" onPress={() => router.push(`/tracking/${booking.id}`)} />
        </View>
      ) : null}
      {tab === 'past' && booking.status === 'completed' ? (
        <View style={styles.action}>
          <Button label="Rate trip" size="sm" variant="outline" onPress={() => router.push(`/rate/${booking.id}`)} />
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  segment: {
    flexDirection: 'row',
    margin: spacing.xl,
    marginBottom: spacing.sm,
    backgroundColor: colors.borderLight,
    borderRadius: radii.md,
    padding: 4,
  },
  segBtn: { flex: 1, alignItems: 'center', paddingVertical: spacing.sm, borderRadius: radii.sm },
  segActive: { backgroundColor: colors.surface },
  list: { padding: spacing.xl, paddingTop: spacing.sm, gap: spacing.md },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.md },
  action: { marginTop: spacing.md },
});
