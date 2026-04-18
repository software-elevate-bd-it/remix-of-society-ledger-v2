import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Permission =
  | 'collection.create' | 'collection.approve'
  | 'expense.create' | 'expense.approve'
  | 'bank.create' | 'bank.approve'
  | 'member.create' | 'member.approve'
  | 'reports.view' | 'settings.manage' | 'roles.manage';

export const ALL_PERMISSIONS: { key: Permission; label: string; group: string }[] = [
  { key: 'collection.create', label: 'Create Collection', group: 'Collections' },
  { key: 'collection.approve', label: 'Approve Collection', group: 'Collections' },
  { key: 'expense.create', label: 'Create Expense', group: 'Expenses' },
  { key: 'expense.approve', label: 'Approve Expense', group: 'Expenses' },
  { key: 'bank.create', label: 'Create Bank Transaction', group: 'Bank' },
  { key: 'bank.approve', label: 'Approve Bank Transaction', group: 'Bank' },
  { key: 'member.create', label: 'Register Member', group: 'Members' },
  { key: 'member.approve', label: 'Approve Member', group: 'Members' },
  { key: 'reports.view', label: 'View Reports', group: 'Reports' },
  { key: 'settings.manage', label: 'Manage Settings', group: 'Admin' },
  { key: 'roles.manage', label: 'Manage Roles', group: 'Admin' },
];

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
  isPreset: boolean;
  createdAt: string;
}

export interface RoleAssignment {
  userId: string;
  userName: string;
  roleId: string;
  assignedAt: string;
}

const PRESET_ROLES: Role[] = [
  {
    id: 'role-collector',
    name: 'Collector',
    description: 'Can record collections, requires approval',
    permissions: ['collection.create'],
    isPreset: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'role-accountant',
    name: 'Accountant',
    description: 'Records expenses and bank transactions',
    permissions: ['expense.create', 'bank.create', 'collection.create', 'reports.view'],
    isPreset: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'role-approver',
    name: 'Approver',
    description: 'Approves all financial transactions',
    permissions: ['collection.approve', 'expense.approve', 'bank.approve', 'member.approve', 'reports.view'],
    isPreset: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'role-viewer',
    name: 'Viewer',
    description: 'Read-only access to reports',
    permissions: ['reports.view'],
    isPreset: true,
    createdAt: new Date().toISOString(),
  },
];

interface RolesState {
  roles: Role[];
  assignments: RoleAssignment[];
  addRole: (role: Omit<Role, 'id' | 'isPreset' | 'createdAt'>) => Role;
  updateRole: (id: string, patch: Partial<Omit<Role, 'id' | 'isPreset'>>) => void;
  deleteRole: (id: string) => void;
  assignRole: (userId: string, userName: string, roleId: string) => void;
  unassignRole: (userId: string, roleId: string) => void;
  getUserPermissions: (userId: string) => Permission[];
  hasPermission: (userId: string, permission: Permission) => boolean;
}

export const useRolesStore = create<RolesState>()(
  persist(
    (set, get) => ({
      roles: PRESET_ROLES,
      assignments: [],
      addRole: (role) => {
        const newRole: Role = {
          ...role,
          id: `role-${Date.now()}`,
          isPreset: false,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ roles: [...s.roles, newRole] }));
        return newRole;
      },
      updateRole: (id, patch) =>
        set((s) => ({
          roles: s.roles.map((r) => (r.id === id ? { ...r, ...patch } : r)),
        })),
      deleteRole: (id) =>
        set((s) => ({
          roles: s.roles.filter((r) => r.id !== id || r.isPreset),
          assignments: s.assignments.filter((a) => a.roleId !== id),
        })),
      assignRole: (userId, userName, roleId) =>
        set((s) => ({
          assignments: [
            ...s.assignments.filter((a) => !(a.userId === userId && a.roleId === roleId)),
            { userId, userName, roleId, assignedAt: new Date().toISOString() },
          ],
        })),
      unassignRole: (userId, roleId) =>
        set((s) => ({
          assignments: s.assignments.filter((a) => !(a.userId === userId && a.roleId === roleId)),
        })),
      getUserPermissions: (userId) => {
        const { assignments, roles } = get();
        const userRoleIds = assignments.filter((a) => a.userId === userId).map((a) => a.roleId);
        const perms = new Set<Permission>();
        userRoleIds.forEach((rid) => {
          roles.find((r) => r.id === rid)?.permissions.forEach((p) => perms.add(p));
        });
        return Array.from(perms);
      },
      hasPermission: (userId, permission) => get().getUserPermissions(userId).includes(permission),
    }),
    { name: 'somitee-roles-storage' }
  )
);
