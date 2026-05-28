import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_theme.dart';

class ULBottomNavBar extends StatelessWidget {
  const ULBottomNavBar({
    super.key,
    required this.currentIndex,
    this.isDriver = false,
    this.messageBadge = 0,
  });

  final int currentIndex;
  final bool isDriver;
  final int messageBadge;

  static const _passengerRoutes = [
    '/home', '/my-rides', '/community', '/profile',
  ];
  static const _driverRoutes = [
    '/driver/home', '/driver/passengers', '/community', '/profile',
  ];

  @override
  Widget build(BuildContext context) {
    final routes = isDriver ? _driverRoutes : _passengerRoutes;

    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(top: BorderSide(color: AppColors.border)),
      ),
      child: SafeArea(
        top: false,
        child: SizedBox(
          height: 60,
          child: Row(
            children: [
              _NavItem(
                icon: Icons.home_outlined,
                activeIcon: Icons.home_rounded,
                label: 'Home',
                active: currentIndex == 0,
                onTap: () => context.go(routes[0]),
              ),
              _NavItem(
                icon: Icons.directions_car_outlined,
                activeIcon: Icons.directions_car_rounded,
                label: 'Rides',
                active: currentIndex == 1,
                onTap: () => context.go(routes[1]),
              ),
              _NavItem(
                icon: Icons.chat_bubble_outline_rounded,
                activeIcon: Icons.chat_bubble_rounded,
                label: 'Messages',
                active: currentIndex == 2,
                badge: messageBadge,
                onTap: () => context.go(routes[2]),
              ),
              _NavItem(
                icon: Icons.person_outline_rounded,
                activeIcon: Icons.person_rounded,
                label: 'Profile',
                active: currentIndex == 3,
                onTap: () => context.go(routes[3]),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _NavItem extends StatelessWidget {
  const _NavItem({
    required this.icon,
    required this.activeIcon,
    required this.label,
    required this.active,
    required this.onTap,
    this.badge = 0,
  });

  final IconData icon;
  final IconData activeIcon;
  final String label;
  final bool active;
  final VoidCallback onTap;
  final int badge;

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: InkWell(
        onTap: onTap,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Stack(
              clipBehavior: Clip.none,
              children: [
                Icon(
                  active ? activeIcon : icon,
                  size: 24,
                  color: active ? AppColors.primary : AppColors.gray,
                ),
                if (badge > 0)
                  Positioned(
                    top: -4, right: -6,
                    child: Container(
                      padding: const EdgeInsets.all(2),
                      decoration: const BoxDecoration(
                        color: Color(0xFFEF4444),
                        shape: BoxShape.circle,
                      ),
                      constraints: const BoxConstraints(minWidth: 16, minHeight: 16),
                      child: Text(
                        badge > 9 ? '9+' : '$badge',
                        textAlign: TextAlign.center,
                        style: const TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 3),
            Text(
              label,
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w500,
                color: active ? AppColors.primary : AppColors.gray,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
