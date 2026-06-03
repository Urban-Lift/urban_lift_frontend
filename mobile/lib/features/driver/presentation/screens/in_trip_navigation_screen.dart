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

class InTripNavigationScreen extends ConsumerStatefulWidget {
  const InTripNavigationScreen({super.key, required this.tripId});
  final String tripId;

  @override
  ConsumerState<InTripNavigationScreen> createState() => _InTripNavigationScreenState();
}

class _InTripNavigationScreenState extends ConsumerState<InTripNavigationScreen> {
  DriverTrip? _trip;
  bool        _loading     = true;
  bool        _drawerOpen  = true;
  bool        _completing  = false;
  double      _driverLat   = 5.6350;
  double      _driverLng   = -0.1620;
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
      _trip    = trip;
      _loading = false;
      if (trip != null) { _driverLat = trip.pickupLat; _driverLng = trip.pickupLng; }
    });
    _timer = Timer.periodic(const Duration(seconds: 4), (_) {
      setState(() { _driverLat -= 0.0004; _driverLng -= 0.0003; });
    });
  }

  void _sos() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('🚨 SOS alert sent to emergency contact'), backgroundColor: Colors.red),
    );
  }

  Future<void> _complete() async {
    if (_trip == null) return;
    setState(() => _completing = true);
    try {
      await ref.read(driverProvider.notifier).completeTrip(widget.tripId);
      if (mounted) context.go('/driver/home');
    } finally {
      if (mounted) setState(() => _completing = false);
    }
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
                Polyline(points: [driverLatLng, dropoffLatLng], color: Colors.blue, strokeWidth: 4),
              ]),
              MarkerLayer(markers: [
                Marker(
                  point: driverLatLng, width: 44, height: 44,
                  child: Container(
                    decoration: BoxDecoration(
                      color: Colors.blue, shape: BoxShape.circle,
                      border: Border.all(color: Colors.white, width: 3),
                      boxShadow: [BoxShadow(color: Colors.black.withAlpha(50), blurRadius: 8, offset: const Offset(0, 3))],
                    ),
                    child: const Icon(Icons.directions_car_rounded, color: Colors.white, size: 22),
                  ),
                ),
                Marker(
                  point: pickupLatLng, width: 14, height: 14,
                  child: Container(
                    decoration: BoxDecoration(color: AppColors.primary, shape: BoxShape.circle, border: Border.all(color: Colors.white, width: 2)),
                  ),
                ),
                Marker(
                  point: dropoffLatLng, width: 32, height: 32,
                  child: Container(
                    decoration: BoxDecoration(
                      color: Colors.white, shape: BoxShape.circle,
                      border: Border.all(color: AppColors.warning, width: 3),
                      boxShadow: [BoxShadow(color: Colors.black.withAlpha(40), blurRadius: 4)],
                    ),
                    child: const Icon(Icons.location_on_rounded, color: AppColors.warning, size: 16),
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
                      color: Colors.blue,
                      borderRadius: BorderRadius.circular(24),
                      boxShadow: [BoxShadow(color: Colors.black.withAlpha(30), blurRadius: 8)],
                    ),
                    child: const Row(mainAxisSize: MainAxisSize.min, children: [
                      CircleAvatar(radius: 4, backgroundColor: Colors.white),
                      SizedBox(width: 6),
                      Text('In Trip', style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w600)),
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
                height: _drawerOpen ? 260 : 80,
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
                            const Text('22 min', style: TextStyle(fontSize: 28, fontWeight: FontWeight.w800)),
                            const SizedBox(width: 8),
                            Expanded(child: Text('to ${trip.dropoffLocation}',
                                style: const TextStyle(fontSize: 13, color: AppColors.gray))),
                            Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
                              const Text('Fare', style: TextStyle(fontSize: 11, color: AppColors.gray)),
                              Text('GHS ${trip.earnings.toStringAsFixed(0)}',
                                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: AppColors.primary)),
                            ]),
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
                                    Text('★ ${trip.passenger.rating} · Dropping off at destination',
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
                              child: ULButton(
                                label: 'Complete Trip',
                                loading: _completing,
                                onPressed: _completing ? null : _complete,
                                variant: ULButtonVariant.primary,
                              ),
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
