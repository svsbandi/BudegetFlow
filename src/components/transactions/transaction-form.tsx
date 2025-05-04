
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, PlusCircle, IndianRupee } from 'lucide-react'; // Added IndianRupee
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { Transaction } from '@/types/transaction'; // Ensure this type exists

// Define Zod schema for validation
const transactionFormSchema = z.object({
  type: z.enum(['expense', 'income'], { required_error: "Please select transaction type." }),
  description: z.string().min(1, { message: 'Description is required.' }).max(100, { message: 'Description too long (max 100 chars).'}),
  // Validate amount string input (allows decimals like 10.50)
  amountString: z.string()
                   .min(1, { message: 'Amount is required.'})
                   .regex(/^\d+(\.\d{1,2})?$/, { message: 'Enter a valid amount (e.g., 10 or 10.50).'}),
  category: z.string().min(1, { message: 'Category is required.' }),
  newCategory: z.string().optional(), // For adding a new category
  date: z.date({ required_error: 'Date is required.' }),
});

// Infer type for form values (amount will be string here)
type TransactionFormValues = z.infer<typeof transactionFormSchema>;

interface TransactionFormProps {
  onSubmit: (data: Omit<Transaction, 'id'>) => void;
  categories: string[];
}

export function TransactionForm({ onSubmit, categories }: TransactionFormProps) {
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      type: 'expense',
      description: '',
      amountString: '', // Use amountString for input
      category: '',
      newCategory: '',
      date: new Date(),
    },
  });

  const handleFormSubmit = (values: TransactionFormValues) => {
    // Convert amountString (rupees) to integer (paise/cents)
    const amountInRupees = parseFloat(values.amountString);
    const amountInPaise = Math.round(amountInRupees * 100); // Convert to paise and round

    const finalAmount = values.type === 'expense' ? -Math.abs(amountInPaise) : Math.abs(amountInPaise);
    const finalCategory = showNewCategoryInput ? values.newCategory?.trim() || 'Other' : values.category;

    if (showNewCategoryInput && !values.newCategory?.trim()) {
      form.setError('newCategory', { type: 'manual', message: 'New category name is required.' });
      return;
    }

    if (showNewCategoryInput && values.newCategory?.trim().length > 50) {
        form.setError('newCategory', { type: 'manual', message: 'Category name too long (max 50 chars).' });
        return;
    }

    onSubmit({
      date: values.date,
      description: values.description.trim(),
      amount: finalAmount, // Submit amount in paise
      category: finalCategory,
    });
    form.reset(); // Reset form after submission
    setShowNewCategoryInput(false); // Hide new category input
  };

  const handleCategoryChange = (value: string) => {
    if (value === 'add_new') {
      setShowNewCategoryInput(true);
      form.setValue('category', 'add_new'); // Keep select value consistent
      form.setValue('newCategory', ''); // Clear potential previous value
      form.clearErrors('category'); // Clear category error if 'Add New' is selected
      form.trigger('newCategory'); // Trigger validation potentially
    } else {
      setShowNewCategoryInput(false);
      form.setValue('category', value);
      form.setValue('newCategory', ''); // Clear new category if a standard one is chosen
      form.clearErrors('newCategory'); // Clear new category error
      form.trigger('category'); // Trigger validation
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 p-1">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="expense" id="expense-radio"/>
                    </FormControl>
                    <FormLabel htmlFor="expense-radio" className="font-normal cursor-pointer">Expense</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="income" id="income-radio"/>
                    </FormControl>
                    <FormLabel htmlFor="income-radio" className="font-normal cursor-pointer">Income</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Coffee, Salary" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amountString" // Use amountString field
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    type="text" // Use text to allow decimals easily
                    inputMode="decimal" // Hint for mobile keyboards
                    placeholder="0.00"
                    {...field}
                    className="pl-8" // Add padding for the icon
                  />
                </FormControl>
                 <IndianRupee className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
               <FormDescription>
                 Enter amount in Rupees (e.g., 150.75).
               </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={handleCategoryChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                   <SelectItem value="add_new" className="text-primary font-medium">
                     <PlusCircle className="inline h-4 w-4 mr-2" /> Add New Category
                   </SelectItem>
                </SelectContent>
              </Select>
              {/* Don't show default category message if 'Add New' is selected */}
              {field.value !== 'add_new' && <FormMessage />}
            </FormItem>
          )}
        />

       {showNewCategoryInput && (
         <FormField
           control={form.control}
           name="newCategory"
           render={({ field }) => (
             <FormItem>
               <FormLabel>New Category Name</FormLabel>
               <FormControl>
                 <Input placeholder="Enter new category name" {...field} />
               </FormControl>
               <FormMessage />
             </FormItem>
           )}
         />
       )}


        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date('2000-01-01') // Adjusted min date
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full shadow-md">
          Add Transaction
        </Button>
      </form>
    </Form>
  );
}
