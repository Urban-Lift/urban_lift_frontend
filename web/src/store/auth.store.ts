import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, UserRole } from '@/types'

interface AuthState {
  // Persisted
  user: User | null
  token: string | null
  isAuthenticated: boolean

  // In-flow (not persisted)
  pendingPhone: string
  pendingRole: UserRole
  pendingEmail: string

  // Actions
  setPendingPhone: (phone: string) => void
  setPendingRole: (role: UserRole) => void
  setPendingEmail: (email: string) => void
  setAuth: (user: User, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      pendingPhone: '',
      pendingRole: 'passenger',
      pendingEmail: '',

      setPendingPhone: (pendingPhone) => set({ pendingPhone }),
      setPendingRole:  (pendingRole)  => set({ pendingRole }),
      setPendingEmail: (pendingEmail) => set({ pendingEmail }),

      setAuth: (user, token) =>
        set({ user, token, isAuthenticated: true }),

      logout: () =>
        set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'urbanlift-auth',
      partialize: (s) => ({
        user: s.user,
        token: s.token,
        isAuthenticated: s.isAuthenticated,
      }),
    },
  ),
)
