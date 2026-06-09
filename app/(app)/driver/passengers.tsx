import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Switch, View } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, HelpCircle, Inbox, Menu } from 'lucide-react-native';
import { Avatar, Badge, Button, Card, EmptyState, Screen, SkeletonCard, StarRating, Txt } from '@/components';
import { driverService } from '@/services/driverService';
import { useDriverStore } from '@/store/driverStore';
import type { RideRequest } from '@/types';
import { ghs } from '@/utils/format';
import { colors, radii, spacing } from '@/theme';

type Sort = 'distance' | 'earnings';

export default function MatchingPassengers() {
  const acceptRequest = useDriverStore((s) => s.acceptRequest);
  const online = useDriverStore((s) => s.online);
  const setOnline = useDriverStore((s) => s.setOnline);
  const [sort, setSort] = useState<Sort>('distance');
  const { data, isLoading } = useQuery({ queryKey: ['incoming'], queryFn: driverService.incomingRequests });

  const requests = useMemo(() => {
    const list = [...(data ?? [])];
    list.sort((a, b) => (sort === 'distance' ? a.distanceKm - b.distanceKm : b.estEarnings - a.estEarnings));
    return list;
  }, [data, sort]);

  async function accept(req: RideRequest) {
    await driverService.respond(req.id, true);
    acceptRequest(req);
    router.push(`/driver/navigate/${req.id}`);
  }

  return (
    <Screen padded={false}>
      <View style={styles.topbar}>
        <Pressable style={styles.menu}><Menu size={20} color={colors.forest} /></Pressable>
        <Txt variant="h3">Matching Passengers</Txt>
        <View style={styles.help}>
          <Txt variant="captionStrong" color={colors.textMuted}>Help</Txt>
          <HelpCircle size={16} color={colors.textMuted} />
        </View>
      </View>

      <View style={styles.statusCard}>
        <Card style={styles.statusInner}>
          <View style={styles.flex}>
            <Txt variant="bodyStrong">Driver Status</Txt>
            <Txt variant="caption">{online ? 'Receiving ride requests' : 'Go Online to start receiving requests'}</Txt>
          </View>
          <Switch value={online} onValueChange={(v) => { setOnline(v); driverService.setOnline(v); }} trackColor={{ true: colors.primary, false: colors.border }} thumbColor={colors.white} />
        </Card>
      </View>

      <View style={styles.chips}>
        {(['distance', 'earnings'] as Sort[]).map((k) => {
          const active = k === sort;
          return (
            <Pressable key={k} onPress={() => setSort(k)} style={[styles.chip, active && styles.chipActive]}>
              <Txt variant="captionStrong" color={active ? colors.forest : colors.textMuted}>{k === 'distance' ? 'Distance' : 'Earnings'}</Txt>
              <ChevronDown size={15} color={active ? colors.forest : colors.textMuted} />
            </Pressable>
          );
        })}
      </View>

      <View style={styles.listHead}>
        <Txt variant="bodyStrong">Requests on your route</Txt>
        <Txt variant="overline">Showing {requests.length} matches nearby</Txt>
      </View>

      {isLoading ? (
        <View style={styles.list}><SkeletonCard /><SkeletonCard /></View>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(r) => r.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Card>
              <View style={styles.head}>
                <View style={styles.who}>
                  <Avatar name={item.passengerName} size={44} />
                  <View>
                    <Txt variant="bodyStrong">{item.passengerName}</Txt>
                    <View style={styles.rating}>
                      <StarRating rating={item.passengerRating} showValue size={12} />
                      <Txt variant="caption">· {item.seats} seats</Txt>
                    </View>
                  </View>
                </View>
                <Badge label={ghs(item.estEarnings)} tone="success" />
              </View>

              <View style={styles.route}>
                <View style={styles.point}>
                  <View style={styles.ring} />
                  <View style={styles.flex}>
                    <Txt variant="caption">Pickup</Txt>
                    <Txt variant="bodyStrong">{item.pickup}</Txt>
                  </View>
                </View>
                <View style={styles.line} />
                <View style={styles.point}>
                  <View style={styles.pin} />
                  <View style={styles.flex}>
                    <Txt variant="caption">Drop-off</Txt>
                    <Txt variant="bodyStrong">{item.dropoff}</Txt>
                  </View>
                </View>
              </View>

              <View style={styles.actions}>
                <View style={styles.flex}><Button label="Ignore" variant="outline" onPress={() => driverService.respond(item.id, false)} /></View>
                <View style={styles.flex}><Button label="Accept Request" onPress={() => accept(item)} /></View>
              </View>
            </Card>
          )}
          ListEmptyComponent={<EmptyState icon={<Inbox size={30} color={colors.forest} />} title="No requests right now" message="Stay online — new requests appear here." />}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  topbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.xl, paddingVertical: spacing.md },
  menu: { width: 38, height: 38, borderRadius: radii.full, backgroundColor: colors.lightGreen, alignItems: 'center', justifyContent: 'center' },
  help: { flexDirection: 'row', alignItems: 'center', gap: 4, width: 38, justifyContent: 'flex-end' },
  statusCard: { paddingHorizontal: spacing.xl, paddingBottom: spacing.md },
  statusInner: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1 },
  chips: { flexDirection: 'row', paddingHorizontal: spacing.xl, gap: spacing.sm, paddingBottom: spacing.md },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radii.full, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface },
  chipActive: { borderColor: colors.primary, backgroundColor: colors.lightGreen },
  listHead: { paddingHorizontal: spacing.xl, gap: 2, paddingBottom: spacing.sm },
  list: { paddingHorizontal: spacing.xl, gap: spacing.md, paddingBottom: spacing.xl },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  who: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  rating: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  route: { gap: 2, marginTop: spacing.md },
  point: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  ring: { width: 14, height: 14, borderRadius: 7, borderWidth: 3, borderColor: colors.primary, marginTop: 2 },
  pin: { width: 14, height: 14, borderRadius: 7, backgroundColor: colors.gold, marginTop: 2 },
  line: { width: 2, height: 16, backgroundColor: colors.border, marginLeft: 6 },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
});
