import { useState } from 'react';
import { Alert, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, CornerUpRight, MessageCircle, Phone, ShieldAlert } from 'lucide-react-native';
import { Avatar, Button, MapView, Txt } from '@/components';
import { useDriverStore } from '@/store/driverStore';
import { ghs } from '@/utils/format';
import { colors, radii, shadow, spacing } from '@/theme';

export default function DriverInTrip() {
  const { height } = useWindowDimensions();
  const request = useDriverStore((s) => s.activeRequest);
  const reset = useDriverStore((s) => s.reset);
  const [progress, setProgress] = useState(0.25);

  if (!request) {
    return (
      <SafeAreaView style={styles.empty}>
        <Txt variant="muted" center>No active trip.</Txt>
        <Button label="Back to dashboard" onPress={() => router.replace('/driver-home')} />
      </SafeAreaView>
    );
  }

  function complete() {
    reset();
    Alert.alert('Trip complete', `You earned ${ghs(request!.estEarnings)} 🎉`, [
      { text: 'Great', onPress: () => router.replace('/driver-home') },
    ]);
  }

  const remaining = (4.2 * (1 - progress)).toFixed(1);

  return (
    <View style={styles.root}>
      <View style={{ height: height * 0.55 }}>
        <MapView progress={progress} height={height * 0.55} />
        <SafeAreaView style={styles.overlay} pointerEvents="box-none">
          <View style={styles.topRow}>
            <Pressable style={styles.roundBtn} onPress={() => router.replace('/driver-home')}><ChevronLeft size={22} color={colors.text} /></Pressable>
            <View style={styles.statusCenter}>
              <Txt variant="bodyStrong">On Trip</Txt>
              <Txt variant="overline" color={colors.forest}>Navigating to drop-off</Txt>
            </View>
            <Pressable style={[styles.roundBtn, styles.sos]} onPress={() => Alert.alert('Emergency', 'Safety team alerted.')}><Txt variant="captionStrong" color={colors.white}>SOS</Txt></Pressable>
          </View>

          <View style={styles.turnCard}>
            <View style={styles.turnIcon}><CornerUpRight size={22} color={colors.white} /></View>
            <View style={styles.flex}>
              <Txt variant="caption">In 200m</Txt>
              <Txt variant="bodyStrong">Turn Right onto Independence Ave</Txt>
            </View>
          </View>

          <Pressable style={styles.simulate} onPress={() => setProgress((p) => Math.min(1, p + 0.25))}>
            <Txt variant="caption" color={colors.white}>Simulate driving</Txt>
          </Pressable>
        </SafeAreaView>
      </View>

      <View style={styles.sheet}>
        <View style={styles.handle} />
        <View style={styles.etaRow}>
          <View style={styles.driverRow}>
            <Avatar name={request.passengerName} size={48} />
            <View>
              <Txt variant="bodyStrong">{request.passengerName.split(' ')[0]}</Txt>
              <Txt variant="caption">Fare {ghs(request.estEarnings)}</Txt>
            </View>
          </View>
          <View style={styles.etaRight}>
            <Txt variant="h1" color={colors.forest}>{Math.max(1, Math.round((1 - progress) * 18))} min</Txt>
            <Txt variant="caption">{remaining} km remaining</Txt>
          </View>
        </View>

        <View style={styles.grid}>
          <View style={styles.flex}><Button label="Message" variant="outline" icon={<MessageCircle size={16} color={colors.text} />} onPress={() => {}} /></View>
          <View style={styles.flex}><Button label="Call" icon={<Phone size={16} color={colors.onPrimary} />} onPress={() => {}} /></View>
        </View>
        <View style={styles.grid}>
          <View style={styles.flex}><Button label="Cancel Trip" variant="outline" onPress={() => { reset(); router.replace('/driver-home'); }} /></View>
          <View style={styles.flex}><Button label="Emergency SOS" variant="danger" icon={<ShieldAlert size={16} color={colors.white} />} onPress={() => Alert.alert('Emergency', 'Safety team alerted.')} /></View>
        </View>
        <Button label="Complete Trip" onPress={complete} />
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
  sos: { backgroundColor: colors.error },
  statusCenter: { alignItems: 'center', backgroundColor: colors.surface, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radii.full, ...shadow.card },
  turnCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surface, marginHorizontal: spacing.lg, marginTop: spacing.md, padding: spacing.lg, borderRadius: radii.lg, ...shadow.floating },
  turnIcon: { width: 40, height: 40, borderRadius: radii.sm, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  simulate: { alignSelf: 'center', marginTop: spacing.sm, backgroundColor: 'rgba(11,18,32,0.6)', paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radii.full },
  sheet: { flex: 1, backgroundColor: colors.surface, borderTopLeftRadius: radii['2xl'], borderTopRightRadius: radii['2xl'], marginTop: -24, padding: spacing.xl, gap: spacing.md, ...shadow.floating },
  handle: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border },
  etaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  driverRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  etaRight: { alignItems: 'flex-end' },
  grid: { flexDirection: 'row', gap: spacing.sm },
  flex: { flex: 1 },
});
