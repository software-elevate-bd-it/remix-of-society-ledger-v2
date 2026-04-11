import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import StatsCard from '@/components/shared/StatsCard';
import DataTable, { Column } from '@/components/shared/DataTable';
import HelpModal from '@/components/shared/HelpModal';
import { bankAccounts, bankTransactions, BankAccount, BankTransaction } from '@/data/dummyData';
import { Landmark, Plus, ArrowDownLeft, ArrowUpRight, ArrowLeftRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const bankSchema = z.object({
  bankName: z.string().min(2, 'Bank name required'),
  accountName: z.string().min(2, 'Account name required'),
  accountNumber: z.string().min(5, 'Account number required'),
  openingBalance: z.coerce.number().min(0),
});

const txSchema = z.object({
  bankAccountId: z.string().min(1, 'Select bank'),
  type: z.enum(['deposit', 'withdraw', 'transfer']),
  amount: z.coerce.number().min(1, 'Amount required'),
  note: z.string().min(1, 'Note required'),
  transferTo: z.string().optional(),
});

const txColumns: Column<BankTransaction>[] = [
  { key: 'date', label: 'Date', sortable: true },
  { key: 'type', label: 'Type', render: (t) => (
    <Badge variant={t.type === 'deposit' ? 'default' : t.type === 'withdraw' ? 'destructive' : 'secondary'}>{t.type}</Badge>
  )},
  { key: 'amount', label: 'Amount', render: (t) => `৳${t.amount.toLocaleString()}` },
  { key: 'note', label: 'Note' },
  { key: 'reference', label: 'Reference', render: (t) => t.reference || '-' },
];

export default function BankAccountsPage() {
  const [accounts, setAccounts] = useState(bankAccounts);
  const [addOpen, setAddOpen] = useState(false);
  const [txOpen, setTxOpen] = useState(false);
  const total = accounts.reduce((s, b) => s + b.balance, 0);

  const bankForm = useForm<z.infer<typeof bankSchema>>({ resolver: zodResolver(bankSchema), defaultValues: { bankName: '', accountName: '', accountNumber: '', openingBalance: 0 } });
  const txForm = useForm<z.infer<typeof txSchema>>({ resolver: zodResolver(txSchema), defaultValues: { bankAccountId: '', type: 'deposit', amount: 0, note: '', transferTo: '' } });

  const handleAddBank = (data: z.infer<typeof bankSchema>) => {
    setAccounts([...accounts, { id: `b${Date.now()}`, ...data, balance: data.openingBalance, somiteeId: 's1' }]);
    setAddOpen(false);
    bankForm.reset();
    toast.success('Bank account added');
  };

  const handleTx = (data: z.infer<typeof txSchema>) => {
    setTxOpen(false);
    txForm.reset();
    toast.success(`Bank ${data.type} recorded`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div><h1 className="text-2xl font-heading font-bold">Bank Accounts</h1><p className="text-muted-foreground">Total Balance: ৳{total.toLocaleString()}</p></div>
          <HelpModal title="Bank Accounts" description="Manage all bank accounts for your somitee." steps={['Add bank accounts with opening balance', 'Record deposits, withdrawals, and transfers', 'View bank ledger and statements in tabs']} />
        </div>
        <div className="flex gap-2">
          <Dialog open={txOpen} onOpenChange={setTxOpen}>
            <DialogTrigger asChild><Button variant="outline"><ArrowLeftRight className="h-4 w-4 mr-2" /> Transaction</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle className="font-heading">Bank Transaction</DialogTitle></DialogHeader>
              <Form {...txForm}>
                <form onSubmit={txForm.handleSubmit(handleTx)} className="space-y-4">
                  <FormField control={txForm.control} name="bankAccountId" render={({ field }) => (
                    <FormItem><FormLabel>Bank Account *</FormLabel><FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger><SelectValue placeholder="Select bank" /></SelectTrigger>
                        <SelectContent>{accounts.map(b => <SelectItem key={b.id} value={b.id}>{b.bankName} - {b.accountNumber}</SelectItem>)}</SelectContent>
                      </Select>
                    </FormControl><FormMessage /></FormItem>
                  )} />
                  <div className="grid grid-cols-2 gap-3">
                    <FormField control={txForm.control} name="type" render={({ field }) => (
                      <FormItem><FormLabel>Type *</FormLabel><FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="deposit">Deposit</SelectItem>
                            <SelectItem value="withdraw">Withdraw</SelectItem>
                            <SelectItem value="transfer">Transfer</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={txForm.control} name="amount" render={({ field }) => (
                      <FormItem><FormLabel>Amount *</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <FormField control={txForm.control} name="note" render={({ field }) => (
                    <FormItem><FormLabel>Note *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <Button type="submit" className="w-full">Record Transaction</Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" /> Add Bank Account</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle className="font-heading">Add Bank Account</DialogTitle></DialogHeader>
              <Form {...bankForm}>
                <form onSubmit={bankForm.handleSubmit(handleAddBank)} className="space-y-4">
                  <FormField control={bankForm.control} name="bankName" render={({ field }) => (
                    <FormItem><FormLabel>Bank Name *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={bankForm.control} name="accountName" render={({ field }) => (
                    <FormItem><FormLabel>Account Name *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={bankForm.control} name="accountNumber" render={({ field }) => (
                    <FormItem><FormLabel>Account Number *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={bankForm.control} name="openingBalance" render={({ field }) => (
                    <FormItem><FormLabel>Opening Balance</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <Button type="submit" className="w-full">Add Account</Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map(bank => (
          <Card key={bank.id} className="animate-fade-in">
            <CardHeader className="pb-2">
              <CardTitle className="font-heading text-lg flex items-center gap-2">
                <Landmark className="h-5 w-5 text-primary" /> {bank.bankName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">A/C: {bank.accountNumber}</p>
              <p className="text-xs text-muted-foreground">{bank.accountName}</p>
              <p className="text-2xl font-heading font-bold mt-2">৳{bank.balance.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Opening: ৳{bank.openingBalance.toLocaleString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="ledger">
            <TabsList>
              <TabsTrigger value="ledger">Bank Ledger</TabsTrigger>
              <TabsTrigger value="statement">Bank Statement</TabsTrigger>
            </TabsList>
            <TabsContent value="ledger">
              <DataTable data={bankTransactions} columns={txColumns} searchKey="note" emptyMessage="No bank transactions" />
            </TabsContent>
            <TabsContent value="statement">
              <DataTable data={bankTransactions} columns={txColumns} searchKey="note" emptyMessage="No statements" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
