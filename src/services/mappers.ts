/**
 * Maps raw API objects → the app's domain types.
 *
 * The backend's response schemas aren't in the OpenAPI spec, so these readers
 * are deliberately tolerant: they accept several likely field names and fall
 * back to sensible defaults. If a real response uses different keys, adjust the
 * lookups here in ONE place — screens never touch raw API shapes.
 */
import type { Booking, BookingStatus, Driver, Ride, Role, Trip, TripStatus, User } from '@/types';

const pick = (o: any, ...keys: string[]) => {
  for (const k of keys) if (o?.[k] !== undefined && o?.[k] !== null) return o[k];
  return undefined;
};

/** Unwrap list payloads like `{rides:[...]}`, `{data:[...]}` or a bare array. */
export function asList(res: any): any[] {
  if (Array.isArray(res)) return res;
  return res?.rides ?? res?.bookings ?? res?.results ?? res?.data ?? [];
}

function toIso(date?: string, time?: string): string {
  if (!date) return new Date().toISOString();
  const t = (time ?? '00:00:00').slice(0, 8);
  const d = new Date(`${date}T${t}`);
  return isNaN(+d) ? new Date().toISOString() : d.toISOString();
}

const STATUS: Record<string, BookingStatus> = {
  scheduled: 'confirmed',
  active: 'confirmed',
  pending: 'pending',
  completed: 'completed',
  cancelled: 'cancelled',
  canceled: 'cancelled',
};

export function mapBookingStatus(raw?: string): BookingStatus {
  return STATUS[(raw ?? '').toLowerCase()] ?? 'confirmed';
}

const TRIP_STATUS: Record<string, TripStatus> = {
  scheduled: 'navigating_to_pickup',
  active: 'in_trip',
  completed: 'completed',
  cancelled: 'cancelled',
};

export function mapDriver(a: any): Driver {
  const d = a?.driver ?? a ?? {};
  return {
    id: String(pick(d, 'id', 'driver_id', 'user_id') ?? ''),
    name: pick(d, 'full_name', 'name', 'driver_name') ?? pick(a, 'driver_name') ?? 'Driver',
    avatarUrl: pick(d, 'profile_pic', 'avatar', 'profile_pic_url'),
    rating: Number(pick(d, 'rating', 'driver_rating') ?? 5),
    tripsCount: Number(pick(d, 'trips', 'trips_count', 'total_trips') ?? 0),
    verified: Boolean(pick(d, 'verified', 'is_verified') ?? false),
    vehicle: {
      make: pick(d, 'car_model', 'car_make') ?? pick(a, 'car_model') ?? '',
      model: pick(d, 'model') ?? '',
      color: pick(d, 'car_color') ?? pick(a, 'car_color') ?? '',
      plate: pick(d, 'license_plate_num', 'plate') ?? pick(a, 'license_plate_num') ?? '',
      seats: Number(pick(a, 'available_seats', 'total_seats') ?? 4),
    },
  };
}

export function mapRide(a: any): Ride {
  const seats = Number(pick(a, 'available_seats', 'seats_available') ?? 0);
  return {
    id: String(pick(a, 'id', 'ride_id', '_id') ?? ''),
    driver: mapDriver(a),
    origin: pick(a, 'pickup_location', 'origin') ?? '',
    originCoord: { lat: Number(pick(a, 'pickup_lat') ?? 5.6), lng: Number(pick(a, 'pickup_lng', 'pickup_lon') ?? -0.18) },
    destination: pick(a, 'dropoff_location', 'destination') ?? '',
    destinationCoord: { lat: Number(pick(a, 'dropoff_lat') ?? 5.6), lng: Number(pick(a, 'dropoff_lng', 'dropoff_lon') ?? -0.17) },
    departAt: toIso(pick(a, 'departure_date'), pick(a, 'departure_time')),
    pricePerSeat: Number(pick(a, 'price_per_seat', 'price') ?? 0),
    seatsTotal: Number(pick(a, 'total_seats') ?? seats),
    seatsAvailable: seats,
    amenities: pick(a, 'amenities') ?? [],
    durationMin: Number(pick(a, 'duration_min', 'est_duration') ?? 0),
    distanceKm: Number(pick(a, 'distance_km', 'distance') ?? 0),
  };
}

export function mapBooking(a: any): Booking {
  const ride = a?.ride ? mapRide(a.ride) : mapRide(a);
  const seats = Number(pick(a, 'seats_booked', 'seats') ?? 1);
  return {
    id: String(pick(a, 'id', 'booking_id', '_id') ?? ''),
    ride,
    seats,
    totalPrice: Number(pick(a, 'total_price', 'amount') ?? ride.pricePerSeat * seats),
    status: mapBookingStatus(pick(a, 'trip_status', 'status', 'booking_status')),
    pickup: pick(a, 'pickup_location') ?? ride.origin,
    dropoff: pick(a, 'dropoff_location') ?? ride.destination,
    createdAt: pick(a, 'created_at', 'booked_at') ?? new Date().toISOString(),
  };
}

/** Map the backend user row (from GET /users/profile/create) → app User. */
export function mapProfile(p: any, fallbackRole: Role, phone: string): User {
  return {
    id: String(pick(p, 'id', 'auth_id') ?? phone),
    role: (pick(p, 'role') ?? fallbackRole) as Role,
    name: pick(p, 'full_name', 'name') ?? 'User',
    phone: pick(p, 'phone_number') ?? phone,
    email: pick(p, 'email'),
    avatarUrl: pick(p, 'profile_pic'),
    rating: Number(pick(p, 'rating') ?? 5),
    emergencyContact: pick(p, 'emergency_number'),
  };
}

export function mapTrip(a: any, fallback: Trip): Trip {
  const lat = Number(pick(a, 'driver_lat', 'current_lat', 'lat'));
  const lng = Number(pick(a, 'driver_lng', 'current_lng', 'current_lon', 'lng'));
  return {
    ...fallback,
    status: TRIP_STATUS[(pick(a, 'trip_status', 'status') ?? '').toLowerCase()] ?? fallback.status,
    driverLocation: !isNaN(lat) && !isNaN(lng) ? { lat, lng } : fallback.driverLocation,
    etaMin: Number(pick(a, 'eta_min', 'eta') ?? fallback.etaMin),
    progressPct: Number(pick(a, 'progress', 'progress_pct') ?? fallback.progressPct),
  };
}
