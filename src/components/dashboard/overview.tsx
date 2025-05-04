
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OverviewProps {
  data: {
    totalIncome: number; // Amount in paise/cents
    totalExpenses: number; // Amount in paise/cents (positive value)
    netFlow: number; // Amount in paise/cents
  };
}

export function DashboardOverview({ data }: OverviewProps) {
  const formatCurrency = (amount: number) => {
    // Assuming amount is in paise (integer), divide by 100 for display
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2, // Show paise
      minimumFractionDigits: 0, // Don't show .00 if whole rupees
    }).format(amount / 100); // Convert paise to rupees for formatting
  };

  return (
    <div className="grid gap-4 md:grid-cols-3 md:gap-8">
      <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Income</CardTitle>
          <TrendingUp className="h-5 w-5 text-positive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-positive">
            {formatCurrency(data.totalIncome)}
          </div>
          {/* <p className="text-xs text-muted-foreground">+20.1% from last month</p> */}
        </CardContent>
      </Card>
      <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
          <TrendingDown className="h-5 w-5 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">
            {formatCurrency(data.totalExpenses)}
          </div>
          {/* <p className="text-xs text-muted-foreground">+180.1% from last month</p> */}
        </CardContent>
      </Card>
      <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Net Flow</CardTitle>
          <Wallet className={cn("h-5 w-5", data.netFlow >= 0 ? "text-positive" : "text-destructive")} />
        </CardHeader>
        <CardContent>
          <div className={cn("text-2xl font-bold", data.netFlow >= 0 ? "text-positive" : "text-destructive")}>
            {formatCurrency(data.netFlow)}
          </div>
          {/* <p className="text-xs text-muted-foreground">+19% from last month</p> */}
        </CardContent>
      </Card>
    </div>
  );
}
