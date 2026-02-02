
import React from 'react';
import { generateAnalysisPDF } from '../services/pdfService';
import { AIAdvice, Transaction } from '../types';

interface Props {
  advice: AIAdvice | null;
  loading: boolean;
  onRefresh: () => void;
  transactions: Transaction[];
}

const AIAdvisor: React.FC<Props> = ({ advice, loading, onRefresh, transactions }) => {
  const handleDownload = async () => {
    try {
      await generateAnalysisPDF('ai-analysis-content');
    } catch (error) {
      console.error('Failed to download PDF', error);
      alert('Error al generar el PDF.');
    }
  };

  return (
    <div className="bg-indigo-900 text-white rounded-2xl p-8 shadow-2xl relative overflow-hidden mb-8" id="ai-analysis-container">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-20 -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500 rounded-full blur-3xl opacity-20 -ml-24 -mb-24"></div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-indigo-400 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </span>
              Asesor Financiero Gemini
            </h2>
            <p className="text-indigo-200 mt-1">Análisis inteligente de tu flujo de caja mensual</p>
          </div>
          <div className="flex gap-2">
            {advice && (
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-indigo-800 text-indigo-100 font-semibold rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2 border border-indigo-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Descargar
              </button>
            )}
            <button
              onClick={onRefresh}
              disabled={loading || transactions.length === 0}
              className="px-6 py-2 bg-white text-indigo-900 font-semibold rounded-xl hover:bg-indigo-50 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Analizando...
                </>
              ) : (
                'Actualizar Análisis'
              )}
            </button>
          </div>
        </div>

        {!advice && !loading && (
          <div className="text-center py-10 border border-indigo-700 rounded-xl bg-indigo-950/30">
            <p className="text-indigo-300">Haz clic en "Actualizar Análisis" para recibir recomendaciones personalizadas.</p>
          </div>
        )}

        {advice && (
          <div id="ai-analysis-content" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-indigo-950/40 p-5 rounded-xl border border-indigo-800">
                <h3 className="text-indigo-300 text-xs font-bold uppercase tracking-widest mb-3">Prioridades de Pago</h3>
                <div className="space-y-4">
                  {advice.priorityList.map((item) => {
                    const trans = transactions.find(t => t.id === item.id);
                    return (
                      <div key={item.id} className="flex gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-indigo-800 rounded-lg flex items-center justify-center font-bold text-indigo-300">
                          {item.priorityScore}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-100">{trans?.description || 'Item desconocido'}</div>
                          <p className="text-sm text-indigo-200 leading-relaxed">{item.reason}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white/10 p-5 rounded-xl backdrop-blur-sm border border-white/10">
                <h3 className="text-indigo-300 text-xs font-bold uppercase tracking-widest mb-3">Resumen Estratégico</h3>
                <p className="text-slate-100 text-sm leading-relaxed mb-6">
                  {advice.summary}
                </p>
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-indigo-300 uppercase">Consejos de Optimización:</h4>
                  {advice.tips.map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm text-indigo-100">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                      {tip}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAdvisor;
