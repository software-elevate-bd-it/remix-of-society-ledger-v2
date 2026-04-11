import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DataTable, { Column } from '@/components/shared/DataTable';
import HelpModal from '@/components/shared/HelpModal';
import { transactions, members, bankAccounts, Transaction } from '@/data/dummyData';
import { Download, Users, Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from 'sonner';

export default function ReportsPage() {
  const { t } = useTranslation();
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const txColumns: Column<Transaction>[] = [
    { key: 'date', label: t('common.date'), sortable: true },
    { key: 'memberName', label: t('nav.members') },
    { key: 'type', label: t('common.type') },
    { key: 'category', label: t('common.category') },
    { key: 'amount', label: t('common.amount'), render: (tx) => `৳${tx.amount.toLocaleString()}` },
    { key: 'method', label: t('common.method') },
    { key: 'status', label: t('common.status') },
  ];

  const totalIncome = transactions.filter(t => t.type === 'collection' && t.status === 'approved').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense' && t.status === 'approved').reduce((s, t) => s + t.amount, 0);
  const totalDue = members.reduce((s, m) => s + m.totalDue, 0);
  const totalBank = bankAccounts.reduce((s, b) => s + b.balance, 0);

  let filtered = [...transactions];
  if (filterType !== 'all') filtered = filtered.filter(t => t.type === filterType);
  if (filterCategory !== 'all') filtered = filtered.filter(t => t.category === filterCategory);
  if (dateFrom) filtered = filtered.filter(t => t.date >= dateFrom);
  if (dateTo) filtered = filtered.filter(t => t.date <= dateTo);

  const handleExport = (format: string) => toast.success(t('reports.exportedAs', { format }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div><h1 className="text-2xl font-heading font-bold">{t('reports.title')}</h1><p className="text-muted-foreground">{t('reports.subtitle')}</p></div>
          <HelpModal title={t('reports.helpTitle')} description={t('reports.helpDesc')} steps={[t('reports.helpStep1'), t('reports.helpStep2'), t('reports.helpStep3'), t('reports.helpStep4'), t('reports.helpStep5')]} />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleExport('PDF')}><Download className="h-3 w-3 mr-1" /> PDF</Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('CSV')}><Download className="h-3 w-3 mr-1" /> CSV</Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('Excel')}><Download className="h-3 w-3 mr-1" /> Excel</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-500/10"><TrendingUp className="h-5 w-5 text-green-600" /></div>
          <div><p className="text-xs text-muted-foreground">{t('reports.totalIncome')}</p><p className="text-xl font-heading font-bold">৳{totalIncome.toLocaleString()}</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-500/10"><TrendingDown className="h-5 w-5 text-red-600" /></div>
          <div><p className="text-xs text-muted-foreground">{t('reports.totalExpense')}</p><p className="text-xl font-heading font-bold">৳{totalExpense.toLocaleString()}</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-500/10"><Users className="h-5 w-5 text-orange-600" /></div>
          <div><p className="text-xs text-muted-foreground">{t('reports.totalDue')}</p><p className="text-xl font-heading font-bold">৳{totalDue.toLocaleString()}</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10"><Wallet className="h-5 w-5 text-blue-600" /></div>
          <div><p className="text-xs text-muted-foreground">{t('reports.netProfit')}</p><p className="text-xl font-heading font-bold">৳{(totalIncome - totalExpense).toLocaleString()}</p></div>
        </CardContent></Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <div className="space-y-1"><Label className="text-xs">{t('dashboard.dateFrom')}</Label><Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">{t('dashboard.dateTo')}</Label><Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">{t('common.type')}</Label>
              <Select value={filterType} onValueChange={setFilterType}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="all">{t('common.all')}</SelectItem><SelectItem value="collection">{t('nav.collections')}</SelectItem><SelectItem value="expense">{t('nav.expenses')}</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label className="text-xs">{t('common.category')}</Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="all">{t('common.all')}</SelectItem><SelectItem value="Monthly Fee">{t('members.monthlyFee')}</SelectItem><SelectItem value="Late Fee">{t('collections.lateFee')}</SelectItem><SelectItem value="Maintenance">Maintenance</SelectItem><SelectItem value="Electricity">Electricity</SelectItem></SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="income-expense">
            <TabsList className="flex-wrap">
              <TabsTrigger value="income-expense">{t('reports.incomeVsExpense')}</TabsTrigger>
              <TabsTrigger value="cashflow">{t('reports.cashFlow')}</TabsTrigger>
              <TabsTrigger value="due">{t('reports.memberDue')}</TabsTrigger>
              <TabsTrigger value="bank-cash">{t('reports.bankVsCash')}</TabsTrigger>
            </TabsList>
            <TabsContent value="income-expense"><DataTable data={filtered} columns={txColumns} searchKey="memberName" /></TabsContent>
            <TabsContent value="cashflow"><DataTable data={filtered} columns={txColumns} searchKey="memberName" /></TabsContent>
            <TabsContent value="due">
              <div className="space-y-2">
                {members.filter(m => m.totalDue > 0).map(m => (
                  <div key={m.id} className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                    <div><p className="font-medium text-sm">{m.name}</p><p className="text-xs text-muted-foreground">{m.shopName} • {m.phone}</p></div>
                    <span className="text-destructive font-heading font-bold">৳{m.totalDue.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="bank-cash">
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-muted/50"><CardContent className="p-4"><p className="text-sm text-muted-foreground">{t('reports.totalBankBalance')}</p><p className="text-2xl font-heading font-bold">৳{totalBank.toLocaleString()}</p></CardContent></Card>
                <Card className="bg-muted/50"><CardContent className="p-4"><p className="text-sm text-muted-foreground">{t('reports.cashInHand')}</p><p className="text-2xl font-heading font-bold">৳15,000</p></CardContent></Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
