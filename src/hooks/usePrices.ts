import { useState, useEffect } from 'react';
import type { PriceData } from '@/types';

function generateSparkline(base: number, points = 24): number[] {
  const data: number[] = [];
  let val = base;
  for (let i = 0; i < points; i++) {
    val += (Math.random() - 0.48) * base * 0.005;
    data.push(val);
  }
  return data;
}

const MOCK_PRICES: PriceData[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 97200,
    change24h: 1250,
    changePercent24h: 1.3,
    sparkline: generateSparkline(97200),
  },
  {
    symbol: 'STX',
    name: 'Stacks',
    price: 1.85,
    change24h: 0.07,
    changePercent24h: 3.93,
    sparkline: generateSparkline(1.85),
  },
  {
    symbol: 'sBTC',
    name: 'sBTC',
    price: 97150,
    change24h: 1200,
    changePercent24h: 1.25,
    sparkline: generateSparkline(97150),
  },
];

export function usePrices() {
  const [isLoading, setIsLoading] = useState(true);
  const [prices, setPrices] = useState<PriceData[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPrices(MOCK_PRICES);
      setIsLoading(false);
    }, 350);
    return () => clearTimeout(timer);
  }, []);

  const getPrice = (symbol: string) => prices.find(p => p.symbol === symbol);

  return { prices, isLoading, getPrice };
}
