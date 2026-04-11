import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import HelpModal from '@/components/shared/HelpModal';
import { toast } from 'sonner';

const profileSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().optional(),
});

const companySchema = z.object({
  companyName: z.string().min(2),
  address: z.string().optional(),
  phone: z.string().optional(),
});

export default function SettingsPage() {
  const profileForm = useForm<z.infer<typeof profileSchema>>({ resolver: zodResolver(profileSchema), defaultValues: { name: 'Rahim Uddin', email: 'rahim@banani.com', password: '' } });
  const companyForm = useForm<z.infer<typeof companySchema>>({ resolver: zodResolver(companySchema), defaultValues: { companyName: 'Banani Market Somitee', address: 'Banani, Dhaka', phone: '01711111111' } });

  // Print layout state
  const [printConfig, setPrintConfig] = useState({ showLogo: true, showCompanyName: true, showSignature: true, showNotes: true, marginTop: 20, marginBottom: 20 });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div><h1 className="text-2xl font-heading font-bold">Settings</h1><p className="text-muted-foreground">Configure your profile and somitee</p></div>
        <HelpModal title="Settings" description="Manage your profile, company info, fees, SMS, payment gateway, and print layout." steps={['Profile: Update your name, email, and password', 'Company: Set company name, logo, address, and signature', 'Fees: Configure monthly and late fees', 'Print: Customize print layout with logo, margins, and fields']} />
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="flex-wrap">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="fees">Fee Setup</TabsTrigger>
          <TabsTrigger value="sms">SMS Config</TabsTrigger>
          <TabsTrigger value="payment">Payment Gateway</TabsTrigger>
          <TabsTrigger value="print">Print Layout</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card><CardHeader><CardTitle className="font-heading">Profile Settings</CardTitle></CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(() => toast.success('Profile updated'))} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={profileForm.control} name="name" render={({ field }) => (
                      <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={profileForm.control} name="email" render={({ field }) => (
                      <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <FormField control={profileForm.control} name="password" render={({ field }) => (
                    <FormItem><FormLabel>New Password</FormLabel><FormControl><Input type="password" placeholder="Leave empty to keep current" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <div className="space-y-1"><Label>Profile Photo</Label><Input type="file" accept="image/*" /></div>
                  <Button type="submit">Save Profile</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company">
          <Card><CardHeader><CardTitle className="font-heading">Company Settings</CardTitle></CardHeader>
            <CardContent>
              <Form {...companyForm}>
                <form onSubmit={companyForm.handleSubmit(() => toast.success('Company settings saved'))} className="space-y-4">
                  <FormField control={companyForm.control} name="companyName" render={({ field }) => (
                    <FormItem><FormLabel>Company Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={companyForm.control} name="address" render={({ field }) => (
                      <FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={companyForm.control} name="phone" render={({ field }) => (
                      <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1"><Label>Company Logo</Label><Input type="file" accept="image/*" /></div>
                    <div className="space-y-1"><Label>Signature Upload</Label><Input type="file" accept="image/*" /></div>
                  </div>
                  <Button type="submit">Save Company Settings</Button>
                </form>
              </Form>
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

        <TabsContent value="print">
          <Card><CardHeader><CardTitle className="font-heading">Print Layout Builder</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">Customize how reports and receipts appear when printed or exported as PDF.</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <Label>Show Logo</Label>
                  <Switch checked={printConfig.showLogo} onCheckedChange={v => setPrintConfig({ ...printConfig, showLogo: v })} />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <Label>Show Company Name</Label>
                  <Switch checked={printConfig.showCompanyName} onCheckedChange={v => setPrintConfig({ ...printConfig, showCompanyName: v })} />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <Label>Show Signature Area</Label>
                  <Switch checked={printConfig.showSignature} onCheckedChange={v => setPrintConfig({ ...printConfig, showSignature: v })} />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <Label>Show Notes</Label>
                  <Switch checked={printConfig.showNotes} onCheckedChange={v => setPrintConfig({ ...printConfig, showNotes: v })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1"><Label>Top Margin (mm)</Label><Input type="number" value={printConfig.marginTop} onChange={e => setPrintConfig({ ...printConfig, marginTop: Number(e.target.value) })} /></div>
                <div className="space-y-1"><Label>Bottom Margin (mm)</Label><Input type="number" value={printConfig.marginBottom} onChange={e => setPrintConfig({ ...printConfig, marginBottom: Number(e.target.value) })} /></div>
              </div>
              <Button onClick={() => toast.success('Print layout saved as template')}>Save Template</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
