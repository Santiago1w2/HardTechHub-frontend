import { identityApi } from '../api/axios'
import type { AuthRequest, RegisterResponse, LoginResponse, UserProfile } from '../types/type'

export async function register(payload: AuthRequest): Promise<RegisterResponse> {
  return (await identityApi.post<RegisterResponse>('/api/auth/register', payload)).data
}
export async function login(payload: AuthRequest): Promise<LoginResponse> {
  return (await identityApi.post<LoginResponse>('/api/auth/login', payload)).data
}
export async function getProfile(signal?: AbortSignal): Promise<UserProfile> {
  return (await identityApi.get<UserProfile>('/api/auth/me', { signal })).data
}
// Session state is owned by AuthProvider; use useAuth().logout().
