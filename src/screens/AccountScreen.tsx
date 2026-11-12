import { Alert, Pressable, StyleSheet, Switch, Text, View } from 'react-native'
import type { ReactNode } from 'react'
import { router } from 'expo-router'
import { Bell, ChevronRight, CircleHelp, FileCheck2, Globe2, LogOut, Moon, PhoneCall, Star, Sun, UserRoundCheck, type LucideIcon } from 'lucide-react-native'

import { Avatar, Card, Header, Page } from '@/components/native-ui'
import { colors, fonts } from '@/constants/tokens'
import { useAppStore } from '@/hooks/use-app-store'

export default function AccountScreen() {
  const { preferences, updatePreferences, requests, savedLawyers } = useAppStore()
  const statItems: { value: string; label: string; icon: LucideIcon; route: '/(tabs)/lawyers' | '/(tabs)/requests' }[] = [
    { value: String(requests.length), label: 'Konsultatsiya', icon: FileCheck2, route: '/(tabs)/requests' },
    { value: '6', label: 'Hujjatlar', icon: FileCheck2, route: '/(tabs)/requests' },
    { value: String(savedLawyers.length), label: 'Yuristlar', icon: Star, route: '/(tabs)/lawyers' },
  ]

  function confirmLogout() {
    Alert.alert('Tizimdan chiqasizmi?', 'Keyingi safar akkauntingizga qayta kirishingiz kerak bo‘ladi.', [{ text: 'Bekor qilish', style: 'cancel' }, { text: 'Chiqish', style: 'destructive', onPress: () => Alert.alert('Demo rejim', 'Akkauntdan demo tarzida chiqildi.') }])
  }

  return <View style={styles.screen}><Header title="Mening profilim" subtitle="Shaxsiy ma’lumot va sozlamalar" showActions={false} /><Page>
    <Card style={styles.profileCard}><Avatar initials="AQ" color="#385E7C" size={58} /><Text style={styles.profileName}>Alisher Qodirov</Text><Text style={styles.contact}>+998 90 123-45-67 · alisher.qodirov@gmail.com</Text></Card>
    <View style={styles.stats}>{statItems.map(({ value, label, icon: Icon, route }) => <Pressable key={label} style={styles.stat} onPress={() => router.push(route)}><View style={styles.statIcon}><Icon size={14} color={colors.primary} /></View><Text style={styles.statValue}>{value}</Text><Text style={styles.statLabel}>{label}</Text></Pressable>)}</View>

    <Group title="SHAXSIY MA’LUMOTLAR VA TARIX">
      <Row icon={UserRoundCheck} title="Mening yuridik hujjatlarim" detail="Shartnomalar, arizalar, rasmiy xulosa" badge="6 ta" onPress={() => router.push('/(tabs)/requests')} />
      <Row icon={FileCheck2} title="Konsultatsiyalar va to‘lovlar" detail="Murojaatlar va kvitansiyalar" onPress={() => router.push('/(tabs)/requests')} />
      <Row icon={Star} title="Tanlangan yuristlar" detail="Saqlangan advokatlar ro‘yxati" badge={`${savedLawyers.length} ta`} onPress={() => router.push('/(tabs)/lawyers')} />
    </Group>

    <Group title="ILOVA SOZLAMALARI">
      <Setting icon={Bell} title="Bildirishnomalar" detail="SMS, push va e-mail xabarlari" value={preferences.notifications} onChange={(value) => updatePreferences({ notifications: value })} />
      <Row icon={Globe2} title="Tilni tanlash" detail={preferences.language} badge="O‘zbek" onPress={() => Alert.alert('Ilova tili', 'Tilni tanlang', ['O‘zbek tili (Lotin)', 'O‘zbek tili (Кирилл)', 'Русский', 'English'].map((language) => ({ text: language, onPress: () => updatePreferences({ language }) })))} />
      <Row icon={preferences.theme === 'Qorong‘i' ? Moon : Sun} title="Mavzu ko‘rinishi" detail="Ko‘rinish rejimini tanlang" badge={preferences.theme} onPress={() => Alert.alert('Mavzu ko‘rinishi', undefined, ['Avto', 'Yorug‘', 'Qorong‘i'].map((theme) => ({ text: theme, onPress: () => updatePreferences({ theme: theme as 'Avto' | 'Yorug‘' | 'Qorong‘i' }) })))} />
    </Group>

    <Group title="QO‘LLAB-QUVVATLASH VA HISOB">
      <Row icon={CircleHelp} title="24/7 Yuridik call-markaz" detail="Tezkor yo‘llanma (1008)" trailing={<PhoneCall size={14} color={colors.muted} />} onPress={() => Alert.alert('Call-markaz', 'Demo raqam: 1008. Haqiqiy ulanish тохирlanmagan.')} />
      <Row icon={CircleHelp} title="Ilova haqida" detail="YURIST ONLINE · mobil demo v1.0" badge="2026" onPress={() => Alert.alert('Ilova haqida', 'Yurist Online native Expo miniapp demo.')} />
    </Group>
    <Pressable style={styles.logout} onPress={confirmLogout}><LogOut size={14} color={colors.danger} /><Text style={styles.logoutText}>Tizimdan chiqish</Text></Pressable>
    <Text style={styles.footerNote}>Demo ma’lumotlar telefonda saqlanadi. Haqiqiy akkaunt, OneID va to‘lov ulanmagan.</Text>
  </Page></View>
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return <View style={styles.group}><Text style={styles.groupTitle}>{title}</Text>{children}</View>
}

