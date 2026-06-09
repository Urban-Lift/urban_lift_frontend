import { useState } from 'react';
import { Alert, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, MessageCircle, Navigation, Phone } from 'lucide-react-native';
import { Avatar, Button, MapView, Txt } from '@/components';
import { useDriverStore } from '@/store/driverStore';
import { ghs } from '@/utils/format';
import { colors, radii, shadow, spacing } from '@/theme';

export default function NavigateToPickup() {
  const { rideId } = useLocalSearchParams<{ rideId: string }>();
  const { height } = useWindowDimensions();
  const request = useDriverStore((s) => s.activeRequest);
  const setTripStatus = useDriverStore((s) => s.setTripStatus);
  const reset = useDriverStore((s) => s.reset);
  const [progress, setProgress] = useState(0.4);

  if (!request) {
    return (
      <SafeAreaView style={styles.empty}>
        <Txt variant="muted" center>No active pickup.</Txt>
        <Button label="Back to dashboard" onPress={() => router.replace('/driver-home')} />
      </SafeAreaView>
    );
  }

  function cancel() {
    Alert.alert('Cancel pickup?', 'The passenger will be notified.', [
      { text: 'Keep', style: 'cancel' },
      { text: 'Cancel', style: 'destructive', onPress: () => { reset(); router.replace('/driver-home'); } },
    ]);
  }

  return (
    <View style={styles.root}>
      <View style={{ height: height * 0.55 }}>
        <MapView progress={progress} height={height * 0.55} />
        <SafeAreaView style={styles.overlay} pointerEvents="box-none">
          <View style={styles.topRow}>
            <Pressable style={styles.roundBtn} onPress={() => router.replace('/driver-home')}><ChevronLeft size={22} color={colors.text} /></Pressable>
            <View style={styles.statusPill}>
              <Navigation size={14} color={colors.forest} />
              <Txt variant="captionStrong" color={colors.forest}>Navigating to Pickup</Txt>
            </View>
            <View style={styles.roundBtn} />
          </View>
          <Pressable style={styles.simulate} onPress={() => setProgress((p) => Math.min(1, p + 0.2))}>
            <Txt variant="caption" color={colors.white}>Simulate driving</Txt>
          </Pressable>
        </SafeAreaView>
      </View>

      <View style={styles.sheet}>
        <View style={styles.handle} />
        <View style={styles.etaRow}>
          <View>
            <Txt variant="caption">Estimated Arrival</Txt>
            <Txt variant="h1">Pickup in 5 mins</Txt>
          </View>
          <View style={styles.kmBadge}><Txt variant="captionStrong" color={colors.forest}>{request.distanceKm} km</Txt></View>
        </View>

        <View style={styles.driverRow}>
          <Avatar name={request.passengerName} size={48} />
          <View style={styles.flex}>
            <Txt variant="bodyStrong">{request.passengerName}</Txt>
            <Txt variant="caption">Passenger · earns {ghs(request.estEarnings)}</Txt>
          </View>
          <Pressable style={styles.iconCircle}><MessageCircle size={18} color={colors.text} /></Pressable>
          <Pressable style={[styles.iconCircle, styles.callCircle]}><Phone size={18} color={colors.forest} /></Pressable>
        </View>

        <Button label="I've Arrived — Start Trip" onPress={() => { setTripStatus('in_trip'); router.replace(`/driver/trip/${rideId}`); }} />
        <View style={styles.actions}>
          <View style={styles.flex}><Button label="Emergency" variant="danger" onPress={() => Alert.alert('Emergency', 'Safety team alerted.')} /></View>
          <View style={styles.flex}><Button label="Cancel Trip" variant="outline" onPress={cancel} /></View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  empty: { flex: 1, justifyContent: 'center', padding: spacing.xl, gap: spacing.md, backgroundColor: colors.background },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  roundBtn: { width: 44, height: 44, borderRadius: radii.full, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', ...shadow.card },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.surface, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radii.full, ...shadow.card },
  simulate: { alignSelf: 'center', marginTop: spacing.sm, backgroundColor: 'rgba(11,18,32,0.6)', paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radii.full },
  sheet: { flex: 1, backgroundColor: colors.surface, borderTopLeftRadius: radii['2xl'], borderTopRightRadius: radii['2xl'], marginTop: -24, padding: spacing.xl, gap: spacing.lg, ...shadow.floating },
  handle: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border },
  etaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  kmBadge: { backgroundColor: colors.lightGreen, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radii.full },
  driverRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingTop: spacing.lg, borderTopWidth: 1, borderTopColor: colors.borderLight },
  flex: { flex: 1 },
  iconCircle: { width: 44, height: 44, borderRadius: radii.full, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  callCircle: { backgroundColor: colors.lightGreen },
  actions: { flexDirection: 'row', gap: spacing.sm },
});
