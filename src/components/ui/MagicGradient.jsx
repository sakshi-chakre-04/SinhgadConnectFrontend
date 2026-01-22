import React, { useEffect, useRef, useState } from 'react';
import './FloatingOrbs.css';

const MagicGradient = ({ children, className = "" }) => {
  const canvasRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const animationRef = useRef();

  // Gradient combinations from reference images
  const gradients = [
    ['#007CBE', '#FFF7AE'],
    ['#E57A44', '#251351'],
    ['#F1FEC6', '#A882DD'],
    ['#DB5375', '#B3FFB3'],
    ['#02C3BD', '#4E148C'],
    ['#629460', '#F4D35E'],
    ['#414288', '#B0DB43'],
    ['#FFC145', '#EC368D']
  ];

  const [currentGradient, setCurrentGradient] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let time = 0;

    const animate = () => {
      time += 0.002;

      // Create animated gradient background
      const gradient = ctx.createLinearGradient(
        0, 
        0, 
        canvas.width, 
        canvas.height
      );

      // Animate gradient colors based on time and mouse position
      const mouseInfluence = {
        x: mousePosition.x / canvas.width,
        y: mousePosition.y / canvas.height
      };

      const [color1, color2] = gradients[currentGradient];
      
      // Add dynamic color shifting
      const hueShift = Math.sin(time) * 20;
      const brightnessShift = Math.cos(time * 0.5) * 10;

      gradient.addColorStop(0, color1);
      gradient.addColorStop(0.5 + mouseInfluence.x * 0.2, color2);
      gradient.addColorStop(1, color1);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add floating orbs
      for (let i = 0; i < 5; i++) {
        const x = (Math.sin(time + i * 2) + 1) * canvas.width / 2;
        const y = (Math.cos(time * 0.7 + i * 3) + 1) * canvas.height / 2;
        const radius = 50 + Math.sin(time + i) * 20;
        
        const orbGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        orbGradient.addColorStop(0, `rgba(255, 255, 255, ${0.1 + Math.sin(time + i) * 0.05})`);
        orbGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = orbGradient;
        ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Cycle through gradients
    const gradientInterval = setInterval(() => {
      setCurrentGradient((prev) => (prev + 1) % gradients.length);
    }, 8000);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
      clearInterval(gradientInterval);
    };
  }, [mousePosition, currentGradient]);

  return (
    <div className={`relative min-h-screen overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
      />
      
      {/* Glassmorphism overlay for depth */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
      
      {/* Animated gradient border effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 animate-pulse" />
      
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
