import StatsCard from '@/components/shared/StatsCard';
import { bankAccounts } from '@/data/dummyData';
import { Landmark, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function BankAccountsPage() {
  const total = bankAccounts.reduce((s, b) => s + b.balance, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-heading font-bold">Bank Accounts</h1><p className="text-muted-foreground">Total Balance: ৳{total.toLocaleString()}</p></div>
        <Button><Plus className="h-4 w-4 mr-2" /> Add Bank Account</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bankAccounts.map(bank => (
          <Card key={bank.id} className="animate-fade-in">
            <CardHeader className="pb-2">
              <CardTitle className="font-heading text-lg flex items-center gap-2">
                <Landmark className="h-5 w-5 text-primary" /> {bank.bankName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">A/C: {bank.accountNumber}</p>
              <p className="text-2xl font-heading font-bold mt-2">৳{bank.balance.toLocaleString()}</p>
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline">Deposit</Button>
                <Button size="sm" variant="outline">Withdraw</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
