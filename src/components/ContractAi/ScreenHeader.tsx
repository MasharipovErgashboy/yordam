import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AI_COLORS } from '../../constants/aiChatTheme';
import { HeaderIconButton } from '../AiChat/HeaderIconButton';

interface Props {
  title: string;
  onBack: () => void;
  topInset: number;
  /** O‘ng tomondagi tugma yoki matn; bo‘lmasa joy bo‘sh qoladi (sarlavha markazda turishi uchun) */
  right?: React.ReactNode;
  children?: React.ReactNode;
}

export const ScreenHeader: React.FC<Props> = ({ title, onBack, topInset, right, children }) => (
  <View style={[styles.header, { paddingTop: topInset + 8 }]}>
    <View style={styles.row}>
      <HeaderIconButton onPress={onBack} accessibilityLabel="Orqaga">
        <Ionicons name="chevron-back" size={20} color={AI_COLORS.text} />
      </HeaderIconButton>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.right}>{right}</View>
    </View>
    {children}
  </View>
);

const styles = StyleSheet.create({
  header: {
    backgroundColor: AI_COLORS.surface,
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: AI_COLORS.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: AI_COLORS.navy,
    marginHorizontal: 8,
  },
  right: {
    minWidth: 40,
    alignItems: 'flex-end',
  },
});
