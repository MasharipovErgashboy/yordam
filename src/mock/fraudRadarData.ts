import { ScamAlert, HistoryItem, VerificationResult } from '../types/fraudRadar.types';

export const MOCK_RADAR_STATS = {
  blockedCards: '1,640 ta',
  crowdsourceComplaints: '12,400+',
  databaseUpdatedTime: 'Bugun, 11:30',
};

export const MOCK_SCAM_ALERTS: ScamAlert[] = [
  {
    id: 'alert-1',
    title: 'Telegramdagi soxta yordam pullari',
    description: 'Prezident nomidan tarqalayotgan botlarga kirmang',
    type: 'telegram',
    typeLabel: 'Telegram bot',
    riskLevel: 'suspicious',
    date: '15 daqiqa oldin',
    victimCount: 142,
  },
  {
    id: 'alert-2',
    title: 'Phishing: Soxta Payme/Click SMS',
    description: 'SMS-kodni so‘rayotgan soxta bank raqamlari aniqlandi',
    type: 'phishing',
    typeLabel: 'SMS Phishing',
    riskLevel: 'high_risk',
    date: '1 soat oldin',
    victimCount: 310,
  },
];

export const MOCK_RADAR_HISTORY: HistoryItem[] = [
  {
    id: 'hist-1',
    query: '8600 12** **** 4590',
    typeLabel: '• Xavfli rekvizit',
    isSafe: false,
    complaintCount: 12,
    date: 'Bugun, 14:20',
    detail: '12 ta shikoyat tushgan',
  },
  {
    id: 'hist-2',
    query: 'payme.uz (Rasmiy bank sahifasi)',
    typeLabel: '• Xavfsiz',
    isSafe: true,
    complaintCount: 0,
    date: 'Kecha, 18:10',
    detail: 'SSL va rasmiy domen tasdiqlangan',
  },
  {
    id: 'hist-3',
    query: 'Telegram bot: @yordam_bonus_bot',
    typeLabel: '• Shubhali',
    isSafe: false,
    complaintCount: 5,
    date: '20 Noyabr',
    detail: 'Soxta aksiya alomatlari bor',
  },
];

export const DANGEROUS_VERIFICATION_RESULT: VerificationResult = {
  query: '8600 12** **** 4590',
  targetType: 'card',
  isSafe: false,
  riskLevel: 'high_risk',
  riskScore: 88,
  title: 'DIQQAT!\nShubhali hisob raqam',
  subtitle: 'Ushbu rekvizit firibgarlik shikoyatlari bazasida qayd etilgan',
  complaintCount: 12,
  lastIncidentDate: 'Bugun, 11:25',
  lastIncidentDetail: 'OLX soxta to‘lov',
  details: [
    { label: 'Karta raqami:', value: '8600 12** **** 4590' },
    { label: 'Tushgan shikoyatlar:', value: '12 ta foydalanuvchi' },
    { label: 'Xavf darajasi:', value: 'Yuqori xavf (88%)' },
    { label: 'Oxirgi firibgarlik holati:', value: 'Bugun, 11:25 (OLX soxta to‘lov)' },
  ],
  recommendation: 'Tavsiya: Mazkur kartaga pul o‘tkazmang va havolasiga kirmang!',
};

export const SAFE_VERIFICATION_RESULT: VerificationResult = {
  query: 'payme.uz',
  targetType: 'url',
  isSafe: true,
  riskLevel: 'safe',
  riskScore: 0,
  title: 'XAVFSIZ REKVIZIT',
  subtitle: 'Ushbu ma’lumot qora ro‘yxatlardan topilmadi',
  complaintCount: 0,
  details: [
    { label: 'Havola/Karta:', value: 'payme.uz' },
    { label: 'Shikoyatlar:', value: '0 ta foydalanuvchi' },
    { label: 'Xavf darajasi:', value: 'Xavfsiz (0%)' },
    { label: 'SSL / Domen:', value: 'Tasdiqlangan rasmiy tashkilot' },
  ],
  recommendation: 'Tavsiya: Ushbu manzil xavfsiz. Ammo har doim SMS-kodni sir saqlang!',
};
