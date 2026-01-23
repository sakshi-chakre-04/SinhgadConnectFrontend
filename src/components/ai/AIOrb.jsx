import React from 'react';
import styled from 'styled-components';
import { SparklesIcon } from '@heroicons/react/24/solid';

const AIOrb = ({ onClick }) => {
  return (
    <StyledWrapper>
      <div className="orb-container" onClick={onClick}>
        <div className="ball">
          <div className="container-lines" />
          <div className="container-rings" />
        </div>
        {/* Sparkles icon in center - outside ball to avoid gooey filter */}
        <div className="icon-wrapper">
          <SparklesIcon className="sparkle-icon" />
        </div>
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
          <filter id="gooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation={6} />
            <feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 20 -10" />
          </filter>
        </svg>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .orb-container {
    position: relative;
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    filter: drop-shadow(0 0 4px rgba(255, 255, 255))
      drop-shadow(0 0 12px rgba(255, 255, 255))
      drop-shadow(0 0 12px rgba(145, 71, 255, 0.3))
      drop-shadow(0 0 5px rgba(139, 92, 246, 0.3));
    transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    
    &:hover {
      transform: scale(1.1);
      filter: drop-shadow(0 0 4px rgba(255, 255, 255))
        drop-shadow(0 0 8px rgba(255, 255, 255))
        drop-shadow(0 0 12px rgba(255, 255, 255))
        drop-shadow(0 0 10px rgba(145, 71, 255, 0.3))
        drop-shadow(0 6px 26px rgba(139, 92, 246, 0.3));
    }
    
    &:active {
      transform: scale(0.95);
    }
  }

  .ball {
    display: flex;
    width: 64px;
    height: 64px;
    flex-shrink: 0;
    border-radius: 50px;
    background: linear-gradient(135deg, #8b5cf6 0%, #d946ef 50%, #6366f1 100%);
    filter: url(#gooey);
    animation: circle2 4.2s ease-in-out infinite;
  }

  @keyframes circle2 {
    0% { transform: scale(1); }
    15% { transform: scale(1.03); }
    30% { transform: scale(0.98); }
    45% { transform: scale(0.96); }
    60% { transform: scale(0.99); }
    85% { transform: scale(1.03); }
    100% { transform: scale(1); }
  }

  .container-lines {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100px;
    height: 100px;
    background-image: radial-gradient(
      ellipse at center,
      rgba(255, 255, 255, 0.75) 15%,
      #8b5cf6 50%
    );
    clip-path: polygon(
      50% 25%, 65% 30%, 75% 42%, 75% 58%, 65% 70%,
      50% 75%, 35% 70%, 26% 58%, 25% 42%, 35% 30%
    );
    animation: animation-ball 15s both ease infinite;
    pointer-events: none;
  }

  @keyframes animation-ball {
    0%, 12%, 55%, 61%, 100% {
      clip-path: polygon(
        50% 25%, 65% 30%, 75% 42%, 75% 58%, 65% 70%,
        50% 75%, 35% 70%, 26% 58%, 25% 42%, 35% 30%
      );
    }
    2% {
      clip-path: polygon(
        50% 25%, 50% 0, 75% 42%, 75% 58%, 65% 70%,
        50% 75%, 35% 70%, 26% 58%, 25% 42%, 50% 0
      );
    }
    4% {
      clip-path: polygon(
        50% 25%, 70% 0, 75% 42%, 85% 66%, 65% 100%,
        50% 75%, 35% 100%, 15% 65%, 25% 42%, 30% 0
      );
    }
    6% {
      clip-path: polygon(
        50% 25%, 50% 15%, 75% 42%, 75% 58%, 65% 70%,
        50% 75%, 35% 70%, 26% 58%, 25% 42%, 50% 15%
      );
    }
    7%, 59% {
      clip-path: polygon(
        50% 25%, 100% 12%, 75% 42%, 85% 66%, 65% 70%,
        50% 75%, 35% 70%, 15% 65%, 25% 42%, 0 12%
      );
    }
    9%, 57% {
      clip-path: polygon(
        50% 25%, 50% 0, 75% 42%, 75% 58%, 65% 70%,
        50% 75%, 35% 70%, 26% 58%, 25% 42%, 50% 0
      );
    }
  }

  .container-rings {
    aspect-ratio: 1;
    border-radius: 50%;
    position: absolute;
    inset: 0;
    perspective: 11rem;

    &:before,
    &:after {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 4px solid transparent;
      mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
      background: linear-gradient(white, #8b5cf6, #d946ef, #a855f7, #e9d5ff) border-box;
      mask-composite: exclude;
    }
  }

  .icon-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
    pointer-events: none;
  }

  .sparkle-icon {
    width: 30px;
    height: 30px;
    color: #f5f3ff;
    filter: drop-shadow(0 2px 3px rgba(88, 28, 135, 0.5))
            drop-shadow(0 -1px 1px rgba(255, 255, 255, 0.8))
            drop-shadow(0 0 10px rgba(167, 139, 250, 0.7))
            drop-shadow(0 0 20px rgba(139, 92, 246, 0.4));
  }

  .container-rings::before {
    animation: ring180 10s linear infinite;
  }

  .container-rings::after {
    animation: ring90 10s linear infinite;
  }

  @keyframes ring180 {
    0% { transform: rotateY(180deg) rotateX(180deg) rotateZ(180deg); }
    50% { transform: rotateY(360deg) rotateX(360deg) rotateZ(360deg) scale(1.1); }
    100% { transform: rotateY(540deg) rotateX(540deg) rotateZ(540deg); }
  }

  @keyframes ring90 {
    0% { transform: rotateY(90deg) rotateX(90deg) rotateZ(90deg); }
    50% { transform: rotateY(270deg) rotateX(270deg) rotateZ(270deg) scale(1.1); }
    100% { transform: rotateY(450deg) rotateX(450deg) rotateZ(450deg); }
  }
`;

export default AIOrb;
