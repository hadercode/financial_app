import { useState, useMemo, useCallback } from 'react';
import { Transaction } from '../types/transaction.types';
import { AIAdvice } from '../../../types';
import { getFinancialAdvice } from '../../../services/geminiService';
import { useTransactions } from './useTransactions';
import { calculateMetrics, generateChartData } from '../helpers/transaction.helper';

export const useFinancialManagement = () => {
  const {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    loading: loadingTransactions,
    refreshTransactions
  } = useTransactions();

  const [aiAdvice, setAiAdvice] = useState<AIAdvice | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  // Removed LocalStorage logic as we now use Supabase

  const handleAddTransaction = useCallback(async (data: Omit<Transaction, 'id' | 'createdAt'>) => {
    try {
      await addTransaction(data);
    } catch (error) {
      console.error("Failed to add transaction", error);
      alert("Error al guardar la transacción.");
    }
  }, [addTransaction]);

  const handleToggleStatus = useCallback(async (id: string) => {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) return;

    const newStatus = transaction.status === 'completed' ? 'pending' : 'completed';
    try {
      await updateTransaction(id, { status: newStatus });
    } catch (error) {
      console.error("Failed to update status", error);
    }
  }, [transactions, updateTransaction]);

  const handleUploadProof = useCallback(async (id: string, base64: string) => {
    try {
      await updateTransaction(id, {
        proofImage: base64,
        paymentDate: new Date().toISOString()
      });
    } catch (error) {
      console.error("Failed to upload proof", error);
    }
  }, [updateTransaction]);

  const handleDeleteTransaction = useCallback(async (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta transacción?')) {
      try {
        await deleteTransaction(id);
      } catch (error) {
        console.error("Failed to delete transaction", error);
      }
    }
  }, [deleteTransaction]);

  const fetchAdvice = useCallback(async () => {
    if (transactions.length === 0) return;
    setLoadingAdvice(true);
    try {
      const advice = await getFinancialAdvice(transactions);
      setAiAdvice(advice);
    } catch (error) {
      console.error(error);
      alert("Hubo un error obteniendo el análisis. Revisa tu API Key.");
    } finally {
      setLoadingAdvice(false);
    }
  }, [transactions]);

  const metrics = useMemo(() => calculateMetrics(transactions), [transactions]);

  const chartData = useMemo(() => generateChartData(metrics), [metrics]);

  return {
    transactions,
    aiAdvice,
    loadingAdvice: loadingAdvice || loadingTransactions,
    metrics,
    chartData,
    handleAddTransaction,
    handleToggleStatus,
    handleUploadProof,
    handleDeleteTransaction,
    fetchAdvice,
    fetchTransactions: refreshTransactions
  };
};