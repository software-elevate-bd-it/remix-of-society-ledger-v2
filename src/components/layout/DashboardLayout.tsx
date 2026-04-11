import { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore, UserRole } from '@/stores/authStore';
import {
  LayoutDashboard, Users, Wallet, Receipt, Building2, CreditCard,
  FileText, Settings, LogOut, Menu, X, ChevronRight, Search,
  Bell, Sun, Moon, MessageSquare, BarChart3, BookOpen, Landmark,
  ShieldCheck, Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  roles: UserRole[];
  badge?: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['super_admin', 'main_user', 'member'] },
  { label: 'Somitee Management', path: '/somitees', icon: Building2, roles: ['super_admin'] },
  { label: 'Subscriptions', path: '/subscriptions', icon: CreditCard, roles: ['super_admin'] },
  { label: 'Global Analytics', path: '/analytics', icon: BarChart3, roles: ['super_admin'] },
  { label: 'Global Settings', path: '/global-settings', icon: Globe, roles: ['super_admin'] },
  { label: 'Members', path: '/members', icon: Users, roles: ['main_user'] },
  { label: 'Collections', path: '/collections', icon: Wallet, roles: ['main_user', 'member'] },
  { label: 'Expenses', path: '/expenses', icon: Receipt, roles: ['main_user'] },
  { label: 'Ledger', path: '/ledger', icon: BookOpen, roles: ['main_user'] },
  { label: 'Bank Accounts', path: '/bank-accounts', icon: Landmark, roles: ['main_user'] },
  { label: 'Cash Book', path: '/cashbook', icon: FileText, roles: ['main_user'] },
  { label: 'Payments', path: '/payments', icon: CreditCard, roles: ['main_user', 'member'] },
  { label: 'Reports', path: '/reports', icon: BarChart3, roles: ['main_user'] },
  { label: 'SMS', path: '/sms', icon: MessageSquare, roles: ['main_user'] },
  { label: 'My Ledger', path: '/my-ledger', icon: BookOpen, roles: ['member'] },
  { label: 'Settings', path: '/settings', icon: Settings, roles: ['main_user', 'member'] },
];

export default function DashboardLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const filteredNav = navItems.filter((item) => user && item.roles.includes(user.role));

  const toggleDark = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const breadcrumbs = location.pathname.split('/').filter(Boolean);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 border-r border-sidebar-border bg-sidebar flex flex-col`}>
        <div className="flex items-center gap-2 p-4 border-b border-sidebar-border">
          <ShieldCheck className="h-7 w-7 text-primary shrink-0" />
          {sidebarOpen && <h1 className="font-heading text-lg font-bold text-sidebar-foreground truncate">Somitee<span className="text-primary">HQ</span></h1>}
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
          {filteredNav.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent'
                }`}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {sidebarOpen && <span className="truncate">{item.label}</span>}
                {sidebarOpen && item.badge && (
                  <Badge variant="secondary" className="ml-auto text-xs">{item.badge}</Badge>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <Button variant="ghost" size="sm" className="w-full justify-start text-destructive" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            {sidebarOpen && 'Logout'}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
            <div className="hidden md:flex items-center text-sm text-muted-foreground">
              <Link to="/dashboard" className="hover:text-foreground">Home</Link>
              {breadcrumbs.map((crumb, i) => (
                <span key={i} className="flex items-center">
                  <ChevronRight className="h-3 w-3 mx-1" />
                  <span className={i === breadcrumbs.length - 1 ? 'text-foreground font-medium capitalize' : 'capitalize'}>
                    {crumb.replace(/-/g, ' ')}
                  </span>
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative hidden md:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-9 w-64 h-9" />
            </div>
            <Button variant="ghost" size="icon" onClick={toggleDark}>
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-0.5 -right-0.5 h-3 w-3 bg-destructive rounded-full text-[8px] text-destructive-foreground flex items-center justify-center">3</span>
            </Button>

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
                  <Settings className="h-4 w-4 mr-2" /> Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
