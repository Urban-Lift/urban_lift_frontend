import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Car } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Txt } from '@/components';
import { useAuthStore } from '@/store/authStore';
import { homeRouteFor } from '@/utils/routes';
import { colors, radii, spacing } from '@/theme';

/**
 * Splash / startup. Waits for the persisted auth store to hydrate, then sends
 * logged-in users straight to their role home. Everyone else sees the brand
 * intro with a "Get started" CTA into the auth flow.
 */
export default function Splash() {
  const hydrated = useAuthStore((s) => s.hydrated);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (hydrated && user) {
      router.replace(homeRouteFor(user.role));
    }
  }, [hydrated, user]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.center}>
        <View style={styles.logo}>
          <Car size={48} color={colors.white} />
        </View>
        <Txt variant="h1" center>
          UrbanLift
        </Txt>
        <Txt variant="muted" center style={styles.tagline}>
          Community carpooling for Ghana. Share the ride, split the cost.
        </Txt>
      </View>

      {hydrated && !user ? (
        <View style={styles.actions}>
          <Button label="Get started" onPress={() => router.push('/login')} />
          <Button
            label="I already have an account"
            variant="ghost"
            onPress={() => router.push('/login')}
          />
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background, padding: spacing.xl, justifyContent: 'space-between' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  logo: {
    width: 96,
    height: 96,
    borderRadius: radii['2xl'],
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  tagline: { maxWidth: 300 },
  actions: { gap: spacing.sm, paddingBottom: spacing.lg },
});
