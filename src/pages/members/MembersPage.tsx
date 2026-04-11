import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

  const form = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    defaultValues: { name: '', shopName: '', phone: '', address: '', nid: '', monthlyFee: 500, password: '' },
  });

  const columns: Column<Member>[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'shopName', label: 'Shop', sortable: true },
    { key: 'phone', label: 'Phone' },
    { key: 'monthlyFee', label: 'Monthly Fee', render: (m) => `৳${m.monthlyFee}` },
    { key: 'totalDue', label: 'Due', render: (m) => m.totalDue > 0 ? <span className="text-destructive font-medium">৳{m.totalDue}</span> : <span className="text-green-600">Paid</span> },
    { key: 'status', label: 'Status', render: (m) => <Badge variant={m.status === 'active' ? 'default' : 'secondary'}>{m.status}</Badge> },
    { key: 'id', label: 'Action', render: (m) => (
      <Button size="sm" variant="ghost" onClick={() => navigate(`/members/${m.id}`)}><Eye className="h-3 w-3 mr-1" /> View</Button>
    )},
  ];

  const handleAdd = (data: MemberFormData) => {
    const newMember: Member = {
      id: `m${Date.now()}`,
      name: data.name,
      shopName: data.shopName,
      phone: data.phone,
      address: data.address || '',
      nid: data.nid,
      status: 'active',
      somiteeId: 's1',
      joinDate: new Date().toISOString().split('T')[0],
      monthlyFee: data.monthlyFee,
      totalDue: 0,
      totalPaid: 0,
      paymentLink: `pay-${data.name.toLowerCase().replace(/\s/g, '-')}-${Date.now()}`,
    };
    setMemberList([newMember, ...memberList]);
    setOpen(false);
    form.reset();
    toast.success('Member added successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div>
            <h1 className="text-2xl font-heading font-bold">Members</h1>
            <p className="text-muted-foreground">{memberList.length} total members</p>
          </div>
          <HelpModal title="Members Management" description="Manage all shop owner members in your somitee." steps={['Click Add Member to register new members', 'Fill in the form with member details', 'Click View to see member profile and ledger', 'Use search to find specific members']} />
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> Add Member</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
            <DialogHeader><DialogTitle className="font-heading">Add New Member</DialogTitle></DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAdd)} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Name *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="shopName" render={({ field }) => (
                    <FormItem><FormLabel>Shop Name *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem><FormLabel>Phone *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="monthlyFee" render={({ field }) => (
                    <FormItem><FormLabel>Monthly Fee</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="address" render={({ field }) => (
                  <FormItem><FormLabel>Address</FormLabel><FormControl><Textarea {...field} rows={2} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-2 gap-3">
                  <FormField control={form.control} name="nid" render={({ field }) => (
                    <FormItem><FormLabel>NID (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" placeholder="Auto-generated if empty" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <div className="space-y-1">
                  <Label>Profile Image</Label>
                  <Input type="file" accept="image/*" />
                  <p className="text-xs text-muted-foreground">Optional profile photo</p>
                </div>
                <Button type="submit" className="w-full"><UserPlus className="h-4 w-4 mr-2" /> Add Member</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-6">
          <DataTable
            data={memberList}
            columns={columns}
            searchKey="name"
            emptyMessage="No members yet"
            emptyAction={{ label: 'Add First Member', onClick: () => setOpen(true) }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
