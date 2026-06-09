import { StyleSheet, View, type ColorValue } from 'react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Car, Gauge, Home, Inbox, MessageSquare, User } from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { colors, fonts, radii } from '@/theme';

/**
 * One tab bar, two layouts. Passengers see Home · Rides · Messages · Profile;
 * drivers see Dashboard · Requests · Messages · Profile. Tabs for the other
 * role are hidden with `href: null`, and the (app) layout guards direct access.
 */
export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const role = useAuthStore((s) => s.user?.role);
  const isDriver = role === 'driver';
  const isPassenger = role === 'passenger';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.forest,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: [styles.bar, { height: 62 + insets.bottom, paddingBottom: insets.bottom + 8 }],
        tabBarLabelStyle: { fontFamily: fonts.semibold, fontSize: 11, marginTop: 2 },
        tabBarItemStyle: { paddingTop: 8 },
      }}
    >
      {/* Passenger tabs */}
      <Tabs.Screen
        name="home"
        options={{ href: isPassenger ? '/home' : null, title: 'Home', tabBarIcon: (p) => <TabIcon {...p} Icon={Home} /> }}
      />
      <Tabs.Screen
        name="my-rides"
        options={{ href: isPassenger ? '/my-rides' : null, title: 'Rides', tabBarIcon: (p) => <TabIcon {...p} Icon={Car} /> }}
      />

      {/* Driver tabs */}
      <Tabs.Screen
        name="driver-home"
        options={{ href: isDriver ? '/driver-home' : null, title: 'Dashboard', tabBarIcon: (p) => <TabIcon {...p} Icon={Gauge} /> }}
      />
      <Tabs.Screen
        name="driver-requests"
        options={{ href: isDriver ? '/driver-requests' : null, title: 'Requests', tabBarIcon: (p) => <TabIcon {...p} Icon={Inbox} /> }}
      />

      {/* Shared tabs */}
      <Tabs.Screen
        name="messages"
        options={{ title: 'Messages', tabBarIcon: (p) => <TabIcon {...p} Icon={MessageSquare} dot /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile', tabBarIcon: (p) => <TabIcon {...p} Icon={User} /> }}
      />
    </Tabs>
  );
}

function TabIcon({
  Icon,
  color,
  focused,
  dot,
}: {
  Icon: typeof Home;
  color: ColorValue;
  focused: boolean;
  dot?: boolean;
}) {
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <Icon size={22} color={color as string} strokeWidth={focused ? 2.4 : 2} />
      {dot ? <View style={styles.dot} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.borderLight,
    borderTopWidth: 1,
    paddingTop: 6,
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 12,
  },
  iconWrap: {
    width: 56,
    height: 30,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: { backgroundColor: colors.lightGreen },
  dot: {
    position: 'absolute',
    top: 2,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
    borderWidth: 1.5,
    borderColor: colors.surface,
  },
});
