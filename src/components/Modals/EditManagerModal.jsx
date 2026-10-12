import React, { useState } from 'react';
import { X, Edit3, Camera, Upload, Shield } from 'lucide-react';
import { 
  ALL_PRESET_CLUBS, 
  LALIGA_CLUBS,
  SEGUNDA_CLUBS,
  PREMIER_LEAGUE_CLUBS,
  SERIE_A_CLUBS,
  EUROPEAN_GIANTS,
  MANAGER_PRESETS, 
  getClubLogo,
  getClubRoster
} from '../../clubsData';
import { COMPETITION_OPTIONS } from '../../data/dropdownPresets';

export default function EditManagerModal({ isOpen, onClose, career, activeSeasonId, onUpdateCareer }) {
  if (!isOpen) return null;

  const { manager } = career;

  const [name, setName] = useState(manager.name);
  const [avatar, setAvatar] = useState(manager.avatar);
  const [club, setClub] = useState(manager.club);
  const [league, setLeague] = useState(manager.league);
  const [clubLogo, setClubLogo] = useState(manager.clubLogo);
  const [currentDate, setCurrentDate] = useState(manager.currentDate || manager.startDate);
  const [bio, setBio] = useState(manager.bio || '');

  const [syncSquad, setSyncSquad] = useState(false);

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setAvatar(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setClubLogo(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleClubChange = (newClubName) => {
    setClub(newClubName);
    const found = ALL_PRESET_CLUBS.find(c => c.name.toLowerCase() === newClubName.toLowerCase());
    if (found) {
      setClubLogo(found.logo);
      setLeague(found.league);
    }
    // Automatically suggest syncing authentic roster when switching clubs
    if (newClubName.toLowerCase() !== manager.club.toLowerCase()) {
      setSyncSquad(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let updatedSeasons = career.seasons;
    if (syncSquad || club.toLowerCase() !== manager.club.toLowerCase()) {
      const realRoster = getClubRoster(club);
      if (realRoster && realRoster.length > 0) {
        updatedSeasons = (career.seasons || []).map((s, idx) => {
          if (!activeSeasonId || s.id === activeSeasonId || idx === 0) {
            return {
              ...s,
              squad: realRoster
            };
          }
          return s;
        });
      }
    }

    const updatedCareer = {
      ...career,
      manager: {
        ...manager,
        name,
        avatar,
        club,
        league,
        clubLogo: clubLogo || getClubLogo(club),
        currentDate,
        bio
      },
      seasons: updatedSeasons
    };
    onUpdateCareer(updatedCareer);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#101724] border border-[#22314a] rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 my-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-[#162030] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-[#1c273a]">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-[#00ff87] flex items-center justify-center">
            <Edit3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white font-display">Editar Datos de la Carrera</h2>
            <p className="text-xs text-slate-400">Modifica el nombre del entrenador, fotos reales, club, escudo y fecha</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Avatar & Club Crest previews */}
          <div className="grid grid-cols-2 gap-3 bg-[#141d2c] p-3 rounded-xl border border-[#1e2c42]">
            {/* Manager Avatar */}
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">Foto del Entrenador</label>
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <img 
                    src={avatar} 
                    alt="Manager" 
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#00ff87] bg-[#090d14]"
                    onError={(e) => { e.target.src = MANAGER_PRESETS[0].avatar; }}
                  />
                  <label className="absolute bottom-0 right-0 bg-[#00ff87] text-[#090d14] p-0.5 rounded-full cursor-pointer hover:scale-110 transition-transform">
                    <Camera className="w-3 h-3" />
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                  </label>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-slate-400 block truncate">Sube o elige:</span>
                  <div className="flex gap-1 mt-1">
                    {MANAGER_PRESETS.slice(0, 3).map((m, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAvatar(m.avatar)}
                        className="w-5 h-5 rounded-full overflow-hidden border border-[#2b3c58] hover:border-[#00ff87]"
                      >
                        <img src={m.avatar} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Club Crest */}
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">Escudo del Club</label>
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <img 
                    src={clubLogo} 
                    alt="Club Logo" 
                    className="w-12 h-12 object-contain p-1 rounded-xl bg-[#090d14] border border-[#273852]"
                    onError={(e) => { e.target.src = getClubLogo(club); }}
                  />
                  <label className="absolute bottom-0 right-0 bg-[#38bdf8] text-[#090d14] p-0.5 rounded-full cursor-pointer hover:scale-110 transition-transform">
                    <Upload className="w-3 h-3 text-white" />
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-slate-400 block truncate">Vector SVG</span>
                  <button
                    type="button"
                    onClick={() => setClubLogo(getClubLogo(club))}
                    className="text-[10px] text-[#00ff87] hover:underline font-semibold mt-1 block"
                  >
                    Restaurar oficial
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Nombre del Entrenador</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-[#00ff87]"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Fecha en el Juego</label>
              <input
                type="text"
                required
                value={currentDate}
                onChange={(e) => setCurrentDate(e.target.value)}
                className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-[#00ff87]"
                placeholder="01 jul 2025"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Club</label>
              <select
                value={club}
                onChange={(e) => handleClubChange(e.target.value)}
                className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-[#00ff87]"
              >
                {!ALL_PRESET_CLUBS.some(c => c.name === club) && (
                  <option value={club}>⭐ {club}</option>
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
                <optgroup label="🌍 RESTO DE EUROPA">
                  {EUROPEAN_GIANTS.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </optgroup>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Liga / Competición</label>
              <select
                value={league}
                onChange={(e) => setLeague(e.target.value)}
                className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-[#00ff87]"
              >
                {!COMPETITION_OPTIONS.includes(league) && (
                  <option value={league}>{league}</option>
                )}
                {COMPETITION_OPTIONS.map((comp, idx) => (
                  <option key={idx} value={comp}>{comp}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Sync Authentic Squad & Lineup Option */}
          <div className="bg-[#141d2c] border border-[#1e2c42] p-3 rounded-xl flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-xs flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#00ff87]" />
                  <span>Sincronizar Plantilla Real y 11 Titular</span>
                </span>
                <span className="text-[9px] bg-[#00ff87]/20 text-[#00ff87] px-1.5 py-0.5 rounded font-black tracking-wider uppercase">
                  EA FC OFICIAL
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Carga automáticamente los 11 titulares reales, 7 suplentes y reservas de <strong className="text-white">{club}</strong> con sus fotos, medias y dorsales auténticos.
              </p>
            </div>
            <label className="relative flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={syncSquad}
                onChange={(e) => setSyncSquad(e.target.checked)}
                className="w-4 h-4 accent-[#00ff87] rounded cursor-pointer"
              />
            </label>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">URL Foto Entrenador</label>
            <input
              type="text"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-1.5 text-white text-[11px]"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">URL Escudo del Club</label>
            <input
              type="text"
              value={clubLogo}
              onChange={(e) => setClubLogo(e.target.value)}
              className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-1.5 text-white text-[11px]"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Biografía / Filosofía Táctica</label>
            <textarea
              rows="2"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-[#162234] border border-[#25364f] rounded-xl p-2.5 text-white"
            ></textarea>
          </div>

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
              Guardar Cambios
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
