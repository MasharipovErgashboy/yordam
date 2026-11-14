import React from 'react';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import type { AiIcon } from '../../types/aiChat';

interface Props {
  icon: AiIcon;
  size: number;
  color: string;
}

export const AiIconView: React.FC<Props> = ({ icon, size, color }) =>
  icon.family === 'mci' ? (
    <MaterialCommunityIcons name={icon.name} size={size} color={color} />
  ) : (
    <Ionicons name={icon.name} size={size} color={color} />
  );
