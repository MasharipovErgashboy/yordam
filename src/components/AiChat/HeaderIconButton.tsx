import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { AI_COLORS } from '../../constants/aiChatTheme';

interface Props {
  onPress: () => void;
  accessibilityLabel: string;
  children: React.ReactNode;
}

export const HeaderIconButton: React.FC<Props> = ({ onPress, accessibilityLabel, children }) => (
  <TouchableOpacity
    style={styles.button}
    onPress={onPress}
    activeOpacity={0.7}
    accessibilityRole="button"
    accessibilityLabel={accessibilityLabel}
    hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
  >
    {children}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: AI_COLORS.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
