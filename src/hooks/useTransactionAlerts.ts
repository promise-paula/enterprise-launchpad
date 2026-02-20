import { useEffect, useRef } from 'react';
import { useTransactions } from '@/hooks/useTransactions';
import { getNotificationPreferences } from '@/hooks/useNotificationPreferences';
import { formatTokenAmount } from '@/lib/formatters';
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
        toast.success(`Transaction confirmed: ${action} ${formatTokenAmount(tx.amount, tx.token === 'STX' ? 2 : 8)} ${tx.token}`, {
          duration: 6000,
        });
      }

      // Brand new receive transaction
      if (tx.type === 'receive' && !knownIds.current.has(tx.id)) {
        toast.success(`Received ${formatTokenAmount(tx.amount, tx.token === 'STX' ? 2 : 8)} ${tx.token}`, {
          duration: 6000,
        });
      }

      knownIds.current.add(tx.id);
      if (tx.status === 'pending') prevPending.current.add(tx.id);
    }
  }, [transactions]);
}
