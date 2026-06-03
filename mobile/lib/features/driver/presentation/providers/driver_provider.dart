import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/driver_models.dart';
import '../../data/driver_repository.dart';

final driverRepositoryProvider = Provider<DriverRepository>(
  (_) => MockDriverRepository(),
);

// ── State ─────────────────────────────────────────────────────────────────────

class DriverDashboardState {
  final bool               isOnline;
  final DriverStats?       stats;
  final List<PassengerRequest> requests;
  final DriverTrip?        activeTrip;
  final bool               isLoading;

  const DriverDashboardState({
    this.isOnline  = false,
    this.stats,
    this.requests  = const [],
    this.activeTrip,
    this.isLoading = false,
  });

  DriverDashboardState copyWith({
    bool?                    isOnline,
    DriverStats?             stats,
    List<PassengerRequest>?  requests,
    DriverTrip?              activeTrip,
    bool?                    clearActiveTrip,
    bool?                    isLoading,
  }) => DriverDashboardState(
    isOnline:   isOnline   ?? this.isOnline,
    stats:      stats      ?? this.stats,
    requests:   requests   ?? this.requests,
    activeTrip: clearActiveTrip == true ? null : (activeTrip ?? this.activeTrip),
    isLoading:  isLoading  ?? this.isLoading,
  );
}

// ── Notifier ──────────────────────────────────────────────────────────────────

class DriverNotifier extends StateNotifier<DriverDashboardState> {
  DriverNotifier(this._repo) : super(const DriverDashboardState());

  final DriverRepository _repo;

  Future<void> load() async {
    state = state.copyWith(isLoading: true);
    final results = await Future.wait([_repo.getStats(), _repo.getRequests()]);
    state = state.copyWith(
      stats:     results[0] as DriverStats,
      requests:  results[1] as List<PassengerRequest>,
      isLoading: false,
    );
  }

  Future<void> toggleOnline() async {
    final next = !state.isOnline;
    await _repo.toggleOnline(next);
    state = state.copyWith(isOnline: next);
    if (next) await _refreshRequests();
  }

  Future<void> _refreshRequests() async {
    final reqs = await _repo.getRequests();
    state = state.copyWith(requests: reqs);
  }

  Future<DriverTrip> acceptRequest(String requestId) async {
    final trip = await _repo.acceptRequest(requestId);
    state = state.copyWith(
      activeTrip: trip,
      requests: state.requests.where((r) => r.id != requestId).toList(),
    );
    return trip;
  }

  Future<void> declineRequest(String requestId) async {
    await _repo.declineRequest(requestId);
    state = state.copyWith(
      requests: state.requests.where((r) => r.id != requestId).toList(),
    );
  }

  Future<DriverTrip?> loadActiveTrip() async {
    final trip = await _repo.getActiveTrip();
    state = state.copyWith(activeTrip: trip);
    return trip;
  }

  void setActiveTrip(DriverTrip? trip) {
    if (trip == null) {
      state = state.copyWith(clearActiveTrip: true);
    } else {
      state = state.copyWith(activeTrip: trip);
    }
  }

  Future<void> completeTrip(String tripId) async {
    await _repo.completeTrip(tripId);
    state = state.copyWith(clearActiveTrip: true);
  }
}

final driverProvider = StateNotifierProvider<DriverNotifier, DriverDashboardState>(
  (ref) => DriverNotifier(ref.read(driverRepositoryProvider)),
);
