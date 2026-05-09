import React, { useState } from 'react';
import SentryCamera from './components/SentryCamera';
import SecurityDashboard from './components/SecurityDashboard';

function App() {
  const [latestThreat, setLatestThreat] = useState(null);

  const handleThreatDetected = (timestamp) => {
    setLatestThreat(timestamp);
  };

  return (
    <div className="min-h-screen bg-[var(--color-sentry-bg)] text-[var(--color-sentry-accent)] p-2 font-mono flex flex-col h-screen overflow-hidden selection:bg-[var(--color-sentry-accent)] selection:text-black">
      {/* Terminal Title Bar */}
      <header className="mb-2 flex items-center justify-between border-b border-[var(--color-sentry-accent)]/50 pb-1 px-2 text-[10px] md:text-xs">
        <div className="flex gap-4">
          <span className="font-bold text-white">NODE ID: SENTRY-X9</span>
          <span className="text-[var(--color-sentry-accent)]/30">|</span>
          <span>STATUS: <span className="text-[var(--color-sentry-accent)] font-bold">ONLINE</span></span>
          <span className="text-[var(--color-sentry-accent)]/30">|</span>
          <span className="text-gray-400">UPTIME: 99.99%</span>
        </div>
        <div className="flex gap-4">
          <span>THREAT LEVEL: <span className="text-[var(--color-sentry-alert)] font-bold">ELEVATED</span></span>
          <span className="text-[var(--color-sentry-accent)]/30">|</span>
          <span>NET: <span className="text-[var(--color-sentry-network)] font-bold">SOL-DEV</span></span>
        </div>
      </header>

      {/* 3-Column Grid */}
      <main className="flex-1 grid grid-cols-1 md:grid-cols-[220px_1fr_320px] gap-2 min-h-0">
        
        {/* Left Column: Diagnostics */}
        <div className="panel-container flex flex-col p-2">
          <div className="flex justify-between items-center border-b border-[var(--color-sentry-accent)]/20 pb-1 mb-2">
            <span className="text-[10px] font-bold text-white tracking-widest">[SYS] DIAGNOSTICS</span>
            <span className="text-[10px] text-[var(--color-sentry-accent)] animate-pulse">● LIVE</span>
          </div>
          <div className="flex flex-col gap-1 text-[10px] text-gray-400">
            <div className="flex justify-between"><span>LINK STATE:</span><span className="text-[var(--color-sentry-accent)]">SECURE</span></div>
            <div className="flex justify-between"><span>LATENCY:</span><span>14ms</span></div>
            <div className="flex justify-between"><span>LAST SYNC:</span><span>{new Date().toLocaleTimeString()}</span></div>
            <div className="h-[1px] bg-[var(--color-sentry-accent)]/20 my-2" />
            <div className="flex justify-between"><span>CPU LOAD:</span><span>24%</span></div>
            <div className="flex justify-between"><span>MEM USAGE:</span><span>1.2GB</span></div>
            <div className="flex justify-between"><span>TEMP:</span><span>42°C</span></div>
            <div className="h-[1px] bg-[var(--color-sentry-accent)]/20 my-2" />
            <div className="flex justify-between"><span>CHAIN:</span><span className="text-[var(--color-sentry-network)]">SOLANA</span></div>
            <div className="flex justify-between"><span>RPC:</span><span className="text-[var(--color-sentry-accent)]">CONNECTED</span></div>
          </div>
        </div>
        
        {/* Center Column: Camera */}
        <div className="flex flex-col min-h-0">
          <SentryCamera onThreatDetected={handleThreatDetected} />
        </div>

        {/* Right Column: Dashboard */}
        <div className="flex flex-col min-h-0">
          <SecurityDashboard latestThreat={latestThreat} />
        </div>
        
      </main>
    </div>
  );
}

export default App;
