
import React from 'react';
import { useAuth } from '../context/AuthContext';

const WelcomePage: React.FC = () => {
    const { signInWithGoogle } = useAuth();

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-200 rounded-full blur-3xl opacity-30 -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-200 rounded-full blur-3xl opacity-30 -ml-20 -mb-20"></div>

            <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full relative z-10 text-center border border-slate-100">
                <div className="mb-8 flex justify-center">
                    <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>

                <h1 className="text-3xl font-extrabold text-slate-900 mb-3">Finanza AI</h1>
                <p className="text-slate-500 mb-8">
                    Toma el control de tus finanzas con el poder de la Inteligencia Artificial.
                </p>

                <div className="space-y-4">
                    <button
                        onClick={signInWithGoogle}
                        className="w-full py-3 px-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-3 shadow-sm group"
                    >
                        <img
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                            alt="Google logo"
                            className="w-5 h-5"
                        />
                        <span className="text-slate-700 font-semibold group-hover:text-slate-900">
                            Continuar con Google
                        </span>
                    </button>
                </div>

                <p className="mt-8 text-xs text-slate-400">
                    Al continuar, aceptas nuestros términos y condiciones.
                </p>
            </div>
        </div>
    );
};

export default WelcomePage;
