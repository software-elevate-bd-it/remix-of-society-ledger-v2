import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  Search, Bookmark, BookmarkCheck, CheckCircle2, Circle, ThumbsUp, ThumbsDown,
  Printer, Share2, Link as LinkIcon, BookOpen, ChevronRight, Sparkles, Users, Wallet,
  Gift, Receipt, Landmark, ShieldCheck, Palette, MessageSquare, BarChart3, Download,
  History, Star, ArrowLeft,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { helpCategories, findArticle, allArticles } from '@/data/helpCenterData';
import { useHelpCenterStore } from '@/stores/helpCenterStore';

const ICONS: Record<string, React.ElementType> = {
  Sparkles, Users, Wallet, Gift, Receipt, Landmark, BookOpen, CheckCircle2,
  BarChart3, ShieldCheck, Palette, MessageSquare,
};

export default function HelpCenterPage({ publicView = false }: { publicView?: boolean }) {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [openCats, setOpenCats] = useState<string[]>(helpCategories.map((c) => c.id));
  const store = useHelpCenterStore();

  const all = useMemo(() => allArticles(), []);
  const totalArticles = all.length;
  const completedPct = Math.round((store.completed.length / totalArticles) * 100);

  const filtered = useMemo(() => {
    if (!search.trim()) return null;
    const q = search.toLowerCase();
    return all.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.steps.some((s) => s.toLowerCase().includes(q))
    );
  }, [search, all]);

  const current = articleId ? findArticle(articleId) : null;

  useEffect(() => {
    if (current) store.addRecent(current.article.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleId]);

  const basePath = publicView ? '/docs' : '/help';

  const goTo = (id: string) => navigate(`${basePath}/${id}`);

  const toggleCat = (id: string) =>
    setOpenCats((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const copyLink = () => {
    const url = `${window.location.origin}${basePath}/${current?.article.id}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied');
  };

  const share = async () => {
    const url = `${window.location.origin}${basePath}/${current?.article.id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: current?.article.title, url });
      } catch {/* cancelled */}
    } else {
      copyLink();
    }
  };

  const downloadPdf = () => {
    window.print(); // browsers offer "Save as PDF"
  };

  return (
    <div className={publicView ? 'min-h-screen bg-background' : ''}>
      {publicView && (
        <header className="border-b bg-card sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="font-heading font-bold">Somitee HQ Docs</span>
            </Link>
            <Button asChild variant="outline" size="sm">
              <Link to="/login">Sign in</Link>
            </Button>
          </div>
        </header>
      )}

      <div className={`grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 ${publicView ? 'max-w-7xl mx-auto p-4 lg:p-6' : ''}`}>
        {/* Sidebar */}
        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-6rem)]">
          <div>
            <h2 className="font-heading text-lg font-bold flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Help Center
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Learn every part of Somitee HQ
            </p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9"
            />
          </div>

          <Card className="p-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Onboarding progress</span>
              <span className="font-medium">{store.completed.length}/{totalArticles}</span>
            </div>
            <Progress value={completedPct} className="h-1.5" />
          </Card>

          <ScrollArea className="lg:h-[calc(100vh-22rem)] pr-2">
            <nav className="space-y-1">
              {helpCategories.map((c) => {
                const Icon = ICONS[c.icon] || BookOpen;
                const open = openCats.includes(c.id);
                return (
                  <div key={c.id}>
                    <button
                      onClick={() => toggleCat(c.id)}
                      className="w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-md hover:bg-muted text-sm font-medium"
                    >
                      <span className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-primary" />
                        {c.title}
                      </span>
                      <ChevronRight className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-90' : ''}`} />
                    </button>
                    {open && (
                      <div className="ml-6 mt-1 space-y-0.5 border-l pl-2">
                        {c.articles.map((a) => {
                          const isActive = current?.article.id === a.id;
                          const done = store.completed.includes(a.id);
                          return (
                            <button
                              key={a.id}
                              onClick={() => goTo(a.id)}
                              className={`w-full text-left text-xs px-2 py-1 rounded flex items-center gap-2 transition-colors ${
                                isActive ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted text-muted-foreground'
                              }`}
                            >
                              {done ? <CheckCircle2 className="h-3 w-3 text-success shrink-0" /> : <Circle className="h-3 w-3 shrink-0" />}
                              <span className="truncate">{a.title}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </ScrollArea>

          {store.recent.length > 0 && (
            <Card className="p-3">
              <div className="text-xs font-medium flex items-center gap-1.5 mb-2">
                <History className="h-3.5 w-3.5" /> Recently viewed
              </div>
              <div className="space-y-1">
                {store.recent.slice(0, 5).map((id) => {
                  const a = findArticle(id);
                  if (!a) return null;
                  return (
                    <button
                      key={id}
                      onClick={() => goTo(id)}
                      className="block w-full text-left text-xs text-muted-foreground hover:text-foreground truncate"
                    >
                      • {a.article.title}
                    </button>
                  );
                })}
              </div>
            </Card>
          )}

          {store.bookmarks.length > 0 && (
            <Card className="p-3">
              <div className="text-xs font-medium flex items-center gap-1.5 mb-2">
                <Star className="h-3.5 w-3.5 text-warning" /> Bookmarks
              </div>
              <div className="space-y-1">
                {store.bookmarks.slice(0, 5).map((id) => {
                  const a = findArticle(id);
                  if (!a) return null;
                  return (
                    <button
                      key={id}
                      onClick={() => goTo(id)}
                      className="block w-full text-left text-xs text-muted-foreground hover:text-foreground truncate"
                    >
                      ★ {a.article.title}
                    </button>
                  );
                })}
              </div>
            </Card>
          )}
        </aside>

        {/* Main */}
        <main className="min-w-0">
          {filtered ? (
            <div className="space-y-3">
              <h2 className="text-lg font-heading font-bold">
                Search results <span className="text-muted-foreground font-normal">({filtered.length})</span>
              </h2>
              {filtered.length === 0 && (
                <Card className="p-8 text-center text-muted-foreground">
                  No articles match "{search}".
                </Card>
              )}
              <div className="grid sm:grid-cols-2 gap-3">
                {filtered.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => { setSearch(''); goTo(a.id); }}
                    className="text-left"
                  >
                    <Card className="p-4 hover:border-primary transition-colors h-full">
                      <Badge variant="outline" className="text-[10px] mb-2">{a.categoryTitle}</Badge>
                      <h3 className="font-medium text-sm">{a.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{a.summary}</p>
                    </Card>
                  </button>
                ))}
              </div>
            </div>
          ) : current ? (
            <ArticleView
              article={current.article}
              categoryTitle={current.category.title}
              onNavigate={goTo}
              onBack={() => navigate(basePath)}
              copyLink={copyLink}
              share={share}
              downloadPdf={downloadPdf}
            />
          ) : (
            <Landing onOpen={goTo} />
          )}
        </main>
      </div>
    </div>
  );
}

function Landing({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border p-8">
        <Badge className="mb-3">Documentation</Badge>
        <h1 className="text-3xl font-heading font-bold">How to work the system</h1>
        <p className="text-muted-foreground mt-2 max-w-xl">
          Premium step-by-step guides for every Somitee HQ module — from your first login to running enterprise-grade reports.
        </p>
      </div>

      <div>
        <h2 className="font-heading font-bold text-lg mb-3">Browse by category</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {helpCategories.map((c) => {
            const Icon = ICONS[c.icon] || BookOpen;
            return (
              <Card key={c.id} className="p-4 hover:border-primary transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-md bg-primary/10">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="font-medium text-sm">{c.title}</h3>
                </div>
                <ul className="space-y-1">
                  {c.articles.slice(0, 4).map((a) => (
                    <li key={a.id}>
                      <button
                        onClick={() => onOpen(a.id)}
                        className="text-xs text-muted-foreground hover:text-primary text-left"
                      >
                        → {a.title}
                      </button>
                    </li>
                  ))}
                  {c.articles.length > 4 && (
                    <li className="text-xs text-muted-foreground">+ {c.articles.length - 4} more</li>
                  )}
                </ul>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ArticleView({
  article, categoryTitle, onNavigate, onBack, copyLink, share, downloadPdf,
}: {
  article: ReturnType<typeof findArticle> extends infer T ? T extends null ? never : T['article'] : never;
  categoryTitle: string;
  onNavigate: (id: string) => void;
  onBack: () => void;
  copyLink: () => void;
  share: () => void;
  downloadPdf: () => void;
}) {
  const store = useHelpCenterStore();
  const bookmarked = store.bookmarks.includes(article.id);
  const completed = store.completed.includes(article.id);
  const fb = store.feedback[article.id];

  return (
    <article className="space-y-6 print:space-y-3">
      <div className="flex items-center justify-between gap-2 flex-wrap print:hidden">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-1" /> All articles
        </Button>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" onClick={() => store.toggleCompleted(article.id)}>
            {completed ? <CheckCircle2 className="h-4 w-4 mr-1 text-success" /> : <Circle className="h-4 w-4 mr-1" />}
            {completed ? 'Completed' : 'Mark as complete'}
          </Button>
          <Button variant="outline" size="icon" onClick={() => store.toggleBookmark(article.id)} title="Bookmark">
            {bookmarked ? <BookmarkCheck className="h-4 w-4 text-primary" /> : <Bookmark className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="icon" onClick={copyLink} title="Copy link">
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={share} title="Share">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => window.print()} title="Print">
            <Printer className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={downloadPdf} title="Download PDF">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <header className="space-y-2">
        <Badge variant="outline">{categoryTitle}</Badge>
        <h1 className="text-3xl font-heading font-bold">{article.title}</h1>
        <p className="text-muted-foreground">{article.summary}</p>
      </header>

      <Card className="p-6 bg-muted/30 border-dashed flex items-center justify-center text-xs text-muted-foreground print:hidden">
        🖼️ Screenshot placeholder — add screenshots in <code className="mx-1 px-1 bg-background rounded">helpCenterData.ts</code>
      </Card>

      <section>
        <h2 className="font-heading font-bold text-lg mb-3">Step-by-step</h2>
        <ol className="space-y-3">
          {article.steps.map((s, i) => (
            <li key={i} className="flex gap-3">
              <div className="shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                {i + 1}
              </div>
              <p className="pt-1 text-sm">{s}</p>
            </li>
          ))}
        </ol>
      </section>

      {article.notes && article.notes.length > 0 && (
        <section className="rounded-lg border-l-4 border-warning bg-warning/5 p-4">
          <div className="font-medium text-sm mb-1">⚠️ Important notes</div>
          <ul className="space-y-1 text-sm">
            {article.notes.map((n, i) => (
              <li key={i}>• {n}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="print:hidden">
        <Card className="p-6 border-dashed bg-muted/30 text-center text-xs text-muted-foreground">
          🎬 Video tutorial placeholder — set <code className="mx-1 px-1 bg-background rounded">videoUrl</code> in the article data
        </Card>
      </section>

      {article.faq && article.faq.length > 0 && (
        <section>
          <h2 className="font-heading font-bold text-lg mb-3">FAQ</h2>
          <div className="space-y-2">
            {article.faq.map((f, i) => (
              <Card key={i} className="p-4">
                <div className="font-medium text-sm">{f.q}</div>
                <div className="text-sm text-muted-foreground mt-1">{f.a}</div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {article.related && article.related.length > 0 && (
        <section>
          <h2 className="font-heading font-bold text-lg mb-3">Related articles</h2>
          <div className="grid sm:grid-cols-2 gap-2">
            {article.related.map((id) => {
              const r = findArticle(id);
              if (!r) return null;
              return (
                <button key={id} onClick={() => onNavigate(id)} className="text-left">
                  <Card className="p-3 hover:border-primary">
                    <div className="text-sm font-medium">{r.article.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">{r.article.summary}</div>
                  </Card>
                </button>
              );
            })}
          </div>
        </section>
      )}

      <Separator />

      <section className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="text-sm">
          <span className="text-muted-foreground mr-3">Was this helpful?</span>
          <Button
            variant={fb === 'up' ? 'default' : 'outline'}
            size="sm"
            onClick={() => { store.setFeedback(article.id, 'up'); toast.success('Thanks for the feedback!'); }}
          >
            <ThumbsUp className="h-4 w-4 mr-1" /> Yes
          </Button>
          <Button
            variant={fb === 'down' ? 'default' : 'outline'}
            size="sm"
            className="ml-2"
            onClick={() => { store.setFeedback(article.id, 'down'); toast('We\'ll improve this article.'); }}
          >
            <ThumbsDown className="h-4 w-4 mr-1" /> No
          </Button>
        </div>
        <div className="text-xs text-muted-foreground">Article ID: {article.id}</div>
      </section>
    </article>
  );
}
