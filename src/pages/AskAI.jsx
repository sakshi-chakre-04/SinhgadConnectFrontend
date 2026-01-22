import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    PaperAirplaneIcon,
    SparklesIcon,
    XMarkIcon,
    ArrowLeftIcon,
    ClockIcon
} from '@heroicons/react/24/solid';
import { useSelector } from 'react-redux';
import { selectToken } from '../features/auth/authSlice';

// Suggestion chips
const SUGGESTION_CHIPS = [
    { icon: '🎓', text: 'placement statistics' },
    { icon: '📚', text: 'best study resources' },
    { icon: '🏢', text: 'companies that visit' },
    { icon: '💼', text: 'internship opportunities' },
    { icon: '📝', text: 'exam preparation tips' },
    { icon: '🎯', text: 'career guidance' },
];

// DEMO MODE - Type "demo" or "test" to get mock response without API call
const DEMO_KEYWORDS = ['demo', 'test', 'ui test', 'testing'];
const DEMO_RESPONSE = {
    answer: `## TCS Placement Preparation Guide

Here's a comprehensive guide to help you prepare for TCS placements:

### 1. Aptitude Preparation
- Practice quantitative aptitude questions daily
- Focus on time management and speed
- Use platforms like IndiaBix and PrepInsta

### 2. Coding Skills
- Master at least one programming language (Python/Java/C++)
- Practice on LeetCode and HackerRank
- Focus on Data Structures and Algorithms

### 3. Communication Skills
- Work on verbal and written communication
- Practice group discussions
- Prepare for HR interview questions

### 4. Company Research
- Understand TCS's services and recent projects
- Know about their work culture and values
- Stay updated with tech industry trends

### Resources
- TCS iON platform for mock tests
- GeeksforGeeks for coding practice
- YouTube channels for aptitude tricks`,
    sources: [
        { id: '1', title: 'How to prepare for TCS NQT exam' },
        { id: '2', title: 'TCS Interview Experience - Selected' },
        { id: '3', title: 'Best DSA preparation strategy' }
    ]
};

// Typewriter Hook - Streams text character by character
const useTypewriter = (text, speed = 8, enabled = true) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        if (!enabled || !text) {
            setDisplayedText(text || '');
            setIsComplete(true);
            return;
        }

        setDisplayedText('');
        setIsComplete(false);
        let index = 0;

        const interval = setInterval(() => {
            if (index < text.length) {
                // Add 2-4 characters at a time for faster but smooth typing
                const charsToAdd = text.slice(index, index + 3);
                setDisplayedText(prev => prev + charsToAdd);
                index += 3;
            } else {
                setIsComplete(true);
                clearInterval(interval);
            }
        }, speed);

        return () => clearInterval(interval);
    }, [text, speed, enabled]);

    return { displayedText, isComplete };
};

