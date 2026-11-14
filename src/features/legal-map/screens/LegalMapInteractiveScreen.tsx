import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../../../theme/colors';
import { LegalHeader } from '../../../components/common/LegalHeader';
import { SearchInput } from '../../../components/common/SearchInput';
import { CustomButton } from '../../../components/common/CustomButton';
import { GOOGLE_MAPS_CONFIG } from '../../../config/maps';
import {
  StarIcon,
  VerifiedCheckIcon,
  RouteIcon,
  PhoneIcon,
  NotaryStampIcon,
  FhdyoIcon,
  ScalesIcon,
  BuildingIcon,
} from '../../../components/common/Icons';
import { MOCK_LEGAL_PLACES } from '../../../mock/legalMapData';
import { LegalPlace, LegalCategory } from '../../../types/legalMap.types';

interface LegalMapInteractiveScreenProps {
  initialCategory?: LegalCategory;
  onSelectPlace: (place: LegalPlace) => void;
  onSwitchToList: () => void;
  onCall: (phone: string) => void;
  onRoute: (place: LegalPlace) => void;
}

export const LegalMapInteractiveScreen: React.FC<LegalMapInteractiveScreenProps> = ({
  initialCategory = 'all',
  onSelectPlace,
  onSwitchToList,
  onCall,
  onRoute,
}) => {
  const [activeCategory, setActiveCategory] = useState<LegalCategory>(initialCategory);
  const [selectedPlace, setSelectedPlace] = useState<LegalPlace>(MOCK_LEGAL_PLACES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapViewMode, setMapViewMode] = useState<'google' | 'pins'>('google');

  useEffect(() => {
    setActiveCategory(initialCategory);
  }, [initialCategory]);

  const filterChips: { id: LegalCategory; label: string }[] = [
    { id: 'all', label: 'Barchasi' },
    { id: 'notary', label: 'Notariuslar' },
    { id: 'fhdyo', label: 'FHDYo' },
    { id: 'lawyer', label: 'Advokatlar' },
    { id: 'dxm', label: 'DXM' },
  ];

  const filteredPlaces = MOCK_LEGAL_PLACES.filter((p) => {
    const matchesCat = activeCategory === 'all' || p.category === activeCategory;
    const matchesQuery =
      !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  useEffect(() => {
    if (filteredPlaces.length > 0 && !filteredPlaces.some((p) => p.id === selectedPlace.id)) {
      setSelectedPlace(filteredPlaces[0]);
    }
  }, [activeCategory, searchQuery, filteredPlaces, selectedPlace.id]);

  return (
    <View style={styles.safeArea}>
      <StatusBar style="dark" />

      {/* Header: LegalMap */}
      <LegalHeader
        title="LegalMap"
        badgeText="Interaktiv xarita"
        showBack={false}
        showClose={false}
      />

      {/* Top Search & Filter Bar */}
      <View style={styles.topControlContainer}>
        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Notarius, FHDYo, advokat qidirish..."
          style={styles.searchBar}
        />

        {/* Categories horizontal scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsScroll}
        >
          {filterChips.map((chip) => {
            const isActive = activeCategory === chip.id;
            return (
              <TouchableOpacity
                key={chip.id}
                activeOpacity={0.8}
                onPress={() => setActiveCategory(chip.id)}
                style={[styles.chip, isActive && styles.activeChip]}
              >
                <Text style={[styles.chipText, isActive && styles.activeChipText]}>
                  {chip.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Map Interactive Canvas */}
      <View style={styles.mapArea}>
        <View style={styles.mapCanvas}>
          {mapViewMode === 'google' && Platform.OS === 'web' ? (
            <View style={StyleSheet.absoluteFill}>
              <iframe
                title="Google Maps"
                src={GOOGLE_MAPS_CONFIG.getEmbedUrl(
                  selectedPlace.coordinates.latitude,
                  selectedPlace.coordinates.longitude,
                  16,
                  selectedPlace.name
                )}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
                loading="lazy"
              />
            </View>
          ) : (
            <>
              {/* Simulated city grid roads */}
              <View style={[styles.mapRoad, { top: '30%', width: '100%', height: 16 }]} />
              <View style={[styles.mapRoad, { top: '65%', width: '100%', height: 20 }]} />
              <View style={[styles.mapRoadVertical, { left: '25%', height: '100%', width: 14 }]} />
              <View style={[styles.mapRoadVertical, { left: '70%', height: '100%', width: 18 }]} />
              <View style={styles.mapRoadDiagonal} />

              {/* User Location Pulse Marker */}
              <View style={styles.userLocationContainer}>
                <View style={styles.userPulseRing} />
                <View style={styles.userLocationDot}>
                  <View style={styles.userInnerDot} />
                </View>
              </View>

              {/* Interactive Place Markers */}
              {filteredPlaces.map((place, index) => {
                const isSelected = selectedPlace.id === place.id;
                const positions = [
                  { top: '38%' as const, left: '50%' as const },
                  { top: '22%' as const, left: '28%' as const },
                  { top: '55%' as const, left: '75%' as const },
                  { top: '26%' as const, left: '80%' as const },
                ];
                const pos = positions[index % positions.length];

                return (
                  <TouchableOpacity
                    key={place.id}
                    activeOpacity={0.9}
                    onPress={() => setSelectedPlace(place)}
                    style={[
                      styles.markerContainer,
                      { top: pos.top, left: pos.left },
                      isSelected && styles.selectedMarkerContainer,
                    ]}
                  >
                    <View style={[styles.markerPin, isSelected && styles.selectedMarkerPin]}>
                      {place.category === 'notary' && <NotaryStampIcon size={18} color="#FFFFFF" />}
                      {place.category === 'fhdyo' && <FhdyoIcon size={18} color="#FFFFFF" />}
                      {place.category === 'lawyer' && <ScalesIcon size={18} color="#FFFFFF" />}
                      {place.category === 'dxm' && <BuildingIcon size={18} color="#FFFFFF" />}
                    </View>
                    {isSelected && <View style={styles.markerArrow} />}
                  </TouchableOpacity>
                );
              })}
            </>
          )}

          {/* Floating Controls */}
          <View style={styles.floatingControls}>
            <View style={styles.floatingLeftControls}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setMapViewMode(mapViewMode === 'google' ? 'pins' : 'google')}
                style={styles.floatingMapToggle}
              >
                <Text style={styles.floatingMapToggleText}>
                  {mapViewMode === 'google' ? '📌 Sxema' : '🗺️ Google Maps'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={onSwitchToList}
                style={styles.floatingListToggle}
              >
                <Text style={styles.floatingListToggleText}>Ro‘yxat</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setSelectedPlace(filteredPlaces[0] || MOCK_LEGAL_PLACES[0])}
              style={styles.recenterButton}
            >
              <View style={styles.recenterCrosshair} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Floating Place Card */}
        {selectedPlace && (
          <View style={styles.bottomCardContainer}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => onSelectPlace(selectedPlace)}
              style={styles.cardHeader}
            >
              <View style={styles.cardTitleRow}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {selectedPlace.name}
                </Text>
                <VerifiedCheckIcon size={16} color={Colors.primary} />
              </View>

              <View style={styles.cardMetaRow}>
                <View style={styles.ratingBox}>
                  <StarIcon size={13} color={Colors.accent} />
                  <Text style={styles.ratingText}>
                    {selectedPlace.rating} ({selectedPlace.reviewCount} sharh)
                  </Text>
                </View>
                <Text style={styles.metaDot}>•</Text>
                <Text style={styles.metaText}>{selectedPlace.distance}</Text>
                <Text style={styles.metaDot}>•</Text>
                <Text style={styles.openStatusText}>
                  {selectedPlace.isOpen ? 'Hozir ochiq' : 'Tushlik'}
                </Text>
              </View>

              <View style={styles.queueInfoRow}>
                <Text style={styles.queueInfoText}>
                  Navbat:{' '}
                  <Text style={styles.queueBold}>
                    {selectedPlace.queueStatus === 'gavjum' ? 'Gavjum' : 'Kam'} (
                    {selectedPlace.queueCount} kishi)
                  </Text>
                </Text>
                <View style={styles.liveQueueBadge}>
                  <Text style={styles.liveQueueText}>Jonli navbat</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Buttons Row: Marshrut & Qo'ng'iroq */}
            <View style={styles.actionsRow}>
              <CustomButton
                title="Marshrut"
                variant="primary"
                icon={<RouteIcon size={16} color="#FFFFFF" />}
                onPress={() => onRoute(selectedPlace)}
                style={styles.routeBtn}
              />
              <CustomButton
                title="Qo‘ng‘iroq"
                variant="outline"
                icon={<PhoneIcon size={16} color={Colors.primary} />}
                onPress={() => onCall(selectedPlace.phone)}
                style={styles.callBtn}
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  topControlContainer: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    zIndex: 10,
  },
  searchBar: {
    marginBottom: 10,
  },
  chipsScroll: {
    gap: 8,
    paddingBottom: 4,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderNormal,
  },
  activeChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.secondaryText,
  },
  activeChipText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  mapArea: {
    flex: 1,
    position: 'relative',
  },
  mapCanvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.canvas,
    overflow: 'hidden',
  },
  mapRoad: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    opacity: 0.9,
  },
  mapRoadVertical: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    opacity: 0.9,
  },
  mapRoadDiagonal: {
    position: 'absolute',
    top: '10%',
    left: '-20%',
    width: '140%',
    height: 18,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '35deg' }],
    opacity: 0.9,
  },
  userLocationContainer: {
    position: 'absolute',
    top: '48%',
    left: '46%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userPulseRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.lightBlueBg,
    borderWidth: 1,
    borderColor: Colors.borderNormal,
  },
  userLocationDot: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  userInnerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  markerContainer: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 5,
  },
  selectedMarkerContainer: {
    zIndex: 10,
    transform: [{ scale: 1.15 }],
  },
  markerPin: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  selectedMarkerPin: {
    backgroundColor: Colors.accent,
  },
  markerArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: Colors.accent,
    marginTop: -1,
  },
  floatingControls: {
    position: 'absolute',
    top: 16,
    right: 16,
    left: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  floatingLeftControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  floatingMapToggle: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  floatingMapToggleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  floatingListToggle: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.borderNormal,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  floatingListToggleText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  recenterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderNormal,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  recenterCrosshair: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  bottomCardContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: Colors.borderNormal,
  },
  cardHeader: {
    marginBottom: 14,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primary,
    flex: 1,
  },
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.secondaryText,
  },
  metaDot: {
    fontSize: 12,
    color: Colors.borderNormal,
    marginHorizontal: 6,
  },
  metaText: {
    fontSize: 12,
    color: Colors.secondaryText,
  },
  openStatusText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.success,
  },
  queueInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.lightBlueBg,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  queueInfoText: {
    fontSize: 12,
    color: Colors.bodyMuted,
  },
  queueBold: {
    fontWeight: '800',
    color: Colors.primary,
  },
  liveQueueBadge: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  liveQueueText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primary,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  routeBtn: {
    flex: 1,
    height: 44,
  },
  callBtn: {
    flex: 1,
    height: 44,
  },
});
