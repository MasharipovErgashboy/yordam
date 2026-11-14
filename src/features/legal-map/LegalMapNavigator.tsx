import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Alert, Linking, BackHandler } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../theme/colors';
import { LegalMapHomeScreen } from './screens/LegalMapHomeScreen';
import { LegalMapInteractiveScreen } from './screens/LegalMapInteractiveScreen';
import { LegalMapListScreen } from './screens/LegalMapListScreen';
import { LegalMapDetailScreen } from './screens/LegalMapDetailScreen';
import { LegalMapTicketScreen } from './screens/LegalMapTicketScreen';
import { BottomTabBar, LegalTabType } from './components/BottomTabBar';
import { LegalPlace, LegalCategory } from '../../types/legalMap.types';

interface LegalMapNavigatorProps {
  onBack?: () => void;
}

export const LegalMapNavigator: React.FC<LegalMapNavigatorProps> = ({ onBack }) => {
  const insets = useSafeAreaInsets();
  const [currentTab, setCurrentTab] = useState<LegalTabType>('home');
  const [selectedCategory, setSelectedCategory] = useState<LegalCategory>('all');
  const [isListView, setIsListView] = useState<boolean>(false);
  const [selectedPlace, setSelectedPlace] = useState<LegalPlace | null>(null);

  const handleHardwareBack = useCallback(() => {
    if (selectedPlace) {
      setSelectedPlace(null);
      return true;
    }
    if (currentTab !== 'home') {
      setCurrentTab('home');
      return true;
    }
    if (onBack) {
      onBack();
      return true;
    }
    return false;
  }, [selectedPlace, currentTab, onBack]);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', handleHardwareBack);
    return () => sub.remove();
  }, [handleHardwareBack]);

  // Deep linking to Phone call
  const handleCall = (phone: string) => {
    const url = `tel:${phone.replace(/\s+/g, '')}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Aloqa', `${phone} raqamiga qo‘ng‘iroq qilinmoqda...`);
    });
  };

  // Deep linking to Navigation
  const handleRoute = (place: LegalPlace) => {
    const { latitude, longitude } = place.coordinates;
    const yandexUrl = `yandexmaps://maps.yandex.ru/?pt=${longitude},${latitude}&z=16&l=map`;
    const googleUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

    Linking.canOpenURL(yandexUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(yandexUrl);
        } else {
          Linking.openURL(googleUrl);
        }
      })
      .catch(() => {
        Alert.alert(
          'Marshrut',
          `${place.name} manziliga marshrut tuzilmoqda: ${place.address}`
        );
      });
  };

  // Online Queue Ticket acquisition
  const handleGetTicket = (place: LegalPlace) => {
    Alert.alert(
      'Navbat olindi!',
      `${place.name} bo‘yicha sizga A-14 raqamli navbat biriktirildi.`,
      [
        {
          text: 'Chiptani ko‘rish',
          onPress: () => {
            setSelectedPlace(null);
            setCurrentTab('ticket');
          },
        },
      ]
    );
  };

  const handleCancelQueue = () => {
    Alert.alert(
      'Navbatni bekor qilish',
      'Haqiqatan ham o‘z navbatingizni bekor qilmoqchimisiz?',
      [
        { text: 'Yo‘q', style: 'cancel' },
        {
          text: 'Ha, bekor qilish',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Muvaffaqiyatli', 'Sizning navbatingiz bekor qilindi.');
            setCurrentTab('home');
          },
        },
      ]
    );
  };

  const renderScreen = () => {
    if (selectedPlace) {
      return (
        <LegalMapDetailScreen
          place={selectedPlace}
          onBack={() => setSelectedPlace(null)}
          onGetTicket={handleGetTicket}
          onCall={handleCall}
          onRoute={handleRoute}
        />
      );
    }

    switch (currentTab) {
      case 'home':
        return (
          <LegalMapHomeScreen
            onSelectCategory={(category) => {
              setSelectedCategory(category);
              setIsListView(false);
              setCurrentTab('map');
            }}
            onSelectPlace={(place) => setSelectedPlace(place)}
            onViewAllNearby={() => {
              setSelectedCategory('all');
              setIsListView(true);
              setCurrentTab('map');
            }}
            onClose={onBack}
          />
        );

      case 'map':
        if (isListView) {
          return (
            <LegalMapListScreen
              onSelectPlace={(place) => setSelectedPlace(place)}
              onSwitchToMap={() => setIsListView(false)}
              onClose={onBack}
            />
          );
        }
        return (
          <LegalMapInteractiveScreen
            initialCategory={selectedCategory}
            onSelectPlace={(place) => setSelectedPlace(place)}
            onSwitchToList={() => setIsListView(true)}
            onCall={handleCall}
            onRoute={handleRoute}
          />
        );

      case 'ticket':
        return (
          <LegalMapTicketScreen
            onBack={() => setCurrentTab('home')}
            onCancelQueue={handleCancelQueue}
          />
        );

      default:
        return null;
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <View style={styles.screenWrapper}>{renderScreen()}</View>
      {!selectedPlace && (
        <BottomTabBar
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  screenWrapper: {
    flex: 1,
    backgroundColor: Colors.canvas,
  },
});
