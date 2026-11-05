import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SplashScreen } from './src/screens/SplashScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { MainHomeScreen } from './src/screens/MainHomeScreen';

type AppScreen = 'splash' | 'onboarding' | 'main';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('splash');

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {currentScreen === 'splash' && (
          <SplashScreen
            onFinish={() => setCurrentScreen('onboarding')}
          />
        )}

        {currentScreen === 'onboarding' && (
          <OnboardingScreen
            onNavigateToMain={() => setCurrentScreen('main')}
            onRestartSplash={() => setCurrentScreen('splash')}
          />
        )}

        {currentScreen === 'main' && (
          <MainHomeScreen
            onBackToOnboarding={() => setCurrentScreen('onboarding')}
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
