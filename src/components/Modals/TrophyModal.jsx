import React, { useState, useEffect } from 'react';
import { 
  X, 
  Trophy, 
  Check, 
  Sparkles, 
  Calendar, 
  Flame, 
  Award, 
  Star, 
  ChevronRight,
  Shield,
  Edit3
} from 'lucide-react';
import { COMPETITION_OPTIONS } from '../../data/dropdownPresets';
import { getClubLogo } from '../../clubsData';
import { getTrophyImage, getTrophyCelebrationBg } from '../../data/trophiesData';

// Maps competition names to official logo images in /leagues/
function getCompetitionLogo(compName) {
  if (!compName) return null;
  const c = compName.toLowerCase();
  if (c.includes('laliga ea') || c.includes('primera división') || c.includes('la liga')) return '/leagues/laliga.png';
  if (c.includes('hypermotion') || c.includes('segunda')) return '/leagues/segunda.png';
  if (c.includes('premier')) return '/leagues/premier.png';
  if (c.includes('serie a')) return '/leagues/seriea.png';
  if (c.includes('bundesliga')) return '/leagues/bundesliga.png';
  if (c.includes('ligue 1')) return '/leagues/ligue1.png';
  if (c.includes('argentina') || c.includes('libertadores') || c.includes('sudamericana')) return '/leagues/argentina.png';
  if (c.includes('saudi') || c.includes('árabe') || c.includes('arabe')) return '/leagues/saudi.png';
  if (c.includes('champions') || c.includes('europa') || c.includes('conference')) return '/leagues/champions.png';
  if (c.includes('championship')) return '/leagues/championship.png';
  if (c.includes('portugal')) return '/leagues/portugal.png';
  if (c.includes('eredivisie')) return '/leagues/eredivisie.png';
  if (c.includes('brasileir')) return '/leagues/brasileirao.png';
  if (c.includes('mls')) return '/leagues/mls.png';
  return null;
}

// Recommended companion cups based on club league
function getDomesticCompetitionsForLeague(leagueName) {
  const l = (leagueName || '').toLowerCase();
  if (l.includes('laliga') || l.includes('segunda') || l.includes('españa')) {
    return [
      { name: 'Copa del Rey', type: 'Copa Nacional' },
      { name: 'Supercopa de España', type: 'Supercopa' },
      { name: 'UEFA Champions League', type: 'Continental' },
      { name: 'UEFA Europa League', type: 'Continental' },
      { name: 'Supercopa de Europa', type: 'Supercopa' }
    ];
  }
  if (l.includes('premier') || l.includes('championship') || l.includes('england')) {
    return [
      { name: 'FA Cup', type: 'Copa Nacional' },
      { name: 'Carabao Cup', type: 'Copa de la Liga' },
      { name: 'FA Community Shield', type: 'Supercopa' },
      { name: 'UEFA Champions League', type: 'Continental' },
      { name: 'UEFA Europa League', type: 'Continental' }
    ];
  }
  if (l.includes('bundesliga') || l.includes('alemania')) {
    return [
      { name: 'DFB-Pokal', type: 'Copa Nacional' },
      { name: 'DFL-Supercup', type: 'Supercopa' },
      { name: 'UEFA Champions League', type: 'Continental' },
      { name: 'UEFA Europa League', type: 'Continental' }
    ];
  }
  if (l.includes('serie a') || l.includes('italia')) {
    return [
      { name: 'Coppa Italia', type: 'Copa Nacional' },
      { name: 'Supercoppa Italiana', type: 'Supercopa' },
      { name: 'UEFA Champions League', type: 'Continental' },
      { name: 'UEFA Europa League', type: 'Continental' }
    ];
  }
  if (l.includes('ligue 1') || l.includes('francia')) {
    return [
      { name: 'Coupe de France', type: 'Copa Nacional' },
      { name: 'Trophée des Champions', type: 'Supercopa' },
      { name: 'UEFA Champions League', type: 'Continental' }
    ];
  }
  if (l.includes('argentina') || l.includes('conmebol')) {
    return [
      { name: 'Copa de la Liga Argentina', type: 'Copa Nacional' },
      { name: 'Copa Argentina', type: 'Copa Nacional' },
      { name: 'CONMEBOL Libertadores', type: 'Continental' },
      { name: 'CONMEBOL Sudamericana', type: 'Continental' },
      { name: 'Trofeo de Campeones', type: 'Supercopa' }
    ];
  }
  if (l.includes('saudi') || l.includes('arabe') || l.includes('árabe')) {
    return [
      { name: 'King Cup', type: 'Copa Nacional' },
      { name: 'Saudi Super Cup', type: 'Supercopa' },
      { name: 'AFC Champions League', type: 'Continental' }
    ];
  }
  return [
    { name: 'UEFA Champions League', type: 'Continental' },
    { name: 'UEFA Europa League', type: 'Continental' },
    { name: 'Supercopa de Europa', type: 'Supercopa' },
    { name: 'Mundial de Clubes', type: 'Mundial' }
  ];
}

