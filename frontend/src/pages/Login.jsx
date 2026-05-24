import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { loginSuccess } from '../redux/slices/authSlice';

const Login = () => {
    const { register, handleSubmit, formState: { errors }, getValues } = useForm();
    const [loading, setLoading] = useState(false);
    const [authError, setAuthError] = useState('');
    const [needs2FA, setNeeds2FA] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        setLoading(true);
        setAuthError('');
        try {
            const response = await api.post('/login', data);
            dispatch(loginSuccess(response.data));
            
            // Route dynamically based on user role
            if (response.data.user.school_id === null) {
                navigate('/platform/dashboard');
            } else {
                navigate('/admin/dashboard');
            }
        } catch (error) {
            if (error.response?.data?.requires_2fa) {
                setNeeds2FA(true);
                setAuthError('');
            } else {
                setAuthError(error.response?.data?.message || 'Login failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md w-full mx-auto p-8 bg-white/80 backdrop-blur-md shadow-2xl rounded-2xl border border-white/20">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-extrabold text-slate-900 mb-2">School ERP</h1>
                <p className="text-slate-500">Sign in to your account</p>
            </div>

            {authError && (
                <div className="mb-4 p-3 rounded bg-red-50 text-red-600 text-sm border border-red-100 text-center">
                    {authError}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {!needs2FA ? (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                            <input 
                                type="email" 
                                {...register("email", { required: "Email is required" })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all bg-slate-50 focus:bg-white outline-none"
                                placeholder="admin@school.com"
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                            <input 
                                type="password" 
                                {...register("password", { required: "Password is required" })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all bg-slate-50 focus:bg-white outline-none"
                                placeholder="••••••••"
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                        </div>
                    </>
                ) : (
                    <div className="animate-in fade-in zoom-in-95 duration-300">
                        <label className="block text-sm font-bold text-slate-700 mb-2 text-center">Enter Authenticator Code</label>
                        <input 
                            type="text" 
                            maxLength="6"
                            {...register("otp", { required: "6-digit code is required" })}
                            className="w-full text-center text-2xl tracking-widest px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all bg-slate-50 focus:bg-white outline-none"
                            placeholder="000000"
                        />
                        {errors.otp && <p className="text-red-500 text-xs mt-1 text-center">{errors.otp.message}</p>}
                        <button type="button" onClick={() => setNeeds2FA(false)} className="text-indigo-600 text-sm mt-3 w-full text-center hover:underline">
                            Cancel
                        </button>
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-indigo-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {loading ? (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : 'Sign In'}
                </button>
            </form>
        </div>
    );
};

export default Login;
