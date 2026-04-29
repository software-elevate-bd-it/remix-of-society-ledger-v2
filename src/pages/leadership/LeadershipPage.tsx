import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useCompanyStore } from '@/stores/companyStore';
import { Crown, Award, Users, Sparkles, Mail, Phone } from 'lucide-react';

interface Person {
  name?: string;
  title?: string;
  photo?: string;
}

function FounderCard({ p, index }: { p: Person; index: number }) {
  return (
    <div className="group relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/40 via-primary/10 to-accent/40 rounded-2xl blur opacity-50 group-hover:opacity-100 transition" />
      <Card className="relative overflow-hidden border-0 bg-card/95 backdrop-blur transition-all duration-300 hover:shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
          {/* Photo */}
          <div className="md:col-span-3 relative bg-gradient-to-br from-primary/15 via-primary/5 to-accent/20 p-6 flex items-center justify-center min-h-[220px]">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(hsl(var(--primary)) 1px, transparent 1px)', backgroundSize: '14px 14px' }} />
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl" />
              <Avatar className="relative h-32 w-32 ring-4 ring-background shadow-xl">
                {p.photo ? <AvatarImage src={p.photo} alt={p.name} /> : null}
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground font-heading text-3xl">
                  {p.name?.charAt(0) || '?'}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-9 p-6 md:p-8 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                <Sparkles className="h-3 w-3 mr-1" />
                Founder #{index + 1}
              </Badge>
              <Badge variant="outline" className="uppercase tracking-wider text-[10px]">
                {p.title}
              </Badge>
            </div>
            <h3 className="font-heading font-bold text-2xl md:text-3xl leading-tight">{p.name || '—'}</h3>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed max-w-2xl">
              A founding member who helped establish the somitee with a vision for community welfare, financial transparency, and long-term sustainability for every member.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-5 pt-5 border-t border-dashed border-border text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5 hover:text-primary transition cursor-pointer">
                <Mail className="h-4 w-4" />
                founder{index + 1}@somitee.com
              </span>
              <span className="flex items-center gap-1.5 hover:text-primary transition cursor-pointer">
                <Phone className="h-4 w-4" />
                +880 17{10 + index} 000 000
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function OfficerCard({ p, icon: Icon, accent }: { p: Person; icon: typeof Crown; accent: string }) {
  return (
    <div className="group relative">
      <div className={`absolute -inset-1 ${accent} rounded-3xl blur-lg opacity-40 group-hover:opacity-70 transition`} />
      <Card className="relative overflow-hidden border-0 shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-5">
          {/* Photo column */}
          <div className="sm:col-span-2 relative bg-gradient-to-br from-primary/20 to-accent/30 min-h-[260px] flex items-center justify-center p-6">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(hsl(var(--primary)) 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl" />
              <Avatar className="relative h-40 w-40 ring-4 ring-background shadow-2xl">
                {p.photo ? <AvatarImage src={p.photo} alt={p.name} /> : null}
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground font-heading text-4xl">
                  {p.name?.charAt(0) || '?'}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Content column */}
          <div className="sm:col-span-3 p-6 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-3">
              <div className={`p-2 rounded-lg ${accent} text-primary-foreground`}>
                <Icon className="h-4 w-4" />
              </div>
              <Badge variant="outline" className="uppercase tracking-wider text-[10px]">
                {p.title}
              </Badge>
            </div>
            <h3 className="font-heading font-bold text-2xl leading-tight">{p.name || '—'}</h3>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              Leading the somitee with vision and dedication. Committed to transparency, member welfare, and sustainable growth of our community.
            </p>
            <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                contact@somitee.com
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function LeadershipPage() {
  const { t } = useTranslation();
  const { company } = useCompanyStore();
  const all = company.founders || [];

  const founders = all.filter((f) => /founder/i.test(f.title || ''));
  const president = all.find((f) => /president/i.test(f.title || ''));
  const secretary = all.find((f) => /secretary/i.test(f.title || ''));

  return (
    <div className="space-y-12 pb-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-background to-accent/20 border p-8 md:p-12">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 15% 20%, hsl(var(--primary) / 0.4) 0%, transparent 40%), radial-gradient(circle at 85% 80%, hsl(var(--accent) / 0.4) 0%, transparent 40%)' }} />
        <div className="relative text-center max-w-2xl mx-auto">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
            <Users className="h-3 w-3 mr-1.5" />
            {t('leadership.title') || 'Our Leadership'}
          </Badge>
          <h1 className="text-3xl md:text-5xl font-heading font-bold tracking-tight">
            Meet the People <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Behind Our Somitee</span>
          </h1>
          <p className="mt-4 text-muted-foreground text-base md:text-lg leading-relaxed">
            Our founders and office bearers bring decades of experience, dedication, and a shared vision to serve every member of our community.
          </p>
          <div className="flex items-center justify-center gap-6 mt-6">
            <div className="text-center">
              <p className="text-2xl font-heading font-bold text-primary">{founders.length}</p>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Founders</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <p className="text-2xl font-heading font-bold text-primary">{(president ? 1 : 0) + (secretary ? 1 : 0)}</p>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Officers</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <p className="text-2xl font-heading font-bold text-primary">{all.length}</p>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Total</p>
            </div>
          </div>
        </div>
      </section>

      {/* Founders */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-2xl">Founders</h2>
            <p className="text-sm text-muted-foreground">The visionaries who started it all</p>
          </div>
          <div className="ml-auto h-px flex-1 bg-gradient-to-r from-border to-transparent hidden md:block" />
        </div>

        {founders.length === 0 ? (
          <Card className="p-12 text-center text-muted-foreground border-dashed">
            No founders added yet. Add them in Settings → Founders.
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {founders.map((f, i) => (
              <FounderCard key={i} p={f} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* Office bearers */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Crown className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-2xl">President & Secretary</h2>
            <p className="text-sm text-muted-foreground">Current office bearers leading day-to-day operations</p>
          </div>
          <div className="ml-auto h-px flex-1 bg-gradient-to-r from-border to-transparent hidden md:block" />
        </div>

        {!president && !secretary ? (
          <Card className="p-12 text-center text-muted-foreground border-dashed">
            No office bearers added yet.
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {president && <OfficerCard p={president} icon={Crown} accent="bg-gradient-to-br from-primary to-primary/60" />}
            {secretary && <OfficerCard p={secretary} icon={Award} accent="bg-gradient-to-br from-accent-foreground/80 to-primary/60" />}
          </div>
        )}
      </section>
    </div>
  );
}
