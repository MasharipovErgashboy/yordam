import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet, Pressable, Text, BackHandler } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FileText, House, MessageCircle, Scale, UserRound } from 'lucide-react-native';

import { AppStoreProvider } from './hooks/use-app-store';
import { YuristRouterProvider, useYuristRouter, YuristTab } from './navigation/router';
import { colors, fonts } from './constants/tokens';

import HomeScreen from './screens/HomeScreen';
import LawyersScreen from './screens/LawyersScreen';
import RequestsScreen from './screens/RequestsScreen';
import MessagesScreen from './screens/MessagesScreen';
import AccountScreen from './screens/AccountScreen';
import LawyerProfileScreen from './screens/LawyerProfileScreen';
import ConsultationScreen from './screens/ConsultationScreen';
import DocumentSubmissionScreen from './screens/DocumentSubmissionScreen';
import LawyerApplicationScreen from './screens/LawyerApplicationScreen';
import ReviewScreen from './screens/ReviewScreen';

interface YuristOnlineNavigatorProps {
  onBack?: () => void;
}

const YuristOnlineContent: React.FC<YuristOnlineNavigatorProps> = ({ onBack }) => {
  const insets = useSafeAreaInsets();
  const { currentRoute, activeTab, setActiveTab, canGoBack, back } = useYuristRouter();

  // Android hardware back handler
  const handleHardwareBack = useCallback(() => {
    if (canGoBack) {
      back();
      return true;
    }
    if (onBack) {
      onBack();
      return true;
    }
    return false;
  }, [canGoBack, back, onBack]);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', handleHardwareBack);
    return () => sub.remove();
  }, [handleHardwareBack]);

  // Determine which screen to render
  const renderScreen = () => {
    const path = currentRoute.pathname;

    if (path.startsWith('/lawyer/') || path === '/lawyer/[id]') {
      return <LawyerProfileScreen />;
    }
    if (path.startsWith('/consultation/') || path === '/consultation/[id]') {
      return <ConsultationScreen />;
    }
    if (path === '/document') {
      return <DocumentSubmissionScreen />;
    }
    if (path === '/application') {
      return <LawyerApplicationScreen />;
    }
    if (path === '/review') {
      return <ReviewScreen />;
    }

    // Tab screens
    switch (activeTab) {
      case 'lawyers':
        return <LawyersScreen />;
      case 'requests':
        return <RequestsScreen />;
      case 'messages':
        return <MessagesScreen />;
      case 'profile':
        return <AccountScreen />;
      case 'index':
      default:
        return <HomeScreen />;
    }
  };

  const isDetailScreen =
    currentRoute.pathname.startsWith('/lawyer/') ||
    currentRoute.pathname === '/lawyer/[id]' ||
    currentRoute.pathname.startsWith('/consultation/') ||
    currentRoute.pathname === '/consultation/[id]' ||
    currentRoute.pathname === '/document' ||
    currentRoute.pathname === '/application' ||
    currentRoute.pathname === '/review';

  return (
    <View style={styles.container}>
      <View style={styles.screenWrapper}>{renderScreen()}</View>

      {/* Bottom Tab Bar (shown when not on a full-screen modal/detail screen) */}
      {!isDetailScreen && (
        <View
          style={[
            styles.tabBar,
            {
              paddingBottom: Math.max(8, insets.bottom),
              height: 56 + Math.max(8, insets.bottom),
            },
          ]}
        >
          <Pressable
            style={styles.tabItem}
            onPress={() => setActiveTab('index')}
            accessibilityRole="tab"
          >
            <House
              size={20}
              color={activeTab === 'index' ? colors.primary : '#8795A4'}
            />
            <Text
              style={[
                styles.tabLabel,
                activeTab === 'index' ? styles.tabLabelActive : styles.tabLabelInactive,
              ]}
            >
              Bosh sahifa
            </Text>
          </Pressable>

          <Pressable
            style={styles.tabItem}
            onPress={() => setActiveTab('lawyers')}
            accessibilityRole="tab"
          >
            <Scale
              size={20}
              color={activeTab === 'lawyers' ? colors.primary : '#8795A4'}
            />
            <Text
              style={[
                styles.tabLabel,
                activeTab === 'lawyers' ? styles.tabLabelActive : styles.tabLabelInactive,
              ]}
            >
              Yuristlar
            </Text>
          </Pressable>

          <Pressable
            style={styles.tabItem}
            onPress={() => setActiveTab('requests')}
            accessibilityRole="tab"
          >
            <FileText
              size={20}
              color={activeTab === 'requests' ? colors.primary : '#8795A4'}
            />
            <Text
              style={[
                styles.tabLabel,
                activeTab === 'requests' ? styles.tabLabelActive : styles.tabLabelInactive,
              ]}
            >
              Murojaatlar
            </Text>
          </Pressable>

          <Pressable
            style={styles.tabItem}
            onPress={() => setActiveTab('messages')}
            accessibilityRole="tab"
          >
            <MessageCircle
              size={20}
              color={activeTab === 'messages' ? colors.primary : '#8795A4'}
            />
            <Text
              style={[
                styles.tabLabel,
                activeTab === 'messages' ? styles.tabLabelActive : styles.tabLabelInactive,
              ]}
            >
              Xabarlar
            </Text>
          </Pressable>

          <Pressable
            style={styles.tabItem}
            onPress={() => setActiveTab('profile')}
            accessibilityRole="tab"
          >
            <UserRound
              size={20}
              color={activeTab === 'profile' ? colors.primary : '#8795A4'}
            />
            <Text
              style={[
                styles.tabLabel,
                activeTab === 'profile' ? styles.tabLabelActive : styles.tabLabelInactive,
              ]}
            >
              Profil
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export const YuristOnlineNavigator: React.FC<YuristOnlineNavigatorProps> = ({ onBack }) => {
  return (
    <AppStoreProvider>
      <YuristRouterProvider onExit={onBack}>
        <YuristOnlineContent onBack={onBack} />
      </YuristRouterProvider>
    </AppStoreProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  screenWrapper: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E7EDF4',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 6,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  tabLabel: {
    fontSize: 9,
    fontFamily: fonts.medium,
  },
  tabLabelActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  tabLabelInactive: {
    color: '#8795A4',
  },
});
