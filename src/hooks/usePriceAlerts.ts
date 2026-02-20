import { useEffect, useRef } from 'react';
import { getNotificationPreferences } from '@/hooks/useNotificationPreferences';
import { addNotification } from '@/lib/notificationHistory';
import { toast } from 'sonner';
import type { PriceData } from '@/types';

export function usePriceAlerts(prices: PriceData[]) {
  const alerted = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (prices.length === 0) return;

    const { priceAlerts, priceThreshold } = getNotificationPreferences();
    if (!priceAlerts) return;

    for (const p of prices) {
      const abs = Math.abs(p.changePercent24h);
      const key = `${p.symbol}-${p.changePercent24h >= 0 ? 'up' : 'down'}`;

      if (abs >= priceThreshold && !alerted.current.has(key)) {
        alerted.current.add(key);
        const direction = p.changePercent24h >= 0 ? 'up' : 'down';
        const emoji = direction === 'up' ? '📈' : '📉';
        const msg = `${emoji} ${p.symbol} is ${direction} ${abs.toFixed(1)}% in the last 24h`;
        toast(msg, { duration: 8000 });
        addNotification('price', msg);
      } else if (abs < priceThreshold) {
        // Reset so it can alert again if it crosses back
        alerted.current.delete(`${p.symbol}-up`);
        alerted.current.delete(`${p.symbol}-down`);
      }
    }
  }, [prices]);
}
