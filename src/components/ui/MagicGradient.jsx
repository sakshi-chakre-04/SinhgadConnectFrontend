import React from 'react';
import './FloatingOrbs.css';

const MagicGradient = ({ children, className = "" }) => {
  // Static purple gradient family colors
  const purpleGradient = [
    '#6B46C1', // Deep purple
    '#9333EA', // Purple
    '#A855F7', // Light purple
    '#C084FC', // Lighter purple
    '#D8B4FE', // Very light purple
    '#E9D5FF'  // Lightest purple
  ];

  return (
    <div className={`relative min-h-screen overflow-hidden ${className}`}>
      {/* Static purple gradient background */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{ 
          background: `linear-gradient(135deg, ${purpleGradient[0]} 0%, ${purpleGradient[2]} 50%, ${purpleGradient[4]} 100%)` 
        }}
      />
      
      {/* Static gradient overlay for depth */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
      
      {/* Floating orbs for depth */}
      <div className="floating-orb floating-orb-1" />
      <div className="floating-orb floating-orb-2" />
      <div className="floating-orb floating-orb-3" />
      
      {/* Content container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        {children}
      </div>
    </div>
  );
};

export default MagicGradient;
