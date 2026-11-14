import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SplashScreen } from './src/screens/SplashScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { MainHomeScreen } from './src/screens/MainHomeScreen';
import { AuthScreen } from './src/screens/AuthScreen';
import { authService, UserProfile } from './src/services/authService';

type AppScreen = 'splash' | 'onboarding' | 'main' | 'auth';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('splash');
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

  const handleSplashFinish = async () => {
    try {
      const session = await authService.getSession();
      if (session.user && session.token) {
        setUser(session.user);
        setIsAuthenticated(true);
        setCurrentScreen('main');
        return;
      }
    } catch (err) {
      console.warn('Error checking session on splash finish:', err);
    }

    if (isAuthenticated) {
      setCurrentScreen('main');
    } else {
      setCurrentScreen('onboarding');
    }
  };

  const handleAuthSuccess = (authenticatedUser: UserProfile) => {
    setUser(authenticatedUser);
    setIsAuthenticated(true);
    setCurrentScreen('main');
  };

  const handleLogout = async () => {
    await authService.clearSession();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <SafeAreaProvider>
      <View style={[styles.container, currentScreen === 'auth' && { backgroundColor: '#F8FAFC' }]}>
        {currentScreen === 'splash' && (
          <SplashScreen
            onFinish={handleSplashFinish}
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
            isAuthenticated={isAuthenticated}
            user={user}
            onRequireAuth={() => setCurrentScreen('auth')}
            onLogout={handleLogout}
          />
        )}

        {currentScreen === 'auth' && (
          <AuthScreen
            initialTab="login"
            onAuthSuccess={handleAuthSuccess}
            onCancel={() => setCurrentScreen('main')}
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
