import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  BackHandler,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { BANK_HUQUQ_API_BASE_URL } from '../config/bankHuquqConfig';

const { width } = Dimensions.get('window');

type BankHuquqSubView =
  | 'home'
  | 'chat'
  | 'calculator'
  | 'contract'
  | 'analysis'
  | 'mib'
  | 'complaint'
  | 'laws'
  | 'law_detail';

interface BankHuquqScreenProps {
  onBack: () => void;
}

interface ChatMsg {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  time: string;
  steps?: string[];
  lawBasis?: string;
}

export interface LawDetailItem {
  id: string;
  title: string;
  shortDesc: string;
  badge: string;
  article: string;
  siteName: string;
  siteDomain: string;
  officialUrl: string;
  adoptedDate: string;
  stateAgency: string;
  legalStatus: string;
  keyArticles: {
    number: string;
    heading: string;
    originalQuote: string;
    explanation: string;
  }[];
  citizenRights: string[];
}

export const OFFICIAL_LAWS_DATABASE: LawDetailItem[] = [
  {
    id: 'banking_law_580',
    title: '«Banklar va bank faoliyati to‘g‘risida»gi O‘zbekiston Respublikasi Qonuni',
    shortDesc: 'Banklarning majburiyatlari, foiz va komissiyalar, kredit muddatini uzaytirish qoidalari.',
    badge: 'Qonun № O‘RQ-580',
    article: '52 va 53-moddalar',
    siteName: 'Lex.uz — Qonunchilik ma’lumotlari milliy bazasi',
    siteDomain: 'lex.uz',
    officialUrl: 'https://lex.uz/docs/4581458',
    adoptedDate: '2019-yil 5-noyabr (yangi tahriri)',
    stateAgency: 'O‘zbekiston Respublikasi Oliy Majlisi & Adliya vazirligi',
    legalStatus: 'Amalda (Rasmiy davlat manbasi)',
    keyArticles: [
      {
        number: '52-modda',
        heading: 'Kreditlar berish va ularni qaytarish shartlari',
        originalQuote:
          '«Banklar kreditlar berish shartlarini, shu jumladan foiz stavkalarini shartnomada belgilaydi. Kredit shartnomasida nazarda tutilmagan qo‘shimcha yig‘imlar va to‘lovlarni undirish taqiqlanadi.»',
        explanation:
          'Bank shartnomada ochiq-oydin ko‘rsatilmagan har qanday yashirin komissiya yoki to‘lovni fuqarodan talab qilishga qonunan haqli emas.',
      },
      {
        number: '53-modda',
        heading: 'Bank xizmatlari ko‘rsatish shartlarining shaffofligi',
        originalQuote:
          '«Bank mijozga kredit shartnomasi imzolanmasidan oldin kreditning to‘liq haqiqiy qiymati va to‘lovlar jadvalini tanishish uchun taqdim etishi shart.»',
        explanation:
          'Fuqaro kredit olishdan oldin har oy qancha to‘lashi va jami ortiqcha to‘lov qancha bo‘lishini aniq bilishga to‘la huquqlidir.',
      },
    ],
    citizenRights: [
      'Shartnoma tuzishdan oldin to‘liq hisob-kitob varaqasini talab qilish',
      'Bir tomonlama oshirilgan foiz stavkalariga e’tiroz bildirish',
      'Kreditni muddatidan oldin jarima va qo‘shimcha to‘lovlarsiz qaytarish',
      'Kredit yopilgach, bankdan qarz yo‘qligi haqida yozma ma’lumotnoma olish',
    ],
  },
  {
    id: 'mib_law_258',
    title: '«Sud hujjatlari va boshqa organlar hujjatlarini ijro etish to‘g‘risida»gi Qonun (MIB)',
    shortDesc: 'MIB undiruv chegaralari: oylikdan 50% dan ortiq mablag‘ ushlab qolinishi qat’iyan taqiqlanadi.',
    badge: 'Qonun № 258-II',
    article: '65-modda & 1-ilova',
    siteName: 'Lex.uz — Qonunchilik ma’lumotlari milliy bazasi',
    siteDomain: 'lex.uz',
    officialUrl: 'https://lex.uz/docs/40540',
    adoptedDate: '2001-yil 29-avgust',
    stateAgency: 'Majburiy ijro byurosi va O‘zbekiston Respublikasi Adliya vazirligi',
    legalStatus: 'Amalda (Rasmiy davlat manbasi)',
    keyArticles: [
      {
        number: '65-modda',
        heading: 'Qarzdorning ish haqi va boshqa daromadlaridan ushlab qolish miqdori',
        originalQuote:
          '«Ijro hujjatlari bo‘yicha talablarni qanoatlantirishda qarzdorning ish haqi va unga tenglashtirilgan to‘lovlarining ellik foizidan (50%) ortig‘i ushlab qolinishi mumkin emas.»',
        explanation:
          'Agar MIB ijrochisi yoki bank sizning plastik kartangizdan barcha oylik maoshingizni 100% yechib olgan bo‘lsa, bu 65-moddaning qo‘pol buzilishidir. Kamida 50 foizi sizda qolishi shart.',
      },
      {
        number: '1-ilova',
        heading: 'Undiruv qaratilishi mumkin bo‘lmagan mol-mulklar ro‘yxati',
        originalQuote:
          '«Qarzdor va uning qaramog‘idagi shaxslar doimiy yashashi uchun zarur bo‘lgan yagona turar joy (uy, kvartira) undiruvga qaratilishi mumkin emas (ipoteka garovi bundan mustasno).»',
        explanation:
          'Oddiy iste’mol krediti yoki kafillik qarzdorligi tufayli oilaning yagona yashash uyini tortib olish qonun bo‘yicha man etiladi.',
      },
    ],
    citizenRights: [
      'Oylik ish haqi yoki pensiyaning kamida 50 foizini o‘zida saqlab qolish',
      'Noqonuniy xatlov ustidan yuqori turuvchi ijrochiga yoki sudga 10 kun ichida shikoyat berish',
      'Qarzdorlikni oylik daromadga mutanosib ravishda bo‘lib-bo‘lib to‘lash to‘g‘risida sudga ariza kiritish',
      'Ijro harakatlarini to‘xtatib turish to‘g‘risida iltimosnoma kiritish',
    ],
  },
  {
    id: 'consumer_law_221',
    title: '«Iste’molchilarning huquqlarini himoya qilish to‘g‘risida»gi Qonun',
    shortDesc: 'Bir tomonlama foiz oshirish, yashirin komissiyalar va asossiz jarimalardan fuqaroni himoya qilish.',
    badge: 'Qonun № 221-I',
    article: '4 va 21-moddalar',
    siteName: 'Lex.uz — Qonunchilik ma’lumotlari milliy bazasi',
    siteDomain: 'lex.uz',
    officialUrl: 'https://lex.uz/docs/803',
    adoptedDate: '1996-yil 26-aprel',
    stateAgency: 'Raqobat qo‘mitasi & Adliya vazirligi',
    legalStatus: 'Amalda (Rasmiy davlat manbasi)',
    keyArticles: [
      {
        number: '21-modda',
        heading: 'Shartnomaning iste’molchi huquqlarini kamsituvchi shartlarining haqiqiy emasligi',
        originalQuote:
          '«Shartnomaning qonunchilikda belgilangan huquqlarni cheklovchi har qanday shartlari haqiqiy emas deb hisoblanadi. Iste’molchiga uning roziligisiz qo‘shimcha pulli xizmatlar ko‘rsatish taqiqlanadi.»',
        explanation:
          'Kredit olishda majburiy sug‘urta, SMS-xabar yoki ortiqcha monitoring to‘lovlarini fuqaroning erkin roziligisiz yuklash qonunga xilofdir.',
      },
    ],
    citizenRights: [
      'Majburiy yuklatilgan xizmatlar uchun to‘langan mablag‘ni qaytarib olish',
      'Noaniq yoki ikki ma’noli shartnoma bandlarini fuqaro foydasiga talqin qilish',
      'Bank xatti-harakatlari ustidan Iste’molchilar huquqlarini himoya qilish qo‘mitasiga murojaat qilish',
    ],
  },
  {
    id: 'cbu_regulation_3030',
    title: 'Markaziy bankning 3030-son Nizomi (Bank xizmatlari iste’molchilari himoyasi)',
    shortDesc: 'Kreditning to‘liq haqiqiy qiymati (THS), foiz hisoblash va jarimalarning eng yuqori chegarasi.',
    badge: 'MB Nizomi № 3030',
    article: '14 va 28-bandlar',
    siteName: 'CBU.uz (O‘zbekiston Markaziy banki) & Lex.uz',
    siteDomain: 'cbu.uz / lex.uz',
    officialUrl: 'https://lex.uz/docs/3805844',
    adoptedDate: '2018-yil 2-iyul (Adliya vazirligida ro‘yxat raqami 3030)',
    stateAgency: 'O‘zbekiston Respublikasi Markaziy banki Boshqaruvi',
    legalStatus: 'Amalda (Majburiy normativ-huquqiy hujjat)',
    keyArticles: [
      {
        number: '28-band',
        heading: 'Kechikkan qarzdorlik bo‘yicha jarima va penyalarning cheklovi',
        originalQuote:
          '«Muddati o‘tgan qarzdorlik bo‘yicha hisoblangan jami jarima va penya miqdori muddati o‘tgan asosiy qarz summasining 50 foizidan oshishi mumkin emas.»',
        explanation:
          'Bank hech qachon asosiy qarzdan ko‘proq penya yoza olmaydi. Masalan, 2 000 000 so‘m kechikkan qarzga 4 000 000 so‘m jarima hisoblash qat’iyan man etiladi.',
      },
      {
        number: '14-band',
        heading: 'Kreditning to‘liq haqiqiy qiymati (THS)',
        originalQuote:
          '«Bank kredit shartnomasining birinchi sahifasida kreditning to‘liq haqiqiy qiymatini, shu jumladan barcha foiz va komissiyalarni ko‘rsatishi shart.»',
        explanation:
          'Reklamada aytilgan foiz bilan haqiqiy to‘lov o‘rtasida farq bo‘lsa, bank 3030-son Nizom talablarini buzgan hisoblanadi.',
      },
    ],
    citizenRights: [
      '50 foizdan oshirilgan jarima va penyalarni hisobdan chiqarishni talab qilish',
      'Markaziy bankning iste’molchilar huquqlarini himoya qilish xizmatiga (1102) shikoyat yo‘llash',
      'Kreditni qayta rasmiylashtirish yoki imtiyozli davr so‘rab yozma murojaat qilish',
    ],
  },
];

