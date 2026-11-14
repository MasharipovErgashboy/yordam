import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../../../theme/colors';
import { LegalHeader } from '../../../components/common/LegalHeader';
import { CustomButton } from '../../../components/common/CustomButton';
import { Badge } from '../../../components/common/Badge';
import {
  ClockIcon,
  MapPinIcon,
  VerifiedCheckIcon,
  ScalesIcon,
  PhoneIcon,
  RouteIcon,
} from '../../../components/common/Icons';
import {
  MOCK_CURRENT_TICKET,
  MOCK_APPOINTMENT_BOOKING,
} from '../../../mock/legalMapData';
import { AppointmentBooking } from '../../../types/legalMap.types';

interface LegalMapTicketScreenProps {
  onBack: () => void;
  onCancelQueue: () => void;
}

export const LegalMapTicketScreen: React.FC<LegalMapTicketScreenProps> = ({
  onBack,
  onCancelQueue,
}) => {
  const [activeTab, setActiveTab] = useState<'booking' | 'ticket'>('booking');
  const [booking, setBooking] = useState<AppointmentBooking>(MOCK_APPOINTMENT_BOOKING);
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);

  // New booking form state
  const [selectedDate, setSelectedDate] = useState('Bugun, 14-Noyabr');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('15:30 - 16:00');
  const [selectedService, setSelectedService] = useState('Yuridik konsultatsiya');

  const ticket = MOCK_CURRENT_TICKET;

  const dateOptions = [
    'Bugun, 14-Noyabr',
    'Ertaga, 15-Noyabr',
    'Dushanba, 17-Noyabr',
  ];

  const timeOptions = [
    '10:00 - 10:30',
    '11:30 - 12:00',
    '14:00 - 14:30',
    '15:30 - 16:00',
    '16:30 - 17:00',
  ];

  const serviceOptions = [
    'Yuridik konsultatsiya',
    'Oldi-sotdi shartnomasi',
    'Ishonchnoma tasdiqlash',
    'Sudga ariza tayyorlash',
  ];

  const handleConfirmNewBooking = () => {
    const newCode = `#BRON-${Math.floor(1000 + Math.random() * 9000)}`;
    setBooking({
      ...booking,
      bookingCode: newCode,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      serviceName: selectedService,
      status: 'confirmed',
    });
    setIsNewBookingModalOpen(false);
    Alert.alert(
      'Qabul muvaffaqiyatli band qilindi!',
      `Sizga ${selectedDate} soat ${selectedTimeSlot} ga qabul belgilandi. Bron kodi: ${newCode}`
    );
  };

  const handleCancelBooking = () => {
    Alert.alert(
      'Qabulni bekor qilish',
      'Haqiqatan ham ushbu qabulni bekor qilmoqchimisiz?',
      [
        { text: 'Yo‘q', style: 'cancel' },
        {
          text: 'Ha, bekor qilish',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Bekor qilindi', 'Qabul muvaffaqiyatli bekor qilindi.');
            onBack();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar style="dark" />
      <LegalHeader
        title="LegalMap"
        badgeText="Navbat va Qabul"
        showBack={false}
        showClose={false}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Tizim tanlash segmentli tablosi */}
        <View style={styles.segmentContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveTab('booking')}
            style={[
              styles.segmentBtn,
              activeTab === 'booking' && styles.activeSegmentBtn,
            ]}
          >
            <Text
              style={[
                styles.segmentText,
                activeTab === 'booking' && styles.activeSegmentText,
              ]}
            >
              Qabulga yozilish (Bron)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveTab('ticket')}
            style={[
              styles.segmentBtn,
              activeTab === 'ticket' && styles.activeSegmentBtn,
            ]}
          >
            <Text
              style={[
                styles.segmentText,
                activeTab === 'ticket' && styles.activeSegmentText,
              ]}
            >
              Elektron talon (A-14)
            </Text>
          </TouchableOpacity>
        </View>

        {/* 1-VARIANT: QABULGA YOZILISH (BRON TIZIMI - KIOSKSIZ IDORALAR VA ADVOKATLAR UCHUN) */}
        {activeTab === 'booking' && (
          <View style={styles.bookingCard}>
            {/* Status Header */}
            <View style={styles.bookingTopRow}>
              <Badge
                label="Tasdiqlangan qabul"
                variant="green"
                icon={<VerifiedCheckIcon size={14} color={Colors.success} />}
              />
              <Text style={styles.bookingCodeText}>{booking.bookingCode}</Text>
            </View>

            {/* Org info */}
            <Text style={styles.orgName}>{booking.organizationName}</Text>
            <View style={styles.addressRow}>
              <MapPinIcon size={14} color={Colors.secondaryText} />
              <Text style={styles.orgAddress}>{booking.address}</Text>
            </View>

            <View style={styles.separator} />

            {/* Appointment Details Grid */}
            <View style={styles.detailsBox}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Qabul sanasi:</Text>
                <Text style={styles.detailValueBold}>{booking.date}</Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Belgilangan vaqt:</Text>
                <View style={styles.timeHighlightBox}>
                  <ClockIcon size={14} color={Colors.primary} />
                  <Text style={styles.timeHighlightText}>{booking.timeSlot}</Text>
                </View>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Mutaxassis:</Text>
                <Text style={styles.detailValue}>{booking.specialistName}</Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Xizmat turi:</Text>
                <Text style={styles.detailValue}>{booking.serviceName}</Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Xona / Qabul joyi:</Text>
                <Text style={styles.detailValueBold}>{booking.room}</Text>
              </View>
            </View>

            {/* Hint Note for Non-kiosk Offices */}
            <View style={styles.hintNoticeBox}>
              <Text style={styles.hintNoticeText}>
                💡 <Text style={styles.hintBold}>Eslatma:</Text> Mazkur idorada elektron kiosk tizimi yo‘qligi sababli, qabul oldindan belgilangan vaqt bo‘yicha amalga oshiriladi. Iltimos, belgilangan vaqtdan 10 daqiqa oldin shaxsingizni tasdiqlovchi hujjat bilan kelishingizni so‘raymiz.
              </Text>
            </View>

            {/* Actions inside booking */}
            <View style={styles.bookingActionsCol}>
              <CustomButton
                title="+ Yangi vaqtga qabul belgilash"
                variant="primary"
                onPress={() => setIsNewBookingModalOpen(true)}
                style={styles.newBookingBtn}
              />

              <CustomButton
                title="Qabulni bekor qilish"
                variant="danger-outline"
                onPress={handleCancelBooking}
                style={styles.cancelBookingBtn}
              />
            </View>
          </View>
        )}

        {/* 2-VARIANT: ELEKTRON TALON (A-14) - KIOSK VA DISPLAY BOR DXM/NOTARIUSLAR UCHUN */}
        {activeTab === 'ticket' && (
          <View style={styles.ticketCard}>
            <Text style={styles.orgName}>{ticket.organizationName}</Text>
            <View style={styles.addressRow}>
              <MapPinIcon size={14} color={Colors.secondaryText} />
              <Text style={styles.orgAddress}>{ticket.address}</Text>
            </View>

            <View style={styles.separator} />

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
                Kiosk va elektron tablolar uchun QR-talon
              </Text>
            </View>

            <CustomButton
              title="Navbatni bekor qilish"
              variant="danger-outline"
              onPress={onCancelQueue}
              style={styles.cancelBtn}
            />
          </View>
        )}
      </ScrollView>

      {/* NEW APPOINTMENT MODAL */}
      <Modal
        visible={isNewBookingModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsNewBookingModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Qabulga oldindan yozilish</Text>
              <TouchableOpacity
                onPress={() => setIsNewBookingModalOpen(false)}
                style={styles.modalCloseBtn}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Sana tanlash */}
              <Text style={styles.inputGroupTitle}>Qabul sanasini tanlang:</Text>
              <View style={styles.optionsWrap}>
                {dateOptions.map((date) => (
                  <TouchableOpacity
                    key={date}
                    activeOpacity={0.8}
                    onPress={() => setSelectedDate(date)}
                    style={[
                      styles.choiceChip,
                      selectedDate === date && styles.activeChoiceChip,
                    ]}
                  >
                    <Text
                      style={[
                        styles.choiceChipText,
                        selectedDate === date && styles.activeChoiceChipText,
                      ]}
                    >
                      {date}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Vaqt sloti tanlash */}
              <Text style={styles.inputGroupTitle}>Qabul vaqtini tanlang:</Text>
              <View style={styles.optionsWrap}>
                {timeOptions.map((time) => (
                  <TouchableOpacity
                    key={time}
                    activeOpacity={0.8}
                    onPress={() => setSelectedTimeSlot(time)}
                    style={[
                      styles.choiceChip,
                      selectedTimeSlot === time && styles.activeChoiceChip,
                    ]}
                  >
                    <Text
                      style={[
                        styles.choiceChipText,
                        selectedTimeSlot === time && styles.activeChoiceChipText,
                      ]}
                    >
                      {time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Xizmat turi */}
              <Text style={styles.inputGroupTitle}>Xizmat turini tanlang:</Text>
              <View style={styles.optionsWrap}>
                {serviceOptions.map((srv) => (
                  <TouchableOpacity
                    key={srv}
                    activeOpacity={0.8}
                    onPress={() => setSelectedService(srv)}
                    style={[
                      styles.choiceChip,
                      selectedService === srv && styles.activeChoiceChip,
                    ]}
                  >
                    <Text
                      style={[
                        styles.choiceChipText,
                        selectedService === srv && styles.activeChoiceChipText,
                      ]}
                    >
                      {srv}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <CustomButton
                title="Qabulni tasdiqlash"
                variant="primary"
                onPress={handleConfirmNewBooking}
                style={styles.modalConfirmBtn}
              />
            </View>
          </View>
        </View>
      </Modal>
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
    alignItems: 'center',
  },
  segmentContainer: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: Colors.lightBlueBg,
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeSegmentBtn: {
    backgroundColor: Colors.surface,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.secondaryText,
  },
  activeSegmentText: {
    color: Colors.primary,
    fontWeight: '700',
  },
  bookingCard: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.borderNormal,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  bookingTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  bookingCodeText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primary,
    backgroundColor: Colors.lightBlueBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
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
    fontSize: 17,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 6,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
  },
  orgAddress: {
    fontSize: 12,
    color: Colors.bodyMuted,
    flex: 1,
  },
  separator: {
    width: '100%',
    height: 1,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    borderStyle: 'dashed',
    marginVertical: 14,
  },
  detailsBox: {
    backgroundColor: Colors.canvas,
    borderRadius: 14,
    padding: 14,
    gap: 10,
    marginBottom: 14,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 13,
    color: Colors.secondaryText,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.bodyMuted,
  },
  detailValueBold: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  timeHighlightBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.lightBlueBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  timeHighlightText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.primary,
  },
  hintNoticeBox: {
    backgroundColor: '#FFF9E6',
    borderWidth: 1,
    borderColor: '#FFE082',
    borderRadius: 12,
    padding: 12,
    marginBottom: 18,
  },
  hintNoticeText: {
    fontSize: 12,
    color: '#8D6E63',
    lineHeight: 18,
  },
  hintBold: {
    fontWeight: '700',
    color: '#E65100',
  },
  bookingActionsCol: {
    gap: 10,
    width: '100%',
  },
  newBookingBtn: {
    width: '100%',
  },
  cancelBookingBtn: {
    width: '100%',
  },
  numberSection: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 8,
  },
  ticketLabel: {
    fontSize: 13,
    color: Colors.bodyMuted,
    marginBottom: 6,
  },
  bigTicketNumber: {
    fontSize: 54,
    fontWeight: '900',
    color: Colors.primary,
    letterSpacing: 2,
    marginBottom: 14,
  },
  timingInfo: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  estimatedTimeText: {
    fontSize: 12,
    color: Colors.bodyMuted,
  },
  peopleAheadText: {
    fontSize: 12,
    color: Colors.bodyMuted,
  },
  boldTime: {
    fontWeight: '700',
    color: Colors.primary,
  },
  progressBarTrack: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.lightBlueBg,
    overflow: 'hidden',
  },
  progressBarFill: {
    width: '65%',
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 4,
  },
  qrSection: {
    alignItems: 'center',
    marginVertical: 18,
  },
  qrBox: {
    width: 140,
    height: 140,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 16,
    padding: 8,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  qrCornerTopLeft: {
    position: 'absolute',
    top: 6,
    left: 6,
    width: 20,
    height: 20,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: Colors.primary,
  },
  qrCornerTopRight: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: Colors.primary,
  },
  qrCornerBottomLeft: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    width: 20,
    height: 20,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: Colors.primary,
  },
  qrCornerBottomRight: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 20,
    height: 20,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: Colors.primary,
  },
  qrInner: {
    width: 80,
    height: 80,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'space-between',
  },
  qrBlock: {
    width: 28,
    height: 28,
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  qrCenterBadge: {
    position: 'absolute',
    top: 26,
    left: 10,
    right: 10,
    backgroundColor: Colors.accent,
    borderRadius: 4,
    paddingVertical: 2,
    alignItems: 'center',
  },
  qrBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  qrCaption: {
    fontSize: 11,
    color: Colors.bodyMuted,
  },
  cancelBtn: {
    width: '100%',
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primary,
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalCloseText: {
    fontSize: 20,
    color: Colors.secondaryText,
  },
  inputGroupTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
    marginTop: 12,
    marginBottom: 8,
  },
  optionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  choiceChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: Colors.lightBlueBg,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeChoiceChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  choiceChipText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600',
  },
  activeChoiceChipText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  modalFooter: {
    marginTop: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  modalConfirmBtn: {
    width: '100%',
  },
});
