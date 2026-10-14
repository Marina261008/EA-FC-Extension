import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Trophy, 
  Calendar, 
  MapPin, 
  Award, 
  ArrowRightLeft, 
  AlertTriangle 
} from 'lucide-react';
import { 
  ALL_PRESET_CLUBS, 
  getClubLogo,
  getOpponentsForContext
} from '../../clubsData';
import { 
  COMPETITION_OPTIONS, 
  MATCHDAY_OPTIONS, 
  MINUTE_OPTIONS,
  GOAL_TYPE_OPTIONS,
  SUB_REASON_OPTIONS,
  CARD_TYPE_OPTIONS,
  CARD_REASON_OPTIONS
} from '../../data/dropdownPresets';

export default function MatchModal({ isOpen, onClose, onSaveMatch, squad = [], clubName = 'Mi Club', league = 'LALIGA EA SPORTS' }) {
  if (!isOpen) return null;

  const [date, setDate] = useState('14 sep 2026');
  const [competition, setCompetition] = useState(league || COMPETITION_OPTIONS[0]);
  const [matchday, setMatchday] = useState(MATCHDAY_OPTIONS[0]);
  const [homeAway, setHomeAway] = useState('Casa');
  const [isChampionshipMatch, setIsChampionshipMatch] = useState(false);

  // Dynamically resolve rivals based on active competition, club and league
  const rivalsData = getOpponentsForContext(competition, league, clubName);
  const initialOpponent = rivalsData.primaryClubs[0]?.name || rivalsData.allAvailable[0]?.name || 'Atlético de Madrid';
  const [opponent, setOpponent] = useState(initialOpponent);

  const [ourScore, setOurScore] = useState(2);
  const [rivalScore, setRivalScore] = useState(1);
  const [stadium, setStadium] = useState('Estadio Principal');
  const [mvp, setMvp] = useState(squad[0]?.name || '');
  const [shots, setShots] = useState('14 - 9');
  const [possession, setPossession] = useState('54% - 46%');
  const [notes, setNotes] = useState('');

  const handleMatchdayChange = (newMd) => {
    setMatchday(newMd);
    if (newMd === 'Gran Final 🏆') {
      setIsChampionshipMatch(true);
    }
  };

  // Handle changing competition: dynamically switches opponent to first valid club of that competition
  const handleCompetitionChange = (newComp) => {
    setCompetition(newComp);
    const newRivalsData = getOpponentsForContext(newComp, league, clubName);
    const isCurrentValid = newRivalsData.primaryClubs.some(c => c.name === opponent);
    if (!isCurrentValid && newRivalsData.primaryClubs.length > 0) {
      const nextOpp = newRivalsData.primaryClubs[0].name;
      setOpponent(nextOpp);
      const found = ALL_PRESET_CLUBS.find(c => c.name === nextOpp);
      if (homeAway === 'Fuera' && found?.stadium) {
        setStadium(found.stadium);
      }
    }
  };
  
  // Scorers list: assist is completely optional (defaults to '')
  const [scorers, setScorers] = useState([
    { 
      team: 'us',
      player: squad[11]?.name || squad[0]?.name || 'Hugo Duro', 
      minute: "33'", 
      assist: '',
      type: 'Gol en Jugada'
    }
  ]);

  // Substitutions during match: reason is completely optional (defaults to '')
  const [substitutions, setSubstitutions] = useState([
    {
      playerOut: squad[10]?.name || squad[0]?.name || '',
      playerIn: squad[12]?.name || squad[1]?.name || '',
      minute: "62'",
      reason: ''
    }
  ]);

  // Disciplinary Cards
  const [cards, setCards] = useState([
    {
      team: 'us',
      player: squad[4]?.name || squad[0]?.name || '',
      type: 'yellow',
      minute: "41'",
      reason: 'Falta táctica'
    }
  ]);

  const addScorerRow = () => {
    setScorers([...scorers, { team: 'us', player: squad[0]?.name || '', minute: "45'", assist: '', type: 'Gol en Jugada' }]);
  };

  const removeScorerRow = (index) => {
    setScorers(scorers.filter((_, i) => i !== index));
  };

  const updateScorer = (index, field, value) => {
    const updated = [...scorers];
    updated[index][field] = value;
    setScorers(updated);
  };

  const addSubstitutionRow = () => {
    setSubstitutions([
      ...substitutions,
      { playerOut: squad[0]?.name || '', playerIn: squad[1]?.name || '', minute: "60'", reason: '' }
    ]);
  };

  const removeSubstitutionRow = (index) => {
    setSubstitutions(substitutions.filter((_, i) => i !== index));
  };

  const updateSubstitution = (index, field, value) => {
    const updated = [...substitutions];
    updated[index][field] = value;
    setSubstitutions(updated);
  };

  const addCardRow = () => {
    setCards([
      ...cards,
      { team: 'us', player: squad[0]?.name || '', type: 'yellow', minute: "55'", reason: 'Falta táctica' }
    ]);
  };

  const removeCardRow = (index) => {
    setCards(cards.filter((_, i) => i !== index));
  };

  const updateCard = (index, field, value) => {
    const updated = [...cards];
    updated[index][field] = value;
    setCards(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isHome = homeAway === 'Casa';
    const homeTeam = isHome ? clubName : opponent;
    const awayTeam = isHome ? opponent : clubName;
    const homeScore = isHome ? Number(ourScore) : Number(rivalScore);
    const awayScore = isHome ? Number(rivalScore) : Number(ourScore);

    let result = 'Empate';
    if (ourScore > rivalScore) result = 'Victoria';
    else if (ourScore < rivalScore) result = 'Derrota';

    const homeLogo = getClubLogo(homeTeam);
    const awayLogo = getClubLogo(awayTeam);

    const wonTitle = (isChampionshipMatch || matchday === 'Gran Final 🏆') && Number(ourScore) > Number(rivalScore);

    const newMatch = {
      id: `match-${Date.now()}`,
      date,
      competition,
      matchday,
      homeAway,
      homeTeam,
      awayTeam,
      homeLogo,
      awayLogo,
      homeScore,
      awayScore,
      result,
      stadium,
      scorers: scorers.filter(s => s.player),
      substitutions: substitutions.filter(s => s.playerOut || s.playerIn),
      cards: cards.filter(c => c.player),
      mvp,
      shots,
      possession,
      notes,
      wonTitle
    };

    onSaveMatch(newMatch);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto overflow-x-hidden">
      <div className="bg-[#101724] border border-[#22314a] rounded-2xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl relative animate-in fade-in zoom-in-95 my-4 sm:my-8 max-h-[92vh] overflow-y-auto overflow-x-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-lg bg-[#162030] hover:bg-[#1f2d42] transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5 pb-3.5 border-b border-[#1c273a]">
          <div className="w-10 h-10 rounded-xl bg-[#00ff87]/20 border border-[#00ff87]/40 flex items-center justify-center text-[#00ff87] shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white font-display">Registrar Partido</h2>
            <p className="text-xs text-slate-400">Introduce los datos del partido, marcador final, goleadores y sucesos clave</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Row 1: Competición, Jornada, Fecha */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="min-w-0">
              <label className="block text-slate-400 font-semibold mb-1 truncate">Competición</label>
              <select
                value={competition}
                onChange={(e) => handleCompetitionChange(e.target.value)}
                className="w-full min-w-0 bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-[#00ff87] truncate"
              >
                {COMPETITION_OPTIONS.map((c, i) => (
                  <option key={i} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="min-w-0">
              <label className="block text-slate-400 font-semibold mb-1 truncate">Jornada / Ronda</label>
              <select
                value={matchday}
                onChange={(e) => handleMatchdayChange(e.target.value)}
                className="w-full min-w-0 bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-[#00ff87] truncate"
              >
                {MATCHDAY_OPTIONS.map((m, i) => (
                  <option key={i} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div className="min-w-0">
              <label className="block text-slate-400 font-semibold mb-1 truncate">Fecha en el juego</label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full min-w-0 bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-[#00ff87]"
                placeholder="15 sep 2026"
              />
            </div>
          </div>

          {/* Row 2: Rival, Casa/Fuera, Estadio */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="min-w-0">
              <label className="block text-slate-400 font-semibold mb-1 truncate">
                Equipo Rival ({rivalsData.primaryClubs.length} disponibles)
              </label>
              <select
                value={opponent}
                onChange={(e) => {
                  const val = e.target.value;
                  setOpponent(val);
                  const found = ALL_PRESET_CLUBS.find(c => c.name === val);
                  if (homeAway === 'Fuera' && found?.stadium) {
                    setStadium(found.stadium);
                  }
                }}
                className="w-full min-w-0 bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-[#00ff87] truncate"
              >
                <optgroup label={rivalsData.primaryLabel}>
                  {rivalsData.primaryClubs.map((c) => (
                    <option key={c.id || c.name} value={c.name}>{c.name}</option>
                  ))}
                </optgroup>
                {rivalsData.secondaryClubs.length > 0 && (
                  <optgroup label={rivalsData.secondaryLabel}>
                    {rivalsData.secondaryClubs.map((c) => (
                      <option key={c.id || c.name} value={c.name}>{c.name}</option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>

            <div className="min-w-0">
              <label className="block text-slate-400 font-semibold mb-1 truncate">Condición (Local / Visitante)</label>
              <select
                value={homeAway}
                onChange={(e) => {
                  const val = e.target.value;
                  setHomeAway(val);
                  if (val === 'Fuera') {
                    const found = ALL_PRESET_CLUBS.find(c => c.name === opponent);
                    if (found?.stadium) setStadium(found.stadium);
                  }
                }}
                className="w-full min-w-0 bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-[#00ff87]"
              >
                <option value="Casa">Casa (Local)</option>
                <option value="Fuera">Fuera (Visitante)</option>
              </select>
            </div>

            <div className="min-w-0">
              <label className="block text-slate-400 font-semibold mb-1 truncate">Estadio</label>
              <input
                type="text"
                value={stadium}
                onChange={(e) => setStadium(e.target.value)}
                className="w-full min-w-0 bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-[#00ff87]"
                placeholder="Estadio Municipal, Bernabéu, Camp Nou..."
              />
            </div>
          </div>

          {/* Row 3: Marcador Final (Redesigned Stadium Scoreboard) */}
          <div className="bg-[#141d2c] border border-[#22314a] p-4 sm:p-5 rounded-2xl overflow-hidden">
            <p className="text-center font-black text-slate-400 uppercase tracking-widest text-[10px] mb-3">
              MARCADOR FINAL DEL PARTIDO
            </p>
            <div className="flex items-center justify-around gap-2 sm:gap-6">
              
              {/* Equipo Usuario */}
              <div className="flex-1 flex flex-col items-center min-w-0 max-w-[240px]">
                <div className="w-12 h-12 rounded-xl bg-[#1a2538] border border-[#2c3e59] p-2 flex items-center justify-center mb-2 shadow-inner shrink-0">
                  <img
                    src={getClubLogo(clubName)}
                    alt={clubName}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
                <span className="font-extrabold text-white text-xs sm:text-sm text-center truncate w-full mb-2">
                  {clubName}
                </span>
                <input
                  type="number"
                  min="0"
                  value={ourScore}
                  onChange={(e) => setOurScore(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-18 sm:w-20 text-center text-3xl font-black bg-[#1b2639] border-2 border-[#2a3c5a] rounded-xl py-1.5 text-[#00ff87] focus:outline-none focus:border-[#00ff87] shadow-inner"
                />
              </div>

              {/* Separador */}
              <div className="flex flex-col items-center justify-center shrink-0 px-1">
                <span className="text-2xl sm:text-3xl font-black text-slate-500">:</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase mt-1">VS</span>
              </div>

              {/* Equipo Rival */}
              <div className="flex-1 flex flex-col items-center min-w-0 max-w-[240px]">
                <div className="w-12 h-12 rounded-xl bg-[#1a2538] border border-[#2c3e59] p-2 flex items-center justify-center mb-2 shadow-inner shrink-0">
                  <img
                    src={getClubLogo(opponent)}
                    alt={opponent}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
                <span className="font-extrabold text-white text-xs sm:text-sm text-center truncate w-full mb-2">
                  {opponent}
                </span>
                <input
                  type="number"
                  min="0"
                  value={rivalScore}
                  onChange={(e) => setRivalScore(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-18 sm:w-20 text-center text-3xl font-black bg-[#1b2639] border-2 border-[#2a3c5a] rounded-xl py-1.5 text-white focus:outline-none focus:border-[#00ff87] shadow-inner"
                />
              </div>

            </div>
          </div>

          {/* Championship Win Toggle Card */}
          <div 
            onClick={() => setIsChampionshipMatch(!isChampionshipMatch)}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
              isChampionshipMatch
                ? 'bg-gradient-to-r from-amber-950/60 via-[#1a140a] to-amber-950/40 border-amber-500/60 shadow-lg shadow-amber-500/10'
                : 'bg-[#141d2c] border-[#22314a] hover:border-[#2e405e]'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                isChampionshipMatch ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-[#1b2639] text-slate-400'
              }`}>
                🏆
              </div>
              <div className="min-w-0">
                <p className="font-extrabold text-xs text-white flex items-center gap-1.5 flex-wrap">
                  <span>¿Este partido proclama Campeón a tu equipo?</span>
                  {isChampionshipMatch && (
                    <span className="text-[10px] px-2 py-0.2 rounded bg-amber-500 text-black font-black uppercase">¡Título!</span>
                  )}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {isChampionshipMatch 
                    ? `¡Al ganar, se colgará la foto oficial con el trofeo y tu escudo en el tablero!`
                    : `Actívalo si es una Final ganada o el partido donde aseguras matemáticamente el título`}
                </p>
              </div>
            </div>
            <input 
              type="checkbox" 
              checked={isChampionshipMatch}
              onChange={(e) => setIsChampionshipMatch(e.target.checked)}
              className="w-5 h-5 accent-amber-400 cursor-pointer shrink-0"
            />
          </div>

          {/* Section: Goles del Partido (Completely Fixed Dimensions & Responsive) */}
          <div className="bg-[#141d2c] border border-[#202d42] p-3.5 sm:p-4 rounded-xl space-y-3 overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base">⚽</span>
                <div>
                  <h4 className="font-bold text-white text-xs">Goles del Partido ({scorers.length})</h4>
                  <p className="text-[10px] text-slate-400">Registra goleador, minuto y tipo de tanto (asistencia opcional)</p>
                </div>
              </div>
              <button
                type="button"
                onClick={addScorerRow}
                className="text-[11px] font-bold text-[#00ff87] hover:text-[#00e676] bg-[#1a2638] px-3 py-1.5 rounded-lg border border-[#273952] flex items-center gap-1 cursor-pointer transition-colors shrink-0"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Añadir Gol</span>
              </button>
            </div>

            {scorers.length === 0 ? (
              <p className="text-[11px] text-slate-500 italic text-center py-3 bg-[#101725] rounded-xl border border-[#1b263a]">
                No has registrado goles para este partido
              </p>
            ) : (
              <div className="space-y-3">
                {scorers.map((row, idx) => (
                  <div key={idx} className="bg-[#101725] p-3 sm:p-3.5 rounded-xl border border-[#1e2c40] space-y-2.5">
                    
                    {/* Header bar of Goal card */}
                    <div className="flex items-center justify-between pb-2 border-b border-[#182335]">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-[#00ff87] bg-[#00ff87]/15 px-2 py-0.5 rounded-md border border-[#00ff87]/30">
                          Gol #{idx + 1}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400">
                          <span>Minuto:</span>
                          <select
                            value={row.minute}
                            onChange={(e) => updateScorer(idx, 'minute', e.target.value)}
                            className="bg-[#172336] border border-[#273852] rounded-lg px-2 py-0.5 text-xs text-[#00ff87] font-black focus:outline-none"
                          >
                            {MINUTE_OPTIONS.map((m, i) => (
                              <option key={i} value={m}>{m}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeScorerRow(idx)}
                        className="text-red-400 hover:text-red-300 p-1 rounded-lg hover:bg-red-500/10 transition-colors flex items-center gap-1 text-[11px]"
                        title="Eliminar este gol"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Eliminar</span>
                      </button>
                    </div>

                    {/* Form Fields: Clean 4-Column Responsive Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                      <div className="min-w-0">
                        <label className="block text-[10px] font-bold text-slate-400 mb-1 truncate">Equipo</label>
                        <select
                          value={row.team || 'us'}
                          onChange={(e) => updateScorer(idx, 'team', e.target.value)}
                          className="w-full min-w-0 bg-[#172336] border border-[#273852] rounded-lg px-2.5 py-1.5 text-xs font-bold text-white focus:outline-none truncate"
                        >
                          <option value="us">🟢 {clubName}</option>
                          <option value="rival">⚪ {opponent}</option>
                        </select>
                      </div>

                      <div className="min-w-0">
                        <label className="block text-[10px] font-bold text-slate-400 mb-1 truncate">Goleador</label>
                        {row.team === 'rival' ? (
                          <input
                            type="text"
                            placeholder="Goleador rival..."
                            value={row.player}
                            onChange={(e) => updateScorer(idx, 'player', e.target.value)}
                            className="w-full min-w-0 bg-[#172336] border border-[#273852] rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                          />
                        ) : (
                          <select
                            value={row.player}
                            onChange={(e) => updateScorer(idx, 'player', e.target.value)}
                            className="w-full min-w-0 bg-[#172336] border border-[#273852] rounded-lg px-2.5 py-1.5 text-xs text-white font-medium focus:outline-none truncate"
                          >
                            <option value="">Selecciona goleador...</option>
                            {squad.map((p) => (
                              <option key={p.id} value={p.name}>{p.name} ({p.position})</option>
                            ))}
                          </select>
                        )}
                      </div>

                      <div className="min-w-0">
                        <label className="block text-[10px] font-bold text-slate-400 mb-1 truncate">Tipo de tanto</label>
                        <select
                          value={row.type || 'Gol en Jugada'}
                          onChange={(e) => updateScorer(idx, 'type', e.target.value)}
                          className="w-full min-w-0 bg-[#172336] border border-[#273852] rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none truncate"
                        >
                          {GOAL_TYPE_OPTIONS.map((gt, i) => (
                            <option key={i} value={gt}>{gt}</option>
                          ))}
                        </select>
                      </div>

                      <div className="min-w-0">
                        <label className="block text-[10px] font-bold text-slate-400 mb-1 truncate">Asistencia (Opcional)</label>
                        {row.team === 'rival' ? (
                          <input
                            type="text"
                            placeholder="Asistente rival (Opcional)..."
                            value={row.assist}
                            onChange={(e) => updateScorer(idx, 'assist', e.target.value)}
                            className="w-full min-w-0 bg-[#172336] border border-[#273852] rounded-lg px-2.5 py-1.5 text-xs text-slate-300 placeholder-slate-500 focus:outline-none"
                          />
                        ) : (
                          <select
                            value={row.assist}
                            onChange={(e) => updateScorer(idx, 'assist', e.target.value)}
                            className="w-full min-w-0 bg-[#172336] border border-[#273852] rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none truncate"
                          >
                            <option value="">Sin asistencia (Opcional)</option>
                            {squad.map((p) => (
                              <option key={p.id} value={p.name}>Asist: {p.name}</option>
                            ))}
                          </select>
                        )}
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Cambios y Sustituciones (Completely Fixed Dimensions & Responsive) */}
          <div className="bg-[#141d2c] border border-[#202d42] p-3.5 sm:p-4 rounded-xl space-y-3 overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                  <ArrowRightLeft className="w-3 h-3" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">Cambios durante el partido ({substitutions.length})</h4>
                  <p className="text-[10px] text-slate-400">Jugador sustituido, jugador que entra y minuto (motivo opcional)</p>
                </div>
              </div>
              <button
                type="button"
                onClick={addSubstitutionRow}
                className="text-[11px] font-bold text-sky-400 hover:text-sky-300 bg-[#1a2638] px-3 py-1.5 rounded-lg border border-[#273952] flex items-center gap-1 cursor-pointer transition-colors shrink-0"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Añadir Cambio</span>
              </button>
            </div>

            {substitutions.length === 0 ? (
              <p className="text-[11px] text-slate-500 italic text-center py-3 bg-[#101725] rounded-xl border border-[#1b263a]">
                No se han realizado sustituciones en este partido
              </p>
            ) : (
              <div className="space-y-3">
                {substitutions.map((row, idx) => (
                  <div key={idx} className="bg-[#101725] p-3 sm:p-3.5 rounded-xl border border-[#1e2c40] space-y-2.5">
                    
                    {/* Header bar of Substitution card */}
                    <div className="flex items-center justify-between pb-2 border-b border-[#182335]">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-sky-400 bg-sky-500/15 px-2 py-0.5 rounded-md border border-sky-500/30">
                          Cambio #{idx + 1}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400">
                          <span>Minuto:</span>
                          <select
                            value={row.minute}
                            onChange={(e) => updateSubstitution(idx, 'minute', e.target.value)}
                            className="bg-[#172336] border border-[#273852] rounded-lg px-2 py-0.5 text-xs text-sky-400 font-black focus:outline-none"
                          >
                            {MINUTE_OPTIONS.map((m, i) => (
                              <option key={i} value={m}>{m}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeSubstitutionRow(idx)}
                        className="text-red-400 hover:text-red-300 p-1 rounded-lg hover:bg-red-500/10 transition-colors flex items-center gap-1 text-[11px]"
                        title="Eliminar este cambio"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Eliminar</span>
                      </button>
                    </div>

                    {/* Form Fields: 3-Column Responsive Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div className="min-w-0">
                        <label className="block text-[10px] font-bold text-red-400 mb-1 flex items-center gap-1 truncate">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                          <span>Sale del campo</span>
                        </label>
                        <select
                          value={row.playerOut}
                          onChange={(e) => updateSubstitution(idx, 'playerOut', e.target.value)}
                          className="w-full min-w-0 bg-[#172336] border border-red-500/30 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none truncate"
                        >
                          <option value="">Selecciona quién sale...</option>
                          {squad.map((p) => (
                            <option key={p.id} value={p.name}>{p.name} ({p.position})</option>
                          ))}
                        </select>
                      </div>

                      <div className="min-w-0">
                        <label className="block text-[10px] font-bold text-emerald-400 mb-1 flex items-center gap-1 truncate">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          <span>Entra al campo</span>
                        </label>
                        <select
                          value={row.playerIn}
                          onChange={(e) => updateSubstitution(idx, 'playerIn', e.target.value)}
                          className="w-full min-w-0 bg-[#172336] border border-emerald-500/30 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none truncate"
                        >
                          <option value="">Selecciona quién entra...</option>
                          {squad.map((p) => (
                            <option key={p.id} value={p.name}>{p.name} ({p.position})</option>
                          ))}
                        </select>
                      </div>

                      <div className="min-w-0">
                        <label className="block text-[10px] font-bold text-slate-400 mb-1 truncate">Motivo del cambio (Opcional)</label>
                        <select
                          value={row.reason}
                          onChange={(e) => updateSubstitution(idx, 'reason', e.target.value)}
                          className="w-full min-w-0 bg-[#172336] border border-[#273852] rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none truncate"
                        >
                          <option value="">Sin motivo especificado</option>
                          {SUB_REASON_OPTIONS.map((r, i) => (
                            <option key={i} value={r}>{r}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Tarjetas del Partido (Completely Fixed Dimensions & Responsive) */}
          <div className="bg-[#141d2c] border border-[#202d42] p-3.5 sm:p-4 rounded-xl space-y-3 overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-3 h-3" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">Tarjetas y Amonestaciones ({cards.length})</h4>
                  <p className="text-[10px] text-slate-400">Amarillas y rojas mostradas por el colegiado</p>
                </div>
              </div>
              <button
                type="button"
                onClick={addCardRow}
                className="text-[11px] font-bold text-amber-400 hover:text-amber-300 bg-[#1a2638] px-3 py-1.5 rounded-lg border border-[#273952] flex items-center gap-1 cursor-pointer transition-colors shrink-0"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Añadir Tarjeta</span>
              </button>
            </div>

            {cards.length === 0 ? (
              <p className="text-[11px] text-slate-500 italic text-center py-3 bg-[#101725] rounded-xl border border-[#1b263a]">
                Sin amonestaciones registradas en el encuentro
              </p>
            ) : (
              <div className="space-y-3">
                {cards.map((row, idx) => (
                  <div key={idx} className="bg-[#101725] p-3 sm:p-3.5 rounded-xl border border-[#1e2c40] space-y-2.5">
                    
                    {/* Header bar of Card item */}
                    <div className="flex items-center justify-between pb-2 border-b border-[#182335]">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-md border border-amber-500/30">
                          Tarjeta #{idx + 1}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400">
                          <span>Minuto:</span>
                          <select
                            value={row.minute}
                            onChange={(e) => updateCard(idx, 'minute', e.target.value)}
                            className="bg-[#172336] border border-[#273852] rounded-lg px-2 py-0.5 text-xs text-amber-400 font-black focus:outline-none"
                          >
                            {MINUTE_OPTIONS.map((m, i) => (
                              <option key={i} value={m}>{m}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeCardRow(idx)}
                        className="text-red-400 hover:text-red-300 p-1 rounded-lg hover:bg-red-500/10 transition-colors flex items-center gap-1 text-[11px]"
                        title="Eliminar esta tarjeta"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Eliminar</span>
                      </button>
                    </div>

                    {/* Form Fields: 4-Column Responsive Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                      <div className="min-w-0">
                        <label className="block text-[10px] font-bold text-slate-400 mb-1 truncate">Tipo de sanción</label>
                        <select
                          value={row.type}
                          onChange={(e) => updateCard(idx, 'type', e.target.value)}
                          className={`w-full min-w-0 rounded-lg px-2.5 py-1.5 text-xs font-bold border focus:outline-none truncate ${
                            row.type === 'yellow' ? 'bg-amber-950/40 text-amber-300 border-amber-500/40' :
                            row.type === 'red' ? 'bg-red-950/40 text-red-300 border-red-500/40' :
                            'bg-orange-950/40 text-orange-300 border-orange-500/40'
                          }`}
                        >
                          {CARD_TYPE_OPTIONS.map((ct) => (
                            <option key={ct.value} value={ct.value}>{ct.label}</option>
                          ))}
                        </select>
                      </div>

                      <div className="min-w-0">
                        <label className="block text-[10px] font-bold text-slate-400 mb-1 truncate">Equipo</label>
                        <select
                          value={row.team || 'us'}
                          onChange={(e) => updateCard(idx, 'team', e.target.value)}
                          className="w-full min-w-0 bg-[#172336] border border-[#273852] rounded-lg px-2.5 py-1.5 text-xs font-bold text-white focus:outline-none truncate"
                        >
                          <option value="us">🟢 {clubName}</option>
                          <option value="rival">⚪ {opponent}</option>
                        </select>
                      </div>

                      <div className="min-w-0">
                        <label className="block text-[10px] font-bold text-slate-400 mb-1 truncate">Jugador amonestado</label>
                        {row.team === 'rival' ? (
                          <input
                            type="text"
                            placeholder="Nombre del rival..."
                            value={row.player}
                            onChange={(e) => updateCard(idx, 'player', e.target.value)}
                            className="w-full min-w-0 bg-[#172336] border border-[#273852] rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                          />
                        ) : (
                          <select
                            value={row.player}
                            onChange={(e) => updateCard(idx, 'player', e.target.value)}
                            className="w-full min-w-0 bg-[#172336] border border-[#273852] rounded-lg px-2.5 py-1.5 text-xs text-white font-medium focus:outline-none truncate"
                          >
                            <option value="">Selecciona jugador...</option>
                            {squad.map((p) => (
                              <option key={p.id} value={p.name}>{p.name} ({p.position})</option>
                            ))}
                          </select>
                        )}
                      </div>

                      <div className="min-w-0">
                        <label className="block text-[10px] font-bold text-slate-400 mb-1 truncate">Motivo</label>
                        <select
                          value={row.reason}
                          onChange={(e) => updateCard(idx, 'reason', e.target.value)}
                          className="w-full min-w-0 bg-[#172336] border border-[#273852] rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none truncate"
                        >
                          {CARD_REASON_OPTIONS.map((cr, i) => (
                            <option key={i} value={cr}>{cr}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Row 5: MVP & Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="min-w-0">
              <label className="block text-slate-400 font-semibold mb-1 truncate">MVP / Mejor del Partido</label>
              <select
                value={mvp}
                onChange={(e) => setMvp(e.target.value)}
                className="w-full min-w-0 bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-[#00ff87] truncate"
              >
                <option value="">Selecciona MVP...</option>
                {squad.map((p) => (
                  <option key={p.id} value={p.name}>{p.name} ({p.position})</option>
                ))}
              </select>
            </div>

            <div className="min-w-0">
              <label className="block text-slate-400 font-semibold mb-1 truncate">Tiros (Tú - Rival)</label>
              <input
                type="text"
                value={shots}
                onChange={(e) => setShots(e.target.value)}
                className="w-full min-w-0 bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-[#00ff87]"
                placeholder="14 - 8"
              />
            </div>

            <div className="min-w-0">
              <label className="block text-slate-400 font-semibold mb-1 truncate">Posesión (Tú - Rival)</label>
              <input
                type="text"
                value={possession}
                onChange={(e) => setPossession(e.target.value)}
                className="w-full min-w-0 bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-[#00ff87]"
                placeholder="55% - 45%"
              />
            </div>
          </div>

          {/* Notes / Crónica */}
          <div className="min-w-0">
            <label className="block text-slate-400 font-semibold mb-1 truncate">Notas del Partido / Crónica</label>
            <textarea
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full min-w-0 bg-[#162234] border border-[#25364f] rounded-xl p-2.5 text-white focus:outline-none focus:border-[#00ff87]"
              placeholder="Sensaciones tácticas, cambios clave, goles destacados..."
            ></textarea>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3.5 border-t border-[#1c273a]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-300 hover:bg-[#162030] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#00ff87] hover:bg-[#00e676] active:scale-95 text-[#090d14] font-bold shadow-lg shadow-[#00ff87]/20 transition-all cursor-pointer"
            >
              Guardar Partido
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
