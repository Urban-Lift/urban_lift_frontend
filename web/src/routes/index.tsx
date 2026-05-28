import { createBrowserRouter } from 'react-router-dom'

// Placeholder — screens will be added per phase
const Placeholder = ({ name }: { name: string }) => (
  <div className="flex items-center justify-center min-h-screen text-gray-400 text-sm">
    {name} — coming soon
  </div>
)

export const router = createBrowserRouter([
  // ── Auth ────────────────────────────────────────────────────────────────────
  { path: '/',                          element: <Placeholder name="Startup" /> },
  { path: '/auth/login',                element: <Placeholder name="Login" /> },
  { path: '/auth/otp/phone',            element: <Placeholder name="Phone OTP" /> },
  { path: '/auth/otp/email',            element: <Placeholder name="Email OTP" /> },
  { path: '/auth/setup/passenger',      element: <Placeholder name="Passenger Setup" /> },
  { path: '/auth/setup/driver',         element: <Placeholder name="Driver Setup" /> },
  { path: '/auth/setup/driver/vehicle', element: <Placeholder name="Vehicle Details" /> },

  // ── Passenger ───────────────────────────────────────────────────────────────
  { path: '/passenger/home',            element: <Placeholder name="Find a Ride" /> },
  { path: '/passenger/rides',           element: <Placeholder name="Available Rides" /> },
  { path: '/passenger/rides/:id',       element: <Placeholder name="Ride Details" /> },
  { path: '/passenger/booking/:id',     element: <Placeholder name="Booking Confirmed" /> },
  { path: '/passenger/my-rides',        element: <Placeholder name="My Rides" /> },
  { path: '/passenger/tracking/:id',    element: <Placeholder name="Live Tracking" /> },
  { path: '/passenger/rate/:tripId',    element: <Placeholder name="Rate Trip" /> },

  // ── Driver ──────────────────────────────────────────────────────────────────
  { path: '/driver/dashboard',          element: <Placeholder name="Driver Dashboard" /> },
  { path: '/driver/passengers',         element: <Placeholder name="Matching Passengers" /> },
  { path: '/driver/navigate/:rideId',   element: <Placeholder name="Navigating to Pickup" /> },
  { path: '/driver/trip/:tripId',       element: <Placeholder name="In-Trip Navigation" /> },

  // ── Wallet ──────────────────────────────────────────────────────────────────
  { path: '/wallet',                    element: <Placeholder name="My Wallet" /> },
  { path: '/wallet/topup',              element: <Placeholder name="Top Up Amount" /> },
  { path: '/wallet/topup/provider',     element: <Placeholder name="Top Up Provider" /> },
  { path: '/wallet/topup/success',      element: <Placeholder name="Top Up Success" /> },

  // ── Profile ─────────────────────────────────────────────────────────────────
  { path: '/profile',                   element: <Placeholder name="Profile & Settings" /> },
  { path: '/profile/edit',              element: <Placeholder name="Edit Profile" /> },
  { path: '/profile/saved-routes',      element: <Placeholder name="Saved Routes" /> },
  { path: '/profile/notifications',     element: <Placeholder name="Notification Settings" /> },
  { path: '/profile/refer',             element: <Placeholder name="Refer a Friend" /> },

  // ── Community ───────────────────────────────────────────────────────────────
  { path: '/community',                 element: <Placeholder name="Community Groups" /> },
  { path: '/community/create',          element: <Placeholder name="Create Group" /> },
  { path: '/community/:groupId/chat',   element: <Placeholder name="Group Chat" /> },

  // ── 404 ─────────────────────────────────────────────────────────────────────
  { path: '*',                          element: <Placeholder name="404 Not Found" /> },
])
