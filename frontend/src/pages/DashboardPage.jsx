import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { appsApi } from '../api';
import { Link, Navigate } from 'react-router-dom';
import { FileText, CheckCircle, Clock, XCircle, AlertCircle, User, Edit3, ChevronRight } from 'lucide-react';

const STATUS_INFO = {
    'Draft': { icon: Edit3, color: 'text-gray-500', bg: 'bg-gray-100' },
    'Submitted': { icon: Clock, color: 'text-blue-500', bg: 'bg-blue-100' },
    'Under Review': { icon: AlertCircle, color: 'text-yellow-500', bg: 'bg-yellow-100' },
    'Approved': { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-100' },
    'Rejected': { icon: XCircle, color: 'text-red-500', bg: 'bg-red-100' },
    'Pending Documents': { icon: FileText, color: 'text-orange-500', bg: 'bg-orange-100' },
};

export default function DashboardPage() {
    const { user, updateUser, loading: authLoading } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loadingApps, setLoadingApps] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [profile, setProfile] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (user) {
            setProfile({
                full_name: user.full_name || '',
                age: user.age || '',
                gender: user.gender || '',
                state: user.state || '',
                income: user.income || '',
                occupation: user.occupation || '',
                category: user.category || '',
            });
            appsApi.list().then(setApplications).finally(() => setLoadingApps(false));
        }
    }, [user]);

    if (authLoading) return <div className="flex items-center justify-center min-h-screen"><div className="text-center"><div className="text-3xl animate-bounce">🏛️</div></div></div>;
    if (!user) return <Navigate to="/login" replace />;

    const saveProfile = async () => {
        setSaving(true);
        try {
            await updateUser({ ...profile, age: parseInt(profile.age) || null, income: parseFloat(profile.income) || null });
            setEditMode(false);
        } catch (e) { console.error(e); }
        finally { setSaving(false); }
    };

    const statusCounts = applications.reduce((acc, a) => {
        acc[a.status] = (acc[a.status] || 0) + 1;
        return acc;
    }, {});

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900">My Dashboard</h1>
                <p className="text-gray-500 mt-1">Manage your profile and track applications</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile card */}
                <div className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold text-gray-900">👤 My Profile</h2>
                        <button
                            onClick={() => editMode ? saveProfile() : setEditMode(true)}
                            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${editMode ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
                            disabled={saving}
                        >
                            {saving ? 'Saving...' : editMode ? '✓ Save' : '✏️ Edit'}
                        </button>
                    </div>

                    {/* Avatar */}
                    <div className="flex flex-col items-center mb-5">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center text-white text-2xl font-black shadow-md mb-2">
                            {user.full_name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        {!editMode && <p className="font-bold text-gray-900">{user.full_name}</p>}
                        <p className="text-xs text-gray-500">{user.email}</p>
                    </div>

                    <div className="space-y-3">
                        {editMode ? (
                            <>
                                {[
                                    { label: 'Full Name', key: 'full_name', type: 'text' },
                                    { label: 'Age', key: 'age', type: 'number' },
                                    { label: 'Annual Income (₹)', key: 'income', type: 'number' },
                                ].map(f => (
                                    <div key={f.key}>
                                        <label className="label">{f.label}</label>
                                        <input
                                            type={f.type}
                                            value={profile[f.key]}
                                            onChange={e => setProfile(p => ({ ...p, [f.key]: e.target.value }))}
                                            className="input"
                                        />
                                    </div>
                                ))}
                                <div>
                                    <label className="label">Gender</label>
                                    <select value={profile.gender} onChange={e => setProfile(p => ({ ...p, gender: e.target.value }))} className="input">
                                        <option value="">Select</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="label">Occupation</label>
                                    <input value={profile.occupation} onChange={e => setProfile(p => ({ ...p, occupation: e.target.value }))} className="input" placeholder="e.g. farmer" />
                                </div>
                                <div>
                                    <label className="label">Category</label>
                                    <select value={profile.category} onChange={e => setProfile(p => ({ ...p, category: e.target.value }))} className="input">
                                        <option value="">Select</option>
                                        {['General', 'SC', 'ST', 'OBC', 'Minority', 'EWS'].map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <button onClick={() => setEditMode(false)} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Cancel</button>
                            </>
                        ) : (
                            <div className="space-y-2 text-sm">
                                {[
                                    { label: 'Age', value: user.age },
                                    { label: 'Gender', value: user.gender },
                                    { label: 'State', value: user.state },
                                    { label: 'Occupation', value: user.occupation },
                                    { label: 'Category', value: user.category },
                                    { label: 'Annual Income', value: user.income ? `₹${Number(user.income).toLocaleString()}` : null },
                                ].map(f => f.value ? (
                                    <div key={f.label} className="flex justify-between text-gray-700">
                                        <span className="text-gray-500">{f.label}</span>
                                        <span className="font-semibold capitalize">{f.value}</span>
                                    </div>
                                ) : null)}
                                {!user.age && !user.occupation && (
                                    <p className="text-xs text-gray-400 text-center py-2">
                                        Complete your profile for better scheme recommendations
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="mt-5 pt-4 border-t border-gray-100">
                        <Link to="/eligibility" className="btn-primary w-full text-center text-sm block">
                            🤖 Check My Eligibility
                        </Link>
                    </div>
                </div>

                {/* Applications */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { label: 'Total Applied', value: applications.length, color: 'text-blue-700', bg: 'bg-blue-50' },
                            { label: 'Approved', value: statusCounts['Approved'] || 0, color: 'text-green-700', bg: 'bg-green-50' },
                            { label: 'Under Review', value: (statusCounts['Submitted'] || 0) + (statusCounts['Under Review'] || 0), color: 'text-yellow-700', bg: 'bg-yellow-50' },
                        ].map(s => (
                            <div key={s.label} className={`card p-4 text-center ${s.bg}`}>
                                <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
                                <div className="text-xs text-gray-600 font-medium mt-0.5">{s.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Applications list */}
                    <div className="card p-6">
                        <h2 className="font-bold text-gray-900 mb-4">📋 My Applications</h2>
                        {loadingApps ? (
                            <div className="space-y-3">
                                {[0, 1, 2].map(i => <div key={i} className="h-16 bg-gray-50 rounded-xl animate-pulse" />)}
                            </div>
                        ) : applications.length === 0 ? (
                            <div className="text-center py-10">
                                <div className="text-4xl mb-2">📭</div>
                                <p className="text-gray-500 font-medium">No applications yet</p>
                                <p className="text-sm text-gray-400 mt-1">Browse schemes and apply to get started</p>
                                <Link to="/schemes" className="btn-primary mt-4 text-sm">Browse Schemes</Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {applications.map(app => {
                                    const cfg = STATUS_INFO[app.status] || STATUS_INFO['Draft'];
                                    return (
                                        <div key={app.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
                                            <div className={`w-9 h-9 rounded-xl ${cfg.bg} flex items-center justify-center`}>
                                                <cfg.icon size={16} className={cfg.color} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <Link to={`/scheme/${app.scheme_id}`} className="font-semibold text-gray-900 text-sm hover:text-blue-600 transition-colors block truncate">
                                                    Scheme #{app.scheme_id}
                                                </Link>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    Applied {new Date(app.created_at).toLocaleDateString('en-IN')}
                                                </p>
                                            </div>
                                            <span className={`badge ${cfg.bg.replace('bg-', 'bg-').replace('-100', '-100')} ${cfg.color}`}>
                                                {app.status}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
