import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../lib/auth';
import { useTranslation } from '../lib/i18n';
import { Plus } from 'lucide-react';

export default function Production() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0], totalProduced: '', notes: ''
  });

  const fetchReports = async () => {
    setLoading(true);
    const q = query(collection(db, "production"), orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);
    setReports(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, "production"), {
      ...formData,
      totalProduced: Number(formData.totalProduced),
      recordedBy: user?.uid
    });
    setShowForm(false);
    setFormData({ date: new Date().toISOString().split('T')[0], totalProduced: '', notes: '' });
    fetchReports();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">{t.production}</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded hover:bg-slate-800 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> {t.addReport}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">{t.date}</label>
              <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">{t.totalProduced}</label>
              <input type="number" required value={formData.totalProduced} onChange={e => setFormData({...formData, totalProduced: e.target.value})} className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div className="col-span-2">
              <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">{t.notes}</label>
              <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} rows={3} className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div className="col-span-2 flex justify-end gap-3 mt-4 border-t border-slate-100 pt-4">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-slate-200 rounded text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50">{t.cancel}</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded text-[10px] font-bold uppercase tracking-widest hover:bg-blue-700">{t.save}</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-5 overflow-x-auto">
        <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-4">Daily Production Log</h3>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
              <th className="pb-2">{t.date}</th>
              <th className="pb-2">{t.totalProduced}</th>
              <th className="pb-2">{t.notes}</th>
            </tr>
          </thead>
          <tbody className="text-xs font-medium text-slate-700">
            {loading ? (
              <tr><td colSpan={3} className="py-4 text-center text-slate-400 italic">Loading...</td></tr>
            ) : reports.length === 0 ? (
              <tr><td colSpan={3} className="py-4 text-center text-slate-400 italic">No reports found.</td></tr>
            ) : (
              reports.map((report) => (
                <tr key={report.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="py-3 text-blue-600 font-bold">{report.date}</td>
                  <td className="py-3 font-bold text-slate-900">{report.totalProduced}</td>
                  <td className="py-3 text-slate-500">{report.notes}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
