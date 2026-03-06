import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { schemesApi, eligibilityApi } from '../api';
import { useAuth } from '../contexts/AuthContext';
import SchemeCard from '../components/SchemeCard';
import { Search, ArrowRight, Star, CheckCircle, Users, BookOpen, ChevronRight } from 'lucide-react';

const CATEGORIES = [
    { slug: 'farmers', label: 'Farmers', icon: '🌾', color: 'from-green-400 to-emerald-500' },
    { slug: 'housing', label: 'Housing', icon: '🏠', color: 'from-orange-400 to-red-500' },
    { slug: 'education', label: 'Education', icon: '📚', color: 'from-blue-400 to-indigo-500' },
    { slug: 'women', label: 'Women', icon: '👩', color: 'from-pink-400 to-rose-500' },
    { slug: 'health', label: 'Health', icon: '❤️', color: 'from-red-400 to-pink-500' },
    { slug: 'employment', label: 'Employment', icon: '💼', color: 'from-purple-400 to-violet-500' },
    { slug: 'senior', label: 'Senior Citizens', icon: '👴', color: 'from-yellow-400 to-amber-500' },
    { slug: 'finance', label: 'Finance', icon: '💰', color: 'from-teal-400 to-cyan-500' },
];

const STATS = [
    { value: '1500+', label: 'Government Schemes', icon: '📋' },
    { value: '5M+', label: 'Citizens Benefited', icon: '👥' },
    { value: '30+', label: 'States Covered', icon: '🗺️' },
    { value: '50+', label: 'Ministries', icon: '🏛️' },
];

export default function HomePage() {
    const [search, setSearch] = useState('');
    const [trending, setTrending] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        Promise.all([schemesApi.trending(), schemesApi.categories()])
            .then(([t, c]) => { setTrending(t.slice(0, 6)); setCategories(c); })
            .finally(() => setLoading(false));
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) navigate(`/schemes?search=${encodeURIComponent(search)}`);
    };

    return (
        <div className="min-h-screen">
            <Helmet>
                <title>YojanaMitra | Official Indian Government Schemes Portal</title>
                <meta name="description" content="Discover, check eligibility, and apply for hundreds of Indian Government Schemes across state and central levels using AI." />
            </Helmet>
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-teal-500 text-white">
                {/* Background blobs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-1/3 -right-1/4 w-[600px] h-[600px] rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute -bottom-1/3 -left-1/4 w-[500px] h-[500px] rounded-full bg-white/10 blur-3xl" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-1.5 text-sm font-medium mb-6 animate-fade-in-up">
                            🚀 India's #1 Government Schemes Platform
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                            Find Schemes You <br />
                            <span className="text-yellow-300">Deserve</span>
                        </h1>
                        <p className="text-lg sm:text-xl text-blue-100 mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            Discover, check eligibility, and apply for 1500+ Central & State Government Schemes in one place. AI-powered matching in Hindi & English.
                        </p>

                        {/* Search bar */}
                        <form onSubmit={handleSearch} className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                            <div className="flex gap-2 bg-white rounded-2xl p-2 shadow-2xl max-w-xl mx-auto">
                                <Search size={20} className="text-gray-400 my-auto ml-2 flex-shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Search schemes, e.g. 'farmer subsidy' or 'housing yojana'..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="flex-1 text-gray-800 text-sm bg-transparent focus:outline-none py-1"
                                />
                                <button type="submit" className="btn-primary text-sm py-2.5 flex-shrink-0">
                                    Search
                                </button>
                            </div>
                        </form>

                        {/* Quick chips */}
                        <div className="flex flex-wrap justify-center gap-2 mt-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                            {['PM Kisan', 'Ayushman Bharat', 'Scholarship', 'Housing Scheme'].map(q => (
                                <button
                                    key={q}
                                    onClick={() => navigate(`/schemes?search=${encodeURIComponent(q)}`)}
                                    className="text-xs bg-white/20 hover:bg-white/30 border border-white/30 rounded-full px-3 py-1.5 transition-all"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats bar */}
            <div className="bg-white border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                        {STATS.map(s => (
                            <div key={s.label} className="text-center">
                                <div className="text-2xl mb-1">{s.icon}</div>
                                <div className="text-2xl font-black text-blue-700">{s.value}</div>
                                <div className="text-xs text-gray-500 font-medium">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                {/* Categories */}
                <div className="mb-14">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="section-title">Browse by Category</h2>
                            <p className="section-subtitle">Find schemes tailored to your needs</p>
                        </div>
                        <Link to="/schemes" className="text-sm text-blue-600 font-semibold flex items-center gap-1 hover:underline">
                            View All <ChevronRight size={16} />
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 stagger">
                        {CATEGORIES.map(cat => (
                            <Link
                                key={cat.slug}
                                to={`/schemes?category=${cat.slug}`}
                                className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all group animate-fade-in-up"
                            >
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform`}>
                                    {cat.icon}
                                </div>
                                <span className="text-xs font-semibold text-gray-700 text-center leading-tight">{cat.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Trending Schemes */}
                <div className="mb-14">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="section-title">🔥 Trending Schemes</h2>
                            <p className="section-subtitle">Most viewed schemes right now</p>
                        </div>
                        <Link to="/schemes" className="text-sm text-blue-600 font-semibold flex items-center gap-1 hover:underline">
                            View All <ChevronRight size={16} />
                        </Link>
                    </div>
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="card p-5 h-40 bg-gray-50 animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
                            {trending.map(s => <SchemeCard key={s.id} scheme={s} />)}
                        </div>
                    )}
                </div>

                {/* Eligibility CTA */}
                <div className="bg-gradient-to-br from-blue-600 to-teal-500 rounded-3xl p-8 text-white text-center relative overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute -top-1/2 -right-1/4 w-80 h-80 rounded-full bg-white/10 blur-2xl" />
                    </div>
                    <div className="relative">
                        <div className="text-5xl mb-4">🤖</div>
                        <h2 className="text-2xl font-black mb-2">Check Your Eligibility in 2 Minutes</h2>
                        <p className="text-blue-100 mb-6 max-w-lg mx-auto">
                            Answer a few simple questions and our AI will instantly show you all government schemes you qualify for.
                        </p>
                        <Link to="/eligibility" className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                            Check My Eligibility <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>

                {/* Feature highlights */}
                <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {[
                        { icon: '🔍', title: 'Smart Search', desc: 'Search in Hindi or English. Find schemes by name, category, state, or occupation.' },
                        { icon: '🤖', title: 'AI Eligibility Check', desc: 'Enter your profile once and instantly see which schemes you qualify for — with reasons.' },
                        { icon: '💬', title: 'AI Chatbot', desc: 'Ask questions like "kisan yojana batao" and get instant answers about any scheme.' },
                    ].map(f => (
                        <div key={f.title} className="card p-6 text-center hover:-translate-y-1">
                            <div className="text-4xl mb-3">{f.icon}</div>
                            <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                            <p className="text-sm text-gray-500">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
