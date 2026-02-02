
import { useState, useEffect, useCallback } from 'react';
import { transactionService } from '../services/transactionService';
import { Transaction } from '../types/transaction.types';

export const useTransactions = () => {

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTransactions = useCallback(async () => {
        try {
            setLoading(true);
            const data = await transactionService.fetchTransactions();
            setTransactions(data);
            setError(null);
        } catch (err) {
            setError('Error fetching transactions');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const addTransaction = async (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
        try {
            const newTransaction = await transactionService.addTransaction(transaction);
            setTransactions((prev) => [newTransaction, ...prev]);
            return newTransaction;
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    const updateTransaction = async (id: string, updates: Partial<Omit<Transaction, 'id' | 'createdAt'>>) => {
        try {
            const updated = await transactionService.updateTransaction(id, updates);
            setTransactions((prev) => prev.map((t) => (t.id === id ? updated : t)));
            return updated;
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    const deleteTransaction = async (id: string) => {
        try {
            await transactionService.deleteTransaction(id);
            setTransactions((prev) => prev.filter((t) => t.id !== id));
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    return {
        transactions,
        loading,
        error,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        refreshTransactions: fetchTransactions,
    };
};
