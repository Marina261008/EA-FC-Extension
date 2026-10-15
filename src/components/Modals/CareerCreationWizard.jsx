import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Trophy, 
  Shield, 
  User, 
  Upload, 
  DollarSign, 
  ChevronRight, 
  ChevronLeft,
  Camera,
  Coins,
  Check,
  Search,
  Globe
} from 'lucide-react';
import { 
  ALL_PRESET_CLUBS,
  LALIGA_CLUBS, 
  SEGUNDA_CLUBS,
  PREMIER_LEAGUE_CLUBS, 
  SERIE_A_CLUBS,
  BUNDESLIGA_CLUBS,
  LIGUE1_CLUBS,
  PORTUGAL_CLUBS,
  EREDIVISIE_CLUBS,
  CHAMPIONSHIP_CLUBS,
  SUPERLIG_CLUBS,
  ARGENTINA_CLUBS,
  BRASILEIRAO_CLUBS,
  SCOTLAND_CLUBS,
  BELGIUM_CLUBS,
  MLS_CLUBS,
  SAUDI_CLUBS,
  EUROPEAN_GIANTS, 
  MANAGER_PRESETS, 
  getClubLogo,
  getClubRoster,
  getLeagueLogo
} from '../../clubsData';
import { NATIONALITY_OPTIONS } from '../../data/dropdownPresets';
import { createManagerPost } from '../../postGenerator';
import { formatNumberWithDots, parseFormattedNumber } from '../../utils/formatters';

const TAB_TO_CLUBS = {
  laliga: LALIGA_CLUBS,
  segunda: SEGUNDA_CLUBS,
  premier: PREMIER_LEAGUE_CLUBS,
  seriea: SERIE_A_CLUBS,
  bundesliga: BUNDESLIGA_CLUBS,
  ligue1: LIGUE1_CLUBS,
  argentina: ARGENTINA_CLUBS,
  brasileirao: BRASILEIRAO_CLUBS,
  portugal: PORTUGAL_CLUBS,
  eredivisie: EREDIVISIE_CLUBS,
  championship: CHAMPIONSHIP_CLUBS,
  scotland: SCOTLAND_CLUBS,
  belgium: BELGIUM_CLUBS,
  superlig: SUPERLIG_CLUBS,
  mls: MLS_CLUBS,
  saudi: SAUDI_CLUBS
};

