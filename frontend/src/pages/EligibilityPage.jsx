import React, { useState } from 'react';
import { eligibilityApi } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle, XCircle, AlertCircle, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const OCCUPATIONS = ['farmer', 'student', 'business', 'salaried', 'self-employed', 'unemployed', 'homemaker', 'daily wage'];
const CATEGORIES = ['General', 'SC', 'ST', 'OBC', 'Minority', 'EWS'];
const EDUCATIONS = ['No formal education', 'Primary', 'Secondary (10th)', 'Higher Secondary (12th)', 'Graduate', 'Postgraduate'];
const STATES = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu & Kashmir'];

const STATUS_CONFIG = {
    eligible: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50 border-green-200', label: '✅ Eligible', badge: 'bg-green-100 text-green-700' },
    partially_eligible: { icon: AlertCircle, color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200', label: '⚠️ Partially Eligible', badge: 'bg-yellow-100 text-yellow-700' },
    not_eligible: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50 border-red-200', label: '❌ Not Eligible', badge: 'bg-red-100 text-red-600' },
};

function ResultCard({ result }) {
    const [open, setOpen] = useState(false);
    const cfg = STATUS_CONFIG[result.status] || STATUS_CONFIG.not_eligible;

    return (
        <div className={`card p-4 border ${cfg.bg} transition-all`}>
            <div className="flex items-center justify-between gap-3 cursor-pointer" onClick={() => setOpen(!open)}>
                <div className="flex items-center gap-3">
                    <cfg.icon size={20} className={cfg.color} />
                    <div>
                        <p className="font-semibold text-gray-900 text-sm">{result.scheme_name}</p>
                        <span className={`badge ${cfg.badge} mt-0.5`}>{cfg.label}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="text-right hidden sm:block">
                        <div className="text-xs text-gray-500">Match Score</div>
                        <div className="font-bold text-gray-800">{Math.round(result.score * 100)}%</div>
                    </div>
                    {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                </div>
            </div>
            {open && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="space-y-1.5 mb-3">
                        {result.reasons.map((r, i) => (
                            <p key={i} className="text-xs text-gray-700 flex gap-2">
                                <span>{r}</span>
                            </p>
                        ))}
                    </div>
                    <Link
                        to={`/scheme/${result.scheme_id}`}
                        className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
                    >
                        View Scheme Details <ArrowRight size={12} />
                    </Link>
                </div>
            )}
        </div>
    );
}

export default function EligibilityPage() {
    const { user, updateUser } = useAuth();
    const [profile, setProfile] = useState({
        age: user?.age || '',
        gender: user?.gender || '',
        state: user?.state || '',
        income: user?.income || '',
        occupation: user?.occupation || '',
        category: user?.category || '',
        education: user?.education || '',
        land_ownership: user?.land_ownership || '',
        disability: user?.disability || false,
    });
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState('all');

    const set = (k, v) => setProfile(p => ({ ...p, [k]: v }));

    const handleCheck = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResults(null);
        const payload = {};
        if (profile.age) payload.age = parseInt(profile.age);
        if (profile.gender) payload.gender = profile.gender;
        if (profile.state) payload.state = profile.state;
        if (profile.income) payload.income = parseFloat(profile.income);
        if (profile.occupation) payload.occupation = profile.occupation;
        if (profile.category) payload.category = profile.category;
        if (profile.education) payload.education = profile.education;
        if (profile.land_ownership) payload.land_ownership = parseFloat(profile.land_ownership);
        payload.disability = profile.disability;

        try {
            const data = await eligibilityApi.check(payload);
            setResults(data);
            if (user) await updateUser(payload).catch(() => { });
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const filtered = results ? (filter === 'all' ? results : results.filter(r => r.status === filter)) : [];
    const counts = results ? {
        eligible: results.filter(r => r.status === 'eligible').length,
        partially_eligible: results.filter(r => r.status === 'partially_eligible').length,
        not_eligible: results.filter(r => r.status === 'not_eligible').length,
    } : {};

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            <div className="text-center mb-8">
                <div className="text-5xl mb-3">🤖</div>
                <h1 className="text-3xl font-black text-gray-900">AI Eligibility Checker</h1>
                <p className="text-gray-500 mt-2">Fill your profile and instantly discover which government schemes you qualify for</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Form */}
                <form onSubmit={handleCheck} className="lg:col-span-2 card p-6 space-y-4 h-fit">
                    <h2 className="font-bold text-gray-900 text-lg mb-1">Your Profile</h2>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="label">Age</label>
                            <input type="number" placeholder="e.g. 28" value={profile.age} onChange={e => set('age', e.target.value)} className="input" min="1" max="120" />
                        </div>
                        <div>
                            <label className="label">Gender</label>
                            <select value={profile.gender} onChange={e => set('gender', e.target.value)} className="input">
                                <option value="">Select</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="label">State</label>
                        <select value={profile.state} onChange={e => set('state', e.target.value)} className="input">
                            <option value="">Select State</option>
                            {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="label">Annual Income (₹)</label>
                        <input type="number" placeholder="e.g. 120000" value={profile.income} onChange={e => set('income', e.target.value)} className="input" />
                    </div>

                    <div>
                        <label className="label">Occupation</label>
                        <select value={profile.occupation} onChange={e => set('occupation', e.target.value)} className="input">
                            <option value="">Select</option>
                            {OCCUPATIONS.map(o => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="label">Category</label>
                            <select value={profile.category} onChange={e => set('category', e.target.value)} className="input">
                                <option value="">Select</option>
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="label">Education</label>
                            <select value={profile.education} onChange={e => set('education', e.target.value)} className="input">
                                <option value="">Select</option>
                                {EDUCATIONS.map(e => <option key={e} value={e}>{e}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="label">Land Owned (acres)</label>
                        <input type="number" placeholder="0 if none" value={profile.land_ownership} onChange={e => set('land_ownership', e.target.value)} className="input" min="0" step="0.1" />
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="disability"
                            checked={profile.disability}
                            onChange={e => set('disability', e.target.checked)}
                            className="w-4 h-4 rounded text-blue-600"
                        />
                        <label htmlFor="disability" className="text-sm font-medium text-gray-700 cursor-pointer">Person with Disability (Divyang)</label>
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Checking...
                            </span>
                        ) : '🔍 Check Eligibility'}
                    </button>
                </form>

                {/* Results */}
                <div className="lg:col-span-3">
                    {!results && !loading && (
                        <div className="text-center py-20 card">
                            <div className="text-5xl mb-4">📋</div>
                            <h3 className="font-semibold text-gray-700">Fill your profile to see results</h3>
                            <p className="text-sm text-gray-500 mt-1">We'll match you with all eligible schemes instantly</p>
                        </div>
                    )}

                    {loading && (
                        <div className="text-center py-20 card">
                            <div className="text-4xl mb-4 animate-pulse-slow">🤖</div>
                            <p className="font-semibold text-gray-700">Analyzing your profile...</p>
                            <p className="text-sm text-gray-500 mt-1">Checking against all government schemes</p>
                        </div>
                    )}

                    {results && (
                        <div>
                            {/* Summary tabs */}
                            <div className="grid grid-cols-3 gap-3 mb-5">
                                {[
                                    { key: 'eligible', label: 'Eligible', count: counts.eligible, color: 'bg-green-50 border-green-200 text-green-700' },
                                    { key: 'partially_eligible', label: 'Partial', count: counts.partially_eligible, color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
                                    { key: 'not_eligible', label: 'Not Eligible', count: counts.not_eligible, color: 'bg-red-50 border-red-200 text-red-600' },
                                ].map(tab => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setFilter(filter === tab.key ? 'all' : tab.key)}
                                        className={`card p-3 text-center border transition-all ${tab.color} ${filter === tab.key ? 'ring-2 ring-blue-400 scale-105' : ''}`}
                                    >
                                        <div className="text-2xl font-black">{tab.count}</div>
                                        <div className="text-xs font-semibold mt-0.5">{tab.label}</div>
                                    </button>
                                ))}
                            </div>

                            {/* Filter row */}
                            <div className="flex gap-2 mb-4">
                                {['all', 'eligible', 'partially_eligible', 'not_eligible'].map(f => (
                                    <button
                                        key={f}
                                        onClick={() => setFilter(f)}
                                        className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all ${filter === f ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'}`}
                                    >
                                        {f === 'all' ? 'All' : f === 'eligible' ? '✅ Eligible' : f === 'partially_eligible' ? '⚠️ Partial' : '❌ Not Eligible'}
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                                {filtered.map(r => <ResultCard key={r.scheme_id} result={r} />)}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
