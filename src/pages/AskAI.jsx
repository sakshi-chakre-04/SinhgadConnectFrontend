import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    PaperAirplaneIcon,
    SparklesIcon,
    XMarkIcon,
    ArrowLeftIcon,
    ClockIcon,
    ChevronDownIcon
} from '@heroicons/react/24/solid';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
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

const getSmartSuggestions = (raw) => {
    const q = (raw || '').trim().toLowerCase();
    if (!q) return [];

    const base = [
        { icon: '✨', text: `summarize ${q} in 60 seconds` },
        { icon: '🧭', text: `make a 7-day plan for ${q}` },
        { icon: '🧪', text: `create a quick test on ${q}` },
    ];

    if (q.includes('tcs')) {
        return [
            { icon: '🏢', text: 'TCS placement preparation guide' },
            { icon: '🧠', text: 'TCS aptitude practice plan' },
            { icon: '💻', text: 'TCS coding topics and DSA roadmap' },
            { icon: '🗣️', text: 'TCS HR interview questions and answers' },
            ...base,
        ];
    }

    if (q.includes('exam') || q.includes('sem') || q.includes('syllabus')) {
        return [
            { icon: '📘', text: `best resources for ${q}` },
            { icon: '🗓️', text: `make a study timetable for ${q}` },
            ...base,
        ];
    }

    return base;
};

const getQuickActions = (primaryQuery, content) => {
    const q = (primaryQuery || '').toLowerCase();
    const c = (content || '').toLowerCase();

    if (q.includes('tcs') || c.includes('tcs')) {
        return [
            {
                label: 'Start Aptitude Test',
                prompt: 'Give me a 15-question TCS aptitude test. Put answers at the end.'
            },
            {
                label: '2-Week DSA Plan',
                prompt: 'Create a 14-day DSA plan for TCS with daily tasks and resources.'
            },
            {
                label: 'HR Interview Prep',
                prompt: 'List the most common TCS HR interview questions with sample answers.'
            }
        ];
    }

    return [
        {
            label: 'Make a Checklist',
            prompt: 'Turn this into a short checklist for me.'
        },
        {
            label: 'Give Resources',
            prompt: `Give me the best resources for: ${primaryQuery || 'this topic'}`
        }
    ];
};

const ShimmerBlock = ({ className }) => (
    <motion.div
        className={className}
        style={{
            backgroundImage: 'linear-gradient(90deg, rgba(229,231,235,0.9) 0%, rgba(243,244,246,0.9) 45%, rgba(229,231,235,0.9) 100%)',
            backgroundSize: '200% 100%',
            backgroundPosition: '200% 0%'
        }}
        animate={{ backgroundPosition: ['200% 0%', '-200% 0%'] }}
        transition={{ duration: 1.2, ease: 'linear', repeat: Infinity }}
    />
);

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
            <div className="w-1 h-5 bg-gradient-to-b from-violet-300 to-fuchsia-300 rounded-full" />
            <ShimmerBlock className="h-5 rounded-full w-48" />
        </div>
        <div className="space-y-2">
            <ShimmerBlock className="h-4 rounded-full w-full" />
            <ShimmerBlock className="h-4 rounded-full w-11/12" />
            <ShimmerBlock className="h-4 rounded-full w-4/5" />
        </div>
        <div className="space-y-2 pl-4">
            <div className="flex items-center gap-2">
                <ShimmerBlock className="w-2 h-2 rounded-full" />
                <ShimmerBlock className="h-4 rounded-full w-3/4" />
            </div>
            <div className="flex items-center gap-2">
                <ShimmerBlock className="w-2 h-2 rounded-full" />
                <ShimmerBlock className="h-4 rounded-full w-2/3" />
            </div>
        </div>
    </div>
);

const parseInsightContent = (raw) => {
    const text = raw || '';
    const lines = text.split('\n');
    let title = '';
    let intro = '';
    const sections = [];
    let current = null;
    let inIntro = true;

    const flush = () => {
        if (current && (current.items.length > 0 || current.paragraphs.length > 0)) {
            sections.push(current);
        }
        current = null;
    };

    for (const line of lines) {
        const trimmed = (line || '').trim();
        if (!trimmed) continue;

        if (trimmed.startsWith('## ')) {
            if (!title) title = trimmed.slice(3);
            continue;
        }

        if (trimmed.startsWith('### ')) {
            flush();
            inIntro = false;
            current = { title: trimmed.slice(4), items: [], paragraphs: [] };
            continue;
        }

        const isBullet = trimmed.startsWith('- ') || trimmed.startsWith('• ') || trimmed.startsWith('* ');
        const numberedMatch = trimmed.match(/^(\d+)\.\s(.*)/);

        if (isBullet) {
            const itemText = trimmed.slice(2).trim();
            if (!current) current = { title: 'Key Points', items: [], paragraphs: [] };
            current.items.push({ type: 'bullet', text: itemText });
            continue;
        }

        if (numberedMatch) {
            if (!current) current = { title: 'Steps', items: [], paragraphs: [] };
            current.items.push({ type: 'numbered', num: numberedMatch[1], text: numberedMatch[2] });
            continue;
        }

        if (inIntro && !intro) {
            intro = trimmed;
            continue;
        }

        if (!current) current = { title: 'Details', items: [], paragraphs: [] };
        current.paragraphs.push(trimmed);
    }

    flush();

    return { title, intro, sections };
};

