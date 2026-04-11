import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-heading font-bold">Settings</h1><p className="text-muted-foreground">Configure your somitee</p></div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="fees">Fee Setup</TabsTrigger>
          <TabsTrigger value="sms">SMS Config</TabsTrigger>
          <TabsTrigger value="payment">Payment Gateway</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card><CardHeader><CardTitle className="font-heading">Somitee Info</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1"><Label>Somitee Name</Label><Input defaultValue="Banani Market Somitee" /></div>
                <div className="space-y-1"><Label>Manager Name</Label><Input defaultValue="Rahim Uddin" /></div>
                <div className="space-y-1"><Label>Phone</Label><Input defaultValue="01711111111" /></div>
                <div className="space-y-1"><Label>Address</Label><Input defaultValue="Banani, Dhaka" /></div>
              </div>
              <Button onClick={() => toast.success('Settings saved')}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fees">
          <Card><CardHeader><CardTitle className="font-heading">Fee Configuration</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1"><Label>Monthly Fee (৳)</Label><Input type="number" defaultValue={500} /></div>
                <div className="space-y-1"><Label>Late Fee (৳)</Label><Input type="number" defaultValue={100} /></div>
                <div className="space-y-1"><Label>Grace Period (days)</Label><Input type="number" defaultValue={7} /></div>
              </div>
              <Button onClick={() => toast.success('Fee settings saved')}>Save</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sms">
          <Card><CardHeader><CardTitle className="font-heading">SMS API Configuration</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1"><Label>API Provider</Label><Input defaultValue="Bangla SMS" /></div>
              <div className="space-y-1"><Label>API Key</Label><Input type="password" placeholder="Enter API key" /></div>
              <div className="space-y-1"><Label>Sender ID</Label><Input defaultValue="SomiteeHQ" /></div>
              <Button onClick={() => toast.success('SMS config saved')}>Save</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card><CardHeader><CardTitle className="font-heading">Payment Gateway</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1"><Label>SSLCommerz Store ID</Label><Input placeholder="Store ID" /></div>
              <div className="space-y-1"><Label>SSLCommerz Store Password</Label><Input type="password" placeholder="Store password" /></div>
              <Button onClick={() => toast.success('Payment config saved')}>Save</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
