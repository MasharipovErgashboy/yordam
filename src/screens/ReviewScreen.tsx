import { useState } from 'react'
import { Alert, Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { Check, LockKeyhole, ShieldCheck, Star, Video } from 'lucide-react-native'

import { Avatar, Card, Header, Page } from '@/components/native-ui'
import { colors, fonts } from '@/constants/tokens'
import { useAppStore } from '@/hooks/use-app-store'
import { findLawyer } from '@/utils/helpers'

const factors = ['Tezkor va aniq javob', 'Xushmuomala va professional', 'Muammoni chuqur tushuntirdi', 'Foydali tavsiya berdi']

export default function ReviewScreen() {
  const { lawyerId } = useLocalSearchParams<{ lawyerId?: string }>()
  const lawyer = findLawyer(lawyerId) ?? findLawyer('15')!
  const [rating, setRating] = useState(5)
  const [selectedFactors, setSelectedFactors] = useState<string[]>(factors.slice(0, 3))
  const [feedback, setFeedback] = useState(`${lawyer.name} konsultatsiya davomida masalamni diqqat bilan tinglab, qonuniy bandlarni aniq tushuntirib berdi. Tavsiyalari juda foydali bo‘ldi.`)
  const [anonymous, setAnonymous] = useState(true)
  const [publicReview, setPublicReview] = useState(true)
  const { addReview } = useAppStore()

  function toggleFactor(factor: string) {
    setSelectedFactors((current) => current.includes(factor) ? current.filter((item) => item !== factor) : [...current, factor])
  }

  function submit() {
    if (!feedback.trim()) {
      Alert.alert('Sharh kiriting', 'Yuborishdan oldin fikringizni qisqacha yozing.')
      return
    }
    addReview({ lawyerId: lawyer.id, lawyerName: lawyer.name, rating, factors: selectedFactors, comment: feedback.trim(), anonymous, public: publicReview, createdAt: new Date().toISOString() })
    Alert.alert('Rahmat!', 'Bahoyingiz demo rejimida qabul qilindi.', [{ text: 'Murojaatlarimga qaytish', onPress: () => router.replace('/(tabs)/requests') }])
  }

  return <View style={styles.screen}><Header title="Konsultatsiyani baholash" subtitle="Yakunlangan maslahat" onBack={() => router.back()} /><Page contentStyle={{ paddingBottom: 8 }}>
    <View style={styles.finished}><View style={styles.finishedIcon}><Check size={12} color="#fff" /></View><View><Text style={styles.finishedLabel}>DEMO · YAKUNLANGAN</Text><Text style={styles.finishedTitle}>Konsultatsiyani baholash</Text><Text style={styles.finishedSub}>Video konsultatsiya · murojaat ma’lumoti</Text></View></View>
    <Card style={styles.lawyerCard}><Avatar initials={lawyer.initials} color={lawyer.avatarColor} size={42} /><View style={{ flex: 1 }}><Text style={styles.name}>{lawyer.name}</Text><Text style={styles.title}>{lawyer.title}</Text><Text style={styles.exp}>{lawyer.experience} yil tajriba · demo profil</Text></View><View style={styles.videoPill}><Video size={11} color={colors.primary} /><Text style={styles.videoText}>Video</Text></View></Card>
    <Card style={styles.ratingCard}><Text style={styles.kicker}>TAJRIBANGIZ QANDAY O‘TDI?</Text><View style={styles.stars}>{[1, 2, 3, 4, 5].map((value) => <Pressable key={value} accessibilityRole="radio" accessibilityState={{ checked: rating === value }} accessibilityLabel={`${value} yulduz`} onPress={() => setRating(value)} hitSlop={4}><Star size={27} fill={value <= rating ? colors.secondary : 'transparent'} color={colors.secondary} /></Pressable>)}</View><View style={styles.ratingLabel}><Star size={11} fill={colors.secondary} color={colors.secondary} /><Text style={styles.ratingLabelText}>{rating === 5 ? 'A’lo darajada! (5.0)' : `${rating}.0 baho`}</Text></View></Card>
    <Card style={styles.section}><View style={styles.sectionHead}><Text style={styles.sectionTitle}>Nimani alohida qayd etasiz?</Text><Text style={styles.count}>{selectedFactors.length} ta tanlov</Text></View><View style={styles.factors}>{factors.map((factor) => { const selected = selectedFactors.includes(factor); return <Pressable key={factor} onPress={() => toggleFactor(factor)} style={[styles.factor, selected && styles.factorSelected]}>{selected ? <Check size={10} color="#fff" /> : <Star size={10} color={colors.primary} />}<Text style={[styles.factorText, selected && styles.factorTextSelected]}>{factor}</Text></Pressable> })}</View></Card>
    <Card style={styles.section}><View style={styles.sectionHead}><Text style={styles.sectionTitle}>Fikr va sharh qoldirish</Text><Text style={styles.count}>{feedback.length}/500</Text></View><TextInput value={feedback} onChangeText={setFeedback} multiline maxLength={500} placeholder="Maslahat tajribangiz haqida yozing..." placeholderTextColor="#95A2B0" textAlignVertical="top" style={styles.textarea} /><Text style={styles.reviewHint}>Batafsil sharh boshqa fuqarolarga mutaxassis tanlashda yordam beradi.</Text></Card>
    <Card style={styles.section}><Text style={styles.sectionTitle}>Maxfiylik va ko‘rinish</Text><PrivacyRow title="Shaxsni anonim ko‘rsatish" detail="Ismingiz o‘rniga Anonim mijoz ko‘rinadi" value={anonymous} onChange={setAnonymous} /><PrivacyRow title="Ommaviy reytingga qo‘shish" detail="Sharh demo reytingda aks etadi" value={publicReview} onChange={setPublicReview} /></Card>
    <View style={styles.legal}><ShieldCheck size={14} color={colors.primary} /><Text style={styles.legalText}>Haqiqiy platformada faqat yakunlangan konsultatsiya uchun fikr qoldiriladi. Demo sharhlar haqiqiy reyting emas.</Text></View>
    <Pressable onPress={submit} style={styles.submit}><LockKeyhole size={13} color="#fff" /><Text style={styles.submitText}>Fikrni yuborish · demo</Text></Pressable>
    <Pressable onPress={() => router.back()} style={styles.skip}><Text style={styles.skipText}>Keyinroq baholash</Text></Pressable>
  </Page></View>
}

function PrivacyRow({ title, detail, value, onChange }: { title: string; detail: string; value: boolean; onChange: (value: boolean) => void }) { return <View style={styles.privacyRow}><View style={styles.privacyIcon}><LockKeyhole size={12} color={colors.primary} /></View><View style={{ flex: 1 }}><Text style={styles.privacyTitle}>{title}</Text><Text style={styles.privacyDetail}>{detail}</Text></View><Switch value={value} onValueChange={onChange} trackColor={{ true: colors.primary }} /></View> }

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  finished: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10, borderRadius: 10, backgroundColor: '#EFF5FA' },
  finishedIcon: { width: 20, height: 20, alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: colors.tertiary },
  finishedLabel: { color: '#A4741B', fontFamily: fonts.bold, fontSize: 6, letterSpacing: 0.6 },
  finishedTitle: { color: colors.primary, fontFamily: fonts.heading, fontSize: 10, marginTop: 2 },
  finishedSub: { color: colors.muted, fontFamily: fonts.body, fontSize: 7, marginTop: 2 },
  lawyerCard: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10 },
  name: { color: colors.text, fontFamily: fonts.heading, fontSize: 9 },
  title: { color: colors.muted, fontFamily: fonts.body, fontSize: 7, marginTop: 3 },
  exp: { color: colors.primary, fontFamily: fonts.medium, fontSize: 6, marginTop: 3 },
  videoPill: { flexDirection: 'row', alignItems: 'center', gap: 4, padding: 6, borderRadius: 99, backgroundColor: colors.primaryLight },
  videoText: { color: colors.primary, fontFamily: fonts.semibold, fontSize: 6 },
  ratingCard: { alignItems: 'center', paddingVertical: 11, gap: 5 },
  kicker: { color: '#65788B', fontFamily: fonts.bold, fontSize: 7, letterSpacing: 0.5 },
  stars: { flexDirection: 'row', gap: 5 },
  ratingLabel: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 99, backgroundColor: colors.secondaryLight },
  ratingLabelText: { color: '#795515', fontFamily: fonts.semibold, fontSize: 7 },
  section: { padding: 10, gap: 8 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { color: colors.text, fontFamily: fonts.heading, fontSize: 9 },
  count: { color: colors.muted, fontFamily: fonts.body, fontSize: 7 },
  factors: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  factor: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 7, paddingVertical: 6, borderWidth: 1, borderColor: colors.line, borderRadius: 99, backgroundColor: '#F6F8FA' },
  factorSelected: { borderColor: colors.primary, backgroundColor: colors.primary },
  factorText: { color: '#5B6D7F', fontFamily: fonts.medium, fontSize: 6.5 },
  factorTextSelected: { color: '#fff' },
  textarea: { minHeight: 78, padding: 9, borderRadius: 8, borderWidth: 1, borderColor: colors.line, backgroundColor: '#F9FAFC', color: colors.text, fontFamily: fonts.body, fontSize: 8, lineHeight: 14 },
  reviewHint: { color: colors.muted, fontFamily: fonts.body, fontSize: 7 },
  privacyRow: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 8, borderRadius: 8, backgroundColor: '#F2F6FA' },
  privacyIcon: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center', borderRadius: 7, backgroundColor: '#E1EDF6' },
  privacyTitle: { color: '#465B70', fontFamily: fonts.semibold, fontSize: 7 },
  privacyDetail: { color: colors.muted, fontFamily: fonts.body, fontSize: 6, marginTop: 3 },
  legal: { flexDirection: 'row', alignItems: 'flex-start', gap: 7, padding: 9, borderRadius: 8, backgroundColor: '#EDF3F8' },
  legalText: { flex: 1, color: '#718296', fontFamily: fonts.body, fontSize: 7, lineHeight: 11 },
  submit: { minHeight: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 9, backgroundColor: colors.secondary },
  submitText: { color: '#fff', fontFamily: fonts.bold, fontSize: 9 },
  skip: { alignItems: 'center', padding: 5 },
  skipText: { color: colors.muted, fontFamily: fonts.medium, fontSize: 8 },
})
