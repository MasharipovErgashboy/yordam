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

interface IstemolchiHuquqlariScreenProps {
  onBack: () => void;
}

export const IstemolchiHuquqlariScreen: React.FC<IstemolchiHuquqlariScreenProps> = ({ onBack }) => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<IstemolchiTab>('home');
  const [heroSlideIdx, setHeroSlideIdx] = useState<number>(0);

  // Handle Header Back
  const handleHeaderBack = () => {
    if (activeTab !== 'home') {
      setActiveTab('home');
    } else {
      onBack();
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

  // Handle Rights Topic Press
  const handleTopicPress = (topic: any) => {
    Alert.alert(
      topic.title,
      `📘 Qonuniy asos: ${topic.articles}\n\n${topic.fullDesc}\n\n💡 Amaliy tavsiya: Agar sotuvchi talabni qanoatlantirishdan bosh tortsa, 10 kun ichida yozma talabnoma topshiriladi yoki 1159 (Raqobat qo‘mitasi) orqali chora ko‘riladi.\n\nUshbu holat bo‘yicha tayyor talabnoma yaratilsinmi?`,
      [
        { text: 'Yopiş', style: 'cancel' },
        {
          text: 'Talabnoma yaratish',
          onPress: () => setActiveTab('documents'),
        },
      ]
    );
  };

  // Handle Open Asosiy Qonunlar Callout
  const handleOpenAsosiyQonunlar = () => {
    Alert.alert(
      'Asosiy qonun va rasmiy hujjatlar',
      '⚖️ O‘zbekiston Respublikasida iste’molchilar huquqlarini himoya qiluvchi asosiy me’yoriy baza:\n\n1. «Iste’molchilarning huquqlarini himoya qilish to‘g‘risida»gi Qonun (N 221-I)\n2. Chakana savdo qoidalari (VM 75-son qarori)\n3. Maishiy xizmat ko‘rsatish qoidalari (VM 386-son qarori)\n4. O‘zbekiston Respublikasi Fuqarolik Kodeksi (Oldi-sotdi va kafolat boblari)\n5. «Muvofiqlikni baholash to‘g‘risida»gi Qonun va GOST standartlari',
      [{ text: 'Tuşundim' }]
    );
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
            <Ionicons name="bag-handle" size={19} color="#FFFFFF" />
          </View>

          <View style={styles.headerTitlesCol}>
            <Text style={styles.headerMainTitle}>Iste’molçi huquqlari</Text>
            <Text style={styles.headerSubtitle}>Xaridorlar uçun huquqiy yordam</Text>
          </View>
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
});

