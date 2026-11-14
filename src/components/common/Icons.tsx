import React from 'react';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { Colors } from '../../theme/colors';

interface IconProps {
  size?: number;
  color?: string;
}

export const SearchIcon: React.FC<IconProps> = ({ size = 20, color = Colors.secondaryText }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="11" cy="11" r="7" stroke={color} strokeWidth="2" />
    <Path d="M20 20L16 16" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

export const FilterIcon: React.FC<IconProps> = ({ size = 20, color = Colors.primary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M4 6H20M7 12H17M10 18H14" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

export const CloseIcon: React.FC<IconProps> = ({ size = 20, color = Colors.primary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6L18 18" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

export const ArrowLeftIcon: React.FC<IconProps> = ({ size = 22, color = Colors.primary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M15 19L8 12L15 5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const ArrowRightIcon: React.FC<IconProps> = ({ size = 16, color = Colors.primary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 18L15 12L9 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const StarIcon: React.FC<IconProps> = ({ size = 14, color = Colors.accent }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </Svg>
);

export const VerifiedCheckIcon: React.FC<IconProps> = ({ size = 16, color = Colors.primary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" fill={color} />
    <Path d="M8 12L11 15L16 9" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const BookmarkIcon: React.FC<IconProps> = ({ size = 20, color = Colors.primary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 21L12 16L5 21V5C5 3.9 5.9 3 7 3H17C18.1 3 19 3.9 19 5V21Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const PhoneIcon: React.FC<IconProps> = ({ size = 18, color = Colors.primary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M22 16.92V19.92C22 20.48 21.54 20.93 20.98 20.92C10.49 20.35 2.65 12.51 2.08 2.02C2.07 1.46 2.52 1 3.08 1H6.08C6.6 1 7.04 1.39 7.08 1.91C7.17 3.07 7.42 4.19 7.82 5.25C7.94 5.58 7.86 5.95 7.6 6.21L5.83 7.98C7.57 11.43 10.57 14.43 14.02 16.17L15.79 14.4C16.05 14.14 16.42 14.06 16.75 14.18C17.81 14.58 18.93 14.83 20.09 14.92C20.61 14.96 21 15.4 21 15.92V16.92H22Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const RouteIcon: React.FC<IconProps> = ({ size = 18, color = Colors.primary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 11L21 2L12 20L10 13L3 11Z" fill={color} stroke={color} strokeWidth="2" strokeLinejoin="round" />
  </Svg>
);

export const ClockIcon: React.FC<IconProps> = ({ size = 18, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <Path d="M12 6V12L16 14" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

export const UsersIcon: React.FC<IconProps> = ({ size = 16, color = Colors.primary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M17 21V19C17 16.79 15.21 15 13 15H5C2.79 15 1 16.79 1 19V21" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Circle cx="9" cy="7" r="4" stroke={color} strokeWidth="2" />
    <Path d="M23 21V19C22.99 17.18 21.7 15.63 20 15.13M16 3.13C17.7 3.63 18.99 5.18 19 7C19 8.82 17.7 10.37 16 10.87" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

export const NotaryStampIcon: React.FC<IconProps> = ({ size = 26, color = Colors.primary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="4" y="4" width="16" height="16" rx="3" stroke={color} strokeWidth="2" />
    <Path d="M9 9H15M9 13H15M9 17H12" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

export const FhdyoIcon: React.FC<IconProps> = ({ size = 26, color = Colors.primary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" stroke={color} strokeWidth="2" />
  </Svg>
);

export const ScalesIcon: React.FC<IconProps> = ({ size = 26, color = Colors.primary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 3V21M3 7H21M6 7L3 14H9L6 7ZM18 7L15 14H21L18 7ZM8 21H16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const BuildingIcon: React.FC<IconProps> = ({ size = 26, color = Colors.primary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 21H21M4 21V7L12 3L20 7V21M9 10H10M14 10H15M9 14H10M14 14H15M10 21V18H14V21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const MapPinIcon: React.FC<IconProps> = ({ size = 20, color = Colors.primary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 5.03 7.03 1 12 1C16.97 1 21 5.03 21 10Z" stroke={color} strokeWidth="2" />
    <Circle cx="12" cy="10" r="3" stroke={color} strokeWidth="2" />
  </Svg>
);

export const HomeTabIcon: React.FC<{ active?: boolean }> = ({ active }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path d="M3 9.5L12 3L21 9.5V20C21 20.55 20.55 21 20 21H4C3.45 21 3 20.55 3 20V9.5Z" stroke={active ? Colors.primary : Colors.secondaryText} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const MapTabIcon: React.FC<{ active?: boolean }> = ({ active }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path d="M1 6V22L8 18L16 22L23 18V2L16 6L8 2L1 6Z" stroke={active ? Colors.primary : Colors.secondaryText} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M8 2V18M16 6V22" stroke={active ? Colors.primary : Colors.secondaryText} strokeWidth="2" />
  </Svg>
);

export const TicketTabIcon: React.FC<{ active?: boolean }> = ({ active }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path d="M3 9C4.66 9 6 7.66 6 6C6 4.34 4.66 3 3 3H21C19.34 3 18 4.34 18 6C18 7.66 19.34 9 21 9V15C19.34 15 18 16.34 18 18C18 19.66 19.34 21 21 21H3C4.66 21 6 19.66 6 18C6 16.34 4.66 15 3 15V9Z" stroke={active ? Colors.primary : Colors.secondaryText} strokeWidth="2" />
  </Svg>
);
