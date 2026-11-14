import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  Share,
  TextInput,
  Linking,
  Modal,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { IstemolchiQonuniKitobScreen } from './IstemolchiQonuniKitobScreen';

const { width } = Dimensions.get('window');

// Assets
const heroGraphic = require('../../assets/images/istemolchi_hero_graphic.png');
const mehnatAiRobot = require('../../assets/images/mehnat_ai_robot.png');

export type IstemolchiTab = 'home' | 'rights' | 'ai' | 'documents';

interface IstemolchiHuquqlariScreenProps {
  onBack: () => void;
}

export interface ConsumerDocTemplate {
  id: string;
  key: string;
  title: string;
  desc: string;
  type: string;
  typeColor: string;
  typeBg: string;
  legalRef: string;
  to: string;
  from: string;
  docTitle: string;
  content: string;
}

export const CONSUMER_DOC_TEMPLATES: ConsumerDocTemplate[] = [
  {
    id: 'd1',
    key: 'd1',
    title: 'Sotuvchiga tovar pulini qaytarish talabnomasi',
    desc: 'Nuqsonli tovar sotilganda pulni 10 kun ichida qaytarish haqida rasmiy e’tiroz xati.',
    type: 'Talabnoma',
    typeColor: '#DC2626',
    typeBg: '#FEE2E2',
    legalRef: '«Iste’molchilarning huquqlarini himoya qilish to‘g‘risida»gi Qonunning 13, 14, 17, 18-moddalari',
    to: '«DO‘KON / SOTUVCHI NOMI» rahbariyatiga',
    from: 'Iste’molchi: [F.I.Sh.]dan\nTelefon: [Telefon raqamingiz]\nManzil: [Yashash manzilingiz]',
    docTitle: 'TALABNOMA\n(Nuqsonli tovar uchun to‘langan pulni qaytarish to‘g‘risida)',
    content: 'Men tomonimdan [Sana] kuni sizning savdo do‘koningizdan [Tovar narxi] so‘m evaziga [Tovar nomi va modeli] sotib olingan (kassa cheki № [Chek raqami]).\n\nTovardan foydalanish jarayonida unda quyidagi jiddiy nuqsonlar aniqlandi: [Nuqson tavsifi].\n\nO‘zbekiston Respublikasining «Iste’molchilarning huquqlarini himoya qilish to‘g‘risida»gi Qonunining 13-moddasiga muvofiq, iste’molchiga nuqsonli tovar sotilganda, u shartnomani bekor qilishga va to‘langan pul summasini to‘liq qaytarib olishga haqlidir.\n\nShuningdek, ushbu Qonunning 17-moddasiga binoan, sotuvchi iste’molchining qonuniy talablarini kechiktirgan har bir kun uchun tovar narxining 1 foizi miqdorida penya to‘lashga majburdir.\n\nYuqoridagilarga asosan, TALAB QILAMAN:\n1. Nuqsonli tovar uchun to‘langan [Tovar narxi] so‘m mablag‘ni 10 kunlik muddatda to‘liq qaytarib berishingizni;\n2. Mablag‘ni quyidagi bank plastik kartasiga o‘tkazib berishingizni: [Karta yoki hisob raqami].\n\nAgar ushbu talabnoma 10 kun ichida qanoatlantirilmasa, O‘zbekiston Respublikasi Raqobatni rivojlantirish va iste’molchilar huquqlarini himoya qilish qo‘mitasiga (1159) hamda Fuqarolik ishlari bo‘yicha sudga moddiy va ma’naviy zararni hamda jarimalarni undirish bo‘yicha da’vo arizasi kiritilishini ma’lum qilaman.',
  },
  {
    id: 'd2',
    key: 'd2',
    title: 'Tovarni kafolat bo‘yicha bepul ta’mirlash talabnomasi',
    desc: 'Kafolat muddatida sifat buzilganda servis markazi va sotuvchiga yo‘llanadigan xat.',
    type: 'Ariza',
    typeColor: '#2563EB',
    typeBg: '#DBEAFE',
    legalRef: '«Iste’molchilarning huquqlarini himoya qilish to‘g‘risida»gi Qonunning 11, 15, 17-moddalari',
    to: '«SERVIS MARKAZI / DO‘KON NOMI» rahbariyatiga',
    from: 'Iste’molchi: [F.I.Sh.]dan\nTelefon: [Telefon raqamingiz]\nManzil: [Yashash manzilingiz]',
    docTitle: 'ARIZA\n(Kafolat muddati davomida nuqsonlarni bepul bartaraf etish haqida)',
    content: 'Men [Sana] kuni sizning do‘koningizdan kafolat muddati bilan [Tovar narxi] evaziga [Tovar nomi va modeli] xarid qilganman (Kafolat taloni № [Chek raqami]).\n\nKafolat muddati davrida tovardagi quyidagi kamchilik yuzaga keldi: [Nuqson tavsifi].\n\n«Iste’molchilarning huquqlarini himoya qilish to‘g‘risida»gi Qonunning 15-moddasiga muvofiq, tovardagi nuqsonlar sotuvchi (ishlab chiqaruvchi, ta’mirlash korxonasi) tomonidan talab qo‘yilgan kundan boshlab ko‘pi bilan 20 kun ichida bepul bartaraf etilishi shart.\n\nShuningdek, uzoq muddat foydalaniladigan tovarlar ta’mirlanayotgan davrda iste’molchiga 3 kun ichida tekinga foydalanib turish uchun xuddi shunday tovar berib turilishi shart.\n\nTALAB QILAMAN:\n1. Ushbu tovardagi nuqsonlarni 20 kun ichida bepul ta’mirlab berishingizni;\n2. Ta’mirlash davrida foydalanib turish uchun vaqtinchalik o‘xshash tovar taqdim etishingizni.\n\nTa’mirlash 20 kundan oshsa, tovar yangisiga almashtirilishi yoki puli to‘liq qaytarilishi shartligini eslatib o‘taman.',
  },
  {
    id: 'd3',
    key: 'd3',
    title: 'Raqobat qo‘mitasiga (1159) rasmiy shikoyat arizasi',
    desc: 'Sotuvchi qonuniy talablarni bajarmagan holatda davlat inspeksiyasiga shikoyat arizasi.',
    type: 'Şikoyat',
    typeColor: '#7C3AED',
    typeBg: '#EDE9FE',
    legalRef: '«Iste’molchilarning huquqlarini himoya qilish to‘g‘risida»gi Qonunning 23-moddasi',
    to: 'Raqobatni rivojlantirish va iste’molchilar huquqlarini himoya qilish qo‘mitasiga',
    from: 'Murojaatchi: [F.I.Sh.]dan\nTelefon: [Telefon raqamingiz]\nManzil: [Yashash manzilingiz]',
    docTitle: 'SHIKOYAT ARIZASI\n(Iste’molchi huquqlari buzilganligi holati yuzasidan)',
    content: 'Men [Sana] kuni [Do‘kon / Sotuvchi nomi] savdo shoxobchasidan [Tovar narxi] so‘mga [Tovar nomi] xarid qildim (kassa cheki: [Chek raqami]).\n\nTovarda nuqson aniqlangach, sotuvchiga qonuniy tartibda talabnoma bilan murojaat qildim. Biroq sotuvchi O‘zbekiston Respublikasining «Iste’molchilarning huquqlarini himoya qilish to‘g‘risida»gi Qonunining 13, 14, 18-moddalarini qo‘pol ravishda buzib, tovar sifatini bepul tekshirishdan va mablag‘ni qaytarishdan asossiz bosh tortdi.\n\nUshbu harakatlar iste’molchilarning qonun bilan qo‘riqlanadigan daxlsiz manfaatlariga zid keladi.\n\nYuqoridagilarga asosan, SIZDAN SO‘RAYMAN:\n1. «DO‘KON NOMI» mas’ul shaxslariga nisbatan qonunda belgilangan tartibda nazorat tadbirlarini o‘tkazishingizni;\n2. Menga yetkazilgan [Tovar narxi] so‘m moddiy zararni sotuvchidan undirib berishda amaliy yordam ko‘rsatishingizni;\n3. Qonunbuzilish holatlari bo‘yicha aybdor shaxslarga nisbatan qonuniy chora ko‘rishingizni.',
  },
  {
    id: 'd4',
    key: 'd4',
    title: 'Sudga da’vo arizasi (moddiy va ma’naviy zarar)',
    desc: 'Yetkazilgan moddiy zararni va ma’naviy kompensatsiyani undirish bo‘yicha sud da’vosi.',
    type: 'Da’vo',
    typeColor: '#D97706',
    typeBg: '#FEF3C7',
    legalRef: '«Iste’molchilarning huquqlarini himoya qilish to‘g‘risida»gi Qonunning 27, 29-moddalari, FPK',
    to: 'Fuqarolik ishlari bo‘yicha [Tuman / Shahar] tumanlararo sudiga',
    from: 'Da’vogar: [F.I.Sh.]dan\nTelefon: [Telefon raqamingiz]\nJavobgar: [Do‘kon / Sotuvchi nomi]',
    docTitle: 'DA’VO ARIZASI\n(Nuqsonli tovar bahosini, penya va ma’naviy zararni undirish to‘g‘risida)',
    content: 'Da’vo bahosi: [Jami da’vo summasi] so‘m\nDavlat boji: Qonunning 27-moddasiga asosan 0 so‘m (ozod qilingan)\n\nMen [Sana] kuni javobgardan [Tovar narxi] so‘mga [Tovar nomi] sotib olganman. Tovarda jiddiy nuqsonlar mavjudligi sababli javobgarga yozma talabnoma taqdim etganman, biroq javobgar qonuniy talablarni bajarmadi.\n\n«Iste’molchilarning huquqlarini himoya qilish to‘g‘risida»gi Qonunning 17-moddasiga binoan, kechiktirilgan har bir kun uchun 1% miqdorida penya hisoblanadi. Shuningdek, 29-moddaga muvofiq, iste’molchiga yetkazilgan ma’naviy zarar qoplanishi shart.\n\nYuqoridagilarga asosan, sudga murojaat qilib, SO‘RAYMAN:\n1. Javobgar [Do‘kon nomi]dan mening foydamga tovar uchun to‘langan [Tovar narxi] so‘m mablag‘ni;\n2. Talablarni kechiktirganlik uchun hisoblangan penya summasini;\n3. Yetkazilgan ma’naviy zarar kompensatsiyasini to‘liq undirib berishingizni.',
  },
];

const BANNER_WIDTH = width - 32;

export interface HeroBannerSlide {
  id: string;
  badge: string;
  badgeBg: string;
  badgeColor: string;
  titlePart1: string;
  titleGold: string;
  subtitle: string;
  ctaText: string;
  colors: [string, string, string];
  action: 'issues' | 'constructor' | 'authorities';
}

export const HERO_BANNER_SLIDES: HeroBannerSlide[] = [
  {
    id: 'slide_1',
    badge: 'Qonuniy kafolat',
    badgeBg: 'rgba(234, 179, 8, 0.25)',
    badgeColor: '#FDE047',
    titlePart1: 'Xaridor sifatida\nhuquqlaringizni biling\nva ',
    titleGold: 'himoya qiling',
    subtitle: 'Sifatsiz mahsulot, kafolat, qaytariş va boshqa muammolarda amaliy yordam.',
    ctaText: 'Muammom bor',
    colors: ['#07192F', '#0D274A', '#133563'],
    action: 'issues',
  },
  {
    id: 'slide_2',
    badge: '10 kunlik muddat',
    badgeBg: 'rgba(52, 211, 153, 0.25)',
    badgeColor: '#6EE7B7',
    titlePart1: 'Tovar uchun to‘langan\npulingizni 100%\n',
    titleGold: 'qaytarib oling!',
    subtitle: 'Nuqsonli tovar uchun do‘konga yuridik kuchga ega rasmiy talabnoma yozing.',
    ctaText: 'Talabnoma yozish',
    colors: ['#064E3B', '#047857', '#0F766E'],
    action: 'constructor',
  },
  {
    id: 'slide_3',
    badge: 'Davlat himoyasi',
    badgeBg: 'rgba(167, 139, 250, 0.25)',
    badgeColor: '#C4B5FD',
    titlePart1: 'Do‘kon talabingizni\nrad etdimi?\n',
    titleGold: '1159 ga qo‘ng‘iroq qiling',
    subtitle: 'Raqobat qo‘mitasi va rasmiy davlat organlariga bepul murojaat qiling.',
    ctaText: 'Tashkilotlar',
    colors: ['#3B0764', '#581C87', '#6D28D9'],
    action: 'authorities',
  },
];

export interface QuickIssueDetail {
  id: string;
  key: string;
  badge: string;
  badgeBg: string;
  badgeColor: string;
  icon: keyof typeof Ionicons.glyphMap;
  themeColor: string;
  title: string;
  subtitle: string;
  legalModda: string;
  legalQuote: string;
  consumerRights: string[];
  actionSteps: {
    step: number;
    title: string;
    desc: string;
  }[];
  warningBox: {
    title: string;
    text: string;
  };
  recommendedTemplateKey: string;
  targetBookPage: number;
  aiPromptSeed: string;
}

