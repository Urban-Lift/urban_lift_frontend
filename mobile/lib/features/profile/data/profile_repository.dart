import 'profile_models.dart';

abstract class ProfileRepository {
  Future<List<SavedRoute>> getSavedRoutes();
  Future<SavedRoute> addSavedRoute(String pickup, String dropoff, {String? label});
  Future<void> deleteSavedRoute(String id);
  Future<NotificationPrefs> getNotificationPrefs();
  Future<void> updateNotificationPref(String key, bool value);
  Future<void> updateProfile({required String fullName, String? email, String? emergencyContact});
}

class MockProfileRepository implements ProfileRepository {
  final List<SavedRoute> _routes = [
    const SavedRoute(id: 'sr-001', pickupLocation: 'East Legon', dropoffLocation: 'Accra Central', label: 'Morning commute'),
    const SavedRoute(id: 'sr-002', pickupLocation: 'Madina Station', dropoffLocation: 'Legon Campus', label: 'Uni run'),
  ];

  NotificationPrefs _prefs = const NotificationPrefs();

  @override
  Future<List<SavedRoute>> getSavedRoutes() async {
    await Future.delayed(const Duration(milliseconds: 500));
    return List.unmodifiable(_routes);
  }

  @override
  Future<SavedRoute> addSavedRoute(String pickup, String dropoff, {String? label}) async {
    await Future.delayed(const Duration(milliseconds: 600));
    final route = SavedRoute(
      id: 'sr-${DateTime.now().millisecondsSinceEpoch}',
      pickupLocation: pickup,
      dropoffLocation: dropoff,
      label: label,
    );
    _routes.add(route);
    return route;
  }

  @override
  Future<void> deleteSavedRoute(String id) async {
    await Future.delayed(const Duration(milliseconds: 400));
    _routes.removeWhere((r) => r.id == id);
  }

  @override
  Future<NotificationPrefs> getNotificationPrefs() async {
    await Future.delayed(const Duration(milliseconds: 400));
    return _prefs;
  }

  @override
  Future<void> updateNotificationPref(String key, bool value) async {
    await Future.delayed(const Duration(milliseconds: 300));
    _prefs = switch (key) {
      'ride_updates' => _prefs.copyWith(rideUpdates: value),
      'payments'     => _prefs.copyWith(payments: value),
      'promotions'   => _prefs.copyWith(promotions: value),
      'community'    => _prefs.copyWith(community: value),
      'safety'       => _prefs.copyWith(safety: value),
      _              => _prefs,
    };
  }

  @override
  Future<void> updateProfile({required String fullName, String? email, String? emergencyContact}) async {
    await Future.delayed(const Duration(milliseconds: 800));
  }
}
