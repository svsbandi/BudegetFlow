
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import type { BudgetGoal } from '@/types/budget-goal'; // Import the BudgetGoal type

interface BudgetGoalsProps {
  goals: BudgetGoal[]; // Use the imported type
}

export function BudgetGoals({ goals }: BudgetGoalsProps) {
  const formatCurrency = (amount: number) => {
    // Assuming amount is in paise (integer), divide by 100 for display
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2, // Show paise
      minimumFractionDigits: 0, // Don't show .00 if whole rupees
    }).format(amount / 100); // Convert paise to rupees for formatting
  };

  if (!goals || goals.length === 0) {
     return (
       <Card className="shadow-sm">
         <CardHeader>
           <CardTitle>Budget Goals</CardTitle>
         </CardHeader>
         <CardContent>
           <p className="text-muted-foreground">No budget goals set yet.</p>
           {/* TODO: Add a button/link to add goals later */}
         </CardContent>
       </Card>
     );
   }


  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Budget Goals</CardTitle>
        {/* Potentially add an "Add Goal" button here */}
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.map((goal) => {
          // Ensure target is not zero to avoid division by zero
          const percentage = goal.target > 0 ? Math.min(100, (goal.current / goal.target) * 100) : 0;
          const isOverBudget = goal.current > goal.target;

          return (
            <div key={goal.id} className="space-y-1">
              <div className="flex justify-between items-baseline">
                <span className="font-medium">{goal.category}</span>
                <span className={cn(
                    "text-sm font-mono",
                    isOverBudget ? "text-destructive" : "text-muted-foreground"
                  )}
                >
                  {formatCurrency(goal.current)} / {formatCurrency(goal.target)}
                </span>
              </div>
              <Progress
                value={percentage}
                className={cn("h-2", isOverBudget ? "[&>div]:bg-destructive" : "[&>div]:bg-primary")}
                aria-label={`${goal.category} budget progress: ${percentage.toFixed(0)}%`}
                aria-valuenow={percentage}
                aria-valuemin={0}
                aria-valuemax={100}
              />
              {isOverBudget && (
                <p className="text-xs text-destructive">
                  Over budget by {formatCurrency(goal.current - goal.target)}
                </p>
              )}
               {!isOverBudget && percentage >= 85 && percentage < 100 && (
                 <p className="text-xs text-orange-500">
                   Nearing budget limit
                 </p>
               )}
               {!isOverBudget && percentage === 100 && goal.target > 0 && ( // Only show if target > 0
                 <p className="text-xs text-positive">
                   Budget target reached
                 </p>
               )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
