// ── Enums ─────────────────────────────────────────────────────────────────────
export type UserRole = 'passenger' | 'driver' | 'both'
export type AuthProvider = 'phone' | 'google'
export type OtpType = 'phone' | 'email'
export type TripType = 'one_way' | 'round_trip'
export type RideStatus = 'scheduled' | 'active' | 'completed' | 'cancelled'
export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
export type TripStatus = 'navigating_to_pickup' | 'in_trip' | 'completed' | 'cancelled'
export type TxnType = 'top_up' | 'ride_payment' | 'ride_earning' | 'referral_credit'
export type TxnDirection = 'credit' | 'debit'
export type TxnStatus = 'pending' | 'completed' | 'failed'
export type PaymentProvider = 'mtn_momo' | 'vodafone_cash' | 'at_money' | 'card' | 'cash'
export type GroupPrivacy = 'public' | 'private'
export type MemberRole = 'admin' | 'member'
export type ReferralStatus = 'pending' | 'rewarded'

// ── Core entities ─────────────────────────────────────────────────────────────
export interface User {
  id: string
  phoneNumber: string
  email?: string
  fullName: string
  profilePhotoUrl?: string
  role: UserRole
  authProvider: AuthProvider
  emergencyContact?: string
  isPhoneVerified: boolean
  isEmailVerified: boolean
  avgRating: number
  totalRatings: number
  referralCode: string
  isActive: boolean
  createdAt: string
}

export interface DriverProfile {
  id: string
  userId: string
  isOnline: boolean
  totalTrips: number
  hoursWorked: number
  isVerified: boolean
  isSuperDriver?: boolean
}

export interface Vehicle {
  id: string
  driverProfileId: string
  make: string
  model: string
  color: string
  licensePlate: string
  hasAc: boolean
  hasMusic: boolean
  allowsPets: boolean
}

export interface Ride {
  id: string
  driver: User
  vehicle: Vehicle
  pickupLocation: string
  pickupLat: number
  pickupLng: number
  dropoffLocation: string
  dropoffLat: number
  dropoffLng: number
  departureTime: string
  estimatedArrivalTime: string
  totalSeats: number
  availableSeats: number
  pricePerSeat: number
  tripType: TripType
  routeDescription?: string
  status: RideStatus
  createdAt: string
}

export interface Booking {
  id: string
  ride: Ride
  passenger: User
  seatsBooked: number
  totalPrice: number
  paymentMethod: 'cash' | 'mobile_money' | 'wallet'
  status: BookingStatus
  createdAt: string
}

export interface Trip {
  id: string
  ride: Ride
  booking: Booking
  status: TripStatus
  currentLat?: number
  currentLng?: number
  startedAt?: string
  endedAt?: string
}

export interface Review {
  id: string
  tripId: string
  reviewer: User
  reviewee: User
  rating: number
  tags: ReviewTag[]
  note?: string
  createdAt: string
}

export type ReviewTag =
  | 'safe_driver'
  | 'clean_car'
  | 'friendly'
  | 'on_time'
  | 'great_music'

// ── Wallet & Payments ─────────────────────────────────────────────────────────
export interface Wallet {
  id: string
  userId: string
  balance: number
  currency: string
  updatedAt: string
}

export interface Transaction {
  id: string
  walletId: string
  type: TxnType
  amount: number
  direction: TxnDirection
  paymentProvider?: PaymentProvider
  referenceId?: string
  description: string
  status: TxnStatus
  createdAt: string
}

export interface PaymentMethod {
  id: string
  userId: string
  provider: PaymentProvider
  accountNumber: string
  isDefault: boolean
  isActive: boolean
}

// ── Community ─────────────────────────────────────────────────────────────────
export interface CommunityGroup {
  id: string
  creator: User
  name: string
  primaryRoute?: string
  description?: string
  coverImageUrl?: string
  privacy: GroupPrivacy
  memberCount: number
  createdAt: string
  isJoined?: boolean
}

export interface GroupMessage {
  id: string
  groupId: string
  sender: User
  ride?: Ride
  content?: string
  createdAt: string
}

// ── Misc ──────────────────────────────────────────────────────────────────────
export interface SavedRoute {
  id: string
  userId: string
  label?: string
  pickupLocation: string
  dropoffLocation: string
}

export interface Notification {
  id: string
  userId: string
  type: string
  title: string
  body: string
  isRead: boolean
  createdAt: string
}

// ── API shapes ────────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

export interface RideSearchParams {
  pickupLocation: string
  dropoffLocation: string
  date: string
  time: string
  seats: number
  tripType: TripType
}

// ── Driver Feature ────────────────────────────────────────────────────────────
export interface DriverStats {
  todayEarnings: number
  weekEarnings: number
  totalEarnings: number
  todayTrips: number
  totalTrips: number
  rating: number
  acceptanceRate: number
}

export interface PassengerRequest {
  id: string
  passenger: {
    id: string
    fullName: string
    rating: number
    totalTrips: number
  }
  pickupLocation: string
  dropoffLocation: string
  pickupLat: number
  pickupLng: number
  dropoffLat: number
  dropoffLng: number
  seatsRequested: number
  priceOffered: number
  distanceKm: number
  estimatedMinutes: number
  requestedAt: string
}

export interface DriverTrip {
  id: string
  passenger: {
    id: string
    fullName: string
    rating: number
    phoneNumber: string
  }
  pickupLocation: string
  dropoffLocation: string
  pickupLat: number
  pickupLng: number
  dropoffLat: number
  dropoffLng: number
  status: 'navigating_to_pickup' | 'in_trip' | 'completed'
  earnings: number
  startedAt: string
}
