import React from 'react';
import { 
  Plus, 
  ArrowRight, 
  CheckCircle2, 
  Circle, 
  ShieldCheck, 
  TrendingUp, 
  Calendar,
  Award,
  Wallet,
  AlertCircle
} from 'lucide-react';
import { getClubLogo } from '../../clubsData';

export default function OverviewTab({
  season,
  career,
  onOpenQuickAddModal,
  onToggleObjective,
  onNavigateToTab
}) {
  const { stats, transfersIn, transfersOut, objectives, rules, budget } = season;

  // Helper for Rating Badge Color (e.g. 80+ green, 75-79 light green, 70-74 yellow, <70 orange)
  const getRatingBadgeClass = (rating) => {
    if (rating >= 80) return 'bg-[#033b24] text-[#00ff87] border-[#00ff87]/40';
    if (rating >= 75) return 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30';
    if (rating >= 70) return 'bg-amber-950/60 text-amber-300 border-amber-500/30';
    return 'bg-orange-950/60 text-orange-400 border-orange-500/30';
  };

  return (
    <div className="space-y-6">
      
      {/* Title Header: Capítulo 1 · 2025/26 [En curso] matching screenshot */}
      <div className="flex items-center gap-3">
        <h2 className="text-sm sm:text-base font-bold text-slate-300 font-display">
          Capítulo 1 · {season.period}
        </h2>
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#033b24] text-[#00ff87] border border-[#00ff87]/30">
          {season.status || 'En curso'}
        </span>
      </div>

      {/* Top 4 Stat Cards matching screenshot */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Posición */}
        <div className="bg-[#101724] border border-[#1e2a3f] rounded-2xl p-4 shadow-sm hover:border-[#2b3c58] transition-all">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Posición
          </p>
          <div className="text-2xl sm:text-3xl font-black text-white font-display">
            {stats.position || '—'}
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-medium">LALIGA EA SPORTS</p>
        </div>

        {/* Puntos */}
        <div className="bg-[#101724] border border-[#1e2a3f] rounded-2xl p-4 shadow-sm hover:border-[#2b3c58] transition-all">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Puntos
          </p>
          <div className="text-2xl sm:text-3xl font-black text-[#00ff87] font-display">
            {stats.points !== undefined ? `${stats.points} pts` : '—'}
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-medium">Disputados 3 partidos</p>
        </div>

        {/* V-E-D */}
        <div className="bg-[#101724] border border-[#1e2a3f] rounded-2xl p-4 shadow-sm hover:border-[#2b3c58] transition-all">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            V - E - D
          </p>
          <div className="text-2xl sm:text-3xl font-black text-white font-display">
            {stats.wins !== undefined ? `${stats.wins}-${stats.draws}-${stats.losses}` : '—'}
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-medium">Victorias / Emp / Der</p>
        </div>

        {/* Goles */}
        <div className="bg-[#101724] border border-[#1e2a3f] rounded-2xl p-4 shadow-sm hover:border-[#2b3c58] transition-all">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Goles
          </p>
          <div className="text-2xl sm:text-3xl font-black text-white font-display">
            {stats.goalsFor !== undefined ? `${stats.goalsFor} : ${stats.goalsAgainst}` : '—'}
          </div>
          <p className="text-[10px] text-emerald-400 mt-1 font-medium">
            +{stats.goalsFor - stats.goalsAgainst} dif. goles
          </p>
        </div>
      </div>

      {/* Two Transfer Tables matching screenshot */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Principales fichajes Card */}
        <div className="bg-[#101724] border border-[#1e2a3f] rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1b2537]">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 text-sm">➔</span>
              <h3 className="font-extrabold text-white text-sm sm:text-base">
                Principales fichajes
              </h3>
            </div>
            <button
              onClick={() => onOpenQuickAddModal('transferIn')}
              className="flex items-center gap-1 text-[11px] font-bold text-slate-300 hover:text-[#00ff87] bg-[#162234] hover:bg-[#1b2a40] border border-[#23334d] px-2.5 py-1.5 rounded-lg transition-colors"
            >
              <Plus className="w-3 h-3" />
              <span>Añadir Fichaje</span>
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[11px] text-slate-400 border-b border-[#182335]">
                  <th className="pb-2 font-medium">Jugador/Posición</th>
                  <th className="pb-2 font-medium text-center">Edad</th>
                  <th className="pb-2 font-medium text-center">País</th>
                  <th className="pb-2 font-medium text-center">Media</th>
                  <th className="pb-2 font-medium text-center">Club</th>
                  <th className="pb-2 font-medium text-right">Coste</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#162030]">
                {transfersIn.slice(0, 5).map((player) => (
                  <tr key={player.id} className="hover:bg-[#141d2d]/60 transition-colors">
                    <td className="py-2.5 pr-2">
                      <div className="flex items-center gap-2.5">
                        {player.photo ? (
                          <img 
                            src={player.photo} 
                            alt={player.name} 
                            className="w-8 h-8 rounded-full object-cover border border-[#25354e] shrink-0 shadow bg-[#151f30]" 
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[#172235] border border-[#25354e] flex items-center justify-center font-bold text-slate-300 text-[10px] shrink-0">
                            {player.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-white leading-tight">{player.name}</p>
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-1 rounded">
                            {player.position}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 text-center text-slate-300 font-medium">
                      {player.age}
                    </td>
                    <td className="py-2.5 text-center text-base" title={player.country}>
                      {player.flag || '🏳️'}
                    </td>
                    <td className="py-2.5 text-center">
                      <span className={`inline-block text-[11px] font-extrabold px-1.5 py-0.5 rounded border ${getRatingBadgeClass(player.rating)}`}>
                        {player.rating}
                      </span>
                    </td>
                    <td className="py-2.5 text-center">
                      <div className="flex items-center justify-center" title={player.clubFrom}>
                        <img 
                          src={player.clubLogo || getClubLogo(player.clubFrom)} 
                          alt={player.clubFrom} 
                          className="w-5 h-5 object-contain"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      </div>
                    </td>
                    <td className="py-2.5 text-right font-bold text-white">
                      {player.cost}
                    </td>
                  </tr>
                ))}
                {transfersIn.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-6 text-center text-slate-500">
                      No hay fichajes registrados en esta temporada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="pt-3 mt-2 border-t border-[#182335] text-right">
            <button
              onClick={() => onNavigateToTab('transfers')}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 transition-colors"
            >
              <span>Todas las altas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Salidas más destacadas Card */}
        <div className="bg-[#101724] border border-[#1e2a3f] rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1b2537]">
            <div className="flex items-center gap-2">
              <span className="text-amber-400 text-sm">➔</span>
              <h3 className="font-extrabold text-white text-sm sm:text-base">
                Salidas más destacadas
              </h3>
            </div>
            <button
              onClick={() => onOpenQuickAddModal('transferOut')}
              className="flex items-center gap-1 text-[11px] font-bold text-slate-300 hover:text-amber-400 bg-[#162234] hover:bg-[#1b2a40] border border-[#23334d] px-2.5 py-1.5 rounded-lg transition-colors"
            >
              <Plus className="w-3 h-3" />
              <span>Añadir venta</span>
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[11px] text-slate-400 border-b border-[#182335]">
                  <th className="pb-2 font-medium">Jugador/Posición</th>
                  <th className="pb-2 font-medium text-center">Edad</th>
                  <th className="pb-2 font-medium text-center">País</th>
                  <th className="pb-2 font-medium text-center">Media</th>
                  <th className="pb-2 font-medium text-center">Club</th>
                  <th className="pb-2 font-medium text-right">Coste</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#162030]">
                {transfersOut.slice(0, 5).map((player) => (
                  <tr key={player.id} className="hover:bg-[#141d2d]/60 transition-colors">
                    <td className="py-2.5 pr-2">
                      <div className="flex items-center gap-2.5">
                        {player.photo ? (
                          <img 
                            src={player.photo} 
                            alt={player.name} 
                            className="w-8 h-8 rounded-full object-cover border border-[#25354e] shrink-0 shadow bg-[#151f30]" 
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[#172235] border border-[#25354e] flex items-center justify-center font-bold text-slate-300 text-[10px] shrink-0">
                            {player.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-white leading-tight">{player.name}</p>
                          <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 px-1 rounded">
                            {player.position}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 text-center text-slate-300 font-medium">
                      {player.age}
                    </td>
                    <td className="py-2.5 text-center text-base" title={player.country}>
                      {player.flag || '🇪🇸'}
                    </td>
                    <td className="py-2.5 text-center">
                      <span className={`inline-block text-[11px] font-extrabold px-1.5 py-0.5 rounded border ${getRatingBadgeClass(player.rating)}`}>
                        {player.rating}
                      </span>
                    </td>
                    <td className="py-2.5 text-center">
                      <div className="flex items-center justify-center" title={player.clubTo}>
                        <img 
                          src={player.clubLogo || getClubLogo(player.clubTo)} 
                          alt={player.clubTo} 
                          className="w-5 h-5 object-contain"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      </div>
                    </td>
                    <td className="py-2.5 text-right font-bold text-white">
                      {player.cost}
                    </td>
                  </tr>
                ))}
                {transfersOut.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-6 text-center text-slate-500">
                      No hay salidas registradas en esta temporada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="pt-3 mt-2 border-t border-[#182335] text-right">
            <button
              onClick={() => onNavigateToTab('transfers')}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 transition-colors"
            >
              <span>Todas las bajas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Section: OBJETIVOS & REGLAS matching screenshot */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* OBJETIVOS */}
        <div className="bg-[#101724] border border-[#1e2a3f] rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#1b2537]">
            <h3 className="font-extrabold text-white text-xs sm:text-sm tracking-wider uppercase text-slate-300">
              OBJETIVOS
            </h3>
            <button
              onClick={() => onOpenQuickAddModal('objective')}
              className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>Añadir Objetivo</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {objectives.map((obj) => (
              <div 
                key={obj.id}
                onClick={() => onToggleObjective(obj.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                  obj.completed 
                    ? 'bg-[#0b171c]/70 border-emerald-500/30 text-slate-300' 
                    : 'bg-[#141c2b] border-[#223049] hover:border-[#304364] text-slate-200'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {obj.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-[#00ff87]" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-500 hover:text-emerald-400" />
                  )}
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <p className={`font-bold text-xs ${obj.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                      {obj.title}
                    </p>
                    {obj.priority && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                        obj.priority === 'Crítica' ? 'bg-red-500/20 text-red-400' :
                        obj.priority === 'Alta' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-700 text-slate-300'
                      }`}>
                        {obj.priority}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {obj.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* REGLAS */}
        <div className="bg-[#101724] border border-[#1e2a3f] rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#1b2537]">
            <h3 className="font-extrabold text-white text-xs sm:text-sm tracking-wider uppercase text-slate-300">
              REGLAS
            </h3>
            <button
              onClick={() => onOpenQuickAddModal('rule')}
              className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>Añadir Regla</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {rules.map((rule, idx) => (
              <div 
                key={rule.id || idx}
                className="p-3 rounded-xl bg-[#141c2b] border border-[#223049] flex items-start gap-2.5 text-xs text-slate-300"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <p className="text-[11px] leading-relaxed font-medium">
                  {rule.text}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Latest Official Announcement Preview Banner */}
      {career.posts && career.posts.length > 0 && (
        <div className="bg-[#101724] border border-[#1e2a3f] hover:border-[#283854] rounded-2xl p-4 sm:p-5 shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-[#00ff87] flex items-center justify-center font-bold shrink-0">
              📢
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-xs sm:text-sm">
                  Último Comunicado Oficial: {career.posts[0]?.graphic?.title || career.posts[0]?.text?.slice(0, 30)}
                </span>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-[#033b24] text-[#00ff87] font-bold">
                  {career.posts[0]?.graphic?.tag || 'Oficial'}
                </span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                {career.posts[0]?.text}
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateToTab('presentation')}
            className="text-xs font-bold text-[#00ff87] hover:underline flex items-center gap-1 shrink-0"
          >
            <span>Ver Feed Oficial ({career.posts.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
}
