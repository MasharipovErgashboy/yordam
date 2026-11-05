import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

interface PaginationDotsProps {
  total: number;
  activeIndex: number;
  onDotPress?: (index: number) => void;
}

export const PaginationDots: React.FC<PaginationDotsProps> = ({
  total,
  activeIndex,
  onDotPress,
}) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, index) => {
        const isActive = index === activeIndex;
        return (
          <TouchableOpacity
            key={`dot-${index}`}
            activeOpacity={0.7}
            onPress={() => onDotPress?.(index)}
            disabled={!onDotPress}
            style={[
              styles.dot,
              isActive ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
  },
  activeDot: {
    backgroundColor: '#F59E0B', // Golden yellow matching design
  },
  inactiveDot: {
    backgroundColor: '#D1D5DB', // Subtle muted grey
  },
});
