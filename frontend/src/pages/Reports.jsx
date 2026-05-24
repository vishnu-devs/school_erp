import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Reports = () => {
    const [activeReport, setActiveReport] = useState('overview');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [classes, setClasses] = useState([]);
    const [exams, setExams] = useState([]);
    const [filters, setFilters] = useState({ class_id: '', start_date: '', end_date: '', exam_id: '', student_id: '' });

    useEffect(() => { fetchClasses(); fetchExams(); fetchOverview(); }, []);

    async function fetchClasses() { try { const r = await api.get('/classes'); setClasses((r.data.data || r.data || []) || r.data || []); } catch (e) { console.error(e); } };
    async function fetchExams() { try { const r = await api.get('/exams'); setExams((r.data.data || r.data || []) || []); } catch (e) { console.error(e); } };
    async function fetchOverview() { try { setLoading(true); const r = await api.get('/reports/overview'); setData(r.data); } catch (e) { console.error(e); } finally { setLoading(false); } };

    const fetchReport = async (type) => {
        setActiveReport(type); setLoading(true);
        try {
            if (type === 'overview') { fetchOverview(); return; }
            const params = {};
            if (type === 'attendance' || type === 'fee-collection') {
                params.class_id = filters.class_id; params.start_date = filters.start_date; params.end_date = filters.end_date;
            }
            if (type === 'exam') params.exam_id = filters.exam_id;
            if (type === 'student-performance') params.student_id = filters.student_id;
            const r = await api.get(`/reports/${type}`, { params });
            setData(r.data);
        } catch (e) { console.error(e); setData(null); }
        finally { setLoading(false); }
    };

    const reports = [
        { key: 'overview', label: '📊 Overview', icon: '📊' },
        { key: 'attendance', label: '✅ Attendance', icon: '✅' },
        { key: 'fee-collection', label: '💰 Fee Collection', icon: '💰' },
        { key: 'exam', label: '📝 Exam', icon: '📝' },
        { key: 'student-performance', label: '🎓 Student', icon: '🎓' },
        { key: 'teacher', label: '👨‍🏫 Teacher', icon: '👨‍🏫' },
    ];

    const inputStyle = { padding: '0.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.85rem' };
    const cardStyle = { background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e2e8f0' };

    return (
        <div style={{ padding: '2rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1e293b', marginBottom: '1.5rem' }}>📈 Reports</h1>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                {reports.map(r => (
                    <button key={r.key} onClick={() => fetchReport(r.key)}
                        style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '500', background: activeReport === r.key ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : '#f1f5f9', color: activeReport === r.key ? '#fff' : '#64748b' }}>
                        {r.label}
                    </button>
                ))}
            </div>

            {/* Filters */}
            {['attendance', 'fee-collection'].includes(activeReport) && (
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <select value={filters.class_id} onChange={e => setFilters({ ...filters, class_id: e.target.value })} style={inputStyle}>
                        <option value="">Select Class</option>
                        {classes.map(c => <option key={c.id} value={c.id}>{c.class_name} - {c.section}</option>)}
                    </select>
                    <input type="date" value={filters.start_date} onChange={e => setFilters({ ...filters, start_date: e.target.value })} style={inputStyle} />
                    <input type="date" value={filters.end_date} onChange={e => setFilters({ ...filters, end_date: e.target.value })} style={inputStyle} />
                    <button onClick={() => fetchReport(activeReport)} style={{ padding: '0.5rem 1rem', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Generate</button>
                </div>
            )}
            {activeReport === 'exam' && (
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                    <select value={filters.exam_id} onChange={e => setFilters({ ...filters, exam_id: e.target.value })} style={inputStyle}>
                        <option value="">Select Exam</option>
                        {exams.map(e => <option key={e.id} value={e.id}>{e.exam_name}</option>)}
                    </select>
                    <button onClick={() => fetchReport('exam')} style={{ padding: '0.5rem 1rem', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Generate</button>
                </div>
            )}
            {activeReport === 'student-performance' && (
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                    <input placeholder="Student ID" value={filters.student_id} onChange={e => setFilters({ ...filters, student_id: e.target.value })} style={inputStyle} />
                    <button onClick={() => fetchReport('student-performance')} style={{ padding: '0.5rem 1rem', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Generate</button>
                </div>
            )}

            {/* Report Content */}
            {loading ? <p>Loading report...</p> : data && (
                <div style={cardStyle}>
                    {activeReport === 'overview' && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '1rem' }}>
                            {[
                                { label: 'Total Students', value: data.total_students, color: '#6366f1', icon: '🎓' },
                                { label: 'Total Teachers', value: data.total_teachers, color: '#8b5cf6', icon: '👨‍🏫' },
                                { label: 'Present Today', value: data.today_present, color: '#22c55e', icon: '✅' },
                                { label: 'Absent Today', value: data.today_absent, color: '#ef4444', icon: '❌' },
                                { label: 'Monthly Fees', value: `₹${data.monthly_fee_collection || 0}`, color: '#f59e0b', icon: '💰' },
                                { label: 'Pending Fees', value: `₹${data.pending_fees || 0}`, color: '#ef4444', icon: '⏳' },
                            ].map((w, i) => (
                                <div key={i} style={{ padding: '1.25rem', borderRadius: '12px', background: `${w.color}10`, border: `1px solid ${w.color}30` }}>
                                    <span style={{ fontSize: '1.5rem' }}>{w.icon}</span>
                                    <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.5rem' }}>{w.label}</p>
                                    <p style={{ fontSize: '1.5rem', fontWeight: '700', color: w.color }}>{w.value}</p>
                                </div>
                            ))}
                        </div>
                    )}
                    {activeReport === 'attendance' && data.data && (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead><tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                                {['Student', 'Days', 'Present', 'Absent', 'Leave', '%'].map(h => <th key={h} style={{ padding: '0.75rem', textAlign: 'left', color: '#64748b', fontSize: '0.85rem' }}>{h}</th>)}
                            </tr></thead>
                            <tbody>{data.data.map((r, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '0.75rem' }}>{r.student_name}</td>
                                    <td style={{ padding: '0.75rem' }}>{r.total_days}</td>
                                    <td style={{ padding: '0.75rem', color: '#22c55e' }}>{r.present}</td>
                                    <td style={{ padding: '0.75rem', color: '#ef4444' }}>{r.absent}</td>
                                    <td style={{ padding: '0.75rem', color: '#f59e0b' }}>{r.leave}</td>
                                    <td style={{ padding: '0.75rem', fontWeight: '600' }}>{r.percentage}%</td>
                                </tr>
                            ))}</tbody>
                        </table>
                    )}
                    {activeReport === 'fee-collection' && data.summary && (
                        <div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '1rem' }}>
                                <div style={{ padding: '1rem', borderRadius: '10px', background: '#f0fdf4' }}><p style={{ color: '#64748b' }}>Collected</p><p style={{ fontWeight: '700', color: '#22c55e', fontSize: '1.3rem' }}>₹{data.summary.total_collected}</p></div>
                                <div style={{ padding: '1rem', borderRadius: '10px', background: '#fffbeb' }}><p style={{ color: '#64748b' }}>Pending</p><p style={{ fontWeight: '700', color: '#f59e0b', fontSize: '1.3rem' }}>₹{data.summary.total_pending}</p></div>
                                <div style={{ padding: '1rem', borderRadius: '10px', background: '#fef2f2' }}><p style={{ color: '#64748b' }}>Failed</p><p style={{ fontWeight: '700', color: '#ef4444', fontSize: '1.3rem' }}>₹{data.summary.total_failed}</p></div>
                            </div>
                        </div>
                    )}
                    {['exam', 'student-performance', 'teacher'].includes(activeReport) && (
                        <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.85rem', color: '#334155', background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
                            {JSON.stringify(data, null, 2)}
                        </pre>
                    )}
                </div>
            )}
        </div>
    );
};

export default Reports;
