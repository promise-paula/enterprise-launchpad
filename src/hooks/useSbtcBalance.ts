import { useState, useEffect } from 'react';
import type { SbtcBalance } from '@/types';

const MOCK_SBTC: SbtcBalance = {
  balance: 0.12856700,
  balanceUsd: 12489.10,
  change24h: 155.34,
  changePercent24h: 1.26,
};

export function useSbtcBalance() {
  const [isLoading, setIsLoading] = useState(true);
  const [sbtcBalance, setSbtcBalance] = useState<SbtcBalance | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSbtcBalance(MOCK_SBTC);
      setIsLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  return { sbtcBalance, isLoading };
}
