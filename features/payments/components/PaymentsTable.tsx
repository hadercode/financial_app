import React from 'react'
import { Payment } from '../types/payment.types'
import { downloadProof } from '../../../features/transactions/helpers/transaction.helper'

const PaymentsTable = ({ payments }: { payments: Payment[] }) => {
    return (
        <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Fecha</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Monto</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Notas</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Comprobante</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
                {payments.length === 0 ? (
                    <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                            No hay pagos registrados aún.
                        </td>
                    </tr>
                ) : (
                    payments.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/50">
                            <td className="px-6 py-4 text-sm text-slate-900">
                                {new Date(p.paymentDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 font-medium text-slate-900">
                                ${p.amount.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate" title={p.notes}>
                                {p.notes || '-'}
                            </td>
                            <td className="px-6 py-4">
                                {p.proofUrl ? (
                                    <button
                                        onClick={() => downloadProof(p.proofUrl!, `pago-${new Date(p.paymentDate).toISOString().split('T')[0]}`)}
                                        className="text-indigo-600 hover:text-indigo-800 text-xs font-medium flex items-center gap-1"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        Descargar
                                    </button>
                                ) : (
                                    <span className="text-slate-400 text-xs">-</span>
                                )}
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    )
}

export default PaymentsTable