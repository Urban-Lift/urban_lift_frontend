class DriverStats {
  final double todayEarnings;
  final double weekEarnings;
  final double totalEarnings;
  final int    todayTrips;
  final int    totalTrips;
  final double rating;
  final int    acceptanceRate;

  const DriverStats({
    required this.todayEarnings,
    required this.weekEarnings,
    required this.totalEarnings,
    required this.todayTrips,
    required this.totalTrips,
    required this.rating,
    required this.acceptanceRate,
  });
}

class RequestPassenger {
  final String id;
  final String fullName;
  final double rating;
  final int    totalTrips;

  const RequestPassenger({
    required this.id,
    required this.fullName,
    required this.rating,
    required this.totalTrips,
  });
}

class PassengerRequest {
  final String           id;
  final RequestPassenger passenger;
  final String           pickupLocation;
  final String           dropoffLocation;
  final double           pickupLat;
  final double           pickupLng;
  final double           dropoffLat;
  final double           dropoffLng;
  final int              seatsRequested;
  final double           priceOffered;
  final double           distanceKm;
  final int              estimatedMinutes;
  final DateTime         requestedAt;

  const PassengerRequest({
    required this.id,
    required this.passenger,
    required this.pickupLocation,
    required this.dropoffLocation,
    required this.pickupLat,
    required this.pickupLng,
    required this.dropoffLat,
    required this.dropoffLng,
    required this.seatsRequested,
    required this.priceOffered,
    required this.distanceKm,
    required this.estimatedMinutes,
    required this.requestedAt,
  });
}

class TripPassenger {
  final String id;
  final String fullName;
  final double rating;
  final String phoneNumber;

  const TripPassenger({
    required this.id,
    required this.fullName,
    required this.rating,
    required this.phoneNumber,
  });
}

enum DriverTripStatus { navigatingToPickup, inTrip, completed }

class DriverTrip {
  final String           id;
  final TripPassenger    passenger;
  final String           pickupLocation;
  final String           dropoffLocation;
  final double           pickupLat;
  final double           pickupLng;
  final double           dropoffLat;
  final double           dropoffLng;
  final DriverTripStatus status;
  final double           earnings;
  final DateTime         startedAt;

  const DriverTrip({
    required this.id,
    required this.passenger,
    required this.pickupLocation,
    required this.dropoffLocation,
    required this.pickupLat,
    required this.pickupLng,
    required this.dropoffLat,
    required this.dropoffLng,
    required this.status,
    required this.earnings,
    required this.startedAt,
  });

  DriverTrip copyWith({DriverTripStatus? status}) => DriverTrip(
    id:              id,
    passenger:       passenger,
    pickupLocation:  pickupLocation,
    dropoffLocation: dropoffLocation,
    pickupLat:       pickupLat,
    pickupLng:       pickupLng,
    dropoffLat:      dropoffLat,
    dropoffLng:      dropoffLng,
    status:          status ?? this.status,
    earnings:        earnings,
    startedAt:       startedAt,
  );
}
