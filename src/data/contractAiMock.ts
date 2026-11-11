import type {
  ContractFormData,
  ContractReview,
  ContractTemplate,
  ContractTemplateId,
  GeneratedContract,
  SavedContract,
} from '../types/contractAi';

export const CONTRACT_TEMPLATES: ContractTemplate[] = [
  {
    id: 'ijara',
    label: 'Ijara',
    formTitle: 'Ijara shartnomasi',
    documentTitle: 'Turar joyni ijaraga berish shartnomasi',
    description: 'Kvartira, uy yoki xonani ijaraga berish',
    icon: { family: 'ion', name: 'home-outline' },
    partyALabel: 'Ijaraga beruvchi (F.I.Sh.)',
    partyBLabel: 'Ijarachi (F.I.Sh.)',
    subjectLabel: 'Uy manzili',
    subjectPlaceholder: 'Shahar, tuman, ko‘cha, uy',
    amountLabel: 'Oylik to‘lov',
  },
  {
    id: 'mehnat',
    label: 'Mehnat',
    formTitle: 'Mehnat shartnomasi',
    documentTitle: 'Mehnat shartnomasi',
    description: 'Ish beruvchi va xodim o‘rtasida',
    icon: { family: 'ion', name: 'briefcase-outline' },
    partyALabel: 'Ish beruvchi (tashkilot yoki F.I.Sh.)',
    partyBLabel: 'Xodim (F.I.Sh.)',
    subjectLabel: 'Lavozim va ish joyi',
    subjectPlaceholder: 'Masalan: buxgalter, Toshkent sh.',
    amountLabel: 'Oylik ish haqi',
  },
  {
    id: 'oldi_sotdi',
    label: 'Oldi-sotdi',
    formTitle: 'Oldi-sotdi shartnomasi',
    documentTitle: 'Oldi-sotdi shartnomasi',
    description: 'Mol-mulk yoki tovar sotish',
    icon: { family: 'ion', name: 'cart-outline' },
    partyALabel: 'Sotuvchi (F.I.Sh.)',
    partyBLabel: 'Xaridor (F.I.Sh.)',
    subjectLabel: 'Sotiladigan mol-mulk',
    subjectPlaceholder: 'Masalan: Chevrolet Cobalt, 2021-yil',
    amountLabel: 'Narxi',
  },
  {
    id: 'xizmat',
    label: 'Xizmat',
    formTitle: 'Xizmat ko‘rsatish shartnomasi',
    documentTitle: 'Xizmat ko‘rsatish shartnomasi',
    description: 'Haq evaziga xizmat ko‘rsatish',
    icon: { family: 'ion', name: 'hammer-outline' },
    partyALabel: 'Ijrochi (F.I.Sh. yoki tashkilot)',
    partyBLabel: 'Buyurtmachi (F.I.Sh.)',
    subjectLabel: 'Xizmat turi',
    subjectPlaceholder: 'Masalan: veb-sayt ishlab chiqish',
    amountLabel: 'Xizmat narxi',
  },
  {
    id: 'qarz',
    label: 'Qarz',
    formTitle: 'Qarz shartnomasi',
    documentTitle: 'Qarz shartnomasi',
    description: 'Pul yoki narsani qarzga berish',
    icon: { family: 'ion', name: 'cash-outline' },
    partyALabel: 'Qarz beruvchi (F.I.Sh.)',
    partyBLabel: 'Qarz oluvchi (F.I.Sh.)',
    subjectLabel: 'Qaytarish tartibi',
    subjectPlaceholder: 'Masalan: har oy teng qismlarda',
    amountLabel: 'Qarz summasi',
  },
  {
    id: 'pudrat',
    label: 'Pudrat',
    formTitle: 'Pudrat shartnomasi',
    documentTitle: 'Pudrat shartnomasi',
    description: 'Qurilish va ta’mirlash ishlari',
    icon: { family: 'ion', name: 'business-outline' },
    partyALabel: 'Pudratchi (F.I.Sh. yoki tashkilot)',
    partyBLabel: 'Buyurtmachi (F.I.Sh.)',
    subjectLabel: 'Ish obyekti va turi',
    subjectPlaceholder: 'Masalan: kvartirani ta’mirlash',
    amountLabel: 'Ish narxi',
  },
  {
    id: 'garov',
    label: 'Garov',
    formTitle: 'Garov shartnomasi',
    documentTitle: 'Garov shartnomasi',
    description: 'Qarz yoki majburiyatni mol-mulk bilan ta’minlash',
    icon: { family: 'ion', name: 'lock-closed-outline' },
    partyALabel: 'Garovga qo‘yuvchi (F.I.Sh.)',
    partyBLabel: 'Garovga oluvchi (F.I.Sh.)',
    subjectLabel: 'Garov predmeti',
    subjectPlaceholder: 'Masalan: avtomobil, davlat raqami',
    amountLabel: 'Garov qiymati',
  },
  {
    id: 'nikoh',
    label: 'Nikoh',
    formTitle: 'Nikoh shartnomasi',
    documentTitle: 'Nikoh shartnomasi',
    description: 'Er-xotinning mulkiy huquq va majburiyatlari',
    icon: { family: 'ion', name: 'heart-outline' },
    partyALabel: 'Er (F.I.Sh.)',
    partyBLabel: 'Xotin (F.I.Sh.)',
    subjectLabel: 'Mulkiy rejim',
    subjectPlaceholder: 'Masalan: har kimning mol-mulki alohida',
    amountLabel: 'Umumiy mol-mulk qiymati',
  },
];

