import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../../../theme/colors';
import { LegalHeader } from '../../../components/common/LegalHeader';
import { CustomButton } from '../../../components/common/CustomButton';
import { Badge } from '../../../components/common/Badge';
import {
  StarIcon,
  VerifiedCheckIcon,
  RouteIcon,
  PhoneIcon,
  ClockIcon,
  MapPinIcon,
  NotaryStampIcon,
  UsersIcon,
} from '../../../components/common/Icons';
import { LegalPlace } from '../../../types/legalMap.types';

interface LegalMapDetailScreenProps {
  place: LegalPlace;
  onBack: () => void;
  onGetTicket: (place: LegalPlace) => void;
  onCall: (phone: string) => void;
  onRoute: (place: LegalPlace) => void;
}

export const LegalMapDetailScreen: React.FC<LegalMapDetailScreenProps> = ({
  place,
  onBack,
  onGetTicket,
  onCall,
  onRoute,
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  return (
    <View style={styles.safeArea}>
      <StatusBar style="dark" />

      {/* Header */}
      <LegalHeader
        title="Tashkilot haqida"
        showBack={true}
        showClose={false}
        showBookmark={true}
        onBack={onBack}
        onBookmark={() => setIsBookmarked(!isBookmarked)}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Organization Info Card */}
        <View style={styles.headerCard}>
          <View style={styles.avatarRow}>
            <View style={styles.avatarBox}>
              <NotaryStampIcon size={26} color={Colors.primary} />
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.title}>{place.name}</Text>
              <View style={styles.verifiedBadge}>
                <VerifiedCheckIcon size={14} color={Colors.primary} />
                <Text style={styles.verifiedText}>Adliya vazirligi tasdiqlagan</Text>
              </View>
            </View>
          </View>

          {/* Rating & Working Hours */}
          <View style={styles.statusRow}>
            <View style={styles.ratingBadge}>
              <StarIcon size={14} color={Colors.accent} />
              <Text style={styles.ratingText}>
                {place.rating} ({place.reviewCount} sharh)
              </Text>
            </View>
            <Badge
              label={place.statusText}
              variant="green"
              icon={<ClockIcon size={12} color={Colors.success} />}
            />
          </View>
        </View>

        {/* E-navbat & Qabul Live Block */}
        <View style={styles.queueCard}>
          <View style={styles.queueHeader}>
            <UsersIcon size={18} color={Colors.primary} />
            <Text style={styles.queueTitle}>
              {place.hasElectronicQueue === false
                ? 'Qabul tartibi: Oldindan yozilish (Bron)'
                : (
                  <>
                    Hozir navbatda: <Text style={styles.queueBold}>{place.queueCount} kishi</Text>
                  </>
                )}
            </Text>
          </View>
          <Text style={styles.queueSubtitle}>
            {place.hasElectronicQueue === false
              ? 'Ushbu idorada elektron kiosk yo‘q. Qabul vaqti oldindan band qilinadi.'
              : `Taxminiy kutish vaqti: ~${place.queueCount * 4} daqiqa`}
          </Text>

          <CustomButton
            title={
              place.hasElectronicQueue === false
                ? 'Qabulga yozilish (Bron qilish)'
                : 'Onlayn navbat olish (E-navbat)'
            }
            variant="accent"
            onPress={() => onGetTicket(place)}
            style={styles.ticketBtn}
          />
        </View>

        {/* Ma'lumotlar Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Ma’lumotlar</Text>

          {/* Address */}
          <View style={styles.infoItem}>
            <View style={styles.infoIconBox}>
              <MapPinIcon size={18} color={Colors.primary} />
            </View>
            <View style={styles.infoTextBox}>
              <Text style={styles.infoLabel}>Manzil</Text>
              <Text style={styles.infoValue}>{place.address}</Text>
            </View>
          </View>

          {/* Working hours */}
          <View style={styles.infoItem}>
            <View style={styles.infoIconBox}>
              <ClockIcon size={18} color={Colors.primary} />
            </View>
            <View style={styles.infoTextBox}>
              <Text style={styles.infoLabel}>Ish vaqti</Text>
              <Text style={styles.infoValue}>{place.workingHours}</Text>
            </View>
          </View>

          {/* Notary official */}
          <View style={[styles.infoItem, styles.lastItem]}>
            <View style={styles.infoIconBox}>
              <NotaryStampIcon size={18} color={Colors.primary} />
            </View>
            <View style={styles.infoTextBox}>
              <Text style={styles.infoLabel}>{place.categoryLabel}</Text>
              <Text style={styles.infoValue}>{place.official}</Text>
            </View>
          </View>
        </View>

        {/* Rasmiy to'lovlar Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Rasmiy to‘lovlar</Text>

          {place.fees.map((fee, index) => (
            <View
              key={index}
              style={[
                styles.feeRow,
                index === place.fees.length - 1 && styles.lastFeeRow,
              ]}
            >
              <Text style={styles.feeTitle}>{fee.title}</Text>
              <Text style={styles.feePrice}>{fee.price}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View style={styles.bottomBar}>
        <CustomButton
          title="Marshrut"
          variant="primary"
          icon={<RouteIcon size={18} color="#FFFFFF" />}
          onPress={() => onRoute(place)}
          style={styles.bottomBtn}
        />
        <CustomButton
          title="Qo‘ng‘iroq"
          variant="outline"
          icon={<PhoneIcon size={18} color={Colors.primary} />}
          onPress={() => onCall(place.phone)}
          style={styles.bottomBtn}
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
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  headerCard: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderNormal,
    marginBottom: 14,
  },
  avatarRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  avatarBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: Colors.lightBlueBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.primary,
    lineHeight: 22,
    marginBottom: 4,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedText: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '600',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingTop: 12,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  queueCard: {
    backgroundColor: Colors.lightBlueBg,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.borderNormal,
  },
  queueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  queueTitle: {
    fontSize: 14,
    color: Colors.primary,
  },
  queueBold: {
    fontWeight: '800',
    color: Colors.primary,
  },
  queueSubtitle: {
    fontSize: 12,
    color: Colors.bodyMuted,
    marginBottom: 12,
    marginLeft: 26,
  },
  ticketBtn: {
    height: 46,
    borderRadius: 12,
  },
  sectionCard: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderNormal,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 14,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  lastItem: {
    marginBottom: 0,
  },
  infoIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.lightBlueBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoTextBox: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: Colors.secondaryText,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
    lineHeight: 18,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  lastFeeRow: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  feeTitle: {
    fontSize: 13,
    color: Colors.bodyMuted,
  },
  feePrice: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.primary,
  },
  bottomBar: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  bottomBtn: {
    flex: 1,
    height: 48,
  },
});