// Streaming Message Component
const StreamingMessage = ({ content, onComplete, isNew }) => {
    const { displayedText, isComplete } = useTypewriter(content, 8, isNew);

    useEffect(() => {
        if (isComplete && onComplete) {
            onComplete();
        }
    }, [isComplete, onComplete]);

    // Parse and render markdown for the displayed portion
    const renderContent = (text) => {
        if (!text) return null;
        const lines = text.split('\n');

        return lines.map((line, idx) => {
            const trimmed = line.trim();
            if (trimmed.startsWith('## ') || trimmed.startsWith('### ')) {
                return (
                    <div key={idx} className="flex items-center gap-2 py-1 border-b border-violet-100 mt-2 mb-2 animate-contentFade">
                        <div className="w-1 h-4 bg-gradient-to-b from-violet-500 to-fuchsia-500 rounded-full" />
                        <h3 className="font-semibold text-gray-900 text-sm">{trimmed.replace(/^#+\s/, '')}</h3>
                    </div>
                );
            } else if (trimmed.startsWith('- ') || trimmed.startsWith('• ') || trimmed.startsWith('* ')) {
                return (
                    <div key={idx} className="flex items-start gap-2 py-0.5 animate-contentFade">
                        <span className="w-1.5 h-1.5 mt-1.5 bg-violet-400 rounded-full flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{trimmed.slice(2)}</span>
                    </div>
                );
            } else if (/^\d+\.\s/.test(trimmed)) {
                const match = trimmed.match(/^(\d+)\.\s(.*)/);
                if (match) {
                    return (
                        <div key={idx} className="flex items-start gap-2 py-0.5 animate-contentFade">
                            <span className="w-5 h-5 bg-violet-100 text-violet-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                                {match[1]}
                            </span>
                            <span className="text-gray-700 text-sm pt-0.5">{match[2]}</span>
                        </div>
                    );
                }
            } else if (trimmed) {
                return <p key={idx} className="text-gray-600 text-sm py-0.5">{trimmed}</p>;
            }
            return null;
        });
    };

    return (
        <div className="space-y-1">
            {renderContent(displayedText)}
            {!isComplete && (
                <span className="inline-block w-2 h-4 bg-violet-500 animate-pulse ml-1" />
            )}
        </div>
    );
};

// Skeleton Loader with fade-out capability
const SkeletonLoader = ({ isVisible }) => (
    <div className={`space-y-4 min-w-[300px] transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-gradient-to-b from-violet-300 to-fuchsia-300 rounded-full animate-pulse" />
            <div className="h-5 bg-gray-200 rounded-full w-48 animate-pulse" />
        </div>
        <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded-full w-full animate-pulse" />
            <div className="h-4 bg-gray-200 rounded-full w-11/12 animate-pulse" style={{ animationDelay: '75ms' }} />
            <div className="h-4 bg-gray-200 rounded-full w-4/5 animate-pulse" style={{ animationDelay: '150ms' }} />
        </div>
        <div className="space-y-2 pl-4">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" />
                <div className="h-4 bg-gray-200 rounded-full w-3/4 animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" />
                <div className="h-4 bg-gray-200 rounded-full w-2/3 animate-pulse" style={{ animationDelay: '100ms' }} />
            </div>
        </div>
    </div>
);

const AskAI = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [recentQuestions, setRecentQuestions] = useState([]);
    const [isInChat, setIsInChat] = useState(false);
    const [headerVisible, setHeaderVisible] = useState(false);
    const [showSources, setShowSources] = useState({});
    const [streamingComplete, setStreamingComplete] = useState({});
    const [inputMorphing, setInputMorphing] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const chatInputRef = useRef(null);
    const token = useSelector(selectToken);

    useEffect(() => {
        const saved = localStorage.getItem('askAI_recentQuestions');
        if (saved) {
            try { setRecentQuestions(JSON.parse(saved)); } catch (e) { }
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

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, streamingComplete]);

    useEffect(() => {
        if (isInChat) {
            setTimeout(() => setHeaderVisible(true), 150);
        } else {
            setHeaderVisible(false);
        }
    }, [isInChat]);

    useEffect(() => {
        if (isInChat && !inputMorphing && chatInputRef.current) {
            setTimeout(() => chatInputRef.current?.focus(), 600);
        } else if (!isInChat && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isInChat, inputMorphing]);

    const handleStreamComplete = (idx) => {
        setStreamingComplete(prev => ({ ...prev, [idx]: true }));
        // Show sources after streaming completes
        setTimeout(() => {
            setShowSources(prev => ({ ...prev, [idx]: true }));
        }, 300);
    };

    const sendMessage = async (messageText) => {
        const userMessage = messageText || input.trim();
        if (!userMessage || isLoading) return;

        saveRecentQuestion(userMessage);

        // Start input morphing animation
        setInputMorphing(true);
        setInput('');

        // Delay transition to allow morph effect
        setTimeout(() => {
            setIsInChat(true);
            setMessages([{ role: 'user', content: userMessage }]);
            setIsLoading(true);
            setInputMorphing(false);
        }, 300);

        // Check for demo mode
        const isDemoMode = DEMO_KEYWORDS.some(keyword =>
            userMessage.toLowerCase().includes(keyword)
        );

        // API call or Demo response
        setTimeout(async () => {
            try {
                // DEMO MODE - Return mock response without API call
                if (isDemoMode) {
                    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
                    setMessages(prev => [...prev, {
                        role: 'assistant',
                        content: DEMO_RESPONSE.answer,
                        sources: DEMO_RESPONSE.sources,
                        isNew: true
                    }]);
                    setIsLoading(false);
                    return;
                }

                const response = await fetch((import.meta.env.VITE_API_URL || 'https://sinhgadconnectbackend.onrender.com/api') + '/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        message: userMessage,
                        history: []
                    })
                });

                const data = await response.json();

                if (data.success && data.answer) {
                    setMessages(prev => [...prev, {
                        role: 'assistant',
                        content: data.answer,
                        sources: data.sources || [],
                        isNew: true
                    }]);
                } else {
                    throw new Error('Failed');
                }
            } catch (error) {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: "I'm having trouble connecting. Please try again.",
                    isNew: false
                }]);
            } finally {
                setIsLoading(false);
            }
        }, 400);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage();
    };

    const handleBack = () => {
        setIsInChat(false);
        setMessages([]);
        setShowSources({});
        setStreamingComplete({});
    };

    const handleChatSubmit = async (e) => {
        e.preventDefault();
        const userMessage = input.trim();
        if (!userMessage || isLoading) return;

        const newMsgIndex = messages.length + 1;
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
                    sources: data.sources || [],
                    isNew: true
                }]);
            } else {
                throw new Error('Failed');
            }
        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "I'm having trouble connecting. Please try again.",
                isNew: false
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#F9FAFB]">
            {/* === BACKGROUND === */}
            <div className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${isInChat ? 'opacity-20' : 'opacity-100'}`}>
                <div className="absolute inset-0 bg-gradient-to-br from-violet-100 via-fuchsia-50 to-cyan-50" />
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-violet-300/50 to-purple-400/30 rounded-full blur-[100px] -translate-x-1/4 -translate-y-1/4" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tl from-cyan-300/40 to-teal-200/30 rounded-full blur-[80px] translate-x-1/4 translate-y-1/4" />
                <div className="absolute top-1/3 right-1/4 w-[350px] h-[350px] bg-gradient-to-bl from-pink-300/40 to-rose-200/20 rounded-full blur-[90px]" />
            </div>

            {/* === MORPHING INPUT (Shared Element) === */}
            <div
                className={`fixed z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${inputMorphing
                    ? 'left-4 right-4 lg:left-1/4 lg:right-1/4 bottom-6 opacity-100'
                    : 'opacity-0 pointer-events-none left-1/4 right-1/4 top-1/2'
                    }`}
            >
                <div className="bg-white rounded-2xl border-2 border-violet-200 shadow-2xl p-1">
                    <div className="h-14 flex items-center px-5 text-gray-400">
                        <span className="animate-pulse">Processing...</span>
                    </div>
                </div>
            </div>

            {/* === HOME VIEW === */}
            <div
                className={`relative z-10 flex flex-col min-h-screen px-4 lg:px-6 pt-8 pb-8 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isInChat || inputMorphing ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'
                    }`}
            >
                <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">

                    {/* AI Orb */}
                    <div className="relative mb-8">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 blur-xl opacity-40 animate-pulse" style={{ animationDuration: '3s' }} />
                        <div className="relative w-24 h-24 rounded-full bg-white border-2 border-white shadow-2xl flex items-center justify-center">
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

                    {/* Search Input */}
                    <form onSubmit={handleSubmit} className="w-full mb-8">
                        <div className={`bg-white rounded-2xl border-2 border-violet-200 shadow-xl overflow-hidden transition-all duration-300 ${inputMorphing ? 'scale-95 opacity-50' : 'scale-100 opacity-100'}`}>
                            <div className="relative">
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
                                        ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg'
                                        : 'bg-violet-100 text-violet-400'
                                        }`}
                                >
                                    <PaperAirplaneIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-center mt-2">
                            <div className="flex items-center gap-2 text-gray-400 text-xs">
                                <kbd className="px-1.5 py-0.5 bg-white rounded border border-gray-200 font-mono text-gray-500">↵</kbd>
                                <span>to search</span>
                            </div>
                        </div>
                    </form>

                    {/* Chips */}
                    <div className="w-full mt-4">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="flex gap-1">
                                <div className="w-1 h-1 rounded-full bg-violet-500" />
                                <div className="w-1 h-1 rounded-full bg-fuchsia-500" />
                                <div className="w-1 h-1 rounded-full bg-cyan-500" />
                            </div>
                            <span className="text-gray-400 text-xs uppercase tracking-widest">Explore</span>
                        </div>
                        <div className="flex flex-wrap justify-center gap-2">
                            {SUGGESTION_CHIPS.map((chip, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => sendMessage(chip.text)}
                                    className="px-4 py-2.5 bg-white border border-gray-200 hover:border-violet-300 rounded-full text-gray-700 hover:text-violet-700 text-sm transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-lg hover:-translate-y-0.5"
                                >
                                    <span>{chip.icon}</span>
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
                            <div className="w-8 h-[1px] bg-gray-300" />
                            <ClockIcon className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-gray-400 text-xs uppercase tracking-wider">Recent</span>
                            <div className="w-8 h-[1px] bg-gray-300" />
                        </div>
                        <div className="flex flex-col gap-2 max-w-lg mx-auto">
                            {recentQuestions.slice(0, 3).map((question, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => sendMessage(question)}
                                    className="group flex items-center justify-between px-5 py-4 bg-white border border-gray-200 hover:border-violet-200 rounded-xl cursor-pointer transition-all shadow-sm hover:shadow-lg"
                                >
                                    <span className="text-gray-600 group-hover:text-gray-900 text-sm truncate pr-4">
                                        {question}
                                    </span>
                                    <button
                                        onClick={(e) => deleteRecentQuestion(question, e)}
                                        className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-50 transition-all"
                                    >
                                        <XMarkIcon className="w-4 h-4 text-gray-400 hover:text-red-500" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* === CHAT VIEW === */}
            <div
                className={`absolute inset-0 z-20 flex flex-col transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isInChat ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                    }`}
                style={{ background: 'linear-gradient(to bottom, #F9FAFB, #FFFFFF)' }}
            >
                {/* Chat Header */}
                <div
                    className={`flex-shrink-0 px-4 lg:px-6 pt-4 pb-2 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                        }`}
                >
                    <div
                        className="bg-white rounded-2xl border border-gray-200 px-4 py-3 flex items-center gap-3"
                        style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
                    >
                        <button
                            onClick={handleBack}
                            className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all hover:scale-105"
                        >
                            <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
                        </button>
                        <div className="flex items-center gap-3 flex-1">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-indigo-600 flex items-center justify-center shadow-lg">
                                <SparklesIcon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <span className="font-semibold text-gray-900">Sinhgad AI</span>
                                <p className="text-xs text-emerald-600 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    {isLoading ? 'Thinking...' : 'Online'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-4 space-y-4">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slideUp`}
                            style={{ animationDelay: `${idx * 80}ms` }}
                        >
                            <div
                                className={`max-w-[85%] lg:max-w-[70%] px-5 py-4 text-sm leading-relaxed
                                    ${msg.role === 'user'
                                        ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-2xl rounded-br-md shadow-lg'
                                        : 'bg-white text-gray-800 rounded-2xl rounded-bl-md border-t-2 border-t-violet-400 border border-gray-200'
                                    }`}
                                style={msg.role === 'assistant' ? { boxShadow: '0 4px 20px rgba(139, 92, 246, 0.08)' } : {}}
                            >
                                {msg.role === 'user' ? (
                                    <p className="whitespace-pre-wrap">{msg.content}</p>
                                ) : (
                                    <StreamingMessage
                                        content={msg.content}
                                        isNew={msg.isNew && !streamingComplete[idx]}
                                        onComplete={() => handleStreamComplete(idx)}
                                    />
                                )}

                                {/* Sources - Appear after streaming completes */}
                                {msg.sources && msg.sources.length > 0 && msg.role === 'assistant' && (
                                    <div
                                        className={`mt-3 pt-3 border-t border-gray-100 transition-all duration-500 ${showSources[idx] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 h-0 overflow-hidden mt-0 pt-0 border-0'
                                            }`}
                                    >
                                        <p className="text-xs text-gray-500 mb-2">Related posts:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {msg.sources.slice(0, 3).map((source, sIdx) => (
                                                <Link
                                                    key={sIdx}
                                                    to={source.id ? `/posts/${source.id}` : '#'}
                                                    className="text-xs px-3 py-1.5 bg-violet-50 text-violet-600 rounded-full hover:bg-violet-100 transition-all border border-violet-100 animate-contentFade"
                                                    style={{ animationDelay: `${sIdx * 100}ms` }}
                                                >
                                                    {source.title?.substring(0, 25)}...
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Skeleton Loader with cross-fade */}
                    {isLoading && (
                        <div className="flex justify-start animate-slideUp">
                            <div
                                className="max-w-[85%] lg:max-w-[70%] bg-white px-5 py-4 rounded-2xl rounded-bl-md border-t-2 border-t-violet-400 border border-gray-200"
                                style={{ boxShadow: '0 4px 20px rgba(139, 92, 246, 0.08)' }}
                            >
                                <SkeletonLoader isVisible={true} />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Chat Input */}
                <div className="flex-shrink-0 px-4 lg:px-6 pb-6 pt-2">
                    <form onSubmit={handleChatSubmit}>
                        <div
                            className="bg-white rounded-2xl border border-gray-200 flex items-center gap-2 pr-2"
                            style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
                        >
                            <input
                                ref={chatInputRef}
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
                                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-400'
                                    }`}
                            >
                                <PaperAirplaneIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AskAI;
