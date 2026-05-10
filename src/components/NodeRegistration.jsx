import React, { useState } from 'react';

export default function NodeRegistration({ isRegistered }) {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState(null);

  const handleRegister = async () => {
    try {
      setIsRedirecting(true);
      setError(null);
      
      const response = await fetch(`/api/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get checkout URL');
      }

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      console.error('Registration failed:', err);
      setIsRedirecting(false);
      setError(err.message || 'Unknown error occurred');
    }
  };

  return (
    <div className="panel-container flex flex-col mt-2 min-h-[100px] shadow-[0_0_15px_rgba(20,241,149,0.05)] font-mono">
      <div className="flex items-center justify-between border-b border-[var(--color-sentry-accent)]/20 p-2 bg-[#050505]">
        <span className="text-[10px] font-bold text-white tracking-widest">[SYS] NODE REGISTRATION</span>
        <span className={`text-[10px] animate-pulse ${isRegistered ? 'text-[var(--color-sentry-accent)]' : 'text-[var(--color-sentry-alert)]'}`}>
          ● {isRegistered ? 'SECURE' : 'UNREGISTERED'}
        </span>
      </div>
      
      <div className="flex flex-col items-center justify-center flex-1 p-4 bg-black text-[10px] tracking-widest uppercase">
        {isRegistered ? (
          <div className="flex flex-col items-center gap-2">
            <span className="text-[var(--color-sentry-accent)] text-lg">REGISTERED</span>
            <span className="text-white">— OPERATOR #7342</span>
          </div>
        ) : (
          <div className="flex flex-col w-full gap-3">
            <div className="text-center text-[var(--color-sentry-alert)] border border-[var(--color-sentry-alert)]/30 bg-[#FF003C]/10 py-2">
              STATUS: UNREGISTERED
            </div>
            {error && (
              <div className="text-center text-[var(--color-sentry-alert)] border border-[var(--color-sentry-alert)]/50 bg-black py-2 mt-1">
                ERR: {error}
              </div>
            )}
            <button
              onClick={handleRegister}
              disabled={isRedirecting}
              className="w-full py-2 bg-[var(--color-sentry-accent)]/10 border border-[var(--color-sentry-accent)] text-white hover:bg-[var(--color-sentry-accent)]/20 hover:text-[var(--color-sentry-accent)] transition-colors duration-200 uppercase font-bold disabled:opacity-50"
            >
              {isRedirecting ? '▶ INITIALIZING...' : '▶ STAKE & REGISTER'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
