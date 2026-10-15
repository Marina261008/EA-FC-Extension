import React, { useState, useEffect } from 'react';
import { 
  X, 
  Send, 
  Camera, 
  Sparkles, 
  Image as ImageIcon, 
  Upload, 
  Check, 
  Wand2, 
  Users, 
  Shield, 
  Trophy, 
  Zap, 
  LayoutGrid, 
  List, 
  Calendar,
  Award
} from 'lucide-react';
import { 
  PRESET_CATEGORIES, 
  PRESET_POST_IMAGES, 
  QUICK_ANNOUNCEMENT_TEMPLATES,
  FORMATION_COORDINATES
} from '../../data/presetImages';
import { 
  COMPETITION_OPTIONS, 
  MATCHDAY_OPTIONS, 
  POST_TAG_OPTIONS, 
  POST_TITLE_OPTIONS 
} from '../../data/dropdownPresets';
import { 
  ALL_PRESET_CLUBS, 
  LALIGA_CLUBS, 
  SEGUNDA_CLUBS, 
  PREMIER_LEAGUE_CLUBS, 
  SERIE_A_CLUBS, 
  BUNDESLIGA_CLUBS,
  ARGENTINA_CLUBS, 
  getClubLogo, 
  getClubTheme,
  getOpponentsForContext
} from '../../clubsData';
import StartingXIGraphic from './StartingXIGraphic';
import JerseyBackGraphic from './JerseyBackGraphic';
import { 
  formatCurrencyInput, 
  formatToFullEuros, 
  parsePlayerValueInEuros 
} from '../../utils/formatters';
import { createRenewalPost } from '../../postGenerator';

