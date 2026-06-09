import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import { Button, Card, Header, Screen, Txt } from '@/components';
import { ProviderIcon } from '@/features/wallet/ProviderIcon';
import { walletService, providerLabel } from '@/services/walletService';
import type { PaymentProvider } from '@/types';
import { ghs } from '@/utils/format';
import { colors, radii, spacing } from '@/theme';

const PROVIDERS: { id: PaymentProvider; code: string; soon?: boolean }[] = [
  { id: 'mtn', code: 'Pay via *170#' },
  { id: 'vodafone', code: 'Pay via *110#' },
  { id: 'at', code: 'Pay via *110#' },
  { id: 'card', code: 'Coming soon', soon: true },
];

const FEE = 0.5;

export default function TopUpProvider() {
  const { amount } = useLocalSearchParams<{ amount: string }>();
  const value = Number(amount) || 0;
  const [selected, setSelected] = useState<PaymentProvider>('mtn');
  const [loading, setLoading] = useState(false);

  async function pay() {
    setLoading(true);
    const result = await walletService.topUp(value, selected);
    setLoading(false);
    router.replace(`/wallet/topup-success?amount=${value}&provider=${selected}&ref=${result.reference}&balance=${result.newBalance}`);
  }

  return (
    <Screen
      scroll
      padded={false}
      footer={
        <View style={styles.footer}>
          <View style={styles.feeRow}>
            <Txt variant="caption">Transaction Fee</Txt>
            <Txt variant="captionStrong">{ghs(FEE)}</Txt>
          </View>
          <Button label={`Proceed to Pay  ·  ${ghs(value + FEE)}`} icon={<ArrowRight size={20} color={colors.onPrimary} />} onPress={pay} loading={loading} />
        </View>
      }
    >
      <Header title="Select Provider" roundBack />
      <View style={styles.body}>
        <Card style={styles.amountCard}>
          <Txt variant="caption" center>Top-up Amount</Txt>
          <Txt variant="display" center>{ghs(value)}</Txt>
        </Card>

        <Txt variant="overline" style={styles.label}>Choose Mobile Money</Txt>
        {PROVIDERS.map((p) => {
          const active = selected === p.id;
          return (
            <Pressable key={p.id} disabled={p.soon} onPress={() => setSelected(p.id)} style={[styles.row, active && styles.rowActive, p.soon && styles.rowDisabled]}>
              <ProviderIcon provider={p.id} />
              <View style={styles.flex}>
                <Txt variant="bodyStrong">{providerLabel(p.id)}</Txt>
                <Txt variant="caption">{p.code}</Txt>
              </View>
              {!p.soon ? <View style={[styles.radio, active && styles.radioOn]}>{active ? <View style={styles.radioDot} /> : null}</View> : null}
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.xl, paddingTop: spacing.sm, gap: spacing.md },
  flex: { flex: 1 },
  amountCard: { alignItems: 'center', gap: 2 },
  label: { marginTop: spacing.sm, marginBottom: spacing.xs },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg, borderRadius: radii.lg, borderWidth: 1.5, borderColor: colors.borderLight, backgroundColor: colors.surface },
  rowActive: { borderColor: colors.primary, backgroundColor: colors.mint },
  rowDisabled: { opacity: 0.5 },
  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  radioOn: { borderColor: colors.primary },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary },
  footer: { gap: spacing.md },
  feeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
