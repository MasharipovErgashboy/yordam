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
    <Header showBrand showActions={false} />
    <Page>
      <SearchField value={query} onChangeText={setQuery} placeholder="Qanday yurist kerak? (oila, soliq...)" onSubmitEditing={() => router.push({ pathname: '/(tabs)/lawyers', params: { q: query } })} />

      <Pressable onPress={() => openLawyer(lawyers[4])} style={({ pressed }) => [styles.hero, { backgroundColor: palette.hero }, pressed && styles.pressed]}>
        <View style={styles.heroOrb} /><View style={styles.heroTop}><View style={styles.liveDot} /><Text style={styles.heroLabel}>24/7 TEZKOR YORDAM</Text><Sparkles size={14} color="#FFD98A" /></View>
        <Text style={styles.heroTitle}>Huquqiy savolingiz{ '\n' }bormi?</Text><Text style={styles.heroCopy}>Yurist bilan maslahat vaqtini belgilang</Text>
        <View style={styles.heroLawyer}><Avatar initials="NK" color="#4B83A6" size={36} /><View style={{ flex: 1, minWidth: 0 }}><Text style={styles.heroLawyerName} numberOfLines={1}>Nodirbek Karimov</Text><Text style={styles.heroLawyerStatus} numberOfLines={1}>● Onlayn yurist</Text></View><View style={styles.heroCta}><Text style={styles.heroCtaText} numberOfLines={1}>Maslahat olish</Text><ArrowRight size={14} color={colors.primary} /></View></View>
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
      <View style={styles.list}>{popularServices.map((service) => { const Icon = service.icon; return <Pressable key={service.title} style={styles.serviceCard} onPress={() => service.lawyerId ? router.push({ pathname: '/lawyer/[id]', params: { id: service.lawyerId } }) : router.push('/document')}><View style={styles.serviceIcon}><Icon size={18} color={colors.primary} /></View><View style={{ flex: 1, minWidth: 0 }}><Text style={styles.serviceTitle}>{service.title}</Text><Text style={styles.serviceSubtitle}>{service.subtitle}</Text></View><View style={styles.servicePrice}><Text style={styles.servicePriceText}>{formatMoney(service.price)}</Text><ArrowRight size={13} color={colors.muted} /></View></Pressable> })}</View>
      <View style={[styles.demoNote, { backgroundColor: palette.soft }]}><ShieldCheck size={15} color={colors.primary} /><Text style={styles.demoText}>Demo yuristlar va narxlar — haqiqiy tekshirilgan xizmat emas.</Text></View>
    </Page>
  </View>
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  hero: { position: 'relative', overflow: 'hidden', padding: 16, paddingBottom: 0, borderRadius: radius.xl, backgroundColor: colors.primary, gap: 8 },
  heroOrb: { position: 'absolute', top: -50, right: -25, width: 170, height: 170, borderRadius: 90, borderWidth: 1, borderColor: '#FFFFFF20' },
  heroTop: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveDot: { width: 7, height: 7, borderRadius: 5, backgroundColor: colors.tertiary },
  heroLabel: { flex: 1, color: '#C6DFF1', fontFamily: fonts.semibold, fontSize: 11, letterSpacing: 0.6 },
  heroTitle: { marginTop: 3, color: '#fff', fontFamily: fonts.headingExtra, fontSize: 21, lineHeight: 27 },
  heroCopy: { color: '#D5E7F5', fontFamily: fonts.body, fontSize: 13, lineHeight: 18 },
  heroLawyer: { flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 6, marginBottom: 12 },
  heroLawyerName: { color: '#fff', fontFamily: fonts.semibold, fontSize: 13 },
  heroLawyerStatus: { marginTop: 2, color: '#B9D7EC', fontFamily: fonts.body, fontSize: 11 },
  heroCta: { marginLeft: 'auto', flexShrink: 0, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 9, borderRadius: 10, backgroundColor: '#fff' },
  heroCtaText: { color: colors.primary, fontFamily: fonts.semibold, fontSize: 12 },
  heroFooter: { flexDirection: 'row', alignItems: 'center', gap: 7, minHeight: 34, paddingVertical: 8, marginHorizontal: -16, paddingHorizontal: 16, backgroundColor: '#FFFFFF12' },
  heroFooterText: { color: '#D3E5F3', fontFamily: fonts.body, fontSize: 11 },
  separator: { width: 1, height: 11, backgroundColor: '#FFFFFF50' },
  categoryRow: { gap: 9, paddingRight: 20 },
  categoryTile: { width: 98, minHeight: 102, alignItems: 'center', justifyContent: 'center', padding: 10, borderRadius: 14, borderWidth: 1, borderColor: colors.line, backgroundColor: '#fff' },
  categorySelected: { borderColor: '#9CC1DF', backgroundColor: '#F1F8FD' },
  categoryIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 7 },
  categoryName: { color: '#30465C', fontFamily: fonts.semibold, fontSize: 12, textAlign: 'center' },
  categoryCount: { color: '#96A2AE', fontFamily: fonts.body, fontSize: 11, marginTop: 3, textAlign: 'center' },
  list: { gap: 9 },
  serviceCard: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, backgroundColor: '#fff' },
  serviceIcon: { width: 38, height: 38, borderRadius: 11, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  serviceTitle: { color: '#2F455C', fontFamily: fonts.semibold, fontSize: 13.5, lineHeight: 18 },
  serviceSubtitle: { color: colors.muted, fontFamily: fonts.body, fontSize: 11.5, marginTop: 3 },
  servicePrice: { alignItems: 'flex-end', gap: 4, flexShrink: 0 },
  servicePriceText: { color: colors.primary, fontFamily: fonts.bold, fontSize: 12.5 },
  demoNote: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 11, borderRadius: 10, backgroundColor: '#ECF2F8' },
  demoText: { flex: 1, color: '#718295', fontFamily: fonts.body, fontSize: 12, lineHeight: 17 },
  pressed: { opacity: 0.86 },
})
