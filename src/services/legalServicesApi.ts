import { API_BASE_URL, WS_BASE_URL, getCandidateUrls } from '../config/api';
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
  {
    id: 'murojaat',
    title: 'Murojaat va arizalar',
    category: 'protection',
    categoryLabel: 'Arizalar va murojaatlar',
    desc: 'Davlat organlari, prokuratura, sud va tashkilotlarga rasmiy shikoyat, ariza va talabnomalar generatori.',
    iconName: 'file-text',
    badgeColor: '#0284C7',
    isActive: true,
    usersCount: 0,
  },
  {
    id: 'bank_kredit_himoyasi',
    title: 'Bank kreditlari himoyasi',
    category: 'finance',
    categoryLabel: 'Bank va kredit himoyasi',
    desc: 'Kredit shartnomalari tahlili, asossiz yechilgan pullar, yashirin foizlar, garov va firibgarlik kreditlaridan himoya.',
    iconName: 'landmark',
    badgeColor: '#10B981',
    isActive: true,
    usersCount: 0,
  },
];

async function apiFetch(endpoint: string, options: RequestInit): Promise<Response> {
  const urls = getCandidateUrls(endpoint);

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
   * Fetch Huquq Maktabi banners, topics and store from backend
   */
  async getHuquqMaktabi(): Promise<any> {
    try {
      const res = await apiFetch('/api/huquq-maktabi', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data && data.success && data.data) {
        return data.data;
      }
      return null;
    } catch {
      return null;
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

  /**
   * Real-time subscription to backend service updates (WebSocket + Fallback Polling)
   * Ensures mobile app updates instantly without manual page refreshes!
   */
  subscribeToRealtime(
    onServicesUpdate: (services: BackendServiceItem[]) => void
  ): () => void {
    let ws: WebSocket | null = null;
    let reconnectTimeout: any = null;
    let isCancelled = false;

    const connect = () => {
      if (isCancelled) return;
      try {
        const wsUrl = WS_BASE_URL || 'ws://localhost:5000';
        ws = new WebSocket(wsUrl);

        ws.onmessage = (e) => {
          try {
            const msg = JSON.parse(e.data);
            if (!msg || !msg.event) return;

            if (msg.event === 'initial:sync' && msg.data?.services) {
              onServicesUpdate(msg.data.services);
            } else if ((msg.event === 'service:updated' || msg.event === 'service:used') && msg.data?.services) {
              onServicesUpdate(msg.data.services);
            }
          } catch {}
        };

        ws.onclose = () => {
          if (!isCancelled) {
            reconnectTimeout = setTimeout(connect, 3000);
          }
        };

        ws.onerror = () => {
          ws?.close();
        };
      } catch {
        if (!isCancelled) {
          reconnectTimeout = setTimeout(connect, 3000);
        }
      }
    };

    connect();

    // Secondary resilient sync: poll every 3 seconds so data is always synchronized
    const pollInterval = setInterval(async () => {
      if (isCancelled) return;
      try {
        const list = await legalServicesApi.getServices();
        if (list && list.length > 0) {
          onServicesUpdate(list);
        }
      } catch {}
    }, 3000);

    return () => {
      isCancelled = true;
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      clearInterval(pollInterval);
      try {
        ws?.close();
      } catch {}
    };
  },

  /**
   * Real-time subscription to Huquq Maktabi data (Topics, Banners, Store)
   * Ensures instant synchronization when Admin updates topics or adds banners!
   */
  subscribeToHuquqMaktabi(
    onUpdate: (data: any) => void
  ): () => void {
    let ws: WebSocket | null = null;
    let reconnectTimeout: any = null;
    let isCancelled = false;

    const connect = () => {
      if (isCancelled) return;
      try {
        const wsUrl = WS_BASE_URL || 'ws://localhost:5000';
        ws = new WebSocket(wsUrl);

        ws.onmessage = (e) => {
          try {
            const msg = JSON.parse(e.data);
            if (!msg || !msg.event) return;

            if (msg.event === 'initial:sync' && msg.data?.huquqMaktabi) {
              onUpdate(msg.data.huquqMaktabi);
            } else if (msg.event === 'huquq-maktabi:updated') {
              if (msg.data?.data) {
                onUpdate(msg.data.data);
              } else {
                legalServicesApi.getHuquqMaktabi().then((res) => {
                  if (res && !isCancelled) onUpdate(res);
                });
              }
            }
          } catch {}
        };

        ws.onclose = () => {
          if (!isCancelled) {
            reconnectTimeout = setTimeout(connect, 2500);
          }
        };

        ws.onerror = () => {
          ws?.close();
        };
      } catch {
        if (!isCancelled) {
          reconnectTimeout = setTimeout(connect, 2500);
        }
      }
    };

    connect();

    // Initial fetch immediately
    legalServicesApi.getHuquqMaktabi().then((res) => {
      if (res && !isCancelled) onUpdate(res);
    });

    // Resilient fallback polling every 2.5s for instant updates
    const pollInterval = setInterval(async () => {
      if (isCancelled) return;
      try {
        const data = await legalServicesApi.getHuquqMaktabi();
        if (data && !isCancelled) {
          onUpdate(data);
        }
      } catch {}
    }, 2500);

    return () => {
      isCancelled = true;
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      clearInterval(pollInterval);
      try {
        ws?.close();
      } catch {}
    };
  },
};

