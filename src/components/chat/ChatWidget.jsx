import React, { useState, useRef, useEffect } from 'react';
import { XMarkIcon, SparklesIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: 'Hi! I\'m your SinhgadConnect AI assistant powered by Gemini. I can help you with:\n\n• Finding relevant posts and discussions\n• Answering questions about campus\n• Placement tips and guidance\n\nHow can I help you today?',
            sources: []
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage, sources: [] }]);
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage })
            });

            const data = await response.json();

            if (data.success) {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: data.answer,
                    sources: data.sources || [],
                    mode: data.mode || 'community'
                }]);
            } else {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: 'Sorry, I encountered an error. Please try again.',
                    sources: []
                }]);
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Unable to connect to the server. Please check your connection.',
                sources: []
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating AI Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 w-14 h-14 bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center z-40 group"
                aria-label="Open AI Assistant"
            >
                <SparklesIcon className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            </button>

            {/* Full Screen Modal */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-2xl h-[80vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                    <SparklesIcon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-white font-bold text-lg">AI Campus Assistant</h2>
                                    <p className="text-white/70 text-xs">Powered by Gemini + RAG</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors"
                            >
                                <XMarkIcon className="w-5 h-5 text-white" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] ${msg.role === 'user'
                                            ? 'bg-indigo-600 text-white rounded-2xl rounded-br-md'
                                            : 'bg-white text-gray-900 rounded-2xl rounded-bl-md shadow-sm border border-gray-100'
                                        } px-4 py-3`}>
                                        <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>

                                        {/* Sources */}
                                        {msg.sources && msg.sources.length > 0 && msg.role === 'assistant' && (
                                            <div className="mt-3 pt-3 border-t border-gray-100">
                                                <p className="text-xs text-gray-500 mb-2">
                                                    {msg.mode === 'general' ? '🌐 Source' : `📚 ${msg.sources.length} source${msg.sources.length > 1 ? 's' : ''}`}
                                                </p>
                                                <div className="flex flex-wrap gap-1">
                                                    {msg.sources.map((source, sIdx) => (
                                                        source.id ? (
                                                            <a
                                                                key={sIdx}
                                                                href={`/posts/${source.id}`}
                                                                className="text-xs px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                {source.title.length > 25 ? source.title.substring(0, 25) + '...' : source.title}
                                                            </a>
                                                        ) : (
                                                            <span key={sIdx} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-lg">
                                                                {source.title}
                                                            </span>
                                                        )
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Loading indicator */}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-100">
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-100">
                            <div className="flex gap-2">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask me anything about campus..."
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-3 bg-gray-100 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading || !input.trim()}
                                    className="px-5 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 font-medium"
                                >
                                    <PaperAirplaneIcon className="w-5 h-5" />
                                    Send
                                </button>
                            </div>
                            <p className="text-xs text-gray-400 mt-2 text-center">
                                AI responses may not always be accurate. Verify important information.
                            </p>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatWidget;
