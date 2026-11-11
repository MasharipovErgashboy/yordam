import React, { useState, useEffect } from 'react';
import {
  View,
  Share,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  Alert,
  Modal,
  Linking,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { MehnatKodeksiKitobScreen } from './MehnatKodeksiKitobScreen';

const { width } = Dimensions.get('window');

// Images
const mehnatHeroGraphic = require('../../assets/images/mehnat_hero_graphic.png');
const mehnatAiRobot = require('../../assets/images/mehnat_ai_robot.png');
const huquqlarScaleBook = require('../../assets/images/huquqlar_scale_book.png');
const storeBgJustice = require('../../assets/images/store_bg_justice.png');
const videoLessonInstructorImage = require('../../assets/images/video_lesson_instructor.png');
const videoLessonCover = require('../../assets/images/video_lesson_cover.png');

interface IshVaMehnatHuquqiScreenProps {
  onBack: () => void;
}

type BottomTabType = 'home' | 'rights' | 'ai' | 'documents';
type RightsCategoryFilter = 'all' | 'basic' | 'popular';

export const IshVaMehnatHuquqiScreen: React.FC<IshVaMehnatHuquqiScreenProps> = ({ onBack }) => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<BottomTabType>('rights');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Huquqlar page state
  const [rightsSearchQuery, setRightsSearchQuery] = useState('');
  const [rightsCategoryFilter, setRightsCategoryFilter] = useState<RightsCategoryFilter>('all');

  // Topic Detail Screen state
  const [selectedTopicDetail, setSelectedTopicDetail] = useState<any>(null);
  const [detailFilterTab, setDetailFilterTab] = useState<'general' | 'video' | 'docs' | 'faq'>('general');
  const [expandedAccordionIdx, setExpandedAccordionIdx] = useState<number | null>(0);

  // Dedicated Video Dars Tab State
  const [videoIsPlaying, setVideoIsPlaying] = useState<boolean>(false);
  const [videoIsLiked, setVideoIsLiked] = useState<boolean>(false);
  const [videoSpeed, setVideoSpeed] = useState<'1.0x' | '1.25x' | '1.5x' | '2.0x'>('1.0x');
  const [activeChapterIdx, setActiveChapterIdx] = useState<number>(0);
  const [videoQuizAnswer, setVideoQuizAnswer] = useState<number | null>(null);

  // Mehnat Kodeksi Online Kitob Screen State
  const [showMehnatKodeksi, setShowMehnatKodeksi] = useState<boolean>(false);

  // Hujjatlar Markazi Tab State
  const [docSearchQuery, setDocSearchQuery] = useState('');
  const [docCategoryFilter, setDocCategoryFilter] = useState<'all' | 'applications' | 'contracts' | 'claims' | 'complaints'>('all');

  // Document Preview Modal State
  const [previewDoc, setPreviewDoc] = useState<any | null>(null);

  // Document Constructor Modal State
  const [isConstructorVisible, setIsConstructorVisible] = useState<boolean>(false);
  const [constructorDocKey, setConstructorDocKey] = useState<'tatil' | 'ish_haqi' | 'boshatish' | 'shikoyat'>('tatil');
  const [constructorTab, setConstructorTab] = useState<'form' | 'preview'>('form');
  const [constructorForm, setConstructorForm] = useState({
    fullName: 'Karimov Jasur Bahodir öğli',
    companyName: '«TEXNO INVEST GROUP» MChJ',
    position: 'Yetakçi mutaxassis',
    date: '11-mart, 2025',
  });

  // User Saved & Downloaded Documents State
  const [myDocsList, setMyDocsList] = useState<Array<{
    id: string;
    title: string;
    type: 'PDF' | 'DOCX';
    size: string;
    date: string;
    status: string;
    statusBg: string;
    statusColor: string;
    badgeBg: string;
    legalRef?: string;
    content: string;
  }>>([
    {
      id: 'my_1',
      title: 'Mehnat ta’tili arizasi',
      type: 'DOCX',
      size: '215 KB',
      date: '11-mart, 2025',
      status: 'Tayyor',
      statusBg: '#DCFCE7',
      statusColor: '#16A34A',
      badgeBg: '#2563EB',
      legalRef: 'MK 216-modda',
      content: `«TEXNO INVEST GROUP» MChJ rahbariyatiga\nYetakçi mutaxassis Karimov Jasur Bahodir öğlidan\n\nARIZA\n\nÖzbekiston Respublikasi Mehnat kodeksining 216 va 217-moddalariga asosan, menga 2025-yil 15-martdan boşlab davomiyligi 21 kalendar kun bölgan yillik asosiy haq tölanadigan mehnat ta’tili berişingizni va tegişli ta’til pullarini tölab berişingizni sörayman.\n\nSana: 11-mart, 2025-yil\nImzo: J. Karimov`,
    },
    {
      id: 'my_2',
      title: 'Iş haqi böyiça rasmiy talabnoma',
      type: 'PDF',
      size: '342 KB',
      date: '08-mart, 2025',
      status: 'Tayyor',
      statusBg: '#DCFCE7',
      statusColor: '#16A34A',
      badgeBg: '#EF4444',
      legalRef: 'MK 253-modda',
      content: `«TEXNO INVEST GROUP» MChJ rahbariyatiga\nYetakçi mutaxassis Karimov Jasur Bahodir öğlidan\n\nTALABNOMA\n(Oylik maoh va kompensatsiya tölaş töğrisida)\n\nÖzbekiston Respublikasi Mehnat kodeksining 253-moddasiga muvofiq, fevral oyi uçun hisoblangan iş haqini hamda keçiktirilgan har bir kun uçun penya tölovlarini 3 iş kuni içida tölab berişingizni talab qilaman.\n\nSana: 08-mart, 2025-yil\nImzo: J. Karimov`,
    },
    {
      id: 'my_3',
      title: 'Mehnat şartnomasi loyihasi',
      type: 'DOCX',
      size: '180 KB',
      date: '28-fevral, 2025',
      status: 'Qoralama',
      statusBg: '#FEF3C7',
      statusColor: '#D97706',
      badgeBg: '#2563EB',
      legalRef: 'MK 104-modda',
      content: `MEHNAT ŞARTNOMASI № 24-son\n\nToşkent ş.                                       «28» fevral 2025-yil\n\n«TEXNO INVEST GROUP» MChJ hamda xodim Karimov Jasur Bahodir öğli örtasidagi mehnat şartnomasi.\n\n1. Xodim dasturiy ta’minot bölimiga qabul qilinadi.\n2. Sinov muddati belgilanmaydi.\n3. Oylik maoh: 12 500 000 söm.\n\nTomonlar imzosi: ___________ / ___________`,
    },
  ]);

  // Savol-javob (FAQ) state
  const [faqSearchQuery, setFaqSearchQuery] = useState('');
  const [expandedFaqIndices, setExpandedFaqIndices] = useState<number[]>([0]);
  const [faqVotes, setFaqVotes] = useState<Record<number, 'yes' | 'no'>>({});

  // AI Assistant Tab state
  const [aiQuestionInput, setAiQuestionInput] = useState('');
  const [aiChatHistory, setAiChatHistory] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string; article?: string }>>([
    {
      sender: 'ai',
      text: 'Assalomu alaykum! Men Mehnat huquqi böyiça aqlli yordamçiman. Yangi tahrirdagi Mehnat Kodeksi böyiça istalgan savolingizni bering.',
      time: '09:41',
    },
  ]);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  // 1. Swiper Slides: Hamkorlar reklamasi va Tizim yangiliklari
  const heroSlides = [
    {
      id: 'system_main',
      tag: 'TIZIM XIZMATI',
      titlePrefix: 'Mehnat huquqlaringizni biling va ',
      titleHighlight: 'himoya qiling',
      desc: 'Iş haqi, şartnoma, ta’til, işdan böşatiş va boşqa masalalarda amaliy yordam.',
      ctaText: 'Muammom bor',
      ctaColor: '#FEF08A',
      colors: ['#0A192F', '#0F2644', '#15365E'] as const,
      hasIllustration: true,
      onPress: () =>
        Alert.alert(
          'Muammo böyiça yordam ⚖️',
          'Qaysi masala böyiça muammo yuzaga keldi?\n\n1. Oylik maoh tölanmadi yoki keçiktirildi\n2. Asossiz işdan böşatişdi\n3. Mehnat ta’tili berilmadi\n4. Ortiqça işlatişdi (qöşimça haq tölanmadi)\n\nMutaxassis yordamida şikoyat yoki talabnoma tuzişni boşlaymizmi?',
          [
            { text: 'Ha, boşlaş', onPress: () => Alert.alert('Yordamçi işga tuşdi', 'Tegişli ariza şakli tayyorlanmoqda.') },
            { text: 'Bekor qiliş', style: 'cancel' },
          ]
        ),
    },
    {
      id: 'partner_lawyers',
      tag: 'HAMKORLAR REKLAMASI',
      titlePrefix: 'Malakali mehnat advokatlari va ',
      titleHighlight: 'yuridik yordam',
      desc: 'Respublika böylab 50+ dan ortiq tajribali advokatlar va yuridik firmalar bilan bevosita boğlaning.',
      ctaText: 'Yuristlarni köriş',
      ctaColor: '#DDD6FE',
      colors: ['#1E1B4B', '#2E1065', '#3B0764'] as const,
      hasIllustration: false,
      iconName: 'shield-checkmark-outline',
      iconColor: '#C4B5FD',
      onPress: () =>
        Alert.alert(
          'Hamkor advokatlar tarmoği ⚖️',
          'Mehnat nizolari böyiça ixtisoslaşgan hamkor advokatlarimiz:\n\n1. "Adolat Himoyaçisi" advokatlik byurosi\n2. "Lex Labor" mehnat konsalting markazi\n3. Toşkent şahar Kasaba uyuşmasi yuridik xizmati\n\nTöğridan-töğri telefon yoki online konsultatsiya olişingiz mumkin.',
          [{ text: 'Tuşundim' }]
        ),
    },
    {
      id: 'system_news',
      tag: 'TIZIM YANGILIKLARI',
      titlePrefix: 'Yangi Mehnat Kodeksida ',
      titleHighlight: 'muhim özgarişlar',
      desc: 'Sinov muddati, masofaviy (remote) iş tartibi va noqonuniy böşatişda töliq kompensatsiya.',
      ctaText: 'Özgarişlarni biliş',
      ctaColor: '#A7F3D0',
      colors: ['#064E3B', '#047857', '#065F46'] as const,
      hasIllustration: false,
      iconName: 'newspaper-outline',
      iconColor: '#6EE7B7',
      onPress: () =>
        Alert.alert(
          'Mehnat Kodeksi yangiliklari 📜',
          'Yangi tahrirdagi Mehnat kodeksidagi asosiy özgarişlar:\n\n• Sinov muddati maksimal 3 oygança çeklandi\n• Masofaviy va gibrid işlaş tartibi qonuniylaştirildi\n• Işdan asossiz böşatilgan xodimga majburiy progul va ma’naviy zarar töliq undiriladi\n• Homilador va yoş bolali ayollarga qöşimça kafolatlar kiritildi.',
          [{ text: 'Tuşundim' }]
        ),
    },
    {
      id: 'partner_audit',
      tag: 'HAMKORLIK VA AUDIT',
      titlePrefix: 'Iş beruvçilar uçun qonuniy ',
      titleHighlight: 'mehnat auditi',
      desc: 'Hamkor auditorlarimiz orqali korxona şartnomalari va buyruqlarini 100% qonuniy muvofiqlaştiring.',
      ctaText: 'Auditga sörov',
      ctaColor: '#FED7AA',
      colors: ['#78350F', '#92400E', '#B45309'] as const,
      hasIllustration: false,
      iconName: 'briefcase-outline',
      iconColor: '#FCD34D',
      onPress: () =>
        Alert.alert(
          'Mehnat auditi xizmati 🏢',
          'Korxonangiz xodimlari bilan tuzilgan şartnomalar, buyruqlar va xavfsizlik jurnallarini Mehnat inspeksiyasi tekşiruvidan oldin töliq auditdan ötkazing.',
          [
            { text: 'Ariza qoldiriş', onPress: () => Alert.alert('Qabul qilindi', 'Tez orada mutaxassis boğlanadi.') },
            { text: 'Yopiş', style: 'cancel' },
          ]
        ),
    },
  ];

  // Auto-rotate Swiper every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const activeSlide = heroSlides[currentSlideIndex];

  // Quick categories (2x3 Grid on Home)
  const quickCategories = [
    {
      id: 'shartnoma',
      title: 'Mehnat\nşartnomasi',
      icon: 'document-text-outline',
      iconColor: '#0284C7',
      bg: '#F0F9FF',
      borderColor: '#E0F2FE',
    },
    {
      id: 'ish_haqi',
      title: 'Iş haqi\nva tölovlar',
      icon: 'cash-outline',
      iconColor: '#D97706',
      bg: '#FEFCE8',
      borderColor: '#FEF08A',
    },
    {
      id: 'tatil',
      title: 'Ta’til\nhuquqi',
      icon: 'calendar-outline',
      iconColor: '#16A34A',
      bg: '#F0FDF4',
      borderColor: '#DCFCE7',
    },
    {
      id: 'ish_vaqti',
      title: 'Iş vaqti\nva dam oliş',
      icon: 'time-outline',
      iconColor: '#4F46E5',
      bg: '#EEF2FF',
      borderColor: '#E0E7FF',
    },
    {
      id: 'boshatish',
      title: 'Işdan\nböşatiş',
      icon: 'log-out-outline',
      iconColor: '#BE123C',
      bg: '#FFF1F2',
      borderColor: '#FFE4E6',
    },
    {
      id: 'boshqa',
      title: 'Boşqa\nmuammolar',
      icon: 'grid-outline',
      iconColor: '#0284C7',
      bg: '#F0F9FF',
      borderColor: '#E0F2FE',
    },
  ];

  // Minimalist Main services on Home
  const mainServices = [
    {
      id: 'huquqlar',
      title: 'Mehnat huquqlari',
      subtitle: 'Huquqlaringiz va Mehnat kodeksi me’yorlarini batafsil örganing',
      badge: '48 ta mavzu',
      icon: 'book-outline',
      iconColor: '#D97706',
      iconBg: '#FEF3C7',
      action: () => setActiveTab('rights'),
    },
    {
      id: 'hujjatlar',
      title: 'Hujjatlar markazi',
      subtitle: 'Rasmiy ariza, talabnoma va şikoyat andozalari',
      badge: '24 ta andoza',
      icon: 'document-text-outline',
      iconColor: '#0284C7',
      iconBg: '#E0F2FE',
      action: () => setActiveTab('documents'),
    },
    {
      id: 'tashkilotlar',
      title: 'Rasmiy taşkilotlar',
      subtitle: 'Mehnat inspeksiyasi, kasaba uyuşmasi va sudlarga murojaat',
      badge: '14 ta idora',
      icon: 'business-outline',
      iconColor: '#7C3AED',
      iconBg: '#F3E8FF',
      action: () =>
        Alert.alert(
          'Rasmiy taşkilotlar 🏛️',
          'Mehnat nizolari böyiça murojaat qilişingiz mumkin bölgan davlat organlari:\n\n1. Bandlik va mehnat munosabatlari vazirligi (Işonç telefoni: 1176)\n2. Özbekiston Kasaba uyuşmalari Federatsiyasi (Tel: 1092)\n3. Fuqarolik işlari böyiça tuman (şahar) sudlari\n4. Boş prokuratura "Inson huquqlari" bölimi',
          [{ text: 'Tuşundim' }]
        ),
    },
  ];

  // Documents Catalog for Hujjatlar Markazi
  const documentsCatalog = [
    {
      id: 'doc_shartnoma',
      title: 'Mehnat şartnomasi andozasi (2025 yangi tahrir)',
      desc: 'Xodim va iş beruvçi örtasidagi 2025-yilgi yangi tahrirdagi rasmiy andoza.',
      category: 'contracts',
      categoryLabel: 'Şartnomalar',
      type: 'PDF' as const,
      size: '248 KB',
      downloads: '12,8 ming',
      badgeColor: '#EF4444',
      isOfficial: true,
      legalRef: 'MK 104, 105-moddalar',
      to: '«KORXONA NOMI» (Iş beruvçi)',
      from: 'Fuqaro (Xodim)',
      docTitle: 'MEHNAT ŞARTNOMASI',
      content: `MEHNAT ŞARTNOMASI № 2025/___

Toşkent ş.                                       «___» ________ 2025-yil

Bir tomondan «[KORXONA NOMI]» (keyingi örinlarda «Iş beruvçi»), ikkinçi tomondan fuqaro [XODIM F.I.Sh.] (keyingi örinlarda «Xodim») quyidagilar haqida mazkur mehnat şartnomasini tuzdilar:

1. ŞARTNOMA PREDMETI
1.1. Xodim [LAVOZIM NOMI] lavozimiga qabul qilinadi.
1.2. Iş boşlaniş sanasi: 2025-yil «___» ________.
1.3. Şartnoma turi: Nomuayyan muddatga (doimiy).

2. ISH HAQI VA IJTIMOIY KAFOLATLAR
2.1. Xodimga har oyda belgilangan me’yorlar böyiça lavozim maoşi va ustamalar tölanadi.
2.2. Iş haqi oyiga kamida ikki marta — har oyning 5 va 20-kunlariga qadar tölanişi şart (MK 253-modda).

3. ISH VAQTI VA MEHNAT TA’TILI
3.1. Xodim uçun haftasiga 40 soatdan oşmaydigan 5 kunlik iş haftasi belgilanadi.
3.2. Xodimga har yili kamida 21 kalendar kunlik uzaytirilgan asosiy haq tölanadigan mehnat ta’tili beriladi (MK 217-modda).

Tomonlarning imzolari va muhrlari:
Iş beruvçi: _________________               Xodim: _________________`,
    },
    {
      id: 'doc_ish_haqi_talab',
      title: 'Iş haqi keçiktirilganda rasmiy talabnoma',
      desc: 'Öz vaqtida tölanmagan maoh va penya kompensatsiyasini talab qiliş talabnomasi.',
      category: 'claims',
      categoryLabel: 'Talabnomalar',
      type: 'DOCX' as const,
      size: '215 KB',
      downloads: '9,4 ming',
      badgeColor: '#2563EB',
      isOfficial: true,
      legalRef: 'MK 253, 333-moddalar',
      to: '«[KORXONA NOMI]» rahbariyatiga',
      from: '[LAVOZIM] [XODIM F.I.Sh.]dan',
      docTitle: 'TALABNOMA',
      content: `«[KORXONA NOMI]» rahbari [RAHBAR F.I.Sh.]ga
[LAVOZIM NOMI] [XODIM F.I.Sh.]dan

TALABNOMA
(Keçiktirilgan iş haqi va qonuniy kompensatsiyani tölaş töğrisida)

Özbekiston Respublikasi Mehnat kodeksining 253-moddasiga asosan iş beruvçi xodimga iş haqini belgilangan muddatlarda tölaşi şart. Kodeksning 333-moddasiga binoan, iş haqi tölaş keçiktirilgan har bir kun uçun Markaziy bank qayta moliyalash stavkasi miqdorida kompensatsiya (penya) qöşib tölanişi kafolatlangan.

Şu munosabat bilan, menga hisoblangan, lekin öz vaqtida tölanmagan oylik maohimni va keçiktirilgan kunlar uçun penya kompensatsiyasini 3 iş kuni içida plastik kartamga (yoki naqd pulda) tölab berişingizni talab qilaman.

Mazkur talabnoma qondirilmagan taqdirda, Davlat mehnat inspeksiyasi (1176 ishonç telefoni) va Fuqarolik işlari böyiça sudga murojaat qilişimni ma’lum qilaman.

Sana: «___» ________ 2025-yil
Imzo: _____________________ / [XODIM F.I.Sh.]`,
    },
    {
      id: 'doc_tatil_ariza',
      title: 'Yillik asosiy mehnat ta’tili arizasi',
      desc: 'Kamida 21 kalendar kunlik yillik uzaytirilgan ta’til berişni söraş arizasi.',
      category: 'applications',
      categoryLabel: 'Arizalar',
      type: 'DOCX' as const,
      size: '198 KB',
      downloads: '16,3 ming',
      badgeColor: '#2563EB',
      isOfficial: true,
      legalRef: 'MK 216, 217-moddalar',
      to: '«[KORXONA NOMI]» boshqaruviga',
      from: '[LAVOZIM] [XODIM F.I.Sh.]dan',
      docTitle: 'ARIZA',
      content: `«[KORXONA NOMI]» direktori [RAHBAR F.I.Sh.]ga
[LAVOZIM NOMI] [XODIM F.I.Sh.]dan

ARIZA
(Yillik asosiy haq tölanadigan mehnat ta’tili beriş töğrisida)

Özbekiston Respublikasi yangi tahrirdagi Mehnat kodeksining 216 va 217-moddalariga asosan, menga 2025-yil «___» ________ dan boşlab davomiyligi 21 kalendar kun bölgan yillik asosiy uzaytirilgan haq tölanadigan mehnat ta’tili berişingizni va tegişli ta’til pullarini qonunda belgilangan tartibda tölab berişingizni sörayman.

Sana: «___» ________ 2025-yil
Imzo: _____________________ / [XODIM F.I.Sh.]`,
    },
    {
      id: 'doc_boshatish_ariza',
      title: 'Öz xohişi bilan işdan böşaş arizasi',
      desc: '14 kalendar kun oldin yoziladigan qonuniy oğohlantiriş va hisob-kitob arizasi.',
      category: 'applications',
      categoryLabel: 'Arizalar',
      type: 'DOCX' as const,
      size: '185 KB',
      downloads: '11,2 ming',
      badgeColor: '#2563EB',
      isOfficial: true,
      legalRef: 'MK 160-modda',
      to: '«[KORXONA NOMI]» boshqaruviga',
      from: '[LAVOZIM] [XODIM F.I.Sh.]dan',
      docTitle: 'ARIZA',
      content: `«[KORXONA NOMI]» direktori [RAHBAR F.I.Sh.]ga
[LAVOZIM NOMI] [XODIM F.I.Sh.]dan

ARIZA
(Mehnat şartnomasini xodimning tashabbusi bilan bekor qiliş töğrisida)

Özbekiston Respublikasi Mehnat kodeksining 160-moddasiga asosan men bilan tuzilgan mehnat şartnomasini öz xohişimga köra bekor qilişingizni sörayman.

Qonunda belgilangan 14 kalendar kunlik oğohlantiriş muddati tugagandan söng, 2025-yil «___» ________ kuni oxirgi iş kunim deb hisoblanişi, mehnat daftarçam hamda töliq yakuniy hisob-kitob mablağlari topshirilişi ta’minlanişini sörayman.

Sana: «___» ________ 2025-yil
Imzo: _____________________ / [XODIM F.I.Sh.]`,
    },
    {
      id: 'doc_inspeksiya_shikoyat',
      title: 'Davlat mehnat inspeksiyasiga (1176) şikoyat xati',
      desc: 'Mehnat huquqlari buzilganda korxonada qonuniy tekşiruv ötkaziş arizasi.',
      category: 'complaints',
      categoryLabel: 'Şikoyatlar',
      type: 'PDF' as const,
      size: '310 KB',
      downloads: '6,7 ming',
      badgeColor: '#EF4444',
      isOfficial: true,
      legalRef: 'MK 538, 545-moddalar',
      to: 'Davlat mehnat inspeksiyasi hududiy boshqarmasiga',
      from: 'Fuqaro [XODIM F.I.Sh.]dan',
      docTitle: 'ŞIKOYAT XATI',
      content: `Davlat mehnat inspeksiyasi boshliğiga
Fuqaro: [XODIM F.I.Sh.]dan
Manzil: [Yashash manzili], Tel: [Telefon raqami]

ŞIKOYAT XATI
(Mehnat huquqlari buzilganligi böyiça)

Men, [XODIM F.I.Sh.], «[KORXONA NOMI]»da [LAVOZIM NOMI] lavozimida faoliyat yuritib kelmoqdaman.

Iş beruvçi tomonidan Özbekiston Respublikasi Mehnat kodeksi talablari muntazam buzilmoqda:
1. Belgilangan muddatlarda oylik maoh tölanmayapti;
2. Qonunda kafolatlangan mehnat ta’tillari asossiz berilmayapti;
3. Ortiqça iş vaqtiga majburlanmoqda.

Özbekiston Respublikasi Mehnat kodeksining 538-moddasiga muvofiq, uşbu taşkilotda qonuniy tekşiruv ötkazişingizni, qonunbuziliş holatlarini bartaraf etiş va buzilgan mehnat huquqlarimni tiklaşda amaliy yordam körsatişingizni sörayman.

Sana: «___» ________ 2025-yil
Imzo: _____________________ / [XODIM F.I.Sh.]`,
    },
    {
      id: 'doc_ortiqcha_ish',
      title: 'Iş vaqtidan taşqari işga rozilik bildirgişi',
      desc: 'Ikki hissa haq tölaş şartti bilan ortiqça işga jalb qiliş rozilik arizasi.',
      category: 'applications',
      categoryLabel: 'Arizalar',
      type: 'DOCX' as const,
      size: '165 KB',
      downloads: '4,8 ming',
      badgeColor: '#2563EB',
      isOfficial: true,
      legalRef: 'MK 189, 195-moddalar',
      to: '«[KORXONA NOMI]» boshqaruviga',
      from: '[LAVOZIM] [XODIM F.I.Sh.]dan',
      docTitle: 'ROZILIK BILDIRGISI',
      content: `«[KORXONA NOMI]» direktori [RAHBAR F.I.Sh.]ga
[LAVOZIM NOMI] [XODIM F.I.Sh.]dan

ROZILIK BILDIRGISI
(Iş vaqtidan taşqari işga jalb qiliş töğrisida)

Özbekiston Respublikasi Mehnat kodeksining 189 va 195-moddalariga asosan, 2025-yil «___» ________ kunlari ishlab çiqariş zaruriyati munosabati bilan iş vaqtidan taşqari işga (kuniga ___ soatdan) jalb qilişingizga rozilik bildiraman.

Mazkur işlangan soatlar uçun Mehnat kodeksining 262-moddasiga muvofiq kamida ikki hissa miqdorida haq tölanişi (yoki teng davomiylikda qöşimça dam oliş vaqti berilişi) ta’minlanişini sörayman.

Sana: «___» ________ 2025-yil
Imzo: _____________________ / [XODIM F.I.Sh.]`,
    },
    {
      id: 'doc_dekret',
      title: 'Homiladorlik va tuğruq ta’tili arizasi (dekret)',
      desc: '126 kunlik ta’til va 100% töliq nafaqa tölovi kafolatini rasmiylaştiriş.',
      category: 'applications',
      categoryLabel: 'Arizalar',
      type: 'DOCX' as const,
      size: '220 KB',
      downloads: '8,5 ming',
      badgeColor: '#2563EB',
      isOfficial: true,
      legalRef: 'MK 404, 405-moddalar',
      to: '«[KORXONA NOMI]» boshqaruviga',
      from: '[LAVOZIM] [XODIM F.I.Sh.]dan',
      docTitle: 'ARIZA',
      content: `«[KORXONA NOMI]» direktori [RAHBAR F.I.Sh.]ga
[LAVOZIM NOMI] [XODIM F.I.Sh.]dan

ARIZA
(Homiladorlik va tuğruq ta’tili beriş töğrisida)

Özbekiston Respublikasi Mehnat kodeksining 404-moddasiga asosan, ilova qilinayotgan mehnatga layoqatsizlik varaqasi asosida menga 2025-yil «___» ________ dan boşlab davomiyligi 126 kalendar kun bölgan homiladorlik va tuğruq ta’tili berişingizni va davlat ijtimoiy suğurtasi böyiça qonunda belgilangan 100% töliq nafaqa pulini tölab berişingizni sörayman.

Ilova: Mehnatga layoqatsizlik varaqasi (№ _____).

Sana: «___» ________ 2025-yil
Imzo: _____________________ / [XODIM F.I.Sh.]`,
    },
    {
      id: 'doc_sud_davo',
      title: 'Sudga işga tiklaş böyiça da’vo arizasi',
      desc: 'Noqonuniy böşatilganda sud orqali işga tiklaş va majburiy progul haqini undiriş.',
      category: 'complaints',
      categoryLabel: 'Şikoyatlar',
      type: 'DOCX' as const,
      size: '340 KB',
      downloads: '3,9 ming',
      badgeColor: '#2563EB',
      isOfficial: true,
      legalRef: 'MK 560, 561-moddalar',
      to: 'Fuqarolik ishlari bo‘yicha tuman sudiga',
      from: 'Da’vogar: [XODIM F.I.Sh.]dan',
      docTitle: 'DA’VO ARIZASI',
      content: `Fuqarolik işlari böyiça tuman (şahar) sudiga
Da’vogar: [XODIM F.I.Sh.]
Manzil: [Yashash manzili], Tel: [Telefon raqami]
Javobgar: «[KORXONA NOMI]»

DA’VO ARIZASI
(Işga tiklaş, majburiy progul vaqtiga haq tölaş va ma’naviy zararni undiriş töğrisida)

Men «[KORXONA NOMI]»da [LAVOZIM NOMI] lavozimida ishlab kelganman. 2025-yil «___» ________ dagi buyruq bilan mehnat şartnomasi noqonuniy ravishda bekor qilingan.

Özbekiston Respublikasi Mehnat kodeksining 560-562-moddalariga asosan, sud tomonidan:
1. Meni avvalgi [LAVOZIM NOMI] lavozimimga ishga tiklaş;
2. Majburiy progul qilgan barcha kunlarim uçun örtaça iş haqimni undiriş;
3. Noqonuniy böşatiş oqibatida yetkazilgan ma’naviy zararni undiriş töğrisida hal qiluv qarori çiqarişingizni sörayman.

Ilova: Mehnat daftarsi nusxasi, buyruq nusxasi, oylik maoh ma’lumotnomasi.

Sana: «___» ________ 2025-yil
Imzo: _____________________ / [XODIM F.I.Sh.]`,
    },  ];

  // 2. Huquqlar Topics Catalog with complete detail structure
  const huquqlarList = [
    {
      id: 'shartnoma',
      title: 'Mehnat şartnomasi',
      desc: 'Şartnoma şartlari, majburiyatlar va muhim bandlar.',
      subtitle: 'Xodim va iş beruvçi örtasidagi mehnat munosabatlarini rasmiylaştiruvçi asosiy hujjat.',
      category: 'basic' as const,
      iconName: 'file-document-edit-outline',
      iconFamily: 'MaterialCommunityIcons' as const,
      iconColor: '#0284C7',
      video: {
        title: 'Mehnat şartnomasi nima? Asosiy şartlari va xodim uçun nimani anglatadi?',
        duration: '08:24',
        level: 'Boşlanğiç daraja',
        views: '24,8 ming',
      },
      summary: 'Mehnat şartnomasi — xodim va iş beruvçi örtasidagi mehnat munosabatlarini belgilovçi yozma kelişuv. Unda iş şartlari, iş haqi, iş vaqti, ta’til, huquq va majburiyatlar körsatiladi.',
      sections: [
        {
          title: 'Mehnat şartnomasining asosiy şartlari',
          icon: 'document-text-outline',
          iconColor: '#0284C7',
          iconBg: '#E0F2FE',
          points: [
            'Iş joyi (aniq taşkilot yoki filial) va aniq lavozim nomi',
            'Iş boşlanadigan aniq sana va şartnoma muddati (nomuayyan yoki muddatli)',
            'Mehnatga haq tölaş miqdori (oylik maoh, ustama va mukofotlar)',
            'Mehnat şaroitlari, mehnat muhofazasi va dam oliş vaqtlari',
          ],
        },
        {
          title: 'Xodim va iş beruvçining huquq va majburiyatlari',
          icon: 'people-outline',
          iconColor: '#6366F1',
          iconBg: '#EEF2FF',
          points: [
            'Xodim: Lavozim majburiyatlarini sifatli bajariş va içki mehnat intizomiga rioya qiliş',
            'Xodim: Xavfsiz mehnat şaroiti va öz vaqtida maoh oliş huquqiga ega',
            'Iş beruvçi: Qonuniy mehnat qurollari, xavfsizlik vositalari va kafolatlarni ta’minlaşi şart',
            'Iş beruvçi: Xodimni şartnomada körsatilmagan işlarga majburlaşi taqiqlanadi',
          ],
        },
        {
          title: 'Tuziş tartibi va muddatlari',
          icon: 'shield-checkmark-outline',
          iconColor: '#16A34A',
          iconBg: '#F0FDF4',
          points: [
            'Mehnat şartnomasi kamida 2 nusxada yozma şaklda tuziladi va bir nusxasi xodimda qoladi',
            'Işga qabul qiliş buyruği şartnoma imzolangandan söng 3 kun içida çiqariladi',
            'Sinov muddati umumiy tartibda 3 oydan, rahbarlar uçun 6 oydan oşmasligi kerak',
            'Yoş mutaxassislar va homilador ayollarga sinov muddati belgilanmaydi',
          ],
        },
        {
          title: 'Amaliy tavsiyalar va tez-tez uçraydigan xatolar',
          icon: 'warning-outline',
          iconColor: '#DC2626',
          iconBg: '#FEF2F2',
          points: [
            'Oğzaki kelişuvlarga ishonmang: har doim yozma şartnomaning imzolangan nusxasini oling',
            'Iş haqi summasi şartnomada "sof" (netto) körsatilganligini aniqlang',
            'Şartnoma bandlarini töliq öqib çiqmasdan turib aslo imzo çekmang',
          ],
        },
      ],
      docs: [
        {
          title: 'Mehnat şartnomasi andozasi',
          type: 'PDF' as const,
          size: '248 KB',
          badgeColor: '#EF4444',
        },
        {
          title: 'Şartnoma bandlari tuşuntirişi',
          type: 'DOCX' as const,
          size: '182 KB',
          badgeColor: '#2563EB',
        },
      ],
      note: 'Mehnat şartnomasi har doim yozma şaklda tuzilişi kerak. Oğzaki kelişuv mehnat munosabatlarini töliq tasdiqlamaydi.',
      faqs: [
        {
          q: 'Mehnat şartnomasi tuzilmasa nima böladi?',
          a: 'Iş beruvçi Ma’muriy javobgarlik töğrisidagi kodeksning 49-moddasi böyiça BHMning 5 baravaridan 10 baravarigança jarimaga tortiladi. Xodim esa sud orqali mehnat munosabatlari mavjudligini tasdiqlatişi va barça kafolatlarni talab qilişi mumkin.',
          badge: 'Javobgarlik',
          article: 'MK 105-modda • MJtK 49-modda',
          views: '28,4 ming',
        },
        {
          q: 'Sinov muddati davrida maoh kamroq tölanişi qonuniymi?',
          a: 'Aslo yöq! Sinov muddati davrida xodimga umumiy tartibdagi töliq maoh, ustamalar va barça mehnat qonunçiligi kafolatlari töliq tatbiq etiladi. Kam haq tölaş qat’iyan man etiladi.',
          badge: 'Sinov muddati',
          article: 'MK 132-modda',
          views: '19,1 ming',
        },
        {
          q: 'Muddatli şartnoma qaçondan nomuayyan muddatliga aylanadi?',
          a: 'Agar muddatli mehnat şartnomasining muddati tugagaç, mehnat munosabatlari davom ettirilsa va tomonlardan biri uni bekor qilişni talab qilmagan bölsa, şartnoma nomuayyan muddatga uzaytirilgan hisoblanadi.',
          badge: 'Muddat',
          article: 'MK 111-modda',
          views: '15,6 ming',
        },
        {
          q: 'Mehnat şartnomasi nusxasi xodimga berilişi şartmi?',
          a: 'Ha, mehnat şartnomasi kamida ikki nusxada yozma tuziladi va bir nusxasi imzolangan holda albatta xodimga topshirilişi şart. Iş beruvçida faqat bitta nusxa qolişi qonunbuzarlikdir.',
          badge: 'Hujjat',
          article: 'MK 107-modda',
          views: '12,3 ming',
        },
      ],
    },
    {
      id: 'ish_haqi',
      title: 'Iş haqi va tölovlar',
      desc: 'Iş haqi, ustama, mukofot va tölovlar tartibi.',
      subtitle: 'Oylik maoh, ustamalar, mukofotlar va tölovlarni undiriş kafolatlari.',
      category: 'popular' as const,
      iconName: 'coins',
      iconFamily: 'FontAwesome5' as const,
      iconColor: '#D97706',
      video: {
        title: 'Iş haqini hisoblaş, tölaş muddatlari va ushlanmalar qonuniyligi',
        duration: '07:15',
        level: 'Örta daraja',
        views: '19,4 ming',
      },
      summary: 'Iş haqi — xodimning bajargan mehnati uçun qonuniy haqdir. Iş beruvçi har 16 kunda kamida bir marotaba oylik maohni tölab berişga majburdir.',
      sections: [
        {
          title: 'Iş haqini tölaş muddatlari va me’yorlari',
          icon: 'cash-outline',
          iconColor: '#D97706',
          iconBg: '#FEF3C7',
          points: [
            'Iş haqi oyiga kamida ikki marta (har 16 kunda bir marta) tölanişi şart',
            'Tölov kuni dam oliş kuniga töğri kelsa, undan oldingi iş kunida tölanadi',
            'Oylik hisob-kitob varaqasi (raschyotniy listok) har bir xodimga beriladi',
          ],
        },
        {
          title: 'Ustamalar, kompensatsiya va qöşimça tölovlar',
          icon: 'trending-up-outline',
          iconColor: '#16A34A',
          iconBg: '#F0FDF4',
          points: [
            'Tungi vaqtdagi iş uçun kamida 1.5 barobar miqdorda haq tölanadi',
            'Bayram va dam oliş kunlaridagi iş uçun kamida 2 barobar haq tölanadi',
            'Iş vaqtidan taşqari işlar (sverxurochniy) uçun kamida 2 barobar haq tölanadi',
          ],
        },
        {
          title: 'Iş haqidan ushlab qoliş tartibi va çeklovlari',
          icon: 'shield-checkmark-outline',
          iconColor: '#0284C7',
          iconBg: '#E0F2FE',
          points: [
            'Iş haqidan ushlab qoliş umumiy miqdori 50 foizdan oşmasligi kerak (alimentdan taşqari)',
            'Xodimning yozma roziligisiz jarima yoki noqonuniy ushlanmalar taqiqlanadi',
            'Yetkazilgan zarar faqat xodimning bir oylik maohi doirasida undirilishi mumkin',
          ],
        },
        {
          title: 'Oylik keçiktirilganda undiriş va javobgarlik',
          icon: 'warning-outline',
          iconColor: '#DC2626',
          iconBg: '#FEF2F2',
          points: [
            'Har bir keçiktirilgan kun uçun Markaziy bank qayta moliyalaş stavkasida foiz tölanadi',
            'Mehnat inspeksiyasining 1176 ishonç telefoni orqali murojaat qiliş mumkin',
            'Sudga ariza berilganda da’vogar davlat bojidan ozod etiladi',
          ],
        },
      ],
      docs: [
        {
          title: 'Iş haqi talabnomasi andozasi',
          type: 'PDF' as const,
          size: '215 KB',
          badgeColor: '#EF4444',
        },
        {
          title: 'Keçiktirilgan kunlar kompensatsiyasi hisobi',
          type: 'DOCX' as const,
          size: '140 KB',
          badgeColor: '#2563EB',
        },
      ],
      note: 'Iş haqi belgilangan muddatdan bir kun ham keçiktirilmasligi kerak. Har bir keçiktirilgan kun uçun iş beruvçi qonuniy kompensatsiya tölaşga majbur.',
      faqs: [
        {
          q: 'Oylik maoh qançagaça keçiktirilişi mumkin?',
          a: 'Mehnat qonunçiligiga köra bir kun ham keçiktirişga yöll qöyilmaydi. Iş beruvçi maohni har yarim oyda kamida bir marta (16 kundan oşmagan oraliqda) tölab berişga majbur.',
          badge: 'Tölov kafolati',
          article: 'MK 253-modda',
          views: '32,1 ming',
        },
        {
          q: 'Iş haqi keçiktirilganda penya kompensatsiyasi qanday undiriladi?',
          a: 'Mehnat kodeksining 333-moddasiga binoan, iş beruvçi keçiktirilgan har bir kun uçun Markaziy bank qayta moliyalaş stavkasining 1/300 miqdorida penya tölaşga majburdir.',
          badge: 'Kompensatsiya',
          article: 'MK 333-modda',
          views: '24,8 ming',
        },
        {
          q: 'Xodimning roziligisiz maohdan uşlab qoliş mumkinmi?',
          a: 'Xodimning yozma roziligisiz faqat qonunda belgilangan hollarda (soliqlar, sud ijro hujjatlari, aliment) uşlab qolinişi mumkin. Jami uşlanmalar umumiy maohning 50 foizidan oşmasligi şart.',
          badge: 'Uşlanmalar',
          article: 'MK 269-modda',
          views: '21,5 ming',
        },
        {
          q: 'Dam oliş yoki bayram kunlaridagi işga qanday haq tölanadi?',
          a: 'Dam oliş va bayram kunlaridagi iş uçun kamida ikki hissa miqdorida haq tölanadi yoki xodimning xohişiga köra boşqa haq tölangan dam oliş kuni (otgul) beriladi.',
          badge: 'Qöşimça haq',
          article: 'MK 263-modda',
          views: '18,4 ming',
        },
      ],
    },
    {
      id: 'tatil',
      title: 'Ta’til huquqi',
      desc: 'Yillik, qöşimça va ijtimoiy ta’tillar haqida.',
      subtitle: 'Yillik asosiy, qöşimça va ijtimoiy ta’tillar, ta’til pullari me’yorlari.',
      category: 'basic' as const,
      iconName: 'calendar-outline',
      iconFamily: 'Ionicons' as const,
      iconColor: '#16A34A',
      video: {
        title: 'Mehnat ta’tili: beriliş muddatlari, pulini hisoblaş va kompensatsiya',
        duration: '06:50',
        level: 'Boşlanğiç daraja',
        views: '16,2 ming',
      },
      summary: 'Har bir xodimga har yili kamida 21 kalendar kunlik asosiy uzaytirilgan mehnat ta’tili kafolatlanadi. Ta’til davrida iş joyi va örtacha iş haqi saqlanadi.',
      sections: [
        {
          title: 'Yillik asosiy va qöşimça mehnat ta’tili',
          icon: 'calendar-outline',
          iconColor: '#16A34A',
          iconBg: '#F0FDF4',
          points: [
            'Yangi Mehnat kodeksiga köra eng kam ta’til muddati 21 kalendar kun etib belgilangan',
            'Zararli mehnat şaroiti va uzoq staj uçun qöşimça ta’til kunlari beriladi',
            'Pedagoglar va tibbiyot xodimlari uçun uzaytirilgan maxsus ta’tillar mavjud',
          ],
        },
        {
          title: 'Ta’tilga çiqiş navbati va grafigi',
          icon: 'time-outline',
          iconColor: '#0284C7',
          iconBg: '#E0F2FE',
          points: [
            'Yillik ta’tillar jadvali yil boşlanmasidan oldin kasaba uyuşmasi bilan tasdiqlanadi',
            'Birinçi iş yilida 6 oy uzluksiz işlagandan söng ta’tilga çiqiş huquqi paydo böladi',
            'Ta’tildan faqat xodimning roziligi bilan çaqirib oliş mumkin',
          ],
        },
        {
          title: 'Ta’til puli (otpusknoy) tölaş tartibi',
          icon: 'cash-outline',
          iconColor: '#D97706',
          iconBg: '#FEF3C7',
          points: [
            'Ta’til puli ta’til boşlanişidan kamida 3 iş kuni oldin töliq tölab berilişi şart',
            'Oxirgi 12 oylik örtacha oylik daromaddan kelib çiqib hisoblanadi',
            'Tölanmagan ta’til puli tufayli ta’tilni boshqa muddatga köçirişni talab qiliş mumkin',
          ],
        },
        {
          title: 'Ijtimoiy ta’tillar va bola parvarişi',
          icon: 'heart-outline',
          iconColor: '#BE123C',
          iconBg: '#FFF1F2',
          points: [
            'Homiladorlik va tuğruq ta’tili 126 kalendar kunga beriladi va 100% tölanadi',
            'Bola 2 va 3 yoşga tölgunça bola parvarişlaş ta’tili kafolatlanadi',
            'Oliy ta’limda sirtqi öqiydigan xodimlarga sessiya davrida oylikli ta’til beriladi',
          ],
        },
      ],
      docs: [
        {
          title: 'Mehnat ta’tili arizasi andozasi',
          type: 'PDF' as const,
          size: '198 KB',
          badgeColor: '#EF4444',
        },
        {
          title: 'Ta’til puli hisob-kitob varaqasi',
          type: 'DOCX' as const,
          size: '155 KB',
          badgeColor: '#2563EB',
        },
      ],
      note: 'Ta’til puli xodim ta’tilga çiqişidan kamida 3 kun oldin tölab berilişi şart. Aks holda xodim ta’tilni keçiktirişga haqlidir.',
      faqs: [
        {
          q: 'Ta’til puli vaqtida berilmasa nima qiliş kerak?',
          a: 'Ta’til puli xodim ta’tilga çiqişidan kamida 3 kun oldin tölab berilişi şart. Agar tölanmasa, xodim ta’til başlanişini pul töliq tölanganga qadar surişni talab qiliş huquqiga ega.',
          badge: 'Ta’til puli',
          article: 'MK 233-modda',
          views: '27,3 ming',
        },
        {
          q: 'Yangi işga kirgan xodim qaçondan ta’tilga çiqişi mumkin?',
          a: 'Birinçi iş yili uçun yillik asosiy mehnat ta’tili korxonada uzluksiz 6 oy işlagandan söng beriladi. Tomonlar kelişuvi bilan 6 oy tölmasdan oldin ham berilişi mumkin.',
          badge: 'Muddat',
          article: 'MK 227-modda',
          views: '22,6 ming',
        },
        {
          q: 'Asosiy yillik ta’tilning eng kam muddati qança?',
          a: 'Yangi Mehnat kodeksiga köra, yillik asosiy ta’til muddati kamida 21 kalendar kun etib belgilangan (eski tahrirdagi 15 iş kuni örniga).',
          badge: 'Davomiylik',
          article: 'MK 217-modda',
          views: '19,8 ming',
        },
        {
          q: 'Foydalanilmagan ta’til pullari kuyib ketadimi?',
          a: 'Yöq! Mehnat şartnomasi bekor qilinganda xodimga barça yillar uçun foydalanilmagan ta’tillar böyiça töliq pul kompensatsiyasi tölab beriladi.',
          badge: 'Kompensatsiya',
          article: 'MK 234-modda',
          views: '16,2 ming',
        },
      ],
    },
    {
      id: 'ish_vaqti',
      title: 'Iş vaqti va dam oliş',
      desc: 'Iş vaqti me’yorlari, dam oliş kunlari va tanaffuslar.',
      subtitle: 'Kundalik va haftalik iş me’yorlari, tanaffuslar va dam oliş kunlari.',
      category: 'basic' as const,
      iconName: 'time-outline',
      iconFamily: 'Ionicons' as const,
      iconColor: '#4F46E5',
      video: {
        title: 'Haftalik 40 soatlik me’yor, tanaffuslar va ortiqça işlatiş tartibi',
        duration: '05:40',
        level: 'Boşlanğiç daraja',
        views: '12,7 ming',
      },
      summary: 'Haftalik normal iş vaqti 40 soatdan oşmasligi şart. Kunlik iş vaqti, dam oliş kunlari va ovqatlanish tanaffuslari qonun bilan qat’iy himoyalangan.',
      sections: [
        {
          title: 'Normal va qisqartirilgan iş vaqti',
          icon: 'time-outline',
          iconColor: '#4F46E5',
          iconBg: '#EEF2FF',
          points: [
            'Normal haftalik iş vaqti: 5 kunlik haftada 8 soatdan, 6 kunlikda 7 soatdan oşmaydi',
            '16 yoşdan 18 yoşgaça bölganlarga haftasiga 36 soatdan oşmaydigan rejim',
            '1 va 2-guruh nogironligi bölgan xodimlarga haftasiga 36 soatlik qisqartirilgan vaqt',
          ],
        },
        {
          title: 'Tuşlik va texnologik tanaffuslar',
          icon: 'restaurant-outline',
          iconColor: '#16A34A',
          iconBg: '#F0FDF4',
          points: [
            'Dam oliş va ovqatlanish tanaffusi kamida 30 daqiqa, köpi bilan 2 soat böladi',
            'Tanaffus vaqti iş vaqtiga kirmaydi va xodim undan erkin foydalaniş huquqiga ega',
            'Kompyuter qarşisidagi uzluksiz işda har soatda 10-15 daqiqa tanaffus berilishi lozim',
          ],
        },
        {
          title: 'Iş vaqtidan taşqari işlar (sverxurochniy)',
          icon: 'alert-circle-outline',
          iconColor: '#D97706',
          iconBg: '#FEF3C7',
          points: [
            'Iş vaqtidan taşqari işlaş faqat xodimning yozma roziligi bilan ruxsat etiladi',
            'Ketma-ket ikki kun davomida 4 soatdan va yiliga 120 soatdan oşishi taqiqlanadi',
            'Har bir soat uçun kamida 2 barobar miqdorida haq tölanadi',
          ],
        },
        {
          title: 'Dam oliş kunlari va bayramlar',
          icon: 'calendar-outline',
          iconColor: '#0284C7',
          iconBg: '#E0F2FE',
          points: [
            'Haftalik uzluksiz dam oliş vaqti kamida 42 soatdan kam bölmasligi lozim',
            'Bayram kunlari arafasida kundalik iş vaqti kamida 1 soatga qisqartiriladi',
            'Dam oliş kunlarida işlatiş favqulodda hollardagina qonuniy hisoblanadi',
          ],
        },
      ],
      docs: [
        {
          title: 'Ortiqça iş vaqti rozilik arizasi',
          type: 'PDF' as const,
          size: '185 KB',
          badgeColor: '#EF4444',
        },
        {
          title: 'Iş vaqti hisobi tabeli namunasi',
          type: 'DOCX' as const,
          size: '165 KB',
          badgeColor: '#2563EB',
        },
      ],
      note: 'Iş vaqtidan taşqari işlarga majburlaş qat’iyan man etiladi. Rozilik berilgan taqdirda ham kamida ikki hissa haq tölanişi şart.',
      faqs: [
        {
          q: 'Xodimni dam oliş kunlari işga çaqiriş mumkinmi?',
          a: 'Dam oliş kunlarida işlatiş qat’iyan taqiqlanadi. Faqat xodimning yozma roziligi bilan va ikki hissa haq tölaş yoki boşqa dam oliş kuni beriş şartti bilangina jalb etilişi mumkin.',
          badge: 'Dam oliş',
          article: 'MK 209-modda',
          views: '25,1 ming',
        },
        {
          q: 'Haftalik iş vaqti normasi neça soatdan oşmasligi kerak?',
          a: 'Normal iş vaqti haftasiga 40 soatdan oşmasligi şart. 6 kunlik iş haftasida kunlik 7 soatdan, 5 kunlikda esa 8 soatdan oşişi mumkin emas.',
          badge: 'Iş normasi',
          article: 'MK 182-modda',
          views: '20,4 ming',
        },
        {
          q: 'Iş vaqtidan taşqari ortiqça işning çegarasi bormi?',
          a: 'Ha! Ortiqça iş xodim uçun surunkasiga ikki kun davomida 4 soatdan va yiliga 120 soatdan oşmasligi şart. Majburiy jalb etiş taqiqlanadi.',
          badge: 'Çeklov',
          article: 'MK 190-modda',
          views: '17,9 ming',
        },
        {
          q: 'Tuşlik vaqtida korxonadan çiqib ketiş taqiqlanişi mumkinmi?',
          a: 'Yöq! Tuşlik tanaffusi iş vaqti hisoblanmaydi, xodim bu vaqtda öz xohişiga köra korxonadan taşqarida böliş huquqiga töliq ega.',
          badge: 'Dam oliş vaqti',
          article: 'MK 204-modda',
          views: '14,5 ming',
        },
      ],
    },
    {
      id: 'boshatish',
      title: 'Işdan böşatiş',
      desc: 'Işdan böşatiş asoslari, tartibi va huquqlaringiz.',
      subtitle: 'Şartnomani bekor qiliş asoslari, xodim kafolatlari va kompensatsiyalar.',
      category: 'popular' as const,
      iconName: 'log-out-outline',
      iconFamily: 'Ionicons' as const,
      iconColor: '#BE123C',
      video: {
        title: 'Işdan böşatiş qonuniyligi: asoslar, muddatlar va huquqlarni himoya qiliş',
        duration: '09:15',
        level: 'Yuqori daraja',
        views: '31,5 ming',
      },
      summary: 'Iş beruvçi xodimni özboşimçalik bilan işdan böşata olmaydi. Qonunçilikda har bir asos böyiça qat’iy kafolatlar va kompensatsiyalar belgilangan.',
      sections: [
        {
          title: 'Xodimning öz xohişi bilan şartnomani bekor qilişi',
          icon: 'log-out-outline',
          iconColor: '#BE123C',
          iconBg: '#FFF1F2',
          points: [
            'Xodim iş beruvçini 14 kalendar kun oldin yozma ariza bilan oğohlantiradi',
            '14 kun içida xodim xohlagan paytda arizasini qaytarib oliş huquqiga ega',
            '14 kun ötgach xodim işni töxtatişga haqli, iş beruvçi hisob-kitobni keçiktira olmaydi',
          ],
        },
        {
          title: 'Ştat qisqarişi va korxona tugatilişi kafolatlari',
          icon: 'business-outline',
          iconColor: '#D97706',
          iconBg: '#FEF3C7',
          points: [
            'Xodim kamida 2 oy oldin imzo qöydirilib yozma ravishda oğohlantirilişi şart',
            'Oğohlantiriş muddati örniga pul kompensatsiyasi tölab şartnomani bekor qiliş mumkin',
            'Işdan böşatiş nafaqasi (1 oylik maohdan kam bölmagan) tölab beriladi',
          ],
        },
        {
          title: 'Noqonuniy böşatişdan himoyalangan toifalar',
          icon: 'shield-checkmark-outline',
          iconColor: '#16A34A',
          iconBg: '#F0FDF4',
          points: [
            'Homilador ayollar va 3 yoşgaça bolasi bor onalarni böşatiş taqiqlanadi',
            'Vaqtincha mehnatga layoqatsiz (kasallik varaqasi) davrida böşatiş mumkin emas',
            'Xodim ta’tilda bölgan davrda iş beruvçi taşabbusi bilan böşatiş taqiqlanadi',
          ],
        },
        {
          title: 'Noqonuniy böşatilganda işga tiklaş tartibi',
          icon: 'hammer-outline',
          iconColor: '#0284C7',
          iconBg: '#E0F2FE',
          points: [
            'Böşatiş buyruği çiqan kundan boşlab 1 oy içida fuqarolik sudiga ariza beriladi',
            'Sud xodimni avvalgi işiga tiklaydi va majburiy bekor yurgan kunlariga haq undiradi',
            'Şuningdek, ma’naviy zarar uçun kompensatsiya sud qarori bilan tölanadi',
          ],
        },
      ],
      docs: [
        {
          title: 'Işdan böşatiş arizasi andozasi',
          type: 'PDF' as const,
          size: '205 KB',
          badgeColor: '#EF4444',
        },
        {
          title: 'Sudga işga tiklaş böyiça da’vo arizasi',
          type: 'DOCX' as const,
          size: '240 KB',
          badgeColor: '#2563EB',
        },
      ],
      note: 'Homilador ayollar, 3 yoşgaça bolasi bor ayollar va ta’tildagi xodimlarni iş beruvçi taşabbusi bilan böşatiş qat’iyan man etiladi.',
      faqs: [
        {
          q: 'Arizani 14 kun içida qaytarib oliş mumkinmi?',
          a: 'Ha! Öz xohişi bilan işdan böşaş töğrisida ariza yozgan xodim 14 kalendar kunlik muddat tugagunga qadar arizasini istalgan paytda qaytarib olişga töliq haqli.',
          badge: 'Ariza qaytariş',
          article: 'MK 160-modda',
          views: '34,9 ming',
        },
        {
          q: 'Homilador ayollar va yoş bolali onalarni böşatiş mumkinmi?',
          a: 'Homilador ayollar va 3 yoşgaça bolasi bor xodimlarni iş beruvçi taşabbusi bilan işdan böşatiş qat’iyan man etiladi (korxona töliq tugatilgan hollar bundan mustasno).',
          badge: 'Qat’iy kafolat',
          article: 'MK 408-modda',
          views: '29,3 ming',
        },
        {
          q: 'Ştat qisqarganda xodim neça kun oldin oğohlantiriladi?',
          a: 'Iş beruvçi xodimni ştat qisqarişi sababli kamida 2 oy oldin yozma ravishda tilxat olib oğohlantirişi va işdan böşaş nafaqasini tölaşi şart.',
          badge: 'Oğohlantiriş',
          article: 'MK 165-modda',
          views: '23,7 ming',
        },
        {
          q: 'Işdan böşatiş nafaqasi qança tölanadi?',
          a: 'Ştat qisqarganda xodimning stajiga qarab örtacha oylik maohining 50% dan 200% gaça miqdorida işdan böşatiş nafaqasi tölab beriladi.',
          badge: 'Kafolat nafaqasi',
          article: 'MK 173-modda',
          views: '19,1 ming',
        },
      ],
    },
    {
      id: 'xodim',
      title: 'Xodimning huquq va majburiyatlari',
      desc: 'Mehnat munosabatlarida xodim va iş beruvçining asosiy majburiyatlari.',
      subtitle: 'Mehnat munosabatlarida tenglik, huquqiy kafolatlar va mas’uliyatlar.',
      category: 'popular' as const,
      iconName: 'people-outline',
      iconFamily: 'Ionicons' as const,
      iconColor: '#0284C7',
      video: {
        title: 'Xodim va iş beruvçi: huquqiy muvozanat va nizolarni tinç yöll bilan hal qiliş',
        duration: '08:05',
        level: 'Örta daraja',
        views: '18,9 ming',
      },
      summary: 'Mehnat şartnomasi xodim va iş beruvçi örtasida huquqiy muvozanatni ta’minlaydi. Har ikki tomon qonunda belgilangan majburiyatlarni bajarişi lozim.',
      sections: [
        {
          title: 'Xodimning asosiy mehnat huquqlari',
          icon: 'checkmark-circle-outline',
          iconColor: '#0284C7',
          iconBg: '#E0F2FE',
          points: [
            'Xavfsiz va sanitariya-gigiyena talablariga javob beradigan iş örni bilan ta’minlaniş',
            'Öz mehnati uçun öz vaqtida va töliq hajmda adolatli haq oliş',
            'Kasbiy mahoratini oşiriş, qayta tayyorlaş va malakasini kötariş huquqi',
          ],
        },
        {
          title: 'Xodimning mehnat majburiyatlari',
          icon: 'briefcase-outline',
          iconColor: '#6366F1',
          iconBg: '#EEF2FF',
          points: [
            'Mehnat şartnomasida yuklatilgan vazifalarni vijdonan va sifatli bajariş',
            'Içki mehnat intizomiga, kiyiniş va iş tartibi qoidalariga rioya qiliş',
            'Korxona mol-mulkini asraş va mehnat xavfsizligi qoidalariga amal qiliş',
          ],
        },
        {
          title: 'Iş beruvçining qonuniy mas’uliyati',
          icon: 'shield-checkmark-outline',
          iconColor: '#16A34A',
          iconBg: '#F0FDF4',
          points: [
            'Xodimga şartnomada kelişilgan işni beriş va zarur şaroitlarni yaratiş',
            'Mehnat muhofazasi va texnika xavfsizligi böyiça yöriqnomalar ötkaziş',
            'Xodimning şa’ni va qadr-qimmatini kamsitmaslik, tazyiqlarga yöll qöymaslik',
          ],
        },
        {
          title: 'Mehnat nizolari va komissiyalar',
          icon: 'scale-outline',
          iconColor: '#D97706',
          iconBg: '#FEF3C7',
          points: [
            'Korxonadagi mehnat nizolari komissiyasiga (MNK) ariza bilan murojaat qiliş',
            'MNK qaroridan norozi bölganida 10 kun içida fuqarolik sudiga şikoyat qiliş',
            'Kasaba uyuşmasi orqali jamoaviy manfaatlar va huquqlarni himoya qiliş',
          ],
        },
      ],
      docs: [
        {
          title: 'Içki mehnat tartibi qoidalari namunasi',
          type: 'PDF' as const,
          size: '270 KB',
          badgeColor: '#EF4444',
        },
        {
          title: 'Mehnat nizolari komissiyasiga ariza andozasi',
          type: 'DOCX' as const,
          size: '185 KB',
          badgeColor: '#2563EB',
        },
      ],
      note: 'Iş beruvçi xodimga şartnomada közda tutilmagan va xodimning hayoti yoki soğliğiga xavf tuğdiruvçi işlarni yuklaşga haqli emas.',
      faqs: [
        {
          q: 'Iş beruvçi şartnomada bölmagan vazifani yuklasa nima qiliş kerak?',
          a: 'Mehnat kodeksining 115-moddasiga asosan xodim şartnomada kelişilmagan, öz mehnat vazifalariga kirmaydigan yoki hayoti va soğliğiga xavf tuğdiradigan işlarni bajarişdan boş tortişga töliq haqli.',
          badge: 'Qonuniy rad etiş',
          article: 'MK 115-modda',
          views: '26,4 ming',
        },
        {
          q: 'Mehnat huquqi buzilganda 1176 ga qanday şikoyat qilinadi?',
          a: 'Davlat mehnat inspeksiyasining 1176 qisqa raqami yoki dmi.mehnat.uz portali orqali bepul şikoyat qoldiriş mumkin. Murojaat anonim saqlanişi kafolatlanadi.',
          badge: 'Inspeksiya 1176',
          article: 'MK 538-modda',
          views: '22,9 ming',
        },
        {
          q: 'Xodimga intizomiy jazo qanday tartibda berilişi kerak?',
          a: 'Jazo qöllaşdan oldin xodimdan albatta yozma tuşuntiriş xati talab qilişi şart. Tuşuntirişsiz berilgan hayfsan yoki jazo qonunga zid hisoblanadi.',
          badge: 'Intizomiy jazo',
          article: 'MK 313-modda',
          views: '18,7 ming',
        },
        {
          q: 'Mehnat nizolarini hal qilişda kim yordam beradi?',
          a: 'Korxona kasaba uyuşmasi qömitasi, Mehnat inspeksiyasi (1176 ishonç telefoni) yoki fuqarolik işlari böyiça tuman sudi hal qiladi.',
          badge: 'Himoya organlari',
          article: 'MK 538-modda',
          views: '15,2 ming',
        },
      ],
    },
  ];

  const renderHuquqIcon = (item: typeof huquqlarList[0]) => {
    if (item.iconFamily === 'MaterialCommunityIcons') {
      return <MaterialCommunityIcons name={item.iconName as any} size={26} color={item.iconColor} />;
    }
    if (item.iconFamily === 'FontAwesome5') {
      return <FontAwesome5 name={item.iconName as any} size={23} color={item.iconColor} />;
    }
    return <Ionicons name={item.iconName as any} size={26} color={item.iconColor} />;
  };

  // Filtering rights
  const filteredHuquqlar = huquqlarList.filter((item) => {
    const matchesCategory =
      rightsCategoryFilter === 'all' || item.category === rightsCategoryFilter;
    const matchesSearch =
      item.title.toLowerCase().includes(rightsSearchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(rightsSearchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleTopicPress = (topic: typeof huquqlarList[0]) => {
    setSelectedTopicDetail(topic);
    setDetailFilterTab('general');
    setExpandedAccordionIdx(0);
  };

  const handleToggleBookmark = () => {
    setIsBookmarked((prev) => {
      const next = !prev;
      Alert.alert(
        next ? 'Saqlandi 📌' : 'Olib taşlandi',
        next
          ? `«${selectedTopicDetail?.title || ''}» mavzusi xatchöplaringizga qöşildi.`
          : 'Mavzu xatchöplardan olib taşlandi.'
      );
      return next;
    });
  };

  const handleShareTopic = async () => {
    if (!selectedTopicDetail) return;
    try {
      await Share.share({
        title: selectedTopicDetail.title,
        message: `${selectedTopicDetail.title}
${selectedTopicDetail.subtitle}

Yordam ilovasida batafsil öqing: https://yordam.uz/huquq/${selectedTopicDetail.id}`,
      });
    } catch {
      Alert.alert('Ulaşiş', 'Mavzuni ulaşişda xatolik yuz berdi.');
    }
  };

  const handleTogglePlayVideo = () => {
    setVideoIsPlaying((prev) => {
      const next = !prev;
      Alert.alert(
        next ? 'Video ijro etilmoqda ▶️' : 'Video pauzada ⏸️',
        next
          ? `«${selectedTopicDetail?.video?.title || ''}» darsligi ijro etilmoqda.`
          : 'Video töxtatildi.'
      );
      return next;
    });
  };

  const handleToggleLikeVideo = () => {
    setVideoIsLiked((prev) => {
      const next = !prev;
      Alert.alert(
        next ? 'Sizga yoqdi ❤️' : 'Bekor qilindi',
        next
          ? 'Uşbu darslikka ijobiy baho berdingiz.'
          : 'Bahongiz bekor qilindi.'
      );
      return next;
    });
  };

  const handleCycleVideoSpeed = () => {
    const speeds: Array<'1.0x' | '1.25x' | '1.5x' | '2.0x'> = ['1.0x', '1.25x', '1.5x', '2.0x'];
    const currentIdx = speeds.indexOf(videoSpeed);
    const nextSpeed = speeds[(currentIdx + 1) % speeds.length];
    setVideoSpeed(nextSpeed);
    Alert.alert('Ijro tezligi ⏱️', `Video tezligi: ${nextSpeed} ga özgartirildi.`);
  };

  const handleOfflineSave = () => {
    Alert.alert(
      'Oflayn rejimda saqlandi 📲',
      'Video darslik qurilma xotirasiga muvaffaqiyatli saqlandi. Endi internetsiz ham körişingiz mumkin.',
      [{ text: 'Ajoyib' }]
    );
  };

  const handleShowKonspekt = () => {
    Alert.alert(
      'Dars konspekti va asosiy tezislar 📝',
      '1. Mehnat şartnomasi har doim yozma şaklda tuzilişi şart.\n2. Sinov muddati umumiy tartibda 3 oydan oşmasligi kerak.\n3. Iş haqi oyiga kamida 2 marta tölanişi lozim.\n4. Mehnat şartnomasining 1 nusxasi albatta xodimda qoladi.\n5. Xodim huquqlari Mehnat inspeksiyasi (1176) tomonidan himoyalanadi.',
      [{ text: 'Tuşundim' }]
    );
  };

  const handleSelectChapter = (idx: number, chTitle: string, time: string) => {
    setActiveChapterIdx(idx);
    setVideoIsPlaying(true);
    Alert.alert(
      'Bölimga ötildi ⏱️',
      `«${chTitle}» (${time}) qismi ijro etilmoqda.`
    );
  };

  const handlePlayVideo = (topic: typeof huquqlarList[0]) => {
    Alert.alert(
      `📹 ${topic.video.title}`,
      `Davomiyligi: ${topic.video.duration}
Darajasi: ${topic.video.level}
Körişlar soni: ${topic.video.views}

Uşbu video dars orqali «${topic.title}» böyiça huquqlaringizni ekspertlar tuşuntirişida tomosha qiling.`,
      [
        { text: 'Tomosha qiliş ▶️', onPress: () => Alert.alert('Video pleer', 'Video dars yuklanmoqda...') },
        { text: 'Yopiş', style: 'cancel' },
      ]
    );
  };

  const handleDownloadDoc = (doc: any) => {
    // Add to myDocsList if not already present
    setMyDocsList((prev) => {
      const exists = prev.some((d) => d.title === doc.title);
      if (exists) return prev;
      return [
        {
          id: `saved_${Date.now()}`,
          title: doc.title,
          type: doc.type,
          size: doc.size,
          date: 'Bugun, 2025',
          status: 'Tayyor',
          statusBg: '#DCFCE7',
          statusColor: '#16A34A',
          badgeBg: doc.badgeColor || '#2563EB',
          legalRef: doc.legalRef || 'MK 2025',
          content: doc.content || `«${doc.title}» rasmiy andozasi.\n\nÖzbekiston Respublikasi yangi Mehnat kodeksi me’yorlari asosida rasmiylaştirilgan.`,
        },
        ...prev,
      ];
    });

    Alert.alert(
      'Hujjat muvaffaqiyatli yuklandi 📥',
      `«${doc.title}» (${doc.type} • ${doc.size})

Rasmiy andoza qurilmangizga saqlandi va «Mening hujjatlarim» bölimiga qöşildi.`,
      [
        {
          text: 'Köriş 👁️',
          onPress: () => setPreviewDoc(doc),
        },
        { text: 'Tayyor', style: 'cancel' },
      ]
    );
  };

  const handleShareDoc = async (doc: any) => {
    try {
      await Share.share({
        title: doc.title,
        message: `📄 ${doc.title} (${doc.type || 'Hujjat'})
Asos: ${doc.legalRef || 'Özbekiston Respublikasi Mehnat Kodeksi'}

${doc.desc || ''}

Yordam ilovasi orqali rasmiy andozani oling: https://yordam.uz/docs/${doc.id || 'mehnat'}`,
      });
    } catch {
      Alert.alert('Ulaşiş', 'Hujjatni ulaşişda xatolik yuz berdi.');
    }
  };

  const handleOpenConstructorForDoc = (doc?: any) => {
    if (doc) {
      if (doc.id === 'doc_tatil_ariza' || doc.title?.toLowerCase().includes('ta’til')) {
        setConstructorDocKey('tatil');
      } else if (doc.id === 'doc_ish_haqi_talab' || doc.title?.toLowerCase().includes('haqi')) {
        setConstructorDocKey('ish_haqi');
      } else if (doc.id === 'doc_boshatish_ariza' || doc.title?.toLowerCase().includes('böşa')) {
        setConstructorDocKey('boshatish');
      } else if (doc.id === 'doc_inspeksiya_shikoyat' || doc.category === 'complaints') {
        setConstructorDocKey('shikoyat');
      }
    }
    setConstructorTab('form');
    setIsConstructorVisible(true);
  };

  const getGeneratedConstructorDoc = () => {
    const { fullName, companyName, position, date } = constructorForm;
    switch (constructorDocKey) {
      case 'tatil':
        return {
          title: 'Mehnat ta’tili arizasi',
          docTitle: 'ARIZA',
          to: `${companyName || '«KORXONA»'} direktori rahbariyatiga`,
          from: `${position || 'Xodim'} ${fullName || 'F.I.Sh.'}dan`,
          legalRef: 'MK 216, 217-moddalar',
          body: `Özbekiston Respublikasi yangi tahrirdagi Mehnat kodeksining 216 va 217-moddalariga asosan, menga ${date || '2025-yil'} dan boşlab davomiyligi 21 kalendar kun bölgan yillik asosiy haq tölanadigan mehnat ta’tili berişingizni hamda tegişli ta’til pullarini qonunda belgilangan tartibda tölab berişingizni sörayman.`,
          date: date || '11-mart, 2025',
          sign: fullName || 'Imzo',
        };
      case 'ish_haqi':
        return {
          title: 'Iş haqi böyiça talabnoma',
          docTitle: 'TALABNOMA',
          to: `${companyName || '«KORXONA»'} rahbariyatiga`,
          from: `${position || 'Xodim'} ${fullName || 'F.I.Sh.'}dan`,
          legalRef: 'MK 253, 333-moddalar',
          body: `Özbekiston Respublikasi Mehnat kodeksining 253-moddasiga asosan iş beruvçi xodimga iş haqini belgilangan muddatda tölaşi şart. Kodeksning 333-moddasiga binoan, iş haqi keçiktirilgan har bir kun uçun Markaziy bank qayta moliyalash stavkasi miqdorida penya kompensatsiyasi tölanişi lozim.\n\nMenga oylik maohimni hamda qonuniy kompensatsiyani 3 iş kuni içida tölab berişingizni talab qilaman. Aks holda Davlat mehnat inspeksiyasi (1176) hamda sudga murojaat qilinadi.`,
          date: date || '11-mart, 2025',
          sign: fullName || 'Imzo',
        };
      case 'boshatish':
        return {
          title: 'Öz xohişi bilan böşaş arizasi',
          docTitle: 'ARIZA',
          to: `${companyName || '«KORXONA»'} rahbariyatiga`,
          from: `${position || 'Xodim'} ${fullName || 'F.I.Sh.'}dan`,
          legalRef: 'MK 160-modda',
          body: `Özbekiston Respublikasi Mehnat kodeksining 160-moddasiga asosan men bilan tuzilgan mehnat şartnomasini öz xohişimga köra bekor qilişingizni sörayman.\n\nQonunda belgilangan 14 kalendar kunlik oğohlantiriş muddati tugagandan söng oxirgi iş kunim deb hisoblanişi, mehnat daftarçam va yakuniy hisob-kitob mablağlari topshirilişi ta’minlanişini sörayman.`,
          date: date || '11-mart, 2025',
          sign: fullName || 'Imzo',
        };
      case 'shikoyat':
        return {
          title: 'Davlat mehnat inspeksiyasiga şikoyat xati',
          docTitle: 'ŞIKOYAT XATI',
          to: `Davlat mehnat inspeksiyasi hududiy boshqarmasiga`,
          from: `Fuqaro ${fullName || 'F.I.Sh.'}dan (Tel: +998 90 123-45-67)`,
          legalRef: 'MK 538, 545-moddalar',
          body: `Men «${companyName || 'KORXONA'}»da ${position || 'xodim'} lavozimida faoliyat yuritib kelmoqdaman.\n\nIş beruvçi tomonidan mehnat qonunçiligi talablari buzilmoqda (oylik maoh öz vaqtida berilmayapti / mehnat şartnomasi rasmiylaştirilmagan).\n\nMehnat kodeksining 538-moddasiga asosan mazkur taşkilotda qonuniy tekşiruv ötkazişingizni va buzilgan huquqlarimni tiklaşda yordam berişingizni sörayman.`,
          date: date || '11-mart, 2025',
          sign: fullName || 'Imzo',
        };
    }
  };

  const handleSaveConstructorDoc = () => {
    const gen = getGeneratedConstructorDoc();
    setMyDocsList((prev) => [
      {
        id: `gen_${Date.now()}`,
        title: gen.title,
        type: 'DOCX',
        size: '190 KB',
        date: 'Bugun, 2025',
        status: 'Tayyor',
        statusBg: '#DCFCE7',
        statusColor: '#16A34A',
        badgeBg: '#2563EB',
        legalRef: gen.legalRef,
        content: `${gen.to}\n${gen.from}\n\n${gen.docTitle}\n\n${gen.body}\n\nSana: ${gen.date}\nImzo: ${gen.sign}`,
      },
      ...prev,
    ]);
    Alert.alert('Muvaffaqiyatli saqlandi 🎉', 'Yaratilgan rasmiy hujjat «Mening hujjatlarim» bölimiga saqlandi.');
    setIsConstructorVisible(false);
  };

  const renderPreviewModal = () => {
    if (!previewDoc) return null;
    const docTitle = previewDoc.docTitle || previewDoc.title;
    const docContent =
      previewDoc.content ||
      `«${previewDoc.title}» rasmiy andozasi.\n\nÖzbekiston Respublikasi yangi tahrirdagi Mehnat kodeksi talablariga 100% mos ravishda rasmiylaştirilgan.\n\nUşbu hujjatdan foydalanişdan oldin rekvizitlarni töldiring hamda kamida 2 nusxada chop etib, tegishli tartibda imzo çeking.`;

    return (
      <Modal
        visible={!!previewDoc}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setPreviewDoc(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheetContainer, { paddingTop: insets.top + 8, paddingBottom: Math.max(insets.bottom, 16) }]}>
            {/* Modal Header */}
            <View style={styles.modalHeaderRow}>
              <View style={styles.modalHeaderTitleCol}>
                <View style={styles.modalBadgePill}>
                  <Ionicons name="shield-checkmark" size={12} color="#16A34A" style={{ marginRight: 4 }} />
                  <Text style={styles.modalBadgeText}>Yuridik tasdiqlangan • 2025</Text>
                </View>
                <Text style={styles.modalDocHeading} numberOfLines={1}>
                  {previewDoc.title}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setPreviewDoc(null)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={20} color="#0F172A" />
              </TouchableOpacity>
            </View>

            {/* Document Paper Body */}
            <ScrollView style={styles.modalPaperScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.officialPaperCard}>
                {/* Official Crest Header */}
                <View style={styles.paperCrestBox}>
                  <Ionicons name="ribbon-outline" size={24} color="#0F2644" style={{ marginBottom: 4 }} />
                  <Text style={styles.paperCrestTitle}>ÖZBEKISTON RESPUBLIKASI MEHNAT QONUNÇILIGI</Text>
                  <Text style={styles.paperCrestSubtitle}>2025-YILGI YANGI TAHRIR TALABLARI ASOSIDA RASMIYLASHTIRILGAN</Text>
                  <View style={styles.paperDividerLine} />
                </View>

                {/* Recipient & Sender */}
                <View style={styles.paperHeaderInfoCol}>
                  <Text style={styles.paperHeaderInfoText}>
                    {previewDoc.to || '«KORXONA NOMI» rahbariyatiga'}
                  </Text>
                  <Text style={styles.paperHeaderInfoText}>
                    {previewDoc.from || 'Xodim F.I.Sh.dan'}
                  </Text>
                </View>

                {/* Centered Document Title */}
                <View style={styles.paperTitleCenterBox}>
                  <Text style={styles.paperDocMainTitle}>
                    {previewDoc.docTitle || 'RASMIY ANDOZA'}
                  </Text>
                  {previewDoc.legalRef && (
                    <Text style={styles.paperDocLegalRef}>({previewDoc.legalRef})</Text>
                  )}
                </View>

                {/* Main Content Text */}
                <Text style={styles.paperDocContentText}>{docContent}</Text>

                {/* Footer Dates & Sign */}
                <View style={styles.paperFooterRow}>
                  <Text style={styles.paperFooterText}>Sana: 11-mart, 2025-yil</Text>
                  <Text style={styles.paperFooterText}>Imzo: _________________</Text>
                </View>

                {/* Watermark / Seal */}
                <View style={styles.paperSealStampBox}>
                  <Ionicons name="checkmark-done-circle" size={16} color="#16A34A" style={{ marginRight: 5 }} />
                  <Text style={styles.paperSealStampText}>YURIDIK NAZORATDAN ÖTGAN • YORDAM 2025</Text>
                </View>
              </View>
            </ScrollView>

            {/* Bottom Actions Bar */}
            <View style={styles.modalBottomActionsRow}>
              <TouchableOpacity
                style={styles.modalActionSecondaryBtn}
                activeOpacity={0.7}
                onPress={() => {
                  Alert.alert('Nusxa olindi 📋', 'Hujjat matni qurilma xotirasiga nusxalandi.');
                }}
              >
                <Ionicons name="copy-outline" size={16} color="#0F2644" style={{ marginRight: 6 }} />
                <Text style={styles.modalActionSecondaryBtnText}>Nusxa oliş</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalActionSecondaryBtn}
                activeOpacity={0.7}
                onPress={() => handleShareDoc(previewDoc)}
              >
                <Ionicons name="share-social-outline" size={16} color="#0F2644" style={{ marginRight: 6 }} />
                <Text style={styles.modalActionSecondaryBtnText}>Ulaşiş</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalActionPrimaryBtn}
                activeOpacity={0.8}
                onPress={() => {
                  handleDownloadDoc(previewDoc);
                  setPreviewDoc(null);
                }}
              >
                <Ionicons name="download-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.modalActionPrimaryBtnText}>Yuklab oliş</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderConstructorModal = () => {
    if (!isConstructorVisible) return null;
    const generated = getGeneratedConstructorDoc();

    return (
      <Modal
        visible={isConstructorVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsConstructorVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheetContainer, { paddingTop: insets.top + 8, paddingBottom: Math.max(insets.bottom, 16) }]}>
            {/* Modal Header */}
            <View style={styles.modalHeaderRow}>
              <View style={styles.modalHeaderTitleCol}>
                <View style={[styles.modalBadgePill, { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' }]}>
                  <Ionicons name="sparkles" size={12} color="#D97706" style={{ marginRight: 4 }} />
                  <Text style={[styles.modalBadgeText, { color: '#B45309' }]}>Aqlli Hujjat Konstruktori</Text>
                </View>
                <Text style={styles.modalDocHeading} numberOfLines={1}>
                  2 daqiqada rasmiy ariza yarating
                </Text>
              </View>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setIsConstructorVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={20} color="#0F172A" />
              </TouchableOpacity>
            </View>

            {/* Segmented Tab Bar */}
            <View style={styles.constructorTabsStrip}>
              <TouchableOpacity
                style={[styles.constructorTabBtn, constructorTab === 'form' && styles.constructorTabBtnActive]}
                onPress={() => setConstructorTab('form')}
              >
                <Ionicons
                  name="create-outline"
                  size={15}
                  color={constructorTab === 'form' ? '#FFFFFF' : '#64748B'}
                  style={{ marginRight: 5 }}
                />
                <Text style={[styles.constructorTabBtnText, constructorTab === 'form' && styles.constructorTabBtnTextActive]}>
                  1. Ma’lumotlar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.constructorTabBtn, constructorTab === 'preview' && styles.constructorTabBtnActive]}
                onPress={() => setConstructorTab('preview')}
              >
                <Ionicons
                  name="document-text-outline"
                  size={15}
                  color={constructorTab === 'preview' ? '#FFFFFF' : '#64748B'}
                  style={{ marginRight: 5 }}
                />
                <Text style={[styles.constructorTabBtnText, constructorTab === 'preview' && styles.constructorTabBtnTextActive]}>
                  2. Tayyor hujjat
                </Text>
              </TouchableOpacity>
            </View>

            {constructorTab === 'form' ? (
              <ScrollView style={styles.constructorScroll} showsVerticalScrollIndicator={false}>
                {/* Choose Document Type */}
                <Text style={styles.constructorFieldTitle}>Hujjat turini tanlang:</Text>
                <View style={styles.constructorTypePillGrid}>
                  {[
                    { id: 'tatil', label: 'Ta’til arizasi', article: 'MK 216' },
                    { id: 'ish_haqi', label: 'Iş haqi talabi', article: 'MK 253' },
                    { id: 'boshatish', label: 'Işdan böşaş', article: 'MK 160' },
                    { id: 'shikoyat', label: '1176 Şikoyat', article: 'MK 538' },
                  ].map((item) => {
                    const isSelected = constructorDocKey === item.id;
                    return (
                      <TouchableOpacity
                        key={item.id}
                        style={[
                          styles.constructorTypeChip,
                          isSelected && styles.constructorTypeChipActive,
                        ]}
                        activeOpacity={0.75}
                        onPress={() => setConstructorDocKey(item.id as any)}
                      >
                        <Text style={[styles.constructorTypeChipText, isSelected && styles.constructorTypeChipTextActive]}>
                          {item.label}
                        </Text>
                        <View style={[styles.constructorTypeArticleBadge, isSelected && styles.constructorTypeArticleBadgeActive]}>
                          <Text style={[styles.constructorTypeArticleText, isSelected && styles.constructorTypeArticleTextActive]}>
                            {item.article}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Input Fields */}
                <View style={styles.constructorFormGroup}>
                  <Text style={styles.constructorLabel}>Sizning to‘liq ism-familiyangiz (F.I.Sh.):</Text>
                  <View style={styles.constructorInputBox}>
                    <Ionicons name="person-outline" size={17} color="#64748B" style={{ marginRight: 8 }} />
                    <TextInput
                      style={styles.constructorTextInput}
                      value={constructorForm.fullName}
                      onChangeText={(t) => setConstructorForm((prev) => ({ ...prev, fullName: t }))}
                      placeholder="Masalan: Karimov Jasur Bahodir öğli"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>
                </View>

                <View style={styles.constructorFormGroup}>
                  <Text style={styles.constructorLabel}>Korxona yoki tashkilot nomi:</Text>
                  <View style={styles.constructorInputBox}>
                    <Ionicons name="business-outline" size={17} color="#64748B" style={{ marginRight: 8 }} />
                    <TextInput
                      style={styles.constructorTextInput}
                      value={constructorForm.companyName}
                      onChangeText={(t) => setConstructorForm((prev) => ({ ...prev, companyName: t }))}
                      placeholder="Masalan: «TEXNO INVEST GROUP» MChJ"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>
                </View>

                <View style={styles.constructorFormGroup}>
                  <Text style={styles.constructorLabel}>Lavozimingiz:</Text>
                  <View style={styles.constructorInputBox}>
                    <Ionicons name="briefcase-outline" size={17} color="#64748B" style={{ marginRight: 8 }} />
                    <TextInput
                      style={styles.constructorTextInput}
                      value={constructorForm.position}
                      onChangeText={(t) => setConstructorForm((prev) => ({ ...prev, position: t }))}
                      placeholder="Masalan: Yetakçi mutaxassis"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>
                </View>

                <View style={styles.constructorFormGroup}>
                  <Text style={styles.constructorLabel}>Hujjat sanasi:</Text>
                  <View style={styles.constructorInputBox}>
                    <Ionicons name="calendar-outline" size={17} color="#64748B" style={{ marginRight: 8 }} />
                    <TextInput
                      style={styles.constructorTextInput}
                      value={constructorForm.date}
                      onChangeText={(t) => setConstructorForm((prev) => ({ ...prev, date: t }))}
                      placeholder="11-mart, 2025"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>
                </View>

                {/* Generate Button */}
                <TouchableOpacity
                  style={styles.constructorGenerateSubmitBtn}
                  activeOpacity={0.8}
                  onPress={() => setConstructorTab('preview')}
                >
                  <LinearGradient
                    colors={['#0F2644', '#1E3A8A']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.constructorGenerateSubmitGradient}
                  >
                    <Ionicons name="sparkles" size={16} color="#FBBF24" style={{ marginRight: 8 }} />
                    <Text style={styles.constructorGenerateSubmitText}>Tayyor hujjatni şakllantiriş ✨</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </ScrollView>
            ) : (
              <ScrollView style={styles.constructorScroll} showsVerticalScrollIndicator={false}>
                {/* Result Preview Paper */}
                <View style={styles.officialPaperCard}>
                  <View style={styles.paperCrestBox}>
                    <Ionicons name="ribbon-outline" size={24} color="#0F2644" style={{ marginBottom: 4 }} />
                    <Text style={styles.paperCrestTitle}>ÖZBEKISTON RESPUBLIKASI MEHNAT QONUNÇILIGI</Text>
                    <Text style={styles.paperCrestSubtitle}>YANGI MEHNAT KODEKSI ME’YORLARI ASOSIDA TUZILGAN</Text>
                    <View style={styles.paperDividerLine} />
                  </View>

                  <View style={styles.paperHeaderInfoCol}>
                    <Text style={styles.paperHeaderInfoText}>{generated.to}</Text>
                    <Text style={styles.paperHeaderInfoText}>{generated.from}</Text>
                  </View>

                  <View style={styles.paperTitleCenterBox}>
                    <Text style={styles.paperDocMainTitle}>{generated.docTitle}</Text>
                    <Text style={styles.paperDocLegalRef}>({generated.legalRef})</Text>
                  </View>

                  <Text style={styles.paperDocContentText}>{generated.body}</Text>

                  <View style={styles.paperFooterRow}>
                    <Text style={styles.paperFooterText}>Sana: {generated.date}</Text>
                    <Text style={styles.paperFooterText}>Imzo: ____________ / {generated.sign}</Text>
                  </View>

                  <View style={styles.paperSealStampBox}>
                    <Ionicons name="checkmark-done-circle" size={16} color="#16A34A" style={{ marginRight: 5 }} />
                    <Text style={styles.paperSealStampText}>AVTOMATIK TAYYORLANDI • YORDAM KONSTRUKTOR</Text>
                  </View>
                </View>

                {/* Actions on Generated Doc */}
                <View style={styles.constructorGeneratedActions}>
                  <TouchableOpacity
                    style={styles.constructorSaveDocBtn}
                    activeOpacity={0.8}
                    onPress={handleSaveConstructorDoc}
                  >
                    <Ionicons name="save-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                    <Text style={styles.constructorSaveDocBtnText}>Hujjatlarimga saqlaş</Text>
                  </TouchableOpacity>

                  <View style={styles.constructorSmallActionsRow}>
                    <TouchableOpacity
                      style={styles.constructorSmallActionBtn}
                      activeOpacity={0.7}
                      onPress={() => {
                        Alert.alert('Nusxa olindi 📋', 'Yaratilgan ariza matni xotiraga olindi.');
                      }}
                    >
                      <Ionicons name="copy-outline" size={15} color="#0F2644" style={{ marginRight: 4 }} />
                      <Text style={styles.constructorSmallActionText}>Nusxa oliş</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.constructorSmallActionBtn}
                      activeOpacity={0.7}
                      onPress={() => {
                        Share.share({
                          title: generated.title,
                          message: `${generated.to}\n${generated.from}\n\n${generated.docTitle}\n\n${generated.body}\n\nSana: ${generated.date}\nImzo: ${generated.sign}`,
                        });
                      }}
                    >
                      <Ionicons name="share-social-outline" size={15} color="#0F2644" style={{ marginRight: 4 }} />
                      <Text style={styles.constructorSmallActionText}>Ulaşiş</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.constructorSmallActionBtn}
                      activeOpacity={0.7}
                      onPress={() => setConstructorTab('form')}
                    >
                      <Ionicons name="pencil-outline" size={15} color="#0F2644" style={{ marginRight: 4 }} />
                      <Text style={styles.constructorSmallActionText}>Tahrirlaş</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    );
  };

  const handleOpenMehnatKodeksi = () => {
    setShowMehnatKodeksi(true);
  };

  // Filtering documents for Hujjatlar Markazi
  const filteredDocuments = documentsCatalog.filter((doc) => {
    const matchesCategory =
      docCategoryFilter === 'all' || doc.category === docCategoryFilter;
    const matchesSearch =
      doc.title.toLowerCase().includes(docSearchQuery.toLowerCase()) ||
      doc.desc.toLowerCase().includes(docSearchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFaqAccordion = (index: number) => {
    setExpandedFaqIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleToggleExpandAllFaqs = (totalCount: number) => {
    if (expandedFaqIndices.length === totalCount) {
      setExpandedFaqIndices([]);
    } else {
      setExpandedFaqIndices(Array.from({ length: totalCount }, (_, i) => i));
    }
  };

  const handleVoteFaq = (index: number, vote: 'yes' | 'no') => {
    setFaqVotes((prev) => ({ ...prev, [index]: vote }));
    Alert.alert(
      vote === 'yes' ? 'Rahmat! 👍' : 'Fikringiz qabul qilindi',
      vote === 'yes'
        ? 'Uşbu javob sizga foydali bölganidan xursandmiz.'
        : 'Kelgusi tahrirlarda javobni yanada oydinlaştiriş uçun taklifingiz inobatga olinadi.'
    );
  };

  const handleShareFaq = async (faq: any) => {
    try {
      await Share.share({
        title: faq.q,
        message: `❓ Savol: ${faq.q}\n\n💡 Huquqiy javob: ${faq.a}\n\n📘 Asos: ${faq.article || 'Özbekiston Respublikasi Mehnat Kodeksi'}\n\nYordam ilovasi orqali ulashildi.`,
      });
    } catch {
      Alert.alert('Ulaşiş', 'Ulaşiş oynasi oçilmadi.');
    }
  };

  const handleOpenAskQuestionModal = () => {
    Alert.alert(
      'Savol beriş 💬',
      'Savolingizni Mehnat AI Yordamçisiga yöllamoqçimisiz yoki rasmiy murojaat qoldirmoqçimisiz?',
      [
        {
          text: 'AI Yordamçiga yozish',
          onPress: () => {
            setSelectedTopicDetail(null);
            setActiveTab('ai');
          },
        },
        {
          text: 'Inspeksiyaga (1176)',
          onPress: () =>
            Alert.alert(
              'Davlat Mehnat Inspeksiyasi',
              'Qisqa raqam: 1176\nIshonch telefoni orqali bepul huquqiy himoya so‘rashingiz mumkin.'
            ),
        },
        { text: 'Yopiş', style: 'cancel' },
      ]
    );
  };

  const handleSendAiQuestion = (customText?: string) => {
    const qText = customText || aiQuestionInput;
    if (!qText.trim()) return;

    const newMsg = {
      sender: 'user' as const,
      text: qText,
      time: 'Hozir',
    };

    setAiChatHistory((prev) => [...prev, newMsg]);
    setAiQuestionInput('');

    setTimeout(() => {
      setAiChatHistory((prev) => [
        ...prev,
        {
          sender: 'ai' as const,
          text: `Savolingiz yangi Mehnat Kodeksi normalariga muvofiq tahlil qilindi. «${qText}» holatida xodim manfaatlarini himoya qiluvchi qat’iy qonuniy kafolatlar mavjud. Agar iş beruvçi qonun talabini bajarmasa, 1176 qisqa raqami orqali Mehnat inspeksiyasiga murojaat qilişingiz mumkin.`,
          time: 'Hozir',
          article: 'Özbekiston Respublikasi Mehnat Kodeksi 105, 253, 538-moddalari',
        },
      ]);
    }, 600);
  };

  const handleDocumentPress = () => {
    Alert.alert(
      'Iş haqi böyiça talabnoma 📄',
      'Hujjat holati: Tayyor (PDF, 421 KB)\nSana: 12 mar, 2025\n\nUşbu talabnoma iş beruvçiga öz vaqtida tölanmagan iş haqini undiriş va kompensatsiya talab qiliş uçun rasmiy şaklda tuzilgan.',
      [
        { text: 'Yuklab oliş', onPress: () => Alert.alert('Muvaffaqiyatli', 'Hujjat yuklab olindi.') },
        { text: 'Yopiş', style: 'cancel' },
      ]
    );
  };

  // If Mehnat Kodeksi Online Kitob is opened, render dedicated animated book screen
  if (showMehnatKodeksi) {
    return <MehnatKodeksiKitobScreen onBack={() => setShowMehnatKodeksi(false)} />;
  }

  // If a topic is selected, render the dedicated 1:1 Topic Detail Screen
  if (selectedTopicDetail) {
    return (
      <View style={[styles.rootContainer, { paddingTop: insets.top }]}>
        <StatusBar style="dark" />

        {/* 1. TOP HEADER */}
        <View style={styles.detailHeader}>
          <View style={styles.detailHeaderLeftCol}>
            <TouchableOpacity
              style={styles.detailHeaderBackBtn}
              activeOpacity={0.7}
              onPress={() => setSelectedTopicDetail(null)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="arrow-back" size={20} color="#0F172A" />
            </TouchableOpacity>

            <View style={styles.detailHeaderTitlesBox}>
              <Text style={styles.detailHeaderTitle} numberOfLines={1}>
                Iş va mehnat huquqi
              </Text>
              <Text style={styles.detailHeaderBreadcrumb} numberOfLines={1}>
                Huquqlar  •  {selectedTopicDetail.title}
              </Text>
            </View>
          </View>
        </View>

        {/* 2. SCROLLABLE TOPIC DETAIL BODY */}
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={[
            styles.detailScrollContent,
            { paddingBottom: Math.max(insets.bottom, 20) + 28 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Segment Filter Pills */}
          <View style={styles.detailFilterRow}>
            {/* Pill 1: Umumiy */}
            <TouchableOpacity
              style={[
                styles.detailFilterPill,
                detailFilterTab === 'general'
                  ? styles.detailFilterPillActive
                  : styles.detailFilterPillInactive,
              ]}
              activeOpacity={0.8}
              onPress={() => setDetailFilterTab('general')}
            >
              <Ionicons
                name="play-circle"
                size={16}
                color={detailFilterTab === 'general' ? '#FFFFFF' : '#475569'}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  styles.detailFilterText,
                  detailFilterTab === 'general'
                    ? styles.detailFilterTextActive
                    : styles.detailFilterTextInactive,
                ]}
              >
                Umumiy
              </Text>
            </TouchableOpacity>

            {/* Pill 2: Video dars */}
            <TouchableOpacity
              style={[
                styles.detailFilterPill,
                detailFilterTab === 'video'
                  ? styles.detailFilterPillActive
                  : styles.detailFilterPillInactive,
              ]}
              activeOpacity={0.8}
              onPress={() => setDetailFilterTab('video')}
            >
              <Ionicons
                name="videocam-outline"
                size={16}
                color={detailFilterTab === 'video' ? '#FFFFFF' : '#475569'}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  styles.detailFilterText,
                  detailFilterTab === 'video'
                    ? styles.detailFilterTextActive
                    : styles.detailFilterTextInactive,
                ]}
              >
                Video dars
              </Text>
            </TouchableOpacity>

            {/* Pill 3: Hujjatlar */}
            <TouchableOpacity
              style={[
                styles.detailFilterPill,
                detailFilterTab === 'docs'
                  ? styles.detailFilterPillActive
                  : styles.detailFilterPillInactive,
              ]}
              activeOpacity={0.8}
              onPress={() => setDetailFilterTab('docs')}
            >
              <Ionicons
                name="document-text-outline"
                size={15}
                color={detailFilterTab === 'docs' ? '#FFFFFF' : '#475569'}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  styles.detailFilterText,
                  detailFilterTab === 'docs'
                    ? styles.detailFilterTextActive
                    : styles.detailFilterTextInactive,
                ]}
              >
                Hujjatlar
              </Text>
            </TouchableOpacity>

            {/* Pill 4: Savol-javob */}
            <TouchableOpacity
              style={[
                styles.detailFilterPill,
                detailFilterTab === 'faq'
                  ? styles.detailFilterPillActive
                  : styles.detailFilterPillInactive,
              ]}
              activeOpacity={0.8}
              onPress={() => setDetailFilterTab('faq')}
            >
              <Ionicons
                name="help-circle-outline"
                size={16}
                color={detailFilterTab === 'faq' ? '#FFFFFF' : '#475569'}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  styles.detailFilterText,
                  detailFilterTab === 'faq'
                    ? styles.detailFilterTextActive
                    : styles.detailFilterTextInactive,
                ]}
              >
                Savol-javob
              </Text>
            </TouchableOpacity>
          </View>

          {/* SECTION 1: VIDEO DARS (General Tab Compact Preview) */}
          {detailFilterTab === 'general' && (
            <View style={styles.detailSectionContainer}>
              <View style={styles.detailSectionHeaderRow}>
                <View style={styles.detailSectionTitleGroup}>
                  <Ionicons name="play-circle-outline" size={20} color="#D97706" style={{ marginRight: 6 }} />
                  <Text style={styles.detailSectionTitle}>Video dars</Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setDetailFilterTab('video')}
                >
                  <Text style={styles.detailSeeAllText}>Barçasini köriş →</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.detailVideoCard}
                activeOpacity={0.85}
                onPress={() => setDetailFilterTab('video')}
              >
                <View style={styles.detailVideoThumbWrap}>
                  <Image source={videoLessonCover} style={styles.detailVideoThumbImg} resizeMode="cover" />
                  <View style={styles.detailVideoOverlay} />
                  <View style={styles.detailVideoPlayBtn}>
                    <Ionicons name="play" size={17} color="#FFFFFF" style={{ marginLeft: 2 }} />
                  </View>
                  <View style={styles.detailVideoDurationBadge}>
                    <Text style={styles.detailVideoDurationText}>{selectedTopicDetail.video.duration}</Text>
                  </View>
                </View>

                <View style={styles.detailVideoInfoCol}>
                  <Text style={styles.detailVideoTitle} numberOfLines={2}>
                    {selectedTopicDetail.video.title}
                  </Text>
                  <View style={styles.detailVideoMetaRow}>
                    <Ionicons name="stats-chart" size={11} color="#64748B" style={{ marginRight: 4 }} />
                    <Text style={styles.detailVideoMetaText}>{selectedTopicDetail.video.level}</Text>
                    <Text style={styles.detailVideoMetaDot}>•</Text>
                    <Ionicons name="eye-outline" size={12} color="#64748B" style={{ marginRight: 4 }} />
                    <Text style={styles.detailVideoMetaText}>{selectedTopicDetail.video.views}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* DEDICATED RICH VIDEO DARS TAB VIEW */}
          {detailFilterTab === 'video' && (
            <View style={styles.videoTabRootContainer}>
              {/* 1. CINEMA VIDEO PLAYER CARD */}
              <View style={styles.videoCinemaPlayerCard}>
                <Image
                  source={videoLessonInstructorImage}
                  style={styles.videoCinemaThumbImg}
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={['rgba(15, 23, 42, 0.25)', 'rgba(10, 25, 47, 0.75)']}
                  style={styles.videoCinemaGradient}
                >
                  {/* Top Bar on Player */}
                  <View style={styles.videoPlayerTopBar}>
                    <View style={styles.videoLiveBadge}>
                      <View style={styles.videoLiveDot} />
                      <Text style={styles.videoLiveText}>HD 1080p • Ekspert darsi</Text>
                    </View>
                    <View style={styles.videoLangBadge}>
                      <Ionicons name="volume-high-outline" size={13} color="#FFFFFF" style={{ marginRight: 4 }} />
                      <Text style={styles.videoLangText}>Özbek tilida</Text>
                    </View>
                  </View>

                  {/* Center Play/Pause Button */}
                  <TouchableOpacity
                    style={styles.videoBigPlayBtn}
                    activeOpacity={0.85}
                    onPress={handleTogglePlayVideo}
                  >
                    <Ionicons
                      name={videoIsPlaying ? 'pause' : 'play'}
                      size={28}
                      color="#0F2644"
                      style={videoIsPlaying ? {} : { marginLeft: 3 }}
                    />
                  </TouchableOpacity>

                  {/* Bottom Timeline Controls */}
                  <View style={styles.videoPlayerBottomControls}>
                    <View style={styles.videoTimelineTrack}>
                      <View style={styles.videoTimelineElapsed} />
                      <View style={styles.videoTimelineScrubber} />
                    </View>
                    <View style={styles.videoTimeRow}>
                      <Text style={styles.videoTimeText}>
                        {videoIsPlaying ? '03:42' : '00:00'} / {selectedTopicDetail.video.duration}
                      </Text>
                      <View style={styles.videoPlayerMiniIconsRow}>
                        <TouchableOpacity onPress={handleCycleVideoSpeed} style={styles.videoSpeedPill}>
                          <Text style={styles.videoSpeedPillText}>{videoSpeed}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => Alert.alert('Töliq ekran', 'Töliq ekran rejimiga ötilmoqda.')}>
                          <Ionicons name="expand-outline" size={17} color="#FFFFFF" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </LinearGradient>
              </View>

              {/* 2. VIDEO TITLE */}
              <Text style={styles.videoPageTitle}>{selectedTopicDetail.video.title}</Text>

              {/* 3. INSTRUCTOR CARD */}
              <View style={styles.videoInstructorCard}>
                <View style={styles.videoInstructorAvatarBox}>
                  <Ionicons name="person-circle" size={42} color="#0F2644" />
                </View>
                <View style={styles.videoInstructorInfoCol}>
                  <View style={styles.videoInstructorNameRow}>
                    <Text style={styles.videoInstructorName}>Farrux Tojiyev</Text>
                    <Ionicons name="checkmark-circle" size={14} color="#0284C7" style={{ marginLeft: 4 }} />
                  </View>
                  <Text style={styles.videoInstructorBio}>
                    Mehnat huquqi eksperti • Adliya maslahatçisi
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.videoInstructorAskBtn}
                  activeOpacity={0.8}
                  onPress={() => setActiveTab('ai')}
                >
                  <Text style={styles.videoInstructorAskBtnText}>Savol beriş</Text>
                </TouchableOpacity>
              </View>

              {/* 4. CHAPTERS / PLAYLIST TIMESTAMPS */}
              <View style={styles.videoSectionBlock}>
                <View style={styles.videoSectionTitleRow}>
                  <Ionicons name="list" size={18} color="#D97706" style={{ marginRight: 6 }} />
                  <Text style={styles.videoSectionTitle}>Dars mundarijasi (Taym-kodlar)</Text>
                </View>

                <View style={styles.videoChaptersList}>
                  {[
                    { time: '00:00 - 01:45', title: '1. Kirish: Mehnat şartnomasining mohiyati va ahamiyati' },
                    { time: '01:46 - 03:30', title: '2. Şartnomada bölişi şart bölgan majburiy bandlar' },
                    { time: '03:31 - 05:40', title: '3. Sinov muddati, lavozim va maohni rasmiylaştiriş' },
                    { time: '05:41 - 07:15', title: '4. Iş beruvçilar eng köp yöll qöyadigan 5 ta xato' },
                    { time: '07:16 - 08:24', title: '5. Xodim huquqlarini amaliy himoya qiliş va xulosa' },
                  ].map((ch, chIdx) => {
                    const isActive = activeChapterIdx === chIdx;
                    return (
                      <TouchableOpacity
                        key={chIdx}
                        style={[
                          styles.videoChapterItem,
                          isActive && styles.videoChapterItemActive,
                        ]}
                        activeOpacity={0.75}
                        onPress={() => handleSelectChapter(chIdx, ch.title, ch.time)}
                      >
                        <View
                          style={[
                            styles.videoChapterNumBox,
                            isActive && styles.videoChapterNumBoxActive,
                          ]}
                        >
                          <Ionicons
                            name={isActive && videoIsPlaying ? 'volume-high' : 'play'}
                            size={14}
                            color={isActive ? '#FFFFFF' : '#475569'}
                          />
                        </View>
                        <View style={styles.videoChapterTextCol}>
                          <Text
                            style={[
                              styles.videoChapterTitle,
                              isActive && styles.videoChapterTitleActive,
                            ]}
                            numberOfLines={1}
                          >
                            {ch.title}
                          </Text>
                          <Text style={styles.videoChapterTime}>{ch.time}</Text>
                        </View>
                        {isActive && (
                          <View style={styles.videoChapterActivePill}>
                            <Text style={styles.videoChapterActivePillText}>Ijroda</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* 5. MINI-QUIZ TEST CARD */}
              <View style={styles.videoQuizCard}>
                <View style={styles.videoQuizHeaderRow}>
                  <Ionicons name="school" size={18} color="#D97706" style={{ marginRight: 6 }} />
                  <Text style={styles.videoQuizHeaderTitle}>Bilimingizni sinab köring (Mini-test)</Text>
                </View>
                <Text style={styles.videoQuizQuestion}>
                  Yangi Mehnat kodeksiga köra, xodim uçun umumiy sinov muddati köpi bilan neça oy bölişi mumkin?
                </Text>

                <View style={styles.videoQuizOptionsList}>
                  {[
                    { id: 0, text: 'A) 1 oy', correct: false },
                    { id: 1, text: 'B) 3 oy', correct: true },
                    { id: 2, text: 'C) 6 oy (faqat rahbarlar uçun)', correct: false },
                  ].map((opt) => {
                    const isSelected = videoQuizAnswer === opt.id;
                    const isCorrect = opt.correct;
                    return (
                      <TouchableOpacity
                        key={opt.id}
                        style={[
                          styles.videoQuizOptionBtn,
                          isSelected && isCorrect && styles.videoQuizOptionCorrect,
                          isSelected && !isCorrect && styles.videoQuizOptionWrong,
                        ]}
                        activeOpacity={0.8}
                        onPress={() => {
                          setVideoQuizAnswer(opt.id);
                          if (opt.correct) {
                            Alert.alert('Töğri javob! 🎉', 'Baraka toping! Mehnat kodeksining 105-moddasiga köra umumiy xodimlar uçun sinov muddati 3 oydan oşişi mumkin emas.');
                          } else {
                            Alert.alert('Notöğri javob ❌', 'Mehnat kodeksining 105-moddasiga köra umumiy sinov muddati maksimum 3 oydan oşmasligi lozim.');
                          }
                        }}
                      >
                        <Text
                          style={[
                            styles.videoQuizOptionText,
                            isSelected && isCorrect && styles.videoQuizOptionTextCorrect,
                            isSelected && !isCorrect && styles.videoQuizOptionTextWrong,
                          ]}
                        >
                          {opt.text}
                        </Text>
                        {isSelected && (
                          <Ionicons
                            name={isCorrect ? 'checkmark-circle' : 'close-circle'}
                            size={16}
                            color={isCorrect ? '#16A34A' : '#DC2626'}
                          />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>
          )}

          {/* SECTION 2: QISQACHA MA'LUMOT */}
          {detailFilterTab === 'general' && (
            <View style={styles.detailSectionContainer}>
              <View style={styles.detailSectionHeaderRow}>
                <View style={styles.detailSectionTitleGroup}>
                  <Ionicons name="book-outline" size={20} color="#D97706" style={{ marginRight: 6 }} />
                  <Text style={styles.detailSectionTitle}>Qisqaça ma’lumot</Text>
                </View>
              </View>
              <Text style={styles.detailSummaryText}>{selectedTopicDetail.summary}</Text>
            </View>
          )}

          {/* SECTION 3: ASOSIY BO'LIMLAR (ACCORDIONS) */}
          {detailFilterTab === 'general' && (
            <View style={styles.detailSectionContainer}>
              <Text style={styles.detailSectionsHeading}>Asosiy bölimlar</Text>
              <View style={styles.detailAccordionsContainer}>
                {selectedTopicDetail.sections.map((sec: any, idx: number) => {
                  const isExpanded = expandedAccordionIdx === idx;
                  return (
                    <View key={idx} style={styles.accordionCard}>
                      <TouchableOpacity
                        style={styles.accordionHeaderRow}
                        activeOpacity={0.75}
                        onPress={() => setExpandedAccordionIdx(isExpanded ? null : idx)}
                      >
                        <View style={[styles.accordionIconBox, { backgroundColor: sec.iconBg }]}>
                          <Ionicons name={sec.icon as any} size={18} color={sec.iconColor} />
                        </View>
                        <Text style={styles.accordionTitleText} numberOfLines={2}>
                          {sec.title}
                        </Text>
                        <Ionicons
                          name={isExpanded ? 'chevron-up' : 'chevron-down'}
                          size={18}
                          color="#94A3B8"
                        />
                      </TouchableOpacity>

                      {isExpanded && (
                        <View style={styles.accordionBody}>
                          {sec.points.map((pt: string, ptIdx: number) => (
                            <View key={ptIdx} style={styles.accordionPointRow}>
                              <Ionicons
                                name="checkmark-circle"
                                size={14}
                                color={sec.iconColor}
                                style={styles.accordionPointIcon}
                              />
                              <Text style={styles.accordionPointText}>{pt}</Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* SECTION 4: HUJJATLAR VA ANDOZALAR (General Tab Preview) */}
          {detailFilterTab === 'general' && (
            <View style={styles.detailSectionContainer}>
              <View style={styles.detailSectionHeaderRow}>
                <View style={styles.detailSectionTitleGroup}>
                  <Ionicons name="document-text-outline" size={20} color="#D97706" style={{ marginRight: 6 }} />
                  <Text style={styles.detailSectionTitle}>Hujjatlar va andozalar</Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setDetailFilterTab('docs')}
                >
                  <Text style={styles.detailSeeAllText}>Barçasini köriş →</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.detailDocsRow}>
                {selectedTopicDetail.docs.map((doc: any, docIdx: number) => (
                  <TouchableOpacity
                    key={docIdx}
                    style={styles.detailDocCard}
                    activeOpacity={0.8}
                    onPress={() => handleDownloadDoc(doc)}
                  >
                    <View style={[styles.detailDocBadge, { backgroundColor: doc.badgeColor }]}>
                      <Text style={styles.detailDocBadgeText}>{doc.type}</Text>
                    </View>
                    <View style={styles.detailDocTextCol}>
                      <Text style={styles.detailDocTitle} numberOfLines={2}>
                        {doc.title}
                      </Text>
                      <Text style={styles.detailDocMeta}>
                        {doc.type} • {doc.size}
                      </Text>
                    </View>
                    <View style={styles.detailDocDownloadBtn}>
                      <Ionicons name="arrow-down" size={14} color="#0F172A" />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* DEDICATED HUJJATLAR TAB VIEW INSIDE TOPIC */}
          {detailFilterTab === 'docs' && (
            <View style={styles.detailSectionContainer}>
              <View style={styles.docSectionTitleWithBadge}>
                <Text style={styles.detailSectionsHeading}>Mavzuga oid rasmiy andozalar</Text>
                <View style={styles.docCountBadgeSmall}>
                  <Text style={styles.docCountBadgeSmallText}>{selectedTopicDetail.docs?.length || 0}</Text>
                </View>
              </View>

              <View style={styles.docCatalogList}>
                {selectedTopicDetail.docs.map((doc: any, docIdx: number) => (
                  <View key={docIdx} style={styles.docCatalogModernCard}>
                    <View style={styles.docCardTopRow}>
                      <View style={[styles.docCatalogBadgeBox, { backgroundColor: doc.badgeColor }]}>
                        <Text style={styles.docCatalogBadgeText}>{doc.type}</Text>
                      </View>
                      <View style={styles.docCardHeaderMetaCol}>
                        <View style={styles.docCardCategoryRow}>
                          <Text style={styles.docCardCategoryBadge}>Rasmiy andoza</Text>
                          <View style={styles.docCardLegalBadge}>
                            <Ionicons name="shield-checkmark" size={10} color="#16A34A" style={{ marginRight: 3 }} />
                            <Text style={styles.docCardLegalBadgeText}>2025 Yangi tahrir</Text>
                          </View>
                        </View>
                        <Text style={styles.docCatalogItemTitle} numberOfLines={2}>
                          {doc.title}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.docCatalogItemDesc}>
                      2025-yilgi yangi tahrirdagi Mehnat Kodeksi talablariga mos rasmiy andoza.
                    </Text>

                    <View style={styles.docCardStatsRow}>
                      <Text style={styles.docCardStatText}>{doc.size}</Text>
                      <Text style={styles.docCatalogMetaDot}>•</Text>
                      <Text style={[styles.docCardStatText, { color: '#16A34A', fontWeight: '700' }]}>Yuridik kafolatlangan</Text>
                    </View>

                    {/* Actions */}
                    <View style={styles.docCardActionsGrid}>
                      <TouchableOpacity
                        style={styles.docActionBtnView}
                        activeOpacity={0.7}
                        onPress={() => setPreviewDoc(doc)}
                      >
                        <Ionicons name="eye-outline" size={14} color="#0F2644" style={{ marginRight: 5 }} />
                        <Text style={styles.docActionBtnViewText}>Köriş</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.docActionBtnDownload}
                        activeOpacity={0.7}
                        onPress={() => handleDownloadDoc(doc)}
                      >
                        <Ionicons name="download-outline" size={14} color="#FFFFFF" style={{ marginRight: 5 }} />
                        <Text style={styles.docActionBtnDownloadText}>Yuklab oliş</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.docActionBtnShare}
                        activeOpacity={0.7}
                        onPress={() => handleShareDoc(doc)}
                      >
                        <Ionicons name="share-social-outline" size={14} color="#64748B" />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.docActionBtnFill}
                        activeOpacity={0.7}
                        onPress={() => handleOpenConstructorForDoc(doc)}
                      >
                        <Ionicons name="flash" size={13} color="#D97706" style={{ marginRight: 4 }} />
                        <Text style={styles.docActionBtnFillText}>Töldiriş</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>

              {/* Online Generator Card */}
              <TouchableOpacity
                style={styles.docConstructorCard}
                activeOpacity={0.9}
                onPress={() => handleOpenConstructorForDoc()}
              >
                <LinearGradient
                  colors={['#0F2644', '#1E3A8A', '#2563EB']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.docConstructorGradient}
                >
                  <View style={styles.docConstructorTagPill}>
                    <Ionicons name="sparkles" size={11} color="#FBBF24" style={{ marginRight: 4 }} />
                    <Text style={styles.docConstructorTagText}>ONLINE KONSTRUKTOR</Text>
                  </View>
                  <Text style={styles.docConstructorTitle}>Arizani tizimda avtomatik töldiring</Text>
                  <Text style={styles.docConstructorSubtitle}>
                    Qölda yozib ötirmasdan, kerakli rekvizitlarni kiritib tayyor rasmiy andozani oling.
                  </Text>
                  <View style={styles.docConstructorCtaBtn}>
                    <Ionicons name="flash" size={13} color="#0F172A" style={{ marginRight: 5 }} />
                    <Text style={styles.docConstructorCtaBtnText}>Şakllantiriş</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              {/* Legal instructions */}
              <View style={styles.docRuleCalloutBox}>
                <View style={styles.docRuleHeaderRow}>
                  <Ionicons name="shield-checkmark" size={18} color="#16A34A" style={{ marginRight: 6 }} />
                  <Text style={styles.docRuleTitle}>Qonuniy kuçga ega böliş şartlari</Text>
                </View>
                <Text style={styles.docRuleDesc}>
                  Uşbu hujjat qonuniy kuçga ega bölişi uçun xodim tomonidan şaxsan imzolanişi va iş beruvçi tomonidan tegişli buyruq çiqarilişi şart.
                </Text>
              </View>
            </View>
          )}

          {/* SECTION 5: ESLATMA CALLOUT BOX */}
          {detailFilterTab === 'general' && (
            <View style={styles.detailNoteCard}>
              <View style={styles.detailNoteHeaderRow}>
                <Ionicons name="bulb-outline" size={20} color="#16A34A" style={{ marginRight: 6 }} />
                <Text style={styles.detailNoteTitle}>Eslatma</Text>
              </View>
              <Text style={styles.detailNoteText}>{selectedTopicDetail.note}</Text>
            </View>
          )}

          {/* DEDICATED RICH SAVOL-JAVOB TAB VIEW */}
          {detailFilterTab === 'faq' && (() => {
            const topicFaqs = selectedTopicDetail.faqs || [];
            const displayedFaqs = topicFaqs.filter((f: any) => {
              if (!faqSearchQuery.trim()) return true;
              const qLower = faqSearchQuery.toLowerCase();
              return (
                f.q.toLowerCase().includes(qLower) ||
                f.a.toLowerCase().includes(qLower) ||
                (f.badge && f.badge.toLowerCase().includes(qLower)) ||
                (f.article && f.article.toLowerCase().includes(qLower))
              );
            });

            return (
              <View style={styles.faqTabRootContainer}>
                {/* 1. Live Search Input */}
                <View style={styles.faqSearchBox}>
                  <Ionicons name="search-outline" size={18} color="#94A3B8" style={{ marginRight: 8 }} />
                  <TextInput
                    style={styles.faqSearchInput}
                    placeholder="Mavzuga oid savollardan qidiring..."
                    placeholderTextColor="#94A3B8"
                    value={faqSearchQuery}
                    onChangeText={setFaqSearchQuery}
                  />
                  {faqSearchQuery.length > 0 && (
                    <TouchableOpacity
                      onPress={() => setFaqSearchQuery('')}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Ionicons name="close-circle" size={17} color="#94A3B8" />
                    </TouchableOpacity>
                  )}
                </View>

                {/* 2. Topic Heading */}
                <View style={styles.faqHeaderRow}>
                  <View style={styles.faqHeaderTitleWrap}>
                    <Text style={styles.faqHeadingMain}>Köp beriladigan savollar</Text>
                    <Text style={styles.faqHeadingSub}>
                      {displayedFaqs.length} ta rasmiy huquqiy tuşuntiriş
                    </Text>
                  </View>
                </View>

                {/* 3. Interactive Accordion FAQ List */}
                <View style={styles.faqAccordionContainer}>
                  {displayedFaqs.length === 0 ? (
                    <View style={styles.faqEmptyBox}>
                      <Ionicons name="search-outline" size={36} color="#94A3B8" style={{ marginBottom: 8 }} />
                      <Text style={styles.faqEmptyTitle}>Savol topilmadi</Text>
                      <Text style={styles.faqEmptyDesc}>
                        Qidiruv sözini özgartirib köring yoki yuristga bevosita savol yöllang.
                      </Text>
                      <TouchableOpacity
                        style={styles.faqEmptyBtn}
                        onPress={() => setFaqSearchQuery('')}
                      >
                        <Text style={styles.faqEmptyBtnText}>Qidiruvni tozalash</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    displayedFaqs.map((faq: any, fIdx: number) => {
                      const isExpanded = expandedFaqIndices.includes(fIdx);
                      const userVote = faqVotes[fIdx];
                      return (
                        <View
                          key={fIdx}
                          style={[
                            styles.faqAccordionCard,
                            isExpanded && styles.faqAccordionCardActive,
                          ]}
                        >
                          {/* Header Button */}
                          <TouchableOpacity
                            style={styles.faqAccordionHeader}
                            activeOpacity={0.8}
                            onPress={() => toggleFaqAccordion(fIdx)}
                          >
                            <View style={styles.faqNumBadge}>
                              <Text style={styles.faqNumBadgeText}>
                                {(fIdx + 1).toString().padStart(2, '0')}
                              </Text>
                            </View>
                            <View style={styles.faqQuestionTextCol}>
                              {faq.badge && (
                                <View style={styles.faqCategoryMiniPill}>
                                  <Text style={styles.faqCategoryMiniText}>{faq.badge}</Text>
                                </View>
                              )}
                              <Text style={styles.faqQuestionTitleText}>{faq.q}</Text>
                            </View>
                            <View
                              style={[
                                styles.faqChevronWrap,
                                isExpanded && styles.faqChevronWrapActive,
                              ]}
                            >
                              <Ionicons
                                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                                size={17}
                                color={isExpanded ? '#FFFFFF' : '#64748B'}
                              />
                            </View>
                          </TouchableOpacity>

                          {/* Expandable Body */}
                          {isExpanded && (
                            <View style={styles.faqAccordionBody}>
                              <View style={styles.faqBodyDivider} />
                              <Text style={styles.faqAnswerBodyText}>{faq.a}</Text>

                              {/* Legal Citation Pill */}
                              {faq.article && (
                                <View style={styles.faqLegalArticleBox}>
                                  <Ionicons name="book-outline" size={13} color="#0284C7" style={{ marginRight: 6 }} />
                                  <Text style={styles.faqLegalArticleText}>
                                    Huquqiy asos: {faq.article}
                                  </Text>
                                </View>
                              )}

                              {/* Helpful Voting & Actions */}
                              <View style={styles.faqActionBar}>
                                <View style={styles.faqVoteGroup}>
                                  <Text style={styles.faqVoteLabel}>Foydali böldimi?</Text>
                                  <TouchableOpacity
                                    style={[
                                      styles.faqVoteBtn,
                                      userVote === 'yes' && styles.faqVoteBtnActiveYes,
                                    ]}
                                    activeOpacity={0.7}
                                    onPress={() => handleVoteFaq(fIdx, 'yes')}
                                  >
                                    <Ionicons
                                      name="thumbs-up-outline"
                                      size={13}
                                      color={userVote === 'yes' ? '#16A34A' : '#64748B'}
                                      style={{ marginRight: 4 }}
                                    />
                                    <Text
                                      style={[
                                        styles.faqVoteBtnText,
                                        userVote === 'yes' && styles.faqVoteBtnTextActiveYes,
                                      ]}
                                    >
                                      Ha
                                    </Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    style={[
                                      styles.faqVoteBtn,
                                      userVote === 'no' && styles.faqVoteBtnActiveNo,
                                    ]}
                                    activeOpacity={0.7}
                                    onPress={() => handleVoteFaq(fIdx, 'no')}
                                  >
                                    <Ionicons
                                      name="thumbs-down-outline"
                                      size={13}
                                      color={userVote === 'no' ? '#DC2626' : '#64748B'}
                                      style={{ marginRight: 4 }}
                                    />
                                    <Text
                                      style={[
                                        styles.faqVoteBtnText,
                                        userVote === 'no' && styles.faqVoteBtnTextActiveNo,
                                      ]}
                                    >
                                      Yöq
                                    </Text>
                                  </TouchableOpacity>
                                </View>

                                {/* Share Action */}
                                <TouchableOpacity
                                  style={styles.faqShareBtn}
                                  activeOpacity={0.7}
                                  onPress={() => handleShareFaq(faq)}
                                >
                                  <Ionicons name="share-social-outline" size={15} color="#475569" />
                                </TouchableOpacity>
                              </View>
                            </View>
                          )}
                        </View>
                      );
                    })
                  )}
                </View>

                {/* 5. "Savolingizga javob topmadingizmi?" - Legal Ask CTA Box */}
                <TouchableOpacity
                  style={styles.faqAskCtaCard}
                  activeOpacity={0.9}
                  onPress={handleOpenAskQuestionModal}
                >
                  <LinearGradient
                    colors={['#0F2644', '#1E3A8A']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.faqAskCtaGradient}
                  >
                    <View style={styles.faqAskCtaBadge}>
                      <Ionicons name="chatbubbles" size={11} color="#FBBF24" style={{ marginRight: 5 }} />
                      <Text style={styles.faqAskCtaBadgeText}>24/7 HUQUQIY YÖRDAM</Text>
                    </View>
                    <Text style={styles.faqAskCtaTitle}>Savolingizga javob topmadingizmi?</Text>
                    <Text style={styles.faqAskCtaSubtitle}>
                      Mehnat munosabatlari böyiça aniq vaziyatingizni yozing — AI Yordamçi yoki professional yurist tezkor huquqiy xulosa beradi.
                    </Text>
                    <View style={styles.faqAskCtaActionBtn}>
                      <Ionicons name="send" size={12} color="#0F172A" style={{ marginRight: 6 }} />
                      <Text style={styles.faqAskCtaActionBtnText}>Savol beriş</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            );
          })()}
        </ScrollView>
        {renderPreviewModal()}
        {renderConstructorModal()}
      </View>
    );
  }

  return (
    <View style={[styles.rootContainer, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      {/* ===================== TOP HEADER (MINIMALIST) ===================== */}
      <View style={styles.header}>
        <View style={styles.headerLeftCol}>
          <TouchableOpacity
            style={styles.headerBackBtn}
            activeOpacity={0.7}
            onPress={onBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={20} color="#0F172A" />
          </TouchableOpacity>
          <View style={styles.headerBriefcaseBadge}>
            <Ionicons name="briefcase" size={18} color="#F59E0B" />
          </View>
          <View style={styles.headerTitlesBox}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              Iş va mehnat huquqi
            </Text>
            <Text style={styles.headerSubtitle} numberOfLines={1}>
              Xodimlar uçun huquqiy yordam
            </Text>
          </View>
        </View>
      </View>

      {/* ===================== MAIN CONTENT: TAB SWITCHING ===================== */}
      {activeTab === 'home' ? (
        /* ===================== 1. BOSH SAHIFA ===================== */
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, 16) + 75 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* 1. AUTO-ROTATING HERO SWIPER */}
          <TouchableOpacity
            style={styles.heroCard}
            activeOpacity={0.9}
            onPress={activeSlide.onPress}
          >
            <LinearGradient
              colors={activeSlide.colors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroGradient}
            >
              <View style={styles.heroLeftCol}>
                <View style={styles.heroTagPill}>
                  <Text style={styles.heroTagText}>{activeSlide.tag}</Text>
                </View>

                <Text style={styles.heroTitle}>
                  {activeSlide.titlePrefix}
                  <Text style={styles.heroTitleGold}>{activeSlide.titleHighlight}</Text>
                </Text>
                <Text style={styles.heroDesc} numberOfLines={2}>
                  {activeSlide.desc}
                </Text>
                <TouchableOpacity
                  style={[styles.heroCtaBtn, { backgroundColor: activeSlide.ctaColor }]}
                  activeOpacity={0.85}
                  onPress={activeSlide.onPress}
                >
                  <Text style={styles.heroCtaBtnText}>{activeSlide.ctaText}</Text>
                  <Ionicons name="arrow-forward" size={13} color="#1E293B" style={{ marginLeft: 4 }} />
                </TouchableOpacity>
              </View>

              <View style={styles.heroRightGraphicWrap}>
                {activeSlide.hasIllustration ? (
                  <Image
                    source={mehnatHeroGraphic}
                    style={styles.heroRightGraphicImg}
                    resizeMode="contain"
                  />
                ) : (
                  <View style={styles.heroIconEmblemWrap}>
                    <View style={[styles.heroIconEmblemCircle, { backgroundColor: `${activeSlide.iconColor}25` }]}>
                      <Ionicons name={activeSlide.iconName as any} size={42} color={activeSlide.iconColor} />
                    </View>
                  </View>
                )}
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Carousel Pagination Dots */}
          <View style={styles.carouselPaginationRow}>
            {heroSlides.map((_, dotIdx) => (
              <TouchableOpacity
                key={dotIdx}
                hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
                onPress={() => setCurrentSlideIndex(dotIdx)}
                style={
                  dotIdx === currentSlideIndex
                    ? styles.carouselDotActive
                    : styles.carouselDotInactive
                }
              />
            ))}
          </View>

          {/* 2. AI YORDAMCHI PROMO CARD */}
          <TouchableOpacity
            style={styles.aiCardContainer}
            activeOpacity={0.85}
            onPress={() => setActiveTab('ai')}
          >
            <View style={styles.aiRobotImgBox}>
              <Image
                source={mehnatAiRobot}
                style={styles.aiRobotImg}
                resizeMode="contain"
              />
            </View>

            <View style={styles.aiTextCol}>
              <View style={styles.aiTitleRow}>
                <Text style={styles.aiTitle}>AI Yordamçi</Text>
                <Ionicons name="sparkles" size={13} color="#6366F1" style={{ marginLeft: 5 }} />
              </View>
              <Text style={styles.aiSubtitle} numberOfLines={2}>
                Mehnat huquqi böyiça savolingizga tez va aniq javob oling.
              </Text>
            </View>

            <View style={styles.aiArrowBtn}>
              <Ionicons name="arrow-forward" size={17} color="#4338CA" />
            </View>
          </TouchableOpacity>

          {/* 3. TEZKOR YO'NALISHLAR (2x3 GRID) */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Tezkor yönalişlar</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setActiveTab('rights')}
            >
              <Text style={styles.sectionSeeAllLink}>Barçasini köriş →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.quickGrid}>
            {quickCategories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.quickCard, { backgroundColor: cat.bg, borderColor: cat.borderColor }]}
                activeOpacity={0.8}
                onPress={() => {
                  const matchingTopic = huquqlarList.find((item) => item.id === cat.id);
                  if (matchingTopic) {
                    handleTopicPress(matchingTopic);
                  } else {
                    setActiveTab('rights');
                    setRightsCategoryFilter('all');
                  }
                }}
              >
                <View style={styles.quickCardIconWrap}>
                  <Ionicons name={cat.icon as any} size={25} color={cat.iconColor} />
                </View>
                <Text style={styles.quickCardTitle} numberOfLines={2}>
                  {cat.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* 4. ASOSIY XIZMATLAR */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Asosiy xizmatlar</Text>
            <Text style={styles.sectionCountText}>3 ta yönaliş</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.mainServicesScroll}
          >
            {mainServices.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={styles.mainServiceMinimalCard}
                activeOpacity={0.75}
                onPress={service.action}
              >
                <View style={styles.mainServiceTopRow}>
                  <View style={[styles.mainServiceIconSquare, { backgroundColor: service.iconBg }]}>
                    <Ionicons name={service.icon as any} size={22} color={service.iconColor} />
                  </View>
                  <View style={styles.mainServiceBadgePill}>
                    <Text style={styles.mainServiceBadgeText}>{service.badge}</Text>
                  </View>
                </View>

                <View style={styles.mainServiceBody}>
                  <Text style={styles.mainServiceMinimalTitle} numberOfLines={1}>
                    {service.title}
                  </Text>
                  <Text style={styles.mainServiceMinimalSubtitle} numberOfLines={2}>
                    {service.subtitle}
                  </Text>
                </View>

                <View style={styles.mainServiceFooterRow}>
                  <Text style={styles.mainServiceFooterText}>Batafsil</Text>
                  <View style={styles.mainServiceMiniCircle}>
                    <Ionicons name="arrow-forward" size={11} color="#0F172A" />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* 5. SO'NGGI HUJJATLAR */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Sönggi hujjatlar</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setActiveTab('documents')}
            >
              <Text style={styles.sectionSeeAllLink}>Barçasini köriş →</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.docItemCard}
            activeOpacity={0.8}
            onPress={handleDocumentPress}
          >
            <View style={styles.docPdfBadge}>
              <Text style={styles.docPdfBadgeText}>PDF</Text>
            </View>

            <View style={styles.docInfoCol}>
              <Text style={styles.docItemTitle} numberOfLines={1}>
                Iş haqi böyiça talabnoma
              </Text>
              <Text style={styles.docItemMeta}>12 mar, 2025 • 421 KB</Text>
            </View>

            <View style={styles.docStatusRow}>
              <View style={styles.docStatusPill}>
                <Ionicons name="checkmark-circle" size={13} color="#16A34A" style={{ marginRight: 4 }} />
                <Text style={styles.docStatusText}>Tayyor</Text>
              </View>
              <TouchableOpacity
                style={styles.docMoreBtn}
                activeOpacity={0.7}
                onPress={handleDocumentPress}
              >
                <Ionicons name="ellipsis-vertical" size={16} color="#94A3B8" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </ScrollView>
      ) : activeTab === 'rights' ? (
        /* ===================== 2. HUQUQLAR SAHIFASI (MINIMALIST) ===================== */
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, 16) + 75 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* 1. Search Bar */}
          <View style={styles.rightsSearchBox}>
            <Ionicons name="search" size={18} color="#94A3B8" style={{ marginRight: 10 }} />
            <TextInput
              style={styles.rightsSearchInput}
              placeholder="Mavzu yoki savolni qidiring..."
              placeholderTextColor="#94A3B8"
              value={rightsSearchQuery}
              onChangeText={setRightsSearchQuery}
              returnKeyType="search"
            />
            {rightsSearchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setRightsSearchQuery('')}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close-circle" size={18} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>

          {/* 3. Category Filter Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.rightsFilterScroll}
          >
            {/* Pill 1: Barcha mavzular */}
            <TouchableOpacity
              style={[
                styles.rightsFilterPill,
                rightsCategoryFilter === 'all'
                  ? styles.rightsFilterPillActive
                  : styles.rightsFilterPillInactive,
              ]}
              activeOpacity={0.8}
              onPress={() => setRightsCategoryFilter('all')}
            >
              <Ionicons
                name="grid"
                size={15}
                color={rightsCategoryFilter === 'all' ? '#FFFFFF' : '#475569'}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  styles.rightsFilterText,
                  rightsCategoryFilter === 'all'
                    ? styles.rightsFilterTextActive
                    : styles.rightsFilterTextInactive,
                ]}
              >
                Barça mavzular
              </Text>
            </TouchableOpacity>

            {/* Pill 2: Asosiy huquqlar */}
            <TouchableOpacity
              style={[
                styles.rightsFilterPill,
                rightsCategoryFilter === 'basic'
                  ? styles.rightsFilterPillActive
                  : styles.rightsFilterPillInactive,
              ]}
              activeOpacity={0.8}
              onPress={() => setRightsCategoryFilter('basic')}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={16}
                color={rightsCategoryFilter === 'basic' ? '#FFFFFF' : '#475569'}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  styles.rightsFilterText,
                  rightsCategoryFilter === 'basic'
                    ? styles.rightsFilterTextActive
                    : styles.rightsFilterTextInactive,
                ]}
              >
                Asosiy huquqlar
              </Text>
            </TouchableOpacity>

            {/* Pill 3: Ko‘p so‘raladigan */}
            <TouchableOpacity
              style={[
                styles.rightsFilterPill,
                rightsCategoryFilter === 'popular'
                  ? styles.rightsFilterPillActive
                  : styles.rightsFilterPillInactive,
              ]}
              activeOpacity={0.8}
              onPress={() => setRightsCategoryFilter('popular')}
            >
              <Ionicons
                name="help-circle-outline"
                size={16}
                color={rightsCategoryFilter === 'popular' ? '#FFFFFF' : '#475569'}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  styles.rightsFilterText,
                  rightsCategoryFilter === 'popular'
                    ? styles.rightsFilterTextActive
                    : styles.rightsFilterTextInactive,
                ]}
              >
                Köp söraladigan
              </Text>
            </TouchableOpacity>
          </ScrollView>

          {/* 4. Rights Topic Cards List */}
          <View style={styles.rightsTopicsContainer}>
            {filteredHuquqlar.length === 0 ? (
              <View style={styles.rightsEmptyBox}>
                <Ionicons name="search-outline" size={32} color="#CBD5E1" style={{ marginBottom: 8 }} />
                <Text style={styles.rightsEmptyTitle}>Mavzu topilmadi</Text>
                <Text style={styles.rightsEmptySub}>
                  «{rightsSearchQuery}» böyiça heç qanday natija çiqmadi.
                </Text>
              </View>
            ) : (
              filteredHuquqlar.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.rightsCardItem}
                  activeOpacity={0.75}
                  onPress={() => handleTopicPress(item)}
                >
                  {/* Left: Clean Icon without background */}
                  <View style={styles.rightsCardIconWrap}>
                    {renderHuquqIcon(item)}
                  </View>

                  {/* Middle: Title & Description */}
                  <View style={styles.rightsCardTextCol}>
                    <Text style={styles.rightsCardTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.rightsCardDesc} numberOfLines={2}>
                      {item.desc}
                    </Text>
                  </View>

                  {/* Right: Circle Arrow Button */}
                  <View style={styles.rightsCardArrowCircle}>
                    <Ionicons name="arrow-forward" size={13} color="#0F172A" />
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>

          {/* 5. Featured Callout Banner: Mehnat Kodeksi */}
          <TouchableOpacity
            style={styles.mehnatKodeksiCalloutCard}
            activeOpacity={0.85}
            onPress={handleOpenMehnatKodeksi}
          >
            <LinearGradient
              colors={['#FFFDF2', '#FEF8DB', '#FEF3C7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.mehnatKodeksiGradient}
            >
              <View style={styles.mehnatKodeksiIconWrap}>
                <Ionicons name="book-outline" size={28} color="#D97706" />
              </View>

              <View style={styles.mehnatKodeksiInfoCol}>
                <Text style={styles.mehnatKodeksiTitle}>Mehnat kodeksi</Text>
                <Text style={styles.mehnatKodeksiSubtitle}>
                  Asosiy qonuniy hujjatlarni öqing
                </Text>
              </View>

              <View style={styles.mehnatKodeksiCtaBtn}>
                <Text style={styles.mehnatKodeksiCtaText}>Köriş →</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      ) : activeTab === 'ai' ? (
        /* ===================== 3. AI YORDAMCHI TAB ===================== */
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, 16) + 75 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.docHeaderBlock}>
            <Text style={styles.docMainTitle}>Mehnat AI Yordamçisi</Text>
            <Text style={styles.docMainSubtitle}>
              Mehnat munosabatlariga oid istalgan savolingizni bering — yangi Mehnat Kodeksi böyiça rasmiy huquqiy xulosa oling.
            </Text>
          </View>

          {/* AI Status Banner */}
          <View style={styles.aiStatusBanner}>
            <View style={styles.aiStatusAvatarBox}>
              <Ionicons name="shield-checkmark" size={18} color="#16A34A" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.aiStatusTitle}>Yangi Mehnat Kodeksi (2025)</Text>
              <Text style={styles.aiStatusSubtitle}>599 ta modda va rasmiy qonunlar bazasi ulangan</Text>
            </View>
            <View style={styles.aiOnlineDot} />
          </View>

          {/* Quick Prompts */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Tezkor savollar</Text>
          </View>
          <View style={styles.aiQuickPromptRow}>
            {[
              'Oylik maoh keçiktirilsa qayerga murojaat qiliş kerak?',
              'Öz xohişi bilan böşaş arizasini bekor qilsa böladimi?',
              'Ta’til puli qaçondan keçikmasdan tölanişi şart?',
              'Sinov muddati neça oydan oşmasligi kerak?',
            ].map((prompt, pIdx) => (
              <TouchableOpacity
                key={pIdx}
                style={styles.aiQuickPromptCard}
                activeOpacity={0.75}
                onPress={() => handleSendAiQuestion(prompt)}
              >
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={14}
                  color="#0284C7"
                  style={{ marginRight: 8, marginTop: 1 }}
                />
                <Text style={styles.aiQuickPromptText}>{prompt}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Chat Stream */}
          <View style={[styles.sectionHeaderRow, { marginTop: 16 }]}>
            <Text style={styles.sectionTitle}>Maslahat va javoblar</Text>
          </View>
          <View style={styles.aiChatContainer}>
            {aiChatHistory.map((msg, mIdx) => (
              <View
                key={mIdx}
                style={[
                  styles.aiChatBubble,
                  msg.sender === 'user' ? styles.aiChatBubbleUser : styles.aiChatBubbleBot,
                ]}
              >
                <View style={styles.aiChatSenderRow}>
                  <Ionicons
                    name={msg.sender === 'user' ? 'person-circle-outline' : 'sparkles'}
                    size={14}
                    color={msg.sender === 'user' ? '#FFFFFF' : '#D97706'}
                    style={{ marginRight: 5 }}
                  />
                  <Text
                    style={[
                      styles.aiChatSenderName,
                      msg.sender === 'user' && { color: '#FFFFFF' },
                    ]}
                  >
                    {msg.sender === 'user' ? 'Sizning savolingiz' : 'Mehnat AI Yordamçi'}
                  </Text>
                  <Text
                    style={[
                      styles.aiChatTime,
                      msg.sender === 'user' && { color: 'rgba(255,255,255,0.7)' },
                    ]}
                  >
                    {msg.time}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.aiChatText,
                    msg.sender === 'user' && styles.aiChatTextUser,
                  ]}
                >
                  {msg.text}
                </Text>
                {msg.article && (
                  <View style={styles.aiChatArticleBox}>
                    <Ionicons name="book" size={11} color="#0284C7" style={{ marginRight: 4 }} />
                    <Text style={styles.aiChatArticleText}>{msg.article}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* Chat Input Box */}
          <View style={styles.aiInputCard}>
            <TextInput
              style={styles.aiTextInput}
              placeholder="Savolingizni bu yerga yozing..."
              placeholderTextColor="#94A3B8"
              value={aiQuestionInput}
              onChangeText={setAiQuestionInput}
              multiline
            />
            <TouchableOpacity
              style={[
                styles.aiSendBtn,
                aiQuestionInput.trim().length > 0 && styles.aiSendBtnActive,
              ]}
              activeOpacity={0.8}
              onPress={() => handleSendAiQuestion()}
            >
              <Ionicons
                name="arrow-up"
                size={18}
                color={aiQuestionInput.trim().length > 0 ? '#FFFFFF' : '#94A3B8'}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        /* ===================== 4. HUJJATLAR TAB ===================== */
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, 16) + 75 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Top Title & Subtitle with Trust Badge */}
          <View style={styles.docHeaderBlock}>
            <View style={styles.docTrustBadgeRow}>
              <Ionicons name="shield-checkmark" size={13} color="#16A34A" style={{ marginRight: 5 }} />
              <Text style={styles.docTrustBadgeText}>2025 YANGI TAHRIR • YURIDIK BAZA</Text>
            </View>
            <Text style={styles.docMainTitle}>Hujjatlar markazi 📑</Text>
            <Text style={styles.docMainSubtitle}>
              Yangi Mehnat kodeksiga mos rasmiy arizalar, talabnomalar va mehnat şartnomalari andozalari.
            </Text>
          </View>

          {/* Quick Stats Strip */}
          <View style={styles.docStatsStrip}>
            <View style={styles.docStatCard}>
              <Text style={styles.docStatNumber}>24+</Text>
              <Text style={styles.docStatLabel}>Rasmiy andoza</Text>
            </View>
            <View style={styles.docStatDivider} />
            <View style={styles.docStatCard}>
              <Text style={[styles.docStatNumber, { color: '#16A34A' }]}>100%</Text>
              <Text style={styles.docStatLabel}>Qonuniy kafolat</Text>
            </View>
            <View style={styles.docStatDivider} />
            <View style={styles.docStatCard}>
              <Text style={[styles.docStatNumber, { color: '#0284C7' }]}>48 ming+</Text>
              <Text style={styles.docStatLabel}>Yuklab olingan</Text>
            </View>
          </View>

          {/* Search Box */}
          <View style={styles.docSearchBox}>
            <Ionicons name="search-outline" size={18} color="#94A3B8" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.docSearchInput}
              placeholder="Hujjat nomi yoki kalit sözni qidiring..."
              placeholderTextColor="#94A3B8"
              value={docSearchQuery}
              onChangeText={setDocSearchQuery}
            />
            {docSearchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setDocSearchQuery('')}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close-circle" size={17} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>

          {/* Category Filter Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.docFilterScroll}
          >
            {[
              { id: 'all', label: `Barçasi (${documentsCatalog.length})`, icon: 'grid-outline' },
              {
                id: 'applications',
                label: `Arizalar (${documentsCatalog.filter((d) => d.category === 'applications').length})`,
                icon: 'document-text-outline',
              },
              {
                id: 'contracts',
                label: `Şartnomalar (${documentsCatalog.filter((d) => d.category === 'contracts').length})`,
                icon: 'briefcase-outline',
              },
              {
                id: 'claims',
                label: `Talabnomalar (${documentsCatalog.filter((d) => d.category === 'claims').length})`,
                icon: 'alert-circle-outline',
              },
              {
                id: 'complaints',
                label: `Şikoyatlar (${documentsCatalog.filter((d) => d.category === 'complaints').length})`,
                icon: 'shield-outline',
              },
            ].map((cat) => {
              const isActive = docCategoryFilter === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.docFilterPill,
                    isActive ? styles.docFilterPillActive : styles.docFilterPillInactive,
                  ]}
                  activeOpacity={0.75}
                  onPress={() => setDocCategoryFilter(cat.id as any)}
                >
                  <Ionicons
                    name={cat.icon as any}
                    size={14}
                    color={isActive ? '#FFFFFF' : '#64748B'}
                    style={{ marginRight: 5 }}
                  />
                  <Text
                    style={[
                      styles.docFilterPillText,
                      isActive ? styles.docFilterPillTextActive : styles.docFilterPillTextInactive,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* AI Document Constructor Card */}
          <TouchableOpacity
            style={styles.docConstructorCard}
            activeOpacity={0.9}
            onPress={() => handleOpenConstructorForDoc()}
          >
            <LinearGradient
              colors={['#0F2644', '#1E3A8A', '#2563EB']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.docConstructorGradient}
            >
              <View style={styles.docConstructorTagPill}>
                <Ionicons name="sparkles" size={11} color="#FBBF24" style={{ marginRight: 4 }} />
                <Text style={styles.docConstructorTagText}>AQLLI GENERATOR • 2025</Text>
              </View>
              <Text style={styles.docConstructorTitle}>2 daqiqada tayyor rasmiy ariza yarating</Text>
              <Text style={styles.docConstructorSubtitle}>
                Ism-familiyangiz va korxona ma’lumotlarini kiriting — tizim 2025-yilgi Mehnat Kodeksiga mos tayyor rasmiy arizani avtomatik tayyorlab beradi.
              </Text>
              <View style={styles.docConstructorFeaturesRow}>
                <View style={styles.docConstructorFeatureItem}>
                  <Ionicons name="checkmark-circle" size={13} color="#4ADE80" style={{ marginRight: 4 }} />
                  <Text style={styles.docConstructorFeatureText}>MK 2025 moddalari</Text>
                </View>
                <View style={styles.docConstructorFeatureItem}>
                  <Ionicons name="checkmark-circle" size={13} color="#4ADE80" style={{ marginRight: 4 }} />
                  <Text style={styles.docConstructorFeatureText}>PDF va DOCX</Text>
                </View>
                <View style={styles.docConstructorFeatureItem}>
                  <Ionicons name="checkmark-circle" size={13} color="#4ADE80" style={{ marginRight: 4 }} />
                  <Text style={styles.docConstructorFeatureText}>100% Bepul</Text>
                </View>
              </View>
              <View style={styles.docConstructorCtaBtn}>
                <Ionicons name="flash" size={14} color="#0F172A" style={{ marginRight: 6 }} />
                <Text style={styles.docConstructorCtaBtnText}>Hujjat yaratiş ⚡</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Mening hujjatlarim Section */}
          <View style={styles.sectionHeaderRow}>
            <View style={styles.docSectionTitleWithBadge}>
              <Text style={styles.sectionTitle}>Mening hujjatlarim</Text>
              <View style={styles.docCountBadgeSmall}>
                <Text style={styles.docCountBadgeSmallText}>{myDocsList.length}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => handleOpenConstructorForDoc()}>
              <Text style={styles.sectionSeeAllLink}>+ Yangi ariza</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.docRecentContainer}>
            {myDocsList.map((myDoc) => (
              <TouchableOpacity
                key={myDoc.id}
                style={styles.docRecentCard}
                activeOpacity={0.8}
                onPress={() => setPreviewDoc(myDoc)}
              >
                <View
                  style={[
                    styles.docRecentBadge,
                    { backgroundColor: myDoc.badgeBg },
                  ]}
                >
                  <Text style={styles.docRecentBadgeText}>{myDoc.type}</Text>
                </View>
                <View style={styles.docRecentInfoCol}>
                  <Text style={styles.docRecentTitle} numberOfLines={1}>
                    {myDoc.title}
                  </Text>
                  <Text style={styles.docRecentMeta}>
                    {myDoc.date} • {myDoc.size}
                  </Text>
                </View>

                {/* Inline Quick Action Icons */}
                <View style={styles.docRecentActionsRow}>
                  <TouchableOpacity
                    style={styles.docRecentActionIconBtn}
                    onPress={() => setPreviewDoc(myDoc)}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    <Ionicons name="eye-outline" size={16} color="#0284C7" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.docRecentActionIconBtn}
                    onPress={() => handleShareDoc(myDoc)}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    <Ionicons name="share-social-outline" size={16} color="#64748B" />
                  </TouchableOpacity>

                  <View
                    style={[
                      styles.docRecentStatusPill,
                      { backgroundColor: myDoc.statusBg },
                    ]}
                  >
                    <Text
                      style={[
                        styles.docRecentStatusText,
                        { color: myDoc.statusColor },
                      ]}
                    >
                      {myDoc.status}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Rasmiy andozalar katalogi */}
          <View style={styles.sectionHeaderRow}>
            <View style={styles.docSectionTitleWithBadge}>
              <Text style={styles.sectionTitle}>Rasmiy andozalar katalogi</Text>
              <View style={styles.docCountBadgeSmall}>
                <Text style={styles.docCountBadgeSmallText}>{filteredDocuments.length}</Text>
              </View>
            </View>
            <Text style={styles.docCatalogFilterLabel}>2025 Yangi tahrir</Text>
          </View>

          <View style={styles.docCatalogList}>
            {filteredDocuments.length === 0 ? (
              <View style={styles.docEmptyStateCard}>
                <Ionicons
                  name="search-outline"
                  size={42}
                  color="#94A3B8"
                  style={{ marginBottom: 10 }}
                />
                <Text style={styles.docEmptyStateTitle}>Hujjat topilmadi</Text>
                <Text style={styles.docEmptyStateDesc}>
                  Qidiruv sözini yoki tanlangan kategoriyani özgartirib köring.
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setDocSearchQuery('');
                    setDocCategoryFilter('all');
                  }}
                  style={styles.docEmptyResetBtn}
                >
                  <Text style={styles.docEmptyResetBtnText}>Filtrni tozalaş</Text>
                </TouchableOpacity>
              </View>
            ) : (
              filteredDocuments.map((doc) => (
                <View key={doc.id} style={styles.docCatalogModernCard}>
                  {/* Card Header Row */}
                  <View style={styles.docCardTopRow}>
                    <View style={[styles.docCatalogBadgeBox, { backgroundColor: doc.badgeColor }]}>
                      <Text style={styles.docCatalogBadgeText}>{doc.type}</Text>
                    </View>
                    <View style={styles.docCardHeaderMetaCol}>
                      <View style={styles.docCardCategoryRow}>
                        <Text style={styles.docCardCategoryBadge}>{doc.categoryLabel}</Text>
                        <View style={styles.docCardLegalBadge}>
                          <Ionicons name="shield-checkmark" size={10} color="#16A34A" style={{ marginRight: 3 }} />
                          <Text style={styles.docCardLegalBadgeText}>{doc.legalRef || 'MK 2025'}</Text>
                        </View>
                      </View>
                      <Text style={styles.docCatalogItemTitle} numberOfLines={2}>
                        {doc.title}
                      </Text>
                    </View>
                  </View>

                  {/* Card Description */}
                  <Text style={styles.docCatalogItemDesc}>
                    {doc.desc}
                  </Text>

                  {/* Download stats strip */}
                  <View style={styles.docCardStatsRow}>
                    <View style={styles.docCardStatItem}>
                      <Ionicons name="download-outline" size={12} color="#64748B" style={{ marginRight: 4 }} />
                      <Text style={styles.docCardStatText}>{doc.downloads} marta yuklangan</Text>
                    </View>
                    <Text style={styles.docCatalogMetaDot}>•</Text>
                    <Text style={styles.docCardStatText}>{doc.size}</Text>
                    <Text style={styles.docCatalogMetaDot}>•</Text>
                    <Text style={[styles.docCardStatText, { color: '#16A34A', fontWeight: '700' }]}>Yuridik tasdiq</Text>
                  </View>

                  {/* 4 Interactive Action Buttons */}
                  <View style={styles.docCardActionsGrid}>
                    <TouchableOpacity
                      style={styles.docActionBtnView}
                      activeOpacity={0.7}
                      onPress={() => setPreviewDoc(doc)}
                    >
                      <Ionicons name="eye-outline" size={14} color="#0F2644" style={{ marginRight: 5 }} />
                      <Text style={styles.docActionBtnViewText}>Köriş</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.docActionBtnDownload}
                      activeOpacity={0.7}
                      onPress={() => handleDownloadDoc(doc)}
                    >
                      <Ionicons name="download-outline" size={14} color="#FFFFFF" style={{ marginRight: 5 }} />
                      <Text style={styles.docActionBtnDownloadText}>Yuklab oliş</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.docActionBtnShare}
                      activeOpacity={0.7}
                      onPress={() => handleShareDoc(doc)}
                    >
                      <Ionicons name="share-social-outline" size={14} color="#64748B" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.docActionBtnFill}
                      activeOpacity={0.7}
                      onPress={() => handleOpenConstructorForDoc(doc)}
                    >
                      <Ionicons name="flash" size={13} color="#D97706" style={{ marginRight: 4 }} />
                      <Text style={styles.docActionBtnFillText}>Töldiriş</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>

          {/* Legal Instruction Box & Hotline Callout */}
          <View style={styles.docRuleCalloutBox}>
            <View style={styles.docRuleHeaderRow}>
              <Ionicons
                name="shield-checkmark"
                size={20}
                color="#16A34A"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.docRuleTitle}>Qonuniy rasmiylaştiriş tartibi (4 qadam)</Text>
            </View>
            <View style={styles.docRuleStepsCol}>
              <View style={styles.docRuleStepRow}>
                <View style={styles.docRuleStepBadge}>
                  <Text style={styles.docRuleStepBadgeText}>1</Text>
                </View>
                <Text style={styles.docRuleStepText}>
                  Istalgan ariza yoki talabnomani kamida 2 nusxada chop eting.
                </Text>
              </View>
              <View style={styles.docRuleStepRow}>
                <View style={styles.docRuleStepBadge}>
                  <Text style={styles.docRuleStepBadgeText}>2</Text>
                </View>
                <Text style={styles.docRuleStepText}>
                  1-nusxani devonxonaga topshiring, 2-nusxaga sana va kiruvçi № qöydirib özizda saqlang.
                </Text>
              </View>
              <View style={styles.docRuleStepRow}>
                <View style={styles.docRuleStepBadge}>
                  <Text style={styles.docRuleStepBadgeText}>3</Text>
                </View>
                <Text style={styles.docRuleStepText}>
                  3 iş kuni içida rasmiy buyruq yoki qonuniy javob xatini kuting.
                </Text>
              </View>
              <View style={styles.docRuleStepRow}>
                <View style={styles.docRuleStepBadge}>
                  <Text style={styles.docRuleStepBadgeText}>4</Text>
                </View>
                <Text style={styles.docRuleStepText}>
                  Asossiz rad etilsa — Davlat mehnat inspeksiyasi (1176) ga murojaat qiling.
                </Text>
              </View>
            </View>

            {/* Direct Call 1176 Button */}
            <TouchableOpacity
              style={styles.docHotlineBtn}
              activeOpacity={0.8}
              onPress={() => {
                Linking.openURL('tel:1176').catch(() => {
                  Alert.alert('1176 Ishonç telefoni', 'Qöng‘iroq qiliş: 1176 (Davlat mehnat inspeksiyasi)');
                });
              }}
            >
              <Ionicons name="call" size={15} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.docHotlineBtnText}>1176 Ishonç telefoniga qöng‘iroq qiliş</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* ===================== BOTTOM NAVIGATION BAR ===================== */}
      <View style={[styles.bottomNavbar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
        {/* Tab 1: Bosh sahifa */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('home')}
          activeOpacity={0.7}
        >
          <Ionicons
            name={activeTab === 'home' ? 'home' : 'home-outline'}
            size={22}
            color={activeTab === 'home' ? '#D97706' : '#94A3B8'}
          />
          <Text
            style={[
              styles.navItemText,
              activeTab === 'home' && styles.navItemTextActive,
            ]}
          >
            Boş sahifa
          </Text>
        </TouchableOpacity>

        {/* Tab 2: Huquqlar */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('rights')}
          activeOpacity={0.7}
        >
          <Ionicons
            name={activeTab === 'rights' ? 'book' : 'book-outline'}
            size={22}
            color={activeTab === 'rights' ? '#D97706' : '#94A3B8'}
          />
          <Text
            style={[
              styles.navItemText,
              activeTab === 'rights' && styles.navItemTextActive,
            ]}
          >
            Huquqlar
          </Text>
        </TouchableOpacity>

        {/* Tab 3: AI Yordamchi */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('ai')}
          activeOpacity={0.7}
        >
          <Ionicons
            name={activeTab === 'ai' ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline'}
            size={22}
            color={activeTab === 'ai' ? '#D97706' : '#94A3B8'}
          />
          <Text
            style={[
              styles.navItemText,
              activeTab === 'ai' && styles.navItemTextActive,
            ]}
          >
            AI yordamçi
          </Text>
        </TouchableOpacity>

        {/* Tab 4: Hujjatlar */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('documents')}
          activeOpacity={0.7}
        >
          <Ionicons
            name={activeTab === 'documents' ? 'document-text' : 'document-text-outline'}
            size={22}
            color={activeTab === 'documents' ? '#D97706' : '#94A3B8'}
          />
          <Text
            style={[
              styles.navItemText,
              activeTab === 'documents' && styles.navItemTextActive,
            ]}
          >
            Hujjatlar
          </Text>
        </TouchableOpacity>
      </View>
      {renderPreviewModal()}
      {renderConstructorModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // 1. Header Styles (Minimalist)
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  headerLeftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerBackBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  headerBriefcaseBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#0A192F',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    shadowColor: '#0A192F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitlesBox: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '500',
  },

  // Scroll Area
  scrollArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },

  // ==================== HUQUQLAR SCREEN STYLES ====================
  // 1. Rights Hero Header Row
  rightsHeroHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    paddingTop: 4,
  },
  rightsHeroLeftCol: {
    flex: 1.25,
    paddingRight: 6,
  },
  rightsHeroBigTitle: {
    fontSize: 27,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  rightsHeroSubtitle: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  rightsHeroGraphicWrap: {
    width: 140,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightsHeroGraphicImg: {
    width: '100%',
    height: '100%',
  },

  // 2. Rights Search Input Box
  rightsSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 14,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 1,
  },
  rightsSearchInput: {
    flex: 1,
    fontSize: 13.5,
    color: '#0F172A',
    paddingVertical: 0,
  },

  // 3. Category Filter Tabs
  rightsFilterScroll: {
    gap: 8,
    marginBottom: 16,
    paddingRight: 16,
  },
  rightsFilterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8.5,
    borderRadius: 22,
    borderWidth: 1,
  },
  rightsFilterPillActive: {
    backgroundColor: '#0F2644',
    borderColor: '#0F2644',
  },
  rightsFilterPillInactive: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
  },
  rightsFilterText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  rightsFilterTextActive: {
    color: '#FFFFFF',
  },
  rightsFilterTextInactive: {
    color: '#475569',
  },

  // 4. Rights Topic Cards List
  rightsTopicsContainer: {
    gap: 10,
    marginBottom: 16,
  },
  rightsCardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    paddingVertical: 11,
    paddingHorizontal: 13,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  rightsCardIconWrap: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rightsCardTextCol: {
    flex: 1,
    paddingRight: 8,
  },
  rightsCardTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 3,
  },
  rightsCardDesc: {
    fontSize: 11.5,
    color: '#64748B',
    lineHeight: 15.5,
  },
  rightsCardArrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Rights Empty State
  rightsEmptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 36,
    paddingHorizontal: 20,
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  rightsEmptyTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#475569',
    marginBottom: 3,
  },
  rightsEmptySub: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
  },

  // 5. Featured Callout Banner: Mehnat Kodeksi
  mehnatKodeksiCalloutCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 10,
  },
  mehnatKodeksiGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  mehnatKodeksiIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  mehnatKodeksiInfoCol: {
    flex: 1,
    paddingRight: 8,
  },
  mehnatKodeksiTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  mehnatKodeksiSubtitle: {
    fontSize: 11,
    color: '#64748B',
  },
  mehnatKodeksiCtaBtn: {
    backgroundColor: '#0F2644',
    paddingHorizontal: 13,
    paddingVertical: 7.5,
    borderRadius: 16,
    shadowColor: '#0F2644',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  mehnatKodeksiCtaText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Placeholder Screens for other tabs
  tabPlaceholderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginTop: 10,
  },
  tabPlaceholderIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  tabPlaceholderTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  tabPlaceholderDesc: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  tabPlaceholderBtn: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
  },
  tabPlaceholderBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // ==================== BOSH SAHIFA HERO & SECTIONS ====================
  heroCard: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#0A192F',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 4,
  },
  heroGradient: {
    flexDirection: 'row',
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 16,
    minHeight: 185,
    overflow: 'hidden',
    position: 'relative',
  },
  heroLeftCol: {
    flex: 1.25,
    justifyContent: 'center',
    paddingRight: 6,
    zIndex: 2,
  },
  heroTagPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  heroTagText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.6,
  },
  heroTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 22.5,
    marginBottom: 7,
  },
  heroTitleGold: {
    color: '#FBBF24',
    fontWeight: '900',
  },
  heroDesc: {
    fontSize: 11.5,
    color: '#CBD5E1',
    lineHeight: 16,
    marginBottom: 13,
  },
  heroCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  heroCtaBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },
  heroRightGraphicWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  heroRightGraphicImg: {
    width: '100%',
    height: 160,
  },
  heroIconEmblemWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 150,
  },
  heroIconEmblemCircle: {
    width: 86,
    height: 86,
    borderRadius: 43,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },

  // Carousel Pagination Dots
  carouselPaginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 10,
    marginBottom: 14,
  },
  carouselDotActive: {
    width: 18,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#F59E0B',
  },
  carouselDotInactive: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#E2E8F0',
  },

  // 3. AI Yordamchi Card Styles
  aiCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F8FF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E7FF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 20,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  aiRobotImgBox: {
    width: 60,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  aiRobotImg: {
    width: '100%',
    height: '100%',
  },
  aiTextCol: {
    flex: 1,
    paddingRight: 8,
  },
  aiTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  aiTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  aiSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    lineHeight: 15,
  },
  aiArrowBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0E7FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Section Headers
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionSeeAllLink: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#334155',
  },
  sectionCountText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#94A3B8',
  },

  // 4. Quick Directions Grid (2x3)
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 20,
  },
  quickCard: {
    width: (width - 32 - 10) / 2,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    minHeight: 58,
  },
  quickCardIconWrap: {
    width: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  quickCardTitle: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 16,
  },

  // 5. Minimalist Main Services Carousel
  mainServicesScroll: {
    paddingRight: 16,
    gap: 12,
    marginBottom: 22,
  },
  mainServiceMinimalCard: {
    width: width * 0.64,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    padding: 14,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    justifyContent: 'space-between',
    minHeight: 142,
  },
  mainServiceTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  mainServiceIconSquare: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainServiceBadgePill: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  mainServiceBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  mainServiceBody: {
    flex: 1,
    marginBottom: 10,
  },
  mainServiceMinimalTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  mainServiceMinimalSubtitle: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
  },
  mainServiceFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  mainServiceFooterText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  mainServiceMiniCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 6. Recent Documents
  docItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    padding: 12,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    marginBottom: 10,
  },
  docPdfBadge: {
    width: 38,
    height: 38,
    borderRadius: 9,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  docPdfBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  docInfoCol: {
    flex: 1,
    paddingRight: 6,
  },
  docItemTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  docItemMeta: {
    fontSize: 11,
    color: '#94A3B8',
  },
  docStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  docStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 12,
    marginRight: 6,
  },
  docStatusText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#16A34A',
  },
  docMoreBtn: {
    padding: 4,
  },

  // 7. Bottom Navigation Bar Styles
  bottomNavbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 8,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    flex: 1,
  },
  navItemText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 3,
  },
  navItemTextActive: {
    color: '#D97706',
    fontWeight: '700',
  },
  // ==================== TOPIC DETAIL SCREEN STYLES ====================
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  detailHeaderLeftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  detailHeaderBackBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  detailHeaderTitlesBox: {
    flex: 1,
  },
  detailHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 1,
  },
  detailHeaderBreadcrumb: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  detailHeaderActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailHeaderActionBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailHeaderActionBtnActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
  },

  detailScrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  detailMainTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  detailMainSubtitle: {
    fontSize: 13.5,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 18,
  },

  detailFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  detailFilterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 22,
    borderWidth: 1,
  },
  detailFilterPillActive: {
    backgroundColor: '#0A192F',
    borderColor: '#0A192F',
  },
  detailFilterPillInactive: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  detailFilterText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  detailFilterTextActive: {
    color: '#FFFFFF',
  },
  detailFilterTextInactive: {
    color: '#475569',
  },

  detailSectionContainer: {
    marginBottom: 20,
  },
  detailSectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailSectionTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailSectionTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  detailSeeAllText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#0F172A',
  },

  detailVideoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  detailVideoThumbWrap: {
    width: 135,
    height: 86,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#0F172A',
  },
  detailVideoThumbImg: {
    width: '100%',
    height: '100%',
  },
  detailVideoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.35)',
  },
  detailVideoPlayBtn: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    transform: [{ translateX: -18 }, { translateY: -18 }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailVideoDurationBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  detailVideoDurationText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  detailVideoInfoCol: {
    flex: 1,
    paddingVertical: 2,
  },
  detailVideoTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 18,
    marginBottom: 8,
  },
  detailVideoMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailVideoMetaText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  detailVideoMetaDot: {
    fontSize: 11,
    color: '#94A3B8',
    marginHorizontal: 5,
  },

  detailSummaryText: {
    fontSize: 13.5,
    color: '#475569',
    lineHeight: 21,
    marginBottom: 8,
  },

  detailSectionsHeading: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  detailAccordionsContainer: {
    gap: 10,
  },
  accordionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  accordionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 13,
  },
  accordionIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  accordionTitleText: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
    marginRight: 8,
  },
  accordionBody: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  accordionPointRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
  },
  accordionPointIcon: {
    marginTop: 2,
    marginRight: 8,
  },
  accordionPointText: {
    flex: 1,
    fontSize: 12.5,
    color: '#475569',
    lineHeight: 18,
  },

  detailDocsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  detailDocCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  detailDocBadge: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  detailDocBadgeText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  detailDocTextCol: {
    flex: 1,
    paddingRight: 4,
  },
  detailDocTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 15,
    marginBottom: 2,
  },
  detailDocMeta: {
    fontSize: 10,
    color: '#64748B',
  },
  detailDocDownloadBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },

  detailNoteCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DCFCE7',
    padding: 14,
    marginBottom: 20,
  },
  detailNoteHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailNoteTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#16A34A',
  },
  detailNoteText: {
    fontSize: 12.5,
    color: '#374151',
    lineHeight: 19,
  },

  detailFaqContainer: {
    marginBottom: 20,
  },
  faqListContainer: {
    gap: 10,
  },
  faqCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  faqQuestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  faqQuestionText: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 18,
  },
  faqAnswerText: {
    fontSize: 12.5,
    color: '#475569',
    lineHeight: 18,
  },

  // ==================== DEDICATED SAVOL-JAVOB TAB STYLES ====================
  faqTabRootContainer: {
    marginBottom: 20,
  },
  faqSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 14,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 1,
  },
  faqSearchInput: {
    flex: 1,
    fontSize: 13.5,
    color: '#0F172A',
    paddingVertical: 0,
  },
  faqHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  faqHeaderTitleWrap: {
    flex: 1,
  },
  faqHeadingMain: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  faqHeadingSub: {
    fontSize: 11.5,
    color: '#64748B',
  },
  faqExpandAllBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  faqExpandAllText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F2644',
  },

  faqFeaturedHeroCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#FDE68A',
    padding: 14,
    marginBottom: 14,
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 1,
  },
  faqFeaturedTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  faqFeaturedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  faqFeaturedBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#B45309',
    letterSpacing: 0.3,
  },
  faqFeaturedViewsText: {
    fontSize: 10.5,
    color: '#92400E',
    fontWeight: '600',
  },
  faqFeaturedQuestion: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 19,
    marginBottom: 6,
  },
  faqFeaturedAnswer: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
    marginBottom: 10,
  },
  faqFeaturedLegalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  faqFeaturedLegalText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#16A34A',
  },

  faqAccordionContainer: {
    gap: 10,
    marginBottom: 16,
  },
  faqAccordionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  faqAccordionCardActive: {
    borderColor: '#0F2644',
  },
  faqAccordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  faqNumBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  faqNumBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F2644',
  },
  faqQuestionTextCol: {
    flex: 1,
    paddingRight: 6,
  },
  faqCategoryMiniPill: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 3,
  },
  faqCategoryMiniText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#0284C7',
  },
  faqQuestionTitleText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 18,
  },
  faqChevronWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  faqChevronWrapActive: {
    backgroundColor: '#0F2644',
  },

  faqAccordionBody: {
    paddingTop: 8,
  },
  faqBodyDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 8,
  },
  faqAnswerBodyText: {
    fontSize: 12.5,
    color: '#334155',
    lineHeight: 18.5,
    marginBottom: 10,
  },
  faqLegalArticleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    paddingHorizontal: 9,
    paddingVertical: 5,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  faqLegalArticleText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#0369A1',
  },
  faqActionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  faqVoteGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  faqVoteLabel: {
    fontSize: 10.5,
    color: '#64748B',
    marginRight: 2,
  },
  faqVoteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  faqVoteBtnActiveYes: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
  },
  faqVoteBtnActiveNo: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
  },
  faqVoteBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  faqVoteBtnTextActiveYes: {
    color: '#16A34A',
  },
  faqVoteBtnTextActiveNo: {
    color: '#DC2626',
  },
  faqShareBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  faqEmptyBox: {
    alignItems: 'center',
    paddingVertical: 26,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
  },
  faqEmptyTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  faqEmptyDesc: {
    fontSize: 11.5,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 12,
  },
  faqEmptyBtn: {
    paddingHorizontal: 13,
    paddingVertical: 6.5,
    borderRadius: 14,
    backgroundColor: '#0F2644',
  },
  faqEmptyBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },

  faqAskCtaCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 4,
    marginBottom: 10,
    shadowColor: '#0F2644',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  faqAskCtaGradient: {
    borderRadius: 20,
    padding: 16,
  },
  faqAskCtaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  faqAskCtaBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#FBBF24',
    letterSpacing: 0.5,
  },
  faqAskCtaTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 21,
    marginBottom: 5,
  },
  faqAskCtaSubtitle: {
    fontSize: 11.5,
    color: '#CBD5E1',
    lineHeight: 16,
    marginBottom: 12,
  },
  faqAskCtaActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FEF08A',
    paddingHorizontal: 14,
    paddingVertical: 7.5,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  faqAskCtaActionBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },

  // ==================== AI ASSISTANT TAB STYLES ====================
  aiStatusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DCFCE7',
    padding: 12,
    marginBottom: 16,
  },
  aiStatusAvatarBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  aiStatusTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#166534',
    marginBottom: 2,
  },
  aiStatusSubtitle: {
    fontSize: 11,
    color: '#15803D',
  },
  aiOnlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
    marginLeft: 6,
  },

  aiQuickPromptRow: {
    gap: 7,
    marginBottom: 8,
  },
  aiQuickPromptCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  aiQuickPromptText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
    lineHeight: 16.5,
  },

  aiChatContainer: {
    gap: 10,
    marginBottom: 16,
  },
  aiChatBubble: {
    borderRadius: 16,
    padding: 12,
  },
  aiChatBubbleUser: {
    backgroundColor: '#0F2644',
    alignSelf: 'flex-end',
    maxWidth: '92%',
  },
  aiChatBubbleBot: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignSelf: 'flex-start',
    maxWidth: '100%',
  },
  aiChatSenderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  aiChatSenderName: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#0F172A',
    flex: 1,
  },
  aiChatTime: {
    fontSize: 10,
    color: '#94A3B8',
  },
  aiChatText: {
    fontSize: 12.5,
    color: '#334155',
    lineHeight: 18,
  },
  aiChatTextUser: {
    color: '#FFFFFF',
  },
  aiChatArticleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  aiChatArticleText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0369A1',
  },

  aiInputCard: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  aiTextInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    maxHeight: 80,
    paddingVertical: 4,
  },
  aiSendBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  aiSendBtnActive: {
    backgroundColor: '#0F2644',
  },
  // ==================== HUJJATLAR MARKAZI TAB STYLES ====================
  docHeaderBlock: {
    marginBottom: 14,
    paddingTop: 4,
  },
  docTrustBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  docTrustBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#16A34A',
    letterSpacing: 0.4,
  },
  docMainTitle: {
    fontSize: 23,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  docMainSubtitle: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },

  // Stats Strip
  docStatsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 14,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 1,
  },
  docStatCard: {
    flex: 1,
    alignItems: 'center',
  },
  docStatNumber: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F2644',
    marginBottom: 2,
  },
  docStatLabel: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '600',
  },
  docStatDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },

  docSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 1,
  },
  docSearchInput: {
    flex: 1,
    fontSize: 13.5,
    color: '#0F172A',
    paddingVertical: 0,
  },

  docFilterScroll: {
    gap: 8,
    marginBottom: 16,
    paddingRight: 16,
  },
  docFilterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  docFilterPillActive: {
    backgroundColor: '#0F2644',
    borderColor: '#0F2644',
  },
  docFilterPillInactive: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  docFilterPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  docFilterPillTextActive: {
    color: '#FFFFFF',
  },
  docFilterPillTextInactive: {
    color: '#475569',
  },

  // AI Constructor Card
  docConstructorCard: {
    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: 18,
    shadowColor: '#0F2644',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 4,
  },
  docConstructorGradient: {
    borderRadius: 22,
    padding: 18,
  },
  docConstructorTagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 9,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  docConstructorTagText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#FBBF24',
    letterSpacing: 0.5,
  },
  docConstructorTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 22,
    marginBottom: 6,
  },
  docConstructorSubtitle: {
    fontSize: 12,
    color: '#CBD5E1',
    lineHeight: 17,
    marginBottom: 12,
  },
  docConstructorFeaturesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 14,
  },
  docConstructorFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  docConstructorFeatureText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E2E8F0',
  },
  docConstructorCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FEF08A',
    paddingHorizontal: 16,
    paddingVertical: 8.5,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  docConstructorCtaBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F172A',
  },

  // Section Headers
  docSectionTitleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  docCountBadgeSmall: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  docCountBadgeSmallText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2563EB',
  },
  docCatalogFilterLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16A34A',
  },

  // Mening Hujjatlarim
  docRecentContainer: {
    gap: 9,
    marginBottom: 18,
  },
  docRecentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  docRecentBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },
  docRecentBadgeText: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  docRecentInfoCol: {
    flex: 1,
    paddingRight: 6,
  },
  docRecentTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  docRecentMeta: {
    fontSize: 10.5,
    color: '#94A3B8',
  },
  docRecentActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  docRecentActionIconBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  docRecentStatusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 10,
  },
  docRecentStatusText: {
    fontSize: 10.5,
    fontWeight: '700',
  },

  // Rasmiy andozalar katalogi - Modern Card
  docCatalogList: {
    gap: 12,
    marginBottom: 18,
  },
  docCatalogModernCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  docCardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  docCatalogBadgeBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  docCatalogBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  docCardHeaderMetaCol: {
    flex: 1,
  },
  docCardCategoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  docCardCategoryBadge: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#0284C7',
    textTransform: 'uppercase',
  },
  docCardLegalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  docCardLegalBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#16A34A',
  },
  docCatalogItemTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 19,
  },
  docCatalogItemDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
    marginBottom: 10,
  },
  docCardStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  docCardStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  docCardStatText: {
    fontSize: 11,
    color: '#64748B',
  },
  docCatalogMetaDot: {
    fontSize: 10,
    color: '#CBD5E1',
    marginHorizontal: 6,
  },

  // 4 Action Buttons Grid
  docCardActionsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  docActionBtnView: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 8,
    borderRadius: 14,
  },
  docActionBtnViewText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0F2644',
  },
  docActionBtnDownload: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F2644',
    paddingVertical: 8,
    borderRadius: 14,
    shadowColor: '#0F2644',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  docActionBtnDownloadText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  docActionBtnShare: {
    width: 36,
    height: 34,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  docActionBtnFill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 14,
  },
  docActionBtnFillText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#B45309',
  },

  // Empty State
  docEmptyStateCard: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 20,
  },
  docEmptyStateTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  docEmptyStateDesc: {
    fontSize: 12.5,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 14,
  },
  docEmptyResetBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#0F2644',
  },
  docEmptyResetBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  // Legal instructions callout box
  docRuleCalloutBox: {
    backgroundColor: '#F0FDF4',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DCFCE7',
    padding: 16,
    marginBottom: 10,
  },
  docRuleHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  docRuleTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#16A34A',
  },
  docRuleDesc: {
    fontSize: 12,
    color: '#374151',
    lineHeight: 18,
  },
  docRuleStepsCol: {
    gap: 8,
    marginBottom: 14,
  },
  docRuleStepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  docRuleStepBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginTop: 1,
  },
  docRuleStepBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#16A34A',
  },
  docRuleStepText: {
    flex: 1,
    fontSize: 12,
    color: '#374151',
    lineHeight: 18,
  },
  docHotlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16A34A',
    paddingVertical: 10,
    borderRadius: 16,
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  docHotlineBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // ==================== MODALS: PREVIEW & CONSTRUCTOR ====================
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'flex-end',
  },
  modalSheetContainer: {
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '92%',
    minHeight: '80%',
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginBottom: 12,
  },
  modalHeaderTitleCol: {
    flex: 1,
    paddingRight: 10,
  },
  modalBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  modalBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#16A34A',
  },
  modalDocHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalCloseBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalPaperScroll: {
    flex: 1,
    marginBottom: 12,
  },

  // Official A4 Paper Card
  officialPaperCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    padding: 18,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 10,
  },
  paperCrestBox: {
    alignItems: 'center',
    paddingBottom: 12,
  },
  paperCrestTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#0F2644',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  paperCrestSubtitle: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
    textAlign: 'center',
    marginTop: 2,
  },
  paperDividerLine: {
    width: '60%',
    height: 1.5,
    backgroundColor: '#0F2644',
    marginTop: 8,
    borderRadius: 1,
  },
  paperHeaderInfoCol: {
    alignSelf: 'flex-end',
    maxWidth: '75%',
    marginVertical: 12,
  },
  paperHeaderInfoText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#334155',
    textAlign: 'right',
    lineHeight: 16,
  },
  paperTitleCenterBox: {
    alignItems: 'center',
    marginVertical: 12,
  },
  paperDocMainTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: 0.8,
  },
  paperDocLegalRef: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0284C7',
    marginTop: 3,
  },
  paperDocContentText: {
    fontSize: 12.5,
    color: '#1E293B',
    lineHeight: 21,
    marginVertical: 10,
  },
  paperFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  paperFooterText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#475569',
  },
  paperSealStampBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#DCFCE7',
    alignSelf: 'center',
  },
  paperSealStampText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#16A34A',
    letterSpacing: 0.3,
  },

  // Modal Bottom Actions
  modalBottomActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 6,
  },
  modalActionSecondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingVertical: 11,
    borderRadius: 16,
  },
  modalActionSecondaryBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F2644',
  },
  modalActionPrimaryBtn: {
    flex: 1.4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F2644',
    paddingVertical: 11,
    borderRadius: 16,
    shadowColor: '#0F2644',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  modalActionPrimaryBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Constructor Tabs & Form
  constructorTabsStrip: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 14,
    padding: 3,
    marginBottom: 12,
  },
  constructorTabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 12,
  },
  constructorTabBtnActive: {
    backgroundColor: '#0F2644',
  },
  constructorTabBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  constructorTabBtnTextActive: {
    color: '#FFFFFF',
  },
  constructorScroll: {
    flex: 1,
    marginBottom: 12,
  },
  constructorFieldTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  constructorTypePillGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  constructorTypeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 12,
    gap: 6,
  },
  constructorTypeChipActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  constructorTypeChipText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#334155',
  },
  constructorTypeChipTextActive: {
    color: '#1D4ED8',
    fontWeight: '800',
  },
  constructorTypeArticleBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 6,
  },
  constructorTypeArticleBadgeActive: {
    backgroundColor: '#DBEAFE',
  },
  constructorTypeArticleText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#64748B',
  },
  constructorTypeArticleTextActive: {
    color: '#1D4ED8',
  },

  // Form Inputs
  constructorFormGroup: {
    marginBottom: 12,
  },
  constructorLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 5,
  },
  constructorInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  constructorTextInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    paddingVertical: 0,
  },
  constructorGenerateSubmitBtn: {
    borderRadius: 18,
    overflow: 'hidden',
    marginTop: 6,
    marginBottom: 14,
    shadowColor: '#0F2644',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  constructorGenerateSubmitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  constructorGenerateSubmitText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Generated Actions
  constructorGeneratedActions: {
    gap: 8,
    marginTop: 8,
    marginBottom: 10,
  },
  constructorSaveDocBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16A34A',
    paddingVertical: 12,
    borderRadius: 16,
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  constructorSaveDocBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  constructorSmallActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  constructorSmallActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingVertical: 10,
    borderRadius: 14,
  },
  constructorSmallActionText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0F2644',
  },
  // ==================== DEDICATED VIDEO DARS TAB STYLES ====================
  videoTabRootContainer: {
    marginBottom: 20,
  },
  videoCinemaPlayerCard: {
    width: '100%',
    height: 205,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#0A192F',
    position: 'relative',
    shadowColor: '#0A192F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  videoCinemaThumbImg: {
    width: '100%',
    height: '100%',
  },
  videoCinemaGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    padding: 12,
  },
  videoPlayerTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  videoLiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  videoLiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
    marginRight: 6,
  },
  videoLiveText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  videoLangBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  videoLangText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#CBD5E1',
  },
  videoBigPlayBtn: {
    alignSelf: 'center',
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  videoPlayerBottomControls: {
    width: '100%',
  },
  videoTimelineTrack: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: 6,
    position: 'relative',
    justifyContent: 'center',
  },
  videoTimelineElapsed: {
    width: '42%',
    height: 4,
    borderRadius: 2,
    backgroundColor: '#F59E0B',
  },
  videoTimelineScrubber: {
    position: 'absolute',
    left: '42%',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: -5 }],
  },
  videoTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  videoTimeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  videoPlayerMiniIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  videoSpeedPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  videoSpeedPillText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  videoPageTitle: {
    fontSize: 17.5,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 24,
    marginTop: 14,
    marginBottom: 8,
  },
  videoBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  videoLevelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  videoLevelBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  videoViewsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  videoViewsBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  videoRatingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  videoRatingBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D97706',
  },

  videoActionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 14,
  },
  videoActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 4,
  },
  videoActionBtnLiked: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FEE2E2',
  },
  videoActionText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#475569',
  },
  videoActionTextLiked: {
    color: '#EF4444',
  },

  videoInstructorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    marginBottom: 16,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  videoInstructorAvatarBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  videoInstructorInfoCol: {
    flex: 1,
    paddingRight: 6,
  },
  videoInstructorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  videoInstructorName: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  videoInstructorBio: {
    fontSize: 11,
    color: '#64748B',
  },
  videoInstructorAskBtn: {
    backgroundColor: '#0F2644',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 12,
  },
  videoInstructorAskBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  videoSectionBlock: {
    marginBottom: 16,
  },
  videoSectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  videoSectionTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  videoSectionCountBadge: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },

  videoChaptersList: {
    gap: 8,
  },
  videoChapterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 9,
    paddingHorizontal: 12,
  },
  videoChapterItemActive: {
    backgroundColor: '#FEFDF8',
    borderColor: '#FDE68A',
  },
  videoChapterNumBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  videoChapterNumBoxActive: {
    backgroundColor: '#D97706',
  },
  videoChapterTextCol: {
    flex: 1,
    paddingRight: 6,
  },
  videoChapterTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  videoChapterTitleActive: {
    color: '#B45309',
  },
  videoChapterTime: {
    fontSize: 10.5,
    color: '#64748B',
  },
  videoChapterActivePill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  videoChapterActivePillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#B45309',
  },

  videoRelatedList: {
    gap: 10,
  },
  videoRelatedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 9,
    gap: 10,
  },
  videoRelatedThumbBox: {
    width: 90,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#0F172A',
  },
  videoRelatedThumbImg: {
    width: '100%',
    height: '100%',
  },
  videoRelatedPlayIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(0,0,0,0.5)',
    transform: [{ translateX: -11 }, { translateY: -11 }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoRelatedDurationBadge: {
    position: 'absolute',
    bottom: 3,
    right: 3,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  videoRelatedDurationText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  videoRelatedInfoCol: {
    flex: 1,
  },
  videoRelatedTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 16,
    marginBottom: 4,
  },
  videoRelatedMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  videoRelatedMetaText: {
    fontSize: 10.5,
    color: '#64748B',
  },

  videoQuizCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#FDE68A',
    padding: 14,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  videoQuizHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  videoQuizHeaderTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#B45309',
  },
  videoQuizQuestion: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 18,
    marginBottom: 12,
  },
  videoQuizOptionsList: {
    gap: 8,
  },
  videoQuizOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  videoQuizOptionCorrect: {
    backgroundColor: '#F0FDF4',
    borderColor: '#86EFAC',
  },
  videoQuizOptionWrong: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  videoQuizOptionText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#334155',
  },
  videoQuizOptionTextCorrect: {
    color: '#15803D',
    fontWeight: '700',
  },
  videoQuizOptionTextWrong: {
    color: '#B91C1C',
    fontWeight: '700',
  },

});
