import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DataTable, { Column } from '@/components/shared/DataTable';
import HelpModal from '@/components/shared/HelpModal';
import { bankAccounts } from '@/data/dummyData';
import { Download, Landmark, Wallet } from 'lucide-react';
import { toast } from 'sonner';

interface BankRow {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  balance: number;
}

export default function BankCashReport() {
  const { t } = useTranslation();
  const totalBank = bankAccounts.reduce((s, b) => s + b.balance, 0);

  const columns: Column<BankRow>[] = [
    { key: 'bankName', label: t('bank.bankName'), sortable: true },
    { key: 'accountName', label: t('bank.accountName') },
    { key: 'accountNumber', label: t('bank.accountNumber') },
    { key: 'balance', label: t('common.amount'), sortable: true, render: (b) => `৳${b.balance.toLocaleString()}` },
  ];

  const handleExport = (format: string) => toast.success(t('reports.exportedAs', { format }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div><h1 className="text-2xl font-heading font-bold">{t('reports.bankVsCash')}</h1><p className="text-muted-foreground">{t('reports.subtitle')}</p></div>
          <HelpModal title={t('reports.helpTitle')} description={t('reports.helpDesc')} steps={[t('reports.helpStep1'), t('reports.helpStep2')]} />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleExport('PDF')}><Download className="h-3 w-3 mr-1" /> PDF</Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('CSV')}><Download className="h-3 w-3 mr-1" /> CSV</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10"><Landmark className="h-5 w-5 text-blue-600" /></div>
          <div><p className="text-xs text-muted-foreground">{t('reports.totalBankBalance')}</p><p className="text-xl font-heading font-bold">৳{totalBank.toLocaleString()}</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-500/10"><Wallet className="h-5 w-5 text-green-600" /></div>
          <div><p className="text-xs text-muted-foreground">{t('reports.cashInHand')}</p><p className="text-xl font-heading font-bold">৳15,000</p></div>
        </CardContent></Card>
      </div>

      <Card><CardContent className="pt-6">
        <DataTable data={bankAccounts as BankRow[]} columns={columns} searchKey="bankName" pageSize={10} />
      </CardContent></Card>
    </div>
  );
}
