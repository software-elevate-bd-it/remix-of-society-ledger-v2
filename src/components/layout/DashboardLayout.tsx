import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore, UserRole } from '@/stores/authStore';
import {
  LayoutDashboard, Users, Wallet, Receipt, Building2, CreditCard,
  FileText, Settings, LogOut, Menu, X, ChevronRight, ChevronDown,
  Bell, Sun, Moon, MessageSquare, BarChart3, BookOpen, Landmark,
  ShieldCheck, Globe, HelpCircle, TrendingUp, TrendingDown, DollarSign, Banknote, UserCheck, UserPlus, ClipboardList, Inbox,
  Globe2, Facebook, Phone, MessageCircle, Cpu, Palette, Sparkles
} from 'lucide-react';
import GlobalSearch from '@/components/shared/GlobalSearch';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';
import WelcomeModal from '@/components/shared/WelcomeModal';
import AboutDeveloperModal from '@/components/shared/AboutDeveloperModal';
import AppFooter from '@/components/shared/AppFooter';
import { useCompanyStore } from '@/stores/companyStore';
import { useApprovalsStore } from '@/stores/approvalsStore';
import { usePermissions } from '@/hooks/usePermissions';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

function useIsBelowDesktop() {
  const [below, setBelow] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 1023px)');
    const onChange = () => setBelow(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);
  return below;
}

interface NavItem {
  labelKey: string;
  path: string;
  icon: React.ElementType;
  roles: UserRole[];
  /** Any of these permissions also unlocks this nav item for managed users. */
  permissions?: string[];
  badge?: string;
  children?: { labelKey: string; path: string; icon: React.ElementType }[];
}

const navItems: NavItem[] = [
  { labelKey: 'nav.leadership', path: '/leadership', icon: Users, roles: ['super_admin', 'main_user', 'member'] },
  { labelKey: 'nav.analytics', path: '/dashboard', icon: LayoutDashboard, roles: ['super_admin', 'main_user', 'member'] },
  { labelKey: 'nav.somiteeManagement', path: '/somitees', icon: Building2, roles: ['super_admin'] },
  { labelKey: 'nav.subscriptions', path: '/subscriptions', icon: CreditCard, roles: ['super_admin'] },
  { labelKey: 'nav.globalAnalytics', path: '/analytics', icon: BarChart3, roles: ['super_admin'] },
  { labelKey: 'nav.globalSettings', path: '/global-settings', icon: Globe, roles: ['super_admin'] },
  { labelKey: 'nav.memberRegistration', path: '/member-registration', icon: UserPlus, roles: ['main_user'], permissions: ['member.create'] },
  { labelKey: 'nav.memberRequests', path: '/member-requests', icon: UserCheck, roles: ['main_user'], permissions: ['member.approve'] },
  { labelKey: 'nav.collections', path: '/collections', icon: Wallet, roles: ['main_user', 'member'], permissions: ['collection.create', 'collection.approve'] },
  { labelKey: 'nav.expenses', path: '/expenses', icon: Receipt, roles: ['main_user'], permissions: ['expense.create', 'expense.approve'] },
  { labelKey: 'nav.income', path: '/income', icon: DollarSign, roles: ['main_user'], permissions: ['income.create', 'income.approve'] },
  { labelKey: 'nav.ledger', path: '/ledger', icon: BookOpen, roles: ['main_user'], permissions: ['reports.view'] },
  { labelKey: 'nav.bankAccounts', path: '/bank-accounts', icon: Landmark, roles: ['main_user'], permissions: ['bank.create', 'bank.approve'] },
  { labelKey: 'nav.cashBook', path: '/cashbook', icon: FileText, roles: ['main_user'], permissions: ['reports.view'] },
  // { labelKey: 'nav.payments', path: '/payments', icon: CreditCard, roles: ['main_user', 'member'] },
  // { labelKey: 'nav.drawSavings', path: '/draw-savings', icon: Sparkles, roles: ['super_admin', 'main_user', 'member'] },
  {
    labelKey: 'nav.reports', path: '/reports', icon: BarChart3, roles: ['main_user'], permissions: ['reports.view'],
    children: [
      { labelKey: 'reports.incomeVsExpense', path: '/reports/income-expense', icon: TrendingUp },
      { labelKey: 'reports.cashFlow', path: '/reports/cash-flow', icon: DollarSign },
      { labelKey: 'reports.memberDue', path: '/reports/member-due', icon: Users },
      { labelKey: 'reports.bankVsCash', path: '/reports/bank-cash', icon: Banknote },
      { labelKey: 'reports.collectionReport', path: '/reports/collection', icon: ClipboardList },
    ]
  },
  { labelKey: 'nav.sms', path: '/sms', icon: MessageSquare, roles: ['main_user'] },
  { labelKey: 'nav.approvals', path: '/approvals', icon: Inbox, roles: ['main_user'], permissions: ['collection.approve', 'expense.approve', 'bank.approve', 'member.approve'] },
  { labelKey: 'nav.users', path: '/users', icon: UserPlus, roles: ['main_user'] },
  { labelKey: 'nav.roles', path: '/roles', icon: ShieldCheck, roles: ['main_user'], permissions: ['roles.manage'] },
  { labelKey: 'nav.myLedger', path: '/my-ledger', icon: BookOpen, roles: ['member'] },
  { labelKey: 'nav.settings', path: '/settings', icon: Settings, roles: ['main_user', 'member'] },
  { labelKey: 'nav.themeStudio', path: '/theme-studio', icon: Palette, roles: ['super_admin', 'main_user'] },
  // { labelKey: 'nav.faqHelp', path: '/faq', icon: HelpCircle, roles: ['super_admin', 'main_user', 'member'] },
  // { labelKey: 'nav.howToWork', path: '/help', icon: BookOpen, roles: ['super_admin', 'main_user', 'member'] },
  // { labelKey: 'nav.userManual', path: '/user-manual', icon: BookOpen, roles: ['super_admin', 'main_user', 'member'] },
  // { labelKey: 'nav.apiDocs', path: '/api-docs', icon: FileText, roles: ['super_admin', 'main_user'] },
];

