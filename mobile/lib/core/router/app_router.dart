import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

// Placeholder screen — replaced per phase
class _Placeholder extends StatelessWidget {
  final String name;
  const _Placeholder(this.name);
  @override
  Widget build(BuildContext context) => Scaffold(
    body: Center(
      child: Text(
        '$name\ncoming soon',
        textAlign: TextAlign.center,
        style: const TextStyle(color: Colors.grey, fontSize: 14),
      ),
    ),
  );
}

final appRouter = GoRouter(
  initialLocation: '/splash',
  routes: [
    // ── Auth ─────────────────────────────────────────────────────────────────
    GoRoute(path: '/splash',                      builder: (_, __) => const _Placeholder('Splash')),
    GoRoute(path: '/auth/login',                  builder: (_, __) => const _Placeholder('Login')),
    GoRoute(path: '/auth/otp-phone',              builder: (_, __) => const _Placeholder('Phone OTP')),
    GoRoute(path: '/auth/otp-email',              builder: (_, __) => const _Placeholder('Email OTP')),
    GoRoute(path: '/auth/setup-passenger',        builder: (_, __) => const _Placeholder('Passenger Setup')),
    GoRoute(path: '/auth/setup-driver',           builder: (_, __) => const _Placeholder('Driver Setup')),
    GoRoute(path: '/auth/setup-driver/vehicle',   builder: (_, __) => const _Placeholder('Vehicle Details')),

    // ── Passenger ────────────────────────────────────────────────────────────
    GoRoute(path: '/home',                        builder: (_, __) => const _Placeholder('Find a Ride')),
    GoRoute(path: '/rides',                       builder: (_, __) => const _Placeholder('Available Rides')),
    GoRoute(path: '/rides/:id',                   builder: (_, s) => _Placeholder('Ride ${s.pathParameters['id']}')),
    GoRoute(path: '/booking/:id',                 builder: (_, s) => _Placeholder('Booking ${s.pathParameters['id']}')),
    GoRoute(path: '/my-rides',                    builder: (_, __) => const _Placeholder('My Rides')),
    GoRoute(path: '/tracking/:id',                builder: (_, s) => _Placeholder('Tracking ${s.pathParameters['id']}')),
    GoRoute(path: '/rate/:tripId',                builder: (_, s) => _Placeholder('Rate ${s.pathParameters['tripId']}')),

    // ── Driver ───────────────────────────────────────────────────────────────
    GoRoute(path: '/driver/home',                 builder: (_, __) => const _Placeholder('Driver Dashboard')),
    GoRoute(path: '/driver/passengers',           builder: (_, __) => const _Placeholder('Matching Passengers')),
    GoRoute(path: '/driver/navigate/:rideId',     builder: (_, s) => _Placeholder('Navigate ${s.pathParameters['rideId']}')),
    GoRoute(path: '/driver/trip/:tripId',         builder: (_, s) => _Placeholder('Trip ${s.pathParameters['tripId']}')),

    // ── Wallet ───────────────────────────────────────────────────────────────
    GoRoute(path: '/wallet',                      builder: (_, __) => const _Placeholder('My Wallet')),
    GoRoute(path: '/wallet/topup',                builder: (_, __) => const _Placeholder('Top Up Amount')),
    GoRoute(path: '/wallet/topup/provider',       builder: (_, __) => const _Placeholder('Top Up Provider')),
    GoRoute(path: '/wallet/topup/success',        builder: (_, __) => const _Placeholder('Top Up Success')),

    // ── Profile ──────────────────────────────────────────────────────────────
    GoRoute(path: '/profile',                     builder: (_, __) => const _Placeholder('Profile & Settings')),
    GoRoute(path: '/profile/edit',                builder: (_, __) => const _Placeholder('Edit Profile')),
    GoRoute(path: '/profile/routes',              builder: (_, __) => const _Placeholder('Saved Routes')),
    GoRoute(path: '/profile/notifications',       builder: (_, __) => const _Placeholder('Notifications')),
    GoRoute(path: '/profile/refer',               builder: (_, __) => const _Placeholder('Refer a Friend')),

    // ── Community ────────────────────────────────────────────────────────────
    GoRoute(path: '/community',                   builder: (_, __) => const _Placeholder('Community Groups')),
    GoRoute(path: '/community/create',            builder: (_, __) => const _Placeholder('Create Group')),
    GoRoute(path: '/community/:id/chat',          builder: (_, s) => _Placeholder('Group Chat ${s.pathParameters['id']}')),
  ],
);
