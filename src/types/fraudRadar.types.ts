export type CheckTargetType = 'card' | 'url' | 'phone' | 'screenshot';

export type RiskLevel = 'safe' | 'suspicious' | 'high_risk';

export interface ScamAlert {
  id: string;
  title: string;
  description: string;
  type: 'telegram' | 'phishing' | 'fake_call' | 'financial_pyramid';
  typeLabel: string;
  riskLevel: RiskLevel;
  date: string;
  victimCount?: number;
}

export interface VerificationResult {
  query: string;
  targetType: CheckTargetType;
  isSafe: boolean;
  riskLevel: RiskLevel;
  riskScore: number;
  title: string;
  subtitle: string;
  complaintCount: number;
  lastIncidentDate?: string;
  lastIncidentDetail?: string;
  details: {
    label: string;
    value: string;
  }[];
  recommendation: string;
}

export interface HistoryItem {
  id: string;
  query: string;
  typeLabel: string;
  isSafe: boolean;
  complaintCount: number;
  date: string;
  detail: string;
}
