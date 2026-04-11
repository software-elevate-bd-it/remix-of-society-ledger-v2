import DataTable, { Column } from '@/components/shared/DataTable';
import { transactions, Transaction } from '@/data/dummyData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, XCircle } from 'lucide-react';

interface PaymentRow extends Transaction {}

const columns: Column<PaymentRow>[] = [
  { key: 'memberName', label: 'Member', sortable: true },
  { key: 'amount', label: 'Amount', render: (t) => `৳${t.amount.toLocaleString()}` },
  { key: 'method', label: 'Method', render: (t) => <span className="capitalize">{t.method}</span> },
  { key: 'transactionId', label: 'TXN ID', render: (t) => t.transactionId || '—' },
  { key: 'status', label: 'Status', render: (t) => (
    <Badge variant={t.status === 'approved' ? 'default' : t.status === 'pending' ? 'secondary' : 'destructive'}>{t.status}</Badge>
  )},
  { key: 'actions', label: 'Actions', render: (t) => t.status === 'pending' ? (
    <div className="flex gap-1">
      <Button size="sm" variant="ghost" className="text-success h-7 px-2"><CheckCircle className="h-4 w-4" /></Button>
      <Button size="sm" variant="ghost" className="text-destructive h-7 px-2"><XCircle className="h-4 w-4" /></Button>
    </div>
  ) : null },
];

export default function PaymentsPage() {
  const payments = transactions.filter(t => t.type === 'collection');

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-heading font-bold">Payment Verification</h1><p className="text-muted-foreground">Review and approve pending payments</p></div>
      <Card><CardContent className="pt-6"><DataTable data={payments} columns={columns} searchKey="memberName" /></CardContent></Card>
    </div>
  );
}
