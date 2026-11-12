import { useMemo, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { router } from 'expo-router'
import { ArrowRight, Bell, BriefcaseBusiness, Building2, FileCheck2, Gavel, Heart, House, Landmark, Scale, ShieldCheck, Sparkles } from 'lucide-react-native'

import { Avatar, Header, Page, SearchField, SectionTitle } from '@/components/native-ui'
import { LawyerCard } from '@/components/lawyer-card'
import { categories, formatMoney, lawyers } from '@/constants/demo-data'
import { colors, fonts, radius } from '@/constants/tokens'
import { useAppStore } from '@/hooks/use-app-store'
import type { Lawyer } from '@/types/models'

const categoryIcons = [Scale, Heart, ShieldCheck, BriefcaseBusiness, House, Building2, Gavel, Landmark]
const popularServices = [
  { title: 'Shartnomani huquqiy tahlil qilish', subtitle: '24 soat ichida · ekspert xulosasi', price: 180000, icon: FileCheck2 },
  { title: 'Ariza va da’vo hujjatlari', subtitle: 'Sud talablariga mos tayyorlash', price: 250000, icon: FileCheck2 },
  { title: 'Tadbirkorlikni ro‘yxatdan o‘tkazish', subtitle: 'MCHJ va YATT · yurist maslahati', price: 300000, icon: Building2, lawyerId: '12' },
]

export default function HomeScreen() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string | null>(null)
  const { preferences } = useAppStore()
  const featuredLawyers = useMemo(() => lawyers.filter((lawyer) => !category || lawyer.category === category).slice(0, 3), [category])
  const palette = preferences.theme === 'Qorong‘i'
    ? { canvas: '#101824', surface: '#172334', text: '#F3F6FA', muted: '#A8B5C4', line: '#2A394B', soft: '#203145', hero: '#00385F' }
    : { canvas: colors.canvas, surface: '#FFFFFF', text: colors.neutral, muted: colors.muted, line: colors.line, soft: colors.primaryLight, hero: colors.primary }

  function openLawyer(lawyer: Lawyer) {
    router.push({ pathname: '/lawyer/[id]', params: { id: lawyer.id } })
  }

  return <View style={[styles.screen, { backgroundColor: palette.canvas }]}>
    <Header showBrand onProfile={() => router.push('/(tabs)/profile')} />
    <Page>
      <View style={styles.welcome}><View style={{ flex: 1 }}><Text style={styles.kicker}>HUQUQIY YORDAM — YAQINROQ</Text><Text style={[styles.greeting, { color: palette.text }]}>Assalomu alaykum,</Text><Text style={styles.greetingName}>Alisher aka!</Text><Text style={[styles.welcomeText, { color: palette.muted }]}>Huquqiy masalangizga mos mutaxassisni toping.</Text></View><View style={[styles.welcomeIcon, { backgroundColor: palette.surface, borderColor: palette.line }]}><ShieldCheck size={19} color={colors.primary} /></View></View>
      <SearchField value={query} onChangeText={setQuery} placeholder="Qanday yurist kerak? (oila, soliq...)" onSubmitEditing={() => router.push({ pathname: '/(tabs)/lawyers', params: { q: query } })} />

      <Pressable onPress={() => openLawyer(lawyers[4])} style={({ pressed }) => [styles.hero, { backgroundColor: palette.hero }, pressed && styles.pressed]}>
        <View style={styles.heroOrb} /><View style={styles.heroTop}><View style={styles.liveDot} /><Text style={styles.heroLabel}>24/7 TEZKOR YORDAM</Text><Sparkles size={14} color="#FFD98A" /></View>
        <Text style={styles.heroTitle}>Huquqiy savolingiz{ '\n' }bormi?</Text><Text style={styles.heroCopy}>Yurist bilan maslahat vaqtini belgilang</Text>
        <View style={styles.heroLawyer}><Avatar initials="NK" color="#4B83A6" size={32} /><View><Text style={styles.heroLawyerName}>Nodirbek Karimov</Text><Text style={styles.heroLawyerStatus}>● Onlayn yurist</Text></View><View style={styles.heroCta}><Text style={styles.heroCtaText}>Maslahat olish</Text><ArrowRight size={14} color={colors.primary} /></View></View>
        <View style={styles.heroFooter}><Bell size={12} color="#D4E7F7" /><Text style={styles.heroFooterText}>Bugun, 15:30</Text><View style={styles.separator} /><Text style={styles.heroFooterText}>Javob 5 daqiqada</Text></View>
      </Pressable>

      <SectionTitle title="Huquqiy yo‘nalishlar" action="Barchasi" onAction={() => router.push('/(tabs)/lawyers')} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
        {categories.slice(0, 7).map((item, index) => {
          const Icon = categoryIcons[index]
          const selected = category === item.name
          return <Pressable key={item.name} onPress={() => setCategory(selected ? null : item.name)} style={[styles.categoryTile, { backgroundColor: palette.surface, borderColor: palette.line }, selected && styles.categorySelected]}><View style={[styles.categoryIcon, { backgroundColor: selected ? '#D8E9F7' : ['#EAF4FD','#FFF0F3','#F1EEFF','#FFF4E7','#E8F7F5','#EAF7FB','#EDF8EF'][index] }]}><Icon size={18} color={selected ? colors.primary : ['#1469B5','#C74E6C','#7259BD','#CC7A24','#138C87','#2183A7','#4A925B'][index]} /></View><Text style={[styles.categoryName, { color: palette.text }]}>{item.short}</Text><Text style={[styles.categoryCount, { color: palette.muted }]}>{item.count} yurist</Text></Pressable>
        })}
      </ScrollView>

      <SectionTitle title="Tavsiya etilgan yuristlar" action="Hammasi" onAction={() => router.push('/(tabs)/lawyers')} />
      <View style={styles.list}>{featuredLawyers.map((lawyer) => <LawyerCard key={lawyer.id} lawyer={lawyer} compact onPress={() => openLawyer(lawyer)} />)}</View>

      <SectionTitle title="Ommabop xizmatlar" action="Ko‘rish" onAction={() => router.push('/document')} />
      <View style={styles.list}>{popularServices.map((service) => { const Icon = service.icon; return <Pressable key={service.title} style={styles.serviceCard} onPress={() => service.lawyerId ? router.push({ pathname: '/lawyer/[id]', params: { id: service.lawyerId } }) : router.push('/document')}><View style={styles.serviceIcon}><Icon size={17} color={colors.primary} /></View><View style={{ flex: 1 }}><Text style={styles.serviceTitle}>{service.title}</Text><Text style={styles.serviceSubtitle}>{service.subtitle}</Text></View><View style={styles.servicePrice}><Text style={styles.servicePriceText}>{formatMoney(service.price)}</Text><ArrowRight size={13} color={colors.muted} /></View></Pressable> })}</View>
      <View style={[styles.demoNote, { backgroundColor: palette.soft }]}><ShieldCheck size={15} color={colors.primary} /><Text style={styles.demoText}>Demo yuristlar va narxlar — haqiqiy tekshirilgan xizmat emas.</Text></View>
    </Page>
  </View>
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  welcome: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 5 },
  kicker: { color: '#8797A8', fontFamily: fonts.semibold, fontSize: 8, letterSpacing: 0.8 },
  greeting: { marginTop: 6, color: colors.neutral, fontFamily: fonts.heading, fontSize: 22, lineHeight: 26 },
  greetingName: { color: colors.primary, fontFamily: fonts.headingExtra, fontSize: 23, lineHeight: 27 },
  welcomeText: { marginTop: 5, maxWidth: 250, color: colors.muted, fontFamily: fonts.body, fontSize: 10, lineHeight: 15 },
  welcomeIcon: { width: 39, height: 39, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: colors.line },
  hero: { position: 'relative', overflow: 'hidden', padding: 15, paddingBottom: 0, borderRadius: radius.xl, backgroundColor: colors.primary, gap: 7 },
  heroOrb: { position: 'absolute', top: -50, right: -25, width: 170, height: 170, borderRadius: 90, borderWidth: 1, borderColor: '#FFFFFF20' },
  heroTop: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveDot: { width: 7, height: 7, borderRadius: 5, backgroundColor: colors.tertiary },
  heroLabel: { flex: 1, color: '#C6DFF1', fontFamily: fonts.semibold, fontSize: 8, letterSpacing: 0.7 },
  heroTitle: { marginTop: 3, color: '#fff', fontFamily: fonts.headingExtra, fontSize: 19, lineHeight: 23 },
  heroCopy: { color: '#D5E7F5', fontFamily: fonts.body, fontSize: 9 },
  heroLawyer: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 5, marginBottom: 11 },
  heroLawyerName: { color: '#fff', fontFamily: fonts.semibold, fontSize: 9 },
  heroLawyerStatus: { marginTop: 2, color: '#B9D7EC', fontFamily: fonts.body, fontSize: 7 },
  heroCta: { marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 9, backgroundColor: '#fff' },
  heroCtaText: { color: colors.primary, fontFamily: fonts.semibold, fontSize: 8 },
  heroFooter: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 29, marginHorizontal: -15, paddingHorizontal: 15, backgroundColor: '#FFFFFF12' },
  heroFooterText: { color: '#D3E5F3', fontFamily: fonts.body, fontSize: 7 },
  separator: { width: 1, height: 10, backgroundColor: '#FFFFFF50' },
  categoryRow: { gap: 8, paddingRight: 20 },
  categoryTile: { width: 76, minHeight: 89, alignItems: 'center', padding: 9, borderRadius: 13, borderWidth: 1, borderColor: colors.line, backgroundColor: '#fff' },
  categorySelected: { borderColor: '#9CC1DF', backgroundColor: '#F1F8FD' },
  categoryIcon: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  categoryName: { color: '#30465C', fontFamily: fonts.semibold, fontSize: 8 },
  categoryCount: { color: '#96A2AE', fontFamily: fonts.body, fontSize: 7, marginTop: 3 },
  list: { gap: 8 },
  serviceCard: { flexDirection: 'row', alignItems: 'center', gap: 9, padding: 10, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, backgroundColor: '#fff' },
  serviceIcon: { width: 35, height: 35, borderRadius: 10, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  serviceTitle: { color: '#2F455C', fontFamily: fonts.semibold, fontSize: 9 },
  serviceSubtitle: { color: colors.muted, fontFamily: fonts.body, fontSize: 7, marginTop: 3 },
  servicePrice: { alignItems: 'flex-end', gap: 4 },
  servicePriceText: { color: colors.primary, fontFamily: fonts.bold, fontSize: 8 },
  demoNote: { flexDirection: 'row', alignItems: 'center', gap: 7, padding: 10, borderRadius: 10, backgroundColor: '#ECF2F8' },
  demoText: { flex: 1, color: '#718295', fontFamily: fonts.body, fontSize: 8, lineHeight: 13 },
  pressed: { opacity: 0.86 },
})
