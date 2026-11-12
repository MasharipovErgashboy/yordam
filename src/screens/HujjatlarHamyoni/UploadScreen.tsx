import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Alert, Platform,
} from 'react-native';
import ScreenContainer from './ScreenContainer';
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
  { id: '1', icon: '📷', label: 'Kamera orqali', sub: 'Avto-chegara aniqlash', badge: '✦ AI auto', badgeColor: C.primary, badgeBg: C.blueLight },
  { id: '2', icon: '🖼️', label: 'Galereyadan', sub: 'JPG, PNG, HEIC', badge: 'Formatlar', badgeColor: '#7C3AED', badgeBg: '#EDE9FE' },
  { id: '3', icon: '📄', label: 'PDF hujjat', sub: "Ko'p sahifali shartnoma", badge: 'Multi-page', badgeColor: '#0369A1', badgeBg: '#E0F2FE' },
  { id: '4', icon: '☁️', label: 'Fayllar tizimi', sub: 'iCloud, Google Drive', badge: 'Bulut', badgeColor: '#0369A1', badgeBg: '#E0F2FE' },
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
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
          <View style={styles.headerMid}>
            <View style={styles.logoBox}>
              <Text>💼</Text>
            </View>
            <View>
              <Text style={styles.appName}>Hujjat yuklash</Text>
              <Text style={styles.appSub}>Hujjatlar hamyoni</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.headerBtn}>
            <Text style={styles.headerBtnText}>Fayl tanlash</Text>
          </TouchableOpacity>
          <View style={styles.avatar}>
            <Text style={{ fontSize: 16 }}>👤</Text>
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
            <Text style={styles.aiBtnText}>✦ AI Yordamchi</Text>
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
                <Text style={styles.methodIcon}>{m.icon}</Text>
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
            <Text style={styles.dropIcon}>📂</Text>
          </View>
          <Text style={styles.dropTitle}>Faylni shu yerga tashlang yoki tanlang</Text>
          <Text style={styles.dropSub}>Maksimal hajm: 25 MB • PDF, DOCX, JPG, PNG</Text>
          <View style={styles.dropBadges}>
            <View style={styles.dropBadge}>
              <Text style={styles.dropBadgeText}>🔍 OCR tayyor</Text>
            </View>
            <View style={styles.dropBadge}>
              <Text style={styles.dropBadgeText}>🔒 256-bit shifrlash</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* ── FILE PREVIEW ── */}
        {(file || true) && (
          <View style={styles.fileCard}>
            <View style={styles.fileLeft}>
              <View style={styles.fileIconBox}>
                <Text style={styles.fileIcon}>📄</Text>
              </View>
              <View style={styles.fileInfo}>
                <View style={styles.fileNameRow}>
                  <Text style={styles.fileName} numberOfLines={1}>
                    {file ? file.name : 'ijara_shartnomasi_2025.pdf'}
                  </Text>
                  <TouchableOpacity>
                    <Text style={styles.fileClose}>✕</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.fileSize}>3.4 MB dan 2.6 MB • {progress}%</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${progress}%` }]} />
                </View>
                <Text style={styles.fileStatus}>⚡ AI matnni tahlil qilmoqda va OCR ishlam</Text>
                <View style={styles.fileTagRow}>
                  <View style={styles.fileTag}>
                    <Text style={styles.fileTagText}>🔒 AES-256 shifrlangan</Text>
                  </View>
                  <View style={[styles.fileTag, { backgroundColor: C.greenLight }]}>
                    <Text style={[styles.fileTagText, { color: C.green }]}>✅ Virusdan sof (toza)</Text>
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
                {selectedType === t.id && <Text style={styles.checkIcon}>✓ </Text>}
                <Text style={[styles.typeChipText, selectedType === t.id && styles.typeChipTextActive]}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── AI INFO ── */}
        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>💡</Text>
          <Text style={styles.infoText}>
            Yuklangandan so'ng, AI avtomatik tarzda shartnomaning asosiy shartlari, tomonlari va muddatlarini ko'rsatib beradi.
          </Text>
        </View>

        {/* ── CONTINUE BUTTON ── */}
        <TouchableOpacity style={styles.continueBtn} onPress={handleContinue}>
          <Text style={styles.continueBtnText}>Davom etish va AI tahlili qilish →</Text>
        </TouchableOpacity>

        {/* ── FOOTER ── */}
        <Text style={styles.footerText}>
          Hujjatlar O'zbekiston Respublikasi kibexavfsizlik talablariga muvofiq saqlanadi
        </Text>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── BOTTOM NAV ── */}
      <View style={styles.bottomNav}>
        {[
          { icon: '🏠', label: 'Bosh sahifa', screen: 'Home' },
          { icon: '📂', label: 'Hujjatlar', screen: 'Documents' },
          { icon: '✨', label: 'AI Yordamchi', screen: 'AI', center: true },
          { icon: '🔔', label: 'Eslatmalar', screen: 'Reminders' },
          { icon: '👤', label: 'Profil', screen: 'Profile' },
        ].map(item => (
          <TouchableOpacity
            key={item.screen}
            style={[styles.navItem, item.center && styles.navItemCenter]}
            onPress={() => navigation.navigate(item.screen)}
          >
            {item.center ? (
              <View style={styles.navCenterBtn}>
                <Text style={{ fontSize: 22 }}>{item.icon}</Text>
              </View>
            ) : (
              <>
                <Text style={styles.navIcon}>{item.icon}</Text>
                <Text style={styles.navLabel}>{item.label}</Text>
              </>
            )}
          </TouchableOpacity>
        ))}
      </View>
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

  // Bottom Nav
  bottomNav: { flexDirection: 'row', backgroundColor: C.white, paddingBottom: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#E2E8F0', elevation: 10 },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navItemCenter: { position: 'relative', top: -20 },
  navCenterBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', elevation: 6, shadowColor: C.primary, shadowOpacity: 0.4, shadowRadius: 8 },
  navIcon: { fontSize: 20 },
  navLabel: { fontSize: 10, color: C.textGrey, marginTop: 2 },
});