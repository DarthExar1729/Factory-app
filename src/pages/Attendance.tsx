import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../lib/auth';
import { useTranslation } from '../lib/i18n';

export default function Attendance() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [employees, setEmployees] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<Record<string, any>>({});
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const fetchData = async () => {
    setLoading(true);
    // Fetch all employees
    const empSnapshot = await getDocs(collection(db, "employees"));
    const emps = empSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setEmployees(emps);

    // Fetch attendance for selected date
    const attQuery = query(collection(db, "attendance"), where("date", "==", date));
    const attSnapshot = await getDocs(attQuery);
    const attMap: Record<string, any> = {};
    attSnapshot.forEach(doc => {
      const data = doc.data();
      attMap[data.employeeId] = data;
    });
    setAttendance(attMap);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [date]);

  const markAttendance = async (employeeId: string, status: string, note: string = '') => {
    await addDoc(collection(db, "attendance"), {
      employeeId,
      date,
      status,
      note,
      recordedBy: user?.uid
    });
    fetchData(); // re-fetch to update state
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">{t.attendance}</h1>
        <div className="flex items-center gap-2">
          <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{t.date}:</label>
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            className="border border-slate-200 rounded px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 overflow-x-auto">
        <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-4">Daily Register</h3>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
              <th className="pb-2">{t.name}</th>
              <th className="pb-2">{t.department}</th>
              <th className="pb-2">{t.status}</th>
              <th className="pb-2 text-right">{t.actions}</th>
            </tr>
          </thead>
          <tbody className="text-xs font-medium text-slate-700">
            {loading ? (
              <tr><td colSpan={4} className="py-4 text-center text-slate-400 italic">Loading...</td></tr>
            ) : employees.length === 0 ? (
              <tr><td colSpan={4} className="py-4 text-center text-slate-400 italic">No employees found.</td></tr>
            ) : (
              employees.map((emp) => {
                const record = attendance[emp.id];
                return (
                  <tr key={emp.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="py-3 text-blue-600 font-bold">{emp.name}</td>
                    <td className="py-3">{emp.department}</td>
                    <td className="py-3">
                      {record ? (
                        <div className="flex flex-col gap-1">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] w-max font-black uppercase tracking-wider ${
                            record.status === 'Present' ? 'bg-green-100 text-green-700' : 
                            record.status === 'Absent' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {record.status === 'Present' ? t.present : record.status === 'Absent' ? t.absent : t.leave}
                          </span>
                          {record.note && <span className="text-[10px] text-slate-500 italic">"{record.note}"</span>}
                        </div>
                      ) : (
                        <span className="text-[10px] uppercase font-bold text-slate-400 italic">Not marked</span>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      {!record && (
                        <div className="flex items-center justify-end gap-2">
                          <input 
                            type="text" 
                            placeholder={t.notes || "Note (optional)"}
                            value={notes[emp.id] || ''}
                            onChange={(e) => setNotes({ ...notes, [emp.id]: e.target.value })}
                            className="border border-slate-200 rounded px-2 py-1 text-xs focus:border-blue-500 focus:outline-none w-32"
                          />
                          <button onClick={() => markAttendance(emp.id, 'Present', notes[emp.id])} className="text-green-700 hover:text-green-800 bg-green-50 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">{t.present}</button>
                          <button onClick={() => markAttendance(emp.id, 'Absent', notes[emp.id])} className="text-rose-700 hover:text-rose-800 bg-rose-50 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">{t.absent}</button>
                          <button onClick={() => markAttendance(emp.id, 'Leave', notes[emp.id])} className="text-amber-700 hover:text-amber-800 bg-amber-50 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">{t.leave}</button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
