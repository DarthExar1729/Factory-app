import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { useTranslation } from '../lib/i18n';
import { LayoutDashboard, Users, ClipboardCheck, Factory, Package, ShoppingCart, LogOut, Globe, ShieldCheck } from 'lucide-react';

export default function Layout() {
  const { role, logout, user } = useAuth();
  const { t, language, setLanguage } = useTranslation();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
      <aside className="w-64 bg-slate-900 text-white flex flex-col border-r border-slate-700">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-sm flex items-center justify-center font-bold text-lg italic text-white">F</div>
          <h1 className="text-xl font-bold tracking-tight text-white">FactorySync</h1>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavLink to="/dashboard" className={({isActive}) => `flex items-center gap-3 p-3 rounded-md transition-colors border-l-4 ${isActive ? 'bg-blue-600/20 text-blue-400 border-blue-500' : 'border-transparent text-slate-400 hover:bg-slate-800'}`}>
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-xs uppercase font-semibold">{t.dashboard}</span>
          </NavLink>
          
          {(role === 'admin' || permissions.includes('employees')) && (
            <NavLink to="/employees" className={({isActive}) => `flex items-center gap-3 p-3 rounded-md transition-colors border-l-4 ${isActive ? 'bg-blue-600/20 text-blue-400 border-blue-500' : 'border-transparent text-slate-400 hover:bg-slate-800'}`}>
              <Users className="w-5 h-5" />
              <span className="text-xs uppercase font-semibold">{t.employees}</span>
            </NavLink>
          )}

          {(role === 'admin' || permissions.includes('attendance')) && (
            <NavLink to="/attendance" className={({isActive}) => `flex items-center gap-3 p-3 rounded-md transition-colors border-l-4 ${isActive ? 'bg-blue-600/20 text-blue-400 border-blue-500' : 'border-transparent text-slate-400 hover:bg-slate-800'}`}>
              <ClipboardCheck className="w-5 h-5" />
              <span className="text-xs uppercase font-semibold">{t.attendance}</span>
            </NavLink>
          )}

          {(role === 'admin' || permissions.includes('production')) && (
            <NavLink to="/production" className={({isActive}) => `flex items-center gap-3 p-3 rounded-md transition-colors border-l-4 ${isActive ? 'bg-blue-600/20 text-blue-400 border-blue-500' : 'border-transparent text-slate-400 hover:bg-slate-800'}`}>
              <Factory className="w-5 h-5" />
              <span className="text-xs uppercase font-semibold">{t.production}</span>
            </NavLink>
          )}

          {(role === 'admin' || permissions.includes('inventory')) && (
            <NavLink to="/inventory" className={({isActive}) => `flex items-center gap-3 p-3 rounded-md transition-colors border-l-4 ${isActive ? 'bg-blue-600/20 text-blue-400 border-blue-500' : 'border-transparent text-slate-400 hover:bg-slate-800'}`}>
              <Package className="w-5 h-5" />
              <span className="text-xs uppercase font-semibold">{t.inventory}</span>
            </NavLink>
          )}

          {(role === 'admin' || permissions.includes('sales')) && (
            <NavLink to="/sales" className={({isActive}) => `flex items-center gap-3 p-3 rounded-md transition-colors border-l-4 ${isActive ? 'bg-blue-600/20 text-blue-400 border-blue-500' : 'border-transparent text-slate-400 hover:bg-slate-800'}`}>
              <ShoppingCart className="w-5 h-5" />
              <span className="text-xs uppercase font-semibold">{t.sales}</span>
            </NavLink>
          )}

          {role === 'admin' && (
            <NavLink to="/users" className={({isActive}) => `flex items-center gap-3 p-3 rounded-md transition-colors border-l-4 ${isActive ? 'bg-blue-600/20 text-blue-400 border-blue-500' : 'border-transparent text-slate-400 hover:bg-slate-800'}`}>
              <ShieldCheck className="w-5 h-5" />
              <span className="text-xs uppercase font-semibold">{t.systemUsers}</span>
            </NavLink>
          )}
        </nav>

        <div className="p-6 bg-slate-950 border-t border-slate-800 text-[10px] text-slate-500 uppercase tracking-tighter">
          System Version 4.2.1-PRO
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <span className="px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded uppercase">{role === 'admin' ? 'Admin Access' : 'Manager Access'}</span>
            <h2 className="text-lg font-semibold">Command Center</h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex bg-slate-100 rounded-full p-1 text-xs font-bold items-center">
              <button onClick={() => setLanguage('en')} className={`px-3 py-1 rounded-full ${language === 'en' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>English</button>
              <button onClick={() => setLanguage('hi')} className={`px-3 py-1 rounded-full ${language === 'hi' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>हिंदी (Hindi)</button>
            </div>
            <button onClick={logout} className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-700 uppercase tracking-wider">
              <LogOut className="w-4 h-4" />
              {t.logout}
            </button>
            <div className="w-10 h-10 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-xs font-bold text-slate-600 uppercase">
              {user?.email?.substring(0, 2) || 'US'}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
