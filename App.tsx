import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, BackHandler, Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { SplashScreen } from './src/screens/SplashScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { MainHomeScreen } from './src/screens/MainHomeScreen';
import { BankHuquqScreen } from './src/screens/BankHuquqScreen';
import { MurojaatScreen } from './src/screens/MurojaatScreen';
import { AuthScreen } from './src/screens/AuthScreen';
import { authService, UserProfile } from './src/services/authService';
import { WebDeviceFrame } from './src/components/WebDeviceFrame';

type AppScreen = 'splash' | 'onboarding' | 'main' | 'auth' | 'bank_huquq' | 'murojaat';

export default function App() {
  const [screenStack, setScreenStack] = useState<AppScreen[]>(['splash']);
  const currentScreen = screenStack[screenStack.length - 1] || 'splash';
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Restore stored session on mount
  useEffect(() => {
    const loadSession = async () => {
      try {
        const session = await authService.getSession();
        if (session.user && session.token) {
          setUser(session.user);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.warn('Error restoring user session:', err);
      }
    };
    loadSession();
  }, []);

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

  const handleSplashFinish = async () => {
    try {
      const session = await authService.getSession();
      if (session.user && session.token) {
        setUser(session.user);
        setIsAuthenticated(true);
        setScreenStack(['main']);
        return;
      }
    } catch (err) {
      console.warn('Error checking session on splash finish:', err);
    }

    if (isAuthenticated) {
      setScreenStack(['main']);
    } else {
      navigateTo('onboarding');
    }
  };

  const handleAuthSuccess = (authenticatedUser: UserProfile) => {
    setUser(authenticatedUser);
    setIsAuthenticated(true);
    setScreenStack(['main']);
  };

  const handleLogout = async () => {
    await authService.clearSession();
    setUser(null);
    setIsAuthenticated(false);
  };

  const isDesktopWeb = Platform.OS === 'web' && typeof window !== 'undefined' && window.innerWidth > 500;
  const webIphoneMetrics = {
    insets: { top: 59, bottom: 34, left: 0, right: 0 },
    frame: { x: 0, y: 0, width: 430, height: 932 },
  };

  return (
    <WebDeviceFrame currentScreen={currentScreen} onRestartApp={() => setScreenStack(['splash'])}>
      <SafeAreaProvider initialMetrics={isDesktopWeb ? webIphoneMetrics : undefined}>
        {isDesktopWeb ? (
          <SafeAreaInsetsContext.Provider value={{ top: 59, bottom: 34, left: 0, right: 0 }}>
            <View style={[styles.container, currentScreen === 'auth' && { backgroundColor: '#F8FAFC' }]}>
              {currentScreen === 'splash' && (
                <SplashScreen
                  onFinish={handleSplashFinish}
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
                  isAuthenticated={isAuthenticated}
                  user={user}
                  onRequireAuth={() => navigateTo('auth')}
                  onLogout={handleLogout}
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

              {currentScreen === 'auth' && (
                <AuthScreen
                  initialTab="login"
                  onAuthSuccess={handleAuthSuccess}
                  onCancel={goBack}
                />
              )}
            </View>
          </SafeAreaInsetsContext.Provider>
        ) : (
          <View style={[styles.container, currentScreen === 'auth' && { backgroundColor: '#F8FAFC' }]}>
            {currentScreen === 'splash' && (
              <SplashScreen
                onFinish={handleSplashFinish}
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
                isAuthenticated={isAuthenticated}
                user={user}
                onRequireAuth={() => navigateTo('auth')}
                onLogout={handleLogout}
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

            {currentScreen === 'auth' && (
              <AuthScreen
                initialTab="login"
                onAuthSuccess={handleAuthSuccess}
                onCancel={goBack}
              />
            )}
          </View>
        )}
      </SafeAreaProvider>
    </WebDeviceFrame>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#060E1A',
  },
});
