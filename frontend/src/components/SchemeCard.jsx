import React from 'react';
import { Link } from 'react-router-dom';

const CATEGORY_ICONS = {
    farmers: '🌾', housing: '🏠', education: '📚', women: '👩',
    health: '❤️', employment: '💼', senior: '👴', disability: '♿',
    finance: '💰', business: '🏪',
};

export default function SchemeCard({ scheme, compact = false }) {
    const schemeType = scheme.scheme_type === 'central' ? 'Central' : 'State';
    const badgeColor = scheme.scheme_type === 'central'
        ? 'bg-blue-100 text-blue-700'
        : 'bg-purple-100 text-purple-700';

    const catSlug = scheme.category?.slug;
    const icon = CATEGORY_ICONS[catSlug] || '📋';

    return (
        <Link to={`/scheme/${scheme.id}`} className="card p-5 flex flex-col gap-3 group cursor-pointer animate-fade-in-up">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
                        {icon}
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 text-sm leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                            {scheme.scheme_name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{scheme.ministry}</p>
                    </div>
                </div>
                <span className={`badge ${badgeColor} flex-shrink-0`}>{schemeType}</span>
            </div>

            {/* Description */}
            {!compact && (
                <p className="text-sm text-gray-600 line-clamp-2">{scheme.description}</p>
            )}

            {/* Benefits snippet */}
            <div className="bg-green-50 rounded-lg px-3 py-2">
                <p className="text-xs font-semibold text-green-700">🎁 Benefits</p>
                <p className="text-sm text-green-800 mt-0.5 line-clamp-1">{scheme.benefits}</p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>👁️ {scheme.views}</span>
                    <span>📝 {scheme.applications_count}</span>
                    {scheme.applicable_state && (
                        <span>📍 {scheme.applicable_state === 'all' ? 'All India' : scheme.applicable_state}</span>
                    )}
                </div>
                <span className="text-xs text-blue-600 font-semibold group-hover:underline">View Details →</span>
            </div>
        </Link>
    );
}
