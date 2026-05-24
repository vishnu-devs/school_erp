import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Exams = () => {
    const [exams, setExams] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ exam_name: '', class_id: '', start_date: '', end_date: '' });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => { fetchExams(); fetchClasses(); }, []);

    async function fetchExams() {
        try { setLoading(true); const res = await api.get('/exams'); setExams((res.data.data || res.data || []) || []); }
        catch (err) { console.error(err); } finally { setLoading(false); }
    };
    async function fetchClasses() {
        try { const res = await api.get('/classes'); setClasses((res.data.data || res.data || []) || res.data || []); }
        catch (err) { console.error(err); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            editingId ? await api.put(`/exams/${editingId}`, form) : await api.post('/exams', form);
            setShowModal(false); setEditingId(null);
            setForm({ exam_name: '', class_id: '', start_date: '', end_date: '' }); fetchExams();
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete?')) return;
        try { await api.delete(`/exams/${id}`); fetchExams(); } catch (err) { console.error(err); }
    };

    const getStatus = (s, e) => {
        const now = new Date();
        if (now < new Date(s)) return { label: 'Upcoming', color: '#3b82f6', bg: '#eff6ff' };
        if (now <= new Date(e)) return { label: 'Ongoing', color: '#f59e0b', bg: '#fffbeb' };
        return { label: 'Completed', color: '#22c55e', bg: '#f0fdf4' };
    };

    const inputStyle = { padding: '0.625rem', borderRadius: '8px', border: '1px solid #e2e8f0', width: '100%', boxSizing: 'border-box' };
    const btnPrimary = { padding: '0.5rem 1.5rem', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' };

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1e293b' }}>📋 Exams & Results</h1>
                <button onClick={() => { setShowModal(true); setEditingId(null); setForm({ exam_name: '', class_id: '', start_date: '', end_date: '' }); }} style={btnPrimary}>+ Create Exam</button>
            </div>

            {loading ? <p>Loading...</p> : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: '1rem' }}>
                    {exams.map(exam => {
                        const st = getStatus(exam.start_date, exam.end_date);
                        return (
                            <div key={exam.id} style={{ background: '#fff', borderRadius: '12px', padding: '1.25rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <h3 style={{ fontWeight: '600', color: '#1e293b' }}>{exam.exam_name}</h3>
                                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '600', background: st.bg, color: st.color }}>{st.label}</span>
                                </div>
                                <p style={{ color: '#64748b', fontSize: '0.85rem' }}>🏫 {exam.class_?.class_name || 'N/A'}</p>
                                <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '0.5rem 0 1rem' }}>📅 {exam.start_date?.split('T')[0]} → {exam.end_date?.split('T')[0]}</p>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button onClick={() => { setForm({ exam_name: exam.exam_name, class_id: exam.class_id, start_date: exam.start_date?.split('T')[0]||'', end_date: exam.end_date?.split('T')[0]||'' }); setEditingId(exam.id); setShowModal(true); }}
                                        style={{ padding: '0.3rem 0.7rem', background: '#eef2ff', color: '#6366f1', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>Edit</button>
                                    <button onClick={() => handleDelete(exam.id)}
                                        style={{ padding: '0.3rem 0.7rem', background: '#fef2f2', color: '#ef4444', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>Delete</button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {showModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: '#fff', borderRadius: '16px', padding: '2rem', width: '420px' }}>
                        <h2 style={{ fontWeight: '700', marginBottom: '1.5rem' }}>{editingId ? 'Edit' : 'Create'} Exam</h2>
                        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
                            <input placeholder="Exam Name" value={form.exam_name} onChange={e => setForm({ ...form, exam_name: e.target.value })} required style={inputStyle} />
                            <select value={form.class_id} onChange={e => setForm({ ...form, class_id: e.target.value })} required style={inputStyle}>
                                <option value="">Select Class</option>
                                {classes.map(c => <option key={c.id} value={c.id}>{c.class_name} - {c.section}</option>)}
                            </select>
                            <input type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} required style={inputStyle} />
                            <input type="date" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} required style={inputStyle} />
                            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '0.5rem 1.5rem', background: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" style={btnPrimary}>{editingId ? 'Update' : 'Create'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Exams;
