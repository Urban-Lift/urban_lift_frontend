import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:latlong2/latlong.dart';
import '../providers/driver_provider.dart';
import '../../data/driver_models.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../shared/widgets/index.dart';

class NavigatingToPickupScreen extends ConsumerStatefulWidget {
  const NavigatingToPickupScreen({super.key, required this.rideId});
  final String rideId;

  @override
  ConsumerState<NavigatingToPickupScreen> createState() => _NavigatingToPickupScreenState();
}

class _NavigatingToPickupScreenState extends ConsumerState<NavigatingToPickupScreen> {
  DriverTrip? _trip;
  bool        _loading     = true;
  bool        _drawerOpen  = true;
  double      _driverLat   = 5.6230;
  double      _driverLng   = -0.1540;
  Timer?      _timer;

  @override
  void initState() {
    super.initState();
    _load();
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  Future<void> _load() async {
    var trip = ref.read(driverProvider).activeTrip;
    trip ??= await ref.read(driverRepositoryProvider).getActiveTrip();
    setState(() {
      _trip     = trip;
      _loading  = false;
      if (trip != null) {
        _driverLat = trip.pickupLat - 0.012;
        _driverLng = trip.pickupLng - 0.008;
      }
    });
    _timer = Timer.periodic(const Duration(seconds: 4), (_) {
      setState(() => _driverLat += 0.0006);
    });
  }

  void _sos() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('🚨 SOS alert sent to emergency contact'), backgroundColor: Colors.red),
    );
  }

  void _arrived() {
    if (_trip == null) return;
    ref.read(driverProvider.notifier).setActiveTrip(_trip!.copyWith(status: DriverTripStatus.inTrip));
    context.go('/driver/trip/${widget.rideId}');
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator(color: AppColors.primary)));
    }
    if (_trip == null) {
      return Scaffold(body: Center(child: Column(mainAxisSize: MainAxisSize.min, children: [
        const Text('No active trip'),
        TextButton(onPressed: () => context.go('/driver/home'), child: const Text('Go to Dashboard')),
      ])));
    }

    final trip          = _trip!;
    final driverLatLng  = LatLng(_driverLat, _driverLng);
    final pickupLatLng  = LatLng(trip.pickupLat, trip.pickupLng);
    final dropoffLatLng = LatLng(trip.dropoffLat, trip.dropoffLng);

    return Scaffold(
      body: Stack(
        children: [
          // Full-screen map
          FlutterMap(
            options: MapOptions(initialCenter: driverLatLng, initialZoom: 14),
            children: [
              TileLayer(urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'),
              PolylineLayer(polylines: [
                Polyline(points: [driverLatLng, pickupLatLng], color: AppColors.primary, strokeWidth: 4),
                Polyline(points: [pickupLatLng, dropoffLatLng], color: AppColors.border, strokeWidth: 2),
              ]),
              MarkerLayer(markers: [
                Marker(
                  point: driverLatLng, width: 44, height: 44,
                  child: Container(
                    decoration: BoxDecoration(
                      color: AppColors.primary, shape: BoxShape.circle,
                      border: Border.all(color: Colors.white, width: 3),
                      boxShadow: [BoxShadow(color: Colors.black.withAlpha(50), blurRadius: 8, offset: const Offset(0, 3))],
                    ),
                    child: const Icon(Icons.directions_car_rounded, color: Colors.white, size: 22),
                  ),
                ),
                Marker(
                  point: pickupLatLng, width: 32, height: 32,
                  child: Container(
                    decoration: BoxDecoration(
                      color: Colors.white, shape: BoxShape.circle,
                      border: Border.all(color: AppColors.primary, width: 3),
                      boxShadow: [BoxShadow(color: Colors.black.withAlpha(40), blurRadius: 4)],
                    ),
                    child: const Icon(Icons.person_pin_rounded, color: AppColors.primary, size: 16),
                  ),
                ),
                Marker(
                  point: dropoffLatLng, width: 14, height: 14,
                  child: Container(
                    decoration: BoxDecoration(
                      color: AppColors.warning, shape: BoxShape.circle,
                      border: Border.all(color: Colors.white, width: 2),
                    ),
                  ),
                ),
              ]),
            ],
          ),

          // Top overlay
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              child: Row(
                children: [
                  GestureDetector(
                    onTap: () => context.pop(),
                    child: Container(
                      width: 40, height: 40,
                      decoration: BoxDecoration(color: Colors.white, shape: BoxShape.circle,
                          boxShadow: [BoxShadow(color: Colors.black.withAlpha(30), blurRadius: 8)]),
                      child: const Icon(Icons.close_rounded, size: 20),
                    ),
                  ),
                  const Spacer(),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    decoration: BoxDecoration(
                      color: AppColors.primary,
                      borderRadius: BorderRadius.circular(24),
                      boxShadow: [BoxShadow(color: Colors.black.withAlpha(30), blurRadius: 8)],
                    ),
                    child: const Row(mainAxisSize: MainAxisSize.min, children: [
                      CircleAvatar(radius: 4, backgroundColor: Colors.white),
                      SizedBox(width: 6),
                      Text('Heading to Pickup', style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w600)),
                    ]),
                  ),
                  const Spacer(),
                  GestureDetector(
                    onTap: _sos,
                    child: Container(
                      width: 40, height: 40,
                      decoration: BoxDecoration(color: AppColors.error, shape: BoxShape.circle,
                          boxShadow: [BoxShadow(color: Colors.black.withAlpha(30), blurRadius: 8)]),
                      child: const Icon(Icons.warning_rounded, size: 20, color: Colors.white),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Bottom drawer
          Positioned(
            bottom: 0, left: 0, right: 0,
            child: GestureDetector(
              onTap: () => setState(() => _drawerOpen = !_drawerOpen),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 250),
                height: _drawerOpen ? 240 : 80,
                decoration: const BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
                ),
                child: Column(
                  children: [
                    const SizedBox(height: 10),
                    Center(child: Container(width: 40, height: 4, decoration: BoxDecoration(color: AppColors.border, borderRadius: BorderRadius.circular(2)))),
                    const SizedBox(height: 12),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(children: [
                            const Text('8 min', style: TextStyle(fontSize: 28, fontWeight: FontWeight.w800)),
                            const SizedBox(width: 8),
                            Expanded(child: Text('until pickup at ${trip.pickupLocation}',
                                style: const TextStyle(fontSize: 13, color: AppColors.gray))),
                          ]),
                          if (_drawerOpen) ...[
                            const SizedBox(height: 14),
                            // Passenger card
                            Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(14)),
                              child: Row(children: [
                                ULAvatar(name: trip.passenger.fullName, size: AvatarSize.md),
                                const SizedBox(width: 10),
                                Expanded(child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(trip.passenger.fullName, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15)),
                                    Text('★ ${trip.passenger.rating} · ${trip.dropoffLocation}',
                                        style: const TextStyle(fontSize: 12, color: AppColors.gray)),
                                  ],
                                )),
                                Container(
                                  width: 36, height: 36,
                                  decoration: const BoxDecoration(color: AppColors.primaryLight, shape: BoxShape.circle),
                                  child: const Icon(Icons.phone_rounded, size: 18, color: AppColors.primary),
                                ),
                              ]),
                            ),
                            const SizedBox(height: 12),
                            SizedBox(
                              width: double.infinity,
                              child: ULButton(label: 'Arrived at Pickup', onPressed: _arrived),
                            ),
                          ],
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
