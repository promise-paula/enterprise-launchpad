import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { usePrices } from '@/hooks/usePrices';
import { useTheme } from '@/hooks/useTheme';
import { formatUsd, formatChangePercent } from '@/lib/formatters';
import { StaggerContainer } from '@/components/layout/StaggerContainer';
import { StaggerItem } from '@/components/layout/StaggerItem';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  Layers,
  Wallet,
  TrendingUp,
  ArrowRight,
  Sun,
  Moon,
  Github,
  Twitter,
  FileText,
  Menu,
  X,
} from 'lucide-react';

const features = [
  {
    icon: BarChart3,
    title: 'Portfolio Analytics',
    desc: 'Real-time tracking of your sBTC holdings with detailed performance metrics and interactive charts.',
  },
  {
    icon: Layers,
    title: 'DeFi Positions',
    desc: 'Monitor your positions across ALEX, Zest, BitFlow, and StackingDAO in one unified dashboard.',
  },
  {
    icon: Wallet,
    title: 'Multi-Wallet Support',
    desc: 'Watch any Stacks address and aggregate multiple wallets into a single portfolio view.',
  },
];

const heroVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const heroItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

export default function LandingPage() {
  const { prices, isLoading } = usePrices();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const btc = prices.find(p => p.symbol === 'BTC');
  const stx = prices.find(p => p.symbol === 'STX');

  useEffect(() => {
    const el = document.getElementById('features');
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setActiveSection(entry.isIntersecting ? 'features' : ''),
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scrollToFeatures = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    setTimeout(() => {
      document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-hero scroll-smooth">
      {/* Nav */}
      <header className="fixed top-0 inset-x-0 z-50 glass-card border-b border-border/50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">₿</span>
            </div>
            <span className="font-bold text-lg">sBTC Tracker</span>
          </div>
          <nav className="hidden sm:flex items-center gap-6">
            <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
            <a href="#features" onClick={scrollToFeatures} className={cn("text-sm transition-colors", activeSection === 'features' ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground")}>Features</a>
            <a href="https://docs.stacks.co" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Docs</a>
          </nav>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button asChild className="bg-gradient-primary hover:opacity-90 animate-pulse-glow hidden sm:inline-flex">
              <Link to="/dashboard">Connect Wallet</Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="sm:hidden overflow-hidden border-t border-border/50"
            >
              <div className="container flex flex-col gap-3 py-4">
                <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                <a href="#features" onClick={scrollToFeatures} className={cn("text-sm transition-colors py-2", activeSection === 'features' ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground")}>Features</a>
                <a href="https://docs.stacks.co" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2">Docs</a>
                <Button asChild className="bg-gradient-primary hover:opacity-90 w-full mt-1">
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>Connect Wallet</Link>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
        {/* Hero */}
        <section className="pt-32 pb-20 px-4">
          <motion.div
            className="container max-w-4xl text-center"
            variants={heroVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={heroItemVariants}>
              <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm">
                <TrendingUp className="mr-1.5 h-3.5 w-3.5" /> Powered by Stacks
              </Badge>
            </motion.div>
            <motion.h1 variants={heroItemVariants} className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
              Track Your{' '}
              <span className="text-gradient-primary">sBTC Portfolio</span>
            </motion.h1>
            <motion.p variants={heroItemVariants} className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Monitor your sBTC holdings, DeFi positions, and transaction history — all in one beautifully crafted dashboard.
            </motion.p>
            <motion.div variants={heroItemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90 text-base px-8 animate-pulse-glow">
                <Link to="/dashboard">
                  Connect Wallet <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-base px-8" onClick={scrollToFeatures}>
                Learn More
              </Button>
            </motion.div>
          </motion.div>
        </section>

        {/* Live Stats */}
        <section className="py-12 px-4">
          <StaggerContainer className="container max-w-4xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[btc, stx].map((coin, i) =>
                coin ? (
                  <StaggerItem key={coin.symbol} enableHover>
                    <Card className="glass-card">
                      <CardContent className="flex items-center justify-between p-6">
                        <div>
                          <p className="text-sm text-muted-foreground">{coin.name}</p>
                          <p className="text-2xl font-bold font-mono">{formatUsd(coin.price)}</p>
                        </div>
                        <Badge
                          className={
                            coin.changePercent24h >= 0
                              ? 'bg-success/15 text-success border-success/30'
                              : 'bg-destructive/15 text-destructive border-destructive/30'
                          }
                        >
                          {formatChangePercent(coin.changePercent24h)}
                        </Badge>
                      </CardContent>
                    </Card>
                  </StaggerItem>
                ) : (
                  <StaggerItem key={`skeleton-${i}`}>
                    <Card className="glass-card">
                      <CardContent className="p-6">
                        <div className="h-6 w-20 animate-shimmer rounded mb-2" />
                        <div className="h-8 w-32 animate-shimmer rounded" />
                      </CardContent>
                    </Card>
                  </StaggerItem>
                )
              )}
            </div>
          </StaggerContainer>
        </section>

        {/* Features */}
        <section id="features" className="py-20 px-4 scroll-mt-20">
          <div className="container max-w-5xl">
            <motion.h2
              className="text-3xl sm:text-4xl font-bold text-center mb-4"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: 'easeOut' as const }}
            >
              Everything You Need
            </motion.h2>
            <motion.p
              className="text-center text-muted-foreground mb-12 max-w-xl mx-auto"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' as const }}
            >
              A comprehensive toolkit for managing and monitoring your sBTC investments on the Stacks blockchain.
            </motion.p>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((f) => (
                <StaggerItem key={f.title} enableHover>
                  <Card className="glass-card gradient-card h-full">
                    <CardContent className="p-8">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                        <f.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-4">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2026 sBTC Portfolio Tracker. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="https://docs.stacks.co" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors flex items-center gap-1">
              <FileText className="h-3.5 w-3.5" /> Docs
            </a>
            <a href="https://github.com/stacks-network" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors flex items-center gap-1">
              <Github className="h-3.5 w-3.5" /> GitHub
            </a>
            <a href="https://twitter.com/Stacks" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors flex items-center gap-1">
              <Twitter className="h-3.5 w-3.5" /> Twitter
            </a>
            <span className="text-xs opacity-60">v1.0.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
