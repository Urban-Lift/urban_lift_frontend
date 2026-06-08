import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Check } from 'lucide-react-native';
import { Button, Header, Screen, Txt } from '@/components';
import { ProviderIcon } from '@/features/wallet/ProviderIcon';
import { walletService, providerLabel } from '@/services/walletService';
import type { PaymentProvider } from '@/types';
import { ghsCompact } from '@/utils/format';
import { colors, radii, spacing } from '@/theme';

const PROVIDERS: { id: PaymentProvider; soon?: boolean }[] = [
  { id: 'mtn' },
  { id: 'vodafone' },
  { id: 'at' },
  { id: 'card', soon: true },
];

export default function TopUpProvider() {
  const { amount } = useLocalSearchParams<{ amount: string }>();
  const value = Number(amount) || 0;
  const [selected, setSelected] = useState<PaymentProvider>('mtn');
  const [loading, setLoading] = useState(false);

  async function pay() {
    setLoading(true);
    const result = await walletService.topUp(value, selected);
    setLoading(false);
    router.replace(
      `/wallet/topup-success?amount=${value}&provider=${selected}&ref=${result.reference}&balance=${result.newBalance}`,
    );
  }

  return (
    <Screen
      footer={<Button label={`Pay ${ghsCompact(value)}`} onPress={pay} loading={loading} />}
    >
      <Header title="Payment method" subtitle={`Top up ${ghsCompact(value)}`} />
      <View style={styles.body}>
        {PROVIDERS.map((p) => {
          const active = selected === p.id;
          return (
            <Pressable
              key={p.id}
              disabled={p.soon}
              onPress={() => setSelected(p.id)}
              style={[styles.row, active && styles.rowActive, p.soon && styles.rowDisabled]}
            >
              <ProviderIcon provider={p.id} />
              <View style={styles.flex}>
                <Txt variant="bodyStrong">{providerLabel(p.id)}</Txt>
                {p.soon ? <Txt variant="caption">Coming soon</Txt> : null}
              </View>
              {active && !p.soon ? <Check size={20} color={colors.primary} /> : null}
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { gap: spacing.md, marginTop: spacing.md },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  rowActive: { borderColor: colors.primary, backgroundColor: colors.lightGreen },
  rowDisabled: { opacity: 0.5 },
  flex: { flex: 1 },
});
