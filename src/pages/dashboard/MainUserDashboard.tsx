import StatsCard from '@/components/shared/StatsCard';
import DataTable, { Column } from '@/components/shared/DataTable';
import { members, transactions, bankAccounts, Member, Transaction } from '@/data/dummyData';
import { Users, Wallet, Receipt, Landmark, ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/stores/authStore';

const recentTxColumns: Column<Transaction>[] = [
  { key: 'memberName', label: 'Member' },
  { key: 'type', label: 'Type', render: (t) => <Badge variant={t.type === 'collection' ? 'default' : 'secondary'}>{t.type}</Badge> },
  { key: 'amount', label: 'Amount', render: (t) => `৳${t.amount.toLocaleString()}` },
  { key: 'method', label: 'Method', render: (t) => <span className="capitalize">{t.method}</span> },
  { key: 'status', label: 'Status', render: (t) => (
    <Badge variant={t.status === 'approved' ? 'default' : t.status === 'pending' ? 'secondary' : 'destructive'}>{t.status}</Badge>
  )},
  { key: 'date', label: 'Date' },
];

export default function MainUserDashboard() {
  const user = useAuthStore((s) => s.user);
  const totalCollection = transactions.filter(t => t.type === 'collection' && t.status === 'approved').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense' && t.status === 'approved').reduce((s, t) => s + t.amount, 0);
  const totalBank = bankAccounts.reduce((s, b) => s + b.balance, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">{user?.someiteeName || 'Dashboard'}</h1>
        <p className="text-muted-foreground">Welcome back, {user?.name}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard title="Total Members" value={members.length} icon={Users} change="+2 new" changeType="positive" />
        <StatsCard title="Monthly Collection" value={`৳${totalCollection.toLocaleString()}`} icon={Wallet} change="+12%" changeType="positive" />
        <StatsCard title="Total Expense" value={`৳${totalExpense.toLocaleString()}`} icon={Receipt} />
        <StatsCard title="Bank Balance" value={`৳${totalBank.toLocaleString()}`} icon={Landmark} />
        <StatsCard title="Cash Balance" value="৳15,000" icon={ArrowUpRight} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable data={transactions} columns={recentTxColumns} searchKey="memberName" />
        </CardContent>
      </Card>
    </div>
  );
}
