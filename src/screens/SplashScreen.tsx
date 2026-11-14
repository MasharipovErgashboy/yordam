import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Platform, Pressable } from 'react-native';
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

  // Dedicated Web HTML5 Video Autoplay & End Handler
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (typeof document !== 'undefined') {
        const video = document.querySelector('video');
        if (video) {
          video.muted = true;
          video.defaultMuted = true;
          video.playsInline = true;
          video.setAttribute('playsinline', '');
          video.setAttribute('webkit-playsinline', '');
          video.setAttribute('muted', '');
          video.setAttribute('autoplay', '');
          video.style.objectFit = 'cover';
          video.style.width = '100%';
          video.style.height = '100%';

          video.onended = () => {
            handleFinish();
          };

          const promise = video.play();
          if (promise !== undefined) {
            promise
              .then(() => {
                clearInterval(interval);
              })
              .catch((err) => {
                console.log('Video autoplay waiting for interaction or readyState:', err);
              });
          }
        }
      }

      if (attempts > 15) {
        clearInterval(interval);
      }
    }, 200);

    // Fallback timer on web in case browser blocks video completely
    const fallbackTimer = setTimeout(() => {
      handleFinish();
    }, 12000);

    return () => {
      clearInterval(interval);
      clearTimeout(fallbackTimer);
    };
  }, []);

  return (
    <Pressable
      style={styles.container}
      onPress={Platform.OS === 'web' ? handleFinish : undefined}
    >
      <StatusBar style="light" />

      {/* Pure Fullscreen Video Splash Player */}
      <VideoView
        player={player}
        style={styles.video}
        contentFit="cover"
        nativeControls={false}
      />
    </Pressable>
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
});
