import { useMemo, useState } from 'react';
import { Alert, FlatList, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Search, Trash2, Users as UsersIcon } from 'lucide-react-native';
import { Avatar, Badge, EmptyState, Header, Screen, SkeletonCard, Txt } from '@/components';
import { adminService, type AdminUser } from '@/services/adminService';
import { apiError } from '@/services/api';
import { colors, fonts, fontSize, radii, spacing } from '@/theme';

type RoleFilter = 'all' | 'passenger' | 'driver' | 'admin';

export default function AdminUsers() {
  const qc = useQueryClient();
  const [query, setQuery] = useState('');
  const [role, setRole] = useState<RoleFilter>('all');
  const { data, isLoading } = useQuery({ queryKey: ['admin-users'], queryFn: () => adminService.users() });

  const list = useMemo(() => {
    let users = data ?? [];
    if (role !== 'all') users = users.filter((u) => u.role === role);
    if (query) {
      const q = query.toLowerCase();
      users = users.filter((u) => u.name.toLowerCase().includes(q) || u.phone.includes(q));
    }
    return users;
  }, [data, role, query]);

  function confirmDelete(user: AdminUser) {
    const run = async () => {
      try {
        await adminService.deleteUser(user);
        qc.setQueryData<AdminUser[]>(['admin-users'], (old) => old?.filter((u) => u.id !== user.id));
      } catch (e) {
        Alert.alert('Could not delete', apiError(e));
      }
    };
    if (Platform.OS === 'web') {
      // eslint-disable-next-line no-alert
      if (typeof window !== 'undefined' && window.confirm(`Delete ${user.name}? This cannot be undone.`)) run();
      return;
    }
    Alert.alert('Delete user', `Delete ${user.name}? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: run },
    ]);
  }

  return (
    <Screen padded={false}>
      <Header title="Users" back={false} />

      <View style={styles.searchWrap}>
        <View style={styles.search}>
          <Search size={18} color={colors.textMuted} />
          <TextInput value={query} onChangeText={setQuery} placeholder="Search by name or number" placeholderTextColor={colors.textLight} style={styles.searchInput} />
        </View>
      </View>

      <View style={styles.chips}>
        {(['all', 'passenger', 'driver', 'admin'] as RoleFilter[]).map((r) => {
          const active = r === role;
          return (
            <Pressable key={r} onPress={() => setRole(r)} style={[styles.chip, active && styles.chipActive]}>
              <Txt variant="captionStrong" color={active ? colors.forest : colors.textMuted}>
                {r === 'all' ? 'All' : r[0].toUpperCase() + r.slice(1) + 's'}
              </Txt>
            </Pressable>
          );
        })}
      </View>

      {isLoading ? (
        <View style={styles.list}><SkeletonCard /><SkeletonCard /></View>
      ) : (
        <FlatList
          data={list}
          keyExtractor={(u) => u.id}
          contentContainerStyle={styles.list}
          ListHeaderComponent={list.length ? <Txt variant="caption">{list.length} users</Txt> : null}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Avatar name={item.name} uri={item.avatarUrl} size={44} />
              <View style={styles.info}>
                <Txt variant="bodyStrong" numberOfLines={1}>{item.name}</Txt>
                <Txt variant="caption">{item.phone}</Txt>
              </View>
              <Badge label={item.role} tone={item.role === 'driver' ? 'success' : item.role === 'admin' ? 'purple' : 'info'} />
              <Pressable onPress={() => confirmDelete(item)} hitSlop={8} style={styles.delete}>
                <Trash2 size={18} color={colors.error} />
              </Pressable>
            </View>
          )}
          ListEmptyComponent={
            <EmptyState icon={<UsersIcon size={30} color={colors.forest} />} title="No users found" message="Try a different search or filter." />
          }
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchWrap: { paddingHorizontal: spacing.xl, paddingBottom: spacing.sm },
  search: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.surfaceAlt, borderRadius: radii.md, paddingHorizontal: spacing.lg },
  searchInput: { flex: 1, fontFamily: fonts.medium, fontSize: fontSize.md, color: colors.text, paddingVertical: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, paddingHorizontal: spacing.xl, paddingBottom: spacing.sm },
  chip: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radii.full, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface },
  chipActive: { borderColor: colors.primary, backgroundColor: colors.lightGreen },
  list: { padding: spacing.xl, paddingTop: spacing.sm, gap: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surface, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.borderLight, padding: spacing.md },
  info: { flex: 1, gap: 2 },
  delete: { width: 38, height: 38, borderRadius: radii.full, backgroundColor: colors.errorLight, alignItems: 'center', justifyContent: 'center' },
});
