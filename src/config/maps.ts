/**
 * Google Maps API Konfiguratsiyasi
 * 
 * Google Cloud Console'dan olingan API kalitni shu yerga kiritishingiz mumkin:
 * https://console.cloud.google.com/google/maps-apis
 */
export const GOOGLE_MAPS_CONFIG = {
  // Agar maxsus API kalitingiz bo'lsa shu yerga yozing:
  apiKey: '', 

  // Standart markaz (Toshkent koordinatalari)
  defaultCenter: {
    latitude: 41.311081,
    longitude: 69.240562,
    zoom: 14,
  },

  // Google Maps Embed URL generatori (Web va mobil uchun)
  getEmbedUrl: (lat: number, lng: number, zoom = 15, query?: string) => {
    if (query) {
      return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&ll=${lat},${lng}&z=${zoom}&hl=uz&output=embed`;
    }
    return `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&hl=uz&output=embed`;
  },

  // Google Maps ilovasida ochish
  getDirectionsUrl: (lat: number, lng: number, placeName?: string) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(placeName || '')}`;
  },
};
