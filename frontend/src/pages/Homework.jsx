import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Homework = () => {
    const [homework, setHomework] = useState([]);
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [filterClass, setFilterClass] = useState('');
    const [form, setForm] = useState({
        class_id: '', subject_id: '', teacher_id: '',
        title: '', description: '', due_date: '',
    });

    useEffect(() => {
        fetchHomework();
        fetchClasses();
    }, [filterClass]);

    async function fetchHomework() {
        try {
            setLoading(true);
            const params = filterClass ? { class_id: filterClass } : {};
            const res = await api.get('/homework', { params });
            setHomework((res.data.data || res.data || []) || []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    async function fetchClasses() {
        try {
            const res = await api.get('/classes');
            setClasses((res.data.data || res.data || []) || res.data || []);
        } catch (err) { console.error(err); }
    };

    const fetchSubjects = async (classId) => {
        try {
            const res = await api.get('/subjects', { params: { class_id: classId } });
            setSubjects((res.data.data || res.data || []) || res.data || []);
        } catch (err) { console.error(err); }
    };

    const handleClassChange = (classId) => {
        setForm({ ...form, class_id: classId });
        if (classId) fetchSubjects(classId);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/homework/${editingId}`, form);
            } else {
                await api.post('/homework', form);
            }
            setShowModal(false);
            setEditingId(null);
            setForm({ class_id: '', subject_id: '', teacher_id: '', title: '', description: '', due_date: '' });
            fetchHomework();
        } catch (err) { console.error(err); }
    };

    const handleEdit = (hw) => {
        setForm({
            class_id: hw.class_id, subject_id: hw.subject_id,
            teacher_id: hw.teacher_id, title: hw.title,
            description: hw.description, due_date: hw.due_date?.split('T')[0] || '',
        });
        setEditingId(hw.id);
        if (hw.class_id) fetchSubjects(hw.class_id);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this homework?')) return;
        try {
            await api.delete(`/homework/${id}`);
            fetchHomework();
        } catch (err) { console.error(err); }
    };

    const isOverdue = (date) => new Date(date) < new Date() ? true : false;

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1e293b' }}>📝 Homework</h1>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <select value={filterClass} onChange={e => setFilterClass(e.target.value)}
                        style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff' }}>
                        <option value="">All Classes</option>
                        {classes.map(c => <option key={c.id} value={c.id}>{c.class_name} - {c.section}</option>)}
                    </select>
                    <button onClick={() => { setShowModal(true); setEditingId(null); setForm({ class_id: '', subject_id: '', teacher_id: '', title: '', description: '', due_date: '' }); }}
                        style={{ padding: '0.5rem 1.5rem', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                        + Add Homework
                    </button>
                </div>
            </div>

            {loading ? <p>Loading...</p> : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {homework.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', background: '#f8fafc', borderRadius: '12px', color: '#94a3b8' }}>
                            No homework found
                        </div>
                    ) : homework.map(hw => (
                        <div key={hw.id} style={{
                            background: '#fff', borderRadius: '12px', padding: '1.25rem', border: '1px solid #e2e8f0',
                            borderLeft: `4px solid ${isOverdue(hw.due_date) ? '#ef4444' : '#22c55e'}`,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.25rem' }}>{hw.title}</h3>
                                    <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{hw.description}</p>
                                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#94a3b8' }}>
                                        <span>📚 {hw.subject?.subject_name || 'N/A'}</span>
                                        <span>🏫 {hw.class_?.class_name || 'N/A'}</span>
                                        <span>👨‍🏫 {hw.teacher?.user?.name || 'N/A'}</span>
                                        <span style={{ color: isOverdue(hw.due_date) ? '#ef4444' : '#22c55e', fontWeight: '600' }}>
                                            📅 Due: {hw.due_date?.split('T')[0] || 'N/A'}
                                        </span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button onClick={() => handleEdit(hw)}
                                        style={{ padding: '0.35rem 0.75rem', background: '#eef2ff', color: '#6366f1', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(hw.id)}
                                        style={{ padding: '0.35rem 0.75rem', background: '#fef2f2', color: '#ef4444', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: '#fff', borderRadius: '16px', padding: '2rem', width: '500px', maxHeight: '90vh', overflow: 'auto' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem' }}>{editingId ? 'Edit' : 'Add'} Homework</h2>
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                <select value={form.class_id} onChange={e => handleClassChange(e.target.value)} required
                                    style={{ padding: '0.625rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                    <option value="">Select Class</option>
                                    {classes.map(c => <option key={c.id} value={c.id}>{c.class_name} - {c.section}</option>)}
                                </select>
                                <select value={form.subject_id} onChange={e => setForm({ ...form, subject_id: e.target.value })} required
                                    style={{ padding: '0.625rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                    <option value="">Select Subject</option>
                                    {subjects.map(s => <option key={s.id} value={s.id}>{s.subject_name}</option>)}
                                </select>
                                <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required
                                    style={{ padding: '0.625rem', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} required
                                    style={{ padding: '0.625rem', borderRadius: '8px', border: '1px solid #e2e8f0', resize: 'vertical' }} />
                                <input type="date" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} required
                                    style={{ padding: '0.625rem', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                                <button type="button" onClick={() => setShowModal(false)}
                                    style={{ padding: '0.5rem 1.5rem', background: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                                <button type="submit"
                                    style={{ padding: '0.5rem 1.5rem', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                                    {editingId ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Homework;
