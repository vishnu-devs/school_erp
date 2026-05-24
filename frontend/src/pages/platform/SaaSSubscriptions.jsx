import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Plus, CheckCircle2, IndianRupee, Users, Clock, ToggleRight, ToggleLeft } from 'lucide-react';
import api from '../../services/api';

const SaaSSubscriptions = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    duration_days: 30,
    max_students: ''
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await api.get('/plans');
      setPlans(res.data || []);
    } catch (error) {
      console.error('Error fetching plans');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        name: formData.name,
        price: parseFloat(formData.price),
        duration_days: parseInt(formData.duration_days),
        max_students: formData.max_students ? parseInt(formData.max_students) : null,
        is_active: true
      };
      
      const res = await api.post('/plans', payload);
      setPlans([...plans, res.data.plan]);
      setIsModalOpen(false);
      setFormData({ name: '', price: '', duration_days: 30, max_students: '' });
    } catch (error) {
      alert('Error creating plan. Please check inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStatus = async (planId, currentStatus) => {
    try {
      await api.put(`/plans/${planId}`, { is_active: !currentStatus });
      setPlans(plans.map(p => p.id === planId ? { ...p, is_active: !currentStatus } : p));
    } catch (error) {
      alert('Error updating status');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-100 tracking-tight">SaaS Subscription Plans</h2>
          <p className="text-slate-400 mt-1">Create and manage pricing tiers for tenant schools.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-900/20 transition-all"
        >
          <Plus size={20} />
          Create New Plan
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-72 bg-slate-800/50 rounded-3xl animate-pulse"></div>)}
        </div>
      ) : plans.length === 0 ? (
        <Card className="bg-slate-900 border-slate-800 rounded-3xl shadow-xl">
          <CardContent>
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6">
                <IndianRupee size={32} className="text-slate-500" />
              </div>
              <p className="text-xl font-bold text-slate-300">No Pricing Plans Yet</p>
              <p className="text-sm mt-2 max-w-md text-center">Create your first SaaS package to start onboarding schools and generating revenue.</p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="mt-8 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-8 rounded-xl transition-all border border-slate-700"
              >
                Create First Plan
              </button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan.id} className={`bg-slate-900 border-slate-800 rounded-[2rem] overflow-hidden relative ${!plan.is_active && 'opacity-70'}`}>
              {!plan.is_active && (
                <div className="absolute top-0 right-0 bg-red-500/10 text-red-400 text-xs font-bold px-3 py-1 rounded-bl-xl border-l border-b border-red-500/20">
                  INACTIVE
                </div>
              )}
              <CardHeader className="border-b border-slate-800/50 pb-6 pt-8">
                <CardTitle className="text-2xl font-black text-white">{plan.name}</CardTitle>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-black text-emerald-400 flex items-center"><IndianRupee size={28} className="mr-1"/> {plan.price}</span>
                  <span className="text-slate-500 font-medium">/ {plan.duration_days} days</span>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-slate-300 font-medium">
                    <div className="bg-indigo-500/20 p-2 rounded-lg text-indigo-400"><Users size={16} /></div>
                    {plan.max_students ? `Up to ${plan.max_students} Students` : 'Unlimited Students'}
                  </li>
                  <li className="flex items-center gap-3 text-slate-300 font-medium">
                    <div className="bg-purple-500/20 p-2 rounded-lg text-purple-400"><Clock size={16} /></div>
                    {plan.duration_days} Days Billing Cycle
                  </li>
                  <li className="flex items-center gap-3 text-slate-300 font-medium">
                    <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-400"><CheckCircle2 size={16} /></div>
                    Full Platform Access
                  </li>
                </ul>

                <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                   <span className="text-sm font-bold text-slate-500">Status</span>
                   <button 
                     onClick={() => toggleStatus(plan.id, plan.is_active)}
                     className={`flex items-center gap-2 text-sm font-bold ${plan.is_active ? 'text-emerald-500 hover:text-emerald-400' : 'text-slate-500 hover:text-slate-400'}`}
                   >
                     {plan.is_active ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                     {plan.is_active ? 'Active' : 'Disabled'}
                   </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* CREATE PLAN MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Create SaaS Plan</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreatePlan} className="p-6 space-y-5">
              
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Plan Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 text-white font-medium" 
                  placeholder="e.g. Basic, Pro, Enterprise" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Price (₹)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 text-white font-medium" 
                    placeholder="2999" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Duration (Days)</label>
                  <select 
                    value={formData.duration_days}
                    onChange={e => setFormData({...formData, duration_days: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 text-white font-medium appearance-none" 
                  >
                    <option value="30">Monthly (30 Days)</option>
                    <option value="90">Quarterly (90 Days)</option>
                    <option value="365">Yearly (365 Days)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Max Students Limit</label>
                <input 
                  type="number" 
                  value={formData.max_students}
                  onChange={e => setFormData({...formData, max_students: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 text-white font-medium" 
                  placeholder="Leave blank for Unlimited" 
                />
                <p className="text-xs text-slate-500 mt-2">Schools exceeding this limit will need to upgrade to a higher plan.</p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-slate-300 hover:bg-slate-800 transition-colors">Cancel</button>
                <button type="submit" disabled={submitting} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-colors disabled:opacity-50">
                  {submitting ? 'Creating...' : 'Launch Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SaaSSubscriptions;
