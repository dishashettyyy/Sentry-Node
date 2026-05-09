import React, { useState } from 'react';
import SentryCamera from './components/SentryCamera';
import SecurityDashboard from './components/SecurityDashboard';
import { Network } from 'lucide-react';

function App() {
  const [latestThreat, setLatestThreat] = useState(null);

  const handleThreatDetected = (timestamp) => {
    setLatestThreat(timestamp);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 font-mono flex flex-col h-screen overflow-hidden selection:bg-[var(--color-sentry-accent)] selection:text-black">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(20,241,149,0.03)_0%,transparent_100%)] pointer-events-none" />
      
      <header className="mb-6 flex items-center justify-between border-b border-[var(--color-sentry-accent)]/30 pb-4 relative z-10">
        <h1 className="text-3xl font-black text-[var(--color-sentry-accent)] tracking-widest flex items-center gap-3 drop-shadow-[0_0_8px_rgba(20,241,149,0.5)]">
          <Network className="w-8 h-8" />
          SENTRY NODE
        </h1>
        <div className="text-sm font-bold text-gray-500 tracking-widest flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[var(--color-sentry-accent)] animate-ping" />
          PHYSICAL SECURITY AGENT V1.0.0
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-0 relative z-10">
        {/* Left Pane */}
        <div className="flex flex-col gap-6 overflow-hidden">
          <SentryCamera onThreatDetected={handleThreatDetected} />
          
          <div className="border border-[var(--color-sentry-accent)]/30 rounded-xl p-4 bg-black flex-1 relative overflow-hidden shadow-[inset_0_0_20px_rgba(20,241,149,0.05)]">
             <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--color-sentry-accent)] to-transparent opacity-30" />
             <h3 className="text-[var(--color-sentry-accent)] font-bold tracking-widest mb-4 border-b border-[var(--color-sentry-accent)]/20 pb-2 flex justify-between items-end">
               <span>SYSTEM DIAGNOSTICS</span>
               <span className="text-[10px] text-gray-500">LIVE</span>
             </h3>
             <ul className="text-sm text-gray-400 flex flex-col gap-3 font-mono">
               <li className="flex justify-between items-center bg-gray-900/50 p-2 rounded">
                 <span>NEURAL LINK</span>
                 <span className="text-[var(--color-sentry-accent)]">CONNECTED</span>
               </li>
               <li className="flex justify-between items-center bg-gray-900/50 p-2 rounded">
                 <span>UPTIME</span>
                 <span className="text-[var(--color-sentry-accent)]">99.99%</span>
               </li>
               <li className="flex justify-between items-center bg-gray-900/50 p-2 rounded">
                 <span>LAST SYNC</span>
                 <span className="text-[var(--color-sentry-accent)]">{new Date().toLocaleTimeString()}</span>
               </li>
               <li className="flex justify-between items-center bg-gray-900/50 p-2 rounded">
                 <span>NETWORK</span>
                 <span className="text-[#9945FF]">SOLANA DEVNET</span>
               </li>
             </ul>
          </div>
        </div>
        
        {/* Right Pane */}
        <div className="flex flex-col min-h-0">
          <SecurityDashboard latestThreat={latestThreat} />
        </div>
      </main>
    </div>
  );
}

export default App;
