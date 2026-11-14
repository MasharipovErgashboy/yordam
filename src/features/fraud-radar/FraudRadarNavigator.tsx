import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, BackHandler } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../theme/colors';
import { FraudRadarHomeScreen } from './screens/FraudRadarHomeScreen';
import { FraudRadarCheckScreen } from './screens/FraudRadarCheckScreen';
import { FraudRadarResultScreen } from './screens/FraudRadarResultScreen';
import { FraudRadarHistoryScreen } from './screens/FraudRadarHistoryScreen';
import { FraudRadarCyberReportScreen } from './screens/FraudRadarCyberReportScreen';
import { FraudRadarCommunityReportScreen } from './screens/FraudRadarCommunityReportScreen';
import { RadarBottomTabBar, RadarTabType } from './components/RadarBottomTabBar';
import { VerificationResult, HistoryItem } from '../../types/fraudRadar.types';
import { DANGEROUS_VERIFICATION_RESULT, SAFE_VERIFICATION_RESULT } from '../../mock/fraudRadarData';

interface FraudRadarNavigatorProps {
  onBack?: () => void;
}

export const FraudRadarNavigator: React.FC<FraudRadarNavigatorProps> = ({ onBack }) => {
  const insets = useSafeAreaInsets();
  const [currentTab, setCurrentTab] = useState<RadarTabType>('home');
  const [activeScreen, setActiveScreen] = useState<'main' | 'check' | 'result' | 'cyber_report' | 'community_report'>('main');
  const [initialCheckQuery, setInitialCheckQuery] = useState('');
  const [currentResult, setCurrentResult] = useState<VerificationResult | null>(null);
  const [cyberReportTarget, setCyberReportTarget] = useState('8600 12** **** 4590');

  const handleHardwareBack = useCallback(() => {
    if (activeScreen === 'cyber_report') {
      setActiveScreen('result');
      return true;
    }
    if (activeScreen !== 'main') {
      setActiveScreen('main');
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
  }, [activeScreen, currentTab, onBack]);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', handleHardwareBack);
    return () => sub.remove();
  }, [handleHardwareBack]);

  const handleStartCheck = (query?: string) => {
    setInitialCheckQuery(query || '');
    setActiveScreen('check');
  };

  const handleResultReady = (res: VerificationResult) => {
    setCurrentResult(res);
    setActiveScreen('result');
  };

  const handleStartCyberReport = (target: string) => {
    setCyberReportTarget(target);
    setActiveScreen('cyber_report');
  };

  const handleSelectHistoryItem = (item: HistoryItem) => {
    if (item.isSafe) {
      setCurrentResult({
        ...SAFE_VERIFICATION_RESULT,
        query: item.query,
      });
    } else {
      setCurrentResult({
        ...DANGEROUS_VERIFICATION_RESULT,
        query: item.query,
      });
    }
    setActiveScreen('result');
  };

  const renderContent = () => {
    if (activeScreen === 'check') {
      return (
        <FraudRadarCheckScreen
          initialQuery={initialCheckQuery}
          onBack={() => setActiveScreen('main')}
          onResultReady={handleResultReady}
        />
      );
    }

    if (activeScreen === 'result' && currentResult) {
      return (
        <FraudRadarResultScreen
          result={currentResult}
          onBack={() => setActiveScreen('main')}
          onNewCheck={() => {
            setInitialCheckQuery('');
            setActiveScreen('check');
          }}
          onStartCyberReport={handleStartCyberReport}
        />
      );
    }

    if (activeScreen === 'cyber_report') {
      return (
        <FraudRadarCyberReportScreen
          suspectTarget={cyberReportTarget}
          onBack={() => setActiveScreen('result')}
          onSubmitSuccess={() => {
            setActiveScreen('main');
            setCurrentTab('history');
          }}
        />
      );
    }

    if (activeScreen === 'community_report') {
      return (
        <FraudRadarCommunityReportScreen
          onBack={() => setActiveScreen('main')}
          onSubmitSuccess={() => {
            setActiveScreen('main');
            setCurrentTab('home');
          }}
        />
      );
    }

    switch (currentTab) {
      case 'home':
        return (
          <FraudRadarHomeScreen
            onStartCheck={(query) => handleStartCheck(query)}
            onOpenCommunityReport={() => setActiveScreen('community_report')}
            onViewAllAlerts={() => handleStartCheck('')}
            onClose={onBack}
          />
        );

      case 'radar':
        return (
          <FraudRadarCheckScreen
            initialQuery=""
            onBack={() => setCurrentTab('home')}
            onResultReady={handleResultReady}
          />
        );

      case 'history':
        return (
          <FraudRadarHistoryScreen
            onStartNewCheck={() => handleStartCheck('')}
            onSelectHistoryItem={handleSelectHistoryItem}
          />
        );

      default:
        return null;
    }
  };

  const showTabBar = activeScreen === 'main';

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: showTabBar ? 0 : insets.bottom,
        },
      ]}
    >
      <View style={styles.screenWrapper}>{renderContent()}</View>
      {showTabBar && (
        <RadarBottomTabBar
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setActiveScreen('main');
            setCurrentTab(tab);
          }}
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
