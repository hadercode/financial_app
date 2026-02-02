import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Transaction, transactionService } from '../features/transactions'; // using barrel
import { paymentService } from '../features/payments'; // using barrel
import { generateWhatsAppUrl } from '../features/payments/helpers/payment.helper';

export const usePaymentPage = (id: string | undefined) => {

    const navigate = useNavigate();
    const { user } = useAuth();

    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [notes, setNotes] = useState('');
    const [amountToPay, setAmountToPay] = useState('');
    const [totalPaid, setTotalPaid] = useState(0);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!id) return;

        const loadData = async () => {
            try {
                const tx = await transactionService.getTransactionById(id);
                if (!tx) {
                    navigate('/');
                    return;
                }
                setTransaction(tx);

                const payments = await paymentService.getPaymentsByTransactionId(id);
                const paid = payments.reduce((sum, p) => sum + p.amount, 0);
                setTotalPaid(paid);

                const remaining = Math.max(0, tx.amount - paid);
                setAmountToPay(remaining.toString());
            } catch (err) {
                console.error("Error loading payment data", err);
            }
        };
        loadData();
    }, [id, navigate]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !transaction) return;

        setLoading(true);
        try {
            let publicUrl = transaction.proofImage;

            if (file) {
                setUploading(true);
                publicUrl = await paymentService.uploadReceipt(file, user.id);
                setUploading(false);
            }

            await paymentService.registerPayment({
                transactionId: transaction.id,
                amount: parseFloat(amountToPay),
                paymentDate: new Date(date).toISOString(),
                notes: notes,
                proofUrl: publicUrl
            });

            // We could optionally refetch transaction here or navigate
            const updatedTx = await transactionService.getTransactionById(transaction.id);
            if (updatedTx) setTransaction(updatedTx);

            // Refetch totals
            const payments = await paymentService.getPaymentsByTransactionId(transaction.id);
            const paid = payments.reduce((sum, p) => sum + p.amount, 0);
            setTotalPaid(paid);

            // Reset form partially
            setFile(null);
            setNotes('');

            alert('Pago registrado correctamente');
            navigate('/');
        } catch (error) {
            console.error('Error processing payment:', error);
            alert('Error al registrar el pago. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    const shareViaWhatsApp = () => {
        if (!transaction) return;

        const url = generateWhatsAppUrl(transaction, date, notes);
        window.open(url, '_blank');
    };

    return {
        transaction,
        date,
        setDate,
        notes,
        setNotes,
        amountToPay,
        setAmountToPay,
        totalPaid,
        file,
        handleFileChange,
        loading,
        uploading,
        handleSubmit,
        shareViaWhatsApp
    };
};
