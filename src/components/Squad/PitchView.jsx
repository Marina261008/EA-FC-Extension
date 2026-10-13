import React from 'react';
import { Shield, Users, Award, ChevronRight } from 'lucide-react';

export default function PitchView({ squad = [] }) {
  // 1. Identify Starting XI (Titulares)
  const titularSquad = squad.filter(p => p.status === 'Titular');
  const starters = titularSquad.length >= 11 ? titularSquad.slice(0, 11) : squad.slice(0, 11);

  // 2. Select starting 11 players for standard 4-3-3 formation uniquely without duplication
  const usedIds = new Set();

  const pickStarter = (pred, fallbackIndex) => {
    // Try to find matching position among starters that hasn't been placed yet
    const found = starters.find(p => !usedIds.has(p.id) && pred(p));
    if (found) {
      usedIds.add(found.id);
      return found;
    }
    // Fallback: pick any unused starter
    const fallback = starters.find(p => !usedIds.has(p.id)) || starters[fallbackIndex];
    if (fallback) usedIds.add(fallback.id);
    return fallback;
  };

  const gk = pickStarter(p => p.position === 'POR', 0);
  const rb = pickStarter(p => ['LD', 'CAD', 'RB'].includes(p.position), 1);
  const cb1 = pickStarter(p => ['DFC', 'CB'].includes(p.position), 2);
  const cb2 = pickStarter(p => ['DFC', 'CB', 'LD', 'LI'].includes(p.position), 3);
  const lb = pickStarter(p => ['LI', 'CAI', 'LB'].includes(p.position), 4);

  const mcd = pickStarter(p => ['MCD', 'CDM'].includes(p.position), 5);
  const mc1 = pickStarter(p => ['MC', 'CM'].includes(p.position), 6);
  const mco = pickStarter(p => ['MCO', 'CAM', 'MC', 'CM'].includes(p.position), 7);

  const rw = pickStarter(p => ['ED', 'MD', 'RW', 'RM'].includes(p.position), 8);
  const st = pickStarter(p => ['DC', 'SD', 'ST', 'CF'].includes(p.position), 9);
  const lw = pickStarter(p => ['EI', 'MI', 'LW', 'LM'].includes(p.position), 10);

  // Calculate Starting XI average rating
  const startingPlayers = [gk, rb, cb1, cb2, lb, mcd, mc1, mco, rw, st, lw].filter(Boolean);
  const avgOvr = startingPlayers.length > 0 
    ? Math.round(startingPlayers.reduce((sum, p) => sum + (p.rating || 0), 0) / startingPlayers.length) 
    : 0;

  // 3. Bench (Suplentes) - 7 officially convoked bench players
  const benchPlayers = squad.filter(p => p.status === 'Suplente');
  const availableNonStarters = squad.filter(p => !usedIds.has(p.id));
  const finalBench = benchPlayers.length > 0 
    ? benchPlayers.slice(0, 7)
    : availableNonStarters.slice(0, 7);

  const benchIds = new Set(finalBench.map(b => b.id));
  const reserves = squad.filter(p => !usedIds.has(p.id) && !benchIds.has(p.id));

  const renderPlayerBadge = (player, tacticalRole) => {
    if (!player) return null;
    return (
      <div className="flex flex-col items-center group cursor-pointer transition-transform hover:scale-110">
        <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-[#111927] border-2 border-[#00ff87] flex flex-col items-center justify-center shadow-lg shadow-black/80 relative overflow-hidden">
          {player.photo ? (
            <img 
              src={player.photo} 
              alt={player.name} 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top" 
              onError={(e) => { 
                e.target.onerror = null;
                e.target.src = "./default_player.svg"; 
              }}
            />
          ) : (
            <>
              <span className="text-[11px] sm:text-xs font-black text-white">{player.rating}</span>
              <span className="text-[8px] font-bold text-[#00ff87] leading-none">{tacticalRole || player.position}</span>
            </>
          )}
          <span className="absolute bottom-0 right-0 bg-[#00ff87] text-[#090d14] font-black text-[9px] px-1 rounded-tl leading-none shadow">
            {player.rating}
          </span>
          <span className="absolute top-0 left-0 bg-[#0b121e]/90 text-white font-black text-[8px] px-1 rounded-br leading-none border-r border-b border-white/20">
            #{player.number}
          </span>
        </div>
        <div className="bg-[#0b1019]/90 border border-[#1e2b40] px-1.5 py-0.5 rounded mt-1 shadow text-center max-w-[85px]">
          <p className="text-[10px] font-bold text-white truncate leading-tight">{player.name.split(' ').pop()}</p>
          <span className="text-[8px] font-bold text-[#00ff87] uppercase leading-none block">{player.position}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Pitch Card */}
      <div className="bg-[#0d1420] border border-[#1c293e] rounded-2xl p-4 sm:p-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-[#182335]">
          <div>
            <h3 className="font-extrabold text-white text-sm sm:text-base font-display flex items-center gap-2">
              <span>Alineación Táctica · 4-3-3 Ofensivo</span>
              <span className="text-[10px] bg-[#00ff87]/20 text-[#00ff87] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                11 Titulares Oficiales
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Distribución de los once iniciales sobre el terreno de juego</p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-[11px] bg-[#141e2e] text-slate-300 border border-[#23334d] px-2.5 py-1 rounded-xl font-bold flex items-center gap-1.5">
              <span>Media 11 Inicial:</span>
              <span className="text-[#00ff87] font-black text-xs">{avgOvr}</span>
            </span>
          </div>
        </div>

        {/* Football Pitch Graphic */}
        <div className="relative w-full h-[460px] sm:h-[510px] bg-gradient-to-b from-[#0c2419] via-[#08301f] to-[#0c2419] rounded-2xl border-2 border-emerald-600/40 overflow-hidden shadow-2xl flex flex-col justify-between py-4 px-2">
          
          {/* Pitch grass striping effect */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.14)_50%)] bg-[length:100%_42px] pointer-events-none"></div>

          {/* Pitch Lines */}
          <div className="absolute inset-3 border border-white/25 rounded-xl pointer-events-none"></div>
          <div className="absolute top-1/2 left-3 right-3 h-[1px] bg-white/20 pointer-events-none"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 sm:w-28 sm:h-28 border border-white/20 rounded-full pointer-events-none"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white/40 rounded-full pointer-events-none"></div>
          
          {/* Penalty Areas */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-48 sm:w-60 h-20 border-b border-x border-white/20 pointer-events-none rounded-b-lg"></div>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-48 sm:w-60 h-20 border-t border-x border-white/20 pointer-events-none rounded-t-lg"></div>

          {/* Attackers (Delantera) */}
          <div className="relative z-10 flex justify-around items-center px-4 pt-2">
            {renderPlayerBadge(lw, 'EI')}
            {renderPlayerBadge(st, 'DC')}
            {renderPlayerBadge(rw, 'ED')}
          </div>

          {/* Midfielders (Centrocampistas) */}
          <div className="relative z-10 flex justify-around items-center px-8">
            {renderPlayerBadge(mc1, 'MC')}
            {renderPlayerBadge(mcd, 'MCD')}
            {renderPlayerBadge(mco, 'MCO')}
          </div>

          {/* Defenders (Defensas) */}
          <div className="relative z-10 flex justify-around items-center px-4">
            {renderPlayerBadge(lb, 'LI')}
            {renderPlayerBadge(cb1, 'DFC')}
            {renderPlayerBadge(cb2, 'DFC')}
            {renderPlayerBadge(rb, 'LD')}
          </div>

          {/* Goalkeeper (Portero) */}
          <div className="relative z-10 flex justify-center items-center pb-2">
            {renderPlayerBadge(gk, 'POR')}
          </div>

        </div>
      </div>

      {/* Banquillo / Suplentes (7 Convocados) */}
      <div className="bg-[#0d1420] border border-[#1c293e] rounded-2xl p-4 sm:p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-[#182335]">
          <div className="flex items-center gap-2">
            <h4 className="text-xs sm:text-sm font-black text-white font-display flex items-center gap-2">
              <span>🔄 Banquillo de Suplentes</span>
              <span className="text-[10px] bg-sky-500/20 text-sky-400 px-2 py-0.5 rounded font-bold">
                {finalBench.length} Convocados
              </span>
            </h4>
          </div>
          <span className="text-[11px] text-slate-400">Listos para el recambio táctico</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
          {finalBench.map((sub, idx) => (
            <div 
              key={sub.id || idx} 
              className="bg-[#121b29] border border-[#1e2c42] hover:border-sky-500/50 rounded-xl p-2.5 flex flex-col items-center text-center transition-all group hover:bg-[#152234]"
            >
              <div className="relative mb-2">
                <img 
                  src={sub.photo || "./default_player.svg"}
                  alt={sub.name}
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-full object-cover object-top border-2 border-[#2b3c58] group-hover:border-sky-400 bg-[#090d14] transition-colors"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "./default_player.svg";
                  }}
                />
                <span className="absolute -bottom-1 -right-1 bg-sky-400 text-[#090d14] font-black text-[9px] px-1 rounded-full leading-none shadow">
                  {sub.rating}
                </span>
                <span className="absolute -top-1 -left-1 bg-[#090d14]/90 text-white font-black text-[8px] px-1 rounded-full border border-white/20">
                  #{sub.number || idx + 12}
                </span>
              </div>
              <p className="text-[11px] font-bold text-white truncate w-full leading-tight">
                {sub.name.split(' ').pop()}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#172336] text-emerald-400 border border-emerald-500/20">
                  {sub.position}
                </span>
                <span className="text-[9px] text-sky-400 font-semibold">
                  Pot {sub.potential}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reservas No Convocados */}
      {reserves.length > 0 && (
        <div className="bg-[#0d1420]/70 border border-[#182333] rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>Reservas del Club</span>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-bold">
                {reserves.length} Jugadores
              </span>
            </span>
            <span className="text-[11px] text-slate-500">Resto del plantel</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {reserves.map((res, idx) => (
              <div 
                key={res.id || idx} 
                className="bg-[#101724] border border-[#1b273b] hover:border-[#2a3c57] px-2.5 py-1.5 rounded-xl text-slate-300 flex items-center gap-2 text-xs transition-colors"
                title={`${res.name} (${res.position}) - OVR ${res.rating}`}
              >
                <img 
                  src={res.photo || "./default_player.svg"}
                  alt={res.name}
                  referrerPolicy="no-referrer"
                  className="w-5 h-5 rounded-full object-cover object-top border border-[#283850]"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "./default_player.svg";
                  }}
                />
                <span className="font-bold text-slate-400 text-[10px]">{res.position}</span>
                <span className="font-semibold text-white text-[11px]">{res.name.split(' ').pop()}</span>
                <span className="text-[#00ff87] font-bold text-[10px]">OVR {res.rating}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
