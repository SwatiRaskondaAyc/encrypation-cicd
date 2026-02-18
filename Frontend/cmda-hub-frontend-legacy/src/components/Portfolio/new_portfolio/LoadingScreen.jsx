import React, { useState, useEffect } from 'react';
import { 
  PieChart, TrendingUp, Shield, Zap, 
  BarChart2, Target, Brain
} from 'lucide-react';

const TIPS = [
  {
    title: "Analyze Risk",
    desc: "Identify high-risk assets and balance your portfolio exposure.",
    icon: Shield,
    color: "text-rose-400",
    bg: "bg-rose-400/10",
    border: "border-rose-400/20"
  },
  {
    title: "Sector Breakdown",
    desc: "Visualize your investments across different industries and sectors.",
    icon: PieChart,
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    border: "border-violet-400/20"
  },
  {
    title: "AI Insights",
    desc: "Get automated reasoning on why certain stocks are performing well.",
    icon: Brain,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20"
  },
  {
    title: "Performance Tracking",
    desc: "Track realized vs unrealized gains over detailed timeframes.",
    icon: TrendingUp,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20"
  }
];

const LoadingScreen = ({ isVisible }) => {
  const [currentTip, setCurrentTip] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setProgress(0);
      return;
    }

    // Cycle tips every 2.5 seconds
    const tipInterval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % TIPS.length);
    }, 2500);

    // Fake progress bar
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return 90; // Stall at 90% until done
        return prev + (Math.random() * 15);
      });
    }, 800);

    return () => {
      clearInterval(tipInterval);
      clearInterval(progressInterval);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  const Tip = TIPS[currentTip];
  const Icon = Tip.icon;

  return (
    <div className="fixed inset-0 z-[10000] bg-slate-900 flex flex-col items-center justify-center font-sans text-white overflow-hidden">
      {/* Background Grid Effect */}
      <div className="absolute inset-0 opacity-10" 
           style={{ 
             backgroundImage: 'linear-gradient(#475569 1px, transparent 1px), linear-gradient(90deg, #475569 1px, transparent 1px)', 
             backgroundSize: '40px 40px' 
           }} 
      />
      
      {/* Radial Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900 pointer-events-none" />

      <div className="relative z-10 max-w-md w-full px-6 text-center">
        
        {/* Tip Card with 'Gaming' Aesthetic */}
        <div className="mb-12 relative group">
          <div className={`absolute -inset-1 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent blur-sm transition-all duration-500`} />
          
          <div className={`relative bg-slate-800/80 backdrop-blur-md border ${Tip.border} p-8 rounded-2xl shadow-2xl transform transition-all duration-500 ease-out`}>
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <Icon className="w-24 h-24 rotate-12" />
            </div>

            <div className={`inline-flex p-4 rounded-xl mb-6 ${Tip.bg} ${Tip.color} ring-1 ring-white/10 shadow-lg`}>
              <Icon className="w-8 h-8" />
            </div>
            
            <h2 className="text-2xl font-bold mb-3 tracking-tight text-white">
              {Tip.title}
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              {Tip.desc}
            </p>

            {/* Tip Pagination Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {TIPS.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentTip ? 'w-8 bg-white' : 'w-2 bg-slate-600'}`} 
                />
              ))}
            </div>
          </div>
        </div>

        {/* Loading Bar */}
        <div className="w-full bg-slate-800/50 rounded-full h-2 mb-4 overflow-hidden ring-1 ring-white/10">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex justify-between text-xs font-mono text-slate-500 uppercase tracking-widest">
          <span className="animate-pulse">Processing Portfolio Data...</span>
          <span>{Math.round(progress)}%</span>
        </div>

      </div>
    </div>
  );
};

export default LoadingScreen;
