import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  useWindowDimensions,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { ONBOARDING_SLIDES, OnboardingSlideData } from '../data/onboardingData';
import { OnboardingHeader } from '../components/OnboardingHeader';
import { PaginationDots } from '../components/PaginationDots';

interface OnboardingScreenProps {
  onNavigateToMain: () => void;
  onRestartSplash?: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  onNavigateToMain,
}) => {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList<OnboardingSlideData>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const isLastSlide = currentIndex === ONBOARDING_SLIDES.length - 1;

  // Handle manual scroll momentum end
  const onMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / width);
      if (index >= 0 && index < ONBOARDING_SLIDES.length) {
        setCurrentIndex(index);
      }
    },
    [width]
  );

  // Navigate to specific index
  const scrollToIndex = (index: number) => {
    if (index >= 0 && index < ONBOARDING_SLIDES.length) {
      flatListRef.current?.scrollToIndex({
        index,
        animated: true,
      });
      setCurrentIndex(index);
    }
  };

  // Next Button handler
  const handleNext = () => {
    if (isLastSlide) {
      onNavigateToMain();
    } else {
      scrollToIndex(currentIndex + 1);
    }
  };

  // Skip handler: jump directly into the Main System
  const handleSkip = () => {
    onNavigateToMain();
  };

  // Render individual slide item
  const renderSlide = ({ item }: { item: OnboardingSlideData }) => {
    const Visual = item.VisualComponent;

    return (
      <View style={[styles.slideContainer, { width }]}>
        {/* Visual Graphic */}
        <View style={styles.visualWrapper}>
          <Visual />
        </View>

        {/* Text Information Block (Left-aligned exactly as in screenshot) */}
        <View style={styles.textContainer}>
          <Text style={styles.titleText}>
            {item.title}
          </Text>

          <Text style={styles.descriptionText}>
            {item.description}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      {/* Top Header with Brand Logo & Skip Button */}
      <OnboardingHeader onSkip={handleSkip} showSkip={true} />

      {/* Swipeable FlatList with Slides */}
      <FlatList
        ref={flatListRef}
        data={ONBOARDING_SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        scrollEventThrottle={16}
        style={styles.flatList}
      />

      {/* Bottom Area: Pagination Dots, Action Button & Decorative Waves */}
      <View style={styles.bottomSection}>
        {/* 4 Pagination Indicator Dots */}
        <View style={styles.dotsWrapper}>
          <PaginationDots
            total={ONBOARDING_SLIDES.length}
            activeIndex={currentIndex}
            onDotPress={(idx) => scrollToIndex(idx)}
          />
        </View>

        {/* Full-width "Keyingi" / "Boshlash" Action Button */}
        <TouchableOpacity
          onPress={handleNext}
          activeOpacity={0.88}
          style={[
            styles.mainActionButton,
            isLastSlide ? styles.getStartedButton : styles.nextButton,
          ]}
        >
          <Text style={styles.mainActionText}>
            {isLastSlide ? 'Boshlash' : 'Keyingi'}
          </Text>
          <Ionicons name="arrow-forward" size={19} color="#FFFFFF" style={styles.arrowIcon} />
        </TouchableOpacity>
      </View>

      {/* Bottom Decorative Wave (Navy left curve, Gold right curve matching screenshot) */}
      <View style={styles.waveContainer}>
        <Svg width={width} height={38} viewBox={`0 0 ${width} 38`}>
          {/* Left Navy Wave */}
          <Path
            d={`M 0 10 Q ${width * 0.22} 24 ${width * 0.52} 38 L 0 38 Z`}
            fill="#034687"
          />
          {/* Right Gold Wave */}
          <Path
            d={`M ${width * 0.44} 38 Q ${width * 0.74} 24 ${width} 8 L ${width} 38 Z`}
            fill="#F59E0B"
          />
        </Svg>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
  },
  flatList: {
    flex: 1,
  },
  slideContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  visualWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxHeight: 330,
  },
  textContainer: {
    width: '100%',
    paddingHorizontal: 8,
    marginTop: 6,
    marginBottom: 8,
  },
  titleText: {
    fontSize: 27,
    fontWeight: '800',
    color: '#033B6A',
    textAlign: 'left',
    lineHeight: 34,
    marginBottom: 12,
    letterSpacing: -0.4,
  },
  descriptionText: {
    fontSize: 14.5,
    color: '#374151',
    textAlign: 'left',
    lineHeight: 22,
    fontWeight: '400',
  },
  bottomSection: {
    width: '100%',
    paddingHorizontal: 24,
    paddingBottom: 10,
    alignItems: 'center',
  },
  dotsWrapper: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainActionButton: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButton: {
    backgroundColor: '#034687',
    shadowColor: '#034687',
  },
  getStartedButton: {
    backgroundColor: '#F59E0B',
    shadowColor: '#F59E0B',
  },
  mainActionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  arrowIcon: {
    position: 'absolute',
    right: 22,
  },
  waveContainer: {
    width: '100%',
    height: 38,
    overflow: 'hidden',
  },
});
