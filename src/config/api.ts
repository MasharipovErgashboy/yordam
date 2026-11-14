import { Platform, NativeModules } from 'react-native';

// Dynamically extracts the Metro development server host IP from React Native's bundle URL
export const getHostIp = (): string => {
  try {
    const scriptURL: string | undefined = NativeModules?.SourceCode?.scriptURL;
    if (scriptURL) {
      const match = scriptURL.match(/^https?:\/\/([^:/]+)/);
      if (match && match[1] && match[1] !== 'localhost' && match[1] !== '127.0.0.1') {
        return match[1];
      }
    }
  } catch {
    // fallback
  }
  // Current active LAN IP
  return '10.137.191.215';
};

export const getApiBaseUrl = (): string => {
  if (Platform.OS === 'web') {
    return 'http://localhost:5000';
  }
  const host = getHostIp();
  return `http://${host}:5000`;
};

export const API_BASE_URL = getApiBaseUrl();

export const getWsBaseUrl = (): string => {
  if (Platform.OS === 'web') {
    return 'ws://localhost:5000';
  }
  const host = getHostIp();
  return `ws://${host}:5000`;
};

export const WS_BASE_URL = getWsBaseUrl();

// Candidate URLs generator for fallback resilience
export const getCandidateUrls = (endpoint: string): string[] => {
  const dynamicHost = getHostIp();
  const candidates: string[] = [];

  if (dynamicHost) {
    candidates.push(`http://${dynamicHost}:5000${endpoint}`);
  }
  candidates.push(`http://10.137.191.215:5000${endpoint}`);
  candidates.push(`${API_BASE_URL}${endpoint}`);
  candidates.push(`http://localhost:5000${endpoint}`);
  candidates.push(`http://10.0.2.2:5000${endpoint}`);

  // Deduplicate while preserving priority order
  return Array.from(new Set(candidates));
};


