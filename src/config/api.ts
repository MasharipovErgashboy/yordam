import { Platform } from 'react-native';

// Default API base URL:
// - Physical device on WiFi: http://192.168.0.107:5000
// - Android Emulator: http://10.0.2.2:5000
// - iOS Simulator / Web / Local: http://localhost:5000
export const getApiBaseUrl = (): string => {
  if (Platform.OS === 'web') {
    return 'http://localhost:5000';
  }
  // Try local LAN IP first so physical phones on WiFi and emulators both connect seamlessly
  return 'http://192.168.0.107:5000';
};

export const API_BASE_URL = getApiBaseUrl();
