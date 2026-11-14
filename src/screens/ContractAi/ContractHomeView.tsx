import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { AI_COLORS } from '../../constants/aiChatTheme';
import { CONTRACT_TEMPLATES, HOME_TEMPLATE_COUNT } from '../../data/contractAiMock';
import type { ContractTemplateId, SavedContract } from '../../types/contractAi';
import { AiIconView } from '../../components/AiChat/AiIconView';
import { HeaderIconButton } from '../../components/AiChat/HeaderIconButton';
import { ScreenHeader } from '../../components/ContractAi/ScreenHeader';
import { FileBadge, StatusPill } from '../../components/ContractAi/Badges';

interface Props {
  saved: SavedContract[];
  onCreate: () => void;
  onReview: () => void;
  onOpenTemplate: (id: ContractTemplateId) => void;
  onSeeAllTemplates: () => void;
  onOpenSaved: (item: SavedContract) => void;
  onHelp: () => void;
  onBack: () => void;
  topInset: number;
  bottomInset: number;
}

export const ContractHomeView: React.FC<Props> = ({
  saved,
  onCreate,
  onReview,
  onOpenTemplate,
  onSeeAllTemplates,
  onOpenSaved,
  onHelp,
  onBack,
  topInset,
  bottomInset,
}) => {
  const { width } = useWindowDimensions();
  const tileWidth = (width - 32 - 20) / 3;

  return (
    <View style={styles.root}>
      <ScreenHeader
        title="Shartnoma AI"
        onBack={onBack}
        topInset={topInset}
        right={
          <HeaderIconButton onPress={onHelp} accessibilityLabel="Yordam">
            <Ionicons name="help-circle-outline" size={21} color={AI_COLORS.text} />
          </HeaderIconButton>
        }
      />

      <ScrollView
        style={styles.body}
        contentContainerStyle={[styles.bodyContent, { paddingBottom: bottomInset + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Asosiy amallar */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionFlex}
            activeOpacity={0.9}
            onPress={onCreate}
            accessibilityRole="button"
          >
            <LinearGradient
              colors={['#3477EA', '#1A4FC0']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.actionCard, styles.actionCardPrimary]}
            >
              <View style={[styles.actionIcon, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
                <Ionicons name="create-outline" size={20} color="#FFFFFF" />
              </View>
              <Text style={[styles.actionTitle, { color: '#FFFFFF' }]}>Shartnoma tuzish</Text>
              <Text style={[styles.actionSubtitle, { color: '#DCE7FB' }]}>
                AI yordamida 1 daqiqada tayyorlang
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionFlex, styles.actionCard, styles.actionCardSecondary]}
            activeOpacity={0.85}
            onPress={onReview}
            accessibilityRole="button"
          >
            <View style={[styles.actionIcon, { backgroundColor: AI_COLORS.amberSoft }]}>
              <Ionicons name="shield-checkmark-outline" size={20} color={AI_COLORS.amber} />
            </View>
            <Text style={styles.actionTitle}>Shartnomani tekshirish</Text>
            <Text style={styles.actionSubtitle}>Xavfli bandlarni toping</Text>
          </TouchableOpacity>
        </View>

        {/* Shablonlar */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Shablonlar</Text>
          <TouchableOpacity onPress={onSeeAllTemplates} accessibilityRole="button">
            <Text style={styles.seeAll}>Barchasini ko‘rish ({CONTRACT_TEMPLATES.length}) ›</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.grid}>
          {CONTRACT_TEMPLATES.slice(0, HOME_TEMPLATE_COUNT).map((t) => (
            <TouchableOpacity
              key={t.id}
              style={[styles.tile, { width: tileWidth }]}
              activeOpacity={0.8}
              onPress={() => onOpenTemplate(t.id)}
              accessibilityRole="button"
              accessibilityLabel={t.formTitle}
            >
              <View style={styles.tileIcon}>
                <AiIconView icon={t.icon} size={19} color={AI_COLORS.primary} />
              </View>
              <Text style={styles.tileLabel}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Mening shartnomalarim */}
        <Text style={[styles.sectionTitle, { marginTop: 22, marginBottom: 12 }]}>
          Mening shartnomalarim
        </Text>
        {saved.length === 0 ? (
          <Text style={styles.emptyText}>Hali shartnoma yo‘q</Text>
        ) : (
          saved.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.savedCard}
              activeOpacity={0.8}
              onPress={() => onOpenSaved(item)}
              accessibilityRole="button"
            >
              <FileBadge type={item.fileType} />
              <View style={{ flex: 1 }}>
                <Text style={styles.savedTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.savedMeta}>{item.meta}</Text>
              </View>
              <StatusPill status={item.status} />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: AI_COLORS.bg,
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionFlex: {
    flex: 1,
  },
  actionCard: {
    minHeight: 138,
    borderRadius: 18,
    padding: 14,
  },
  actionCardPrimary: {
    flex: 1,
    shadowColor: '#1A4FC0',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
  actionCardSecondary: {
    backgroundColor: AI_COLORS.surface,
    borderWidth: 1,
    borderColor: AI_COLORS.border,
  },
  actionIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 'auto',
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: AI_COLORS.navy,
    marginTop: 14,
  },
  actionSubtitle: {
    fontSize: 12,
    lineHeight: 16,
    color: AI_COLORS.textSecondary,
    marginTop: 3,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 22,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: AI_COLORS.navy,
  },
  seeAll: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#B45309',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tile: {
    backgroundColor: AI_COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: AI_COLORS.border,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 8,
  },
  tileIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: AI_COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: AI_COLORS.navy,
  },
  savedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: AI_COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: AI_COLORS.border,
    padding: 12,
    marginBottom: 10,
  },
  savedTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: AI_COLORS.navy,
  },
  savedMeta: {
    fontSize: 11.5,
    color: AI_COLORS.textSecondary,
    marginTop: 2,
  },
  emptyText: {
    fontSize: 13,
    color: AI_COLORS.textSecondary,
  },
});
