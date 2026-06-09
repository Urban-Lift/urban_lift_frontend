import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { ArrowRight, Leaf, PiggyBank, Users } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Gradient, Txt } from '@/components';
import { useAuthStore } from '@/store/authStore';
import { homeRouteFor } from '@/utils/routes';
import { colors, fonts, radii, shadow, spacing } from '@/theme';

/** Splash / startup. Sends logged-in users to their role home; everyone else
 *  sees the brand intro with a "Get started" CTA. */
export default function Splash() {
  const hydrated = useAuthStore((s) => s.hydrated);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (hydrated && user) router.replace(homeRouteFor(user.role));
  }, [hydrated, user]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.skipRow}>
        <Pressable onPress={() => router.push('/login')} hitSlop={8}>
          <Txt variant="bodyStrong" color={colors.textMuted}>
            Skip
          </Txt>
        </Pressable>
      </View>

      <View style={styles.center}>
        <View style={styles.logoWrap}>
          <Gradient name="hero" style={styles.logo}>
            <Txt style={styles.logoText}>UL</Txt>
          </Gradient>
          <View style={styles.logoDot} />
        </View>

        <Txt style={styles.wordmark}>
          Urban<Txt style={[styles.wordmark, { color: colors.primary }]}>Lift</Txt>
        </Txt>

        <View style={styles.headline}>
          <Txt variant="h1" center>
            Move Together,
          </Txt>
          <Txt variant="h1" center color={colors.forest}>
            Grow Together
          </Txt>
        </View>
        <Txt variant="muted" center style={styles.tagline}>
          The community carpooling app designed for your city.
        </Txt>

        <View style={styles.features}>
          <Feature icon={<Leaf size={22} color={colors.forest} />} bg={colors.lightGreen} title="Green" sub="Reduce CO₂" />
          <Feature icon={<Users size={22} color={colors.gold} />} bg={colors.warningLight} title="Social" sub="Meet people" />
          <Feature icon={<PiggyBank size={22} color={colors.info} />} bg={colors.infoLight} title="Save" sub="Cut costs" />
        </View>
      </View>

      <View style={styles.actions}>
        <Button label="Get Started" icon={<ArrowRight size={20} color={colors.onPrimary} />} onPress={() => router.push('/login')} />
        <View style={styles.loginRow}>
          <Txt variant="caption">Have an account?</Txt>
          <Pressable onPress={() => router.push('/login')} hitSlop={8}>
            <Txt variant="captionStrong" color={colors.forest}>
              Log in
            </Txt>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

function Feature({ icon, bg, title, sub }: { icon: React.ReactNode; bg: string; title: string; sub: string }) {
  return (
    <View style={styles.feature}>
      <View style={[styles.featureIcon, { backgroundColor: bg }]}>{icon}</View>
      <Txt variant="captionStrong">{title}</Txt>
      <Txt variant="caption" style={styles.featureSub}>
        {sub}
      </Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.xl },
  skipRow: { alignItems: 'flex-end', paddingVertical: spacing.sm },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  logoWrap: { marginBottom: spacing.sm },
  logo: { width: 88, height: 88, borderRadius: radii['2xl'], alignItems: 'center', justifyContent: 'center', ...shadow.primary },
  logoText: { fontFamily: fonts.extrabold, fontSize: 34, color: colors.white },
  logoDot: { position: 'absolute', top: -2, right: -2, width: 20, height: 20, borderRadius: 10, backgroundColor: colors.gold, borderWidth: 3, borderColor: colors.background },
  wordmark: { fontFamily: fonts.extrabold, fontSize: 26, color: colors.text, letterSpacing: -0.5 },
  headline: { marginTop: spacing.lg },
  tagline: { maxWidth: 280, marginTop: spacing.xs },
  features: { flexDirection: 'row', gap: spacing.md, marginTop: spacing['2xl'], alignSelf: 'stretch' },
  feature: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xs,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  featureIcon: { width: 46, height: 46, borderRadius: radii.full, alignItems: 'center', justifyContent: 'center' },
  featureSub: { fontSize: 11, textAlign: 'center' },
  actions: { gap: spacing.md, paddingBottom: spacing.xl },
  loginRow: { flexDirection: 'row', justifyContent: 'center', gap: spacing.xs },
});
