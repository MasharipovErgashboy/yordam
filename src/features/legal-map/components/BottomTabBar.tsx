import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../theme/colors';
import { HomeTabIcon, MapTabIcon, TicketTabIcon } from '../../../components/common/Icons';

export type LegalTabType = 'home' | 'map' | 'ticket';

interface BottomTabBarProps {
  currentTab: LegalTabType;
  onSelectTab: (tab: LegalTabType) => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({ currentTab, onSelectTab }) => {
  const insets = useSafeAreaInsets();
  const safeBottom = Math.max(insets.bottom, 8);

  return (
    <View style={[styles.container, { paddingBottom: safeBottom, height: 58 + safeBottom }]}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onSelectTab('home')}
        style={styles.tabItem}
      >
        <HomeTabIcon active={currentTab === 'home'} />
        <Text style={[styles.tabLabel, currentTab === 'home' && styles.activeTabLabel]}>
          Asosiy
        </Text>
        {currentTab === 'home' && <View style={styles.activeDot} />}
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onSelectTab('map')}
        style={styles.tabItem}
      >
        <MapTabIcon active={currentTab === 'map'} />
        <Text style={[styles.tabLabel, currentTab === 'map' && styles.activeTabLabel]}>
          Xarita
        </Text>
        {currentTab === 'map' && <View style={styles.activeDot} />}
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onSelectTab('ticket')}
        style={styles.tabItem}
      >
        <TicketTabIcon active={currentTab === 'ticket'} />
        <Text style={[styles.tabLabel, currentTab === 'ticket' && styles.activeTabLabel]}>
          E-navbat
        </Text>
        {currentTab === 'ticket' && <View style={styles.activeDot} />}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 64,
    backgroundColor: Colors.surface,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingBottom: 6,
    paddingTop: 6,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tabLabel: {
    fontSize: 11,
    color: Colors.secondaryText,
    marginTop: 4,
    fontWeight: '500',
  },
  activeTabLabel: {
    color: Colors.primary,
    fontWeight: '700',
  },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Colors.accent,
    marginTop: 2,
  },
});
