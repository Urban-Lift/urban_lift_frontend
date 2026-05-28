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
    GoRoute(path: '/splash',                      builder: (context, state) => const _Placeholder('Splash')),
    GoRoute(path: '/auth/login',                  builder: (context, state) => const _Placeholder('Login')),
    GoRoute(path: '/auth/otp-phone',              builder: (context, state) => const _Placeholder('Phone OTP')),
    GoRoute(path: '/auth/otp-email',              builder: (context, state) => const _Placeholder('Email OTP')),
    GoRoute(path: '/auth/setup-passenger',        builder: (context, state) => const _Placeholder('Passenger Setup')),
    GoRoute(path: '/auth/setup-driver',           builder: (context, state) => const _Placeholder('Driver Setup')),
    GoRoute(path: '/auth/setup-driver/vehicle',   builder: (context, state) => const _Placeholder('Vehicle Details')),

    // ── Passenger ────────────────────────────────────────────────────────────
    GoRoute(path: '/home',                        builder: (context, state) => const _Placeholder('Find a Ride')),
    GoRoute(path: '/rides',                       builder: (context, state) => const _Placeholder('Available Rides')),
    GoRoute(path: '/rides/:id',                   builder: (_, s) => _Placeholder('Ride ${s.pathParameters['id']}')),
    GoRoute(path: '/booking/:id',                 builder: (_, s) => _Placeholder('Booking ${s.pathParameters['id']}')),
    GoRoute(path: '/my-rides',                    builder: (context, state) => const _Placeholder('My Rides')),
    GoRoute(path: '/tracking/:id',                builder: (_, s) => _Placeholder('Tracking ${s.pathParameters['id']}')),
    GoRoute(path: '/rate/:tripId',                builder: (_, s) => _Placeholder('Rate ${s.pathParameters['tripId']}')),

    // ── Driver ───────────────────────────────────────────────────────────────
    GoRoute(path: '/driver/home',                 builder: (context, state) => const _Placeholder('Driver Dashboard')),
    GoRoute(path: '/driver/passengers',           builder: (context, state) => const _Placeholder('Matching Passengers')),
    GoRoute(path: '/driver/navigate/:rideId',     builder: (_, s) => _Placeholder('Navigate ${s.pathParameters['rideId']}')),
    GoRoute(path: '/driver/trip/:tripId',         builder: (_, s) => _Placeholder('Trip ${s.pathParameters['tripId']}')),

    // ── Wallet ───────────────────────────────────────────────────────────────
    GoRoute(path: '/wallet',                      builder: (context, state) => const _Placeholder('My Wallet')),
    GoRoute(path: '/wallet/topup',                builder: (context, state) => const _Placeholder('Top Up Amount')),
    GoRoute(path: '/wallet/topup/provider',       builder: (context, state) => const _Placeholder('Top Up Provider')),
    GoRoute(path: '/wallet/topup/success',        builder: (context, state) => const _Placeholder('Top Up Success')),

    // ── Profile ──────────────────────────────────────────────────────────────
    GoRoute(path: '/profile',                     builder: (context, state) => const _Placeholder('Profile & Settings')),
    GoRoute(path: '/profile/edit',                builder: (context, state) => const _Placeholder('Edit Profile')),
    GoRoute(path: '/profile/routes',              builder: (context, state) => const _Placeholder('Saved Routes')),
    GoRoute(path: '/profile/notifications',       builder: (context, state) => const _Placeholder('Notifications')),
    GoRoute(path: '/profile/refer',               builder: (context, state) => const _Placeholder('Refer a Friend')),

    // ── Community ────────────────────────────────────────────────────────────
    GoRoute(path: '/community',                   builder: (context, state) => const _Placeholder('Community Groups')),
    GoRoute(path: '/community/create',            builder: (context, state) => const _Placeholder('Create Group')),
    GoRoute(path: '/community/:id/chat',          builder: (_, s) => _Placeholder('Group Chat ${s.pathParameters['id']}')),
  ],
);
