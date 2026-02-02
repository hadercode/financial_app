import React from 'react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">Finanza <span className="text-indigo-600">AI</span></span>
          </div>
          {user ? (
            <div className="flex items-center gap-4">
              <div className="text-sm text-slate-600 hidden md:block">
                {user.email}
              </div>
              <button
                onClick={signOut}
                className="text-sm font-medium text-slate-500 hover:text-rose-600 transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <div className="text-sm font-medium text-slate-500">
              Presupuesto Mensual Inteligente
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Header;