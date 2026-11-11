import type { ComponentProps } from 'react';
import type { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export type AiIcon =
  | { family: 'ion'; name: ComponentProps<typeof Ionicons>['name'] }
  | { family: 'mci'; name: ComponentProps<typeof MaterialCommunityIcons>['name'] };

/** Suhbat mavzusi (tarixdagi teg va ikonka rangi shundan olinadi) */
export type ConversationCategoryId = 'mehnat' | 'oila' | 'uy_joy' | 'biznes' | 'moliya' | 'umumiy';

/** Kutib olish ekranidagi filtr chiplari */
export type AiFilterId = 'all' | Exclude<ConversationCategoryId, 'umumiy'>;

export interface AiQuickQuestion {
  id: string;
  text: string;
  categoryId: Exclude<ConversationCategoryId, 'umumiy'>;
}

export interface AiSource {
  kind: 'law' | 'link';
  label: string;
  url?: string;
}

/** AI javobi — backend shu shaklda qaytarishi kutiladi */
export interface AiReply {
  text: string; // **qalin** belgilash qo‘llab-quvvatlanadi
  stepsTitle?: string;
  steps?: string[];
  sources?: AiSource[];
  action?: { title: string; subtitle: string };
  suggestions?: string[];
  topic?: { categoryId: ConversationCategoryId; title: string };
}

export type ChatMessage =
  | { id: string; role: 'user'; text: string; time: string }
  | { id: string; role: 'ai'; time: string; reply: AiReply; liked?: boolean; isError?: boolean };

export type HistoryGroup = 'Bugun' | 'O‘tgan hafta';

export interface Conversation {
  id: string;
  title: string;
  preview: string;
  categoryId: ConversationCategoryId;
  topicTitle: string;
  group: HistoryGroup;
  timeLabel: string;
  dateLabel: string;
  messages: ChatMessage[];
}