export default function NewPostModal({ 
  isOpen, 
  onClose, 
  onSavePost, 
  clubName = 'Mi Club', 
  clubLogo = '',
  managerName = 'Entrenador',
  league = 'LALIGA EA SPORTS',
  squad = [],
  initialMode = 'lineup'
}) {
  if (!isOpen) return null;

  // Active top-level mode: 'standard' (Comunicado normal) vs 'lineup' (11 Inicial Oficial) vs 'renewal' (Renovación de Jugador)
  const [modalMode, setModalMode] = useState(initialMode || 'lineup');

  useEffect(() => {
    if (isOpen && initialMode) {
      setModalMode(initialMode);
    }
  }, [isOpen, initialMode]);

  // --- STANDARD COMUNICADO STATE ---
  const [text, setText] = useState(`¡Nueva actualización de la plantilla! ⚽\n\nTrabajando al máximo nivel para el próximo compromiso de ${league}.`);
  const [date, setDate] = useState('12 oct 2026');
  const [tag, setTag] = useState('Comunicado Oficial');
  const [title, setTitle] = useState(`¡Fuerza, ${clubName}!`);
  const [subtitle, setSubtitle] = useState(`${league} · Modo Carrera`);
  const [imageUrl, setImageUrl] = useState(PRESET_POST_IMAGES[0].url);
  const [activeCategory, setActiveCategory] = useState('all');
  const [lineupCategory, setLineupCategory] = useState('all');

  // Dynamically resolve rivals based on active competition, club and league
  const [competition, setCompetition] = useState(league || 'LALIGA EA SPORTS');
  const rivalsData = getOpponentsForContext(competition, league, clubName);
  const initialRival = rivalsData.primaryClubs[0]?.name || rivalsData.allAvailable[0]?.name || 'Real Madrid';

  // --- STARTING 11 (LINEUP) STATE ---
  const [lineupBgImage, setLineupBgImage] = useState(
    PRESET_POST_IMAGES.find(img => img.category === 'matchday')?.url || PRESET_POST_IMAGES[0].url
  );
  const [formation, setFormation] = useState('4-3-3');
  const [selectedRival, setSelectedRival] = useState(initialRival);
  const [matchday, setMatchday] = useState('Jornada Oficial');
  const [stadium, setStadium] = useState('');

  // --- PLAYER RENEWAL (RENOVACIÓN CON CAMISETA DE ESPALDA) STATE ---
  const defaultRenewalPlayer = squad && squad.length > 0 
    ? [...squad].sort((a, b) => (b.rating || 75) - (a.rating || 75))[0] 
    : null;

  const [renewalPlayerId, setRenewalPlayerId] = useState(defaultRenewalPlayer?.id || '');
  const [renewalPlayerName, setRenewalPlayerName] = useState(defaultRenewalPlayer?.name || 'Vinícius Jr.');
  const [renewalPlayerNumber, setRenewalPlayerNumber] = useState(defaultRenewalPlayer?.number || 7);
  const [renewalNumberMode, setRenewalNumberMode] = useState('dorsal'); // 'dorsal' vs 'year'
  const [renewalYear, setRenewalYear] = useState('2030');
  const [renewalClause, setRenewalClause] = useState(
    defaultRenewalPlayer?.clause 
      ? formatToFullEuros(defaultRenewalPlayer.clause) 
      : '150.000.000 €'
  );
  const [renewalPosition, setRenewalPosition] = useState(defaultRenewalPlayer?.position || 'DEL');
  const [renewalRating, setRenewalRating] = useState(defaultRenewalPlayer?.rating || 89);
  const [renewalPhoto, setRenewalPhoto] = useState(
    defaultRenewalPlayer?.photo || defaultRenewalPlayer?.imageUrl || './default_player.svg'
  );
  const [renewalBgImage, setRenewalBgImage] = useState(
    PRESET_POST_IMAGES.find(img => img.category === 'renovaciones')?.url || 
    'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=1000&auto=format&fit=crop&q=80'
  );
  const [renewalCategory, setRenewalCategory] = useState('renovaciones');
  const [renewalText, setRenewalText] = useState(
    `✍️👕 ¡OFICIAL | ${(defaultRenewalPlayer?.name || 'NUESTRA ESTRELLA').toUpperCase()} RENUEVA HASTA 2030! 🤝💛\n\nEl ${clubName} y el futbolista han alcanzado un acuerdo oficial para la ampliación y blindaje de su contrato.\n\nUna pieza clave en el esquema del míster ${managerName} seguirá defendiendo nuestro escudo y haciendo vibrar a la afición. ¡Enhorabuena, crack!`
  );

  const handleRenewalPlayerSelect = (pId) => {
    const p = squad.find(player => player.id === pId);
    if (!p) return;
    setRenewalPlayerId(p.id);
    setRenewalPlayerName(p.name);
    setRenewalPlayerNumber(p.number || 10);
    setRenewalPosition(p.position || 'DEL');
    setRenewalRating(p.rating || 80);
    setRenewalPhoto(p.photo || p.imageUrl || './default_player.svg');
    if (p.clause) {
      setRenewalClause(formatToFullEuros(p.clause));
    } else if (p.value) {
      const valEuros = parsePlayerValueInEuros(p.value);
      setRenewalClause(formatToFullEuros(Math.round(valEuros * 1.6)));
    }
    setRenewalText(
      `✍️👕 ¡OFICIAL | ${p.name.toUpperCase()} RENUEVA HASTA ${renewalYear}! 🤝💛\n\nEl ${clubName} y el futbolista han alcanzado un acuerdo oficial para la ampliación y blindaje de su contrato.\n\nUna pieza clave en el esquema del míster ${managerName} seguirá defendiendo nuestro escudo y haciendo vibrar a la afición. ¡Enhorabuena, crack!`
    );
  };

  const handleCompetitionChange = (newComp) => {
    setCompetition(newComp);
    const newRivalsData = getOpponentsForContext(newComp, league, clubName);
    const isCurrentValid = newRivalsData.primaryClubs.some(c => c.name === selectedRival);
    if (!isCurrentValid && newRivalsData.primaryClubs.length > 0) {
      setSelectedRival(newRivalsData.primaryClubs[0].name);
    }
  };

  // 11 starting players state
  const [starting11, setStarting11] = useState([]);
  const [bench, setBench] = useState([]);

  // Auto-fill starting 11 based on current squad
  const autoFillStartingXI = (formName = formation) => {
    if (!squad || squad.length === 0) {
      // Mock players if squad is empty
      const mockEleven = Array.from({ length: 11 }, (_, i) => ({
        id: `mock-${i}`,
        name: `Titular ${i + 1}`,
        number: i === 0 ? 1 : i + 1,
        position: i === 0 ? 'POR' : i < 5 ? 'DFC' : i < 9 ? 'MC' : 'DC',
        photo: './default_player.svg',
        rating: 80 - i
      }));
      setStarting11(mockEleven);
      return;
    }

    // Sort squad: Goalkeepers, Defenders, Midfielders, Attackers
    const gks = squad.filter(p => p.position === 'POR' || p.category === 'POR').sort((a, b) => (b.rating || 75) - (a.rating || 75));
    const defs = squad.filter(p => ['DFC', 'LI', 'LD', 'CAD', 'CAI'].includes(p.position) || p.category === 'DEF').sort((a, b) => (b.rating || 75) - (a.rating || 75));
    const mids = squad.filter(p => ['MC', 'MCD', 'MCO', 'MI', 'MD'].includes(p.position) || p.category === 'MED').sort((a, b) => (b.rating || 75) - (a.rating || 75));
    const fwds = squad.filter(p => ['DC', 'ED', 'EI', 'SD'].includes(p.position) || p.category === 'DEL').sort((a, b) => (b.rating || 75) - (a.rating || 75));

    const coords = FORMATION_COORDINATES[formName] || FORMATION_COORDINATES['4-3-3'];
    const chosen = [];
    const usedIds = new Set();

    coords.forEach((c) => {
      let pool = mids;
      if (c.slot === 'POR') pool = gks;
      else if (['LI', 'LD', 'DFC', 'CAD', 'CAI'].includes(c.slot)) pool = defs;
      else if (['DC', 'ED', 'EI', 'SD'].includes(c.slot)) pool = fwds;

      // Find first unused player in target category
      let found = pool.find(p => !usedIds.has(p.id));
      if (!found) {
        // Fallback to any remaining squad player
        found = squad.find(p => !usedIds.has(p.id));
      }

      if (found) {
        usedIds.add(found.id);
        chosen.push({
          id: found.id,
          name: found.name,
          number: found.number || (chosen.length + 1),
          position: c.slot,
          photo: found.photo || found.imageUrl,
          rating: found.rating
        });
      } else {
        chosen.push({
          id: `slot-${chosen.length}`,
          name: `Jugador ${chosen.length + 1}`,
          number: chosen.length + 1,
          position: c.slot,
          photo: './default_player.svg',
          rating: 75
        });
      }
    });

    setStarting11(chosen);

    // Bench: next 7 highest rated unused players
    const benchPool = squad.filter(p => !usedIds.has(p.id)).slice(0, 7);
    setBench(benchPool.map((b, idx) => ({
      name: b.name,
      number: b.number || (12 + idx),
      position: b.position
    })));
  };

  // Initial autofill on open
  useEffect(() => {
    autoFillStartingXI(formation);
  }, [isOpen]);

  // Handle changing a specific slot's player
  const handleSlotPlayerChange = (slotIndex, newPlayerId) => {
    const targetPlayer = squad.find(p => p.id === newPlayerId);
    if (!targetPlayer) return;

    const updated = [...starting11];
    updated[slotIndex] = {
      ...updated[slotIndex],
      id: targetPlayer.id,
      name: targetPlayer.name,
      number: targetPlayer.number || (slotIndex + 1),
      photo: targetPlayer.photo || targetPlayer.imageUrl,
      rating: targetPlayer.rating
    };
    setStarting11(updated);
  };

  // Filter preset images by category for standard mode
  const filteredStandardImages = activeCategory === 'all'
    ? PRESET_POST_IMAGES
    : PRESET_POST_IMAGES.filter(img => img.category === activeCategory);

  // Filter preset images by category for lineup mode
  const filteredLineupImages = lineupCategory === 'all'
    ? PRESET_POST_IMAGES
    : PRESET_POST_IMAGES.filter(img => img.category === lineupCategory);

  // Filter preset images by category for renewal mode
  const filteredRenewalImages = renewalCategory === 'all'
    ? PRESET_POST_IMAGES
    : PRESET_POST_IMAGES.filter(img => img.category === renewalCategory);

  // Apply quick template
  const handleApplyTemplate = (tmpl) => {
    setText(tmpl.text);
    setTag(tmpl.tag);
    setTitle(tmpl.title);
    setSubtitle(tmpl.subtitle);
    const targetImage = PRESET_POST_IMAGES.find(img => img.id === tmpl.imageId) || PRESET_POST_IMAGES[0];
    setImageUrl(targetImage.url);
  };

  // Upload local file from PC
  const handleImageUpload = (e, targetMode = 'standard') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          if (targetMode === 'lineup' || targetMode === true) {
            setLineupBgImage(uploadEvent.target.result);
          } else if (targetMode === 'renewal') {
            setRenewalBgImage(uploadEvent.target.result);
          } else {
            setImageUrl(uploadEvent.target.result);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();

    if (modalMode === 'renewal') {
      const displayJerseyNumber = renewalNumberMode === 'year' ? renewalYear : renewalPlayerNumber;
      const renewalPost = createRenewalPost(
        {
          id: renewalPlayerId,
          name: renewalPlayerName,
          number: displayJerseyNumber,
          position: renewalPosition,
          rating: renewalRating,
          photo: renewalPhoto,
          clause: renewalClause
        },
        clubName,
        clubLogo,
        renewalYear,
        renewalClause,
        managerName,
        date,
        { bgImage: renewalBgImage }
      );

      if (renewalText) {
        renewalPost.text = renewalText;
      }

      onSavePost(renewalPost);
      onClose();
      return;
    }

    if (modalMode === 'lineup') {
      const rivalLogo = getClubLogo(selectedRival);
      const postText = `📋 ¡ONCE TITULAR CONFIRMADO! ⚔️⚽\n\nNuestra alineación oficial para medirnos al ${selectedRival} en ${competition}.\n\n¡Todos juntos a por la victoria! #11Inicial #${clubName.replace(/[^a-zA-Z0-9]/g, '')}`;

      const lineupPost = {
        id: `post-lineup-${Date.now()}`,
        type: 'lineup',
        author: {
          name: clubName,
          handle: `@${clubName.replace(/[^a-zA-Z0-9]/g, '')}`,
          verified: true,
          avatar: clubLogo
        },
        date,
        text: postText,
        hashtags: [`#${clubName.replace(/[^a-zA-Z0-9]/g, '')}`, '#11Inicial', '#Matchday'],
        graphic: {
          isLineup: true,
          tag: '11 Inicial Oficial',
          title: `Alineación Oficial vs ${selectedRival}`,
          subtitle: `${competition} · ${formation}`,
          clubName,
          clubLogo,
          managerName,
          lineupData: {
            bgImage: lineupBgImage,
            formation,
            starting11,
            bench,
            rivalName: selectedRival,
            rivalLogo,
            competition,
            matchday,
            stadium
          }
        },
        likes: 1840,
        commentsCount: 34,
        reactions: ['🔥', '👏', '❤️']
      };

      onSavePost(lineupPost);
      onClose();
      return;
    }

    // Standard comunicado post
    const standardPost = {
      id: `post-custom-${Date.now()}`,
      type: 'custom',
      author: {
        name: clubName,
        handle: `@${clubName.replace(/[^a-zA-Z0-9]/g, '')}`,
        verified: true,
        avatar: clubLogo
      },
      date,
      text,
      hashtags: [`#${clubName.replace(/[^a-zA-Z0-9]/g, '')}`, '#ComunicadoOficial'],
      graphic: {
        tag,
        title,
        subtitle,
        image: imageUrl
      },
      likes: 120,
      commentsCount: 8,
      reactions: ['❤️', '🔥']
    };

    onSavePost(standardPost);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#101724] border border-[#22314a] rounded-2xl max-w-4xl w-full p-5 sm:p-6 shadow-2xl relative animate-in fade-in zoom-in-95 my-6 max-h-[94vh] flex flex-col">
        
        {/* Header */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-[#162030] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#1c273a] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00ff87] to-cyan-400 text-[#090d14] flex items-center justify-center font-bold">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white font-display">Publicar en el Muro Oficial</h2>
              <p className="text-xs text-slate-400">Diseña comunicados, renueva estrellas con su camiseta o publica el 11 inicial</p>
            </div>
          </div>

          {/* MODE TOGGLE TABS */}
          <div className="flex items-center bg-[#0a0f18] p-1 rounded-xl border border-[#213047] shrink-0 self-start sm:self-auto flex-wrap gap-1">
            <button
              type="button"
              onClick={() => setModalMode('lineup')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 ${
                modalMode === 'lineup'
                  ? 'bg-[#00ff87] text-[#080d14] shadow-md shadow-[#00ff87]/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>📋 11 Inicial</span>
            </button>
            <button
              type="button"
              onClick={() => setModalMode('renewal')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 ${
                modalMode === 'renewal'
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-300 text-black shadow-md shadow-amber-400/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>✍️👕 Renovación</span>
            </button>
            <button
              type="button"
              onClick={() => setModalMode('standard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 ${
                modalMode === 'standard'
                  ? 'bg-[#00ff87] text-[#080d14] shadow-md shadow-[#00ff87]/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>📢 Comunicado</span>
            </button>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs overflow-y-auto flex-1 pr-1">
          
          {/* ============================================================== */}
          {/* MODE 1: 11 INICIAL (STARTING XI GRAPHIC) */}
          {/* ============================================================== */}
          {modalMode === 'lineup' && (
            <div className="space-y-4">
              
              {/* Row 1: Formation + Rival + Competition + Matchday */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-[#0d1421] p-3.5 rounded-2xl border border-[#1f2d42]">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Formación Táctica</label>
                  <select
                    value={formation}
                    onChange={(e) => {
                      setFormation(e.target.value);
                      autoFillStartingXI(e.target.value);
                    }}
                    className="w-full bg-[#152132] border border-[#263750] rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-[#00ff87]"
                  >
                    <option value="4-3-3">4-3-3 Ofensivo</option>
                    <option value="4-2-3-1">4-2-3-1 Clásico</option>
                    <option value="4-4-2">4-4-2 Equilibrado</option>
                    <option value="3-5-2">3-5-2 Carrileros</option>
                    <option value="5-3-2">5-3-2 Contragolpe</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Rival del Partido ({rivalsData.primaryClubs.length} disponibles)</label>
                  <select
                    value={selectedRival}
                    onChange={(e) => setSelectedRival(e.target.value)}
                    className="w-full bg-[#152132] border border-[#263750] rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-[#00ff87]"
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
                  <label className="block text-slate-300 font-bold mb-1">Competición</label>
                  <select
                    value={competition}
                    onChange={(e) => handleCompetitionChange(e.target.value)}
                    className="w-full bg-[#152132] border border-[#263750] rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-[#00ff87]"
                  >
                    {COMPETITION_OPTIONS.map((c, i) => (
                      <option key={i} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Jornada / Ronda</label>
                  <select
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#152132] border border-[#263750] rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-[#00ff87]"
                  >
                    {MATCHDAY_OPTIONS.map((m, i) => (
                      <option key={i} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Preset Background Image Selector for 11 Inicial */}
              <div className="bg-[#0b1019] border border-[#1d293d] rounded-2xl p-3.5 space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="text-slate-200 font-bold flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-[#00ff87]" />
                      <span>Fondo Predeterminado para el Cartel del 11 Inicial</span>
                    </label>
                    <p className="text-[10px] text-slate-400">
                      El 11 inicial se dibujará automáticamente <strong>encima de la imagen que elijas</strong>
                    </p>
                  </div>

                  <label className="flex items-center gap-1.5 bg-[#172336] hover:bg-[#202e47] text-slate-200 hover:text-white px-3 py-1.5 rounded-xl border border-[#263750] cursor-pointer text-[11px] font-semibold transition-colors shrink-0">
                    <Upload className="w-3.5 h-3.5 text-[#00ff87]" />
                    <span>Subir fondo propio</span>
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, true)} className="hidden" />
                  </label>
                </div>

                {/* Category chips for Lineup Backgrounds */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                  {PRESET_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setLineupCategory(cat.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors flex items-center gap-1 ${
                        lineupCategory === cat.id
                          ? 'bg-[#00ff87] text-[#080d14]'
                          : 'bg-[#151f30] text-slate-300 hover:bg-[#1c2940]'
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>

                {/* Grid of Background options for Lineup */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#24354e]">
                  {filteredLineupImages.map((img) => {
                    const isSelected = lineupBgImage === img.url;
                    return (
                      <div
                        key={img.id}
                        onClick={() => setLineupBgImage(img.url)}
                        className={`group relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all aspect-video bg-[#131b29] ${
                          isSelected
                            ? 'border-[#00ff87] shadow-lg shadow-[#00ff87]/30 scale-[1.02]'
                            : 'border-[#1f2c42] hover:border-slate-400 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={img.url}
                          alt={img.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex items-end p-1">
                          <p className="text-[9px] font-bold text-white truncate">{img.title}</p>
                        </div>
                        {isSelected && (
                          <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#00ff87] text-black flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Row 3: Slot Player Selection / Quick Autofill */}
              <div className="bg-[#0e1624] border border-[#213149] rounded-2xl p-3.5 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#00ff87]" />
                    <span className="font-bold text-white text-xs">Alineación Slot por Slot</span>
                    <span className="text-[10px] text-slate-400">({squad.length} jugadores en plantilla)</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => autoFillStartingXI(formation)}
                    className="flex items-center gap-1.5 bg-[#00ff87]/15 hover:bg-[#00ff87]/25 text-[#00ff87] border border-[#00ff87]/40 px-3 py-1.5 rounded-xl font-bold text-[11px] transition-colors active:scale-95"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Auto-completar Once de Gala</span>
                  </button>
                </div>

                {/* 11 Slots grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 max-h-48 overflow-y-auto pr-1">
                  {starting11.map((slotPlayer, slotIdx) => (
                    <div key={slotIdx} className="bg-[#141f2f] p-2 rounded-xl border border-[#22334b]">
                      <span className="text-[10px] font-black text-[#00ff87] uppercase block mb-1">
                        Pos #{slotIdx + 1} · {slotPlayer.position}
                      </span>
                      <select
                        value={slotPlayer.id}
                        onChange={(e) => handleSlotPlayerChange(slotIdx, e.target.value)}
                        className="w-full bg-[#1b283d] border border-[#293d5c] rounded-lg px-2 py-1 text-white text-[11px] font-medium focus:outline-none focus:border-[#00ff87]"
                      >
                        {squad.map((sp) => (
                          <option key={sp.id} value={sp.id}>
                            #{sp.number || '?'} {sp.name} ({sp.position} {sp.rating}★)
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 4: LIVE PREVIEW OF STARTING XI GRAPHIC */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-slate-300 font-bold flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#00ff87]" />
                    <span>Vista Previa en Vivo del Cartel Oficial del 11 Inicial</span>
                  </label>
                  <span className="text-[10px] text-slate-400">Este cartel se publicará directamente en el feed</span>
                </div>

                <StartingXIGraphic
                  clubName={clubName}
                  clubLogo={clubLogo}
                  managerName={managerName}
                  lineupData={{
                    bgImage: lineupBgImage,
                    formation,
                    starting11,
                    bench,
                    rivalName: selectedRival,
                    rivalLogo: getClubLogo(selectedRival),
                    competition,
                    matchday,
                    stadium
                  }}
                />
              </div>

            </div>
          )}

          {/* ============================================================== */}
          {/* MODE 2: RENOVACIÓN DE JUGADOR (CON CAMISETA DE ESPALDA) */}
          {/* ============================================================== */}
          {modalMode === 'renewal' && (
            <div className="space-y-4">
              
              {/* Row 1: Player selector from squad + Name + Number + Mode toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-[#0d1421] p-3.5 rounded-2xl border border-[#1f2d42]">
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-bold mb-1">
                    Seleccionar Jugador de la Plantilla ({squad.length} disponibles)
                  </label>
                  <select
                    value={renewalPlayerId}
                    onChange={(e) => handleRenewalPlayerSelect(e.target.value)}
                    className="w-full bg-[#152132] border border-[#263750] rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-amber-400"
                  >
                    {squad.map((p) => (
                      <option key={p.id} value={p.id}>
                        #{p.number || '?'} {p.name} ({p.position} · {p.rating} OVR)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Nombre en Camiseta</label>
                  <input
                    type="text"
                    value={renewalPlayerName}
                    onChange={(e) => setRenewalPlayerName(e.target.value)}
                    placeholder="Ej. VINÍCIUS JR."
                    className="w-full bg-[#152132] border border-[#263750] rounded-xl px-3 py-2 text-white font-bold uppercase focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Año de Renovación</label>
                  <select
                    value={renewalYear}
                    onChange={(e) => {
                      setRenewalYear(e.target.value);
                      setRenewalText(prev => prev.replace(/20\d\d/g, e.target.value));
                    }}
                    className="w-full bg-[#152132] border border-[#263750] rounded-xl px-3 py-2 text-amber-300 font-bold focus:outline-none focus:border-amber-400"
                  >
                    <option value="2028">Hasta 2028</option>
                    <option value="2029">Hasta 2029</option>
                    <option value="2030">Hasta 2030</option>
                    <option value="2031">Hasta 2031</option>
                    <option value="2032">Hasta 2032</option>
                    <option value="2033">Hasta 2033</option>
                    <option value="2034">Hasta 2034</option>
                    <option value="2035">Hasta 2035</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Dorsal vs Year on Jersey Back + Cláusula + Posición & Media */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-[#0d1421] p-3.5 rounded-2xl border border-[#1f2d42]">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Imprimir en Espalda</label>
                  <div className="flex bg-[#152132] p-1 rounded-xl border border-[#263750]">
                    <button
                      type="button"
                      onClick={() => setRenewalNumberMode('dorsal')}
                      className={`flex-1 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                        renewalNumberMode === 'dorsal'
                          ? 'bg-amber-400 text-black shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Dorsal (#{renewalPlayerNumber})
                    </button>
                    <button
                      type="button"
                      onClick={() => setRenewalNumberMode('year')}
                      className={`flex-1 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                        renewalNumberMode === 'year'
                          ? 'bg-amber-400 text-black shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Año ({renewalYear})
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Dorsal del Jugador</label>
                  <input
                    type="number"
                    value={renewalPlayerNumber}
                    onChange={(e) => setRenewalPlayerNumber(e.target.value)}
                    className="w-full bg-[#152132] border border-[#263750] rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Cláusula de Rescisión</label>
                  <input
                    type="text"
                    value={renewalClause}
                    onChange={(e) => setRenewalClause(formatCurrencyInput(e.target.value, { suffix: ' €' }))}
                    placeholder="Ej. 150.000.000 €"
                    className="w-full bg-[#152132] border border-[#263750] rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Fecha de Publicación</label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#152132] border border-[#263750] rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Row 3: Post announcement text */}
              <div className="bg-[#0b1019] border border-[#1d293d] rounded-2xl p-3.5 space-y-2">
                <label className="block text-slate-300 font-bold mb-1">Texto del Comunicado Oficial de Renovación</label>
                <textarea
                  rows="3"
                  value={renewalText}
                  onChange={(e) => setRenewalText(e.target.value)}
                  className="w-full bg-[#162234] border border-[#25364f] rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400 text-xs"
                  placeholder="Escribe el texto de la publicación..."
                />
              </div>

              {/* Row 4: Background Image Picker for Renewal */}
              <div className="bg-[#0b1019] border border-[#1d293d] rounded-2xl p-3.5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="text-slate-200 font-bold flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-amber-400" />
                      <span>Fondo de Sala de Prensa, Vestuario o Estadio</span>
                    </label>
                    <p className="text-[10px] text-slate-400">
                      La camiseta oficial de {clubName} con el nombre y número se montará en primer plano sobre este fondo
                    </p>
                  </div>

                  <label className="flex items-center gap-1.5 bg-[#172336] hover:bg-[#202e47] text-slate-200 hover:text-white px-3 py-1.5 rounded-xl border border-[#263750] cursor-pointer text-[11px] font-semibold transition-colors shrink-0">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>Subir desde mi PC</span>
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'renewal')} className="hidden" />
                  </label>
                </div>

                {/* Category Filter Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                  {PRESET_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setRenewalCategory(cat.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors flex items-center gap-1 ${
                        renewalCategory === cat.id
                          ? 'bg-amber-400 text-black'
                          : 'bg-[#151f30] text-slate-300 hover:bg-[#1c2940]'
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>

                {/* Preset Images Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto pr-1">
                  {filteredRenewalImages.map((img) => {
                    const isSelected = renewalBgImage === img.url;
                    return (
                      <div
                        key={img.id}
                        onClick={() => setRenewalBgImage(img.url)}
                        className={`group relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all aspect-video bg-[#131b29] ${
                          isSelected
                            ? 'border-amber-400 shadow-lg shadow-amber-400/25 scale-[1.02]'
                            : 'border-[#1f2c42] hover:border-slate-400 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={img.url}
                          alt={img.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-1.5">
                          <p className="text-[10px] font-bold text-white truncate">{img.title}</p>
                        </div>
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-amber-400 text-black flex items-center justify-center shadow">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Row 5: LIVE PREVIEW OF JERSEY BACK GRAPHIC */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-amber-300 font-bold flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Vista Previa en Vivo: Camiseta Oficial de Espalda con Nombre y Número</span>
                  </label>
                  <span className="text-[10px] text-slate-400">Cartel exclusivo con los colores auténticos de {clubName}</span>
                </div>

                <JerseyBackGraphic
                  playerName={renewalPlayerName}
                  playerNumber={renewalNumberMode === 'year' ? renewalYear : renewalPlayerNumber}
                  clubName={clubName}
                  clubLogo={clubLogo}
                  renewalYear={renewalYear}
                  clause={renewalClause}
                  playerPhoto={renewalPhoto}
                  playerPosition={renewalPosition}
                  playerRating={renewalRating}
                  bgImage={renewalBgImage}
                  date={date}
                />
              </div>

            </div>
          )}

          {/* ============================================================== */}
          {/* MODE 3: COMUNICADO ESTÁNDAR (NORMAL ANNOUNCEMENT) */}
          {/* ============================================================== */}
          {modalMode === 'standard' && (
            <div className="space-y-4">
              
              {/* Quick Templates Bar */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-slate-300 font-bold flex items-center gap-1.5">
                    <Wand2 className="w-3.5 h-3.5 text-[#00ff87]" />
                    <span>Plantillas Rápidas de Publicación</span>
                  </label>
                  <span className="text-[10px] text-slate-500">Pulsa una para autocompletar</span>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
                  {QUICK_ANNOUNCEMENT_TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => handleApplyTemplate(tmpl)}
                      className="bg-[#152132] hover:bg-[#1f3049] text-slate-200 hover:text-[#00ff87] border border-[#253852] hover:border-[#00ff87]/50 px-3 py-1.5 rounded-xl whitespace-nowrap text-[11px] font-semibold transition-all shrink-0 active:scale-95"
                    >
                      {tmpl.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text and Date */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-slate-400 font-semibold mb-1">Texto del Mensaje</label>
                  <textarea
                    rows="3"
                    required
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full bg-[#162234] border border-[#25364f] rounded-xl p-2.5 text-white focus:outline-none focus:border-[#00ff87]"
                    placeholder="Escribe el cuerpo del comunicado..."
                  ></textarea>
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Fecha</label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white"
                  />
                  <p className="text-[10px] text-slate-500 mt-1.5">Fecha que aparecerá en el feed social</p>
                </div>
              </div>

              {/* Card Tag and Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Etiqueta Superior (Pill)</label>
                  <select
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-[#00ff87]"
                  >
                    {POST_TAG_OPTIONS.map((t, idx) => (
                      <option key={idx} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Título del Cartel</label>
                  <select
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-[#00ff87]"
                  >
                    {POST_TITLE_OPTIONS.map((t, idx) => (
                      <option key={idx} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Preset Images Gallery */}
              <div className="bg-[#0b1019] border border-[#1d293d] rounded-2xl p-3.5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-slate-200 font-bold flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#00ff87]" />
                    <span>Imágenes Predeterminadas para el Cartel</span>
                  </label>

                  <label className="flex items-center gap-1.5 bg-[#172336] hover:bg-[#202e47] text-slate-200 hover:text-white px-3 py-1.5 rounded-xl border border-[#263750] cursor-pointer text-[11px] font-semibold transition-colors shrink-0">
                    <Upload className="w-3.5 h-3.5 text-[#00ff87]" />
                    <span>Subir desde mi PC</span>
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, false)} className="hidden" />
                  </label>
                </div>

                {/* Category Filter Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                  {PRESET_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActiveCategory(cat.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors flex items-center gap-1 ${
                        activeCategory === cat.id
                          ? 'bg-[#00ff87] text-[#080d14]'
                          : 'bg-[#151f30] text-slate-300 hover:bg-[#1c2940]'
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>

                {/* Preset Images Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto pr-1">
                  {filteredStandardImages.map((img) => {
                    const isSelected = imageUrl === img.url;
                    return (
                      <div
                        key={img.id}
                        onClick={() => {
                          setImageUrl(img.url);
                          if (img.tag) setTag(img.tag);
                        }}
                        className={`group relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all aspect-video bg-[#131b29] ${
                          isSelected
                            ? 'border-[#00ff87] shadow-lg shadow-[#00ff87]/25 scale-[1.02]'
                            : 'border-[#1f2c42] hover:border-slate-400 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={img.url}
                          alt={img.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-1.5">
                          <p className="text-[10px] font-bold text-white truncate">{img.title}</p>
                        </div>
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#00ff87] text-black flex items-center justify-center shadow">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Custom URL Input fallback */}
                <div className="pt-1">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="O pega una URL de imagen personalizada..."
                    className="w-full bg-[#131b29] border border-[#233148] rounded-xl px-3 py-1.5 text-slate-300 text-[11px] focus:outline-none focus:border-[#00ff87]"
                  />
                </div>
              </div>

              {/* Standard Live Preview Card */}
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Vista Previa del Cartel Oficial</label>
                <div className="relative rounded-2xl overflow-hidden border border-[#24354f] bg-[#0c121d] aspect-[16/8] max-h-40 flex items-end p-4 shadow-xl">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                  
                  <div className="relative z-10 w-full flex items-end justify-between">
                    <div>
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#00ff87] text-[#090d14] mb-1">
                        {tag || 'COMUNICADO'}
                      </span>
                      <h3 className="text-sm sm:text-base font-black text-white font-display uppercase tracking-tight">
                        {title || clubName}
                      </h3>
                      <p className="text-[11px] text-slate-300 font-medium">
                        {subtitle || 'Modo Carrera Oficial'}
                      </p>
                    </div>
                    {clubLogo && (
                      <div className="w-10 h-10 rounded-xl bg-black/60 backdrop-blur-md p-1.5 border border-white/20 shrink-0">
                        <img src={clubLogo} alt="" className="w-full h-full object-contain" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1c273a] shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-300 hover:bg-[#162030] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`px-5 py-2 rounded-xl font-black shadow-lg transition-all flex items-center gap-1.5 active:scale-95 ${
                modalMode === 'renewal'
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-black shadow-amber-400/20'
                  : 'bg-[#00ff87] hover:bg-[#00e676] text-[#090d14] shadow-[#00ff87]/20'
              }`}
            >
              <Send className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>
                {modalMode === 'lineup'
                  ? 'Publicar 11 Inicial'
                  : modalMode === 'renewal'
                  ? 'Publicar Renovación con Camiseta'
                  : 'Publicar Comunicado'}
              </span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
