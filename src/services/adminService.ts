/** Admin endpoints — driver registration approvals + user lookup. */
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

export const adminService = {
  async registrations(): Promise<DriverRegistration[]> {
    try {
      const res = await http.get('/admin/drivers/registrations/fetch');
      return (res?.registration_data ? asList({ data: res.registration_data }) : asList(res)).map(mapRegistration);
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

  async users(role?: string): Promise<any[]> {
    const res = await http.get('/admin/users', { role: role ?? '', limit: 50 });
    return asList(res?.users ? { data: res.users } : res);
  },
};
