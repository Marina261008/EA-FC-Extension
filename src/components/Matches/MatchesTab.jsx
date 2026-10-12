import React, { useState } from 'react';
import { Plus, Trophy, Calendar, MapPin, Award, Trash2, Filter, ArrowRightLeft, AlertTriangle } from 'lucide-react';
import { getClubLogo, getRealPlayerPhoto } from '../../clubsData';

export default function MatchesTab({
  season,
  clubName,
  onOpenMatchModal,
  onDeleteMatch
}) {
  const [filterComp, setFilterComp] = useState('ALL');
  const matches = season.matches || [];

  const competitions = ['ALL', ...new Set(matches.map(m => m.competition))];

  const filteredMatches = filterComp === 'ALL'
    ? matches
    : matches.filter(m => m.competition === filterComp);

  const getResultBadge = (result) => {
    if (result === 'Victoria') return 'bg-emerald-500/20 text-[#00ff87] border-emerald-500/30';
    if (result === 'Empate') return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  return (
    <div className="space-y-6">
      
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#101724] border border-[#1e2a3f] p-4 rounded-2xl">
        <div>
          <h2 className="text-lg font-black text-white font-display flex items-center gap-2">
            <span>Partidos de la Temporada</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#172235] text-slate-400 font-medium">
              {matches.length} jugados
            </span>
          </h2>
          <p className="text-xs text-slate-400">Historial de enfrentamientos, goleadores y estadísticas de cada choque</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Competition filter */}
          {competitions.length > 2 && (
            <div className="flex items-center gap-1 bg-[#151f30] px-2.5 py-1.5 rounded-xl border border-[#23334d]">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filterComp}
                onChange={(e) => setFilterComp(e.target.value)}
                className="bg-transparent text-xs text-white focus:outline-none"
              >
                {competitions.map((c) => (
                  <option key={c} value={c} className="bg-[#121927]">
                    {c === 'ALL' ? 'Todas las competiciones' : c}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={onOpenMatchModal}
            className="flex items-center gap-1.5 bg-[#00ff87] hover:bg-[#00e676] text-[#090d14] font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-[#00ff87]/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Añadir Partido</span>
          </button>
        </div>
      </div>

      {/* Match Cards List */}
      <div className="space-y-4">
        {filteredMatches.map((match) => (
          <div
            key={match.id}
            className="bg-[#101724] border border-[#1e2a3f] hover:border-[#283854] rounded-2xl p-4 sm:p-5 shadow-sm transition-all relative group"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#182335]">
              
              {/* Competition & Date */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  {match.competition}
                </span>
                <span className="text-xs text-slate-400 font-semibold">{match.matchday}</span>
                <span className="text-xs text-slate-500">•</span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {match.date}
                </span>
                {match.stadium && (
                  <span className="text-xs text-slate-500 hidden sm:flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {match.stadium}
                  </span>
                )}
              </div>

              {/* Result badge & Delete action */}
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getResultBadge(match.result)}`}>
                  {match.result}
                </span>
                <button
                  onClick={() => onDeleteMatch(match.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 rounded-lg transition-all"
                  title="Eliminar partido"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Scoreline */}
            <div className="py-4 flex items-center justify-center gap-4 sm:gap-8">
              <div className="flex items-center gap-3 flex-1 justify-end">
                <span className={`text-sm sm:text-base font-black truncate max-w-[150px] ${
                  match.homeTeam === clubName ? 'text-[#00ff87]' : 'text-white'
                }`}>
                  {match.homeTeam}
                </span>
                <img 
                  src={match.homeLogo || getClubLogo(match.homeTeam)} 
                  alt={match.homeTeam} 
                  className="w-7 h-7 sm:w-8 sm:h-8 object-contain shrink-0" 
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>

              <div className="bg-[#162234] border border-[#23334d] px-4 sm:px-6 py-2 rounded-xl text-xl sm:text-2xl font-black text-white flex items-center gap-3 font-display shadow-inner">
                <span className={match.homeScore > match.awayScore ? 'text-[#00ff87]' : 'text-white'}>
                  {match.homeScore}
                </span>
                <span className="text-slate-500 text-base font-normal">-</span>
                <span className={match.awayScore > match.homeScore ? 'text-[#00ff87]' : 'text-white'}>
                  {match.awayScore}
                </span>
              </div>

              <div className="flex items-center gap-3 flex-1 justify-start">
                <img 
                  src={match.awayLogo || getClubLogo(match.awayTeam)} 
                  alt={match.awayTeam} 
                  className="w-7 h-7 sm:w-8 sm:h-8 object-contain shrink-0" 
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <span className={`text-sm sm:text-base font-black truncate max-w-[150px] ${
                  match.awayTeam === clubName ? 'text-[#00ff87]' : 'text-white'
                }`}>
                  {match.awayTeam}
                </span>
              </div>
            </div>

            {/* MATCH EVENTS & STATISTICS GRID */}
            <div className="pt-4 border-t border-[#182335] space-y-3.5">
              
              {/* Event Columns: Col 1 = Goals, Col 2 = Incidents (Substitutions & Cards) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                
                {/* ⚽ GOALS SECTION */}
                <div className="bg-[#131b29] p-3 rounded-xl border border-[#1e2a3f] space-y-2">
                  <div className="flex items-center justify-between pb-1.5 border-b border-[#1b2538]">
                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <span>⚽</span>
                      <span>Goles del Partido</span>
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-950/70 text-[#00ff87] border border-emerald-500/30">
                      {match.scorers?.length || 0} {match.scorers?.length === 1 ? 'gol' : 'goles'}
                    </span>
                  </div>

                  {match.scorers && match.scorers.length > 0 ? (
                    <div className="space-y-1.5">
                      {match.scorers.map((s, idx) => {
                        const isRivalGoal = s.team === 'rival';
                        return (
                          <div
                            key={idx}
                            className={`flex items-center justify-between gap-2 p-2 rounded-lg border transition-all ${
                              isRivalGoal
                                ? 'bg-[#18202d] border-[#293649] text-slate-300'
                                : 'bg-[#152438] border-emerald-500/30 text-white shadow-sm'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="relative shrink-0">
                                <img
                                  src={getRealPlayerPhoto(s.player)}
                                  alt=""
                                  referrerPolicy="no-referrer"
                                  className="w-7 h-7 rounded-full object-cover object-top border-2 border-[#00ff87]/60 bg-[#090d14]"
                                  onError={(e) => { e.target.style.display = 'none'; }}
                                />
                                <span className="absolute -bottom-1 -right-1 text-[10px]">⚽</span>
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-xs truncate text-white">{s.player}</span>
                                  {isRivalGoal && (
                                    <span className="text-[9px] px-1 rounded bg-slate-700 text-slate-300 font-semibold shrink-0">
                                      Rival
                                    </span>
                                  )}
                                  {s.type && s.type !== 'Gol en Jugada' && (
                                    <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 shrink-0">
                                      {s.type}
                                    </span>
                                  )}
                                </div>
                                {s.assist && s.assist.trim() !== '' && (
                                  <p className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                                    <span className="text-slate-500">👟 Asist:</span>
                                    <span className="text-slate-300 font-medium">{s.assist}</span>
                                  </p>
                                )}
                              </div>
                            </div>

                            <span className="shrink-0 px-2 py-0.5 rounded-full text-xs font-black font-mono bg-[#090e17] text-[#00ff87] border border-[#00ff87]/30">
                              {s.minute}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-500 italic py-2 text-center">Sin goles en el encuentro</p>
                  )}
                </div>

                {/* 📋 INCIDENCES: SUBSTITUTIONS & CARDS */}
                <div className="space-y-3">
                  
                  {/* Substitutions */}
                  <div className="bg-[#131b29] p-3 rounded-xl border border-[#1e2a3f] space-y-2">
                    <div className="flex items-center justify-between pb-1.5 border-b border-[#1b2538]">
                      <span className="text-[11px] font-black uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                        <ArrowRightLeft className="w-3.5 h-3.5" />
                        <span>Sustituciones</span>
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-950/70 text-sky-400 border border-sky-500/30">
                        {match.substitutions?.length || 0}
                      </span>
                    </div>

                    {match.substitutions && match.substitutions.length > 0 ? (
                      <div className="space-y-1.5">
                        {match.substitutions.map((sub, idx) => (
                          <div key={idx} className="flex items-center justify-between gap-2 p-1.5 bg-[#172235] rounded-lg border border-[#24334a] text-xs">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-[10px] font-black font-mono px-1.5 py-0.5 rounded bg-[#0b1019] text-sky-400 shrink-0">
                                {sub.minute}
                              </span>
                              <div className="min-w-0 truncate text-[11px]">
                                <span className="text-emerald-400 font-bold">🟢 {sub.playerIn}</span>
                                <span className="text-slate-500 mx-1">⇄</span>
                                <span className="text-red-400 font-medium">🔴 {sub.playerOut}</span>
                              </div>
                            </div>
                            {sub.reason && sub.reason.trim() !== '' && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#0e1623] text-slate-400 shrink-0 font-medium border border-[#1f2c41]">
                                {sub.reason}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-500 italic py-1 text-center">Sin cambios registrados</p>
                    )}
                  </div>

                  {/* Cards */}
                  <div className="bg-[#131b29] p-3 rounded-xl border border-[#1e2a3f] space-y-2">
                    <div className="flex items-center justify-between pb-1.5 border-b border-[#1b2538]">
                      <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Tarjetas y Amonestaciones</span>
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-950/70 text-amber-400 border border-amber-500/30">
                        {match.cards?.length || 0}
                      </span>
                    </div>

                    {match.cards && match.cards.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {match.cards.map((c, idx) => (
                          <div
                            key={idx}
                            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-xs font-semibold ${
                              c.type === 'yellow'
                                ? 'bg-amber-950/40 text-amber-300 border-amber-500/40'
                                : c.type === 'red'
                                ? 'bg-red-950/40 text-red-300 border-red-500/40'
                                : 'bg-orange-950/40 text-orange-300 border-orange-500/40'
                            }`}
                          >
                            <span>{c.type === 'yellow' ? '🟨' : c.type === 'red' ? '🟥' : '🟨🟥'}</span>
                            <span className="font-mono text-[10px] text-slate-300">{c.minute}</span>
                            <span className="text-white text-[11px]">{c.player}</span>
                            {c.reason && <span className="text-[9px] opacity-75">({c.reason})</span>}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-500 italic py-1 text-center">Limpio · Sin tarjetas</p>
                    )}
                  </div>

                </div>

              </div>

              {/* Bottom bar: MVP & Stats & Notes */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs">
                <div className="flex items-center gap-3 flex-wrap">
                  {match.mvp && (
                    <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-amber-600/10 border border-amber-500/30 px-2.5 py-1 rounded-xl">
                      <img
                        src={getRealPlayerPhoto(match.mvp)}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="w-5 h-5 rounded-full object-cover object-top border border-amber-400/60 bg-[#090d14]"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-[11px] font-bold text-amber-300">MVP: {match.mvp}</span>
                    </div>
                  )}

                  {match.possession && (
                    <span className="text-slate-400 bg-[#141d2c] px-2.5 py-1 rounded-xl border border-[#202e42] text-[11px] font-medium">
                      📊 Posesión: <strong className="text-white">{match.possession}</strong>
                    </span>
                  )}

                  {match.shots && (
                    <span className="text-slate-400 bg-[#141d2c] px-2.5 py-1 rounded-xl border border-[#202e42] text-[11px] font-medium">
                      🎯 Tiros: <strong className="text-white">{match.shots}</strong>
                    </span>
                  )}
                </div>

                {match.notes && (
                  <p className="text-[11px] text-slate-400 italic bg-[#131b29] px-3 py-1.5 rounded-xl border border-[#1e2a3f] max-w-md truncate">
                    💬 "{match.notes}"
                  </p>
                )}
              </div>

            </div>

          </div>
        ))}

        {filteredMatches.length === 0 && (
          <div className="text-center py-12 bg-[#101724] border border-[#1e2a3f] rounded-2xl p-6">
            <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="font-bold text-white text-base mb-1">No hay partidos registrados</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
              Comienza a registrar los partidos de tu carrera para que las clasificaciones y estadísticas cobren vida.
            </p>
            <button
              onClick={onOpenMatchModal}
              className="bg-[#00ff87] text-[#090d14] font-bold text-xs px-4 py-2 rounded-xl"
            >
              Registrar Primer Partido
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
