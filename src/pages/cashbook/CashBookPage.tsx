import DataTable, { Column } from '@/components/shared/DataTable';
import { Card, CardContent } from '@/components/ui/card';
import StatsCard from '@/components/shared/StatsCard';
import { ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';

interface CashEntry {
  id: string;
  date: string;
  description: string;
  type: 'in' | 'out';
  amount: number;
  balance: number;
}

const cashEntries: CashEntry[] = [
  { id: '1', date: '2024-12-01', description: 'Monthly collection - Karim Mia', type: 'in', amount: 500, balance: 15500 },
  { id: '2', date: '2024-12-01', description: 'Monthly collection - Jamal', type: 'in', amount: 500, balance: 16000 },
  { id: '3', date: '2024-12-02', description: 'Cleaning supplies', type: 'out', amount: 800, balance: 15200 },
  { id: '4', date: '2024-12-03', description: 'Late fee - Karim Mia', type: 'in', amount: 100, balance: 15300 },
  { id: '5', date: '2024-12-05', description: 'Maintenance payment', type: 'out', amount: 2000, balance: 13300 },
];

const columns: Column<CashEntry>[] = [
  { key: 'date', label: 'Date', sortable: true },
  { key: 'description', label: 'Description' },
  { key: 'type', label: 'Type', render: (e) => e.type === 'in' ? <span className="text-success font-medium flex items-center gap-1"><ArrowUpRight className="h-3 w-3" /> In</span> : <span className="text-destructive font-medium flex items-center gap-1"><ArrowDownRight className="h-3 w-3" /> Out</span> },
  { key: 'amount', label: 'Amount', render: (e) => `৳${e.amount.toLocaleString()}` },
  { key: 'balance', label: 'Balance', render: (e) => `৳${e.balance.toLocaleString()}` },
];

export default function CashBookPage() {
  const totalIn = cashEntries.filter(e => e.type === 'in').reduce((s, e) => s + e.amount, 0);
  const totalOut = cashEntries.filter(e => e.type === 'out').reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-heading font-bold">Cash Book</h1><p className="text-muted-foreground">Daily cash flow tracking</p></div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard title="Cash In" value={`৳${totalIn.toLocaleString()}`} icon={ArrowUpRight} changeType="positive" />
        <StatsCard title="Cash Out" value={`৳${totalOut.toLocaleString()}`} icon={ArrowDownRight} changeType="negative" />
        <StatsCard title="Balance" value={`৳${(totalIn - totalOut).toLocaleString()}`} icon={Wallet} />
      </div>
      <Card><CardContent className="pt-6"><DataTable data={cashEntries} columns={columns} searchKey="description" /></CardContent></Card>
    </div>
  );
}
