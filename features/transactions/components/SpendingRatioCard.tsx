import React from 'react';
import { SpendingRatioCardProps } from '../types/transaction.types';

const SpendingRatioCard: React.FC<SpendingRatioCardProps> = ({ income, pendingPayable, fixed }) => {
  const spendingRatio = income > 0 ? Math.round(((pendingPayable + fixed) / income) * 100) : 0;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <h3 className="text-sm font-bold text-slate-600 mb-2 uppercase">Proporción de Gasto</h3>
      <p className="text-xs text-slate-400 mb-4">Gasto total vs Ingresos</p>
      <div className="h-48 flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl font-black text-slate-800">
            {spendingRatio}%
          </div>
          <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">Capacidad de Pago Utilizada</div>
        </div>
      </div>
    </div>
  );
};

export default SpendingRatioCard;