import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../providers/ride_provider.dart';
import '../../data/ride_models.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../shared/widgets/index.dart';

class RideDetailScreen extends ConsumerStatefulWidget {
  const RideDetailScreen({super.key, required this.rideId});
  final String rideId;

  @override
  ConsumerState<RideDetailScreen> createState() => _RideDetailScreenState();
}

class _RideDetailScreenState extends ConsumerState<RideDetailScreen> {
  RideModel? _ride;
  bool _loading = true;
  int _seats    = 1;
  bool _booking = false;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    // Try from cache first
    final cached = ref.read(rideSearchProvider).rides.where((r) => r.id == widget.rideId).firstOrNull;
    if (cached != null) {
      setState(() { _ride = cached; _loading = false; });
      return;
    }
    try {
      final ride = await ref.read(rideRepositoryProvider).getRideById(widget.rideId);
      setState(() { _ride = ride; _loading = false; });
    } catch (_) {
      setState(() => _loading = false);
    }
  }

  Future<void> _book() async {
    if (_ride == null) return;
    setState(() => _booking = true);
    try {
      final booking = await ref.read(myRidesProvider.notifier).bookRide(_ride!.id, _seats, 'wallet');
      if (mounted) context.go('/booking/${booking.id}');
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString()), backgroundColor: AppColors.error),
        );
      }
    } finally {
      if (mounted) setState(() => _booking = false);
    }
  }

  String _timeLabel(DateTime t) => '${t.hour.toString().padLeft(2, '0')}:${t.minute.toString().padLeft(2, '0')}';

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator(color: AppColors.primary)));
    }
    if (_ride == null) {
      return Scaffold(
        body: Center(child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text('Ride not found'),
            TextButton(onPressed: () => context.pop(), child: const Text('Go back')),
          ],
        )),
      );
    }
    final ride  = _ride!;
    final total = ride.pricePerSeat * _seats;
    final isSuperDriver = ride.driver.avgRating >= 4.8;

    return Scaffold(
      backgroundColor: AppColors.surface,
      body: SafeArea(
        child: Column(
          children: [
            // ── Header ─────────────────────────────────────────────────────
            Container(
              color: Colors.white,
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 16),
              child: Row(
                children: [
                  IconButton(
                    onPressed: () => context.pop(),
                    icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 18),
                    style: IconButton.styleFrom(backgroundColor: AppColors.surface),
                  ),
                  const SizedBox(width: 8),
                  const Text('Ride Details', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
                ],
              ),
            ),
            const Divider(height: 1),

            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    // Driver card
                    _Section(child: Column(
                      children: [
                        Row(
                          children: [
                            ULAvatar(name: ride.driver.fullName, size: AvatarSize.lg),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(children: [
                                    Text(ride.driver.fullName, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
                                    if (isSuperDriver) ...[
                                      const SizedBox(width: 6),
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                        decoration: BoxDecoration(color: const Color(0xFFFFF3E0), borderRadius: BorderRadius.circular(10)),
                                        child: const Text('★ Super Driver', style: TextStyle(fontSize: 10, color: Color(0xFFE65100), fontWeight: FontWeight.w700)),
                                      ),
                                    ],
                                  ]),
                                  const SizedBox(height: 4),
                                  Row(children: [
                                    const Icon(Icons.star_rounded, size: 14, color: Color(0xFFFFB300)),
                                    Text(' ${ride.driver.avgRating.toStringAsFixed(1)} (${ride.driver.totalRatings})', style: const TextStyle(fontSize: 12, color: AppColors.gray)),
                                    const SizedBox(width: 10),
                                    const Icon(Icons.verified_user_rounded, size: 14, color: AppColors.primary),
                                    const Text(' Verified', style: TextStyle(fontSize: 12, color: AppColors.primary)),
                                  ]),
                                ],
                              ),
                            ),
                          ],
                        ),
                        const Divider(height: 24),
                        Row(
                          children: [
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text('Vehicle', style: TextStyle(fontSize: 11, color: AppColors.gray)),
                                  Text('${ride.vehicle.color} ${ride.vehicle.make} ${ride.vehicle.model}', style: const TextStyle(fontWeight: FontWeight.w600)),
                                ],
                              ),
                            ),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.end,
                              children: [
                                const Text('Plate', style: TextStyle(fontSize: 11, color: AppColors.gray)),
                                Text(ride.vehicle.licensePlate, style: const TextStyle(fontWeight: FontWeight.w600, fontFamily: 'monospace')),
                              ],
                            ),
                          ],
                        ),
                        if (ride.vehicle.hasAc || ride.vehicle.hasMusic || ride.vehicle.allowsPets) ...[
                          const SizedBox(height: 12),
                          Wrap(
                            spacing: 6, runSpacing: 6,
                            children: [
                              if (ride.vehicle.hasAc)     _AmenityChip(icon: Icons.ac_unit_rounded, label: 'A/C'),
                              if (ride.vehicle.hasMusic)  _AmenityChip(icon: Icons.music_note_rounded, label: 'Music'),
                              if (ride.vehicle.allowsPets) _AmenityChip(icon: Icons.pets_rounded, label: 'Pets OK'),
                            ],
                          ),
                        ],
                      ],
                    )),
                    const SizedBox(height: 12),

                    // Route
                    _Section(child: Column(
                      children: [
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Column(children: [
                              Container(width: 10, height: 10, decoration: const BoxDecoration(color: AppColors.primary, shape: BoxShape.circle)),
                              Container(width: 1, height: 32, color: AppColors.border),
                              Container(width: 10, height: 10, decoration: const BoxDecoration(color: AppColors.error, shape: BoxShape.circle)),
                            ]),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(ride.pickupLocation, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
                                  Text(_timeLabel(ride.departureTime), style: const TextStyle(fontSize: 12, color: AppColors.gray)),
                                  const SizedBox(height: 16),
                                  Text(ride.dropoffLocation, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
                                  Text(_timeLabel(ride.estimatedArrivalTime), style: const TextStyle(fontSize: 12, color: AppColors.gray)),
                                ],
                              ),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                              decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(10)),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  const Icon(Icons.access_time_rounded, size: 12, color: AppColors.gray),
                                  const SizedBox(width: 4),
                                  Text('${ride.durationMinutes} min', style: const TextStyle(fontSize: 12, color: AppColors.gray)),
                                ],
                              ),
                            ),
                          ],
                        ),
                        if (ride.routeDescription != null) ...[
                          const Divider(height: 20),
                          Text('Route: ${ride.routeDescription}', style: const TextStyle(fontSize: 12, color: AppColors.gray)),
                        ],
                      ],
                    )),
                    const SizedBox(height: 12),

                    // Seats + Price
                    _Section(child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Select seats', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
                        const SizedBox(height: 12),
                        Row(
                          children: [
                            _SeatsButton(icon: Icons.remove, onTap: _seats > 1 ? () => setState(() => _seats--) : null),
                            Padding(
                              padding: const EdgeInsets.symmetric(horizontal: 20),
                              child: Text('$_seats', style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w700)),
                            ),
                            _SeatsButton(icon: Icons.add, filled: true, onTap: _seats < ride.availableSeats ? () => setState(() => _seats++) : null),
                            const SizedBox(width: 12),
                            Text('${ride.availableSeats} available', style: const TextStyle(fontSize: 12, color: AppColors.gray)),
                          ],
                        ),
                        const Divider(height: 24),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text('GHS ${ride.pricePerSeat.toStringAsFixed(0)} × $_seats seat${_seats != 1 ? 's' : ''}', style: const TextStyle(fontSize: 14, color: AppColors.gray)),
                            Text('GHS ${total.toStringAsFixed(2)}', style: const TextStyle(fontSize: 14)),
                          ],
                        ),
                        const SizedBox(height: 6),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text('Total', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
                            Text('GHS ${total.toStringAsFixed(2)}', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w700, color: AppColors.primary)),
                          ],
                        ),
                      ],
                    )),
                    const SizedBox(height: 100),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 12),
          child: ULButton(
            label: 'Book Ride · GHS ${total.toStringAsFixed(0)}',
            loading: _booking,
            onPressed: _book,
          ),
        ),
      ),
    );
  }
}

