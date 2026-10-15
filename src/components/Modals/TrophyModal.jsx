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

  const photoPreview = isEuropean 
    ? '/trophies/champions_trophy_celebration.jpg' 
    : '/trophies/league_trophy_celebration.jpg';

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
      photoUrl: photoPreview
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#0b111c] border border-[#202e44] rounded-3xl max-w-3xl w-full shadow-2xl relative my-auto overflow-hidden flex flex-col max-h-[92vh]">
        
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
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Palmarés Oficial
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Selecciona la competición ganada para añadirla a tu vitrina y publicar la celebración
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
                  ? 'bg-amber-400 text-black shadow-md'
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
                  ? 'bg-amber-400 text-black shadow-md'
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
                  ? 'bg-amber-400 text-black shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-[#162134]'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Personalizada</span>
            </button>
          </div>

          {/* TAB 1: COMPETICIONES JUGADAS ESTA TEMPORADA (BUTTON FORMAT) */}
          {activeTab === 'played' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  Competiciones disputadas por tu club este curso
                </span>
                <span className="text-[10px] text-slate-500">
                  Selecciona una opción para celebrar
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {playedCompetitionsList.map((compObj, idx) => {
                  const compName = compObj.name;
                  const isSelected = selectedComp === compName && activeTab !== 'custom';
                  const logo = getCompetitionLogo(compName);
                  const alreadyWon = existingTrophies.includes(compName.toLowerCase());

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectComp(compName)}
                      className={`relative p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3.5 group cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-[#1b263b] to-[#162032] border-amber-400 shadow-xl shadow-amber-500/20 scale-[1.02] ring-2 ring-amber-400/40'
                          : 'bg-[#121927] border-[#1e2c41] hover:bg-[#162033] hover:border-amber-400/50'
                      }`}
                    >
                      {/* Competition Logo / Trophy Icon */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                        isSelected 
                          ? 'bg-amber-400/20 border-amber-400 text-amber-300' 
                          : 'bg-[#162236] border-[#22334d] text-slate-300 group-hover:border-amber-400/40'
                      }`}>
                        {logo ? (
                          <img src={logo} alt={compName} className="w-8 h-8 object-contain" />
                        ) : (
                          <Trophy className="w-6 h-6 text-amber-400" />
                        )}
                      </div>

                      {/* Info & Stats */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs sm:text-sm font-black text-white font-display truncate">
                            {compName}
                          </h4>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mt-1">
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
            <div className="space-y-4">
              {/* Domestic Cups for this League */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  🏆 Copas y Supercopas Vinculadas a tu Liga ({userLeague})
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {domesticCups.map((cup, idx) => {
                    const isSelected = selectedComp === cup.name && activeTab !== 'custom';
                    const logo = getCompetitionLogo(cup.name);

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectComp(cup.name)}
                        className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                          isSelected
                            ? 'bg-[#192437] border-amber-400 shadow-md ring-1 ring-amber-400'
                            : 'bg-[#121927] border-[#1e2c41] hover:bg-[#162033] hover:border-slate-500'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#162236] border border-[#23344f] flex items-center justify-center shrink-0">
                          {logo ? (
                            <img src={logo} alt="" className="w-5 h-5 object-contain" />
                          ) : (
                            <Trophy className="w-4 h-4 text-amber-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-bold text-white block truncate">{cup.name}</span>
                          <span className="text-[10px] text-slate-400">{cup.type}</span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Other presets from dropdownPresets */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Otras Competiciones Oficiales
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {COMPETITION_OPTIONS.slice(0, 15).map((comp, idx) => {
                    const isSelected = selectedComp === comp && activeTab !== 'custom';
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectComp(comp)}
                        className={`p-2 rounded-lg border text-left text-xs font-semibold truncate transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-400 text-black font-black border-amber-400 shadow'
                            : 'bg-[#111826] text-slate-300 border-[#1c283c] hover:bg-[#172133] hover:text-white'
                        }`}
                      >
                        {comp}
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
                Puedes registrar cualquier torneo amistoso o competición especial disputada en tu carrera.
              </p>
            </div>
          )}

          {/* Celebration Preview Card */}
          <div className="p-4 rounded-2xl bg-[#121a28] border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between border-b border-[#1c283d] pb-2">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Celebración que se publicará y archivará
              </span>
              <span className="text-xs font-bold text-white font-display">
                {effectiveComp || 'Competición'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              {/* Photo preview */}
              <div className="sm:col-span-4 relative rounded-xl overflow-hidden h-28 border border-amber-500/40">
                <img 
                  src={photoPreview} 
                  alt="Celebración" 
                  className="w-full h-full object-cover brightness-[0.7]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <span className="absolute bottom-2 left-2 text-[10px] font-black text-amber-300 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                  {isEuropean ? '🏆 Trofeo Europeo' : '🏆 Trofeo de Liga / Copa'}
                </span>
              </div>

              {/* Details & Date Inputs */}
              <div className="sm:col-span-8 space-y-2">
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
