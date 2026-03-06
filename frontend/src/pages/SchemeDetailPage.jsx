import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { schemesApi, appsApi } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { ExternalLink, CheckCircle, FileText, ArrowLeft, BookOpen, Building } from 'lucide-react';

export default function SchemeDetailPage() {
    const { id } = useParams();
    const [scheme, setScheme] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [applied, setApplied] = useState(false);
    const [error, setError] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        schemesApi.get(id).then(setScheme).finally(() => setLoading(false));
    }, [id]);

    const handleApply = async () => {
        if (!user) {
            setError('Please login to apply for this scheme.');
            return;
        }
        setApplying(true);
        setError('');
        try {
            await appsApi.create({ scheme_id: parseInt(id), status: 'Submitted' });
            setApplied(true);
        } catch (e) {
            setError(e.message);
        } finally {
            setApplying(false);
        }
    };

    if (loading) return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="card p-8 animate-pulse">
                <div className="h-8 bg-gray-200 rounded-lg w-3/4 mb-4" />
                <div className="h-4 bg-gray-100 rounded w-1/2 mb-8" />
                <div className="grid grid-cols-2 gap-6">
                    <div className="h-32 bg-gray-100 rounded-xl" />
                    <div className="h-32 bg-gray-100 rounded-xl" />
                </div>
            </div>
        </div>
    );

    if (!scheme) return (
        <div className="text-center py-20">
            <div className="text-5xl mb-4">😕</div>
            <h2 className="text-xl font-bold text-gray-700">Scheme not found</h2>
            <Link to="/schemes" className="btn-primary mt-4 text-sm">Browse All Schemes</Link>
        </div>
    );

    const typeColor = scheme.scheme_type === 'central' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800';

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            <Helmet>
                <title>{scheme.scheme_name} | YojanaMitra</title>
                <meta name="description" content={scheme.description} />
                <meta property="og:title" content={`${scheme.scheme_name} | YojanaMitra`} />
                <meta property="og:description" content={scheme.description} />
            </Helmet>
            {/* Back */}
            <Link to="/schemes" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 mb-5 transition-colors">
                <ArrowLeft size={16} /> Back to Schemes
            </Link>

            {/* Header card */}
            <div className="card p-8 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="flex-1">
                        <div className="flex flex-wrap gap-2 mb-3">
                            <span className={`badge ${typeColor}`}>
                                {scheme.scheme_type === 'central' ? '🏛️ Central Govt' : '🗺️ State Govt'}
                            </span>
                            {scheme.category && (
                                <span className="badge bg-green-100 text-green-700">
                                    {scheme.category.name}
                                </span>
                            )}
                            {scheme.applicable_state && (
                                <span className="badge bg-gray-100 text-gray-600">
                                    📍 {scheme.applicable_state === 'all' ? 'All India' : scheme.applicable_state}
                                </span>
                            )}
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">{scheme.scheme_name}</h1>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Building size={14} />
                            <span>{scheme.ministry}</span>
                        </div>
                    </div>
                    <div className="flex sm:flex-col gap-2">
                        <div className="flex items-center gap-1 text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg">
                            👁️ {scheme.views} views
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg">
                            📝 {scheme.applications_count} applied
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left main content */}
                <div className="md:col-span-2 space-y-6">
                    {/* Overview */}
                    <div className="card p-6">
                        <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <BookOpen size={18} className="text-blue-500" /> Scheme Overview
                        </h2>
                        <p className="text-gray-700 leading-relaxed">{scheme.description}</p>
                    </div>

                    {/* Benefits */}
                    <div className="card p-6 border-l-4 border-green-400">
                        <h2 className="font-bold text-gray-900 mb-3">🎁 Benefits</h2>
                        <p className="text-gray-700">{scheme.benefits}</p>
                    </div>

                    {/* Eligibility */}
                    <div className="card p-6">
                        <h2 className="font-bold text-gray-900 mb-4">✅ Eligibility Criteria</h2>
                        <div className="space-y-3">
                            {scheme.min_age && (
                                <div className="flex items-center gap-3 text-sm">
                                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">→</span>
                                    <span>Minimum age: <span className="font-semibold">{scheme.min_age} years</span></span>
                                </div>
                            )}
                            {scheme.max_age && (
                                <div className="flex items-center gap-3 text-sm">
                                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">→</span>
                                    <span>Maximum age: <span className="font-semibold">{scheme.max_age} years</span></span>
                                </div>
                            )}
                            {scheme.income_limit && (
                                <div className="flex items-center gap-3 text-sm">
                                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">→</span>
                                    <span>Income limit: <span className="font-semibold">₹{scheme.income_limit.toLocaleString()}/year</span></span>
                                </div>
                            )}
                            {scheme.target_occupation && (
                                <div className="flex items-center gap-3 text-sm">
                                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">→</span>
                                    <span>For: <span className="font-semibold capitalize">{scheme.target_occupation}s</span></span>
                                </div>
                            )}
                            {scheme.target_category && (
                                <div className="flex items-center gap-3 text-sm">
                                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">→</span>
                                    <span>Category: <span className="font-semibold">{scheme.target_category}</span></span>
                                </div>
                            )}
                            {scheme.target_gender && (
                                <div className="flex items-center gap-3 text-sm">
                                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">→</span>
                                    <span>Gender: <span className="font-semibold capitalize">{scheme.target_gender}</span></span>
                                </div>
                            )}
                            {!scheme.min_age && !scheme.max_age && !scheme.income_limit && !scheme.target_occupation && !scheme.target_category && !scheme.target_gender && (
                                <p className="text-sm text-gray-500">Open to all eligible Indian citizens</p>
                            )}
                        </div>
                    </div>

                    {/* Documents */}
                    <div className="card p-6">
                        <h2 className="font-bold text-gray-900 mb-4">📎 Required Documents</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {(scheme.documents_required || []).map((doc, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2">
                                    <FileText size={14} className="text-blue-500 flex-shrink-0" />
                                    {doc}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right sidebar: Apply card */}
                <div className="space-y-4">
                    <div className="card p-6 sticky top-24">
                        <h2 className="font-bold text-gray-900 mb-4">📋 Apply Now</h2>
                        {applied ? (
                            <div className="text-center py-4">
                                <CheckCircle size={48} className="text-green-500 mx-auto mb-2" />
                                <p className="font-semibold text-green-700">Application submitted!</p>
                                <p className="text-sm text-gray-500 mt-1">Track it in your Dashboard</p>
                                <Link to="/dashboard" className="btn-primary mt-4 w-full text-center text-sm block">
                                    Go to Dashboard
                                </Link>
                            </div>
                        ) : (
                            <>
                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
                                        {error}
                                        {!user && (
                                            <div className="mt-2">
                                                <Link to="/login" className="font-semibold underline">Login</Link> or{' '}
                                                <Link to="/register" className="font-semibold underline">Register</Link>
                                            </div>
                                        )}
                                    </div>
                                )}
                                <button
                                    onClick={handleApply}
                                    disabled={applying}
                                    className="btn-primary w-full text-center mb-3"
                                >
                                    {applying ? 'Submitting...' : '🚀 Apply via Platform'}
                                </button>
                                {scheme.apply_link && (
                                    <a
                                        href={scheme.apply_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-secondary w-full text-center flex items-center justify-center gap-1.5 text-sm"
                                    >
                                        <ExternalLink size={14} /> Official Website
                                    </a>
                                )}
                            </>
                        )}

                        {/* Quick info */}
                        <div className="mt-5 space-y-2 text-sm border-t border-gray-100 pt-4">
                            <div className="flex justify-between text-gray-600">
                                <span>Type</span>
                                <span className="font-semibold capitalize">{scheme.scheme_type}</span>
                            </div>
                            {scheme.applicable_state && (
                                <div className="flex justify-between text-gray-600">
                                    <span>Coverage</span>
                                    <span className="font-semibold">{scheme.applicable_state === 'all' ? 'All India' : scheme.applicable_state}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Eligibility checker */}
                    <div className="card p-5 bg-gradient-to-br from-blue-50 to-teal-50 border-blue-100">
                        <h3 className="font-semibold text-blue-900 mb-2">🤖 Not sure if you qualify?</h3>
                        <p className="text-sm text-blue-700 mb-3">Use our AI eligibility checker to find out instantly.</p>
                        <Link to="/eligibility" className="btn-primary w-full text-center text-sm block">
                            Check Eligibility
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
