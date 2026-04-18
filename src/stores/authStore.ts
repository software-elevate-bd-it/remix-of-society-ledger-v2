import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useUsersStore } from './usersStore';
import { useRolesStore } from './rolesStore';

export type UserRole = 'super_admin' | 'main_user' | 'member';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  somiteeId?: string;
  someiteeName?: string;
  roleIds?: string[];
  isManagedUser?: boolean;
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

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (email, password) => {
        // 1. Try demo users first
        const demo = demoUsers[email.toLowerCase()];
        if (demo && demo.password === password) {
          const { password: _, ...userData } = demo;
          set({ user: userData, isAuthenticated: true });
          return true;
        }
        // 2. Try managed users (created by main_user)
        const managed = useUsersStore.getState().findByEmail(email);
        if (managed && managed.password === password && managed.status === 'active') {
          set({
            user: {
              id: managed.id,
              name: managed.name,
              email: managed.email,
              role: managed.role,
              somiteeId: managed.somiteeId,
              someiteeName: managed.someiteeName,
              roleIds: managed.roleIds,
              isManagedUser: true,
            },
            isAuthenticated: true,
          });
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
    }),
    { name: 'somitee-auth-storage' }
  )
);

// Helper hook for permissions of current user
export function useCurrentPermissions() {
  const user = useAuthStore((s) => s.user);
  const roles = useRolesStore((s) => s.roles);
  const assignments = useRolesStore((s) => s.assignments);

  if (!user) return [];
  // Super admin & main_user implicitly have ALL permissions
  if (user.role === 'super_admin' || user.role === 'main_user') {
    return ['*'] as const;
  }
  // Managed user: union of permissions from assigned roleIds + assignments
  const ids = new Set<string>([
    ...(user.roleIds ?? []),
    ...assignments.filter((a) => a.userId === user.id).map((a) => a.roleId),
  ]);
  const perms = new Set<string>();
  ids.forEach((rid) => roles.find((r) => r.id === rid)?.permissions.forEach((p) => perms.add(p)));
  return Array.from(perms);
}
