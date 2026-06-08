import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { queryClient } from '@/lib/queryClient';
import { colors } from '@/theme';

/**
 * Root layout — wraps the whole app in the providers every screen relies on:
 *  • GestureHandlerRootView  (gestures / reanimated)
 *  • SafeAreaProvider        (notch-safe insets)
 *  • QueryClientProvider     (server state via React Query)
 * and declares the top-level Stack. Auth gating lives in the route groups
 * (app/(app)/_layout.tsx redirects unauthenticated users to (auth)).
 */
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.background },
              animation: 'slide_from_right',
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(app)" />
          </Stack>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
