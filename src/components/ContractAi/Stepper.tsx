import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AI_COLORS } from '../../constants/aiChatTheme';

const STEPS = ['Turi', 'Ma’lumotlar', 'Tayyor'];

interface Props {
  current: 1 | 2 | 3;
}

export const Stepper: React.FC<Props> = ({ current }) => (
  <View style={styles.wrap} accessibilityLabel={`${STEPS.length} qadamdan ${current}-qadam`}>
    <View style={styles.bars}>
      {STEPS.map((step, i) => (
        <View key={step} style={[styles.bar, i < current && styles.barActive]} />
      ))}
    </View>
    <View style={styles.labels}>
      {STEPS.map((step, i) => (
        <Text key={step} style={[styles.label, i < current && styles.labelActive]}>
          {step}
        </Text>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    marginTop: 12,
  },
  bars: {
    flexDirection: 'row',
    gap: 6,
  },
  bar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: AI_COLORS.border,
  },
  barActive: {
    backgroundColor: AI_COLORS.primary,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  label: {
    fontSize: 11.5,
    color: AI_COLORS.textSecondary,
  },
  labelActive: {
    color: AI_COLORS.navy,
    fontWeight: '600',
  },
});
