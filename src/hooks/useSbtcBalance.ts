import { useMemo } from 'react';
import type { SbtcBalance } from '@/types';
import { usePrices } from './usePrices';

const MOCK_BALANCE = 0.12856700;

export function useSbtcBalance() {
  const { prices, isLoading } = usePrices();

  const sbtcBalance = useMemo<SbtcBalance | null>(() => {
    const sbtc = prices.find(p => p.symbol === 'sBTC');
    if (!sbtc) return null;

    const balanceUsd = MOCK_BALANCE * sbtc.price;
    const change24h = balanceUsd * (sbtc.changePercent24h / 100);

    return {
      balance: MOCK_BALANCE,
      balanceUsd,
      change24h,
      changePercent24h: sbtc.changePercent24h,
    };
  }, [prices]);

  return { sbtcBalance, isLoading };
}
