import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Circle } from 'react-native-svg';
import { COLORS } from '../constants/theme';

interface BrandLogoProps {
  size?: number;
  showText?: boolean;
  showSlogan?: boolean;
  lightMode?: boolean; // If true, text is dark, otherwise white (for splash on dark navy)
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 100,
  showText = true,
  showSlogan = false,
  lightMode = false,
}) => {
  // SVG dimensions relative to 100
  const scale = size / 100;

  return (
    <View style={styles.container}>
      {/* Shield + Justice Balance Vector Emblem */}
      <View style={[styles.iconContainer, { width: size, height: size }]}>
        <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <Defs>
            <LinearGradient id="shieldGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <Stop offset="0%" stopColor="#0066FF" />
              <Stop offset="50%" stopColor="#00A3FF" />
              <Stop offset="100%" stopColor="#00D4B2" />
            </LinearGradient>
            <LinearGradient id="innerGlow" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
              <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
              <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </LinearGradient>
            <LinearGradient id="accentGold" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <Stop offset="0%" stopColor="#FFFFFF" />
              <Stop offset="100%" stopColor="#E2F1FF" />
            </LinearGradient>
          </Defs>

          {/* Background subtle glowing circle */}
          <Circle cx="50" cy="50" r="46" fill="#0066FF" fillOpacity="0.08" />

          {/* Shield Base Contour */}
          <Path
            d="M50 8L82 22C82 54 66 78 50 92C34 78 18 54 18 22L50 8Z"
            fill="url(#shieldGrad)"
          />

          {/* Inner Light Highlight */}
          <Path
            d="M50 12L78 24.5C78 52 64 73 50 86C36 73 22 52 22 24.5L50 12Z"
            fill="url(#innerGlow)"
          />

          {/* Justice Balance Beam & Central Pillar (representing 'Y' and justice scale) */}
          {/* Central Stem */}
          <Path
            d="M50 24V66"
            stroke="url(#accentGold)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Top Decorative Finial */}
          <Circle cx="50" cy="22" r="3" fill="#FFFFFF" />

          {/* Scales Balance Horizontal Crossbeam */}
          <Path
            d="M30 33C38 31 62 31 70 33"
            stroke="url(#accentGold)"
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* Left Pan Chains & Pan */}
          <Path
            d="M30 33L24 45M30 33L36 45"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeOpacity="0.8"
            strokeLinecap="round"
          />
          <Path
            d="M22 46C22 50 38 50 38 46Z"
            fill="#FFFFFF"
          />

          {/* Right Pan Chains & Pan */}
          <Path
            d="M70 33L64 45M70 33L76 45"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeOpacity="0.8"
            strokeLinecap="round"
          />
          <Path
            d="M62 46C62 50 78 50 78 46Z"
            fill="#FFFFFF"
          />

          {/* Pedestal Base */}
          <Path
            d="M40 68C44 67 56 67 60 68L64 74C64 75 36 75 36 74L40 68Z"
            fill="#FFFFFF"
          />

          {/* Center Justice Star / Point of Truth */}
          <Circle cx="50" cy="33" r="2.5" fill="#00D4B2" />
        </Svg>
      </View>

      {/* Brand Name */}
      {showText && (
        <View style={styles.textWrapper}>
          <Text
            style={[
              styles.brandName,
              { color: lightMode ? COLORS.navy : COLORS.textWhite },
            ]}
          >
            YORDAM
          </Text>
          <View style={styles.underlineTrack}>
            <View style={styles.underlineGlow} />
          </View>
        </View>
      )}

      {/* Slogan */}
      {showSlogan && (
        <Text
          style={[
            styles.slogan,
            { color: lightMode ? COLORS.textSecondary : COLORS.textWhiteDim },
          ]}
        >
          Huquqingizni biling. Yordamingiz shu yerda.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    shadowColor: '#0066FF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  },
  textWrapper: {
    marginTop: 18,
    alignItems: 'center',
  },
  brandName: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 6,
    textTransform: 'uppercase',
  },
  underlineTrack: {
    width: 48,
    height: 3,
    backgroundColor: 'rgba(0, 212, 178, 0.3)',
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
    alignItems: 'center',
  },
  underlineGlow: {
    width: 24,
    height: 3,
    backgroundColor: '#00D4B2',
    borderRadius: 2,
  },
  slogan: {
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 14,
    lineHeight: 22,
    paddingHorizontal: 24,
    letterSpacing: 0.2,
  },
});

