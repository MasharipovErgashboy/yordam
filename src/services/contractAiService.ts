import type {
  ContractFormData,
  ContractReview,
  ContractTemplateId,
  GeneratedContract,
} from '../types/contractAi';
import { MOCK_REVIEW, buildMockContract } from '../data/contractAiMock';

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Forma ma’lumotlari asosida shartnoma yaratish.
 * Hozircha namunaviy hujjat qaytaradi — backend tayyor bo‘lganda shu yerni API chaqiruviga almashtiring.
 */
export async function generateContract(
  templateId: ContractTemplateId,
  form: ContractFormData
): Promise<GeneratedContract> {
  await wait(1500);
  return buildMockContract(templateId, form);
}

/**
 * Yuklangan shartnomani tekshirish.
 * Hozircha fayl tanlanmaydi va namunaviy tahlil qaytadi — backend va fayl tanlash
 * (masalan, expo-document-picker) ulanganda shu yerni almashtiring.
 */
export async function analyzeContract(): Promise<ContractReview> {
  await wait(1800);
  return MOCK_REVIEW;
}
