import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { cn } from '@/utils/cn'

// Fix default marker icons broken by Vite bundling
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const driverIcon = new L.DivIcon({
  html: `<div style="background:#1A7A3C;width:36px;height:36px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.25);display:flex;align-items:center;justify-content:center;">
    <svg width="18" height="18" fill="white" viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>
  </div>`,
  className: '',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
})

const pickupIcon = new L.DivIcon({
  html: `<div style="background:#1A7A3C;width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
  className: '',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
})

const dropoffIcon = new L.DivIcon({
  html: `<div style="background:#D97706;width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
  className: '',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
})

interface LatLng { lat: number; lng: number }

interface MapViewProps {
  center?: LatLng
  zoom?: number
  driverLocation?: LatLng
  pickupLocation?: LatLng
  dropoffLocation?: LatLng
  routePoints?: LatLng[]
  className?: string
  height?: string
}

function FlyTo({ center }: { center: LatLng }) {
  const map = useMap()
  useEffect(() => { map.flyTo([center.lat, center.lng], map.getZoom()) }, [center, map])
  return null
}

const ACCRA_CENTER: LatLng = { lat: 5.6037, lng: -0.1870 }

export default function MapView({
  center = ACCRA_CENTER,
  zoom = 13,
  driverLocation,
  pickupLocation,
  dropoffLocation,
  routePoints,
  className,
  height = 'h-64',
}: MapViewProps) {
  return (
    <div className={cn('rounded-2xl overflow-hidden relative', height, className)}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        className="w-full h-full"
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {driverLocation && (
          <>
            <FlyTo center={driverLocation} />
            <Marker position={[driverLocation.lat, driverLocation.lng]} icon={driverIcon}>
              <Popup>Driver location</Popup>
            </Marker>
          </>
        )}

        {pickupLocation && (
          <Marker position={[pickupLocation.lat, pickupLocation.lng]} icon={pickupIcon}>
            <Popup>Pickup point</Popup>
          </Marker>
        )}

        {dropoffLocation && (
          <Marker position={[dropoffLocation.lat, dropoffLocation.lng]} icon={dropoffIcon}>
            <Popup>Drop-off point</Popup>
          </Marker>
        )}

        {routePoints && routePoints.length > 1 && (
          <Polyline
            positions={routePoints.map(p => [p.lat, p.lng])}
            color="#1A7A3C"
            weight={4}
            opacity={0.8}
          />
        )}
      </MapContainer>
    </div>
  )
}
