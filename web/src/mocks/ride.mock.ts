import type { User, Vehicle, Ride, Booking, Trip } from '@/types'

const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

// ── Mock Drivers ─────────────────────────────────────────────────────────────

const drivers: User[] = [
  {
    id: 'drv-001', phoneNumber: '+233541234567', email: 'kofi@example.com',
    fullName: 'Kofi Osei', role: 'driver', authProvider: 'phone',
    profilePhotoUrl: undefined, emergencyContact: '+233201234567',
    isPhoneVerified: true, isEmailVerified: true,
    avgRating: 4.9, totalRatings: 124, referralCode: 'KOFI10',
    isActive: true, createdAt: '2024-01-10T08:00:00Z',
  },
  {
    id: 'drv-002', phoneNumber: '+233557891234', email: 'abena@example.com',
    fullName: 'Abena Asante', role: 'driver', authProvider: 'phone',
    profilePhotoUrl: undefined, emergencyContact: '+233209876543',
    isPhoneVerified: true, isEmailVerified: true,
    avgRating: 4.7, totalRatings: 87, referralCode: 'ABENA10',
    isActive: true, createdAt: '2024-02-15T08:00:00Z',
  },
  {
    id: 'drv-003', phoneNumber: '+233244556677', email: 'kweku@example.com',
    fullName: 'Kweku Darko', role: 'driver', authProvider: 'phone',
    profilePhotoUrl: undefined, emergencyContact: '+233245556677',
    isPhoneVerified: true, isEmailVerified: false,
    avgRating: 4.5, totalRatings: 43, referralCode: 'KWEKU10',
    isActive: true, createdAt: '2024-03-20T08:00:00Z',
  },
]

const vehicles: Vehicle[] = [
  { id: 'veh-001', driverProfileId: 'drv-001', make: 'Toyota', model: 'Corolla', color: 'Silver', licensePlate: 'GR-2341-21', hasAc: true,  hasMusic: true,  allowsPets: false },
  { id: 'veh-002', driverProfileId: 'drv-002', make: 'Honda',  model: 'Accord',  color: 'Black',  licensePlate: 'AS-1122-20', hasAc: true,  hasMusic: false, allowsPets: false },
  { id: 'veh-003', driverProfileId: 'drv-003', make: 'Hyundai',model: 'Elantra', color: 'White',  licensePlate: 'GT-8890-19', hasAc: false, hasMusic: true,  allowsPets: true  },
]

// ── Location coordinates ──────────────────────────────────────────────────────

const COORDS: Record<string, [number, number]> = {
  'East Legon':                      [5.6438, -0.1594],
  'Osu Oxford Street':               [5.5574, -0.1769],
  'Legon Campus':                    [5.6502, -0.1870],
  'Airport City':                    [5.6037, -0.1870],
  'Accra Mall, Tetteh Quarshie':     [5.6301, -0.1769],
  'Kotoka International Airport':    [5.6052, -0.1717],
  'Madina Station':                  [5.6779, -0.1617],
  'Labone':                          [5.5573, -0.1960],
  'Cantonments':                     [5.5622, -0.1716],
  'Spintex Road':                    [5.6300, -0.1200],
  'Ring Road Central':               [5.5600, -0.2100],
  'Kwame Nkrumah Circle':            [5.5500, -0.2166],
  'Accra Central':                   [5.5502, -0.2074],
}

function coords(loc: string): [number, number] {
  return COORDS[loc] ?? [5.6037, -0.1870]
}

// ── Base date helpers ─────────────────────────────────────────────────────────

function todayAt(h: number, m: number) {
  const d = new Date()
  d.setHours(h, m, 0, 0)
  return d.toISOString()
}

function tomorrowAt(h: number, m: number) {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  d.setHours(h, m, 0, 0)
  return d.toISOString()
}

function daysLater(days: number, h: number, m: number) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  d.setHours(h, m, 0, 0)
  return d.toISOString()
}

// ── Mock Rides ────────────────────────────────────────────────────────────────

