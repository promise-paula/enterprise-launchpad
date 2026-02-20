import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useSbtcBalance } from '@/hooks/useSbtcBalance';
import { usePrices } from '@/hooks/usePrices';
import { useTransactions } from '@/hooks/useTransactions';
import { formatUsd, formatTokenAmount, formatChangePercent, formatRelativeTime, truncateAddress } from '@/lib/formatters';
import { PriceChart } from '@/components/dashboard/PriceChart';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft, ArrowLeftRight, Clock, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

function StatSkeleton() {
  return (
    <Card className="glass-card">
      <CardContent className="p-6">
        <Skeleton className="h-4 w-20 mb-3" />
        <Skeleton className="h-8 w-36 mb-2" />
        <Skeleton className="h-5 w-24" />
      </CardContent>
    </Card>
  );
}

const txIcon = {
  send: ArrowUpRight,
  receive: ArrowDownLeft,
  swap: ArrowLeftRight,
};
const txColor = {
  send: 'text-destructive',
  receive: 'text-success',
  swap: 'text-primary',
};

export default function Dashboard() {
  const { portfolio, isLoading: portLoading } = usePortfolio();
  const { sbtcBalance, isLoading: sbtcLoading } = useSbtcBalance();
  const { prices, isLoading: priceLoading } = usePrices();
  const { transactions, isLoading: txLoading } = useTransactions();

  const btc = prices.find(p => p.symbol === 'BTC');
  const stx = prices.find(p => p.symbol === 'STX');
  const isLoading = portLoading || sbtcLoading || priceLoading;

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">Portfolio</h1>

      {/* Top stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Portfolio Value */}
        {isLoading || !portfolio ? (
          <StatSkeleton />
        ) : (
          <Card className="glass-card hover-lift gradient-card sm:col-span-2 lg:col-span-1">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Total Value</p>
              <p className="text-3xl font-bold font-mono">{formatUsd(portfolio.totalValue)}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={portfolio.changePercent24h >= 0 ? 'bg-success/15 text-success border-success/30' : 'bg-destructive/15 text-destructive border-destructive/30'}>
                  {portfolio.changePercent24h >= 0 ? <TrendingUp className="mr-1 h-3 w-3" /> : <TrendingDown className="mr-1 h-3 w-3" />}
                  {formatChangePercent(portfolio.changePercent24h)}
                </Badge>
                <span className="text-xs text-muted-foreground">{formatUsd(portfolio.change24h)} 24h</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <Clock className="h-3 w-3" /> Updated {formatRelativeTime(portfolio.lastUpdated)}
              </p>
            </CardContent>
          </Card>
        )}

        {/* sBTC Balance */}
        {isLoading || !sbtcBalance ? (
          <StatSkeleton />
        ) : (
          <Card className="glass-card hover-lift">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">sBTC Balance</p>
              <p className="text-2xl font-bold font-mono">{formatTokenAmount(sbtcBalance.balance)}</p>
              <p className="text-sm text-muted-foreground">{formatUsd(sbtcBalance.balanceUsd)}</p>
              <Badge className={sbtcBalance.changePercent24h >= 0 ? 'bg-success/15 text-success border-success/30 mt-2' : 'bg-destructive/15 text-destructive border-destructive/30 mt-2'}>
                {formatChangePercent(sbtcBalance.changePercent24h)}
              </Badge>
            </CardContent>
          </Card>
        )}

        {/* BTC Price */}
        {isLoading || !btc ? (
          <StatSkeleton />
        ) : (
          <Card className="glass-card hover-lift">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Bitcoin</p>
              <p className="text-2xl font-bold font-mono">{formatUsd(btc.price)}</p>
              <Badge className={btc.changePercent24h >= 0 ? 'bg-success/15 text-success border-success/30 mt-2' : 'bg-destructive/15 text-destructive border-destructive/30 mt-2'}>
                {formatChangePercent(btc.changePercent24h)}
              </Badge>
            </CardContent>
          </Card>
        )}

        {/* STX Price */}
        {isLoading || !stx ? (
          <StatSkeleton />
        ) : (
          <Card className="glass-card hover-lift">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Stacks</p>
              <p className="text-2xl font-bold font-mono">{formatUsd(stx.price)}</p>
              <Badge className={stx.changePercent24h >= 0 ? 'bg-success/15 text-success border-success/30 mt-2' : 'bg-destructive/15 text-destructive border-destructive/30 mt-2'}>
                {formatChangePercent(stx.changePercent24h)}
              </Badge>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Price Chart */}
      <PriceChart />

      {/* Holdings Table */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading || !portfolio ? (
            <div className="space-y-3">
              {[1, 2].map(i => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden sm:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Token</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                      <TableHead className="text-right">Value</TableHead>
                      <TableHead className="text-right">24h Change</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {portfolio.holdings.map(h => (
                      <TableRow key={h.symbol}>
                        <TableCell className="font-medium">{h.token} <span className="text-muted-foreground text-xs">({h.symbol})</span></TableCell>
                        <TableCell className="text-right font-mono">{formatTokenAmount(h.balance, h.symbol === 'STX' ? 2 : 8)}</TableCell>
                        <TableCell className="text-right font-mono">{formatUsd(h.value)}</TableCell>
                        <TableCell className="text-right">
                          <Badge className={h.changePercent24h >= 0 ? 'bg-success/15 text-success border-success/30' : 'bg-destructive/15 text-destructive border-destructive/30'}>
                            {formatChangePercent(h.changePercent24h)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {/* Mobile cards */}
              <div className="sm:hidden space-y-3">
                {portfolio.holdings.map(h => (
                  <div key={h.symbol} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div>
                      <p className="font-medium text-sm">{h.token}</p>
                      <p className="text-xs text-muted-foreground font-mono">{formatTokenAmount(h.balance, h.symbol === 'STX' ? 2 : 8)} {h.symbol}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm">{formatUsd(h.value)}</p>
                      <Badge className={`text-[10px] ${h.changePercent24h >= 0 ? 'bg-success/15 text-success border-success/30' : 'bg-destructive/15 text-destructive border-destructive/30'}`}>
                        {formatChangePercent(h.changePercent24h)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card className="glass-card">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent Transactions</CardTitle>
          <Link to="/dashboard/history" className="text-sm text-primary hover:underline flex items-center gap-1">
            View All <ExternalLink className="h-3 w-3" />
          </Link>
        </CardHeader>
        <CardContent>
          {txLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-14 w-full" />)}
            </div>
          ) : (
            <div className="space-y-2">
              {transactions.slice(0, 6).map(tx => {
                const Icon = txIcon[tx.type];
                return (
                  <div key={tx.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors">
                    <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${txColor[tx.type]} bg-current/10`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm capitalize">{tx.type}</span>
                        <Badge variant={tx.status === 'confirmed' ? 'secondary' : 'outline'} className="text-[10px]">
                          {tx.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {tx.type === 'send' ? `To: ${truncateAddress(tx.to)}` : `From: ${truncateAddress(tx.from)}`}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-sm font-mono ${tx.type === 'receive' ? 'text-success' : ''}`}>
                        {tx.type === 'receive' ? '+' : tx.type === 'send' ? '-' : ''}{formatTokenAmount(tx.amount, tx.token === 'STX' ? 2 : 8)} {tx.token}
                      </p>
                      <p className="text-xs text-muted-foreground">{formatRelativeTime(tx.timestamp)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
