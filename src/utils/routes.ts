import type { Role } from '@/types';

/** Where a user lands after auth, based on their role. */
export function homeRouteFor(role: Role | undefined): string {
  return role === 'driver' ? '/driver/dashboard' : '/home';
}
