import React, { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

export default function SentryCamera({ onThreatDetected }) {
  const videoRef = useRef(null);
  const [model, setModel] = useState(null);
  const [isGuarding, setIsGuarding] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const [lastThreatTime, setLastThreatTime] = useState(0);

  useEffect(() => {
    // Load model
    const loadModel = async () => {
      await tf.ready();
      const loadedModel = await cocoSsd.load();
      setModel(loadedModel);
    };
    loadModel();
  }, []);

  useEffect(() => {
    // Start camera
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240 }
      }).then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }).catch(err => console.error("Camera error:", err));
    }
  }, []);

  const handleThreat = () => {
    const now = Date.now();
    // Throttle threats to avoid multiple speeches overlapping in short bursts
    if (now - lastThreatTime < 5000) return;
    setLastThreatTime(now);

    // Visual Feedback
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 500);

    // Audio Feedback
    const speech = new SpeechSynthesisUtterance("Physical security breach detected. Authorized presence not found. Initiating on-chain penalty.");
    window.speechSynthesis.speak(speech);

    // Upstream Action (e.g. Solana Slashing)
    if (onThreatDetected) {
      onThreatDetected(new Date());
    }
  };

  useEffect(() => {
    let interval;
    if (model && isGuarding && videoRef.current) {
      interval = setInterval(async () => {
        if (videoRef.current.readyState === 4) {
          const predictions = await model.detect(videoRef.current);
          const hasPerson = predictions.some(p => p.class === "person");
          if (hasPerson) {
            handleThreat();
          }
        }
      }, 750);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [model, isGuarding, lastThreatTime, onThreatDetected]);

  return (
    <div className="panel-container flex flex-col h-full bg-[#030303] relative">
      {isFlashing && (
        <div className="absolute inset-0 bg-[#FF003C]/40 z-50 pointer-events-none mix-blend-color-dodge" />
      )}
      
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-[var(--color-sentry-accent)]/20 p-2 bg-[#050505]">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-white tracking-widest">[CH-1] OPTICAL SENSOR</span>
        </div>
        <div className="flex items-center gap-3">
           <span className={`text-[10px] font-bold tracking-widest ${isGuarding ? 'text-[var(--color-sentry-alert)] animate-pulse' : 'text-gray-600'}`}>
             {isGuarding ? '● REC' : '○ STDBY'}
           </span>
           <button 
             onClick={() => setIsGuarding(!isGuarding)}
             className={`px-3 py-1 text-[10px] border font-bold text-white transition-all ${isGuarding ? 'border-[var(--color-sentry-alert)] bg-[var(--color-sentry-alert)]/20 hover:bg-[var(--color-sentry-alert)]/40' : 'border-[var(--color-sentry-accent)] bg-[var(--color-sentry-accent)]/10 hover:bg-[var(--color-sentry-accent)]/30'}`}
           >
             {isGuarding ? '■ DISARM' : '▶ ARM'}
           </button>
        </div>
      </div>

      <div className="flex-1 relative bg-black overflow-hidden scanline flex items-center justify-center p-2">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          width="320" 
          height="240" 
          className="w-full h-full object-cover opacity-80 grayscale contrast-125 sepia-[.2]"
        />
        
        {/* Military HUD Overlays */}
        <div className="absolute top-4 left-4 text-[10px] text-[var(--color-sentry-accent)]/70 font-mono tracking-widest">
          AZIMUTH: 184.2<br/>FOV: 90.0
        </div>
        <div className="absolute bottom-4 left-4 text-[10px] text-[var(--color-sentry-accent)]/70 font-mono tracking-widest">
          LAT/LONG: [REDACTED]<br/>ALT: 14M ASL
        </div>
        <div className="absolute top-4 right-4 text-[10px] text-[var(--color-sentry-accent)]/70 font-mono tracking-widest text-right">
          CLASSIFIER: COCO-SSD<br/>CONFIDENCE: 0.8+
        </div>
        
        {/* Reticle / Targeting box */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-[var(--color-sentry-accent)]/20 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[var(--color-sentry-accent)]/50 rounded-full" />
          {/* Corner brackets for reticle */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[var(--color-sentry-accent)]" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[var(--color-sentry-accent)]" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[var(--color-sentry-accent)]" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[var(--color-sentry-accent)]" />
        </div>
        
        {!model && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-10">
            <div className="flex flex-col items-center gap-2">
              <span className="text-[var(--color-sentry-accent)] animate-pulse tracking-widest font-mono text-[10px]">INITIATING NEURAL WEIGHTS...</span>
              <div className="w-32 h-[1px] bg-[var(--color-sentry-accent)]/30 relative overflow-hidden">
                <div className="absolute top-0 bottom-0 left-0 w-1/3 bg-[var(--color-sentry-accent)] animate-[bounce_1s_infinite_linear]" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
