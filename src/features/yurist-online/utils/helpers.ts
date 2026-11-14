import type { Lawyer } from '../types/models'
import { lawyers } from '../constants/demo-data'

export function findLawyer(id?: string | string[] | null): Lawyer | undefined {
  const normalized = Array.isArray(id) ? id[0] : id
  if (!normalized) return undefined
  return lawyers.find((lawyer) => lawyer.id === normalized)
}
