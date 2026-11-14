import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Share,
  Linking,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { WS_BASE_URL, getCandidateUrls } from '../config/api';

// ==================== INTERFACES & TYPES ====================
interface MurojaatScreenProps {
  onBack: () => void;
}

export type MurojaatViewType =
  | 'home'
  | 'detail'
  | 'ariza_form'
  | 'preview'
  | 'my_applications';

export interface TemplateField {
  key: string;
  label: string;
  placeholder: string;
  multiline?: boolean;
  required?: boolean;
  step?: 1 | 2 | 3; // 1: Shaxsiy, 2: Holat/Tafsilot, 3: Talab
}

export interface ApplicationTemplate {
  id: string;
  title: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  category: string;
  targetOrg: string;
  description: string;
  law: string;
  durationDays: string;
  requiredDocs: string[];
  expectedResult: string;
  sampleData: Record<string, string>;
  fields: TemplateField[];
}

export interface SavedApplication {
  id: string;
  templateId: string;
  title: string;
  targetOrg: string;
  dateStr: string;
  regNumber: string;
  status: 'Tayyor' | 'Yuborildi' | 'Jarayonda' | 'Ijobiy hal etildi';
  generatedText: string;
}

// ==================== TEMPLATE MAPPER ====================
export function mapBackendTemplate(tpl: any): ApplicationTemplate {
  return {
    id: tpl.id,
    title: tpl.title,
    icon: 'document-text-outline',
    iconColor: '#0284C7',
    iconBg: '#F0F9FF',
    category: tpl.categoryName || 'Umumiy',
    targetOrg: tpl.targetOrg || "Tegishli davlat organi",
    description: tpl.description || "Rasmiy murojaat va ariza shakli.",
    law: tpl.law || "O'zbekiston Respublikasining «Jismoniy va yuridik shaxslarning murojaatlari to'g'risida»gi Qonuni",
    durationDays: tpl.durationDays || "15 ish kuni",
    requiredDocs: Array.isArray(tpl.requiredDocs) && tpl.requiredDocs.length > 0
      ? tpl.requiredDocs
      : ["Shaxsni tasdiqlovchi hujjat (pasport/ID karta nusxasi)"],
    expectedResult: "Murojaatni qonunda belgilangan muddatda ko'rib chiqish va asoslantirilgan javob olish.",
    sampleData: {
      fio: 'Hayitboyev Samandar',
      address: 'Toshkent shahri',
      phone: '+998 94 490 09 01',
      details: tpl.description || 'Murojaat tafsilotlari...',
      demand: 'Mazkur masalani qonuniy ko‘rib chiqib, ijobiy hal etishingizni so‘rayman.',
    },
    fields: [
      { key: 'fio', label: "To'liq ism-sharif (F.I.O)", placeholder: "Ism familiyangiz", required: true, step: 1 },
      { key: 'address', label: "Yashash manzilingiz", placeholder: "Viloyat, shahar, tuman, ko'cha...", required: true, step: 1 },
      { key: 'phone', label: "Aloqa telefon raqamingiz", placeholder: "+998 90 123 45 67", required: true, step: 1 },
      { key: 'details', label: "Holat va muammo tafsilotlari", placeholder: "Muammoni batafsil bayon qiling...", multiline: true, required: true, step: 2 },
      { key: 'demand', label: "Qonuniy talabingiz va iltimosingiz", placeholder: "Qanday amaliy chora ko'rilishini so'raysiz...", multiline: true, required: true, step: 3 },
    ],
  };
}

