import { Redirect, Stack } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { Spinner } from '@/components';

/**
 * Auth guard for the whole authenticated area. If the persisted store hasn't
 * hydrated yet we show a spinner; once hydrated, unauthenticated users are
 * redirected back to the login flow. Everything below assumes a logged-in user.
 */
export default function AppLayout() {
  const hydrated = useAuthStore((s) => s.hydrated);
  const user = useAuthStore((s) => s.user);

  if (!hydrated) return <Spinner />;
  if (!user) return <Redirect href="/login" />;

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="tracking/[id]" options={{ animation: 'fade' }} />
      <Stack.Screen name="booking/[id]" options={{ animation: 'slide_from_bottom' }} />
    </Stack>
  );
}
