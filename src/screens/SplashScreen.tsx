import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Platform, Pressable, Text, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEventListener } from 'expo';
import { Ionicons } from '@expo/vector-icons';

interface SplashScreenProps {
  onFinish: () => void;
}

const introVideoSource = require('../../assets/videos/intro.mp4');

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const hasFinishedRef = useRef(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  const handleFinish = () => {
    if (!hasFinishedRef.current) {
      hasFinishedRef.current = true;
      onFinish();
    }
  };

  // Initialize video player with auto-play and full audio enabled
  const player = useVideoPlayer(introVideoSource, (p) => {
    p.loop = false;
    p.muted = false;
    p.volume = 1.0;
    p.play();
  });

  // Automatically transition as soon as the video finishes playing
  useEventListener(player, 'playToEnd', () => {
    handleFinish();
  });

  // Dedicated Web HTML5 Video Autoplay, Unmuted Audio & End Handler
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (typeof document !== 'undefined') {
        const video = document.querySelector('video');
        if (video) {
          video.playsInline = true;
          video.setAttribute('playsinline', '');
          video.setAttribute('webkit-playsinline', '');
          video.setAttribute('autoplay', '');
          video.style.objectFit = 'cover';
          video.style.width = '100%';
          video.style.height = '100%';

          video.onended = () => {
            handleFinish();
          };

          // Configure unmuted audio playback
          video.muted = false;
          video.defaultMuted = false;
          video.volume = 1.0;
          video.removeAttribute('muted');

          const promise = video.play();
          if (promise !== undefined) {
            promise
              .then(() => {
                video.muted = false;
                video.volume = 1.0;
                video.removeAttribute('muted');
                setIsAudioMuted(false);
                clearInterval(interval);
              })
              .catch((err) => {
                console.log('Browser blocked initial unmuted autoplay, starting muted with click-to-unmute:', err);
                video.muted = true;
                video.play().catch(() => {});
                setIsAudioMuted(true);

                // Unmute immediately on the first user interaction anywhere
                const enableSound = () => {
                  video.muted = false;
                  video.volume = 1.0;
                  video.removeAttribute('muted');
                  setIsAudioMuted(false);
                  window.removeEventListener('pointerdown', enableSound);
                  window.removeEventListener('click', enableSound);
                  window.removeEventListener('keydown', enableSound);
                };
                window.addEventListener('pointerdown', enableSound, { once: true });
                window.addEventListener('click', enableSound, { once: true });
                window.addEventListener('keydown', enableSound, { once: true });
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

  const handleContainerPress = () => {
    if (Platform.OS === 'web') {
      if (typeof document !== 'undefined') {
        const video = document.querySelector('video');
        if (video && video.muted) {
          video.muted = false;
          video.volume = 1.0;
          video.removeAttribute('muted');
          setIsAudioMuted(false);
        }
      }
    }
  };

  const handleUnmuteBadgePress = () => {
    if (typeof document !== 'undefined') {
      const video = document.querySelector('video');
      if (video) {
        video.muted = false;
        video.volume = 1.0;
        video.removeAttribute('muted');
        setIsAudioMuted(false);
      }
    }
  };

  return (
    <Pressable
      style={styles.container}
      onPress={handleContainerPress}
    >
      <StatusBar style="light" />

      {/* Pure Fullscreen Video Splash Player */}
      <VideoView
        player={player}
        style={styles.video}
        contentFit="cover"
        nativeControls={false}
      />

      {/* Unmute floating pill on web if browser restricted audio */}
      {Platform.OS === 'web' && isAudioMuted && (
        <TouchableOpacity
          style={styles.unmuteBadge}
          onPress={handleUnmuteBadgePress}
          activeOpacity={0.8}
        >
          <Ionicons name="volume-mute" size={16} color="#FFFFFF" />
          <Text style={styles.unmuteText}>Ovozni yoqish</Text>
        </TouchableOpacity>
      )}
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
  unmuteBadge: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
    zIndex: 100,
  },
  unmuteText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
