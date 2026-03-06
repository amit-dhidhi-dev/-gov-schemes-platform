import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            authApi.me()
                .then(setUser)
                .catch(() => localStorage.removeItem('token'))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        const data = await authApi.login(email, password);
        if (data.access_token) {
            localStorage.setItem('token', data.access_token);
            const me = await authApi.me();
            setUser(me);
            return me;
        }
        throw new Error(data.detail || 'Login failed');
    };

    const register = async (userData) => {
        const me = await authApi.register(userData);
        await login(userData.email, userData.password);
        return me;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const updateUser = async (data) => {
        const updated = await authApi.updateMe(data);
        setUser(updated);
        return updated;
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
