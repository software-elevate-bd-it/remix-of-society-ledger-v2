import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/authStore';
import { useCompanyStore } from '@/stores/companyStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Globe, ChevronDown, ChevronUp, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { DEMO_USERS } from '@/data/demoUsers';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(true);
  const login = useAuthStore((s) => s.login);
  const { company } = useCompanyStore();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        toast.success(t('auth.loginSuccess', 'Logged in successfully'));
        navigate('/dashboard');
      } else {
        toast.error(t('auth.invalidCredentials', 'Invalid credentials'));
      }
    } catch (error) {
      toast.error(t('auth.loginError', 'Login failed. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = async (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setIsLoading(true);
    try {
      const success = await login(demoEmail, demoPassword);
      if (success) {
        toast.success(`Logged in as ${demoEmail.split('@')[0]}`);
        navigate('/dashboard');
      } else {
        toast.error('Demo login failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const copyCreds = (e: React.MouseEvent, demoEmail: string, demoPassword: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${demoEmail} / ${demoPassword}`);
    toast.success('Credentials copied');
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
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t('common.loading', 'Loading...') : t('auth.login')}
            </Button>
            <div className="flex justify-between text-sm">
              <Link to="/forgot-password" className="text-primary hover:underline">{t('auth.forgotPassword')}</Link>
              <Link to="/register" className="text-primary hover:underline">{t('auth.register')}</Link>
            </div>
          </form>

          {/* Demo accounts panel */}
          <div className="mt-6 border-t pt-4">
            <button
              type="button"
              onClick={() => setShowDemo((v) => !v)}
              className="flex items-center justify-between w-full text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>🚀 Quick Demo Login ({DEMO_USERS.length} users)</span>
              {showDemo ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {showDemo && (
              <div className="mt-3 space-y-1.5 max-h-72 overflow-y-auto pr-1">
                {DEMO_USERS.map((u) => (
                  <button
                    key={u.email}
                    type="button"
                    disabled={isLoading}
                    onClick={() => quickLogin(u.email, u.password)}
                    className="group w-full text-left p-2.5 rounded-md border border-border hover:border-primary hover:bg-primary/5 transition-all disabled:opacity-50"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{u.label}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">{u.user.role}</span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{u.description}</p>
                        <p className="text-[11px] text-muted-foreground/80 font-mono truncate mt-0.5">{u.email} / {u.password}</p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => copyCreds(e, u.email, u.password)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-background transition-opacity"
                        title="Copy credentials"
                      >
                        <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

