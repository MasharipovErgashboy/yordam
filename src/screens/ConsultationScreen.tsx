import { useMemo, useState } from 'react'
import { Alert, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import * as DocumentPicker from 'expo-document-picker'
import { router, useLocalSearchParams } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Check, FileText, Image as ImageIcon, LockKeyhole, Mic, MicOff, Phone, PhoneOff, Send, ShieldCheck, Speaker, Star, Video, VideoOff } from 'lucide-react-native'

const FEMALE_LAWYER_VIDEO_IMAGE = require('../../assets/images/lawyer-female-call.jpg')

import { Avatar, Header } from '@/components/native-ui'
import { colors, fonts, spacing } from '@/constants/tokens'
import { useAppStore } from '@/hooks/use-app-store'
import { findLawyer } from '@/utils/helpers'

 type ChatMessage = { id: string; from: 'lawyer' | 'client'; time: string; text: string; file?: string }
const initialMessages: ChatMessage[] = [
  { id: 'm1', from: 'lawyer', time: '15:32', text: 'Assalomu alaykum Alisher aka! Hujjatingizdagi shartnoma bandlarini ko‘rib chiqdim. Bir nechta tavsiyani yozib yuboryapman.', file: 'Shartnoma_tahriri_demo.pdf' },
  { id: 'm2', from: 'client', time: '15:34', text: 'Katta rahmat, hozir ko‘rib chiqaman. Kadastr bo‘yicha ham savolim bor edi.' },
]

