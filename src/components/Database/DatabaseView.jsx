import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Download, 
  Upload, 
  RotateCcw, 
  HelpCircle, 
  Shield, 
  UserCheck, 
  TrendingUp, 
  DollarSign, 
  Sparkles, 
  Filter, 
  ArrowUpDown, 
  Check, 
  ChevronDown, 
  ChevronUp,
  FileCode,
  Users,
  X,
  Edit3
} from 'lucide-react';
import { 
  DATABASE_PLAYERS, 
  ALL_PRESET_CLUBS, 
  LALIGA_CLUBS,
  SEGUNDA_CLUBS,
  PREMIER_LEAGUE_CLUBS,
  SERIE_A_CLUBS,
  BUNDESLIGA_CLUBS,
  LIGUE1_CLUBS,
  MLS_CLUBS,
  SAUDI_CLUBS,
  EUROPEAN_GIANTS,
  getClubLogo,
  getActiveDatabase, 
  saveCustomDatabase, 
  resetDatabaseToDefault,
  convertRosterPlayerToSquad
} from '../../clubsData';

export default function DatabaseView({ activeCareer, onSignPlayer }) {
  const [dbVersion, setDbVersion] = useState(0); // For forcing re-render after DB upload
  const [activeTab, setActiveTab] = useState('players'); // 'players' | 'clubs'
  const [search, setSearch] = useState('');
  const [selectedLeague, setSelectedLeague] = useState('ALL');
  const [selectedPosCat, setSelectedPosCat] = useState('ALL'); // 'ALL' | 'POR' | 'DEF' | 'MED' | 'DEL'
  const [selectedClub, setSelectedClub] = useState('ALL');
  const [sortBy, setSortBy] = useState('ovr-desc');
  const [showHelp, setShowHelp] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [signingPlayer, setSigningPlayer] = useState(null);

  // Trigger brief alert/toast
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Export database.json to file
  const handleDownloadDatabase = () => {
    try {
      const activeDb = getActiveDatabase();
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activeDb, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `ea_fc_database_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast("¡database.json descargado correctamente!");
    } catch (err) {
      alert("Error al descargar la base de datos.");
    }
  };

  // Import / Upload custom database.json
  const handleUploadDatabase = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        if (json && Array.isArray(json.clubs) && json.clubs.length > 0) {
          saveCustomDatabase(json);
          setDbVersion(prev => prev + 1);
          showToast(`¡Base de datos cargada con éxito! (${json.clubs.length} clubes)`);
          setTimeout(() => {
            window.location.reload();
          }, 800);
        } else {
          alert("El archivo no tiene el formato esperado. Debe contener una propiedad 'clubs' con un array de clubes.");
        }
      } catch (err) {
        alert("Error al parsear el archivo JSON: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  // Reset to default database
  const handleResetDatabase = () => {
    if (window.confirm("¿Seguro que deseas restablecer la base de datos a los 52 clubes y 708 jugadores originales?")) {
      resetDatabaseToDefault();
      setDbVersion(prev => prev + 1);
      showToast("Base de datos restablecida a los valores originales.");
      setTimeout(() => {
        window.location.reload();
      }, 600);
    }
  };

  // Filter & Sort Players
  const filteredPlayers = useMemo(() => {
    let list = [...DATABASE_PLAYERS];

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.teamName.toLowerCase().includes(q) ||
        (p.nat && p.nat.toLowerCase().includes(q)) ||
        p.pos.toLowerCase().includes(q)
      );
    }

    if (selectedLeague !== 'ALL') {
      list = list.filter(p => p.leagueId === selectedLeague);
    }

    if (selectedClub !== 'ALL') {
      list = list.filter(p => p.teamId === selectedClub || p.teamName === selectedClub);
    }

    if (selectedPosCat !== 'ALL') {
      list = list.filter(p => {
        const pos = p.pos;
        if (selectedPosCat === 'POR') return pos === 'GK' || pos === 'POR';
        if (selectedPosCat === 'DEF') return ['CB', 'LB', 'RB', 'LWB', 'RWB', 'DFC', 'LI', 'LD'].includes(pos);
        if (selectedPosCat === 'MED') return ['CM', 'CDM', 'CAM', 'LM', 'RM', 'MC', 'MCD', 'MCO', 'MI', 'MD'].includes(pos);
        if (selectedPosCat === 'DEL') return ['ST', 'CF', 'LW', 'RW', 'DC', 'EI', 'ED'].includes(pos);
        return true;
      });
    }

    // Sort
    list.sort((a, b) => {
      if (sortBy === 'ovr-desc') return (b.ovr || 0) - (a.ovr || 0);
      if (sortBy === 'ovr-asc') return (a.ovr || 0) - (b.ovr || 0);
      if (sortBy === 'val-desc') return (b.val || 0) - (a.val || 0);
      if (sortBy === 'age-asc') return (a.age || 0) - (b.age || 0);
      if (sortBy === 'pac-desc') return (b.pac || 0) - (a.pac || 0);
      if (sortBy === 'sho-desc') return (b.sho || 0) - (a.sho || 0);
      return 0;
    });

    return list;
  }, [search, selectedLeague, selectedClub, selectedPosCat, sortBy, dbVersion]);

  // Filter Clubs
  const filteredClubs = useMemo(() => {
    let list = [...ALL_PRESET_CLUBS];
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(c => 
        c.name.toLowerCase().includes(q) ||
        (c.city && c.city.toLowerCase().includes(q)) ||
        (c.stadium && c.stadium.toLowerCase().includes(q))
      );
    }
    if (selectedLeague !== 'ALL') {
      list = list.filter(c => c.leagueId === selectedLeague);
    }
    return list;
  }, [search, selectedLeague, dbVersion]);

  return (
    <div className="space-y-6">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#00ff87] text-[#080d14] font-black px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-emerald-300 animate-bounce">
          <Check className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner / Actions Card */}
      <div className="bg-gradient-to-br from-[#101726] to-[#0c121e] border border-[#1f2c42] rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00ff87]/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#00ff87]/20 text-[#00ff87] font-black text-xs tracking-wider border border-[#00ff87]/30">
                DATABASE 2026 / 2027
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                {ALL_PRESET_CLUBS.length} Clubes • {DATABASE_PLAYERS.length} Jugadores Oficiales
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight">
              Base de Datos EA Sports FC
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Explora las medias reales, atributos FIFA, caras oficiales EA Pulse y escudos vectoriales de todos los equipos. Puedes fichar directamente a cualquier jugador para tu modo carrera o editar y subir tu propio archivo JSON.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleDownloadDatabase}
              className="flex items-center gap-2 bg-[#172336] hover:bg-[#1d2d45] text-white px-3.5 py-2.5 rounded-xl text-xs font-bold border border-[#273852] transition-all shadow-md hover:border-[#00ff87]/50"
              title="Descargar archivo database.json"
            >
              <Download className="w-4 h-4 text-[#00ff87]" />
              <span>Descargar JSON</span>
            </button>

            <label className="flex items-center gap-2 bg-[#00ff87] hover:bg-[#00e578] text-[#090d14] px-4 py-2.5 rounded-xl text-xs font-black transition-all shadow-lg shadow-[#00ff87]/20 cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>Subir / Cargar JSON</span>
              <input type="file" accept=".json" onChange={handleUploadDatabase} className="hidden" />
            </label>

            <button
              onClick={handleResetDatabase}
              className="flex items-center gap-1.5 bg-[#172336] hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 px-3 py-2.5 rounded-xl text-xs font-semibold border border-[#273852] transition-colors"
              title={`Restaurar a los ${ALL_PRESET_CLUBS.length} clubes y ${DATABASE_PLAYERS.length} jugadores originales`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar</span>
            </button>

            <button
              onClick={() => setShowHelp(!showHelp)}
              className="flex items-center gap-1.5 bg-[#172336] hover:bg-[#202e47] text-sky-400 px-3 py-2.5 rounded-xl text-xs font-semibold border border-[#273852] transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>¿Cómo editar?</span>
              {showHelp ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Collapsible Explainer / Documentation Box */}
        {showHelp && (
          <div className="mt-6 pt-6 border-t border-[#1f2c42] bg-[#0a0f18]/80 -mx-6 -mb-6 p-6 space-y-4">
            <div className="flex items-start gap-3">
              <FileCode className="w-5 h-5 text-[#00ff87] shrink-0 mt-0.5" />
              <div className="space-y-2 text-xs">
                <h4 className="font-extrabold text-white text-sm">
                  ¿Cómo funciona y dónde está guardada tu base de datos?
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  El archivo se encuentra en la carpeta del proyecto en:{' '}
                  <code className="bg-[#151f30] text-[#00ff87] px-2 py-0.5 rounded font-mono text-[11px]">
                    ea-fc-career-hub/src/data/database.json
                  </code>{' '}
                  y también servido en{' '}
                  <code className="bg-[#151f30] text-[#00ff87] px-2 py-0.5 rounded font-mono text-[11px]">
                    ea-fc-career-hub/public/database.json
                  </code>.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="bg-[#111824] p-3.5 rounded-xl border border-[#212e42]">
                    <span className="font-bold text-sky-400 block mb-1">Método 1: Desde la Web (Recomendado)</span>
                    <p className="text-slate-400 text-[11px]">
                      1. Pulsa en <strong>"Descargar JSON"</strong>.<br />
                      2. Edítalo en tu editor favorito (añade jugadores, cambia medias o crea clubes).<br />
                      3. Pulsa en <strong>"Subir / Cargar JSON"</strong> y se actualizará al instante en tu navegador.
                    </p>
                  </div>
                  <div className="bg-[#111824] p-3.5 rounded-xl border border-[#212e42]">
                    <span className="font-bold text-emerald-400 block mb-1">Método 2: Modificar el archivo local</span>
                    <p className="text-slate-400 text-[11px]">
                      Abre directamente <code>src/data/database.json</code> con VS Code o Bloc de notas. Cada club tiene su escudo vectorial SVG, estadio, presupuesto y su array de jugadores (<code>roster</code>) con medias OVR, fotos oficiales de EA y stats FIFA.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Tabs: Jugadores vs Clubes */}
      <div className="flex items-center justify-between gap-4 border-b border-[#1c273b] pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('players')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
              activeTab === 'players'
                ? 'bg-[#00ff87] text-[#080d14] shadow-md shadow-[#00ff87]/20'
                : 'bg-[#121a27] text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Jugadores ({filteredPlayers.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('clubs')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
              activeTab === 'clubs'
                ? 'bg-[#00ff87] text-[#080d14] shadow-md shadow-[#00ff87]/20'
                : 'bg-[#121a27] text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Clubes ({filteredClubs.length})</span>
          </button>
        </div>

        {/* Global Search Input */}
        <div className="relative w-full max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={activeTab === 'players' ? "Buscar jugador, equipo o país..." : "Buscar club o ciudad..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#121a27] border border-[#212f45] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00ff87]"
          />
        </div>
      </div>

      {/* Filters Bar (Only for Players tab) */}
      {activeTab === 'players' && (
        <div className="bg-[#111826] border border-[#1e2a3e] p-3.5 rounded-2xl space-y-3">
          
          {/* League Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'ALL', label: 'Todas las Ligas' },
              { id: 'laliga', label: '🇪🇸 LALIGA EA SPORTS' },
              { id: 'premier', label: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League' },
              { id: 'seriea', label: '🇮🇹 Serie A' },
              { id: 'bundesliga', label: '🇩🇪 Bundesliga' },
              { id: 'ligue1', label: '🇫🇷 Ligue 1' },
              { id: 'mls', label: '🇺🇸 MLS (EEUU)' },
              { id: 'saudi', label: '🇸🇦 Saudi Pro League' },
              { id: 'other', label: '🌍 Resto de Europa' },
              { id: 'segunda', label: '🥈 LALIGA HYPERMOTION' },
              { id: 'promesas', label: '🌟 Promesas & Filiales' }
            ].map(l => (
              <button
                key={l.id}
                onClick={() => { setSelectedLeague(l.id); setSelectedClub('ALL'); }}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all text-[11px] ${
                  selectedLeague === l.id
                    ? 'bg-[#00ff87] text-[#080d14] shadow'
                    : 'bg-[#172233] text-slate-400 hover:text-slate-200'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-[#1b2638]">
            
            {/* Position Category filter */}
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-slate-400 font-semibold mr-1">Posición:</span>
              {[
                { id: 'ALL', label: 'Todas' },
                { id: 'POR', label: 'POR' },
                { id: 'DEF', label: 'DEF' },
                { id: 'MED', label: 'MED' },
                { id: 'DEL', label: 'DEL' }
              ].map(pos => (
                <button
                  key={pos.id}
                  onClick={() => setSelectedPosCat(pos.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedPosCat === pos.id
                      ? 'bg-sky-500 text-white'
                      : 'bg-[#172233] text-slate-400 hover:text-white'
                  }`}
                >
                  {pos.label}
                </button>
              ))}
            </div>

            {/* Club Select & Sort dropdowns */}
            <div className="flex items-center gap-2">
              <select
                value={selectedClub}
                onChange={(e) => setSelectedClub(e.target.value)}
                className="bg-[#172233] border border-[#25354e] rounded-xl px-2.5 py-1 text-xs text-white font-medium focus:outline-none focus:border-[#00ff87]"
              >
                <option value="ALL">Todos los Clubes ({ALL_PRESET_CLUBS.length})</option>
                {ALL_PRESET_CLUBS
                  .filter(c => selectedLeague === 'ALL' || c.leagueId === selectedLeague)
                  .map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))
                }
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#172233] border border-[#25354e] rounded-xl px-2.5 py-1 text-xs text-white font-medium focus:outline-none focus:border-[#00ff87]"
              >
                <option value="ovr-desc">Mayor Media (OVR)</option>
                <option value="ovr-asc">Menor Media (OVR)</option>
                <option value="val-desc">Mayor Valor (€)</option>
                <option value="age-asc">Más Jóvenes (Edad)</option>
                <option value="pac-desc">Mayor Ritmo (PAC)</option>
                <option value="sho-desc">Mayor Disparo (SHO)</option>
              </select>
            </div>

          </div>
        </div>
      )}

      {/* PLAYERS GRID VIEW */}
      {activeTab === 'players' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {filteredPlayers.map((player) => {
            const squadObj = convertRosterPlayerToSquad(player);
            return (
              <div
                key={player.id}
                className="bg-[#111724] border border-[#1e2a3e] hover:border-[#00ff87]/50 rounded-2xl p-3.5 flex flex-col justify-between transition-all group hover:shadow-xl hover:shadow-[#00ff87]/5"
              >
                <div>
                  {/* Card Header: Rating, Position, Nation, Club Crest */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-black text-slate-950 text-sm shadow">
                        {player.ovr}
                      </div>
                      <div className="leading-none">
                        <span className="text-[11px] font-black text-[#00ff87] block uppercase tracking-wider">
                          {squadObj.position}
                        </span>
                        <span className="text-[11px]" title={player.nat}>
                          {squadObj.flag}
                        </span>
                      </div>
                    </div>

                    <div className="w-8 h-8 flex items-center justify-center shrink-0">
                      <img 
                        src={player.teamLogo} 
                        alt={player.teamName} 
                        className="max-w-full max-h-full object-contain filter drop-shadow"
                      />
                    </div>
                  </div>

                  {/* Cutout Photo & Player Identity */}
                  <div className="flex items-center gap-3 my-2">
                    <div className="w-14 h-14 rounded-full bg-[#172235] border border-[#273954] overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
                      <img
                        src={player.imageUrl || "https://images.fotmob.com/image_resources/playerimages/701154.png"}
                        alt={player.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-top filter contrast-105"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.fotmob.com/image_resources/playerimages/701154.png";
                        }}
                      />
                    </div>
                    <div className="truncate">
                      <h3 className="font-extrabold text-white text-xs truncate group-hover:text-[#00ff87] transition-colors">
                        {player.name}
                      </h3>
                      <p className="text-[10px] text-slate-400 truncate font-medium">
                        {player.teamName}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                        <span>{player.age} años</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-bold">{player.val}M €</span>
                      </div>
                    </div>
                  </div>

                  {/* FIFA Card 6 Attributes Bar */}
                  <div className="grid grid-cols-6 gap-1 bg-[#0b1018] p-1.5 rounded-xl border border-[#1b2638] text-center my-2.5">
                    <div>
                      <span className="block text-[8px] text-slate-500 font-bold">PAC</span>
                      <span className="font-extrabold text-slate-200 text-[10px]">{player.pac || 70}</span>
                    </div>
                    <div>
                      <span className="block text-[8px] text-slate-500 font-bold">SHO</span>
                      <span className="font-extrabold text-slate-200 text-[10px]">{player.sho || 65}</span>
                    </div>
                    <div>
                      <span className="block text-[8px] text-slate-500 font-bold">PAS</span>
                      <span className="font-extrabold text-slate-200 text-[10px]">{player.pas || 70}</span>
                    </div>
                    <div>
                      <span className="block text-[8px] text-slate-500 font-bold">DRI</span>
                      <span className="font-extrabold text-slate-200 text-[10px]">{player.dri || 72}</span>
                    </div>
                    <div>
                      <span className="block text-[8px] text-slate-500 font-bold">DEF</span>
                      <span className="font-extrabold text-slate-200 text-[10px]">{player.def || 60}</span>
                    </div>
                    <div>
                      <span className="block text-[8px] text-slate-500 font-bold">PHY</span>
                      <span className="font-extrabold text-slate-200 text-[10px]">{player.phy || 70}</span>
                    </div>
                  </div>
                </div>

                {/* Action: Sign for Active Career */}
                {activeCareer && onSignPlayer && (() => {
                  const isOwnPlayer = player.teamName?.toLowerCase() === activeCareer.manager.club?.toLowerCase();
                  return (
                    <button
                      disabled={isOwnPlayer}
                      onClick={() => {
                        if (isOwnPlayer) return;
                        setSigningPlayer(player);
                      }}
                      className={`w-full mt-1 py-1.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 border ${
                        isOwnPlayer
                          ? 'bg-[#121927] text-slate-500 border-[#1a2536] cursor-not-allowed opacity-60'
                          : 'bg-[#162338] hover:bg-[#00ff87] text-slate-200 hover:text-[#080d14] border-[#23354f] hover:border-[#00ff87]'
                      }`}
                    >
                      {isOwnPlayer ? (
                        <span>En tu plantilla ({activeCareer.manager.club})</span>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-[#00ff87] group-hover:text-[#080d14]" />
                          <span>Fichar para {activeCareer.manager.club}</span>
                        </>
                      )}
                    </button>
                  );
                })()}
              </div>
            );
          })}
        </div>
      )}

      {/* CLUBS GRID VIEW */}
      {activeTab === 'clubs' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredClubs.map((club) => (
            <div
              key={club.id}
              className="bg-[#111724] border border-[#1e2a3e] hover:border-[#00ff87]/40 rounded-2xl p-4 transition-all space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 flex items-center justify-center bg-[#172235] p-2 rounded-xl border border-[#273850] shrink-0">
                  <img src={club.badge || club.logo} alt={club.name} className="max-w-full max-h-full object-contain" />
                </div>
                <div className="truncate">
                  <h3 className="font-extrabold text-white text-sm truncate">{club.name}</h3>
                  <span className="text-[10px] text-slate-400 font-semibold">{club.league}</span>
                </div>
              </div>

              <div className="bg-[#0c111a] p-2.5 rounded-xl border border-[#1b2537] space-y-1 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Estadio:</span>
                  <span className="text-white font-medium truncate max-w-[150px]">{club.stadium || "Estadio Oficial"}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Presupuesto:</span>
                  <span className="text-[#00ff87] font-bold">{((club.budget || 30000000) / 1000000).toFixed(0)} M €</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Plantilla:</span>
                  <span className="text-sky-400 font-bold">{club.roster ? club.roster.length : 22} jugadores</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sign Confirmation Modal */}
      {signingPlayer && (
        <SignPlayerModal
          player={signingPlayer}
          activeCareer={activeCareer}
          onClose={() => setSigningPlayer(null)}
          onConfirm={(details) => {
            onSignPlayer(signingPlayer, details);
            showToast(`¡${signingPlayer.name} fichado procedente del ${details.originClub}! 🎉`);
            setSigningPlayer(null);
          }}
        />
      )}

    </div>
  );
}

