import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { members, FINANCIAL_YEARS, MONTHS, memberPayments, getPaidMonths, MemberPayment } from '@/data/dummyData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DataTable, { Column } from '@/components/shared/DataTable';
import StatsCard from '@/components/shared/StatsCard';
import { Wallet, CheckCircle, ArrowRight, ArrowLeft, CalendarDays, Users, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import i18n from '@/i18n';

const collectionSchema = z.object({
  memberId: z.string().min(1, 'Select a member'),
  financialYear: z.string().min(1, 'Select year'),
  months: z.array(z.number()).min(1, 'Select at least one month'),
  method: z.enum(['cash', 'bkash', 'nagad', 'bank', 'sslcommerz']),
  transactionId: z.string().optional(),
  discount: z.coerce.number().min(0).default(0),
});

type CollectionFormData = z.infer<typeof collectionSchema>;

export default function AdvancedCollectionPage() {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [payments, setPayments] = useState(memberPayments);

  const form = useForm<CollectionFormData>({
    resolver: zodResolver(collectionSchema),
    defaultValues: { memberId: '', financialYear: '2024-2025', months: [], method: 'cash', transactionId: '', discount: 0 },
  });

  const selectedMemberId = form.watch('memberId');
  const selectedYear = form.watch('financialYear');
  const selectedMonths = form.watch('months');
  const discount = form.watch('discount');
  const method = form.watch('method');

  const selectedMember = members.find(m => m.id === selectedMemberId);
  const paidMonths = selectedMemberId && selectedYear ? getPaidMonths(selectedMemberId, selectedYear) : [];
  const isBn = i18n.language === 'bn';

  const monthlyFee = selectedMember?.monthlyFee || 0;
  const subtotal = selectedMonths.length * monthlyFee;
  const lateFee = 0; // Can be calculated based on business logic
  const total = subtotal + lateFee - (discount || 0);

  const toggleMonth = (monthVal: number) => {
    const current = form.getValues('months');
    if (paidMonths.includes(monthVal)) return; // Already paid
    if (current.includes(monthVal)) {
      form.setValue('months', current.filter(m => m !== monthVal));
    } else {
      form.setValue('months', [...current, monthVal]);
    }
  };

  const quickSelect = (type: '1month' | '6months' | 'full') => {
    const available = MONTHS.map(m => m.value).filter(m => !paidMonths.includes(m));
    if (type === '1month') form.setValue('months', available.slice(0, 1));
    else if (type === '6months') form.setValue('months', available.slice(0, 6));
    else form.setValue('months', available);
  };

  const handleSubmit = (data: CollectionFormData) => {
    // Check duplicates
    const existingPaid = getPaidMonths(data.memberId, data.financialYear);
    const duplicate = data.months.some(m => existingPaid.includes(m));
    if (duplicate) {
      toast.error(t('advancedCollection.duplicatePayment'));
      return;
    }

    const newPayment: MemberPayment = {
      id: `mp${Date.now()}`,
      memberId: data.memberId,
      memberName: selectedMember?.name || '',
      financialYear: data.financialYear,
      months: data.months,
      amount: subtotal,
      lateFee,
      discount: data.discount,
      totalPaid: total,
      method: data.method,
      transactionId: data.transactionId,
      date: new Date().toISOString().split('T')[0],
      status: 'approved',
    };
    setPayments([newPayment, ...payments]);
    toast.success(t('advancedCollection.paymentRecorded'));
    form.reset({ memberId: '', financialYear: '2024-2025', months: [], method: 'cash', transactionId: '', discount: 0 });
    setStep(1);
  };

  const historyColumns: Column<MemberPayment>[] = [
    { key: 'memberName', label: t('common.name'), sortable: true },
    { key: 'financialYear', label: t('advancedCollection.financialYear') },
    { key: 'months', label: t('advancedCollection.months'), render: (p) => (
      <div className="flex flex-wrap gap-1">
        {p.months.map(m => {
          const month = MONTHS.find(mo => mo.value === m);
          return <Badge key={m} variant="outline" className="text-xs">{isBn ? month?.labelBn : month?.label}</Badge>;
        })}
      </div>
    )},
    { key: 'totalPaid', label: t('common.amount'), render: (p) => `৳${p.totalPaid.toLocaleString()}`, sortable: true },
    { key: 'method', label: t('common.method'), render: (p) => <span className="capitalize">{p.method}</span> },
    { key: 'status', label: t('common.status'), render: (p) => (
      <Badge variant={p.status === 'approved' ? 'default' : p.status === 'pending' ? 'secondary' : 'destructive'}>{t(`common.${p.status}`)}</Badge>
    )},
    { key: 'date', label: t('common.date'), sortable: true },
  ];

  const totalCollected = payments.filter(p => p.status === 'approved').reduce((s, p) => s + p.totalPaid, 0);
  const pendingPayments = payments.filter(p => p.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">{t('advancedCollection.title')}</h1>
        <p className="text-muted-foreground">{t('advancedCollection.subtitle')}</p>
      </div>

      <Tabs defaultValue="collect">
        <TabsList>
          <TabsTrigger value="collect">{t('advancedCollection.collectPayment')}</TabsTrigger>
          <TabsTrigger value="history">{t('advancedCollection.paymentHistory')}</TabsTrigger>
        </TabsList>

        <TabsContent value="collect" className="space-y-4">
          {/* Step Indicator */}
          <div className="flex items-center gap-2 text-sm">
            {[1, 2, 3, 4].map(s => (
              <div key={s} className="flex items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>{s}</div>
                <span className={`hidden md:inline ${step >= s ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {s === 1 ? t('advancedCollection.step1') : s === 2 ? t('advancedCollection.step2') : s === 3 ? t('advancedCollection.step3') : t('advancedCollection.step4')}
                </span>
                {s < 4 && <ArrowRight className="h-3 w-3 text-muted-foreground mx-1" />}
              </div>
            ))}
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              {/* Step 1: Select Member */}
              {step === 1 && (
                <Card>
                  <CardHeader><CardTitle className="font-heading text-lg">{t('advancedCollection.step1')}</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <FormField control={form.control} name="memberId" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('nav.members')} *</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger><SelectValue placeholder={t('collections.selectMember')} /></SelectTrigger>
                            <SelectContent>
                              {members.filter(m => m.status === 'active').map(m => (
                                <SelectItem key={m.id} value={m.id}>
                                  {m.name} — {m.shopName} (৳{m.monthlyFee}/{t('advancedCollection.month')})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    {selectedMember && (
                      <div className="p-3 bg-muted/50 rounded-lg text-sm space-y-1">
                        <p><strong>{selectedMember.name}</strong> — {selectedMember.shopName}</p>
                        <p>{t('common.phone')}: {selectedMember.phone}</p>
                        <p>{t('members.monthlyFee')}: ৳{selectedMember.monthlyFee}</p>
                        <p>{t('members.totalDue')}: <span className="text-destructive font-bold">৳{selectedMember.totalDue}</span></p>
                      </div>
                    )}
                    <Button type="button" disabled={!selectedMemberId} onClick={() => setStep(2)} className="w-full">
                      {t('advancedCollection.next')} <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Year & Period */}
              {step === 2 && (
                <Card>
                  <CardHeader><CardTitle className="font-heading text-lg">{t('advancedCollection.step2')}</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <FormField control={form.control} name="financialYear" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('advancedCollection.financialYear')} *</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {FINANCIAL_YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )} />

                    <div>
                      <p className="text-sm font-medium mb-2">{t('advancedCollection.quickSelect')}</p>
                      <div className="flex gap-2 flex-wrap">
                        <Button type="button" variant="outline" size="sm" onClick={() => quickSelect('1month')}>1 {t('advancedCollection.month')}</Button>
                        <Button type="button" variant="outline" size="sm" onClick={() => quickSelect('6months')}>6 {t('advancedCollection.months')}</Button>
                        <Button type="button" variant="outline" size="sm" onClick={() => quickSelect('full')}>{t('advancedCollection.fullYear')}</Button>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">{t('advancedCollection.selectMonths')}</p>
                      <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                        {MONTHS.map(month => {
                          const isPaid = paidMonths.includes(month.value);
                          const isSelected = selectedMonths.includes(month.value);
                          return (
                            <button
                              key={month.value}
                              type="button"
                              disabled={isPaid}
                              onClick={() => toggleMonth(month.value)}
                              className={`p-2 rounded-lg border text-sm transition-colors ${
                                isPaid ? 'bg-green-100 text-green-700 border-green-300 cursor-not-allowed' :
                                isSelected ? 'bg-primary text-primary-foreground border-primary' :
                                'bg-background hover:bg-muted border-border'
                              }`}
                            >
                              {isBn ? month.labelBn : month.label}
                              {isPaid && <CheckCircle className="h-3 w-3 inline ml-1" />}
                            </button>
                          );
                        })}
                      </div>
                      <FormField control={form.control} name="months" render={() => <FormMessage className="mt-1" />} />
                    </div>

                    <div className="flex gap-2">
                      <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                        <ArrowLeft className="h-4 w-4 mr-2" /> {t('common.back')}
                      </Button>
                      <Button type="button" disabled={selectedMonths.length === 0} onClick={() => setStep(3)} className="flex-1">
                        {t('advancedCollection.next')} <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Payment Details */}
              {step === 3 && (
                <Card>
                  <CardHeader><CardTitle className="font-heading text-lg">{t('advancedCollection.step3')}</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <FormField control={form.control} name="method" render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('common.method')} *</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="cash">{t('collections.cash')}</SelectItem>
                                <SelectItem value="bkash">bKash</SelectItem>
                                <SelectItem value="nagad">Nagad</SelectItem>
                                <SelectItem value="bank">{t('collections.bankTransfer')}</SelectItem>
                                <SelectItem value="sslcommerz">SSLCommerz</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="discount" render={({ field }) => (
                        <FormItem><FormLabel>{t('advancedCollection.discount')}</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                      )} />
                    </div>
                    {(method === 'bkash' || method === 'nagad' || method === 'bank') && (
                      <FormField control={form.control} name="transactionId" render={({ field }) => (
                        <FormItem><FormLabel>{t('collections.transactionId')}</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                      )} />
                    )}

                    {/* Summary Card */}
                    <Card className="bg-muted/50">
                      <CardContent className="p-4 space-y-2 text-sm">
                        <h4 className="font-heading font-bold">{t('advancedCollection.summary')}</h4>
                        <div className="flex justify-between"><span>{t('common.name')}</span><strong>{selectedMember?.name}</strong></div>
                        <div className="flex justify-between"><span>{t('advancedCollection.financialYear')}</span><strong>{selectedYear}</strong></div>
                        <div className="flex justify-between"><span>{t('advancedCollection.monthsSelected')}</span><strong>{selectedMonths.length}</strong></div>
                        <div className="flex justify-between"><span>{t('advancedCollection.subtotal')}</span><span>৳{subtotal.toLocaleString()}</span></div>
                        {lateFee > 0 && <div className="flex justify-between text-destructive"><span>{t('collections.lateFee')}</span><span>৳{lateFee}</span></div>}
                        {(discount || 0) > 0 && <div className="flex justify-between text-green-600"><span>{t('advancedCollection.discount')}</span><span>-৳{discount}</span></div>}
                        <hr />
                        <div className="flex justify-between font-bold text-base"><span>{t('common.total')}</span><span>৳{total.toLocaleString()}</span></div>
                      </CardContent>
                    </Card>

                    <div className="flex gap-2">
                      <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1">
                        <ArrowLeft className="h-4 w-4 mr-2" /> {t('common.back')}
                      </Button>
                      <Button type="button" onClick={() => setStep(4)} className="flex-1">
                        {t('advancedCollection.next')} <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 4: Confirm */}
              {step === 4 && (
                <Card>
                  <CardHeader><CardTitle className="font-heading text-lg">{t('advancedCollection.step4')}</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-muted-foreground">{t('common.name')}</span><strong>{selectedMember?.name}</strong></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">{t('members.shopName')}</span><strong>{selectedMember?.shopName}</strong></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">{t('advancedCollection.financialYear')}</span><strong>{selectedYear}</strong></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">{t('advancedCollection.months')}</span>
                        <div className="flex flex-wrap gap-1 justify-end">
                          {selectedMonths.map(m => {
                            const month = MONTHS.find(mo => mo.value === m);
                            return <Badge key={m} variant="secondary" className="text-xs">{isBn ? month?.labelBn : month?.label}</Badge>;
                          })}
                        </div>
                      </div>
                      <div className="flex justify-between"><span className="text-muted-foreground">{t('common.method')}</span><strong className="capitalize">{method}</strong></div>
                      <hr />
                      <div className="flex justify-between text-lg font-bold"><span>{t('common.total')}</span><span className="text-primary">৳{total.toLocaleString()}</span></div>
                    </div>

                    <div className="flex gap-2">
                      <Button type="button" variant="outline" onClick={() => setStep(3)} className="flex-1">
                        <ArrowLeft className="h-4 w-4 mr-2" /> {t('common.back')}
                      </Button>
                      <Button type="submit" className="flex-1">
                        <Wallet className="h-4 w-4 mr-2" /> {t('advancedCollection.confirmPayment')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatsCard title={t('advancedCollection.totalCollected')} value={`৳${totalCollected.toLocaleString()}`} icon={DollarSign} trend="up" />
            <StatsCard title={t('advancedCollection.totalPayments')} value={payments.length} icon={CalendarDays} trend="neutral" />
            <StatsCard title={t('common.pending')} value={pendingPayments} icon={Users} trend="neutral" />
          </div>
          <Card>
            <CardContent className="pt-6">
              <DataTable data={payments} columns={historyColumns} searchKey="memberName" pageSize={10} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
