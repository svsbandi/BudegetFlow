
'use client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge'; // Import Badge from the correct UI path
import { Button, buttonVariants } from '@/components/ui/button'; // Import buttonVariants
import { Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Transaction } from '@/types/transaction'; // Ensure this type exists
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export function TransactionList({ transactions, onDelete }: TransactionListProps) {
  const formatCurrency = (amount: number) => {
    // Assuming amount is in paise (integer), divide by 100 for display
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      signDisplay: 'never', // Handle sign manually with color
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    }).format(Math.abs(amount) / 100); // Convert paise to rupees for formatting
  };

  if (transactions.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No transactions yet. Add one to get started!</p>;
  }

  return (
     // Apply max height for scrollability within its container
     <ScrollArea className="h-[400px] rounded-md border shadow-inner bg-card">
      <Table>
        <TableHeader className="sticky top-0 bg-muted/50 z-10">
          <TableRow>
            <TableHead className="w-[100px]">Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-[50px] text-right pr-4">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id} className="hover:bg-accent/50">
              <TableCell className="text-muted-foreground text-xs font-medium">
                {format(transaction.date, 'dd MMM yy')} {/* Shortened date format */}
              </TableCell>
              <TableCell className="font-medium break-words max-w-[200px]">{transaction.description}</TableCell>
              <TableCell>
                {/* Use the imported Badge component */}
                <Badge variant={transaction.amount >= 0 ? "positive_outline" : "secondary"}>
                  {transaction.category}
                </Badge>
              </TableCell>
              <TableCell
                className={cn(
                  'text-right font-mono font-semibold', // Bolder amount
                  transaction.amount >= 0 ? 'text-positive' : 'text-destructive'
                )}
              >
                {transaction.amount >= 0 ? '+' : '-'}{formatCurrency(transaction.amount)}
              </TableCell>
              <TableCell className="text-right pr-4">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                     <Button variant="ghost" size="icon" className="h-8 w-8 group">
                       <Trash2 className="h-4 w-4 text-muted-foreground group-hover:text-destructive transition-colors" />
                       <span className="sr-only">Delete transaction</span>
                     </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this transaction?
                        <br />
                        <span className="font-medium">{transaction.description}</span> for <span className={cn(transaction.amount >=0 ? "text-positive" : "text-destructive", "font-semibold")}>{formatCurrency(transaction.amount)}</span> on {format(transaction.date, 'PPP')}
                        <br />
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      {/* Apply destructive variant styling */}
                      <AlertDialogAction onClick={() => onDelete(transaction.id)} className={cn(buttonVariants({ variant: "destructive" }))}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
