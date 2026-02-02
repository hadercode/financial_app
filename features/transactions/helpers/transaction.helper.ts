import { Transaction } from '../types/transaction.types';

export const getTypeStyles = (type: string): string => {
    switch (type) {
        case 'payable': return 'bg-rose-50 text-rose-700 border-rose-100';
        case 'receivable': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
        case 'fixed': return 'bg-blue-50 text-blue-700 border-blue-100';
        case 'income': return 'bg-amber-50 text-amber-700 border-amber-100';
        default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
};

export const getTypeText = (type: string): string => {
    switch (type) {
        case 'payable': return 'Por Pagar';
        case 'receivable': return 'Por Cobrar';
        case 'fixed': return 'Fijo';
        case 'income': return 'Ingreso';
        default: return type;
    }
};

export const downloadProof = (proof: string, name: string): void => {
    const link = document.createElement('a');
    link.href = proof;
    link.download = `comprobante-${name.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.click();
};

export const calculateMetrics = (transactions: Transaction[]) => {
    const totals = transactions.reduce((acc, t) => {
        if (t.type === 'income') acc.income += t.amount;
        if (t.type === 'receivable' && t.status === 'pending') acc.pendingReceivable += t.amount;
        if (t.type === 'payable' && t.status === 'pending') acc.pendingPayable += t.amount;
        if (t.type === 'fixed') acc.fixed += t.amount;
        return acc;
    }, { income: 0, pendingReceivable: 0, pendingPayable: 0, fixed: 0 });

    return {
        ...totals,
        netBalance: totals.income + totals.pendingReceivable - (totals.pendingPayable + totals.fixed)
    };
};

export const generateChartData = (metrics: { income: number; pendingReceivable: number; pendingPayable: number; fixed: number; }) => {
    return [
        { name: 'Ingresos', value: metrics.income, color: '#10b981' },
        { name: 'Por Cobrar', value: metrics.pendingReceivable, color: '#fbbf24' },
        { name: 'Por Pagar', value: metrics.pendingPayable, color: '#f43f5e' },
        { name: 'Gastos Fijos', value: metrics.fixed, color: '#3b82f6' },
    ];
};
