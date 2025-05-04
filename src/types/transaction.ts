
export interface Transaction {
  id: string;
  date: Date;
  description: string;
  amount: number; // Amount in smallest currency unit (e.g., paise, cents). Positive for income, negative for expenses.
  category: string;
}
