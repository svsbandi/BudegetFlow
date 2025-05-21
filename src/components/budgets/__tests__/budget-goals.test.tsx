import { render, screen } from '@testing-library/react';
import { BudgetGoals } from '../budget-goals'; // Adjust path as necessary
import { BudgetGoal } from '@/types/budget-goal'; // Adjust path as necessary

// Helper to format currency for consistent testing
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(amount / 100);
};

const mockGoals: BudgetGoal[] = [
  { id: '1', name: 'Vacation Fund', current: 50000, target: 200000, category: 'Travel', userId: 'user1', currency: 'INR' },
  { id: '2', name: 'New Gadget', current: 10000, target: 150000, category: 'Electronics', userId: 'user1', currency: 'INR' },
  { id: '3', name: 'Emergency Savings', current: 250000, target: 200000, category: 'Savings', userId: 'user1', currency: 'INR' }, // Over budget
];

describe('BudgetGoals Component', () => {
  test('renders "No budget goals set yet." message when goals array is empty', () => {
    render(<BudgetGoals goals={[]} />);
    expect(screen.getByText(/no budget goals set yet./i)).toBeInTheDocument();
  });

  test('renders a list of budget goals correctly when goals are provided', () => {
    render(<BudgetGoals goals={mockGoals} />);

    mockGoals.forEach(goal => {
      // Check for category display
      expect(screen.getByText(goal.category)).toBeInTheDocument();

      // Check for current and target amount display
      // Amounts are divided by 100 in the component for formatting
      const expectedAmountText = `${formatCurrency(goal.current)} / ${formatCurrency(goal.target)}`;
      expect(screen.getByText(expectedAmountText)).toBeInTheDocument();

      // Check for progress bar rendering and its attributes
      const progressBar = screen.getByLabelText(`${goal.category} budget progress: ${Math.min(100, (goal.current / goal.target) * 100).toFixed(0)}%`);
      expect(progressBar).toBeInTheDocument();
      expect(progressBar).toHaveAttribute('role', 'progressbar');
      const expectedPercentage = goal.target > 0 ? Math.min(100, (goal.current / goal.target) * 100) : 0;
      expect(progressBar).toHaveAttribute('aria-valuenow', expectedPercentage.toString());
      expect(progressBar).toHaveAttribute('aria-valuemin', '0');
      expect(progressBar).toHaveAttribute('aria-valuemax', '100');

      // Check for over budget message if applicable
      if (goal.current > goal.target) {
        const overBudgetText = `Over budget by ${formatCurrency(goal.current - goal.target)}`;
        expect(screen.getByText(overBudgetText)).toBeInTheDocument();
        // Check for destructive class on progress bar (more complex, might need specific data-testid or class check)
        // For simplicity, we'll trust the component's internal logic for class application based on isOverBudget
      }
    });
  });

  test('renders "Nearing budget limit" message when appropriate', () => {
    const nearingGoal: BudgetGoal[] = [
      { id: '4', name: 'Almost There', current: 90000, target: 100000, category: 'Shopping', userId: 'user1', currency: 'INR' },
    ];
    render(<BudgetGoals goals={nearingGoal} />);
    expect(screen.getByText(/nearing budget limit/i)).toBeInTheDocument();
  });

  test('renders "Budget target reached" message when appropriate', () => {
    const reachedGoal: BudgetGoal[] = [
      { id: '5', name: 'Goal Achieved', current: 100000, target: 100000, category: 'Investment', userId: 'user1', currency: 'INR' },
    ];
    render(<BudgetGoals goals={reachedGoal} />);
    expect(screen.getByText(/budget target reached/i)).toBeInTheDocument();
  });

  test('handles zero target amount correctly for progress calculation', () => {
    const zeroTargetGoal: BudgetGoal[] = [
      { id: '6', name: 'No Target Goal', current: 50000, target: 0, category: 'Miscellaneous', userId: 'user1', currency: 'INR' },
    ];
    render(<BudgetGoals goals={zeroTargetGoal} />);
    
    expect(screen.getByText(zeroTargetGoal[0].category)).toBeInTheDocument();
    const expectedAmountText = `${formatCurrency(zeroTargetGoal[0].current)} / ${formatCurrency(zeroTargetGoal[0].target)}`;
    expect(screen.getByText(expectedAmountText)).toBeInTheDocument();

    const progressBar = screen.getByLabelText(`${zeroTargetGoal[0].category} budget progress: 0%`);
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuenow', '0');
  });

});
