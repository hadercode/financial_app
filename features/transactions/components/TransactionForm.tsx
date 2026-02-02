import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { FormInputs, TransactionFormProps } from '../types/transaction.types';

const TransactionForm = ({ onAdd }: TransactionFormProps) => {

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      description: '',
      amount: '',
      dueDate: '',
      type: 'payable',
      category: '',
    },
  });

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    onAdd({
      description: data.description,
      amount: parseFloat(data.amount),
      dueDate: data.dueDate,
      type: data.type,
      status: 'pending',
      category: data.category || 'General',
    });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Nueva Entrada
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-slate-500 mb-1">Descripción</label>
          <input
            type="text"
            {...register('description', { required: true })}
            className={`w-full px-4 py-2 bg-slate-50 border ${errors.description ? 'border-rose-500' : 'border-slate-200'} rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all`}
            placeholder="Ej: Renta, Factura Internet..."
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Monto ($)</label>
          <input
            type="number"
            step="0.01"
            {...register('amount', { required: true, min: 0.01 })}
            className={`w-full px-4 py-2 bg-slate-50 border ${errors.amount ? 'border-rose-500' : 'border-slate-200'} rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all`}
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Fecha Límite</label>
          <input
            type="date"
            {...register('dueDate', { required: true })}
            className={`w-full px-4 py-2 bg-slate-50 border ${errors.dueDate ? 'border-rose-500' : 'border-slate-200'} rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all`}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Tipo</label>
          <select
            {...register('type')}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          >
            <option value="payable">Cuenta por Pagar (Gasto)</option>
            <option value="receivable">Cuenta por Cobrar (Ingreso Pendiente)</option>
            <option value="fixed">Gasto Fijo</option>
            <option value="income">Ingreso Recibido</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Categoría</label>
          <input
            type="text"
            {...register('category')}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            placeholder="Hogar, Ocio, Trabajo..."
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors shadow-lg shadow-indigo-100"
          >
            Añadir Transacción
          </button>
        </div>
      </div>
    </form>
  );
};

export default TransactionForm;
