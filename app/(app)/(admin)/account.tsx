import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { LogOut, Phone, ShieldCheck } from 'lucide-react-native';
import { Avatar, Button, Card, Header, Screen, Txt } from '@/components';
import { useAuthStore } from '@/store/authStore';
import { colors, radii, spacing } from '@/theme';

export default function AdminAccount() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  function onLogout() {
    logout();
    router.replace('/');
  }

  return (
    <Screen scroll>
      <Header title="Account" back={false} />

      <View style={styles.profile}>
        <View style={styles.avatarWrap}>
          <Avatar name={user?.name ?? 'Admin'} uri={user?.avatarUrl} size={92} />
          <View style={styles.badge}>
            <ShieldCheck size={16} color={colors.white} />
          </View>
        </View>
        <Txt variant="h2">{user?.name ?? 'Admin'}</Txt>
        <View style={styles.rolePill}>
          <Txt variant="captionStrong" color={colors.purple}>Administrator</Txt>
        </View>
      </View>

      <Card style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Phone size={18} color={colors.textMuted} />
          <Txt variant="body">{user?.phone ?? '—'}</Txt>
        </View>
      </Card>

      <Card style={styles.note}>
        <Txt variant="caption">
          Admin tools available here: approve driver registrations and manage user accounts. More controls can be added as the API grows.
        </Txt>
      </Card>

      <Button label="Log Out" variant="danger" icon={<LogOut size={18} color={colors.white} />} onPress={onLogout} />

      <Txt variant="caption" center style={styles.version}>UrbanLift Admin · v1.0.0</Txt>
    </Screen>
  );
}

const styles = StyleSheet.create({
  profile: { alignItems: 'center', gap: spacing.xs, marginTop: spacing.md },
  avatarWrap: { marginBottom: spacing.xs },
  badge: { position: 'absolute', right: 0, bottom: 0, width: 30, height: 30, borderRadius: 15, backgroundColor: colors.purple, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: colors.background },
  rolePill: { backgroundColor: colors.purpleLight, paddingHorizontal: spacing.md, paddingVertical: 4, borderRadius: radii.full },
  infoCard: { marginTop: spacing.lg },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  note: { marginTop: spacing.md, marginBottom: spacing.lg },
  version: { marginTop: spacing.lg },
});