export default function ConsultationScreen() {
  const insets = useSafeAreaInsets()
  const { id } = useLocalSearchParams<{ id: string }>()
  const { requests, updateRequest } = useAppStore()
  const request = requests.find((item) => item.id === id) ?? requests[0]
  const lawyer = findLawyer(request?.lawyerId)
  const [messages, setMessages] = useState(initialMessages)
  const [draft, setDraft] = useState('')
  const [callActive, setCallActive] = useState(false)
  const [muted, setMuted] = useState(false)
  const [camera, setCamera] = useState(true)
  const [speaker, setSpeaker] = useState(true)

  function startCall(withVideo: boolean) {
    setCamera(withVideo)
    setCallActive(true)
  }

  function send(text = draft) {
    const value = text.trim()
    if (!value) return
    const now = new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
    setMessages((current) => [...current, { id: `${Date.now()}`, from: 'client', time: now, text: value }])
    setDraft('')
  }

  async function attachDocument() {
    const result = await DocumentPicker.getDocumentAsync({ type: '*/*', multiple: false, copyToCacheDirectory: true })
    if (!result.canceled) {
      const file = result.assets[0]
      setMessages((current) => [...current, { id: `${Date.now()}`, from: 'client', time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }), text: 'Hujjat biriktirildi', file: file.name }])
    }
  }

  function endCall() {
    Alert.alert(
      'Qo‘ng‘iroqni yakunlaysizmi?',
      'Qo‘ng‘iroqni tugatib chatda davom etishingiz yoki konsultatsiyani yakunlashingiz mumkin.',
      [
        { text: 'Bekor qilish', style: 'cancel' },
        { text: 'Qo‘ng‘iroqni uzish', onPress: () => setCallActive(false) },
        { text: 'Konsultatsiyani yakunlash', style: 'destructive', onPress: () => { if (request) updateRequest(request.id, { status: 'Yakunlangan' }); router.replace({ pathname: '/review', params: { lawyerId: request?.lawyerId ?? '11' } }) } },
      ],
    )
  }

  const initials = useMemo(() => lawyer?.initials ?? 'SR', [lawyer])

  return <View style={styles.screen}><Header title="Jonli konsultatsiya" onBack={() => router.back()} /><KeyboardAvoidingView style={styles.body} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={4}>
    <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <View style={styles.lawyerBanner}><Avatar initials={initials} color={lawyer?.avatarColor} size={38} /><View style={{ flex: 1, minWidth: 0 }}><View style={styles.lawyerNameLine}><Text style={styles.lawyerName} numberOfLines={1}>{request?.lawyerName ?? 'Shahnoza Rahimova'}</Text><Star size={11} color={colors.secondary} fill={colors.secondary} /></View><Text style={styles.lawyerSub}>{callActive ? '● Jonli aloqa faol · demo xona' : '● Aloqaga tayyor · qo‘ng‘iroq qilinmagan'}</Text></View><View style={styles.secureTag}><LockKeyhole size={10} color={colors.primary} /><Text style={styles.secureText}>TLS demo</Text></View></View>
      {callActive ? (
        <View style={styles.videoStage}>
          <View style={styles.videoHeader}>
            <View style={styles.liveTag}><View style={styles.liveDot} /><Text style={styles.liveText}>{camera ? 'VIDEO DEMO' : 'AUDIO DEMO'}</Text></View>
            <View style={styles.timeTag}><LockKeyhole size={10} color={colors.primary} /><Text style={styles.timeLeft}>24:17 qoldi</Text></View>
          </View>
          <View style={styles.videoScene}>
            {camera ? (
              <View style={styles.videoFeedWrap}>
                {/* TODO: Keyinchalik backenddan keladigan konsultant jinsi va rasmiga qarab dinamik almashtiriladi */}
                <Image source={FEMALE_LAWYER_VIDEO_IMAGE} style={styles.videoFeedImage} resizeMode="cover" />
                <View style={styles.personLabelBadge}>
                  <View style={styles.personOnlineDot} />
                  <Text style={styles.personName}>{request?.lawyerName ?? 'Shahnoza Rahimova'}</Text>
                </View>
              </View>
            ) : (
              <View style={styles.cameraOff}>
                <Avatar initials={initials} color={lawyer?.avatarColor} size={64} />
                <Text style={styles.cameraOffText}>Kamera o‘chirilgan</Text>
              </View>
            )}
            <View style={styles.selfView}><Text style={styles.selfInitial}>AQ</Text><Text style={styles.selfLabel}>Siz</Text></View>
          </View>
          <View style={styles.controls}>
            <Pressable accessibilityRole="button" accessibilityLabel={muted ? 'Mikrofonni yoqish' : 'Mikrofonni o‘chirish'} onPress={() => setMuted(!muted)} style={[styles.control, muted && styles.controlOff]}>{muted ? <MicOff size={17} color="#fff" /> : <Mic size={17} color="#fff" />}</Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel={camera ? 'Kamerani o‘chirish' : 'Kamerani yoqish'} onPress={() => setCamera(!camera)} style={[styles.control, !camera && styles.controlOff]}>{camera ? <Video size={18} color="#fff" /> : <VideoOff size={18} color="#fff" />}</Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel={speaker ? 'Ovozni o‘chirish' : 'Ovozni yoqish'} onPress={() => setSpeaker(!speaker)} style={[styles.control, !speaker && styles.controlOff]}><Speaker size={18} color="#fff" /></Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="Qo‘ng‘iroqni yakunlash" onPress={endCall} style={styles.hangup}><PhoneOff size={17} color="#fff" /></Pressable>
          </View>
        </View>
      ) : (
        <View style={styles.idleStage}>
          {/* TODO: Keyinchalik backenddan keladigan konsultant jinsi va rasmiga qarab dinamik almashtiriladi */}
          <Image source={FEMALE_LAWYER_VIDEO_IMAGE} style={styles.idleBackdropImage} resizeMode="cover" blurRadius={6} />
          <View style={styles.idleBackdropOverlay} />
          <View style={styles.idleTop}>
            <View style={styles.readyTag}><View style={styles.readyDot} /><Text style={styles.readyText}>ALOQAGA TAYYOR</Text></View>
            <View style={styles.timeTag}><LockKeyhole size={10} color={colors.primary} /><Text style={styles.timeLeft}>45 daqiqa</Text></View>
          </View>
          <View style={styles.idleCenter}>
            <Avatar initials={initials} color={lawyer?.avatarColor} size={58} />
            <Text style={styles.idleTitle}>{request?.lawyerName ?? 'Shahnoza Rahimova'}</Text>
            <Text style={styles.idleSub}>Hali qo‘ng‘iroq boshlanmagan. Audio yoki video aloqani boshlang.</Text>
            <View style={styles.callButtons}>
              <Pressable accessibilityRole="button" accessibilityLabel="Audio qo‘ng‘iroq qilish" onPress={() => startCall(false)} style={({ pressed }) => [styles.audioCallBtn, pressed && { opacity: 0.85 }]}>
                <Phone size={15} color="#fff" />
                <Text style={styles.callBtnText} numberOfLines={1}>Qo‘ng‘iroq qilish</Text>
              </Pressable>
              <Pressable accessibilityRole="button" accessibilityLabel="Video qo‘ng‘iroq qilish" onPress={() => startCall(true)} style={({ pressed }) => [styles.videoCallBtn, pressed && { opacity: 0.85 }]}>
                <Video size={16} color="#fff" />
                <Text style={styles.callBtnText} numberOfLines={1}>Video qo‘ng‘iroq</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
      <View style={styles.secureChannel}><LockKeyhole size={10} color={colors.primary} /><Text style={styles.secureChannelText}>Shifrlangan demo kanal · Murojaat {request?.id}</Text></View>
      <View style={styles.messages}>{messages.map((message) => <View key={message.id} style={[styles.messageWrap, message.from === 'client' && styles.clientWrap]}>{message.from === 'lawyer' ? <Text style={styles.sender}>{request?.lawyerName ?? 'Shahnoza Rahimova'} · {message.time}</Text> : null}<View style={[styles.bubble, message.from === 'client' ? styles.clientBubble : styles.lawyerBubble]}><Text style={[styles.messageText, message.from === 'client' && styles.clientText]}>{message.text}</Text>{message.file ? <Pressable onPress={() => Alert.alert('Demo fayl', 'Fayl mobil demo ichida tanlangan yoki namunaviy.') } style={styles.attachment}><View style={styles.pdf}><FileText size={15} color="#fff" /></View><View style={{ flex: 1 }}><Text style={styles.fileName}>{message.file}</Text><Text style={styles.fileMeta}>Namuna fayl · serverga yuborilmagan</Text></View><Check size={12} color={colors.tertiary} /></Pressable> : null}{message.from === 'client' ? <Text style={styles.messageTime}>{message.time}  ✓✓</Text> : null}</View></View>)}</View>
      <View style={styles.quickReplies}><Pressable style={styles.quickReply} onPress={() => send('Tushundim, rahmat!')}><Text style={styles.quickReplyText}>👍 Tushundim, rahmat</Text></Pressable><Pressable style={styles.quickReply} onPress={() => send('Kadastr faylini jo‘nataman.')}><Text style={styles.quickReplyText}>📄 Kadastrni yuboraymi?</Text></Pressable></View>
      <View style={styles.demoNote}><ShieldCheck size={13} color={colors.primary} /><Text style={styles.demoNoteText}>Video/ovoz aloqasi hali media backendiga ulanmagan. Ko‘rsatilgan video oynasi — interfeys demosi.</Text></View>
    </ScrollView>
    <View style={[styles.composer, { paddingBottom: Math.max(insets.bottom, 16) + 10 }]}><Pressable accessibilityRole="button" accessibilityLabel="Fayl biriktirish" onPress={attachDocument} style={styles.attach}><FileText size={17} color={colors.primary} /></Pressable><TextInput value={draft} onChangeText={setDraft} placeholder="Xabar yozing..." placeholderTextColor="#93A0AE" returnKeyType="send" onSubmitEditing={() => send()} style={styles.input} /><Pressable accessibilityRole="button" accessibilityLabel="Rasm biriktirish" onPress={attachDocument} style={styles.media}><ImageIcon size={16} color={colors.muted} /></Pressable><Pressable accessibilityRole="button" accessibilityLabel="Ovozli xabar" onPress={() => Alert.alert('Ovozli xabar', 'Ovoz yozish servisi ulanmagan.')} style={styles.media}><Mic size={16} color={colors.muted} /></Pressable><Pressable accessibilityRole="button" accessibilityLabel="Xabar yuborish" onPress={() => send()} style={styles.send}><Send size={16} color="#fff" /></Pressable></View>
  </KeyboardAvoidingView></View>
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  body: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: 10, gap: 10 },
  lawyerBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10, borderRadius: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.line },
  lawyerName: { color: colors.text, fontFamily: fonts.heading, fontSize: 13.5, flexShrink: 1 },
  lawyerNameLine: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  lawyerSub: { color: colors.tertiary, fontFamily: fonts.medium, fontSize: 11, marginTop: 2 },
  secureTag: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 99, backgroundColor: colors.primaryLight, flexShrink: 0 },
  secureText: { color: colors.primary, fontFamily: fonts.semibold, fontSize: 10.5 },
  videoStage: { overflow: 'hidden', borderRadius: 15, backgroundColor: '#1B303F', minHeight: 235 },
  idleStage: { position: 'relative', overflow: 'hidden', borderRadius: 15, backgroundColor: '#13314A', padding: 12, gap: 14, minHeight: 225, justifyContent: 'space-between' },
  idleBackdropImage: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, width: '100%', height: '100%', opacity: 0.55 },
  idleBackdropOverlay: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: '#0E2438A6' },
  idleTop: { zIndex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  readyTag: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 7, backgroundColor: '#FFFFFF24' },
  readyDot: { width: 6, height: 6, borderRadius: 4, backgroundColor: '#4ED392' },
  readyText: { color: '#DCEBFA', fontFamily: fonts.bold, fontSize: 10.5 },
  idleCenter: { zIndex: 2, alignItems: 'center', gap: 8, paddingVertical: 8 },
  idleTitle: { color: '#fff', fontFamily: fonts.heading, fontSize: 16, textAlign: 'center' },
  idleSub: { color: '#BFD5E8', fontFamily: fonts.body, fontSize: 12, lineHeight: 17, textAlign: 'center', maxWidth: 280 },
  callButtons: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginTop: 6, width: '100%' },
  audioCallBtn: { minHeight: 42, paddingHorizontal: 15, paddingVertical: 9, borderRadius: 11, backgroundColor: '#1F9D68', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, flexGrow: 1, minWidth: 140 },
  videoCallBtn: { minHeight: 42, paddingHorizontal: 15, paddingVertical: 9, borderRadius: 11, backgroundColor: '#1775C2', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, flexGrow: 1, minWidth: 140 },
  callBtnText: { color: '#fff', fontFamily: fonts.semibold, fontSize: 13 },
  videoHeader: { position: 'absolute', zIndex: 4, top: 8, right: 8, left: 8, flexDirection: 'row', justifyContent: 'space-between' },
  liveTag: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 7, backgroundColor: '#17374CCF' },
  liveDot: { width: 6, height: 6, borderRadius: 4, backgroundColor: '#EF4C4D' },
  liveText: { color: '#fff', fontFamily: fonts.bold, fontSize: 10.5 },
  timeTag: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 7, backgroundColor: '#FFFFFFE8' },
  timeLeft: { color: colors.primary, fontFamily: fonts.semibold, fontSize: 11 },
  videoScene: { flex: 1, minHeight: 235, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1B303F' },
  videoFeedWrap: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 },
  videoFeedImage: { width: '100%', height: '100%' },
  personLabelBadge: { position: 'absolute', left: 9, bottom: 54, flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 7, backgroundColor: '#102B40CC' },
  personOnlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#4ED392' },
  personName: { color: '#fff', fontFamily: fonts.semibold, fontSize: 11.5 },
  selfView: { position: 'absolute', zIndex: 4, right: 8, bottom: 49, width: 82, height: 72, alignItems: 'center', justifyContent: 'center', borderRadius: 9, backgroundColor: '#9B8C78', borderWidth: 1, borderColor: '#FFFFFF88' },
  selfInitial: { color: '#fff', fontFamily: fonts.headingExtra, fontSize: 15 },
  selfLabel: { position: 'absolute', bottom: 4, left: 6, color: '#fff', fontFamily: fonts.medium, fontSize: 10.5 },
  cameraOff: { alignItems: 'center', gap: 8 },
  cameraOffText: { color: '#fff', fontFamily: fonts.semibold, fontSize: 13 },
  controls: { position: 'absolute', zIndex: 4, bottom: 8, alignSelf: 'center', flexDirection: 'row', gap: 8 },
  control: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center', borderRadius: 11, backgroundColor: '#17374CE8' },
  controlOff: { backgroundColor: '#6E7F8F' },
  hangup: { width: 44, height: 38, alignItems: 'center', justifyContent: 'center', borderRadius: 11, backgroundColor: '#D9393D' },
  secureChannel: { alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 11, paddingVertical: 5, borderRadius: 99, backgroundColor: '#E8EEF4' },
  secureChannelText: { color: '#6C7F92', fontFamily: fonts.medium, fontSize: 11 },
  messages: { gap: 10 },
  messageWrap: { maxWidth: '90%', alignSelf: 'flex-start', gap: 4 },
  clientWrap: { alignSelf: 'flex-end' },
  sender: { color: colors.primary, fontFamily: fonts.semibold, fontSize: 11.5, paddingLeft: 3 },
  bubble: { padding: 11, borderRadius: 12 },
  lawyerBubble: { borderTopLeftRadius: 2, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.line },
  clientBubble: { borderTopRightRadius: 2, backgroundColor: colors.primary },
  messageText: { color: colors.text, fontFamily: fonts.body, fontSize: 13.5, lineHeight: 19 },
  clientText: { color: '#fff' },
  attachment: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8, padding: 8, borderRadius: 9, backgroundColor: '#F4F7FA' },
  pdf: { width: 28, height: 30, alignItems: 'center', justifyContent: 'center', borderRadius: 7, backgroundColor: '#D8484A' },
  fileName: { color: '#40576E', fontFamily: fonts.semibold, fontSize: 12 },
  fileMeta: { color: colors.muted, fontFamily: fonts.body, fontSize: 11, marginTop: 2 },
  messageTime: { color: '#C8D9E7', fontFamily: fonts.body, fontSize: 10.5, textAlign: 'right', marginTop: 5 },
  quickReplies: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  quickReply: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 99, borderWidth: 1, borderColor: colors.line, backgroundColor: '#fff' },
  quickReplyText: { color: '#4C637B', fontFamily: fonts.medium, fontSize: 12 },
  demoNote: { flexDirection: 'row', alignItems: 'flex-start', gap: 7, padding: 10, borderRadius: 9, backgroundColor: '#EDF3F8' },
  demoNoteText: { flex: 1, color: '#738396', fontFamily: fonts.body, fontSize: 11.5, lineHeight: 16 },
  composer: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingTop: 8, paddingBottom: Platform.OS === 'ios' ? 8 : 9, borderTopWidth: 1, borderColor: colors.line, backgroundColor: '#fff' },
  attach: { width: 36, height: 38, alignItems: 'center', justifyContent: 'center', borderRadius: 9, backgroundColor: colors.primaryLight },
  input: { flex: 1, minHeight: 38, paddingHorizontal: 10, borderRadius: 9, backgroundColor: '#F6F8FA', color: colors.text, fontFamily: fonts.body, fontSize: 13 },
  media: { width: 32, height: 36, alignItems: 'center', justifyContent: 'center' },
  send: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center', borderRadius: 9, backgroundColor: colors.primary },
})
