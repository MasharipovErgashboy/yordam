import type { ComponentProps, ReactNode } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, type StyleProp, type TextInputProps, type ViewProps, type ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ChevronRight, Scale, Search, ShieldCheck, Star, type LucideIcon } from 'lucide-react-native'

import { colors, fonts, radius, spacing } from '@/constants/tokens'

export function Page({ children, scroll = true, contentStyle, ...props }: { children: ReactNode; scroll?: boolean; contentStyle?: StyleProp<ViewStyle> } & ViewProps) {
  const insets = useSafeAreaInsets()
  const body = scroll ? <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 14) + 22 }, contentStyle]}>{children}</ScrollView> : <View style={[styles.fixedContent, contentStyle]}>{children}</View>
  return <View style={styles.page} {...props}>{body}</View>
}

export function Header({ onBack, showBrand = false }: { title?: string; subtitle?: string; onProfile?: () => void; onBack?: () => void; onNotifications?: () => void; showBrand?: boolean; showActions?: boolean }) {
  const insets = useSafeAreaInsets()
  if (!onBack && !showBrand) {
    return <View style={{ paddingTop: Math.max(insets.top, 8) + 4, backgroundColor: colors.canvas }} />
  }
  return <View style={[styles.header, { paddingTop: Math.max(insets.top, 8) + 4 }]}>
    {onBack ? (
      <Pressable onPress={onBack} hitSlop={10} style={styles.backButton} accessibilityRole="button" accessibilityLabel="Orqaga">
        <ChevronRight size={22} color={colors.primary} style={{ transform: [{ rotate: '180deg' }] }} />
      </Pressable>
    ) : (
      <View style={styles.headerLeft}>
        <View style={styles.brandIcon}><Scale size={18} color="#fff" /></View>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>YURIST ONLINE</Text>
          <Text style={styles.headerSubtitle}>Huquqiy yordam — yaqinroq</Text>
        </View>
      </View>
    )}
  </View>
}

export function TextLabel({ children, style, ...props }: ComponentProps<typeof Text>) {
  return <Text {...props} style={[styles.text, style]}>{children}</Text>
}

export function SectionTitle({ title, action, onAction, subtitle }: { title: string; action?: string; onAction?: () => void; subtitle?: string }) {
  return <View style={styles.sectionTitleRow}><View style={{ flex: 1 }}><Text style={styles.sectionTitle}>{title}</Text>{subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}</View>{action ? <Pressable onPress={onAction} hitSlop={8} style={styles.sectionAction}><Text style={styles.actionText}>{action}</Text><ChevronRight size={14} color={colors.primary} /></Pressable> : null}</View>
}

export function Card({ children, style, ...props }: ViewProps) {
  return <View {...props} style={[styles.card, style]}>{children}</View>
}

export function ActionButton({ title, onPress, icon: Icon, variant = 'primary', disabled, style }: { title: string; onPress?: () => void; icon?: LucideIcon; variant?: 'primary' | 'secondary' | 'outline' | 'amber' | 'danger'; disabled?: boolean; style?: StyleProp<ViewStyle> }) {
  const iconColor = variant === 'outline' ? colors.primary : '#fff'
  const variantStyle = { primary: styles.button_primary, secondary: styles.button_secondary, outline: styles.button_outline, amber: styles.button_amber, danger: styles.button_danger }[variant]
  return <Pressable disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.actionButton, variantStyle, disabled && styles.buttonDisabled, pressed && styles.pressed, style]}>{Icon ? <Icon size={16} color={iconColor} /> : null}<Text numberOfLines={1} style={[styles.actionButtonText, variant === 'outline' && { color: colors.primary }]}>{title}</Text></Pressable>
}

export function Avatar({ initials, color = colors.primary, size = 44 }: { initials: string; color?: string; size?: number }) {
  return <View style={[styles.avatar, { width: size, height: size, borderRadius: size * 0.3, backgroundColor: color }]}><Text style={[styles.avatarText, { fontSize: Math.max(11, size * 0.28) }]}>{initials}</Text><View style={styles.avatarCheck}><ShieldCheck size={10} color="#fff" /></View></View>
}

export function Pill({ label, selected, onPress, icon: Icon, style }: { label: string; selected?: boolean; onPress?: () => void; icon?: LucideIcon; style?: object }) {
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.pill, selected && styles.pillSelected, pressed && styles.pressed, style]}>{Icon ? <Icon size={13} color={selected ? '#fff' : colors.primary} /> : null}<Text numberOfLines={1} style={[styles.pillText, selected && styles.pillTextSelected]}>{label}</Text></Pressable>
}

