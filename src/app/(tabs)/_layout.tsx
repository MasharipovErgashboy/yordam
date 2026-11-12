import { Tabs } from 'expo-router'
import { FileText, House, MessageCircle, Scale, UserRound } from 'lucide-react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { colors, fonts } from '@/constants/tokens'

export default function TabLayout() {
  const insets = useSafeAreaInsets()

  return <Tabs screenOptions={{
    headerShown: false,
    tabBarActiveTintColor: colors.primary,
    tabBarInactiveTintColor: '#8795A4',
    tabBarStyle: {
      height: 60 + insets.bottom,
      paddingTop: 6,
      paddingBottom: Math.max(8, insets.bottom),
      backgroundColor: '#FFFFFF',
      borderTopColor: '#E7EDF4'
    },
    tabBarLabelStyle: { fontFamily: fonts.medium, fontSize: 8 },
    sceneStyle: { backgroundColor: colors.canvas }
  }}>
    <Tabs.Screen name="index" options={{ title: 'Bosh sahifa', tabBarIcon: ({ color, size }) => <House size={size} color={color} /> }} />
    <Tabs.Screen name="lawyers" options={{ title: 'Yuristlar', tabBarIcon: ({ color, size }) => <Scale size={size} color={color} /> }} />
    <Tabs.Screen name="requests" options={{ title: 'Murojaatlar', tabBarIcon: ({ color, size }) => <FileText size={size} color={color} /> }} />
    <Tabs.Screen name="messages" options={{ title: 'Xabarlar', tabBarIcon: ({ color, size }) => <MessageCircle size={size} color={color} /> }} />
    <Tabs.Screen name="profile" options={{ title: 'Profil', tabBarIcon: ({ color, size }) => <UserRound size={size} color={color} /> }} />
  </Tabs>
}
