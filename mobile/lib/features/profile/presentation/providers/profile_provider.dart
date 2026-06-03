import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/profile_models.dart';
import '../../data/profile_repository.dart';

class ProfileState {
  final List<SavedRoute> savedRoutes;
  final NotificationPrefs? notifPrefs;
  final bool isLoading;
  final String? error;

  const ProfileState({
    this.savedRoutes = const [],
    this.notifPrefs,
    this.isLoading = false,
    this.error,
  });

  ProfileState copyWith({
    List<SavedRoute>? savedRoutes,
    NotificationPrefs? notifPrefs,
    bool? isLoading,
    String? error,
    bool clearError = false,
  }) => ProfileState(
    savedRoutes: savedRoutes ?? this.savedRoutes,
    notifPrefs:  notifPrefs  ?? this.notifPrefs,
    isLoading:   isLoading   ?? this.isLoading,
    error:       clearError ? null : (error ?? this.error),
  );
}

class ProfileNotifier extends StateNotifier<ProfileState> {
  final ProfileRepository _repo;
  ProfileNotifier(this._repo) : super(const ProfileState());

  Future<void> loadRoutes() async {
    state = state.copyWith(isLoading: true, clearError: true);
    try {
      final routes = await _repo.getSavedRoutes();
      state = state.copyWith(savedRoutes: routes, isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<bool> addRoute(String pickup, String dropoff, {String? label}) async {
    try {
      final r = await _repo.addSavedRoute(pickup, dropoff, label: label);
      state = state.copyWith(savedRoutes: [...state.savedRoutes, r]);
      return true;
    } catch (_) { return false; }
  }

  Future<void> deleteRoute(String id) async {
    await _repo.deleteSavedRoute(id);
    state = state.copyWith(savedRoutes: state.savedRoutes.where((r) => r.id != id).toList());
  }

  Future<void> loadNotifPrefs() async {
    state = state.copyWith(isLoading: true);
    try {
      final prefs = await _repo.getNotificationPrefs();
      state = state.copyWith(notifPrefs: prefs, isLoading: false);
    } catch (_) {
      state = state.copyWith(isLoading: false);
    }
  }

  Future<void> togglePref(String key, bool value) async {
    final old = state.notifPrefs;
    // Optimistic update
    state = state.copyWith(notifPrefs: _applyPref(old, key, value));
    try {
      await _repo.updateNotificationPref(key, value);
    } catch (_) {
      state = state.copyWith(notifPrefs: old);
    }
  }

  Future<bool> updateProfile({required String fullName, String? email, String? emergencyContact}) async {
    try {
      await _repo.updateProfile(fullName: fullName, email: email, emergencyContact: emergencyContact);
      return true;
    } catch (_) { return false; }
  }

  NotificationPrefs? _applyPref(NotificationPrefs? p, String key, bool v) {
    if (p == null) return p;
    return switch (key) {
      'ride_updates' => p.copyWith(rideUpdates: v),
      'payments'     => p.copyWith(payments: v),
      'promotions'   => p.copyWith(promotions: v),
      'community'    => p.copyWith(community: v),
      'safety'       => p.copyWith(safety: v),
      _              => p,
    };
  }
}

final profileRepositoryProvider = Provider<ProfileRepository>((_) => MockProfileRepository());

final profileProvider = StateNotifierProvider<ProfileNotifier, ProfileState>(
  (ref) => ProfileNotifier(ref.read(profileRepositoryProvider)),
);
