import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { usePrices } from '@/hooks/usePrices';
import type { TimeInterval } from '@/types';
import { formatUsd } from '@/lib/formatters';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const intervals: TimeInterval[] = ['1H', '24H', '7D', '30D'];

function generateChartData(sparkline: number[], interval: TimeInterval) {
  const count = interval === '1H' ? 12 : interval === '24H' ? 24 : interval === '7D' ? 7 : 30;
  const base = sparkline[sparkline.length - 1] || 97000;
  const data = [];
  for (let i = 0; i < count; i++) {
    const variation = (Math.random() - 0.48) * base * 0.003;
    data.push({
      time: i,
      price: base + variation * (i - count / 2),
    });
  }
  // Ensure last point matches current price
  if (data.length) data[data.length - 1].price = base;
  return data;
}

export function PriceChart() {
  const [interval, setInterval] = useState<TimeInterval>('24H');
  const { prices, isLoading } = usePrices();
  const sbtc = prices.find(p => p.symbol === 'sBTC');

  const chartData = useMemo(() => {
    if (!sbtc) return [];
    return generateChartData(sbtc.sparkline, interval);
  }, [sbtc, interval]);

  if (isLoading) {
    return (
      <Card className="glass-card">
        <CardContent className="p-6">
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader className="flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">sBTC Price</CardTitle>
        <div className="flex gap-1">
          {intervals.map(i => (
            <Button
              key={i}
              variant={interval === i ? 'default' : 'ghost'}
              size="sm"
              className={`text-xs h-7 px-3 ${interval === i ? 'bg-primary text-primary-foreground' : ''}`}
              onClick={() => setInterval(i)}
            >
              {i}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(245, 100%, 63%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(245, 100%, 63%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis dataKey="time" hide />
            <YAxis
              domain={['auto', 'auto']}
              tickFormatter={(v: number) => `$${(v / 1000).toFixed(1)}k`}
              width={60}
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="glass-card rounded-lg p-3 border border-border/50 shadow-lg">
                    <p className="font-mono font-bold">{formatUsd(payload[0].value as number)}</p>
                  </div>
                );
              }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="hsl(245, 100%, 63%)"
              strokeWidth={2}
              fill="url(#priceGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
