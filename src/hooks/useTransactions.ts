import { useState, useEffect } from 'react';
import type { Transaction } from '@/types';

const now = new Date();
const mins = (m: number) => new Date(now.getTime() - m * 60000);
const hours = (h: number) => new Date(now.getTime() - h * 3600000);
const days = (d: number) => new Date(now.getTime() - d * 86400000);

const MOCK_TXS: Transaction[] = [
  { id: '1', type: 'receive', token: 'sBTC', amount: 0.05, value: 4860, from: 'SP1A2B3C4D5E6F7G8H9I0J', to: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7', timestamp: mins(12), status: 'confirmed', txHash: '0xabc123def456' },
  { id: '2', type: 'send', token: 'STX', amount: 500, value: 925, from: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7', to: 'SP3X4Y5Z6A7B8C9D0E1F2G', timestamp: mins(45), status: 'confirmed', txHash: '0xdef456abc789' },
  { id: '3', type: 'swap', token: 'sBTC', amount: 0.02, value: 1943, from: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7', to: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7', timestamp: hours(2), status: 'confirmed', txHash: '0xghi789jkl012' },
  { id: '4', type: 'receive', token: 'STX', amount: 1200, value: 2220, from: 'SP4D5E6F7G8H9I0J1K2L3M', to: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7', timestamp: hours(5), status: 'confirmed', txHash: '0xjkl012mno345' },
  { id: '5', type: 'send', token: 'sBTC', amount: 0.01, value: 971.50, from: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7', to: 'SP5E6F7G8H9I0J1K2L3M4N', timestamp: hours(8), status: 'pending', txHash: '0xmno345pqr678' },
  { id: '6', type: 'receive', token: 'sBTC', amount: 0.03, value: 2914.50, from: 'SP6F7G8H9I0J1K2L3M4N5O', to: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7', timestamp: hours(12), status: 'confirmed', txHash: '0xpqr678stu901' },
  { id: '7', type: 'swap', token: 'STX', amount: 800, value: 1480, from: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7', to: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7', timestamp: hours(18), status: 'confirmed', txHash: '0xstu901vwx234' },
  { id: '8', type: 'receive', token: 'STX', amount: 350, value: 647.50, from: 'SP7G8H9I0J1K2L3M4N5O6P', to: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7', timestamp: hours(24), status: 'confirmed', txHash: '0xvwx234yza567' },
  // Additional transactions for pagination/filtering
  { id: '9', type: 'send', token: 'STX', amount: 250, value: 462.50, from: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7', to: 'SP8H9I0J1K2L3M4N5O6P7Q', timestamp: days(1.5), status: 'confirmed', txHash: '0xbcd890efg123' },
  { id: '10', type: 'receive', token: 'sBTC', amount: 0.015, value: 1457.25, from: 'SP9I0J1K2L3M4N5O6P7Q8R', to: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7', timestamp: days(2), status: 'confirmed', txHash: '0xefg123hij456' },
  { id: '11', type: 'swap', token: 'sBTC', amount: 0.008, value: 777.20, from: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7', to: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7', timestamp: days(2.5), status: 'confirmed', txHash: '0xhij456klm789' },
  { id: '12', type: 'send', token: 'sBTC', amount: 0.025, value: 2428.75, from: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7', to: 'SP1A2B3C4D5E6F7G8H9I0J', timestamp: days(3), status: 'confirmed', txHash: '0xklm789nop012' },
  { id: '13', type: 'receive', token: 'STX', amount: 2000, value: 3700, from: 'SP3X4Y5Z6A7B8C9D0E1F2G', to: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7', timestamp: days(3.5), status: 'confirmed', txHash: '0xnop012qrs345' },
  { id: '14', type: 'swap', token: 'STX', amount: 450, value: 832.50, from: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7', to: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7', timestamp: days(4), status: 'confirmed', txHash: '0xqrs345tuv678' },
  { id: '15', type: 'send', token: 'STX', amount: 100, value: 185, from: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7', to: 'SP4D5E6F7G8H9I0J1K2L3M', timestamp: days(4.5), status: 'pending', txHash: '0xtuv678wxy901' },
  { id: '16', type: 'receive', token: 'sBTC', amount: 0.1, value: 9715, from: 'SP5E6F7G8H9I0J1K2L3M4N', to: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7', timestamp: days(5), status: 'confirmed', txHash: '0xwxy901zab234' },
  { id: '17', type: 'swap', token: 'sBTC', amount: 0.005, value: 485.75, from: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7', to: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7', timestamp: days(5.5), status: 'confirmed', txHash: '0xzab234cde567' },
  { id: '18', type: 'send', token: 'sBTC', amount: 0.04, value: 3886, from: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7', to: 'SP6F7G8H9I0J1K2L3M4N5O', timestamp: days(6), status: 'confirmed', txHash: '0xcde567fgh890' },
  { id: '19', type: 'receive', token: 'STX', amount: 750, value: 1387.50, from: 'SP7G8H9I0J1K2L3M4N5O6P', to: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7', timestamp: days(6.5), status: 'confirmed', txHash: '0xfgh890ijk123' },
  { id: '20', type: 'send', token: 'STX', amount: 300, value: 555, from: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7', to: 'SP8H9I0J1K2L3M4N5O6P7Q', timestamp: days(7), status: 'confirmed', txHash: '0xijk123lmn456' },
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
