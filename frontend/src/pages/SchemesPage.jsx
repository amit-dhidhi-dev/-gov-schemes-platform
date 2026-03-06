import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { schemesApi } from '../api';
import SchemeCard from '../components/SchemeCard';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';

const SCHEME_TYPES = ['', 'central', 'state'];

export default function SchemesPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [schemes, setSchemes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [selectedType, setSelectedType] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');

    useEffect(() => {
        schemesApi.categories().then(setCategories);
    }, []);

    useEffect(() => {
        setLoading(true);
        const params = {};
        if (search) params.search = search;
        if (selectedType) params.scheme_type = selectedType;
        if (selectedCategory) {
            const cat = categories.find(c => c.slug === selectedCategory);
            if (cat) params.category_id = cat.id;
        }
        schemesApi.list(params)
            .then(setSchemes)
            .finally(() => setLoading(false));
    }, [search, selectedType, selectedCategory, categories]);

    const clearFilters = () => {
        setSearch('');
        setSelectedType('');
        setSelectedCategory('');
        setSearchParams({});
    };

    const hasFilter = search || selectedType || selectedCategory;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900">Government Schemes</h1>
                <p className="text-gray-500 mt-1">Browse and search from 1500+ Central and State schemes</p>
            </div>

            {/* Search + Filters */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-8">
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search schemes..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="input pl-10"
                        />
                    </div>

                    {/* Type filter */}
                    <select
                        value={selectedType}
                        onChange={e => setSelectedType(e.target.value)}
                        className="input sm:w-40"
                    >
                        <option value="">All Types</option>
                        <option value="central">Central</option>
                        <option value="state">State</option>
                    </select>

                    {/* Category filter */}
                    <select
                        value={selectedCategory}
                        onChange={e => setSelectedCategory(e.target.value)}
                        className="input sm:w-48"
                    >
                        <option value="">All Categories</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.slug}>{c.name}</option>
                        ))}
                    </select>

                    {hasFilter && (
                        <button onClick={clearFilters} className="flex items-center gap-1.5 text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-4 rounded-xl text-sm transition-all">
                            <X size={15} /> Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Active filters tags */}
            {hasFilter && (
                <div className="flex flex-wrap gap-2 mb-5">
                    {search && (
                        <span className="badge bg-blue-100 text-blue-700 gap-1">
                            🔍 "{search}"
                            <button onClick={() => setSearch('')} className="ml-1 hover:text-blue-900"><X size={12} /></button>
                        </span>
                    )}
                    {selectedType && (
                        <span className="badge bg-purple-100 text-purple-700 gap-1">
                            {selectedType === 'central' ? '🏛️ Central' : '🗺️ State'}
                            <button onClick={() => setSelectedType('')} className="ml-1 hover:text-purple-900"><X size={12} /></button>
                        </span>
                    )}
                    {selectedCategory && (
                        <span className="badge bg-green-100 text-green-700 gap-1">
                            📂 {categories.find(c => c.slug === selectedCategory)?.name}
                            <button onClick={() => setSelectedCategory('')} className="ml-1 hover:text-green-900"><X size={12} /></button>
                        </span>
                    )}
                </div>
            )}

            {/* Results count */}
            {!loading && (
                <p className="text-sm text-gray-500 mb-4">
                    Showing <span className="font-semibold text-gray-700">{schemes.length}</span> schemes
                </p>
            )}

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(9)].map((_, i) => (
                        <div key={i} className="card p-5 h-48 bg-gray-50 animate-pulse" />
                    ))}
                </div>
            ) : schemes.length === 0 ? (
                <div className="text-center py-20">
                    <div className="text-5xl mb-4">🔍</div>
                    <h3 className="text-lg font-semibold text-gray-700">No schemes found</h3>
                    <p className="text-gray-500 mt-1">Try adjusting your search or filters</p>
                    <button onClick={clearFilters} className="btn-primary mt-4 text-sm">Clear Filters</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
                    {schemes.map(s => <SchemeCard key={s.id} scheme={s} />)}
                </div>
            )}
        </div>
    );
}
