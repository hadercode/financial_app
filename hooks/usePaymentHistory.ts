import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Transaction, transactionService } from '../features/transactions';
import { paymentService, Payment } from '../features/payments';

export const usePaymentHistory = (id: string | undefined) => {
    const navigate = useNavigate();
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const [tx, payList] = await Promise.all([
                    transactionService.getTransactionById(id),
                    paymentService.getPaymentsByTransactionId(id)
                ]);

                if (!tx) {
                    navigate('/'); // or 404
                    return;
                }

                setTransaction(tx);
                setPayments(payList);
            } catch (error) {
                console.error("Error fetching history:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, navigate]);

    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
    const remaining = transaction ? Math.max(0, transaction.amount - totalPaid) : 0;

    return {
        transaction,
        payments,
        loading,
        totalPaid,
        remaining
    };
};
