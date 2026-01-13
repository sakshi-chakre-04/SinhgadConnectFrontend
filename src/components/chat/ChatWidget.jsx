import React, { useState, useRef, useEffect } from 'react';
import './ChatWidget.css';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: 'Hi! I\'m your SinhgadConnect AI assistant. Ask me anything about campus events, announcements, or discussions!',
            sources: []
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');

        // Add user message
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
        <div className="chat-widget">
            {/* Floating Button */}
            <button
                className={`chat-toggle ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle chat"
            >
                {isOpen ? '✕' : '💬'}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <div className="chat-header-info">
                            <span className="chat-avatar">🤖</span>
                            <div>
                                <h3>Campus AI Assistant</h3>
                                <span className="status">Powered by RAG</span>
                            </div>
                        </div>
                    </div>

                    <div className="chat-messages">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`message ${msg.role}`}>
                                <div className="message-content">
                                    {msg.content}
                                </div>
                                {msg.sources && msg.sources.length > 0 && msg.role === 'assistant' && (
                                    <details className="message-sources-collapsible">
                                        <summary className="sources-toggle">
                                            {msg.mode === 'general' ? '🌐 View source' : `📚 View ${msg.sources.length} source${msg.sources.length > 1 ? 's' : ''}`}
                                        </summary>
                                        <div className="sources-content">
                                            {msg.sources.map((source, sIdx) => (
                                                source.id ? (
                                                    <a
                                                        key={sIdx}
                                                        href={`/posts/${source.id}`}
                                                        className="source-tag clickable"
                                                        title={`${source.similarity}% match - Click to view post`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        {source.title.length > 30 ? source.title.substring(0, 30) + '...' : source.title}
                                                    </a>
                                                ) : (
                                                    <span
                                                        key={sIdx}
                                                        className={`source-tag ${msg.mode === 'general' ? 'general' : ''}`}
                                                        title="General AI Knowledge"
                                                    >
                                                        {source.title}
                                                    </span>
                                                )
                                            ))}
                                        </div>
                                    </details>
                                )}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="message assistant">
                                <div className="message-content typing">
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form className="chat-input-form" onSubmit={sendMessage}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about campus events..."
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={isLoading || !input.trim()}>
                            ➤
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ChatWidget;
