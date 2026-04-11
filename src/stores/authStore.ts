import { create } from 'zustand';

export type UserRole = 'super_admin' | 'main_user' | 'member';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  somiteeId?: string;
  someiteeName?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const demoUsers: Record<string, User & { password: string }> = {
  'admin@system.com': { id: '1', name: 'System Admin', email: 'admin@system.com', password: 'admin123', role: 'super_admin' },
  'manager@somitee.com': { id: '2', name: 'Rahim Uddin', email: 'manager@somitee.com', password: 'manager123', role: 'main_user', somiteeId: 's1', someiteeName: 'Banani Market Somitee' },
  'member@shop.com': { id: '3', name: 'Karim Mia', email: 'member@shop.com', password: 'member123', role: 'member', somiteeId: 's1', someiteeName: 'Banani Market Somitee' },
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (email, password) => {
    const user = demoUsers[email];
    if (user && user.password === password) {
      const { password: _, ...userData } = user;
      set({ user: userData, isAuthenticated: true });
      return true;
    }
    return false;
  },
  register: (name, email, _password, role) => {
    set({ user: { id: Date.now().toString(), name, email, role, somiteeId: 's-new', someiteeName: 'New Somitee' }, isAuthenticated: true });
    return true;
  },
  logout: () => set({ user: null, isAuthenticated: false }),
  switchRole: (role) => set((state) => state.user ? { user: { ...state.user, role } } : {}),
}));
