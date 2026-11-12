import React, { useState, useMemo, useCallback } from 'react';
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

export interface IstemolchiQonuniKitobScreenProps {
  onBack: () => void;
  initialPage?: number;
}

export type BookTheme = 'sepia' | 'day' | 'night';
export type BookTab = 'book' | 'video' | 'toc' | 'search';

export interface BookArticle {
  num: string;
  title: string;
  content: string;
  highlights?: string[];
  advice?: string;
}

export interface BookPage {
  pageNumber: number;
  part: string;
  chapter: string;
  articlesRange: string;
  title: string;
  subtitle: string;
  articles: BookArticle[];
}

export const ISTEMOLCHI_QONUNI_PAGES: BookPage[] = [
  {
    pageNumber: 1,
    part: 'I QISM. UMUMIY QOIDALAR',
    chapter: '1-bob. Asosiy tushunchalar va tamoyillar',
    articlesRange: '1–4-moddalar',
    title: 'Iste’molchilarning asosiy huquqlari',
    subtitle: 'O‘zbekiston Respublikasining «Iste’molchilarning huquqlarini himoya qilish to‘g‘risida»gi Qonuni.',
    articles: [
      {
        num: '1-modda',
        title: 'Qonunning asosiy tushunchalari',
        content: 'Iste’molchi — shaxsiy iste’moli yoki boshqa maqsadlarda tovar sotib oluvchi, buyurtma beruvchi yoxud xizmatdan foydalanuvchi jismoniy shaxs. Sotuvchi — oldi-sotdi shartnomasi bo‘yicha tovar realizatsiya qiluvchi korxona yoki yakka tartibdagi tadbirkor.',
        highlights: [
          'Iste’molchi maqomi har bir fuqaroga qonun bilan berilgan daxlsiz huquqdir',
          'Tadbirkorlik faoliyati bilan bog‘liq bo‘lmagan shaxsiy ehtiyojlar qamrab olinadi',
          'Sotuvchi va ishlab chiqaruvchi qonun oldida to‘liq mas’uliyatli',
        ],
        advice: '💡 Shartnomada yoki kassa chekida «Tovar qaytarib olinmaydi» deb yozilgan bo‘lsa ham, bu yozuv qonunan o‘z-o‘zidan haqiqiy emas hisoblanadi.',
      },
      {
        num: '4-modda',
        title: 'Iste’molchilarning asosiy huquqlari',
        content: 'Iste’molchilar tovarlarni erkin tanlash, ularning xavfsizligi va tegishli sifatiga ega bo‘lish, to‘liq va haqqoniy axborot olish, nuqsonli tovar almashtirilishi yoki zararni undirish hamda huquq buzilganda sudga murojaat qilish huquqiga egadirlar.',
        highlights: [
          'Erkin tanlash va teng muomala huquqi',
          'Sog‘liq, hayot va atrof-muhit xavfsizligi kafolati',
          'Buzilgan huquqlarni davlat organlari va sud orqali tiklash',
        ],
      },
    ],
  },
  {
    pageNumber: 2,
    part: 'II QISM. TOVARLARNING SIFATI VA XAVFSIZLIGI',
    chapter: '2-bob. Tovarlar sifati va xavfsizligi',
    articlesRange: '5–8-moddalar',
    title: 'Sifatli va xavfsiz mahsulot olish huquqi',
    subtitle: 'Standartlar, sanitariya talablari va yaroqlilik muddatlari kafolati.',
    articles: [
      {
        num: '5-modda',
        title: 'Tovarning (ishning, xizmatning) tegishli sifati',
        content: 'Sotuvchi iste’molchiga sifati shartnomaga, me’yoriy hujjatlar va standart talablariga mos bo‘lgan tovarni topshirishi shart. Agar qonunda majburiy standartlar belgilangan bo‘lsa, tovar ana shu standartlarga to‘liq javob berishi lozim.',
        highlights: [
          'Standartlarga va texnik reglamentlarga muvofiqlik',
          'Sertifikat va muvofiqlik belgisini talab qilish huquqi',
          'Kafolatlangan sifat ko‘rsatkichlariga amal qilish',
        ],
        advice: '💡 Tovarni sotib olishdan oldin muvofiqlik sertifikati va sifat pasportini talab qilishga to‘liq haqlisiz. Sotuvchi uni ko‘rsatishga majbur.',
      },
      {
        num: '7-modda',
        title: 'Tovarning xavfsiz bo‘lish huquqi',
        content: 'Iste’molchi tovarning belgilangan xizmat (yaroqlilik) muddati davomida uning hayoti, sog‘lig‘i va mol-mulkiga ziyon yetkazmasdan xavfsiz bo‘lishiga haqlidir. Yaroqlilik muddati o‘tgan tovarlarni sotish qat’iyan man etiladi.',
        highlights: [
          'Yaroqlilik muddati o‘tgan tovar savdosi qat’iyan taqiqlanadi',
          'Xavfli tovarlar aniqlanganda savdodan darhol olinadi',
          'Yetkazilgan ziyon to‘liq hajmda undiriladi',
        ],
      },
    ],
  },
  {
    pageNumber: 3,
    part: 'II QISM. TOVARLARNING SIFATI VA XAVFSIZLIGI',
    chapter: '3-bob. Tovar va xizmat haqida axborot',
    articlesRange: '9–12-moddalar',
    title: 'To‘liq, aniq va ishonchli ma’lumot olish',
    subtitle: 'Narx peshtaxtasi, tovar yorliqlari va davlat tilidagi yo‘riqnoma talablari.',
    articles: [
      {
        num: '9-modda',
        title: 'Tovar haqidagi axborotga qo‘yiladigan talablar',
        content: 'Sotuvchi iste’molchiga tovar nomi, narxi, ishlab chiqaruvchi manzili, asosiy xususiyatlari, tarkibi, saqlash shartlari va foydalanish qoidalari haqida to‘liq va ishonchli axborotni o‘zbek tilida taqdim etishi shart.',
        highlights: [
          'Narx peshtaxtasidagi (tsennik) narxda sotish majburiy',
          'Davlat tilidagi to‘liq yorliq va qo‘llanma bo‘lishi shart',
          'Ishlab chiqaruvchi va importyorning yuridik manzili ko‘rsatilishi shart',
        ],
        advice: '💡 Agar peshtaxtadagi narx kassa chekidagidan arzonroq bo‘lsa, siz tovar uchun arzonroq — peshtaxtada ko‘rsatilgan narxda to‘lashga haqlisiz!',
      },
      {
        num: '12-modda',
        title: 'Noto‘g‘ri axborot uchun sotuvchining javobgarligi',
        content: 'Yetarli bo‘lmagan yoki noto‘g‘ri axborot berilishi oqibatida tovar sotib olingan taqdirda, iste’molchi shartnomani bekor qilishga va to‘langan pulni to‘liq qaytarib olishga, shuningdek yetkazilgan barcha zararni undirishga haqlidir.',
      },
    ],
  },
  {
    pageNumber: 4,
    part: 'III QISM. NUQSONLI TOVAR SOTILGANDA ISTE’MOLCHI TALABLARI',
    chapter: '4-bob. Nuqsonli tovar va almashtirish tartibi',
    articlesRange: '13–17-moddalar',
    title: 'Sifatsiz tovar sotilganda xaridorning huquqlari',
    subtitle: 'Tovarni almashtirish, bepul tuzatish va to‘langan pulni qaytarib olish qoidalari.',
    articles: [
      {
        num: '13-modda',
        title: 'Nuqsonli tovar sotilganda iste’molchi huquqlari',
        content: 'Iste’molchiga nuqsonli tovar sotilganda, u o‘z xohishiga ko‘ra quyidagilardan birini talab qilishga haqli: tovarni maqbul sifatlisiga almashtirish; xarid narxini mutanosib kamaytirish; nuqsonlarni bepul tuzatish; yoki shartnomani bekor qilib pulni to‘liq qaytarib olish.',
        highlights: [
          'Tanlov huquqi faqat iste’molchiga tegishlidir, sotuvchiga emas',
          'Chek yo‘qolgan taqdirda ham to‘lov ilovasi yoki guvohlar yetarli',
          'Og‘ir tovarlarni yetkazib berish va qaytarish sotuvchi hisobidan',
        ],
        advice: '💡 Sotuvchi «faqat ta’mirlaymiz, almashtirmaymiz» deyishga haqli emas. Qaysi talabni qo‘yishni (tuzatish, almashtirish yoki pulni qaytarish) xaridorning o‘zi tanlaydi.',
      },
      {
        num: '14-modda',
        title: 'Tovarni almashtirish muddatlari',
        content: 'Sotuvchi nuqsonli tovarni talab qilingan kundan e’tiboran 7 kun ichida almashtirib berishi shart. Agar tovar sifatini qo‘shimcha tekshirish (ekspertiza) zarur bo‘lsa — 20 kun ichida amalga oshiriladi.',
      },
      {
        num: '17-modda',
        title: 'Talablarni bajarmaganlik uchun qonuniy penya',
        content: 'Sotuvchi iste’molchining tovardagi nuqsonlarni bartaraf etish yoki almashtirish to‘g‘risidagi talablarini kechiktirgan har bir kun uchun tovar bahosining 1 foizi miqdorida penya to‘lashga majburdir.',
      },
    ],
  },
  {
    pageNumber: 5,
    part: 'III QISM. NUQSONLI TOVAR SOTILGANDA ISTE’MOLCHI TALABLARI',
    chapter: '5-bob. 14 kun ichida almashtirish va qaytarish',
    articlesRange: '18-modda & VM 75-son qarori',
    title: 'Sifatli nooziq-ovqat tovarini 14 kunda qaytarish',
    subtitle: 'O‘lchami, fasoni, rangi yoki komplektatsiyasi mos kelmaganda almashtirish kafolati.',
    articles: [
      {
        num: '18-modda',
        title: 'Tegishli sifatdagi tovarni almashtirish va qaytarish',
        content: 'Iste’molchi maqbul sifatdagi nooziq-ovqat tovarini sotib olgan kundan boshlab 14 kun ichida o‘xshash tovarga almashtirishga haqli. Agar sotuvchida almashtirish uchun mos tovar bo‘lmasa, xaridor tovarni qaytarib to‘langan pulni to‘liq olishga haqlidir.',
        highlights: [
          'Tovar ishlatilmagan va tovar ko‘rinishi saqlangan bo‘lishi lozim',
          'Fabrika yorliqlari, plombalari va xarid cheki bo‘lishi maqsadga muvofiq',
          'Kassa cheki yo‘qolgan bo‘lsa, guvohlar ko‘rsatmasi bilan isbotlanishi mumkin',
        ],
        advice: '💡 Tovar aynan 14 kalendar kuni ichida qaytarilishi kerak. Sotib olingan kun ushbu muddat hisobiga kirmaydi (ertasi kundan boshlab sanaladi).',
      },
      {
        num: 'VM 75-ilova',
        title: 'Qaytarib olinmaydigan sifatli tovarlar ro‘yxati',
        content: 'Quyidagi sifatli tovarlar 14 kun ichida qaytarilmaydi: dori vositalari va tibbiy buyumlar; ichki kiyimlar va paypoq mahsulotlari; shaxsiy gigiyena vositalari; parfyumeriya-kosmetika tovarlari; metr hisobida sotiladigan matolar.',
      },
    ],
  },
  {
    pageNumber: 6,
    part: 'IV QISM. KAFOLAT VA SERVIS XIZMATI',
    chapter: '6-bob. Kafolat (garantiya) muddatlari',
    articlesRange: '11, 15, 17-moddalar',
    title: 'Kafolat muddati va bepul ta’mirlash kafolati',
    subtitle: 'Nuqsonlarni 20 kunda bepul tuzatish va vaqtinchalik tovar berish majburiyati.',
    articles: [
      {
        num: '11-modda',
        title: 'Kafolat muddati hisoblanishi',
        content: 'Tovarning kafolat muddati tovar iste’molchiga sotilgan kundan boshlab hisoblanadi. Agar tovar mavsumiy xususiyatga ega bo‘lsa (poyabzal, kiyim-kechak), kafolat muddati tegishli mavsum boshlangan kundan e’tiboran boshlanadi.',
        highlights: [
          'Kafolat davrida barcha ta’mirlash va ehtiyot qismlar mutlaqo bepul',
          'Ta’mirlash muddati kafolat muddatiga qo‘shib uzaytiriladi',
          'Kafolat muddati belgilanmagan bo‘lsa — qonun bo‘yicha 6 oy hisoblanadi',
        ],
        advice: '💡 Agar kafolatdagi maishiy texnika (muzlatgich, telefon, kir yuvish mashinasi) ta’mirga topshirilsa, ta’mir davrida sotuvchi 3 kun ichida sizga vaqtinchalik foydalanish uchun xuddi shunday tovar berib turishi shart!',
      },
      {
        num: '15-modda',
        title: 'Nuqsonlarni bepul bartaraf etish muddati',
        content: 'Sotuvchi (ishlab chiqaruvchi yoki servis markazi) tovardagi nuqsonlarni iste’molchi talab qo‘ygan kundan boshlab ko‘pi bilan 20 kun ichida bepul bartaraf etishi shart.',
      },
    ],
  },
  {
    pageNumber: 7,
    part: 'V QISM. ISH VA XIZMAT KO‘RSATISH SOHASI',
    chapter: '7-bob. Xizmat ko‘rsatish va buyurtmalar',
    articlesRange: '19–22-moddalar',
    title: 'Xizmat ko‘rsatish sohasidagi iste’molchi huquqlari',
    subtitle: 'Ta’mirlash, maishiy xizmat, umumiy ovqatlanish, yetkazib berish va buyurtmalar.',
    articles: [
      {
        num: '19-modda',
        title: 'Xizmat ko‘rsatish muddatlarini buzganlik uchun javobgarlik',
        content: 'Ijrochi ishni bajarish yoki xizmat ko‘rsatish muddatlarini kechiktirsa, iste’molchi yangi muddat tayinlashi, ishni uchinchi shaxsga topshirib xarajatni undirishi yoki shartnomani bekor qilib barcha to‘lovlarni qaytarib olishga haqli.',
        highlights: [
          'Kechiktirilgan har bir kun/soat uchun xizmat bahosining 1 foizi miqdorida penya',
          'Ijrochi muddat buzilishida o‘z aybi yo‘qligini isbotlashi shart',
          'Iste’molchiga yetkazilgan barcha zararlar to‘liq hajmda qoplanadi',
        ],
        advice: '💡 Xizmat ko‘rsatish bo‘yicha har qanday buyurtma uchun kvitansiya, chek yoki shartnoma olishni unutmang. Bu keyinchalik huquqingizni tiklashning bosh kafolatidir.',
      },
      {
        num: '20-modda',
        title: 'Xizmatdagi nuqsonlarni bartaraf etish',
        content: 'Ko‘rsatilgan xizmatda nuqsonlar aniqlangan taqdirda, iste’molchi nuqsonlarni bepul bartaraf etishni, xizmat bahosini mutanosib kamaytirishni yoki ishni boshqatdan bepul bajarishni talab qilishga haqli.',
      },
    ],
  },
  {
    pageNumber: 8,
    part: 'VI QISM. HUQUQLARNI HIMOYALASH VA SUD',
    chapter: '8-bob. Raqobat qo‘mitasi va sud himoyasi',
    articlesRange: '23–30-moddalar',
    title: 'Shikoyat qilish, 1159 va davlat bojisiz sud',
    subtitle: 'Raqobatni rivojlantirish qo‘mitasi va fuqarolik sudlariga murojaat qilish tartibi.',
    articles: [
      {
        num: '23-modda',
        title: 'Iste’molchilar huquqlarini davlat tomonidan himoya qilish',
        content: 'O‘zbekiston Respublikasi Raqobatni rivojlantirish va iste’molchilar huquqlarini himoya qilish qo‘mitasi hamda uning hududiy organlari iste’molchilar huquqlari buzilishiga chek qo‘yadi va noqonuniy harakatlar bo‘yicha tadbirkorlarga majburiy ko‘rsatmalar beradi. Ishonch telefoni: 1159.',
        highlights: [
          '1159 ishonch telefoni orqali bepul tezkor qabul',
          'Qo‘mita iste’molchi nomidan sudlarga da’vo arizalari kiritish vakolatiga ega',
          'Iste’molchilar huquqlarini himoya qilish jamiyatlari federatsiyasi: 1091',
        ],
        advice: '💡 Agar sotuvchi talabingizni rad etsa, unga 10 kunlik muddat bilan yozma talabnoma (pretenziya) bering. Nusxasiga imzo qo‘ydirib oling yoki 1159 raqamiga qo‘ng‘iroq qiling.',
      },
      {
        num: '27-modda',
        title: 'Sud himoyasi va davlat bojidan 100% ozodlik',
        content: 'Iste’molchilar o‘z huquqlari buzilganligi to‘g‘risidagi da’volar bo‘yicha, shuningdek maxsus vakolatli davlat organlari iste’molchilarning manfaatlarini ko‘zlab da’vo qo‘zg‘atganda DAVLAT BOJI TO‘LASHDAN BUTUNLAY OZOD QILINADI.',
        highlights: [
          'Fuqarolik ishlari bo‘yicha sudlarda davlat boji to‘lanmaydi (0 so‘m)',
          'Sud jarayonida yurist xarajatlari ham yutqazgan sotuvchidan undiriladi',
          'Yetkazilgan moddiy zarardan tashqari ma’naviy zarar ham qoplanadi',
        ],
      },
    ],
  },
];

