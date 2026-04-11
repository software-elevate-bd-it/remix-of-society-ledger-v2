import { useState } from 'react';
import { Link } from 'react-router-dom';
import StatsCard from '@/components/shared/StatsCard';
import DataTable, { Column } from '@/components/shared/DataTable';
import ActivityLog from '@/components/shared/ActivityLog';
import { members, transactions, bankAccounts, Transaction } from '@/data/dummyData';
import { Users, Wallet, Receipt, Landmark, ArrowUpRight, Plus, FileText, CreditCard, UserPlus, TrendingUp, Clock, Banknote } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

const quickLinks = [
  { label: 'Add Member', icon: UserPlus, path: '/members', color: 'bg-blue-500/10 text-blue-600' },
  { label: 'Collect Payment', icon: Wallet, path: '/collections', color: 'bg-green-500/10 text-green-600' },
  { label: 'Add Expense', icon: Receipt, path: '/expenses', color: 'bg-orange-500/10 text-orange-600' },
  { label: 'View Reports', icon: FileText, path: '/reports', color: 'bg-purple-500/10 text-purple-600' },
  { label: 'Bank Deposit', icon: Landmark, path: '/bank-accounts', color: 'bg-cyan-500/10 text-cyan-600' },
  { label: 'Send SMS', icon: CreditCard, path: '/sms', color: 'bg-pink-500/10 text-pink-600' },
];

export default function MainUserDashboard() {
  const user = useAuthStore((s) => s.user);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const totalCollection = transactions.filter(t => t.type === 'collection' && t.status === 'approved').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense' && t.status === 'approved').reduce((s, t) => s + t.amount, 0);
  const totalBank = bankAccounts.reduce((s, b) => s + b.balance, 0);
  const todayCollection = transactions.filter(t => t.type === 'collection' && t.status === 'approved' && t.date === '2024-12-15').reduce((s, t) => s + t.amount, 0);
  const pendingDue = members.reduce((s, m) => s + m.totalDue, 0);

  let filteredTx = [...transactions];
  if (filterStatus !== 'all') filteredTx = filteredTx.filter(t => t.status === filterStatus);
  if (filterType !== 'all') filteredTx = filteredTx.filter(t => t.type === filterType);
  if (dateFrom) filteredTx = filteredTx.filter(t => t.date >= dateFrom);
  if (dateTo) filteredTx = filteredTx.filter(t => t.date <= dateTo);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">{user?.someiteeName || 'Dashboard'}</h1>
        <p className="text-muted-foreground">Welcome back, {user?.name}</p>
      </div>

      {/* Stat Widgets */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatsCard title="Total Members" value={members.length} icon={Users} change="+2 new" changeType="positive" />
        <StatsCard title="Monthly Collection" value={`৳${totalCollection.toLocaleString()}`} icon={Wallet} change="+12%" changeType="positive" />
        <StatsCard title="Total Expense" value={`৳${totalExpense.toLocaleString()}`} icon={Receipt} />
        <StatsCard title="Today Collection" value={`৳${todayCollection.toLocaleString()}`} icon={TrendingUp} changeType="positive" />
        <StatsCard title="Pending Due" value={`৳${pendingDue.toLocaleString()}`} icon={Clock} changeType="negative" />
        <StatsCard title="Bank Balance" value={`৳${totalBank.toLocaleString()}`} icon={Landmark} />
      </div>

      {/* Quick Links */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="font-heading text-base">Quick Actions</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {quickLinks.map(link => (
              <Link key={link.label} to={link.path}>
                <Button variant="ghost" className="w-full h-auto flex flex-col gap-1.5 py-3 hover:bg-accent">
                  <div className={`p-2 rounded-lg ${link.color}`}><link.icon className="h-4 w-4" /></div>
                  <span className="text-xs font-medium">{link.label}</span>
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Report Search Panel */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="font-heading text-base">Advanced Search & Filters</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <div className="space-y-1">
              <Label className="text-xs">Date From</Label>
              <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="h-8 text-xs" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Date To</Label>
              <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="h-8 text-xs" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Type</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="collection">Collection</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <Card className="bg-muted/50"><CardContent className="p-3"><p className="text-xs text-muted-foreground">Total Found</p><p className="text-lg font-heading font-bold">{filteredTx.length}</p></CardContent></Card>
            <Card className="bg-muted/50"><CardContent className="p-3"><p className="text-xs text-muted-foreground">Total Amount</p><p className="text-lg font-heading font-bold">৳{filteredTx.reduce((s, t) => s + t.amount, 0).toLocaleString()}</p></CardContent></Card>
            <Card className="bg-muted/50"><CardContent className="p-3"><p className="text-xs text-muted-foreground">Collections</p><p className="text-lg font-heading font-bold">{filteredTx.filter(t => t.type === 'collection').length}</p></CardContent></Card>
            <Card className="bg-muted/50"><CardContent className="p-3"><p className="text-xs text-muted-foreground">Expenses</p><p className="text-lg font-heading font-bold">{filteredTx.filter(t => t.type === 'expense').length}</p></CardContent></Card>
          </div>
          <DataTable data={filteredTx} columns={recentTxColumns} searchKey="memberName" />
        </CardContent>
      </Card>

      {/* Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="font-heading text-base">Recent Transactions</CardTitle></CardHeader>
          <CardContent>
            <DataTable data={transactions.slice(0, 5)} columns={recentTxColumns} searchKey="memberName" />
          </CardContent>
        </Card>
        <ActivityLog />
      </div>
    </div>
  );
}