/** Shartnoma AI bosh ekranida ko‘rsatiladigan shablonlar soni (qolganlari "Barchasini ko‘rish"da) */
export const HOME_TEMPLATE_COUNT = 6;

export const getTemplate = (id: ContractTemplateId) =>
  CONTRACT_TEMPLATES.find((t) => t.id === id) ?? CONTRACT_TEMPLATES[0];

export const EMPTY_FORM: ContractFormData = {
  partyA: '',
  partyB: '',
  subject: '',
  amount: '',
  startDate: '',
  term: '1 yil',
  customTerm: '',
  extraTerms: '',
};

const or = (value: string, placeholder: string) => (value.trim() ? value.trim() : placeholder);

/** Backend ulanmaguncha forma ma’lumotlaridan namunaviy hujjat yasaydi */
export function buildMockContract(templateId: ContractTemplateId, form: ContractFormData): GeneratedContract {
  const t = getTemplate(templateId);
  const partyA = or(form.partyA, '[F.I.Sh.]');
  const partyB = or(form.partyB, '[F.I.Sh.]');
  const roleA = t.partyALabel.split(' (')[0];
  const roleB = t.partyBLabel.split(' (')[0];
  const subject = or(form.subject, '[MANZIL]');
  const amount = form.amount.trim() ? `${form.amount.trim()} so‘m` : '[SUMMA] so‘m';
  const term = form.term === 'Boshqa' ? or(form.customTerm, '[MUDDAT]') : form.term;
  const start = or(form.startDate, '[SANA]');

  const isMonthly = templateId === 'ijara' || templateId === 'mehnat';
  const subjectText =
    templateId === 'ijara'
      ? `${roleA} ${subject} manzilidagi turar joyni ${roleB}ga ${term} muddatga foydalanishga beradi.`
      : `${roleA} va ${roleB} o‘rtasidagi shartnoma predmeti: ${or(form.subject, '[PREDMET]')}.`;

  const clauses = [
    {
      id: 'c1',
      heading: 'Predmet.',
      text: subjectText,
    },
    {
      id: 'c2',
      heading: `${t.amountLabel}.`,
      text: isMonthly
        ? `${t.amountLabel} ${amount} bo‘lib, har oyning [KUN]-sanasiga qadar to‘lanadi.`
        : `${t.amountLabel} ${amount} bo‘lib, [MUDDAT] ichida to‘lanadi.`,
    },
    {
      id: 'c3',
      heading: '',
      text: 'To‘lov miqdori faqat 30 kun oldin yozma ogohlantirish bilan va tomonlar kelishuviga ko‘ra o‘zgartirilishi mumkin.',
      aiProtected: true,
      note: 'Bu band to‘lov miqdorini bir tomonlama oshirishdan himoya qiladi.',
    },
    {
      id: 'c4',
      heading: 'Muddat.',
      text: `Shartnoma ${start} sanadan boshlab ${term} muddatga tuziladi.`,
    },
    {
      id: 'c5',
      heading: 'Tomonlarning majburiyatlari.',
      text: `${roleA} va ${roleB} ushbu shartnomada belgilangan majburiyatlarni o‘z vaqtida va to‘liq bajaradi.`,
    },
    {
      id: 'c6',
      heading: 'Shartnomani bekor qilish.',
      text: 'Har bir tomon shartnomani kamida 30 kun oldin yozma ogohlantirib bekor qilishi mumkin.',
      aiProtected: true,
      note: 'Bekor qilish huquqi ikkala tomonga teng berilgan.',
    },
    {
      id: 'c7',
      heading: 'Nizolarni hal qilish.',
      text: 'Nizolar muzokaralar yo‘li bilan, kelishuvga erishilmasa [SHAHAR] sudida hal qilinadi.',
    },
    {
      id: 'c8',
      heading: 'Yakuniy qoidalar.',
      text: form.extraTerms.trim()
        ? `Qo‘shimcha shartlar: ${form.extraTerms.trim()}`
        : 'Shartnoma ikki nusxada tuziladi va har bir nusxa teng yuridik kuchga ega.',
    },
  ];

  return {
    id: `contract-${Date.now()}`,
    templateId,
    title: t.documentTitle.toUpperCase(),
    cityDate: `Toshkent sh. · ${start}`,
    intro: `Bir tomondan **${partyA}** ("${roleA}"), ikkinchi tomondan **${partyB}** ("${roleB}") quyidagilar haqida shartnoma tuzdilar:`,
    clauses,
    complianceNote: 'Fuqarolik kodeksiga mos',
  };
}

