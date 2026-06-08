import { Pressable, StyleSheet, Switch, View } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Bell, TrendingUp, User as UserIcon, Wallet as WalletIcon } from 'lucide-react-native';
import { Avatar, Button, Card, RouteLine, Screen, Spinner, Txt } from '@/components';
import { useAuthStore } from '@/store/authStore';
import { useDriverStore } from '@/store/driverStore';
import { driverService } from '@/services/driverService';
import { ghs } from '@/utils/format';
import { colors, radii, spacing } from '@/theme';

export default function DriverDashboard() {
  const user = useAuthStore((s) => s.user);
  const online = useDriverStore((s) => s.online);
  const setOnline = useDriverStore((s) => s.setOnline);

  const { data: stats } = useQuery({ queryKey: ['driver-stats'], queryFn: driverService.getStats });
  const { data: requests } = useQuery({
    queryKey: ['incoming'],
    queryFn: driverService.incomingRequests,
    enabled: online,
  });

  if (!stats) return <Spinner />;
  const topRequest = requests?.[0];

  return (
    <Screen scroll padded={false}>
      <View style={styles.header}>
        <View style={styles.greet}>
          <Avatar name={user?.name ?? 'Driver'} size={44} />
          <View>
            <Txt variant="caption">Welcome back</Txt>
            <Txt variant="h3">{user?.name?.split(' ')[0] ?? 'Driver'}</Txt>
          </View>
        </View>
        <View style={styles.headerActions}>
          <Pressable onPress={() => router.push('/wallet')} hitSlop={8}>
            <WalletIcon size={22} color={colors.text} />
          </Pressable>
          <Pressable onPress={() => router.push('/profile')} hitSlop={8}>
            <UserIcon size={22} color={colors.text} />
          </Pressable>
        </View>
      </View>

      <View style={styles.body}>
        <Card style={online ? styles.onlineCard : undefined}>
          <View style={styles.onlineRow}>
            <View>
              <Txt variant="bodyStrong" color={online ? colors.primaryDark : colors.text}>
                {online ? "You're online" : "You're offline"}
              </Txt>
              <Txt variant="caption">{online ? 'Receiving ride requests' : 'Go online to start earning'}</Txt>
            </View>
            <Switch
              value={online}
              onValueChange={async (v) => {
                setOnline(v);
                await driverService.setOnline(v);
              }}
              trackColor={{ true: colors.primary, false: colors.border }}
              thumbColor={colors.white}
            />
          </View>
        </Card>

        <Card>
          <View style={styles.earningsHeader}>
            <Txt variant="caption">Today's earnings</Txt>
            <View style={styles.trend}>
              <TrendingUp size={14} color={colors.primary} />
              <Txt variant="caption" color={colors.primary}>
                +12%
              </Txt>
            </View>
          </View>
          <Txt variant="h1" color={colors.primary}>
            {ghs(stats.todayEarnings)}
          </Txt>
          <View style={styles.statsRow}>
            <Stat label="Trips" value={String(stats.todayTrips)} />
            <Stat label="Hours" value={`${stats.todayHours}h`} />
            <Stat label="Acceptance" value={`${stats.acceptanceRate}%`} />
          </View>
        </Card>

        {online && topRequest ? (
          <Card style={styles.requestCard}>
            <View style={styles.requestHeader}>
              <Bell size={18} color={colors.warning} />
              <Txt variant="bodyStrong">New ride request</Txt>
            </View>
            <View style={styles.requester}>
              <Avatar name={topRequest.passengerName} size={36} />
              <View style={styles.flex}>
                <Txt variant="bodyStrong">{topRequest.passengerName}</Txt>
                <Txt variant="caption">{topRequest.distanceKm} km away · earns {ghs(topRequest.estEarnings)}</Txt>
              </View>
            </View>
            <RouteLine origin={topRequest.pickup} destination={topRequest.dropoff} />
            <View style={styles.requestActions}>
              <Button label="View all requests" onPress={() => router.push('/driver/passengers')} />
            </View>
          </Card>
        ) : online ? (
          <Card>
            <Txt variant="muted" center>
              Looking for ride requests near you…
            </Txt>
          </Card>
        ) : null}
      </View>
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Txt variant="bodyStrong">{value}</Txt>
      <Txt variant="caption">{label}</Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
  },
  greet: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  headerActions: { flexDirection: 'row', gap: spacing.lg },
  body: { padding: spacing.xl, gap: spacing.md },
  onlineCard: { borderColor: colors.primary, backgroundColor: colors.lightGreen },
  onlineRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  earningsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  trend: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.lg },
  stat: { alignItems: 'center', flex: 1 },
  requestCard: { borderColor: colors.warning },
  requestHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  requester: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.md },
  flex: { flex: 1 },
  requestActions: { marginTop: spacing.md },
});
