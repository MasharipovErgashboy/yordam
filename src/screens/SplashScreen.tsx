import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Platform, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEventListener } from 'expo';

interface SplashScreenProps {
  onFinish: () => void;
}

const introVideoSource = require('../../assets/videos/intro.mp4');

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const hasFinishedRef = useRef(false);

  const handleFinish = () => {
    if (!hasFinishedRef.current) {
      hasFinishedRef.current = true;
      onFinish();
    }
  };

  // Initialize video player with auto-play and no looping
  const player = useVideoPlayer(introVideoSource, (p) => {
    p.loop = false;
    if (Platform.OS === 'web') {
      p.muted = true;
    }
    p.play();
  });

  // Automatically transition as soon as the video finishes playing
  useEventListener(player, 'playToEnd', () => {
    handleFinish();
  });

  // Fallback on web in case browser blocks autoplay or playToEnd event
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const timer = setTimeout(() => {
      handleFinish();
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Pure Fullscreen Video Splash Player */}
      <VideoView
        player={player}
        style={styles.video}
        contentFit="cover"
        nativeControls={false}
      />

      {/* Web Overlay Click Area & Skip button */}
      <Pressable
        style={styles.overlayPressable}
        onPress={handleFinish}
      >
        <View style={styles.skipButton}>
          <Text style={styles.skipText}>O'tkazib yuborish →</Text>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  overlayPressable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 30,
    paddingRight: 24,
  },
  skipButton: {
    backgroundColor: 'rgba(0, 75, 134, 0.85)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  skipText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
