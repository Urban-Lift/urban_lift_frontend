import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../providers/ride_provider.dart';
import '../../data/ride_models.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../shared/widgets/index.dart';

class MyRidesScreen extends ConsumerStatefulWidget {
  const MyRidesScreen({super.key});

  @override
  ConsumerState<MyRidesScreen> createState() => _MyRidesScreenState();
}

class _MyRidesScreenState extends ConsumerState<MyRidesScreen> with SingleTickerProviderStateMixin {
  late TabController _tabs;

  @override
  void initState() {
    super.initState();
    _tabs = TabController(length: 2, vsync: this);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(myRidesProvider.notifier).load();
    });
  }

  @override
  void dispose() {
    _tabs.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(myRidesProvider);

    return Scaffold(
      backgroundColor: AppColors.surface,
      body: SafeArea(
        child: Column(
          children: [
            // Header + tabs
            Container(
              color: Colors.white,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Padding(
                    padding: EdgeInsets.fromLTRB(20, 20, 20, 0),
                    child: Text('My Rides', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800)),
                  ),
                  TabBar(
                    controller: _tabs,
                    labelColor: AppColors.primary,
                    unselectedLabelColor: AppColors.gray,
                    indicatorColor: AppColors.primary,
                    indicatorWeight: 2.5,
                    tabs: [
                      Tab(
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Text('Upcoming'),
                            if (state.upcoming.isNotEmpty) ...[
                              const SizedBox(width: 6),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
                                decoration: BoxDecoration(color: AppColors.primaryLight, borderRadius: BorderRadius.circular(10)),
                                child: Text('${state.upcoming.length}', style: const TextStyle(fontSize: 11, color: AppColors.primary, fontWeight: FontWeight.w700)),
                              ),
                            ],
                          ],
                        ),
                      ),
                      const Tab(text: 'Past'),
                    ],
                  ),
                ],
              ),
            ),
            const Divider(height: 1),

            Expanded(
              child: state.isLoading
                  ? const Center(child: CircularProgressIndicator(color: AppColors.primary))
                  : TabBarView(
                      controller: _tabs,
                      children: [
                        _RidesList(bookings: state.upcoming, isEmpty: state.upcoming.isEmpty, isUpcoming: true),
                        _RidesList(bookings: state.past, isEmpty: state.past.isEmpty, isUpcoming: false),
                      ],
                    ),
            ),
          ],
        ),
      ),
    );
  }
}

class _RidesList extends ConsumerWidget {
  const _RidesList({required this.bookings, required this.isEmpty, required this.isUpcoming});
  final List<BookingModel> bookings;
  final bool isEmpty;
  final bool isUpcoming;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    if (isEmpty) {
      return Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 64, height: 64,
              decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(16)),
              child: const Icon(Icons.directions_car_outlined, size: 32, color: AppColors.gray),
            ),
            const SizedBox(height: 16),
            Text(isUpcoming ? 'No upcoming rides' : 'No past rides', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
            const SizedBox(height: 8),
            Text(isUpcoming ? 'Book a ride to get started' : 'Your completed rides will appear here', style: const TextStyle(fontSize: 14, color: AppColors.gray)),
            if (isUpcoming) ...[
              const SizedBox(height: 16),
              TextButton(onPressed: () => context.go('/home'), child: const Text('Find a ride', style: TextStyle(color: AppColors.primary))),
            ],
          ],
        ),
      );
    }
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: bookings.length,
      itemBuilder: (context, i) => Padding(
        padding: const EdgeInsets.only(bottom: 12),
        child: _BookingCard(booking: bookings[i], ref: ref),
      ),
    );
  }
}

class _BookingCard extends StatelessWidget {
  const _BookingCard({required this.booking, required this.ref});
  final BookingModel booking;
  final WidgetRef ref;

  String _timeLabel(DateTime t) =>
      '${t.day}/${t.month}/${t.year}, ${t.hour.toString().padLeft(2, '0')}:${t.minute.toString().padLeft(2, '0')}';

  Color _statusColor(String s) => switch (s) {
    'confirmed'   => AppColors.primary,
    'pending'     => AppColors.warning,
    'completed'   => AppColors.gray,
    'cancelled'   => AppColors.error,
    _             => AppColors.gray,
  };

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Driver + status
          Row(
            children: [
              ULAvatar(name: booking.ride.driver.fullName, size: AvatarSize.sm),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(booking.ride.driver.fullName, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
                    Row(children: [
                      const Icon(Icons.star_rounded, size: 12, color: Color(0xFFFFB300)),
                      Text(' ${booking.ride.driver.avgRating.toStringAsFixed(1)}', style: const TextStyle(fontSize: 12, color: AppColors.gray)),
                    ]),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: _statusColor(booking.status).withAlpha(20),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: _statusColor(booking.status).withAlpha(60)),
                ),
                child: Text(
                  booking.status[0].toUpperCase() + booking.status.substring(1),
                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: _statusColor(booking.status)),
                ),
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
                  Container(width: 1, height: 20, color: AppColors.border),
                  Container(width: 8, height: 8, decoration: const BoxDecoration(color: AppColors.error, shape: BoxShape.circle)),
                ],
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(booking.ride.pickupLocation, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500)),
                    Text(_timeLabel(booking.ride.departureTime), style: const TextStyle(fontSize: 11, color: AppColors.gray)),
                    const SizedBox(height: 8),
                    Text(booking.ride.dropoffLocation, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500)),
                  ],
                ),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text('GHS ${booking.totalPrice.toStringAsFixed(0)}', style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.primary)),
                  Text('${booking.seatsBooked} seat${booking.seatsBooked != 1 ? 's' : ''}', style: const TextStyle(fontSize: 11, color: AppColors.gray)),
                ],
              ),
            ],
          ),

          // Action buttons
          if (booking.isUpcoming) ...[
            const SizedBox(height: 12),
            const Divider(height: 1),
            const SizedBox(height: 12),
            Row(children: [
              Expanded(
                child: GestureDetector(
                  onTap: () => context.push('/tracking/${booking.id}'),
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 10),
                    decoration: BoxDecoration(color: AppColors.primaryLight, borderRadius: BorderRadius.circular(10)),
                    child: const Center(child: Text('Track Ride', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.primary))),
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: GestureDetector(
                  onTap: () async {
                    await ref.read(myRidesProvider.notifier).cancel(booking.id);
                    if (context.mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Booking cancelled')));
                    }
                  },
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 10),
                    decoration: BoxDecoration(color: AppColors.error.withAlpha(20), borderRadius: BorderRadius.circular(10), border: Border.all(color: AppColors.error.withAlpha(60))),
                    child: const Center(child: Text('Cancel', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.error))),
                  ),
                ),
              ),
            ]),
          ],

          if (booking.status == 'completed') ...[
            const SizedBox(height: 12),
            const Divider(height: 1),
            const SizedBox(height: 12),
            GestureDetector(
              onTap: () => context.push('/rate/${booking.id}'),
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(vertical: 10),
                decoration: BoxDecoration(color: const Color(0xFFFFF8E1), borderRadius: BorderRadius.circular(10), border: Border.all(color: const Color(0xFFFFE082))),
                child: const Center(child: Text('★ Rate this ride', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: Color(0xFFE65100)))),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
