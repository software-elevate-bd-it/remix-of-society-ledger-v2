import { create } from 'zustand';
import { apiClient, type Payment } from '@/lib/api';

interface PaymentsState {
  payments: Payment[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  // Actions
  loadPayments: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    method?: string;
  }) => Promise<void>;

  verifyPayment: (id: string, status: string, note?: string) => Promise<void>;
}

export const usePaymentsStore = create<PaymentsState>((set, get) => ({
  payments: [],
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },

  loadPayments: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getPayments(params);
      set({
        payments: response.data,
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
        error: error instanceof Error ? error.message : 'Failed to load payments',
        isLoading: false,
      });
      throw error;
    }
  },

  verifyPayment: async (id, status, note) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.verifyPayment(id, { status, note });
      await get().loadPayments();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to verify payment',
        isLoading: false,
      });
      throw error;
    }
  },
}));
