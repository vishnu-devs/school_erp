import React, { useState } from 'react';
import { Outlet, Navigate, useNavigate, Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

const SchoolAdminLayout = () => {
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

    const activePlan = user?.school?.subscription_plan?.toLowerCase() || 'basic plan';

    const isModuleAllowed = (label) => {
        const allowedBasic = ['Dashboard', 'Students', 'Teachers', 'Attendance', 'Homework', 'Settings'];
        const allowedPro = [...allowedBasic, 'Fees', 'Timetable', 'Exams', 'Notifications', 'Reports'];
        const allowedEnterprise = [...allowedPro, 'Library', 'Transport', 'Chat'];

        if (activePlan.includes('enterprise')) return allowedEnterprise.includes(label);
        if (activePlan.includes('pro')) return allowedPro.includes(label);
        return allowedBasic.includes(label);
    };

    const navItems = [
        { label: 'Dashboard', path: '/admin/dashboard', icon: <DashboardIcon /> },
        { label: 'Students', path: '/admin/students', icon: <StudentIcon /> },
        { label: 'Teachers', path: '/admin/teachers', icon: <TeacherIcon /> },
        { label: 'Attendance', path: '/admin/attendance', icon: <AttendanceIcon /> },
        { label: 'Fees', path: '/admin/fees', icon: <FeesIcon /> },
        { label: 'Timetable', path: '/admin/timetable', icon: <TimeIcon /> },
        { label: 'Homework', path: '/admin/homework', icon: <HomeworkIcon /> },
        { label: 'Exams', path: '/admin/exams', icon: <ExamIcon /> },
        { label: 'Library', path: '/admin/library', icon: <LibraryIcon /> },
        { label: 'Transport', path: '/admin/transport', icon: <TransportIcon /> },
        { label: 'Notifications', path: '/admin/notifications', icon: <NotificationIcon /> },
        { label: 'Reports', path: '/admin/reports', icon: <ReportIcon /> },
        { label: 'Chat', path: '/admin/chat', icon: <ChatIcon /> },
        { label: 'Settings', path: '/admin/settings', icon: <SettingsIcon /> },
    ];

    const filteredNavItems = navItems.filter(item => isModuleAllowed(item.label));

    // Check if the current direct URL path is allowed under the current plan
    const currentNavItem = navItems.find(item => location.pathname.startsWith(item.path));
    const isCurrentRouteAllowed = currentNavItem ? isModuleAllowed(currentNavItem.label) : true;

    return (
        <div className="min-h-screen bg-[#f8fafc] flex">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-72' : 'w-20'} bg-slate-900 text-slate-300 min-h-screen p-4 flex flex-col transition-all duration-300 ease-in-out border-r border-slate-800 hidden lg:flex relative`}>
                <div className="flex items-center gap-3 px-3 py-6 mb-8">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-500/20">
                        <span className="font-black text-xl">S</span>
                    </div>
                    {sidebarOpen && <span className="text-xl font-black text-white tracking-tight uppercase">CodeByVishu</span>}
                </div>

                <nav className="flex-1 space-y-1 overflow-y-auto max-h-[calc(100vh-200px)] scrollbar-thin scrollbar-thumb-slate-850">
                    {filteredNavItems.map((item) => (
                        <Link 
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 group ${location.pathname === item.path ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'hover:bg-slate-800 hover:text-white'}`}
                        >
                            <span className={`${location.pathname === item.path ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'}`}>{item.icon}</span>
                            {sidebarOpen && <span className="font-semibold">{item.label}</span>}
                        </Link>
                    ))}
                </nav>

                <div className="pt-6 border-t border-slate-800">
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-4 px-4 py-3 rounded-2xl w-full text-red-400 hover:bg-red-500/10 transition-all font-semibold"
                    >
                        <LogoutIcon />
                        {sidebarOpen && <span>Logout</span>}
                    </button>
                </div>

                {/* Toggle Button */}
                <button 
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="absolute -right-3 top-24 bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                >
                    {sidebarOpen ? '‹' : '›'}
                </button>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Header */}
                <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-100 h-20 flex items-center justify-between px-8">
                    <div className="flex items-center gap-4">
                        <div className="lg:hidden w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">S</div>
                        <div className="hidden md:block">
                            <h2 className="text-lg font-bold text-slate-800">Welcome Back, {user?.name?.split(' ')[0]}!</h2>
                            <p className="text-xs font-medium text-slate-400">School Admin • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                        <div className="relative hidden sm:block">
                            <input 
                                type="text" 
                                placeholder="Search (Press Enter)..." 
                                onKeyDown={(e) => {
                                    if(e.key === 'Enter') {
                                        alert('Global search is under construction for: ' + e.target.value);
                                    }
                                }}
                                className="bg-slate-50 border-none rounded-xl px-4 py-2 w-64 text-sm focus:ring-2 focus:ring-indigo-100 transition-all outline-none" 
                            />
                        </div>
                        <button onClick={() => navigate('/admin/notifications')} className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 border-2 border-white shadow-sm"></div>
                            <div className="hidden md:block col-span-2 text-left">
                                <p className="text-sm font-black text-slate-850 leading-tight">{user?.name}</p>
                                <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mt-0.5">{activePlan}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Viewport */}
                <main className="p-8 max-w-[1600px] flex-1">
                    {isCurrentRouteAllowed ? (
                        <Outlet />
                    ) : (
                        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-16 text-center max-w-2xl mx-auto shadow-sm mt-12 animate-in fade-in duration-300">
                            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0 0v2m0-2h2m-2 0H10m4-6a4 4 0 11-8 0 4 4 0 018 0zM3 20h18M3 20a1.5 1.5 0 01-1.5-1.5V6a1.5 1.5 0 011.5-1.5h18A1.5 1.5 0 0122 6v12.5A1.5 1.5 0 0120.5 20H3z"></path></svg>
                            </div>
                            <span className="text-[10px] font-black text-indigo-600 tracking-widest uppercase">Premium Capability Locked</span>
                            <h3 className="text-2xl font-black text-slate-800 mt-2">Unlock the {currentNavItem?.label} Module</h3>
                            <p className="text-sm text-slate-450 mt-3 max-w-md mx-auto leading-relaxed">
                                The **{currentNavItem?.label}** system is only available for Pro and Enterprise subscribers. Upgrade your school ERP today to expand operational features.
                            </p>
                            <div className="mt-8 flex justify-center gap-4">
                                <button 
                                    onClick={() => navigate('/admin/renew-subscription')} 
                                    className="bg-indigo-600 hover:bg-indigo-750 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-indigo-100 transition-all text-sm cursor-pointer"
                                >
                                    Upgrade Subscription Tier
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

// Icons components
const DashboardIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>;
const StudentIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>;
const TeacherIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>;
const AttendanceIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>;
const FeesIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>;
const TimeIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
const HomeworkIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>;
const ExamIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>;
const LibraryIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>;
const TransportIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h8m-8 4h8m-4-8v16m-5 0h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>;
const NotificationIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>;
const ReportIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>;
const ChatIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>;
const SettingsIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>;
const LogoutIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>;

export default SchoolAdminLayout;
