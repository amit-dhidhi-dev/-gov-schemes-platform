import React, { useState, useEffect, useRef } from 'react';
import { chatbotApi } from '../api';
import { Send, Bot, User, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const QUICK_PROMPTS = [
    'Farmer schemes batao',
    'Housing scheme for poor',
    'Student scholarship SC',
    'Health insurance scheme',
    'Women empowerment yojana',
    'Old age pension scheme',
];

export default function ChatbotPage() {
    const [messages, setMessages] = useState([
        {
            from: 'bot',
            text: "Namaste! 🙏 Main aapka Government Schemes Assistant hoon.\n\nMujhse puchiye:\n• Kisan yojana kya hai?\n• Housing scheme kaise milegi?\n• Scholarship for SC students?\n• मुझे health scheme chahiye\n\nMain Hindi aur English dono mein jawab de sakta hoon! 😊",
            time: new Date(),
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const send = async (text) => {
        if (!text.trim()) return;
        const userMsg = { from: 'user', text, time: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);
        try {
            const data = await chatbotApi.send(text);
            const botMsg = {
                from: 'bot',
                text: data.reply,
                schemes: data.suggested_schemes,
                time: new Date(),
            };
            setMessages(prev => [...prev, botMsg]);
        } catch (e) {
            setMessages(prev => [...prev, { from: 'bot', text: 'Sorry, there was an error. Please try again.', time: new Date() }]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => { e.preventDefault(); send(input); };

    const formatTime = (d) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
            {/* Header */}
            <div className="card p-5 mb-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center text-2xl shadow-md">
                    🤖
                </div>
                <div>
                    <h1 className="font-bold text-gray-900 text-lg">YojanaMitra AI Assistant</h1>
                    <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        Online • Answers in Hindi & English
                    </div>
                </div>
            </div>

            {/* Quick prompts */}
            <div className="flex flex-wrap gap-2 mb-4">
                {QUICK_PROMPTS.map(p => (
                    <button
                        key={p}
                        onClick={() => send(p)}
                        className="text-xs bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-full transition-all"
                    >
                        {p}
                    </button>
                ))}
            </div>

            {/* Messages */}
            <div className="card p-4 space-y-4 min-h-[400px] max-h-[520px] overflow-y-auto mb-4">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex gap-2.5 animate-fade-in-up ${msg.from === 'user' ? 'flex-row-reverse' : ''}`}>
                        {/* Avatar */}
                        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm font-bold shadow ${msg.from === 'bot' ? 'bg-gradient-to-br from-blue-600 to-teal-500' : 'bg-gradient-to-br from-gray-500 to-gray-600'}`}>
                            {msg.from === 'bot' ? <Bot size={16} /> : <User size={16} />}
                        </div>

                        <div className={`flex flex-col gap-1 max-w-[80%] ${msg.from === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${msg.from === 'bot'
                                    ? 'bg-white border border-gray-100 text-gray-800'
                                    : 'bg-blue-600 text-white'
                                }`}>
                                {msg.text}
                            </div>

                            {/* Scheme links */}
                            {msg.schemes && msg.schemes.length > 0 && (
                                <div className="space-y-1.5 w-full mt-1">
                                    {msg.schemes.map(s => (
                                        <Link
                                            key={s.id}
                                            to={`/scheme/${s.id}`}
                                            className="flex items-center justify-between bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl px-3 py-2 text-xs text-blue-700 font-medium transition-all"
                                        >
                                            <span>{s.name}</span>
                                            <span className="text-blue-400">→</span>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            <span className="text-[10px] text-gray-400">{formatTime(msg.time)}</span>
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex gap-2.5 animate-fade-in-up">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center">
                            <Bot size={16} className="text-white" />
                        </div>
                        <div className="bg-white border border-gray-100 rounded-2xl px-4 py-2.5">
                            <div className="flex gap-1">
                                {[0, 1, 2].map(i => (
                                    <div key={i} className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="card flex gap-2 p-2">
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Ask about any government scheme... (Hindi or English)"
                    className="flex-1 px-4 py-2.5 bg-gray-50 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    disabled={loading}
                />
                <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="w-11 h-11 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white flex items-center justify-center transition-all"
                >
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
}
