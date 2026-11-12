import { useMemo, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { router } from 'expo-router'
import { Check, ChevronRight, CircleCheck, Clock3, Download, FileCheck2, FileText, Headphones, MessageCircle, Search, ShieldCheck, Star, Video } from 'lucide-react-native'

import { Avatar, Card, Header, Page, Pill, SearchField, SectionTitle, ActionButton, Rating } from '@/components/native-ui'
import { useAppStore } from '@/hooks/use-app-store'
import { colors, fonts } from '@/constants/tokens'
import { formatMoney } from '@/constants/demo-data'
import type { LegalRequest, RequestStatus } from '@/types/models'

const statuses: (RequestStatus | 'Barchasi')[] = ['Barchasi', 'Kutilayotgan', 'Ko‘rib chiqilmoqda', 'Yakunlangan']
const kinds = ['Barchasi', 'Video konsultatsiya', 'Hujjat ekspertizasi', 'Matnli chat']

export default function RequestsScreen() {
  const [status, setStatus] = useState<RequestStatus | 'Barchasi'>('Barchasi')
  const [kind, setKind] = useState('Barchasi')
  const [query, setQuery] = useState('')
  const { requests } = useAppStore()
  const pendingCount = requests.filter((request) => request.status === 'Kutilayotgan').length
  const reviewCount = requests.filter((request) => request.status === 'Ko‘rib chiqilmoqda').length
  const completedCount = requests.filter((request) => request.status === 'Yakunlangan').length

  const filtered = useMemo(
    () => requests.filter((request) => {
      const searchTerm = query.trim().toLocaleLowerCase('uz')
      const matchesStatus = status === 'Barchasi' || request.status === status
      const matchesKind = kind === 'Barchasi' || request.kind === kind
      const searchable = `${request.lawyerName} ${request.subject} ${request.kind}`.toLocaleLowerCase('uz')
      return matchesStatus && matchesKind && (!searchTerm || searchable.includes(searchTerm))
    }),
    [kind, query, requests, status],
  )

  function openRoom(request: LegalRequest) {
    router.push({ pathname: '/consultation/[id]', params: { id: request.id } })
  }

  return <View style={styles.screen}><Header title="Mening murojaatlarim" subtitle="Konsultatsiya va hujjatlaringiz" onProfile={() => router.push('/(tabs)/profile')} /><Page>
    <View style={styles.stats}>{[[`${pendingCount} ta`, 'Faol navbat', 'Kutilayotgan'], [`${reviewCount} ta`, 'Jarayonda', 'Ko‘rib chiqilmoqda'], [`${completedCount} ta`, 'Yakunlangan', 'Yakunlangan']].map(([value, label, filter]) => <Pressable key={label} onPress={() => setStatus(status === filter ? 'Barchasi' : filter as RequestStatus)} style={[styles.statCard, status === filter && styles.statSelected]}><Text style={styles.statValue}>{value}</Text><Text style={styles.statLabel}>{label}</Text></Pressable>)}</View>
    <View style={styles.statusChips}>{statuses.map((item) => <Pill key={item} label={item} selected={status === item} onPress={() => setStatus(item)} />)}</View>
    <SearchField value={query} onChangeText={setQuery} placeholder="Murojaat yoki yuristni qidiring..." />
    <View style={styles.typeChips}>{kinds.map((item) => <Pill key={item} label={item} selected={kind === item} onPress={() => setKind(item)} />)}</View>
    <SectionTitle title="Murojaatlar" subtitle={`${filtered.length} ta natija`} />
    <View style={styles.list}>{filtered.map((request) => <RequestCard key={request.id} request={request} onRoom={() => openRoom(request)} onReview={() => router.push({ pathname: '/review', params: { lawyerId: request.lawyerId } })} />)}</View>
    {!filtered.length ? <Card style={styles.empty}><Search size={22} color={colors.muted} /><Text style={styles.emptyTitle}>Murojaat topilmadi</Text><Text style={styles.emptyText}>Boshqa qidiruv so‘zini yoki filtrni tanlang.</Text><ActionButton title="Filtrlarni tozalash" variant="outline" onPress={() => { setQuery(''); setStatus('Barchasi'); setKind('Barchasi') }} /></Card> : null}
    <Card style={styles.support}><View style={styles.supportIcon}><Headphones size={17} color="#fff" /></View><View style={{ flex: 1 }}><Text style={styles.supportTitle}>Savollaringiz bormi?</Text><Text style={styles.supportText}>Qo‘llab-quvvatlash xizmati bilan bog‘laning.</Text></View><Pressable onPress={() => router.push('/(tabs)/messages')}><Text style={styles.supportAction}>Yordam</Text></Pressable></Card>
  </Page></View>
}

function RequestCard({ request, onRoom, onReview }: { request: LegalRequest; onRoom: () => void; onReview: () => void }) {
  const pending = request.status === 'Kutilayotgan'
  const inReview = request.status === 'Ko‘rib chiqilmoqda'
  return <Card style={styles.requestCard}>
    <View style={styles.cardTop}><View style={[styles.dateTag, pending && styles.dateUpcoming]}>{pending ? <Clock3 size={11} color="#926512" /> : <Check size={11} color={colors.tertiary} />}<Text style={[styles.dateText, pending && { color: '#926512' }]}>{request.date}</Text></View><View style={styles.kindTag}>{request.kind === 'Video konsultatsiya' ? <Video size={11} color={colors.primary} /> : <FileCheck2 size={11} color={colors.primary} />}<Text style={styles.kindText}>{request.kind}</Text></View></View>
    <View style={styles.lawyerRow}><Avatar initials={request.lawyerName.split(' ').map((part) => part[0]).join('').slice(0, 2)} color={request.lawyerId === '15' ? '#3D6F94' : request.lawyerId === '12' ? '#477FA4' : '#B86B78'} size={39} /><View style={{ flex: 1 }}><Text style={styles.lawyerName}>{request.lawyerName}</Text><Text style={styles.lawyerTitle}>{request.lawyerTitle}</Text></View><Text style={styles.requestId}>ID: {request.id}</Text></View>
    {pending ? <><View style={styles.subject}><Text style={styles.subjectLabel}>MASALA</Text><Text style={styles.subjectText}>{request.subject}</Text></View><View style={styles.details}><View><Text style={styles.metaLabel}>Xizmat to‘lovi</Text><View style={styles.amountRow}><Text style={styles.amount}>{formatMoney(request.price)}</Text><View style={styles.paid}><Check size={9} color={colors.tertiary} /><Text style={styles.paidLabel}>To‘langan</Text></View></View></View><View style={{ alignItems: 'flex-end' }}><Text style={styles.metaLabel}>Davomiyligi</Text><Text style={styles.amount}>{request.duration}</Text></View></View><ActionButton title="Xonaga kirish" icon={Video} onPress={onRoom} /></> : null}
    {inReview ? <><Pressable style={styles.fileRow} onPress={() => router.push({ pathname: '/document', params: { lawyerId: request.lawyerId } })}><View style={styles.fileIcon}><FileText size={14} color={colors.primary} /></View><View style={{ flex: 1 }}><Text style={styles.fileName}>{request.fileName ?? request.subject}</Text><Text style={styles.metaLabel}>PDF · hujjat demo fayli</Text></View><ChevronRight size={14} color={colors.muted} /></Pressable><View style={styles.progressHeader}><Text style={styles.metaLabel}>{request.date}</Text><Text style={styles.progressValue}>{request.progress ?? 0}%</Text></View><View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${request.progress ?? 0}%` }]} /></View><View style={styles.details}><View><Text style={styles.metaLabel}>Ekspertiza bahosi</Text><Text style={styles.amount}>{formatMoney(request.price)}</Text></View><View style={{ alignItems: 'flex-end' }}><Text style={styles.metaLabel}>To‘lov holati</Text><Text style={styles.paidText}><Check size={10} /> To‘langan</Text></View></View><View style={styles.actionRow}><ActionButton title="Jarayonni kuzatish" icon={FileCheck2} onPress={() => router.push({ pathname: '/document', params: { lawyerId: request.lawyerId } })} style={{ flex: 1 }} /><ActionButton title="Chat" icon={MessageCircle} variant="outline" onPress={onRoom} style={{ flex: 0.6 }} /></View></> : null}
    {!pending && !inReview ? <><View style={styles.completedBox}><View style={styles.completeTitle}><CircleCheck size={13} color={colors.tertiary} /><Text style={styles.completedText}>Rasmiy huquqiy xulosa tayyor</Text></View><Text style={styles.subjectText}>{request.subject}</Text></View><View style={styles.details}><View><Text style={styles.metaLabel}>To‘langan miqdor</Text><Text style={styles.amount}>{formatMoney(request.price)}</Text></View><View style={{ alignItems: 'flex-end' }}><Text style={styles.metaLabel}>Baholash</Text>{request.rating ? <Rating value={request.rating} /> : <Text style={styles.metaLabel}>Baholanmagan</Text>}</View></View><View style={styles.actionRow}><ActionButton title="Xulosani yuklab olish" icon={Download} variant="outline" onPress={() => router.push({ pathname: '/document', params: { lawyerId: request.lawyerId } })} style={{ flex: 1 }} /><ActionButton title="Baho" icon={Star} variant="amber" onPress={onReview} /></View></> : null}
    <View style={styles.demoBadge}><ShieldCheck size={10} color={colors.primary} /><Text style={styles.demoText}>Demo ma’lumot</Text></View>
  </Card>
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  stats: { flexDirection: 'row', gap: 7 },
  statCard: { flex: 1, minHeight: 55, alignItems: 'center', justifyContent: 'center', gap: 3, borderRadius: 11, borderWidth: 1, borderColor: colors.line, backgroundColor: '#fff' },
  statSelected: { borderColor: '#A8C9E2', backgroundColor: '#F1F8FD' },
  statValue: { color: colors.primary, fontFamily: fonts.heading, fontSize: 12 },
  statLabel: { color: colors.muted, fontFamily: fonts.body, fontSize: 7 },
  statusChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  typeChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  list: { gap: 9 },
  requestCard: { gap: 9, padding: 10 },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 5 },
  dateTag: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 6, paddingVertical: 4, borderRadius: 99, backgroundColor: '#EDF6EF' },
  dateUpcoming: { backgroundColor: '#FFF0CC' },
  dateText: { color: '#377C5E', fontFamily: fonts.semibold, fontSize: 7 },
  kindTag: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 6, paddingVertical: 4, borderRadius: 99, backgroundColor: colors.primaryLight },
  kindText: { color: colors.primary, fontFamily: fonts.medium, fontSize: 7 },
  lawyerRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  lawyerName: { color: colors.text, fontFamily: fonts.heading, fontSize: 10 },
  lawyerTitle: { color: colors.muted, fontFamily: fonts.body, fontSize: 7, marginTop: 2 },
  requestId: { alignSelf: 'flex-start', color: colors.muted, fontFamily: fonts.medium, fontSize: 6 },
  subject: { padding: 8, borderRadius: 8, backgroundColor: '#F1F6FC', gap: 3 },
  subjectLabel: { color: '#8896A4', fontFamily: fonts.semibold, fontSize: 6 },
  subjectText: { color: '#3E5369', fontFamily: fonts.medium, fontSize: 8, lineHeight: 13 },
  details: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  metaLabel: { color: '#8B98A5', fontFamily: fonts.body, fontSize: 7 },
  amount: { color: colors.primary, fontFamily: fonts.heading, fontSize: 9, marginTop: 3 },
  amountRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 5 },
  paid: { flexDirection: 'row', alignItems: 'center', gap: 2, paddingHorizontal: 5, paddingVertical: 3, borderRadius: 99, backgroundColor: '#E8F7EF' },
  paidLabel: { color: '#338461', fontFamily: fonts.medium, fontSize: 6 },
  fileRow: { flexDirection: 'row', alignItems: 'center', gap: 7, padding: 7, borderWidth: 1, borderColor: colors.line, borderRadius: 8, backgroundColor: '#FAFBFC' },
  fileIcon: { width: 28, height: 28, borderRadius: 7, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primaryLight },
  fileName: { color: '#445B72', fontFamily: fonts.semibold, fontSize: 8 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  progressValue: { color: colors.tertiary, fontFamily: fonts.bold, fontSize: 8 },
  progressTrack: { height: 5, borderRadius: 5, backgroundColor: '#E8EDF2', overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 5, backgroundColor: colors.tertiary },
  paidText: { flexDirection: 'row', color: colors.tertiary, fontFamily: fonts.semibold, fontSize: 8, marginTop: 3 },
  actionRow: { flexDirection: 'row', gap: 6 },
  completedBox: { padding: 8, borderRadius: 8, backgroundColor: '#EDF7F0', gap: 4 },
  completeTitle: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  completedText: { color: '#37805C', fontFamily: fonts.semibold, fontSize: 8 },
  demoBadge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 4, paddingHorizontal: 6, paddingVertical: 3, borderRadius: 99, backgroundColor: '#EDF3F8' },
  demoText: { color: '#73869A', fontFamily: fonts.medium, fontSize: 6 },
  empty: { alignItems: 'center', gap: 8 },
  emptyTitle: { color: colors.text, fontFamily: fonts.heading, fontSize: 13 },
  emptyText: { color: colors.muted, fontFamily: fonts.body, fontSize: 9 },
  support: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  supportIcon: { width: 31, height: 31, borderRadius: 9, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary },
  supportTitle: { color: colors.text, fontFamily: fonts.semibold, fontSize: 8 },
  supportText: { color: colors.muted, fontFamily: fonts.body, fontSize: 7, marginTop: 2 },
  supportAction: { color: colors.primary, fontFamily: fonts.bold, fontSize: 8 },
})
