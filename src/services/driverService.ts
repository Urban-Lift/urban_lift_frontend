/** Driver online toggle, incoming requests, accept/decline. */
import type { DriverStats, RideRequest } from '@/types';
import { driverStats, rideRequests } from '@/mocks/data';
import { delay } from './api';

export const driverService = {
  async getStats(): Promise<DriverStats> {
    return delay(driverStats, 400);
  },

  async setOnline(online: boolean): Promise<DriverStats> {
    return delay({ ...driverStats, online }, 300);
  },

  async incomingRequests(): Promise<RideRequest[]> {
    return delay(rideRequests, 600);
  },

  async respond(requestId: string, accept: boolean): Promise<{ accepted: boolean }> {
    return delay({ accepted: accept }, 400);
  },
};