export const IstemolchiQonuniKitobScreen: React.FC<IstemolchiQonuniKitobScreenProps> = ({
  onBack,
  initialPage = 1,
}) => {
  const insets = useSafeAreaInsets();

  // Active Screen Mode
  const [activeTab, setActiveTab] = useState<BookTab>('book');
  const [theme, setTheme] = useState<BookTheme>('sepia');
  const fontSize = 15;

  const initialIdx = Math.max(0, Math.min(initialPage - 1, ISTEMOLCHI_QONUNI_PAGES.length - 1));
  const [currentPageIdx, setCurrentPageIdx] = useState<number>(initialIdx);
  const [prevInitialPage, setPrevInitialPage] = useState<number>(initialPage);

  if (initialPage !== prevInitialPage) {
    setPrevInitialPage(initialPage);
    setCurrentPageIdx(initialIdx);
  }

  const [bookmarkedPages, setBookmarkedPages] = useState<number[]>([1, 4, 5]);

  // Video State
  const [videoIsPlaying, setVideoIsPlaying] = useState<boolean>(false);
  const [videoSpeed, setVideoSpeed] = useState<'1.0x' | '1.25x' | '1.5x'>('1.0x');
  const [videoChapterIdx, setVideoChapterIdx] = useState<number>(0);

  // Search State
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Page Turn State & Smooth 3D Animation
  const [isTurning, setIsTurning] = useState<boolean>(false);
  const [turnDirection, setTurnDirection] = useState<'forward' | 'backward'>('forward');
  const [targetPageIdx, setTargetPageIdx] = useState<number>(0);
  const [turnAnim] = useState(() => new Animated.Value(0));

  // Turn page with smooth, realistic 3D paper curl and depth animation
  const handleTurnPage = useCallback(
    (direction: 'forward' | 'backward', customTargetIdx?: number) => {
      if (isTurning) return;

      let nextIdx = currentPageIdx;
      if (typeof customTargetIdx === 'number') {
        if (customTargetIdx === currentPageIdx || customTargetIdx < 0 || customTargetIdx >= ISTEMOLCHI_QONUNI_PAGES.length) return;
        nextIdx = customTargetIdx;
      } else if (direction === 'forward') {
        if (currentPageIdx >= ISTEMOLCHI_QONUNI_PAGES.length - 1) return;
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
    },
    [currentPageIdx, isTurning, turnAnim]
  );

  // Horizontal Swipe PanResponder for intuitive book page turning
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => {
          return (
            Math.abs(gestureState.dx) > 30 &&
            Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 2.2
          );
        },
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dx < -45) {
            handleTurnPage('forward');
          } else if (gestureState.dx > 45) {
            handleTurnPage('backward');
          }
        },
      }),
    [handleTurnPage]
  );

  const currentPage = ISTEMOLCHI_QONUNI_PAGES[currentPageIdx];
  const activeDisplayPage = isTurning ? ISTEMOLCHI_QONUNI_PAGES[targetPageIdx] : currentPage;
  const isBookmarked = bookmarkedPages.includes(activeDisplayPage.pageNumber);

  const handleToggleBookmark = (pageNumInput?: number) => {
    const pageNum = pageNumInput ?? activeDisplayPage.pageNumber;
    if (bookmarkedPages.includes(pageNum)) {
      setBookmarkedPages((prev) => prev.filter((p) => p !== pageNum));
      Alert.alert('Xatcho‘p o‘chirildi', `${pageNum}-bet xatcho‘plardan olib tashlandi.`);
    } else {
      setBookmarkedPages((prev) => [...prev, pageNum]);
      Alert.alert('Xatcho‘p qo‘shildi 🔖', `${pageNum}-bet xatcho‘plarga saqlandi.`);
    }
  };

  const handleShareArticle = async (article: BookArticle) => {
    try {
      await Share.share({
        title: article.title,
        message: `📘 «Iste’molchilar huquqlarini himoya qilish to‘g‘risida»gi Qonun\n${article.num}. ${article.title}\n\n${article.content}\n\nYordam ilovasi orqali ulashildi.`,
      });
    } catch {
      Alert.alert('Ulashish', 'Ulashish oynasi ochilmadi.');
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
      accent: '#B45309',
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
  const searchResults = ISTEMOLCHI_QONUNI_PAGES.filter((p) => {
    if (!searchQuery.trim()) return false;
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.chapter.toLowerCase().includes(q) ||
      p.articles.some(
        (a) =>
          a.num.toLowerCase().includes(q) ||
          a.title.toLowerCase().includes(q) ||
          a.content.toLowerCase().includes(q) ||
          (a.advice && a.advice.toLowerCase().includes(q))
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
          <FontAwesome5 name="shopping-bag" size={11} color={themeStyles.accent} style={{ marginHorizontal: 8 }} />
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

              {/* Practical Advice callout */}
              {art.advice && (
                <View style={[styles.articleAdviceBox, { backgroundColor: theme === 'night' ? '#1E293B' : '#FEF3C7', borderColor: theme === 'night' ? '#334155' : '#FDE68A' }]}>
                  <Text style={[styles.articleAdviceText, { color: theme === 'night' ? '#F8FAFC' : '#92400E' }]}>
                    {art.advice}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </ScrollView>

        {/* Page Number Footer */}
        <View style={[styles.pageFooterRow, { borderTopColor: themeStyles.divider }]}>
          <Text style={[styles.pageNumberText, { color: themeStyles.textSecondary }]}>
            — {page.pageNumber}-bet / {ISTEMOLCHI_QONUNI_PAGES.length} —
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
              Iste’molchi qonuni
            </Text>
            <Text style={[styles.headerSubtitle, { color: themeStyles.textSecondary }]}>
              O‘zR Qonuni • 30 ta modda
            </Text>
          </View>
        </View>

        {/* Action Controls */}
        <View style={styles.headerRightActions}>
          {/* Theme Switcher */}
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

      {/* VIEW A: REALISTIC ONLINE BOOK READER */}
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
                      turnDirection === 'forward' ? ISTEMOLCHI_QONUNI_PAGES[targetPageIdx] : currentPage,
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
                      turnDirection === 'forward' ? currentPage : ISTEMOLCHI_QONUNI_PAGES[targetPageIdx],
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
              {ISTEMOLCHI_QONUNI_PAGES.map((_, pDotIdx) => (
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
                (currentPageIdx === ISTEMOLCHI_QONUNI_PAGES.length - 1 || isTurning) && styles.bookTurnBtnDisabled,
                { backgroundColor: themeStyles.pageBg, borderColor: themeStyles.cardBorder },
              ]}
              disabled={currentPageIdx === ISTEMOLCHI_QONUNI_PAGES.length - 1 || isTurning}
              onPress={() => handleTurnPage('forward')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.bookTurnBtnText,
                  { color: currentPageIdx === ISTEMOLCHI_QONUNI_PAGES.length - 1 ? '#CBD5E1' : themeStyles.textPrimary },
                ]}
              >
                Keyingi bet
              </Text>
              <Ionicons
                name="arrow-forward"
                size={15}
                color={currentPageIdx === ISTEMOLCHI_QONUNI_PAGES.length - 1 ? '#CBD5E1' : themeStyles.textPrimary}
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
                  <Text style={styles.videoSubtitleLang}>O‘zbek tilida (subtitrlar)</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Video Title & Meta */}
          <Text style={[styles.videoPageTitle, { color: themeStyles.textPrimary }]}>
            Iste’molchilar huquqlarini himoya qilish: Xaridor bilishi kerak bo‘lgan 6 ta oltin qoida
          </Text>
          <Text style={[styles.videoPageDesc, { color: themeStyles.textSecondary }]}>
            Raqobatni rivojlantirish va iste’molchilar huquqlarini himoya qilish qo‘mitasi hamda Adliya vazirligi huquqshunoslarining amaliy videodarsi.
          </Text>

          {/* Video Chapters Accordion */}
          <Text style={[styles.videoSectionHeading, { color: themeStyles.textPrimary }]}>
            Dars boblari va vaqtlari
          </Text>
          <View style={styles.videoChaptersList}>
            {[
              { time: '00:00', title: 'Qonunning asosiy mazmuni va iste’molchining 6 ta asosiy huquqi' },
              { time: '02:30', title: 'Sifatli nooziq-ovqat mahsulotini 14 kunda qaytarish tartibi' },
              { time: '05:15', title: 'Kafolat (garantiya) muddati va servis markazi majburiyatlari' },
              { time: '08:40', title: 'Nuqsonli tovar ekspertizasi: xarajat kimning hisobidan?' },
              { time: '11:20', title: 'Sotuvchiga yozma talabnoma (pretenziya) va 1159 ishonch telefoni' },
              { time: '14:00', title: 'Sudga murojaat va davlat bojidan 100% ozod bo‘lish qoidalari' },
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
            Mundarija — 6 ta qism va 8 ta asosiy bob
          </Text>
          <Text style={[styles.tocSubHeading, { color: themeStyles.textSecondary }]}>
            Istalgan bobni tanlang — kitob sahifasi avtomatik ochiladi.
          </Text>

          <View style={styles.tocListContainer}>
            {ISTEMOLCHI_QONUNI_PAGES.map((page, pIdx) => (
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
              placeholder="Modda raqami yoki kalit so‘zni qidiring..."
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
            {['14-modda', '18-modda', 'Kafolat', '14 kun', 'Chek', 'Ekspertiza', '1159', 'Penya'].map((chip, cIdx) => (
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
                  Iste’molchi qonunidan qidiruv
                </Text>
                <Text style={[styles.searchEmptyDesc, { color: themeStyles.textSecondary }]}>
                  Modda raqami (masalan, 14, 18, 23) yoki kalit so‘zlarni kiriting.
                </Text>
              </View>
            ) : searchResults.length === 0 ? (
              <View style={styles.searchEmptyBox}>
                <Ionicons name="alert-circle-outline" size={38} color="#94A3B8" style={{ marginBottom: 8 }} />
                <Text style={[styles.searchEmptyTitle, { color: themeStyles.textPrimary }]}>
                  Modda topilmadi
                </Text>
                <Text style={[styles.searchEmptyDesc, { color: themeStyles.textSecondary }]}>
                  Qidiruv so‘zini o‘zgartirib ko‘ring.
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
                    <Text style={styles.searchResultJumpText}>Kitobda o‘qish →</Text>
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
  bookPageSheet: {
    flex: 1,
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
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },

  // Page Content Internals
  pageTopMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 6,
    borderBottomWidth: 1,
    marginBottom: 8,
  },
  pageTopPartText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  pageChapterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  pageChapterBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  pageChapterBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  pageArticlesRangeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  pageMainTitle: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.4,
    lineHeight: 22,
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 8,
  },
  pageDecorativeDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  pageDividerLine: {
    flex: 1,
    height: 1,
  },

  pageArticlesScrollView: {
    flex: 1,
  },
  pageArticlesList: {
    paddingBottom: 10,
    gap: 12,
  },
  articleCardBlock: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  articleHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  articleNumBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
    marginRight: 8,
  },
  articleNumBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  articleTitleText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
  },
  articleContentText: {
    marginBottom: 8,
  },
  articleHighlightsBox: {
    padding: 8,
    borderRadius: 8,
    marginTop: 4,
  },
  articleHighlightsTitle: {
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 4,
  },
  articleHighlightBulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 3,
  },
  articleHighlightText: {
    fontSize: 12,
    lineHeight: 16,
    flex: 1,
  },
  articleAdviceBox: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 6,
  },
  articleAdviceText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
  },

  pageFooterRow: {
    borderTopWidth: 1,
    paddingTop: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageNumberText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  // Turn Navigation Bar
  bookTurnNavBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
  },
  bookTurnBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  bookTurnBtnDisabled: {
    opacity: 0.4,
  },
  bookTurnBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  bookPageDotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  bookPageDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  bookPageDotActive: {
    width: 14,
    height: 6,
    borderRadius: 3,
  },

  // Video Section Styles
  videoCinemaPlayerCard: {
    height: 200,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#0F172A',
    marginBottom: 14,
  },
  videoCinemaThumbImg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
    paddingVertical: 4,
    borderRadius: 6,
  },
  videoLiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
    marginRight: 6,
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
    borderRadius: 6,
  },
  videoSpeedPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  videoBigPlayBtn: {
    alignSelf: 'center',
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  videoPlayerBottomControls: {
    gap: 4,
  },
  videoTimelineTrack: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  videoTimelineElapsed: {
    height: '100%',
    backgroundColor: '#F59E0B',
  },
  videoTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  videoTimeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  videoSubtitleLang: {
    fontSize: 10,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.7)',
  },
  videoPageTitle: {
    fontSize: 16,
    fontWeight: '900',
    lineHeight: 22,
    marginBottom: 6,
  },
  videoPageDesc: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 14,
  },
  videoSectionHeading: {
    fontSize: 14,
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
    borderRadius: 10,
    borderWidth: 1,
  },
  videoChapterItemActive: {
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
  },
  videoChapterTimeBox: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 10,
  },
  videoChapterTimeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#D97706',
  },
  videoChapterTitleText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
    marginRight: 8,
  },

  // TOC Styles
  tocMainHeading: {
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 4,
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
    borderRadius: 12,
    borderWidth: 1,
  },
  tocPageNumBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(217, 119, 6, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  tocPageNumText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#D97706',
  },
  tocTextCol: {
    flex: 1,
    marginRight: 8,
  },
  tocItemPart: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
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
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    paddingVertical: 0,
  },
  searchQuickChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  searchChip: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
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
    justifyContent: 'center',
    paddingVertical: 36,
  },
  searchEmptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  searchEmptyDesc: {
    fontSize: 12,
    textAlign: 'center',
  },
  searchResultCard: {
    padding: 12,
    borderRadius: 12,
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
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 4,
  },
  searchResultDesc: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 6,
  },
  searchResultJumpRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  searchResultJumpText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#D97706',
  },
});
