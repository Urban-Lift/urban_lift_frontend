/**
 * Domain types for UrbanLift. Every store, service and screen imports from
 * here so the shape of the mock data and the real API (later) stay in sync.
 */

export type Role = 'passenger' | 'driver';

export type BookingStatus = 'confirmed' | 'pending' | 'cancelled' | 'completed';

/** Trip state machine: pending → navigating_to_pickup → in_trip → completed. */
export type TripStatus =
  | 'pending'
  | 'navigating_to_pickup'
  | 'arrived'
  | 'in_trip'
  | 'completed'
  | 'cancelled';

export type PaymentProvider = 'mtn' | 'vodafone' | 'at' | 'card';

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Vehicle {
  make: string;
  model: string;
  color: string;
  plate: string;
  year?: string;
  seats: number;
}

export interface User {
  id: string;
  role: Role;
  name: string;
  phone: string;
  email?: string;
  avatarUrl?: string;
  rating: number;
  // driver-only
  vehicle?: Vehicle;
  emergencyContact?: string;
}

export interface Driver {
  id: string;
  name: string;
  avatarUrl?: string;
  rating: number;
  tripsCount: number;
  vehicle: Vehicle;
  verified: boolean;
}

export interface Ride {
  id: string;
  driver: Driver;
  origin: string;
  originCoord: LatLng;
  destination: string;
  destinationCoord: LatLng;
  departAt: string; // ISO datetime
  pricePerSeat: number; // GHS
  seatsTotal: number;
  seatsAvailable: number;
  amenities: string[]; // e.g. ['AC', 'Music', 'Verified']
  durationMin: number;
  distanceKm: number;
}

export interface Booking {
  id: string;
  ride: Ride;
  seats: number;
  totalPrice: number;
  status: BookingStatus;
  pickup: string;
  dropoff: string;
  createdAt: string;
}

export interface Trip {
  id: string;
  bookingId: string;
  ride: Ride;
  status: TripStatus;
  driverLocation: LatLng;
  etaMin: number;
  progressPct: number; // 0..100 along route
}

/** A pending ride request shown to a driver. */
export interface RideRequest {
  id: string;
  passengerName: string;
  passengerAvatarUrl?: string;
  passengerRating: number;
  pickup: string;
  dropoff: string;
  distanceKm: number;
  estEarnings: number;
  seats: number;
}

export interface Transaction {
  id: string;
  type: 'topup' | 'ride' | 'refund' | 'referral';
  label: string;
  amount: number; // positive = credit, negative = debit
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface Wallet {
  balance: number;
  changePct: number; // % change vs last period (for the +% badge)
  linkedAccounts: { provider: PaymentProvider; label: string }[];
  transactions: Transaction[];
}

export interface SavedRoute {
  id: string;
  label: string;
  pickup: string;
  dropoff: string;
}

export interface Review {
  tripId: string;
  rating: number;
  tags: string[];
  note?: string;
}

export interface CommunityGroup {
  id: string;
  name: string;
  coverColor: string;
  route: string;
  memberCount: number;
  isPrivate: boolean;
  description: string;
  joined: boolean;
  trending?: boolean;
}

export interface ChatMessage {
  id: string;
  groupId: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl?: string;
  text?: string;
  rideCardId?: string; // inline shared ride
  sentAt: string;
  isMe: boolean;
}

export interface DriverStats {
  online: boolean;
  todayEarnings: number;
  todayTrips: number;
  todayHours: number;
  weekEarnings: number;
  acceptanceRate: number;
}
