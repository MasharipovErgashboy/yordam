import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { AI_COLORS } from '../../constants/aiChatTheme';
import type { ContractIssue, ContractReview } from '../../types/contractAi';
import { HeaderIconButton } from '../../components/AiChat/HeaderIconButton';
import { ScreenHeader } from '../../components/ContractAi/ScreenHeader';
import { RiskGauge } from '../../components/ContractAi/RiskGauge';
import { CountPill, FileBadge, RISK_COLORS } from '../../components/ContractAi/Badges';

type ReviewTab = 'issues' | 'summary' | 'text';

const comingSoon = (title: string) => Alert.alert(title, 'Bu funksiya tez orada ishga tushadi.');

const levelLabel = (level: ContractIssue['level']) => (level === 'high' ? 'Yuqori' : 'O‘rta');

interface Props {
  review: ContractReview | null; // null — tahlil davom etmoqda
  onAskAi: () => void;
  onBack: () => void;
  topInset: number;
  bottomInset: number;
}

export const ContractReviewView: React.FC<Props> = ({
  review,
  onAskAi,
  onBack,
  topInset,
  bottomInset,
}) => {
  const [tab, setTab] = useState<ReviewTab>('issues');
  const [expandedId, setExpandedId] = useState<string | null>(review?.issues[0]?.id ?? null);
  const [shownFixes, setShownFixes] = useState<Record<string, boolean>>({});

  // Tahlil tugaganda birinchi muammo ochiq turadi
  const [lastReviewId, setLastReviewId] = useState(review?.id ?? null);
  if (review && review.id !== lastReviewId) {
    setLastReviewId(review.id);
    setExpandedId(review.issues[0]?.id ?? null);
  }

  const header = (
    <ScreenHeader
      title="Shartnoma tekshiruvi"
      onBack={onBack}
      topInset={topInset}
      right={
        review ? (
          <HeaderIconButton
            onPress={() => comingSoon('Hisobotni yuklab olish')}
            accessibilityLabel="Hisobotni yuklab olish"
          >
            <Ionicons name="download-outline" size={19} color={AI_COLORS.text} />
          </HeaderIconButton>
        ) : null
      }
    />
  );

  if (!review) {
    return (
      <View style={styles.root}>
        {header}
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={AI_COLORS.primary} />
          <Text style={styles.loadingTitle}>Shartnoma tahlil qilinmoqda...</Text>
          <Text style={styles.loadingSub}>AI har bir bandni xavf bo‘yicha tekshirmoqda</Text>
        </View>
      </View>
    );
  }

  const tabs: { id: ReviewTab; label: string }[] = [
    { id: 'issues', label: `Muammolar (${review.issues.length})` },
    { id: 'summary', label: 'Xulosa' },
    { id: 'text', label: 'Matn' },
  ];

  return (
    <View style={styles.root}>
      {header}

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Fayl */}
        <View style={styles.fileCard}>
          <FileBadge type={review.fileType} />
          <View style={{ flex: 1 }}>
            <Text style={styles.fileName} numberOfLines={1}>
              {review.fileName}
            </Text>
            <Text style={styles.fileMeta}>
              {review.pages} sahifa · {review.clausesChecked} band tekshirildi
            </Text>
          </View>
          <TouchableOpacity
            style={styles.replaceButton}
            onPress={() => comingSoon('Faylni almashtirish')}
            accessibilityRole="button"
          >
            <Text style={styles.replaceText}>Almashtirish</Text>
          </TouchableOpacity>
        </View>

        {/* Xavf ko‘rsatkichi */}
        <LinearGradient
          colors={['#2F6FE4', '#1A4FC0']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.riskCard}
        >
          <RiskGauge score={review.score} color="#FBBF24" />
          <View style={{ flex: 1 }}>
            <Text style={styles.riskTitle}>{review.levelLabel}</Text>
            <Text style={styles.riskSummary}>{review.summary}</Text>
            <View style={styles.countsRow}>
              <CountPill kind="high" label={`${review.counts.high} yuqori`} />
              <CountPill kind="medium" label={`${review.counts.medium} o‘rta`} />
              <CountPill kind="good" label={`${review.counts.good} yaxshi`} />
            </View>
          </View>
        </LinearGradient>

        {/* Tablar */}
        <View style={styles.tabsRow}>
          {tabs.map((t) => {
            const active = t.id === tab;
            return (
              <TouchableOpacity
                key={t.id}
                style={[styles.tab, active && styles.tabActive]}
                onPress={() => setTab(t.id)}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
              >
                <Text style={[styles.tabText, active && styles.tabTextActive]}>{t.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {tab === 'issues' &&
          review.issues.map((issue) => {
            const colors = RISK_COLORS[issue.level];
            const expanded = expandedId === issue.id;
            const fixShown = !!shownFixes[issue.id];

            if (!expanded) {
              return (
                <TouchableOpacity
                  key={issue.id}
                  style={styles.issueRow}
                  activeOpacity={0.8}
                  onPress={() => setExpandedId(issue.id)}
                  accessibilityRole="button"
                  accessibilityState={{ expanded: false }}
                >
                  <View style={[styles.dot, { backgroundColor: colors.dot }]} />
                  <Text style={styles.issueRowText} numberOfLines={1}>
                    {issue.clauseRef} · {issue.title}
                  </Text>
                  <Ionicons name="chevron-down" size={17} color={AI_COLORS.textSecondary} />
                </TouchableOpacity>
              );
            }

            return (
              <View key={issue.id} style={styles.issueCard}>
                <TouchableOpacity
                  style={styles.issueHeader}
                  onPress={() => setExpandedId(null)}
                  accessibilityRole="button"
                  accessibilityState={{ expanded: true }}
                >
                  <Text style={styles.issueTitle}>
                    {issue.clauseRef} · {issue.title}
                  </Text>
                  <View style={[styles.levelTag, { backgroundColor: colors.bg }]}>
                    <Text style={[styles.levelTagText, { color: colors.text }]}>
                      {levelLabel(issue.level)}
                    </Text>
                  </View>
                </TouchableOpacity>

                <View style={[styles.quoteBox, { backgroundColor: colors.bg }]}>
                  <Text style={styles.quoteText}>{issue.quote}</Text>
                </View>

                <Text style={styles.explanation}>{issue.explanation}</Text>

                {fixShown && (
                  <View style={styles.fixBox}>
                    <Text style={styles.fixLabel}>Tavsiya etilgan matn</Text>
                    <Text style={styles.fixText}>{issue.suggestedFix}</Text>
                  </View>
                )}

                <View style={styles.issueActions}>
                  <TouchableOpacity
                    style={styles.fixButton}
                    onPress={() => setShownFixes((s) => ({ ...s, [issue.id]: !s[issue.id] }))}
                    accessibilityRole="button"
                  >
                    <Text style={styles.fixButtonText}>
                      {fixShown ? 'Tuzatishni yashirish' : 'Tuzatishni ko‘rish'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.askButton}
                    onPress={onAskAi}
                    accessibilityRole="button"
                  >
                    <Text style={styles.askButtonText}>AI dan so‘rash</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}

        {tab === 'summary' && (
          <View style={styles.panel}>
            <Text style={styles.panelText}>{review.conclusion}</Text>
            <View style={styles.summaryList}>
              <SummaryRow color={RISK_COLORS.high.dot} label="Yuqori xavfli bandlar" value={review.counts.high} />
              <SummaryRow color={RISK_COLORS.medium.dot} label="O‘rta xavfli bandlar" value={review.counts.medium} />
              <SummaryRow color={RISK_COLORS.good.dot} label="Muammosiz bandlar" value={review.counts.good} />
            </View>
          </View>
        )}

        {tab === 'text' && (
          <View>
            {review.issues.map((issue) => (
              <View key={issue.id} style={styles.panel}>
                <Text style={styles.textRef}>{issue.clauseRef}</Text>
                <Text
                  style={[styles.textQuote, { backgroundColor: RISK_COLORS[issue.level].bg }]}
                >
                  {issue.quote}
                </Text>
              </View>
            ))}
            <Text style={styles.textNote}>
              Hujjatning to‘liq matni backend ulangandan so‘ng shu yerda ko‘rsatiladi.
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(bottomInset, 12) }]}>
        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.85}
          onPress={() => comingSoon('Tuzatilgan versiya')}
          accessibilityRole="button"
        >
          <Ionicons name="sparkles" size={17} color={AI_COLORS.amberText} />
          <Text style={styles.primaryButtonText}>Tuzatilgan versiyani olish</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const SummaryRow: React.FC<{ color: string; label: string; value: number }> = ({
  color,
  label,
  value,
}) => (
  <View style={styles.summaryRow}>
    <View style={[styles.dot, { backgroundColor: color }]} />
    <Text style={styles.summaryLabel}>{label}</Text>
    <Text style={styles.summaryValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: AI_COLORS.bg,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 32,
  },
  loadingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: AI_COLORS.navy,
    marginTop: 6,
  },
  loadingSub: {
    fontSize: 13,
    color: AI_COLORS.textSecondary,
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 24,
  },
  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: AI_COLORS.surface,
    borderWidth: 1,
    borderColor: AI_COLORS.border,
    borderRadius: 14,
    padding: 12,
  },
  fileName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: AI_COLORS.navy,
  },
  fileMeta: {
    fontSize: 11.5,
    color: AI_COLORS.textSecondary,
    marginTop: 2,
  },
  replaceButton: {
    backgroundColor: AI_COLORS.primarySoft,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  replaceText: {
    fontSize: 12,
    fontWeight: '600',
    color: AI_COLORS.primary,
  },
  riskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 18,
    padding: 16,
    marginTop: 12,
  },
  riskTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  riskSummary: {
    fontSize: 12,
    lineHeight: 17,
    color: '#DCE7FB',
    marginTop: 3,
  },
  countsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
    marginBottom: 12,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: AI_COLORS.surface,
    borderWidth: 1,
    borderColor: AI_COLORS.border,
  },
  tabActive: {
    backgroundColor: AI_COLORS.navy,
    borderColor: AI_COLORS.navy,
  },
  tabText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#334155',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  issueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: AI_COLORS.surface,
    borderWidth: 1,
    borderColor: AI_COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  issueRowText: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '600',
    color: AI_COLORS.navy,
  },
  issueCard: {
    backgroundColor: AI_COLORS.surface,
    borderWidth: 1,
    borderColor: AI_COLORS.border,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  issueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  issueTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: AI_COLORS.navy,
  },
  levelTag: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  levelTagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  quoteBox: {
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  quoteText: {
    fontSize: 13,
    lineHeight: 19,
    fontStyle: 'italic',
    color: '#1E293B',
  },
  explanation: {
    fontSize: 12.5,
    lineHeight: 18,
    color: AI_COLORS.textSecondary,
    marginTop: 10,
  },
  fixBox: {
    backgroundColor: '#E7F7EE',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  fixLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#15803D',
    marginBottom: 3,
  },
  fixText: {
    fontSize: 13,
    lineHeight: 19,
    color: '#14532D',
  },
  issueActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  fixButton: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    backgroundColor: AI_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fixButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  askButton: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C9D8F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  askButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: AI_COLORS.primary,
  },
  panel: {
    backgroundColor: AI_COLORS.surface,
    borderWidth: 1,
    borderColor: AI_COLORS.border,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  panelText: {
    fontSize: 13.5,
    lineHeight: 20,
    color: '#1E293B',
  },
  summaryList: {
    marginTop: 12,
    gap: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  summaryLabel: {
    flex: 1,
    fontSize: 13,
    color: '#334155',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '700',
    color: AI_COLORS.navy,
  },
  textRef: {
    fontSize: 12.5,
    fontWeight: '700',
    color: AI_COLORS.navy,
    marginBottom: 6,
  },
  textQuote: {
    fontSize: 13,
    lineHeight: 19,
    color: '#1E293B',
    borderRadius: 6,
    padding: 6,
  },
  textNote: {
    fontSize: 12,
    color: AI_COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 6,
  },
  footer: {
    backgroundColor: AI_COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: AI_COLORS.border,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  primaryButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: AI_COLORS.amber,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: AI_COLORS.amberText,
  },
});
