import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Check, ArrowRight, Shield, Activity, Globe, Compass, Star, ChevronRight, Zap } from 'lucide-react';
import api from '../services/api';

const Landing = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const res = await api.get('/plans/public');
                setPlans(res.data);
            } catch (err) {
                console.error("Error fetching public plans:", err);
                // Fallback pricing plans if API is not running or seeds haven't loaded yet
                setPlans([
                    {
                        id: 1,
                        name: 'Basic Plan',
                        price: '2999.00',
                        duration_days: 30,
                        max_students: 100,
                        features: ['Dashboard', 'Students', 'Teachers', 'Attendance', 'Homework', 'Settings']
                    },
                    {
                        id: 2,
                        name: 'Pro Plan',
                        price: '5999.00',
                        duration_days: 30,
                        max_students: 500,
                        features: ['Dashboard', 'Students', 'Teachers', 'Attendance', 'Homework', 'Settings', 'Fees', 'Timetable', 'Exams', 'Notifications', 'Reports']
                    },
                    {
                        id: 3,
                        name: 'Enterprise Plan',
                        price: '9999.00',
                        duration_days: 30,
                        max_students: null,
                        features: ['Dashboard', 'Students', 'Teachers', 'Attendance', 'Homework', 'Settings', 'Fees', 'Timetable', 'Exams', 'Notifications', 'Reports', 'Library', 'Transport', 'Chat']
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();
    }, []);

    const handleSelectPlan = (planId) => {
        navigate(`/register?plan_id=${planId}`);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden">
            {/* Header */}
            <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 transition-all">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-900/35">
                            <span className="font-black text-xl text-white">C</span>
                        </div>
                        <span className="text-xl font-black bg-gradient-to-r from-white via-slate-100 to-indigo-400 bg-clip-text text-transparent tracking-tight">CODEBYVISHU</span>
                    </div>

                    <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-400">
                        <a href="#features" className="hover:text-white transition-colors">Features</a>
                        <a href="#pricing" className="hover:text-white transition-colors">Pricing Plans</a>
                        <a href="#security" className="hover:text-white transition-colors">Enterprise Security</a>
                    </nav>

                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">
                            Admin Portal
                        </Link>
                        <Link to="/register" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-5 rounded-xl text-sm transition-all shadow-lg shadow-indigo-950/30">
                            Onboard School
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-24 pb-32 overflow-hidden">
                {/* Background Ambient Glows */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-bold text-indigo-400 mb-8 tracking-wide uppercase">
                        <Zap size={12} className="fill-indigo-400" /> Multi-Tenant School ERP
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
                        Manage Your School with <br />
                        <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
                            Absolute Control & Precision
                        </span>
                    </h1>

                    <p className="mt-8 text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        A modern, multi-tenant SaaS ERP providing academic analytics, digital fee collection, secure real-time classrooms, and comprehensive student lifecycle tools.
                    </p>

                    <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a href="#pricing" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 hover:-translate-y-0.5 transition-all text-white font-black px-8 py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-indigo-900/30">
                            Choose Your Plan <ArrowRight size={18} />
                        </a>
                        <Link to="/register" className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 transition-colors text-slate-300 font-bold px-8 py-4 rounded-2xl border border-slate-800 flex items-center justify-center">
                            Register Your School
                        </Link>
                    </div>
                </div>
            </section>

            {/* Feature Cards Grid */}
            <section id="features" className="py-24 border-t border-slate-900 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-black text-white">Full-Featured Educational Infrastructure</h2>
                        <p className="text-slate-400 mt-3 max-w-2xl mx-auto">Everything you need to automate academic planning, fee transactions, grading, and communication.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 bg-slate-900/50 border border-slate-850 rounded-[2rem] hover:border-slate-800 transition-all">
                            <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-400 mb-6 border border-indigo-500/10">
                                <Activity size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white">Academic Tracking</h3>
                            <p className="text-slate-450 mt-3 leading-relaxed">Streamlined class timetables, online examinations, dynamic homework logs, and customized progress cards.</p>
                        </div>

                        <div className="p-8 bg-slate-900/50 border border-slate-850 rounded-[2rem] hover:border-slate-800 transition-all">
                            <div className="w-12 h-12 bg-emerald-600/10 rounded-2xl flex items-center justify-center text-emerald-400 mb-6 border border-emerald-500/10">
                                <Shield size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white">Digital Fees & Finance</h3>
                            <p className="text-slate-450 mt-3 leading-relaxed">Sleek parent payment gateways, automated fee collection structure, receipt generation, and real-time ledger reporting.</p>
                        </div>

                        <div className="p-8 bg-slate-900/50 border border-slate-850 rounded-[2rem] hover:border-slate-800 transition-all">
                            <div className="w-12 h-12 bg-purple-600/10 rounded-2xl flex items-center justify-center text-purple-400 mb-6 border border-purple-500/10">
                                <Globe size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white">Isolated Tenant Domains</h3>
                            <p className="text-slate-450 mt-3 leading-relaxed">Every school enjoys a fully secure sandbox running on their own custom domain name, strictly separating database access.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-24 border-t border-slate-900 bg-slate-950 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[150px] pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-xs font-black tracking-widest text-indigo-400 uppercase">PRICING TIERS</span>
                        <h2 className="text-4xl md:text-5xl font-black text-white mt-3">Simple, Transparent Pricing</h2>
                        <p className="text-slate-450 mt-3 max-w-xl mx-auto">Choose a plan designed to fit your school's enrollment size. No hidden setup fees.</p>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-96 bg-slate-900/35 border border-slate-900 rounded-[2.5rem] animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                            {plans.map((plan, index) => {
                                const isPro = plan.name.toLowerCase().includes('pro');
                                const isEnt = plan.name.toLowerCase().includes('enterprise');

                                return (
                                    <div 
                                        key={plan.id}
                                        className={`p-8 rounded-[2.5rem] flex flex-col justify-between transition-all duration-300 relative ${
                                            isPro 
                                                ? 'bg-slate-900 border-2 border-indigo-500 shadow-2xl shadow-indigo-950/20 scale-105 z-10' 
                                                : 'bg-slate-900/40 border border-slate-850 hover:border-slate-800'
                                        }`}
                                    >
                                        {isPro && (
                                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[10px] font-black tracking-widest px-4 py-1.5 rounded-full uppercase">
                                                MOST POPULAR
                                            </div>
                                        )}

                                        <div>
                                            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{plan.name}</span>
                                            <div className="flex items-baseline gap-1 mt-4">
                                                <span className="text-4xl font-black text-white">₹{parseFloat(plan.price).toLocaleString('en-IN')}</span>
                                                <span className="text-sm text-slate-500">/ {plan.duration_days} days</span>
                                            </div>

                                            <div className="mt-4 text-xs font-semibold text-slate-400">
                                                {plan.max_students ? `Up to ${plan.max_students} students maximum` : 'Unlimited student capacity'}
                                            </div>

                                            <ul className="mt-8 space-y-4 border-t border-slate-800 pt-6">
                                                {plan.features && plan.features.map((feature, fIndex) => (
                                                    <li key={fIndex} className="flex items-start gap-3 text-sm text-slate-300 font-medium">
                                                        <Check size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                                                        <span>{feature} Module</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="mt-10">
                                            <button 
                                                onClick={() => handleSelectPlan(plan.id)}
                                                className={`w-full py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
                                                    isPro 
                                                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-950/45 hover:-translate-y-0.5' 
                                                        : 'bg-slate-800 hover:bg-slate-750 text-slate-200'
                                                }`}
                                            >
                                                Subscribe Now <ChevronRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-900 bg-slate-950 py-12 text-slate-500 text-sm">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <p>© 2026 <a href="https://codebyvishu.in" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 underline font-semibold">CodeByVishu</a> Multi-Tenant SaaS Platform. All Rights Reserved.</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <Link to="/login" className="hover:text-white transition-colors">Admin Login</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
