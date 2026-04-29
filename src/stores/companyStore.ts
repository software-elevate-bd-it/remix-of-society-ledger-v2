import { create } from 'zustand';
import { apiClient, type CompanySettings } from '@/lib/api';
import leader1 from '@/assets/leader-1.jpg';
import leader2 from '@/assets/leader-2.jpg';
import leader3 from '@/assets/leader-3.jpg';
import leader4 from '@/assets/leader-4.jpg';
import leader5 from '@/assets/leader-5.jpg';

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
    founders: [
      { name: 'Md. Abdul Karim', title: 'Founder', photo: leader1 },
      { name: 'Hasan Mahmud', title: 'Founder', photo: leader2 },
      { name: 'Dr. Imran Hossain', title: 'Founder', photo: leader3 },
      { name: 'Rafiqul Islam', title: 'President', photo: leader4 },
      { name: 'Shahidul Alam', title: 'Secretary', photo: leader5 },
    ],
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
