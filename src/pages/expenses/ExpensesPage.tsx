import { useState } from 'react';
import DataTable, { Column } from '@/components/shared/DataTable';
import { transactions, expenseCategories, Transaction } from '@/data/dummyData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Receipt } from 'lucide-react';
import { toast } from 'sonner';

const columns: Column<Transaction>[] = [
  { key: 'category', label: 'Category', sortable: true },
  { key: 'amount', label: 'Amount', render: (t) => `৳${t.amount.toLocaleString()}`, sortable: true },
  { key: 'method', label: 'Method', render: (t) => <span className="capitalize">{t.method}</span> },
  { key: 'note', label: 'Note' },
  { key: 'date', label: 'Date', sortable: true },
];

export default function ExpensesPage() {
  const expenses = transactions.filter(t => t.type === 'expense');
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-heading font-bold">Expenses</h1><p className="text-muted-foreground">Track all somitee expenses</p></div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" /> Add Expense</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-heading">Record Expense</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); setOpen(false); toast.success('Expense recorded'); }} className="space-y-4">
              <div className="space-y-1"><Label>Category</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>{expenseCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><Label>Amount</Label><Input type="number" required /></div>
                <div className="space-y-1"><Label>Date</Label><Input type="date" required /></div>
              </div>
              <div className="space-y-1"><Label>Note</Label><Textarea placeholder="Description..." /></div>
              <Button type="submit" className="w-full"><Receipt className="h-4 w-4 mr-2" /> Save Expense</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Card><CardContent className="pt-6"><DataTable data={expenses} columns={columns} searchKey="category" /></CardContent></Card>
    </div>
  );
}
