/**
 * Seed data for UrbanLift, themed around real Accra locations. The mock
 * service layer (src/services) reads from here with simulated network delays,
 * so swapping in a real API later only means changing the services.
 */
import type {
  Booking,
  ChatMessage,
  CommunityGroup,
  Driver,
  DriverStats,
  Ride,
  RideRequest,
  SavedRoute,
  Transaction,
  Wallet,
} from '@/types';

export const PLACES = [
  'East Legon',
  'Osu',
  'Legon Campus',
  'Airport City',
  'Madina',
  'Spintex',
  'Tema',
  'Achimota',
  'Dansoman',
  'Adenta',
  'Circle',
  'Labadi',
];

export const drivers: Driver[] = [
  {
    id: 'd1',
    name: 'Kwame Mensah',
    rating: 4.9,
    tripsCount: 1280,
    verified: true,
    vehicle: { make: 'Toyota', model: 'Corolla', color: 'Silver', plate: 'GR 4821-23', year: '2019', seats: 4 },
  },
  {
    id: 'd2',
    name: 'Ama Owusu',
    rating: 4.8,
    tripsCount: 642,
    verified: true,
    vehicle: { make: 'Honda', model: 'Civic', color: 'Black', plate: 'GT 1190-22', year: '2020', seats: 4 },
  },
  {
    id: 'd3',
    name: 'Kofi Adjei',
    rating: 4.7,
    tripsCount: 305,
    verified: true,
    vehicle: { make: 'Kia', model: 'Picanto', color: 'White', plate: 'GW 7733-21', year: '2018', seats: 3 },
  },
  {
    id: 'd4',
    name: 'Akosua Boateng',
    rating: 5.0,
    tripsCount: 88,
    verified: false,
    vehicle: { make: 'Hyundai', model: 'Accent', color: 'Blue', plate: 'GE 2255-24', year: '2021', seats: 4 },
  },
];

function iso(hoursFromNow: number): string {
  return new Date(Date.now() + hoursFromNow * 3600_000).toISOString();
}

export const rides: Ride[] = [
  {
    id: 'r1',
    driver: drivers[0],
    origin: 'East Legon',
    originCoord: { lat: 5.6505, lng: -0.1568 },
    destination: 'Airport City',
    destinationCoord: { lat: 5.6052, lng: -0.1719 },
    departAt: iso(1.5),
    pricePerSeat: 15,
    seatsTotal: 4,
    seatsAvailable: 2,
    amenities: ['AC', 'Music', 'Verified'],
    durationMin: 22,
    distanceKm: 8.4,
  },
  {
    id: 'r2',
    driver: drivers[1],
    origin: 'Madina',
    originCoord: { lat: 5.6837, lng: -0.1666 },
    destination: 'Legon Campus',
    destinationCoord: { lat: 5.6515, lng: -0.1869 },
    departAt: iso(0.75),
    pricePerSeat: 8,
    seatsTotal: 4,
    seatsAvailable: 3,
    amenities: ['AC', 'Verified'],
    durationMin: 15,
    distanceKm: 5.1,
  },
  {
    id: 'r3',
    driver: drivers[2],
    origin: 'Osu',
    originCoord: { lat: 5.5571, lng: -0.182 },
    destination: 'Tema',
    destinationCoord: { lat: 5.6698, lng: -0.0166 },
    departAt: iso(3),
    pricePerSeat: 25,
    seatsTotal: 3,
    seatsAvailable: 1,
    amenities: ['Music'],
    durationMin: 45,
    distanceKm: 24.6,
  },
  {
    id: 'r4',
    driver: drivers[3],
    origin: 'Spintex',
    originCoord: { lat: 5.6359, lng: -0.1052 },
    destination: 'Circle',
    destinationCoord: { lat: 5.5709, lng: -0.2074 },
    departAt: iso(2),
    pricePerSeat: 18,
    seatsTotal: 4,
    seatsAvailable: 4,
    amenities: ['AC', 'Music', 'Verified'],
    durationMin: 35,
    distanceKm: 16.2,
  },
];

export const bookings: Booking[] = [
  {
    id: 'b1',
    ride: rides[0],
    seats: 1,
    totalPrice: 15,
    status: 'confirmed',
    pickup: 'East Legon, A&C Mall',
    dropoff: 'Airport City, Terminal 3',
    createdAt: iso(-2),
  },
  {
    id: 'b2',
    ride: rides[1],
    seats: 2,
    totalPrice: 16,
    status: 'pending',
    pickup: 'Madina Market',
    dropoff: 'Legon Main Gate',
    createdAt: iso(-1),
  },
  {
    id: 'b3',
    ride: rides[2],
    seats: 1,
    totalPrice: 25,
    status: 'completed',
    pickup: 'Osu Oxford St',
    dropoff: 'Tema Community 1',
    createdAt: iso(-72),
  },
  {
    id: 'b4',
    ride: rides[3],
    seats: 1,
    totalPrice: 18,
    status: 'cancelled',
    pickup: 'Spintex Road',
    dropoff: 'Kwame Nkrumah Circle',
    createdAt: iso(-120),
  },
];

