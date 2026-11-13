import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  Share,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { LEGAL_ARTICLES, LegalArticle } from '../data/legalArticles';

const articleGavelImage = require('../../assets/images/article_gavel.jpg');

interface FoydaliMalumotlarScreenProps {
  initialArticleId?: string | null;
  onBack: () => void;
}

type CategoryFilter = 'all' | 'mehnat' | 'istemolchi' | 'kredit' | 'uy_joy' | 'avto' | 'oila';

const CATEGORIES: { id: CategoryFilter; label: string; icon: string }[] = [
  { id: 'all', label: 'Barchasi', icon: 'apps-outline' },
  { id: 'mehnat', label: 'Mehnat', icon: 'briefcase-outline' },
  { id: 'istemolchi', label: 'Iste’molchi', icon: 'cart-outline' },
  { id: 'kredit', label: 'Kredit & Bank', icon: 'card-outline' },
  { id: 'uy_joy', label: 'Uy-joy & Ijara', icon: 'home-outline' },
  { id: 'avto', label: 'Avto & YHQ', icon: 'car-outline' },
  { id: 'oila', label: 'Oila', icon: 'people-outline' },
];

export const FoydaliMalumotlarScreen: React.FC<FoydaliMalumotlarScreenProps> = ({
  initialArticleId,
  onBack,
}) => {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');

  // Active article modal state
  const [activeArticle, setActiveArticle] = useState<LegalArticle | null>(() => {
    if (initialArticleId) {
      return LEGAL_ARTICLES.find((a) => a.id === initialArticleId) || null;
    }
    return null;
  });

  const filteredArticles = useMemo(() => {
    return LEGAL_ARTICLES.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleShare = async (article: LegalArticle) => {
    try {
      await Share.share({
        title: article.title,
        message: `«${article.title}»\n\n${article.summary}\n\nYordam huquqiy portali orqali o‘qing: https://yordam.uz/articles/${article.id}`,
      });
    } catch {
      // ignore
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      {/* Top Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={20} color="#0F172A" />
          <Text style={styles.backButtonText}>Bosh sahifa</Text>
        </TouchableOpacity>

        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>Foydali ma’lumotlar</Text>
          <Text style={styles.headerSubtitle}>{LEGAL_ARTICLES.length} ta huquqiy qo‘llanma</Text>
        </View>

        <View style={{ width: 40 }} />
      </View>

      {/* Search Input Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#94A3B8" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Mavzu yoki kalit so‘z bo‘yicha qidirish..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Horizontal Category Filter Pills */}
      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScrollContent}
        >
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoryPill, isActive && styles.categoryPillActive]}
                onPress={() => setSelectedCategory(cat.id)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={cat.icon as any}
                  size={14}
                  color={isActive ? '#0284C7' : '#64748B'}
                  style={{ marginRight: 5 }}
                />
                <Text style={[styles.categoryPillText, isActive && styles.categoryPillTextActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Articles List */}
      <ScrollView
        style={styles.articlesList}
        contentContainerStyle={[styles.articlesScrollContent, { paddingBottom: insets.bottom + 30 }]}
        showsVerticalScrollIndicator={false}
      >
        {filteredArticles.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Ionicons name="document-text-outline" size={48} color="#94A3B8" style={{ opacity: 0.6 }} />
            <Text style={styles.emptyStateTitle}>Maqola topilmadi</Text>
            <Text style={styles.emptyStateSubtitle}>
              Boshqa so‘z yoki toifa bo‘yicha qidirib ko‘ring.
            </Text>
          </View>
        ) : (
          filteredArticles.map((article) => (
            <TouchableOpacity
              key={article.id}
              style={styles.articleCard}
              activeOpacity={0.85}
              onPress={() => setActiveArticle(article)}
            >
              <Image source={articleGavelImage} style={styles.articleCardImage} resizeMode="cover" />

              <View style={styles.articleCardBody}>
                {/* Badge Row */}
                <View style={styles.badgeRow}>
                  <View style={[styles.categoryBadge, { backgroundColor: article.badgeBg }]}>
                    <Text style={[styles.categoryBadgeText, { color: article.badgeColor }]}>
                      {article.categoryLabel}
                    </Text>
                  </View>
                  <View style={styles.readTimeBadge}>
                    <Ionicons name="time-outline" size={11} color="#64748B" />
                    <Text style={styles.readTimeText}>{article.readTime}</Text>
                  </View>
                </View>

                {/* Title */}
                <Text style={styles.articleCardTitle} numberOfLines={2}>
                  {article.title}
                </Text>

                {/* Summary */}
                <Text style={styles.articleCardSummary} numberOfLines={2}>
                  {article.summary}
                </Text>

                {/* Footer Meta */}
                <View style={styles.articleCardFooter}>
                  <View style={styles.metaLeftGroup}>
                    <View style={styles.metaItem}>
                      <Ionicons name="calendar-outline" size={12} color="#94A3B8" />
                      <Text style={styles.metaItemText}>{article.date}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons name="eye-outline" size={12} color="#94A3B8" />
                      <Text style={styles.metaItemText}>{article.views}</Text>
                    </View>
                  </View>

                  <View style={styles.readMoreGroup}>
                    <Text style={styles.readMoreText}>O‘qish</Text>
                    <Ionicons name="chevron-forward" size={13} color="#0284C7" />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* ===================================================================== */}
      {/* ARTICLE READER MODAL (FULL ARTICLE DETAIL) */}
      {/* ===================================================================== */}
      <Modal
        visible={!!activeArticle}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setActiveArticle(null)}
      >
        {activeArticle && (
          <View style={styles.readerContainer}>
            {/* Reader Header */}
            <View style={styles.readerHeader}>
              <TouchableOpacity
                style={styles.readerCloseButton}
                onPress={() => setActiveArticle(null)}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={22} color="#0F172A" />
              </TouchableOpacity>

              <View style={styles.readerHeaderActions}>
                <TouchableOpacity
                  style={styles.readerActionButton}
                  onPress={() => handleShare(activeArticle)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="share-social-outline" size={20} color="#0284C7" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Reader Scrollable Body */}
            <ScrollView
              style={styles.readerScroll}
              contentContainerStyle={[styles.readerScrollContent, { paddingBottom: insets.bottom + 40 }]}
              showsVerticalScrollIndicator={false}
            >
              {/* Category & Meta */}
              <View style={styles.readerMetaRow}>
                <View style={[styles.categoryBadge, { backgroundColor: activeArticle.badgeBg }]}>
                  <Text style={[styles.categoryBadgeText, { color: activeArticle.badgeColor }]}>
                    {activeArticle.categoryLabel}
                  </Text>
                </View>
                <View style={styles.readerMetaItem}>
                  <Ionicons name="calendar-outline" size={12} color="#64748B" />
                  <Text style={styles.readerMetaText}>{activeArticle.date}</Text>
                </View>
                <View style={styles.readerMetaItem}>
                  <Ionicons name="time-outline" size={12} color="#64748B" />
                  <Text style={styles.readerMetaText}>{activeArticle.readTime}</Text>
                </View>
                <View style={styles.readerMetaItem}>
                  <Ionicons name="eye-outline" size={12} color="#64748B" />
                  <Text style={styles.readerMetaText}>{activeArticle.views}</Text>
                </View>
              </View>

              {/* Title */}
              <Text style={styles.readerTitle}>{activeArticle.title}</Text>

              {/* Author Banner */}
              <View style={styles.authorCard}>
                <View style={styles.authorAvatar}>
                  <Ionicons name="person" size={20} color="#0284C7" />
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.authorName}>{activeArticle.author}</Text>
                  <Text style={styles.authorRole}>{activeArticle.authorRole}</Text>
                </View>
                <View style={styles.authorBadge}>
                  <Ionicons name="checkmark-circle" size={15} color="#10B981" />
                  <Text style={styles.authorBadgeText}>Ekspert</Text>
                </View>
              </View>

              {/* Summary Block */}
              <View style={styles.summaryBlock}>
                <Ionicons name="bulb" size={20} color="#F59E0B" style={{ marginRight: 8, marginTop: 2 }} />
                <Text style={styles.summaryText}>{activeArticle.summary}</Text>
              </View>

              {/* Legal Basis Section */}
              <Text style={styles.readerSectionTitle}>Qonuniy asoslar</Text>
              <View style={styles.legalBasisBox}>
                {activeArticle.legalBasis.map((law, index) => (
                  <View key={index} style={styles.legalBasisRow}>
                    <Ionicons name="shield-checkmark" size={16} color="#10B981" style={{ marginTop: 2 }} />
                    <Text style={styles.legalBasisText}>{law}</Text>
                  </View>
                ))}
              </View>

              {/* Practical Steps */}
              <Text style={styles.readerSectionTitle}>Amaliy qadamlar va tartib</Text>
              <View style={styles.stepsContainer}>
                {activeArticle.steps.map((step, idx) => (
                  <View key={idx} style={styles.stepCard}>
                    <Text style={styles.stepTitle}>{step.title}</Text>
                    <Text style={styles.stepDesc}>{step.desc}</Text>
                  </View>
                ))}
              </View>

              {/* Key Takeaway */}
              <View style={styles.takeawayBox}>
                <View style={styles.takeawayHeader}>
                  <Ionicons name="information-circle" size={18} color="#0284C7" />
                  <Text style={styles.takeawayTitle}>Asosiy xulosa</Text>
                </View>
                <Text style={styles.takeawayText}>{activeArticle.keyTakeaway}</Text>
              </View>

              {/* Bottom Action Button */}
              <TouchableOpacity
                style={styles.doneButton}
                activeOpacity={0.85}
                onPress={() => setActiveArticle(null)}
              >
                <LinearGradient
                  colors={['#0284C7', '#00A3FF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.doneGradient}
                >
                  <Ionicons name="checkmark" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.doneButtonText}>Tushunarli</Text>
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  backButtonText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#0F172A',
    marginLeft: 4,
  },
  headerTitleWrap: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    color: '#0F172A',
  },
  categoriesContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 10,
  },
  categoriesScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryPillActive: {
    backgroundColor: '#F0F9FF',
    borderColor: '#0284C7',
  },
  categoryPillText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#64748B',
  },
  categoryPillTextActive: {
    color: '#0284C7',
    fontWeight: '700',
  },
  articlesList: {
    flex: 1,
  },
  articlesScrollContent: {
    padding: 16,
    gap: 12,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 12,
  },
  emptyStateSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
  },
  articleCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  articleCardImage: {
    width: 96,
    height: 96,
    borderRadius: 14,
  },
  articleCardBody: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  categoryBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  readTimeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  readTimeText: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '500',
  },
  articleCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 18,
    marginBottom: 4,
  },
  articleCardSummary: {
    fontSize: 11.5,
    color: '#64748B',
    lineHeight: 16,
    marginBottom: 6,
  },
  articleCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
    paddingTop: 6,
  },
  metaLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metaItemText: {
    fontSize: 10.5,
    color: '#94A3B8',
  },
  readMoreGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readMoreText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0284C7',
  },

  // Reader Modal Styles
  readerContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  readerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  readerCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  readerHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readerActionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F9FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  readerScroll: {
    flex: 1,
  },
  readerScrollContent: {
    padding: 20,
  },
  readerMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 12,
  },
  readerMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  readerMetaText: {
    fontSize: 11.5,
    color: '#64748B',
  },
  readerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 27,
    marginBottom: 16,
  },
  authorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  authorRole: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
  authorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  authorBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#10B981',
  },
  summaryBlock: {
    flexDirection: 'row',
    backgroundColor: '#FFFBEB',
    borderLeftWidth: 3.5,
    borderLeftColor: '#F59E0B',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },
  summaryText: {
    flex: 1,
    fontSize: 13,
    color: '#92400E',
    lineHeight: 19,
    fontWeight: '500',
  },
  readerSectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
    marginTop: 6,
  },
  legalBasisBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
    marginBottom: 20,
  },
  legalBasisRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  legalBasisText: {
    flex: 1,
    fontSize: 12.5,
    color: '#334155',
    lineHeight: 18,
  },
  stepsContainer: {
    gap: 10,
    marginBottom: 20,
  },
  stepCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  stepTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0284C7',
    marginBottom: 4,
  },
  stepDesc: {
    fontSize: 12.5,
    color: '#475569',
    lineHeight: 18,
  },
  takeawayBox: {
    backgroundColor: '#F0F9FF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    marginBottom: 24,
  },
  takeawayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  takeawayTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0284C7',
  },
  takeawayText: {
    fontSize: 12.5,
    color: '#0369A1',
    lineHeight: 18,
  },
  doneButton: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  doneGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    paddingHorizontal: 20,
  },
  doneButtonText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
