import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useTranslation } from '../lib/i18n';
import { Plus } from 'lucide-react';

export default function Inventory() {
  const { t } = useTranslation();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    itemName: '', sku: '', quantity: '', unit: '', threshold: ''
  });

  const fetchItems = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(collection(db, "inventory"));
    setItems(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, "inventory"), {
      ...formData,
      quantity: Number(formData.quantity),
      threshold: Number(formData.threshold)
    });
    setShowForm(false);
    setFormData({ itemName: '', sku: '', quantity: '', unit: '', threshold: '' });
    fetchItems();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">{t.inventory}</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded hover:bg-slate-800 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> {t.addItem}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">{t.itemName}</label>
              <input type="text" required value={formData.itemName} onChange={e => setFormData({...formData, itemName: e.target.value})} className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">{t.sku}</label>
              <input type="text" required value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">{t.quantity}</label>
              <input type="number" required value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">{t.unit}</label>
              <input type="text" required value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">{t.threshold}</label>
              <input type="number" required value={formData.threshold} onChange={e => setFormData({...formData, threshold: e.target.value})} className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div className="col-span-2 flex justify-end gap-3 mt-4 border-t border-slate-100 pt-4">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-slate-200 rounded text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50">{t.cancel}</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded text-[10px] font-bold uppercase tracking-widest hover:bg-blue-700">{t.save}</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 overflow-x-auto mt-6">
        <h3 className="text-xs font-black uppercase text-slate-500 tracking-widest mb-4">Live Inventory</h3>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-tighter">
              <th className="pb-2">{t.itemName}</th>
              <th className="pb-2">{t.sku}</th>
              <th className="pb-2">{t.quantity}</th>
              <th className="pb-2">{t.threshold}</th>
            </tr>
          </thead>
          <tbody className="text-xs font-medium text-slate-300">
            {loading ? (
              <tr><td colSpan={4} className="py-4 text-center text-slate-600 italic">Loading...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={4} className="py-4 text-center text-slate-600 italic">No items found.</td></tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                  <td className="py-3 text-amber-500 font-bold">{item.itemName}</td>
                  <td className="py-3">{item.sku}</td>
                  <td className="py-3 font-bold">
                    <span className={item.quantity <= item.threshold ? 'text-rose-500' : 'text-slate-200'}>
                      {item.quantity} {item.unit}
                    </span>
                  </td>
                  <td className="py-3 text-slate-500">{item.threshold} {item.unit}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
