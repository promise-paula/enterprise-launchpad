import { Outlet, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/hooks/useTheme';
import { useNetwork } from '@/hooks/useNetwork';
import { useWallet } from '@/hooks/useWallet';
import { truncateAddress } from '@/lib/formatters';
import {
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import {
  Sun,
  Moon,
  Wallet,
  LayoutDashboard,
  Clock,
  Bell,
  Settings,
} from 'lucide-react';

// Bottom nav items for mobile
const navItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'History', url: '/dashboard/history', icon: Clock },
  { title: 'Alerts', url: '/dashboard/notifications', icon: Bell },
  { title: 'Settings', url: '/settings', icon: Settings },
];

export default function DashboardLayout() {
  const { theme, setTheme } = useTheme();
  const { network } = useNetwork();
  const { wallet } = useWallet();
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <AppSidebar />
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="sticky top-0 z-40 h-16 glass-card border-b border-border/50 flex items-center px-4 gap-3">
            <SidebarTrigger className="hidden md:inline-flex" />
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-gradient-primary flex items-center justify-center md:hidden">
                <span className="text-xs font-bold text-primary-foreground">₿</span>
              </div>
              <span className="font-bold md:hidden">sBTC</span>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Badge
                variant="outline"
                className={
                  network === 'mainnet'
                    ? 'border-success/40 text-success text-xs'
                    : 'border-warning/40 text-warning text-xs'
                }
              >
                {network === 'mainnet' ? 'Mainnet' : 'Testnet'}
              </Badge>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>

              {wallet.isConnected && wallet.address && (
                <Badge variant="secondary" className="font-mono text-xs hidden sm:inline-flex">
                  <Wallet className="mr-1 h-3 w-3" />
                  {truncateAddress(wallet.address)}
                </Badge>
              )}
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
            <Outlet />
          </main>

          {/* Mobile Bottom Nav */}
          <nav className="md:hidden fixed bottom-0 inset-x-0 h-16 glass-card border-t border-border/50 flex items-center justify-around z-40">
            {navItems.map(item => {
              const isActive = location.pathname === item.url;
              return (
                <Link
                  key={item.url}
                  to={item.url}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[64px] ${
                    isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                  aria-label={item.title}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-[10px] font-medium">{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </SidebarProvider>
  );
}
