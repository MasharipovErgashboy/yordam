import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform, Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../components/ScreenContainer';
import BottomNav from '../components/BottomNav';
import { useNavigation } from '@react-navigation/native';

// ─── COLORS ─────────────────────────────────────────────────
const C = {
  primary: '#2563EB',
  secondary: '#0F172A',
  bg: '#F1F5FB',
  white: '#FFFFFF',
  textDark: '#0F172A',
  textGrey: '#64748B',
  blueLight: '#DBEAFE',
  green: '#22C55E',
  greenLight: '#DCFCE7',
  orange: '#F97316',
  orangeLight: '#FFEDD5',
  red: '#EF4444',
  redLight: '#FEE2E2',
};

// ─── QUICK SUGGESTIONS ───────────────────────────────────────
const SUGGESTIONS = [
  "Telefonim kafolati qachon tugaydi?",
  "Ijara shartnomasi shartlari qanday?",
  "Depozit pulini qaytarib olish qoidalari?",
  "Kafolat bo'yicha qayerga murojaat qilish kerak?",
  "Sug'urta muddati qachon tugaydi?",
  "Hujjatlarim yuridik kuchga egami?",
];

type Message = {
  id: string;
  role: 'user' | 'ai';
  text: string;
  time: string;
  seen?: boolean;
  accuracy?: string | null;
  docRef?: string | null;
  card?: any;
};

// ─── INITIAL CHAT ─────────────────────────────────────────────
const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'user',
    text: "Telefonim kafolati qachon tugaydi va qayerga murojaat qilishim kerak?",
    time: '14:30',
    seen: true,
  },
  {
    id: '2',
    role: 'ai',
    text: "Sizning Samsung Galaxy S24 Ultra telefoningiz kafolati 2025-yil 25-mayda (5 kundan keyin) tugaydi.\n\nKafolat talomiga muvofiq, rasmiy servis markazi MediaPark Toshkent (Shayxontohur filiali) hisoblanadi. Shoshilinch talimosa va bepul diagnostika huquqingiz mavjud.",
    time: '14:32',
    accuracy: '99.8%',
    docRef: 'Samsung S24 Ultra xarid cheki.pdf',
    card: null,
  },
  {
    id: '3',
    role: 'user',
    text: "Ijara shartnomam bo'yicha depozit pulini qaytarib olish qoidalari qanday?",
    time: '14:35',
    seen: true,
  },
  {
    id: '4',
    role: 'ai',
    text: '',
    time: '14:36',
    accuracy: null,
    docRef: 'Kvartira_Ijara_Shartnomasi.pdf',
    card: {
      type: 'Shartnoma Huquqshunoslik',
      badge: 'Rasmiy akt',
      body: "Kvartira ijara shartnomangizning 4.2-bandiga ko'ra, 10,000,000 UZS miqdoridagi depozit mablag'i mulk topshirilgandan 3 ish kuni ichida to'liq qaytarilishi shart.",
      highlights: ['4.2-bandiga', '10,000,000 UZS', '3 ish kuni'],
      requirement: "Talab: Ko'chmas mulk va jihozlarga moddiy zarar yetkazilmaganlik to'g'risida qabul-topshirish dalolatnomasi imzolanishi lozim.",
      action: 'Eslatma yuborish',
    },
  },
];

