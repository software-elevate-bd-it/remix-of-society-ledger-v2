import { create } from 'zustand';
import { apiClient, type CompanySettings } from '@/lib/api';

interface CompanyState {
  company: CompanySettings;
  isLoading: boolean;
  error: string | null;
  updateCompany: (data: Partial<CompanySettings>) => Promise<void>;
  loadCompany: () => Promise<void>;
  uploadLogo: (file: File) => Promise<string>;
  uploadSignature: (file: File) => Promise<string>;
}

export const useCompanyStore = create<CompanyState>((set, get) => ({
  company: {
    name: 'বৃহত্তর মুরাদপুর ব্যবসায়ী সমিতি',
    logo: '',
    address: 'মুরাদপুর, চট্টগ্রাম',
    phone: '01711111111',
    email: 'info@bananimarket.com',
    signature: '',
  },
  isLoading: false,
  error: null,

  updateCompany: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.updateCompanySettings(data);
      set({ company: response.data, isLoading: false });
    } catch (error) {
      console.error('Failed to update company settings:', error);
      set({ error: 'Failed to update company settings', isLoading: false });
      throw error;
    }
  },

  loadCompany: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getCompanySettings();
      set({ company: response.data, isLoading: false });
    } catch (error) {
      console.error('Failed to load company settings:', error);
      set({ error: 'Failed to load company settings', isLoading: false });
      // Keep default values on error
    }
  },

  uploadLogo: async (file) => {
    const formData = new FormData();
    formData.append('logo', file);

    try {
      const response = await apiClient.uploadCompanyLogo(formData);
      const logoUrl = response.data.logoUrl;

      // Update local state
      set((state) => ({
        company: { ...state.company, logo: logoUrl }
      }));

      return logoUrl;
    } catch (error) {
      console.error('Failed to upload logo:', error);
      throw error;
    }
  },

  uploadSignature: async (file) => {
    const formData = new FormData();
    formData.append('signature', file);

    try {
      const response = await apiClient.uploadCompanySignature(formData);
      const signatureUrl = response.data.signatureUrl;

      // Update local state
      set((state) => ({
        company: { ...state.company, signature: signatureUrl }
      }));

      return signatureUrl;
    } catch (error) {
      console.error('Failed to upload signature:', error);
      throw error;
    }
  },
}));
