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
import { UploadIcon } from '../components/RadarIcons';
import { Colors } from '../../../theme/colors';

interface FraudRadarCommunityReportScreenProps {
  onBack: () => void;
  onSubmitSuccess: () => void;
}

export const FraudRadarCommunityReportScreen: React.FC<FraudRadarCommunityReportScreenProps> = ({
  onBack,
  onSubmitSuccess,
}) => {
  const [scamType, setScamType] = useState('Telegram bot / Havola');
  const [target, setTarget] = useState('');
  const [description, setDescription] = useState('');
  const [evidenceName, setEvidenceName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const scamTypes = [
    'Telegram bot / Havola',
    'Soxta bank kartasi',
    'Telefon qo‘ng‘irog‘i (Operator)',
    'Moliyaviy piramida',
    'Boshqa',
  ];

  const handleSelectType = () => {
    Alert.alert(
      'Firibgarlik turini tanlang',
      '',
      scamTypes.map((t) => ({
        text: t,
        onPress: () => setScamType(t),
      }))
    );
  };

  const handleSubmit = () => {
    if (!target.trim() || !description.trim()) {
      Alert.alert('Eslatma', 'Iltimos, firibgar rekviziti va tavsifini to‘ldiring.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Qabul qilindi!',
        'Xabaringiz uchun tashakkur! Moderatorlar tekshiruvidan so‘ng ma’lumot umumiy qora ro‘yxatga kiritiladi.',
        [{ text: 'A’lo', onPress: onSubmitSuccess }]
      );
    }, 1000);
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar style="dark" />
      <LegalHeader
        title="Qora ro‘yxatga qo‘shish"
        showBack={true}
        showClose={false}
        onBack={onBack}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            Jamoat xavfsizligiga hissa qo‘shing. Yangi firibgarlik sxemasini aniqladingizmi? Boshqalarni ogohlantiring.
          </Text>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          {/* Field 1: Type Selector */}
          <Text style={styles.label}>Firibgarlik turi:</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleSelectType}
            style={styles.dropdownBtn}
          >
            <Text style={styles.dropdownText}>{scamType}</Text>
            <Text style={styles.dropdownArrow}>▾</Text>
          </TouchableOpacity>

          {/* Field 2: Target */}
          <Text style={styles.label}>Havola yoki telefon raqami:</Text>
          <TextInput
            value={target}
            onChangeText={setTarget}
            placeholder="Masalan: @yordam_bonus_bot"
            placeholderTextColor={Colors.secondaryText}
            style={styles.input}
          />

          {/* Field 3: Description */}
          <Text style={styles.label}>Qisqacha tavsif:</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Qanday qilib aldamoqchi bo‘lishdi?"
            placeholderTextColor={Colors.secondaryText}
            multiline
            numberOfLines={4}
            style={styles.textArea}
          />

          {/* Field 4: Evidence Upload */}
          <Text style={styles.label}>Dalil (Skrinshot yuklash):</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setEvidenceName('skrinshot_dalil.jpg')}
            style={styles.uploadDropzone}
          >
            <UploadIcon size={26} color={Colors.primary} />
            <Text style={styles.uploadText}>
              {evidenceName || 'Dalil (Skrinshot yuklash)'}
            </Text>
            {evidenceName && (
              <Text style={styles.uploadSuccessBadge}>✓ Skrinshot biriktirildi</Text>
            )}
          </TouchableOpacity>

          {/* Warning Note */}
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              ℹ️ Sizning xabaringiz moderator tekshiruvidan so‘ng umumiy bazaga qo‘shiladi.
            </Text>
          </View>

          {/* Submit Button */}
          <CustomButton
            title="Yangi firibgarni qo‘shish +"
            variant="accent"
            loading={loading}
            onPress={handleSubmit}
            style={styles.submitBtn}
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
    backgroundColor: Colors.lightBlueBg,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.borderNormal,
    marginBottom: 16,
  },
  bannerText: {
    fontSize: 12,
    color: Colors.primary,
    lineHeight: 18,
    fontWeight: '500',
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
  dropdownBtn: {
    height: 48,
    backgroundColor: Colors.inputBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  dropdownText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  dropdownArrow: {
    fontSize: 14,
    color: Colors.secondaryText,
  },
  input: {
    height: 48,
    backgroundColor: Colors.inputBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    paddingHorizontal: 14,
    fontSize: 13,
    color: Colors.primary,
    marginBottom: 14,
  },
  textArea: {
    minHeight: 85,
    backgroundColor: Colors.inputBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    padding: 12,
    fontSize: 13,
    color: Colors.primary,
    textAlignVertical: 'top',
    marginBottom: 14,
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
    marginBottom: 14,
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
  warningBox: {
    backgroundColor: Colors.amberRecBg,
    borderRadius: 10,
    padding: 10,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: 'rgba(250, 161, 0, 0.35)',
  },
  warningText: {
    fontSize: 11,
    color: '#92400E',
    lineHeight: 16,
  },
  submitBtn: {
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.accent,
  },
});
