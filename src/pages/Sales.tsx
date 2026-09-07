import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useTranslation } from '../lib/i18n';
import { Plus } from 'lucide-react';

export default function Sales() {
  const { t } = useTranslation();
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    orderId: '', date: new Date().toISOString().split('T')[0], status: 'Pending', dispatchDate: ''
  });

  const fetchSales = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(collection(db, "sales"));
    setSales(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, "sales"), {
      ...formData,
      items: [] // simplified for now
    });
    setShowForm(false);
    setFormData({ orderId: '', date: new Date().toISOString().split('T')[0], status: 'Pending', dispatchDate: '' });
    fetchSales();
  };

  const markDispatched = async (id: string) => {
    await updateDoc(doc(db, "sales", id), {
      status: 'Dispatched',
      dispatchDate: new Date().toISOString().split('T')[0]
    });
    fetchSales();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">{t.sales}</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded hover:bg-slate-800 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> {t.addOrder}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">{t.orderId}</label>
              <input type="text" required value={formData.orderId} onChange={e => setFormData({...formData, orderId: e.target.value})} className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">{t.date}</label>
              <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div className="col-span-2 flex justify-end gap-3 mt-4 border-t border-slate-100 pt-4">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-slate-200 rounded text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50">{t.cancel}</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded text-[10px] font-bold uppercase tracking-widest hover:bg-blue-700">{t.save}</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-5 overflow-x-auto">
        <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-4">Dispatch Ledger</h3>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
              <th className="pb-2">{t.orderId}</th>
              <th className="pb-2">{t.date}</th>
              <th className="pb-2">{t.status}</th>
              <th className="pb-2">{t.dispatchDate}</th>
              <th className="pb-2 text-right">{t.actions}</th>
            </tr>
          </thead>
          <tbody className="text-xs font-medium text-slate-700">
            {loading ? (
              <tr><td colSpan={5} className="py-4 text-center text-slate-400 italic">Loading...</td></tr>
            ) : sales.length === 0 ? (
              <tr><td colSpan={5} className="py-4 text-center text-slate-400 italic">No orders found.</td></tr>
            ) : (
              sales.map((sale) => (
                <tr key={sale.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="py-3 text-blue-600 font-bold">{sale.orderId}</td>
                  <td className="py-3">{sale.date}</td>
                  <td className="py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      sale.status === 'Dispatched' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {sale.status === 'Dispatched' ? t.dispatched : t.pending}
                    </span>
                  </td>
                  <td className="py-3">{sale.dispatchDate || '-'}</td>
                  <td className="py-3 text-right">
                    {sale.status === 'Pending' && (
                      <button onClick={() => markDispatched(sale.id)} className="text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                        Mark Dispatched
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
