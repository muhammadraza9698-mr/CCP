import axios from 'axios';

// Get API URL from environment variable (required)
const API_URL = process.env.REACT_APP_API_URL;

if (!API_URL) {
    throw new Error(
        'REACT_APP_API_URL environment variable is not set. ' +
        'Please create a .env file in the frontend directory with: REACT_APP_API_URL=http://localhost:5001'
    );
}

// Create axios instance with base configuration
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Include credentials in CORS requests
});

// Add request interceptor to include auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// SWR fetcher function
export const fetcher = (url) => api.get(url).then((res) => res.data);

// API endpoints
export const endpoints = {
    // Auth
    register: '/api/auth/register',
    login: '/api/auth/login',
    me: '/api/auth/me',

    // Products
    products: '/api/products',
    product: (id) => `/api/products/${id}`,

    // Cart
    cart: '/api/cart',
    cartAdd: '/api/cart/add',
    cartUpdate: (productId) => `/api/cart/update/${productId}`,
    cartRemove: (productId) => `/api/cart/remove/${productId}`,
    cartClear: '/api/cart/clear',

    // Orders
    orders: '/api/orders',
    myOrders: '/api/orders/my-orders',
    order: (id) => `/api/orders/${id}`,
    orderStatus: (id) => `/api/orders/${id}/status`,
};

export default api;
