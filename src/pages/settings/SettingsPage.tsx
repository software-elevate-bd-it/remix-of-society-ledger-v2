import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import HelpModal from '@/components/shared/HelpModal';
import { toast } from 'sonner';

const profileSchema = z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().optional() });
const companySchema = z.object({ companyName: z.string().min(2), address: z.string().optional(), phone: z.string().optional() });

export default function SettingsPage() {
  const { t } = useTranslation();
  const profileForm = useForm<z.infer<typeof profileSchema>>({ resolver: zodResolver(profileSchema), defaultValues: { name: 'Rahim Uddin', email: 'rahim@banani.com', password: '' } });
  const companyForm = useForm<z.infer<typeof companySchema>>({ resolver: zodResolver(companySchema), defaultValues: { companyName: 'Banani Market Somitee', address: 'Banani, Dhaka', phone: '01711111111' } });
  const [printConfig, setPrintConfig] = useState({ showLogo: true, showCompanyName: true, showSignature: true, showNotes: true, marginTop: 20, marginBottom: 20 });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div><h1 className="text-2xl font-heading font-bold">{t('settings.title')}</h1><p className="text-muted-foreground">{t('settings.subtitle')}</p></div>
        <HelpModal title={t('settings.helpTitle')} description={t('settings.helpDesc')} steps={[t('settings.helpStep1'), t('settings.helpStep2'), t('settings.helpStep3'), t('settings.helpStep4')]} />
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="flex-wrap">
          <TabsTrigger value="profile">{t('settings.profile')}</TabsTrigger>
          <TabsTrigger value="company">{t('settings.company')}</TabsTrigger>
          <TabsTrigger value="fees">{t('settings.feeSetup')}</TabsTrigger>
          <TabsTrigger value="sms">{t('settings.smsConfig')}</TabsTrigger>
          <TabsTrigger value="payment">{t('settings.paymentGateway')}</TabsTrigger>
          <TabsTrigger value="print">{t('settings.printLayout')}</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card><CardHeader><CardTitle className="font-heading">{t('settings.profileSettings')}</CardTitle></CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(() => toast.success(t('settings.profileUpdated')))} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={profileForm.control} name="name" render={({ field }) => (<FormItem><FormLabel>{t('common.name')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={profileForm.control} name="email" render={({ field }) => (<FormItem><FormLabel>{t('common.email')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </div>
                  <FormField control={profileForm.control} name="password" render={({ field }) => (<FormItem><FormLabel>{t('settings.newPassword')}</FormLabel><FormControl><Input type="password" placeholder={t('settings.keepCurrent')} {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <div className="space-y-1"><Label>{t('settings.profilePhoto')}</Label><Input type="file" accept="image/*" /></div>
                  <Button type="submit">{t('common.save')}</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company">
          <Card><CardHeader><CardTitle className="font-heading">{t('settings.companySettings')}</CardTitle></CardHeader>
            <CardContent>
              <Form {...companyForm}>
                <form onSubmit={companyForm.handleSubmit(() => toast.success(t('settings.companySaved')))} className="space-y-4">
                  <FormField control={companyForm.control} name="companyName" render={({ field }) => (<FormItem><FormLabel>{t('settings.companyName')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={companyForm.control} name="address" render={({ field }) => (<FormItem><FormLabel>{t('common.address')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={companyForm.control} name="phone" render={({ field }) => (<FormItem><FormLabel>{t('common.phone')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1"><Label>{t('settings.companyLogo')}</Label><Input type="file" accept="image/*" /></div>
                    <div className="space-y-1"><Label>{t('settings.signatureUpload')}</Label><Input type="file" accept="image/*" /></div>
                  </div>
                  <Button type="submit">{t('common.save')}</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fees">
          <Card><CardHeader><CardTitle className="font-heading">{t('settings.feeConfiguration')}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1"><Label>{t('members.monthlyFee')} (৳)</Label><Input type="number" defaultValue={500} /></div>
                <div className="space-y-1"><Label>{t('settings.lateFee')} (৳)</Label><Input type="number" defaultValue={100} /></div>
                <div className="space-y-1"><Label>{t('settings.gracePeriod')}</Label><Input type="number" defaultValue={7} /></div>
              </div>
              <Button onClick={() => toast.success(t('settings.feeSaved'))}>{t('common.save')}</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sms">
          <Card><CardHeader><CardTitle className="font-heading">{t('settings.smsApiConfiguration')}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1"><Label>{t('settings.apiProvider')}</Label><Input defaultValue="Bangla SMS" /></div>
              <div className="space-y-1"><Label>{t('settings.apiKey')}</Label><Input type="password" placeholder={t('settings.apiKey')} /></div>
              <div className="space-y-1"><Label>{t('settings.senderId')}</Label><Input defaultValue="SomiteeHQ" /></div>
              <Button onClick={() => toast.success(t('settings.smsSaved'))}>{t('common.save')}</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card><CardHeader><CardTitle className="font-heading">{t('settings.paymentGateway')}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1"><Label>{t('settings.storeId')}</Label><Input placeholder="Store ID" /></div>
              <div className="space-y-1"><Label>{t('settings.storePassword')}</Label><Input type="password" placeholder="Store password" /></div>
              <Button onClick={() => toast.success(t('settings.paymentSaved'))}>{t('common.save')}</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="print">
          <Card><CardHeader><CardTitle className="font-heading">{t('settings.printLayoutBuilder')}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{t('settings.printLayoutDesc')}</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50"><Label>{t('settings.showLogo')}</Label><Switch checked={printConfig.showLogo} onCheckedChange={v => setPrintConfig({ ...printConfig, showLogo: v })} /></div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50"><Label>{t('settings.showCompanyName')}</Label><Switch checked={printConfig.showCompanyName} onCheckedChange={v => setPrintConfig({ ...printConfig, showCompanyName: v })} /></div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50"><Label>{t('settings.showSignature')}</Label><Switch checked={printConfig.showSignature} onCheckedChange={v => setPrintConfig({ ...printConfig, showSignature: v })} /></div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50"><Label>{t('settings.showNotes')}</Label><Switch checked={printConfig.showNotes} onCheckedChange={v => setPrintConfig({ ...printConfig, showNotes: v })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1"><Label>{t('settings.topMargin')}</Label><Input type="number" value={printConfig.marginTop} onChange={e => setPrintConfig({ ...printConfig, marginTop: Number(e.target.value) })} /></div>
                <div className="space-y-1"><Label>{t('settings.bottomMargin')}</Label><Input type="number" value={printConfig.marginBottom} onChange={e => setPrintConfig({ ...printConfig, marginBottom: Number(e.target.value) })} /></div>
              </div>
              <Button onClick={() => toast.success(t('settings.templateSaved'))}>{t('settings.saveTemplate')}</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
