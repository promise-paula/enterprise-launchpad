import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useTheme } from '@/hooks/useTheme';
import { useNetwork } from '@/hooks/useNetwork';
import { useWallet } from '@/hooks/useWallet';
import { useNotificationPreferences } from '@/hooks/useNotificationPreferences';
import { useDemoMode } from '@/hooks/useDemoMode';
import { truncateAddress } from '@/lib/formatters';
import { requestPushPermission } from '@/lib/pushNotification';
import { Sun, Moon, Monitor, Copy, LogOut, Check, Bell, FlaskConical } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
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
  const { prefs, update: updatePrefs } = useNotificationPreferences();
  const { demoMode, setDemoMode } = useDemoMode();
  const [copied, setCopied] = useState(false);
  const [pushPermission, setPushPermission] = useState<NotificationPermission>(
    'Notification' in window ? Notification.permission : 'denied'
  );
  const supportsPush = 'Notification' in window;

  const handlePushToggle = async (checked: boolean) => {
    if (checked) {
      const perm = await requestPushPermission();
      setPushPermission(perm);
      if (perm === 'granted') {
        updatePrefs({ pushNotifications: true });
      } else {
        updatePrefs({ pushNotifications: false });
        toast.error('Browser notifications blocked. Enable them in your browser settings.');
      }
    } else {
      updatePrefs({ pushNotifications: false });
    }
  };

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

      {/* Demo Mode */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FlaskConical className="h-4 w-4" /> Demo Mode
            {demoMode && <Badge className="text-[10px] font-normal ml-1">Active</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm">Simulate price changes</Label>
              <p className="text-xs text-muted-foreground">
                Random ±0.5% jitter every 3s to preview flash animations and count-up effects
              </p>
            </div>
            <Switch checked={demoMode} onCheckedChange={setDemoMode} />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-4 w-4" /> Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm">Price movement alerts</Label>
              <p className="text-xs text-muted-foreground">Get notified when prices move significantly</p>
            </div>
            <Switch
              checked={prefs.priceAlerts}
              onCheckedChange={(checked) => updatePrefs({ priceAlerts: checked })}
            />
          </div>
          {prefs.priceAlerts && (
            <div>
              <Label className="text-sm text-muted-foreground mb-3 block">
                Price threshold: {prefs.priceThreshold}%
              </Label>
              <Slider
                value={[prefs.priceThreshold]}
                onValueChange={([v]) => updatePrefs({ priceThreshold: v })}
                min={1}
                max={20}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>1%</span>
                <span>20%</span>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm">Transaction confirmations</Label>
              <p className="text-xs text-muted-foreground">Alert when transactions are confirmed</p>
            </div>
            <Switch
              checked={prefs.transactionAlerts}
              onCheckedChange={(checked) => updatePrefs({ transactionAlerts: checked })}
            />
          </div>
          {supportsPush && (
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm flex items-center gap-2">
                  Browser notifications
                  <Badge variant="outline" className="text-[10px] font-normal">
                    {pushPermission === 'granted' ? 'Granted' : pushPermission === 'denied' ? 'Denied' : 'Not asked'}
                  </Badge>
                </Label>
                <p className="text-xs text-muted-foreground">Receive alerts even when this tab is in the background</p>
              </div>
              <Switch
                checked={prefs.pushNotifications}
                onCheckedChange={handlePushToggle}
              />
            </div>
          )}
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
