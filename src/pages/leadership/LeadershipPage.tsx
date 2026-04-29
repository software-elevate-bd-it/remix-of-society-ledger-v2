import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useCompanyStore } from '@/stores/companyStore';

interface Person {
  name: string;
  title: string;
  photo?: string;
}

function PersonCard({ p, size = 'md' }: { p: Person; size?: 'lg' | 'md' }) {
  const sizes = size === 'lg' ? 'h-28 w-28 ring-4 ring-primary/20' : 'h-24 w-24 ring-2 ring-border';
  return (
    <div className="flex flex-col items-center text-center gap-2">
      <Avatar className={sizes}>
        {p.photo ? <AvatarImage src={p.photo} alt={p.name} /> : null}
        <AvatarFallback className="bg-primary/10 text-primary font-heading text-lg">
          {p.name?.charAt(0) || '?'}
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="font-heading font-semibold text-sm">{p.name || '—'}</p>
        <p className="text-xs text-muted-foreground">{p.title}</p>
      </div>
    </div>
  );
}

export default function LeadershipPage() {
  const { t } = useTranslation();
  const { company } = useCompanyStore();
  const all = company.founders || [];

  const founders = all.filter((f) => /founder/i.test(f.title));
  const president = all.find((f) => /president/i.test(f.title));
  const secretary = all.find((f) => /secretary/i.test(f.title));
  const officeBearers = [president, secretary].filter(Boolean) as Person[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">{t('leadership.title') || 'Leadership'}</h1>
        <p className="text-muted-foreground">{t('leadership.subtitle') || 'Founders & office bearers of the somitee'}</p>
      </div>

      {/* Founders Card */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg text-center">
            {t('leadership.founders') || 'Founders'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {founders.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              {t('leadership.noFounders') || 'No founders added yet. Add them in Settings → Founders.'}
            </p>
          ) : (
            <div className="flex flex-wrap justify-center gap-8">
              {founders.map((f, i) => (
                <PersonCard key={i} p={f} size="lg" />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* President & Secretary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg text-center">
            {t('leadership.officeBearers') || 'President & Secretary'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {officeBearers.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              {t('leadership.noOfficeBearers') || 'No office bearers added yet.'}
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-xl mx-auto">
              {officeBearers.map((p, i) => (
                <PersonCard key={i} p={p} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
