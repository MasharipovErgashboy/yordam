import { useId, useState } from 'react'
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { router, useLocalSearchParams } from '../navigation/router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { BriefcaseBusiness, Check, FileCheck2, LockKeyhole, MessageCircle, ShieldCheck, Video } from 'lucide-react-native'

import { Avatar, Card, Header, Page, Pill, Rating, ActionButton } from '../components/native-ui'
import { consultationTimes, formatMoney } from '../constants/demo-data'
import { colors, fonts } from '../constants/tokens'
import { useAppStore } from '../hooks/use-app-store'
import type { ConsultationKind } from '../types/models'
import { findLawyer } from '../utils/helpers'

const kinds: { label: ConsultationKind; price: number; detail: string; icon: typeof Video }[] = [
  { label: 'Video konsultatsiya', price: 200000, detail: 'Jonli savol-javob, 45 daqiqa · HD aloqa', icon: Video },
  { label: 'Matnli chat', price: 120000, detail: 'Hujjat yuborish mumkin, 24 soat', icon: MessageCircle },
  { label: 'Hujjat ekspertizasi', price: 250000, detail: 'Yozma xulosa, 24 soat ichida', icon: FileCheck2 },
]
const days = [{ label: 'BUGUN', date: '14', month: 'Noy' }, { label: 'ERTAGA', date: '15', month: 'Noy' }, { label: 'SHANBA', date: '16', month: 'Noy' }]
const unavailableTimes = ['14:00', '18:30']

