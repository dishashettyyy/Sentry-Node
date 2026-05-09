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
    fromChain: 42161, // Arbitrum
    fromToken: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', // USDC
    toChain: 115111108, // Solana
    toToken: '11111111111111111111111111111111', // SOL
    toAddress: 'SentryVault11111111111111111111111111111111',
    fromAmount: '100',
    variant: 'compact',
    appearance: 'dark',
    theme: {
      palette: {
        primary: { main: '#14F195' },
        background: { paper: '#000000', default: '#000000' },
        grey: { 200: '#111111', 300: '#222222', 800: '#111111', 900: '#000000' },
      },
      typography: {
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        fontSize: 12,
      },
      shape: {
        borderRadius: 0,
        borderRadiusSecondary: 0
      },
      components: {
        MuiCard: {
          styleOverrides: {
            root: {
              backgroundColor: '#000000',
              border: '1px solid rgba(20, 241, 149, 0.2)',
              boxShadow: 'none',
              borderRadius: '0px'
            }
          }
        },
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: '0px',
              border: '1px solid #14F195',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              fontWeight: 'bold',
              backgroundColor: 'rgba(20, 241, 149, 0.1)',
              color: '#FFFFFF',
            }
          }
        }
      }
    }
  };

  return (
    <div className="flex flex-col gap-2 h-full">
      {/* Transaction Log */}
      <div className="panel-container flex flex-col min-h-[200px] shadow-[0_0_15px_rgba(255,0,60,0.05)]">
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
      <div className="panel-container flex-1 flex flex-col relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-[var(--color-sentry-accent)]/20 p-2 bg-[#050505] relative z-10">
          <span className="text-[10px] font-bold text-white tracking-widest">[EXT] VAULT FUNDING</span>
          <span className="text-[10px] text-[var(--color-sentry-accent)] animate-pulse">● SECURE</span>
        </div>

        {/* HUD Elements */}
        <div className="absolute top-10 left-2 w-4 h-4 border-t border-l border-[var(--color-sentry-accent)]/50 pointer-events-none z-10" />
        <div className="absolute top-10 right-2 w-4 h-4 border-t border-r border-[var(--color-sentry-accent)]/50 pointer-events-none z-10" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-[var(--color-sentry-accent)]/50 pointer-events-none z-10" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-[var(--color-sentry-accent)]/50 pointer-events-none z-10" />

        <div className="flex-1 relative overflow-y-auto overflow-x-hidden flex flex-col items-center justify-start pt-4 px-2 bg-black scanline scrollbar-thin">
          <WidgetErrorBoundary>
            <div className="w-full relative z-20 origin-top scale-90
              [&_.MuiPaper-root]:!shadow-none 
              [&_.MuiPaper-root]:!bg-black 
              [&_.MuiPaper-root]:!border-0
              [&_.MuiContainer-root]:!max-w-none
              [&_.MuiContainer-root]:!p-0
              [&_button]:!font-mono
              [&_button]:!text-[12px]">
               <LiFiWidget config={lifiConfig} />
            </div>
          </WidgetErrorBoundary>
        </div>
      </div>
    </div>
  );
}
