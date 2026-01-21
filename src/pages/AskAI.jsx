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
    { icon: '🔬', text: 'research projects' },
    { icon: '🏆', text: 'achievements on campus' },
];

// Polished markdown renderer
const renderMarkdown = (text) => {
    if (!text) return null;

    const lines = text.split('\n');
    const sections = [];
    let currentSection = null;
    let currentItems = [];

    const flushItems = () => {
        if (currentItems.length > 0) {
            sections.push({ type: 'items', items: [...currentItems] });
            currentItems = [];
        }
    };

    const flushSection = () => {
        flushItems();
        if (currentSection) {
            sections.push(currentSection);
            currentSection = null;
        }
    };

    lines.forEach((line) => {
        const trimmed = line.trim();

        if (trimmed.startsWith('## ')) {
            flushSection();
            currentSection = { type: 'header', title: trimmed.slice(3), level: 2 };
        }
        else if (trimmed.startsWith('#### ')) {
            flushItems();
            sections.push({ type: 'subheader', title: trimmed.slice(5), level: 4 });
        }
        else if (trimmed.startsWith('### ')) {
            flushItems();
            sections.push({ type: 'subheader', title: trimmed.slice(4), level: 3 });
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

    flushSection();
    flushItems();

    return (
        <div className="space-y-3">
            {sections.map((section, idx) => {
                if (section.type === 'header') {
                    return (
                        <div key={idx} className="flex items-center gap-2 py-1.5 border-b border-indigo-100">
                            <div className="w-1 h-4 bg-gradient-to-b from-indigo-500 to-violet-500 rounded-full"></div>
                            <h3 className="font-bold text-gray-900 text-sm">{section.title}</h3>
                        </div>
                    );
                }

                if (section.type === 'subheader') {
                    return (
                        <div key={idx} className="pt-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                                {section.title}
                            </span>
                        </div>
                    );
                }

                if (section.type === 'items') {
                    return (
                        <div key={idx} className="space-y-2 pl-1">
                            {section.items.map((item, iIdx) => {
                                if (item.type === 'bullet') {
                                    return (
                                        <div key={iIdx} className="flex items-start gap-2.5 py-1 px-2 bg-gray-50 rounded-lg">
                                            <span className="w-1.5 h-1.5 mt-1.5 bg-indigo-500 rounded-full flex-shrink-0"></span>
                                            <span className="text-gray-700 text-sm leading-relaxed">{formatInlineMarkdown(item.content)}</span>
                                        </div>
                                    );
                                }
                                if (item.type === 'numbered') {
                                    return (
                                        <div key={iIdx} className="flex items-start gap-2.5 py-1.5 px-2 bg-gradient-to-r from-indigo-50 to-transparent rounded-lg">
                                            <span className="w-5 h-5 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                                                {item.num}
                                            </span>
                                            <span className="text-gray-700 text-sm leading-relaxed pt-0.5">{formatInlineMarkdown(item.content)}</span>
                                        </div>
                                    );
                                }
                                return (
                                    <p key={iIdx} className="text-gray-600 text-sm leading-relaxed py-0.5">{formatInlineMarkdown(item.content)}</p>
                                );
                            })}
                        </div>
                    );
                }

                return null;
            })}
        </div>
    );
};

// Handle inline markdown (bold)
const formatInlineMarkdown = (text) => {
    if (!text) return text;
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>;
        }
        return part;
    });
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

    // Load recent questions from localStorage
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

    // Save recent questions to localStorage
    const saveRecentQuestion = (question) => {
        const updated = [question, ...recentQuestions.filter(q => q !== question)].slice(0, 10);
        setRecentQuestions(updated);
        localStorage.setItem('askAI_recentQuestions', JSON.stringify(updated));
    };

    // Delete a recent question
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

        // Save to recent questions
        saveRecentQuestion(userMessage);

        // Enter chat mode
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

    // Chat View
    if (isInChat) {
        return (
            <div className="fixed inset-0 z-50 flex flex-col bg-gray-50">
                {/* Header */}
                <div className="flex-shrink-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 py-3 flex items-center gap-3 shadow-sm">
                    <button
                        onClick={handleBack}
                        className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    >
                        <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                            <SparklesIcon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <span className="font-semibold text-gray-900">SinhgadConnect AI</span>
                            <p className="text-xs text-green-600 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                Online
                            </p>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[90%] lg:max-w-[70%] px-4 py-3 text-sm leading-relaxed shadow-sm
                                ${msg.role === 'user'
                                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl rounded-br-sm'
                                    : 'bg-white text-gray-800 rounded-2xl rounded-bl-sm border border-gray-100'
                                }`}>
                                <div className="prose prose-sm max-w-none">
                                    {msg.role === 'user'
                                        ? <p className="whitespace-pre-wrap m-0">{msg.content}</p>
                                        : renderMarkdown(msg.content)
                                    }
                                </div>

                                {/* Sources */}
                                {msg.sources && msg.sources.length > 0 && msg.role === 'assistant' && (
                                    <div className="mt-3 pt-3 border-t border-gray-100">
                                        <p className="text-xs text-gray-500 mb-2">Related posts:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {msg.sources.slice(0, 3).map((source, sIdx) => (
                                                <Link
                                                    key={sIdx}
                                                    to={source.id ? `/posts/${source.id}` : '#'}
                                                    className="text-xs px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 transition-colors"
                                                >
                                                    {source.title.length > 25 ? source.title.substring(0, 25) + '...' : source.title}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100">
                                <div className="flex gap-1.5">
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input - Fixed at bottom with safe area */}
                <div className="flex-shrink-0 p-4 pb-6 bg-white border-t border-gray-200 safe-area-pb">
                    <form onSubmit={handleSubmit} className="flex gap-3">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask a follow-up..."
                            disabled={isLoading}
                            className="flex-1 px-4 py-3 bg-gray-100 border border-gray-200 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-full hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center transition-all"
                        >
                            <PaperAirplaneIcon className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // Home View - Redesigned with vibrant visuals
    return (
        <div className="min-h-screen flex flex-col -mx-4 lg:-mx-8 -mt-16 lg:-mt-4">
            {/* Hero Section with Gradient */}
            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 px-6 pt-20 lg:pt-12 pb-16">
                {/* Animated background orbs */}
                <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl animate-pulse"></div>
                <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-400/20 rounded-full translate-x-1/2 blur-3xl"></div>
                <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-indigo-400/20 rounded-full translate-y-1/2 blur-2xl"></div>

                {/* Floating sparkles */}
                <div className="absolute top-8 right-8 text-white/30 animate-bounce" style={{ animationDelay: '0s' }}>✦</div>
                <div className="absolute top-16 left-12 text-white/20 animate-bounce text-2xl" style={{ animationDelay: '0.5s' }}>✧</div>
                <div className="absolute bottom-12 right-16 text-white/25 animate-bounce" style={{ animationDelay: '1s' }}>✦</div>

                <div className="relative z-10 max-w-2xl mx-auto text-center">
                    {/* Glowing AI icon */}
                    <div className="relative inline-block mb-6">
                        <div className="absolute inset-0 bg-white/30 rounded-3xl blur-xl animate-pulse"></div>
                        <div className="relative w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-2xl">
                            <SparklesIcon className="w-10 h-10 text-white" />
                        </div>
                    </div>

                    <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                        Ask AI Anything
                    </h1>
                    <p className="text-white/70 text-lg mb-8">
                        Get instant answers from your campus community
                    </p>

                    {/* Glowing Search Input */}
                    <form onSubmit={handleSubmit} className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-2xl blur opacity-30"></div>
                        <div className="relative bg-white rounded-xl shadow-2xl">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="What would you like to know?"
                                className="w-full px-6 py-5 pr-16 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none text-lg rounded-xl"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim()}
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl hover:shadow-lg hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center transition-all"
                            >
                                <PaperAirplaneIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 px-4 lg:px-8 -mt-6 relative z-10">
                {/* Suggestion Chips */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-white/50 mb-6">
                    <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                            <span className="text-white text-xs">💡</span>
                        </span>
                        Popular Topics
                    </h3>
                    <div className="overflow-hidden -mx-1">
                        <div className="flex gap-3 animate-marquee hover:pause-animation">
                            {SUGGESTION_CHIPS.map((chip, idx) => (
                                <button
                                    key={`first-${idx}`}
                                    onClick={() => handleChipClick(chip.text)}
                                    className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-indigo-50 hover:to-violet-50 border border-gray-200 hover:border-indigo-300 rounded-full text-sm text-gray-700 hover:text-indigo-700 transition-all shadow-sm whitespace-nowrap group"
                                >
                                    <span className="text-base">{chip.icon}</span>
                                    <span className="font-medium">{chip.text}</span>
                                </button>
                            ))}
                            {SUGGESTION_CHIPS.map((chip, idx) => (
                                <button
                                    key={`second-${idx}`}
                                    onClick={() => handleChipClick(chip.text)}
                                    className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-indigo-50 hover:to-violet-50 border border-gray-200 hover:border-indigo-300 rounded-full text-sm text-gray-700 hover:text-indigo-700 transition-all shadow-sm whitespace-nowrap group"
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
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-white/50">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                                <ClockIcon className="w-3.5 h-3.5 text-white" />
                            </span>
                            <h3 className="text-sm font-semibold text-gray-800">Recent Questions</h3>
                        </div>
                        <div className="space-y-2">
                            {recentQuestions.map((question, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => handleRecentClick(question)}
                                    className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-gray-50 to-transparent hover:from-indigo-50 hover:to-violet-50/50 rounded-xl cursor-pointer group transition-all border border-transparent hover:border-indigo-100"
                                >
                                    <span className="text-gray-700 text-sm truncate pr-4 group-hover:text-indigo-700 transition-colors">{question}</span>
                                    <button
                                        onClick={(e) => deleteRecentQuestion(question, e)}
                                        className="flex-shrink-0 w-7 h-7 rounded-full hover:bg-red-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <XMarkIcon className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State - When no recent questions */}
                {recentQuestions.length === 0 && (
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50 text-center">
                        <div className="relative inline-block mb-4">
                            <div className="absolute inset-0 bg-indigo-200 rounded-2xl blur-lg animate-pulse"></div>
                            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                                <SparklesIcon className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Ready to help!</h3>
                        <p className="text-gray-500 text-sm max-w-xs mx-auto">
                            Ask about placements, academics, campus life, or anything else about Sinhgad!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AskAI;
