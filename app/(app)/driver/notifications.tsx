import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Bell, BellOff } from 'lucide-react-native';
import { Card, EmptyState, Header, Screen, SkeletonCard, Txt } from '@/components';
import { driverService } from '@/services/driverService';
import type { AppNotification } from '@/types';
import { timeAgo } from '@/utils/format';
import { colors, radii, spacing } from '@/theme';

export default function DriverNotifications() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['driver-notifications'], queryFn: driverService.notifications });

  async function read(n: AppNotification) {
    if (n.isRead) return;
    qc.setQueryData<AppNotification[]>(['driver-notifications'], (old) =>
      old?.map((x) => (x.id === n.id ? { ...x, isRead: true } : x)),
    );
    try {
      await driverService.markNotificationRead(n.id);
    } catch {
      qc.invalidateQueries({ queryKey: ['driver-notifications'] });
    }
  }

  return (
    <Screen padded={false}>
      <Header title="Notifications" />
      {isLoading ? (
        <View style={styles.list}><SkeletonCard /><SkeletonCard /></View>
      ) : (
        <FlatList
          data={data ?? []}
          keyExtractor={(n) => String(n.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Card onPress={() => read(item)} style={item.isRead ? undefined : styles.unread}>
              <View style={styles.row}>
                <View style={[styles.icon, !item.isRead && styles.iconUnread]}>
                  <Bell size={18} color={item.isRead ? colors.textMuted : colors.forest} />
                </View>
                <View style={styles.flex}>
                  <View style={styles.titleRow}>
                    <Txt variant="bodyStrong" numberOfLines={1} style={styles.flex}>{item.title}</Txt>
                    {!item.isRead ? <View style={styles.dot} /> : null}
                  </View>
                  {item.message ? <Txt variant="caption">{item.message}</Txt> : null}
                  <Txt variant="caption" color={colors.textLight}>{timeAgo(item.createdAt)}</Txt>
                </View>
              </View>
            </Card>
          )}
          ListEmptyComponent={
            <EmptyState icon={<BellOff size={30} color={colors.forest} />} title="No notifications" message="You're all caught up." />
          }
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.xl, gap: spacing.md },
  unread: { borderColor: colors.lightGreen, backgroundColor: colors.mint },
  row: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  icon: { width: 40, height: 40, borderRadius: radii.sm, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  iconUnread: { backgroundColor: colors.lightGreen },
  flex: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
});
