import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../providers/driver_provider.dart';
import '../../data/driver_models.dart';
import '../../../auth/presentation/providers/auth_provider.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../shared/widgets/index.dart';

class DriverDashboardScreen extends ConsumerStatefulWidget {
  const DriverDashboardScreen({super.key});

  @override
  ConsumerState<DriverDashboardScreen> createState() => _DriverDashboardScreenState();
}

class _DriverDashboardScreenState extends ConsumerState<DriverDashboardScreen> {
  bool _toggling = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(driverProvider.notifier).load();
    });
  }

  Future<void> _toggle() async {
    setState(() => _toggling = true);
    try {
      await ref.read(driverProvider.notifier).toggleOnline();
    } finally {
      if (mounted) setState(() => _toggling = false);
    }
  }

  Future<void> _accept(PassengerRequest req) async {
    try {
      final trip = await ref.read(driverProvider.notifier).acceptRequest(req.id);
      if (mounted) context.push('/driver/navigate/${trip.id}');
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString()), backgroundColor: AppColors.error),
        );
      }
    }
  }

  Future<void> _decline(String id) async {
    await ref.read(driverProvider.notifier).declineRequest(id);
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(driverProvider);
    final user  = ref.watch(authProvider).user;

    return Scaffold(
      backgroundColor: AppColors.surface,
      body: SingleChildScrollView(
        child: Column(
          children: [
            // ── Green header ───────────────────────────────────────────────
            Container(
              color: AppColors.primary,
              padding: const EdgeInsets.fromLTRB(20, 56, 20, 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Welcome back,', style: TextStyle(color: AppColors.primaryLight, fontSize: 13)),
                          Text(
                            user?.fullName.split(' ').first ?? 'Driver',
                            style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.w800),
                          ),
                        ],
                      ),
                      const Spacer(),
                      GestureDetector(
                        onTap: () => context.push('/profile'),
                        child: ULAvatar(name: user?.fullName ?? '', size: AvatarSize.sm),
                      ),
                    ],
                  ),

                  // Week earnings
                  if (state.stats != null) ...[
                    const SizedBox(height: 16),
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white.withAlpha(25),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Week Earnings', style: TextStyle(color: AppColors.primaryLight, fontSize: 12)),
                          const SizedBox(height: 4),
                          Text('GHS ${state.stats!.weekEarnings.toStringAsFixed(0)}',
                              style: const TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.w900)),
                          Text('${state.stats!.totalTrips} total trips · GHS ${state.stats!.totalEarnings.toStringAsFixed(0)} lifetime',
                              style: TextStyle(color: Colors.white.withAlpha(180), fontSize: 12)),
                        ],
                      ),
                    ),
                  ],
                ],
              ),
            ),

            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  // ── Online toggle ────────────────────────────────────────
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppColors.border),
                    ),
                    child: Row(
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(state.isOnline ? "You're Online" : "You're Offline",
                                  style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 15)),
                              Text(state.isOnline ? 'Accepting ride requests' : 'Go online to receive requests',
                                  style: const TextStyle(fontSize: 12, color: AppColors.gray)),
                            ],
                          ),
                        ),
                        GestureDetector(
                          onTap: _toggling ? null : _toggle,
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 200),
                            width: 52, height: 28,
                            padding: const EdgeInsets.all(2),
                            decoration: BoxDecoration(
                              color: state.isOnline ? AppColors.primary : AppColors.border,
                              borderRadius: BorderRadius.circular(14),
                            ),
                            child: AnimatedAlign(
                              duration: const Duration(milliseconds: 200),
                              alignment: state.isOnline ? Alignment.centerRight : Alignment.centerLeft,
                              child: Container(
                                width: 24, height: 24,
                                decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),

                  // ── Stats grid ───────────────────────────────────────────
                  if (state.isLoading)
                    const Center(child: Padding(
                      padding: EdgeInsets.all(24),
                      child: CircularProgressIndicator(color: AppColors.primary),
                    ))
                  else if (state.stats != null)
                    _StatsGrid(stats: state.stats!),

                  const SizedBox(height: 16),

                  // ── Incoming requests ────────────────────────────────────
                  if (state.isOnline) ...[
                    Row(
                      children: [
                        const Text('Incoming Requests', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 15)),
                        const Spacer(),
                        if (state.requests.isNotEmpty)
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(color: AppColors.primaryLight, borderRadius: BorderRadius.circular(10)),
                            child: Text('${state.requests.length}',
                                style: const TextStyle(fontSize: 11, color: AppColors.primary, fontWeight: FontWeight.w700)),
                          ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    if (state.requests.isEmpty)
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(24),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: AppColors.border),
                        ),
                        child: const Column(children: [
                          Icon(Icons.directions_car_outlined, size: 32, color: AppColors.border),
                          SizedBox(height: 8),
                          Text('No requests right now', style: TextStyle(color: AppColors.gray, fontSize: 14, fontWeight: FontWeight.w500)),
                          SizedBox(height: 4),
                          Text('Stay online to receive ride requests', style: TextStyle(color: AppColors.gray, fontSize: 12)),
                        ]),
                      )
                    else ...[
                      ...state.requests.take(2).map((req) => Padding(
                        padding: const EdgeInsets.only(bottom: 12),
                        child: _RequestCard(req: req, onAccept: () => _accept(req), onDecline: () => _decline(req.id)),
                      )),
                      if (state.requests.length > 2)
                        GestureDetector(
                          onTap: () => context.push('/driver/passengers'),
                          child: Container(
                            width: double.infinity,
                            padding: const EdgeInsets.symmetric(vertical: 14),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(color: AppColors.primary.withAlpha(60)),
                            ),
                            child: Center(
                              child: Text('View all ${state.requests.length} requests →',
                                  style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.primary)),
                            ),
                          ),
                        ),
                    ],
                  ] else
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(24),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppColors.border),
                      ),
                      child: Column(children: [
                        Container(
                          width: 56, height: 56,
                          decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(16)),
                          child: const Icon(Icons.directions_car_outlined, size: 28, color: AppColors.gray),
                        ),
                        const SizedBox(height: 12),
                        const Text('Go online to start earning', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                        const SizedBox(height: 4),
                        const Text('Toggle the switch above to receive ride requests',
                            style: TextStyle(color: AppColors.gray, fontSize: 12), textAlign: TextAlign.center),
                      ]),
                    ),

                  const SizedBox(height: 24),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _StatsGrid extends StatelessWidget {
  const _StatsGrid({required this.stats});
  final DriverStats stats;

  @override
  Widget build(BuildContext context) {
    final cards = [
      (label: "Today's Earnings", value: 'GHS ${stats.todayEarnings.toStringAsFixed(0)}', icon: Icons.trending_up_rounded, color: AppColors.primary, bg: AppColors.primaryLight),
      (label: "Today's Trips",    value: '${stats.todayTrips}',                            icon: Icons.directions_car_rounded, color: Colors.blue.shade700, bg: const Color(0xFFDBEAFE)),
      (label: 'Rating',           value: stats.rating.toStringAsFixed(1),                  icon: Icons.star_rounded,           color: const Color(0xFFD97706), bg: const Color(0xFFFEF3C7)),
      (label: 'Acceptance',       value: '${stats.acceptanceRate}%',                       icon: Icons.check_circle_rounded,   color: Colors.purple.shade700,  bg: const Color(0xFFEDE9FE)),
    ];

    return GridView.count(
      crossAxisCount: 2, crossAxisSpacing: 12, mainAxisSpacing: 12,
      childAspectRatio: 1.5, shrinkWrap: true, physics: const NeverScrollableScrollPhysics(),
      children: cards.map((c) => Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: Colors.white, borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.border),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 32, height: 32,
              decoration: BoxDecoration(color: c.bg, borderRadius: BorderRadius.circular(10)),
              child: Icon(c.icon, size: 16, color: c.color),
            ),
            const Spacer(),
            Text(c.value, style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: c.color)),
            Text(c.label, style: const TextStyle(fontSize: 11, color: AppColors.gray)),
          ],
        ),
      )).toList(),
    );
  }
}

