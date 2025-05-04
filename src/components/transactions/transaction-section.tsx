
'use client';

import React, { useState } from 'react';
import { TransactionForm } from './transaction-form';
import { TransactionList } from './transaction-list';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { Transaction } from '@/types/transaction';

interface TransactionSectionProps {
  transactions: Transaction[];
  addTransaction: (newTransaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  availableCategories: string[];
}

export function TransactionSection({
  transactions,
  addTransaction,
  deleteTransaction,
  availableCategories,
}: TransactionSectionProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form submission handler now calls the prop function
  const handleFormSubmit = (newTransactionData: Omit<Transaction, 'id'>) => {
    addTransaction(newTransactionData);
    setIsFormOpen(false); // Close dialog after adding
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Recent Transactions</h2>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="shadow-sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Transaction</DialogTitle>
            </DialogHeader>
            {/* Pass onSubmit and categories props */}
            <TransactionForm
              onSubmit={handleFormSubmit}
              categories={availableCategories}
            />
          </DialogContent>
        </Dialog>
      </div>
      {/* Pass transactions and delete handler */}
      <TransactionList transactions={transactions} onDelete={deleteTransaction} />
    </div>
  );
}
