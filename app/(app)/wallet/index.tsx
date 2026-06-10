import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { ArrowDownLeft, ArrowUpRight, Check, Plus, TrendingUp } from 'lucide-react-native';
import { Button, Card, Gradient, Header, Screen, Spinner, Txt } from '@/components';
import { ProviderIcon } from '@/features/wallet/ProviderIcon';
import { walletService } from '@/services/walletService';
import type { Transaction } from '@/types';
import { ghs, timeAgo } from '@/utils/format';
import { colors, radii, shadow, spacing } from '@/theme';

export default function WalletScreen() {
  const { data: wallet } = useQuery({ queryKey: ['wallet'], queryFn: walletService.getWallet });
  if (!wallet) return <Spinner />;

  return (
    <Screen scroll padded={false}>
      <Header title="My Wallet" />
      <View style={styles.body}>
        <Gradient name="heroDark" style={styles.balanceCard}>
          <Txt variant="overline" color={colors.lightGreen}>Total Balance</Txt>
          <Txt variant="display" color={colors.white}>{ghs(wallet.balance)}</Txt>
          <View style={styles.changePill}>
            <TrendingUp size={13} color={colors.primary} />
            <Txt variant="captionStrong" color={colors.primary}>+{wallet.changePct}% this month</Txt>
          </View>
          <View style={styles.topUpBtn}>
            <Button label="Top Up Wallet" icon={<Plus size={18} color={colors.onPrimary} />} onPress={() => router.push('/wallet/topup')} />
          </View>
        </Gradient>

        <View style={styles.sectionHead}>
          <Txt variant="h3">Linked Accounts</Txt>
          <Txt variant="captionStrong" color={colors.forest}>Manage</Txt>
        </View>
        {wallet.linkedAccounts.length === 0 ? (
          <Card>
            <Txt variant="caption" center>No payment methods linked yet.</Txt>
          </Card>
        ) : null}
        {wallet.linkedAccounts.map((a, i) => (
          <Card key={a.id} style={styles.linked}>
            <ProviderIcon provider={a.provider} />
            <View style={styles.flex}>
              <Txt variant="bodyStrong">{a.label.split(' · ')[0]}</Txt>
              <Txt variant="caption">{a.label.split(' · ')[1]}</Txt>
            </View>
            {i === 0 ? (
              <View style={styles.checkOn}><Check size={14} color={colors.white} strokeWidth={3} /></View>
            ) : (
              <View style={styles.radio} />
            )}
          </Card>
        ))}
        <Card style={styles.linkNew}>
          <Plus size={18} color={colors.textMuted} />
          <Txt variant="captionStrong" color={colors.textMuted}>Link new method</Txt>
        </Card>

        <View style={styles.sectionHead}>
          <Txt variant="h3">Recent Activity</Txt>
          <Txt variant="captionStrong" color={colors.forest}>View All</Txt>
        </View>
        <Card padded={wallet.transactions.length === 0}>
          {wallet.transactions.length === 0 ? (
            <Txt variant="caption" center>No transactions yet.</Txt>
          ) : (
            wallet.transactions.map((t, i) => (
              <TxnRow key={t.id} txn={t} last={i === wallet.transactions.length - 1} />
            ))
          )}
        </Card>
      </View>
    </Screen>
  );
}

function TxnRow({ txn, last }: { txn: Transaction; last: boolean }) {
  const credit = txn.amount >= 0;
  return (
    <View style={[styles.txn, !last && styles.txnDivider]}>
      <View style={[styles.txnIcon, { backgroundColor: credit ? colors.lightGreen : colors.errorLight }]}>
        {credit ? <ArrowDownLeft size={18} color={colors.forest} /> : <ArrowUpRight size={18} color={colors.error} />}
      </View>
      <View style={styles.flex}>
        <Txt variant="bodyStrong">{txn.label}</Txt>
        <Txt variant="caption">{timeAgo(txn.date)}</Txt>
      </View>
      <Txt variant="bodyStrong" color={credit ? colors.forest : colors.text}>{credit ? '+ ' : '– '}{ghs(Math.abs(txn.amount))}</Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.xl, paddingTop: spacing.sm, gap: spacing.md },
  flex: { flex: 1 },
  balanceCard: { borderRadius: radii.xl, padding: spacing.xl, alignItems: 'center', gap: spacing.xs, ...shadow.card },
  changePill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.12)', paddingHorizontal: spacing.md, paddingVertical: 5, borderRadius: radii.full, marginTop: spacing.xs },
  topUpBtn: { alignSelf: 'stretch', marginTop: spacing.lg },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.sm },
  linked: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  checkOn: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: colors.border },
  linkNew: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, borderStyle: 'dashed', borderColor: colors.border, backgroundColor: 'transparent', borderWidth: 1.5 },
  txn: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg },
  txnDivider: { borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  txnIcon: { width: 40, height: 40, borderRadius: radii.full, alignItems: 'center', justifyContent: 'center' },
});
