import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, BackHandler } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SplashScreen } from './src/screens/SplashScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { MainHomeScreen } from './src/screens/MainHomeScreen';
import { BankHuquqScreen } from './src/screens/BankHuquqScreen';
import { MurojaatScreen } from './src/screens/MurojaatScreen';

type AppScreen = 'splash' | 'onboarding' | 'main' | 'bank_huquq' | 'murojaat';

export default function App() {
  const [screenStack, setScreenStack] = useState<AppScreen[]>(['splash']);
  const currentScreen = screenStack[screenStack.length - 1] || 'splash';

  const navigateTo = useCallback((screen: AppScreen) => {
    setScreenStack((prev) => {
      if (screen === 'main') {
        return ['main'];
      }
      return [...prev, screen];
    });
  }, []);

  const goBack = useCallback(() => {
    setScreenStack((prev) => {
      if (prev.length > 1) {
        return prev.slice(0, -1);
      }
      return prev;
    });
  }, []);

  // Global Android/Telefon Hardware Back Button Handler
  useEffect(() => {
    const handleHardwareBack = () => {
      if (screenStack.length > 1) {
        goBack();
        return true;
      }
      return false;
    };

    const sub = BackHandler.addEventListener('hardwareBackPress', handleHardwareBack);
    return () => sub.remove();
  }, [screenStack, goBack]);

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {currentScreen === 'splash' && (
          <SplashScreen
            onFinish={() => navigateTo('onboarding')}
          />
        )}

        {currentScreen === 'onboarding' && (
          <OnboardingScreen
            onNavigateToMain={() => navigateTo('main')}
            onRestartSplash={() => setScreenStack(['splash'])}
          />
        )}

        {currentScreen === 'main' && (
          <MainHomeScreen
            onBackToOnboarding={() => setScreenStack(['onboarding'])}
            onOpenBankHuquq={() => navigateTo('bank_huquq')}
            onOpenMurojaat={() => navigateTo('murojaat')}
          />
        )}

        {currentScreen === 'bank_huquq' && (
          <BankHuquqScreen
            onBack={goBack}
          />
        )}

        {currentScreen === 'murojaat' && (
          <MurojaatScreen
            onBack={goBack}
          />
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#060E1A',
  },
});
