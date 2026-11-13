import { API_BASE_URL } from '../config/api';
import type { UserProfile } from './authService';

export interface BackendServiceItem {
  id: string;
  title: string;
  category: string;
  categoryLabel: string;
  desc: string;
  iconName: string;
  badgeColor: string;
  isActive: boolean;
  usersCount: number;
  lastUpdated?: string;
  features?: string[];
}

const FALLBACK_SERVICES: BackendServiceItem[] = [
  {
    id: 'huquq_maktabi',
    title: 'Huquq Maktabi',
    category: 'protection',
    categoryLabel: 'Ta’lim',
    desc: 'Fuqarolar uchun hayotiy huquqiy vaziyatlar, qo‘llanmalar, testlar va audio-darsliklar.',
    iconName: 'school',
    badgeColor: '#8B5CF6',
    isActive: true,
    usersCount: 0,
  },
  {
    id: 'istemolchi',
    title: 'Iste’molchi huquqlari',
    category: 'protection',
    categoryLabel: 'Iste’molchi himoyasi',
    desc: 'Sifatsiz tovar va xizmatlar, 14 kun ichida almashtirish/qaytarish, kafolat ta’mirlari va 1159 Raqobat qo‘mitasi rasmiy talabnomalari.',
    iconName: 'cart',
    badgeColor: '#00A3FF',
    isActive: true,
    usersCount: 0,
  },
  {
    id: 'ish_huquqi',
    title: 'Ish va mehnat huquqi',
    category: 'protection',
    categoryLabel: 'Mehnat munosabatlari',
    desc: 'Yangi Mehnat kodeksi me’yorlari, noqonuniy bo‘shatish, kechiktirilgan oylik maosh, kompensatsiya va Mehnat inspeksiyasi arizalari.',
    iconName: 'briefcase',
    badgeColor: '#F59E0B',
    isActive: true,
    usersCount: 0,
  },
];

async function apiFetch(endpoint: string, options: RequestInit): Promise<Response> {
  const urls = [
    `${API_BASE_URL}${endpoint}`,
    `http://localhost:5000${endpoint}`,
    `http://10.0.2.2:5000${endpoint}`,
  ];

  let lastError: any = null;

  for (const url of urls) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeoutId);
      return res;
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('Network request failed');
}

export const legalServicesApi = {
  /**
   * Fetch services list from backend
   */
  async getServices(): Promise<BackendServiceItem[]> {
    try {
      const res = await apiFetch('/api/services', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data && data.success && Array.isArray(data.services)) {
        return data.services;
      }
      return FALLBACK_SERVICES;
    } catch {
      return FALLBACK_SERVICES;
    }
  },

  /**
   * Record when a user taps "Xizmatdan foydalanish" in mobile app
   */
  async recordUsage(serviceId: string, user: UserProfile | null): Promise<void> {
    const userKey = user?.id || user?.email;
    if (!userKey) {
      return;
    }

    try {
      await apiFetch(`/api/services/${serviceId}/use`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          email: user?.email,
        }),
      });
    } catch (err) {
      console.warn('Error recording service usage:', err);
    }
  },
};
