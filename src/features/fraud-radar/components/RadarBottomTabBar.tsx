import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../../theme/colors';
import { HomeTabIcon } from '../../../components/common/Icons';
import { RadarTabIcon, ResultsTabIcon } from './RadarIcons';

export type RadarTabType = 'home' | 'radar' | 'history';

interface RadarBottomTabBarProps {
  currentTab: RadarTabType;
  onSelectTab: (tab: RadarTabType) => void;
}

export const RadarBottomTabBar: React.FC<RadarBottomTabBarProps> = ({
  currentTab,
  onSelectTab,
}) => {
  return (
    <View style={styles.container}>
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
        onPress={() => onSelectTab('radar')}
        style={styles.tabItem}
      >
        <RadarTabIcon active={currentTab === 'radar'} />
        <Text style={[styles.tabLabel, currentTab === 'radar' && styles.activeTabLabel]}>
          Radar
        </Text>
        {currentTab === 'radar' && <View style={styles.activeDot} />}
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onSelectTab('history')}
        style={styles.tabItem}
      >
        <ResultsTabIcon active={currentTab === 'history'} />
        <Text style={[styles.tabLabel, currentTab === 'history' && styles.activeTabLabel]}>
          Natijalar
        </Text>
        {currentTab === 'history' && <View style={styles.activeDot} />}
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
