import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Line, Path } from 'react-native-svg';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { Navigation } from 'lucide-react-native';
import type { LatLng } from '@/types';
import { colors, fontSize, fontWeight, radii, shadow, spacing } from '@/theme';
import { Txt } from './ui/Typography';

interface Props {
  origin?: LatLng;
  destination?: LatLng;
  /** 0..1 position of the driver along the route. */
  progress?: number;
  etaMin?: number;
  height?: number;
}

/**
 * A lightweight, stylised map. It is NOT a real tile map — it renders a
 * schematic route with origin/destination pins and an animated driver marker,
 * so the tracking and navigation screens look alive without native map builds
 * (which don't run on web). Swap for react-native-maps / Leaflet in Phase 8.
 */
export function MapView({ progress = 0, etaMin, height = 240 }: Props) {
  const pulse = useSharedValue(1);
  useEffect(() => {
    pulse.value = withRepeat(withTiming(1.6, { duration: 1200 }), -1, false);
  }, [pulse]);

  // Schematic route: a gentle curve from bottom-left to top-right.
  const start = { x: 40, y: 220 };
  const end = { x: 300, y: 50 };
  const driver = {
    x: start.x + (end.x - start.x) * progress,
    y: start.y + (end.y - start.y) * progress - Math.sin(progress * Math.PI) * 30,
  };

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: 2 - pulse.value,
  }));

  return (
    <View style={[styles.map, { height }]}>
      <Svg width="100%" height="100%" viewBox="0 0 340 260">
        {/* faux streets */}
        {[60, 120, 180].map((y) => (
          <Line key={`h${y}`} x1={0} y1={y} x2={340} y2={y} stroke={colors.borderLight} strokeWidth={1} />
        ))}
        {[90, 180, 270].map((x) => (
          <Line key={`v${x}`} x1={x} y1={0} x2={x} y2={260} stroke={colors.borderLight} strokeWidth={1} />
        ))}
        {/* route */}
        <Path
          d={`M ${start.x} ${start.y} Q 170 60 ${end.x} ${end.y}`}
          stroke={colors.primary}
          strokeWidth={4}
          strokeLinecap="round"
          fill="none"
        />
        <Circle cx={start.x} cy={start.y} r={7} fill={colors.primary} stroke={colors.white} strokeWidth={2} />
        <Circle cx={end.x} cy={end.y} r={7} fill={colors.warning} stroke={colors.white} strokeWidth={2} />
      </Svg>

      {/* animated driver marker */}
      <View style={[styles.driver, { left: `${(driver.x / 340) * 100}%`, top: `${(driver.y / 260) * 100}%` }]}>
        <Animated.View style={[styles.pulse, pulseStyle]} />
        <View style={styles.driverDot}>
          <Navigation size={14} color={colors.white} fill={colors.white} />
        </View>
      </View>

      {etaMin != null && (
        <View style={styles.etaBadge}>
          <Txt style={styles.etaValue}>{etaMin}</Txt>
          <Txt variant="caption">min away</Txt>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    borderRadius: radii.lg,
    backgroundColor: '#EAF3EC',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  driver: { position: 'absolute', width: 0, height: 0, alignItems: 'center', justifyContent: 'center' },
  pulse: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    marginLeft: -14,
    marginTop: -14,
  },
  driverDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -14,
    marginTop: -14,
    borderWidth: 2,
    borderColor: colors.white,
  },
  etaBadge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
    alignItems: 'center',
    ...shadow.floating,
  },
  etaValue: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.primary },
});
