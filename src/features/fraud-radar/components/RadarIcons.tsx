import React from 'react';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { Colors } from '../../../theme/colors';

interface IconProps {
  size?: number;
  color?: string;
}

export const RadarTabIcon: React.FC<{ active?: boolean; size?: number }> = ({
  active,
  size = 24,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={active ? Colors.primary : Colors.secondaryText} strokeWidth="2" />
    <Circle cx="12" cy="12" r="5" stroke={active ? Colors.primary : Colors.secondaryText} strokeWidth="1.8" />
    <Circle cx="12" cy="12" r="2" fill={active ? Colors.primary : Colors.secondaryText} />
    <Path d="M12 3V12L18.5 15.5" stroke={active ? Colors.primary : Colors.secondaryText} strokeWidth="1.8" strokeLinecap="round" />
  </Svg>
);

export const ResultsTabIcon: React.FC<{ active?: boolean; size?: number }> = ({
  active,
  size = 24,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="4" y="3" width="16" height="18" rx="3" stroke={active ? Colors.primary : Colors.secondaryText} strokeWidth="2" />
    <Path d="M8 8H16M8 12H16M8 16H12" stroke={active ? Colors.primary : Colors.secondaryText} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

export const ShieldAlertIcon: React.FC<IconProps> = ({ size = 64, color = Colors.accent }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2L3 6V11.5C3 16.5 6.8 21.2 12 22.5C17.2 21.2 21 16.5 21 11.5V6L12 2Z"
      fill={Colors.amberRecBg}
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <Path d="M12 8V13M12 16H12.01" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
  </Svg>
);

export const ShieldCheckIcon: React.FC<IconProps> = ({ size = 64, color = Colors.success }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2L3 6V11.5C3 16.5 6.8 21.2 12 22.5C17.2 21.2 21 16.5 21 11.5V6L12 2Z"
      fill={Colors.successLightBg}
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <Path d="M8.5 12L11 14.5L15.5 10" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const LockIcon: React.FC<IconProps> = ({ size = 18, color = Colors.secondaryText }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="5" y="11" width="14" height="10" rx="2" stroke={color} strokeWidth="2" />
    <Path d="M8 11V7C8 4.79 9.79 3 12 3C14.21 3 16 4.79 16 7V11" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

export const UploadIcon: React.FC<IconProps> = ({ size = 28, color = Colors.primary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 15V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M17 8L12 3L7 8M12 3V15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const InfoIcon: React.FC<IconProps> = ({ size = 20, color = Colors.primary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <Path d="M12 16V12M12 8H12.01" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

export const AlertTriangleIcon: React.FC<IconProps> = ({ size = 20, color = Colors.accent }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M10.29 3.86L1.82 18C1.65 18.3 1.55 18.64 1.55 19C1.55 20.1 2.45 21 3.55 21H20.45C20.81 21 21.15 20.9 21.45 20.73C22.41 20.18 22.74 18.95 22.18 18L13.71 3.86C13.24 3.03 12.18 2.76 11.35 3.23C10.92 3.47 10.53 3.63 10.29 3.86Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M12 9V13M12 17H12.01" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);
