import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../components/ScreenContainer';
import BottomNav from '../components/BottomNav';
import { useNavigation } from '@react-navigation/native';

// ─── COLORS ─────────────────────────────────────────────────
const C = {
  primary: '#2563EB',
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
};

// ─── CALENDAR DATA ───────────────────────────────────────────
const now = new Date();
const currentYear = now.getFullYear();
const currentMonthIndex = now.getMonth();
const currentDay = now.getDate();
const MONTH_NAMES = [
  'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
  'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
];
const currentMonthName = MONTH_NAMES[currentMonthIndex];
const todayStr = `${currentDay}-${currentMonthName.toLowerCase()}`;

const getWeekDates = () => {
  const d = new Date();
  const day = d.getDay();
  const diffToMon = (day === 0 ? -6 : 1) - day;
  const monday = new Date(d);
  monday.setDate(d.getDate() + diffToMon);

  const week = [];
  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(monday);
    dayDate.setDate(monday.getDate() + i);
    week.push(dayDate.getDate());
  }
  return week;
};

const WEEK_DAYS = ['Du', 'Se', 'Chor', 'Pay', 'Jum', 'Sha', 'Yak'];
const WEEK_DATES = getWeekDates();

const formatDateStr = (d: Date) => {
  const day = d.getDate();
  const month = MONTH_NAMES[d.getMonth()].toLowerCase();
  const year = d.getFullYear();
  return `${day}-${month}, ${year}`;
};

const addDays = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
};

// ─── REMINDERS ───────────────────────────────────────────────
const REMINDERS = [
  {
    id: '1',
    dateObj: addDays(0),
    urgency: "Bugun! To'lov kuni",
    urgencyColor: C.red,
    urgencyBg: C.redLight,
    icon: 'flash-outline',
    title: "Kommunal to'lovlar eslatmasi",
    amount: "420,000 UZS",
    date: formatDateStr(addDays(0)),
    dateColor: C.red,
    meta: "Elektr energiyasi va gaz • Hisob #9921",
    actions: [
      { label: "To'lash", primary: true, icon: 'card-outline' },
    ],
    expired: false,
    daysLeft: 0,
  },
  {
    id: '2',
    dateObj: addDays(1),
    urgency: 'Ertaga! 1 kun qoldi',
    urgencyColor: C.red,
    urgencyBg: C.redLight,
    icon: 'phone-portrait-outline',
    title: 'Samsung Galaxy S24 Ultra kafolati',
    date: formatDateStr(addDays(1)),
    dateColor: C.red,
    meta: 'Kafolat taloni • Chek #4829',
    actions: [
      { label: 'Servisga murojaat', primary: true, icon: 'build-outline' },
      { label: 'Muddatni uzaytirish', primary: false, icon: 'calendar-outline' },
    ],
    expired: false,
    daysLeft: 1,
  },
  {
    id: '3',
    dateObj: addDays(5),
    urgency: '5 kun qoldi',
    urgencyColor: C.primary,
    urgencyBg: C.blueLight,
    icon: 'card-outline',
    title: "Ijara oylik to'lovi",
    amount: '5,000,000 UZS',
    date: formatDateStr(addDays(5)),
    dateColor: C.textDark,
    meta: "Ogohlantirish: 3 kun oldin",
    metaLabel: 'Eslatma rejimi:',
    actions: [
      { label: "To'lovni amalga oshirish", primary: true, icon: 'card-outline' },
    ],
    expired: false,
    daysLeft: 5,
  },
  {
    id: '4',
    dateObj: addDays(14),
    urgency: '14 kun qoldi',
    urgencyColor: C.orange,
    urgencyBg: C.orangeLight,
    icon: 'car-outline',
    title: "Avtomobil sug'urtasi (KASKO)",
    date: formatDateStr(addDays(14)),
    dateColor: C.textDark,
    meta: "Sug'urta polisi • Seriya #KS-982",
    metaLabel: 'Kategoriya:',
    actions: [
      { label: 'Polisni onlayn yangilash', primary: false, icon: 'refresh-outline' },
    ],
    expired: false,
    daysLeft: 14,
  },
  {
    id: '5',
    dateObj: addDays(25),
    urgency: '25 kun qoldi',
    urgencyColor: C.primary,
    urgencyBg: C.blueLight,
    icon: 'laptop-outline',
    title: "Noutbuk kafolat muddati",
    date: formatDateStr(addDays(25)),
    dateColor: C.textDark,
    meta: "MacBook Pro M3 • Rasmiy kafolat",
    actions: [
      { label: "Diagnostika", primary: false, icon: 'search-outline' },
    ],
    expired: false,
    daysLeft: 25,
  },
  {
    id: '6',
    dateObj: addDays(-2),
    urgency: "Muddati o'tgan (2 kun oldin)",
    urgencyColor: C.red,
    urgencyBg: '#F1F5F9',
    icon: 'construct-outline',
    title: 'Artel bepul servis xizmati',
    date: formatDateStr(addDays(-2)),
    dateColor: C.textGrey,
    metaLabel: 'Tugagan vaqti:',
    holat: "Muddati o'tib ketgan (Arxivlandi)",
    holatColor: C.red,
    actions: [],
    expired: true,
    daysLeft: -2,
  },
  {
    id: '7',
    dateObj: addDays(-7),
    urgency: "Muddati o'tgan (1 hafta oldin)",
    urgencyColor: C.red,
    urgencyBg: '#F1F5F9',
    icon: 'globe-outline',
    title: "Internet provayder abonementi",
    date: formatDateStr(addDays(-7)),
    dateColor: C.textGrey,
    metaLabel: 'Tugagan vaqti:',
    holat: "Yopilgan",
    holatColor: C.red,
    actions: [],
    expired: true,
    daysLeft: -7,
  },
];

