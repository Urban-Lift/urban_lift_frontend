class SavedRoute {
  final String id;
  final String pickupLocation;
  final String dropoffLocation;
  final String? label;

  const SavedRoute({
    required this.id,
    required this.pickupLocation,
    required this.dropoffLocation,
    this.label,
  });
}

class NotificationPrefs {
  final bool rideUpdates;
  final bool payments;
  final bool promotions;
  final bool community;
  final bool safety;

  const NotificationPrefs({
    this.rideUpdates = true,
    this.payments    = true,
    this.promotions  = false,
    this.community   = true,
    this.safety      = true,
  });

  NotificationPrefs copyWith({
    bool? rideUpdates,
    bool? payments,
    bool? promotions,
    bool? community,
    bool? safety,
  }) => NotificationPrefs(
    rideUpdates: rideUpdates ?? this.rideUpdates,
    payments:    payments    ?? this.payments,
    promotions:  promotions  ?? this.promotions,
    community:   community   ?? this.community,
    safety:      safety      ?? this.safety,
  );
}
