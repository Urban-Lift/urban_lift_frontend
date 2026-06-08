import { StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { CheckCircle2 } from 'lucide-react-native';
import { Button, Card, Screen, Txt } from '@/components';
import { providerLabel } from '@/services/walletService';
import type { PaymentProvider } from '@/types';
import { ghs } from '@/utils/format';
import { colors, radii, spacing } from '@/theme';
import { format } from 'date-fns';

export default function TopUpSuccess() {
  const { amount, provider, ref, balance } = useLocalSearchParams<{
    amount: string;
    provider: PaymentProvider;
    ref: string;
    balance: string;
  }>();

  return (
    <Screen
      footer={
        <View style={styles.actions}>
          <Button label="Back to wallet" onPress={() => router.replace('/wallet')} />
        </View>
      }
    >
      <View style={styles.hero}>
        <View style={styles.iconWrap}>
          <CheckCircle2 size={56} color={colors.primary} />
        </View>
        <Txt variant="h1" center>
          Top up successful
        </Txt>
        <Txt variant="muted" center>
          {ghs(Number(amount))} added via {providerLabel(provider as PaymentProvider)}
        </Txt>
      </View>

      <Card>
        <Row label="Amount" value={ghs(Number(amount))} />
        <Row label="New balance" value={ghs(Number(balance))} strong />
        <Row label="Reference" value={String(ref)} />
        <Row label="Date" value={format(new Date(), 'd MMM yyyy, HH:mm')} />
      </Card>
    </Screen>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <View style={styles.row}>
      <Txt variant="caption">{label}</Txt>
      <Txt variant={strong ? 'bodyStrong' : 'body'} color={strong ? colors.primary : colors.text}>
        {value}
      </Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.lg },
  iconWrap: {
    width: 96,
    height: 96,
    borderRadius: radii.full,
    backgroundColor: colors.lightGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: spacing.xs },
  actions: { gap: spacing.sm },
});
