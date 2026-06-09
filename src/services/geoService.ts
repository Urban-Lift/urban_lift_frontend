/** Geocoding + routing helpers (these endpoints are public — no auth needed). */
import type { LatLng } from '@/types';
import { http } from './api';

export interface RouteInfo {
  distanceKm: number;
  durationMin: number;
  /** Decoded polyline as {lat,lng} points for drawing the route. */
  path: LatLng[];
}

export const geoService = {
  /** Resolve a place name → coordinates. */
  async geocode(address: string): Promise<{ coord: LatLng; displayName: string } | null> {
    const res = await http.postQuery<any>('/geocode', { address });
    if (res?.lat == null) return null;
    return {
      coord: { lat: Number(res.lat), lng: Number(res.lon) },
      displayName: res.display_name ?? address,
    };
  },

  async reverseGeocode(coord: LatLng): Promise<string> {
    const res = await http.postQuery<any>('/reverse_geocode', { lat: coord.lat, lon: coord.lng, zoom: 18 });
    return res?.display_name ?? '';
  },

  /** Real driving distance + route geometry between two points. */
  async route(origin: LatLng, dest: LatLng): Promise<RouteInfo> {
    const res = await http.postForm<any>('/ride/distance', {
      origin_lat: origin.lat,
      origin_lon: origin.lng,
      dest_lat: dest.lat,
      dest_lon: dest.lng,
    });
    const coords: [number, number][] = res?.geometry?.coordinates ?? [];
    return {
      distanceKm: Number(res?.distance_km ?? 0),
      durationMin: Number(res?.duration_min ?? 0),
      // API geometry is [lng, lat]; flip to {lat, lng}.
      path: coords.map(([lng, lat]) => ({ lat, lng })),
    };
  },
};
