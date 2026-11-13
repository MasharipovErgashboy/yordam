import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../components/ScreenContainer';
import BottomNav from '../components/BottomNav';
import { useNavigation, useRoute } from '@react-navigation/native';

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
  orange: '#F97316',
  orangeLight: '#FFEDD5',
  red: '#EF4444',
  redLight: '#FEE2E2',
  yellow: '#F59E0B',
  yellowLight: '#FEF3C7',
};

// ─── DUMMY DOC DATA ───────────────────────────────────────────
const DOC = {
  id: 'YUN-2024-8842',
  title: 'Kvartira Ijara Shartnomasi #42',
  type: "Ko'chmas mulk ijara shartnomasi",
  format: 'PDF',
  category: 'SHARTNOMA',
  status: 'Yaroqli',
  size: '2.1 MB',
  pages: 4,
  signedDate: '15-sen, 2024',
  expiryDate: '15-sen, 2025',
  expiryLeft: '4 oy qoldi',
  party1: 'Sardorbek K.',
  party1Role: 'Ijarachi',
  party2: 'Alisher T.',
  party2Role: 'Ijara beruvchi',
  monthlyPayment: '5,000,000 UZS',
  paymentDay: 'Har oyning 5-kuni',
  aiSummary:
    "Mazkur shartnoma 1 yil muddatga tuzilgan. Muhim shart: muddatidan oldin bekor qilish uchun kamida 30 kun oldin yozma xabarnoma berilishi shart. Barcha kommunal to'lovlar ijarachi zimmasiga yuklatilgan.",
  aiAccuracy: '99.4%',
  tags: ['#Depozit_10mln', '#Kommunal_To\'lov', '#Yunusobod', '#Notarial_Tasdiq'],
};

