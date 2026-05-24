import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Library = () => {
    const [books, setBooks] = useState([]);
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('books');
    const [showModal, setShowModal] = useState(false);
    const [showIssueModal, setShowIssueModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [search, setSearch] = useState('');
    const [form, setForm] = useState({ book_name: '', author: '', isbn: '', category: '', quantity: '' });
    const [issueForm, setIssueForm] = useState({ book_id: '', student_id: '', issue_date: '', return_date: '' });

    useEffect(() => { fetchBooks(); fetchIssues(); }, []);

    async function fetchBooks() {
        try { setLoading(true); const params = search ? { search } : {}; const r = await api.get('/library', { params }); setBooks((r.data.data || r.data || []) || []); }
        catch (e) { console.error(e); } finally { setLoading(false); }
    };
    async function fetchIssues() {
        try { const r = await api.get('/library-issues'); setIssues((r.data.data || r.data || []) || []); }
        catch (e) { console.error(e); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            editingId ? await api.put(`/library/${editingId}`, form) : await api.post('/library', form);
            setShowModal(false); setEditingId(null); setForm({ book_name: '', author: '', isbn: '', category: '', quantity: '' }); fetchBooks();
        } catch (e) { console.error(e); }
    };

    const handleIssue = async (e) => {
        e.preventDefault();
        try { await api.post('/library-issues', issueForm); setShowIssueModal(false); setIssueForm({ book_id: '', student_id: '', issue_date: '', return_date: '' }); fetchIssues(); fetchBooks(); }
        catch (e) { console.error(e); }
    };

    const handleReturn = async (issueId) => {
        try { await api.patch(`/library-issues/${issueId}/return`, { fine: 0 }); fetchIssues(); fetchBooks(); }
        catch (e) { console.error(e); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this book?')) return;
        try { await api.delete(`/library/${id}`); fetchBooks(); } catch (e) { console.error(e); }
    };

    const inputStyle = { padding: '0.625rem', borderRadius: '8px', border: '1px solid #e2e8f0', width: '100%', boxSizing: 'border-box' };
    const btnPrimary = { padding: '0.5rem 1.5rem', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' };

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1e293b' }}>📚 Library</h1>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => setShowIssueModal(true)} style={{ ...btnPrimary, background: 'linear-gradient(135deg,#22c55e,#16a34a)' }}>📖 Issue Book</button>
                    <button onClick={() => { setShowModal(true); setEditingId(null); setForm({ book_name: '', author: '', isbn: '', category: '', quantity: '' }); }} style={btnPrimary}>+ Add Book</button>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <button onClick={() => setActiveTab('books')} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer', background: activeTab === 'books' ? '#6366f1' : '#f1f5f9', color: activeTab === 'books' ? '#fff' : '#64748b' }}>📚 Books</button>
                <button onClick={() => setActiveTab('issues')} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer', background: activeTab === 'issues' ? '#6366f1' : '#f1f5f9', color: activeTab === 'issues' ? '#fff' : '#64748b' }}>📋 Issues</button>
            </div>

            {activeTab === 'books' && (
                <>
                    <div style={{ marginBottom: '1rem' }}>
                        <input placeholder="Search books..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && fetchBooks()}
                            style={{ ...inputStyle, maxWidth: '300px' }} />
                    </div>
                    {loading ? <p>Loading...</p> : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1rem' }}>
                            {books.map(b => (
                                <div key={b.id} style={{ background: '#fff', borderRadius: '12px', padding: '1.25rem', border: '1px solid #e2e8f0' }}>
                                    <h3 style={{ fontWeight: '600', color: '#1e293b', marginBottom: '0.25rem' }}>📖 {b.book_name}</h3>
                                    <p style={{ color: '#64748b', fontSize: '0.85rem' }}>by {b.author}</p>
                                    {b.isbn && <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>ISBN: {b.isbn}</p>}
                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', fontSize: '0.85rem' }}>
                                        <span style={{ color: '#6366f1' }}>Total: {b.quantity}</span>
                                        <span style={{ color: b.available_quantity > 0 ? '#22c55e' : '#ef4444' }}>Available: {b.available_quantity}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                                        <button onClick={() => { setForm({ book_name: b.book_name, author: b.author, isbn: b.isbn || '', category: b.category || '', quantity: b.quantity }); setEditingId(b.id); setShowModal(true); }}
                                            style={{ padding: '0.3rem 0.7rem', background: '#eef2ff', color: '#6366f1', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>Edit</button>
                                        <button onClick={() => handleDelete(b.id)}
                                            style={{ padding: '0.3rem 0.7rem', background: '#fef2f2', color: '#ef4444', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {activeTab === 'issues' && (
                <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '12px', overflow: 'hidden' }}>
                    <thead><tr style={{ borderBottom: '2px solid #e2e8f0', background: '#f8fafc' }}>
                        {['Book', 'Student', 'Issue Date', 'Return Date', 'Status', 'Action'].map(h => <th key={h} style={{ padding: '0.75rem', textAlign: 'left', color: '#64748b', fontSize: '0.85rem' }}>{h}</th>)}
                    </tr></thead>
                    <tbody>{issues.map(i => (
                        <tr key={i.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '0.75rem' }}>{i.book?.book_name || 'N/A'}</td>
                            <td style={{ padding: '0.75rem' }}>{i.student?.user?.name || 'N/A'}</td>
                            <td style={{ padding: '0.75rem' }}>{i.issue_date}</td>
                            <td style={{ padding: '0.75rem' }}>{i.return_date || '-'}</td>
                            <td style={{ padding: '0.75rem' }}><span style={{ padding: '0.2rem 0.5rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '600', background: i.status === 'Returned' ? '#f0fdf4' : '#fffbeb', color: i.status === 'Returned' ? '#22c55e' : '#f59e0b' }}>{i.status}</span></td>
                            <td style={{ padding: '0.75rem' }}>{i.status !== 'Returned' && <button onClick={() => handleReturn(i.id)} style={{ padding: '0.3rem 0.7rem', background: '#f0fdf4', color: '#22c55e', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>Return</button>}</td>
                        </tr>
                    ))}</tbody>
                </table>
            )}

            {/* Add/Edit Book Modal */}
            {showModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: '#fff', borderRadius: '16px', padding: '2rem', width: '420px' }}>
                        <h2 style={{ fontWeight: '700', marginBottom: '1.5rem' }}>{editingId ? 'Edit' : 'Add'} Book</h2>
                        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
                            <input placeholder="Book Name" value={form.book_name} onChange={e => setForm({ ...form, book_name: e.target.value })} required style={inputStyle} />
                            <input placeholder="Author" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} required style={inputStyle} />
                            <input placeholder="ISBN" value={form.isbn} onChange={e => setForm({ ...form, isbn: e.target.value })} style={inputStyle} />
                            <input placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={inputStyle} />
                            <input type="number" placeholder="Quantity" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} required style={inputStyle} />
                            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '0.5rem 1.5rem', background: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" style={btnPrimary}>{editingId ? 'Update' : 'Add'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Issue Book Modal */}
            {showIssueModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: '#fff', borderRadius: '16px', padding: '2rem', width: '420px' }}>
                        <h2 style={{ fontWeight: '700', marginBottom: '1.5rem' }}>Issue Book</h2>
                        <form onSubmit={handleIssue} style={{ display: 'grid', gap: '1rem' }}>
                            <select value={issueForm.book_id} onChange={e => setIssueForm({ ...issueForm, book_id: e.target.value })} required style={inputStyle}>
                                <option value="">Select Book</option>
                                {books.filter(b => b.available_quantity > 0).map(b => <option key={b.id} value={b.id}>{b.book_name} ({b.available_quantity} avail.)</option>)}
                            </select>
                            <input placeholder="Student ID" value={issueForm.student_id} onChange={e => setIssueForm({ ...issueForm, student_id: e.target.value })} required style={inputStyle} />
                            <input type="date" value={issueForm.issue_date} onChange={e => setIssueForm({ ...issueForm, issue_date: e.target.value })} required style={inputStyle} />
                            <input type="date" value={issueForm.return_date} onChange={e => setIssueForm({ ...issueForm, return_date: e.target.value })} required style={inputStyle} />
                            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                                <button type="button" onClick={() => setShowIssueModal(false)} style={{ padding: '0.5rem 1.5rem', background: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" style={btnPrimary}>Issue</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Library;
