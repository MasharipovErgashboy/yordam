import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AI_COLORS } from '../../constants/aiChatTheme';
import { CONTRACT_TEMPLATES } from '../../data/contractAiMock';
import type { ContractTemplateId } from '../../types/contractAi';
import { AiIconView } from '../../components/AiChat/AiIconView';
import { ScreenHeader } from '../../components/ContractAi/ScreenHeader';
import { Stepper } from '../../components/ContractAi/Stepper';

interface Props {
  onSelect: (id: ContractTemplateId) => void;
  onBack: () => void;
  topInset: number;
  bottomInset: number;
}

export const ContractTypeView: React.FC<Props> = ({ onSelect, onBack, topInset, bottomInset }) => (
  <View style={styles.root}>
    <ScreenHeader
      title="Shartnoma turi"
      onBack={onBack}
      topInset={topInset}
      right={<Text style={styles.stepCount}>1/3</Text>}
    >
      <Stepper current={1} />
    </ScreenHeader>

    <ScrollView
      contentContainerStyle={[styles.content, { paddingBottom: bottomInset + 24 }]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.hint}>Qanday shartnoma tuzmoqchisiz?</Text>
      {CONTRACT_TEMPLATES.map((t) => (
        <TouchableOpacity
          key={t.id}
          style={styles.card}
          activeOpacity={0.8}
          onPress={() => onSelect(t.id)}
          accessibilityRole="button"
        >
          <View style={styles.icon}>
            <AiIconView icon={t.icon} size={20} color={AI_COLORS.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{t.formTitle}</Text>
            <Text style={styles.desc}>{t.description}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={AI_COLORS.placeholder} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: AI_COLORS.bg,
  },
  stepCount: {
    fontSize: 13,
    fontWeight: '600',
    color: AI_COLORS.textSecondary,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  hint: {
    fontSize: 15,
    fontWeight: '700',
    color: AI_COLORS.navy,
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: AI_COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: AI_COLORS.border,
    padding: 14,
    marginBottom: 10,
  },
  icon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: AI_COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: AI_COLORS.navy,
  },
  desc: {
    fontSize: 12,
    color: AI_COLORS.textSecondary,
    marginTop: 2,
  },
});