export const mockRides: Ride[] = [
  {
    id: 'ride-001', driver: drivers[0], vehicle: vehicles[0],
    pickupLocation: 'East Legon', pickupLat: coords('East Legon')[0], pickupLng: coords('East Legon')[1],
    dropoffLocation: 'Accra Central', dropoffLat: coords('Accra Central')[0], dropoffLng: coords('Accra Central')[1],
    departureTime: todayAt(7, 0), estimatedArrivalTime: todayAt(7, 45),
    totalSeats: 4, availableSeats: 2, pricePerSeat: 8,
    tripType: 'one_way', routeDescription: 'Via Boundary Road, Accra-Tema Motorway',
    status: 'scheduled', createdAt: new Date().toISOString(),
  },
  {
    id: 'ride-002', driver: drivers[1], vehicle: vehicles[1],
    pickupLocation: 'Legon Campus', pickupLat: coords('Legon Campus')[0], pickupLng: coords('Legon Campus')[1],
    dropoffLocation: 'Airport City', dropoffLat: coords('Airport City')[0], dropoffLng: coords('Airport City')[1],
    departureTime: todayAt(8, 30), estimatedArrivalTime: todayAt(9, 10),
    totalSeats: 3, availableSeats: 1, pricePerSeat: 12,
    tripType: 'one_way', routeDescription: 'Via Ring Road East',
    status: 'scheduled', createdAt: new Date().toISOString(),
  },
  {
    id: 'ride-003', driver: drivers[2], vehicle: vehicles[2],
    pickupLocation: 'Madina Station', pickupLat: coords('Madina Station')[0], pickupLng: coords('Madina Station')[1],
    dropoffLocation: 'Osu Oxford Street', dropoffLat: coords('Osu Oxford Street')[0], dropoffLng: coords('Osu Oxford Street')[1],
    departureTime: todayAt(9, 0), estimatedArrivalTime: todayAt(9, 50),
    totalSeats: 4, availableSeats: 3, pricePerSeat: 10,
    tripType: 'one_way', routeDescription: 'Via Accra-Aburi Road, Nkrumah Circle',
    status: 'scheduled', createdAt: new Date().toISOString(),
  },
  {
    id: 'ride-004', driver: drivers[0], vehicle: vehicles[0],
    pickupLocation: 'East Legon', pickupLat: coords('East Legon')[0], pickupLng: coords('East Legon')[1],
    dropoffLocation: 'Kotoka International Airport', dropoffLat: coords('Kotoka International Airport')[0], dropoffLng: coords('Kotoka International Airport')[1],
    departureTime: tomorrowAt(5, 30), estimatedArrivalTime: tomorrowAt(6, 10),
    totalSeats: 4, availableSeats: 3, pricePerSeat: 15,
    tripType: 'one_way', routeDescription: 'Express via Accra-Tema Motorway',
    status: 'scheduled', createdAt: new Date().toISOString(),
  },
  {
    id: 'ride-005', driver: drivers[1], vehicle: vehicles[1],
    pickupLocation: 'Spintex Road', pickupLat: coords('Spintex Road')[0], pickupLng: coords('Spintex Road')[1],
    dropoffLocation: 'Kwame Nkrumah Circle', dropoffLat: coords('Kwame Nkrumah Circle')[0], dropoffLng: coords('Kwame Nkrumah Circle')[1],
    departureTime: tomorrowAt(7, 15), estimatedArrivalTime: tomorrowAt(8, 0),
    totalSeats: 3, availableSeats: 2, pricePerSeat: 9,
    tripType: 'one_way', routeDescription: 'Via Liberation Road',
    status: 'scheduled', createdAt: new Date().toISOString(),
  },
  {
    id: 'ride-006', driver: drivers[2], vehicle: vehicles[2],
    pickupLocation: 'Cantonments', pickupLat: coords('Cantonments')[0], pickupLng: coords('Cantonments')[1],
    dropoffLocation: 'Legon Campus', dropoffLat: coords('Legon Campus')[0], dropoffLng: coords('Legon Campus')[1],
    departureTime: daysLater(2, 7, 45), estimatedArrivalTime: daysLater(2, 8, 30),
    totalSeats: 4, availableSeats: 4, pricePerSeat: 11,
    tripType: 'one_way', routeDescription: 'Via Accra-Aburi Road',
    status: 'scheduled', createdAt: new Date().toISOString(),
  },
]

// ── Mock passenger user ───────────────────────────────────────────────────────

export const mockPassenger: User = {
  id: 'usr-001', phoneNumber: '+233541234567', email: 'kwame@example.com',
  fullName: 'Kwame Mensah', role: 'passenger', authProvider: 'phone',
  profilePhotoUrl: undefined, emergencyContact: '+233201234567',
  isPhoneVerified: true, isEmailVerified: false,
  avgRating: 4.8, totalRatings: 42, referralCode: 'KWAME10',
  isActive: true, createdAt: '2024-01-15T08:00:00Z',
}

