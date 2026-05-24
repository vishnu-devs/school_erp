import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [recentAdmissions, setRecentAdmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddMenu, setShowAddMenu] = useState(false);

    useEffect(() => {
        async function fetchDashboardData() {
            try {
                const response = await api.get('/dashboard');
                setStats(response.data.stats);
                setRecentAdmissions(response.data.recent_admissions);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    const chartOptions = {
        chart: {
            type: 'area',
            toolbar: { show: false },
            zoom: { enabled: false }
        },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 2 },
        colors: ['#6366f1'],
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.45,
                opacityTo: 0.05,
                stops: [20, 100, 100, 100]
            }
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            axisBorder: { show: false },
            axisTicks: { show: false }
        },
        yaxis: { show: false },
        grid: { show: false }
    };

    const chartSeries = [{
        name: 'Fees Collection',
        data: [30, 40, 35, 50, 49, 60, 70]
    }];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">School Overview</h1>
                    <p className="text-slate-500 mt-1">Real-time insights into your school's performance.</p>
                </div>
                <div className="flex items-center gap-3 relative">
                    <button onClick={() => navigate('/reports')} className="bg-white text-slate-700 px-4 py-2 rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50 transition-all font-medium">Download Report</button>
                    <button onClick={() => setShowAddMenu(!showAddMenu)} className="bg-indigo-600 text-white px-4 py-2 rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all font-medium">+ Add New</button>
                    {showAddMenu && (
                        <div className="absolute top-12 right-0 bg-white border border-slate-100 shadow-xl rounded-xl py-2 w-48 z-50 animate-in slide-in-from-top-2">
                            <button onClick={() => navigate('/students')} className="w-full text-left px-4 py-2 hover:bg-slate-50 font-bold text-slate-700 text-sm">Add Student</button>
                            <button onClick={() => navigate('/teachers')} className="w-full text-left px-4 py-2 hover:bg-slate-50 font-bold text-slate-700 text-sm">Add Teacher</button>
                            <button onClick={() => navigate('/exams')} className="w-full text-left px-4 py-2 hover:bg-slate-50 font-bold text-slate-700 text-sm">Create Exam</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={<StudentIcon />} label="Total Students" value={stats?.total_students || 0} trend="+12%" color="blue" />
                <StatCard icon={<TeacherIcon />} label="Total Teachers" value={stats?.total_teachers || 0} trend="+2" color="emerald" />
                <StatCard icon={<AttendanceIcon />} label="Today Attendance" value={stats?.today_attendance} trend="Normal" color="purple" />
                <StatCard icon={<FeesIcon />} label="Pending Fees" value={stats?.pending_fees} trend="-5%" color="amber" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart Section */}
                <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-800">Monthly Fees Collection</h3>
                        <select className="bg-slate-50 border-none text-sm rounded-lg focus:ring-0">
                            <option>Last 7 Months</option>
                            <option>Last Year</option>
                        </select>
                    </div>
                    <div className="h-64">
                        <ReactApexChart options={chartOptions} series={chartSeries} type="area" height="100%" />
                    </div>
                </div>

                {/* Notifications/Events Section */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Recent Activities</h3>
                    <div className="space-y-6">
                        <ActivityItem time="10 mins ago" title="New student admitted" desc="Rahul Sharma joined Class 10A" type="admission" />
                        <ActivityItem time="1 hour ago" title="Fees received" desc="Transaction ID: #88291 from S. Verma" type="fee" />
                        <ActivityItem time="2 hours ago" title="Exam scheduled" desc="Mathematics Mid-term for Class 8" type="exam" />
                        <ActivityItem time="Yesterday" title="Holiday notification" desc="School closed for Holi Festival" type="notice" />
                    </div>
                </div>
            </div>

            {/* Recent Admissions Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-800">Recent Admissions</h3>
                    <button onClick={() => navigate('/students')} className="text-indigo-600 text-sm font-semibold hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Student Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Class</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Admission ID</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {recentAdmissions.length > 0 ? recentAdmissions.map((student) => (
                                <TableRow 
                                    key={student.id} 
                                    name={student.user?.name} 
                                    class={student.class?.class_name || 'N/A'} 
                                    id={student.admission_no} 
                                    status="Active" 
                                />
                            )) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-10 text-center text-slate-400">No recent admissions</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, trend, color }) => {
    const colors = {
        blue: 'bg-blue-50 text-blue-600',
        emerald: 'bg-emerald-50 text-emerald-600',
        purple: 'bg-purple-50 text-purple-600',
        amber: 'bg-amber-50 text-amber-600'
    };

    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${colors[color]} group-hover:scale-110 transition-transform`}>
                    {icon}
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'}`}>
                    {trend}
                </span>
            </div>
            <div>
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <p className="text-2xl font-black text-slate-800 mt-1">{value}</p>
            </div>
        </div>
    );
};

const ActivityItem = ({ time, title, desc, type }) => (
    <div className="flex gap-4">
        <div className="flex flex-col items-center">
            <div className={`w-3 h-3 rounded-full mt-1.5 ${type === 'admission' ? 'bg-blue-500' : type === 'fee' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
            <div className="w-0.5 h-full bg-slate-100 mt-1"></div>
        </div>
        <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">{time}</p>
            <h4 className="text-sm font-bold text-slate-800">{title}</h4>
            <p className="text-sm text-slate-500">{desc}</p>
        </div>
    </div>
);

const TableRow = ({ name, class: className, id, status }) => (
    <tr className="hover:bg-slate-50 transition-colors">
        <td className="px-6 py-4">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200"></div>
                <span className="text-sm font-bold text-slate-800">{name}</span>
            </div>
        </td>
        <td className="px-6 py-4 text-sm text-slate-600">{className}</td>
        <td className="px-6 py-4 text-sm text-slate-600">{id}</td>
        <td className="px-6 py-4">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                {status}
            </span>
        </td>
    </tr>
);

const StudentIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>;
const TeacherIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>;
const AttendanceIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>;
const FeesIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;

export default Dashboard;
