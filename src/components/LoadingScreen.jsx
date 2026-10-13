import React, { useState, useEffect } from 'react';
import { Sparkles, Trophy, Shield, Users, Compass, Flame, Play, Clock, Award } from 'lucide-react';

const GENERAL_TIPS = [
  "Consejo Táctico: Ajusta la táctica según tu rival para contrarrestar sus puntos fuertes.",
  "Consejo de Cantera: Ojea jóvenes promesas con potencial 90+ para venderlas o liderar tu proyecto.",
  "Consejo Financiero: Controla la masa salarial para no comprometer el presupuesto de fichajes.",
  "Consejo de Prensa: Tus ruedas de prensa y comunicados oficiales afectan la moral del vestuario.",
  "Consejo Míster IA: Puedes pulsar el botón flotante de Míster IA en cualquier momento para pedir análisis tácticos."
];

export default function LoadingScreen({ career = null, onFinish, duration = 4600 }) {
  const [progress, setProgress] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const clubName = career?.manager?.club || 'Club';
  const managerName = career?.manager?.name || 'Mánager';
  const leagueName = career?.manager?.league || 'Competición Oficial';
  const stadiumName = career?.manager?.stadium || 'Estadio';
  const clubLogo = career?.manager?.clubLogo;
  const gameVersion = career?.gameVersion || 'EA FC 26';
  const seasonPeriod = career?.seasons?.[0]?.period || '2025/26';
  const squadCount = career?.seasons?.[0]?.squad?.length || 23;

  // Contextual loading phases
  const phases = career ? [
    { text: `Iniciando partida guardada de ${clubName}...`, icon: Shield },
    { text: `Cargando táctica y plantilla de ${managerName} (${squadCount} futbolistas)...`, icon: Users },
    { text: `Sincronizando calendario y clasificación de ${leagueName}...`, icon: Trophy },
    { text: `Verificando informes de ojeadores y centro de fichajes...`, icon: Compass },
    { text: `¡Todo listo, Míster! Entrando al vestuario en ${stadiumName}...`, icon: Sparkles }
  ] : [
    { text: "Iniciando motor gráfico HyperMotion y simulación táctica...", icon: Sparkles },
    { text: "Cargando base de datos oficial de 133 clubes y 10 ligas...", icon: Shield },
    { text: "Sincronizando 2.022 futbolistas reales con fotos y estadísticas oficiales...", icon: Users },
    { text: "Cargando tus partidas guardadas del Modo Carrera...", icon: Trophy },
    { text: "¡Todo listo, Míster! Entrando al Hub de Modos Carrera...", icon: Sparkles }
  ];

  // Cycling tip every 1.5 seconds
  useEffect(() => {
    const tipInterval = setInterval(() => {
      setTipIndex(prev => (prev + 1) % GENERAL_TIPS.length);
    }, 1500);
    return () => clearInterval(tipInterval);
  }, []);

  useEffect(() => {
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct < 22) setPhaseIndex(0);
      else if (pct < 45) setPhaseIndex(1);
      else if (pct < 70) setPhaseIndex(2);
      else if (pct < 92) setPhaseIndex(3);
      else setPhaseIndex(4);

      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsFadingOut(true);
          setTimeout(() => {
            if (onFinish) onFinish();
          }, 450);
        }, 300);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [onFinish, duration]);

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
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-[#00ff87]/15 to-[#00b4d8]/15 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#00ff87]/10 rounded-full blur-[120px]" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-[#0077b6]/10 rounded-full blur-[120px]" />

        {/* Geometric EA FC decorative polygons */}
        <div className="absolute top-12 left-16 w-8 h-8 border border-[#00ff87]/20 rotate-45 animate-spin" style={{ animationDuration: '24s' }} />
        <div className="absolute bottom-20 right-20 w-12 h-12 border border-[#00b4d8]/20 rotate-12 animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-[#00ff87]/25 rotate-45" />
      </div>

      {/* Skip Button */}
      <button
        onClick={handleSkip}
        className="absolute top-6 right-6 px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-400 hover:text-white transition-all backdrop-blur-md flex items-center gap-1.5 group cursor-pointer shadow-lg"
      >
        <span>Saltar intro</span>
        <span className="text-[#00ff87] group-hover:translate-x-0.5 transition-transform">→</span>
      </button>

      {/* Center Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-lg w-full">
        
        {/* ======================================================== */}
        {/* CASE 1: SPECIFIC SAVED CAREER LOADING VIEW */}
        {/* ======================================================== */}
        {career ? (
          <>
            {/* Club Crest with Glowing Aura */}
            <div className="relative mb-6 group">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#00ff87] to-[#00b4d8] rounded-3xl blur-2xl opacity-40 animate-pulse" />
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-[#0c1322] border-2 border-[#00ff87]/60 flex items-center justify-center shadow-2xl shadow-[#00ff87]/30 p-4">
                {clubLogo ? (
                  <img
                    src={clubLogo}
                    alt={clubName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] animate-pulse"
                    style={{ animationDuration: '3s' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://crests.football-data.org/95.svg';
                    }}
                  />
                ) : (
                  <Shield className="w-16 h-16 text-[#00ff87]" />
                )}
                {/* Glowing status indicator */}
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#00ff87] rounded-full border-2 border-[#070b12] animate-ping" />
              </div>
            </div>

            {/* Club & Career Details */}
            <div className="space-y-1 mb-2">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#00ff87] bg-[#00ff87]/10 px-3 py-0.5 rounded-full border border-[#00ff87]/25">
                  MODO CARRERA OFICIAL
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-300 bg-[#162338] px-2 py-0.5 rounded-md border border-[#25354e]">
                  {gameVersion}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-wide text-white uppercase font-display drop-shadow-md">
                {clubName}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-semibold flex items-center justify-center gap-2">
                <span>Mánager: <strong className="text-white">{managerName}</strong></span>
                <span>•</span>
                <span className="text-slate-400">{leagueName}</span>
              </p>
              <p className="text-[11px] text-slate-400">
                Temporada {seasonPeriod} • {squadCount} jugadores en plantilla
              </p>
            </div>
          </>
        ) : (
          /* ======================================================== */
          /* CASE 2: GENERAL EA SPORTS FC CAREER HUB LAUNCH VIEW      */
          /* ======================================================== */
          <>
            {/* Animated FC Hexagon Emblem */}
            <div className="relative mb-8 group">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#00ff87] to-[#00b4d8] rounded-3xl blur-2xl opacity-40 animate-pulse" />
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-[#121a29] to-[#0b101b] border-2 border-[#00ff87]/60 flex items-center justify-center shadow-2xl shadow-[#00ff87]/30 transform hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#00ff87] to-[#00dfa2] flex items-center justify-center shadow-inner">
                  <span className="font-black text-[#070b12] text-3xl sm:text-4xl tracking-tighter italic font-display">
                    FC
                  </span>
                </div>
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#00ff87] rounded-full border-2 border-[#070b12] animate-ping" />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-1 mb-2">
              <div className="flex items-center justify-center gap-2">
                <span className="text-[11px] sm:text-xs font-black uppercase tracking-[0.35em] text-[#00ff87] bg-[#00ff87]/10 px-3 py-0.5 rounded-full border border-[#00ff87]/20">
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
          </>
        )}

        {/* Progress Container */}
        <div className="w-full mt-6 space-y-3">
          
          {/* Progress Bar with glowing head */}
          <div className="relative w-full h-2.5 bg-[#121927] rounded-full overflow-hidden border border-white/10 p-0.5 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-[#00ff87] via-[#00dfa2] to-[#00b4d8] rounded-full transition-all duration-75 relative shadow-[0_0_15px_rgba(0,255,135,0.8)]"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
            </div>
          </div>

          {/* Info & Percentage */}
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono px-1">
            <div className="flex items-center gap-2 text-slate-300 truncate max-w-[280px] sm:max-w-[360px]">
              <CurrentIcon className="w-4 h-4 text-[#00ff87] shrink-0 animate-spin" style={{ animationDuration: '3s' }} />
              <span className="truncate text-xs font-medium">
                {phases[phaseIndex]?.text}
              </span>
            </div>
            <span className="font-extrabold text-[#00ff87] text-xs shrink-0 tracking-wider">
              {progress}%
            </span>
          </div>

          {/* Dynamic Pro Tip Card */}
          <div className="mt-4 p-3 rounded-2xl bg-[#0e1625]/80 border border-[#1d2b40] text-center backdrop-blur-sm transition-all duration-300">
            <p className="text-[11px] text-slate-300 font-medium leading-relaxed italic">
              {GENERAL_TIPS[tipIndex]}
            </p>
          </div>
        </div>
      </div>

      {/* Footer Version Info */}
      <div className="absolute bottom-6 flex items-center gap-3 text-[11px] text-slate-500 font-semibold tracking-wider uppercase">
        <span>{career ? `${career.gameVersion || 'EA FC 26'} • PARTIDA ACTIVA` : 'EA FC 26 / FC 27 EDITION'}</span>
        <span>•</span>
        <span>133 CLUBES</span>
        <span>•</span>
        <span>2.022 JUGADORES</span>
      </div>
    </div>
  );
}