// ─── COMPONENT ───────────────────────────────────────────────
export default function RemindersScreen() {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<'list' | 'calendar'>('list');
  const [selectedDate, setSelectedDate] = useState(currentDay);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const soonCount = REMINDERS.filter(r => !r.expired).length;
  const expiredCount = REMINDERS.filter(r => r.expired).length;
  const allCount = REMINDERS.length;

  const filters = [
    { id: 'all', label: 'Barchasi', count: allCount },
    { id: 'soon', label: 'Muddati yaqin', count: soonCount, dot: C.primary },
    { id: 'expired', label: "O'tgan muddat", count: expiredCount, dot: C.red },
  ];

  const filtered = (() => {
    if (selectedFilter === 'expired') {
      return REMINDERS.filter(r => r.expired).sort((a, b) => b.daysLeft - a.daysLeft);
    }
    if (selectedFilter === 'soon') {
      return REMINDERS.filter(r => !r.expired).sort((a, b) => a.daysLeft - b.daysLeft);
    }
    return [...REMINDERS].sort((a, b) => {
      if (!a.expired && b.expired) return -1;
      if (a.expired && !b.expired) return 1;
      if (!a.expired && !b.expired) return a.daysLeft - b.daysLeft;
      return b.daysLeft - a.daysLeft;
    });
  })();

  const renderCard = (r: typeof REMINDERS[0]) => (
    <View key={r.id} style={[styles.remCard, r.expired && styles.remCardExpired]}>
      {/* Urgency banner */}
      <View style={[styles.urgencyBar, { backgroundColor: r.urgencyBg }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <Ionicons
            name={r.expired ? "alert-circle" : "time-outline"}
            size={14}
            color={r.urgencyColor}
          />
          <Text style={[styles.urgencyText, { color: r.urgencyColor }]}>
            {r.urgency}
          </Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={16} color={C.textGrey} />
        </TouchableOpacity>
      </View>

      <View style={styles.remBody}>
        <View style={[styles.remIconBox, { backgroundColor: r.urgencyBg }]}>
          <Ionicons name={r.icon as any} size={22} color={r.urgencyColor} />
        </View>
        <View style={styles.remInfo}>
          <View style={styles.remTitleRow}>
            <Text style={styles.remTitle}>{r.title}</Text>
            {r.amount && <Text style={styles.remAmount}>{r.amount}</Text>}
          </View>
          {r.metaLabel && (
            <Text style={styles.remMetaLabel}>
              {r.metaLabel}{' '}
              <Text style={[styles.remDate, { color: r.dateColor }]}>{r.date}</Text>
            </Text>
          )}
          {!r.metaLabel && (
            <Text style={[styles.remDate, { color: r.dateColor }]}>Muddat sanasi: {r.date}</Text>
          )}
          {r.meta && (
            <Text style={styles.remMeta}>{r.meta}</Text>
          )}
          {r.holat && (
            <Text style={[styles.remHolat, { color: r.holatColor }]}>Holati: {r.holat}</Text>
          )}
        </View>
      </View>

      {/* Action buttons */}
      {r.actions.length > 0 && (
        <View style={styles.actionRow}>
          {r.actions.map((a, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.actionBtn, a.primary ? styles.actionBtnPrimary : styles.actionBtnSecondary]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons
                  name={a.icon as any}
                  size={15}
                  color={a.primary ? C.white : C.textDark}
                />
                <Text style={a.primary ? styles.actionBtnPrimaryText : styles.actionBtnSecondaryText}>
                  {a.label}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <ScreenContainer style={styles.safe}>
      <StatusBar barStyle="dark-content" />

      {/* ── TITLE ── */}
      <View style={styles.titleRow}>
        <Text style={styles.pageTitle}>Eslatmalar va Muddatlar</Text>
        <TouchableOpacity style={styles.newBtn} onPress={() => Alert.alert('Yangi eslatma', "Yangi eslatma qo'shish oynasi")}>
          <Ionicons name="add" size={16} color={C.white} style={{ marginRight: 4 }} />
          <Text style={styles.newBtnText}>Yangi eslatma</Text>
        </TouchableOpacity>
      </View>

      {/* ── TABS ── */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'list' && styles.tabActive]}
          onPress={() => setActiveTab('list')}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Ionicons
              name="list"
              size={15}
              color={activeTab === 'list' ? C.white : C.textGrey}
            />
            <Text style={[styles.tabText, activeTab === 'list' && styles.tabTextActive]}>
              Ro'yxat
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'calendar' && styles.tabActive]}
          onPress={() => setActiveTab('calendar')}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Ionicons
              name="calendar-outline"
              size={15}
              color={activeTab === 'calendar' ? C.white : C.textGrey}
            />
            <Text style={[styles.tabText, activeTab === 'calendar' && styles.tabTextActive]}>
              Taqvim ({todayStr})
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {activeTab === 'calendar' ? (
          <View>
            {/* ── CALENDAR VIEW ── */}
            <View style={styles.calendarCard}>
              <View style={styles.calendarHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Ionicons name="calendar" size={16} color={C.primary} />
                  <Text style={styles.calMonth}>{currentMonthName}, {currentYear}</Text>
                </View>
                <Text style={styles.calToday}>Bugun: {todayStr}</Text>
              </View>
              <View style={styles.calWeek}>
                {WEEK_DAYS.map((day, i) => {
                  const dateNum = WEEK_DATES[i];
                  const isSelected = selectedDate === dateNum;
                  const hasEvent = REMINDERS.some(r => r.dateObj.getDate() === dateNum);
                  return (
                    <TouchableOpacity
                      key={i}
                      style={[styles.calDayCol, isSelected && styles.calDayColActive]}
                      onPress={() => setSelectedDate(dateNum)}
                    >
                      <Text style={[styles.calDayName, isSelected && styles.calDayNameActive]}>{day}</Text>
                      <Text style={[styles.calDayNum, isSelected && styles.calDayNumActive]}>
                        {dateNum}
                      </Text>
                      {hasEvent && (
                        <View style={[styles.calDot, isSelected && { backgroundColor: C.white }]} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Selected day header */}
            {(() => {
              const dayEvents = REMINDERS.filter(r => r.dateObj.getDate() === selectedDate);
              return (
                <View>
                  <View style={styles.calSelectedHeader}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Ionicons name="calendar-outline" size={15} color={C.textDark} />
                      <Text style={styles.calSelectedTitle}>{selectedDate}-{currentMonthName.toLowerCase()} eslatmalari</Text>
                    </View>
                    <View style={styles.calSelectedBadge}>
                      <Text style={styles.calSelectedCount}>{dayEvents.length} ta</Text>
                    </View>
                  </View>

                  {dayEvents.length > 0 ? (
                    dayEvents.map(renderCard)
                  ) : (
                    <View style={styles.emptyCard}>
                      <Ionicons name="calendar-outline" size={36} color={C.textGrey} style={{ marginBottom: 8 }} />
                      <Text style={styles.emptyTitle}>Ushbu kunga eslatma yo'q</Text>
                      <Text style={styles.emptySub}>
                        Yangi eslatma qo'shish uchun yuqoridagi «Yangi eslatma» tugmasini bosing
                      </Text>
                    </View>
                  )}
                </View>
              );
            })()}
          </View>
        ) : (
          <View>
            {/* ── LIST VIEW ── */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
              {filters.map(f => (
                <TouchableOpacity
                  key={f.id}
                  style={[styles.filterChip, selectedFilter === f.id && styles.filterChipActive]}
                  onPress={() => setSelectedFilter(f.id)}
                >
                  {f.dot && <View style={[styles.filterDot, { backgroundColor: f.dot }]} />}
                  <Text style={[styles.filterText, selectedFilter === f.id && styles.filterTextActive]}>
                    {f.label} ({f.count})
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* All reminder cards */}
            {filtered.map(renderCard)}
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* ── BOTTOM NAV ── */}
      <BottomNav activeScreen="Reminders" />
    </ScreenContainer>
  );
}

// ─── STYLES ──────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 14, paddingTop: 8 },

  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginTop: 14,
    marginBottom: 14,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: C.textDark,
    flex: 1,
    marginRight: 8,
  },
  newBtn: { backgroundColor: C.primary, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20 },
  newBtnText: { fontSize: 12, color: C.white, fontWeight: '700' },

  // Tabs
  tabRow: { flexDirection: 'row', marginHorizontal: 14, backgroundColor: C.white, borderRadius: 12, padding: 4, marginBottom: 14, elevation: 1 },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: 'center' },
  tabActive: { backgroundColor: C.primary },
  tabText: { fontSize: 13, color: C.textGrey, fontWeight: '500' },
  tabTextActive: { color: C.white, fontWeight: '700' },

  // Calendar
  calendarCard: { backgroundColor: C.white, borderRadius: 16, padding: 14, marginBottom: 12, elevation: 1 },
  calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  calMonth: { fontSize: 15, fontWeight: '700', color: C.textDark },
  calToday: { fontSize: 12, color: C.primary, fontWeight: '600' },
  calWeek: { flexDirection: 'row', justifyContent: 'space-between' },
  calDayCol: { alignItems: 'center', flex: 1, paddingVertical: 6, borderRadius: 10 },
  calDayColActive: { backgroundColor: C.primary },
  calDayName: { fontSize: 11, color: C.textGrey, marginBottom: 4 },
  calDayNameActive: { color: C.white },
  calDayNum: { fontSize: 15, fontWeight: '700', color: C.textDark },
  calDayNumActive: { color: C.white },
  calDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: C.red, marginTop: 3 },

  // Filters
  filterScroll: { marginBottom: 12 },
  filterChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: C.white, marginRight: 8, elevation: 1, gap: 5 },
  filterChipActive: { backgroundColor: C.primary },
  filterDot: { width: 7, height: 7, borderRadius: 4 },
  filterText: { fontSize: 13, color: C.textDark, fontWeight: '500' },
  filterTextActive: { color: C.white },

  // Reminder cards
  remCard: { backgroundColor: C.white, borderRadius: 16, marginBottom: 10, overflow: 'hidden', elevation: 2 },
  remCardExpired: { opacity: 0.75 },
  urgencyBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8 },
  urgencyText: { fontSize: 12, fontWeight: '700' },
  moreIcon: { fontSize: 18, color: C.textGrey },
  remBody: { flexDirection: 'row', padding: 12, gap: 12, alignItems: 'flex-start' },
  remIconBox: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  remIcon: { fontSize: 22 },
  remInfo: { flex: 1 },
  remTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  remTitle: { fontSize: 14, fontWeight: '700', color: C.textDark, flex: 1 },
  remAmount: { fontSize: 16, fontWeight: '800', color: C.primary, marginLeft: 8 },
  remDate: { fontSize: 13, fontWeight: '600', marginBottom: 4 },
  remMetaLabel: { fontSize: 12, color: C.textGrey, marginBottom: 4 },
  remMeta: { fontSize: 12, color: C.textGrey },
  remHolat: { fontSize: 12, fontWeight: '600', marginTop: 4 },
  actionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, padding: 12, paddingTop: 0 },
  actionBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  actionBtnPrimary: { backgroundColor: C.primary },
  actionBtnSecondary: { backgroundColor: C.bg, borderWidth: 1, borderColor: '#E2E8F0' },
  actionBtnPrimaryText: { fontSize: 13, color: C.white, fontWeight: '700' },
  actionBtnSecondaryText: { fontSize: 13, color: C.textDark, fontWeight: '600' },

  // Selected calendar day header
  calSelectedHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10, paddingHorizontal: 2 },
  calSelectedTitle: { fontSize: 14, fontWeight: '700', color: C.textDark },
  calSelectedBadge: { backgroundColor: C.blueLight, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  calSelectedCount: { fontSize: 11, color: C.primary, fontWeight: '700' },
  emptyCard: { backgroundColor: C.white, borderRadius: 16, padding: 24, alignItems: 'center', marginVertical: 8, elevation: 1 },
  emptyTitle: { fontSize: 14, fontWeight: '700', color: C.textDark, textAlign: 'center' },
  emptySub: { fontSize: 12, color: C.textGrey, textAlign: 'center', marginTop: 4 },
});