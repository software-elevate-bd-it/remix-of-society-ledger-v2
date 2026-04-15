import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import StatsCard from '@/components/shared/StatsCard';
import { members, FINANCIAL_YEARS, MONTHS, getDueMonths, getPaidMonths } from '@/data/dummyData';
import { Download, Users, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import i18n from '@/i18n';

export default function MemberDueReport() {
  const { t } = useTranslation();
  const [selectedYear, setSelectedYear] = useState('2024-2025');
  const isBn = i18n.language === 'bn';

  const activeMembers = members.filter(m => m.status === 'active');

  const dueData = useMemo(() => {
    return activeMembers.map(member => {
      const dueMonths = getDueMonths(member.id, selectedYear);
      const paidMonths = getPaidMonths(member.id, selectedYear);
      const dueAmount = dueMonths.length * member.monthlyFee;
      return {
        ...member,
        dueMonths,
        paidMonths,
        dueCount: dueMonths.length,
        paidCount: paidMonths.length,
        dueAmount,
      };
    }).sort((a, b) => b.dueCount - a.dueCount);
  }, [selectedYear]);

  const totalDue = dueData.reduce((s, m) => s + m.dueAmount, 0);
  const membersWithDue = dueData.filter(m => m.dueCount > 0).length;
  const fullyPaid = dueData.filter(m => m.dueCount === 0).length;

  const handleExport = (format: string) => toast.success(t('reports.exportedAs', { format }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">{t('reports.memberDue')}</h1>
          <p className="text-muted-foreground">{t('reports.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleExport('PDF')}><Download className="h-3 w-3 mr-1" /> PDF</Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('Excel')}><Download className="h-3 w-3 mr-1" /> Excel</Button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            {FINANCIAL_YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard title={t('reports.totalDue')} value={`৳${totalDue.toLocaleString()}`} icon={AlertCircle} />
        <StatsCard title={t('collectionReport.fullyPaid')} value={fullyPaid} icon={CheckCircle} />
        <StatsCard title={t('collectionReport.dueMembers')} value={membersWithDue} icon={Users} />
      </div>

      <Card>
        <CardHeader><CardTitle className="font-heading">{t('reports.memberDue')} — {selectedYear}</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">{t('common.name')}</th>
                  <th className="text-left p-2">{t('members.shopName')}</th>
                  <th className="text-center p-2">{t('common.paid')}</th>
                  <th className="text-center p-2">{t('members.due')}</th>
                  <th className="text-left p-2">{t('collectionReport.dueMembers')}</th>
                  <th className="text-right p-2">{t('common.amount')}</th>
                </tr>
              </thead>
              <tbody>
                {dueData.map(member => (
                  <tr key={member.id} className="border-b hover:bg-muted/50">
                    <td className="p-2 font-medium">{member.name}</td>
                    <td className="p-2 text-muted-foreground">{member.shopName}</td>
                    <td className="text-center p-2"><Badge variant="default">{member.paidCount}</Badge></td>
                    <td className="text-center p-2">
                      {member.dueCount > 0 ? (
                        <Badge variant="destructive">{member.dueCount}</Badge>
                      ) : (
                        <Badge variant="default">0</Badge>
                      )}
                    </td>
                    <td className="p-2">
                      <div className="flex flex-wrap gap-1">
                        {member.dueMonths.slice(0, 4).map(m => {
                          const month = MONTHS.find(mo => mo.value === m);
                          return <Badge key={m} variant="outline" className="text-xs text-destructive">{isBn ? month?.labelBn?.slice(0, 3) : month?.label?.slice(0, 3)}</Badge>;
                        })}
                        {member.dueMonths.length > 4 && <Badge variant="outline" className="text-xs">+{member.dueMonths.length - 4}</Badge>}
                      </div>
                    </td>
                    <td className="text-right p-2 font-bold text-destructive">৳{member.dueAmount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 font-bold">
                  <td colSpan={5} className="p-2 text-right">{t('common.total')}:</td>
                  <td className="text-right p-2 text-destructive">৳{totalDue.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
