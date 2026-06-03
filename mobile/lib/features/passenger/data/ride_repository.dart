import '../../auth/data/auth_models.dart';
import 'ride_models.dart';

Future<void> _delay(int ms) => Future.delayed(Duration(milliseconds: ms));

// ── Mock drivers ──────────────────────────────────────────────────────────────

final _drivers = [
  const UserModel(
    id: 'drv-001', phoneNumber: '+233541234567', fullName: 'Kofi Osei',
    role: 'driver', avgRating: 4.9, totalRatings: 124, referralCode: 'KOFI10',
  ),
  const UserModel(
    id: 'drv-002', phoneNumber: '+233557891234', fullName: 'Abena Asante',
    role: 'driver', avgRating: 4.7, totalRatings: 87, referralCode: 'ABENA10',
  ),
  const UserModel(
    id: 'drv-003', phoneNumber: '+233244556677', fullName: 'Kweku Darko',
    role: 'driver', avgRating: 4.5, totalRatings: 43, referralCode: 'KWEKU10',
  ),
];

final _vehicles = [
  const VehicleModel(id: 'veh-001', make: 'Toyota', model: 'Corolla', color: 'Silver', licensePlate: 'GR-2341-21', hasAc: true,  hasMusic: true),
  const VehicleModel(id: 'veh-002', make: 'Honda',  model: 'Accord',  color: 'Black',  licensePlate: 'AS-1122-20', hasAc: true),
  const VehicleModel(id: 'veh-003', make: 'Hyundai',model: 'Elantra', color: 'White',  licensePlate: 'GT-8890-19', hasMusic: true, allowsPets: true),
];

DateTime _today(int h, int m) {
  final now = DateTime.now();
  return DateTime(now.year, now.month, now.day, h, m);
}

DateTime _tomorrow(int h, int m) {
  final t = DateTime.now().add(const Duration(days: 1));
  return DateTime(t.year, t.month, t.day, h, m);
}

// ── Mock rides ────────────────────────────────────────────────────────────────

final mockRides = [
  RideModel(
    id: 'ride-001', driver: _drivers[0], vehicle: _vehicles[0],
    pickupLocation: 'East Legon',     pickupLat: 5.6438,  pickupLng: -0.1594,
    dropoffLocation: 'Accra Central', dropoffLat: 5.5502, dropoffLng: -0.2074,
    departureTime: _today(7, 0), estimatedArrivalTime: _today(7, 45),
    totalSeats: 4, availableSeats: 2, pricePerSeat: 8.0, status: 'scheduled',
    routeDescription: 'Via Boundary Road, Accra-Tema Motorway',
  ),
  RideModel(
    id: 'ride-002', driver: _drivers[1], vehicle: _vehicles[1],
    pickupLocation: 'Legon Campus',  pickupLat: 5.6502,  pickupLng: -0.1870,
    dropoffLocation: 'Airport City', dropoffLat: 5.6037, dropoffLng: -0.1870,
    departureTime: _today(8, 30), estimatedArrivalTime: _today(9, 10),
    totalSeats: 3, availableSeats: 1, pricePerSeat: 12.0, status: 'scheduled',
    routeDescription: 'Via Ring Road East',
  ),
  RideModel(
    id: 'ride-003', driver: _drivers[2], vehicle: _vehicles[2],
    pickupLocation: 'Madina Station',    pickupLat: 5.6779,  pickupLng: -0.1617,
    dropoffLocation: 'Osu Oxford Street',dropoffLat: 5.5574, dropoffLng: -0.1769,
    departureTime: _today(9, 0), estimatedArrivalTime: _today(9, 50),
    totalSeats: 4, availableSeats: 3, pricePerSeat: 10.0, status: 'scheduled',
    routeDescription: 'Via Accra-Aburi Road, Nkrumah Circle',
  ),
  RideModel(
    id: 'ride-004', driver: _drivers[0], vehicle: _vehicles[0],
    pickupLocation: 'East Legon',                    pickupLat: 5.6438, pickupLng: -0.1594,
    dropoffLocation: 'Kotoka International Airport', dropoffLat: 5.6052, dropoffLng: -0.1717,
    departureTime: _tomorrow(5, 30), estimatedArrivalTime: _tomorrow(6, 10),
    totalSeats: 4, availableSeats: 3, pricePerSeat: 15.0, status: 'scheduled',
    routeDescription: 'Express via Accra-Tema Motorway',
  ),
  RideModel(
    id: 'ride-005', driver: _drivers[1], vehicle: _vehicles[1],
    pickupLocation: 'Spintex Road',         pickupLat: 5.6300,  pickupLng: -0.1200,
    dropoffLocation: 'Kwame Nkrumah Circle',dropoffLat: 5.5500, dropoffLng: -0.2166,
    departureTime: _tomorrow(7, 15), estimatedArrivalTime: _tomorrow(8, 0),
    totalSeats: 3, availableSeats: 2, pricePerSeat: 9.0, status: 'scheduled',
    routeDescription: 'Via Liberation Road',
  ),
];

