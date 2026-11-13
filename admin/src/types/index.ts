export interface UserSession {
  username: string;
  name: string;
  role: string;
  avatar: string;
  isAuthenticated: boolean;
}

export interface MetricCardData {
  id: string;
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: 'calendar' | 'currency' | 'shield';
  color: string;
  bgColor: string;
}

export interface BarChartData {
  label: string;
  value: number; // percentage 0-100 or count
  active?: boolean;
}

export interface ApplicationItem {
  id: string;
  number: string;
  title: string;
  client: string;
  phone: string;
  category: 'ish_mehnat' | 'istemolchi' | 'shartnoma' | 'sud';
  categoryLabel: string;
  date: string;
  amount: string;
  status: 'faol' | 'kutilmoqda' | 'hal_qilindi' | 'rad_etildi';
  statusLabel: string;
}

