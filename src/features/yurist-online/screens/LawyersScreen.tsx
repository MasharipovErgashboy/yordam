import { useMemo, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native'
import { router, useLocalSearchParams } from '../navigation/router'
import { ArrowDownUp, Check, ChevronDown, Filter, Wallet } from 'lucide-react-native'

import { ModalSheet } from '../components/modal-sheet'
import { LawyerCard } from '../components/lawyer-card'
import { Header, Page, Pill, SearchField, SectionTitle, ActionButton } from '../components/native-ui'
import { lawyers } from '../constants/demo-data'
import { colors, fonts, radius } from '../constants/tokens'
import { useAppStore } from '../hooks/use-app-store'
import type { Lawyer } from '../types/models'

const prices = ['100K – 300K UZS', '300K – 500K UZS', '500K+ UZS']
const sorts = ['Tavsiya etilgan', 'Reyting bo‘yicha', 'Tajriba bo‘yicha', 'Narx: arzondan']

export default function LawyersScreen() {
  const params = useLocalSearchParams<{ q?: string }>()
  const [query, setQuery] = useState(params.q ?? '')
  const [category, setCategory] = useState('Barchasi')
  const [priceRange, setPriceRange] = useState(prices[0])
  const [sortBy, setSortBy] = useState(sorts[0])
  const [onlineOnly, setOnlineOnly] = useState(false)
  const [minimumExperience, setMinimumExperience] = useState(0)
  const [filtersVisible, setFiltersVisible] = useState(false)
  const { savedLawyers, toggleSavedLawyer } = useAppStore()

  const results = useMemo(() => {
    const searchTerm = query.trim().toLocaleLowerCase('uz')
    const filtered = lawyers.filter((lawyer) => {
      const matchesQuery = !searchTerm || `${lawyer.name} ${lawyer.title} ${lawyer.category} ${lawyer.service}`.toLocaleLowerCase('uz').includes(searchTerm)
      const matchesCategory = category === 'Barchasi' || lawyer.category === category || (category === 'Fuqarolik' && lawyer.title.toLocaleLowerCase('uz').includes('fuqarolik'))
      const matchesPrice = priceRange === prices[0] || (priceRange === prices[1] && lawyer.price >= 300000) || (priceRange === prices[2] && lawyer.price >= 500000)
      return matchesQuery && matchesCategory && matchesPrice && (!onlineOnly || lawyer.online) && lawyer.experience >= minimumExperience
    })
    return [...filtered].sort((a, b) => sortBy === sorts[1] ? b.rating - a.rating : sortBy === sorts[2] ? b.experience - a.experience : sortBy === sorts[3] ? a.price - b.price : Number(a.id) - Number(b.id))
  }, [category, minimumExperience, onlineOnly, priceRange, query, sortBy])

  function openLawyer(lawyer: Lawyer) {
    router.push({ pathname: '/lawyer/[id]', params: { id: lawyer.id } })
  }

  function resetFilters() {
    setCategory('Barchasi')
    setOnlineOnly(false)
    setMinimumExperience(0)
    setPriceRange(prices[0])
  }

  return <View style={styles.screen}><Header title="Yuristlar" subtitle="Mutaxassislar katalogi" onProfile={() => router.push('/(tabs)/profile')} /><Page>
    <View style={styles.titleRow}><View style={{ flex: 1, minWidth: 0 }}><Text style={styles.heading}>Yuristlar</Text><Text style={styles.subheading}>Sizga mos mutaxassisni toping</Text></View><Text style={styles.total}>{results.length} mutaxassis</Text></View>
    <SearchField value={query} onChangeText={setQuery} placeholder="Ism yoki mutaxassislik bo‘yicha qidiring..." />
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
      {['Barchasi', 'Oila huquqi', 'Biznes va soliq', 'Fuqarolik', 'Jinoyat huquqi', 'Uy-joy masalalari'].map((item) => <Pill key={item} label={item === 'Barchasi' ? 'Barchasi (142)' : item} selected={category === item} onPress={() => setCategory(item)} />)}
    </ScrollView>
    <View style={styles.filtersRow}><Pressable onPress={() => setFiltersVisible(true)} style={styles.filterButton}><Filter size={14} color={colors.primary} /><Text style={styles.filterText} numberOfLines={1}>Filtrlar</Text><View style={styles.filterCount}><Text style={styles.filterCountText}>{(onlineOnly ? 1 : 0) + (minimumExperience ? 1 : 0)}</Text></View></Pressable><Pressable onPress={() => setFiltersVisible(true)} style={styles.controlButton}><Wallet size={13} color={colors.primary} /><Text style={styles.controlText} numberOfLines={1}>{priceRange}</Text><ChevronDown size={13} color={colors.muted} /></Pressable><Pressable onPress={() => setFiltersVisible(true)} style={styles.sortButton}><ArrowDownUp size={13} color={colors.primary} /><Text style={styles.sortText} numberOfLines={1}>{sortBy}</Text></Pressable></View>
    <View style={styles.licenseBanner}><View style={styles.licenseIcon}><ShieldCheckIcon /></View><View style={{ flex: 1 }}><Text style={styles.licenseTitle}>Demo litsenziya ma’lumotlari</Text><Text style={styles.licenseText}>Mutaxassislarning malakasi haqiqiy xizmatda alohida tekshirilishi kerak.</Text></View></View>
    <SectionTitle title="Topilgan yuristlar" subtitle={`${results.length} ta namunaviy profil`} />
    {results.length ? <View style={styles.list}>{results.map((lawyer) => <LawyerCard key={lawyer.id} lawyer={lawyer} saved={savedLawyers.includes(lawyer.id)} onSave={() => toggleSavedLawyer(lawyer.id)} onPress={() => openLawyer(lawyer)} onApply={() => router.push({ pathname: '/application', params: { lawyerId: lawyer.id } })} />)}</View> : <View style={styles.empty}><Text style={styles.emptyTitle}>Yurist topilmadi</Text><Text style={styles.emptyText}>Filtrlarni o‘zgartirib qayta urinib ko‘ring.</Text><ActionButton title="Filtrlarni tozalash" variant="outline" onPress={() => { resetFilters(); setQuery('') }} /></View>}
    <Pressable onPress={() => router.push('/(tabs)/messages')} style={styles.helpCard}><View style={styles.helpIcon}><Text style={styles.helpIconText}>?</Text></View><View style={{ flex: 1 }}><Text style={styles.helpTitle}>Kerakli yuristni topa olmadingizmi?</Text><Text style={styles.helpText}>Navbatchi yuristga xabar yuboring</Text></View><Text style={styles.helpAction}>Yordam</Text></Pressable>
  </Page>
  <ModalSheet visible={filtersVisible} onClose={() => setFiltersVisible(false)}><Text style={styles.sheetTitle}>Yuristlarni filtrlash</Text><Text style={styles.sheetLabel}>Narx oralig‘i</Text><View style={styles.optionRow}>{prices.map((item) => <Pill key={item} label={item} selected={priceRange === item} onPress={() => setPriceRange(item)} />)}</View><Text style={styles.sheetLabel}>Tajriba</Text><View style={styles.optionRow}>{[0, 5, 10].map((value) => <Pill key={value} label={value === 0 ? 'Istalgan' : `${value}+ yil`} selected={minimumExperience === value} onPress={() => setMinimumExperience(value)} />)}</View><Text style={styles.sheetLabel}>Saralash</Text><View style={styles.optionRow}>{sorts.map((item) => <Pill key={item} label={item} selected={sortBy === item} onPress={() => setSortBy(item)} />)}</View><View style={styles.onlineRow}><View style={{ flex: 1 }}><Text style={styles.sheetLabel}>Hozir onlayn yuristlar</Text><Text style={styles.sheetHint}>Faqat hozir maslahatga tayyor mutaxassislar</Text></View><Switch value={onlineOnly} onValueChange={setOnlineOnly} trackColor={{ true: colors.primary }} /></View><View style={styles.sheetActions}><ActionButton title="Tozalash" variant="outline" onPress={() => { resetFilters(); setSortBy(sorts[0]) }} style={{ flex: 1 }} /><ActionButton title="Natijalarni ko‘rish" onPress={() => setFiltersVisible(false)} style={{ flex: 1 }} /></View></ModalSheet>
</View>
}

function ShieldCheckIcon() { return <Check size={16} color={colors.primary} /> }

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  titleRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 10, marginBottom: 2 },
  heading: { color: colors.neutral, fontFamily: fonts.headingExtra, fontSize: 22 },
  subheading: { color: colors.muted, fontFamily: fonts.body, fontSize: 13, marginTop: 3 },
  total: { color: colors.primary, fontFamily: fonts.semibold, fontSize: 12, paddingBottom: 3, flexShrink: 0 },
  chips: { gap: 8, paddingRight: 20 },
  filtersRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  filterButton: { minHeight: 36, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 11, paddingVertical: 6, borderWidth: 1, borderColor: '#DDE8F0', borderRadius: 9, backgroundColor: '#fff' },
  filterText: { color: colors.primary, fontFamily: fonts.semibold, fontSize: 12 },
  filterCount: { minWidth: 18, height: 18, paddingHorizontal: 4, borderRadius: 9, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.secondary },
  filterCountText: { color: '#fff', fontFamily: fonts.bold, fontSize: 10.5 },
  controlButton: { minHeight: 36, flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: colors.line, borderRadius: 9, backgroundColor: '#fff', maxWidth: '100%' },
  controlText: { color: '#52687E', fontFamily: fonts.medium, fontSize: 12, flexShrink: 1 },
  sortButton: { minHeight: 36, flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: colors.line, borderRadius: 9, backgroundColor: '#fff', maxWidth: '100%' },
  sortText: { color: colors.primary, fontFamily: fonts.semibold, fontSize: 12, flexShrink: 1 },
  licenseBanner: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: radius.md, backgroundColor: colors.primary },
  licenseIcon: { width: 32, height: 32, borderRadius: 9, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF20' },
  licenseTitle: { color: '#fff', fontFamily: fonts.semibold, fontSize: 13 },
  licenseText: { color: '#C8DDEC', fontFamily: fonts.body, fontSize: 11.5, lineHeight: 16, marginTop: 3 },
  list: { gap: 10 },
  empty: { alignItems: 'center', gap: 9, padding: 20, borderRadius: radius.lg, backgroundColor: '#fff' },
  emptyTitle: { color: colors.text, fontFamily: fonts.heading, fontSize: 16 },
  emptyText: { color: colors.muted, fontFamily: fonts.body, fontSize: 13, textAlign: 'center' },
  helpCard: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: radius.md, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.line },
  helpIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  helpIconText: { color: colors.primary, fontFamily: fonts.bold, fontSize: 15 },
  helpTitle: { color: colors.text, fontFamily: fonts.semibold, fontSize: 13 },
  helpText: { color: colors.muted, fontFamily: fonts.body, fontSize: 11.5, marginTop: 2 },
  helpAction: { color: colors.primary, fontFamily: fonts.bold, fontSize: 13, flexShrink: 0 },
  sheetTitle: { color: colors.neutral, fontFamily: fonts.headingExtra, fontSize: 18 },
  sheetLabel: { color: colors.text, fontFamily: fonts.semibold, fontSize: 13 },
  sheetHint: { color: colors.muted, fontFamily: fonts.body, fontSize: 11.5, marginTop: 3 },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 5 },
  sheetActions: { flexDirection: 'row', gap: 8, marginTop: 4 },
})
