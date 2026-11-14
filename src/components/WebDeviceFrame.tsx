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

  // Phone starts in OFF state by default on web desktop as requested by user
  const [isPowerOn, setIsPowerOn] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');
  const isDarkTheme = themeMode === 'dark';

  const handleToggleTheme = () => {
    setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

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

  // Inject CSS animations for modern floating cyber squares on Web
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;

    const STYLE_ID = 'yordam-web-ambient-styles';
    if (!document.getElementById(STYLE_ID)) {
      const styleEl = document.createElement('style');
      styleEl.id = STYLE_ID;
      styleEl.innerHTML = `
        @keyframes floatSquare1 {
          0%, 100% { transform: translateY(0px) rotate(12deg) scale(1); opacity: 0.55; }
          50% { transform: translateY(-38px) rotate(24deg) scale(1.08); opacity: 0.9; }
        }
        @keyframes floatSquare2 {
          0%, 100% { transform: translateY(0px) rotate(-15deg) scale(1); opacity: 0.45; }
          50% { transform: translateY(42px) rotate(-28deg) scale(0.94); opacity: 0.85; }
        }
        @keyframes floatSquare3 {
          0%, 100% { transform: translate(0px, 0px) rotate(25deg); opacity: 0.5; }
          50% { transform: translate(25px, -30px) rotate(12deg); opacity: 0.95; }
        }
        @keyframes floatSquare4 {
          0%, 100% { transform: translate(0px, 0px) rotate(-10deg); opacity: 0.4; }
          50% { transform: translate(-30px, 35px) rotate(8deg); opacity: 0.85; }
        }
        @keyframes floatSquare5 {
          0%, 100% { transform: translateY(0px) rotate(18deg); opacity: 0.5; }
          50% { transform: translateY(-45px) rotate(8deg); opacity: 0.9; }
        }
        @keyframes floatSquare6 {
          0%, 100% { transform: translateY(0px) rotate(-20deg); opacity: 0.45; }
          50% { transform: translateY(35px) rotate(-6deg); opacity: 0.85; }
        }
        @keyframes floatSquare7 {
          0%, 100% { transform: translate(0px, 0px) rotate(45deg); opacity: 0.35; }
          50% { transform: translate(22px, -24px) rotate(65deg); opacity: 0.75; }
        }
        @keyframes floatSquare8 {
          0%, 100% { transform: translate(0px, 0px) rotate(30deg); opacity: 0.4; }
          50% { transform: translate(-25px, 25px) rotate(15deg); opacity: 0.8; }
        }

        /* Enforce Modal dialogs and alerts to stay strictly inside the 430x932 iPhone chassis */
        #yordam-phone-screen {
          contain: paint layout;
        }
        #yordam-phone-screen [aria-modal="true"],
        #yordam-phone-screen [role="dialog"] {
          position: absolute !important;
          top: 0px !important;
          left: 0px !important;
          right: 0px !important;
          bottom: 0px !important;
          width: 100% !important;
          height: 100% !important;
          max-width: 430px !important;
          max-height: 932px !important;
          border-radius: 44px !important;
          overflow: hidden !important;
        }
      `;
      document.head.appendChild(styleEl);
    }
  }, []);

  // Reparent all React Native Web Modals/Portals inside the iPhone chassis so they never spill outside
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;

    // Safely wrap document.body.removeChild so removing reparented modal portal nodes never throws
    const originalRemoveChild = document.body.removeChild.bind(document.body);
    document.body.removeChild = function <T extends Node>(child: T): T {
      if (child.parentNode === document.body) {
        return originalRemoveChild(child);
      } else if (child.parentNode) {
        return child.parentNode.removeChild(child) as T;
      }
      return child;
    };

    const captureModalNode = (node: Node) => {
      if (!(node instanceof HTMLElement)) return;
      const phoneScreen = document.getElementById('yordam-phone-screen');
      if (!phoneScreen) return;

      // Check if this node is a modal portal or contains a modal
      const isModal =
        node.getAttribute('aria-modal') === 'true' ||
        node.getAttribute('role') === 'dialog' ||
        node.querySelector('[aria-modal="true"]') ||
        node.querySelector('[role="dialog"]');

      if (isModal) {
        if (node.parentNode !== phoneScreen) {
          node.style.position = 'absolute';
          node.style.top = '0px';
          node.style.left = '0px';
          node.style.right = '0px';
          node.style.bottom = '0px';
          node.style.width = '100%';
          node.style.height = '100%';
          node.style.zIndex = '9999';
          node.style.pointerEvents = 'auto';
          phoneScreen.appendChild(node);
        }
      } else {
        // Child content might be portaled asynchronously by React
        const childObserver = new MutationObserver(() => {
          if (
            node.getAttribute('aria-modal') === 'true' ||
            node.getAttribute('role') === 'dialog' ||
            node.querySelector('[aria-modal="true"]') ||
            node.querySelector('[role="dialog"]')
          ) {
            if (node.parentNode !== phoneScreen) {
              node.style.position = 'absolute';
              node.style.top = '0px';
              node.style.left = '0px';
              node.style.right = '0px';
              node.style.bottom = '0px';
              node.style.width = '100%';
              node.style.height = '100%';
              node.style.zIndex = '9999';
              node.style.pointerEvents = 'auto';
              phoneScreen.appendChild(node);
            }
            childObserver.disconnect();
          }
        });
        childObserver.observe(node, { childList: true, subtree: true });
        setTimeout(() => childObserver.disconnect(), 2000);
      }
    };

    const bodyObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const addedNode of mutation.addedNodes) {
          if (addedNode.parentNode === document.body) {
            captureModalNode(addedNode);
          }
        }
      }
    });

    bodyObserver.observe(document.body, { childList: true });

    // Check any existing modals on mount
    Array.from(document.body.children).forEach((child) => {
      if (child.id !== 'root' && child.tagName === 'DIV') {
        captureModalNode(child);
      }
    });

    return () => {
      bodyObserver.disconnect();
      document.body.removeChild = originalRemoveChild;
    };
  }, []);

  // Calculate auto-fit scale so the whole iPhone fits on the user's screen without scrolling
  const computedScale = useMemo(() => {
    if (zoomLevel !== 'auto') {
      return zoomLevel;
    }
    // iPhone total frame height is 958px + 60px margin = ~1018px
    const availableHeight = windowDimensions.height - 60;
    const availableWidth = windowDimensions.width - 160; // Account for slim left dock
    const scaleY = availableHeight / 970;
    const scaleX = availableWidth / 480;
    const scale = Math.min(1, Math.min(scaleX, scaleY));
    return Math.max(0.55, Math.min(1, scale));
  }, [windowDimensions, zoomLevel]);

  // Prime Web Audio and Unmute on direct user gesture
  const triggerAudioActivation = () => {
    if (typeof window !== 'undefined') {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          if (ctx.state === 'suspended') {
            ctx.resume();
          }
        }
      } catch (_) {}

      if (typeof document !== 'undefined') {
        document.querySelectorAll('video, audio').forEach((el) => {
          const media = el as HTMLMediaElement;
          media.muted = false;
          media.volume = 1.0;
          media.removeAttribute('muted');
        });
      }
    }
  };

  // Turn on handler: powers on and immediately restarts app from splash video
  const handleTurnOn = () => {
    triggerAudioActivation();
    setIsPowerOn(true);
    if (onRestartApp) {
      onRestartApp();
    }
  };

  // Toggle power handler: if turning on, restart app fresh
  const handleTogglePower = () => {
    if (!isPowerOn) {
      handleTurnOn();
    } else {
      setIsPowerOn(false);
    }
  };

  // Toggle audio mute/unmute
  const handleToggleSound = () => {
    setIsAudioMuted((prev) => {
      const next = !prev;
      if (typeof document !== 'undefined') {
        document.querySelectorAll('video, audio').forEach((el) => {
          const media = el as HTMLMediaElement;
          media.muted = next;
          if (!next) {
            media.volume = 1.0;
            media.removeAttribute('muted');
          }
        });
      }
      return next;
    });
  };

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
    <View
      style={[
        styles.desktopBackdrop,
        isDarkTheme ? styles.desktopBackdropDark : styles.desktopBackdropLight,
      ]}
    >
      {/* Dynamic Animated Geometric Grid Background */}
      <View
        style={[
          styles.gridBackgroundLayer,
          {
            backgroundImage: isDarkTheme
              ? 'linear-gradient(to right, rgba(56, 189, 248, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(56, 189, 248, 0.05) 1px, transparent 1px)'
              : 'linear-gradient(to right, rgba(2, 132, 199, 0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(2, 132, 199, 0.07) 1px, transparent 1px)',
          } as any,
        ]}
      />

      {/* Modern Ambient Radial Glow Orbs */}
      <View
        style={[
          styles.ambientOrb,
          {
            top: '18%',
            left: '18%',
            backgroundColor: isDarkTheme ? 'rgba(2, 132, 199, 0.16)' : 'rgba(56, 189, 248, 0.18)',
          },
        ]}
      />
      <View
        style={[
          styles.ambientOrb,
          {
            bottom: '12%',
            right: '18%',
            backgroundColor: isDarkTheme ? 'rgba(99, 102, 241, 0.14)' : 'rgba(168, 85, 247, 0.12)',
          },
        ]}
      />

      {/* Floating Animated Futuristic Glass Squares (Kvadratlar) */}
      <View style={styles.floatingSquaresContainer} pointerEvents="none">
        {/* Square 1: Top-Left */}
        <View
          style={[
            styles.floatingSquareBase,
            isDarkTheme ? styles.floatingSquareDark : styles.floatingSquareLight,
            {
              top: '8%',
              left: '5%',
              width: 96,
              height: 96,
              animation: 'floatSquare1 14s ease-in-out infinite',
            } as any,
          ]}
        >
          <View style={[styles.innerSquareDot, { backgroundColor: isDarkTheme ? '#38BDF8' : '#0284C7' }]} />
          <View style={[styles.squareMiniCorner, { borderColor: isDarkTheme ? 'rgba(56,189,248,0.45)' : 'rgba(2,132,199,0.45)' }]} />
        </View>

        {/* Square 2: Top-Right */}
        <View
          style={[
            styles.floatingSquareBase,
            isDarkTheme ? styles.floatingSquareDark : styles.floatingSquareLight,
            {
              top: '11%',
              right: '6%',
              width: 120,
              height: 120,
              animation: 'floatSquare2 18s ease-in-out infinite',
            } as any,
          ]}
        >
          <View style={[styles.innerSquareDot, { backgroundColor: isDarkTheme ? '#A855F7' : '#9333EA' }]} />
          <View style={[styles.squareMiniCorner, { borderColor: isDarkTheme ? 'rgba(168,85,247,0.45)' : 'rgba(147,51,234,0.45)' }]} />
        </View>

        {/* Square 3: Mid-Left */}
        <View
          style={[
            styles.floatingSquareBase,
            isDarkTheme ? styles.floatingSquareDark : styles.floatingSquareLight,
            {
              top: '42%',
              left: '7%',
              width: 72,
              height: 72,
              animation: 'floatSquare3 13s ease-in-out infinite',
            } as any,
          ]}
        >
          <View style={[styles.innerSquareDot, { backgroundColor: isDarkTheme ? '#10B981' : '#059669' }]} />
        </View>

        {/* Square 4: Mid-Right */}
        <View
          style={[
            styles.floatingSquareBase,
            isDarkTheme ? styles.floatingSquareDark : styles.floatingSquareLight,
            {
              top: '46%',
              right: '8%',
              width: 86,
              height: 86,
              animation: 'floatSquare4 16s ease-in-out infinite',
            } as any,
          ]}
        >
          <View style={[styles.innerSquareDot, { backgroundColor: isDarkTheme ? '#38BDF8' : '#0284C7' }]} />
        </View>

        {/* Square 5: Bottom-Left */}
        <View
          style={[
            styles.floatingSquareBase,
            isDarkTheme ? styles.floatingSquareDark : styles.floatingSquareLight,
            {
              bottom: '10%',
              left: '6%',
              width: 110,
              height: 110,
              animation: 'floatSquare5 19s ease-in-out infinite',
            } as any,
          ]}
        >
          <View style={[styles.innerSquareDot, { backgroundColor: isDarkTheme ? '#F59E0B' : '#D97706' }]} />
          <View style={[styles.squareMiniCorner, { borderColor: isDarkTheme ? 'rgba(245,158,11,0.45)' : 'rgba(217,119,6,0.45)' }]} />
        </View>

        {/* Square 6: Bottom-Right */}
        <View
          style={[
            styles.floatingSquareBase,
            isDarkTheme ? styles.floatingSquareDark : styles.floatingSquareLight,
            {
              bottom: '8%',
              right: '6%',
              width: 90,
              height: 90,
              animation: 'floatSquare6 15s ease-in-out infinite',
            } as any,
          ]}
        >
          <View style={[styles.innerSquareDot, { backgroundColor: isDarkTheme ? '#38BDF8' : '#0284C7' }]} />
        </View>

        {/* Square 7: Top-Center Parallax */}
        <View
          style={[
            styles.floatingSquareBase,
            isDarkTheme ? styles.floatingSquareDark : styles.floatingSquareLight,
            {
              top: '5%',
              right: '25%',
              width: 58,
              height: 58,
              animation: 'floatSquare7 12s ease-in-out infinite',
            } as any,
          ]}
        />

        {/* Square 8: Bottom-Center Parallax */}
        <View
          style={[
            styles.floatingSquareBase,
            isDarkTheme ? styles.floatingSquareDark : styles.floatingSquareLight,
            {
              bottom: '6%',
              left: '24%',
              width: 64,
              height: 64,
              animation: 'floatSquare8 14s ease-in-out infinite',
            } as any,
          ]}
        />
      </View>

      {/* Left Elongated Minimalist Control Dock (Slim vertical capsule, icon-only) */}
      <View
        style={[
          styles.desktopDock,
          isDarkTheme ? styles.desktopDockDark : styles.desktopDockLight,
        ]}
      >
        {/* Top App Logo & Live Status Indicator */}
        <View style={styles.dockLogoWrap}>
          <Image source={logoImage} style={styles.dockLogo} resizeMode="cover" />
          <View style={styles.dockLiveDot} />
        </View>

        {/* Divider */}
        <View style={[styles.dockDivider, isDarkTheme ? styles.dockDividerDark : styles.dockDividerLight]} />

        {/* Power On / Off Icon Button */}
        <TouchableOpacity
          style={[
            styles.dockBtn,
            styles.dockPowerBtn,
            isPowerOn ? styles.dockPowerBtnOn : styles.dockPowerBtnOff,
          ]}
          onPress={handleTogglePower}
          activeOpacity={0.75}
          accessibilityLabel={isPowerOn ? "Telefonni o‘chirish" : "Telefonni yoqish"}
        >
          <Ionicons
            name="power"
            size={20}
            color={isPowerOn ? '#EF4444' : '#10B981'}
          />
        </TouchableOpacity>

        {/* Restart Icon Button (Always turns on & replays splash video) */}
        {onRestartApp && (
          <TouchableOpacity
            style={[styles.dockBtn, styles.dockRestartBtn]}
            onPress={handleTurnOn}
            activeOpacity={0.75}
            accessibilityLabel="Qayta ishga tushirish"
          >
            <Ionicons name="reload" size={17} color="#38BDF8" />
          </TouchableOpacity>
        )}

        {/* Audio Mute / Unmute Button */}
        <TouchableOpacity
          style={[
            styles.dockBtn,
            styles.dockSoundBtn,
            isAudioMuted ? styles.dockSoundBtnMuted : styles.dockSoundBtnActive,
          ]}
          onPress={handleToggleSound}
          activeOpacity={0.75}
          accessibilityLabel={isAudioMuted ? "Ovozni yoqish" : "Ovozni o‘chirish"}
        >
          <Ionicons
            name={isAudioMuted ? "volume-mute" : "volume-high"}
            size={18}
            color={isAudioMuted ? "#EF4444" : "#10B981"}
          />
        </TouchableOpacity>

        {/* Theme Toggle (Dark / Light Mode) Button */}
        <TouchableOpacity
          style={[
            styles.dockBtn,
            styles.dockThemeBtn,
            isDarkTheme ? styles.dockThemeBtnDark : styles.dockThemeBtnLight,
          ]}
          onPress={handleToggleTheme}
          activeOpacity={0.75}
          accessibilityLabel={isDarkTheme ? "Yorug‘ rejimga o‘tish" : "Qorong‘i rejimga o‘tish"}
        >
          <Ionicons
            name={isDarkTheme ? "sunny" : "moon"}
            size={18}
            color={isDarkTheme ? "#FBBF24" : "#6366F1"}
          />
        </TouchableOpacity>

        {/* Divider */}
        <View style={[styles.dockDivider, isDarkTheme ? styles.dockDividerDark : styles.dockDividerLight]} />

        {/* Zoom Controls: +, Fit, - */}
        <TouchableOpacity
          style={[styles.dockBtn, isDarkTheme ? styles.dockZoomBtnDark : styles.dockZoomBtnLight]}
          onPress={() => setZoomLevel((prev) => (prev === 'auto' ? 1.0 : Math.min(1.1, prev + 0.1)))}
          activeOpacity={0.7}
          accessibilityLabel="Kattalashtirish"
        >
          <Ionicons name="add" size={18} color={isDarkTheme ? "#E2E8F0" : "#334155"} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.dockFitBadge, zoomLevel === 'auto' && styles.dockFitBadgeActive]}
          onPress={() => setZoomLevel('auto')}
          activeOpacity={0.7}
          accessibilityLabel="Avtomatik o‘lcham (Fit)"
        >
          <Text style={[styles.dockFitText, isDarkTheme ? styles.dockFitTextDark : styles.dockFitTextLight]}>
            {zoomLevel === 'auto' ? `${Math.round(computedScale * 100)}%` : `${Math.round(zoomLevel * 100)}%`}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.dockBtn, isDarkTheme ? styles.dockZoomBtnDark : styles.dockZoomBtnLight]}
          onPress={() => setZoomLevel((prev) => (prev === 'auto' ? 0.8 : Math.max(0.5, prev - 0.1)))}
          activeOpacity={0.7}
          accessibilityLabel="Kichraytirish"
        >
          <Ionicons name="remove" size={18} color={isDarkTheme ? "#E2E8F0" : "#334155"} />
        </TouchableOpacity>
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
            isDarkTheme ? styles.phoneChassisDark : styles.phoneChassisLight,
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
            onPress={handleTogglePower}
            accessibilityLabel="Fizik quvvat tugmasi"
          />

          {/* Inner Display Screen with 44px border radius */}
          <View style={styles.phoneScreen} nativeID="yordam-phone-screen">
            {/* Native App Viewport (430 x 932) - mounted only when power is ON for fresh boot */}
            {isPowerOn ? (
              <View style={styles.appViewport}>{children}</View>
            ) : (
              <TouchableOpacity
                style={styles.screenOffOverlay}
                activeOpacity={0.95}
                onPress={handleTurnOn}
              >
                <View style={styles.screenOffContent}>
                  <View style={styles.screenOffIconCircle}>
                    <Ionicons name="power" size={28} color="#10B981" />
                  </View>
                  <Text style={styles.screenOffTitle}>Telefon o‘chirilgan</Text>
                  <Text style={styles.screenOffSub}>
                    Yoqish uchun ekranga yoki chap paneldagi tugmaga bosing
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
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  desktopBackdropDark: {
    backgroundColor: '#060A14',
  },
  desktopBackdropLight: {
    backgroundColor: '#F1F5F9',
  },

  /* Dynamic Animated Background Layers */
  gridBackgroundLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundSize: '50px 50px' as any,
    pointerEvents: 'none',
    zIndex: 0,
  },
  ambientOrb: {
    position: 'absolute',
    width: 580,
    height: 580,
    borderRadius: 290,
    filter: 'blur(120px)' as any,
    pointerEvents: 'none',
    zIndex: 0,
  },

  /* Floating Animated Cyber Glass Squares */
  floatingSquaresContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    zIndex: 1,
  },
  floatingSquareBase: {
    position: 'absolute',
    borderRadius: 22,
    backdropFilter: 'blur(16px)' as any,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingSquareDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1.5,
    borderColor: 'rgba(56, 189, 248, 0.22)',
    boxShadow:
      '0 14px 40px 0 rgba(0, 0, 0, 0.45), inset 0 0 20px rgba(56, 189, 248, 0.08)' as any,
  },
  floatingSquareLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.78)',
    borderWidth: 1.5,
    borderColor: 'rgba(2, 132, 199, 0.22)',
    boxShadow:
      '0 14px 35px 0 rgba(15, 23, 42, 0.08), inset 0 0 15px rgba(255, 255, 255, 0.85)' as any,
  },
  innerSquareDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    opacity: 0.8,
  },
  squareMiniCorner: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderTopWidth: 2,
    borderRightWidth: 2,
  },

  /* Left Elongated Minimalist Control Dock (Slim vertical capsule, icon-only) */
  desktopDock: {
    position: 'absolute',
    left: 36,
    top: '50%',
    transform: [{ translateY: -205 }],
    width: 66,
    borderRadius: 33,
    borderWidth: 1.5,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    backdropFilter: 'blur(24px)' as any,
  },
  desktopDockDark: {
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
    boxShadow:
      '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 25px rgba(2, 132, 199, 0.15)' as any,
  },
  desktopDockLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderColor: 'rgba(203, 213, 225, 0.85)',
    boxShadow:
      '0 25px 50px -12px rgba(15, 23, 42, 0.15), 0 0 30px rgba(2, 132, 199, 0.12)' as any,
  },
  dockLogoWrap: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dockLogo: {
    width: 36,
    height: 36,
    borderRadius: 10,
  },
  dockLiveDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    borderWidth: 1.5,
    borderColor: '#0F172A',
  },
  dockDivider: {
    width: 28,
    height: 1,
    marginVertical: 10,
  },
  dockDividerDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  dockDividerLight: {
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
  },

  /* Circular Dock Buttons */
  dockBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 3,
  },
  dockPowerBtn: {
    borderWidth: 1.5,
  },
  dockPowerBtnOn: {
    backgroundColor: 'rgba(239, 68, 68, 0.14)',
    borderColor: 'rgba(239, 68, 68, 0.38)',
  },
  dockPowerBtnOff: {
    backgroundColor: 'rgba(16, 185, 129, 0.18)',
    borderColor: 'rgba(16, 185, 129, 0.5)',
  },
  dockRestartBtn: {
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.28)',
  },
  dockSoundBtn: {
    borderWidth: 1,
  },
  dockSoundBtnActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  dockSoundBtnMuted: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  dockThemeBtn: {
    borderWidth: 1,
  },
  dockThemeBtnDark: {
    backgroundColor: 'rgba(251, 191, 36, 0.12)',
    borderColor: 'rgba(251, 191, 36, 0.3)',
  },
  dockThemeBtnLight: {
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  dockZoomBtnDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  dockZoomBtnLight: {
    backgroundColor: 'rgba(241, 245, 249, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(203, 213, 225, 0.8)',
  },
  dockFitBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 6,
    marginVertical: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  dockFitBadgeActive: {
    backgroundColor: 'rgba(2, 132, 199, 0.25)',
  },
  dockFitText: {
    fontSize: 9.5,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  dockFitTextDark: {
    color: '#94A3B8',
  },
  dockFitTextLight: {
    color: '#0369A1',
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
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    transformOrigin: 'center center' as any,
  },
  phoneChassisDark: {
    boxShadow:
      '0 30px 80px -15px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.12), 0 0 40px rgba(2, 132, 199, 0.18)' as any,
  },
  phoneChassisLight: {
    boxShadow:
      '0 35px 85px -15px rgba(15, 23, 42, 0.28), 0 0 0 1px rgba(0, 0, 0, 0.08), 0 0 50px rgba(2, 132, 199, 0.14)' as any,
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