function Row({ icon: Icon, title, detail, badge, trailing, onPress }: { icon: LucideIcon; title: string; detail: string; badge?: string; trailing?: ReactNode; onPress?: () => void }) {
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}><View style={styles.rowIcon}><Icon size={14} color={colors.primary} /></View><View style={styles.rowCopy}><Text style={styles.rowTitle} numberOfLines={1}>{title}</Text><Text style={styles.rowDetail} numberOfLines={1}>{detail}</Text></View>{badge ? <Text style={styles.badge}>{badge}</Text> : trailing}{onPress ? <ChevronRight size={13} color="#91A0AE" /> : null}</Pressable>
}

function Setting({ icon: Icon, title, detail, value, onChange }: { icon: LucideIcon; title: string; detail: string; value: boolean; onChange: (value: boolean) => void }) {
  return <View style={styles.row}><View style={styles.rowIcon}><Icon size={14} color={colors.primary} /></View><View style={styles.rowCopy}><Text style={styles.rowTitle} numberOfLines={1}>{title}</Text><Text style={styles.rowDetail} numberOfLines={1}>{detail}</Text></View><Switch value={value} onValueChange={onChange} trackColor={{ false: '#CAD3DC', true: colors.primary }} thumbColor="#fff" /></View>
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  profileCard: { alignItems: 'center', gap: 5, paddingVertical: 15 },
  profileName: { color: colors.neutral, fontFamily: fonts.headingExtra, fontSize: 13 },
  contact: { color: colors.muted, fontFamily: fonts.body, fontSize: 8 },
  stats: { flexDirection: 'row', gap: 7 },
  stat: { flex: 1, alignItems: 'center', gap: 3, minHeight: 65, justifyContent: 'center', borderRadius: 11, borderWidth: 1, borderColor: colors.line, backgroundColor: '#fff' },
  statIcon: { width: 23, height: 23, borderRadius: 7, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primaryLight },
  statValue: { color: colors.primary, fontFamily: fonts.heading, fontSize: 10 },
  statLabel: { color: colors.muted, fontFamily: fonts.body, fontSize: 7 },
  group: { padding: 8, borderRadius: 11, borderWidth: 1, borderColor: colors.line, backgroundColor: '#fff' },
  groupTitle: { marginHorizontal: 3, marginBottom: 4, color: '#8794A2', fontFamily: fonts.bold, fontSize: 7, letterSpacing: 0.6 },
  row: { minHeight: 42, flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 3, paddingVertical: 5, borderRadius: 8 },
  rowIcon: { width: 26, height: 26, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: '#EAF2F8' },
  rowCopy: { flex: 1, minWidth: 0, gap: 2 },
  rowTitle: { color: '#40556B', fontFamily: fonts.semibold, fontSize: 8 },
  rowDetail: { color: '#8996A4', fontFamily: fonts.body, fontSize: 6.5 },
  badge: { color: '#5D748A', fontFamily: fonts.medium, fontSize: 6, paddingHorizontal: 6, paddingVertical: 4, borderRadius: 99, backgroundColor: '#EFF3F6' },
  logout: { minHeight: 38, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 9, borderWidth: 1, borderColor: '#F1DEDE', backgroundColor: '#fff' },
  logoutText: { color: colors.danger, fontFamily: fonts.semibold, fontSize: 9 },
  footerNote: { color: colors.muted, fontFamily: fonts.body, fontSize: 7, textAlign: 'center', lineHeight: 11, paddingHorizontal: 14 },
  pressed: { opacity: 0.76 },
})
