import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Navigation, Phone, ShieldAlert } from 'lucide-react-native';
import { Avatar, Button, Card, MapView, RouteLine, Screen, Txt } from '@/components';
import { useDriverStore } from '@/store/driverStore';
import { ghs } from '@/utils/format';
import { colors, radii, spacing } from '@/theme';

export default function NavigateToPickup() {
  const { rideId } = useLocalSearchParams<{ rideId: string }>();
  const request = useDriverStore((s) => s.activeRequest);
  const setTripStatus = useDriverStore((s) => s.setTripStatus);
  const reset = useDriverStore((s) => s.reset);
  const [progress, setProgress] = useState(0.35);

  if (!request) {
    return (
      <Screen>
        <Txt variant="muted" center>
          No active pickup.
        </Txt>
        <Button label="Back to dashboard" onPress={() => router.replace('/driver/dashboard')} />
      </Screen>
    );
  }

  return (
    <Screen
      padded={false}
      footer={
        <View style={styles.footer}>
          <Button
            label="Arrived — start trip"
            onPress={() => {
              setTripStatus('in_trip');
              router.replace(`/driver/trip/${rideId}`);
            }}
          />
          <Button
            label="Cancel"
            variant="ghost"
            onPress={() =>
              Alert.alert('Cancel pickup?', 'The passenger will be notified.', [
                { text: 'Keep', style: 'cancel' },
                {
                  text: 'Cancel pickup',
                  style: 'destructive',
                  onPress: () => {
                    reset();
                    router.replace('/driver/dashboard');
                  },
                },
              ])
            }
          />
        </View>
      }
    >
      <View style={styles.body}>
        <View style={styles.statusBar}>
          <Navigation size={20} color={colors.primary} />
          <View>
            <Txt variant="h3">Navigating to pickup</Txt>
            <Txt variant="muted">4 min · {request.distanceKm} km to {request.passengerName}</Txt>
          </View>
        </View>

        <MapView progress={progress} etaMin={4} height={300} />

        <Button label="Simulate driving" variant="outline" size="sm" onPress={() => setProgress((p) => Math.min(1, p + 0.2))} />

        <Card>
          <View style={styles.passenger}>
            <Avatar name={request.passengerName} size={48} />
            <View style={styles.flex}>
              <Txt variant="h3">{request.passengerName}</Txt>
              <Txt variant="caption">Earns {ghs(request.estEarnings)} · {request.seats} seat(s)</Txt>
            </View>
            <Button label="Call" size="sm" variant="secondary" icon={<Phone size={16} color={colors.primaryDark} />} onPress={() => {}} fullWidth={false} />
          </View>
          <RouteLine origin={request.pickup} destination={request.dropoff} />
        </Card>

        <Card style={styles.sos} onPress={() => Alert.alert('Emergency', 'Safety team alerted.')}>
          <View style={styles.sosRow}>
            <ShieldAlert size={20} color={colors.error} />
            <Txt variant="bodyStrong" color={colors.error}>
              Emergency
            </Txt>
          </View>
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.xl, gap: spacing.md },
  statusBar: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  passenger: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  flex: { flex: 1 },
  sos: { borderColor: colors.errorLight, backgroundColor: colors.errorLight },
  sosRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, justifyContent: 'center' },
  footer: { gap: spacing.sm },
});
