import React, { useState, useEffect } from 'react';

export default function BootSequence({ onComplete }) {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authProgress, setAuthProgress] = useState(0);

  const handleAuthorize = () => {
    setIsAuthenticating(true);
    
    // Simulate complex authentication sequence
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 20) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 800); // Brief pause at 100% before transition
      }
      setAuthProgress(progress);
    }, 150);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black scanline font-mono text-[var(--color-sentry-accent)] relative overflow-hidden selection:bg-[var(--color-sentry-accent)] selection:text-black p-4">
      
      {/* Corner HUD Elements */}
      <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-[var(--color-sentry-accent)]/50 pointer-events-none" />
      <div className="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-[var(--color-sentry-accent)]/50 pointer-events-none" />
      <div className="absolute bottom-8 left-8 w-8 h-8 border-b-2 border-l-2 border-[var(--color-sentry-accent)]/50 pointer-events-none" />
      <div className="absolute bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-[var(--color-sentry-accent)]/50 pointer-events-none" />

      {/* Main Content Container */}
      <div className="flex flex-col items-center max-w-md w-full relative z-10 gap-8">
        
        {/* Logo */}
        <div className="relative">
          {/* Subtle glow behind logo */}
          <div className="absolute inset-0 bg-[var(--color-sentry-accent)] blur-[40px] opacity-20 animate-pulse rounded-full" />
          <img 
            src="/logo.png" 
            alt="Sentry Node Classified Logo" 
            className="w-48 h-48 object-contain relative z-10 brightness-125 drop-shadow-[0_0_10px_rgba(20,241,149,0.3)]"
          />
        </div>

        {/* Text Area */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold text-white tracking-[0.2em] uppercase">Sentry Node</h1>
          <p className="text-xs text-[var(--color-sentry-accent)]/80 tracking-widest uppercase">
            Physical Oracle Terminal
          </p>
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--color-sentry-accent)]/50 to-transparent my-2" />
          <p className="text-[10px] text-gray-500 tracking-widest font-mono">
            CLASSIFIED SYSTEM // RESTRICTED ACCESS
          </p>
        </div>

        {/* Interactive Widget Area */}
        <div className="w-full mt-8 flex flex-col items-center h-24">
          {!isAuthenticating ? (
            <button 
              onClick={handleAuthorize}
              className="group relative px-6 py-3 border border-[var(--color-sentry-accent)] bg-black hover:bg-[var(--color-sentry-accent)]/10 transition-all duration-300 w-full max-w-[280px]"
            >
              {/* Corner accents on button */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[var(--color-sentry-accent)] group-hover:border-white transition-colors" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[var(--color-sentry-accent)] group-hover:border-white transition-colors" />
              
              <span className="text-xs font-bold tracking-[0.15em] text-[var(--color-sentry-accent)] group-hover:text-white transition-colors relative z-10 flex items-center justify-center gap-2">
                <span className="animate-pulse">▶</span> REQUEST AUTHORIZATION
              </span>
            </button>
          ) : (
            <div className="flex flex-col w-full max-w-[280px] gap-2">
              <div className="flex justify-between text-[10px] font-bold">
                <span className="text-[var(--color-sentry-accent)] animate-pulse">AUTHENTICATING...</span>
                <span className="text-white">{authProgress}%</span>
              </div>
              
              <div className="w-full h-1 bg-gray-900 border border-[var(--color-sentry-accent)]/30 relative overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-[var(--color-sentry-accent)] transition-all duration-150 ease-out"
                  style={{ width: `${authProgress}%` }}
                />
              </div>
              
              <div className="text-[8px] text-gray-500 font-mono tracking-widest mt-1 opacity-70">
                VERIFYING HANDSHAKE PROTOCOL...
              </div>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