export const MOCK_REVIEW: ContractReview = {
  id: 'review-1',
  fileName: 'Xizmat ko‘rsatish shartnomasi.pdf',
  fileType: 'PDF',
  pages: 2,
  clausesChecked: 12,
  score: 58,
  levelLabel: 'O‘rtacha xavf',
  summary: 'Imzolashdan oldin 3 ta bandni o‘zgartirish tavsiya etiladi',
  counts: { high: 2, medium: 1, good: 9 },
  issues: [
    {
      id: 'i1',
      clauseRef: '5.2-band',
      title: 'Jarima miqdori',
      level: 'high',
      quote: '“Kechikkan har bir kun uchun shartnoma summasining 5% miqdorida jarima to‘lanadi”',
      explanation: 'Jarima juda yuqori va cheklanmagan. Umumiy jarimaga yuqori chegara qo‘yishni talab qiling.',
      suggestedFix:
        'Kechikkan har bir kun uchun kechiktirilgan summaning [FOIZ] miqdorida, lekin jami [CHEGARA] dan oshmagan penya to‘lanadi.',
    },
    {
      id: 'i2',
      clauseRef: '7-band',
      title: 'Bir tomonlama bekor qilish',
      level: 'high',
      quote: '“Buyurtmachi shartnomani istalgan vaqtda ogohlantirishsiz bekor qilishi mumkin”',
      explanation: 'Bekor qilish huquqi faqat bir tomonga berilgan. Ikki tomon uchun teng ogohlantirish muddatini talab qiling.',
      suggestedFix: 'Har bir tomon shartnomani [MUDDAT] kun oldin yozma ogohlantirib bekor qilishi mumkin.',
    },
    {
      id: 'i3',
      clauseRef: '9-band',
      title: 'Nizolar tartibi noaniq',
      level: 'medium',
      quote: '“Nizolar tomonlar kelishuviga ko‘ra hal qilinadi”',
      explanation: 'Kelishuvga erishilmasa nizoni qaysi sud ko‘rishi ko‘rsatilmagan.',
      suggestedFix: 'Kelishuvga erishilmagan nizolar [SHAHAR] sudida ko‘rib chiqiladi.',
    },
  ],
  conclusion:
    'Shartnoma umumiy tuzilishi to‘g‘ri, lekin jarima, bekor qilish va nizolar bo‘yicha bandlar sizga noqulay. Ularni o‘zgartirmasdan imzolash tavsiya etilmaydi.',
};

export const SEED_SAVED_CONTRACTS: SavedContract[] = [
  {
    id: 'saved-1',
    title: 'Turar joy ijarasi shartnomasi',
    fileType: 'DOC',
    meta: 'Bugun · AI tuzgan',
    status: { kind: 'ready' },
    contract: buildMockContract('ijara', {
      ...EMPTY_FORM,
      partyA: 'Karimov Akmal Rustamovich',
      partyB: 'Hamidjonov Fazliddin',
    }),
  },
  {
    id: 'saved-2',
    title: 'Xizmat ko‘rsatish shartnomasi',
    fileType: 'PDF',
    meta: 'Kecha · Tekshirildi',
    status: { kind: 'risks', count: 3 },
    review: MOCK_REVIEW,
  },
];
