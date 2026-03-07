const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

function getToken() {
    return localStorage.getItem('token');
}

async function apiFetch(path, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
    };
    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: 'Request failed' }));
        throw new Error(err.detail || 'Request failed');
    }
    return res.json();
}

// Auth
export const authApi = {
    register: (data) => apiFetch('/api/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    login: (email, password) => {
        const form = new URLSearchParams({ username: email, password });
        return fetch(`${API_BASE}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: form,
        }).then(r => r.json());
    },
    me: () => apiFetch('/api/auth/me'),
    updateMe: (data) => apiFetch('/api/auth/me', { method: 'PUT', body: JSON.stringify(data) }),
};

// Schemes
export const schemesApi = {
    list: (params = {}) => {
        const q = new URLSearchParams(params).toString();
        return apiFetch(`/api/schemes/?${q}`);
    },
    trending: () => apiFetch('/api/schemes/trending'),
    get: (id) => apiFetch(`/api/schemes/${id}`),
    categories: () => apiFetch('/api/schemes/categories'),
};

// Eligibility
export const eligibilityApi = {
    check: (profile) => apiFetch('/api/eligibility/check', { method: 'POST', body: JSON.stringify(profile) }),
    recommend: (profile) => apiFetch('/api/eligibility/recommend', { method: 'POST', body: JSON.stringify(profile) }),
};

// Applications
export const appsApi = {
    list: () => apiFetch('/api/applications/'),
    create: (data) => apiFetch('/api/applications/', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => apiFetch(`/api/applications/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

// Chatbot
export const chatbotApi = {
    send: (message) => apiFetch('/api/chatbot/message', { method: 'POST', body: JSON.stringify({ message }) }),
};
