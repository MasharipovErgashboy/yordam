import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, FlatList, StatusBar, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from './ScreenContainer';
import BottomNav from '../../components/BottomNav';
import { useNavigation } from '@react-navigation/native';

// ─── COLORS ─────────────────────────────────────────────────
const C = {
  primary: '#2563EB',
  secondary: '#0F172A',
  bg: '#F1F5FB',
  white: '#FFFFFF',
  textDark: '#0F172A',
  textGrey: '#64748B',
  red: '#EF4444',
  redLight: '#FEE2E2',
  green: '#22C55E',
  greenLight: '#DCFCE7',
  orange: '#F97316',
  orangeLight: '#FFEDD5',
  blue: '#2563EB',
  blueLight: '#DBEAFE',
  purple: '#7C3AED',
  purpleLight: '#EDE9FE',
};

// ─── DUMMY DATA ──────────────────────────────────────────────
const DOCS = [
  {
    id: '1',
    type: 'Shartnoma',
    typeColor: C.blue,
    typeBg: C.blueLight,
    badge: 'Yuridik tasdiqlangan',
    badgeColor: C.blue,
    badgeBg: C.blueLight,
    name: 'Kvartira oldi-sotdi shartnomasi',
    sub: 'Notarial reyestr: №4-11182/2025 • Seri...',
    uploadDate: '21-may, 2025',
    deadline: 'Muddat: 2028-yilgacha',
    deadlineColor: C.textGrey,
    icon: 'document-text-outline',
  },
  {
    id: '2',
    type: 'Chek',
    typeColor: C.red,
    typeBg: C.redLight,
    badge: '5 kun qoldi',
    badgeColor: C.red,
    badgeBg: C.redLight,
    name: 'Samsung Galaxy S24 Ultra xarid cheki',
    sub: "Do'kon: MediaPark Toshkent |Shayxont",
    uploadDate: '18-may, 2025',
    deadline: 'Kafolat yakuni: 25-may',
    deadlineColor: C.red,
    icon: 'receipt-outline',
  },
  {
    id: '3',
    type: 'Kafolat',
    typeColor: C.blue,
    typeBg: C.blueLight,
    badge: '2 yil qoldi',
    badgeColor: C.blue,
    badgeBg: C.blueLight,
    name: 'Bosch kir yuvish mashinasi kafolat taloni',
    sub: 'Model: Serie 6 WAT28481ME • Zavod',
    uploadDate: '10-aprel, 2025',
    deadline: 'Amal qiladi: 2027-yilgacha',
    deadlineColor: C.textGrey,
    icon: 'shield-checkmark-outline',
  },
  {
    id: '4',
    type: 'Guvohnoma',
    typeColor: C.green,
    typeBg: C.greenLight,
    badge: 'Faol (2030-yilgacha)',
    badgeColor: C.green,
    badgeBg: C.greenLight,
    name: 'Haydovchilik guvohnomasi (B toifa)',
    sub: 'Guvohnoma №: AB 3381920 • YHXX Ti...',
    uploadDate: '02-yanvar, 2025',
    deadline: 'QR-kod bilan tekshiriladi',
    deadlineColor: C.blue,
    icon: 'card-outline',
  },
  {
    id: '5',
    type: "Sug'urta",
    typeColor: C.red,
    typeBg: C.redLight,
    badge: 'Tugashiga 18 kun qoldi',
    badgeColor: C.red,
    badgeBg: C.redLight,
    name: "Avtomobil sug'urta polisi (KASKO)",
    sub: "Sug'urtaolchi: Apex Insurance • Polis",
    uploadDate: '12-fevral, 2025',
    deadline: 'Uzaytirish talab etiladi',
    deadlineColor: C.red,
    icon: 'car-outline',
  },
];

