import { create } from 'zustand';
import { apiClient, type MemberRequest } from '@/lib/api';

interface MemberRequestsState {
  requests: MemberRequest[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  // Actions
  loadMemberRequests: (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) => Promise<void>;

  approveMemberRequest: (id: string, monthlyFee: number, billingCycle: string) => Promise<void>;
  rejectMemberRequest: (id: string, rejectionNote: string) => Promise<void>;
  deleteMemberRequest: (id: string) => Promise<void>;
}

export const useMemberRequestsStore = create<MemberRequestsState>((set, get) => ({
  requests: [],
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },

  loadMemberRequests: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getMemberRequests(params);
      set({
        requests: response.data,
        pagination: response.meta || {
          page: params?.page || 1,
          limit: params?.limit || 10,
          total: response.data.length,
          totalPages: Math.ceil((response.data.length) / (params?.limit || 10)),
        },
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load member requests',
        isLoading: false,
      });
      throw error;
    }
  },

  approveMemberRequest: async (id, monthlyFee, billingCycle) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.approveMemberRequest(id, { monthlyFee, billingCycle });
      // Reload the requests after approval
      await get().loadMemberRequests();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to approve member request',
        isLoading: false,
      });
      throw error;
    }
  },

  rejectMemberRequest: async (id, rejectionNote) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.rejectMemberRequest(id, { rejectionNote });
      // Reload the requests after rejection
      await get().loadMemberRequests();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to reject member request',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteMemberRequest: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.deleteMemberRequest(id);
      // Reload the requests after deletion
      await get().loadMemberRequests();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete member request',
        isLoading: false,
      });
      throw error;
    }
  },
}));
