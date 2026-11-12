import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Image,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ScreenContainer from '../components/ScreenContainer';

// ─── COLORS ────────────────────────────────────────────────
const C = {
  primary: '#2563EB',
  primaryDark: '#1E40AF',
  secondary: '#0F172A',
  tertiary: '#1E3A8A',
  bg: '#F1F5FB',
  white: '#FFFFFF',
  textDark: '#0F172A',
  textGrey: '#64748B',
  red: '#EF4444',
  redLight: '#FEE2E2',
  green: '#22C55E',
  orange: '#F97316',
  cardBlue: '#2563EB',
};

// ─── DUMMY DATA ─────────────────────────────────────────────
const CATEGORIES = [
  { id: '1', label: 'Hammasi', count: 24 },
  { id: '2', label: 'Shartnomalar', count: 5 },
  { id: '3', label: 'Cheklar', count: 8 },
  { id: '4', label: 'Kafolat', count: 6 },
];

const STATS = [
  { label: 'Shartnoma', value: 5 },
  { label: 'Cheklar', value: 8 },
  { label: 'Kafolat', value: 6 },
  { label: 'Boshqa', value: 5 },
];

const QUICK_ACTIONS = [
  { id: '1', icon: '➕', title: "Hujjat qo'shish", sub: 'Kamera / PDF yuklash', color: C.primary, screen: 'Upload' },
  { id: '2', icon: '🤖', title: 'Al tahlil', sub: 'Aqlli skanerl ash', color: '#1E3A8A', screen: 'AI' },
  { id: '3', icon: '📁', title: "Dalillar to'plar", sub: 'Sud va organlar uchun', color: C.white, screen: 'Legal', dark: false },
  { id: '4', icon: '🛡️', title: 'Kafolat tekshi', sub: 'Muddat monitoringi', color: C.white, screen: 'Reminders', dark: false },
];

const RECENT_DOCS = [
  { id: '1', name: 'Kvartira ijara shartnomasi (Yunu', tag: 'Faol', tagColor: C.primary, type: 'Shartnoma', format: 'PDF', date: '18-may, 2025', icon: '📄' },
  { id: '2', name: 'MacBook Pro M3 xarid che', tag: 'Kafolat faol', tagColor: C.green, type: 'Chek', format: 'JPG', date: '12-may, 2025', icon: '🖼️' },
  { id: '3', name: 'Artel muzlatgich kafol', tag: 'Muddati oz qoldi', tagColor: C.orange, type: 'Kafolat', format: 'PDF', date: '04-may, 2025', icon: '📄' },
];

