import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DataTable, { Column } from '@/components/shared/DataTable';
import HelpModal from '@/components/shared/HelpModal';
import { transactions, members, bankAccounts, Transaction } from '@/data/dummyData';
import { FileText, Download, Users, Wallet, Receipt, BarChart3, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from 'sonner';

const txColumns: Column<Transaction>[] = [
  { key: 'date', label: 'Date', sortable: true },
  { key: 'memberName', label: 'Member' },
  { key: 'type', label: 'Type' },
  { key: 'category', label: 'Category' },
  { key: 'amount', label: 'Amount', render: (t) => `৳${t.amount.toLocaleString()}` },
  { key: 'method', label: 'Method' },
  { key: 'status', label: 'Status' },
];

export default function ReportsPage() {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const totalIncome = transactions.filter(t => t.type === 'collection' && t.status === 'approved').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense' && t.status === 'approved').reduce((s, t) => s + t.amount, 0);
  const totalDue = members.reduce((s, m) => s + m.totalDue, 0);
  const totalBank = bankAccounts.reduce((s, b) => s + b.balance, 0);

  let filtered = [...transactions];
  if (filterType !== 'all') filtered = filtered.filter(t => t.type === filterType);
  if (filterCategory !== 'all') filtered = filtered.filter(t => t.category === filterCategory);
  if (dateFrom) filtered = filtered.filter(t => t.date >= dateFrom);
  if (dateTo) filtered = filtered.filter(t => t.date <= dateTo);

  const handleExport = (format: string) => toast.success(`Report exported as ${format}. Logo, company name, and signature area included.`);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div><h1 className="text-2xl font-heading font-bold">Reports</h1><p className="text-muted-foreground">Generate and export detailed reports</p></div>
          <HelpModal title="Reports" description="Generate comprehensive financial reports with filters and exports." steps={['Select report type from tabs', 'Apply date and category filters', 'View summary cards and data table', 'Export as PDF, CSV, or Excel', 'PDF includes company logo, name, and signature area']} />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleExport('PDF')}><Download className="h-3 w-3 mr-1" /> PDF</Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('CSV')}><Download className="h-3 w-3 mr-1" /> CSV</Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('Excel')}><Download className="h-3 w-3 mr-1" /> Excel</Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-500/10"><TrendingUp className="h-5 w-5 text-green-600" /></div>
          <div><p className="text-xs text-muted-foreground">Total Income</p><p className="text-xl font-heading font-bold">৳{totalIncome.toLocaleString()}</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-500/10"><TrendingDown className="h-5 w-5 text-red-600" /></div>
          <div><p className="text-xs text-muted-foreground">Total Expense</p><p className="text-xl font-heading font-bold">৳{totalExpense.toLocaleString()}</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-500/10"><Users className="h-5 w-5 text-orange-600" /></div>
          <div><p className="text-xs text-muted-foreground">Total Due</p><p className="text-xl font-heading font-bold">৳{totalDue.toLocaleString()}</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10"><Wallet className="h-5 w-5 text-blue-600" /></div>
          <div><p className="text-xs text-muted-foreground">Net Profit</p><p className="text-xl font-heading font-bold">৳{(totalIncome - totalExpense).toLocaleString()}</p></div>
        </CardContent></Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <div className="space-y-1"><Label className="text-xs">Date From</Label><Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Date To</Label><Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Type</Label>
              <Select value={filterType} onValueChange={setFilterType}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="collection">Collection</SelectItem><SelectItem value="expense">Expense</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label className="text-xs">Category</Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="Monthly Fee">Monthly Fee</SelectItem><SelectItem value="Late Fee">Late Fee</SelectItem><SelectItem value="Maintenance">Maintenance</SelectItem><SelectItem value="Electricity">Electricity</SelectItem></SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Tabs */}
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="income-expense">
            <TabsList className="flex-wrap">
              <TabsTrigger value="income-expense">Income vs Expense</TabsTrigger>
              <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
              <TabsTrigger value="due">Member Due</TabsTrigger>
              <TabsTrigger value="bank-cash">Bank vs Cash</TabsTrigger>
            </TabsList>
            <TabsContent value="income-expense">
              <DataTable data={filtered} columns={txColumns} searchKey="memberName" />
            </TabsContent>
            <TabsContent value="cashflow">
              <DataTable data={filtered} columns={txColumns} searchKey="memberName" />
            </TabsContent>
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
                <Card className="bg-muted/50"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Bank Balance</p><p className="text-2xl font-heading font-bold">৳{totalBank.toLocaleString()}</p></CardContent></Card>
                <Card className="bg-muted/50"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Cash in Hand</p><p className="text-2xl font-heading font-bold">৳15,000</p></CardContent></Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
