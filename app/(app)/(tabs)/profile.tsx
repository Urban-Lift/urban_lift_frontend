import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import {
  Bell,
  Gift,
  Headphones,
  LogOut,
  MapPin,
  Settings,
  Star,
  UserCog,
  Wallet as WalletIcon,
} from 'lucide-react-native';
import { Avatar, Card, Gradient, Screen, Txt } from '@/components';
import { SettingsRow } from '@/features/profile/SettingsRow';
import { useAuthStore } from '@/store/authStore';
import { walletService } from '@/services/walletService';
import { ghs } from '@/utils/format';
import { colors, radii, shadow, spacing } from '@/theme';

export default function Profile() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { data: wallet } = useQuery({ queryKey: ['wallet'], queryFn: walletService.getWallet });

  function onLogout() {
    logout();
    router.replace('/');
  }

  return (
    <Screen scroll padded={false}>
      <View style={styles.headerBar}>
        <Txt variant="h3">Profile & Settings</Txt>
      </View>

      <View style={styles.body}>
        <View style={styles.profileTop}>
          <View style={styles.avatarWrap}>
            <Avatar name={user?.name ?? 'User'} uri={user?.avatarUrl} size={92} />
            <Pressable style={styles.gear} onPress={() => router.push('/profile/edit')}>
              <Settings size={16} color={colors.white} />
            </Pressable>
          </View>
          <Txt variant="h2">{user?.name?.split(' ')[0] ?? 'User'}</Txt>
          <View style={styles.ratingPill}>
            <Star size={14} color={colors.gold} fill={colors.gold} />
            <Txt variant="captionStrong">{(user?.rating ?? 5).toFixed(1)} Rating</Txt>
          </View>
        </View>

        <Pressable onPress={() => router.push('/wallet')}>
          <Gradient name="primary" style={styles.balanceBtn}>
            <WalletIcon size={18} color={colors.onPrimary} />
            <Txt variant="bodyStrong" color={colors.onPrimary}>Balance: {ghs(wallet?.balance ?? 0)}</Txt>
          </Gradient>
        </Pressable>

        <Card padded={false}>
          <SettingsRow icon={<UserCog size={18} color={colors.forest} />} label="Edit Profile" onPress={() => router.push('/profile/edit')} />
          <SettingsRow icon={<MapPin size={18} color={colors.forest} />} label="Saved Routes" onPress={() => router.push('/profile/saved-routes')} />
          <SettingsRow icon={<Bell size={18} color={colors.forest} />} label="Notifications" onPress={() => router.push('/profile/notifications')} last />
        </Card>

        <Card padded={false}>
          <SettingsRow icon={<Headphones size={18} color={colors.forest} />} label="Help & Support" onPress={() => {}} />
          <SettingsRow icon={<Gift size={18} color={colors.forest} />} label="Refer a Friend" subtitle="Earn GHS 10.00 credit" onPress={() => router.push('/profile/refer')} last />
        </Card>

        <Card padded={false}>
          <SettingsRow icon={<LogOut size={18} color={colors.error} />} label="Log Out" onPress={onLogout} danger last />
        </Card>

        <Txt variant="caption" center style={styles.version}>Version 2.4.1 (Accra Beta)</Txt>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerBar: { alignItems: 'center', paddingVertical: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  body: { padding: spacing.xl, gap: spacing.md },
  profileTop: { alignItems: 'center', gap: spacing.xs },
  avatarWrap: { marginBottom: spacing.xs },
  gear: { position: 'absolute', right: 0, bottom: 0, width: 30, height: 30, borderRadius: 15, backgroundColor: colors.forest, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: colors.background },
  ratingPill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.surfaceAlt, paddingHorizontal: spacing.md, paddingVertical: 5, borderRadius: radii.full },
  balanceBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, paddingVertical: spacing.lg, borderRadius: radii.md, ...shadow.primary },
  version: { marginTop: spacing.sm },
});
