
'use client';

import * as React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface SpendingChartProps {
  data: { category: string; spending: number }[]; // Assuming spending is in paise/cents
}

// Define colors for the chart segments (using theme variables)
const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(195, 53%, 79%)', // Light Blue
  'hsl( 30, 90%, 68%)', // Orange
  'hsl(270, 45%, 75%)', // Lavender
];

const formatCurrency = (amount: number) => {
    // Assuming amount is in paise (integer), divide by 100 for display
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2, // Show paise
      minimumFractionDigits: 0, // Don't show .00 if whole rupees
    }).format(amount / 100); // Convert paise to rupees for formatting
  };


export function SpendingCharts({ data }: SpendingChartProps) {
  const chartData = data.filter(item => item.spending > 0); // Only show positive spending

  // Define chart configuration based on the data categories
  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {};
    chartData.forEach((item, index) => {
      config[item.category] = {
        label: item.category,
        color: COLORS[index % COLORS.length], // Assign colors cyclically
      };
    });
    return config;
  }, [chartData]);


  if (chartData.length === 0) {
    return (
       <Card className="shadow-sm">
         <CardHeader>
           <CardTitle>Spending by Category</CardTitle>
         </CardHeader>
         <CardContent className="flex h-[300px] items-center justify-center">
            <p className="text-muted-foreground">No spending data available to display chart.</p>
         </CardContent>
       </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                cursor={false}
                content={<ChartTooltipContent
                    hideLabel
                    nameKey="category"
                    formatter={(value, name) => (
                        <div className="flex min-w-[120px] items-center text-xs">
                          <div className="flex items-center gap-1.5 font-medium leading-none">
                             <span className="h-2 w-2 rounded-full" style={{ backgroundColor: chartConfig[name as keyof typeof chartConfig]?.color }} />
                            {chartConfig[name as keyof typeof chartConfig]?.label || name}
                          </div>
                          <div className="ml-auto flex-1 text-right font-mono font-medium text-foreground">
                            {formatCurrency(value as number)}
                          </div>
                        </div>
                      )}
                 />}
              />
              <Pie
                data={chartData}
                dataKey="spending"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={60} // Make it a donut chart
                fill="#8884d8"
                strokeWidth={2} // Add stroke for better separation
                label={false} // Disable default labels
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={chartConfig[entry.category]?.color || COLORS[index % COLORS.length]} stroke={chartConfig[entry.category]?.color || COLORS[index % COLORS.length]}/>
                ))}
              </Pie>
               <Legend
                 content={({ payload }) => {
                     if (!payload) return null;
                     // Calculate total spending for percentage calculation
                     const totalSpending = payload.reduce((sum, entry) => sum + (entry.payload?.spending || 0), 0);

                     return (
                       <ul className="flex flex-wrap gap-x-4 gap-y-2 justify-center mt-4 text-xs text-muted-foreground max-w-[90%] mx-auto">
                         {payload.map((entry, index) => {
                            const category = entry.value;
                            const spending = entry.payload?.spending || 0;
                            const percentage = totalSpending > 0 ? ((spending / totalSpending) * 100).toFixed(1) : '0.0';
                           return (
                           <li key={`item-${index}`} className="flex items-center gap-1.5">
                             <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                             {category} ({percentage}%)
                           </li>
                         );
                         })}
                       </ul>
                     );
                   }}
                   verticalAlign="bottom"
                   align="center"
                   wrapperStyle={{ lineHeight: '16px' }}
               />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

