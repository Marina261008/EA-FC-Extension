import React from 'react';
import { Award, Trophy, Shield, Zap, Flame, BarChart3 } from 'lucide-react';

export default function StatsTab({ season }) {
  const squad = season.squad || [];

  // Top scorers (sorted by goals desc)
  const topScorers = [...squad]
    .filter(p => p.goals > 0)
    .sort((a, b) => b.goals - a.goals);

  // Top assists (sorted by assists desc)
  const topAssists = [...squad]
    .filter(p => p.assists > 0)
    .sort((a, b) => b.assists - a.assists);

  // Top ratings (min 1 match, sorted by avgRating desc)
  const topRated = [...squad]
    .filter(p => p.matches > 0)
    .sort((a, b) => b.avgRating - a.avgRating);

  // Goalkeepers / Clean sheets
  const goalkeepers = [...squad]
    .filter(p => p.position === 'POR' || p.category === 'POR')
    .sort((a, b) => b.cleanSheets - a.cleanSheets);

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="bg-[#101724] border border-[#1e2a3f] p-4 rounded-2xl flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-white font-display flex items-center gap-2">
            <span>Estadísticas del Club</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950/60 text-[#00ff87] font-semibold border border-emerald-500/30">
              Rendimiento Individual
            </span>
          </h2>
          <p className="text-xs text-slate-400">Pichichi, máximos asistentes, porterías imbatidas y notas medias</p>
        </div>
      </div>

      {/* Grid of leaderboards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Pichichi / Máximos Goleadores */}
        <div className="bg-[#101724] border border-[#1e2a3f] rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-[#182335]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-[#00ff87] flex items-center justify-center font-bold">
                ⚽
              </div>
              <h3 className="font-extrabold text-white text-sm">
                Máximos Goleadores (Pichichi)
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-semibold">Goles</span>
          </div>

          <div className="space-y-2">
            {topScorers.slice(0, 5).map((player, idx) => (
              <div
                key={player.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#141d2c] border border-[#1e2a3f]"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-5 text-center font-black text-xs ${idx === 0 ? 'text-amber-400' : 'text-slate-500'}`}>
                    {idx + 1}º
                  </span>
                  <div>
                    <p className="font-bold text-white text-xs leading-tight">{player.name}</p>
                    <span className="text-[10px] text-slate-400">{player.position} · {player.matches} partidos</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-black text-[#00ff87] font-display">{player.goals}</span>
                  <span className="text-[10px] text-slate-400">goles</span>
                </div>
              </div>
            ))}
            {topScorers.length === 0 && (
              <p className="text-center py-6 text-xs text-slate-500">Sin goles registrados aún.</p>
            )}
          </div>
        </div>

        {/* Máximos Asistentes */}
        <div className="bg-[#101724] border border-[#1e2a3f] rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-[#182335]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
                🎯
              </div>
              <h3 className="font-extrabold text-white text-sm">
                Máximos Asistentes
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-semibold">Asistencias</span>
          </div>

          <div className="space-y-2">
            {topAssists.slice(0, 5).map((player, idx) => (
              <div
                key={player.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#141d2c] border border-[#1e2a3f]"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-5 text-center font-black text-xs ${idx === 0 ? 'text-sky-400' : 'text-slate-500'}`}>
                    {idx + 1}º
                  </span>
                  <div>
                    <p className="font-bold text-white text-xs leading-tight">{player.name}</p>
                    <span className="text-[10px] text-slate-400">{player.position} · {player.matches} partidos</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-black text-sky-400 font-display">{player.assists}</span>
                  <span className="text-[10px] text-slate-400">asist.</span>
                </div>
              </div>
            ))}
            {topAssists.length === 0 && (
              <p className="text-center py-6 text-xs text-slate-500">Sin asistencias registradas aún.</p>
            )}
          </div>
        </div>

        {/* Mejores Valoraciones */}
        <div className="bg-[#101724] border border-[#1e2a3f] rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-[#182335]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                ⭐
              </div>
              <h3 className="font-extrabold text-white text-sm">
                Mejores Notas Medias (MVP)
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-semibold">Media</span>
          </div>

          <div className="space-y-2">
            {topRated.slice(0, 5).map((player, idx) => (
              <div
                key={player.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#141d2c] border border-[#1e2a3f]"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-5 text-center font-black text-xs ${idx === 0 ? 'text-amber-400' : 'text-slate-500'}`}>
                    {idx + 1}º
                  </span>
                  <div>
                    <p className="font-bold text-white text-xs leading-tight">{player.name}</p>
                    <span className="text-[10px] text-slate-400">{player.position} · {player.matches} partidos</span>
                  </div>
                </div>
                <span className="text-xs font-black px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/30">
                  {player.avgRating}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Porterías a Cero */}
        <div className="bg-[#101724] border border-[#1e2a3f] rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-[#182335]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                🧤
              </div>
              <h3 className="font-extrabold text-white text-sm">
                Trofeo Zamora / Porterías Imbatidas
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-semibold">Clean Sheets</span>
          </div>

          <div className="space-y-2">
            {goalkeepers.map((gk, idx) => (
              <div
                key={gk.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#141d2c] border border-[#1e2a3f]"
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 text-center font-black text-xs text-purple-400">
                    {idx + 1}º
                  </span>
                  <div>
                    <p className="font-bold text-white text-xs leading-tight">{gk.name}</p>
                    <span className="text-[10px] text-slate-400">{gk.matches} partidos disputados</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-black text-purple-400 font-display">{gk.cleanSheets}</span>
                  <span className="text-[10px] text-slate-400">a cero</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
