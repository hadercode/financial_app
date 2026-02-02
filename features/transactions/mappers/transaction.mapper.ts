import { Transaction } from '../types/transaction.types';

export const mapToTransaction = (item: any): Transaction => ({
    id: item.id,
    description: item.description,
    amount: item.amount,
    dueDate: item.due_date,
    type: item.type as Transaction['type'],
    status: item.status as Transaction['status'],
    category: item.category,
    priority: item.priority,
    createdAt: item.created_at,
    proofImage: item.proof_image,
    paymentDate: item.payment_date,
    paymentNotes: item.payment_notes
});

export const mapToDB = (transaction: Partial<Transaction>) => ({
    description: transaction.description,
    amount: transaction.amount,
    due_date: transaction.dueDate,
    type: transaction.type,
    status: transaction.status,
    category: transaction.category,
    priority: transaction.priority,
    proof_image: transaction.proofImage,
    payment_date: transaction.paymentDate,
    payment_notes: transaction.paymentNotes
});

export const mapToDBPartial = (data: Partial<Omit<Transaction, 'id' | 'createdAt'>>): any => {
    const mapped: any = {};
    if (data.description !== undefined) mapped.description = data.description;
    if (data.amount !== undefined) mapped.amount = data.amount;
    if (data.dueDate !== undefined) mapped.due_date = data.dueDate;
    if (data.type !== undefined) mapped.type = data.type;
    if (data.status !== undefined) mapped.status = data.status;
    if (data.category !== undefined) mapped.category = data.category;
    if (data.priority !== undefined) mapped.priority = data.priority;
    if (data.proofImage !== undefined) mapped.proof_image = data.proofImage;
    if (data.paymentDate !== undefined) mapped.payment_date = data.paymentDate;
    return mapped;
};
