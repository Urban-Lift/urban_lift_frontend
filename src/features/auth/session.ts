/**
 * Shared post-authentication routine. Given a session token (from phone OTP or
 * Google), it stores the session, figures out the role + whether a profile
 * exists, logs the user in, and returns the route to navigate to.
 */
import type { Role } from '@/types';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';
import { mapProfile } from '@/services/mappers';
import { homeRouteFor } from '@/utils/routes';

export async function establishSession(token: string, fallbackRole: Role, phone = ''): Promise<string> {
  const { setSessionToken, login } = useAuthStore.getState();
  setSessionToken(token);

  const role = authService.roleFromToken(token) ?? fallbackRole;
  const authId = authService.userIdFromToken(token);

  if (role === 'admin') {
    login({ id: phone || authId || 'admin', authId, role: 'admin', name: 'Admin', phone, rating: 5 }, token);
    return '/overview';
  }

  const profile = await authService.getProfile();
  if (profile) {
    const user = mapProfile(profile, role, phone);
    login(user, token);
    return homeRouteFor(user.role);
  }

  // No profile yet → finish onboarding.
  return role === 'driver' ? '/setup-driver' : '/setup-passenger';
}
