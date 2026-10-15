import React from 'react';
import { Award, Shield, Sparkles, CheckCircle } from 'lucide-react';
import { getClubKit, getClubLogo } from '../../clubsData';
import { formatToFullEuros } from '../../utils/formatters';

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

  // Unique IDs for SVG patterns and paths
  const safeId = (clubName || 'club').replace(/[^a-zA-Z0-9]/g, '');
  const patternId = `kit-pattern-${safeId}`;
  const namePathId = `name-path-${safeId}-${Math.random().toString(36).substr(2, 4)}`;
  const meshPatternId = `mesh-pattern-${safeId}`;

  // Format clause safely with full dot format
  const formattedClause = formatToFullEuros(clause, '120.000.000 €');

  return (
    <div className="relative min-h-[460px] sm:min-h-[520px] flex flex-col justify-between p-4 sm:p-7 overflow-hidden rounded-2xl bg-[#070b12] select-none text-white border border-[#23344d] shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
      
      {/* 1. ATMOSPHERIC LOCKER ROOM / STADIUM PHOTO */}
      <img
        src={bgImage}
        alt="Locker Room & Stadium"
        className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.28] contrast-125 scale-105 pointer-events-none transition-transform duration-700"
        onError={(e) => {
          e.target.src = 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=1000&auto=format&fit=crop&q=80';
        }}
      />

      {/* 2. DYNAMIC STUDIO SPOTLIGHT & AMBIENT CLUB GLOW */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#05080e]/98 via-[#060b14]/75 to-[#05080e]/90 pointer-events-none"></div>
      
      {/* Dual stadium overhead spotlights */}
      <div 
        className="absolute -top-24 left-1/4 w-72 h-72 rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{ background: kit.secondaryColor || '#00ff87' }}
      ></div>
      <div 
        className="absolute -top-24 right-1/4 w-72 h-72 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: kit.jerseyColor || '#ffffff' }}
      ></div>

      {/* Giant Watermarked Crest in the Background */}
      {crest && (
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.09] pointer-events-none overflow-hidden">
          <img
            src={crest}
            alt=""
            className="w-88 h-88 sm:w-[420px] sm:h-[420px] object-contain filter grayscale contrast-150 transform scale-110"
          />
        </div>
      )}

      {/* 3. TOP BANNER: Official Renewal Tag + Renewal Year Badge */}
      <div className="relative z-10 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-black shadow-lg shadow-amber-500/25 uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-black stroke-[2.5]" />
            <span>RENOVACIÓN OFICIAL</span>
          </span>
          <span className="hidden sm:inline-block text-[11px] font-bold text-amber-300/90 tracking-wide uppercase">
            {clubName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-amber-300 bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-amber-500/40 shadow-lg flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span>HASTA {renewalYear}</span>
          </span>
        </div>
      </div>

      {/* 4. CENTERPIECE: ULTRA-REALISTIC 3D FOOTBALL JERSEY BACK */}
      <div className="relative z-10 my-2 sm:my-4 flex flex-col items-center justify-center">
        
        {/* The Jersey Silhouette Container with Realistic Drop Shadow */}
        <div className="relative w-[280px] sm:w-[340px] h-[310px] sm:h-[370px] flex items-center justify-center filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.9)]">
          
          <svg 
            viewBox="0 0 340 380" 
            className="w-full h-full overflow-visible select-none"
          >
            <defs>
              {/* Pattern: Vertical Stripes (Barça, Atleti, Inter, Milan, Racing, Betis, etc.) */}
              {kit.pattern === 'vertical-stripes' && kit.stripeColor && (
                <pattern id={patternId} width="40" height="40" patternUnits="userSpaceOnUse">
                  <rect width="20" height="40" fill={kit.jerseyColor} />
                  <rect x="20" width="20" height="40" fill={kit.stripeColor} />
                </pattern>
              )}

              {/* Pattern: Diagonal Sash (River Plate) */}
              {kit.pattern === 'sash' && (
                <pattern id={patternId} width="340" height="380" patternUnits="userSpaceOnUse">
                  <rect width="340" height="380" fill={kit.jerseyColor} />
                  <polygon points="0,70 90,0 340,310 250,380" fill={kit.secondaryColor} opacity="0.95" />
                </pattern>
              )}

              {/* Pattern: Horizontal Stripes / Chest Band (Boca Juniors, Stuttgart) */}
              {kit.pattern === 'horizontal-stripes' && (
                <pattern id={patternId} width="340" height="380" patternUnits="userSpaceOnUse">
                  <rect width="340" height="380" fill={kit.jerseyColor} />
                  <rect y="130" width="340" height="85" fill={kit.secondaryColor} />
                </pattern>
              )}

              {/* Pattern: Chevron (Vélez Sarsfield) */}
              {kit.pattern === 'chevron' && (
                <pattern id={patternId} width="340" height="380" patternUnits="userSpaceOnUse">
                  <rect width="340" height="380" fill={kit.jerseyColor} />
                  <polygon points="0,50 170,150 340,50 340,110 170,210 0,110" fill={kit.secondaryColor} />
                </pattern>
              )}

              {/* Pattern: Halves (Newell's Old Boys) */}
              {kit.pattern === 'halves' && (
                <pattern id={patternId} width="340" height="380" patternUnits="userSpaceOnUse">
                  <rect width="170" height="380" fill={kit.jerseyColor} />
                  <rect x="170" width="170" height="380" fill={kit.secondaryColor} />
                </pattern>
              )}

              {/* Micro-mesh breathable fabric filter */}
              <pattern id={meshPatternId} width="6" height="6" patternUnits="userSpaceOnUse">
                <circle cx="3" cy="3" r="0.75" fill="#000000" opacity="0.12" />
              </pattern>

              {/* Photorealistic 3D cloth lighting & folds */}
              <linearGradient id="clothLightGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
                <stop offset="35%" stopColor="#ffffff" stopOpacity="0.05" />
                <stop offset="70%" stopColor="#000000" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.45" />
              </linearGradient>

              {/* Anatomical drape & spine folds */}
              <linearGradient id="spineShadow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#000000" stopOpacity="0.3" />
                <stop offset="12%" stopColor="#000000" stopOpacity="0.02" />
                <stop offset="48%" stopColor="#000000" stopOpacity="0.0" />
                <stop offset="50%" stopColor="#000000" stopOpacity="0.12" />
                <stop offset="52%" stopColor="#000000" stopOpacity="0.0" />
                <stop offset="88%" stopColor="#000000" stopOpacity="0.02" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
              </linearGradient>

              {/* Curved Shoulder Path for Natural Jersey Name Arcing */}
              <path 
                id={namePathId} 
                d="M 55 92 Q 170 66 285 92" 
                fill="none" 
              />
            </defs>

            {/* A. JERSEY BODY SILHOUETTE (ATHLETIC CUT) */}
            <path
              d="M 110 32 
                 C 140 46, 200 46, 230 32 
                 L 310 74 
                 L 286 142 
                 L 252 126 
                 L 252 350 
                 C 170 362, 170 362, 88 350 
                 L 88 126 
                 L 54 142 
                 L 30 74 
                 Z"
              fill={kit.pattern && kit.pattern !== 'solid' ? `url(#${patternId})` : (kit.jerseyColor || '#ffffff')}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1.5"
            />

            {/* B. MICRO-MESH FABRIC OVERLAY */}
            <path
              d="M 110 32 C 140 46, 200 46, 230 32 L 310 74 L 286 142 L 252 126 L 252 350 C 170 362, 170 362, 88 350 L 88 126 L 54 142 L 30 74 Z"
              fill={`url(#${meshPatternId})`}
            />

            {/* C. 3D LIGHT & SHADOW (FOLDS & DEPTH) */}
            <path
              d="M 110 32 C 140 46, 200 46, 230 32 L 310 74 L 286 142 L 252 126 L 252 350 C 170 362, 170 362, 88 350 L 88 126 L 54 142 L 30 74 Z"
              fill="url(#clothLightGradient)"
            />

            {/* D. SIDE CONTOUR SHADOWS & SPINE FOLD */}
            <path
              d="M 110 32 C 140 46, 200 46, 230 32 L 310 74 L 286 142 L 252 126 L 252 350 C 170 362, 170 362, 88 350 L 88 126 L 54 142 L 30 74 Z"
              fill="url(#spineShadow)"
            />

            {/* E. RAGLAN SHOULDER CONTOURS (STITCHED ATHLETIC SEAMS) */}
            <path
              d="M 115 38 C 135 75, 145 105, 150 126"
              fill="none"
              stroke={kit.textBorder || 'rgba(0,0,0,0.35)'}
              strokeWidth="1.5"
              strokeDasharray="4 2"
              opacity="0.65"
            />
            <path
              d="M 225 38 C 205 75, 195 105, 190 126"
              fill="none"
              stroke={kit.textBorder || 'rgba(0,0,0,0.35)'}
              strokeWidth="1.5"
              strokeDasharray="4 2"
              opacity="0.65"
            />

            {/* F. ATHLETIC SIDE VENTILATION PANELS */}
            <path
              d="M 88 150 L 100 155 L 100 340 L 88 335 Z"
              fill={kit.secondaryColor || '#00ff87'}
              opacity="0.4"
            />
            <path
              d="M 252 150 L 240 155 L 240 340 L 252 335 Z"
              fill={kit.secondaryColor || '#00ff87'}
              opacity="0.4"
            />

            {/* G. SLEEVE CUFFS WITH COLOR TRIM */}
            <path 
              d="M 30 74 L 54 142 L 42 136 L 20 70 Z" 
              fill={kit.cuffColor || kit.secondaryColor || '#00ff87'} 
              opacity="0.95" 
            />
            <path 
              d="M 310 74 L 286 142 L 298 136 L 320 70 Z" 
              fill={kit.cuffColor || kit.secondaryColor || '#00ff87'} 
              opacity="0.95" 
            />

            {/* H. BACK OF NECK RIBBED COLLAR */}
            <path
              d="M 110 32 C 140 48, 200 48, 230 32 C 205 40, 135 40, 110 32 Z"
              fill={kit.collarColor || kit.secondaryColor || '#00ff87'}
              stroke="rgba(0,0,0,0.4)"
              strokeWidth="1.5"
            />

            {/* I. INNER COLLAR LABEL / SIZING TAPE */}
            <path
              d="M 148 37 C 158 41, 182 41, 192 37 L 190 44 C 180 47, 160 47, 150 44 Z"
              fill="#111827"
              opacity="0.8"
            />

            {/* J. BACK OF NECK MOTTO OR BADGE TAG */}
            <g transform="translate(170, 52)">
              {crest ? (
                <image
                  href={crest}
                  x="-8"
                  y="-8"
                  width="16"
                  height="16"
                  preserveAspectRatio="xMidYMid meet"
                  opacity="0.9"
                />
              ) : (
                <text
                  x="0"
                  y="2"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="8"
                  fontWeight="900"
                  letterSpacing="1"
                  opacity="0.85"
                >
                  {kit.motto || 'OFICIAL'}
                </text>
              )}
            </g>

            {/* K. ARCHED PLAYER NAME (OFFICIAL CURVED PRINTING) */}
            <text
              fill={kit.textColor || '#ffffff'}
              stroke={kit.textBorder || '#000000'}
              strokeWidth="2.5"
              paintOrder="stroke fill"
              fontSize={printName.length > 12 ? '15' : printName.length > 9 ? '17' : '19'}
              fontWeight="900"
              fontFamily="sans-serif"
              letterSpacing="3.5"
              filter="drop-shadow(0 3px 5px rgba(0,0,0,0.85))"
            >
              <textPath href={`#${namePathId}`} startOffset="50%" textAnchor="middle">
                {printName}
              </textPath>
            </text>

            {/* L. ATHLETIC 3D EXTRUDED NUMBER WITH EMBEDDED STAMP */}
            {/* 1) 3D Drop Extrusion */}
            <text
              x="173"
              y="235"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="rgba(0,0,0,0.75)"
              fontSize={printNumber.length >= 4 ? '78' : printNumber.length === 3 ? '95' : '115'}
              fontWeight="900"
              fontFamily="sans-serif"
              letterSpacing="-2"
            >
              {printNumber}
            </text>

            {/* 2) Outer Stroke Outline */}
            <text
              x="170"
              y="232"
              textAnchor="middle"
              dominantBaseline="middle"
              fill={kit.textColor || '#ffffff'}
              stroke={kit.textBorder || '#000000'}
              strokeWidth="7"
              strokeLinejoin="round"
              paintOrder="stroke fill"
              fontSize={printNumber.length >= 4 ? '78' : printNumber.length === 3 ? '95' : '115'}
              fontWeight="900"
              fontFamily="sans-serif"
              letterSpacing="-2"
              filter="drop-shadow(0 6px 12px rgba(0,0,0,0.85))"
            >
              {printNumber}
            </text>

            {/* 3) Inner Inline Accent (Official Player-Issue Vents) */}
            <text
              x="170"
              y="232"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="none"
              stroke={kit.secondaryColor || '#ffffff'}
              strokeWidth="1.2"
              strokeDasharray="6 3"
              opacity="0.8"
              fontSize={printNumber.length >= 4 ? '78' : printNumber.length === 3 ? '95' : '115'}
              fontWeight="900"
              fontFamily="sans-serif"
              letterSpacing="-2"
            >
              {printNumber}
            </text>

            {/* M. STAMPED MINI CLUB CREST AT BASE OF NUMBER */}
            {crest && (
              <g transform="translate(170, 275)">
                <circle cx="0" cy="0" r="10" fill="rgba(0,0,0,0.75)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
                <image
                  href={crest}
                  x="-7"
                  y="-7"
                  width="14"
                  height="14"
                  preserveAspectRatio="xMidYMid meet"
                />
              </g>
            )}

            {/* N. CURVED BOTTOM HEM LINE STITCH */}
            <path
              d="M 94 345 C 170 357, 170 357, 246 345"
              fill="none"
              stroke="rgba(0,0,0,0.4)"
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
          </svg>

        </div>

      </div>

      {/* 5. BOTTOM DETAILS FOOTER (PLAYER PROFILE BAR) */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/10 bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-lg">
        
        {/* Player Profile preview */}
        <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
          <div className="w-11 h-11 rounded-full bg-[#182335] border-2 border-amber-400 p-0.5 flex items-center justify-center shrink-0 overflow-hidden shadow-lg">
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

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-white text-xs sm:text-sm truncate">
                {playerName}
              </span>
              <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-amber-400 text-black uppercase">
                {playerPosition} · {playerRating} OVR
              </span>
            </div>
            <p className="text-[11px] text-slate-300 truncate">
              {clubName} · Cláusula: <strong className="text-amber-300">{formattedClause}</strong>
            </p>
          </div>
        </div>

        {/* Date & Guarantee Seal */}
        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-white/5">
          <span className="text-[11px] text-slate-300 font-mono font-semibold flex items-center gap-1">
            📅 {date}
          </span>
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-emerald-400" />
            <span>Blindaje Total</span>
          </span>
        </div>

      </div>

    </div>
  );
}
