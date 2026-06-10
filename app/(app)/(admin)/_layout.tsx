import { StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Car, LayoutDashboard, ShieldCheck, Users } from 'lucide-react-native';
import { TabBarIcon } from '@/components';
import { colors, fonts } from '@/theme';

/** Admin bottom navigation — Overview · Drivers · Users · Account. */
export default function AdminLayout() {
  const insets = useSafeAreaInsets();
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
      <Tabs.Screen name="overview" options={{ title: 'Overview', tabBarIcon: (p) => <TabBarIcon {...p} Icon={LayoutDashboard} /> }} />
      <Tabs.Screen name="registrations" options={{ title: 'Drivers', tabBarIcon: (p) => <TabBarIcon {...p} Icon={Car} /> }} />
      <Tabs.Screen name="users" options={{ title: 'Users', tabBarIcon: (p) => <TabBarIcon {...p} Icon={Users} /> }} />
      <Tabs.Screen name="account" options={{ title: 'Account', tabBarIcon: (p) => <TabBarIcon {...p} Icon={ShieldCheck} /> }} />
    </Tabs>
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
});
