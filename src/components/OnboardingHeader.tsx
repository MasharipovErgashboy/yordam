import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

interface OnboardingHeaderProps {
  onSkip: () => void;
  showSkip: boolean;
}

const logoImage = require('../../assets/images/logo.jpg');

export const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({
  onSkip,
  showSkip,
}) => {
  return (
    <View style={styles.container}>
      {/* Brand Logo Image from user upload */}
      <View style={styles.logoWrap}>
        <Image
          source={logoImage}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      {/* Skip Button - Clean plain text matching design */}
      {showSkip ? (
        <TouchableOpacity
          onPress={onSkip}
          activeOpacity={0.6}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.skipButton}
        >
          <Text style={styles.skipText}>Ötkazib yuboriş</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 58,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    zIndex: 30,
  },
  logoWrap: {
    width: 60,
    height: 52,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  logoImage: {
    width: 55,
    height: 48,
  },
  skipButton: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
  },
  placeholder: {
    width: 60,
  },
});
