import { Card, CardContent } from '@/components/ui/card';
import { Clock } from 'lucide-react';

export default function TransactionHistory() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">Transaction History</h1>
      <Card className="glass-card">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
            <Clock className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold mb-2">Coming Soon</h2>
          <p className="text-muted-foreground max-w-md">
            Full transaction history with filters, search, pagination, and CSV export will be available in Phase 3.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
