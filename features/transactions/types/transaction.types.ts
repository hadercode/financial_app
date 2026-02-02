export type TransactionType = 'payable' | 'receivable' | 'fixed' | 'income';

export type FormInputs = {
    description: string;
    amount: string;
    dueDate: string;
    type: TransactionType;
    category: string;
};

export interface Transaction {
    id: string;
    description: string;
    amount: number;
    dueDate: string;
    type: TransactionType;
    status: 'pending' | 'completed';
    category: string;
    priority?: 'low' | 'medium' | 'high';
    createdAt: string;
    proofImage?: string; // Legacy: keep for backward compatibility or display last proof
    paymentDate?: string;
    paymentNotes?: string;
}

export interface ChartData {
    name: string;
    value: number;
    color: string;
}

export interface FundsDistributionChartProps {
    data: ChartData[];
}

export interface SpendingRatioCardProps {
    income: number;
    pendingPayable: number;
    fixed: number;
}

export interface TransactionFormProps {
    onAdd: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
}

export interface TransactionTableProps {
    transactions: Transaction[];
    onToggleStatus: (id: string) => void;
    onDelete: (id: string) => void;
    onUploadProof?: (id: string, base64: string) => void; // Made optional as we might deprecate inline upload
}