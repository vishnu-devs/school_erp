import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

const Teachers = () => {
    const { user } = useSelector((state) => state.auth);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    async function fetchTeachers() {
        setLoading(true);
        try {
            const response = await api.get('/teachers');
            setTeachers((response.data.data || response.data || []));
        } catch (error) {
            console.error('Error fetching teachers:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    const onSubmit = async (data) => {
        try {
            await api.post('/teachers', { ...data, school_id: user.school_id });
            setShowModal(false);
            reset();
            fetchTeachers();
        } catch (error) {
            alert(error.response?.data?.message || 'Error creating teacher');
        }
    };

    const deleteTeacher = async (id) => {
        if (window.confirm('Are you sure you want to delete this teacher?')) {
            try {
                await api.delete(`/teachers/${id}`);
                fetchTeachers();
            } catch (error) {
                alert('Error deleting teacher');
            }
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">Teacher Management</h1>
                    <p className="text-sm text-slate-500 font-medium">Manage faculty members and their assignments.</p>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all font-bold flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
                    Add Teacher
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            ) : teachers.length > 0 ? (
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Name</th>
                                    <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Email</th>
                                    <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Employee ID</th>
                                    <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {teachers.map((teacher) => (
                                    <tr key={teacher.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                                                    {teacher.user?.name?.charAt(0) || 'U'}
                                                </div>
                                                <span className="font-bold text-slate-800">{teacher.user?.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-sm text-slate-600">{teacher.user?.email}</td>
                                        <td className="px-8 py-5 text-sm font-mono text-slate-500">{teacher.employee_id}</td>
                                        <td className="px-8 py-5 text-right">
                                            <button 
                                                onClick={() => deleteTeacher(teacher.id)}
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
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">No teachers found</h3>
                    <p className="text-slate-500 mt-2">Get started by adding your first faculty member.</p>
                </div>
            )}

            {/* Add Teacher Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl p-8 overflow-y-auto max-h-[90vh]">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-slate-900">Add New Teacher</h2>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Full Name</label>
                                    <input {...register("name", { required: true })} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-indigo-100 transition-all font-medium" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                                    <input {...register("email", { required: true })} type="email" className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-indigo-100 transition-all font-medium" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Password</label>
                                    <input {...register("password", { required: true })} type="password" className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-indigo-100 transition-all font-medium" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Employee ID</label>
                                    <input {...register("employee_id", { required: true })} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-indigo-100 transition-all font-medium" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Qualification</label>
                                    <input {...register("qualification")} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-indigo-100 transition-all font-medium" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Salary</label>
                                    <input {...register("salary")} type="number" className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-indigo-100 transition-all font-medium" />
                                </div>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-slate-100 text-slate-600 font-bold py-4 rounded-2xl hover:bg-slate-200 transition-colors">Cancel</button>
                                <button type="submit" className="flex-1 bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200">Save Teacher</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Teachers;
