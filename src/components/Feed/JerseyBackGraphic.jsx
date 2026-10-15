import React from 'react';
import { Shield, Sparkles, CheckCircle2, Award } from 'lucide-react';
import { getClubKit, getClubLogo } from '../../clubsData';

export default function JerseyBackGraphic({
  playerName = 'JUGADOR',
  playerNumber = '10',
  clubName = 'Mi Club',
  clubLogo = '',
  renewalYear = '2030',
  clause = '120.000.000 €',
  playerPhoto = '',
  playerPosition = 'DEL',
  playerRating = 83,
  bgImage = 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=1000&auto=format&fit=crop&q=80',
  date = '12 oct 2026'
}) {
  const kit = getClubKit(clubName);
  const crest = clubLogo || getClubLogo(clubName);

  // Clean uppercase name for jersey printing
  const printName = (playerName || 'JUGADOR').toUpperCase();
  const printNumber = String(playerNumber || renewalYear || '10');

  // Striped pattern SVG element ID
  const patternId = `stripes-${(clubName || 'club').replace(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <div className="relative min-h-[420px] sm:min-h-[480px] flex flex-col justify-between p-4 sm:p-7 overflow-hidden rounded-2xl bg-[#090d14] select-none text-white border border-[#273852] shadow-2xl">
      
      {/* 1. ATMOSPHERIC BACKGROUND PHOTO */}
      <img
        src={bgImage}
        alt="Locker Room & Stadium"
        className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.38] contrast-125 scale-105 pointer-events-none transition-transform duration-700"
        onError={(e) => {
          e.target.src = 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=1000&auto=format&fit=crop&q=80';
        }}
      />

      {/* 2. DYNAMIC SHADOWS & AMBIENT CLUB GLOW */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#060a12]/95 via-[#080e18]/70 to-[#060a12]/85 pointer-events-none"></div>
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none mix-blend-color-dodge"
        style={{
          background: `radial-gradient(circle at 50% 40%, ${kit.secondaryColor} 0%, transparent 65%)`
        }}
      ></div>

      {/* Giant Watermarked Crest in the Background */}
      {crest && (
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none overflow-hidden">
          <img
            src={crest}
            alt=""
            className="w-80 h-80 sm:w-96 sm:h-96 object-contain filter grayscale"
          />
        </div>
      )}

      {/* 3. TOP BANNER: Tag + Renewal Year Badge */}
      <div className="relative z-10 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-black shadow-lg shadow-amber-500/20 uppercase tracking-wider">
          <Award className="w-3.5 h-3.5 text-black stroke-[2.5]" />
          <span>RENOVACIÓN OFICIAL</span>
        </span>

        <span className="text-xs font-black text-amber-300 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-amber-500/40 shadow">
          🔒 HASTA {renewalYear}
        </span>
      </div>

      {/* 4. CENTERPIECE: REALISTIC FOOTBALL JERSEY SEEN FROM BEHIND */}
      <div className="relative z-10 my-3 sm:my-5 flex flex-col items-center justify-center">
        
        {/* The Jersey Back Container */}
        <div className="relative w-64 sm:w-80 h-72 sm:h-88 flex flex-col items-center justify-start filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)]">
          
          {/* SVG Shape of the Jersey from the Back */}
          <svg 
            viewBox="0 0 300 340" 
            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
          >
            <defs>
              {/* Vertical Stripes pattern if club wears stripes */}
              {kit.pattern === 'vertical-stripes' && kit.stripeColor && (
                <pattern id={patternId} width="40" height="40" patternUnits="userSpaceOnUse">
                  <rect width="20" height="40" fill={kit.jerseyColor} />
                  <rect x="20" width="20" height="40" fill={kit.stripeColor} />
                </pattern>
              )}

              {/* Diagonal Sash pattern if River Plate style */}
              {kit.pattern === 'sash' && (
                <pattern id={patternId} width="300" height="340" patternUnits="userSpaceOnUse">
                  <rect width="300" height="340" fill={kit.jerseyColor} />
                  <polygon points="0,60 80,0 300,280 220,340" fill={kit.secondaryColor} opacity="0.95" />
                </pattern>
              )}

              {/* Horizontal stripe pattern if Boca Juniors style */}
              {kit.pattern === 'horizontal-stripes' && (
                <pattern id={patternId} width="300" height="340" patternUnits="userSpaceOnUse">
                  <rect width="300" height="340" fill={kit.jerseyColor} />
                  <rect y="120" width="300" height="70" fill={kit.secondaryColor} />
                </pattern>
              )}

              {/* Mesh texture & realistic cloth shading */}
              <linearGradient id="jerseyShade" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
                <stop offset="50%" stopColor="#000000" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.4" />
              </linearGradient>

              {/* Athletic 3D side seams lighting */}
              <linearGradient id="sideShadow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#000000" stopOpacity="0.35" />
                <stop offset="15%" stopColor="#000000" stopOpacity="0" />
                <stop offset="85%" stopColor="#000000" stopOpacity="0" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.35" />
              </linearGradient>
            </defs>

            {/* Jersey Body Path */}
            <path
              d="M 95 24 
                 C 120 38, 180 38, 205 24 
                 L 275 62 
                 L 255 125 
                 L 225 110 
                 L 225 320 
                 C 150 330, 150 330, 75 320 
                 L 75 110 
                 L 45 125 
                 L 25 62 
                 Z"
              fill={kit.pattern !== 'solid' ? `url(#${patternId})` : kit.jerseyColor}
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="2"
            />

            {/* Cloth light & shadow overlay */}
            <path
              d="M 95 24 
                 C 120 38, 180 38, 205 24 
                 L 275 62 
                 L 255 125 
                 L 225 110 
                 L 225 320 
                 C 150 330, 150 330, 75 320 
                 L 75 110 
                 L 45 125 
                 L 25 62 
                 Z"
              fill="url(#jerseyShade)"
            />

            <path
              d="M 95 24 
                 C 120 38, 180 38, 205 24 
                 L 275 62 
                 L 255 125 
                 L 225 110 
                 L 225 320 
                 C 150 330, 150 330, 75 320 
                 L 75 110 
                 L 45 125 
                 L 25 62 
                 Z"
              fill="url(#sideShadow)"
            />

            {/* Ribbed Back Collar */}
            <path
              d="M 95 24 C 120 38, 180 38, 205 24 C 185 30, 115 30, 95 24 Z"
              fill={kit.collarColor}
              stroke="rgba(0,0,0,0.3)"
              strokeWidth="1.5"
            />

            {/* Left & Right Sleeve Cuffs */}
            <path d="M 25 62 L 45 125 L 35 120 L 15 58 Z" fill={kit.cuffColor} opacity="0.9" />
            <path d="M 275 62 L 255 125 L 265 120 L 285 58 Z" fill={kit.cuffColor} opacity="0.9" />
          </svg>

          {/* BACK OF THE NECK BADGE (Collar Label) */}
          <div className="absolute top-8 z-10 flex items-center justify-center">
            {crest ? (
              <img
                src={crest}
                alt=""
                className="w-5 h-5 object-contain filter drop-shadow opacity-90"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <span className="text-[10px] font-black text-white/80">★</span>
            )}
          </div>

          {/* PLAYER NAME ON UPPER BACK */}
          <div className="absolute top-16 sm:top-18 z-20 w-48 sm:w-56 text-center px-1">
            <h4 
              className="font-black font-display text-sm sm:text-base tracking-[0.25em] uppercase leading-none truncate"
              style={{
                color: kit.textColor,
                textShadow: `0 2px 5px rgba(0,0,0,0.8), 0 0 1px ${kit.textBorder}`
              }}
            >
              {printName}
            </h4>
          </div>

          {/* PLAYER NUMBER IN THE CENTER */}
          <div className="absolute top-24 sm:top-28 z-20 flex flex-col items-center justify-center">
            <div className="relative">
              <span
                className="block font-black font-display text-6xl sm:text-8xl tracking-tighter leading-none select-none text-center"
                style={{
                  color: kit.textColor,
                  WebkitTextStroke: `1.5px ${kit.textBorder}`,
                  textShadow: `3px 4px 10px rgba(0,0,0,0.85), 0 0 20px ${kit.secondaryColor}40`
                }}
              >
                {printNumber}
              </span>

              {/* Stamped Mini Club Crest inside the number base (Official Kit Style) */}
              {crest && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 sm:w-5 sm:h-5 p-0.5 rounded-full bg-black/60 border border-white/20 flex items-center justify-center shadow-lg">
                  <img
                    src={crest}
                    alt=""
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* 5. BOTTOM DETAILS FOOTER */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/10 bg-black/40 backdrop-blur-md px-3.5 py-2.5 rounded-xl">
        
        {/* Player Profile preview */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-full bg-[#182335] border-2 border-amber-400/80 p-0.5 flex items-center justify-center shrink-0 overflow-hidden shadow-lg">
            {playerPhoto ? (
              <img
                src={playerPhoto}
                alt={playerName}
                className="w-full h-full object-cover object-top rounded-full"
                onError={(e) => {
                  e.target.src = './default_player.svg';
                }}
              />
            ) : (
              <span className="text-xs font-bold text-white">
                {playerName.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-extrabold text-white text-xs sm:text-sm truncate">
                {playerName}
              </span>
              <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-amber-400 text-black uppercase">
                {playerPosition} · {playerRating} OVR
              </span>
            </div>
            <p className="text-[11px] text-slate-300 truncate">
              {clubName} · Cláusula: <strong className="text-white">{clause}</strong>
            </p>
          </div>
        </div>

        {/* Date & Seal */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] text-amber-300 font-mono font-semibold">
            📅 {date}
          </span>
        </div>

      </div>

    </div>
  );
}
