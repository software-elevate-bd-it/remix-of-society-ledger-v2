import { useState } from 'react';
import DataTable, { Column } from '@/components/shared/DataTable';
import { members, Member } from '@/data/dummyData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

const columns: Column<Member>[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'shopName', label: 'Shop', sortable: true },
  { key: 'phone', label: 'Phone' },
  { key: 'monthlyFee', label: 'Monthly Fee', render: (m) => `৳${m.monthlyFee}` },
  { key: 'totalDue', label: 'Due', render: (m) => m.totalDue > 0 ? <span className="text-destructive font-medium">৳{m.totalDue}</span> : <span className="text-success">Paid</span> },
  { key: 'status', label: 'Status', render: (m) => <Badge variant={m.status === 'active' ? 'default' : 'secondary'}>{m.status}</Badge> },
];

export default function MembersPage() {
  const [open, setOpen] = useState(false);
  const [memberList, setMemberList] = useState(members);

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newMember: Member = {
      id: `m${Date.now()}`,
      name: fd.get('name') as string,
      shopName: fd.get('shopName') as string,
      phone: fd.get('phone') as string,
      address: fd.get('address') as string,
      nid: fd.get('nid') as string,
      status: 'active',
      somiteeId: 's1',
      joinDate: new Date().toISOString().split('T')[0],
      monthlyFee: Number(fd.get('monthlyFee')) || 500,
      totalDue: 0,
      totalPaid: 0,
    };
    setMemberList([newMember, ...memberList]);
    setOpen(false);
    toast.success('Member added successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Members</h1>
          <p className="text-muted-foreground">{memberList.length} total members</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> Add Member</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle className="font-heading">Add New Member</DialogTitle></DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><Label>Name *</Label><Input name="name" required /></div>
                <div className="space-y-1"><Label>Shop Name *</Label><Input name="shopName" required /></div>
                <div className="space-y-1"><Label>Phone *</Label><Input name="phone" required /></div>
                <div className="space-y-1"><Label>Monthly Fee</Label><Input name="monthlyFee" type="number" defaultValue={500} /></div>
                <div className="col-span-2 space-y-1"><Label>Address</Label><Input name="address" /></div>
                <div className="col-span-2 space-y-1"><Label>NID (Optional)</Label><Input name="nid" /></div>
              </div>
              <Button type="submit" className="w-full"><UserPlus className="h-4 w-4 mr-2" /> Add Member</Button>
            </form>
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
