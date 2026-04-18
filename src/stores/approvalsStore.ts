import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ApprovalType = 'collection' | 'expense' | 'bank' | 'member';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface ApprovalItem {
  id: string;
  type: ApprovalType;
  title: string;
  amount?: number;
  description?: string;
  payload: Record<string, any>;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  status: ApprovalStatus;
  reviewedBy?: string;
  reviewedByName?: string;
  reviewedAt?: string;
  rejectionNote?: string;
}

interface ApprovalsState {
  items: ApprovalItem[];
  submit: (item: Omit<ApprovalItem, 'id' | 'createdAt' | 'status'>) => ApprovalItem;
  approve: (id: string, reviewerId: string, reviewerName: string) => void;
  reject: (id: string, reviewerId: string, reviewerName: string, note: string) => void;
  pendingCount: () => number;
  pendingByType: (type: ApprovalType) => ApprovalItem[];
}

export const useApprovalsStore = create<ApprovalsState>()(
  persist(
    (set, get) => ({
      items: [],
      submit: (item) => {
        const newItem: ApprovalItem = {
          ...item,
          id: `apr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          createdAt: new Date().toISOString(),
          status: 'pending',
        };
        set((s) => ({ items: [newItem, ...s.items] }));
        return newItem;
      },
      approve: (id, reviewerId, reviewerName) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.id === id
              ? {
                  ...i,
                  status: 'approved',
                  reviewedBy: reviewerId,
                  reviewedByName: reviewerName,
                  reviewedAt: new Date().toISOString(),
                }
              : i
          ),
        })),
      reject: (id, reviewerId, reviewerName, note) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.id === id
              ? {
                  ...i,
                  status: 'rejected',
                  reviewedBy: reviewerId,
                  reviewedByName: reviewerName,
                  reviewedAt: new Date().toISOString(),
                  rejectionNote: note,
                }
              : i
          ),
        })),
      pendingCount: () => get().items.filter((i) => i.status === 'pending').length,
      pendingByType: (type) => get().items.filter((i) => i.status === 'pending' && i.type === type),
    }),
    { name: 'somitee-approvals-storage' }
  )
);
