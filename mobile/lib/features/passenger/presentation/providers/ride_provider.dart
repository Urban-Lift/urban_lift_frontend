import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/ride_models.dart';
import '../../data/ride_repository.dart';

// ── Repository provider ───────────────────────────────────────────────────────

final rideRepositoryProvider = Provider<RideRepository>(
  (_) => MockRideRepository(),
);

// ── Search results ────────────────────────────────────────────────────────────

class RideSearchState {
  const RideSearchState({
    this.params,
    this.rides = const [],
    this.isLoading = false,
    this.error,
  });

  final RideSearchParams? params;
  final List<RideModel> rides;
  final bool isLoading;
  final String? error;

  RideSearchState copyWith({
    RideSearchParams? params,
    List<RideModel>? rides,
    bool? isLoading,
    String? error,
    bool clearError = false,
  }) =>
      RideSearchState(
        params:    params    ?? this.params,
        rides:     rides     ?? this.rides,
        isLoading: isLoading ?? this.isLoading,
        error:     clearError ? null : (error ?? this.error),
      );
}

class RideSearchNotifier extends StateNotifier<RideSearchState> {
  RideSearchNotifier(this._repo) : super(const RideSearchState());

  final RideRepository _repo;

  Future<void> search(RideSearchParams params) async {
    state = state.copyWith(params: params, isLoading: true, clearError: true);
    try {
      final rides = await _repo.searchRides(params);
      state = state.copyWith(rides: rides, isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  void clear() => state = const RideSearchState();
}

final rideSearchProvider = StateNotifierProvider<RideSearchNotifier, RideSearchState>(
  (ref) => RideSearchNotifier(ref.read(rideRepositoryProvider)),
);

// ── My bookings ───────────────────────────────────────────────────────────────

class MyRidesState {
  const MyRidesState({
    this.upcoming = const [],
    this.past = const [],
    this.isLoading = false,
    this.currentBooking,
  });

  final List<BookingModel> upcoming;
  final List<BookingModel> past;
  final bool isLoading;
  final BookingModel? currentBooking;

  MyRidesState copyWith({
    List<BookingModel>? upcoming,
    List<BookingModel>? past,
    bool? isLoading,
    BookingModel? currentBooking,
  }) =>
      MyRidesState(
        upcoming:       upcoming       ?? this.upcoming,
        past:           past           ?? this.past,
        isLoading:      isLoading      ?? this.isLoading,
        currentBooking: currentBooking ?? this.currentBooking,
      );
}

class MyRidesNotifier extends StateNotifier<MyRidesState> {
  MyRidesNotifier(this._repo) : super(const MyRidesState());

  final RideRepository _repo;

  Future<void> load() async {
    state = state.copyWith(isLoading: true);
    try {
      final data = await _repo.getMyBookings();
      state = state.copyWith(upcoming: data.upcoming, past: data.past, isLoading: false);
    } catch (_) {
      state = state.copyWith(isLoading: false);
    }
  }

  Future<BookingModel> bookRide(String rideId, int seats, String paymentMethod) async {
    state = state.copyWith(isLoading: true);
    try {
      final booking = await _repo.bookRide(rideId, seats, paymentMethod);
      state = state.copyWith(currentBooking: booking, isLoading: false);
      return booking;
    } catch (e) {
      state = state.copyWith(isLoading: false);
      rethrow;
    }
  }

  Future<void> cancel(String bookingId) async {
    await _repo.cancelBooking(bookingId);
    await load();
  }

  Future<void> submitReview({
    required String tripId, required int rating,
    required List<String> tags, String? note,
  }) =>
      _repo.submitReview(tripId: tripId, rating: rating, tags: tags, note: note);
}

final myRidesProvider = StateNotifierProvider<MyRidesNotifier, MyRidesState>(
  (ref) => MyRidesNotifier(ref.read(rideRepositoryProvider)),
);
