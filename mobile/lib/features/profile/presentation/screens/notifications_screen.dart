import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../providers/profile_provider.dart';
import '../../data/profile_models.dart';
import '../../../../core/theme/app_theme.dart';

class _Category {
  final String key;
  final String label;
  final String desc;
  final IconData icon;
  final Color color;
  final Color bg;
  const _Category(this.key, this.label, this.desc, this.icon, this.color, this.bg);
}

const _categories = [
  _Category('ride_updates', 'Ride Updates',         'Booking confirmed, driver arrived, trip complete', Icons.directions_car_outlined,    AppColors.primary,         AppColors.lightGreen),
  _Category('payments',     'Payments',              'Top-ups, ride charges, wallet activity',           Icons.credit_card_outlined,        Color(0xFF2563EB),          Color(0xFFEFF6FF)),
  _Category('promotions',   'Promotions',            'Offers, referral rewards, seasonal deals',         Icons.local_offer_outlined,        Color(0xFFD97706),          Color(0xFFFFFBEB)),
  _Category('community',    'Community',             'Group messages, new members, shared rides',        Icons.people_outline_rounded,      Color(0xFF7C3AED),          Color(0xFFF5F3FF)),
  _Category('safety',       'Safety Alerts',         'SOS alerts and emergency notifications',           Icons.shield_outlined,             Color(0xFFDC2626),          Color(0xFFFEF2F2)),
];

class NotificationsScreen extends ConsumerStatefulWidget {
  const NotificationsScreen({super.key});

  @override
  ConsumerState<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends ConsumerState<NotificationsScreen> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() => ref.read(profileProvider.notifier).loadNotifPrefs());
  }

  bool _prefValue(NotificationPrefs? prefs, String key) {
    if (prefs == null) return false;
    return switch (key) {
      'ride_updates' => prefs.rideUpdates,
      'payments'     => prefs.payments,
      'promotions'   => prefs.promotions,
      'community'    => prefs.community,
      'safety'       => prefs.safety,
      _              => false,
    };
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(profileProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 18),
          onPressed: () => context.pop(),
        ),
        title: const Text('Notifications',
            style: TextStyle(fontWeight: FontWeight.w700, fontSize: 17, color: AppColors.dark)),
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(16, 12, 16, 40),
        children: [
          const Text(
            "Choose which notifications you'd like to receive.",
            style: TextStyle(fontSize: 13, color: AppColors.gray),
          ),
          const SizedBox(height: 14),
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.border),
            ),
            child: Column(
              children: _categories.asMap().entries.map((e) {
                final isLast = e.key == _categories.length - 1;
                final cat = e.value;
                final val = _prefValue(state.notifPrefs, cat.key);
                return Column(
                  children: [
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
                      child: Row(
                        children: [
                          Container(
                            width: 40, height: 40,
                            decoration: BoxDecoration(color: cat.bg, borderRadius: BorderRadius.circular(10)),
                            child: Icon(cat.icon, size: 18, color: cat.color),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(cat.label,
                                    style: const TextStyle(
                                        fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.dark)),
                                const SizedBox(height: 2),
                                Text(cat.desc,
                                    style: const TextStyle(fontSize: 11, color: AppColors.gray),
                                    maxLines: 2),
                              ],
                            ),
                          ),
                          const SizedBox(width: 10),
                          Switch.adaptive(
                            value: val,
                            activeThumbColor: AppColors.primary,
                            activeTrackColor: AppColors.lightGreen,
                            onChanged: state.isLoading
                                ? null
                                : (_) => ref.read(profileProvider.notifier).togglePref(cat.key, !val),
                          ),
                        ],
                      ),
                    ),
                    if (!isLast) const Divider(height: 1, indent: 66),
                  ],
                );
              }).toList(),
            ),
          ),
          const SizedBox(height: 16),
          const Center(
            child: Text(
              'Safety alerts cannot be disabled for your protection.',
              style: TextStyle(fontSize: 11, color: AppColors.gray),
              textAlign: TextAlign.center,
            ),
          ),
        ],
      ),
    );
  }
}
