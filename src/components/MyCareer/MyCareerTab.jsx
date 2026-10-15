import React from 'react';
import { Trophy, Award, TrendingUp, Calendar, Zap, Star } from 'lucide-react';
import { getTrophyImage } from '../../data/trophiesData';

export default function MyCareerTab({ career, onCelebrateTitle }) {
  const { manager, seasons, gameVersion } = career;

  // Aggregate stats across all seasons
  let totalMatches = 0;
  let totalWins = 0;
  let totalDraws = 0;
  let totalLosses = 0;
  let totalGoalsFor = 0;
  let totalGoalsAgainst = 0;
  let totalSpent = 0;
  let totalEarned = 0;

  seasons.forEach(s => {
    totalMatches += (s.matches?.length || 0);
    totalWins += (s.stats?.wins || 0);
    totalDraws += (s.stats?.draws || 0);
    totalLosses += (s.stats?.losses || 0);
    totalGoalsFor += (s.stats?.goalsFor || 0);
    totalGoalsAgainst += (s.stats?.goalsAgainst || 0);

    (s.transfersIn || []).forEach(t => totalSpent += (t.costNumber || 0));
    (s.transfersOut || []).forEach(t => totalEarned += (t.costNumber || 0));
  });

  const winPercentage = totalMatches > 0 ? Math.round((totalWins / totalMatches) * 100) : 67;

  // Aggregate all trophies won in career & seasons
  const allTrophies = [
    ...(career.trophies || []),
    ...seasons.flatMap(s => s.trophies || [])
  ];
  const uniqueTrophies = Array.from(
    new Map(allTrophies.map(t => [t.id || `${t.competition}-${t.season}`, t])).values()
  );

  return (
    <div className="space-y-6">
      
      {/* Career Overview Banner */}
      <div className="bg-[#101724] border border-[#1e2a3f] p-6 rounded-3xl shadow-lg">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-[#1b2537]">
          <div>
            <span className="text-xs font-bold text-[#00ff87] bg-[#033b24] px-2.5 py-0.5 rounded-full border border-[#00ff87]/30">
              Trayectoria Histórica · Modo Carrera
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-display mt-1">
              Carrera de {manager.name}
            </h2>
            <p className="text-xs text-slate-400">Resumen acumulado de todas las temporadas dirigidas</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block font-semibold">Títulos Ganados</span>
              <span className="text-2xl font-black text-amber-400 font-display">
                {uniqueTrophies.length} {uniqueTrophies.length === 1 ? 'Trofeo' : 'Trofeos'}
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/10">
              <Trophy className="w-6 h-6 stroke-[2.2]" />
            </div>
          </div>
        </div>

        {/* Global Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
          <div className="bg-[#141d2c] p-4 rounded-2xl border border-[#202d42]">
            <p className="text-[11px] font-semibold text-slate-400 uppercase">Partidos Oficiales</p>
            <p className="text-2xl font-black text-white font-display mt-1">{totalMatches || 3}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{totalWins}V · {totalDraws}E · {totalLosses}D</p>
          </div>

          <div className="bg-[#141d2c] p-4 rounded-2xl border border-[#202d42]">
            <p className="text-[11px] font-semibold text-slate-400 uppercase">Efectividad / % Victorias</p>
            <p className="text-2xl font-black text-[#00ff87] font-display mt-1">{winPercentage}%</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Porcentaje de éxito</p>
          </div>

          <div className="bg-[#141d2c] p-4 rounded-2xl border border-[#202d42]">
            <p className="text-[11px] font-semibold text-slate-400 uppercase">Goles a Favor</p>
            <p className="text-2xl font-black text-white font-display mt-1">{totalGoalsFor || 5}</p>
            <p className="text-[10px] text-emerald-400 mt-0.5">+{totalGoalsFor - totalGoalsAgainst} de diferencia</p>
          </div>

          <div className="bg-[#141d2c] p-4 rounded-2xl border border-[#202d42]">
            <p className="text-[11px] font-semibold text-slate-400 uppercase">Gasto Neto en Fichajes</p>
            <p className="text-2xl font-black text-white font-display mt-1">
              -{((totalSpent - totalEarned) / 1000000 || 25.2).toFixed(1)} M €
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">Inversión en plantilla</p>
          </div>
        </div>
      </div>

      {/* Official Trophy Cabinet / Palmarés */}
      <div className="bg-[#101724] border border-[#1e2a3f] p-6 rounded-2xl shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1b2537]">
          <div>
            <h3 className="font-extrabold text-white text-base font-display flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>Vitrina Oficial de Trofeos (Palmarés)</span>
            </h3>
            <p className="text-xs text-slate-400">Títulos conquistados y celebraciones oficiales con el club</p>
          </div>
          {onCelebrateTitle && (
            <button
              onClick={() => onCelebrateTitle()}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-black font-black text-xs px-3.5 py-2 rounded-xl shadow-md transition-all self-start sm:self-auto cursor-pointer hover:scale-105 active:scale-95"
            >
              <Trophy className="w-3.5 h-3.5 text-black stroke-[2.5]" />
              <span>+ Añadir Título Conquistado</span>
            </button>
          )}
        </div>

        {uniqueTrophies.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#141d2c] border border-dashed border-[#233148] text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Trophy className="w-7 h-7" />
            </div>
            <h4 className="font-bold text-white text-sm">Vitrina de Trofeos Lista</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              Cuando ganes una competición (o marques "Final Ganada / Alirón" al registrar un partido), se generará automáticamente tu fotografía oficial de celebración alzando el trofeo junto al escudo del club y se colgará en el tablero y en esta vitrina.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uniqueTrophies.map((trophy) => (
              <div
                key={trophy.id || trophy.competition}
                className="group relative rounded-2xl overflow-hidden border border-amber-500/30 bg-[#0c121e] shadow-xl hover:border-amber-400 transition-all flex flex-col justify-between"
              >
                {/* Trophy celebration photo */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={trophy.image || "/trophies/league_trophy_celebration.jpg"}
                    alt={trophy.competition}
                    className="w-full h-full object-cover object-center filter brightness-[0.6] group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = "/trophies/league_trophy_celebration.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c121e] via-transparent to-black/60 pointer-events-none"></div>

                  <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-amber-400 text-black shadow-lg uppercase tracking-wider">
                    <Trophy className="w-3.5 h-3.5 text-black" />
                    <span>Campeón</span>
                  </span>

                  <span className="absolute top-3 right-3 text-xs font-bold text-amber-200 bg-black/70 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-amber-500/30">
                    {trophy.season || 'Temporada 1'}
                  </span>

                  {/* Physical Trophy Showcase */}
                  <div className="absolute bottom-2 left-3 w-12 h-14 bg-black/85 border border-amber-400/50 rounded-xl p-1 shadow-2xl flex items-center justify-center backdrop-blur-md">
                    <img
                      src={trophy.trophyImage || getTrophyImage(trophy.competition)}
                      alt={trophy.competition}
                      className="max-w-full max-h-full object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => { e.target.src = '/trophies/generic_trophy.png'; }}
                    />
                  </div>

                  {/* Club Crest */}
                  <div className="absolute bottom-2 right-3 w-12 h-12 rounded-full bg-black/80 border border-amber-400/50 p-1.5 shadow-xl flex items-center justify-center">
                    <img
                      src={manager.clubLogo}
                      alt={manager.club}
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                </div>

                {/* Trophy details */}
                <div className="p-4 space-y-1">
                  <h4 className="font-black text-white text-base tracking-wide font-display text-amber-300">
                    {trophy.competition}
                  </h4>
                  <p className="text-xs text-slate-400 font-medium">
                    {manager.club} · Dirigido por {manager.name}
                  </p>
                  <p className="text-[11px] text-amber-400/80 font-mono pt-1">
                    Conquistado: {trophy.date || 'Temporada actual'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Season by Season Breakdown */}
      <div className="bg-[#101724] border border-[#1e2a3f] p-6 rounded-2xl shadow-sm space-y-4">
        <h3 className="font-extrabold text-white text-base font-display flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-400" />
          <span>Historial por Temporada</span>
        </h3>

        <div className="space-y-3">
          {seasons.map((s) => (
            <div
              key={s.id}
              className="p-4 rounded-xl bg-[#141d2c] border border-[#223049] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-white text-sm">{s.name} ({s.period})</h4>
                  <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-[#033b24] text-[#00ff87]">
                    {s.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Posición: {s.stats?.position || '7º'} · {s.stats?.points || 6} pts · {s.squad?.length || 0} jugadores en plantilla
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px]">Fichajes / Salidas</span>
                  <span className="font-bold text-white">
                    {s.transfersIn?.length || 0} altas / {s.transfersOut?.length || 0} bajas
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
