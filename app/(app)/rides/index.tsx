import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { SearchX } from 'lucide-react-native';
import { EmptyState, Header, RideCard, Screen, SkeletonCard, Txt } from '@/components';
import { FilterChips } from '@/features/passenger/FilterChips';
import { rideService } from '@/services/rideService';
import { useRideStore } from '@/store/rideStore';
import type { Ride } from '@/types';
import { spacing } from '@/theme';

type Sort = 'soonest' | 'cheapest' | 'seats';

export default function AvailableRides() {
  const searchParams = useRideStore((s) => s.searchParams);
  const selectRide = useRideStore((s) => s.selectRide);
  const [sort, setSort] = useState<Sort>('soonest');

  const { data, isLoading } = useQuery({
    queryKey: ['rides', searchParams],
    queryFn: () => rideService.search(searchParams),
  });

  const rides = useMemo(() => {
    const list = [...(data ?? [])];
    if (sort === 'cheapest') list.sort((a, b) => a.pricePerSeat - b.pricePerSeat);
    if (sort === 'seats') list.sort((a, b) => b.seatsAvailable - a.seatsAvailable);
    if (sort === 'soonest') list.sort((a, b) => +new Date(a.departAt) - +new Date(b.departAt));
    return list;
  }, [data, sort]);

  function open(ride: Ride) {
    selectRide(ride);
    router.push(`/rides/${ride.id}`);
  }

  return (
    <Screen padded={false}>
      <Header
        title="Available rides"
        subtitle={
          searchParams.origin || searchParams.destination
            ? `${searchParams.origin ?? 'Anywhere'} → ${searchParams.destination ?? 'Anywhere'}`
            : 'All rides near you'
        }
      />
      <FilterChips
        options={[
          { key: 'soonest', label: 'Soonest' },
          { key: 'cheapest', label: 'Cheapest' },
          { key: 'seats', label: 'Most seats' },
        ]}
        value={sort}
        onChange={(k) => setSort(k as Sort)}
      />

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
              icon={<SearchX size={32} color="#1A7A3C" />}
              title="No rides found"
              message="Try a different pickup or destination, or check back in a few minutes."
            />
          }
          ListHeaderComponent={
            rides.length ? <Txt variant="caption">{rides.length} rides available</Txt> : null
          }
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.xl, gap: spacing.md },
});
