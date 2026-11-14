import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Bookmark, CalendarDays, MessageCircle, ShieldCheck } from 'lucide-react-native'

import type { Lawyer } from '../types/models'
import { Avatar, Rating } from './native-ui'
import { colors, fonts, radius, spacing } from '../constants/tokens'
import { formatMoney } from '../constants/demo-data'

export function LawyerCard({ lawyer, saved, onPress, onSave, onApply, compact = false }: { lawyer: Lawyer; saved?: boolean; onPress: () => void; onSave?: () => void; onApply?: () => void; compact?: boolean }) {
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.card, compact && styles.compact, pressed && styles.pressed]}>
    <View style={styles.top}>
      <Avatar initials={lawyer.initials} color={lawyer.avatarColor} size={compact ? 42 : 47} />
      <View style={styles.info}>
        <View style={styles.nameLine}><Text style={styles.name} numberOfLines={1}>{lawyer.name}</Text><Rating value={lawyer.rating} count={compact ? undefined : lawyer.reviews} /></View>
        <Text style={styles.title} numberOfLines={1}>{lawyer.title}</Text>
        <View style={styles.meta}><View style={styles.license}><ShieldCheck size={10} color={colors.primary} /><Text style={styles.licenseText}>Litsenziya {lawyer.license}</Text></View><Text style={styles.experience}>{lawyer.experience} yil tajriba</Text></View>
      </View>
      {onSave ? <Pressable accessibilityLabel={saved ? 'Saqlanganlardan olib tashlash' : 'Saqlash'} hitSlop={8} onPress={(event) => { event.stopPropagation(); onSave() }} style={styles.save}><Bookmark size={16} color={saved ? colors.primary : colors.muted} fill={saved ? colors.primary : 'transparent'} /></Pressable> : null}
    </View>
    {!compact ? <View style={styles.service}><Text style={styles.serviceText} numberOfLines={1}>{lawyer.service}</Text><Text style={styles.servicePrice}>{formatMoney(lawyer.price)}</Text></View> : null}
    <View style={styles.bottom}><View style={styles.priceBlock}><Text style={styles.priceLabel}>KONSULTATSIYA NARXI</Text><Text style={styles.price}>{formatMoney(lawyer.price)} <Text style={styles.duration}>/ 30 daq</Text></Text></View><View style={styles.actions}><Pressable onPress={(event) => { event.stopPropagation(); onPress() }} style={[styles.bookButton, compact && styles.compactButton]}><CalendarDays size={13} color="#fff" /><Text numberOfLines={1} style={styles.bookText}>{compact ? 'Profil' : 'Band qilish'}</Text></Pressable>{!compact && onApply ? <Pressable onPress={(event) => { event.stopPropagation(); onApply() }} style={styles.applyButton}><MessageCircle size={13} color={colors.primary} /><Text numberOfLines={1} style={styles.applyText}>Ariza</Text></Pressable> : null}</View></View>
  </Pressable>
}

const styles = StyleSheet.create({
  card: { padding: spacing.md, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, backgroundColor: '#fff', gap: 10 },
  compact: { padding: 12, gap: 9 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  info: { flex: 1, minWidth: 0, gap: 4 },
  nameLine: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6 },
  name: { flex: 1, color: colors.text, fontFamily: fonts.heading, fontSize: 15 },
  title: { color: colors.muted, fontFamily: fonts.body, fontSize: 12.5 },
  meta: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6 },
  license: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6, backgroundColor: colors.primaryLight },
  licenseText: { color: colors.primary, fontFamily: fonts.medium, fontSize: 11 },
  experience: { color: '#728398', fontFamily: fonts.body, fontSize: 11 },
  save: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  service: { minHeight: 34, paddingHorizontal: 10, paddingVertical: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, borderRadius: 8, backgroundColor: '#F6F8FB' },
  serviceText: { flex: 1, minWidth: 0, color: '#52687E', fontFamily: fonts.medium, fontSize: 12 },
  servicePrice: { color: colors.primary, fontFamily: fonts.semibold, fontSize: 12, flexShrink: 0 },
  bottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, paddingTop: 10, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line },
  priceBlock: { flexShrink: 1, minWidth: 0 },
  priceLabel: { color: '#98A4B1', fontFamily: fonts.semibold, fontSize: 10.5, letterSpacing: 0.4 },
  price: { color: colors.primary, fontFamily: fonts.headingExtra, fontSize: 14, marginTop: 2 },
  duration: { color: '#98A4B1', fontFamily: fonts.body, fontSize: 11 },
  bookButton: { minHeight: 36, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 9, backgroundColor: colors.primary },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 6, flexShrink: 0 },
  compactButton: { minHeight: 34, paddingHorizontal: 12 },
  applyButton: { minHeight: 36, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingHorizontal: 11, paddingVertical: 6, borderRadius: 9, borderWidth: 1, borderColor: '#BCD0E0', backgroundColor: '#fff' },
  applyText: { color: colors.primary, fontFamily: fonts.semibold, fontSize: 12.5 },
  bookText: { color: '#fff', fontFamily: fonts.semibold, fontSize: 12.5 },
  pressed: { opacity: 0.84 },
})
