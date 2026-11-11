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
import { UploadIcon, InfoIcon } from '../components/RadarIcons';
import { CheckTargetType, VerificationResult } from '../../../types/fraudRadar.types';
import { DANGEROUS_VERIFICATION_RESULT, SAFE_VERIFICATION_RESULT } from '../../../mock/fraudRadarData';

interface FraudRadarCheckScreenProps {
  initialQuery?: string;
  onBack: () => void;
  onResultReady: (result: VerificationResult) => void;
}

export const FraudRadarCheckScreen: React.FC<FraudRadarCheckScreenProps> = ({
  initialQuery = '',
  onBack,
  onResultReady,
}) => {
  const [activeTab, setActiveTab] = useState<CheckTargetType>('card');
  const [query, setQuery] = useState(initialQuery);
  const [isDeepCheck, setIsDeepCheck] = useState(true);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const tabs: { id: CheckTargetType; label: string }[] = [
    { id: 'card', label: 'Karta' },
    { id: 'url', label: 'Havola (URL)' },
    { id: 'phone', label: 'Telefon / Matn' },
    { id: 'screenshot', label: 'Skrinshot (AI)' },
  ];

  const getPlaceholder = () => {
    switch (activeTab) {
      case 'card':
        return '8600 •••• •••• ••••';
      case 'url':
        return 'https:// yoki @telegram_bot...';
      case 'phone':
        return '+998 90 ••• •• •• yoki shubhali matn...';
      case 'screenshot':
        return 'Chek yoki yozishma matni...';
    }
  };

  const handleExecuteCheck = () => {
    const cleanQuery = query.trim();
    if (
      cleanQuery.toLowerCase().includes('payme') ||
      cleanQuery.toLowerCase().includes('click') ||
      cleanQuery.toLowerCase().includes('yordam')
    ) {
      onResultReady({
        ...SAFE_VERIFICATION_RESULT,
        query: cleanQuery || 'payme.uz',
      });
    } else {
      onResultReady({
        ...DANGEROUS_VERIFICATION_RESULT,
        query: cleanQuery || '8600 12** **** 4590',
      });
    }
  };

  const handleSimulateUpload = () => {
    setUploadedFileName('chek_skrinshot_2026.jpg (1.2 MB)');
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar style="dark" />
      <LegalHeader
        title="Radarda Tekshirish"
        showBack={true}
        showClose={false}
        onBack={onBack}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Method Switcher Tabs */}
        <View style={styles.tabContainer}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                activeOpacity={0.8}
                onPress={() => setActiveTab(tab.id)}
                style={[styles.tabBtn, isActive && styles.activeTabBtn]}
              >
                <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Input Card */}
        <View style={styles.formCard}>
          <Text style={styles.inputLabel}>
            {activeTab === 'card' && 'Karta raqami:'}
            {activeTab === 'url' && 'Havola yoki Telegram manzil:'}
            {activeTab === 'phone' && 'Telefon raqami yoki xabar:'}
            {activeTab === 'screenshot' && 'Qo‘shimcha ma’lumot:'}
          </Text>

          <View style={styles.inputWrapper}>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={getPlaceholder()}
              placeholderTextColor={Colors.secondaryText}
              keyboardType={activeTab === 'card' || activeTab === 'phone' ? 'numeric' : 'default'}
              style={styles.textInput}
            />
          </View>

          {/* Screenshot Upload Dropzone */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleSimulateUpload}
            style={styles.uploadDropzone}
          >
            <UploadIcon size={28} color={Colors.primary} />
            <Text style={styles.uploadText}>
              {uploadedFileName || 'Yoki yozishma / to‘lov cheki skrinshotini yuklang'}
            </Text>
            {uploadedFileName && (
              <Text style={styles.uploadSuccessBadge}>✓ Rasm biriktirildi</Text>
            )}
          </TouchableOpacity>

          {/* Deep Check Checkbox */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setIsDeepCheck(!isDeepCheck)}
            style={styles.checkboxRow}
          >
            <View style={[styles.checkboxBox, isDeepCheck && styles.checkboxActive]}>
              {isDeepCheck && <Text style={styles.checkMark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>
              IIV Kiberxavfsizlik (Cyber102) va banklararo qora ro‘yxat bo‘yicha chuqur tekshirish
            </Text>
          </TouchableOpacity>

          {/* Check Button */}
          <CustomButton
            title="🛡️ Xavfsizlikni tekshirish"
            variant="accent"
            onPress={handleExecuteCheck}
            style={styles.actionBtn}
          />
        </View>

        {/* Notice Info Box */}
        <View style={styles.noticeBox}>
          <View style={styles.noticeHeader}>
            <InfoIcon size={16} color={Colors.primary} />
            <Text style={styles.noticeTitle}>Muhim eslatma</Text>
          </View>
          <Text style={styles.noticeText}>
            Eslatma: Natija tavsiyaviy xarakterga ega. Yangi sxemalar paydo bo‘lishi sababli SMS-kodlarni hech kimga bermang!
          </Text>
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 3,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.borderNormal,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 11,
  },
  activeTabBtn: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.secondaryText,
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  formCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.borderNormal,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 8,
  },
  inputWrapper: {
    height: 48,
    backgroundColor: Colors.inputBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    justifyContent: 'center',
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  textInput: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '700',
  },
  uploadDropzone: {
    height: 90,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.borderNormal,
    borderStyle: 'dashed',
    backgroundColor: Colors.inputBg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  uploadText: {
    fontSize: 12,
    color: Colors.bodyMuted,
    marginTop: 6,
    textAlign: 'center',
  },
  uploadSuccessBadge: {
    fontSize: 11,
    color: Colors.success,
    fontWeight: '700',
    marginTop: 4,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Colors.borderNormal,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  checkboxActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkMark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 12,
    color: Colors.primary,
    lineHeight: 17,
    fontWeight: '500',
  },
  actionBtn: {
    height: 48,
    borderRadius: 14,
  },
  noticeBox: {
    backgroundColor: Colors.lightBlueBg,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.borderNormal,
  },
  noticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  noticeTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.primary,
  },
  noticeText: {
    fontSize: 12,
    color: Colors.bodyMuted,
    lineHeight: 17,
  },
});
