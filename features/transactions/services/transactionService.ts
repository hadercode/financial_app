import { supabase } from '../../../lib/supabase';
import { Transaction } from '../types/transaction.types';
import { mapToTransaction, mapToDB, mapToDBPartial } from '../mappers/transaction.mapper';

export const transactionService = {
    async getTransactionById(id: string): Promise<Transaction | null> {
        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching transaction:', error);
            return null;
        }
        return mapToTransaction(data);
    },

    async fetchTransactions(): Promise<Transaction[]> {
        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching transactions:', error);
            throw error;
        }

        return (data || []).map(mapToTransaction);
    },

    async addTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction> {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            throw new Error('User not authenticated');
        }

        const dbTransaction = {
            ...mapToDB(transaction),
            user_id: user.id
        };

        const { data, error } = await supabase
            .from('transactions')
            .insert([dbTransaction])
            .select()
            .single();

        if (error) {
            console.error('Error adding transaction:', error);
            throw error;
        }

        return mapToTransaction(data);
    },

    async updateTransaction(id: string, updates: Partial<Omit<Transaction, 'id' | 'createdAt'>>): Promise<Transaction> {
        const dbUpdates = mapToDBPartial(updates);
        const { data, error } = await supabase
            .from('transactions')
            .update(dbUpdates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating transaction:', error);
            throw error;
        }

        return mapToTransaction(data);
    },

    async toggleStatus(id: string, currentStatus: 'pending' | 'completed'): Promise<void> {
        const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
        const { error } = await supabase
            .from('transactions')
            .update({ status: newStatus })
            .eq('id', id);

        if (error) {
            console.error('Error toggling transaction status:', error);
            throw error;
        }
    },

    async deleteTransaction(id: string): Promise<void> {
        const { error } = await supabase
            .from('transactions')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting transaction:', error);
            throw error;
        }
    }
};
