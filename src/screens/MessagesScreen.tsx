import { useMemo, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { router } from 'expo-router'
import { Headphones, MessageCircle, ShieldCheck } from 'lucide-react-native'

import { Avatar, Card, Header, Page, SearchField, SectionTitle } from '@/components/native-ui'
import { colors, fonts, radius } from '@/constants/tokens'
import { useAppStore } from '@/hooks/use-app-store'

export default function MessagesScreen() {
  const [query, setQuery] = useState('')
  const { requests } = useAppStore()
  const conversations = useMemo(() => requests.filter((request) => request.status !== 'Yakunlangan' || request.kind === 'Matnli chat').filter((request) => !query || `${request.lawyerName} ${request.subject}`.toLocaleLowerCase('uz').includes(query.toLocaleLowerCase('uz'))), [query, requests])

  return <View style={styles.screen}><Header title="Xabarlar" subtitle="Yuristlar bilan suhbatlaringiz" /><Page>
    <SearchField value={query} onChangeText={setQuery} placeholder="Suhbat yoki yuristni qidiring..." />
    <Card style={styles.secure}><View style={styles.secureIcon}><ShieldCheck size={16} color={colors.primary} /></View><View style={{ flex: 1 }}><Text style={styles.secureTitle}>Maxfiy va xavfsiz aloqa</Text><Text style={styles.secureText}>Xabarlar demo qurilmangizda saqlanadi.</Text></View></Card>
    <SectionTitle title="Suhbatlar" subtitle={`${conversations.length} ta suhbat`} />
    <View style={styles.list}>{conversations.map((request) => <Pressable key={request.id} style={({ pressed }) => [styles.conversation, pressed && { opacity: 0.8 }]} onPress={() => router.push({ pathname: '/consultation/[id]', params: { id: request.id } })}><Avatar initials={request.lawyerName.split(' ').map((part) => part[0]).join('').slice(0, 2)} color={request.lawyerId === '15' ? '#3D6F94' : '#B86B78'} size={44} /><View style={styles.conversationCopy}><View style={styles.conversationTop}><Text style={styles.name} numberOfLines={1}>{request.lawyerName}</Text><Text style={styles.date}>{request.date}</Text></View><Text style={styles.message} numberOfLines={1}>{request.subject}</Text><View style={styles.conversationStatus}><View style={[styles.dot, request.status === 'Yakunlangan' && { backgroundColor: colors.muted }]} /><Text style={styles.status}>{request.status}</Text></View></View></Pressable>)}</View>
    <Pressable style={styles.support} onPress={() => router.push({ pathname: '/consultation/[id]', params: { id: 'support' } })}><View style={styles.supportIcon}><Headphones size={17} color="#fff" /></View><View style={{ flex: 1, minWidth: 0 }}><Text style={styles.supportTitle}>Yordam xizmati</Text><Text style={styles.supportText}>Texnik va umumiy savollar · 24/7</Text></View><MessageCircle size={17} color={colors.primary} /></Pressable>
  </Page></View>
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  secure: { flexDirection: 'row', alignItems: 'center', gap: 9, padding: 12 },
  secureIcon: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: colors.primaryLight },
  secureTitle: { color: colors.text, fontFamily: fonts.semibold, fontSize: 13.5 },
  secureText: { color: colors.muted, fontFamily: fonts.body, fontSize: 12, marginTop: 2 },
  list: { gap: 8 },
  conversation: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, backgroundColor: '#fff' },
  conversationCopy: { flex: 1, minWidth: 0, gap: 4 },
  conversationTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6 },
  name: { flex: 1, color: colors.text, fontFamily: fonts.heading, fontSize: 14 },
  date: { color: colors.muted, fontFamily: fonts.body, fontSize: 11, flexShrink: 0 },
  message: { color: '#66798D', fontFamily: fonts.body, fontSize: 12.5 },
  conversationStatus: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  dot: { width: 6, height: 6, borderRadius: 4, backgroundColor: colors.tertiary },
  status: { color: colors.muted, fontFamily: fonts.medium, fontSize: 11 },
  support: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, backgroundColor: '#fff' },
  supportIcon: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: colors.primary },
  supportTitle: { color: colors.text, fontFamily: fonts.semibold, fontSize: 13.5 },
  supportText: { color: colors.muted, fontFamily: fonts.body, fontSize: 12, marginTop: 2 },
})
