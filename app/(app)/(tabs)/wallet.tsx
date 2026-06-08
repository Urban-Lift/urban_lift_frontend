import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { ArrowDownLeft, ArrowUpRight, Plus, TrendingUp } from 'lucide-react-native';
import { Button, Card, Screen, Spinner, Txt } from '@/components';
import { ProviderIcon } from '@/features/wallet/ProviderIcon';
import { walletService } from '@/services/walletService';
import type { Transaction } from '@/types';
import { ghs, timeAgo } from '@/utils/format';
import { colors, radii, spacing } from '@/theme';

export default function WalletScreen() {
  const { data: wallet } = useQuery({ queryKey: ['wallet'], queryFn: walletService.getWallet });
  if (!wallet) return <Spinner />;

  return (
    <Screen scroll>
      <Txt variant="h2">Wallet</Txt>

      <Card style={styles.balanceCard}>
        <Txt variant="caption" color={colors.lightGreen}>
          Available balance
        </Txt>
        <View style={styles.balanceRow}>
          <Txt variant="h1" color={colors.white}>
            {ghs(wallet.balance)}
          </Txt>
          <View style={styles.badge}>
            <TrendingUp size={12} color={colors.white} />
            <Txt variant="caption" color={colors.white}>
              +{wallet.changePct}%
            </Txt>
          </View>
        </View>
        <View style={styles.topUpBtn}>
          <Button label="Top up" variant="secondary" icon={<Plus size={18} color={colors.primaryDark} />} onPress={() => router.push('/wallet/topup')} />
        </View>
      </Card>

      <View>
        <Txt variant="h3">Linked accounts</Txt>
        {wallet.linkedAccounts.map((a) => (
          <Card key={a.provider} style={styles.linked}>
            <ProviderIcon provider={a.provider} />
            <Txt variant="body">{a.label}</Txt>
          </Card>
        ))}
      </View>

      <View>
        <Txt variant="h3">Recent activity</Txt>
        <Card padded={false} style={styles.activityCard}>
          {wallet.transactions.map((t, i) => (
            <TxnRow key={t.id} txn={t} last={i === wallet.transactions.length - 1} />
          ))}
        </Card>
      </View>
    </Screen>
  );
}

function TxnRow({ txn, last }: { txn: Transaction; last: boolean }) {
  const credit = txn.amount >= 0;
  return (
    <View style={[styles.txnRow, !last && styles.txnDivider]}>
      <View style={[styles.txnIcon, { backgroundColor: credit ? colors.lightGreen : colors.errorLight }]}>
        {credit ? <ArrowDownLeft size={18} color={colors.primary} /> : <ArrowUpRight size={18} color={colors.error} />}
      </View>
      <View style={styles.flex}>
        <Txt variant="bodyStrong">{txn.label}</Txt>
        <Txt variant="caption">{timeAgo(txn.date)}</Txt>
      </View>
      <Txt variant="bodyStrong" color={credit ? colors.primary : colors.text}>
        {credit ? '+' : ''}
        {ghs(txn.amount)}
      </Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  balanceCard: { backgroundColor: colors.primary, borderColor: colors.primary, gap: spacing.sm },
  balanceRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radii.full,
  },
  topUpBtn: { marginTop: spacing.md },
  linked: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.sm },
  activityCard: { marginTop: spacing.sm },
  txnRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg },
  txnDivider: { borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  txnIcon: { width: 38, height: 38, borderRadius: radii.full, alignItems: 'center', justifyContent: 'center' },
  flex: { flex: 1 },
});