// ==================== TEMPLATES DATA ====================
const APPLICATION_TEMPLATES: ApplicationTemplate[] = [
  {
    id: 'mehnat_shikoyat',
    title: "Noqonuniy bo'shatish bo'yicha shikoyat",
    icon: 'briefcase-outline',
    iconColor: '#DC2626',
    iconBg: '#FEF2F2',
    category: 'Mehnat',
    targetOrg: "Bandlik va mehnat munosabatlari vazirligi Davlat mehnat inspeksiyasi",
    description: "Ish beruvchi tomonidan asossiz yoki qonunga xilof ravishda ishdan bo'shatilgan, maosh ushlab qolingan taqdirda rasmiy shikoyat arizasi.",
    law: "O'zbekiston Respublikasi Mehnat Kodeksi, 100 va 161-moddalar",
    durationDays: "15 ish kuni",
    requiredDocs: [
      "Mehnat daftarchasi yoki elektron yozuv nusxasi",
      "Ishdan bo'shatish to'g'risidagi buyruq nusxasi",
      "Mehnat shartnomasi",
      "Bank plastik kartasi hisob ko'chirmasi (agar maosh to'lanmagan bo'lsa)",
    ],
    expectedResult: "Ish beruvchiga nisbatan ma'muriy jazo qo'llash, lavozimga tiklash va majburiy bekor yurilgan kunlar uchun kompensatsiya undirish.",
    sampleData: {
      fio: 'Karimov Alisher Bahodirovich',
      address: 'Toshkent shahar, Yunusobod tumani, 14-mavze, 22-uy',
      phone: '+998 90 123 45 67',
      employer: '"Universal Trade" MChJ',
      position: 'Bosh buxgalter yordamchisi',
      work_start: '12.03.2022',
      fire_date: '01.11.2024',
      reason: "Shtat qisqarishi bahonasi bilan, ammo ogohlantirish berilmagan",
      facts: "Menga nisbatan 2 oy oldin yozma ogohlantirish berilmadi va boshqa ish taklif qilinmadi. 2 oylik ish haqi kompensatsiyasi ham to'lanmadi.",
      demand: "Ish beruvchining qarorini bekor qilib, ishga tiklash va yetkazilgan zararni to'latish.",
    },
    fields: [
      { key: 'fio', label: "To'liq ism-sharif (F.I.O)", placeholder: "Karimov Alisher Bahodirovich", required: true, step: 1 },
      { key: 'address', label: "Yashash manzilingiz", placeholder: "Toshkent sh., Yunusobod tumani, ...", required: true, step: 1 },
      { key: 'phone', label: "Aloqa telefon raqamingiz", placeholder: "+998 90 123 45 67", required: true, step: 1 },
      { key: 'employer', label: "Ish beruvchi tashkilot nomi", placeholder: "\"Universal Trade\" MChJ", required: true, step: 2 },
      { key: 'position', label: "Egallagan lavozimingiz", placeholder: "Buxgalter / Menejer", required: true, step: 2 },
      { key: 'work_start', label: "Ish boshlagan sana", placeholder: "12.03.2022", step: 2 },
      { key: 'fire_date', label: "Ishdan bo'shatilgan sana", placeholder: "01.11.2024", required: true, step: 2 },
      { key: 'reason', label: "Ish beruvchi ko'rsatgan rasmiy sabab", placeholder: "Shtat qisqarishi, intizomiy jazo...", multiline: true, step: 2 },
      { key: 'facts', label: "Haqiqiy holat va qonunbuzarlik dalillari", placeholder: "Ogohlantirish xati berilmadi, kompensatsiya to'lanmadi...", multiline: true, required: true, step: 3 },
      { key: 'demand', label: "Yakuniy aniq talabingiz", placeholder: "Ishga tiklash va kompensatsiya undirish", multiline: true, required: true, step: 3 },
    ],
  },
  {
    id: 'istemolchi_shikoyat',
    title: "Sifatsiz tovar yoki xizmat bo'yicha shikoyat",
    icon: 'cart-outline',
    iconColor: '#D97706',
    iconBg: '#FFFBEB',
    category: "Iste'molchi",
    targetOrg: "Raqobatni rivojlantirish va iste'molchilar huquqlarini himoya qilish qo'mitasi",
    description: "Savdo markazi, onlayn do'kon yoki xizmat ko'rsatuvchi tomonidan nosoz mahsulot sotilganda yoki pulni qaytarish rad etilganda taqdim etiluvchi ariza.",
    law: "O'RQ-273 «Iste'molchilar huquqlarini himoya qilish to'g'risida»gi Qonun, 14, 18-moddalar",
    durationDays: "10 ish kuni",
    requiredDocs: [
      "To'lov cheki yoki bank o'tkazma kvitansiyasi",
      "Kafolat taloni (agar mavjud bo'lsa)",
      "Tovarning nosozlik holati aks etgan surat yoki video dalillar",
      "Sotuvchiga yozilgan oldingi murojaat yozishmalari",
    ],
    expectedResult: "Tovarni bepul sifatlisiga almashtirib berish, nuqsonlarni bartaraf etish yoki to'langan summani to'liq qaytarish.",
    sampleData: {
      fio: 'Yusupova Dilnoza Hamidovna',
      address: 'Samarqand shahar, Registon ko\'chasi, 12-uy',
      phone: '+998 91 234 56 78',
      seller: '"Texnomart" maishiy texnika do\'koni',
      product: 'Samsung Galaxy A55 smartfoni',
      buy_date: '05.10.2024',
      price: '4 500 000 so\'m',
      problem: "Smartfon xarid qilinganidan 3 kun o'tib zaryad olmasdan qoldi. Kafolat markaziga olib borganimda, servis asossiz rad javobi berdi.",
      demand: "Smartfonni yangisiga almashtirish yoki xarid summasini to'liq qaytarish.",
    },
    fields: [
      { key: 'fio', label: "To'liq ism-sharif (F.I.O)", placeholder: "Yusupova Dilnoza Hamidovna", required: true, step: 1 },
      { key: 'address', label: "Yashash manzili", placeholder: "Samarqand sh., ...", required: true, step: 1 },
      { key: 'phone', label: "Telefon raqami", placeholder: "+998 91 234 56 78", required: true, step: 1 },
      { key: 'seller', label: "Sotuvchi yoki kompaniya nomi", placeholder: "\"Texnomart\" savdo tarmog'i", required: true, step: 2 },
      { key: 'product', label: "Mahsulot yoki xizmat nomi", placeholder: "Samsung Galaxy A55 telefoni", required: true, step: 2 },
      { key: 'buy_date', label: "Sotib olingan sana", placeholder: "05.10.2024", required: true, step: 2 },
      { key: 'price', label: "To'langan summa (so'mda)", placeholder: "4 500 000 so'm", step: 2 },
      { key: 'problem', label: "Tovardagi nuqson va muammo tavsifi", placeholder: "Uchinchi kunda ekran ishlamay qoldi, servis esa...", multiline: true, required: true, step: 3 },
      { key: 'demand', label: "Iste'molchi sifatidagi talabingiz", placeholder: "Yangi tovarga almashtirish yoki mablag'ni qaytarish", multiline: true, required: true, step: 3 },
    ],
  },
  {
    id: 'bank_shikoyat',
    title: "Bank noqonuniy foizi va yechib olingan mablag' shikoyati",
    icon: 'card-outline',
    iconColor: '#7C3AED',
    iconBg: '#FAF5FF',
    category: 'Moliya',
    targetOrg: "O'zbekiston Respublikasi Markaziy banki Bank xizmatlari iste'molchilarining huquqlarini himoya qilish xizmati",
    description: "Bank kartasidan noqonuniy pul yechilganda, shartnomada ko'rsatilmagan ortiqcha foiz yoki komissiyalar hisoblanganda yuboriladigan ariza.",
    law: "O'RQ-1060 «Banklar va bank faoliyati to'g'risida»gi Qonun; Markaziy bank 3030-son Nizomi",
    durationDays: "15 ish kuni",
    requiredDocs: [
      "Bank plastik kartasi rekvizitlari va hisob ko'chirmasi",
      "Kredit shartnomasi va to'lov jadvali",
      "Yechib olingan summa bo'yicha bank SMS xabarlari",
      "Bank filialiga berilgan yozma ariza nusxasi",
    ],
    expectedResult: "Asossiz ushlab qolingan mablag'larni kartaga qaytarish va bankka nisbatan qat'iy ko'rsatma berish.",
    sampleData: {
      fio: 'Toshmatov Jahongir Nazarovich',
      address: 'Namangan shahar, Istiqlol ko\'chasi, 8-uy',
      phone: '+998 93 456 78 90',
      bank: '"Kapitalbank" ATB filiali',
      account: '8600 1234 5678 9012',
      problem_date: '20.10.2024',
      amount: '1 450 000 so\'m',
      problem: "Bank kartamdan mening ruxsatimsiz va hech qanday ogohlantirishsiz xizmat ko'rsatish komissiyasi deb 1 450 000 so'm mablag' yechib olindi.",
      bank_response: "Bankka 22.10.2024 da murojaat qildim, biroq xodimlar tizim xatosi deb og'zaki tushuntirish berib, pulni qaytarmadi.",
      demand: "Noqonuniy yechilgan 1 450 000 so'm mablag'ni zudlik bilan qaytarish va bank xatti-harakatlariga qonuniy baho berish.",
    },
    fields: [
      { key: 'fio', label: "To'liq ism-sharif (F.I.O)", placeholder: "Toshmatov Jahongir Nazarovich", required: true, step: 1 },
      { key: 'address', label: "Yashash manzilingiz", placeholder: "Namangan sh., ...", required: true, step: 1 },
      { key: 'phone', label: "Telefon raqamingiz", placeholder: "+998 93 456 78 90", required: true, step: 1 },
      { key: 'bank', label: "Bank yoki kredit tashkiloti nomi", placeholder: "\"Kapitalbank\" ATB", required: true, step: 2 },
      { key: 'account', label: "Bank hisob raqami yoki karta raqami", placeholder: "8600 **** **** 9012", step: 2 },
      { key: 'problem_date', label: "Hodisa yuz bergan sana", placeholder: "20.10.2024", required: true, step: 2 },
      { key: 'amount', label: "Nizoli summa miqdori", placeholder: "1 450 000 so'm", required: true, step: 2 },
      { key: 'problem', label: "Holat va qonunbuzarlik tavsifi", placeholder: "Kredit shartnomasida bo'lmagan foiz hisoblandi...", multiline: true, required: true, step: 3 },
      { key: 'bank_response', label: "Bankning munosabati (agar javob berilgan bo'lsa)", placeholder: "Bankka yozgan edim, lekin javobsiz qoldi...", multiline: true, step: 3 },
      { key: 'demand', label: "Markaziy bankdan so'ralayotgan talab", placeholder: "Mablag'ni to'liq qaytarish va tekshiruv o'tkazish", multiline: true, required: true, step: 3 },
    ],
  },
  {
    id: 'davlat_xizmat',
    title: "Davlat xizmati ko'rsatishdan asossiz rad etish shikoyati",
    icon: 'business-outline',
    iconColor: '#2563EB',
    iconBg: '#EFF6FF',
    category: 'Davlat',
    targetOrg: "Adliya vazirligi huzuridagi Davlat xizmatlari agentligi",
    description: "Davlat organlari yoki davlat xizmatlari markazlari tomonidan belgilangan muddat buzilganda yoki asossiz rad javobi berilganda.",
    law: "O'RQ-385 «Davlat xizmatlari to'g'risida»gi Qonun, 20-modda",
    durationDays: "5 ish kuni",
    requiredDocs: [
      "Davlat xizmatlari markazi arizasi raqami",
      "Rad etish to'g'risidagi elektron bildirishnoma",
      "Taqdim etilgan hujjatlar to'plami nusxasi",
    ],
    expectedResult: "Xizmatni zudlik bilan to'liq ko'rsatish va mas'ul mansabdor shaxsni javobgarlikka tortish.",
    sampleData: {
      fio: 'Rashidov Nodir Salimovich',
      address: 'Toshkent viloyati, Chirchiq shahar, Navoiy ko\'chasi, 45-uy',
      phone: '+998 94 567 89 01',
      org: 'Chirchiq shahar Kadastr agentligi filiali',
      service: "Ko'chmas mulk ob'ektiga bo'lgan huquqni davlat ro'yxatidan o'tkazish",
      apply_date: '15.10.2024',
      refuse_reason: "Hujjatlar yetarli emas degan asossiz vaj bilan",
      facts: "Vaholanki, Vazirlar Mahkamasining tegishli qarorida ko'rsatilgan barcha 4 turdagi hujjat to'liq topshirilgan edi.",
      demand: "Ko'chmas mulkni davlat ro'yxatidan o'tkazib, kadastr pasportini rasmiylashtirish.",
    },
    fields: [
      { key: 'fio', label: "To'liq ism-sharif (F.I.O)", placeholder: "Rashidov Nodir Salimovich", required: true, step: 1 },
      { key: 'address', label: "Yashash manzilingiz", placeholder: "Chirchiq sh., Navoiy ko'chasi...", required: true, step: 1 },
      { key: 'phone', label: "Aloqa telefon raqami", placeholder: "+998 94 567 89 01", required: true, step: 1 },
      { key: 'org', label: "Xizmat ko'rsatgan davlat tashkiloti", placeholder: "Kadastr agentligi shahar filiali", required: true, step: 2 },
      { key: 'service', label: "So'ralgan davlat xizmati turi", placeholder: "Mulk huquqini davlat ro'yxatidan o'tkazish", required: true, step: 2 },
      { key: 'apply_date', label: "Murojaat yuborilgan sana", placeholder: "15.10.2024", required: true, step: 2 },
      { key: 'refuse_reason', label: "Idora bergan rad javobi asosi", placeholder: "Hujjatlar to'liq emas deb bildirishdi...", multiline: true, step: 3 },
      { key: 'facts', label: "Nima sababdan rad javobi qonunga xilof", placeholder: "Nizom talablari bo'yicha barcha hujjatlar ilova qilingan...", multiline: true, required: true, step: 3 },
      { key: 'demand', label: "Yakuniy talabingiz", placeholder: "Davlat xizmatini to'liq ko'rsatish majburiyatini yuklash", multiline: true, required: true, step: 3 },
    ],
  },
  {
    id: 'ijara_shikoyat',
    title: "Uy-joy ijara depozitini qaytarish arizasi",
    icon: 'home-outline',
    iconColor: '#059669',
    iconBg: '#F0FDF4',
    category: 'Mulk',
    targetOrg: "Fuqarolik ishlari bo'yicha tumanlararo sudi / Ichki ishlar bo'limi",
    description: "Ijara shartnomasi yakunlangach uy egasi depozit mablag'ini asossiz ushlab qolganda yoki mol-mulkka zarar yetmagan holda pulni bermaganda.",
    law: "O'zbekiston Respublikasi Fuqarolik Kodeksi, 574-583-moddalar",
    durationDays: "10 kun",
    requiredDocs: [
      "Ijara shartnomasi nusxasi",
      "Depozit topshirilganligi to'g'risidagi kvitansiya yoki tilxat",
      "Xonadonning topshirilgan paytdagi holati suratlari",
    ],
    expectedResult: "Depozit summasini to'liq undirish hamda ushlab turilgan har bir kun uchun foiz talab qilish.",
    sampleData: {
      fio: 'Mamatova Sarvinoz Abdullayevna',
      address: 'Toshkent shahar, Chilonzor tumani, 9-mavze, 14-uy',
      phone: '+998 97 345 67 89',
      owner: 'Ergashev Bahodir Karimovich',
      property: 'Chilonzor tumani, 12-uy, 45-xonadon',
      contract_date: '01.01.2024',
      rent: '3 500 000 so\'m',
      problem: "Shartnoma muddati tugab uyni butun holatda topshirdim, biroq ijaraga beruvchi 5 000 000 so'm depozitni asossiz qaytarishdan bosh tortmoqda.",
      demand: "5 000 000 so'm miqdoridagi garov (depozit) mablag'ini qaytarish.",
    },
    fields: [
      { key: 'fio', label: "To'liq ism-sharif (F.I.O)", placeholder: "Mamatova Sarvinoz Abdullayevna", required: true, step: 1 },
      { key: 'address', label: "Hozirgi yashash manzilingiz", placeholder: "Toshkent sh., Chilonzor tumani...", required: true, step: 1 },
      { key: 'phone', label: "Telefon raqamingiz", placeholder: "+998 97 345 67 89", required: true, step: 1 },
      { key: 'owner', label: "Uy egasining to'liq ismi", placeholder: "Ergashev Bahodir Karimovich", required: true, step: 2 },
      { key: 'property', label: "Ijaraga olingan manzil", placeholder: "Chilonzor tumani, 12-uy, 45-xonadon", required: true, step: 2 },
      { key: 'contract_date', label: "Ijara shartnomasi tuzilgan sana", placeholder: "01.01.2024", step: 2 },
      { key: 'rent', label: "Depozit yoki ijara summasi", placeholder: "5 000 000 so'm depozit", required: true, step: 2 },
      { key: 'problem', label: "Nizo mohiyati va uy egasi hatti-harakati", placeholder: "Uyni bekamu-ko'st topshirdim, lekin depozitni bermayapti...", multiline: true, required: true, step: 3 },
      { key: 'demand', label: "Talabingiz", placeholder: "Depozit mablag'ini to'liq qaytarish", multiline: true, required: true, step: 3 },
    ],
  },
  {
    id: 'taklif_prezident',
    title: "Prezident Virtual Qabulxonasi uchun murojaat",
    icon: 'flag-outline',
    iconColor: '#0284C7',
    iconBg: '#F0F9FF',
    category: 'Taklif',
    targetOrg: "O'zbekiston Respublikasi Prezidentining Virtual qabulxonasi (pm.gov.uz)",
    description: "Infratuzilma, ijtimoiy muammolar, tizimli kamchiliklar yoki qonunchilikni takomillashtirish bo'yicha to'g'ridan-to'g'ri oliy organga taklif/ariza.",
    law: "O'RQ-369 «Jismoniy va yuridik shaxslarning murojaatlari to'g'risida»gi Qonun",
    durationDays: "15-30 kun",
    requiredDocs: [
      "Fuqaro pasporti ma'lumotlari",
      "Muammo aks etgan fotosuratlar yoki hujjatli dalillar",
      "Oldin murojaat qilingan mahalliy hokimlik javoblari (agar bo'lsa)",
    ],
    expectedResult: "Muammoni respublika darajasidagi vazirlikka nazoratga oldirish va qat'iy yechim topish.",
    sampleData: {
      fio: 'Ergasheva Mohira Saidovna',
      address: 'Qashqadaryo viloyati, Qarshi shahar, Alisher Navoiy ko\'chasi, 24-uy',
      phone: '+998 90 987 65 43',
      subject: "Mahallamiz maktabiga olib boruvchi yo'l va tungi yoritish tizimini ta'mirlash",
      details: "Qarshi shahridagi 'Ravon' mahallasidagi 18-maktabga olib boruvchi 1.2 km yo'l oxirgi 8 yildan buyon ta'mirlanmagan, yoritgichlar umuman ishlamaydi. O'quvchilar va keksalar uchun jiddiy xavf tug'dirmoqda.",
      benefit: "Ushbu yo'l ta'mirlansa mahalladagi 600 dan ortiq xonadon va maktabning 1200 nafar o'quvchisi xavfsiz qatnay oladi.",
    },
    fields: [
      { key: 'fio', label: "To'liq ism-sharif (F.I.O)", placeholder: "Ergasheva Mohira Saidovna", required: true, step: 1 },
      { key: 'address', label: "Yashash manzilingiz", placeholder: "Qarshi shahar, ...", required: true, step: 1 },
      { key: 'phone', label: "Telefon raqami", placeholder: "+998 90 987 65 43", required: true, step: 1 },
      { key: 'subject', label: "Murojaatning qisqa mavzusi", placeholder: "Maktab yo'li va yoritish tizimini tiklash", required: true, step: 2 },
      { key: 'details', label: "Muammo tavsifi va asosiy taklifingiz", placeholder: "Mahallamizda so'nggi 5 yil davomida...", multiline: true, required: true, step: 3 },
      { key: 'benefit', label: "Taklif amalga oshsa qanday ijobiy natija bo'ladi", placeholder: "Mahalladagi 600 oila uchun xavfsizlik ta'minlanadi...", multiline: true, step: 3 },
    ],
  },
];

