import { useState, useEffect, useCallback, useRef } from 'react';
import type { PriceData } from '@/types';
import { fetchPrices, fetchMarketChart } from '@/lib/coingecko';
import { toast } from 'sonner';

const POLL_INTERVAL = 60_000;
const SBTC_SPREAD = 0.9995; // sBTC trades ~0.05% below BTC

export function usePrices() {
  const [isLoading, setIsLoading] = useState(true);
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [isLive, setIsLive] = useState(false);
  const hasErrored = useRef(false);

  const load = useCallback(async () => {
    try {
      const [coinPrices, sparklineData] = await Promise.all([
        fetchPrices(),
        fetchMarketChart('bitcoin', 7),
      ]);

      const btcPrice = coinPrices.bitcoin.usd;
      const btcChange = coinPrices.bitcoin.usd_24h_change ?? 0;
      const stxPrice = coinPrices.blockstack.usd;
      const stxChange = coinPrices.blockstack.usd_24h_change ?? 0;

      const btcSparkline = sparklineData.slice(-24).map(p => p.price);
      const sbtcPrice = btcPrice * SBTC_SPREAD;

      const newPrices: PriceData[] = [
        {
          symbol: 'BTC',
          name: 'Bitcoin',
          price: btcPrice,
          change24h: btcPrice * (btcChange / 100),
          changePercent24h: btcChange,
          sparkline: btcSparkline,
        },
        {
          symbol: 'STX',
          name: 'Stacks',
          price: stxPrice,
          change24h: stxPrice * (stxChange / 100),
          changePercent24h: stxChange,
          sparkline: btcSparkline.map(v => v * (stxPrice / btcPrice)),
        },
        {
          symbol: 'sBTC',
          name: 'sBTC',
          price: sbtcPrice,
          change24h: sbtcPrice * (btcChange / 100),
          changePercent24h: btcChange,
          sparkline: btcSparkline.map(v => v * SBTC_SPREAD),
        },
      ];

      setPrices(newPrices);
      setIsLive(true);
      hasErrored.current = false;
    } catch (err) {
      if (!hasErrored.current) {
        toast.error('Failed to fetch live prices. Using cached data.');
        hasErrored.current = true;
      }
      setIsLive(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const id = window.setInterval(load, POLL_INTERVAL);
    return () => clearInterval(id);
  }, [load]);

  const getPrice = (symbol: string) => prices.find(p => p.symbol === symbol);

  return { prices, isLoading, getPrice, isLive };
}
