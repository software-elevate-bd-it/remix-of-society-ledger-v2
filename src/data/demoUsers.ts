import type { User } from '@/lib/api';

export interface DemoUser {
  email: string;
  password: string;
  user: User & { roleIds?: string[] };
  label: string;
  description: string;
}

/**
 * Demo users for offline / no-backend mode.
 * If the API is unreachable, login falls back to these.
 * Passwords are intentionally simple for demo only.
 */
export const DEMO_USERS: DemoUser[] = [
  {
    email: 'admin@somitee.com',
    password: 'admin123',
    label: 'Super Admin',
    description: 'Full platform access',
    user: {
      id: 'demo-super-1',
      name: 'Super Admin',
      email: 'admin@somitee.com',
      role: 'super_admin',
      somiteeId: 's1',
      somiteeName: 'বৃহত্তর মুরাদপুর ব্যবসায়ী সমিতি',
      phone: '01700000000',
      profilePhoto: null,
    },
  },
  {
    email: 'manager@somitee.com',
    password: 'manager123',
    label: 'Somitee Manager',
    description: 'Main user — manages members, roles & approvals',
    user: {
      id: 'demo-main-1',
      name: 'Abdul Karim',
      email: 'manager@somitee.com',
      role: 'main_user',
      somiteeId: 's1',
      somiteeName: 'বৃহত্তর মুরাদপুর ব্যবসায়ী সমিতি',
      phone: '01711111111',
      profilePhoto: null,
    },
  },
  {
    email: 'collector@somitee.com',
    password: 'collect123',
    label: 'Collector',
    description: 'Records collections (needs approval)',
    user: {
      id: 'demo-collector-1',
      name: 'Rahim Uddin',
      email: 'collector@somitee.com',
      role: 'member',
      somiteeId: 's1',
      somiteeName: 'বৃহত্তর মুরাদপুর ব্যবসায়ী সমিতি',
      phone: '01722222222',
      profilePhoto: null,
      roleIds: ['role-collector'],
    },
  },
  {
    email: 'accountant@somitee.com',
    password: 'account123',
    label: 'Accountant',
    description: 'Records expenses & bank transactions',
    user: {
      id: 'demo-accountant-1',
      name: 'Salma Akter',
      email: 'accountant@somitee.com',
      role: 'member',
      somiteeId: 's1',
      somiteeName: 'বৃহত্তর মুরাদপুর ব্যবসায়ী সমিতি',
      phone: '01733333333',
      profilePhoto: null,
      roleIds: ['role-accountant'],
    },
  },
  {
    email: 'approver@somitee.com',
    password: 'approve123',
    label: 'Approver',
    description: 'Approves all financial transactions',
    user: {
      id: 'demo-approver-1',
      name: 'Mohammad Imran',
      email: 'approver@somitee.com',
      role: 'member',
      somiteeId: 's1',
      somiteeName: 'বৃহত্তর মুরাদপুর ব্যবসায়ী সমিতি',
      phone: '01744444444',
      profilePhoto: null,
      roleIds: ['role-approver'],
    },
  },
  {
    email: 'viewer@somitee.com',
    password: 'viewer123',
    label: 'Viewer',
    description: 'Read-only reports access',
    user: {
      id: 'demo-viewer-1',
      name: 'Nasir Ahmed',
      email: 'viewer@somitee.com',
      role: 'member',
      somiteeId: 's1',
      somiteeName: 'বৃহত্তর মুরাদপুর ব্যবসায়ী সমিতি',
      phone: '01755555555',
      profilePhoto: null,
      roleIds: ['role-viewer'],
    },
  },
  {
    email: 'member@somitee.com',
    password: 'member123',
    label: 'Member',
    description: 'Regular member view',
    user: {
      id: 'demo-member-1',
      name: 'Karim Mia',
      email: 'member@somitee.com',
      role: 'member',
      somiteeId: 's1',
      somiteeName: 'বৃহত্তর মুরাদপুর ব্যবসায়ী সমিতি',
      phone: '01766666666',
      profilePhoto: null,
      roleIds: [],
    },
  },
];

export function findDemoUser(email: string, password: string): DemoUser | undefined {
  return DEMO_USERS.find(
    (u) => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password
  );
}
