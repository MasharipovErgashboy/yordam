import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/api';

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  roleColor?: string;
  status: string;
  registered: string;
  registeredAt?: string;
  appsCount?: number;
  avatar?: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

const STORAGE_KEY_USER = '@yordam_user_data';
const STORAGE_KEY_TOKEN = '@yordam_user_token';

// Helper to attempt fetch with fallback to localhost/10.0.2.2 if LAN IP fails
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
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeoutId);
      return res;
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('Backend server bilan aloqa o‘rnatib bo‘lmadi.');
}

export const authService = {
  // 1. Request registration & send OTP
  async registerRequest(payload: RegisterPayload) {
    const res = await apiFetch('/api/auth/register-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Ro‘yxatdan o‘tish so‘rovida xatolik yuz berdi');
    }
    return data;
  },

  // 2. Verify OTP & complete registration
  async verifyOtp(email: string, otp: string) {
    const res = await apiFetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Tasdiqlash kodini tekshirishda xatolik yuz berdi');
    }
    if (data.user && data.token) {
      await this.saveSession(data.user, data.token);
    }
    return data;
  },

  // 3. Resend OTP
  async resendOtp(email: string) {
    const res = await apiFetch('/api/auth/resend-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Kodni qayta yuborishda xatolik');
    }
    return data;
  },

  // 4. User Login
  async login(email: string, password: string) {
    const res = await apiFetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Kirishda xatolik yuz berdi');
    }
    if (data.user && data.token) {
      await this.saveSession(data.user, data.token);
    }
    return data;
  },

  // 5. Save session
  async saveSession(user: UserProfile, token: string) {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      await AsyncStorage.setItem(STORAGE_KEY_TOKEN, token);
    } catch (e) {
      console.warn('Error saving user session to AsyncStorage', e);
    }
  },

  // 6. Get session
  async getSession(): Promise<{ user: UserProfile | null; token: string | null }> {
    try {
      const userStr = await AsyncStorage.getItem(STORAGE_KEY_USER);
      const token = await AsyncStorage.getItem(STORAGE_KEY_TOKEN);
      const user = userStr ? (JSON.parse(userStr) as UserProfile) : null;
      return { user, token };
    } catch (e) {
      console.warn('Error reading user session', e);
      return { user: null, token: null };
    }
  },

  // 7. Clear session (Logout)
  async clearSession() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY_USER);
      await AsyncStorage.removeItem(STORAGE_KEY_TOKEN);
    } catch (e) {
      console.warn('Error clearing user session', e);
    }
  },
};

