import type { DriverStats, PassengerRequest, DriverTrip } from '@/types'

const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

// ── Accra coordinates ─────────────────────────────────────────────────────────
// East Legon:   5.6350, -0.1620
// Osu:          5.5558, -0.1865
// Legon Campus: 5.6506, -0.1868
// Airport City: 5.6070, -0.1718
// Adenta:       5.7046, -0.1740
// Madina:       5.6770, -0.1760
// Accra Mall:   5.6369, -0.1718

const mockStats: DriverStats = {
  todayEarnings:   185,
  weekEarnings:    920,
  totalEarnings:   14_320,
  todayTrips:      6,
  totalTrips:      312,
  rating:          4.9,
  acceptanceRate:  92,
}

const mockRequests: PassengerRequest[] = [
  {
    id: 'req-001',
    passenger: { id: 'p-001', fullName: 'Ama Owusu',    rating: 4.8, totalTrips: 34 },
    pickupLocation:  'East Legon, Accra',
    dropoffLocation: 'Osu, Accra',
    pickupLat:  5.6350, pickupLng:  -0.1620,
    dropoffLat: 5.5558, dropoffLng: -0.1865,
    seatsRequested: 1,
    priceOffered:   25,
    distanceKm:     8.2,
    estimatedMinutes: 22,
    requestedAt: new Date(Date.now() - 2 * 60_000).toISOString(),
  },
  {
    id: 'req-002',
    passenger: { id: 'p-002', fullName: 'Kwame Mensah', rating: 4.6, totalTrips: 18 },
    pickupLocation:  'Legon Campus, Accra',
    dropoffLocation: 'Airport City, Accra',
    pickupLat:  5.6506, pickupLng:  -0.1868,
    dropoffLat: 5.6070, dropoffLng: -0.1718,
    seatsRequested: 2,
    priceOffered:   40,
    distanceKm:     6.5,
    estimatedMinutes: 18,
    requestedAt: new Date(Date.now() - 5 * 60_000).toISOString(),
  },
  {
    id: 'req-003',
    passenger: { id: 'p-003', fullName: 'Akua Boateng', rating: 4.9, totalTrips: 71 },
    pickupLocation:  'Madina, Accra',
    dropoffLocation: 'Accra Mall, Accra',
    pickupLat:  5.6770, pickupLng:  -0.1760,
    dropoffLat: 5.6369, dropoffLng: -0.1718,
    seatsRequested: 1,
    priceOffered:   18,
    distanceKm:     4.8,
    estimatedMinutes: 14,
    requestedAt: new Date(Date.now() - 8 * 60_000).toISOString(),
  },
]

const mockActiveTrip: DriverTrip = {
  id: 'dtrip-001',
  passenger: { id: 'p-001', fullName: 'Ama Owusu', rating: 4.8, phoneNumber: '+233541234567' },
  pickupLocation:  'East Legon, Accra',
  dropoffLocation: 'Osu, Accra',
  pickupLat:  5.6350, pickupLng:  -0.1620,
  dropoffLat: 5.5558, dropoffLng: -0.1865,
  status: 'navigating_to_pickup',
  earnings: 25,
  startedAt: new Date(Date.now() - 3 * 60_000).toISOString(),
}

export const mockDriverApi = {
  getStats: async (): Promise<DriverStats> => {
    await delay(400)
    return mockStats
  },

  getRequests: async (): Promise<PassengerRequest[]> => {
    await delay(500)
    return [...mockRequests]
  },

  toggleOnline: async (_online: boolean): Promise<void> => {
    await delay(300)
  },

  acceptRequest: async (requestId: string): Promise<DriverTrip> => {
    await delay(600)
    const req = mockRequests.find(r => r.id === requestId)
    if (!req) throw new Error('Request not found')
    return {
      id: `dtrip-${Date.now()}`,
      passenger: { ...req.passenger, phoneNumber: '+233541234567' },
      pickupLocation:  req.pickupLocation,
      dropoffLocation: req.dropoffLocation,
      pickupLat:  req.pickupLat,  pickupLng:  req.pickupLng,
      dropoffLat: req.dropoffLat, dropoffLng: req.dropoffLng,
      status: 'navigating_to_pickup',
      earnings: req.priceOffered,
      startedAt: new Date().toISOString(),
    }
  },

  declineRequest: async (_requestId: string): Promise<void> => {
    await delay(200)
  },

  getActiveTrip: async (): Promise<DriverTrip | null> => {
    await delay(400)
    return mockActiveTrip
  },

  completeTrip: async (_tripId: string): Promise<void> => {
    await delay(500)
  },
}
