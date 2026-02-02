import { supabase } from '../../../lib/supabase';
import { Payment } from '../types/payment.types';
import { mapToPayment } from '../mappers/paymentMapper';
import { transactionService } from '../../transactions/services/transactionService';

export const paymentService = {

    async uploadReceipt(file: File, userId: string): Promise<string> {
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from('receipts')
            .upload(fileName, file);

        if (uploadError) {
            throw uploadError;
        }

        const { data } = supabase.storage
            .from('receipts')
            .getPublicUrl(fileName);

        return data.publicUrl;
    },

    async getPaymentsByTransactionId(transactionId: string): Promise<Payment[]> {
        const { data, error } = await supabase
            .from('payments')
            .select('*')
            .eq('transaction_id', transactionId)
            .order('payment_date', { ascending: false });

        if (error) {
            console.error('Error fetching payments:', error);
            return [];
        }
        return data.map(mapToPayment);
    },

    async registerPayment(payment: Omit<Payment, 'id' | 'createdAt' | 'userId'>): Promise<void> {

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) throw new Error('User not authenticated');

        const dbPayment = {
            transaction_id: payment.transactionId,
            user_id: user.id,
            amount: payment.amount,
            payment_date: payment.paymentDate,
            proof_url: payment.proofUrl,
            notes: payment.notes
        };

        const { error: insertError } = await supabase
            .from('payments')
            .insert([dbPayment]);

        if (insertError) throw insertError;

        // Check sum and update status if needed
        const payments = await this.getPaymentsByTransactionId(payment.transactionId);
        const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

        const transaction = await transactionService.getTransactionById(payment.transactionId);
        if (transaction && totalPaid >= transaction.amount && transaction.status !== 'completed') {
            await transactionService.updateTransaction(transaction.id, {
                status: 'completed',
                // Update these too for backward compatibility if needed
                paymentDate: new Date().toISOString(),
                proofImage: payment.proofUrl
            });
        }
    }
};
