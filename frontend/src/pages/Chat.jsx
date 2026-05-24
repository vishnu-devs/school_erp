import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';

const Chat = () => {
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEnd = useRef(null);

    useEffect(() => { fetchConversations(); }, []);
    useEffect(() => { messagesEnd.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    async function fetchConversations() {
        try { setLoading(true); const r = await api.get('/chat/conversations'); setConversations(r.data || []); }
        catch (e) { console.error(e); } finally { setLoading(false); }
    };

    const selectPartner = async (partner) => {
        setSelectedPartner(partner);
        try { const r = await api.get(`/chat/messages/${partner.id}`); setMessages((r.data.data || r.data || []) || []); }
        catch (e) { console.error(e); }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedPartner) return;
        try {
            await api.post('/chat/send', { receiver_id: selectedPartner.id, message: newMessage });
            setNewMessage('');
            const r = await api.get(`/chat/messages/${selectedPartner.id}`);
            setMessages((r.data.data || r.data || []) || []);
            fetchConversations();
        } catch (e) { console.error(e); }
    };

    const currentUserId = JSON.parse(localStorage.getItem('user'))?.id;

    return (
        <div style={{ padding: '2rem', height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1e293b', marginBottom: '1rem' }}>💬 Chat</h1>
            <div style={{ display: 'flex', flex: 1, gap: '1rem', minHeight: 0 }}>
                {/* Conversations List */}
                <div style={{ width: '300px', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'auto' }}>
                    <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                        <h3 style={{ fontWeight: '600', color: '#64748b', fontSize: '0.9rem' }}>Conversations</h3>
                    </div>
                    {loading ? <p style={{ padding: '1rem', color: '#94a3b8' }}>Loading...</p> : conversations.length === 0 ? (
                        <p style={{ padding: '1rem', color: '#94a3b8', textAlign: 'center' }}>No conversations yet</p>
                    ) : conversations.map(c => (
                        <div key={c.id} onClick={() => selectPartner(c)}
                            style={{
                                padding: '0.75rem 1rem', cursor: 'pointer', borderBottom: '1px solid #f1f5f9',
                                background: selectedPartner?.id === c.id ? '#eef2ff' : '#fff',
                                transition: 'background 0.2s',
                            }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '600', fontSize: '0.85rem' }}>
                                        {c.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: '600', color: '#1e293b', fontSize: '0.9rem' }}>{c.name}</p>
                                        <p style={{ color: '#94a3b8', fontSize: '0.75rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '150px' }}>
                                            {c.last_message?.message || ''}
                                        </p>
                                    </div>
                                </div>
                                {c.unread_count > 0 && (
                                    <span style={{ background: '#6366f1', color: '#fff', borderRadius: '999px', padding: '0.1rem 0.4rem', fontSize: '0.7rem', fontWeight: '600' }}>{c.unread_count}</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Messages Area */}
                <div style={{ flex: 1, background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                    {selectedPartner ? (
                        <>
                            <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '600' }}>
                                    {selectedPartner.name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p style={{ fontWeight: '600', color: '#1e293b' }}>{selectedPartner.name}</p>
                                    <p style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{selectedPartner.email}</p>
                                </div>
                            </div>
                            <div style={{ flex: 1, overflow: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {messages.map(m => {
                                    const isMine = m.sender_id === currentUserId;
                                    return (
                                        <div key={m.id} style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
                                            <div style={{
                                                maxWidth: '70%', padding: '0.6rem 1rem', borderRadius: '12px',
                                                background: isMine ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : '#f1f5f9',
                                                color: isMine ? '#fff' : '#1e293b',
                                            }}>
                                                <p style={{ fontSize: '0.9rem' }}>{m.message}</p>
                                                <p style={{ fontSize: '0.65rem', opacity: 0.7, marginTop: '0.2rem', textAlign: 'right' }}>
                                                    {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEnd} />
                            </div>
                            <form onSubmit={sendMessage} style={{ padding: '1rem', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '0.5rem' }}>
                                <input value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Type a message..."
                                    style={{ flex: 1, padding: '0.625rem 1rem', borderRadius: '999px', border: '1px solid #e2e8f0', outline: 'none' }} />
                                <button type="submit" style={{ padding: '0.625rem 1.5rem', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', borderRadius: '999px', cursor: 'pointer', fontWeight: '600' }}>Send</button>
                            </form>
                        </>
                    ) : (
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ fontSize: '3rem' }}>💬</p>
                                <p>Select a conversation to start chatting</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;
