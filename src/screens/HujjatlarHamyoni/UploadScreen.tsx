import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Alert, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from './ScreenContainer';
import BottomNav from '../../components/BottomNav';
import { useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';

// ─── COLORS ─────────────────────────────────────────────────
const C = {
  primary: '#2563EB',
  secondary: '#0F172A',
  bg: '#F1F5FB',
  white: '#FFFFFF',
  textDark: '#0F172A',
  textGrey: '#64748B',
  blueLight: '#DBEAFE',
  green: '#22C55E',
  greenLight: '#DCFCE7',
};

// ─── UPLOAD METHODS ──────────────────────────────────────────
const METHODS = [
  { id: '1', icon: 'camera-outline', label: 'Kamera orqali', sub: 'Avto-chegara aniqlash', badge: 'AI auto', badgeColor: C.primary, badgeBg: C.blueLight },
  { id: '2', icon: 'images-outline', label: 'Galereyadan', sub: 'JPG, PNG, HEIC', badge: 'Formatlar', badgeColor: '#7C3AED', badgeBg: '#EDE9FE' },
  { id: '3', icon: 'document-text-outline', label: 'PDF hujjat', sub: "Ko'p sahifali shartnoma", badge: 'Multi-page', badgeColor: '#0369A1', badgeBg: '#E0F2FE' },
  { id: '4', icon: 'cloud-outline', label: 'Fayllar tizimi', sub: 'iCloud, Google Drive', badge: 'Bulut', badgeColor: '#0369A1', badgeBg: '#E0F2FE' },
];

// ─── DOC TYPES ───────────────────────────────────────────────
const DOC_TYPES = [
  { id: '1', label: 'Shartnoma' },
  { id: '2', label: 'Chek / Kvitansiya' },
  { id: '3', label: 'Kafolat taloni' },
  { id: '4', label: 'Guvohnoma' },
  { id: '5', label: 'Boshqa hujjat' },
];

// ─── COMPONENT ───────────────────────────────────────────────
export default function UploadScreen() {
  const navigation = useNavigation<any>();
  const [selectedType, setSelectedType] = useState('1');
  const [file, setFile] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(78);

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });
      if (result.assets && result.assets.length > 0) {
        setFile(result.assets[0]);
        setUploading(true);
        // Simulate upload progress
        setTimeout(() => {
          setUploading(false);
          setProgress(100);
        }, 2000);
      }
    } catch (e) {
      Alert.alert("Xatolik", "Fayl tanlashda xatolik yuz berdi.");
    }
  };

  const handleContinue = () => {
    if (!file) {
      Alert.alert('Fayl tanlanmagan', 'Iltimos, avval fayl tanlang.');
      return;
    }
    navigation.navigate('Details', { docId: 'new' });
  };

  return (
    <ScreenContainer style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── HEADER ── */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Home')}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="chevron-back" size={24} color={C.textDark} />
          </TouchableOpacity>
          <View style={styles.headerMid}>
            <View style={styles.logoBox}>
              <Ionicons name="cloud-upload-outline" size={16} color={C.primary} />
            </View>
            <View>
              <Text style={styles.appName}>Hujjat yuklash</Text>
              <Text style={styles.appSub}>Hujjatlar hamyoni</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.headerBtn} onPress={pickFile}>
            <Text style={styles.headerBtnText}>Fayl tanlash</Text>
          </TouchableOpacity>
          <View style={styles.avatar}>
            <Ionicons name="person" size={16} color={C.primary} />
          </View>
        </View>

        {/* ── STEP BADGE ── */}
        <View style={styles.stepRow}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepText}>BOSQICH 1 / 2</Text>
          </View>
          <TouchableOpacity
            style={styles.aiBtn}
            onPress={() => navigation.navigate('AI')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ionicons name="sparkles" size={13} color={C.primary} />
              <Text style={styles.aiBtnText}>AI Yordamchi</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ── TITLE ── */}
        <Text style={styles.title}>Hujjat kiritish usuli</Text>
        <Text style={styles.subtitle}>Tezkor skanerlash yoki tayyor faylni yuklang</Text>

        {/* ── UPLOAD METHOD GRID ── */}
        <View style={styles.methodGrid}>
          {METHODS.map(m => (
            <TouchableOpacity key={m.id} style={styles.methodCard} onPress={pickFile}>
              <View style={styles.methodTop}>
                <Ionicons name={m.icon as any} size={22} color={C.primary} />
                <View style={[styles.methodBadge, { backgroundColor: m.badgeBg }]}>
                  <Text style={[styles.methodBadgeText, { color: m.badgeColor }]}>{m.badge}</Text>
                </View>
              </View>
              <Text style={styles.methodLabel}>{m.label}</Text>
              <Text style={styles.methodSub}>{m.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── DROP ZONE ── */}
        <TouchableOpacity style={styles.dropZone} onPress={pickFile}>
          <View style={styles.dropIconBox}>
            <Ionicons name="folder-open-outline" size={32} color={C.primary} />
          </View>
          <Text style={styles.dropTitle}>Faylni shu yerga tashlang yoki tanlang</Text>
          <Text style={styles.dropSub}>Maksimal hajm: 25 MB • PDF, DOCX, JPG, PNG</Text>
          <View style={styles.dropBadges}>
            <View style={styles.dropBadge}>
              <Ionicons name="scan-outline" size={12} color={C.textGrey} style={{ marginRight: 4 }} />
              <Text style={styles.dropBadgeText}>OCR tayyor</Text>
            </View>
            <View style={styles.dropBadge}>
              <Ionicons name="shield-checkmark-outline" size={12} color={C.textGrey} style={{ marginRight: 4 }} />
              <Text style={styles.dropBadgeText}>256-bit shifrlash</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* ── FILE PREVIEW ── */}
        {(file || true) && (
          <View style={styles.fileCard}>
            <View style={styles.fileLeft}>
              <View style={styles.fileIconBox}>
                <Ionicons name="document-text-outline" size={22} color={C.primary} />
              </View>
              <View style={styles.fileInfo}>
                <View style={styles.fileNameRow}>
                  <Text style={styles.fileName} numberOfLines={1}>
                    {file ? file.name : 'ijara_shartnomasi_2025.pdf'}
                  </Text>
                  <TouchableOpacity>
                    <Ionicons name="close" size={16} color={C.textGrey} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.fileSize}>3.4 MB dan 2.6 MB • {progress}%</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${progress}%` }]} />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginVertical: 4 }}>
                  <Ionicons name="sparkles" size={12} color={C.primary} />
                  <Text style={styles.fileStatus}>AI matnni tahlil qilmoqda va OCR ishlamoqda</Text>
                </View>
                <View style={styles.fileTagRow}>
                  <View style={styles.fileTag}>
                    <Ionicons name="lock-closed-outline" size={11} color={C.textGrey} style={{ marginRight: 4 }} />
                    <Text style={styles.fileTagText}>AES-256 shifrlangan</Text>
                  </View>
                  <View style={[styles.fileTag, { backgroundColor: C.greenLight }]}>
                    <Ionicons name="checkmark-circle-outline" size={12} color={C.green} style={{ marginRight: 4 }} />
                    <Text style={[styles.fileTagText, { color: C.green }]}>Virusdan xoli</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* ── DOC TYPE ── */}
        <View style={styles.typeSection}>
          <View style={styles.typeTitleRow}>
            <Text style={styles.typeTitle}>Hujjat turini tanlang</Text>
            <View style={styles.requiredBadge}>
              <Text style={styles.requiredText}>Majburiy</Text>
            </View>
          </View>
          <View style={styles.typeGrid}>
            {DOC_TYPES.map(t => (
              <TouchableOpacity
                key={t.id}
                style={[styles.typeChip, selectedType === t.id && styles.typeChipActive]}
                onPress={() => setSelectedType(t.id)}
              >
                {selectedType === t.id && (
                  <Ionicons name="checkmark" size={13} color={C.white} style={{ marginRight: 4 }} />
                )}
                <Text style={[styles.typeChipText, selectedType === t.id && styles.typeChipTextActive]}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── AI INFO ── */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={18} color={C.primary} style={{ marginRight: 8, marginTop: 2 }} />
          <Text style={styles.infoText}>
            Yuklangandan so'ng, AI avtomatik tarzda shartnomaning asosiy shartlari, tomonlari va muddatlarini ko'rsatib beradi.
          </Text>
        </View>

        {/* ── CONTINUE BUTTON ── */}
        <TouchableOpacity style={styles.continueBtn} onPress={handleContinue}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Text style={styles.continueBtnText}>Davom etish va AI tahlil qilish</Text>
            <Ionicons name="arrow-forward" size={16} color={C.white} />
          </View>
        </TouchableOpacity>

        {/* ── FOOTER ── */}
        <Text style={styles.footerText}>
          Hujjatlar O'zbekiston Respublikasi kiberxavfsizlik talablariga muvofiq saqlanadi
        </Text>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* ── BOTTOM NAV ── */}
      <BottomNav activeScreen="" />
    </ScreenContainer>
  );
}

// ─── STYLES ──────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 16, paddingTop: 10 },

  // Header
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 8 },
  backArrow: { fontSize: 28, color: C.textDark, fontWeight: '300', marginRight: 2 },
  headerMid: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 8 },
  logoBox: { width: 30, height: 30, borderRadius: 8, backgroundColor: C.blueLight, alignItems: 'center', justifyContent: 'center' },
  appName: { fontSize: 13, fontWeight: '700', color: C.textDark },
  appSub: { fontSize: 11, color: C.textGrey },
  headerBtn: { backgroundColor: C.blueLight, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  headerBtnText: { fontSize: 12, color: C.primary, fontWeight: '600' },
  avatar: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center' },

  // Step
  stepRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  stepBadge: { backgroundColor: C.primary, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  stepText: { fontSize: 11, color: C.white, fontWeight: '700', letterSpacing: 0.5 },
  aiBtn: { backgroundColor: C.blueLight, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  aiBtnText: { fontSize: 12, color: C.primary, fontWeight: '600' },

  // Title
  title: { fontSize: 22, fontWeight: '800', color: C.textDark, marginBottom: 4 },
  subtitle: { fontSize: 13, color: C.textGrey, marginBottom: 16 },

  // Method grid
  methodGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  methodCard: { width: '47%', backgroundColor: C.white, borderRadius: 16, padding: 14, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4 },
  methodTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  methodIcon: { fontSize: 28 },
  methodBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  methodBadgeText: { fontSize: 10, fontWeight: '700' },
  methodLabel: { fontSize: 14, fontWeight: '700', color: C.textDark },
  methodSub: { fontSize: 11, color: C.textGrey, marginTop: 2 },

  // Drop zone
  dropZone: { backgroundColor: C.white, borderRadius: 18, padding: 20, alignItems: 'center', marginBottom: 14, borderWidth: 2, borderColor: '#BFDBFE', borderStyle: 'dashed', elevation: 1 },
  dropIconBox: { width: 56, height: 56, borderRadius: 16, backgroundColor: C.blueLight, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  dropIcon: { fontSize: 28 },
  dropTitle: { fontSize: 15, fontWeight: '700', color: C.textDark, textAlign: 'center' },
  dropSub: { fontSize: 12, color: C.textGrey, textAlign: 'center', marginTop: 4 },
  dropBadges: { flexDirection: 'row', gap: 10, marginTop: 12 },
  dropBadge: { backgroundColor: C.blueLight, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  dropBadgeText: { fontSize: 12, color: C.primary, fontWeight: '600' },

  // File card
  fileCard: { backgroundColor: C.white, borderRadius: 16, padding: 14, marginBottom: 14, elevation: 2 },
  fileLeft: { flexDirection: 'row', gap: 12 },
  fileIconBox: { width: 44, height: 44, borderRadius: 10, backgroundColor: '#FEE2E2', alignItems: 'center', justifyContent: 'center' },
  fileIcon: { fontSize: 24 },
  fileInfo: { flex: 1 },
  fileNameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  fileName: { fontSize: 13, fontWeight: '700', color: C.textDark, flex: 1 },
  fileClose: { fontSize: 16, color: C.textGrey, marginLeft: 8 },
  fileSize: { fontSize: 12, color: C.textGrey, marginTop: 2 },
  progressBar: { height: 6, backgroundColor: '#E2E8F0', borderRadius: 4, marginVertical: 6 },
  progressFill: { height: 6, backgroundColor: C.primary, borderRadius: 4 },
  fileStatus: { fontSize: 11, color: C.primary, marginBottom: 6 },
  fileTagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  fileTag: { backgroundColor: C.blueLight, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  fileTagText: { fontSize: 11, color: C.primary, fontWeight: '600' },

  // Doc type
  typeSection: { backgroundColor: C.white, borderRadius: 16, padding: 14, marginBottom: 14, elevation: 1 },
  typeTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  typeTitle: { fontSize: 15, fontWeight: '700', color: C.textDark },
  requiredBadge: { backgroundColor: '#FEF9C3', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  requiredText: { fontSize: 11, color: '#854D0E', fontWeight: '600' },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typeChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: C.bg, borderWidth: 1, borderColor: '#E2E8F0', flexDirection: 'row', alignItems: 'center' },
  typeChipActive: { backgroundColor: C.primary, borderColor: C.primary },
  checkIcon: { fontSize: 13, color: C.white },
  typeChipText: { fontSize: 13, color: C.textDark, fontWeight: '500' },
  typeChipTextActive: { color: C.white, fontWeight: '700' },

  // Info
  infoCard: { flexDirection: 'row', backgroundColor: C.blueLight, borderRadius: 14, padding: 12, marginBottom: 16, gap: 10, alignItems: 'flex-start' },
  infoIcon: { fontSize: 20 },
  infoText: { flex: 1, fontSize: 12, color: '#1E40AF', lineHeight: 18 },

  // Continue
  continueBtn: { backgroundColor: C.primary, borderRadius: 16, padding: 16, alignItems: 'center', marginBottom: 12, elevation: 4, shadowColor: C.primary, shadowOpacity: 0.3, shadowRadius: 8 },
  continueBtnText: { fontSize: 16, color: C.white, fontWeight: '700' },

  // Footer
  footerText: { fontSize: 11, color: C.textGrey, textAlign: 'center', lineHeight: 16 },
});