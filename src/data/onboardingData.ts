import React from 'react';
import { PlatformVisual } from '../components/VisualCards/PlatformVisual';
import { AiAssistantVisual } from '../components/VisualCards/AiAssistantVisual';
import { DocumentsVisual } from '../components/VisualCards/DocumentsVisual';
import { ProtectionVisual } from '../components/VisualCards/ProtectionVisual';

export interface OnboardingSlideData {
  id: string;
  tag: string;
  title: string;
  description: string;
  VisualComponent: React.ComponentType;
}

export const ONBOARDING_SLIDES: OnboardingSlideData[] = [
  {
    id: 'platform',
    tag: 'YAGONA RAQAMLI EKOTIZIM',
    title: 'Barcha huquqiy\nxizmatlar bir joyda',
    description:
      'Huquqiy muammolaringiz uchun kerakli xizmatlarni bitta ilovada toping. Alohida ilovalarni izlashga hojat yo‘q.',
    VisualComponent: PlatformVisual,
  },
  {
    id: 'ai_assistant',
    tag: 'YORDAMCHI AI',
    title: 'Aqlli yordamchi\nYordamchi AI',
    description:
      'Muammoingizni oddiy tilda yozing yoki ovoz orqali tushuntiring. Yordamchi AI sizga tegishli huquqiy ma’lumot va keyingi qadamlarni topishga yordam beradi.',
    VisualComponent: AiAssistantVisual,
  },
  {
    id: 'documents',
    tag: 'HUJJATLAR',
    title: 'Hujjatlaringiz\ndoimo nazoratingizda',
    description:
      'Shartnomalarni tahlil qiling, ariza va shikoyatlar tayyorlang hamda muhim hujjatlaringizni bitta joyda saqlang.',
    VisualComponent: DocumentsVisual,
  },
  {
    id: 'protection',
    tag: 'HIMOYA',
    title: 'Huquqlaringizni\nhimoya qiling',
    description:
      'Firibgarlikdan ehtiyot bo‘ling, huquqiy bilimlaringizni oshiring va kerak bo‘lganda malakali yuristdan yordam oling.',
    VisualComponent: ProtectionVisual,
  },
];
