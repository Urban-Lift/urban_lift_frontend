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

  static const _passengerRoutes = ['/home', '/my-rides', '/community', '/profile'];
  static const _driverRoutes = ['/driver/home', '/driver/passengers', '/community', '/profile'];

  @override
  Widget build(BuildContext context) {
    final routes = isDriver ? _driverRoutes : _passengerRoutes;

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        border: const Border(top: BorderSide(color: AppColors.border, width: 0.8)),
        boxShadow: [
          BoxShadow(color: Colors.black.withAlpha(12), blurRadius: 16, offset: const Offset(0, -4)),
        ],
      ),
      child: SafeArea(
        top: false,
        child: SizedBox(
          height: 62,
          child: Row(
            children: [
              _NavItem(
                icon: Icons.home_outlined,
                activeIcon: Icons.home_rounded,
                label: 'Home',
                active: currentIndex == 0,
                onTap: () => context.go(routes[0]),
                showPill: true,
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
    this.showPill = false,
  });

  final IconData icon;
  final IconData activeIcon;
  final String label;
  final bool active;
  final VoidCallback onTap;
  final int badge;
  final bool showPill;

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        behavior: HitTestBehavior.opaque,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Stack(
              clipBehavior: Clip.none,
              alignment: Alignment.center,
              children: [
                // Pill background (only for items where showPill is true OR for all active items)
                AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  curve: Curves.easeInOut,
                  width: active ? 54 : 0,
                  height: 30,
                  decoration: BoxDecoration(
                    color: active ? AppColors.lightGreen : Colors.transparent,
                    borderRadius: BorderRadius.circular(20),
                  ),
                ),
                Icon(
                  active ? activeIcon : icon,
                  size: 22,
                  color: active ? AppColors.primary : AppColors.gray,
                ),
                if (badge > 0)
                  Positioned(
                    top: -6,
                    right: -8,
                    child: Container(
                      padding: const EdgeInsets.all(2),
                      decoration: const BoxDecoration(
                          color: Color(0xFFEF4444), shape: BoxShape.circle),
                      constraints: const BoxConstraints(minWidth: 16, minHeight: 16),
                      child: Text(
                        badge > 9 ? '9+' : '$badge',
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                            color: Colors.white, fontSize: 9, fontWeight: FontWeight.bold),
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
                fontWeight: active ? FontWeight.w600 : FontWeight.w500,
                color: active ? AppColors.primary : AppColors.gray,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
