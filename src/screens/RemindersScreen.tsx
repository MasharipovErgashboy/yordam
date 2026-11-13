import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Alert, Modal, TextInput, KeyboardAvoidingView, Platform,
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

export type ReminderAction = {
  label: string;
  primary: boolean;
  icon: string;
};

export type ReminderItem = {
  id: string;
  dateObj: Date;
  urgency: string;
  urgencyColor: string;
  urgencyBg: string;
  icon: string;
  title: string;
  amount?: string;
  date: string;
  dateColor: string;
  meta?: string;
  metaLabel?: string;
  holat?: string;
  holatColor?: string;
  actions: ReminderAction[];
  expired: boolean;
  daysLeft: number;
};

// ─── REMINDERS ───────────────────────────────────────────────
const REMINDERS: ReminderItem[] = [
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
  const [reminders, setReminders] = useState<ReminderItem[]>(REMINDERS);
  const [activeTab, setActiveTab] = useState<'list' | 'calendar'>('list');
  const [selectedDate, setSelectedDate] = useState(currentDay);
  const [selectedFilter, setSelectedFilter] = useState('all');

  // New reminder modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState<'pay' | 'warranty' | 'insurance' | 'contract'>('pay');
  const [newDays, setNewDays] = useState(3);

  const handleAddReminder = () => {
    if (!newTitle.trim()) {
      Alert.alert('Xatolik', 'Iltimos, eslatma nomini kiriting.');
      return;
    }

    const d = addDays(newDays);
    const catMap = {
      pay: { icon: 'flash-outline', meta: "To'lov eslatmasi", urgencyBg: newDays <= 1 ? C.redLight : C.blueLight, urgencyColor: newDays <= 1 ? C.red : C.primary },
      warranty: { icon: 'phone-portrait-outline', meta: 'Kafolat taloni monitoringi', urgencyBg: C.blueLight, urgencyColor: C.primary },
      insurance: { icon: 'car-outline', meta: "Sug'urta polisi", urgencyBg: C.orangeLight, urgencyColor: C.orange },
      contract: { icon: 'document-text-outline', meta: 'Rasmiy shartnoma muddati', urgencyBg: C.blueLight, urgencyColor: C.primary },
    }[newCategory];

    const urgencyText = newDays === 0
      ? "Bugun! To'lov kuni"
      : newDays === 1
      ? 'Ertaga! 1 kun qoldi'
      : `${newDays} kun qoldi`;

    const newRem = {
      id: Date.now().toString(),
      dateObj: d,
      urgency: urgencyText,
      urgencyColor: catMap.urgencyColor,
      urgencyBg: catMap.urgencyBg,
      icon: catMap.icon,
      title: newTitle.trim(),
      amount: newAmount.trim() ? newAmount.trim() : undefined,
      date: formatDateStr(d),
      dateColor: newDays <= 1 ? C.red : C.textDark,
      meta: catMap.meta,
      actions: [
        { label: "Bajarildi", primary: true, icon: 'checkmark-circle-outline' },
      ],
      expired: false,
      daysLeft: newDays,
    };

    setReminders(prev => [newRem, ...prev]);
    setNewTitle('');
    setNewAmount('');
    setModalVisible(false);
    Alert.alert('Muvaffaqiyatli', "Yangi eslatma ro'yxatga qo'shildi!");
  };

  const soonCount = reminders.filter(r => !r.expired).length;
  const expiredCount = reminders.filter(r => r.expired).length;
  const allCount = reminders.length;

  const filters = [
    { id: 'all', label: 'Barchasi', count: allCount },
    { id: 'soon', label: 'Muddati yaqin', count: soonCount, dot: C.primary },
    { id: 'expired', label: "O'tgan muddat", count: expiredCount, dot: C.red },
  ];

  const filtered = (() => {
    if (selectedFilter === 'expired') {
      return reminders.filter(r => r.expired).sort((a, b) => b.daysLeft - a.daysLeft);
    }
    if (selectedFilter === 'soon') {
      return reminders.filter(r => !r.expired).sort((a, b) => a.daysLeft - b.daysLeft);
    }
    return [...reminders].sort((a, b) => {
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

      {/* ── TOP CONTROLS (BACK + TABS + QUICK ADD) ── */}
      <View style={styles.topControlRow}>
        <TouchableOpacity
          onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Home')}
          style={styles.backBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={24} color={C.textDark} />
        </TouchableOpacity>

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
                Taqvim
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Sleek top-right add button */}
        <TouchableOpacity
          style={styles.topAddBtn}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={20} color={C.white} />
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
                  const hasEvent = reminders.some(r => r.dateObj.getDate() === dateNum);
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
              const dayEvents = reminders.filter(r => r.dateObj.getDate() === selectedDate);
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
                        Yangi eslatma qo'shish uchun «+» tugmasini bosing
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

      {/* ── ADD REMINDER MODAL ── */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <TouchableOpacity
            style={styles.modalDismiss}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={styles.modalIconBox}>
                  <Ionicons name="notifications-outline" size={20} color={C.primary} />
                </View>
                <Text style={styles.modalTitle}>Yangi eslatma yaratish</Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCloseBtn}>
                <Ionicons name="close" size={20} color={C.textGrey} />
              </TouchableOpacity>
            </View>

            {/* Input title */}
            <Text style={styles.inputLabel}>Eslatma nomi</Text>
            <View style={styles.inputBox}>
              <Ionicons name="create-outline" size={18} color={C.textGrey} style={{ marginRight: 8 }} />
              <TextInput
                style={styles.textInput}
                placeholder="Masalan: Gaz to'lovi, Sug'urta..."
                placeholderTextColor={C.textGrey}
                value={newTitle}
                onChangeText={setNewTitle}
              />
            </View>

            {/* Input amount (optional) */}
            <Text style={styles.inputLabel}>To'lov summasi (ixtiyoriy)</Text>
            <View style={styles.inputBox}>
              <Ionicons name="card-outline" size={18} color={C.textGrey} style={{ marginRight: 8 }} />
              <TextInput
                style={styles.textInput}
                placeholder="Masalan: 350,000 UZS"
                placeholderTextColor={C.textGrey}
                value={newAmount}
                onChangeText={setNewAmount}
              />
            </View>

            {/* Category selection */}
            <Text style={styles.inputLabel}>Kategoriya turi</Text>
            <View style={styles.categoryRow}>
              {[
                { id: 'pay', label: "To'lov", icon: 'flash-outline' },
                { id: 'warranty', label: 'Kafolat', icon: 'phone-portrait-outline' },
                { id: 'insurance', label: "Sug'urta", icon: 'car-outline' },
                { id: 'contract', label: 'Shartnoma', icon: 'document-text-outline' },
              ].map(cat => (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.categoryChip, newCategory === cat.id && styles.categoryChipActive]}
                  onPress={() => setNewCategory(cat.id as any)}
                >
                  <Ionicons
                    name={cat.icon as any}
                    size={14}
                    color={newCategory === cat.id ? C.white : C.primary}
                    style={{ marginRight: 4 }}
                  />
                  <Text style={[styles.categoryChipText, newCategory === cat.id && styles.categoryChipTextActive]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Muddat selection */}
            <Text style={styles.inputLabel}>Muddat qachon?</Text>
            <View style={styles.daysRow}>
              {[
                { days: 0, label: 'Bugun' },
                { days: 1, label: 'Ertaga' },
                { days: 3, label: '3 kun' },
                { days: 7, label: '1 hafta' },
                { days: 14, label: '2 hafta' },
                { days: 30, label: '1 oy' },
              ].map(d => (
                <TouchableOpacity
                  key={d.days}
                  style={[styles.daysChip, newDays === d.days && styles.daysChipActive]}
                  onPress={() => setNewDays(d.days)}
                >
                  <Text style={[styles.daysChipText, newDays === d.days && styles.daysChipTextActive]}>
                    {d.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Action button */}
            <TouchableOpacity style={styles.submitBtn} onPress={handleAddReminder}>
              <Ionicons name="checkmark-circle" size={18} color={C.white} style={{ marginRight: 6 }} />
              <Text style={styles.submitBtnText}>Eslatmani saqlash</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ── BOTTOM NAV ── */}
      <BottomNav activeScreen="Reminders" />
    </ScreenContainer>
  );
}

// ─── STYLES ──────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 14, paddingTop: 4 },

  // Top controls
  topControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginTop: 12,
    marginBottom: 10,
    gap: 8,
  },
  backBtn: {
    padding: 4,
    marginRight: 2,
  },
  tabRow: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: C.white,
    borderRadius: 12,
    padding: 4,
    elevation: 1,
  },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: 'center' },
  tabActive: { backgroundColor: C.primary },
  tabText: { fontSize: 13, color: C.textGrey, fontWeight: '500' },
  tabTextActive: { color: C.white, fontWeight: '700' },

  topAddBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'flex-end',
  },
  modalDismiss: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: C.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: C.blueLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: C.textDark,
  },
  modalCloseBtn: {
    padding: 4,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: C.textDark,
    marginTop: 10,
    marginBottom: 6,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: C.textDark,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  categoryChipActive: {
    backgroundColor: C.primary,
  },
  categoryChipText: {
    fontSize: 12,
    color: C.textDark,
    fontWeight: '600',
  },
  categoryChipTextActive: {
    color: C.white,
  },
  daysRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  daysChip: {
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  daysChipActive: {
    backgroundColor: C.primary,
  },
  daysChipText: {
    fontSize: 12,
    color: C.textDark,
    fontWeight: '600',
  },
  daysChipTextActive: {
    color: C.white,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.primary,
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 20,
    elevation: 3,
  },
  submitBtnText: {
    color: C.white,
    fontSize: 15,
    fontWeight: '700',
  },

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