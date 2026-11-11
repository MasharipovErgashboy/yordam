import React, { useState } from 'react';
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
  Modal,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Assets
const heroGraphic = require('../../assets/images/istemolchi_hero_graphic.png');
const mehnatAiRobot = require('../../assets/images/mehnat_ai_robot.png');

export type IstemolchiTab = 'home' | 'rights' | 'ai' | 'documents';
type RightsFilterType = 'all' | 'basic' | 'popular';

interface RightItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'basic' | 'popular';
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  bgColor: string;
  borderColor: string;
  legalArticle: string;
  lawName: string;
  explanation: string;
  practicalSteps: string[];
  sampleDocName: string;
}

interface IstemolchiHuquqlariScreenProps {
  onBack: () => void;
}

export const IstemolchiHuquqlariScreen: React.FC<IstemolchiHuquqlariScreenProps> = ({ onBack }) => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<IstemolchiTab>('home');
  const [heroSlideIdx, setHeroSlideIdx] = useState<number>(0);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [hasUnreadNotification, setHasUnreadNotification] = useState<boolean>(true);

  // Rights Tab states
  const [rightsSearchQuery, setRightsSearchQuery] = useState<string>('');
  const [rightsFilter, setRightsFilter] = useState<RightsFilterType>('all');
  const [selectedRightDetail, setSelectedRightDetail] = useState<RightItem | null>(null);
  const [showLegalDocsModal, setShowLegalDocsModal] = useState<boolean>(false);

  // AI Chat Input state
  const [aiQuestion, setAiQuestion] = useState<string>('');
  const [aiChatMessages, setAiChatMessages] = useState<
    Array<{ id: string; sender: 'user' | 'bot'; text: string; time: string }>
  >([
    {
      id: 'm1',
      sender: 'bot',
      text: 'Assalomu alaykum! Men Iste’molçilar huquqlarini himoya qiliş böyiça AI yordamçiman. Do‘kondan olingan sifatsiz tovar, kafolat muddati yoki pulni qaytariş böyiça savolingizni bering.',
      time: '10:00',
    },
  ]);

  // 6 Rights matching the uploaded screenshot
  const RIGHTS_LIST: RightItem[] = [
    {
      id: 'r1',
      title: 'Sifatli mahsulot huquqi',
      subtitle: 'Xavfsiz va standartlarga mos mahsulot oliş huquqi.',
      category: 'basic',
      icon: 'cube-outline',
      iconColor: '#E11D48',
      bgColor: '#FFF1F2',
      borderColor: '#FFE4E6',
      legalArticle: '4-modda',
      lawName: '«Iste’molchilarning huquqlarini himoya qilish to‘g‘risida»gi Qonun',
      explanation: 'Iste’molchi sotib olgan tovarining (ish, xizmatning) xavfsiz bo‘lishi, sanitariya-gigiyena me’yorlariga va amaldagi davlat standartlariga to‘liq javob berishini talab qilishga qat’iy haqlidir.',
      practicalSteps: [
        'Mahsulot sertifikati va muvofiqlik belgisi mavjudligini tekshiring.',
        'Standart talablariga mos kelmagan tovar sotilganda xarid chekini saqlang.',
        'Zudlik bilan sotuvchiga yoki SES inspeksiyasiga murojaat qiling.',
      ],
      sampleDocName: 'Sifatsiz tovar haqida sotuvchiga e’tiroz xati',
    },
    {
      id: 'r2',
      title: 'Kafolat (garantiya) huquqi',
      subtitle: 'Mahsulotning kafolat muddati davomida ta’mir, almaştiriş yoki qaytariş huquqi.',
      category: 'basic',
      icon: 'shield-checkmark-outline',
      iconColor: '#2563EB',
      bgColor: '#EFF6FF',
      borderColor: '#DBEAFE',
      legalArticle: '11-modda',
      lawName: '«Iste’molchilarning huquqlarini himoya qilish to‘g‘risida»gi Qonun',
      explanation: 'Kafolat muddati davomida tovarda aniqlangan barcha kamchiliklar sotuvchi yoki ishlab chiqaruvchi hisobidan mutlaqo bepul bartaraf etiladi. Tovar ta’mirlanayotgan muddat kafolat muddatiga qo‘shib uzaytiriladi.',
      practicalSteps: [
        'Kafolat talonida muhr va sotuv sanasi borligini tekshiring.',
        'Ta’mirlash 20 kundan oshib ketsa, yangi tovarga almashtirishni talab qiling.',
        'Muzlatgich, televizor kabi tovarlar ta’mirda bo‘lgan davrda vaqtincha foydalanishga bepul muqobil tovar berilishi shart.',
      ],
      sampleDocName: 'Kafolat bo‘yicha bepul ta’mirlash talabnomasi',
    },
    {
      id: 'r3',
      title: 'Qaytariş va almaştiriş',
      subtitle: 'Sifatsiz yoki mos kelmaydigan mahsulotni qaytariş yoki almaştiriş tartibi.',
      category: 'popular',
      icon: 'sync-outline',
      iconColor: '#16A34A',
      bgColor: '#F0FDF4',
      borderColor: '#DCFCE7',
      legalArticle: '18-modda',
      lawName: '«Iste’molchilarning huquqlarini himoya qilish to‘g‘risida»gi Qonun',
      explanation: 'Xaridor maqbul sifatli nooziq-ovqat tovarini o‘lchami, rangi yoki shakli to‘g‘ri kelmagan taqdirda 10 kun ichida qaytarish yoki boshqasiga almashtirib olishga haqli.',
      practicalSteps: [
        'Tovar iste’mol xususiyatlari, plombalari va yorliqlari saqlangan bo‘lishi lozim.',
        'Kassa yoki tovar cheki, yoki xaridni tasdiqlovchi guvohlar ko‘rsatmasi taqdim etiladi.',
        'Sotuvchida muqobil tovar bo‘lmasa, to‘langan pul to‘liq qaytariladi.',
      ],
      sampleDocName: 'Tovarni 10 kun ichida qaytarish va pulni talab qilish arizasi',
    },
    {
      id: 'r4',
      title: 'Xizmat sifatiga oid huquqlar',
      subtitle: 'Körsatilgan xizmatning sifati, hajmi va şartlariga mos bölişi.',
      category: 'popular',
      icon: 'headset-outline',
      iconColor: '#D97706',
      bgColor: '#FFFBEB',
      borderColor: '#FEF3C7',
      legalArticle: '19-modda',
      lawName: '«Iste’molchilarning huquqlarini himoya qilish to‘g‘risida»gi Qonun',
      explanation: 'Xizmat ko‘rsatuvchi shartnomada belgilangan muddatda va sifatda xizmat ko‘rsatishi shart. Agar xizmat kechiktirilsa, har bir kechiktirilgan kun yoki soat uchun to‘langan summaning 1 foizi miqdorida penya undiriladi.',
      practicalSteps: [
        'Xizmat ko‘rsatish shartnomasi va to‘lov kvitansiyasini saqlang.',
        'Kamchiliklar aniqlanganda kamchilikni bepul bartaraf etish yoki narxni kamaytirish talabnomasini bering.',
        'Xizmat ko‘rsatish rad etilsa, iste’molchilar qo‘mitasiga murojaat qiling.',
      ],
      sampleDocName: 'Sifatsiz xizmat uchun pulni qaytarish talabnomasi',
    },
    {
      id: 'r5',
      title: 'Töliq va aniq ma’lumot oliş',
      subtitle: 'Mahsulot yoki xizmat haqida töğri, aniq va töliq ma’lumot berilişi.',
      category: 'basic',
      icon: 'document-text-outline',
      iconColor: '#7C3AED',
      bgColor: '#F5F3FF',
      borderColor: '#EDE9FE',
      legalArticle: '5-modda',
      lawName: '«Iste’molchilarning huquqlarini himoya qilish to‘g‘risida»gi Qonun',
      explanation: 'Sotuvchi tovarning narxi, ishlab chiqaruvchi mamlakat, yaroqlilik muddati, xavfsizlik qoidalari haqida o‘zbek tilida to‘liq va ishonchli ma’lumot berishi shart. Noto‘g‘ri ma’lumot berilsa, shartnoma bekor qilinadi.',
      practicalSteps: [
        'Mahsulot qadog‘idagi shtrix-kod va o‘zbek tilidagi yorliqni tekshiring.',
        'Kassada ko‘rsatilgan narx rastadagi narxdan baland bo‘lsa, rastadagi narx bo‘yicha sotib olish huquqiga egasiz.',
        'Yashirin to‘lov yoki yolg‘on reklama aniqlanganda shikoyat qiling.',
      ],
      sampleDocName: 'Chalg‘ituvchi narx va ma’lumot yuzasidan shikoyat arizasi',
    },
    {
      id: 'r6',
      title: 'Huquq buzilganda himoya',
      subtitle: 'Sotuvçi talabni bajarmasa, rasmiy şikoyat qiliş va zararni qoplaş huquqi.',
      category: 'popular',
      icon: 'warning-outline',
      iconColor: '#EF4444',
      bgColor: '#FEF2F2',
      borderColor: '#FEE2E2',
      legalArticle: '14, 29-moddalar',
      lawName: '«Iste’molchilarning huquqlarini himoya qilish to‘g‘risida»gi Qonun',
      explanation: 'Sotuvchi qonuniy talabni rad etsa, iste’molchi davlat organlariga, Raqobat qo‘mitasiga (1159) va sudga murojaat qilishga haqli. Iste’molchilar sudlarda davlat boji to‘lashdan butunlay ozod etilgan.',
      practicalSteps: [
        'Sotuvchiga yuborilgan yozma e’tiroz xatining nusxasini saqlang.',
        '10 kunlik muddat tugagach, 1159 ishonch telefoniga qo‘ng‘iroq qiling.',
        'Sud orqali moddiy zararni va qo‘shimcha ma’naviy kompensatsiyani undiring.',
      ],
      sampleDocName: 'Raqobat qo‘mitasiga rasmiy shikoyat arizasi',
    },
  ];

  // Filtered Rights List
  const filteredRights = RIGHTS_LIST.filter((item) => {
    const matchesFilter =
      rightsFilter === 'all' ? true : item.category === rightsFilter;
    const matchesSearch =
      rightsSearchQuery.trim().length === 0
        ? true
        : item.title.toLowerCase().includes(rightsSearchQuery.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(rightsSearchQuery.toLowerCase()) ||
          item.legalArticle.toLowerCase().includes(rightsSearchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Handle Quick Issue Press
  const handleQuickIssuePress = (issueTitle: string) => {
    Alert.alert(
      issueTitle,
      `«${issueTitle}» böyiça iste’molçi huquqlarini himoya qiliş tartibi:\n\n1. Sotuvçiga 10 kunlik muddat bilan rasmiy talabnoma taqdim etiladi.\n2. Mahsulot çeki yoki guvohlar körsatmasi dalil sifatida ilova qilinadi.\n3. Agar sotuvçi rad etsa, Raqobatni rivojlantiriş va iste’molçilar huquqlarini himoya qiliş qömitasiga (1159) murojaat qilinadi.\n\nSotuvçiga tayyor talabnoma andozasini generatsiya qilişni xohlaysizmi?`,
      [
        { text: 'Bekor qiliş', style: 'cancel' },
        {
          text: 'Talabnoma yaratish',
          onPress: () => {
            setActiveTab('documents');
          },
        },
      ]
    );
  };

  // Handle Main Service Press
  const handleServicePress = (serviceId: string) => {
    if (serviceId === 'rights') {
      setActiveTab('rights');
    } else if (serviceId === 'docs') {
      setActiveTab('documents');
    } else if (serviceId === 'proofs') {
      Alert.alert(
        'Dalillarim (Şaxsiy himoya arxivi)',
        '📸 Xarid qilingan tovar çeki, kafolat taloni, fotosuratlar va audio/video yozuvlarni xavfsiz saqlash bölimi.\n\nYangi dalil (çek yoki foto) qöşilsinmi?',
        [
          { text: 'Bekor qiliş', style: 'cancel' },
          { text: 'Çek rasmini yuklash', onPress: () => Alert.alert('Muvaffaqiyatli', 'Çek rasmi dalillar arxiviga saqlandi.') },
        ]
      );
    } else if (serviceId === 'authorities') {
      Alert.alert(
        'Rasmiy tashkilotlar va ishonch telefonlari',
        '🏛️ Iste’molchi huquqlari buzilganda murojaat qilinadigan davlat organlari:\n\n1. Raqobatni rivojlantirish va iste’molchilar huquqlarini himoya qilish qo‘mitasi: 1159\n2. Iste’molchilar huquqlarini himoya qilish jamiyatlari federatsiyasi: 1091\n3. Sanitariya-epidemiologiya xizmati (SES): +998 71 276-58-75\n4. O‘zbekiston texnik jihatdan tartibga solish agentligi: 1200\n5. Fuqarolik ishlari bo‘yicha sudlar\n\nQo‘ng‘iroq qilish yoki rasmiy shikoyat xati yo‘llash mumkin.',
        [{ text: 'Tuşundim' }]
      );
    }
  };

  // Handle Send AI message
  const handleSendAi = (textToSend?: string) => {
    const q = textToSend || aiQuestion;
    if (!q.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user' as const,
      text: q,
      time: 'Hozir',
    };

    setAiChatMessages((prev) => [...prev, userMsg]);
    setAiQuestion('');

    setTimeout(() => {
      const botReply = {
        id: (Date.now() + 1).toString(),
        sender: 'bot' as const,
        text: `«Iste’molchilarning huquqlarini himoya qilish to‘g‘risida»gi Qonunning 14 va 18-moddalariga muvofiq, xaridor nuqsonli tovar sotilganda uni maqbul sifatlisiga almashtirish yoki to‘langan pulni to‘liq qaytarib olishga haqli.\n\nSotuvchi tovar sifatini tekshirish uchun ekspertizani o‘z hisobidan o‘tkazishi shart. Agar 10 kun ichida talab qanoatlantirilmasa, har bir kun uchun tovar narxining 1 foizi miqdorida penya to‘laydi.`,
        time: 'Hozir',
      };
      setAiChatMessages((prev) => [...prev, botReply]);
    }, 450);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      {/* ===================== 1. TOP HEADER BAR ===================== */}
      <View style={styles.topHeader}>
        {/* Left: Navy Circle with Bag Icon + Title & Subtitle */}
        <View style={styles.headerLeftGroup}>
          <TouchableOpacity style={styles.headerIconCircle} activeOpacity={0.8} onPress={onBack}>
            <Ionicons name="bag-handle" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.headerTitlesCol}>
            <Text style={styles.headerMainTitle}>Iste’molçi huquqlari</Text>
            <Text style={styles.headerSubtitle}>Xaridorlar uçun huquqiy yordam</Text>
          </View>
        </View>

        {/* Right: Notification Bell + Bookmark */}
        <View style={styles.headerRightGroup}>
          <TouchableOpacity
            style={styles.headerActionBtn}
            activeOpacity={0.7}
            onPress={() => {
              setHasUnreadNotification(false);
              Alert.alert('Bildirişnomalar', 'Xaridorlar uçun yangi qonunçilik yangiliklari va talabnomangiz holati: Barcha xabarlar o‘qildi.');
            }}
          >
            <Ionicons name="notifications-outline" size={19} color="#0F172A" />
            {hasUnreadNotification && <View style={styles.notificationRedDot} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerActionBtn}
            activeOpacity={0.7}
            onPress={() => {
              setIsBookmarked(!isBookmarked);
              Alert.alert('Xatchöp', isBookmarked ? 'Xatchöplardan öçirildi.' : 'Uşbu ilova xatchöplaringizga saqlandi.');
            }}
          >
            <Ionicons
              name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
              size={19}
              color={isBookmarked ? '#F59E0B' : '#0F172A'}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* ===================== 2. MAIN SCROLL AREA ===================== */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 16) + 72 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ===================== TAB 1: BOSH SAHIFA ===================== */}
        {activeTab === 'home' && (
          <>
            {/* 1. HERO BANNER CARD */}
            <View style={styles.heroCardOuter}>
              <LinearGradient
                colors={['#07192F', '#0D274A', '#133563']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroGradient}
              >
                {/* Left Content */}
                <View style={styles.heroLeftCol}>
                  <Text style={styles.heroTitle}>
                    Xaridor sifatida{'\n'}
                    huquqlaringizni biling{'\n'}
                    va <Text style={styles.heroTitleGold}>himoya qiling</Text>
                  </Text>

                  <Text style={styles.heroSubtitle}>
                    Sifatsiz mahsulot, kafolat, qaytariş va boşqa muammolarda amaliy yordam.
                  </Text>

                  <TouchableOpacity
                    style={styles.heroCtaBtn}
                    activeOpacity={0.85}
                    onPress={() => handleQuickIssuePress('Umumiy iste’molchi huquqlari')}
                  >
                    <Text style={styles.heroCtaText}>Muammom bor</Text>
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

            {/* Pagination Dots */}
            <View style={styles.paginationRow}>
              {[0, 1, 2].map((idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => setHeroSlideIdx(idx)}
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
                onPress={() => handleQuickIssuePress('Sifatsiz mahsulot')}
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
                onPress={() => handleQuickIssuePress('Kafolat bilan bog‘liq muammo')}
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
                onPress={() => handleQuickIssuePress('Qaytarish yoki almashtirish')}
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
                onPress={() => handleQuickIssuePress('Xizmat sifati va boshqa muammolar')}
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

        {/* ===================== TAB 2: HUQUQLAR (MATCHING SCREENSHOT 1:1) ===================== */}
        {activeTab === 'rights' && (
          <View style={styles.rightsRootContainer}>
            {/* 1. Page Header: Large "Huquqlar" + Subtitle */}
            <View style={styles.rightsHeaderBlock}>
              <Text style={styles.rightsMainTitle}>Huquqlar</Text>
              <Text style={styles.rightsMainSubtitle}>
                Iste’molçi sifatida sizning asosiy huquqlaringiz va{'\n'}qonuniy kafolatlaringiz.
              </Text>
            </View>

            {/* 2. Search Bar */}
            <View style={styles.rightsSearchBox}>
              <Ionicons name="search-outline" size={19} color="#94A3B8" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.rightsSearchInput}
                placeholder="Mavzu yoki savolni qidiring..."
                placeholderTextColor="#94A3B8"
                value={rightsSearchQuery}
                onChangeText={setRightsSearchQuery}
                returnKeyType="search"
              />
              {rightsSearchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setRightsSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Ionicons name="close-circle" size={18} color="#94A3B8" />
                </TouchableOpacity>
              )}
            </View>

            {/* 3. Filter Tabs (Pills) */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.rightsFilterScroll}
            >
              {/* Pill 1: Barcha mavzular */}
              <TouchableOpacity
                style={[
                  styles.rightsFilterPill,
                  rightsFilter === 'all' && styles.rightsFilterPillActive,
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
                    styles.rightsFilterText,
                    rightsFilter === 'all' && styles.rightsFilterTextActive,
                  ]}
                >
                  Barça mavzular
                </Text>
              </TouchableOpacity>

              {/* Pill 2: Asosiy huquqlar */}
              <TouchableOpacity
                style={[
                  styles.rightsFilterPill,
                  rightsFilter === 'basic' && styles.rightsFilterPillActive,
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
                    styles.rightsFilterText,
                    rightsFilter === 'basic' && styles.rightsFilterTextActive,
                  ]}
                >
                  Asosiy huquqlar
                </Text>
              </TouchableOpacity>

              {/* Pill 3: Ko‘p so‘raladigan */}
              <TouchableOpacity
                style={[
                  styles.rightsFilterPill,
                  rightsFilter === 'popular' && styles.rightsFilterPillActive,
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
                    styles.rightsFilterText,
                    rightsFilter === 'popular' && styles.rightsFilterTextActive,
                  ]}
                >
                  Köp söraladigan
                </Text>
              </TouchableOpacity>
            </ScrollView>

            {/* 4. 6 Rights Cards List matching screenshot */}
            <View style={styles.rightsCardsList}>
              {filteredRights.length === 0 ? (
                <View style={styles.emptySearchBox}>
                  <Ionicons name="search-outline" size={32} color="#CBD5E1" style={{ marginBottom: 6 }} />
                  <Text style={styles.emptySearchTitle}>Mavzu topilmadi</Text>
                  <Text style={styles.emptySearchSub}>«{rightsSearchQuery}» bo‘yicha hech qanday natija chiqmadi.</Text>
                </View>
              ) : (
                filteredRights.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.rightCardItem}
                    activeOpacity={0.8}
                    onPress={() => setSelectedRightDetail(item)}
                  >
                    {/* Left Tinted Icon Wrap */}
                    <View
                      style={[
                        styles.rightCardIconWrap,
                        { backgroundColor: item.bgColor, borderColor: item.borderColor },
                      ]}
                    >
                      <Ionicons name={item.icon} size={22} color={item.iconColor} />
                    </View>

                    {/* Middle: Title & Subtitle */}
                    <View style={styles.rightCardTextCol}>
                      <Text style={styles.rightCardTitle} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text style={styles.rightCardSubtitle} numberOfLines={2}>
                        {item.subtitle}
                      </Text>
                    </View>

                    {/* Right Chevron */}
                    <Ionicons name="chevron-forward" size={17} color="#64748B" />
                  </TouchableOpacity>
                ))
              )}
            </View>

            {/* 5. Bottom Callout Banner: Asosiy qonun va hujjatlar */}
            <TouchableOpacity
              style={styles.legalCalloutCard}
              activeOpacity={0.88}
              onPress={() => setShowLegalDocsModal(true)}
            >
              <LinearGradient
                colors={['#FFFDF2', '#FEF8DB', '#FEF3C7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.legalCalloutGradient}
              >
                {/* Tarozi (Scale) Icon */}
                <View style={styles.legalCalloutIconWrap}>
                  <Ionicons name="scale-outline" size={26} color="#D97706" />
                </View>

                {/* Text Col */}
                <View style={styles.legalCalloutTextCol}>
                  <Text style={styles.legalCalloutTitle}>Asosiy qonun va hujjatlar</Text>
                  <Text style={styles.legalCalloutSubtitle} numberOfLines={2}>
                    Iste’molçilar huquqlarini himoya qiluvçi asosiy qonunlar va rasmiy hujjatlar.
                  </Text>
                </View>

                {/* Right CTA Text */}
                <View style={styles.legalCalloutCtaWrap}>
                  <Text style={styles.legalCalloutCtaText}>Köriş →</Text>
                </View>
              </LinearGradient>
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
            <View style={styles.tabHeader}>
              <Text style={styles.tabHeaderTitle}>Hujjatlar va Talabnomalar markazi</Text>
              <Text style={styles.tabHeaderSub}>
                Sotuvchilar, ishlab chiqaruvchilar va sud organlari uchun rasmiy andoza arizalar.
              </Text>
            </View>

            {[
              {
                id: 'd1',
                title: 'Sotuvchiga tovar pulini qaytarish talabnomasi',
                desc: 'Nuqsonli tovar sotilganda pulni 10 kun ichida qaytarish haqida rasmiy e’tiroz xati.',
                type: 'Talabnoma',
                typeColor: '#DC2626',
                typeBg: '#FEE2E2',
              },
              {
                id: 'd2',
                title: 'Tovarni kafolat bo‘yicha bepul ta’mirlash talabnomasi',
                desc: 'Kafolat muddatida sifat buzilganda servis markazi va sotuvchiga yo‘llanadigan xat.',
                type: 'Ariza',
                typeColor: '#2563EB',
                typeBg: '#DBEAFE',
              },
              {
                id: 'd3',
                title: 'Raqobat qo‘mitasiga (1159) rasmiy shikoyat arizasi',
                desc: 'Sotuvchi qonuniy talablarni bajarmagan holatda davlat inspeksiyasiga shikoyat arizasi.',
                type: 'Şikoyat',
                typeColor: '#7C3AED',
                typeBg: '#EDE9FE',
              },
              {
                id: 'd4',
                title: 'Sudga da’vo arizasi (moddiy va ma’naviy zarar)',
                desc: 'Yetkazilgan moddiy zararni va ma’naviy kompensatsiyani undirish bo‘yicha sud da’vosi.',
                type: 'Da’vo',
                typeColor: '#D97706',
                typeBg: '#FEF3C7',
              },
            ].map((doc) => (
              <View key={doc.id} style={styles.docTemplateCard}>
                <View style={styles.docTemplateHeader}>
                  <View style={[styles.docTypeBadge, { backgroundColor: doc.typeBg }]}>
                    <Text style={[styles.docTypeBadgeText, { color: doc.typeColor }]}>{doc.type}</Text>
                  </View>
                  <Text style={styles.docFreeBadge}>Bepul andoza</Text>
                </View>

                <Text style={styles.docTemplateTitle}>{doc.title}</Text>
                <Text style={styles.docTemplateDesc}>{doc.desc}</Text>

                <View style={styles.docTemplateActions}>
                  <TouchableOpacity
                    style={styles.docTemplateBtnSec}
                    onPress={() => Alert.alert(doc.title, 'Hujjat matni ko‘rish uchun ochilmoqda.')}
                  >
                    <Ionicons name="eye-outline" size={15} color="#0F172A" style={{ marginRight: 5 }} />
                    <Text style={styles.docTemplateBtnSecText}>Köriş</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.docTemplateBtnPrim}
                    onPress={() => Alert.alert('Konstruktor', `«${doc.title}» bo‘yicha shaxsiy ma’lumotlarni kiritish konstruktori ishga tushirilmoqda.`)}
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

      {/* ===================== 3. BOTTOM NAVBAR ===================== */}
      <View style={[styles.bottomNavbar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
        {/* Tab 1: Bosh sahifa */}
        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
          onPress={() => setActiveTab('home')}
        >
          <Ionicons
            name={activeTab === 'home' ? 'home' : 'home-outline'}
            size={22}
            color={activeTab === 'home' ? '#EAB308' : '#64748B'}
          />
          <Text style={[styles.navLabel, activeTab === 'home' ? styles.navLabelActive : styles.navLabelInactive]}>
            Boş sahifa
          </Text>
        </TouchableOpacity>

        {/* Tab 2: Huquqlar */}
        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
          onPress={() => setActiveTab('rights')}
        >
          <Ionicons
            name={activeTab === 'rights' ? 'book' : 'book-outline'}
            size={22}
            color={activeTab === 'rights' ? '#EAB308' : '#64748B'}
          />
          <Text style={[styles.navLabel, activeTab === 'rights' ? styles.navLabelActive : styles.navLabelInactive]}>
            Huquqlar
          </Text>
        </TouchableOpacity>

        {/* Tab 3: AI yordamchi */}
        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
          onPress={() => setActiveTab('ai')}
        >
          <Ionicons
            name={activeTab === 'ai' ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline'}
            size={22}
            color={activeTab === 'ai' ? '#EAB308' : '#64748B'}
          />
          <Text style={[styles.navLabel, activeTab === 'ai' ? styles.navLabelActive : styles.navLabelInactive]}>
            AI yordamçi
          </Text>
        </TouchableOpacity>

        {/* Tab 4: Hujjatlar */}
        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
          onPress={() => setActiveTab('documents')}
        >
          <Ionicons
            name={activeTab === 'documents' ? 'document-text' : 'document-text-outline'}
            size={22}
            color={activeTab === 'documents' ? '#EAB308' : '#64748B'}
          />
          <Text style={[styles.navLabel, activeTab === 'documents' ? styles.navLabelActive : styles.navLabelInactive]}>
            Hujjatlar
          </Text>
        </TouchableOpacity>
      </View>

      {/* ===================== MODAL: RIGHT DETAIL MODAL ===================== */}
      {selectedRightDetail && (
        <Modal
          visible={!!selectedRightDetail}
          animationType="slide"
          transparent
          onRequestClose={() => setSelectedRightDetail(null)}
        >
          <View style={styles.modalBackdrop}>
            <View style={[styles.modalCard, { paddingBottom: Math.max(insets.bottom, 16) + 10 }]}>
              {/* Modal Drag Bar */}
              <View style={styles.modalDragBar} />

              {/* Modal Header */}
              <View style={styles.modalHeaderRow}>
                <View
                  style={[
                    styles.modalIconWrap,
                    { backgroundColor: selectedRightDetail.bgColor, borderColor: selectedRightDetail.borderColor },
                  ]}
                >
                  <Ionicons name={selectedRightDetail.icon} size={22} color={selectedRightDetail.iconColor} />
                </View>

                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.modalRightTitle}>{selectedRightDetail.title}</Text>
                  <View style={styles.modalArticlePill}>
                    <Text style={styles.modalArticlePillText}>{selectedRightDetail.legalArticle}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.modalCloseBtn}
                  onPress={() => setSelectedRightDetail(null)}
                >
                  <Ionicons name="close" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              <ScrollView style={{ maxHeight: 380 }} showsVerticalScrollIndicator={false}>
                {/* Law Reference */}
                <View style={styles.modalLawCard}>
                  <Ionicons name="book-outline" size={16} color="#D97706" style={{ marginRight: 6 }} />
                  <Text style={styles.modalLawText}>{selectedRightDetail.lawName}</Text>
                </View>

                {/* Explanation */}
                <Text style={styles.modalSectionLabel}>Huquqiy kafolat tahlili</Text>
                <Text style={styles.modalExplanationText}>{selectedRightDetail.explanation}</Text>

                {/* Practical Steps */}
                <Text style={[styles.modalSectionLabel, { marginTop: 14 }]}>Amaliy harakatlar ketma-ketligi</Text>
                <View style={{ gap: 8, marginTop: 4 }}>
                  {selectedRightDetail.practicalSteps.map((step, sIdx) => (
                    <View key={sIdx} style={styles.modalStepRow}>
                      <View style={styles.modalStepNum}>
                        <Text style={styles.modalStepNumText}>{sIdx + 1}</Text>
                      </View>
                      <Text style={styles.modalStepText}>{step}</Text>
                    </View>
                  ))}
                </View>
              </ScrollView>

              {/* Modal Actions */}
              <View style={styles.modalActionsRow}>
                <TouchableOpacity
                  style={styles.modalAskAiBtn}
                  activeOpacity={0.8}
                  onPress={() => {
                    const q = `«${selectedRightDetail.title}» bo‘yicha menga amaliy yuridik maslahat bering.`;
                    setSelectedRightDetail(null);
                    setActiveTab('ai');
                    handleSendAi(q);
                  }}
                >
                  <Ionicons name="sparkles" size={16} color="#4F46E5" style={{ marginRight: 5 }} />
                  <Text style={styles.modalAskAiText}>AI bilan tahlil</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalCreateDocBtn}
                  activeOpacity={0.8}
                  onPress={() => {
                    setSelectedRightDetail(null);
                    setActiveTab('documents');
                  }}
                >
                  <Ionicons name="create-outline" size={16} color="#FFFFFF" style={{ marginRight: 5 }} />
                  <Text style={styles.modalCreateDocText}>Talabnoma yaratish</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* ===================== MODAL: ASOSIY QONUN VA HUJJATLAR ===================== */}
      <Modal
        visible={showLegalDocsModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowLegalDocsModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { paddingBottom: Math.max(insets.bottom, 16) + 10 }]}>
            <View style={styles.modalDragBar} />

            <View style={styles.modalHeaderRow}>
              <View style={styles.legalCalloutIconWrap}>
                <Ionicons name="scale-outline" size={24} color="#D97706" />
              </View>

              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.modalRightTitle}>Asosiy qonun va hujjatlar</Text>
                <Text style={{ fontSize: 11, color: '#64748B' }}>O‘zbekiston Respublikasi rasmiy qonunchilik bazasi</Text>
              </View>

              <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowLegalDocsModal(false)}>
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 380 }} showsVerticalScrollIndicator={false}>
              {[
                {
                  title: 'O‘zbekiston Respublikasining «Iste’molchilarning huquqlarini himoya qilish to‘g‘risida»gi Qonuni',
                  date: '1996-yil 26-aprel, 221-I-son (Yangi tahrir)',
                  articlesCount: '30 ta modda',
                  desc: 'Iste’molchilarning asosiy huquqlari, tovarlarni almashtirish, kafolat va zararni qoplashning fundamental qonuniy asosi.',
                },
                {
                  title: 'Chakana savdo qoidalari (Vazirlar Mahkamasi qarori)',
                  date: '2003-yil 13-fevral, 75-son',
                  articlesCount: 'Savdo qoidalari',
                  desc: 'Do‘konlar, bozorlar va elektron tijoratda xaridorga xizmat ko‘rsatish, kassa cheki berish va tovarlarni qaytarish tartibi.',
                },
                {
                  title: 'Raqobatni rivojlantirish va iste’molchilar huquqlarini himoya qilish qo‘mitasi to‘g‘risida Nizom',
                  date: 'Prezident Farmoni (PF-110-son)',
                  articlesCount: 'Nazorat vakolatlari',
                  desc: 'Vakolatli davlat organiga murojaat qilish, tadbirkorlik subyektlariga nisbatan tekshiruv tayinlash va jarimalar qo‘llash.',
                },
              ].map((doc, dIdx) => (
                <View key={dIdx} style={styles.legalDocCard}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text style={styles.legalDocDate}>{doc.date}</Text>
                    <Text style={styles.legalDocArticles}>{doc.articlesCount}</Text>
                  </View>
                  <Text style={styles.legalDocCardTitle}>{doc.title}</Text>
                  <Text style={styles.legalDocCardDesc}>{doc.desc}</Text>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.legalDocsCloseBtn}
              activeOpacity={0.85}
              onPress={() => setShowLegalDocsModal(false)}
            >
              <Text style={styles.legalDocsCloseBtnText}>Tushundim</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  // ===================== RIGHTS TAB (MATCHING SCREENSHOT) =====================
  rightsRootContainer: {
    gap: 12,
    paddingTop: 2,
  },
  rightsHeaderBlock: {
    marginBottom: 2,
  },
  rightsMainTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  rightsMainSubtitle: {
    fontSize: 12.5,
    color: '#64748B',
    lineHeight: 18,
    fontWeight: '500',
  },
  rightsSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  rightsSearchInput: {
    flex: 1,
    fontSize: 13.5,
    color: '#0F172A',
  },
  rightsFilterScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
  },
  rightsFilterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 14,
  },
  rightsFilterPillActive: {
    backgroundColor: '#0A192F',
  },
  rightsFilterText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  rightsFilterTextActive: {
    color: '#FFFFFF',
  },
  rightsCardsList: {
    gap: 10,
    marginTop: 2,
  },
  rightCardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  rightCardIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  rightCardTextCol: {
    flex: 1,
    marginLeft: 12,
    marginRight: 6,
  },
  rightCardTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 3,
  },
  rightCardSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    lineHeight: 16,
    fontWeight: '500',
  },
  // Callout Banner: Asosiy qonun va hujjatlar
  legalCalloutCard: {
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    marginTop: 4,
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  legalCalloutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  legalCalloutIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  legalCalloutTextCol: {
    flex: 1,
    marginHorizontal: 12,
  },
  legalCalloutTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  legalCalloutSubtitle: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
    fontWeight: '500',
    marginTop: 2,
  },
  legalCalloutCtaWrap: {
    paddingLeft: 2,
  },
  legalCalloutCtaText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#D97706',
  },
  emptySearchBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  emptySearchTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  emptySearchSub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
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
  // Modal Styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    maxHeight: '85%',
  },
  modalDragBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 14,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  modalRightTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalArticlePill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 3,
  },
  modalArticlePillText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#B45309',
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalLawCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    marginBottom: 12,
  },
  modalLawText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#92400E',
    flex: 1,
  },
  modalSectionLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  modalExplanationText: {
    fontSize: 12.5,
    color: '#475569',
    lineHeight: 18,
  },
  modalStepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  modalStepNum: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginTop: 1,
  },
  modalStepNumText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  modalStepText: {
    flex: 1,
    fontSize: 12,
    color: '#334155',
    lineHeight: 17,
  },
  modalActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  modalAskAiBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalAskAiText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#4F46E5',
  },
  modalCreateDocBtn: {
    flex: 1.3,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#0F172A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCreateDocText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  // Legal Docs Modal styles
  legalDocCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  legalDocDate: {
    fontSize: 10.5,
    color: '#94A3B8',
    fontWeight: '600',
  },
  legalDocArticles: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#D97706',
  },
  legalDocCardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  legalDocCardDesc: {
    fontSize: 11.5,
    color: '#64748B',
    lineHeight: 16,
  },
  legalDocsCloseBtn: {
    backgroundColor: '#0F172A',
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  legalDocsCloseBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
