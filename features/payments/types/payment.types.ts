export interface Payment {
    id: string;
    transactionId: string;
    userId: string;
    amount: number;
    paymentDate: string;
    proofUrl?: string;
    notes?: string;
    createdAt: string;
}