// ─── COMPONENT ───────────────────────────────────────────────
export default function DocumentsScreen() {
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [sortType, setSortType] = useState<'newest' | 'oldest' | 'name'>('newest');

  const handleSortToggle = () => {
    Alert.alert(
      "Hujjatlarni saralash",
      "Tartiblash usulini tanlang:",
      [
        { text: "Eng yangi (sana bo'yicha)", onPress: () => setSortType('newest') },
        { text: "Eng eski (sana bo'yicha)", onPress: () => setSortType('oldest') },
        { text: "Nomi bo'yicha (A-Z)", onPress: () => setSortType('name') },
        { text: "Bekor qilish", style: "cancel" },
      ]
    );
  };

  const getSortLabel = () => {
    if (sortType === 'newest') return "↓ Sana bo'yicha (eng yangi)";
    if (sortType === 'oldest') return "↑ Sana bo'yicha (eng eski)";
    return "↕ Nomi bo'yicha (A-Z)";
  };

  const filtered = DOCS.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => {
    if (sortType === 'newest') return Number(b.id) - Number(a.id);
    if (sortType === 'oldest') return Number(a.id) - Number(b.id);
    if (sortType === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <ScreenContainer style={styles.safe}>
      <StatusBar barStyle="dark-content" />

      {/* ── TITLE ── */}
      <View style={styles.titleRow}>
        <TouchableOpacity
          onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Home')}
          style={styles.backBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={24} color={C.textDark} />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Hujjatlarim</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>24 ta</Text>
        </View>
      </View>

      {/* ── SEARCH ── */}
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={18} color={C.textGrey} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Nomi, sana yoki so'z bo'yicha..."
          placeholderTextColor={C.textGrey}
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
        />
      </View>

      {/* ── SORT + VIEW MODE ── */}
      <View style={styles.sortRow}>
        <TouchableOpacity style={styles.sortBtn} onPress={handleSortToggle}>
          <Text style={styles.sortText}>{getSortLabel()}</Text>
          <Ionicons name="chevron-down" size={13} color={C.primary} style={{ marginLeft: 4 }} />
        </TouchableOpacity>
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[styles.toggleBtn, viewMode === 'list' && styles.toggleBtnActive]}
            onPress={() => setViewMode('list')}
          >
            <Ionicons
              name="list"
              size={17}
              color={viewMode === 'list' ? C.white : C.textGrey}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, viewMode === 'grid' && styles.toggleBtnActive]}
            onPress={() => setViewMode('grid')}
          >
            <Ionicons
              name="grid"
              size={15}
              color={viewMode === 'grid' ? C.white : C.textGrey}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── DOC LIST ── */}
      <FlatList
        key={viewMode}
        data={filtered}
        keyExtractor={item => item.id}
        numColumns={viewMode === 'grid' ? 2 : 1}
        columnWrapperStyle={viewMode === 'grid' ? styles.gridRow : undefined}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) =>
          viewMode === 'grid' ? (
            <TouchableOpacity
              style={styles.docCardGrid}
              onPress={() => navigation.navigate('Details', { docId: item.id })}
            >
              <View style={[styles.docIconBoxGrid, { backgroundColor: item.typeBg }]}>
                <Ionicons name={item.icon as any} size={22} color={item.typeColor} />
              </View>
              <View style={[styles.typeBadge, { backgroundColor: item.typeBg, alignSelf: 'flex-start', marginTop: 8 }]}>
                <Text style={[styles.typeBadgeText, { color: item.typeColor }]}>{item.type}</Text>
              </View>
              <Text style={styles.docNameGrid} numberOfLines={2}>{item.name}</Text>
              <Text style={styles.docMetaGrid}>{item.uploadDate}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.docCard}
              onPress={() => navigation.navigate('Details', { docId: item.id })}
            >
              {/* Icon + badge */}
              <View style={[styles.docIconBox, { backgroundColor: item.typeBg }]}>
                <Ionicons name={item.icon as any} size={24} color={item.typeColor} />
              </View>

              <View style={styles.docBody}>
                {/* Type + badge */}
                <View style={styles.docTopRow}>
                  <View style={[styles.typeBadge, { backgroundColor: item.typeBg }]}>
                    <Text style={[styles.typeBadgeText, { color: item.typeColor }]}>{item.type}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: item.badgeBg }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                      {item.badgeColor === C.red && (
                        <Ionicons name="time-outline" size={11} color={C.red} />
                      )}
                      <Text style={[styles.statusBadgeText, { color: item.badgeColor }]}>
                        {item.badge}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.moreBtn}>
                    <Ionicons name="ellipsis-vertical" size={16} color={C.textGrey} />
                  </TouchableOpacity>
                </View>

                {/* Name */}
                <Text style={styles.docName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.docSub} numberOfLines={1}>{item.sub}</Text>

                {/* Meta */}
                <View style={styles.docMetaRow}>
                  <View style={styles.docMetaItem}>
                    <Ionicons name="arrow-up-circle-outline" size={13} color={C.textGrey} />
                    <Text style={styles.docMeta}>Yuklangan: {item.uploadDate}</Text>
                  </View>
                  <View style={styles.docMetaItem}>
                    <Ionicons
                      name={item.deadlineColor === C.red ? "alert-circle-outline" : "calendar-outline"}
                      size={13}
                      color={item.deadlineColor}
                    />
                    <Text style={[styles.docDeadline, { color: item.deadlineColor }]}>
                      {item.deadline}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )
        }
        ListFooterComponent={() => (
          <View style={styles.storageCard}>
            <View style={styles.storageIconWrapper}>
              <Ionicons name="cloud-outline" size={24} color={C.primary} />
            </View>
            <View style={styles.storageInfo}>
              <Text style={styles.storageTitle}>Xavfsiz bulutli xotira</Text>
              <View style={styles.storageBarBg}>
                <View style={[styles.storageBarFill, { width: '24%' }]} />
              </View>
              <Text style={styles.storageText}>1.2 GB / 5 GB ishlatildi</Text>
            </View>
            <Text style={styles.storageSize}>1.2 GB{'\n'}<Text style={styles.storageSub}>/ 5 GB</Text></Text>
          </View>
        )}
      />

      {/* ── BOTTOM NAV ── */}
      <BottomNav activeScreen="Documents" />
    </ScreenContainer>
  );
}

