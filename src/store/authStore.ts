import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'receptionist';
}

interface AuthResponse {
  access_token: string;
  user: User;
}

type AuthState = {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (response: AuthResponse) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      login: (response) =>
        set({
          token: response.access_token,
          user: response.user,
          isAuthenticated: true,
        }),
      logout: () =>
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
