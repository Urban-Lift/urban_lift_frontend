import '../../auth/data/auth_models.dart';

class VehicleModel {
  const VehicleModel({
    required this.id,
    required this.make,
    required this.model,
    required this.color,
    required this.licensePlate,
    this.hasAc = false,
    this.hasMusic = false,
    this.allowsPets = false,
  });

  final String id;
  final String make;
  final String model;
  final String color;
  final String licensePlate;
  final bool hasAc;
  final bool hasMusic;
  final bool allowsPets;
}

class RideModel {
  const RideModel({
    required this.id,
    required this.driver,
    required this.vehicle,
    required this.pickupLocation,
    required this.pickupLat,
    required this.pickupLng,
    required this.dropoffLocation,
    required this.dropoffLat,
    required this.dropoffLng,
    required this.departureTime,
    required this.estimatedArrivalTime,
    required this.totalSeats,
    required this.availableSeats,
    required this.pricePerSeat,
    required this.status,
    this.routeDescription,
  });

  final String id;
  final UserModel driver;
  final VehicleModel vehicle;
  final String pickupLocation;
  final double pickupLat;
  final double pickupLng;
  final String dropoffLocation;
  final double dropoffLat;
  final double dropoffLng;
  final DateTime departureTime;
  final DateTime estimatedArrivalTime;
  final int totalSeats;
  final int availableSeats;
  final double pricePerSeat;
  final String status;
  final String? routeDescription;

  int get durationMinutes =>
      estimatedArrivalTime.difference(departureTime).inMinutes;
}

class BookingModel {
  const BookingModel({
    required this.id,
    required this.ride,
    required this.seatsBooked,
    required this.totalPrice,
    required this.paymentMethod,
    required this.status,
    required this.createdAt,
  });

  final String id;
  final RideModel ride;
  final int seatsBooked;
  final double totalPrice;
  final String paymentMethod;
  final String status; // pending | confirmed | completed | cancelled
  final DateTime createdAt;

  bool get isUpcoming => status == 'confirmed' || status == 'pending';
  bool get isPast     => status == 'completed' || status == 'cancelled';
}

class TripModel {
  const TripModel({
    required this.id,
    required this.ride,
    required this.booking,
    required this.status,
    this.currentLat,
    this.currentLng,
  });

  final String id;
  final RideModel ride;
  final BookingModel booking;
  final String status; // navigating_to_pickup | in_trip | completed
  final double? currentLat;
  final double? currentLng;
}

class RideSearchParams {
  const RideSearchParams({
    required this.pickupLocation,
    required this.dropoffLocation,
    required this.date,
    required this.seats,
  });

  final String pickupLocation;
  final String dropoffLocation;
  final DateTime date;
  final int seats;
}
