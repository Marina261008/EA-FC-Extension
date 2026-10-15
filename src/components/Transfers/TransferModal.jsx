import React, { useState } from 'react';
import { X, ArrowDownLeft, ArrowUpRight, DollarSign, Camera, Edit3, Shield, Calendar } from 'lucide-react';
import { 
  ALL_PRESET_CLUBS, 
  LALIGA_CLUBS,
  SEGUNDA_CLUBS,
  PREMIER_LEAGUE_CLUBS,
  SERIE_A_CLUBS,
  BUNDESLIGA_CLUBS,
  LIGUE1_CLUBS,
  ARGENTINA_CLUBS,
  MLS_CLUBS,
  SAUDI_CLUBS,
  getClubLogo, 
  PLAYER_FACE_PRESETS,
  searchDatabasePlayers,
  mapPositionToEs,
  getCountryFlag
} from '../../clubsData';
import {
  NATIONALITY_OPTIONS,
  TRANSFER_COST_OPTIONS,
  TRANSFER_DATE_OPTIONS,
  WAGE_OPTIONS,
  CONTRACT_YEAR_OPTIONS
} from '../../data/dropdownPresets';
import { 
  parseFormattedNumber, 
  formatToFullEuros, 
  parsePlayerValueInEuros 
} from '../../utils/formatters';

