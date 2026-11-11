import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  Alert,
  Animated,
  Easing,
  Share,
  PanResponder,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Images
const videoLessonCover = require('../../assets/images/video_lesson_cover.png');
const huquqlarScaleBook = require('../../assets/images/huquqlar_scale_book.png');

interface MehnatKodeksiKitobScreenProps {
  onBack: () => void;
}

type BookTheme = 'sepia' | 'day' | 'night';
type BookTab = 'book' | 'video' | 'toc' | 'search';

interface BookPage {
  pageNumber: number;
  part: string;
  chapter: string;
  articlesRange: string;
  title: string;
  subtitle: string;
  articles: Array<{
    num: string;
    title: string;
    content: string;
    highlights?: string[];
  }>;
}

const KODEKS_PAGES: BookPage[] = [
  {
    pageNumber: 1,
    part: 'I QISM. UMUMIY QOIDALAR',
    chapter: '1-bob. Asosiy qoidalar',
    articlesRange: '1–8-moddalar',
    title: 'Mehnat qonunçiligining maqsad va vazifalari',
    subtitle: 'Yangi tahrirdagi Mehnat kodeksi 2023-yil 30-apreldan e’tiboran rasman kuçga kirgan.',
    articles: [
      {
        num: '1-modda',
        title: 'Mehnat qonunçiligining asosiy maqsadi',
        content: 'Mehnat qonunçiligining maqsadi xodimlar, iş beruvçilar va davlat manfaatlarining maqbul muvozanatini ta’minlaş, xodimlarning mehnat huquqlarini kafolatlaş hamda iqtisodiy samaradorlikni oşirişdan iborat.',
        highlights: [
          'Xodim va iş beruvçi huquqlarining tengligi',
          'Majburiy mehnatning qat’iyan taqiqlanişi',
          'Mehnat munosabatlarida adolat va qonuniylik',
        ],
      },
      {
        num: '4-modda',
        title: 'Mehnat sohasidagi kamsitişni taqiqlaş',
        content: 'Jinsi, yoşi, irqi, millati, tili, ijtimoiy kelib çiqişi, mulkiy holati, dini yoki e’tiqodiga qarab mehnat huquqlarini çeklaş yoki ortiqça imtiyozlar beriş qat’iyan man etiladi.',
      },
    ],
  },
  {
    pageNumber: 2,
    part: 'I QISM. UMUMIY QOIDALAR',
    chapter: '2-bob. Mehnat munosabatlari subyektlari',
    articlesRange: '15–25-moddalar',
    title: 'Xodim va iş beruvçining huquqiy maqomi',
    subtitle: 'Tomonlarning qonuniy majburiyatlari va daxlsiz mehnat kafolatlari.',
    articles: [
      {
        num: '21-modda',
        title: 'Xodimning asosiy huquqlari',
        content: 'Xodim öz huquq va manfaatlarini himoya qiliş, qulay mehnat şaroitlariga ega böliş, belgilangan me’yorlardan kam bölmagan maoh oliş, dam oliş va malaka oşiriş huquqiga ega.',
        highlights: [
          'Xavfsiz va sanitariya talablariga mos iş joyi',
          'Öz vaqtida va töliq hajmda oylik maoh oliş',
          'Har yillik haq tölanadigan asosiy mehnat ta’tili',
        ],
      },
      {
        num: '25-modda',
        title: 'Iş beruvçining asosiy majburiyatlari',
        content: 'Iş beruvçi xodimga şartnomada kelişilgan işni ta’minlaşi, mehnat muhofazasiga rioya qilişi va oylik haqni bir kun ham keçiktirmasdan tölaşi şart.',
      },
    ],
  },
  {
    pageNumber: 3,
    part: 'II QISM. YAKKA TARTIBDAGI MEHNAT MUNOSABATLARI',
    chapter: '6-bob. Mehnat şartnomasi tuziş',
    articlesRange: '104–112-moddalar',
    title: 'Mehnat şartnomasi — huquqiy asos',
    subtitle: 'Işga qabul qilişda yozma şartnomaning majburiy bandlari va tartibi.',
    articles: [
      {
        num: '104-modda',
        title: 'Mehnat şartnomasining tuşunçasi va şakli',
        content: 'Mehnat şartnomasi xodim bilan iş beruvçi örtasida kamida ikki nusxada yozma şaklda tuziladigan kelişuvdir. Bir nusxasi xodimga topshiriladi, ikkinchisi iş beruvçida saqlanadi.',
        highlights: [
          'Oğzaki kelişuv mehnat munosabatlarini rasmiylaştirmaydi',
          'Iş joyi, lavozim va oylik maoh summasi aniq körsatilişi şart',
          'Işga qabul buyrug‘i şartnoma asosidagina çiqariladi',
        ],
      },
      {
        num: '110-modda',
        title: 'Mehnat şartnomasining muddati',
        content: 'Mehnat şartnomalari nomuayyan muddatga (doimiy) yoki 3 yildan oşmagan muayyan muddatga (muddatli) tuzilishi mumkin. Asossiz muddatli şartnoma tuziş taqiqlanadi.',
      },
    ],
  },
  {
    pageNumber: 4,
    part: 'II QISM. YAKKA TARTIBDAGI MEHNAT MUNOSABATLARI',
    chapter: '7-bob. Dastlabki sinov muddati',
    articlesRange: '129–132-moddalar',
    title: 'Sinov muddati qoidalari va çeklovlari',
    subtitle: 'Sinov muddati davrida xodim huquqlari va noqonuniy talablardan himoya.',
    articles: [
      {
        num: '129-modda',
        title: 'Dastlabki sinov şartlari va muddati',
        content: 'Xodimning kasbiy layoqatini tekşiriş maqsadida sinov muddati belgilanadi. Sinov muddati köpi bilan 3 oydan, taşkilot rahbarlari va bosh hisobçilar uçun 6 oydan oşmasligi şart.',
        highlights: [
          'Sinov muddati davrida maoh kamroq tölanişi qat’iyan man etiladi',
          'Homilador ayollar va 3 yoşgaça bolasi borlarga sinov belgilanmaydi',
          'Oliy ta’limni tamomlab 1-marta işga kirayotganlarga sinov qöyilmaydi',
        ],
      },
      {
        num: '132-modda',
        title: 'Sinov natijasi va qonuniy kafolatlar',
        content: 'Sinov muddati tugagunga qadar tomonlardan biri şartnomani bekor qilişni talab qilmagan bölsa, sinovdan muvaffaqiyatli ötgan hisoblanadi va şartnoma davom etadi.',
      },
    ],
  },
  {
    pageNumber: 5,
    part: 'III QISM. ISH VAQTI VA DAM OLIŞ',
    chapter: '10-bob. Iş vaqti me’yorlari',
    articlesRange: '182–190-moddalar',
    title: 'Haftalik 40 soatlik me’yor va ortiqça iş',
    subtitle: 'Kundalik smena, qisqartirilgan iş vaqti va dam oliş kafolatlari.',
    articles: [
      {
        num: '182-modda',
        title: 'Normal iş vaqti davomiyligi',
        content: 'Xodim uçun haftalik normal iş vaqti 40 soatdan oşmasligi şart. 5 kunlik iş haftasida kunlik 8 soatdan, 6 kunlikda esa 7 soatdan oşişi mumkin emas.',
        highlights: [
          '16 yoşdan 18 yoşgaça xodimlarga haftasiga köpi bilan 36 soat',
          'Bayram kunlari arafasida iş kuni kamida 1 soatga qisqartiriladi',
          'Zararli mehnat şaroitlarida haftasiga maksimum 36 soat',
        ],
      },
      {
        num: '190-modda',
        title: 'Iş vaqtidan taşqari ortiqça iş',
        content: 'Iş vaqtidan taşqari işga faqat xodimning yozma roziligi bilan yöll qöyiladi. U surunkasiga ikki kun davomida 4 soatdan va yiliga 120 soatdan oşmasligi şart.',
      },
    ],
  },
  {
    pageNumber: 6,
    part: 'III QISM. ISH VAQTI VA DAM OLIŞ',
    chapter: '12-bob. Mehnat ta’tillari',
    articlesRange: '216–235-moddalar',
    title: 'Yillik asosiy ta’til — kamida 21 kun',
    subtitle: 'Yangi kodeksdagi eng katta yangilik: ta’til kunlari va tölov kafolati.',
    articles: [
      {
        num: '217-modda',
        title: 'Asosiy uzaytirilgan mehnat ta’tili',
        content: 'Xodimlarga yillik asosiy mehnat ta’tili kamida 21 kalendar kun etib belgilandi (eski kodeksdagi 15 iş kuni örniga). Ayrim toifadagi xodimlarga 30 kalendar kungacha beriladi.',
        highlights: [
          'Ta’til puli ta’til boshlanişidan kamida 3 kun oldin tölanadi',
          'Işdan böşaşda barça foydalanilmagan ta’tillar uçun pul tölanadi',
          '1-iş yili uçun ta’til uzluksiz 6 oy ishlagandan so‘ng beriladi',
        ],
      },
      {
        num: '233-modda',
        title: 'Ta’til pulini keçiktiriş taqiqi',
        content: 'Ta’til puli öz vaqtida tölanmagan taqdirda, xodim ta’til boshlanişini töliq haq tölanganga qadar kechiktirişni talab qiliş huquqiga ega.',
      },
    ],
  },
  {
    pageNumber: 7,
    part: 'IV QISM. MEHNATGA HAQ TO‘LASH',
    chapter: '14-bob. Iş haqi tölaş tartibi',
    articlesRange: '243–255-moddalar',
    title: 'Har 16 kunda kamida bir marotaba maoh',
    subtitle: 'Iş haqi kafolatlari, avans va oylik muddatlari qat’iy belgilandi.',
    articles: [
      {
        num: '253-modda',
        title: 'Iş haqini tölaş muddatlari',
        content: 'Iş haqi har yarim oyda kamida bir marta (16 kundan oşmagan oraliqda) xodimga tölab berilişi şart. Dam oliş yoki bayram kuniga tög‘ri kelsa, bir kun oldin beriladi.',
        highlights: [
          'Bir kun ham keçiktirişga qonunan yöll qöyilmaydi',
          'Iş haqi milliy valyuta — sömda tölanadi',
          'Xodimga har oylik hisob-kitob varaqasi (raschyotka) beriladi',
        ],
      },
      {
        num: '269-modda',
        title: 'Iş haqidan uşlab qoliş çeklovlari',
        content: 'Xodimning yozma roziligisiz oylikdan uşlab qolish faqat soliqlar va sud ijro hujjatlari böyiça mumkin. Jami uşlanmalar umumiy maohning 50 foizidan oşişi qat’iyan man etiladi.',
      },
    ],
  },
  {
    pageNumber: 8,
    part: 'IV QISM. MEHNATGA HAQ TO‘LASH',
    chapter: '16-bob. Moddiy javobgarlik va penya',
    articlesRange: '333–340-moddalar',
    title: 'Keçiktirilgan maoh uçun qonuniy penya',
    subtitle: 'Iş beruvçining xodim oldidagi moliyaviy javobgarligi.',
    articles: [
      {
        num: '333-modda',
        title: 'Iş haqini keçiktirganlik uçun kompensatsiya',
        content: 'Iş beruvçi oylik, ta’til puli yoki boşqa to‘lovlarni o‘z vaqtida to‘lamasa, kechiktirilgan har bir kun uçun Markaziy bank qayta moliyalash stavkasining 1/300 miqdorida foiz (penya) tölaşga majbur.',
        highlights: [
          'Penya tölaş iş beruvçining aybidan qat’i nazar yuzaga keladi',
          'Penya xodimning arizasisiz avtomatik hisoblanishi shart',
          'Sud orqali xodim ma’naviy zarar kompensatsiyasini ham talab qila oladi',
        ],
      },
    ],
  },
  {
    pageNumber: 9,
    part: 'V QISM. MEHNAT SHARTNOMASINI BEKOR QILISH',
    chapter: '18-bob. Işdan böşatiş asoslari',
    articlesRange: '160–175-moddalar',
    title: 'Öz xohişi bilan va ştat qisqarişida böşatiş',
    subtitle: '14 kunlik oğohlantiriş, arizani qaytarib olish va böşatiş nafaqasi.',
    articles: [
      {
        num: '160-modda',
        title: 'Xodim taşabbusi bilan şartnomani bekor qiliş',
        content: 'Xodim noaniq muddatli mehnat şartnomasini 14 kalendar kun oldin yozma oğohlantirgan holda bekor qilişga haqli. 14 kun tugagunga qadar arizasini istalgan paytda qaytarib olişi mumkin.',
        highlights: [
          'Arizani qaytarib olganda ish beruvchi böşatişga haqli emas',
          'Majburiy uşlab qolish yoki mehnat daftarchasini bermaslik taqiqlanadi',
          'Oxirgi iş kuni barça hisob-kitoblar 100% töliq tölanadi',
        ],
      },
      {
        num: '173-modda',
        title: 'Işdan böşaş nafaqasi miqdori',
        content: 'Ştat qisqarganda xodimga stajiga mutanosib ravishda örtacha oylik ish haqining 50 foizidan 200 foizigacha miqdorda ishdan böşatiş nafaqasi tölanadi.',
      },
    ],
  },
  {
    pageNumber: 10,
    part: 'VI QISM. AYRIM TOIFADAGI XODIMLAR MEHNATI',
    chapter: '22-bob. Ayollar va bolali xodimlar',
    articlesRange: '400–415-moddalar',
    title: 'Onslik va bolalikni muhofaza qiliş',
    subtitle: 'Homilador ayollar, tuğruq ta’tili va ishdan böşatiş böyiça qat’iy taqiqlar.',
    articles: [
      {
        num: '404-modda',
        title: 'Homiladorlik va tuğruq ta’tili',
        content: 'Ayollarga tuğruqdan oldin 70 kalendar kun va tuğruqdan keyin 56 (murakkab tuğruqda 70) kalendar kunlik haq tölanadigan ta’til berilib, davlat nafaqasi 100% töliq tölanadi.',
        highlights: [
          'Bola 3 yoshga to‘lguncha ish o‘rni (lavozimi) qat’iy saqlanadi',
          'Homilador va 3 yoşgaça bolasi borlarni böşatiş qat’iyan man etiladi',
          'Bola parvarişlaş ta’tili umumiy va mutaxassislik stajiga qo‘shiladi',
        ],
      },
    ],
  },
  {
    pageNumber: 11,
    part: 'VII QISM. MEHNAT NIZOLARI VA NAZORAT',
    chapter: '28-bob. Işga tiklash va sud himoyasi',
    articlesRange: '535–550-moddalar',
    title: 'Noqonuniy böşatilganda sud orqali tiklash',
    subtitle: 'Majburiy bekor yurgan kunlar haqi va davlat bojidan ozodlik.',
    articles: [
      {
        num: '542-modda',
        title: 'Sud orqali xodim huquqlarini tiklaş',
        content: 'Noqonuniy böşatilgan xodim sud orqali avvalgi lavozimiga darhol tiklanadi va barça majburiy bekor yurgan kunlari uçun örtacha iş haqi undirib beriladi.',
        highlights: [
          'Xodim sudga murojaat qilganda barça davlat bojlaridan ozod etiladi',
          'Sud qarori darhol ijro etilishi majburiydir',
          'Ma’naviy zarar uçun kompensatsiya ish beruvchidan undiriladi',
        ],
      },
      {
        num: '548-modda',
        title: 'Davlat mehnat inspeksiyasi (1176)',
        content: 'Mehnat huquqlari buzilgan har qanday xodim Davlat mehnat inspeksiyasiga töğridan-töğri murojaat qilishi mumkin. Murojaatchi şaxsi sir saqlanishi qonun bilan kafolatlanadi.',
      },
    ],
  },
];

