import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { MapPin, Plus, Trash2 } from 'lucide-react-native';
import {
  BottomSheet,
  Button,
  Card,
  EmptyState,
  Header,
  Input,
  RouteLine,
  Screen,
  Spinner,
  Txt,
} from '@/components';
import { profileService } from '@/services/profileService';
import { apiError } from '@/services/api';
import type { SavedRoute } from '@/types';
import { colors, spacing } from '@/theme';

export default function SavedRoutes() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['saved-routes'], queryFn: profileService.getSavedRoutes });
  const [routes, setRoutes] = useState<SavedRoute[] | null>(null);
  const [adding, setAdding] = useState(false);
  const [label, setLabel] = useState('');
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');

  const list = routes ?? data ?? [];

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();

  async function add() {
    setSaving(true);
    setError(undefined);
    try {
      const created = await profileService.addSavedRoute({ label, pickup, dropoff });
      setRoutes([...list, created]);
      setAdding(false);
      setLabel('');
      setPickup('');
      setDropoff('');
      qc.invalidateQueries({ queryKey: ['saved-routes'] });
    } catch (e) {
      setError(apiError(e));
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    setRoutes(list.filter((r) => r.id !== id));
    try {
      await profileService.deleteSavedRoute(id);
    } catch {
      qc.invalidateQueries({ queryKey: ['saved-routes'] });
    }
  }

  if (isLoading) return <Spinner />;

  return (
    <Screen
      padded={false}
      footer={<Button label="Add a route" icon={<Plus size={18} color={colors.white} />} onPress={() => setAdding(true)} />}
    >
      <Header title="Saved routes" />
      <View style={styles.list}>
        {list.length === 0 ? (
          <EmptyState icon={<MapPin size={30} color="#1A7A3C" />} title="No saved routes" message="Save your regular trips for one-tap booking." />
        ) : (
          list.map((r) => (
            <Card key={r.id}>
              <View style={styles.head}>
                <Txt variant="bodyStrong">{r.label}</Txt>
                <Pressable onPress={() => remove(r.id)} hitSlop={8}>
                  <Trash2 size={18} color={colors.error} />
                </Pressable>
              </View>
              <RouteLine origin={r.pickup} destination={r.dropoff} />
            </Card>
          ))
        )}
      </View>

      <BottomSheet visible={adding} onClose={() => setAdding(false)} title="New saved route">
        <Input label="Label" placeholder="Home → Work" value={label} onChangeText={setLabel} />
        <Input label="Pickup" placeholder="Adenta" value={pickup} onChangeText={setPickup} />
        <Input label="Drop-off" placeholder="Airport City" value={dropoff} onChangeText={setDropoff} />
        {error ? <Txt variant="caption" color={colors.error}>{error}</Txt> : null}
        <Button label="Save route" onPress={add} loading={saving} disabled={!label || !pickup || !dropoff} />
      </BottomSheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.xl, gap: spacing.md },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
