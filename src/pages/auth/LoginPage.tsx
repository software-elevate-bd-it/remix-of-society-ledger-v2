import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/authStore';
import { useCompanyStore } from '@/stores/companyStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Globe } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useAuthStore((s) => s.login);
  const { company } = useCompanyStore();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      toast.success('Logged in successfully');
      navigate('/dashboard');
    } else {
      toast.error('Invalid credentials');
    }
  };

  const toggleLang = () => i18n.changeLanguage(i18n.language === 'en' ? 'bn' : 'en');

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="p-3 rounded-xl bg-primary/10">
              {company.logo ? (
                <img src={company.logo} alt={company.name} className="h-8 w-8 object-contain rounded" />
              ) : (
                <ShieldCheck className="h-8 w-8 text-primary" />
              )}
            </div>
          </div>
          <CardTitle className="font-heading text-2xl">{company.name}</CardTitle>
          <CardDescription>{t('auth.loginSubtitle')}</CardDescription>
          <Button variant="ghost" size="sm" onClick={toggleLang} className="mx-auto">
            <Globe className="h-4 w-4 mr-1" /> {i18n.language === 'en' ? t('common.bangla') : t('common.english')}
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('common.email')}</Label>
              <Input id="email" type="email" placeholder={t('auth.emailPlaceholder')} value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('common.password')}</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full">{t('auth.login')}</Button>
            <div className="flex justify-between text-sm">
              <Link to="/forgot-password" className="text-primary hover:underline">{t('auth.forgotPassword')}</Link>
              <Link to="/register" className="text-primary hover:underline">{t('auth.register')}</Link>
            </div>
          </form>
          <div className="mt-6 p-3 rounded-lg bg-muted text-xs space-y-1">
            <p className="font-medium text-muted-foreground">{t('auth.demoCredentials')}:</p>
            <p><span className="font-medium">{t('auth.superAdmin')}:</span> admin@system.com / admin123</p>
            <p><span className="font-medium">{t('auth.mainUser')}:</span> manager@somitee.com / manager123</p>
            <p><span className="font-medium">{t('auth.member')}:</span> member@shop.com / member123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
