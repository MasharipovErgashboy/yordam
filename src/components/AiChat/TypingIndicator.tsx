import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { AI_COLORS } from '../../constants/aiChatTheme';

export const TypingIndicator: React.FC = () => {
  const [dots] = useState(() => [0, 1, 2].map(() => new Animated.Value(0.3)));

  useEffect(() => {
    const loops = dots.map((value, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 150),
          Animated.timing(value, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(value, { toValue: 0.3, duration: 300, useNativeDriver: true }),
          Animated.delay((2 - i) * 150),
        ])
      )
    );
    loops.forEach((loop) => loop.start());
    return () => loops.forEach((loop) => loop.stop());
  }, [dots]);

  return (
    <View style={styles.bubble} accessibilityLabel="AI javob yozmoqda">
      {dots.map((value, i) => (
        <Animated.View key={i} style={[styles.dot, { opacity: value }]} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  bubble: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: 5,
    backgroundColor: AI_COLORS.surface,
    borderWidth: 1,
    borderColor: AI_COLORS.border,
    borderRadius: 18,
    borderTopLeftRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: AI_COLORS.primary,
  },
});
