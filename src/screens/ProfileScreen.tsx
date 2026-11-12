import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Switch, Alert,
} from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import { useNavigation } from '@react-navigation/native';

// ─── COLORS ─────────────────────────────────────────────────
const C = {
  primary: '#2563EB',
  secondary: '#0F172A',
  bg: '#F8FAFC',
  white: '#FFFFFF',
  textDark: '#0F172A',
  textGrey: '#64748B',
  blueLight: '#EFF6FF',
  blueBadge: '#DBEAFE',
  blueText: '#1D4ED8',
  green: '#16A34A',
  greenLight: '#DCFCE7',
  red: '#DC2626',
  redBg: '#FEF2F2',
  redBorder: '#FECACA',
  logoutBg: '#FEE2E2',
};

// ─── COMPONENT ───────────────────────────────────────────────
export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const [pushEnabled, setPushEnabled] = useState(true);

  const handleClearCache = () => {
    Alert.alert('Kesh tozalandi', '42 MB vaqtincha fayllar muvaffaqiyatli tozalandi.');
  };

  const handleClearWallet = () => {
    Alert.alert(
      'Hamyon ma\'lumotlarini tozalash',
      'Barcha shaxsiy hujjatlar va eslatmalar qurilmadan o\'chiriladi. Ushbu amalni bekor qilib bo\'lmaydi.',
      [
        { text: 'Bekor qilish', style: 'cancel' },
        { text: 'Tozalash', style: 'destructive', onPress: () => navigation.navigate('Home') },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Chiqish',
      'Haqiqatan ham mini-ilovadan chiqmoqchimisiz?',
      [
        { text: 'Yo\'q', style: 'cancel' },
        { text: 'Chiqish', style: 'destructive', onPress: () => navigation.navigate('Home') },
      ]
    );
  };

  return (
    <ScreenContainer style={styles.safe}>
      <StatusBar barStyle="dark-content" />

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleCol}>
          <View style={styles.headerTitleRow}>
            <View style={styles.logoBox}><Text style={{ fontSize: 14 }}>💼</Text></View>
            <Text style={styles.appName}>Profil va xavfsizlik</Text>
            <Text style={styles.checkBadge}>✓</Text>
          </View>
          <Text style={styles.appSub}>Hujjatlar hamyoni</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── USER CARD ── */}
        <View style={styles.userCard}>
          <View style={styles.userTop}>
            <View style={styles.userAvatarWrapper}>
              <View style={styles.userAvatar}>
                <Text style={{ fontSize: 28 }}>👨‍💼</Text>
              </View>
              <View style={styles.verifiedDot}>
                <Text style={styles.verifiedDotText}>✓</Text>
              </View>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>Sardorbek Karimov</Text>
              <Text style={styles.userId}>ID: HH-8842-UZB</Text>
              <View style={styles.oneIdBadge}>
                <Text style={styles.oneIdShield}>🛡️</Text>
                <Text style={styles.oneIdText}>Super App Tasdiqlangan (OneID)</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── SECTION 2: ILOVA SOZLAMALARI ── */}
        <View style={styles.sectionHeaderSimple}>
          <Text style={styles.sectionIcon}>⚙️</Text>
          <Text style={styles.sectionTitle}>Ilova sozlamalari</Text>
        </View>
        <View style={styles.cardGroup}>
          {/* Til */}
          <TouchableOpacity style={styles.cardItem}>
            <View style={[styles.itemIconBox, { backgroundColor: C.blueLight }]}>
              <Text style={styles.itemIcon}>文A</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>Tilni tanlash</Text>
              <Text style={styles.itemSub}>Ilova interfeysi tili</Text>
            </View>
            <Text style={styles.linkAction}>O'zbekcha (Lotin) ›</Text>
          </TouchableOpacity>
          <View style={styles.divider} />

          {/* AI Ruxsatlari */}
          <TouchableOpacity style={styles.cardItem} onPress={() => navigation.navigate('AI')}>
            <View style={[styles.itemIconBox, { backgroundColor: C.blueLight }]}>
              <Text style={styles.itemIcon}>✦</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>AI yordamchi ruxsatlari</Text>
              <Text style={styles.itemSub} numberOfLines={1}>Hujjatlarni tahlil qilish chegar...</Text>
            </View>
            <Text style={styles.linkActionGrey}>Tanlanganlar ›</Text>
          </TouchableOpacity>
          <View style={styles.divider} />

          {/* Push-ogohlantirishlar */}
          <View style={styles.cardItem}>
            <View style={[styles.itemIconBox, { backgroundColor: C.blueLight }]}>
              <Text style={styles.itemIcon}>🔔</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>Push-ogohlantirishlar</Text>
              <Text style={styles.itemSub}>Telegram bot & Super App faol</Text>
            </View>
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              thumbColor={C.white}
              trackColor={{ false: '#CBD5E1', true: C.primary }}
            />
          </View>
        </View>

        {/* ── SECTION 3: MA'LUMOTLAR VA MAXFIYLIK ── */}
        <View style={styles.sectionHeaderSimple}>
          <Text style={styles.sectionIcon}>🛡️</Text>
          <Text style={styles.sectionTitle}>Ma'lumotlar va Maxfiylik</Text>
        </View>
        <View style={styles.cardGroup}>
          {/* Arxivlash */}
          <TouchableOpacity style={styles.cardItem}>
            <View style={[styles.itemIconBox, { backgroundColor: C.blueLight }]}>
              <Text style={styles.itemIcon}>📦</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>Hujjatlarni arxivlash</Text>
              <Text style={styles.itemSub}>ZIP va PDF shaklida yuklab olish</Text>
            </View>
            <Text style={styles.trailingIcon}>📥</Text>
          </TouchableOpacity>
          <View style={styles.divider} />

          {/* Kesh tozalash */}
          <TouchableOpacity style={styles.cardItem} onPress={handleClearCache}>
            <View style={[styles.itemIconBox, { backgroundColor: C.blueLight }]}>
              <Text style={styles.itemIcon}>🧹</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>Kesh xotirasini tozalash</Text>
              <Text style={styles.itemSub}>Vaqtincha fayllar: 42 MB</Text>
            </View>
            <Text style={styles.linkAction}>Tozalash</Text>
          </TouchableOpacity>
          <View style={styles.divider} />

          {/* Maxfiylik */}
          <TouchableOpacity style={styles.cardItem}>
            <View style={[styles.itemIconBox, { backgroundColor: C.blueLight }]}>
              <Text style={styles.itemIcon}>🛡️</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>Maxfiylik siyosati</Text>
              <Text style={styles.itemSub}>Litsenziya va huquqiy kafolatlar</Text>
            </View>
            <Text style={styles.trailingIcon}>↗</Text>
          </TouchableOpacity>
        </View>

        {/* ── DANGER / ACTION BUTTONS ── */}
        <TouchableOpacity style={styles.clearWalletBtn} onPress={handleClearWallet}>
          <Text style={styles.clearWalletIcon}>🗑️</Text>
          <Text style={styles.clearWalletText}>Hamyon ma'lumotlarini tozalash</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>Mini-ilovadan chiqish</Text>
        </TouchableOpacity>

        {/* ── FOOTER CERTIFICATE ── */}
        <View style={styles.certBox}>
          <Text style={styles.certTop}>🛡️ Davlat xizmatlari shifrlangan standarti</Text>
          <Text style={styles.certBottom}>Hujjatlar Hamyoni v1.4.2 • Super App Ekotizimi</Text>
        </View>

        <View style={{ height: 110 }} />
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
                <Text style={[styles.navLabel, item.screen === 'Profile' && styles.navLabelActive]}>
                  {item.label}
                </Text>
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
  scroll: { paddingHorizontal: 16, paddingTop: 6 },

  // Header
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, gap: 10 },
  backBtn: { padding: 4 },
  backArrow: { fontSize: 26, color: C.textDark, fontWeight: '300' },
  headerTitleCol: { justifyContent: 'center' },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  logoBox: { width: 22, height: 22, borderRadius: 6, backgroundColor: C.blueBadge, alignItems: 'center', justifyContent: 'center' },
  appName: { fontSize: 14, fontWeight: '700', color: C.textDark },
  checkBadge: { fontSize: 12, color: C.primary, fontWeight: '800' },
  appSub: { fontSize: 11, color: C.textGrey, marginTop: 1 },
  avatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center' },

  // User card
  userCard: { backgroundColor: C.white, borderRadius: 18, padding: 14, marginBottom: 14, elevation: 1 },
  userTop: { flexDirection: 'row', gap: 12, alignItems: 'center', marginBottom: 14 },
  userAvatarWrapper: { position: 'relative' },
  userAvatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: C.blueBadge, alignItems: 'center', justifyContent: 'center' },
  verifiedDot: { position: 'absolute', bottom: -2, right: -2, width: 18, height: 18, borderRadius: 9, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: C.white },
  verifiedDotText: { color: C.white, fontSize: 10, fontWeight: '800' },
  userInfo: { flex: 1 },
  userName: { fontSize: 16, fontWeight: '800', color: C.textDark },
  userId: { fontSize: 12, color: C.textGrey, marginVertical: 2 },
  oneIdBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EFF6FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start', gap: 4, marginTop: 2 },
  oneIdShield: { fontSize: 11 },
  oneIdText: { fontSize: 11, color: C.blueText, fontWeight: '700' },

  // Storage
  storageBox: { backgroundColor: '#F8FAFC', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#F1F5F9' },
  storageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  storageHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cloudIcon: { fontSize: 14 },
  storageTitle: { fontSize: 12, fontWeight: '600', color: C.textDark },
  storagePercent: { fontSize: 12, color: C.primary, fontWeight: '800' },
  storageBarBg: { height: 6, backgroundColor: '#E2E8F0', borderRadius: 3, marginVertical: 6 },
  storageBarFill: { height: 6, backgroundColor: C.primary, borderRadius: 3 },
  storageFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  storageFooterText: { fontSize: 11, color: C.textGrey },
  docCountBadge: { backgroundColor: '#E2E8F0', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  docCountBadgeText: { fontSize: 10, color: C.textDark, fontWeight: '600' },

  // Section headers
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, marginBottom: 8, paddingHorizontal: 2 },
  sectionHeaderSimple: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10, marginBottom: 8, paddingHorizontal: 2 },
  sectionHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sectionIcon: { fontSize: 14 },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: C.textDark },
  sectionTag: { fontSize: 10, fontWeight: '800', color: C.primary, letterSpacing: 0.3 },

  // Card Group
  cardGroup: { backgroundColor: C.white, borderRadius: 16, paddingHorizontal: 14, paddingVertical: 4, marginBottom: 10, elevation: 1 },
  cardItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 12 },
  itemIconBox: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  itemIcon: { fontSize: 16, fontWeight: '700', color: C.primary },
  itemTitle: { fontSize: 13, fontWeight: '700', color: C.textDark },
  itemSub: { fontSize: 11, color: C.textGrey, marginTop: 2 },
  divider: { height: 1, backgroundColor: '#F1F5F9' },
  linkAction: { fontSize: 12, color: C.primary, fontWeight: '700' },
  linkActionGrey: { fontSize: 12, color: C.textGrey, fontWeight: '600' },
  trailingIcon: { fontSize: 16, color: C.textGrey },
  secureBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EFF6FF', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, gap: 4 },
  secureBadgeDot: { fontSize: 8, color: C.primary },
  secureBadgeText: { fontSize: 11, color: C.primary, fontWeight: '700' },

  // Theme
  themeHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, paddingBottom: 8 },
  themeCurrentText: { fontSize: 12, color: C.textGrey },
  themeSegmentRow: { flexDirection: 'row', backgroundColor: '#F1F5F9', borderRadius: 12, padding: 3, marginBottom: 12 },
  themeSegment: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 10 },
  themeSegmentActive: { backgroundColor: C.white, elevation: 1 },
  themeSegmentText: { fontSize: 12, color: C.textGrey, fontWeight: '500' },
  themeSegmentTextActive: { color: C.textDark, fontWeight: '700' },

  // AI tip
  aiTip: { flexDirection: 'row', backgroundColor: C.blueLight, borderRadius: 14, padding: 12, gap: 10, alignItems: 'flex-start', marginBottom: 12 },
  aiTipIcon: { fontSize: 18, color: C.primary },
  aiTipText: { flex: 1, fontSize: 13, color: '#1E40AF', lineHeight: 18 },
  aiTipBold: { fontWeight: '700' },

  // Danger buttons
  clearWalletBtn: { flexDirection: 'row', backgroundColor: C.white, borderRadius: 16, paddingVertical: 14, alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8, marginBottom: 10, borderWidth: 1, borderColor: C.redBorder },
  clearWalletIcon: { fontSize: 16 },
  clearWalletText: { fontSize: 14, color: C.red, fontWeight: '700' },
  logoutBtn: { flexDirection: 'row', backgroundColor: C.logoutBg, borderRadius: 16, paddingVertical: 14, alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 14 },
  logoutIcon: { fontSize: 16 },
  logoutText: { fontSize: 14, color: C.red, fontWeight: '700' },

  // Certificate / Footer note
  certBox: { alignItems: 'center', paddingVertical: 6, gap: 4 },
  certTop: { fontSize: 11, color: C.primary, fontWeight: '600' },
  certBottom: { fontSize: 10, color: C.textGrey },

  // Bottom Nav
  bottomNav: { flexDirection: 'row', backgroundColor: C.white, paddingBottom: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#E2E8F0', elevation: 10 },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navItemCenter: { position: 'relative', top: -20 },
  navCenterBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', elevation: 6, shadowColor: C.primary, shadowOpacity: 0.4, shadowRadius: 8 },
  navIcon: { fontSize: 20 },
  navLabel: { fontSize: 10, color: C.textGrey, marginTop: 2 },
  navLabelActive: { color: C.primary, fontWeight: '700' },
});