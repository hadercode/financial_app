
import AIAdvisor from '../components/AIAdvisor';
import { TransactionForm, TransactionTable, useFinancialManagement, FundsDistributionChart, SpendingRatioCard } from '../features/transactions';
import Header from '../components/Header';

const DashboardPage = () => {
    const {
        transactions,
        aiAdvice,
        loadingAdvice,
        metrics,
        chartData,
        handleAddTransaction,
        handleToggleStatus,
        handleUploadProof,
        handleDeleteTransaction,
        fetchAdvice,
    } = useFinancialManagement();

    return (
        <div className="min-h-screen pb-20">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">Balance Proyectado</p>
                        <p className={`text-2xl font-bold ${metrics.netBalance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                            ${metrics.netBalance.toLocaleString()}
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">Total por Pagar</p>
                        <p className="text-2xl font-bold text-slate-900">
                            ${(metrics.pendingPayable + metrics.fixed).toLocaleString()}
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">Cuentas por Cobrar</p>
                        <p className="text-2xl font-bold text-slate-900">
                            ${metrics.pendingReceivable.toLocaleString()}
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">Gastos Fijos</p>
                        <p className="text-2xl font-bold text-slate-900">
                            ${metrics.fixed.toLocaleString()}
                        </p>
                    </div>
                </div>

                <AIAdvisor
                    advice={aiAdvice}
                    loading={loadingAdvice}
                    onRefresh={fetchAdvice}
                    transactions={transactions}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <TransactionForm onAdd={handleAddTransaction} />

                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-800">Tus Transacciones</h2>
                            <div className="text-xs text-slate-400">Total: {transactions.length} registros</div>
                        </div>

                        <TransactionTable
                            transactions={transactions}
                            onToggleStatus={handleToggleStatus}
                            onDelete={handleDeleteTransaction}
                            onUploadProof={handleUploadProof}
                        />
                    </div>

                    <div className="space-y-8">
                        <FundsDistributionChart data={chartData} />
                        <SpendingRatioCard
                            income={metrics.income}
                            pendingPayable={metrics.pendingPayable}
                            fixed={metrics.fixed}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;
