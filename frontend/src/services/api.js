import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Request interceptor – attach token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor – handle 401 (expired token) & 402 (payment required)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            } else if (error.response.status === 402) {
                // Redirect to renewal screen, do NOT clear token as they need it to pay
                if (!window.location.pathname.includes('/admin/renew-subscription')) {
                    window.location.href = '/admin/renew-subscription';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
