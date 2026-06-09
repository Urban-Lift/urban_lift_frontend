import type { LatLng } from '@/types';
import { colors } from '@/theme';

/** Shared contract for the native (WebView) and web (react-leaflet) MapViews. */
export interface MapViewProps {
  origin?: LatLng;
  destination?: LatLng;
  /** 0..1 — driver position along the route. When set, the driver marker shows. */
  progress?: number;
  etaMin?: number;
  height?: number;
}

// Sensible Accra fallback (East Legon → Airport City) for screens that don't
// carry coordinates yet, e.g. the driver navigation views.
export const DEFAULT_ORIGIN: LatLng = { lat: 5.6505, lng: -0.1568 };
export const DEFAULT_DESTINATION: LatLng = { lat: 5.6052, lng: -0.1719 };

export const MAP_COLORS = {
  route: colors.primary,
  origin: colors.primary,
  destination: colors.warning,
  driver: colors.primary,
};

/** Linear interpolation between two points by t in [0,1]. */
export function lerp(a: LatLng, b: LatLng, t: number): LatLng {
  const c = Math.max(0, Math.min(1, t));
  return { lat: a.lat + (b.lat - a.lat) * c, lng: a.lng + (b.lng - a.lng) * c };
}

export function resolveEndpoints(origin?: LatLng, destination?: LatLng) {
  return {
    o: origin ?? DEFAULT_ORIGIN,
    d: destination ?? DEFAULT_DESTINATION,
  };
}
