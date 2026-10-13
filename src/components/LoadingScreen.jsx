import React, { useState, useEffect } from 'react';
import { Sparkles, Trophy, Shield, Users } from 'lucide-react';

export default function LoadingScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const phases = [
    { text: "Iniciando motor gráfico y táctico de EA Sports FC...", icon: Sparkles },
    { text: "Cargando base de datos oficial de 133 clubes...", icon: Shield },
    { text: "Sincronizando más de 2.000 jugadores con fotos y estadísticas reales...", icon: Users },
    { text: "Cargando tus partidas guardadas del Modo Carrera...", icon: Trophy },
    { text: "¡Todo listo, Míster! Entrando al Hub...", icon: Sparkles }
  ];

  useEffect(() => {
    const startTime = Date.now();
    const duration = 2200; // 2.2 seconds total

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct < 25) setPhaseIndex(0);
      else if (pct < 50) setPhaseIndex(1);
      else if (pct < 75) setPhaseIndex(2);
      else if (pct < 95) setPhaseIndex(3);
      else setPhaseIndex(4);

      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsFadingOut(true);
          setTimeout(() => {
            if (onFinish) onFinish();
          }, 500);
        }, 300);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [onFinish]);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      if (onFinish) onFinish();
    }, 200);
  };

  const CurrentIcon = phases[phaseIndex]?.icon || Sparkles;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070b12] text-white select-none transition-opacity duration-500 overflow-hidden ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Dynamic Background Glows & EA FC Triangles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#00ff87]/15 to-[#00b4d8]/15 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#00ff87]/10 rounded-full blur-[120px]" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-[#0077b6]/10 rounded-full blur-[120px]" />

        {/* Geometric EA FC decorative polygons */}
        <div className="absolute top-12 left-16 w-8 h-8 border border-[#00ff87]/20 rotate-45 animate-spin" style={{ animationDuration: '20s' }} />
        <div className="absolute bottom-20 right-20 w-12 h-12 border border-[#00b4d8]/20 rotate-12 animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-[#00ff87]/20 rotate-45" />
      </div>

      {/* Skip Button */}
      <button
        onClick={handleSkip}
        className="absolute top-6 right-6 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-400 hover:text-white transition-all backdrop-blur-md"
      >
        Saltar intro →
      </button>

      {/* Center Logo & Branding */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-md">
        
        {/* Animated FC Hexagon Emblem */}
        <div className="relative mb-8 group">
          <div className="absolute -inset-4 bg-gradient-to-r from-[#00ff87] to-[#00b4d8] rounded-3xl blur-xl opacity-40 animate-pulse" />
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-[#121a29] to-[#0b101b] border-2 border-[#00ff87]/60 flex items-center justify-center shadow-2xl shadow-[#00ff87]/30 transform hover:scale-105 transition-transform duration-300">
            {/* Inner polygon styling */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#00ff87] to-[#00dfa2] flex items-center justify-center shadow-inner">
              <span className="font-black text-[#070b12] text-3xl sm:text-4xl tracking-tighter italic font-display">
                FC
              </span>
            </div>
            {/* Glowing corner dot */}
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#00ff87] rounded-full border-2 border-[#070b12] animate-ping" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1 mb-2">
          <div className="flex items-center justify-center gap-2">
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-[0.35em] text-[#00ff87] bg-[#00ff87]/10 px-2.5 py-0.5 rounded-full border border-[#00ff87]/20">
              EA SPORTS FC
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-wider text-white uppercase font-display drop-shadow-md">
            CAREER <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff87] to-[#00b4d8]">HUB</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            Simulador y Gestor de Modo Carrera
          </p>
        </div>

        {/* Progress Container */}
        <div className="w-full mt-8 space-y-3">
          
          {/* Progress Bar with glowing head */}
          <div className="relative w-full h-2.5 bg-[#121927] rounded-full overflow-hidden border border-white/5 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-[#00ff87] via-[#00dfa2] to-[#00b4d8] rounded-full transition-all duration-75 relative shadow-[0_0_15px_rgba(0,255,135,0.7)]"
              style={{ width: `${progress}%` }}
            >
              {/* Shine highlight */}
              <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
            </div>
          </div>

          {/* Info & Percentage */}
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono px-1">
            <div className="flex items-center gap-1.5 text-slate-300 truncate max-w-[260px] sm:max-w-[320px]">
              <CurrentIcon className="w-3.5 h-3.5 text-[#00ff87] shrink-0 animate-spin" style={{ animationDuration: '3s' }} />
              <span className="truncate text-[11px] sm:text-xs">
                {phases[phaseIndex]?.text}
              </span>
            </div>
            <span className="font-bold text-[#00ff87] text-xs shrink-0">
              {progress}%
            </span>
          </div>
        </div>
      </div>

      {/* Footer Version Info */}
      <div className="absolute bottom-6 flex items-center gap-3 text-[11px] text-slate-500 font-semibold tracking-wider uppercase">
        <span>EA FC 26 / FC 27 EDITION</span>
        <span>•</span>
        <span>133 CLUBES</span>
        <span>•</span>
        <span>2.022 JUGADORES</span>
      </div>
    </div>
  );
}
