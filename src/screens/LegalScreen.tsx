import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, TextInput, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../components/ScreenContainer';
import BottomNav from '../components/BottomNav';
import { useNavigation } from '@react-navigation/native';

// ─── COLORS ─────────────────────────────────────────────────
const C = {
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  bg: '#F8FAFC',
  white: '#FFFFFF',
  textDark: '#0F172A',
  textGrey: '#64748B',
  blueLight: '#EFF6FF',
  blueBorder: '#DBEAFE',
  blueBadge: '#E0F2FE',
  badgeText: '#0284C7',
  green: '#16A34A',
  greenLight: '#DCFCE7',
};

// ─── DUMMY EVIDENCE DATA ─────────────────────────────────────
const EVIDENCE_DOCS = [
  {
    id: '1',
    title: 'Xarid cheki: Samsung Galaxy S24 Ultra',
    size: '1.2 MB',
    meta: 'MediaPark, 15-may, 2024 • Fiskal chek #48201',
    badge: 'Soliq QR tasdiqlangan',
    badgeIcon: 'checkmark-circle-outline',
    pages: '2 sahifa',
  },
  {
    id: '2',
    title: 'Rasmiy kafolat taloni',
    size: '2.4 MB',
    meta: 'Seriya raqami: SM-S928B • Muhrlangan talon',
    badge: 'Muhr va imzo mavjud',
    badgeIcon: 'checkmark-circle-outline',
    pages: '3 sahifa',
  },
  {
    id: '3',
    title: 'Servis markazi rad javobi akti',
    size: '0.8 MB',
    meta: 'PDF akt • Texnik ekspertiza xulosasi',
    badge: 'Rasmiy xulosa',
    badgeIcon: 'business-outline',
    pages: '1 sahifa',
  },
];