export default function LawyerProfileScreen() {
  const insets = useSafeAreaInsets()
  const { id } = useLocalSearchParams<{ id: string }>()
  const bookingId = useId()
  const lawyer = findLawyer(id)
  const [tab, setTab] = useState<'experience' | 'specialties'>('experience')
  const [kind, setKind] = useState<ConsultationKind>('Video konsultatsiya')
  const [day, setDay] = useState(0)
  const [time, setTime] = useState('15:30')
  const [description, setDescription] = useState('')
  const { addRequest, requests } = useAppStore()

  const selectedKind = kinds.find((item) => item.label === kind) ?? kinds[0]

  if (!lawyer) return <View style={styles.screen}><Header title="Yurist profili" onBack={() => router.back()} /><View style={styles.notFound}><Text style={styles.notFoundTitle}>Yurist topilmadi</Text><ActionButton title="Orqaga" onPress={() => router.back()} /></View></View>

  function submitBooking() {
    if (kind === 'Hujjat ekspertizasi') {
      router.push({ pathname: '/document', params: { lawyerId: lawyer?.id ?? '' } })
      return
    }
    if (!lawyer) return
    const requestId = `DEMO-${bookingId.replace(/[^a-z0-9]/gi, '').slice(-5).toUpperCase()}-${requests.length + 1}`
    addRequest({ id: requestId, status: 'Kutilayotgan', kind, lawyerId: lawyer.id, lawyerName: lawyer.name, lawyerTitle: lawyer.title, subject: description.trim() || 'Huquqiy masala bo‘yicha maslahat', price: selectedKind.price, date: `${day === 0 ? 'Bugun' : days[day].date + '-noyabr'}, ${time}`, duration: kind === 'Video konsultatsiya' ? '45 daqiqa' : '24 soat' })
    Alert.alert('Demo bron tayyor', `${lawyer.name} bilan ${time} dagi maslahat Murojaatlarimga qo‘shildi. Haqiqiy bron yoki to‘lov bajarilmadi.`, [{ text: 'Murojaatlarim', onPress: () => router.replace('/(tabs)/requests') }])
  }

  return <View style={styles.screen}>
    <Header title="Yurist profili" onBack={() => router.back()} />
    <Page contentStyle={{ paddingBottom: 92 }}>
      <View style={styles.profileHero}><Avatar initials={lawyer.initials} color={lawyer.avatarColor} size={61} /><View style={styles.profileDetails}><View style={styles.verified}><ShieldCheck size={10} color="#9A6717" /><Text style={styles.verifiedText}>DEMO · Advokatlar palatasi</Text></View><Text style={styles.name}>{lawyer.name}</Text><Text style={styles.license}>Litsenziya: {lawyer.license} · namuna</Text><View style={styles.ratingLine}><Rating value={lawyer.rating} count={lawyer.reviews} /><Text style={styles.online}>{lawyer.online ? '● Onlayn' : '● Javob beradi'}</Text></View></View></View>
      <Card style={styles.stats}><View style={styles.metric}><Text style={styles.metricValue}>1,240+</Text><Text style={styles.metricLabel}>Yutilgan ish*</Text></View><View style={styles.metric}><Text style={styles.metricValue}>{lawyer.experience} yil</Text><Text style={styles.metricLabel}>Amaliy staj*</Text></View><View style={[styles.metric, { borderRightWidth: 0 }]}><Text style={[styles.metricValue, { color: colors.secondary }]}>100%</Text><Text style={styles.metricLabel}>Maxfiylik*</Text></View></Card>
      <Card style={styles.infoCard}><View style={styles.tabs}><Pressable onPress={() => setTab('experience')} style={[styles.tab, tab === 'experience' && styles.tabActive]}><Text style={[styles.tabText, tab === 'experience' && styles.tabTextActive]}>Ma’lumot va tajriba</Text></Pressable><Pressable onPress={() => setTab('specialties')} style={[styles.tab, tab === 'specialties' && styles.tabActive]}><Text style={[styles.tabText, tab === 'specialties' && styles.tabTextActive]}>Mutaxassisliklar</Text></Pressable></View>{tab === 'experience' ? <View style={styles.experienceRow}><BriefcaseBusiness size={17} color={colors.primary} /><View style={{ flex: 1 }}><Text style={styles.experienceTitle}>Toshkent davlat yuridik universiteti</Text><Text style={styles.experienceText}>Magistr darajasi · Fuqarolik va oila huquqi</Text><Text style={[styles.experienceTitle, { marginTop: 8 }]}>“Lex Consulting” advokatlik byurosi</Text><Text style={styles.experienceText}>Yetakchi mutaxassis · Ma’lumotlar demo uchun</Text></View></View> : <View style={styles.specialties}>{[lawyer.category, 'Shartnomalar', 'Meros masalalari', 'Maslahat va tahlil'].map((item) => <Pill key={item} label={item} />)}</View>}</Card>

      <View style={styles.stepTitle}><View style={styles.stepCircle}><Text style={styles.stepNumber}>1</Text></View><Text style={styles.stepHeading}>Maslahat formatini tanlang</Text></View>
      <View style={styles.kindList}>{kinds.map((item) => { const Icon = item.icon; const selected = kind === item.label; return <Pressable key={item.label} onPress={() => setKind(item.label)} style={[styles.kindCard, selected && styles.kindSelected]}><View style={[styles.kindIcon, selected && styles.kindIconSelected]}><Icon size={16} color={selected ? '#fff' : colors.primary} /></View><View style={styles.kindCopy}><Text style={styles.kindName}>{item.label}{item.label === kinds[0].label ? <Text style={styles.recommended}>  TAVSIYA</Text> : null}</Text><Text style={styles.kindDetail}>{item.detail}</Text></View><Text style={styles.kindPrice}>{formatMoney(item.price)}</Text>{selected ? <View style={styles.selectedCheck}><Check size={10} color="#fff" /></View> : null}</Pressable> })}</View>

      <View style={styles.stepTitle}><View style={styles.stepCircle}><Text style={styles.stepNumber}>2</Text></View><Text style={styles.stepHeading}>Qabul vaqtini tanlang</Text><Text style={styles.timezone}>Toshkent vaqti (GMT+5)</Text></View>
      <Card style={styles.scheduleCard}><View style={styles.days}>{days.map((item, index) => <Pressable key={item.date} onPress={() => setDay(index)} style={[styles.dayCard, day === index && styles.daySelected]}><Text style={[styles.dayLabel, day === index && styles.dayTextSelected]}>{item.label}</Text><Text style={[styles.dayDate, day === index && styles.dayTextSelected]}>{item.date} <Text style={styles.month}>{item.month}</Text></Text></Pressable>)}</View><Text style={styles.slotLabel}>Bo‘sh vaqt oralig‘i:</Text><View style={styles.slots}>{consultationTimes.map((item) => { const unavailable = unavailableTimes.includes(item); return <Pressable key={item} disabled={unavailable} onPress={() => setTime(item)} style={[styles.slot, time === item && styles.slotSelected, unavailable && styles.slotUnavailable]}><Text style={[styles.slotText, time === item && styles.slotTextSelected, unavailable && styles.slotUnavailableText]}>{item}</Text></Pressable> })}</View></Card>

      <View style={styles.stepTitle}><View style={styles.stepCircle}><Text style={styles.stepNumber}>3</Text></View><Text style={styles.stepHeading}>Muammoni qisqacha bayon eting</Text><View style={styles.privateTag}><LockKeyhole size={9} color="#8A641D" /><Text style={styles.privateText}>Maxfiy</Text></View></View>
      <Card style={styles.descriptionCard}><TextInput multiline maxLength={500} value={description} onChangeText={setDescription} placeholder="Vaziyatingiz haqida asosiy ma’lumotlarni yozing..." placeholderTextColor="#95A2B0" style={styles.descriptionInput} textAlignVertical="top" /><Text style={styles.counter}>{description.length}/500</Text></Card>
      <Text style={styles.demoDisclaimer}>* Tajriba, natija va maxfiylik haqidagi ko‘rsatkichlar namuna ma’lumotlaridir.</Text>
    </Page>
    <View style={[styles.bookingBar, { paddingBottom: Math.max(insets.bottom, 16) + 8 }]}><View><Text style={styles.totalLabel}>JAMI TO‘LOV · DEMO</Text><Text style={styles.totalPrice}>{formatMoney(selectedKind.price)}</Text><Text style={styles.totalDetails}>{day === 0 ? 'Bugun' : `${days[day].date}-noyabr`} · {time}</Text></View><Pressable onPress={submitBooking} style={styles.bookingButton}><LockKeyhole size={13} color="#fff" /><Text style={styles.bookingButtonText}>{kind === 'Hujjat ekspertizasi' ? 'Davom etish' : 'Band qilish'}</Text></Pressable></View>
  </View>
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  profileHero: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 3 },
  profileDetails: { flex: 1, minWidth: 0, gap: 3 },
  verified: { flexDirection: 'row', alignItems: 'center', gap: 3, alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 5, backgroundColor: colors.secondaryLight },
  verifiedText: { color: '#805D1C', fontFamily: fonts.semibold, fontSize: 6 },
  name: { color: colors.neutral, fontFamily: fonts.headingExtra, fontSize: 14 },
  license: { color: colors.muted, fontFamily: fonts.body, fontSize: 7 },
  ratingLine: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  online: { color: colors.tertiary, fontFamily: fonts.medium, fontSize: 7 },
  stats: { flexDirection: 'row', paddingVertical: 4, paddingHorizontal: 0 },
  metric: { flex: 1, alignItems: 'center', borderRightWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  metricValue: { color: colors.primary, fontFamily: fonts.heading, fontSize: 12 },
  metricLabel: { color: colors.muted, fontFamily: fonts.body, fontSize: 7, marginTop: 3 },
  infoCard: { padding: 8 },
  tabs: { flexDirection: 'row', padding: 3, borderRadius: 8, backgroundColor: '#F1F4F7' },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 26, borderRadius: 6 },
  tabActive: { backgroundColor: colors.primary },
  tabText: { color: '#65768A', fontFamily: fonts.medium, fontSize: 7 },
  tabTextActive: { color: '#fff' },
  experienceRow: { flexDirection: 'row', gap: 8, padding: 8 },
  experienceTitle: { color: '#354B61', fontFamily: fonts.semibold, fontSize: 8 },
  experienceText: { color: colors.muted, fontFamily: fonts.body, fontSize: 7, lineHeight: 11, marginTop: 3 },
  specialties: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, padding: 8 },
  stepTitle: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 },
  stepCircle: { width: 18, height: 18, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#E4F0FB' },
  stepNumber: { color: colors.primary, fontFamily: fonts.bold, fontSize: 8 },
  stepHeading: { color: colors.text, fontFamily: fonts.heading, fontSize: 10, flex: 1 },
  timezone: { color: colors.primary, fontFamily: fonts.semibold, fontSize: 6, textAlign: 'right' },
  kindList: { gap: 6 },
  kindCard: { position: 'relative', flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 54, padding: 8, borderRadius: 10, borderWidth: 1, borderColor: colors.line, backgroundColor: '#fff' },
  kindSelected: { borderColor: '#9CC1DF', backgroundColor: '#F1F8FD' },
  kindIcon: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: '#E8F1F8' },
  kindIconSelected: { backgroundColor: colors.primary },
  kindCopy: { flex: 1, gap: 3 },
  kindName: { color: colors.text, fontFamily: fonts.semibold, fontSize: 8 },
  recommended: { color: '#9A681A', fontFamily: fonts.bold, fontSize: 6 },
  kindDetail: { color: colors.muted, fontFamily: fonts.body, fontSize: 6 },
  kindPrice: { color: colors.primary, fontFamily: fonts.heading, fontSize: 8 },
  selectedCheck: { position: 'absolute', right: 5, bottom: 4, width: 13, height: 13, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary },
  scheduleCard: { padding: 9, gap: 8 },
  days: { flexDirection: 'row', gap: 6 },
  dayCard: { flex: 1, minHeight: 38, justifyContent: 'center', paddingHorizontal: 7, borderRadius: 8, borderWidth: 1, borderColor: colors.line, backgroundColor: '#FAFBFD' },
  daySelected: { borderColor: colors.primary, backgroundColor: colors.primary },
  dayLabel: { color: colors.muted, fontFamily: fonts.semibold, fontSize: 6 },
  dayDate: { color: colors.text, fontFamily: fonts.heading, fontSize: 9, marginTop: 2 },
  dayTextSelected: { color: '#fff' },
  month: { fontFamily: fonts.body, fontSize: 7 },
  slotLabel: { color: colors.muted, fontFamily: fonts.body, fontSize: 7 },
  slots: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  slot: { width: '31.7%', minHeight: 29, borderRadius: 7, alignItems: 'center', justifyContent: 'center', backgroundColor: '#EEF4FA' },
  slotSelected: { backgroundColor: colors.primary },
  slotUnavailable: { backgroundColor: '#F3F4F5' },
  slotText: { color: '#36536E', fontFamily: fonts.medium, fontSize: 8 },
  slotTextSelected: { color: '#fff' },
  slotUnavailableText: { color: '#ABB5BF' },
  privateTag: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 5, paddingVertical: 3, borderRadius: 99, backgroundColor: colors.secondaryLight },
  privateText: { color: '#8A641D', fontFamily: fonts.semibold, fontSize: 6 },
  descriptionCard: { padding: 8, minHeight: 84 },
  descriptionInput: { minHeight: 56, color: colors.text, fontFamily: fonts.body, fontSize: 8, lineHeight: 13, padding: 0 },
  counter: { alignSelf: 'flex-end', color: colors.muted, fontFamily: fonts.body, fontSize: 6 },
  demoDisclaimer: { color: colors.muted, fontFamily: fonts.body, fontSize: 7, lineHeight: 11, paddingHorizontal: 2 },
  bookingBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, paddingHorizontal: 16, paddingTop: 9, paddingBottom: 11, borderTopWidth: 1, borderColor: colors.line, backgroundColor: '#fff' },
  totalLabel: { color: '#8B98A5', fontFamily: fonts.semibold, fontSize: 6 },
  totalPrice: { color: colors.primary, fontFamily: fonts.headingExtra, fontSize: 14, marginTop: 2 },
  totalDetails: { color: '#9A752F', fontFamily: fonts.medium, fontSize: 6, marginTop: 2 },
  bookingButton: { minWidth: 128, height: 38, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 9, backgroundColor: colors.secondary },
  bookingButtonText: { color: '#fff', fontFamily: fonts.bold, fontSize: 9 },
  notFound: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 15 },
  notFoundTitle: { color: colors.text, fontFamily: fonts.heading, fontSize: 16 },
})
