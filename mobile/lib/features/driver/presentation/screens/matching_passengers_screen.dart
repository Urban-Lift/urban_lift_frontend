import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../providers/driver_provider.dart';
import '../../data/driver_models.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../shared/widgets/index.dart';

enum _Filter { all, nearby, highEarning }

class MatchingPassengersScreen extends ConsumerStatefulWidget {
  const MatchingPassengersScreen({super.key});

  @override
  ConsumerState<MatchingPassengersScreen> createState() => _MatchingPassengersScreenState();
}

class _MatchingPassengersScreenState extends ConsumerState<MatchingPassengersScreen> {
  _Filter _filter    = _Filter.all;
  String? _accepting;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(driverProvider.notifier).load();
    });
  }

  List<PassengerRequest> _filtered(List<PassengerRequest> all) {
    return switch (_filter) {
      _Filter.nearby      => all.where((r) => r.distanceKm <= 5).toList(),
      _Filter.highEarning => all.where((r) => r.priceOffered >= 30).toList(),
      _Filter.all         => all,
    };
  }

  Future<void> _accept(PassengerRequest req) async {
    setState(() => _accepting = req.id);
    try {
      final trip = await ref.read(driverProvider.notifier).acceptRequest(req.id);
      if (mounted) context.push('/driver/navigate/${trip.id}');
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString()), backgroundColor: AppColors.error),
        );
        setState(() => _accepting = null);
      }
    }
  }

  Future<void> _decline(String id) async {
    await ref.read(driverProvider.notifier).declineRequest(id);
  }

  @override
  Widget build(BuildContext context) {
    final state   = ref.watch(driverProvider);
    final visible = _filtered(state.requests);

    return Scaffold(
      backgroundColor: AppColors.surface,
      body: SafeArea(
        child: Column(
          children: [
            // Header
            Container(
              color: Colors.white,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Padding(
                    padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
                    child: Row(children: [
                      IconButton(
                        onPressed: () => context.pop(),
                        icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 18),
                        style: IconButton.styleFrom(backgroundColor: AppColors.surface),
                      ),
                      const SizedBox(width: 8),
                      const Text('Ride Requests', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
                    ]),
                  ),
                  // Filter chips
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.fromLTRB(16, 10, 16, 12),
                    child: Row(children: _Filter.values.map((f) {
                      final labels = {_Filter.all: 'All', _Filter.nearby: 'Nearby (≤5 km)', _Filter.highEarning: 'High Earning (≥GHS 30)'};
                      final active = _filter == f;
                      return Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: GestureDetector(
                          onTap: () => setState(() => _filter = f),
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 150),
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                            decoration: BoxDecoration(
                              color: active ? AppColors.primary : Colors.white,
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(color: active ? AppColors.primary : AppColors.border),
                            ),
                            child: Text(labels[f]!,
                                style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600,
                                    color: active ? Colors.white : AppColors.gray)),
                          ),
                        ),
                      );
                    }).toList()),
                  ),
                ],
              ),
            ),
            const Divider(height: 1),

            Expanded(
              child: state.isLoading
                ? const Center(child: CircularProgressIndicator(color: AppColors.primary))
                : visible.isEmpty
                  ? Center(child: Column(mainAxisSize: MainAxisSize.min, children: [
                      Container(
                        width: 64, height: 64,
                        decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(16)),
                        child: const Icon(Icons.tune_rounded, size: 28, color: AppColors.gray),
                      ),
                      const SizedBox(height: 16),
                      const Text('No matching requests', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600)),
                      const SizedBox(height: 6),
                      const Text('Try adjusting the filter', style: TextStyle(fontSize: 13, color: AppColors.gray)),
                    ]))
                  : ListView.builder(
                      padding: const EdgeInsets.all(16),
                      itemCount: visible.length,
                      itemBuilder: (context, i) => Padding(
                        padding: const EdgeInsets.only(bottom: 12),
                        child: _RequestDetailCard(
                          req: visible[i],
                          accepting: _accepting == visible[i].id,
                          onAccept: () => _accept(visible[i]),
                          onDecline: () => _decline(visible[i].id),
                        ),
                      ),
                    ),
            ),
          ],
        ),
      ),
    );
  }
}

