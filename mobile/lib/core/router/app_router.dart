import 'package:go_router/go_router.dart';
import '../../features/auth/presentation/screens/splash_screen.dart';
import '../../features/auth/presentation/screens/login_screen.dart';
import '../../features/auth/presentation/screens/phone_otp_screen.dart';
import '../../features/auth/presentation/screens/email_otp_screen.dart';
import '../../features/auth/presentation/screens/passenger_setup_screen.dart';
import '../../features/auth/presentation/screens/driver_setup_screen.dart';
import '../../features/auth/presentation/screens/driver_vehicle_screen.dart';
import '../../features/passenger/presentation/screens/passenger_home_screen.dart';
import '../../features/passenger/presentation/screens/available_rides_screen.dart';
import '../../features/passenger/presentation/screens/ride_detail_screen.dart';
import '../../features/passenger/presentation/screens/booking_confirmed_screen.dart';
import '../../features/passenger/presentation/screens/my_rides_screen.dart';
import '../../features/passenger/presentation/screens/live_tracking_screen.dart';
import '../../features/passenger/presentation/screens/rate_trip_screen.dart';
import '../../features/driver/presentation/screens/driver_dashboard_screen.dart';
import '../../features/driver/presentation/screens/matching_passengers_screen.dart';
import '../../features/driver/presentation/screens/navigating_to_pickup_screen.dart';
import '../../features/driver/presentation/screens/in_trip_navigation_screen.dart';
import '../../features/wallet/presentation/screens/my_wallet_screen.dart';
import '../../features/wallet/presentation/screens/top_up_amount_screen.dart';
import '../../features/wallet/presentation/screens/top_up_provider_screen.dart';
import '../../features/wallet/presentation/screens/top_up_success_screen.dart';
import '../../features/profile/presentation/screens/profile_screen.dart';
import '../../features/profile/presentation/screens/edit_profile_screen.dart';
import '../../features/profile/presentation/screens/saved_routes_screen.dart';
import '../../features/profile/presentation/screens/notifications_screen.dart';
import '../../features/profile/presentation/screens/refer_screen.dart';
import '../../features/community/presentation/screens/community_screen.dart';
import '../../features/community/presentation/screens/create_group_screen.dart';
import '../../features/community/presentation/screens/group_chat_screen.dart';
import '../../features/auth/presentation/screens/startup_screen.dart';


final appRouter = GoRouter(
  initialLocation: '/splash',
  routes: [
    // ── Auth ─────────────────────────────────────────────────────────────────
    GoRoute(
      path: '/splash',
      builder: (context, state) => const SplashScreen(),
    ),
    GoRoute(
      path: '/startup',
      builder: (context, state) => const StartupScreen(),
    ),
    GoRoute(
      path: '/auth/login',
      builder: (context, state) => const LoginScreen(),
    ),
    GoRoute(
      path: '/auth/otp-phone',
      builder: (context, state) => const PhoneOTPScreen(),
    ),
    GoRoute(
      path: '/auth/otp-email',
      builder: (context, state) => const EmailOTPScreen(),
    ),
    GoRoute(
      path: '/auth/setup-passenger',
      builder: (context, state) => const PassengerSetupScreen(),
    ),
    GoRoute(
      path: '/auth/setup-driver',
      builder: (context, state) => const DriverSetupScreen(),
    ),
    GoRoute(
      path: '/auth/setup-driver/vehicle',
      builder: (context, state) => DriverVehicleScreen(
        driverData: state.extra as Map<String, dynamic>?,
      ),
    ),

    // ── Passenger ────────────────────────────────────────────────────────────
    GoRoute(
      path: '/home',
      builder: (context, state) => const PassengerHomeScreen(),
    ),
    GoRoute(
      path: '/rides',
      builder: (context, state) => const AvailableRidesScreen(),
    ),
    GoRoute(
      path: '/rides/:id',
      builder: (context, state) => RideDetailScreen(rideId: state.pathParameters['id']!),
    ),
    GoRoute(
      path: '/booking/:id',
      builder: (context, state) => BookingConfirmedScreen(bookingId: state.pathParameters['id']!),
    ),
    GoRoute(
      path: '/my-rides',
      builder: (context, state) => const MyRidesScreen(),
    ),
    GoRoute(
      path: '/tracking/:id',
      builder: (context, state) => LiveTrackingScreen(bookingId: state.pathParameters['id']!),
    ),
    GoRoute(
      path: '/rate/:tripId',
      builder: (context, state) => RateTripScreen(tripId: state.pathParameters['tripId']!),
    ),

    // ── Driver ───────────────────────────────────────────────────────────────
    GoRoute(
      path: '/driver/home',
      builder: (context, state) => const DriverDashboardScreen(),
    ),
    GoRoute(
      path: '/driver/passengers',
      builder: (context, state) => const MatchingPassengersScreen(),
    ),
    GoRoute(
      path: '/driver/navigate/:rideId',
      builder: (context, state) => NavigatingToPickupScreen(rideId: state.pathParameters['rideId']!),
    ),
    GoRoute(
      path: '/driver/trip/:tripId',
      builder: (context, state) => InTripNavigationScreen(tripId: state.pathParameters['tripId']!),
    ),

    // ── Wallet ───────────────────────────────────────────────────────────────
    GoRoute(path: '/wallet',               builder: (context, state) => const MyWalletScreen()),
    GoRoute(path: '/wallet/topup',         builder: (context, state) => const TopUpAmountScreen()),
    GoRoute(path: '/wallet/topup/provider',builder: (context, state) => const TopUpProviderScreen()),
    GoRoute(path: '/wallet/topup/success', builder: (context, state) => const TopUpSuccessScreen()),

    // ── Profile ──────────────────────────────────────────────────────────────
    GoRoute(path: '/profile',               builder: (context, state) => const ProfileScreen()),
    GoRoute(path: '/profile/edit',          builder: (context, state) => const EditProfileScreen()),
    GoRoute(path: '/profile/routes',        builder: (context, state) => const SavedRoutesScreen()),
    GoRoute(path: '/profile/notifications', builder: (context, state) => const NotificationsScreen()),
    GoRoute(path: '/profile/refer',         builder: (context, state) => const ReferScreen()),

    // ── Community ────────────────────────────────────────────────────────────
    GoRoute(path: '/community',          builder: (context, state) => const CommunityScreen()),
    GoRoute(path: '/community/create',   builder: (context, state) => const CreateGroupScreen()),
    GoRoute(path: '/community/:id/chat', builder: (context, state) => GroupChatScreen(groupId: state.pathParameters['id']!)),
  ],
);