const WIZARD_LEAGUE_TABS = [
  { id: 'laliga', label: 'LALIGA', icon: '🇪🇸', clubs: LALIGA_CLUBS, leagueKey: 'laliga' },
  { id: 'segunda', label: 'HYPERMOTION', icon: '🥈', clubs: SEGUNDA_CLUBS, leagueKey: 'segunda' },
  { id: 'premier', label: 'Premier League', icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', clubs: PREMIER_LEAGUE_CLUBS, leagueKey: 'premier' },
  { id: 'seriea', label: 'Serie A', icon: '🇮🇹', clubs: SERIE_A_CLUBS, leagueKey: 'seriea' },
  { id: 'bundesliga', label: 'Bundesliga', icon: '🇩🇪', clubs: BUNDESLIGA_CLUBS, leagueKey: 'bundesliga' },
  { id: 'ligue1', label: 'Ligue 1', icon: '🇫🇷', clubs: LIGUE1_CLUBS, leagueKey: 'ligue1' },
  { id: 'argentina', label: 'Liga Argentina', icon: '🇦🇷', clubs: ARGENTINA_CLUBS, leagueKey: 'argentina' },
  { id: 'brasileirao', label: 'Brasileirão', icon: '🇧🇷', clubs: BRASILEIRAO_CLUBS, leagueKey: 'brasileirao' },
  { id: 'portugal', label: 'Liga Portugal', icon: '🇵🇹', clubs: PORTUGAL_CLUBS, leagueKey: 'portugal' },
  { id: 'eredivisie', label: 'Eredivisie', icon: '🇳🇱', clubs: EREDIVISIE_CLUBS, leagueKey: 'eredivisie' },
  { id: 'championship', label: 'Championship', icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', clubs: CHAMPIONSHIP_CLUBS, leagueKey: 'championship' },
  { id: 'scotland', label: 'Premiership', icon: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', clubs: SCOTLAND_CLUBS, leagueKey: 'scotland' },
  { id: 'belgium', label: 'Pro League', icon: '🇧🇪', clubs: BELGIUM_CLUBS, leagueKey: 'belgium' },
  { id: 'superlig', label: 'Süper Lig', icon: '🇹🇷', clubs: SUPERLIG_CLUBS, leagueKey: 'superlig' },
  { id: 'mls', label: 'MLS', icon: '🇺🇸', clubs: MLS_CLUBS, leagueKey: 'mls' },
  { id: 'saudi', label: 'Saudi Pro', icon: '🇸🇦', clubs: SAUDI_CLUBS, leagueKey: 'saudi' },
  { id: 'custom', label: 'Crear Mi Club', icon: '🛠️', isCustom: true }
];

export default function CareerCreationWizard({ isOpen, onClose, onSaveCareer }) {
  if (!isOpen) return null;

  const [step, setStep] = useState(1);

  // Defaults
  const gameVersion = 'EA FC26';
  const careerType = 'manager';

  // Step 2: Manager
  const [managerName, setManagerName] = useState('Mi Entrenador');
  const [nationality, setNationality] = useState('🇪🇸 España');
  const [age, setAge] = useState(38);
  const [avatar, setAvatar] = useState(MANAGER_PRESETS[0].avatar);

  // Step 3: Club
  const [activeLeagueTab, setActiveLeagueTab] = useState('all'); // 'all' | 'laliga' | 'premier' | ... | 'custom'
  const [showAllWizardLeagues, setShowAllWizardLeagues] = useState(false);
  const [clubSearch, setClubSearch] = useState('');
  const [selectedClub, setSelectedClub] = useState(LALIGA_CLUBS[0]);
  const [customClubName, setCustomClubName] = useState('Real Deportivo');
  const [customLeague, setCustomLeague] = useState('LALIGA EA SPORTS');
  const [customStadium, setCustomStadium] = useState('Estadio Municipal');
  const [customLogo, setCustomLogo] = useState('https://crests.football-data.org/95.svg');

  // Step 4: Budget & Settings
  const [budget, setBudget] = useState(selectedClub.budget || 40000000);
  const [currency, setCurrency] = useState('€');
  const [strictBudget, setStrictBudget] = useState(true);

  // Image upload handler (converts file to Base64)
  const handleAvatarFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatar(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCustomLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomLogo(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectClub = (club) => {
    setSelectedClub(club);
    setBudget(club.budget || 40000000);
  };

  const handleSubmitCareer = () => {
    const isCustom = activeLeagueTab === 'custom';
    const clubName = isCustom ? customClubName : selectedClub.name;
    const clubLogo = isCustom ? customLogo : selectedClub.logo;
    const league = isCustom ? customLeague : selectedClub.league;

    const period = gameVersion === 'EA FC26' ? '2025/26' : '2026/27';
    const startDate = gameVersion === 'EA FC26' ? '01 jul 2025' : '01 jul 2026';

    // Build initial standings based on chosen league
    const leagueClubs = isCustom
      ? [
          { name: customClubName, logo: customLogo, ovr: 75 },
          ...LALIGA_CLUBS.slice(0, 19)
        ]
      : (
          (activeLeagueTab !== 'all' ? TAB_TO_CLUBS[activeLeagueTab] : null) ||
          TAB_TO_CLUBS[selectedClub?.leagueId] ||
          Object.entries(TAB_TO_CLUBS).find(([k]) => league?.toLowerCase().includes(k))?.[1] ||
          LALIGA_CLUBS
        );

    const standings = leagueClubs.map((c, idx) => ({
      pos: idx + 1,
      team: c.name,
      logo: c.logo || c.badge,
      pj: 0,
      v: 0,
      e: 0,
      d: 0,
      gf: 0,
      gc: 0,
      dg: 0,
      pts: 0,
      zone: idx < 4 ? 'champions' : idx === 4 ? 'europa' : idx === 5 ? 'conference' : idx >= 17 ? 'relegation' : 'none',
      isUser: c.name.toLowerCase() === clubName.toLowerCase()
    }));

    // If club not in list (custom club), place it in standings
    if (!standings.some(t => t.isUser)) {
      standings[0] = {
        pos: 1,
        team: clubName,
        logo: clubLogo,
        pj: 0, v: 0, e: 0, d: 0, gf: 0, gc: 0, dg: 0, pts: 0,
        zone: 'champions',
        isUser: true
      };
    }

    // Load authentic EA FC roster for selected club
    const clubRoster = !isCustom ? getClubRoster(selectedClub.id || selectedClub.name) : [];
    const initialSquad = clubRoster && clubRoster.length > 0 ? clubRoster : [
      {
        id: `sq-init-gk`,
        name: "Portero Titular",
        position: "POR",
        category: "POR",
        number: 1,
        age: 25,
        country: "España",
        flag: "🇪🇸",
        rating: 79,
        potential: 83,
        photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        value: "14 M €",
        wage: "35.000 €/sem",
        contract: "2029",
        matches: 0, goals: 0, assists: 0, cleanSheets: 0,
        status: "Titular", morale: "Excelente"
      },
      {
        id: `sq-init-df`,
        name: "Líder Defensivo",
        position: "DFC",
        category: "DEF",
        number: 4,
        age: 26,
        country: "España",
        flag: "🇪🇸",
        rating: 81,
        potential: 84,
        photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        value: "22 M €",
        wage: "45.000 €/sem",
        contract: "2028",
        matches: 0, goals: 0, assists: 0, cleanSheets: 0,
        status: "Titular", morale: "Excelente"
      },
      {
        id: `sq-init-mc`,
        name: "Capitán del Equipo",
        position: "MC",
        category: "MED",
        number: 8,
        age: 27,
        country: "España",
        flag: "🇪🇸",
        rating: 82,
        potential: 83,
        photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
        value: "28 M €",
        wage: "50.000 €/sem",
        contract: "2029",
        matches: 0, goals: 0, assists: 0, cleanSheets: 0,
        status: "Titular (Capitán)", morale: "Excelente"
      },
      {
        id: `sq-init-dc`,
        name: "Goleador Estrella",
        position: "DC",
        category: "DEL",
        number: 9,
        age: 24,
        country: "España",
        flag: "🇪🇸",
        rating: 80,
        potential: 86,
        photo: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80",
        value: "24 M €",
        wage: "40.000 €/sem",
        contract: "2029",
        matches: 0, goals: 0, assists: 0, cleanSheets: 0,
        status: "Titular", morale: "En racha"
      }
    ];

    const newManager = {
      name: managerName,
      avatar,
      nationality,
      age: Number(age),
      club: clubName,
      clubLogo,
      league,
      startDate,
      currentDate: startDate,
      wage: "55.000 €/sem",
      reputation: "4.5 / 5.0",
      bio: `Inicio del proyecto deportivo con el ${clubName} en ${gameVersion}. Gran ilusión por construir un equipo competitivo y alcanzar la gloria continental.`
    };

    const firstPost = createManagerPost(newManager, startDate);

    const newCareer = {
      id: `career-${Date.now()}`,
      gameVersion,
      manager: newManager,
      seasons: [
        {
          id: `season-1-${Date.now()}`,
          name: "Temporada 1",
          period,
          status: "En curso",
          budget: {
            transfer: Number(budget),
            wageWeekly: Math.round(Number(budget) * 0.012),
            initialTransfer: Number(budget)
          },
          stats: {
            position: "—",
            points: 0,
            wins: 0,
            draws: 0,
            losses: 0,
            goalsFor: 0,
            goalsAgainst: 0
          },
          transfersIn: [],
          transfersOut: [],
          objectives: [
            {
              id: `obj-w-1`,
              title: "Clasificación Europea",
              description: `Terminar entre los primeros puestos en ${league}.`,
              category: "Éxito nacional",
              priority: "Crítica",
              deadline: "Final de temporada",
              completed: false
            },
            {
              id: `obj-w-2`,
              title: "Desarrollo de Cantera",
              description: "Fichar y dar minutos a jóvenes promesas del club.",
              category: "Fuerzas básicas",
              priority: "Media",
              deadline: "Final de temporada",
              completed: false
            }
          ],
          rules: strictBudget ? [
            {
              id: "rule-w-1",
              text: "Realismo financiero: no gastar más del 80% de lo ingresado en ventas.",
              strict: true
            },
            {
              id: "rule-w-2",
              text: "Sin reintentar partidos: asumir todos los resultados con deportividad.",
              strict: true
            }
          ] : [],
          squad: initialSquad,
          matches: [],
          standings,
          youthAcademy: [],
          moments: [
            {
              id: `mom-init-${Date.now()}`,
              title: `Presentación Oficial en ${clubName}`,
              date: startDate,
              type: "Institucional",
              badge: "Nueva Era",
              description: `${managerName} firma su contrato y se compromete a liderar al ${clubName} hacia lo más alto.`,
              mediaUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80"
            }
          ]
        }
      ],
      posts: [firstPost]
    };

    onSaveCareer(newCareer);
    onClose();
  };

  const currentClubs = activeLeagueTab === 'all'
    ? ALL_PRESET_CLUBS
    : (TAB_TO_CLUBS[activeLeagueTab] || ALL_PRESET_CLUBS);

  const displayClubs = currentClubs.filter(club => {
    if (!clubSearch.trim()) return true;
    const q = clubSearch.toLowerCase().trim();
    return club.name.toLowerCase().includes(q) || (club.league && club.league.toLowerCase().includes(q));
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#0f1522] border border-[#23334d] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 my-6 max-h-[92vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-xl bg-[#162030] border border-[#24334b] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Wizard Header */}
        <div className="flex items-center gap-3 pb-5 border-b border-[#1b273b] shrink-0">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#00ff87] to-cyan-400 text-[#090d14] flex items-center justify-center font-black shadow-lg shadow-[#00ff87]/20">
            <Trophy className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-display">
              Crear Tu Modo Carrera
            </h2>
            <p className="text-xs text-slate-400">
              Paso {step} de 3 · {
                step === 1 ? 'Tu Entrenador y Perfil' :
                step === 2 ? 'Selecciona tu Club y Escudo' :
                'Presupuesto y Reto de Carrera'
              }
            </p>
          </div>
        </div>

        {/* Stepper Progress Bar */}
        <div className="grid grid-cols-3 gap-2 my-4 shrink-0">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all ${
                s <= step ? 'bg-[#00ff87] shadow-sm shadow-[#00ff87]/50' : 'bg-[#182335]'
              }`}
            ></div>
          ))}
        </div>

        {/* STEP CONTENT (Scrollable) */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-5 text-xs py-2">
          
          {/* STEP 1: MANAGER */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-bold mb-1">Nombre del Entrenador</label>
                  <input
                    type="text"
                    required
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    className="w-full bg-[#151f30] border border-[#25354e] rounded-xl px-3.5 py-2.5 text-white font-medium focus:outline-none focus:border-[#00ff87]"
                    placeholder="Tu Nombre o Entrenador Favorito"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Edad</label>
                  <input
                    type="number"
                    min="25"
                    max="75"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full bg-[#151f30] border border-[#25354e] rounded-xl px-3 py-2.5 text-white font-medium focus:outline-none focus:border-[#00ff87]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Nacionalidad</label>
                <select
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  className="w-full bg-[#151f30] border border-[#25354e] rounded-xl px-3.5 py-2 text-white font-medium focus:outline-none focus:border-[#00ff87]"
                >
                  {!NATIONALITY_OPTIONS.some(n => n.label === nationality) && (
                    <option value={nationality}>{nationality}</option>
                  )}
                  {NATIONALITY_OPTIONS.map((n, idx) => (
                    <option key={idx} value={n.label}>{n.label}</option>
                  ))}
                </select>
              </div>

              {/* Photo Selector */}
              <div>
                <label className="block text-slate-300 font-bold mb-2">Foto / Cara del Entrenador</label>
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#00ff87] shadow-lg bg-[#182335] shrink-0">
                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover object-top" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <label className="flex items-center gap-2 bg-[#172336] hover:bg-[#202e47] text-white px-3 py-2 rounded-xl border border-[#25354e] cursor-pointer text-xs font-semibold w-fit transition-colors">
                      <Upload className="w-4 h-4 text-[#00ff87]" />
                      <span>Subir foto desde tu equipo</span>
                      <input type="file" accept="image/*" onChange={handleAvatarFileUpload} className="hidden" />
                    </label>
                    <p className="text-[10px] text-slate-500">Sube cualquier foto o elige una de las caras de abajo</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {MANAGER_PRESETS.map((m, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setAvatar(m.avatar);
                        if (managerName === 'Mi Entrenador' || MANAGER_PRESETS.some(p => p.name === managerName)) {
                          setManagerName(m.name);
                          setNationality(m.nationality);
                          setAge(m.age);
                        }
                      }}
                      className={`relative rounded-xl overflow-hidden border-2 p-0.5 transition-all aspect-square ${
                        avatar === m.avatar ? 'border-[#00ff87] scale-105 shadow-md shadow-[#00ff87]/30' : 'border-transparent hover:border-slate-500'
                      }`}
                      title={m.name}
                    >
                      <img src={m.avatar} alt={m.name} className="w-full h-full object-cover rounded-lg" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: CLUB SELECTION & CREST */}
          {step === 2 && (
            <div className="space-y-4">
              {/* League Tabs - Larger & Visual Buttons with Official Logos */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#1f2b40] scrollbar-thin scrollbar-thumb-[#24354e]">
                {/* Todas las Ligas */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveLeagueTab('all');
                    setShowAllWizardLeagues(false);
                  }}
                  className={`group flex items-center gap-2 px-3.5 py-2 rounded-2xl font-bold transition-all text-xs shrink-0 border select-none ${
                    activeLeagueTab === 'all'
                      ? 'bg-gradient-to-r from-[#00ff87]/20 to-transparent border-[#00ff87] text-white shadow-lg shadow-[#00ff87]/15 ring-1 ring-[#00ff87]/50 scale-[1.02]'
                      : 'bg-[#141e2e] border-[#22334b] text-slate-300 hover:text-white hover:border-slate-500 hover:bg-[#19253a] hover:scale-[1.01]'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border transition-all ${
                    activeLeagueTab === 'all' ? 'bg-[#00ff87] text-[#080d14] border-[#00ff87]' : 'bg-[#0e1624] border-[#24354c] text-slate-300'
                  }`}>
                    <Globe className="w-3.5 h-3.5" />
                  </div>
                  <span className="whitespace-nowrap font-black">Todas las Ligas</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-0.5 ${
                    activeLeagueTab === 'all' ? 'bg-[#00ff87] text-[#080d14]' : 'bg-[#1e2a3c] text-slate-400'
                  }`}>
                    {ALL_PRESET_CLUBS.length}
                  </span>
                </button>

                {/* Filtered League Buttons: if a league is selected, ONLY that league shows (unless expanded) */}
                {WIZARD_LEAGUE_TABS
                  .filter((item) => activeLeagueTab === 'all' || showAllWizardLeagues || item.id === activeLeagueTab)
                  .map((item) => {
                    const isSelected = activeLeagueTab === item.id;
                    const logo = item.isCustom ? null : getLeagueLogo(item.leagueKey);

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setActiveLeagueTab(item.id);
                          setShowAllWizardLeagues(false);
                        }}
                        className={`group flex items-center gap-2 px-3.5 py-2 rounded-2xl font-bold transition-all text-xs shrink-0 border select-none ${
                          isSelected
                            ? 'bg-gradient-to-r from-[#00ff87]/20 to-transparent border-[#00ff87] text-white shadow-lg shadow-[#00ff87]/15 ring-1 ring-[#00ff87]/50 scale-[1.02]'
                            : 'bg-[#141e2e] border-[#22334b] text-slate-300 hover:text-white hover:border-slate-500 hover:bg-[#19253a] hover:scale-[1.01]'
                        }`}
                      >
                        {logo ? (
                          <div className={`w-6 h-6 rounded-lg p-0.5 flex items-center justify-center shrink-0 border transition-all ${
                            isSelected ? 'bg-[#0a1019] border-[#00ff87]/50 shadow' : 'bg-[#0e1624] border-[#24354c]'
                          }`}>
                            <img
                              src={logo}
                              alt=""
                              referrerPolicy="no-referrer"
                              className="max-w-full max-h-full object-contain filter drop-shadow"
                              onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                          </div>
                        ) : (
                          <span className="text-sm">{item.icon}</span>
                        )}

                        <span className="whitespace-nowrap font-black">
                          {item.label}
                        </span>

                        {item.clubs && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-0.5 ${
                            isSelected ? 'bg-[#00ff87] text-[#080d14]' : 'bg-[#1e2a3c] text-slate-400'
                          }`}>
                            {item.clubs.length}
                          </span>
                        )}
                      </button>
                    );
                  })}

                {/* Expand / collapse button when a league is selected */}
                {activeLeagueTab !== 'all' && (
                  <button
                    type="button"
                    onClick={() => setShowAllWizardLeagues(!showAllWizardLeagues)}
                    className="px-2.5 py-1.5 rounded-xl bg-[#172233] hover:bg-[#202f45] border border-[#26374f] text-slate-300 hover:text-white text-xs font-bold transition-all shrink-0 flex items-center gap-1"
                  >
                    <span>{showAllWizardLeagues ? 'Ocultar ligas ▴' : 'Cambiar liga ▾'}</span>
                  </button>
                )}
              </div>

              {activeLeagueTab === 'custom' ? (
                /* Custom Club Creator */
                <div className="bg-[#141d2c] p-4 rounded-2xl border border-[#23334d] space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#1b2639] border-2 border-[#00ff87] p-2 flex items-center justify-center shrink-0 shadow-lg">
                      <img src={customLogo} alt="" className="max-w-full max-h-full object-contain" />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 bg-[#1a2538] hover:bg-[#202e47] text-white px-3 py-1.5 rounded-xl border border-[#293c59] cursor-pointer text-xs font-semibold w-fit transition-colors">
                        <Upload className="w-3.5 h-3.5 text-[#00ff87]" />
                        <span>Subir escudo propio</span>
                        <input type="file" accept="image/*" onChange={handleCustomLogoUpload} className="hidden" />
                      </label>
                      <p className="text-[10px] text-slate-500 mt-1">Sube el logo de tu club (PNG, SVG o JPG)</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Nombre del Club</label>
                      <input
                        type="text"
                        value={customClubName}
                        onChange={(e) => setCustomClubName(e.target.value)}
                        className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-[#00ff87]"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Liga en la que compite</label>
                      <input
                        type="text"
                        value={customLeague}
                        onChange={(e) => setCustomLeague(e.target.value)}
                        className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-[#00ff87]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Estadio Oficial</label>
                    <input
                      type="text"
                      value={customStadium}
                      onChange={(e) => setCustomStadium(e.target.value)}
                      className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-[#00ff87]"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {/* Search and counter */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="relative flex-1">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Buscar club por nombre o liga..."
                        value={clubSearch}
                        onChange={(e) => setClubSearch(e.target.value)}
                        className="w-full bg-[#141d2c] border border-[#22334b] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00ff87]"
                      />
                    </div>
                    <span className="text-[11px] text-slate-400 font-semibold shrink-0">
                      {displayClubs.length} {displayClubs.length === 1 ? 'club' : 'clubes'}
                    </span>
                  </div>

                  {/* Club Picker Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-[#23354f]">
                    {displayClubs.map((club) => {
                      const isSelected = selectedClub.name === club.name;
                      return (
                        <div
                          key={club.id || club.name}
                          onClick={() => handleSelectClub(club)}
                          className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                            isSelected
                              ? 'bg-[#00ff87]/15 border-[#00ff87] shadow-lg shadow-[#00ff87]/15 ring-1 ring-[#00ff87]/50'
                              : 'bg-[#131b29] border-[#202e44] hover:bg-[#182335]'
                          }`}
                        >
                          <div className="w-8 h-8 flex items-center justify-center shrink-0">
                            <img src={club.logo} alt="" className="max-w-full max-h-full object-contain" />
                          </div>
                          <div className="truncate">
                            <h4 className="font-extrabold text-white text-xs truncate leading-tight">{club.name}</h4>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[10px] text-slate-400 font-medium">
                                {(club.budget / 1000000).toFixed(0)}M €
                              </span>
                              {activeLeagueTab === 'all' && club.league && (
                                <span className="text-[9px] text-[#00ff87]/70 truncate max-w-[80px]">
                                  • {club.shortName || club.league}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: BUDGET & REALISM RULES */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-[#141d2c] p-4 rounded-2xl border border-[#23334d] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">Resumen de tu Nuevo Club</span>
                  <span className="text-xs font-bold text-[#00ff87] bg-[#033b24] px-2 py-0.5 rounded">
                    Modo Carrera
                  </span>
                </div>

                <div className="flex items-center gap-3 pt-1 pb-2 border-b border-[#202d42]">
                  <img
                    src={activeLeagueTab === 'custom' ? customLogo : selectedClub.logo}
                    alt=""
                    className="w-10 h-10 object-contain"
                  />
                  <div>
                    <h3 className="font-black text-white text-base">
                      {activeLeagueTab === 'custom' ? customClubName : selectedClub.name}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Entrenador: <span className="text-white font-bold">{managerName}</span> ({nationality})
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Presupuesto Inicial de Fichajes (€)</label>
                  <input
                    type="text"
                    value={formatNumberWithDots(budget)}
                    onChange={(e) => setBudget(parseFormattedNumber(e.target.value))}
                    placeholder="Ej. 40.000.000"
                    className="w-full bg-[#1b2639] border border-[#2a3c5a] rounded-xl px-3 py-2 text-xl font-black text-[#00ff87] focus:outline-none focus:border-[#00ff87]"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    <span className="font-bold text-[#00ff87]">{(parseFormattedNumber(budget) / 1000000).toLocaleString('es-ES', { maximumFractionDigits: 1 })} Millones de Euros</span> ({formatNumberWithDots(budget)} €) disponibles para altas
                  </p>
                </div>

                <div className="pt-2 border-t border-[#202d42]">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={strictBudget}
                      onChange={(e) => setStrictBudget(e.target.checked)}
                      className="w-4 h-4 rounded text-[#00ff87] bg-[#1a2538] border-[#293c59] focus:ring-0"
                    />
                    <span className="font-bold text-slate-200 text-xs">
                      Activar Reglas de Realismo de Modo Carrera
                    </span>
                  </label>
                  <p className="text-[11px] text-slate-400 ml-6 mt-0.5">
                    Genera automáticamente restricciones financieras y retos de cantera para una experiencia ultra auténtica.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Wizard Footer Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-[#1b273b] shrink-0">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#162030] hover:bg-[#1e2c42] text-slate-300 font-bold text-xs transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Atrás</span>
            </button>
          ) : (
            <div></div>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#00ff87] hover:bg-[#00e676] text-[#090d14] font-black text-xs shadow-lg shadow-[#00ff87]/20 transition-all hover:scale-105"
            >
              <span>Siguiente</span>
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmitCareer}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00ff87] to-cyan-400 hover:opacity-90 text-[#090d14] font-black text-xs shadow-xl shadow-[#00ff87]/30 transition-all hover:scale-105"
            >
              <Sparkles className="w-4 h-4 stroke-[2.5]" />
              <span>¡Comenzar Mi Carrera!</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
