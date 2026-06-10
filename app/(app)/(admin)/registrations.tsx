import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Car } from 'lucide-react-native';
import { Avatar, Badge, Button, Card, EmptyState, Header, Screen, SkeletonCard, Txt } from '@/components';
import { adminService, type DriverRegistration } from '@/services/adminService';
import { apiError } from '@/services/api';
import { colors, radii, spacing } from '@/theme';

type Filter = 'pending' | 'all';

export default function AdminRegistrations() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<Filter>('pending');
  const [busy, setBusy] = useState<number | null>(null);
  const [error, setError] = useState<string>();
  const { data, isLoading } = useQuery({ queryKey: ['admin-regs'], queryFn: adminService.registrations });

  const list = useMemo(() => {
    const all = data ?? [];
    return filter === 'pending' ? all.filter((r) => r.approved == null) : all;
  }, [data, filter]);

  async function decide(reg: DriverRegistration, approved: boolean) {
    setBusy(reg.id);
    setError(undefined);
    try {
      await adminService.approve(reg.id, approved);
      qc.setQueryData<DriverRegistration[]>(['admin-regs'], (old) =>
        old?.map((r) => (r.id === reg.id ? { ...r, approved } : r)),
      );
    } catch (e) {
      setError(apiError(e));
    } finally {
      setBusy(null);
    }
  }

  return (
    <Screen padded={false}>
      <Header title="Driver Registrations" back={false} />
      <View style={styles.filters}>
        {(['pending', 'all'] as Filter[]).map((f) => {
          const active = f === filter;
          return (
            <Pressable key={f} onPress={() => setFilter(f)} style={[styles.chip, active && styles.chipActive]}>
              <Txt variant="captionStrong" color={active ? colors.forest : colors.textMuted}>
                {f === 'pending' ? 'Pending' : 'All'}
              </Txt>
            </Pressable>
          );
        })}
      </View>
      {error ? <Txt variant="caption" color={colors.error} style={styles.error}>{error}</Txt> : null}

      {isLoading ? (
        <View style={styles.list}><SkeletonCard /><SkeletonCard /></View>
      ) : (
        <FlatList
          data={list}
          keyExtractor={(r) => String(r.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Card>
              <View style={styles.head}>
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

              <View style={styles.detailGrid}>
                <Detail label="Vehicle" value={`${item.carColor} ${item.carModel}`} />
                <Detail label="Plate" value={item.plate} />
                {item.carYear ? <Detail label="Year" value={String(item.carYear)} /> : null}
                {item.ghanaCard ? <Detail label="Ghana Card" value={item.ghanaCard} /> : null}
              </View>

              {item.approved == null ? (
                <View style={styles.actions}>
                  <View style={styles.flex}>
                    <Button label="Decline" variant="outline" loading={busy === item.id} onPress={() => decide(item, false)} />
                  </View>
                  <View style={styles.flex}>
                    <Button label="Approve" loading={busy === item.id} onPress={() => decide(item, true)} />
                  </View>
                </View>
              ) : null}
            </Card>
          )}
          ListEmptyComponent={
            <EmptyState icon={<Car size={30} color={colors.forest} />} title="Nothing to review" message="Driver registrations awaiting approval appear here." />
          }
        />
      )}
    </Screen>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detail}>
      <Txt variant="caption">{label}</Txt>
      <Txt variant="bodyStrong">{value}</Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  filters: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.xl, paddingBottom: spacing.sm },
  chip: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radii.full, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface },
  chipActive: { borderColor: colors.primary, backgroundColor: colors.lightGreen },
  error: { paddingHorizontal: spacing.xl, paddingBottom: spacing.sm },
  list: { padding: spacing.xl, paddingTop: spacing.sm, gap: spacing.md },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  who: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  detailGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.lg, marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.borderLight },
  detail: { gap: 2, minWidth: '40%' },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  flex: { flex: 1 },
});