const formatMoney = (n: number) => Math.round(n).toLocaleString('ru-RU') + ' so‘m';

export const BankHuquqScreen: React.FC<BankHuquqScreenProps> = ({ onBack }) => {
  const insets = useSafeAreaInsets();
  const [currentView, setCurrentView] = useState<BankHuquqSubView>('home');
  const [viewHistory, setViewHistory] = useState<BankHuquqSubView[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Qonun detali uchun tanlangan qonun
  const [selectedLaw, setSelectedLaw] = useState<LawDetailItem | null>(null);

  // Chat scroll ref
  const chatScrollRef = useRef<any>(null);

  // ---------------- KALKULYATOR HOLATI ----------------
  const [calcTab, setCalcTab] = useState<'calc' | 'schedule'>('calc');
  const [principal, setPrincipal] = useState('50000000');
  const [rate, setRate] = useState('24');
  const [months, setMonths] = useState('36');
  const [monthlyPayment, setMonthlyPayment] = useState(1964000);
  const [totalPayment, setTotalPayment] = useState(70704000);
  const [totalInterest, setTotalInterest] = useState(20704000);
  const [scheduleList, setScheduleList] = useState<{ month: number; payment: number; principal: number; interest: number }[]>([]);

  // ---------------- CHAT HOLATI ----------------
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      id: '1',
      sender: 'user',
      text: 'Kredit muddatim o‘tib ketdi, endi nima qilishim kerak? Jarima qo‘shiladimi?',
      time: '20:11',
    },
    {
      id: '2',
      sender: 'ai',
      text: 'Kredit to‘lovini kechiktirganingizda bank shartnomaga asosan penya hisoblashi mumkin, lekin u Markaziy bank talablariga mos bo‘lishi kerak.',
      time: '20:12',
      steps: [
        'Bank bilan bog‘lanib, to‘lov rejasini qayta ko‘rib chiqishni so‘rang (restrukturizatsiya).',
        'Moliyaviy holatingizni tasdiqlovchi hujjatlarni tayyorlang.',
        'Zarur bo‘lsa, talabga e’tirozlar bildirib xat yo‘llang.',
      ],
      lawBasis: '«Banklar va bank faoliyati to‘g‘risida»gi Qonun 52/1-modda',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // ---------------- SHARTNOMA VA TAHLIL HOLATI ----------------
  const [uploadedFileName, setUploadedFileName] = useState('kredit_shartnoma.pdf');
  const [analysisTab, setAnalysisTab] = useState<'summary' | 'clauses' | 'recommendations'>('summary');

  // ---------------- ARIZA VA SHIKOYAT HOLATI ----------------
  const [selectedProblem, setSelectedProblem] = useState<string>('To‘lov muddati o‘tib ketdi');
  const [applicantName, setApplicantName] = useState('');
  const [bankName, setBankName] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [generatedLetter, setGeneratedLetter] = useState<string | null>(null);

  // ---------------- MIB VA QONUNCHILIK FILTRLARI ----------------
  const [mibFilter, setMibFilter] = useState<'all' | 'card' | 'property' | 'salary'>('all');

  // Navigatsiya tarixi
  const navigateTo = (view: BankHuquqSubView) => {
    setViewHistory((h) => [...h, currentView]);
    setCurrentView(view);
  };

  const handleBack = () => {
    if (viewHistory.length > 0) {
      const prev = viewHistory[viewHistory.length - 1];
      setViewHistory((h) => h.slice(0, -1));
      setCurrentView(prev);
    } else if (currentView !== 'home') {
      setCurrentView('home');
    } else {
      onBack();
    }
  };

  // Android orqaga tugmasi
  useEffect(() => {
    const backAction = () => {
      handleBack();
      return true;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => sub.remove();
  }, [viewHistory, currentView]);

  // Kalkulyator formulasi
  const computeLoan = (pStr = principal, rStr = rate, mStr = months) => {
    const p = parseFloat(pStr) || 0;
    const r = (parseFloat(rStr) || 0) / 1200;
    const n = parseInt(mStr) || 1;

    if (p <= 0 || n <= 0) return;

    let mPayment = 0;
    if (r === 0) {
      mPayment = p / n;
    } else {
      mPayment = (p * r) / (1 - Math.pow(1 + r, -n));
    }

    const tPayment = mPayment * n;
    const tInterest = tPayment - p;

    setMonthlyPayment(Math.round(mPayment));
    setTotalPayment(Math.round(tPayment));
    setTotalInterest(Math.max(0, Math.round(tInterest)));

    // Jadval
    const sched = [];
    let balance = p;
    for (let i = 1; i <= Math.min(n, 36); i++) {
      const iPayment = balance * r;
      const pPayment = mPayment - iPayment;
      balance = Math.max(0, balance - pPayment);
      sched.push({
        month: i,
        payment: Math.round(mPayment),
        principal: Math.round(pPayment),
        interest: Math.round(iPayment),
      });
    }
    setScheduleList(sched);
  };

  useEffect(() => {
    computeLoan('50000000', '24', '36');
  }, []);

  // Chat ochilganda pastga siljitish
  useEffect(() => {
    if (currentView === 'chat') {
      setTimeout(() => {
        chatScrollRef.current?.scrollToEnd({ animated: false });
      }, 100);
    }
  }, [currentView, messages]);

  // Chat yuborish
  const handleSendChat = async () => {
    const q = chatInput.trim();
    if (!q) return;

    const userMsg: ChatMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: q,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(`${BANK_HUQUQ_API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: q }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: data.answer || 'Tushundim. Muammoni qonuniy hal etish bo‘yicha tavsiyalar tayyorlanmoqda.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          lawBasis: 'Markaziy bank 3030-son Nizomi & O‘zbekiston FK',
        },
      ]);
    } catch {
      setTimeout(() => {
        let answerText =
          'O‘zbekiston Respublikasi bank qonunchiligiga ko‘ra, fuqaroning qonuniy manfaatlari va to‘lov intizomi Markaziy bank me’yorlari asosida himoya qilinadi.';
        let steps = [
          'Bankka yozma murojaat qilib, to‘liq hisob-kitob varaqasini oling.',
          'Nizoli to‘lovlar yoki ortiqcha foizlar yuzasidan e’tiroz xati yo‘llang.',
          'Ijobiy hal etilmasa, Markaziy bank iste’molchilar huquqini himoya qilish xizmatiga murojaat qiling.',
        ];
        let law = 'Markaziy bank 3030-son Nizomi 4-bobi';

        const s = q.toLowerCase();
        if (/mib|ijro|undir|sud/.test(s)) {
          answerText =
            'MIB ijrochilari fuqaroning oylik maoshidan 50% dan ortiq miqdorda pul ushlab qolishga haqli emas. Shuningdek, yagona turar joy xatlovga olinishi taqiqlanadi.';
          steps = [
            'Ijro hujjati raqami va ijrochi qarorining nusxasini talab qiling.',
            'Oylik maosh yoki ijtimoiy to‘lov kartalaridan taqiqni yechish arizasini bering.',
            'Qarzdorlikni bo‘lib-bo‘lib to‘lash bo‘yicha sudga yoki ijrochiga murojaat qiling.',
          ];
          law = '«Sud hujjatlari va boshqa organlar hujjatlarini ijro etish to‘g‘risida»gi Qonun 65-modda';
        } else if (/foiz|yashirin|stavka|ortiqcha/.test(s)) {
          answerText =
            'Banklar shartnomada ko‘rsatilmagan qo‘shimcha yashirin komissiyalar yoki to‘lovlarni bir tomonlama joriy qilishga qonunan haqli emas.';
          steps = [
            'Kredit shartnomasidagi «Kreditning to‘liq haqiqiy qiymati» bandini tekshiring.',
            'Ortiqcha to‘langan mablag‘larni asosiy qarz hisobiga o‘tkazishni so‘rang.',
            'Bank rad etsa, Iste’molchilar huquqlarini himoya qilish qo‘mitasiga xabar bering.',
          ];
          law = '«Iste’molchilarning huquqlarini himoya qilish to‘g‘risida»gi Qonun 21-modda';
        }

        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'ai',
            text: answerText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            steps,
            lawBasis: law,
          },
        ]);
        setIsChatLoading(false);
      }, 500);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Hujjat yuklash
  const handlePickDocument = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/jpeg', 'image/png'],
        copyToCacheDirectory: true,
      });

      if (!res.canceled && res.assets && res.assets.length > 0) {
        setUploadedFileName(res.assets[0].name);
        Alert.alert(
          'Hujjat qabul qilindi',
          `"${res.assets[0].name}" muvaffaqiyatli yuklandi. Tahlil natijalariga o‘tilmoqda.`,
          [{ text: 'Tahlilni ko‘rish', onPress: () => navigateTo('analysis') }]
        );
      }
    } catch {
      navigateTo('analysis');
    }
  };

  // Ariza tuzish
  const handleGenerateComplaint = () => {
    const n = applicantName.trim() || 'Aliyev Vali G‘aniyevich';
    const b = bankName.trim() || 'ATB «Agrobank»';
    const d =
      problemDescription.trim() ||
      'Kredit shartnomam bo‘yicha asossiz hisoblangan jarima va foizlarni qayta ko‘rib chiqishingizni so‘rayman.';

    const letter = `${b} Boshqaruvi Raisiga\nFuqaro: ${n}\n\nARIZA / DA’VO TALABI\n\nMen va Sizning bankingiz o‘rtasida tuzilgan kredit shartnomasi bo‘yicha quyidagi holat yuz berdi:\n\n${d}\n\n«Banklar va bank faoliyati to‘g‘risida»gi Qonun hamda O‘zbekiston Respublikasi Markaziy bankining 3030-son Nizomiga asosan, mazkur masalani qonuniy ko‘rib chiqib, 15 kunlik muddatda menga yozma javob taqdim etishingizni so‘rayman.\n\nAks holda, Markaziy bankka va fuqarolik ishlari bo‘yicha sud organiga murojaat qilish huquqimni saqlab qolaman.\n\nSana: ${new Date().toLocaleDateString('uz-UZ')}\nImzo: ${n}`;

    setGeneratedLetter(letter);
  };

  // Rasmiy havola (Lex.uz / CBU.uz) ni brauzerda ochish
  const handleOpenOfficialLink = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Havola ochilmadi', url);
      }
    } catch {
      Linking.openURL(url);
    }
  };

  // Qonun ustiga bosganda alohida sahifani ochish
  const handleOpenLawDetail = (law: LawDetailItem) => {
    setSelectedLaw(law);
    navigateTo('law_detail');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      {/* ==================== 1. TOP HEADER (BILDIRISHNOMA OLIB TASHLANDI) ==================== */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color="#0F172A" />
          <Text style={styles.backBtnText}>
            {currentView === 'home' ? 'Yordam' : 'Orqaga'}
          </Text>
        </TouchableOpacity>

        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {currentView === 'home' && 'BankHuquq'}
            {currentView === 'chat' && 'AI maslahat'}
            {currentView === 'calculator' && 'Kredit kalkulyatori'}
            {currentView === 'contract' && 'Shartnoma tahlili'}
            {currentView === 'analysis' && 'Tahlil natijasi'}
            {currentView === 'mib' && 'MIB yordam (majburiy ijro)'}
            {currentView === 'complaint' && 'Ariza va shikoyat'}
            {currentView === 'laws' && 'Qonunchilik'}
            {currentView === 'law_detail' && 'Qonun tahlili'}
          </Text>
        </View>

        {/* Muvozanat uchun bo'sh joy (bildirishnoma tugmasi olib tashlandi) */}
        <View style={{ width: 60 }} />
      </View>

      {/* ==================== 2. ASOSIY SAHIFA (HOME) ==================== */}
      {currentView === 'home' && (
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Qidiruv paneli */}
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color="#94A3B8" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Masalan: kredit, shartnoma, MIB..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* BankHuquq Hero Banner */}
          <LinearGradient
            colors={['#1E40AF', '#2563EB', '#3B82F6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroBanner}
          >
            <View style={styles.heroLeft}>
              <View style={styles.heroBadge}>
                <Text style={styles.heroBadgeText}>RASMIY EKOTIZIM</Text>
              </View>
              <Text style={styles.heroTitle}>BankHuquq</Text>
              <Text style={styles.heroSubtitle}>
                Kredit, bank operatsiyalari, masalalarida huquqiy yordam
              </Text>
            </View>
            <View style={styles.heroRight}>
              <View style={styles.heroIconCircle}>
                <FontAwesome5 name="gavel" size={28} color="#FFFFFF" />
              </View>
            </View>
          </LinearGradient>

          {/* 6 TA ASOSIY XIZMAT GRIDI (3 ustun x 2 qator) */}
          <View style={styles.gridContainer}>
            {/* 1. AI maslahat */}
            <TouchableOpacity
              style={styles.gridCard}
              activeOpacity={0.8}
              onPress={() => navigateTo('chat')}
            >
              <View style={[styles.gridIconWrap, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="chatbubble-ellipses" size={26} color="#2563EB" />
              </View>
              <Text style={styles.gridCardTitle}>AI maslahat</Text>
            </TouchableOpacity>

            {/* 2. Shartnoma tahlili */}
            <TouchableOpacity
              style={styles.gridCard}
              activeOpacity={0.8}
              onPress={() => navigateTo('contract')}
            >
              <View style={styles.newBadgePill}>
                <Text style={styles.newBadgeText}>Yangi</Text>
              </View>
              <View style={[styles.gridIconWrap, { backgroundColor: '#F0FDF4' }]}>
                <Ionicons name="document-text" size={26} color="#059669" />
              </View>
              <Text style={styles.gridCardTitle}>Shartnoma tahlili</Text>
            </TouchableOpacity>

            {/* 3. Kredit kalkulyatori */}
            <TouchableOpacity
              style={styles.gridCard}
              activeOpacity={0.8}
              onPress={() => navigateTo('calculator')}
            >
              <View style={[styles.gridIconWrap, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="calculator" size={26} color="#0284C7" />
              </View>
              <Text style={styles.gridCardTitle}>Kredit kalkulyatori</Text>
            </TouchableOpacity>

            {/* 4. MIB bildirishnomasi */}
            <TouchableOpacity
              style={styles.gridCard}
              activeOpacity={0.8}
              onPress={() => navigateTo('mib')}
            >
              <View style={[styles.gridIconWrap, { backgroundColor: '#FFFBEB' }]}>
                <MaterialCommunityIcons name="shield-alert" size={26} color="#D97706" />
              </View>
              <Text style={styles.gridCardTitle}>MIB bildirishnomasi</Text>
            </TouchableOpacity>

            {/* 5. Ariza va shikoyat */}
            <TouchableOpacity
              style={styles.gridCard}
              activeOpacity={0.8}
              onPress={() => navigateTo('complaint')}
            >
              <View style={[styles.gridIconWrap, { backgroundColor: '#FAF5FF' }]}>
                <MaterialCommunityIcons name="file-document-edit" size={26} color="#7C3AED" />
              </View>
              <Text style={styles.gridCardTitle}>Ariza va shikoyat</Text>
            </TouchableOpacity>

            {/* 6. Qonunchilik */}
            <TouchableOpacity
              style={styles.gridCard}
              activeOpacity={0.8}
              onPress={() => navigateTo('laws')}
            >
              <View style={[styles.gridIconWrap, { backgroundColor: '#F0FDF4' }]}>
                <Ionicons name="book" size={26} color="#10B981" />
              </View>
              <Text style={styles.gridCardTitle}>Qonunchilik</Text>
            </TouchableOpacity>
          </View>

          {/* KREDIT MUAMMOLARINI OLDINI OLING BANNERI */}
          <TouchableOpacity
            style={styles.warningActionBanner}
            activeOpacity={0.85}
            onPress={() => navigateTo('contract')}
          >
            <View style={styles.warningIconBox}>
              <Ionicons name="shield-checkmark" size={24} color="#D97706" />
            </View>
            <View style={styles.warningTextBox}>
              <Text style={styles.warningTitle}>Kredit muammolarini oldini oling</Text>
              <Text style={styles.warningDesc}>
                Shartnoma tuzishda, o‘zgarishlarda xavflarni tahlil qiling.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          {/* AMALIY YO'NALISHLAR (6 TA ASOSIY MAVZU) */}
          <Text style={styles.sectionHeaderTitle}>Fuqarolar uchun huquqiy himoya</Text>

          <View style={styles.actionCardsList}>
            <TouchableOpacity
              style={styles.topicCard}
              activeOpacity={0.8}
              onPress={() => navigateTo('complaint')}
            >
              <View style={[styles.topicIconWrap, { backgroundColor: '#FEF2F2' }]}>
                <Ionicons name="card" size={20} color="#EF4444" />
              </View>
              <View style={styles.topicInfo}>
                <Text style={styles.topicTitle}>Kartadan asossiz pul yechish</Text>
                <Text style={styles.topicSubtitle}>
                  Ruxsatsiz yechilgan summani bankdan qaytarish tartibi va e’tiroz xati.
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.topicCard}
              activeOpacity={0.8}
              onPress={() => navigateTo('calculator')}
            >
              <View style={[styles.topicIconWrap, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="trending-up" size={20} color="#2563EB" />
              </View>
              <View style={styles.topicInfo}>
                <Text style={styles.topicTitle}>Yashirin foiz va komissiyalar tahlili</Text>
                <Text style={styles.topicSubtitle}>
                  Markaziy bankning 3030-son Nizomi bo‘yicha to‘liq kredit qiymatini tekshirish.
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.topicCard}
              activeOpacity={0.8}
              onPress={() => navigateTo('mib')}
            >
              <View style={[styles.topicIconWrap, { backgroundColor: '#FFFBEB' }]}>
                <Ionicons name="business" size={20} color="#D97706" />
              </View>
              <View style={styles.topicInfo}>
                <Text style={styles.topicTitle}>MIB ijro harakatlaridan himoya</Text>
                <Text style={styles.topicSubtitle}>
                  Oylik daromaddan 50% dan ko‘p ushlab qolish va asossiz xatlovlarni to‘xtatish.
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* ==================== 3. KREDIT KALKULYATORI EKRANI ==================== */}
      {currentView === 'calculator' && (
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Kalkulyator Tablari */}
          <View style={styles.tabToggleRow}>
            <TouchableOpacity
              style={[styles.tabToggleBtn, calcTab === 'calc' && styles.tabToggleBtnActive]}
              onPress={() => setCalcTab('calc')}
            >
              <Text
                style={[styles.tabToggleText, calcTab === 'calc' && styles.tabToggleTextActive]}
              >
                Kredit hisobi
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabToggleBtn, calcTab === 'schedule' && styles.tabToggleBtnActive]}
              onPress={() => setCalcTab('schedule')}
            >
              <Text
                style={[styles.tabToggleText, calcTab === 'schedule' && styles.tabToggleTextActive]}
              >
                To‘lov rejasi ({scheduleList.length || 36} oy)
              </Text>
            </TouchableOpacity>
          </View>

          {calcTab === 'calc' ? (
            <>
              {/* Kredit summasi */}
              <View style={styles.inputCard}>
                <Text style={styles.inputCardLabel}>Kredit summasi</Text>
                <View style={styles.inputWithSuffix}>
                  <TextInput
                    style={styles.inputNumber}
                    value={principal}
                    onChangeText={(v) => {
                      setPrincipal(v);
                      computeLoan(v, rate, months);
                    }}
                    keyboardType="numeric"
                  />
                  <Text style={styles.inputSuffix}>so‘m</Text>
                </View>

                {/* Tezkor tugmalar */}
                <View style={styles.quickChipsRow}>
                  {['10000000', '30000000', '50000000', '100000000'].map((val) => (
                    <TouchableOpacity
                      key={val}
                      style={[
                        styles.quickChip,
                        principal === val && styles.quickChipActive,
                      ]}
                      onPress={() => {
                        setPrincipal(val);
                        computeLoan(val, rate, months);
                      }}
                    >
                      <Text
                        style={[
                          styles.quickChipText,
                          principal === val && styles.quickChipTextActive,
                        ]}
                      >
                        {parseInt(val) / 1000000} mln
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Yillik foiz stavkasi */}
              <View style={styles.inputCard}>
                <Text style={styles.inputCardLabel}>Yillik foiz stavkasi</Text>
                <View style={styles.inputWithSuffix}>
                  <TextInput
                    style={styles.inputNumber}
                    value={rate}
                    onChangeText={(v) => {
                      setRate(v);
                      computeLoan(principal, v, months);
                    }}
                    keyboardType="numeric"
                  />
                  <Text style={styles.inputSuffix}>%</Text>
                </View>
              </View>

              {/* Kredit muddati */}
              <View style={styles.inputCard}>
                <Text style={styles.inputCardLabel}>Kredit muddati</Text>
                <View style={styles.inputWithSuffix}>
                  <TextInput
                    style={styles.inputNumber}
                    value={months}
                    onChangeText={(v) => {
                      setMonths(v);
                      computeLoan(principal, rate, v);
                    }}
                    keyboardType="numeric"
                  />
                  <Text style={styles.inputSuffix}>oy</Text>
                </View>
              </View>

              {/* Hisoblash tugmasi */}
              <TouchableOpacity
                style={styles.primaryActionButton}
                activeOpacity={0.85}
                onPress={() => computeLoan()}
              >
                <Text style={styles.primaryActionText}>Hisoblash</Text>
              </TouchableOpacity>

              {/* Hisob natijasi kartasi */}
              <View style={styles.resultSummaryCard}>
                <View style={styles.resultCardHeader}>
                  <Ionicons name="bar-chart" size={20} color="#2563EB" />
                  <Text style={styles.resultCardTitle}>Hisob natijasi</Text>
                </View>

                <Text style={styles.resultMonthlyLabel}>Oylik to‘lov</Text>
                <Text style={styles.resultMonthlyVal}>{formatMoney(monthlyPayment)}</Text>

                <View style={styles.resultDivider} />

                <View style={styles.resultDetailsRow}>
                  <Text style={styles.resultDetailLabel}>Umumiy to‘lov:</Text>
                  <Text style={styles.resultDetailValue}>{formatMoney(totalPayment)}</Text>
                </View>

                <View style={styles.resultDetailsRow}>
                  <Text style={styles.resultDetailLabel}>Foiz xarajati:</Text>
                  <Text style={[styles.resultDetailValue, { color: '#DC2626' }]}>
                    {formatMoney(totalInterest)}
                  </Text>
                </View>

                <View style={styles.resultDetailsRow}>
                  <Text style={styles.resultDetailLabel}>To‘liq foiz stavkasi (THS):</Text>
                  <Text style={styles.resultDetailValue}>{rate} %</Text>
                </View>

                {/* To'lov rejasini ko'rish tugmasi */}
                <TouchableOpacity
                  style={styles.viewScheduleButton}
                  onPress={() => setCalcTab('schedule')}
                >
                  <Ionicons name="calendar-outline" size={16} color="#2563EB" />
                  <Text style={styles.viewScheduleText}>To‘lov rejasini ko‘rish</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            /* To'lov jadvali ro'yxati */
            <View style={styles.scheduleContainer}>
              <View style={styles.scheduleHeaderRow}>
                <Text style={styles.scheduleColHead}>Oy</Text>
                <Text style={styles.scheduleColHead}>Oylik to‘lov</Text>
                <Text style={styles.scheduleColHead}>Asosiy qarz</Text>
                <Text style={styles.scheduleColHead}>Foiz</Text>
              </View>
              {scheduleList.map((item) => (
                <View key={item.month} style={styles.scheduleItemRow}>
                  <Text style={styles.scheduleMonthCell}>{item.month}-oy</Text>
                  <Text style={styles.schedulePayCell}>{formatMoney(item.payment)}</Text>
                  <Text style={styles.schedulePrincCell}>{formatMoney(item.principal)}</Text>
                  <Text style={styles.scheduleIntCell}>{formatMoney(item.interest)}</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}

      {/* ==================== 4. AI MASLAHAT EKRANI (KEYBOARD AVOIDING VIEW) ==================== */}
      {currentView === 'chat' && (
        <KeyboardAvoidingView
          style={styles.chatWrapper}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top + 54 : 0}
        >
          <ScrollView
            ref={chatScrollRef}
            style={styles.chatScroll}
            contentContainerStyle={[styles.chatContent, { paddingBottom: 16 }]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() => chatScrollRef.current?.scrollToEnd({ animated: true })}
          >
            {messages.map((m) =>
              m.sender === 'user' ? (
                <View key={m.id} style={styles.userBubbleWrapper}>
                  <View style={styles.userBubble}>
                    <Text style={styles.userBubbleText}>{m.text}</Text>
                    <Text style={styles.userBubbleTime}>{m.time}</Text>
                  </View>
                </View>
              ) : (
                <View key={m.id} style={styles.aiBubbleWrapper}>
                  <View style={styles.aiHeaderRow}>
                    <View style={styles.aiAvatarBox}>
                      <Ionicons name="shield-checkmark" size={14} color="#FFFFFF" />
                    </View>
                    <Text style={styles.aiAvatarName}>BankHuquq AI</Text>
                  </View>

                  <View style={styles.aiBubbleCard}>
                    <Text style={styles.aiBubbleText}>{m.text}</Text>

                    {m.steps && m.steps.length > 0 && (
                      <View style={styles.aiStepsBox}>
                        <Text style={styles.aiStepsTitle}>Siz uchun tavsiya etilgan harakatlar:</Text>
                        {m.steps.map((st, i) => (
                          <View key={i} style={styles.aiStepRow}>
                            <View style={styles.aiStepPill}>
                              <Text style={styles.aiStepNum}>{i + 1}</Text>
                            </View>
                            <Text style={styles.aiStepText}>{st}</Text>
                          </View>
                        ))}
                      </View>
                    )}

                    {m.lawBasis && (
                      <TouchableOpacity
                        style={styles.lawBasisBox}
                        activeOpacity={0.7}
                        onPress={() => {
                          const matchingLaw = OFFICIAL_LAWS_DATABASE[0];
                          handleOpenLawDetail(matchingLaw);
                        }}
                      >
                        <Ionicons name="document-text-outline" size={15} color="#2563EB" />
                        <Text style={styles.lawBasisText}>Asos: {m.lawBasis} ›</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )
            )}

            {isChatLoading && (
              <View style={styles.chatLoadingBox}>
                <ActivityIndicator size="small" color="#2563EB" />
                <Text style={styles.chatLoadingText}>BankHuquq AI tahlil qilmoqda...</Text>
              </View>
            )}
          </ScrollView>

          {/* Chat kiritish paneli: Klaviatura tepasida chiqadi */}
          <View style={[styles.chatInputBar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
            <TextInput
              style={styles.chatTextInput}
              placeholder="Masalangizni yozing..."
              placeholderTextColor="#94A3B8"
              value={chatInput}
              onChangeText={setChatInput}
              onFocus={() => {
                setTimeout(() => chatScrollRef.current?.scrollToEnd({ animated: true }), 250);
              }}
            />
            <TouchableOpacity style={styles.chatMicBtn}>
              <Ionicons name="mic-outline" size={20} color="#64748B" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.chatSendBtn, !chatInput.trim() && styles.chatSendBtnDisabled]}
              onPress={handleSendChat}
              disabled={!chatInput.trim() || isChatLoading}
            >
              <Ionicons name="send" size={17} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}

      {/* ==================== 5. SHARTNOMA TAHLILI EKRANI ==================== */}
      {currentView === 'contract' && (
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contractHeroBox}>
            <View style={styles.contractIllustrationWrap}>
              <Ionicons name="document-text" size={64} color="#3B82F6" />
              <View style={styles.magnifierPill}>
                <Ionicons name="search" size={24} color="#2563EB" />
              </View>
            </View>

            <Text style={styles.contractHeroTitle}>
              Kredit shartnomasini AI bilan tahlil qiling
            </Text>
            <Text style={styles.contractHeroSubtitle}>
              Shartnomadagi asosiy shartlar, foiz, jarima, muddat va xavfli bandlarni sodda tilda tushuntirib beradi.
            </Text>
          </View>

          {/* Afzalliklar ro'yxati */}
          <View style={styles.checklistCard}>
            <View style={styles.checkItemRow}>
              <Ionicons name="checkmark-circle" size={20} color="#2563EB" />
              <Text style={styles.checkItemText}>Muhim bandlarni ajratib beradi</Text>
            </View>
            <View style={styles.checkItemRow}>
              <Ionicons name="checkmark-circle" size={20} color="#2563EB" />
              <Text style={styles.checkItemText}>Yashirin to‘lov va komissiyalarni ko‘rsatadi</Text>
            </View>
            <View style={styles.checkItemRow}>
              <Ionicons name="checkmark-circle" size={20} color="#2563EB" />
              <Text style={styles.checkItemText}>Xavf va tavsiyalarni bildiradi</Text>
            </View>
            <View style={styles.checkItemRow}>
              <Ionicons name="checkmark-circle" size={20} color="#2563EB" />
              <Text style={styles.checkItemText}>Muammoga xolis yechim taklif qiladi</Text>
            </View>
          </View>

          {/* Tugmalar */}
          <TouchableOpacity
            style={styles.primaryActionButton}
            activeOpacity={0.88}
            onPress={handlePickDocument}
          >
            <Ionicons name="arrow-up-circle-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.primaryActionText}>Shartnoma yuklash</Text>
          </TouchableOpacity>

          <View style={styles.orDividerRow}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>YOKI</Text>
            <View style={styles.orLine} />
          </View>

          <TouchableOpacity
            style={styles.secondaryActionButton}
            activeOpacity={0.88}
            onPress={() => navigateTo('analysis')}
          >
            <Ionicons name="document-text-outline" size={18} color="#2563EB" style={{ marginRight: 6 }} />
            <Text style={styles.secondaryActionText}>Namuna shartnomani tahlil qilish</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* ==================== 6. TAHLIL NATIJASI EKRANI ==================== */}
      {currentView === 'analysis' && (
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Fayl kartasi */}
          <View style={styles.fileHeaderCard}>
            <View style={styles.pdfBadge}>
              <Text style={styles.pdfBadgeText}>PDF</Text>
            </View>
            <View style={styles.fileHeaderInfo}>
              <Text style={styles.fileHeaderName}>{uploadedFileName}</Text>
              <Text style={styles.fileHeaderSub}>1.2 MB · Tahlil yakunlandi</Text>
            </View>
            <Ionicons name="checkmark-circle" size={24} color="#10B981" />
          </View>

          {/* Tahlil Tablari */}
          <View style={styles.tabToggleRow}>
            <TouchableOpacity
              style={[styles.tabToggleBtn, analysisTab === 'summary' && styles.tabToggleBtnActive]}
              onPress={() => setAnalysisTab('summary')}
            >
              <Text
                style={[
                  styles.tabToggleText,
                  analysisTab === 'summary' && styles.tabToggleTextActive,
                ]}
              >
                Xulosa
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabToggleBtn, analysisTab === 'clauses' && styles.tabToggleBtnActive]}
              onPress={() => setAnalysisTab('clauses')}
            >
              <Text
                style={[
                  styles.tabToggleText,
                  analysisTab === 'clauses' && styles.tabToggleTextActive,
                ]}
              >
                Bandlar (3 ta)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabToggleBtn,
                analysisTab === 'recommendations' && styles.tabToggleBtnActive,
              ]}
              onPress={() => setAnalysisTab('recommendations')}
            >
              <Text
                style={[
                  styles.tabToggleText,
                  analysisTab === 'recommendations' && styles.tabToggleTextActive,
                ]}
              >
                Tavsiyalar
              </Text>
            </TouchableOpacity>
          </View>

          {/* Umumiy baho kartasi */}
          <View style={styles.analysisCard}>
            <View style={styles.analysisScoreRow}>
              <Text style={styles.analysisScoreTitle}>Umumiy baho</Text>
              <View style={styles.riskBadgeWarning}>
                <Ionicons name="alert-circle" size={13} color="#D97706" />
                <Text style={styles.riskBadgeText}>O‘rtacha xavf</Text>
              </View>
            </View>

            <Text style={styles.analysisScoreDesc}>
              Shartnomada e’tibor berish kerak bo‘lgan 3 ta band aniqlandi.
            </Text>

            <View style={styles.metricsTable}>
              <View style={styles.metricRow}>
                <Ionicons name="wallet-outline" size={16} color="#0284C7" />
                <Text style={styles.metricName}>Kredit summasi</Text>
                <Text style={styles.metricValue}>50 000 000 so‘m</Text>
              </View>

              <View style={styles.metricRow}>
                <Ionicons name="pie-chart-outline" size={16} color="#0284C7" />
                <Text style={styles.metricName}>Yillik foiz stavkasi</Text>
                <Text style={styles.metricValue}>24 %</Text>
              </View>

              <View style={styles.metricRow}>
                <Ionicons name="time-outline" size={16} color="#0284C7" />
                <Text style={styles.metricName}>Kredit muddati</Text>
                <Text style={styles.metricValue}>36 oy</Text>
              </View>

              <View style={styles.metricRow}>
                <Ionicons name="cash-outline" size={16} color="#F59E0B" />
                <Text style={styles.metricName}>Umumiy to‘lov</Text>
                <Text style={styles.metricValue}>70 704 000 so‘m</Text>
              </View>

              <View style={styles.metricRow}>
                <Ionicons name="alert-circle-outline" size={16} color="#EF4444" />
                <Text style={styles.metricName}>Jarima (kechikish uchun)</Text>
                <Text style={[styles.metricValue, { color: '#EF4444', fontWeight: '800' }]}>
                  Kuniga 0.1 %
                </Text>
              </View>
            </View>
          </View>

          {/* Xavfli bandlar tahlili */}
          <Text style={styles.sectionHeaderTitle}>Aniqlangan bandlar</Text>

          <View style={styles.flaggedClauseCard}>
            <View style={styles.clauseTopRow}>
              <Text style={styles.clauseNum}>5.3-band</Text>
              <Text style={styles.clauseTagDanger}>Penya miqdori yuqori</Text>
            </View>
            <Text style={styles.clauseQuote}>
              «To‘lov muddati buzilgan taqdirda, bank har bir kechiktirilgan kun uchun 0.1% miqdorida jarima hisoblaydi.»
            </Text>
            <Text style={styles.clauseAdvice}>
              💡 Maslahat: Markaziy bank qoidalariga ko‘ra, jarima va penya miqdori jami kredit qoldig‘ining 50 foizidan oshmasligi kerak.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.primaryActionButton}
            onPress={() => navigateTo('complaint')}
          >
            <Text style={styles.primaryActionText}>E’tiroz xati tayyorlash</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* ==================== 7. MIB VA MAJBURIY IJRO EKRANI ==================== */}
      {currentView === 'mib' && (
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* MIB Yuqori Karta */}
          <View style={styles.mibHeroCard}>
            <View style={styles.mibHeroTopRow}>
              <View style={styles.mibIconWrap}>
                <FontAwesome5 name="balance-scale" size={24} color="#D97706" />
              </View>
              <View style={styles.mibHeroInfo}>
                <Text style={styles.mibHeroTitle}>
                  Majburiy ijro va sud qarorlari bo‘yicha yordam
                </Text>
                <Text style={styles.mibHeroDesc}>
                  MIB ish boshlagan bo‘lsa, sizning qonuniy huquqlaringiz, ijroni to‘xtatish yoki oylikdan kamroq ushlash yo‘llari.
                </Text>
              </View>
            </View>
            <View style={styles.mibBadgeRow}>
              <View style={styles.mibBadgeItem}>
                <Ionicons name="checkmark-circle" size={14} color="#059669" />
                <Text style={styles.mibBadgeText}>Ijroni to‘xtatish</Text>
              </View>
              <View style={styles.mibBadgeItem}>
                <Ionicons name="checkmark-circle" size={14} color="#059669" />
                <Text style={styles.mibBadgeText}>Oylikni saqlab qolish</Text>
              </View>
            </View>
          </View>

          {/* Filtrlar */}
          <Text style={styles.filterSectionTitle}>HOLATNI TANLANG</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterPillsScroll}>
            {[
              { id: 'all', title: 'Barchasi' },
              { id: 'card', title: 'Karta bloklangan' },
              { id: 'property', title: 'Mulk xatlovi' },
              { id: 'salary', title: 'Oylik' },
            ].map((f) => (
              <TouchableOpacity
                key={f.id}
                style={[
                  styles.filterPill,
                  mibFilter === f.id && styles.filterPillActive,
                ]}
                onPress={() => setMibFilter(f.id as any)}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    mibFilter === f.id && styles.filterPillTextActive,
                  ]}
                >
                  {f.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Amaliy huquqiy yechimlar ro'yxati */}
          <Text style={styles.sectionHeaderTitle}>Amaliy huquqiy yechimlar</Text>

          <TouchableOpacity
            style={styles.mibSolutionCard}
            onPress={() =>
              Alert.alert(
                'Ijro ishini vaqtincha to‘xtatish',
                'Sudga kassatsiya yoki yangi ochilgan holatlar bo‘yicha ariza berilganda, ijro harakatlarini to‘xtatish to‘g‘risida MIBga iltimosnoma kiritiladi.'
              )
            }
          >
            <View style={[styles.solIconWrap, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#2563EB" />
            </View>
            <View style={styles.solInfo}>
              <Text style={styles.solTitle}>Ijro ishini vaqtincha to‘xtatish</Text>
              <Text style={styles.solDesc}>
                Sudga shikoyat berish yoki to‘lov muddatini kechiktirish bo‘yicha ariza berish.
              </Text>
              <Text style={styles.solTag}>Ariza loyihasini olish ›</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.mibSolutionCard}
            onPress={() =>
              Alert.alert(
                'Qarzdorlikni bo‘lib-bo‘lib to‘lash',
                'Sud tomonidan belgilangan qarzdorlikni oylik daromadga mutanosib ravishda 6 oydan 24 oygacha bo‘lib to‘lash tartibi.'
              )
            }
          >
            <View style={[styles.solIconWrap, { backgroundColor: '#F0FDF4' }]}>
              <Ionicons name="calendar-outline" size={20} color="#059669" />
            </View>
            <View style={styles.solInfo}>
              <Text style={styles.solTitle}>Bo‘lib-bo‘lib to‘lash kelishuvi</Text>
              <Text style={styles.solDesc}>
                MIB ijrochisi va bank bilan rasmiy to‘lov grafigini kelishish.
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.mibSolutionCard}
            onPress={() =>
              Alert.alert(
                'Noqonuniy xatlov ustidan shikoyat',
                'Qonunchilikka ko‘ra, fuqaroning oylik ish haqidan 50% dan ortiq mablag‘ ushlab qolish yoki yagona uyini tortib olish qat’iyan man etiladi.'
              )
            }
          >
            <View style={[styles.solIconWrap, { backgroundColor: '#FEF2F2' }]}>
              <Ionicons name="alert-circle-outline" size={20} color="#EF4444" />
            </View>
            <View style={styles.solInfo}>
              <Text style={styles.solTitle}>Noqonuniy xatlov ustidan shikoyat</Text>
              <Text style={styles.solDesc}>
                Daromadning 50% dan ortig‘i ushlab qolinganida ijrochi ustidan shikoyat.
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* ==================== 8. ARIZA VA SHIKOYAT EKRANI ==================== */}
      {currentView === 'complaint' && (
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.complaintHeading}>Sizda qanday muammo yuz berdi?</Text>

          {/* 4 ta muammo varianti */}
          {[
            {
              title: 'To‘lov muddati o‘tib ketdi',
              desc: 'Noqonuniy jarima, xat va ijrochilar bo‘yicha yordam',
              icon: 'time-outline',
              color: '#EF4444',
            },
            {
              title: 'Foiz (stavka) bo‘yicha nizo',
              desc: 'Foizlarni qayta hisoblash, ortiqcha to‘lovlar, sudxo‘rlik',
              icon: 'trending-up-outline',
              color: '#2563EB',
            },
            {
              title: 'To‘lash qiyin (moliyaviy qiyinchilik)',
              desc: 'Muddatni uzaytirish, kredit ta’tili, qarzni qayta tuzish',
              icon: 'refresh-circle-outline',
              color: '#D97706',
            },
            {
              title: 'MIB ijrosi boshlangan',
              desc: 'Ijro to‘xtatish, 50/50 taqsimot va huquqlaringiz',
              icon: 'shield-outline',
              color: '#7C3AED',
            },
          ].map((item) => (
            <TouchableOpacity
              key={item.title}
              style={[
                styles.problemOptionCard,
                selectedProblem === item.title && styles.problemOptionCardActive,
              ]}
              onPress={() => setSelectedProblem(item.title)}
            >
              <View style={[styles.probIconWrap, { backgroundColor: '#F8FAFC' }]}>
                <Ionicons name={item.icon as any} size={22} color={item.color} />
              </View>
              <View style={styles.probInfo}>
                <Text style={styles.probTitle}>{item.title}</Text>
                <Text style={styles.probDesc}>{item.desc}</Text>
              </View>
              <Ionicons
                name={selectedProblem === item.title ? 'radio-button-on' : 'radio-button-off'}
                size={20}
                color={selectedProblem === item.title ? '#2563EB' : '#94A3B8'}
              />
            </TouchableOpacity>
          ))}

          {/* Ariza formasini to'ldirish */}
          <View style={styles.complaintFormBox}>
            <Text style={styles.formBoxTitle}>Rasmiy da’vo arizasini tuzish</Text>

            <Text style={styles.formLabel}>Fuqaro F.I.Sh.:</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Masalan: Aliyev Vali G‘aniyevich"
              placeholderTextColor="#94A3B8"
              value={applicantName}
              onChangeText={setApplicantName}
            />

            <Text style={styles.formLabel}>Bank nomi:</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Masalan: ATB «Agrobank»"
              placeholderTextColor="#94A3B8"
              value={bankName}
              onChangeText={setBankName}
            />

            <Text style={styles.formLabel}>Muammo tafsilotlari:</Text>
            <TextInput
              style={[styles.formInput, { height: 80, textAlignVertical: 'top' }]}
              placeholder="Masalan: Kartamdan 1 200 000 so‘m roziliksiz yechilgan. Shuni qaytarishingizni so‘rayman."
              placeholderTextColor="#94A3B8"
              value={problemDescription}
              onChangeText={setProblemDescription}
              multiline
            />

            <TouchableOpacity
              style={styles.primaryActionButton}
              onPress={handleGenerateComplaint}
            >
              <Ionicons name="document-text" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.primaryActionText}>Arizani shakllantirish</Text>
            </TouchableOpacity>
          </View>

          {/* Shakllantirilgan ariza loyihasi */}
          {generatedLetter && (
            <View style={styles.generatedLetterBox}>
              <View style={styles.letterTopBar}>
                <Text style={styles.letterTopTitle}>Tayyor ariza matni</Text>
                <TouchableOpacity
                  onPress={() => Alert.alert('Nusxa olindi', 'Ariza matni xotiraga nusxalandi.')}
                >
                  <Text style={styles.copyBtnText}>Nusxa olish</Text>
                </TouchableOpacity>
              </View>
              <Text selectable style={styles.letterContent}>
                {generatedLetter}
              </Text>
            </View>
          )}
        </ScrollView>
      )}

      {/* ==================== 9. QONUNCHILIK EKRANI ==================== */}
      {currentView === 'laws' && (
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Qonunchilik Banneri */}
          <View style={styles.lawsBannerCard}>
            <View style={styles.lawsBannerIcon}>
              <Ionicons name="book" size={24} color="#2563EB" />
            </View>
            <View style={styles.lawsBannerInfo}>
              <Text style={styles.lawsBannerTitle}>
                Bank va qarz munosabatlarida huquqiy asoslar
              </Text>
              <Text style={styles.lawsBannerDesc}>
                O‘zbekiston Respublikasi rasmiy qonunlari va Markaziy bank me’yorlari.
              </Text>
            </View>
          </View>

          {/* Qonunlar ro'yxati (Har bir qonun ustiga bosilganda alohida sahifa ochiladi) */}
          <Text style={styles.sectionHeaderTitle}>Asosiy qonunlar va me’yoriy hujjatlar</Text>

          {OFFICIAL_LAWS_DATABASE.map((law) => (
            <TouchableOpacity
              key={law.id}
              style={styles.lawItemCard}
              activeOpacity={0.8}
              onPress={() => handleOpenLawDetail(law)}
            >
              <View style={styles.lawItemTop}>
                <Ionicons name="document-text-outline" size={20} color="#2563EB" />
                <Text style={styles.lawItemTitle}>{law.title}</Text>
                <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
              </View>
              <Text style={styles.lawItemDesc}>{law.shortDesc}</Text>

              {/* Rasmiy Manba Tegi (Lex.uz / CBU.uz) */}
              <View style={styles.sourceSitePill}>
                <Ionicons name="globe-outline" size={13} color="#059669" />
                <Text style={styles.sourceSiteText}>Manba: {law.siteDomain}</Text>
                <Text style={styles.sourceVerifyText}>• Rasmiy tasdiqlangan</Text>
              </View>

              <View style={styles.lawItemBadgesRow}>
                <View style={styles.lawBadgeBlue}>
                  <Text style={styles.lawBadgeBlueText}>{law.badge}</Text>
                </View>
                <View style={styles.lawBadgeGray}>
                  <Text style={styles.lawBadgeGrayText}>{law.article}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* ==================== 10. ALOHIDA QONUN TAHLILI SAHIFASI (LAW DETAIL) ==================== */}
      {currentView === 'law_detail' && selectedLaw && (
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 30 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* 1. AVVAL: QONUN NOMI VA MAZMUNI */}
          <View style={styles.lawDetailTitleBox}>
            <View style={styles.lawBadgeRow}>
              <View style={styles.lawBadgeBlue}>
                <Text style={styles.lawBadgeBlueText}>{selectedLaw.badge}</Text>
              </View>
              <View style={styles.lawBadgeGray}>
                <Text style={styles.lawBadgeGrayText}>{selectedLaw.article}</Text>
              </View>
            </View>
            <Text style={styles.lawDetailMainTitle}>{selectedLaw.title}</Text>
            <Text style={styles.lawDetailSubtitle}>{selectedLaw.shortDesc}</Text>
          </View>

          {/* 2. MODDALAR MATNI VA FUQARO UCHUN SODDA TUSHUNTIRISH */}
          <Text style={styles.sectionHeaderTitle}>Asosiy moddalar va qonuniy bandlar</Text>

          {selectedLaw.keyArticles.map((art, idx) => (
            <View key={idx} style={styles.articleCardBlock}>
              <View style={styles.articleNumRow}>
                <View style={styles.articleNumPill}>
                  <Text style={styles.articleNumPillText}>{art.number}</Text>
                </View>
                <Text style={styles.articleHeadingText}>{art.heading}</Text>
              </View>

              {/* Qonunning asl rasmiy matni */}
              <View style={styles.articleQuoteBox}>
                <Text style={styles.articleQuoteText}>{art.originalQuote}</Text>
                <Text style={styles.articleQuoteCite}>— Qonunning rasmiy matnidan</Text>
              </View>

              {/* Sodda tildagi tushuntirish */}
              <View style={styles.articleExplanationBox}>
                <Text style={styles.articleExpTitle}>💡 Fuqaro uchun oddiy tushuntirish:</Text>
                <Text style={styles.articleExpText}>{art.explanation}</Text>
              </View>
            </View>
          ))}

          {/* 3. FUQARONING KAFOLATLANGAN HUQUQLARI */}
          <Text style={styles.sectionHeaderTitle}>Fuqaroning kafolatlangan huquqlari</Text>

          <View style={styles.citizenRightsCard}>
            {selectedLaw.citizenRights.map((right, rIdx) => (
              <View key={rIdx} style={styles.rightRowItem}>
                <Ionicons name="checkmark-circle" size={18} color="#2563EB" style={{ marginTop: 1 }} />
                <Text style={styles.rightRowText}>{right}</Text>
              </View>
            ))}
          </View>

          {/* Amaliy harakat tugmalari */}
          <TouchableOpacity
            style={styles.primaryActionButton}
            onPress={() => {
              navigateTo('chat');
              setChatInput(`Menga ${selectedLaw.title} bo‘yicha tushuntirish bering.`);
            }}
          >
            <Ionicons name="chatbubble-ellipses" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.primaryActionText}>Ushbu qonun bo‘yicha AI maslahat olish</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryActionButton}
            onPress={() => navigateTo('complaint')}
          >
            <Ionicons name="document-text-outline" size={18} color="#2563EB" style={{ marginRight: 6 }} />
            <Text style={styles.secondaryActionText}>Bankka e’tiroz xati shakllantirish</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topHeader: {
    height: 52,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 6,
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  headerTitleWrap: {
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  // Search Bar
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
  },

  // Hero Banner
  heroBanner: {
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  heroLeft: {
    flex: 1,
    paddingRight: 10,
  },
  heroBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  heroBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 12,
    color: '#DBEAFE',
    lineHeight: 16,
  },
  heroRight: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 6 Services Grid
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 16,
  },
  gridCard: {
    width: (width - 32 - 20) / 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  newBadgePill: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  newBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  gridIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  gridCardTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    lineHeight: 14,
  },

  // Warning Banner
  warningActionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
    gap: 10,
  },
  warningIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningTextBox: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#92400E',
  },
  warningDesc: {
    fontSize: 11,
    color: '#B45309',
    marginTop: 2,
    lineHeight: 15,
  },

  // Section Headers
  sectionHeaderTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
  },

  // Action cards
  actionCardsList: {
    gap: 8,
  },
  topicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  topicIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicInfo: {
    flex: 1,
  },
  topicTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  topicSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 15,
  },

  // TAB TOGGLE (Calc & Analysis)
  tabToggleRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
    gap: 6,
  },
  tabToggleBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabToggleBtnActive: {
    backgroundColor: '#2563EB',
  },
  tabToggleText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#475569',
  },
  tabToggleTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // Inputs
  inputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  inputCardLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 4,
  },
  inputWithSuffix: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputNumber: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    paddingVertical: 2,
  },
  inputSuffix: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  quickChipsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  quickChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  quickChipActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  quickChipText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  quickChipTextActive: {
    color: '#2563EB',
    fontWeight: '700',
  },

  // Buttons
  primaryActionButton: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 8,
    marginBottom: 14,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryActionText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryActionButton: {
    backgroundColor: '#EFF6FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 14,
  },
  secondaryActionText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#2563EB',
  },

  // Calculator Result
  resultSummaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  resultCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  resultCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  resultMonthlyLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  resultMonthlyVal: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2563EB',
    marginTop: 2,
    marginBottom: 12,
  },
  resultDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 10,
  },
  resultDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  resultDetailLabel: {
    fontSize: 12.5,
    color: '#64748B',
  },
  resultDetailValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  viewScheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F0F9FF',
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 14,
  },
  viewScheduleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
  },

  // Schedule list
  scheduleContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  scheduleHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  scheduleColHead: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    flex: 1,
    textAlign: 'center',
  },
  scheduleItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  scheduleMonthCell: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
    flex: 1,
    textAlign: 'center',
  },
  schedulePayCell: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
    flex: 1,
    textAlign: 'center',
  },
  schedulePrincCell: {
    fontSize: 10.5,
    color: '#64748B',
    flex: 1,
    textAlign: 'center',
  },
  scheduleIntCell: {
    fontSize: 10.5,
    color: '#DC2626',
    flex: 1,
    textAlign: 'center',
  },

  // Chat Screen Styles (Keyboard Avoiding View)
  chatWrapper: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  chatScroll: {
    flex: 1,
  },
  chatContent: {
    padding: 16,
  },
  userBubbleWrapper: {
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  userBubble: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    borderBottomRightRadius: 4,
    padding: 12,
    maxWidth: '82%',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  userBubbleText: {
    fontSize: 13.5,
    color: '#1E3A8A',
    lineHeight: 19,
  },
  userBubbleTime: {
    fontSize: 10,
    color: '#93C5FD',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  aiBubbleWrapper: {
    marginBottom: 14,
  },
  aiHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  aiAvatarBox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiAvatarName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  aiBubbleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderTopLeftRadius: 4,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  aiBubbleText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 19,
  },
  aiStepsBox: {
    marginTop: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
  },
  aiStepsTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  aiStepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 6,
  },
  aiStepPill: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  aiStepNum: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  aiStepText: {
    fontSize: 12,
    color: '#475569',
    flex: 1,
    lineHeight: 16,
  },
  lawBasisBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginTop: 10,
  },
  lawBasisText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2563EB',
  },
  chatLoadingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
  },
  chatLoadingText: {
    fontSize: 12,
    color: '#64748B',
  },
  chatInputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingTop: 8,
    gap: 8,
  },
  chatTextInput: {
    flex: 1,
    height: 42,
    backgroundColor: '#F1F5F9',
    borderRadius: 21,
    paddingHorizontal: 14,
    fontSize: 13,
    color: '#0F172A',
  },
  chatMicBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatSendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatSendBtnDisabled: {
    backgroundColor: '#94A3B8',
  },

  // Contract Screen
  contractHeroBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  contractIllustrationWrap: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 10,
  },
  magnifierPill: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 4,
    elevation: 2,
  },
  contractHeroTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 6,
  },
  contractHeroSubtitle: {
    fontSize: 12,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 17,
  },
  checklistCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    gap: 12,
  },
  checkItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkItemText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  orDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 10,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  orText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },

  // Analysis Screen
  fileHeaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
    gap: 10,
  },
  pdfBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  pdfBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#EF4444',
  },
  fileHeaderInfo: {
    flex: 1,
  },
  fileHeaderName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  fileHeaderSub: {
    fontSize: 11,
    color: '#64748B',
  },
  analysisCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  analysisScoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  analysisScoreTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  riskBadgeWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  riskBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
  },
  analysisScoreDesc: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 12,
  },
  metricsTable: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    gap: 8,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metricName: {
    fontSize: 12,
    color: '#475569',
    flex: 1,
  },
  metricValue: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  flaggedClauseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FECACA',
    marginBottom: 14,
  },
  clauseTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  clauseNum: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  clauseTagDanger: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#EF4444',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  clauseQuote: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#475569',
    lineHeight: 17,
    marginBottom: 8,
  },
  clauseAdvice: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#1E3A8A',
    backgroundColor: '#EFF6FF',
    padding: 8,
    borderRadius: 8,
    lineHeight: 16,
  },

  // MIB Screen
  mibHeroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  mibHeroTopRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  mibIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFFBEB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mibHeroInfo: {
    flex: 1,
  },
  mibHeroTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 18,
  },
  mibHeroDesc: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 3,
    lineHeight: 16,
  },
  mibBadgeRow: {
    flexDirection: 'row',
    gap: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  mibBadgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  mibBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#047857',
  },
  filterSectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 8,
  },
  filterPillsScroll: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 8,
  },
  filterPillActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  mibSolutionCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
    gap: 12,
  },
  solIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  solInfo: {
    flex: 1,
  },
  solTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  solDesc: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 16,
  },
  solTag: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
    marginTop: 6,
  },

  // Complaint Screen
  complaintHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  problemOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
    gap: 10,
  },
  problemOptionCardActive: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  probIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  probInfo: {
    flex: 1,
  },
  probTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  probDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  complaintFormBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 8,
    marginBottom: 16,
  },
  formBoxTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
  },
  formLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 4,
    marginTop: 6,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#0F172A',
  },
  generatedLetterBox: {
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    marginBottom: 16,
  },
  letterTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  letterTopTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#166534',
  },
  copyBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  letterContent: {
    fontSize: 12,
    color: '#1E293B',
    lineHeight: 18,
    fontFamily: 'monospace',
  },

  // Laws Screen
  lawsBannerCard: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    marginBottom: 16,
    gap: 12,
  },
  lawsBannerIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lawsBannerInfo: {
    flex: 1,
  },
  lawsBannerTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#1E3A8A',
  },
  lawsBannerDesc: {
    fontSize: 11.5,
    color: '#3B82F6',
    marginTop: 2,
    lineHeight: 16,
  },
  lawItemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  lawItemTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  lawItemTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    lineHeight: 18,
  },
  lawItemDesc: {
    fontSize: 11.5,
    color: '#64748B',
    lineHeight: 16,
    marginBottom: 8,
  },
  sourceSitePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  sourceSiteText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
  },
  sourceVerifyText: {
    fontSize: 10,
    color: '#059669',
    fontWeight: '500',
  },
  lawItemBadgesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  lawBadgeBlue: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  lawBadgeBlueText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563EB',
  },
  lawBadgeGray: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  lawBadgeGrayText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
  },

  // ==================== ALOHIDA QONUN DETAIL SAHIFASI STYLES ====================
  lawDetailTitleBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  lawBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  lawDetailSourceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    marginBottom: 16,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  sourceOfficialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0FDF4',
  },
  sourceLogoWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sourceOfficialLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: 0.5,
  },
  sourceNameText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  sourceDetailsList: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    gap: 8,
  },
  sourceMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sourceMetaKey: {
    fontSize: 11.5,
    color: '#64748B',
  },
  sourceMetaVal: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
  },
  sourceMetaValLink: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2563EB',
  },
  officialVerifyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 14,
  },
  officialVerifyText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#047857',
    flex: 1,
    lineHeight: 15,
  },
  openOfficialUrlBtn: {
    backgroundColor: '#059669',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    gap: 8,
    marginBottom: 8,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  openOfficialUrlBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  urlLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  urlLinkText: {
    fontSize: 11,
    color: '#2563EB',
    textDecorationLine: 'underline',
  },
  lawDetailMainTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 24,
    marginBottom: 6,
  },
  lawDetailSubtitle: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 16,
  },
  articleCardBlock: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  articleNumRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  articleNumPill: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  articleNumPillText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  articleHeadingText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
  },
  articleQuoteBox: {
    backgroundColor: '#F8FAFC',
    borderLeftWidth: 3,
    borderLeftColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 10,
  },
  articleQuoteText: {
    fontSize: 12,
    color: '#334155',
    fontStyle: 'italic',
    lineHeight: 17,
  },
  articleQuoteCite: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'right',
  },
  articleExplanationBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    padding: 10,
  },
  articleExpTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#1E3A8A',
    marginBottom: 4,
  },
  articleExpText: {
    fontSize: 12,
    color: '#1E40AF',
    lineHeight: 17,
  },
  citizenRightsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    gap: 10,
  },
  rightRowItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  rightRowText: {
    fontSize: 12.5,
    color: '#334155',
    flex: 1,
    lineHeight: 17,
  },
});
