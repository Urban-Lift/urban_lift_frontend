import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { addMinutes } from 'date-fns';
import { Banknote, CalendarClock, Plus, Smartphone } from 'lucide-react-native';
import {
  Avatar,
  Button,
  Card,
  EmptyState,
  Header,
  RouteLine,
  Screen,
  Segmented,
  SkeletonCard,
  StatusBadge,
  Txt,
} from '@/components';
import { rideService } from '@/services/rideService';
import type { Booking } from '@/types';
import { clockTime, departLabel, ghs } from '@/utils/format';
import { colors, radii, spacing } from '@/theme';

type Tab = 'upcoming' | 'past';

export default function MyRides() {
  const [tab, setTab] = useState<Tab>('upcoming');
  const { data, isLoading } = useQuery({ queryKey: ['bookings'], queryFn: rideService.myBookings });
  const { data: history, isLoading: historyLoading } = useQuery({
    queryKey: ['ride-history'],
    queryFn: rideService.history,
    enabled: tab === 'past',
  });

  const filtered = useMemo(() => {
    if (tab === 'past') return history ?? [];
    return (data ?? []).filter((b) => b.status === 'confirmed' || b.status === 'pending');
  }, [data, history, tab]);

  const loading = tab === 'past' ? historyLoading : isLoading;

  return (
    <Screen padded={false}>
      <Header title="My Rides" back={false} />
      <View style={styles.segment}>
        <Segmented
          value={tab}
          onChange={setTab}
          options={[
            { key: 'upcoming', label: 'Upcoming' },
            { key: 'past', label: 'Past' },
          ]}
        />
      </View>

      {loading ? (
        <View style={styles.list}>
          <SkeletonCard />
          <SkeletonCard />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(b) => b.id}
          contentContainerStyle={styles.list}
          renderItem={({ item, index }) => <BookingItem booking={item} tab={tab} index={index} />}
          ListEmptyComponent={
            <EmptyState
              icon={<CalendarClock size={30} color={colors.forest} />}
              title={tab === 'upcoming' ? 'No upcoming rides' : 'No past rides yet'}
              message={tab === 'upcoming' ? 'Book a ride and it will show up here.' : 'Completed and cancelled rides appear here.'}
            />
          }
          ListFooterComponent={tab === 'upcoming' ? <PromoCard /> : null}
        />
      )}
    </Screen>
  );
}

function BookingItem({ booking, tab, index }: { booking: Booking; tab: Tab; index: number }) {
  const arrival = clockTime(addMinutes(new Date(booking.ride.departAt), booking.ride.durationMin).toISOString());
  const momo = index % 2 === 1;
  return (
    <Card
      onPress={
        tab === 'upcoming' && booking.status === 'confirmed'
          ? () => router.push(`/tracking/${booking.id}`)
          : booking.status === 'completed'
            ? () => router.push(`/rate/${booking.id}`)
            : undefined
      }
    >
      <View style={styles.cardHeader}>
        <View style={styles.driverRow}>
          <Avatar name={booking.ride.driver.name} uri={booking.ride.driver.avatarUrl} size={40} />
          <View>
            <Txt variant="caption">Driver</Txt>
            <Txt variant="bodyStrong">{booking.ride.driver.name}</Txt>
          </View>
        </View>
        <StatusBadge status={booking.status} />
      </View>
      <RouteLine
        origin={booking.pickup}
        destination={booking.dropoff}
        originLabel={departLabel(booking.ride.departAt)}
        destinationLabel={`~ ${arrival}`}
        compact
      />
      <View style={styles.divider} />
      <View style={styles.cardFooter}>
        <View style={styles.pay}>
          {momo ? <Smartphone size={16} color={colors.textMuted} /> : <Banknote size={16} color={colors.textMuted} />}
          <Txt variant="caption">{momo ? 'Mobile Money' : 'Cash'}</Txt>
        </View>
        <Txt variant="h3" color={colors.forest}>{ghs(booking.totalPrice)}</Txt>
      </View>
    </Card>
  );
}

function PromoCard() {
  return (
    <View style={styles.promo}>
      <View style={styles.promoIcon}>
        <Plus size={24} color={colors.onPrimary} />
      </View>
      <Txt variant="h3" center>Need another ride?</Txt>
      <Txt variant="caption" center>Book your next trip around Accra now.</Txt>
      <View style={styles.promoBtn}>
        <Button label="Book a Ride" onPress={() => router.push('/home')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  segment: { paddingHorizontal: spacing.xl, paddingBottom: spacing.md },
  list: { paddingHorizontal: spacing.xl, gap: spacing.md, paddingBottom: spacing.xl },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  driverRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  divider: { height: 1, backgroundColor: colors.borderLight, marginVertical: spacing.md },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pay: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  promo: {
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.mint,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.lightGreen,
    padding: spacing.xl,
    marginTop: spacing.md,
  },
  promoIcon: { width: 48, height: 48, borderRadius: radii.full, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xs },
  promoBtn: { alignSelf: 'stretch', marginTop: spacing.md },
});
