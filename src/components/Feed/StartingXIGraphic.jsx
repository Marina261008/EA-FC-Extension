import React, { useState } from 'react';
import { Shield, User, Trophy, LayoutGrid, List } from 'lucide-react';
import { getClubTheme } from '../../clubsData';
import { FORMATION_COORDINATES } from '../../data/presetImages';

export default function StartingXIGraphic({
  lineupData,
  clubName = 'Valencia CF',
  clubLogo = '',
  managerName = 'Entrenador'
}) {
  const [viewMode, setViewMode] = useState('pitch'); // 'pitch' | 'list'

  const {
    bgImage = 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&auto=format&fit=crop&q=80',
    formation = '4-3-3',
    starting11 = [],
    bench = [],
    rivalName = 'Rival Oficial',
    rivalLogo = '',
    competition = 'LALIGA EA SPORTS',
    matchday = 'Jornada Oficial',
    stadium = ''
  } = lineupData || {};

  const theme = getClubTheme(clubName);
  const coords = FORMATION_COORDINATES[formation] || FORMATION_COORDINATES['4-3-3'];

  return (
    <div className="relative rounded-2xl overflow-hidden border border-[#273852] shadow-2xl bg-[#090d14] text-white select-none">
      
      {/* 1. PRESET BACKGROUND IMAGE */}
      <img
        src={bgImage}
        alt="Matchday Atmosphere"
        className="absolute inset-0 w-full h-full object-cover object-center scale-105 filter brightness-75 contrast-125 transition-transform duration-700"
      />

      {/* 2. CLUB BRANDED OVERLAYS */}
      {/* Deep stadium dark gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#080d15]/95 via-[#080d15]/80 to-[#080d15]/60 backdrop-blur-[2px]"></div>
      
      {/* Club Color Tint Accent */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none mix-blend-color-dodge"
        style={{
          background: `radial-gradient(ellipse at center, ${theme.primary} 0%, transparent 70%)`
        }}
      ></div>

      {/* Giant Watermarked Club Crest in Center Background */}
      {clubLogo && (
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none overflow-hidden">
          <img
            src={clubLogo}
            alt=""
            className="w-80 h-80 sm:w-96 sm:h-96 object-contain filter grayscale"
          />
        </div>
      )}

      {/* 3. FOREGROUND CONTENT OVER THE PRESET IMAGE */}
      <div className="relative z-10 flex flex-col p-4 sm:p-6 space-y-4">
        
        {/* HEADER: Pill + Match Details + Switch View Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          
          {/* Match Banner: Club vs Rival */}
          <div className="flex items-center gap-3">
            {/* Club Crest */}
            <div className="w-11 h-11 rounded-xl bg-black/60 border border-white/20 p-1.5 flex items-center justify-center shadow-lg shrink-0">
              {clubLogo ? (
                <img src={clubLogo} alt={clubName} className="max-w-full max-h-full object-contain" />
              ) : (
                <Shield className="w-6 h-6 text-[#00ff87]" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span 
                  className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow"
                  style={{ backgroundColor: theme.primary, color: '#090d14' }}
                >
                  11 INICIAL OFICIAL
                </span>
                <span className="text-xs font-bold text-slate-300">
                  {formation}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-black font-display tracking-tight text-white flex items-center gap-1.5 mt-0.5">
                <span>{clubName}</span>
                {rivalName && (
                  <>
                    <span className="text-slate-400 font-normal text-xs">vs</span>
                    <span className="text-slate-200">{rivalName}</span>
                  </>
                )}
              </h3>
            </div>
          </div>

          {/* Right Info: Competition + Switch View Button */}
          <div className="flex items-center justify-between sm:justify-end gap-3">
            <div className="text-left sm:text-right">
              <p className="text-[11px] font-bold text-slate-300">{competition}</p>
              <p className="text-[10px] text-slate-400">{matchday} {stadium ? `· ${stadium}` : ''}</p>
            </div>

            {/* Toggle View: Pitch vs List */}
            <div className="flex items-center bg-black/60 rounded-xl p-1 border border-white/10">
              <button
                type="button"
                onClick={() => setViewMode('pitch')}
                title="Vista Campo Táctico"
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'pitch' ? 'bg-[#00ff87] text-[#090d14]' : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                title="Vista Lista de Gala"
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-[#00ff87] text-[#090d14]' : 'text-slate-400 hover:text-white'
                }`}
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* BODY: EITHER TACTICAL PITCH OR BROADCAST LIST */}
        {viewMode === 'pitch' ? (
          /* PITCH VIEW WITH FORMATION PLOTTING */
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] max-h-[460px] rounded-xl overflow-hidden border border-white/15 bg-black/30 shadow-inner">
            
            {/* Soccer Pitch Markings (SVG overlay) */}
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none opacity-20 stroke-white"
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 100 100" 
              preserveAspectRatio="none"
              fill="none" 
              strokeWidth="0.5"
            >
              {/* Outer boundary */}
              <rect x="5" y="5" width="90" height="90" rx="2" />
              {/* Halfway line */}
              <line x1="5" y1="50" x2="95" y2="50" />
              {/* Center Circle */}
              <circle cx="50" cy="50" r="12" />
              <circle cx="50" cy="50" r="0.8" fill="white" />
              {/* Penalty Areas */}
              <rect x="25" y="5" width="50" height="16" />
              <rect x="35" y="5" width="30" height="7" />
              <rect x="25" y="79" width="50" height="16" />
              <rect x="35" y="88" width="30" height="7" />
            </svg>

            {/* Render 11 Players Plotted directly over the pitch */}
            {coords.map((c, idx) => {
              const player = starting11[idx] || {
                name: `Titular ${idx + 1}`,
                number: idx === 0 ? 1 : idx + 1,
                position: c.slot,
                photo: 'https://images.fotmob.com/image_resources/playerimages/819528.png'
              };

              const surname = player.name ? player.name.split(' ').pop().toUpperCase() : 'JUGADOR';

              return (
                <div
                  key={idx}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer transition-transform hover:scale-110 z-20"
                  style={{ left: `${c.x}%`, top: `${c.y}%` }}
                >
                  {/* Player Avatar Circle with Number Badge */}
                  <div className="relative">
                    <div 
                      className="w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden bg-[#162030] shadow-lg border-2 transition-all"
                      style={{ borderColor: theme.primary }}
                    >
                      <img
                        src={player.photo || "https://images.fotmob.com/image_resources/playerimages/819528.png"}
                        alt={player.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.fotmob.com/image_resources/playerimages/819528.png";
                        }}
                      />
                    </div>

                    {/* Number Badge Pill */}
                    <span 
                      className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 rounded-full text-[9px] font-black flex items-center justify-center shadow-md text-black"
                      style={{ backgroundColor: theme.primary }}
                    >
                      {player.number || (idx + 1)}
                    </span>
                  </div>

                  {/* Player Name Tag */}
                  <div className="mt-1 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10 shadow text-center min-w-[55px] max-w-[90px]">
                    <p className="text-[10px] sm:text-[11px] font-black text-white truncate tracking-tight">
                      {surname}
                    </p>
                    <p className="text-[8px] font-bold text-slate-400">
                      {player.position || c.slot}
                    </p>
                  </div>
                </div>
              );
            })}

          </div>
        ) : (
          /* BROADCAST OFFICIAL LIST VIEW */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-black/40 backdrop-blur-md p-3.5 rounded-xl border border-white/10 max-h-[460px] overflow-y-auto">
            {starting11.map((p, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-2 rounded-xl bg-[#121a28]/70 border border-white/5 hover:border-white/20 transition-colors"
              >
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs text-black shrink-0 shadow"
                  style={{ backgroundColor: theme.primary }}
                >
                  {p.number || (idx + 1)}
                </div>

                <div className="w-9 h-9 rounded-full overflow-hidden bg-[#182335] border border-white/20 shrink-0">
                  <img
                    src={p.photo || "https://images.fotmob.com/image_resources/playerimages/819528.png"}
                    alt={p.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.fotmob.com/image_resources/playerimages/819528.png";
                    }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-white truncate">{p.name}</p>
                  <p className="text-[10px] text-slate-400">{p.position} · {p.rating ? `${p.rating} OVR` : 'Titular'}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FOOTER: BANQUILLO / SUPLENTES & ENTRENADOR */}
        <div className="bg-black/60 backdrop-blur-md rounded-xl p-3 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          
          {/* Substitutes / Bench */}
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
              Banquillo de Suplentes
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {(bench && bench.length > 0 ? bench : [
                { name: 'Portero Suplente', number: 13 },
                { name: 'Defensa', number: 15 },
                { name: 'Centrocampista', number: 18 },
                { name: 'Extremo', number: 21 },
                { name: 'Delantero', number: 22 }
              ]).map((sub, i) => (
                <span 
                  key={i}
                  className="bg-[#152030] text-slate-200 px-2 py-0.5 rounded-lg border border-white/10 text-[10px] font-semibold"
                >
                  <strong className="text-white mr-1">{sub.number}.</strong>
                  {sub.name.split(' ').pop()}
                </span>
              ))}
            </div>
          </div>

          {/* Coach / Manager Name */}
          <div className="sm:border-l sm:border-white/10 sm:pl-4 shrink-0 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-[#00ff87] flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[9px] text-slate-400 uppercase tracking-widest block font-bold">
                Director Técnico
              </span>
              <p className="text-xs font-black text-white font-display">
                {managerName}
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
