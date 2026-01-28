import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


export const getBaseUrl = () => {
    // return 'http://10.0.2.2:5000/api/'; // Local
    return 'https://backendcinebook.onrender.com/api/';
};




const api = axios.create({
    baseURL: getBaseUrl(),
});

console.log('[API] Client initialized with baseURL:', api.defaults.baseURL);

api.interceptors.request.use(async (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    const token = await AsyncStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Automatic token refresh on 401 errors
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Check if error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // If already refreshing, queue this request
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                }).catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Get user email from storage
                const userStr = await AsyncStorage.getItem('user');
                if (!userStr) {
                    throw new Error('No user found');
                }
                const user = JSON.parse(userStr);

                console.log('[API] Token invalid, refreshing automatically...');

                let newToken = '';

                // --- MOCK USER HANDLING (Bypass Backend) ---
                if (user.id === 'google_mock_123') {
                    console.log('[API] Mock user detected, bypassing backend refresh');
                    newToken = 'mock-google-token-refreshed-' + Date.now();
                    // Simulate network delay
                    await new Promise(r => setTimeout(r, 500));
                } else {
                    // --- REAL USER HANDLING ---
                    // Call regenerate-token endpoint
                    const res = await axios.post(`${api.defaults.baseURL}auth/regenerate-token`, {
                        email: user.email
                    });
                    newToken = res.data.token;
                    // Update user in storage if backend returns updated info (optional)
                    if (res.data.user) {
                        await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
                    }
                }
                // -------------------------------------------

                // Save new token
                await AsyncStorage.setItem('token', newToken);

                // Update authorization header
                api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                originalRequest.headers.Authorization = `Bearer ${newToken}`;

                console.log('[API] Token refreshed successfully, retrying request');

                processQueue(null, newToken);
                isRefreshing = false;

                // Retry original request
                return api(originalRequest);
            } catch (refreshError) {
                console.error('[API] Token refresh failed, logging out');
                processQueue(refreshError, null);
                isRefreshing = false;

                // Clear storage and redirect to login
                await AsyncStorage.removeItem('token');
                await AsyncStorage.removeItem('user');

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);


export const searchByVibe = async (prompt: string) => {
    try {
        const response = await api.post('ai-search', { query: prompt });
        return response.data;
    } catch (error) {
        console.error('Vibe Search Error:', error);
        throw error;
    }
};

export default api;
