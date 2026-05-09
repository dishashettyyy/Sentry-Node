import React, { useEffect, useState, Component } from 'react';
import { LiFiWidget } from '@lifi/widget';

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
        <div className="flex flex-col items-center justify-center h-full w-full bg-[#FF003C]/10 text-[#FF003C] font-mono text-[10px] p-4 text-center">
          <span>[ERR] WIDGET UNAVAILABLE</span>
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
      
      // Mock delay
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
    toToken: '0000000000000000000000000000000000000000',
    variant: 'compact',
    appearance: 'dark',
    theme: {
      palette: {
        primary: { main: '#14F195' },
        background: { paper: '#050505', default: '#000000' }
      },
      typography: {
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
      },
      shape: {
        borderRadius: 2,
        borderRadiusSecondary: 2
      }
    }
  };

  return (
    <div className="flex flex-col gap-2 h-full">
      {/* Transaction Log */}
      <div className="panel-container flex flex-col min-h-[250px] shadow-[0_0_15px_rgba(255,0,60,0.05)]">
        <div className="flex items-center justify-between border-b border-[var(--color-sentry-accent)]/20 p-2 bg-[#050505]">
          <span className="text-[10px] font-bold text-white tracking-widest">[SYS] ENFORCEMENT LOG</span>
          <span className="text-[10px] text-[var(--color-sentry-alert)] animate-pulse">● ACTIVE</span>
        </div>
        
        <div className="flex-1 overflow-y-auto flex flex-col text-[10px] font-mono scrollbar-thin p-2 bg-black">
          {txLog.length === 0 && (
            <div className="h-full flex items-center justify-center text-gray-600 animate-pulse">
              AWAITING PROTOCOL VIOLATIONS...
            </div>
          )}
          {txLog.map((log, i) => (
            <div 
              key={i} 
              className={`py-1 border-b border-gray-900 ${log.includes('CONFIRMED') ? 'text-[var(--color-sentry-accent)]' : 'text-gray-400'}`}
            >
              {log}
            </div>
          ))}
        </div>
      </div>
      
      {/* Vault Funding */}
      <div className="panel-container flex-1 flex flex-col">
        <div className="flex items-center justify-between border-b border-[var(--color-sentry-accent)]/20 p-2 bg-[#050505]">
          <span className="text-[10px] font-bold text-white tracking-widest">[EXT] VAULT FUNDING</span>
          <span className="text-[10px] text-[var(--color-sentry-accent)] animate-pulse">● SECURE</span>
        </div>
        <div className="flex-1 overflow-hidden flex flex-col items-center justify-center p-2 bg-black">
          <WidgetErrorBoundary>
            <div className="w-full h-full max-h-full overflow-y-auto scrollbar-thin [&_.MuiPaper-root]:!shadow-none [&_.MuiPaper-root]:!bg-transparent">
               <LiFiWidget config={lifiConfig} />
            </div>
          </WidgetErrorBoundary>
        </div>
      </div>
    </div>
  );
}
