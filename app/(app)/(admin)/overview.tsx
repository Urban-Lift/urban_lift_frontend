import { ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Car, ChevronRight, ShieldCheck, UserCheck, Users } from 'lucide-react-native';
import { Avatar, Badge, Card, Gradient, Spinner, Txt } from '@/components';
import { useAuthStore } from '@/store/authStore';
import { adminService } from '@/services/adminService';
import { colors, radii, spacing } from '@/theme';

export default function AdminOverview() {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);

  const { data: users, isLoading: lu } = useQuery({ queryKey: ['admin-users'], queryFn: () => adminService.users() });
  const { data: regs, isLoading: lr } = useQuery({ queryKey: ['admin-regs'], queryFn: adminService.registrations });

  if (lu || lr) return <Spinner />;

  const drivers = (users ?? []).filter((u) => u.role === 'driver').length;
  const passengers = (users ?? []).filter((u) => u.role === 'passenger').length;
  const pending = (regs ?? []).filter((r) => r.approved == null);

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Gradient name="hero" style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
          <View style={styles.headerRow}>
            <View style={styles.titleRow}>
              <ShieldCheck size={22} color={colors.white} />
              <View>
                <Txt variant="caption" color={colors.lightGreen}>Admin Console</Txt>
                <Txt variant="h2" color={colors.white}>{user?.name ?? 'Admin'}</Txt>
              </View>
            </View>
          </View>
          <View style={styles.bigStats}>
            <BigStat value={String(users?.length ?? 0)} label="Total users" />
            <View style={styles.divider} />
            <BigStat value={String(pending.length)} label="Pending drivers" />
          </View>
        </Gradient>

        <View style={styles.body}>
          <View style={styles.statsRow}>
            <StatCard icon={<Users size={20} color={colors.info} />} bg={colors.infoLight} value={String(passengers)} label="Passengers" />
            <StatCard icon={<Car size={20} color={colors.forest} />} bg={colors.lightGreen} value={String(drivers)} label="Drivers" />
          </View>

          <Card onPress={() => router.push('/registrations')} style={styles.action}>
            <View style={styles.actionLeft}>
              <View style={styles.actionIcon}>
                <UserCheck size={20} color={colors.gold} />
              </View>
              <View>
                <Txt variant="bodyStrong">Driver approvals</Txt>
                <Txt variant="caption">Review and approve new drivers</Txt>
              </View>
            </View>
            <View style={styles.actionRight}>
              {pending.length > 0 ? <Badge label={`${pending.length} pending`} tone="warning" /> : null}
              <ChevronRight size={18} color={colors.textLight} />
            </View>
          </Card>

          <Card onPress={() => router.push('/users')} style={styles.action}>
            <View style={styles.actionLeft}>
              <View style={[styles.actionIcon, { backgroundColor: colors.infoLight }]}>
                <Users size={20} color={colors.info} />
              </View>
              <View>
                <Txt variant="bodyStrong">Manage users</Txt>
                <Txt variant="caption">Search, filter and remove accounts</Txt>
              </View>
            </View>
            <ChevronRight size={18} color={colors.textLight} />
          </Card>

          <Txt variant="h3" style={styles.recentTitle}>Latest pending drivers</Txt>
          {pending.length === 0 ? (
            <Card>
              <Txt variant="muted" center>No driver registrations awaiting review.</Txt>
            </Card>
          ) : (
            pending.slice(0, 3).map((r) => (
              <Card key={r.id} onPress={() => router.push('/registrations')} style={styles.regRow}>
                <Avatar name={r.fullName} uri={r.carPic} size={40} />
                <View style={styles.flex}>
                  <Txt variant="bodyStrong">{r.fullName}</Txt>
                  <Txt variant="caption">{r.carColor} {r.carModel} · {r.plate}</Txt>
                </View>
                <Badge label="Pending" tone="warning" />
              </Card>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function BigStat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.bigStat}>
      <Txt variant="display" color={colors.white}>{value}</Txt>
      <Txt variant="caption" color={colors.lightGreen}>{label}</Txt>
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
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  bigStats: { flexDirection: 'row', alignItems: 'center' },
  bigStat: { flex: 1, gap: 2 },
  divider: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.2)' },
  body: { padding: spacing.xl, gap: spacing.md },
  statsRow: { flexDirection: 'row', gap: spacing.md },
  statCard: { flex: 1, gap: spacing.xs },
  statIcon: { width: 40, height: 40, borderRadius: radii.sm, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xs },
  action: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  actionLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1 },
  actionIcon: { width: 40, height: 40, borderRadius: radii.sm, backgroundColor: colors.warningLight, alignItems: 'center', justifyContent: 'center' },
  actionRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  recentTitle: { marginTop: spacing.xs },
  regRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1 },
});
