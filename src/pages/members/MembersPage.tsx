import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DataTable, { Column } from '@/components/shared/DataTable';
import HelpModal from '@/components/shared/HelpModal';
import { members, Member } from '@/data/dummyData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Plus, UserPlus, Eye } from 'lucide-react';
import { toast } from 'sonner';

const memberSchema = z.object({
  name: z.string().min(2, 'Name is required').max(100),
  shopName: z.string().min(2, 'Shop name is required').max(100),
  phone: z.string().min(10, 'Valid phone required').max(15),
  address: z.string().max(300).optional(),
  nid: z.string().max(20).optional(),
  monthlyFee: z.coerce.number().min(0).default(500),
  password: z.string().optional(),
});

type MemberFormData = z.infer<typeof memberSchema>;

export default function MembersPage() {
  const [open, setOpen] = useState(false);
  const [memberList, setMemberList] = useState(members);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const form = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    defaultValues: { name: '', shopName: '', phone: '', address: '', nid: '', monthlyFee: 500, password: '' },
  });

  const columns: Column<Member>[] = [
    { key: 'name', label: t('common.name'), sortable: true },
    { key: 'shopName', label: t('members.shopName'), sortable: true },
    { key: 'phone', label: t('common.phone') },
    { key: 'monthlyFee', label: t('members.monthlyFee'), render: (m) => `৳${m.monthlyFee}` },
    { key: 'totalDue', label: t('members.due'), render: (m) => m.totalDue > 0 ? <span className="text-destructive font-medium">৳{m.totalDue}</span> : <span className="text-green-600">{t('common.paid')}</span> },
    { key: 'status', label: t('common.status'), render: (m) => <Badge variant={m.status === 'active' ? 'default' : 'secondary'}>{t(`common.${m.status}`)}</Badge> },
    { key: 'id', label: t('common.actions'), render: (m) => (
      <Button size="sm" variant="ghost" onClick={() => navigate(`/members/${m.id}`)}><Eye className="h-3 w-3 mr-1" /> {t('common.view')}</Button>
    )},
  ];

  const handleAdd = (data: MemberFormData) => {
    const newMember: Member = {
      id: `m${Date.now()}`, name: data.name, shopName: data.shopName, phone: data.phone,
      address: data.address || '', nid: data.nid, status: 'active', somiteeId: 's1',
      joinDate: new Date().toISOString().split('T')[0], monthlyFee: data.monthlyFee,
      totalDue: 0, totalPaid: 0, paymentLink: `pay-${data.name.toLowerCase().replace(/\s/g, '-')}-${Date.now()}`,
    };
    setMemberList([newMember, ...memberList]);
    setOpen(false);
    form.reset();
    toast.success(t('members.memberAdded'));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div>
            <h1 className="text-2xl font-heading font-bold">{t('members.title')}</h1>
            <p className="text-muted-foreground">{t('members.totalMembers', { count: memberList.length })}</p>
          </div>
          <HelpModal title={t('members.helpTitle')} description={t('members.helpDesc')} steps={[t('members.helpStep1'), t('members.helpStep2'), t('members.helpStep3'), t('members.helpStep4')]} />
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> {t('members.addMember')}</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
            <DialogHeader><DialogTitle className="font-heading">{t('members.addNewMember')}</DialogTitle></DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAdd)} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>{t('common.name')} *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="shopName" render={({ field }) => (
                    <FormItem><FormLabel>{t('members.shopName')} *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem><FormLabel>{t('common.phone')} *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="monthlyFee" render={({ field }) => (
                    <FormItem><FormLabel>{t('members.monthlyFee')}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="address" render={({ field }) => (
                  <FormItem><FormLabel>{t('common.address')}</FormLabel><FormControl><Textarea {...field} rows={2} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-2 gap-3">
                  <FormField control={form.control} name="nid" render={({ field }) => (
                    <FormItem><FormLabel>{t('members.nid')} ({t('members.optional')})</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem><FormLabel>{t('common.password')}</FormLabel><FormControl><Input type="password" placeholder={t('members.autoGenerated')} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <div className="space-y-1">
                  <Label>{t('members.profileImage')}</Label>
                  <Input type="file" accept="image/*" />
                  <p className="text-xs text-muted-foreground">{t('members.optional')}</p>
                </div>
                <Button type="submit" className="w-full"><UserPlus className="h-4 w-4 mr-2" /> {t('members.addMember')}</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-6">
          <DataTable data={memberList} columns={columns} searchKey="name" emptyMessage={t('members.noMembers')} emptyAction={{ label: t('members.addFirstMember'), onClick: () => setOpen(true) }} />
        </CardContent>
      </Card>
    </div>
  );
}