export const MehnatKodeksiKitobScreen: React.FC<MehnatKodeksiKitobScreenProps> = ({ onBack }) => {
  const insets = useSafeAreaInsets();

  // Active Screen Mode
  const [activeTab, setActiveTab] = useState<BookTab>('book');
  const [theme, setTheme] = useState<BookTheme>('sepia');
  const [fontSize, setFontSize] = useState<number>(15);
  const [currentPageIdx, setCurrentPageIdx] = useState<number>(0);
  const [bookmarkedPages, setBookmarkedPages] = useState<number[]>([1, 6]);

  // Video State
  const [videoIsPlaying, setVideoIsPlaying] = useState<boolean>(false);
  const [videoSpeed, setVideoSpeed] = useState<'1.0x' | '1.25x' | '1.5x'>('1.0x');
  const [videoChapterIdx, setVideoChapterIdx] = useState<number>(0);

  // Search State
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Audio Reading Simulation
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const audioWaveAnim = useRef(new Animated.Value(0)).current;

  // Page Turn State & Smooth 3D Animation
  const [isTurning, setIsTurning] = useState<boolean>(false);
  const [turnDirection, setTurnDirection] = useState<'forward' | 'backward'>('forward');
  const [targetPageIdx, setTargetPageIdx] = useState<number>(0);
  const turnAnim = useRef(new Animated.Value(0)).current;

  // Turn page with smooth, realistic 3D paper curl and depth animation
  const handleTurnPage = (direction: 'forward' | 'backward', customTargetIdx?: number) => {
    if (isTurning) return;

    let nextIdx = currentPageIdx;
    if (typeof customTargetIdx === 'number') {
      if (customTargetIdx === currentPageIdx || customTargetIdx < 0 || customTargetIdx >= KODEKS_PAGES.length) return;
      nextIdx = customTargetIdx;
    } else if (direction === 'forward') {
      if (currentPageIdx >= KODEKS_PAGES.length - 1) return;
      nextIdx = currentPageIdx + 1;
    } else {
      if (currentPageIdx <= 0) return;
      nextIdx = currentPageIdx - 1;
    }

    setTurnDirection(direction);
    setTargetPageIdx(nextIdx);
    setIsTurning(true);
    turnAnim.setValue(0);

    Animated.timing(turnAnim, {
      toValue: 1,
      duration: 320,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setCurrentPageIdx(nextIdx);
        setIsTurning(false);
        turnAnim.setValue(0);
      }
    });
  };

  // Horizontal Swipe PanResponder for intuitive book page turning
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        if (isTurning) return false;
        return (
          Math.abs(gestureState.dx) > 30 &&
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 2.2
        );
      },
      onPanResponderRelease: (_, gestureState) => {
        if (isTurning) return;
        if (gestureState.dx < -45) {
          handleTurnPage('forward');
        } else if (gestureState.dx > 45) {
          handleTurnPage('backward');
        }
      },
    })
  ).current;

  // Trigger audio wave animation when active
  useEffect(() => {
    if (isPlayingAudio) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(audioWaveAnim, {
            toValue: 1,
            duration: 500,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(audioWaveAnim, {
            toValue: 0,
            duration: 500,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      audioWaveAnim.setValue(0);
    }
  }, [isPlayingAudio]);

  const currentPage = KODEKS_PAGES[currentPageIdx];
  const activeDisplayPage = isTurning ? KODEKS_PAGES[targetPageIdx] : currentPage;
  const isBookmarked = bookmarkedPages.includes(activeDisplayPage.pageNumber);

  const handleToggleBookmark = (pageNumInput?: number) => {
    const pageNum = pageNumInput ?? activeDisplayPage.pageNumber;
    if (bookmarkedPages.includes(pageNum)) {
      setBookmarkedPages((prev) => prev.filter((p) => p !== pageNum));
      Alert.alert('Xatchöp oçirildi', `${pageNum}-bet xatchöplardan olib taşlandi.`);
    } else {
      setBookmarkedPages((prev) => [...prev, pageNum]);
      Alert.alert('Xatchöp qöşildi 🔖', `${pageNum}-bet xatchöplarga saqlandi.`);
    }
  };

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      setIsPlayingAudio(false);
      Alert.alert('Ovozli öqiş töxtatildi', 'Matnni ovozli ijro etiş pauza qilindi.');
    } else {
      setIsPlayingAudio(true);
      Alert.alert(
        'Ovozli öqiş faollashtirildi 🔊',
        `«${currentPage.title}» bölimi sun’iy intellekt diktori tomonidan tinik ovozda öqilmoqda.`
      );
    }
  };

  const handleShareArticle = async (article: any) => {
    try {
      await Share.share({
        title: article.title,
        message: `📘 Özbekiston Respublikasi Mehnat Kodeksi\n${article.num}. ${article.title}\n\n${article.content}\n\nYordam ilovasi orqali ulashildi.`,
      });
    } catch {
      Alert.alert('Ulaşiş', 'Ulaşiş oynasi oçilmadi.');
    }
  };

  // Interpolations for realistic 3D paper curl & depth transition
  const topPageForwardStyle = {
    transform: [
      {
        translateX: turnAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -width * 0.9],
        }),
      },
      {
        rotateZ: turnAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '-7deg'],
        }),
      },
      {
        scale: turnAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0.94],
        }),
      },
    ],
    opacity: turnAnim.interpolate({
      inputRange: [0, 0.75, 1],
      outputRange: [1, 0.85, 0],
    }),
  };

  const bottomPageForwardStyle = {
    transform: [
      {
        scale: turnAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.97, 1],
        }),
      },
    ],
    opacity: turnAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.9, 1],
    }),
  };

  const topPageBackwardStyle = {
    transform: [
      {
        translateX: turnAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [-width * 0.9, 0],
        }),
      },
      {
        rotateZ: turnAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ['-7deg', '0deg'],
        }),
      },
      {
        scale: turnAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.94, 1],
        }),
      },
    ],
    opacity: turnAnim.interpolate({
      inputRange: [0, 0.25, 1],
      outputRange: [0, 0.85, 1],
    }),
  };

  const bottomPageBackwardStyle = {
    transform: [
      {
        scale: turnAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0.97],
        }),
      },
    ],
    opacity: turnAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0.9],
    }),
  };

  const topCurlShadowOpacity = turnAnim.interpolate({
    inputRange: [0, 0.45, 0.85, 1],
    outputRange: [0, 0.35, 0.15, 0],
  });

  const topCurlShadowBackwardOpacity = turnAnim.interpolate({
    inputRange: [0, 0.45, 0.85, 1],
    outputRange: [0.35, 0.25, 0.05, 0],
  });

  // Theme-based colors
  const themeStyles = {
    sepia: {
      bg: '#FDF8ED',
      bookBorder: '#E6D7B8',
      pageBg: '#FFFDF7',
      textPrimary: '#2D241E',
      textSecondary: '#6B5A4D',
      accent: '#8C5E32',
      divider: '#EEDDC0',
      badgeBg: '#F5EADB',
      cardBorder: '#E8DCBF',
    },
    day: {
      bg: '#F8FAFC',
      bookBorder: '#CBD5E1',
      pageBg: '#FFFFFF',
      textPrimary: '#0F172A',
      textSecondary: '#475569',
      accent: '#0284C7',
      divider: '#F1F5F9',
      badgeBg: '#E0F2FE',
      cardBorder: '#E2E8F0',
    },
    night: {
      bg: '#090D16',
      bookBorder: '#1E293B',
      pageBg: '#0F172A',
      textPrimary: '#F8FAFC',
      textSecondary: '#94A3B8',
      accent: '#38BDF8',
      divider: '#1E293B',
      badgeBg: '#1E293B',
      cardBorder: '#334155',
    },
  }[theme];

  // Filtered pages for search
  const searchResults = KODEKS_PAGES.filter((p) => {
    if (!searchQuery.trim()) return false;
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.chapter.toLowerCase().includes(q) ||
      p.articles.some(
        (a) =>
          a.num.toLowerCase().includes(q) ||
          a.title.toLowerCase().includes(q) ||
          a.content.toLowerCase().includes(q)
      )
    );
  });

  // Render individual page sheet content
  const renderBookPageSheet = (page: BookPage, isInteractive: boolean) => {
    const isPageBookmarked = bookmarkedPages.includes(page.pageNumber);
    return (
      <View style={styles.bookPageInnerFlex}>
        {/* Page Top Header Bar */}
        <View style={[styles.pageTopMetaRow, { borderBottomColor: themeStyles.divider }]}>
          <Text style={[styles.pageTopPartText, { color: themeStyles.accent }]}>
            {page.part}
          </Text>
          <TouchableOpacity
            disabled={!isInteractive}
            onPress={() => handleToggleBookmark(page.pageNumber)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={isPageBookmarked ? 'bookmark' : 'bookmark-outline'}
              size={15}
              color={isPageBookmarked ? '#BE123C' : themeStyles.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* Chapter Badge */}
        <View style={styles.pageChapterRow}>
          <View style={[styles.pageChapterBadge, { backgroundColor: themeStyles.badgeBg }]}>
            <Text style={[styles.pageChapterBadgeText, { color: themeStyles.textPrimary }]}>
              {page.chapter}
            </Text>
          </View>
          <Text style={[styles.pageArticlesRangeText, { color: themeStyles.textSecondary }]}>
            {page.articlesRange}
          </Text>
        </View>

        {/* Page Title & Subtitle */}
        <Text style={[styles.pageMainTitle, { color: themeStyles.textPrimary }]}>
          {page.title}
        </Text>
        <Text style={[styles.pageSubtitle, { color: themeStyles.textSecondary }]}>
          {page.subtitle}
        </Text>

        {/* Decorative Divider */}
        <View style={styles.pageDecorativeDivider}>
          <View style={[styles.pageDividerLine, { backgroundColor: themeStyles.divider }]} />
          <FontAwesome5 name="balance-scale" size={11} color={themeStyles.accent} style={{ marginHorizontal: 8 }} />
          <View style={[styles.pageDividerLine, { backgroundColor: themeStyles.divider }]} />
        </View>

        {/* Articles Body - Scrollable inside the page sheet */}
        <ScrollView
          style={styles.pageArticlesScrollView}
          contentContainerStyle={styles.pageArticlesList}
          showsVerticalScrollIndicator={false}
          scrollEnabled={isInteractive}
        >
          {page.articles.map((art, aIdx) => (
            <View key={aIdx} style={[styles.articleCardBlock, { borderColor: themeStyles.divider }]}>
              <View style={styles.articleHeaderRow}>
                <View style={[styles.articleNumBadge, { backgroundColor: themeStyles.badgeBg }]}>
                  <Text style={[styles.articleNumBadgeText, { color: themeStyles.accent }]}>
                    {art.num}
                  </Text>
                </View>
                <Text style={[styles.articleTitleText, { color: themeStyles.textPrimary }]}>
                  {art.title}
                </Text>
                <TouchableOpacity
                  disabled={!isInteractive}
                  onPress={() => handleShareArticle(art)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="share-social-outline" size={15} color={themeStyles.textSecondary} />
                </TouchableOpacity>
              </View>

              <Text
                style={[
                  styles.articleContentText,
                  { color: themeStyles.textPrimary, fontSize, lineHeight: fontSize * 1.55 },
                ]}
              >
                {art.content}
              </Text>

              {/* Highlights pill list if available */}
              {art.highlights && (
                <View style={[styles.articleHighlightsBox, { backgroundColor: themeStyles.badgeBg }]}>
                  <Text style={[styles.articleHighlightsTitle, { color: themeStyles.accent }]}>
                    Asosiy kafolatlar:
                  </Text>
                  {art.highlights.map((hl, hlIdx) => (
                    <View key={hlIdx} style={styles.articleHighlightBulletRow}>
                      <Ionicons name="checkmark-circle" size={13} color="#16A34A" style={{ marginRight: 6, marginTop: 2 }} />
                      <Text style={[styles.articleHighlightText, { color: themeStyles.textPrimary }]}>
                        {hl}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </ScrollView>

        {/* Page Number Footer */}
        <View style={[styles.pageFooterRow, { borderTopColor: themeStyles.divider }]}>
          <Text style={[styles.pageNumberText, { color: themeStyles.textSecondary }]}>
            — {page.pageNumber}-bet / {KODEKS_PAGES.length} —
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.rootContainer, { backgroundColor: themeStyles.bg, paddingTop: insets.top }]}>
      <StatusBar style={theme === 'night' ? 'light' : 'dark'} />

      {/* ===================== 1. TOP HEADER ===================== */}
      <View style={[styles.headerBar, { borderBottomColor: themeStyles.divider }]}>
        <View style={styles.headerLeftCol}>
          <TouchableOpacity
            style={[styles.headerBackBtn, { backgroundColor: themeStyles.badgeBg }]}
            activeOpacity={0.7}
            onPress={onBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={20} color={themeStyles.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerTitlesBox}>
            <Text style={[styles.headerMainTitle, { color: themeStyles.textPrimary }]} numberOfLines={1}>
              Mehnat kodeksi
            </Text>
            <Text style={[styles.headerSubtitle, { color: themeStyles.textSecondary }]}>
              Yangi tahrir • 599 ta modda
            </Text>
          </View>
        </View>

        {/* Action Controls */}
        <View style={styles.headerRightActions}>
          {/* Theme switcher */}
          <TouchableOpacity
            style={[styles.headerActionBtn, { backgroundColor: themeStyles.badgeBg }]}
            onPress={() => {
              if (theme === 'sepia') setTheme('day');
              else if (theme === 'day') setTheme('night');
              else setTheme('sepia');
            }}
          >
            <Ionicons
              name={theme === 'night' ? 'moon' : theme === 'sepia' ? 'book-outline' : 'sunny'}
              size={17}
              color={themeStyles.textPrimary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* ===================== 2. SEGMENTED TABS ===================== */}
      <View style={[styles.tabBarContainer, { borderBottomColor: themeStyles.divider }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScrollContent}>
          {[
            { id: 'book', label: 'Online Kitob', icon: 'book' },
            { id: 'video', label: 'Video Sharh', icon: 'videocam' },
            { id: 'toc', label: 'Mundarija (Boblar)', icon: 'list' },
            { id: 'search', label: 'Moddalardan qidiruv', icon: 'search' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.tabPill,
                  isActive
                    ? [styles.tabPillActive, { backgroundColor: themeStyles.textPrimary }]
                    : [styles.tabPillInactive, { backgroundColor: themeStyles.badgeBg }],
                ]}
                activeOpacity={0.75}
                onPress={() => setActiveTab(tab.id as BookTab)}
              >
                <Ionicons
                  name={tab.icon as any}
                  size={14}
                  color={isActive ? (theme === 'night' ? '#0F172A' : '#FFFFFF') : themeStyles.textSecondary}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[
                    styles.tabPillText,
                    isActive
                      ? { color: theme === 'night' ? '#0F172A' : '#FFFFFF', fontWeight: '800' }
                      : { color: themeStyles.textSecondary },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ===================== 3. MAIN CONTENT VIEWS ===================== */}

      {/* VIEW A: REALISTIC ONLINE BOOK READER (FITS ONE SCREEN, NO SCROLLBAR) */}
      {activeTab === 'book' && (
        <View style={styles.bookNonScrollContainer}>
          {/* Solid 3D Book Frame */}
          <View
            {...panResponder.panHandlers}
            style={[
              styles.book3DWrapper,
              { backgroundColor: themeStyles.bookBorder },
            ]}
          >
            {/* Bookmark Ribbon */}
            {isBookmarked && (
              <TouchableOpacity
                style={styles.bookBookmarkRibbon}
                activeOpacity={0.8}
                onPress={() => handleToggleBookmark()}
              >
                <View style={styles.ribbonBody} />
                <View style={styles.ribbonTail} />
              </TouchableOpacity>
            )}

            {/* Pages Stack */}
            <View style={styles.bookPagesStack}>
              {!isTurning ? (
                <View style={[styles.bookPageSheet, { backgroundColor: themeStyles.pageBg }]}>
                  {renderBookPageSheet(currentPage, true)}
                </View>
              ) : (
                <>
                  {/* Bottom Underlying Page */}
                  <Animated.View
                    style={[
                      styles.bookPageSheet,
                      styles.bookPageSheetAbsolute,
                      { backgroundColor: themeStyles.pageBg },
                      turnDirection === 'forward' ? bottomPageForwardStyle : bottomPageBackwardStyle,
                    ]}
                  >
                    {renderBookPageSheet(
                      turnDirection === 'forward' ? KODEKS_PAGES[targetPageIdx] : currentPage,
                      false
                    )}
                  </Animated.View>

                  {/* Top Flipping Page */}
                  <Animated.View
                    style={[
                      styles.bookPageSheet,
                      styles.bookPageSheetAbsolute,
                      { backgroundColor: themeStyles.pageBg },
                      turnDirection === 'forward' ? topPageForwardStyle : topPageBackwardStyle,
                    ]}
                  >
                    {renderBookPageSheet(
                      turnDirection === 'forward' ? currentPage : KODEKS_PAGES[targetPageIdx],
                      false
                    )}
                    {/* Realistic Paper Curl Shadow */}
                    <Animated.View
                      pointerEvents="none"
                      style={[
                        StyleSheet.absoluteFill,
                        {
                          opacity: turnDirection === 'forward' ? topCurlShadowOpacity : topCurlShadowBackwardOpacity,
                          borderRadius: 14,
                          overflow: 'hidden',
                        },
                      ]}
                    >
                      <LinearGradient
                        colors={
                          turnDirection === 'forward'
                            ? ['transparent', 'rgba(0,0,0,0.03)', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.38)']
                            : ['rgba(0,0,0,0.35)', 'rgba(0,0,0,0.18)', 'rgba(0,0,0,0.03)', 'transparent']
                        }
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={StyleSheet.absoluteFill}
                      />
                    </Animated.View>
                  </Animated.View>
                </>
              )}
            </View>
          </View>

          {/* Book Bottom Turn Navigation Bar */}
          <View style={[styles.bookTurnNavBar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
            <TouchableOpacity
              style={[
                styles.bookTurnBtn,
                (currentPageIdx === 0 || isTurning) && styles.bookTurnBtnDisabled,
                { backgroundColor: themeStyles.pageBg, borderColor: themeStyles.cardBorder },
              ]}
              disabled={currentPageIdx === 0 || isTurning}
              onPress={() => handleTurnPage('backward')}
              activeOpacity={0.8}
            >
              <Ionicons
                name="arrow-back"
                size={15}
                color={currentPageIdx === 0 ? '#CBD5E1' : themeStyles.textPrimary}
                style={{ marginRight: 5 }}
              />
              <Text
                style={[
                  styles.bookTurnBtnText,
                  { color: currentPageIdx === 0 ? '#CBD5E1' : themeStyles.textPrimary },
                ]}
              >
                Oldingi bet
              </Text>
            </TouchableOpacity>

            {/* Page Jump Dots / Progress */}
            <View style={styles.bookPageDotsRow}>
              {KODEKS_PAGES.map((_, pDotIdx) => (
                <TouchableOpacity
                  key={pDotIdx}
                  disabled={isTurning}
                  onPress={() => {
                    if (pDotIdx === currentPageIdx || isTurning) return;
                    const dir = pDotIdx > currentPageIdx ? 'forward' : 'backward';
                    handleTurnPage(dir, pDotIdx);
                  }}
                  style={[
                    styles.bookPageDot,
                    pDotIdx === (isTurning ? targetPageIdx : currentPageIdx)
                      ? [styles.bookPageDotActive, { backgroundColor: themeStyles.textPrimary }]
                      : { backgroundColor: themeStyles.cardBorder },
                  ]}
                />
              ))}
            </View>

            <TouchableOpacity
              style={[
                styles.bookTurnBtn,
                (currentPageIdx === KODEKS_PAGES.length - 1 || isTurning) && styles.bookTurnBtnDisabled,
                { backgroundColor: themeStyles.pageBg, borderColor: themeStyles.cardBorder },
              ]}
              disabled={currentPageIdx === KODEKS_PAGES.length - 1 || isTurning}
              onPress={() => handleTurnPage('forward')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.bookTurnBtnText,
                  { color: currentPageIdx === KODEKS_PAGES.length - 1 ? '#CBD5E1' : themeStyles.textPrimary },
                ]}
              >
                Keyingi bet
              </Text>
              <Ionicons
                name="arrow-forward"
                size={15}
                color={currentPageIdx === KODEKS_PAGES.length - 1 ? '#CBD5E1' : themeStyles.textPrimary}
                style={{ marginLeft: 5 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* VIEW B: VIDEO SHARH PLAYER & OVERVIEW */}
      {activeTab === 'video' && (
        <ScrollView
          style={styles.bookScrollRoot}
          contentContainerStyle={[
            styles.bookScrollContent,
            { paddingBottom: Math.max(insets.bottom, 16) + 60 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Cinema Video Player */}
          <View style={styles.videoCinemaPlayerCard}>
            <Image source={videoLessonCover} style={styles.videoCinemaThumbImg} resizeMode="cover" />
            <LinearGradient
              colors={['rgba(15, 23, 42, 0.25)', 'rgba(10, 25, 47, 0.8)']}
              style={styles.videoCinemaGradient}
            >
              <View style={styles.videoPlayerTopBar}>
                <View style={styles.videoLiveBadge}>
                  <View style={styles.videoLiveDot} />
                  <Text style={styles.videoLiveText}>HD 1080p • Rasmiy sharh</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setVideoSpeed((prev) => (prev === '1.0x' ? '1.25x' : prev === '1.25x' ? '1.5x' : '1.0x'))}
                  style={styles.videoSpeedPill}
                >
                  <Text style={styles.videoSpeedPillText}>{videoSpeed}</Text>
                </TouchableOpacity>
              </View>

              {/* Big Center Play/Pause Button */}
              <TouchableOpacity
                style={styles.videoBigPlayBtn}
                activeOpacity={0.85}
                onPress={() => setVideoIsPlaying(!videoIsPlaying)}
              >
                <Ionicons
                  name={videoIsPlaying ? 'pause' : 'play'}
                  size={28}
                  color="#0F2644"
                  style={videoIsPlaying ? {} : { marginLeft: 3 }}
                />
              </TouchableOpacity>

              {/* Bottom Scrubber */}
              <View style={styles.videoPlayerBottomControls}>
                <View style={styles.videoTimelineTrack}>
                  <View style={[styles.videoTimelineElapsed, { width: videoIsPlaying ? '42%' : '0%' }]} />
                </View>
                <View style={styles.videoTimeRow}>
                  <Text style={styles.videoTimeText}>{videoIsPlaying ? '04:21 / 14:15' : '00:00 / 14:15'}</Text>
                  <Text style={styles.videoSubtitleLang}>Özbek tilida (subtitrlar)</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Video Title & Meta */}
          <Text style={[styles.videoPageTitle, { color: themeStyles.textPrimary }]}>
            Yangi Mehnat kodeksidagi asosiy islohotlar va xodimlar kafolatlari
          </Text>
          <Text style={[styles.videoPageDesc, { color: themeStyles.textSecondary }]}>
            Oliy Majlis Qonunçilik palatasi va Kambag‘allikni qisqartirish va bandlik vazirligi ekspertlarining rasmiy tuşuntiriş darsi.
          </Text>

          {/* Video Chapters Accordion */}
          <Text style={[styles.videoSectionHeading, { color: themeStyles.textPrimary }]}>
            Dars boblari va vaqtlari
          </Text>
          <View style={styles.videoChaptersList}>
            {[
              { time: '00:00', title: 'Kodeksning 7 ta asosiy qismi va falsafasi' },
              { time: '02:45', title: 'Mehnat şartnomasi va sinov muddatidagi yangiliklar' },
              { time: '06:10', title: '21 kalendar kunlik ta’til va ta’til puli kafolati' },
              { time: '09:30', title: 'Iş haqi keçiktirilganda penya undiriş tartibi' },
              { time: '12:05', title: 'Masofaviy (onlayn) işlash va xodimlar xavfsizligi' },
            ].map((chap, cIdx) => (
              <TouchableOpacity
                key={cIdx}
                style={[
                  styles.videoChapterItem,
                  videoChapterIdx === cIdx && styles.videoChapterItemActive,
                  { backgroundColor: themeStyles.pageBg, borderColor: themeStyles.cardBorder },
                ]}
                activeOpacity={0.8}
                onPress={() => {
                  setVideoChapterIdx(cIdx);
                  setVideoIsPlaying(true);
                }}
              >
                <View style={styles.videoChapterTimeBox}>
                  <Text style={styles.videoChapterTimeText}>{chap.time}</Text>
                </View>
                <Text
                  style={[
                    styles.videoChapterTitleText,
                    { color: themeStyles.textPrimary },
                    videoChapterIdx === cIdx && { fontWeight: '800' },
                  ]}
                >
                  {chap.title}
                </Text>
                <Ionicons
                  name={videoChapterIdx === cIdx ? 'volume-high' : 'play-circle-outline'}
                  size={18}
                  color={videoChapterIdx === cIdx ? '#D97706' : themeStyles.textSecondary}
                />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}

      {/* VIEW C: MUNDARIJA (TABLE OF CONTENTS) */}
      {activeTab === 'toc' && (
        <ScrollView
          style={styles.bookScrollRoot}
          contentContainerStyle={[
            styles.bookScrollContent,
            { paddingBottom: Math.max(insets.bottom, 16) + 60 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.tocMainHeading, { color: themeStyles.textPrimary }]}>
            Mundarija — 7 ta qism va asosiy boblar
          </Text>
          <Text style={[styles.tocSubHeading, { color: themeStyles.textSecondary }]}>
            Istalgan bobni tanlang — kitob sahifasi avtomatik oçiladi.
          </Text>

          <View style={styles.tocListContainer}>
            {KODEKS_PAGES.map((page, pIdx) => (
              <TouchableOpacity
                key={pIdx}
                style={[
                  styles.tocItemCard,
                  { backgroundColor: themeStyles.pageBg, borderColor: themeStyles.cardBorder },
                ]}
                activeOpacity={0.8}
                onPress={() => {
                  setCurrentPageIdx(pIdx);
                  setActiveTab('book');
                }}
              >
                <View style={styles.tocPageNumBadge}>
                  <Text style={styles.tocPageNumText}>{page.pageNumber}</Text>
                </View>
                <View style={styles.tocTextCol}>
                  <Text style={[styles.tocItemPart, { color: themeStyles.accent }]}>
                    {page.part}
                  </Text>
                  <Text style={[styles.tocItemTitle, { color: themeStyles.textPrimary }]}>
                    {page.chapter}
                  </Text>
                  <Text style={[styles.tocItemDesc, { color: themeStyles.textSecondary }]} numberOfLines={1}>
                    {page.title} ({page.articlesRange})
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={17} color={themeStyles.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}

      {/* VIEW D: SEARCH ARTICLES */}
      {activeTab === 'search' && (
        <ScrollView
          style={styles.bookScrollRoot}
          contentContainerStyle={[
            styles.bookScrollContent,
            { paddingBottom: Math.max(insets.bottom, 16) + 60 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Search Box */}
          <View style={[styles.searchBox, { backgroundColor: themeStyles.pageBg, borderColor: themeStyles.cardBorder }]}>
            <Ionicons name="search" size={18} color="#94A3B8" style={{ marginRight: 8 }} />
            <TextInput
              style={[styles.searchInput, { color: themeStyles.textPrimary }]}
              placeholder="Modda raqami yoki kalit sözni qidiring..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="close-circle" size={17} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>

          {/* Quick Search Chips */}
          <View style={styles.searchQuickChipsRow}>
            {['104-modda', '217-modda', '253-modda', '333-modda', 'Ta’til', 'Sinov'].map((chip, cIdx) => (
              <TouchableOpacity
                key={cIdx}
                style={[styles.searchChip, { backgroundColor: themeStyles.badgeBg }]}
                onPress={() => setSearchQuery(chip)}
              >
                <Text style={[styles.searchChipText, { color: themeStyles.textPrimary }]}>{chip}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Search Results */}
          <View style={styles.searchResultsContainer}>
            {searchQuery.trim().length === 0 ? (
              <View style={styles.searchEmptyBox}>
                <Ionicons name="search-outline" size={42} color="#94A3B8" style={{ marginBottom: 10 }} />
                <Text style={[styles.searchEmptyTitle, { color: themeStyles.textPrimary }]}>
                  Mehnat kodeksidan qidiruv
                </Text>
                <Text style={[styles.searchEmptyDesc, { color: themeStyles.textSecondary }]}>
                  Modda raqami (masalan, 105, 253, 333) yoki kalit sözlarni kiriting.
                </Text>
              </View>
            ) : searchResults.length === 0 ? (
              <View style={styles.searchEmptyBox}>
                <Ionicons name="alert-circle-outline" size={38} color="#94A3B8" style={{ marginBottom: 8 }} />
                <Text style={[styles.searchEmptyTitle, { color: themeStyles.textPrimary }]}>
                  Modda topilmadi
                </Text>
                <Text style={[styles.searchEmptyDesc, { color: themeStyles.textSecondary }]}>
                  Qidiruv sözini özgartirib köring.
                </Text>
              </View>
            ) : (
              searchResults.map((res, rIdx) => (
                <TouchableOpacity
                  key={rIdx}
                  style={[styles.searchResultCard, { backgroundColor: themeStyles.pageBg, borderColor: themeStyles.cardBorder }]}
                  activeOpacity={0.8}
                  onPress={() => {
                    setCurrentPageIdx(res.pageNumber - 1);
                    setActiveTab('book');
                  }}
                >
                  <View style={styles.searchResultHeader}>
                    <Text style={[styles.searchResultPageBadge, { color: themeStyles.accent }]}>
                      {res.pageNumber}-betda
                    </Text>
                    <Text style={[styles.searchResultRange, { color: themeStyles.textSecondary }]}>
                      {res.articlesRange}
                    </Text>
                  </View>
                  <Text style={[styles.searchResultTitle, { color: themeStyles.textPrimary }]}>
                    {res.title}
                  </Text>
                  <Text style={[styles.searchResultDesc, { color: themeStyles.textSecondary }]} numberOfLines={2}>
                    {res.articles[0]?.content}
                  </Text>
                  <View style={styles.searchResultJumpRow}>
                    <Text style={styles.searchResultJumpText}>Kitobda öqiş →</Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },

  // 1. Header
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  headerLeftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerBackBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  headerTitlesBox: {
    flex: 1,
  },
  headerMainTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: '600',
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerActionBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fontSizeBtnText: {
    fontSize: 12,
    fontWeight: '800',
  },

  // 2. Tab switcher
  tabBarContainer: {
    borderBottomWidth: 1,
    paddingVertical: 8,
  },
  tabScrollContent: {
    paddingHorizontal: 14,
    gap: 8,
  },
  tabPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 18,
  },
  tabPillActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  tabPillInactive: {},
  tabPillText: {
    fontSize: 12,
    fontWeight: '700',
  },

  // 3. Book Reader Styles
  bookNonScrollContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  bookScrollRoot: {
    flex: 1,
  },
  bookScrollContent: {
    paddingHorizontal: 14,
    paddingTop: 12,
  },

  // 3D Animated Book Frame
  book3DWrapper: {
    flex: 1,
    borderRadius: 16,
    padding: 3,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: 'rgba(0,0,0,0.08)',
    marginBottom: 6,
  },
  bookBookmarkRibbon: {
    position: 'absolute',
    top: -4,
    right: 24,
    zIndex: 10,
    alignItems: 'center',
  },
  ribbonBody: {
    width: 14,
    height: 30,
    backgroundColor: '#BE123C',
    shadowColor: '#BE123C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 3,
  },
  ribbonTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopWidth: 7,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#BE123C',
  },

  bookPagesStack: {
    flex: 1,
    position: 'relative',
    borderRadius: 14,
    overflow: 'hidden',
  },
  bookPageSheetAbsolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bookPageInnerFlex: {
    flex: 1,
  },

  bookPageSheet: {
    flex: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    position: 'relative',
    overflow: 'hidden',
  },

  pageTopMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderBottomWidth: 1,
    marginBottom: 8,
  },
  pageTopPartText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  pageChapterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  pageChapterBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  pageChapterBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  pageArticlesRangeText: {
    fontSize: 11,
    fontWeight: '600',
  },

  pageMainTitle: {
    fontSize: 19,
    fontWeight: '800',
    lineHeight: 25,
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 8,
  },

  pageDecorativeDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  pageDividerLine: {
    flex: 1,
    height: 1,
  },

  pageArticlesScrollView: {
    flex: 1,
  },
  pageArticlesList: {
    gap: 12,
    paddingBottom: 12,
  },
  articleCardBlock: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  articleHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  articleNumBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 8,
  },
  articleNumBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  articleTitleText: {
    fontSize: 13.5,
    fontWeight: '800',
    flex: 1,
  },
  articleContentText: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 8,
  },

  articleHighlightsBox: {
    padding: 10,
    borderRadius: 8,
    marginTop: 4,
  },
  articleHighlightsTitle: {
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 5,
  },
  articleHighlightBulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  articleHighlightText: {
    fontSize: 12,
    lineHeight: 16.5,
    flex: 1,
  },

  pageFooterRow: {
    borderTopWidth: 1,
    paddingTop: 8,
    alignItems: 'center',
    marginTop: 'auto',
  },
  pageNumberText: {
    fontSize: 11,
    fontWeight: '700',
  },

  // Turn page nav bar
  bookTurnNavBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  bookTurnBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  bookTurnBtnDisabled: {
    opacity: 0.35,
  },
  bookTurnBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  bookPageDotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3.5,
  },
  bookPageDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  bookPageDotActive: {
    width: 12,
    height: 5,
    borderRadius: 2.5,
  },

  // Video View Styles
  videoCinemaPlayerCard: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#0A192F',
    position: 'relative',
    marginBottom: 14,
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  videoLiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
    marginRight: 5,
  },
  videoLiveText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  videoSpeedPill: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  videoSpeedPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  videoBigPlayBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FEF08A',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  videoPlayerBottomControls: {
    width: '100%',
  },
  videoTimelineTrack: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 6,
  },
  videoTimelineElapsed: {
    height: '100%',
    backgroundColor: '#D97706',
  },
  videoTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  videoTimeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  videoSubtitleLang: {
    fontSize: 10,
    color: '#CBD5E1',
  },

  videoPageTitle: {
    fontSize: 17,
    fontWeight: '800',
    lineHeight: 23,
    marginBottom: 4,
  },
  videoPageDesc: {
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 14,
  },
  videoSectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 10,
  },
  videoChaptersList: {
    gap: 8,
  },
  videoChapterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
  },
  videoChapterItemActive: {
    borderColor: '#D97706',
  },
  videoChapterTimeBox: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 10,
  },
  videoChapterTimeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#B45309',
  },
  videoChapterTitleText: {
    fontSize: 12.5,
    flex: 1,
    paddingRight: 6,
  },

  // TOC Styles
  tocMainHeading: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 3,
  },
  tocSubHeading: {
    fontSize: 12,
    marginBottom: 14,
  },
  tocListContainer: {
    gap: 8,
  },
  tocItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  tocPageNumBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  tocPageNumText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  tocTextCol: {
    flex: 1,
    paddingRight: 6,
  },
  tocItemPart: {
    fontSize: 9.5,
    fontWeight: '800',
    marginBottom: 2,
  },
  tocItemTitle: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 2,
  },
  tocItemDesc: {
    fontSize: 11,
  },

  // Search Styles
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    paddingVertical: 0,
  },
  searchQuickChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  searchChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  searchChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  searchResultsContainer: {
    gap: 8,
  },
  searchEmptyBox: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  searchEmptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  searchEmptyDesc: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 17,
  },
  searchResultCard: {
    padding: 13,
    borderRadius: 14,
    borderWidth: 1,
  },
  searchResultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  searchResultPageBadge: {
    fontSize: 11,
    fontWeight: '800',
  },
  searchResultRange: {
    fontSize: 11,
    fontWeight: '600',
  },
  searchResultTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 3,
  },
  searchResultDesc: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 8,
  },
  searchResultJumpRow: {
    alignSelf: 'flex-start',
  },
  searchResultJumpText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0284C7',
  },
});