function SignPlayerModal({ player, activeCareer, onClose, onConfirm }) {
  const [selectedClubFrom, setSelectedClubFrom] = useState(player.teamName || '');
  const [isCustomClub, setIsCustomClub] = useState(false);
  const [customClubName, setCustomClubName] = useState('');
  const [cost, setCost] = useState(player.val || Math.round((player.ovr || 75) * 0.4));
  const [wage, setWage] = useState(`${((player.wage || 35) * 1000).toLocaleString('es-ES')} €/sem`);

  const effectiveClubName = isCustomClub 
    ? (customClubName.trim() || 'Club Desconocido') 
    : (selectedClubFrom || player.teamName);
  const effectiveClubLogo = getClubLogo(effectiveClubName);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!effectiveClubName.trim()) {
      alert("Por favor introduce o selecciona el club de procedencia.");
      return;
    }
    onConfirm({
      originClub: effectiveClubName.trim(),
      originLogo: effectiveClubLogo,
      cost: Number(cost),
      wage: wage
    });
  };

  const squadObj = convertRosterPlayerToSquad(player);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-gradient-to-b from-[#131b28] via-[#0f1622] to-[#0a0f18] border border-[#23354d] rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative text-slate-100 my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-xl bg-[#172233] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-[#1c273a]">
          <div className="w-10 h-10 rounded-xl bg-[#00ff87]/20 text-[#00ff87] border border-[#00ff87]/40 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white font-display">
              Confirmar Fichaje Oficial
            </h2>
            <p className="text-xs text-slate-400">
              Incorporar a {activeCareer.manager.club}
            </p>
          </div>
        </div>

        {/* Player Banner Card */}
        <div className="bg-[#162234] border border-[#253750] rounded-2xl p-4 flex items-center justify-between gap-4 mb-5 shadow-inner">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-full bg-[#1b283d] border-2 border-[#00ff87] overflow-hidden flex items-center justify-center shrink-0 shadow">
              <img
                src={player.imageUrl || "https://images.fotmob.com/image_resources/playerimages/701154.png"}
                alt={player.name}
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.fotmob.com/image_resources/playerimages/701154.png";
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-amber-400 text-sm bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                  {player.ovr} OVR
                </span>
                <span className="text-xs font-black text-[#00ff87]">
                  {squadObj.position}
                </span>
                <span className="text-xs">{squadObj.flag}</span>
              </div>
              <h3 className="text-base font-extrabold text-white mt-1 leading-tight">
                {player.name}
              </h3>
              <p className="text-xs text-slate-400">
                {player.age} años · Valor: {player.val || Math.round((player.ovr || 75) * 0.4)}M €
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Club Base</span>
            <div className="flex items-center gap-1.5 mt-1 justify-end">
              <img src={player.teamLogo} alt="" className="w-6 h-6 object-contain" />
              <span className="text-xs font-bold text-slate-300 truncate max-w-[90px]">{player.teamName}</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Club de Procedencia */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-slate-200 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-[#00ff87]" />
                <span>Club de Procedencia</span>
                <span className="text-[10px] text-[#00ff87] font-semibold bg-[#033b24] px-1.5 py-0.5 rounded border border-[#00ff87]/30">
                  Modificable
                </span>
              </label>

              <button
                type="button"
                onClick={() => setIsCustomClub(!isCustomClub)}
                className="text-xs text-[#00ff87] hover:underline flex items-center gap-1 font-bold"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isCustomClub ? 'Elegir de lista' : 'Escribir otro club'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#162234] border border-[#283b54] p-1.5 flex items-center justify-center shrink-0">
                <img
                  src={effectiveClubLogo}
                  alt={effectiveClubName}
                  className="max-w-full max-h-full object-contain filter drop-shadow"
                  onError={(e) => { e.target.src = "https://crests.football-data.org/95.svg"; }}
                />
              </div>

              {isCustomClub ? (
                <input
                  type="text"
                  autoFocus
                  value={customClubName}
                  onChange={(e) => setCustomClubName(e.target.value)}
                  placeholder="Ej: Borussia Dortmund, Porto, Ajax..."
                  className="flex-1 bg-[#162234] border border-[#283b54] rounded-xl px-3.5 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-[#00ff87]"
                />
              ) : (
                <select
                  value={selectedClubFrom}
                  onChange={(e) => setSelectedClubFrom(e.target.value)}
                  className="flex-1 bg-[#162234] border border-[#283b54] rounded-xl px-3.5 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-[#00ff87]"
                >
                  {!ALL_PRESET_CLUBS.some(c => c.name === selectedClubFrom) && (
                    <option value={selectedClubFrom}>⭐ {selectedClubFrom}</option>
                  )}
                  <optgroup label="🇪🇸 LALIGA EA SPORTS">
                    {LALIGA_CLUBS.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="🥈 LALIGA HYPERMOTION">
                    {SEGUNDA_CLUBS.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="🏴󠁧󠁢󠁥󠁮󠁧󠁿 PREMIER LEAGUE">
                    {PREMIER_LEAGUE_CLUBS.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="🇮🇹 SERIE A">
                    {SERIE_A_CLUBS.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="🇩🇪 BUNDESLIGA">
                    {BUNDESLIGA_CLUBS.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="🇺🇸 MLS (EE.UU.)">
                    {MLS_CLUBS.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="🇸🇦 SAUDI PRO LEAGUE">
                    {SAUDI_CLUBS.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="🌍 RESTO DE EUROPA / MUNDO">
                    {EUROPEAN_GIANTS.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </optgroup>
                </select>
              )}
            </div>

            <p className="text-[11px] text-slate-400 bg-[#0d1420] p-2.5 rounded-xl border border-[#1b2638] leading-relaxed">
              💡 <strong>¿Ha cambiado de club en tu partida?</strong> Si con el paso de las temporadas el jugador fue traspasado a otro equipo en tu Modo Carrera, cámbialo aquí para que su comunicado oficial de despedida y los registros sean 100% reales.
            </p>
          </div>

          {/* Coste y Salario */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                Coste de Traspaso (M €)
              </label>
              <input
                type="number"
                min="0"
                max="500"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="w-full bg-[#162234] border border-[#283b54] rounded-xl px-3 py-2 text-white font-bold text-sm focus:outline-none focus:border-[#00ff87]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                Salario Acordado
              </label>
              <input
                type="text"
                value={wage}
                onChange={(e) => setWage(e.target.value)}
                className="w-full bg-[#162234] border border-[#283b54] rounded-xl px-3 py-2 text-white font-medium text-sm focus:outline-none focus:border-[#00ff87]"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-[#283b54] text-slate-300 font-bold text-xs hover:bg-[#162234] transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#00ff87] to-[#00dfa2] text-[#080d14] font-black text-xs hover:brightness-110 shadow-lg shadow-[#00ff87]/20 transition-all flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Confirmar Fichaje</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
