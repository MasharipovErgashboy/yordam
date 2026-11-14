import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Image,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
  BackHandler,
  Keyboard,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { HuquqMaktabiScreen } from './HuquqMaktabiScreen';
import { IshVaMehnatHuquqiScreen } from './IshVaMehnatHuquqiScreen';
import { IstemolchiHuquqlariScreen } from './IstemolchiHuquqlariScreen';
import { HujjatlarHamyoniScreen } from './HujjatlarHamyoniScreen';
import { AiChatScreen } from './AiChat/AiChatScreen';
import { ContractAiScreen } from './ContractAi/ContractAiScreen';
import { LegalMapNavigator } from '../features/legal-map/LegalMapNavigator';
import { FraudRadarNavigator } from '../features/fraud-radar/FraudRadarNavigator';
import { YuristOnlineNavigator } from '../features/yurist-online/YuristOnlineNavigator';
import { FoydaliMalumotlarScreen } from './FoydaliMalumotlarScreen';
import { LEGAL_ARTICLES } from '../data/legalArticles';
import type { UserProfile } from '../services/authService';
import { legalServicesApi, BackendServiceItem } from '../services/legalServicesApi';

const { width } = Dimensions.get('window');

type TabType = 'home' | 'services' | 'ai_assistant' | 'profile';
type ServiceCategory = 'all' | 'ai' | 'documents' | 'protection';

interface MainHomeScreenProps {
  onBackToOnboarding?: () => void;
  isAuthenticated?: boolean;
  user?: UserProfile | null;
  onRequireAuth?: () => void;
  onLogout?: () => void;
  onOpenBankHuquq?: () => void;
  onOpenMurojaat?: () => void;
}

const logoImage = require('../../assets/images/logo.jpg');
const robotImage = require('../../assets/images/onboarding_2.png');
const articleGavelImage = require('../../assets/images/article_gavel.jpg');
const istemolchiHeroImage = require('../../assets/images/huquqlar_scale_book.png');
const contractAiImage = require('../../assets/images/bolimlar_checklist_3d_clean.png');
const courtBuildingImage = require('../../assets/images/court_building.png');
const lawyerHeroImage = require('../../assets/images/lawyer-female-call.jpg');

interface ServiceGridItem {
  id: string;
  title: string;
  iconName: string;
  iconFamily: 'Ionicons' | 'MaterialCommunityIcons' | 'FontAwesome5';
  iconColor: string;
  bgColor: string;
  detail: string;
}

// 8 Quick Grid services on Home Tab
const PRIMARY_SERVICES: ServiceGridItem[] = [
  {
    id: 'shartnoma_ai',
    title: 'Şartnoma\nAI',
    iconName: 'document-text',
    iconFamily: 'Ionicons',
    iconColor: '#0284C7',
    bgColor: '#F0F9FF',
    detail: 'Şartnomalarni yuklang va AI orqali yuridik xavflarni tahlil qiling.',
  },
  {
    id: 'murojaat',
    title: 'Murojaat',
    iconName: 'mail',
    iconFamily: 'Ionicons',
    iconColor: '#0284C7',
    bgColor: '#F0F9FF',
    detail: 'Davlat idoralariga ariza va şikoyat loyihalarini tayyorlaş.',
  },
  {
    id: 'firibgarlik_radari',
    title: 'Firibgarlik\nradari',
    iconName: 'shield-alert-outline',
    iconFamily: 'MaterialCommunityIcons',
    iconColor: '#F59E0B',
    bgColor: '#FFFBEB',
    detail: 'Şubhali havola, xabar va moliyaviy sxemalarni tekşiriş.',
  },
  {
    id: 'huquq_maktabi',
    title: 'Huquq\nmaktabi',
    iconName: 'school',
    iconFamily: 'Ionicons',
    iconColor: '#0284C7',
    bgColor: '#F0F9FF',
    detail: 'Kundalik huquqiy savodxonlik darslari va qöllanmalar.',
  },
  {
    id: 'hujjatlar_hamyoni',
    title: 'Hujjatlar\nhamyoni',
    iconName: 'folder',
    iconFamily: 'Ionicons',
    iconColor: '#F59E0B',
    bgColor: '#FFFBEB',
    detail: 'Şaxsiy va rasmiy hujjatlaringizning şifrlangan xavfsiz arxivi.',
  },
  {
    id: 'yurist_online',
    title: 'Yurist\nonline',
    iconName: 'headset',
    iconFamily: 'Ionicons',
    iconColor: '#0284C7',
    bgColor: '#F0F9FF',
    detail: 'Malakali advokat va huquqşunoslar bilan 24/7 boğlaniş.',
  },
  {
    id: 'istemolchi',
    title: 'Iste’molçi',
    iconName: 'cart',
    iconFamily: 'Ionicons',
    iconColor: '#F59E0B',
    bgColor: '#FFFBEB',
    detail: 'Xaridor huquqlari, kafolat va tovarlarni qaytariş masalalari.',
  },
  {
    id: 'ish_huquqi',
    title: 'Iş\nhuquqi',
    iconName: 'briefcase',
    iconFamily: 'Ionicons',
    iconColor: '#0284C7',
    bgColor: '#F0F9FF',
    detail: 'Mehnat şartnomasi, iş haqi, ta’til va işdan böşatiş huquqlari.',
  },
];

// Complete Structured Table Catalog for "Xizmatlar" Tab
interface DetailedServiceItem {
  id: string;
  name: string;
  category: 'ai' | 'documents' | 'protection';
  categoryLabel: string;
  description: string;
  fullExplanation: string;
  keyBenefits: string[];
  feature: string;
  iconName: string;
  iconFamily: 'Ionicons' | 'MaterialCommunityIcons';
  iconColor: string;
  iconBg: string;
  specialNote?: string;
  problemAreas?: string[];
  actionSteps?: string[];
}

