import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/slices/authSlice';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Building2, User, Mail, Lock, Globe, ArrowRight } from 'lucide-react';
import api from '../services/api';

const Register = () => {
    const [formData, setFormData] = useState({
        school_name: '',
        domain: '',
        admin_name: '',
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();
    const planId = searchParams.get('plan_id');
    const [selectedPlan, setSelectedPlan] = useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (planId) {
            api.get('/plans/public').then(res => {
                const plan = res.data.find(p => p.id === parseInt(planId));
                if (plan) setSelectedPlan(plan);
            }).catch(() => {
                const fallbackPlans = [
                    { id: 1, name: 'Basic Plan', price: 2999 },
                    { id: 2, name: 'Pro Plan', price: 5999 },
                    { id: 3, name: 'Enterprise Plan', price: 9999 }
                ];
                const plan = fallbackPlans.find(p => p.id === parseInt(planId));
                if (plan) setSelectedPlan(plan);
            });
        }
    }, [planId]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleDomainChange = (e) => {
        // Auto-format domain: lowercase, remove spaces
        const val = e.target.value.toLowerCase().replace(/\s+/g, '');
        setFormData({
            ...formData,
            domain: val
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await api.post('/register', formData);
            
            // Auto-login the new tenant admin
            localStorage.setItem('token', response.data.access_token);
            dispatch(loginSuccess({
                user: response.data.user,
                token: response.data.access_token
            }));
            
            // Redirect to school admin dashboard
            navigate('/admin/dashboard');

        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please check your inputs.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                        <Building2 className="text-white w-8 h-8" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-black tracking-tight text-slate-900">
                    Onboard Your School
                </h2>
                <p className="mt-2 text-center text-sm text-slate-600">
                    Join the premier Multi-Tenant SaaS platform.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
                <div className="bg-white py-8 px-4 shadow-xl sm:rounded-3xl sm:px-10 border border-slate-100">
                    
                    {selectedPlan && (
                        <div className="bg-indigo-50 border border-indigo-100/50 p-4 mb-6 rounded-2xl flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Subscription Tier</p>
                                <p className="text-base font-black text-slate-800 mt-0.5">{selectedPlan.name}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Plan Cost</p>
                                <p className="text-base font-black text-emerald-600 mt-0.5">₹{parseFloat(selectedPlan.price).toLocaleString('en-IN')}</p>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
                            <p className="text-sm text-red-700 font-medium">{error}</p>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        
                        <div className="border-b border-slate-100 pb-4 mb-4">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">1. School Information</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">School Name</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Building2 className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <input name="school_name" type="text" required value={formData.school_name} onChange={handleChange} className="pl-10 block w-full rounded-xl border-slate-300 bg-slate-50 border py-3 text-slate-900 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors" placeholder="e.g. CodeByVishu School" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Custom Domain</label>
                                    <div className="relative flex rounded-xl shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                            <Globe className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <input name="domain" type="text" required value={formData.domain} onChange={handleDomainChange} className="pl-10 block w-full rounded-xl border-slate-300 bg-slate-50 border py-3 text-slate-900 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors" placeholder="schoolerp.com" />
                                    </div>
                                    <p className="mt-1 text-xs text-slate-500">Enter the fully qualified domain for your tenant instance.</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-slate-800 mb-4">2. Administrator Account</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Admin Full Name</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <input name="admin_name" type="text" required value={formData.admin_name} onChange={handleChange} className="pl-10 block w-full rounded-xl border-slate-300 bg-slate-50 border py-3 text-slate-900 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors" placeholder="John Doe" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Admin Email</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <input name="email" type="email" required value={formData.email} onChange={handleChange} className="pl-10 block w-full rounded-xl border-slate-300 bg-slate-50 border py-3 text-slate-900 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors" placeholder="admin@codebyvishu.in" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <input name="password" type="password" required minLength="8" value={formData.password} onChange={handleChange} className="pl-10 block w-full rounded-xl border-slate-300 bg-slate-50 border py-3 text-slate-900 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors" placeholder="••••••••" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <button type="submit" disabled={loading} className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-50">
                                {loading ? 'Provisioning Tenant...' : 'Create School Account'}
                                {!loading && <ArrowRight className="w-4 h-4" />}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                        <p className="text-sm text-slate-600">
                            Already have a school account?{' '}
                            <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
