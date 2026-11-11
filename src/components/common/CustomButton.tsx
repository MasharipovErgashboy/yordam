import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  StyleProp,
} from 'react-native';
import { Colors } from '../../theme/colors';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger-outline' | 'accent';
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  loading?: boolean;
  disabled?: boolean;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  icon,
  style,
  textStyle,
  loading = false,
  disabled = false,
}) => {
  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryBtn;
      case 'accent':
        return styles.accentBtn;
      case 'secondary':
        return styles.secondaryBtn;
      case 'outline':
        return styles.outlineBtn;
      case 'danger-outline':
        return styles.dangerOutlineBtn;
      default:
        return styles.primaryBtn;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryText;
      case 'accent':
        return styles.accentText;
      case 'secondary':
        return styles.secondaryText;
      case 'outline':
        return styles.outlineText;
      case 'danger-outline':
        return styles.dangerOutlineText;
      default:
        return styles.primaryText;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.baseBtn, getButtonStyle(), disabled && styles.disabledBtn, style]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' || variant === 'accent' ? Colors.surface : Colors.primary}
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text style={[styles.baseText, getTextStyle(), textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseBtn: {
    height: 48,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    gap: 8,
  },
  baseText: {
    fontSize: 15,
    fontWeight: '700',
  },
  primaryBtn: {
    backgroundColor: Colors.primary,
  },
  primaryText: {
    color: Colors.surface,
  },
  accentBtn: {
    backgroundColor: Colors.accent,
  },
  accentText: {
    color: Colors.surface,
  },
  secondaryBtn: {
    backgroundColor: Colors.lightBlueBg,
  },
  secondaryText: {
    color: Colors.primary,
  },
  outlineBtn: {
    backgroundColor: Colors.surface,
    borderWidth: 1.2,
    borderColor: Colors.borderNormal,
  },
  outlineText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  dangerOutlineBtn: {
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.danger,
  },
  dangerOutlineText: {
    color: Colors.danger,
    fontWeight: '700',
  },
  disabledBtn: {
    opacity: 0.5,
  },
});
