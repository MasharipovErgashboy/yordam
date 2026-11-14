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
  onRestartApp?: () => void;
}

const logoImage = require('../../assets/images/logo.jpg');

export const WebDeviceFrame: React.FC<WebDeviceFrameProps> = ({
  children,
  currentScreen = 'splash',
  onRestartApp,
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
  const [isPowerOn, setIsPowerOn] = useState(true);

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
    // iPhone total frame height is 958px + 60px margin = ~1018px
    const availableHeight = windowDimensions.height - 60;
    const availableWidth = windowDimensions.width - 280; // Account for left sidebar card
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

      {/* Left Vertical Control Sidebar (Moved from top to left side, vertically oriented) */}
      <View style={styles.desktopSidebar}>
        {/* Brand & App Info Header */}
        <View style={styles.sidebarBrandRow}>
          <Image source={logoImage} style={styles.sidebarLogo} resizeMode="cover" />
          <View style={{ flex: 1 }}>
            <View style={styles.sidebarTitleRow}>
              <Text style={styles.sidebarTitle}>YORDAM</Text>
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>WEB</Text>
              </View>
            </View>
            <Text style={styles.sidebarSubtitle}>Huquqiy Hamkor</Text>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.sidebarDivider} />

        {/* Section 1: Telefon Quvvati / Ekrani */}
        <Text style={styles.sidebarSectionLabel}>TELEFON BOSHQARUVI</Text>

        {/* Power On / Off Toggle Button */}
        <TouchableOpacity
          style={[
            styles.powerBtnCard,
            isPowerOn ? styles.powerBtnCardOn : styles.powerBtnCardOff,
          ]}
          onPress={() => setIsPowerOn((prev) => !prev)}
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.powerIconBox,
              isPowerOn ? styles.powerIconBoxOn : styles.powerIconBoxOff,
            ]}
          >
            <Ionicons
              name="power"
              size={18}
              color={isPowerOn ? '#EF4444' : '#10B981'}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text
              style={[
                styles.powerBtnTitle,
                isPowerOn ? styles.powerBtnTitleOn : styles.powerBtnTitleOff,
              ]}
            >
              {isPowerOn ? 'O‘chirish' : 'Yoqish'}
            </Text>
            <Text style={styles.powerBtnSubtitle}>
              {isPowerOn ? 'Ekranni qulflash' : 'Ekranni uyg‘otish'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Restart to Splash Video Button */}
        {onRestartApp && (
          <TouchableOpacity
            style={styles.restartBtnCard}
            onPress={() => {
              setIsPowerOn(true);
              onRestartApp();
            }}
            activeOpacity={0.75}
          >
            <View style={styles.restartIconBox}>
              <Ionicons name="reload" size={14} color="#38BDF8" />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.restartBtnTitle}>Qayta boshlash</Text>
              <Text style={styles.restartBtnSubtitle}>Splash videoni ko‘rish</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Divider */}
        <View style={styles.sidebarDivider} />

        {/* Section 2: Masshtab (Zoom) */}
        <Text style={styles.sidebarSectionLabel}>MASSHTAB (ZOOM)</Text>
        <View style={styles.zoomControlRow}>
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

          {/* Hardware Button - Right Edge (Interactive Physical Power/Side Button) */}
          <TouchableOpacity
            style={styles.btnPower}
            activeOpacity={0.7}
            onPress={() => setIsPowerOn((prev) => !prev)}
            accessibilityLabel="Fizik quvvat tugmasi"
          />

          {/* Inner Display Screen with 44px border radius */}
          <View style={styles.phoneScreen}>
            {/* Native App Viewport (430 x 932) */}
            <View style={[styles.appViewport, !isPowerOn && { opacity: 0 }]}>
              {children}
            </View>

            {/* Screen Off / Locked Overlay */}
            {!isPowerOn && (
              <TouchableOpacity
                style={styles.screenOffOverlay}
                activeOpacity={0.95}
                onPress={() => setIsPowerOn(true)}
              >
                <View style={styles.screenOffContent}>
                  <View style={styles.screenOffIconCircle}>
                    <Ionicons name="power" size={26} color="#475569" />
                  </View>
                  <Text style={styles.screenOffTitle}>Telefon o‘chirilgan</Text>
                  <Text style={styles.screenOffSub}>
                    Ekranni yoqish uchun shu yerga yoki chap paneldagi «Yoqish» tugmasiga bosing
                  </Text>
                </View>
              </TouchableOpacity>
            )}

            {/* iPhone Status Bar (Fixed at top, pointerEvents none, only when power is ON) */}
            {isPowerOn && (
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
            )}

            {/* Bottom Home Indicator Bar (Fixed at bottom, pointerEvents none, only when power is ON) */}
            {isPowerOn && (
              <View style={styles.homeBarOverlay} pointerEvents="none">
                <View style={[styles.homeBarPill, { backgroundColor: homeBarColor }]} />
              </View>
            )}
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

  /* Left Vertical Control Sidebar Card */
  desktopSidebar: {
    position: 'absolute',
    left: 28,
    top: '50%',
    transform: [{ translateY: -175 }],
    width: 230,
    backgroundColor: 'rgba(15, 23, 42, 0.82)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    zIndex: 100,
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05)' as any,
    backdropFilter: 'blur(20px)' as any,
  },
  sidebarBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sidebarLogo: {
    width: 36,
    height: 36,
    borderRadius: 9,
  },
  sidebarTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sidebarTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: 0.5,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
    gap: 3.5,
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#10B981',
  },
  liveText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#10B981',
  },
  sidebarSubtitle: {
    fontSize: 10.5,
    color: '#94A3B8',
    marginTop: 1,
  },
  sidebarDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginVertical: 13,
  },
  sidebarSectionLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 8,
  },

  /* Power Button Card */
  powerBtnCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  powerBtnCardOn: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.28)',
  },
  powerBtnCardOff: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: 'rgba(16, 185, 129, 0.38)',
  },
  powerIconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  powerIconBoxOn: {
    backgroundColor: 'rgba(239, 68, 68, 0.18)',
  },
  powerIconBoxOff: {
    backgroundColor: 'rgba(16, 185, 129, 0.22)',
  },
  powerBtnTitle: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  powerBtnTitleOn: {
    color: '#FCA5A5',
  },
  powerBtnTitleOff: {
    color: '#6EE7B7',
  },
  powerBtnSubtitle: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 1,
  },

  /* Restart to Splash Button */
  restartBtnCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    padding: 9,
    borderRadius: 11,
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
  },
  restartIconBox: {
    width: 28,
    height: 28,
    borderRadius: 7,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  restartBtnTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#E2E8F0',
  },
  restartBtnSubtitle: {
    fontSize: 9.5,
    color: '#64748B',
  },

  /* Zoom Control Row */
  zoomControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
  zoomBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
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
    width: 6.5,
    height: 78,
    backgroundColor: '#353B47',
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
    cursor: 'pointer' as any,
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

  /* Screen Off / Locked Overlay */
  screenOffOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99999,
    paddingHorizontal: 36,
  },
  screenOffContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenOffIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  screenOffTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 6,
  },
  screenOffSub: {
    fontSize: 12,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 18,
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
