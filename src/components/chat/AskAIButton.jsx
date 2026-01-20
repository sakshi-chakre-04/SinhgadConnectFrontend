import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SparklesIcon } from '@heroicons/react/24/solid';

const AskAIButton = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Don't show on the ask-ai page itself
    if (location.pathname === '/ask-ai') {
        return null;
    }

    return (
        <button
            onClick={() => navigate('/ask-ai')}
            className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 w-14 h-14 bg-gradient-to-br from-[var(--lavender-main)] to-[var(--pink-soft)] text-white rounded-full shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:scale-110 transition-all flex items-center justify-center z-50 group"
            aria-label="Ask AI"
        >
            <SparklesIcon className="w-6 h-6 group-hover:animate-pulse" />
        </button>
    );
};

export default AskAIButton;