const SERVICES_TABLE_CATALOG: DetailedServiceItem[] = [
  {
    id: 'shartnoma_ai',
    name: 'Şartnoma AI Tahlili',
    category: 'ai',
    categoryLabel: 'Yuridik tahlil',
    description: 'Oldi-sotdi, ijara yoki mehnat şartnomalaridagi xavfli bandlar va noaniqliklarni aniqlaş.',
    fullExplanation: 'Şartnomangizni rasm yoki PDF formatida yuklang. Şartnoma AI barça bandlarni çuqur tekşirib, siz uçun noqulay yoki xatarli şartlarni körsatib beradi.',
    keyBenefits: [
      'Xatarlarni 98% aniqlikda tezkor avtomatik tahlil qiliş',
      'Noaniq va ikki ma’noli yuridik atamalarni aniqlaş',
      'Şartnomani imzolaşdan oldin tavsiyalar va tuzatişlar beriş',
    ],
    feature: 'Avto-ekspertiza',
    iconName: 'document-text',
    iconFamily: 'Ionicons',
    iconColor: '#0284C7',
    iconBg: '#F0F9FF',
  },
  {
    id: 'legal_map',
    name: 'LegalMap (Yuridik Xarita)',
    category: 'protection',
    categoryLabel: 'Geolokatsiya & Advokatlar',
    description: 'Atrofingizdagi yuridik firma va advokaturalarni xaritada köring, narxlar balansida tanlab boğlaning.',
    fullExplanation: 'LegalMap — atrofingizdagi litsenziyalangan advokatlik byurolari, yuridik firmalar va mustaqil advokatlarni geolokatsiya orqali xaritada körsatuvçi interaktiv xizmat. Unda xizmat narxlari balansi, mijozlar reytingi va yuridik ixtisoslaşuv şaffof aks etadi.',
    keyBenefits: [
      'Atrofdagi eng yaqin advokatlik byurosi va yuridik firmalarni xaritada aniqlaş',
      'Xizmat narxlari balansi va şaffof narxlar röyxati (byudjetga mos tanlaş)',
      'Yuristlar reytingi, körib çiqqan işlari va ixtisoslaşuvini soliştiriş',
      'Bir bosiş orqali töğridan-töğri konsultatsiyaga yoziliş yoki boğlaniş',
    ],
    feature: 'Xarita & Narxlar',
    iconName: 'map-outline',
    iconFamily: 'Ionicons',
    iconColor: '#0284C7',
    iconBg: '#F0F9FF',
    specialNote: '📍 Geolokatsiya böyiça eng yaqin yuridik firmalar va narxlar balansi',
    problemAreas: [
      'Yaqin masofadagi advokatlar',
      'Arzon va maqbul narxlar balansi',
      'Sud va tergovda himoya',
      'Mijozlar reytingi va şarhlar',
    ],
  },
  {
    id: 'bank_kredit_himoyasi',
    name: 'Bank Kreditlari Himoyasi',
    category: 'protection',
    categoryLabel: 'Bank & Kredit huquqlari',
    description: 'Bank kreditlari böyiça fuqarolar huquqlarini himoya qiliş: kartadan pul yeçiş, foizlar va Markaziy bankka şikoyat.',
    fullExplanation: 'Amaliy huquqiy tadqiqot loyihasi: Özbekistonda bank kreditlari böyiça fuqarolar huquqlarini himoya qiliş. Asosiy yondaşuv: "Muammo → Qonun → Dalil → Yeçim". Bank kreditini qaytariş majburiyati bilan fuqaroning qonuniy huquqlari örtasidagi adolatli va qonuniy muvozanatni ta’minlaşga yönaltirilgan.',
    keyBenefits: [
      'Kartadan asossiz yoki ruxsatsiz pul yeçilganda bankka e’tiroz xatini şakllantiriş',
      'Töliq kredit qiymati, suğurta va yaşirin komissiyalarni qonuniy taftiş qiliş',
      'Roziliksiz (firibgarlik yöli bilan) olingan kreditlarni bekor qiliş tartibi',
      'Daromad kamayganda kredit restrukturizatsiyasi va imtiyoz söraş arizalari',
      'Markaziy bank (3030-son Nizom) va sud organlari orqali fuqaroni himoya qiliş',
    ],
    feature: 'MB 3030 & LexUZ',
    iconName: 'card-outline',
    iconFamily: 'Ionicons',
    iconColor: '#D97706',
    iconBg: '#FFFBEB',
    specialNote: '⚖️ Amaliy tahlil: Fuqarolik kodeksi, MB 3030-Nizomi va ÖRQ-1060 qonuni',
    problemAreas: [
      '1. Kartadan asossiz pul yeçiş',
      '2. Foizlar va qöşimça tölovlar',
      '3. Roziliksiz (firibgarlik) kreditlar',
      '4. Tölov qobiliyati pasayişi',
      '5. Muddatidan oldin qarz undiriş',
      '6. Markaziy bankka murojaatlar',
    ],
    actionSteps: [
      '1. Dalillarni saqlaş (şartnoma, SMS, bank köçirmasi)',
      '2. Bankka yozma murojaat va murojaat raqamini oliş',
      '3. Javobni şartnoma va qonunçilik bilan soliştiriş',
      '4. Markaziy bank yoki içki işlar organiga ariza',
      '5. Nizo hal bölmasa, sud himoyasi orqali hal etiş',
    ],
  },
  {
    id: 'firibgarlik_radari',
    name: 'Firibgarlik Radari',
    category: 'protection',
    categoryLabel: 'Xavfsizlik',
    description: 'Şubhali SMS havolalar, soxta aksiyalar va onlayn tölov firibgarliklarini tekşiriş.',
    fullExplanation: 'Firibgarlik Radari — internetda, Telegram va SMS xabarlarda tarqalayotgan şubhali havolalar, soxta saytlar va moliyaviy piramidalar xavfini tekşiriş uçun maxsus vosita.',
    keyBenefits: [
      'Havolani bir zumda xavfsizlik ma’lumotlar bazasi bilan soliştiriş',
      'Karta ma’lumotlarini öğirlovçi soxta fişing saytlarni aniqlaş',
      'Firibgarlarga aldanib qolganda tezkor harakatlar böyiça qöllanma',
    ],
    feature: 'Xavf filtri',
    iconName: 'shield-alert-outline',
    iconFamily: 'MaterialCommunityIcons',
    iconColor: '#F59E0B',
    iconBg: '#FFFBEB',
  },
  {
    id: 'murojaat',
    name: 'Murojaat va Arizalar',
    category: 'documents',
    categoryLabel: 'Davlat xizmatlari',
    description: 'Vazirliklar, sudlar va davlat organlariga rasmiy ariza va şikoyat loyihalarini tuziş.',
    fullExplanation: 'Davlat idoralari va taşkilotlariga taqdim etiladigan barça turdagi rasmiy ariza, şikoyat va takliflarni qonuniy andozalar asosida bir neça daqiqada tayyorlaş xizmati.',
    keyBenefits: [
      'Davlat idoralari qabul qiladigan rasmiy yuridik şablonlar',
      'Avtomatlaştirilgan rekvizitlar va moddalar kiritiş',
      'Tayyor hujjatni PDF yoki Word formatida yuklab oliş',
    ],
    feature: 'Tayyor loyiha',
    iconName: 'mail',
    iconFamily: 'Ionicons',
    iconColor: '#0284C7',
    iconBg: '#F0F9FF',
  },
  {
    id: 'hujjatlar_hamyoni',
    name: 'Hujjatlar Hamyoni',
    category: 'documents',
    categoryLabel: 'Şaxsiy arxiv',
    description: 'Şaxsiy hujjatlar, guvohnomalar, çeklar va şartnomalarning 256-bit şifrlangan arxivi.',
    fullExplanation: 'Barça muhim şartnomalaringiz, tölov kvitansiyalari, kafolat talonlari va rasmiy hujjatlaringizni bitta joyda xavfsiz va qulay tartibda saqlang.',
    keyBenefits: [
      'Harbiy darajadagi 256-bit şifrlangan xavfsiz bulutli xotira',
      'Hujjatlarning amal qiliş muddati tugaşidan oldin eslatmalar',
      'Kerakli hujjatni bir zumda qidirib topiş va ulaşiş imkoniyati',
    ],
    feature: 'Maxfiy arxiv',
    iconName: 'folder',
    iconFamily: 'Ionicons',
    iconColor: '#F59E0B',
    iconBg: '#FFFBEB',
  },
  {
    id: 'yurist_online',
    name: 'Yurist Online',
    category: 'protection',
    categoryLabel: 'Advokatlar',
    description: 'Litsenziyaga ega professional advokatlar va yuridik mutaxassislar bilan onlayn boğlaniş.',
    fullExplanation: 'Murakkab huquqiy masalalar, sud nizolari va şaxsiy himoya böyiça Özbekiston advokatlar palatasida röyxatdan ötgan malakali advokatlar bilan töğridan-töğri boğlaning.',
    keyBenefits: [
      'Tasdiqlangan litsenziyaga ega tajribali mutaxassislar',
      'Onlayn chat, audio yoki video konsultatsiya imkoniyati',
      'Şaxsiy sir va advokatlik daxlsizligi töliq kafolatlangan',
    ],
    feature: 'Jonli maslahat',
    iconName: 'headset',
    iconFamily: 'Ionicons',
    iconColor: '#0284C7',
    iconBg: '#F0F9FF',
  },
  {
    id: 'huquq_maktabi',
    name: 'Huquq Maktabi',
    category: 'protection',
    categoryLabel: 'Ta’lim',
    description: 'Fuqarolar uçun hayotiy huquqiy vaziyatlar, qöllanmalar, testlar va audio-darsliklar.',
    fullExplanation: 'Har bir fuqaro öz huquq va majburiyatlarini bilişi uçun sodda, vizual va tuşunarli şaklda yaratilgan bepul huquqiy savodxonlik kursi.',
    keyBenefits: [
      'Hayotiy vaziyatlarga bağişlangan qisqa va amaliy darslar',
      'Bilimlarni mustahkamlaş uçun interaktiv testlar',
      'Doimiy yangilanib boruvçi qonunçilik şarhlari',
    ],
    feature: 'Interaktiv',
    iconName: 'school',
    iconFamily: 'Ionicons',
    iconColor: '#0284C7',
    iconBg: '#F0F9FF',
  },
  {
    id: 'istemolchi',
    name: 'Iste’molçi Huquqlari',
    category: 'protection',
    categoryLabel: 'Xaridor himoyasi',
    description: 'Sifatsiz xarid, tölovni qaytariş, kafolat muddati va da’vo talablarini şakllantiriş.',
    fullExplanation: 'Dökonlar, onlayn bozorlar yoki xizmat körsatuvçilar tomonidan huquqlaringiz buzilganda tovarlarni almaştiriş yoki pulingizni qaytarib olişda yordam.',
    keyBenefits: [
      'Iste’molçilar huquqlarini himoya qiliş qonunçiligi asosida harakat',
      'Sotuvçiga yuboriladigan e’tiroz xati şablonini generatsiya qiliş',
      'Vakolatli davlat organlariga töğridan-töğri murojaat yöllaş',
    ],
    feature: 'Mablağni qaytariş',
    iconName: 'cart',
    iconFamily: 'Ionicons',
    iconColor: '#F59E0B',
    iconBg: '#FFFBEB',
  },
  {
    id: 'ish_huquqi',
    name: 'Iş va Mehnat Huquqi',
    category: 'protection',
    categoryLabel: 'Mehnat munosabatlari',
    description: 'Noqonuniy böşatiş, iş haqi uşlab qolinişi, ta’til va xodim huquqlarini himoya qiliş.',
    fullExplanation: 'Mehnat şartnomasi şartlari buzilişi, oylik maoh keçiktirilişi, noqonuniy jazo çoralari yoki asossiz işdan böşatiş böyiça töliq huquqiy yordam.',
    keyBenefits: [
      'Yangi tahrirdagi Mehnat Kodeksi böyiça huquqiy tahlil',
      'Mehnat inspeksiyasiga şikoyat arizasini tayyorlaş',
      'Noqonuniy böşatilganda işga tiklaş va kompensatsiya talab qiliş tartibi',
    ],
    feature: 'Mehnat himoyasi',
    iconName: 'briefcase',
    iconFamily: 'Ionicons',
    iconColor: '#0284C7',
    iconBg: '#F0F9FF',
  },
];

