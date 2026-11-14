import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface WebDeviceFrameProps {
  children: React.ReactNode;
  currentScreen?: string;
}

const logoImage = require('../../assets/images/logo.jpg');

export const WebDeviceFrame: React.FC<WebDeviceFrameProps> = ({
  children,
  currentScreen = 'splash',
}) => {
  // Only activate frame on web desktop
  const [isDesktop, setIsDesktop] = useState(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return false;
    return window.innerWidth > 500;
  });

  const [windowDimensions, setWindowDimensions] = useState(() => {
    if (typeof window !== 'undefined') {
      return { width: window.innerWidth, height: window.innerHeight };
    }
    return { width: 1200, height: 900 };
  });

  const [zoomLevel, setZoomLevel] = useState<number | 'auto'>('auto');
  const [currentTime, setCurrentTime] = useState('09:41');

  // Clock updates every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Handle window resize on web
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    const handleResize = () => {
      setIsDesktop(window.innerWidth > 500);
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate auto-fit scale so the whole iPhone fits on the user's screen without scrolling
  const computedScale = useMemo(() => {
    if (zoomLevel !== 'auto') {
      return zoomLevel;
    }
    // iPhone total frame height is 958px + 70px header & margin = ~1028px
    const availableHeight = windowDimensions.height - 80;
    const availableWidth = windowDimensions.width - 40;
    const scaleY = availableHeight / 970;
    const scaleX = availableWidth / 480;
    const scale = Math.min(1, Math.min(scaleX, scaleY));
    return Math.max(0.55, Math.min(1, scale));
  }, [windowDimensions, zoomLevel]);

  // Dark or light status bar based on screen
  const isDarkScreen = currentScreen === 'splash';
  const statusColor = isDarkScreen ? '#FFFFFF' : '#0F172A';
  const statusMutedColor = isDarkScreen ? 'rgba(255,255,255,0.7)' : 'rgba(15,23,42,0.6)';
  const homeBarColor = isDarkScreen ? '#FFFFFF' : '#0F172A';

  // If mobile or native app, render directly
  if (!isDesktop) {
    return <View style={styles.nativeRoot}>{children}</View>;
  }

  return (
    <View style={styles.desktopBackdrop}>
      {/* Ambient background glow */}
      <View style={styles.ambientGlow} />

      {/* Top Desktop Navigation & Controls Bar */}
      <View style={styles.desktopTopNav}>
        <View style={styles.topNavLeft}>
          <Image source={logoImage} style={styles.topNavLogo} resizeMode="cover" />
          <View>
            <View style={styles.topNavTitleRow}>
              <Text style={styles.topNavTitle}>YORDAM</Text>
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>WEB LIVE</Text>
              </View>
            </View>
            <Text style={styles.topNavSubtitle}>O‘zbekiston Huquqiy Hamkori</Text>
          </View>
        </View>

        {/* Center device badge */}
        <View style={styles.deviceBadgePill}>
          <Ionicons name="phone-portrait-outline" size={15} color="#38BDF8" style={{ marginRight: 6 }} />
          <Text style={styles.deviceBadgeText}>iPhone 15 Pro Max</Text>
          <Text style={styles.deviceBadgeDivider}>•</Text>
          <Text style={styles.deviceBadgeSub}>430 × 932 pt</Text>
        </View>

        {/* Right zoom / fit controls */}
        <View style={styles.topNavRight}>
          <View style={styles.zoomControlGroup}>
            <TouchableOpacity
              style={styles.zoomBtn}
              onPress={() => setZoomLevel((prev) => (prev === 'auto' ? 0.8 : Math.max(0.5, prev - 0.1)))}
              activeOpacity={0.7}
              accessibilityLabel="Kichraytirish"
            >
              <Ionicons name="remove" size={15} color="#94A3B8" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.zoomBtn, zoomLevel === 'auto' && styles.zoomBtnActive]}
              onPress={() => setZoomLevel('auto')}
              activeOpacity={0.7}
            >
              <Text style={[styles.zoomBtnText, zoomLevel === 'auto' && styles.zoomBtnTextActive]}>
                {zoomLevel === 'auto' ? `Fit (${Math.round(computedScale * 100)}%)` : `${Math.round(zoomLevel * 100)}%`}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.zoomBtn}
              onPress={() => setZoomLevel((prev) => (prev === 'auto' ? 1.0 : Math.min(1.1, prev + 0.1)))}
              activeOpacity={0.7}
              accessibilityLabel="Kattalashtirish"
            >
              <Ionicons name="add" size={15} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Main Center Stage: Scaled iPhone 15 Pro Max Chassis */}
      <View
        style={[
          styles.stageContainer,
          {
            width: 456 * computedScale,
            height: 958 * computedScale,
          },
        ]}
      >
        <View
          style={[
            styles.phoneChassis,
            {
              transform: [{ scale: computedScale }],
            },
          ]}
        >
          {/* Hardware Buttons - Left Edge */}
          {/* Action Button */}
          <View style={styles.btnAction} />
          {/* Volume Up */}
          <View style={styles.btnVolumeUp} />
          {/* Volume Down */}
          <View style={styles.btnVolumeDown} />

          {/* Hardware Button - Right Edge (Power/Side Button) */}
          <View style={styles.btnPower} />

          {/* Inner Display Screen with 44px border radius */}
          <View style={styles.phoneScreen}>
            {/* Native App Viewport (430 x 932) */}
            <View style={styles.appViewport}>{children}</View>

            {/* iPhone Status Bar (Fixed at top, pointerEvents none) */}
            <View style={styles.statusBarOverlay} pointerEvents="none">
              {/* Left: Clock */}
              <View style={styles.statusTimeCol}>
                <Text style={[styles.statusTimeText, { color: statusColor }]}>{currentTime}</Text>
              </View>

              {/* Dynamic Island in center */}
              <View style={styles.dynamicIslandContainer}>
                <View style={styles.dynamicIslandPill}>
                  {/* Left Sensor Dot */}
                  <View style={styles.islandSensor} />
                  {/* Right TrueDepth Camera Lens with subtle reflection */}
                  <View style={styles.islandCamera}>
                    <View style={styles.islandLensReflection} />
                  </View>
                </View>
              </View>

              {/* Right: Signal, Wi-Fi & Battery */}
              <View style={styles.statusIconsCol}>
                {/* 4-bar cellular icon */}
                <View style={styles.cellularWrap}>
                  <View style={[styles.cellularBar, { height: 4, backgroundColor: statusColor }]} />
                  <View style={[styles.cellularBar, { height: 6, backgroundColor: statusColor }]} />
                  <View style={[styles.cellularBar, { height: 8, backgroundColor: statusColor }]} />
                  <View style={[styles.cellularBar, { height: 10, backgroundColor: statusColor }]} />
                </View>

                {/* Wi-Fi Icon */}
                <Ionicons name="wifi" size={14} color={statusColor} style={{ marginRight: 5 }} />

                {/* Battery Capsule with tip */}
                <View style={styles.batteryGroup}>
                  <View style={[styles.batteryCapsule, { borderColor: statusMutedColor }]}>
                    <View style={[styles.batteryFill, { backgroundColor: statusColor }]} />
                  </View>
                  <View style={[styles.batteryTip, { backgroundColor: statusMutedColor }]} />
                </View>
              </View>
            </View>

            {/* Bottom Home Indicator Bar (Fixed at bottom, pointerEvents none) */}
            <View style={styles.homeBarOverlay} pointerEvents="none">
              <View style={[styles.homeBarPill, { backgroundColor: homeBarColor }]} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles: any = StyleSheet.create({
  nativeRoot: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  desktopBackdrop: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#070B14',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  ambientGlow: {
    position: 'absolute',
    top: '20%',
    left: '50%',
    width: 600,
    height: 600,
    marginLeft: -300,
    borderRadius: 300,
    backgroundColor: 'rgba(2, 132, 199, 0.08)',
    filter: 'blur(100px)' as any,
    pointerEvents: 'none',
  },

  /* Desktop Top Navigation Bar */
  desktopTopNav: {
    position: 'absolute',
    top: 14,
    left: 20,
    right: 20,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 100,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(16px)' as any,
  },
  topNavLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  topNavLogo: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  topNavTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  topNavTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: 0.5,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
    gap: 4,
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#10B981',
  },
  liveText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#10B981',
  },
  topNavSubtitle: {
    fontSize: 10.5,
    color: '#94A3B8',
  },

  deviceBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
  },
  deviceBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#E2E8F0',
  },
  deviceBadgeDivider: {
    fontSize: 11,
    color: '#64748B',
    marginHorizontal: 6,
  },
  deviceBadgeSub: {
    fontSize: 11,
    color: '#94A3B8',
    fontFamily: 'monospace',
  },

  topNavRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  zoomControlGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
  zoomBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomBtnActive: {
    backgroundColor: 'rgba(2, 132, 199, 0.25)',
  },
  zoomBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },
  zoomBtnTextActive: {
    color: '#38BDF8',
  },

  /* Center Stage */
  stageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 35,
  },

  /* Physical iPhone 15 Pro Max Chassis */
  phoneChassis: {
    width: 456,
    height: 958,
    borderRadius: 54,
    backgroundColor: '#1C1F26',
    borderWidth: 3.5,
    borderColor: '#3D424E',
    boxShadow:
      '0 30px 80px -15px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.12), 0 0 40px rgba(2, 132, 199, 0.18)' as any,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    transformOrigin: 'center center' as any,
  },

  /* Hardware Side Buttons */
  btnAction: {
    position: 'absolute',
    left: -6.5,
    top: 150,
    width: 3.5,
    height: 28,
    backgroundColor: '#353B47',
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
  },
  btnVolumeUp: {
    position: 'absolute',
    left: -6.5,
    top: 200,
    width: 3.5,
    height: 52,
    backgroundColor: '#353B47',
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
  },
  btnVolumeDown: {
    position: 'absolute',
    left: -6.5,
    top: 268,
    width: 3.5,
    height: 52,
    backgroundColor: '#353B47',
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
  },
  btnPower: {
    position: 'absolute',
    right: -6.5,
    top: 215,
    width: 3.5,
    height: 78,
    backgroundColor: '#353B47',
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },

  /* Inner Screen Display (430 x 932) */
  phoneScreen: {
    width: 430,
    height: 932,
    borderRadius: 44,
    backgroundColor: '#060E1A',
    overflow: 'hidden',
    position: 'relative',
  },
  appViewport: {
    flex: 1,
    width: 430,
    height: 932,
  },

  /* iPhone Status Bar Overlay */
  statusBarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    zIndex: 99998,
  },
  statusTimeCol: {
    width: 70,
    paddingTop: 4,
  },
  statusTimeText: {
    fontSize: 14.5,
    fontWeight: '700',
    letterSpacing: -0.2,
  },

  /* Dynamic Island */
  dynamicIslandContainer: {
    position: 'absolute',
    top: 11,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  dynamicIslandPill: {
    width: 124,
    height: 35,
    borderRadius: 18,
    backgroundColor: '#000000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.4)' as any,
  },
  islandSensor: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#080C16',
    marginLeft: 3,
  },
  islandCamera: {
    width: 11,
    height: 11,
    borderRadius: 5.5,
    backgroundColor: '#0B1122',
    borderWidth: 1,
    borderColor: '#172554',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 2,
  },
  islandLensReflection: {
    width: 3.5,
    height: 3.5,
    borderRadius: 1.75,
    backgroundColor: '#38BDF8',
    opacity: 0.6,
  },

  /* Right Status Icons */
  statusIconsCol: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 70,
    justifyContent: 'flex-end',
    paddingTop: 4,
    gap: 4,
  },
  cellularWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 1.5,
    height: 11,
    marginRight: 2,
  },
  cellularBar: {
    width: 2.5,
    borderRadius: 0.5,
  },
  batteryGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  batteryCapsule: {
    width: 23,
    height: 11.5,
    borderRadius: 3.5,
    borderWidth: 1,
    padding: 1.5,
    justifyContent: 'center',
  },
  batteryFill: {
    width: '85%',
    height: '100%',
    borderRadius: 1.5,
  },
  batteryTip: {
    width: 1.5,
    height: 4,
    borderTopRightRadius: 1,
    borderBottomRightRadius: 1,
  },

  /* Bottom Home Indicator */
  homeBarOverlay: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 99999,
  },
  homeBarPill: {
    width: 136,
    height: 5,
    borderRadius: 2.5,
    opacity: 0.85,
  },
} as any);
