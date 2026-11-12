import { useMemo, useState } from 'react'
import { Alert, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import * as DocumentPicker from 'expo-document-picker'
import * as ImagePicker from 'expo-image-picker'
import { router, useLocalSearchParams } from '../navigation/router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ArrowRight, Camera, Clock3, Eye, FileCheck2, FileText, FolderOpen, LockKeyhole, ShieldCheck, Star, Trash2, Upload, type LucideIcon } from 'lucide-react-native'

import { Avatar, Card, Header, Page, Pill, SectionTitle, ActionButton } from '../components/native-ui'
import { documentTypes, formatMoney, lawyers } from '../constants/demo-data'
import { colors, fonts } from '../constants/tokens'
import { useAppStore } from '../hooks/use-app-store'

const MAX_FILE_SIZE = 25 * 1024 * 1024

type LocalFile = { name: string; uri: string; size: number; mimeType?: string; image?: boolean }

export default function DocumentSubmissionScreen() {
  const insets = useSafeAreaInsets()
  const params = useLocalSearchParams<{ lawyerId?: string }>()
  const initialLawyer = lawyers.find((item) => item.id === params.lawyerId) ?? lawyers[0]
  const [lawyer, setLawyer] = useState(initialLawyer)
  const [type, setType] = useState(documentTypes[0])
  const [files, setFiles] = useState<LocalFile[]>([])
  const [description, setDescription] = useState('')
  const { addRequest, requests } = useAppStore()

  const price = useMemo(() => type === 'Da’vo arizasi loyihasi' ? 200000 : type === 'Meros hujjatlari' ? 180000 : 250000, [type])

  function acceptFiles(newFiles: LocalFile[]) {
    const oversized = newFiles.find((file) => file.size > MAX_FILE_SIZE)
    if (oversized) {
      Alert.alert('Fayl juda katta', `${oversized.name}: fayl hajmi 25 MB dan oshmasligi kerak.`)
      return
    }
    setFiles((current) => [...current, ...newFiles].slice(0, 5))
  }

  async function pickDocuments() {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/*'], multiple: true, copyToCacheDirectory: true })
      if (!result.canceled) acceptFiles(result.assets.map((asset) => ({ name: asset.name, uri: asset.uri, size: asset.size ?? 0, mimeType: asset.mimeType })))
    } catch {
      Alert.alert('Faylni tanlab bo‘lmadi', 'Qurilma fayl tanlagichini qayta ochib ko‘ring.')
    }
  }

  async function takePhoto() {
    const permission = await ImagePicker.requestCameraPermissionsAsync()
    if (!permission.granted) {
      Alert.alert('Kamera ruxsati kerak', 'Hujjatni suratga olish uchun kamera ruxsatini yoqing.')
      return
    }
    const result = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.85 })
    if (!result.canceled) acceptFiles(result.assets.map((asset) => ({ name: asset.fileName ?? `Hujjat-${Date.now()}.jpg`, uri: asset.uri, size: asset.fileSize ?? 0, mimeType: asset.mimeType, image: true })))
  }

  function chooseLawyer() {
    Alert.alert('Advokat tanlang', 'Hujjatni tekshiradigan mutaxassisni belgilang.', [
      ...lawyers.slice(0, 4).map((item) => ({ text: `${item.name} · ${item.rating.toFixed(2)}`, onPress: () => setLawyer(item) })),
      { text: 'Bekor qilish', style: 'cancel' },
    ])
  }

  function submit() {
    if (!files.length) {
      Alert.alert('Hujjat biriktiring', 'Tekshiruvga yuborish uchun kamida bitta fayl tanlang.')
      return
    }
    if (!description.trim()) {
      Alert.alert('Masalani yozing', 'Advokatga vazifani tushuntirish uchun qisqa izoh kiriting.')
      return
    }
    const id = `DOC-${requests.length + 1}`
    addRequest({ id, status: 'Ko‘rib chiqilmoqda', kind: 'Hujjat ekspertizasi', lawyerId: lawyer.id, lawyerName: lawyer.name, lawyerTitle: lawyer.title, subject: files[0].name, fileName: files[0].name, price, date: 'Bugun · yangi murojaat', progress: 5 })
    Alert.alert('Demo murojaat tayyor', 'Hujjatlar qurilmada tanlandi. Hozircha fayl backendga yuklanmaydi; murojaat mahalliy demo ro‘yxatiga qo‘shildi.', [{ text: 'Murojaatlarim', onPress: () => router.replace('/(tabs)/requests') }])
  }

  return <View style={styles.screen}><Header title="Hujjat topshirish" subtitle="Yuridik ekspertiza" onBack={() => router.back()} /><Page contentStyle={{ paddingBottom: 92 }}>
    <View style={styles.steps}><Step number="1" label="Yuklash" active /><View style={styles.stepLine} /><Step number="2" label="Advokat" /><View style={styles.stepLine} /><Step number="3" label="Tasdiqlash" /></View>
    <Card style={styles.section}><SectionTitle title="Hujjatni yuklash" action="Max: 25 MB" /><Pressable style={styles.dropzone} onPress={pickDocuments}><View style={styles.uploadIcon}><Upload size={17} color={colors.primary} /></View><Text style={styles.dropTitle}>Faylni shu yerga joylashtiring</Text><Text style={styles.dropHint}>PDF, DOCX, JPG yoki PNG formatlarida</Text></Pressable><View style={styles.uploadActions}><ActionButton title="Kamera orqali" icon={Camera} variant="outline" onPress={takePhoto} style={{ flex: 1 }} /><ActionButton title="Fayllar ro‘yxati" icon={FolderOpen} variant="outline" onPress={pickDocuments} style={{ flex: 1 }} /></View>
      {files.map((file, index) => <View key={`${file.uri}-${index}`} style={styles.fileItem}>{file.image ? <Image source={{ uri: file.uri }} style={styles.fileThumb} /> : <View style={styles.fileIcon}><FileText size={14} color={colors.primary} /></View>}<View style={{ flex: 1 }}><Text style={styles.fileName} numberOfLines={1}>{file.name}</Text><Text style={styles.fileMeta}>{file.size ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : 'Hajmi aniqlanmadi'} · {file.mimeType ?? (file.image ? 'Rasm' : 'Fayl')}</Text></View><Pressable onPress={() => Alert.alert('Faylni ko‘rish', 'Fayl faqat qurilmada tanlangan, serverga yuklanmagan.')}><Eye size={14} color={colors.muted} /></Pressable><Pressable onPress={() => setFiles((current) => current.filter((_, fileIndex) => fileIndex !== index))} hitSlop={8}><Trash2 size={14} color={colors.danger} /></Pressable></View>)}
      {files.length ? <Text style={styles.filesCount}>{files.length}/5 ta fayl biriktirildi</Text> : <Text style={styles.localNotice}>5 tagacha hujjat · fayllar yuborishgacha qurilmada qoladi</Text>}
    </Card>

    <Card style={styles.section}><SectionTitle title="Hujjat turi va yo‘nalishi" subtitle="Ekspertizani aniqlashtiring" /><View style={styles.types}>{documentTypes.map((item) => <Pill key={item} label={item} selected={type === item} onPress={() => setType(item)} />)}</View></Card>
    <Card style={styles.section}><View style={styles.questionHeader}><SectionTitle title="Muammo va savollaringiz" /><Text style={styles.count}>{description.length}/1000</Text></View><TextInput value={description} onChangeText={setDescription} multiline maxLength={1000} placeholder="Hujjat bo‘yicha nimalarni tekshirtirmoqchisiz?" placeholderTextColor="#95A2B0" textAlignVertical="top" style={styles.textarea} /><Text style={styles.helpText}>Advokat tekshirishi lozim bo‘lgan bandlar yoki savollaringizni yozing.</Text></Card>
    <Card style={styles.section}><SectionTitle title="Biriktirilgan advokat" action="Boshqa tanlash" onAction={chooseLawyer} /><View style={styles.lawyerRow}><Avatar initials={lawyer.initials} color={lawyer.avatarColor} size={40} /><View style={{ flex: 1 }}><Text style={styles.lawyerName}>{lawyer.name}</Text><Text style={styles.lawyerTitle}>{lawyer.title}</Text><Text style={styles.license}>Demo litsenziya: {lawyer.license}</Text></View><View style={styles.rating}><Star size={11} color={colors.secondary} fill={colors.secondary} /><Text style={styles.ratingText}>{lawyer.rating.toFixed(2)}</Text></View></View></Card>
    <Card style={styles.section}><SectionTitle title="Ekspertiza qiymati va muddati" /><InfoLine icon={Clock3} title="Muddat: 24 soat ichida" detail="Demo baholash muddati, haqiqiy xizmatda kelishiladi." /><InfoLine icon={FileCheck2} title="Xulosa to‘plami tarkibi" detail="Yozma xulosa · bandlar tahlili · tavsiya va tuzatishlar" /><View style={styles.guarantee}><ShieldCheck size={14} color={colors.primary} /><Text style={styles.guaranteeText}>Haqiqiy topshirishda maxfiylik shartlari va fayllarni saqlash siyosati backendda ta’minlanishi kerak.</Text></View></Card>
    <View style={styles.disclaimer}><LockKeyhole size={12} color={colors.primary} /><Text style={styles.disclaimerText}>Demo rejimida hujjat serverga uzatilmaydi, to‘lov bajarilmaydi.</Text></View>
  </Page><View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) + 8 }]}><View><Text style={styles.totalLabel}>DEMO TO‘LOV QIYMATI</Text><Text style={styles.total}>{formatMoney(price)}</Text></View><ActionButton title="Tekshirishga yuborish" icon={ArrowRight} variant="amber" onPress={submit} /></View></View>
}

function Step({ number, label, active }: { number: string; label: string; active?: boolean }) { return <View style={styles.step}><View style={[styles.stepNumber, active && styles.stepActive]}><Text style={[styles.stepNumberText, active && { color: '#fff' }]}>{number}</Text></View><Text style={[styles.stepLabel, active && { color: colors.primary }]}>{label}</Text></View> }
function InfoLine({ icon: Icon, title, detail }: { icon: LucideIcon; title: string; detail: string }) { return <View style={styles.infoLine}><View style={styles.infoIcon}><Icon size={14} color={colors.primary} /></View><View style={{ flex: 1 }}><Text style={styles.infoTitle}>{title}</Text><Text style={styles.infoText}>{detail}</Text></View></View> }

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  steps: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 6, paddingVertical: 5 },
  step: { alignItems: 'center', gap: 4 },
  stepNumber: { width: 21, height: 21, borderRadius: 11, alignItems: 'center', justifyContent: 'center', backgroundColor: '#E8EDF2' },
  stepActive: { backgroundColor: colors.primary },
  stepNumberText: { color: '#7D8B9A', fontFamily: fonts.bold, fontSize: 8 },
  stepLabel: { color: colors.muted, fontFamily: fonts.medium, fontSize: 7 },
  stepLine: { flex: 1, height: 2, marginHorizontal: 4, marginTop: -13, backgroundColor: '#E1E8EE' },
  section: { gap: 9, padding: 10 },
  dropzone: { minHeight: 94, alignItems: 'center', justifyContent: 'center', gap: 5, borderWidth: 1, borderStyle: 'dashed', borderColor: '#BFD1E0', borderRadius: 11, backgroundColor: '#F0F6FD' },
  uploadIcon: { width: 30, height: 30, borderRadius: 9, alignItems: 'center', justifyContent: 'center', backgroundColor: '#DDEBF7' },
  dropTitle: { color: '#47617A', fontFamily: fonts.semibold, fontSize: 9 },
  dropHint: { color: colors.muted, fontFamily: fonts.body, fontSize: 7 },
  uploadActions: { flexDirection: 'row', gap: 6 },
  fileItem: { flexDirection: 'row', alignItems: 'center', gap: 7, minHeight: 43, padding: 6, borderWidth: 1, borderColor: colors.line, borderRadius: 8, backgroundColor: '#FAFBFC' },
  fileIcon: { width: 29, height: 31, borderRadius: 7, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primaryLight },
  fileThumb: { width: 31, height: 31, borderRadius: 7 },
  fileName: { color: '#445B72', fontFamily: fonts.semibold, fontSize: 8 },
  fileMeta: { color: colors.muted, fontFamily: fonts.body, fontSize: 7, marginTop: 3 },
  localNotice: { color: colors.muted, fontFamily: fonts.body, fontSize: 7, textAlign: 'center' },
  filesCount: { color: colors.primary, fontFamily: fonts.medium, fontSize: 7 },
  types: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  questionHeader: { flexDirection: 'row', alignItems: 'center' },
  count: { color: colors.muted, fontFamily: fonts.body, fontSize: 7 },
  textarea: { minHeight: 75, padding: 9, borderRadius: 8, borderWidth: 1, borderColor: colors.line, color: colors.text, backgroundColor: '#F9FAFC', fontFamily: fonts.body, fontSize: 8, lineHeight: 14 },
  helpText: { color: colors.muted, fontFamily: fonts.body, fontSize: 7, lineHeight: 11 },
  lawyerRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  lawyerName: { color: colors.text, fontFamily: fonts.heading, fontSize: 9 },
  lawyerTitle: { color: colors.muted, fontFamily: fonts.body, fontSize: 7, marginTop: 2 },
  license: { color: colors.muted, fontFamily: fonts.body, fontSize: 6, marginTop: 3 },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  ratingText: { color: colors.text, fontFamily: fonts.semibold, fontSize: 8 },
  infoLine: { flexDirection: 'row', alignItems: 'flex-start', gap: 7 },
  infoIcon: { width: 24, height: 24, borderRadius: 7, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primaryLight },
  infoTitle: { color: colors.text, fontFamily: fonts.semibold, fontSize: 8 },
  infoText: { color: colors.muted, fontFamily: fonts.body, fontSize: 7, lineHeight: 11, marginTop: 2 },
  guarantee: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, padding: 8, borderRadius: 7, backgroundColor: '#F2F5F8' },
  guaranteeText: { flex: 1, color: '#6F8091', fontFamily: fonts.body, fontSize: 7, lineHeight: 11 },
  disclaimer: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 3 },
  disclaimerText: { flex: 1, color: colors.muted, fontFamily: fonts.body, fontSize: 7 },
  bottomBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 10, borderTopWidth: 1, borderColor: colors.line, backgroundColor: '#fff' },
  totalLabel: { color: '#8C99A7', fontFamily: fonts.semibold, fontSize: 6 },
  total: { color: colors.primary, fontFamily: fonts.headingExtra, fontSize: 12, marginTop: 3 },
})