class _RequestCard extends StatelessWidget {
  const _RequestCard({required this.req, required this.onAccept, required this.onDecline});
  final PassengerRequest req;
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
                Row(
                  children: [
                    ULAvatar(name: req.passenger.fullName, size: AvatarSize.sm),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(req.passenger.fullName, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                          Text('★ ${req.passenger.rating} · ${req.passenger.totalTrips} trips · ${minsAgo}m ago',
                              style: const TextStyle(fontSize: 11, color: AppColors.gray)),
                        ],
                      ),
                    ),
                    Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
                      Text('GHS ${req.priceOffered.toStringAsFixed(0)}',
                          style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 16, color: AppColors.primary)),
                      Text('${req.distanceKm} km · ${req.estimatedMinutes} min',
                          style: const TextStyle(fontSize: 11, color: AppColors.gray)),
                    ]),
                  ],
                ),
                const SizedBox(height: 10),
                // Route summary
                Row(children: [
                  Column(children: [
                    Container(width: 8, height: 8, decoration: const BoxDecoration(color: AppColors.primary, shape: BoxShape.circle)),
                    Container(width: 1, height: 16, color: AppColors.border),
                    Container(width: 8, height: 8, decoration: const BoxDecoration(color: AppColors.error, shape: BoxShape.circle)),
                  ]),
                  const SizedBox(width: 8),
                  Expanded(child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(req.pickupLocation, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500)),
                      const SizedBox(height: 8),
                      Text(req.dropoffLocation, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500)),
                    ],
                  )),
                  Text('${req.seatsRequested} seat${req.seatsRequested != 1 ? 's' : ''}',
                      style: const TextStyle(fontSize: 11, color: AppColors.gray)),
                ]),
              ],
            ),
          ),
          const Divider(height: 1),
          Row(children: [
            Expanded(
              child: GestureDetector(
                onTap: onDecline,
                child: Container(
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  decoration: const BoxDecoration(borderRadius: BorderRadius.only(bottomLeft: Radius.circular(16))),
                  child: const Center(child: Text('Decline', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.gray))),
                ),
              ),
            ),
            Container(width: 1, height: 44, color: AppColors.border),
            Expanded(
              child: GestureDetector(
                onTap: onAccept,
                child: Container(
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  decoration: const BoxDecoration(borderRadius: BorderRadius.only(bottomRight: Radius.circular(16))),
                  child: const Center(child: Text('Accept', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.primary))),
                ),
              ),
            ),
          ]),
        ],
      ),
    );
  }
}
