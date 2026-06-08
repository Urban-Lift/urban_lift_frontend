import { Alert, Share, StyleSheet, View } from 'react-native';
import { Copy, Gift, Share2 } from 'lucide-react-native';
import { Button, Card, Header, Screen, Txt } from '@/components';
import { colors, radii, spacing } from '@/theme';

const CODE = 'URBAN-YAA24';

export default function ReferFriend() {
  async function share() {
    try {
      await Share.share({
        message: `Join me on UrbanLift and get GHS 5 off your first ride! Use my code ${CODE}. https://urbanlift.app/r/${CODE}`,
      });
    } catch {
      Alert.alert('Share', 'Sharing is unavailable on this platform.');
    }
  }

  return (
    <Screen scroll footer={<Button label="Share invite link" icon={<Share2 size={18} color={colors.white} />} onPress={share} />}>
      <Header title="Refer a friend" />
      <View style={styles.hero}>
        <View style={styles.iconWrap}>
          <Gift size={40} color={colors.primary} />
        </View>
        <Txt variant="h2" center>
          Give GHS 5, get GHS 5
        </Txt>
        <Txt variant="muted" center>
          Share your code. When a friend takes their first ride, you both earn GHS 5 in wallet credit.
        </Txt>
      </View>

      <Card>
        <Txt variant="caption">Your referral code</Txt>
        <View style={styles.codeRow}>
          <Txt variant="h2" color={colors.primary}>
            {CODE}
          </Txt>
          <Button label="Copy" size="sm" variant="outline" icon={<Copy size={16} color={colors.primary} />} fullWidth={false} onPress={() => Alert.alert('Copied', 'Referral code copied to clipboard.')} />
        </View>
      </Card>

      <Card style={styles.earned}>
        <Txt variant="caption">Credit earned so far</Txt>
        <Txt variant="h1" color={colors.primary}>
          GHS 25
        </Txt>
        <Txt variant="caption">From 5 friends who joined UrbanLift 🎉</Txt>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.lg },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: radii.full,
    backgroundColor: colors.lightGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  codeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.xs },
  earned: { alignItems: 'center', gap: 2 },
});