export function SearchField({ value, onChangeText, placeholder, onSubmitEditing }: Pick<TextInputProps, 'value' | 'onChangeText' | 'placeholder' | 'onSubmitEditing'>) {
  return <View style={styles.searchField}><Search size={16} color={colors.muted} /><TextInput value={value} onChangeText={onChangeText} onSubmitEditing={onSubmitEditing} placeholder={placeholder} placeholderTextColor="#9BA8B6" style={styles.searchInput} returnKeyType="search" /></View>
}

export function Rating({ value, count }: { value: number; count?: number }) {
  return <View style={styles.rating}><Star size={13} color={colors.secondary} fill={colors.secondary} /><Text style={styles.ratingText}>{value.toFixed(2)}</Text>{count !== undefined ? <Text style={styles.ratingCount}>({count})</Text> : null}</View>
}

export function Notice({ children, icon: Icon = ShieldCheck }: { children: ReactNode; icon?: LucideIcon }) {
  return <View style={styles.notice}><Icon size={16} color={colors.primary} /><Text style={styles.noticeText}>{children}</Text></View>
}

export function Metric({ value, label }: { value: string; label: string }) {
  return <View style={styles.metric}><Text style={styles.metricValue}>{value}</Text><Text style={styles.metricLabel}>{label}</Text></View>
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.canvas },
  scrollContent: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, gap: spacing.md },
  fixedContent: { flex: 1, paddingHorizontal: spacing.lg },
  header: { minHeight: 54, paddingHorizontal: spacing.lg, paddingBottom: 10, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 },
  brandIcon: { width: 36, height: 36, borderRadius: 11, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  backButton: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  headerText: { flex: 1, minWidth: 0 },
  headerTitle: { color: colors.primary, fontFamily: fonts.heading, fontSize: 16, letterSpacing: 0.1 },
  headerSubtitle: { color: colors.muted, fontFamily: fonts.body, fontSize: 12, marginTop: 1 },
  text: { color: colors.text, fontFamily: fonts.body, fontSize: 14 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 2 },
  sectionTitle: { color: colors.neutral, fontFamily: fonts.heading, fontSize: 17, letterSpacing: -0.2 },
  sectionSubtitle: { color: colors.muted, fontFamily: fonts.body, fontSize: 12, marginTop: 3 },
  sectionAction: { flexDirection: 'row', alignItems: 'center', gap: 1 },
  actionText: { color: colors.primary, fontFamily: fonts.semibold, fontSize: 13 },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, padding: spacing.md },
  actionButton: { minHeight: 46, borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
  button_primary: { backgroundColor: colors.primary },
  button_secondary: { backgroundColor: colors.primaryLight },
  button_outline: { backgroundColor: colors.surface, borderWidth: 1, borderColor: '#BCD0E0' },
  button_amber: { backgroundColor: colors.secondary },
  button_danger: { backgroundColor: colors.danger },
  buttonDisabled: { opacity: 0.48 },
  actionButtonText: { color: '#fff', fontFamily: fonts.semibold, fontSize: 13.5, flexShrink: 1 },
  pressed: { opacity: 0.78, transform: [{ scale: 0.99 }] },
  avatar: { alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  avatarText: { color: '#fff', fontFamily: fonts.headingExtra },
  avatarCheck: { position: 'absolute', right: -5, bottom: -3, width: 15, height: 15, borderRadius: 9, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary, borderWidth: 1, borderColor: '#fff' },
  pill: { minHeight: 34, paddingHorizontal: 13, paddingVertical: 6, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.line, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 },
  pillSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  pillText: { color: '#51657A', fontFamily: fonts.medium, fontSize: 12, flexShrink: 1 },
  pillTextSelected: { color: '#fff' },
  searchField: { minHeight: 46, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, backgroundColor: '#fff' },
  searchInput: { flex: 1, minWidth: 0, color: colors.text, fontFamily: fonts.body, fontSize: 13.5, paddingVertical: 0 },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 3, flexShrink: 0 },
  ratingText: { color: colors.text, fontFamily: fonts.semibold, fontSize: 12 },
  ratingCount: { color: colors.muted, fontFamily: fonts.body, fontSize: 11 },
  notice: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, padding: 11, borderRadius: radius.md, backgroundColor: '#EDF3F9' },
  noticeText: { flex: 1, color: '#65788D', fontFamily: fonts.body, fontSize: 12, lineHeight: 18 },
  metric: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 54, borderRightWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  metricValue: { color: colors.primary, fontFamily: fonts.heading, fontSize: 15 },
  metricLabel: { color: colors.muted, fontFamily: fonts.body, fontSize: 11, marginTop: 3 },
})
