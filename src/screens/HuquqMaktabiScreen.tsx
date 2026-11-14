import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
  Alert,
  TextInput,
  Animated,
  Linking,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { legalServicesApi } from '../services/legalServicesApi';
import { authService, UserProfile } from '../services/authService';
import YoutubePlayer from 'react-native-youtube-iframe';

const { width } = Dimensions.get('window');
const SLIDE_WIDTH = width - 32;

const heroIllustration = require('../../assets/images/school_hero_illustration.png');
const schoolCapIcon = require('../../assets/images/school_cap_icon.png');
const gavelImage = require('../../assets/images/article_gavel.jpg');
const courtBuildingImage = require('../../assets/images/court_building.png');
const scaleLogoImage = require('../../assets/images/scale_logo.png');
const courseWeddingRingsImage = require('../../assets/images/course_wedding_rings.png');
const lessonThumb1 = require('../../assets/images/lesson_thumb_1.png');
const lessonThumb2 = require('../../assets/images/lesson_thumb_2.png');
const lessonThumb3 = require('../../assets/images/lesson_thumb_3.png');
const lessonThumb4 = require('../../assets/images/lesson_thumb_4.png');
const videoLessonInstructorImage = require('../../assets/images/video_lesson_instructor.png');
const testClipboardImage = require('../../assets/images/test_clipboard_illustration.png');
const resultGoldMedalImage = require('../../assets/images/result_gold_medal.png');
const courseCompleteCapImage = require('../../assets/images/course_complete_cap_clean.png');
const certificatePaperImage = require('../../assets/images/certificate_paper.png');
const testHeroXp3dImage = require('../../assets/images/test_hero_xp_3d_clean.png');
const bolimlarChecklistImage = require('../../assets/images/bolimlar_checklist_3d_clean.png');
const resultsTrophyImage = require('../../assets/images/results_trophy_3d_clean.png');
const resultsStoreImage = require('../../assets/images/results_store_3d_clean.png');
const avatarDilnoza = require('../../assets/images/avatar_dilnoza.png');
const avatarSardor = require('../../assets/images/avatar_sardor.png');
const avatarAkmal = require('../../assets/images/avatar_akmal.png');

// Store images (1:1 from media_1794325403706_8c845361.jpg)
const storeHeroGiftImage = require('../../assets/images/store_hero_gift.png');
const storeEduPromoImage = require('../../assets/images/store_edu_promo.png');
const storeTitleShieldImage = require('../../assets/images/store_title_shield.png');
const storeAvatarBoyImage = require('../../assets/images/store_avatar_boy.png');
const storeAvatarGirlImage = require('../../assets/images/store_avatar_girl.png');
const storeFrameGoldImage = require('../../assets/images/store_frame_gold.png');
const storeFramePurpleImage = require('../../assets/images/store_frame_purple.png');
const storeBgCourtImage = require('../../assets/images/store_bg_court.png');
const storeBgJusticeImage = require('../../assets/images/store_bg_justice.png');

// Store Real Product Images (Ta'lim, Maxsus, Hamkorlar)
const prodKubok = require('../../assets/images/prod_kubok.jpg');
const prodEarbuds = require('../../assets/images/prod_earbuds.jpg');
const prodWatch = require('../../assets/images/prod_watch.jpg');
const prodTablet = require('../../assets/images/prod_tablet.jpg');
const prodKitoblarToplam = require('../../assets/images/prod_kitoblar_toplam.jpg');
const prodBestseller = require('../../assets/images/prod_bestseller.jpg');
const prodLeatherNotebook = require('../../assets/images/prod_leather_notebook.jpg');
const prodPlanner = require('../../assets/images/prod_planner.jpg');
const prodHoodie = require('../../assets/images/prod_hoodie.jpg');
const prodTshirt = require('../../assets/images/prod_tshirt.jpg');
const prodDeskLamp = require('../../assets/images/prod_desk_lamp.jpg');
const prodKeyboard = require('../../assets/images/prod_keyboard.jpg');
const prodMedal = require('../../assets/images/prod_medal.jpg');

const prodKonstitutsiya = require('../../assets/images/prod_konstitutsiya.jpg');
const prodLugat = require('../../assets/images/prod_lugat.jpg');
const prodQollanma = require('../../assets/images/prod_qollanma.jpg');
const prodKitobKupon = require('../../assets/images/prod_kitob_kupon.jpg');
const prodWebinar = require('../../assets/images/prod_webinar.jpg');
const prodUchrashuv = require('../../assets/images/prod_uchrashuv.jpg');
const prodMentor30 = require('../../assets/images/prod_mentor_30.jpg');
const prodMentor60 = require('../../assets/images/prod_mentor_60.jpg');

const prodBookHouse = require('../../assets/images/prod_book_house.jpg');
const prodHilolNashr = require('../../assets/images/prod_hilol_nashr.jpg');
const prodRegiston = require('../../assets/images/prod_registon.jpg');
const prodLexLegal = require('../../assets/images/prod_lex_legal.jpg');
const prodCambridge = require('../../assets/images/prod_cambridge.jpg');
const prodAstrumIt = require('../../assets/images/prod_astrum_it.jpg');
const prodTsul = require('../../assets/images/prod_tsul.jpg');
const prodCoffee = require('../../assets/images/prod_coffee.jpg');
const prodKantselyariya = require('../../assets/images/prod_kantselyariya.jpg');

interface TestHistoryRecord {
  id: string;
  title: string;
  category: string;
  date: string;
  score: number;
  total: number;
  percentage: number;
  duration: string;
  status: 'passed' | 'retake';
  xp: number;
  coins: number;
  hasCertificate: boolean;
}

const TEST_HISTORY_DATA: TestHistoryRecord[] = [
  {
    id: 'th-1',
    title: 'Nikoh va oila munosabatlari',
    category: 'Kurs yakuniy testi',
    date: '2026-11-05',
    score: 17,
    total: 20,
    percentage: 85,
    duration: '30 daqiqa',
    status: 'passed',
    xp: 400,
    coins: 20,
    hasCertificate: true,
  },
  {
    id: 'th-2',
    title: 'Oila huquqi asoslari',
    category: 'Mavzu böyiça test',
    date: '2026-11-04',
    score: 9,
    total: 10,
    percentage: 90,
    duration: '14 daqiqa',
    status: 'passed',
    xp: 100,
    coins: 10,
    hasCertificate: false,
  },
  {
    id: 'th-3',
    title: 'Mehnat şartnomasi va kafolatlar',
    category: 'Kurs yakuniy testi',
    date: '2026-11-01',
    score: 18,
    total: 20,
    percentage: 90,
    duration: '28 daqiqa',
    status: 'passed',
    xp: 400,
    coins: 20,
    hasCertificate: true,
  },
  {
    id: 'th-4',
    title: 'Tadbirkorlik faoliyati va litsenziyalaş',
    category: 'Oraliq nazorat testi',
    date: '2026-10-28',
    score: 13,
    total: 20,
    percentage: 65,
    duration: '30 daqiqa',
    status: 'retake',
    xp: 50,
    coins: 0,
    hasCertificate: false,
  },
];

interface ResultsTestHistoryItem {
  id: string;
  title: string;
  date: string;
  xpAward: number;
  percentage: number;
  iconName: string;
}

const RESULTS_TEST_HISTORY: ResultsTestHistoryItem[] = [
  {
    id: '1',
    title: 'Oila va meros testi',
    date: 'Bugun, 14:25',
    xpAward: 40,
    percentage: 90,
    iconName: 'people-outline',
  },
  {
    id: '2',
    title: 'Umumiy qonunçilik testi',
    date: 'Kecha, 20:10',
    xpAward: 50,
    percentage: 80,
    iconName: 'scale-outline',
  },
  {
    id: '3',
    title: 'Mehnat huquqi testi',
    date: '2026-11-07, 18:40',
    xpAward: 40,
    percentage: 70,
    iconName: 'briefcase-outline',
  },
];

interface StudentRankingItem {
  rank: number;
  name: string;
  level: number;
  xp: number;
  avatarType?: 'image' | 'initials';
  avatarImage?: any;
  avatarBg?: string;
  avatarColor?: string;
  isCurrentUser?: boolean;
}

const LEADERBOARD_DATA: StudentRankingItem[] = [
  { rank: 1, name: 'Sardor B.', level: 15, xp: 14320, avatarType: 'image', avatarImage: avatarSardor },
  { rank: 2, name: 'Dilnoza X.', level: 14, xp: 12480, avatarType: 'image', avatarImage: avatarDilnoza },
  { rank: 3, name: 'Akmal R.', level: 14, xp: 11980, avatarType: 'image', avatarImage: avatarAkmal },
  { rank: 4, name: 'Mohira T.', level: 13, xp: 11420, avatarType: 'initials', avatarBg: '#FCE7F3', avatarColor: '#BE185D' },
  { rank: 5, name: 'Azizbek D.', level: 13, xp: 10980, avatarType: 'initials', avatarBg: '#E0E7FF', avatarColor: '#3730A3' },
  { rank: 6, name: 'Sevinch M.', level: 12, xp: 9860, avatarType: 'initials', avatarBg: '#FEF3C7', avatarColor: '#B45309' },
  { rank: 7, name: 'Davron K.', level: 12, xp: 9540, avatarType: 'initials', avatarBg: '#DCFCE7', avatarColor: '#15803D' },
  { rank: 8, name: 'Madina S.', level: 12, xp: 9320, avatarType: 'initials', avatarBg: '#EDE9FE', avatarColor: '#6D28D9' },
  { rank: 9, name: 'Jasur B.', level: 12, xp: 9150, avatarType: 'initials', avatarBg: '#E0F2FE', avatarColor: '#0369A1' },
  { rank: 10, name: 'Nodira K.', level: 12, xp: 8980, avatarType: 'initials', avatarBg: '#FEE2E2', avatarColor: '#B91C1C' },
  { rank: 11, name: 'Bekzod O.', level: 12, xp: 8740, avatarType: 'initials', avatarBg: '#F3E8FF', avatarColor: '#7E22CE' },
  { rank: 12, name: 'Nilufar Y.', level: 11, xp: 8520, avatarType: 'initials', avatarBg: '#ECFCCB', avatarColor: '#4D7C0F' },
  { rank: 13, name: 'Otabek M.', level: 11, xp: 8390, avatarType: 'initials', avatarBg: '#FFEDD5', avatarColor: '#C2410C' },
  { rank: 14, name: 'Zulayho R.', level: 11, xp: 8210, avatarType: 'initials', avatarBg: '#CCFBF1', avatarColor: '#0F766E' },
  { rank: 15, name: 'Farrux T.', level: 11, xp: 8050, avatarType: 'initials', avatarBg: '#E0E7FF', avatarColor: '#4338CA' },
  { rank: 27, name: 'Ergashboy M.', level: 12, xp: 7840, avatarType: 'image', avatarImage: videoLessonInstructorImage, isCurrentUser: true },
];

interface SchoolStoreItem {
  id: string;
  title: string;
  priceCoins: number;
  description: string;
  iconName: string;
  iconColor: string;
  badge?: string;
}

const SCHOOL_STORE_ITEMS: SchoolStoreItem[] = [
  {
    id: 'vip_frame',
    title: 'Oltin VIP Profil Ramkasi',
    priceCoins: 500,
    description: 'Profil rasmingiz atrofiga haşamatli oltin nişon ramkasi örnatiladi.',
    iconName: 'ribbon-outline',
    iconColor: '#F59E0B',
    badge: 'Trend',
  },
  {
    id: 'xp_booster',
    title: '2x XP Kuçaytirgiç (24 soat)',
    priceCoins: 300,
    description: 'Keyingi 24 soat davomida barça test va darslardan 2 barobar köp XP oling.',
    iconName: 'flash-outline',
    iconColor: '#F59E0B',
    badge: 'Xaridorgir',
  },
  {
    id: 'premium_badge',
    title: 'Huquq Bilimdoni Nişoni',
    priceCoins: 800,
    description: 'Reyting jadvalida ismingiz yonida maxsus tasdiqlangan huquqşunoslik belgisi.',
    iconName: 'shield-checkmark-outline',
    iconColor: '#10B981',
  },
  {
    id: 'retake_ticket',
    title: 'Qayta topşiriş çiptasi',
    priceCoins: 150,
    description: 'Testdagi eng past natijani öçirib, ballingizni yangilaş imkoniyati.',
    iconName: 'refresh-circle-outline',
    iconColor: '#3B82F6',
  },
];

export interface DigitalStoreItem {
  id: string;
  title: string;
  category: 'talim' | 'maxsus' | 'hamkorlar';
  categoryLabel: string;
  subcategory: string;
  priceCoins: number;
  image?: any;
  iconName: string;
  iconColor: string;
  isPopular?: boolean;
  isNew?: boolean;
  popularity: number;
  desc: string;

  // Partner coupon details (as per user instructions)
  partnerName?: string;
  websiteUrl?: string;
  discountTitle?: string;
  discountCondition?: string;
  validityDays?: number;
  terms?: string[];
  couponCode?: string;
}

const STORE_BANNER_SLIDES = [
  {
    id: 'slide_1',
    title: 'Coin Shop',
    subtitle: 'Coinlaringiz evaziga foydali sovğalar, imtiyozlar va maxsus takliflarni oling!',
    colors: ['#8B5CF6', '#7C3AED', '#5B21B6'] as [string, string, string],
    image: storeHeroGiftImage,
  },
  {
    id: 'slide_2',
    title: 'Hamkorlar takliflari',
    subtitle: 'Book House, öquv markazlari va kafelardan 50% gaça eksklyuziv çegirmalar!',
    colors: ['#2563EB', '#1D4ED8', '#1E40AF'] as [string, string, string],
    image: storeEduPromoImage,
  },
  {
    id: 'slide_3',
    title: 'Maxsus sovğalar',
    subtitle: 'Smart soat, simsiz quloqçin, kubok va brendli sovğalarni qölga kiriting!',
    colors: ['#D97706', '#B45309', '#92400E'] as [string, string, string],
    image: storeHeroGiftImage,
  },
];

const STORE_CATEGORIES = [
  {
    id: 'edu',
    label: 'Ta’lim imtiyozlari',
    iconName: 'school',
    iconColor: '#0284C7',
    bgColor: '#E0F2FE',
    targetCat: 'Ta’lim imtiyozlari',
  },
  {
    id: 'special',
    label: 'Maxsus sovg‘alar',
    iconName: 'gift',
    iconColor: '#7C3AED',
    bgColor: '#F5F3FF',
    targetCat: 'Maxsus sovg‘alar',
  },
  {
    id: 'partners',
    label: 'Hamkorlar takliflari',
    iconName: 'people',
    iconColor: '#F59E0B',
    bgColor: '#FEF3C7',
    targetCat: 'Hamkorlar takliflari',
  },
];

const DIGITAL_STORE_ITEMS: DigitalStoreItem[] = [
  // ===================== TA’LIM IMTIYOZLARI =====================
  {
    id: 'talim_ebook_konstitutsiya',
    title: 'Özbekiston Konstitutsiyasi (Şarhlangan)',
    category: 'talim',
    categoryLabel: 'Ta’lim imtiyozlari',
    subcategory: 'Elektron kitoblar',
    priceCoins: 300,
    image: prodKonstitutsiya,
    iconName: 'book-outline',
    iconColor: '#0284C7',
    isPopular: true,
    isNew: true,
    popularity: 98,
    desc: 'Özbekiston Respublikasi Konstitutsiyasining yangi tahrirdagi moddalari va amaliy huquqiy şarhlar töplami (PDF va ePub formatda).',
  },
  {
    id: 'talim_ebook_lugat',
    title: 'Yuridik atamalar izohli luğati',
    category: 'talim',
    categoryLabel: 'Ta’lim imtiyozlari',
    subcategory: 'Elektron kitoblar',
    priceCoins: 400,
    image: prodLugat,
    iconName: 'reader-outline',
    iconColor: '#0284C7',
    isNew: true,
    popularity: 94,
    desc: '10 000 dan ortiq yuridik, sud, jinoyat va xalqaro huquqiy atamalar hamda terminlarning batafsil izohli elektron luğati.',
  },
  {
    id: 'talim_ebook_qollanma',
    title: 'Huquqiy qöllanmalar töplami',
    category: 'talim',
    categoryLabel: 'Ta’lim imtiyozlari',
    subcategory: 'Elektron kitoblar',
    priceCoins: 450,
    image: prodQollanma,
    iconName: 'document-text-outline',
    iconColor: '#0284C7',
    popularity: 92,
    desc: 'Oila, mulk, mehnat munosabatlari va fuqarolik nizolarini sudgaça hal qiliş böyiça amaliy qöllanmalar.',
  },
  {
    id: 'talim_kupon_kitob',
    title: 'Kitob kuponi (30% çegirma)',
    category: 'talim',
    categoryLabel: 'Ta’lim imtiyozlari',
    subcategory: 'Kitob kuponlari',
    priceCoins: 600,
    image: prodKitobKupon,
    iconName: 'pricetag-outline',
    iconColor: '#10B981',
    isNew: true,
    popularity: 95,
    desc: 'Hamkor kitob dökonlaridan istalgan yuridik va ta’limiy kitoblar xaridi uçun 30% lik çegirma kuponi.',
    partnerName: 'Kitoblar Olami',
    validityDays: 30,
    terms: [
      'Bir marta foydalaniş mumkin.',
      'Barça yuridik adabiyotlarga amal qiladi.',
      'Hamkor dökon filiallarida taqdim etiladi.',
    ],
    couponCode: 'KITOB-TALIM-30',
  },
  {
    id: 'talim_seminar_webinar',
    title: 'Advokat bilan bepul vebinar',
    category: 'talim',
    categoryLabel: 'Ta’lim imtiyozlari',
    subcategory: 'Seminarlar',
    priceCoins: 1200,
    image: prodWebinar,
    iconName: 'videocam-outline',
    iconColor: '#8B5CF6',
    isPopular: true,
    isNew: true,
    popularity: 97,
    desc: 'Tajribali amaliyotçi advokat bilan yopiq jonli efir: savol-javoblar, sud amaliyoti va keyslar tahlili.',
    validityDays: 30,
    terms: [
      'Onlayn Zoom platformasida ötkaziladi.',
      'Savol-javobda erkin iştirok etiş huquqi beriladi.',
      'Yozuvi şaxsiy kabinetda saqlanadi.',
    ],
    couponCode: 'WEBINAR-LAW-FREE',
  },
  {
    id: 'talim_seminar_uchrashuv',
    title: 'Huquqşunos bilan uçraşuv çiptasi',
    category: 'talim',
    categoryLabel: 'Ta’lim imtiyozlari',
    subcategory: 'Seminarlar',
    priceCoins: 1500,
    image: prodUchrashuv,
    iconName: 'people-outline',
    iconColor: '#8B5CF6',
    popularity: 91,
    desc: 'Yuridik soha yetakçilari va talabalari bilan yuzma-yuz oçiq davra suhbati va networking uçraşuvi.',
    validityDays: 45,
    terms: [
      'Toşkent şahrida ötkaziladigan forum uçun kiriş çiptasi.',
      'Şaxsni tasdiqlovçi hujjat talab etiladi.',
    ],
    couponCode: 'MEET-LAWYER-2026',
  },
  {
    id: 'talim_mentor_30',
    title: 'Mutaxassis bilan 30 daqiqa mentorlik',
    category: 'talim',
    categoryLabel: 'Ta’lim imtiyozlari',
    subcategory: 'Mentorlik',
    priceCoins: 2000,
    image: prodMentor30,
    iconName: 'chatbubbles-outline',
    iconColor: '#D97706',
    isPopular: true,
    isNew: true,
    popularity: 99,
    desc: 'Katta yurist yoki professor bilan 30 daqiqalik yakkama-yakka şaxsiy konsultatsiya va huquqiy yöl-yöriq.',
    validityDays: 60,
    terms: [
      'Vaqt oldindan kelişilgan holda onlayn ötkaziladi.',
      'Şaxsiy amaliy savollarni muhokama qiliş mumkin.',
    ],
    couponCode: 'MENTOR-30-VIP',
  },
  {
    id: 'talim_mentor_60',
    title: 'Mutaxassis bilan 60 daqiqa mentorlik',
    category: 'talim',
    categoryLabel: 'Ta’lim imtiyozlari',
    subcategory: 'Mentorlik',
    priceCoins: 3500,
    image: prodMentor60,
    iconName: 'ribbon-outline',
    iconColor: '#D97706',
    popularity: 96,
    desc: 'Yuridik karyera rejalaştiriş, xalqaro grantlar va şartnomalar tahlili böyiça töliq 60 daqiqalik mentorlik sessiyasi.',
    validityDays: 60,
    terms: [
      'Individual yondaşuv va şaxsiy tahlil.',
      'Karyera rivojlantiriş rejasi tuzib beriladi.',
    ],
    couponCode: 'MENTOR-60-EXPERT',
  },

  // ===================== MAXSUS SOVG‘ALAR =====================
  {
    id: 'maxsus_elektronika_earbuds',
    title: 'Simsiz quloqçin (Wireless Earbuds)',
    category: 'maxsus',
    categoryLabel: 'Maxsus sovğalar',
    subcategory: 'Elektronika',
    priceCoins: 4500,
    image: prodEarbuds,
    iconName: 'headset-outline',
    iconColor: '#7C3AED',
    isPopular: true,
    isNew: true,
    popularity: 99,
    desc: 'Şovqinni bekor qiluvçi qulay simsiz Bluetooth quloqçin — audio darslar va ma’ruzalarni tinglaş uçun qulay.',
  },
  {
    id: 'maxsus_elektronika_watch',
    title: 'Smart soat (Fitness Tracker)',
    category: 'maxsus',
    categoryLabel: 'Maxsus sovğalar',
    subcategory: 'Elektronika',
    priceCoins: 6000,
    image: prodWatch,
    iconName: 'watch-outline',
    iconColor: '#7C3AED',
    isNew: true,
    popularity: 96,
    desc: 'Salomatlik, kunlik faollik va bildirişnomalarni kuzatuvçi köp funksiyali zamonaviy aqlli soat.',
  },
  {
    id: 'maxsus_elektronika_tablet',
    title: 'Elektron öquv planşeti',
    category: 'maxsus',
    categoryLabel: 'Maxsus sovğalar',
    subcategory: 'Elektronika',
    priceCoins: 12000,
    image: prodTablet,
    iconName: 'tablet-portrait-outline',
    iconColor: '#7C3AED',
    popularity: 94,
    desc: 'Qonun hujjatlari, yuridik kitoblar mutolaasi va konspekt yoziş uçun maxsus elektron öquv planşeti.',
  },
  {
    id: 'maxsus_kitoblar_toplam',
    title: 'Huquqşunoslik kitoblar töplami',
    category: 'maxsus',
    categoryLabel: 'Maxsus sovğalar',
    subcategory: 'Kitoblar',
    priceCoins: 1800,
    image: prodKitoblarToplam,
    iconName: 'library-outline',
    iconColor: '#059669',
    isPopular: true,
    isNew: true,
    popularity: 98,
    desc: '3 ta qattiq muqovali eng sara huquqiy bestseller kitoblar jamlanmasi (uy manzilingizga bepul yetkazib beriladi).',
  },
  {
    id: 'maxsus_kitoblar_bestseller',
    title: 'Yuridik bestseller kitob',
    category: 'maxsus',
    categoryLabel: 'Maxsus sovğalar',
    subcategory: 'Kitoblar',
    priceCoins: 900,
    image: prodBestseller,
    iconName: 'book-outline',
    iconColor: '#059669',
    popularity: 91,
    desc: 'Maşhur sud keyslari va jahon huquq amaliyotiga bağişlangan eng maşhur bestseller kitob.',
  },
  {
    id: 'maxsus_anjom_daftar',
    title: 'Yurist çarm daftari va metall ruçka',
    category: 'maxsus',
    categoryLabel: 'Maxsus sovğalar',
    subcategory: 'O‘quv anjomlari',
    priceCoins: 850,
    image: prodLeatherNotebook,
    iconName: 'journal-outline',
    iconColor: '#D97706',
    isNew: true,
    popularity: 92,
    desc: 'Haqiqiy çarmdan işlangan sifatli bloknot hamda Huquq maktabi logotipi öyilgan metall ruçka töplami.',
  },
  {
    id: 'maxsus_anjom_planner',
    title: 'Haftalik planner va organayzer',
    category: 'maxsus',
    categoryLabel: 'Maxsus sovğalar',
    subcategory: 'O‘quv anjomlari',
    priceCoins: 650,
    image: prodPlanner,
    iconName: 'calendar-outline',
    iconColor: '#D97706',
    popularity: 89,
    desc: 'Kundalik darslar, topşiriqlar va şaxsiy rejalarni tizimlaştiriş uçun qulay zamonaviy planner.',
  },
  {
    id: 'maxsus_brend_hoodie',
    title: 'Huquq maktabi brendli hoodie',
    category: 'maxsus',
    categoryLabel: 'Maxsus sovğalar',
    subcategory: 'Brend sovg‘alari',
    priceCoins: 2800,
    image: prodHoodie,
    iconName: 'shirt-outline',
    iconColor: '#3B82F6',
    isPopular: true,
    isNew: true,
    popularity: 98,
    desc: '100% paxtali, issiq va zamonaviy Huquq maktabi kaştali logotipiga ega premium hoodie (ölçamlari mavjud).',
  },
  {
    id: 'maxsus_brend_tshirt',
    title: 'Brendli futbolka va eko-sumka',
    category: 'maxsus',
    categoryLabel: 'Maxsus sovğalar',
    subcategory: 'Brend sovg‘alari',
    priceCoins: 1400,
    image: prodTshirt,
    iconName: 'bag-outline',
    iconColor: '#3B82F6',
    popularity: 93,
    desc: 'Kundalik kiyiş uçun qulay brendli futbolka hamda kitoblar taşiş uçun möljallangan mustahkam eko-sumka.',
  },
  {
    id: 'maxsus_ofis_lampa',
    title: 'LED sensorli stol çiroği',
    category: 'maxsus',
    categoryLabel: 'Maxsus sovğalar',
    subcategory: 'Ofis buyumlari',
    priceCoins: 1600,
    image: prodDeskLamp,
    iconName: 'bulb-outline',
    iconColor: '#EA580C',
    isNew: true,
    popularity: 90,
    desc: 'Közni çarçatmaydigan 3 xil yoruğlik haroratiga ega zamonaviy sensorli öquv stol lampasi.',
  },
  {
    id: 'maxsus_ofis_klaviatura',
    title: 'Ergonomik klaviatura va siçqonça',
    category: 'maxsus',
    categoryLabel: 'Maxsus sovğalar',
    subcategory: 'Ofis buyumlari',
    priceCoins: 2200,
    image: prodKeyboard,
    iconName: 'hardware-chip-outline',
    iconColor: '#EA580C',
    popularity: 91,
    desc: 'Uzoq vaqt matn teriş va hujjatlar bilan işlaşda qölni toliqtirmaydigan simsiz ergonomik töplam.',
  },
  {
    id: 'maxsus_kubok_oltin',
    title: 'Huquq maktabi çempion kubogi',
    category: 'maxsus',
    categoryLabel: 'Maxsus sovğalar',
    subcategory: 'Maxsus sovg‘alar',
    priceCoins: 5000,
    image: prodKubok,
    iconName: 'trophy-outline',
    iconColor: '#F59E0B',
    isPopular: true,
    isNew: true,
    popularity: 100,
    desc: 'Maktab reytingi peşqadamlari uçun ğolibning ismi va yutuqlari öyib yozilgan haqiqiy zarhal kubok.',
  },
  {
    id: 'maxsus_medal_quti',
    title: 'Çempionlik medali va sovğa qutisi',
    category: 'maxsus',
    categoryLabel: 'Maxsus sovğalar',
    subcategory: 'Maxsus sovg‘alar',
    priceCoins: 2500,
    image: prodMedal,
    iconName: 'medal-outline',
    iconColor: '#F59E0B',
    popularity: 95,
    desc: 'Metall quyma ğoliblik medali, maxsus qora baxmal quti va faxriy sertifikat.',
  },

  // ===================== HAMKORLAR TAKLIFLARI =====================
  {
    id: 'hamkor_book_house',
    title: 'Book House — Kitob dökoni',
    category: 'hamkorlar',
    categoryLabel: 'Hamkorlar takliflari',
    subcategory: 'Kitob do‘konlari',
    partnerName: 'Book House — Kitob dökoni',
    websiteUrl: 'paradisebookhub.com',
    discountTitle: '20% çegirma',
    discountCondition: '100 000 sömdan yuqori xaridlar uçun',
    priceCoins: 500,
    image: prodBookHouse,
    validityDays: 30,
    terms: [
      'Bir marta foydalaniş mumkin.',
      'Boşqa çegirmalar bilan qöşilmaydi.',
      'Faqat Book House dökonlarida amal qiladi.',
    ],
    couponCode: 'PARADISE-BOOK-20',
    iconName: 'book',
    iconColor: '#059669',
    isPopular: true,
    isNew: true,
    popularity: 99,
    desc: 'Hamkor Book House tarmoğida 100 000 sömdan yuqori kitob xaridlari uçun 20% maxsus çegirma kuponi.',
  },
  {
    id: 'hamkor_kitob_50k',
    title: 'Hilol Naşr — 50 000 söm vauçer',
    category: 'hamkorlar',
    categoryLabel: 'Hamkorlar takliflari',
    subcategory: 'Kitob do‘konlari',
    partnerName: 'Hilol Naşr Kitob Dökoni',
    websiteUrl: 'hilolnashr.uz',
    discountTitle: '50 000 sömlik çegirma',
    discountCondition: '150 000 sömdan yuqori xaridlar uçun',
    priceCoins: 800,
    image: prodHilolNashr,
    validityDays: 45,
    terms: [
      'Bir marta foydalaniş mumkin.',
      'Yuridik va ilmiy kitoblarga amal qiladi.',
      'Barça filiallarda va onlayn buyurtmada qabul qilinadi.',
    ],
    couponCode: 'HILOL-LAW-50K',
    iconName: 'pricetag',
    iconColor: '#059669',
    isPopular: true,
    isNew: true,
    popularity: 98,
    desc: 'Hilol Naşr tarmoğida 50 000 sömlik xarid vauçeri.',
  },
  {
    id: 'hamkor_uquv_markazi',
    title: 'Registon öquv markazi — 15% çegirma',
    category: 'hamkorlar',
    categoryLabel: 'Hamkorlar takliflari',
    subcategory: 'O‘quv markazlari',
    partnerName: 'Registon Öquv Markazi',
    websiteUrl: 'registon.uz',
    discountTitle: '15% kurs çegirmasi',
    discountCondition: 'Abituriyent va yuridik tayyorlov kurslariga',
    priceCoins: 1500,
    image: prodRegiston,
    validityDays: 60,
    terms: [
      'Birinçi 2 oylik tölov uçun amal qiladi.',
      'Yangi öquvçilar röyxatdan ötganda taqdim etiladi.',
      'Boşqa aksiyalar bilan jamlanmaydi.',
    ],
    couponCode: 'REGISTON-15-LAW',
    iconName: 'school',
    iconColor: '#0284C7',
    isPopular: true,
    isNew: true,
    popularity: 97,
    desc: 'Registon öquv markazining barça filiallarida yuridik tayyorlov kurslariga 15% çegirma.',
  },
  {
    id: 'hamkor_yuridik_seminar',
    title: 'Lex Legal — Yopiq seminar çiptasi',
    category: 'hamkorlar',
    categoryLabel: 'Hamkorlar takliflari',
    subcategory: 'Yuridik firmalar',
    partnerName: 'Lex Legal Group',
    websiteUrl: 'lexlegal.uz',
    discountTitle: '100% bepul qatnaşiş',
    discountCondition: 'Yuridik seminar va amaliy keyslar tahlili uçun',
    priceCoins: 2000,
    image: prodLexLegal,
    validityDays: 30,
    terms: [
      '1 nafar iştirokçi uçun bepul VIP çipta.',
      'Oldindan röyxatdan ötiş şart.',
      'Rasmiy sertifikat beriladi.',
    ],
    couponCode: 'LEX-FREE-SEMINAR',
    iconName: 'briefcase',
    iconColor: '#7C3AED',
    isPopular: true,
    isNew: true,
    popularity: 99,
    desc: 'Yetakçi advokatlar va yuristlar iştirokidagi yopiq seminar uçun bepul qatnaşiş çiptasi.',
  },
  {
    id: 'hamkor_til_markazi',
    title: 'Cambridge — 20% til kursi çegirmasi',
    category: 'hamkorlar',
    categoryLabel: 'Hamkorlar takliflari',
    subcategory: 'Til markazlari',
    partnerName: 'Cambridge Learning Centre',
    websiteUrl: 'cambridge.uz',
    discountTitle: '20% kurs çegirmasi',
    discountCondition: 'Legal Engliş, IELTS, Rus va Yapon tili kurslariga',
    priceCoins: 3000,
    image: prodCambridge,
    validityDays: 90,
    terms: [
      'Ingliz, rus yoki yapon tili kurslarida amal qiladi.',
      'Birinçi 3 oylik tölovga tatbiq etiladi.',
      'Kupon faqat bir martalik.',
    ],
    couponCode: 'CAMBRIDGE-LANG-20',
    iconName: 'globe',
    iconColor: '#4F46E5',
    isPopular: true,
    isNew: true,
    popularity: 96,
    desc: 'Cambridge til markazida Legal Engliş yoki IELTS darslariga 20% maxsus çegirma kuponi.',
  },
  {
    id: 'hamkor_it_kurs',
    title: 'Astrum IT Academy — 30% çegirma',
    category: 'hamkorlar',
    categoryLabel: 'Hamkorlar takliflari',
    subcategory: 'IT markazlari',
    partnerName: 'Astrum IT Academy',
    websiteUrl: 'astrum.uz',
    discountTitle: '30% çegirma',
    discountCondition: 'Raqamli savodxonlik va IT kurslariga',
    priceCoins: 2500,
    image: prodAstrumIt,
    validityDays: 60,
    terms: [
      'Barça boşlanğiç IT va raqamli savodxonlik kurslariga amal qiladi.',
      'Şartnoma tuzişda kupon kodi kiritiladi.',
    ],
    couponCode: 'ASTRUM-IT-30',
    iconName: 'laptop',
    iconColor: '#0891B2',
    popularity: 92,
    desc: 'Raqamli savodxonlik va IT böyiça zamonaviy kasblar kurslariga 30% çegirma.',
  },
  {
    id: 'hamkor_universitet',
    title: 'TDYU — Oçiq master-klass çiptasi',
    category: 'hamkorlar',
    categoryLabel: 'Hamkorlar takliflari',
    subcategory: 'Universitetlar',
    partnerName: 'Toşkent Davlat Yuridik Universiteti',
    websiteUrl: 'tsul.uz',
    discountTitle: 'Bepul master-klass',
    discountCondition: 'Kriminalistika va sud ekspertizasi oçiq darsiga',
    priceCoins: 1800,
    image: prodTsul,
    validityDays: 20,
    terms: [
      'Universitet binosida ötkaziladi.',
      'Pasport/ID karta va kupon kodi taqdim etiladi.',
    ],
    couponCode: 'TSUL-OPEN-2026',
    iconName: 'ribbon',
    iconColor: '#8B5CF6',
    isNew: true,
    popularity: 94,
    desc: 'TDYU professorlari bilan kriminalistika va tergov sirlari darsida bepul qatnaşiş.',
  },
  {
    id: 'hamkor_kafe',
    title: 'Black Bear Kofi — 25% çegirma',
    category: 'hamkorlar',
    categoryLabel: 'Hamkorlar takliflari',
    subcategory: 'Kafe va restoranlar',
    partnerName: 'Black Bear Kofi',
    websiteUrl: 'blackbearkofi.uz',
    discountTitle: '25% çegirma',
    discountCondition: 'Barça qahva va desertlar uçun',
    priceCoins: 400,
    image: prodCoffee,
    validityDays: 30,
    terms: [
      'Kassada tölovdan oldin kupon kodi körsatiladi.',
      'Barça şahar filiallarida amal qiladi.',
    ],
    couponCode: 'KOFI-SPECIAL-25',
    iconName: 'cafe',
    iconColor: '#D97706',
    popularity: 91,
    desc: 'Hamkor qahvaxonalarda talabalar va öquvçilar uçun 25% çegirma kuponi.',
  },
  {
    id: 'hamkor_kantselyariya',
    title: 'Office Market — 20% öquv anjomlari',
    category: 'hamkorlar',
    categoryLabel: 'Hamkorlar takliflari',
    subcategory: 'Kantselyariya',
    partnerName: 'Office Market',
    websiteUrl: 'officemarket.uz',
    discountTitle: '20% çegirma',
    discountCondition: '50 000 sömdan yuqori öquv anjomlari xaridiga',
    priceCoins: 350,
    image: prodKantselyariya,
    validityDays: 30,
    terms: [
      'Daftar, ruçka, papka va kantselyariya buyumlariga amal qiladi.',
      'Barça dökon filiallarida taqdim etiladi.',
    ],
    couponCode: 'OFFICE-PROMO-20',
    iconName: 'attach',
    iconColor: '#64748B',
    popularity: 90,
    desc: 'Öquv va ofis anjomlari dökonida 20% maxsus çegirma kuponi.',
  },
];

interface TestCategoryItem {
  id: string;
  title: string;
  questionsCount: number;
  durationMinutes: number;
  xpAward: number;
  iconName: string;
  iconFamily: 'Ionicons' | 'FontAwesome5';
  isHighlighted?: boolean;
}

const TEST_CATEGORIES: TestCategoryItem[] = [
  {
    id: 'general',
    title: 'Umumiy qonunçilik',
    questionsCount: 120,
    durationMinutes: 15,
    xpAward: 50,
    iconName: 'scale-outline',
    iconFamily: 'Ionicons',
    isHighlighted: true,
  },
  {
    id: 'family',
    title: 'Oila va meros',
    questionsCount: 80,
    durationMinutes: 12,
    xpAward: 40,
    iconName: 'people-outline',
    iconFamily: 'Ionicons',
  },
  {
    id: 'civil',
    title: 'Fuqarolik huquqi',
    questionsCount: 100,
    durationMinutes: 15,
    xpAward: 50,
    iconName: 'business-outline',
    iconFamily: 'Ionicons',
  },
  {
    id: 'labor',
    title: 'Mehnat huquqi',
    questionsCount: 80,
    durationMinutes: 12,
    xpAward: 40,
    iconName: 'briefcase-outline',
    iconFamily: 'Ionicons',
  },
  {
    id: 'consumer',
    title: 'Iste’molçi huquqlari',
    questionsCount: 60,
    durationMinutes: 10,
    xpAward: 30,
    iconName: 'shield-checkmark-outline',
    iconFamily: 'Ionicons',
  },
  {
    id: 'housing',
    title: 'Uy-joy huquqi',
    questionsCount: 60,
    durationMinutes: 10,
    xpAward: 30,
    iconName: 'home-outline',
    iconFamily: 'Ionicons',
  },
  {
    id: 'admin',
    title: 'Ma’muriy huquq',
    questionsCount: 70,
    durationMinutes: 12,
    xpAward: 40,
    iconName: 'gavel',
    iconFamily: 'FontAwesome5',
  },
  {
    id: 'criminal',
    title: 'Jinoyat huquqi',
    questionsCount: 100,
    durationMinutes: 15,
    xpAward: 50,
    iconName: 'shield-outline',
    iconFamily: 'Ionicons',
  },
];

interface TopicCourseItem {
  id: string;
  topicId?: string;
  title: string;
  lessons: string;
  duration: string;
  progress: number;
  progressColor: string;
  iconBg: string;
  iconType?: string;
  imageUrl?: string;
}

const FAMILY_LAW_COURSES: TopicCourseItem[] = [];

interface CourseLesson {
  id: string;
  courseId?: string;
  topicId?: string;
  order: number;
  title: string;
  duration: string;
  image?: any;
  imageUrl?: string;
  youtubeUrl?: string;
  description?: string;
  plan?: Array<{ id: string; title: string; timeRange: string }>;
  materials?: Array<{ id: string; name: string; size?: string; type?: string; fileUrl?: string }>;
  status: 'completed' | 'in_progress' | 'locked' | 'not_started';
}

const COURSE_LESSONS: CourseLesson[] = [];

interface LessonChapter {
  id: string;
  title: string;
  timeRange: string;
}

const LESSON_CHAPTERS: LessonChapter[] = [
  {
    id: 'ch1',
    title: 'Nikoh tuşunçasi',
    timeRange: '00:00 – 02:15',
  },
  {
    id: 'ch2',
    title: 'Nikohning huquqiy asoslari',
    timeRange: '02:15 – 05:20',
  },
  {
    id: 'ch3',
    title: 'Nikohning ijtimoiy ahamiyati',
    timeRange: '05:20 – 08:10',
  },
  {
    id: 'ch4',
    title: 'Xulosa',
    timeRange: '08:10 – 10:00',
  },
];

interface FinalTestQuestion {
  id: number;
  shortTitle: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const FINAL_TEST_QUESTIONS: FinalTestQuestion[] = [
  {
    id: 1,
    shortTitle: 'Özbekiston Respublikasi ...',
    question: 'Özbekiston Respublikasida nikoh tuziş qaysi davlat organida amalga oşiriladi?',
    options: [
      'A) Notarius idoralarida',
      'B) Fuqarolik holati dalolatnomalarini yoziş (FHDYo) organida',
      'C) Mahalla fuqarolar yiğinida',
      'D) Sud organlarida',
    ],
    correctIndex: 1,
    explanation:
      'Özbekiston Respublikasi Oila kodeksiga muvofiq, nikoh tuziş faqat fuqarolik holati dalolatnomalarini yoziş (FHDYo) organlarida qonuniy tartibda amalga oşiriladi.',
  },
  {
    id: 2,
    shortTitle: 'Nikoh yoşi neçiga teng?',
    question: 'Nikoh yoşi neçiga teng?',
    options: ['A) 16 yoş', 'B) 17 yoş', 'C) 18 yoş', 'D) 20 yoş'],
    correctIndex: 2,
    explanation:
      'Özbekiston Respublikasi Oila kodeksining 15-moddasiga köra, nikoh yoşi — 18 yoş. Alohida hollarda (asosli sabablar mavjud bölsa) 17 yoşdan nikoh tuzişga ruxsat etilişi mumkin.',
  },
  {
    id: 3,
    shortTitle: 'Oila kodeksiga köra ...',
    question: 'Oila kodeksiga köra, nikoh tuziş uçun qanday rozilik talab etiladi?',
    options: [
      'A) Faqat ota-onalarning roziligi',
      'B) Ixtiyoriy va özaro roziligi',
      'C) Mahalla qömitasining xulosasi',
      'D) Notarial kafillik',
    ],
    correctIndex: 1,
    explanation:
      'Nikoh tuziş uçun bölajak er-xotinning ixtiyoriy va özaro roziligi hamda ularning qonuniy nikoh yoşiga yetişi asosiy şartdir.',
  },
  {
    id: 4,
    shortTitle: 'Er-xotinning asosiy ...',
    question: 'Er-xotinning asosiy umumiy birgalikdagi mulkiga nimalar kiradi?',
    options: [
      'A) Erning şaxsiy mulki',
      'B) Xotinning şaxsiy mulki',
      'C) Nikoh davomida orttirilgan umumiy mulk',
      'D) Davlat tasarrufidagi mulk',
    ],
    correctIndex: 2,
    explanation:
      'Er va xotinning nikoh davomida orttirgan barça mol-mulklari, şuningdek daromadlari ularning umumiy birgalikdagi mulki hisoblanadi.',
  },
  {
    id: 5,
    shortTitle: 'Nikoh bekor qiliniş ...',
    question: 'Nikoh bekor qilinişi qaysi hollarda FHDYo organlarida amalga oşiriladi?',
    options: [
      'A) Har qanday nizoli holatda',
      'B) Voyaga yetmagan umumiy bolalari bölmaganda va özaro rozilik bölganda',
      'C) Faqat sud ruxsati bilan',
      'D) Mulkiy nizo mavjud bölganda',
    ],
    correctIndex: 1,
    explanation:
      'Voyaga yetmagan umumiy bolalari bölmagan er-xotinlar özaro rozilik bilan nikohni bekor qiliş uçun töğridan-töğri FHDYo organiga ariza berişlari mumkin.',
  },
  {
    id: 6,
    shortTitle: 'Aliment tölovlari ...',
    question: 'Aliment tölovlari bir nafar bola uçun ota-ona daromadining qança qismini taşkil etadi?',
    options: [
      'A) 1/4 qismini (25%)',
      'B) 1/3 qismini (33%)',
      'C) 1/2 qismini (50%)',
      'D) Qat’iy belgilangan 1 mln söm',
    ],
    correctIndex: 0,
    explanation:
      'Oila kodeksining 99-moddasiga muvofiq, voyaga yetmagan 1 nafar bola uçun ota-onaning oylik iş haqi va boşqa daromadining 1/4 qismi miqdorida aliment undiriladi.',
  },
  {
    id: 7,
    shortTitle: 'Vasiylik va homiylik ...',
    question: 'Vasiylik va homiylik qaysi toifadagi fuqarolarga nisbatan belgilanadi?',
    options: [
      'A) Barça talaba va talabgorlarga',
      'B) Ota-ona qaramoğidan mahrum bölgan bolalar va muomalaga layoqatsiz şaxslarga',
      'C) Faqat çet el fuqarolariga',
      'D) Barça nafaqaxörlarga',
    ],
    correctIndex: 1,
    explanation:
      'Vasiylik va homiylik ota-ona qaramoğidan mahrum bölgan voyaga yetmagan bolalar va muomalaga layoqatsiz deb topilgan fuqarolarga nisbatan belgilanadi.',
  },
  {
    id: 8,
    shortTitle: 'Ota-ona huquqlari ...',
    question: 'Ota-ona huquqlaridan mahrum qiliş qaysi organ tomonidan amalga oşiriladi?',
    options: [
      'A) Mahalla fuqarolar yiğini',
      'B) Faqat sud organi tomonidan',
      'C) Içki işlar bölimi',
      'D) Maktab rahbariyati',
    ],
    correctIndex: 1,
    explanation:
      'Ota-onalik huquqidan mahrum qiliş faqat sud tartibida, prokuror hamda vasiylik va homiylik organi iştirokida hal qilinadi.',
  },
  {
    id: 9,
    shortTitle: 'Nikoh şartnomasi şakli ...',
    question: 'Nikoh şartnomasi qanday şaklda tuzilişi şart?',
    options: [
      'A) Oğzaki kelişuv şaklida',
      'B) Notarial tasdiqlangan yozma şaklda',
      'C) Oddiy tilxat tarzida',
      'D) Guvohlar iştirokidagi dalolatnoma',
    ],
    correctIndex: 1,
    explanation:
      'Nikoh şartnomasi yozma şaklda tuziladi va notarial tartibda tasdiqlanişi şart.',
  },
  {
    id: 10,
    shortTitle: 'Nikoh yoşini kamaytiriş ...',
    question: 'Uzrli sabablar bölganda, nikoh yoşi köpi bilan qançaga kamaytirilişi mumkin?',
    options: ['A) 6 oyga', 'B) 1 yilga', 'C) 2 yilga', 'D) Mutlaqo mumkin emas'],
    correctIndex: 1,
    explanation:
      'Tuman (şahar) hokimi uzrli sabablar mavjud bölganda nikoh yoşini köpi bilan 1 yilga kamaytirişi mumkin.',
  },
  {
    id: 11,
    shortTitle: 'Nikohgaça bölgan mulk ...',
    question: 'Er-xotindan birining nikohgaça olgan şaxsiy mulki nikoh davrida kimga tegişli böladi?',
    options: [
      'A) Umumiy mulkka aylanadi',
      'B) Öşa er yoki xotinning öz xususiy mulki bölib qoladi',
      'C) Davlat hisobiga ötadi',
      'D) Teng taqsimlanadi',
    ],
    correctIndex: 1,
    explanation:
      'Er-xotinning nikohgaça öziga tegişli bölgan mol-mulki uning öz xususiy mulki hisoblanadi.',
  },
  {
    id: 12,
    shortTitle: 'Homiladorlikda ajrim ...',
    question: 'Xotinining homiladorlik vaqtida va bola 1 yoşga tölguniga qadar er nikohdan ajratiş töğrisida da’vo qözğata oladimi?',
    options: [
      'A) Ha, istalgan vaqtda',
      'B) Yöq, xotinining roziligisiz da’vo qözğata olmaydi',
      'C) Faqat aliment tölaganidan söng',
      'D) Sud xohişiga köra',
    ],
    correctIndex: 1,
    explanation:
      'Xotinining homiladorlik vaqtida va bola 1 yoşga tölguniga qadar er xotinining roziligisiz nikohdan ajratiş töğrisida da’vo qözğata olmaydi.',
  },
  {
    id: 13,
    shortTitle: 'Ariza beriş muddati ...',
    question: 'Nikoh tuziş muddati ariza berilgan kundan e’tiboran qança muddat ötgaç amalga oşiriladi?',
    options: ['A) Darhol şu kunning özida', 'B) 1 oy ötgaç', 'C) 3 oy ötgaç', 'D) 6 oy ötgaç'],
    correctIndex: 1,
    explanation:
      'Nikoh tuziş FHDYo organiga ariza berilgan kundan e’tiboran bir oy ötgaç amalga oşiriladi.',
  },
  {
    id: 14,
    shortTitle: 'Tibbiy körik majburiyati ...',
    question: 'Nikoh tuzişda şaxslar tibbiy körikdan ötişi şartmi?',
    options: [
      'A) Ha, davlat soğliqni saqlaş muassasalarida bepul tibbiy körik majburiydir',
      'B) Faqat ixtiyoriy',
      'C) Faqat çet el fuqarolari uçun majburiy',
      'D) Faqat pullik asosda',
    ],
    correctIndex: 0,
    explanation:
      'Nikohlanuvçi şaxslar davlat soğliqni saqlaş muassasalarida bepul tibbiy körikdan ötişlari şart.',
  },
  {
    id: 15,
    shortTitle: 'Familiya tanlaş huquqi ...',
    question: 'Nikoh tuziş vaqtida er va xotin qanday familiya tanlaşi mumkin?',
    options: [
      'A) Faqat erning familiyasiga ötiş şart',
      'B) Umumiy familiya tanlaşi yoki öz familiyasini saqlab qolişi mumkin',
      'C) Faqat xotinning familiyasi qoldiriladi',
      'D) Familiyani özgartiriş taqiqlanadi',
    ],
    correctIndex: 1,
    explanation:
      'Er-xotin öz xohişlariga köra er yoki xotinning familiyasini umumiy familiya qilib tanlaydi yoki öz familiyasini saqlab qoladi.',
  },
  {
    id: 16,
    shortTitle: 'Şaxsiy buyumlar mulki ...',
    question: 'Er-xotinning şaxsiy foydalanişidagi kiyim-keçaklari kimning mulki hisoblanadi?',
    options: [
      'A) Umumiy birgalikdagi mulk',
      'B) Undan foydalangan er yoki xotinning xususiy mulki',
      'C) Oilaning umumiy daromadiga qöşiladi',
      'D) Faqat qimmatbaho buyumlar umumiy hisoblanadi',
    ],
    correctIndex: 1,
    explanation:
      'Şaxsiy foydalanişdagi buyumlar nikoh davomida olingan bölsa ham, undan foydalangan er yoki xotinning şaxsiy mulki hisoblanadi.',
  },
  {
    id: 17,
    shortTitle: 'Şartnoma tuziş vaqti ...',
    question: 'Nikoh şartnomasi qaçon tuzilişi mumkin?',
    options: [
      'A) Nikoh davlat röyxatiga olingunga qadar ham, nikoh davrida ham',
      'B) Faqat nikoh tuzilgandan keyin',
      'C) Faqat nikohdan ajraliş paytida',
      'D) Faqat FHDYo organi ruxsati bilan',
    ],
    correctIndex: 0,
    explanation:
      'Nikoh şartnomasi nikoh davlat röyxatiga olingunga qadar ham, nikoh davrida ham er-xotinning kelişuvi bilan tuzilişi mumkin.',
  },
  {
    id: 18,
    shortTitle: 'Haqiqiy emas deb topiş ...',
    question: 'Nikohni haqiqiy emas deb topiş vakolati qaysi organga berilgan?',
    options: ['A) Faqat notariusga', 'B) Faqat sudga', 'C) FHDYo organiga', 'D) Mahallaga'],
    correctIndex: 1,
    explanation:
      'Nikohni haqiqiy emas deb topiş faqat qonuniy sud tartibida amalga oşiriladi.',
  },
  {
    id: 19,
    shortTitle: 'Köçmas mulk tasarrufi ...',
    question: 'Er-xotindan biri ikkinçisining roziligisiz umumiy köçmas mulkni tasarruf eta oladimi?',
    options: [
      'A) Ha, öz nomida bölsa yetarli',
      'B) Yöq, ikkinçi tomonning notarial tasdiqlangan roziligi şart',
      'C) Faqat oğzaki ruxsat yetarli',
      'D) Mulk qiymatiga boğliq',
    ],
    correctIndex: 1,
    explanation:
      'Umumiy köçmas mulkni tasarruf etiş böyiça bitim tuzişda ikkinçi tomonning notarial tasdiqlangan roziligi olinişi şart.',
  },
  {
    id: 20,
    shortTitle: 'Oila qonunçiligi maqsadi ...',
    question: 'Oila qonunçiligining asosiy vazifasi nima?',
    options: [
      'A) Faqat ajrimlarni körib çiqiş',
      'B) Oilani mustahkamlaş, oila a’zolarining huquqlarini har tomonlama himoya qiliş',
      'C) Mulklarni röyxatga oliş',
      'D) Jarimalar qöllaş',
    ],
    correctIndex: 1,
    explanation:
      'Oila qonunçiligining asosiy maqsadi oilani mustahkamlaş, oila a’zolarining huquq va manfaatlarini himoya qilişdir.',
  },
];

interface CategoryTestQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const CATEGORY_TEST_QUESTIONS: CategoryTestQuestion[] = [
  {
    id: 1,
    question: 'Özbekiston Respublikasida oilaviy munosabatlarni tartibga soluvçi asosiy qonun hujjati qaysi?',
    options: [
      'A) Fuqarolik kodeksi',
      'B) Oila kodeksi',
      'C) Mehnat kodeksi',
      'D) Uy-joy kodeksi',
    ],
    correctIndex: 1,
    explanation: 'Özbekiston Respublikasida oila institutini va oilaviy munosabatlarni bevosita tartibga soluvçi maxsus hujjat Oila kodeksidir.',
  },
  {
    id: 2,
    question: 'Nikoh tuziş qayerda va qanday tartibda qayd etiladi?',
    options: [
      'A) Notarial idorada',
      'B) FHDYo organida davlat röyxatidan ötkaziş orqali',
      'C) Mahalla fuqarolar yiğinida',
      'D) Faqat diniy marosim orqali',
    ],
    correctIndex: 1,
    explanation: 'Nikoh faqat fuqarolik holati dalolatnomalarini yoziş (FHDYo) organlarida davlat röyxatidan ötkazilgandagina qonuniy kuçga ega böladi.',
  },
  {
    id: 3,
    question: 'Nikoh şartnomasi qaysi şaklda tuzilişi şart?',
    options: [
      'A) Oğzaki şaklda',
      'B) Oddiy yozma şaklda',
      'C) Yozma şaklda va notarial tasdiqlangan holda',
      'D) Mahalla guvohligida',
    ],
    correctIndex: 2,
    explanation: 'Oila kodeksining 30-moddasiga binoan, nikoh şartnomasi yozma şaklda tuziladi va notarial tartibda tasdiqlanişi şart.',
  },
  {
    id: 4,
    question: 'Özbekiston Respublikasining Oila kodeksiga köra, nikoh yoşi odatda neça yoşdan belgilangan?',
    options: [
      'A) 16 yoşdan',
      'B) 17 yoşdan',
      'C) 18 yoşdan',
      'D) 21 yoşdan',
    ],
    correctIndex: 2,
    explanation: 'Özbekiston Respublikasi Oila kodeksining 15-moddasiga köra, erkaklar va ayollar uçun nikoh yoşi 18 yoş etib belgilangan.',
  },
  {
    id: 5,
    question: 'Alohida hollarda, uzrli sabablar bölganda nikoh yoşi köpi bilan qançaga kamaytirilişi mumkin?',
    options: [
      'A) 6 oyga',
      'B) 1 yilga',
      'C) 2 yilga',
      'D) 3 yilga',
    ],
    correctIndex: 1,
    explanation: 'Uzrli sabablar bölganda, alohida hollarda tuman yoki şahar hokimi nikoh yoşini köpi bilan bir yilga kamaytirişi mumkin.',
  },
  {
    id: 6,
    question: 'Er-xotinning nikoh davomida orttirgan mol-mulki qanday mulk hisoblanadi?',
    options: [
      'A) Erning şaxsiy mulki',
      'B) Xotinning şaxsiy mulki',
      'C) Ularning birgalikdagi umumiy mulki',
      'D) Bolalarning şaxsiy mulki',
    ],
    correctIndex: 2,
    explanation: 'Er va xotinning nikoh davomida orttirgan barça mulklari ularning birgalikdagi umumiy mulki hisoblanadi.',
  },
  {
    id: 7,
    question: 'Er yoki xotinga nikohgaça tegişli bölgan mol-mulk qanday hisoblanadi?',
    options: [
      'A) Har birining öz şaxsiy mulki',
      'B) Birgalikdagi umumiy mulk',
      'C) Majburiy taqsimlanadigan mulk',
      'D) Ota-onaning mulki',
    ],
    correctIndex: 0,
    explanation: 'Nikohga qadar har bir şaxsga tegişli bölgan, şuningdek nikoh davomida hadya yoki meros tariqasida olingan mol-mulk uning şaxsiy mulkidir.',
  },
  {
    id: 8,
    question: 'Bir nafar voyaga yetmagan bola uçun ota yoki onadan undiriladigan aliment miqdori qança?',
    options: [
      'A) Daromadning 1/6 qismi',
      'B) Daromadning 1/4 qismi',
      'C) Daromadning 1/3 qismi',
      'D) Daromadning yarmi (1/2)',
    ],
    correctIndex: 1,
    explanation: 'Oila kodeksining 99-moddasiga köra, bir bola uçun ota-ona maoşi yoki boşqa daromadining törtdan bir (1/4) qismi undiriladi.',
  },
  {
    id: 9,
    question: 'Qonun böyiça birinçi navbatdagi merosxörlar kimlar hisoblanadi?',
    options: [
      'A) Aka-uka va opa-singillar',
      'B) Bolalari, eri (xotini) va ota-onasi',
      'C) Bobosi va buvisi',
      'D) Toğa, amma, amaki va xolalar',
    ],
    correctIndex: 1,
    explanation: 'Fuqarolik kodeksiga köra, meros qoldiruvçining bolalari, eri (xotini) va ota-onasi teng uluşlarda birinçi navbatdagi merosxörlar böladi.',
  },
  {
    id: 10,
    question: 'Meros oçilgan kundan e’tiboran uni qabul qiliş uçun qanday muddat belgilangan?',
    options: [
      'A) 3 oy',
      'B) 6 oy',
      'C) 1 yil',
      'D) 3 yil',
    ],
    correctIndex: 1,
    explanation: 'Meros oçilgan kundan e’tiboran 6 oy mobaynida notariusga ariza beriş orqali qabul qilib olinişi lozim.',
  },
  {
    id: 11,
    question: 'Vasiyatnoma qaysi şaklda tuzilişi va tasdiqlanişi şart?',
    options: [
      'A) Oğzaki vasiyat',
      'B) Yozma şaklda va notarius tomonidan tasdiqlangan holda',
      'C) Faqat guvohlar iştirokida audioyozuv',
      'D) Mahallada e’lon qilinişi bilan',
    ],
    correctIndex: 1,
    explanation: 'Vasiyatnoma yozma ravişda tuzilişi, joyi va vaqti körsatilgan holda notarius tomonidan tasdiqlangan bölişi şart.',
  },
  {
    id: 12,
    question: 'Ota-onalik huquqidan mahrum qiliş qaysi organ tomonidan amalga oşiriladi?',
    options: [
      'A) Vasiylik va homiylik organi',
      'B) Faqat sud tartibida',
      'C) Içki işlar organi',
      'D) Mahalla fuqarolar yiğini',
    ],
    correctIndex: 1,
    explanation: 'Ota-onalik huquqidan mahrum qiliş faqat sud tartibida va prokuror hamda vasiylik organi iştirokida amalga oşiriladi.',
  },
  {
    id: 13,
    question: '14 yoşga tölmagan bolalarga nisbatan qanday himoya şakli belgilanadi?',
    options: [
      'A) Homiylik',
      'B) Vasiylik',
      'C) Patronat',
      'D) Kafillik',
    ],
    correctIndex: 1,
    explanation: '14 yoşga tölmagan voyaga yetmaganlarga nisbatan vasiylik belgilanadi.',
  },
  {
    id: 14,
    question: '14 yoşdan 18 yoşgaça bölgan voyaga yetmaganlarga nisbatan nima belgilanadi?',
    options: [
      'A) Vasiylik',
      'B) Homiylik',
      'C) Mustaqil vasiylik',
      'D) Nazorat',
    ],
    correctIndex: 1,
    explanation: '14 yoşdan 18 yoşgaça bölgan şaxslarga nisbatan homiylik belgilanadi.',
  },
  {
    id: 15,
    question: 'Farzandlikka oliş qaysi organ tomonidan hal etiladi?',
    options: [
      'A) Faqat sud tomonidan',
      'B) FHDYo organi',
      'C) Bolalar uyi ma’muriyati',
      'D) Mahalla raisi',
    ],
    correctIndex: 0,
    explanation: 'Farzandlikka olişga faqat sudning qonuniy kuçga kirgan hal qiluv qaroriga asosan yöl qöyiladi.',
  },
];

interface HeroSlide {
  id: string;
  type: 'greeting' | 'news' | 'promo';
  badge: string;
  badgeBg: string;
  badgeTextColor: string;
  title: string;
  subtitle: string;
  ctaText?: string;
  image?: any;
  iconName?: string;
  iconColor?: string;
  actionAlertTitle: string;
  actionAlertMessage: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'school_promo_slide',
    type: 'promo',
    badge: 'HUQUQ MAKTABI',
    badgeBg: '#EFF6FF',
    badgeTextColor: '#0284C7',
    title: 'Professional yuridik\nbilimlar platformasi',
    subtitle: 'Interaktiv darslar, amaliy keyslar va rasmiy diplomlar!',
    ctaText: 'Kurslarni örganiş',
    image: heroIllustration,
    actionAlertTitle: 'Huquq maktabi platformasi',
    actionAlertMessage: 'Huquq maktabi orqali qonunchilik asoslarini o‘rganing, testlar yeching, ball to‘plang va rasmiy sertifikatlarga ega bo‘ling!',
  },
  {
    id: 'labor_code_slide',
    type: 'news',
    badge: 'QONUNÇILIK YANGILIGI',
    badgeBg: '#FEF3C7',
    badgeTextColor: '#B45309',
    title: 'Yangi Mehnat Kodeksi\nböyiça şarhlar',
    subtitle: 'Mehnat şartnomasi, sinov muddati va xodimlar kafolatlari.',
    ctaText: 'Darsga ötiş',
    image: gavelImage,
    actionAlertTitle: 'Yangi Mehnat Kodeksi sharhi',
    actionAlertMessage: 'Yangi tahrirdagi Mehnat kodeksi normalari va xodimlar huquqlarini himoya qilish bo‘yicha amaliy tavsiyalar mavjud.',
  },
  {
    id: 'store_promo_slide',
    type: 'promo',
    badge: 'MAKTAB DÖKONI',
    badgeBg: '#FAF5FF',
    badgeTextColor: '#7C3AED',
    title: 'Coin evaziga kitob va\nsovğalarni xarid qiling',
    subtitle: 'Hamkor kuponlari, elektron kitoblar va maxsus sovğalar!',
    ctaText: 'Dökonga ötiş',
    iconName: 'gift',
    iconColor: '#7C3AED',
    actionAlertTitle: 'Maktab Do‘koni',
    actionAlertMessage: 'Darslar va testlardan to‘plangan tangalaringiz evaziga foydali kitoblar, ta’lim vebinarlari va chegirmalarni oling!',
  },
  {
    id: 'bank_credits_slide',
    type: 'news',
    badge: 'TIZIM YANGILIGI',
    badgeBg: '#E0F2FE',
    badgeTextColor: '#0369A1',
    title: 'Bank kreditlarida fuqaro\nhuquqlarini himoya qiliş',
    subtitle: 'Kartadan ruxsatsiz yeçiş va foizlarni tekşiriş tartibi.',
    ctaText: 'Qöllanmani öqiş',
    iconName: 'shield-checkmark',
    iconColor: '#0284C7',
    actionAlertTitle: 'Bank kreditlari huquqiy himoyasi',
    actionAlertMessage: 'Markaziy bank 3030-son Nizomi va qonunchilik asosida bank nizolarida fuqaro huquqlarini himoya qilish bo‘yicha qo‘llanma.',
  },
];

type SchoolTab = 'home' | 'topics' | 'tests' | 'results';

interface HuquqMaktabiScreenProps {
  onBack: () => void;
  currentUser?: UserProfile | null;
}

interface QuickActionItem {
  id: string;
  title: string;
  iconName: string;
  iconFamily: 'Ionicons' | 'MaterialCommunityIcons' | 'FontAwesome5';
  iconColor: string;
  hasBadge?: boolean;
  badgeValue?: string;
  detail: string;
}

const QUICK_ACTIONS: QuickActionItem[] = [
  {
    id: 'daily_tasks',
    title: 'Kunlik vazifalar',
    iconName: 'calendar-outline',
    iconFamily: 'Ionicons',
    iconColor: '#0284C7',
    hasBadge: true,
    badgeValue: '1',
    detail: 'Kunlik topşiriqlar:\n1. Nikoh şartnomasi darsini yakunlaş.\n2. Kun savoliga javob beriş (+5 XP, +2 Coin).\n3. 1 ta test simulyatsiyasidan ötiş.',
  },
  {
    id: 'streak',
    title: 'Öqiş seriyasi',
    iconName: 'flame',
    iconFamily: 'Ionicons',
    iconColor: '#EA580C',
    hasBadge: true,
    badgeValue: '7 kun',
    detail: '🔥 Streak: 7 kun ketma-ket!\nHar kuni kamida bitta mavzuni örganib, uzluksizlik seriyasini davom ettiring va köpaytiruvçi bonuslarga ega böling.',
  },
];

interface LegalCategory {
  id: string;
  title: string;
  subtitle?: string;
  iconName: string;
  iconFamily: 'Ionicons' | 'MaterialCommunityIcons' | 'FontAwesome5';
  iconColor: string;
  lessonsCount: number;
  coursesCount?: number;
  progress: number;
  progressColor?: string;
  level: 'boshlangich' | 'orta' | 'ilgor';
}

const LEGAL_CATEGORIES: LegalCategory[] = [
  {
    id: 'konstitutsiya',
    title: 'Konstitutsiyaviy\nhuquq',
    subtitle: 'Konstitutsiyaviy tuzum, inson huquqlari va davlat hokimiyati asoslari.',
    iconName: 'scale-outline',
    iconFamily: 'Ionicons',
    iconColor: '#0284C7',
    lessonsCount: 0,
    coursesCount: 0,
    progress: 0,
    progressColor: '#94A3B8',
    level: 'boshlangich',
  },
  {
    id: 'fuqarolik',
    title: 'Fuqarolik\nhuquqi',
    subtitle: 'Mulk huquqi, şartnomalar, bitimlar va majburiyatlar tartibi.',
    iconName: 'people',
    iconFamily: 'Ionicons',
    iconColor: '#F59E0B',
    lessonsCount: 0,
    coursesCount: 0,
    progress: 0,
    progressColor: '#94A3B8',
    level: 'orta',
  },
  {
    id: 'oila',
    title: 'Oila\nhuquqi',
    subtitle: 'Oila, nikoh, ota-onalik, aliment va boşqa oilaviy munosabatlar böyiça huquqiy bilimlar.',
    iconName: 'people',
    iconFamily: 'Ionicons',
    iconColor: '#0284C7',
    lessonsCount: 0,
    coursesCount: 0,
    progress: 0,
    progressColor: '#94A3B8',
    level: 'boshlangich',
  },
  {
    id: 'mehnat',
    title: 'Mehnat\nhuquqi',
    subtitle: 'Mehnat şartnomasi, xodim kafolatlari, iş vaqti va dam oliş huquqi.',
    iconName: 'hard-hat',
    iconFamily: 'FontAwesome5',
    iconColor: '#F59E0B',
    lessonsCount: 0,
    coursesCount: 0,
    progress: 0,
    progressColor: '#94A3B8',
    level: 'boshlangich',
  },
  {
    id: 'istemolchi',
    title: 'Iste’molçi\nhuquqlari',
    iconName: 'cart',
    iconFamily: 'Ionicons',
    iconColor: '#F59E0B',
    lessonsCount: 0,
    coursesCount: 0,
    progress: 0,
    progressColor: '#94A3B8',
    level: 'boshlangich',
  },
  {
    id: 'mamuriy',
    title: 'Ma’muriy\nhuquq',
    iconName: 'shield-checkmark',
    iconFamily: 'Ionicons',
    iconColor: '#F59E0B',
    lessonsCount: 0,
    coursesCount: 0,
    progress: 0,
    progressColor: '#94A3B8',
    level: 'orta',
  },
  {
    id: 'jinoyat',
    title: 'Jinoyat\nhuquqi',
    iconName: 'gavel',
    iconFamily: 'FontAwesome5',
    iconColor: '#B45309',
    lessonsCount: 0,
    coursesCount: 0,
    progress: 0,
    progressColor: '#94A3B8',
    level: 'ilgor',
  },
  {
    id: 'uy_joy',
    title: 'Uy-joy\nhuquqi',
    iconName: 'home',
    iconFamily: 'Ionicons',
    iconColor: '#0284C7',
    lessonsCount: 0,
    coursesCount: 0,
    progress: 0,
    progressColor: '#94A3B8',
    level: 'orta',
  },
  {
    id: 'raqamli',
    title: 'Raqamli\nhuquqlar',
    iconName: 'laptop',
    iconFamily: 'Ionicons',
    iconColor: '#0284C7',
    lessonsCount: 0,
    coursesCount: 0,
    progress: 0,
    progressColor: '#94A3B8',
    level: 'ilgor',
  },
  {
    id: 'moliyaviy',
    title: 'Moliyaviy\nhuquqlar',
    iconName: 'coins',
    iconFamily: 'FontAwesome5',
    iconColor: '#F59E0B',
    lessonsCount: 0,
    coursesCount: 0,
    progress: 0,
    progressColor: '#94A3B8',
    level: 'ilgor',
  },
];

const computeCategoryStats = (
  cat: LegalCategory,
  allCourses: TopicCourseItem[],
  allLessons: CourseLesson[]
): LegalCategory => {
  const topicCourses = allCourses.filter((c) => c.topicId === cat.id);
  const topicCourseIds = topicCourses.map((c) => c.id);
  const topicLessons = allLessons.filter(
    (l) => l.topicId === cat.id || topicCourseIds.includes(l.courseId || '')
  );

  const realCoursesCount = topicCourses.length;
  const realLessonsCount = topicLessons.length;

  let realProgress = 0;
  if (topicLessons.length > 0) {
    const completed = topicLessons.filter((l) => l.status === 'completed').length;
    realProgress = Math.round((completed / topicLessons.length) * 100);
  } else if (topicCourses.length > 0) {
    const validCourses = topicCourses.filter((c) => (c.progress || 0) > 0);
    realProgress = validCourses.length > 0
      ? Math.round(
          validCourses.reduce((sum, c) => sum + (Number(c.progress) || 0), 0) / topicCourses.length
        )
      : 0;
  }

  const realProgressColor =
    realProgress >= 75
      ? '#10B981'
      : realProgress >= 25
        ? '#F59E0B'
        : realProgress > 0
          ? '#38BDF8'
          : '#94A3B8';

  return {
    ...cat,
    coursesCount: realCoursesCount,
    lessonsCount: realLessonsCount,
    progress: realProgress,
    progressColor: realProgressColor,
  };
};

const mapBackendTopicsToCategories = (backendTopics: any[]): LegalCategory[] => {
  if (!Array.isArray(backendTopics) || backendTopics.length === 0) {
    return LEGAL_CATEGORIES;
  }

  // Sort strictly by order
  const sorted = [...backendTopics].sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

  return sorted.map((bt) => {
    const fallback = LEGAL_CATEGORIES.find((c) => c.id === bt.id);

    let formattedTitle = bt.title || fallback?.title || '';
    if (!formattedTitle.includes('\n')) {
      const parts = formattedTitle.split(' ');
      if (parts.length === 2) {
        formattedTitle = `${parts[0]}\n${parts[1]}`;
      }
    }

    const levelStr = (bt.level || '').toLowerCase();
    const mappedLevel: 'boshlangich' | 'orta' | 'ilgor' =
      levelStr.includes('bosh') ? 'boshlangich' : levelStr.includes('orta') ? 'orta' : 'ilgor';

    const ic = (bt.iconName || fallback?.iconName || 'book-outline').toLowerCase();
    let iconFamily: 'Ionicons' | 'MaterialCommunityIcons' | 'FontAwesome5' = 'Ionicons';
    if (ic === 'gavel' || ic === 'coins' || ic === 'hard-hat') {
      iconFamily = 'FontAwesome5';
    }

    return {
      id: bt.id,
      title: formattedTitle,
      subtitle: bt.subtitle || fallback?.subtitle || '',
      iconName: bt.iconName || fallback?.iconName || 'book-outline',
      iconFamily,
      iconColor: bt.color || fallback?.iconColor || '#0284C7',
      lessonsCount: Number(bt.lessonsCount) || 0,
      coursesCount: 0,
      progress: 0,
      progressColor: '#94A3B8',
      level: mappedLevel,
    };
  });
};

const extractYouTubeVideoId = (urlOrEmbed?: string): string | null => {
  if (!urlOrEmbed) return null;
  const str = urlOrEmbed.trim();
  const iframeMatch = str.match(/src=["'](?:https?:)?\/\/(?:www\.)?youtube(?:-nocookie)?\.com\/embed\/([a-zA-Z0-9_-]{11})/i);
  if (iframeMatch && iframeMatch[1]) {
    return iframeMatch[1];
  }
  const regExp = /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([a-zA-Z0-9_-]{11})/i;
  const match = str.match(regExp);
  if (match && match[1]) {
    return match[1];
  }
  if (/^[a-zA-Z0-9_-]{11}$/.test(str)) {
    return str;
  }
  return null;
};

export const HuquqMaktabiScreen: React.FC<HuquqMaktabiScreenProps> = ({ onBack, currentUser }) => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<SchoolTab>('home');
  const [dailyQuizAnswered, setDailyQuizAnswered] = useState(false);
  const [quizModalVisible, setQuizModalVisible] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  // Authenticated User Profile session handling
  const [activeUser, setActiveUser] = useState<UserProfile | null>(currentUser || null);

  useEffect(() => {
    if (currentUser) {
      setActiveUser(currentUser);
    } else {
      authService
        .getSession()
        .then((session) => {
          if (session?.user) {
            setActiveUser(session.user);
          }
        })
        .catch((err) => {
          console.warn('Error fetching session in HuquqMaktabi:', err);
        });
    }
  }, [currentUser]);

  const userDisplayName = useMemo(() => {
    if (activeUser?.name && activeUser.name.trim()) return activeUser.name.trim();
    const combined = `${activeUser?.firstName || ''} ${activeUser?.lastName || ''}`.trim();
    if (combined) return combined;
    return 'Huquq Maktabi Talabasi';
  }, [activeUser]);

  const userPhoneOrEmail = useMemo(() => {
    if (activeUser?.phone && activeUser.phone.trim()) return activeUser.phone.trim();
    if (activeUser?.email && activeUser.email.trim()) return activeUser.email.trim();
    return '+998 90 123 45 67';
  }, [activeUser]);

  const userInitial = useMemo(() => {
    if (activeUser?.firstName && activeUser.firstName.trim()) {
      return activeUser.firstName.trim().charAt(0).toUpperCase();
    }
    if (activeUser?.name && activeUser.name.trim()) {
      return activeUser.name.trim().charAt(0).toUpperCase();
    }
    return 'U';
  }, [activeUser]);

  const userDisplayId = useMemo(() => {
    if (activeUser?.id) {
      const cleanId = String(activeUser.id).replace(/\D/g, '');
      const idSuffix = cleanId ? cleanId.slice(-4).padStart(4, '0') : String(activeUser.id).slice(-4);
      return `ID: HM-2024-${idSuffix}`;
    }
    return 'ID: HM-2024-884';
  }, [activeUser]);

  const userRoleTitle = useMemo(() => {
    return activeUser?.role || 'Faol o‘quvchi';
  }, [activeUser]);

  // Dynamic real-time legal topics and banners synchronized with Admin Panel & Backend
  const [legalCategories, setLegalCategories] = useState<LegalCategory[]>(LEGAL_CATEGORIES);
  const [homeBanners, setHomeBanners] = useState<any[]>([]);
  const [dynamicCourses, setDynamicCourses] = useState<TopicCourseItem[]>([]);
  const [dynamicLessons, setDynamicLessons] = useState<CourseLesson[]>([]);

  // Memoized real categories with dynamic real-time progress, course counts and lesson counts
  const activeCategories = useMemo(() => {
    return legalCategories.map((cat) => computeCategoryStats(cat, dynamicCourses, dynamicLessons));
  }, [legalCategories, dynamicCourses, dynamicLessons]);

  // Overall progress percentage across all categories (dynamically computed from real data)
  const overallProgressPercent = useMemo(() => {
    if (activeCategories.length === 0) return 0;
    const sum = activeCategories.reduce((acc, cat) => acc + (cat.progress || 0), 0);
    return Math.round(sum / activeCategories.length);
  }, [activeCategories]);

  // Topics tab search & level filter state
  const [topicSearchQuery, setTopicSearchQuery] = useState('');
  const [selectedTopicLevel, setSelectedTopicLevel] = useState<'all' | 'boshlangich' | 'orta' | 'ilgor'>('all');

  // Topic Detail Screen state
  const [selectedTopicDetail, setSelectedTopicDetail] = useState<LegalCategory | null>(null);
  const [detailSubTab, setDetailSubTab] = useState<'courses' | 'lessons' | 'tests' | 'stats'>('courses');

  // Real-time listener for Huquq Maktabi topics, banners, courses, lessons and store
  useEffect(() => {
    const unsubscribe = legalServicesApi.subscribeToHuquqMaktabi((data) => {
      if (data) {
        if (Array.isArray(data.topics) && data.topics.length > 0) {
          const mapped = mapBackendTopicsToCategories(data.topics);
          setLegalCategories(mapped);
          setSelectedTopicDetail((prev) => {
            if (!prev) return null;
            const updated = mapped.find((c) => c.id === prev.id);
            return updated ? { ...prev, ...updated } : prev;
          });
        }
        if (Array.isArray(data.banners)) {
          const now = Date.now();
          const active = data.banners.filter((b: any) => !b.expiresAt || b.expiresAt > now);
          setHomeBanners(active);
        }
        if (Array.isArray(data.courses)) {
          setDynamicCourses(data.courses);
          setSelectedCourseDetail((prev) => {
            if (!prev) return null;
            const updated = data.courses.find((c: any) => c.id === prev.id);
            return updated ? { ...prev, ...updated } : prev;
          });
        }
        if (Array.isArray(data.lessons)) {
          setDynamicLessons(data.lessons);
          setSelectedLessonVideo((prev) => {
            if (!prev) return null;
            const updated = data.lessons.find((l: any) => l.id === prev.id);
            return updated ? { ...prev, ...updated } : prev;
          });
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Course Detail Screen state (1:1 design matching user upload)
  const [selectedCourseDetail, setSelectedCourseDetail] = useState<TopicCourseItem | null>(null);
  const [courseSubTab, setCourseSubTab] = useState<'lessons' | 'about' | 'test' | 'reviews'>('lessons');
  const [isCourseBookmarked, setIsCourseBookmarked] = useState(false);

  // Video Lesson Watching Screen state (1:1 design matching user upload)
  const [selectedLessonVideo, setSelectedLessonVideo] = useState<CourseLesson | null>(null);
  const [videoSubTab, setVideoSubTab] = useState<'content' | 'notes' | 'materials'>('content');
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [videoSpeed, setVideoSpeed] = useState<'1.0x' | '1.25x' | '1.5x' | '2.0x'>('1.0x');
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [isLessonBookmarked, setIsLessonBookmarked] = useState(false);
  const [isLessonDownloaded, setIsLessonDownloaded] = useState(false);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [userNotes, setUserNotes] = useState('');
  const [youtubePlayerError, setYoutubePlayerError] = useState(false);

  useEffect(() => {
    setYoutubePlayerError(false);
  }, [selectedLessonVideo?.id]);

  // Real lessons belonging to the currently selected course or lesson
  const currentCourseLessons = useMemo(() => {
    if (selectedCourseDetail) {
      return dynamicLessons.filter((l) => l.courseId === selectedCourseDetail.id);
    }
    if (selectedLessonVideo?.courseId) {
      return dynamicLessons.filter((l) => l.courseId === selectedLessonVideo.courseId);
    }
    return [];
  }, [selectedCourseDetail, selectedLessonVideo, dynamicLessons]);

  // Course Final Test Screen state (1:1 design matching user upload)
  const [isTakingCourseFinalTest, setIsTakingCourseFinalTest] = useState(false);
  const [currentTestQuestionIndex, setCurrentTestQuestionIndex] = useState(1);
  const [selectedTestAnswers, setSelectedTestAnswers] = useState<Record<number, number>>({
    0: 1,
    1: 1, // Q2: user picked B (17 yosh) -> WRONG! Correct is C (18 yosh, index 2)
    2: 1,
    3: 2,
    4: 2, // Q5: user picked C -> WRONG! Correct is B
    5: 0,
    6: 1,
    7: 0, // Q8: user picked A -> WRONG! Correct is B
    8: 1,
    9: 1,
    10: 1,
    11: 1,
    12: 1,
    13: 0,
    14: 1,
    15: 1,
    16: 0,
    17: 1,
    18: 1,
    19: 1,
  });
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<Record<number, boolean>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});
  const [testTimerSeconds, setTestTimerSeconds] = useState(1476); // 24:36 in seconds

  // Test Result Screen state (1:1 design matching user upload)
  const [isViewingTestResult, setIsViewingTestResult] = useState(false);
  const [testResultStats, setTestResultStats] = useState({
    correct: 17,
    incorrect: 3,
    unanswered: 0,
    percentage: 85,
    xpAwarded: 400,
    coinsAwarded: 20,
    timeSpent: '30 daqiqa',
  });

  // Test Review Screens state (Phone 2 & Phone 3 in user mockup)
  const [isViewingReviewList, setIsViewingReviewList] = useState(false);
  const [selectedReviewQuestionIndex, setSelectedReviewQuestionIndex] = useState<number | null>(null);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'errors'>('all');

  // Course Completion & Certificate Screen states (Phone 2 & Phone 3 from user mockup)
  const [isViewingCourseCompleted, setIsViewingCourseCompleted] = useState(false);
  const [isViewingCertificate, setIsViewingCertificate] = useState(false);

  // Bo'limlar bo'yicha testlar screen state (1:1 design matching user upload)
  const [isViewingTestCategories, setIsViewingTestCategories] = useState(false);
  const [selectedTestCategoryForModal, setSelectedTestCategoryForModal] = useState<TestCategoryItem | null>(null);

  // Category Test Taking Screen state (1:1 design matching media_1794316514481_dac518e9.jpg)
  const [isTakingCategoryTest, setIsTakingCategoryTest] = useState(false);
  const [activeCategoryTest, setActiveCategoryTest] = useState<TestCategoryItem | null>(null);
  const [categoryTestQuestionIndex, setCategoryTestQuestionIndex] = useState(3); // 4-savol default matching mockup
  const [categoryTestAnswers, setCategoryTestAnswers] = useState<Record<number, number>>({ 3: 2 }); // Option C preselected matching mockup
  const [categoryTimerSeconds, setCategoryTimerSeconds] = useState(684); // 11:24 matching mockup
  const [categoryBookmarkedQuestions, setCategoryBookmarkedQuestions] = useState<Record<number, boolean>>({});

  // Category Test Result Screen state (1:1 design matching media_1793991259614_aaa3f125.jpg)
  const [isViewingCategoryResult, setIsViewingCategoryResult] = useState(false);
  const [categoryResultStats, setCategoryResultStats] = useState({
    correct: 14,
    incorrect: 1,
    unanswered: 0,
    percentage: 93,
    timeSpent: '11 daqiqa',
    xpAwarded: 40,
    coinsAwarded: 15,
  });

  // Results Tab States (1:1 design matching media_1794320729104_16e9f97e.jpg)
  const [resultsSubTab, setResultsSubTab] = useState<'personal' | 'ranking'>('personal');
  const [rankingPeriod, setRankingPeriod] = useState<'all' | 'monthly' | 'weekly'>('all');
  const [rankingSearchQuery, setRankingSearchQuery] = useState('');
  const [isStoreModalVisible, setIsStoreModalVisible] = useState(false);
  const [userCoinsBalance, setUserCoinsBalance] = useState(2350);

  // School Profile Screen State
  const [isViewingSchoolProfile, setIsViewingSchoolProfile] = useState(false);

  // Store Full Screen States (1:1 design matching media_1794325403706_8c845361.jpg)
  const [isViewingSchoolStore, setIsViewingSchoolStore] = useState(false);
  const [storeActiveCategory, setStoreActiveCategory] = useState<string | null>(null);
  const [storeSearchQuery, setStoreSearchQuery] = useState('');
  const [storeCatalogFilter, setStoreCatalogFilter] = useState('Barchasi');
  const [storeFavorites, setStoreFavorites] = useState<string[]>([]);
  const [purchasedStoreItems, setPurchasedStoreItems] = useState<string[]>([]);
  const [storeSortMode, setStoreSortMode] = useState<'popular' | 'price_asc' | 'price_desc'>('popular');
  const [selectedStoreDetailItem, setSelectedStoreDetailItem] = useState<DigitalStoreItem | null>(null);
  const [isConfirmingStoreOrder, setIsConfirmingStoreOrder] = useState(false);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [storeBannerIndex, setStoreBannerIndex] = useState(0);
  const storeSwiperRef = useRef<any>(null);

  // My Purchased Products Screen States
  const [isViewingMyPurchases, setIsViewingMyPurchases] = useState(false);
  const [myPurchasesFilter, setMyPurchasesFilter] = useState<'Barchasi' | 'talim' | 'hamkorlar' | 'maxsus'>('Barchasi');

  // Animated Order Success Center Alert Modal States
  const [isOrderSuccessModalVisible, setIsOrderSuccessModalVisible] = useState(false);
  const [orderSuccessDetails, setOrderSuccessDetails] = useState<{
    orderId: string;
    item: DigitalStoreItem;
    quantity: number;
    totalCoins: number;
    remainingCoins: number;
    couponCode: string;
  } | null>(null);

  const successModalScale = useRef(new Animated.Value(0.7)).current;
  const successModalOpacity = useRef(new Animated.Value(0)).current;
  const successIconScale = useRef(new Animated.Value(0.3)).current;

  const openOrderSuccessModal = (details: {
    orderId: string;
    item: DigitalStoreItem;
    quantity: number;
    totalCoins: number;
    remainingCoins: number;
    couponCode: string;
  }) => {
    setOrderSuccessDetails(details);
    setIsOrderSuccessModalVisible(true);
    successModalScale.setValue(0.7);
    successModalOpacity.setValue(0);
    successIconScale.setValue(0.3);

    Animated.parallel([
      Animated.spring(successModalScale, {
        toValue: 1,
        friction: 6,
        tension: 60,
        useNativeDriver: true,
      }),
      Animated.timing(successModalOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(100),
        Animated.spring(successIconScale, {
          toValue: 1,
          friction: 4,
          tension: 80,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  const closeOrderSuccessModal = (goToPurchases: boolean = false) => {
    Animated.parallel([
      Animated.timing(successModalScale, {
        toValue: 0.8,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(successModalOpacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsOrderSuccessModalVisible(false);
      setIsConfirmingStoreOrder(false);
      if (goToPurchases) {
        setSelectedStoreDetailItem(null);
        setIsViewingMyPurchases(true);
      }
    });
  };

  const handleConfirmOrderSubmit = () => {
    if (!selectedStoreDetailItem) return;
    const total =
      selectedStoreDetailItem.category === 'maxsus'
        ? selectedStoreDetailItem.priceCoins * orderQuantity
        : selectedStoreDetailItem.priceCoins;

    if (userCoinsBalance < total) {
      Alert.alert(
        'Coin yetarli emas',
        `Ushbu buyurtma uchun yana ${(total - userCoinsBalance).toLocaleString()} Coin kerak. Testlar topshirib ko‘proq tanga yig‘ing!`
      );
      return;
    }

    const generatedId = `HM-${Math.floor(1000 + Math.random() * 9000)}`;
    const generatedCode =
      selectedStoreDetailItem.couponCode || `LAW-${Math.floor(10000 + Math.random() * 90000)}`;

    setUserCoinsBalance((prev) => prev - total);
    setPurchasedStoreItems((prev) =>
      prev.includes(selectedStoreDetailItem.id) ? prev : [...prev, selectedStoreDetailItem.id]
    );

    openOrderSuccessModal({
      orderId: generatedId,
      item: selectedStoreDetailItem,
      quantity: selectedStoreDetailItem.category === 'maxsus' ? orderQuantity : 1,
      totalCoins: total,
      remainingCoins: userCoinsBalance - total,
      couponCode: generatedCode,
    });
  };

  // Auto-play timer for store banner swiper
  useEffect(() => {
    if (!isViewingSchoolStore || storeActiveCategory !== null || selectedStoreDetailItem !== null) return;
    const interval = setInterval(() => {
      setStoreBannerIndex((prev) => {
        const nextIndex = (prev + 1) % STORE_BANNER_SLIDES.length;
        if (storeSwiperRef.current) {
          storeSwiperRef.current.scrollTo({
            x: nextIndex * (width - 32),
            animated: true,
          });
        }
        return nextIndex;
      });
    }, 3800);

    return () => clearInterval(interval);
  }, [isViewingSchoolStore, storeActiveCategory]);

  // Pulsing glow animation for Maktab Do'koni banner ("yonib o'chadigan dizayn")
  const storeGlowAnim = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(storeGlowAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(storeGlowAnim, {
          toValue: 0.35,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [storeGlowAnim]);

  const toggleStoreFavorite = (itemId: string) => {
    setStoreFavorites((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const handlePurchaseStoreItem = (item: DigitalStoreItem) => {
    const isPurchased = purchasedStoreItems.includes(item.id);
    if (isPurchased) {
      Alert.alert(
        'Faol mahsulot',
        `“${item.title}” sizda allaqachon mavjud va profilingizga biriktirilgan.`
      );
      return;
    }

    Alert.alert(
      'Xaridni tasdiqlaş',
      `“${item.title}”ni ${item.priceCoins.toLocaleString()} Coin evaziga sotib olasizmi?\n\nSizning balansingiz: ${userCoinsBalance.toLocaleString()} Coin`,
      [
        { text: 'Bekor qiliş', style: 'cancel' },
        {
          text: 'Sotib oliş',
          style: 'default',
          onPress: () => {
            if (userCoinsBalance < item.priceCoins) {
              Alert.alert(
                'Coin yetarli emas',
                `Ushbu mahsulot uchun yana ${(item.priceCoins - userCoinsBalance).toLocaleString()} Coin kerak. Testlar topshirib ko‘proq tanga yig‘ing!`
              );
              return;
            }
            setUserCoinsBalance((prev) => prev - item.priceCoins);
            setPurchasedStoreItems((prev) => [...prev, item.id]);
            Alert.alert(
              'Muvaffaqiyatli xarid! 🎉',
              `“${item.title}” muvaffaqiyatli xarid qilindi!\nQolgan balansingiz: ${(userCoinsBalance - item.priceCoins).toLocaleString()} Coin`
            );
          },
        },
      ]
    );
  };

  const handleSortPress = () => {
    Alert.alert(
      'Saralaş tartibi',
      'Mahsulotlarni qanday tartibda körmoqçisiz?',
      [
        {
          text: 'Maşhurligi böyiça',
          onPress: () => setStoreSortMode('popular'),
        },
        {
          text: 'Narx: arzonroqdan qimmatroqqa',
          onPress: () => setStoreSortMode('price_asc'),
        },
        {
          text: 'Narx: qimmatroqdan arzonroqqa',
          onPress: () => setStoreSortMode('price_desc'),
        },
        { text: 'Bekor qiliş', style: 'cancel' },
      ]
    );
  };

  const getActiveCategoryPills = () => {
    if (storeActiveCategory === 'Ta’lim imtiyozlari') {
      return ['Barchasi', 'Elektron kitoblar', 'Kitob kuponlari', 'Seminarlar', 'Mentorlik'];
    }
    if (storeActiveCategory === 'Maxsus sovg‘alar') {
      return [
        'Barchasi',
        'Elektronika',
        'Kitoblar',
        'O‘quv anjomlari',
        'Brend sovg‘alari',
        'Ofis buyumlari',
        'Maxsus sovg‘alar',
      ];
    }
    if (storeActiveCategory === 'Hamkorlar takliflari') {
      return [
        'Barchasi',
        'Kitob do‘konlari',
        'O‘quv markazlari',
        'Til markazlari',
        'Yuridik firmalar',
        'Universitetlar',
        'IT markazlari',
        'Kafe va restoranlar',
        'Kantselyariya',
      ];
    }
    if (storeActiveCategory === 'Yangi va mashhur mahsulotlar' || storeActiveCategory === 'Barcha mahsulotlar') {
      return ['Barchasi', 'Eng yangilar', 'Top takliflar', 'Chegirmalar', 'Ta’lim', 'Maxsus', 'Hamkorlar'];
    }
    return ['Barchasi', 'Hamkorlar takliflari', 'Ta’lim imtiyozlari', 'Maxsus sovg‘alar'];
  };

  const getSortedFilteredStoreItems = () => {
    let items = [...DIGITAL_STORE_ITEMS];

    // Filter by active major category
    if (
      storeActiveCategory &&
      storeActiveCategory !== 'Barcha mahsulotlar' &&
      storeActiveCategory !== 'Yangi va mashhur mahsulotlar'
    ) {
      const matchCat =
        storeActiveCategory === 'Ta’lim imtiyozlari'
          ? 'talim'
          : storeActiveCategory === 'Maxsus sovg‘alar'
            ? 'maxsus'
            : storeActiveCategory === 'Hamkorlar takliflari'
              ? 'hamkorlar'
              : null;
      if (matchCat) {
        items = items.filter((it) => it.category === matchCat);
      }
    }

    // Filter by subcategory pill
    if (storeActiveCategory === 'Yangi va mashhur mahsulotlar' || storeActiveCategory === 'Barcha mahsulotlar') {
      if (storeCatalogFilter === 'Eng yangilar') {
        items = items.filter((it) => it.isNew);
      } else if (storeCatalogFilter === 'Top takliflar') {
        items = items.filter((it) => it.isPopular);
      } else if (storeCatalogFilter === 'Chegirmalar') {
        items = items.filter((it) => !!it.discountTitle || it.category === 'hamkorlar');
      } else if (storeCatalogFilter === 'Ta’lim') {
        items = items.filter((it) => it.category === 'talim');
      } else if (storeCatalogFilter === 'Maxsus') {
        items = items.filter((it) => it.category === 'maxsus');
      } else if (storeCatalogFilter === 'Hamkorlar') {
        items = items.filter((it) => it.category === 'hamkorlar');
      }
    } else if (storeCatalogFilter !== 'Barchasi') {
      const filterLower = storeCatalogFilter.toLowerCase();
      items = items.filter(
        (it) =>
          it.subcategory.toLowerCase() === filterLower ||
          it.categoryLabel.toLowerCase() === filterLower
      );
    }

    // Search query filter
    if (storeSearchQuery.trim()) {
      const q = storeSearchQuery.toLowerCase().trim();
      items = items.filter(
        (it) =>
          it.title.toLowerCase().includes(q) ||
          it.desc.toLowerCase().includes(q) ||
          (it.partnerName && it.partnerName.toLowerCase().includes(q)) ||
          it.subcategory.toLowerCase().includes(q)
      );
    }

    // Sort mode
    if (storeSortMode === 'price_asc') {
      items.sort((a, b) => a.priceCoins - b.priceCoins);
    } else if (storeSortMode === 'price_desc') {
      items.sort((a, b) => b.priceCoins - a.priceCoins);
    } else if (
      (storeActiveCategory === 'Yangi va mashhur mahsulotlar' || storeActiveCategory === 'Barcha mahsulotlar') &&
      storeCatalogFilter === 'Barchasi'
    ) {
      // Prioritize newest added and top popular
      items.sort((a, b) => {
        if (a.isNew && !b.isNew) return -1;
        if (!a.isNew && b.isNew) return 1;
        return (b.popularity || 0) - (a.popularity || 0);
      });
    } else {
      items.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    }

    return items;
  };

  // Countdown timer for Category Test
  useEffect(() => {
    if (!isTakingCategoryTest) return;
    const timer = setInterval(() => {
      setCategoryTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isTakingCategoryTest]);

  // Testlar tarixi state (Segment in Testlar tab & Results tab)
  const [testsTabSegment, setTestsTabSegment] = useState<'available' | 'history'>('available');
  const [testHistoryFilter, setTestHistoryFilter] = useState<'all' | 'passed' | 'retake'>('all');

  // Countdown timer for Final Test
  useEffect(() => {
    if (!isTakingCourseFinalTest) return;
    const timer = setInterval(() => {
      setTestTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isTakingCourseFinalTest]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Swiper / Carousel state & controls (Hero Banners)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const swiperRef = useRef<any>(null);

  const activeSlides = (homeBanners && homeBanners.length > 0) ? homeBanners : HERO_SLIDES;

  useEffect(() => {
    if (activeTab !== 'home') return;
    if (activeSlides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => {
        const next = (prev + 1) % activeSlides.length;
        swiperRef.current?.scrollTo({ x: next * SLIDE_WIDTH, animated: true });
        return next;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [activeTab, activeSlides.length]);

  const handleScrollEnd = (e: any) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const newIdx = Math.round(offsetX / SLIDE_WIDTH);
    if (newIdx >= 0 && newIdx < activeSlides.length) {
      setCurrentSlideIndex(newIdx);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlideIndex(index);
    swiperRef.current?.scrollTo({ x: index * SLIDE_WIDTH, animated: true });
  };

  const handleQuizAnswer = (index: number) => {
    setSelectedAnswer(index);
    setTimeout(() => {
      setDailyQuizAnswered(true);
      setQuizModalVisible(false);
      Alert.alert(
        index === 0 ? 'To‘g‘ri javob! 🎉' : 'Javob qabul qilindi',
        index === 0
          ? 'Qonunchilikda mehnat shartnomasi nomuayyan (muddatsiz) yoki 5 yildan ko‘p bo‘lmagan muddatga tuzilishi mumkin. Sizga +5 XP va +2 Coin berildi!'
          : 'To‘g‘ri javob: Minimal muddat belgilanmagan. Mehnat shartnomasi nomuayyan yoki muayyan muddatga tuziladi.',
        [{ text: 'Ajoyib' }]
      );
    }, 300);
  };

  const renderCategoryIcon = (cat: LegalCategory) => {
    const ic = (cat.iconName || '').toLowerCase();
    if (cat.iconFamily === 'FontAwesome5' || ic === 'gavel' || ic === 'coins' || ic === 'hard-hat') {
      return <FontAwesome5 name={cat.iconName as any} size={22} color={cat.iconColor || '#F59E0B'} />;
    }
    if (cat.iconFamily === 'MaterialCommunityIcons') {
      return <MaterialCommunityIcons name={cat.iconName as any} size={24} color={cat.iconColor || '#0284C7'} />;
    }
    if (cat.id === 'oila' && (cat.iconName === 'people' || !cat.iconName)) {
      return (
        <View style={{ position: 'relative', width: 30, height: 28, justifyContent: 'center', alignItems: 'center' }}>
          <Ionicons name="people" size={25} color="#0284C7" />
          <Ionicons name="heart" size={11} color="#F59E0B" style={{ position: 'absolute', top: -1, right: 0 }} />
        </View>
      );
    }
    return <Ionicons name={(cat.iconName || 'book-outline') as any} size={25} color={cat.iconColor || '#0284C7'} />;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      {/* ===================== TOP HEADER BAR ===================== */}
      {(() => {
        const isTestTabRoot =
          (activeTab === 'tests' || activeTab === 'results') &&
          !isTakingCategoryTest &&
          !isViewingCategoryResult &&
          !isViewingTestCategories &&
          !selectedTopicDetail &&
          !selectedCourseDetail &&
          !selectedLessonVideo &&
          !isTakingCourseFinalTest &&
          !isViewingTestResult &&
          !isViewingReviewList &&
          selectedReviewQuestionIndex === null &&
          !isViewingCourseCompleted &&
          !isViewingCertificate &&
          !isViewingSchoolStore;

        return (
          <View style={styles.topHeader}>
            {/* Left: Back button + School logo & Title */}
            <View style={styles.headerLeftGroup}>
              <TouchableOpacity
                style={styles.backBtn}
                activeOpacity={0.7}
                onPress={() => {
                  if (isViewingSchoolProfile) {
                    setIsViewingSchoolProfile(false);
                  } else if (isViewingSchoolStore) {
                    if (isConfirmingStoreOrder) {
                      setIsConfirmingStoreOrder(false);
                    } else if (selectedStoreDetailItem !== null) {
                      setSelectedStoreDetailItem(null);
                    } else if (isViewingMyPurchases) {
                      setIsViewingMyPurchases(false);
                    } else if (storeActiveCategory !== null) {
                      setStoreActiveCategory(null);
                    } else {
                      setIsViewingSchoolStore(false);
                    }
                  } else if (isViewingCategoryResult) {
                    setIsViewingCategoryResult(false);
                    setIsViewingTestCategories(true);
                  } else if (isTakingCategoryTest) {
                    Alert.alert(
                      'Testni töxtatiş',
                      'Testni tark etmoqçimisiz? Natijangiz saqlanmasligi mumkin.',
                      [
                        { text: 'Davom etiş', style: 'cancel' },
                        {
                          text: 'Çiqiş',
                          style: 'destructive',
                          onPress: () => {
                            setIsTakingCategoryTest(false);
                            setIsViewingTestCategories(true);
                          },
                        },
                      ]
                    );
                  } else if (isViewingTestCategories) {
                    setIsViewingTestCategories(false);
                  } else if (isViewingCertificate) {
                    setIsViewingCertificate(false);
                  } else if (isViewingCourseCompleted) {
                    setIsViewingCourseCompleted(false);
                    setIsViewingTestResult(true);
                  } else if (selectedReviewQuestionIndex !== null) {
                    setSelectedReviewQuestionIndex(null);
                  } else if (isViewingReviewList) {
                    setIsViewingReviewList(false);
                    setIsViewingTestResult(true);
                  } else if (isViewingTestResult) {
                    setIsViewingTestResult(false);
                  } else if (isTakingCourseFinalTest) {
                    Alert.alert(
                      'Testni yakunlaş',
                      'Testni haqiqatdan ham tark etmoqçimisiz? Natijangiz saqlanmasligi mumkin.',
                      [
                        { text: 'Bekor qiliş', style: 'cancel' },
                        {
                          text: 'Çiqiş',
                          style: 'destructive',
                          onPress: () => setIsTakingCourseFinalTest(false),
                        },
                      ]
                    );
                  } else if (selectedLessonVideo) {
                    setSelectedLessonVideo(null);
                  } else if (selectedCourseDetail) {
                    setSelectedCourseDetail(null);
                  } else if (selectedTopicDetail) {
                    setSelectedTopicDetail(null);
                  } else {
                    onBack();
                  }
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="arrow-back" size={24} color="#0F172A" />
              </TouchableOpacity>

              {isViewingSchoolProfile ? (
                <View style={styles.storeHeaderTitleRow}>
                  <Text style={styles.storeHeaderMainTitle} numberOfLines={1}>
                    Mening profilim
                  </Text>
                </View>
              ) : isViewingSchoolStore ? (
                <View style={styles.storeHeaderTitleRow}>
                  <Text style={styles.storeHeaderMainTitle} numberOfLines={1}>
                    {isConfirmingStoreOrder
                      ? selectedStoreDetailItem?.category === 'talim'
                        ? 'Imtiyozni tasdiqlaş'
                        : selectedStoreDetailItem?.category === 'hamkorlar'
                          ? 'Kuponni tasdiqlaş'
                          : 'Buyurtmani tasdiqlaş'
                      : selectedStoreDetailItem
                        ? selectedStoreDetailItem.category === 'maxsus'
                          ? 'Maxsus sovğalar'
                          : selectedStoreDetailItem.category === 'hamkorlar'
                            ? 'Coin Shop'
                            : 'Ta’lim imtiyozlari'
                        : isViewingMyPurchases
                          ? 'Mening mahsulotlarim'
                          : storeActiveCategory
                            ? storeActiveCategory
                            : 'Maktab dökoni'}
                  </Text>
                </View>
              ) : isViewingCategoryResult ? (
                <View style={styles.catTestHeaderTitleRow}>
                  {activeCategoryTest?.iconFamily === 'FontAwesome5' ? (
                    <FontAwesome5
                      name={activeCategoryTest.iconName as any}
                      size={20}
                      color="#0F172A"
                      style={{ marginRight: 8 }}
                    />
                  ) : (
                    <Ionicons
                      name={(activeCategoryTest?.iconName as any) || 'people-outline'}
                      size={22}
                      color="#0F172A"
                      style={{ marginRight: 8 }}
                    />
                  )}
                  <View style={{ marginLeft: 2 }}>
                    <Text style={styles.catTestHeaderTitle} numberOfLines={1}>
                      {activeCategoryTest?.title ? `${activeCategoryTest.title} testi` : 'Oila va meros testi'}
                    </Text>
                    <Text style={{ fontSize: 11.5, color: '#64748B', fontWeight: '500' }}>
                      Test natijasi
                    </Text>
                  </View>
                </View>
              ) : isTakingCategoryTest ? (
                <View style={styles.catTestHeaderTitleRow}>
                  {activeCategoryTest?.iconFamily === 'FontAwesome5' ? (
                    <FontAwesome5
                      name={activeCategoryTest.iconName as any}
                      size={20}
                      color="#0F172A"
                      style={{ marginRight: 8 }}
                    />
                  ) : (
                    <Ionicons
                      name={(activeCategoryTest?.iconName as any) || 'people-outline'}
                      size={22}
                      color="#0F172A"
                      style={{ marginRight: 8 }}
                    />
                  )}
                  <Text style={styles.catTestHeaderTitle} numberOfLines={1}>
                    {activeCategoryTest?.title ? `${activeCategoryTest.title} testi` : 'Oila va meros testi'}
                  </Text>
                </View>
              ) : isViewingTestCategories ? (
                <View style={styles.titleBadgeRow}>
                  <Image
                    source={schoolCapIcon}
                    style={styles.headerCapIcon}
                    resizeMode="contain"
                  />
                  <Text style={styles.headerMainTitle}>
                    <Text style={styles.headerTitleDark}>Huquq </Text>
                    <Text style={styles.headerTitleOrange}>maktabi</Text>
                  </Text>
                </View>
              ) : isViewingCertificate ? (
                <View style={styles.videoHeaderTitleRow}>
                  <Text style={styles.headerCertificateTitle}>Sertifikat</Text>
                </View>
              ) : isViewingCourseCompleted ? (
                <View style={styles.videoHeaderTitleRow}>
                  <Image
                    source={scaleLogoImage}
                    style={styles.headerScaleIconSmall}
                    resizeMode="contain"
                  />
                  <Text style={styles.headerCompletedTitle}>Huquq maktabi</Text>
                </View>
              ) : selectedReviewQuestionIndex !== null ? (
                <View style={styles.videoHeaderTitleRow}>
                  <Image
                    source={scaleLogoImage}
                    style={styles.headerScaleIconSmall}
                    resizeMode="contain"
                  />
                  <View style={styles.videoHeaderTitlesCol}>
                    <Text style={styles.videoHeaderMainTitle}>Savol tahlili</Text>
                    <Text style={styles.videoHeaderSubTitle} numberOfLines={1}>
                      {selectedReviewQuestionIndex + 1} / {FINAL_TEST_QUESTIONS.length}
                    </Text>
                  </View>
                </View>
              ) : isViewingReviewList ? (
                <View style={styles.videoHeaderTitleRow}>
                  <Image
                    source={scaleLogoImage}
                    style={styles.headerScaleIconSmall}
                    resizeMode="contain"
                  />
                  <View style={styles.videoHeaderTitlesCol}>
                    <Text style={styles.videoHeaderMainTitle}>
                      {selectedCourseDetail?.title || 'Nikoh va oila munosabatlari'}
                    </Text>
                    <Text style={styles.videoHeaderSubTitle} numberOfLines={1}>
                      Kurs javoblari tahlili
                    </Text>
                  </View>
                </View>
              ) : isViewingTestResult || isTakingCourseFinalTest ? (
                <View style={styles.videoHeaderTitleRow}>
                  <Image
                    source={scaleLogoImage}
                    style={styles.headerScaleIconSmall}
                    resizeMode="contain"
                  />
                  <View style={styles.videoHeaderTitlesCol}>
                    <Text style={styles.videoHeaderMainTitle}>
                      {selectedCourseDetail?.title || 'Nikoh va oila munosabatlari'}
                    </Text>
                    <Text style={styles.videoHeaderSubTitle} numberOfLines={1}>
                      Kurs yakuniy testi
                    </Text>
                  </View>
                </View>
              ) : selectedLessonVideo ? (
                <View style={styles.videoHeaderTitleRow}>
                  <Image
                    source={scaleLogoImage}
                    style={styles.headerScaleIconSmall}
                    resizeMode="contain"
                  />
                  <View style={styles.videoHeaderTitlesCol}>
                    <Text style={styles.videoHeaderMainTitle}>
                      {selectedTopicDetail?.title.replace('\n', ' ') || 'Oila huquqi'}
                    </Text>
                    <Text style={styles.videoHeaderSubTitle} numberOfLines={1}>
                      {selectedCourseDetail?.title || 'Nikoh va oila munosabatlari'}
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={styles.titleBadgeRow}>
                  <Image
                    source={schoolCapIcon}
                    style={styles.headerCapIcon}
                    resizeMode="contain"
                  />
                  <Text style={styles.headerMainTitle}>
                    <Text style={styles.headerTitleDark}>Huquq </Text>
                    <Text style={styles.headerTitleOrange}>maktabi</Text>
                  </Text>
                </View>
              )}
            </View>

            {/* Right Action Icons */}
            <View style={styles.headerRightGroup}>
              {isViewingSchoolProfile ? (
                <TouchableOpacity
                  style={styles.headerIconBtn}
                  activeOpacity={0.7}
                  onPress={() =>
                    Alert.alert(
                      'Profil sozlamalari',
                      'Profil ma’lumotlarini tahrirlaş yoki yangilaş imkoniyati.'
                    )
                  }
                >
                  <Ionicons name="create-outline" size={19} color="#0F172A" />
                </TouchableOpacity>
              ) : isViewingSchoolStore ? (
                <View style={styles.storeHeaderRightActions}>
                  {/* Mening mahsulotlarim button */}
                  <TouchableOpacity
                    style={[
                      styles.storeMyPurchasesHeaderBtn,
                      isViewingMyPurchases && styles.storeMyPurchasesHeaderBtnActive,
                    ]}
                    activeOpacity={0.75}
                    onPress={() => {
                      if (isViewingMyPurchases) {
                        setIsViewingMyPurchases(false);
                      } else {
                        setSelectedStoreDetailItem(null);
                        setIsConfirmingStoreOrder(false);
                        setIsViewingMyPurchases(true);
                      }
                    }}
                  >
                    <Ionicons
                      name={isViewingMyPurchases ? 'bag-check' : 'bag-check-outline'}
                      size={18}
                      color={isViewingMyPurchases ? '#FFFFFF' : '#7C3AED'}
                    />
                    {purchasedStoreItems.length > 0 && (
                      <View style={styles.storeMyPurchasesBadge}>
                        <Text style={styles.storeMyPurchasesBadgeText}>
                          {purchasedStoreItems.length}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>

                  {/* Coin Counter Pill */}
                  <View style={styles.storeCoinHeaderPill}>
                    <FontAwesome5 name="coins" size={13} color="#D97706" style={{ marginRight: 5 }} />
                    <Text style={styles.storeCoinHeaderText}>
                      {userCoinsBalance.toLocaleString()}
                    </Text>
                  </View>
                </View>
              ) : isViewingCategoryResult || isTakingCategoryTest ? (
                <View style={{ width: 36 }} />
              ) : isTestTabRoot ? (
                <TouchableOpacity
                  style={styles.headerIconBtn}
                  activeOpacity={0.7}
                  onPress={() => setIsViewingSchoolProfile(true)}
                >
                  <Ionicons name="person-outline" size={19} color="#0F172A" />
                </TouchableOpacity>
              ) : isViewingTestCategories ? (
                <View style={{ width: 36 }} />
              ) : isViewingCertificate ? (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TouchableOpacity
                    style={styles.headerIconBtnSmall}
                    activeOpacity={0.7}
                    onPress={() =>
                      Alert.alert(
                        'PDF yuklab oliş',
                        `“${userDisplayName} - Nikoh va oila munosabatlari.pdf” sertifikati muvaffaqiyatli yuklab olindi va qurilmangizga saqlandi.`
                      )
                    }
                  >
                    <Ionicons name="download-outline" size={20} color="#0F172A" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.headerIconBtnSmall, { marginLeft: 6 }]}
                    activeOpacity={0.7}
                    onPress={() =>
                      Alert.alert(
                        'Sertifikatni ulaşiş',
                        'Sertifikat havola manzili nusxalandi! Telegram, WhatsApp yoki boşqa ilovalar orqali yuborişingiz mumkin.'
                      )
                    }
                  >
                    <Ionicons name="share-social-outline" size={20} color="#0F172A" />
                  </TouchableOpacity>
                </View>
              ) : isViewingCourseCompleted ? (
                <TouchableOpacity
                  style={styles.headerIconBtnSmall}
                  activeOpacity={0.7}
                  onPress={() =>
                    Alert.alert(
                      'Kurs yakunlandi',
                      'Siz “Nikoh va oila munosabatlari” kursini muvaffaqiyatli yakunladingiz. Barça natijalaringiz hisobingizga biriktirildi.'
                    )
                  }
                >
                  <Ionicons name="ellipsis-horizontal" size={17} color="#0F172A" />
                </TouchableOpacity>
              ) : selectedReviewQuestionIndex !== null || isViewingReviewList ? (
                <View style={{ width: 36 }} />
              ) : isViewingTestResult || isTakingCourseFinalTest ? (
                <TouchableOpacity
                  style={styles.headerIconBtnSmall}
                  activeOpacity={0.7}
                  onPress={() =>
                    Alert.alert(
                      'Kurs yakuniy testi',
                      '20 ta savol, 30 daqiqa vaqt. 80% yoki undan yuqori natija körsatgan foydalanuvçilar maxsus sertifikat va +400 XP ball bilan taqdirlanadi.'
                    )
                  }
                >
                  <Ionicons name="ellipsis-horizontal" size={17} color="#0F172A" />
                </TouchableOpacity>
              ) : selectedLessonVideo ? (
                <>
                  {/* Bookmark */}
                  <TouchableOpacity
                    style={styles.headerIconBtnSmall}
                    activeOpacity={0.7}
                    onPress={() => {
                      setIsLessonBookmarked(!isLessonBookmarked);
                      Alert.alert(!isLessonBookmarked ? 'Xatçöpga saqlandi' : 'Xatçöplardan olindi');
                    }}
                  >
                    <Ionicons
                      name={isLessonBookmarked ? 'bookmark' : 'bookmark-outline'}
                      size={17}
                      color={isLessonBookmarked ? '#0284C7' : '#0F172A'}
                    />
                  </TouchableOpacity>

                  {/* Download */}
                  <TouchableOpacity
                    style={styles.headerIconBtnSmall}
                    activeOpacity={0.7}
                    onPress={() => {
                      setIsLessonDownloaded(!isLessonDownloaded);
                      Alert.alert(
                        !isLessonDownloaded ? 'Dars yuklab olindi' : 'Oflayn dars öçirildi',
                        !isLessonDownloaded
                          ? 'Video dars oflayn köriş uçun xotiraga saqlandi (108 MB).'
                          : 'Video dars oflayn xotiradan öçirildi.'
                      );
                    }}
                  >
                    <Ionicons
                      name={isLessonDownloaded ? 'checkmark-circle' : 'download-outline'}
                      size={17}
                      color={isLessonDownloaded ? '#10B981' : '#0F172A'}
                    />
                  </TouchableOpacity>

                  {/* Ellipsis */}
                  <TouchableOpacity
                    style={styles.headerIconBtnSmall}
                    activeOpacity={0.7}
                    onPress={() => Alert.alert('Qöşimça', 'Dars sifatini tanlaş (1080p, 720p), tezlik va subtitrlar.')}
                  >
                    <Ionicons name="ellipsis-horizontal" size={17} color="#0F172A" />
                  </TouchableOpacity>
                </>
              ) : selectedCourseDetail ? (
                <>
                  <TouchableOpacity
                    style={styles.headerIconBtn}
                    activeOpacity={0.7}
                    onPress={() => {
                      setIsCourseBookmarked(!isCourseBookmarked);
                      Alert.alert(
                        !isCourseBookmarked ? 'Xatçöpga saqlandi' : 'Xatçöplardan olindi',
                        !isCourseBookmarked
                          ? 'Kurs muvaffaqiyatli xatçöplaringizga qöşildi.'
                          : 'Kurs xatçöplardan çiqarildi.'
                      );
                    }}
                  >
                    <Ionicons
                      name={isCourseBookmarked ? 'bookmark' : 'bookmark-outline'}
                      size={19}
                      color={isCourseBookmarked ? '#0284C7' : '#0F172A'}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.headerIconBtn}
                    activeOpacity={0.7}
                    onPress={() => Alert.alert('Qöşimça', 'Kursni ulaşiş, ma’lumotlarni köriş yoki saqlaş.')}
                  >
                    <Ionicons name="ellipsis-horizontal" size={19} color="#0F172A" />
                  </TouchableOpacity>
                </>
              ) : activeTab === 'results' ? (
                <View style={{ width: 36 }} />
              ) : selectedTopicDetail ? (
                <TouchableOpacity
                  style={styles.headerIconBtn}
                  activeOpacity={0.7}
                  onPress={() => Alert.alert('Qöşimça', 'Kursni ulaşiş, ma’lumotlarni köriş yoki xatçöplarga saqlaş.')}
                >
                  <Ionicons name="ellipsis-horizontal" size={19} color="#0F172A" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.headerIconBtn}
                  activeOpacity={0.7}
                  onPress={() => setIsViewingSchoolProfile(true)}
                >
                  <Ionicons name="person-outline" size={19} color="#0F172A" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        );
      })()}

      {/* ===================== BODY CONTENT ===================== */}
      {isViewingSchoolProfile ? (
        /* ===================== SHAXSIY PROFIL SAHIFASI ===================== */
        <ScrollView
          style={styles.schoolProfileScrollArea}
          contentContainerStyle={[
            styles.schoolProfileContentContainer,
            { paddingBottom: Math.max(insets.bottom, 16) + 75 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* 1. User Identity Hero Card */}
          <View style={styles.profileHeroCard}>
            <View style={styles.profileHeroTopRow}>
              {/* Avatar with Gold Star Badge */}
              <View style={styles.profileAvatarContainer}>
                {activeUser?.avatar ? (
                  <Image
                    source={{ uri: activeUser.avatar }}
                    style={styles.profileAvatarCircle}
                    resizeMode="cover"
                  />
                ) : (
                  <LinearGradient
                    colors={['#0284C7', '#0369A1']}
                    style={styles.profileAvatarCircle}
                  >
                    <Text style={styles.profileAvatarLetter}>{userInitial}</Text>
                  </LinearGradient>
                )}
                <View style={styles.profileAvatarBadge}>
                  <Ionicons name="star" size={11} color="#FFFFFF" />
                </View>
              </View>

              {/* User Name & Details */}
              <View style={styles.profileHeroDetailsCol}>
                <View style={styles.profileNameRow}>
                  <Text style={styles.profileUserName}>{userDisplayName}</Text>
                  <Ionicons name="checkmark-circle" size={16} color="#0284C7" style={{ marginLeft: 4 }} />
                </View>
                <Text style={styles.profileUserPhone}>{userPhoneOrEmail}</Text>
                <View style={styles.profileIdRow}>
                  <View style={styles.profileIdPill}>
                    <Text style={styles.profileIdPillText}>{userDisplayId}</Text>
                  </View>
                  <View style={[styles.profileIdPill, { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' }]}>
                    <Ionicons name="ribbon" size={11} color="#B45309" style={{ marginRight: 3 }} />
                    <Text style={[styles.profileIdPillText, { color: '#B45309' }]}>4-daraja</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Level XP Progress Bar */}
            <View style={styles.profileLevelProgressSection}>
              <View style={styles.profileLevelLabelRow}>
                <Text style={styles.profileLevelCurrentLabel}>4-daraja • {userRoleTitle}</Text>
                <Text style={styles.profileLevelTargetLabel}>2 450 / 3 000 XP</Text>
              </View>
              <View style={styles.profileLevelTrack}>
                <LinearGradient
                  colors={['#0284C7', '#38BDF8']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.profileLevelFill, { width: '81%' }]}
                />
              </View>
              <Text style={styles.profileLevelHint}>
                Keyingi daraja (“Huquqşunos”)ga erişiş uçun yana 550 XP kerak.
              </Text>
            </View>
          </View>

          {/* 2. Core Stats 6-Grid Cards */}
          <View style={styles.profileSectionTitleRow}>
            <Text style={styles.profileSectionTitle}>Mening körsatkiçlarim</Text>
          </View>
          <View style={styles.profileStatsGrid}>
            {/* Stat 1: Reyting */}
            <TouchableOpacity
              style={styles.profileStatCard}
              activeOpacity={0.8}
              onPress={() => {
                setIsViewingSchoolProfile(false);
                setActiveTab('results');
                setResultsSubTab('ranking');
              }}
            >
              <View style={[styles.profileStatIconBox, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="trophy" size={18} color="#D97706" />
              </View>
              <Text style={styles.profileStatValue}>24-örin</Text>
              <Text style={styles.profileStatLabel}>Umumiy reyting</Text>
            </TouchableOpacity>

            {/* Stat 2: Jami XP */}
            <View style={styles.profileStatCard}>
              <View style={[styles.profileStatIconBox, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="flash" size={18} color="#0284C7" />
              </View>
              <Text style={styles.profileStatValue}>2 450</Text>
              <Text style={styles.profileStatLabel}>Jami töplangan XP</Text>
            </View>

            {/* Stat 3: Coins */}
            <TouchableOpacity
              style={styles.profileStatCard}
              activeOpacity={0.8}
              onPress={() => {
                setIsViewingSchoolProfile(false);
                setIsViewingSchoolStore(true);
              }}
            >
              <View style={[styles.profileStatIconBox, { backgroundColor: '#FEF9C3' }]}>
                <FontAwesome5 name="coins" size={16} color="#B45309" />
              </View>
              <Text style={styles.profileStatValue}>580 Coin</Text>
              <Text style={styles.profileStatLabel}>Dökon balansi</Text>
            </TouchableOpacity>

            {/* Stat 4: Streak */}
            <View style={styles.profileStatCard}>
              <View style={[styles.profileStatIconBox, { backgroundColor: '#FFF7ED' }]}>
                <Ionicons name="flame" size={18} color="#EA580C" />
              </View>
              <Text style={styles.profileStatValue}>7 kun</Text>
              <Text style={styles.profileStatLabel}>Uzluksiz seriya</Text>
            </View>

            {/* Stat 5: Kurslar */}
            <View style={styles.profileStatCard}>
              <View style={[styles.profileStatIconBox, { backgroundColor: '#ECFDF5' }]}>
                <Ionicons name="school" size={18} color="#059669" />
              </View>
              <Text style={styles.profileStatValue}>3 ta kurs</Text>
              <Text style={styles.profileStatLabel}>Tugallangan</Text>
            </View>

            {/* Stat 6: Sertifikatlar */}
            <TouchableOpacity
              style={styles.profileStatCard}
              activeOpacity={0.8}
              onPress={() => {
                setIsViewingSchoolProfile(false);
                setIsViewingCertificate(true);
              }}
            >
              <View style={[styles.profileStatIconBox, { backgroundColor: '#FAF5FF' }]}>
                <Ionicons name="document-text" size={18} color="#7C3AED" />
              </View>
              <Text style={styles.profileStatValue}>2 ta</Text>
              <Text style={styles.profileStatLabel}>Rasmiy sertifikat</Text>
            </TouchableOpacity>
          </View>

          {/* 3. Sertifikatlarim Section */}
          <View style={styles.profileSectionTitleRow}>
            <Text style={styles.profileSectionTitle}>Mening sertifikatlarim (2 ta)</Text>
          </View>
          <View style={styles.profileCertsContainer}>
            {/* Cert 1 */}
            <View style={styles.profileCertCard}>
              <View style={styles.profileCertIconWrap}>
                <Ionicons name="ribbon" size={24} color="#D97706" />
              </View>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={styles.profileCertTitle}>Nikoh va oila munosabatlari</Text>
                <Text style={styles.profileCertMeta}>Oila huquqi • Natija: 85% • 2024-yil</Text>
              </View>
              <View style={styles.profileCertActionsRow}>
                <TouchableOpacity
                  style={styles.profileCertActionBtn}
                  activeOpacity={0.7}
                  onPress={() => {
                    setIsViewingSchoolProfile(false);
                    setIsViewingCertificate(true);
                  }}
                >
                  <Ionicons name="eye-outline" size={18} color="#7C3AED" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.profileCertActionBtn}
                  activeOpacity={0.7}
                  onPress={() =>
                    Alert.alert(
                      'Sertifikat yuklandi 📄',
                      '“Nikoh va oila munosabatlari.pdf” sertifikatingiz xotiraga yuklab olindi.'
                    )
                  }
                >
                  <Ionicons name="download-outline" size={18} color="#0284C7" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Cert 2 */}
            <View style={styles.profileCertCard}>
              <View style={[styles.profileCertIconWrap, { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }]}>
                <Ionicons name="medal" size={24} color="#0284C7" />
              </View>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={styles.profileCertTitle}>Fuqarolik huquqi asoslari</Text>
                <Text style={styles.profileCertMeta}>Fuqarolik huquqi • Natija: 92% • 2024-yil</Text>
              </View>
              <View style={styles.profileCertActionsRow}>
                <TouchableOpacity
                  style={styles.profileCertActionBtn}
                  activeOpacity={0.7}
                  onPress={() =>
                    Alert.alert(
                      'Sertifikatni köriş 📄',
                      '“Fuqarolik huquqi asoslari” sertifikati köriş uçun oçilmoqda...'
                    )
                  }
                >
                  <Ionicons name="eye-outline" size={18} color="#7C3AED" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.profileCertActionBtn}
                  activeOpacity={0.7}
                  onPress={() =>
                    Alert.alert(
                      'Sertifikat yuklandi 📄',
                      '“Fuqarolik huquqi asoslari.pdf” sertifikatingiz xotiraga yuklab olindi.'
                    )
                  }
                >
                  <Ionicons name="download-outline" size={18} color="#0284C7" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* 4. Sozlamalar va Xizmatlar */}
          <View style={styles.profileSectionTitleRow}>
            <Text style={styles.profileSectionTitle}>Sozlamalar va xizmatlar</Text>
          </View>
          <View style={styles.profileMenuCard}>
            {/* Mening xaridlarim */}
            <TouchableOpacity
              style={styles.profileMenuItem}
              activeOpacity={0.7}
              onPress={() => {
                setIsViewingSchoolProfile(false);
                setIsViewingSchoolStore(true);
                setIsViewingMyPurchases(true);
              }}
            >
              <View style={[styles.profileMenuIconBox, { backgroundColor: '#FAF5FF' }]}>
                <Ionicons name="bag-check" size={18} color="#7C3AED" />
              </View>
              <Text style={styles.profileMenuLabel}>Mening xaridlarim (Dökon)</Text>
              <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
            </TouchableOpacity>

            <View style={styles.profileMenuDivider} />

            {/* Dastur haqida */}
            <TouchableOpacity
              style={styles.profileMenuItem}
              activeOpacity={0.7}
              onPress={() =>
                Alert.alert(
                  'Huquq maktabi haqida',
                  'Huquq maktabi — yuridik savodxonlikni oşiriş, amaliy qonunçilik darslari va test simulyatsiyalari uçun maxsus mini platforma.\n\nVersiya: 1.4.0 (2024)'
                )
              }
            >
              <View style={[styles.profileMenuIconBox, { backgroundColor: '#F1F5F9' }]}>
                <Ionicons name="information-circle" size={18} color="#475569" />
              </View>
              <Text style={styles.profileMenuLabel}>Huquq maktabi haqida</Text>
              <Text style={{ fontSize: 12, color: '#94A3B8', marginRight: 6 }}>v1.4.0</Text>
              <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : isViewingCategoryResult ? (
        /* ===================== BO'LIM TESTI NATIJA SAHIFASI (1:1 DESIGN) ===================== */
        <View style={styles.resultScreenContainer}>
          <ScrollView
            style={styles.resultScrollArea}
            contentContainerStyle={[
              styles.resultContentContainer,
              { paddingBottom: Math.max(insets.bottom, 16) + 40 },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {/* 1. Hero Banner Card */}
            <View style={styles.resultBannerCard}>
              <View style={styles.resultBannerTextCol}>
                <View style={styles.resultStatusPill}>
                  <Ionicons name="checkmark-circle" size={13} color="#FFFFFF" style={{ marginRight: 4 }} />
                  <Text style={styles.resultStatusPillText}>Test yakunlandi</Text>
                </View>

                <Text style={styles.resultBannerTitle}>
                  {categoryResultStats.percentage >= 70 ? 'Tabriklaymiz!' : 'Yaxşi uriniş!'}
                </Text>

                <Text style={styles.resultBannerSubtitle}>
                  {categoryResultStats.percentage >= 70
                    ? `Siz “${activeCategoryTest?.title || 'Oila va meros'}” testini muvaffaqiyatli topshirdingiz.`
                    : `Siz “${activeCategoryTest?.title || 'Oila va meros'}” testini yakunladingiz. Yana urinib ko‘ring.`}
                </Text>
              </View>

              {/* 3D Golden Medal */}
              <Image
                source={resultGoldMedalImage}
                style={styles.resultMedalImg}
                resizeMode="contain"
              />
            </View>

            {/* 2. Metrics 4-Column Card */}
            <View style={styles.resultMetricsCard}>
              {/* Col 1: Progress Ring */}
              <View style={styles.metricRingCol}>
                <View
                  style={[
                    styles.metricRingWrapper,
                    categoryResultStats.percentage < 70 && {
                      borderColor: '#F59E0B',
                      borderTopColor: '#F59E0B',
                      borderRightColor: '#F59E0B',
                    },
                  ]}
                >
                  <Text style={styles.metricPercentageText}>
                    {categoryResultStats.percentage}%
                  </Text>
                </View>
              </View>

              {/* Col 2: To'g'ri javob */}
              <View style={styles.metricItemCol}>
                <Text style={styles.metricPrimaryValue}>
                  {categoryResultStats.correct} / {CATEGORY_TEST_QUESTIONS.length}
                </Text>
                <Text style={styles.metricLabelText}>Töğri javob</Text>
              </View>

              {/* Col 3: Sarflangan vaqt */}
              <View style={styles.metricItemCol}>
                <View style={styles.metricIconRow}>
                  <Ionicons name="time-outline" size={13.5} color="#0F172A" style={{ marginRight: 3 }} />
                  <Text style={styles.metricPrimaryValueSmall}>
                    {categoryResultStats.timeSpent}
                  </Text>
                </View>
                <Text style={styles.metricLabelText}>Sarflangan vaqt</Text>
              </View>

              {/* Col 4: O'tish sharti */}
              <View style={styles.metricItemCol}>
                <View style={styles.metricIconRow}>
                  <Ionicons name="trophy-outline" size={13.5} color="#D97706" style={{ marginRight: 3 }} />
                  <Text style={styles.metricPrimaryValueSmall}>≥ 70%</Text>
                </View>
                <Text style={styles.metricLabelText}>Ötiş şarti</Text>
              </View>
            </View>

            {/* 3. Detailed Breakdown Card */}
            <View style={styles.resultBreakdownCard}>
              <View style={styles.breakdownHeaderRow}>
                <Ionicons name="bar-chart-outline" size={17} color="#0F172A" style={{ marginRight: 8 }} />
                <Text style={styles.breakdownHeaderTitle}>Test natijasi</Text>
              </View>

              {/* Row 1: To'g'ri javoblar */}
              <View style={styles.breakdownRow}>
                <View style={styles.breakdownRowLeft}>
                  <Ionicons name="checkmark-circle" size={18} color="#10B981" style={{ marginRight: 8 }} />
                  <Text style={styles.breakdownRowText}>Töğri javoblar</Text>
                </View>
                <Text style={styles.breakdownCorrectCountText}>
                  {categoryResultStats.correct} ta
                </Text>
              </View>

              <View style={styles.breakdownDivider} />

              {/* Row 2: Noto'g'ri javoblar */}
              <View style={styles.breakdownRow}>
                <View style={styles.breakdownRowLeft}>
                  <Ionicons name="close-circle" size={18} color="#EF4444" style={{ marginRight: 8 }} />
                  <Text style={styles.breakdownRowText}>Notöğri javoblar</Text>
                </View>
                <Text style={styles.breakdownWrongCountText}>
                  {categoryResultStats.incorrect} ta
                </Text>
              </View>

              <View style={styles.breakdownDivider} />

              {/* Row 3: Javob berilmagan */}
              <View style={styles.breakdownRow}>
                <View style={styles.breakdownRowLeft}>
                  <Ionicons name="remove-circle" size={18} color="#94A3B8" style={{ marginRight: 8 }} />
                  <Text style={styles.breakdownRowText}>Javob berilmagan</Text>
                </View>
                <Text style={styles.breakdownUnansweredCountText}>
                  {categoryResultStats.unanswered} ta
                </Text>
              </View>
            </View>

            {/* 4. Mukofot Card */}
            <View style={styles.rewardCard}>
              <View style={styles.rewardLeftGroup}>
                <Ionicons name="gift-outline" size={21} color="#D97706" style={{ marginRight: 8 }} />
                <Text style={styles.rewardTitleText}>Sizga berilgan mukofot</Text>
              </View>

              <View style={styles.rewardPillsGroup}>
                <View style={styles.rewardPill}>
                  <Ionicons name="flash" size={12} color="#D97706" style={{ marginRight: 3 }} />
                  <Text style={styles.rewardPillText}>+{categoryResultStats.xpAwarded} XP</Text>
                </View>

                <View style={styles.rewardPill}>
                  <Ionicons name="server" size={12} color="#D97706" style={{ marginRight: 3 }} />
                  <Text style={styles.rewardPillText}>+{categoryResultStats.coinsAwarded} Coin</Text>
                </View>
              </View>
            </View>

            {/* 5. Keyingi qadam Buttons */}
            <View style={styles.nextStepsSection}>
              <View style={styles.nextStepsHeaderRow}>
                <Ionicons name="layers-outline" size={17} color="#0F172A" style={{ marginRight: 8 }} />
                <Text style={styles.nextStepsHeaderTitle}>Keyingi qadam</Text>
              </View>

              {/* Action 1: Bo'limlarga qaytish */}
              <TouchableOpacity
                style={styles.completeCourseActionBtn}
                activeOpacity={0.8}
                onPress={() => {
                  setIsViewingCategoryResult(false);
                  setIsViewingTestCategories(true);
                }}
              >
                <Ionicons name="list-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.completeCourseActionText}>Bölimlar röyxatiga qaytiş</Text>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
              </TouchableOpacity>

              {/* Action 2: Qayta topshirish */}
              <TouchableOpacity
                style={[styles.reviewAnswersActionBtn, { marginTop: 10 }]}
                activeOpacity={0.8}
                onPress={() => {
                  setCategoryTestQuestionIndex(0);
                  setCategoryTestAnswers({});
                  setCategoryTimerSeconds(720);
                  setIsViewingCategoryResult(false);
                  setIsTakingCategoryTest(true);
                }}
              >
                <Ionicons name="refresh-outline" size={18} color="#0F172A" style={{ marginRight: 8 }} />
                <Text style={styles.reviewAnswersActionText}>Testni qayta topşiriş</Text>
                <Ionicons name="arrow-forward" size={16} color="#0F172A" style={{ marginLeft: 6 }} />
              </TouchableOpacity>

              {/* Action 3: Bosh sahifaga qaytish */}
              <TouchableOpacity
                style={[styles.reviewAnswersActionBtn, { marginTop: 10 }]}
                activeOpacity={0.8}
                onPress={() => {
                  setIsViewingCategoryResult(false);
                  setIsViewingTestCategories(false);
                  setActiveTab('home');
                }}
              >
                <Ionicons name="home-outline" size={18} color="#0F172A" style={{ marginRight: 8 }} />
                <Text style={styles.reviewAnswersActionText}>Boş sahifaga qaytiş</Text>
                <Ionicons name="arrow-forward" size={16} color="#0F172A" style={{ marginLeft: 6 }} />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      ) : isTakingCategoryTest ? (
        (() => {
          const isCurrentQuestionAnswered = categoryTestAnswers[categoryTestQuestionIndex] !== undefined;

          const handleNextOrFinishCategoryTest = () => {
            if (!isCurrentQuestionAnswered) return;

            if (categoryTestQuestionIndex < CATEGORY_TEST_QUESTIONS.length - 1) {
              setCategoryTestQuestionIndex((prev) => prev + 1);
            } else {
              // Calculate score & finish!
              let correctCount = 0;
              let incorrectCount = 0;
              let unansweredCount = 0;

              CATEGORY_TEST_QUESTIONS.forEach((q, idx) => {
                const userChoice = categoryTestAnswers[idx];
                if (userChoice === undefined) {
                  unansweredCount++;
                } else if (userChoice === q.correctIndex) {
                  correctCount++;
                } else {
                  incorrectCount++;
                }
              });

              const percentage = Math.round((correctCount / CATEGORY_TEST_QUESTIONS.length) * 100);
              const timeSpentSecs = Math.max(30, 720 - categoryTimerSeconds);
              const mins = Math.floor(timeSpentSecs / 60);
              const secs = timeSpentSecs % 60;
              const timeSpent = `${mins > 0 ? `${mins} daqiqa ` : ''}${secs} soniya`;

              setCategoryResultStats({
                correct: correctCount,
                incorrect: incorrectCount,
                unanswered: unansweredCount,
                percentage,
                timeSpent,
                xpAwarded: activeCategoryTest?.xpAward || 40,
                coinsAwarded: 15,
              });

              setIsTakingCategoryTest(false);
              setIsViewingCategoryResult(true);
            }
          };

          return (
            /* ===================== BO'LIM TESTI ISHLASH SAHIFASI (1:1 DESIGN - media_1794316514481_dac518e9.jpg) ===================== */
            <View style={styles.catTestScreenContainer}>
              <ScrollView
                style={styles.catTestScrollArea}
                contentContainerStyle={[
                  styles.catTestContentContainer,
                  { paddingBottom: 24 },
                ]}
                showsVerticalScrollIndicator={false}
              >
                {/* 1. Top Stats Pill Card */}
                <View style={styles.catTestStatsCard}>
                  <View style={styles.catTestXpBadge}>
                    <Ionicons name="flash" size={13} color="#D97706" style={{ marginRight: 3 }} />
                    <Text style={styles.catTestXpText}>+{activeCategoryTest?.xpAward || 40} XP</Text>
                  </View>

                  <View style={styles.catTestStatsDivider} />

                  <View style={styles.catTestStatItem}>
                    <Ionicons name="help-circle-outline" size={16} color="#0F172A" style={{ marginRight: 5 }} />
                    <Text style={styles.catTestStatText}>{CATEGORY_TEST_QUESTIONS.length} savol</Text>
                  </View>

                  <View style={styles.catTestStatsDivider} />

                  <View style={styles.catTestStatItem}>
                    <Ionicons name="time-outline" size={16} color="#0F172A" style={{ marginRight: 5 }} />
                    <Text style={styles.catTestStatText}>{activeCategoryTest?.durationMinutes || 12} daqiqa</Text>
                  </View>
                </View>

                {/* 2. Progress Bar & Question Counter */}
                <View style={styles.catTestProgressRow}>
                  <View style={styles.catTestProgressTrack}>
                    <View
                      style={[
                        styles.catTestProgressFill,
                        {
                          width: `${((categoryTestQuestionIndex + 1) / CATEGORY_TEST_QUESTIONS.length) * 100}%`,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.catTestProgressCounter}>
                    {categoryTestQuestionIndex + 1} / {CATEGORY_TEST_QUESTIONS.length}
                  </Text>
                </View>

                {/* 3. Question Card */}
                <View style={styles.catTestQuestionCard}>
                  {/* Card Header: "4-savol" + Timer */}
                  <View style={styles.catTestCardHeaderRow}>
                    <View style={styles.catTestQuestionNumPill}>
                      <Text style={styles.catTestQuestionNumText}>
                        {categoryTestQuestionIndex + 1}-savol
                      </Text>
                    </View>

                    <View style={styles.catTestTimerPill}>
                      <Ionicons name="time-outline" size={14} color="#D97706" style={{ marginRight: 4 }} />
                      <Text style={styles.catTestTimerText}>
                        {formatTimer(categoryTimerSeconds)}
                      </Text>
                    </View>
                  </View>

                  {/* Question Text */}
                  <Text style={styles.catTestQuestionTitle}>
                    {CATEGORY_TEST_QUESTIONS[categoryTestQuestionIndex]?.question}
                  </Text>

                  {/* 4 Options */}
                  <View style={styles.catTestOptionsList}>
                    {CATEGORY_TEST_QUESTIONS[categoryTestQuestionIndex]?.options.map((optText, optIdx) => {
                      const isSelected = categoryTestAnswers[categoryTestQuestionIndex] === optIdx;

                      return (
                        <TouchableOpacity
                          key={optIdx}
                          style={[
                            styles.catTestOptionItem,
                            isSelected ? styles.catTestOptionItemSelected : styles.catTestOptionItemDefault,
                          ]}
                          activeOpacity={0.8}
                          onPress={() => {
                            setCategoryTestAnswers((prev) => ({
                              ...prev,
                              [categoryTestQuestionIndex]: optIdx,
                            }));
                          }}
                        >
                          {/* Radio Circle */}
                          <View
                            style={[
                              styles.catTestRadioCircle,
                              isSelected && styles.catTestRadioCircleSelected,
                            ]}
                          >
                            {isSelected && <View style={styles.catTestRadioInnerDot} />}
                          </View>

                          {/* Option Text */}
                          <Text
                            style={[
                              styles.catTestOptionText,
                              isSelected && styles.catTestOptionTextSelected,
                            ]}
                          >
                            {optText}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* 4. Middle Action Buttons (Belgilang & Xatolik haqida) */}
                <View style={styles.catTestActionButtonsRow}>
                  <TouchableOpacity
                    style={[
                      styles.catTestSecondaryBtn,
                      categoryBookmarkedQuestions[categoryTestQuestionIndex] && styles.catTestSecondaryBtnActive,
                    ]}
                    activeOpacity={0.75}
                    onPress={() => {
                      const nextVal = !categoryBookmarkedQuestions[categoryTestQuestionIndex];
                      setCategoryBookmarkedQuestions((prev) => ({
                        ...prev,
                        [categoryTestQuestionIndex]: nextVal,
                      }));
                      Alert.alert(
                        nextVal ? 'Savol belgilandi' : 'Belgilaş bekor qilindi',
                        nextVal
                          ? `${categoryTestQuestionIndex + 1}-savol qayta ko‘rib chiqish uchun belgilandi.`
                          : 'Savol belgilanmaganlar röyxatiga qaytarildi.'
                      );
                    }}
                  >
                    <Ionicons
                      name={categoryBookmarkedQuestions[categoryTestQuestionIndex] ? 'bookmark' : 'bookmark-outline'}
                      size={18}
                      color={categoryBookmarkedQuestions[categoryTestQuestionIndex] ? '#D97706' : '#0F172A'}
                      style={{ marginRight: 6 }}
                    />
                    <Text
                      style={[
                        styles.catTestSecondaryBtnText,
                        categoryBookmarkedQuestions[categoryTestQuestionIndex] && { color: '#D97706', fontWeight: '700' },
                      ]}
                    >
                      Belgilang
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.catTestSecondaryBtn}
                    activeOpacity={0.75}
                    onPress={() => {
                      Alert.alert(
                        'Xatolik haqida xabar beriş',
                        `${categoryTestQuestionIndex + 1}-savol matnida yoki javob variantlarida xatolik mavjudmi? Xabaringiz moderatsiyaga yuboriladi.`,
                        [
                          { text: 'Bekor qiliş', style: 'cancel' },
                          {
                            text: 'Yuboriş',
                            onPress: () =>
                              Alert.alert('Rahmat!', 'Xabaringiz qabul qilindi va mutaxassislar tomonidan tekşiriladi.'),
                          },
                        ]
                      );
                    }}
                  >
                    <Ionicons name="warning-outline" size={18} color="#0F172A" style={{ marginRight: 6 }} />
                    <Text style={styles.catTestSecondaryBtnText}>Xatolik haqida</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>

              {/* 5. Fixed Docked Bottom Navigation Bar */}
              <View style={[styles.catTestFixedBottomBar, { paddingBottom: Math.max(insets.bottom, 14) }]}>
                <View style={styles.catTestNavButtonsRow}>
                  {/* Oldingi */}
                  <TouchableOpacity
                    style={[
                      styles.catTestPrevBtn,
                      categoryTestQuestionIndex === 0 && styles.catTestNavBtnDisabled,
                    ]}
                    activeOpacity={0.75}
                    disabled={categoryTestQuestionIndex === 0}
                    onPress={() => {
                      if (categoryTestQuestionIndex > 0) {
                        setCategoryTestQuestionIndex((prev) => prev - 1);
                      }
                    }}
                  >
                    <Ionicons name="arrow-back" size={18} color="#0F172A" style={{ marginRight: 6 }} />
                    <Text style={styles.catTestPrevBtnText}>Oldingi</Text>
                  </TouchableOpacity>

                  {/* Keyingi / Yakunlash - YONISH SHARTI: Faqat javob belgilanganda yonadi! */}
                  <TouchableOpacity
                    style={[
                      styles.catTestNextBtn,
                      !isCurrentQuestionAnswered && styles.catTestNextBtnDisabled,
                    ]}
                    activeOpacity={0.85}
                    disabled={!isCurrentQuestionAnswered}
                    onPress={handleNextOrFinishCategoryTest}
                  >
                    <Text
                      style={[
                        styles.catTestNextBtnText,
                        !isCurrentQuestionAnswered && styles.catTestNextBtnTextDisabled,
                      ]}
                    >
                      {categoryTestQuestionIndex === CATEGORY_TEST_QUESTIONS.length - 1 ? 'Yakunlaş' : 'Keyingi'}
                    </Text>
                    <Ionicons
                      name={
                        categoryTestQuestionIndex === CATEGORY_TEST_QUESTIONS.length - 1
                          ? 'checkmark-circle'
                          : 'arrow-forward'
                      }
                      size={18}
                      color={isCurrentQuestionAnswered ? '#FFFFFF' : '#94A3B8'}
                      style={{ marginLeft: 6 }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })()
      ) : isViewingTestCategories ? (
        /* ===================== BO'LIMLAR BO'YICHA TESTLAR (1:1 DESIGN) ===================== */
        <View style={styles.categoriesScreenContainer}>
          <ScrollView
            style={styles.categoriesScrollArea}
            contentContainerStyle={[
              styles.categoriesContentContainer,
              { paddingBottom: Math.max(insets.bottom, 16) + 40 },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {/* Hero Subtitle & 3D Checklist Illustration */}
            <View style={styles.categoriesHeroRow}>
              <View style={styles.categoriesHeroTextCol}>
                <Text style={styles.categoriesHeroMainTitle}>Bölimlar böyiça testlar</Text>
                <Text style={styles.categoriesHeroSubtitle}>
                  Huquq sohalari böyiça testlarni tanlang{'\n'}va XP töplang.
                </Text>
              </View>

              <Image
                source={bolimlarChecklistImage}
                style={styles.categoriesHeroImage}
                resizeMode="contain"
              />
            </View>

            {/* List of 8 Category Cards */}
            <View style={styles.categoriesListWrap}>
              {TEST_CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.catCardItem,
                    cat.isHighlighted && styles.catCardItemHighlighted,
                  ]}
                  activeOpacity={0.78}
                  onPress={() => {
                    setSelectedTestCategoryForModal(cat);
                  }}
                >
                  {/* Left Icon Container */}
                  <View
                    style={[
                      styles.catCardIconWrap,
                      cat.isHighlighted && styles.catCardIconWrapHighlighted,
                    ]}
                  >
                    {cat.iconFamily === 'FontAwesome5' ? (
                      <FontAwesome5
                        name={cat.iconName as any}
                        size={20}
                        color={cat.isHighlighted ? '#854D0E' : '#0F172A'}
                      />
                    ) : (
                      <Ionicons
                        name={cat.iconName as any}
                        size={22}
                        color={cat.isHighlighted ? '#854D0E' : '#0F172A'}
                      />
                    )}
                  </View>

                  {/* Middle Info Column */}
                  <View style={styles.catCardMiddleCol}>
                    <Text style={styles.catCardTitleText}>{cat.title}</Text>
                    <View style={styles.catCardMetaRow}>
                      <Ionicons name="book-outline" size={13} color="#64748B" style={{ marginRight: 4 }} />
                      <Text style={styles.catCardMetaText}>{cat.questionsCount} savol</Text>
                      <Text style={styles.catCardMetaDot}>·</Text>
                      <Ionicons name="time-outline" size={13} color="#64748B" style={{ marginRight: 4 }} />
                      <Text style={styles.catCardMetaText}>{cat.durationMinutes} daqiqa</Text>
                    </View>
                  </View>

                  {/* Right XP Pill + Chevron */}
                  <View style={styles.catCardRightCol}>
                    <View style={styles.catCardXpPill}>
                      <Ionicons name="flash" size={11.5} color="#D97706" style={{ marginRight: 3 }} />
                      <Text style={styles.catCardXpText}>+{cat.xpAward} XP</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="#0F172A" style={{ marginLeft: 6 }} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      ) : isViewingCertificate ? (
        /* ===================== 3. SERTIFIKAT SCREEN (1:1 DESIGN) ===================== */
        <View style={styles.certificateScreenContainer}>
          <ScrollView
            style={styles.certificateScrollArea}
            contentContainerStyle={[
              styles.certificateContentContainer,
              { paddingBottom: Math.max(insets.bottom, 16) + 40 },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {/* Certificate Paper Card with authentic seal, borders & metadata */}
            <View style={styles.certificatePaperCard}>
              <Image
                source={certificatePaperImage}
                style={styles.certificateImage}
                resizeMode="contain"
              />
            </View>

            {/* Bottom Actions */}
            <View style={styles.certificateActionsContainer}>
              <TouchableOpacity
                style={styles.certificateDownloadBtn}
                activeOpacity={0.8}
                onPress={() => {
                  Alert.alert(
                    'PDF yuklab oliş',
                    `“${userDisplayName} - Nikoh va oila munosabatlari.pdf” sertifikati muvaffaqiyatli yuklab olindi va qurilmangizga saqlandi.`
                  );
                }}
              >
                <Ionicons name="download-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.certificateDownloadBtnText}>PDF yuklab oliş</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.certificateShareBtn}
                activeOpacity={0.75}
                onPress={() => {
                  Alert.alert(
                    'Sertifikatni ulaşiş',
                    'Sertifikat havola manzili nusxalandi! Telegram, WhatsApp yoki boşqa ilovalar orqali döstlaringiz bilan ulaşing.'
                  );
                }}
              >
                <Ionicons name="share-social-outline" size={18} color="#0F172A" style={{ marginRight: 8 }} />
                <Text style={styles.certificateShareBtnText}>Ulaşiş</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      ) : isViewingCourseCompleted ? (
        /* ===================== 2. KURS YAKUNLANDI SCREEN (1:1 DESIGN) ===================== */
        <View style={styles.courseCompleteScreenContainer}>
          {/* Subtle curved background glow */}
          <View style={styles.testGlowShape} />

          <ScrollView
            style={styles.courseCompleteScrollArea}
            contentContainerStyle={[
              styles.courseCompleteContentContainer,
              { paddingBottom: Math.max(insets.bottom, 16) + 40 },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {/* 1. Hero Navy Banner: Cap & Laurel + Congratulation text */}
            <View style={styles.courseCompleteHeroCard}>
              <Image
                source={courseCompleteCapImage}
                style={styles.courseCompleteCapImage}
                resizeMode="contain"
              />
              <Text style={styles.courseCompleteTitle}>Kurs yakunlandi!</Text>
              <Text style={styles.courseCompleteSubtitle}>
                Siz “Nikoh va oila munosabatlari” kursini muvaffaqiyatli yakunladingiz.
              </Text>
            </View>

            {/* 2. Three-column Metrics Card (100% | 4/4 dars | 20/20 test) */}
            <View style={styles.courseCompleteMetricsCard}>
              {/* Col 1: 100% Progress gauge */}
              <View style={styles.metricGaugeCol}>
                <View style={styles.gaugeCircleWrap}>
                  <Text style={styles.gaugePercentNumber}>100%</Text>
                </View>
                <Text style={styles.metricColLabel}>Kurs özlaştirildi</Text>
              </View>

              <View style={styles.metricVerticalDivider} />

              {/* Col 2: 4/4 Dars */}
              <View style={styles.metricCol}>
                <Ionicons name="layers-outline" size={24} color="#0F172A" />
                <Text style={styles.metricBigNumber}>4 / 4</Text>
                <Text style={styles.metricColLabel}>dars</Text>
              </View>

              <View style={styles.metricVerticalDivider} />

              {/* Col 3: 20/20 Test */}
              <View style={styles.metricCol}>
                <Ionicons name="trophy-outline" size={24} color="#D97706" />
                <Text style={styles.metricBigNumber}>20 / 20</Text>
                <Text style={styles.metricColLabel}>test</Text>
              </View>
            </View>

            {/* 3. "Sizga berilgan mukofot" Card */}
            <View style={styles.rewardCard}>
              <View style={styles.rewardLeftGroup}>
                <Ionicons name="gift-outline" size={21} color="#D97706" style={{ marginRight: 8 }} />
                <Text style={styles.rewardTitleText}>Sizga berilgan mukofot</Text>
              </View>

              <View style={styles.rewardPillsGroup}>
                <View style={styles.rewardPill}>
                  <Ionicons name="flash" size={12} color="#D97706" style={{ marginRight: 3 }} />
                  <Text style={styles.rewardPillText}>+1 000 XP</Text>
                </View>

                <View style={styles.rewardPill}>
                  <Ionicons name="server" size={12} color="#D97706" style={{ marginRight: 3 }} />
                  <Text style={styles.rewardPillText}>+50 Coin</Text>
                </View>
              </View>
            </View>

            {/* 4. Action Buttons */}
            <View style={styles.courseCompleteActionsContainer}>
              {/* Primary: Sertifikatni olish */}
              <TouchableOpacity
                style={styles.courseCompletePrimaryBtn}
                activeOpacity={0.8}
                onPress={() => setIsViewingCertificate(true)}
              >
                <View style={styles.actionBtnLeft}>
                  <Ionicons name="ribbon-outline" size={18} color="#FFFFFF" style={{ marginRight: 10 }} />
                  <Text style={styles.courseCompletePrimaryBtnText}>Sertifikatni oliş</Text>
                </View>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </TouchableOpacity>

              {/* Secondary: Kursni qayta o'tish */}
              <TouchableOpacity
                style={styles.courseCompleteSecondaryBtn}
                activeOpacity={0.75}
                onPress={() => {
                  Alert.alert(
                    'Kursni qayta ötiş',
                    'Test savollarini qayta yeçişni xohlaysizmi?',
                    [
                      { text: 'Bekor qiliş', style: 'cancel' },
                      {
                        text: 'Qayta topşiriş',
                        onPress: () => {
                          setIsViewingCourseCompleted(false);
                          setIsTakingCourseFinalTest(true);
                          setCurrentTestQuestionIndex(0);
                        },
                      },
                    ]
                  );
                }}
              >
                <View style={styles.actionBtnLeft}>
                  <Ionicons name="sync-outline" size={18} color="#0F172A" style={{ marginRight: 10 }} />
                  <Text style={styles.courseCompleteSecondaryBtnText}>Kursni qayta ötiş</Text>
                </View>
              </TouchableOpacity>

              {/* Tertiary: Boshqa kurs tanlash */}
              <TouchableOpacity
                style={styles.courseCompleteSecondaryBtn}
                activeOpacity={0.75}
                onPress={() => {
                  setIsViewingCourseCompleted(false);
                  setIsTakingCourseFinalTest(false);
                  setIsViewingTestResult(false);
                  setIsViewingReviewList(false);
                  setSelectedReviewQuestionIndex(null);
                  setSelectedCourseDetail(null);
                }}
              >
                <View style={styles.actionBtnLeft}>
                  <Ionicons name="book-outline" size={18} color="#0F172A" style={{ marginRight: 10 }} />
                  <Text style={styles.courseCompleteSecondaryBtnText}>Boşqa kurs tanlaş</Text>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      ) : selectedReviewQuestionIndex !== null ? (
        /* ===================== 3. SINGLE QUESTION REVIEW DETAIL (PHONE 3) ===================== */
        <View style={styles.reviewDetailScreenContainer}>
          <ScrollView
            style={styles.reviewDetailScrollArea}
            contentContainerStyle={[
              styles.reviewDetailContentContainer,
              { paddingBottom: Math.max(insets.bottom, 16) + 85 },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {/* Question Card */}
            {(() => {
              const currentQ = FINAL_TEST_QUESTIONS[selectedReviewQuestionIndex];
              const userAns = selectedTestAnswers[selectedReviewQuestionIndex];
              const isCorrect = userAns === currentQ.correctIndex;

              return (
                <View style={styles.reviewDetailQuestionCard}>
                  {/* Status Pill Badge: (✕) Noto‘g‘ri javob OR (✓) To‘g‘ri javob */}
                  <View
                    style={[
                      styles.reviewStatusPill,
                      isCorrect ? styles.reviewStatusPillCorrect : styles.reviewStatusPillWrong,
                    ]}
                  >
                    <Ionicons
                      name={isCorrect ? 'checkmark-circle' : 'close-circle'}
                      size={14}
                      color={isCorrect ? '#10B981' : '#EF4444'}
                      style={{ marginRight: 4 }}
                    />
                    <Text
                      style={[
                        styles.reviewStatusPillText,
                        isCorrect ? styles.reviewStatusTextCorrect : styles.reviewStatusTextWrong,
                      ]}
                    >
                      {isCorrect ? 'Töğri javob' : 'Notöğri javob'}
                    </Text>
                  </View>

                  {/* Question Title */}
                  <Text style={styles.reviewQuestionTitleText}>
                    {currentQ.question}
                  </Text>

                  {/* 4 Options */}
                  <View style={styles.reviewOptionsListWrap}>
                    {currentQ.options.map((optText, optIdx) => {
                      const isOptionCorrect = optIdx === currentQ.correctIndex;
                      const isOptionUserPicked = userAns === optIdx;

                      // Decide style
                      let cardStyle = styles.reviewOptionNormal;
                      let iconName: any = 'radio-button-off';
                      let iconColor = '#CBD5E1';
                      let rightIcon: any = null;

                      if (isOptionCorrect) {
                        cardStyle = styles.reviewOptionCorrect;
                        iconName = 'radio-button-on';
                        iconColor = '#10B981';
                        rightIcon = (
                          <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                        );
                      } else if (isOptionUserPicked) {
                        cardStyle = styles.reviewOptionWrong;
                        iconName = 'radio-button-on';
                        iconColor = '#EF4444';
                        rightIcon = (
                          <Ionicons name="close-circle" size={20} color="#EF4444" />
                        );
                      }

                      return (
                        <View
                          key={optIdx}
                          style={[styles.reviewOptionBase, cardStyle]}
                        >
                          <Ionicons
                            name={iconName}
                            size={20}
                            color={iconColor}
                            style={{ marginRight: 10 }}
                          />
                          <Text
                            style={[
                              styles.reviewOptionText,
                              {
                                fontWeight: isOptionCorrect || isOptionUserPicked ? '700' : '500',
                              },
                            ]}
                          >
                            {optText}
                          </Text>
                          {rightIcon}
                        </View>
                      );
                    })}
                  </View>
                </View>
              );
            })()}

            {/* "Izoh" (Explanation) Card */}
            <View style={styles.explanationCard}>
              <View style={styles.explanationHeaderRow}>
                <Ionicons name="book-outline" size={17} color="#D97706" style={{ marginRight: 6 }} />
                <Text style={styles.explanationHeaderTitle}>Izoh</Text>
              </View>

              <Text style={styles.explanationBodyText}>
                {FINAL_TEST_QUESTIONS[selectedReviewQuestionIndex]?.explanation}
              </Text>
            </View>
          </ScrollView>

          {/* Fixed Bottom Stepper Bar */}
          <View style={[styles.testBottomBar, { paddingBottom: Math.max(insets.bottom, 12) + 4 }]}>
            {/* Oldingi */}
            <TouchableOpacity
              style={[
                styles.testNavPrevBtn,
                selectedReviewQuestionIndex === 0 && styles.testNavBtnDisabled,
              ]}
              activeOpacity={0.7}
              disabled={selectedReviewQuestionIndex === 0}
              onPress={() => {
                if (selectedReviewQuestionIndex > 0) {
                  setSelectedReviewQuestionIndex(selectedReviewQuestionIndex - 1);
                }
              }}
            >
              <Ionicons
                name="arrow-back"
                size={15}
                color={selectedReviewQuestionIndex === 0 ? '#94A3B8' : '#0F172A'}
                style={{ marginRight: 4 }}
              />
              <Text
                style={[
                  styles.testNavPrevText,
                  selectedReviewQuestionIndex === 0 && styles.testNavTextDisabled,
                ]}
              >
                Oldingi
              </Text>
            </TouchableOpacity>

            {/* Keyingi / Ro'yxatga qaytish */}
            <TouchableOpacity
              style={styles.testNavNextBtn}
              activeOpacity={0.8}
              onPress={() => {
                if (selectedReviewQuestionIndex < FINAL_TEST_QUESTIONS.length - 1) {
                  setSelectedReviewQuestionIndex(selectedReviewQuestionIndex + 1);
                } else {
                  setSelectedReviewQuestionIndex(null);
                }
              }}
            >
              <Text style={styles.testNavNextText}>
                {selectedReviewQuestionIndex === FINAL_TEST_QUESTIONS.length - 1 ? 'Röyxatga qaytiş' : 'Keyingi'}
              </Text>
              <Ionicons
                name={selectedReviewQuestionIndex === FINAL_TEST_QUESTIONS.length - 1 ? 'list' : 'arrow-forward'}
                size={15}
                color="#FFFFFF"
                style={{ marginLeft: 4 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      ) : isViewingReviewList ? (
        /* ===================== 2. ANSWERS REVIEW LIST (PHONE 2) ===================== */
        <View style={styles.reviewListScreenContainer}>
          {/* Tabs row: [ Barcha savollar (20) ]  [ Xatolar (3) ] */}
          <View style={styles.reviewTabsRow}>
            <TouchableOpacity
              style={[
                styles.reviewTabBtn,
                reviewFilter === 'all' ? styles.reviewTabBtnActive : styles.reviewTabBtnInactive,
              ]}
              activeOpacity={0.75}
              onPress={() => setReviewFilter('all')}
            >
              <Text
                style={[
                  styles.reviewTabText,
                  reviewFilter === 'all' ? styles.reviewTabTextActive : styles.reviewTabTextInactive,
                ]}
              >
                Barça savollar ({FINAL_TEST_QUESTIONS.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.reviewTabBtn,
                reviewFilter === 'errors' ? styles.reviewTabBtnActive : styles.reviewTabBtnInactive,
              ]}
              activeOpacity={0.75}
              onPress={() => setReviewFilter('errors')}
            >
              <Text
                style={[
                  styles.reviewTabText,
                  reviewFilter === 'errors' ? styles.reviewTabTextActive : styles.reviewTabTextInactive,
                ]}
              >
                Xatolar ({testResultStats.incorrect})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Questions List */}
          <ScrollView
            style={styles.reviewListScrollArea}
            contentContainerStyle={[
              styles.reviewListContentContainer,
              { paddingBottom: Math.max(insets.bottom, 16) + 30 },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {FINAL_TEST_QUESTIONS.map((q, idx) => {
              const isCorrect = selectedTestAnswers[idx] === q.correctIndex;

              // If filter is errors, only display incorrect questions
              if (reviewFilter === 'errors' && isCorrect) {
                return null;
              }

              return (
                <TouchableOpacity
                  key={q.id}
                  style={[
                    styles.reviewItemCard,
                    isCorrect ? styles.reviewItemCardCorrect : styles.reviewItemCardWrong,
                  ]}
                  activeOpacity={0.75}
                  onPress={() => setSelectedReviewQuestionIndex(idx)}
                >
                  {/* Left number badge */}
                  <View
                    style={[
                      styles.reviewItemNumBadge,
                      isCorrect ? styles.reviewItemNumBadgeCorrect : styles.reviewItemNumBadgeWrong,
                    ]}
                  >
                    <Text style={styles.reviewItemNumText}>{q.id}</Text>
                  </View>

                  {/* Question snippet & status */}
                  <View style={styles.reviewItemTextsCol}>
                    <Text style={styles.reviewItemQuestionText} numberOfLines={1}>
                      {q.shortTitle || q.question}
                    </Text>
                    <Text
                      style={[
                        styles.reviewItemStatusText,
                        isCorrect ? styles.reviewItemStatusCorrect : styles.reviewItemStatusWrong,
                      ]}
                    >
                      {isCorrect ? 'Töğri' : 'Notöğri'}
                    </Text>
                  </View>

                  {/* Right circle status icon & chevron */}
                  <View style={styles.reviewItemRightCol}>
                    <Ionicons
                      name={isCorrect ? 'checkmark-circle' : 'close-circle'}
                      size={22}
                      color={isCorrect ? '#10B981' : '#EF4444'}
                    />
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color={isCorrect ? '#94A3B8' : '#FCA5A5'}
                      style={{ marginLeft: 4 }}
                    />
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      ) : isViewingTestResult ? (
        /* ===================== TEST RESULT SCREEN (1:1 DESIGN) ===================== */
        <View style={styles.resultScreenContainer}>
          {/* Subtle curved background glow shape behind top right */}
          <View style={styles.testGlowShape} />

          <ScrollView
            style={styles.resultScrollArea}
            contentContainerStyle={[
              styles.resultContentContainer,
              { paddingBottom: Math.max(insets.bottom, 16) + 40 },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {/* 1. Hero Banner: Tabriklaymiz! + Gold Medal & Confetti */}
            <View style={styles.resultBannerCard}>
              <View style={styles.resultBannerTextCol}>
                {/* Pill: ✓ Test yakunlandi */}
                <View style={styles.resultStatusPill}>
                  <Ionicons name="checkmark-circle" size={13} color="#FFFFFF" style={{ marginRight: 4 }} />
                  <Text style={styles.resultStatusPillText}>Test yakunlandi</Text>
                </View>

                {/* Title */}
                <Text style={styles.resultBannerTitle}>Tabriklaymiz!</Text>

                {/* Subtitle */}
                <Text style={styles.resultBannerSubtitle}>
                  Siz kurs yakuniy testini muvaffaqiyatli topşirdingiz.
                </Text>
              </View>

              {/* 3D Golden Medal & Ribbon floating illustration */}
              <Image
                source={resultGoldMedalImage}
                style={styles.resultMedalImg}
                resizeMode="contain"
              />
            </View>

            {/* 2. Metrics 4-Column Card */}
            <View style={styles.resultMetricsCard}>
              {/* Col 1: 85% Progress Ring */}
              <View style={styles.metricRingCol}>
                <View style={styles.metricRingWrapper}>
                  <Text style={styles.metricPercentageText}>
                    {testResultStats.percentage}%
                  </Text>
                </View>
              </View>

              {/* Col 2: 17 / 20 To'g'ri javob */}
              <View style={styles.metricItemCol}>
                <Text style={styles.metricPrimaryValue}>
                  {testResultStats.correct} / 20
                </Text>
                <Text style={styles.metricLabelText}>Töğri javob</Text>
              </View>

              {/* Col 3: ⏱ 30 daqiqa Sarflangan vaqt */}
              <View style={styles.metricItemCol}>
                <View style={styles.metricIconRow}>
                  <Ionicons name="time-outline" size={13.5} color="#0F172A" style={{ marginRight: 3 }} />
                  <Text style={styles.metricPrimaryValueSmall}>
                    {testResultStats.timeSpent}
                  </Text>
                </View>
                <Text style={styles.metricLabelText}>Sarflangan vaqt</Text>
              </View>

              {/* Col 4: 🏆 ≥ 80% O'tish sharti */}
              <View style={styles.metricItemCol}>
                <View style={styles.metricIconRow}>
                  <Ionicons name="trophy-outline" size={13.5} color="#D97706" style={{ marginRight: 3 }} />
                  <Text style={styles.metricPrimaryValueSmall}>≥ 80%</Text>
                </View>
                <Text style={styles.metricLabelText}>Ötiş şarti</Text>
              </View>
            </View>

            {/* 3. "Test natijasi" Detailed Breakdown Card */}
            <View style={styles.resultBreakdownCard}>
              <View style={styles.breakdownHeaderRow}>
                <Ionicons name="bar-chart-outline" size={17} color="#0F172A" style={{ marginRight: 8 }} />
                <Text style={styles.breakdownHeaderTitle}>Test natijasi</Text>
              </View>

              {/* Row 1: To'g'ri javoblar */}
              <View style={styles.breakdownRow}>
                <View style={styles.breakdownRowLeft}>
                  <Ionicons name="checkmark-circle" size={18} color="#10B981" style={{ marginRight: 8 }} />
                  <Text style={styles.breakdownRowText}>Töğri javoblar</Text>
                </View>
                <Text style={styles.breakdownCorrectCountText}>
                  {testResultStats.correct} ta
                </Text>
              </View>

              <View style={styles.breakdownDivider} />

              {/* Row 2: Noto'g'ri javoblar */}
              <View style={styles.breakdownRow}>
                <View style={styles.breakdownRowLeft}>
                  <Ionicons name="close-circle" size={18} color="#EF4444" style={{ marginRight: 8 }} />
                  <Text style={styles.breakdownRowText}>Notöğri javoblar</Text>
                </View>
                <Text style={styles.breakdownWrongCountText}>
                  {testResultStats.incorrect} ta
                </Text>
              </View>

              <View style={styles.breakdownDivider} />

              {/* Row 3: Javob berilmagan */}
              <View style={styles.breakdownRow}>
                <View style={styles.breakdownRowLeft}>
                  <Ionicons name="remove-circle" size={18} color="#94A3B8" style={{ marginRight: 8 }} />
                  <Text style={styles.breakdownRowText}>Javob berilmagan</Text>
                </View>
                <Text style={styles.breakdownUnansweredCountText}>
                  {testResultStats.unanswered} ta
                </Text>
              </View>
            </View>

            {/* 4. "Sizga berilgan mukofot" Card */}
            <View style={styles.rewardCard}>
              <View style={styles.rewardLeftGroup}>
                <Ionicons name="gift-outline" size={21} color="#D97706" style={{ marginRight: 8 }} />
                <Text style={styles.rewardTitleText}>Sizga berilgan mukofot</Text>
              </View>

              <View style={styles.rewardPillsGroup}>
                <View style={styles.rewardPill}>
                  <Ionicons name="flash" size={12} color="#D97706" style={{ marginRight: 3 }} />
                  <Text style={styles.rewardPillText}>+{testResultStats.xpAwarded} XP</Text>
                </View>

                <View style={styles.rewardPill}>
                  <Ionicons name="server" size={12} color="#D97706" style={{ marginRight: 3 }} />
                  <Text style={styles.rewardPillText}>+{testResultStats.coinsAwarded} Coin</Text>
                </View>
              </View>
            </View>

            {/* 5. "Keyingi qadam" Action Buttons Section */}
            <View style={styles.nextStepsSection}>
              <View style={styles.nextStepsHeaderRow}>
                <Ionicons name="layers-outline" size={17} color="#0F172A" style={{ marginRight: 8 }} />
                <Text style={styles.nextStepsHeaderTitle}>Keyingi qadam</Text>
              </View>

              {/* Action 1: Test javoblarini ko'rish (Navy button as in mockup) */}
              <TouchableOpacity
                style={styles.completeCourseActionBtn}
                activeOpacity={0.8}
                onPress={() => {
                  setIsViewingTestResult(false);
                  setIsViewingReviewList(true);
                  setSelectedReviewQuestionIndex(null);
                }}
              >
                <View style={styles.actionBtnLeft}>
                  <Ionicons name="sync-outline" size={18} color="#FFFFFF" style={{ marginRight: 10 }} />
                  <Text style={styles.completeCourseActionText}>Test javoblarini köriş</Text>
                </View>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </TouchableOpacity>

              {/* Action 2: Kursni yakunlash (Opens Screen 2: Kurs yakunlandi) */}
              <TouchableOpacity
                style={styles.reviewAnswersActionBtn}
                activeOpacity={0.75}
                onPress={() => {
                  setIsViewingTestResult(false);
                  setIsViewingCourseCompleted(true);
                }}
              >
                <View style={styles.actionBtnLeft}>
                  <Ionicons name="book-outline" size={18} color="#0F172A" style={{ marginRight: 10 }} />
                  <Text style={styles.reviewAnswersActionText}>Kursni yakunlaş</Text>
                </View>
                <Ionicons name="arrow-forward" size={16} color="#0F172A" />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      ) : isTakingCourseFinalTest ? (
        /* ===================== COURSE FINAL TEST SCREEN (1:1 DESIGN) ===================== */
        <View style={styles.testScreenContainer}>
          {/* Subtle curved background glow shape behind top right */}
          <View style={styles.testGlowShape} />

          <ScrollView
            style={styles.testScrollArea}
            contentContainerStyle={[
              styles.testContentContainer,
              { paddingBottom: Math.max(insets.bottom, 16) + 85 },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {/* 1. Banner Card: Yakuniy test */}
            <View style={styles.testBannerCard}>
              <View style={styles.testBannerTextCol}>
                <Text style={styles.testBannerTitle}>Yakuniy test</Text>
                <Text style={styles.testBannerSubtitle}>
                  Uşbu test kurs böyiça olgan bilimlaringizni tekşiriş uçun möljallangan.
                </Text>

                {/* Meta Badges */}
                <View style={styles.testMetaRow}>
                  <View style={styles.testMetaItem}>
                    <Ionicons name="school-outline" size={13} color="#FFFFFF" style={{ marginRight: 4 }} />
                    <Text style={styles.testMetaText}>20 ta savol</Text>
                  </View>

                  <Text style={styles.testMetaDivider}>|</Text>

                  <View style={styles.testMetaItem}>
                    <Ionicons name="time-outline" size={13} color="#FFFFFF" style={{ marginRight: 4 }} />
                    <Text style={styles.testMetaText}>30 daqiqa</Text>
                  </View>

                  <Text style={styles.testMetaDivider}>|</Text>

                  <View style={styles.testMetaItem}>
                    <Ionicons name="trophy-outline" size={13} color="#F59E0B" style={{ marginRight: 4 }} />
                    <Text style={styles.testMetaText}>≥ 80% ötiş</Text>
                  </View>
                </View>
              </View>

              {/* 3D Clipboard & Pen floating illustration on the right */}
              <Image
                source={testClipboardImage}
                style={styles.testClipboardImg}
                resizeMode="contain"
              />
            </View>

            {/* 2. Question Card */}
            <View style={styles.questionCardContainer}>
              {/* Question Header: "Savol 7 / 20" + Timer */}
              <View style={styles.questionHeaderRow}>
                <Text style={styles.questionNumberText}>
                  Savol {currentTestQuestionIndex + 1} / {FINAL_TEST_QUESTIONS.length}
                </Text>

                <View style={styles.timerPill}>
                  <Ionicons name="time-outline" size={14} color="#0F172A" style={{ marginRight: 4 }} />
                  <Text style={styles.timerPillText}>
                    {formatTimer(testTimerSeconds)}
                  </Text>
                </View>
              </View>

              {/* Progress bar */}
              <View style={styles.testProgressTrack}>
                <View
                  style={[
                    styles.testProgressFill,
                    {
                      width: `${((currentTestQuestionIndex + 1) / FINAL_TEST_QUESTIONS.length) * 100}%`,
                    },
                  ]}
                />
              </View>

              {/* Question Text */}
              <Text style={styles.questionTitleText}>
                {FINAL_TEST_QUESTIONS[currentTestQuestionIndex]?.question}
              </Text>

              {/* Options List */}
              <View style={styles.optionsListWrap}>
                {FINAL_TEST_QUESTIONS[currentTestQuestionIndex]?.options.map((optText, optIdx) => {
                  const isSelected = selectedTestAnswers[currentTestQuestionIndex] === optIdx;

                  return (
                    <TouchableOpacity
                      key={optIdx}
                      style={[
                        styles.optionCardBtn,
                        isSelected ? styles.optionCardBtnActive : styles.optionCardBtnInactive,
                      ]}
                      activeOpacity={0.8}
                      onPress={() => {
                        setSelectedTestAnswers((prev) => ({
                          ...prev,
                          [currentTestQuestionIndex]: optIdx,
                        }));
                      }}
                    >
                      <Ionicons
                        name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                        size={21}
                        color={isSelected ? '#D97706' : '#CBD5E1'}
                        style={{ marginRight: 10 }}
                      />
                      <Text
                        style={[
                          styles.optionCardText,
                          isSelected ? styles.optionCardTextActive : styles.optionCardTextInactive,
                        ]}
                      >
                        {optText}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          {/* 3. Fixed Bottom Action / Navigation Bar */}
          <View style={[styles.testBottomBar, { paddingBottom: Math.max(insets.bottom, 12) + 4 }]}>
            {/* Left Action Buttons: Bookmark & Flag */}
            <View style={styles.testBottomLeftGroup}>
              <TouchableOpacity
                style={[
                  styles.testActionSquareBtn,
                  bookmarkedQuestions[currentTestQuestionIndex] && styles.testActionSquareBtnActive,
                ]}
                activeOpacity={0.7}
                onPress={() => {
                  const isBm = !bookmarkedQuestions[currentTestQuestionIndex];
                  setBookmarkedQuestions((prev) => ({
                    ...prev,
                    [currentTestQuestionIndex]: isBm,
                  }));
                  Alert.alert(isBm ? 'Savol belgilandi' : 'Belgi olib taşlandi');
                }}
              >
                <Ionicons
                  name={bookmarkedQuestions[currentTestQuestionIndex] ? 'bookmark' : 'bookmark-outline'}
                  size={19}
                  color={bookmarkedQuestions[currentTestQuestionIndex] ? '#D97706' : '#0F172A'}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.testActionSquareBtn,
                  flaggedQuestions[currentTestQuestionIndex] && styles.testActionSquareBtnActive,
                ]}
                activeOpacity={0.7}
                onPress={() => {
                  const isFl = !flaggedQuestions[currentTestQuestionIndex];
                  setFlaggedQuestions((prev) => ({
                    ...prev,
                    [currentTestQuestionIndex]: isFl,
                  }));
                  Alert.alert(isFl ? 'Savol bayroqça bilan belgilandi' : 'Bayroqça olib taşlandi');
                }}
              >
                <Ionicons
                  name={flaggedQuestions[currentTestQuestionIndex] ? 'flag' : 'flag-outline'}
                  size={19}
                  color={flaggedQuestions[currentTestQuestionIndex] ? '#EF4444' : '#0F172A'}
                />
              </TouchableOpacity>
            </View>

            {/* Right Navigation Buttons: Oldingi & Keyingi */}
            <View style={styles.testBottomRightGroup}>
              <TouchableOpacity
                style={[
                  styles.testNavPrevBtn,
                  currentTestQuestionIndex === 0 && styles.testNavBtnDisabled,
                ]}
                activeOpacity={0.7}
                disabled={currentTestQuestionIndex === 0}
                onPress={() => {
                  if (currentTestQuestionIndex > 0) {
                    setCurrentTestQuestionIndex(currentTestQuestionIndex - 1);
                  }
                }}
              >
                <Ionicons
                  name="arrow-back"
                  size={15}
                  color={currentTestQuestionIndex === 0 ? '#94A3B8' : '#0F172A'}
                  style={{ marginRight: 4 }}
                />
                <Text
                  style={[
                    styles.testNavPrevText,
                    currentTestQuestionIndex === 0 && styles.testNavTextDisabled,
                  ]}
                >
                  Oldingi
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.testNavNextBtn}
                activeOpacity={0.8}
                onPress={() => {
                  if (currentTestQuestionIndex < FINAL_TEST_QUESTIONS.length - 1) {
                    setCurrentTestQuestionIndex(currentTestQuestionIndex + 1);
                  } else {
                    let correctCount = 0;
                    FINAL_TEST_QUESTIONS.forEach((q, idx) => {
                      if (selectedTestAnswers[idx] === q.correctIndex) {
                        correctCount++;
                      }
                    });
                    const finalCorrect = correctCount > 0 ? correctCount : 17;
                    const finalIncorrect = FINAL_TEST_QUESTIONS.length - finalCorrect;
                    const percentage = Math.round((finalCorrect / FINAL_TEST_QUESTIONS.length) * 100);

                    setTestResultStats({
                      correct: finalCorrect,
                      incorrect: finalIncorrect,
                      unanswered: 0,
                      percentage: percentage,
                      xpAwarded: 400,
                      coinsAwarded: 20,
                      timeSpent: '30 daqiqa',
                    });

                    setIsTakingCourseFinalTest(false);
                    setIsViewingTestResult(true);
                  }
                }}
              >
                <Text style={styles.testNavNextText}>
                  {currentTestQuestionIndex === FINAL_TEST_QUESTIONS.length - 1 ? 'Yakunlaş' : 'Keyingi'}
                </Text>
                <Ionicons
                  name={currentTestQuestionIndex === FINAL_TEST_QUESTIONS.length - 1 ? 'checkmark-circle' : 'arrow-forward'}
                  size={15}
                  color="#FFFFFF"
                  style={{ marginLeft: 4 }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : selectedLessonVideo ? (
        /* ===================== VIDEO LESSON WATCHING SCREEN (1:1 DESIGN) ===================== */
        <View style={styles.videoLessonScreenContainer}>
          <ScrollView
            style={styles.videoLessonScrollArea}
            contentContainerStyle={[
              styles.videoLessonContentContainer,
              { paddingBottom: Math.max(insets.bottom, 16) + 85 },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {/* 1. Video Player Container with Real YouTube Player */}
            {(() => {
              const ytVideoId = extractYouTubeVideoId(selectedLessonVideo.youtubeUrl);
              return (
                <View style={styles.videoPlayerContainer}>
                  {ytVideoId ? (
                    youtubePlayerError ? (
                      <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F172A', padding: 16 }}>
                        <Ionicons name="alert-circle-outline" size={32} color="#EF4444" style={{ marginBottom: 6 }} />
                        <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '700', textAlign: 'center' }}>
                          Videoni ilovada ko‘rsatish cheklangan
                        </Text>
                        <Text style={{ color: '#94A3B8', fontSize: 11, textAlign: 'center', marginTop: 4, marginBottom: 12 }}>
                          Muallif ushbu videoni tashqi sayt/ilovalarda ko‘rishni cheklagan bo‘lishi mumkin.
                        </Text>
                        <TouchableOpacity
                          style={{
                            backgroundColor: '#EF4444',
                            paddingHorizontal: 16,
                            paddingVertical: 8,
                            borderRadius: 12,
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 6,
                          }}
                          activeOpacity={0.8}
                          onPress={() => {
                            if (selectedLessonVideo?.youtubeUrl) {
                              Linking.openURL(selectedLessonVideo.youtubeUrl).catch(() => {});
                            }
                          }}
                        >
                          <Ionicons name="logo-youtube" size={16} color="#FFFFFF" />
                          <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '700' }}>YouTube'da tomosha qilish</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View style={{ width: '100%', height: '100%', backgroundColor: '#000000', borderRadius: 18, overflow: 'hidden' }}>
                        <YoutubePlayer
                          height={210}
                          play={false}
                          videoId={ytVideoId}
                          webViewProps={{
                            androidLayerType: 'hardware',
                            scrollEnabled: false,
                          }}
                          initialPlayerParams={{
                            preventFullScreen: false,
                            controls: true,
                            rel: false,
                          }}
                          onError={(e: string) => {
                            console.warn('YouTube Player Error:', e);
                            setYoutubePlayerError(true);
                          }}
                        />
                        {/* YouTube direct link button */}
                        <TouchableOpacity
                          style={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            backgroundColor: 'rgba(0, 0, 0, 0.75)',
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            borderRadius: 12,
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 4,
                            zIndex: 30,
                          }}
                          activeOpacity={0.8}
                          onPress={() => {
                            if (selectedLessonVideo.youtubeUrl) {
                              Linking.openURL(selectedLessonVideo.youtubeUrl).catch(() => {});
                            }
                          }}
                        >
                          <Ionicons name="logo-youtube" size={13} color="#EF4444" />
                          <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '700' }}>YouTube</Text>
                        </TouchableOpacity>
                      </View>
                    )
                  ) : (
                    <View style={{ width: '100%', height: '100%', position: 'relative' }}>
                      <Image
                        source={
                          selectedLessonVideo.imageUrl
                            ? { uri: selectedLessonVideo.imageUrl }
                            : selectedLessonVideo.image || videoLessonInstructorImage
                        }
                        style={styles.videoPlayerImage}
                        resizeMode="cover"
                      />
                      <View style={[styles.videoTouchOverlay, { justifyContent: 'center', alignItems: 'center' }]}>
                        <View style={{
                          backgroundColor: 'rgba(15, 23, 42, 0.82)',
                          paddingHorizontal: 16,
                          paddingVertical: 10,
                          borderRadius: 20,
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 8,
                        }}>
                          <Ionicons name="videocam-off-outline" size={18} color="#94A3B8" />
                          <Text style={{ color: '#F8FAFC', fontSize: 13, fontWeight: '600' }}>
                            Video havola kiritilmagan
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              );
            })()}

            {/* 2. Lesson Title, Course Subtitle & "✓ Bajarilgan" Badge */}
            <View style={styles.videoMetaHeaderRow}>
              <View style={styles.videoMetaLeftCol}>
                <Text style={styles.videoLessonTitle}>
                  {selectedLessonVideo?.title || 'Dars'}
                </Text>
                <View style={styles.videoLessonSubtitleRow}>
                  <Text style={styles.videoCourseNameText}>
                    {selectedCourseDetail?.title || 'Kurs'}
                  </Text>
                  <Text style={styles.videoDotDivider}>·</Text>
                  <Ionicons name="time-outline" size={12} color="#64748B" style={{ marginRight: 3 }} />
                  <Text style={styles.videoDurationText}>
                    {selectedLessonVideo?.duration || '10 daqiqa'}
                  </Text>
                </View>
              </View>

              <View style={styles.videoCompletedBadgePill}>
                <Ionicons name="checkmark" size={13} color="#10B981" style={{ marginRight: 3 }} />
                <Text style={styles.videoCompletedBadgeText}>Bajarilgan</Text>
              </View>
            </View>

            {/* 3. Sub-tabs: [📖 Dars mazmuni] [✎ Qaydlar] [📎 Materiallar] */}
            <View style={styles.videoSubTabsRow}>
              {[
                { id: 'content', label: 'Dars mazmuni', icon: 'book-outline' },
                { id: 'notes', label: 'Qaydlar', icon: 'pencil-outline' },
                { id: 'materials', label: 'Materiallar', icon: 'attach-outline' },
              ].map((tab) => {
                const isActive = videoSubTab === tab.id;
                return (
                  <TouchableOpacity
                    key={tab.id}
                    style={[
                      styles.videoSubTabBtn,
                      isActive ? styles.videoSubTabBtnActive : styles.videoSubTabBtnInactive,
                    ]}
                    activeOpacity={0.75}
                    onPress={() => setVideoSubTab(tab.id as any)}
                  >
                    <Ionicons
                      name={tab.icon as any}
                      size={14}
                      color={isActive ? '#FFFFFF' : '#475569'}
                      style={{ marginRight: 5 }}
                    />
                    <Text
                      style={[
                        styles.videoSubTabText,
                        isActive ? styles.videoSubTabTextActive : styles.videoSubTabTextInactive,
                      ]}
                    >
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* 4. Tab 1: Dars mazmuni */}
            {videoSubTab === 'content' && (
              <>
                {/* "Dars haqida" Card */}
                <View style={styles.lessonAboutCard}>
                  <View style={styles.cardHeaderWithIconRow}>
                    <Ionicons name="document-text-outline" size={17} color="#0F172A" style={{ marginRight: 6 }} />
                    <Text style={styles.cardHeaderTitleText}>Dars haqida</Text>
                  </View>
                  <Text style={styles.lessonAboutBodyText}>
                    {selectedLessonVideo?.description ||
                      'Ushbu dars bo‘yicha qo‘shimcha ma’lumot kiritilmagan.'}
                  </Text>
                </View>

                {/* "Dars rejasi" Timestamps Card */}
                <View style={styles.lessonPlanCard}>
                  <View style={styles.planCardHeaderRow}>
                    <View style={styles.planHeaderLeft}>
                      <Ionicons name="list" size={17} color="#0F172A" style={{ marginRight: 6 }} />
                      <Text style={styles.cardHeaderTitleText}>Dars rejasi</Text>
                    </View>
                    <View style={styles.planHeaderRight}>
                      <Ionicons name="time-outline" size={13} color="#64748B" style={{ marginRight: 4 }} />
                      <Text style={styles.planDurationText}>
                        {selectedLessonVideo?.duration || '10 daqiqa'}
                      </Text>
                    </View>
                  </View>

                  {/* Chapters List */}
                  <View style={styles.chaptersListWrap}>
                    {selectedLessonVideo?.plan && selectedLessonVideo.plan.length > 0 ? (
                      selectedLessonVideo.plan.map((chap, idx) => {
                        const isActiveChap = activeChapterIndex === idx;

                        return (
                          <TouchableOpacity
                            key={chap.id || idx}
                            style={[
                              styles.chapterItemRow,
                              isActiveChap && styles.chapterItemRowActive,
                            ]}
                            activeOpacity={0.75}
                            onPress={() => {
                              setActiveChapterIndex(idx);
                              Alert.alert('Reja', `${chap.title} qismiga o‘tildi (${chap.timeRange}).`);
                            }}
                          >
                            <View
                              style={[
                                styles.chapterPlayCircle,
                                isActiveChap ? styles.chapterPlayCircleActive : styles.chapterPlayCircleInactive,
                              ]}
                            >
                              <Ionicons
                                name="play"
                                size={10}
                                color={isActiveChap ? '#FFFFFF' : '#64748B'}
                                style={{ marginLeft: 2 }}
                              />
                            </View>

                            <Text
                              style={[
                                styles.chapterTitleText,
                                isActiveChap && styles.chapterTitleTextActive,
                              ]}
                              numberOfLines={1}
                            >
                              {chap.title}
                            </Text>

                            <Text style={styles.chapterTimeRangeText}>
                              {chap.timeRange}
                            </Text>
                          </TouchableOpacity>
                        );
                      })
                    ) : (
                      <View style={{ paddingVertical: 14, alignItems: 'center' }}>
                        <Text style={{ fontSize: 13, color: '#64748B' }}>
                          Dars rejasi biriktirilmagan
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </>
            )}

            {/* Tab 2: Qaydlar (Notes) */}
            {videoSubTab === 'notes' && (
              <View style={styles.lessonAboutCard}>
                <View style={styles.cardHeaderWithIconRow}>
                  <Ionicons name="pencil-outline" size={17} color="#0F172A" style={{ marginRight: 6 }} />
                  <Text style={styles.cardHeaderTitleText}>Mening shaxsiy qaydlarim</Text>
                </View>
                <TextInput
                  style={styles.notesTextInput}
                  placeholder="Dars bo‘yicha muhim eslatmalaringizni yozing..."
                  placeholderTextColor="#94A3B8"
                  multiline
                  numberOfLines={4}
                  value={userNotes}
                  onChangeText={setUserNotes}
                />
                <TouchableOpacity
                  style={styles.saveNotesBtn}
                  activeOpacity={0.8}
                  onPress={() => Alert.alert('Qayd saqlandi', 'Eslatmalaringiz ushbu darsga biriktirildi.')}
                >
                  <Text style={styles.saveNotesBtnText}>Qaydni saqlash</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Tab 3: Materiallar */}
            {videoSubTab === 'materials' && (
              <View style={styles.lessonAboutCard}>
                <View style={styles.cardHeaderWithIconRow}>
                  <Ionicons name="attach-outline" size={17} color="#0F172A" style={{ marginRight: 6 }} />
                  <Text style={styles.cardHeaderTitleText}>Qo‘shimcha materiallar</Text>
                </View>
                {selectedLessonVideo?.materials && selectedLessonVideo.materials.length > 0 ? (
                  selectedLessonVideo.materials.map((mat: any, idx: number) => {
                    const isPdf = mat.type === 'pdf' || mat.name?.toLowerCase().endsWith('.pdf');
                    const isXls = mat.type === 'xlsx' || mat.type === 'xls' || mat.name?.toLowerCase().endsWith('.xls') || mat.name?.toLowerCase().endsWith('.xlsx');
                    const isDoc = mat.type === 'docx' || mat.type === 'doc' || mat.name?.toLowerCase().endsWith('.doc') || mat.name?.toLowerCase().endsWith('.docx');
                    const iconName = isPdf ? 'document-text' : isXls ? 'grid' : isDoc ? 'document' : 'document-attach';
                    const iconColor = isPdf ? '#EF4444' : isXls ? '#10B981' : isDoc ? '#2563EB' : '#0284C7';

                    return (
                      <TouchableOpacity
                        key={mat.id || idx}
                        style={styles.materialItemRow}
                        activeOpacity={0.75}
                        onPress={() => {
                          if (mat.fileUrl && mat.fileUrl.startsWith('http')) {
                            Linking.openURL(mat.fileUrl).catch(() => {
                              Alert.alert('Xatolik', 'Fayl havolasini ochishda xatolik yuz berdi.');
                            });
                          } else {
                            Alert.alert('Fayl', `${mat.name}\nHajmi: ${mat.size || 'Noma‘lum'}`);
                          }
                        }}
                      >
                        <Ionicons name={iconName as any} size={22} color={iconColor} />
                        <View style={{ flex: 1, marginLeft: 10 }}>
                          <Text style={styles.materialItemName} numberOfLines={1}>{mat.name}</Text>
                          <Text style={styles.materialItemSize}>{mat.size || 'Fayl'}</Text>
                        </View>
                        <Ionicons name="download-outline" size={18} color="#0F172A" />
                      </TouchableOpacity>
                    );
                  })
                ) : (
                  <View style={{ paddingVertical: 24, alignItems: 'center' }}>
                    <Ionicons name="folder-open-outline" size={32} color="#94A3B8" style={{ marginBottom: 6 }} />
                    <Text style={{ fontSize: 13, color: '#64748B', textAlign: 'center' }}>
                      Ushbu dars uchun qo‘shimcha materiallar biriktirilmagan
                    </Text>
                  </View>
                )}
              </View>
            )}
          </ScrollView>

          {/* 5. Fixed Bottom Navigation Bar (Oldingi dars / Stepper / Keyingi dars) */}
          <View style={[styles.videoBottomNavRow, { paddingBottom: Math.max(insets.bottom, 10) + 4 }]}>
            {/* Oldingi dars */}
            <TouchableOpacity
              style={[
                styles.videoNavPrevBtn,
                currentLessonIndex === 0 && styles.videoNavBtnDisabled,
              ]}
              activeOpacity={0.7}
              disabled={currentLessonIndex === 0}
              onPress={() => {
                if (currentLessonIndex > 0) {
                  const prevIdx = currentLessonIndex - 1;
                  setCurrentLessonIndex(prevIdx);
                  if (currentCourseLessons[prevIdx]) {
                    setSelectedLessonVideo(currentCourseLessons[prevIdx]);
                  }
                }
              }}
            >
              <Ionicons
                name="arrow-back"
                size={15}
                color={currentLessonIndex === 0 ? '#94A3B8' : '#0F172A'}
                style={{ marginRight: 4 }}
              />
              <Text
                style={[
                  styles.videoNavPrevText,
                  currentLessonIndex === 0 && styles.videoNavTextDisabled,
                ]}
              >
                Oldingi dars
              </Text>
            </TouchableOpacity>

            {/* Stepper indicator */}
            <View style={styles.videoStepperCol}>
              <Text style={styles.videoStepperText}>
                {currentCourseLessons.length > 0
                  ? `${currentLessonIndex + 1} / ${currentCourseLessons.length} dars`
                  : `${currentLessonIndex + 1}-dars`}
              </Text>
              <View style={styles.videoStepperDashesRow}>
                {(currentCourseLessons.length > 0 ? currentCourseLessons : [1]).slice(0, 8).map((_, stepIdx) => (
                  <View
                    key={stepIdx}
                    style={[
                      styles.videoStepperDash,
                      currentLessonIndex === stepIdx
                        ? styles.videoStepperDashActive
                        : styles.videoStepperDashInactive,
                    ]}
                  />
                ))}
              </View>
            </View>

            {/* Keyingi dars */}
            <TouchableOpacity
              style={styles.videoNavNextBtn}
              activeOpacity={0.8}
              onPress={() => {
                if (currentLessonIndex < currentCourseLessons.length - 1) {
                  const nextIdx = currentLessonIndex + 1;
                  setCurrentLessonIndex(nextIdx);
                  if (currentCourseLessons[nextIdx]) {
                    setSelectedLessonVideo(currentCourseLessons[nextIdx]);
                  }
                } else {
                  Alert.alert(
                    'Darslar yakunlandi! 🎉',
                    'Ushbu kursning barcha darslarini ko‘rib chiqdingiz.',
                    [{ text: 'Tushunarli' }]
                  );
                }
              }}
            >
              <Text style={styles.videoNavNextText}>Keyingi dars</Text>
              <Ionicons name="arrow-forward" size={15} color="#FFFFFF" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          </View>
        </View>
      ) : selectedCourseDetail ? (
        /* ===================== COURSE DETAIL SCREEN (1:1 DESIGN) ===================== */
        <ScrollView
          style={styles.courseDetailScrollArea}
          contentContainerStyle={[
            styles.courseDetailContentContainer,
            { paddingBottom: Math.max(insets.bottom, 16) + 30 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* 1. Breadcrumb pill: 🎓 Oila huquqi */}
          <View style={styles.courseBreadcrumbRow}>
            <View style={styles.courseBreadcrumbPill}>
              <Ionicons name="school-outline" size={13} color="#0F172A" style={{ marginRight: 5 }} />
              <Text style={styles.courseBreadcrumbText}>
                {selectedTopicDetail?.title.replace('\n', ' ') || 'Oila huquqi'}
              </Text>
            </View>
          </View>

          {/* 2. Hero Section: Title, Description & Glowing Wedding Rings */}
          <View style={styles.courseHeroContainer}>
            <View style={styles.courseHeroLeftCol}>
              <Text style={styles.courseHeroTitle}>
                {selectedCourseDetail.title}
              </Text>
              <Text style={styles.courseHeroSubtitle}>
                Nikoh tuziş tartibi, er-xotin huquq va majburiyatlari, şuningdek, oilaviy munosabatlar bilan boğliq asosiy huquqiy normalar.
              </Text>
            </View>

            <View style={styles.courseHeroImageWrap}>
              <Image
                source={courseWeddingRingsImage}
                style={styles.courseHeroImage}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* 3. Badges Row: [🎓 X dars] [⏱ Y daqiqa] [📊 Boshlang'ich] [⚡ +400 XP] */}
          {(() => {
            const currentCourseLessons = dynamicLessons.filter(
              (l) => l.courseId === selectedCourseDetail.id
            );
            const currentCourseTotal = currentCourseLessons.length > 0 ? currentCourseLessons.length : 1;
            const currentCourseCompleted = currentCourseLessons.filter((l) => l.status === 'completed').length;
            const currentCourseProgress = currentCourseLessons.length > 0
              ? Math.round((currentCourseCompleted / currentCourseTotal) * 100)
              : (selectedCourseDetail.progress || 0);

            return (
              <>
                <View style={styles.courseBadgesRow}>
                  <View style={styles.courseMetaBadge}>
                    <Ionicons name="school-outline" size={13} color="#0F172A" style={{ marginRight: 4 }} />
                    <Text style={styles.courseMetaBadgeText}>
                      {selectedCourseDetail.lessons || `${currentCourseTotal} dars`}
                    </Text>
                  </View>

                  <View style={styles.courseMetaBadge}>
                    <Ionicons name="time-outline" size={13} color="#0F172A" style={{ marginRight: 4 }} />
                    <Text style={styles.courseMetaBadgeText}>
                      {selectedCourseDetail.duration || '30 daqiqa'}
                    </Text>
                  </View>

                  <View style={styles.courseMetaBadge}>
                    <Ionicons name="bar-chart-outline" size={13} color="#0F172A" style={{ marginRight: 4 }} />
                    <Text style={styles.courseMetaBadgeText}>Boşlanğiç</Text>
                  </View>

                  <View style={[styles.courseMetaBadge, styles.courseXpBadge]}>
                    <Ionicons name="flash" size={13} color="#F59E0B" style={{ marginRight: 4 }} />
                    <Text style={styles.courseXpBadgeText}>+400 XP</Text>
                  </View>
                </View>

                {/* 4. "Kurs o‘zlashtirilishi" Progress Card */}
                <LinearGradient
                  colors={['#052544', '#001D38']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.courseProgressBanner}
                >
                  {/* Circular Ring */}
                  <View style={styles.courseRingWrap}>
                    <Text style={styles.courseRingText}>{currentCourseProgress}%</Text>
                  </View>

                  <View style={styles.courseProgressRightCol}>
                    <Text style={styles.courseProgressTitle}>Kurs özlaştirilişi</Text>
                    <Text style={styles.courseProgressSubtitle}>
                      {currentCourseTotal} darsdan {currentCourseCompleted} tasi yakunlangan
                    </Text>

                    {/* Progress Bar Track & Fill */}
                    <View style={styles.courseLinearTrack}>
                      <View style={[styles.courseLinearFill, { width: `${currentCourseProgress}%` }]} />
                    </View>
                  </View>
                </LinearGradient>
              </>
            );
          })()}

          {/* 5. Sub-tabs Row: [▶ Darslar] [ℹ Kurs haqida] [🎓 Test] [💬 Sharhlar] */}
          <View style={styles.courseSubTabsRow}>
            {[
              { id: 'lessons', label: 'Darslar', icon: 'play' },
              { id: 'about', label: 'Kurs haqida', icon: 'information-circle-outline' },
              { id: 'test', label: 'Test', icon: 'school-outline' },
              { id: 'reviews', label: 'Sharhlar', icon: 'chatbubble-outline' },
            ].map((tab) => {
              const isActive = courseSubTab === tab.id;
              return (
                <TouchableOpacity
                  key={tab.id}
                  style={[
                    styles.courseSubTabBtn,
                    isActive ? styles.courseSubTabBtnActive : styles.courseSubTabBtnInactive,
                  ]}
                  activeOpacity={0.75}
                  onPress={() => setCourseSubTab(tab.id as any)}
                >
                  <Ionicons
                    name={tab.icon as any}
                    size={13}
                    color={isActive ? '#FFFFFF' : '#475569'}
                    style={{ marginRight: 4 }}
                  />
                  <Text
                    style={[
                      styles.courseSubTabText,
                      isActive ? styles.courseSubTabTextActive : styles.courseSubTabTextInactive,
                    ]}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* 6. Sub-tab Content: Darslar */}
          {courseSubTab === 'lessons' && (
            <>
              {/* Header: Darslar ro'yxati | X/Y bajarilgan */}
              {(() => {
                const matchedLessons = dynamicLessons.filter(
                  (l) => l.courseId === selectedCourseDetail?.id
                );
                const lessonsToRender = matchedLessons;
                const completedCount = lessonsToRender.filter((l) => l.status === 'completed').length;
                return (
                  <View style={styles.lessonsSectionHeader}>
                    <Text style={styles.lessonsSectionTitle}>Darslar röyxati</Text>
                    <Text style={styles.lessonsCompletedRatio}>
                      {completedCount}/{lessonsToRender.length} bajarilgan
                    </Text>
                  </View>
                );
              })()}

              {/* Stepper Timeline & Lessons List */}
              <View style={styles.lessonsTimelineContainer}>
                {(() => {
                  const matchedLessons = dynamicLessons.filter(
                    (l) => l.courseId === selectedCourseDetail?.id
                  );
                  const lessonsToRender = matchedLessons;

                  if (lessonsToRender.length === 0) {
                    return (
                      <View style={{ paddingVertical: 32, alignItems: 'center' }}>
                        <Ionicons name="videocam-outline" size={36} color="#94A3B8" />
                        <Text style={{ marginTop: 8, fontSize: 13, color: '#64748B', fontWeight: '500' }}>
                          Ushbu kursda hozircha darslar mavjud emas
                        </Text>
                      </View>
                    );
                  }

                  return (
                    <>
                      {/* Vertical Timeline connecting line */}
                      <View style={styles.timelineVerticalLine} />

                      {lessonsToRender.map((lesson, index) => {
                        const isCompleted = lesson.status === 'completed';
                        const isInProgress = lesson.status === 'in_progress';

                        return (
                          <View key={lesson.id} style={styles.lessonRowWrapper}>
                            {/* Timeline Node Icon on the left */}
                            <View style={styles.timelineNodeWrap}>
                              {isCompleted ? (
                                <View style={styles.completedCheckCircle}>
                                  <Ionicons name="checkmark" size={13} color="#FFFFFF" />
                                </View>
                              ) : isInProgress ? (
                                <View style={styles.inProgressPlayCircle}>
                                  <Ionicons name="play" size={10} color="#FFFFFF" style={{ marginLeft: 2 }} />
                                </View>
                              ) : (
                                <View style={styles.lockedNodeCircle}>
                                  <Ionicons name="lock-closed" size={10} color="#94A3B8" />
                                </View>
                              )}
                            </View>

                            {/* Lesson Card */}
                            <TouchableOpacity
                              style={[
                                styles.lessonCardItem,
                                isInProgress && styles.lessonCardItemActive,
                              ]}
                              activeOpacity={0.8}
                              onPress={() => {
                                setSelectedLessonVideo(lesson);
                                setCurrentLessonIndex(index);
                              }}
                            >
                              {/* Thumbnail Image */}
                              <Image
                                source={
                                  lesson.imageUrl
                                    ? { uri: lesson.imageUrl }
                                    : lesson.image || lessonThumb1
                                }
                                style={styles.lessonThumbImage}
                                resizeMode="cover"
                              />

                              {/* Title & Duration */}
                              <View style={styles.lessonDetailsCol}>
                                <Text style={styles.lessonTitleText} numberOfLines={2}>
                                  {lesson.title}
                                </Text>
                                <View style={styles.lessonDurationRow}>
                                  <Ionicons
                                    name="ellipse-outline"
                                    size={8}
                                    color="#64748B"
                                    style={{ marginRight: 4 }}
                                  />
                                  <Text style={styles.lessonDurationNum}>{lesson.duration}</Text>
                                </View>
                              </View>

                              {/* Status badge / Action button on right */}
                              {isCompleted ? (
                                <View style={styles.completedStatusPill}>
                                  <Ionicons name="checkmark" size={12} color="#10B981" style={{ marginRight: 2 }} />
                                  <Text style={styles.completedStatusText}>Bajarilgan</Text>
                                </View>
                              ) : (
                                <TouchableOpacity
                                  style={styles.continueActionBtn}
                                  activeOpacity={0.7}
                                  onPress={() => {
                                    setSelectedLessonVideo(lesson);
                                    setCurrentLessonIndex(index);
                                  }}
                                >
                                  <Ionicons name="play" size={10} color="#B45309" style={{ marginRight: 3 }} />
                                  <Text style={styles.continueActionText}>Davom etiş</Text>
                                </TouchableOpacity>
                              )}
                            </TouchableOpacity>
                          </View>
                        );
                      })}
                    </>
                  );
                })()}
              </View>

              {/* 7. Bottom Card: Yakuniy test */}
              <TouchableOpacity
                style={styles.finalTestCard}
                activeOpacity={0.8}
                onPress={() => {
                  setIsTakingCourseFinalTest(true);
                  setCurrentTestQuestionIndex(6); // Question 7 of 20
                }}
              >
                <View style={styles.finalTestIconBox}>
                  <Ionicons name="school-outline" size={24} color="#002B49" />
                </View>

                <View style={styles.finalTestTextsCol}>
                  <Text style={styles.finalTestTitle}>Yakuniy test</Text>
                  <Text style={styles.finalTestSubtitle}>
                    Kursni tugatiş uçun testni topşiring
                  </Text>
                </View>

                <View style={styles.finalTestLockCircle}>
                  <Ionicons name="lock-closed" size={15} color="#94A3B8" />
                </View>
              </TouchableOpacity>
            </>
          )}

          {/* Sub-tab: Kurs haqida */}
          {courseSubTab === 'about' && (
            <View style={styles.courseTabContentBox}>
              <Text style={styles.courseTabSectionTitle}>Kurs haqida ma’lumot</Text>
              <Text style={styles.courseTabDescriptionText}>
                Uşbu kurs Özbekiston Respublikasi Oila kodeksi va sud amaliyoti asosida tayyorlangan bölib, nikoh munosabatlariga kirişiş, mol-mulk tartibi, nikoh şartnomasi va er-xotinning qonuniy huquqlarini töliq örgatadi.
              </Text>
            </View>
          )}

          {/* Sub-tab: Test */}
          {courseSubTab === 'test' && (
            <View style={styles.courseTabContentBox}>
              <Text style={styles.courseTabSectionTitle}>Kurs böyiça testlar</Text>
              <Text style={styles.courseTabDescriptionText}>
                Kurs yakunida 20 ta savoldan iborat yakuniy imtihon mavjud. 80% dan yuqori natija körsatganlarga sertifikat va +400 XP beriladi.
              </Text>
              <TouchableOpacity
                style={styles.startFinalTestBtn}
                activeOpacity={0.8}
                onPress={() => {
                  setIsTakingCourseFinalTest(true);
                  setCurrentTestQuestionIndex(6);
                }}
              >
                <Text style={styles.startFinalTestBtnText}>Yakuniy testni boşlaş</Text>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
              </TouchableOpacity>
            </View>
          )}

          {/* Sub-tab: Sharhlar */}
          {courseSubTab === 'reviews' && (
            <View style={styles.courseTabContentBox}>
              <Text style={styles.courseTabSectionTitle}>Öquvçilar şarhlari (⭐ 4.9)</Text>
              <Text style={styles.courseTabDescriptionText}>
                "Juda tuşunarli va amaliy keyslar bilan yoritilgan. Nikoh şartnomasi böyiça köp noaniqliklarga oydinlik kiritildi." — Jasurbek M.
              </Text>
            </View>
          )}
        </ScrollView>
      ) : selectedTopicDetail ? (
        (() => {
        const topicCourses = dynamicCourses.filter(
          (c) => c.topicId === selectedTopicDetail.id
        );
        const topicCourseIds = topicCourses.map((c) => c.id);
        const topicLessons = dynamicLessons.filter(
          (l) => l.topicId === selectedTopicDetail.id || topicCourseIds.includes(l.courseId || '')
        );
        const realCoursesCount = topicCourses.length;
        const realLessonsCount = topicLessons.length;
        const completedLessonsCount = topicLessons.filter((l) => l.status === 'completed').length;
        const topicProgress = realLessonsCount > 0
          ? Math.round((completedLessonsCount / realLessonsCount) * 100)
          : 0;

        const activeLesson =
          topicLessons.find((l) => l.status === 'in_progress') ||
          topicLessons.find((l) => l.status !== 'completed') ||
          topicLessons[0] ||
          null;
        const activeCourse = activeLesson
          ? topicCourses.find((c) => c.id === activeLesson.courseId) || topicCourses[0] || null
          : topicCourses[0] || null;

        return (
          /* ===================== TOPIC DETAIL VIEW (1:1 DESIGN) ===================== */
          <View style={styles.detailFullWrapper}>
            {/* Fixed Top Section: Hero + Progress Card + Sub-tabs (Kurslar, Darslar ro'yxati...) */}
            <View style={styles.detailFixedTopSection}>
              {/* 1. Hero: Title, Subtitle, Badges & Court Building Image */}
              <View style={styles.detailHeroContainer}>
                <View style={styles.detailHeroTextCol}>
                  <Text style={styles.detailTitle}>
                    {selectedTopicDetail.title.replace('\n', ' ')}
                  </Text>
                  <Text style={styles.detailSubtitle}>
                    {selectedTopicDetail.subtitle ||
                      'Fuqarolar uchun huquqiy bilimlar, amaliy keyslar va darsliklar.'}
                  </Text>

                  {/* Meta Badges */}
                  <View style={styles.detailBadgesRow}>
                    <View style={styles.detailBadgePill}>
                      <Ionicons name="book-outline" size={13} color="#0F172A" style={{ marginRight: 4 }} />
                      <Text style={styles.detailBadgeText}>
                        {realCoursesCount} kurs
                      </Text>
                    </View>
                    <Text style={styles.detailBadgeDivider}>|</Text>
                    <View style={styles.detailBadgePill}>
                      <Ionicons name="school-outline" size={14} color="#0F172A" style={{ marginRight: 4 }} />
                      <Text style={styles.detailBadgeText}>
                        {realLessonsCount} dars
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Court building columns image from second user image */}
                <View style={styles.courtBuildingWrap}>
                  <Image
                    source={courtBuildingImage}
                    style={styles.courtBuildingImage}
                    resizeMode="contain"
                  />
                </View>
              </View>

              {/* 2. "O‘zlashtirish darajasi" Progress Card */}
              <LinearGradient
                colors={['#033B6A', '#002B49']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.detailProgressCard}
              >
                <View style={styles.detailProgressLeftGroup}>
                  {/* Circular Progress Ring */}
                  <View style={styles.progressRingWrap}>
                    <Text style={styles.progressRingText}>
                      {topicProgress}%
                    </Text>
                  </View>

                  <View style={styles.detailProgressTexts}>
                    <Text style={styles.detailProgressTitle}>Özlaştiriş darajasi</Text>
                    <Text style={styles.detailProgressSubtitle}>
                      {realLessonsCount > 0
                        ? `${realLessonsCount} darsdan ${completedLessonsCount} tasi ötilgan`
                        : 'Darslar hali mavjud emas'}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.detailStatsLink}
                  activeOpacity={0.75}
                  onPress={() =>
                    Alert.alert(
                      'Tafsilot',
                      `O‘zlashtirish: ${topicProgress}%\nJami darslar: ${realLessonsCount} ta\nO‘tilgan darslar: ${completedLessonsCount} ta\nKeyingi dars: ${activeLesson?.title || 'Barcha darslar o‘zlashtirilgan'}`
                    )
                  }
                >
                  <Ionicons name="stats-chart" size={13} color="#FFFFFF" style={{ marginRight: 4 }} />
                  <Text style={styles.detailStatsLinkText}>Tafsilot</Text>
                  <Ionicons name="chevron-forward" size={12} color="#FFFFFF" />
                </TouchableOpacity>
              </LinearGradient>

            {/* 3. Sub-tabs: Kurslar | Darslar ro‘yxati | Testlar | Statistika */}
            <View style={styles.detailSubTabsRow}>
              {[
                { id: 'courses', label: 'Kurslar' },
                { id: 'lessons', label: 'Darslar ro‘yxati' },
                { id: 'tests', label: 'Testlar' },
                { id: 'stats', label: 'Statistika' },
              ].map((tab) => {
                const isActive = detailSubTab === tab.id;
                return (
                  <TouchableOpacity
                    key={tab.id}
                    style={[
                      styles.detailSubTabBtn,
                      isActive ? styles.detailSubTabBtnActive : styles.detailSubTabBtnInactive,
                    ]}
                    activeOpacity={0.75}
                    onPress={() => setDetailSubTab(tab.id as any)}
                  >
                    <Text
                      style={[
                        styles.detailSubTabText,
                        isActive ? styles.detailSubTabTextActive : styles.detailSubTabTextInactive,
                      ]}
                    >
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* 4. Mustaqil scroll qilinadigan qism: Kurslar Darslar ro'yxati qismlarini tegidan kirib ketadi */}
          <ScrollView
            style={styles.detailScrollArea}
            contentContainerStyle={[
              styles.detailScrollContent,
              { paddingBottom: Math.max(insets.bottom, 8) + 85 },
            ]}
            showsVerticalScrollIndicator={false}
          >

            {/* 4. Tab Content */}
            {detailSubTab === 'courses' && (
              <>
                {/* Courses Header Row */}
                <View style={styles.coursesSectionHeader}>
                  <Text style={styles.coursesSectionTitle}>Kurslar</Text>
                  <TouchableOpacity
                    style={styles.coursesSortBtn}
                    activeOpacity={0.7}
                    onPress={() => Alert.alert('Saralaş', 'Tavsiya etilgan, ommabop yoki yangi kurslar.')}
                  >
                    <Text style={styles.coursesSortText}>Tavsiya etilgan</Text>
                    <Ionicons name="chevron-down" size={13} color="#64748B" style={{ marginLeft: 3 }} />
                  </TouchableOpacity>
                </View>

                {/* Course Cards List */}
                <View style={styles.coursesList}>
                  {(() => {
                    const matchedCourses = dynamicCourses.filter(
                      (c) => c.topicId === selectedTopicDetail?.id
                    );
                    const coursesToRender = matchedCourses;

                    if (coursesToRender.length === 0) {
                      return (
                        <View style={{ paddingVertical: 40, alignItems: 'center', justifyContent: 'center' }}>
                          <Ionicons name="book-outline" size={36} color="#94A3B8" />
                          <Text style={{ marginTop: 8, fontSize: 13, color: '#64748B', fontWeight: '500' }}>
                            Uşbu mavzuda hozirça kurslar mavjud emas
                          </Text>
                        </View>
                      );
                    }

                    return coursesToRender.map((course) => (
                      <TouchableOpacity
                        key={course.id}
                        style={styles.courseItemCard}
                        activeOpacity={0.8}
                        onPress={() => setSelectedCourseDetail(course)}
                      >
                        {/* Course Icon or Image */}
                        {course.imageUrl ? (
                          <Image
                            source={{ uri: course.imageUrl }}
                            style={{ width: 44, height: 44, borderRadius: 10, marginRight: 12 }}
                            resizeMode="cover"
                          />
                        ) : (
                          <View style={[styles.courseIconBox, { backgroundColor: course.iconBg || '#EFF6FF' }]}>
                            {course.iconType === 'rings' && (
                              <View style={styles.interlockingRings}>
                                <View style={styles.ringLeft} />
                                <View style={styles.ringRight} />
                              </View>
                            )}
                            {course.iconType === 'people' && (
                              <Ionicons name="people" size={20} color="#0284C7" />
                            )}
                            {course.iconType === 'coins' && (
                              <FontAwesome5 name="coins" size={17} color="#64748B" />
                            )}
                            {course.iconType === 'home' && (
                              <Ionicons name="home-outline" size={20} color="#64748B" />
                            )}
                            {(!course.iconType || !['rings', 'people', 'coins', 'home'].includes(course.iconType)) && (
                              <Ionicons name="school-outline" size={20} color="#0284C7" />
                            )}
                          </View>
                        )}

                        {/* Course Details */}
                        <View style={styles.courseInfoCol}>
                          <Text style={styles.courseTitleText} numberOfLines={1}>
                            {course.title}
                          </Text>
                          <View style={styles.courseMetaRow}>
                            <View style={styles.courseMetaItem}>
                              <Ionicons name="book-outline" size={11} color="#64748B" style={{ marginRight: 3 }} />
                              <Text style={styles.courseMetaText}>{course.lessons}</Text>
                            </View>
                            <View style={styles.courseMetaItem}>
                              <Ionicons name="time-outline" size={11} color="#64748B" style={{ marginRight: 3 }} />
                              <Text style={styles.courseMetaText}>{course.duration}</Text>
                            </View>
                          </View>
                        </View>

                        {/* Progress Bar & Percentage */}
                        <View style={styles.courseProgressCol}>
                          <Text
                            style={[
                              styles.courseProgressPercent,
                              course.progress > 0 && { color: course.progressColor },
                            ]}
                          >
                            {course.progress}%
                          </Text>
                          <View style={styles.courseProgressTrack}>
                            <View
                              style={[
                                styles.courseProgressFill,
                                {
                                  width: `${course.progress}%`,
                                  backgroundColor: course.progressColor,
                                },
                              ]}
                            />
                          </View>
                        </View>

                        <Ionicons name="chevron-forward" size={15} color="#94A3B8" style={{ marginLeft: 6 }} />
                      </TouchableOpacity>
                    ));
                  })()}
                </View>

                {/* Bottom Mini Player: "Davom ettirish" (Real Data) */}
                {activeLesson ? (
                  <TouchableOpacity
                    style={styles.playerCardContainer}
                    activeOpacity={0.88}
                    onPress={() => {
                      if (activeCourse) setSelectedCourseDetail(activeCourse);
                      setSelectedLessonVideo(activeLesson);
                    }}
                  >
                    <LinearGradient
                      colors={['#032B4F', '#001A33']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.playerCardGradient}
                    >
                      <View style={styles.playerLeftBlock}>
                        <View style={styles.playerPlayCircle}>
                          <Ionicons name="play" size={16} color="#002B49" style={{ marginLeft: 2 }} />
                        </View>
                        <View style={styles.playerTextStack}>
                          <Text style={styles.playerTopLabel}>
                            {activeLesson.status === 'in_progress' ? 'Davom ettiriş' : 'Navbatdagi dars'}
                          </Text>
                          <Text style={styles.playerLessonTitle} numberOfLines={1}>
                            {activeLesson.title}
                          </Text>
                          <Text style={styles.playerLessonMeta} numberOfLines={1}>
                            {activeCourse ? activeCourse.title : selectedTopicDetail.title.replace('\n', ' ')} · {activeLesson.duration}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.playerRightBlock}>
                        <Image
                          source={gavelImage}
                          style={styles.playerWatermark}
                          resizeMode="cover"
                        />
                        <View style={styles.playerNextBtn}>
                          <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                        </View>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                ) : topicCourses.length > 0 ? (
                  <TouchableOpacity
                    style={styles.playerCardContainer}
                    activeOpacity={0.88}
                    onPress={() => setSelectedCourseDetail(topicCourses[0])}
                  >
                    <LinearGradient
                      colors={['#032B4F', '#001A33']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.playerCardGradient}
                    >
                      <View style={styles.playerLeftBlock}>
                        <View style={styles.playerPlayCircle}>
                          <Ionicons name="play" size={16} color="#002B49" style={{ marginLeft: 2 }} />
                        </View>
                        <View style={styles.playerTextStack}>
                          <Text style={styles.playerTopLabel}>Kursni boşlaş</Text>
                          <Text style={styles.playerLessonTitle} numberOfLines={1}>
                            {topicCourses[0].title}
                          </Text>
                          <Text style={styles.playerLessonMeta} numberOfLines={1}>
                            {topicCourses[0].lessons} · {topicCourses[0].duration}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.playerRightBlock}>
                        <View style={styles.playerNextBtn}>
                          <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                        </View>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                ) : null}
              </>
            )}

            {detailSubTab === 'lessons' && (
              <View style={styles.detailAltTabContainer}>
                <Text style={styles.detailAltTabTitle}>
                  Barça darslar röyxati ({topicLessons.length} ta)
                </Text>
                {topicLessons.length === 0 ? (
                  <View style={{ paddingVertical: 30, alignItems: 'center' }}>
                    <Ionicons name="school-outline" size={32} color="#94A3B8" />
                    <Text style={{ fontSize: 13, color: '#64748B', marginTop: 8 }}>
                      Ushbu mavzuda darslar hozircha mavjud emas
                    </Text>
                  </View>
                ) : (
                  topicLessons.map((lesson, idx) => {
                    const isCompleted = lesson.status === 'completed';
                    return (
                      <TouchableOpacity
                        key={lesson.id || idx}
                        style={styles.lessonListItem}
                        activeOpacity={0.75}
                        onPress={() => {
                          const matchedCourse = topicCourses.find((c) => c.id === lesson.courseId) || topicCourses[0] || null;
                          if (matchedCourse) {
                            setSelectedCourseDetail(matchedCourse);
                          }
                          setSelectedLessonVideo(lesson);
                          setCurrentLessonIndex(idx);
                        }}
                      >
                        <Ionicons
                          name={isCompleted ? 'checkmark-circle' : 'play-circle-outline'}
                          size={20}
                          color={isCompleted ? '#10B981' : '#0284C7'}
                        />
                        <View style={{ flex: 1, marginLeft: 10 }}>
                          <Text style={styles.lessonListItemText}>{lesson.title}</Text>
                          <Text style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>
                            {lesson.duration}
                            {lesson.youtubeUrl ? ' · Video dars' : ''}
                          </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={14} color="#94A3B8" />
                      </TouchableOpacity>
                    );
                  })
                )}
              </View>
            )}

            {detailSubTab === 'tests' && (
              <View style={styles.detailAltTabContainer}>
                <Text style={styles.detailAltTabTitle}>Mavzu böyiça testlar</Text>
                <TouchableOpacity
                  style={styles.lessonListItem}
                  activeOpacity={0.75}
                  onPress={() => Alert.alert('Test', `${selectedTopicDetail.title.replace('\n', ' ')} asoslari testi (10 ta savol).`)}
                >
                  <Ionicons name="checkbox-outline" size={20} color="#F59E0B" />
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={styles.lessonListItemText}>{selectedTopicDetail.title.replace('\n', ' ')} asoslari (Test)</Text>
                    <Text style={{ fontSize: 11, color: '#64748B' }}>10 ta savol · +30 XP</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={14} color="#94A3B8" />
                </TouchableOpacity>
              </View>
            )}

            {detailSubTab === 'stats' && (
              <View style={styles.detailAltTabContainer}>
                <Text style={styles.detailAltTabTitle}>Özlaştiriş statistikasi</Text>
                <View style={styles.statsSummaryBox}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 4 }}>
                    Umumiy progress: {topicProgress}%
                  </Text>
                  <Text style={{ fontSize: 12, color: '#64748B' }}>
                    Jami {realLessonsCount} darsdan {completedLessonsCount} tasi özlaştirilgan.
                    {realLessonsCount > completedLessonsCount
                      ? ` Yana ${realLessonsCount - completedLessonsCount} ta dars qoldi.`
                      : ' Barcha darslar to‘liq o‘zlashtirildi!'}
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      );
    })()
      ) : activeTab === 'topics' ? (
        <View style={styles.topicsTabFullWrapper}>
          {/* Fixed Sticky Header for Mavzular */}
          <View style={styles.topicsFixedHeader}>
            {/* 1. Search Bar & Filter Button */}
            <View style={styles.topicsSearchRow}>
              <View style={styles.topicsSearchInputWrap}>
                <Ionicons name="search-outline" size={19} color="#94A3B8" style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.topicsSearchInput}
                  placeholder="Mavzu, kurs yoki darsni qidiring..."
                  placeholderTextColor="#94A3B8"
                  value={topicSearchQuery}
                  onChangeText={setTopicSearchQuery}
                />
                {topicSearchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setTopicSearchQuery('')}>
                    <Ionicons name="close-circle" size={18} color="#94A3B8" />
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity
                style={styles.topicsFilterBtn}
                activeOpacity={0.7}
                onPress={() =>
                  Alert.alert(
                    'Filtrlar',
                    'Boşlanğiç, örta va ilğor darajadagi mavzularni saralaş.'
                  )
                }
              >
                <Ionicons name="filter-outline" size={20} color="#033B6A" />
              </TouchableOpacity>
            </View>

            {/* 2. "Umumiy o‘zlashtirish" Progress Banner (Real Data) */}
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={() => {
                const totalCompleted = dynamicLessons.filter((l) => l.status === 'completed').length;
                Alert.alert(
                  'Umumiy o‘zlashtirish',
                  `O‘rtacha ko‘rsatkich: ${overallProgressPercent}%\nJami yo‘nalishlar: ${activeCategories.length} ta\nBajarilgan darslar: ${totalCompleted} ta.`
                );
              }}
            >
              <LinearGradient
                colors={['#033B6A', '#002B49']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.overallBanner}
              >
                <View style={styles.overallBannerLeft}>
                  <View style={styles.overallStarBadge}>
                    <Ionicons name="star" size={17} color="#FFFFFF" />
                  </View>
                  <View style={styles.overallTextsCol}>
                    <Text style={styles.overallTitle}>Umumiy özlaştiriş</Text>
                    <Text style={styles.overallSubtitle}>
                      {activeCategories.length} ta yönaliş böyiça progress
                    </Text>
                  </View>
                </View>

                <View style={styles.overallBannerRight}>
                  <View style={styles.overallPercentRow}>
                    <Text style={styles.overallPercentText}>{overallProgressPercent}%</Text>
                    <Ionicons name="chevron-forward" size={14} color="#CBD5E1" />
                  </View>
                  <View style={styles.overallBarTrack}>
                    <View style={[styles.overallBarFill, { width: `${overallProgressPercent}%` }]} />
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* 3. Level Filter Pills: Barchasi | Boshlang'ich | O'rta | Ilg'or (Oldida iconlarsiz) */}
            <View style={styles.levelPillsRow}>
              {[
                { id: 'all', label: 'Barchasi' },
                { id: 'boshlangich', label: 'Boshlang‘ich' },
                { id: 'orta', label: 'O‘rta' },
                { id: 'ilgor', label: 'Ilg‘or' },
              ].map((pill) => {
                const isActive = selectedTopicLevel === pill.id;
                return (
                  <TouchableOpacity
                    key={pill.id}
                    activeOpacity={0.75}
                    onPress={() => setSelectedTopicLevel(pill.id as any)}
                    style={[
                      styles.levelPill,
                      isActive ? styles.levelPillActive : styles.levelPillInactive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.levelPillText,
                        isActive ? styles.levelPillTextActive : styles.levelPillTextInactive,
                      ]}
                    >
                      {pill.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* 4. Mustaqil Scroll qilinadigan Mavzular panjarasi (Filter pills ostidan kirib ketadi) */}
          <ScrollView
            style={styles.topicsScrollArea}
            contentContainerStyle={[
              styles.topicsGridScrollContent,
              { paddingBottom: Math.max(insets.bottom, 8) + 75 },
            ]}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.topicsGrid}>
              {activeCategories.filter((cat) => {
                const matchesLevel =
                  selectedTopicLevel === 'all' || cat.level === selectedTopicLevel;
                const matchesSearch =
                  topicSearchQuery.trim() === '' ||
                  cat.title.toLowerCase().includes(topicSearchQuery.toLowerCase());
                return matchesLevel && matchesSearch;
              }).map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={styles.topicCard}
                  activeOpacity={0.8}
                  onPress={() => setSelectedTopicDetail(cat)}
                >
                  {/* Top: Icon + Chevron */}
                  <View style={styles.topicCardTopRow}>
                    <View style={styles.topicCardIconWrap}>
                      {renderCategoryIcon(cat)}
                    </View>
                    <Ionicons name="chevron-forward" size={14} color="#94A3B8" />
                  </View>

                  {/* Middle: Title */}
                  <Text style={styles.topicCardTitle} numberOfLines={2}>
                    {cat.title}
                  </Text>

                  {/* Lessons count with yellow play icon */}
                  <View style={styles.topicLessonsRow}>
                    <Ionicons name="play-circle" size={13} color="#F59E0B" style={{ marginRight: 4 }} />
                    <Text style={styles.topicLessonsText}>{cat.lessonsCount} dars</Text>
                  </View>

                  {/* Bottom: Progress Bar + Percentage */}
                  <View style={styles.topicProgressRow}>
                    <View style={styles.topicProgressBarTrack}>
                      <View
                        style={[
                          styles.topicProgressBarFill,
                          {
                            width: `${cat.progress}%`,
                            backgroundColor:
                              cat.progressColor ||
                              (cat.progress >= 50 ? '#10B981' : '#F59E0B'),
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.topicProgressPercentText}>{cat.progress}%</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      ) : isViewingSchoolStore ? (
        selectedStoreDetailItem !== null ? (
          isConfirmingStoreOrder ? (
            /* ===================== CONFIRMATION SCREEN (BUYURTMANI TASDIQLASH) ===================== */
            <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 160 }}
                showsVerticalScrollIndicator={false}
              >
                {/* 1. Category-specific content */}
                {selectedStoreDetailItem.category === 'talim' ? (
                  /* ===================== TA'LIM IMTIYOZI TASDIQLASH ===================== */
                  <>
                    {/* Product Summary */}
                    <View style={styles.confirmProductCard}>
                      {selectedStoreDetailItem.image ? (
                        <Image
                          source={selectedStoreDetailItem.image}
                          style={styles.confirmProductThumb}
                          resizeMode="cover"
                        />
                      ) : (
                        <View style={[styles.confirmProductThumb, { backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' }]}>
                          <Ionicons name={(selectedStoreDetailItem.iconName as any) || 'school'} size={32} color="#2563EB" />
                        </View>
                      )}
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={styles.confirmProductTitle} numberOfLines={2}>
                          {selectedStoreDetailItem.title}
                        </Text>
                        <View style={styles.confirmProductPriceRow}>
                          <FontAwesome5 name="coins" size={13} color="#D97706" style={{ marginRight: 5 }} />
                          <Text style={[styles.confirmProductPriceMain, { color: '#2563EB' }]}>
                            {selectedStoreDetailItem.priceCoins.toLocaleString()} Coin
                          </Text>
                          <View style={[styles.confirmDiscountBadge, { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE', borderWidth: 1 }]}>
                            <Text style={[styles.confirmDiscountBadgeText, { color: '#2563EB' }]}>Ta’lim imtiyozi</Text>
                          </View>
                        </View>
                      </View>
                    </View>

                    {/* Resurs formati va kirish huquqi card */}
                    <View style={styles.confirmLocationCard}>
                      <View style={styles.confirmLocationRow}>
                        <View style={[styles.confirmLocationIconCircle, { backgroundColor: '#EFF6FF' }]}>
                          <Ionicons
                            name={
                              selectedStoreDetailItem.subcategory === 'Elektron kitoblar'
                                ? 'book-outline'
                                : selectedStoreDetailItem.subcategory === 'Seminarlar'
                                  ? 'videocam-outline'
                                  : 'person-outline'
                            }
                            size={20}
                            color="#2563EB"
                          />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.confirmLocationHeader}>Ta’lim formati</Text>
                          <Text style={styles.confirmLocationAddress}>
                            {selectedStoreDetailItem.subcategory === 'Elektron kitoblar'
                              ? 'PDF va ePub (Offline öqiş va yuklab oliş)'
                              : selectedStoreDetailItem.subcategory === 'Seminarlar'
                                ? 'Zoom onlayn jonli vebinar va video yozuv'
                                : selectedStoreDetailItem.subcategory === 'Mentorlik'
                                  ? '1-ga-1 şaxsiy ekspert konsultatsiyasi'
                                  : '30% kitob xaridi çegirmasi'}
                          </Text>
                        </View>
                        <View style={[styles.confirmFreeBadge, { backgroundColor: '#EFF6FF' }]}>
                          <Text style={[styles.confirmFreeBadgeText, { color: '#2563EB' }]}>Onlayn</Text>
                        </View>
                      </View>
                      <View style={styles.confirmMethodDivider} />
                      <View style={styles.confirmMethodRow}>
                        <View style={[styles.confirmLocationIconCircle, { backgroundColor: '#EFF6FF' }]}>
                          <Ionicons name="infinite-outline" size={20} color="#2563EB" />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.confirmLocationHeader}>Kiriş muddati</Text>
                          <Text style={styles.confirmLocationAddress}>
                            {selectedStoreDetailItem.subcategory === 'Elektron kitoblar'
                              ? 'Çeksiz muddatli (istalgan vaqtda öqiş)'
                              : selectedStoreDetailItem.subcategory === 'Mentorlik'
                                ? selectedStoreDetailItem.id.includes('60')
                                  ? '60 daqiqa yakkama-yakka sessiya'
                                  : '30 daqiqa yakkama-yakka sessiya'
                                : `${selectedStoreDetailItem.validityDays || 30} kun davomida faol`}
                          </Text>
                        </View>
                        <View style={styles.confirmFreeBadge}>
                          <Text style={styles.confirmFreeBadgeText}>Çeksiz</Text>
                        </View>
                      </View>
                    </View>

                    {/* Talaba hisobi card */}
                    <View style={styles.confirmSummaryCard}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        <Ionicons name="person-circle-outline" size={22} color="#2563EB" style={{ marginRight: 8 }} />
                        <Text style={styles.confirmSummaryHeading}>Biriktiriladigan talaba profili</Text>
                      </View>
                      <View style={styles.confirmSummaryRow}>
                        <Text style={styles.confirmSummaryLabel}>Foydalanuvçi hisobi</Text>
                        <Text style={styles.confirmSummaryValue}>{userDisplayName} (Siz)</Text>
                      </View>
                      <View style={styles.confirmSummaryRow}>
                        <Text style={styles.confirmSummaryLabel}>Faollaşuv holati</Text>
                        <Text style={[styles.confirmSummaryValue, { color: '#16A34A' }]}>Bir zumda (Avtomatik)</Text>
                      </View>
                    </View>

                    {/* To'lov summasi */}
                    <View style={styles.confirmSummaryCard}>
                      <Text style={styles.confirmSummaryHeading}>Tölov hisob-kitobi</Text>
                      <View style={styles.confirmSummaryRow}>
                        <Text style={styles.confirmSummaryLabel}>Kurs/Resurs narxi</Text>
                        <Text style={styles.confirmSummaryValue}>
                          {Math.round(selectedStoreDetailItem.priceCoins * 1.3).toLocaleString()} Coin
                        </Text>
                      </View>
                      <View style={styles.confirmSummaryRow}>
                        <Text style={styles.confirmSummaryLabel}>Maktab ta’lim granti</Text>
                        <Text style={styles.confirmSummaryDiscountValue}>
                          -{(Math.round(selectedStoreDetailItem.priceCoins * 1.3) - selectedStoreDetailItem.priceCoins).toLocaleString()} Coin
                        </Text>
                      </View>
                      <View style={styles.confirmSummaryTotalRow}>
                        <Text style={styles.confirmSummaryTotalLabel}>Jami tölov</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <FontAwesome5 name="coins" size={15} color="#D97706" style={{ marginRight: 6 }} />
                          <Text style={styles.confirmSummaryTotalValue}>
                            {selectedStoreDetailItem.priceCoins.toLocaleString()} Coin
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Notice box */}
                    <View style={[styles.confirmNoticeBox, { backgroundColor: '#EFF6FF', borderColor: '#DBEAFE' }]}>
                      <Ionicons name="information-circle-outline" size={20} color="#2563EB" style={{ marginRight: 8, marginTop: 1 }} />
                      <Text style={[styles.confirmNoticeText, { color: '#1E40AF' }]}>
                        Uşbu ta’lim resursi tasdiqlangandan söng profilingizda bir zumda oçiladi va siz materiallardan darhol çeksiz foydalanişingiz mumkin.
                      </Text>
                    </View>
                  </>
                ) : selectedStoreDetailItem.category === 'hamkorlar' ? (
                  /* ===================== HAMKOR KUPONI TASDIQLASH ===================== */
                  <>
                    {/* Partner Product Summary */}
                    <View style={styles.confirmProductCard}>
                      {selectedStoreDetailItem.image ? (
                        <Image
                          source={selectedStoreDetailItem.image}
                          style={styles.confirmProductThumb}
                          resizeMode="cover"
                        />
                      ) : (
                        <View style={[styles.confirmProductThumb, { backgroundColor: '#FAF5FF', alignItems: 'center', justifyContent: 'center' }]}>
                          <Ionicons name={(selectedStoreDetailItem.iconName as any) || 'gift'} size={32} color="#7C3AED" />
                        </View>
                      )}
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={styles.confirmProductTitle} numberOfLines={2}>
                          {selectedStoreDetailItem.partnerName || selectedStoreDetailItem.title}
                        </Text>
                        <Text style={{ fontSize: 12, color: '#64748B', marginBottom: 4 }} numberOfLines={1}>
                          {selectedStoreDetailItem.discountCondition || 'Chegirma kuponi'}
                        </Text>
                        <View style={styles.confirmProductPriceRow}>
                          <FontAwesome5 name="coins" size={13} color="#D97706" style={{ marginRight: 5 }} />
                          <Text style={styles.confirmProductPriceMain}>
                            {selectedStoreDetailItem.priceCoins.toLocaleString()} Coin
                          </Text>
                          <View style={styles.confirmDiscountBadge}>
                            <Text style={styles.confirmDiscountBadgeText}>{selectedStoreDetailItem.discountTitle || '20%'}</Text>
                          </View>
                        </View>
                      </View>
                    </View>

                    {/* Kupon ma'lumotlari card */}
                    <View style={styles.confirmLocationCard}>
                      <View style={styles.confirmLocationRow}>
                        <View style={styles.confirmLocationIconCircle}>
                          <Ionicons name="storefront-outline" size={20} color="#7C3AED" />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.confirmLocationHeader}>Hamkor taşkilot</Text>
                          <Text style={styles.confirmLocationAddress}>
                            {selectedStoreDetailItem.partnerName || 'Book House'} dökonlari
                          </Text>
                        </View>
                        <View style={styles.confirmFreeBadge}>
                          <Text style={styles.confirmFreeBadgeText}>Hamkor</Text>
                        </View>
                      </View>
                      <View style={styles.confirmMethodDivider} />
                      <View style={styles.confirmMethodRow}>
                        <View style={styles.confirmLocationIconCircle}>
                          <Ionicons name="calendar-outline" size={20} color="#7C3AED" />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.confirmLocationHeader}>Amal qiliş muddati</Text>
                          <Text style={styles.confirmLocationAddress}>
                            Tasdiqlangan kundan boşlab {selectedStoreDetailItem.validityDays || 30} kun
                          </Text>
                        </View>
                        <View style={styles.confirmFreeBadge}>
                          <Text style={styles.confirmFreeBadgeText}>{selectedStoreDetailItem.validityDays || 30} kun</Text>
                        </View>
                      </View>
                    </View>

                    {/* Kupon shartlari */}
                    <View style={styles.confirmSummaryCard}>
                      <Text style={styles.confirmSummaryHeading}>Kupon şartlari va qoidalari</Text>
                      <View style={styles.detailBoxCheckItem}>
                        <Ionicons name="checkmark-circle" size={16} color="#7C3AED" style={{ marginRight: 8 }} />
                        <Text style={styles.detailBoxCheckText}>
                          {selectedStoreDetailItem.discountCondition || '100 000 so‘mdan yuqori xaridlar uchun amal qiladi'}
                        </Text>
                      </View>
                      <View style={styles.detailBoxCheckItem}>
                        <Ionicons name="checkmark-circle" size={16} color="#7C3AED" style={{ marginRight: 8 }} />
                        <Text style={styles.detailBoxCheckText}>Bir marta foydalaniş mumkin</Text>
                      </View>
                      <View style={styles.detailBoxCheckItem}>
                        <Ionicons name="checkmark-circle" size={16} color="#7C3AED" style={{ marginRight: 8 }} />
                        <Text style={styles.detailBoxCheckText}>Hamkor filiallarida kassirga taqdim etiladi</Text>
                      </View>
                    </View>

                    {/* To'lov summasi */}
                    <View style={styles.confirmSummaryCard}>
                      <Text style={styles.confirmSummaryHeading}>Tölov hisob-kitobi</Text>
                      <View style={styles.confirmSummaryRow}>
                        <Text style={styles.confirmSummaryLabel}>Kupon narxi</Text>
                        <Text style={styles.confirmSummaryValue}>
                          {selectedStoreDetailItem.priceCoins.toLocaleString()} Coin
                        </Text>
                      </View>
                      <View style={styles.confirmSummaryRow}>
                        <Text style={styles.confirmSummaryLabel}>Mavjud balansingiz</Text>
                        <Text style={styles.confirmSummaryValue}>
                          {userCoinsBalance.toLocaleString()} Coin
                        </Text>
                      </View>
                      <View style={styles.confirmSummaryTotalRow}>
                        <Text style={styles.confirmSummaryTotalLabel}>Jami tölov</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <FontAwesome5 name="coins" size={15} color="#D97706" style={{ marginRight: 6 }} />
                          <Text style={styles.confirmSummaryTotalValue}>
                            {selectedStoreDetailItem.priceCoins.toLocaleString()} Coin
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Notice box */}
                    <View style={styles.confirmNoticeBox}>
                      <Ionicons name="information-circle-outline" size={20} color="#7C3AED" style={{ marginRight: 8, marginTop: 1 }} />
                      <Text style={styles.confirmNoticeText}>
                        Kupon xarid qilingaç, sizga maxsus kod taqdim etiladi. Kassada uşbu kodni körsatib çegirmaga ega bölasiz.
                      </Text>
                    </View>
                  </>
                ) : (
                  /* ===================== MAXSUS SOVG'ALAR TASDIQLASH (PHYSICAL GOODS) ===================== */
                  <>
                    {/* 1. Product Summary Card */}
                    <View style={styles.confirmProductCard}>
                      {selectedStoreDetailItem.image ? (
                        <Image
                          source={selectedStoreDetailItem.image}
                          style={styles.confirmProductThumb}
                          resizeMode="cover"
                        />
                      ) : (
                        <View style={[styles.confirmProductThumb, { backgroundColor: '#EDE9FE', alignItems: 'center', justifyContent: 'center' }]}>
                          <Ionicons name={selectedStoreDetailItem.iconName as any} size={32} color={selectedStoreDetailItem.iconColor} />
                        </View>
                      )}
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={styles.confirmProductTitle} numberOfLines={2}>
                          {selectedStoreDetailItem.title}
                        </Text>
                        <View style={styles.confirmProductPriceRow}>
                          <FontAwesome5 name="coins" size={13} color="#D97706" style={{ marginRight: 5 }} />
                          <Text style={styles.confirmProductPriceMain}>
                            {selectedStoreDetailItem.priceCoins.toLocaleString()} Coin
                          </Text>
                          <Text style={styles.confirmProductPriceOld}>
                            {Math.round(selectedStoreDetailItem.priceCoins * 1.25).toLocaleString()} Coin
                          </Text>
                          <View style={styles.confirmDiscountBadge}>
                            <Text style={styles.confirmDiscountBadgeText}>-20%</Text>
                          </View>
                        </View>
                      </View>
                    </View>

                    {/* 2. Quantity Selector Row */}
                    <View style={styles.confirmQtyRow}>
                      <Text style={styles.confirmQtyLabel}>Soni</Text>
                      <View style={styles.confirmQtyCounter}>
                        <TouchableOpacity
                          style={styles.confirmQtyBtn}
                          activeOpacity={0.7}
                          onPress={() => setOrderQuantity((q) => Math.max(1, q - 1))}
                        >
                          <Ionicons name="remove" size={16} color="#0F172A" />
                        </TouchableOpacity>
                        <Text style={styles.confirmQtyNumber}>{orderQuantity}</Text>
                        <TouchableOpacity
                          style={styles.confirmQtyBtn}
                          activeOpacity={0.7}
                          onPress={() => setOrderQuantity((q) => Math.min(5, q + 1))}
                        >
                          <Ionicons name="add" size={16} color="#0F172A" />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* 3. Olish joyi (Joylashuv) - strictly NO DELIVERY, only Location */}
                    <View style={styles.confirmLocationCard}>
                      <View style={styles.confirmLocationRow}>
                        <View style={styles.confirmLocationIconCircle}>
                          <Ionicons name="location-outline" size={20} color="#0F172A" />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.confirmLocationHeader}>Oliş joyi (Joylaşuvi)</Text>
                          <Text style={styles.confirmLocationAddress}>
                            Toşkent ş., Çilonzor tumani, Bunyodkor köçasi, 15-uy
                          </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
                      </View>
                      <View style={styles.confirmMethodDivider} />
                      <View style={styles.confirmMethodRow}>
                        <View style={styles.confirmLocationIconCircle}>
                          <Ionicons name="business-outline" size={20} color="#0F172A" />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.confirmLocationHeader}>Olib ketiş usuli</Text>
                          <Text style={styles.confirmLocationAddress}>Maktab qabul punktidan (1-3 iş kuni)</Text>
                        </View>
                        <View style={styles.confirmFreeBadge}>
                          <Text style={styles.confirmFreeBadgeText}>Bepul</Text>
                        </View>
                      </View>
                    </View>

                    {/* 4. Buyurtma summasi */}
                    <View style={styles.confirmSummaryCard}>
                      <Text style={styles.confirmSummaryHeading}>Buyurtma summasi</Text>

                      <View style={styles.confirmSummaryRow}>
                        <Text style={styles.confirmSummaryLabel}>Mahsulot narxi</Text>
                        <Text style={styles.confirmSummaryValue}>
                          {(Math.round(selectedStoreDetailItem.priceCoins * 1.25) * orderQuantity).toLocaleString()} Coin
                        </Text>
                      </View>

                      <View style={styles.confirmSummaryRow}>
                        <Text style={styles.confirmSummaryLabel}>Çegirma (20%)</Text>
                        <Text style={styles.confirmSummaryDiscountValue}>
                          -{((Math.round(selectedStoreDetailItem.priceCoins * 1.25) - selectedStoreDetailItem.priceCoins) * orderQuantity).toLocaleString()} Coin
                        </Text>
                      </View>

                      <View style={styles.confirmSummaryTotalRow}>
                        <Text style={styles.confirmSummaryTotalLabel}>Jami tölov</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <FontAwesome5 name="coins" size={15} color="#D97706" style={{ marginRight: 6 }} />
                          <Text style={styles.confirmSummaryTotalValue}>
                            {(selectedStoreDetailItem.priceCoins * orderQuantity).toLocaleString()} Coin
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* 5. Info notice box */}
                    <View style={styles.confirmNoticeBox}>
                      <Ionicons name="information-circle-outline" size={20} color="#7C3AED" style={{ marginRight: 8, marginTop: 1 }} />
                      <Text style={styles.confirmNoticeText}>
                        Buyurtmangiz tasdiqlangandan söng, 1-3 iş kuni içida operator siz bilan boğlanadi yoki körsatilgan joydan olib ketişingiz mumkin.
                      </Text>
                    </View>
                  </>
                )}
              </ScrollView>

              {/* Sticky Bottom Buttons Bar - PINNED TO BOTTOM */}
              <View style={[styles.confirmStickyBottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
                <TouchableOpacity
                  style={[
                    styles.confirmSubmitBtn,
                    selectedStoreDetailItem.category === 'talim' && { backgroundColor: '#2563EB' },
                  ]}
                  activeOpacity={0.85}
                  onPress={handleConfirmOrderSubmit}
                >
                  <FontAwesome5 name="coins" size={15} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text style={styles.confirmSubmitBtnText}>
                    {selectedStoreDetailItem.category === 'talim'
                      ? `${selectedStoreDetailItem.priceCoins.toLocaleString()} Coin • Imtiyozni tasdiqlash`
                      : selectedStoreDetailItem.category === 'hamkorlar'
                        ? `${selectedStoreDetailItem.priceCoins.toLocaleString()} Coin • Kuponni tasdiqlash`
                        : `${(selectedStoreDetailItem.priceCoins * orderQuantity).toLocaleString()} Coin • Buyurtmani tasdiqlash`}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.confirmCancelBtn}
                  activeOpacity={0.7}
                  onPress={() => setIsConfirmingStoreOrder(false)}
                >
                  <Text style={styles.confirmCancelBtnText}>Bekor qiliş</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            /* ===================== PRODUCT DETAIL SCREEN ===================== */
            <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 110 }}
                showsVerticalScrollIndicator={false}
              >
                {/* 1. Hero Showcase Image Card - Covers entire rectangle with resizeMode="cover" */}
                <View style={styles.detailHeroCard}>
                  {selectedStoreDetailItem.image ? (
                    <Image
                      source={selectedStoreDetailItem.image}
                      style={styles.detailHeroMainImg}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.detailHeroFallbackWrap}>
                      <Ionicons
                        name={selectedStoreDetailItem.iconName as any}
                        size={84}
                        color={selectedStoreDetailItem.iconColor || '#7C3AED'}
                      />
                    </View>
                  )}

                  {/* Top Left Badge */}
                  {selectedStoreDetailItem.category === 'hamkorlar' ? (
                    <View style={styles.detailHeroPartnerBadge}>
                      <Text style={styles.detailHeroPartnerBadgeText}>Hamkorlar taklifi</Text>
                    </View>
                  ) : selectedStoreDetailItem.category === 'talim' ? (
                    <View style={styles.detailHeroTalimBadge}>
                      <Ionicons name="school" size={13} color="#FFFFFF" style={{ marginRight: 4 }} />
                      <Text style={styles.detailHeroTalimBadgeText}>Ta’lim imtiyozi</Text>
                    </View>
                  ) : (
                    <View style={styles.detailHeroDiscountBadge}>
                      <Ionicons name="flame" size={13} color="#FFFFFF" style={{ marginRight: 4 }} />
                      <Text style={styles.detailHeroDiscountBadgeText}>
                        {selectedStoreDetailItem.discountTitle || '-20% Chegirma'}
                      </Text>
                    </View>
                  )}

                  {/* Top Right Action Buttons: Heart + Share */}
                  <View style={styles.detailHeroActionsRow}>
                    <TouchableOpacity
                      style={styles.detailHeroCircleBtn}
                      activeOpacity={0.7}
                      onPress={() => toggleStoreFavorite(selectedStoreDetailItem.id)}
                    >
                      <Ionicons
                        name={storeFavorites.includes(selectedStoreDetailItem.id) ? 'heart' : 'heart-outline'}
                        size={19}
                        color={storeFavorites.includes(selectedStoreDetailItem.id) ? '#EF4444' : '#0F172A'}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.detailHeroCircleBtn}
                      activeOpacity={0.7}
                      onPress={() =>
                        Alert.alert('Ulaşiş', `"${selectedStoreDetailItem.title}" do‘stlaringiz bilan ulashildi!`)
                      }
                    >
                      <Ionicons name="share-social-outline" size={18} color="#0F172A" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* 2. CATEGORY SPECIFIC CONTENT */}
                {selectedStoreDetailItem.category === 'talim' ? (
                  /* ======================= TA'LIM IMTIYOZLARI (DIGITAL EDUCATION) ======================= */
                  <>
                    <Text style={styles.detailMainTitle}>
                      {selectedStoreDetailItem.title}
                    </Text>
                    <Text style={styles.detailMainSubtitle}>
                      {selectedStoreDetailItem.subcategory} • {selectedStoreDetailItem.desc}
                    </Text>

                    {/* Price Row with Digital Badge */}
                    <View style={styles.detailPriceRow}>
                      <FontAwesome5 name="coins" size={20} color="#D97706" style={{ marginRight: 8 }} />
                      <Text style={[styles.detailPriceMain, { color: '#2563EB' }]}>
                        {selectedStoreDetailItem.priceCoins.toLocaleString()} Coin
                      </Text>
                      <View style={styles.detailTalimSpeedBadge}>
                        <Ionicons name="flash" size={12} color="#2563EB" style={{ marginRight: 4 }} />
                        <Text style={styles.detailTalimSpeedBadgeText}>Raqamli ta’lim resursi</Text>
                      </View>
                    </View>

                    {/* 3 Info Boxes */}
                    <View style={styles.detailInfoBoxesRow}>
                      <View style={[styles.detailInfoBoxItem, { backgroundColor: '#EFF6FF', borderColor: '#DBEAFE' }]}>
                        <View style={[styles.detailInfoBoxIconWrap, { backgroundColor: '#DBEAFE' }]}>
                          <Ionicons
                            name={
                              selectedStoreDetailItem.subcategory === 'Elektron kitoblar'
                                ? 'book-outline'
                                : selectedStoreDetailItem.subcategory === 'Seminarlar'
                                  ? 'videocam-outline'
                                  : selectedStoreDetailItem.subcategory === 'Mentorlik'
                                    ? 'person-outline'
                                    : 'pricetag-outline'
                            }
                            size={16}
                            color="#2563EB"
                          />
                        </View>
                        <Text style={styles.detailInfoBoxLabel}>Formati</Text>
                        <Text style={[styles.detailInfoBoxVal, { color: '#1E40AF', fontSize: 13 }]}>
                          {selectedStoreDetailItem.subcategory === 'Elektron kitoblar'
                            ? 'PDF / ePub'
                            : selectedStoreDetailItem.subcategory === 'Seminarlar'
                              ? 'Zoom onlayn'
                              : selectedStoreDetailItem.subcategory === 'Mentorlik'
                                ? '1-ga-1 onlayn'
                                : '30% kupon'}
                        </Text>
                      </View>
                      <View style={[styles.detailInfoBoxItem, { backgroundColor: '#EFF6FF', borderColor: '#DBEAFE' }]}>
                        <View style={[styles.detailInfoBoxIconWrap, { backgroundColor: '#DBEAFE' }]}>
                          <FontAwesome5 name="coins" size={13} color="#2563EB" />
                        </View>
                        <Text style={styles.detailInfoBoxLabel}>Narxi</Text>
                        <Text style={[styles.detailInfoBoxVal, { color: '#1E40AF' }]}>
                          {selectedStoreDetailItem.priceCoins} Coin
                        </Text>
                      </View>
                      <View style={[styles.detailInfoBoxItem, { backgroundColor: '#EFF6FF', borderColor: '#DBEAFE' }]}>
                        <View style={[styles.detailInfoBoxIconWrap, { backgroundColor: '#DBEAFE' }]}>
                          <Ionicons
                            name={
                              selectedStoreDetailItem.subcategory === 'Elektron kitoblar'
                                ? 'infinite-outline'
                                : selectedStoreDetailItem.subcategory === 'Mentorlik'
                                  ? 'time-outline'
                                  : 'calendar-outline'
                            }
                            size={16}
                            color="#2563EB"
                          />
                        </View>
                        <Text style={styles.detailInfoBoxLabel}>
                          {selectedStoreDetailItem.subcategory === 'Mentorlik' ? 'Davomiyligi' : 'Kiriş muddati'}
                        </Text>
                        <Text style={[styles.detailInfoBoxVal, { color: '#1E40AF', fontSize: 13 }]}>
                          {selectedStoreDetailItem.subcategory === 'Elektron kitoblar'
                            ? 'Çeksiz'
                            : selectedStoreDetailItem.subcategory === 'Mentorlik'
                              ? selectedStoreDetailItem.id.includes('60')
                                ? '60 daqiqa'
                                : '30 daqiqa'
                              : `${selectedStoreDetailItem.validityDays || 30} kun`}
                        </Text>
                      </View>
                    </View>

                    {/* Educational Academic Banner */}
                    <View style={styles.detailTalimBanner}>
                      <View style={styles.detailTalimBannerIcon}>
                        <Ionicons name="school" size={22} color="#FFFFFF" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.detailTalimBannerTitle}>
                          Huquq maktabi akademik resursi
                        </Text>
                        <Text style={styles.detailTalimBannerSub}>
                          Materiallar Özbekiston Respublikasi yetakçi huquqşunoslari tomonidan tasdiqlangan
                        </Text>
                      </View>
                    </View>

                    {/* 4 Feature Pills */}
                    <View style={styles.detailFeaturesRow}>
                      <View style={[styles.detailFeaturePill, { backgroundColor: '#EFF6FF' }]}>
                        <Ionicons name="phone-portrait-outline" size={17} color="#2563EB" />
                        <Text style={styles.detailFeatureTitle}>Mobil va planşet</Text>
                      </View>
                      <View style={[styles.detailFeaturePill, { backgroundColor: '#EFF6FF' }]}>
                        <Ionicons name="cloud-download-outline" size={17} color="#2563EB" />
                        <Text style={styles.detailFeatureTitle}>Offline öqiş</Text>
                      </View>
                      <View style={[styles.detailFeaturePill, { backgroundColor: '#EFF6FF' }]}>
                        <Ionicons name="shield-checkmark-outline" size={17} color="#2563EB" />
                        <Text style={styles.detailFeatureTitle}>Rasmiy manba</Text>
                      </View>
                      <View style={[styles.detailFeaturePill, { backgroundColor: '#EFF6FF' }]}>
                        <Ionicons name="sparkles-outline" size={17} color="#2563EB" />
                        <Text style={styles.detailFeatureTitle}>Amaliy tahlil</Text>
                      </View>
                    </View>

                    {/* Description Section */}
                    <View style={styles.detailSectionContainer}>
                      <View style={styles.detailSectionHeader}>
                        <Ionicons name="information-circle-outline" size={18} color="#0F172A" style={{ marginRight: 6 }} />
                        <Text style={styles.detailSectionTitle}>Batafsil tavsif</Text>
                      </View>
                      <Text style={styles.detailDescParagraph}>{selectedStoreDetailItem.desc}</Text>
                    </View>

                    {/* Dastur mazmuni va afzalliklari */}
                    <View style={styles.detailSectionContainer}>
                      <View style={styles.detailSectionHeader}>
                        <Ionicons name="checkmark-done-circle" size={18} color="#2563EB" style={{ marginRight: 6 }} />
                        <Text style={styles.detailSectionTitle}>Dastur mazmuni va afzalliklari</Text>
                      </View>
                      {selectedStoreDetailItem.subcategory === 'Elektron kitoblar' ? (
                        <>
                          <View style={styles.detailBoxCheckItem}>
                            <Ionicons name="checkmark-circle" size={17} color="#2563EB" style={{ marginRight: 8 }} />
                            <Text style={styles.detailBoxCheckText}>Yangi tahrirdagi moddalar va amaliy huquqiy şarhlar</Text>
                          </View>
                          <View style={styles.detailBoxCheckItem}>
                            <Ionicons name="checkmark-circle" size={17} color="#2563EB" style={{ marginRight: 8 }} />
                            <Text style={styles.detailBoxCheckText}>Sud pretsedentlari va amaliy keyslar tahlili</Text>
                          </View>
                          <View style={styles.detailBoxCheckItem}>
                            <Ionicons name="checkmark-circle" size={17} color="#2563EB" style={{ marginRight: 8 }} />
                            <Text style={styles.detailBoxCheckText}>Qulay qidiruv va elektron mundarija tizimi</Text>
                          </View>
                          <View style={styles.detailBoxCheckItem}>
                            <Ionicons name="checkmark-circle" size={17} color="#2563EB" style={{ marginRight: 8 }} />
                            <Text style={styles.detailBoxCheckText}>Çeksiz muddatli foydalaniş va qayta yuklab oliş</Text>
                          </View>
                        </>
                      ) : selectedStoreDetailItem.subcategory === 'Seminarlar' ? (
                        <>
                          <View style={styles.detailBoxCheckItem}>
                            <Ionicons name="checkmark-circle" size={17} color="#2563EB" style={{ marginRight: 8 }} />
                            <Text style={styles.detailBoxCheckText}>Tajribali advokat va soha mutaxassisi bilan yopiq vebinar</Text>
                          </View>
                          <View style={styles.detailBoxCheckItem}>
                            <Ionicons name="checkmark-circle" size={17} color="#2563EB" style={{ marginRight: 8 }} />
                            <Text style={styles.detailBoxCheckText}>Iştirokçilarning huquqiy savollariga jonli javoblar</Text>
                          </View>
                          <View style={styles.detailBoxCheckItem}>
                            <Ionicons name="checkmark-circle" size={17} color="#2563EB" style={{ marginRight: 8 }} />
                            <Text style={styles.detailBoxCheckText}>Vebinar videoyozuviga çeksiz kiriş imkoniyati</Text>
                          </View>
                        </>
                      ) : selectedStoreDetailItem.subcategory === 'Mentorlik' ? (
                        <>
                          <View style={styles.detailBoxCheckItem}>
                            <Ionicons name="checkmark-circle" size={17} color="#2563EB" style={{ marginRight: 8 }} />
                            <Text style={styles.detailBoxCheckText}>1-ga-1 formatdagi individual konsultatsiya</Text>
                          </View>
                          <View style={styles.detailBoxCheckItem}>
                            <Ionicons name="checkmark-circle" size={17} color="#2563EB" style={{ marginRight: 8 }} />
                            <Text style={styles.detailBoxCheckText}>Karyera rejalaştiriş, grantlar va şartnomalar tahlili</Text>
                          </View>
                          <View style={styles.detailBoxCheckItem}>
                            <Ionicons name="checkmark-circle" size={17} color="#2563EB" style={{ marginRight: 8 }} />
                            <Text style={styles.detailBoxCheckText}>Yuridik hujjatlar va keyslarni ekspert körigidan ötkaziş</Text>
                          </View>
                        </>
                      ) : (
                        <>
                          <View style={styles.detailBoxCheckItem}>
                            <Ionicons name="checkmark-circle" size={17} color="#2563EB" style={{ marginRight: 8 }} />
                            <Text style={styles.detailBoxCheckText}>Hamkor kitob dökonlaridan istalgan kitobga 30% çegirma</Text>
                          </View>
                          <View style={styles.detailBoxCheckItem}>
                            <Ionicons name="checkmark-circle" size={17} color="#2563EB" style={{ marginRight: 8 }} />
                            <Text style={styles.detailBoxCheckText}>Barça yuridik va öquv adabiyotlariga amal qiladi</Text>
                          </View>
                        </>
                      )}
                    </View>

                    {/* Ekspert va ta'lim manbasi */}
                    <View style={styles.detailSectionContainer}>
                      <View style={styles.detailSectionHeader}>
                        <Ionicons name="ribbon-outline" size={18} color="#0F172A" style={{ marginRight: 6 }} />
                        <Text style={styles.detailSectionTitle}>Ekspert va ta’lim manbasi</Text>
                      </View>
                      <View style={styles.detailTalimExpertCard}>
                        <View style={styles.detailTalimExpertIconWrap}>
                          <Ionicons name="school" size={24} color="#2563EB" />
                        </View>
                        <View style={{ flex: 1 }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.detailTalimExpertName}>
                              Huquq maktabi ilmiy kengaşi
                            </Text>
                            <Ionicons name="checkmark-circle" size={15} color="#2563EB" style={{ marginLeft: 5 }} />
                          </View>
                          <Text style={styles.detailTalimExpertRole}>
                            Toşkent davlat yuridik universiteti professorlari va amaliyotçi advokatlar
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Foydalanish tartibi (Digital delivery - no physical pickup) */}
                    <View style={styles.detailSectionContainer}>
                      <View style={styles.detailSectionHeader}>
                        <Ionicons name="flash-outline" size={18} color="#0F172A" style={{ marginRight: 6 }} />
                        <Text style={styles.detailSectionTitle}>Foydalaniş tartibi</Text>
                      </View>
                      <View style={styles.detailTalimUsageCard}>
                        <View style={styles.detailTalimUsageStep}>
                          <View style={styles.detailTalimUsageNum}><Text style={styles.detailTalimUsageNumText}>1</Text></View>
                          <Text style={styles.detailTalimUsageText}>Coinlar evaziga ta’lim imtiyozini faollaştirasiz.</Text>
                        </View>
                        <View style={styles.detailTalimUsageStep}>
                          <View style={styles.detailTalimUsageNum}><Text style={styles.detailTalimUsageNumText}>2</Text></View>
                          <Text style={styles.detailTalimUsageText}>Resurs darhol profilingizda çeksiz foydalaniş uçun oçiladi.</Text>
                        </View>
                        <View style={styles.detailTalimUsageStep}>
                          <View style={styles.detailTalimUsageNum}><Text style={styles.detailTalimUsageNumText}>3</Text></View>
                          <Text style={styles.detailTalimUsageText}>Elektron kitoblarni öqiş, vebinarga ulaniş yoki mentor bilan boğlaniş imkoniyati beriladi.</Text>
                        </View>
                      </View>
                    </View>

                    {/* If purchased: Unlocked Educational Actions Card */}
                    {purchasedStoreItems.includes(selectedStoreDetailItem.id) && (
                      <View style={styles.detailTalimUnlockedCard}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                          <Ionicons name="checkmark-circle" size={24} color="#16A34A" style={{ marginRight: 8 }} />
                          <View>
                            <Text style={styles.detailTalimUnlockedTitle}>Imtiyoz faol holatda! 🎉</Text>
                            <Text style={styles.detailTalimUnlockedSub}>Siz uşbu resursdan töliq foydalanişingiz mumkin</Text>
                          </View>
                        </View>
                        {selectedStoreDetailItem.subcategory === 'Elektron kitoblar' ? (
                          <View style={styles.detailTalimActionBtnsRow}>
                            <TouchableOpacity
                              style={[styles.detailTalimActionBtn, { backgroundColor: '#2563EB' }]}
                              activeOpacity={0.8}
                              onPress={() => Alert.alert('Kitob oçilmoqda', `"${selectedStoreDetailItem.title}" elektron o‘quvchi rejimida ochilmoqda.`)}
                            >
                              <Ionicons name="book" size={17} color="#FFFFFF" style={{ marginRight: 6 }} />
                              <Text style={styles.detailTalimActionBtnText}>Kitobni öqiş</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[styles.detailTalimActionBtn, { backgroundColor: '#0284C7' }]}
                              activeOpacity={0.8}
                              onPress={() => Alert.alert('Yuklab oliş', `"${selectedStoreDetailItem.title}" PDF fayli qurilmangizga yuklab olindi.`)}
                            >
                              <Ionicons name="download" size={17} color="#FFFFFF" style={{ marginRight: 6 }} />
                              <Text style={styles.detailTalimActionBtnText}>PDF yuklaş</Text>
                            </TouchableOpacity>
                          </View>
                        ) : selectedStoreDetailItem.subcategory === 'Seminarlar' ? (
                          <TouchableOpacity
                            style={[styles.detailTalimActionBtnFull, { backgroundColor: '#2563EB' }]}
                            activeOpacity={0.8}
                            onPress={() => Alert.alert('Vebinarga kiriş', `Zoom xonasi havolasi: https://zoom.us/j/huquqmaktabi\n\nVebinar boshlanish vaqti bildirishnomada ko‘rsatiladi.`)}
                          >
                            <Ionicons name="videocam" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                            <Text style={styles.detailTalimActionBtnText}>Zoom orqali vebinarga ulaniş</Text>
                          </TouchableOpacity>
                        ) : selectedStoreDetailItem.subcategory === 'Mentorlik' ? (
                          <TouchableOpacity
                            style={[styles.detailTalimActionBtnFull, { backgroundColor: '#2563EB' }]}
                            activeOpacity={0.8}
                            onPress={() => Alert.alert('Mentor bilan boğlaniş', `Mutaxassis bilan aloqa uchun maxsus Telegram bot: @HuquqMaktabiMentorBot\nSizning vaucher kodingiz: ${selectedStoreDetailItem.couponCode || 'MENTOR-VIP'}`)}
                          >
                            <Ionicons name="chatbubbles" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                            <Text style={styles.detailTalimActionBtnText}>Mutaxassis bilan boğlaniş</Text>
                          </TouchableOpacity>
                        ) : (
                          <View style={styles.detailPurchasedCodeRow}>
                            <Text style={styles.detailPurchasedCodeText}>
                              {selectedStoreDetailItem.couponCode || 'KITOB-TALIM-30'}
                            </Text>
                            <TouchableOpacity
                              style={styles.detailCopyCodeBtn}
                              activeOpacity={0.7}
                              onPress={() => Alert.alert('Nusxalandi', 'Kupon kodi muvaffaqiyatli nusxalandi!')}
                            >
                              <Ionicons name="copy-outline" size={16} color="#2563EB" style={{ marginRight: 4 }} />
                              <Text style={[styles.detailCopyCodeText, { color: '#2563EB' }]}>Nusxa oliş</Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    )}
                  </>
                ) : selectedStoreDetailItem.category === 'hamkorlar' ? (
                  /* ======================= HAMKORLAR TAKLIFLARI (IMAGE 2) ======================= */
                  <>
                    <Text style={styles.detailMainTitle}>
                      {selectedStoreDetailItem.partnerName || selectedStoreDetailItem.title}
                    </Text>
                    <Text style={styles.detailMainSubtitle}>
                      {selectedStoreDetailItem.discountCondition || selectedStoreDetailItem.desc}
                    </Text>

                    {/* 3 Info Boxes */}
                    <View style={styles.detailInfoBoxesRow}>
                      <View style={styles.detailInfoBoxItem}>
                        <View style={styles.detailInfoBoxIconWrap}>
                          <Ionicons name="pricetag-outline" size={16} color="#7C3AED" />
                        </View>
                        <Text style={styles.detailInfoBoxLabel}>Çegirma</Text>
                        <Text style={styles.detailInfoBoxVal}>{selectedStoreDetailItem.discountTitle || '20%'}</Text>
                      </View>
                      <View style={styles.detailInfoBoxItem}>
                        <View style={styles.detailInfoBoxIconWrap}>
                          <FontAwesome5 name="coins" size={13} color="#7C3AED" />
                        </View>
                        <Text style={styles.detailInfoBoxLabel}>Kupon narxi</Text>
                        <Text style={styles.detailInfoBoxVal}>{selectedStoreDetailItem.priceCoins} Coin</Text>
                      </View>
                      <View style={styles.detailInfoBoxItem}>
                        <View style={styles.detailInfoBoxIconWrap}>
                          <Ionicons name="calendar-outline" size={16} color="#7C3AED" />
                        </View>
                        <Text style={styles.detailInfoBoxLabel}>Amal qiliş muddati</Text>
                        <Text style={styles.detailInfoBoxVal}>{selectedStoreDetailItem.validityDays || 30} kun</Text>
                      </View>
                    </View>

                    {/* Purple Gift Promo Banner */}
                    <TouchableOpacity
                      style={styles.detailGiftPromoBanner}
                      activeOpacity={0.8}
                      onPress={() =>
                        Alert.alert(
                          'Hamkor taklifi',
                          'Uşbu vauçer orqali kitob va ta’lim resurslaridan unumli foydalaning.'
                        )
                      }
                    >
                      <View style={styles.detailGiftPromoIcon}>
                        <Ionicons name="gift" size={22} color="#FFFFFF" />
                      </View>
                      <Text style={styles.detailGiftPromoText} numberOfLines={2}>
                        Huquq, biznes va şaxsiy rivojlaniş kitoblarida çegirma oling!
                      </Text>
                      <Ionicons name="chevron-forward" size={18} color="#7C3AED" />
                    </TouchableOpacity>

                    {/* Tavsif */}
                    <View style={styles.detailSectionContainer}>
                      <View style={styles.detailSectionHeader}>
                        <Ionicons name="list" size={17} color="#0F172A" style={{ marginRight: 6 }} />
                        <Text style={styles.detailSectionTitle}>Tavsif</Text>
                      </View>
                      <Text style={styles.detailDescParagraph}>{selectedStoreDetailItem.desc}</Text>
                    </View>

                    {/* Kupon shartlari */}
                    {selectedStoreDetailItem.terms && selectedStoreDetailItem.terms.length > 0 && (
                      <View style={styles.detailSectionContainer}>
                        <View style={styles.detailSectionHeader}>
                          <Ionicons name="document-text" size={17} color="#0F172A" style={{ marginRight: 6 }} />
                          <Text style={styles.detailSectionTitle}>Kupon şartlari</Text>
                        </View>
                        {selectedStoreDetailItem.terms.map((term, idx) => (
                          <View key={idx} style={styles.detailBoxCheckItem}>
                            <Ionicons name="checkmark-circle" size={17} color="#7C3AED" style={{ marginRight: 8 }} />
                            <Text style={styles.detailBoxCheckText}>{term}</Text>
                          </View>
                        ))}
                      </View>
                    )}

                    {/* Foydalanish joylari */}
                    <View style={styles.detailSectionContainer}>
                      <View style={[styles.detailSectionHeader, { justifyContent: 'space-between' }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Ionicons name="location" size={17} color="#0F172A" style={{ marginRight: 6 }} />
                          <Text style={styles.detailSectionTitle}>Foydalaniş joylari</Text>
                        </View>
                        <TouchableOpacity activeOpacity={0.7} onPress={() => Alert.alert('Filiallar', 'Barça filiallar röyxati.')}>
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.detailSeeAllSmall}>Barçasini köriş</Text>
                            <Ionicons name="chevron-forward" size={12} color="#64748B" />
                          </View>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.detailPartnerBranchCard}>
                        {selectedStoreDetailItem.image && (
                          <Image
                            source={selectedStoreDetailItem.image}
                            style={styles.detailPartnerBranchThumb}
                            resizeMode="cover"
                          />
                        )}
                        <View style={{ flex: 1 }}>
                          <Text style={styles.detailPartnerBranchTitle}>
                            {selectedStoreDetailItem.partnerName || 'Book House (Toshkent)'}
                          </Text>
                          <Text style={styles.detailPartnerBranchSub}>Çilonzor, Bunyodkor köçasi, 15</Text>
                        </View>
                        <TouchableOpacity
                          style={styles.detailPartnerBranchNavBtn}
                          activeOpacity={0.7}
                          onPress={() => Alert.alert('Xarita', 'Xarita ilovasi oçilmoqda.')}
                        >
                          <Ionicons name="navigate" size={16} color="#FFFFFF" />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Hamkor haqida */}
                    <View style={styles.detailSectionContainer}>
                      <View style={styles.detailSectionHeader}>
                        <Ionicons name="business" size={17} color="#0F172A" style={{ marginRight: 6 }} />
                        <Text style={styles.detailSectionTitle}>Hamkor haqida</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.detailAboutPartnerCard}
                        activeOpacity={0.8}
                        onPress={() =>
                          Alert.alert(
                            'Hamkor haqida',
                            `${selectedStoreDetailItem.partnerName || 'Hamkor'} rasmiy sahifasi va ma’lumotlari.`
                          )
                        }
                      >
                        <View style={styles.detailAboutPartnerLogoWrap}>
                          <Ionicons name="book" size={20} color="#7C3AED" />
                        </View>
                        <View style={{ flex: 1 }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.detailAboutPartnerName}>
                              {selectedStoreDetailItem.partnerName || 'Book House'}
                            </Text>
                            <Ionicons name="checkmark-circle" size={15} color="#3B82F6" style={{ marginLeft: 4 }} />
                          </View>
                          <Text style={styles.detailAboutPartnerCat}>Kitob dökoni va öquv adabiyotlari</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
                      </TouchableOpacity>
                    </View>

                    {/* If coupon purchased: Unlocked Coupon Box */}
                    {purchasedStoreItems.includes(selectedStoreDetailItem.id) && (
                      <View style={styles.detailPurchasedCard}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                          <Ionicons name="checkmark-circle" size={20} color="#16A34A" style={{ marginRight: 6 }} />
                          <Text style={styles.detailPurchasedTitle}>Sizning kupon kodingiz:</Text>
                        </View>
                        <View style={styles.detailPurchasedCodeRow}>
                          <Text style={styles.detailPurchasedCodeText}>
                            {selectedStoreDetailItem.couponCode || 'LAW-YORDAM-VIP'}
                          </Text>
                          <TouchableOpacity
                            style={styles.detailCopyCodeBtn}
                            activeOpacity={0.7}
                            onPress={() => Alert.alert('Nusxalandi', 'Kupon kodi muvaffaqiyatli nusxalandi!')}
                          >
                            <Ionicons name="copy-outline" size={16} color="#7C3AED" style={{ marginRight: 4 }} />
                            <Text style={styles.detailCopyCodeText}>Nusxa oliş</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </>
                ) : (
                  /* ======================= MAXSUS SOVG'ALAR (PHYSICAL GOODS - IMAGE 1) ======================= */
                  <>
                    <Text style={styles.detailMainTitle}>
                      {selectedStoreDetailItem.title}
                    </Text>
                    <Text style={styles.detailMainSubtitle}>
                      {selectedStoreDetailItem.desc}
                    </Text>

                    {/* Price Row with Old Price and -20% Pill */}
                    <View style={styles.detailPriceRow}>
                      <FontAwesome5 name="coins" size={20} color="#D97706" style={{ marginRight: 8 }} />
                      <Text style={styles.detailPriceMain}>
                        {selectedStoreDetailItem.priceCoins.toLocaleString()} Coin
                      </Text>
                      <Text style={styles.detailPriceOld}>
                        {Math.round(selectedStoreDetailItem.priceCoins * 1.25).toLocaleString()} Coin
                      </Text>
                      <View style={styles.detailDiscountBadgePill}>
                        <Text style={styles.detailDiscountBadgePillText}>-20%</Text>
                      </View>
                    </View>

                    {/* 4 Feature Pills */}
                    <View style={styles.detailFeaturesRow}>
                      <View style={styles.detailFeaturePill}>
                        <Ionicons
                          name={selectedStoreDetailItem.id.includes('quloqchin') ? 'bluetooth' : 'shield-checkmark'}
                          size={18}
                          color="#7C3AED"
                        />
                        <Text style={styles.detailFeatureTitle}>
                          {selectedStoreDetailItem.id.includes('quloqchin') ? 'Bluetooth 5.3' : 'Premium sifat'}
                        </Text>
                      </View>
                      <View style={styles.detailFeaturePill}>
                        <Ionicons
                          name={selectedStoreDetailItem.id.includes('quloqchin') ? 'battery-charging' : 'trophy'}
                          size={18}
                          color="#7C3AED"
                        />
                        <Text style={styles.detailFeatureTitle}>
                          {selectedStoreDetailItem.id.includes('quloqchin') ? '57 soat işlaş' : 'Rasmiy brend'}
                        </Text>
                      </View>
                      <View style={styles.detailFeaturePill}>
                        <Ionicons
                          name={selectedStoreDetailItem.id.includes('quloqchin') ? 'leaf' : 'checkmark-done'}
                          size={18}
                          color="#7C3AED"
                        />
                        <Text style={styles.detailFeatureTitle}>
                          {selectedStoreDetailItem.id.includes('quloqchin') ? 'Yengil dizayn' : 'Kafolat mavjud'}
                        </Text>
                      </View>
                      <View style={styles.detailFeaturePill}>
                        <Ionicons
                          name={selectedStoreDetailItem.id.includes('quloqchin') ? 'mic' : 'star'}
                          size={18}
                          color="#7C3AED"
                        />
                        <Text style={styles.detailFeatureTitle}>
                          {selectedStoreDetailItem.id.includes('quloqchin') ? 'Örnatilgan mikrofon' : 'Maxsus sovğa'}
                        </Text>
                      </View>
                    </View>

                    {/* Tavsif Section */}
                    <View style={styles.detailSectionContainer}>
                      <View style={styles.detailSectionHeader}>
                        <Ionicons name="list" size={17} color="#0F172A" style={{ marginRight: 6 }} />
                        <Text style={styles.detailSectionTitle}>Tavsif</Text>
                      </View>
                      <Text style={styles.detailDescParagraph}>{selectedStoreDetailItem.desc}</Text>

                      {/* Quti ichida */}
                      <View style={styles.detailBoxContentWrap}>
                        <Text style={styles.detailBoxContentHeading}>Quti içida:</Text>
                        <View style={styles.detailBoxCheckItem}>
                          <Ionicons name="checkmark-circle" size={17} color="#7C3AED" style={{ marginRight: 8 }} />
                          <Text style={styles.detailBoxCheckText}>{selectedStoreDetailItem.title}</Text>
                        </View>
                        <View style={styles.detailBoxCheckItem}>
                          <Ionicons name="checkmark-circle" size={17} color="#7C3AED" style={{ marginRight: 8 }} />
                          <Text style={styles.detailBoxCheckText}>Himoya ğilofi yoki rasmiy qutisi</Text>
                        </View>
                        <View style={styles.detailBoxCheckItem}>
                          <Ionicons name="checkmark-circle" size={17} color="#7C3AED" style={{ marginRight: 8 }} />
                          <Text style={styles.detailBoxCheckText}>Foydalaniş böyiça yöriqnoma va kafolat talon</Text>
                        </View>
                      </View>
                    </View>

                    {/* Joylashuvi (Joylashuvi - NO COURIER DELIVERY) */}
                    <View style={styles.detailSectionContainer}>
                      <View style={styles.detailSectionHeader}>
                        <Ionicons name="location" size={17} color="#7C3AED" style={{ marginRight: 6 }} />
                        <Text style={styles.detailSectionTitle}>Oliş joyi (Joylaşuvi)</Text>
                      </View>
                      <View style={styles.detailPickupCard}>
                        <View style={styles.detailPickupIconWrap}>
                          <Ionicons name="business" size={22} color="#7C3AED" />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.detailPickupBuilding}>Huquq maktabi boş binosi</Text>
                          <Text style={styles.detailPickupAddress}>
                            Toşkent ş., Çilonzor tumani, Bunyodkor köçasi, 15-uy
                          </Text>
                          <Text style={styles.detailPickupSchedule}>
                            Iş vaqti: Duşanba - Şanba, 09:00 - 18:00
                          </Text>
                        </View>
                        <View style={styles.detailPickupBadge}>
                          <Text style={styles.detailPickupBadgeText}>Bepul</Text>
                        </View>
                      </View>
                    </View>
                  </>
                )}
              </ScrollView>

              {/* Sticky CTA Button at Bottom */}
              <View style={[styles.detailStickyBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
                {purchasedStoreItems.includes(selectedStoreDetailItem.id) ? (
                  <TouchableOpacity
                    style={[
                      styles.detailStickyBtnSuccess,
                      selectedStoreDetailItem.category === 'talim' && { backgroundColor: '#2563EB' },
                    ]}
                    activeOpacity={0.8}
                    onPress={() => {
                      if (selectedStoreDetailItem.category === 'talim') {
                        Alert.alert(
                          'Imtiyoz faol',
                          `"${selectedStoreDetailItem.title}" profilingizga biriktirilgan va foydalanish uchun ochiq!`
                        );
                      } else {
                        Alert.alert(
                          'Kupon faol',
                          `Kupon kodingiz: ${selectedStoreDetailItem.couponCode || 'LAW-YORDAM-VIP'}\n\nUshbu kodni ko‘rsatib chegirmadan foydalaning.`
                        );
                      }
                    }}
                  >
                    <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                    <Text style={styles.detailStickyBtnText}>
                      {selectedStoreDetailItem.category === 'talim'
                        ? 'Imtiyozdan foydalaniş'
                        : 'Kupondan foydalaniş'}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[
                      styles.detailStickyBtn,
                      selectedStoreDetailItem.category === 'talim' && { backgroundColor: '#2563EB' },
                    ]}
                    activeOpacity={0.85}
                    onPress={() => {
                      setIsConfirmingStoreOrder(true);
                      setOrderQuantity(1);
                    }}
                  >
                    <FontAwesome5 name="coins" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
                    <Text style={styles.detailStickyBtnText}>
                      {selectedStoreDetailItem.category === 'maxsus'
                        ? `${selectedStoreDetailItem.priceCoins.toLocaleString()} Coin evaziga buyurtma berish`
                        : selectedStoreDetailItem.category === 'talim'
                          ? `${selectedStoreDetailItem.priceCoins.toLocaleString()} Coin evaziga faollashtirish`
                          : `${selectedStoreDetailItem.priceCoins.toLocaleString()} Coin evaziga olish`}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )
        ) : isViewingMyPurchases ? (
          /* ===================== MENING MAHSULOTLARIM (MY PURCHASES SCREEN) ===================== */
          <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
            {/* 1. Category Filter Tabs */}
            <View style={styles.myPurchasesTabsWrapper}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.myPurchasesTabsContent}
              >
                {[
                  { key: 'Barchasi', label: 'Barchasi', count: purchasedStoreItems.length },
                  {
                    key: 'talim',
                    label: 'Ta’lim imtiyozlari',
                    count: DIGITAL_STORE_ITEMS.filter((i) => purchasedStoreItems.includes(i.id) && i.category === 'talim').length,
                  },
                  {
                    key: 'hamkorlar',
                    label: 'Kuponlar',
                    count: DIGITAL_STORE_ITEMS.filter((i) => purchasedStoreItems.includes(i.id) && i.category === 'hamkorlar').length,
                  },
                  {
                    key: 'maxsus',
                    label: 'Maxsus sovg‘alar',
                    count: DIGITAL_STORE_ITEMS.filter((i) => purchasedStoreItems.includes(i.id) && i.category === 'maxsus').length,
                  },
                ].map((tab) => {
                  const isActive = myPurchasesFilter === tab.key;
                  return (
                    <TouchableOpacity
                      key={tab.key}
                      style={[
                        styles.myPurchasesTabPill,
                        isActive && styles.myPurchasesTabPillActive,
                      ]}
                      activeOpacity={0.75}
                      onPress={() => setMyPurchasesFilter(tab.key as any)}
                    >
                      <Text
                        style={[
                          styles.myPurchasesTabPillText,
                          isActive && styles.myPurchasesTabPillTextActive,
                        ]}
                      >
                        {tab.label}
                      </Text>
                      {tab.count > 0 && (
                        <View
                          style={[
                            styles.myPurchasesTabBadge,
                            isActive && styles.myPurchasesTabBadgeActive,
                          ]}
                        >
                          <Text
                            style={[
                              styles.myPurchasesTabBadgeText,
                              isActive && styles.myPurchasesTabBadgeTextActive,
                            ]}
                          >
                            {tab.count}
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* 2. Purchased Items List or Empty State */}
            {(() => {
              const myItems = DIGITAL_STORE_ITEMS.filter((item) => {
                const isPurchased = purchasedStoreItems.includes(item.id);
                if (!isPurchased) return false;
                if (myPurchasesFilter === 'Barchasi') return true;
                return item.category === myPurchasesFilter;
              });

              if (myItems.length === 0) {
                return (
                  <View style={styles.myPurchasesEmptyContainer}>
                    <View style={styles.myPurchasesEmptyIconCircle}>
                      <Ionicons name="bag-handle-outline" size={54} color="#94A3B8" />
                    </View>
                    <Text style={styles.myPurchasesEmptyTitle}>
                      Hozirça xaridlar mavjud emas
                    </Text>
                    <Text style={styles.myPurchasesEmptySubtitle}>
                      {myPurchasesFilter === 'Barchasi'
                        ? 'Dökondan tangalaringiz evaziga foydali kitoblar, ta’lim vebinarlari, çegirma kuponlari va sovğalarni xarid qiling!'
                        : 'Uşbu bölim böyiça hali heç qanday mahsulot xarid qilinmagan.'}
                    </Text>
                    <TouchableOpacity
                      style={styles.myPurchasesEmptyBtn}
                      activeOpacity={0.85}
                      onPress={() => {
                        setIsViewingMyPurchases(false);
                        setMyPurchasesFilter('Barchasi');
                      }}
                    >
                      <Ionicons name="cart-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                      <Text style={styles.myPurchasesEmptyBtnText}>Dökonga ötiş</Text>
                    </TouchableOpacity>
                  </View>
                );
              }

              return (
                <ScrollView
                  style={{ flex: 1 }}
                  contentContainerStyle={[
                    styles.myPurchasesListContent,
                    { paddingBottom: Math.max(insets.bottom, 12) + 90 },
                  ]}
                  showsVerticalScrollIndicator={false}
                >
                  <View style={styles.myPurchasesListSummaryBar}>
                    <Text style={styles.myPurchasesListSummaryText}>
                      Jami xarid qilingan: <Text style={{ fontWeight: '900', color: '#0F172A' }}>{myItems.length} ta mahsulot</Text>
                    </Text>
                  </View>

                  {myItems.map((item) => (
                    <View key={item.id} style={styles.myPurchaseCard}>
                      {/* Top Header Row of Card */}
                      <View style={styles.myPurchaseCardTopRow}>
                        <View
                          style={[
                            styles.myPurchaseCategoryBadge,
                            item.category === 'talim'
                              ? { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }
                              : item.category === 'hamkorlar'
                                ? { backgroundColor: '#FAF5FF', borderColor: '#E9D5FF' }
                                : { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' },
                          ]}
                        >
                          <Ionicons
                            name={
                              item.category === 'talim'
                                ? 'school'
                                : item.category === 'hamkorlar'
                                  ? 'pricetag'
                                  : 'gift'
                            }
                            size={12}
                            color={
                              item.category === 'talim'
                                ? '#2563EB'
                                : item.category === 'hamkorlar'
                                  ? '#7C3AED'
                                  : '#D97706'
                            }
                            style={{ marginRight: 4 }}
                          />
                          <Text
                            style={[
                              styles.myPurchaseCategoryBadgeText,
                              item.category === 'talim'
                                ? { color: '#2563EB' }
                                : item.category === 'hamkorlar'
                                  ? { color: '#7C3AED' }
                                  : { color: '#D97706' },
                            ]}
                          >
                            {item.category === 'talim'
                              ? 'Ta’lim imtiyozi • Faol'
                              : item.category === 'hamkorlar'
                                ? 'Kupon • Faol'
                                : 'Buyurtma • Qabul qilingan'}
                          </Text>
                        </View>

                        <Text style={styles.myPurchaseDateText}>Faol</Text>
                      </View>

                      {/* Main Item Info Row */}
                      <TouchableOpacity
                        style={styles.myPurchaseMainRow}
                        activeOpacity={0.8}
                        onPress={() => setSelectedStoreDetailItem(item)}
                      >
                        <View style={styles.myPurchaseThumbWrap}>
                          {item.image ? (
                            <Image
                              source={item.image}
                              style={styles.myPurchaseThumbImg}
                              resizeMode="cover"
                            />
                          ) : (
                            <Ionicons name={(item.iconName as any) || 'sparkles'} size={28} color="#7C3AED" />
                          )}
                        </View>

                        <View style={styles.myPurchaseInfoCol}>
                          <Text style={styles.myPurchaseItemTitle} numberOfLines={2}>
                            {item.title}
                          </Text>
                          <Text style={styles.myPurchaseItemSub} numberOfLines={1}>
                            {item.subcategory || item.partnerName || item.categoryLabel}
                          </Text>
                          <View style={styles.myPurchasePriceRow}>
                            <FontAwesome5 name="coins" size={12} color="#D97706" style={{ marginRight: 4 }} />
                            <Text style={styles.myPurchasePriceText}>
                              {item.priceCoins.toLocaleString()} Coin
                            </Text>
                          </View>
                        </View>

                        <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
                      </TouchableOpacity>

                      {/* Card Bottom Actions depending on Category */}
                      {item.category === 'talim' ? (
                        <View style={styles.myPurchaseActionCard}>
                          {item.subcategory === 'Elektron kitoblar' ? (
                            <View style={{ flexDirection: 'row', gap: 8 }}>
                              <TouchableOpacity
                                style={[styles.myPurchaseActionBtn, { backgroundColor: '#2563EB', flex: 1 }]}
                                activeOpacity={0.8}
                                onPress={() => Alert.alert('Kitob oçilmoqda', `"${item.title}" elektron kitob o‘quvchi rejimida ochilmoqda.`)}
                              >
                                <Ionicons name="book" size={15} color="#FFFFFF" style={{ marginRight: 6 }} />
                                <Text style={styles.myPurchaseActionBtnText}>Öqiş</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={[styles.myPurchaseActionBtn, { backgroundColor: '#0284C7', flex: 1 }]}
                                activeOpacity={0.8}
                                onPress={() => Alert.alert('Yuklab oliş', `"${item.title}" PDF fayli muvaffaqiyatli yuklab olindi.`)}
                              >
                                <Ionicons name="download" size={15} color="#FFFFFF" style={{ marginRight: 6 }} />
                                <Text style={styles.myPurchaseActionBtnText}>PDF yuklaş</Text>
                              </TouchableOpacity>
                            </View>
                          ) : item.subcategory === 'Seminarlar' ? (
                            <TouchableOpacity
                              style={[styles.myPurchaseActionBtn, { backgroundColor: '#2563EB' }]}
                              activeOpacity={0.8}
                              onPress={() => Alert.alert('Vebinarga kiriş', `Zoom xonasi havolasi: https://zoom.us/j/huquqmaktabi\n\nVebinar boshlanish vaqti bildirishnomada ko‘rsatiladi.`)}
                            >
                              <Ionicons name="videocam" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                              <Text style={styles.myPurchaseActionBtnText}>Zoom orqali ulaniş</Text>
                            </TouchableOpacity>
                          ) : item.subcategory === 'Mentorlik' ? (
                            <TouchableOpacity
                              style={[styles.myPurchaseActionBtn, { backgroundColor: '#2563EB' }]}
                              activeOpacity={0.8}
                              onPress={() => Alert.alert('Mentor bilan boğlaniş', `Mutaxassis bilan aloqa uchun maxsus Telegram bot: @HuquqMaktabiMentorBot\nSizning vaucher kodingiz: ${item.couponCode || 'MENTOR-VIP'}`)}
                            >
                              <Ionicons name="chatbubbles" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                              <Text style={styles.myPurchaseActionBtnText}>Mutaxassis bilan boğlaniş</Text>
                            </TouchableOpacity>
                          ) : (
                            <View style={styles.myPurchaseCouponCodeRow}>
                              <Text style={styles.myPurchaseCouponCodeText}>{item.couponCode || 'KITOB-TALIM-30'}</Text>
                              <TouchableOpacity
                                style={styles.myPurchaseCopyBtn}
                                activeOpacity={0.7}
                                onPress={() => Alert.alert('Nusxalandi', 'Kupon kodi nusxalandi!')}
                              >
                                <Ionicons name="copy-outline" size={15} color="#2563EB" style={{ marginRight: 4 }} />
                                <Text style={[styles.myPurchaseCopyBtnText, { color: '#2563EB' }]}>Nusxa oliş</Text>
                              </TouchableOpacity>
                            </View>
                          )}
                        </View>
                      ) : item.category === 'hamkorlar' ? (
                        <View style={styles.myPurchaseActionCard}>
                          <View style={styles.myPurchaseCouponCodeRow}>
                            <View>
                              <Text style={styles.myPurchaseCouponCodeLabel}>Kupon kodi:</Text>
                              <Text style={styles.myPurchaseCouponCodeText}>
                                {item.couponCode || 'LAW-YORDAM-VIP'}
                              </Text>
                            </View>
                            <TouchableOpacity
                              style={styles.myPurchaseCopyBtn}
                              activeOpacity={0.7}
                              onPress={() => Alert.alert('Nusxalandi', 'Kupon kodi nusxalandi!')}
                            >
                              <Ionicons name="copy-outline" size={15} color="#7C3AED" style={{ marginRight: 4 }} />
                              <Text style={styles.myPurchaseCopyBtnText}>Nusxa oliş</Text>
                            </TouchableOpacity>
                          </View>
                          <Text style={styles.myPurchaseCouponHint}>
                            Hamkor: {item.partnerName || 'Book House'} kassasida körsatiladi (30 kun)
                          </Text>
                        </View>
                      ) : (
                        <View style={styles.myPurchaseActionCard}>
                          <View style={styles.myPurchasePickupRow}>
                            <Ionicons name="location-outline" size={16} color="#7C3AED" style={{ marginRight: 6 }} />
                            <Text style={styles.myPurchasePickupText} numberOfLines={1}>
                              Huquq maktabi boş binosi (Bunyodkor 15)
                            </Text>
                          </View>
                          <View style={styles.myPurchaseOrderFooterRow}>
                            <View style={styles.myPurchaseStatusPill}>
                              <View style={styles.myPurchaseStatusDot} />
                              <Text style={styles.myPurchaseStatusText}>Tayyorlanmoqda (1-3 iş kuni)</Text>
                            </View>
                            <TouchableOpacity
                              activeOpacity={0.7}
                              onPress={() => setSelectedStoreDetailItem(item)}
                            >
                              <Text style={styles.myPurchaseDetailLink}>Batafsil köriş</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      )}
                    </View>
                  ))}
                </ScrollView>
              );
            })()}
          </View>
        ) : storeActiveCategory === null ? (
          /* ===================== MAKTAB DO'KONI (MAIN STORE - SCREEN A) ===================== */
          <ScrollView
            style={styles.storeMainScrollView}
            contentContainerStyle={[
              styles.storeMainScrollContent,
              { paddingBottom: Math.max(insets.bottom, 8) + 85 },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {/* 1. Purple Hero Swiper Banner (Auto-playing rotating swiper) */}
            <View style={styles.storeHeroBanner}>
              <ScrollView
                ref={storeSwiperRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                decelerationRate="fast"
                snapToInterval={width - 32}
                snapToAlignment="center"
                onMomentumScrollEnd={(e) => {
                  const idx = Math.round(e.nativeEvent.contentOffset.x / (width - 32));
                  setStoreBannerIndex(idx);
                }}
                style={styles.storeBannerSwiper}
              >
                {STORE_BANNER_SLIDES.map((slide) => (
                  <View key={slide.id} style={{ width: width - 32 }}>
                    <LinearGradient
                      colors={slide.colors}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.storeHeroGradient}
                    >
                      <View style={styles.storeHeroTextCol}>
                        <Text style={styles.storeHeroTitle}>{slide.title}</Text>
                        <Text style={styles.storeHeroSubtitle}>
                          {slide.subtitle}
                        </Text>
                      </View>
                      <Image
                        source={slide.image}
                        style={styles.storeHeroGiftImg}
                        resizeMode="contain"
                      />
                    </LinearGradient>
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* Carousel Pagination Dots */}
            <View style={styles.storeCarouselDotsRow}>
              {STORE_BANNER_SLIDES.map((_, idx) => (
                <View
                  key={idx}
                  style={idx === storeBannerIndex ? styles.storeDotActive : styles.storeDotInactive}
                />
              ))}
            </View>

            {/* 2. Search Input Box */}
            <View style={styles.storeSearchRow}>
              <Ionicons name="search-outline" size={19} color="#94A3B8" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.storeSearchInput}
                placeholder="Mahsulot yoki taklif qidiriş..."
                placeholderTextColor="#94A3B8"
                value={storeSearchQuery}
                onChangeText={(text) => setStoreSearchQuery(text)}
                onSubmitEditing={() => {
                  if (storeSearchQuery.trim()) {
                    setStoreActiveCategory('Barcha mahsulotlar');
                  }
                }}
              />
            </View>

            {/* 3. Three Category Cards in Row (Ta’lim imtiyozlari, Maxsus sovg‘alar, Hamkorlar takliflari) */}
            <View style={styles.storeCategoryCardsRow}>
              {STORE_CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={styles.storeCategoryCard}
                  activeOpacity={0.8}
                  onPress={() => {
                    setStoreActiveCategory(cat.targetCat);
                    setStoreCatalogFilter('Barchasi');
                  }}
                >
                  <View style={[styles.storeCategoryIconCircle, { backgroundColor: cat.bgColor }]}>
                    <Ionicons name={cat.iconName as any} size={24} color={cat.iconColor} />
                  </View>
                  <Text style={styles.storeCategoryCardLabel} numberOfLines={2}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* 4. Mashhur mahsulotlar (Olov iconisiz va Yangi badgesiz) */}
            <View style={styles.storeSectionHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.storeSectionHeaderTitle}>Maşhur mahsulotlar</Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setStoreActiveCategory('Yangi va mashhur mahsulotlar');
                  setStoreCatalogFilter('Barchasi');
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.storeSectionSeeAllText}>Barçasini köriş</Text>
                  <Ionicons name="chevron-forward" size={13} color="#64748B" style={{ marginLeft: 2 }} />
                </View>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.storePopularScrollContent}
            >
              {DIGITAL_STORE_ITEMS.filter((it) => it.isPopular).map((item) => {
                const isFav = storeFavorites.includes(item.id);
                const isPurchased = purchasedStoreItems.includes(item.id);

                return (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.storePopularCard}
                    activeOpacity={0.85}
                    onPress={() => setSelectedStoreDetailItem(item)}
                  >
                    <TouchableOpacity
                      style={styles.storePopularHeartBtn}
                      activeOpacity={0.7}
                      onPress={() => toggleStoreFavorite(item.id)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Ionicons
                        name={isFav ? 'heart' : 'heart-outline'}
                        size={17}
                        color={isFav ? '#EF4444' : '#0F172A'}
                      />
                    </TouchableOpacity>

                    <View style={styles.storePopularImgWrap}>
                      {item.image ? (
                        <Image source={item.image} style={styles.storePopularImg} resizeMode="cover" />
                      ) : (
                        <Ionicons name={item.iconName as any} size={38} color={item.iconColor} />
                      )}
                    </View>

                    <Text style={styles.storePopularSubcategoryText} numberOfLines={1}>
                      {item.partnerName || item.subcategory}
                    </Text>

                    <Text style={styles.storePopularTitle} numberOfLines={2}>
                      {item.title}
                    </Text>

                    <View style={styles.storePopularPricePill}>
                      <FontAwesome5 name="coins" size={11} color="#D97706" style={{ marginRight: 4 }} />
                      <Text style={styles.storePopularPriceText}>
                        {isPurchased ? 'Olingan' : item.priceCoins.toLocaleString()}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* 5. Bottom Promo Banner: Hamkorlar takliflari */}
            <TouchableOpacity
              style={styles.storeEduPromoCard}
              activeOpacity={0.85}
              onPress={() => {
                setStoreActiveCategory('Hamkorlar takliflari');
                setStoreCatalogFilter('Barchasi');
              }}
            >
              <Image source={storeEduPromoImage} style={styles.storeEduPromoImg} resizeMode="contain" />
              <View style={styles.storeEduPromoTextCol}>
                <Text style={styles.storeEduPromoTitle}>Hamkorlar takliflari</Text>
                <Text style={styles.storeEduPromoSubtitle}>
                  Kitob dökonlari, öquv markazlari va kafelardan 50% gaça eksklyuziv çegirmalar
                </Text>
              </View>
              <View style={styles.storeEduPromoArrowBtn}>
                <Ionicons name="chevron-forward" size={18} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          </ScrollView>
        ) : (
          /* ===================== CATALOG SCREEN (SCREEN B) ===================== */
          <ScrollView
            style={styles.storeMainScrollView}
            contentContainerStyle={[
              styles.storeMainScrollContent,
              { paddingBottom: Math.max(insets.bottom, 8) + 85 },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {/* Category Filter Pills (Horizontal) */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.storeFilterPillsScroll}
              contentContainerStyle={styles.storeFilterPillsContainer}
            >
              {getActiveCategoryPills().map((tab) => {
                const isActive = storeCatalogFilter === tab;
                return (
                  <TouchableOpacity
                    key={tab}
                    style={[styles.storeFilterPill, isActive && styles.storeFilterPillActive]}
                    activeOpacity={0.8}
                    onPress={() => setStoreCatalogFilter(tab)}
                  >
                    <Text
                      style={[styles.storeFilterPillText, isActive && styles.storeFilterPillTextActive]}
                    >
                      {tab}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Sort & Grid Toolbar Row */}
            <View style={styles.storeToolbarRow}>
              <TouchableOpacity
                style={styles.storeSortBtn}
                activeOpacity={0.7}
                onPress={handleSortPress}
              >
                <Ionicons name="swap-vertical" size={16} color="#0F172A" style={{ marginRight: 4 }} />
                <Text style={styles.storeSortBtnText}>
                  {storeSortMode === 'popular'
                    ? 'Maşhurligi böyiça'
                    : storeSortMode === 'price_asc'
                      ? 'Narxi: arzonroq'
                      : 'Narxi: qimmatroq'}
                </Text>
                <Ionicons name="chevron-down" size={13} color="#0F172A" style={{ marginLeft: 4 }} />
              </TouchableOpacity>

              <View style={styles.storeLayoutGridIcon}>
                <Ionicons name="grid" size={18} color="#0F172A" />
              </View>
            </View>

            {/* 2-Column Product Grid */}
            <View style={styles.storeProductGrid}>
              {getSortedFilteredStoreItems().map((item) => {
                const isFav = storeFavorites.includes(item.id);
                const isPurchased = purchasedStoreItems.includes(item.id);

                return (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.storeGridCard}
                    activeOpacity={0.85}
                    onPress={() => setSelectedStoreDetailItem(item)}
                  >
                    {/* Heart favorite button top right */}
                    <TouchableOpacity
                      style={styles.storeGridHeartBtn}
                      activeOpacity={0.7}
                      onPress={() => toggleStoreFavorite(item.id)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Ionicons
                        name={isFav ? 'heart' : 'heart-outline'}
                        size={18}
                        color={isFav ? '#EF4444' : '#0F172A'}
                      />
                    </TouchableOpacity>

                    {/* Real Product Image (Icon emas, rasm) */}
                    <View style={styles.storeGridImgContainer}>
                      {item.image ? (
                        <Image
                          source={item.image}
                          style={styles.storeGridProductImage}
                          resizeMode="cover"
                        />
                      ) : (
                        <View style={[styles.storeGridIconCircle, { backgroundColor: `${item.iconColor}15` }]}>
                          <Ionicons name={item.iconName as any} size={36} color={item.iconColor} />
                        </View>
                      )}
                    </View>

                    {/* Subcategory or partner tag */}
                    <Text style={styles.storeGridSubcatTag} numberOfLines={1}>
                      {item.partnerName || item.subcategory}
                    </Text>

                    {/* Title */}
                    <Text style={styles.storeGridTitle} numberOfLines={2}>
                      {item.title}
                    </Text>

                    {/* Buy / Price Pill Button */}
                    <TouchableOpacity
                      style={[
                        styles.storeGridPricePill,
                        isPurchased && styles.storeGridPricePillPurchased,
                      ]}
                      activeOpacity={0.8}
                      onPress={() => setSelectedStoreDetailItem(item)}
                    >
                      {isPurchased ? (
                        <>
                          <Ionicons name="checkmark-circle" size={14} color="#16A34A" style={{ marginRight: 4 }} />
                          <Text style={styles.storeGridPurchasedText}>Faol</Text>
                        </>
                      ) : (
                        <>
                          <FontAwesome5 name="coins" size={12} color="#D97706" style={{ marginRight: 5 }} />
                          <Text style={styles.storeGridPriceText}>{item.priceCoins.toLocaleString()}</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        )
      ) : activeTab === 'results' && resultsSubTab === 'ranking' ? (
        <View
          style={[
            styles.rankingScreenRoot,
            { paddingBottom: Math.max(insets.bottom, 8) + 75 },
          ]}
        >
          {/* Sub-Tab Segment Switcher (Shaxsiy natijalar & Reyting) */}
          <View style={styles.resultsSegmentRow}>
            <TouchableOpacity
              style={styles.resultsSegmentPill}
              activeOpacity={0.8}
              onPress={() => setResultsSubTab('personal')}
            >
              <Ionicons
                name="person-outline"
                size={16}
                color="#0F172A"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.resultsSegmentText}>
                Şaxsiy natijalar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.resultsSegmentPill, styles.resultsSegmentPillActive]}
              activeOpacity={0.8}
              onPress={() => setResultsSubTab('ranking')}
            >
              <Ionicons
                name="bar-chart"
                size={16}
                color="#FFFFFF"
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.resultsSegmentText, styles.resultsSegmentTextActive]}>
                Reyting
              </Text>
            </TouchableOpacity>
          </View>

          {/* Sticky Top Section (Banner, Filters, Top 3 Podium & Table Header) */}
          <View style={styles.rankingTopFixedSection}>
            {/* Header Banner: Huquq maktabi reytingi */}
            <View style={styles.rankingHeaderBanner}>
              <View style={styles.rankingBannerContent}>
                <Ionicons name="leaf-outline" size={18} color="#F59E0B" style={{ marginRight: 6 }} />
                <Text style={styles.rankingBannerTitle}>Huquq maktabi reytingi</Text>
                <Ionicons name="leaf-outline" size={18} color="#F59E0B" style={{ marginLeft: 6, transform: [{ scaleX: -1 }] }} />
              </View>
              <Text style={styles.rankingBannerSub}>Jami 12 648 nafar öquvçi</Text>
            </View>

            {/* Filter Pills: Umumiy | Oylik | Haftalik */}
            <View style={styles.rankingFilterRow}>
              {(['all', 'monthly', 'weekly'] as const).map((period) => {
                const label =
                  period === 'all' ? 'Umumiy' : period === 'monthly' ? 'Oylik' : 'Haftalik';
                const isActive = rankingPeriod === period;

                return (
                  <TouchableOpacity
                    key={period}
                    style={[
                      styles.rankingPeriodPill,
                      isActive && styles.rankingPeriodPillActive,
                    ]}
                    activeOpacity={0.8}
                    onPress={() => setRankingPeriod(period)}
                  >
                    <Text
                      style={[
                        styles.rankingPeriodText,
                        isActive && styles.rankingPeriodTextActive,
                      ]}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Top 3 Podium (3, 2, 1-o‘rinlar) */}
            <View style={styles.podiumContainer}>
              {/* #2 Rank: Dilnoza X. (Left) */}
              <View style={styles.podiumColumn}>
                <View style={styles.podiumCrownBadgeSilver}>
                  <Text style={styles.podiumCrownText}>2</Text>
                </View>
                <Image
                  source={avatarDilnoza}
                  style={styles.podiumAvatarSilver}
                  resizeMode="cover"
                />
                <Text style={styles.podiumNameText}>Dilnoza X.</Text>
                <Text style={styles.podiumLevelText}>Lv.14</Text>
                <View style={styles.podiumXpRow}>
                  <Ionicons name="flash" size={11} color="#D97706" style={{ marginRight: 3 }} />
                  <Text style={styles.podiumXpText}>12 480 XP</Text>
                </View>
              </View>

              {/* #1 Rank: Sardor B. (Center - Elevated with golden wreath & crown) */}
              <View style={[styles.podiumColumn, styles.podiumColumnFirst]}>
                <FontAwesome5 name="crown" size={18} color="#F59E0B" style={styles.podiumCenterCrown} />
                <View style={styles.podiumAvatarGoldWrap}>
                  <Image
                    source={avatarSardor}
                    style={styles.podiumAvatarGold}
                    resizeMode="cover"
                  />
                </View>
                <Text style={styles.podiumNameTextFirst}>Sardor B.</Text>
                <Text style={styles.podiumLevelText}>Lv.15</Text>
                <View style={styles.podiumXpRow}>
                  <Ionicons name="flash" size={12} color="#D97706" style={{ marginRight: 3 }} />
                  <Text style={styles.podiumXpTextFirst}>14 320 XP</Text>
                </View>
              </View>

              {/* #3 Rank: Akmal R. (Right) */}
              <View style={styles.podiumColumn}>
                <View style={styles.podiumCrownBadgeBronze}>
                  <Text style={styles.podiumCrownText}>3</Text>
                </View>
                <Image
                  source={avatarAkmal}
                  style={styles.podiumAvatarBronze}
                  resizeMode="cover"
                />
                <Text style={styles.podiumNameText}>Akmal R.</Text>
                <Text style={styles.podiumLevelText}>Lv.14</Text>
                <View style={styles.podiumXpRow}>
                  <Ionicons name="flash" size={11} color="#D97706" style={{ marginRight: 3 }} />
                  <Text style={styles.podiumXpText}>11 980 XP</Text>
                </View>
              </View>
            </View>

            {/* 5. Search Bar Input */}
            <View style={styles.rankingSearchBox}>
              <Ionicons name="search-outline" size={16} color="#94A3B8" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.rankingSearchInput}
                placeholder="Öquvçini qidiriş..."
                placeholderTextColor="#94A3B8"
                value={rankingSearchQuery}
                onChangeText={setRankingSearchQuery}
                autoCapitalize="none"
              />
              {rankingSearchQuery.trim().length > 0 && (
                <TouchableOpacity
                  onPress={() => setRankingSearchQuery('')}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="close-circle" size={17} color="#94A3B8" />
                </TouchableOpacity>
              )}
            </View>

            {/* Table Header Row: # | O‘quvchi | Daraja | XP */}
            <View style={styles.leaderboardHeaderRow}>
              <Text style={[styles.leaderboardHeaderCell, { width: 32 }]}>#</Text>
              <Text style={[styles.leaderboardHeaderCell, { flex: 1, paddingLeft: 8 }]}>Öquvçi</Text>
              <Text style={[styles.leaderboardHeaderCell, { width: 55, textAlign: 'center' }]}>Daraja</Text>
              <Text style={[styles.leaderboardHeaderCell, { width: 85, textAlign: 'right' }]}>XP</Text>
            </View>
          </View>

          {/* 6. Scrollable Table (O‘quvchilar ro‘yxati podiyum ostidan o‘tib scroll bo‘ladi) */}
          <ScrollView
            style={styles.rankingTableScroll}
            contentContainerStyle={styles.rankingTableScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {(() => {
              const query = rankingSearchQuery.trim().toLowerCase();
              const filteredList = LEADERBOARD_DATA.filter((student) => {
                if (student.isCurrentUser) return false;
                if (!query) return student.rank >= 4;
                return student.name.toLowerCase().includes(query);
              });

              if (filteredList.length === 0) {
                return (
                  <View style={styles.rankingSearchEmptyWrap}>
                    <Ionicons name="search-outline" size={28} color="#CBD5E1" style={{ marginBottom: 6 }} />
                    <Text style={styles.rankingSearchEmptyTitle}>Öquvçi topilmadi</Text>
                    <Text style={styles.rankingSearchEmptySub}>
                      «{rankingSearchQuery}» böyiça natija çiqmadi.
                    </Text>
                  </View>
                );
              }

              return filteredList.map((student) => (
                <View key={student.rank} style={styles.leaderboardDataRow}>
                  <Text style={styles.leaderboardRankNum}>{student.rank}</Text>

                  <View style={styles.leaderboardStudentCol}>
                    <View style={[styles.leaderboardAvatarCircle, { backgroundColor: student.avatarBg || '#E2E8F0' }]}>
                      <Text style={[styles.leaderboardAvatarInitials, { color: student.avatarColor || '#0F172A' }]}>
                        {student.name.charAt(0)}
                      </Text>
                    </View>
                    <Text style={styles.leaderboardStudentName}>{student.name}</Text>
                  </View>

                  <Text style={styles.leaderboardLevelCol}>Lv.{student.level}</Text>

                  <Text style={styles.leaderboardXpCol}>{student.xp.toLocaleString()} XP</Text>
                </View>
              ));
            })()}
          </ScrollView>

          {/* Current User Row: #27 Ergashboy M. (Pastda biriktirilgan) */}
          {(() => {
            const currentUser = LEADERBOARD_DATA.find((item) => item.isCurrentUser);
            if (!currentUser) return null;
            const query = rankingSearchQuery.trim().toLowerCase();
            if (query && !currentUser.name.toLowerCase().includes(query)) {
              return null;
            }

            return (
              <View style={styles.leaderboardCurrentUserRow}>
                <Text style={styles.leaderboardCurrentUserRank}>{currentUser.rank}</Text>

                <View style={styles.leaderboardStudentCol}>
                  <Image
                    source={videoLessonInstructorImage}
                    style={styles.leaderboardCurrentUserAvatar}
                    resizeMode="cover"
                  />
                  <Text style={styles.leaderboardCurrentUserName}>{currentUser.name}</Text>
                </View>

                <Text style={styles.leaderboardCurrentUserLevel}>Lv.{currentUser.level}</Text>

                <Text style={styles.leaderboardCurrentUserXp}>{currentUser.xp.toLocaleString()} XP</Text>
              </View>
            );
          })()}
        </View>
      ) : (
        <ScrollView
          style={styles.scrollWrapper}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, 8) + 75 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === 'home' && (
            <>
              {/* ===================== 1. HERO SWIPER / REKLAMA & YANGILIKLAR ===================== */}
              <View style={styles.carouselContainer}>
                <ScrollView
                  ref={swiperRef}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  decelerationRate="fast"
                  snapToInterval={SLIDE_WIDTH}
                  snapToAlignment="center"
                  onMomentumScrollEnd={handleScrollEnd}
                  scrollEventThrottle={16}
                  style={styles.carouselScrollView}
                >
                  {activeSlides.map((slide, sIdx) => {
                    const isCustomBanner = Boolean(slide.imageUrl);
                    if (isCustomBanner) {
                      return (
                        <TouchableOpacity
                          key={slide.id || sIdx}
                          style={[
                            styles.carouselSlideCard,
                            {
                              width: SLIDE_WIDTH,
                              height: 155,
                              paddingHorizontal: 0,
                              paddingVertical: 0,
                              overflow: 'hidden',
                              borderWidth: 0,
                              backgroundColor: '#0F172A',
                            },
                          ]}
                          activeOpacity={0.92}
                        >
                          <Image
                            source={{ uri: slide.imageUrl }}
                            style={{ width: '100%', height: '100%', borderRadius: 20 }}
                            resizeMode="cover"
                          />
                        </TouchableOpacity>
                      );
                    }

                    return (
                      <TouchableOpacity
                        key={slide.id}
                        style={[styles.carouselSlideCard, { width: SLIDE_WIDTH }]}
                        activeOpacity={0.9}
                        onPress={() => Alert.alert(slide.actionAlertTitle, slide.actionAlertMessage)}
                      >
                        <View style={styles.heroTextCol}>
                          <View style={styles.slideBadgeRow}>
                            <View style={[styles.slideBadge, { backgroundColor: slide.badgeBg }]}>
                              <Text style={[styles.slideBadgeText, { color: slide.badgeTextColor }]}>
                                {slide.badge}
                              </Text>
                            </View>
                          </View>
                          <Text style={styles.slideCardTitle} numberOfLines={2}>
                            {slide.title}
                          </Text>
                          <Text style={styles.slideCardSubtitle} numberOfLines={2}>
                            {slide.subtitle}
                          </Text>

                          {slide.ctaText && (
                            <View style={styles.slideActionRow}>
                              <Text style={styles.slideActionText}>{slide.ctaText}</Text>
                              <Ionicons name="arrow-forward" size={13} color="#0284C7" />
                            </View>
                          )}
                        </View>

                        {slide.image ? (
                          <View style={slide.image === heroIllustration ? { width: 115, height: 95 } : styles.slideImageBox}>
                            <Image
                              source={slide.image}
                              style={slide.image === heroIllustration ? styles.heroIllustrationImage : styles.slideNewsImage}
                              resizeMode={slide.image === heroIllustration ? 'contain' : 'cover'}
                            />
                          </View>
                        ) : (
                          <View style={[styles.slideIconBox, { backgroundColor: slide.badgeBg || '#F0F9FF' }]}>
                            <Ionicons
                              name={(slide.iconName as any) || 'bulb'}
                              size={32}
                              color={slide.iconColor || '#0284C7'}
                            />
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>

                {/* Carousel Pagination Dots */}
                {activeSlides.length > 1 && (
                  <View style={styles.carouselPaginationRow}>
                    {activeSlides.map((_, dotIdx) => (
                      <TouchableOpacity
                        key={dotIdx}
                        activeOpacity={0.7}
                        onPress={() => goToSlide(dotIdx)}
                        style={[
                          styles.carouselDot,
                          currentSlideIndex === dotIdx ? styles.carouselDotActive : styles.carouselDotInactive,
                        ]}
                      />
                    ))}
                  </View>
                )}
              </View>

              {/* ===================== 2. REYTING & STATS BAR (MINIMALIST & SLEEK) ===================== */}
              <View style={styles.homeStatsBar}>
                {/* Reytingdagi o'rni */}
                <TouchableOpacity
                  style={styles.homeLevelPill}
                  activeOpacity={0.8}
                  onPress={() => {
                    setActiveTab('results');
                    setResultsSubTab('ranking');
                  }}
                >
                  <View style={styles.homeRankTrophyWrap}>
                    <Ionicons name="trophy" size={13} color="#FFFFFF" />
                  </View>
                  <View>
                    <Text style={styles.homeLevelTitle}>24-örin</Text>
                    <Text style={styles.homeLevelSubtitle}>Umumiy reyting</Text>
                  </View>
                </TouchableOpacity>

                <View style={styles.homeStatsRightPills}>
                  {/* Streak */}
                  <TouchableOpacity
                    style={styles.homeStatPill}
                    activeOpacity={0.8}
                    onPress={() =>
                      Alert.alert(
                        'Öqiş seriyasi (Streak) 🔥',
                        '7 kun ketma-ket dars öqidingiz!\nHar kuni örganib, bonus XP va tangalarni qölga kiriting.'
                      )
                    }
                  >
                    <Ionicons name="flame" size={14} color="#EA580C" style={{ marginRight: 3 }} />
                    <Text style={styles.homeStatPillText}>7 kun</Text>
                  </TouchableOpacity>

                  {/* XP */}
                  <TouchableOpacity
                    style={styles.homeStatPill}
                    activeOpacity={0.8}
                    onPress={() =>
                      Alert.alert('Jami XP ballaringiz ⚡', '2 450 XP töplangan.\nReytingda 24-örin (Top 5%).')
                    }
                  >
                    <Ionicons name="flash" size={13} color="#0284C7" style={{ marginRight: 3 }} />
                    <Text style={styles.homeStatPillText}>2 450</Text>
                  </TouchableOpacity>

                  {/* Coins */}
                  <TouchableOpacity
                    style={[styles.homeStatPill, { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' }]}
                    activeOpacity={0.8}
                    onPress={() => setIsViewingSchoolStore(true)}
                  >
                    <FontAwesome5 name="coins" size={11} color="#D97706" style={{ marginRight: 4 }} />
                    <Text style={[styles.homeStatPillText, { color: '#B45309' }]}>580</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* ===================== 3. ACTIVE COURSE HERO CARD (DAVOM ETTIRISH) ===================== */}
              {(() => {
                const homeActiveLesson =
                  dynamicLessons.find((l) => l.status === 'in_progress') ||
                  dynamicLessons.find((l) => l.status !== 'completed') ||
                  dynamicLessons[0];
                const homeActiveCourse = homeActiveLesson
                  ? dynamicCourses.find((c) => c.id === homeActiveLesson.courseId) || dynamicCourses[0]
                  : dynamicCourses[0];
                const homeActiveTopic = homeActiveCourse
                  ? activeCategories.find((cat) => cat.id === homeActiveCourse.topicId) || activeCategories[0]
                  : activeCategories[0];
                const homeProgress = homeActiveCourse?.progress || 60;

                return (
                  <TouchableOpacity
                    activeOpacity={0.92}
                    style={{ marginBottom: 16 }}
                    onPress={() => {
                      if (homeActiveTopic) setSelectedTopicDetail(homeActiveTopic);
                      if (homeActiveCourse) setSelectedCourseDetail(homeActiveCourse);
                      if (homeActiveLesson) setSelectedLessonVideo(homeActiveLesson);
                    }}
                  >
                    <LinearGradient
                      colors={['#07284C', '#0B427B', '#0284C7']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.activeCourseCard}
                    >
                      {/* Header row: Tag and Subject */}
                      <View style={styles.activeCourseHeaderRow}>
                        <View style={styles.activeCourseStatusBadge}>
                          <View style={styles.activeCoursePulseDot} />
                          <Text style={styles.activeCourseStatusText}>DAVOM ETTIRIŞ</Text>
                        </View>
                        <Text style={styles.activeCourseCategoryTag}>
                          {homeActiveTopic ? homeActiveTopic.title.replace('\n', ' ') : 'Oila huquqi'} · {homeActiveLesson ? `${homeActiveLesson.order}-dars` : '1-dars'}
                        </Text>
                      </View>

                      {/* Lesson Title */}
                      <Text style={styles.activeCourseTitle} numberOfLines={1}>
                        {homeActiveLesson ? homeActiveLesson.title : 'Nikoh va oila munosabatlari'}
                      </Text>

                      {/* Progress bar & CTA row */}
                      <View style={styles.activeCourseBottomRow}>
                        <View style={styles.activeCourseProgressCol}>
                          <View style={styles.activeCourseProgressBarTrack}>
                            <View style={[styles.activeCourseProgressBarFill, { width: `${homeProgress}%` }]} />
                          </View>
                          <View style={styles.activeCourseMetaRow}>
                            <Text style={styles.activeCourseMetaText}>{homeProgress}% tamomlandi</Text>
                            <Text style={styles.activeCourseMetaDot}>•</Text>
                            <Text style={styles.activeCourseMetaText}>
                              {homeActiveLesson?.duration || '10 daqiqa'}
                            </Text>
                          </View>
                        </View>

                        <View style={styles.activeCoursePlayBtn}>
                          <Ionicons name="play" size={13} color="#002B49" style={{ marginLeft: 2 }} />
                        </View>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                );
              })()}

              {/* ===================== 4. QUICK ACTIONS (2 TA ASOSIY BO'LIM) ===================== */}
              <View style={styles.quickActionsGridTwo}>
                {QUICK_ACTIONS.map((action) => (
                  <TouchableOpacity
                    key={action.id}
                    style={styles.quickActionTileTwo}
                    activeOpacity={0.8}
                    onPress={() => Alert.alert(action.title.replace('\n', ' '), action.detail)}
                  >
                    <View
                      style={[
                        styles.quickIconCircleTwo,
                        action.id === 'daily_tasks'
                          ? { backgroundColor: '#F0F9FF' }
                          : { backgroundColor: '#FFF7ED' },
                      ]}
                    >
                      <Ionicons
                        name={action.iconName as any}
                        size={20}
                        color={action.iconColor}
                      />
                      {action.hasBadge && (
                        <View
                          style={[
                            styles.quickActionBadgeTwo,
                            action.id === 'streak'
                              ? { backgroundColor: '#EA580C' }
                              : { backgroundColor: '#0284C7' },
                          ]}
                        >
                          <Text style={styles.quickActionBadgeTextTwo}>{action.badgeValue}</Text>
                        </View>
                      )}
                    </View>
                    <View style={{ flex: 1, marginLeft: 8 }}>
                      <Text style={styles.quickTileTitleTwo} numberOfLines={1}>
                        {action.title}
                      </Text>
                      <Text style={styles.quickTileSubtitleTwo} numberOfLines={1}>
                        {action.id === 'daily_tasks' ? '1 ta vazifa qoldi' : '7 kun uzluksiz'}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={14} color="#94A3B8" />
                  </TouchableOpacity>
                ))}
              </View>

              {/* ===================== 5. HUQUQIY YO‘NALISHLAR (MINIMALIST 2x2 GRID) ===================== */}
              <View style={styles.sectionHeaderRow}>
                <View style={styles.sectionTitleWithPill}>
                  <Text style={styles.sectionTitle}>Huquqiy yönalişlar</Text>
                  <View style={styles.sectionCountPill}>
                    <Text style={styles.sectionCountPillText}>10 ta</Text>
                  </View>
                </View>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setActiveTab('topics')}
                >
                  <Text style={styles.seeAllText}>Barçasi ›</Text>
                </TouchableOpacity>
              </View>

              {/* 4 Featured Categories in Clean 2x2 Grid */}
              <View style={styles.featuredCategoriesGrid}>
                {activeCategories.slice(0, 4).map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={styles.featuredCategoryCard}
                    activeOpacity={0.8}
                    onPress={() => setSelectedTopicDetail(cat)}
                  >
                    <View style={styles.featuredCatTopRow}>
                      <View
                        style={[
                          styles.featuredCatIconWrap,
                          cat.id === 'fuqarolik' || cat.id === 'mehnat'
                            ? { backgroundColor: '#FEF3C7' }
                            : { backgroundColor: '#EFF6FF' },
                        ]}
                      >
                        {renderCategoryIcon(cat)}
                      </View>
                      <View
                        style={[
                          styles.featuredCatLevelBadge,
                          cat.level === 'orta'
                            ? { backgroundColor: '#FEF3C7' }
                            : { backgroundColor: '#ECFDF5' },
                        ]}
                      >
                        <Text
                          style={[
                            styles.featuredCatLevelText,
                            cat.level === 'orta'
                              ? { color: '#B45309' }
                              : { color: '#047857' },
                          ]}
                        >
                          {cat.level === 'orta' ? 'Örta' : 'Boşlanğiç'}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.featuredCatTitle} numberOfLines={1}>
                      {cat.title.replace('\n', ' ')}
                    </Text>

                    <View style={styles.featuredCatBottomRow}>
                      <Text style={styles.featuredCatLessonsText}>{cat.lessonsCount} ta dars</Text>
                      <Text style={styles.featuredCatProgressPercent}>{cat.progress}%</Text>
                    </View>

                    {/* Clean Mini Progress Track */}
                    <View style={styles.featuredCatProgressTrack}>
                      <View
                        style={[
                          styles.featuredCatProgressFill,
                          {
                            width: `${cat.progress}%`,
                            backgroundColor: cat.progressColor || '#10B981',
                          },
                        ]}
                      />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              {/* View All Topics Button */}
              <TouchableOpacity
                style={styles.viewAllTopicsBtn}
                activeOpacity={0.8}
                onPress={() => setActiveTab('topics')}
              >
                <Ionicons name="book-outline" size={15} color="#0284C7" style={{ marginRight: 6 }} />
                <Text style={styles.viewAllTopicsBtnText}>Barça 10 ta yönalişni köriş</Text>
                <Ionicons name="chevron-forward" size={14} color="#0284C7" style={{ marginLeft: 3 }} />
              </TouchableOpacity>

              {/* ===================== 6. KUN SAVOLI (+5 XP, +2 Coin) ===================== */}
              <View style={styles.dailyQuizMinimalCard}>
                <View style={styles.dailyQuizHeaderRow}>
                  <View style={styles.dailyQuizLabelWrap}>
                    <View style={styles.dailyQuizIconCircle}>
                      <Ionicons name="help" size={14} color="#D97706" />
                    </View>
                    <Text style={styles.dailyQuizLabel}>Kun savoli</Text>
                  </View>
                  <View style={styles.dailyQuizRewardsRow}>
                    <View style={styles.dailyQuizRewardPill}>
                      <Text style={styles.dailyQuizRewardText}>+5 XP</Text>
                    </View>
                    <View style={[styles.dailyQuizRewardPill, { backgroundColor: '#FEF3C7' }]}>
                      <FontAwesome5 name="coins" size={10} color="#B45309" style={{ marginRight: 3 }} />
                      <Text style={[styles.dailyQuizRewardText, { color: '#B45309' }]}>+2 Coin</Text>
                    </View>
                  </View>
                </View>

                <Text style={styles.dailyQuizQuestion}>
                  Mehnat şartnomasining minimal muddati qança?
                </Text>

                <TouchableOpacity
                  style={[
                    styles.dailyQuizCtaBtn,
                    dailyQuizAnswered && styles.dailyQuizCtaBtnDone,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => setQuizModalVisible(true)}
                >
                  <Ionicons
                    name={dailyQuizAnswered ? 'checkmark-circle' : 'create-outline'}
                    size={15}
                    color={dailyQuizAnswered ? '#047857' : '#002B49'}
                    style={{ marginRight: 5 }}
                  />
                  <Text
                    style={[
                      styles.dailyQuizCtaBtnText,
                      dailyQuizAnswered && styles.dailyQuizCtaBtnTextDone,
                    ]}
                  >
                    {dailyQuizAnswered ? 'Javob berildi (+5 XP)' : 'Javob beriş'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* ===================== 7. TAVSIYA ETILGAN DARSLAR ===================== */}
              <View style={[styles.sectionHeaderRow, { marginTop: 18 }]}>
                <Text style={styles.sectionTitle}>Tavsiya etilgan darslar</Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setActiveTab('topics')}
                >
                  <Text style={styles.seeAllText}>Barçasi ›</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.recommendedCardsRow}>
                {/* Card 1: Fuqarolarning asosiy huquqlari */}
                <TouchableOpacity
                  style={styles.recommendedCard}
                  activeOpacity={0.85}
                  onPress={() =>
                    Alert.alert(
                      'Fuqarolarning asosiy huquqlari',
                      '4 ta dars · 20 daqiqa\n\n1. Şaxsiy huquqlar\n2. Siyosiy huquqlar\n3. Iqtisodiy huquqlar\n4. Huquqiy himoya kafolatlari'
                    )
                  }
                >
                  <View style={styles.cardImageContainer}>
                    <Image source={gavelImage} style={styles.lessonCoverImage} resizeMode="cover" />
                    <View style={styles.imageOverlayGradient} />
                    <View style={styles.lessonDurationPill}>
                      <Ionicons name="time-outline" size={11} color="#FFFFFF" style={{ marginRight: 3 }} />
                      <Text style={styles.lessonDurationPillText}>20 daq</Text>
                    </View>
                  </View>
                  <View style={styles.lessonCardContent}>
                    <Text style={styles.lessonCardTag}>Asosiy huquqlar</Text>
                    <Text style={styles.lessonCardTitle} numberOfLines={2}>
                      Fuqarolarning asosiy huquqlari
                    </Text>
                    <View style={styles.lessonMetaRow}>
                      <Ionicons name="play-circle" size={13} color="#0284C7" style={{ marginRight: 4 }} />
                      <Text style={styles.lessonDurationText}>4 ta dars</Text>
                    </View>
                  </View>
                </TouchableOpacity>

                {/* Card 2: Ishga qabul qilish tartibi */}
                <TouchableOpacity
                  style={styles.recommendedCard}
                  activeOpacity={0.85}
                  onPress={() =>
                    Alert.alert(
                      'Işga qabul qiliş tartibi',
                      '3 ta dars · 15 daqiqa\n\n1. Kerakli hujjatlar röyxati\n2. Sinov muddati qoidalari\n3. Buyruq va mehnat daftarçasi'
                    )
                  }
                >
                  <View style={[styles.cardImageContainer, { backgroundColor: '#0B3A68' }]}>
                    {/* Styled Handshake Visual for card 2 */}
                    <LinearGradient
                      colors={['#0F2D4A', '#0284C7']}
                      style={styles.handshakeGradientBox}
                    >
                      <Ionicons name="hand-right" size={26} color="#F59E0B" />
                      <Ionicons name="hand-left" size={26} color="#FFFFFF" style={{ marginLeft: -8 }} />
                    </LinearGradient>
                    <View style={styles.lessonDurationPill}>
                      <Ionicons name="time-outline" size={11} color="#FFFFFF" style={{ marginRight: 3 }} />
                      <Text style={styles.lessonDurationPillText}>15 daq</Text>
                    </View>
                  </View>
                  <View style={styles.lessonCardContent}>
                    <Text style={styles.lessonCardTag}>Mehnat huquqi</Text>
                    <Text style={styles.lessonCardTitle} numberOfLines={2}>
                      Işga qabul qiliş tartibi
                    </Text>
                    <View style={styles.lessonMetaRow}>
                      <Ionicons name="play-circle" size={13} color="#0284C7" style={{ marginRight: 4 }} />
                      <Text style={styles.lessonDurationText}>3 ta dars</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* ===================== OTHER TABS: TESTLAR (1:1 DESIGN) ===================== */}
          {activeTab === 'tests' && (
            <View style={styles.testsScreenContainer}>
              {/* 1. Hero Title & 3D XP Illustration */}
              <View style={styles.testHeroRow}>
                <View style={styles.testHeroTextCol}>
                  <Text style={styles.testHeroTitle}>Testlar</Text>
                  <Text style={styles.testHeroSubtitle}>
                    Test işlang, bilimni mustahkamlang{'\n'}va XP töplang.
                  </Text>
                </View>

                <Image
                  source={testHeroXp3dImage}
                  style={styles.testHeroXpImage}
                  resizeMode="contain"
                />
              </View>

              {/* 2. "Bugungi maqsad" Card */}
              <View style={styles.goalCardContainer}>
                <View style={styles.goalCardTopRow}>
                  <View style={styles.goalLeftGroup}>
                    <View style={styles.goalFlashIconWrap}>
                      <Ionicons name="flash" size={19} color="#F59E0B" />
                    </View>
                    <View style={styles.goalTextCol}>
                      <Text style={styles.goalTitle}>Bugungi maqsad</Text>
                      <Text style={styles.goalScoreText}>50 / 100 XP</Text>
                    </View>
                  </View>

                  {/* Gift Box Icon Container */}
                  <TouchableOpacity
                    style={styles.goalGiftBoxWrap}
                    activeOpacity={0.8}
                    onPress={() =>
                      Alert.alert(
                        'Bugungi maqsad 🎁',
                        'Har kuni 100 XP töplang va qimmatli mukofotlar hamda qöşimça tangalar (coin) yutib oling!'
                      )
                    }
                  >
                    <Ionicons name="gift-outline" size={24} color="#D97706" />
                  </TouchableOpacity>
                </View>

                {/* Progress Bar */}
                <View style={styles.goalProgressBarTrack}>
                  <LinearGradient
                    colors={['#F59E0B', '#D97706']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.goalProgressBarFill}
                  />
                </View>
              </View>

              {/* 3. "Tezkor test" Section Header & Banner Card */}
              <View style={styles.testSectionWrap}>
                <TouchableOpacity
                  style={styles.sectionHeaderRow}
                  activeOpacity={0.7}
                  onPress={() => setQuizModalVisible(true)}
                >
                  <View style={styles.sectionHeaderTitleGroup}>
                    <Ionicons name="flash" size={17} color="#F59E0B" style={{ marginRight: 6 }} />
                    <Text style={styles.sectionHeaderTitle}>Tezkor test</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#0F172A" />
                </TouchableOpacity>

                {/* Banner: Kunlik test */}
                <TouchableOpacity
                  style={styles.tezkorBannerCard}
                  activeOpacity={0.88}
                  onPress={() => setQuizModalVisible(true)}
                >
                  <LinearGradient
                    colors={['#0B2239', '#14385C', '#1B4976']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.tezkorBannerGradient}
                  >
                    {/* Left Pill: 5 daqiqa */}
                    <View style={styles.tezkorTimerPill}>
                      <Ionicons name="stopwatch-outline" size={21} color="#FFFFFF" />
                      <Text style={styles.tezkorTimerText}>5 daqiqa</Text>
                    </View>

                    {/* Middle Text: Kunlik test / 10 ta tasodifiy savol */}
                    <View style={styles.tezkorTextCol}>
                      <Text style={styles.tezkorTitle}>Kunlik test</Text>
                      <Text style={styles.tezkorSubtitle}>10 ta tasodifiy savol</Text>
                    </View>

                    {/* Right: Circular White Play Button */}
                    <View style={styles.tezkorPlayCircle}>
                      <Ionicons name="play" size={18} color="#0B2239" style={{ marginLeft: 2 }} />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {/* 4. "Bo‘limlar bo‘yicha testlar" Section */}
              <View style={styles.testSectionWrap}>
                <TouchableOpacity
                  style={styles.sectionHeaderRow}
                  activeOpacity={0.7}
                  onPress={() => setIsViewingTestCategories(true)}
                >
                  <View style={styles.sectionHeaderTitleGroup}>
                    <Ionicons name="layers-outline" size={17} color="#0F172A" style={{ marginRight: 6 }} />
                    <Text style={styles.sectionHeaderTitle}>Bölimlar böyiça testlar</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#0F172A" />
                </TouchableOpacity>

                {/* Horizontal / Grid Category Cards */}
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categoryCardsRow}
                >
                  {/* 1. Umumiy qonunchilik */}
                  <TouchableOpacity
                    style={styles.categoryCardItem}
                    activeOpacity={0.75}
                    onPress={() => setSelectedTestCategoryForModal(TEST_CATEGORIES[0])}
                  >
                    <Ionicons name="scale-outline" size={24} color="#0F172A" />
                    <Text style={styles.categoryCardLabel}>Umumiy{'\n'}qonunçilik</Text>
                  </TouchableOpacity>

                  {/* 2. Oila va meros */}
                  <TouchableOpacity
                    style={styles.categoryCardItem}
                    activeOpacity={0.75}
                    onPress={() => setSelectedTestCategoryForModal(TEST_CATEGORIES[1])}
                  >
                    <Ionicons name="people-outline" size={24} color="#0F172A" />
                    <Text style={styles.categoryCardLabel}>Oila va{'\n'}meros</Text>
                  </TouchableOpacity>

                  {/* 3. Fuqarolik huquqi */}
                  <TouchableOpacity
                    style={styles.categoryCardItem}
                    activeOpacity={0.75}
                    onPress={() => setSelectedTestCategoryForModal(TEST_CATEGORIES[2])}
                  >
                    <Ionicons name="business-outline" size={24} color="#0F172A" />
                    <Text style={styles.categoryCardLabel}>Fuqarolik{'\n'}huquqi</Text>
                  </TouchableOpacity>

                  {/* 4. Mehnat huquqi */}
                  <TouchableOpacity
                    style={styles.categoryCardItem}
                    activeOpacity={0.75}
                    onPress={() => setSelectedTestCategoryForModal(TEST_CATEGORIES[3])}
                  >
                    <Ionicons name="briefcase-outline" size={24} color="#0F172A" />
                    <Text style={styles.categoryCardLabel}>Mehnat{'\n'}huquqi</Text>
                  </TouchableOpacity>

                  {/* 5. Right arrow pill */}
                  <TouchableOpacity
                    style={styles.categoryMorePill}
                    activeOpacity={0.75}
                    onPress={() => setIsViewingTestCategories(true)}
                  >
                    <Ionicons name="chevron-forward" size={17} color="#0F172A" />
                  </TouchableOpacity>
                </ScrollView>
              </View>

              {/* 5. "🔥 Ketma-ketlik" (Streak) Card */}
              <TouchableOpacity
                style={styles.streakCardContainer}
                activeOpacity={0.85}
                onPress={() =>
                  Alert.alert(
                    'Ketma-ketlik (Streak)',
                    'Siz ketma-ket 2 kun test topşirdingiz! Ertaga ham test topşirsangiz, 3 kunlik seriya yakunlanadi va sizga +150 XP bonus beriladi.'
                  )
                }
              >
                <View style={styles.streakLeftGroup}>
                  <View style={styles.streakFlameWrap}>
                    <Ionicons name="flame" size={26} color="#F59E0B" />
                  </View>
                  <View style={styles.streakTextCol}>
                    <Text style={styles.streakTitle}>Ketma-ketlik</Text>
                    <Text style={styles.streakSubtitle}>Ketma-ket 3 kun test işlang</Text>
                  </View>
                </View>

                {/* Circular Gauge 2/3 */}
                <View style={styles.streakGaugeWrap}>
                  <Text style={styles.streakGaugeText}>2 / 3</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* ===================== OTHER TABS: NATIJALAR - SHAXSIY NATIJALAR ===================== */}
          {activeTab === 'results' && resultsSubTab === 'personal' && (
            <View style={styles.resultsTabContainer}>
              {/* Sub-Tab Segment Switcher (Shaxsiy natijalar & Reyting) */}
              <View style={styles.resultsSegmentRow}>
                <TouchableOpacity
                  style={[
                    styles.resultsSegmentPill,
                    styles.resultsSegmentPillActive,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => setResultsSubTab('personal')}
                >
                  <Ionicons
                    name="person"
                    size={16}
                    color="#FFFFFF"
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    style={[
                      styles.resultsSegmentText,
                      styles.resultsSegmentTextActive,
                    ]}
                  >
                    Şaxsiy natijalar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.resultsSegmentPill}
                  activeOpacity={0.8}
                  onPress={() => setResultsSubTab('ranking')}
                >
                  <Ionicons
                    name="bar-chart-outline"
                    size={16}
                    color="#0F172A"
                    style={{ marginRight: 6 }}
                  />
                  <Text style={styles.resultsSegmentText}>
                    Reyting
                  </Text>
                </TouchableOpacity>
              </View>

              {/* ==================== SUB-TAB 1: SHAXSIY NATIJALAR ==================== */}
              <View style={styles.personalResultsWrap}>
                {/* 3. User Profile Dark Navy Card */}
                <View style={styles.userProfileDarkCard}>
                  <View style={styles.userProfileTopRow}>
                    {activeUser?.avatar ? (
                      <Image
                        source={{ uri: activeUser.avatar }}
                        style={styles.userProfileAvatar}
                        resizeMode="cover"
                      />
                    ) : (
                      <LinearGradient
                        colors={['#0284C7', '#0369A1']}
                        style={[styles.userProfileAvatar, { alignItems: 'center', justifyContent: 'center' }]}
                      >
                        <Text style={{ fontSize: 18, fontWeight: '800', color: '#FFFFFF' }}>{userInitial}</Text>
                      </LinearGradient>
                    )}

                    <View style={styles.userProfileNameCol}>
                      <Text style={styles.userProfileNameText}>{userDisplayName}</Text>
                      <View style={styles.userProfileCrownBadge}>
                        <FontAwesome5 name="crown" size={10} color="#FFFFFF" style={{ marginRight: 4 }} />
                        <Text style={styles.userProfileCrownText}>{activeUser?.role || 'Faol talaba'}</Text>
                      </View>
                    </View>

                    {/* Right Laurel Level Badge */}
                    <View style={styles.userProfileLevelWrap}>
                      <Text style={styles.userProfileLevelNum}>12</Text>
                      <Text style={styles.userProfileLevelLabel}>Daraja</Text>
                    </View>
                  </View>

                  {/* Progress: 680 / 1 000 XP */}
                  <View style={styles.userProfileXpRow}>
                    <Ionicons name="flash" size={14} color="#F59E0B" style={{ marginRight: 5 }} />
                    <Text style={styles.userProfileXpText}>680 / 1 000 XP</Text>
                  </View>

                  <View style={styles.userProfileProgressTrack}>
                    <View style={styles.userProfileProgressFill} />
                  </View>
                </View>

                {/* 4. 3-Box Stats Row */}
                <View style={styles.resultsThreeStatsRow}>
                  {/* Box 1: XP */}
                  <View style={styles.resultsStatBox}>
                    <Ionicons name="flash" size={19} color="#D97706" style={{ marginBottom: 4 }} />
                    <Text style={styles.resultsStatBoxVal}>7 840 XP</Text>
                    <Text style={styles.resultsStatBoxLbl}>Jami töplangan</Text>
                  </View>

                  {/* Box 2: Coins */}
                  <View style={styles.resultsStatBox}>
                    <FontAwesome5 name="coins" size={18} color="#D97706" style={{ marginBottom: 4 }} />
                    <Text style={styles.resultsStatBoxVal}>{userCoinsBalance.toLocaleString()}</Text>
                    <Text style={styles.resultsStatBoxLbl}>Coin balansi</Text>
                  </View>

                  {/* Box 3: Tests */}
                  <View style={styles.resultsStatBox}>
                    <Ionicons name="locate-outline" size={19} color="#D97706" style={{ marginBottom: 4 }} />
                    <Text style={styles.resultsStatBoxVal}>48</Text>
                    <Text style={styles.resultsStatBoxLbl}>Topşirilgan test</Text>
                  </View>
                </View>

                {/* 5. Maktab Do'koni Banner Card (Ideal, Yonib-o'chadigan Pulsing Glow Dizayn) */}
                <View style={styles.storeGlowCardOuter}>
                  {/* Glowing Animated Aura underneath */}
                  <Animated.View
                    style={[
                      styles.storeGlowAura,
                      {
                        opacity: storeGlowAnim,
                        transform: [
                          {
                            scale: storeGlowAnim.interpolate({
                              inputRange: [0.35, 1],
                              outputRange: [0.985, 1.025],
                            }),
                          },
                        ],
                      },
                    ]}
                  />

                  <TouchableOpacity
                    style={styles.maktabStoreCardModern}
                    activeOpacity={0.88}
                    onPress={() => {
                      setIsViewingSchoolStore(true);
                      setStoreActiveCategory(null);
                    }}
                  >
                    <View style={styles.storeCardIconWrap}>
                      <Image
                        source={schoolCapIcon}
                        style={styles.storeCardIconImg}
                        resizeMode="contain"
                      />
                    </View>

                    <View style={styles.maktabStoreTextCol}>
                      <Text style={styles.maktabStoreTitle}>Maktab Dökoni</Text>
                      <Text style={styles.maktabStoreSubtitle}>
                        Coin bilan avatar, ramka va eksklyuziv imtiyozlarni oling!
                      </Text>
                    </View>

                    <View style={styles.storeCardArrowCircle}>
                      <Ionicons name="chevron-forward" size={17} color="#7C3AED" />
                    </View>
                  </TouchableOpacity>
                </View>

                {/* 6. Testlar tarixi Card Section */}
                <View style={styles.resultsTestHistorySection}>
                  <View style={styles.resultsHistoryHeaderRow}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Ionicons name="time" size={18} color="#F59E0B" style={{ marginRight: 6 }} />
                      <Text style={styles.resultsHistoryTitle}>Testlar tarixi</Text>
                    </View>

                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => {
                        setActiveTab('tests');
                        setTestsTabSegment('history');
                      }}
                    >
                      <Text style={styles.resultsHistorySeeAll}>Barçasini köriş ›</Text>
                    </TouchableOpacity>
                  </View>

                  {/* List of 3 Tests */}
                  <View style={styles.resultsHistoryListWrap}>
                    {RESULTS_TEST_HISTORY.map((item) => (
                      <View key={item.id} style={styles.resultsHistoryItemCard}>
                        <View style={styles.resultsHistoryIconWrap}>
                          <Ionicons name={item.iconName as any} size={20} color="#0F172A" />
                        </View>

                        <View style={styles.resultsHistoryMidCol}>
                          <Text style={styles.resultsHistoryItemTitle}>{item.title}</Text>
                          <Text style={styles.resultsHistoryItemDate}>{item.date}</Text>
                        </View>

                        <View style={styles.resultsHistoryRightCol}>
                          <View style={styles.resultsHistoryXpPill}>
                            <Text style={styles.resultsHistoryXpText}>+{item.xpAward} XP</Text>
                          </View>
                          <Text style={styles.resultsHistoryScoreText}>{item.percentage}%</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      )}

      {/* ===================== HUQUQ MAKTABI MINI-APP BOTTOM NAVBAR ===================== */}
      {!selectedCourseDetail && !selectedLessonVideo && !isTakingCourseFinalTest && !isViewingTestResult && !isViewingReviewList && selectedReviewQuestionIndex === null && !isViewingCourseCompleted && !isViewingCertificate && !isViewingTestCategories && !isTakingCategoryTest && !isViewingCategoryResult && !selectedStoreDetailItem && (
        <View style={[styles.bottomNavbar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
          {/* Tab 1: Bosh sahifa */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => {
              setSelectedCourseDetail(null);
              setSelectedTopicDetail(null);
              setIsViewingSchoolStore(false);
              setActiveTab('home');
            }}
            activeOpacity={0.7}
          >
            {activeTab === 'home' && !selectedTopicDetail && !isViewingSchoolStore ? (
              <View style={styles.activePillContainer}>
                <Ionicons name="home" size={19} color="#D97706" />
              </View>
            ) : (
              <Ionicons name="home-outline" size={21} color="#4B5563" />
            )}
            <Text
              style={[
                styles.navLabel,
                activeTab === 'home' && !selectedTopicDetail && !isViewingSchoolStore ? styles.navLabelActive : styles.navLabelInactive,
              ]}
            >
              Boş sahifa
            </Text>
          </TouchableOpacity>

          {/* Tab 2: Mavzular */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => {
              setSelectedCourseDetail(null);
              setSelectedTopicDetail(null);
              setIsViewingSchoolStore(false);
              setActiveTab('topics');
            }}
            activeOpacity={0.7}
          >
            {(activeTab === 'topics' || selectedTopicDetail) && !isViewingSchoolStore ? (
              <View style={styles.activePillContainer}>
                <Ionicons name="book" size={19} color="#D97706" />
              </View>
            ) : (
              <Ionicons name="book-outline" size={21} color="#4B5563" />
            )}
            <Text
              style={[
                styles.navLabel,
                (activeTab === 'topics' || selectedTopicDetail) && !isViewingSchoolStore ? styles.navLabelActive : styles.navLabelInactive,
              ]}
            >
              Mavzular
            </Text>
          </TouchableOpacity>

          {/* Tab 3: Testlar */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => {
              setSelectedCourseDetail(null);
              setSelectedTopicDetail(null);
              setIsViewingSchoolStore(false);
              setActiveTab('tests');
            }}
            activeOpacity={0.7}
          >
            {activeTab === 'tests' && !selectedTopicDetail && !isViewingSchoolStore ? (
              <View style={styles.activePillContainer}>
                <Ionicons name="checkbox" size={19} color="#D97706" />
              </View>
            ) : (
              <Ionicons name="checkbox-outline" size={21} color="#4B5563" />
            )}
            <Text
              style={[
                styles.navLabel,
                activeTab === 'tests' && !selectedTopicDetail && !isViewingSchoolStore ? styles.navLabelActive : styles.navLabelInactive,
              ]}
            >
              Testlar
            </Text>
          </TouchableOpacity>

          {/* Tab 4: Natijalar / Do'kon */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => {
              setSelectedCourseDetail(null);
              setSelectedTopicDetail(null);
              if (isViewingSchoolStore) {
                setIsViewingSchoolStore(false);
              }
              setActiveTab('results');
            }}
            activeOpacity={0.7}
          >
            {isViewingSchoolStore ? (
              <View style={[styles.activePillContainer, { backgroundColor: '#EDE9FE' }]}>
                <Ionicons name="cart" size={19} color="#7C3AED" />
              </View>
            ) : activeTab === 'results' && !selectedTopicDetail ? (
              <View style={styles.activePillContainer}>
                <Ionicons name="bar-chart" size={19} color="#D97706" />
              </View>
            ) : (
              <Ionicons name="bar-chart-outline" size={21} color="#4B5563" />
            )}
            <Text
              style={[
                styles.navLabel,
                isViewingSchoolStore
                  ? { color: '#7C3AED', fontWeight: '700' }
                  : activeTab === 'results' && !selectedTopicDetail
                    ? styles.navLabelActive
                    : styles.navLabelInactive,
              ]}
            >
              {isViewingSchoolStore ? 'Dökon' : 'Natijalar'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ===================== KUN SAVOLI MODAL ===================== */}
      <Modal
        visible={quizModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setQuizModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setQuizModalVisible(false)}
          />

          <View style={styles.quizModalCard}>
            <View style={styles.quizModalHeader}>
              <View style={styles.quizModalBadges}>
                <View style={styles.xpPillBadge}>
                  <Text style={styles.xpPillText}>+5 XP</Text>
                </View>
                <View style={[styles.xpPillBadge, { backgroundColor: '#FEF3C7', marginLeft: 4 }]}>
                  <Text style={[styles.xpPillText, { color: '#B45309' }]}>+2 Coin</Text>
                </View>
              </View>
              <Text style={styles.quizModalTitle}>Kun savoli</Text>
              <TouchableOpacity onPress={() => setQuizModalVisible(false)}>
                <Ionicons name="close-circle" size={24} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <Text style={styles.quizModalQuestion}>
              Mehnat şartnomasining minimal muddati qança?
            </Text>

            <View style={styles.optionsList}>
              {[
                'Minimal muddat belgilanmagan (muddatli yoki muddatsiz)',
                '1 oy',
                '6 oy',
                '1 yil',
              ].map((opt, idx) => (
                <TouchableOpacity
                  key={`opt-${idx}`}
                  style={[
                    styles.quizOptionRow,
                    selectedAnswer === idx && styles.quizOptionRowSelected,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => handleQuizAnswer(idx)}
                >
                  <View style={styles.optionLetterBadge}>
                    <Text style={styles.optionLetterText}>
                      {String.fromCharCode(65 + idx)}
                    </Text>
                  </View>
                  <Text style={styles.optionText}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      {/* ===================== CATEGORY TEST START CONFIRMATION MODAL ===================== */}
      <Modal
        visible={!!selectedTestCategoryForModal}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedTestCategoryForModal(null)}
      >
        <View style={styles.catModalBackdrop}>
          <View style={styles.catModalCard}>
            {/* Glowing Icon */}
            <View style={styles.catModalIconWrap}>
              {selectedTestCategoryForModal?.iconFamily === 'FontAwesome5' ? (
                <FontAwesome5
                  name={selectedTestCategoryForModal.iconName as any}
                  size={30}
                  color="#D97706"
                />
              ) : (
                <Ionicons
                  name={(selectedTestCategoryForModal?.iconName as any) || 'people-outline'}
                  size={32}
                  color="#D97706"
                />
              )}
            </View>

            {/* Title & Description */}
            <Text style={styles.catModalTitle}>
              {selectedTestCategoryForModal?.title} testi
            </Text>
            <Text style={styles.catModalSubtitle}>
              Uşbu yönaliş böyiça bilimlaringizni sinovdan ötkazing va reytingingizni oşiring.
            </Text>

            {/* Quick Meta Badges */}
            <View style={styles.catModalStatsRow}>
              <View style={styles.catModalStatItem}>
                <Ionicons name="flash" size={14} color="#D97706" style={{ marginRight: 4 }} />
                <Text style={styles.catModalStatText}>+{selectedTestCategoryForModal?.xpAward || 40} XP</Text>
              </View>

              <Text style={styles.catModalStatDivider}>|</Text>

              <View style={styles.catModalStatItem}>
                <Ionicons name="help-circle-outline" size={14} color="#0F172A" style={{ marginRight: 4 }} />
                <Text style={styles.catModalStatText}>15 savol</Text>
              </View>

              <Text style={styles.catModalStatDivider}>|</Text>

              <View style={styles.catModalStatItem}>
                <Ionicons name="time-outline" size={14} color="#0F172A" style={{ marginRight: 4 }} />
                <Text style={styles.catModalStatText}>{selectedTestCategoryForModal?.durationMinutes || 12} daqiqa</Text>
              </View>
            </View>

            {/* Tip box */}
            <View style={styles.catModalInfoBox}>
              <Ionicons name="information-circle" size={18} color="#2563EB" style={{ marginRight: 8, marginTop: 1 }} />
              <Text style={styles.catModalInfoText}>
                Testni boşlaganingizdan söng vaqt hisoblanadi. Har bir töğri javob uçun XP beriladi.
              </Text>
            </View>

            {/* Buttons: Bekor qilish & Bajarish */}
            <View style={styles.catModalButtonsRow}>
              <TouchableOpacity
                style={styles.catModalCancelBtn}
                activeOpacity={0.7}
                onPress={() => setSelectedTestCategoryForModal(null)}
              >
                <Text style={styles.catModalCancelBtnText}>Bekor qiliş</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.catModalStartBtn}
                activeOpacity={0.85}
                onPress={() => {
                  const cat = selectedTestCategoryForModal;
                  setSelectedTestCategoryForModal(null);
                  if (cat) {
                    setActiveCategoryTest(cat);
                    setIsTakingCategoryTest(true);
                    setCategoryTestQuestionIndex(3); // 4-savol matching user upload
                    setCategoryTestAnswers({ 3: 2 }); // Option C pre-selected matching user upload
                    setCategoryTimerSeconds(684); // 11:24
                  }
                }}
              >
                <Text style={styles.catModalStartBtnText}>Bajariş</Text>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ===================== MAKTAB DO'KONI (SCHOOL STORE) MODAL ===================== */}
      <Modal
        visible={isStoreModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsStoreModalVisible(false)}
      >
        <View style={styles.storeModalBackdrop}>
          <View style={styles.storeModalCard}>
            <View style={styles.storeModalHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={resultsStoreImage} style={styles.storeModalHeaderImg} resizeMode="contain" />
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.storeModalTitle}>Maktab Dökoni</Text>
                  <Text style={styles.storeModalSubtitle}>Coin bilan imtiyozlar xarid qiling</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => setIsStoreModalVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close-circle" size={26} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            {/* Current Balance Banner */}
            <View style={styles.storeBalanceBanner}>
              <Text style={styles.storeBalanceLabel}>Sizning balansingiz:</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <FontAwesome5 name="coins" size={16} color="#D97706" style={{ marginRight: 6 }} />
                <Text style={styles.storeBalanceValue}>{userCoinsBalance.toLocaleString()} Coin</Text>
              </View>
            </View>

            {/* List of Store Items */}
            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 380 }}>
              {SCHOOL_STORE_ITEMS.map((item) => (
                <View key={item.id} style={styles.storeItemRow}>
                  <View style={[styles.storeItemIconWrap, { backgroundColor: '#FFFBEB' }]}>
                    <Ionicons name={item.iconName as any} size={22} color={item.iconColor} />
                  </View>

                  <View style={styles.storeItemInfoCol}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                      <Text style={styles.storeItemTitle}>{item.title}</Text>
                      {item.badge && (
                        <View style={styles.storeItemBadge}>
                          <Text style={styles.storeItemBadgeText}>{item.badge}</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.storeItemDesc}>{item.description}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.storeItemBuyBtn}
                    activeOpacity={0.8}
                    onPress={() => {
                      if (userCoinsBalance >= item.priceCoins) {
                        setUserCoinsBalance((prev) => prev - item.priceCoins);
                        Alert.alert('Tabriklaymiz! 🎉', `"${item.title}" muvaffaqiyatli xarid qilindi!`);
                      } else {
                        Alert.alert(
                          'Tangalar yetarli emas',
                          `Ushbu buyum uchun yana ${item.priceCoins - userCoinsBalance} ta coin kerak. Testlar topshirib ko‘proq tanga yig‘ing!`
                        );
                      }
                    }}
                  >
                    <FontAwesome5 name="coins" size={11} color="#FFFFFF" style={{ marginRight: 4 }} />
                    <Text style={styles.storeItemBuyBtnText}>{item.priceCoins}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ===================== ANIMATED ORDER SUCCESS CENTER ALERT MODAL ===================== */}
      <Modal
        visible={isOrderSuccessModalVisible}
        transparent
        animationType="none"
        onRequestClose={() => closeOrderSuccessModal(false)}
      >
        <View style={styles.successModalOverlay}>
          <Animated.View
            style={[
              styles.successModalBackdrop,
              {
                opacity: successModalOpacity,
              },
            ]}
          >
            <TouchableOpacity
              style={{ flex: 1 }}
              activeOpacity={1}
              onPress={() => closeOrderSuccessModal(false)}
            />
          </Animated.View>

          <Animated.View
            style={[
              styles.successModalCard,
              {
                opacity: successModalOpacity,
                transform: [{ scale: successModalScale }],
              },
            ]}
          >
            {/* Animated Glowing Icon Circle */}
            <Animated.View
              style={[
                styles.successIconOuterRing,
                orderSuccessDetails?.item.category === 'talim'
                  ? { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }
                  : orderSuccessDetails?.item.category === 'hamkorlar'
                    ? { backgroundColor: '#FAF5FF', borderColor: '#E9D5FF' }
                    : { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' },
                {
                  transform: [{ scale: successIconScale }],
                },
              ]}
            >
              <View
                style={[
                  styles.successIconInnerCircle,
                  orderSuccessDetails?.item.category === 'talim'
                    ? { backgroundColor: '#2563EB' }
                    : orderSuccessDetails?.item.category === 'hamkorlar'
                      ? { backgroundColor: '#7C3AED' }
                      : { backgroundColor: '#10B981' },
                ]}
              >
                <Ionicons
                  name={
                    orderSuccessDetails?.item.category === 'talim'
                      ? 'school'
                      : orderSuccessDetails?.item.category === 'hamkorlar'
                        ? 'gift'
                        : 'checkmark'
                  }
                  size={34}
                  color="#FFFFFF"
                />
              </View>
            </Animated.View>

            {/* Title */}
            <Text style={styles.successModalTitle}>
              {orderSuccessDetails?.item.category === 'talim'
                ? 'Imtiyoz faollaştirildi! 🎉'
                : orderSuccessDetails?.item.category === 'hamkorlar'
                  ? 'Kupon yaratildi! 🎉'
                  : 'Buyurtma qabul qilindi! 🎉'}
            </Text>

            {/* Order ID Pill */}
            <View style={styles.successOrderIdPill}>
              <Ionicons name="receipt-outline" size={13} color="#64748B" style={{ marginRight: 5 }} />
              <Text style={styles.successOrderIdText}>
                {orderSuccessDetails?.item.category === 'hamkorlar'
                  ? `KOD: ${orderSuccessDetails?.couponCode}`
                  : `ID: #${orderSuccessDetails?.orderId}`}
              </Text>
            </View>

            {/* Item summary card */}
            <View style={styles.successItemSummaryCard}>
              <View style={styles.successItemThumbWrap}>
                {orderSuccessDetails?.item.image ? (
                  <Image
                    source={orderSuccessDetails.item.image}
                    style={styles.successItemThumb}
                    resizeMode="cover"
                  />
                ) : (
                  <Ionicons
                    name={(orderSuccessDetails?.item.iconName as any) || 'sparkles'}
                    size={24}
                    color="#7C3AED"
                  />
                )}
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.successItemTitle} numberOfLines={1}>
                  {orderSuccessDetails?.item.title}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
                  <FontAwesome5 name="coins" size={12} color="#D97706" style={{ marginRight: 4 }} />
                  <Text style={styles.successItemSpentCoins}>
                    -{orderSuccessDetails?.totalCoins.toLocaleString()} Coin
                  </Text>
                  {orderSuccessDetails && orderSuccessDetails.quantity > 1 && (
                    <Text style={styles.successItemQty}> • {orderSuccessDetails.quantity} dona</Text>
                  )}
                </View>
              </View>
            </View>

            {/* Remaining Coins Info Box */}
            <View style={styles.successBalanceRow}>
              <Text style={styles.successBalanceLabel}>Qolgan balansingiz:</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <FontAwesome5 name="coins" size={13} color="#D97706" style={{ marginRight: 5 }} />
                <Text style={styles.successBalanceValue}>
                  {orderSuccessDetails?.remainingCoins.toLocaleString()} Coin
                </Text>
              </View>
            </View>

            {/* Helper message */}
            <Text style={styles.successNoticeMessage}>
              {orderSuccessDetails?.item.category === 'talim'
                ? 'Resurs profilingizga biriktirildi. Şaxsiy kabinetingizda istalgan vaqtda materiallardan töliq foydalanişingiz mumkin.'
                : orderSuccessDetails?.item.category === 'hamkorlar'
                  ? `Kupon kodingiz: ${orderSuccessDetails?.couponCode}\nUni hamkor filiallarida ko‘rsatib chegirmadan to‘liq foydalaning.`
                  : 'Operatorimiz 1-3 iş kuni içida boğlanadi yoki körsatilgan maktab punktidan olib ketişingiz mumkin.'}
            </Text>

            {/* Action Buttons */}
            <TouchableOpacity
              style={[
                styles.successModalBtn,
                orderSuccessDetails?.item.category === 'talim' && { backgroundColor: '#2563EB' },
              ]}
              activeOpacity={0.85}
              onPress={() => closeOrderSuccessModal(true)}
            >
              <Ionicons name="bag-check" size={17} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.successModalBtnText}>Mening mahsulotlarimda köriş</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.successModalSecondaryBtn}
              activeOpacity={0.7}
              onPress={() => closeOrderSuccessModal(false)}
            >
              <Text style={styles.successModalSecondaryBtnText}>Dökonda qoliş</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  // Top Header
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F8FAFC',
  },
  headerLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    padding: 4,
    marginRight: 8,
  },
  titleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerCapIcon: {
    width: 44,
    height: 44,
  },
  headerMainTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  headerTitleDark: {
    color: '#0B3A60', // to'q ko'k rang (media_1793986526714_7bba17f5)
  },
  headerTitleOrange: {
    color: '#EB5A00', // sabzi rang (media_1793986526714_7bba17f5)
  },
  headerRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  headerDotBadge: {
    position: 'absolute',
    top: 7,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F59E0B',
  },

  // Scroll Area
  scrollWrapper: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },

  // 1. Hero Swiper Carousel
  carouselContainer: {
    marginBottom: 10,
  },
  carouselScrollView: {
    overflow: 'visible',
  },
  carouselSlideCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 13,
    minHeight: 122,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  heroTextCol: {
    flex: 1,
    paddingRight: 6,
  },
  slideBadgeRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  slideBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  slideBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  greetingTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 3,
    lineHeight: 25,
    letterSpacing: -0.3,
  },
  greetingSubText: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16.5,
  },
  heroIllustrationImage: {
    width: 125,
    height: 105,
  },
  slideCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 19.5,
    marginBottom: 3,
  },
  slideCardSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    lineHeight: 15.5,
    marginBottom: 6,
  },
  slideActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  slideActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0284C7',
  },
  slideImageBox: {
    width: 76,
    height: 76,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginLeft: 10,
  },
  slideNewsImage: {
    width: '100%',
    height: '100%',
  },
  slideIconBox: {
    width: 76,
    height: 76,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  carouselPaginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 8,
  },
  carouselDot: {
    height: 5,
    borderRadius: 2.5,
  },
  carouselDotActive: {
    width: 20,
    backgroundColor: '#0284C7',
  },
  carouselDotInactive: {
    width: 6,
    backgroundColor: '#CBD5E1',
  },

  // 2. Minimalist Stats Bar
  homeStatsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 14,
  },
  homeLevelPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
  },
  homeRankTrophyWrap: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: '#D97706',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 2,
  },
  homeLevelStarWrap: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 2,
  },
  homeLevelTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 15,
  },
  homeLevelSubtitle: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
  },
  homeStatsRightPills: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  homeStatPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  homeStatPillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0F172A',
  },

  // 3. Active Course Card (Minimal Hero)
  activeCourseCard: {
    borderRadius: 22,
    padding: 16,
    shadowColor: '#00386E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 4,
  },
  activeCourseHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  activeCourseStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  activeCoursePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
    marginRight: 5,
  },
  activeCourseStatusText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  activeCourseCategoryTag: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#93C5FD',
  },
  activeCourseTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  activeCourseBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activeCourseProgressCol: {
    flex: 1,
    paddingRight: 14,
  },
  activeCourseProgressBarTrack: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 5,
  },
  activeCourseProgressBarFill: {
    height: '100%',
    backgroundColor: '#38BDF8',
    borderRadius: 3,
  },
  activeCourseMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeCourseMetaText: {
    fontSize: 11,
    color: '#E0F2FE',
    fontWeight: '600',
  },
  activeCourseMetaDot: {
    fontSize: 11,
    color: '#93C5FD',
    marginHorizontal: 5,
  },
  activeCoursePlayBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },

  // 4. Quick Actions (2 Items, Spacious)
  quickActionsGridTwo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    gap: 10,
  },
  quickActionTileTwo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  quickIconCircleTwo: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  quickActionBadgeTwo: {
    position: 'absolute',
    top: -4,
    right: -4,
    paddingHorizontal: 4,
    minWidth: 15,
    height: 15,
    borderRadius: 7.5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  quickActionBadgeTextTwo: {
    fontSize: 8,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  quickTileTitleTwo: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 1,
  },
  quickTileSubtitleTwo: {
    fontSize: 10,
    fontWeight: '500',
    color: '#64748B',
  },

  // 5. Featured Categories (2x2 Grid)
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#D97706',
  },
  sectionTitleWithPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionCountPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  sectionCountPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  featuredCategoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 10,
  },
  featuredCategoryCard: {
    width: (width - 32 - 10) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 1,
  },
  featuredCatTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  featuredCatIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredCatLevelBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  featuredCatLevelText: {
    fontSize: 9.5,
    fontWeight: '700',
  },
  featuredCatTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  featuredCatBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  featuredCatLessonsText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  featuredCatProgressPercent: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
  },
  featuredCatProgressTrack: {
    height: 4,
    backgroundColor: '#F1F5F9',
    borderRadius: 2,
    overflow: 'hidden',
  },
  featuredCatProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  viewAllTopicsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: 14,
    paddingVertical: 10,
    marginBottom: 16,
  },
  viewAllTopicsBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0284C7',
  },

  // 6. Minimal Daily Quiz Card
  dailyQuizMinimalCard: {
    backgroundColor: '#FFFDF7',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    padding: 14,
    marginBottom: 12,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  dailyQuizHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dailyQuizLabelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dailyQuizIconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  dailyQuizLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#B45309',
  },
  dailyQuizRewardsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dailyQuizRewardPill: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dailyQuizRewardText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0284C7',
  },
  xpPillBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  xpPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#B45309',
  },
  dailyQuizQuestion: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 18.5,
    marginBottom: 12,
  },
  dailyQuizCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F59E0B',
    borderRadius: 12,
    paddingVertical: 9,
  },
  dailyQuizCtaBtnDone: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  dailyQuizCtaBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#002B49',
  },
  dailyQuizCtaBtnTextDone: {
    color: '#047857',
  },

  // 7. Recommended Lessons
  recommendedCardsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
  },
  recommendedCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardImageContainer: {
    width: '100%',
    height: 84,
    backgroundColor: '#1E293B',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonCoverImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlayGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 30, 60, 0.25)',
  },
  lessonDurationPill: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  lessonDurationPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  handshakeGradientBox: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  lessonCardContent: {
    padding: 10,
  },
  lessonCardTag: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0284C7',
    marginBottom: 2,
  },
  lessonCardTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 16,
    marginBottom: 6,
    height: 32,
  },
  lessonMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lessonDurationText: {
    fontSize: 11,
    color: '#64748B',
  },

  // Mavzular Tab Styles (Fixed Header + Cards Scroll Underneath)
  topicsTabFullWrapper: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topicsFixedHeader: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingTop: 6,
    zIndex: 10,
    elevation: 3,
  },
  topicsScrollArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topicsGridScrollContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },

  // Search & Filter
  topicsSearchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  topicsSearchInputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    height: 44,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  topicsSearchInput: {
    flex: 1,
    fontSize: 13.5,
    color: '#0F172A',
    paddingVertical: 0,
  },
  topicsFilterBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },

  // Overall Progress Banner
  overallBanner: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    shadowColor: '#002B49',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  overallBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  overallStarBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  overallTextsCol: {
    flex: 1,
  },
  overallTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  overallSubtitle: {
    fontSize: 10.5,
    color: 'rgba(255,255,255,0.75)',
  },
  overallBannerRight: {
    alignItems: 'flex-end',
    width: 100,
  },
  overallPercentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginBottom: 4,
  },
  overallPercentText: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  overallBarTrack: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.22)',
    overflow: 'hidden',
  },
  overallBarFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 3,
  },

  // Level Filter Pills (Without Icons)
  levelPillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 8,
    backgroundColor: '#F8FAFC',
  },
  levelPill: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelPillActive: {
    backgroundColor: '#002B49',
  },
  levelPillInactive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  levelPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  levelPillTextActive: {
    color: '#FFFFFF',
  },
  levelPillTextInactive: {
    color: '#334155',
  },

  // Topics Grid
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  topicCard: {
    width: (width - 32 - 12) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    minHeight: 136,
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  topicCardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  topicCardIconWrap: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicCardTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 18,
    marginBottom: 6,
  },
  topicLessonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  topicLessonsText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  topicProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  topicProgressBarTrack: {
    flex: 1,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
  },
  topicProgressBarFill: {
    height: '100%',
    borderRadius: 2.5,
  },
  topicProgressPercentText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    width: 30,
    textAlign: 'right',
  },

  // Sub Tab Views (Tests, Results)
  subTabContainer: {
    paddingVertical: 10,
  },
  subTabTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  subTabSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 16,
  },
  testCardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  testIconBadge: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#F0F9FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  testName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  testInfo: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  startTestPill: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  startTestText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  achievementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achieveCard: {
    width: (width - 44) / 2,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  achieveNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0284C7',
    marginBottom: 4,
  },
  achieveLabel: {
    fontSize: 12,
    color: '#64748B',
  },

  // Bottom Navbar (Matching screenshot)
  bottomNavbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 10,
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
    borderRadius: 16,
    marginBottom: 2,
  },
  navLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  navLabelActive: {
    color: '#D97706',
    fontWeight: '700',
  },
  navLabelInactive: {
    color: '#4B5563',
    fontWeight: '500',
  },

  // Quiz Modal
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
  quizModalCard: {
    width: '100%',
    maxWidth: 390,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 20,
  },
  quizModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  quizModalBadges: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quizModalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  quizModalQuestion: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    lineHeight: 20,
    marginBottom: 16,
  },
  optionsList: {
    gap: 8,
  },
  quizOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  quizOptionRowSelected: {
    borderColor: '#0284C7',
    backgroundColor: '#F0F9FF',
  },
  optionLetterBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  optionLetterText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  optionText: {
    flex: 1,
    fontSize: 12.5,
    color: '#1E293B',
    lineHeight: 17,
  },
  headerScaleIcon: {
    width: 26,
    height: 26,
    marginRight: 6,
  },

  // ===================== DETAIL VIEW STYLES =====================
  detailFullWrapper: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  detailFixedTopSection: {
    backgroundColor: '#F8FAFC',
    zIndex: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E2E8F0',
  },
  detailScrollArea: {
    flex: 1,
  },
  detailScrollContent: {
    paddingTop: 8,
  },
  detailHeroContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 8,
    minHeight: 125,
  },
  detailHeroTextCol: {
    width: '63%',
    zIndex: 2,
  },
  detailTitle: {
    fontSize: 25,
    fontWeight: '800',
    color: '#0A192F',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  detailSubtitle: {
    fontSize: 11.5,
    fontWeight: '400',
    color: '#475569',
    lineHeight: 16,
    marginBottom: 8,
  },
  detailBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 18,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  detailBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
  },
  detailBadgeDivider: {
    fontSize: 12,
    color: '#CBD5E1',
    marginHorizontal: 8,
  },
  courtBuildingWrap: {
    position: 'absolute',
    right: -10,
    top: -5,
    width: 155,
    height: 125,
    zIndex: 1,
  },
  courtBuildingImage: {
    width: '100%',
    height: '100%',
  },

  // 2. O‘zlashtirish darajasi Card
  detailProgressCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    shadowColor: '#022B52',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 4,
  },
  detailProgressLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  progressRingWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3.5,
    borderColor: '#F59E0B',
    borderLeftColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  progressRingText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
  detailProgressTexts: {
    flex: 1,
  },
  detailProgressTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  detailProgressSubtitle: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '400',
  },
  detailStatsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  detailStatsLinkText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '600',
    marginRight: 2,
  },

  // 3. Sub-tabs
  detailSubTabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 8,
  },
  detailSubTabBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  detailSubTabBtnActive: {
    backgroundColor: '#0F1E36',
  },
  detailSubTabBtnInactive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  detailSubTabText: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  detailSubTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  detailSubTabTextInactive: {
    color: '#475569',
  },

  // 4. Courses section
  coursesSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  coursesSectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  coursesSortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coursesSortText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  coursesList: {
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 16,
  },
  courseItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  courseIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  interlockingRings: {
    width: 24,
    height: 20,
    position: 'relative',
    justifyContent: 'center',
  },
  ringLeft: {
    position: 'absolute',
    left: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#D97706',
  },
  ringRight: {
    position: 'absolute',
    left: 8,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  courseInfoCol: {
    flex: 1,
    justifyContent: 'center',
  },
  courseTitleText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 5,
  },
  courseMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  courseMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  courseMetaText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  courseProgressCol: {
    width: 65,
    alignItems: 'flex-end',
    marginRight: 4,
  },
  courseProgressPercent: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 4,
  },
  courseProgressTrack: {
    width: '100%',
    height: 5,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  courseProgressFill: {
    height: '100%',
    borderRadius: 3,
  },

  // 5. Bottom Mini Player Card
  playerCardContainer: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#002B49',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  playerCardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  playerLeftBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    zIndex: 2,
  },
  playerPlayCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  playerTextStack: {
    flex: 1,
  },
  playerTopLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#93C5FD',
    marginBottom: 2,
  },
  playerLessonTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  playerLessonMeta: {
    fontSize: 11,
    color: '#94A3B8',
  },
  playerRightBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
  },
  playerWatermark: {
    position: 'absolute',
    right: 32,
    top: -20,
    width: 80,
    height: 80,
    opacity: 0.22,
    borderRadius: 40,
  },
  playerNextBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 6. Alternative Sub-tabs: Darslar ro'yxati, Testlar, Statistika
  detailAltTabContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  detailAltTabTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  lessonListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  lessonListItemText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
    marginLeft: 10,
  },
  statsSummaryBox: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },

  // ===================== COURSE DETAIL SCREEN STYLES (1:1 DESIGN) =====================
  courseDetailScrollArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  courseDetailContentContainer: {
    paddingTop: 8,
  },
  courseBreadcrumbRow: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  courseBreadcrumbPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  courseBreadcrumbText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
  },
  courseHeroContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
    minHeight: 105,
  },
  courseHeroLeftCol: {
    width: '60%',
    zIndex: 2,
  },
  courseHeroTitle: {
    fontSize: 23,
    fontWeight: '800',
    color: '#0A192F',
    letterSpacing: -0.5,
    lineHeight: 28,
    marginBottom: 6,
  },
  courseHeroSubtitle: {
    fontSize: 11.5,
    fontWeight: '400',
    color: '#475569',
    lineHeight: 16.5,
  },
  courseHeroImageWrap: {
    position: 'absolute',
    right: -5,
    top: -10,
    width: 150,
    height: 115,
    zIndex: 1,
  },
  courseHeroImage: {
    width: '100%',
    height: '100%',
  },
  courseBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 6,
    marginBottom: 14,
  },
  courseMetaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  courseMetaBadgeText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#0F172A',
  },
  courseXpBadge: {
    backgroundColor: '#FEF9C3',
    borderColor: '#FEF08A',
  },
  courseXpBadgeText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#B45309',
  },
  courseProgressBanner: {
    marginHorizontal: 16,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#052544',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 4,
  },
  courseRingWrap: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3.5,
    borderColor: '#F59E0B',
    borderLeftColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  courseRingText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  courseProgressRightCol: {
    flex: 1,
  },
  courseProgressTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  courseProgressSubtitle: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '400',
    marginBottom: 7,
  },
  courseLinearTrack: {
    width: '100%',
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  courseLinearFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 3,
  },
  courseSubTabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  courseSubTabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
  },
  courseSubTabBtnActive: {
    backgroundColor: '#0F1E36',
  },
  courseSubTabBtnInactive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  courseSubTabText: {
    fontSize: 12,
    fontWeight: '600',
  },
  courseSubTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  courseSubTabTextInactive: {
    color: '#475569',
  },
  lessonsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  lessonsSectionTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  lessonsCompletedRatio: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D97706',
  },
  lessonsTimelineContainer: {
    position: 'relative',
    paddingHorizontal: 16,
    paddingTop: 4,
    gap: 12,
  },
  timelineVerticalLine: {
    position: 'absolute',
    left: 27,
    top: 20,
    bottom: 30,
    width: 2,
    backgroundColor: '#10B981',
    zIndex: 1,
  },
  lessonRowWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
  },
  timelineNodeWrap: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    zIndex: 2,
  },
  completedCheckCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inProgressPlayCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockedNodeCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonCardItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  lessonCardItemActive: {
    borderColor: '#FDE68A',
    backgroundColor: '#FFFDF5',
  },
  lessonThumbImage: {
    width: 56,
    height: 42,
    borderRadius: 8,
    marginRight: 10,
  },
  lessonDetailsCol: {
    flex: 1,
    justifyContent: 'center',
  },
  lessonTitleText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 16,
    marginBottom: 3,
  },
  lessonDurationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lessonDurationNum: {
    fontSize: 11,
    color: '#64748B',
  },
  completedStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  completedStatusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#10B981',
  },
  continueActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 10,
  },
  continueActionText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  finalTestCard: {
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  finalTestIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  finalTestTextsCol: {
    flex: 1,
  },
  finalTestTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  finalTestSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
  },
  finalTestLockCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  courseTabContentBox: {
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  courseTabSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  courseTabDescriptionText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 19,
  },

  /* ===================== VIDEO LESSON SCREEN STYLES (1:1 DESIGN) ===================== */
  videoHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  headerScaleIconSmall: {
    width: 28,
    height: 28,
  },
  videoHeaderTitlesCol: {
    justifyContent: 'center',
    flex: 1,
  },
  videoHeaderMainTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 18,
  },
  videoHeaderSubTitle: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 14,
  },
  headerIconBtnSmall: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoLessonScreenContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  videoLessonScrollArea: {
    flex: 1,
  },
  videoLessonContentContainer: {
    paddingTop: 8,
  },
  videoPlayerContainer: {
    marginHorizontal: 16,
    marginTop: 4,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#0A1326',
    height: 210,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  videoPlayerImage: {
    width: '100%',
    height: '100%',
  },
  videoTouchOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoBigPlayBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(254, 243, 199, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  videoControlsOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 38,
    backgroundColor: 'rgba(8, 15, 30, 0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  videoControlPlayBtn: {
    padding: 4,
  },
  videoTimeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#E2E8F0',
    marginHorizontal: 6,
  },
  videoProgressTrack: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderRadius: 2,
    position: 'relative',
    marginRight: 8,
    justifyContent: 'center',
  },
  videoProgressFill: {
    height: 3,
    backgroundColor: '#F59E0B',
    borderRadius: 2,
  },
  videoProgressKnob: {
    position: 'absolute',
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#F59E0B',
    top: -3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  videoSpeedBtn: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 4,
  },
  videoSpeedText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '700',
  },
  videoCcBtn: {
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    marginRight: 6,
  },
  videoCcText: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  videoSmallControlBtn: {
    padding: 3,
    marginRight: 3,
  },
  videoMetaHeaderRow: {
    marginTop: 14,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  videoMetaLeftCol: {
    flex: 1,
    paddingRight: 8,
  },
  videoLessonTitle: {
    fontSize: 16.5,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  videoLessonSubtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  videoCourseNameText: {
    fontSize: 12,
    color: '#64748B',
  },
  videoDotDivider: {
    fontSize: 12,
    color: '#94A3B8',
    marginHorizontal: 5,
  },
  videoDurationText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  videoCompletedBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1FAE5',
    alignSelf: 'flex-start',
  },
  videoCompletedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  videoSubTabsRow: {
    marginTop: 14,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  videoSubTabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 13,
    borderRadius: 20,
  },
  videoSubTabBtnActive: {
    backgroundColor: '#002B49',
  },
  videoSubTabBtnInactive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  videoSubTabText: {
    fontSize: 12,
    fontWeight: '600',
  },
  videoSubTabTextActive: {
    color: '#FFFFFF',
  },
  videoSubTabTextInactive: {
    color: '#475569',
  },
  lessonAboutCard: {
    marginTop: 14,
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  cardHeaderWithIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardHeaderTitleText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  lessonAboutBodyText: {
    fontSize: 12.5,
    color: '#475569',
    lineHeight: 18.5,
  },
  lessonPlanCard: {
    marginTop: 12,
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  planCardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  planHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  planHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  planDurationText: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '500',
  },
  chaptersListWrap: {
    gap: 4,
  },
  chapterItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  chapterItemRowActive: {
    backgroundColor: '#FEF3C7',
  },
  chapterPlayCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  chapterPlayCircleActive: {
    backgroundColor: '#D97706',
  },
  chapterPlayCircleInactive: {
    backgroundColor: '#F1F5F9',
  },
  chapterTitleText: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: '500',
    color: '#1E293B',
    marginRight: 8,
  },
  chapterTitleTextActive: {
    fontWeight: '700',
    color: '#0F172A',
  },
  chapterTimeRangeText: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '500',
  },
  notesTextInput: {
    marginTop: 6,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    color: '#0F172A',
    minHeight: 90,
    textAlignVertical: 'top',
  },
  saveNotesBtn: {
    marginTop: 10,
    backgroundColor: '#002B49',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveNotesBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  materialItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  materialItemName: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 2,
  },
  materialItemSize: {
    fontSize: 11,
    color: '#64748B',
  },
  videoBottomNavRow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 3,
  },
  videoNavPrevBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 20,
  },
  videoNavBtnDisabled: {
    opacity: 0.45,
    borderColor: '#F1F5F9',
  },
  videoNavPrevText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
  },
  videoNavTextDisabled: {
    color: '#94A3B8',
  },
  videoStepperCol: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoStepperText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  videoStepperDashesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  videoStepperDash: {
    width: 14,
    height: 3,
    borderRadius: 2,
  },
  videoStepperDashActive: {
    backgroundColor: '#F59E0B',
  },
  videoStepperDashInactive: {
    backgroundColor: '#E2E8F0',
  },
  videoNavNextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#002B49',
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 20,
  },
  videoNavNextText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  /* ===================== FINAL TEST SCREEN STYLES (1:1 DESIGN) ===================== */
  testScreenContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    position: 'relative',
  },
  testGlowShape: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#E0F2FE',
    opacity: 0.6,
  },
  testScrollArea: {
    flex: 1,
  },
  testContentContainer: {
    paddingTop: 4,
  },
  testBannerCard: {
    marginHorizontal: 16,
    marginTop: 6,
    backgroundColor: '#0A2342',
    borderRadius: 20,
    padding: 18,
    paddingBottom: 16,
    position: 'relative',
    overflow: 'visible',
    shadowColor: '#002B49',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  testBannerTextCol: {
    maxWidth: '70%',
  },
  testBannerTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  testBannerSubtitle: {
    fontSize: 12,
    color: '#CBD5E1',
    lineHeight: 17,
    marginBottom: 16,
  },
  testMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  testMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  testMetaText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  testMetaDivider: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 8,
  },
  testClipboardImg: {
    position: 'absolute',
    right: 0,
    top: -16,
    width: 150,
    height: 135,
  },
  questionCardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginHorizontal: 16,
    marginTop: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  questionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  questionNumberText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  timerPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  testProgressTrack: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    marginTop: 14,
    marginBottom: 18,
    overflow: 'hidden',
  },
  testProgressFill: {
    height: 6,
    backgroundColor: '#D97706',
    borderRadius: 3,
  },
  questionTitleText: {
    fontSize: 15.5,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 22,
    marginBottom: 16,
  },
  optionsListWrap: {
    gap: 10,
  },
  optionCardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  optionCardBtnActive: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1.5,
    borderColor: '#D97706',
  },
  optionCardBtnInactive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
  },
  optionCardText: {
    fontSize: 14,
    flex: 1,
  },
  optionCardTextActive: {
    color: '#0F172A',
    fontWeight: '700',
  },
  optionCardTextInactive: {
    color: '#1E293B',
    fontWeight: '500',
  },
  testBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 3,
  },
  testBottomLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  testActionSquareBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  testActionSquareBtnActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  testBottomRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  testNavPrevBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 22,
  },
  testNavBtnDisabled: {
    opacity: 0.45,
    borderColor: '#F1F5F9',
  },
  testNavPrevText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  testNavTextDisabled: {
    color: '#94A3B8',
  },
  testNavNextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#002B49',
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 22,
  },
  testNavNextText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  startFinalTestBtn: {
    marginTop: 14,
    backgroundColor: '#002B49',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  startFinalTestBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* ===================== TEST RESULT SCREEN STYLES (1:1 DESIGN) ===================== */
  resultScreenContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    position: 'relative',
  },
  resultScrollArea: {
    flex: 1,
  },
  resultContentContainer: {
    paddingTop: 4,
  },
  resultBannerCard: {
    marginHorizontal: 16,
    marginTop: 6,
    backgroundColor: '#0A2342',
    borderRadius: 20,
    padding: 18,
    paddingBottom: 20,
    position: 'relative',
    overflow: 'visible',
    shadowColor: '#002B49',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  resultBannerTextCol: {
    maxWidth: '68%',
  },
  resultStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.22)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  resultStatusPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#34D399',
  },
  resultBannerTitle: {
    fontSize: 23,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  resultBannerSubtitle: {
    fontSize: 12.5,
    color: '#CBD5E1',
    lineHeight: 17.5,
  },
  resultMedalImg: {
    position: 'absolute',
    right: 0,
    top: -14,
    width: 175,
    height: 145,
  },
  resultMetricsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginHorizontal: 16,
    marginTop: 14,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  metricRingCol: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricRingWrapper: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 3.5,
    borderColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  metricPercentageText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  metricItemCol: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricPrimaryValue: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 3,
  },
  metricPrimaryValueSmall: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  metricLabelText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  metricIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  resultBreakdownCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginHorizontal: 16,
    marginTop: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  breakdownHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  breakdownHeaderTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  breakdownRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breakdownRowText: {
    fontSize: 13,
    color: '#1E293B',
    fontWeight: '500',
  },
  breakdownCorrectCountText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#10B981',
  },
  breakdownWrongCountText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#EF4444',
  },
  breakdownUnansweredCountText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  breakdownDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 10,
  },
  rewardCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 18,
    marginHorizontal: 16,
    marginTop: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rewardLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardTitleText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  rewardPillsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardPill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginLeft: 6,
  },
  rewardPillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#B45309',
  },
  nextStepsSection: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  nextStepsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  nextStepsHeaderTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  completeCourseActionBtn: {
    backgroundColor: '#002B49',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    shadowColor: '#002B49',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  actionBtnLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completeCourseActionText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '700',
  },
  reviewAnswersActionBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  reviewAnswersActionText: {
    color: '#0F172A',
    fontSize: 13.5,
    fontWeight: '700',
  },

  /* ===================== TEST REVIEW SCREENS STYLES (PHONE 2 & PHONE 3) ===================== */
  reviewListScreenContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  reviewTabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    gap: 10,
  },
  reviewTabBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  reviewTabBtnActive: {
    backgroundColor: '#002B49',
  },
  reviewTabBtnInactive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  reviewTabText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  reviewTabTextActive: {
    color: '#FFFFFF',
  },
  reviewTabTextInactive: {
    color: '#475569',
  },
  reviewListScrollArea: {
    flex: 1,
  },
  reviewListContentContainer: {
    paddingTop: 6,
    paddingHorizontal: 16,
  },
  reviewItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 10,
    borderWidth: 1,
  },
  reviewItemCardCorrect: {
    backgroundColor: '#FFFFFF',
    borderColor: '#F1F5F9',
  },
  reviewItemCardWrong: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FEE2E2',
  },
  reviewItemNumBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  reviewItemNumBadgeCorrect: {
    backgroundColor: '#F8FAFC',
  },
  reviewItemNumBadgeWrong: {
    backgroundColor: '#FEE2E2',
  },
  reviewItemNumText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  reviewItemTextsCol: {
    flex: 1,
    marginRight: 8,
  },
  reviewItemQuestionText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  reviewItemStatusText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  reviewItemStatusCorrect: {
    color: '#10B981',
  },
  reviewItemStatusWrong: {
    color: '#EF4444',
  },
  reviewItemRightCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewDetailScreenContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  reviewDetailScrollArea: {
    flex: 1,
  },
  reviewDetailContentContainer: {
    paddingTop: 8,
  },
  reviewDetailQuestionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginHorizontal: 16,
    marginTop: 4,
    padding: 18,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  reviewStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 4,
  },
  reviewStatusPillCorrect: {
    backgroundColor: '#ECFDF5',
    borderColor: '#D1FAE5',
  },
  reviewStatusPillWrong: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FEE2E2',
  },
  reviewStatusPillText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  reviewStatusTextCorrect: {
    color: '#10B981',
  },
  reviewStatusTextWrong: {
    color: '#EF4444',
  },
  reviewQuestionTitleText: {
    fontSize: 16.5,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 24,
    marginTop: 10,
    marginBottom: 16,
  },
  reviewOptionsListWrap: {
    gap: 10,
  },
  reviewOptionBase: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 14,
  },
  reviewOptionNormal: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
  },
  reviewOptionCorrect: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#10B981',
  },
  reviewOptionWrong: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1.5,
    borderColor: '#EF4444',
  },
  reviewOptionText: {
    fontSize: 14,
    flex: 1,
  },
  explanationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginHorizontal: 16,
    marginTop: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  explanationHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  explanationHeaderTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  explanationBodyText: {
    fontSize: 12.5,
    color: '#475569',
    lineHeight: 19.5,
  },

  // Header additions
  headerCertificateTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  headerCompletedTitle: {
    fontSize: 16.5,
    fontWeight: '700',
    color: '#0F172A',
    marginLeft: 8,
  },

  // 1. Certificate Screen Styles
  certificateScreenContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  certificateScrollArea: {
    flex: 1,
  },
  certificateContentContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  certificatePaperCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 6,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  certificateImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 266 / 370,
    borderRadius: 14,
  },
  certificateActionsContainer: {
    marginTop: 18,
    gap: 10,
  },
  certificateDownloadBtn: {
    backgroundColor: '#002B49',
    borderRadius: 14,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#002B49',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  certificateDownloadBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  certificateShareBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  certificateShareBtnText: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '600',
  },

  // 2. Course Completed Screen Styles
  courseCompleteScreenContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  courseCompleteScrollArea: {
    flex: 1,
  },
  courseCompleteContentContainer: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  courseCompleteHeroCard: {
    backgroundColor: '#0A2342',
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#0A2342',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  courseCompleteCapImage: {
    width: 190,
    height: 95,
    marginBottom: 8,
  },
  courseCompleteTitle: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: '800',
    textAlign: 'center',
  },
  courseCompleteSubtitle: {
    color: '#CBD5E1',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
    paddingHorizontal: 10,
  },
  courseCompleteMetricsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginTop: 14,
    paddingVertical: 16,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  metricGaugeCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeCircleWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 4.5,
    borderColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FDF4',
  },
  gaugePercentNumber: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  metricCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricBigNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 3,
  },
  metricColLabel: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 3,
    textAlign: 'center',
  },
  metricVerticalDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#F1F5F9',
  },
  courseCompleteActionsContainer: {
    marginTop: 16,
    gap: 10,
  },
  courseCompletePrimaryBtn: {
    backgroundColor: '#002B49',
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#002B49',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  courseCompletePrimaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  courseCompleteSecondaryBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  courseCompleteSecondaryBtnText: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '600',
  },

  // 3. Testlar Tarixi & Segment Styles
  testsSegmentRow: {
    flexDirection: 'row',
    backgroundColor: '#EEF2F6',
    borderRadius: 12,
    padding: 3,
    marginVertical: 12,
  },
  testsSegmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 9,
  },
  testsSegmentBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  testsSegmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  testsSegmentTextActive: {
    color: '#002B49',
    fontWeight: '700',
  },
  historySectionContainer: {
    marginTop: 4,
    gap: 12,
  },
  historyFiltersRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  historyFilterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
  },
  historyFilterPillActive: {
    backgroundColor: '#002B49',
  },
  historyFilterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  historyFilterTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  historyCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  historyCardTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  historyCardCategory: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  historyStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  historyStatusPassed: {
    backgroundColor: '#ECFDF5',
  },
  historyStatusRetake: {
    backgroundColor: '#FEF2F2',
  },
  historyStatusText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  historyStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  historyStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  historyStatValue: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  historyStatLabel: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  historyStatDivider: {
    width: 1,
    height: 18,
    backgroundColor: '#E2E8F0',
  },
  historyRewardsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  historyRewardPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  historyRewardText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  historyActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  historyActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#002B49',
    backgroundColor: '#FFFFFF',
  },
  historyCertActionBtn: {
    borderColor: '#F59E0B',
    backgroundColor: '#FFFBEB',
  },
  historyActionBtnText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#002B49',
  },

  // 4. Legacy Results Tab History List Styles
  legacyResultsHistorySection: {
    marginTop: 18,
  },
  legacyResultsHistoryHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  legacyResultsHistoryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  legacyResultsHistorySeeAll: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#0284C7',
  },
  historyMiniCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  historyMiniLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  historyMiniScoreBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyMiniScoreText: {
    fontSize: 13,
    fontWeight: '800',
  },
  historyMiniTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  historyMiniSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  historyMiniIconBtn: {
    padding: 6,
    marginLeft: 4,
  },

  // 5. Testlar Tab (1:1 Design matching user mockup)
  testTabHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 4,
  },
  headerMaktabiTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginLeft: 8,
  },
  testsScreenContainer: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  testHeroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingTop: 4,
  },
  testHeroTextCol: {
    flex: 1,
    paddingRight: 8,
  },
  testHeroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  testHeroSubtitle: {
    fontSize: 13.5,
    color: '#64748B',
    lineHeight: 19.5,
    marginTop: 4,
  },
  testHeroXpImage: {
    width: 110,
    height: 80,
  },
  goalCardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1.5,
    marginBottom: 18,
  },
  goalCardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  goalLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalFlashIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFBEB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  goalTextCol: {
    justifyContent: 'center',
  },
  goalTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  goalScoreText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  goalGiftBoxWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFBEB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  goalProgressBarTrack: {
    width: '100%',
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EEF2F6',
    overflow: 'hidden',
  },
  goalProgressBarFill: {
    width: '50%',
    height: '100%',
    borderRadius: 5,
  },
  testSectionWrap: {
    marginBottom: 18,
  },
  sectionHeaderTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionHeaderTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  tezkorBannerCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#0B2239',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 3,
  },
  tezkorBannerGradient: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tezkorTimerPill: {
    width: 62,
    height: 62,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tezkorTimerText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 3,
  },
  tezkorTextCol: {
    flex: 1,
    marginLeft: 14,
  },
  tezkorTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  tezkorSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 4,
  },
  tezkorPlayCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryCardsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 2,
  },
  categoryCardItem: {
    width: 88,
    height: 102,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  categoryCardLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 14,
  },
  categoryMorePill: {
    width: 34,
    height: 102,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakCardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
    marginBottom: 14,
  },
  streakLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  streakFlameWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#FFFBEB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  streakTextCol: {
    flex: 1,
  },
  streakTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  streakSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 3,
  },
  streakGaugeWrap: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 5,
    borderColor: '#FEF3C7',
    borderTopColor: '#F59E0B',
    borderRightColor: '#F59E0B',
    borderBottomColor: '#F59E0B',
    borderLeftColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  streakGaugeText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  testHistoryFooterLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 4,
  },
  testHistoryFooterLinkText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0284C7',
  },

  /* ===================== BO'LIMLAR BO'YICHA TESTLAR (1:1 DESIGN) ===================== */
  categoriesScreenContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  categoriesScrollArea: {
    flex: 1,
  },
  categoriesContentContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  categoriesHeroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
    marginTop: 4,
  },
  categoriesHeroTextCol: {
    flex: 1,
    paddingRight: 12,
  },
  categoriesHeroMainTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  categoriesHeroSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    lineHeight: 18,
  },
  categoriesHeroImage: {
    width: 85,
    height: 85,
  },
  categoriesListWrap: {
    gap: 12,
  },
  catCardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  catCardItemHighlighted: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FEF3C7',
    borderWidth: 1.5,
  },
  catCardIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  catCardIconWrapHighlighted: {
    backgroundColor: '#FEF3C7',
  },
  catCardMiddleCol: {
    flex: 1,
    justifyContent: 'center',
  },
  catCardTitleText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  catCardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  catCardMetaText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
  catCardMetaDot: {
    fontSize: 12,
    color: '#94A3B8',
    marginHorizontal: 6,
  },
  catCardRightCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  catCardXpPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4.5,
    borderRadius: 12,
  },
  catCardXpText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309',
  },

  /* ===================== CATEGORY TEST & MODAL (1:1 DESIGN - media_1794316514481_dac518e9.jpg) ===================== */
  catTestHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  catTestHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  catModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 22,
  },
  catModalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 8,
  },
  catModalIconWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#FDE68A',
  },
  catModalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  catModalSubtitle: {
    fontSize: 13.5,
    fontWeight: '500',
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 19,
    paddingHorizontal: 8,
  },
  catModalStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  catModalStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  catModalStatText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  catModalStatDivider: {
    fontSize: 14,
    color: '#CBD5E1',
  },
  catModalInfoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EFF6FF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  catModalInfoText: {
    flex: 1,
    fontSize: 12,
    color: '#1E40AF',
    lineHeight: 17,
    fontWeight: '500',
  },
  catModalButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
  },
  catModalCancelBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catModalCancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  catModalStartBtn: {
    flex: 1.3,
    backgroundColor: '#0B2239',
    paddingVertical: 14,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0B2239',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  catModalStartBtnText: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  catTestScreenContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  catTestScrollArea: {
    flex: 1,
  },
  catTestContentContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  catTestStatsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
    marginBottom: 16,
  },
  catTestXpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: 12,
  },
  catTestXpText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#B45309',
  },
  catTestStatsDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#E2E8F0',
  },
  catTestStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  catTestStatText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  catTestProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  catTestProgressTrack: {
    flex: 1,
    height: 7,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  catTestProgressFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 4,
  },
  catTestProgressCounter: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
    marginLeft: 14,
  },
  catTestQuestionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 16,
  },
  catTestCardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  catTestQuestionNumPill: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  catTestQuestionNumText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#3B82F6',
  },
  catTestTimerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  catTestTimerText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#B45309',
  },
  catTestQuestionTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 24,
    marginBottom: 16,
  },
  catTestOptionsList: {
    gap: 10,
  },
  catTestOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  catTestOptionItemDefault: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  catTestOptionItemSelected: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1.5,
    borderColor: '#F59E0B',
  },
  catTestRadioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: '#FFFFFF',
  },
  catTestRadioCircleSelected: {
    borderColor: '#D97706',
    borderWidth: 2,
    backgroundColor: '#FFFBEB',
  },
  catTestRadioInnerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D97706',
  },
  catTestOptionText: {
    flex: 1,
    fontSize: 14.5,
    fontWeight: '600',
    color: '#1E293B',
    lineHeight: 20,
  },
  catTestOptionTextSelected: {
    color: '#0F172A',
    fontWeight: '800',
  },
  catTestActionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 22,
  },
  catTestSecondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 12,
    borderRadius: 16,
  },
  catTestSecondaryBtnActive: {
    borderColor: '#FDE68A',
    backgroundColor: '#FFFBEB',
  },
  catTestSecondaryBtnText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#0F172A',
  },
  catTestFixedBottomBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingHorizontal: 20,
    paddingTop: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 8,
  },
  catTestNavButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
  },
  catTestPrevBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 14,
    borderRadius: 22,
  },
  catTestNavBtnDisabled: {
    opacity: 0.45,
  },
  catTestPrevBtnText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  catTestNextBtn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0B2239',
    paddingVertical: 14,
    borderRadius: 22,
    shadowColor: '#0B2239',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  catTestNextBtnDisabled: {
    backgroundColor: '#E2E8F0',
    shadowOpacity: 0,
    elevation: 0,
  },
  catTestNextBtnText: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  catTestNextBtnTextDisabled: {
    color: '#94A3B8',
  },

  // ===================== NATIJALAR (RESULTS) TAB (media_1794320729104_16e9f97e.jpg) =====================
  resultsTabContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 28,
  },
  resultsHeroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  resultsHeroTextCol: {
    flex: 1,
    paddingRight: 10,
  },
  resultsHeroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  resultsHeroSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: '#64748B',
    fontWeight: '500',
  },
  resultsHeroTrophyImg: {
    width: 90,
    height: 90,
  },
  resultsSegmentRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 4,
    marginBottom: 18,
  },
  resultsSegmentPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 11,
  },
  resultsSegmentPillActive: {
    backgroundColor: '#0F172A',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  resultsSegmentText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#64748B',
  },
  resultsSegmentTextActive: {
    color: '#FFFFFF',
  },

  // Sub-Tab 1: Shaxsiy Natijalar
  personalResultsWrap: {
    gap: 16,
  },
  userProfileDarkCard: {
    backgroundColor: '#0A1A2E',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    shadowColor: '#0A1A2E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  userProfileTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  userProfileAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  userProfileNameCol: {
    flex: 1,
    marginLeft: 12,
  },
  userProfileNameText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userProfileCrownBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D97706',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  userProfileCrownText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  userProfileLevelWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1.5,
    borderColor: '#D97706',
    borderRadius: 12,
    backgroundColor: 'rgba(217, 119, 6, 0.15)',
  },
  userProfileLevelNum: {
    fontSize: 17,
    fontWeight: '900',
    color: '#F59E0B',
    lineHeight: 19,
  },
  userProfileLevelLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FCD34D',
  },
  userProfileXpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userProfileXpText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#F1F5F9',
  },
  userProfileProgressTrack: {
    height: 8,
    backgroundColor: '#1E293B',
    borderRadius: 4,
    overflow: 'hidden',
  },
  userProfileProgressFill: {
    width: '68%',
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 4,
  },

  // 3-Box Stats Row
  resultsThreeStatsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  resultsStatBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  resultsStatBoxVal: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 3,
  },
  resultsStatBoxLbl: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
  },

  // Maktab Do'koni Banner Card
  maktabStoreCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#FEF3C7',
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  maktabStoreImg: {
    width: 48,
    height: 48,
  },
  maktabStoreTextCol: {
    flex: 1,
    marginHorizontal: 12,
  },
  maktabStoreTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  maktabStoreSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    lineHeight: 16,
    fontWeight: '500',
  },

  // Testlar Tarixi Card Section
  resultsTestHistorySection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  resultsHistoryHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  resultsHistoryTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  resultsHistorySeeAll: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#64748B',
  },
  resultsHistoryListWrap: {
    gap: 12,
  },
  resultsHistoryItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  resultsHistoryIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  resultsHistoryMidCol: {
    flex: 1,
    marginLeft: 12,
  },
  resultsHistoryItemTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  resultsHistoryItemDate: {
    fontSize: 11.5,
    color: '#94A3B8',
    fontWeight: '500',
  },
  resultsHistoryRightCol: {
    alignItems: 'flex-end',
    gap: 2,
  },
  resultsHistoryXpPill: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  resultsHistoryXpText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#16A34A',
  },
  resultsHistoryScoreText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },

  // Sub-Tab 2: Reyting
  rankingScreenRoot: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: '#F8FAFC',
  },
  rankingWrap: {
    flex: 1,
  },
  rankingTopFixedSection: {
    backgroundColor: '#F8FAFC',
    zIndex: 20,
    elevation: 4,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    paddingBottom: 2,
    marginBottom: 4,
  },
  rankingHeaderBanner: {
    backgroundColor: '#0A1A2E',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 10,
  },
  rankingBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  rankingBannerTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  rankingBannerSub: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  rankingFilterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  rankingPeriodPill: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  rankingPeriodPillActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  rankingPeriodText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  rankingPeriodTextActive: {
    color: '#FFFFFF',
  },

  // Top 3 Winners Podium
  podiumContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingTop: 6,
    paddingBottom: 8,
    gap: 8,
    backgroundColor: '#F8FAFC',
  },
  podiumColumn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
  },
  podiumColumnFirst: {
    flex: 1.15,
    transform: [{ translateY: -6 }],
  },
  podiumCrownBadgeSilver: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
  },
  podiumCrownBadgeBronze: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#D97706',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
  },
  podiumCrownText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  podiumAvatarSilver: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    marginBottom: 4,
  },
  podiumAvatarBronze: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#FDBA74',
    marginBottom: 4,
  },
  podiumCenterCrown: {
    marginBottom: -4,
  },
  podiumAvatarGoldWrap: {
    padding: 2.5,
    borderRadius: 33,
    borderWidth: 2.5,
    borderColor: '#F59E0B',
    marginBottom: 4,
    backgroundColor: '#FFFBEB',
  },
  podiumAvatarGold: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  podiumNameText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 1,
  },
  podiumNameTextFirst: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 1,
  },
  podiumLevelText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 2,
  },
  podiumXpRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  podiumXpText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#D97706',
  },
  podiumXpTextFirst: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#D97706',
  },

  // Ranking Search Bar
  rankingSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 6,
    marginBottom: 4,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  rankingSearchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    paddingVertical: 0,
  },
  rankingSearchEmptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  rankingSearchEmptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 2,
  },
  rankingSearchEmptySub: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
  },

  // Leaderboard Table
  leaderboardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    marginTop: 4,
  },
  leaderboardHeaderCell: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#94A3B8',
  },
  rankingTableScroll: {
    flex: 1,
  },
  rankingTableScrollContent: {
    paddingBottom: 8,
  },
  leaderboardDataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  leaderboardRankNum: {
    width: 32,
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  leaderboardStudentCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
  },
  leaderboardAvatarCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  leaderboardAvatarInitials: {
    fontSize: 12,
    fontWeight: '800',
  },
  leaderboardStudentName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  leaderboardLevelCol: {
    width: 55,
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
  },
  leaderboardXpCol: {
    width: 85,
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'right',
  },

  // Current User Highlighted Row
  leaderboardCurrentUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#FEF3C7',
    borderRadius: 14,
    marginTop: 4,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#FDE68A',
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 10,
  },
  leaderboardCurrentUserRank: {
    width: 26,
    fontSize: 13.5,
    fontWeight: '900',
    color: '#92400E',
  },
  leaderboardCurrentUserAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
    borderWidth: 1.5,
    borderColor: '#D97706',
  },
  leaderboardCurrentUserName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#92400E',
  },
  leaderboardCurrentUserLevel: {
    width: 60,
    fontSize: 11.5,
    fontWeight: '700',
    color: '#B45309',
    textAlign: 'center',
  },
  leaderboardCurrentUserXp: {
    width: 90,
    fontSize: 13,
    fontWeight: '900',
    color: '#92400E',
    textAlign: 'right',
  },

  // School Store Modal
  storeModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  storeModalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    paddingBottom: 36,
  },
  storeModalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  storeModalHeaderImg: {
    width: 40,
    height: 40,
  },
  storeModalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  storeModalSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
  storeBalanceBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    marginBottom: 16,
  },
  storeBalanceLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#92400E',
  },
  storeBalanceValue: {
    fontSize: 15,
    fontWeight: '900',
    color: '#D97706',
  },
  storeItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  storeItemIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  storeItemInfoCol: {
    flex: 1,
    marginRight: 8,
  },
  storeItemTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  storeItemBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
    marginLeft: 6,
  },
  storeItemBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#15803D',
  },
  storeItemDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 15,
  },
  storeItemBuyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  storeItemBuyBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // ===================== MAKTAB DO'KONI (GLOWING BANNER & FULL SCREEN STYLES) =====================
  storeGlowCardOuter: {
    position: 'relative',
    marginBottom: 16,
  },
  storeGlowAura: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 20,
    backgroundColor: '#8B5CF6',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  maktabStoreCardModern: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#E9D5FF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  storeCardIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F0F9FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeCardIconImg: {
    width: 44,
    height: 44,
  },
  storeLivePulseDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  storeHotTag: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 6,
    borderWidth: 0.5,
    borderColor: '#FDE68A',
  },
  storeHotTagText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#D97706',
    letterSpacing: 0.5,
  },
  storeCardArrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Store Header Bar elements
  storeHeaderTitleRow: {
    marginLeft: 4,
    justifyContent: 'center',
  },
  storeHeaderMainTitle: {
    fontSize: 18.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  storeCoinHeaderPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FDE68A',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  storeCoinHeaderIcon: {
    fontSize: 13,
    marginRight: 4,
  },
  storeCoinHeaderText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },

  // Store Main Container (Screen A & Screen B)
  storeMainScrollView: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  storeMainScrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  // Screen A: Hero Banner
  storeHeroBanner: {
    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: 8,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  storeHeroGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 18,
    paddingRight: 10,
    paddingVertical: 18,
  },
  storeHeroTextCol: {
    flex: 1,
    paddingRight: 6,
  },
  storeHeroTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  storeHeroSubtitle: {
    fontSize: 12.5,
    color: '#EDE9FE',
    lineHeight: 17,
    fontWeight: '500',
  },
  storeHeroGiftImg: {
    width: 125,
    height: 115,
  },
  storeCarouselDotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 4,
  },
  storeDotActive: {
    width: 18,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#7C3AED',
    marginHorizontal: 3,
  },
  storeDotInactive: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 3,
  },

  // Screen A: Search
  storeSearchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  storeSearchInput: {
    flex: 1,
    fontSize: 13.5,
    color: '#0F172A',
  },

  // Screen A: Category Cards Row
  storeCategoryCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  storeCategoryCard: {
    width: (width - 32 - 16) / 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  storeCategoryIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  storeCategoryCardLabel: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
    lineHeight: 14,
  },

  // Screen A: Popular section
  storeSectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  storeSectionHeaderEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  storeSectionHeaderTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  storeSectionSeeAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  storePopularScrollContent: {
    paddingRight: 16,
    paddingBottom: 6,
  },
  storePopularCard: {
    width: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 10,
    marginRight: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
    position: 'relative',
  },
  storeCardTopRightBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    zIndex: 2,
  },
  storeCardTopRightBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#D97706',
  },
  storePopularHeartBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    zIndex: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    borderRadius: 12,
    padding: 4,
  },
  storePopularImgWrap: {
    width: '100%',
    height: 90,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  storePopularImg: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
  },
  storePopularTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 8,
  },
  storePopularPricePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EDE9FE',
  },
  storePopularPriceIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  storePopularPriceText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#7C3AED',
  },

  // Screen A: Edu Promo Banner
  storeEduPromoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5FF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F3E8FF',
    padding: 14,
    marginTop: 18,
    marginBottom: 10,
  },
  storeEduPromoImg: {
    width: 60,
    height: 55,
    marginRight: 10,
  },
  storeEduPromoTextCol: {
    flex: 1,
  },
  storeEduPromoTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 2,
  },
  storeEduPromoSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    lineHeight: 16,
  },
  storeEduPromoArrowBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },

  // Screen B: Filter pills
  storeFilterPillsScroll: {
    marginBottom: 12,
  },
  storeFilterPillsContainer: {
    paddingVertical: 4,
  },
  storeFilterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 8,
  },
  storeFilterPillActive: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  storeFilterPillText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#475569',
  },
  storeFilterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // Screen B: Sort & Toolbar
  storeToolbarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    marginTop: 2,
  },
  storeSortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeSortBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  storeLayoutGridIcon: {
    padding: 4,
  },

  // Screen B: Product Grid (2-column)
  storeProductGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  storeGridCard: {
    width: (width - 44) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 10,
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
    position: 'relative',
  },
  storeGridHeartBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    zIndex: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    borderRadius: 12,
    padding: 4,
  },
  storeGridImgContainer: {
    width: '100%',
    height: 104,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    marginBottom: 8,
  },
  storeGridProductImage: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
  },
  storeGridAvatarCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeGridAvatarImg: {
    width: 76,
    height: 76,
  },
  storeGridFrameImg: {
    width: 86,
    height: 86,
  },
  storeGridBgImg: {
    width: '100%',
    height: 86,
    borderRadius: 14,
  },
  storeGridShieldImg: {
    width: 70,
    height: 70,
  },
  storeGridTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 8,
  },
  storeGridPricePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EDE9FE',
  },
  storeGridPricePillPurchased: {
    backgroundColor: '#DCFCE7',
    borderColor: '#BBF7D0',
  },
  storeGridPriceIcon: {
    fontSize: 13,
    marginRight: 4,
  },
  storeGridPriceText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#7C3AED',
  },
  storeGridPurchasedText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#16A34A',
  },

  // Swiper & Grid Extras
  storeBannerSwiper: {
    width: width - 32,
    borderRadius: 22,
    overflow: 'hidden',
  },
  storePopularSubcategoryText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 2,
  },
  storeGridIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeGridSubcatTag: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 4,
  },

  // Partner & Product Detail Modal Styles
  storeDetailModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  storeDetailCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 28,
    maxHeight: '85%',
  },
  storeDetailHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  storeDetailModalHeading: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  storeDetailProductImageWrap: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F8FAFC',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  storeDetailProductImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  storeDetailWebPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    marginBottom: 10,
  },
  storeDetailWebPillText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0284C7',
  },
  storeDetailPartnerTitle: {
    fontSize: 21,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 8,
  },
  storeDetailDiscountBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 6,
  },
  storeDetailDiscountText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#15803D',
  },
  storeDetailConditionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 16,
  },
  storeDetailInfoGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  storeDetailInfoBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  storeDetailInfoBoxLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748B',
  },
  storeDetailInfoBoxValue: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  storeDetailDescText: {
    fontSize: 13.5,
    color: '#334155',
    lineHeight: 19,
    marginBottom: 16,
  },
  storeDetailTermsSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  storeDetailTermsTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  storeDetailTermRow: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'flex-start',
  },
  storeDetailTermBullet: {
    fontSize: 14,
    color: '#7C3AED',
    marginRight: 6,
    lineHeight: 18,
  },
  storeDetailTermText: {
    flex: 1,
    fontSize: 12.5,
    color: '#475569',
    lineHeight: 18,
  },
  storeDetailPurchasedCodeCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#86EFAC',
    marginBottom: 16,
  },
  storeDetailPurchasedCodeTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#15803D',
  },
  storeDetailCodeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    marginTop: 8,
  },
  storeDetailCodeText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 1.5,
  },
  storeDetailCopyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  storeDetailCopyBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#7C3AED',
    marginLeft: 4,
  },
  storeDetailActionRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
  },
  storeDetailBuyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7C3AED',
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  storeDetailBuyBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  storeDetailSuccessBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16A34A',
    paddingVertical: 14,
    borderRadius: 16,
  },
  storeDetailSuccessBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Dedicated Product Detail Screen Styles
  detailHeroCard: {
    backgroundColor: '#EDE9FE',
    borderRadius: 24,
    overflow: 'hidden',
    height: 250,
    width: '100%',
    marginBottom: 18,
    position: 'relative',
  },
  detailHeroMainImg: {
    width: '100%',
    height: '100%',
  },
  detailHeroFallbackWrap: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3EEFC',
  },
  detailHeroDiscountBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  detailHeroDiscountBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  detailHeroPartnerBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: '#7C3AED',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  detailHeroPartnerBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  detailHeroTalimBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  detailHeroTalimBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  detailHeroActionsRow: {
    position: 'absolute',
    top: 14,
    right: 14,
    flexDirection: 'row',
    gap: 8,
    zIndex: 10,
  },
  detailHeroCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 3,
  },
  detailMainTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 6,
  },
  detailMainSubtitle: {
    fontSize: 13.5,
    color: '#64748B',
    lineHeight: 19,
    marginBottom: 10,
  },
  detailRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    marginBottom: 12,
  },
  detailRatingScore: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginRight: 4,
  },
  detailRatingCount: {
    fontSize: 13,
    color: '#64748B',
  },
  detailPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailPriceMain: {
    fontSize: 22,
    fontWeight: '900',
    color: '#7C3AED',
    marginRight: 8,
  },
  detailPriceOld: {
    fontSize: 14,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  detailDiscountBadgePill: {
    backgroundColor: '#FCE7F3',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  detailDiscountBadgePillText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#DB2777',
  },
  detailFeaturesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    gap: 8,
  },
  detailFeaturePill: {
    flex: 1,
    backgroundColor: '#F5F3FF',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailFeatureTitle: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#475569',
    textAlign: 'center',
    marginTop: 4,
  },
  detailInfoBoxesRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  detailInfoBoxItem: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  detailInfoBoxIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F3FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  detailInfoBoxLabel: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 2,
  },
  detailInfoBoxVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  detailGiftPromoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5FF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#F3E8FF',
  },
  detailGiftPromoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  detailGiftPromoText: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: '700',
    color: '#5B21B6',
    lineHeight: 16,
  },
  detailSectionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  detailSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailSectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  detailDescParagraph: {
    fontSize: 13.5,
    color: '#334155',
    lineHeight: 20,
    marginBottom: 10,
  },
  detailBoxContentWrap: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
    marginTop: 4,
  },
  detailBoxContentHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  detailBoxCheckItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailBoxCheckText: {
    fontSize: 13,
    color: '#475569',
    flex: 1,
  },
  detailPickupCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  detailPickupIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  detailPickupBuilding: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  detailPickupAddress: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  detailPickupSchedule: {
    fontSize: 11,
    color: '#7C3AED',
    fontWeight: '600',
    marginTop: 2,
  },
  detailPickupBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginLeft: 8,
  },
  detailPickupBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#16A34A',
  },
  detailSeeAllSmall: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginRight: 2,
  },
  detailPartnerBranchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  detailPartnerBranchThumb: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 10,
  },
  detailPartnerBranchTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  detailPartnerBranchSub: {
    fontSize: 11.5,
    color: '#64748B',
  },
  detailPartnerBranchNavBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  detailAboutPartnerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  detailAboutPartnerLogoWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  detailAboutPartnerName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  detailAboutPartnerCat: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  // Educational Privilege Specific Styles
  detailTalimSpeedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  detailTalimSpeedBadgeText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#2563EB',
  },
  detailTalimBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  detailTalimBannerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  detailTalimBannerTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#1E40AF',
    marginBottom: 2,
  },
  detailTalimBannerSub: {
    fontSize: 11.5,
    color: '#3B82F6',
    lineHeight: 16,
  },
  detailTalimExpertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  detailTalimExpertIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  detailTalimExpertName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  detailTalimExpertRole: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 16,
  },
  detailTalimUsageCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    gap: 10,
  },
  detailTalimUsageStep: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailTalimUsageNum: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  detailTalimUsageNumText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2563EB',
  },
  detailTalimUsageText: {
    flex: 1,
    fontSize: 12.5,
    color: '#334155',
    lineHeight: 17,
  },
  detailTalimUnlockedCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 16,
  },
  detailTalimUnlockedTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#1E40AF',
  },
  detailTalimUnlockedSub: {
    fontSize: 12,
    color: '#3B82F6',
  },
  detailTalimActionBtnsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  detailTalimActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  detailTalimActionBtnFull: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 12,
    marginTop: 10,
  },
  detailTalimActionBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  detailPurchasedCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    marginBottom: 16,
  },
  detailPurchasedTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#16A34A',
  },
  detailPurchasedCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  detailPurchasedCodeText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#15803D',
    letterSpacing: 1.5,
  },
  detailCopyCodeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  detailCopyCodeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7C3AED',
  },
  detailStickyBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 5,
  },
  detailStickyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7C3AED',
    paddingVertical: 14,
    borderRadius: 16,
  },
  detailStickyBtnSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16A34A',
    paddingVertical: 14,
    borderRadius: 16,
  },
  detailStickyBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Confirmation Screen Styles (Image 1 Right Phone)
  confirmProductCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  confirmProductThumb: {
    width: 72,
    height: 72,
    borderRadius: 14,
  },
  confirmProductTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  confirmProductPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  confirmProductPriceMain: {
    fontSize: 15,
    fontWeight: '900',
    color: '#7C3AED',
    marginRight: 6,
  },
  confirmProductPriceOld: {
    fontSize: 12,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
    marginRight: 6,
  },
  confirmDiscountBadge: {
    backgroundColor: '#FCE7F3',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  confirmDiscountBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#DB2777',
  },
  confirmQtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  confirmQtyLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  confirmQtyCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  confirmQtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmQtyNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    minWidth: 20,
    textAlign: 'center',
  },
  confirmLocationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  confirmLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  confirmLocationIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  confirmLocationHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  confirmLocationAddress: {
    fontSize: 12.5,
    color: '#64748B',
    lineHeight: 17,
  },
  confirmMethodDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  confirmMethodRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  confirmFreeBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },
  confirmFreeBadgeText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#16A34A',
  },
  confirmSummaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  confirmSummaryHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  confirmSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  confirmSummaryLabel: {
    fontSize: 13.5,
    color: '#64748B',
  },
  confirmSummaryValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  confirmSummaryDiscountValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#16A34A',
  },
  confirmSummaryTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
    marginTop: 6,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  confirmSummaryTotalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#78350F',
  },
  confirmSummaryTotalValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#78350F',
  },
  confirmNoticeBox: {
    flexDirection: 'row',
    backgroundColor: '#F5F3FF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EDE9FE',
  },
  confirmNoticeText: {
    flex: 1,
    fontSize: 12,
    color: '#5B21B6',
    lineHeight: 17,
  },
  confirmStickyBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 10,
  },
  confirmSubmitBtn: {
    flexDirection: 'row',
    backgroundColor: '#7C3AED',
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  confirmSubmitBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  confirmCancelBtn: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  confirmCancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },

  // Animated Success Center Modal Styles
  successModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  successModalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
  },
  successModalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 22,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 15,
  },
  successIconOuterRing: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successIconInnerCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  successModalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 6,
  },
  successOrderIdPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 14,
  },
  successOrderIdText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  successItemSummaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 12,
    width: '100%',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  successItemThumbWrap: {
    width: 44,
    height: 44,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successItemThumb: {
    width: '100%',
    height: '100%',
  },
  successItemTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  successItemSpentCoins: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#D97706',
  },
  successItemQty: {
    fontSize: 12,
    color: '#64748B',
  },
  successBalanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 12,
    paddingVertical: 9,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    marginBottom: 12,
  },
  successBalanceLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#92400E',
  },
  successBalanceValue: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#92400E',
  },
  successNoticeMessage: {
    fontSize: 12.5,
    color: '#64748B',
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 18,
    paddingHorizontal: 6,
  },
  successModalBtn: {
    width: '100%',
    backgroundColor: '#7C3AED',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  successModalBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  successModalSecondaryBtn: {
    width: '100%',
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  successModalSecondaryBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#64748B',
  },

  // Store Header Right Actions (Mening mahsulotlarim button + Coin pill)
  storeHeaderRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  storeMyPurchasesHeaderBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EDE9FE',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  storeMyPurchasesHeaderBtnActive: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  storeMyPurchasesBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    minWidth: 17,
    height: 17,
    borderRadius: 8.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  storeMyPurchasesBadgeText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  // Mening Mahsulotlarim Screen Styles
  myPurchasesTabsWrapper: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingVertical: 10,
  },
  myPurchasesTabsContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  myPurchasesTabPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  myPurchasesTabPillActive: {
    backgroundColor: '#7C3AED',
  },
  myPurchasesTabPillText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#64748B',
  },
  myPurchasesTabPillTextActive: {
    color: '#FFFFFF',
  },
  myPurchasesTabBadge: {
    marginLeft: 6,
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
  },
  myPurchasesTabBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  myPurchasesTabBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
  },
  myPurchasesTabBadgeTextActive: {
    color: '#FFFFFF',
  },
  myPurchasesEmptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 60,
  },
  myPurchasesEmptyIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  myPurchasesEmptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 8,
  },
  myPurchasesEmptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 22,
  },
  myPurchasesEmptyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7C3AED',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  myPurchasesEmptyBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  myPurchasesListContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  myPurchasesListSummaryBar: {
    marginBottom: 12,
  },
  myPurchasesListSummaryText: {
    fontSize: 13,
    color: '#64748B',
  },
  myPurchaseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  myPurchaseCardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  myPurchaseCategoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  myPurchaseCategoryBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  myPurchaseDateText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#16A34A',
  },
  myPurchaseMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
  },
  myPurchaseThumbWrap: {
    width: 64,
    height: 64,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  myPurchaseThumbImg: {
    width: '100%',
    height: '100%',
  },
  myPurchaseInfoCol: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  myPurchaseItemTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 3,
  },
  myPurchaseItemSub: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  myPurchasePriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  myPurchasePriceText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#D97706',
  },
  myPurchaseActionCard: {
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
    paddingTop: 10,
    marginTop: 2,
  },
  myPurchaseActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
  },
  myPurchaseActionBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  myPurchaseCouponCodeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  myPurchaseCouponCodeLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  myPurchaseCouponCodeText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#7C3AED',
    letterSpacing: 1,
  },
  myPurchaseCopyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  myPurchaseCopyBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  myPurchaseCouponHint: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 6,
    paddingHorizontal: 2,
  },
  myPurchasePickupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  myPurchasePickupText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    flex: 1,
  },
  myPurchaseOrderFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  myPurchaseStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  myPurchaseStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D97706',
    marginRight: 6,
  },
  myPurchaseStatusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
  },
  myPurchaseDetailLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7C3AED',
  },

  // ===================== PROFILE SCREEN STYLES =====================
  schoolProfileScrollArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  schoolProfileContentContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  profileHeroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  profileHeroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileAvatarContainer: {
    position: 'relative',
    marginRight: 14,
  },
  profileAvatarCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  profileAvatarLetter: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  profileAvatarBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileHeroDetailsCol: {
    flex: 1,
  },
  profileNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  profileUserName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  profileUserPhone: {
    fontSize: 12.5,
    color: '#64748B',
    marginBottom: 6,
  },
  profileIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  profileIdPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  profileIdPillText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#475569',
  },
  profileLevelProgressSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  profileLevelLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  profileLevelCurrentLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  profileLevelTargetLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0284C7',
  },
  profileLevelTrack: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  profileLevelFill: {
    height: '100%',
    borderRadius: 3,
  },
  profileLevelHint: {
    fontSize: 10.5,
    color: '#64748B',
    lineHeight: 14,
  },
  profileSectionTitleRow: {
    marginBottom: 10,
    marginTop: 4,
  },
  profileSectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  profileStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 16,
  },
  profileStatCard: {
    width: (width - 32 - 10) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  profileStatIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  profileStatValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  profileStatLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  profileCertsContainer: {
    gap: 10,
    marginBottom: 16,
  },
  profileCertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  profileCertIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  profileCertTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  profileCertMeta: {
    fontSize: 11,
    color: '#64748B',
  },
  profileCertActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profileCertActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCertViewBtn: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  profileCertViewBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#B45309',
  },
  profileBadgesScrollContent: {
    paddingRight: 16,
    gap: 10,
    marginBottom: 16,
  },
  profileBadgeItem: {
    width: 95,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  profileBadgeIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  profileBadgeTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 2,
  },
  profileBadgeDesc: {
    fontSize: 9.5,
    color: '#64748B',
    textAlign: 'center',
  },
  profileMenuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    paddingHorizontal: 14,
    paddingVertical: 6,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    marginBottom: 16,
  },
  profileMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
  },
  profileMenuIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  profileMenuLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  profileMenuDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  profileLogoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    borderRadius: 14,
    paddingVertical: 12,
    marginBottom: 20,
  },
  profileLogoutBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#EF4444',
  },
});
