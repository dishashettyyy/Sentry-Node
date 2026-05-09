import React, { useEffect, useState, Component } from 'react';
import { LiFiWidget } from '@lifi/widget';
import { Activity } from 'lucide-react';

class WidgetErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("LiFiWidget crashed:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-[#FF003C]/10 text-[#FF003C] font-mono text-sm border border-[#FF003C]/30 rounded-lg p-4 text-center">
          <Activity className="w-8 h-8 mb-2 opacity-50" />
          <span>WIDGET UNAVAILABLE</span>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function SecurityDashboard({ latestThreat }) {
  const [txLog, setTxLog] = useState([]);
  
  useEffect(() => {
    if (!latestThreat) return;
    executeSlashing();
  }, [latestThreat]);

  const executeSlashing = async () => {
    try {
      const timeStr = new Date().toLocaleTimeString();
      setTxLog(prev => [`[${timeStr}] INITIATING 0.001 SOL SLASH PENALTY...`, ...prev]);
      
      // In a real app we would use window.solana or wallet adapter to sign this.
      // We will mock the delay for visual effect.
      setTimeout(() => {
        setTxLog(prev => [`[${new Date().toLocaleTimeString()}] TX CONFIRMED: Penalty Enforced.`, ...prev]);
      }, 2000);
      
    } catch (error) {
      console.error(error);
      setTxLog(prev => [`[${new Date().toLocaleTimeString()}] SLASH FAILED: ${error.message}`, ...prev]);
    }
  };

  const lifiConfig = {
    integrator: 'sentry-node',
    toChain: 115111108, // Solana
    toToken: '0000000000000000000000000000000000000000', // Typically 0x0... or native identifier for LIFI
    variant: 'compact',
    appearance: 'dark',
    theme: {
      palette: {
        primary: { main: '#14F195' },
        background: { paper: '#0A0A0A', default: '#000000' }
      },
      typography: {
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
      },
      shape: {
        borderRadius: 8,
        borderRadiusSecondary: 8
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Transaction Log */}
      <div className="border border-[var(--color-sentry-alert)]/40 rounded-xl bg-black p-4 min-h-[200px] flex flex-col shadow-[0_0_15px_rgba(255,0,60,0.15)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-sentry-alert)] to-transparent opacity-50" />
        
        <h3 className="text-[var(--color-sentry-alert)] mb-3 font-bold tracking-widest flex items-center gap-2 border-b border-[var(--color-sentry-alert)]/20 pb-2">
          <Activity className="animate-pulse" />
          ON-CHAIN ENFORCEMENT LOG
        </h3>
        
        <div className="flex-1 overflow-y-auto flex flex-col gap-2 text-sm font-mono scrollbar-thin">
          {txLog.length === 0 && (
            <div className="h-full flex items-center justify-center text-gray-600 animate-pulse">
              AWAITING PROTOCOL VIOLATIONS...
            </div>
          )}
          {txLog.map((log, i) => (
            <div 
              key={i} 
              className={`p-2 border-l-2 ${log.includes('CONFIRMED') ? 'border-[var(--color-sentry-accent)] text-[var(--color-sentry-accent)] bg-[var(--color-sentry-accent)]/10' : 'border-[var(--color-sentry-alert)] text-gray-300 bg-black'}`}
            >
              {log}
            </div>
          ))}
        </div>
      </div>
      
      {/* Vault Funding */}
      <div className="border border-[var(--color-sentry-accent)]/30 rounded-xl bg-[#050505] p-4 flex-1 flex flex-col relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-sentry-accent)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#4F46E5]/10 rounded-full blur-3xl" />
        
        <h3 className="text-[var(--color-sentry-accent)] mb-4 font-bold tracking-widest text-center border-b border-[var(--color-sentry-accent)]/20 pb-3 relative z-10">
          VAULT FUNDING (CROSS-CHAIN)
        </h3>
        <div className="flex-1 relative z-10 overflow-hidden flex items-center justify-center min-h-[300px]">
          <WidgetErrorBoundary>
            <LiFiWidget config={lifiConfig} />
          </WidgetErrorBoundary>
        </div>
      </div>
    </div>
  );
}
