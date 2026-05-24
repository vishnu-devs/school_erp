import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Transport = () => {
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ route_name: '', vehicle_number: '', driver_name: '', driver_phone: '', pickup_points: '' });

    useEffect(() => { fetchRoutes(); }, []);

    async function fetchRoutes() {
        try { setLoading(true); const r = await api.get('/transport'); setRoutes((r.data.data || r.data || []) || []); }
        catch (e) { console.error(e); } finally { setLoading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = { ...form, pickup_points: form.pickup_points.split(',').map(p => p.trim()).filter(Boolean) };
        try {
            editingId ? await api.put(`/transport/${editingId}`, data) : await api.post('/transport', data);
            setShowModal(false); setEditingId(null);
            setForm({ route_name: '', vehicle_number: '', driver_name: '', driver_phone: '', pickup_points: '' }); fetchRoutes();
        } catch (e) { console.error(e); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this route?')) return;
        try { await api.delete(`/transport/${id}`); fetchRoutes(); } catch (e) { console.error(e); }
    };

    const inputStyle = { padding: '0.625rem', borderRadius: '8px', border: '1px solid #e2e8f0', width: '100%', boxSizing: 'border-box' };
    const btnPrimary = { padding: '0.5rem 1.5rem', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' };

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1e293b' }}>🚌 Transport</h1>
                <button onClick={() => { setShowModal(true); setEditingId(null); setForm({ route_name: '', vehicle_number: '', driver_name: '', driver_phone: '', pickup_points: '' }); }} style={btnPrimary}>+ Add Route</button>
            </div>

            {loading ? <p>Loading...</p> : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(350px,1fr))', gap: '1rem' }}>
                    {routes.map(r => (
                        <div key={r.id} style={{ background: '#fff', borderRadius: '12px', padding: '1.25rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <h3 style={{ fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>🛣️ {r.route_name}</h3>
                                <span style={{ padding: '0.2rem 0.5rem', borderRadius: '999px', fontSize: '0.75rem', background: '#eef2ff', color: '#6366f1', fontWeight: '600' }}>
                                    {r.students_count || 0} students
                                </span>
                            </div>
                            <div style={{ display: 'grid', gap: '0.35rem', fontSize: '0.875rem', color: '#64748b' }}>
                                <span>🚗 Vehicle: {r.vehicle_number}</span>
                                <span>👤 Driver: {r.driver_name}</span>
                                <span>📱 Phone: {r.driver_phone}</span>
                                {r.pickup_points && Array.isArray(r.pickup_points) && r.pickup_points.length > 0 && (
                                    <div style={{ marginTop: '0.5rem' }}>
                                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Pickup Points:</span>
                                        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                                            {r.pickup_points.map((p, i) => (
                                                <span key={i} style={{ padding: '0.15rem 0.5rem', background: '#f1f5f9', borderRadius: '999px', fontSize: '0.75rem', color: '#64748b' }}>📍 {p}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                <button onClick={() => { setForm({ route_name: r.route_name, vehicle_number: r.vehicle_number, driver_name: r.driver_name, driver_phone: r.driver_phone, pickup_points: Array.isArray(r.pickup_points) ? r.pickup_points.join(', ') : '' }); setEditingId(r.id); setShowModal(true); }}
                                    style={{ padding: '0.3rem 0.7rem', background: '#eef2ff', color: '#6366f1', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>Edit</button>
                                <button onClick={() => handleDelete(r.id)}
                                    style={{ padding: '0.3rem 0.7rem', background: '#fef2f2', color: '#ef4444', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: '#fff', borderRadius: '16px', padding: '2rem', width: '420px' }}>
                        <h2 style={{ fontWeight: '700', marginBottom: '1.5rem' }}>{editingId ? 'Edit' : 'Add'} Route</h2>
                        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
                            <input placeholder="Route Name" value={form.route_name} onChange={e => setForm({ ...form, route_name: e.target.value })} required style={inputStyle} />
                            <input placeholder="Vehicle Number" value={form.vehicle_number} onChange={e => setForm({ ...form, vehicle_number: e.target.value })} required style={inputStyle} />
                            <input placeholder="Driver Name" value={form.driver_name} onChange={e => setForm({ ...form, driver_name: e.target.value })} required style={inputStyle} />
                            <input placeholder="Driver Phone" value={form.driver_phone} onChange={e => setForm({ ...form, driver_phone: e.target.value })} required style={inputStyle} />
                            <input placeholder="Pickup Points (comma separated)" value={form.pickup_points} onChange={e => setForm({ ...form, pickup_points: e.target.value })} style={inputStyle} />
                            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '0.5rem 1.5rem', background: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" style={btnPrimary}>{editingId ? 'Update' : 'Add'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Transport;