// ─── COMPONENT ───────────────────────────────────────────────
export default function AIScreen() {
  const navigation = useNavigation<any>();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const scrollRef = useRef<any>(null);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, () => {
      setKeyboardVisible(true);
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 150);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const sendMessage = (text?: string) => {
    const q = text || input.trim();
    if (!q) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: q,
      time: new Date().toLocaleTimeString('uz', { hour: '2-digit', minute: '2-digit' }),
      seen: false,
    };
    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'ai',
      text: 'Hujjatlaringiz tahlil qilinmoqda... Javob tayyorlanmoqda.',
      time: new Date().toLocaleTimeString('uz', { hour: '2-digit', minute: '2-digit' }),
      accuracy: '99.5%',
      docRef: null,
      card: null,
    };
    setMessages(prev => [...prev, userMsg, aiMsg]);
    setInput('');
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 300);
  };

  const highlightText = (text: string, highlights: string[]) => {
    // Simple highlight – split and color
    return <Text style={styles.cardBody}>{text.split(' ').map((word, i) => {
      const isH = highlights.some(h => text.includes(h) && h.includes(word.replace(/[.,]/g, '')));
      return <Text key={i} style={isH ? styles.cardHighlight : {}}>{word} </Text>;
    })}</Text>;
  };

  return (
    <ScreenContainer style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      >

        {/* ── HEADER ── */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={C.textDark} />
          </TouchableOpacity>
          <View style={styles.logoBox}>
            <Ionicons name="sparkles" size={16} color={C.primary} />
          </View>
          <View>
            <Text style={styles.appName}>AI Yordamchi</Text>
            <Text style={styles.appSub}>Hujjatlar hamyoni</Text>
          </View>
          <View style={{ flex: 1 }} />
          <View style={styles.securityBadge}>
            <Ionicons name="shield-checkmark-outline" size={18} color={C.primary} />
          </View>
        </View>

        {/* ── CHAT AREA ── */}
        <ScrollView
          ref={scrollRef}
          style={styles.chatArea}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map(msg => (
            <View key={msg.id}>
              {/* USER message */}
              {msg.role === 'user' && (
                <View style={styles.userMsgRow}>
                  <View style={styles.userBubble}>
                    <Text style={styles.userBubbleText}>{msg.text}</Text>
                    <Text style={styles.msgTime}>{msg.time} {msg.seen ? '✓✓' : '✓'}</Text>
                  </View>
                </View>
              )}

              {/* AI message */}
              {msg.role === 'ai' && (
                <View style={styles.aiMsgRow}>
                  <View style={styles.aiAvatar}>
                    <Ionicons name="sparkles" size={16} color={C.primary} />
                  </View>
                  <View style={styles.aiMsgBody}>
                    {/* Accuracy badge */}
                    {msg.accuracy && (
                      <View style={styles.accuracyBadge}>
                        <Text style={styles.accuracyText}>⬤ {msg.accuracy} aniqlik</Text>
                        <Text style={styles.aiTag}> • Aqlli Tahlilchi</Text>
                      </View>
                    )}

                    {/* Regular text */}
                    {!!msg.text && (
                      <View style={styles.aiBubble}>
                        <Text style={styles.aiBubbleText}>{msg.text}</Text>
                      </View>
                    )}

                    {/* Doc reference */}
                    {msg.docRef && (
                      <TouchableOpacity style={styles.docRefCard} onPress={() => navigation.navigate('Documents')}>
                        <Ionicons name="document-text-outline" size={16} color={C.primary} />
                        <Text style={styles.docRefText}>{msg.docRef}</Text>
                        <Ionicons name="arrow-forward" size={14} color={C.primary} />
                      </TouchableOpacity>
                    )}

                    {/* Legal card */}
                    {msg.card && (
                      <View style={styles.legalCard}>
                        <View style={styles.legalHeader}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Ionicons name="clipboard-outline" size={15} color={C.textDark} />
                            <Text style={styles.legalTitle}>{msg.card.type}</Text>
                          </View>
                          <View style={styles.legalBadge}>
                            <Text style={styles.legalBadgeText}>{msg.card.badge}</Text>
                          </View>
                        </View>
                        <Text style={styles.cardBody}>{msg.card.body.split('10,000,000 UZS').map((part: string, i: number) =>
                          i === 0
                            ? <Text key={i}>{part}<Text style={styles.cardHighlight}>10,000,000 UZS</Text></Text>
                            : <Text key={i}>{part}</Text>
                        )}</Text>
                        <View style={styles.requirementBox}>
                          <Ionicons name="alert-circle-outline" size={16} color="#92400E" style={{ marginTop: 1 }} />
                          <Text style={styles.requirementText}>{msg.card.requirement}</Text>
                        </View>
                        {msg.docRef && (
                          <TouchableOpacity style={styles.attachmentRow}>
                            <Ionicons name="document-attach-outline" size={16} color={C.textDark} />
                            <Text style={styles.attachText}>{msg.docRef}</Text>
                            <Text style={styles.attachMeta}>3-sahifa, 4-bm • Notarial tasdiq</Text>
                          </TouchableOpacity>
                        )}
                        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Reminders')}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Ionicons name="notifications-outline" size={16} color={C.white} />
                            <Text style={styles.actionBtnText}>{msg.card.action}</Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    )}

                    <Text style={styles.msgTime}>Aqlli assistent • {msg.time}</Text>
                  </View>
                </View>
              )}
            </View>
          ))}
        </ScrollView>

        {/* ── QUICK SUGGESTIONS (HORIZONTAL) ── */}
        <View style={styles.bottomSuggestionsWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestionsScrollContent}
          >
            {SUGGESTIONS.map((s, i) => (
              <TouchableOpacity key={i} style={styles.suggestionChip} onPress={() => sendMessage(s)}>
                <Ionicons name="sparkles" size={12} color={C.primary} style={{ marginRight: 4 }} />
                <Text style={styles.suggestionText}>{s}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ── INPUT ── */}
        <View style={[styles.inputRow, isKeyboardVisible && styles.inputRowKeyboard]}>
          <TextInput
            style={styles.input}
            placeholder="Hujjatlaringiz bo'yicha biror savol bering..."
            placeholderTextColor={C.textGrey}
            value={input}
            onChangeText={setInput}
            multiline
          />
          <TouchableOpacity style={styles.micBtn}>
            <Ionicons name="mic-outline" size={20} color={C.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.sendBtn} onPress={() => sendMessage()}>
            <Ionicons name="arrow-up" size={18} color={C.white} />
          </TouchableOpacity>
        </View>

        {/* ── BOTTOM NAV (Hidden when keyboard is active) ── */}
        {!isKeyboardVisible && <BottomNav activeScreen="AI" />}
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

// ─── STYLES ──────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },

  // Header
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 10, paddingBottom: 8, gap: 10 },
  backBtn: { paddingRight: 4 },
  backArrow: { fontSize: 28, color: C.textDark, fontWeight: '300' },
  logoBox: { width: 30, height: 30, borderRadius: 8, backgroundColor: C.blueLight, alignItems: 'center', justifyContent: 'center' },
  appName: { fontSize: 13, fontWeight: '700', color: C.textDark },
  appSub: { fontSize: 11, color: C.textGrey },
  securityBadge: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#E0F2FE', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#BAE6FD' },
  securityIcon: { fontSize: 18 },

  // Chat
  chatArea: { flex: 1 },
  chatContent: { paddingHorizontal: 14, paddingBottom: 10 },

  // User bubble
  userMsgRow: { alignItems: 'flex-end', marginBottom: 12 },
  userBubble: { backgroundColor: C.primary, borderRadius: 18, borderBottomRightRadius: 4, padding: 12, maxWidth: '80%' },
  userBubbleText: { fontSize: 14, color: C.white, lineHeight: 20 },

  // AI bubble
  aiMsgRow: { flexDirection: 'row', marginBottom: 12, gap: 8 },
  aiAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: C.blueLight, alignItems: 'center', justifyContent: 'center' },
  aiMsgBody: { flex: 1 },
  accuracyBadge: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  accuracyText: { fontSize: 12, color: C.green, fontWeight: '700' },
  aiTag: { fontSize: 12, color: C.textGrey },
  aiBubble: { backgroundColor: C.white, borderRadius: 18, borderBottomLeftRadius: 4, padding: 12, elevation: 1, marginBottom: 6 },
  aiBubbleText: { fontSize: 13, color: C.textDark, lineHeight: 20 },

  // Doc ref
  docRefCard: { flexDirection: 'row', backgroundColor: C.blueLight, borderRadius: 10, padding: 8, alignItems: 'center', gap: 8, marginBottom: 6 },
  docRefIcon: { fontSize: 18 },
  docRefText: { flex: 1, fontSize: 12, color: C.primary, fontWeight: '600' },
  docRefArrow: { fontSize: 16, color: C.primary },

  // Legal card
  legalCard: { backgroundColor: C.white, borderRadius: 16, padding: 14, elevation: 2, marginBottom: 6 },
  legalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  legalTitle: { fontSize: 14, fontWeight: '700', color: C.textDark },
  legalBadge: { backgroundColor: C.greenLight, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  legalBadgeText: { fontSize: 11, color: C.green, fontWeight: '700' },
  cardBody: { fontSize: 13, color: C.textDark, lineHeight: 20, marginBottom: 10 },
  cardHighlight: { color: C.primary, fontWeight: '800' },
  requirementBox: { flexDirection: 'row', backgroundColor: C.orangeLight, borderRadius: 10, padding: 10, gap: 8, alignItems: 'flex-start', marginBottom: 10 },
  requirementIcon: { fontSize: 16 },
  requirementText: { flex: 1, fontSize: 12, color: '#92400E', lineHeight: 18 },
  attachmentRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.bg, borderRadius: 10, padding: 8, gap: 8, marginBottom: 10 },
  attachIcon: { fontSize: 18 },
  attachText: { fontSize: 12, fontWeight: '600', color: C.textDark },
  attachMeta: { fontSize: 11, color: C.textGrey },
  actionBtn: { backgroundColor: C.primary, borderRadius: 12, padding: 10, alignItems: 'center' },
  actionBtnText: { fontSize: 13, color: C.white, fontWeight: '700' },

  msgTime: { fontSize: 11, color: C.textGrey, marginTop: 4 },

  // Safety replaced by bottom suggestions
  bottomSuggestionsWrapper: { paddingVertical: 6 },
  suggestionsScrollContent: { paddingHorizontal: 14, gap: 8, alignItems: 'center' },
  suggestionChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.white, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, elevation: 1, borderWidth: 1, borderColor: '#E2E8F0' },
  suggestionSparkle: { fontSize: 12, color: C.primary, fontWeight: '700' },
  suggestionText: { fontSize: 12, color: '#1E293B', fontWeight: '500' },

  // Input
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.white,
    marginHorizontal: 14,
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 6,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    marginBottom: 16,
    gap: 8,
  },
  inputRowKeyboard: {
    marginBottom: 6,
  },
  input: { flex: 1, fontSize: 14, color: C.textDark, maxHeight: 100, paddingVertical: 6 },
  micBtn: { padding: 6 },
  sendBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  sendIcon: { fontSize: 18, color: C.white, fontWeight: '700' },
});