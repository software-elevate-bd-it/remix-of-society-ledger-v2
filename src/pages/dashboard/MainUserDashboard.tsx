import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import StatsCard from '@/components/shared/StatsCard';
import DataTable, { Column } from '@/components/shared/DataTable';
import ActivityLog from '@/components/shared/ActivityLog';
import { useDashboardStore } from '@/stores/dashboardStore';
import { Users, Wallet, Receipt, Landmark, Plus, FileText, CreditCard, UserPlus, TrendingUp, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuthStore } from '@/stores/authStore';
import { useCompanyStore } from '@/stores/companyStore';

interface Transaction {
  id: string;
  memberName: string;
  type: string;
  amount: number;
  method: string;
  status: string;
  date: string;
}

export default function MainUserDashboard() {
  const user = useAuthStore((s) => s.user);
  const { company } = useCompanyStore();
  const { t } = useTranslation();
  const { stats, isLoading, loadStats } = useDashboardStore();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const recentTxColumns: Column<Transaction>[] = [
    { key: 'memberName', label: t('nav.members') },
    { key: 'type', label: t('common.type'), render: (tx) => <Badge variant={tx.type === 'collection' ? 'default' : 'secondary'}>{tx.type}</Badge> },
    { key: 'amount', label: t('common.amount'), render: (tx) => `৳${tx.amount.toLocaleString()}` },
    { key: 'method', label: t('common.method'), render: (tx) => <span className="capitalize">{tx.method}</span> },
    { key: 'status', label: t('common.status'), render: (tx) => (
      <Badge variant={tx.status === 'approved' ? 'default' : tx.status === 'pending' ? 'secondary' : 'destructive'}>{tx.status}</Badge>
    )},
    { key: 'date', label: t('common.date') },
  ];

  // Use real stats from API
  const totalCollection = stats.monthlyIncome;
  const totalExpense = stats.monthlyExpense;
  const totalBank = stats.totalBankBalance;
  const todayCollection = stats.todayCollection;
  const pendingDue = stats.pendingDue;

  // For now, use empty array for recent transactions until we implement the API
  const filteredTx: Transaction[] = stats.recentTransactions || [];
  if (filterStatus !== 'all') filteredTx.filter(t => t.status === filterStatus);
  if (filterType !== 'all') filteredTx.filter(t => t.type === filterType);
  if (dateFrom) filteredTx.filter(t => t.date >= dateFrom);
  if (dateTo) filteredTx.filter(t => t.date <= dateTo);

  const quickLinks = [
    { label: t('dashboard.addMember'), icon: UserPlus, path: '/members', color: 'bg-blue-500/10 text-blue-600' },
    { label: t('dashboard.collectPayment'), icon: Wallet, path: '/collections', color: 'bg-green-500/10 text-green-600' },
    { label: t('dashboard.addExpense'), icon: Receipt, path: '/expenses', color: 'bg-orange-500/10 text-orange-600' },
    { label: t('dashboard.viewReports'), icon: FileText, path: '/reports', color: 'bg-purple-500/10 text-purple-600' },
    { label: t('dashboard.bankDeposit'), icon: Landmark, path: '/bank-accounts', color: 'bg-cyan-500/10 text-cyan-600' },
    { label: t('dashboard.sendSMS'), icon: CreditCard, path: '/sms', color: 'bg-pink-500/10 text-pink-600' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">{user?.somiteeName || t('common.dashboard')}</h1>
        <p className="text-muted-foreground">{t('common.welcome')}, {user?.name}</p>
      </div>

      {/* Founders Section */}
      {company.founders && company.founders.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="font-heading text-base text-center">{t('dashboard.ourLeadership') || 'Our Leadership'}</CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const founderItem = company.founders.find(f => /founder/i.test(f.title)) || company.founders[1] || company.founders[0];
              const president = company.founders.find(f => /president/i.test(f.title)) || company.founders[0];
              const secretary = company.founders.find(f => /secretary/i.test(f.title)) || company.founders[2];
              const renderPerson = (p: typeof founderItem, size: 'lg' | 'md' = 'md') => (
                <div className="flex flex-col items-center text-center gap-2">
                  <Avatar className={size === 'lg' ? 'h-28 w-28 ring-4 ring-primary/20' : 'h-20 w-20 ring-2 ring-border'}>
                    {p?.photo ? <AvatarImage src={p.photo} alt={p.name} /> : null}
                    <AvatarFallback className="bg-primary/10 text-primary font-heading text-lg">
                      {p?.name?.charAt(0) || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className={`font-heading font-semibold ${size === 'lg' ? 'text-base' : 'text-sm'}`}>{p?.name}</p>
                    <p className="text-xs text-muted-foreground">{p?.title}</p>
                  </div>
                </div>
              );
              return (
                <div className="flex flex-col items-center gap-6">
                  {founderItem && renderPerson(founderItem, 'lg')}
                  <div className="grid grid-cols-2 gap-12 w-full max-w-md">
                    {president && renderPerson(president)}
                    {secretary && renderPerson(secretary)}
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatsCard title={t('dashboard.totalMembers')} value={stats.totalMembers} icon={Users} change="+2 new" changeType="positive" />
        <StatsCard title={t('dashboard.monthlyCollection')} value={`৳${totalCollection.toLocaleString()}`} icon={Wallet} change="+12%" changeType="positive" />
        <StatsCard title={t('dashboard.totalExpense')} value={`৳${totalExpense.toLocaleString()}`} icon={Receipt} />
        <StatsCard title={t('dashboard.todayCollection')} value={`৳${todayCollection.toLocaleString()}`} icon={TrendingUp} changeType="positive" />
        <StatsCard title={t('dashboard.pendingDue')} value={`৳${pendingDue.toLocaleString()}`} icon={Clock} changeType="negative" />
        <StatsCard title={t('dashboard.bankBalance')} value={`৳${totalBank.toLocaleString()}`} icon={Landmark} />
      </div>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="font-heading text-base">{t('dashboard.quickActions')}</CardTitle></CardHeader>
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

      <Card>
        <CardHeader className="pb-3"><CardTitle className="font-heading text-base">{t('dashboard.advancedSearch')}</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <div className="space-y-1">
              <Label className="text-xs">{t('dashboard.dateFrom')}</Label>
              <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="h-8 text-xs" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">{t('dashboard.dateTo')}</Label>
              <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="h-8 text-xs" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">{t('common.type')}</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('common.all')}</SelectItem>
                  <SelectItem value="collection">{t('nav.collections')}</SelectItem>
                  <SelectItem value="expense">{t('nav.expenses')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">{t('common.status')}</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('common.all')}</SelectItem>
                  <SelectItem value="approved">{t('common.approved')}</SelectItem>
                  <SelectItem value="pending">{t('common.pending')}</SelectItem>
                  <SelectItem value="rejected">{t('common.rejected')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <Card className="bg-muted/50"><CardContent className="p-3"><p className="text-xs text-muted-foreground">{t('dashboard.totalFound')}</p><p className="text-lg font-heading font-bold">{filteredTx.length}</p></CardContent></Card>
            <Card className="bg-muted/50"><CardContent className="p-3"><p className="text-xs text-muted-foreground">{t('dashboard.totalAmount')}</p><p className="text-lg font-heading font-bold">৳{filteredTx.reduce((s, t) => s + t.amount, 0).toLocaleString()}</p></CardContent></Card>
            <Card className="bg-muted/50"><CardContent className="p-3"><p className="text-xs text-muted-foreground">{t('nav.collections')}</p><p className="text-lg font-heading font-bold">{filteredTx.filter(t => t.type === 'collection').length}</p></CardContent></Card>
            <Card className="bg-muted/50"><CardContent className="p-3"><p className="text-xs text-muted-foreground">{t('nav.expenses')}</p><p className="text-lg font-heading font-bold">{filteredTx.filter(t => t.type === 'expense').length}</p></CardContent></Card>
          </div>
          <DataTable data={filteredTx} columns={recentTxColumns} searchKey="memberName" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="font-heading text-base">{t('dashboard.recentTransactions')}</CardTitle></CardHeader>
          <CardContent>
            <DataTable data={filteredTx.slice(0, 5)} columns={recentTxColumns} searchKey="memberName" />
          </CardContent>
        </Card>
        <ActivityLog />
      </div>
    </div>
  );
}
