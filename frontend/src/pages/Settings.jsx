import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useSelector } from 'react-redux';

const Settings = () => {
    const { user } = useSelector((state) => state.auth);
    const [settings, setSettings] = useState({ school_name: '', email: '' });
    const [twoFactor, setTwoFactor] = useState(false);
    const [saving, setSaving] = useState(false);
    
    // 2FA Modal State
    const [show2FAModal, setShow2FAModal] = useState(false);
    const [qrCodeSvg, setQrCodeSvg] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [verifying, setVerifying] = useState(false);

    // Payment Gateway Modal State
    const [paymentModal, setPaymentModal] = useState(null); // 'razorpay', 'upi', 'bank'
    const [paymentData, setPaymentData] = useState({
        razorpay_key: '', razorpay_secret: '',
        upi_id: '',
        bank_name: '', account_name: '', account_number: '', ifsc_code: ''
    });

    useEffect(() => {
        async function fetchInitialData() {
            try {
                if (user?.school_id !== null) {
                    const res = await api.get('/settings/school').catch(() => null);
                    if (res && res.data) {
                        setSettings({ school_name: res.data.school_name || '', email: res.data.email || '' });
                    }
                }
                
                // Fetch configured gateways
                const gatewayRes = await api.get('/settings/gateways').catch(() => ({ data: [] }));
                const gateways = gatewayRes.data || [];
                
                let loadedData = { ...paymentData };
                gateways.forEach(g => {
                    const creds = g.credentials;
                    const slug = g.slug;

                    if (creds) {
                        if (slug === 'razorpay') {
                            loadedData.razorpay_key = creds.razorpay_key || '';
                            loadedData.razorpay_secret = creds.razorpay_secret || '';
                        }
                        if (slug === 'upi') {
                            loadedData.upi_id = creds.upi_id || '';
                        }
                        if (slug === 'bank') {
                            loadedData.bank_name = creds.bank_name || '';
                            loadedData.ifsc_code = creds.ifsc_code || '';
                            loadedData.account_name = creds.account_name || '';
                            loadedData.account_number = creds.account_number || '';
                        }
                    }
                });
                setPaymentData(loadedData);

                const meRes = await api.get('/me');
                if (meRes.data) {
                    setTwoFactor(meRes.data.two_factor_enabled || false);
                }
            } catch (error) {
                console.error("Error fetching settings");
            }
        };
        fetchInitialData();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.post('/settings/school', settings);
            alert('Settings saved successfully!');
        } catch (error) {
            alert('Error saving settings');
        } finally {
            setSaving(false);
        }
    };

    const handleToggle2FA = async () => {
        if (twoFactor) {
            // Disable it
            try {
                await api.post('/2fa/disable');
                setTwoFactor(false);
                alert('Two-Factor Authentication disabled.');
            } catch(e) {
                alert('Error disabling 2FA');
            }
        } else {
            // Show setup modal
            try {
                const res = await api.get('/2fa/setup');
                setQrCodeSvg(res.data.qr_code_svg);
                setShow2FAModal(true);
                setOtpCode('');
            } catch(e) {
                alert('Error generating 2FA setup');
            }
        }
    };

    const handleVerify2FA = async () => {
        if (!otpCode) return;
        setVerifying(true);
        try {
            await api.post('/2fa/enable', { otp: otpCode });
            setTwoFactor(true);
            setShow2FAModal(false);
            alert('Two-Factor Authentication enabled successfully!');
        } catch (error) {
            alert(error.response?.data?.message || 'Invalid OTP Code');
        } finally {
            setVerifying(false);
        }
    };

    const handleSavePaymentConfig = async (type) => {
        setSaving(true);
        try {
            // Determine credentials mapping based on type
            let creds = {};
            if (type === 'razorpay') {
                creds = { razorpay_key: paymentData.razorpay_key, razorpay_secret: paymentData.razorpay_secret };
            } else if (type === 'upi') {
                creds = { upi_id: paymentData.upi_id };
            } else if (type === 'bank') {
                creds = { 
                    bank_name: paymentData.bank_name, 
                    ifsc_code: paymentData.ifsc_code, 
                    account_name: paymentData.account_name, 
                    account_number: paymentData.account_number 
                };
            }

            await api.post('/settings/gateways', { slug: type, credentials: creds });
            alert(`${type.toUpperCase()} configuration saved successfully!`);
            setPaymentModal(null);
        } catch (error) {
            alert('Error saving payment configuration');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-3xl font-black text-slate-900">System Settings</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                            School Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">School Name</label>
                                <input 
                                    type="text" 
                                    value={settings.school_name}
                                    onChange={(e) => setSettings({...settings, school_name: e.target.value})}
                                    className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-indigo-100 transition-all font-medium text-slate-700" 
                                    placeholder="Greenwood High" 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                                <input 
                                    type="email" 
                                    value={settings.email}
                                    onChange={(e) => setSettings({...settings, email: e.target.value})}
                                    className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-indigo-100 transition-all font-medium text-slate-700" 
                                    placeholder="admin@greenwood.com" 
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button onClick={handleSave} disabled={saving} className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
                                {saving ? 'Saving...' : 'Save Settings'}
                            </button>
                        </div>
                    </section>

                    <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                            Security & Permissions
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                <div>
                                    <p className="text-sm font-bold text-slate-700">Two-Factor Authentication</p>
                                    <p className="text-xs text-slate-500">Add an extra layer of security to your account.</p>
                                </div>
                                <div onClick={handleToggle2FA} className={`w-12 h-6 ${twoFactor ? 'bg-emerald-500' : 'bg-slate-300'} rounded-full relative cursor-pointer transition-colors duration-300`}>
                                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-300 ${twoFactor ? 'translate-x-7' : 'translate-x-1'}`}></div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="space-y-8">
                    {user?.school_id !== null && (
                        <section className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-[2.5rem] shadow-xl shadow-indigo-200 text-white">
                            <h3 className="text-lg font-bold mb-4">Current Plan</h3>
                            <div className="mb-6">
                                <p className="text-4xl font-black">Pro</p>
                                <p className="text-sm opacity-80 mt-1">SaaS Multi-School License</p>
                            </div>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-2 text-sm"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg> Unlimited Students</li>
                                <li className="flex items-center gap-2 text-sm"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg> AI Automation Enabled</li>
                            </ul>
                            <button onClick={() => alert('Redirecting to Razorpay checkout portal...')} className="w-full bg-white text-indigo-600 font-bold py-3 rounded-2xl hover:bg-slate-50 transition-colors shadow-lg">Manage Subscription</button>
                        </section>
                    )}

                    <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                            {user?.school_id === null ? "SaaS Payment Gateways" : "School Fee Gateways"}
                        </h3>
                        <p className="text-xs text-slate-500 mb-6 font-medium">
                            {user?.school_id === null 
                                ? "Configure how tenant schools pay for SaaS subscriptions (Razorpay, Global UPI, Bank Details)."
                                : "Configure how parents pay student fees (Razorpay, School UPI, School Bank Details)."
                            }
                        </p>
                        
                        <div className="space-y-4">
                            <button onClick={() => setPaymentModal('razorpay')} className="w-full bg-slate-50 border border-slate-100 text-slate-700 font-bold py-3 px-4 rounded-xl hover:bg-slate-100 transition-colors flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-100 text-blue-600 p-2 rounded-lg"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg></div>
                                    <span className="text-sm">Razorpay Integration</span>
                                </div>
                                <span className="text-xs font-bold text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-200">Configure</span>
                            </button>

                            <button onClick={() => setPaymentModal('upi')} className="w-full bg-slate-50 border border-slate-100 text-slate-700 font-bold py-3 px-4 rounded-xl hover:bg-slate-100 transition-colors flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="bg-emerald-100 text-emerald-600 p-2 rounded-lg"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg></div>
                                    <span className="text-sm">UPI ID & QR Code</span>
                                </div>
                                <span className="text-xs font-bold text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-200">Configure</span>
                            </button>

                            <button onClick={() => setPaymentModal('bank')} className="w-full bg-slate-50 border border-slate-100 text-slate-700 font-bold py-3 px-4 rounded-xl hover:bg-slate-100 transition-colors flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="bg-indigo-100 text-indigo-600 p-2 rounded-lg"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path></svg></div>
                                    <span className="text-sm">Bank Transfer Details</span>
                                </div>
                                <span className="text-xs font-bold text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-200">Configure</span>
                            </button>
                        </div>
                    </section>
                </div>
            </div>

            {/* 2FA Setup Modal */}
            {show2FAModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 text-center border-b border-slate-100 bg-slate-50">
                            <h2 className="text-xl font-bold text-slate-800">Setup Authenticator App</h2>
                            <p className="text-sm text-slate-500 mt-2">Scan the QR code below with Google Authenticator or Authy.</p>
                        </div>
                        <div className="p-8">
                            <div className="flex justify-center mb-6">
                                <div dangerouslySetInnerHTML={{ __html: qrCodeSvg }} className="w-48 h-48 p-2 bg-white rounded-xl shadow-sm border border-slate-100" />
                            </div>
                            <div className="space-y-4">
                                <label className="text-sm font-bold text-slate-700 block text-center">Enter 6-digit Code</label>
                                <input 
                                    type="text" 
                                    maxLength="6"
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                                    className="w-full text-center text-2xl tracking-widest bg-slate-50 border-none rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-indigo-100 transition-all font-black text-slate-700" 
                                    placeholder="000000" 
                                />
                                <div className="flex gap-4 mt-6">
                                    <button onClick={() => setShow2FAModal(false)} className="flex-1 bg-slate-100 text-slate-600 font-bold py-3 rounded-2xl hover:bg-slate-200 transition-colors">Cancel</button>
                                    <button onClick={handleVerify2FA} disabled={verifying || otpCode.length !== 6} className="flex-1 bg-emerald-600 text-white font-bold py-3 rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 disabled:opacity-50">
                                        {verifying ? 'Verifying...' : 'Verify'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Configuration Modals */}
            {paymentModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in p-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h2 className="text-xl font-bold text-slate-800">
                                {paymentModal === 'razorpay' ? 'Configure Razorpay' : paymentModal === 'upi' ? 'Configure UPI' : 'Configure Bank Details'}
                            </h2>
                            <button onClick={() => setPaymentModal(null)} className="text-slate-400 hover:text-slate-600">✕</button>
                        </div>
                        <div className="p-8 space-y-5">
                            
                            {paymentModal === 'razorpay' && (
                                <>
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Razorpay Key ID</label>
                                        <input type="text" value={paymentData.razorpay_key} onChange={e => setPaymentData({...paymentData, razorpay_key: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100" placeholder="rzp_test_XXXXXXXXXXXX" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Razorpay Key Secret</label>
                                        <input type="password" value={paymentData.razorpay_secret} onChange={e => setPaymentData({...paymentData, razorpay_secret: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100" placeholder="••••••••••••••••" />
                                    </div>
                                </>
                            )}

                            {paymentModal === 'upi' && (
                                <>
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Merchant UPI ID</label>
                                        <input type="text" value={paymentData.upi_id} onChange={e => setPaymentData({...paymentData, upi_id: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-100" placeholder="schoolname@sbi" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Upload UPI QR Code (Optional)</label>
                                        <input type="file" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
                                    </div>
                                </>
                            )}

                            {paymentModal === 'bank' && (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Bank Name</label>
                                            <input type="text" value={paymentData.bank_name} onChange={e => setPaymentData({...paymentData, bank_name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-100" placeholder="State Bank of India" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">IFSC Code</label>
                                            <input type="text" value={paymentData.ifsc_code} onChange={e => setPaymentData({...paymentData, ifsc_code: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-100" placeholder="SBIN0001234" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Account Name</label>
                                        <input type="text" value={paymentData.account_name} onChange={e => setPaymentData({...paymentData, account_name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-100" placeholder="Greenwood High School" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Account Number</label>
                                        <input type="text" value={paymentData.account_number} onChange={e => setPaymentData({...paymentData, account_number: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-100" placeholder="312456789012" />
                                    </div>
                                </>
                            )}

                            <div className="flex gap-4 mt-8 pt-4 border-t border-slate-100">
                                <button onClick={() => setPaymentModal(null)} className="flex-1 bg-slate-100 text-slate-600 font-bold py-3 rounded-2xl hover:bg-slate-200 transition-colors">Cancel</button>
                                <button onClick={() => handleSavePaymentConfig(paymentModal)} disabled={saving} className={`flex-1 text-white font-bold py-3 rounded-2xl shadow-lg transition-all disabled:opacity-50 ${paymentModal === 'razorpay' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' : paymentModal === 'upi' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'}`}>
                                    {saving ? 'Saving...' : 'Save Configuration'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