class _RequestDetailCard extends StatelessWidget {
  const _RequestDetailCard({
    required this.req,
    required this.accepting,
    required this.onAccept,
    required this.onDecline,
  });
  final PassengerRequest req;
  final bool accepting;
  final VoidCallback onAccept;
  final VoidCallback onDecline;

  @override
  Widget build(BuildContext context) {
    final minsAgo = DateTime.now().difference(req.requestedAt).inMinutes;

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(14),
            child: Column(
              children: [
                // Passenger + price
                Row(children: [
                  ULAvatar(name: req.passenger.fullName, size: AvatarSize.sm),
                  const SizedBox(width: 10),
                  Expanded(child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(req.passenger.fullName, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                      Text('★ ${req.passenger.rating} · ${req.passenger.totalTrips} trips',
                          style: const TextStyle(fontSize: 11, color: AppColors.gray)),
                    ],
                  )),
                  Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
                    Text('GHS ${req.priceOffered.toStringAsFixed(0)}',
                        style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 18, color: AppColors.primary)),
                    Text('${minsAgo}m ago', style: const TextStyle(fontSize: 11, color: AppColors.gray)),
                  ]),
                ]),
                const SizedBox(height: 12),

                // Route detail
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(12)),
                  child: Column(children: [
                    Row(children: [
                      Container(width: 8, height: 8, decoration: const BoxDecoration(color: AppColors.primary, shape: BoxShape.circle)),
                      const SizedBox(width: 10),
                      Expanded(child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Pickup', style: TextStyle(fontSize: 10, color: AppColors.gray)),
                          Text(req.pickupLocation, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500)),
                        ],
                      )),
                    ]),
                    Container(width: 1, height: 12, margin: const EdgeInsets.only(left: 3), color: AppColors.border),
                    Row(children: [
                      Container(width: 8, height: 8, decoration: const BoxDecoration(color: AppColors.error, shape: BoxShape.circle)),
                      const SizedBox(width: 10),
                      Expanded(child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Drop-off', style: TextStyle(fontSize: 10, color: AppColors.gray)),
                          Text(req.dropoffLocation, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500)),
                        ],
                      )),
                    ]),
                  ]),
                ),
                const SizedBox(height: 8),
                Row(children: [
                  const Icon(Icons.location_on_rounded, size: 12, color: AppColors.gray),
                  Text(' ${req.distanceKm} km away', style: const TextStyle(fontSize: 11, color: AppColors.gray)),
                  const SizedBox(width: 12),
                  const Icon(Icons.access_time_rounded, size: 12, color: AppColors.gray),
                  Text(' ~${req.estimatedMinutes} min trip', style: const TextStyle(fontSize: 11, color: AppColors.gray)),
                  const SizedBox(width: 12),
                  const Icon(Icons.event_seat_rounded, size: 12, color: AppColors.gray),
                  Text(' ${req.seatsRequested} seat${req.seatsRequested != 1 ? 's' : ''}',
                      style: const TextStyle(fontSize: 11, color: AppColors.gray)),
                ]),
              ],
            ),
          ),
          const Divider(height: 1),
          Row(children: [
            Expanded(
              child: GestureDetector(
                onTap: accepting ? null : onDecline,
                child: Container(
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  decoration: const BoxDecoration(borderRadius: BorderRadius.only(bottomLeft: Radius.circular(16))),
                  child: const Center(child: Text('Decline', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.gray))),
                ),
              ),
            ),
            Container(width: 1, height: 48, color: AppColors.border),
            Expanded(
              child: GestureDetector(
                onTap: accepting ? null : onAccept,
                child: Container(
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  decoration: const BoxDecoration(borderRadius: BorderRadius.only(bottomRight: Radius.circular(16))),
                  child: Center(
                    child: accepting
                        ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.primary))
                        : const Text('Accept Ride', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.primary)),
                  ),
                ),
              ),
            ),
          ]),
        ],
      ),
    );
  }
}