export const QUICK_ISSUES_DATA: QuickIssueDetail[] = [
  {
    id: 'sifatsiz',
    key: 'sifatsiz',
    badge: '13, 14, 17-moddalar',
    badgeBg: '#FFE4E6',
    badgeColor: '#E11D48',
    icon: 'cube-outline',
    themeColor: '#E11D48',
    title: 'Sifatsiz yoki nuqsonli tovar muammosi',
    subtitle: 'Zavod nuqsoni, kamchilik yoki yaroqsizlik aniqlanganda xaridorni himoya qilish.',
    legalModda: 'Qonunning 13-14-moddalari',
    legalQuote: 'Iste’molchiga nuqsonli tovar sotilganda, u shartnomani bekor qilishga va to‘langan pul summasini to‘liq qaytarib olishga yoki boshqa maqbul sifatlisiga almashtirib berishni talab qilishga haqli.',
    consumerRights: [
      'Pulingizni 10 kun ichida to‘liq qaytarib olish huquqi',
      'Tovarni xuddi shunday markadagi yangisiga almashtirish',
      'Nuqsonni sotuvchi hisobidan bepul tuzatib berish',
      'Har bir kechiktirilgan kun uchun 1% penya undirish',
    ],
    actionSteps: [
      { step: 1, title: 'Dalillarni to‘plang', desc: 'Kassa cheki, fotosurat, video va tovar qadog‘ini asrab qo‘ying. Agar chek yo‘qolgan bo‘lsa, bank ko‘chirmasi yoki guvohlar ko‘rsatmasi ham o‘tadi.' },
      { step: 2, title: 'Yozma talabnoma topshiring', desc: 'Og‘zaki aytilgan gap isbot bo‘lmaydi. Rasmiy 2 nusxada talabnoma yozib, bir nusxasiga do‘kondan qabul qilinganlik imzosini oling.' },
      { step: 3, title: 'Ekspertiza muddati (10 kun)', desc: 'Sotuvchi tovar sifatini tekshirish uchun ekspertizani o‘z hisobidan o‘tkazishi shart. Xaridor ekspertizada shaxsan qatnashishga haqli.' },
      { step: 4, title: 'Natija bermasa — 1159 yoki Sud', desc: 'Sotuvchi 10 kunda talabni bajarmasa, Raqobat qo‘mitasiga (1159) murojaat qilinadi va sud orqali ma’naviy zarar ham undiriladi.' },
    ],
    warningBox: {
      title: 'Muhim qonuniy eslatma!',
      text: 'Do‘kon ma’muriyatining «Mahsulot qaytarib olinmaydi» yoki «Cheksiz tovar qabul qilinmaydi» degan ogohlantirishlari qonunga zid va hech qanday yuridik kuchga ega emas!',
    },
    recommendedTemplateKey: 'd1',
    targetBookPage: 4,
    aiPromptSeed: 'Do‘kondan olgan tovarim sifatsiz chiqdi, sotuvchi pulimni qaytarmayapti. Qanday qonuniy choralar ko‘rsam bo‘ladi?',
  },
  {
    id: 'kafolat',
    key: 'kafolat',
    badge: '11, 15, 17-moddalar',
    badgeBg: '#DBEAFE',
    badgeColor: '#2563EB',
    icon: 'shield-checkmark-outline',
    themeColor: '#2563EB',
    title: 'Kafolat (garantiya) davridagi muammo',
    subtitle: 'Kafolat muddati tugamasdan buyum buzilganda servis markazi va do‘kon majburiyatlari.',
    legalModda: 'Qonunning 15-moddasi',
    legalQuote: 'Kafolat muddati davrida tovardagi nuqsonlar sotuvchi (ta’mirlash korxonasi) tomonidan talab qo‘yilgan kundan boshlab ko‘pi bilan 20 kun ichida bepul bartaraf etilishi shart.',
    consumerRights: [
      '20 kun ichida bepul va sifatli ta’mirlab berish majburiyati',
      'Ta’mirlash davrida 3 kun ichida vaqtinchalik o‘xshash tovardan bepul foydalanib turish',
      'Ta’mir 20 kundan oshsa — to‘liq yangisiga almashtirish yoki pulni 100% qaytarish',
      'Kafolat muddatini ta’mirlashda yotgan kunlarga teng muddatga uzaytirish',
    ],
    actionSteps: [
      { step: 1, title: 'Kafolat talonini tayyorlang', desc: 'Xarid sanasi va do‘kon muhri bosilgan kafolat talonini oling.' },
      { step: 2, title: 'Topshirish dalolatnomasini (akt) oling', desc: 'Servis markaziga tovar topshirilayotganda topshirilgan sana va tashqi holati ko‘rsatilgan qabul kvitansiyasini oling.' },
      { step: 3, title: 'Vaqtinchalik tovar talab qiling', desc: 'Telefon, muzlatgich yoki kir yuvish mashinasi ta’mirlanayotganda 3 kun ichida foydalanib turish uchun bepul shunday tovar talab qiling.' },
      { step: 4, title: '20 kundan oshsa yangisini talab qiling', desc: '20 kun ichida tuzatib berilmasa, qonun bo‘yicha tovar yangisiga almashtiriladi yoki puli to‘liq qaytariladi.' },
    ],
    warningBox: {
      title: 'Ehtiyot qismlar bahonasi!',
      text: 'Servis markazining «Ehtiyot qism yo‘q, chet eldan kelyapti» degan bahonasi 20 kunlik qonuniy muddatni to‘xtatmaydi!',
    },
    recommendedTemplateKey: 'd2',
    targetBookPage: 6,
    aiPromptSeed: 'Kafolatdagi texnikam buzildi, servis markazi 1 oydan beri tuzatmayapti. Qanday ariza berishim kerak?',
  },
  {
    id: 'qaytarish',
    key: 'qaytarish',
    badge: '18-modda',
    badgeBg: '#DCFCE7',
    badgeColor: '#16A34A',
    icon: 'sync-outline',
    themeColor: '#16A34A',
    title: 'Tovarni qaytarish yoki almashtirish',
    subtitle: 'Maqbul sifatli buyum yoqmaganda (10 kun) yoki nuqsonli tovar sotilganda pulni qaytarish.',
    legalModda: 'Qonunning 18-moddasi',
    legalQuote: 'Iste’molchi nooziq-ovqat tovarini sotib olgan kundan e’tiboran 10 kun ichida maqbul sifatlisiga almashtirib olishga, bunday tovar sotuvda bo‘lmasa, to‘langan pulni qaytarib olishga haqlidir.',
    consumerRights: [
      '10 kun ichida sabab ko‘rsatmasdan ham almashtirish (o‘lchami, fasoni, rangi mos kelmasa)',
      'Do‘konda mos tovar bo‘lmasa — pulni darhol 100% qaytarib olish',
      'Sotuvchi chek yo‘qligini bahona qilib qaytarishdan bosh tortishi qonunan taqiqlanadi',
      'Plastik karta yoki naqd shaklda to‘langan mablag‘ to‘liq qaytarilishi shart',
    ],
    actionSteps: [
      { step: 1, title: '10 kunlik muddatni o‘tkazmang', desc: 'Xarid qilingan kun hisobga olinmaydi, hisob ertasi kundan boshlanadi.' },
      { step: 2, title: 'Tovar ko‘rinishini saqlang', desc: 'Tovar ishlatilmagan, yorliqlari (etiketka), plombalari va qadog‘i butun bo‘lishi lozim.' },
      { step: 3, title: 'Do‘konga murojaat qiling', desc: 'Kassa cheki yoki to‘lov skrinshoti bilan do‘konga boring.' },
      { step: 4, title: 'Qaytarmasa — Talabnoma bering', desc: 'Agar sotuvchi rad etsa, ilovadagi tayyor talabnomani imzolab topshiring.' },
    ],
    warningBox: {
      title: 'Istisno tovarlar!',
      text: 'Vazirlar Mahkamasi ro‘yxatiga asosan dori-darmonlar, shaxsiy gigiyena vositalari, paypoq-ichki kiyimlar sifatli bo‘lsa qaytarilmaydi (faqat nuqsoni bo‘lsa qaytariladi).',
    },
    recommendedTemplateKey: 'd1',
    targetBookPage: 5,
    aiPromptSeed: 'Kiyim sotib olgandim, o‘lchami to‘g‘ri kelmadi. Do‘kon qaytarib olmayman deyapti, nima qilishim kerak?',
  },
  {
    id: 'xizmat',
    key: 'xizmat',
    badge: '19, 20, 21-moddalar',
    badgeBg: '#FEF3C7',
    badgeColor: '#D97706',
    icon: 'headset-outline',
    themeColor: '#D97706',
    title: 'Xizmat sifati va boshqa muammolar',
    subtitle: 'Yetkazib berish kechikishi, sifatsiz ta’mirlash, kommunal va servis xizmatlari.',
    legalModda: 'Qonunning 19-moddasi',
    legalQuote: 'Ijrochi ishni bajarish (xizmat ko‘rsatish) shartnomasida belgilangan muddatda, hajmda va tegishli sifatda amalga oshirishi shart. Muddat buzilganda har bir kun uchun 3% penya to‘laydi.',
    consumerRights: [
      'Kechiktirilgan har bir kun uchun xizmat narxining 3% miqdorida penya',
      'Kamchiliklarni ijrochi hisobidan bepul qayta bartaraf etish',
      'Yetkazilgan zararni va boy berilgan foydani to‘liq undirish',
      'Xizmatdan voz kechib, to‘langan avansni to‘liq qaytarib olish',
    ],
    actionSteps: [
      { step: 1, title: 'Shartnoma va kvitansiyani tekshiring', desc: 'Xizmat muddati, kafolatlari va to‘lov summasi ko‘rsatilgan hujjatni toping.' },
      { step: 2, title: 'Kamchiliklar aktini tuzing', desc: 'Bajarilmagan ishlar yoki kechikish yuzasidan dalolatnoma tuzing yoki foto/video oling.' },
      { step: 3, title: 'Rasmiy e’tiroz xati yo‘llang', desc: 'Xizmat ijrochisiga penya hisoblangan rasmiy talabnoma taqdim eting.' },
      { step: 4, title: 'Raqobat qo‘mitasiga murojaat', desc: '1159 raqami orqali shikoyat arizasi qoldiring yoki sudga da’vo kiriting.' },
    ],
    warningBox: {
      title: 'Majburiy xizmatlar taqiqlanadi!',
      text: 'Sizga ruxsatingizsiz qo‘shilgan pullik xizmatlar (masalan, servis to‘lovi, qo‘shimcha sug‘urta) noqonuniy hisoblanadi va to‘liq qaytarilishi shart.',
    },
    recommendedTemplateKey: 'd3',
    targetBookPage: 7,
    aiPromptSeed: 'Usta uyni ta’mirlashni 2 oyga kechiktirdi, qanday qonuniy jarima va kompensatsiya talab qilsam bo‘ladi?',
  },
];

export interface ConsumerProofItem {
  id: string;
  type: 'receipt' | 'warranty' | 'photo' | 'other';
  title: string;
  store: string;
  date: string;
  price?: string;
  receiptNum?: string;
  note: string;
  status: string;
}

export interface AuthorityItem {
  id: string;
  name: string;
  short: string;
  roleBadge: string;
  category: 'komitet' | 'federatsiya' | 'ses' | 'standart' | 'sud';
  badgeBg: string;
  themeColor: string;
  icon: keyof typeof Ionicons.glyphMap;
  callNum: string;
  web: string;
  address: string;
  hours: string;
  scope: string;
  docTemplateKey?: string;
}

export const AUTHORITIES_LIST: AuthorityItem[] = [
  {
    id: 'auth_1',
    name: 'Raqobatni rivojlantirish va iste’molchilar huquqlarini himoya qilish qo‘mitasi',
    short: '1159',
    roleBadge: 'Bosh vakolatli davlat organi',
    category: 'komitet',
    badgeBg: '#FEE2E2',
    themeColor: '#DC2626',
    icon: 'shield-checkmark',
    callNum: '1159',
    web: 'raqobat.gov.uz',
    address: 'Toshkent sh., Labzak ko‘chasi, 3-uy',
    hours: 'Dush - Juma: 09:00 - 18:00 (13:00 - 14:00 tushlik)',
    scope: 'Do‘kon pulni qaytarmasa, sifatsiz tovar sotilsa, sun’iy narx oshirilishi, aldamchi reklama yoki monopoliyaga qarshi qat’iy davlat nazorati.',
    docTemplateKey: 'd3',
  },
  {
    id: 'auth_2',
    name: 'O‘zbekiston iste’molchilar huquqlarini himoya qilish jamiyatlari federatsiyasi',
    short: '1091',
    roleBadge: 'Jamoatchilik himoyasi',
    category: 'federatsiya',
    badgeBg: '#DBEAFE',
    themeColor: '#2563EB',
    icon: 'people',
    callNum: '1091',
    web: 'istemol.uz',
    address: 'Toshkent sh., Navoiy ko‘chasi, 16-uy',
    hours: 'Dush - Juma: 09:00 - 18:00',
    scope: 'Iste’molchilar manfaatlarini sudlarda bepul himoya qilish, ekspertizalar o‘tkazish va nizolarni tinch yo‘l bilan hal qilish.',
  },
  {
    id: 'auth_3',
    name: 'Sanitariya-epidemiologik osoyishtalik qo‘mitasi (SES)',
    short: '+998 71 276-58-75',
    roleBadge: 'Oziq-ovqat va salomatlik',
    category: 'ses',
    badgeBg: '#DCFCE7',
    themeColor: '#16A34A',
    icon: 'nutrition',
    callNum: '+998712765875',
    web: 'sanepid.uz',
    address: 'Toshkent sh., Chilonzor tumani, Bunyodkor ko‘chasi, 46-uy',
    hours: '24/7 Navbatchilik xizmati',
    scope: 'Muddati o‘tgan oziq-ovqat, sifatsiz dori-darmonlar, sanitariya-gigiyena talablari buzilgan restoran va oshxonalar nazorati.',
  },
  {
    id: 'auth_4',
    name: 'O‘zbekiston texnik jihatdan tartibga solish agentligi (UzTest)',
    short: '1200',
    roleBadge: 'Standart va sertifikat',
    category: 'standart',
    badgeBg: '#EDE9FE',
    themeColor: '#7C3AED',
    icon: 'ribbon',
    callNum: '1200',
    web: 'standart.uz',
    address: 'Toshkent sh., Farobiy ko‘chasi, 333-A uy',
    hours: 'Dush - Juma: 09:00 - 18:00',
    scope: 'Xavfsizlik talablariga mos kelmaydigan texnikalar, soxta sertifikatlar, metrologiya va nosoz tarozilar yuzasidan tekshiruvlar.',
  },
  {
    id: 'auth_5',
    name: 'Fuqarolik ishlari bo‘yicha tumanlararo sudlari',
    short: '1100 (Sud ishonch telefoni)',
    roleBadge: 'Yakuniy sud himoyasi (Boj 0 so‘m)',
    category: 'sud',
    badgeBg: '#F1F5F9',
    themeColor: '#0F172A',
    icon: 'business',
    callNum: '1100',
    web: 'my.sud.uz',
    address: 'Yashash joyingizdagi tuman Fuqarolik ishlari bo‘yicha sudi',
    hours: 'Dush - Juma: 09:00 - 18:00',
    scope: 'Yetkazilgan moddiy va ma’naviy zararni undirish. Qonunning 27-moddasiga ko‘ra iste’molchilar sudlarda davlat boji to‘lashdan 100% ozod etilgan.',
    docTemplateKey: 'd4',
  },
];

