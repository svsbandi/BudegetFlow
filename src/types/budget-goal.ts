
export interface BudgetGoal {
  id: string;
  category: string;
  target: number; // Target amount (e.g., in paise/cents)
  current: number; // Current spending for this category (calculated dynamically)
}
