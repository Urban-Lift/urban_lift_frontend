import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { MessageCircle, Phone, ShieldAlert } from 'lucide-react-native';
import { Avatar, Button, Card, MapView, RouteLine, Screen, Txt } from '@/components';
import { useDriverStore } from '@/store/driverStore';
import { ghs } from '@/utils/format';
import { colors, spacing } from '@/theme';

export default function DriverInTrip() {
  const request = useDriverStore((s) => s.activeRequest);
  const reset = useDriverStore((s) => s.reset);
  const [progress, setProgress] = useState(0.2);

  if (!request) {
    return (
      <Screen>
        <Txt variant="muted" center>
          No active trip.
        </Txt>
        <Button label="Back to dashboard" onPress={() => router.replace('/driver/dashboard')} />
      </Screen>
    );
  }

  function complete() {
    reset();
    Alert.alert('Trip complete', `You earned ${ghs(request!.estEarnings)} 🎉`, [
      { text: 'Great', onPress: () => router.replace('/driver/dashboard') },
    ]);
  }

  return (
    <Screen
      padded={false}
      footer={
        <View style={styles.footer}>
          <Button label="Complete trip" onPress={complete} />
        </View>
      }
    >
      <View style={styles.body}>
        <View style={styles.statusBar}>
          <Txt variant="h3">Trip in progress</Txt>
          <Txt variant="muted">Heading to {request.dropoff}</Txt>
        </View>

        <MapView progress={progress} etaMin={Math.max(1, Math.round((1 - progress) * 18))} height={300} />
        <Button label="Simulate driving" variant="outline" size="sm" onPress={() => setProgress((p) => Math.min(1, p + 0.25))} />

        <Card>
          <View style={styles.passenger}>
            <Avatar name={request.passengerName} size={48} />
            <View style={styles.flex}>
              <Txt variant="h3">{request.passengerName}</Txt>
              <Txt variant="caption">Fare {ghs(request.estEarnings)}</Txt>
            </View>
          </View>
          <RouteLine origin={request.pickup} destination={request.dropoff} />
          <View style={styles.contactRow}>
            <Button label="Call" size="sm" variant="secondary" icon={<Phone size={16} color={colors.primaryDark} />} onPress={() => {}} />
            <Button label="Message" size="sm" variant="outline" icon={<MessageCircle size={16} color={colors.primary} />} onPress={() => {}} />
          </View>
        </Card>

        <Card style={styles.sos} onPress={() => Alert.alert('Emergency', 'Safety team alerted.')}>
          <View style={styles.sosRow}>
            <ShieldAlert size={20} color={colors.error} />
            <Txt variant="bodyStrong" color={colors.error}>
              Emergency SOS
            </Txt>
          </View>
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.xl, gap: spacing.md },
  statusBar: { gap: 2 },
  passenger: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  flex: { flex: 1 },
  contactRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  sos: { borderColor: colors.errorLight, backgroundColor: colors.errorLight },
  sosRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, justifyContent: 'center' },
  footer: { gap: spacing.sm },
});
