export type LegalCategory = 'all' | 'notary' | 'fhdyo' | 'lawyer' | 'dxm';

export interface FeeItem {
  title: string;
  price: string;
}

export interface LegalPlace {
  id: string;
  name: string;
  category: 'notary' | 'fhdyo' | 'lawyer' | 'dxm';
  categoryLabel: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  distance: string;
  distanceMeters: number;
  isOpen: boolean;
  workingHours: string;
  statusText: string;
  queueCount: number;
  queueStatus: 'kam' | 'o‘rtacha' | 'gavjum';
  address: string;
  phone: string;
  official: string;
  licenseNumber: string;
  fees: FeeItem[];
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface QueueTicket {
  id: string;
  ticketNumber: string;
  organizationName: string;
  address: string;
  estimatedTime: string;
  peopleAhead: number;
  status: 'active' | 'completed' | 'cancelled';
}
