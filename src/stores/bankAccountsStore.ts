import { create } from 'zustand';
import { apiClient, type BankAccount } from '@/lib/api';

interface BankAccountsState {
  accounts: BankAccount[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadAccounts: () => Promise<void>;
  createAccount: (accountData: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    openingBalance: number;
  }) => Promise<BankAccount>;

  updateAccount: (id: string, accountData: Partial<BankAccount>) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
  deposit: (id: string, depositData: {
    amount: number;
    date: string;
    note?: string;
    reference?: string;
  }) => Promise<void>;

  withdraw: (id: string, withdrawData: {
    amount: number;
    date: string;
    note?: string;
  }) => Promise<void>;

  transfer: (fromId: string, transferData: {
    toAccountId: string;
    amount: number;
    date: string;
    note?: string;
  }) => Promise<void>;

  getTransactions: (id: string, params?: {
    page?: number;
    limit?: number;
    type?: string;
    dateFrom?: string;
    dateTo?: string;
  }) => Promise<any>;
}

export const useBankAccountsStore = create<BankAccountsState>((set, get) => ({
  accounts: [],
  isLoading: false,
  error: null,

  loadAccounts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getBankAccounts();
      set({ accounts: response.data, isLoading: false });
    } catch (error) {
      console.error('Failed to load bank accounts:', error);
      set({ error: 'Failed to load bank accounts', isLoading: false });
    }
  },

  createAccount: async (accountData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.createBankAccount(accountData);
      const newAccount = response.data;
      set((state) => ({
        accounts: [...state.accounts, newAccount],
        isLoading: false,
      }));
      return newAccount;
    } catch (error) {
      console.error('Failed to create bank account:', error);
      set({ error: 'Failed to create bank account', isLoading: false });
      throw error;
    }
  },

  updateAccount: async (id, accountData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.updateBankAccount(id, accountData);
      const updatedAccount = response.data;
      set((state) => ({
        accounts: state.accounts.map((a) => (a.id === id ? updatedAccount : a)),
        isLoading: false,
      }));
    } catch (error) {
      console.error('Failed to update bank account:', error);
      set({ error: 'Failed to update bank account', isLoading: false });
      throw error;
    }
  },

  deleteAccount: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.deleteBankAccount(id);
      set((state) => ({
        accounts: state.accounts.filter((a) => a.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      console.error('Failed to delete bank account:', error);
      set({ error: 'Failed to delete bank account', isLoading: false });
      throw error;
    }
  },

  deposit: async (id, depositData) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.depositToBank(id, depositData);
      // Reload accounts to get updated balances
      await get().loadAccounts();
      set({ isLoading: false });
    } catch (error) {
      console.error('Failed to deposit to bank:', error);
      set({ error: 'Failed to deposit to bank', isLoading: false });
      throw error;
    }
  },

  withdraw: async (id, withdrawData) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.withdrawFromBank(id, withdrawData);
      // Reload accounts to get updated balances
      await get().loadAccounts();
      set({ isLoading: false });
    } catch (error) {
      console.error('Failed to withdraw from bank:', error);
      set({ error: 'Failed to withdraw from bank', isLoading: false });
      throw error;
    }
  },

  transfer: async (fromId, transferData) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.transferBetweenBanks(fromId, transferData);
      // Reload accounts to get updated balances
      await get().loadAccounts();
      set({ isLoading: false });
    } catch (error) {
      console.error('Failed to transfer between banks:', error);
      set({ error: 'Failed to transfer between banks', isLoading: false });
      throw error;
    }
  },

  getTransactions: async (id, params) => {
    try {
      return await apiClient.getBankTransactions(id, params);
    } catch (error) {
      console.error('Failed to get bank transactions:', error);
      throw error;
    }
  },
}));