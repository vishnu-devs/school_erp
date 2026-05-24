import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showSend, setShowSend] = useState(false);
    const [form, setForm] = useState({ title: '', message: '', type: 'general', user_ids: [] });
    const [users, setUsers] = useState([]);
    const [filterUnread, setFilterUnread] = useState(false);

    useEffect(() => { fetchNotifications(); }, [filterUnread]);

    async function fetchNotifications() {
        try {
            setLoading(true);
            const params = filterUnread ? { unread: 1 } : {};
            const res = await api.get('/notifications', { params });
            setNotifications((res.data.data || res.data || []) || []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const markRead = async (id) => {
        try { await api.patch(`/notifications/${id}/read`); fetchNotifications(); }
        catch (err) { console.error(err); }
    };

    const markAllRead = async () => {
        try { await api.patch('/notifications/read-all'); fetchNotifications(); }
        catch (err) { console.error(err); }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        try { await api.post('/notifications', form); setShowSend(false); setForm({ title: '', message: '', type: 'general', user_ids: [] }); fetchNotifications(); }
        catch (err) { console.error(err); }
    };

    const deleteNotif = async (id) => {
        try { await api.delete(`/notifications/${id}`); fetchNotifications(); }
        catch (err) { console.error(err); }
    };

    const typeIcon = { general: '📢', attendance: '✅', fee: '💰', homework: '📝', result: '📊', emergency: '🚨' };
    const inputStyle = { padding: '0.625rem', borderRadius: '8px', border: '1px solid #e2e8f0', width: '100%', boxSizing: 'border-box' };
    const btnPrimary = { padding: '0.5rem 1.5rem', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' };

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1e293b' }}>🔔 Notifications</h1>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button onClick={() => setFilterUnread(!filterUnread)}
                        style={{ padding: '0.5rem 1rem', background: filterUnread ? '#eef2ff' : '#f1f5f9', color: filterUnread ? '#6366f1' : '#64748b', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>
                        {filterUnread ? '📬 Unread Only' : '📮 All'}
                    </button>
                    <button onClick={markAllRead} style={{ padding: '0.5rem 1rem', background: '#f0fdf4', color: '#22c55e', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>✓ Mark All Read</button>
                    <button onClick={() => setShowSend(true)} style={btnPrimary}>+ Send Notification</button>
                </div>
            </div>

            {loading ? <p>Loading...</p> : (
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                    {notifications.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', background: '#f8fafc', borderRadius: '12px', color: '#94a3b8' }}>No notifications</div>
                    ) : notifications.map(n => (
                        <div key={n.id} style={{
                            display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem',
                            background: n.is_read ? '#fff' : '#fefce8', borderRadius: '10px', border: '1px solid #e2e8f0',
                            cursor: 'pointer', transition: 'all 0.2s',
                        }} onClick={() => !n.is_read && markRead(n.id)}>
                            <span style={{ fontSize: '1.5rem' }}>{typeIcon[n.type] || '📢'}</span>
                            <div style={{ flex: 1 }}>
                                <h4 style={{ fontWeight: '600', color: '#1e293b', fontSize: '0.95rem' }}>{n.title}</h4>
                                <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.15rem' }}>{n.message}</p>
                                <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{new Date(n.created_at).toLocaleString()}</span>
                            </div>
                            {!n.is_read && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6366f1' }}></span>}
                            <button onClick={e => { e.stopPropagation(); deleteNotif(n.id); }}
                                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
                        </div>
                    ))}
                </div>
            )}

            {showSend && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: '#fff', borderRadius: '16px', padding: '2rem', width: '450px' }}>
                        <h2 style={{ fontWeight: '700', marginBottom: '1.5rem' }}>Send Notification</h2>
                        <form onSubmit={handleSend} style={{ display: 'grid', gap: '1rem' }}>
                            <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required style={inputStyle} />
                            <textarea placeholder="Message" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={3} required style={{ ...inputStyle, resize: 'vertical' }} />
                            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={inputStyle}>
                                <option value="general">General</option>
                                <option value="attendance">Attendance</option>
                                <option value="fee">Fee Reminder</option>
                                <option value="homework">Homework</option>
                                <option value="result">Result</option>
                                <option value="emergency">Emergency</option>
                            </select>
                            <input placeholder="User IDs (comma separated)" onChange={e => setForm({ ...form, user_ids: e.target.value.split(',').map(v => v.trim()).filter(Boolean) })} required style={inputStyle} />
                            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                                <button type="button" onClick={() => setShowSend(false)} style={{ padding: '0.5rem 1.5rem', background: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" style={btnPrimary}>Send</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notifications;
