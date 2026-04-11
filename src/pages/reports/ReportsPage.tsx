import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Users, Wallet, Receipt, BarChart3 } from 'lucide-react';

const reports = [
  { title: 'Member Due Report', description: 'Outstanding dues for all members', icon: Users },
  { title: 'Monthly Collection', description: 'Collection summary by month', icon: Wallet },
  { title: 'Expense Report', description: 'Category-wise expense breakdown', icon: Receipt },
  { title: 'Profit/Loss Summary', description: 'Income vs expenses overview', icon: BarChart3 },
  { title: 'Bank vs Cash Report', description: 'Reconciliation of bank and cash', icon: FileText },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-heading font-bold">Reports</h1><p className="text-muted-foreground">Generate and export detailed reports</p></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map(r => (
          <Card key={r.title} className="animate-fade-in hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-primary/10"><r.icon className="h-5 w-5 text-primary" /></div>
                <div className="flex-1">
                  <h3 className="font-heading font-semibold">{r.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{r.description}</p>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline"><Download className="h-3 w-3 mr-1" /> PDF</Button>
                    <Button size="sm" variant="outline"><Download className="h-3 w-3 mr-1" /> Excel</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
