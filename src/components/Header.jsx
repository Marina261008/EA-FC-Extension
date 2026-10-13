import React, { useState } from 'react';
import { 
  Plus, 
  Sparkles, 
  ChevronDown,
  LayoutGrid
} from 'lucide-react';

export default function Header({ 
  careers = [], 
  activeCareer, 
  onSelectCareer, 
  onNewCareer, 
  onGameVersionToggle,
  onOpenCareerHub
}) {
  const [showCareerMenu, setShowCareerMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#080c14]/95 backdrop-blur-md border-b border-[#1a2436] px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo & Optional Career Switcher */}
        <div className="flex items-center gap-4">
          <div 
            className="flex items-center gap-2.5 cursor-pointer group" 
            onClick={() => onOpenCareerHub ? onOpenCareerHub() : onSelectCareer(activeCareer.id)}
            title="Abrir Menú de Modos Carrera"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00ff87] to-[#00b4d8] flex items-center justify-center shadow-lg shadow-[#00ff87]/20 group-hover:scale-105 transition-transform">
              <span className="font-black text-[#080c14] text-base tracking-tighter">FC</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-white text-base tracking-wide font-display">CAREER</span>
                <span className="bg-[#00ff87] text-[#080c14] font-black text-[11px] px-1.5 py-0.5 rounded tracking-wider">HUB</span>
              </div>
            </div>
          </div>

          {/* Menú de Carreras Hub Button */}
          {onOpenCareerHub && (
            <button
              onClick={onOpenCareerHub}
              className="hidden md:flex items-center gap-2 bg-[#121926] hover:bg-[#182335] border border-[#222f44] hover:border-[#00ff87]/40 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-[#00ff87] transition-all shadow-sm"
              title="Ir al Menú Principal con todos los Modos Carrera"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-[#00ff87]" />
              <span>Mis Carreras</span>
            </button>
          )}

          {/* Quick Active Career Switcher Pill */}
          {careers.length > 1 && (
            <div className="relative hidden sm:block">
              <button
                onClick={() => setShowCareerMenu(!showCareerMenu)}
                className="flex items-center gap-2 bg-[#121926] hover:bg-[#182335] border border-[#222f44] px-2.5 py-1 rounded-xl text-xs font-semibold text-slate-300 transition-colors"
              >
                <img 
                  src={activeCareer.manager.clubLogo} 
                  alt="" 
                  className="w-4 h-4 object-contain"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <span className="max-w-[120px] truncate">{activeCareer.manager.club}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showCareerMenu && (
                <div className="absolute left-0 mt-2 w-60 bg-[#101726] border border-[#223049] rounded-2xl shadow-2xl py-2 z-50">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-[#1d293d]">
                    Mis Modos Carrera
                  </div>
                  <div className="max-h-56 overflow-y-auto">
                    {careers.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          onSelectCareer(c.id);
                          setShowCareerMenu(false);
                        }}
                        className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-[#182336] transition-colors ${
                          c.id === activeCareer.id ? 'bg-[#00ff87]/10 text-[#00ff87]' : 'text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <img 
                            src={c.manager.clubLogo} 
                            alt="" 
                            className="w-4 h-4 object-contain shrink-0" 
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                          <span className="text-xs font-semibold text-white truncate">{c.manager.club}</span>
                        </div>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-bold shrink-0">
                          {c.gameVersion}
                        </span>
                      </button>
                    ))}
                    {onOpenCareerHub && (
                      <div className="p-1 border-t border-[#1d293d] mt-1">
                        <button
                          onClick={() => {
                            setShowCareerMenu(false);
                            onOpenCareerHub();
                          }}
                          className="w-full py-1.5 px-3 rounded-lg text-center text-[11px] font-black text-[#00ff87] hover:bg-[#00ff87]/10 flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <LayoutGrid className="w-3.5 h-3.5" />
                          <span>Ver todas en el Menú Principal</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right side: Only the 2 requested elements */}
        <div className="flex items-center gap-3">
          
          {/* 1. Selector EA FC 26 / EA FC 27 */}
          <div className="flex items-center bg-[#111724] p-1 rounded-2xl border border-[#212f45] shadow-inner">
            <button
              type="button"
              onClick={() => onGameVersionToggle('EA FC26')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                activeCareer.gameVersion === 'EA FC26'
                  ? 'bg-gradient-to-r from-[#00ff87] to-[#10b981] text-[#080d14] shadow-md shadow-[#00ff87]/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>EA FC 26</span>
            </button>
            
            <button
              type="button"
              onClick={() => onGameVersionToggle('EA FC27')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                activeCareer.gameVersion === 'EA FC27'
                  ? 'bg-gradient-to-r from-[#38bdf8] to-[#6366f1] text-white shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3 h-3 text-sky-200" />
              <span>EA FC 27</span>
            </button>
          </div>

          {/* 2. Botón Crear Modo Carrera */}
          <button
            type="button"
            onClick={onNewCareer}
            className="flex items-center gap-2 bg-gradient-to-r from-[#00ff87] to-[#10b981] hover:brightness-110 active:scale-95 text-[#080d14] font-black text-xs sm:text-sm px-4 py-2 rounded-2xl shadow-xl shadow-[#00ff87]/20 transition-all transform hover:scale-105 cursor-pointer"
            title="Crear un nuevo modo carrera"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline">Crear Modo Carrera</span>
            <span className="sm:hidden">Crear</span>
          </button>

        </div>

      </div>
    </header>
  );
}
