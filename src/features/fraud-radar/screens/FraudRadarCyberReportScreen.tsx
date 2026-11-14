import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LegalHeader } from '../../../components/common/LegalHeader';
import { CustomButton } from '../../../components/common/CustomButton';
import { UploadIcon, LockIcon } from '../components/RadarIcons';
import { Colors } from '../../../theme/colors';

interface FraudRadarCyberReportScreenProps {
  suspectTarget: string;
  onBack: () => void;
  onSubmitSuccess: () => void;
}

export const FraudRadarCyberReportScreen: React.FC<FraudRadarCyberReportScreenProps> = ({
  suspectTarget,
  onBack,
  onSubmitSuccess,
}) => {
  const [description, setDescription] = useState('');
  const [evidenceName, setEvidenceName] = useState<string | null>(null);
  const [consent, setConsent] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!description.trim()) {
      Alert.alert('Eslatma', 'Iltimos, voqea tafsilotlarini qisqacha yozib qoldiring.');
      return;
    }
    if (!consent) {
      Alert.alert('Rozilik talab qilinadi', 'Shaxsiy ma’lumotlarni qayta ishlashga rozilik bildirishingiz kerak.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Ariza qabul qilindi! (Cyber102)',
        `Sizning arizangiz IIV Kiberxavfsizlik markaziga yuborildi. Ro‘yxat raqami: #CYB-${Math.floor(100000 + Math.random() * 900000)}`,
        [{ text: 'Tushundim', onPress: onSubmitSuccess }]
      );
    }, 1200);
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar style="dark" />
      <LegalHeader
        title="IIVga ariza yuborish"
        showBack={true}
        showClose={false}
        onBack={onBack}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Blue Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>Kiberxavfsizlik markaziga rasmiy murojaat</Text>
          <Text style={styles.bannerSubtitle}>
            Yolg‘on xabar berish qonunga muvofiq javobgarlikka sabab bo‘ladi
          </Text>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          {/* Field 1: Gumonlanuvchi rekviziti */}
          <Text style={styles.label}>Gumonlanuvchi rekviziti:</Text>
          <View style={styles.readOnlyInput}>
            <Text style={styles.targetText}>{suspectTarget || '8600 12** **** 4590'}</Text>
            <LockIcon size={16} color={Colors.secondaryText} />
          </View>

          {/* Field 2: Description */}
          <Text style={styles.label}>Sizni qanday aldashga urinishdi?</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Voqea tafsilotlarini qisqacha yozing..."
            placeholderTextColor={Colors.secondaryText}
            multiline
            numberOfLines={4}
            style={styles.textArea}
          />

          {/* Field 3: Evidence Upload */}
          <Text style={styles.label}>Dalil (Skrinshot, chek yoki audio):</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setEvidenceName('dalil_skrinshot_cyber102.png')}
            style={styles.uploadDropzone}
          >
            <UploadIcon size={26} color={Colors.primary} />
            <Text style={styles.uploadText}>
              {evidenceName || 'Dalil yuklash (Skrinshot, chek yoki audio)'}
            </Text>
            {evidenceName && (
              <Text style={styles.uploadSuccessBadge}>✓ Fayl yuklandi</Text>
            )}
          </TouchableOpacity>

          {/* Checkbox */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setConsent(!consent)}
            style={styles.checkboxRow}
          >
            <View style={[styles.checkboxBox, consent && styles.checkboxActive]}>
              {consent && <Text style={styles.checkMark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>
              Shaxsiy ma’lumotlarimni IIV bazasida qayta ishlashiga roziman
            </Text>
          </TouchableOpacity>

          {/* Submit Button */}
          <CustomButton
            title="Arizani yuborish (Cyber102)"
            variant="primary"
            loading={loading}
            onPress={handleSubmit}
            style={styles.submitBtn}
            textStyle={styles.submitBtnText}
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
    paddingBottom: 30,
  },
  banner: {
    backgroundColor: Colors.primary,
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.surface,
    marginBottom: 6,
  },
  bannerSubtitle: {
    fontSize: 12,
    color: '#DCE4EE',
    lineHeight: 17,
  },
  formCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.borderNormal,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 8,
  },
  readOnlyInput: {
    height: 48,
    backgroundColor: Colors.disabledInputBg,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.disabledInputBorder,
  },
  targetText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  textArea: {
    minHeight: 90,
    backgroundColor: Colors.inputBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    padding: 12,
    fontSize: 13,
    color: Colors.primary,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  uploadDropzone: {
    height: 80,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.inputBorder,
    borderStyle: 'dashed',
    backgroundColor: Colors.inputBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  uploadText: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginTop: 4,
  },
  uploadSuccessBadge: {
    fontSize: 11,
    color: Colors.success,
    fontWeight: '700',
    marginTop: 2,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
  },
  checkboxActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkMark: {
    color: Colors.surface,
    fontSize: 12,
    fontWeight: '800',
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 12,
    color: Colors.bodyMuted,
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    height: 48,
    borderRadius: 14,
  },
  submitBtnText: {
    color: Colors.surface,
    fontWeight: '700',
  },
});
