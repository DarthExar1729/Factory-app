import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useTranslation } from '../lib/i18n';
import { Plus } from 'lucide-react';

export default function Employees() {
  const { t } = useTranslation();
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', position: '', department: '', supervisorId: '', currentlyDoing: '', status: 'Active'
  });

  const fetchEmployees = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(collection(db, "employees"));
    setEmployees(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, "employees"), formData);
    setShowForm(false);
    setFormData({ name: '', position: '', department: '', supervisorId: '', currentlyDoing: '', status: 'Active' });
    fetchEmployees();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">{t.employees}</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded hover:bg-slate-800 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> {t.addEmployee}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">{t.name}</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">{t.position}</label>
              <input type="text" required value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">{t.department}</label>
              <input type="text" required value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">{t.supervisor}</label>
              <input type="text" required value={formData.supervisorId} onChange={e => setFormData({...formData, supervisorId: e.target.value})} className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">{t.currentlyDoing}</label>
              <input type="text" value={formData.currentlyDoing} onChange={e => setFormData({...formData, currentlyDoing: e.target.value})} className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div className="col-span-2 flex justify-end gap-3 mt-4 border-t border-slate-100 pt-4">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-slate-200 rounded text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50">{t.cancel}</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded text-[10px] font-bold uppercase tracking-widest hover:bg-blue-700">{t.save}</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-5 overflow-x-auto">
        <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-4">Personnel Roster</h3>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
              <th className="pb-2">{t.name}</th>
              <th className="pb-2">{t.position}</th>
              <th className="pb-2">{t.department}</th>
              <th className="pb-2">{t.supervisor}</th>
              <th className="pb-2">{t.currentlyDoing}</th>
            </tr>
          </thead>
          <tbody className="text-xs font-medium text-slate-700">
            {loading ? (
              <tr><td colSpan={5} className="py-4 text-center text-slate-400 italic">Loading...</td></tr>
            ) : employees.length === 0 ? (
              <tr><td colSpan={5} className="py-4 text-center text-slate-400 italic">No employees found.</td></tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="py-3 text-blue-600 font-bold">{emp.name}</td>
                  <td className="py-3">{emp.position}</td>
                  <td className="py-3">{emp.department}</td>
                  <td className="py-3 text-slate-500 italic">{emp.supervisorId}</td>
                  <td className="py-3">{emp.currentlyDoing || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
