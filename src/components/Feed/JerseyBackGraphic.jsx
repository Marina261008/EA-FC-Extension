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

  // Unique IDs for SVG patterns, paths and gradients
  const safeId = (clubName || 'club').replace(/[^a-zA-Z0-9]/g, '');
  const randSuffix = Math.random().toString(36).substring(2, 6);
  const patternId = `kit-pattern-${safeId}-${randSuffix}`;
  const namePathId = `name-path-${safeId}-${randSuffix}`;
  const meshPatternId = `mesh-pattern-${safeId}-${randSuffix}`;
  const clothGradId = `cloth-grad-${safeId}-${randSuffix}`;
  const spineGradId = `spine-grad-${safeId}-${randSuffix}`;
  const goldFoilId = `gold-foil-${safeId}-${randSuffix}`;

  // Format clause safely with full dot format
  const formattedClause = formatToFullEuros(clause, '120.000.000 €');

  return (
    <div className="relative min-h-[560px] sm:min-h-[640px] md:min-h-[680px] flex flex-col justify-between p-4 sm:p-7 overflow-hidden rounded-2xl bg-[#060910] select-none text-white border border-[#23344d] shadow-[0_24px_70px_rgba(0,0,0,0.85)]">
      
      {/* 1. ATMOSPHERIC LOCKER ROOM / STADIUM BACKGROUND */}
      <img
        src={bgImage}
        alt="Locker Room & Stadium"
        className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.24] contrast-125 scale-105 pointer-events-none transition-transform duration-700"
        onError={(e) => {
          e.target.src = 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=1000&auto=format&fit=crop&q=80';
        }}
      />

      {/* 2. DYNAMIC STUDIO FLOODLIGHTS & AMBIENT CLUB GLOW */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#04060b]/98 via-[#060a12]/75 to-[#04060b]/90 pointer-events-none"></div>
      
      {/* Left studio floodlight beam */}
      <div 
        className="absolute -top-32 left-1/6 w-96 h-96 rounded-full opacity-25 blur-3xl pointer-events-none"
        style={{ background: kit.secondaryColor || '#00ff87' }}
      ></div>
      {/* Right studio floodlight beam */}
      <div 
        className="absolute -top-32 right-1/6 w-96 h-96 rounded-full opacity-25 blur-3xl pointer-events-none"
        style={{ background: kit.jerseyColor || '#ffffff' }}
      ></div>

      {/* Giant Watermarked Crest in the Background */}
      {crest && (
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.08] pointer-events-none overflow-hidden">
          <img
            src={crest}
            alt=""
            className="w-96 h-96 sm:w-[480px] sm:h-[480px] object-contain filter grayscale contrast-150 transform scale-110"
          />
        </div>
      )}

      {/* 3. TOP BANNER: Official Renewal Tag + Renewal Year Badge */}
      <div className="relative z-10 flex items-center justify-between gap-2 shrink-0">
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
          <span className="text-xs font-black text-amber-300 bg-black/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-amber-500/40 shadow-lg flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span>HASTA {renewalYear}</span>
          </span>
        </div>
      </div>

      {/* 4. CENTERPIECE: ULTRA-REALISTIC, MASSIVE 3D FOOTBALL JERSEY BACK */}
      <div className="relative z-10 my-2 sm:my-3 flex flex-col items-center justify-center flex-1">
        
        {/* The Jersey Container with Multi-layer 3D Ambient Occlusion & Ground Shadow */}
        <div className="relative w-full max-w-[340px] sm:max-w-[440px] md:max-w-[480px] h-[380px] sm:h-[480px] md:h-[530px] flex items-center justify-center filter drop-shadow-[0_25px_45px_rgba(0,0,0,0.92)]">
          
          <svg 
            viewBox="0 0 400 460" 
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

              {/* Pattern: Diagonal Sash (River Plate, Rayo Vallecano) */}
              {kit.pattern === 'sash' && (
                <pattern id={patternId} width="400" height="460" patternUnits="userSpaceOnUse">
                  <rect width="400" height="460" fill={kit.jerseyColor} />
                  <polygon points="0,85 105,0 400,360 295,445" fill={kit.secondaryColor} opacity="0.95" />
                </pattern>
              )}

              {/* Pattern: Horizontal Stripes / Chest Band (Boca Juniors, Stuttgart) */}
              {kit.pattern === 'horizontal-stripes' && (
                <pattern id={patternId} width="400" height="460" patternUnits="userSpaceOnUse">
                  <rect width="400" height="460" fill={kit.jerseyColor} />
                  <rect y="160" width="400" height="100" fill={kit.secondaryColor} />
                </pattern>
              )}

              {/* Pattern: Chevron (Vélez Sarsfield) */}
              {kit.pattern === 'chevron' && (
                <pattern id={patternId} width="400" height="460" patternUnits="userSpaceOnUse">
                  <rect width="400" height="460" fill={kit.jerseyColor} />
                  <polygon points="0,60 200,180 400,60 400,130 200,250 0,130" fill={kit.secondaryColor} />
                </pattern>
              )}

              {/* Pattern: Halves (Newell's Old Boys) */}
              {kit.pattern === 'halves' && (
                <pattern id={patternId} width="400" height="460" patternUnits="userSpaceOnUse">
                  <rect width="200" height="460" fill={kit.jerseyColor} />
                  <rect x="200" width="200" height="460" fill={kit.secondaryColor} />
                </pattern>
              )}

              {/* High-tech Micro-mesh Breathable Fabric Knit */}
              <pattern id={meshPatternId} width="5" height="5" patternUnits="userSpaceOnUse">
                <circle cx="2.5" cy="2.5" r="0.7" fill="#000000" opacity="0.14" />
              </pattern>

              {/* Realistic 3D cloth lighting & folds (Drape & Specular reflection) */}
              <linearGradient id={clothGradId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
                <stop offset="25%" stopColor="#ffffff" stopOpacity="0.08" />
                <stop offset="60%" stopColor="#000000" stopOpacity="0.05" />
                <stop offset="85%" stopColor="#000000" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.5" />
              </linearGradient>

              {/* Anatomical spine & lumbar drapery folds */}
              <linearGradient id={spineGradId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#000000" stopOpacity="0.35" />
                <stop offset="10%" stopColor="#000000" stopOpacity="0.04" />
                <stop offset="48%" stopColor="#000000" stopOpacity="0.0" />
                <stop offset="50%" stopColor="#000000" stopOpacity="0.16" />
                <stop offset="52%" stopColor="#000000" stopOpacity="0.0" />
                <stop offset="90%" stopColor="#000000" stopOpacity="0.04" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.35" />
              </linearGradient>

              {/* Metallic Golden Foil for Authenticity Patch */}
              <linearGradient id={goldFoilId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e6c875" />
                <stop offset="40%" stopColor="#ffe699" />
                <stop offset="70%" stopColor="#c59b27" />
                <stop offset="100%" stopColor="#fdf0cd" />
              </linearGradient>

              {/* Curved Shoulder Path for Natural Athletic Name Arcing */}
              <path 
                id={namePathId} 
                d="M 75 124 Q 200 86 325 124" 
                fill="none" 
              />
            </defs>

            {/* ------------------------------------------------------------- */}
            {/* 0. BRUSHED TITANIUM HANGER & COLLAR STAND                      */}
            {/* ------------------------------------------------------------- */}
            <g opacity="0.85">
              <path 
                d="M 200 12 C 190 12, 185 24, 196 32 C 198 34, 202 34, 204 32 C 215 24, 210 12, 200 12" 
                fill="none" 
                stroke="#94a3b8" 
                strokeWidth="3" 
                strokeLinecap="round" 
              />
              <path 
                d="M 150 42 L 200 32 L 250 42" 
                fill="none" 
                stroke="#64748b" 
                strokeWidth="3.5" 
                strokeLinecap="round" 
              />
            </g>

            {/* ------------------------------------------------------------- */}
            {/* A. INNER FRONT COLLAR & NECK TAPE (SEEN THROUGH BACK COLLAR)  */}
            {/* ------------------------------------------------------------- */}
            <path
              d="M 140 42 C 170 28, 230 28, 260 42 C 235 52, 165 52, 140 42 Z"
              fill="#090d16"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
            />
            {/* Inner neck size & authenticity heat-transfer label */}
            <rect x="182" y="32" width="36" height="12" rx="2" fill="#1e293b" opacity="0.9" />
            <text x="200" y="41" textAnchor="middle" fill="#94a3b8" fontSize="6.5" fontWeight="900" letterSpacing="0.8">
              PRO · {kit.motto ? kit.motto.slice(0, 8) : 'FC 26'}
            </text>

            {/* ------------------------------------------------------------- */}
            {/* B. MAIN JERSEY BODY SILHOUETTE (ATHLETIC CUT - WIDE SHOULDERS) */}
            {/* ------------------------------------------------------------- */}
            <path
              d="M 140 42 
                 C 170 56, 230 56, 260 42 
                 L 330 78 
                 C 352 105, 368 130, 376 155 
                 L 336 185 
                 C 322 176, 305 168, 292 160 
                 C 284 275, 284 340, 296 405 
                 C 235 428, 165 428, 104 405 
                 C 116 340, 116 275, 108 160 
                 C 95 168, 78 176, 64 185 
                 L 24 155 
                 C 32 130, 48 105, 70 78 
                 Z"
              fill={kit.pattern && kit.pattern !== 'solid' ? `url(#${patternId})` : (kit.jerseyColor || '#ffffff')}
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="1.5"
            />

            {/* ------------------------------------------------------------- */}
            {/* C. MICRO-MESH BREATHABLE KNIT OVERLAY                         */}
            {/* ------------------------------------------------------------- */}
            <path
              d="M 140 42 C 170 56, 230 56, 260 42 L 330 78 C 352 105, 368 130, 376 155 L 336 185 C 322 176, 305 168, 292 160 C 284 275, 284 340, 296 405 C 235 428, 165 428, 104 405 C 116 340, 116 275, 108 160 C 95 168, 78 176, 64 185 L 24 155 C 32 130, 48 105, 70 78 Z"
              fill={`url(#${meshPatternId})`}
            />

            {/* ------------------------------------------------------------- */}
            {/* D. 3D SPECULAR LIGHTING & FABRIC VOLUMETRIC SHADOWS           */}
            {/* ------------------------------------------------------------- */}
            <path
              d="M 140 42 C 170 56, 230 56, 260 42 L 330 78 C 352 105, 368 130, 376 155 L 336 185 C 322 176, 305 168, 292 160 C 284 275, 284 340, 296 405 C 235 428, 165 428, 104 405 C 116 340, 116 275, 108 160 C 95 168, 78 176, 64 185 L 24 155 C 32 130, 48 105, 70 78 Z"
              fill={`url(#${clothGradId})`}
            />

            {/* ------------------------------------------------------------- */}
            {/* E. ANATOMICAL SPINE, LUMBAR & FLANK CONTOUR SHADOWS           */}
            {/* ------------------------------------------------------------- */}
            <path
              d="M 140 42 C 170 56, 230 56, 260 42 L 330 78 C 352 105, 368 130, 376 155 L 336 185 C 322 176, 305 168, 292 160 C 284 275, 284 340, 296 405 C 235 428, 165 428, 104 405 C 116 340, 116 275, 108 160 C 95 168, 78 176, 64 185 L 24 155 C 32 130, 48 105, 70 78 Z"
              fill={`url(#${spineGradId})`}
            />

            {/* ------------------------------------------------------------- */}
            {/* F. SCAPULAR DRAPERY & UPPER BACK TENSION FOLDS                */}
            {/* ------------------------------------------------------------- */}
            {/* Left shoulder blade crease */}
            <path
              d="M 125 90 C 150 115, 175 125, 190 130"
              fill="none"
              stroke="rgba(0,0,0,0.18)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Right shoulder blade crease */}
            <path
              d="M 275 90 C 250 115, 225 125, 210 130"
              fill="none"
              stroke="rgba(0,0,0,0.18)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Subtle mid-back tension crease */}
            <path
              d="M 130 170 Q 200 188 270 170"
              fill="none"
              stroke="rgba(0,0,0,0.15)"
              strokeWidth="1.8"
            />

            {/* ------------------------------------------------------------- */}
            {/* G. RAGLAN SHOULDER CONTOURS (ATHLETIC DOUBLE STITCHING)       */}
            {/* ------------------------------------------------------------- */}
            <path
              d="M 148 48 C 160 90, 155 130, 108 160"
              fill="none"
              stroke={kit.textBorder || 'rgba(0,0,0,0.4)'}
              strokeWidth="1.8"
              strokeDasharray="4 2.5"
              opacity="0.6"
            />
            <path
              d="M 252 48 C 240 90, 245 130, 292 160"
              fill="none"
              stroke={kit.textBorder || 'rgba(0,0,0,0.4)'}
              strokeWidth="1.8"
              strokeDasharray="4 2.5"
              opacity="0.6"
            />

            {/* ------------------------------------------------------------- */}
            {/* H. ATHLETIC SIDE VENTILATION MESH PANELS (AERO-TECH)          */}
            {/* ------------------------------------------------------------- */}
            <path
              d="M 108 168 C 117 180, 118 250, 118 395 L 104 405 C 114 340, 114 240, 108 168 Z"
              fill={kit.secondaryColor || '#00ff87'}
              opacity="0.45"
            />
            <path
              d="M 292 168 C 283 180, 282 250, 282 395 L 296 405 C 286 340, 286 240, 292 168 Z"
              fill={kit.secondaryColor || '#00ff87'}
              opacity="0.45"
            />

            {/* ------------------------------------------------------------- */}
            {/* I. SLEEVE CUFFS WITH COLOR TRIM                               */}
            {/* ------------------------------------------------------------- */}
            <path 
              d="M 24 155 L 64 185 L 54 195 L 14 165 Z" 
              fill={kit.cuffColor || kit.secondaryColor || '#00ff87'} 
              stroke="rgba(0,0,0,0.3)"
              strokeWidth="1"
            />
            <path 
              d="M 376 155 L 336 185 L 346 195 L 386 165 Z" 
              fill={kit.cuffColor || kit.secondaryColor || '#00ff87'} 
              stroke="rgba(0,0,0,0.3)"
              strokeWidth="1"
            />

            {/* ------------------------------------------------------------- */}
            {/* J. OFFICIAL COMPETITION BADGE ON RIGHT SLEEVE                 */}
            {/* ------------------------------------------------------------- */}
            <g transform="translate(352, 138) rotate(15)">
              <rect x="-10" y="-14" width="20" height="28" rx="4" fill="#0b1320" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
              <rect x="-8" y="-12" width="16" height="24" rx="3" fill="#e2e8f0" />
              <circle cx="0" cy="-3" r="5" fill="#0f172a" />
              <text x="0" y="7" textAnchor="middle" fill="#0f172a" fontSize="5" fontWeight="900">
                PRO
              </text>
            </g>

            {/* ------------------------------------------------------------- */}
            {/* K. 3D RIBBED BACK COLLAR BAND                                 */}
            {/* ------------------------------------------------------------- */}
            <path
              d="M 136 41 C 170 58, 230 58, 264 41 C 242 47, 158 47, 136 41 Z"
              fill={kit.collarColor || kit.secondaryColor || '#00ff87'}
              stroke="rgba(0,0,0,0.5)"
              strokeWidth="1.5"
            />
            {/* Collar center stitch / fold accent */}
            <path
              d="M 198 46 L 202 46"
              stroke="rgba(0,0,0,0.4)"
              strokeWidth="2"
            />

            {/* ------------------------------------------------------------- */}
            {/* L. BACK OF NECK CREST EMBLEM OR CLUB MOTTO                     */}
            {/* ------------------------------------------------------------- */}
            <g transform="translate(200, 68)">
              {crest ? (
                <>
                  <circle cx="0" cy="0" r="11" fill="rgba(0,0,0,0.8)" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
                  <image
                    href={crest}
                    x="-9"
                    y="-9"
                    width="18"
                    height="18"
                    preserveAspectRatio="xMidYMid meet"
                  />
                </>
              ) : (
                <text
                  x="0"
                  y="3"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="9"
                  fontWeight="900"
                  letterSpacing="1"
                  opacity="0.9"
                >
                  {kit.motto || 'OFICIAL'}
                </text>
              )}
            </g>

            {/* ------------------------------------------------------------- */}
            {/* M. ARCHED PLAYER NAME (OFFICIAL 3D VINYL HEAT-PRESS)          */}
            {/* ------------------------------------------------------------- */}
            <text
              fill={kit.textColor || '#ffffff'}
              stroke={kit.textBorder || '#000000'}
              strokeWidth="3"
              strokeLinejoin="round"
              paintOrder="stroke fill"
              fontSize={printName.length > 13 ? '16' : printName.length > 10 ? '19' : printName.length > 7 ? '21' : '23'}
              fontWeight="900"
              fontFamily="Impact, 'Arial Black', sans-serif"
              letterSpacing="3.5"
              filter="drop-shadow(0 4px 6px rgba(0,0,0,0.9))"
            >
              <textPath href={`#${namePathId}`} startOffset="50%" textAnchor="middle">
                {printName}
              </textPath>
            </text>

            {/* ------------------------------------------------------------- */}
            {/* N. ULTRA-REALISTIC 3D EXTRUDED DORSAL NUMBER                  */}
            {/* ------------------------------------------------------------- */}
            {/* 1) Deep 3D Drop Extrusion Shadow */}
            <text
              x="204"
              y="268"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="rgba(0,0,0,0.85)"
              fontSize={printNumber.length >= 4 ? '92' : printNumber.length === 3 ? '112' : '138'}
              fontWeight="900"
              fontFamily="Impact, 'Arial Black', sans-serif"
              letterSpacing="-2"
            >
              {printNumber}
            </text>

            {/* 2) Outer Heavy Border Stroke */}
            <text
              x="200"
              y="264"
              textAnchor="middle"
              dominantBaseline="middle"
              fill={kit.textColor || '#ffffff'}
              stroke={kit.textBorder || '#000000'}
              strokeWidth="9"
              strokeLinejoin="round"
              paintOrder="stroke fill"
              fontSize={printNumber.length >= 4 ? '92' : printNumber.length === 3 ? '112' : '138'}
              fontWeight="900"
              fontFamily="Impact, 'Arial Black', sans-serif"
              letterSpacing="-2"
              filter="drop-shadow(0 8px 16px rgba(0,0,0,0.92))"
            >
              {printNumber}
            </text>

            {/* 3) Laser-cut Player-Issue Breathability Inline Dash */}
            <text
              x="200"
              y="264"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="none"
              stroke={kit.secondaryColor || '#ffffff'}
              strokeWidth="1.6"
              strokeDasharray="7 3.5"
              opacity="0.85"
              fontSize={printNumber.length >= 4 ? '92' : printNumber.length === 3 ? '112' : '138'}
              fontWeight="900"
              fontFamily="Impact, 'Arial Black', sans-serif"
              letterSpacing="-2"
            >
              {printNumber}
            </text>

            {/* ------------------------------------------------------------- */}
            {/* O. MINI CLUB CREST STAMPED AT BASE OF DORSAL NUMBER           */}
            {/* ------------------------------------------------------------- */}
            {crest && (
              <g transform="translate(200, 318)">
                <circle cx="0" cy="0" r="12" fill="rgba(0,0,0,0.85)" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" />
                <image
                  href={crest}
                  x="-9"
                  y="-9"
                  width="18"
                  height="18"
                  preserveAspectRatio="xMidYMid meet"
                />
              </g>
            )}

            {/* ------------------------------------------------------------- */}
            {/* P. METALLIC FOIL AUTHENTICITY BADGE AT LOWER HEM              */}
            {/* ------------------------------------------------------------- */}
            <g transform="translate(120, 386)">
              <rect 
                x="0" 
                y="0" 
                width="34" 
                height="15" 
                rx="2" 
                fill={`url(#${goldFoilId})`} 
                stroke="rgba(0,0,0,0.4)" 
                strokeWidth="1" 
                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))"
              />
              <text x="17" y="7" textAnchor="middle" fill="#000000" fontSize="4.5" fontWeight="900" letterSpacing="0.4">
                AUTHENTIC
              </text>
              <text x="17" y="12" textAnchor="middle" fill="#000000" fontSize="3.8" fontWeight="700">
                OFFICIAL MATCH
              </text>
            </g>

            {/* ------------------------------------------------------------- */}
            {/* Q. CURVED BOTTOM HEM LINE WITH ATHLETIC DOUBLE STITCHING      */}
            {/* ------------------------------------------------------------- */}
            <path
              d="M 110 400 C 165 422, 235 422, 290 400"
              fill="none"
              stroke="rgba(0,0,0,0.45)"
              strokeWidth="1.8"
              strokeDasharray="5 2.5"
            />
          </svg>

        </div>

      </div>

      {/* 5. BOTTOM DETAILS FOOTER (AUTHENTIC PLAYER PROFILE CARD) */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/10 bg-black/65 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-lg shrink-0">
        
        {/* Player Profile preview */}
        <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
          <div className="w-12 h-12 rounded-full bg-[#182335] border-2 border-amber-400 p-0.5 flex items-center justify-center shrink-0 overflow-hidden shadow-lg shadow-amber-500/20">
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
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1 shadow-sm">
            <CheckCircle className="w-3 h-3 text-emerald-400" />
            <span>Blindaje Total</span>
          </span>
        </div>

      </div>

    </div>
  );
}