// ─── COMPONENT ──────────────────────────────────────────────
export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [selectedCat, setSelectedCat] = useState('1');
  const [search, setSearch] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  return (
    <ScreenContainer style={styles.safe}>
      <StatusBar barStyle="dark-content" />

      {/* ── HEADER ── */}
      <View style={[styles.header, isScrolled && styles.headerScrolled]}>
        <View style={styles.headerLeft}>
          <View style={styles.logoBox}>
            <Text style={styles.logoIcon}>💼</Text>
          </View>
          <View>
            <Text style={styles.appName}>Bosh sahifa</Text>
            <Text style={styles.appSub}>Hujjatlar hamyoni</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        onScroll={(e) => {
          const offsetY = e.nativeEvent.contentOffset.y;
          setIsScrolled(offsetY > 10);
        }}
        scrollEventThrottle={16}
      >
        {/* ── SEARCH ── */}
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Hujjatlardan qidiring..."
            placeholderTextColor={C.textGrey}
            value={search}
            onChangeText={setSearch}
          />
          <TouchableOpacity onPress={() => navigation.navigate('AI')}>
            <Text style={styles.micIcon}>🎙️</Text>
          </TouchableOpacity>
        </View>

        {/* ── CATEGORIES ── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.catChip, selectedCat === cat.id && styles.catChipActive]}
              onPress={() => setSelectedCat(cat.id)}
            >
              <Text style={[styles.catText, selectedCat === cat.id && styles.catTextActive]}>
                {cat.label} ({cat.count})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── STATS CARD ── */}
        <View style={styles.statsCard}>
          <View style={styles.statsTop}>
            <Text style={styles.statsSync}>☁️ Bulutda sinxronlangan 100%</Text>
            <Text style={styles.statsEnc}>🔒 AES-256</Text>
          </View>
          <Text style={styles.statsLabel}>Hamyondagi jami aktivlar</Text>
          <Text style={styles.statsBig}>24 ta rasmiy hujjat</Text>
          <View style={styles.statsRow}>
            {STATS.map((s, i) => (
              <View key={i} style={styles.statItem}>
                <Text style={styles.statNum}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── QUICK ACTIONS ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tezkor amallar</Text>
          <Text style={styles.sectionSub}>4 ta xizmat</Text>
        </View>
        <View style={styles.actionsGrid}>
          {QUICK_ACTIONS.map(a => (
            <TouchableOpacity
              key={a.id}
              style={[
                styles.actionCard,
                { backgroundColor: a.color === C.white ? C.white : a.color },
              ]}
              onPress={() => navigation.navigate(a.screen)}
            >
              <Text style={styles.actionIcon}>{a.icon}</Text>
              <Text style={[styles.actionTitle, { color: a.color === C.white ? C.textDark : C.white }]}>
                {a.title}
              </Text>
              <Text style={[styles.actionSub, { color: a.color === C.white ? C.textGrey : '#BFDBFE' }]}>
                {a.sub}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── WARNING CARD ── */}
        <View style={styles.warningCard}>
          <View style={styles.warningTop}>
            <Text style={styles.warningTag}>⚠️ KAFOLAT MUDDATI OGOHLANTIRISHI</Text>
          </View>
          <Text style={styles.warningTitle}>Samsung S24 Ultra kafolati tugashiga 5 kun qoldi</Text>
          <Text style={styles.warningBody}>Rasmiy servis markaziga bepul murojaat qilish imkoniyati</Text>
          <View style={styles.warningBtns}>
            <TouchableOpacity style={styles.warnBtnPrimary}>
              <Text style={styles.warnBtnPrimaryText}>Ko'rish</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.warnBtnSecondary}>
              <Text style={styles.warnBtnSecondaryText}>Keyinroq</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── RECENT DOCS ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>So'nggi qo'shilgan hujjatlar</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Documents')}>
            <Text style={styles.seeAll}>Barchasi &gt;</Text>
          </TouchableOpacity>
        </View>
        {RECENT_DOCS.map(doc => (
          <TouchableOpacity
            key={doc.id}
            style={styles.docCard}
            onPress={() => navigation.navigate('Details', { docId: doc.id })}
          >
            <View style={styles.docIcon}>
              <Text style={{ fontSize: 24 }}>{doc.icon}</Text>
            </View>
            <View style={styles.docInfo}>
              <View style={styles.docNameRow}>
                <Text style={styles.docName} numberOfLines={1}>{doc.name}</Text>
                <View style={[styles.docTag, { backgroundColor: doc.tagColor + '22' }]}>
                  <Text style={[styles.docTagText, { color: doc.tagColor }]}>{doc.tag}</Text>
                </View>
              </View>
              <Text style={styles.docMeta}>
                {doc.icon === '📄' ? '📄' : '🖼️'} {doc.type} • {doc.format} • {doc.date}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* ── AI BANNER ── */}
        <TouchableOpacity style={styles.aiBanner} onPress={() => navigation.navigate('AI')}>
          <View style={styles.aiLeft}>
            <Text style={styles.aiTag}>YURIDIK TAHLIL XABARNOMASI</Text>
            <Text style={styles.aiBody}>Al 3 ta hujjatda muddati yaqinlashayotgan bandlarni aniqladi</Text>
          </View>
          <Text style={styles.aiArrow}>→</Text>
        </TouchableOpacity>

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
        ].map((item) => (
          <TouchableOpacity
            key={item.screen}
            style={[styles.navItem, item.center && styles.navItemCenter]}
            onPress={() => navigation.navigate(item.screen)}
          >
            {item.center ? (
              <View style={styles.navCenterBtn}>
                <Text style={{ fontSize: 24 }}>{item.icon}</Text>
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

// ─── STYLES ─────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { flex: 1, paddingHorizontal: 16 },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: C.bg,
    zIndex: 10,
  },
  headerScrolled: {
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: C.primary + '22', alignItems: 'center', justifyContent: 'center' },
  logoIcon: { fontSize: 18 },
  appName: { fontSize: 14, fontWeight: '700', color: C.textDark },
  appSub: { fontSize: 11, color: C.textGrey },

  // Date
  dateRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 4 },
  dateIcon: { fontSize: 13 },
  dateText: { fontSize: 13, color: C.textGrey },
  // Search
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.white, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, marginTop: 6, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4 },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: C.textDark },
  micIcon: { fontSize: 18 },

  // Categories
  catScroll: { marginTop: 14 },
  catChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: C.white, marginRight: 8, elevation: 1 },
  catChipActive: { backgroundColor: C.primary },
  catText: { fontSize: 13, color: C.textDark, fontWeight: '500' },
  catTextActive: { color: C.white },

  // Stats card
  statsCard: { backgroundColor: C.primary, borderRadius: 20, padding: 18, marginTop: 16, position: 'relative' },
  statsTop: { flexDirection: 'row', justifyContent: 'space-between' },
  statsSync: { fontSize: 12, color: '#BFDBFE' },
  statsEnc: { fontSize: 12, color: '#BFDBFE' },
  statsIconBtn: { position: 'absolute', top: 14, right: 14, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: 6 },
  statsLabel: { fontSize: 13, color: '#BFDBFE', marginTop: 12 },
  statsBig: { fontSize: 28, fontWeight: '800', color: C.white, marginTop: 2 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 12 },
  statItem: { alignItems: 'center', flex: 1 },
  statNum: { fontSize: 20, fontWeight: '700', color: C.white },
  statLabel: { fontSize: 11, color: '#BFDBFE', marginTop: 2 },

  // Quick Actions
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 22, marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: C.textDark },
  sectionSub: { fontSize: 13, color: C.textGrey },
  seeAll: { fontSize: 13, color: C.primary, fontWeight: '600' },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  actionCard: { width: '47%', borderRadius: 16, padding: 14, elevation: 2, shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 4 },
  actionIcon: { fontSize: 24, marginBottom: 8 },
  actionTitle: { fontSize: 14, fontWeight: '700' },
  actionSub: { fontSize: 11, marginTop: 2 },

  // Warning
  warningCard: { backgroundColor: C.redLight, borderRadius: 16, padding: 14, marginTop: 16, borderLeftWidth: 4, borderLeftColor: C.red },
  warningTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  warningTag: { fontSize: 11, fontWeight: '700', color: C.red },
  warningTitle: { fontSize: 15, fontWeight: '700', color: C.textDark },
  warningBody: { fontSize: 12, color: C.textGrey, marginTop: 4 },
  warningBtns: { flexDirection: 'row', gap: 10, marginTop: 12 },
  warnBtnPrimary: { backgroundColor: C.red, paddingHorizontal: 18, paddingVertical: 8, borderRadius: 8 },
  warnBtnPrimaryText: { color: C.white, fontWeight: '700', fontSize: 13 },
  warnBtnSecondary: { backgroundColor: 'transparent', paddingHorizontal: 18, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: C.red },
  warnBtnSecondaryText: { color: C.red, fontWeight: '600', fontSize: 13 },

  // Recent docs
  docCard: { flexDirection: 'row', backgroundColor: C.white, borderRadius: 14, padding: 12, marginBottom: 10, alignItems: 'center', elevation: 1 },
  docIcon: { width: 44, height: 44, borderRadius: 10, backgroundColor: C.primary + '15', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  docInfo: { flex: 1 },
  docNameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  docName: { fontSize: 14, fontWeight: '600', color: C.textDark, flex: 1, marginRight: 6 },
  docTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  docTagText: { fontSize: 11, fontWeight: '600' },
  docMeta: { fontSize: 12, color: C.textGrey, marginTop: 4 },

  // AI Banner
  aiBanner: { backgroundColor: C.tertiary, borderRadius: 16, padding: 14, marginTop: 18, marginBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  aiLeft: { flex: 1 },
  aiTag: { fontSize: 10, fontWeight: '700', color: '#93C5FD', letterSpacing: 0.5 },
  aiBody: { fontSize: 13, color: C.white, marginTop: 4, lineHeight: 18 },
  aiArrow: { fontSize: 22, color: C.white, marginLeft: 10 },

  // Bottom Nav
  bottomNav: { flexDirection: 'row', backgroundColor: C.white, paddingBottom: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#E2E8F0', elevation: 10 },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navItemCenter: { position: 'relative', top: -20 },
  navCenterBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', elevation: 6, shadowColor: C.primary, shadowOpacity: 0.4, shadowRadius: 8 },
  navIcon: { fontSize: 20 },
  navLabel: { fontSize: 10, color: C.textGrey, marginTop: 2 },
});