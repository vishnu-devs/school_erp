import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Attendance = () => {
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [students, setStudents] = useState([]);
    const [attendanceData, setAttendanceData] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchClasses() {
            try {
                const response = await api.get('/classes');
                setClasses((response.data.data || response.data || []));
            } catch (error) {
                console.error('Error fetching classes');
            }
        };
        fetchClasses();
    }, []);

    async function fetchStudentsAndAttendance() {
        if (!selectedClass) return;
        setLoading(true);
        try {
            // Fetch students for the class (simulated with /students?class_id=X if implemented)
            const studentsRes = await api.get('/students'); // Simplification for demo
            const filteredStudents = (studentsRes.data.data || studentsRes.data || []).filter(s => s.class_id === parseInt(selectedClass));
            setStudents(filteredStudents);

            // Fetch existing attendance
            const attendanceRes = await api.get(`/attendance/list?class_id=${selectedClass}&attendance_date=${date}`);
            const existing = {};
            attendanceRes.data.forEach(a => {
                existing[a.student_id] = a.status;
            });
            
            // Set initial attendance state
            const initial = {};
            filteredStudents.forEach(s => {
                initial[s.id] = existing[s.id] || 'Present';
            });
            setAttendanceData(initial);
        } catch (error) {
            console.error('Error fetching data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudentsAndAttendance();
    }, [selectedClass, date]);

    const handleStatusChange = (studentId, status) => {
        setAttendanceData(prev => ({ ...prev, [studentId]: status }));
    };

    const submitAttendance = async () => {
        const payload = {
            class_id: selectedClass,
            attendance_date: date,
            attendance: Object.entries(attendanceData).map(([id, status]) => ({
                student_id: id,
                status: status
            }))
        };

        try {
            await api.post('/attendance/mark', payload);
            alert('Attendance marked successfully!');
        } catch (error) {
            alert('Error marking attendance');
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">Attendance Tracking</h1>
                    <p className="text-sm text-slate-500 font-medium">Daily attendance management for students.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <select 
                        value={selectedClass} 
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="bg-white border-slate-200 rounded-xl px-4 py-2 shadow-sm text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-100"
                    >
                        <option value="">Select Class</option>
                        {classes.map(c => <option key={c.id} value={c.id}>{c.class_name} ({c.section})</option>)}
                    </select>
                    <input 
                        type="date" 
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="bg-white border-slate-200 rounded-xl px-4 py-2 shadow-sm text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-100" 
                    />
                    {selectedClass && (
                        <button 
                            onClick={submitAttendance}
                            className="bg-indigo-600 text-white px-6 py-2.5 rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all font-bold"
                        >
                            Save Attendance
                        </button>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            ) : selectedClass && students.length > 0 ? (
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Roll No</th>
                                    <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Student Name</th>
                                    <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {students.map((student) => (
                                    <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-5 text-sm font-black text-slate-400">#{student.roll_number || student.id}</td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-500">
                                                    {student.user?.name?.charAt(0) || 'U'}
                                                </div>
                                                <span className="font-bold text-slate-800">{student.user?.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex gap-2">
                                                {['Present', 'Absent', 'Leave'].map(status => (
                                                    <button
                                                        key={status}
                                                        onClick={() => handleStatusChange(student.id, status)}
                                                        className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${attendanceData[student.id] === status ? 
                                                            (status === 'Present' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 
                                                             status === 'Absent' ? 'bg-red-600 text-white shadow-lg shadow-red-200' : 
                                                             'bg-amber-500 text-white shadow-lg shadow-amber-200') : 
                                                            'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                                                    >
                                                        {status}
                                                    </button>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-20 text-center">
                    <h3 className="text-xl font-bold text-slate-800">No students found</h3>
                    <p className="text-slate-500 mt-2">Select a class or add students to that class first.</p>
                </div>
            )}
        </div>
    );
};

export default Attendance;