// ─── COMPONENT ───────────────────────────────────────────────
export default function LegalScreen() {
  const navigation = useNavigation<any>();
  const [collectionName, setCollectionName] = useState('MediaPark kafolat nizosi bo\'yicha dalillar');
  const [statementText, setStatementText] = useState(
    "Iste'molchilar huquqlarini himoya qilish agentligiga taqdim etish uchun shakllantirildi. Xarid cheki va kafolat taloni ilova qilinadi."
  );

  const handleGeneratePDF = () => {
    Alert.alert(
      'Yagona PDF paket yaratildi',
      "To'plam O'zbekiston Respublikasi elektron hujjat aylanishi standartlari bo'yicha muhrlandi va yuklab olishga tayyor.",
      [{ text: 'OK' }]
    );
  };

  return (
    <ScreenContainer style={styles.safe}>
      <StatusBar barStyle="dark-content" />

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Home')}
          style={styles.headerLeftBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={24} color={C.textDark} />
        </TouchableOpacity>
        <View style={styles.logoBox}>
          <Ionicons name="briefcase-outline" size={16} color={C.primary} />
        </View>
        <View>
          <Text style={styles.appName}>Huquqiy dalillar</Text>
          <Text style={styles.appSub}>Hujjatlar hamyoni</Text>
        </View>
        <View style={{ flex: 1 }} />
        <View style={styles.avatar}>
          <Ionicons name="person" size={16} color={C.primary} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── TOP BADGES ── */}
        <View style={styles.topBadgeRow}>
          <View style={styles.dossierBadge}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <Ionicons name="shield-checkmark" size={12} color={C.primary} />
              <Text style={styles.dossierText}>RASMIY YURIDIK DOSYE</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.exportPdfBtn} onPress={handleGeneratePDF}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ionicons name="document-text-outline" size={12} color={C.badgeText} />
              <Text style={styles.exportPdfText}>Eksport (PDF)</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ── SUBTITLE / DESCRIPTION ── */}
        <Text style={styles.descText}>
          Nizoli vaziyatlar yoki rasmiy organlar uchun tasdiqlangan hujjatlar to'plamini shakllantirish.
        </Text>

        {/* ── STEPPER (1 - 2 - 3) ── */}
        <View style={styles.stepperContainer}>
          <View style={[styles.stepCircle, styles.stepCircleActive]}>
            <Text style={styles.stepNumActive}>1</Text>
          </View>
          <Text style={styles.stepLabelActive}>Hujjatlar (3)</Text>
          <View style={styles.stepLine} />

          <View style={[styles.stepCircle, styles.stepCircleActive]}>
            <Text style={styles.stepNumActive}>2</Text>
          </View>
          <Text style={styles.stepLabelActive}>Izohlar</Text>
          <View style={styles.stepLine} />

          <View style={styles.stepCircle}>
            <Text style={styles.stepNum}>3</Text>
          </View>
          <Text style={styles.stepLabel}>Tayyor</Text>
        </View>

        {/* ── SECTION: TANLANGAN DALILLAR ── */}
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Tanlangan dalillar</Text>
          <View style={styles.badgeCount}>
            <Text style={styles.badgeCountText}>3 ta biriktirildi</Text>
          </View>
        </View>

        {/* ── EVIDENCE DOC LIST ── */}
        {EVIDENCE_DOCS.map((doc) => (
          <View key={doc.id} style={styles.evidenceCard}>
            <View style={styles.evidenceIndicator}>
              <View style={styles.blueDot} />
            </View>
            <View style={styles.evidenceContent}>
              <View style={styles.evidenceHeader}>
                <Text style={styles.evidenceTitle} numberOfLines={1}>{doc.title}</Text>
                <View style={styles.sizePill}>
                  <Text style={styles.sizePillText}>{doc.size}</Text>
                </View>
              </View>
              <Text style={styles.evidenceMeta}>{doc.meta}</Text>
              <View style={styles.evidenceFooter}>
                <View style={styles.tagBadge}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Ionicons name={doc.badgeIcon as any} size={12} color={C.green} />
                    <Text style={styles.tagBadgeText}>{doc.badge}</Text>
                  </View>
                </View>
                <Text style={styles.pageCountText}>{doc.pages}</Text>
              </View>
            </View>
          </View>
        ))}

        {/* ── ADD MORE DOCS BUTTON ── */}
        <TouchableOpacity
          style={styles.addDocBtn}
          onPress={() => navigation.navigate('Documents')}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Ionicons name="add-circle-outline" size={18} color={C.primary} />
            <Text style={styles.addDocBtnText}>Yana hujjat qo'shish</Text>
          </View>
        </TouchableOpacity>

        {/* ── COLLECTION NAME ── */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>To'plam nomi</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={collectionName}
              onChangeText={setCollectionName}
              placeholder="To'plam nomini kiriting..."
            />
          </View>
        </View>

        {/* ── STATEMENT / EXPLANATION ── */}
        <View style={styles.inputGroup}>
          <View style={styles.inputLabelRow}>
            <Text style={styles.inputLabel}>Huquqiy izoh / Ariza matni</Text>
            <Text style={styles.inputLabelSub}>Rasmiy talab</Text>
          </View>
          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={statementText}
              onChangeText={setStatementText}
              placeholder="Ariza yoki tushuntirish xatini yozing..."
              multiline
              numberOfLines={4}
            />
          </View>
        </View>

        {/* ── MAIN CTA BUTTON ── */}
        <TouchableOpacity style={styles.mainActionBtn} onPress={handleGeneratePDF}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Ionicons name="document-text-outline" size={18} color={C.white} />
            <Text style={styles.mainActionText}>Yagona PDF paket yaratish va yuklab olish</Text>
            <Ionicons name="arrow-forward" size={16} color={C.white} />
          </View>
        </TouchableOpacity>

        {/* ── AI JURIDICAL AUDIT BOX ── */}
        <View style={styles.aiAuditCard}>
          <View style={styles.aiAuditHeader}>
            <View style={styles.aiAuditLeft}>
              <View style={styles.sparkleCircle}>
                <Ionicons name="sparkles" size={14} color={C.primary} />
              </View>
              <Text style={styles.aiAuditTitle}>AI Yuridik tekshiruv{'\n'}xulosasi</Text>
            </View>
            <View style={styles.aiTrustPill}>
              <Text style={styles.aiTrustText}>99.8% ishonch</Text>
            </View>
          </View>
          <Text style={styles.aiAuditBody}>
            Barcha 3 ta hujjat yuridik kuchga ega va QR-fiskal ma'lumotlar bilan to'liq mos keladi.
          </Text>
        </View>

        {/* ── SECURITY SEAL & METRICS ── */}
        <View style={styles.metricsBox}>
          <View style={styles.sealRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="shield-checkmark-outline" size={15} color={C.primary} />
              <Text style={styles.sealTitle}>QR-kodli xavfsizlik muhri</Text>
            </View>
            <Text style={styles.sealStatus}>Kiritilgan</Text>
          </View>
          <View style={styles.metricsLine} />
          <View style={styles.numbersRow}>
            <View style={styles.numCol}>
              <Text style={styles.numBig}>6</Text>
              <Text style={styles.numLabel}>Jami sahifalar</Text>
            </View>
            <View style={styles.numDivider} />
            <View style={styles.numCol}>
              <Text style={styles.numBig}>4.4 MB</Text>
              <Text style={styles.numLabel}>Umumiy hajm</Text>
            </View>
          </View>
        </View>

        {/* ── STATUTORY NOTICE ── */}
        <Text style={styles.statutoryNotice}>
          Hujjatlar to'plami O'zbekiston Respublikasi "Elektron hujjat aylanishi to'g'risida"gi qonuniga muvofiq rasmiylashtiriladi.
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
  scroll: { paddingHorizontal: 16, paddingTop: 6 },

  // Header
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, gap: 10 },
  headerLeftBtn: { padding: 4 },
  backArrow: { fontSize: 22, color: C.textDark, fontWeight: '700' },
  logoBox: { width: 32, height: 32, borderRadius: 8, backgroundColor: C.blueLight, alignItems: 'center', justifyContent: 'center' },
  appName: { fontSize: 13, fontWeight: '700', color: C.textDark },
  appSub: { fontSize: 11, color: C.textGrey },
  avatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center' },

  // Top badges
  topBadgeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8 },
  dossierBadge: { backgroundColor: C.blueLight, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  dossierText: { fontSize: 11, color: C.primary, fontWeight: '800', letterSpacing: 0.3 },
  exportPdfBtn: { backgroundColor: C.blueBadge, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  exportPdfText: { fontSize: 11, color: C.badgeText, fontWeight: '700' },

  descText: { fontSize: 13, color: C.textGrey, lineHeight: 19, marginBottom: 14 },

  // Stepper
  stepperContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.white, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 16, elevation: 1 },
  stepCircle: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center', marginRight: 6 },
  stepCircleActive: { backgroundColor: C.primary },
  stepNum: { fontSize: 11, color: C.textGrey, fontWeight: '700' },
  stepNumActive: { fontSize: 11, color: C.white, fontWeight: '700' },
  stepLabel: { fontSize: 12, color: C.textGrey, fontWeight: '500' },
  stepLabelActive: { fontSize: 12, color: C.primary, fontWeight: '700' },
  stepLine: { flex: 1, height: 1, backgroundColor: '#E2E8F0', marginHorizontal: 8 },

  // Section title
  sectionTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: C.textDark },
  badgeCount: { backgroundColor: C.blueLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  badgeCountText: { fontSize: 11, color: C.primary, fontWeight: '700' },

  // Evidence doc cards
  evidenceCard: { flexDirection: 'row', backgroundColor: C.white, borderRadius: 16, padding: 14, marginBottom: 10, elevation: 1 },
  evidenceIndicator: { width: 22, paddingTop: 4 },
  blueDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: C.primary },
  evidenceContent: { flex: 1 },
  evidenceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  evidenceTitle: { fontSize: 14, fontWeight: '700', color: C.textDark, flex: 1, marginRight: 8 },
  sizePill: { backgroundColor: '#F1F5F9', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  sizePillText: { fontSize: 11, color: C.textGrey, fontWeight: '600' },
  evidenceMeta: { fontSize: 12, color: C.textGrey, marginBottom: 8 },
  evidenceFooter: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  tagBadge: { backgroundColor: C.blueLight, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  tagBadgeText: { fontSize: 11, color: C.primary, fontWeight: '600' },
  pageCountText: { fontSize: 11, color: C.textGrey },

  // Add more
  addDocBtn: { backgroundColor: C.blueLight, borderRadius: 14, paddingVertical: 13, alignItems: 'center', marginBottom: 14, borderWidth: 1, borderColor: '#BFDBFE' },
  addDocBtnText: { fontSize: 13, color: C.primary, fontWeight: '700' },

  // Input groups
  inputGroup: { marginBottom: 12 },
  inputLabel: { fontSize: 12, fontWeight: '700', color: C.textDark, marginBottom: 6 },
  inputLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  inputLabelSub: { fontSize: 11, color: C.textGrey },
  inputWrapper: { backgroundColor: C.white, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, elevation: 1 },
  textInput: { fontSize: 13, color: C.textDark },
  textArea: { height: 75, textAlignVertical: 'top' },

  // Main action button
  mainActionBtn: { flexDirection: 'row', backgroundColor: C.primary, borderRadius: 16, paddingVertical: 15, paddingHorizontal: 14, alignItems: 'center', justifyContent: 'center', gap: 8, marginVertical: 8, elevation: 4 },
  mainActionIcon: { fontSize: 18 },
  mainActionText: { fontSize: 14, color: C.white, fontWeight: '700' },

  // AI Audit
  aiAuditCard: { backgroundColor: '#EFF6FF', borderRadius: 16, padding: 14, marginVertical: 8, borderLeftWidth: 4, borderLeftColor: C.primary },
  aiAuditHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  aiAuditLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sparkleCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  sparkleIcon: { fontSize: 14, color: C.white, fontWeight: '700' },
  aiAuditTitle: { fontSize: 13, fontWeight: '800', color: C.primary, lineHeight: 18 },
  aiTrustPill: { backgroundColor: C.white, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  aiTrustText: { fontSize: 11, color: C.green, fontWeight: '800' },
  aiAuditBody: { fontSize: 12, color: '#1E40AF', lineHeight: 18 },

  // Metrics Box
  metricsBox: { backgroundColor: C.white, borderRadius: 16, padding: 14, marginVertical: 6, elevation: 1 },
  sealRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sealTitle: { fontSize: 13, fontWeight: '700', color: C.textDark },
  sealStatus: { fontSize: 11, color: C.primary, fontWeight: '700' },
  metricsLine: { height: 1, backgroundColor: '#F1F5F9', marginBottom: 10 },
  numbersRow: { flexDirection: 'row', alignItems: 'center' },
  numCol: { flex: 1, alignItems: 'center' },
  numBig: { fontSize: 20, fontWeight: '800', color: C.textDark },
  numLabel: { fontSize: 11, color: C.textGrey, marginTop: 2 },
  numDivider: { width: 1, height: 30, backgroundColor: '#E2E8F0' },

  // Statutory notice
  statutoryNotice: { fontSize: 10, color: C.textGrey, textAlign: 'center', lineHeight: 15, marginTop: 12 },
});