import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Timetable = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const timeSlots = ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM'];
    
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [timetable, setTimetable] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchClasses() {
            const res = await api.get('/classes');
            setClasses((res.data.data || res.data || []));
        };
        fetchClasses();
    }, []);

    async function fetchTimetable() {
        if (!selectedClass) return;
        setLoading(true);
        try {
            const res = await api.get(`/timetable?class_id=${selectedClass}`);
            setTimetable(res.data);
        } catch (error) {
            console.error('Error fetching timetable');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTimetable();
    }, [selectedClass]);

    const getSlotData = (day, time) => {
        return timetable.find(t => t.day === day && t.start_time.startsWith(time.split(' ')[0].split(':')[0]));
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">Academic Timetable</h1>
                    <p className="text-sm text-slate-500 font-medium">Weekly schedule for classes and teachers.</p>
                </div>
                <div className="flex gap-4">
                    <select 
                        value={selectedClass} 
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="bg-white border-slate-200 rounded-xl px-4 py-2 shadow-sm text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-100"
                    >
                        <option value="">Select Class</option>
                        {classes.map(c => <option key={c.id} value={c.id}>{c.class_name} ({c.section})</option>)}
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-6 py-6 text-xs font-black text-slate-400 uppercase tracking-widest text-left border-r border-slate-100">Time</th>
                                {days.map(day => (
                                    <th key={day} className="px-6 py-6 text-xs font-black text-slate-900 uppercase tracking-widest text-center">{day}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {timeSlots.map(slot => (
                                <tr key={slot} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-10 text-sm font-black text-slate-400 border-r border-slate-100">{slot}</td>
                                    {days.map(day => {
                                        const session = getSlotData(day, slot);
                                        return (
                                            <td key={day} className="px-4 py-6 min-w-[150px]">
                                                {session ? (
                                                    <div className="bg-indigo-50 border-l-4 border-indigo-600 p-3 rounded-r-xl shadow-sm">
                                                        <p className="text-xs font-black text-indigo-600 uppercase mb-1">{session.subject?.subject_name}</p>
                                                        <p className="text-xs font-bold text-slate-700">{session.teacher?.user?.name}</p>
                                                        <p className="text-[10px] text-slate-400 mt-2 font-mono">Room: {session.room_number}</p>
                                                    </div>
                                                ) : (
                                                    <div className="w-full h-20 bg-slate-50/50 rounded-xl border-2 border-dashed border-slate-100 flex items-center justify-center">
                                                        <span className="text-[10px] font-bold text-slate-300">No Session</span>
                                                    </div>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Timetable;
