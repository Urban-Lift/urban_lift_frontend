import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Button, Header, Input, Screen, Txt } from '@/components';
import { ghsCompact } from '@/utils/format';
import { colors, radii, spacing } from '@/theme';

const PRESETS = [10, 20, 50, 100];

export default function TopUpAmount() {
  const [amount, setAmount] = useState<number | null>(50);
  const [custom, setCustom] = useState('');

  const value = custom ? Number(custom) : amount ?? 0;
  const valid = value >= 1;

  return (
    <Screen
      footer={
        <Button label={`Continue · ${ghsCompact(value || 0)}`} onPress={() => router.push(`/wallet/topup-provider?amount=${value}`)} disabled={!valid} />
      }
    >
      <Header title="Top up wallet" />
      <View style={styles.body}>
        <Txt variant="muted">Choose an amount to add to your UrbanLift wallet.</Txt>
        <View style={styles.grid}>
          {PRESETS.map((p) => {
            const active = !custom && amount === p;
            return (
              <Pressable
                key={p}
                onPress={() => {
                  setAmount(p);
                  setCustom('');
                }}
                style={[styles.tile, active && styles.tileActive]}
              >
                <Txt variant="h3" color={active ? colors.primaryDark : colors.text}>
                  {ghsCompact(p)}
                </Txt>
              </Pressable>
            );
          })}
        </View>

        <Input
          label="Or enter a custom amount"
          placeholder="0.00"
          keyboardType="decimal-pad"
          value={custom}
          onChangeText={(t) => {
            setCustom(t.replace(/[^0-9.]/g, ''));
            setAmount(null);
          }}
          left={<Txt variant="bodyStrong" color={colors.textMuted}>GHS</Txt>}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { gap: spacing.lg, marginTop: spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  tile: {
    width: '47%',
    alignItems: 'center',
    paddingVertical: spacing.xl,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  tileActive: { borderColor: colors.primary, backgroundColor: colors.lightGreen },
});
