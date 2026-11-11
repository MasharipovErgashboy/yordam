import type {
  AiFilterId,
  AiQuickQuestion,
  AiReply,
  Conversation,
} from '../types/aiChat';

export const FILTER_CHIPS: { id: AiFilterId; label: string }[] = [
  { id: 'all', label: 'Barchasi' },
  { id: 'mehnat', label: 'Mehnat' },
  { id: 'oila', label: 'Oila' },
  { id: 'uy_joy', label: 'Uy-joy' },
  { id: 'biznes', label: 'Biznes' },
  { id: 'moliya', label: 'Moliya' },
];

export const QUICK_QUESTIONS: AiQuickQuestion[] = [
  { id: 'q1', categoryId: 'mehnat', text: 'Ishdan bo‘shatishda qanday huquqlarim bor?' },
  { id: 'q2', categoryId: 'uy_joy', text: 'Ijarachini qanday chiqarish mumkin?' },
  { id: 'q3', categoryId: 'moliya', text: 'Qarzni qaytarmasa nima qilaman?' },
  { id: 'q4', categoryId: 'biznes', text: 'MCHJ ochish uchun qanday hujjatlar kerak?' },
  { id: 'q5', categoryId: 'mehnat', text: 'Ish haqi kechiktirilsa nima qilaman?' },
  { id: 'q6', categoryId: 'mehnat', text: 'Mehnat ta’tili necha kun bo‘ladi?' },
  { id: 'q7', categoryId: 'oila', text: 'Aliment miqdori qanday belgilanadi?' },
  { id: 'q8', categoryId: 'oila', text: 'Nikohni qanday bekor qilish mumkin?' },
  { id: 'q9', categoryId: 'uy_joy', text: 'Ijara shartnomasini qanday bekor qilaman?' },
  { id: 'q10', categoryId: 'biznes', text: 'YaTT sifatida qanday ro‘yxatdan o‘taman?' },
  { id: 'q11', categoryId: 'moliya', text: 'Kartadan asossiz pul yechilsa nima qilaman?' },
];

/** "Barchasi" tanlanganda ko‘rsatiladigan savollar (dizayndagi tartibda) */
export const FEATURED_QUESTION_IDS = ['q1', 'q2', 'q3', 'q4'];

export const DISMISSAL_REPLY: AiReply = {
  text:
    'Yo‘q, bu tartib buzilishi hisoblanadi. Ish beruvchi xodimni faqat qonundagi asos bilan, ' +
    '**yozma buyruq** chiqarib va oldindan **ogohlantirib** bo‘shatishi mumkin.',
  stepsTitle: 'Nima qilishingiz kerak:',
  steps: [
    'Buyruq nusxasini yozma so‘rang',
    'Elektron mehnat daftarchasini tekshiring',
    'Ishga tiklash uchun sudga ariza bering',
  ],
  sources: [
    { kind: 'law', label: 'Mehnat kodeksi, [modda]' },
    { kind: 'link', label: 'lex.uz', url: 'https://lex.uz' },
  ],
  action: { title: 'Sudga ariza tayyorlash', subtitle: 'AI ma’lumotlaringiz asosida to‘ldiradi' },
  suggestions: ['Murojaat muddati qancha?', 'Kompensatsiya'],
  topic: { categoryId: 'mehnat', title: 'Ishdan bo‘shatish' },
};

/** Backend ulanmaguncha boshqa savollarga qaytadigan javob */
export const PLACEHOLDER_REPLY: AiReply = {
  text:
    'Bu namunaviy javob: AI xizmati hali ulanmagan. Backend ulangandan so‘ng savolingizga ' +
    'qonunchilikka asoslangan javob shu yerda chiqadi.',
};

const normalize = (s: string) => s.toLowerCase().replace(/[‘’ʻʼ`']/g, "'");

export function getMockReply(question: string): AiReply {
  const q = normalize(question);
  if (q.includes("bo'shat")) return DISMISSAL_REPLY;
  return PLACEHOLDER_REPLY;
}

export const SEED_CONVERSATIONS: Conversation[] = [
  {
    id: 'seed-1',
    title: 'Ishdan noqonuniy bo‘shatish',
    preview: 'Buyruq nusxasini yozma so‘rang, elektron mehnat daftarchasini tekshiring',
    categoryId: 'mehnat',
    topicTitle: 'Ishdan bo‘shatish',
    group: 'Bugun',
    timeLabel: '14:32',
    dateLabel: 'Bugun, 14:32',
    messages: [
      {
        id: 'seed-1-u1',
        role: 'user',
        time: '14:32',
        text: 'Meni ogohlantirishsiz ishdan bo‘shatishdi, buyruq ham berishmadi. Bu qonuniymi?',
      },
      { id: 'seed-1-a1', role: 'ai', time: '14:32', reply: DISMISSAL_REPLY },
    ],
  },
  {
    id: 'seed-2',
    title: 'Ijara shartnomasini bekor qilish',
    preview: '30 kun oldin yozma ogohlantirish...',
    categoryId: 'uy_joy',
    topicTitle: 'Ijara',
    group: 'Bugun',
    timeLabel: '10:05',
    dateLabel: 'Bugun, 10:05',
    messages: [
      {
        id: 'seed-2-u1',
        role: 'user',
        time: '10:05',
        text: 'Ijara shartnomasini muddatidan oldin qanday bekor qilsam bo‘ladi?',
      },
      { id: 'seed-2-a1', role: 'ai', time: '10:05', reply: PLACEHOLDER_REPLY },
    ],
  },
  {
    id: 'seed-3',
    title: 'MCHJ ro‘yxatdan o‘tkazish',
    preview: 'Ta’sis hujjatlari ro‘yxati...',
    categoryId: 'biznes',
    topicTitle: 'MCHJ ochish',
    group: 'O‘tgan hafta',
    timeLabel: 'Sesh',
    dateLabel: 'Seshanba',
    messages: [
      { id: 'seed-3-u1', role: 'user', time: '11:20', text: 'MCHJ ochish uchun qanday hujjatlar kerak?' },
      { id: 'seed-3-a1', role: 'ai', time: '11:20', reply: PLACEHOLDER_REPLY },
    ],
  },
  {
    id: 'seed-4',
    title: 'Aliment miqdori',
    preview: 'Daromaddan ulush qanday belgilanadi...',
    categoryId: 'oila',
    topicTitle: 'Aliment',
    group: 'O‘tgan hafta',
    timeLabel: 'Dush',
    dateLabel: 'Dushanba',
    messages: [
      { id: 'seed-4-u1', role: 'user', time: '09:40', text: 'Aliment miqdori qanday belgilanadi?' },
      { id: 'seed-4-a1', role: 'ai', time: '09:40', reply: PLACEHOLDER_REPLY },
    ],
  },
];
