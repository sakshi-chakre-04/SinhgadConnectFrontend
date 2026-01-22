import React from 'react';
import './FloatingOrbs.css';

const MagicGradient = ({ children, className = "" }) => {
  return (
    <div className={`min-h-screen flex flex-col relative overflow-hidden bg-[#F9FAFB] ${className}`}>
      {/* AskAI-style background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-100 via-fuchsia-50 to-cyan-50" />
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-violet-300/50 to-purple-400/30 rounded-full blur-[100px] -translate-x-1/4 -translate-y-1/4" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tl from-cyan-300/40 to-teal-200/30 rounded-full blur-[80px] translate-x-1/4 translate-y-1/4" />
        <div className="absolute top-1/3 right-1/4 w-[350px] h-[350px] bg-gradient-to-bl from-pink-300/40 to-rose-200/20 rounded-full blur-[90px]" />
      </div>
      
      {/* Content container */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 lg:px-6 pt-8 pb-8">
        {children}
      </div>
    </div>
  );
};

export default MagicGradient;
