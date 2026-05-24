import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import SuperAdminLayout from './layouts/SuperAdminLayout';
import SchoolAdminLayout from './layouts/SchoolAdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load pages for code splitting
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Landing = lazy(() => import('./pages/Landing'));
const RenewSubscription = lazy(() => import('./pages/admin/RenewSubscription'));

// -- Tenant/School Pages --
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Students = lazy(() => import('./pages/Students'));
const Teachers = lazy(() => import('./pages/Teachers'));
const Attendance = lazy(() => import('./pages/Attendance'));
const Fees = lazy(() => import('./pages/Fees'));
const Timetable = lazy(() => import('./pages/Timetable'));
const Homework = lazy(() => import('./pages/Homework'));
const Exams = lazy(() => import('./pages/Exams'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Reports = lazy(() => import('./pages/Reports'));
const Library = lazy(() => import('./pages/Library'));
const Transport = lazy(() => import('./pages/Transport'));
const Chat = lazy(() => import('./pages/Chat'));
const Settings = lazy(() => import('./pages/Settings'));

// -- Platform/SaaS Pages --
const PlatformDashboard = lazy(() => import('./pages/platform/PlatformDashboard'));
const TenantManagement = lazy(() => import('./pages/platform/TenantManagement'));
const SaaSSubscriptions = lazy(() => import('./pages/platform/SaaSSubscriptions'));
const FinancialAnalytics = lazy(() => import('./pages/admin/finance/FinancialAnalytics'));
const VerificationQueue = lazy(() => import('./pages/admin/finance/VerificationQueue'));

const Loading = () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#6366f1' }}>
        <div style={{ textAlign: 'center' }}>
            <div style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
            <p>Loading...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
);

function App() {
    return (
        <BrowserRouter>
            <Suspense fallback={<Loading />}>
                <Routes>
                    {/* Public Routes */}
                    <Route element={<AuthLayout />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Route>

                    {/* 
                      ====================================
                        SUPER ADMIN PLATFORM ROUTES
                      ====================================
                    */}
                    <Route element={<ProtectedRoute requireSuperAdmin><SuperAdminLayout /></ProtectedRoute>}>
                        <Route path="/platform/dashboard" element={<PlatformDashboard />} />
                        <Route path="/platform/schools" element={<TenantManagement />} />
                        <Route path="/platform/subscriptions" element={<SaaSSubscriptions />} />
                        <Route path="/platform/finance" element={<FinancialAnalytics />} />
                        <Route path="/platform/verification-queue" element={<VerificationQueue />} />
                        <Route path="/platform/settings" element={<Settings />} />
                    </Route>

                    {/* 
                      ====================================
                        SCHOOL ADMIN TENANT ROUTES
                      ====================================
                    */}
                    <Route element={<ProtectedRoute requireTenant><SchoolAdminLayout /></ProtectedRoute>}>
                        <Route path="/admin/dashboard" element={<Dashboard />} />
                        <Route path="/admin/students" element={<Students />} />
                        <Route path="/admin/teachers" element={<Teachers />} />
                        <Route path="/admin/attendance" element={<Attendance />} />
                        <Route path="/admin/fees" element={<Fees />} />
                        <Route path="/admin/timetable" element={<Timetable />} />
                        <Route path="/admin/homework" element={<Homework />} />
                        <Route path="/admin/exams" element={<Exams />} />
                        <Route path="/admin/notifications" element={<Notifications />} />
                        <Route path="/admin/reports" element={<Reports />} />
                        <Route path="/admin/library" element={<Library />} />
                        <Route path="/admin/transport" element={<Transport />} />
                        <Route path="/admin/chat" element={<Chat />} />
                        <Route path="/admin/settings" element={<Settings />} />
                    </Route>

                    {/* Catch all router -> intelligently redirect based on login status */}
                    <Route path="/" element={<Landing />} />
                    
                    {/* Full page subscription lockout and checkout */}
                    <Route element={<ProtectedRoute requireTenant />} >
                        <Route path="/admin/renew-subscription" element={<RenewSubscription />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}

export default App;
