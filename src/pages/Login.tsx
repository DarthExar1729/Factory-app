import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useTranslation } from '../lib/i18n';
import { Factory } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [role, setRole] = useState('manager');
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegistering) {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', userCred.user.uid), {
          email: userCred.user.email,
          role: role,
          name: email.split('@')[0],
          createdAt: new Date().toISOString()
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-blue-600 rounded-sm flex items-center justify-center font-bold text-3xl italic text-white shadow-lg">
            F
          </div>
        </div>
        <h2 className="mt-6 text-center text-2xl font-bold text-slate-900 tracking-tight">
          FactorySync
        </h2>
        <p className="text-center text-xs text-slate-500 uppercase tracking-widest mt-2 font-bold">
          System Authentication
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-xl sm:px-10 border border-slate-200">
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded text-xs font-bold uppercase tracking-wider">
                {error}
              </div>
            )}
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">
                {t.email}
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-200 rounded text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">
                {t.password}
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-200 rounded text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {isRegistering && (
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">
                  Role
                </label>
                <div className="mt-1">
                  <select 
                    value={role} 
                    onChange={(e) => setRole(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-slate-200 rounded text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded text-[10px] font-bold uppercase tracking-widest text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                {isRegistering ? 'Register' : t.signIn}
              </button>
            </div>
            
            <div className="text-center mt-4">
              <button 
                type="button" 
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-700"
              >
                {isRegistering ? 'Already have an account? Sign in' : 'Need an account? Register demo user'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
