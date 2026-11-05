import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
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
    p.play();
  });

  // Automatically transition as soon as the video finishes playing
  useEventListener(player, 'playToEnd', () => {
    handleFinish();
  });

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Pure Fullscreen Video Splash Player */}
      <VideoView
        player={player}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        nativeControls={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});
