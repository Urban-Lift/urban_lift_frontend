/** Phone login / OTP / profile creation. Mocked — any 6-digit OTP works. */
import type { Role, User, Vehicle } from '@/types';
import { delay } from './api';

export const authService = {
  async requestOtp(phone: string): Promise<{ sent: true }> {
    return delay({ sent: true });
  },

  async verifyPhoneOtp(phone: string, code: string): Promise<{ verified: boolean }> {
    return delay({ verified: code.length === 6 });
  },

  async verifyEmailOtp(email: string, code: string): Promise<{ verified: boolean }> {
    return delay({ verified: code.length === 6 });
  },

  async createPassenger(input: { name: string; phone: string; email?: string }): Promise<User> {
    return delay({
      id: 'u_' + Math.random().toString(36).slice(2, 8),
      role: 'passenger' as Role,
      name: input.name,
      phone: input.phone,
      email: input.email,
      rating: 5.0,
    });
  },

  async createDriver(input: {
    name: string;
    phone: string;
    email?: string;
    vehicle: Vehicle;
  }): Promise<User> {
    return delay({
      id: 'u_' + Math.random().toString(36).slice(2, 8),
      role: 'driver' as Role,
      name: input.name,
      phone: input.phone,
      email: input.email,
      rating: 5.0,
      vehicle: input.vehicle,
    });
  },
};