// ─── STYLES ──────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },

  // Title
  titleRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginTop: 14, marginBottom: 12, gap: 10 },
  backBtn: { padding: 4, marginRight: 2 },
  pageTitle: { fontSize: 24, fontWeight: '800', color: C.textDark },
  countBadge: { backgroundColor: C.blueLight, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 },
  countText: { fontSize: 13, color: C.primary, fontWeight: '700' },

  // Search
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.white, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 6, marginHorizontal: 16, marginBottom: 14, elevation: 2 },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 13, color: C.textDark, paddingVertical: 6 },
  // Sort
  sortRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 12 },
  sortBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  sortText: { fontSize: 13, color: '#334155', fontWeight: '600' },
  sortArrow: { fontSize: 11, color: C.primary, fontWeight: '700' },
  viewToggle: { flexDirection: 'row', backgroundColor: C.white, borderRadius: 8, overflow: 'hidden', elevation: 1 },
  toggleBtn: { paddingHorizontal: 10, paddingVertical: 6 },
  toggleBtnActive: { backgroundColor: C.primary },
  toggleIcon: { fontSize: 16, color: C.textGrey },
  toggleIconActive: { color: C.white },

  // Grid view styles
  gridRow: { justifyContent: 'space-between', gap: 10 },
  docCardGrid: {
    width: '48%',
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  docIconBoxGrid: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docNameGrid: { fontSize: 13, fontWeight: '700', color: C.textDark, marginTop: 8 },
  docMetaGrid: { fontSize: 11, color: C.textGrey, marginTop: 4 },

  // Doc list
  list: { paddingHorizontal: 16, paddingBottom: 110 },
  docCard: { flexDirection: 'row', backgroundColor: C.white, borderRadius: 16, padding: 12, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4 },
  docIconBox: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  docIconText: { fontSize: 24 },
  docBody: { flex: 1 },
  docTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4, gap: 6 },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  typeBadgeText: { fontSize: 11, fontWeight: '600' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  statusBadgeText: { fontSize: 11, fontWeight: '600' },
  moreBtn: { marginLeft: 'auto' as any },
  moreIcon: { fontSize: 18, color: C.textGrey },
  docName: { fontSize: 14, fontWeight: '700', color: C.textDark },
  docSub: { fontSize: 12, color: C.textGrey, marginTop: 2 },
  docMetaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 6 },
  docMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  docMeta: { fontSize: 11, color: C.textGrey },
  docDeadline: { fontSize: 11, fontWeight: '600' },

  // Storage
  storageCard: { flexDirection: 'row', backgroundColor: '#E0F2FE', borderRadius: 14, padding: 12, alignItems: 'center', marginTop: 4, gap: 10 },
  storageIconWrapper: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#BAE6FD', alignItems: 'center', justifyContent: 'center' },
  storageInfo: { flex: 1 },
  storageTitle: { fontSize: 13, fontWeight: '700', color: C.secondary },
  storageBarBg: { height: 6, backgroundColor: '#BAE6FD', borderRadius: 4, marginVertical: 4 },
  storageBarFill: { height: 6, backgroundColor: C.primary, borderRadius: 4 },
  storageText: { fontSize: 11, color: C.textGrey },
  storageSize: { fontSize: 15, fontWeight: '800', color: C.secondary, textAlign: 'right' },
  storageSub: { fontSize: 11, fontWeight: '400', color: C.textGrey },
});