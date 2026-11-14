import type { AiIcon } from './aiChat';

export type ContractTemplateId =
  | 'ijara'
  | 'mehnat'
  | 'oldi_sotdi'
  | 'xizmat'
  | 'qarz'
  | 'pudrat'
  | 'garov'
  | 'nikoh';

export interface ContractTemplate {
  id: ContractTemplateId;
  label: string; // grid'dagi qisqa nom
  formTitle: string; // forma sarlavhasi
  documentTitle: string; // hujjat sarlavhasi (katta harflarda chiqadi)
  description: string;
  icon: AiIcon;
  partyALabel: string;
  partyBLabel: string;
  subjectLabel: string;
  subjectPlaceholder: string;
  amountLabel: string;
}

export type ContractTerm = '6 oy' | '1 yil' | 'Boshqa';

export interface ContractFormData {
  partyA: string;
  partyB: string;
  subject: string;
  amount: string; // "3 500 000" ko‘rinishida
  startDate: string; // KK.OO.YYYY
  term: ContractTerm;
  customTerm: string;
  extraTerms: string;
}

export interface ContractClause {
  id: string;
  heading: string;
  text: string;
  /** AI qo‘shgan, foydalanuvchi manfaatini himoya qiluvchi band — sariq rangda ajratiladi */
  aiProtected?: boolean;
  note?: string; // AI izohi
}

export interface GeneratedContract {
  id: string;
  templateId: ContractTemplateId;
  title: string;
  cityDate: string;
  intro: string;
  clauses: ContractClause[];
  complianceNote: string;
}

export type RiskLevel = 'high' | 'medium';

export interface ContractIssue {
  id: string;
  clauseRef: string; // "5.2-band"
  title: string;
  level: RiskLevel;
  quote: string;
  explanation: string;
  suggestedFix: string;
}

export interface ContractReview {
  id: string;
  fileName: string;
  fileType: 'PDF' | 'DOC';
  pages: number;
  clausesChecked: number;
  score: number; // 0–100, ko‘p = xavfli
  levelLabel: string;
  summary: string;
  counts: { high: number; medium: number; good: number };
  issues: ContractIssue[];
  conclusion: string;
}

export interface SavedContract {
  id: string;
  title: string;
  fileType: 'PDF' | 'DOC';
  meta: string; // "Bugun · AI tuzgan"
  status: { kind: 'ready' } | { kind: 'risks'; count: number };
  /** Ochilganda ko‘rsatiladigan ma’lumot */
  contract?: GeneratedContract;
  review?: ContractReview;
}
