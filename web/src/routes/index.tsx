import { createBrowserRouter } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import SharedLayout from '@/components/layout/SharedLayout'

// Auth screens
import StartupScreen        from '@/features/auth/screens/StartupScreen'
import LoginScreen          from '@/features/auth/screens/LoginScreen'
import PhoneOTPScreen       from '@/features/auth/screens/PhoneOTPScreen'
import EmailOTPScreen       from '@/features/auth/screens/EmailOTPScreen'
import PassengerSetupScreen from '@/features/auth/screens/PassengerSetupScreen'
import DriverSetupScreen    from '@/features/auth/screens/DriverSetupScreen'
import DriverVehicleScreen  from '@/features/auth/screens/DriverVehicleScreen'

// Passenger
import PassengerLayout              from '@/features/passenger/PassengerLayout'
import PassengerHomeScreen      from '@/features/passenger/screens/PassengerHomeScreen'
import AvailableRidesScreen     from '@/features/passenger/screens/AvailableRidesScreen'
import RideDetailScreen         from '@/features/passenger/screens/RideDetailScreen'
import BookingConfirmedScreen   from '@/features/passenger/screens/BookingConfirmedScreen'
import MyRidesScreen            from '@/features/passenger/screens/MyRidesScreen'
import LiveTrackingScreen       from '@/features/passenger/screens/LiveTrackingScreen'
import RateTripScreen           from '@/features/passenger/screens/RateTripScreen'

// Driver
import DriverLayout                from '@/features/driver/DriverLayout'
import DriverDashboardScreen       from '@/features/driver/screens/DriverDashboardScreen'
import MatchingPassengersScreen    from '@/features/driver/screens/MatchingPassengersScreen'
import NavigatingToPickupScreen    from '@/features/driver/screens/NavigatingToPickupScreen'
import InTripNavigationScreen      from '@/features/driver/screens/InTripNavigationScreen'

// Community screens
import CommunityScreen    from '@/features/community/screens/CommunityScreen'
import CreateGroupScreen  from '@/features/community/screens/CreateGroupScreen'
import GroupChatScreen    from '@/features/community/screens/GroupChatScreen'

// Profile screens
import ProfileScreen        from '@/features/profile/screens/ProfileScreen'
import EditProfileScreen    from '@/features/profile/screens/EditProfileScreen'
import SavedRoutesScreen    from '@/features/profile/screens/SavedRoutesScreen'
import NotificationsScreen  from '@/features/profile/screens/NotificationsScreen'
import ReferScreen          from '@/features/profile/screens/ReferScreen'

// Wallet screens
import MyWalletScreen       from '@/features/wallet/screens/MyWalletScreen'
import TopUpAmountScreen    from '@/features/wallet/screens/TopUpAmountScreen'
import TopUpProviderScreen  from '@/features/wallet/screens/TopUpProviderScreen'
import TopUpSuccessScreen   from '@/features/wallet/screens/TopUpSuccessScreen'

// Placeholder — replaced per phase
const Placeholder = ({ name }: { name: string }) => (
  <div className="flex items-center justify-center min-h-screen text-gray-400 text-sm">
    {name} — coming soon
  </div>
)

export const router = createBrowserRouter([
  // ── Public Auth ─────────────────────────────────────────────────────────────
  { path: '/',                          element: <StartupScreen /> },
  { path: '/auth/login',                element: <LoginScreen /> },
  { path: '/auth/otp/phone',            element: <PhoneOTPScreen /> },
  { path: '/auth/otp/email',            element: <EmailOTPScreen /> },
  { path: '/auth/setup/passenger',      element: <PassengerSetupScreen /> },
  { path: '/auth/setup/driver',         element: <DriverSetupScreen /> },
  { path: '/auth/setup/driver/vehicle', element: <DriverVehicleScreen /> },

  // ── Protected Routes ─────────────────────────────────────────────────────────
  {
    element: <PrivateRoute />,
    children: [
      // ── Passenger (with bottom nav) ─────────────────────────────────────────
      {
        element: <PassengerLayout />,
        children: [
          { path: '/passenger/home',     element: <PassengerHomeScreen /> },
          { path: '/passenger/rides',    element: <AvailableRidesScreen /> },
          { path: '/passenger/my-rides', element: <MyRidesScreen /> },
        ],
      },

      // Passenger (no bottom nav — full-screen)
      { path: '/passenger/rides/:id',    element: <RideDetailScreen /> },
      { path: '/passenger/booking/:id',  element: <BookingConfirmedScreen /> },
      { path: '/passenger/tracking/:id', element: <LiveTrackingScreen /> },
      { path: '/passenger/rate/:tripId', element: <RateTripScreen /> },

      // ── Driver (with bottom nav) ─────────────────────────────────────────────
      {
        element: <DriverLayout />,
        children: [
          { path: '/driver/dashboard',  element: <DriverDashboardScreen /> },
          { path: '/driver/passengers', element: <MatchingPassengersScreen /> },
        ],
      },

      // Driver (full-screen — no bottom nav)
      { path: '/driver/navigate/:rideId', element: <NavigatingToPickupScreen /> },
      { path: '/driver/trip/:tripId',     element: <InTripNavigationScreen /> },

      // ── Wallet (with shared nav) ────────────────────────────────────────────
      {
        element: <SharedLayout />,
        children: [
          { path: '/wallet',                element: <MyWalletScreen /> },
          { path: '/wallet/topup',          element: <TopUpAmountScreen /> },
          { path: '/wallet/topup/provider', element: <TopUpProviderScreen /> },
          { path: '/wallet/topup/success',  element: <TopUpSuccessScreen /> },

          // ── Profile ───────────────────────────────────────────────────────
          { path: '/profile',               element: <ProfileScreen /> },
          { path: '/profile/edit',          element: <EditProfileScreen /> },
          { path: '/profile/saved-routes',  element: <SavedRoutesScreen /> },
          { path: '/profile/notifications', element: <NotificationsScreen /> },
          { path: '/profile/refer',         element: <ReferScreen /> },

          // ── Community ─────────────────────────────────────────────────────
          { path: '/community',              element: <CommunityScreen /> },
          { path: '/community/create',       element: <CreateGroupScreen /> },
          { path: '/community/:groupId/chat',element: <GroupChatScreen /> },
        ],
      },
    ],
  },

  { path: '*', element: <Placeholder name="404 Not Found" /> },
])
