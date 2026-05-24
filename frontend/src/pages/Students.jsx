import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

const Students = () => {
    const { user } = useSelector((state) => state.auth);
    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    async function fetchData() {
        setLoading(true);
        try {
            const [studentsRes, classesRes] = await Promise.all([
                api.get('/students'),
                api.get('/classes')
            ]);
            setStudents((studentsRes.data.data || studentsRes.data || []));
            setClasses((classesRes.data.data || classesRes.data || []));
        } catch (error) {
            console.error('Error fetching data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const onSubmit = async (data) => {
        try {
            await api.post('/students', { ...data, school_id: user.school_id });
            setShowModal(false);
            reset();
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Error creating student');
        }
    };

    const deleteStudent = async (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await api.delete(`/students/${id}`);
                fetchData();
            } catch (error) {
                alert('Error deleting student');
            }
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">Student Management</h1>
                    <p className="text-sm text-slate-500 font-medium">Manage student admissions and records.</p>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all font-bold flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
                    Add Student
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            ) : students.length > 0 ? (
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Name</th>
                                    <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Class</th>
                                    <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Admission No</th>
                                    <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {students.map((student) => (
                                    <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-5 font-bold text-slate-800">{student.user?.name}</td>
                                        <td className="px-8 py-5 text-sm text-slate-600">{student.student_class?.class_name} ({student.student_class?.section})</td>
                                        <td className="px-8 py-5 text-sm font-mono text-slate-500">{student.admission_no}</td>
                                        <td className="px-8 py-5 text-right">
                                            <button 
                                                onClick={() => deleteStudent(student.id)}
                                                className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-xl transition-all"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                            </button>
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
                </div>
            )}

            {/* Add Student Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl p-8 overflow-y-auto max-h-[90vh]">
                        <h2 className="text-2xl font-black text-slate-900 mb-8">Add New Student</h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Full Name</label>
                                    <input {...register("name", { required: true })} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-indigo-100 transition-all font-medium" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Email</label>
                                    <input {...register("email", { required: true })} type="email" className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-indigo-100 transition-all font-medium" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Password</label>
                                    <input {...register("password", { required: true })} type="password" className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-indigo-100 transition-all font-medium" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Admission No</label>
                                    <input {...register("admission_no", { required: true })} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-indigo-100 transition-all font-medium" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Class</label>
                                    <select {...register("class_id", { required: true })} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-indigo-100 transition-all font-medium">
                                        <option value="">Select Class</option>
                                        {classes.map(c => <option key={c.id} value={c.id}>{c.class_name} ({c.section})</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-slate-100 text-slate-600 font-bold py-4 rounded-2xl">Cancel</button>
                                <button type="submit" className="flex-1 bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-200">Save Student</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Students;
