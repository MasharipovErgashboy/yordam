import React, { useState } from 'react';
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
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { HuquqMaktabiScreen } from './HuquqMaktabiScreen';
import { IshVaMehnatHuquqiScreen } from './IshVaMehnatHuquqiScreen';
import { IstemolchiHuquqlariScreen } from './IstemolchiHuquqlariScreen';

const { width } = Dimensions.get('window');

type TabType = 'home' | 'services' | 'ai_assistant' | 'profile';
type ServiceCategory = 'all' | 'ai' | 'documents' | 'protection';

interface MainHomeScreenProps {
  onBackToOnboarding?: () => void;
}

const logoImage = require('../../assets/images/logo.jpg');
const robotImage = require('../../assets/images/onboarding_2.png');
const articleGavelImage = require('../../assets/images/article_gavel.jpg');

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

export const MainHomeScreen: React.FC<MainHomeScreenProps> = ({ onBackToOnboarding }) => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [serviceCategory, setServiceCategory] = useState<ServiceCategory>('all');
  const [serviceSearch, setServiceSearch] = useState('');

  // Service Detail Custom Dialog Modal State
  const [selectedService, setSelectedService] = useState<DetailedServiceItem | null>(null);

  // Huquq Maktabi Mini App State
  const [isHuquqMaktabiOpen, setIsHuquqMaktabiOpen] = useState(false);

  // Ish va Mehnat Huquqi Mini App State
  const [isIshHuquqiOpen, setIsIshHuquqiOpen] = useState(false);

  // Iste'molchi Huquqlari Mini App State
  const [isIstemolchiOpen, setIsIstemolchiOpen] = useState(false);

  const handleQuickGridClick = (item: ServiceGridItem) => {
    if (item.id === 'istemolchi') {
      setIsIstemolchiOpen(true);
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
    setSelectedService(item);
  };

  const handleUseService = () => {
    if (!selectedService) return;
    const sName = selectedService.name;
    const sId = selectedService.id;
    setSelectedService(null);

    if (sId === 'huquq_maktabi') {
      setIsHuquqMaktabiOpen(true);
    } else if (sId === 'ish_huquqi') {
      setIsIshHuquqiOpen(true);
    } else if (sId === 'istemolchi') {
      setIsIstemolchiOpen(true);
    } else if (sId === 'legal_map') {
      Alert.alert(
        'LegalMap (Yuridik Xarita)',
        '📍 Geolokatsiya böyiça atrofingizdagi advokatura va yuridik firmalar:\n\n1. "Adolat Hamkori" advokatlik byurosi\n   • Narx: 150 000 söm/soat • Masofa: 0.8 km\n   • Ixtisoslik: Fuqarolik, Şartnomalar\n\n2. "Lex Consult Group" yuridik firmasi\n   • Narx: 200 000 söm/soat • Masofa: 1.4 km\n   • Ixtisoslik: Iqtisodiy nizolar, Soliq\n\n3. Advokat Ş. Rahimov (Xususiy amaliyot)\n   • Narx: 180 000 söm/soat • Masofa: 2.1 km\n   • Ixtisoslik: Kredit, Iste’molçi huquqlari\n\nNarxlar balansi böyiça istalgan mutaxassisga töğridan-töğri qönğiroq qilişingiz mumkin.',
        [{ text: 'Tuşundim' }]
      );
    } else if (sId === 'bank_kredit_himoyasi') {
      Alert.alert(
        'Bank Kreditlari Himoyasi',
        '🏦 Kredit masalalari böyiça amaliy yönalişni tanlang:\n\n1. Kartadan asossiz yeçilgan pulni qaytariş talabnomasi\n2. Yaşirin foiz va komissiyalar tahlili\n3. Roziliksiz (firibgarlik) rasmiylaştirilgan kredit şikoyati\n4. Kredit restrukturizatsiyasi va yengillik sörovi\n5. Markaziy bank (3030-son Nizom) va sudga murojaat\n\nTanlangan yönaliş böyiça ariza andozasi yuklanmoqda.',
        [{ text: 'Tuşundim' }]
      );
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
    return <HuquqMaktabiScreen onBack={() => setIsHuquqMaktabiOpen(false)} />;
  }

  if (isIshHuquqiOpen) {
    return <IshVaMehnatHuquqiScreen onBack={() => setIsIshHuquqiOpen(false)} />;
  }

  if (isIstemolchiOpen) {
    return <IstemolchiHuquqlariScreen onBack={() => setIsIstemolchiOpen(false)} />;
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

        {/* Right Action Icons: Notification Bell & Scanner */}
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

      {/* ===================== TAB 2: XIZMATLAR (STICKY HEADER + INDEPENDENT SCROLL) ===================== */}
      {activeTab === 'services' ? (
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
                      {service.name}
                    </Text>

                    {/* Middle: Short Description */}
                    <Text style={styles.tableServiceDesc} numberOfLines={2}>
                      {service.description}
                    </Text>

                    {/* Bottom Metadata Tags */}
                    <View style={styles.tableMetaTagsRow}>
                      <View style={styles.metaTagItem}>
                        <Ionicons name="checkmark-circle" size={11} color="#10B981" />
                        <Text style={styles.metaTagText}>{service.feature}</Text>
                      </View>

                      <View style={styles.metaCategoryTag}>
                        <Text style={styles.metaCategoryText}>{service.categoryLabel}</Text>
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
        /* ===================== OTHER TABS (HOME, AI, PROFILE) ===================== */
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
                    setServiceSearch(searchQuery.trim());
                    setActiveTab('services');
                  }}
                >
                  <Ionicons name="search" size={15} color="#0284C7" />
                  <Text style={styles.homeSearchQuickText}>
                    "{searchQuery}" böyiça xizmatlar katalogida qidiriş →
                  </Text>
                </TouchableOpacity>
              )}

              {/* HAQIM AI Hero Banner Card */}
              <TouchableOpacity
                style={styles.heroBannerWrap}
                activeOpacity={0.92}
                onPress={() => setActiveTab('ai_assistant')}
              >
                <LinearGradient
                  colors={['#003A70', '#074886', '#0B599E']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.heroBanner}
                >
                  {/* Left Texts & Button */}
                  <View style={styles.heroLeft}>
                    {/* HAQIM Badge */}
                    <View style={styles.haqimBadge}>
                      <Text style={styles.haqimBadgeText}>HAQIM</Text>
                    </View>

                    <Text style={styles.heroTitle}>AI huquqiy yordamçi</Text>
                    <Text style={styles.heroDesc}>
                      Savolingizni yozing va tezkor huquqiy javob oling.
                    </Text>

                    {/* Action CTA Button */}
                    <View style={styles.heroCtaBtn}>
                      <Text style={styles.heroCtaText}>AI bilan suhbat</Text>
                      <Ionicons name="chevron-forward" size={14} color="#002B49" />
                    </View>
                  </View>

                  {/* Right 3D Robot Image */}
                  <View style={styles.heroRight}>
                    <Image
                      source={robotImage}
                      style={styles.heroRobotImage}
                      resizeMode="contain"
                    />
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              {/* Section: Asosiy xizmatlar */}
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Asosiy xizmatlar</Text>
                <TouchableOpacity
                  onPress={() => setActiveTab('services')}
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
                  onPress={() => Alert.alert('Maqolalar', 'Barça foydali huquqiy maqolalar sahifasi.')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.seeAllText}>Barçasini köriş ›</Text>
                </TouchableOpacity>
              </View>

              {/* Article Card matching screenshot */}
              <TouchableOpacity
                style={styles.articleCard}
                activeOpacity={0.85}
                onPress={() =>
                  Alert.alert(
                    'Mehnat şartnomasi',
                    'Mehnat şartnomasi tuzişda asosiy qoidalar: sinov muddati, ta’tillar, oylik maoh va bekor qiliş şartlariga e’tibor qaratiş lozim.'
                  )
                }
              >
                {/* Article Thumbnail Image */}
                <Image
                  source={articleGavelImage}
                  style={styles.articleImage}
                  resizeMode="cover"
                />

                {/* Article Details */}
                <View style={styles.articleInfo}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>Huquqiy maslahat</Text>
                  </View>

                  <Text style={styles.articleTitle} numberOfLines={2}>
                    Mehnat şartnomasi tuzişda nimalarga e’tibor beriş kerak?
                  </Text>

                  {/* Date & Views Meta */}
                  <View style={styles.articleMetaRow}>
                    <View style={styles.metaItem}>
                      <Ionicons name="calendar-outline" size={12} color="#9CA3AF" />
                      <Text style={styles.metaText}>12-noy, 2026</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons name="eye-outline" size={12} color="#9CA3AF" />
                      <Text style={styles.metaText}>3 420</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </>
          )}

          {/* ===================== 3. AI YORDAMCHI TAB ===================== */}
          {activeTab === 'ai_assistant' && (
            <View style={styles.tabContentContainer}>
              <View style={styles.aiTabHeaderCard}>
                <Image source={robotImage} style={{ width: 64, height: 64 }} resizeMode="contain" />
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text style={styles.aiTabTitle}>HAQIM AI Yordamçi</Text>
                  <Text style={styles.aiTabDesc}>
                    Özbekiston Respublikasi qonunçiligi böyiça istalgan huquqiy savolingizni bering.
                  </Text>
                </View>
              </View>

              <Text style={[styles.sectionTitle, { marginTop: 8, marginBottom: 10 }]}>
                Tezkor huquqiy savollar:
              </Text>

              <TouchableOpacity
                style={styles.quickPromptCard}
                onPress={() => Alert.alert('HAQIM AI', 'Ijara şartnomasi böyiça maslahat tahlili boşlanmoqda...')}
              >
                <Ionicons name="chatbubble-ellipses-outline" size={18} color="#0284C7" />
                <Text style={styles.quickPromptText}>Kvartira ijarasi şartnomasi qanday bekor qilinadi?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickPromptCard}
                onPress={() => Alert.alert('HAQIM AI', 'Mehnat nizosi böyiça tahlil boşlanmoqda...')}
              >
                <Ionicons name="chatbubble-ellipses-outline" size={18} color="#0284C7" />
                <Text style={styles.quickPromptText}>Iş beruvçi oğohlantirişsiz işdan böşatişi mumkinmi?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickPromptCard}
                onPress={() => Alert.alert('HAQIM AI', 'Iste’molçi huquqlari böyiça tahlil boşlanmoqda...')}
              >
                <Ionicons name="chatbubble-ellipses-outline" size={18} color="#0284C7" />
                <Text style={styles.quickPromptText}>Nuqsonli tovarni qança muddatda qaytariş mumkin?</Text>
              </TouchableOpacity>

              {/* Input message box */}
              <View style={styles.chatInputBar}>
                <TextInput
                  style={styles.chatInput}
                  placeholder="Savolingizni bu yerga yozing..."
                  placeholderTextColor="#9CA3AF"
                />
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={() => Alert.alert('HAQIM AI', 'Savolingiz qabul qilindi, tahlil qilinmoqda...')}
                >
                  <Ionicons name="arrow-up" size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* ===================== 4. PROFIL TAB ===================== */}
          {activeTab === 'profile' && (
            <View style={styles.tabContentContainer}>
              <View style={styles.profileCard}>
                <View style={styles.profileAvatar}>
                  <Ionicons name="person" size={28} color="#FFFFFF" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.profileName}>Özbekiston Fuqarosi</Text>
                  <Text style={styles.profileStatus}>OneID orqali tasdiqlangan</Text>
                </View>
                <Ionicons name="checkmark-circle" size={22} color="#10B981" />
              </View>

              <View style={styles.profileMenuBox}>
                <TouchableOpacity style={styles.profileMenuItem}>
                  <Ionicons name="globe-outline" size={20} color="#0284C7" />
                  <Text style={styles.profileMenuText}>Dastur tili</Text>
                  <Text style={styles.profileMenuSub}>Özbekça</Text>
                  <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.profileMenuItem}>
                  <Ionicons name="shield-checkmark-outline" size={20} color="#10B981" />
                  <Text style={styles.profileMenuText}>Xavfsizlik va biometriya</Text>
                  <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                </TouchableOpacity>

                {onBackToOnboarding && (
                  <TouchableOpacity style={styles.profileMenuItem} onPress={onBackToOnboarding}>
                    <Ionicons name="refresh-outline" size={20} color="#F59E0B" />
                    <Text style={styles.profileMenuText}>Kiriş taqdimotini köriş</Text>
                    <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </ScrollView>
      )}

      {/* ===================== BOTTOM NAVBAR (MATCHING SCREENSHOT) ===================== */}
      <View style={[styles.bottomNavbar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
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
          onPress={() => setActiveTab('services')}
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
          onPress={() => setActiveTab('ai_assistant')}
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
            AI yordamçi
          </Text>
        </TouchableOpacity>

        {/* 4. Profil */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('profile')}
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
              <Text style={styles.modalServiceName}>{selectedService?.name}</Text>
              <View style={styles.modalCategoryBadge}>
                <Text style={styles.modalCategoryText}>{selectedService?.categoryLabel}</Text>
              </View>
            </View>

            <ScrollView
              style={styles.modalBodyScroll}
              showsVerticalScrollIndicator={false}
            >
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
  },
  aiTabHeaderCard: {
    flexDirection: 'row',
    backgroundColor: '#F0F9FF',
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    marginBottom: 14,
  },
  aiTabTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  aiTabDesc: {
    fontSize: 11.5,
    color: '#475569',
    marginTop: 2,
    lineHeight: 16,
  },
  quickPromptCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 8,
    gap: 10,
  },
  quickPromptText: {
    flex: 1,
    fontSize: 12.5,
    color: '#1F2937',
    fontWeight: '500',
  },
  chatInputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    gap: 8,
  },
  chatInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    padding: 2,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 14,
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#034687',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  profileStatus: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '600',
    marginTop: 2,
  },
  profileMenuBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  profileMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 12,
  },
  profileMenuText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  profileMenuSub: {
    fontSize: 12,
    color: '#6B7280',
    marginRight: 4,
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
