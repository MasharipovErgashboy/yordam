export interface LegalArticle {
  id: string;
  title: string;
  category: 'mehnat' | 'istemolchi' | 'kredit' | 'avto' | 'uy_joy' | 'oila' | 'sud';
  categoryLabel: string;
  badgeColor: string;
  badgeBg: string;
  date: string;
  views: string;
  readTime: string;
  summary: string;
  author: string;
  authorRole: string;
  legalBasis: string[];
  steps: { title: string; desc: string }[];
  keyTakeaway: string;
}

export const LEGAL_ARTICLES: LegalArticle[] = [
  {
    id: 'art_1',
    title: 'Mehnat shartnomasi tuzishda nimalarga e’tibor berish kerak?',
    category: 'mehnat',
    categoryLabel: 'Mehnat huquqi',
    badgeColor: '#2563EB',
    badgeBg: '#EFF6FF',
    date: '13-noy, 2026',
    views: '4 820',
    readTime: '3 daqiqa',
    author: 'Dilnoza Rahimova',
    authorRole: 'Mehnat huquqi eksperti',
    summary:
      'Mehnat shartnomasida sinov muddati, ish haqi, ta’tillar va xodimning asosiy kafolatlari to‘g‘ri ko‘rsatilganligini tekshirish bo‘yicha amaliy tavsiyalar.',
    legalBasis: [
      'O‘zbekiston Respublikasi Mehnat kodeksi 104-108-moddalari',
      'Sinov muddati 3 oydan (rahbarlar uchun 6 oydan) oshishi mumkin emas',
      'Ish haqi oyiga kamida ikki marta to‘lanishi shart',
    ],
    steps: [
      {
        title: '1. Shartnoma shaklini tekshiring',
        desc: 'Mehnat shartnomasi albatta ikki nusxada yozma tuzilishi va bir nusxasi xodimga berilishi shart. Og‘zaki kelishuvlar qonuniy kuchga ega emas.',
      },
      {
        title: '2. Lavozim va mehnat vazifalari',
        desc: 'Shartnomada qaysi lavozimda ishlashingiz va lavozim yo‘riqnomasi aniq keltirilgan bo‘lishi zarur. Sizga yo‘riqnomadan tashqari ishlarni majburlash taqiqlanadi.',
      },
      {
        title: '3. Sinov muddati shartlari',
        desc: 'Homilador ayollar, 3 yoshgacha bolasi bor shaxslar va o‘qishni bitirganidan 3 oy ichida ishga kirgan yosh mutaxassislarga sinov muddati belgilanmaydi.',
      },
      {
        title: '4. Ish vaqti va ta’til kafolati',
        desc: 'Haftalik ish vaqti 40 soatdan oshmasligi, asosiy yillik mehnat ta’tili esa kamida 21 kalendar kundan kam bo‘lmasligi qonunda belgilangan.',
      },
    ],
    keyTakeaway:
      'Hech qachon bo‘sh yoki to‘liq to‘ldirilmagan shartnomaga imzo chekmang. Ish beruvchining muhri va imzosi bor ikkinchi nusxani o‘zingizda saqlang.',
  },
  {
    id: 'art_2',
    title: 'Sifatsiz mahsulot yoki telefon sotib olganda pulni qanday qaytarish mumkin?',
    category: 'istemolchi',
    categoryLabel: 'Iste’molchi huquqlari',
    badgeColor: '#0284C7',
    badgeBg: '#F0F9FF',
    date: '12-noy, 2026',
    views: '5 310',
    readTime: '4 daqiqa',
    author: 'Akmal Zokirov',
    authorRole: 'Iste’molchilar huquqini himoya qilish bo‘yicha yurist',
    summary:
      'Sotib olingan texnika yoki kiyimda nuqson aniqlanganda sotuvchiga da’vo qilish, pulni 100% qaytarib olish yoki yangisiga almashtirish yo‘llari.',
    legalBasis: [
      '“Iste’molchilarning huquqlarini himoya qilish to‘g‘risida”gi Qonunning 13, 14, 18-moddalari',
      'Nuqsonli tovar uchun sotuvchi 10 kun ichida pulni qaytarishi yoki almashtirishi lozim',
      'Ekspertiza xarajatlari sotuvchi zimmasiga yuklatiladi',
    ],
    steps: [
      {
        title: '1. Chek yoki to‘lov kvitansiyasini toping',
        desc: 'Chek bo‘lmasa ham, to‘lov skrinshoti, guvohlar ko‘rsatmasi yoki mahsulot qutisidagi seriya raqami dalil hisoblanadi.',
      },
      {
        title: '2. Yozma talabnoma (pretinziya) topshiring',
        desc: 'Sotuvchi do‘koniga 2 nusxada yozma talabnoma bering va 1 nusxasiga qabul qilgan xodimning imzosi va sanasini qo‘ydirib oling.',
      },
      {
        title: '3. Ekspertiza talab qiling',
        desc: 'Agar sotuvchi nuqson sizning aybingiz bilan bo‘lgan deb bahona qilsa, mustaqil ekspertiza o‘tkazilishini va unda shaxsan qatnashishingizni talab qiling.',
      },
      {
        title: '4. 1159 Raqobat qo‘mitasiga murojaat',
        desc: 'Sotuvchi rad etgan taqdirda, Yordam ilovasi orqali Raqobatni rivojlantirish qo‘mitasiga rasmiy shikoyat yuboring.',
      },
    ],
    keyTakeaway:
      'Kafolat muddati davomida sotuvchi o‘z hisobidan bepul tuzatib berishi yoki sizning talabingiz bilan to‘liq pulni qaytarishi shart.',
  },
  {
    id: 'art_3',
    title: 'Kredit kartasidan firibgarlar pul yechib olganda qanday choralar ko‘riladi?',
    category: 'kredit',
    categoryLabel: 'Kredit & Xavfsizlik',
    badgeColor: '#DC2626',
    badgeBg: '#FEF2F2',
    date: '11-noy, 2026',
    views: '7 890',
    readTime: '3 daqiqa',
    author: 'Sardor Karimov',
    authorRole: 'Kiberxavfsizlik va bank huquqi maslahatchisi',
    summary:
      'Bank kartasidan ruxsatsiz yechilgan mablag‘larni to‘xtatish, kartani zudlik bilan bloklash va ichki ishlar kiberxavfsizlik xizmatiga ariza berish algoritmi.',
    legalBasis: [
      'O‘zbekiston Respublikasi Jinoyat kodeksi 168-moddasi (Firibgarlik)',
      'Markaziy bankning 3030-sonli Nizomi',
      'Bank mijoz roziligisiz yechilgan tranzaksiyani shubhali deb topish huquqiga ega',
    ],
    steps: [
      {
        title: '1. Kartani darhol bloklang',
        desc: 'Bank mobil ilovasi orqali yoki bank koll-markaziga qo‘ng‘iroq qilib, kartani zudlik bilan muzlatib qo‘ying.',
      },
      {
        title: '2. Bankdan hisob ko‘chirmasini oling',
        desc: 'Pul qaysi karta raqamiga yoki qaysi servisga o‘tganligini ko‘rsatuvchi rasmiy tranzaksiya ma’lumotnomasini yuklab oling.',
      },
      {
        title: '3. 102 yoki Kiberxavfsizlikka ariza',
        desc: 'Ichki ishlar vazirligi Kiberxavfsizlik markaziga (cyber102.uz) yoki tuman IIB ga ariza yozing va qabul qilinganlik kvitansiyasini oling.',
      },
      {
        title: '4. Bankka da’vo arizasi bering',
        desc: 'Tranzaksiya sizning ishtirokingizsiz o‘tganligini bildirib, qonuniy tekshiruv o‘tkazilishini va mablag‘ni qaytarishni so‘rang.',
      },
    ],
    keyTakeaway:
      'Hech qachon SMS orqali kelgan 6 xonali tasdiqlash kodini, karta orqa tarafidagi CVV kodini begonalarga bermang.',
  },
  {
    id: 'art_4',
    title: 'Uy-joy ijarasi shartnomasida e’tibor berilishi shart bo‘lgan 5 ta muhim qoida',
    category: 'uy_joy',
    categoryLabel: 'Uy-joy & Ijara',
    badgeColor: '#D97706',
    badgeBg: '#FFFBEB',
    date: '10-noy, 2026',
    views: '6 120',
    readTime: '4 daqiqa',
    author: 'Zuhra Karimova',
    authorRole: 'Ko‘chmas mulk huquqi bo‘yicha advokat',
    summary:
      'Ijaraga oluvchi va beruvchi o‘rtasidagi nizolarning oldini olish, depozitni qaytarish va soliq idorasida ro‘yxatdan o‘tkazish bo‘yicha to‘liq qo‘llanma.',
    legalBasis: [
      'Fuqarolik kodeksi 603-614-moddalari',
      'Ijara shartnomasi ijara.soliq.uz portalida hisobga qo‘yilishi shart',
      'Depozit to‘lovi shartnoma buzilmagan taqdirda to‘liq qaytariladi',
    ],
    steps: [
      {
        title: '1. Mulkdorlik huquqini tekshiring',
        desc: 'Ijaraga berayotgan shaxs kadastr hujjati va pasporti orqali haqiqiy mulkdor ekanligiga ishonch hosil qiling.',
      },
      {
        title: '2. Jihozlarni qabul qilish-topshirish dalolatnomasi',
        desc: 'Uydagi barcha mebel, texnika va ularning holati, hisoblagich (gaz, svet, suv) ko‘rsatkichlarini rasmiy dalolatnomaga yozib imzolang.',
      },
      {
        title: '3. To‘lov tartibi va muddatlari',
        desc: 'Ijara haqi faqat so‘mda ko‘rsatilishi kerak. To‘lovlarni bank ilovasi orqali chek qoldirib amalga oshiring.',
      },
      {
        title: '4. Muddatidan oldin bekor qilish tartibi',
        desc: 'Shartnomani bekor qilish uchun taraflar bir-birini kamida 1 oy oldin yozma xabardor qilishi lozim.',
      },
    ],
    keyTakeaway:
      'Ijara shartnomasini soliq portalida (ijara.soliq.uz) rasmiylashtiring. Bu ikkala tarafni ham asossiz ko‘chirish va jarimalardan himoya qiladi.',
  },
  {
    id: 'art_5',
    title: 'Yo‘l harakati qoidabuzarligi bo‘yicha jarima asossiz yozilsa, uni bekor qilish tartibi',
    category: 'avto',
    categoryLabel: 'Avto & YHQ',
    badgeColor: '#8B5CF6',
    badgeBg: '#F5F3FF',
    date: '09-noy, 2026',
    views: '8 450',
    readTime: '3 daqiqa',
    author: 'Farhod Aliyev',
    authorRole: 'Yo‘l-transport nizolari bo‘yicha advokat',
    summary:
      'Avtomatlashtirilgan kameralar yoki YPX xodimlari tomonidan xato yozilgan jarimalar ustidan 10 kun ichida shikoyat berish va bekor qildirish tartibi.',
    legalBasis: [
      'Ma’muriy javobgarlik to‘g‘risidagi kodeks 315, 317-moddalari',
      'Qaror nusxasi olingan kundan boshlab 10 kun ichida shikoyat berish huquqi',
      'Shikoyat ko‘rib chiqilguniga qadar jarimani to‘lash majburiyati to‘xtatiladi',
    ],
    steps: [
      {
        title: '1. Jarima fotosuratini diqqat bilan o‘rganing',
        desc: 'Avtomobil davlat raqami, chiziqlar, tezlik belgisi va vaqt aniq ko‘ringanligini tekshiring. Xato raqam tushgan bo‘lsa, bu to‘g‘ridan-to‘g‘ri bekor bo‘ladi.',
      },
      {
        title: '2. YHQ ga muvofiqligini solishtiring',
        desc: 'Zaruriy zarurat tufayli (tez yordamga yo‘l berish, to‘siqdan aylanib o‘tish) chiziq bosilgan bo‘lsa, bu qoidabuzarlik hisoblanmaydi.',
      },
      {
        title: '3. YHXX ga shikoyat arizasi yuboring',
        desc: 'Yagona interaktiv davlat xizmatlari portali (my.gov.uz) yoki Yo‘l harakati xavfsizligi boshqarmasiga rasmiy shikoyat xati yuboring.',
      },
      {
        title: '4. Sudga murojaat qilish',
        desc: 'Agar YHXX shikoyatni qanoatlantirmasa, tuman Ma’muriy sudiga ariza kiritiladi. Sudda asossiz jarimalar bekor qilinadi.',
      },
    ],
    keyTakeaway:
      'Jarima xabarnomasi kelgan kundan boshlab 10 kunlik muddatni o‘tkazib yubormang. O‘z vaqtida berilgan shikoyat jarima ijrosini to‘xtatadi.',
  },
  {
    id: 'art_6',
    title: 'Ishdan noqonuniy bo‘shatilganda ishga tiklanish va kompensatsiya undirish',
    category: 'mehnat',
    categoryLabel: 'Mehnat huquqi',
    badgeColor: '#2563EB',
    badgeBg: '#EFF6FF',
    date: '08-noy, 2026',
    views: '4 120',
    readTime: '4 daqiqa',
    author: 'Dilnoza Rahimova',
    authorRole: 'Mehnat huquqi eksperti',
    summary:
      'Buyruqsiz yoki soxta sabablar bilan ishdan chetlatilgan xodimlarning sud orqali ishga tiklanishi va majburiy bekor yurilgan kunlar uchun 100% oylik maosh undirish.',
    legalBasis: [
      'Mehnat kodeksi 172-175, 442-moddalari',
      'Ishga tiklash bo‘yicha sudga murojaat qilish muddati — buyruq nusxasi berilgan kundan 1 oy',
      'Sud xarajatlari xodimdan undirilmaydi',
    ],
    steps: [
      {
        title: '1. Mehnat daftarchasi va buyruq nusxasini talab qiling',
        desc: 'Ish beruvchi ishdan bo‘shatish buyrug‘i nusxasini xodimga darhol taqdim etishi shart.',
      },
      {
        title: '2. Mehnat inspeksiyasiga shikoyat',
        desc: 'Bandlik va mehnat munosabatlari vazirligi Davlat mehnat inspeksiyasiga tekshiruv o‘tkazish to‘g‘risida ariza bering.',
      },
      {
        title: '3. Fuqarolik sudiga da’vo arizasi kiritish',
        desc: '1 oylik muddat ichida tuman fuqarolik sudiga ishga tiklash va barcha yo‘qotilgan oylik maoshlarni undirish haqida da’vo taqdim etiladi.',
      },
    ],
    keyTakeaway:
      'Mehnat nizolarida sudlar odatda xodim tomonida bo‘ladi va ish beruvchining har bir protsessual xatosi xodim foydasiga ishlaydi.',
  },
  {
    id: 'art_7',
    title: 'Kvartira yoki avtomashina sotib olayotganda taqiq (zapret) borligini tekshirish',
    category: 'uy_joy',
    categoryLabel: 'Uy-joy & Mulk',
    badgeColor: '#D97706',
    badgeBg: '#FFFBEB',
    date: '07-noy, 2026',
    views: '5 730',
    readTime: '3 daqiqa',
    author: 'Zuhra Karimova',
    authorRole: 'Advokat',
    summary:
      'MIB aliment yoki qarzdorlik bo‘yicha qo‘ygan taqiqlar, garov va boshqa cheklovlarni oldindan tekshirib, pul yo‘qotish xavfidan saqlanish.',
    legalBasis: [
      '“Sud hujjatlari va boshqa organlar hujjatlarini ijro etish to‘g‘risida”gi Qonun',
      'MIB portali (mib.uz) ommaviy reyestri',
    ],
    steps: [
      {
        title: '1. Notarius orqali yagona elektron reyestrdan tekshirish',
        desc: 'Ko‘chmas mulk bo‘yicha barcha taqiqlar Notarius elektron tizimida darhol ko‘rinadi.',
      },
      {
        title: '2. MIB qarzdorlik bazasini tekshirish',
        desc: 'Sotuvchining shaxsiy JSHSHIR (PINFL) raqami orqali MIB aliment yoki bank qarzdorligi bor-yo‘qligini tekshiring.',
      },
    ],
    keyTakeaway:
      'Taqiqda turgan mulk uchun berilgan zakalat puli qaytarilmasligi yoki sud tortishuvlariga sabab bo‘lishi mumkin.',
  },
  {
    id: 'art_8',
    title: 'Aliment to‘lashdan bo‘yin tovlaganlik uchun javobgarlik va aliment miqdorini aniqlash',
    category: 'oila',
    categoryLabel: 'Oila huquqi',
    badgeColor: '#7C3AED',
    badgeBg: '#F5F3FF',
    date: '05-noy, 2026',
    views: '6 890',
    readTime: '4 daqiqa',
    author: 'Sanjarbek Qodirov',
    authorRole: 'Oila nizolari bo‘yicha huquqshunos',
    summary:
      'Farzandlar uchun aliment undirish tartibi, sud buyrug‘ini olish, aliment to‘lamaganlik uchun ma’muriy va jinoiy javobgarlik choralari.',
    legalBasis: [
      'Oila kodeksi 96-105-moddalari',
      'Bir bola uchun daromadning 1/4 qismi, ikki bola uchun 1/3 qismi, uch va undan ko‘p bola uchun 1/2 qismi',
      '2 oydan ortiq to‘lamaslik — ma’muriy qamoqqa sabab bo‘ladi',
    ],
    steps: [
      {
        title: '1. Sud buyrug‘i chiqarish uchun ariza',
        desc: 'Fuqarolik sudiga sud majlisisiz tezkor sud buyrug‘i chiqarish arizasi topshiriladi.',
      },
      {
        title: '2. MIB ijrochisiga topshirish',
        desc: 'Sud buyrug‘i MIBga yuboriladi va qarzdorning hisob raqamlari, ish haqi va mulklariga xatlov qo‘yiladi.',
      },
      {
        title: '3. Chet elga chiqishni taqiqlash',
        desc: 'Aliment to‘lamagan shaxsning O‘zbekistondan chiqishi avtomatik ravishda to‘xtatiladi.',
      },
    ],
    keyTakeaway:
      'Aliment bolaning konstitutsiyaviy huquqi bo‘lib, ota-onaning ishsizligi uni to‘lashdan ozod qilmaydi.',
  },
  {
    id: 'art_9',
    title: 'Kafolat muddati davomida ta’mirlash 20 kundan oshib ketsa, iste’molchining huquqlari',
    category: 'istemolchi',
    categoryLabel: 'Iste’molchi huquqlari',
    badgeColor: '#0284C7',
    badgeBg: '#F0F9FF',
    date: '03-noy, 2026',
    views: '3 620',
    readTime: '3 daqiqa',
    author: 'Akmal Zokirov',
    authorRole: 'Iste’molchi huquqlari bo‘yicha yurist',
    summary:
      'Servis markazi mahsulotni 20 kun ichida tuzata olmasa, iste’molchi yangi mahsulot yoki kechiktirilgan har bir kun uchun penya (jarima) talab qilishi mumkin.',
    legalBasis: [
      '“Iste’molchilarning huquqlarini himoya qilish to‘g‘risida”gi Qonun 15-moddasi',
      'Muddati o‘tgan har bir kun uchun tovar narxining 1 foizi miqdorida penya to‘lanadi',
    ],
    steps: [
      {
        title: '1. Servis qabul kvitansiyasidagi sanani belgilang',
        desc: 'Kvitansiyada tovar topshirilgan sana aniq ko‘rsatilgan bo‘lishi lozim.',
      },
      {
        title: '2. 21-kuni yangisini talab qilish',
        desc: 'Qonun bo‘yicha ta’mirlash 20 kundan oshmasligi shart. 21-kuni siz mahsulotni almashtirish yoki pulni qaytarishni so‘rashga haqlisiz.',
      },
    ],
    keyTakeaway:
      'Kafolatli ta’mirlash paytida do‘kon sizga vaqtinchalik foydalanish uchun xuddi shunday mahsulot berishi kerak.',
  },
  {
    id: 'art_10',
    title: 'Onlayn xaridlar (marketpleyslar)da tovar yetkazilmasa yoki nuqsonli bo‘lsa nima qilish kerak?',
    category: 'istemolchi',
    categoryLabel: 'Iste’molchi huquqlari',
    badgeColor: '#0284C7',
    badgeBg: '#F0F9FF',
    date: '01-noy, 2026',
    views: '5 980',
    readTime: '3 daqiqa',
    author: 'Sardor Karimov',
    authorRole: 'Raqamli huquq mutaxassisi',
    summary:
      'Internet-do‘konlar orqali xarid qilingan mahsulotlar sifati yoki kechikishi bo‘yicha e’tiroz bildirish va to‘lovni qaytarib olish qoidalari.',
    legalBasis: [
      'Vazirlar Mahkamasining Elektron tijorat qoidalarini tasdiqlash to‘g‘risidagi qarori',
      'Iste’molchi tovar yetkazilgan kundan boshlab 14 kun ichida asossiz qaytarishga haqli',
    ],
    steps: [
      {
        title: '1. Tovarni qabul qilish paytida video tasvirga oling',
        desc: 'Qadoqni ochish jarayonini video qilish nuqson uchun eng kuchli isbotdir.',
      },
      {
        title: '2. Ilovada rasmiy shikoyat ochish',
        desc: 'Marketpleys qo‘llab-quvvatlash xizmati orqali to‘lovni qaytarish (refund) tugmasini bosing.',
      },
    ],
    keyTakeaway:
      'Masofaviy xaridlarda siz mahsulotni hatto hech qanday nuqsonsiz ham 14 kun ichida qaytarish huquqiga egasiz.',
  },
];
