/**
 * Maps raw API objects → the app's domain types.
 *
 * The backend's response schemas aren't in the OpenAPI spec, so these readers
 * are deliberately tolerant: they accept several likely field names and fall
 * back to sensible defaults. If a real response uses different keys, adjust the
 * lookups here in ONE place — screens never touch raw API shapes.
 */
import type {
  Booking,
  BookingStatus,
  ChatMessage,
  CommunityGroup,
  Driver,
  DriverStats,
  PaymentMethod,
  PaymentProvider,
  Ride,
  Role,
  SavedRoute,
  Trip,
  TripStatus,
  User,
} from '@/types';

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
  in_progress: 'confirmed',
  confirmed: 'confirmed',
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
  // A booking row carries pickup/dropoff/distance but no nested ride; its own
  // `id` is the booking id, so seed the ride's id from `ride_id`.
  const ride = a?.ride ? mapRide(a.ride) : mapRide({ ...a, id: pick(a, 'ride_id') });
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
    authId: pick(p, 'auth_id', 'id'),
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
  const progress = a?.progress ?? {};
  const eta = pick(progress, 'remaining_min') ?? pick(a, 'eta_min', 'eta');
  return {
    ...fallback,
    // Trip phase stays driven by the local simulation; the API status is the
    // booking status (pending/confirmed/…), not a pickup/in-trip phase.
    status: TRIP_STATUS[(pick(a, 'trip_status') ?? '').toLowerCase()] ?? fallback.status,
    driverLocation: !isNaN(lat) && !isNaN(lng) ? { lat, lng } : fallback.driverLocation,
    etaMin: eta != null ? Math.round(Number(eta)) : fallback.etaMin,
    progressPct: fallback.progressPct,
  };
}

// ── New endpoints (wallet, saved routes, community, earnings) ───────────────

const COVER_COLORS = ['#1A7A3C', '#D97706', '#2563EB', '#7C3AED', '#DC2626', '#0891B2'];

export function mapGroup(g: any, joined = true): CommunityGroup {
  const id = String(pick(g, 'id') ?? '');
  const colorIdx = Math.abs(Array.from(id).reduce((a, c) => a + c.charCodeAt(0), 0)) % COVER_COLORS.length;
  return {
    id,
    name: pick(g, 'name') ?? 'Group',
    coverColor: COVER_COLORS[colorIdx],
    route: pick(g, 'description') ?? '',
    memberCount: Number(pick(g, 'member_count') ?? pick(g, 'members_count') ?? 0),
    isPrivate: false,
    description: pick(g, 'description') ?? '',
    joined,
  };
}

export function mapMessage(m: any, myAuthId?: string): ChatMessage {
  const author = m?.users ?? {};
  const authorId = String(pick(m, 'user_id') ?? '');
  return {
    id: String(pick(m, 'id') ?? Math.random()),
    groupId: String(pick(m, 'group_id') ?? ''),
    authorId,
    authorName: pick(author, 'full_name') ?? 'Member',
    authorAvatarUrl: pick(author, 'profile_pic'),
    text: pick(m, 'message', 'text'),
    sentAt: pick(m, 'created_at', 'sent_at') ?? new Date().toISOString(),
    isMe: !!myAuthId && authorId === myAuthId,
  };
}

export function mapSavedRoute(r: any): SavedRoute {
  return {
    id: String(pick(r, 'id') ?? ''),
    label: pick(r, 'route_name', 'label') ?? 'Saved route',
    pickup: pick(r, 'pickup_location') ?? '',
    dropoff: pick(r, 'dropoff_location') ?? '',
  };
}

const PROVIDER_FROM_STRING = (s: string): PaymentProvider => {
  const v = (s ?? '').toLowerCase();
  if (v.includes('voda') || v.includes('telecel')) return 'vodafone';
  if (v.includes('at') || v.includes('airtel') || v.includes('tigo')) return 'at';
  if (v.includes('card') || v.includes('visa') || v.includes('master')) return 'card';
  return 'mtn';
};

export function mapPaymentMethod(p: any): PaymentMethod {
  const acct = pick(p, 'account_number') ?? '';
  const masked = acct.length > 4 ? `•••• ${acct.slice(-4)}` : acct;
  const provider = pick(p, 'method_type') === 'card' ? 'card' : PROVIDER_FROM_STRING(pick(p, 'provider') ?? '');
  return {
    id: Number(pick(p, 'id')),
    provider,
    label: `${pick(p, 'provider') ?? pick(p, 'method_type') ?? 'Account'} · ${masked}`.trim(),
    accountNumber: acct,
  };
}

export function mapEarnings(e: any, online: boolean): DriverStats {
  return {
    online,
    todayEarnings: Number(pick(e, 'today_earnings') ?? 0),
    todayTrips: Number(pick(e, 'today_rides') ?? 0),
    todayHours: 0, // not provided by the API
    weekEarnings: Number(pick(e, 'week_earnings') ?? 0),
    acceptanceRate: 100, // not provided by the API
  };
}
