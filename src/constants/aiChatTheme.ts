import type { AiIcon, ConversationCategoryId } from '../types/aiChat';

export const AI_COLORS = {
  primary: '#1F5FD6',
  primaryDark: '#1748A8',
  primarySoft: '#EAF1FD',
  navy: '#0F1E3D',
  text: '#0F172A',
  textSecondary: '#64748B',
  placeholder: '#94A3B8',
  icon: '#475569',
  bg: '#F4F7FC',
  surface: '#FFFFFF',
  surfaceMuted: '#F1F5F9',
  border: '#E5EAF2',
  online: '#22C55E',
  amber: '#F59E0B',
  amberSoft: '#FFF4DE',
  amberBorder: '#FDE3B0',
  amberText: '#1F2937',
};

export interface CategoryMeta {
  label: string;
  topicLabel: string;
  icon: AiIcon;
  color: string; // ikonka rangi
  textColor: string; // teg matni (kontrast uchun to‘qroq)
  bg: string;
}

export const CATEGORY_META: Record<ConversationCategoryId, CategoryMeta> = {
  mehnat: {
    label: 'Mehnat',
    topicLabel: 'Mehnat huquqi',
    icon: { family: 'ion', name: 'briefcase-outline' },
    color: '#1F5FD6',
    textColor: '#1F5FD6',
    bg: '#EAF1FD',
  },
  oila: {
    label: 'Oila',
    topicLabel: 'Oila huquqi',
    icon: { family: 'ion', name: 'heart-outline' },
    color: '#E5484D',
    textColor: '#C2282D',
    bg: '#FDECEC',
  },
  uy_joy: {
    label: 'Uy-joy',
    topicLabel: 'Uy-joy huquqi',
    icon: { family: 'ion', name: 'home-outline' },
    color: '#F59E0B',
    textColor: '#B45309',
    bg: '#FFF4DE',
  },
  biznes: {
    label: 'Biznes',
    topicLabel: 'Tadbirkorlik',
    icon: { family: 'ion', name: 'document-text-outline' },
    color: '#7C3AED',
    textColor: '#6D28D9',
    bg: '#F1EAFE',
  },
  moliya: {
    label: 'Moliya',
    topicLabel: 'Moliyaviy nizolar',
    icon: { family: 'mci', name: 'currency-usd' },
    color: '#16A34A',
    textColor: '#15803D',
    bg: '#E7F7EE',
  },
  umumiy: {
    label: 'Umumiy',
    topicLabel: 'Umumiy savol',
    icon: { family: 'ion', name: 'chatbubble-ellipses-outline' },
    color: '#475569',
    textColor: '#475569',
    bg: '#F1F5F9',
  },
};
