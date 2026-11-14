import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../../../theme/colors';
import { SearchInput } from '../../../components/common/SearchInput';
import {
  StarIcon,
  NotaryStampIcon,
  FhdyoIcon,
  BuildingIcon,
  ScalesIcon,
  ArrowRightIcon,
  UsersIcon,
} from '../../../components/common/Icons';
import { MOCK_LEGAL_PLACES } from '../../../mock/legalMapData';
import { LegalPlace } from '../../../types/legalMap.types';

interface LegalMapListScreenProps {
  onSelectPlace: (place: LegalPlace) => void;
  onSwitchToMap: () => void;
  onClose?: () => void;
}

export const LegalMapListScreen: React.FC<LegalMapListScreenProps> = ({
  onSelectPlace,
  onSwitchToMap,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPlaces = MOCK_LEGAL_PLACES.filter(
    (p) =>
      !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'notary':
        return <NotaryStampIcon size={20} color={Colors.primary} />;
      case 'fhdyo':
        return <FhdyoIcon size={20} color={Colors.primary} />;
      case 'lawyer':
        return <ScalesIcon size={20} color={Colors.primary} />;
      case 'dxm':
      default:
        return <BuildingIcon size={20} color={Colors.primary} />;
    }
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar style="dark" />

      {/* Header with City Dropdown */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>LegalMap Tashkilotlar</Text>
          <TouchableOpacity activeOpacity={0.7} style={styles.locationDropdown}>
            <Text style={styles.locationText}>📍 Toshkent ▾</Text>
          </TouchableOpacity>
        </View>

        {onClose && (
          <TouchableOpacity activeOpacity={0.7} onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Segmented Control [ Xarita | Ro'yxat ] */}
        <View style={styles.segmentedContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onSwitchToMap}
            style={styles.segmentBtn}
          >
            <Text style={styles.segmentText}>🗺️ Xarita</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.segmentBtn, styles.activeSegmentBtn]}
          >
            <Text style={[styles.segmentText, styles.activeSegmentText]}>📋 Ro‘yxat</Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Notarius, FHDYo, advokat qidirish..."
          style={styles.searchBar}
        />

        {/* List Info Row */}
        <View style={styles.infoRow}>
          <Text style={styles.countText}>
            {filteredPlaces.length} ta tashkilot
          </Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.sortText}>Yaqinligi bo‘yicha ▾</Text>
          </TouchableOpacity>
        </View>

        {/* Places List Cards */}
        <View style={styles.cardsContainer}>
          {filteredPlaces.map((place) => (
            <TouchableOpacity
              key={place.id}
              activeOpacity={0.85}
              onPress={() => onSelectPlace(place)}
              style={styles.card}
            >
              <View style={styles.cardTopRow}>
                <View style={styles.avatarBox}>
                  {getCategoryIcon(place.category)}
                </View>

                <View style={styles.cardMainInfo}>
                  <Text style={styles.placeName}>{place.name}</Text>
                  <View style={styles.metaRow}>
                    <View style={styles.ratingBadge}>
                      <StarIcon size={12} color={Colors.accent} />
                      <Text style={styles.ratingText}>{place.rating}</Text>
                    </View>
                    <Text style={styles.metaDot}>•</Text>
                    <Text style={styles.distanceText}>{place.distance}</Text>
                    <Text style={styles.metaDot}>•</Text>
                    <View
                      style={[
                        styles.statusBadge,
                        place.isOpen ? styles.openBadge : styles.breakBadge,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          place.isOpen ? styles.openText : styles.breakText,
                        ]}
                      >
                        {place.isOpen ? 'Ochiq' : 'Tushlik'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Queue status line */}
              <View style={styles.queueRow}>
                <View style={styles.queueInfo}>
                  <UsersIcon size={14} color={Colors.primary} />
                  <Text style={styles.queueLabel}>
                    Navbat:{' '}
                    <Text
                      style={[
                        styles.queueBold,
                        place.queueStatus === 'gavjum' && styles.queueBusy,
                      ]}
                    >
                      {place.queueStatus === 'gavjum'
                        ? `Gavjum (${place.queueCount} kishi)`
                        : `Kam (${place.queueCount} kishi)`}
                    </Text>
                  </Text>
                </View>

                <View style={styles.detailsAction}>
                  <Text style={styles.detailsText}>Batafsil</Text>
                  <ArrowRightIcon size={14} color={Colors.primary} />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primary,
  },
  locationDropdown: {
    marginTop: 2,
  },
  locationText: {
    fontSize: 12,
    color: Colors.secondaryText,
    fontWeight: '500',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.lightBlueBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 14,
    color: Colors.primary,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 3,
    marginTop: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.borderNormal,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeSegmentBtn: {
    backgroundColor: Colors.primary,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.secondaryText,
  },
  activeSegmentText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  searchBar: {
    marginBottom: 14,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  countText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primary,
  },
  sortText: {
    fontSize: 12,
    color: Colors.secondaryText,
    fontWeight: '500',
  },
  cardsContainer: {
    gap: 12,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderNormal,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  cardTopRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatarBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.lightBlueBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardMainInfo: {
    flex: 1,
  },
  placeName: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  metaDot: {
    fontSize: 12,
    color: Colors.borderNormal,
    marginHorizontal: 6,
  },
  distanceText: {
    fontSize: 12,
    color: Colors.secondaryText,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  openBadge: {
    backgroundColor: Colors.successLightBg,
  },
  breakBadge: {
    backgroundColor: Colors.amberRecBg,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  openText: {
    color: Colors.success,
  },
  breakText: {
    color: '#D97706',
  },
  queueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingTop: 10,
  },
  queueInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  queueLabel: {
    fontSize: 12,
    color: Colors.bodyMuted,
  },
  queueBold: {
    fontWeight: '800',
    color: Colors.success,
  },
  queueBusy: {
    color: Colors.danger,
  },
  detailsAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailsText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.primary,
  },
});
