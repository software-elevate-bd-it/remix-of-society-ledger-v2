import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { members, memberPayments, FINANCIAL_YEARS, MONTHS, getPaidMonths, getDueMonths } from '@/data/dummyData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import StatsCard from '@/components/shared/StatsCard';
import { Download, Users, CheckCircle, AlertCircle, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import i18n from '@/i18n';

export default function CollectionReport() {
  const { t } = useTranslation();
  const [selectedYear, setSelectedYear] = useState('2024-2025');
  const [viewType, setViewType] = useState<'member' | 'monthly'>('member');
  const isBn = i18n.language === 'bn';

  const activeMembers = members.filter(m => m.status === 'active');

  const memberData = useMemo(() => {
    return activeMembers.map(member => {
      const paid = getPaidMonths(member.id, selectedYear);
      const due = getDueMonths(member.id, selectedYear);
      const totalPaid = memberPayments
        .filter(p => p.memberId === member.id && p.financialYear === selectedYear && p.status === 'approved')
        .reduce((s, p) => s + p.totalPaid, 0);
      const totalDue = due.length * member.monthlyFee;
      return { ...member, paidMonths: paid, dueMonths: due, yearPaid: totalPaid, yearDue: totalDue };
    });
  }, [selectedYear]);

  const monthlyData = useMemo(() => {
    return MONTHS.map(month => {
      const paidMembers = activeMembers.filter(m => getPaidMonths(m.id, selectedYear).includes(month.value));
      const dueMembers = activeMembers.filter(m => !getPaidMonths(m.id, selectedYear).includes(month.value));
      const collected = paidMembers.reduce((s, m) => s + m.monthlyFee, 0);
      const pending = dueMembers.reduce((s, m) => s + m.monthlyFee, 0);
      return { month: month.value, label: isBn ? month.labelBn : month.label, paidCount: paidMembers.length, dueCount: dueMembers.length, collected, pending };
    });
  }, [selectedYear, isBn]);

  const totalCollected = memberData.reduce((s, m) => s + m.yearPaid, 0);
  const totalDue = memberData.reduce((s, m) => s + m.yearDue, 0);
  const fullPaidCount = memberData.filter(m => m.dueMonths.length === 0).length;

  const handleExport = (format: string) => toast.success(t('reports.exportedAs', { format }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">{t('collectionReport.title')}</h1>
          <p className="text-muted-foreground">{t('collectionReport.subtitle')}</p>
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
        <Select value={viewType} onValueChange={(v: 'member' | 'monthly') => setViewType(v)}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="member">{t('collectionReport.memberWise')}</SelectItem>
            <SelectItem value="monthly">{t('collectionReport.monthlyBreakdown')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard title={t('collectionReport.totalCollected')} value={`৳${totalCollected.toLocaleString()}`} icon={DollarSign} />
        <StatsCard title={t('collectionReport.totalDue')} value={`৳${totalDue.toLocaleString()}`} icon={AlertCircle} />
        <StatsCard title={t('collectionReport.fullyPaid')} value={fullPaidCount} icon={CheckCircle} />
        <StatsCard title={t('collectionReport.activeMembers')} value={activeMembers.length} icon={Users} />
      </div>

      {viewType === 'member' ? (
        <Card>
          <CardHeader><CardTitle className="font-heading">{t('collectionReport.memberWise')} — {selectedYear}</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">{t('common.name')}</th>
                    {MONTHS.map(m => (
                      <th key={m.value} className="text-center p-1 text-xs">{isBn ? m.labelBn.slice(0, 3) : m.label.slice(0, 3)}</th>
                    ))}
                    <th className="text-right p-2">{t('common.paid')}</th>
                    <th className="text-right p-2">{t('members.due')}</th>
                  </tr>
                </thead>
                <tbody>
                  {memberData.map(member => (
                    <tr key={member.id} className="border-b hover:bg-muted/50">
                      <td className="p-2 font-medium">{member.name}</td>
                      {MONTHS.map(m => {
                        const isPaid = member.paidMonths.includes(m.value);
                        return (
                          <td key={m.value} className="text-center p-1">
                            {isPaid ? (
                              <span className="inline-block w-5 h-5 rounded-full bg-green-500 text-white text-xs leading-5">✓</span>
                            ) : (
                              <span className="inline-block w-5 h-5 rounded-full bg-red-100 text-red-500 text-xs leading-5">✗</span>
                            )}
                          </td>
                        );
                      })}
                      <td className="text-right p-2 text-green-600 font-bold">৳{member.yearPaid.toLocaleString()}</td>
                      <td className="text-right p-2 text-destructive font-bold">৳{member.yearDue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader><CardTitle className="font-heading">{t('collectionReport.monthlyBreakdown')} — {selectedYear}</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">{t('advancedCollection.month')}</th>
                    <th className="text-center p-2">{t('collectionReport.paidMembers')}</th>
                    <th className="text-center p-2">{t('collectionReport.dueMembers')}</th>
                    <th className="text-right p-2">{t('collectionReport.collected')}</th>
                    <th className="text-right p-2">{t('common.pending')}</th>
                    <th className="text-center p-2">{t('collectionReport.rate')}</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyData.map(row => {
                    const rate = activeMembers.length > 0 ? Math.round((row.paidCount / activeMembers.length) * 100) : 0;
                    return (
                      <tr key={row.month} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-medium">{row.label}</td>
                        <td className="text-center p-2"><Badge variant="default">{row.paidCount}</Badge></td>
                        <td className="text-center p-2"><Badge variant="destructive">{row.dueCount}</Badge></td>
                        <td className="text-right p-2 text-green-600 font-bold">৳{row.collected.toLocaleString()}</td>
                        <td className="text-right p-2 text-destructive">৳{row.pending.toLocaleString()}</td>
                        <td className="text-center p-2">
                          <Badge variant={rate >= 80 ? 'default' : rate >= 50 ? 'secondary' : 'destructive'}>{rate}%</Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
