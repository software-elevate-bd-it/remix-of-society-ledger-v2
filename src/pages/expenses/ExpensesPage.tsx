import { useState, useEffect } from 'react';
import DataTable, { Column } from '@/components/shared/DataTable';
import { useExpensesStore } from '@/stores/expensesStore';
import { useApprovalsStore } from '@/stores/approvalsStore';
import { useAuthStore } from '@/stores/authStore';
import type { ExpenseSchema } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Receipt, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PermissionGuard } from '@/components/shared/PermissionGuard';

const columns: Column<ExpenseSchema>[] = [
  { key: 'category', label: 'Category', sortable: true },
  { key: 'amount', label: 'Amount', render: (t) => `৳${t.amount.toLocaleString()}`, sortable: true },
  { key: 'method', label: 'Method', render: (t) => <span className="capitalize">{t.method}</span> },
  { key: 'note', label: 'Note' },
  { key: 'date', label: 'Date', sortable: true },
  { key: 'status', label: 'Status', render: (t) => <Badge variant={t.status === 'approved' ? 'default' : t.status === 'pending' ? 'secondary' : 'destructive'}>{t.status}</Badge> },
];

export default function ExpensesPage() {
  const { expenses, isLoading, loadExpenses, createExpense, getExpenseCategories } = useExpensesStore();
  const [expenseCategories, setExpenseCategories] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    loadExpenses();
    getExpenseCategories().then(setExpenseCategories);
  }, [loadExpenses, getExpenseCategories]);
  const [form, setForm] = useState({ category: '', amount: '', date: new Date().toISOString().split('T')[0], note: '', method: 'cash' });
  const submit = useApprovalsStore((s) => s.submit);
  const pendingExpenses = useApprovalsStore((s) => s.items.filter(i => i.type === 'expense'));
  const user = useAuthStore((s) => s.user);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category || !form.amount || !user) return toast.error('Fill required fields');
    submit({
      type: 'expense',
      title: form.category,
      amount: Number(form.amount),
      description: form.note || `${form.method} expense on ${form.date}`,
      payload: { ...form, amount: Number(form.amount) },
      createdBy: user.id,
      createdByName: user.name,
    });
    toast.success('Expense submitted for approval', { description: 'Approver will review it shortly.' });
    setForm({ category: '', amount: '', date: new Date().toISOString().split('T')[0], note: '', method: 'cash' });
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-heading font-bold">Expenses</h1><p className="text-muted-foreground">All expenses require approval before being recorded</p></div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <PermissionGuard permission="expense.create" message="You don't have permission to create expenses">
              <Button><Plus className="h-4 w-4 mr-2" /> Add Expense</Button>
            </PermissionGuard>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-heading">Record Expense</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1"><Label>Category *</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>{expenseCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><Label>Amount *</Label><Input type="number" required value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></div>
                <div className="space-y-1"><Label>Date</Label><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
              </div>
              <div className="space-y-1"><Label>Method</Label>
                <Select value={form.method} onValueChange={(v) => setForm({ ...form, method: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="bank">Bank</SelectItem>
                    <SelectItem value="bkash">bKash</SelectItem>
                    <SelectItem value="nagad">Nagad</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label>Note</Label><Textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Description..." /></div>
              <Button type="submit" className="w-full"><Clock className="h-4 w-4 mr-2" /> Submit for Approval</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="approved">
        <TabsList>
          <TabsTrigger value="approved">Recorded ({expenses.length})</TabsTrigger>
          <TabsTrigger value="pending">In Approval ({pendingExpenses.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="approved" className="mt-4">
          <Card><CardContent className="pt-6"><DataTable data={expenses} columns={columns} searchKey="category" /></CardContent></Card>
        </TabsContent>
        <TabsContent value="pending" className="mt-4">
          <Card><CardContent className="pt-6">
            {pendingExpenses.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No expenses awaiting approval</p>
            ) : (
              <div className="space-y-2">
                {pendingExpenses.map((i) => (
                  <div key={i.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <p className="font-medium text-sm">{i.title}</p>
                      <p className="text-xs text-muted-foreground">by {i.createdByName} • {i.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">৳{i.amount?.toLocaleString()}</p>
                      <Badge variant={i.status === 'pending' ? 'secondary' : i.status === 'approved' ? 'default' : 'destructive'} className="text-[10px]">{i.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
