import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LegalHeader } from '../../../components/common/LegalHeader';
import { CustomButton } from '../../../components/common/CustomButton';
import { Badge } from '../../../components/common/Badge';
import { ShieldAlertIcon, ShieldCheckIcon } from '../components/RadarIcons';
import { VerificationResult } from '../../../types/fraudRadar.types';
import { Colors } from '../../../theme/colors';

interface FraudRadarResultScreenProps {
  result: VerificationResult;
  onBack: () => void;
  onNewCheck: () => void;
  onStartCyberReport: (target: string) => void;
}

export const FraudRadarResultScreen: React.FC<FraudRadarResultScreenProps> = ({
  result,
  onBack,
  onNewCheck,
  onStartCyberReport,
}) => {
  const isSafe = result.isSafe;

  return (
    <View style={styles.safeArea}>
      <StatusBar style="dark" />
      <LegalHeader
        title="Tekshiruv Natijasi"
        showBack={true}
        showClose={false}
        onBack={onBack}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Status Card (Shield + Verdict) */}
        <View style={styles.statusCard}>
          <View style={styles.shieldWrapper}>
            {isSafe ? (
              <ShieldCheckIcon size={76} color={Colors.success} />
            ) : (
              <ShieldAlertIcon size={76} color={Colors.accent} />
            )}
          </View>

          <Text
            style={[
              styles.statusTitle,
              isSafe ? styles.safeTitleText : styles.dangerTitleText,
            ]}
          >
            {result.title}
          </Text>

          <Text style={styles.statusSubtitle}>{result.subtitle}</Text>
        </View>

        {/* Details Table Card */}
        <View style={styles.detailsCard}>
          {result.details.map((item, index) => {
            const isRiskRow = item.label.includes('Xavf darajasi');
            return (
              <View
                key={index}
                style={[
                  styles.tableRow,
                  index === result.details.length - 1 && styles.lastTableRow,
                ]}
              >
                <Text style={styles.rowLabel}>{item.label}</Text>
                {isRiskRow ? (
                  <Badge
                    label={item.value}
                    variant={isSafe ? 'green' : 'red'}
                  />
                ) : (
                  <Text style={styles.rowValue}>{item.value}</Text>
                )}
              </View>
            );
          })}
        </View>

        {/* Recommendation Box */}
        <View
          style={[
            styles.recommendationCard,
            isSafe ? styles.safeRecCard : styles.dangerRecCard,
          ]}
        >
          <Text
            style={[
              styles.recommendationText,
              isSafe ? styles.safeRecText : styles.dangerRecText,
            ]}
          >
            {result.recommendation}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {!isSafe && (
            <CustomButton
              title="IIVga ariza shakllantirish (Cyber102) 🚨"
              variant="accent"
              onPress={() => onStartCyberReport(result.query)}
              style={styles.cyberBtn}
            />
          )}

          <CustomButton
            title="Boshqa rekvizitni tekshirish"
            variant={isSafe ? 'primary' : 'outline'}
            onPress={onNewCheck}
            style={[styles.newCheckBtn, isSafe && styles.safeDarkBtn]}
            textStyle={isSafe ? styles.safeDarkBtnText : styles.outlineBtnText}
          />
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
    padding: 16,
    paddingBottom: 24,
  },
  statusCard: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: Colors.borderNormal,
    alignItems: 'center',
    marginBottom: 14,
  },
  shieldWrapper: {
    marginBottom: 12,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  dangerTitleText: {
    color: Colors.primary,
  },
  safeTitleText: {
    color: Colors.success,
  },
  statusSubtitle: {
    fontSize: 12,
    color: Colors.secondaryText,
    textAlign: 'center',
    lineHeight: 17,
  },
  detailsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderNormal,
    marginBottom: 14,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  lastTableRow: {
    borderBottomWidth: 0,
    paddingBottom: 2,
  },
  rowLabel: {
    fontSize: 13,
    color: Colors.secondaryText,
  },
  rowValue: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  recommendationCard: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
  },
  dangerRecCard: {
    backgroundColor: Colors.amberRecBg,
    borderColor: 'rgba(250, 161, 0, 0.35)',
  },
  safeRecCard: {
    backgroundColor: Colors.lightBlueBg,
    borderColor: Colors.borderNormal,
  },
  recommendationText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
  },
  dangerRecText: {
    color: '#92400E',
  },
  safeRecText: {
    color: Colors.primary,
  },
  actionsContainer: {
    gap: 10,
  },
  cyberBtn: {
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.accent,
  },
  newCheckBtn: {
    height: 48,
    borderRadius: 14,
  },
  safeDarkBtn: {
    backgroundColor: Colors.primary,
  },
  safeDarkBtnText: {
    color: Colors.surface,
    fontWeight: '700',
  },
  outlineBtnText: {
    color: Colors.primary,
    fontWeight: '700',
  },
});
