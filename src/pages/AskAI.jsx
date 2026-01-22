import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    PaperAirplaneIcon,
    SparklesIcon,
    XMarkIcon,
    ArrowLeftIcon,
    ClockIcon
} from '@heroicons/react/24/solid';
import { useSelector } from 'react-redux';
import { selectToken } from '../features/auth/authSlice';

// Suggestion chips for quick questions
const SUGGESTION_CHIPS = [
    { icon: '🎓', text: 'placement statistics' },
    { icon: '📚', text: 'best study resources' },
    { icon: '🏢', text: 'companies that visit' },
    { icon: '💼', text: 'internship opportunities' },
    { icon: '📝', text: 'exam preparation tips' },
    { icon: '🎯', text: 'career guidance' },
];

// Polished markdown renderer
const renderMarkdown = (text) => {
    if (!text) return null;

    const lines = text.split('\n');
    const sections = [];
    let currentItems = [];

    const flushItems = () => {
        if (currentItems.length > 0) {
            sections.push({ type: 'items', items: [...currentItems] });
            currentItems = [];
        }
    };

    lines.forEach((line) => {
        const trimmed = line.trim();

        if (trimmed.startsWith('## ') || trimmed.startsWith('### ')) {
            flushItems();
            sections.push({ type: 'header', title: trimmed.replace(/^#+\s/, '') });
        }
        else if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
            currentItems.push({ type: 'bullet', content: trimmed.slice(2) });
        }
        else if (/^\d+\.\s/.test(trimmed)) {
            const match = trimmed.match(/^(\d+)\.\s(.*)/);
            if (match) {
                currentItems.push({ type: 'numbered', num: match[1], content: match[2] });
            }
        }
        else if (trimmed) {
            currentItems.push({ type: 'text', content: trimmed });
        }
    });

    flushItems();

    return (
        <div className="space-y-2">
            {sections.map((section, idx) => {
                if (section.type === 'header') {
                    return (
                        <div key={idx} className="flex items-center gap-2 py-1 border-b border-violet-100">
                            <div className="w-1 h-4 bg-gradient-to-b from-violet-500 to-fuchsia-500 rounded-full" />
                            <h3 className="font-semibold text-gray-900 text-sm">{section.title}</h3>
                        </div>
                    );
                }

                if (section.type === 'items') {
                    return (
                        <div key={idx} className="space-y-1.5">
                            {section.items.map((item, iIdx) => {
                                if (item.type === 'bullet') {
                                    return (
                                        <div key={iIdx} className="flex items-start gap-2 py-0.5">
                                            <span className="w-1.5 h-1.5 mt-1.5 bg-violet-400 rounded-full flex-shrink-0" />
                                            <span className="text-gray-700 text-sm">{item.content}</span>
                                        </div>
                                    );
                                }
                                if (item.type === 'numbered') {
                                    return (
                                        <div key={iIdx} className="flex items-start gap-2 py-0.5">
                                            <span className="w-5 h-5 bg-violet-100 text-violet-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                                                {item.num}
                                            </span>
                                            <span className="text-gray-700 text-sm pt-0.5">{item.content}</span>
                                        </div>
                                    );
                                }
                                return <p key={iIdx} className="text-gray-600 text-sm">{item.content}</p>;
                            })}
                        </div>
                    );
                }
                return null;
            })}
        </div>
    );
};

const AskAI = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [recentQuestions, setRecentQuestions] = useState([]);
    const [isInChat, setIsInChat] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const token = useSelector(selectToken);

    useEffect(() => {
        const saved = localStorage.getItem('askAI_recentQuestions');
        if (saved) {
            try {
                setRecentQuestions(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse recent questions:', e);
            }
        }
    }, []);

    const saveRecentQuestion = (question) => {
        const updated = [question, ...recentQuestions.filter(q => q !== question)].slice(0, 10);
        setRecentQuestions(updated);
        localStorage.setItem('askAI_recentQuestions', JSON.stringify(updated));
    };

    const deleteRecentQuestion = (question, e) => {
        e.stopPropagation();
        const updated = recentQuestions.filter(q => q !== question);
        setRecentQuestions(updated);
        localStorage.setItem('askAI_recentQuestions', JSON.stringify(updated));
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [isInChat]);

    const sendMessage = async (messageText) => {
        const userMessage = messageText || input.trim();
        if (!userMessage || isLoading) return;

        saveRecentQuestion(userMessage);
        setIsInChat(true);
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await fetch((import.meta.env.VITE_API_URL || 'https://sinhgadconnectbackend.onrender.com/api') + '/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    message: userMessage,
                    history: messages.map(m => ({
                        role: m.role === 'assistant' ? 'model' : 'user',
                        parts: [{ text: m.content }]
                    }))
                })
            });

            const data = await response.json();

            if (data.success && data.answer) {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: data.answer,
                    sources: data.sources || []
                }]);
            } else {
                throw new Error(data.message || 'Failed to get response');
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "I'm having trouble connecting. Please try again."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage();
    };

    const handleChipClick = (chipText) => {
        sendMessage(chipText);
    };

    const handleRecentClick = (question) => {
        sendMessage(question);
    };

    const handleBack = () => {
        setIsInChat(false);
        setMessages([]);
    };

    // UNIFIED VIEW - Both home and chat with smooth transitions
    return (
        <div className="min-h-screen flex flex-col -mx-4 lg:-mx-8 -mt-16 lg:-mt-4 relative overflow-hidden">
            {/* === SPATIAL BACKGROUND === */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-100 via-fuchsia-50 to-cyan-50" />
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100/80 via-transparent to-pink-100/60" />
                <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-violet-300/60 to-purple-400/40 rounded-full blur-[100px] animate-pulse -translate-x-1/4 -translate-y-1/4" style={{ animationDuration: '4s' }} />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-cyan-300/50 to-teal-200/40 rounded-full blur-[80px] animate-pulse translate-x-1/4 translate-y-1/4" style={{ animationDuration: '5s' }} />
                <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-gradient-to-bl from-pink-300/50 to-rose-200/30 rounded-full blur-[90px] animate-pulse" style={{ animationDuration: '6s' }} />
                <div className="absolute bottom-1/3 left-1/3 w-[350px] h-[350px] bg-gradient-to-tr from-indigo-200/50 to-blue-200/30 rounded-full blur-[70px]" />
                <div className="absolute inset-0 opacity-[0.04]" style={{
                    backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }} />
            </div>

            {/* === CHAT VIEW === */}
            <div className={`fixed inset-0 z-20 flex flex-col transition-all duration-500 ease-out ${isInChat ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
                }`}>
                {/* Chat Header */}
                <div className="flex-shrink-0 relative z-10 mx-4 lg:mx-8 mt-4">
                    <div className="bg-white/70 backdrop-blur-2xl rounded-2xl border border-white/60 shadow-lg shadow-violet-100/20 px-4 py-3 flex items-center gap-3">
                        <button
                            onClick={handleBack}
                            className="w-10 h-10 rounded-xl bg-white/80 hover:bg-white border border-violet-100 flex items-center justify-center transition-all hover:shadow-md hover:scale-105"
                        >
                            <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
                        </button>
                        <div className="flex items-center gap-3 flex-1">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-200/50">
                                <SparklesIcon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <span className="font-semibold text-gray-900">Ask AI</span>
                                <p className="text-xs text-emerald-600 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Ready to help
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-4 space-y-4">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                        >
                            <div className={`max-w-[85%] lg:max-w-[70%] px-5 py-4 text-sm leading-relaxed
                                ${msg.role === 'user'
                                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-2xl rounded-br-md shadow-lg shadow-violet-200/50'
                                    : 'bg-white/80 backdrop-blur-xl text-gray-800 rounded-2xl rounded-bl-md border border-white/60 shadow-lg shadow-violet-100/20'
                                }`}>
                                {msg.role === 'user'
                                    ? <p className="whitespace-pre-wrap m-0">{msg.content}</p>
                                    : renderMarkdown(msg.content)
                                }

                                {msg.sources && msg.sources.length > 0 && msg.role === 'assistant' && (
                                    <div className="mt-3 pt-3 border-t border-violet-100/50">
                                        <p className="text-xs text-gray-500 mb-2">Related posts:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {msg.sources.slice(0, 3).map((source, sIdx) => (
                                                <Link
                                                    key={sIdx}
                                                    to={source.id ? `/posts/${source.id}` : '#'}
                                                    className="text-xs px-3 py-1.5 bg-violet-50 text-violet-600 rounded-full hover:bg-violet-100 transition-all"
                                                >
                                                    {source.title?.length > 25 ? source.title.substring(0, 25) + '...' : source.title}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex justify-start animate-fadeIn">
                            <div className="bg-white/80 backdrop-blur-xl px-5 py-4 rounded-2xl rounded-bl-md border border-white/60 shadow-lg shadow-violet-100/20">
                                <div className="flex gap-1.5">
                                    <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 bg-fuchsia-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Chat Input */}
                <div className="flex-shrink-0 px-4 lg:px-8 pb-6 pt-2">
                    <form onSubmit={handleSubmit}>
                        <div className="bg-white/80 backdrop-blur-2xl rounded-2xl border-2 border-violet-200/60 shadow-xl shadow-violet-100/30 flex items-center gap-2 pr-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask a follow-up..."
                                disabled={isLoading}
                                className="flex-1 px-5 py-4 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none text-base"
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${input.trim()
                                        ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-300/50'
                                        : 'bg-violet-100 text-violet-400'
                                    }`}
                            >
                                <PaperAirplaneIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* === HOME VIEW === */}
            <div className={`relative z-10 flex flex-col min-h-screen px-4 lg:px-8 pt-20 lg:pt-8 pb-8 transition-all duration-500 ease-out ${isInChat ? 'opacity-0 -translate-y-8 pointer-events-none' : 'opacity-100 translate-y-0'
                }`}>
                <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">

                    {/* AI Orb */}
                    <div className="relative mb-8">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 blur-xl opacity-40 animate-pulse" style={{ animationDuration: '3s' }} />
                        <div className="absolute -inset-3 rounded-full border border-violet-200/50 animate-ping" style={{ animationDuration: '3s' }} />
                        <div className="relative w-24 h-24 rounded-full bg-white/80 backdrop-blur-2xl border border-white shadow-xl shadow-violet-200/50 flex items-center justify-center">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 via-fuchsia-500 to-indigo-600 flex items-center justify-center shadow-lg">
                                <SparklesIcon className="w-10 h-10 text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl lg:text-5xl font-light text-gray-800 tracking-tight mb-2 text-center">
                        Ask <span className="font-semibold bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 bg-clip-text text-transparent">anything</span>
                    </h1>
                    <p className="text-gray-500 text-sm tracking-widest uppercase mb-10 flex items-center gap-2 justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 animate-pulse" />
                        Campus Intelligence • Powered by AI
                    </p>

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="w-full mb-8">
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 rounded-2xl blur opacity-0 group-hover:opacity-20 group-focus-within:opacity-40 transition-all duration-500" />
                            <div className="relative bg-white/90 backdrop-blur-2xl rounded-2xl border-2 border-violet-200/60 shadow-xl shadow-violet-100/30 overflow-hidden">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 text-lg">⌘</div>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="What would you like to know?"
                                    className="w-full pl-14 pr-16 py-5 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none text-lg font-light"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim()}
                                    className={`absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${input.trim()
                                            ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-300/50 scale-100'
                                            : 'bg-violet-100 text-violet-400 scale-95'
                                        }`}
                                >
                                    <PaperAirplaneIcon className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 text-gray-400 text-xs">
                                <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border border-gray-200 font-mono text-gray-500">↵</kbd>
                                <span>to search</span>
                            </div>
                        </div>
                    </form>

                    {/* Chips */}
                    <div className="w-full mt-8">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="flex gap-1">
                                <div className="w-1 h-1 rounded-full bg-violet-500" />
                                <div className="w-1 h-1 rounded-full bg-fuchsia-500" />
                                <div className="w-1 h-1 rounded-full bg-cyan-500" />
                            </div>
                            <span className="text-gray-400 text-xs uppercase tracking-[0.2em]">Explore</span>
                        </div>
                        <div className="flex flex-wrap justify-center gap-2">
                            {SUGGESTION_CHIPS.map((chip, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleChipClick(chip.text)}
                                    className="group px-4 py-2.5 bg-white/40 hover:bg-white/80 backdrop-blur-xl border border-white/60 hover:border-violet-300 rounded-full text-gray-700 hover:text-violet-700 text-sm transition-all duration-300 flex items-center gap-2 shadow-sm shadow-violet-100/20 hover:shadow-lg hover:shadow-violet-200/40 hover:-translate-y-0.5"
                                >
                                    <span className="text-base">{chip.icon}</span>
                                    <span className="font-medium">{chip.text}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Questions */}
                {recentQuestions.length > 0 && (
                    <div className="mt-auto pt-8">
                        <div className="flex items-center gap-2 mb-4 justify-center">
                            <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-gray-300" />
                            <ClockIcon className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-gray-400 text-xs uppercase tracking-[0.15em]">Recent</span>
                            <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-gray-300" />
                        </div>
                        <div className="flex flex-col gap-2 max-w-lg mx-auto">
                            {recentQuestions.slice(0, 3).map((question, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => handleRecentClick(question)}
                                    className="group relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-violet-100/0 via-fuchsia-100/50 to-cyan-100/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
                                    <div className="relative flex items-center justify-between px-5 py-4 bg-white/60 hover:bg-white backdrop-blur border border-gray-200/50 hover:border-violet-200 rounded-xl cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md">
                                        <span className="text-gray-600 group-hover:text-gray-900 text-sm font-light truncate pr-4 transition-colors">
                                            {question}
                                        </span>
                                        <button
                                            onClick={(e) => deleteRecentQuestion(question, e)}
                                            className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-50 transition-all"
                                        >
                                            <XMarkIcon className="w-4 h-4 text-gray-400 hover:text-red-500" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {recentQuestions.length === 0 && (
                    <div className="mt-auto pt-8 flex flex-col items-center">
                        <div className="flex items-center gap-3 px-5 py-2.5 bg-white/60 backdrop-blur rounded-full border border-gray-200/50 shadow-sm">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-gray-500 text-xs uppercase tracking-wider">Ready</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Corner Accents */}
            <div className="fixed top-6 left-6 text-gray-200 text-2xl pointer-events-none select-none z-30">⌘</div>
            <div className="fixed bottom-6 right-6 flex gap-1.5 pointer-events-none z-30">
                <div className="w-2 h-2 rounded-full bg-violet-400/40" />
                <div className="w-2 h-2 rounded-full bg-fuchsia-400/40" />
                <div className="w-2 h-2 rounded-full bg-cyan-400/40" />
            </div>
        </div>
    );
};

export default AskAI;
