import { Transaction } from "./features/transactions/types/transaction.types";

export interface BudgetState {
  transactions: Transaction[];
  monthlyIncomeGoal: number;
  monthlyExpenseBudget: number;
}

export interface AIAdvice {
  priorityList: {
    id: string;
    reason: string;
    priorityScore: number;
  }[];
  summary: string;
  tips: string[];
}
