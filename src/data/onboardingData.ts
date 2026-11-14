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
    title: 'Barça huquqiy\nxizmatlar bir joyda',
    description:
      'Huquqiy muammolaringiz uçun kerakli xizmatlarni bitta ilovada toping. Alohida ilovalarni izlaşga hojat yöq.',
    VisualComponent: PlatformVisual,
  },
  {
    id: 'ai_assistant',
    tag: 'YORDAMÇI AI',
    title: 'Aqlli yordamçi\nYordamçi AI',
    description:
      'Muammoingizni oddiy tilda yozing yoki ovoz orqali tuşuntiring. Yordamçi AI sizga tegişli huquqiy ma’lumot va keyingi qadamlarni topişga yordam beradi.',
    VisualComponent: AiAssistantVisual,
  },
  {
    id: 'documents',
    tag: 'HUJJATLAR',
    title: 'Hujjatlaringiz\ndoimo nazoratingizda',
    description:
      'Şartnomalarni tahlil qiling, ariza va şikoyatlar tayyorlang hamda muhim hujjatlaringizni bitta joyda saqlang.',
    VisualComponent: DocumentsVisual,
  },
  {
    id: 'protection',
    tag: 'HIMOYA',
    title: 'Huquqlaringizni\nhimoya qiling',
    description:
      'Firibgarlikdan ehtiyot böling, huquqiy bilimlaringizni oşiring va kerak bölganda malakali yuristdan yordam oling.',
    VisualComponent: ProtectionVisual,
  },
];
