import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/hooks/useTheme';
import { useNetwork } from '@/hooks/useNetwork';
import { useWallet } from '@/hooks/useWallet';
import { truncateAddress } from '@/lib/formatters';
import { Sun, Moon, Monitor, Copy, LogOut, Check } from 'lucide-react';
import { useState } from 'react';
import type { Theme } from '@/types';

const themeOptions: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { network, setNetwork } = useNetwork();
  const { wallet, disconnect } = useWallet();
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    if (wallet.address) {
      navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Appearance */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Appearance</CardTitle>
        </CardHeader>
        <CardContent>
          <Label className="text-sm text-muted-foreground mb-3 block">Theme</Label>
          <div className="flex gap-2">
            {themeOptions.map(opt => (
              <Button
                key={opt.value}
                variant={theme === opt.value ? 'default' : 'outline'}
                className={`flex-1 ${theme === opt.value ? 'bg-primary text-primary-foreground' : ''}`}
                onClick={() => setTheme(opt.value)}
              >
                <opt.icon className="mr-2 h-4 w-4" />
                {opt.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Network */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Network</CardTitle>
        </CardHeader>
        <CardContent>
          <Label className="text-sm text-muted-foreground mb-3 block">Select Network</Label>
          <div className="flex gap-2">
            {(['mainnet', 'testnet'] as const).map(n => (
              <Button
                key={n}
                variant={network === n ? 'default' : 'outline'}
                className={`flex-1 capitalize ${network === n ? 'bg-primary text-primary-foreground' : ''}`}
                onClick={() => setNetwork(n)}
              >
                {n}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Wallet */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Wallet</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {wallet.isConnected && wallet.address ? (
            <>
              <div>
                <Label className="text-sm text-muted-foreground mb-1 block">Connected Address</Label>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30">
                  <code className="font-mono text-sm flex-1 truncate">{wallet.address}</code>
                  <Button variant="ghost" size="icon" onClick={copyAddress} className="shrink-0">
                    {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <Button variant="destructive" onClick={disconnect} className="w-full">
                <LogOut className="mr-2 h-4 w-4" /> Disconnect Wallet
              </Button>
            </>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-3">No wallet connected</p>
              <Badge variant="outline">Connect via the Dashboard</Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