export default function DashboardLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { company } = useCompanyStore();

  // console.log('Current company', company);
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [openMenus, setOpenMenus] = useState<string[]>(['/reports']);
  const [aboutOpen, setAboutOpen] = useState(false);
  const isBelowDesktop = useIsBelowDesktop();

  const pendingApprovals = useApprovalsStore(
    (s) => s.items.filter(i => i.status === 'pending').length
  );

  const { has } = usePermissions();

  const filteredNav = navItems
    .filter((item) => {
      if (!user) return false;
      if (item.roles.includes(user.role)) return true;
      if (item.permissions && item.permissions.some((p) => has(p as any))) return true;
      return false;
    })
    .map((item) => item.path === '/approvals' && pendingApprovals > 0 ? { ...item, badge: String(pendingApprovals) } : item);

  const toggleDark = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = (path: string) => {
    setOpenMenus(prev => prev.includes(path) ? prev.filter(p => p !== path) : [...prev, path]);
  };

  const breadcrumbs = location.pathname.split('/').filter(Boolean);

  const renderSidebarContent = (expanded: boolean, onNavigate?: () => void) => (
    <div className="flex h-full flex-col bg-sidebar">
      <div className="flex items-center gap-2 p-4 border-b border-sidebar-border">
        {company.logo ? (
          <img src={company.logo} alt={company.name} className="h-7 w-7 object-contain rounded shrink-0" />
        ) : (
          <ShieldCheck className="h-7 w-7 text-primary shrink-0" />
        )}
        {expanded && <h1 className="font-heading text-sm font-bold text-sidebar-foreground truncate">{company.name}</h1>}
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {filteredNav.map((item) => {
          const active = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          const hasChildren = item.children && item.children.length > 0;
          const isOpen = openMenus.includes(item.path);

          if (hasChildren && expanded) {
            return (
              <Collapsible key={item.path} open={isOpen} onOpenChange={() => toggleMenu(item.path)}>
                <CollapsibleTrigger asChild>
                  <button
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors w-full ${
                      active ? 'bg-primary/10 text-primary' : 'text-sidebar-foreground hover:bg-sidebar-accent'
                    }`}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span className="truncate flex-1 text-left">{t(item.labelKey)}</span>
                    <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-4 mt-1 space-y-1">
                  {item.children!.map((child) => {
                    const childActive = location.pathname === child.path;
                    return (
                      <Link
                        key={child.path}
                        to={child.path}
                        onClick={onNavigate}
                        className={`flex items-center gap-3 px-3 py-1.5 rounded-md text-sm transition-colors ${
                          childActive ? 'bg-primary text-primary-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent'
                        }`}
                      >
                        <child.icon className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{t(child.labelKey)}</span>
                      </Link>
                    );
                  })}
                </CollapsibleContent>
              </Collapsible>
            );
          }

          return (
            <Link
              key={item.path}
              to={hasChildren ? item.children![0].path : item.path}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                active ? 'bg-primary text-primary-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent'
              }`}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {expanded && <span className="truncate">{t(item.labelKey)}</span>}
              {expanded && item.badge && (
                <Badge variant="secondary" className="ml-auto text-xs">{item.badge}</Badge>
              )}
            </Link>
          );
        })}

        <button
          onClick={() => { setAboutOpen(true); onNavigate?.(); }}
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors w-full text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <Cpu className="h-4 w-4 shrink-0" />
          {expanded && <span className="truncate text-left flex-1">About Developer</span>}
        </button>

        {onNavigate && (
          <div className="pt-3 mt-3 border-t border-sidebar-border space-y-1">
            <div className="px-3 pb-1 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
              Preferences
            </div>
            <div className="flex items-center gap-2 px-3 py-1">
              <LanguageSwitcher />
              <Button variant="ghost" size="icon" onClick={toggleDark}>
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        )}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <Button variant="ghost" size="sm" className="w-full justify-start text-destructive" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          {expanded && t('common.logout')}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <WelcomeModal />
      <AboutDeveloperModal open={aboutOpen} onOpenChange={setAboutOpen} />

      {/* Desktop sidebar (lg and up) */}
      <aside className={`hidden lg:flex ${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 border-r border-sidebar-border bg-sidebar flex-col`}>
        {renderSidebarContent(sidebarOpen)}
      </aside>

      {/* Mobile/Tablet drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-72 bg-sidebar border-sidebar-border [&>button]:text-sidebar-foreground">
          {renderSidebarContent(true, () => setMobileOpen(false))}
        </SheetContent>
      </Sheet>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => isBelowDesktop ? setMobileOpen(true) : setSidebarOpen(!sidebarOpen)}
            >
              {(!isBelowDesktop && sidebarOpen) ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
            <div className="flex items-center text-sm text-muted-foreground min-w-0">
              <Link to="/dashboard" className="hover:text-foreground shrink-0">{t('common.home')}</Link>
              {breadcrumbs.map((crumb, i) => (
                <span key={i} className="flex items-center min-w-0">
                  <ChevronRight className="h-3 w-3 mx-1 shrink-0" />
                  <span className={`truncate ${i === breadcrumbs.length - 1 ? 'text-foreground font-medium capitalize' : 'capitalize'}`}>
                    {crumb.replace(/-/g, ' ')}
                  </span>
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <GlobalSearch />
            {/* Desktop-only header actions; on mobile/tablet these live in the drawer */}
            <div className="hidden lg:flex items-center gap-2">
              <LanguageSwitcher />
              <Button variant="ghost" size="icon" onClick={toggleDark}>
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-2">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {user?.name?.charAt(0) ?? 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline text-sm font-medium">{user?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>
                  <p className="text-xs text-muted-foreground capitalize">{user?.role?.replace('_', ' ')}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className="h-4 w-4 mr-2" /> {t('common.settings')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" /> {t('common.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>

        <AppFooter />
      </div>
    </div>
  );
}

