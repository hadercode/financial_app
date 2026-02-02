import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TransactionTableProps } from '../types/transaction.types';
import { getTypeStyles, getTypeText, downloadProof } from '../helpers/transaction.helper';

const TransactionTable = ({ transactions, onToggleStatus, onDelete, onUploadProof }: TransactionTableProps) => {

  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeIdRef = useRef<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeIdRef.current) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUploadProof(activeIdRef.current!, reader.result as string);
        activeIdRef.current = null;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMenuClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-visible"> {/* overflow-visible needed for dropdown */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <div className="overflow-x-visible"> {/* overflow-visible needed for dropdown */}
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Descripción</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Monto</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Fecha Venc.</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                  No hay transacciones registradas.
                </td>
              </tr>
            ) : (
              transactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50 transition-colors relative">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{t.description}</div>
                    <div className="text-xs text-slate-400">{t.category}</div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-700">
                    ${t.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(t.dueDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase border ${getTypeStyles(t.type)}`}>
                      {getTypeText(t.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {t.status === 'completed' ? (
                      <span className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border bg-emerald-50 text-emerald-600 border-emerald-200 w-fit">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        Pagado
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border bg-amber-50 text-amber-600 border-amber-200 w-fit">
                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                        Pendiente
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="relative inline-block text-left">
                      <button
                        onClick={(e) => handleMenuClick(e, t.id)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-full transition-colors focus:outline-none"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>

                      {openMenuId === t.id && (
                        <div
                          ref={menuRef}
                          className="origin-bottom-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 transform"
                          style={{ marginBottom: '5px' }} // Open upwards if easier, or check collision. Defaulting to standard dropdown but with z-index.
                        >
                          <div className="py-1" role="menu" aria-orientation="vertical">
                            {t.status !== 'completed' && (
                              <button
                                onClick={() => { navigate(`/payment/${t.id}`); setOpenMenuId(null); }}
                                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center gap-2"
                                role="menuitem"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Registrar Pago
                              </button>
                            )}
                            <button
                              onClick={() => { navigate(`/transactions/${t.id}/history`); setOpenMenuId(null); }}
                              className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                              role="menuitem"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Ver Historial
                            </button>
                            <button
                              onClick={() => { onDelete(t.id); setOpenMenuId(null); }}
                              className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                              role="menuitem"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Eliminar
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;
