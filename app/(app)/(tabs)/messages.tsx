import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Lock, Plus, Search, Users } from 'lucide-react-native';
import { Avatar, Button, Card, Gradient, Screen, Spinner, Txt } from '@/components';
import { useAuthStore } from '@/store/authStore';
import { communityService } from '@/services/communityService';
import type { CommunityGroup } from '@/types';
import { colors, fonts, fontSize, radii, shadow, spacing } from '@/theme';

type Tab = 'my' | 'discover';

export default function Messages() {
  const qc = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const [tab, setTab] = useState<Tab>('discover');
  const [query, setQuery] = useState('');
  const { data, isLoading } = useQuery({ queryKey: ['groups'], queryFn: communityService.listGroups });

  const groups = useMemo(() => {
    let list = data ?? [];
    list = tab === 'my' ? list.filter((g) => g.joined) : list;
    if (query) list = list.filter((g) => g.name.toLowerCase().includes(query.toLowerCase()) || g.route.toLowerCase().includes(query.toLowerCase()));
    return list;
  }, [data, tab, query]);

  async function join(id: string) {
    await communityService.join(id);
    qc.setQueryData<CommunityGroup[]>(['groups'], (old) => old?.map((g) => (g.id === id ? { ...g, joined: true, memberCount: g.memberCount + 1 } : g)));
  }

  if (isLoading) return <Spinner />;

  return (
    <Screen padded={false} scroll>
      <View style={styles.header}>
        <Txt variant="h1">Community Groups</Txt>
        <View style={styles.avatarRing}>
          <Avatar name={user?.name ?? 'User'} size={40} />
          <View style={styles.onlineDot} />
        </View>
      </View>

      <View style={styles.searchWrap}>
        <View style={styles.search}>
          <Search size={18} color={colors.textMuted} />
          <TextInput value={query} onChangeText={setQuery} placeholder="Search groups in Accra…" placeholderTextColor={colors.textLight} style={styles.searchInput} />
        </View>
      </View>

      <View style={styles.tabs}>
        {(['my', 'discover'] as Tab[]).map((t) => {
          const active = t === tab;
          return (
            <Pressable key={t} onPress={() => setTab(t)} style={styles.tab}>
              <Txt variant="bodyStrong" color={active ? colors.forest : colors.textMuted}>{t === 'my' ? 'My Groups' : 'Discover'}</Txt>
              {active ? <View style={styles.tabBar} /> : null}
            </Pressable>
          );
        })}
      </View>

      <View style={styles.listHead}>
        <Txt variant="h3">{tab === 'discover' ? 'Trending in Accra' : 'Your Groups'}</Txt>
        <Txt variant="captionStrong" color={colors.forest}>See all</Txt>
      </View>

      <View style={styles.list}>
        {groups.length === 0 ? (
          <Txt variant="muted" center style={styles.empty}>{tab === 'my' ? 'You haven’t joined any groups yet.' : 'No groups match your search.'}</Txt>
        ) : (
          groups.map((g) => (
            <Card key={g.id} padded={false} style={styles.groupCard} onPress={g.joined ? () => router.push(`/community/${g.id}/chat`) : undefined}>
              <View style={styles.row}>
                <Gradient colors={[g.coverColor, shade(g.coverColor)]} style={styles.cover}>
                  <Users size={22} color={colors.white} />
                  {g.trending ? <View style={styles.coverTag}><Txt style={styles.coverTagText}>{g.name.includes('Tech') ? 'Tech' : 'UG'}</Txt></View> : null}
                </Gradient>
                <View style={styles.groupInfo}>
                  <View style={styles.nameRow}>
                    <Txt variant="bodyStrong" numberOfLines={1} style={styles.flex}>{g.name}</Txt>
                    {g.isPrivate ? <Lock size={13} color={colors.textLight} /> : null}
                  </View>
                  <Txt variant="caption" numberOfLines={2}>{g.description}</Txt>
                  <View style={styles.memberRow}>
                    <Users size={13} color={colors.textMuted} />
                    <Txt variant="caption">{g.memberCount.toLocaleString()} members</Txt>
                  </View>
                </View>
                <View style={styles.joinWrap}>
                  {g.joined ? (
                    <Button label="Open" size="sm" variant="outline" fullWidth={false} onPress={() => router.push(`/community/${g.id}/chat`)} />
                  ) : (
                    <Button label="Join" size="sm" fullWidth={false} onPress={() => join(g.id)} />
                  )}
                </View>
              </View>
            </Card>
          ))
        )}
      </View>

      <Pressable style={styles.fab} onPress={() => router.push('/community/create')}>
        <Plus size={26} color={colors.onPrimary} />
      </Pressable>
    </Screen>
  );
}

/** Darken a hex color for the cover gradient end stop. */
function shade(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, ((n >> 16) & 255) - 40);
  const g = Math.max(0, ((n >> 8) & 255) - 40);
  const b = Math.max(0, (n & 255) - 40);
  return `rgb(${r},${g},${b})`;
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.xl, paddingTop: spacing.sm },
  avatarRing: { borderWidth: 2, borderColor: colors.primary, borderRadius: radii.full, padding: 2 },
  onlineDot: { position: 'absolute', right: 2, bottom: 2, width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary, borderWidth: 2, borderColor: colors.background },
  searchWrap: { paddingHorizontal: spacing.xl, paddingTop: spacing.md },
  search: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.surfaceAlt, borderRadius: radii.md, paddingHorizontal: spacing.lg },
  searchInput: { flex: 1, fontFamily: fonts.medium, fontSize: fontSize.md, color: colors.text, paddingVertical: 14 },
  tabs: { flexDirection: 'row', gap: spacing.xl, paddingHorizontal: spacing.xl, marginTop: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  tab: { paddingBottom: spacing.md, alignItems: 'center', gap: spacing.sm },
  tabBar: { height: 3, width: '100%', backgroundColor: colors.primary, borderRadius: 2, position: 'absolute', bottom: -1, left: 0, right: 0 },
  listHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.xl, marginTop: spacing.lg },
  list: { paddingHorizontal: spacing.xl, paddingTop: spacing.md, gap: spacing.md, paddingBottom: spacing['4xl'] },
  empty: { marginTop: spacing['3xl'] },
  groupCard: { padding: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  cover: { width: 64, height: 64, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' },
  coverTag: { position: 'absolute', bottom: 4, left: 4, backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 6, paddingVertical: 1, borderRadius: radii.xs },
  coverTagText: { fontFamily: fonts.bold, fontSize: 9, color: colors.text },
  groupInfo: { flex: 1, gap: 2 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  flex: { flex: 1 },
  memberRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  joinWrap: { justifyContent: 'center' },
  fab: { position: 'absolute', right: spacing.xl, bottom: spacing.xl, width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', ...shadow.primary },
});
