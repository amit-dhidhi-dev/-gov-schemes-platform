import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
    Search, Bell, User, Menu, X, Home, FileText,
    CheckCircle, MessageCircle, LogOut, Settings, Shield
} from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = React.useState(false);
    const [profileOpen, setProfileOpen] = React.useState(false);

    const navLinks = [
        { to: '/', label: 'Home', icon: Home },
        { to: '/schemes', label: 'Schemes', icon: FileText },
        { to: '/eligibility', label: 'Check Eligibility', icon: CheckCircle },
        { to: '/chatbot', label: 'AI Assistant', icon: MessageCircle },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                            🏛️
                        </div>
                        <div className="hidden sm:block">
                            <span className="font-bold text-blue-700 text-lg">Yojana</span>
                            <span className="font-bold text-gray-800 text-lg">Mitra</span>
                        </div>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${isActive(link.to)
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                                    }`}
                            >
                                <link.icon size={15} />
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-2">
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-all"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center text-white text-sm font-bold">
                                        {user.full_name?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[100px] truncate">
                                        {user.full_name?.split(' ')[0]}
                                    </span>
                                </button>
                                {profileOpen && (
                                    <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50">
                                        <Link
                                            to="/dashboard"
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                            onClick={() => setProfileOpen(false)}
                                        >
                                            <Settings size={15} /> Dashboard
                                        </Link>
                                        {user?.is_agent && (
                                            <Link
                                                to="/admin"
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-purple-700 hover:bg-purple-50"
                                                onClick={() => setProfileOpen(false)}
                                            >
                                                <Shield size={15} /> Admin Portal
                                            </Link>
                                        )}
                                        <button
                                            onClick={() => { logout(); setProfileOpen(false); navigate('/'); }}
                                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                        >
                                            <LogOut size={15} /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link to="/login" className="btn-ghost text-sm hidden sm:block">Sign In</Link>
                                <Link to="/register" className="btn-primary text-sm py-2 px-4">Get Started</Link>
                            </div>
                        )}

                        {/* Mobile menu toggle */}
                        <button
                            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            {menuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {menuOpen && (
                    <div className="md:hidden pb-4 border-t border-gray-100 mt-1">
                        {navLinks.map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all mt-1 ${isActive(link.to)
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                onClick={() => setMenuOpen(false)}
                            >
                                <link.icon size={16} />
                                {link.label}
                            </Link>
                        ))}
                        {!user && (
                            <div className="flex gap-2 mt-3 px-1">
                                <Link to="/login" className="btn-secondary flex-1 text-center text-sm" onClick={() => setMenuOpen(false)}>
                                    Sign In
                                </Link>
                                <Link to="/register" className="btn-primary flex-1 text-center text-sm" onClick={() => setMenuOpen(false)}>
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}
