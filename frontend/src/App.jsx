import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SchemesPage from './pages/SchemesPage';
import SchemeDetailPage from './pages/SchemeDetailPage';
import EligibilityPage from './pages/EligibilityPage';
import ChatbotPage from './pages/ChatbotPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';


function Footer() {
    return (
        <footer className="border-t border-gray-100 bg-white mt-16 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                    <span className="text-xl">🏛️</span>
                    <span className="font-bold text-blue-700">YojanaMitra</span>
                    <span className="text-gray-300">|</span>
                    <span>India's Government Schemes Platform</span>
                </div>
                <div className="flex gap-6">
                    <a href="#" className="hover:text-gray-600 transition-colors">About</a>
                    <a href="#" className="hover:text-gray-600 transition-colors">Privacy</a>
                    <a href="#" className="hover:text-gray-600 transition-colors">Contact</a>
                </div>
                <span>© 2026 YojanaMitra. Made for Bharat 🇮🇳</span>
            </div>
        </footer>
    );
}

function App() {
    return (
        <HelmetProvider>
            <Router>
                <AuthProvider>
                    <div className="min-h-screen flex flex-col">
                        <Navbar />
                        <main className="flex-1">
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/schemes" element={<SchemesPage />} />
                                <Route path="/scheme/:id" element={<SchemeDetailPage />} />
                                <Route path="/eligibility" element={<EligibilityPage />} />
                                <Route path="/chatbot" element={<ChatbotPage />} />
                                <Route path="/dashboard" element={<DashboardPage />} />
                                <Route path="/admin" element={<AdminDashboard />} />
                                <Route path="/login" element={<LoginPage />} />
                                <Route path="/register" element={<RegisterPage />} />
                            </Routes>
                        </main>
                        <Footer />
                    </div>
                    {/* vercel  Analytics */}

                </AuthProvider>
            </Router>
        </HelmetProvider>
    );
}

export default App;
