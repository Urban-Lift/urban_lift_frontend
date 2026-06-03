import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:latlong2/latlong.dart';
import '../providers/ride_provider.dart';
import '../../data/ride_models.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../shared/widgets/index.dart';

class LiveTrackingScreen extends ConsumerStatefulWidget {
  const LiveTrackingScreen({super.key, required this.bookingId});
  final String bookingId;

  @override
  ConsumerState<LiveTrackingScreen> createState() => _LiveTrackingScreenState();
}

class _LiveTrackingScreenState extends ConsumerState<LiveTrackingScreen> {
  TripModel? _trip;
  bool _loading     = true;
  bool _drawerOpen  = true;
  double _driverLat = 5.6350;
  double _driverLng = -0.1620;
  Timer? _timer;

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
    final trip = await ref.read(rideRepositoryProvider).getActiveTrip();
    setState(() {
      _trip    = trip;
      _loading = false;
      if (trip != null) {
        _driverLat = trip.currentLat ?? 5.6350;
        _driverLng = trip.currentLng ?? -0.1620;
      }
    });
    _startSimulation();
  }

  void _startSimulation() {
    _timer = Timer.periodic(const Duration(seconds: 5), (_) {
      setState(() => _driverLat += 0.0005);
    });
  }

  void _sos() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('🚨 SOS alert sent to emergency contact'), backgroundColor: Colors.red),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator(color: AppColors.primary)));
    }

    if (_trip == null) {
      return Scaffold(
        body: Center(child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text('No active trip'),
            const SizedBox(height: 12),
            TextButton(onPressed: () => context.pop(), child: const Text('Go back')),
          ],
        )),
      );
    }

    final trip = _trip!;
    final ride = trip.ride;
    final isNavigatingToPickup = trip.status == 'navigating_to_pickup';
    final statusLabel = isNavigatingToPickup ? 'Driver on the way' : 'Heading to destination';
    final etaMins     = isNavigatingToPickup ? 8 : 22;

    final driverLatLng  = LatLng(_driverLat, _driverLng);
    final pickupLatLng  = LatLng(ride.pickupLat, ride.pickupLng);
    final dropoffLatLng = LatLng(ride.dropoffLat, ride.dropoffLng);

    return Scaffold(
      body: Stack(
        children: [
          // Full-screen map
          FlutterMap(
            options: MapOptions(initialCenter: driverLatLng, initialZoom: 14),
            children: [
              TileLayer(urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'),
              PolylineLayer(polylines: [
                Polyline(points: [driverLatLng, pickupLatLng, dropoffLatLng], color: AppColors.primary, strokeWidth: 4),
              ]),
              MarkerLayer(markers: [
                Marker(
                  point: driverLatLng, width: 44, height: 44,
                  child: Container(
                    decoration: BoxDecoration(color: AppColors.primary, shape: BoxShape.circle, border: Border.all(color: Colors.white, width: 3),
                      boxShadow: [BoxShadow(color: Colors.black.withAlpha(50), blurRadius: 8, offset: const Offset(0, 3))]),
                    child: const Icon(Icons.directions_car_rounded, color: Colors.white, size: 22),
                  ),
                ),
                Marker(
                  point: pickupLatLng, width: 14, height: 14,
                  child: Container(
                    decoration: BoxDecoration(color: AppColors.primary, shape: BoxShape.circle, border: Border.all(color: Colors.white, width: 2),
                      boxShadow: [BoxShadow(color: Colors.black.withAlpha(40), blurRadius: 4)]),
                  ),
                ),
                Marker(
                  point: dropoffLatLng, width: 14, height: 14,
                  child: Container(
                    decoration: BoxDecoration(color: AppColors.warning, shape: BoxShape.circle, border: Border.all(color: Colors.white, width: 2),
                      boxShadow: [BoxShadow(color: Colors.black.withAlpha(40), blurRadius: 4)]),
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
                      decoration: BoxDecoration(color: Colors.white, shape: BoxShape.circle, boxShadow: [BoxShadow(color: Colors.black.withAlpha(30), blurRadius: 8)]),
                      child: const Icon(Icons.close_rounded, size: 20),
                    ),
                  ),
                  const Spacer(),
                  // Status pill
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    decoration: BoxDecoration(
                      color: isNavigatingToPickup ? AppColors.primary : Colors.blue,
                      borderRadius: BorderRadius.circular(24),
                      boxShadow: [BoxShadow(color: Colors.black.withAlpha(30), blurRadius: 8)],
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(width: 8, height: 8, decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle)),
                        const SizedBox(width: 6),
                        Text(statusLabel, style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w600)),
                      ],
                    ),
                  ),
                  const Spacer(),
                  // SOS + Share
                  Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      GestureDetector(
                        onTap: _sos,
                        child: Container(
                          width: 40, height: 40,
                          decoration: BoxDecoration(color: AppColors.error, shape: BoxShape.circle, boxShadow: [BoxShadow(color: Colors.black.withAlpha(30), blurRadius: 8)]),
                          child: const Icon(Icons.warning_rounded, size: 20, color: Colors.white),
                        ),
                      ),
                      const SizedBox(height: 8),
                      GestureDetector(
                        child: Container(
                          width: 40, height: 40,
                          decoration: BoxDecoration(color: Colors.white, shape: BoxShape.circle, boxShadow: [BoxShadow(color: Colors.black.withAlpha(30), blurRadius: 8)]),
                          child: const Icon(Icons.share_rounded, size: 20),
                        ),
                      ),
                    ],
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
                          Row(
                            children: [
                              Text('$etaMins min', style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w800)),
                              const SizedBox(width: 8),
                              Expanded(child: Text(isNavigatingToPickup ? 'until pickup at ${ride.pickupLocation}' : 'to arrive at ${ride.dropoffLocation}', style: const TextStyle(fontSize: 13, color: AppColors.gray))),
                              Container(
                                width: 44, height: 44,
                                decoration: const BoxDecoration(color: AppColors.primaryLight, shape: BoxShape.circle),
                                child: const Icon(Icons.navigation_rounded, color: AppColors.primary, size: 24),
                              ),
                            ],
                          ),
                          if (_drawerOpen) ...[
                            const SizedBox(height: 14),
                            Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(14)),
                              child: Row(
                                children: [
                                  ULAvatar(name: ride.driver.fullName, size: AvatarSize.md),
                                  const SizedBox(width: 10),
                                  Expanded(child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(ride.driver.fullName, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15)),
                                      Row(children: [
                                        const Icon(Icons.star_rounded, size: 13, color: Color(0xFFFFB300)),
                                        Text(' ${ride.driver.avgRating.toStringAsFixed(1)} · ${ride.vehicle.color} ${ride.vehicle.make}', style: const TextStyle(fontSize: 12, color: AppColors.gray)),
                                      ]),
                                    ],
                                  )),
                                  Container(
                                    width: 36, height: 36,
                                    decoration: const BoxDecoration(color: AppColors.primaryLight, shape: BoxShape.circle),
                                    child: const Icon(Icons.phone_rounded, size: 18, color: AppColors.primary),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(height: 10),
                            Center(child: Text('Plate: ${ride.vehicle.licensePlate}', style: const TextStyle(fontSize: 13, color: AppColors.gray))),
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
