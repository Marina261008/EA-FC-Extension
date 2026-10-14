import React, { useState } from 'react';
import { Shield, Sparkles, Trophy, User, Check, Globe } from 'lucide-react';
import { ALL_PRESET_CLUBS, getClubLogo, getClubRoster } from '../../clubsData';

export default function OnboardingModal({ isOpen, onComplete }) {
  if (!isOpen) return null;

  const [managerName, setManagerName] = useState('');
  const [selectedClubId, setSelectedClubId] = useState('rma');
  const [gameVersion, setGameVersion] = useState('EA FC26');
  const [nationality, setNationality] = useState('🇪🇸 España');
  const [searchClub, setSearchClub] = useState('');

  const clubs = ALL_PRESET_CLUBS || [];

  const filteredClubs = searchClub.trim()
    ? clubs.filter(c => 
        c.name.toLowerCase().includes(searchClub.toLowerCase().trim()) ||
        c.league.toLowerCase().includes(searchClub.toLowerCase().trim()) ||
        c.country.toLowerCase().includes(searchClub.toLowerCase().trim())
      )
    : clubs;

  const selectedClub = clubs.find(c => c.id === selectedClubId) || clubs[0] || {
    id: 'rma',
    name: 'Real Madrid',
    league: 'LALIGA EA SPORTS',
    logo: 'https://crests.football-data.org/86.svg',
    budget: 180000000
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanName = managerName.trim() || 'Nuevo Mánager';
    
    onComplete({
      managerName: cleanName,
      clubName: selectedClub.name,
      clubId: selectedClub.id,
      clubLogo: selectedClub.logo || selectedClub.badge,
      league: selectedClub.league,
      gameVersion,
      nationality
    });
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-300">
      <div className="bg-gradient-to-b from-[#111827] via-[#0d131f] to-[#080d15] border border-[#23354d] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden text-slate-100 my-8">
        
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#00ff87]/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="text-center space-y-2 mb-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#033b24] text-[#00ff87] border border-[#00ff87]/30 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Bienvenido a FC Career Hub</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
            Configura tu Modo Carrera
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Comienza tu proyecto deportivo desde cero con plantilla real oficial, presupuesto y seguimiento completo.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          
          {/* 1. Manager Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#00ff87]" />
              <span>Tu Nombre de Mánager / Creador</span>
              <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="Ej: David Pérez, Tu Nombre..."
              value={managerName}
              onChange={(e) => setManagerName(e.target.value)}
              className="w-full bg-[#141e2e] border border-[#263750] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00ff87] font-semibold"
            />
          </div>

          {/* 2. Nationality */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-300 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-sky-400" />
              <span>Nacionalidad del Mánager</span>
            </label>
            <select
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              className="w-full bg-[#141e2e] border border-[#263750] rounded-xl px-3 py-2 text-xs text-white font-medium focus:outline-none focus:border-[#00ff87]"
            >
              <option value="🇪🇸 España">🇪🇸 España</option>
              <option value="🇦🇷 Argentina">🇦🇷 Argentina</option>
              <option value="🇫🇷 Francia">🇫🇷 Francia</option>
              <option value="🏴󠁧󠁢󠁥󠁮󠁧󠁿 Inglaterra">🏴󠁧󠁢󠁥󠁮󠁧󠁿 Inglaterra</option>
              <option value="🇧🇷 Brasil">🇧🇷 Brasil</option>
              <option value="🇩🇪 Alemania">🇩🇪 Alemania</option>
              <option value="🇮🇹 Italia">🇮🇹 Italia</option>
              <option value="🇵🇹 Portugal">🇵🇹 Portugal</option>
              <option value="🇺🇸 Estados Unidos">🇺🇸 Estados Unidos</option>
              <option value="🇺🇾 Uruguay">🇺🇾 Uruguay</option>
              <option value="🇨🇴 Colombia">🇨🇴 Colombia</option>
              <option value="🇲🇽 México">🇲🇽 México</option>
            </select>
          </div>

          {/* 3. Club Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-slate-300 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Elige tu Club Inicial</span>
              </label>
              <span className="text-[11px] text-slate-400 font-medium">
                {clubs.length} clubes oficiales disponibles
              </span>
            </div>

            {/* Filter Search */}
            <input
              type="text"
              placeholder="Buscar club por nombre o liga (ej. Madrid, Miami, City, Juventus...)"
              value={searchClub}
              onChange={(e) => setSearchClub(e.target.value)}
              className="w-full bg-[#141e2e] border border-[#263750] rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00ff87]"
            />

            {/* Club Grid preview */}
            <div className="max-h-48 overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 gap-2 border border-[#1e2a3c] rounded-2xl p-2 bg-[#0a0f18]/60">
              {filteredClubs.map((club) => {
                const isSelected = selectedClubId === club.id;
                return (
                  <button
                    key={club.id}
                    type="button"
                    onClick={() => setSelectedClubId(club.id)}
                    className={`flex items-center gap-2.5 p-2 rounded-xl text-left transition-all border ${
                      isSelected
                        ? 'bg-[#18263a] border-[#00ff87] text-white shadow-md'
                        : 'bg-[#121926] border-transparent hover:bg-[#162030] text-slate-300'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#0e1420] p-1 flex items-center justify-center shrink-0 border border-[#202d42]">
                      <img
                        src={club.logo || club.badge}
                        alt={club.name}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                    <div className="truncate flex-1">
                      <p className="font-bold text-xs truncate leading-tight">{club.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{club.league}</p>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-[#00ff87] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Club Summary pill */}
          <div className="p-3 rounded-2xl bg-[#121b29] border border-[#202e44] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <img
                src={selectedClub.logo || selectedClub.badge}
                alt={selectedClub.name}
                className="w-7 h-7 object-contain"
              />
              <div>
                <span className="font-extrabold text-white block">{selectedClub.name}</span>
                <span className="text-[11px] text-slate-400">{selectedClub.league}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-semibold">Presupuesto inicial</span>
              <span className="font-extrabold text-[#00ff87]">
                {((selectedClub.budget || 35000000) / 1000000).toFixed(0)} M €
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#00ff87] hover:bg-[#00e676] active:scale-95 text-[#090d14] font-black text-sm py-3.5 px-4 rounded-2xl shadow-xl shadow-[#00ff87]/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <Sparkles className="w-4 h-4 fill-black" />
            <span>Comenzar Modo Carrera desde 0</span>
          </button>
        </form>

      </div>
    </div>
  );
}
