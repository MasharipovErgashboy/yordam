import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { Colors } from '../../theme/colors';

interface BadgeProps {
  label: string;
  variant?: 'blue' | 'green' | 'yellow' | 'red' | 'gray';
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'blue',
  icon,
  style,
  textStyle,
}) => {
  const getBadgeStyle = () => {
    switch (variant) {
      case 'green':
        return { bg: Colors.successLightBg, text: Colors.success };
      case 'yellow':
        return { bg: Colors.amberRecBg, text: '#D97706' };
      case 'red':
        return { bg: Colors.dangerLightBg, text: Colors.danger };
      case 'gray':
        return { bg: Colors.disabledInputBg, text: Colors.secondaryText };
      case 'blue':
      default:
        return { bg: Colors.lightBlueBg, text: Colors.primary };
    }
  };

  const current = getBadgeStyle();

  return (
    <View style={[styles.container, { backgroundColor: current.bg }, style]}>
      {icon && <View style={styles.iconWrapper}>{icon}</View>}
      <Text style={[styles.text, { color: current.text }, textStyle]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  iconWrapper: {
    marginRight: 4,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
  },
});
