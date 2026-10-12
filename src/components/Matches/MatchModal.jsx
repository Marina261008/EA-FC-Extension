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
  LALIGA_CLUBS, 
  SEGUNDA_CLUBS, 
  PREMIER_LEAGUE_CLUBS, 
  SERIE_A_CLUBS, 
  EUROPEAN_GIANTS, 
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

export default function MatchModal({ isOpen, onClose, onSaveMatch, squad, clubName, league }) {
  if (!isOpen) return null;

  const [date, setDate] = useState('14 sep 2025');
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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#101724] border border-[#22314a] rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 my-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-[#162030] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-[#1c273a]">
          <div className="w-9 h-9 rounded-xl bg-[#00ff87]/20 border border-[#00ff87]/40 flex items-center justify-center text-[#00ff87]">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white font-display">Registrar Partido</h2>
            <p className="text-xs text-slate-400">Selecciona con menús desplegables la competición, jornada y rival</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Row 1: Competición, Jornada, Fecha */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Competición</label>
              <select
                value={competition}
                onChange={(e) => handleCompetitionChange(e.target.value)}
                className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-[#00ff87]"
              >
                {COMPETITION_OPTIONS.map((c, i) => (
                  <option key={i} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Jornada / Ronda</label>
              <select
                value={matchday}
                onChange={(e) => handleMatchdayChange(e.target.value)}
                className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-[#00ff87]"
              >
                {MATCHDAY_OPTIONS.map((m, i) => (
                  <option key={i} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Fecha en el juego</label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-[#00ff87]"
                placeholder="15 sep 2025"
              />
            </div>
          </div>

          {/* Row 2: Rival, Casa/Fuera, Estadio */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Equipo Rival ({rivalsData.primaryClubs.length} disponibles)</label>
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
                className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-[#00ff87]"
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
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Local / Visitante</label>
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
                className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-[#00ff87]"
              >
                <option value="Casa">Casa (Local)</option>
                <option value="Fuera">Fuera (Visitante)</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Estadio</label>
              <input
                type="text"
                value={stadium}
                onChange={(e) => setStadium(e.target.value)}
                className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-[#00ff87]"
                placeholder="Estadio Municipal, Bernabéu, etc."
              />
            </div>
          </div>

          {/* Row 3: Marcador */}
          <div className="bg-[#141d2c] border border-[#22314a] p-4 rounded-xl">
            <p className="text-center font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-2">
              Marcador Final
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <span className="block font-bold text-white mb-1 truncate max-w-[120px]">{clubName}</span>
                <input
                  type="number"
                  min="0"
                  value={ourScore}
                  onChange={(e) => setOurScore(e.target.value)}
                  className="w-16 text-center text-2xl font-black bg-[#1b2639] border border-[#2a3c5a] rounded-xl py-1 text-[#00ff87] focus:outline-none focus:border-[#00ff87]"
                />
              </div>
              <span className="text-2xl font-black text-slate-500">:</span>
              <div className="text-center">
                <span className="block font-bold text-white mb-1 truncate max-w-[120px]">{opponent}</span>
                <input
                  type="number"
                  min="0"
                  value={rivalScore}
                  onChange={(e) => setRivalScore(e.target.value)}
                  className="w-16 text-center text-2xl font-black bg-[#1b2639] border border-[#2a3c5a] rounded-xl py-1 text-white focus:outline-none focus:border-[#00ff87]"
                />
              </div>
            </div>
          </div>

          {/* Championship Win Toggle Card */}
          <div 
            onClick={() => setIsChampionshipMatch(!isChampionshipMatch)}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
              isChampionshipMatch
                ? 'bg-gradient-to-r from-amber-950/60 via-[#1a140a] to-amber-950/40 border-amber-500/60 shadow-lg shadow-amber-500/10'
                : 'bg-[#141d2c] border-[#22314a] hover:border-[#2e405e]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${
                isChampionshipMatch ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-[#1b2639] text-slate-400'
              }`}>
                🏆
              </div>
              <div>
                <p className="font-extrabold text-xs text-white flex items-center gap-1.5">
                  <span>¿Este partido proclama Campeón a tu equipo?</span>
                  {isChampionshipMatch && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500 text-black font-black uppercase">¡Título!</span>
                  )}
                </p>
                <p className="text-[10px] text-slate-400">
                  {isChampionshipMatch 
                    ? `¡Al ganar, se colgará la foto oficial con el trofeo y tu escudo en el tablero!`
                    : `Actívalo si es una Final ganada o el partido donde aseguras el título de Liga`}
                </p>
              </div>
            </div>
            <input 
              type="checkbox" 
              checked={isChampionshipMatch}
              onChange={(e) => setIsChampionshipMatch(e.target.checked)}
              className="w-4 h-4 accent-amber-400 cursor-pointer"
            />
          </div>

          {/* Section: Goles del Partido */}
          <div className="bg-[#141d2c] border border-[#202d42] p-3.5 rounded-xl space-y-3">
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
                className="text-[11px] font-bold text-[#00ff87] hover:text-[#00e676] bg-[#1a2638] px-2.5 py-1 rounded-lg border border-[#273952] flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3 h-3 stroke-[2.5]" />
                <span>Añadir Gol</span>
              </button>
            </div>

            {scorers.length === 0 ? (
              <p className="text-[11px] text-slate-500 italic text-center py-2">No has registrado goles para este partido</p>
            ) : (
              <div className="space-y-2">
                {scorers.map((row, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-[#101725] p-2.5 rounded-xl border border-[#1e2c40]">
                    {/* Team selector */}
                    <select
                      value={row.team || 'us'}
                      onChange={(e) => updateScorer(idx, 'team', e.target.value)}
                      className="w-full sm:w-28 bg-[#172336] border border-[#273852] rounded-lg px-2 py-1.5 text-xs font-bold text-white shrink-0"
                    >
                      <option value="us">🟢 {clubName}</option>
                      <option value="rival">⚪ {opponent}</option>
                    </select>

                    {/* Scorer name */}
                    {row.team === 'rival' ? (
                      <input
                        type="text"
                        placeholder="Goleador rival..."
                        value={row.player}
                        onChange={(e) => updateScorer(idx, 'player', e.target.value)}
                        className="flex-1 min-w-[120px] bg-[#172336] border border-[#273852] rounded-lg px-2 py-1.5 text-xs text-white"
                      />
                    ) : (
                      <select
                        value={row.player}
                        onChange={(e) => updateScorer(idx, 'player', e.target.value)}
                        className="flex-1 min-w-[130px] bg-[#172336] border border-[#273852] rounded-lg px-2 py-1.5 text-xs text-white font-medium"
                      >
                        <option value="">Goleador...</option>
                        {squad.map((p) => (
                          <option key={p.id} value={p.name}>{p.name} ({p.position})</option>
                        ))}
                      </select>
                    )}

                    {/* Minute */}
                    <select
                      value={row.minute}
                      onChange={(e) => updateScorer(idx, 'minute', e.target.value)}
                      className="w-full sm:w-24 bg-[#172336] border border-[#273852] rounded-lg px-2 py-1.5 text-xs text-[#00ff87] font-black shrink-0"
                    >
                      {MINUTE_OPTIONS.map((m, i) => (
                        <option key={i} value={m}>{m}</option>
                      ))}
                    </select>

                    {/* Assist (no cal posar l'asistent) */}
                    {row.team === 'rival' ? (
                      <input
                        type="text"
                        placeholder="Asistencia (Opcional)..."
                        value={row.assist}
                        onChange={(e) => updateScorer(idx, 'assist', e.target.value)}
                        className="flex-1 min-w-[100px] bg-[#172336] border border-[#273852] rounded-lg px-2 py-1.5 text-xs text-slate-300"
                      />
                    ) : (
                      <select
                        value={row.assist}
                        onChange={(e) => updateScorer(idx, 'assist', e.target.value)}
                        className="flex-1 min-w-[120px] bg-[#172336] border border-[#273852] rounded-lg px-2 py-1.5 text-xs text-slate-300"
                      >
                        <option value="">Sin asistencia (Opcional)</option>
                        {squad.map((p) => (
                          <option key={p.id} value={p.name}>Asist: {p.name}</option>
                        ))}
                      </select>
                    )}

                    {/* Goal Type */}
                    <select
                      value={row.type || 'Gol en Jugada'}
                      onChange={(e) => updateScorer(idx, 'type', e.target.value)}
                      className="w-full sm:w-32 bg-[#172336] border border-[#273852] rounded-lg px-2 py-1.5 text-xs text-slate-300 shrink-0"
                    >
                      {GOAL_TYPE_OPTIONS.map((gt, i) => (
                        <option key={i} value={gt}>{gt}</option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => removeScorerRow(idx)}
                      className="text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors self-end sm:self-center"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Cambios y Sustituciones */}
          <div className="bg-[#141d2c] border border-[#202d42] p-3.5 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
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
                className="text-[11px] font-bold text-sky-400 hover:text-sky-300 bg-[#1a2638] px-2.5 py-1 rounded-lg border border-[#273952] flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3 h-3 stroke-[2.5]" />
                <span>Añadir Cambio</span>
              </button>
            </div>

            {substitutions.length === 0 ? (
              <p className="text-[11px] text-slate-500 italic text-center py-2">No se han realizado sustituciones en este partido</p>
            ) : (
              <div className="space-y-2">
                {substitutions.map((row, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-[#101725] p-2.5 rounded-xl border border-[#1e2c40]">
                    {/* Minute */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] font-bold text-slate-400">Min:</span>
                      <select
                        value={row.minute}
                        onChange={(e) => updateSubstitution(idx, 'minute', e.target.value)}
                        className="w-24 bg-[#172336] border border-[#273852] rounded-lg px-2 py-1.5 text-xs text-sky-400 font-black"
                      >
                        {MINUTE_OPTIONS.map((m, i) => (
                          <option key={i} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>

                    {/* Player OUT */}
                    <div className="flex-1 min-w-[130px]">
                      <div className="flex items-center gap-1 mb-0.5">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        <span className="text-[10px] text-red-400 font-bold">Sale:</span>
                      </div>
                      <select
                        value={row.playerOut}
                        onChange={(e) => updateSubstitution(idx, 'playerOut', e.target.value)}
                        className="w-full bg-[#172336] border border-red-500/30 rounded-lg px-2 py-1 text-xs text-white"
                      >
                        <option value="">Quién sale...</option>
                        {squad.map((p) => (
                          <option key={p.id} value={p.name}>{p.name} ({p.position})</option>
                        ))}
                      </select>
                    </div>

                    {/* Player IN */}
                    <div className="flex-1 min-w-[130px]">
                      <div className="flex items-center gap-1 mb-0.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span className="text-[10px] text-emerald-400 font-bold">Entra:</span>
                      </div>
                      <select
                        value={row.playerIn}
                        onChange={(e) => updateSubstitution(idx, 'playerIn', e.target.value)}
                        className="w-full bg-[#172336] border border-emerald-500/30 rounded-lg px-2 py-1 text-xs text-white"
                      >
                        <option value="">Quién entra...</option>
                        {squad.map((p) => (
                          <option key={p.id} value={p.name}>{p.name} ({p.position})</option>
                        ))}
                      </select>
                    </div>

                    {/* Reason (no cal posar el motiu) */}
                    <div className="w-full sm:w-32 shrink-0">
                      <span className="text-[10px] text-slate-400 font-bold block mb-0.5">Motivo (Opcional):</span>
                      <select
                        value={row.reason}
                        onChange={(e) => updateSubstitution(idx, 'reason', e.target.value)}
                        className="w-full bg-[#172336] border border-[#273852] rounded-lg px-2 py-1 text-xs text-slate-300"
                      >
                        <option value="">Sin motivo (Opcional)</option>
                        {SUB_REASON_OPTIONS.map((r, i) => (
                          <option key={i} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeSubstitutionRow(idx)}
                      className="text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors self-end sm:self-center"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Tarjetas del Partido */}
          <div className="bg-[#141d2c] border border-[#202d42] p-3.5 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
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
                className="text-[11px] font-bold text-amber-400 hover:text-amber-300 bg-[#1a2638] px-2.5 py-1 rounded-lg border border-[#273952] flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3 h-3 stroke-[2.5]" />
                <span>Añadir Tarjeta</span>
              </button>
            </div>

            {cards.length === 0 ? (
              <p className="text-[11px] text-slate-500 italic text-center py-2">Sin amonestaciones en el encuentro</p>
            ) : (
              <div className="space-y-2">
                {cards.map((row, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-[#101725] p-2.5 rounded-xl border border-[#1e2c40]">
                    {/* Card type */}
                    <select
                      value={row.type}
                      onChange={(e) => updateCard(idx, 'type', e.target.value)}
                      className={`w-full sm:w-36 rounded-lg px-2 py-1.5 text-xs font-bold shrink-0 border ${
                        row.type === 'yellow' ? 'bg-amber-950/40 text-amber-300 border-amber-500/40' :
                        row.type === 'red' ? 'bg-red-950/40 text-red-300 border-red-500/40' :
                        'bg-orange-950/40 text-orange-300 border-orange-500/40'
                      }`}
                    >
                      {CARD_TYPE_OPTIONS.map((ct) => (
                        <option key={ct.value} value={ct.value}>{ct.label}</option>
                      ))}
                    </select>

                    {/* Team selector */}
                    <select
                      value={row.team || 'us'}
                      onChange={(e) => updateCard(idx, 'team', e.target.value)}
                      className="w-full sm:w-28 bg-[#172336] border border-[#273852] rounded-lg px-2 py-1.5 text-xs font-bold text-white shrink-0"
                    >
                      <option value="us">🟢 {clubName}</option>
                      <option value="rival">⚪ {opponent}</option>
                    </select>

                    {/* Player */}
                    {row.team === 'rival' ? (
                      <input
                        type="text"
                        placeholder="Jugador rival amonestado..."
                        value={row.player}
                        onChange={(e) => updateCard(idx, 'player', e.target.value)}
                        className="flex-1 min-w-[130px] bg-[#172336] border border-[#273852] rounded-lg px-2 py-1.5 text-xs text-white"
                      />
                    ) : (
                      <select
                        value={row.player}
                        onChange={(e) => updateCard(idx, 'player', e.target.value)}
                        className="flex-1 min-w-[130px] bg-[#172336] border border-[#273852] rounded-lg px-2 py-1.5 text-xs text-white font-medium"
                      >
                        <option value="">Selecciona jugador...</option>
                        {squad.map((p) => (
                          <option key={p.id} value={p.name}>{p.name} ({p.position})</option>
                        ))}
                      </select>
                    )}

                    {/* Minute */}
                    <select
                      value={row.minute}
                      onChange={(e) => updateCard(idx, 'minute', e.target.value)}
                      className="w-full sm:w-24 bg-[#172336] border border-[#273852] rounded-lg px-2 py-1.5 text-xs text-amber-400 font-black shrink-0"
                    >
                      {MINUTE_OPTIONS.map((m, i) => (
                        <option key={i} value={m}>{m}</option>
                      ))}
                    </select>

                    {/* Reason */}
                    <select
                      value={row.reason}
                      onChange={(e) => updateCard(idx, 'reason', e.target.value)}
                      className="w-full sm:w-32 bg-[#172336] border border-[#273852] rounded-lg px-2 py-1.5 text-xs text-slate-300 shrink-0"
                    >
                      {CARD_REASON_OPTIONS.map((cr, i) => (
                        <option key={i} value={cr}>{cr}</option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => removeCardRow(idx)}
                      className="text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors self-end sm:self-center"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Row 5: MVP & Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">MVP / Mejor del Partido</label>
              <select
                value={mvp}
                onChange={(e) => setMvp(e.target.value)}
                className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-[#00ff87]"
              >
                <option value="">Selecciona MVP...</option>
                {squad.map((p) => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Tiros (Tú - Rival)</label>
              <input
                type="text"
                value={shots}
                onChange={(e) => setShots(e.target.value)}
                className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-[#00ff87]"
                placeholder="14 - 8"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Posesión (Tú - Rival)</label>
              <input
                type="text"
                value={possession}
                onChange={(e) => setPossession(e.target.value)}
                className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-[#00ff87]"
                placeholder="55% - 45%"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Notas del Partido / Crónica</label>
            <textarea
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#162234] border border-[#25364f] rounded-xl p-2.5 text-white focus:outline-none focus:border-[#00ff87]"
              placeholder="Sensaciones tácticas, cambios clave, goles destacados..."
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1c273a]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-300 hover:bg-[#162030] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#00ff87] hover:bg-[#00e676] text-[#090d14] font-bold shadow-lg shadow-[#00ff87]/20 transition-all cursor-pointer"
            >
              Guardar Partido
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
