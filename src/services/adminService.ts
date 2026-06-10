/** Admin endpoints — driver registration approvals + user management. */
import type { Role } from '@/types';
import { http } from './api';
import { asList } from './mappers';

export interface DriverRegistration {
  id: number;
  fullName: string;
  phone: string;
  email?: string;
  carModel: string;
  carColor: string;
  plate: string;
  carYear?: number;
  ghanaCard?: string;
  carPic?: string;
  approved: boolean | null;
}

export interface AdminUser {
  id: string;
  name: string;
  phone: string;
  role: Role;
  email?: string;
  avatarUrl?: string;
  active: boolean;
}

function mapRegistration(r: any): DriverRegistration {
  return {
    id: Number(r.id ?? r.registration_id),
    fullName: r.full_name ?? 'Driver',
    phone: r.phone_number ?? '',
    email: r.email ?? undefined,
    carModel: r.car_model ?? '',
    carColor: r.car_color ?? '',
    plate: r.license_plate_num ?? '',
    carYear: r.car_year ?? undefined,
    ghanaCard: r.ghana_card ?? undefined,
    carPic: r.car_pic ?? undefined,
    approved: r.approved ?? null,
  };
}

function mapUser(u: any): AdminUser {
  return {
    id: String(u.id ?? u.auth_id ?? u.phone_number),
    name: u.full_name ?? u.name ?? u.phone_number ?? 'User',
    phone: u.phone_number ?? '',
    role: (u.role ?? 'passenger') as Role,
    email: u.email ?? undefined,
    avatarUrl: u.profile_pic ?? undefined,
    active: Boolean(u.is_active),
  };
}

export const adminService = {
  async registrations(): Promise<DriverRegistration[]> {
    try {
      const res = await http.get('/admin/drivers/registrations/fetch');
      const rows = res?.registration_data ?? res;
      return asList(Array.isArray(rows) ? rows : { data: rows }).map(mapRegistration);
    } catch {
      return []; // 404 when there are none
    }
  },

  async approve(registrationId: number, approved: boolean): Promise<void> {
    await http.patchForm('/admin/drivers/registration/approve', {
      registration_id: registrationId,
      approved,
    });
  },

  async users(opts: { query?: string; role?: string } = {}): Promise<AdminUser[]> {
    try {
      const res = await http.get('/admin/users', {
        query: opts.query ?? '',
        role: opts.role ?? '',
        limit: 100,
        skip: 0,
      });
      const rows = res?.users ?? res;
      return asList(Array.isArray(rows) ? rows : { data: rows }).map(mapUser);
    } catch {
      return [];
    }
  },

  /** Delete a user by phone number (the path id is unused by the API). */
  async deleteUser(user: AdminUser): Promise<void> {
    await http.del(`/admin/users/${encodeURIComponent(user.id)}`, { phone_number: user.phone });
  },
};
