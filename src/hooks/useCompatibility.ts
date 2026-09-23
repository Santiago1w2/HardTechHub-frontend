import { postCompatibility } from '../services/compatibilityService'
import { useMutation } from './useMutation'

export function useCompatibility() {
  const { execute, ...state } = useMutation(postCompatibility)
  return { checkCompatibility: execute, ...state }
}
