import { useState, useEffect } from 'react';
import type { PortfolioData } from '@/types';

const MOCK_PORTFOLIO: PortfolioData = {
  totalValue: 12500,
  change24h: 320.50,
  changePercent24h: 2.63,
  lastUpdated: new Date(),
  holdings: [
    {
      token: 'sBTC',
      symbol: 'sBTC',
      balance: 0.12856700,
      value: 12489.10,
      change24h: 1.26,
      changePercent24h: 1.26,
    },
    {
      token: 'Stacks',
      symbol: 'STX',
      balance: 2450.50,
      value: 4533.43,
      change24h: 3.93,
      changePercent24h: 3.93,
    },
  ],
};

export function usePortfolio() {
  const [isLoading, setIsLoading] = useState(true);
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPortfolio(MOCK_PORTFOLIO);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return { portfolio, isLoading };
}
