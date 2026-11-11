import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AI_COLORS } from '../../constants/aiChatTheme';
import type { SavedContract } from '../../types/contractAi';

export const RISK_COLORS = {
  high: { bg: '#FDECEC', text: '#C2282D', dot: '#E5484D' },
  medium: { bg: '#FFF4DE', text: '#B45309', dot: '#F59E0B' },
  good: { bg: '#E7F7EE', text: '#15803D', dot: '#16A34A' },
};

export const FileBadge: React.FC<{ type: 'PDF' | 'DOC' }> = ({ type }) => (
  <View
    style={[
      styles.fileBadge,
      { backgroundColor: type === 'PDF' ? RISK_COLORS.high.bg : AI_COLORS.primarySoft },
    ]}
  >
    <Text
      style={[styles.fileBadgeText, { color: type === 'PDF' ? RISK_COLORS.high.text : AI_COLORS.primary }]}
    >
      {type}
    </Text>
  </View>
);

export const StatusPill: React.FC<{ status: SavedContract['status'] }> = ({ status }) => {
  const c = status.kind === 'ready' ? RISK_COLORS.good : RISK_COLORS.high;
  return (
    <View style={[styles.pill, { backgroundColor: c.bg }]}>
      <Text style={[styles.pillText, { color: c.text }]}>
        {status.kind === 'ready' ? 'Tayyor' : `${status.count} xavf`}
      </Text>
    </View>
  );
};

export const CountPill: React.FC<{ kind: keyof typeof RISK_COLORS; label: string }> = ({
  kind,
  label,
}) => (
  <View style={[styles.pill, { backgroundColor: RISK_COLORS[kind].bg }]}>
    <Text style={[styles.pillText, { color: RISK_COLORS[kind].text }]}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  fileBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  pill: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
