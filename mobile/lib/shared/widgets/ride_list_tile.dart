import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';
import 'ul_avatar.dart';

class RideListTile extends StatelessWidget {
  const RideListTile({
    super.key,
    required this.driverName,
    required this.driverRating,
    required this.driverRideCount,
    required this.driverImageUrl,
    required this.departureTime,
    required this.arrivalTime,
    required this.pickupLocation,
    required this.dropoffLocation,
    required this.pricePerSeat,
    required this.seatsLeft,
    this.routeTag,
    this.isFull = false,
    this.isSuperDriver = false,
    this.onTap,
  });

  final String driverName;
  final double driverRating;
  final int driverRideCount;
  final String? driverImageUrl;
  final String departureTime;
  final String arrivalTime;
  final String pickupLocation;
  final String dropoffLocation;
  final double pricePerSeat;
  final int seatsLeft;
  final String? routeTag;
  final bool isFull;
  final bool isSuperDriver;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: isFull ? null : onTap,
      child: Opacity(
        opacity: isFull ? 0.6 : 1.0,
        child: Container(
          margin: const EdgeInsets.symmetric(vertical: 6),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.border),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withAlpha(10),
                blurRadius: 8, offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Driver row
              Row(
                children: [
                  ULAvatar(
                    imageUrl: driverImageUrl,
                    name: driverName,
                    size: AvatarSize.md,
                    isVerified: isSuperDriver,
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          _shortName(driverName),
                          style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15),
                        ),
                        Row(children: [
                          const Icon(Icons.star_rounded, color: Color(0xFFFBBF24), size: 14),
                          const SizedBox(width: 2),
                          Text(
                            '${driverRating.toStringAsFixed(1)} · $driverRideCount rides',
                            style: const TextStyle(fontSize: 12, color: AppColors.gray),
                          ),
                        ]),
                      ],
                    ),
                  ),
                  Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
                    Text(
                      'GHS ${pricePerSeat.toStringAsFixed(0)}',
                      style: const TextStyle(
                        color: AppColors.primary, fontWeight: FontWeight.bold, fontSize: 16,
                      ),
                    ),
                    const Text('per seat', style: TextStyle(fontSize: 11, color: AppColors.gray)),
                  ]),
                ],
              ),
              const SizedBox(height: 12),
              // Route column
              _RouteRow(
                departureTime: departureTime,
                pickup: pickupLocation,
                arrivalTime: arrivalTime,
                dropoff: dropoffLocation,
              ),
              const SizedBox(height: 10),
              // Tags row
              Row(
                children: [
                  if (routeTag != null)
                    _Tag(label: routeTag!, icon: Icons.route),
                  const Spacer(),
                  if (isFull)
                    _Tag(label: 'FULL', icon: Icons.block, color: AppColors.error)
                  else
                    _Tag(
                      label: '$seatsLeft left',
                      icon: Icons.airline_seat_recline_normal_rounded,
                    ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  String _shortName(String name) {
    final parts = name.trim().split(' ');
    if (parts.length == 1) return parts[0];
    return '${parts[0]} ${parts[1][0]}.';
  }
}

class _RouteRow extends StatelessWidget {
  const _RouteRow({
    required this.departureTime,
    required this.pickup,
    required this.arrivalTime,
    required this.dropoff,
  });

  final String departureTime;
  final String pickup;
  final String arrivalTime;
  final String dropoff;

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Column(children: [
          const Icon(Icons.circle, size: 10, color: AppColors.dark),
          Container(width: 1.5, height: 20, color: AppColors.border),
          const Icon(Icons.circle, size: 10, color: AppColors.primary),
        ]),
        const SizedBox(width: 10),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(children: [
                Text(departureTime, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(pickup,
                    style: const TextStyle(fontSize: 12, color: AppColors.gray),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ]),
              const SizedBox(height: 10),
              Row(children: [
                Text(arrivalTime, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(dropoff,
                    style: const TextStyle(fontSize: 12, color: AppColors.gray),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ]),
            ],
          ),
        ),
      ],
    );
  }
}

class _Tag extends StatelessWidget {
  const _Tag({required this.label, required this.icon, this.color = AppColors.gray});
  final String label;
  final IconData icon;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withAlpha(20),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 12, color: color),
          const SizedBox(width: 4),
          Text(label, style: TextStyle(fontSize: 11, color: color, fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }
}
