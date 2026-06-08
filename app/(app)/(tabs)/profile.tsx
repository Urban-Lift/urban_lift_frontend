import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Bell, Gift, HelpCircle, LogOut, MapPin, UserCog, Wallet as WalletIcon } from 'lucide-react-native';
import { Avatar, Card, Screen, StarRating, Txt } from '@/components';
import { SettingsRow } from '@/features/profile/SettingsRow';
import { useAuthStore } from '@/store/authStore';
import { walletService } from '@/services/walletService';
import { ghs } from '@/utils/format';
import { colors, spacing } from '@/theme';

export default function Profile() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { data: wallet } = useQuery({ queryKey: ['wallet'], queryFn: walletService.getWallet });

  function onLogout() {
    logout();
    router.replace('/');
  }

  return (
    <Screen scroll>
      <Card style={styles.profileCard}>
        <Avatar name={user?.name ?? 'User'} uri={user?.avatarUrl} size={72} />
        <View style={styles.flex}>
          <Txt variant="h3">{user?.name ?? 'User'}</Txt>
          <StarRating rating={user?.rating ?? 5} showValue size={14} />
          <Txt variant="caption">{user?.phone}</Txt>
        </View>
      </Card>

      <Card style={styles.balanceRow} onPress={() => router.push('/wallet')}>
        <View style={styles.balanceLeft}>
          <WalletIcon size={20} color={colors.primary} />
          <Txt variant="body">Wallet balance</Txt>
        </View>
        <Txt variant="h3" color={colors.primary}>
          {ghs(wallet?.balance ?? 0)}
        </Txt>
      </Card>

      <Card padded={false}>
        <SettingsRow icon={<UserCog size={18} color={colors.primary} />} label="Edit profile" onPress={() => router.push('/profile/edit')} />
        <SettingsRow icon={<MapPin size={18} color={colors.primary} />} label="Saved routes" onPress={() => router.push('/profile/saved-routes')} />
        <SettingsRow icon={<Bell size={18} color={colors.primary} />} label="Notifications" onPress={() => router.push('/profile/notifications')} />
        <SettingsRow icon={<Gift size={18} color={colors.primary} />} label="Refer a friend" onPress={() => router.push('/profile/refer')} />
        <SettingsRow icon={<HelpCircle size={18} color={colors.primary} />} label="Help & support" onPress={() => {}} last />
      </Card>

      <Card padded={false}>
        <SettingsRow icon={<LogOut size={18} color={colors.error} />} label="Log out" onPress={onLogout} danger last />
      </Card>

      <Txt variant="caption" center>
        UrbanLift v1.0.0
      </Txt>
    </Screen>
  );
}

const styles = StyleSheet.create({
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1, gap: 2 },
  balanceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  balanceLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
