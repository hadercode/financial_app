import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePaymentPage } from '../hooks/usePaymentPage';

const PaymentPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const {
        transaction,
        date,
        setDate,
        notes,
        setNotes,
        amountToPay,
        setAmountToPay,
        totalPaid,
        file,
        handleFileChange,
        loading,
        uploading,
        handleSubmit,
        shareViaWhatsApp
    } = usePaymentPage(id);

    if (!transaction) return <div className="p-8 text-center flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
                <div className="md:flex">
                    <div className="p-8 w-full">
                        <div className="flex items-center justify-between mb-6">
                            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Registrar Pago</div>
                            <button onClick={() => navigate('/')} className="text-slate-400 hover:text-slate-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <h1 className="block mt-1 text-lg leading-tight font-medium text-black">
                            {transaction?.description}
                        </h1>
                        <div className="mt-2">
                            <p className="text-slate-500">Monto Total: <span className="font-semibold">${transaction?.amount.toLocaleString()}</span></p>
                            <p className="text-slate-500">Pagado: <span className="font-semibold text-emerald-600">${totalPaid.toLocaleString()}</span></p>
                            <p className="text-lg mt-1 font-bold text-slate-900">
                                Restante: ${(transaction?.amount || 0) - totalPaid > 0 ? ((transaction?.amount || 0) - totalPaid).toLocaleString() : '0'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Fecha de Pago</label>
                                <input
                                    type="date"
                                    required
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">Monto a Pagar</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 sm:text-sm">$</span>
                                    </div>
                                    <input
                                        type="number"
                                        required
                                        min="0.01"
                                        step="0.01"
                                        value={amountToPay}
                                        onChange={(e) => setAmountToPay(e.target.value)}
                                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-slate-300 rounded-md p-2 border"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">Notas / Referencia</label>
                                <textarea
                                    rows={3}
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                    placeholder="Número de operación, banco, etc..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">Comprobante (Imagen)</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md hover:bg-slate-50 transition-colors cursor-pointer relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className="space-y-1 text-center">
                                        <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <div className="flex text-sm text-slate-600 justify-center">
                                            <span className="font-medium text-indigo-600 hover:text-indigo-500">
                                                {file ? file.name : 'Subir Comprobante'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500">PNG, JPG, GIF hasta 5MB</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={loading || uploading}
                                    className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                >
                                    {loading ? (uploading ? 'Subiendo...' : 'Guardando...') : 'Registrar Pago'}
                                </button>

                                <button
                                    type="button"
                                    onClick={shareViaWhatsApp}
                                    className="flex items-center justify-center px-4 py-2 border border-emerald-200 rounded-md shadow-sm text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                                    title="Compartir en WhatsApp"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.698c1.005.549 1.996.818 2.806.818 3.181 0 5.767-2.587 5.767-5.766.001-3.182-2.585-5.769-5.767-5.769zm9.398 5.766c0 5.174-4.223 9.397-9.398 9.397-1.636 0-3.342-.423-4.83-1.229l-5.403 1.417 1.442-5.267C2.378 14.67 1.892 12.875 1.892 11.938 1.892 6.765 6.115 2.541 11.29 2.541c5.176 0 9.399 4.225 9.399 9.397z" />
                                    </svg>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
