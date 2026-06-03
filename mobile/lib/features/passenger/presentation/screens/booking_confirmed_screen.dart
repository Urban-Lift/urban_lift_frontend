import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../providers/ride_provider.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../shared/widgets/index.dart';

class BookingConfirmedScreen extends ConsumerWidget {
  const BookingConfirmedScreen({super.key, required this.bookingId});
  final String bookingId;

  String _fmt(DateTime t) =>
      '${t.day}/${t.month}/${t.year}, ${t.hour.toString().padLeft(2, '0')}:${t.minute.toString().padLeft(2, '0')}';

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final booking = ref.watch(myRidesProvider).currentBooking;

    if (booking == null) {
      return Scaffold(
        body: Center(child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text('Booking not found'),
            const SizedBox(height: 12),
            ULButton(label: 'Go Home', onPressed: () => context.go('/home'), fullWidth: false),
          ],
        )),
      );
    }

    final ride = booking.ride;

    return Scaffold(
      backgroundColor: AppColors.surface,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Column(
            children: [
              const SizedBox(height: 40),

              // Checkmark
              Container(
                width: 80, height: 80,
                decoration: BoxDecoration(color: AppColors.primaryLight, shape: BoxShape.circle),
                child: const Icon(Icons.check_circle_rounded, size: 48, color: AppColors.primary),
              ),
              const SizedBox(height: 20),

              const Text('Booking Confirmed!', style: TextStyle(fontSize: 24, fontWeight: FontWeight.w800, color: AppColors.dark)),
              const SizedBox(height: 6),
              Text(
                "You'll hear from ${ride.driver.fullName.split(' ').first} before departure",
                style: const TextStyle(fontSize: 14, color: AppColors.gray),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 28),

              // Driver card
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.border),
                ),
                child: Row(
                  children: [
                    ULAvatar(name: ride.driver.fullName, size: AvatarSize.md),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(ride.driver.fullName, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 15)),
                          Row(children: [
                            const Icon(Icons.star_rounded, size: 13, color: Color(0xFFFFB300)),
                            Text(' ${ride.driver.avgRating.toStringAsFixed(1)}', style: const TextStyle(fontSize: 12, color: AppColors.gray)),
                            Text(' · ${ride.vehicle.color} ${ride.vehicle.make}', style: const TextStyle(fontSize: 12, color: AppColors.gray)),
                          ]),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),

              // Trip details card
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.border),
                ),
                child: Column(
                  children: [
                    _DetailRow(icon: Icons.location_on, iconColor: AppColors.primary, label: 'Pickup', value: ride.pickupLocation),
                    const Divider(height: 16),
                    _DetailRow(icon: Icons.location_on, iconColor: AppColors.error, label: 'Drop-off', value: ride.dropoffLocation),
                    const Divider(height: 16),
                    _DetailRow(icon: Icons.access_time_rounded, iconColor: AppColors.gray, label: 'Departure', value: _fmt(ride.departureTime)),
                    const Divider(height: 16),
                    _DetailRow(icon: Icons.event_seat_rounded, iconColor: AppColors.gray, label: 'Seats', value: '${booking.seatsBooked} seat${booking.seatsBooked != 1 ? 's' : ''}'),
                  ],
                ),
              ),
              const SizedBox(height: 12),

              // Price
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                decoration: BoxDecoration(
                  color: AppColors.primaryLight,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFF6EE7B7)),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Total Paid', style: TextStyle(fontWeight: FontWeight.w700, color: AppColors.primaryDark)),
                    Text('GHS ${booking.totalPrice.toStringAsFixed(2)}', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: AppColors.primary)),
                  ],
                ),
              ),
              const SizedBox(height: 8),
              Text('Booking ref: ${booking.id.toUpperCase()}', style: const TextStyle(fontSize: 11, color: AppColors.gray, fontFamily: 'monospace')),
              const SizedBox(height: 32),

              ULButton(label: 'View My Rides', onPressed: () => context.go('/my-rides')),
              const SizedBox(height: 12),
              ULButton(label: 'Find Another Ride', variant: ULButtonVariant.outline, onPressed: () => context.go('/home')),
              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }
}

class _DetailRow extends StatelessWidget {
  const _DetailRow({required this.icon, required this.iconColor, required this.label, required this.value});
  final IconData icon;
  final Color iconColor;
  final String label;
  final String value;

  @override
  Widget build(BuildContext context) => Row(
        children: [
          Icon(icon, size: 16, color: iconColor),
          const SizedBox(width: 10),
          Text(label, style: const TextStyle(fontSize: 12, color: AppColors.gray)),
          const Spacer(),
          Flexible(
            child: Text(value, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600), textAlign: TextAlign.right),
          ),
        ],
      );
}
