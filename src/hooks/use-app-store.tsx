import AsyncStorage from '@react-native-async-storage/async-storage'
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

import { initialRequests } from '@/constants/demo-data'
import type { AppPreferences, LegalRequest, Review } from '@/types/models'

const STORE_KEY = 'yurist-online-demo-v1'

const defaultPreferences: AppPreferences = {
  biometric: true,
  twoFactor: false,
  privacy: true,
  notifications: true,
  language: 'O‘zbek tili (Lotin)',
  theme: 'Avto',
}

type AppStoreValue = {
  requests: LegalRequest[]
  savedLawyers: string[]
  reviews: Review[]
  preferences: AppPreferences
  ready: boolean
  addRequest: (request: LegalRequest) => void
  updateRequest: (id: string, patch: Partial<LegalRequest>) => void
  toggleSavedLawyer: (id: string) => void
  addReview: (review: Review) => void
  updatePreferences: (patch: Partial<AppPreferences>) => void
}

const AppStoreContext = createContext<AppStoreValue | null>(null)

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState(initialRequests)
  const [savedLawyers, setSavedLawyers] = useState<string[]>(['13'])
  const [reviews, setReviews] = useState<Review[]>([])
  const [preferences, setPreferences] = useState(defaultPreferences)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let mounted = true
    AsyncStorage.getItem(STORE_KEY).then((stored) => {
      if (!stored || !mounted) return
      try {
        const value = JSON.parse(stored) as Partial<Pick<AppStoreValue, 'requests' | 'savedLawyers' | 'reviews' | 'preferences'>>
        if (value.requests) setRequests(value.requests)
        if (value.savedLawyers) setSavedLawyers(value.savedLawyers)
        if (value.reviews) setReviews(value.reviews)
        if (value.preferences) setPreferences({ ...defaultPreferences, ...value.preferences })
      } catch {
        // Ignore invalid/stale demo storage and retain safe defaults.
      }
    }).catch(() => undefined).finally(() => {
      if (mounted) setReady(true)
    })
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    if (!ready) return
    AsyncStorage.setItem(STORE_KEY, JSON.stringify({ requests, savedLawyers, reviews, preferences })).catch(() => undefined)
  }, [preferences, ready, requests, reviews, savedLawyers])

  const addRequest = useCallback((request: LegalRequest) => setRequests((current) => [request, ...current]), [])
  const updateRequest = useCallback((id: string, patch: Partial<LegalRequest>) => setRequests((current) => current.map((request) => request.id === id ? { ...request, ...patch } : request)), [])
  const toggleSavedLawyer = useCallback((id: string) => setSavedLawyers((current) => current.includes(id) ? current.filter((savedId) => savedId !== id) : [...current, id]), [])
  const addReview = useCallback((review: Review) => {
    setReviews((current) => [review, ...current.filter((item) => item.lawyerId !== review.lawyerId)])
    setRequests((current) => current.map((request) => request.lawyerId === review.lawyerId && request.status === 'Yakunlangan' ? { ...request, rating: review.rating } : request))
  }, [])
  const updatePreferences = useCallback((patch: Partial<AppPreferences>) => setPreferences((current) => ({ ...current, ...patch })), [])

  const value = useMemo(() => ({ requests, savedLawyers, reviews, preferences, ready, addRequest, updateRequest, toggleSavedLawyer, addReview, updatePreferences }), [requests, savedLawyers, reviews, preferences, ready, addRequest, updateRequest, toggleSavedLawyer, addReview, updatePreferences])
  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>
}

export function useAppStore() {
  const value = useContext(AppStoreContext)
  if (!value) throw new Error('useAppStore must be used inside AppStoreProvider')
  return value
}
