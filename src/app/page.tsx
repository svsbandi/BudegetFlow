
'use client'; // Add 'use client' directive because we are using hooks (useState, useEffect)

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/layout/header';
import { DashboardOverview } from '@/components/dashboard/overview';
import { TransactionSection } from '@/components/transactions/transaction-section';
import { SpendingCharts } from '@/components/charts/spending-charts';
import { BudgetGoals } from '@/components/budgets/budget-goals';
import { Card, CardContent } from '@/components/ui/card';
import type { Transaction } from '@/types/transaction'; // Ensure this type exists
import type { BudgetGoal } from '@/types/budget-goal'; // Define or import BudgetGoal type

// Define default categories
const defaultCategories = [
  'Food',
  'Transport',
  'Entertainment',
  'Utilities',
  'Shopping',
  'Income',
  'Housing',
  'Health',
  'Other',
];

// Initial Mock Data (optional, can start empty)
const mockTransactions: Transaction[] = [
    { id: '1', date: new Date(2024, 6, 15), description: 'Groceries', amount: -5560, category: 'Food' }, // Example amount in paise/cents if storing integers
    { id: '2', date: new Date(2024, 6, 14), description: 'Salary', amount: 250000, category: 'Income' },
    { id: '3', date: new Date(2024, 6, 13), description: 'Dinner Out', amount: -7890, category: 'Entertainment' },
    { id: '4', date: new Date(2024, 6, 12), description: 'Gas', amount: -4000, category: 'Transport' },
    { id: '5', date: new Date(2024, 6, 11), description: 'Movie Tickets', amount: -2500, category: 'Entertainment' },
];

const mockGoals: Omit<BudgetGoal, 'current'>[] = [ // Remove 'current' from mock definition
  { id: 'g1', category: 'Food', target: 50000 },
  { id: 'g2', category: 'Entertainment', target: 20000 },
  { id: 'g3', category: 'Shopping', target: 25000 },
];


export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [availableCategories, setAvailableCategories] = useState<string[]>(defaultCategories);
  const [budgetGoals] = useState<Omit<BudgetGoal, 'current'>[]>(mockGoals); // Goals themselves are static for now

  // Ensure categories from initial transactions are included
  useEffect(() => {
      const categoriesFromTransactions = transactions.map(t => t.category);
      const uniqueCategories = Array.from(new Set([...defaultCategories, ...categoriesFromTransactions]));
      setAvailableCategories(uniqueCategories.sort());
  }, []); // Run only once on mount


  const addTransaction = (newTransactionData: Omit<Transaction, 'id'>) => {
    const transactionWithId = { ...newTransactionData, id: Date.now().toString() }; // Simple ID generation
    setTransactions((prev) =>
      [transactionWithId, ...prev].sort((a, b) => b.date.getTime() - a.date.getTime())
    );

    // Add category if it's new
    if (!availableCategories.includes(newTransactionData.category)) {
      setAvailableCategories((prev) => [...prev, newTransactionData.category].sort());
    }
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    // Note: We don't remove categories when transactions are deleted.
  };

  // --- Calculate derived data based on transactions ---

  const overviewData = useMemo(() => {
    let totalIncome = 0;
    let totalExpenses = 0;
    transactions.forEach((t) => {
      if (t.amount > 0) {
        totalIncome += t.amount;
      } else {
        totalExpenses += Math.abs(t.amount);
      }
    });
    return {
      totalIncome,
      totalExpenses,
      netFlow: totalIncome - totalExpenses,
    };
  }, [transactions]);

  const chartData = useMemo(() => {
    const spendingByCategory: { [key: string]: number } = {};
    transactions.forEach((t) => {
      if (t.amount < 0) { // Only expenses
        spendingByCategory[t.category] = (spendingByCategory[t.category] || 0) + Math.abs(t.amount);
      }
    });
    return Object.entries(spendingByCategory).map(([category, spending]) => ({
      category,
      spending,
    }));
  }, [transactions]);

  const goalsWithCurrentSpending = useMemo(() => {
      return budgetGoals.map(goal => {
          const currentSpending = transactions
              .filter(t => t.category === goal.category && t.amount < 0)
              .reduce((sum, t) => sum + Math.abs(t.amount), 0);
          return { ...goal, current: currentSpending };
      });
  }, [transactions, budgetGoals]);


  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <DashboardOverview data={overviewData} />
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          <Card className="lg:col-span-2 shadow-lg">
            <CardContent className="p-4 md:p-6">
              {/* Pass state and handlers down */}
              <TransactionSection
                transactions={transactions}
                addTransaction={addTransaction}
                deleteTransaction={deleteTransaction}
                availableCategories={availableCategories}
              />
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardContent className="p-4 md:p-6">
              <SpendingCharts data={chartData} />
            </CardContent>
          </Card>
        </div>
        <Card className="shadow-lg">
          <CardContent className="p-4 md:p-6">
            <BudgetGoals goals={goalsWithCurrentSpending} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
