export type Lawyer = {
  id: string
  name: string
  title: string
  category: string
  experience: number
  rating: number
  reviews: number
  price: number
  online: boolean
  initials: string
  avatarColor: string
  license: string
  languages: string[]
  service: string
}

export type ConsultationKind = 'Video konsultatsiya' | 'Matnli chat' | 'Hujjat ekspertizasi'
export type RequestStatus = 'Kutilayotgan' | 'Ko‘rib chiqilmoqda' | 'Yakunlangan'

export type LegalRequest = {
  id: string
  status: RequestStatus
  kind: ConsultationKind
  lawyerId: string
  lawyerName: string
  lawyerTitle: string
  subject: string
  price: number
  date: string
  duration?: string
  fileName?: string
  progress?: number
  rating?: number
}

export type Review = {
  lawyerId: string
  lawyerName: string
  rating: number
  factors: string[]
  comment: string
  anonymous: boolean
  public: boolean
  createdAt: string
}

export type AppPreferences = {
  biometric: boolean
  twoFactor: boolean
  privacy: boolean
  notifications: boolean
  language: string
  theme: 'Avto' | 'Yorug‘' | 'Qorong‘i'
}
