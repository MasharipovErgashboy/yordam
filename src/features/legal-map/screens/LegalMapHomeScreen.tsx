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
import { LegalHeader } from '../../../components/common/LegalHeader';
import { SearchInput } from '../../../components/common/SearchInput';
import {
  NotaryStampIcon,
  FhdyoIcon,
  ScalesIcon,
  BuildingIcon,
  ClockIcon,
  StarIcon,
  ArrowRightIcon,
  UsersIcon,
} from '../../../components/common/Icons';
import { MOCK_LEGAL_PLACES } from '../../../mock/legalMapData';
import { LegalPlace, LegalCategory } from '../../../types/legalMap.types';

interface LegalMapHomeScreenProps {
  onSelectCategory: (category: LegalCategory) => void;
  onSelectPlace: (place: LegalPlace) => void;
  onViewAllNearby: () => void;
  onClose?: () => void;
}

export const LegalMapHomeScreen: React.FC<LegalMapHomeScreenProps> = ({
  onSelectCategory,
  onSelectPlace,
  onViewAllNearby,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const catalogItems: {
    id: string;
    title: string;
    category: LegalCategory;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'notary',
      title: 'Notariuslar',
      category: 'notary',
      icon: <NotaryStampIcon size={24} color={Colors.primary} />,
    },
    {
      id: 'fhdyo',
      title: 'FHDYo bo‘limlari',
      category: 'fhdyo',
      icon: <FhdyoIcon size={24} color={Colors.primary} />,
    },
    {
      id: 'lawyer',
      title: 'Advokatlik byurosi',
      category: 'lawyer',
      icon: <ScalesIcon size={24} color={Colors.primary} />,
    },
    {
      id: 'dxm',
      title: 'Davlat xizmatlari (DXM)',
      category: 'dxm',
      icon: <BuildingIcon size={24} color={Colors.primary} />,
    },
  ];

  const nearbyPlaces = searchQuery.trim()
    ? MOCK_LEGAL_PLACES.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : MOCK_LEGAL_PLACES.slice(0, 2);

  return (
    <View style={styles.safeArea}>
      <StatusBar style="dark" />
      <LegalHeader
        title="LegalMap"
        badgeText="Adliya Ekotizimi"
        showClose={true}
        onClose={onClose}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Search input */}
        <View style={styles.searchSection}>
          <SearchInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Tashkilot, xizmat yoki manzil qidiring..."
            onFilterPress={onViewAllNearby}
          />
        </View>

        {/* Catalog Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Xizmatlar katalogi</Text>
          <View style={styles.gridContainer}>
            {catalogItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.8}
                onPress={() => onSelectCategory(item.category)}
                style={styles.catalogCard}
              >
                <View style={styles.catalogCardHeader}>
                  <View style={styles.iconCircle}>{item.icon}</View>
                  <ArrowRightIcon size={14} color={Colors.secondaryText} />
                </View>
                <Text style={styles.catalogCardTitle}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Highlight Banner */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onViewAllNearby}
          style={styles.bannerCard}
        >
          <View style={styles.bannerContent}>
            <View style={styles.bannerBadge}>
              <Text style={styles.bannerBadgeText}>TEZKOR XIZMAT!</Text>
            </View>
            <Text style={styles.bannerTitle}>
              Yaqin atrofdagi{'\n'}navbatsiz idoralar
            </Text>
          </View>
          <View style={styles.bannerIconWrapper}>
            <ClockIcon size={32} color="#FFFFFF" />
          </View>
        </TouchableOpacity>

        {/* Nearby Places Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Yaqin atrofda</Text>
            <TouchableOpacity activeOpacity={0.7} onPress={onViewAllNearby}>
              <Text style={styles.viewAllText}>Barchasi</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.placesList}>
            {nearbyPlaces.map((place) => (
              <TouchableOpacity
                key={place.id}
                activeOpacity={0.8}
                onPress={() => onSelectPlace(place)}
                style={styles.placeCard}
              >
                <View style={styles.placeAvatar}>
                  {place.category === 'notary' ? (
                    <NotaryStampIcon size={20} color={Colors.primary} />
                  ) : place.category === 'lawyer' ? (
                    <ScalesIcon size={20} color={Colors.primary} />
                  ) : place.category === 'dxm' ? (
                    <BuildingIcon size={20} color={Colors.primary} />
                  ) : (
                    <FhdyoIcon size={20} color={Colors.primary} />
                  )}
                </View>

                <View style={styles.placeInfo}>
                  <Text style={styles.placeName} numberOfLines={1}>
                    {place.name}
                  </Text>
                  <View style={styles.placeMetaRow}>
                    <View style={styles.ratingBadge}>
                      <StarIcon size={12} color={Colors.accent} />
                      <Text style={styles.ratingText}>
                        {place.rating} ({place.reviewCount})
                      </Text>
                    </View>
                    <View style={styles.queueBadge}>
                      <UsersIcon size={12} color={Colors.primary} />
                      <Text style={styles.queueText}>
                        {place.queueCount} kishi navbatda
                      </Text>
                    </View>
                  </View>
                </View>

                <ArrowRightIcon size={16} color={Colors.secondaryText} />
              </TouchableOpacity>
            ))}
          </View>
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  searchSection: {
    marginTop: 14,
    marginBottom: 20,
  },
  section: {
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '700',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  catalogCard: {
    width: '48%',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.borderNormal,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  catalogCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.lightBlueBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catalogCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
    lineHeight: 18,
  },
  bannerCard: {
    backgroundColor: Colors.primary,
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  bannerContent: {
    flex: 1,
  },
  bannerBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  bannerBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primary,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 22,
  },
  bannerIconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  placesList: {
    gap: 10,
  },
  placeCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderNormal,
  },
  placeAvatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.lightBlueBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  placeInfo: {
    flex: 1,
  },
  placeName: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 6,
  },
  placeMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.secondaryText,
  },
  queueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.lightBlueBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  queueText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
});
