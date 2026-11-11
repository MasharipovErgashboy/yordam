import type { AiReply } from '../types/aiChat';
import { getMockReply } from '../data/aiChatMock';

export interface SendAiMessageRequest {
  conversationId: string;
  text: string;
}

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * AI yordamchiga xabar yuborish.
 * Hozircha frontend uchun namunaviy javob qaytaradi.
 * Backend tayyor bo‘lganda faqat shu funksiya ichini API chaqiruviga almashtiring —
 * ekranlar `AiReply` shaklidagi javobni kutadi.
 */
export async function sendAiMessage(request: SendAiMessageRequest): Promise<AiReply> {
  await wait(1200);
  return getMockReply(request.text);
}
