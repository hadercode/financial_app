import { Transaction } from '../../transactions/types/transaction.types';

export const generateWhatsAppUrl = (transaction: Transaction, date: string, notes: string): string => {
    const message = `Hola, envío el comprobante del pago:
    *${transaction.description}*
    Monto: $${transaction.amount.toLocaleString()}
    Fecha: ${date}
    Notas: ${notes}
    ${transaction.proofImage ? `Comprobante: ${transaction.proofImage}` : ''}`;

    return `https://wa.me/?text=${encodeURIComponent(message)}`;
};