export const IstemolchiHuquqlariScreen: React.FC<IstemolchiHuquqlariScreenProps> = ({ onBack }) => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<IstemolchiTab>('home');
  const [heroSlideIdx, setHeroSlideIdx] = useState<number>(0);
  const bannerScrollRef = useRef<any>(null);

  // Online Book Screen State
  const [showKitob, setShowKitob] = useState<boolean>(false);
  const [kitobInitialPage, setKitobInitialPage] = useState<number>(1);

  // Sub-screens States
  const [selectedQuickIssue, setSelectedQuickIssue] = useState<QuickIssueDetail | null>(null);
  const [showProofsScreen, setShowProofsScreen] = useState<boolean>(false);
  const [showAuthoritiesScreen, setShowAuthoritiesScreen] = useState<boolean>(false);

  // Proofs States
  const [proofsList, setProofsList] = useState<ConsumerProofItem[]>([
    {
      id: 'p1',
      type: 'receipt',
      title: 'Samsung Galaxy A54 kassa cheki',
      store: 'MediaPark Bozori',
      date: '15.10.2026',
      price: '3 850 000 so‘m',
      receiptNum: '№ 482910',
      note: 'QR-kodli fiskal kassa cheki saqlangan, to‘lov plastik karta orqali amalga oshirilgan.',
      status: 'Asl nusxa saqlangan',
    },
    {
      id: 'p2',
      type: 'warranty',
      title: 'Artel muzlatgich kafolat taloni',
      store: 'Artel rasmiy dileri',
      date: '20.06.2026',
      price: '5 200 000 so‘m',
      receiptNum: 'Kafolat taloni № AR-9921',
      note: '3 yillik rasmiy kafolat muddati belgilangan, xarid muhri mavjud.',
      status: 'Amalda (2029-yilgacha)',
    },
    {
      id: 'p3',
      type: 'photo',
      title: 'Zavod nuqsoni va ekran nosozligi surati',
      store: 'Texnomart Chilonzor',
      date: '02.11.2026',
      price: '1 450 000 so‘m',
      receiptNum: 'Kassa cheki №TX-7731',
      note: 'Qadoq ochilishi jarayonida aniqlangan zavod nuqsoni fotosuratlari.',
      status: 'Dalil biriktirilgan',
    },
  ]);
  const [proofFilter, setProofFilter] = useState<'all' | 'receipt' | 'warranty' | 'photo'>('all');
  const [isAddProofModalVisible, setIsAddProofModalVisible] = useState<boolean>(false);
  const [selectedProofDetail, setSelectedProofDetail] = useState<ConsumerProofItem | null>(null);

  // New proof form inputs
  const [newProofType, setNewProofType] = useState<'receipt' | 'warranty' | 'photo' | 'other'>('receipt');
  const [newProofTitle, setNewProofTitle] = useState<string>('');
  const [newProofStore, setNewProofStore] = useState<string>('');
  const [newProofPrice, setNewProofPrice] = useState<string>('');
  const [newProofReceiptNum, setNewProofReceiptNum] = useState<string>('');
  const [newProofNote, setNewProofNote] = useState<string>('');

  // Authorities search & filter
  const [authoritiesSearchQuery, setAuthoritiesSearchQuery] = useState<string>('');
  const [authoritiesCategory, setAuthoritiesCategory] = useState<
    'all' | 'komitet' | 'federatsiya' | 'ses' | 'standart' | 'sud'
  >('all');

  // Document Preview & Constructor States
  const [previewDoc, setPreviewDoc] = useState<ConsumerDocTemplate | null>(null);
  const [isConstructorVisible, setIsConstructorVisible] = useState<boolean>(false);
  const [constructorDocKey, setConstructorDocKey] = useState<string>('d1');
  const [constructorTab, setConstructorTab] = useState<'form' | 'preview'>('form');

  // Constructor Form State
  const [constructorForm, setConstructorForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    sellerName: '',
    productName: '',
    purchaseDate: '12-mart, 2025-yil',
    price: '',
    receiptNumber: '',
    defectDesc: '',
    bankAccount: '',
  });

  // Handle Header Back - Sub-screens, Preview, Konstruktor yoki Xizmatlar sahifasiga qaytish
  const handleHeaderBack = () => {
    if (selectedQuickIssue) {
      setSelectedQuickIssue(null);
      return;
    }
    if (showProofsScreen) {
      setShowProofsScreen(false);
      return;
    }
    if (showAuthoritiesScreen) {
      setShowAuthoritiesScreen(false);
      return;
    }
    if (previewDoc) {
      setPreviewDoc(null);
      return;
    }
    if (isConstructorVisible) {
      setIsConstructorVisible(false);
      return;
    }
    onBack();
  };

  const handleCallPhone = (phoneNum: string) => {
    const cleanNum = phoneNum.replace(/[^0-9+]/g, '');
    Linking.openURL(`tel:${cleanNum}`).catch(() => {
      Alert.alert('Aloqa', `${phoneNum} raqamiga qo‘ng‘iroq qilib bo‘lmadi.`);
    });
  };

  const handleOpenWebsite = (url: string) => {
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;
    Linking.openURL(fullUrl).catch(() => {
      Alert.alert('Sayt', `${url} sahifasini ochib bo‘lmadi.`);
    });
  };

  const handleOpenConstructor = (doc?: ConsumerDocTemplate) => {
    if (doc) {
      setConstructorDocKey(doc.id || 'd1');
    }
    setConstructorTab('form');
    setIsConstructorVisible(true);
    setPreviewDoc(null);
  };

  const getGeneratedDocText = () => {
    const fName = constructorForm.fullName.trim() || 'Aliyev Vali Anvar o‘g‘li';
    const phone = constructorForm.phone.trim() || '+998 90 123 45 67';
    const addr = constructorForm.address.trim() || 'Toshkent shahri, Yunusobod tumani';
    const seller = constructorForm.sellerName.trim() || '«MEDIAPARK BOZORI» MChJ';
    const product = constructorForm.productName.trim() || 'Samsung Galaxy A55 smartfoni';
    const date = constructorForm.purchaseDate.trim() || '12-mart, 2025-yil';
    const price = constructorForm.price.trim() || '4 200 000 so‘m';
    const receipt = constructorForm.receiptNumber.trim() || '№ 482910-chek';
    const defect = constructorForm.defectDesc.trim() || 'Tovarning ekrani to‘satdan o‘chib qolgan va qayta yonmayapti, zaryad olmayapti';
    const bank = constructorForm.bankAccount.trim() || '8600 1234 5678 9012 (Humo/Uzcard)';

    if (constructorDocKey === 'd2') {
      return {
        to: `${seller} rahbariyatiga hamda rasmiy servis markaziga`,
        from: `Iste’molchi: ${fName}\nTelefon: ${phone}\nManzil: ${addr}`,
        title: 'KAFOLAT BO‘YICHA BEPUL TA’MIRLASH HAQIDA ARIZA',
        legalRef: '«Iste’molchilar huquqlarini himoya qilish to‘g‘risida»gi Qonunning 11, 15, 17-moddalari',
        body: `Men tomonimdan ${date} kuni sizning savdo do‘koningizdan kafolat muddati bilan ${price} evaziga ${product} sotib olingan (Kafolat taloni ${receipt}).\n\nKafolat muddati davrida ushbu tovardan foydalanish vaqtida quyidagi nuqson yuzaga keldi: ${defect}.\n\nO‘zbekiston Respublikasining «Iste’molchilarning huquqlarini himoya qilish to‘g‘risida»gi Qonunining 15-moddasiga muvofiq, kafolat muddati o‘tmagan tovardagi nuqsonlar sotuvchi yoki servis markazi tomonidan iste’molchi talab qo‘ygan kundan boshlab ko‘pi bilan 20 kun ichida bepul bartaraf etilishi shart.\n\nShuningdek, qonunchilikka ko‘ra, uzoq muddat foydalaniladigan tovarlar ta’mirga qabul qilinganda, iste’molchining talabi bilan unga 3 kun ichida vaqtinchalik foydalanib turish uchun xuddi shunday tovar bepul berib turilishi shart.\n\nYuqoridagilardan kelib chiqib, TALAB QILAMAN:\n1. Ushbu ${product} tovaridagi nuqsonlarni qonunda belgilangan 20 kunlik muddatda bepul ta’mirlab berishingizni;\n2. Ta’mirlash davomida foydalanib turish uchun vaqtinchalik mos tovar taqdim etishingizni.\n\nUshbu talablar 20 kun ichida bajarilmagan taqdirda, tovar yangisiga almashtirilishi yoki to‘langan pul summasi 100% qaytarilishi hamda har bir kechiktirilgan kun uchun 1% penya to‘lanishi shartligini ma’lum qilaman.`,
      };
    }

    if (constructorDocKey === 'd3') {
      return {
        to: 'Raqobatni rivojlantirish va iste’molchilar huquqlarini himoya qilish qo‘mitasiga',
        from: `Murojaatchi: ${fName}\nTelefon: ${phone}\nManzil: ${addr}`,
        title: 'SHIKOYAT ARIZASI\n(Iste’molchi huquqlari buzilganligi holati yuzasidan)',
        legalRef: '«Iste’molchilar huquqlarini himoya qilish to‘g‘risida»gi Qonunning 23-moddasi',
        body: `Men ${date} kuni ${seller} savdo shoxobchasidan ${price} evaziga ${product} sotib oldim (kassa cheki: ${receipt}).\n\nTovardan foydalanish davomida quyidagi jiddiy nuqsonlar aniqlandi: ${defect}.\n\nMen tovardagi nuqson yuzasidan sotuvchiga qonuniy talabnoma bilan murojaat qildim. Biroq ${seller} vakillari O‘zbekiston Respublikasining «Iste’molchilarning huquqlarini himoya qilish to‘g‘risida»gi Qonunining 13, 14, 18-moddalariga zid ravishda mening qonuniy talablarimni qanoatlantirishdan bosh tortdi.\n\nUshbu harakatlar iste’molchilarning davlat tomonidan kafolatlangan daxlsiz huquqlarining qo‘pol buzilishidir.\n\nYuqoridagilarga asosan, SIZDAN SO‘RAYMAN:\n1. «${seller}» mas’ullariga nisbatan qonunchilikda belgilangan tartibda qat’iy nazorat tadbirlarini o‘tkazishingizni;\n2. Menga yetkazilgan ${price} miqdoridagi moddiy zararni sotuvchidan undirib berishda amaliy yordam ko‘rsatishingizni;\n3. Qonunbuzilishiga yo‘l qo‘ygan shaxslarga nisbatan qonuniy javobgarlik choralari qo‘llashingizni.`,
      };
    }

    if (constructorDocKey === 'd4') {
      return {
        to: 'Fuqarolik ishlari bo‘yicha tumanlararo sudiga',
        from: `Da’vogar: ${fName}\nTelefon: ${phone}\nManzil: ${addr}\n\nJavobgar: ${seller}`,
        title: 'DA’VO ARIZASI\n(Nuqsonli tovar bahosini, penya va ma’naviy zararni undirish to‘g‘risida)',
        legalRef: '«Iste’molchilar huquqlarini himoya qilish to‘g‘risida»gi Qonunning 27, 29-moddalari',
        body: `Da’vo bahosi: ${price}\nDavlat boji: Qonunning 27-moddasiga asosan 0 so‘m (ozod etilgan)\n\nMen ${date} kuni javobgar ${seller}dan ${price} evaziga ${product} xarid qilganman (kassa cheki: ${receipt}).\n\nTovarda quyidagi nuqsonlar aniqlandi: ${defect}.\n\nMen javobgarga tovar pulini qaytarish haqida yozma talabnoma berdim, ammo javobgar qonuniy talablarimni e’tiborsiz qoldirdi.\n\n«Iste’molchilarning huquqlarini himoya qilish to‘g‘risida»gi Qonunning 17-moddasiga muvofiq, sotuvchi talabni kechiktirgan har bir kun uchun tovar bahosining 1% miqdorida penya to‘lashi shart. 29-moddaga asosan iste’molchiga yetkazilgan ma’naviy zarar qoplanishi lozim.\n\nYuqoridagilarga asosan, sudga murojaat qilib, SO‘RAYMAN:\n1. Javobgar ${seller}dan mening foydamga to‘langan ${price} mablag‘ni;\n2. Talablarni kechiktirganlik uchun qonuniy penya summasini;\n3. Yetkazilgan ma’naviy zarar kompensatsiyasini to‘liq undirib berishingizni.`,
      };
    }

    // Default: d1 (Pulni qaytarish talabnomasi)
    return {
      to: `${seller} rahbariyatiga`,
      from: `Iste’molchi: ${fName}\nTelefon: ${phone}\nManzil: ${addr}`,
      title: 'TALABNOMA\n(Nuqsonli tovar uchun to‘langan pulni 10 kun ichida qaytarish to‘g‘risida)',
      legalRef: '«Iste’molchilarning huquqlarini himoya qilish to‘g‘risida»gi Qonunning 13, 14, 17, 18-moddalari',
      body: `Men tomonimdan ${date} kuni sizning do‘koningizdan ${price} evaziga ${product} xarid qilingan (kassa cheki: ${receipt}).\n\nTovardan foydalanish jarayonida unda quyidagi jiddiy nuqsonlar aniqlandi: ${defect}.\n\nO‘zbekiston Respublikasining «Iste’molchilarning huquqlarini himoya qilish to‘g‘risida»gi Qonunining 13-moddasiga asosan, nuqsonli tovar sotilganda xaridor shartnomani bekor qilish va to‘langan pulni to‘liq qaytarib olish huquqiga ega.\n\nShuningdek, ushbu Qonunning 17-moddasiga ko‘ra, iste’molchining talablarini bajarishni kechiktirgan har bir kun uchun sotuvchi tovar bahosining 1 foizi miqdorida penya to‘lashga majburdir.\n\nYuqoridagilarga asosan, TALAB QILAMAN:\n1. Nuqsonli ${product} tovari uchun to‘langan ${price} summani 10 kunlik muddatda to‘liq qaytarib berishingizni;\n2. Mablag‘ni quyidagi hisob/kartaga o‘tkazib berishingizni: ${bank}.\n\nAgar ushbu talab 10 kun ichida qondirilmasa, Raqobatni rivojlantirish qo‘mitasiga (1159) va Fuqarolik sudiga barcha zararlar va jarimalarni undirish bo‘yicha murojaat qilinadi.`,
    };
  };

  const handleShareDoc = async (doc: ConsumerDocTemplate) => {
    try {
      await Share.share({
        title: doc.title,
        message: `📘 ${doc.docTitle || doc.title}\n\n${doc.content}\n\nYordam ilovasi orqali shakllantirildi.`,
      });
    } catch {
      Alert.alert('Ulashish', 'Ulashish oynasi ochilmadi.');
    }
  };

  const handleShareGeneratedDoc = async () => {
    const docData = getGeneratedDocText();
    try {
      await Share.share({
        title: docData.title,
        message: `📘 ${docData.title}\n\nKimga: ${docData.to}\nKimdan: ${docData.from}\n\n${docData.body}\n\nYordam ilovasi orqali tayyorlandi.`,
      });
    } catch {
      Alert.alert('Ulashish', 'Ulashish oynasi ochilmadi.');
    }
  };

  // Rights Tab Search & Category Filter
  const [rightsSearchQuery, setRightsSearchQuery] = useState<string>('');
  const [rightsFilter, setRightsFilter] = useState<'all' | 'basic' | 'popular'>('all');

  // AI Chat Input state
  const [aiQuestion, setAiQuestion] = useState<string>('');
  const [aiChatMessages, setAiChatMessages] = useState<
    { id: string; sender: 'user' | 'bot'; text: string; time: string }[]
  >([
    {
      id: 'm1',
      sender: 'bot',
      text: 'Assalomu alaykum! Men Iste’molçilar huquqlarini himoya qiliş böyiça AI yordamçiman. Do‘kondan olingan sifatsiz tovar, kafolat muddati yoki pulni qaytariş böyiça savolingizni bering.',
      time: '10:00',
    },
  ]);

  // Handle Hero Slide CTA
  const handleHeroSlideCta = (slide: HeroBannerSlide) => {
    if (slide.action === 'issues') {
      handleQuickIssuePress('sifatsiz');
    } else if (slide.action === 'constructor') {
      const template = CONSUMER_DOC_TEMPLATES[0];
      setConstructorForm((prev) => ({
        ...prev,
        sellerName: '«MEDIAPARK BOZORI» MChJ',
        productName: 'Samsung Galaxy A55 smartfoni',
        price: '4 200 000 so‘m',
        receiptNumber: '№ 482910-chek',
        defectDesc: 'Tovar nuqsonli bo‘lib chiqdi va ishlamayapti',
      }));
      setActiveTab('documents');
      handleOpenConstructor(template);
    } else if (slide.action === 'authorities') {
      setShowAuthoritiesScreen(true);
    }
  };

  // Handle Quick Issue Press - Dedicated detail screen
  const handleQuickIssuePress = (issueKeyOrTitle: string) => {
    const matched =
      QUICK_ISSUES_DATA.find(
        (item) =>
          item.id === issueKeyOrTitle ||
          item.key === issueKeyOrTitle ||
          item.title.toLowerCase().includes(issueKeyOrTitle.toLowerCase()) ||
          issueKeyOrTitle.toLowerCase().includes(item.key.toLowerCase())
      ) || QUICK_ISSUES_DATA[0];

    setSelectedQuickIssue(matched);
  };

  // Handle Main Service Press
  const handleServicePress = (serviceId: string) => {
    if (serviceId === 'rights') {
      setActiveTab('rights');
    } else if (serviceId === 'docs') {
      setActiveTab('documents');
    } else if (serviceId === 'proofs') {
      setShowProofsScreen(true);
    } else if (serviceId === 'authorities') {
      setShowAuthoritiesScreen(true);
    }
  };

  // Handle Rights Topic Press - opens interactive online book and video guide
  const handleTopicPress = (topic: any) => {
    let targetPage = 1;
    if (topic.id === 'r1') targetPage = 2; // Sifatli mahsulot huquqi (2-bob)
    else if (topic.id === 'r2') targetPage = 6; // Kafolat (garantiya) huquqi (6-bob)
    else if (topic.id === 'r3') targetPage = 5; // Qaytarish va almashtirish (5-bob, 18-modda)
    else if (topic.id === 'r4') targetPage = 7; // Xizmat sifatiga oid huquqlar (7-bob)
    else if (topic.id === 'r5') targetPage = 3; // To‘liq va aniq ma’lumot olish (3-bob)
    else if (topic.id === 'r6') targetPage = 8; // Huquq buzilganda himoya, 1159, sud (8-bob)

    setKitobInitialPage(targetPage);
    setShowKitob(true);
  };

  // Handle Open Asosiy Qonunlar Callout
  const handleOpenAsosiyQonunlar = () => {
    setKitobInitialPage(1);
    setShowKitob(true);
  };

  // Handle Send AI message
  const handleSendAi = (textToSend?: string) => {
    const q = textToSend || aiQuestion;
    if (!q.trim()) return;

    setAiChatMessages((prev) => [
      ...prev,
      {
        id: `msg_u_${prev.length + 1}`,
        sender: 'user' as const,
        text: q,
        time: 'Hozir',
      },
    ]);
    setAiQuestion('');

    setTimeout(() => {
      setAiChatMessages((prev) => [
        ...prev,
        {
          id: `msg_b_${prev.length + 1}`,
          sender: 'bot' as const,
          text: `«Iste’molchilarning huquqlarini himoya qilish to‘g‘risida»gi Qonunning 14 va 18-moddalariga muvofiq, xaridor nuqsonli tovar sotilganda uni maqbul sifatlisiga almashtirish yoki to‘langan pulni to‘liq qaytarib olishga haqli.\n\nSotuvchi tovar sifatini tekshirish uchun ekspertizani o‘z hisobidan o‘tkazishi shart. Agar 10 kun ichida talab qanoatlantirilmasa, har bir kun uchun tovar narxining 1 foizi miqdorida penya to‘laydi.`,
          time: 'Hozir',
        },
      ]);
    }, 450);
  };

  // 6 Core Rights Topics matching Screenshot
  const ALL_RIGHTS_TOPICS = [
    {
      id: 'r1',
      title: 'Sifatli mahsulot huquqi',
      desc: 'Xavfsiz va standartlarga mos mahsulot oliş huquqi.',
      icon: 'cube-outline',
      iconColor: '#E11D48',
      iconBg: '#FFF1F2',
      iconBorder: '#FFE4E6',
      category: 'basic',
      articles: '4, 12, 14-moddalar',
      fullDesc: 'Iste’molchi tovarning (ishning, xizmatning) xavfsiz bo‘lishiga, uning hayoti, sog‘lig‘i va mol-mulkiga zarar yetkazmasligiga to‘liq haqli. Tovar standartlar va sanitariya talablariga to‘liq javob berishi lozim.',
    },
    {
      id: 'r2',
      title: 'Kafolat (garantiya) huquqi',
      desc: 'Mahsulotning kafolat muddati davomida ta’mir, almaştiriş yoki qaytariş huquqi.',
      icon: 'shield-checkmark-outline',
      iconColor: '#2563EB',
      iconBg: '#EFF6FF',
      iconBorder: '#DBEAFE',
      category: 'basic',
      articles: '11, 14-moddalar',
      fullDesc: 'Kafolat muddati davomida tovardagi nuqsonlar sotuvchi yoki ishlab chiqaruvchi hisobidan bepul bartaraf etiladi. Ta’mir muddati 20 kundan oshmasligi lozim, aks holda yangisiga almashtiriladi.',
    },
    {
      id: 'r3',
      title: 'Qaytariş va almaştiriş',
      desc: 'Sifatsiz yoki mos kelmaydigan mahsulotni qaytariş yoki almaştiriş tartibi.',
      icon: 'sync-outline',
      iconColor: '#16A34A',
      iconBg: '#F0FDF4',
      iconBorder: '#DCFCE7',
      category: 'popular',
      articles: '18-modda',
      fullDesc: 'Xaridor maqbul sifatli nooziq-ovqat tovarini 10 kun ichida qaytarishga yoki boshqa o‘lcham, fason, rangdagisiga almashtirib olishga haqli.',
    },
    {
      id: 'r4',
      title: 'Xizmat sifatiga oid huquqlar',
      desc: 'Körsatilgan xizmatning sifati, hajmi va şartlariga mos bölişi.',
      icon: 'headset-outline',
      iconColor: '#D97706',
      iconBg: '#FFFBEB',
      iconBorder: '#FEF3C7',
      category: 'basic',
      articles: '19, 21-moddalar',
      fullDesc: 'Ijrochi xizmatni shartnomada belgilangan muddatda va sifatda ko‘rsatishi shart. Kamchiliklar aniqlanganda bepul bartaraf etish yoki to‘langan haqni kamaytirish talab qilinishi mumkin.',
    },
    {
      id: 'r5',
      title: 'Töliq va aniq ma’lumot oliş',
      desc: 'Mahsulot yoki xizmat haqida töğri, aniq va töliq ma’lumot berilişi.',
      icon: 'document-text-outline',
      iconColor: '#4F46E5',
      iconBg: '#EEF2FF',
      iconBorder: '#E0E7FF',
      category: 'popular',
      articles: '5, 6-moddalar',
      fullDesc: 'Sotuvchi iste’molchiga tovarning tarkibi, yaroqlilik muddati, ishlab chiqaruvchi manzili va qo‘llash qoidalari haqida o‘zbek tilida to‘liq ma’lumot berishi shart.',
    },
    {
      id: 'r6',
      title: 'Huquq buzilganda himoya',
      desc: 'Sotuvçi talabni bajarmasa, rasmiy şikoyat qiliş va zararni qoplaş huquqi.',
      icon: 'warning-outline',
      iconColor: '#DC2626',
      iconBg: '#FEF2F2',
      iconBorder: '#FEE2E2',
      category: 'popular',
      articles: '20, 26, 29-moddalar',
      fullDesc: 'Iste’molchi qonuniy huquqlari buzilganda Raqobat qo‘mitasiga, Iste’molchilar federatsiyasiga va sudga murojaat qilishga, shuningdek, yetkazilgan moddiy va ma’naviy zararni to‘liq qoplashni talab qilishga haqli.',
    },
  ];

  const filteredRightsTopics = ALL_RIGHTS_TOPICS.filter((item) => {
    const matchesFilter = rightsFilter === 'all' || item.category === rightsFilter;
    const matchesQuery =
      item.title.toLowerCase().includes(rightsSearchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(rightsSearchQuery.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  if (showKitob) {
    return (
      <IstemolchiQonuniKitobScreen
        initialPage={kitobInitialPage}
        onBack={() => setShowKitob(false)}
      />
    );
  }

  const renderDocPreview = () => {
    if (!previewDoc) return null;

    return (
      <View style={styles.inlinePageContainer}>
        {/* Sub-header navigation row */}
        <View style={styles.inlineSubHeaderRow}>
          <TouchableOpacity
            style={styles.inlineBackToCatalogBtn}
            onPress={() => setPreviewDoc(null)}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={16} color="#0F2644" />
            <Text style={styles.inlineBackToCatalogText}>Hujjatlar ro‘yxatiga qaytish</Text>
          </TouchableOpacity>

          <View style={styles.inlineBadgePill}>
            <Ionicons name="shield-checkmark" size={12} color="#16A34A" style={{ marginRight: 4 }} />
            <Text style={styles.inlineBadgeText}>Qonun talablariga mos</Text>
          </View>
        </View>

        {/* Scrollable Paper Container */}
        <ScrollView
          style={styles.inlinePaperScroll}
          contentContainerStyle={[
            styles.inlinePaperScrollContent,
            { paddingBottom: Math.max(insets.bottom, 16) + 85 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Official Paper Sheet */}
          <View style={styles.officialPaperCard}>
            <View style={styles.paperCrestBox}>
              <Ionicons name="scale-outline" size={24} color="#0F2644" style={{ marginBottom: 4 }} />
              <Text style={styles.paperCrestTitle}>O‘ZBEKISTON RESPUBLIKASI ISTE’MOLCHILAR HUQUQLARI</Text>
              <Text style={styles.paperCrestSubtitle}>«ISTE’MOLCHILAR HUQUQLARINI HIMOYA QILISH TO‘G‘RISIDA»GI QONUN ASOSIDA</Text>
              <View style={styles.paperDividerLine} />
            </View>

            <View style={styles.paperHeaderInfoCol}>
              <Text style={styles.paperHeaderInfoText}>{previewDoc.to}</Text>
              <Text style={styles.paperHeaderInfoText}>{previewDoc.from}</Text>
            </View>

            <View style={styles.paperTitleCenterBox}>
              <Text style={styles.paperDocMainTitle}>{previewDoc.docTitle}</Text>
              <Text style={styles.paperDocLegalRef}>({previewDoc.legalRef})</Text>
            </View>

            <Text style={styles.paperDocContentText}>{previewDoc.content}</Text>

            <View style={styles.paperFooterRow}>
              <Text style={styles.paperFooterText}>Sana: 12-mart, 2025-yil</Text>
              <Text style={styles.paperFooterText}>Imzo: _________________</Text>
            </View>

            <View style={styles.paperSealStampBox}>
              <Ionicons name="checkmark-done-circle" size={16} color="#16A34A" style={{ marginRight: 5 }} />
              <Text style={styles.paperSealStampText}>YURIDIK TEKSHIRUVDAN O‘TGAN • YORDAM 2025</Text>
            </View>
          </View>

          {/* Quick "To'ldirish" CTA Button */}
          <TouchableOpacity
            style={styles.inlineFillInCtaBtn}
            activeOpacity={0.85}
            onPress={() => {
              const d = previewDoc;
              setPreviewDoc(null);
              handleOpenConstructor(d);
            }}
          >
            <View style={styles.inlineFillInIcon}>
              <Ionicons name="create-outline" size={18} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.inlineFillInTitle}>Ushbu andoza asosida yaratish</Text>
              <Text style={styles.inlineFillInDesc}>F.I.Sh., xarid va do‘kon ma’lumotlarini kiritib tayyorlab oling</Text>
            </View>
            <Ionicons name="arrow-forward" size={18} color="#0F2644" />
          </TouchableOpacity>

          {/* Action Buttons Row */}
          <View style={styles.inlineDocActionRow}>
            <TouchableOpacity
              style={styles.inlineDocSecondaryBtn}
              activeOpacity={0.7}
              onPress={() => {
                Alert.alert('Nusxa olindi 📋', 'Hujjat andozasi matni qurilma xotirasiga nusxalandi.');
              }}
            >
              <Ionicons name="copy-outline" size={16} color="#0F2644" style={{ marginRight: 6 }} />
              <Text style={styles.inlineDocSecondaryBtnText}>Nusxa oliş</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.inlineDocSecondaryBtn}
              activeOpacity={0.7}
              onPress={() => handleShareDoc(previewDoc)}
            >
              <Ionicons name="share-social-outline" size={16} color="#0F2644" style={{ marginRight: 6 }} />
              <Text style={styles.inlineDocSecondaryBtnText}>Ulaşiş</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.inlineDocPrimaryBtn}
              activeOpacity={0.8}
              onPress={() => {
                Alert.alert('Yuklab olindi 📄', 'Hujjat andozasi PDF formati sifatida qurilmangizga saqlandi.');
              }}
            >
              <Ionicons name="download-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.inlineDocPrimaryBtnText}>Yuklab oliş</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  };

  const renderDocConstructor = () => {
    if (!isConstructorVisible) return null;
    const generated = getGeneratedDocText();

    return (
      <View style={styles.inlinePageContainer}>
        {/* Sub-header navigation row */}
        <View style={styles.inlineSubHeaderRow}>
          <TouchableOpacity
            style={styles.inlineBackToCatalogBtn}
            onPress={() => setIsConstructorVisible(false)}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={16} color="#0F2644" />
            <Text style={styles.inlineBackToCatalogText}>Hujjatlar ro‘yxatiga qaytish</Text>
          </TouchableOpacity>

          <View style={[styles.inlineBadgePill, { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' }]}>
            <Ionicons name="sparkles" size={12} color="#D97706" style={{ marginRight: 4 }} />
            <Text style={[styles.inlineBadgeText, { color: '#B45309' }]}>Konstruktor</Text>
          </View>
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
          <ScrollView
            style={styles.inlinePaperScroll}
            contentContainerStyle={[
              styles.inlinePaperScrollContent,
              { paddingBottom: Math.max(insets.bottom, 16) + 85 },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {/* Choose Document Type */}
            <Text style={styles.constructorFieldTitle}>Hujjat turini tanlang:</Text>
            <View style={styles.constructorTypePillGrid}>
              {[
                { id: 'd1', label: 'Pulni qaytarish', ref: '13-modda' },
                { id: 'd2', label: 'Kafolat ta’miri', ref: '15-modda' },
                { id: 'd3', label: '1159 Shikoyat', ref: '23-modda' },
                { id: 'd4', label: 'Sud da’vosi', ref: '27-modda' },
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
                    onPress={() => setConstructorDocKey(item.id)}
                  >
                    <Text style={[styles.constructorTypeChipText, isSelected && styles.constructorTypeChipTextActive]}>
                      {item.label} ({item.ref})
                    </Text>
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
                  placeholder="Masalan: Aliyev Vali Anvar o‘g‘li"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            <View style={styles.constructorFormGroup}>
              <Text style={styles.constructorLabel}>Telefon raqamingiz:</Text>
              <View style={styles.constructorInputBox}>
                <Ionicons name="call-outline" size={17} color="#64748B" style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.constructorTextInput}
                  value={constructorForm.phone}
                  onChangeText={(t) => setConstructorForm((prev) => ({ ...prev, phone: t }))}
                  placeholder="+998 90 123 45 67"
                  placeholderTextColor="#94A3B8"
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={styles.constructorFormGroup}>
              <Text style={styles.constructorLabel}>Yashash manzilingiz:</Text>
              <View style={styles.constructorInputBox}>
                <Ionicons name="location-outline" size={17} color="#64748B" style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.constructorTextInput}
                  value={constructorForm.address}
                  onChangeText={(t) => setConstructorForm((prev) => ({ ...prev, address: t }))}
                  placeholder="Masalan: Toshkent shahri, Yunusobod tumani"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            <View style={styles.constructorFormGroup}>
              <Text style={styles.constructorLabel}>Do‘kon yoki sotuvchi nomi:</Text>
              <View style={styles.constructorInputBox}>
                <Ionicons name="business-outline" size={17} color="#64748B" style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.constructorTextInput}
                  value={constructorForm.sellerName}
                  onChangeText={(t) => setConstructorForm((prev) => ({ ...prev, sellerName: t }))}
                  placeholder="Masalan: «MEDIAPARK BOZORI» MChJ"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            <View style={styles.constructorFormGroup}>
              <Text style={styles.constructorLabel}>Tovar nomi va modeli:</Text>
              <View style={styles.constructorInputBox}>
                <Ionicons name="cube-outline" size={17} color="#64748B" style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.constructorTextInput}
                  value={constructorForm.productName}
                  onChangeText={(t) => setConstructorForm((prev) => ({ ...prev, productName: t }))}
                  placeholder="Masalan: Samsung Galaxy A55 smartfoni"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            <View style={styles.constructorFormGroup}>
              <Text style={styles.constructorLabel}>Xarid sanasi va narxi:</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <View style={[styles.constructorInputBox, { flex: 1 }]}>
                  <Ionicons name="calendar-outline" size={17} color="#64748B" style={{ marginRight: 8 }} />
                  <TextInput
                    style={styles.constructorTextInput}
                    value={constructorForm.purchaseDate}
                    onChangeText={(t) => setConstructorForm((prev) => ({ ...prev, purchaseDate: t }))}
                    placeholder="12-mart, 2025"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
                <View style={[styles.constructorInputBox, { flex: 1 }]}>
                  <Ionicons name="cash-outline" size={17} color="#64748B" style={{ marginRight: 8 }} />
                  <TextInput
                    style={styles.constructorTextInput}
                    value={constructorForm.price}
                    onChangeText={(t) => setConstructorForm((prev) => ({ ...prev, price: t }))}
                    placeholder="4 200 000 so‘m"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              </View>
            </View>

            <View style={styles.constructorFormGroup}>
              <Text style={styles.constructorLabel}>Kassa cheki / Kafolat taloni raqami:</Text>
              <View style={styles.constructorInputBox}>
                <Ionicons name="receipt-outline" size={17} color="#64748B" style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.constructorTextInput}
                  value={constructorForm.receiptNumber}
                  onChangeText={(t) => setConstructorForm((prev) => ({ ...prev, receiptNumber: t }))}
                  placeholder="Masalan: № 482910-chek"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            <View style={styles.constructorFormGroup}>
              <Text style={styles.constructorLabel}>Aniqlangan nuqson yoki muammo tavsifi:</Text>
              <TextInput
                style={styles.constructorTextArea}
                value={constructorForm.defectDesc}
                onChangeText={(t) => setConstructorForm((prev) => ({ ...prev, defectDesc: t }))}
                placeholder="Tovarda qanday nuqson aniqlangani haqida qisqacha yozing (masalan: 3 kundan so‘ng ekrani yonmay qoldi va zaryad olmayapti)..."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.constructorFormGroup}>
              <Text style={styles.constructorLabel}>Pul qaytariladigan karta yoki hisob raqami:</Text>
              <View style={styles.constructorInputBox}>
                <Ionicons name="card-outline" size={17} color="#64748B" style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.constructorTextInput}
                  value={constructorForm.bankAccount}
                  onChangeText={(t) => setConstructorForm((prev) => ({ ...prev, bankAccount: t }))}
                  placeholder="8600 1234 5678 9012 (Humo/Uzcard)"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            {/* Form Submit Button */}
            <TouchableOpacity
              style={styles.constructorPrimaryBtn}
              activeOpacity={0.85}
              onPress={() => setConstructorTab('preview')}
            >
              <Text style={styles.constructorPrimaryBtnText}>Tayyor talabnomani shakllantirish →</Text>
            </TouchableOpacity>
          </ScrollView>
        ) : (
          <ScrollView
            style={styles.inlinePaperScroll}
            contentContainerStyle={[
              styles.inlinePaperScrollContent,
              { paddingBottom: Math.max(insets.bottom, 16) + 85 },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {/* Success Banner */}
            <View style={styles.constructorSuccessBanner}>
              <Ionicons name="checkmark-circle" size={18} color="#16A34A" />
              <Text style={styles.constructorSuccessBannerText}>
                Siz kiritgan ma’lumotlar asosida rasmiy hujjat shakllantirildi!
              </Text>
            </View>

            {/* Paper Card */}
            <View style={styles.officialPaperCard}>
              <View style={styles.paperCrestBox}>
                <Ionicons name="scale-outline" size={24} color="#0F2644" style={{ marginBottom: 4 }} />
                <Text style={styles.paperCrestTitle}>O‘ZBEKISTON RESPUBLIKASI ISTE’MOLCHILAR HUQUQLARI</Text>
                <Text style={styles.paperCrestSubtitle}>«ISTE’MOLCHILAR HUQUQLARINI HIMOYA QILISH TO‘G‘RISIDA»GI QONUN ASOSIDA</Text>
                <View style={styles.paperDividerLine} />
              </View>

              <View style={styles.paperHeaderInfoCol}>
                <Text style={styles.paperHeaderInfoText}>{generated.to}</Text>
                <Text style={styles.paperHeaderInfoText}>{generated.from}</Text>
              </View>

              <View style={styles.paperTitleCenterBox}>
                <Text style={styles.paperDocMainTitle}>{generated.title}</Text>
                <Text style={styles.paperDocLegalRef}>({generated.legalRef})</Text>
              </View>

              <Text style={styles.paperDocContentText}>{generated.body}</Text>

              <View style={styles.paperFooterRow}>
                <Text style={styles.paperFooterText}>Sana: 12-mart, 2025-yil</Text>
                <Text style={styles.paperFooterText}>Imzo: _________________</Text>
              </View>

              <View style={styles.paperSealStampBox}>
                <Ionicons name="checkmark-done-circle" size={16} color="#16A34A" style={{ marginRight: 5 }} />
                <Text style={styles.paperSealStampText}>RASMIY TAYYOR HOLATDA • YORDAM 2025</Text>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.inlineDocActionRow}>
              <TouchableOpacity
                style={styles.inlineDocSecondaryBtn}
                activeOpacity={0.7}
                onPress={() => {
                  Alert.alert('Nusxa olindi 📋', 'Tayyor hujjat matni qurilma xotirasiga nusxalandi.');
                }}
              >
                <Ionicons name="copy-outline" size={16} color="#0F2644" style={{ marginRight: 6 }} />
                <Text style={styles.inlineDocSecondaryBtnText}>Nusxa oliş</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.inlineDocSecondaryBtn}
                activeOpacity={0.7}
                onPress={() => handleShareGeneratedDoc()}
              >
                <Ionicons name="share-social-outline" size={16} color="#0F2644" style={{ marginRight: 6 }} />
                <Text style={styles.inlineDocSecondaryBtnText}>Ulaşiş</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.inlineDocPrimaryBtn}
                activeOpacity={0.8}
                onPress={() => {
                  Alert.alert('Saqlandi 📂', 'Talabnoma qurilmangizga va profilingizga muvaffaqiyatli saqlandi.');
                }}
              >
                <Ionicons name="save-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.inlineDocPrimaryBtnText}>Saqlash</Text>
              </TouchableOpacity>
            </View>

            {/* Back to Edit Button */}
            <TouchableOpacity
              style={[styles.inlineDocSecondaryBtn, { height: 42, marginBottom: 20 }]}
              activeOpacity={0.75}
              onPress={() => setConstructorTab('form')}
            >
              <Ionicons name="pencil-outline" size={16} color="#475569" style={{ marginRight: 6 }} />
              <Text style={[styles.inlineDocSecondaryBtnText, { color: '#475569' }]}>Ma’lumotlarni tahrirlash</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
    );
  };

  // -------------------------------------------------------------
  // RENDER: TEZKOR MUAMMOLAR DEDICATED SCREEN
  // -------------------------------------------------------------
  const renderQuickIssueDetail = () => {
    if (!selectedQuickIssue) return null;

    return (
      <View style={styles.inlinePageContainer}>
        {/* Sub Header */}
        <View style={styles.inlineSubHeaderRow}>
          <TouchableOpacity
            style={styles.inlineBackToCatalogBtn}
            activeOpacity={0.7}
            onPress={() => setSelectedQuickIssue(null)}
          >
            <Ionicons name="arrow-back" size={18} color="#0F172A" />
            <Text style={styles.inlineBackToCatalogText}>Bosh sahifaga</Text>
          </TouchableOpacity>

          <View style={[styles.issuePillBadge, { backgroundColor: selectedQuickIssue.badgeBg }]}>
            <Text style={[styles.issuePillBadgeText, { color: selectedQuickIssue.badgeColor }]}>
              {selectedQuickIssue.badge}
            </Text>
          </View>
        </View>

        <ScrollView
          style={styles.inlinePaperScroll}
          contentContainerStyle={[
            styles.inlinePaperScrollContent,
            { paddingBottom: Math.max(insets.bottom, 16) + 80 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Main Issue Card Banner */}
          <View style={[styles.issueHeroCard, { borderColor: selectedQuickIssue.badgeColor + '30' }]}>
            <View style={[styles.issueIconLarge, { backgroundColor: selectedQuickIssue.badgeBg }]}>
              <Ionicons name={selectedQuickIssue.icon} size={28} color={selectedQuickIssue.themeColor} />
            </View>
            <Text style={styles.issueHeroTitle}>{selectedQuickIssue.title}</Text>
            <Text style={styles.issueHeroSubtitle}>{selectedQuickIssue.subtitle}</Text>
          </View>

          {/* Legal Quote Card */}
          <View style={styles.issueLegalQuoteCard}>
            <View style={styles.issueLegalHeaderRow}>
              <Ionicons name="shield-checkmark" size={16} color="#D97706" />
              <Text style={styles.issueLegalHeaderTitle}>Qonuniy kafolat ({selectedQuickIssue.legalModda})</Text>
            </View>
            <Text style={styles.issueLegalQuoteText}>
              «{selectedQuickIssue.legalQuote}»
            </Text>
          </View>

          {/* Consumer Rights Checklist */}
          <View style={styles.issueSectionBox}>
            <View style={styles.issueSectionTitleRow}>
              <Ionicons name="checkmark-circle" size={18} color="#16A34A" />
              <Text style={styles.issueSectionTitle}>Sizning qonuniy huquqlaringiz:</Text>
            </View>
            {selectedQuickIssue.consumerRights.map((right, idx) => (
              <View key={idx} style={styles.issueRightItemRow}>
                <View style={styles.issueCheckBullet}>
                  <Ionicons name="checkmark" size={12} color="#16A34A" />
                </View>
                <Text style={styles.issueRightItemText}>{right}</Text>
              </View>
            ))}
          </View>

          {/* Action Steps */}
          <View style={styles.issueSectionBox}>
            <View style={styles.issueSectionTitleRow}>
              <Ionicons name="list" size={18} color="#2563EB" />
              <Text style={styles.issueSectionTitle}>Qadam-baqadam yechim yo‘riqnomasi:</Text>
            </View>
            {selectedQuickIssue.actionSteps.map((step) => (
              <View key={step.step} style={styles.issueStepCard}>
                <View style={styles.issueStepNumCircle}>
                  <Text style={styles.issueStepNumText}>{step.step}</Text>
                </View>
                <View style={styles.issueStepContent}>
                  <Text style={styles.issueStepTitle}>{step.title}</Text>
                  <Text style={styles.issueStepDesc}>{step.desc}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Warning / Important Tip */}
          <View style={styles.issueWarningCard}>
            <View style={styles.issueWarningTitleRow}>
              <Ionicons name="warning" size={16} color="#B45309" />
              <Text style={styles.issueWarningTitle}>{selectedQuickIssue.warningBox.title}</Text>
            </View>
            <Text style={styles.issueWarningText}>{selectedQuickIssue.warningBox.text}</Text>
          </View>

          {/* Actions Button Group */}
          <View style={styles.issueActionsCard}>
            <Text style={styles.issueActionsHeading}>Amaliy harakatlar:</Text>

            {/* Primary CTA: Create Document */}
            <TouchableOpacity
              style={styles.issuePrimaryActionBtn}
              activeOpacity={0.85}
              onPress={() => {
                const template =
                  CONSUMER_DOC_TEMPLATES.find(
                    (t) => t.id === selectedQuickIssue.recommendedTemplateKey
                  ) || CONSUMER_DOC_TEMPLATES[0];
                setSelectedQuickIssue(null);
                setActiveTab('documents');
                handleOpenConstructor(template);
              }}
            >
              <Ionicons name="document-text" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.issuePrimaryActionBtnText}>Rasmiy talabnoma / ariza tuzish</Text>
            </TouchableOpacity>

            {/* Secondary CTA: Read Book */}
            <TouchableOpacity
              style={styles.issueSecondaryActionBtn}
              activeOpacity={0.8}
              onPress={() => {
                setKitobInitialPage(selectedQuickIssue.targetBookPage);
                setShowKitob(true);
              }}
            >
              <Ionicons name="book-outline" size={17} color="#2563EB" style={{ marginRight: 8 }} />
              <Text style={styles.issueSecondaryActionBtnText}>Qonun bobini o‘qish (Online kitob)</Text>
            </TouchableOpacity>

            {/* Secondary CTA: AI Chat */}
            <TouchableOpacity
              style={[styles.issueSecondaryActionBtn, { borderColor: '#DDD6FE', backgroundColor: '#F5F3FF' }]}
              activeOpacity={0.8}
              onPress={() => {
                setSelectedQuickIssue(null);
                setActiveTab('ai');
                handleSendAi(selectedQuickIssue.aiPromptSeed);
              }}
            >
              <Ionicons name="sparkles" size={17} color="#7C3AED" style={{ marginRight: 8 }} />
              <Text style={[styles.issueSecondaryActionBtnText, { color: '#6D28D9' }]}>AI Maslahatchidan so‘rash</Text>
            </TouchableOpacity>

            {/* Secondary CTA: Call 1159 */}
            <TouchableOpacity
              style={[styles.issueSecondaryActionBtn, { borderColor: '#BBF7D0', backgroundColor: '#F0FDF4' }]}
              activeOpacity={0.8}
              onPress={() => handleCallPhone('1159')}
            >
              <Ionicons name="call" size={17} color="#16A34A" style={{ marginRight: 8 }} />
              <Text style={[styles.issueSecondaryActionBtnText, { color: '#15803D' }]}>1159 Ishonch telefoni (Bepul qo‘ng‘iroq)</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  };

  // -------------------------------------------------------------
  // RENDER: DALILLARIM - ADD PROOF MODAL
  // -------------------------------------------------------------
  const renderAddProofModal = () => (
    <Modal
      visible={isAddProofModalVisible}
      animationType="slide"
      transparent
      onRequestClose={() => setIsAddProofModalVisible(false)}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCardContainer}>
          <View style={styles.modalHeaderRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="add-circle" size={20} color="#D97706" style={{ marginRight: 6 }} />
              <Text style={styles.modalTitle}>Yangi dalil qo‘shish</Text>
            </View>
            <TouchableOpacity onPress={() => setIsAddProofModalVisible(false)}>
              <Ionicons name="close" size={22} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 420 }}>
            <Text style={styles.modalInputLabel}>Dalil turi:</Text>
            <View style={styles.modalTypeRow}>
              {[
                { key: 'receipt', label: 'Kassa cheki' },
                { key: 'warranty', label: 'Kafolat taloni' },
                { key: 'photo', label: 'Foto/Video' },
                { key: 'other', label: 'Boshqa' },
              ].map((t) => (
                <TouchableOpacity
                  key={t.key}
                  style={[
                    styles.modalTypePill,
                    newProofType === t.key && styles.modalTypePillActive,
                  ]}
                  onPress={() => setNewProofType(t.key as any)}
                >
                  <Text
                    style={[
                      styles.modalTypePillText,
                      newProofType === t.key && styles.modalTypePillTextActive,
                    ]}
                  >
                    {t.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.modalInputLabel}>Mahsulot / Dalil nomi *:</Text>
            <TextInput
              style={styles.modalTextInput}
              placeholder="Masalan: Samsung Galaxy A54 cheki"
              placeholderTextColor="#94A3B8"
              value={newProofTitle}
              onChangeText={setNewProofTitle}
            />

            <Text style={styles.modalInputLabel}>Do‘kon yoki sotuvchi nomi *:</Text>
            <TextInput
              style={styles.modalTextInput}
              placeholder="Masalan: MediaPark Chilonzor"
              placeholderTextColor="#94A3B8"
              value={newProofStore}
              onChangeText={setNewProofStore}
            />

            <Text style={styles.modalInputLabel}>Xarid narxi (so‘mda):</Text>
            <TextInput
              style={styles.modalTextInput}
              placeholder="Masalan: 3 850 000 so‘m"
              placeholderTextColor="#94A3B8"
              value={newProofPrice}
              onChangeText={setNewProofPrice}
            />

            <Text style={styles.modalInputLabel}>Chek yoki kafolat raqami:</Text>
            <TextInput
              style={styles.modalTextInput}
              placeholder="Masalan: №482910"
              placeholderTextColor="#94A3B8"
              value={newProofReceiptNum}
              onChangeText={setNewProofReceiptNum}
            />

            <Text style={styles.modalInputLabel}>Qisqa izoh yoki dalil tavsifi:</Text>
            <TextInput
              style={[styles.modalTextInput, { height: 60, textAlignVertical: 'top' }]}
              placeholder="Masalan: QR-kodli fiskal chek saqlangan..."
              placeholderTextColor="#94A3B8"
              multiline
              value={newProofNote}
              onChangeText={setNewProofNote}
            />
          </ScrollView>

          <View style={styles.modalBtnRow}>
            <TouchableOpacity
              style={styles.modalCancelBtn}
              onPress={() => setIsAddProofModalVisible(false)}
            >
              <Text style={styles.modalCancelBtnText}>Bekor qilish</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalSaveBtn}
              onPress={() => {
                if (!newProofTitle.trim() || !newProofStore.trim()) {
                  Alert.alert('Xatolik', 'Iltimos, mahsulot va do‘kon nomini kiriting.');
                  return;
                }
                const newId = `p_${Date.now()}`;
                const newItem: ConsumerProofItem = {
                  id: newId,
                  type: newProofType,
                  title: newProofTitle.trim(),
                  store: newProofStore.trim(),
                  date: 'Bugun',
                  price: newProofPrice.trim() || undefined,
                  receiptNum: newProofReceiptNum.trim() || undefined,
                  note: newProofNote.trim() || 'Foydalanuvchi tomonidan arxivga qo‘shildi.',
                  status: 'Saqlangan',
                };
                setProofsList((prev) => [newItem, ...prev]);
                setIsAddProofModalVisible(false);
                Alert.alert('Muvaffaqiyatli', 'Yangi dalil shaxsiy arxivga muvaffaqiyatli qo‘shildi!');
              }}
            >
              <Text style={styles.modalSaveBtnText}>Saqlash</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // -------------------------------------------------------------
  // RENDER: DALILLARIM - PROOF DETAIL MODAL
  // -------------------------------------------------------------
  const renderProofDetailModal = () => {
    if (!selectedProofDetail) return null;
    const isReceipt = selectedProofDetail.type === 'receipt';
    const isWarranty = selectedProofDetail.type === 'warranty';

    return (
      <Modal
        visible={!!selectedProofDetail}
        animationType="fade"
        transparent
        onRequestClose={() => setSelectedProofDetail(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCardContainer}>
            <View style={styles.modalHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons
                  name={isReceipt ? 'receipt' : isWarranty ? 'shield-checkmark' : 'camera'}
                  size={20}
                  color="#D97706"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.modalTitle}>Dalil tafsilotlari</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedProofDetail(null)}>
                <Ionicons name="close" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 420 }}>
              <View style={styles.proofPaperSimBox}>
                <View style={styles.proofPaperSimHeader}>
                  <Ionicons name="barcode-outline" size={24} color="#0F172A" />
                  <Text style={styles.proofPaperSimBrand}>YURIDIK DALIL ARXIVI</Text>
                  <Text style={styles.proofPaperSimDate}>{selectedProofDetail.date}</Text>
                </View>

                <View style={styles.proofPaperDivider} />

                <Text style={styles.proofPaperSimTitle}>{selectedProofDetail.title}</Text>
                <Text style={styles.proofPaperSimStore}>Sotuvchi: {selectedProofDetail.store}</Text>

                {selectedProofDetail.price ? (
                  <Text style={styles.proofPaperSimPrice}>Summa: {selectedProofDetail.price}</Text>
                ) : null}

                {selectedProofDetail.receiptNum ? (
                  <Text style={styles.proofPaperSimNum}>{selectedProofDetail.receiptNum}</Text>
                ) : null}

                <Text style={styles.proofPaperSimNote}>{selectedProofDetail.note}</Text>

                <View style={styles.proofPaperSealBadge}>
                  <Ionicons name="shield-checkmark" size={14} color="#16A34A" />
                  <Text style={styles.proofPaperSealText}>RASMIY DALIL SIFATIDA TAYYOR</Text>
                </View>
              </View>

              <View style={[styles.proofLegalNotice, { marginTop: 12 }]}>
                <Ionicons name="checkmark-done-circle" size={16} color="#16A34A" style={{ marginRight: 6 }} />
                <Text style={[styles.proofLegalNoticeText, { color: '#166534' }]}>
                  Ushbu dalil ma’lumotlari asosida sotuvchiga rasmiy talabnoma tuzish mumkin.
                </Text>
              </View>
            </ScrollView>

            <View style={{ gap: 8, marginTop: 14 }}>
              <TouchableOpacity
                style={styles.modalPrimaryActionBtn}
                activeOpacity={0.85}
                onPress={() => {
                  const item = selectedProofDetail;
                  setConstructorForm((prev) => ({
                    ...prev,
                    sellerName: item.store || prev.sellerName,
                    productName: item.title || prev.productName,
                    price: item.price || prev.price,
                    receiptNumber: item.receiptNum || prev.receiptNumber,
                  }));
                  setSelectedProofDetail(null);
                  setShowProofsScreen(false);
                  setActiveTab('documents');
                  handleOpenConstructor(CONSUMER_DOC_TEMPLATES[0]);
                }}
              >
                <Ionicons name="document-text" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.modalPrimaryActionBtnText}>Ushbu dalil bilan talabnoma yaratish</Text>
              </TouchableOpacity>

              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity
                  style={[styles.modalSecondaryActionBtn, { flex: 1 }]}
                  activeOpacity={0.8}
                  onPress={() => {
                    Share.share({
                      title: selectedProofDetail.title,
                      message: `📌 Dalil: ${selectedProofDetail.title}\nSotuvchi: ${selectedProofDetail.store}\nSana: ${selectedProofDetail.date}\nSumma: ${selectedProofDetail.price || 'Mavjud emas'}\nEslatma: ${selectedProofDetail.note}\n\nYordam ilovasi shaxsiy arxividan`,
                    });
                  }}
                >
                  <Ionicons name="share-social-outline" size={15} color="#0F172A" style={{ marginRight: 4 }} />
                  <Text style={styles.modalSecondaryActionBtnText}>Ulashish</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalSecondaryActionBtn, { borderColor: '#FECACA', backgroundColor: '#FEF2F2' }]}
                  activeOpacity={0.8}
                  onPress={() => {
                    Alert.alert(
                      'O‘chirish',
                      'Haqiqatan ham ushbu dalilni o‘chirmoqchimisiz?',
                      [
                        { text: 'Bekor qilish', style: 'cancel' },
                        {
                          text: 'O‘chirish',
                          style: 'destructive',
                          onPress: () => {
                            setProofsList((prev) => prev.filter((p) => p.id !== selectedProofDetail.id));
                            setSelectedProofDetail(null);
                          },
                        },
                      ]
                    );
                  }}
                >
                  <Ionicons name="trash-outline" size={15} color="#DC2626" />
                  <Text style={[styles.modalSecondaryActionBtnText, { color: '#DC2626', marginLeft: 4 }]}>O‘chirish</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  // -------------------------------------------------------------
  // RENDER: DALILLARIM SCREEN
  // -------------------------------------------------------------
  const renderProofsScreen = () => {
    const filteredProofs = proofsList.filter((p) => {
      if (proofFilter === 'all') return true;
      return p.type === proofFilter;
    });

    const receiptCount = proofsList.filter((p) => p.type === 'receipt').length;
    const warrantyCount = proofsList.filter((p) => p.type === 'warranty').length;
    const photoCount = proofsList.filter((p) => p.type === 'photo').length;

    return (
      <View style={styles.inlinePageContainer}>
        {/* Sub Header */}
        <View style={styles.inlineSubHeaderRow}>
          <TouchableOpacity
            style={styles.inlineBackToCatalogBtn}
            activeOpacity={0.7}
            onPress={() => setShowProofsScreen(false)}
          >
            <Ionicons name="arrow-back" size={18} color="#0F172A" />
            <Text style={styles.inlineBackToCatalogText}>Bosh sahifa</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addProofHeaderBtn}
            activeOpacity={0.85}
            onPress={() => {
              setNewProofType('receipt');
              setNewProofTitle('');
              setNewProofStore('');
              setNewProofPrice('');
              setNewProofReceiptNum('');
              setNewProofNote('');
              setIsAddProofModalVisible(true);
            }}
          >
            <Ionicons name="add" size={16} color="#FFFFFF" style={{ marginRight: 4 }} />
            <Text style={styles.addProofHeaderBtnText}>Yangi dalil</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.inlinePaperScroll}
          contentContainerStyle={[
            styles.inlinePaperScrollContent,
            { paddingBottom: Math.max(insets.bottom, 16) + 80 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Stats Row */}
          <View style={styles.proofStatsRow}>
            <View style={styles.proofStatBox}>
              <Text style={styles.proofStatVal}>{proofsList.length}</Text>
              <Text style={styles.proofStatLabel}>Jami dalil</Text>
            </View>
            <View style={styles.proofStatBox}>
              <Text style={[styles.proofStatVal, { color: '#2563EB' }]}>{receiptCount}</Text>
              <Text style={styles.proofStatLabel}>Cheklar</Text>
            </View>
            <View style={styles.proofStatBox}>
              <Text style={[styles.proofStatVal, { color: '#16A34A' }]}>{warrantyCount}</Text>
              <Text style={styles.proofStatLabel}>Kafolatlar</Text>
            </View>
            <View style={styles.proofStatBox}>
              <Text style={[styles.proofStatVal, { color: '#D97706' }]}>{photoCount}</Text>
              <Text style={styles.proofStatLabel}>Foto/Video</Text>
            </View>
          </View>

          {/* Filter Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.proofFilterScroll}
          >
            {[
              { key: 'all', label: `Barchasi (${proofsList.length})` },
              { key: 'receipt', label: `Cheklar (${receiptCount})` },
              { key: 'warranty', label: `Kafolatlar (${warrantyCount})` },
              { key: 'photo', label: `Foto/Video (${photoCount})` },
            ].map((tab) => (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.proofFilterChip,
                  proofFilter === tab.key && styles.proofFilterChipActive,
                ]}
                activeOpacity={0.8}
                onPress={() => setProofFilter(tab.key as any)}
              >
                <Text
                  style={[
                    styles.proofFilterChipText,
                    proofFilter === tab.key && styles.proofFilterChipTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Legal Tip Card */}
          <View style={styles.proofLegalNotice}>
            <Ionicons name="information-circle" size={18} color="#0284C7" style={{ marginRight: 8, marginTop: 1 }} />
            <Text style={styles.proofLegalNoticeText}>
              <Text style={{ fontWeight: '800' }}>Qonuniy eslatma:</Text> Elektron cheklar, fotosuratlar va to‘lov skrinshotlari Fuqarolik protsessual kodeksiga asosan sudda to‘laqonli yuridik dalil hisoblanadi.
            </Text>
          </View>

          {/* Proofs List */}
          {filteredProofs.length === 0 ? (
            <View style={styles.emptyProofBox}>
              <Ionicons name="folder-open-outline" size={48} color="#94A3B8" style={{ marginBottom: 10 }} />
              <Text style={styles.emptyProofTitle}>Hozircha dalillar yo‘q</Text>
              <Text style={styles.emptyProofSub}>
                Yuqoridagi «Yangi dalil» tugmasini bosib xarid cheki yoki fotosuratni saqlang.
              </Text>
            </View>
          ) : (
            filteredProofs.map((item) => {
              const isReceipt = item.type === 'receipt';
              const isWarranty = item.type === 'warranty';
              const iconName = isReceipt ? 'receipt-outline' : isWarranty ? 'shield-checkmark-outline' : 'camera-outline';
              const iconColor = isReceipt ? '#2563EB' : isWarranty ? '#16A34A' : '#D97706';
              const iconBg = isReceipt ? '#EFF6FF' : isWarranty ? '#F0FDF4' : '#FFFBEB';
              const typeLabel = isReceipt ? 'Kassa cheki' : isWarranty ? 'Kafolat taloni' : 'Foto dalil';

              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.proofCard}
                  activeOpacity={0.9}
                  onPress={() => setSelectedProofDetail(item)}
                >
                  <View style={styles.proofCardTop}>
                    <View style={[styles.proofCardIconCircle, { backgroundColor: iconBg }]}>
                      <Ionicons name={iconName} size={20} color={iconColor} />
                    </View>
                    <View style={styles.proofCardTitleCol}>
                      <View style={styles.proofCardBadgeRow}>
                        <View style={[styles.proofBadgePill, { backgroundColor: iconBg }]}>
                          <Text style={[styles.proofBadgePillText, { color: iconColor }]}>{typeLabel}</Text>
                        </View>
                        <Text style={styles.proofDateText}>{item.date}</Text>
                      </View>
                      <Text style={styles.proofCardMainTitle}>{item.title}</Text>
                    </View>
                  </View>

                  <View style={styles.proofMetaRow}>
                    <View style={styles.proofMetaItem}>
                      <Ionicons name="storefront-outline" size={13} color="#64748B" />
                      <Text style={styles.proofMetaText} numberOfLines={1}>{item.store}</Text>
                    </View>
                    {item.price ? (
                      <View style={styles.proofMetaItem}>
                        <Ionicons name="cash-outline" size={13} color="#16A34A" />
                        <Text style={[styles.proofMetaText, { color: '#16A34A', fontWeight: '700' }]}>{item.price}</Text>
                      </View>
                    ) : null}
                  </View>

                  <Text style={styles.proofNoteText} numberOfLines={2}>{item.note}</Text>

                  <View style={styles.proofCardActions}>
                    <TouchableOpacity
                      style={styles.proofCardSecondaryBtn}
                      activeOpacity={0.7}
                      onPress={() => setSelectedProofDetail(item)}
                    >
                      <Ionicons name="eye-outline" size={14} color="#0F172A" style={{ marginRight: 4 }} />
                      <Text style={styles.proofCardSecondaryBtnText}>Ko‘rish</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.proofCardPrimaryBtn}
                      activeOpacity={0.8}
                      onPress={() => {
                        setConstructorForm((prev) => ({
                          ...prev,
                          sellerName: item.store || prev.sellerName,
                          productName: item.title || prev.productName,
                          price: item.price || prev.price,
                          receiptNumber: item.receiptNum || prev.receiptNumber,
                        }));
                        setShowProofsScreen(false);
                        setActiveTab('documents');
                        handleOpenConstructor(CONSUMER_DOC_TEMPLATES[0]);
                      }}
                    >
                      <Ionicons name="document-text" size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
                      <Text style={styles.proofCardPrimaryBtnText}>Talabnomaga biriktirish</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>

        {renderAddProofModal()}
        {renderProofDetailModal()}
      </View>
    );
  };

  // -------------------------------------------------------------
  // RENDER: RASMIY TASHKILOTLAR SCREEN
  // -------------------------------------------------------------
  const renderAuthoritiesScreen = () => {
    const filteredAuthorities = AUTHORITIES_LIST.filter((auth) => {
      const matchesCategory =
        authoritiesCategory === 'all' || auth.category === authoritiesCategory;
      const matchesQuery =
        authoritiesSearchQuery.trim() === '' ||
        auth.name.toLowerCase().includes(authoritiesSearchQuery.toLowerCase()) ||
        auth.short.toLowerCase().includes(authoritiesSearchQuery.toLowerCase()) ||
        auth.scope.toLowerCase().includes(authoritiesSearchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });

    return (
      <View style={styles.inlinePageContainer}>
        {/* Sub Header */}
        <View style={styles.inlineSubHeaderRow}>
          <TouchableOpacity
            style={styles.inlineBackToCatalogBtn}
            activeOpacity={0.7}
            onPress={() => setShowAuthoritiesScreen(false)}
          >
            <Ionicons name="arrow-back" size={18} color="#0F172A" />
            <Text style={styles.inlineBackToCatalogText}>Bosh sahifa</Text>
          </TouchableOpacity>

          <View style={styles.authoritiesHeaderBadge}>
            <Text style={styles.authoritiesHeaderBadgeText}>Ishonch telefonlari</Text>
          </View>
        </View>

        <ScrollView
          style={styles.inlinePaperScroll}
          contentContainerStyle={[
            styles.inlinePaperScrollContent,
            { paddingBottom: Math.max(insets.bottom, 16) + 80 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Search Bar */}
          <View style={styles.authoritiesSearchBox}>
            <Ionicons name="search" size={17} color="#0F172A" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.authoritiesSearchInput}
              placeholder="Tashkilot nomi yoki 1159 ni qidiring..."
              placeholderTextColor="#94A3B8"
              value={authoritiesSearchQuery}
              onChangeText={setAuthoritiesSearchQuery}
            />
            {authoritiesSearchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setAuthoritiesSearchQuery('')}>
                <Ionicons name="close-circle" size={17} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>

          {/* Category Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.authoritiesCatScroll}
          >
            {[
              { key: 'all', label: 'Barchasi' },
              { key: 'komitet', label: 'Raqobat qo‘mitasi (1159)' },
              { key: 'federatsiya', label: 'Federatsiya (1091)' },
              { key: 'ses', label: 'SES (Oziq-ovqat)' },
              { key: 'standart', label: 'Standart (1200)' },
              { key: 'sud', label: 'Sudlar (1100)' },
            ].map((cat) => (
              <TouchableOpacity
                key={cat.key}
                style={[
                  styles.authoritiesCatChip,
                  authoritiesCategory === cat.key && styles.authoritiesCatChipActive,
                ]}
                activeOpacity={0.8}
                onPress={() => setAuthoritiesCategory(cat.key as any)}
              >
                <Text
                  style={[
                    styles.authoritiesCatChipText,
                    authoritiesCategory === cat.key && styles.authoritiesCatChipTextActive,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Organizations Cards */}
          {filteredAuthorities.map((item) => (
            <View key={item.id} style={styles.authOrgCard}>
              <View style={styles.authCardHeaderRow}>
                <View style={[styles.authIconCircle, { backgroundColor: item.badgeBg }]}>
                  <Ionicons name={item.icon as any} size={22} color={item.themeColor} />
                </View>
                <View style={styles.authTitleCol}>
                  <View style={[styles.authBadgePill, { backgroundColor: item.badgeBg }]}>
                    <Text style={[styles.authBadgePillText, { color: item.themeColor }]}>
                      {item.roleBadge}
                    </Text>
                  </View>
                  <Text style={styles.authNameText}>{item.name}</Text>
                </View>
              </View>

              <Text style={styles.authScopeText}>{item.scope}</Text>

              <View style={styles.authContactsBox}>
                <TouchableOpacity
                  style={styles.authContactRow}
                  activeOpacity={0.7}
                  onPress={() => handleCallPhone(item.callNum)}
                >
                  <Ionicons name="call" size={15} color="#16A34A" />
                  <Text style={styles.authContactPhoneText}>
                    Ishonch telefoni: <Text style={{ fontWeight: '800', color: '#16A34A' }}>{item.short}</Text>
                  </Text>
                  <Ionicons name="chevron-forward" size={14} color="#94A3B8" style={{ marginLeft: 'auto' }} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.authContactRow}
                  activeOpacity={0.7}
                  onPress={() => handleOpenWebsite(item.web)}
                >
                  <Ionicons name="globe-outline" size={15} color="#2563EB" />
                  <Text style={styles.authContactWebText}>{item.web}</Text>
                  <Ionicons name="open-outline" size={14} color="#94A3B8" style={{ marginLeft: 'auto' }} />
                </TouchableOpacity>

                <View style={styles.authInfoRow}>
                  <Ionicons name="location-outline" size={15} color="#64748B" />
                  <Text style={styles.authInfoText}>{item.address}</Text>
                </View>

                <View style={styles.authInfoRow}>
                  <Ionicons name="time-outline" size={15} color="#64748B" />
                  <Text style={styles.authInfoText}>{item.hours}</Text>
                </View>
              </View>

              <View style={styles.authActionsRow}>
                <TouchableOpacity
                  style={styles.authCallBtn}
                  activeOpacity={0.8}
                  onPress={() => handleCallPhone(item.callNum)}
                >
                  <Ionicons name="call" size={15} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.authCallBtnText}>Qo‘ng‘iroq qilish</Text>
                </TouchableOpacity>

                {item.docTemplateKey ? (
                  <TouchableOpacity
                    style={styles.authDocBtn}
                    activeOpacity={0.8}
                    onPress={() => {
                      const tpl = CONSUMER_DOC_TEMPLATES.find((t) => t.id === item.docTemplateKey);
                      setShowAuthoritiesScreen(false);
                      setActiveTab('documents');
                      handleOpenConstructor(tpl);
                    }}
                  >
                    <Ionicons name="document-text" size={15} color="#0F172A" style={{ marginRight: 6 }} />
                    <Text style={styles.authDocBtnText}>Ariza yaratish</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          ))}

          {/* 4 Golden Rules Box */}
          <View style={styles.authRulesCard}>
            <View style={styles.authRulesTitleRow}>
              <Ionicons name="ribbon-outline" size={20} color="#D97706" />
              <Text style={styles.authRulesTitle}>Rasmiy organga murojaat qilishning 4 oltin qoidasi:</Text>
            </View>

            <View style={styles.authRuleItem}>
              <Text style={styles.authRuleBullet}>1.</Text>
              <Text style={styles.authRuleText}>Avval sotuvchiga yozma talabnoma topshiring (og‘zaki gap sudda dalil bo‘lmaydi).</Text>
            </View>
            <View style={styles.authRuleItem}>
              <Text style={styles.authRuleBullet}>2.</Text>
              <Text style={styles.authRuleText}>Chek, kafolat taloni yoki to‘lov skrinshotini saqlab, arizangizga ilova qiling.</Text>
            </View>
            <View style={styles.authRuleItem}>
              <Text style={styles.authRuleBullet}>3.</Text>
              <Text style={styles.authRuleText}>1159 va 1091 raqamlariga qo‘ng‘iroq qilish va shikoyat yuborish bepul.</Text>
            </View>
            <View style={styles.authRuleItem}>
              <Text style={styles.authRuleBullet}>4.</Text>
              <Text style={styles.authRuleText}>Qonunning 27-moddasiga binoan iste’molchilar sudlarda davlat boji to‘lashdan butunlay ozod qilingan.</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      {/* ===================== 1. TOP HEADER BAR ===================== */}
      <View style={styles.topHeader}>
        {/* Left: Back Button + Navy Circle with Bag Icon + Title & Subtitle */}
        <View style={styles.headerLeftGroup}>
          <TouchableOpacity
            style={styles.headerBackBtn}
            activeOpacity={0.7}
            onPress={handleHeaderBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={20} color="#0F172A" />
          </TouchableOpacity>

          <View style={styles.headerIconCircle}>
            <Ionicons
              name={
                selectedQuickIssue
                  ? selectedQuickIssue.icon
                  : showProofsScreen
                  ? 'folder-open'
                  : showAuthoritiesScreen
                  ? 'business'
                  : previewDoc || isConstructorVisible
                  ? 'document-text'
                  : 'bag-handle'
              }
              size={19}
              color="#FFFFFF"
            />
          </View>

          <View style={styles.headerTitlesCol}>
            <Text style={styles.headerMainTitle}>
              {selectedQuickIssue
                ? 'Tezkor yechim'
                : showProofsScreen
                ? 'Dalillarim'
                : showAuthoritiesScreen
                ? 'Rasmiy tashkilotlar'
                : previewDoc
                ? 'Hujjat ko‘rish'
                : isConstructorVisible
                ? 'Hujjat konstruktori'
                : 'Iste’molçi huquqlari'}
            </Text>
            <Text style={styles.headerSubtitle} numberOfLines={1}>
              {selectedQuickIssue
                ? selectedQuickIssue.title
                : showProofsScreen
                ? 'Shaxsiy himoya arxivi (Chek, kafolat, foto)'
                : showAuthoritiesScreen
                ? 'Davlat organlari va ishonch telefonlari'
                : previewDoc
                ? previewDoc.title
                : isConstructorVisible
                ? 'Rasmiy talabnoma va ariza yaratish'
                : 'Xaridorlar uçun huquqiy yordam'}
            </Text>
          </View>
        </View>
      </View>

      {/* ===================== 2. MAIN BODY AREA ===================== */}
      {selectedQuickIssue ? (
        renderQuickIssueDetail()
      ) : showProofsScreen ? (
        renderProofsScreen()
      ) : showAuthoritiesScreen ? (
        renderAuthoritiesScreen()
      ) : activeTab === 'documents' && previewDoc ? (
        renderDocPreview()
      ) : activeTab === 'documents' && isConstructorVisible ? (
        renderDocConstructor()
      ) : (
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, 16) + 72 },
          ]}
          showsVerticalScrollIndicator={false}
        >
        {activeTab === 'home' && (
          <>
            {/* 1. HERO BANNER SWIPER */}
            <View style={styles.heroSwiperOuter}>
              <ScrollView
                ref={bannerScrollRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                decelerationRate="fast"
                snapToInterval={BANNER_WIDTH}
                snapToAlignment="start"
                contentContainerStyle={{ gap: 0 }}
                onMomentumScrollEnd={(e) => {
                  const idx = Math.round(e.nativeEvent.contentOffset.x / BANNER_WIDTH);
                  if (idx >= 0 && idx < HERO_BANNER_SLIDES.length) {
                    setHeroSlideIdx(idx);
                  }
                }}
              >
                {HERO_BANNER_SLIDES.map((slide) => (
                  <View key={slide.id} style={[styles.heroCardOuter, { width: BANNER_WIDTH }]}>
                    <LinearGradient
                      colors={slide.colors}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.heroGradient}
                    >
                      {/* Left Content */}
                      <View style={styles.heroLeftCol}>
                        <View style={[styles.heroSlideBadge, { backgroundColor: slide.badgeBg }]}>
                          <Text style={[styles.heroSlideBadgeText, { color: slide.badgeColor }]}>
                            {slide.badge}
                          </Text>
                        </View>
                        <Text style={styles.heroTitle}>
                          {slide.titlePart1}
                          <Text style={styles.heroTitleGold}>{slide.titleGold}</Text>
                        </Text>

                        <Text style={styles.heroSubtitle}>
                          {slide.subtitle}
                        </Text>

                        <TouchableOpacity
                          style={styles.heroCtaBtn}
                          activeOpacity={0.85}
                          onPress={() => handleHeroSlideCta(slide)}
                        >
                          <Text style={styles.heroCtaText}>{slide.ctaText}</Text>
                          <Ionicons name="arrow-forward" size={13} color="#0F172A" style={{ marginLeft: 4 }} />
                        </TouchableOpacity>
                      </View>

                      {/* Right 3D Illustration Graphic */}
                      <View style={styles.heroGraphicWrap}>
                        <Image
                          source={heroGraphic}
                          style={styles.heroGraphicImg}
                          resizeMode="contain"
                        />
                      </View>
                    </LinearGradient>
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* Pagination Dots */}
            <View style={styles.paginationRow}>
              {HERO_BANNER_SLIDES.map((slide, idx) => (
                <TouchableOpacity
                  key={slide.id}
                  onPress={() => {
                    setHeroSlideIdx(idx);
                    bannerScrollRef.current?.scrollTo({ x: idx * BANNER_WIDTH, animated: true });
                  }}
                  style={idx === heroSlideIdx ? styles.dotActive : styles.dotInactive}
                />
              ))}
            </View>

            {/* 2. AI YORDAMCHI CARD */}
            <TouchableOpacity
              style={styles.aiCard}
              activeOpacity={0.88}
              onPress={() => setActiveTab('ai')}
            >
              {/* Robot Avatar */}
              <View style={styles.aiRobotBox}>
                <Image
                  source={mehnatAiRobot}
                  style={styles.aiRobotImg}
                  resizeMode="contain"
                />
              </View>

              {/* Text Column */}
              <View style={styles.aiTextCol}>
                <View style={styles.aiTitleRow}>
                  <Text style={styles.aiTitle}>AI Yordamçi</Text>
                  <Ionicons name="sparkles" size={13} color="#6366F1" style={{ marginLeft: 5 }} />
                </View>
                <Text style={styles.aiSubtitle}>
                  Iste’molçi huquqlari böyiça savolingizga tez javob oling.
                </Text>
              </View>

              {/* Arrow Button */}
              <View style={styles.aiArrowCircle}>
                <Ionicons name="arrow-forward" size={16} color="#4F46E5" />
              </View>
            </TouchableOpacity>

            {/* 3. TEZKOR MUAMMOLAR (2x2 Grid) */}
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Tezkor muammolar</Text>
              <TouchableOpacity activeOpacity={0.7} onPress={() => setActiveTab('rights')}>
                <Text style={styles.seeAllText}>Barçasini köriş →</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.quickIssuesGrid}>
              {/* Card 1: Sifatsiz mahsulot */}
              <TouchableOpacity
                style={[styles.quickIssueCard, { backgroundColor: '#FFF1F2', borderColor: '#FFE4E6' }]}
                activeOpacity={0.8}
                onPress={() => handleQuickIssuePress('sifatsiz')}
              >
                <View style={styles.quickIssueIconWrap}>
                  <Ionicons name="cube-outline" size={22} color="#E11D48" />
                </View>
                <Text style={styles.quickIssueTitle}>Sifatsiz{'\n'}mahsulot</Text>
                <Ionicons name="arrow-forward" size={14} color="#94A3B8" />
              </TouchableOpacity>

              {/* Card 2: Kafolat bilan bog'liq muammo */}
              <TouchableOpacity
                style={[styles.quickIssueCard, { backgroundColor: '#EFF6FF', borderColor: '#DBEAFE' }]}
                activeOpacity={0.8}
                onPress={() => handleQuickIssuePress('kafolat')}
              >
                <View style={styles.quickIssueIconWrap}>
                  <Ionicons name="shield-checkmark-outline" size={22} color="#2563EB" />
                </View>
                <Text style={styles.quickIssueTitle}>Kafolat{'\n'}bilan boğliq muammo</Text>
                <Ionicons name="arrow-forward" size={14} color="#94A3B8" />
              </TouchableOpacity>

              {/* Card 3: Qaytarish yoki almashtirish */}
              <TouchableOpacity
                style={[styles.quickIssueCard, { backgroundColor: '#F0FDF4', borderColor: '#DCFCE7' }]}
                activeOpacity={0.8}
                onPress={() => handleQuickIssuePress('qaytarish')}
              >
                <View style={styles.quickIssueIconWrap}>
                  <Ionicons name="sync-outline" size={22} color="#16A34A" />
                </View>
                <Text style={styles.quickIssueTitle}>Qaytariş yoki{'\n'}almaştiriş</Text>
                <Ionicons name="arrow-forward" size={14} color="#94A3B8" />
              </TouchableOpacity>

              {/* Card 4: Xizmat sifati va boshqa muammolar */}
              <TouchableOpacity
                style={[styles.quickIssueCard, { backgroundColor: '#FFFBEB', borderColor: '#FEF3C7' }]}
                activeOpacity={0.8}
                onPress={() => handleQuickIssuePress('xizmat')}
              >
                <View style={styles.quickIssueIconWrap}>
                  <Ionicons name="headset-outline" size={22} color="#D97706" />
                </View>
                <Text style={styles.quickIssueTitle}>Xizmat sifati{'\n'}va boşqa muammolar</Text>
                <Ionicons name="arrow-forward" size={14} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            {/* 4. ASOSIY XIZMATLAR (4 Cards Row) */}
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Asosiy xizmatlar</Text>
            </View>

            <View style={styles.mainServicesRow}>
              {/* Service 1: Iste'molchi huquqlari */}
              <TouchableOpacity
                style={styles.mainServiceCard}
                activeOpacity={0.8}
                onPress={() => handleServicePress('rights')}
              >
                <Ionicons name="book-outline" size={24} color="#B45309" style={{ marginBottom: 6 }} />
                <Text style={styles.mainServiceTitle}>Iste’molçi{'\n'}huquqlari</Text>
                <Text style={styles.mainServiceSubtitle}>Ma’lumot va{'\n'}tuşuntirişlar</Text>
              </TouchableOpacity>

              {/* Service 2: Hujjatlar markazi */}
              <TouchableOpacity
                style={styles.mainServiceCard}
                activeOpacity={0.8}
                onPress={() => handleServicePress('docs')}
              >
                <Ionicons name="document-text-outline" size={24} color="#B45309" style={{ marginBottom: 6 }} />
                <Text style={styles.mainServiceTitle}>Hujjatlar{'\n'}markazi</Text>
                <Text style={styles.mainServiceSubtitle}>Talabnoma va{'\n'}şikoyatlar</Text>
              </TouchableOpacity>

              {/* Service 3: Dalillarim */}
              <TouchableOpacity
                style={styles.mainServiceCard}
                activeOpacity={0.8}
                onPress={() => handleServicePress('proofs')}
              >
                <Ionicons name="image-outline" size={24} color="#B45309" style={{ marginBottom: 6 }} />
                <Text style={styles.mainServiceTitle}>Dalillarim</Text>
                <Text style={styles.mainServiceSubtitle}>Çek, kafolat va{'\n'}rasmlarni saqlaş</Text>
              </TouchableOpacity>

              {/* Service 4: Rasmiy tashkilotlar */}
              <TouchableOpacity
                style={styles.mainServiceCard}
                activeOpacity={0.8}
                onPress={() => handleServicePress('authorities')}
              >
                <Ionicons name="business-outline" size={24} color="#B45309" style={{ marginBottom: 6 }} />
                <Text style={styles.mainServiceTitle}>Rasmiy{'\n'}taşkilotlar</Text>
                <Text style={styles.mainServiceSubtitle}>Qayerga murojaat{'\n'}qiliş mumkin?</Text>
              </TouchableOpacity>
            </View>

            {/* 5. SO'NGGI HUJJATLAR */}
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Sönggi hujjatlar</Text>
              <TouchableOpacity activeOpacity={0.7} onPress={() => setActiveTab('documents')}>
                <Text style={styles.seeAllText}>Barçasini köriş →</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.docItemCard}
              activeOpacity={0.85}
              onPress={() => {
                Alert.alert(
                  'Sotuvçiga talabnoma (Prevyu)',
                  '📄 Hujjat: Sifatsiz tovar pulini qaytarish haqida talabnoma\nSana: Bugun, 14:26 • 412 KB\nHolat: Tayyor\n\nYuklab olish formatini tanlang:',
                  [
                    { text: 'Bekor qiliş', style: 'cancel' },
                    { text: 'PDF Saqlash', onPress: () => Alert.alert('PDF', 'Hujjat PDF shaklida yuklab olindi.') },
                    { text: 'Tahrirlash', onPress: () => setActiveTab('documents') },
                  ]
                );
              }}
            >
              {/* PDF Badge */}
              <View style={styles.pdfBadge}>
                <Text style={styles.pdfBadgeText}>PDF</Text>
              </View>

              {/* Document Meta */}
              <View style={styles.docInfoCol}>
                <Text style={styles.docItemTitle} numberOfLines={1}>
                  Sotuvçiga talabnoma
                </Text>
                <Text style={styles.docItemMeta}>Bugun, 14:26 • 412 KB</Text>
              </View>

              {/* Status Badge */}
              <View style={styles.docStatusRow}>
                <View style={styles.docStatusPill}>
                  <Ionicons name="checkmark-circle" size={13} color="#16A34A" style={{ marginRight: 4 }} />
                  <Text style={styles.docStatusText}>Tayyor</Text>
                </View>

                <TouchableOpacity
                  style={styles.docMoreBtn}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  onPress={() => {
                    Share.share({
                      message: 'Sotuvçiga talabnoma andozasi — Yordam Iste’molçi Huquqlari mini ilovasi orqali shakllantirildi.',
                    });
                  }}
                >
                  <Ionicons name="ellipsis-vertical" size={16} color="#94A3B8" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </>
        )}

        {/* ===================== TAB 2: HUQUQLAR SAHIFASI (1:1 Screenshot Design) ===================== */}
        {activeTab === 'rights' && (
          <View style={styles.rightsTabRoot}>
            {/* Fully Rounded Pill Search Bar */}
            <View style={styles.rightsSearchBox}>
              <Ionicons name="search" size={18} color="#0F172A" style={{ marginRight: 10 }} />
              <TextInput
                style={styles.rightsSearchInput}
                placeholder="Mavzu yoki savolni qidiring..."
                placeholderTextColor="#94A3B8"
                value={rightsSearchQuery}
                onChangeText={setRightsSearchQuery}
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
              contentContainerStyle={styles.rightsCategoryScroll}
            >
              <TouchableOpacity
                style={[
                  styles.rightsCategoryPill,
                  rightsFilter === 'all'
                    ? styles.rightsCategoryPillActive
                    : styles.rightsCategoryPillInactive,
                ]}
                activeOpacity={0.8}
                onPress={() => setRightsFilter('all')}
              >
                <Ionicons
                  name="grid"
                  size={14}
                  color={rightsFilter === 'all' ? '#FFFFFF' : '#0F172A'}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[
                    styles.rightsCategoryText,
                    rightsFilter === 'all' && styles.rightsCategoryTextActive,
                  ]}
                >
                  Barça mavzular
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.rightsCategoryPill,
                  rightsFilter === 'basic'
                    ? styles.rightsCategoryPillActive
                    : styles.rightsCategoryPillInactive,
                ]}
                activeOpacity={0.8}
                onPress={() => setRightsFilter('basic')}
              >
                <Ionicons
                  name="shield-checkmark-outline"
                  size={15}
                  color={rightsFilter === 'basic' ? '#FFFFFF' : '#0F172A'}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[
                    styles.rightsCategoryText,
                    rightsFilter === 'basic' && styles.rightsCategoryTextActive,
                  ]}
                >
                  Asosiy huquqlar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.rightsCategoryPill,
                  rightsFilter === 'popular'
                    ? styles.rightsCategoryPillActive
                    : styles.rightsCategoryPillInactive,
                ]}
                activeOpacity={0.8}
                onPress={() => setRightsFilter('popular')}
              >
                <Ionicons
                  name="help-circle-outline"
                  size={15}
                  color={rightsFilter === 'popular' ? '#FFFFFF' : '#0F172A'}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[
                    styles.rightsCategoryText,
                    rightsFilter === 'popular' && styles.rightsCategoryTextActive,
                  ]}
                >
                  Köp söraladigan
                </Text>
              </TouchableOpacity>
            </ScrollView>

            {/* 4. 6 Topic Cards List */}
            <View style={styles.rightsListWrap}>
              {filteredRightsTopics.length === 0 ? (
                <View style={styles.rightsEmptyWrap}>
                  <Ionicons name="search-outline" size={32} color="#CBD5E1" style={{ marginBottom: 8 }} />
                  <Text style={styles.rightsEmptyTitle}>Mavzu topilmadi</Text>
                  <Text style={styles.rightsEmptySub}>«{rightsSearchQuery}» böyiça heç qanday natija çiqmadi.</Text>
                </View>
              ) : (
                filteredRightsTopics.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.rightsCardItem}
                    activeOpacity={0.78}
                    onPress={() => handleTopicPress(item)}
                  >
                    <View
                      style={[
                        styles.rightsCardIconWrap,
                        { backgroundColor: item.iconBg, borderColor: item.iconBorder },
                      ]}
                    >
                      <Ionicons name={item.icon as any} size={22} color={item.iconColor} />
                    </View>

                    <View style={styles.rightsCardTextCol}>
                      <Text style={styles.rightsCardTitle} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text style={styles.rightsCardDesc} numberOfLines={2}>
                        {item.desc}
                      </Text>
                    </View>

                    <Ionicons name="chevron-forward" size={16} color="#64748B" />
                  </TouchableOpacity>
                ))
              )}
            </View>

            {/* 5. Asosiy qonun va hujjatlar Featured Callout Banner */}
            <TouchableOpacity
              style={styles.rightsCalloutCard}
              activeOpacity={0.88}
              onPress={handleOpenAsosiyQonunlar}
            >
              <View style={styles.rightsCalloutIconWrap}>
                <Ionicons name="scale-outline" size={28} color="#D97706" />
              </View>

              <View style={styles.rightsCalloutTextCol}>
                <Text style={styles.rightsCalloutTitle}>Asosiy qonun va hujjatlar</Text>
                <Text style={styles.rightsCalloutSubtitle}>
                  Iste’molçilar huquqlarini himoya qiluvçi asosiy qonunlar va rasmiy hujjatlar.
                </Text>
              </View>

              <View style={styles.rightsCalloutCtaWrap}>
                <Text style={styles.rightsCalloutCtaText}>Köriş →</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* ===================== TAB 3: AI YORDAMCHI ===================== */}
        {activeTab === 'ai' && (
          <View style={styles.tabContentWrap}>
            <View style={styles.aiStatusBanner}>
              <View style={styles.aiStatusDot} />
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.aiStatusTitle}>Iste’molchi Huquqlari AI</Text>
                <Text style={styles.aiStatusSub}>Qonunlar va Raqobat qo‘mitasi amaliyoti bazasi ulangan</Text>
              </View>
              <View style={styles.aiLiveBadge}>
                <Text style={styles.aiLiveBadgeText}>ONLINE</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Tezkor savollar</Text>
            <View style={styles.aiPromptChipsWrap}>
              {[
                'Çeksiz tovar qaytarsa böladimi?',
                'Kafolat talonini yöqotsam nima qilay?',
                'Onlayn do‘kondan buyurtma rad etilsa?',
                'Mahsulot ta’mirga berilganda uning o‘rniga vaqtinchalik tovar beriladimi?',
              ].map((prompt, pIdx) => (
                <TouchableOpacity
                  key={pIdx}
                  style={styles.aiPromptChip}
                  activeOpacity={0.75}
                  onPress={() => handleSendAi(prompt)}
                >
                  <Ionicons name="chatbubble-ellipses-outline" size={13} color="#D97706" style={{ marginRight: 6 }} />
                  <Text style={styles.aiPromptChipText}>{prompt}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Suhbat tarixi</Text>
            <View style={styles.chatListWrap}>
              {aiChatMessages.map((msg) => (
                <View
                  key={msg.id}
                  style={[
                    styles.chatBubble,
                    msg.sender === 'user' ? styles.chatBubbleUser : styles.chatBubbleBot,
                  ]}
                >
                  <View style={styles.chatSenderRow}>
                    <Ionicons
                      name={msg.sender === 'user' ? 'person-circle-outline' : 'sparkles'}
                      size={14}
                      color={msg.sender === 'user' ? '#FFFFFF' : '#D97706'}
                      style={{ marginRight: 4 }}
                    />
                    <Text style={[styles.chatSenderName, msg.sender === 'user' && { color: '#FFFFFF' }]}>
                      {msg.sender === 'user' ? 'Siz' : 'AI Huquqshunos'}
                    </Text>
                    <Text style={[styles.chatTimeText, msg.sender === 'user' && { color: 'rgba(255,255,255,0.7)' }]}>
                      {msg.time}
                    </Text>
                  </View>
                  <Text style={[styles.chatMsgText, msg.sender === 'user' && { color: '#FFFFFF' }]}>
                    {msg.text}
                  </Text>
                </View>
              ))}
            </View>

            {/* AI Input Row */}
            <View style={styles.aiInputRow}>
              <TextInput
                style={styles.aiTextInput}
                placeholder="Muammoingizni yozing..."
                placeholderTextColor="#94A3B8"
                value={aiQuestion}
                onChangeText={setAiQuestion}
              />
              <TouchableOpacity
                style={[styles.aiSendBtn, aiQuestion.trim().length > 0 && styles.aiSendBtnActive]}
                onPress={() => handleSendAi()}
              >
                <Ionicons name="arrow-up" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ===================== TAB 4: HUJJATLAR ===================== */}
        {activeTab === 'documents' && (
          <View style={styles.tabContentWrap}>
            {CONSUMER_DOC_TEMPLATES.map((doc) => (
              <View key={doc.id} style={styles.docTemplateCard}>
                <View style={styles.docTemplateHeader}>
                  <View style={[styles.docTypeBadge, { backgroundColor: doc.typeBg }]}>
                    <Text style={[styles.docTypeBadgeText, { color: doc.typeColor }]}>{doc.type}</Text>
                  </View>
                </View>

                <Text style={styles.docTemplateTitle}>{doc.title}</Text>
                <Text style={styles.docTemplateDesc}>{doc.desc}</Text>

                <View style={styles.docTemplateActions}>
                  <TouchableOpacity
                    style={styles.docTemplateBtnSec}
                    activeOpacity={0.75}
                    onPress={() => setPreviewDoc(doc)}
                  >
                    <Ionicons name="eye-outline" size={15} color="#0F172A" style={{ marginRight: 5 }} />
                    <Text style={styles.docTemplateBtnSecText}>Köriş</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.docTemplateBtnPrim}
                    activeOpacity={0.8}
                    onPress={() => handleOpenConstructor(doc)}
                  >
                    <Ionicons name="create-outline" size={15} color="#FFFFFF" style={{ marginRight: 5 }} />
                    <Text style={styles.docTemplateBtnPrimText}>Yaratish</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
      )}

      {/* ===================== 3. BOTTOM NAVBAR ===================== */}
      <View style={[styles.bottomNavbar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
        {/* Tab 1: Bosh sahifa */}
        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
          onPress={() => {
            setPreviewDoc(null);
            setIsConstructorVisible(false);
            setSelectedQuickIssue(null);
            setShowProofsScreen(false);
            setShowAuthoritiesScreen(false);
            setActiveTab('home');
          }}
        >
          <Ionicons
            name={
              (activeTab === 'home' || selectedQuickIssue !== null || showProofsScreen || showAuthoritiesScreen) &&
              !previewDoc &&
              !isConstructorVisible
                ? 'home'
                : 'home-outline'
            }
            size={22}
            color={
              (activeTab === 'home' || selectedQuickIssue !== null || showProofsScreen || showAuthoritiesScreen) &&
              !previewDoc &&
              !isConstructorVisible
                ? '#EAB308'
                : '#64748B'
            }
          />
          <Text
            style={[
              styles.navLabel,
              (activeTab === 'home' || selectedQuickIssue !== null || showProofsScreen || showAuthoritiesScreen) &&
              !previewDoc &&
              !isConstructorVisible
                ? styles.navLabelActive
                : styles.navLabelInactive,
            ]}
          >
            Boş sahifa
          </Text>
        </TouchableOpacity>

        {/* Tab 2: Huquqlar */}
        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
          onPress={() => {
            setPreviewDoc(null);
            setIsConstructorVisible(false);
            setSelectedQuickIssue(null);
            setShowProofsScreen(false);
            setShowAuthoritiesScreen(false);
            setActiveTab('rights');
          }}
        >
          <Ionicons
            name={
              activeTab === 'rights' &&
              !selectedQuickIssue &&
              !showProofsScreen &&
              !showAuthoritiesScreen &&
              !previewDoc &&
              !isConstructorVisible
                ? 'book'
                : 'book-outline'
            }
            size={22}
            color={
              activeTab === 'rights' &&
              !selectedQuickIssue &&
              !showProofsScreen &&
              !showAuthoritiesScreen &&
              !previewDoc &&
              !isConstructorVisible
                ? '#EAB308'
                : '#64748B'
            }
          />
          <Text
            style={[
              styles.navLabel,
              activeTab === 'rights' &&
              !selectedQuickIssue &&
              !showProofsScreen &&
              !showAuthoritiesScreen &&
              !previewDoc &&
              !isConstructorVisible
                ? styles.navLabelActive
                : styles.navLabelInactive,
            ]}
          >
            Huquqlar
          </Text>
        </TouchableOpacity>

        {/* Tab 3: AI yordamchi */}
        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
          onPress={() => {
            setPreviewDoc(null);
            setIsConstructorVisible(false);
            setSelectedQuickIssue(null);
            setShowProofsScreen(false);
            setShowAuthoritiesScreen(false);
            setActiveTab('ai');
          }}
        >
          <Ionicons
            name={
              activeTab === 'ai' &&
              !selectedQuickIssue &&
              !showProofsScreen &&
              !showAuthoritiesScreen &&
              !previewDoc &&
              !isConstructorVisible
                ? 'chatbubble-ellipses'
                : 'chatbubble-ellipses-outline'
            }
            size={22}
            color={
              activeTab === 'ai' &&
              !selectedQuickIssue &&
              !showProofsScreen &&
              !showAuthoritiesScreen &&
              !previewDoc &&
              !isConstructorVisible
                ? '#EAB308'
                : '#64748B'
            }
          />
          <Text
            style={[
              styles.navLabel,
              activeTab === 'ai' &&
              !selectedQuickIssue &&
              !showProofsScreen &&
              !showAuthoritiesScreen &&
              !previewDoc &&
              !isConstructorVisible
                ? styles.navLabelActive
                : styles.navLabelInactive,
            ]}
          >
            AI yordamçi
          </Text>
        </TouchableOpacity>

        {/* Tab 4: Hujjatlar */}
        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
          onPress={() => {
            setPreviewDoc(null);
            setIsConstructorVisible(false);
            setSelectedQuickIssue(null);
            setShowProofsScreen(false);
            setShowAuthoritiesScreen(false);
            setActiveTab('documents');
          }}
        >
          <Ionicons
            name={activeTab === 'documents' || previewDoc || isConstructorVisible ? 'document-text' : 'document-text-outline'}
            size={22}
            color={activeTab === 'documents' || previewDoc || isConstructorVisible ? '#EAB308' : '#64748B'}
          />
          <Text style={[styles.navLabel, (activeTab === 'documents' || previewDoc || isConstructorVisible) ? styles.navLabelActive : styles.navLabelInactive]}>
            Hujjatlar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  // Top Header
  topHeader: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerLeftGroup: {
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
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  headerIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#0B192C',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0B192C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitlesCol: {
    marginLeft: 10,
    flex: 1,
  },
  headerMainTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 1,
  },
  headerRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  notificationRedDot: {
    position: 'absolute',
    top: 6,
    right: 7,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  // Scroll Area
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 14,
  },
  // Hero Card
  heroCardOuter: {
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#07192F',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  heroGradient: {
    flexDirection: 'row',
    padding: 18,
    alignItems: 'center',
    minHeight: 185,
  },
  heroLeftCol: {
    flex: 1.25,
    paddingRight: 6,
    zIndex: 2,
  },
  heroTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  heroTitleGold: {
    color: '#FBBF24',
  },
  heroSubtitle: {
    fontSize: 11,
    color: '#CBD5E1',
    lineHeight: 15,
    marginTop: 6,
    marginBottom: 12,
    fontWeight: '400',
  },
  heroCtaBtn: {
    backgroundColor: '#F59E0B',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 3,
  },
  heroCtaText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  heroGraphicWrap: {
    flex: 0.95,
    height: 145,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroGraphicImg: {
    width: '100%',
    height: '100%',
  },
  // Pagination Dots
  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: -4,
    marginBottom: 2,
  },
  dotActive: {
    width: 16,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#F59E0B',
  },
  dotInactive: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#CBD5E1',
  },
  // AI Yordamchi Card
  aiCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E0E7FF',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  aiRobotBox: {
    width: 52,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiRobotImg: {
    width: '100%',
    height: '100%',
  },
  aiTextCol: {
    flex: 1,
    marginLeft: 10,
    marginRight: 6,
  },
  aiTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  aiSubtitle: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
    marginTop: 2,
    fontWeight: '500',
  },
  aiArrowCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Section Headers
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  // 2x2 Grid (Tezkor muammolar)
  quickIssuesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  quickIssueCard: {
    width: (width - 42) / 2,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 64,
  },
  quickIssueIconWrap: {
    marginRight: 10,
  },
  quickIssueTitle: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 16,
  },
  // 4 Cards Row (Asosiy xizmatlar)
  mainServicesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  mainServiceCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  mainServiceTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    lineHeight: 14,
  },
  mainServiceSubtitle: {
    fontSize: 8.5,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 3,
    lineHeight: 11,
  },
  // So'nggi hujjatlar
  docItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  pdfBadge: {
    width: 38,
    height: 42,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  pdfBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#DC2626',
  },
  docInfoCol: {
    flex: 1,
    marginLeft: 12,
  },
  docItemTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  docItemMeta: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  docStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  docStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  docStatusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16A34A',
  },
  docMoreBtn: {
    padding: 2,
  },
  // Tab Content styles
  tabContentWrap: {
    gap: 12,
    paddingTop: 4,
  },
  tabHeader: {
    marginBottom: 4,
  },
  tabHeaderTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  tabHeaderSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 17,
  },
  // Rights Tab (1:1 Screenshot Design)
  rightsTabRoot: {
    paddingTop: 4,
  },
  rightsPageTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  rightsPageSub: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    fontWeight: '500',
    marginBottom: 16,
  },
  rightsSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    height: 48,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  rightsSearchInput: {
    flex: 1,
    fontSize: 13.5,
    color: '#0F172A',
  },
  rightsCategoryScroll: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  rightsCategoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
  },
  rightsCategoryPillActive: {
    backgroundColor: '#0A192F',
    borderColor: '#0A192F',
  },
  rightsCategoryPillInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  rightsCategoryText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#0F172A',
  },
  rightsCategoryTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  rightsListWrap: {
    gap: 10,
    marginBottom: 14,
  },
  rightsEmptyWrap: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  rightsEmptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  rightsEmptySub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  rightsCardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  rightsCardIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
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
    lineHeight: 16,
    fontWeight: '500',
  },
  rightsCalloutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFDF0',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: '#FEF3C7',
    marginBottom: 14,
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  rightsCalloutIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rightsCalloutTextCol: {
    flex: 1,
    paddingRight: 6,
  },
  rightsCalloutTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  rightsCalloutSubtitle: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
    fontWeight: '500',
  },
  rightsCalloutCtaWrap: {
    paddingLeft: 4,
  },
  rightsCalloutCtaText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#D97706',
  },
  // AI Tab
  aiStatusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    elevation: 2,
  },
  aiStatusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#16A34A',
  },
  aiStatusTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  aiStatusSub: {
    fontSize: 10.5,
    color: '#64748B',
  },
  aiLiveBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  aiLiveBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#16A34A',
  },
  aiPromptChipsWrap: {
    gap: 6,
  },
  aiPromptChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  aiPromptChipText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '500',
  },
  chatListWrap: {
    gap: 10,
  },
  chatBubble: {
    borderRadius: 16,
    padding: 12,
    maxWidth: '90%',
  },
  chatBubbleUser: {
    alignSelf: 'flex-end',
    backgroundColor: '#0F172A',
  },
  chatBubbleBot: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    elevation: 2,
  },
  chatSenderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatSenderName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D97706',
    flex: 1,
  },
  chatTimeText: {
    fontSize: 9.5,
    color: '#94A3B8',
  },
  chatMsgText: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#1E293B',
  },
  aiInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 8,
  },
  aiTextInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    height: 38,
  },
  aiSendBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  aiSendBtnActive: {
    backgroundColor: '#D97706',
  },
  // Documents Tab
  docTemplateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    elevation: 2,
  },
  docTemplateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  docTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  docTypeBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
  },
  docFreeBadge: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#16A34A',
  },
  docTemplateTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  docTemplateDesc: {
    fontSize: 11.5,
    color: '#64748B',
    lineHeight: 16,
    marginBottom: 12,
  },
  docTemplateActions: {
    flexDirection: 'row',
    gap: 8,
  },
  docTemplateBtnSec: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
  },
  docTemplateBtnSecText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  docTemplateBtnPrim: {
    flex: 1.4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
    backgroundColor: '#D97706',
    borderRadius: 10,
  },
  docTemplateBtnPrimText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
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
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 10,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navLabel: {
    fontSize: 10.5,
    marginTop: 2,
  },
  navLabelActive: {
    color: '#EAB308',
    fontWeight: '800',
  },
  navLabelInactive: {
    color: '#64748B',
    fontWeight: '500',
  },

  // Inline Document Preview & Constructor Styles
  inlinePageContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  inlineSubHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  inlineBackToCatalogBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingRight: 8,
  },
  inlineBackToCatalogText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A',
    marginLeft: 6,
  },
  inlineBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  inlineBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16A34A',
  },
  inlinePaperScroll: {
    flex: 1,
  },
  inlinePaperScrollContent: {
    paddingHorizontal: 14,
    paddingTop: 12,
  },
  officialPaperCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 14,
  },
  paperCrestBox: {
    alignItems: 'center',
    marginBottom: 14,
  },
  paperCrestTitle: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.4,
    textAlign: 'center',
    marginTop: 2,
  },
  paperCrestSubtitle: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
    textAlign: 'center',
    marginTop: 2,
    letterSpacing: 0.3,
  },
  paperDividerLine: {
    width: '60%',
    height: 1.5,
    backgroundColor: '#E2E8F0',
    marginTop: 8,
  },
  paperHeaderInfoCol: {
    alignSelf: 'flex-end',
    maxWidth: '85%',
    marginBottom: 16,
  },
  paperHeaderInfoText: {
    fontSize: 11.5,
    color: '#334155',
    lineHeight: 17,
    textAlign: 'right',
  },
  paperTitleCenterBox: {
    alignItems: 'center',
    marginBottom: 14,
  },
  paperDocMainTitle: {
    fontSize: 14.5,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: 0.3,
    lineHeight: 20,
  },
  paperDocLegalRef: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#D97706',
    marginTop: 4,
    textAlign: 'center',
  },
  paperDocContentText: {
    fontSize: 12.5,
    color: '#1E293B',
    lineHeight: 20,
    textAlign: 'justify',
    marginBottom: 16,
  },
  paperFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
    marginTop: 6,
  },
  paperFooterText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  paperSealStampBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 14,
  },
  paperSealStampText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#16A34A',
    letterSpacing: 0.5,
  },
  inlineFillInCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: 12,
  },
  inlineFillInIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#D97706',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inlineFillInTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#78350F',
    marginBottom: 2,
  },
  inlineFillInDesc: {
    fontSize: 11,
    color: '#92400E',
  },
  inlineDocActionRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  inlineDocSecondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 42,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  inlineDocSecondaryBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  inlineDocPrimaryBtn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 42,
    backgroundColor: '#D97706',
    borderRadius: 10,
  },
  inlineDocPrimaryBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Constructor Styles
  constructorTabsStrip: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 8,
  },
  constructorTabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  constructorTabBtnActive: {
    backgroundColor: '#0F172A',
  },
  constructorTabBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  constructorTabBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  constructorFieldTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  constructorTypePillGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
  },
  constructorTypeChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  constructorTypeChipActive: {
    backgroundColor: '#D97706',
    borderColor: '#D97706',
  },
  constructorTypeChipText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#475569',
  },
  constructorTypeChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
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
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
  },
  constructorTextInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
  },
  constructorTextArea: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    padding: 10,
    fontSize: 13,
    color: '#0F172A',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  constructorPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D97706',
    height: 46,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 20,
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  constructorPrimaryBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  constructorSuccessBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    marginBottom: 12,
  },
  constructorSuccessBannerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803D',
    marginLeft: 6,
    flex: 1,
  },

  // Swiper Banner Styles
  heroSwiperOuter: {
    borderRadius: 22,
    overflow: 'hidden',
  },
  heroSlideBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 8,
  },
  heroSlideBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Quick Issue Detail Screen Styles
  issueHeroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  issueIconLarge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  issueHeroTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 6,
  },
  issueHeroSubtitle: {
    fontSize: 12.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
  issueLegalQuoteCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: 12,
  },
  issueLegalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  issueLegalHeaderTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#B45309',
  },
  issueLegalQuoteText: {
    fontSize: 12,
    color: '#78350F',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  issueSectionBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  issueSectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  issueSectionTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  issueRightItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  issueCheckBullet: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  issueRightItemText: {
    fontSize: 12.5,
    color: '#334155',
    flex: 1,
    fontWeight: '600',
  },
  issueStepCard: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  issueStepNumCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  issueStepNumText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2563EB',
  },
  issueStepContent: {
    flex: 1,
  },
  issueStepTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  issueStepDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
  },
  issueWarningCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
    marginBottom: 14,
  },
  issueWarningTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  issueWarningTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#B91C1C',
  },
  issueWarningText: {
    fontSize: 12,
    color: '#991B1B',
    lineHeight: 17,
  },
  issueActionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
    marginBottom: 16,
  },
  issueActionsHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  issuePrimaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D97706',
    height: 44,
    borderRadius: 12,
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  issuePrimaryActionBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  issueSecondaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    backgroundColor: '#EFF6FF',
  },
  issueSecondaryActionBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#2563EB',
  },
  issuePillBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  issuePillBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },

  // Dalillarim Styles
  addProofHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D97706',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addProofHeaderBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  proofStatsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  proofStatBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  proofStatVal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  proofStatLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  proofFilterScroll: {
    gap: 6,
    paddingBottom: 10,
  },
  proofFilterChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  proofFilterChipActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  proofFilterChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  proofFilterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  proofLegalNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    marginBottom: 12,
  },
  proofLegalNoticeText: {
    fontSize: 11.5,
    color: '#0369A1',
    flex: 1,
    lineHeight: 16,
  },
  emptyProofBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 10,
  },
  emptyProofTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  emptyProofSub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 17,
  },
  proofCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  proofCardTop: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  proofCardIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proofCardTitleCol: {
    flex: 1,
  },
  proofCardBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  proofBadgePill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
  },
  proofBadgePillText: {
    fontSize: 10,
    fontWeight: '800',
  },
  proofDateText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  proofCardMainTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  proofMetaRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 6,
  },
  proofMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  proofMetaText: {
    fontSize: 11.5,
    color: '#64748B',
  },
  proofNoteText: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 16,
    marginBottom: 10,
  },
  proofCardActions: {
    flexDirection: 'row',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  proofCardSecondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
  },
  proofCardSecondaryBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  proofCardPrimaryBtn: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,
    borderRadius: 8,
    backgroundColor: '#D97706',
  },
  proofCardPrimaryBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Modal Styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCardContainer: {
    width: '100%',
    maxWidth: 390,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 8,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalInputLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 4,
    marginTop: 8,
  },
  modalTypeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 6,
  },
  modalTypePill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalTypePillActive: {
    backgroundColor: '#D97706',
    borderColor: '#D97706',
  },
  modalTypePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  modalTypePillTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  modalTextInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    fontSize: 12.5,
    color: '#0F172A',
    marginBottom: 4,
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  modalCancelBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  modalCancelBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  modalSaveBtn: {
    flex: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderRadius: 8,
    backgroundColor: '#D97706',
  },
  modalSaveBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  proofPaperSimBox: {
    backgroundColor: '#FFFDF9',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  proofPaperSimHeader: {
    alignItems: 'center',
    marginBottom: 8,
  },
  proofPaperSimBrand: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 1,
    marginTop: 2,
  },
  proofPaperSimDate: {
    fontSize: 10,
    color: '#94A3B8',
  },
  proofPaperDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 8,
  },
  proofPaperSimTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  proofPaperSimStore: {
    fontSize: 12,
    color: '#475569',
    marginBottom: 3,
  },
  proofPaperSimPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: '#16A34A',
    marginBottom: 3,
  },
  proofPaperSimNum: {
    fontSize: 11,
    color: '#64748B',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  proofPaperSimNote: {
    fontSize: 11.5,
    color: '#475569',
    lineHeight: 16,
  },
  proofPaperSealBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: '#F0FDF4',
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    marginTop: 10,
  },
  proofPaperSealText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15803D',
    letterSpacing: 0.5,
  },
  modalPrimaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D97706',
    height: 42,
    borderRadius: 10,
  },
  modalPrimaryActionBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  modalSecondaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
  },
  modalSecondaryActionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },

  // Authorities Styles
  authoritiesHeaderBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#EFF6FF',
  },
  authoritiesHeaderBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2563EB',
  },
  authoritiesSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  authoritiesSearchInput: {
    flex: 1,
    fontSize: 12.5,
    color: '#0F172A',
  },
  authoritiesCatScroll: {
    gap: 6,
    paddingBottom: 10,
  },
  authoritiesCatChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  authoritiesCatChipActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  authoritiesCatChipText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748B',
  },
  authoritiesCatChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  authOrgCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  authCardHeaderRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  authIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authTitleCol: {
    flex: 1,
  },
  authBadgePill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
    marginBottom: 3,
  },
  authBadgePillText: {
    fontSize: 10,
    fontWeight: '800',
  },
  authNameText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 18,
  },
  authScopeText: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
    marginBottom: 10,
  },
  authContactsBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    gap: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  authContactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  authContactPhoneText: {
    fontSize: 12,
    color: '#334155',
  },
  authContactWebText: {
    fontSize: 12,
    color: '#2563EB',
    textDecorationLine: 'underline',
  },
  authInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  authInfoText: {
    fontSize: 11.5,
    color: '#64748B',
    flex: 1,
  },
  authActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  authCallBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
    borderRadius: 8,
    backgroundColor: '#16A34A',
  },
  authCallBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  authDocBtn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
  },
  authDocBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  authRulesCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: 16,
  },
  authRulesTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  authRulesTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#B45309',
  },
  authRuleItem: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 6,
  },
  authRuleBullet: {
    fontSize: 12,
    fontWeight: '800',
    color: '#D97706',
  },
  authRuleText: {
    fontSize: 11.5,
    color: '#78350F',
    flex: 1,
    lineHeight: 16,
  },
});

