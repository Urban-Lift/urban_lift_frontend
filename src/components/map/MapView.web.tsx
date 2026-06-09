import { StyleSheet, View } from 'react-native';
import { CircleMarker, MapContainer, Polyline, TileLayer, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import type { LatLngBoundsExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { colors, fontSize, fontWeight, radii, shadow, spacing } from '@/theme';
import { Txt } from '../ui/Typography';
import { MAP_COLORS, lerp, resolveEndpoints, type MapViewProps } from './mapShared';

/**
 * Web MapView — the same OpenStreetMap map via react-leaflet. Identical props
 * to the native (WebView) version, so screens import one `MapView` and Metro
 * serves the right file per platform.
 */
export function MapView({ origin, destination, progress, etaMin, height = 240 }: MapViewProps) {
  const { o, d } = resolveEndpoints(origin, destination);
  const showDriver = progress != null;
  const driver = showDriver ? lerp(o, d, progress!) : null;

  const bounds: LatLngBoundsExpression = [
    [o.lat, o.lng],
    [d.lat, d.lng],
  ];

  return (
    <View style={[styles.wrap, { height }]}>
      <MapContainer
        bounds={bounds}
        boundsOptions={{ padding: [36, 36] }}
        zoomControl={false}
        attributionControl={false}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <FitBounds bounds={bounds} />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" maxZoom={19} />
        <Polyline positions={[[o.lat, o.lng], [d.lat, d.lng]]} pathOptions={{ color: MAP_COLORS.route, weight: 5, opacity: 0.9 }} />
        <CircleMarker center={[o.lat, o.lng]} radius={7} pathOptions={{ color: '#fff', weight: 2, fillColor: MAP_COLORS.origin, fillOpacity: 1 }} />
        <CircleMarker center={[d.lat, d.lng]} radius={7} pathOptions={{ color: '#fff', weight: 2, fillColor: MAP_COLORS.destination, fillOpacity: 1 }} />
        {driver && (
          <>
            <CircleMarker center={[driver.lat, driver.lng]} radius={16} pathOptions={{ color: MAP_COLORS.driver, weight: 0, fillColor: MAP_COLORS.driver, fillOpacity: 0.2 }} />
            <CircleMarker center={[driver.lat, driver.lng]} radius={8} pathOptions={{ color: '#fff', weight: 3, fillColor: MAP_COLORS.driver, fillOpacity: 1 }} />
          </>
        )}
      </MapContainer>
      {etaMin != null && (
        <View style={styles.etaBadge} pointerEvents="none">
          <Txt style={styles.etaValue}>{etaMin}</Txt>
          <Txt variant="caption">min away</Txt>
        </View>
      )}
    </View>
  );
}

/** Keeps the viewport fitted to the route when endpoints change. */
function FitBounds({ bounds }: { bounds: LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds, { padding: [36, 36] });
  }, [map, bounds]);
  return null;
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radii.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: '#EAF3EC',
    position: 'relative',
  },
  etaBadge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    zIndex: 1000,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
    alignItems: 'center',
    ...shadow.floating,
  },
  etaValue: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.primary },
});
