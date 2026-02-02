import React from 'react';

import {
  BarChart, Bar, XAxis,
  YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts';

import { FundsDistributionChartProps } from '../types/transaction.types';

const FundsDistributionChart: React.FC<FundsDistributionChartProps> = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <h3 className="text-sm font-bold text-slate-600 mb-6 uppercase">Distribución de Fondos</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
            <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FundsDistributionChart;