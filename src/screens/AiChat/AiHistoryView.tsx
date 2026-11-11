import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AI_COLORS, CATEGORY_META } from '../../constants/aiChatTheme';
import { FILTER_CHIPS } from '../../data/aiChatMock';
import type { AiFilterId, Conversation, HistoryGroup } from '../../types/aiChat';
import { AiIconView } from '../../components/AiChat/AiIconView';
import { HeaderIconButton } from '../../components/AiChat/HeaderIconButton';

const GROUP_ORDER: HistoryGroup[] = ['Bugun', 'O‘tgan hafta'];

interface Props {
  conversations: Conversation[];
  onOpen: (conversationId: string) => void;
  onNewChat: () => void;
  onBack: () => void;
  topInset: number;
  bottomInset: number;
}

export const AiHistoryView: React.FC<Props> = ({
  conversations,
  onOpen,
  onNewChat,
  onBack,
  topInset,
  bottomInset,
}) => {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filter, setFilter] = useState<AiFilterId>('all');

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const visible = conversations.filter((c) => {
      const matchesFilter = filter === 'all' || c.categoryId === filter;
      const matchesQuery =
        !q || c.title.toLowerCase().includes(q) || c.preview.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
    return GROUP_ORDER.map((group) => ({
      group,
      items: visible.filter((c) => c.group === group),
    })).filter((g) => g.items.length > 0);
  }, [conversations, query, filter]);

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topInset + 8 }]}>
        <View style={styles.headerRow}>
          <HeaderIconButton onPress={onBack} accessibilityLabel="Orqaga">
            <Ionicons name="chevron-back" size={20} color={AI_COLORS.text} />
          </HeaderIconButton>
          <Text style={styles.headerTitle}>Suhbatlar tarixi</Text>
          <HeaderIconButton
            onPress={() => setShowFilters((v) => !v)}
            accessibilityLabel="Mavzu bo‘yicha saralash"
          >
            <Ionicons
              name="filter-outline"
              size={19}
              color={filter !== 'all' ? AI_COLORS.primary : AI_COLORS.text}
            />
          </HeaderIconButton>
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={17} color={AI_COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Suhbatlardan qidirish"
            placeholderTextColor={AI_COLORS.placeholder}
            returnKeyType="search"
            accessibilityLabel="Suhbatlardan qidirish"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} accessibilityLabel="Qidiruvni tozalash">
              <Ionicons name="close-circle" size={17} color={AI_COLORS.placeholder} />
            </TouchableOpacity>
          )}
        </View>

        {showFilters && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
            contentContainerStyle={styles.filterRow}
          >
            {FILTER_CHIPS.map((chip) => {
              const active = chip.id === filter;
              return (
                <TouchableOpacity
                  key={chip.id}
                  style={[styles.filterChip, active && styles.filterChipActive]}
                  onPress={() => setFilter(chip.id)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                >
                  <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                    {chip.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={[styles.bodyContent, { paddingBottom: bottomInset + 96 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {groups.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="chatbubbles-outline" size={36} color={AI_COLORS.placeholder} />
            <Text style={styles.emptyText}>Hech narsa topilmadi</Text>
          </View>
        ) : (
          groups.map(({ group, items }) => (
            <View key={group}>
              <Text style={styles.groupLabel}>{group.toUpperCase()}</Text>
              {items.map((c) => {
                const meta = CATEGORY_META[c.categoryId];
                return (
                  <TouchableOpacity
                    key={c.id}
                    style={styles.card}
                    activeOpacity={0.8}
                    onPress={() => onOpen(c.id)}
                    accessibilityRole="button"
                  >
                    <View style={[styles.cardIcon, { backgroundColor: meta.bg }]}>
                      <AiIconView icon={meta.icon} size={18} color={meta.color} />
                    </View>
                    <View style={styles.cardBody}>
                      <View style={styles.cardTop}>
                        <Text style={styles.cardTitle} numberOfLines={1}>
                          {c.title}
                        </Text>
                        <Text style={styles.cardTime}>{c.timeLabel}</Text>
                      </View>
                      <Text style={styles.cardPreview} numberOfLines={1}>
                        {c.preview}
                      </Text>
                      <View style={[styles.tag, { backgroundColor: meta.bg }]}>
                        <Text style={[styles.tagText, { color: meta.textColor }]}>{meta.label}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))
        )}
      </ScrollView>

      <TouchableOpacity
        style={[styles.fab, { bottom: Math.max(bottomInset, 12) + 12 }]}
        activeOpacity={0.85}
        onPress={onNewChat}
        accessibilityRole="button"
      >
        <Ionicons name="add" size={20} color={AI_COLORS.amberText} />
        <Text style={styles.fabText}>Yangi suhbat</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: AI_COLORS.bg,
  },
  header: {
    backgroundColor: AI_COLORS.surface,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: AI_COLORS.border,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: AI_COLORS.navy,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 44,
    marginTop: 12,
    paddingHorizontal: 14,
    backgroundColor: AI_COLORS.bg,
    borderWidth: 1,
    borderColor: AI_COLORS.border,
    borderRadius: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: AI_COLORS.text,
    paddingVertical: 0,
  },
  filterScroll: {
    marginHorizontal: -16,
    marginTop: 10,
  },
  filterRow: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: AI_COLORS.surfaceMuted,
  },
  filterChipActive: {
    backgroundColor: AI_COLORS.primary,
  },
  filterChipText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#334155',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    paddingHorizontal: 16,
    paddingTop: 6,
  },
  groupLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: AI_COLORS.textSecondary,
    marginTop: 14,
    marginBottom: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: AI_COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AI_COLORS.border,
    padding: 14,
    marginBottom: 10,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    flex: 1,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: AI_COLORS.navy,
  },
  cardTime: {
    fontSize: 11.5,
    color: AI_COLORS.textSecondary,
  },
  cardPreview: {
    fontSize: 12.5,
    color: AI_COLORS.textSecondary,
    marginTop: 3,
  },
  tag: {
    alignSelf: 'flex-start',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 8,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 10,
  },
  emptyText: {
    fontSize: 14,
    color: AI_COLORS.textSecondary,
  },
  fab: {
    position: 'absolute',
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 48,
    paddingHorizontal: 18,
    borderRadius: 24,
    backgroundColor: AI_COLORS.amber,
    shadowColor: '#B45309',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 6,
  },
  fabText: {
    fontSize: 14,
    fontWeight: '700',
    color: AI_COLORS.amberText,
  },
});
