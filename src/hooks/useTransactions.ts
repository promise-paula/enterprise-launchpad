import { useState, useEffect } from 'react';
import type { Transaction } from '@/types';

const now = new Date();
const mins = (m: number) => new Date(now.getTime() - m * 60000);
const hours = (h: number) => new Date(now.getTime() - h * 3600000);

const MOCK_TXS: Transaction[] = [
  { id: '1', type: 'receive', token: 'sBTC', amount: 0.05, value: 4860, from: 'SP1A2B3C4D5E6F7G8H9I0J', to: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7', timestamp: mins(12), status: 'confirmed', txHash: '0xabc123...' },
  { id: '2', type: 'send', token: 'STX', amount: 500, value: 925, from: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7', to: 'SP3X4Y5Z6A7B8C9D0E1F2G', timestamp: mins(45), status: 'confirmed', txHash: '0xdef456...' },
  { id: '3', type: 'swap', token: 'sBTC', amount: 0.02, value: 1943, from: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7', to: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7', timestamp: hours(2), status: 'confirmed', txHash: '0xghi789...' },
  { id: '4', type: 'receive', token: 'STX', amount: 1200, value: 2220, from: 'SP4D5E6F7G8H9I0J1K2L3M', to: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7', timestamp: hours(5), status: 'confirmed', txHash: '0xjkl012...' },
  { id: '5', type: 'send', token: 'sBTC', amount: 0.01, value: 971.50, from: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7', to: 'SP5E6F7G8H9I0J1K2L3M4N', timestamp: hours(8), status: 'pending', txHash: '0xmno345...' },
  { id: '6', type: 'receive', token: 'sBTC', amount: 0.03, value: 2914.50, from: 'SP6F7G8H9I0J1K2L3M4N5O', to: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7', timestamp: hours(12), status: 'confirmed', txHash: '0xpqr678...' },
  { id: '7', type: 'swap', token: 'STX', amount: 800, value: 1480, from: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7', to: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7', timestamp: hours(18), status: 'confirmed', txHash: '0xstu901...' },
  { id: '8', type: 'receive', token: 'STX', amount: 350, value: 647.50, from: 'SP7G8H9I0J1K2L3M4N5O6P', to: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7', timestamp: hours(24), status: 'confirmed', txHash: '0xvwx234...' },
];

export function useTransactions() {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTransactions(MOCK_TXS);
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  return { transactions, isLoading };
}
