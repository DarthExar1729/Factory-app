import React from 'react';
import { useAuth } from '../lib/auth';
import { useTranslation } from '../lib/i18n';
import { Users, ClipboardCheck, Package, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { role, user } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <header className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {role === 'admin' ? t.adminDashboard : t.managerDashboard}
          </h1>
          <p className="text-xs text-slate-500 uppercase tracking-widest mt-1 font-bold">
            {t.welcome}, {user?.email}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {role === 'admin' && (
          <Link to="/employees" className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors group">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-4 flex items-center justify-between">
              {t.employees}
              <Users className="w-4 h-4 text-blue-500" />
            </h3>
            <p className="text-sm font-medium text-slate-700 mt-1">Manage staff and roles</p>
          </Link>
        )}

        <Link to="/attendance" className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors group">
          <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-4 flex items-center justify-between">
            {t.attendance}
            <ClipboardCheck className="w-4 h-4 text-green-500" />
          </h3>
          <p className="text-sm font-medium text-slate-700 mt-1">Track daily presence</p>
        </Link>

        <Link to="/production" className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors group">
          <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-4 flex items-center justify-between">
            {t.production}
            <Factory className="w-4 h-4 text-purple-500" />
          </h3>
          <p className="text-sm font-medium text-slate-700 mt-1">Monitor daily output</p>
        </Link>

        {role === 'admin' && (
          <Link to="/inventory" className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 hover:bg-slate-800 transition-colors group">
            <h3 className="text-xs font-black uppercase text-slate-500 tracking-widest mb-4 flex items-center justify-between">
              {t.inventory}
              <ShoppingCart className="w-4 h-4 text-amber-500" />
            </h3>
            <p className="text-sm font-medium text-slate-300 mt-1">Manage stock levels</p>
          </Link>
        )}
      </div>
      
      {/* Overview Cards could be fetched from firestore here */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 mt-8">
        <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-4">Recent Activity</h3>
        <div className="flex items-center justify-center h-48 bg-slate-50 rounded-lg border border-slate-100">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Activity stream will populate here</p>
        </div>
      </div>
    </div>
  );
}