export const rideRequests: RideRequest[] = [
  {
    id: 'req1',
    passengerName: 'Yaa Asantewaa',
    passengerRating: 4.8,
    pickup: 'East Legon, A&C Mall',
    dropoff: 'Airport City',
    distanceKm: 1.2,
    estEarnings: 15,
    seats: 1,
  },
  {
    id: 'req2',
    passengerName: 'Kojo Antwi',
    passengerRating: 4.6,
    pickup: 'Shiashie',
    dropoff: 'Airport City',
    distanceKm: 2.4,
    estEarnings: 18,
    seats: 2,
  },
  {
    id: 'req3',
    passengerName: 'Efua Sutherland',
    passengerRating: 5.0,
    pickup: 'Bawaleshie',
    dropoff: 'Airport City',
    distanceKm: 0.8,
    estEarnings: 12,
    seats: 1,
  },
];

export const driverStats: DriverStats = {
  online: false,
  todayEarnings: 142.5,
  todayTrips: 6,
  todayHours: 4.5,
  weekEarnings: 820,
  acceptanceRate: 92,
};

const transactions: Transaction[] = [
  { id: 't1', type: 'topup', label: 'Top up · MTN MoMo', amount: 50, date: iso(-3), status: 'completed' },
  { id: 't2', type: 'ride', label: 'Ride · East Legon → Airport', amount: -15, date: iso(-26), status: 'completed' },
  { id: 't3', type: 'referral', label: 'Referral bonus · Ama', amount: 5, date: iso(-50), status: 'completed' },
  { id: 't4', type: 'ride', label: 'Ride · Osu → Tema', amount: -25, date: iso(-74), status: 'completed' },
  { id: 't5', type: 'topup', label: 'Top up · Vodafone Cash', amount: 20, date: iso(-100), status: 'completed' },
];

export const wallet: Wallet = {
  balance: 87.5,
  changePct: 12,
  linkedAccounts: [
    { provider: 'mtn', label: 'MTN MoMo · 024 •••• 21' },
    { provider: 'vodafone', label: 'Vodafone Cash · 050 •••• 88' },
  ],
  transactions,
};

export const savedRoutes: SavedRoute[] = [
  { id: 'sr1', label: 'Home → Work', pickup: 'Adenta', dropoff: 'Airport City' },
  { id: 'sr2', label: 'Campus run', pickup: 'Madina', dropoff: 'Legon Campus' },
];

export const communityGroups: CommunityGroup[] = [
  {
    id: 'g1',
    name: 'Legon Campus Riders',
    coverColor: '#1A7A3C',
    route: 'Madina ↔ Legon Campus',
    memberCount: 1240,
    isPrivate: false,
    description: 'Daily carpools for UG students and staff. Be kind, split fair.',
    joined: true,
  },
  {
    id: 'g2',
    name: 'East Legon → Airport',
    coverColor: '#D97706',
    route: 'East Legon ↔ Airport City',
    memberCount: 860,
    isPrivate: false,
    description: 'Morning commuters heading to Airport City offices.',
    joined: true,
  },
  {
    id: 'g3',
    name: 'Tema Express Pool',
    coverColor: '#2563EB',
    route: 'Osu ↔ Tema',
    memberCount: 430,
    isPrivate: true,
    description: 'Evening pool to Tema communities. Verified members only.',
    joined: false,
    trending: true,
  },
  {
    id: 'g4',
    name: 'Spintex Movers',
    coverColor: '#7C3AED',
    route: 'Spintex ↔ Circle',
    memberCount: 615,
    isPrivate: false,
    description: 'Beat the Spintex traffic together.',
    joined: false,
    trending: true,
  },
];

export const chatMessages: Record<string, ChatMessage[]> = {
  g1: [
    { id: 'm1', groupId: 'g1', authorId: 'd2', authorName: 'Ama Owusu', text: 'Leaving Madina at 7:30, 2 seats left 🚗', sentAt: iso(-1.2), isMe: false },
    { id: 'm2', groupId: 'g1', authorId: 'me', authorName: 'You', text: 'I can join! Picking up at the market?', sentAt: iso(-1.1), isMe: true },
    { id: 'm3', groupId: 'g1', authorId: 'd2', authorName: 'Ama Owusu', rideCardId: 'r2', sentAt: iso(-1.05), isMe: false },
    { id: 'm4', groupId: 'g1', authorId: 'd1', authorName: 'Kwame Mensah', text: 'Booked, see you there 👍', sentAt: iso(-1), isMe: false },
  ],
  g2: [
    { id: 'm5', groupId: 'g2', authorId: 'd1', authorName: 'Kwame Mensah', text: 'Anyone heading to Airport City around 8?', sentAt: iso(-0.5), isMe: false },
  ],
};
