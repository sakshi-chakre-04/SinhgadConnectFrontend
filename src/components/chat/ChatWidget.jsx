import React, { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon, SparklesIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { useSelector } from 'react-redux';
import { selectToken } from '../../features/auth/authSlice';

// Polished product-style markdown renderer
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

        // Main headers (##) - create visual section cards
        if (trimmed.startsWith('## ')) {
            flushSection();
            currentSection = { type: 'header', title: trimmed.slice(3), level: 2 };
        }
        // Subheaders (### or ####) - create styled label
        else if (trimmed.startsWith('#### ')) {
            flushItems();
            sections.push({ type: 'subheader', title: trimmed.slice(5), level: 4 });
        }
        else if (trimmed.startsWith('### ')) {
            flushItems();
            sections.push({ type: 'subheader', title: trimmed.slice(4), level: 3 });
        }
        // Bullet points
        else if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
            currentItems.push({ type: 'bullet', content: trimmed.slice(2) });
        }
        // Numbered lists
        else if (/^\d+\.\s/.test(trimmed)) {
            const match = trimmed.match(/^(\d+)\.\s(.*)/);
            if (match) {
                currentItems.push({ type: 'numbered', num: match[1], content: match[2] });
            }
        }
        // Regular text
        else if (trimmed) {
            currentItems.push({ type: 'text', content: trimmed });
        }
    });

    flushSection();
    flushItems();

    // Render sections with proper styling
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
                                        <div key={iIdx} className="flex items-start gap-2.5 py-1 px-2 bg-gray-50/80 rounded-lg">
                                            <span className="w-1.5 h-1.5 mt-1.5 bg-indigo-500 rounded-full flex-shrink-0"></span>
                                            <span className="text-gray-700 text-sm leading-relaxed">{formatInlineMarkdown(item.content)}</span>
                                        </div>
                                    );
                                }
                                if (item.type === 'numbered') {
                                    return (
                                        <div key={iIdx} className="flex items-start gap-2.5 py-1.5 px-2 bg-gradient-to-r from-indigo-50/50 to-transparent rounded-lg">
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

// Handle inline markdown (bold, emoji indicators)
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

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: "Hi! I'm your SinhgadConnect AI. Ask me anything about campus, placements, or find relevant discussions!"
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const token = useSelector(selectToken);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current.focus(), 100);
        }
    }, [isOpen]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
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

    return (
        <>
            {/* Floating Action Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 w-14 h-14 bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-full shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:scale-110 transition-all flex items-center justify-center z-40 group"
                aria-label="Open AI Assistant"
            >
                <SparklesIcon className="w-6 h-6 group-hover:animate-pulse" />
            </button>

            {/* Compact Chat Panel - Anchored to Bottom Right */}
            {isOpen && (
                <div className="fixed top-4 bottom-24 right-4 lg:right-6 z-50 flex items-end animate-slideUp">
                    <div className="w-[380px] max-h-full h-[480px] flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">

                        {/* Compact Header */}
                        <div className="px-4 py-3 flex items-center justify-between bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                                    <SparklesIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="font-semibold text-sm">AI Assistant</h2>
                                    <p className="text-[10px] text-indigo-100 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                                        Online
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] px-4 py-2.5 text-sm leading-relaxed
                                        ${msg.role === 'user'
                                            ? 'bg-indigo-600 text-white rounded-2xl rounded-br-sm'
                                            : 'bg-white text-gray-800 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100'
                                        }`}>
                                        <div className="prose prose-sm max-w-none">
                                            {msg.role === 'user'
                                                ? <p className="whitespace-pre-wrap m-0">{msg.content}</p>
                                                : renderMarkdown(msg.content)
                                            }
                                        </div>

                                        {/* Sources */}
                                        {msg.sources && msg.sources.length > 0 && msg.role === 'assistant' && (
                                            <div className="mt-2 pt-2 border-t border-gray-100">
                                                <div className="flex flex-wrap gap-1">
                                                    {msg.sources.slice(0, 3).map((source, sIdx) => (
                                                        <a
                                                            key={sIdx}
                                                            href={source.id ? `/posts/${source.id}` : '#'}
                                                            className="text-[10px] px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 transition-colors"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            {source.title.length > 20 ? source.title.substring(0, 20) + '...' : source.title}
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white px-4 py-2.5 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100">
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                            <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                            <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={sendMessage} className="p-3 bg-white border-t border-gray-100">
                            <div className="flex gap-2">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask me anything..."
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-2.5 bg-gray-100 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:bg-white transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading || !input.trim()}
                                    className="w-10 h-10 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center transition-colors"
                                >
                                    <PaperAirplaneIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatWidget;
