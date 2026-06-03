import type { User } from '@/types'

const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

export const mockUsers: Record<string, User> = {
  passenger: {
    id: 'usr-001',
    phoneNumber: '+233541234567',
    email: 'kwame@example.com',
    fullName: 'Kwame Mensah',
    profilePhotoUrl: undefined,
    role: 'passenger',
    authProvider: 'phone',
    emergencyContact: '+233201234567',
    isPhoneVerified: true,
    isEmailVerified: false,
    avgRating: 4.8,
    totalRatings: 42,
    referralCode: 'KWAME10',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  driver: {
    id: 'usr-002',
    phoneNumber: '+233541234567',
    email: 'kofi@example.com',
    fullName: 'Kofi Osei',
    profilePhotoUrl: undefined,
    role: 'driver',
    authProvider: 'phone',
    emergencyContact: '+233201234567',
    isPhoneVerified: true,
    isEmailVerified: false,
    avgRating: 4.9,
    totalRatings: 124,
    referralCode: 'KOFI10',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
}

export const mockAuth = {
  async sendOTP(_phone: string): Promise<void> {
    await delay(900)
  },

  async verifyOTP(_phone: string, code: string): Promise<{ token: string }> {
    await delay(700)
    if (code.length !== 6) throw new Error('Invalid OTP. Please check and try again.')
    return { token: `mock-token-${Date.now()}` }
  },

  async sendEmailCode(_email: string): Promise<void> {
    await delay(700)
  },

  async verifyEmailCode(_email: string, code: string): Promise<void> {
    await delay(700)
    if (code.length !== 6) throw new Error('Invalid code. Please check and try again.')
  },

  async createPassengerProfile(data: {
    fullName: string
    email?: string
    emergencyContact: string
    phone: string
  }): Promise<User> {
    await delay(1000)
    return {
      ...mockUsers.passenger,
      id: `usr-${Date.now()}`,
      fullName: data.fullName,
      email: data.email,
      phoneNumber: data.phone,
      emergencyContact: data.emergencyContact,
      role: 'passenger',
    }
  },

  async createDriverProfile(data: {
    fullName: string
    email?: string
    emergencyContact: string
    phone: string
  }): Promise<User> {
    await delay(1000)
    return {
      ...mockUsers.driver,
      id: `usr-${Date.now()}`,
      fullName: data.fullName,
      email: data.email,
      phoneNumber: data.phone,
      emergencyContact: data.emergencyContact,
      role: 'driver',
    }
  },
}