// ── Mock Bookings (for MyRides) ───────────────────────────────────────────────

export const mockBookings: Booking[] = [
  // Upcoming confirmed
  {
    id: 'bk-001', ride: mockRides[0], passenger: mockPassenger,
    seatsBooked: 1, totalPrice: 8, paymentMethod: 'wallet',
    status: 'confirmed', createdAt: new Date().toISOString(),
  },
  {
    id: 'bk-002', ride: mockRides[3], passenger: mockPassenger,
    seatsBooked: 2, totalPrice: 30, paymentMethod: 'mobile_money',
    status: 'confirmed', createdAt: new Date().toISOString(),
  },
  // Past completed
  {
    id: 'bk-003',
    ride: {
      ...mockRides[1],
      departureTime: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
      estimatedArrivalTime: new Date(Date.now() - 7 * 24 * 3600 * 1000 + 40 * 60000).toISOString(),
      status: 'completed',
    },
    passenger: mockPassenger,
    seatsBooked: 1, totalPrice: 12, paymentMethod: 'cash',
    status: 'completed', createdAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'bk-004',
    ride: {
      ...mockRides[2],
      departureTime: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
      estimatedArrivalTime: new Date(Date.now() - 3 * 24 * 3600 * 1000 + 50 * 60000).toISOString(),
      status: 'completed',
    },
    passenger: mockPassenger,
    seatsBooked: 1, totalPrice: 10, paymentMethod: 'wallet',
    status: 'completed', createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
  },
]

// ── Mock trip (for live tracking) ─────────────────────────────────────────────

export const mockActiveTrip: Trip = {
  id: 'trip-001', ride: mockRides[0], booking: mockBookings[0],
  status: 'navigating_to_pickup',
  currentLat: 5.6350, currentLng: -0.1620,
  startedAt: new Date().toISOString(),
}

// ── Mock API ──────────────────────────────────────────────────────────────────

export const mockRideApi = {
  async searchRides(params: { pickupLocation: string; dropoffLocation: string; date: string; seats: number }): Promise<Ride[]> {
    await delay(800)
    return mockRides.filter(r => {
      const matchPickup  = !params.pickupLocation  || r.pickupLocation.toLowerCase().includes(params.pickupLocation.toLowerCase())
      const matchDropoff = !params.dropoffLocation || r.dropoffLocation.toLowerCase().includes(params.dropoffLocation.toLowerCase())
      const matchSeats   = r.availableSeats >= params.seats
      return matchPickup && matchDropoff && matchSeats
    })
  },

  async getRideById(id: string): Promise<Ride> {
    await delay(400)
    const ride = mockRides.find(r => r.id === id)
    if (!ride) throw new Error('Ride not found')
    return ride
  },

  async bookRide(rideId: string, seatsBooked: number, paymentMethod: 'cash' | 'mobile_money' | 'wallet'): Promise<Booking> {
    await delay(1000)
    const ride = mockRides.find(r => r.id === rideId)
    if (!ride) throw new Error('Ride not found')
    if (ride.availableSeats < seatsBooked) throw new Error('Not enough seats available')
    ride.availableSeats -= seatsBooked
    const booking: Booking = {
      id: `bk-${Date.now()}`,
      ride, passenger: mockPassenger,
      seatsBooked, totalPrice: ride.pricePerSeat * seatsBooked,
      paymentMethod, status: 'confirmed',
      createdAt: new Date().toISOString(),
    }
    mockBookings.unshift(booking)
    return booking
  },

  async cancelBooking(bookingId: string): Promise<void> {
    await delay(600)
    const booking = mockBookings.find(b => b.id === bookingId)
    if (booking) booking.status = 'cancelled'
  },

  async getMyBookings(): Promise<{ upcoming: Booking[]; past: Booking[] }> {
    await delay(600)
    const upcoming = mockBookings.filter(b => b.status === 'confirmed' || b.status === 'pending')
    const past     = mockBookings.filter(b => b.status === 'completed' || b.status === 'cancelled')
    return { upcoming, past }
  },

  async submitReview(data: {
    tripId: string; rating: number; tags: string[]; note?: string
  }): Promise<void> {
    await delay(700)
    void data
  },

  async getActiveTrip(): Promise<Trip | null> {
    await delay(500)
    return mockActiveTrip
  },
}
