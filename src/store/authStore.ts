/**
 * Auth + onboarding state. The persisted slice (user, token, role) is what
 * keeps a user logged in across reloads; the `draft` slice holds transient
 * sign-up values (phone/role/email/name) while moving through the OTP and
 * setup screens, and is cleared once the account is created.
 */
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Role, User } from '@/types';
import { setAuthToken } from '@/services/api';
import { zustandStorage } from '@/lib/storage';

interface SignupDraft {
  role: Role;
  phone: string;
  email?: string;
  name?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  hydrated: boolean;
  draft: SignupDraft | null;

  startSignup: (role: Role, phone: string) => void;
  updateDraft: (patch: Partial<SignupDraft>) => void;
  login: (user: User, token: string) => void;
  patchUser: (patch: Partial<User>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      hydrated: false,
      draft: null,

      startSignup: (role, phone) => set({ draft: { role, phone } }),
      updateDraft: (patch) =>
        set((s) => ({ draft: s.draft ? { ...s.draft, ...patch } : s.draft })),

      login: (user, token) => {
        setAuthToken(token);
        set({ user, token, draft: null });
      },

      patchUser: (patch) =>
        set((s) => ({ user: s.user ? { ...s.user, ...patch } : s.user })),

      logout: () => {
        setAuthToken(null);
        set({ user: null, token: null, draft: null });
      },
    }),
    {
      name: 'urbanlift-auth',
      storage: createJSONStorage(() => zustandStorage),
      partialize: (s) => ({ user: s.user, token: s.token }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) setAuthToken(state.token);
        useAuthStore.setState({ hydrated: true });
      },
    },
  ),
);
