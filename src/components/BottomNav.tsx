import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

type BottomNavProps = {
  activeScreen?: 'Home' | 'Documents' | 'AI' | 'Reminders' | 'Profile' | string;
};

type NavItemConfig = {
  screen: string;
  label: string;
  iconOutline: keyof typeof Ionicons.glyphMap;
  iconFilled: keyof typeof Ionicons.glyphMap;
  center?: boolean;
};

const NAV_ITEMS: NavItemConfig[] = [
  { screen: 'Home', label: 'Bosh sahifa', iconOutline: 'home-outline', iconFilled: 'home' },
  { screen: 'Documents', label: 'Hujjatlar', iconOutline: 'folder-outline', iconFilled: 'folder' },
  { screen: 'AI', label: 'AI Yordamchi', iconOutline: 'sparkles-outline', iconFilled: 'sparkles', center: true },
  { screen: 'Reminders', label: 'Eslatmalar', iconOutline: 'notifications-outline', iconFilled: 'notifications' },
  { screen: 'Profile', label: 'Profil', iconOutline: 'person-outline', iconFilled: 'person' },
];

export default function BottomNav({ activeScreen }: BottomNavProps) {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.bottomNav}>
      {NAV_ITEMS.map((item) => {
        const isActive = activeScreen === item.screen;
        if (item.center) {
          return (
            <TouchableOpacity
              key={item.screen}
              style={[styles.navItem, styles.navItemCenter]}
              onPress={() => navigation.navigate(item.screen)}
              activeOpacity={0.8}
            >
              <View style={styles.navCenterBtn}>
                <Ionicons name="sparkles" size={24} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={item.screen}
            style={styles.navItem}
            onPress={() => navigation.navigate(item.screen)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isActive ? item.iconFilled : item.iconOutline}
              size={22}
              color={isActive ? '#2563EB' : '#64748B'}
            />
            <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingBottom: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navItemCenter: { position: 'relative', top: -20 },
  navCenterBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#2563EB',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  navLabel: { fontSize: 10, color: '#64748B', marginTop: 3, fontWeight: '500' },
  navLabelActive: { color: '#2563EB', fontWeight: '700' },
});

