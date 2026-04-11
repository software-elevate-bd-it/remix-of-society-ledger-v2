export interface Member {
  id: string;
  name: string;
  shopName: string;
  phone: string;
  address: string;
  nid?: string;
  photo?: string;
  status: 'active' | 'inactive';
  somiteeId: string;
  joinDate: string;
  monthlyFee: number;
  totalDue: number;
  totalPaid: number;
}

export interface Transaction {
  id: string;
  memberId: string;
  memberName: string;
  type: 'collection' | 'expense';
  amount: number;
  date: string;
  category: string;
  method: 'cash' | 'bkash' | 'nagad' | 'bank' | 'sslcommerz';
  status: 'pending' | 'approved' | 'rejected';
  note?: string;
  transactionId?: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  balance: number;
  somiteeId: string;
}

export interface Somitee {
  id: string;
  name: string;
  managerName: string;
  email: string;
  phone: string;
  totalMembers: number;
  status: 'active' | 'blocked';
  plan: 'free' | 'basic' | 'premium';
  createdAt: string;
}

export const members: Member[] = [
  { id: 'm1', name: 'Karim Mia', shopName: 'Karim Electronics', phone: '01712345678', address: 'Shop 12, Banani Market', nid: '1234567890', status: 'active', somiteeId: 's1', joinDate: '2024-01-15', monthlyFee: 500, totalDue: 1000, totalPaid: 5000 },
  { id: 'm2', name: 'Jamal Hossain', shopName: 'Jamal Clothing', phone: '01812345678', address: 'Shop 15, Banani Market', status: 'active', somiteeId: 's1', joinDate: '2024-02-10', monthlyFee: 500, totalDue: 500, totalPaid: 4500 },
  { id: 'm3', name: 'Rina Begum', shopName: 'Rina Cosmetics', phone: '01912345678', address: 'Shop 8, Banani Market', nid: '9876543210', status: 'active', somiteeId: 's1', joinDate: '2024-01-20', monthlyFee: 500, totalDue: 0, totalPaid: 6000 },
  { id: 'm4', name: 'Salam Mia', shopName: 'Salam Tea Stall', phone: '01612345678', address: 'Shop 3, Banani Market', status: 'inactive', somiteeId: 's1', joinDate: '2024-03-01', monthlyFee: 300, totalDue: 1500, totalPaid: 1200 },
  { id: 'm5', name: 'Fatema Khatun', shopName: 'Fatema Tailors', phone: '01512345678', address: 'Shop 22, Banani Market', status: 'active', somiteeId: 's1', joinDate: '2024-01-05', monthlyFee: 500, totalDue: 0, totalPaid: 6000 },
];

export const transactions: Transaction[] = [
  { id: 't1', memberId: 'm1', memberName: 'Karim Mia', type: 'collection', amount: 500, date: '2024-12-01', category: 'Monthly Fee', method: 'cash', status: 'approved' },
  { id: 't2', memberId: 'm2', memberName: 'Jamal Hossain', type: 'collection', amount: 500, date: '2024-12-01', category: 'Monthly Fee', method: 'bkash', status: 'approved', transactionId: 'BK12345' },
  { id: 't3', memberId: 'm3', memberName: 'Rina Begum', type: 'collection', amount: 500, date: '2024-12-02', category: 'Monthly Fee', method: 'nagad', status: 'pending', transactionId: 'NG67890' },
  { id: 't4', memberId: 'm1', memberName: 'Karim Mia', type: 'collection', amount: 100, date: '2024-12-03', category: 'Late Fee', method: 'cash', status: 'approved' },
  { id: 't5', memberId: '', memberName: '', type: 'expense', amount: 2000, date: '2024-12-05', category: 'Maintenance', method: 'bank', status: 'approved', note: 'Market cleaning' },
  { id: 't6', memberId: '', memberName: '', type: 'expense', amount: 5000, date: '2024-12-10', category: 'Electricity', method: 'bank', status: 'approved', note: 'Monthly electricity bill' },
  { id: 't7', memberId: 'm4', memberName: 'Salam Mia', type: 'collection', amount: 300, date: '2024-12-15', category: 'Monthly Fee', method: 'cash', status: 'rejected', note: 'Incorrect amount' },
];

export const bankAccounts: BankAccount[] = [
  { id: 'b1', bankName: 'Sonali Bank', accountNumber: '1234-5678-9012', balance: 150000, somiteeId: 's1' },
  { id: 'b2', bankName: 'Islami Bank', accountNumber: '9876-5432-1098', balance: 85000, somiteeId: 's1' },
];

export const somitees: Somitee[] = [
  { id: 's1', name: 'Banani Market Somitee', managerName: 'Rahim Uddin', email: 'rahim@banani.com', phone: '01711111111', totalMembers: 45, status: 'active', plan: 'premium', createdAt: '2024-01-01' },
  { id: 's2', name: 'Gulshan Plaza Somitee', managerName: 'Selim Khan', email: 'selim@gulshan.com', phone: '01722222222', totalMembers: 32, status: 'active', plan: 'basic', createdAt: '2024-02-15' },
  { id: 's3', name: 'Dhanmondi Market Somitee', managerName: 'Nasir Ahmed', email: 'nasir@dhan.com', phone: '01733333333', totalMembers: 28, status: 'blocked', plan: 'free', createdAt: '2024-03-10' },
  { id: 's4', name: 'Mirpur Shopping Complex', managerName: 'Habib Rahman', email: 'habib@mirpur.com', phone: '01744444444', totalMembers: 60, status: 'active', plan: 'premium', createdAt: '2024-01-20' },
];

export const expenseCategories = ['Maintenance', 'Electricity', 'Water', 'Security', 'Cleaning', 'Repair', 'Office Supplies', 'Transport', 'Other'];
