import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../providers/ride_provider.dart';
import '../../data/ride_models.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../shared/widgets/index.dart';

enum _Sort { price, time, rating, seats }

class AvailableRidesScreen extends ConsumerStatefulWidget {
  const AvailableRidesScreen({super.key});

  @override
  ConsumerState<AvailableRidesScreen> createState() => _AvailableRidesScreenState();
}

class _AvailableRidesScreenState extends ConsumerState<AvailableRidesScreen> {
  _Sort _sort = _Sort.time;

  List<RideModel> _sorted(List<RideModel> rides) {
    final list = [...rides];
    switch (_sort) {
      case _Sort.price:  list.sort((a, b) => a.pricePerSeat.compareTo(b.pricePerSeat));
      case _Sort.time:   list.sort((a, b) => a.departureTime.compareTo(b.departureTime));
      case _Sort.rating: list.sort((a, b) => b.driver.avgRating.compareTo(a.driver.avgRating));
      case _Sort.seats:  list.sort((a, b) => b.availableSeats.compareTo(a.availableSeats));
    }
    return list;
  }

  @override
  Widget build(BuildContext context) {
    final state  = ref.watch(rideSearchProvider);
    final params = state.params;
    final sorted = _sorted(state.rides);

    return Scaffold(
      backgroundColor: AppColors.surface,
      body: SafeArea(
        child: Column(
          children: [
            // ── Header ────────────────────────────────────────────────────
            Container(
              color: Colors.white,
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 0),
              child: Column(
                children: [
                  Row(
                    children: [
                      IconButton(
                        onPressed: () => context.pop(),
                        icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 18),
                        style: IconButton.styleFrom(backgroundColor: AppColors.surface),
                      ),
                      const SizedBox(width: 8),
                      if (params != null) Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                const Icon(Icons.location_on, size: 14, color: AppColors.primary),
                                const SizedBox(width: 4),
                                Flexible(child: Text(params.pickupLocation, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600), overflow: TextOverflow.ellipsis)),
                                const Text(' → ', style: TextStyle(color: AppColors.gray, fontSize: 13)),
                                const Icon(Icons.location_on, size: 14, color: AppColors.error),
                                Flexible(child: Text(params.dropoffLocation, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600), overflow: TextOverflow.ellipsis)),
                              ],
                            ),
                            Text(
                              '${params.date.day}/${params.date.month}/${params.date.year} · ${params.seats} seat${params.seats != 1 ? 's' : ''}',
                              style: const TextStyle(fontSize: 11, color: AppColors.gray),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  // Sort chips
                  SizedBox(
                    height: 36,
                    child: ListView(
                      scrollDirection: Axis.horizontal,
                      children: [
                        _SortChip(label: 'Cheapest', active: _sort == _Sort.price,  onTap: () => setState(() => _sort = _Sort.price)),
                        _SortChip(label: 'Earliest', active: _sort == _Sort.time,   onTap: () => setState(() => _sort = _Sort.time)),
                        _SortChip(label: 'Top rated',active: _sort == _Sort.rating, onTap: () => setState(() => _sort = _Sort.rating)),
                        _SortChip(label: 'Most seats',active: _sort == _Sort.seats, onTap: () => setState(() => _sort = _Sort.seats)),
                      ],
                    ),
                  ),
                  const SizedBox(height: 8),
                ],
              ),
            ),
            const Divider(height: 1),

            // ── List ───────────────────────────────────────────────────────
            Expanded(
              child: state.isLoading
                  ? const Center(child: CircularProgressIndicator(color: AppColors.primary))
                  : sorted.isEmpty
                      ? _EmptyState(onBack: () => context.pop())
                      : ListView.builder(
                          padding: const EdgeInsets.all(16),
                          itemCount: sorted.length + 1,
                          itemBuilder: (context, i) {
                            if (i == 0) {
                              return Padding(
                                padding: const EdgeInsets.only(bottom: 10),
                                child: Text('${sorted.length} ride${sorted.length != 1 ? 's' : ''} found', style: const TextStyle(fontSize: 12, color: AppColors.gray)),
                              );
                            }
                            final ride = sorted[i - 1];
                            return Padding(
                              padding: const EdgeInsets.only(bottom: 12),
                              child: _RideCard(ride: ride, onTap: () => context.push('/rides/${ride.id}')),
                            );
                          },
                        ),
            ),
          ],
        ),
      ),
    );
  }
}

