import 'driver_models.dart';

abstract class DriverRepository {
  Future<DriverStats>            getStats();
  Future<List<PassengerRequest>> getRequests();
  Future<void>                   toggleOnline(bool online);
  Future<DriverTrip>             acceptRequest(String requestId);
  Future<void>                   declineRequest(String requestId);
  Future<DriverTrip?>            getActiveTrip();
  Future<void>                   completeTrip(String tripId);
}

class MockDriverRepository implements DriverRepository {
  static final _stats = const DriverStats(
    todayEarnings:  185,
    weekEarnings:   920,
    totalEarnings:  14320,
    todayTrips:     6,
    totalTrips:     312,
    rating:         4.9,
    acceptanceRate: 92,
  );

  static final _requests = <PassengerRequest>[
    PassengerRequest(
      id: 'req-001',
      passenger: const RequestPassenger(id: 'p-001', fullName: 'Ama Owusu',    rating: 4.8, totalTrips: 34),
      pickupLocation:  'East Legon, Accra',
      dropoffLocation: 'Osu, Accra',
      pickupLat:  5.6350, pickupLng:  -0.1620,
      dropoffLat: 5.5558, dropoffLng: -0.1865,
      seatsRequested: 1, priceOffered: 25, distanceKm: 8.2, estimatedMinutes: 22,
      requestedAt: DateTime.now().subtract(const Duration(minutes: 2)),
    ),
    PassengerRequest(
      id: 'req-002',
      passenger: const RequestPassenger(id: 'p-002', fullName: 'Kwame Mensah', rating: 4.6, totalTrips: 18),
      pickupLocation:  'Legon Campus, Accra',
      dropoffLocation: 'Airport City, Accra',
      pickupLat:  5.6506, pickupLng:  -0.1868,
      dropoffLat: 5.6070, dropoffLng: -0.1718,
      seatsRequested: 2, priceOffered: 40, distanceKm: 6.5, estimatedMinutes: 18,
      requestedAt: DateTime.now().subtract(const Duration(minutes: 5)),
    ),
    PassengerRequest(
      id: 'req-003',
      passenger: const RequestPassenger(id: 'p-003', fullName: 'Akua Boateng', rating: 4.9, totalTrips: 71),
      pickupLocation:  'Madina, Accra',
      dropoffLocation: 'Accra Mall, Accra',
      pickupLat:  5.6770, pickupLng:  -0.1760,
      dropoffLat: 5.6369, dropoffLng: -0.1718,
      seatsRequested: 1, priceOffered: 18, distanceKm: 4.8, estimatedMinutes: 14,
      requestedAt: DateTime.now().subtract(const Duration(minutes: 8)),
    ),
  ];

  static final _activeTrip = DriverTrip(
    id: 'dtrip-001',
    passenger: const TripPassenger(id: 'p-001', fullName: 'Ama Owusu', rating: 4.8, phoneNumber: '+233541234567'),
    pickupLocation:  'East Legon, Accra',
    dropoffLocation: 'Osu, Accra',
    pickupLat:  5.6350, pickupLng:  -0.1620,
    dropoffLat: 5.5558, dropoffLng: -0.1865,
    status: DriverTripStatus.navigatingToPickup,
    earnings: 25,
    startedAt: DateTime.now().subtract(const Duration(minutes: 3)),
  );

  @override
  Future<DriverStats> getStats() async {
    await Future.delayed(const Duration(milliseconds: 400));
    return _stats;
  }

  @override
  Future<List<PassengerRequest>> getRequests() async {
    await Future.delayed(const Duration(milliseconds: 500));
    return List.unmodifiable(_requests);
  }

  @override
  Future<void> toggleOnline(bool online) async {
    await Future.delayed(const Duration(milliseconds: 300));
  }

  @override
  Future<DriverTrip> acceptRequest(String requestId) async {
    await Future.delayed(const Duration(milliseconds: 600));
    final req = _requests.firstWhere((r) => r.id == requestId,
        orElse: () => throw Exception('Request not found'));
    return DriverTrip(
      id: 'dtrip-${DateTime.now().millisecondsSinceEpoch}',
      passenger: TripPassenger(
        id: req.passenger.id, fullName: req.passenger.fullName,
        rating: req.passenger.rating, phoneNumber: '+233541234567',
      ),
      pickupLocation:  req.pickupLocation,
      dropoffLocation: req.dropoffLocation,
      pickupLat:  req.pickupLat,  pickupLng:  req.pickupLng,
      dropoffLat: req.dropoffLat, dropoffLng: req.dropoffLng,
      status: DriverTripStatus.navigatingToPickup,
      earnings: req.priceOffered,
      startedAt: DateTime.now(),
    );
  }

  @override
  Future<void> declineRequest(String requestId) async {
    await Future.delayed(const Duration(milliseconds: 200));
  }

  @override
  Future<DriverTrip?> getActiveTrip() async {
    await Future.delayed(const Duration(milliseconds: 400));
    return _activeTrip;
  }

  @override
  Future<void> completeTrip(String tripId) async {
    await Future.delayed(const Duration(milliseconds: 500));
  }
}
