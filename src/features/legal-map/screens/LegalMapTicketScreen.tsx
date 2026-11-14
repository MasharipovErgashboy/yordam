import React from 'react';
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
import { MOCK_CURRENT_TICKET } from '../../../mock/legalMapData';

interface LegalMapTicketScreenProps {
  onBack: () => void;
  onCancelQueue: () => void;
}

export const LegalMapTicketScreen: React.FC<LegalMapTicketScreenProps> = ({
  onBack,
  onCancelQueue,
}) => {
  const ticket = MOCK_CURRENT_TICKET;

  return (
    <View style={styles.safeArea}>
      <StatusBar style="dark" />
      <LegalHeader
        title="Mening navbatim"
        showBack={true}
        showClose={false}
        onBack={onBack}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Ticket Outer Container */}
        <View style={styles.ticketCard}>
          {/* Org Header */}
          <Text style={styles.orgName}>{ticket.organizationName}</Text>
          <Text style={styles.orgAddress}>{ticket.address}</Text>

          {/* Dotted separator line */}
          <View style={styles.separator} />

          {/* Ticket Big Number Box */}
          <View style={styles.numberSection}>
            <Text style={styles.ticketLabel}>Sizning navbat raqamingiz:</Text>
            <Text style={styles.bigTicketNumber}>{ticket.ticketNumber}</Text>

            <View style={styles.timingInfo}>
              <Text style={styles.estimatedTimeText}>
                Taxminiy kirish vaqti:{' '}
                <Text style={styles.boldTime}>{ticket.estimatedTime}</Text>
              </Text>
              <Text style={styles.peopleAheadText}>
                Oldingizda kutmoqda:{' '}
                <Text style={styles.boldTime}>{ticket.peopleAhead} kishi</Text>
              </Text>
            </View>

            {/* Progress bar */}
            <View style={styles.progressBarTrack}>
              <View style={styles.progressBarFill} />
            </View>
          </View>

          {/* QR Code Section */}
          <View style={styles.qrSection}>
            <View style={styles.qrBox}>
              <View style={styles.qrCornerTopLeft} />
              <View style={styles.qrCornerTopRight} />
              <View style={styles.qrCornerBottomLeft} />
              <View style={styles.qrCornerBottomRight} />

              <View style={styles.qrInner}>
                <View style={styles.qrBlock} />
                <View style={styles.qrBlock} />
                <View style={styles.qrCenterBadge}>
                  <Text style={styles.qrBadgeText}>NAMUNA</Text>
                </View>
                <View style={styles.qrBlock} />
                <View style={styles.qrBlock} />
              </View>
            </View>
            <Text style={styles.qrCaption}>
              QR-kod namunasi - skanerlash uchun emas
            </Text>
          </View>
        </View>

        {/* Cancel Queue Action */}
        <CustomButton
          title="Navbatni bekor qilish"
          variant="danger-outline"
          onPress={onCancelQueue}
          style={styles.cancelBtn}
        />
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
    padding: 20,
    alignItems: 'center',
  },
  ticketCard: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: Colors.borderNormal,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 24,
  },
  orgName: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 4,
  },
  orgAddress: {
    fontSize: 12,
    color: Colors.bodyMuted,
    textAlign: 'center',
  },
  separator: {
    width: '100%',
    height: 1,
    borderWidth: 1,
    borderColor: Colors.borderNormal,
    borderStyle: 'dashed',
    marginVertical: 18,
  },
  numberSection: {
    alignItems: 'center',
    width: '100%',
  },
  ticketLabel: {
    fontSize: 13,
    color: Colors.secondaryText,
    marginBottom: 8,
  },
  bigTicketNumber: {
    fontSize: 58,
    fontWeight: '900',
    color: Colors.primary,
    letterSpacing: 2,
    lineHeight: 68,
  },
  timingInfo: {
    marginTop: 10,
    alignItems: 'center',
    gap: 4,
  },
  estimatedTimeText: {
    fontSize: 13,
    color: Colors.primary,
  },
  peopleAheadText: {
    fontSize: 13,
    color: Colors.secondaryText,
  },
  boldTime: {
    fontWeight: '800',
    color: Colors.primary,
  },
  progressBarTrack: {
    width: '80%',
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.queueProgressTrack,
    marginTop: 14,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    width: '65%',
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 4,
  },
  qrSection: {
    marginTop: 18,
    alignItems: 'center',
  },
  qrBox: {
    width: 140,
    height: 140,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.borderNormal,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    padding: 10,
  },
  qrCornerTopLeft: {
    position: 'absolute',
    top: 6,
    left: 6,
    width: 24,
    height: 24,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: Colors.primary,
  },
  qrCornerTopRight: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: Colors.primary,
  },
  qrCornerBottomLeft: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    width: 24,
    height: 24,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: Colors.primary,
  },
  qrCornerBottomRight: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 24,
    height: 24,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: Colors.primary,
  },
  qrInner: {
    width: '75%',
    height: '75%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  qrBlock: {
    width: 16,
    height: 16,
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  qrCenterBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  qrBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  qrCaption: {
    fontSize: 11,
    color: Colors.bodyMuted,
    marginTop: 10,
    textAlign: 'center',
  },
  cancelBtn: {
    width: '100%',
    height: 48,
  },
});
