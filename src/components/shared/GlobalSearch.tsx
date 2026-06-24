import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Users, Wallet, CreditCard, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { members, transactions } from '@/data/dummyData';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
  type: 'member' | 'transaction' | 'payment';
  id: string;
  title: string;
  subtitle: string;
  path: string;
}

export default function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const results: SearchResult[] = [];
  if (query.length >= 2) {
    const q = query.toLowerCase();
    members.filter(m => m.name.toLowerCase().includes(q) || m.phone.includes(q) || m.shopName.toLowerCase().includes(q))
      .slice(0, 5).forEach(m => results.push({ type: 'member', id: m.id, title: m.name, subtitle: `${m.shopName} • ${m.phone}`, path: `/members/${m.id}` }));
    transactions.filter(t => t.memberName.toLowerCase().includes(q) || t.transactionId?.toLowerCase().includes(q) || t.id.toLowerCase().includes(q))
      .slice(0, 5).forEach(tx => results.push({ type: 'transaction', id: tx.id, title: `${tx.type === 'collection' ? t('nav.collections') : t('nav.expenses')} - ৳${tx.amount}`, subtitle: `${tx.memberName} • ${tx.date} • ${tx.status}`, path: tx.type === 'collection' ? '/collections' : '/expenses' }));
  }

  const grouped = {
    member: results.filter(r => r.type === 'member'),
    transaction: results.filter(r => r.type === 'transaction'),
  };

  const icons = { member: Users, transaction: Wallet, payment: CreditCard };
  const labels = { member: t('search.members'), transaction: t('search.transactions'), payment: t('search.payments') };

  const handleNavigate = (path: string) => {
    navigate(path);
    setOpen(false);
    setMobileOpen(false);
    setQuery('');
  };

  const renderResults = (mobile = false) => (
    <>
      {results.length > 0 && (
        <div className={mobile ? '' : 'absolute top-full mt-1 w-96 bg-popover border border-border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto'}>
          {(Object.keys(grouped) as Array<keyof typeof grouped>).map(key => {
            const items = grouped[key];
            if (!items.length) return null;
            const Icon = icons[key];
            return (
              <div key={key}>
                <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1.5 bg-muted/50">
                  <Icon className="h-3 w-3" /> {labels[key]}
                </div>
                {items.map(item => (
                  <button
                    key={item.id}
                    className="w-full px-3 py-2 text-left hover:bg-accent flex flex-col transition-colors"
                    onClick={() => handleNavigate(item.path)}
                  >
                    <span className="text-sm font-medium">{item.title}</span>
                    <span className="text-xs text-muted-foreground">{item.subtitle}</span>
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      )}
      {query.length >= 2 && results.length === 0 && (
        <div className={mobile ? 'p-4 text-center text-sm text-muted-foreground' : 'absolute top-full mt-1 w-96 bg-popover border border-border rounded-lg shadow-lg z-50 p-4 text-center text-sm text-muted-foreground'}>
          {t('search.noResults', { query })}
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Desktop inline search */}
      <div ref={ref} className="relative hidden md:block">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t('search.placeholder')}
          className="pl-9 w-72 h-9"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => query.length >= 2 && setOpen(true)}
        />
        {query && (
          <button onClick={() => { setQuery(''); setOpen(false); }} className="absolute right-2.5 top-2.5">
            <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </button>
        )}
        {open && renderResults(false)}
      </div>

      {/* Mobile/tablet: icon trigger */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setMobileOpen(true)}
        aria-label={t('search.placeholder')}
      >
        <Search className="h-4 w-4" />
      </Button>

      <Dialog open={mobileOpen} onOpenChange={(o) => { setMobileOpen(o); if (!o) setQuery(''); }}>
        <DialogContent className="top-[10%] translate-y-0 p-0 gap-0 max-w-[95vw] sm:max-w-md">
          <DialogTitle className="sr-only">{t('search.placeholder')}</DialogTitle>
          <div className="relative border-b border-border">
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
            <Input
              autoFocus
              placeholder={t('search.placeholder')}
              className="pl-9 border-0 h-11 focus-visible:ring-0 rounded-none"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          <div className="max-h-[60vh] overflow-y-auto">
            {renderResults(true)}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
