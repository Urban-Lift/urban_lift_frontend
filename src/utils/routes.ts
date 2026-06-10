import type { Role } from '@/types';

/** Where a user lands after auth, based on their role. */
export function homeRouteFor(role: Role | undefined): string {
  if (role === 'driver') return '/driver-home';
  if (role === 'admin') return '/overview';
  return '/home';
}
