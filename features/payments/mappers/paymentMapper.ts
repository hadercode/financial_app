import { Payment } from '../types/payment.types';

export const mapToPayment = (item: any): Payment => ({
    id: item.id,
    transactionId: item.transaction_id,
    userId: item.user_id,
    amount: item.amount,
    paymentDate: item.payment_date,
    proofUrl: item.proof_url,
    notes: item.notes,
    createdAt: item.created_at
});
