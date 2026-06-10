import { Redirect, Stack, useSegments } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { Spinner } from '@/components';
import { homeRouteFor } from '@/utils/routes';

// Route areas that belong to a single role. Shared areas (wallet, profile,
// messages, community) are intentionally left out.
const PASSENGER_ONLY = ['rides', 'booking', 'tracking', 'rate'];
const DRIVER_ONLY = ['driver'];
const PASSENGER_TABS = ['home', 'my-rides'];
const DRIVER_TABS = ['driver-home', 'driver-requests'];

/**
 * Auth + role guard for the authenticated area.
 *  • Not hydrated → spinner. Not logged in → login.
 *  • Admins are confined to /admin; passengers and drivers can't open each
 *    other's screens (redirected to their own home).
 */
export default function AppLayout() {
  const hydrated = useAuthStore((s) => s.hydrated);
  const user = useAuthStore((s) => s.user);
  const segments = useSegments() as string[];

  if (!hydrated) return <Spinner />;
  if (!user) return <Redirect href="/login" />;

  const role = user.role;
  const seg1 = segments[1] ?? ''; // area after "(app)", e.g. "(tabs)" | "rides" | "driver" | "admin"
  const seg2 = segments[2] ?? ''; // tab/screen name when inside "(tabs)"
  const home = homeRouteFor(role);

  // Admins live only in the (admin) area; everyone else is kept out of it.
  if (role === 'admin' && seg1 !== '(admin)') return <Redirect href={home} />;
  if (role !== 'admin' && seg1 === '(admin)') return <Redirect href={home} />;

  // Cross-role stack areas.
  if (role === 'driver' && PASSENGER_ONLY.includes(seg1)) return <Redirect href={home} />;
  if (role === 'passenger' && DRIVER_ONLY.includes(seg1)) return <Redirect href={home} />;

  // Cross-role tabs reached by deep link.
  if (seg1 === '(tabs)') {
    if (role === 'driver' && PASSENGER_TABS.includes(seg2)) return <Redirect href={home} />;
    if (role === 'passenger' && DRIVER_TABS.includes(seg2)) return <Redirect href={home} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="tracking/[id]" options={{ animation: 'fade' }} />
      <Stack.Screen name="booking/[id]" options={{ animation: 'slide_from_bottom' }} />
    </Stack>
  );
}
