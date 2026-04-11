import DataTable, { Column } from '@/components/shared/DataTable';
import { transactions, members, Transaction } from '@/data/dummyData';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

const allColumns: Column<Transaction>[] = [
  { key: 'date', label: 'Date', sortable: true },
  { key: 'memberName', label: 'Member' },
  { key: 'type', label: 'Type', render: (t) => <Badge variant={t.type === 'collection' ? 'default' : 'secondary'}>{t.type}</Badge> },
  { key: 'category', label: 'Category' },
  { key: 'amount', label: 'Amount', render: (t) => `৳${t.amount.toLocaleString()}` },
  { key: 'status', label: 'Status', render: (t) => <Badge variant={t.status === 'approved' ? 'default' : 'secondary'}>{t.status}</Badge> },
];

export default function LedgerPage() {
  const [selectedMember, setSelectedMember] = useState<string>('all');

  const filtered = selectedMember === 'all' ? transactions : transactions.filter(t => t.memberId === selectedMember);

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-heading font-bold">Ledger</h1><p className="text-muted-foreground">Complete transaction history</p></div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Transactions</TabsTrigger>
          <TabsTrigger value="member">By Member</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <Card><CardContent className="pt-6"><DataTable data={transactions} columns={allColumns} searchKey="memberName" /></CardContent></Card>
        </TabsContent>
        <TabsContent value="member" className="space-y-4">
          <Select value={selectedMember} onValueChange={setSelectedMember}>
            <SelectTrigger className="w-64"><SelectValue placeholder="Select member" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Members</SelectItem>
              {members.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Card><CardContent className="pt-6"><DataTable data={filtered} columns={allColumns} searchKey="category" /></CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
