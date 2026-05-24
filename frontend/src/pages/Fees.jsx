import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Fees = () => {
    const [payments, setPayments] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    async function fetchFeesData() {
        setLoading(true);
        try {
            const [paymentsRes, categoriesRes] = await Promise.all([
                api.get('/fees/payments'),
                api.get('/fees/categories')
            ]);
            setPayments((paymentsRes.data.data || paymentsRes.data || []));
            setCategories(categoriesRes.data);
        } catch (error) {
            console.error('Error fetching fees data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeesData();
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">Fees Management</h1>
                    <p className="text-sm text-slate-500 font-medium">Track and manage student financial records.</p>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className="bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all font-bold flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Collect Fees
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                    <h4 className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">Total Collected</h4>
                    <p className="text-2xl font-black text-emerald-600">$0.00</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                    <h4 className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">Pending Invoices</h4>
                    <p className="text-2xl font-black text-amber-500">0</p>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-50">
                    <h3 className="text-lg font-bold text-slate-800">Recent Transactions</h3>
                </div>
                {loading ? (
                    <div className="p-20 flex justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div></div>
                ) : payments.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Student</th>
                                    <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Category</th>
                                    <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Amount</th>
                                    <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Date</th>
                                    <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {payments.map(p => (
                                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-4 font-bold text-slate-800">{p.student?.user?.name}</td>
                                        <td className="px-8 py-4 text-sm text-slate-600">{p.fee_category?.category_name}</td>
                                        <td className="px-8 py-4 font-black text-slate-900">${p.amount}</td>
                                        <td className="px-8 py-4 text-sm text-slate-500">{new Date(p.payment_date).toLocaleDateString()}</td>
                                        <td className="px-8 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${p.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                                {p.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-20 text-center">
                        <p className="text-slate-400 font-medium italic">No transactions recorded yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Fees;
