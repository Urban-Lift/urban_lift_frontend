import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Check } from 'lucide-react-native';
import { Button, Gradient, Header, Input, Screen, Txt } from '@/components';
import { walletService } from '@/services/walletService';
import { ghs, ghsCompact } from '@/utils/format';
import { colors, radii, shadow, spacing } from '@/theme';

const TIERS = [
  { amount: 10, label: 'Starter' },
  { amount: 20, label: 'Commuter' },
  { amount: 50, label: 'Regular' },
  { amount: 100, label: 'Pro' },
];

export default function TopUpAmount() {
  const { data: wallet } = useQuery({ queryKey: ['wallet'], queryFn: walletService.getWallet });
  const [amount, setAmount] = useState<number | null>(10);
  const [custom, setCustom] = useState('');

  const value = custom ? Number(custom) : amount ?? 0;
  const valid = value >= 1;

  return (
    <Screen
      scroll
      padded={false}
      footer={<Button label="Continue" icon={<ArrowRight size={20} color={colors.onPrimary} />} onPress={() => router.push(`/wallet/topup-provider?amount=${value}`)} disabled={!valid} />}
    >
      <Header title="Top Up Wallet" />
      <View style={styles.body}>
        <Gradient name="heroDark" style={styles.balance}>
          <Txt variant="caption" color={colors.lightGreen}>Current Balance</Txt>
          <Txt variant="h1" color={colors.white}>{ghs(wallet?.balance ?? 0)}</Txt>
        </Gradient>

        <Txt variant="h3">Select Amount</Txt>
        <View style={styles.grid}>
          {TIERS.map((t) => {
            const active = !custom && amount === t.amount;
            return (
              <Pressable key={t.amount} onPress={() => { setAmount(t.amount); setCustom(''); }} style={[styles.tile, active && styles.tileActive]}>
                {active ? <View style={styles.check}><Check size={12} color={colors.white} strokeWidth={3} /></View> : null}
                <Txt variant="caption" color={active ? colors.forest : colors.textMuted}>{t.label}</Txt>
                <Txt variant="h2" color={colors.text}>{ghsCompact(t.amount)}</Txt>
              </Pressable>
            );
          })}
        </View>

        <Input
          label="Or enter custom amount"
          placeholder="0.00"
          keyboardType="decimal-pad"
          value={custom}
          onChangeText={(t) => { setCustom(t.replace(/[^0-9.]/g, '')); setAmount(null); }}
          left={<Txt variant="bodyStrong" color={colors.textMuted}>GHS</Txt>}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.xl, paddingTop: spacing.sm, gap: spacing.lg },
  balance: { borderRadius: radii.lg, padding: spacing.xl, gap: 2, ...shadow.card },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  tile: { width: '47%', paddingVertical: spacing.xl, paddingHorizontal: spacing.lg, borderRadius: radii.lg, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface, gap: 2 },
  tileActive: { borderColor: colors.primary, backgroundColor: colors.mint },
  check: { position: 'absolute', top: spacing.md, right: spacing.md, width: 20, height: 20, borderRadius: 10, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
});
