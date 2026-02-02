import { useParams, useNavigate } from 'react-router-dom';
import { usePaymentHistory } from '../hooks/usePaymentHistory';

import PaymentsTable from '@/features/payments/components/PaymentsTable';

const PaymentHistoryPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { transaction, payments, loading, totalPaid, remaining } = usePaymentHistory(id);

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
    if (!transaction) return <div className="p-8 text-center text-slate-500">Transacción no encontrada.</div>;

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header Card */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <button
                                onClick={() => navigate('/')}
                                className="text-sm text-slate-500 hover:text-indigo-600 flex items-center gap-1 mb-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Volver al Dashboard
                            </button>
                            <h1 className="text-2xl font-bold text-slate-900">{transaction.description}</h1>
                            <span className="inline-block mt-2 px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full uppercase">
                                {transaction.category}
                            </span>
                        </div>
                        <div className={`px-4 py-2 rounded-lg border ${remaining === 0 ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
                            <div className="text-xs font-semibold uppercase opacity-75">Estado</div>
                            <div className="font-bold">{remaining === 0 ? 'Pagado' : 'Pendiente'}</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
                        <div>
                            <div className="text-xs text-slate-400 font-semibold uppercase">Monto Total</div>
                            <div className="text-xl font-bold text-slate-900">${transaction.amount.toLocaleString()}</div>
                        </div>
                        <div>
                            <div className="text-xs text-slate-400 font-semibold uppercase">Total Pagado</div>
                            <div className="text-xl font-bold text-emerald-600">${totalPaid.toLocaleString()}</div>
                        </div>
                        <div>
                            <div className="text-xs text-slate-400 font-semibold uppercase">Restante</div>
                            <div className="text-xl font-bold text-slate-700">${remaining.toLocaleString()}</div>
                        </div>
                    </div>
                </div>

                {/* History Table */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                        <h2 className="font-bold text-slate-800">Historial de Pagos</h2>
                        {remaining > 0 && (
                            <button
                                onClick={() => navigate(`/payment/${id}`)}
                                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition"
                            >
                                Registrar Nuevo Pago
                            </button>
                        )}
                    </div>

                    <div className="overflow-x-auto">
                        <PaymentsTable payments={payments} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentHistoryPage;
