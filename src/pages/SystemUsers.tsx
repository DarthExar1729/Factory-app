import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { db } from '../lib/firebase';
import { useTranslation } from '../lib/i18n';
import { Plus, ShieldAlert, User, ShieldCheck } from 'lucide-react';

const firebaseConfig = {
  projectId: "gen-lang-client-0625706161",
  appId: "1:162992494219:web:7e664a0f2287c9c042668e",
  apiKey: "AIzaSyD2gzLtgQCWt5hiUCDLSHydCaDP-yA_Y2Q",
  authDomain: "gen-lang-client-0625706161.firebaseapp.com",
  storageBucket: "gen-lang-client-0625706161.firebasestorage.app",
  messagingSenderId: "162992494219",
};

// We use a secondary app instance to create users without logging out the current admin user
const secondaryApp = getApps().find(app => app.name === 'Secondary') || initializeApp(firebaseConfig, "Secondary");
const secondaryAuth = getAuth(secondaryApp);

interface AppUser {
  id: string;
  email: string;
  role: 'admin' | 'manager';
  name: string;
  createdAt: string;
}

export default function SystemUsers() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'manager'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AppUser[];
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users: ", error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      // 1. Create user in Firebase Auth using the secondary app instance
      const userCred = await createUserWithEmailAndPassword(secondaryAuth, formData.email, formData.password);
      
      // 2. Immediately sign them out of the secondary app
      await signOut(secondaryAuth);

      // 3. Create user document in Firestore
      await setDoc(doc(db, 'users', userCred.user.uid), {
        email: userCred.user.email,
        role: formData.role,
        name: formData.name,
        createdAt: new Date().toISOString()
      });

      setShowForm(false);
      setFormData({ name: '', email: '', password: '', role: 'manager' });
      setSuccess('User created successfully');
      fetchUsers();
    } catch (err: any) {
      setError(err.message || 'Failed to create user');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">{t.systemUsers}</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded hover:bg-slate-800 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> {t.addUser}
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 text-rose-600 px-4 py-3 rounded border border-rose-200 text-xs font-bold uppercase tracking-wider">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 text-green-700 px-4 py-3 rounded border border-green-200 text-xs font-bold uppercase tracking-wider">
          {success}
        </div>
      )}

      {showForm && (
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-4">Register New System User</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">{t.name}</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">{t.email}</label>
              <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">{t.password}</label>
              <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">Role</label>
              <select required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as 'admin' | 'manager'})} className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="col-span-1 md:col-span-2 flex justify-end gap-3 mt-4 border-t border-slate-100 pt-4">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-slate-200 rounded text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50">{t.cancel}</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded text-[10px] font-bold uppercase tracking-widest hover:bg-blue-700">{t.save}</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-5 overflow-x-auto">
        <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-4">Authorized Personnel</h3>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
              <th className="pb-2">{t.name}</th>
              <th className="pb-2">{t.email}</th>
              <th className="pb-2">Role</th>
              <th className="pb-2 text-right">Created</th>
            </tr>
          </thead>
          <tbody className="text-xs font-medium text-slate-700">
            {loading ? (
              <tr><td colSpan={4} className="py-4 text-center text-slate-400 italic">Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={4} className="py-4 text-center text-slate-400 italic">No users found.</td></tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="py-3 font-bold text-slate-900">{u.name}</td>
                  <td className="py-3 text-slate-500">{u.email}</td>
                  <td className="py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${u.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                      {u.role === 'admin' ? <ShieldAlert className="w-3 h-3" /> : <User className="w-3 h-3" />}
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 text-right text-slate-400 italic">
                    {new Date(u.createdAt).toLocaleDateString()}
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
