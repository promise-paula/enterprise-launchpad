import { useMemo } from 'react';
import type { PortfolioData } from '@/types';
import { usePrices } from './usePrices';

const MOCK_BALANCES = {
  sBTC: 0.12856700,
  STX: 2450.50,
};

export function usePortfolio() {
  const { prices, isLoading } = usePrices();

  const portfolio = useMemo<PortfolioData | null>(() => {
    if (!prices.length) return null;

    const sbtcPrice = prices.find(p => p.symbol === 'sBTC');
    const stxPrice = prices.find(p => p.symbol === 'STX');
    if (!sbtcPrice || !stxPrice) return null;

    const sbtcValue = MOCK_BALANCES.sBTC * sbtcPrice.price;
    const stxValue = MOCK_BALANCES.STX * stxPrice.price;
    const totalValue = sbtcValue + stxValue;

    const sbtcChange = sbtcValue * (sbtcPrice.changePercent24h / 100);
    const stxChange = stxValue * (stxPrice.changePercent24h / 100);
    const change24h = sbtcChange + stxChange;
    const changePercent24h = totalValue > 0 ? (change24h / (totalValue - change24h)) * 100 : 0;

    return {
      totalValue,
      change24h,
      changePercent24h,
      lastUpdated: new Date(),
      holdings: [
        {
          token: 'sBTC',
          symbol: 'sBTC',
          balance: MOCK_BALANCES.sBTC,
          value: sbtcValue,
          change24h: sbtcPrice.changePercent24h,
          changePercent24h: sbtcPrice.changePercent24h,
        },
        {
          token: 'Stacks',
          symbol: 'STX',
          balance: MOCK_BALANCES.STX,
          value: stxValue,
          change24h: stxPrice.changePercent24h,
          changePercent24h: stxPrice.changePercent24h,
        },
      ],
    };
  }, [prices]);

  return { portfolio, isLoading };
}
