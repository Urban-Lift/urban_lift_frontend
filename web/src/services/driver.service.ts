import { mockDriverApi } from '@/mocks/driver.mock'
import type { DriverStats, PassengerRequest, DriverTrip } from '@/types'

const USE_MOCK_API = true
const api = USE_MOCK_API ? mockDriverApi : mockDriverApi

export const driverService = {
  getStats:        (): Promise<DriverStats>           => api.getStats(),
  getRequests:     (): Promise<PassengerRequest[]>    => api.getRequests(),
  toggleOnline:    (online: boolean): Promise<void>   => api.toggleOnline(online),
  acceptRequest:   (id: string): Promise<DriverTrip>  => api.acceptRequest(id),
  declineRequest:  (id: string): Promise<void>        => api.declineRequest(id),
  getActiveTrip:   (): Promise<DriverTrip | null>     => api.getActiveTrip(),
  completeTrip:    (id: string): Promise<void>        => api.completeTrip(id),
}
