import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../../../theme/colors';
import { LegalHeader } from '../../../components/common/LegalHeader';
import { CustomButton } from '../../../components/common/CustomButton';
import { LockIcon, AlertTriangleIcon } from '../components/RadarIcons';
import { MOCK_RADAR_STATS, MOCK_SCAM_ALERTS } from '../../../mock/fraudRadarData';

interface FraudRadarHomeScreenProps {
  onStartCheck: (initialQuery?: string) => void;
  onOpenCommunityReport: () => void;
  onViewAllAlerts: () => void;
  onClose?: () => void;
}

export const FraudRadarHomeScreen: React.FC<FraudRadarHomeScreenProps> = ({
  onStartCheck,
  onOpenCommunityReport,
  onViewAllAlerts,
  onClose,
}) => {
  const [query, setQuery] = useState('');

  return (
    <View style={styles.safeArea}>
      <StatusBar style="dark" />
      <LegalHeader
        title="Firibgarlik Radari"
        badgeText="Cyber102"
        showClose={true}
        onClose={onClose}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Main Checker Hero Card */}
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>Shubhali rekvizitni tekshiring</Text>

          {/* Input with lock */}
          <View style={styles.inputContainer}>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Karta, havola, raqam yoki matn..."
              placeholderTextColor={Colors.secondaryText}
              style={styles.input}
            />
            <LockIcon size={18} color={Colors.secondaryText} />
          </View>

          {/* Action button */}
          <CustomButton
            title="Radarda tekshirish ⚡"
            variant="accent"
            onPress={() => onStartCheck(query)}
            style={styles.checkBtn}
          />

          {/* Statistics summary */}
          <View style={styles.statsDivider} />
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Bloklangan kartalar:</Text>
              <Text style={styles.statValue}>{MOCK_RADAR_STATS.blockedCards}</Text>
            </View>
            <View style={styles.statDividerVertical} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Kraudtsorsing shikoyatlari:</Text>
              <Text style={styles.statValue}>{MOCK_RADAR_STATS.crowdsourceComplaints}</Text>
            </View>
          </View>
        </View>

        {/* Section: Yangi firibgarlik sxemalari */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Yangi firibgarlik sxemalari</Text>
            <TouchableOpacity activeOpacity={0.7} onPress={onViewAllAlerts}>
              <Text style={styles.viewAllText}>Barchasi →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.alertsList}>
            {MOCK_SCAM_ALERTS.map((alert) => (
              <View key={alert.id} style={styles.alertCard}>
                <View
                  style={[
                    styles.alertIconBox,
                    {
                      backgroundColor:
                        alert.riskLevel === 'high_risk'
                          ? Colors.dangerLightBg
                          : Colors.amberRecBg,
                    },
                  ]}
                >
                  <AlertTriangleIcon
                    size={22}
                    color={alert.riskLevel === 'high_risk' ? Colors.danger : Colors.accent}
                  />
                </View>

                <View style={styles.alertInfo}>
                  <Text style={styles.alertTitle}>{alert.title}</Text>
                  <Text style={styles.alertDesc} numberOfLines={2}>
                    {alert.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Dashed CTA Card */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onOpenCommunityReport}
          style={styles.dashedCard}
        >
          <Text style={styles.dashedCardPlus}>+</Text>
          <View style={styles.dashedCardContent}>
            <Text style={styles.dashedCardTitle}>
              Sizni aldamoqchimi? Yangi firibgarni bazaga qo‘shing
            </Text>
            <Text style={styles.dashedCardSubtitle}>
              Boshqa fuqarolarni kiber-firibgarlardan birgalikda himoya qilaylik
            </Text>
          </View>
        </TouchableOpacity>
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
    padding: 16,
    paddingBottom: 24,
  },
  heroCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.borderNormal,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 20,
    marginTop: 4,
  },
  heroTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 12,
  },
  inputContainer: {
    height: 48,
    backgroundColor: Colors.inputBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.primary,
  },
  checkBtn: {
    height: 48,
    borderRadius: 14,
    marginBottom: 14,
  },
  statsDivider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDividerVertical: {
    width: 1,
    height: 24,
    backgroundColor: Colors.borderNormal,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.secondaryText,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primary,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primary,
  },
  viewAllText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '700',
  },
  alertsList: {
    gap: 10,
  },
  alertCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.borderNormal,
  },
  alertIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  alertInfo: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 4,
  },
  alertDesc: {
    fontSize: 12,
    color: Colors.bodyMuted,
    lineHeight: 17,
  },
  dashedCard: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: Colors.borderNormal,
    borderStyle: 'dashed',
    flexDirection: 'row',
    alignItems: 'center',
  },
  dashedCardPlus: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.primary,
    marginRight: 14,
    marginLeft: 4,
  },
  dashedCardContent: {
    flex: 1,
  },
  dashedCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 2,
  },
  dashedCardSubtitle: {
    fontSize: 11,
    color: Colors.bodyMuted,
    lineHeight: 15,
  },
});
