import React, { useState } from 'react';
import { 
  Calendar, 
  Plus, 
  MoreHorizontal, 
  Camera, 
  Edit3, 
  Trophy, 
  Shield, 
  ArrowUpRight, 
  Coins, 
  Sparkles,
  ChevronDown,
  CheckCircle2
} from 'lucide-react';
import { getLeagueLogo } from '../clubsData';

export default function CareerBanner({
  career,
  onOpenMatchModal,
  onOpenQuickAddModal,
  onOpenEditManagerModal,
  onOpenAIAssistant,
  onAdvanceDate,
  onNewSeason,
  onCelebrateTitle
}) {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const { manager, gameVersion } = career;

  return (
    <div className="relative bg-gradient-to-r from-[#101622] via-[#0d131d] to-[#121927] border-b border-[#1d273a] pt-6 pb-6 px-4 lg:px-8">
      {/* Background stadium blur subtle effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-950/20 via-transparent to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        
        {/* Left Side: Manager Avatar + Name + Badges + Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          {/* Manager Avatar with Change Button */}
          <div className="relative group shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-[#24334d] bg-[#162030] shadow-xl group-hover:border-[#00ff87] transition-all">
              <img
                src={manager.avatar || "https://images.fotmob.com/image_resources/playerimages/819528.png"}
                alt={manager.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.fotmob.com/image_resources/playerimages/819528.png";
                }}
              />
            </div>
            <button
              onClick={onOpenEditManagerModal}
              title="Editar perfil del entrenador"
              className="absolute -bottom-1 -right-1 bg-[#1a2436] hover:bg-[#00ff87] hover:text-[#090d14] text-slate-300 p-1.5 rounded-lg border border-[#2b3c58] shadow-md transition-all group-hover:scale-110"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Manager Info & Quick Action Buttons */}
          <div className="space-y-3">
            {/* Badges Row */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#033b24]/90 text-[#00ff87] border border-[#00ff87]/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff87] animate-pulse"></span>
                Actualizada justo ahora
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#172235] text-slate-300 border border-[#293c5c]">
                Modo Carrera
              </span>
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                {manager.nationality}
              </span>
            </div>

            {/* Manager Name */}
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2 font-display">
                {manager.name}
              </h1>
              <button 
                onClick={onOpenEditManagerModal}
                className="text-slate-400 hover:text-[#00ff87] transition-colors p-1"
                title="Editar nombre y detalles"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>

            {/* Action Buttons Row matching screenshot */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {/* Primary Green: + Añadir Partido */}
              <button
                onClick={onOpenMatchModal}
                className="flex items-center gap-1.5 bg-[#00ff87] hover:bg-[#00e676] active:scale-95 text-[#090d14] font-bold text-xs px-3.5 py-2 rounded-lg shadow-lg shadow-[#00ff87]/25 transition-all"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Añadir Partido</span>
              </button>

              {/* Míster IA Button */}
              {onOpenAIAssistant && (
                <button
                  onClick={onOpenAIAssistant}
                  className="flex items-center gap-1.5 bg-[#172133] hover:bg-[#1f2d45] border border-[#00ff87]/40 hover:border-[#00ff87] text-[#00ff87] font-bold text-xs px-3.5 py-2 rounded-lg shadow-md transition-all group"
                  title="Abrir Asistente Táctico y Ojeador IA"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#00ff87] group-hover:rotate-12 transition-transform" />
                  <span>Míster IA</span>
                </button>
              )}

              {/* + Añadir dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowAddMenu(!showAddMenu);
                    setShowActionsMenu(false);
                  }}
                  className="flex items-center gap-1.5 bg-[#172133] hover:bg-[#202e47] border border-[#263753] text-white font-semibold text-xs px-3 py-2 rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Añadir</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {showAddMenu && (
                  <div className="absolute left-0 mt-2 w-48 bg-[#121927] border border-[#233148] rounded-xl shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95">
                    <button
                      onClick={() => { setShowAddMenu(false); onOpenQuickAddModal('transferIn'); }}
                      className="w-full text-left px-3.5 py-2 text-xs text-slate-200 hover:bg-[#1a253a] hover:text-[#00ff87] flex items-center gap-2"
                    >
                      <span>📥 Fichaje (Alta)</span>
                    </button>
                    <button
                      onClick={() => { setShowAddMenu(false); onOpenQuickAddModal('transferOut'); }}
                      className="w-full text-left px-3.5 py-2 text-xs text-slate-200 hover:bg-[#1a253a] hover:text-amber-400 flex items-center gap-2"
                    >
                      <span>📤 Venta / Salida (Baja)</span>
                    </button>
                    <button
                      onClick={() => { setShowAddMenu(false); onOpenQuickAddModal('player'); }}
                      className="w-full text-left px-3.5 py-2 text-xs text-slate-200 hover:bg-[#1a253a] hover:text-sky-400 flex items-center gap-2"
                    >
                      <span>👥 Jugador de Plantilla</span>
                    </button>
                    <button
                      onClick={() => { setShowAddMenu(false); onOpenQuickAddModal('youth'); }}
                      className="w-full text-left px-3.5 py-2 text-xs text-slate-200 hover:bg-[#1a253a] hover:text-emerald-400 flex items-center gap-2"
                    >
                      <span>🌱 Promesa de Cantera</span>
                    </button>
                    <button
                      onClick={() => { setShowAddMenu(false); onOpenQuickAddModal('lineup'); }}
                      className="w-full text-left px-3.5 py-2 text-xs text-slate-200 hover:bg-[#1a253a] hover:text-[#00ff87] flex items-center gap-2"
                    >
                      <span>📋 Once Inicial (11 Titular)</span>
                    </button>
                    <button
                      onClick={() => { setShowAddMenu(false); onOpenQuickAddModal('post'); }}
                      className="w-full text-left px-3.5 py-2 text-xs text-slate-200 hover:bg-[#1a253a] hover:text-cyan-400 flex items-center gap-2"
                    >
                      <span>📢 Comunicado Oficial</span>
                    </button>
                    <button
                      onClick={() => { setShowAddMenu(false); onOpenQuickAddModal('objective'); }}
                      className="w-full text-left px-3.5 py-2 text-xs text-slate-200 hover:bg-[#1a253a] hover:text-purple-400 flex items-center gap-2"
                    >
                      <span>🎯 Objetivo de Directiva</span>
                    </button>
                    <button
                      onClick={() => { setShowAddMenu(false); onOpenQuickAddModal('moment'); }}
                      className="w-full text-left px-3.5 py-2 text-xs text-slate-200 hover:bg-[#1a253a] hover:text-pink-400 flex items-center gap-2"
                    >
                      <span>📸 Momento / Noticia</span>
                    </button>
                    {onCelebrateTitle && (
                      <button
                        onClick={() => {
                          setShowAddMenu(false);
                          const comp = prompt("Nombre de la competición ganada (ej. LALIGA EA SPORTS, UEFA Champions League, Copa del Rey):", career.manager.league || "LALIGA EA SPORTS");
                          if (comp) onCelebrateTitle(comp);
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs text-amber-300 hover:bg-[#1a253a] hover:text-amber-200 flex items-center gap-2 font-bold border-t border-[#1e2a3f]"
                      >
                        <Trophy className="w-3.5 h-3.5 text-amber-400" />
                        <span>🏆 Celebrar Título / Trofeo</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Date Button: 01 jul 2025 */}
              <button
                onClick={onAdvanceDate}
                title="Abrir Calendario y simular avance de fecha en el juego"
                className="flex items-center gap-2 bg-[#141e30] hover:bg-[#1c2a42] border border-[#23354f] hover:border-[#00ff87]/60 text-[#00ff87] font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-md group cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-[#00ff87] group-hover:scale-110 transition-transform" />
                <span className="font-mono tracking-tight">{manager.currentDate || manager.startDate}</span>
              </button>

              {/* ... Acciones dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowActionsMenu(!showActionsMenu);
                    setShowAddMenu(false);
                  }}
                  className="flex items-center gap-1.5 bg-[#172133] hover:bg-[#202e47] border border-[#263753] text-slate-300 font-semibold text-xs px-2.5 py-2 rounded-lg transition-colors"
                >
                  <MoreHorizontal className="w-4 h-4" />
                  <span>Acciones</span>
                </button>

                {showActionsMenu && (
                  <div className="absolute left-0 mt-2 w-56 bg-[#121927] border border-[#233148] rounded-xl shadow-2xl py-1.5 z-50">
                    <button
                      onClick={() => { setShowActionsMenu(false); onAdvanceDate && onAdvanceDate(); }}
                      className="w-full text-left px-3.5 py-2 text-xs text-slate-200 hover:bg-[#1a253a] hover:text-[#00ff87] flex items-center gap-2"
                    >
                      <Calendar className="w-3.5 h-3.5 text-[#00ff87]" />
                      <span>Calendario y Avanzar Fecha</span>
                    </button>
                    <button
                      onClick={() => { setShowActionsMenu(false); onOpenEditManagerModal(); }}
                      className="w-full text-left px-3.5 py-2 text-xs text-slate-200 hover:bg-[#1a253a] flex items-center gap-2"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Editar Club o Entrenador</span>
                    </button>
                    <button
                      onClick={() => { setShowActionsMenu(false); onNewSeason(); }}
                      className="w-full text-left px-3.5 py-2 text-xs text-slate-200 hover:bg-[#1a253a] flex items-center gap-2"
                    >
                      <Trophy className="w-3.5 h-3.5 text-amber-400" />
                      <span>Crear Próxima Temporada</span>
                    </button>
                    {onCelebrateTitle && (
                      <button
                        onClick={() => {
                          setShowActionsMenu(false);
                          const comp = prompt("Nombre de la competición ganada (ej. LALIGA EA SPORTS, UEFA Champions League, Copa del Rey):", career.manager.league || "LALIGA EA SPORTS");
                          if (comp) onCelebrateTitle(comp);
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs text-amber-300 hover:bg-[#1a253a] hover:text-amber-200 flex items-center gap-2 font-bold border-t border-[#1e2a3f]"
                      >
                        <Trophy className="w-3.5 h-3.5 text-amber-400" />
                        <span>🏆 Registrar Título Conquistado</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Club Badge & Info matching screenshot */}
        <div className="flex items-center justify-between lg:justify-end gap-5 bg-[#131b29]/80 border border-[#202c42] px-5 py-3.5 rounded-2xl shadow-md">
          <div className="text-right">
            <h2 className="text-xl font-black text-white tracking-wide font-display">
              {manager.club}
            </h2>
            <div className="flex items-center justify-end gap-1.5 text-xs text-slate-300 font-semibold">
              <img
                src={getLeagueLogo(manager.league)}
                alt=""
                referrerPolicy="no-referrer"
                className="w-4 h-4 object-contain"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <span>{manager.league}</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              {manager.currentDate || manager.startDate} en el juego
            </p>
          </div>

          <div className="w-14 h-14 rounded-xl bg-[#1b2537] border border-[#2a3c5a] p-2 flex items-center justify-center shrink-0 shadow-inner">
            <img
              src={manager.clubLogo}
              alt={manager.club}
              className="max-w-full max-h-full object-contain filter drop-shadow-md"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