class _SortChip extends StatelessWidget {
  const _SortChip({required this.label, required this.active, required this.onTap});
  final String label;
  final bool active;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) => GestureDetector(
        onTap: onTap,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 150),
          margin: const EdgeInsets.only(right: 8),
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
          decoration: BoxDecoration(
            color: active ? AppColors.primary : Colors.white,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: active ? AppColors.primary : AppColors.border),
          ),
          child: Text(label, style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: active ? Colors.white : AppColors.gray)),
        ),
      );
}

class _RideCard extends StatelessWidget {
  const _RideCard({required this.ride, required this.onTap});
  final RideModel ride;
  final VoidCallback onTap;

  String _timeLabel(DateTime t) => '${t.hour.toString().padLeft(2, '0')}:${t.minute.toString().padLeft(2, '0')}';

  @override
  Widget build(BuildContext context) {
    final amenities = <String>[
      if (ride.vehicle.hasAc)     'A/C',
      if (ride.vehicle.hasMusic)  'Music',
      if (ride.vehicle.allowsPets) 'Pets OK',
    ];
    final isSuperDriver = ride.driver.avgRating >= 4.8;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.border),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Driver row
            Row(
              children: [
                ULAvatar(name: ride.driver.fullName, size: AvatarSize.sm),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Text(ride.driver.fullName, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
                          if (isSuperDriver) ...[
                            const SizedBox(width: 6),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(color: const Color(0xFFFFF3E0), borderRadius: BorderRadius.circular(10)),
                              child: const Text('★ Super', style: TextStyle(fontSize: 10, color: Color(0xFFE65100), fontWeight: FontWeight.w700)),
                            ),
                          ],
                        ],
                      ),
                      Row(
                        children: [
                          const Icon(Icons.star_rounded, size: 13, color: Color(0xFFFFB300)),
                          Text(' ${ride.driver.avgRating.toStringAsFixed(1)}', style: const TextStyle(fontSize: 12, color: AppColors.gray)),
                          Text(' · ${ride.vehicle.make} ${ride.vehicle.model}', style: const TextStyle(fontSize: 12, color: AppColors.gray)),
                        ],
                      ),
                    ],
                  ),
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text('GHS ${ride.pricePerSeat.toStringAsFixed(0)}', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.primary)),
                    const Text('per seat', style: TextStyle(fontSize: 10, color: AppColors.gray)),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 12),

            // Route
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Column(
                  children: [
                    Container(width: 8, height: 8, decoration: const BoxDecoration(color: AppColors.primary, shape: BoxShape.circle)),
                    Container(width: 1, height: 24, color: AppColors.border),
                    Container(width: 8, height: 8, decoration: const BoxDecoration(color: AppColors.error, shape: BoxShape.circle)),
                  ],
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(ride.pickupLocation, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500)),
                      Text('${_timeLabel(ride.departureTime)} · ${ride.availableSeats} seat${ride.availableSeats != 1 ? 's' : ''} left', style: const TextStyle(fontSize: 11, color: AppColors.gray)),
                      const SizedBox(height: 8),
                      Text(ride.dropoffLocation, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500)),
                      Text(_timeLabel(ride.estimatedArrivalTime), style: const TextStyle(fontSize: 11, color: AppColors.gray)),
                    ],
                  ),
                ),
              ],
            ),

            if (amenities.isNotEmpty) ...[
              const SizedBox(height: 10),
              Wrap(
                spacing: 6,
                children: amenities.map((a) => Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(20), border: Border.all(color: AppColors.border)),
                  child: Text(a, style: const TextStyle(fontSize: 10, color: AppColors.gray)),
                )).toList(),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class _EmptyState extends StatelessWidget {
  const _EmptyState({required this.onBack});
  final VoidCallback onBack;

  @override
  Widget build(BuildContext context) => Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 64, height: 64,
                decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(16)),
                child: const Icon(Icons.search_off_rounded, size: 32, color: AppColors.gray),
              ),
              const SizedBox(height: 16),
              const Text('No rides found', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
              const SizedBox(height: 8),
              const Text('Try a different date or nearby location', style: TextStyle(fontSize: 14, color: AppColors.gray), textAlign: TextAlign.center),
              const SizedBox(height: 20),
              TextButton(onPressed: onBack, child: const Text('Change search', style: TextStyle(color: AppColors.primary))),
            ],
          ),
        ),
      );
}
