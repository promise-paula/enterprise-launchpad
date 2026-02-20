import { usePriceAlerts } from '@/hooks/usePriceAlerts';
import { useTransactionAlerts } from '@/hooks/useTransactionAlerts';

export function NotificationProvider() {
  usePriceAlerts();
  useTransactionAlerts();
  return null;
}