const InsightResponse = ({ content, contextQuery, onQuickAction }) => {
    const parsed = useMemo(() => parseInsightContent(content), [content]);
    const actions = useMemo(
        () => getQuickActions(contextQuery || parsed.title || 'this', content),
        [contextQuery, parsed.title, content]
    );
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <div className="space-y-3">
            {(parsed.title || contextQuery) && (
                <div className="flex items-center gap-2 pb-1.5 border-b border-violet-100">
                    <div className="w-1 h-4 bg-gradient-to-b from-violet-500 to-fuchsia-500 rounded-full" />
                    <h3 className="font-semibold text-gray-900 text-sm">
                        {parsed.title || contextQuery}
                    </h3>
                </div>
            )}

            {parsed.intro && (
                <p className="text-gray-700 text-sm leading-relaxed">{parsed.intro}</p>
            )}

            {actions && actions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {actions.slice(0, 3).map((a, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => onQuickAction?.(a.prompt)}
                            className="px-3 py-2 rounded-full bg-violet-50 text-violet-700 border border-violet-100 hover:bg-violet-100 transition-all text-xs font-semibold"
                        >
                            {a.label}
                        </button>
                    ))}
                </div>
            )}

            <div className="space-y-2">
                {parsed.sections.map((section, idx) => {
                    const isOpen = openIndex === idx;
                    return (
                        <div key={idx} className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur">
                            <button
                                type="button"
                                onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                                className="w-full flex items-center justify-between gap-3 px-4 py-3"
                            >
                                <span className="text-sm font-semibold text-gray-900 text-left">
                                    {section.title}
                                </span>
                                <ChevronDownIcon
                                    className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                                />
                            </button>

                            <AnimatePresence initial={false}>
                                {isOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-4 pb-4 space-y-2">
                                            {section.paragraphs.map((p, pIdx) => (
                                                <p key={pIdx} className="text-gray-700 text-sm leading-relaxed">
                                                    {p}
                                                </p>
                                            ))}

                                            {section.items.length > 0 && (
                                                <div className="space-y-2">
                                                    {section.items.map((item, iIdx) => {
                                                        if (item.type === 'numbered') {
                                                            return (
                                                                <div key={iIdx} className="flex items-start gap-2.5 py-1 px-2 bg-gradient-to-r from-violet-50/60 to-transparent rounded-lg">
                                                                    <span className="w-5 h-5 bg-violet-100 text-violet-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                                                                        {item.num}
                                                                    </span>
                                                                    <span className="text-gray-700 text-sm leading-relaxed pt-0.5">
                                                                        {item.text}
                                                                    </span>
                                                                </div>
                                                            );
                                                        }

                                                        return (
                                                            <div key={iIdx} className="flex items-start gap-2.5 py-1 px-2 bg-gray-50/80 rounded-lg">
                                                                <span className="w-1.5 h-1.5 mt-1.5 bg-violet-500 rounded-full flex-shrink-0" />
                                                                <span className="text-gray-700 text-sm leading-relaxed">
                                                                    {item.text}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const AskAI = () => {
    const [messages, setMessages] = useState([]);
    const [homeInput, setHomeInput] = useState('');
    const [chatInput, setChatInput] = useState('');
    const [activeQuery, setActiveQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [recentQuestions, setRecentQuestions] = useState([]);
    const [isInChat, setIsInChat] = useState(false);
    const [headerVisible, setHeaderVisible] = useState(false);
    const [showSources, setShowSources] = useState({});
    const [streamingComplete, setStreamingComplete] = useState({});
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const chatInputRef = useRef(null);
    const token = useSelector(selectToken);

    const isTyping = !!homeInput.trim();
    const smartSuggestions = useMemo(() => getSmartSuggestions(homeInput), [homeInput]);

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
        if (isInChat && chatInputRef.current) {
            setTimeout(() => chatInputRef.current?.focus(), 350);
        } else if (!isInChat && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isInChat]);

    const handleStreamComplete = (idx) => {
        setStreamingComplete(prev => ({ ...prev, [idx]: true }));
        // Show sources after streaming completes
        setTimeout(() => {
            setShowSources(prev => ({ ...prev, [idx]: true }));
        }, 300);
    };

    const sendMessage = async (messageText) => {
        const userMessage = messageText || homeInput.trim();
        if (!userMessage || isLoading) return;

        setActiveQuery(userMessage);
        saveRecentQuestion(userMessage);

        setHomeInput('');
        setChatInput('');
        setIsInChat(true);
        setMessages([{ role: 'user', content: userMessage }]);
        setIsLoading(true);

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
        setActiveQuery('');
    };

    const sendFollowUp = async (messageText) => {
        const userMessage = (messageText || '').trim();
        if (!userMessage || isLoading) return;

        const historyForApi = [...messages, { role: 'user', content: userMessage }];

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
                    history: historyForApi.map(m => ({
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

    const handleChatSubmit = async (e) => {
        e.preventDefault();
        const userMessage = chatInput.trim();
        setChatInput('');
        await sendFollowUp(userMessage);
    };

    return (
        <LayoutGroup>
        <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#F9FAFB]">
            {/* === BACKGROUND === */}
            <div className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${isInChat ? 'opacity-20' : 'opacity-100'}`}>
                <div className="absolute inset-0 bg-gradient-to-br from-violet-100 via-fuchsia-50 to-cyan-50" />
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-violet-300/50 to-purple-400/30 rounded-full blur-[100px] -translate-x-1/4 -translate-y-1/4" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tl from-cyan-300/40 to-teal-200/30 rounded-full blur-[80px] translate-x-1/4 translate-y-1/4" />
                <div className="absolute top-1/3 right-1/4 w-[350px] h-[350px] bg-gradient-to-bl from-pink-300/40 to-rose-200/20 rounded-full blur-[90px]" />
            </div>

            {/* === HOME VIEW === */}
            <div
                className={`relative z-10 flex flex-col min-h-screen px-4 lg:px-6 pt-8 pb-8 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isInChat ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'
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
                        <motion.div
                            layoutId="askai-search"
                            className="bg-white/75 backdrop-blur-xl rounded-2xl border border-white/50 shadow-xl overflow-hidden"
                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className="relative">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 text-lg">⌘</div>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={homeInput}
                                    onChange={(e) => setHomeInput(e.target.value)}
                                    placeholder="What would you like to know?"
                                    className="w-full pl-14 pr-16 py-5 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none text-lg font-light"
                                />
                                <button
                                    type="submit"
                                    disabled={!homeInput.trim()}
                                    className={`absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${homeInput.trim()
                                        ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg'
                                        : 'bg-violet-100 text-violet-400'
                                        }`}
                                >
                                    <PaperAirplaneIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
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
                            <span className="text-gray-400 text-xs uppercase tracking-widest">{isTyping ? 'Smart Suggestions' : 'Explore'}</span>
                        </div>
                        <AnimatePresence mode="wait">
                            {!isTyping ? (
                                <motion.div
                                    key="explore"
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                    className="flex flex-wrap justify-center gap-2"
                                >
                                    {SUGGESTION_CHIPS.map((chip, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => sendMessage(chip.text)}
                                            className="px-4 py-2.5 bg-white/80 backdrop-blur border border-gray-200 hover:border-violet-300 rounded-full text-gray-700 hover:text-violet-700 text-sm transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-lg hover:-translate-y-0.5"
                                        >
                                            <span>{chip.icon}</span>
                                            <span className="font-medium">{chip.text}</span>
                                        </button>
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="smart"
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                    className="flex flex-wrap justify-center gap-2"
                                >
                                    {smartSuggestions.slice(0, 6).map((s, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => sendMessage(s.text)}
                                            className="px-4 py-2.5 bg-white/70 backdrop-blur border border-violet-100 hover:border-violet-300 rounded-full text-violet-700 hover:text-violet-800 text-sm transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-lg hover:-translate-y-0.5"
                                        >
                                            <span>{s.icon}</span>
                                            <span className="font-semibold">{s.text}</span>
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
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
                        className="bg-white rounded-2xl border border-gray-200 px-4 py-3"
                        style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
                    >
                        <div className="flex items-center gap-3">
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

                        <div className="mt-3">
                            <motion.div
                                layoutId="askai-search"
                                className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-sm overflow-hidden"
                                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <div className="px-5 py-3">
                                    <p className="text-sm font-semibold text-gray-900 truncate">
                                        {activeQuery || 'Ask anything'}
                                    </p>
                                </div>
                            </motion.div>
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
                                    <>
                                        {msg.isNew && !streamingComplete[idx] ? (
                                            <StreamingMessage
                                                content={msg.content}
                                                isNew={true}
                                                onComplete={() => handleStreamComplete(idx)}
                                            />
                                        ) : (
                                            <InsightResponse
                                                content={msg.content}
                                                contextQuery={activeQuery}
                                                onQuickAction={(prompt) => {
                                                    setChatInput('');
                                                    sendFollowUp(prompt);
                                                }}
                                            />
                                        )}
                                    </>
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
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                placeholder="Ask a follow-up..."
                                disabled={isLoading}
                                className="flex-1 px-5 py-4 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none text-base"
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !chatInput.trim()}
                                className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${chatInput.trim()
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
        </LayoutGroup>
    );
};

export default AskAI;
