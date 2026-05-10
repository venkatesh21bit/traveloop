import { create } from 'zustand';
import type { Budget, Expense } from '@/types/types';

interface BudgetState {
  budgets: Budget[];
  currentBudget: Budget | null;
  isLoading: boolean;
  setBudgets: (budgets: Budget[]) => void;
  setCurrentBudget: (budget: Budget | null) => void;
  updateBudget: (id: string, budget: Partial<Budget>) => void;
  addExpense: (budgetId: string, expense: Expense) => void;
  updateExpense: (budgetId: string, expenseId: string, expense: Partial<Expense>) => void;
  deleteExpense: (budgetId: string, expenseId: string) => void;
  getTotalSpent: (budgetId: string) => number;
  getCategorySpent: (budgetId: string, category: Expense['category']) => number;
  isOverBudget: (budgetId: string, category?: Expense['category']) => boolean;
}

export const useBudgetStore = create<BudgetState>((set, get) => ({
  budgets: [],
  currentBudget: null,
  isLoading: false,

  setBudgets: (budgets) => set({ budgets }),

  setCurrentBudget: (budget) => set({ currentBudget: budget }),

  updateBudget: (id, budgetData) =>
    set((state) => ({
      budgets: state.budgets.map((budget) =>
        budget.id === id ? { ...budget, ...budgetData } : budget
      ),
      currentBudget:
        state.currentBudget?.id === id
          ? { ...state.currentBudget, ...budgetData }
          : state.currentBudget,
    })),

  addExpense: (budgetId, expense) =>
    set((state) => ({
      budgets: state.budgets.map((budget) =>
        budget.id === budgetId
          ? { ...budget, expenses: [...budget.expenses, expense] }
          : budget
      ),
      currentBudget:
        state.currentBudget?.id === budgetId
          ? {
              ...state.currentBudget,
              expenses: [...state.currentBudget.expenses, expense],
            }
          : state.currentBudget,
    })),

  updateExpense: (budgetId, expenseId, expenseData) =>
    set((state) => ({
      budgets: state.budgets.map((budget) =>
        budget.id === budgetId
          ? {
              ...budget,
              expenses: budget.expenses.map((expense) =>
                expense.id === expenseId
                  ? { ...expense, ...expenseData }
                  : expense
              ),
            }
          : budget
      ),
    })),

  deleteExpense: (budgetId, expenseId) =>
    set((state) => ({
      budgets: state.budgets.map((budget) =>
        budget.id === budgetId
          ? {
              ...budget,
              expenses: budget.expenses.filter(
                (expense) => expense.id !== expenseId
              ),
            }
          : budget
      ),
    })),

  getTotalSpent: (budgetId) => {
    const { budgets } = get();
    const budget = budgets.find((b) => b.id === budgetId);
    if (!budget) return 0;

    return budget.expenses.reduce((total, expense) => total + expense.amount, 0);
  },

  getCategorySpent: (budgetId, category) => {
    const { budgets } = get();
    const budget = budgets.find((b) => b.id === budgetId);
    if (!budget) return 0;

    return budget.expenses
      .filter((expense) => expense.category === category)
      .reduce((total, expense) => total + expense.amount, 0);
  },

  isOverBudget: (budgetId, category) => {
    const { budgets, getTotalSpent, getCategorySpent } = get();
    const budget = budgets.find((b) => b.id === budgetId);
    if (!budget) return false;

    if (category) {
      const categoryBudget = budget[`${category}Cost` as keyof Budget] as number;
      const categorySpent = getCategorySpent(budgetId, category);
      return categorySpent > categoryBudget;
    }

    const totalSpent = getTotalSpent(budgetId);
    return totalSpent > budget.totalBudget;
  },
}));
