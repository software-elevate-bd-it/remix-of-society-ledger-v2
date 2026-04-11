import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DataTable, { Column } from '@/components/shared/DataTable';
import HelpModal from '@/components/shared/HelpModal';
import { members } from '@/data/dummyData';
import { Download, Users } from 'lucide-react';
import { toast } from 'sonner';

interface DueMember {
  id: string;
  name: string;
  shopName: string;
  phone: string;
  totalDue: number;
}

export default function MemberDueReport() {
  const { t } = useTranslation();
  const dueMembers: DueMember[] = members.filter(m => m.totalDue > 0).map(m => ({
    id: m.id, name: m.name, shopName: m.shopName, phone: m.phone, totalDue: m.totalDue
  }));

  const totalDue = dueMembers.reduce((s, m) => s + m.totalDue, 0);

  const columns: Column<DueMember>[] = [
    { key: 'name', label: t('common.name'), sortable: true },
    { key: 'shopName', label: t('members.shopName') },
    { key: 'phone', label: t('common.phone') },
    { key: 'totalDue', label: t('members.totalDue'), sortable: true, render: (m) => <span className="text-destructive font-bold">৳{m.totalDue.toLocaleString()}</span> },
  ];

  const handleExport = (format: string) => toast.success(t('reports.exportedAs', { format }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div><h1 className="text-2xl font-heading font-bold">{t('reports.memberDue')}</h1><p className="text-muted-foreground">{t('reports.subtitle')}</p></div>
          <HelpModal title={t('reports.helpTitle')} description={t('reports.helpDesc')} steps={[t('reports.helpStep1'), t('reports.helpStep2')]} />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleExport('PDF')}><Download className="h-3 w-3 mr-1" /> PDF</Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('CSV')}><Download className="h-3 w-3 mr-1" /> CSV</Button>
        </div>
      </div>

      <Card><CardContent className="p-4 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-orange-500/10"><Users className="h-5 w-5 text-orange-600" /></div>
        <div><p className="text-xs text-muted-foreground">{t('reports.totalDue')}</p><p className="text-xl font-heading font-bold">৳{totalDue.toLocaleString()}</p></div>
      </CardContent></Card>

      <Card><CardContent className="pt-6">
        <DataTable data={dueMembers} columns={columns} searchKey="name" pageSize={10} />
      </CardContent></Card>
    </div>
  );
}
