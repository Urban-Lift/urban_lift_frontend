import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Lock, Plus, Search, TrendingUp, Users } from 'lucide-react-native';
import { Badge, Button, Card, Input, Screen, Spinner, Txt } from '@/components';
import { communityService } from '@/services/communityService';
import type { CommunityGroup } from '@/types';
import { colors, radii, spacing } from '@/theme';

type Tab = 'my' | 'discover';

export default function Community() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<Tab>('my');
  const [query, setQuery] = useState('');
  const { data, isLoading } = useQuery({ queryKey: ['groups'], queryFn: communityService.listGroups });

  const groups = useMemo(() => {
    let list = data ?? [];
    list = tab === 'my' ? list.filter((g) => g.joined) : list.filter((g) => !g.joined);
    if (query) list = list.filter((g) => g.name.toLowerCase().includes(query.toLowerCase()) || g.route.toLowerCase().includes(query.toLowerCase()));
    return list;
  }, [data, tab, query]);

  async function join(id: string) {
    await communityService.join(id);
    qc.setQueryData<CommunityGroup[]>(['groups'], (old) =>
      old?.map((g) => (g.id === id ? { ...g, joined: true, memberCount: g.memberCount + 1 } : g)),
    );
  }

  if (isLoading) return <Spinner />;

  return (
    <Screen padded={false} scroll>
      <View style={styles.top}>
        <View style={styles.titleRow}>
          <Txt variant="h2">Community</Txt>
          <Button label="Create" size="sm" fullWidth={false} icon={<Plus size={16} color={colors.white} />} onPress={() => router.push('/community/create')} />
        </View>
        <Input placeholder="Search groups or routes" value={query} onChangeText={setQuery} left={<Search size={18} color={colors.textMuted} />} />
        <View style={styles.segment}>
          {(['my', 'discover'] as Tab[]).map((t) => (
            <Pressable key={t} onPress={() => setTab(t)} style={[styles.segBtn, tab === t && styles.segActive]}>
              <Txt variant="bodyStrong" color={tab === t ? colors.primaryDark : colors.textMuted}>
                {t === 'my' ? 'My groups' : 'Discover'}
              </Txt>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.list}>
        {groups.length === 0 ? (
          <Txt variant="muted" center style={styles.empty}>
            {tab === 'my' ? 'You haven’t joined any groups yet.' : 'No groups match your search.'}
          </Txt>
        ) : (
          groups.map((g) => (
            <Card key={g.id} onPress={g.joined ? () => router.push(`/community/${g.id}/chat`) : undefined}>
              <View style={styles.groupHead}>
                <View style={[styles.cover, { backgroundColor: g.coverColor }]}>
                  <Users size={20} color={colors.white} />
                </View>
                <View style={styles.flex}>
                  <View style={styles.nameRow}>
                    <Txt variant="bodyStrong">{g.name}</Txt>
                    {g.isPrivate ? <Lock size={14} color={colors.textMuted} /> : null}
                    {g.trending ? (
                      <View style={styles.trend}>
                        <TrendingUp size={12} color={colors.warning} />
                      </View>
                    ) : null}
                  </View>
                  <Txt variant="caption">{g.route}</Txt>
                  <Txt variant="caption">{g.memberCount.toLocaleString()} members</Txt>
                </View>
                {!g.joined ? (
                  <Button label="Join" size="sm" variant="outline" fullWidth={false} onPress={() => join(g.id)} />
                ) : (
                  <Badge label="Joined" tone="success" />
                )}
              </View>
            </Card>
          ))
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { padding: spacing.xl, gap: spacing.md },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  segment: { flexDirection: 'row', backgroundColor: colors.borderLight, borderRadius: radii.md, padding: 4 },
  segBtn: { flex: 1, alignItems: 'center', paddingVertical: spacing.sm, borderRadius: radii.sm },
  segActive: { backgroundColor: colors.surface },
  list: { paddingHorizontal: spacing.xl, gap: spacing.md, paddingBottom: spacing.xl },
  empty: { marginTop: spacing['3xl'] },
  groupHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  cover: { width: 48, height: 48, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' },
  flex: { flex: 1, gap: 2 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  trend: { backgroundColor: colors.warningLight, borderRadius: radii.full, padding: 2 },
});
