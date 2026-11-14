import { useState } from 'react'
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import * as DocumentPicker from 'expo-document-picker'
import { router, useLocalSearchParams } from '../navigation/router'
import { ArrowRight, FileText, LockKeyhole, Paperclip, Trash2 } from 'lucide-react-native'

import { ActionButton, Avatar, Card, Header, Page } from '../components/native-ui'
import { colors, fonts } from '../constants/tokens'
import { useAppStore } from '../hooks/use-app-store'
import { findLawyer } from '../utils/helpers'

export default function LawyerApplicationScreen() {
  const { lawyerId } = useLocalSearchParams<{ lawyerId?: string }>()
  const lawyer = findLawyer(lawyerId)
  const { addRequest, requests } = useAppStore()
  const [message, setMessage] = useState('')
  const [file, setFile] = useState<{ name: string; uri: string } | null>(null)

  async function attachDocument() {
    const result = await DocumentPicker.getDocumentAsync({ type: '*/*', multiple: false, copyToCacheDirectory: true })
    if (!result.canceled) setFile({ name: result.assets[0].name, uri: result.assets[0].uri })
  }

  function submit() {
    if (!lawyer) return
    if (message.trim().length < 10) {
      Alert.alert('Murojaatni aniqlashtiring', 'Masalangizni kamida 10 ta belgi bilan yozing.')
      return
    }
    addRequest({ id: `APP-${requests.length + 1}`, status: 'Kutilayotgan', kind: 'Matnli chat', lawyerId: lawyer.id, lawyerName: lawyer.name, lawyerTitle: lawyer.title, subject: message.trim(), price: lawyer.price, date: 'Yangi · javob kutilmoqda', fileName: file?.name, duration: 'Javob 24 soat ichida' })
    Alert.alert('Demo murojaat yuborildi', `${lawyer.name} murojaatingizni ko‘rib chiqadi. Haqiqiy yuborish serverga ulanmagan.`, [{ text: 'Murojaatlarim', onPress: () => router.replace('/(tabs)/requests') }])
  }

  if (!lawyer) return <View style={styles.screen}><Header title="Murojaat yuborish" onBack={() => router.back()} /><View style={styles.empty}><Text style={styles.title}>Yurist topilmadi</Text><ActionButton title="Orqaga" onPress={() => router.back()} /></View></View>

  return <View style={styles.screen}><Header title="Ariza yuborish" subtitle="Yuristga murojaat" onBack={() => router.back()} /><Page contentStyle={{ paddingBottom: 18 }}>
    <Card style={styles.lawyer}><Avatar initials={lawyer.initials} color={lawyer.avatarColor} size={45} /><View style={{ flex: 1 }}><Text style={styles.name}>{lawyer.name}</Text><Text style={styles.subtitle}>{lawyer.title}</Text><Text style={styles.license}>Demo mutaxassis profili</Text></View></Card>
    <Card style={styles.form}><Text style={styles.sectionTitle}>Huquqiy masalangiz</Text><Text style={styles.sectionHint}>Yuristga vaziyatni va kerakli yordamni qisqacha tushuntiring.</Text><TextInput value={message} onChangeText={setMessage} multiline maxLength={1000} placeholder="Masalangizni yozing..." placeholderTextColor="#95A2B0" textAlignVertical="top" style={styles.textarea} /><Text style={styles.counter}>{message.length}/1000</Text><Pressable onPress={attachDocument} style={styles.attach}><Paperclip size={15} color={colors.primary} /><Text style={styles.attachText}>Hujjat biriktirish</Text><Text style={styles.attachHint}>ixtiyoriy</Text></Pressable>{file ? <View style={styles.file}><FileText size={14} color={colors.primary} /><Text style={styles.fileName} numberOfLines={1}>{file.name}</Text><Pressable onPress={() => setFile(null)}><Trash2 size={13} color={colors.danger} /></Pressable></View> : null}</Card>
    <Card style={styles.notice}><LockKeyhole size={15} color={colors.primary} /><Text style={styles.noticeText}>Demo rejimida ariza va fayl serverga yuborilmaydi. Haqiqiy murojaat uchun backend xavfsiz ulanishi kerak.</Text></Card>
    <ActionButton title="Demo murojaat yuborish" icon={ArrowRight} onPress={submit} />
  </Page></View>
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  lawyer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  name: { color: colors.text, fontFamily: fonts.heading, fontSize: 14 },
  subtitle: { color: colors.muted, fontFamily: fonts.body, fontSize: 12, marginTop: 2 },
  license: { color: colors.primary, fontFamily: fonts.medium, fontSize: 11, marginTop: 3 },
  form: { gap: 10 },
  sectionTitle: { color: colors.text, fontFamily: fonts.heading, fontSize: 15 },
  sectionHint: { color: colors.muted, fontFamily: fonts.body, fontSize: 12.5, lineHeight: 18 },
  textarea: { minHeight: 140, padding: 11, borderWidth: 1, borderColor: colors.line, borderRadius: 10, backgroundColor: '#FAFBFC', color: colors.text, fontFamily: fonts.body, fontSize: 13.5, lineHeight: 20 },
  counter: { alignSelf: 'flex-end', color: colors.muted, fontFamily: fonts.body, fontSize: 11.5 },
  attach: { flexDirection: 'row', alignItems: 'center', gap: 7, padding: 11, borderRadius: 9, backgroundColor: colors.primaryLight },
  attachText: { color: colors.primary, fontFamily: fonts.semibold, fontSize: 13 },
  attachHint: { marginLeft: 'auto', color: colors.muted, fontFamily: fonts.body, fontSize: 11.5 },
  file: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10, borderRadius: 9, borderWidth: 1, borderColor: colors.line },
  fileName: { flex: 1, color: colors.text, fontFamily: fonts.medium, fontSize: 12.5 },
  notice: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: '#EDF3F8' },
  noticeText: { flex: 1, color: '#667B91', fontFamily: fonts.body, fontSize: 12, lineHeight: 18 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  title: { color: colors.text, fontFamily: fonts.heading, fontSize: 16 },
})