// ==================== GENERATE FUNCTION ====================
function generateDocumentText(template: ApplicationTemplate, formData: Record<string, string>, regNum: string): string {
  const today = new Date();
  const dateStr = `${today.getDate().toString().padStart(2, '0')}.${(today.getMonth() + 1).toString().padStart(2, '0')}.${today.getFullYear()}`;

  const fio = formData['fio'] || '[ISM-SHARIF]';
  const address = formData['address'] || '[MANZIL]';
  const phone = formData['phone'] || '[TELEFON]';

  let body = '';

  switch (template.id) {
    case 'mehnat_shikoyat': {
      const employer = formData['employer'] || '[TASHKILOT]';
      const position = formData['position'] || '[LAVOZIM]';
      const fireDate = formData['fire_date'] || '[SANA]';
      const reason = formData['reason'] || '[SABAB]';
      const facts = formData['facts'] || '[DALILLAR]';
      const demand = formData['demand'] || "Ishga tiklash va kompensatsiya to'lash";
      body = `Men, ${fio}, ${employer} tashkilotida ${position} lavozimida ishlab kelganman.

${fireDate} sanasida ish beruvchi tomonidan ${reason ? `«${reason}» vaji bilan ` : ''}mehnat shartnomasi bir tomonlama bekor qilindi.

Ushbu qaror O'zbekiston Respublikasi Mehnat Kodeksining talablariga to'liq zid ravishda, qonuniy kafolatlar buzilgan holda qabul qilingan.

QONUNBUZARLIK HOLATLARI VA DALILLAR:
${facts}

TALAB VA ILTIMOSIM:
${demand}.

Mazkur murojaatimni O'zbekiston Respublikasining «Jismoniy va yuridik shaxslarning murojaatlari to'g'risida»gi Qonuniga muvofiq ko'rib chiqib, belgilangan muddatda yozma javob taqdim etishingizni so'rayman.`;
      break;
    }
    case 'istemolchi_shikoyat': {
      const seller = formData['seller'] || '[SOTUVCHI]';
      const product = formData['product'] || '[TOVAR]';
      const buyDate = formData['buy_date'] || '[SANA]';
      const price = formData['price'] || '';
      const problem = formData['problem'] || '[MUAMMO]';
      const demand = formData['demand'] || 'Tovarni almashtirish yoki pulni qaytarish';
      body = `Men, ${fio}, ${buyDate} kuni ${seller} savdo nuqtasidan ${product}${price ? ` (${price} evaziga)` : ''} sotib oldim.

MUAMMO MOHIYATI:
${problem}

Ushbu holat O'zbekiston Respublikasi «Iste'molchilar huquqlarini himoya qilish to'g'risida»gi Qonunining 14 va 18-moddalariga — sotuvchining sifatli tovar taqdim etish hamda nuqsonli tovar uchun mablag'ni qaytarish majburiyatiga ziddir.

TALABIM:
${demand}.

10 kunlik muddatda iste'molchi sifatidagi qonuniy huquqlarim tiklanishini va murojaat natijasi bo'yicha yozma xulosa berishingizni talab qilaman.`;
      break;
    }
    case 'bank_shikoyat': {
      const bank = formData['bank'] || '[BANK]';
      const amount = formData['amount'] || '';
      const problemDate = formData['problem_date'] || '[SANA]';
      const problem = formData['problem'] || '[MUAMMO]';
      const bankResponse = formData['bank_response'] || '';
      const demand = formData['demand'] || "Mablag'ni qaytarish";
      body = `Men, ${fio}, ${bank} filiali mijozi hisoblanaman${formData['account'] ? ` (hisob/karta: ${formData['account']})` : ''}.

${problemDate} sanasida quyidagi qonunbuzarlik yuz berdi:
${problem}${amount ? `\nAsossiz yechilgan yoki hisoblangan summa: ${amount}` : ''}
${bankResponse ? `\nBankka qilingan murojaat natijasi:\n${bankResponse}` : ''}

Mazkur holat O'RQ-1060-sonli «Banklar va bank faoliyati to'g'risida»gi Qonunga hamda Markaziy bankning 3030-sonli Nizomiga to'g'ridan-to'g'ri zid keladi.

TALABIM:
${demand}.

Markaziy bank nazorati ostida ushbu holatga qonuniy chora ko'rilishini va mablag'larim qaytarilishini ta'minlashingizni so'rayman.`;
      break;
    }
    case 'davlat_xizmat': {
      const org = formData['org'] || '[TASHKILOT]';
      const service = formData['service'] || '[XIZMAT]';
      const applyDate = formData['apply_date'] || '[SANA]';
      const facts = formData['facts'] || '[HOLAT]';
      const refuseReason = formData['refuse_reason'] || '';
      const demand = formData['demand'] || 'Xizmat ko\'rsatish';
      body = `Men, ${fio}, ${applyDate} sanasida ${org} tashkilotiga «${service}» davlat xizmatidan foydalanish uchun rasmiy tartibda murojaat qilganman.

HOLAT TAFSILOTLARI:
${facts}${refuseReason ? `\nIdora keltirgan vaj: ${refuseReason}` : ''}

Mazkur xatti-harakat O'RQ-385-sonli «Davlat xizmatlari to'g'risida»gi Qonunining 20-moddasida ko'rsatilgan davlat xizmati ko'rsatish tartibini asossiz ravishda buzish hisoblanadi.

TALABIM:
${demand}. 5 ish kuni ichida mazkur qonunbuzarlik bartaraf etilishini so'rayman.`;
      break;
    }
    case 'ijara_shikoyat': {
      const owner = formData['owner'] || '[UY EGASI]';
      const property = formData['property'] || '[MANZIL]';
      const rent = formData['rent'] || '';
      const problem = formData['problem'] || '[MUAMMO]';
      const demand = formData['demand'] || 'Depozitni qaytarish';
      body = `Men, ${fio}, ${property} manzilida joylashgan turar joyni fuqaro ${owner} dan ijaraga olib yashaganman${rent ? ` (garov/ijara summasi: ${rent})` : ''}.

NIZO VA MUAMMO:
${problem}

Ushbu holat O'zbekiston Respublikasi Fuqarolik Kodeksining 574–583-moddalariga asosan majburiyatlarni buzish deb hisoblanadi.

TALABIM:
${demand}.`;
      break;
    }
    case 'taklif_prezident': {
      const subject = formData['subject'] || '[MAVZU]';
      const details = formData['details'] || '[TAVSIF]';
      const benefit = formData['benefit'] || '';
      body = `MUROJAAT MAVZUSI: ${subject}

MUAMMO VA TAKLIF MOHIYATI:
${details}

${benefit ? `KUTILAYOTGAN IJTIMOIY-IQTISODIY SAMARA:\n${benefit}\n` : ''}
Ushbu tashabbus va taklifim tegishli mas'ul idoralarga yetkazilishini va ko'rib chiqilishini iltimos qilaman.`;
      break;
    }
    default:
      body = formData['facts'] || formData['details'] || '[Ariza mazmuni]';
  }

  return `O'ZBEKISTON RESPUBLIKASI
${template.targetOrg.toUpperCase()} GA

Murojaat ro'yxat raqami: #${regNum}
Sana: ${dateStr}

ARIZA (SHIKOYAT)

Ariza beruvchi: ${fio}
Yashash manzili: ${address}
Aloqa telefoni: ${phone}

HURMATLI RAHBARIYAT,

${body}

Hurmat bilan,
Fuqaro: ${fio}
Imzo: _______________
Sana: ${dateStr}

────────────────────────────────────────────────────────
Yuridik asos: ${template.law}
Ko'rib chiqish muddati: ${template.durationDays}
Ushbu hujjat «Fuqarolarning murojaatlari to'g'risida»gi O'RQ-369-son Qonuniga muvofiq tayyorlangan.`;
}

