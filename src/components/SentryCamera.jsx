import React, { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

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
    <div className="relative border-2 border-[var(--color-sentry-accent)] rounded-xl overflow-hidden bg-black p-4 flex flex-col gap-4 shadow-[0_0_15px_rgba(20,241,149,0.2)]">
      {isFlashing && (
        <div className="fixed inset-0 bg-[#FF003C]/80 z-50 pointer-events-none transition-opacity duration-100 mix-blend-screen" />
      )}
      
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[var(--color-sentry-accent)] flex items-center gap-2 tracking-wider">
          {isGuarding ? <ShieldAlert className="animate-pulse" /> : <ShieldCheck />}
          PERCEPTION LAYER
        </h2>
        <div className="flex items-center gap-4">
           <span className={`text-sm font-bold tracking-widest ${isGuarding ? 'text-[var(--color-sentry-alert)] animate-pulse' : 'text-gray-500'}`}>
             {isGuarding ? 'STATUS: GUARDING' : 'STATUS: STANDBY'}
           </span>
           <button 
             onClick={() => setIsGuarding(!isGuarding)}
             className={`px-6 py-2 rounded font-bold text-black transition-all hover:scale-105 active:scale-95 ${isGuarding ? 'bg-[var(--color-sentry-alert)] shadow-[0_0_10px_#FF003C]' : 'bg-[var(--color-sentry-accent)] shadow-[0_0_10px_#14F195]'}`}
           >
             {isGuarding ? 'DISARM' : 'ARM SENTRY'}
           </button>
        </div>
      </div>

      <div className="relative aspect-video bg-gray-950 rounded-lg overflow-hidden flex items-center justify-center border border-[var(--color-sentry-accent)]/30">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          width="320" 
          height="240" 
          className="w-full h-full object-cover opacity-70 grayscale contrast-125"
        />
        {/* Cyberpunk grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(20,241,149,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(20,241,149,0.1)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
        
        {/* Cyberpunk HUD overlay elements */}
        <div className="absolute top-4 left-4 text-xs text-[var(--color-sentry-accent)]/70 font-mono tracking-widest flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          REC_FEED
        </div>
        <div className="absolute bottom-4 right-4 text-xs text-[var(--color-sentry-accent)]/70 font-mono tracking-widest">
          SYS_RES: 320x240 @ 1.33Hz
        </div>
        
        {/* Corner brackets */}
        <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-[var(--color-sentry-accent)]/50 pointer-events-none" />
        <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-[var(--color-sentry-accent)]/50 pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-[var(--color-sentry-accent)]/50 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-[var(--color-sentry-accent)]/50 pointer-events-none" />
        
        {!model && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-10">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-[var(--color-sentry-accent)] border-t-transparent rounded-full animate-spin" />
              <span className="text-[var(--color-sentry-accent)] animate-pulse tracking-widest font-mono text-sm">LOADING NEURAL WEIGHTS...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
