/**
 * Driver dashboard data. Earnings/stats are LIVE (/drivers/earnings). Incoming
 * ride requests have no endpoint (the API is offer-based: drivers post rides,
 * passengers book them), so those stay mock for the request-style UI.
 */
import type { DriverStats, RideRequest } from '@/types';
import { rideRequests } from '@/mocks/data';
import { http, delay } from './api';
import { mapEarnings } from './mappers';
import { useDriverStore } from '@/store/driverStore';

export const driverService = {
  async getStats(): Promise<DriverStats> {
    const online = useDriverStore.getState().online;
    try {
      const res = await http.get('/drivers/earnings');
      return mapEarnings(res, online);
    } catch {
      return mapEarnings({}, online);
    }
  },

  async setOnline(online: boolean): Promise<{ online: boolean }> {
    return { online };
  },

  // ── No backend endpoint: drivers receive bookings on rides they post, not
  //    discrete "requests". Kept mock to power the request-style screens. ──
  async incomingRequests(): Promise<RideRequest[]> {
    return delay(rideRequests, 500);
  },

  async respond(_requestId: string, accept: boolean): Promise<{ accepted: boolean }> {
    return delay({ accepted: accept }, 300);
  },
};
