import { mockAuth } from '@/mocks/auth.mock'
import { USE_MOCK_API } from '@/utils/constants'
import type { User, UserRole } from '@/types'

const api = USE_MOCK_API ? mockAuth : mockAuth // swap real API here later

export const authService = {
  sendOTP: (phone: string, _role: UserRole) => api.sendOTP(phone),

  verifyPhoneOTP: (phone: string, code: string) =>
    api.verifyOTP(phone, code),

  sendEmailCode: (email: string) => api.sendEmailCode(email),

  verifyEmailCode: (email: string, code: string) =>
    api.verifyEmailCode(email, code),

  createPassengerProfile: (data: {
    fullName: string
    email?: string
    emergencyContact: string
    phone: string
  }): Promise<User> => api.createPassengerProfile(data),

  createDriverProfile: (data: {
    fullName: string
    email?: string
    emergencyContact: string
    phone: string
  }): Promise<User> => api.createDriverProfile(data),
}
