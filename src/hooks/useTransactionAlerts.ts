import { useEffect, useRef } from 'react';
import { useTransactions } from '@/hooks/useTransactions';
import { getNotificationPreferences } from '@/hooks/useNotificationPreferences';
import { addNotification } from '@/lib/notificationHistory';
import { formatTokenAmount } from '@/lib/formatters';
import { sendPushNotification } from '@/lib/pushNotification';
import { toast } from 'sonner';

export function useTransactionAlerts() {
  const { transactions } = useTransactions();
  const prevPending = useRef<Set<string>>(new Set());
  const knownIds = useRef<Set<string>>(new Set());
  const initialized = useRef(false);

  useEffect(() => {
    if (transactions.length === 0) return;

    const { transactionAlerts } = getNotificationPreferences();
    if (!transactionAlerts) return;

    // On first load, just snapshot state — don't fire alerts
    if (!initialized.current) {
      initialized.current = true;
      for (const tx of transactions) {
        knownIds.current.add(tx.id);
        if (tx.status === 'pending') prevPending.current.add(tx.id);
      }
      return;
    }

    for (const tx of transactions) {
      // Newly confirmed (was pending)
      if (tx.status === 'confirmed' && prevPending.current.has(tx.id)) {
        prevPending.current.delete(tx.id);
        const action = tx.type === 'send' ? 'Sent' : tx.type === 'receive' ? 'Received' : 'Swapped';
        const msg = `Transaction confirmed: ${action} ${formatTokenAmount(tx.amount, tx.token === 'STX' ? 2 : 8)} ${tx.token}`;
        toast.success(msg, { duration: 6000 });
        addNotification('transaction', msg);
        sendPushNotification('sBTC Transaction', msg);
      }

      // Brand new receive transaction
      if (tx.type === 'receive' && !knownIds.current.has(tx.id)) {
        const msg2 = `Received ${formatTokenAmount(tx.amount, tx.token === 'STX' ? 2 : 8)} ${tx.token}`;
        toast.success(msg2, { duration: 6000 });
        addNotification('transaction', msg2);
        sendPushNotification('sBTC Transaction', msg2);
      }

      knownIds.current.add(tx.id);
      if (tx.status === 'pending') prevPending.current.add(tx.id);
    }
  }, [transactions]);
}
