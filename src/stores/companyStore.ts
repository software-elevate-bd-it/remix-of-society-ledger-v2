import { create } from 'zustand';

export interface CompanySettings {
  name: string;
  logo: string;
  address: string;
  phone: string;
  email: string;
  signature: string;
}

interface CompanyState {
  company: CompanySettings;
  updateCompany: (data: Partial<CompanySettings>) => void;
}

export const useCompanyStore = create<CompanyState>((set) => ({
  company: {
    name: 'বৃহত্তর মুরাদপুর ব্যবসায়ী সমিতি',
    logo: '',
    address: 'মুরাদপুর, চট্টগ্রাম',
    phone: '01711111111',
    email: 'info@bananimarket.com',
    signature: '',
  },
  updateCompany: (data) => set((state) => ({ company: { ...state.company, ...data } })),
}));
