import { StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { format } from 'date-fns';
import { Check } from 'lucide-react-native';
import { Button, Card, Screen, Txt } from '@/components';
import { ProviderIcon } from '@/features/wallet/ProviderIcon';
import { providerLabel } from '@/services/walletService';
import type { PaymentProvider } from '@/types';
import { ghs } from '@/utils/format';
import { colors, radii, shadow, spacing } from '@/theme';

export default function TopUpSuccess() {
  const { amount, provider, ref, balance } = useLocalSearchParams<{ amount: string; provider: PaymentProvider; ref: string; balance: string }>();

  return (
    <Screen padded={false} footer={<Button label="Done" onPress={() => router.replace('/wallet')} />}>
      <View style={styles.body}>
        <View style={styles.heroWrap}>
          <View style={styles.glow} />
          <View style={styles.check}><Check size={44} color={colors.white} strokeWidth={3} /></View>
        </View>
        <Txt variant="h1" center>Top-up Successful!</Txt>
        <Txt variant="muted" center>Your wallet has been funded.</Txt>

        <Card style={styles.amountCard}>
          <Txt variant="overline" center>Amount Added</Txt>
          <Txt variant="display" center color={colors.forest}>{ghs(Number(amount))}</Txt>
          <View style={styles.divider} />
          <View style={styles.balRow}>
            <View>
              <Txt variant="bodyStrong">New Balance</Txt>
              <Txt variant="caption">Available now</Txt>
            </View>
            <Txt variant="h2">{ghs(Number(balance))}</Txt>
          </View>
        </Card>

        <View style={styles.details}>
          <Row label="Payment Method" value={<View style={styles.method}><ProviderIcon provider={provider as PaymentProvider} size={20} /><Txt variant="bodyStrong">{providerLabel(provider as PaymentProvider)}</Txt></View>} />
          <Row label="Reference ID" value={<Txt variant="bodyStrong">{String(ref)}</Txt>} />
          <Row label="Date" value={<Txt variant="bodyStrong">{format(new Date(), 'd MMM yyyy · HH:mm')}</Txt>} />
        </View>
      </View>
    </Screen>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <View style={styles.row}>
      <Txt variant="caption">{label}</Txt>
      {value}
    </View>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, paddingHorizontal: spacing.xl, alignItems: 'center', gap: spacing.sm, paddingTop: spacing['4xl'] },
  heroWrap: { alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  glow: { position: 'absolute', width: 120, height: 120, borderRadius: 60, backgroundColor: colors.lightGreen },
  check: { width: 88, height: 88, borderRadius: 44, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', ...shadow.primary },
  amountCard: { alignSelf: 'stretch', alignItems: 'center', marginTop: spacing.lg },
  divider: { height: 1, alignSelf: 'stretch', backgroundColor: colors.borderLight, marginVertical: spacing.lg, borderStyle: 'dashed', borderTopWidth: 1, borderColor: colors.border },
  balRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'stretch' },
  details: { alignSelf: 'stretch', gap: spacing.lg, marginTop: spacing.xl, paddingTop: spacing.lg, borderTopWidth: 1, borderTopColor: colors.borderLight },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  method: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