// ── Mock bookings ─────────────────────────────────────────────────────────────

final mockBookings = <BookingModel>[
  BookingModel(
    id: 'bk-001', ride: mockRides[0], seatsBooked: 1, totalPrice: 8.0,
    paymentMethod: 'wallet', status: 'confirmed', createdAt: DateTime.now(),
  ),
  BookingModel(
    id: 'bk-002', ride: mockRides[3], seatsBooked: 2, totalPrice: 30.0,
    paymentMethod: 'mobile_money', status: 'confirmed', createdAt: DateTime.now(),
  ),
  BookingModel(
    id: 'bk-003',
    ride: RideModel(
      id: 'ride-002-past', driver: _drivers[1], vehicle: _vehicles[1],
      pickupLocation: 'Legon Campus',  pickupLat: 5.6502,  pickupLng: -0.1870,
      dropoffLocation: 'Airport City', dropoffLat: 5.6037, dropoffLng: -0.1870,
      departureTime: DateTime.now().subtract(const Duration(days: 7)),
      estimatedArrivalTime: DateTime.now().subtract(const Duration(days: 7, minutes: -40)),
      totalSeats: 3, availableSeats: 0, pricePerSeat: 12.0, status: 'completed',
    ),
    seatsBooked: 1, totalPrice: 12.0, paymentMethod: 'cash',
    status: 'completed', createdAt: DateTime.now().subtract(const Duration(days: 7)),
  ),
];

// ── Repository ────────────────────────────────────────────────────────────────

abstract class RideRepository {
  Future<List<RideModel>> searchRides(RideSearchParams params);
  Future<RideModel> getRideById(String id);
  Future<BookingModel> bookRide(String rideId, int seats, String paymentMethod);
  Future<void> cancelBooking(String bookingId);
  Future<({List<BookingModel> upcoming, List<BookingModel> past})> getMyBookings();
  Future<void> submitReview({required String tripId, required int rating, required List<String> tags, String? note});
  Future<TripModel?> getActiveTrip();
}

class MockRideRepository implements RideRepository {
  @override
  Future<List<RideModel>> searchRides(RideSearchParams params) async {
    await _delay(800);
    return mockRides.where((r) {
      final matchPickup  = params.pickupLocation.isEmpty  || r.pickupLocation.toLowerCase().contains(params.pickupLocation.toLowerCase());
      final matchDropoff = params.dropoffLocation.isEmpty || r.dropoffLocation.toLowerCase().contains(params.dropoffLocation.toLowerCase());
      final matchSeats   = r.availableSeats >= params.seats;
      return matchPickup && matchDropoff && matchSeats;
    }).toList();
  }

  @override
  Future<RideModel> getRideById(String id) async {
    await _delay(400);
    return mockRides.firstWhere((r) => r.id == id, orElse: () => throw Exception('Ride not found'));
  }

  @override
  Future<BookingModel> bookRide(String rideId, int seats, String paymentMethod) async {
    await _delay(1000);
    final ride = mockRides.firstWhere((r) => r.id == rideId, orElse: () => throw Exception('Ride not found'));
    if (ride.availableSeats < seats) throw Exception('Not enough seats available');
    final booking = BookingModel(
      id: 'bk-${DateTime.now().millisecondsSinceEpoch}',
      ride: ride, seatsBooked: seats,
      totalPrice: ride.pricePerSeat * seats,
      paymentMethod: paymentMethod,
      status: 'confirmed', createdAt: DateTime.now(),
    );
    mockBookings.insert(0, booking);
    return booking;
  }

  @override
  Future<void> cancelBooking(String bookingId) async {
    await _delay(600);
  }

  @override
  Future<({List<BookingModel> upcoming, List<BookingModel> past})> getMyBookings() async {
    await _delay(600);
    final upcoming = mockBookings.where((b) => b.isUpcoming).toList();
    final past     = mockBookings.where((b) => b.isPast).toList();
    return (upcoming: upcoming, past: past);
  }

  @override
  Future<void> submitReview({required String tripId, required int rating, required List<String> tags, String? note}) async {
    await _delay(700);
  }

  @override
  Future<TripModel?> getActiveTrip() async {
    await _delay(500);
    if (mockBookings.isEmpty) return null;
    final booking = mockBookings.first;
    return TripModel(
      id: 'trip-001', ride: booking.ride, booking: booking,
      status: 'navigating_to_pickup',
      currentLat: 5.6350, currentLng: -0.1620,
    );
  }
}
