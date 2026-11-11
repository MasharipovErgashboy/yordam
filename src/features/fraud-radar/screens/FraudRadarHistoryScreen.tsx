import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { CustomButton } from '../../../components/common/CustomButton';
import { Badge } from '../../../components/common/Badge';
import { ArrowRightIcon } from '../../../components/common/Icons';
import { MOCK_RADAR_HISTORY } from '../../../mock/fraudRadarData';
import { HistoryItem } from '../../../types/fraudRadar.types';
import { Colors } from '../../../theme/colors';

interface FraudRadarHistoryScreenProps {
  onStartNewCheck: () => void;
  onSelectHistoryItem: (item: HistoryItem) => void;
}

export const FraudRadarHistoryScreen: React.FC<FraudRadarHistoryScreenProps> = ({
  onStartNewCheck,
  onSelectHistoryItem,
}) => {
  const [filter, setFilter] = useState<'all' | 'danger' | 'safe'>('all');
  const [historyList, setHistoryList] = useState<HistoryItem[]>(MOCK_RADAR_HISTORY);

  const filteredItems = historyList.filter((item) => {
    if (filter === 'danger') return !item.isSafe;
    if (filter === 'safe') return item.isSafe;
    return true;
  });

  const handleClearHistory = () => {
    Alert.alert(
      'Tarixni tozalash',
      'Haqiqatan ham barcha tekshiruvlar tarixini o‘chirmoqchimisiz?',
      [
        { text: 'Bekor qilish', style: 'cancel' },
        {
          text: 'Ha, tozalash',
          style: 'destructive',
          onPress: () => setHistoryList([]),
        },
      ]
    );
  };

  const getBadgeVariant = (label: string): 'red' | 'green' | 'yellow' => {
    if (label.includes('Xavfli')) return 'red';
    if (label.includes('Xavfsiz')) return 'green';
    return 'yellow';
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Tekshiruv Natijalari</Text>
          <Text style={styles.headerSubtitle}>Tekshiruvlar va xabarlar tarixi</Text>
        </View>
        <TouchableOpacity activeOpacity={0.7} onPress={handleClearHistory}>
          <Text style={styles.clearText}>Tozalash</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Filter Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setFilter('all')}
            style={[styles.tab, filter === 'all' && styles.activeTab]}
          >
            <Text style={[styles.tabText, filter === 'all' && styles.activeTabText]}>
              Barchasi ({historyList.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setFilter('danger')}
            style={[styles.tab, filter === 'danger' && styles.activeTab]}
          >
            <Text style={[styles.tabText, filter === 'danger' && styles.activeTabText]}>
              Xavflilar ({historyList.filter((i) => !i.isSafe).length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setFilter('safe')}
            style={[styles.tab, filter === 'safe' && styles.activeTab]}
          >
            <Text style={[styles.tabText, filter === 'safe' && styles.activeTabText]}>
              Xavfsizlar ({historyList.filter((i) => i.isSafe).length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Section title & Count */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>So‘nggi tekshiruvlar</Text>
          <Text style={styles.countText}>
            {filteredItems.length}/{historyList.length}
          </Text>
        </View>

        {/* List */}
        <View style={styles.listContainer}>
          {filteredItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              onPress={() => onSelectHistoryItem(item)}
              style={styles.historyCard}
            >
              <View style={styles.infoContainer}>
                <View style={styles.titleBadgeRow}>
                  <Text style={styles.queryText}>{item.query}</Text>
                </View>

                <View style={styles.badgeRow}>
                  <Badge
                    label={item.typeLabel}
                    variant={getBadgeVariant(item.typeLabel)}
                    style={styles.pillBadge}
                  />
                </View>

                <Text style={styles.detailText}>{item.detail}</Text>
                <Text style={styles.dateText}>{item.date}</Text>
              </View>

              <ArrowRightIcon size={16} color={Colors.secondaryText} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Load more button */}
        <TouchableOpacity activeOpacity={0.7} style={styles.loadMoreBtn}>
          <Text style={styles.loadMoreText}>Yana natijalar ▾</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Floating Bottom Button */}
      <View style={styles.bottomBar}>
        <CustomButton
          title="Yangi tekshiruv +"
          variant="accent"
          onPress={onStartNewCheck}
          style={styles.newBtn}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.canvas,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  headerSubtitle: {
    fontSize: 11,
    color: Colors.secondaryText,
    marginTop: 2,
  },
  clearText: {
    fontSize: 13,
    color: Colors.secondaryText,
    fontWeight: '500',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 90,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 3,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: Colors.borderNormal,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.secondaryText,
  },
  activeTabText: {
    color: Colors.surface,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
  },
  countText: {
    fontSize: 12,
    color: Colors.secondaryText,
    fontWeight: '600',
  },
  listContainer: {
    gap: 10,
  },
  historyCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderNormal,
  },
  infoContainer: {
    flex: 1,
  },
  titleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  queryText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  badgeRow: {
    marginVertical: 4,
  },
  pillBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  detailText: {
    fontSize: 12,
    color: Colors.bodyMuted,
    marginTop: 2,
  },
  dateText: {
    fontSize: 11,
    color: Colors.secondaryText,
    marginTop: 2,
  },
  loadMoreBtn: {
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 4,
  },
  loadMoreText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  newBtn: {
    height: 48,
    borderRadius: 14,
  },
});