// ==================== MAIN COMPONENT ====================
export const MurojaatScreen: React.FC<MurojaatScreenProps> = ({ onBack }) => {
  const insets = useSafeAreaInsets();

  // Navigation State
  const [currentView, setCurrentView] = useState<MurojaatViewType>('home');
  const [topTab, setTopTab] = useState<'catalog' | 'history'>('catalog');

  // Selected State
  const [selectedTemplate, setSelectedTemplate] = useState<ApplicationTemplate | null>(null);
  const [formStep, setFormStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);
  const [generatedText, setGeneratedText] = useState('');
  const [currentRegNum, setCurrentRegNum] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPolishing, setAiPolishing] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Barchasi');

  // Saved applications history (Frontend state)
  const [savedApps, setSavedApps] = useState<SavedApplication[]>([
    {
      id: 'app-101',
      templateId: 'istemolchi_shikoyat',
      title: "Sifatsiz smartfon xaridi bo'yicha e'tiroz",
      targetOrg: "Iste'molchilar huquqlarini himoya qilish qo'mitasi",
      dateStr: '02.11.2024',
      regNumber: 'UZ-89241',
      status: 'Jarayonda',
      generatedText: '...',
    },
    {
      id: 'app-102',
      templateId: 'bank_shikoyat',
      title: "Bank kartasidan asossiz yechilgan komissiya",
      targetOrg: "O'zbekiston Respublikasi Markaziy banki",
      dateStr: '28.10.2024',
      regNumber: 'UZ-74120',
      status: 'Ijobiy hal etildi',
      generatedText: '...',
    },
  ]);

  const scrollRef = useRef<any>(null);

  // Dynamic categories and templates from Backend / Admin panel
  const [backendCategories, setBackendCategories] = useState<{ id: string; name: string }[]>([]);
  const [templatesList, setTemplatesList] = useState<ApplicationTemplate[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Load real data from Backend and setup WebSocket real-time listener
  useEffect(() => {
    let isMounted = true;
    let ws: WebSocket | null = null;

    const fetchMurojaatData = async () => {
      try {
        setIsDataLoading(true);
        const urls = getCandidateUrls('/api/murojaat');
        for (const url of urls) {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 4000);
            const res = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);
            if (res.ok) {
              const data = await res.json();
              if (isMounted && data.success) {
                if (Array.isArray(data.categories)) {
                  setBackendCategories(data.categories);
                }
                if (Array.isArray(data.templates)) {
                  setTemplatesList(data.templates.map(mapBackendTemplate));
                }
              }
              break;
            }
          } catch {}
        }
      } catch (err) {
        console.error('Murojaat fetch error:', err);
      } finally {
        if (isMounted) setIsDataLoading(false);
      }
    };

    fetchMurojaatData();

    // WebSocket real-time subscription
    try {
      ws = new WebSocket(WS_BASE_URL);
      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.event === 'murojaat:updated' && msg.data) {
            if (isMounted && Array.isArray(msg.data.categories)) {
              setBackendCategories(msg.data.categories);
            }
            if (isMounted && Array.isArray(msg.data.templates)) {
              setTemplatesList(msg.data.templates.map(mapBackendTemplate));
            }
          } else if (msg.event === 'initial:sync' && msg.data?.murojaat) {
            if (isMounted && Array.isArray(msg.data.murojaat.categories)) {
              setBackendCategories(msg.data.murojaat.categories);
            }
            if (isMounted && Array.isArray(msg.data.murojaat.templates)) {
              setTemplatesList(msg.data.murojaat.templates.map(mapBackendTemplate));
            }
          }
        } catch {}
      };
    } catch {}

    return () => {
      isMounted = false;
      if (ws) ws.close();
    };
  }, []);

  // Dynamic categories from backend
  const categories = [
    'Barchasi',
    ...backendCategories.map((c) => c.name),
  ];

  // Effective templates: real backend templates or fallback
  const effectiveTemplates = templatesList.length > 0 ? templatesList : APPLICATION_TEMPLATES;

  const filteredTemplates = effectiveTemplates.filter((t) => {
    const matchCat = selectedCategory === 'Barchasi' || t.category === selectedCategory;
    const matchSearch =
      searchQuery.trim().length === 0 ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.targetOrg.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  // Handler: Open Service Detail
  const handleOpenDetail = (template: ApplicationTemplate) => {
    setSelectedTemplate(template);
    setCurrentView('detail');
  };

  // Handler: "Xizmatdan foydalanish" button pressed
  const handleStartService = () => {
    if (!selectedTemplate) return;
    setFormData({});
    setAttachedFiles([]);
    setFormStep(1);
    setCurrentView('ariza_form');
  };

  // Handler: Fill with Sample Data
  const handleFillSample = () => {
    if (!selectedTemplate) return;
    setFormData({ ...selectedTemplate.sampleData });
    Alert.alert('✅ Namuna ma\'lumotlar kiritildi', "Barcha maydonlar sinov ma'lumotlari bilan to'ldirildi. O'zgartirishingiz yoki darhol generatsiya qilishingiz mumkin.");
  };

  // Handler: AI Polish text
  const handleAiPolish = () => {
    setAiPolishing(true);
    setTimeout(() => {
      setAiPolishing(false);
      Alert.alert(
        '🤖 AI Yurist Tahriri',
        "Kiritilgan dalillar va talablar O'zbekiston qonunchiligiga to'liq mos yuridik tilda tekshirildi va tahrirlandi.",
        [{ text: 'Ajoyib' }]
      );
    }, 900);
  };

  // Handler: Attach Document
  const handleAttachFile = () => {
    const mockFileNames = [
      'Pasport_nusxasi.pdf',
      'Xarid_kvitansiyasi_va_cheki.jpg',
      'Mehnat_shartnomasi_scan.pdf',
      'Bank_hisobidan_ko\'chirma.pdf',
    ];
    const randomDoc = mockFileNames[Math.floor(Math.random() * mockFileNames.length)];
    if (!attachedFiles.includes(randomDoc)) {
      setAttachedFiles((prev) => [...prev, randomDoc]);
      Alert.alert('📎 Hujjat biriktirildi', `"${randomDoc}" arizaga muvaffaqiyatli ilova qilindi.`);
    } else {
      Alert.alert('Eslatma', 'Ushbu hujjat allaqachon biriktirilgan.');
    }
  };

  // Handler: Remove attached file
  const handleRemoveFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Handler: Generate Document
  const handleGenerate = () => {
    if (!selectedTemplate) return;

    // Validate required fields
    const missing = selectedTemplate.fields
      .filter((f) => f.required && !formData[f.key]?.trim())
      .map((f) => f.label);

    if (missing.length > 0) {
      Alert.alert(
        "To'ldirilmagan maydonlar",
        `Iltimos, quyidagi majburiy maydonlarni to'ldiring:\n\n• ${missing.join('\n• ')}`,
        [{ text: 'Tushundim' }]
      );
      return;
    }

    setIsGenerating(true);
    const regNum = 'UZ-' + Math.floor(10000 + Math.random() * 90000);
    setCurrentRegNum(regNum);

    setTimeout(() => {
      const text = generateDocumentText(selectedTemplate, formData, regNum);
      setGeneratedText(text);
      setIsGenerating(false);

      // Auto save to history
      const today = new Date();
      const dateStr = `${today.getDate().toString().padStart(2, '0')}.${(today.getMonth() + 1).toString().padStart(2, '0')}.${today.getFullYear()}`;
      const newSaved: SavedApplication = {
        id: 'app-' + Date.now(),
        templateId: selectedTemplate.id,
        title: selectedTemplate.title,
        targetOrg: selectedTemplate.targetOrg,
        dateStr,
        regNumber: regNum,
        status: 'Tayyor',
        generatedText: text,
      };
      setSavedApps((prev) => [newSaved, ...prev]);

      setCurrentView('preview');
    }, 1200);
  };

  // Handler: Share Document
  const handleShare = async () => {
    try {
      await Share.share({
        message: generatedText,
        title: selectedTemplate?.title || 'Rasmiy Ariza',
      });
    } catch {
      // Ignored
    }
  };

  // Handler: Open My.gov.uz
  const handleOpenMyGov = () => {
    Alert.alert(
      "My.gov.uz ga yo'naltirish",
      "Rasmiy arizani Yagona interaktiv davlat xizmatlari portali (My.gov.uz) yoki davlat organi elektron qabulxonasiga yuborishni xohlaysizmi?",
      [
        { text: 'Bekor qilish', style: 'cancel' },
        {
          text: 'O\'tish (My.gov.uz)',
          onPress: () => {
            Linking.openURL('https://my.gov.uz').catch(() => {
              Alert.alert('Xatolik', 'Brauzerni ochib bo‘lmadi.');
            });
          },
        },
      ]
    );
  };

  // Handler: Back Navigation
  const handleBack = () => {
    if (currentView === 'preview') {
      setCurrentView('ariza_form');
    } else if (currentView === 'ariza_form') {
      if (formStep > 1) {
        setFormStep((prev) => ((prev - 1) as any));
      } else {
        setCurrentView('detail');
      }
    } else if (currentView === 'detail') {
      setCurrentView('home');
      setSelectedTemplate(null);
    } else if (currentView === 'home' && topTab === 'history') {
      setTopTab('catalog');
    } else {
      onBack();
    }
  };

  // Hardware/Telefon orqaga tugmasi bosilganda bitta oldingi sahifaga/qadamga qaytish
  useEffect(() => {
    const onHardwareBack = () => {
      if (currentView === 'preview') {
        setCurrentView('ariza_form');
        return true;
      }
      if (currentView === 'ariza_form') {
        if (formStep > 1) {
          setFormStep((prev) => ((prev - 1) as any));
          return true;
        }
        setCurrentView('detail');
        return true;
      }
      if (currentView === 'detail') {
        setCurrentView('home');
        setSelectedTemplate(null);
        return true;
      }
      if (currentView === 'home') {
        if (topTab === 'history') {
          setTopTab('catalog');
          return true;
        }
        if (searchQuery.length > 0) {
          setSearchQuery('');
          return true;
        }
        // Eng boshida bo'lsa, oldingi sahifaga (MainHomeScreen) qaytadi
        onBack();
        return true;
      }
      return false;
    };

    const sub = BackHandler.addEventListener('hardwareBackPress', onHardwareBack);
    return () => sub.remove();
  }, [currentView, formStep, topTab, searchQuery, onBack]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      {/* ===== TOP NAVIGATION BAR ===== */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={22} color="#1E3A5F" />
          <Text style={styles.backBtnText}>
            {currentView === 'home'
              ? 'Orqaga'
              : currentView === 'detail'
              ? 'Andozalar'
              : currentView === 'ariza_form'
              ? 'Tafsilot'
              : 'Tahrirlash'}
          </Text>
        </TouchableOpacity>

        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {currentView === 'home'
              ? 'Murojaat va Arizalar'
              : currentView === 'detail'
              ? 'Xizmat Pasporti'
              : currentView === 'ariza_form'
              ? 'Ariza To\'ldirish'
              : 'Tayyor Rasmiy Hujjat'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.headerRightBtn}
          onPress={() => {
            if (currentView !== 'home') {
              setCurrentView('home');
              setTopTab('history');
            } else {
              setTopTab((prev) => (prev === 'catalog' ? 'history' : 'catalog'));
            }
          }}
          activeOpacity={0.7}
        >
          <Ionicons
            name={topTab === 'history' && currentView === 'home' ? 'list' : 'time-outline'}
            size={22}
            color="#2563EB"
          />
        </TouchableOpacity>
      </View>

      {/* ===== VIEW 1: HOME CATALOG & HISTORY ===== */}
      {currentView === 'home' && (
        <ScrollView
          ref={scrollRef}
          style={styles.scrollArea}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Segmented Tab (Andozalar vs Mening arizalarim) */}
          <View style={styles.tabSwitchContainer}>
            <TouchableOpacity
              style={[styles.tabSwitchBtn, topTab === 'catalog' && styles.tabSwitchBtnActive]}
              onPress={() => setTopTab('catalog')}
              activeOpacity={0.8}
            >
              <Ionicons
                name="document-text"
                size={16}
                color={topTab === 'catalog' ? '#FFFFFF' : '#64748B'}
              />
              <Text style={[styles.tabSwitchText, topTab === 'catalog' && styles.tabSwitchTextActive]}>
                Andozalar portali
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabSwitchBtn, topTab === 'history' && styles.tabSwitchBtnActive]}
              onPress={() => setTopTab('history')}
              activeOpacity={0.8}
            >
              <Ionicons
                name="folder-open"
                size={16}
                color={topTab === 'history' ? '#FFFFFF' : '#64748B'}
              />
              <Text style={[styles.tabSwitchText, topTab === 'history' && styles.tabSwitchTextActive]}>
                Mening arizalarim ({savedApps.length})
              </Text>
            </TouchableOpacity>
          </View>

          {topTab === 'catalog' ? (
            <>
              {/* Hero Banner */}
              <LinearGradient
                colors={['#1E3A8A', '#2563EB', '#3B82F6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroBanner}
              >
                <View style={{ flex: 1 }}>
                  <View style={styles.heroBadge}>
                    <Text style={styles.heroBadgeText}>DAVLAT STANDARTI</Text>
                  </View>
                  <Text style={styles.heroTitle}>Murojaat & Ariza</Text>
                  <Text style={styles.heroSubtitle}>
                    O'RQ-369-son qonun asosida rasmiy ariza va shikoyatlarni tezkor tayyorlash
                  </Text>
                </View>
                <View style={styles.heroIconBox}>
                  <Ionicons name="shield-checkmark" size={38} color="#FFFFFF" />
                </View>
              </LinearGradient>

              {/* Stats Bar */}
              <View style={styles.statsRow}>
                {[
                  { num: `${APPLICATION_TEMPLATES.length} ta`, label: 'Tayyor andoza' },
                  { num: '100%', label: 'Qonuniy kafolat' },
                  { num: '3 daqiqa', label: "O'rtacha vaqt" },
                ].map((s) => (
                  <View key={s.label} style={styles.statBox}>
                    <Text style={styles.statNum}>{s.num}</Text>
                    <Text style={styles.statLabel}>{s.label}</Text>
                  </View>
                ))}
              </View>

              {/* Search Bar */}
              <View style={styles.searchBar}>
                <Ionicons name="search" size={17} color="#94A3B8" style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Ariza yoki tashkilot nomini qidiring..."
                  placeholderTextColor="#94A3B8"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Ionicons name="close-circle" size={16} color="#94A3B8" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Category Pills */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoryScroll}
                contentContainerStyle={styles.categoryRow}
              >
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.catPill, selectedCategory === cat && styles.catPillActive]}
                    onPress={() => setSelectedCategory(cat)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.catPillText, selectedCategory === cat && styles.catPillTextActive]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Template Cards */}
              <Text style={styles.sectionTitle}>
                {filteredTemplates.length} ta rasmiy andoza mavjud
              </Text>

              {filteredTemplates.map((template) => (
                <TouchableOpacity
                  key={template.id}
                  style={styles.templateCard}
                  onPress={() => handleOpenDetail(template)}
                  activeOpacity={0.88}
                >
                  <View style={styles.templateCardTop}>
                    <View style={[styles.templateIconBox, { backgroundColor: template.iconBg }]}>
                      <Ionicons name={template.icon as any} size={24} color={template.iconColor} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <View style={styles.templateMeta}>
                        <View style={[styles.categoryBadge, { backgroundColor: template.iconBg }]}>
                          <Text style={[styles.categoryBadgeText, { color: template.iconColor }]}>
                            {template.category}
                          </Text>
                        </View>
                        <View style={styles.durationBadge}>
                          <Ionicons name="time-outline" size={11} color="#64748B" />
                          <Text style={styles.durationBadgeText}>{template.durationDays}</Text>
                        </View>
                      </View>
                      <Text style={styles.templateTitle}>{template.title}</Text>
                    </View>
                  </View>

                  <Text style={styles.templateDesc} numberOfLines={2}>
                    {template.description}
                  </Text>

                  <View style={styles.templateFooter}>
                    <View style={styles.templateOrg}>
                      <Ionicons name="business-outline" size={13} color="#64748B" />
                      <Text style={styles.templateOrgText} numberOfLines={1}>
                        {template.targetOrg}
                      </Text>
                    </View>

                    {/* Button: Xizmatga o'tish */}
                    <View style={styles.startBtnPill}>
                      <Text style={styles.startBtnPillText}>Ko'rish</Text>
                      <Ionicons name="arrow-forward" size={13} color="#FFFFFF" />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}

              {filteredTemplates.length === 0 && (
                <View style={styles.emptyBox}>
                  <Ionicons name="document-outline" size={48} color="#CBD5E1" />
                  <Text style={styles.emptyText}>Hech qanday andoza topilmadi</Text>
                  <Text style={styles.emptySubText}>Boshqa toifani tanlang yoki qidiruv so'zini o'zgartiring</Text>
                </View>
              )}
            </>
          ) : (
            /* ===== HISTORY TAB ===== */
            <View style={{ gap: 12 }}>
              <Text style={styles.sectionTitle}>Yaratilgan va saqlangan arizalar</Text>
              {savedApps.map((app) => (
                <View key={app.id} style={styles.historyCard}>
                  <View style={styles.historyHeader}>
                    <View style={styles.historyRegPill}>
                      <Text style={styles.historyRegText}>{app.regNumber}</Text>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        app.status === 'Ijobiy hal etildi'
                          ? { backgroundColor: '#DCFCE7' }
                          : app.status === 'Jarayonda'
                          ? { backgroundColor: '#FEF3C7' }
                          : { backgroundColor: '#EFF6FF' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusBadgeText,
                          app.status === 'Ijobiy hal etildi'
                            ? { color: '#166534' }
                            : app.status === 'Jarayonda'
                            ? { color: '#92400E' }
                            : { color: '#1E40AF' },
                        ]}
                      >
                        {app.status}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.historyTitle}>{app.title}</Text>
                  <Text style={styles.historyOrg} numberOfLines={1}>
                    🏛 {app.targetOrg}
                  </Text>
                  <Text style={styles.historyDate}>Sana: {app.dateStr}</Text>

                  <View style={styles.historyActions}>
                    <TouchableOpacity
                      style={styles.historyBtn}
                      onPress={() => {
                        const t = APPLICATION_TEMPLATES.find((x) => x.id === app.templateId) || APPLICATION_TEMPLATES[0];
                        setSelectedTemplate(t);
                        setGeneratedText(app.generatedText || generateDocumentText(t, t.sampleData, app.regNumber));
                        setCurrentRegNum(app.regNumber);
                        setCurrentView('preview');
                      }}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="eye-outline" size={15} color="#2563EB" />
                      <Text style={styles.historyBtnText}>Hujjatni ko'rish</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.historyBtn, { backgroundColor: '#F8FAFC' }]}
                      onPress={handleOpenMyGov}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="globe-outline" size={15} color="#059669" />
                      <Text style={[styles.historyBtnText, { color: '#059669' }]}>My.gov.uz da kuzatish</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}

      {/* ===== VIEW 2: DETAIL (XIZMAT PASPORTI VA "XIZMATDAN FOYDALANISH" TUGMASI) ===== */}
      {currentView === 'detail' && selectedTemplate && (
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 30 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Card Top Presentation */}
          <View style={styles.detailHeaderCard}>
            <View style={[styles.detailIconBox, { backgroundColor: selectedTemplate.iconBg }]}>
              <Ionicons name={selectedTemplate.icon as any} size={36} color={selectedTemplate.iconColor} />
            </View>
            <View style={[styles.categoryBadge, { backgroundColor: selectedTemplate.iconBg, marginTop: 10 }]}>
              <Text style={[styles.categoryBadgeText, { color: selectedTemplate.iconColor }]}>
                {selectedTemplate.category} xizmati
              </Text>
            </View>
            <Text style={styles.detailTitle}>{selectedTemplate.title}</Text>
            <Text style={styles.detailDesc}>{selectedTemplate.description}</Text>
          </View>

          {/* Key Parameters Info Grid */}
          <View style={styles.paramGrid}>
            <View style={styles.paramBox}>
              <Ionicons name="time" size={20} color="#2563EB" />
              <Text style={styles.paramVal}>{selectedTemplate.durationDays}</Text>
              <Text style={styles.paramLabel}>Ko'rib chiqish muddati</Text>
            </View>

            <View style={styles.paramBox}>
              <Ionicons name="shield-checkmark" size={20} color="#059669" />
              <Text style={styles.paramVal}>100% Rasmiy</Text>
              <Text style={styles.paramLabel}>O'RQ-369 standarti</Text>
            </View>

            <View style={styles.paramBox}>
              <Ionicons name="wallet-outline" size={20} color="#D97706" />
              <Text style={styles.paramVal}>Bepul</Text>
              <Text style={styles.paramLabel}>Davlat boji yo'q</Text>
            </View>
          </View>

          {/* Org & Law Details */}
          <View style={styles.detailBlock}>
            <Text style={styles.detailBlockTitle}>🏢 Murojaat qabul qiluvchi organ</Text>
            <View style={styles.detailRow}>
              <Ionicons name="business" size={18} color="#1E3A8A" style={{ marginTop: 2 }} />
              <Text style={styles.detailRowText}>{selectedTemplate.targetOrg}</Text>
            </View>
          </View>

          <View style={styles.detailBlock}>
            <Text style={styles.detailBlockTitle}>⚖️ Qonuniy asos va moddalar</Text>
            <View style={styles.detailRow}>
              <Ionicons name="book-outline" size={18} color="#059669" style={{ marginTop: 2 }} />
              <Text style={[styles.detailRowText, { color: '#047857', fontWeight: '600' }]}>
                {selectedTemplate.law}
              </Text>
            </View>
          </View>

          {/* Required documents list */}
          <View style={styles.detailBlock}>
            <Text style={styles.detailBlockTitle}>📑 Talab qilinadigan hujjatlar va dalillar:</Text>
            {selectedTemplate.requiredDocs.map((doc, idx) => (
              <View key={idx} style={styles.bulletRow}>
                <Ionicons name="checkmark-circle" size={16} color="#2563EB" style={{ marginTop: 2 }} />
                <Text style={styles.bulletText}>{doc}</Text>
              </View>
            ))}
          </View>

          {/* Expected result */}
          <View style={[styles.detailBlock, { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }]}>
            <Text style={[styles.detailBlockTitle, { color: '#065F46' }]}>🎯 Kutilayotgan qonuniy natija:</Text>
            <Text style={styles.expectedText}>{selectedTemplate.expectedResult}</Text>
          </View>

          {/* MAIN ACTION BUTTON: XIZMATDAN FOYDALANISH */}
          <TouchableOpacity
            style={styles.mainUseServiceBtn}
            onPress={handleStartService}
            activeOpacity={0.88}
          >
            <LinearGradient
              colors={['#1E3A8A', '#2563EB']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.mainUseServiceGradient}
            >
              <Text style={styles.mainUseServiceText}>Xizmatdan foydalanish</Text>
              <Ionicons name="arrow-forward-circle" size={24} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* ===== VIEW 3: ARIZA FORMASI (WIZARD VA SMART FORMA) ===== */}
      {currentView === 'ariza_form' && selectedTemplate && (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 80 }]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Step Wizard Progress Header */}
            <View style={styles.stepperContainer}>
              {[
                { step: 1, title: 'Shaxsiy' },
                { step: 2, title: 'Tafsilot' },
                { step: 3, title: 'Talab' },
              ].map((s) => (
                <TouchableOpacity
                  key={s.step}
                  style={styles.stepItem}
                  onPress={() => setFormStep(s.step as any)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.stepCircle,
                      formStep === s.step
                        ? styles.stepCircleActive
                        : formStep > s.step
                        ? styles.stepCircleCompleted
                        : styles.stepCircleInactive,
                    ]}
                  >
                    {formStep > s.step ? (
                      <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                    ) : (
                      <Text
                        style={[
                          styles.stepCircleText,
                          formStep === s.step && styles.stepCircleTextActive,
                        ]}
                      >
                        {s.step}
                      </Text>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.stepItemTitle,
                      formStep === s.step && styles.stepItemTitleActive,
                    ]}
                  >
                    {s.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Quick Fill Actions (Namuna to'ldirish & AI polish) */}
            <View style={styles.quickActionsBar}>
              <TouchableOpacity
                style={styles.sampleFillBtn}
                onPress={handleFillSample}
                activeOpacity={0.75}
              >
                <Ionicons name="flash-outline" size={15} color="#D97706" />
                <Text style={styles.sampleFillBtnText}>Namunani yuklash</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.aiPolishBtn}
                onPress={handleAiPolish}
                activeOpacity={0.75}
                disabled={aiPolishing}
              >
                {aiPolishing ? (
                  <ActivityIndicator size="small" color="#2563EB" />
                ) : (
                  <>
                    <Ionicons name="sparkles" size={15} color="#2563EB" />
                    <Text style={styles.aiPolishBtnText}>AI Yurist tekshiruvi</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Target Template Info Pill */}
            <View style={styles.formTargetInfo}>
              <Ionicons name="business" size={16} color="#1E40AF" />
              <Text style={styles.formTargetInfoText} numberOfLines={1}>
                {selectedTemplate.targetOrg}
              </Text>
            </View>

            {/* Step 1 Fields: Shaxsiy ma'lumotlar */}
            {formStep === 1 && (
              <View>
                <Text style={styles.stepSectionTitle}>1-qadam: Ariza beruvchi ma'lumotlari</Text>
                <Text style={styles.stepSectionSubtitle}>
                  Rasmiy javob yozma yoki SMS ko'rinishida yuborilishi uchun to'g'ri kiriting.
                </Text>

                {selectedTemplate.fields
                  .filter((f) => f.step === 1 || !f.step)
                  .map((field) => (
                    <View key={field.key} style={styles.fieldBlock}>
                      <Text style={styles.fieldLabel}>
                        {field.label}
                        {field.required && <Text style={{ color: '#DC2626' }}> *</Text>}
                      </Text>
                      <TextInput
                        style={styles.fieldInput}
                        placeholder={field.placeholder}
                        placeholderTextColor="#94A3B8"
                        value={formData[field.key] || ''}
                        onChangeText={(v) => setFormData((prev) => ({ ...prev, [field.key]: v }))}
                      />
                    </View>
                  ))}

                <TouchableOpacity
                  style={styles.nextStepBtn}
                  onPress={() => setFormStep(2)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.nextStepBtnText}>Keyingi qadam (Tafsilotlar)</Text>
                  <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            )}

            {/* Step 2 Fields: Muammo va Tashkilot tafsilotlari */}
            {formStep === 2 && (
              <View>
                <Text style={styles.stepSectionTitle}>2-qadam: Shikoyat qilinayotgan tomon va holat</Text>
                <Text style={styles.stepSectionSubtitle}>
                  Muammo yuz bergan sana, tashkilot nomi va holatni belgilang.
                </Text>

                {selectedTemplate.fields
                  .filter((f) => f.step === 2)
                  .map((field) => (
                    <View key={field.key} style={styles.fieldBlock}>
                      <Text style={styles.fieldLabel}>
                        {field.label}
                        {field.required && <Text style={{ color: '#DC2626' }}> *</Text>}
                      </Text>
                      <TextInput
                        style={[styles.fieldInput, field.multiline && styles.fieldInputMultiline]}
                        placeholder={field.placeholder}
                        placeholderTextColor="#94A3B8"
                        value={formData[field.key] || ''}
                        onChangeText={(v) => setFormData((prev) => ({ ...prev, [field.key]: v }))}
                        multiline={field.multiline}
                        numberOfLines={field.multiline ? 3 : 1}
                        textAlignVertical={field.multiline ? 'top' : 'center'}
                      />
                    </View>
                  ))}

                <View style={styles.stepNavRow}>
                  <TouchableOpacity
                    style={styles.stepPrevBtn}
                    onPress={() => setFormStep(1)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="arrow-back" size={16} color="#475569" />
                    <Text style={styles.stepPrevBtnText}>Orqaga</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.stepNextPill}
                    onPress={() => setFormStep(3)}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.nextStepBtnText}>3-qadamga o'tish</Text>
                    <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Step 3 Fields: Dalillar, Talab va Hujjat ilova qilish */}
            {formStep === 3 && (
              <View>
                <Text style={styles.stepSectionTitle}>3-qadam: Aniq dalillar va yakuniy talab</Text>
                <Text style={styles.stepSectionSubtitle}>
                  Natijaga erishish uchun qonuniy talabingizni aniq ko'rsating.
                </Text>

                {selectedTemplate.fields
                  .filter((f) => f.step === 3)
                  .map((field) => (
                    <View key={field.key} style={styles.fieldBlock}>
                      <Text style={styles.fieldLabel}>
                        {field.label}
                        {field.required && <Text style={{ color: '#DC2626' }}> *</Text>}
                      </Text>
                      <TextInput
                        style={[styles.fieldInput, field.multiline && styles.fieldInputMultiline]}
                        placeholder={field.placeholder}
                        placeholderTextColor="#94A3B8"
                        value={formData[field.key] || ''}
                        onChangeText={(v) => setFormData((prev) => ({ ...prev, [field.key]: v }))}
                        multiline={field.multiline}
                        numberOfLines={field.multiline ? 4 : 1}
                        textAlignVertical={field.multiline ? 'top' : 'center'}
                      />
                    </View>
                  ))}

                {/* File Attachment Area */}
                <View style={styles.attachCard}>
                  <View style={styles.attachHeader}>
                    <Ionicons name="attach" size={18} color="#2563EB" />
                    <Text style={styles.attachTitle}>Dalil va hujjatlarni ilova qilish</Text>
                  </View>

                  {attachedFiles.map((file, idx) => (
                    <View key={idx} style={styles.attachedFileItem}>
                      <Ionicons name="document-text" size={16} color="#059669" />
                      <Text style={styles.attachedFileName} numberOfLines={1}>
                        {file}
                      </Text>
                      <TouchableOpacity onPress={() => handleRemoveFile(idx)}>
                        <Ionicons name="close-circle" size={18} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  ))}

                  <TouchableOpacity
                    style={styles.addFileBtn}
                    onPress={handleAttachFile}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="cloud-upload-outline" size={18} color="#2563EB" />
                    <Text style={styles.addFileBtnText}>Hujjat qo'shish (PDF / JPG)</Text>
                  </TouchableOpacity>
                </View>

                {/* Navigation & Generate Buttons */}
                <View style={styles.stepNavRow}>
                  <TouchableOpacity
                    style={styles.stepPrevBtn}
                    onPress={() => setFormStep(2)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="arrow-back" size={16} color="#475569" />
                    <Text style={styles.stepPrevBtnText}>Orqaga</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.generateBtn}
                    onPress={handleGenerate}
                    activeOpacity={0.88}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <>
                        <Ionicons name="checkmark-done-circle" size={20} color="#FFFFFF" />
                        <Text style={styles.generateBtnText}>Arizani generatsiya qilish</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      )}

      {/* ===== VIEW 4: PREVIEW (TAYYOR RASMIY HUJJAT VA HARAKATLAR) ===== */}
      {currentView === 'preview' && (
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 30 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Success Status Banner */}
          <View style={styles.successBanner}>
            <View style={styles.successIconCircle}>
              <Ionicons name="checkmark-circle" size={32} color="#059669" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.successTitle}>Rasmiy ariza muvaffaqiyatli tuzildi!</Text>
              <Text style={styles.successSubtitle}>
                Ro'yxatga olish raqami: <Text style={{ fontWeight: '800' }}>#{currentRegNum}</Text>
                {'\n'}Qonuniy kuchga ega rasmiy matn tayyor.
              </Text>
            </View>
          </View>

          {/* Action Grid: Nusxa olish, Ulashish, My.gov.uz */}
          <View style={styles.previewActionGrid}>
            <TouchableOpacity style={styles.previewBtnPrimary} onPress={handleShare} activeOpacity={0.85}>
              <Ionicons name="share-social-outline" size={18} color="#FFFFFF" />
              <Text style={styles.previewBtnPrimaryText}>Ulashish / Yuborish</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.previewBtnSecondary} onPress={handleOpenMyGov} activeOpacity={0.85}>
              <Ionicons name="globe-outline" size={18} color="#059669" />
              <Text style={styles.previewBtnSecondaryText}>My.gov.uz ga yuborish</Text>
            </TouchableOpacity>
          </View>

          {/* Official Document Blank Presentation */}
          <View style={styles.docOfficialBlank}>
            {/* Blank Header */}
            <View style={styles.blankHeader}>
              <View style={styles.emblemBox}>
                <Ionicons name="shield-half" size={22} color="#1E3A8A" />
              </View>
              <Text style={styles.blankHeaderTitle}>O'ZBEKISTON RESPUBLIKASI</Text>
              <Text style={styles.blankHeaderSub}>YAGONA HUQUQIY MUROJAATLAR STANDARTI</Text>
              <View style={styles.blankHeaderDivider} />
            </View>

            {/* Printable Document Text */}
            <Text style={styles.docPrintText} selectable>
              {generatedText}
            </Text>

            {/* Blank Footer with Verification Badge */}
            <View style={styles.blankFooter}>
              <View style={styles.qrSimulation}>
                <Ionicons name="qr-code-outline" size={36} color="#1E3A8A" />
                <Text style={styles.qrText}>QR-KOD BILAN HIMOYALANGAN</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.verifiedStampText}>✅ ELEKTRON TAYYORLANGAN</Text>
                <Text style={styles.verifiedStampSub}>«Yordam» huquqiy AI tizimi</Text>
              </View>
            </View>
          </View>

          {/* Practical Next Steps Guide */}
          <View style={styles.submitGuideBox}>
            <Text style={styles.submitGuideTitle}>📮 Qanday yuboriladi va natija olinadi?</Text>
            {[
              { title: "Elektron qabulxona", desc: "My.gov.uz yoki davlat organining rasmiy portaliga nusxani joylashtiring." },
              { title: "Ro'yxat raqami", desc: "Arizani topshirgach beriladigan 10 xonali ro'yxat raqamini saqlab qo'ying." },
              { title: "Kafolatlangan muddat", desc: `${selectedTemplate?.durationDays || '15 kun'} ichida yozma rasmiy javob olish huquqiga egasiz.` },
            ].map((st, i) => (
              <View key={i} style={styles.guideStepRow}>
                <View style={styles.guideStepNum}>
                  <Text style={styles.guideStepNumText}>{i + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.guideStepTitle}>{st.title}</Text>
                  <Text style={styles.guideStepDesc}>{st.desc}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Bottom Actions */}
          <View style={styles.bottomActionsRow}>
            <TouchableOpacity
              style={styles.editAgainBtn}
              onPress={() => setCurrentView('ariza_form')}
              activeOpacity={0.8}
            >
              <Ionicons name="create-outline" size={17} color="#475569" />
              <Text style={styles.editAgainBtnText}>Tahrirlash</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.finishHomeBtn}
              onPress={() => {
                setCurrentView('home');
                setSelectedTemplate(null);
                setTopTab('history');
              }}
              activeOpacity={0.85}
            >
              <Ionicons name="checkmark-done" size={17} color="#FFFFFF" />
              <Text style={styles.finishHomeBtnText}>Mening arizalarimga o'tish</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

// ==================== STYLES ====================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  // Top Header
  topHeader: {
    height: 54,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 6,
    minWidth: 80,
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E3A5F',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  headerRightBtn: {
    minWidth: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
    padding: 6,
  },

  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
  },

  // Tab switch
  tabSwitchContainer: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    padding: 3,
    marginBottom: 14,
  },
  tabSwitchBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 10,
  },
  tabSwitchBtnActive: {
    backgroundColor: '#1E3A8A',
  },
  tabSwitchText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#64748B',
  },
  tabSwitchTextActive: {
    color: '#FFFFFF',
  },

  // Hero
  heroBanner: {
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  heroBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
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
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 11.5,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 16,
  },
  heroIconBox: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statNum: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1E3A8A',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 9.5,
    color: '#64748B',
    textAlign: 'center',
  },

  // Search
  searchBar: {
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
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    paddingVertical: 0,
  },

  // Category
  categoryScroll: {
    marginBottom: 12,
  },
  categoryRow: {
    gap: 6,
  },
  catPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  catPillActive: {
    backgroundColor: '#1E3A8A',
    borderColor: '#1E3A8A',
  },
  catPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  catPillTextActive: {
    color: '#FFFFFF',
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 10,
  },

  // Template Card
  templateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  templateCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  templateIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  templateMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  categoryBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  durationBadgeText: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '600',
  },
  templateTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 18,
  },
  templateDesc: {
    fontSize: 11.5,
    color: '#475569',
    lineHeight: 16,
    marginBottom: 10,
  },
  templateFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
  },
  templateOrg: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    marginRight: 10,
  },
  templateOrgText: {
    fontSize: 10.5,
    color: '#64748B',
  },
  startBtnPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1E3A8A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  startBtnPillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Detail View Styles
  detailHeaderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  detailIconBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 6,
    lineHeight: 22,
  },
  detailDesc: {
    fontSize: 12.5,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 18,
  },

  paramGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  paramBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  paramVal: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 4,
    marginBottom: 1,
  },
  paramLabel: {
    fontSize: 9.5,
    color: '#64748B',
    textAlign: 'center',
  },

  detailBlock: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  detailBlockTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  detailRowText: {
    flex: 1,
    fontSize: 12,
    color: '#334155',
    lineHeight: 17,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 6,
  },
  bulletText: {
    flex: 1,
    fontSize: 11.5,
    color: '#334155',
    lineHeight: 16,
  },
  expectedText: {
    fontSize: 12,
    color: '#065F46',
    lineHeight: 17,
    fontWeight: '500',
  },

  // MAIN "XIZMATDAN FOYDALANISH" BUTTON
  mainUseServiceBtn: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 10,
    marginBottom: 16,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  mainUseServiceGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  mainUseServiceText: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },

  // Stepper
  stepperContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  stepItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    backgroundColor: '#2563EB',
  },
  stepCircleCompleted: {
    backgroundColor: '#059669',
  },
  stepCircleInactive: {
    backgroundColor: '#E2E8F0',
  },
  stepCircleText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
  },
  stepCircleTextActive: {
    color: '#FFFFFF',
  },
  stepItemTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748B',
  },
  stepItemTitleActive: {
    color: '#0F172A',
    fontWeight: '800',
  },

  // Quick action bar
  quickActionsBar: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  sampleFillBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFFBEB',
    borderRadius: 10,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  sampleFillBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#B45309',
  },
  aiPolishBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  aiPolishBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#1E40AF',
  },

  formTargetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  formTargetInfoText: {
    flex: 1,
    fontSize: 11.5,
    fontWeight: '600',
    color: '#334155',
  },

  stepSectionTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  stepSectionSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 12,
    lineHeight: 15,
  },

  fieldBlock: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 5,
  },
  fieldInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0F172A',
    minHeight: 44,
  },
  fieldInputMultiline: {
    minHeight: 85,
    paddingTop: 10,
  },

  nextStepBtn: {
    backgroundColor: '#1E3A8A',
    borderRadius: 14,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  nextStepBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  stepNavRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  stepPrevBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  stepPrevBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#475569',
  },
  stepNextPill: {
    flex: 1,
    backgroundColor: '#1E3A8A',
    borderRadius: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  // Attach card
  attachCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  attachHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  attachTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },
  attachedFileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginBottom: 6,
  },
  attachedFileName: {
    flex: 1,
    fontSize: 11.5,
    color: '#065F46',
    fontWeight: '600',
  },
  addFileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    paddingVertical: 9,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#93C5FD',
    marginTop: 4,
  },
  addFileBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#2563EB',
  },

  generateBtn: {
    flex: 1,
    backgroundColor: '#059669',
    borderRadius: 14,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  generateBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Preview View
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  successIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#065F46',
    marginBottom: 2,
  },
  successSubtitle: {
    fontSize: 11,
    color: '#047857',
    lineHeight: 15,
  },

  previewActionGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  previewBtnPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 12,
  },
  previewBtnPrimaryText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  previewBtnSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  previewBtnSecondaryText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },

  // Official Document Blank
  docOfficialBlank: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  blankHeader: {
    alignItems: 'center',
    marginBottom: 10,
  },
  emblemBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  blankHeaderTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#1E3A8A',
    letterSpacing: 1,
  },
  blankHeaderSub: {
    fontSize: 8.5,
    color: '#64748B',
    fontWeight: '700',
    letterSpacing: 0.5,
    marginTop: 1,
  },
  blankHeaderDivider: {
    width: '100%',
    height: 1.5,
    backgroundColor: '#CBD5E1',
    marginTop: 8,
  },
  docPrintText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontSize: 11.5,
    color: '#0F172A',
    lineHeight: 18,
    marginVertical: 10,
  },
  blankFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 10,
    marginTop: 4,
  },
  qrSimulation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  qrText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#1E3A8A',
    width: 90,
  },
  verifiedStampText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#059669',
  },
  verifiedStampSub: {
    fontSize: 8.5,
    color: '#64748B',
  },

  // Submit Guide
  submitGuideBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  submitGuideTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
  },
  guideStepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  guideStepNum: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  guideStepNumText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#2563EB',
  },
  guideStepTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },
  guideStepDesc: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
  },

  bottomActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  editAgainBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  editAgainBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#475569',
  },
  finishHomeBtn: {
    flex: 1,
    backgroundColor: '#1E3A8A',
    borderRadius: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  finishHomeBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // History Tab Styles
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  historyRegPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  historyRegText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1E3A8A',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  historyTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  historyOrg: {
    fontSize: 11.5,
    color: '#475569',
    marginBottom: 3,
  },
  historyDate: {
    fontSize: 10.5,
    color: '#94A3B8',
    marginBottom: 10,
  },
  historyActions: {
    flexDirection: 'row',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
  },
  historyBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    paddingVertical: 7,
  },
  historyBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },

  // Empty state
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 10,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#94A3B8',
  },
  emptySubText: {
    fontSize: 11.5,
    color: '#CBD5E1',
    textAlign: 'center',
  },
});