export default function TransferModal({ 
  isOpen, 
  onClose, 
  onSaveTransfer, 
  defaultType = 'in',
  squad = [],
  clubName: userClub = '',
  currentDate = '15 jul 2025'
}) {
  if (!isOpen) return null;

  const currentYear = parseInt(currentDate?.match(/\d{4}/)?.[0] || '2025', 10);
  const [type, setType] = useState(defaultType); // 'in' (Fichaje) | 'out' (Venta)
  const [name, setName] = useState('');
  const [position, setPosition] = useState('MC');
  const [age, setAge] = useState(24);
  const [country, setCountry] = useState('España');
  const [flag, setFlag] = useState('🇪🇸');
  const [rating, setRating] = useState(78);
  const [photo, setPhoto] = useState(PLAYER_FACE_PRESETS[0]);
  const [clubName, setClubName] = useState(userClub === 'Rayo Vallecano' ? 'Getafe CF' : 'Rayo Vallecano');
  const [isCustomClub, setIsCustomClub] = useState(false);
  const [cost, setCost] = useState('15 M €');
  const [costNumber, setCostNumber] = useState(15000000);
  const [wage, setWage] = useState('35.000 €/sem');
  const [contractYear, setContractYear] = useState(String(currentYear + 4));
  const [date, setDate] = useState('15 jul 2025');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Check if player is already in user's squad or belongs to user's club
  const isPlayerInSquad = Boolean(
    name.trim() && squad.some(p => p.name.toLowerCase().trim() === name.toLowerCase().trim())
  );
  const isPlayerFromUserClub = Boolean(
    type === 'in' && userClub && (
      (clubName && clubName.toLowerCase().trim() === userClub.toLowerCase().trim()) ||
      isPlayerInSquad
    )
  );

  const suggestions = name.trim().length >= 2 
    ? searchDatabasePlayers(name, {
        excludeSquadNames: type === 'in' ? squad.map(p => p.name) : [],
        excludeClubName: type === 'in' ? userClub : ''
      }).slice(0, 6) 
    : [];

  const handlePickDatabasePlayer = (player) => {
    setName(player.name);
    if (player.imageUrl) setPhoto(player.imageUrl);
    setRating(Number(player.ovr) || 75);
    setAge(Number(player.age) || 24);
    setPosition(mapPositionToEs(player.pos || 'CM'));
    setCountry(player.nat || 'España');
    setFlag(getCountryFlag(player.nat || 'España'));
    if (type === 'in' && player.teamName) {
      setClubName(player.teamName);
    }
    const valMil = player.val || Math.round((player.ovr || 75) * 0.4);
    const numEuros = valMil * 1000000;
    setCost(formatToFullEuros(numEuros));
    setCostNumber(numEuros);
    setWage(`${((player.wage || 35) * 1000).toLocaleString('es-ES')} €/sem`);
    setShowSuggestions(false);
  };

  const handleSelectSquadPlayerForSale = (playerName) => {
    const player = squad.find(p => p.name === playerName);
    if (!player) return;
    setName(player.name);
    setPhoto(player.photo || PLAYER_FACE_PRESETS[0]);
    setPosition(player.position || 'MC');
    setAge(player.age || 25);
    setRating(player.rating || 75);
    setCountry(player.country || 'España');
    setFlag(player.flag || '🇪🇸');
    const parsedVal = parsePlayerValueInEuros(player.value);
    setCost(formatToFullEuros(player.value || parsedVal));
    setCostNumber(parsedVal);
    setWage(player.wage || '35.000 €/sem');
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhoto(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (type === 'in' && (isPlayerInSquad || isPlayerFromUserClub)) {
      alert(`⚠️ No puedes fichar a ${name}: ¡Ya pertenece a tu club (${userClub})!`);
      return;
    }

    const logo = getClubLogo(clubName);
    const transferData = {
      id: `tr-${Date.now()}`,
      name,
      position,
      age: Number(age),
      country,
      flag,
      rating: Number(rating),
      photo,
      cost,
      costNumber: Number(costNumber) || 0,
      date
    };

    if (type === 'in') {
      transferData.clubFrom = clubName;
      transferData.originClubLogo = logo;
      transferData.clubLogo = logo;
      transferData.wage = wage;
      transferData.contract = contractYear;
    } else {
      transferData.clubTo = clubName;
      transferData.destClubLogo = logo;
      transferData.clubLogo = logo;
      transferData.wageSaved = wage;
    }

    onSaveTransfer(transferData, type);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#101724] border border-[#22314a] rounded-2xl max-w-xl w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 my-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-[#162030] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-[#1c273a]">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
            type === 'in' ? 'bg-[#00ff87]/20 text-[#00ff87] border border-[#00ff87]/40' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
          }`}>
            {type === 'in' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
          </div>
          <div>
            <h2 className="text-lg font-black text-white font-display">
              {type === 'in' ? 'Añadir Fichaje (Alta)' : 'Añadir Venta / Salida (Baja)'}
            </h2>
            <p className="text-xs text-slate-400">Registra un movimiento en el mercado de fichajes con foto y escudo</p>
          </div>
        </div>

        {/* Type toggle */}
        <div className="flex items-center gap-2 p-1 bg-[#141d2c] rounded-xl border border-[#202d42] mb-4">
          <button
            type="button"
            onClick={() => setType('in')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              type === 'in' ? 'bg-[#00ff87] text-[#090d14]' : 'text-slate-400 hover:text-white'
            }`}
          >
            📥 Fichaje / Alta
          </button>
          <button
            type="button"
            onClick={() => setType('out')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              type === 'out' ? 'bg-amber-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            📤 Venta / Salida
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Quick squad player picker for Outgoing transfers */}
          {type === 'out' && squad.length > 0 && (
            <div className="bg-[#141d2c] p-3 rounded-xl border border-amber-500/30 space-y-1.5">
              <label className="block text-amber-300 font-bold text-xs flex items-center gap-1.5">
                <span>📤</span>
                <span>Seleccionar jugador de tu plantilla para vender:</span>
              </label>
              <select
                onChange={(e) => handleSelectSquadPlayerForSale(e.target.value)}
                className="w-full bg-[#1b2638] border border-[#2c3f5c] rounded-xl px-3 py-2 text-white font-bold text-xs"
              >
                <option value="">Selecciona un jugador de tu equipo ({squad.length} en plantilla)...</option>
                {squad.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name} ({p.position}) · {p.rating} OVR · {p.value}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Photo Selector */}
          <div className="bg-[#141d2c] p-3 rounded-xl border border-[#1e2c42] space-y-3">
            <label className="block text-slate-300 font-bold">Foto del Jugador Fichado/Vendido</label>
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <img 
                  src={photo} 
                  alt="Player preview" 
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#00ff87] shadow-md bg-[#090d14]"
                  onError={(e) => { e.target.src = "./default_player.svg"; }}
                />
                <label className="absolute bottom-0 right-0 bg-[#00ff87] text-[#090d14] p-1 rounded-full cursor-pointer hover:scale-110 transition-transform shadow">
                  <Camera className="w-3.5 h-3.5" />
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
              </div>

              <div className="flex-1 space-y-1.5">
                <p className="text-[11px] text-slate-400">Selecciona una cara predeterminada o sube archivo:</p>
                <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                  {PLAYER_FACE_PRESETS.slice(0, 6).map((presetUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPhoto(presetUrl)}
                      className={`w-7 h-7 rounded-full overflow-hidden border transition-all shrink-0 ${
                        photo === presetUrl ? 'border-[#00ff87] ring-2 ring-[#00ff87]/30 scale-105' : 'border-[#263750] opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={presetUrl} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <input
                type="text"
                placeholder="O pega una URL de foto..."
                value={photo}
                onChange={(e) => setPhoto(e.target.value)}
                className="w-full bg-[#162234] border border-[#25364f] rounded-lg px-2.5 py-1 text-[11px] text-slate-300 focus:outline-none focus:border-[#00ff87]"
              />
            </div>
          </div>

          {/* Warning banner if trying to sign own player */}
          {type === 'in' && (isPlayerInSquad || isPlayerFromUserClub) && (
            <div className="p-3 bg-red-950/70 border border-red-500/60 rounded-xl flex items-center gap-2.5 text-xs text-red-200 animate-in fade-in">
              <span className="text-xl shrink-0">🚫</span>
              <div>
                <p className="font-bold text-red-100">Jugador no fichable</p>
                <p className="text-[11px] text-red-300">
                  <strong>{name}</strong> ya pertenece a tu plantilla {userClub ? `(${userClub})` : ''}. En EA Sports FC no puedes fichar a un futbolista que ya forma parte de tu propio club.
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 relative">
              <label className="block text-slate-400 font-semibold mb-1 flex items-center justify-between">
                <span>Nombre del Jugador</span>
                <span className="text-[10px] text-[#00ff87] font-normal">
                  {type === 'in' ? 'Jugadores de otros clubes disponibles' : 'Jugadores disponibles'}
                </span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className={`w-full bg-[#162234] border rounded-xl px-3 py-2 text-white font-medium focus:outline-none ${
                  type === 'in' && (isPlayerInSquad || isPlayerFromUserClub)
                    ? 'border-red-500 text-red-200'
                    : 'border-[#25364f] focus:border-[#00ff87]'
                }`}
                placeholder="Escribe el nombre (ej. Mbappé, Lamine, Pedri...)"
              />

              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-[#0f1725] border border-[#24354f] rounded-xl shadow-2xl z-50 overflow-hidden divide-y divide-[#1b273b]">
                  {suggestions.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handlePickDatabasePlayer(p)}
                      className="p-2 hover:bg-[#1a2538] cursor-pointer flex items-center justify-between gap-2 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <img 
                          src={p.imageUrl} 
                          alt="" 
                          className="w-7 h-7 rounded-full object-cover bg-[#090d14] border border-[#273850]" 
                          onError={(e) => { e.target.src = "./default_player.svg"; }}
                        />
                        <div>
                          <p className="font-bold text-white text-xs">{p.name}</p>
                          <p className="text-[10px] text-slate-400">{p.teamName} • {p.pos}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-black text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-500/30">
                          {p.ovr} OVR
                        </span>
                        <span className="text-[10px] text-emerald-400 block font-semibold">{p.val}M €</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Posición</label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-[#00ff87]"
              >
                <option value="POR">POR</option>
                <option value="LD">LD</option>
                <option value="DFC">DFC</option>
                <option value="LI">LI</option>
                <option value="MCD">MCD</option>
                <option value="MC">MC</option>
                <option value="MCO">MCO</option>
                <option value="MD">MD</option>
                <option value="MI">MI</option>
                <option value="ED">ED</option>
                <option value="EI">EI</option>
                <option value="DC">DC</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Edad</label>
              <input
                type="number"
                min="16"
                max="42"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-[#00ff87]"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Media (OVR)</label>
              <input
                type="number"
                min="50"
                max="99"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-emerald-400 font-bold focus:outline-none focus:border-[#00ff87]"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-slate-400 font-semibold mb-1">Nacionalidad</label>
              <select
                value={country}
                onChange={(e) => {
                  const val = e.target.value;
                  const opt = NATIONALITY_OPTIONS.find(n => n.country === val);
                  if (opt) {
                    setCountry(opt.country);
                    setFlag(opt.flag);
                  } else {
                    setCountry(val);
                  }
                }}
                className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-[#00ff87]"
              >
                {!NATIONALITY_OPTIONS.some(n => n.country === country) && (
                  <option value={country}>{flag} {country}</option>
                )}
                {NATIONALITY_OPTIONS.map((n, i) => (
                  <option key={i} value={n.country}>{n.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-400 font-semibold flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#00ff87]" />
                  <span>{type === 'in' ? 'Club de Procedencia' : 'Club de Destino'}</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsCustomClub(!isCustomClub)}
                  className="text-[10px] text-[#00ff87] hover:underline flex items-center gap-1 font-bold"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>{isCustomClub ? 'Elegir de lista' : 'Escribir otro club'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#141e2e] border border-[#273850] p-1 flex items-center justify-center shrink-0">
                  <img
                    src={getClubLogo(clubName)}
                    alt={clubName}
                    className="max-w-full max-h-full object-contain filter drop-shadow"
                    onError={(e) => { e.target.src = "https://crests.football-data.org/95.svg"; }}
                  />
                </div>

                {isCustomClub ? (
                  <input
                    type="text"
                    value={clubName}
                    onChange={(e) => setClubName(e.target.value)}
                    placeholder="Escribe el nombre del club..."
                    className="flex-1 bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-[#00ff87]"
                  />
                ) : (
                  <select
                    value={clubName}
                    onChange={(e) => setClubName(e.target.value)}
                    className="flex-1 bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-[#00ff87]"
                  >
                    {!ALL_PRESET_CLUBS.some(c => c.name === clubName) && (
                      <option value={clubName}>⭐ {clubName}</option>
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
                    <optgroup label="🇫🇷 LIGUE 1">
                      {LIGUE1_CLUBS.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="🇦🇷 LIGA PROFESIONAL ARGENTINA">
                      {ARGENTINA_CLUBS.map((c) => (
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
                  </select>
                )}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                {type === 'in' 
                  ? '💡 Modificable si el jugador cambió de equipo en temporadas previas de tu carrera.'
                  : 'Equipo al que se marcha transferido el jugador.'}
              </p>
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Fecha de la Operación</label>
              <select
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-[#00ff87]"
              >
                {!TRANSFER_DATE_OPTIONS.includes(date) && (
                  <option value={date}>{date}</option>
                )}
                {TRANSFER_DATE_OPTIONS.map((d, i) => (
                  <option key={i} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Coste del Traspaso</label>
              <select
                value={cost}
                onChange={(e) => {
                  const val = e.target.value;
                  setCost(val);
                  setCostNumber(parseFormattedNumber(val));
                }}
                className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-[#00ff87]"
              >
                {!TRANSFER_COST_OPTIONS.includes(cost) && (
                  <option value={cost}>{cost}</option>
                )}
                {TRANSFER_COST_OPTIONS.map((c, i) => (
                  <option key={i} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">
                {type === 'in' ? 'Salario Acordado' : 'Salario Ahorrado'}
              </label>
              <select
                value={wage}
                onChange={(e) => setWage(e.target.value)}
                className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-[#00ff87]"
              >
                {!WAGE_OPTIONS.includes(wage) && (
                  <option value={wage}>{wage}</option>
                )}
                {WAGE_OPTIONS.map((w, i) => (
                  <option key={i} value={w}>{w}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Duración del Contrato (solo para Fichajes / Altas) */}
          {type === 'in' && (
            <div className="bg-[#141d2c] p-3.5 rounded-xl border border-[#00ff87]/30 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#00ff87]" />
                  <span>Duración del Contrato / ¿Hasta qué año ficha?</span>
                  <span className="text-[10px] text-[#00ff87] font-semibold bg-[#033b24] px-1.5 py-0.5 rounded border border-[#00ff87]/30">
                    Obligatorio
                  </span>
                </label>
                <span className="text-xs font-black text-[#00ff87] bg-[#00ff87]/10 px-2 py-0.5 rounded-md border border-[#00ff87]/30">
                  Hasta junio de {contractYear} ({Math.max(1, parseInt(contractYear, 10) - currentYear)} {Math.max(1, parseInt(contractYear, 10) - currentYear) === 1 ? 'temporada' : 'temporadas'})
                </span>
              </div>

              <select
                value={contractYear}
                onChange={(e) => setContractYear(e.target.value)}
                className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white font-bold text-xs focus:outline-none focus:border-[#00ff87]"
              >
                {!CONTRACT_YEAR_OPTIONS.includes(contractYear) && (
                  <option value={contractYear}>{contractYear}</option>
                )}
                {CONTRACT_YEAR_OPTIONS.map((year) => {
                  const diff = Math.max(0, parseInt(year, 10) - currentYear);
                  return (
                    <option key={year} value={year}>
                      Firma hasta {year} ({diff > 0 ? `${diff} ${diff === 1 ? 'año' : 'años'} de contrato` : 'Fin de temporada'})
                    </option>
                  );
                })}
              </select>

              {/* Botones rápidos de años de contrato */}
              <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                <span className="text-[10px] text-slate-400 font-semibold mr-1">Opciones rápidas:</span>
                {[1, 2, 3, 4, 5].map((numYears) => {
                  const targetYear = String(currentYear + numYears);
                  const isSelected = contractYear === targetYear;
                  return (
                    <button
                      key={numYears}
                      type="button"
                      onClick={() => setContractYear(targetYear)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-[#00ff87] text-[#090d14] shadow-md shadow-[#00ff87]/20 scale-105' 
                          : 'bg-[#1b2638] text-slate-300 hover:text-white hover:bg-[#25364f]'
                      }`}
                    >
                      +{numYears} {numYears === 1 ? 'año' : 'años'} ({targetYear})
                    </button>
                  );
                })}
              </div>
            </div>
          )}

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
              Guardar Movimiento
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
