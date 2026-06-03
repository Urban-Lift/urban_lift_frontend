import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../auth/presentation/providers/auth_provider.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../shared/widgets/bottom_nav_bar.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final auth = ref.watch(authProvider);
    final user = auth.user;

    final words = user?.fullName.split(' ') ?? [];
    final initials = words.isEmpty
        ? '?'
        : words
            .map((n) => n.isNotEmpty ? n[0] : '')
            .join()
            .substring(0, words.length >= 2 ? 2 : 1)
            .toUpperCase();

    final rating = (user?.avgRating ?? 4.8).toStringAsFixed(1);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
        centerTitle: true,
        title: const Text('Profile & Settings',
            style: TextStyle(fontWeight: FontWeight.w700, fontSize: 17, color: AppColors.dark)),
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(16, 20, 16, 100),
        children: [
          // Avatar + name
          Center(
            child: Column(
              children: [
                Stack(
                  clipBehavior: Clip.none,
                  children: [
                    Container(
                      width: 90,
                      height: 90,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: AppColors.lightGreen,
                        border: Border.all(color: AppColors.primary.withAlpha(60), width: 3),
                      ),
                      child: Center(
                        child: Text(initials,
                            style: const TextStyle(
                                fontSize: 32,
                                fontWeight: FontWeight.w800,
                                color: AppColors.primary)),
                      ),
                    ),
                    Positioned(
                      bottom: 0,
                      right: 0,
                      child: GestureDetector(
                        onTap: () => context.push('/profile/edit'),
                        child: Container(
                          width: 28,
                          height: 28,
                          decoration: BoxDecoration(
                            color: AppColors.primary,
                            shape: BoxShape.circle,
                            border: Border.all(color: Colors.white, width: 2),
                          ),
                          child: const Icon(Icons.settings_rounded,
                              size: 14, color: Colors.white),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Text(user?.fullName ?? 'User',
                    style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w700,
                        color: AppColors.dark)),
                const SizedBox(height: 6),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFFF8E1),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: const Color(0xFFFBBF24).withAlpha(80)),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.star_rounded, size: 14, color: Color(0xFFFBBF24)),
                      const SizedBox(width: 4),
                      Text('$rating Rating',
                          style: const TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.w600,
                              color: Color(0xFF92400E))),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Wallet balance button
          GestureDetector(
            onTap: () => context.push('/wallet'),
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 14),
              decoration: BoxDecoration(
                color: const Color(0xFF22C55E),
                borderRadius: BorderRadius.circular(14),
              ),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.credit_card_rounded, size: 18, color: Colors.white),
                  SizedBox(width: 8),
                  Text('Balance: GHS 245.50',
                      style: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.w700,
                          fontSize: 15)),
                ],
              ),
            ),
          ),
          const SizedBox(height: 20),

          // Group 1: Edit Profile, Saved Routes, Notifications
          _MenuGroup(
            items: [
              _MenuItem(
                icon: Icons.edit_outlined,
                iconColor: const Color(0xFF16A34A),
                iconBg: const Color(0xFFDCFCE7),
                label: 'Edit Profile',
                onTap: () => context.push('/profile/edit'),
              ),
              _MenuItem(
                icon: Icons.map_outlined,
                iconColor: const Color(0xFF16A34A),
                iconBg: const Color(0xFFDCFCE7),
                label: 'Saved Routes',
                onTap: () => context.push('/profile/routes'),
              ),
              _MenuItem(
                icon: Icons.notifications_outlined,
                iconColor: const Color(0xFF16A34A),
                iconBg: const Color(0xFFDCFCE7),
                label: 'Notifications',
                onTap: () => context.push('/profile/notifications'),
                divider: false,
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Group 2: Help & Support, Refer a Friend
          _MenuGroup(
            items: [
              _MenuItem(
                icon: Icons.headset_mic_outlined,
                iconColor: const Color(0xFF16A34A),
                iconBg: const Color(0xFFDCFCE7),
                label: 'Help & Support',
                onTap: () {},
              ),
              _MenuItem(
                icon: Icons.people_outline_rounded,
                iconColor: const Color(0xFF16A34A),
                iconBg: const Color(0xFFDCFCE7),
                label: 'Refer a Friend',
                subtitle: 'Earn GHS 10.00 credit',
                onTap: () => context.push('/profile/refer'),
                divider: false,
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Group 3: Log Out
          _MenuGroup(
            items: [
              _MenuItem(
                icon: Icons.logout_rounded,
                iconColor: AppColors.error,
                iconBg: const Color(0xFFFEE2E2),
                label: 'Log Out',
                labelColor: AppColors.error,
                onTap: () {
                  ref.read(authProvider.notifier).logout();
                  context.go('/startup');
                },
                showChevron: false,
                divider: false,
              ),
            ],
          ),

          const SizedBox(height: 20),
          const Center(
            child: Text('Version 2.4.1 (Accra Beta)',
                style: TextStyle(fontSize: 12, color: AppColors.gray)),
          ),
        ],
      ),
      bottomNavigationBar: const ULBottomNavBar(currentIndex: 3),
    );
  }
}

class _MenuGroup extends StatelessWidget {
  final List<_MenuItem> items;
  const _MenuGroup({required this.items});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        children: items,
      ),
    );
  }
}

class _MenuItem extends StatelessWidget {
  final IconData icon;
  final Color iconColor;
  final Color iconBg;
  final String label;
  final Color? labelColor;
  final String? subtitle;
  final VoidCallback onTap;
  final bool divider;
  final bool showChevron;

  const _MenuItem({
    required this.icon,
    required this.iconColor,
    required this.iconBg,
    required this.label,
    required this.onTap,
    this.labelColor,
    this.subtitle,
    this.divider = true,
    this.showChevron = true,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(16),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 13),
            child: Row(
              children: [
                Container(
                  width: 38,
                  height: 38,
                  decoration: BoxDecoration(
                      color: iconBg, borderRadius: BorderRadius.circular(10)),
                  child: Icon(icon, size: 18, color: iconColor),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(label,
                          style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                              color: labelColor ?? AppColors.dark)),
                      if (subtitle != null) ...[
                        const SizedBox(height: 1),
                        Text(subtitle!,
                            style: const TextStyle(
                                fontSize: 12, color: AppColors.gray)),
                      ],
                    ],
                  ),
                ),
                if (showChevron)
                  const Icon(Icons.chevron_right_rounded,
                      color: AppColors.gray, size: 20),
              ],
            ),
          ),
        ),
        if (divider)
          const Divider(height: 1, indent: 68, endIndent: 0),
      ],
    );
  }
}
