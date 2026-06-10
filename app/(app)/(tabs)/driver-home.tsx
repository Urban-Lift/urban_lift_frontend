import { Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowDownLeft, Bell, Car, Clock, LocateFixed, Zap } from 'lucide-react-native';
import { Avatar, Button, Card, Gradient, MapView, Spinner, Txt } from '@/components';
import { useAuthStore } from '@/store/authStore';
import { useDriverStore } from '@/store/driverStore';
import { driverService } from '@/services/driverService';
import { ghs } from '@/utils/format';
import { colors, radii, shadow, spacing } from '@/theme';

export default function DriverDashboard() {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const online = useDriverStore((s) => s.online);
  const setOnline = useDriverStore((s) => s.setOnline);

  const { data: stats } = useQuery({ queryKey: ['driver-stats'], queryFn: driverService.getStats });
  const { data: requests } = useQuery({ queryKey: ['incoming'], queryFn: driverService.incomingRequests });
  const { data: notifs } = useQuery({ queryKey: ['driver-notifications'], queryFn: driverService.notifications });
  const { data: earnings } = useQuery({ queryKey: ['driver-transactions'], queryFn: driverService.transactions });

  if (!stats) return <Spinner />;
  const req = requests?.[0];
  const unread = (notifs ?? []).filter((n) => !n.isRead).length;

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Gradient name="hero" style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
          <View style={styles.headerTop}>
            <View>
              <Txt variant="caption" color={colors.lightGreen}>Total Earnings Today</Txt>
              <Txt variant="display" color={colors.white}>{ghs(stats.todayEarnings)}</Txt>
            </View>
            <View style={styles.headerRight}>
              <Pressable style={styles.bellBtn} onPress={() => router.push('/driver/notifications')}>
                <Bell size={20} color={colors.white} />
                {unread > 0 ? <View style={styles.bellDot} /> : null}
              </Pressable>
              <Pressable style={styles.avatarBtn} onPress={() => router.push('/profile')}>
                <Avatar name={user?.name ?? 'Driver'} uri={user?.avatarUrl} size={44} />
              </Pressable>
            </View>
          </View>

          <View style={styles.onlineCard}>
            <View style={[styles.zap, { backgroundColor: online ? colors.gold : 'rgba(255,255,255,0.2)' }]}>
              <Zap size={18} color={online ? colors.onPrimary : colors.white} fill={online ? colors.onPrimary : 'transparent'} />
            </View>
            <View style={styles.flex}>
              <Txt variant="bodyStrong" color={colors.white}>{online ? "You're Online" : "You're Offline"}</Txt>
              <Txt variant="caption" color={colors.lightGreen}>{online ? 'Finding rides nearby…' : 'Go online to start earning'}</Txt>
            </View>
            <Switch
              value={online}
              onValueChange={async (val) => {
                setOnline(val);
                await driverService.setOnline(val);
              }}
              trackColor={{ true: colors.info, false: 'rgba(255,255,255,0.25)' }}
              thumbColor={colors.white}
            />
          </View>
        </Gradient>

        <View style={styles.body}>
          <View style={styles.mapWrap}>
            <MapView height={150} />
            <View style={styles.mapBadge}>
              <Txt variant="captionStrong">Accra, Cantonments</Txt>
            </View>
            <Pressable style={styles.locate}>
              <LocateFixed size={18} color={colors.forest} />
            </Pressable>
          </View>

          <View style={styles.sectionHead}>
            <Txt variant="h3">Incoming Requests</Txt>
            <Pressable onPress={() => router.push('/driver-requests')} hitSlop={8}>
              <Txt variant="captionStrong" color={colors.forest}>View All</Txt>
            </Pressable>
          </View>

          {online && req ? (
            <Card style={styles.reqCard}>
              <View style={styles.reqHead}>
                <View style={styles.reqWho}>
                  <Avatar name={req.passengerName} size={40} />
                  <View>
                    <Txt variant="bodyStrong">{req.passengerName}</Txt>
                    <Txt variant="caption">⭐ {req.passengerRating} (120 rides)</Txt>
                  </View>
                </View>
                <View style={styles.reqEarn}>
                  <Txt variant="h3" color={colors.forest}>{ghs(req.estEarnings)}</Txt>
                  <Txt variant="caption">Est. payout</Txt>
                </View>
              </View>

              <View style={styles.reqRoute}>
                <View style={styles.reqPoint}>
                  <View style={styles.ring} />
                  <View style={styles.flex}>
                    <Txt variant="caption">Pickup</Txt>
                    <Txt variant="bodyStrong">{req.pickup}</Txt>
                    <Txt variant="caption">{req.distanceKm} km away (5 mins)</Txt>
                  </View>
                </View>
                <View style={styles.reqLine} />
                <View style={styles.reqPoint}>
                  <View style={styles.pin} />
                  <View style={styles.flex}>
                    <Txt variant="caption">Dropoff</Txt>
                    <Txt variant="bodyStrong">{req.dropoff}</Txt>
                  </View>
                </View>
              </View>

              <View style={styles.reqActions}>
                <View style={styles.flex}>
                  <Button label="Decline" variant="outline" onPress={() => driverService.respond(req.id, false)} />
                </View>
                <View style={styles.flex}>
                  <Button label="Accept Ride" onPress={() => { useDriverStore.getState().acceptRequest(req); router.push(`/driver/navigate/${req.id}`); }} />
                </View>
              </View>
            </Card>
          ) : (
            <Card>
              <Txt variant="muted" center>{online ? 'Looking for ride requests near you…' : 'Go online to receive requests.'}</Txt>
            </Card>
          )}

          <Txt variant="h3" style={styles.statsTitle}>Today's Stats</Txt>
          <View style={styles.statsRow}>
            <StatCard icon={<Car size={20} color={colors.info} />} bg={colors.infoLight} value={String(stats.todayTrips)} label="Total Trips" />
            <StatCard icon={<Clock size={20} color={colors.gold} />} bg={colors.warningLight} value={`${stats.todayHours}h`} label="Hours Worked" />
          </View>

          <Txt variant="h3" style={styles.statsTitle}>Recent Earnings</Txt>
          <Card padded={(earnings ?? []).length === 0}>
            {(earnings ?? []).length === 0 ? (
              <Txt variant="caption" center>No completed trips yet.</Txt>
            ) : (
              earnings!.slice(0, 5).map((t, i, arr) => (
                <View key={t.id} style={[styles.earnRow, i < arr.length - 1 && styles.earnDivider]}>
                  <View style={styles.earnIcon}>
                    <ArrowDownLeft size={18} color={colors.forest} />
                  </View>
                  <View style={styles.flex}>
                    <Txt variant="bodyStrong" numberOfLines={1}>{t.label}</Txt>
                    <Txt variant="caption">{new Date(t.date).toLocaleDateString()}</Txt>
                  </View>
                  <Txt variant="bodyStrong" color={colors.forest}>+ {ghs(Math.abs(t.amount))}</Txt>
                </View>
              ))
            )}
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

function StatCard({ icon, bg, value, label }: { icon: React.ReactNode; bg: string; value: string; label: string }) {
  return (
    <Card style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: bg }]}>{icon}</View>
      <Txt variant="h1">{value}</Txt>
      <Txt variant="caption">{label}</Txt>
    </Card>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingBottom: spacing['3xl'] },
  header: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl, borderBottomLeftRadius: radii['2xl'], borderBottomRightRadius: radii['2xl'], gap: spacing.lg },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  bellBtn: { width: 40, height: 40, borderRadius: radii.full, backgroundColor: 'rgba(255,255,255,0.14)', alignItems: 'center', justifyContent: 'center' },
  bellDot: { position: 'absolute', top: 8, right: 9, width: 9, height: 9, borderRadius: 5, backgroundColor: colors.gold, borderWidth: 1.5, borderColor: colors.forest },
  avatarBtn: { borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)', borderRadius: radii.full },
  earnRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg },
  earnDivider: { borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  earnIcon: { width: 38, height: 38, borderRadius: radii.full, backgroundColor: colors.lightGreen, alignItems: 'center', justifyContent: 'center' },
  onlineCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: radii.md, padding: spacing.md },
  zap: { width: 36, height: 36, borderRadius: radii.sm, alignItems: 'center', justifyContent: 'center' },
  flex: { flex: 1 },
  body: { padding: spacing.xl, gap: spacing.lg },
  mapWrap: { position: 'relative' },
  mapBadge: { position: 'absolute', top: spacing.md, left: spacing.md, backgroundColor: colors.surface, paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radii.full, ...shadow.card },
  locate: { position: 'absolute', bottom: spacing.md, right: spacing.md, width: 40, height: 40, borderRadius: radii.full, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', ...shadow.card },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reqCard: { borderLeftWidth: 4, borderLeftColor: colors.gold, gap: spacing.md },
  reqHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  reqWho: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  reqEarn: { alignItems: 'flex-end' },
  reqRoute: { gap: 2 },
  reqPoint: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  ring: { width: 14, height: 14, borderRadius: 7, borderWidth: 3, borderColor: colors.textMuted, marginTop: 2 },
  pin: { width: 14, height: 14, borderRadius: 7, backgroundColor: colors.forest, marginTop: 2 },
  reqLine: { width: 2, height: 16, backgroundColor: colors.border, marginLeft: 6 },
  reqActions: { flexDirection: 'row', gap: spacing.sm },
  statsTitle: { marginTop: spacing.xs },
  statsRow: { flexDirection: 'row', gap: spacing.md },
  statCard: { flex: 1, gap: spacing.xs },
  statIcon: { width: 40, height: 40, borderRadius: radii.sm, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xs },
});
