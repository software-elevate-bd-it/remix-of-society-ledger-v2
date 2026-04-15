import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DataTable, { Column } from '@/components/shared/DataTable';
import { memberRequests, MemberRequest } from '@/data/dummyData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, XCircle, Eye, UserCheck, UserX, Clock } from 'lucide-react';
import { toast } from 'sonner';
import StatsCard from '@/components/shared/StatsCard';

export default function MemberRequestsPage() {
  const { t } = useTranslation();
  const [requests, setRequests] = useState(memberRequests);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<MemberRequest | null>(null);
  const [rejectNote, setRejectNote] = useState('');
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const filtered = filterStatus === 'all' ? requests : requests.filter(r => r.status === filterStatus);

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const approvedCount = requests.filter(r => r.status === 'approved').length;
  const rejectedCount = requests.filter(r => r.status === 'rejected').length;

  const handleApprove = (req: MemberRequest) => {
    setRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'approved' as const } : r));
    toast.success(t('memberRequests.approved', { name: req.name }));
  };

  const handleReject = () => {
    if (!selectedRequest) return;
    setRequests(prev => prev.map(r => r.id === selectedRequest.id ? { ...r, status: 'rejected' as const, rejectionNote: rejectNote } : r));
    toast.success(t('memberRequests.rejected', { name: selectedRequest.name }));
    setRejectDialogOpen(false);
    setRejectNote('');
    setSelectedRequest(null);
  };

  const columns: Column<MemberRequest>[] = [
    { key: 'name', label: t('common.name'), sortable: true },
    { key: 'shopName', label: t('members.shopName') },
    { key: 'phone', label: t('common.phone') },
    { key: 'appliedAt', label: t('memberRequests.appliedDate'), sortable: true },
    { key: 'status', label: t('common.status'), render: (r) => (
      <Badge variant={r.status === 'approved' ? 'default' : r.status === 'pending' ? 'secondary' : 'destructive'}>
        {t(`common.${r.status}`)}
      </Badge>
    )},
    { key: 'id', label: t('common.actions'), render: (r) => (
      <div className="flex gap-1">
        <Button size="sm" variant="ghost" onClick={() => { setSelectedRequest(r); setViewDialogOpen(true); }}>
          <Eye className="h-3.5 w-3.5" />
        </Button>
        {r.status === 'pending' && (
          <>
            <Button size="sm" variant="ghost" className="text-green-600" onClick={() => handleApprove(r)}>
              <CheckCircle className="h-3.5 w-3.5" />
            </Button>
            <Button size="sm" variant="ghost" className="text-destructive" onClick={() => { setSelectedRequest(r); setRejectDialogOpen(true); }}>
              <XCircle className="h-3.5 w-3.5" />
            </Button>
          </>
        )}
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">{t('memberRequests.title')}</h1>
        <p className="text-muted-foreground">{t('memberRequests.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard title={t('common.pending')} value={pendingCount} icon={Clock} trend="neutral" />
        <StatsCard title={t('common.approved')} value={approvedCount} icon={UserCheck} trend="up" />
        <StatsCard title={t('common.rejected')} value={rejectedCount} icon={UserX} trend="down" />
      </div>

      <div className="flex items-center gap-3">
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('common.all')}</SelectItem>
            <SelectItem value="pending">{t('common.pending')}</SelectItem>
            <SelectItem value="approved">{t('common.approved')}</SelectItem>
            <SelectItem value="rejected">{t('common.rejected')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="pt-6">
          <DataTable data={filtered} columns={columns} searchKey="name" pageSize={10} />
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-heading">{t('memberRequests.viewRequest')}</DialogTitle></DialogHeader>
          {selectedRequest && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">{t('common.name')}:</span> <strong>{selectedRequest.name}</strong></div>
                <div><span className="text-muted-foreground">{t('members.shopName')}:</span> <strong>{selectedRequest.shopName}</strong></div>
                <div><span className="text-muted-foreground">{t('common.phone')}:</span> <strong>{selectedRequest.phone}</strong></div>
                <div><span className="text-muted-foreground">{t('common.address')}:</span> <strong>{selectedRequest.address}</strong></div>
                {selectedRequest.nid && <div><span className="text-muted-foreground">{t('members.nid')}:</span> <strong>{selectedRequest.nid}</strong></div>}
                <div><span className="text-muted-foreground">{t('common.status')}:</span> <Badge variant={selectedRequest.status === 'approved' ? 'default' : selectedRequest.status === 'pending' ? 'secondary' : 'destructive'}>{t(`common.${selectedRequest.status}`)}</Badge></div>
              </div>
              {selectedRequest.rejectionNote && (
                <div className="p-3 bg-destructive/10 rounded text-sm">
                  <strong>{t('memberRequests.rejectionNote')}:</strong> {selectedRequest.rejectionNote}
                </div>
              )}
              {selectedRequest.status === 'pending' && (
                <div className="flex gap-2 pt-2">
                  <Button className="flex-1" onClick={() => { handleApprove(selectedRequest); setViewDialogOpen(false); }}>
                    <CheckCircle className="h-4 w-4 mr-2" /> {t('memberRequests.approve')}
                  </Button>
                  <Button variant="destructive" className="flex-1" onClick={() => { setViewDialogOpen(false); setRejectDialogOpen(true); }}>
                    <XCircle className="h-4 w-4 mr-2" /> {t('memberRequests.reject')}
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-heading">{t('memberRequests.rejectRequest')}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{t('memberRequests.rejectConfirm', { name: selectedRequest?.name })}</p>
            <Textarea placeholder={t('memberRequests.rejectionNotePlaceholder')} value={rejectNote} onChange={(e) => setRejectNote(e.target.value)} rows={3} />
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setRejectDialogOpen(false)}>{t('common.cancel')}</Button>
              <Button variant="destructive" className="flex-1" onClick={handleReject}>{t('memberRequests.reject')}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
