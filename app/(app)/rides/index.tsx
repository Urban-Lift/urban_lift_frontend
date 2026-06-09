import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, Map, SearchX, SlidersHorizontal } from 'lucide-react-native';
import { EmptyState, Header, RideCard, Screen, SkeletonCard, Txt } from '@/components';
import { rideService } from '@/services/rideService';
import { useRideStore } from '@/store/rideStore';
import type { Ride } from '@/types';
import { colors, radii, shadow, spacing } from '@/theme';

type Sort = 'route' | 'time' | 'price' | 'seats';
const FILTERS: { key: Sort; label: string }[] = [
  { key: 'route', label: 'Route' },
  { key: 'time', label: 'Time' },
  { key: 'price', label: 'Price' },
  { key: 'seats', label: 'Seats' },
];

export default function AvailableRides() {
  const searchParams = useRideStore((s) => s.searchParams);
  const selectRide = useRideStore((s) => s.selectRide);
  const [sort, setSort] = useState<Sort>('time');

  const { data, isLoading } = useQuery({
    queryKey: ['rides', searchParams],
    queryFn: () => rideService.search(searchParams),
  });

  const rides = useMemo(() => {
    const list = [...(data ?? [])];
    if (sort === 'price') list.sort((a, b) => a.pricePerSeat - b.pricePerSeat);
    else if (sort === 'seats') list.sort((a, b) => b.seatsAvailable - a.seatsAvailable);
    else list.sort((a, b) => +new Date(a.departAt) - +new Date(b.departAt));
    return list;
  }, [data, sort]);

  function open(ride: Ride) {
    selectRide(ride);
    router.push(`/rides/${ride.id}`);
  }

  const routeLabel =
    searchParams.origin || searchParams.destination
      ? `${searchParams.origin ?? 'Anywhere'} → ${searchParams.destination ?? 'Anywhere'}`
      : 'All rides near you';

  return (
    <Screen padded={false}>
      <Header
        title="Available Rides"
        subtitle={routeLabel}
        right={<SlidersHorizontal size={22} color={colors.text} />}
      />

      <View style={styles.chips}>
        {FILTERS.map((f) => {
          const active = f.key === sort;
          return (
            <Pressable key={f.key} onPress={() => setSort(f.key)} style={[styles.chip, active && styles.chipActive]}>
              <Txt variant="captionStrong" color={active ? colors.forest : colors.textMuted}>{f.label}</Txt>
              <ChevronDown size={15} color={active ? colors.forest : colors.textMuted} />
            </Pressable>
          );
        })}
      </View>

      {isLoading ? (
        <View style={styles.list}>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      ) : (
        <FlatList
          data={rides}
          keyExtractor={(r) => r.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <RideCard ride={item} onPress={() => open(item)} />}
          ListEmptyComponent={
            <EmptyState
              icon={<SearchX size={32} color={colors.forest} />}
              title="No rides found"
              message="Try a different pickup or destination, or check back in a few minutes."
            />
          }
        />
      )}

      {rides.length > 0 && !isLoading ? (
        <Pressable style={styles.mapBtn} onPress={() => {}}>
          <Map size={18} color={colors.white} />
          <Txt variant="bodyStrong" color={colors.white}>Map View</Txt>
        </Pressable>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', paddingHorizontal: spacing.xl, gap: spacing.sm, paddingBottom: spacing.sm },
  chip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: spacing.sm,
    borderRadius: radii.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: { borderColor: colors.primary, backgroundColor: colors.lightGreen },
  list: { padding: spacing.xl, paddingTop: spacing.sm, gap: spacing.md, paddingBottom: 90 },
  mapBtn: {
    position: 'absolute',
    bottom: spacing.xl,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.textStrong,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radii.full,
    ...shadow.floating,
  },
});
