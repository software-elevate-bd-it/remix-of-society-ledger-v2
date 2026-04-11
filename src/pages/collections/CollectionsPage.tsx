import { useState } from 'react';
import DataTable, { Column } from '@/components/shared/DataTable';
import { transactions, members, Transaction } from '@/data/dummyData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Wallet } from 'lucide-react';
import { toast } from 'sonner';

const columns: Column<Transaction>[] = [
  { key: 'memberName', label: 'Member', sortable: true },
  { key: 'category', label: 'Category' },
  { key: 'amount', label: 'Amount', render: (t) => `৳${t.amount.toLocaleString()}`, sortable: true },
  { key: 'method', label: 'Method', render: (t) => <span className="capitalize">{t.method}</span> },
  { key: 'status', label: 'Status', render: (t) => (
    <Badge variant={t.status === 'approved' ? 'default' : t.status === 'pending' ? 'secondary' : 'destructive'}>{t.status}</Badge>
  )},
  { key: 'date', label: 'Date', sortable: true },
];

export default function CollectionsPage() {
  const collections = transactions.filter(t => t.type === 'collection');
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Collections</h1>
          <p className="text-muted-foreground">Manage monthly fees and payments</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" /> Record Collection</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-heading">Record Payment</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); setOpen(false); toast.success('Collection recorded'); }} className="space-y-4">
              <div className="space-y-1">
                <Label>Member</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select member" /></SelectTrigger>
                  <SelectContent>{members.map(m => <SelectItem key={m.id} value={m.id}>{m.name} - {m.shopName}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><Label>Amount</Label><Input type="number" defaultValue={500} /></div>
                <div className="space-y-1">
                  <Label>Method</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Cash" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="bkash">bKash</SelectItem>
                      <SelectItem value="nagad">Nagad</SelectItem>
                      <SelectItem value="bank">Bank</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1"><Label>Category</Label>
                <Select><SelectTrigger><SelectValue placeholder="Monthly Fee" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly Fee</SelectItem>
                    <SelectItem value="late">Late Fee</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label>Transaction ID (for mobile banking)</Label><Input placeholder="Optional" /></div>
              <Button type="submit" className="w-full"><Wallet className="h-4 w-4 mr-2" /> Save Collection</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-6">
          <DataTable data={collections} columns={columns} searchKey="memberName" />
        </CardContent>
      </Card>
    </div>
  );
}
