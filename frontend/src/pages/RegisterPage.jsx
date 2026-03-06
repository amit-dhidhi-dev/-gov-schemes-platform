import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const STATES = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu & Kashmir'];

export default function RegisterPage() {
    const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '', state: '', occupation: '', income: '', category: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await register({
                ...form,
                income: form.income ? parseFloat(form.income) : null,
            });
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-lg">
                <div className="card p-8">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg">🏛️</div>
                        <h1 className="text-2xl font-black text-gray-900">Create your account</h1>
                        <p className="text-gray-500 text-sm mt-1">Get personalized scheme recommendations instantly</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">{error}</div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="label">Full Name *</label>
                                <input type="text" placeholder="Ramesh Kumar" value={form.full_name} onChange={e => set('full_name', e.target.value)} className="input" required />
                            </div>
                            <div>
                                <label className="label">Phone *</label>
                                <input type="tel" placeholder="9876543210" value={form.phone} onChange={e => set('phone', e.target.value)} className="input" required />
                            </div>
                        </div>

                        <div>
                            <label className="label">Email Address *</label>
                            <input type="email" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} className="input" required />
                        </div>

                        <div>
                            <label className="label">Password *</label>
                            <input type="password" placeholder="Minimum 6 characters" value={form.password} onChange={e => set('password', e.target.value)} className="input" required minLength={6} />
                        </div>

                        {/* Optional profile for better matching */}
                        <div className="border-t border-gray-100 pt-4">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Profile (Optional – for better scheme matching)</p>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="label">State</label>
                                    <select value={form.state} onChange={e => set('state', e.target.value)} className="input">
                                        <option value="">Select</option>
                                        {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="label">Occupation</label>
                                    <select value={form.occupation} onChange={e => set('occupation', e.target.value)} className="input">
                                        <option value="">Select</option>
                                        {['farmer', 'student', 'business', 'salaried', 'self-employed', 'unemployed', 'homemaker'].map(o => (
                                            <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="label">Category</label>
                                    <select value={form.category} onChange={e => set('category', e.target.value)} className="input">
                                        <option value="">Select</option>
                                        {['General', 'SC', 'ST', 'OBC', 'Minority', 'EWS'].map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="label">Annual Income (₹)</label>
                                    <input type="number" placeholder="e.g. 150000" value={form.income} onChange={e => set('income', e.target.value)} className="input" />
                                </div>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Creating account...
                                </span>
                            ) : '🚀 Create Account & Get Started'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-600 mt-5">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-600 font-semibold hover:underline">Sign in</Link>
                    </p>
                </div>
                <p className="text-center mt-4">
                    <Link to="/" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">← Back to Home</Link>
                </p>
            </div>
        </div>
    );
}
