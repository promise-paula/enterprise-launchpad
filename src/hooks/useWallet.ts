import { useState, useEffect } from 'react';
import type { WalletState } from '@/types';

const MOCK_WALLET: WalletState = {
  isConnected: true,
  address: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
  network: 'mainnet',
  stxBalance: 2450.50,
};

export function useWallet() {
  const [isLoading, setIsLoading] = useState(true);
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: null,
    network: 'mainnet',
    stxBalance: 0,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setWallet(MOCK_WALLET);
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const connect = () => setWallet(MOCK_WALLET);
  const disconnect = () => setWallet({ isConnected: false, address: null, network: 'mainnet', stxBalance: 0 });

  return { wallet, isLoading, connect, disconnect };
}
