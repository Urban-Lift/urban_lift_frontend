import { FlatList, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Car, LogOut, ShieldCheck, Users } from 'lucide-react-native';
import { Avatar, Badge, Button, Card, EmptyState, Gradient, Spinner, Txt } from '@/components';
import { useAuthStore } from '@/store/authStore';
import { adminService, type DriverRegistration } from '@/services/adminService';
import { colors, radii, spacing } from '@/theme';

export default function AdminConsole() {
  const insets = useSafeAreaInsets();
  const qc = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const { data: regs, isLoading } = useQuery({ queryKey: ['admin-regs'], queryFn: adminService.registrations });
  const { data: users } = useQuery({ queryKey: ['admin-users'], queryFn: () => adminService.users() });

  const pending = (regs ?? []).filter((r) => r.approved == null);

  async function decide(reg: DriverRegistration, approved: boolean) {
    await adminService.approve(reg.id, approved);
    qc.setQueryData<DriverRegistration[]>(['admin-regs'], (old) =>
      old?.map((r) => (r.id === reg.id ? { ...r, approved } : r)),
    );
  }

  function onLogout() {
    logout();
    router.replace('/');
  }

  return (
    <View style={styles.root}>
      <Gradient name="hero" style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <View style={styles.headerRow}>
          <View style={styles.titleRow}>
            <ShieldCheck size={22} color={colors.white} />
            <View>
              <Txt variant="caption" color={colors.lightGreen}>Admin Console</Txt>
              <Txt variant="h2" color={colors.white}>{user?.name ?? 'Admin'}</Txt>
            </View>
          </View>
          <Button label="Log out" variant="dark" size="sm" fullWidth={false} icon={<LogOut size={16} color={colors.white} />} onPress={onLogout} />
        </View>
        <View style={styles.stats}>
          <Stat icon={<Users size={16} color={colors.white} />} value={String(users?.length ?? '—')} label="Users" />
          <Stat icon={<Car size={16} color={colors.white} />} value={String(pending.length)} label="Pending drivers" />
        </View>
      </Gradient>

      {isLoading ? (
        <Spinner />
      ) : (
        <FlatList
          data={regs ?? []}
          keyExtractor={(r) => String(r.id)}
          contentContainerStyle={styles.list}
          ListHeaderComponent={<Txt variant="h3" style={styles.listTitle}>Driver Registrations</Txt>}
          renderItem={({ item }) => (
            <Card>
              <View style={styles.regHead}>
                <View style={styles.who}>
                  <Avatar name={item.fullName} uri={item.carPic} size={44} />
                  <View>
                    <Txt variant="bodyStrong">{item.fullName}</Txt>
                    <Txt variant="caption">{item.phone}</Txt>
                  </View>
                </View>
                {item.approved == null ? (
                  <Badge label="Pending" tone="warning" />
                ) : item.approved ? (
                  <Badge label="Approved" tone="success" />
                ) : (
                  <Badge label="Declined" tone="error" />
                )}
              </View>
              <View style={styles.vehicle}>
                <Car size={14} color={colors.textMuted} />
                <Txt variant="caption">
                  {item.carColor} {item.carModel} · {item.plate}
                </Txt>
              </View>
              {item.approved == null ? (
                <View style={styles.actions}>
                  <View style={styles.flex}>
                    <Button label="Decline" variant="outline" onPress={() => decide(item, false)} />
                  </View>
                  <View style={styles.flex}>
                    <Button label="Approve" onPress={() => decide(item, true)} />
                  </View>
                </View>
              ) : null}
            </Card>
          )}
          ListEmptyComponent={
            <EmptyState icon={<Car size={30} color={colors.forest} />} title="No registrations" message="Driver registrations awaiting review appear here." />
          }
        />
      )}
    </View>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <View style={styles.statHead}>
        {icon}
        <Txt variant="h2" color={colors.white}>{value}</Txt>
      </View>
      <Txt variant="caption" color={colors.lightGreen}>{label}</Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl, borderBottomLeftRadius: radii['2xl'], borderBottomRightRadius: radii['2xl'], gap: spacing.lg },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  stats: { flexDirection: 'row', gap: spacing.xl },
  stat: { gap: 2 },
  statHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  list: { padding: spacing.xl, gap: spacing.md },
  listTitle: { marginBottom: spacing.xs },
  regHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  who: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  vehicle: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.md },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  flex: { flex: 1 },
});
