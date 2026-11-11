import React, { useMemo } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { AI_COLORS, CATEGORY_META } from '../../constants/aiChatTheme';
import { FEATURED_QUESTION_IDS, FILTER_CHIPS, QUICK_QUESTIONS } from '../../data/aiChatMock';
import type { AiFilterId, AiQuickQuestion } from '../../types/aiChat';
import { AiIconView } from '../../components/AiChat/AiIconView';
import { ChatInputBar } from '../../components/AiChat/ChatInputBar';
import { HeaderIconButton } from '../../components/AiChat/HeaderIconButton';

interface Props {
  filter: AiFilterId;
  onFilterChange: (filter: AiFilterId) => void;
  onAskQuestion: (question: AiQuickQuestion) => void;
  onSend: (text: string) => void;
  onOpenHistory: () => void;
  onBack: () => void;
  topInset: number;
  bottomInset: number;
}

export const AiWelcomeView: React.FC<Props> = ({
  filter,
  onFilterChange,
  onAskQuestion,
  onSend,
  onOpenHistory,
  onBack,
  topInset,
  bottomInset,
}) => {
  const { width } = useWindowDimensions();
  const cardWidth = (width - 32 - 12) / 2;

  const questions = useMemo(() => {
    if (filter === 'all') {
      return FEATURED_QUESTION_IDS.map((id) => QUICK_QUESTIONS.find((q) => q.id === id)).filter(
        (q): q is AiQuickQuestion => !!q
      );
    }
    return QUICK_QUESTIONS.filter((q) => q.categoryId === filter).slice(0, 4);
  }, [filter]);

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topInset + 8 }]}>
        <HeaderIconButton onPress={onBack} accessibilityLabel="Orqaga">
          <Ionicons name="chevron-back" size={20} color={AI_COLORS.text} />
        </HeaderIconButton>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>AI yordamchi</Text>
          <View style={styles.onlineRow}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>Onlayn</Text>
          </View>
        </View>

        <HeaderIconButton onPress={onOpenHistory} accessibilityLabel="Suhbatlar tarixi">
          <MaterialCommunityIcons name="history" size={21} color={AI_COLORS.text} />
        </HeaderIconButton>
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Greeting */}
        <View style={styles.greeting}>
          <LinearGradient
            colors={['#3477EA', '#1A4FC0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroIcon}
          >
            <MaterialCommunityIcons name="scale-balance" size={34} color="#FFFFFF" />
          </LinearGradient>

          <Text style={styles.greetingTitle}>
            {'Assalomu alaykum!\nQanday yordam bera olaman?'}
          </Text>
          <Text style={styles.greetingSubtitle}>
            Huquqiy savolingizni yozing, hujjat yoki rasm yuboring — qonunlarga asoslangan javob
            beraman.
          </Text>
        </View>

        {/* Category chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
          style={styles.chipsScroll}
        >
          {FILTER_CHIPS.map((chip) => {
            const active = chip.id === filter;
            return (
              <TouchableOpacity
                key={chip.id}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => onFilterChange(chip.id)}
                activeOpacity={0.75}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{chip.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* FAQ grid */}
        <Text style={styles.sectionTitle}>Ko‘p beriladigan savollar</Text>
        <View style={styles.grid}>
          {questions.map((q) => {
            const meta = CATEGORY_META[q.categoryId];
            return (
              <TouchableOpacity
                key={q.id}
                style={[styles.questionCard, { width: cardWidth }]}
                activeOpacity={0.8}
                onPress={() => onAskQuestion(q)}
                accessibilityRole="button"
              >
                <View style={[styles.questionIcon, { backgroundColor: meta.bg }]}>
                  <AiIconView icon={meta.icon} size={17} color={meta.color} />
                </View>
                <Text style={styles.questionText}>{q.text}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <ChatInputBar
        placeholder="Savolingizni yozing..."
        leftIcon="add"
        onLeftPress={() =>
          Alert.alert('Hujjat yoki rasm', 'Fayl yuklash funksiyasi tez orada ishga tushadi.')
        }
        onSend={onSend}
        micWhenEmpty
        onMicPress={() => Alert.alert('Ovozli savol', 'Ovozli kiritish tez orada ishga tushadi.')}
        bottomInset={bottomInset}
        footerNote="AI javoblari ma’lumot uchun. Muhim holatlarda yuristga murojaat qiling."
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: AI_COLORS.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: AI_COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: AI_COLORS.border,
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: AI_COLORS.navy,
  },
  onlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: AI_COLORS.online,
  },
  onlineText: {
    fontSize: 12,
    color: AI_COLORS.textSecondary,
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 20,
  },
  greeting: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  heroIcon: {
    width: 68,
    height: 68,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#1A4FC0',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 6,
  },
  greetingTitle: {
    fontSize: 21,
    lineHeight: 28,
    fontWeight: '800',
    color: AI_COLORS.navy,
    textAlign: 'center',
  },
  greetingSubtitle: {
    fontSize: 13.5,
    lineHeight: 20,
    color: AI_COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  chipsScroll: {
    marginHorizontal: -16,
    marginTop: 20,
  },
  chipsRow: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: AI_COLORS.surface,
    borderWidth: 1,
    borderColor: AI_COLORS.border,
  },
  chipActive: {
    backgroundColor: AI_COLORS.primary,
    borderColor: AI_COLORS.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: AI_COLORS.navy,
    marginTop: 22,
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  questionCard: {
    minHeight: 118,
    backgroundColor: AI_COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AI_COLORS.border,
    padding: 14,
  },
  questionIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionText: {
    fontSize: 13.5,
    lineHeight: 19,
    fontWeight: '700',
    color: AI_COLORS.navy,
    marginTop: 12,
  },
});
