import React, { useState } from 'react';
import { Outlet, Navigate, useNavigate, Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

const SuperAdminLayout = () => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const navItems = [
        { label: 'Platform Overview', path: '/platform/dashboard', icon: <DashboardIcon /> },
        { label: 'Tenant Schools', path: '/platform/schools', icon: <TenantIcon /> },
        { label: 'SaaS Subscriptions', path: '/platform/subscriptions', icon: <SubscriptionIcon /> },
        { label: 'Financial Analytics', path: '/platform/finance', icon: <FinanceIcon /> },
        { label: 'Global Settings', path: '/platform/settings', icon: <SettingsIcon /> },
    ];

    return (
        <div className="min-h-screen bg-slate-950 flex">
            {/* Sidebar - Darker SaaS Theme */}
            <aside className={`${sidebarOpen ? 'w-72' : 'w-20'} bg-black text-slate-300 min-h-screen p-4 flex flex-col transition-all duration-300 ease-in-out border-r border-slate-800 hidden lg:flex relative`}>
                <div className="flex items-center gap-3 px-3 py-6 mb-8 border-b border-slate-900 pb-8">
                    <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-500/20">
                        <span className="font-black text-xl">P</span>
                    </div>
                    {sidebarOpen && (
                        <div>
                            <span className="block text-xl font-black text-white tracking-tight uppercase">Platform</span>
                            <span className="block text-xs font-bold text-emerald-500 tracking-widest uppercase">Super Admin</span>
                        </div>
                    )}
                </div>

                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => (
                        <Link 
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 group ${location.pathname.startsWith(item.path) ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'hover:bg-slate-900 hover:text-white'}`}
                        >
                            <span className={`${location.pathname.startsWith(item.path) ? 'text-emerald-400' : 'text-slate-500 group-hover:text-emerald-500'}`}>{item.icon}</span>
                            {sidebarOpen && <span className="font-semibold text-sm tracking-wide">{item.label}</span>}
                        </Link>
                    ))}
                </nav>

                <div className="pt-6 border-t border-slate-900">
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-4 px-4 py-3 rounded-lg w-full text-red-500 hover:bg-red-500/10 transition-all font-semibold text-sm"
                    >
                        <LogoutIcon />
                        {sidebarOpen && <span>Secure Logout</span>}
                    </button>
                </div>

                {/* Toggle Button */}
                <button 
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="absolute -right-3 top-24 bg-slate-800 border border-slate-700 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                >
                    {sidebarOpen ? '‹' : '›'}
                </button>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Header */}
                <header className="bg-slate-900/50 backdrop-blur-md sticky top-0 z-40 border-b border-slate-800 h-20 flex items-center justify-between px-8">
                    <div className="flex items-center gap-4">
                        <div className="hidden md:block">
                            <h2 className="text-lg font-bold text-white">SaaS Control Center</h2>
                            <p className="text-xs font-medium text-slate-400">System Operating Normally • All Nodes Online</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3 pl-6 border-l border-slate-800">
                            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/20 border-2 border-slate-900">
                                SA
                            </div>
                            <div className="hidden md:block">
                                <p className="text-sm font-bold text-white">{user?.name}</p>
                                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Platform Owner</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Viewport */}
                <main className="p-8 max-w-[1600px] w-full">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

// Icons components
const DashboardIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>;
const TenantIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>;
const SubscriptionIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>;
const FinanceIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
const SettingsIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>;
const LogoutIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>;

export default SuperAdminLayout;
