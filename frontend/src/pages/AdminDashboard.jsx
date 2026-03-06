import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { appsApi, schemesApi } from '../api';
import { Navigate, Link } from 'react-router-dom';
import { Shield, Users, Activity, Settings, CheckCircle, XCircle } from 'lucide-react';

export default function AdminDashboard() {
    const { user, loading: authLoading } = useAuth();
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total_users: 1500, active_schemes: 20 });

    useEffect(() => {
        if (user && user.is_agent) {
            // For demo purposes, we will fetch all applications
            // You'd typically need an admin-specific endpoint for this
            appsApi.list().then(setApps).finally(() => setLoading(false));

            // We assume there are 20 schemes from DB seeder
            schemesApi.list().then(res => setStats(prev => ({ ...prev, active_schemes: res.length || 20 })));
        }
    }, [user]);

    if (authLoading) return null;
    if (!user || !user.is_agent) return <Navigate to="/dashboard" replace />;

    const handleStatusChange = async (id, newStatus) => {
        try {
            await appsApi.update(id, { status: newStatus });
            setApps(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
        } catch (e) {
            console.error(e);
            alert('Failed to update status');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-2xl">
                    <Shield size={24} />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Admin Portal</h1>
                    <p className="text-gray-500">Manage schemes, review applications, and view analytics</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="card p-5 border-l-4 border-blue-500">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-semibold text-gray-500 mb-1">Total Applications</p>
                            <h3 className="text-3xl font-black text-gray-900">{loading ? '-' : apps.length}</h3>
                        </div>
                        <Activity className="text-blue-500" />
                    </div>
                </div>
                <div className="card p-5 border-l-4 border-green-500">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-semibold text-gray-500 mb-1">Pending Review</p>
                            <h3 className="text-3xl font-black text-gray-900">
                                {loading ? '-' : apps.filter(a => ['Submitted', 'Under Review'].includes(a.status)).length}
                            </h3>
                        </div>
                        <CheckCircle className="text-green-500" />
                    </div>
                </div>
                <div className="card p-5 border-l-4 border-purple-500">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-semibold text-gray-500 mb-1">Active Schemes</p>
                            <h3 className="text-3xl font-black text-gray-900">{stats.active_schemes}</h3>
                        </div>
                        <Settings className="text-purple-500" />
                    </div>
                </div>
                <div className="card p-5 border-l-4 border-orange-500">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-semibold text-gray-500 mb-1">Total Users</p>
                            <h3 className="text-3xl font-black text-gray-900">{stats.total_users}</h3>
                        </div>
                        <Users className="text-orange-500" />
                    </div>
                </div>
            </div>

            <div className="card p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Application Review Queue</h2>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-xl" />)}
                    </div>
                ) : apps.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">No applications to review.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-4 py-3">ID</th>
                                    <th className="px-4 py-3">Scheme ID</th>
                                    <th className="px-4 py-3">Date Applied</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {apps.map(app => (
                                    <tr key={app.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-4 font-semibold text-gray-900">#{app.id}</td>
                                        <td className="px-4 py-4 text-blue-600 hover:underline">
                                            <Link to={`/scheme/${app.scheme_id}`}>Scheme #{app.scheme_id}</Link>
                                        </td>
                                        <td className="px-4 py-4 text-gray-600">
                                            {new Date(app.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${app.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                                    app.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            {app.status !== 'Approved' && (
                                                <button
                                                    onClick={() => handleStatusChange(app.id, 'Approved')}
                                                    className="text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg mr-2 transition-colors"
                                                >
                                                    Approve
                                                </button>
                                            )}
                                            {app.status !== 'Rejected' && (
                                                <button
                                                    onClick={() => handleStatusChange(app.id, 'Rejected')}
                                                    className="text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                                                >
                                                    Reject
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