// ─── COMPONENT ───────────────────────────────────────────────
export default function DetailsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const handleDelete = () => {
    Alert.alert(
      "Hujjatni o'chirish",
      "Hujjatni o'chirishni tasdiqlaysizmi? Bu amalni bekor qilib bo'lmaydi.",
      [
        { text: 'Bekor qilish', style: 'cancel' },
        {
          text: "O'chirish",
          style: 'destructive',
          onPress: () => navigation.navigate('Documents'),
        },
      ]
    );
  };

  return (
    <ScreenContainer style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── HEADER ── */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={C.textDark} />
          </TouchableOpacity>
          <View style={styles.logoBox}>
            <Ionicons name="document-text-outline" size={16} color={C.primary} />
          </View>
          <View>
            <Text style={styles.appName}>Hujjat tafsilotlari</Text>
            <Text style={styles.appSub}>Hujjatlar hamyoni</Text>
          </View>
          <View style={{ flex: 1 }} />
          <View style={styles.avatar}>
            <Ionicons name="person" size={16} color={C.primary} />
          </View>
        </View>

        {/* ── BREADCRUMB ── */}
        <View style={styles.breadcrumb}>
          <Text style={styles.breadcrumbText}>PDF</Text>
          <Text style={styles.breadcrumbDot}> • </Text>
          <Text style={styles.breadcrumbText}>SHARTNOMA</Text>
          <Text style={styles.breadcrumbDot}> • </Text>
          <View style={styles.validBadge}>
            <Ionicons name="checkmark-circle" size={12} color={C.green} style={{ marginRight: 3 }} />
            <Text style={styles.validText}>Yaroqli</Text>
          </View>
        </View>

        {/* ── DOC TITLE ROW ── */}
        <View style={styles.titleRow}>
          <Text style={styles.docTitle} numberOfLines={2}>{DOC.title}</Text>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="share-outline" size={18} color={C.textDark} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="ellipsis-vertical" size={18} color={C.textDark} />
          </TouchableOpacity>
        </View>

        {/* ── PREVIEW CARD ── */}
        <View style={styles.previewCard}>
          <View style={styles.previewImage}>
            <Ionicons name="document-text-outline" size={42} color={C.primary} />
            <Text style={styles.previewLines}>▬▬▬▬▬▬▬▬</Text>
            <Text style={styles.previewLines}>▬▬▬▬▬</Text>
            <Text style={styles.previewLines}>▬▬▬▬▬▬▬</Text>
          </View>
          <View style={styles.previewMeta}>
            <View style={styles.previewMetaLeft}>
              <View style={styles.pdfBadge}>
                <Ionicons name="checkmark-circle-outline" size={12} color={C.primary} style={{ marginRight: 4 }} />
                <Text style={styles.pdfBadgeText}>Tasdiqlangan PDF</Text>
              </View>
              <View style={styles.sizeBadge}>
                <Ionicons name="cube-outline" size={12} color={C.textGrey} style={{ marginRight: 4 }} />
                <Text style={styles.sizeBadgeText}>{DOC.size}</Text>
              </View>
              <View style={styles.pagesBadge}>
                <Ionicons name="copy-outline" size={12} color={C.textGrey} style={{ marginRight: 4 }} />
                <Text style={styles.pagesBadgeText}>{DOC.pages} sahifa</Text>
              </View>
            </View>
            <View style={styles.verifiedCircle}>
              <Ionicons name="shield-checkmark" size={18} color={C.primary} />
            </View>
          </View>
          <TouchableOpacity style={styles.viewBtn}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="scan-outline" size={16} color={C.primary} />
              <Text style={styles.viewBtnText}>Kattalashtirib ko'rish</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ── AI SUMMARY ── */}
        <View style={styles.aiCard}>
          <View style={styles.aiHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="sparkles" size={16} color={C.primary} />
              <View>
                <Text style={styles.aiTitle}>AI tahlil xulosasi</Text>
                <Text style={styles.aiSub}>GPT-4 Legal Vision orqali</Text>
              </View>
            </View>
            <View style={styles.accuracyBadge}>
              <Text style={styles.accuracyText}>⬤ {DOC.aiAccuracy} aniqlik</Text>
            </View>
          </View>
          <Text style={styles.aiText}>
            Mazkur shartnoma{' '}
            <Text style={styles.aiHighlight}>1 yil muddatga</Text> tuzilgan.{' '}
            <Text style={styles.aiMuhim}>Muhim shart:</Text>{' '}
            muddatidan oldin bekor qilish uchun kamida{' '}
            <Text style={styles.aiHighlight}>30 kun oldin</Text>{' '}
            yozma xabarnoma berilishi shart. Barcha kommunal to'lovlar ijarachi zimmasiga yuklatilgan.
          </Text>
          <View style={styles.tagsRow}>
            {DOC.tags.map((tag, i) => (
              <View key={i} style={styles.tagChip}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── PARAMS ── */}
        <View style={styles.paramsCard}>
          <View style={styles.paramsHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="list-outline" size={16} color={C.textDark} />
              <Text style={styles.paramsTitle}>Asosiy parametrlar</Text>
            </View>
            <Text style={styles.paramsId}>ID: {DOC.id}</Text>
          </View>

          {/* Type */}
          <View style={styles.paramRow}>
            <View style={styles.paramIconBox}>
              <Ionicons name="document-text-outline" size={18} color={C.primary} />
            </View>
            <View>
              <Text style={styles.paramLabel}>Hujjat turi</Text>
              <Text style={styles.paramValue}>{DOC.type}</Text>
            </View>
          </View>
          <View style={styles.divider} />

          {/* Dates */}
          <View style={styles.paramDualRow}>
            <View style={styles.paramHalf}>
              <Text style={styles.paramLabel}>Imzolangan sana</Text>
              <Text style={styles.paramValue}>{DOC.signedDate}</Text>
              <View style={styles.greenBadge}>
                <Ionicons name="checkmark-circle" size={11} color={C.green} style={{ marginRight: 3 }} />
                <Text style={styles.greenBadgeText}>Rasmiylashtirildi</Text>
              </View>
            </View>
            <View style={styles.paramHalf}>
              <Text style={styles.paramLabel}>Amal qilish muddati</Text>
              <Text style={styles.paramValue}>{DOC.expiryDate}</Text>
              <View style={styles.orangeBadge}>
                <Ionicons name="time-outline" size={11} color={C.orange} style={{ marginRight: 3 }} />
                <Text style={styles.orangeBadgeText}>{DOC.expiryLeft}</Text>
              </View>
            </View>
          </View>
          <View style={styles.divider} />

          {/* Parties */}
          <View style={styles.paramRow}>
            <View style={styles.paramIconBox}>
              <Ionicons name="people-outline" size={18} color={C.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.paramLabel}>Tomonlar</Text>
              <View style={styles.partiesRow}>
                <View>
                  <Text style={styles.paramValue}>{DOC.party1}</Text>
                  <Text style={styles.paramMeta}>{DOC.party1Role}</Text>
                </View>
                <View style={styles.partiesDivider} />
                <View>
                  <Text style={styles.paramValue}>{DOC.party2}</Text>
                  <Text style={styles.paramMeta}>{DOC.party2Role}</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.divider} />

          {/* Payment */}
          <View style={styles.paramRow}>
            <View style={styles.paramIconBox}>
              <Ionicons name="card-outline" size={18} color={C.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.paramLabel}>Oylik to'lov summasi</Text>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentAmount}>{DOC.monthlyPayment} / oyiga</Text>
                <View style={styles.paymentBadge}>
                  <Text style={styles.paymentBadgeText}>{DOC.paymentDay}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* ── ACTIONS ── */}
        <Text style={styles.actionsTitle}>Amallar va Boshqaruv</Text>
        <View style={styles.actionsGrid}>
          {[
            { icon: 'notifications-outline', label: 'Eslatma yaratish', sub: "To'lov vaqti bo'yicha", screen: 'Reminders' },
            { icon: 'briefcase-outline', label: "To'plamga qo'shish", sub: 'Dalillar hamyoniga', screen: 'Legal' },
            { icon: 'download-outline', label: 'Yuklab olish', sub: `PDF nusxasi ${DOC.size}`, screen: null },
            { icon: 'create-outline', label: 'Tahrirlash', sub: "Metama'lumotlarni", screen: null },
          ].map((a, i) => (
            <TouchableOpacity
              key={i}
              style={styles.actionCard}
              onPress={() => a.screen && navigation.navigate(a.screen)}
            >
              <Ionicons name={a.icon as any} size={22} color={C.primary} style={{ marginBottom: 6 }} />
              <Text style={styles.actionLabel}>{a.label}</Text>
              <Text style={styles.actionSub}>{a.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── DELETE ── */}
        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={16} color={C.red} style={{ marginRight: 6 }} />
          <Text style={styles.deleteBtnText}>Hujjatni o'chirish</Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* ── BOTTOM NAV ── */}
      <BottomNav activeScreen="Documents" />
    </ScreenContainer>
  );
}

// ─── STYLES ──────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 16, paddingTop: 10 },

  // Header
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  backArrow: { fontSize: 28, color: C.textDark, fontWeight: '300' },
  logoBox: { width: 30, height: 30, borderRadius: 8, backgroundColor: C.blueLight, alignItems: 'center', justifyContent: 'center' },
  appName: { fontSize: 13, fontWeight: '700', color: C.textDark },
  appSub: { fontSize: 11, color: C.textGrey },
  avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center' },

  // Breadcrumb
  breadcrumb: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  breadcrumbText: { fontSize: 12, color: C.textGrey, fontWeight: '600' },
  breadcrumbDot: { fontSize: 12, color: C.textGrey },
  validBadge: { backgroundColor: C.greenLight, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  validText: { fontSize: 12, color: C.green, fontWeight: '700' },

  // Title
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14, gap: 8 },
  docTitle: { flex: 1, fontSize: 20, fontWeight: '800', color: C.textDark, lineHeight: 26 },
  iconBtn: { padding: 6, backgroundColor: C.white, borderRadius: 8, elevation: 1 },
  iconBtnText: { fontSize: 18, color: C.textDark },

  // Preview
  previewCard: { backgroundColor: C.white, borderRadius: 18, padding: 16, marginBottom: 14, elevation: 2 },
  previewImage: { backgroundColor: C.blueLight, borderRadius: 12, padding: 20, alignItems: 'center', marginBottom: 12 },
  previewIcon: { fontSize: 32, marginBottom: 8 },
  previewLines: { fontSize: 10, color: '#93C5FD', letterSpacing: 2, marginVertical: 2 },
  previewMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  previewMetaLeft: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  pdfBadge: { backgroundColor: C.greenLight, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  pdfBadgeText: { fontSize: 11, color: C.green, fontWeight: '600' },
  sizeBadge: { backgroundColor: C.blueLight, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  sizeBadgeText: { fontSize: 11, color: C.primary, fontWeight: '600' },
  pagesBadge: { backgroundColor: '#F3F4F6', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  pagesBadgeText: { fontSize: 11, color: C.textGrey, fontWeight: '600' },
  verifiedCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.blueLight, alignItems: 'center', justifyContent: 'center' },
  viewBtn: { backgroundColor: C.primary, borderRadius: 12, padding: 12, alignItems: 'center' },
  viewBtnText: { fontSize: 14, color: C.white, fontWeight: '700' },

  // AI
  aiCard: { backgroundColor: C.white, borderRadius: 18, padding: 16, marginBottom: 14, elevation: 2 },
  aiHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  aiTitle: { fontSize: 15, fontWeight: '700', color: C.textDark },
  aiSub: { fontSize: 11, color: C.textGrey, marginTop: 2 },
  accuracyBadge: { backgroundColor: C.greenLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  accuracyText: { fontSize: 12, color: C.green, fontWeight: '700' },
  aiText: { fontSize: 13, color: C.textDark, lineHeight: 20, marginBottom: 12 },
  aiHighlight: { color: C.primary, fontWeight: '700' },
  aiMuhim: { color: C.red, fontWeight: '700' },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tagChip: { backgroundColor: C.blueLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  tagText: { fontSize: 11, color: C.primary, fontWeight: '600' },

  // Params
  paramsCard: { backgroundColor: C.white, borderRadius: 18, padding: 16, marginBottom: 14, elevation: 2 },
  paramsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  paramsTitle: { fontSize: 15, fontWeight: '700', color: C.textDark },
  paramsId: { fontSize: 12, color: C.textGrey },
  paramRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  paramDualRow: { flexDirection: 'row', gap: 16, paddingVertical: 10 },
  paramHalf: { flex: 1 },
  paramIconBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: C.blueLight, alignItems: 'center', justifyContent: 'center' },
  paramLabel: { fontSize: 12, color: C.textGrey, marginBottom: 4 },
  paramValue: { fontSize: 14, fontWeight: '700', color: C.textDark },
  paramMeta: { fontSize: 12, color: C.textGrey },
  divider: { height: 1, backgroundColor: '#F1F5F9' },
  greenBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.greenLight, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginTop: 6, alignSelf: 'flex-start' },
  greenBadgeText: { fontSize: 11, color: C.green, fontWeight: '600' },
  orangeBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.orangeLight, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginTop: 6, alignSelf: 'flex-start' },
  orangeBadgeText: { fontSize: 11, color: C.orange, fontWeight: '600' },
  partiesRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 4 },
  partiesDivider: { width: 1, height: 32, backgroundColor: '#E2E8F0' },
  paymentRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4, flexWrap: 'wrap' },
  paymentAmount: { fontSize: 18, fontWeight: '800', color: C.textDark },
  paymentBadge: { backgroundColor: '#FEF3C7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  paymentBadgeText: { fontSize: 11, color: '#92400E', fontWeight: '600' },

  // Actions
  actionsTitle: { fontSize: 16, fontWeight: '700', color: C.textDark, marginBottom: 10 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
  actionCard: { width: '47%', backgroundColor: C.white, borderRadius: 16, padding: 14, elevation: 2 },
  actionIcon: { fontSize: 24, marginBottom: 8 },
  actionLabel: { fontSize: 13, fontWeight: '700', color: C.textDark },
  actionSub: { fontSize: 11, color: C.textGrey, marginTop: 2 },

  // Delete
  deleteBtn: { flexDirection: 'row', justifyContent: 'center', backgroundColor: C.redLight, borderRadius: 16, padding: 16, alignItems: 'center', marginBottom: 12 },
  deleteBtnText: { fontSize: 15, color: C.red, fontWeight: '700' },
});