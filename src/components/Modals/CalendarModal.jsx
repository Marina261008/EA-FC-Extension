import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  FastForward, 
  Clock, 
  Trophy, 
  Flame, 
  Check, 
  AlertCircle, 
  Sparkles, 
  RotateCcw, 
  ArrowRight,
  Shield,
  Send
} from 'lucide-react';
import { 
  SPANISH_MONTHS, 
  SPANISH_MONTHS_FULL, 
  parseSpanishDate, 
  formatSpanishDate, 
  addDaysToDate, 
  diffDays 
} from '../../utils/formatters';
import { getClubLogo } from '../../clubsData';

const WEEKDAYS = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];

export default function CalendarModal({ 
  isOpen, 
  onClose, 
  career, 
  season, 
  onSaveDate,
  onAutoPost
}) {
  if (!isOpen) return null;

  const manager = career?.manager || {};
  const currentInGameStr = manager.currentDate || manager.startDate || '01 jul 2025';
  const currentDateObj = parseSpanishDate(currentInGameStr);

  // Selected target date (starts at current in-game date)
  const [selectedDate, setSelectedDate] = useState(currentDateObj);
  
  // Currently viewed month/year in calendar navigation
  const [viewYear, setViewYear] = useState(currentDateObj.getFullYear());
  const [viewMonth, setViewMonth] = useState(currentDateObj.getMonth()); // 0-11

  // Option to auto-post news when advancing
  const [publishPost, setPublishPost] = useState(true);

  // When modal opens, sync view with current in-game date
  useEffect(() => {
    const d = parseSpanishDate(currentInGameStr);
    setSelectedDate(d);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  }, [currentInGameStr, isOpen]);

  // Calendar Math
  // Days in current viewMonth
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  // Day of week of the 1st day (0 = Sunday, 1 = Monday, ... 6 = Saturday)
  const firstDayWeekday = new Date(viewYear, viewMonth, 1).getDay();
  // Adjust so Monday is 0, Sunday is 6
  const startOffset = (firstDayWeekday + 6) % 7;

  // Days in previous month to fill padding
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  // Navigation handlers
  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(prev => prev - 1);
    } else {
      setViewMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(prev => prev + 1);
    } else {
      setViewMonth(prev => prev + 1);
    }
  };

  const handlePrevYear = () => setViewYear(prev => prev - 1);
  const handleNextYear = () => setViewYear(prev => prev + 1);

  // Quick jump actions
  const applyQuickAdvance = (daysToAdd) => {
    const nextDate = addDaysToDate(selectedDate, daysToAdd);
    setSelectedDate(nextDate);
    setViewMonth(nextDate.getMonth());
    setViewYear(nextDate.getFullYear());
  };

  const jumpToSpecific = (monthIdx, dayNum, targetYear = viewYear) => {
    const target = new Date(targetYear, monthIdx, dayNum);
    setSelectedDate(target);
    setViewMonth(monthIdx);
    setViewYear(targetYear);
  };

  const handleResetToCurrent = () => {
    setSelectedDate(currentDateObj);
    setViewMonth(currentDateObj.getMonth());
    setViewYear(currentDateObj.getFullYear());
  };

  // Matches for the current season
  const matches = season?.matches || [];

  // Find matches on a given day in the viewed month
  const getMatchesOnDay = (day) => {
    return matches.filter(m => {
      if (!m.date) return false;
      const mDate = parseSpanishDate(m.date);
      return (
        mDate.getDate() === day &&
        mDate.getMonth() === viewMonth &&
        mDate.getFullYear() === viewYear
      );
    });
  };

  // Find matches in this whole viewed month
  const matchesInViewedMonth = matches.filter(m => {
    if (!m.date) return false;
    const mDate = parseSpanishDate(m.date);
    return mDate.getMonth() === viewMonth && mDate.getFullYear() === viewYear;
  });

  // Calculate day difference
  const daysDifference = diffDays(selectedDate, currentDateObj);
  const formattedSelectedStr = formatSpanishDate(selectedDate);
  const isSameAsCurrent = formattedSelectedStr === currentInGameStr;

  // Determine period status of selected date
  const selMonth = selectedDate.getMonth();
  const selDay = selectedDate.getDate();
  const isSummerMarket = (selMonth === 6) || (selMonth === 7 && selDay <= 31);
  const isWinterMarket = (selMonth === 0 && selDay <= 31);
  const isMarketOpen = isSummerMarket || isWinterMarket;

  let periodBadge = {
    title: 'Competición Regular',
    sub: 'Fase de Liga y Torneos',
    color: 'text-sky-400 bg-sky-500/10 border-sky-500/20'
  };
  if (selMonth === 6) {
    periodBadge = {
      title: 'Pretemporada de Verano',
      sub: 'Mercado de Fichajes Abierto',
      color: 'text-[#00ff87] bg-emerald-500/10 border-emerald-500/30'
    };
  } else if (selMonth === 7 && selDay >= 25) {
    periodBadge = {
      title: '🚨 Deadline Day de Verano',
      sub: 'Cierre inminente del mercado (31 Ago)',
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/30 animate-pulse'
    };
  } else if (selMonth === 7) {
    periodBadge = {
      title: 'Mercado de Verano',
      sub: 'Ventana de fichajes activa',
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30'
    };
  } else if (selMonth === 0 && selDay >= 25) {
    periodBadge = {
      title: '❄️ Deadline Day de Invierno',
      sub: 'Cierre de ventana invernal (31 Ene)',
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30 animate-pulse'
    };
  } else if (selMonth === 0) {
    periodBadge = {
      title: '❄️ Mercado de Invierno',
      sub: 'Ventana de traspasos abierta',
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30'
    };
  } else if (selMonth === 4 || (selMonth === 5 && selDay <= 5)) {
    periodBadge = {
      title: '🏆 Recta Final y Finales',
      sub: 'Definición de títulos y copas',
      color: 'text-amber-300 bg-amber-500/10 border-amber-500/30'
    };
  } else if (selMonth === 5) {
    periodBadge = {
      title: 'Cierre de Temporada',
      sub: 'Evaluación y vacaciones',
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/30'
    };
  }

  // Handle saving
  const handleSave = () => {
    onSaveDate(formattedSelectedStr, {
      publishPost,
      daysAdvanced: daysDifference,
      previousDate: currentInGameStr
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#0c121d] border border-[#1e2d42] rounded-3xl max-w-4xl w-full shadow-2xl relative my-auto overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-1/4 w-96 h-32 bg-[#00ff87]/10 blur-[90px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-32 bg-sky-500/10 blur-[90px] pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#182335] bg-[#0f1725]/80 relative z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-[#00ff87]/30 flex items-center justify-center text-[#00ff87] shadow-inner">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white font-display tracking-wide">
                  Calendario y Avance de Fecha
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#172336] text-[#00ff87] border border-[#23354f]">
                  EA FC 25
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Avanza días, simula semanas y gestiona los plazos clave de tu carrera
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Current in-game date pill */}
            <div className="hidden md:flex items-center gap-2 bg-[#141e30] border border-[#203048] px-3 py-1.5 rounded-xl">
              <img 
                src={manager.clubLogo || getClubLogo(manager.club)} 
                alt={manager.club} 
                className="w-5 h-5 object-contain"
                onError={(e) => { e.target.src = getClubLogo(manager.club); }}
              />
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block leading-none">Fecha actual:</span>
                <span className="text-xs font-black text-[#00ff87] font-mono leading-tight">
                  {currentInGameStr}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-xl bg-[#141e30] hover:bg-[#1d2a42] border border-[#203048] transition-colors"
              title="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-y-auto flex-1 divide-y lg:divide-y-0 lg:divide-x divide-[#182335]">
          
          {/* Left / Center Column: Calendar & Shortcuts (8 Cols) */}
          <div className="lg:col-span-8 p-5 space-y-4">
            
            {/* Quick Advance Shortcuts Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <FastForward className="w-3.5 h-3.5 text-[#00ff87]" />
                  Avance Rápido de Simulación
                </span>
                {!isSameAsCurrent && (
                  <button
                    onClick={handleResetToCurrent}
                    className="text-[11px] text-slate-400 hover:text-[#00ff87] flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Volver a hoy</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => applyQuickAdvance(1)}
                  className="bg-[#131d2e] hover:bg-[#1b283e] hover:border-[#00ff87]/50 border border-[#213047] text-slate-200 hover:text-[#00ff87] font-semibold text-xs py-2 px-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                >
                  <span className="text-[#00ff87] font-black">+1</span>
                  <span>Día</span>
                </button>

                <button
                  type="button"
                  onClick={() => applyQuickAdvance(3)}
                  className="bg-[#131d2e] hover:bg-[#1b283e] hover:border-[#00ff87]/50 border border-[#213047] text-slate-200 hover:text-[#00ff87] font-semibold text-xs py-2 px-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                >
                  <span className="text-[#00ff87] font-black">+3</span>
                  <span>Días (Previa)</span>
                </button>

                <button
                  type="button"
                  onClick={() => applyQuickAdvance(7)}
                  className="bg-[#131d2e] hover:bg-[#1b283e] hover:border-[#00ff87]/50 border border-[#213047] text-slate-200 hover:text-[#00ff87] font-semibold text-xs py-2 px-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                >
                  <span className="text-[#00ff87] font-black">+7</span>
                  <span>Días (1 Sem)</span>
                </button>

                <button
                  type="button"
                  onClick={() => applyQuickAdvance(30)}
                  className="bg-[#131d2e] hover:bg-[#1b283e] hover:border-[#00ff87]/50 border border-[#213047] text-slate-200 hover:text-[#00ff87] font-semibold text-xs py-2 px-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                >
                  <span className="text-[#00ff87] font-black">+30</span>
                  <span>Días (1 Mes)</span>
                </button>
              </div>

              {/* Milestones / Season Critical Dates */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase mr-1">Hitos clave:</span>
                
                <button
                  type="button"
                  onClick={() => jumpToSpecific(7, 31, viewYear)}
                  className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                >
                  <span>🚨 31 Ago (Deadline Verano)</span>
                </button>

                <button
                  type="button"
                  onClick={() => jumpToSpecific(0, 31, viewMonth > 6 ? viewYear + 1 : viewYear)}
                  className="bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                >
                  <span>❄️ 31 Ene (Deadline Invierno)</span>
                </button>

                <button
                  type="button"
                  onClick={() => jumpToSpecific(5, 1, viewMonth > 6 ? viewYear + 1 : viewYear)}
                  className="bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                >
                  <span>🏆 1 Jun (Fin Temporada)</span>
                </button>
              </div>
            </div>

            {/* Interactive Calendar Month */}
            <div className="bg-[#111927] border border-[#1e2c42] rounded-2xl p-4 shadow-inner">
              
              {/* Calendar Month Navigation Header */}
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#1b263b]">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handlePrevYear}
                    title="Año anterior"
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#1a253a] transition-colors"
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    title="Mes anterior"
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#1a253a] transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-center">
                  <h3 className="text-sm sm:text-base font-black text-white capitalize tracking-wide font-display">
                    {SPANISH_MONTHS_FULL[viewMonth]} {viewYear}
                  </h3>
                  <span className="text-[10px] text-slate-400">
                    {matchesInViewedMonth.length > 0 
                      ? `${matchesInViewedMonth.length} partido(s) registrados` 
                      : 'Sin partidos oficiales registrados'}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    title="Mes siguiente"
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#1a253a] transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextYear}
                    title="Año siguiente"
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#1a253a] transition-colors"
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Day of week headers */}
              <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
                {WEEKDAYS.map((w, idx) => (
                  <div key={idx} className="text-[10px] font-bold text-slate-400 tracking-wider py-1">
                    {w}
                  </div>
                ))}
              </div>

              {/* Day cells grid (7 columns) */}
              <div className="grid grid-cols-7 gap-1">
                {/* Preceding padding days from previous month */}
                {Array.from({ length: startOffset }).map((_, i) => {
                  const dayNum = daysInPrevMonth - startOffset + i + 1;
                  return (
                    <div 
                      key={`prev-${i}`} 
                      className="h-11 sm:h-12 rounded-xl p-1 flex flex-col items-center justify-center opacity-25 text-slate-500 text-xs select-none"
                    >
                      <span>{dayNum}</span>
                    </div>
                  );
                })}

                {/* Current month days */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const thisDate = new Date(viewYear, viewMonth, day);

                  const isCurrentInGame = (
                    currentDateObj.getDate() === day &&
                    currentDateObj.getMonth() === viewMonth &&
                    currentDateObj.getFullYear() === viewYear
                  );

                  const isSelected = (
                    selectedDate.getDate() === day &&
                    selectedDate.getMonth() === viewMonth &&
                    selectedDate.getFullYear() === viewYear
                  );

                  const dayMatches = getMatchesOnDay(day);
                  const hasMatch = dayMatches.length > 0;
                  
                  // Key deadlines
                  const isDeadlineDay = (viewMonth === 7 && day === 31) || (viewMonth === 0 && day === 31);
                  const isSeasonEnd = (viewMonth === 5 && day === 1);

                  return (
                    <button
                      key={`day-${day}`}
                      type="button"
                      onClick={() => setSelectedDate(thisDate)}
                      className={`h-11 sm:h-12 rounded-xl p-1 flex flex-col items-center justify-between transition-all relative group border ${
                        isSelected
                          ? 'bg-[#00ff87] text-[#080d14] font-black border-[#00ff87] shadow-lg shadow-[#00ff87]/30 scale-105 z-10'
                          : isCurrentInGame
                          ? 'bg-[#18263a] text-[#00ff87] border-[#00ff87]/60 font-bold hover:bg-[#20314b]'
                          : hasMatch
                          ? 'bg-[#152033] text-amber-300 border-amber-500/40 hover:bg-[#1b2942]'
                          : isDeadlineDay
                          ? 'bg-rose-950/40 text-rose-300 border-rose-500/30 hover:bg-rose-900/50'
                          : isSeasonEnd
                          ? 'bg-amber-950/40 text-amber-300 border-amber-500/30 hover:bg-amber-900/50'
                          : 'bg-[#121a28] text-slate-300 border-[#1c293d] hover:bg-[#1a253a] hover:border-slate-500'
                      }`}
                    >
                      {/* Day number & indicators */}
                      <div className="w-full flex items-center justify-between px-1">
                        <span className={`text-[11px] sm:text-xs leading-none ${isSelected ? 'font-black text-[#080d14]' : ''}`}>
                          {day}
                        </span>

                        {isCurrentInGame && !isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00ff87] animate-ping" />
                        )}

                        {hasMatch && !isSelected && (
                          <span className="text-[10px] leading-none" title={`Partido jugado vs ${dayMatches[0].opponent || 'Rival'}`}>
                            ⚽
                          </span>
                        )}
                      </div>

                      {/* Bottom mini badges */}
                      <div className="w-full flex items-center justify-center">
                        {isSelected ? (
                          <span className="text-[9px] uppercase tracking-wider font-black text-[#080d14] px-1 bg-black/10 rounded">
                            {isCurrentInGame ? 'HOY' : 'ELEGIDO'}
                          </span>
                        ) : isCurrentInGame ? (
                          <span className="text-[8px] font-bold text-[#00ff87] tracking-wider">
                            HOY
                          </span>
                        ) : hasMatch ? (
                          <span className="text-[8px] font-bold text-amber-400 truncate max-w-full px-0.5">
                            {dayMatches[0].ourScore !== undefined ? `${dayMatches[0].ourScore}-${dayMatches[0].rivalScore}` : 'PARTIDO'}
                          </span>
                        ) : isDeadlineDay ? (
                          <span className="text-[8px] font-bold text-rose-400">
                            DEADLINE
                          </span>
                        ) : null}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Calendar Legend */}
              <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-[#1b263b] text-[10px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00ff87]/30 border border-[#00ff87]" />
                  <span>Fecha actual en juego</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-[#00ff87]" />
                  <span>Nueva fecha elegida</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-amber-400">⚽</span>
                  <span>Partido disputado</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-rose-500/30 border border-rose-500" />
                  <span>Cierre de fichajes</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Simulation Summary & Confirmation (4 Cols) */}
          <div className="lg:col-span-4 p-5 flex flex-col justify-between space-y-4 bg-[#0d1421]/60">
            
            <div className="space-y-4">
              {/* Header Box of Selected Period */}
              <div className={`p-3.5 rounded-2xl border ${periodBadge.color}`}>
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-black uppercase tracking-wider">
                    {periodBadge.title}
                  </span>
                </div>
                <p className="text-[11px] opacity-80">
                  {periodBadge.sub}
                </p>
                {isMarketOpen && (
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-[#00ff87] text-[10px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00ff87] animate-pulse" />
                    Mercado de Traspasos Abierto
                  </div>
                )}
              </div>

              {/* Target Date Details Box */}
              <div className="bg-[#121a28] border border-[#1e2c41] rounded-2xl p-4 space-y-3">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Resumen de la Simulación
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Fecha en partida:</span>
                    <span className="font-mono font-bold text-slate-300">{currentInGameStr}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Fecha seleccionada:</span>
                    <span className="font-mono font-black text-[#00ff87] text-sm">{formattedSelectedStr}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-[#1a2638]">
                    <span className="text-slate-400">Días a avanzar:</span>
                    <span className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                      daysDifference > 0 
                        ? 'bg-emerald-500/20 text-[#00ff87]' 
                        : daysDifference === 0 
                        ? 'bg-slate-800 text-slate-400' 
                        : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {daysDifference > 0 ? `+${daysDifference} días` : daysDifference === 0 ? 'Sin cambio' : `${daysDifference} días`}
                    </span>
                  </div>
                </div>

                {/* Impact Note */}
                <div className="bg-[#0b101a] p-2.5 rounded-xl border border-[#172233] text-[11px] text-slate-400 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-[#00ff87]" />
                    <span>Sincronización de Carrera</span>
                  </div>
                  <p className="leading-relaxed text-[10px]">
                    Al avanzar, los contratos de la plantilla y los filtros de la temporada se actualizarán en relación a esta nueva fecha.
                  </p>
                </div>
              </div>

              {/* Matches in selected month */}
              <div className="bg-[#121a28] border border-[#1e2c41] rounded-2xl p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Trophy className="w-3 h-3 text-amber-400" />
                    Partidos en {SPANISH_MONTHS_FULL[viewMonth]}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500">
                    {matchesInViewedMonth.length}
                  </span>
                </div>

                {matchesInViewedMonth.length === 0 ? (
                  <p className="text-[11px] text-slate-500 italic py-1">
                    No hay partidos disputados o agendados en este mes.
                  </p>
                ) : (
                  <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                    {matchesInViewedMonth.map((m, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center justify-between bg-[#0b101a] border border-[#192436] px-2.5 py-1.5 rounded-lg text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-[10px] font-mono text-slate-400 shrink-0">
                            {m.date ? m.date.slice(0, 6) : '—'}
                          </span>
                          <span className="font-semibold text-slate-200 truncate">
                            {m.opponent || 'Rival'}
                          </span>
                        </div>
                        <span className="font-mono font-black text-amber-300 shrink-0 ml-2">
                          {m.ourScore !== undefined ? `${m.ourScore} - ${m.rivalScore}` : 'Disp.'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Feed Post Checkbox */}
              <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#121a28] border border-[#1e2c41] cursor-pointer hover:bg-[#152133] transition-colors">
                <input 
                  type="checkbox"
                  checked={publishPost}
                  onChange={(e) => setPublishPost(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 bg-slate-900 text-[#00ff87] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <div className="text-[11px]">
                  <span className="font-bold text-slate-200 block">
                    Publicar actualización en el Feed
                  </span>
                  <span className="text-slate-400 text-[10px]">
                    Informa a la afición del avance hacia el {formattedSelectedStr}
                  </span>
                </div>
              </label>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-2 pt-2 border-t border-[#182335]">
              <button
                type="button"
                onClick={handleSave}
                className="w-full bg-gradient-to-r from-[#00ff87] to-[#00dfa2] hover:from-[#05f080] hover:to-[#00ce95] text-[#080d14] font-black text-xs sm:text-sm py-3 px-4 rounded-xl shadow-lg shadow-[#00ff87]/20 hover:shadow-[#00ff87]/40 transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                <FastForward className="w-4 h-4" />
                <span>Guardar Fecha ({formattedSelectedStr})</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full bg-[#131d2e] hover:bg-[#1a273e] text-slate-300 font-semibold text-xs py-2.5 px-4 rounded-xl border border-[#202f45] transition-colors"
              >
                Cancelar
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
