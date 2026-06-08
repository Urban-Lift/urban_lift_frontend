import { useState } from 'react';
import { StyleSheet, Switch, View } from 'react-native';
import { Card, Header, Screen, Txt } from '@/components';
import { colors, spacing } from '@/theme';

const CATEGORIES = [
  { key: 'ride', label: 'Ride updates', desc: 'Driver assigned, arriving, trip status' },
  { key: 'promos', label: 'Promotions & offers', desc: 'Discounts and referral rewards' },
  { key: 'community', label: 'Community activity', desc: 'New messages and shared rides' },
  { key: 'payments', label: 'Payments', desc: 'Top ups, receipts and low balance' },
  { key: 'safety', label: 'Safety alerts', desc: 'Always on for your protection', locked: true },
];

export default function NotificationSettings() {
  const [state, setState] = useState<Record<string, boolean>>({
    ride: true,
    promos: false,
    community: true,
    payments: true,
    safety: true,
  });

  return (
    <Screen padded={false}>
      <Header title="Notifications" />
      <View style={styles.body}>
        <Card padded={false}>
          {CATEGORIES.map((c, i) => (
            <View key={c.key} style={[styles.row, i < CATEGORIES.length - 1 && styles.divider]}>
              <View style={styles.flex}>
                <Txt variant="bodyStrong">{c.label}</Txt>
                <Txt variant="caption">{c.desc}</Txt>
              </View>
              <Switch
                value={state[c.key]}
                disabled={c.locked}
                onValueChange={(v) => setState((s) => ({ ...s, [c.key]: v }))}
                trackColor={{ true: colors.primary, false: colors.border }}
                thumbColor={colors.white}
              />
            </View>
          ))}
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.xl },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg },
  divider: { borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  flex: { flex: 1, gap: 2 },
});
