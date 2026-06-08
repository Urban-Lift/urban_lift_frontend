import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Inbox } from 'lucide-react-native';
import {
  Avatar,
  Button,
  Card,
  EmptyState,
  Header,
  RouteLine,
  Screen,
  SkeletonCard,
  StarRating,
  Txt,
} from '@/components';
import { FilterChips } from '@/features/passenger/FilterChips';
import { driverService } from '@/services/driverService';
import { useDriverStore } from '@/store/driverStore';
import type { RideRequest } from '@/types';
import { ghs } from '@/utils/format';
import { colors, spacing } from '@/theme';

type Sort = 'nearest' | 'earnings';

export default function MatchingPassengers() {
  const acceptRequest = useDriverStore((s) => s.acceptRequest);
  const [sort, setSort] = useState<Sort>('nearest');
  const { data, isLoading } = useQuery({ queryKey: ['incoming'], queryFn: driverService.incomingRequests });

  const requests = useMemo(() => {
    const list = [...(data ?? [])];
    list.sort((a, b) => (sort === 'nearest' ? a.distanceKm - b.distanceKm : b.estEarnings - a.estEarnings));
    return list;
  }, [data, sort]);

  async function accept(req: RideRequest) {
    await driverService.respond(req.id, true);
    acceptRequest(req);
    router.push(`/driver/navigate/${req.id}`);
  }

  return (
    <Screen padded={false}>
      <Header title="Ride requests" subtitle="Passengers matched to your route" />
      <FilterChips
        options={[
          { key: 'nearest', label: 'Nearest' },
          { key: 'earnings', label: 'Highest earnings' },
        ]}
        value={sort}
        onChange={(k) => setSort(k as Sort)}
      />

      {isLoading ? (
        <View style={styles.list}>
          <SkeletonCard />
          <SkeletonCard />
        </View>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(r) => r.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Card>
              <View style={styles.head}>
                <View style={styles.passenger}>
                  <Avatar name={item.passengerName} size={40} />
                  <View>
                    <Txt variant="bodyStrong">{item.passengerName}</Txt>
                    <StarRating rating={item.passengerRating} showValue size={13} />
                  </View>
                </View>
                <View style={styles.earn}>
                  <Txt variant="h3" color={colors.primary}>
                    {ghs(item.estEarnings)}
                  </Txt>
                  <Txt variant="caption">{item.distanceKm} km away</Txt>
                </View>
              </View>
              <RouteLine origin={item.pickup} destination={item.dropoff} />
              <View style={styles.actions}>
                <View style={styles.flex}>
                  <Button label="Ignore" variant="outline" size="sm" onPress={() => driverService.respond(item.id, false)} />
                </View>
                <View style={styles.flex}>
                  <Button label="Accept" size="sm" onPress={() => accept(item)} />
                </View>
              </View>
            </Card>
          )}
          ListEmptyComponent={
            <EmptyState icon={<Inbox size={30} color="#1A7A3C" />} title="No requests right now" message="Stay online — new requests appear here." />
          }
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.xl, paddingTop: spacing.sm, gap: spacing.md },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  passenger: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  earn: { alignItems: 'flex-end' },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  flex: { flex: 1 },
});
