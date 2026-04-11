import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DataTable, { Column } from '@/components/shared/DataTable';
import HelpModal from '@/components/shared/HelpModal';
import { transactions, members, Transaction } from '@/data/dummyData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Plus, Wallet, Link2, Copy } from 'lucide-react';
import { toast } from 'sonner';

const collectionSchema = z.object({
  memberId: z.string().min(1, 'Select a member'),
  amount: z.coerce.number().min(1, 'Amount must be positive'),
  method: z.enum(['cash', 'bkash', 'nagad', 'bank', 'sslcommerz']),
  category: z.string().min(1, 'Select category'),
  transactionId: z.string().optional(),
});

type CollectionFormData = z.infer<typeof collectionSchema>;

const columns: Column<Transaction>[] = [
  { key: 'memberName', label: 'Member', sortable: true },
  { key: 'category', label: 'Category' },
  { key: 'amount', label: 'Amount', render: (t) => `৳${t.amount.toLocaleString()}`, sortable: true },
  { key: 'method', label: 'Method', render: (t) => <span className="capitalize">{t.method}</span> },
  { key: 'status', label: 'Status', render: (t) => (
    <Badge variant={t.status === 'approved' ? 'default' : t.status === 'pending' ? 'secondary' : 'destructive'}>{t.status}</Badge>
  )},
  { key: 'transactionId', label: 'TXN ID', render: (t) => t.transactionId || '-' },
  { key: 'date', label: 'Date', sortable: true },
];

export default function CollectionsPage() {
  const collections = transactions.filter(t => t.type === 'collection');
  const [open, setOpen] = useState(false);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);

  const form = useForm<CollectionFormData>({
    resolver: zodResolver(collectionSchema),
    defaultValues: { memberId: '', amount: 500, method: 'cash', category: 'Monthly Fee', transactionId: '' },
  });

  const method = form.watch('method');

  const handleSubmit = (data: CollectionFormData) => {
    setOpen(false);
    form.reset();
    toast.success('Collection recorded! SMS notification sent.');
  };

  const copyPaymentLink = (link: string) => {
    navigator.clipboard.writeText(`https://somiteehq.com/pay/${link}`);
    toast.success('Payment link copied!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div>
            <h1 className="text-2xl font-heading font-bold">Collections</h1>
            <p className="text-muted-foreground">Manage monthly fees and payments</p>
          </div>
          <HelpModal title="Collections" description="Record and manage all incoming payments from members." steps={['Click Record Collection to add a new payment', 'Select member, amount, and payment method', 'For bKash/Nagad/Bank, enter transaction ID', 'Payment will be marked as Pending until approved', 'Auto SMS is sent on successful recording']} />
        </div>
        <div className="flex gap-2">
          <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
            <DialogTrigger asChild><Button variant="outline"><Link2 className="h-4 w-4 mr-2" /> Payment Links</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle className="font-heading">Member Payment Links</DialogTitle></DialogHeader>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {members.map(m => (
                  <div key={m.id} className="flex items-center justify-between p-2 rounded bg-muted/50">
                    <div><p className="text-sm font-medium">{m.name}</p><p className="text-xs text-muted-foreground">somiteehq.com/pay/{m.paymentLink}</p></div>
                    <Button size="sm" variant="ghost" onClick={() => copyPaymentLink(m.paymentLink || '')}><Copy className="h-3 w-3" /></Button>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" /> Record Collection</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle className="font-heading">Record Payment</DialogTitle></DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  <FormField control={form.control} name="memberId" render={({ field }) => (
                    <FormItem><FormLabel>Member *</FormLabel><FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger><SelectValue placeholder="Select member" /></SelectTrigger>
                        <SelectContent>{members.map(m => <SelectItem key={m.id} value={m.id}>{m.name} - {m.shopName}</SelectItem>)}</SelectContent>
                      </Select>
                    </FormControl><FormMessage /></FormItem>
                  )} />
                  <div className="grid grid-cols-2 gap-3">
                    <FormField control={form.control} name="amount" render={({ field }) => (
                      <FormItem><FormLabel>Amount *</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="method" render={({ field }) => (
                      <FormItem><FormLabel>Method *</FormLabel><FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="bkash">bKash</SelectItem>
                            <SelectItem value="nagad">Nagad</SelectItem>
                            <SelectItem value="bank">Bank Transfer</SelectItem>
                            <SelectItem value="sslcommerz">SSLCommerz</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="category" render={({ field }) => (
                    <FormItem><FormLabel>Category *</FormLabel><FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Monthly Fee">Monthly Fee</SelectItem>
                          <SelectItem value="Late Fee">Late Fee</SelectItem>
                          <SelectItem value="Custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl><FormMessage /></FormItem>
                  )} />
                  {(method === 'bkash' || method === 'nagad' || method === 'bank') && (
                    <FormField control={form.control} name="transactionId" render={({ field }) => (
                      <FormItem><FormLabel>Transaction ID {method === 'bank' ? '(Required)' : '(Optional)'}</FormLabel><FormControl><Input placeholder="Enter transaction ID" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  )}
                  <Button type="submit" className="w-full"><Wallet className="h-4 w-4 mr-2" /> Save Collection</Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <DataTable data={collections} columns={columns} searchKey="memberName" />
        </CardContent>
      </Card>
    </div>
  );
}
