import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, logout } from '../../redux/slices/authSlice';
import { ShieldAlert, IndianRupee, Clock, ArrowRight, Upload, AlertCircle, CheckCircle2, ChevronRight, LogOut, Loader2, CreditCard } from 'lucide-react';
import api from '../../services/api';

const RenewSubscription = () => {
    const { user } = useSelector((state) => state.auth);
    const [statusData, setStatusData] = useState(null);
    const [plans, setPlans] = useState([]);
    const [gateways, setGateways] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [selectedGateway, setSelectedGateway] = useState(null);
    
    // Form data for checkout
    const [reference, setReference] = useState('');
    const [proofFile, setProofFile] = useState(null);
    
    // Card inputs (simulated)
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvv, setCardCvv] = useState('');
    
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // 1. Fetch Subscription Status
            const statusRes = await api.get('/subscription/status');
            setStatusData(statusRes.data);
            
            // 2. Fetch Active Plans
            const plansRes = await api.get('/plans/public');
            setPlans(plansRes.data);
            
            // Pre-select plan if school previously had one
            const currentPlan = plansRes.data.find(p => p.name === statusRes.data.plan_name);
            if (currentPlan) {
                setSelectedPlan(currentPlan);
            } else if (plansRes.data.length > 0) {
                setSelectedPlan(plansRes.data[0]);
            }

            // 3. Fetch Platform SaaS Payment Gateways
            const gatewaysRes = await api.get('/subscription/payment-gateways');
            setGateways(gatewaysRes.data);
            if (gatewaysRes.data.length > 0) {
                setSelectedGateway(gatewaysRes.data[0]);
            }

        } catch (err) {
            console.error("Error loading subscription billing data:", err);
            setError("Could not retrieve billing details. Please check your network connection.");
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setProofFile(e.target.files[0]);
        }
    };

    const handleLogout = async () => {
        try {
            await api.post('/logout');
        } catch (e) {
            // Ignore logout fail
        }
        dispatch(logout());
        navigate('/login');
    };

    const handleCheckout = async (e) => {
        e.preventDefault();
        if (!selectedPlan || !selectedGateway) {
            setError("Please select both a pricing tier and a payment option.");
            return;
        }

        setError(null);
        setMessage(null);
        setSubmitting(true);

        const formData = new FormData();
        formData.append('plan_id', selectedPlan.id);
        formData.append('payment_gateway_id', selectedGateway.id);

        if (selectedGateway.slug !== 'card') {
            if (!reference) {
                setError("Transaction Reference Number is required for manual bank/UPI transfers.");
                setSubmitting(false);
                return;
            }
            formData.append('transaction_reference', reference);
            if (proofFile) {
                formData.append('proof_image', proofFile);
            }
        }

        try {
            const response = await api.post('/subscription/checkout', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.status === 'completed') {
                setMessage("Payment approved instantly! Redirecting you to the School ERP Dashboard...");
                
                // Fetch updated user profile with fresh school subscription expiry info
                const meRes = await api.get('/me');
                dispatch(loginSuccess({
                    user: meRes.data,
                    access_token: localStorage.getItem('token')
                }));

                setTimeout(() => {
                    navigate('/admin/dashboard');
                }, 2000);
            } else {
                setMessage("Receipt submitted successfully! Redirecting status update...");
                setReference('');
                setProofFile(null);
                setTimeout(() => {
                    fetchInitialData();
                }, 2000);
            }

        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.message || "Checkout failed. Please review payment inputs.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                <p className="mt-4 text-sm font-semibold text-slate-400">Syncing subscription settings...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
            {/* Header */}
            <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md px-8 py-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="font-black text-lg text-white">S</span>
                    </div>
                    <span className="text-lg font-black text-white tracking-tight">SCHOOLITES BILLING</span>
                </div>
                <button 
                    onClick={handleLogout} 
                    className="flex items-center gap-2 text-sm font-bold text-red-400 hover:text-red-300 transition-colors bg-red-950/20 py-2 px-4 rounded-xl border border-red-900/30"
                >
                    <LogOut size={16} /> Sign Out
                </button>
            </header>

            {/* Viewport */}
            <main className="flex-1 max-w-7xl w-full mx-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* Left/Middle Panels: Details & Checkout Form */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Expiry Warning Panel */}
                    <div className="p-6 bg-red-950/25 border-l-4 border-red-500 rounded-r-[2rem] flex items-start gap-4">
                        <div className="bg-red-500/10 p-3 rounded-2xl text-red-400 shrink-0">
                            <ShieldAlert size={28} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">ERP Environment Suspended</h2>
                            <p className="text-sm text-red-400 mt-2 leading-relaxed">
                                Access to **{statusData?.school_name}** has expired or is currently inactive. To resume operations, grade assessments, take attendance, or view fee ledgers, please select a plan and renew your subscription.
                            </p>
                        </div>
                    </div>

                    {/* Pending Verification Notice */}
                    {statusData?.pending_verification && (
                        <div className="p-6 bg-indigo-950/30 border border-indigo-500/20 rounded-[2rem] flex items-start gap-4">
                            <Clock size={28} className="text-indigo-400 shrink-0 mt-1 animate-pulse" />
                            <div>
                                <h3 className="text-lg font-black text-indigo-400">Payment Under Verification</h3>
                                <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                                    Our billing team is verifying your manual deposit of **₹{parseFloat(statusData.pending_verification.amount).toLocaleString('en-IN')}** (Reference: {statusData.pending_verification.reference}).
                                </p>
                                <div className="mt-3 flex items-center gap-4 text-xs font-semibold text-slate-500">
                                    <span>Submitted: {new Date(statusData.pending_verification.created_at).toLocaleDateString()}</span>
                                    <span>•</span>
                                    <span className="text-amber-500 uppercase tracking-widest font-black">Status: Awaiting Super Admin</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Form Layout */}
                    <form onSubmit={handleCheckout} className="space-y-8">
                        
                        {/* Step 1: Choose Pricing Tier */}
                        <div className="p-8 bg-slate-900/40 border border-slate-900 rounded-[2.5rem] space-y-6">
                            <div>
                                <span className="text-xs font-black text-indigo-500 tracking-wider uppercase">STEP 01</span>
                                <h3 className="text-2xl font-black text-white mt-1">Select SaaS Plan</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {plans.map((plan) => (
                                    <div 
                                        key={plan.id}
                                        onClick={() => setSelectedPlan(plan)}
                                        className={`p-6 rounded-[2rem] border transition-all cursor-pointer relative flex flex-col justify-between ${
                                            selectedPlan?.id === plan.id 
                                                ? 'bg-slate-900 border-indigo-500 shadow-lg shadow-indigo-950/20' 
                                                : 'bg-slate-950/40 border-slate-850 hover:border-slate-800'
                                        }`}
                                    >
                                        <div>
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">{plan.name}</span>
                                            <div className="flex items-baseline gap-0.5 mt-3">
                                                <span className="text-2xl font-black text-white">₹{parseFloat(plan.price).toLocaleString('en-IN')}</span>
                                                <span className="text-[10px] text-slate-500">/{plan.duration_days} days</span>
                                            </div>
                                        </div>
                                        <div className="mt-4 text-[10px] text-slate-500 font-medium">
                                            {plan.max_students ? `Up to ${plan.max_students} Students` : 'Unlimited Students'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Step 2: Choose Gateway */}
                        <div className="p-8 bg-slate-900/40 border border-slate-900 rounded-[2.5rem] space-y-6">
                            <div>
                                <span className="text-xs font-black text-indigo-500 tracking-wider uppercase">STEP 02</span>
                                <h3 className="text-2xl font-black text-white mt-1">Payment Method</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {gateways.map((gw) => (
                                    <div 
                                        key={gw.id}
                                        onClick={() => {
                                            setSelectedGateway(gw);
                                            setError(null);
                                        }}
                                        className={`p-6 rounded-[2rem] border transition-all cursor-pointer flex flex-col items-center justify-center gap-3 text-center ${
                                            selectedGateway?.id === gw.id 
                                                ? 'bg-slate-900 border-indigo-500 shadow-lg' 
                                                : 'bg-slate-950/40 border-slate-850 hover:border-slate-800'
                                        }`}
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-350">
                                            {gw.slug === 'card' ? <CreditCard size={20} /> : <IndianRupee size={20} />}
                                        </div>
                                        <span className="text-sm font-bold text-white leading-tight">{gw.name}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Gateway Instructions Display */}
                            {selectedGateway && (
                                <div className="p-5 bg-slate-950/80 border border-slate-850 rounded-2xl space-y-4">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Instructions</span>
                                    <p className="text-sm text-slate-350 leading-relaxed font-medium">{selectedGateway.instructions}</p>
                                    
                                    {/* Additional fields for Manual Payments */}
                                    {selectedGateway.slug !== 'card' ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-850">
                                            <div>
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Transaction ID / UTR Code</label>
                                                <input 
                                                    type="text"
                                                    required
                                                    value={reference}
                                                    onChange={e => setReference(e.target.value)}
                                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 text-white font-medium text-sm" 
                                                    placeholder="e.g. UTR120938475" 
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Upload Transfer Screenshot</label>
                                                <div className="relative">
                                                    <input 
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleFileChange}
                                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" 
                                                    />
                                                    <div className="w-full bg-slate-900 border border-slate-850 rounded-xl px-4 py-3 flex items-center justify-between text-slate-450 hover:bg-slate-850 transition-colors">
                                                        <span className="text-sm truncate pr-2 font-medium">{proofFile ? proofFile.name : 'Choose receipt image'}</span>
                                                        <Upload size={16} className="text-indigo-400 shrink-0" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        /* Card payment fields */
                                        <div className="space-y-4 pt-4 border-t border-slate-850">
                                            <div>
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Cardholder Name</label>
                                                <input 
                                                    type="text" 
                                                    required
                                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 text-white font-medium text-sm"
                                                    placeholder="Principal John Doe" 
                                                />
                                            </div>
                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="col-span-2">
                                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Credit Card Number</label>
                                                    <input 
                                                        type="text"
                                                        required
                                                        maxLength="19"
                                                        value={cardNumber}
                                                        onChange={e => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                                                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 text-white font-medium text-sm"
                                                        placeholder="4111 2222 3333 4444" 
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Exp / CVV</label>
                                                    <div className="flex gap-2">
                                                        <input 
                                                            type="text"
                                                            required
                                                            maxLength="5"
                                                            value={cardExpiry}
                                                            onChange={e => setCardExpiry(e.target.value)}
                                                            className="w-1/2 bg-slate-900 border border-slate-800 rounded-xl px-2 py-3 outline-none text-center focus:border-indigo-500 text-white font-medium text-sm"
                                                            placeholder="MM/YY" 
                                                        />
                                                        <input 
                                                            type="password"
                                                            required
                                                            maxLength="3"
                                                            value={cardCvv}
                                                            onChange={e => setCardCvv(e.target.value)}
                                                            className="w-1/2 bg-slate-900 border border-slate-800 rounded-xl px-2 py-3 outline-none text-center focus:border-indigo-500 text-white font-medium text-sm"
                                                            placeholder="CVV" 
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Error and Info Notices */}
                        {error && (
                            <div className="p-4 bg-red-950/30 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400">
                                <AlertCircle size={20} className="shrink-0" />
                                <span className="text-sm font-semibold">{error}</span>
                            </div>
                        )}

                        {message && (
                            <div className="p-4 bg-emerald-950/30 border border-emerald-500/20 rounded-2xl flex items-center gap-3 text-emerald-400">
                                <CheckCircle2 size={20} className="shrink-0" />
                                <span className="text-sm font-semibold">{message}</span>
                            </div>
                        )}

                        {/* Action buttons */}
                        <div className="flex items-center justify-end gap-4">
                            <button 
                                type="submit"
                                disabled={submitting || !selectedPlan || !selectedGateway}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 px-8 rounded-2xl flex items-center gap-2 shadow-lg shadow-indigo-950/45 disabled:opacity-50 transition-all cursor-pointer"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Processing Order...
                                    </>
                                ) : (
                                    <>
                                        Authorize Subscription <ChevronRight size={18} />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right Panel: Invoice Summary */}
                <div className="p-8 bg-slate-900/40 border border-slate-900 rounded-[2.5rem] space-y-6 lg:col-span-1">
                    <h3 className="text-xl font-black text-white">Order Summary</h3>
                    
                    <div className="border-b border-slate-850 pb-5 space-y-4">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-450 font-medium">Institution</span>
                            <span className="font-bold text-white">{statusData?.school_name}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-450 font-medium">Active Package</span>
                            <span className="font-bold text-indigo-400">{statusData?.plan_name}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-450 font-medium">Status</span>
                            <span className={`font-bold uppercase tracking-widest text-[10px] ${statusData?.is_expired ? 'text-red-400' : 'text-emerald-400'}`}>
                                {statusData?.is_expired ? 'Expired' : 'Active'}
                            </span>
                        </div>
                    </div>

                    <div className="border-b border-slate-850 pb-5 space-y-4">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-450 font-medium">New Plan</span>
                            <span className="font-bold text-white">{selectedPlan?.name || 'Not selected'}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-450 font-medium">Duration</span>
                            <span className="font-bold text-white">{selectedPlan?.duration_days ? `${selectedPlan.duration_days} days` : '—'}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-450 font-medium">Payment Option</span>
                            <span className="font-bold text-indigo-400">{selectedGateway?.name || 'Not selected'}</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                        <span className="text-base font-bold text-white">Total Amount</span>
                        <span className="text-2xl font-black text-emerald-400">
                            ₹{selectedPlan ? parseFloat(selectedPlan.price).toLocaleString('en-IN') : '0.00'}
                        </span>
                    </div>

                    <div className="pt-4 border-t border-slate-850 text-xs text-slate-550 leading-relaxed font-medium">
                        Subscriptions will be registered directly onto the Schoolites multi-tenant ledger. All fees collected follow secure compliance and isolated accounting.
                    </div>
                </div>
            </main>
        </div>
    );
};

export default RenewSubscription;