class _Section extends StatelessWidget {
  const _Section({required this.child});
  final Widget child;

  @override
  Widget build(BuildContext context) => Container(
        width: double.infinity,
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.border),
        ),
        child: child,
      );
}

class _AmenityChip extends StatelessWidget {
  const _AmenityChip({required this.icon, required this.label});
  final IconData icon;
  final String label;

  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        decoration: BoxDecoration(color: AppColors.primaryLight, borderRadius: BorderRadius.circular(20), border: Border.all(color: const Color(0xFF6EE7B7))),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 13, color: AppColors.primary),
            const SizedBox(width: 4),
            Text(label, style: const TextStyle(fontSize: 12, color: AppColors.primary, fontWeight: FontWeight.w500)),
          ],
        ),
      );
}

class _SeatsButton extends StatelessWidget {
  const _SeatsButton({required this.icon, this.onTap, this.filled = false});
  final IconData icon;
  final VoidCallback? onTap;
  final bool filled;

  @override
  Widget build(BuildContext context) => GestureDetector(
        onTap: onTap,
        child: Container(
          width: 36, height: 36,
          decoration: BoxDecoration(
            color: onTap == null ? AppColors.surface : (filled ? AppColors.primaryLight : Colors.white),
            shape: BoxShape.circle,
            border: Border.all(color: onTap == null ? AppColors.border : (filled ? AppColors.primary : AppColors.border)),
          ),
          child: Icon(icon, size: 18, color: onTap == null ? AppColors.border : (filled ? AppColors.primary : AppColors.gray)),
        ),
      );
}
