import React from 'react';
import { 
  LayoutDashboard, 
  Trophy, 
  Calendar, 
  ListOrdered, 
  Users, 
  ArrowLeftRight, 
  Sprout, 
  Camera, 
  EyeOff, 
  BarChart2, 
  CheckSquare, 
  ChevronDown,
  Plus
} from 'lucide-react';

export default function SeasonSidebar({
  seasons,
  activeSeason,
  activeSubTab,
  onSelectSubTab,
  onSelectSeason,
  onAddSeason,
  momentsCount = 7
}) {
  const menuItems = [
    { id: 'overview', label: 'Resumen', icon: LayoutDashboard },
    { id: 'matches', label: 'Partidos', icon: Trophy },
    { id: 'calendar', label: 'Calendario', icon: Calendar },
    { id: 'standings', label: 'Clasificación', icon: ListOrdered },
    { id: 'squad', label: 'Plantilla', icon: Users },
    { id: 'transfers', label: 'Mercado', icon: ArrowLeftRight },
    { id: 'youth', label: 'Cantera', icon: Sprout },
    { id: 'moments', label: 'Momentos', icon: Camera, badge: momentsCount },
    { id: 'privacy', label: 'Solo tú lo ves', icon: EyeOff, isToggle: true },
    { id: 'stats', label: 'Estadísticas', icon: BarChart2 },
    { id: 'rules', label: 'Reglas y Objetivos', icon: CheckSquare }
  ];

  return (
    <div className="w-full lg:w-60 shrink-0 space-y-4">
      {/* Season Selector Dropdown matching screenshot */}
      <div className="bg-[#101724] border border-[#1e2a3f] rounded-2xl p-3 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-sm">{activeSeason.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <p className="text-[11px] text-slate-400 font-medium">{activeSeason.period}</p>
          </div>
          <button
            onClick={onAddSeason}
            title="Crear nueva temporada"
            className="p-1 rounded-lg bg-[#182335] hover:bg-[#00ff87] hover:text-[#090d14] text-slate-300 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {seasons.length > 1 && (
          <div className="mt-2.5 pt-2 border-t border-[#1a2538] flex flex-wrap gap-1">
            {seasons.map((s) => (
              <button
                key={s.id}
                onClick={() => onSelectSeason(s.id)}
                className={`text-[10px] px-2 py-0.5 rounded font-semibold transition-all ${
                  s.id === activeSeason.id
                    ? 'bg-[#00ff87] text-[#090d14]'
                    : 'bg-[#162030] text-slate-400 hover:text-white'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Season Sidebar Menu Links */}
      <div className="bg-[#101724] border border-[#1e2a3f] rounded-2xl p-2 shadow-md">
        <nav className="space-y-0.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSubTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectSubTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#162234] text-[#00ff87] shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-[#151e2d]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#00ff87]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#1e2a3f] text-slate-300">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Quick Tips or Career Summary Card */}
      <div className="hidden lg:block bg-gradient-to-br from-[#121a28] to-[#0e1420] border border-[#1e2a3f] rounded-2xl p-3.5 text-xs text-slate-400">
        <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px] uppercase tracking-wider mb-1">
          <span>🎮 Modo Carrera EA FC</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          Registra cada jornada, transferencias y objetivos para tener el historial completo de tu club.
        </p>
      </div>
    </div>
  );
}