export const MainHomeScreen: React.FC<MainHomeScreenProps> = ({
  onBackToOnboarding,
  isAuthenticated = false,
  user = null,
  onRequireAuth,
  onLogout,
  onOpenBankHuquq,
  onOpenMurojaat,
}) => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [serviceCategory, setServiceCategory] = useState<ServiceCategory>('all');
  const [serviceSearch, setServiceSearch] = useState('');

  // Authentication check helper
  const checkAuth = useCallback(() => {
    if (!isAuthenticated) {
      onRequireAuth?.();
      return false;
    }
    return true;
  }, [isAuthenticated, onRequireAuth]);

  // Auto-rotating Swiper state
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const swiperScrollRef = useRef<any>(null);

  // Service Detail Custom Dialog Modal State
  const [selectedService, setSelectedService] = useState<DetailedServiceItem | null>(null);

  // Telefon orqaga tugmasi (Hardware Back)
  useEffect(() => {
    const onHardwareBack = () => {
      // 1. Agar xizmat modali ochiq bo'lsa, uni yopish
      if (selectedService) {
        setSelectedService(null);
        return true;
      }
      // 2. Agar qidiruv kiritilgan bo'lsa, qidiruvni tozalash
      if (searchQuery.trim().length > 0 || serviceSearch.trim().length > 0) {
        setSearchQuery('');
        setServiceSearch('');
        return true;
      }
      // 3. Agar 'home' tabida bo'lmasa, 'home' (bosh sahifa) tabiga qaytish
      if (activeTab !== 'home') {
        setActiveTab('home');
        return true;
      }
      // 4. Asosiy ekranda bo'lganda ilovadan chiqishni tasdiqlash
      Alert.alert(
        'Ilovadan chiqish',
        '«Yordam» ilovasidan chiqmoqchimisiz?',
        [
          { text: 'Bekor qilish', style: 'cancel' },
          { text: 'Chiqish', onPress: () => BackHandler.exitApp() },
        ]
      );
      return true;
    };

    const sub = BackHandler.addEventListener('hardwareBackPress', onHardwareBack);
    return () => sub.remove();
  }, [selectedService, searchQuery, serviceSearch, activeTab]);

  // Dynamic services synchronized with Backend & Admin Panel (Real-Time)
  const [backendServices, setBackendServices] = useState<Record<string, BackendServiceItem>>({});

  useEffect(() => {
    const unsubscribe = legalServicesApi.subscribeToRealtime((list) => {
      const map: Record<string, BackendServiceItem> = {};
      list.forEach((item) => {
        map[item.id] = item;
      });
      setBackendServices(map);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Huquq Maktabi Mini App State
  const [isHuquqMaktabiOpen, setIsHuquqMaktabiOpen] = useState(false);

  // Ish va Mehnat Huquqi Mini App State
  const [isIshHuquqiOpen, setIsIshHuquqiOpen] = useState(false);

  // Iste'molchi Huquqlari Mini App State
  const [isIstemolchiOpen, setIsIstemolchiOpen] = useState(false);

  // Hujjatlar Hamyoni Mini App State
  const [isHujjatlarHamyoniOpen, setIsHujjatlarHamyoniOpen] = useState(false);

  // Shartnoma AI to‘liq ekrani (bosh sahifa yoki xizmatlar katalogidan ochiladi)
  const [showContractAi, setShowContractAi] = useState(false);

  // LegalMap & Firibgarlik Radari Mini App State
  const [isLegalMapOpen, setIsLegalMapOpen] = useState(false);
  const [isFraudRadarOpen, setIsFraudRadarOpen] = useState(false);

  // Yurist Online Mini App State
  const [isYuristOnlineOpen, setIsYuristOnlineOpen] = useState(false);

  // Foydali ma'lumotlar Screen State
  const [isFoydaliMalumotlarOpen, setIsFoydaliMalumotlarOpen] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  // 5 Newest Promotional Swiper Banners (Auto-rotating under Search)
  const SWIPER_BANNERS = useMemo(() => [
    {
      id: 'banner_haqim_ai',
      badge: 'HAQIM AI',
      badgeBg: '#F59E0B',
      title: 'AI huquqiy yordamchi',
      desc: 'Savolingizni yozing va 24/7 tezkor huquqiy tahlil oling.',
      ctaText: 'AI bilan suhbat',
      colors: ['#003A70', '#074886', '#0B599E'] as const,
      image: robotImage,
      onPress: () => {
        if (!checkAuth()) return;
        setActiveTab('ai_assistant');
      },
    },
    {
      id: 'banner_istemolchi',
      badge: 'ISTE’MOLCHI HIMOYA',
      badgeBg: '#10B981',
      title: 'Sifatsiz tovar uchun 100% pulni qaytaring',
      desc: '14 kun ichida almashtirish va 1159 Raqobat qo‘mitasi arizalari.',
      ctaText: 'Arizani boshlash',
      colors: ['#064E3B', '#047857', '#059669'] as const,
      image: istemolchiHeroImage,
      onPress: () => {
        if (!checkAuth()) return;
        setIsIstemolchiOpen(true);
      },
    },
    {
      id: 'banner_shartnoma_ai',
      badge: 'SHARTNOMA AI',
      badgeBg: '#0284C7',
      title: 'Shartnomalardagi yashirin xavflarni toping',
      desc: 'PDF yoki foto yuklang — AI barcha tuzoqlarni fosh etadi.',
      ctaText: 'Hujjatni tekshirish',
      colors: ['#0C4A6E', '#0284C7', '#0369A1'] as const,
      image: contractAiImage,
      onPress: () => {
        if (!checkAuth()) return;
        setShowContractAi(true);
      },
    },
    {
      id: 'banner_fraud_radar',
      badge: 'XAVFSIZLIK RADARI',
      badgeBg: '#DC2626',
      title: 'Shubhali havola va kartalarni tekshiring',
      desc: 'Moliyaviy firibgarlik va fishing hujumlaridan himoyalaning.',
      ctaText: 'Radarni ochish',
      colors: ['#881337', '#BE123C', '#E11D48'] as const,
      image: courtBuildingImage,
      onPress: () => {
        if (!checkAuth()) return;
        setIsFraudRadarOpen(true);
      },
    },
    {
      id: 'banner_yurist_online',
      badge: 'YURIST ONLINE',
      badgeBg: '#8B5CF6',
      title: '150+ malakali advokatlar bilan bog‘laning',
      desc: 'Mehnat, sud, aliment va mulk bo‘yicha jonli konsultatsiya.',
      ctaText: 'Advokat tanlash',
      colors: ['#4C1D95', '#6D28D9', '#7C3AED'] as const,
      image: lawyerHeroImage,
      onPress: () => {
        if (!checkAuth()) return;
        setIsYuristOnlineOpen(true);
      },
    },
  ], [checkAuth]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % SWIPER_BANNERS.length;
        const bannerWidth = width - 40;
        swiperScrollRef.current?.scrollTo({
          x: nextIndex * bannerWidth,
          animated: true,
        });
        return nextIndex;
      });
    }, 4500);

    return () => clearInterval(timer);
  }, [SWIPER_BANNERS.length]);

  // Pastki panel balandligi — AI suhbat yozish paneli uning ustida turishi uchun o‘lchanadi
  const [navbarHeight, setNavbarHeight] = useState(64);
  // AI suhbatda klaviatura ochilganda pastki panel yashiriladi (yozish paneli klaviatura ustiga chiqadi)
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hide = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const hideNavbar = activeTab === 'ai_assistant' && keyboardVisible;

  const handleQuickGridClick = (item: ServiceGridItem) => {
    if (!checkAuth()) return;

    if (item.id === 'istemolchi') {
      setIsIstemolchiOpen(true);
      return;
    }
    if (item.id === 'hujjatlar_hamyoni') {
      setIsHujjatlarHamyoniOpen(true);
      return;
    }
    if (item.id === 'shartnoma_ai') {
      setShowContractAi(true);
      return;
    }
    if (item.id === 'firibgarlik_radari') {
      setIsFraudRadarOpen(true);
      return;
    }
    if (item.id === 'legal_map') {
      setIsLegalMapOpen(true);
      return;
    }
    if (item.id === 'yurist_online') {
      setIsYuristOnlineOpen(true);
      return;
    }
    // Find matching detailed service or show modal
    const detailed = SERVICES_TABLE_CATALOG.find((s) => s.id === item.id);
    if (detailed) {
      setSelectedService(detailed);
    } else {
      Alert.alert(item.title.replace('\n', ' '), item.detail);
    }
  };

  const handleDetailedServiceClick = (item: DetailedServiceItem) => {
    if (!checkAuth()) return;
    setSelectedService(item);
  };

  const handleUseService = () => {
    if (!checkAuth()) return;
    if (!selectedService) return;
    const sName = backendServices[selectedService.id]?.title || selectedService.name;
    const sId = selectedService.id;

    // Record unique user usage in backend
    legalServicesApi.recordUsage(sId, user);

    setSelectedService(null);

    if (sId === 'huquq_maktabi') {
      setIsHuquqMaktabiOpen(true);
    } else if (sId === 'ish_huquqi') {
      setIsIshHuquqiOpen(true);
    } else if (sId === 'istemolchi') {
      setIsIstemolchiOpen(true);
    } else if (sId === 'hujjatlar_hamyoni') {
      setIsHujjatlarHamyoniOpen(true);
    } else if (sId === 'shartnoma_ai') {
      setShowContractAi(true);
    } else if (sId === 'legal_map') {
      setIsLegalMapOpen(true);
    } else if (sId === 'firibgarlik_radari') {
      setIsFraudRadarOpen(true);
    } else if (sId === 'yurist_online') {
      setIsYuristOnlineOpen(true);
    } else if (sId === 'bank_kredit_himoyasi') {
      if (onOpenBankHuquq) {
        onOpenBankHuquq();
        return;
      }
      Alert.alert(
        'Bank Kreditlari Himoyasi',
        '🏦 Kredit masalalari böyiça amaliy yönalişni tanlang:\n\n1. Kartadan asossiz yeçilgan pulni qaytariş talabnomasi\n2. Yaşirin foiz va komissiyalar tahlili\n3. Roziliksiz (firibgarlik) rasmiylaştirilgan kredit şikoyati\n4. Kredit restrukturizatsiyasi va yengillik sörovi\n5. Markaziy bank (3030-son Nizom) va sudga murojaat\n\nTanlangan yönaliş böyiça ariza andozasi yuklanmoqda.',
        [{ text: 'Tuşundim' }]
      );
    } else if (sId === 'murojaat') {
      if (onOpenMurojaat) {
        onOpenMurojaat();
        return;
      }
    } else {
      Alert.alert(
        'Xizmat tanlandi',
        `"${sName}" xizmati işga tuşirilmoqda. Tez orada töliq interaktiv funksiyalar bilan integratsiya qilinadi.`,
        [{ text: 'Tuşundim' }]
      );
    }
  };

  const renderIcon = (item: ServiceGridItem) => {
    if (item.iconFamily === 'MaterialCommunityIcons') {
      return <MaterialCommunityIcons name={item.iconName as any} size={28} color={item.iconColor} />;
    }
    if (item.iconFamily === 'FontAwesome5') {
      return <FontAwesome5 name={item.iconName as any} size={26} color={item.iconColor} />;
    }
    return <Ionicons name={item.iconName as any} size={28} color={item.iconColor} />;
  };

  // Filtered detailed services for Table View
  const filteredTableServices = SERVICES_TABLE_CATALOG.filter((item) => {
    const matchesCategory =
      serviceCategory === 'all' || item.category === serviceCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
      item.description.toLowerCase().includes(serviceSearch.toLowerCase()) ||
      item.categoryLabel.toLowerCase().includes(serviceSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (isHuquqMaktabiOpen) {
    return <HuquqMaktabiScreen onBack={() => setIsHuquqMaktabiOpen(false)} currentUser={user} />;
  }

  if (isIshHuquqiOpen) {
    return <IshVaMehnatHuquqiScreen onBack={() => setIsIshHuquqiOpen(false)} />;
  }

  if (isIstemolchiOpen) {
    return (
      <IstemolchiHuquqlariScreen
        onBack={() => {
          setIsIstemolchiOpen(false);
          setActiveTab('services');
        }}
      />
    );
  }

  if (isHujjatlarHamyoniOpen) {
    return <HujjatlarHamyoniScreen onBack={() => setIsHujjatlarHamyoniOpen(false)} />;
  }

  if (showContractAi) {
    return (
      <ContractAiScreen
        onBack={() => setShowContractAi(false)}
        onAskAi={() => {
          setShowContractAi(false);
          setActiveTab('ai_assistant');
        }}
      />
    );
  }

  if (isLegalMapOpen) {
    return <LegalMapNavigator onBack={() => setIsLegalMapOpen(false)} />;
  }

  if (isFraudRadarOpen) {
    return <FraudRadarNavigator onBack={() => setIsFraudRadarOpen(false)} />;
  }

  if (isYuristOnlineOpen) {
    return <YuristOnlineNavigator onBack={() => setIsYuristOnlineOpen(false)} />;
  }

  if (isFoydaliMalumotlarOpen) {
    return (
      <FoydaliMalumotlarScreen
        initialArticleId={selectedArticleId}
        onBack={() => {
          setIsFoydaliMalumotlarOpen(false);
          setSelectedArticleId(null);
        }}
      />
    );
  }
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      {/* Top Header Bar */}
      <View style={styles.topHeader}>
        {/* Left: Brand Logo & Wordmark */}
        <View style={styles.brandContainer}>
          <Image
            source={logoImage}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.brandTitleText}>
            Y<Text style={styles.brandTitleAccent}>o</Text>rdam
          </Text>
        </View>

        {/* Right Action Icons: Scanner */}
        <View style={styles.headerRightActions}>
          {/* Notification Button */}
          <TouchableOpacity
            style={styles.iconCircleButton}
            activeOpacity={0.7}
            onPress={() => Alert.alert('Bildirişnomalar', 'Yangi xabarlar mavjud emas.')}
          >
            <Ionicons name="notifications-outline" size={20} color="#1F2937" />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
          {/* Scanner Button */}
          <TouchableOpacity
            style={styles.iconCircleButton}
            activeOpacity={0.7}
            onPress={() => Alert.alert('Hujjat skaneri', 'QR yoki hujjat skaneri tez orada işga tuşadi.')}
          >
            <Ionicons name="scan-outline" size={20} color="#1F2937" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ===================== TAB 3: AI YORDAMCHI (header va pastki panel orasida) ===================== */}
      {activeTab === 'ai_assistant' ? (
        <View style={styles.aiTabWrapper}>
          <AiChatScreen
            embedded
            bottomOffset={hideNavbar ? 0 : navbarHeight}
            onBack={() => setActiveTab('home')}
          />
        </View>
      ) : activeTab === 'services' ? (
        <View style={styles.servicesTabWrapper}>
          {/* Fixed Sticky Header for Services */}
          <View style={styles.stickyFilterHeader}>
            {/* Table Header Title (without count badge) */}
            <View style={styles.tableHeaderSection}>
              <Text style={styles.tableMainTitle}>Barça huquqiy xizmatlar</Text>
              <Text style={styles.tableSubtitleText}>
                Özbekiston Respublikasi qonunçiligiga asoslangan raqamli xizmatlar
              </Text>
            </View>

            {/* Search Input for Services */}
            <View style={styles.serviceSearchBar}>
              <Ionicons name="search" size={17} color="#9CA3AF" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.searchInput}
                placeholder="Xizmat nomi yoki toifasi böyiça izlaş..."
                placeholderTextColor="#9CA3AF"
                value={serviceSearch}
                onChangeText={setServiceSearch}
              />
              {serviceSearch.length > 0 && (
                <TouchableOpacity onPress={() => setServiceSearch('')}>
                  <Ionicons name="close-circle" size={17} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>

            {/* Category Filter Pills (No counts, clean tabs) */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryFilterRow}
            >
              <TouchableOpacity
                style={[
                  styles.filterPill,
                  serviceCategory === 'all' && styles.filterPillActive,
                ]}
                onPress={() => setServiceCategory('all')}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    serviceCategory === 'all' && styles.filterPillTextActive,
                  ]}
                >
                  Barçasi
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterPill,
                  serviceCategory === 'ai' && styles.filterPillActive,
                ]}
                onPress={() => setServiceCategory('ai')}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    serviceCategory === 'ai' && styles.filterPillTextActive,
                  ]}
                >
                  AI & Tahlil
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterPill,
                  serviceCategory === 'documents' && styles.filterPillActive,
                ]}
                onPress={() => setServiceCategory('documents')}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    serviceCategory === 'documents' && styles.filterPillTextActive,
                  ]}
                >
                  Hujjatlar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterPill,
                  serviceCategory === 'protection' && styles.filterPillActive,
                ]}
                onPress={() => setServiceCategory('protection')}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    serviceCategory === 'protection' && styles.filterPillTextActive,
                  ]}
                >
                  Himoya & Yurist
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* Scrollable Cards: Scrolls seamlessly underneath the sticky filter header */}
          <ScrollView
            style={styles.servicesScrollUnder}
            contentContainerStyle={[styles.servicesScrollContent, { paddingBottom: insets.bottom + 90 }]}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.tableListContainer}>
              {filteredTableServices.map((service, index) => (
                <TouchableOpacity
                  key={service.id}
                  style={[
                    styles.tableCardRow,
                    index === filteredTableServices.length - 1 && { marginBottom: 10 },
                  ]}
                  activeOpacity={0.8}
                  onPress={() => handleDetailedServiceClick(service)}
                >
                  {/* Left Column: Icon Box */}
                  <View style={[styles.tableIconWrap, { backgroundColor: service.iconBg }]}>
                    {service.iconFamily === 'MaterialCommunityIcons' ? (
                      <MaterialCommunityIcons
                        name={service.iconName as any}
                        size={24}
                        color={service.iconColor}
                      />
                    ) : (
                      <Ionicons
                        name={service.iconName as any}
                        size={24}
                        color={service.iconColor}
                      />
                    )}
                  </View>

                  {/* Center Column: Clean Service Details (No badges) */}
                  <View style={styles.tableDetailsCol}>
                    {/* Top: Service Name */}
                    <Text style={styles.tableServiceName} numberOfLines={1}>
                      {backendServices[service.id]?.title || service.name}
                    </Text>

                    {/* Middle: Short Description */}
                    <Text style={styles.tableServiceDesc} numberOfLines={2}>
                      {backendServices[service.id]?.desc || service.description}
                    </Text>

                    {/* Bottom Metadata Tags */}
                    <View style={styles.tableMetaTagsRow}>
                      <View style={styles.metaTagItem}>
                        <Ionicons name="checkmark-circle" size={11} color="#10B981" />
                        <Text style={styles.metaTagText}>{service.feature}</Text>
                      </View>

                      <View style={styles.metaCategoryTag}>
                        <Text style={styles.metaCategoryText}>
                          {backendServices[service.id]?.categoryLabel || service.categoryLabel}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Right Column: Arrow indicator */}
                  <View style={styles.tableArrowWrap}>
                    <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      ) : (
        /* ===================== OTHER TABS (HOME, PROFILE) ===================== */
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 85 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* ===================== 1. ASOSIY SAHIFA TAB ===================== */}
          {activeTab === 'home' && (
            <>
              {/* Search Input Bar */}
              <View style={styles.searchBar}>
                <Ionicons name="search" size={18} color="#9CA3AF" style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Masalan: mehnat şartnomasi, kredit, ijara..."
                  placeholderTextColor="#9CA3AF"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  returnKeyType="search"
                  onSubmitEditing={() => {
                    if (!checkAuth()) return;
                    if (searchQuery.trim().length > 0) {
                      setServiceSearch(searchQuery.trim());
                      setActiveTab('services');
                    }
                  }}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                  </TouchableOpacity>
                )}
              </View>

              {searchQuery.trim().length > 0 && (
                <TouchableOpacity
                  style={styles.homeSearchQuickJump}
                  activeOpacity={0.8}
                  onPress={() => {
                    if (!checkAuth()) return;
                    setServiceSearch(searchQuery.trim());
                    setActiveTab('services');
                  }}
                >
                  <Ionicons name="search" size={15} color="#0284C7" />
                  <Text style={styles.homeSearchQuickText}>
                    «{searchQuery}» böyiça xizmatlar katalogida qidiriş →
                  </Text>
                </TouchableOpacity>
              )}

              {/* 5-Banner Auto-rotating Swiper (Reklama va Yangiliklar) */}
              <View style={styles.swiperContainer}>
                <ScrollView
                  ref={swiperScrollRef}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  onMomentumScrollEnd={(e) => {
                    const bannerWidth = width - 40;
                    const index = Math.round(e.nativeEvent.contentOffset.x / bannerWidth);
                    if (index >= 0 && index < SWIPER_BANNERS.length) {
                      setCurrentSlideIndex(index);
                    }
                  }}
                  style={styles.swiperScrollView}
                  contentContainerStyle={styles.swiperContentContainer}
                >
                  {SWIPER_BANNERS.map((banner) => (
                    <TouchableOpacity
                      key={banner.id}
                      style={[styles.swiperSlide, { width: width - 40 }]}
                      activeOpacity={0.92}
                      onPress={banner.onPress}
                    >
                      <LinearGradient
                        colors={banner.colors}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.heroBanner}
                      >
                        {/* Left Texts & Button */}
                        <View style={styles.heroLeft}>
                          <View style={[styles.haqimBadge, { backgroundColor: banner.badgeBg }]}>
                            <Text style={styles.haqimBadgeText}>{banner.badge}</Text>
                          </View>

                          <Text style={styles.heroTitle} numberOfLines={2}>
                            {banner.title}
                          </Text>
                          <Text style={styles.heroDesc} numberOfLines={2}>
                            {banner.desc}
                          </Text>

                          {/* Action CTA Button */}
                          <View style={styles.heroCtaBtn}>
                            <Text style={styles.heroCtaText}>{banner.ctaText}</Text>
                            <Ionicons name="chevron-forward" size={13} color="#002B49" />
                          </View>
                        </View>

                        {/* Right Banner Image */}
                        <View style={styles.heroRight}>
                          <Image
                            source={banner.image}
                            style={styles.heroRobotImage}
                            resizeMode="contain"
                          />
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Swiper Pagination Indicators */}
                <View style={styles.swiperDotsRow}>
                  {SWIPER_BANNERS.map((_, dotIdx) => (
                    <TouchableOpacity
                      key={dotIdx}
                      activeOpacity={0.7}
                      onPress={() => {
                        const bannerWidth = width - 40;
                        swiperScrollRef.current?.scrollTo({
                          x: dotIdx * bannerWidth,
                          animated: true,
                        });
                        setCurrentSlideIndex(dotIdx);
                      }}
                      style={[
                        styles.swiperDot,
                        currentSlideIndex === dotIdx && styles.swiperDotActive,
                      ]}
                    />
                  ))}
                </View>
              </View>

              {/* Section: Asosiy xizmatlar */}
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Asosiy xizmatlar</Text>
                <TouchableOpacity
                  onPress={() => {
                    if (!checkAuth()) return;
                    setActiveTab('services');
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.seeAllText}>Barçasini köriş ›</Text>
                </TouchableOpacity>
              </View>

              {/* 8 Services Grid (4 per row x 2 rows) */}
              <View style={styles.servicesGrid}>
                {PRIMARY_SERVICES.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.serviceItemCard}
                    activeOpacity={0.75}
                    onPress={() => handleQuickGridClick(item)}
                  >
                    <View style={styles.serviceIconBox}>
                      {renderIcon(item)}
                    </View>
                    <Text style={styles.serviceTitleText}>
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Section: Foydali ma'lumotlar */}
              <View style={[styles.sectionHeaderRow, { marginTop: 8 }]}>
                <Text style={styles.sectionTitle}>Foydali ma’lumotlar</Text>
                <TouchableOpacity
                  onPress={() => {
                    if (!checkAuth()) return;
                    setSelectedArticleId(null);
                    setIsFoydaliMalumotlarOpen(true);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.seeAllText}>Barchasini ko‘rish ›</Text>
                </TouchableOpacity>
              </View>

              {/* 5 eng yangi chiqqan maqolalar */}
              {LEGAL_ARTICLES.slice(0, 5).map((article) => (
                <TouchableOpacity
                  key={article.id}
                  style={styles.articleCard}
                  activeOpacity={0.85}
                  onPress={() => {
                    if (!checkAuth()) return;
                    setSelectedArticleId(article.id);
                    setIsFoydaliMalumotlarOpen(true);
                  }}
                >
                  {/* Article Thumbnail Image */}
                  <Image
                    source={articleGavelImage}
                    style={styles.articleImage}
                    resizeMode="cover"
                  />

                  {/* Article Details */}
                  <View style={styles.articleInfo}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <View style={[styles.categoryBadge, { backgroundColor: article.badgeBg }]}>
                        <Text style={[styles.categoryBadgeText, { color: article.badgeColor }]}>
                          {article.categoryLabel}
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                        <Ionicons name="time-outline" size={10.5} color="#64748B" />
                        <Text style={{ fontSize: 10, color: '#64748B', fontWeight: '500' }}>{article.readTime}</Text>
                      </View>
                    </View>

                    <Text style={styles.articleTitle} numberOfLines={2}>
                      {article.title}
                    </Text>

                    {/* Date & Views Meta */}
                    <View style={styles.articleMetaRow}>
                      <View style={styles.metaItem}>
                        <Ionicons name="calendar-outline" size={12} color="#9CA3AF" />
                        <Text style={styles.metaText}>{article.date}</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Ionicons name="eye-outline" size={12} color="#9CA3AF" />
                        <Text style={styles.metaText}>{article.views}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </>
          )}

          {/* ===================== 4. PROFIL TAB (PREMIUM REDESIGN) ===================== */}
          {activeTab === 'profile' && (
            <View style={styles.tabContentContainer}>
              {/* 1. User Hero Card */}
              <View style={styles.profileHeroCard}>
                <View style={styles.profileHeroTop}>
                  <LinearGradient
                    colors={['#0284C7', '#00A3FF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.profileAvatarLarge}
                  >
                    <Text style={styles.profileAvatarInitials}>
                      {user?.avatar || (user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'YD')}
                    </Text>
                  </LinearGradient>

                  <View style={{ flex: 1, marginLeft: 14 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={styles.profileHeroName} numberOfLines={1}>
                        {user?.name || (user ? `${user.firstName} ${user.lastName}` : 'O‘zbekiston Fuqarosi')}
                      </Text>
                      <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                    </View>

                    <View style={styles.profileBadgesRow}>
                      <View style={styles.roleBadge}>
                        <Text style={styles.roleBadgeText}>{user?.role || 'Fuqaro'}</Text>
                      </View>
                      <View style={styles.verifiedBadge}>
                        <Ionicons name="shield-checkmark" size={11} color="#10B981" />
                        <Text style={styles.verifiedBadgeText}>OneID tasdiqlangan</Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Contact info list inside card */}
                <View style={styles.profileContactList}>
                  {user?.phone ? (
                    <View style={styles.profileContactRow}>
                      <Ionicons name="call-outline" size={14} color="#0284C7" />
                      <Text style={styles.profileContactText}>{user.phone}</Text>
                    </View>
                  ) : null}
                  {user?.email ? (
                    <View style={styles.profileContactRow}>
                      <Ionicons name="mail-outline" size={14} color="#0284C7" />
                      <Text style={styles.profileContactText}>{user.email}</Text>
                    </View>
                  ) : null}
                  <View style={styles.profileContactRow}>
                    <Ionicons name="calendar-outline" size={14} color="#64748B" />
                    <Text style={[styles.profileContactText, { color: '#64748B' }]}>
                      Ro‘yxatdan o‘tgan: {user?.registered || '13.11.2026'}
                    </Text>
                  </View>
                </View>
              </View>

              {/* 2. Quick Activity KPI Strip */}
              <View style={styles.profileStatsRow}>
                <View style={styles.profileStatItem}>
                  <Text style={styles.profileStatNumber}>{user?.appsCount || 0}</Text>
                  <Text style={styles.profileStatLabel}>Arizalarim</Text>
                </View>
                <View style={styles.profileStatDivider} />
                <View style={styles.profileStatItem}>
                  <Text style={[styles.profileStatNumber, { color: '#0284C7' }]}>0</Text>
                  <Text style={styles.profileStatLabel}>AI tahlillari</Text>
                </View>
                <View style={styles.profileStatDivider} />
                <View style={styles.profileStatItem}>
                  <Text style={[styles.profileStatNumber, { color: '#10B981' }]}>100%</Text>
                  <Text style={styles.profileStatLabel}>Himoyalangan</Text>
                </View>
              </View>

              {/* 3. Section: Yuridik xizmatlarim & Hujjatlar */}
              <Text style={styles.profileSectionTitle}>YURIDIK XIZMATLAR VA ARXIV</Text>
              <View style={styles.profileMenuBox}>
                <TouchableOpacity
                  style={styles.profileMenuItem}
                  activeOpacity={0.7}
                  onPress={() => setIsHujjatlarHamyoniOpen(true)}
                >
                  <View style={[styles.profileMenuIconWrap, { backgroundColor: '#FFFBEB' }]}>
                    <Ionicons name="folder" size={20} color="#F59E0B" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.profileMenuText}>Hujjatlar hamyoni</Text>
                    <Text style={styles.profileMenuSubText}>Pasport, shartnoma va rasmiy arxiv</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.profileMenuItem}
                  activeOpacity={0.7}
                  onPress={() => setShowContractAi(true)}
                >
                  <View style={[styles.profileMenuIconWrap, { backgroundColor: '#F0F9FF' }]}>
                    <Ionicons name="document-text" size={20} color="#0284C7" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.profileMenuText}>Shartnoma AI tahlili</Text>
                    <Text style={styles.profileMenuSubText}>Yuridik xavflar va shartnomalar xulosasi</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.profileMenuItem}
                  activeOpacity={0.7}
                  onPress={() => setIsYuristOnlineOpen(true)}
                >
                  <View style={[styles.profileMenuIconWrap, { backgroundColor: '#ECFDF5' }]}>
                    <Ionicons name="headset" size={20} color="#10B981" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.profileMenuText}>Yurist Online</Text>
                    <Text style={styles.profileMenuSubText}>Advokatlar bilan jonli maslahatlashuv</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.profileMenuItem, { borderBottomWidth: 0 }]}
                  activeOpacity={0.7}
                  onPress={() => setIsLegalMapOpen(true)}
                >
                  <View style={[styles.profileMenuIconWrap, { backgroundColor: '#F5F3FF' }]}>
                    <Ionicons name="map" size={20} color="#8B5CF6" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.profileMenuText}>Huquqiy xarita</Text>
                    <Text style={styles.profileMenuSubText}>Yaqin oradagi sud, notarius va FHDYo</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              {/* 4. Section: Sozlamalar va xavfsizlik */}
              <Text style={styles.profileSectionTitle}>SOZLAMALAR VA XAVFSIZLIK</Text>
              <View style={styles.profileMenuBox}>
                <TouchableOpacity style={styles.profileMenuItem} activeOpacity={0.7}>
                  <View style={[styles.profileMenuIconWrap, { backgroundColor: '#F0F9FF' }]}>
                    <Ionicons name="globe-outline" size={20} color="#0284C7" />
                  </View>
                  <Text style={styles.profileMenuText}>Dastur tili</Text>
                  <Text style={styles.profileMenuSub}>O‘zbekcha (Lotin)</Text>
                  <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.profileMenuItem} activeOpacity={0.7}>
                  <View style={[styles.profileMenuIconWrap, { backgroundColor: '#ECFDF5' }]}>
                    <Ionicons name="shield-checkmark-outline" size={20} color="#10B981" />
                  </View>
                  <Text style={styles.profileMenuText}>Xavfsizlik va biometriya</Text>
                  <Text style={styles.profileMenuSub}>Faol</Text>
                  <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                </TouchableOpacity>

                {onBackToOnboarding && (
                  <TouchableOpacity
                    style={[styles.profileMenuItem, { borderBottomWidth: 0 }]}
                    activeOpacity={0.7}
                    onPress={onBackToOnboarding}
                  >
                    <View style={[styles.profileMenuIconWrap, { backgroundColor: '#FFFBEB' }]}>
                      <Ionicons name="refresh-outline" size={20} color="#F59E0B" />
                    </View>
                    <Text style={styles.profileMenuText}>Kirish taqdimotini qayta ko‘rish</Text>
                    <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                  </TouchableOpacity>
                )}
              </View>

              {/* 5. Section: Qo‘llab-quvvatlash */}
              <Text style={styles.profileSectionTitle}>QO‘LLAB-QUVVATLASH</Text>
              <View style={styles.profileMenuBox}>
                <TouchableOpacity
                  style={styles.profileMenuItem}
                  activeOpacity={0.7}
                  onPress={() =>
                    Alert.alert(
                      'Yordam markazi',
                      'Yordam huquqiy portali yagona koll-markazi: 1159 yoki +998 (71) 200-00-00\n\nIsh vaqti: 24/7 uzluksiz'
                    )
                  }
                >
                  <View style={[styles.profileMenuIconWrap, { backgroundColor: '#F0F9FF' }]}>
                    <Ionicons name="call-outline" size={20} color="#0284C7" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.profileMenuText}>Koll-markaz: 1159</Text>
                    <Text style={styles.profileMenuSubText}>24/7 bepul huquqiy aloqa</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.profileMenuItem, { borderBottomWidth: 0 }]}
                  activeOpacity={0.7}
                  onPress={() =>
                    Alert.alert(
                      'Yordam ilovasi',
                      'Yordam — O‘zbekiston fuqarolari uchun rasmiy huquqiy ko‘makchi dasturi.\n\nTalqin: v1.0.0 (Rasmiy nashr)\n© 2026 Barcha huquqlar himoyalangan.'
                    )
                  }
                >
                  <View style={[styles.profileMenuIconWrap, { backgroundColor: '#F1F5F9' }]}>
                    <Ionicons name="information-circle-outline" size={20} color="#64748B" />
                  </View>
                  <Text style={styles.profileMenuText}>Ilova haqida</Text>
                  <Text style={styles.profileMenuSub}>v1.0.0</Text>
                  <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              {/* 6. Logout Button */}
              {onLogout && (
                <TouchableOpacity
                  style={styles.profileLogoutCard}
                  activeOpacity={0.8}
                  onPress={() => {
                    Alert.alert(
                      'Tizimdan chiqish',
                      'Haqiqatan ham profilingizdan chiqmoqchimisiz?',
                      [
                        { text: 'Bekor qilish', style: 'cancel' },
                        {
                          text: 'Chiqish',
                          style: 'destructive',
                          onPress: () => {
                            onLogout();
                            setActiveTab('home');
                          },
                        },
                      ]
                    );
                  }}
                >
                  <Ionicons name="log-out-outline" size={20} color="#EF4444" style={{ marginRight: 8 }} />
                  <Text style={styles.profileLogoutText}>Tizimdan chiqish</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </ScrollView>
      )}

      {/* ===================== BOTTOM NAVBAR (MATCHING SCREENSHOT) ===================== */}
      <View
        style={[
          styles.bottomNavbar,
          { paddingBottom: Math.max(insets.bottom, 8) },
          hideNavbar && styles.bottomNavbarHidden,
        ]}
        onLayout={(e) => {
          const h = Math.round(e.nativeEvent.layout.height);
          if (h > 0 && h !== navbarHeight) setNavbarHeight(h);
        }}
      >
        {/* 1. Asosiy sahifa (Active) */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('home')}
          activeOpacity={0.7}
        >
          {activeTab === 'home' ? (
            <View style={styles.activePillContainer}>
              <Ionicons name="home" size={20} color="#D97706" />
            </View>
          ) : (
            <Ionicons name="home-outline" size={22} color="#4B5563" />
          )}
          <Text
            style={[
              styles.navLabel,
              activeTab === 'home' ? styles.navLabelActive : styles.navLabelInactive,
            ]}
          >
            Asosiy sahifa
          </Text>
        </TouchableOpacity>

        {/* 2. Xizmatlar */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            if (!checkAuth()) return;
            setActiveTab('services');
          }}
          activeOpacity={0.7}
        >
          {activeTab === 'services' ? (
            <View style={styles.activePillContainer}>
              <Ionicons name="grid" size={20} color="#D97706" />
            </View>
          ) : (
            <MaterialCommunityIcons name="view-grid-outline" size={22} color="#4B5563" />
          )}
          <Text
            style={[
              styles.navLabel,
              activeTab === 'services' ? styles.navLabelActive : styles.navLabelInactive,
            ]}
          >
            Xizmatlar
          </Text>
        </TouchableOpacity>

        {/* 3. AI yordamchi */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            if (!checkAuth()) return;
            setActiveTab('ai_assistant');
          }}
          activeOpacity={0.7}
        >
          {activeTab === 'ai_assistant' ? (
            <View style={styles.activePillContainer}>
              <Ionicons name="sparkles" size={20} color="#D97706" />
            </View>
          ) : (
            <Ionicons name="sparkles-outline" size={22} color="#4B5563" />
          )}
          <Text
            style={[
              styles.navLabel,
              activeTab === 'ai_assistant' ? styles.navLabelActive : styles.navLabelInactive,
            ]}
          >
            AI yordamchi
          </Text>
        </TouchableOpacity>

        {/* 4. Profil */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            if (!checkAuth()) return;
            setActiveTab('profile');
          }}
          activeOpacity={0.7}
        >
          {activeTab === 'profile' ? (
            <View style={styles.activePillContainer}>
              <Ionicons name="person" size={20} color="#D97706" />
            </View>
          ) : (
            <Ionicons name="person-outline" size={22} color="#4B5563" />
          )}
          <Text
            style={[
              styles.navLabel,
              activeTab === 'profile' ? styles.navLabelActive : styles.navLabelInactive,
            ]}
          >
            Profil
          </Text>
        </TouchableOpacity>
      </View>

      {/* ===================== CUSTOM SERVICE DETAIL MODAL (MARKAZIY ALERT) ===================== */}
      <Modal
        visible={!!selectedService}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setSelectedService(null)}
      >
        <View style={styles.modalOverlay}>
          {/* Orqa fon: bosganda yopiladi */}
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setSelectedService(null)}
          />

          <View style={styles.modalDialogCard}>
            {/* Header with Close Icon */}
            <View style={styles.modalHeaderRow}>
              <View style={[styles.modalIconBox, { backgroundColor: selectedService?.iconBg }]}>
                {selectedService?.iconFamily === 'MaterialCommunityIcons' ? (
                  <MaterialCommunityIcons
                    name={selectedService.iconName as any}
                    size={28}
                    color={selectedService.iconColor}
                  />
                ) : (
                  <Ionicons
                    name={selectedService?.iconName as any}
                    size={28}
                    color={selectedService?.iconColor}
                  />
                )}
              </View>

              <TouchableOpacity
                onPress={() => setSelectedService(null)}
                style={styles.modalCloseBtn}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Ionicons name="close-circle" size={26} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            {/* Service Title & Category Badge */}
            <View style={styles.modalTitleBlock}>
              <Text style={styles.modalServiceName}>
                {selectedService ? (backendServices[selectedService.id]?.title || selectedService.name) : ''}
              </Text>
              <View style={styles.modalCategoryBadge}>
                <Text style={styles.modalCategoryText}>
                  {selectedService ? (backendServices[selectedService.id]?.categoryLabel || selectedService.categoryLabel) : ''}
                </Text>
              </View>
            </View>

            <ScrollView
              style={styles.modalBodyScroll}
              showsVerticalScrollIndicator={false}
            >
              {/* Short description from backend or catalog */}
              {selectedService && (
                <Text style={[styles.tableServiceDesc, { marginBottom: 12, fontSize: 13, color: '#4B5563', lineHeight: 18 }]}>
                  {backendServices[selectedService.id]?.desc || selectedService.description}
                </Text>
              )}

              {/* Special Note / Project Basis Badge */}
              {selectedService?.specialNote && (
                <View style={styles.modalSpecialNoteBox}>
                  <Text style={styles.modalSpecialNoteText}>{selectedService.specialNote}</Text>
                </View>
              )}

              {/* Service Explanation Text */}
              <Text style={styles.modalExplanationText}>
                {selectedService?.fullExplanation}
              </Text>

              {/* Problem Areas (e.g. 6 Core Banking Problems or Map Filters) */}
              {selectedService?.problemAreas && selectedService.problemAreas.length > 0 && (
                <View style={styles.modalProblemsBox}>
                  <Text style={styles.modalSectionSmallTitle}>
                    {selectedService.id === 'bank_kredit_himoyasi'
                      ? 'Örganiladigan 6 ta asosiy muammo:'
                      : 'Asosiy yönalişlar va filtrlar:'}
                  </Text>
                  <View style={styles.modalProblemsGrid}>
                    {selectedService.problemAreas.map((prob, idx) => (
                      <View key={`prob-${idx}`} style={styles.problemTag}>
                        <Ionicons
                          name={selectedService.id === 'bank_kredit_himoyasi' ? 'shield-outline' : 'navigate-outline'}
                          size={13}
                          color="#0284C7"
                          style={{ marginRight: 4 }}
                        />
                        <Text style={styles.problemTagText}>{prob}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Key Benefits List */}
              <View style={styles.modalBenefitsBox}>
                <Text style={styles.modalBenefitsTitle}>Asosiy imkoniyatlar:</Text>
                {selectedService?.keyBenefits.map((benefit, i) => (
                  <View key={`b-${i}`} style={styles.benefitRow}>
                    <Ionicons name="checkmark-circle" size={15} color="#10B981" style={{ marginTop: 2 }} />
                    <Text style={styles.benefitText}>{benefit}</Text>
                  </View>
                ))}
              </View>

              {/* Practical 5-step action plan */}
              {selectedService?.actionSteps && selectedService.actionSteps.length > 0 && (
                <View style={styles.modalStepsBox}>
                  <Text style={styles.modalSectionSmallTitle}>Fuqaro huquqi buzilganda amaliy harakat rejasi:</Text>
                  {selectedService.actionSteps.map((step, idx) => (
                    <View key={`step-${idx}`} style={styles.stepRow}>
                      <View style={styles.stepNumPill}>
                        <Text style={styles.stepNumText}>{idx + 1}</Text>
                      </View>
                      <Text style={styles.stepText}>{step}</Text>
                    </View>
                  ))}
                </View>
              )}
            </ScrollView>

            {/* Action Buttons */}
            <TouchableOpacity
              style={styles.useServiceBtn}
              activeOpacity={0.88}
              onPress={handleUseService}
            >
              <Text style={styles.useServiceBtnText}>Xizmatdan foydalaniş</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              activeOpacity={0.7}
              onPress={() => setSelectedService(null)}
            >
              <Text style={styles.cancelBtnText}>Bekor qiliş</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoImage: {
    width: 45,
    height: 39,
  },
  brandTitleText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#033B6A',
    letterSpacing: 0.5,
  },
  brandTitleAccent: {
    color: '#F59E0B',
    fontWeight: '600',
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#F59E0B',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 46,
    marginTop: 4,
    marginBottom: 18,
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    color: '#1F2937',
    paddingVertical: 0,
  },
  heroBannerWrap: {
    width: '100%',
    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#003A70',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 5,
  },
  swiperContainer: {
    width: '100%',
    marginBottom: 20,
  },
  swiperScrollView: {
    borderRadius: 22,
  },
  swiperContentContainer: {
    alignItems: 'center',
  },
  swiperSlide: {
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#003A70',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 5,
  },
  swiperDotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 10,
  },
  swiperDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
  },
  swiperDotActive: {
    width: 22,
    backgroundColor: '#0284C7',
  },
  heroBanner: {
    flexDirection: 'row',
    paddingLeft: 18,
    paddingRight: 10,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 145,
  },
  heroLeft: {
    flex: 1,
    paddingRight: 6,
  },
  haqimBadge: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  haqimBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#002B49',
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 22,
    marginBottom: 4,
  },
  heroDesc: {
    fontSize: 12,
    color: '#E0E7FF',
    lineHeight: 16,
    marginBottom: 12,
  },
  heroCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F59E0B',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 4,
  },
  heroCtaText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#002B49',
  },
  heroRight: {
    width: 110,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroRobotImage: {
    width: 115,
    height: 115,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  seeAllText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#D97706',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 16,
  },
  serviceItemCard: {
    width: (width - 40 - 24) / 4,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  serviceIconBox: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  serviceTitleText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    lineHeight: 14,
  },
  articleCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 14,
  },
  articleImage: {
    width: 92,
    height: 72,
    borderRadius: 12,
  },
  articleInfo: {
    flex: 1,
    marginLeft: 12,
  },
  categoryBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563EB',
  },
  articleTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 17,
    marginBottom: 6,
  },
  articleMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 10.5,
    color: '#9CA3AF',
    fontWeight: '500',
  },

  // ===================== SERVICES TAB (STICKY / FIXED HEADER VIEW) =====================
  servicesTabWrapper: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  stickyFilterHeader: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    zIndex: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  tableHeaderSection: {
    marginBottom: 10,
  },
  tableMainTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  tableSubtitleText: {
    fontSize: 12.5,
    color: '#6B7280',
    marginTop: 2,
    lineHeight: 16,
  },
  serviceSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 42,
    marginBottom: 10,
  },
  categoryFilterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 10,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterPillActive: {
    backgroundColor: '#033B6A',
    borderColor: '#033B6A',
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  servicesScrollUnder: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  servicesScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  tableListContainer: {
    gap: 10,
  },
  tableCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  tableIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  tableDetailsCol: {
    flex: 1,
  },
  tableServiceName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 3,
  },
  tableServiceDesc: {
    fontSize: 11.5,
    color: '#6B7280',
    lineHeight: 15,
    marginBottom: 6,
  },
  tableMetaTagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaTagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#059669',
  },
  metaCategoryTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  metaCategoryText: {
    fontSize: 9.5,
    color: '#6B7280',
    fontWeight: '500',
  },
  tableArrowWrap: {
    paddingLeft: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Tab container styles
  tabContentContainer: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  profileHeroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  profileHeroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  profileAvatarLarge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  profileAvatarInitials: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  profileHeroName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  profileBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 5,
  },
  roleBadge: {
    backgroundColor: 'rgba(2, 132, 199, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(2, 132, 199, 0.2)',
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0284C7',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  verifiedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10B981',
  },
  profileContactList: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
    gap: 7,
  },
  profileContactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profileContactText: {
    fontSize: 12.5,
    color: '#334155',
    fontWeight: '500',
  },

  // KPI Quick Stats
  profileStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 14,
    paddingHorizontal: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  profileStatItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileStatNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  profileStatLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  profileStatDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#E2E8F0',
  },

  // Profile Sections & Lists
  profileSectionTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.8,
    marginLeft: 4,
    marginBottom: 8,
    marginTop: 6,
  },
  profileMenuBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  profileMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 12,
  },
  profileMenuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileMenuText: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  profileMenuSubText: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
  profileMenuSub: {
    fontSize: 12,
    color: '#64748B',
    marginRight: 4,
    fontWeight: '500',
  },

  // Logout card
  profileLogoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    borderRadius: 16,
    paddingVertical: 14,
    marginTop: 6,
    marginBottom: 18,
  },
  profileLogoutText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#EF4444',
  },

  // Bottom Navbar
  bottomNavbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  bottomNavbarHidden: {
    display: 'none',
  },
  aiTabWrapper: {
    flex: 1,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  activePillContainer: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  navLabel: {
    fontSize: 10.5,
    marginTop: 3,
  },
  navLabelActive: {
    color: '#B45309',
    fontWeight: '700',
  },
  navLabelInactive: {
    color: '#4B5563',
    fontWeight: '500',
  },

  // ===================== CUSTOM SERVICE DETAIL MODAL (CENTERED DIALOG) =====================
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalDialogCard: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '84%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 24,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalTitleBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  modalServiceName: {
    fontSize: 18.5,
    fontWeight: '800',
    color: '#0F172A',
    flex: 1,
  },
  modalCategoryBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginLeft: 8,
  },
  modalCategoryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0284C7',
  },
  modalExplanationText: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 19,
    marginBottom: 12,
  },
  modalBodyScroll: {
    maxHeight: Dimensions.get('window').height * 0.44,
    marginBottom: 12,
  },
  modalSpecialNoteBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
  },
  modalSpecialNoteText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
    lineHeight: 16,
  },
  modalSectionSmallTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  modalProblemsBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalProblemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  problemTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  problemTagText: {
    fontSize: 11.5,
    fontWeight: '500',
    color: '#334155',
  },
  modalStepsBox: {
    backgroundColor: '#F0F9FF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 7,
  },
  stepNumPill: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  stepNumText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stepText: {
    flex: 1,
    fontSize: 12,
    color: '#0F172A',
    lineHeight: 17,
  },
  homeSearchQuickJump: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: -8,
    marginBottom: 16,
  },
  homeSearchQuickText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0284C7',
  },
  modalBenefitsBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  modalBenefitsTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 6,
  },
  benefitText: {
    flex: 1,
    fontSize: 12,
    color: '#334155',
    lineHeight: 16,
  },
  useServiceBtn: {
    backgroundColor: '#033B6A',
    height: 50,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#033B6A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 10,
  },
  useServiceBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cancelBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
});
