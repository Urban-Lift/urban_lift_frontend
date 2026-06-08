import { Tabs } from 'expo-router';
import { Car, Home, MessagesSquare, User, Wallet } from 'lucide-react-native';
import { colors, fontSize, fontWeight } from '@/theme';

/** Passenger bottom navigation. Drivers use the /driver stack instead. */
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.borderLight,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontSize: fontSize.xs, fontWeight: fontWeight.medium },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{ title: 'Home', tabBarIcon: ({ color, size }) => <Home color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="my-rides"
        options={{ title: 'My Rides', tabBarIcon: ({ color, size }) => <Car color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="wallet"
        options={{ title: 'Wallet', tabBarIcon: ({ color, size }) => <Wallet color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="community"
        options={{ title: 'Community', tabBarIcon: ({ color, size }) => <MessagesSquare color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile', tabBarIcon: ({ color, size }) => <User color={color} size={size} /> }}
      />
    </Tabs>
  );
}