export default function TrophyModal({
  isOpen,
  onClose,
  career,
  season,
  onConfirmCelebrate,
  initialCompetition = ''
}) {
  if (!isOpen) return null;

  const manager = career?.manager || {};
  const clubName = manager.club || 'Mi Club';
  const clubLogo = manager.clubLogo || getClubLogo(clubName);
  const userLeague = manager.league || 'LALIGA EA SPORTS';
  const inGameDate = manager.currentDate || manager.startDate || '12 oct 2026';

  // 1. Gather all competitions played during the current season from season.matches
  const matches = season?.matches || [];
  const playedCompetitionsMap = {};

  matches.forEach(m => {
    if (m.competition) {
      const comp = m.competition.trim();
      if (!playedCompetitionsMap[comp]) {
        playedCompetitionsMap[comp] = {
          name: comp,
          matchesCount: 0,
          wins: 0,
          draws: 0,
          losses: 0
        };
      }
      playedCompetitionsMap[comp].matchesCount += 1;
      if (m.ourScore !== undefined && m.rivalScore !== undefined) {
        if (m.ourScore > m.rivalScore) playedCompetitionsMap[comp].wins += 1;
        else if (m.ourScore === m.rivalScore) playedCompetitionsMap[comp].draws += 1;
        else playedCompetitionsMap[comp].losses += 1;
      }
    }
  });

  // Always ensure the primary club league is included
  if (!playedCompetitionsMap[userLeague]) {
    playedCompetitionsMap[userLeague] = {
      name: userLeague,
      matchesCount: matches.filter(m => !m.competition || m.competition === userLeague).length,
      wins: 0,
      draws: 0,
      losses: 0,
      isPrimaryLeague: true
    };
  }

  const playedCompetitionsList = Object.values(playedCompetitionsMap);

  // Companion cups for this league
  const domesticCups = getDomesticCompetitionsForLeague(userLeague);

  // Existing trophies in career/season
  const existingTrophies = [
    ...(career?.trophies || []),
    ...(season?.trophies || [])
  ].map(t => (t.competition || '').toLowerCase());

  // Modal local state
  const defaultSelection = initialCompetition || playedCompetitionsList[0]?.name || userLeague;
  const [selectedComp, setSelectedComp] = useState(defaultSelection);
  const [customCompName, setCustomCompName] = useState('');
  const [activeTab, setActiveTab] = useState('played'); // 'played' | 'all' | 'custom'
  const [celebrationDate, setCelebrationDate] = useState(inGameDate);
  const [details, setDetails] = useState('');

  // Sync when initialCompetition or inGameDate changes
  useEffect(() => {
    if (initialCompetition) {
      setSelectedComp(initialCompetition);
    }
    setCelebrationDate(inGameDate);
  }, [initialCompetition, inGameDate, isOpen]);

  // Determine current active competition name
  const effectiveComp = activeTab === 'custom' && customCompName.trim()
    ? customCompName.trim()
    : selectedComp;

  const isEuropean = effectiveComp.toLowerCase().includes('champions') ||
    effectiveComp.toLowerCase().includes('europa') ||
    effectiveComp.toLowerCase().includes('conference') ||
    effectiveComp.toLowerCase().includes('libertadores');

  const photoPreview = getTrophyCelebrationBg(effectiveComp);
  const currentTrophyImage = getTrophyImage(effectiveComp);

  const handleSelectComp = (name) => {
    setSelectedComp(name);
    if (activeTab === 'custom') {
      setActiveTab('played');
    }
  };

  const handleConfirm = () => {
    if (!effectiveComp) return;
    const finalDetails = details.trim() || `¡Temporada histórica! El ${clubName} de ${manager.name || 'Entrenador'} se proclama campeón oficial de ${effectiveComp}.`;
    onConfirmCelebrate(effectiveComp, finalDetails, {
      date: celebrationDate,
      photoUrl: photoPreview,
      trophyImage: currentTrophyImage
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#0b111c] border border-[#202e44] rounded-3xl max-w-4xl w-full shadow-2xl relative my-auto overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-1/4 w-96 h-36 bg-amber-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-36 bg-[#00ff87]/10 blur-[100px] pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1b273b] bg-[#0e1624]/90 relative z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 text-black flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Trophy className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white font-display tracking-wide">
                  Añadir Título Conquistado
                </h2>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                  Palmarés Oficial
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Selecciona el trofeo oficial conquistado para añadirlo a tu vitrina y publicar la celebración
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Club Pill */}
            <div className="hidden sm:flex items-center gap-2 bg-[#141e30] border border-[#213148] px-3 py-1.5 rounded-xl">
              <img 
                src={clubLogo} 
                alt={clubName} 
                className="w-5 h-5 object-contain"
                onError={(e) => { e.target.src = getClubLogo(clubName); }}
              />
              <span className="text-xs font-bold text-slate-200">{clubName}</span>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-xl bg-[#141e30] hover:bg-[#1d2b42] border border-[#213148] transition-colors"
              title="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          
          {/* Navigation Category Tabs */}
          <div className="flex items-center gap-2 p-1 bg-[#101725] rounded-xl border border-[#1d2a3f]">
            <button
              type="button"
              onClick={() => setActiveTab('played')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'played'
                  ? 'bg-amber-400 text-black shadow-md font-black'
                  : 'text-slate-400 hover:text-white hover:bg-[#162134]'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Jugadas en la Temporada ({playedCompetitionsList.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'all'
                  ? 'bg-amber-400 text-black shadow-md font-black'
                  : 'text-slate-400 hover:text-white hover:bg-[#162134]'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Copas y Otras Competiciones</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('custom')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'custom'
                  ? 'bg-amber-400 text-black shadow-md font-black'
                  : 'text-slate-400 hover:text-white hover:bg-[#162134]'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Personalizada</span>
            </button>
          </div>

          {/* TAB 1: COMPETICIONES JUGADAS ESTA TEMPORADA (BUTTON FORMAT WITH TROPHY IMAGES) */}
          {activeTab === 'played' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  Trofeos disputados por tu club este curso
                </span>
                <span className="text-[10px] text-slate-400">
                  Haz clic en el trofeo que has conquistado
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {playedCompetitionsList.map((compObj, idx) => {
                  const compName = compObj.name;
                  const isSelected = selectedComp === compName && activeTab !== 'custom';
                  const logo = getCompetitionLogo(compName);
                  const trophyImg = getTrophyImage(compName);
                  const alreadyWon = existingTrophies.includes(compName.toLowerCase());

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectComp(compName)}
                      className={`relative p-3.5 rounded-2xl border text-left transition-all flex items-center gap-4 group cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-[#1c2940] to-[#141e30] border-amber-400 shadow-xl shadow-amber-500/20 scale-[1.01] ring-2 ring-amber-400/40'
                          : 'bg-[#121927] border-[#1e2c41] hover:bg-[#172235] hover:border-amber-400/50'
                      }`}
                    >
                      {/* REALISTIC TROPHY IMAGE SHOWCASE BOX */}
                      <div className={`relative w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border transition-all p-1.5 shadow-lg overflow-hidden ${
                        isSelected 
                          ? 'bg-gradient-to-b from-amber-400/25 via-[#1a2538] to-[#121b2a] border-amber-400 shadow-amber-500/30' 
                          : 'bg-gradient-to-b from-[#192437] to-[#101726] border-[#25364f] group-hover:border-amber-400/50 group-hover:bg-[#1d2a40]'
                      }`}>
                        {/* Ambient golden halo glow behind trophy */}
                        <div className={`absolute inset-0 transition-opacity ${isSelected ? 'opacity-100 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-400/25 via-transparent to-transparent' : 'opacity-0'}`} />
                        
                        {/* The Actual Physical Trophy */}
                        <img 
                          src={trophyImg} 
                          alt={compName} 
                          className="w-full h-full object-contain filter drop-shadow-[0_6px_10px_rgba(0,0,0,0.9)] group-hover:scale-110 transition-transform duration-300 relative z-10"
                          onError={(e) => { e.target.src = '/trophies/generic_trophy.png'; }}
                        />

                        {/* Small league badge pill on corner */}
                        {logo && (
                          <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-black/85 border border-white/25 p-0.5 z-20 flex items-center justify-center shadow-md">
                            <img src={logo} alt="" className="w-full h-full object-contain" />
                          </div>
                        )}
                      </div>

                      {/* Info & Stats */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs sm:text-sm font-black text-white font-display truncate">
                            {compName}
                          </h4>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-[#00ff87] border border-[#00ff87]/30">
                            {compObj.matchesCount > 0 
                              ? `${compObj.matchesCount} PJ en temporada` 
                              : 'Liga Principal'}
                          </span>
                          {alreadyWon && (
                            <span className="text-[10px] font-bold text-amber-300 flex items-center gap-0.5">
                              <span>🏆 En vitrina</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Selected Radio / Check Indicator */}
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all ${
                        isSelected 
                          ? 'bg-amber-400 text-black shadow-md' 
                          : 'border border-slate-600 group-hover:border-amber-400'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: ALL / DOMESTIC CUPS & PRESETS */}
          {activeTab === 'all' && (
            <div className="space-y-5">
              {/* Domestic Cups for this League */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block mb-2 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  Copas y Supercopas Vinculadas a tu Liga ({userLeague})
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {domesticCups.map((cup, idx) => {
                    const isSelected = selectedComp === cup.name && activeTab !== 'custom';
                    const logo = getCompetitionLogo(cup.name);
                    const trophyImg = getTrophyImage(cup.name);

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectComp(cup.name)}
                        className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-3.5 cursor-pointer group ${
                          isSelected
                            ? 'bg-[#192437] border-amber-400 shadow-md ring-1 ring-amber-400'
                            : 'bg-[#121927] border-[#1e2c41] hover:bg-[#162033] hover:border-slate-500'
                        }`}
                      >
                        {/* Trophy Image Box */}
                        <div className={`relative w-14 h-14 rounded-xl flex items-center justify-center shrink-0 border transition-all p-1 shadow-md overflow-hidden ${
                          isSelected ? 'bg-amber-400/25 border-amber-400' : 'bg-[#152134] border-[#23354f] group-hover:border-amber-400/40'
                        }`}>
                          <img 
                            src={trophyImg} 
                            alt={cup.name} 
                            className="w-full h-full object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.85)] group-hover:scale-105 transition-transform"
                            onError={(e) => { e.target.src = '/trophies/generic_trophy.png'; }}
                          />
                          {logo && (
                            <div className="absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full bg-black/80 border border-white/20 p-0.5 flex items-center justify-center">
                              <img src={logo} alt="" className="w-full h-full object-contain" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <span className="text-xs sm:text-sm font-bold text-white block truncate">{cup.name}</span>
                          <span className="text-[10px] text-amber-300/80 font-semibold">{cup.type}</span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Other presets from dropdownPresets with Trophy Images */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Otras Competiciones Oficiales
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {COMPETITION_OPTIONS.slice(0, 15).map((comp, idx) => {
                    const isSelected = selectedComp === comp && activeTab !== 'custom';
                    const trophyImg = getTrophyImage(comp);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectComp(comp)}
                        className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center gap-2.5 group ${
                          isSelected
                            ? 'bg-amber-400 text-black border-amber-400 shadow-md ring-1 ring-amber-400 font-black'
                            : 'bg-[#111826] text-slate-200 border-[#1c283c] hover:bg-[#172133] hover:text-white hover:border-slate-500'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-black/40 border border-white/10 p-0.5 flex items-center justify-center shrink-0">
                          <img 
                            src={trophyImg} 
                            alt="" 
                            className="w-full h-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] group-hover:scale-110 transition-transform"
                            onError={(e) => { e.target.src = '/trophies/generic_trophy.png'; }}
                          />
                        </div>
                        <span className="truncate">{comp}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOM COMPETITION */}
          {activeTab === 'custom' && (
            <div className="p-4 rounded-2xl bg-[#121927] border border-[#1e2c41] space-y-3">
              <label className="block text-xs font-bold text-slate-300">
                Escribe el nombre de la competición o torneo:
              </label>
              <input
                type="text"
                value={customCompName}
                onChange={(e) => setCustomCompName(e.target.value)}
                placeholder="ej. Trofeo Santiago Bernabéu, Mundial de Clubes, etc."
                className="w-full bg-[#162134] border border-[#253752] rounded-xl px-4 py-2.5 text-white font-bold text-xs focus:outline-none focus:border-amber-400 placeholder-slate-500"
              />
              <p className="text-[11px] text-slate-400">
                Puedes registrar cualquier torneo amistoso o competición especial disputada en tu carrera. Se asignará el trofeo oficial de gala para la celebración.
              </p>
            </div>
          )}

          {/* Celebration Preview Card: Realistic Trophy Showcase + Stadium Backdrop */}
          <div className="p-4 rounded-2xl bg-[#121a28] border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between border-b border-[#1c283d] pb-2">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Celebración oficial con el trofeo y tu club
              </span>
              <span className="text-xs font-bold text-white font-display">
                {effectiveComp || 'Competición'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              {/* Photo & Trophy Hero Composite preview */}
              <div className="sm:col-span-5 relative rounded-2xl overflow-hidden h-36 border border-amber-500/40 shadow-xl bg-gradient-to-br from-[#0c1322] via-[#10192a] to-[#0a0f1b] flex items-center justify-between p-3.5 group">
                {/* Stadium atmosphere backdrop */}
                <img 
                  src={photoPreview} 
                  alt="Celebración" 
                  className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.35] contrast-125 scale-105 pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/85 pointer-events-none" />

                {/* Left: Club info */}
                <div className="relative z-10 flex flex-col justify-between h-full">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-black/80 border border-amber-400/60 p-1 flex items-center justify-center shadow-lg">
                      <img 
                        src={clubLogo} 
                        alt={clubName} 
                        className="max-w-full max-h-full object-contain" 
                        onError={(e) => { e.target.src = getClubLogo(clubName); }} 
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-amber-300 block uppercase tracking-wide">
                        CAMPEÓN
                      </span>
                      <span className="text-xs font-black text-white truncate max-w-[100px] block">
                        {clubName}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-amber-300/90 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full inline-flex items-center gap-1 w-fit">
                    <Trophy className="w-3 h-3 text-amber-400" />
                    <span>{isEuropean ? 'Trofeo Europeo' : 'Trofeo Oficial'}</span>
                  </span>
                </div>

                {/* Right: The Physical Official Trophy standing tall */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center pr-2">
                  <div className="relative w-24 h-28 flex items-center justify-center">
                    <div className="absolute inset-0 bg-amber-400/25 blur-xl rounded-full scale-90 pointer-events-none" />
                    <img 
                      src={currentTrophyImage} 
                      alt={effectiveComp} 
                      className="max-w-full max-h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.95)] transform group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => { e.target.src = '/trophies/generic_trophy.png'; }}
                    />
                  </div>
                </div>
              </div>

              {/* Details & Date Inputs */}
              <div className="sm:col-span-7 space-y-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Fecha de la Celebración
                  </label>
                  <input
                    type="text"
                    value={celebrationDate}
                    onChange={(e) => setCelebrationDate(e.target.value)}
                    className="w-full bg-[#0b101a] border border-[#1b2639] rounded-lg px-3 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                    placeholder="12 oct 2026"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Mensaje o Titular para la Afición (Opcional)
                  </label>
                  <input
                    type="text"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    className="w-full bg-[#0b101a] border border-[#1b2639] rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-amber-400 placeholder-slate-600"
                    placeholder={`¡Temporada de gloria! El ${clubName} se corona campeón oficial de ${effectiveComp}.`}
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-[#1b273b] bg-[#0e1624] flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-[#141e30] hover:bg-[#1a273e] text-slate-300 font-semibold text-xs border border-[#213148] transition-colors"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={!effectiveComp}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 hover:from-amber-300 hover:to-yellow-200 text-black font-black text-xs sm:text-sm shadow-lg shadow-amber-500/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-black stroke-[2.5]" />
            <span>¡Celebrar y Levantar Trofeo! ({effectiveComp})</span>
          </button>
        </div>

      </div>
    </div>
  );
}
