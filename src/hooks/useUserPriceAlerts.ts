import { useState, useEffect, useCallback } from 'react';
import { loadAlerts, addAlert, removeAlert } from '@/lib/priceAlerts';
import type { PriceAlert } from '@/types';

export function useUserPriceAlerts() {
  const [alerts, setAlerts] = useState<PriceAlert[]>(loadAlerts);

  useEffect(() => {
    const sync = () => setAlerts(loadAlerts());
    window.addEventListener('price-alerts-change', sync);
    return () => window.removeEventListener('price-alerts-change', sync);
  }, []);

  const add = useCallback((alert: Omit<PriceAlert, 'id' | 'createdAt'>) => {
    return addAlert(alert);
  }, []);

  const remove = useCallback((id: string) => {
    removeAlert(id);
  }, []);

  return { alerts, add, remove };
}
