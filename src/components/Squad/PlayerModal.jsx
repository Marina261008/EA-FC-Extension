import React, { useState } from 'react';
import { X, UserPlus, Shield, Star, DollarSign, Camera, Upload } from 'lucide-react';
import { PLAYER_FACE_PRESETS } from '../../clubsData';
import {
  NATIONALITY_OPTIONS,
  CONTRACT_YEAR_OPTIONS,
  WAGE_OPTIONS,
  MARKET_VALUE_OPTIONS
} from '../../data/dropdownPresets';

export default function PlayerModal({ isOpen, onClose, onSavePlayer, playerToEdit }) {
  if (!isOpen) return null;

  const [name, setName] = useState(playerToEdit?.name || '');
  const [position, setPosition] = useState(playerToEdit?.position || 'DC');
  const [category, setCategory] = useState(playerToEdit?.category || 'DEL');
  const [number, setNumber] = useState(playerToEdit?.number || 9);
  const [age, setAge] = useState(playerToEdit?.age || 23);
  const [country, setCountry] = useState(playerToEdit?.country || 'España');
  const [flag, setFlag] = useState(playerToEdit?.flag || '🇪🇸');
  const [rating, setRating] = useState(playerToEdit?.rating || 78);
  const [potential, setPotential] = useState(playerToEdit?.potential || 84);
  const [photo, setPhoto] = useState(playerToEdit?.photo || PLAYER_FACE_PRESETS[0]);
  const [value, setValue] = useState(playerToEdit?.value || '18 M €');
  const [wage, setWage] = useState(playerToEdit?.wage || '35.000 €/sem');
  const [contract, setContract] = useState(playerToEdit?.contract || '2028');
  const [status, setStatus] = useState(playerToEdit?.status || 'Titular');
  const [morale, setMorale] = useState(playerToEdit?.morale || 'Excelente');

  const handlePositionChange = (pos) => {
    setPosition(pos);
    if (pos === 'POR') setCategory('POR');
    else if (['LD', 'LI', 'DFC', 'CAD', 'CAI'].includes(pos)) setCategory('DEF');
    else if (['MCD', 'MC', 'MCO', 'MD', 'MI'].includes(pos)) setCategory('MED');
    else setCategory('DEL');
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
    const playerData = {
      id: playerToEdit?.id || `sq-${Date.now()}`,
      name,
      position,
      category,
      number: Number(number),
      age: Number(age),
      country,
      flag,
      rating: Number(rating),
      potential: Number(potential),
      photo,
      value,
      wage,
      contract,
      status,
      morale,
      matches: playerToEdit?.matches || 0,
      goals: playerToEdit?.goals || 0,
      assists: playerToEdit?.assists || 0,
      cleanSheets: playerToEdit?.cleanSheets || 0,
      yellowCards: playerToEdit?.yellowCards || 0,
      redCards: playerToEdit?.redCards || 0,
      avgRating: playerToEdit?.avgRating || 7.0
    };
    onSavePlayer(playerData);
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
          <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white font-display">
              {playerToEdit ? 'Editar Jugador' : 'Añadir Jugador a la Plantilla'}
            </h2>
            <p className="text-xs text-slate-400">Introduce las características, foto real, media y contrato en EA FC</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Photo & Basic Info */}
          <div className="bg-[#141d2c] p-3 rounded-xl border border-[#1e2c42] space-y-3">
            <label className="block text-slate-300 font-bold">Foto del Jugador</label>
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <img 
                  src={photo} 
                  alt="Player preview" 
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#00ff87] shadow-md bg-[#090d14]"
                  onError={(e) => { e.target.src = "./default_player.svg"; }}
                />
                <label className="absolute bottom-0 right-0 bg-[#00ff87] text-[#090d14] p-1 rounded-full cursor-pointer hover:scale-110 transition-transform shadow">
                  <Camera className="w-3.5 h-3.5" />
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
              </div>

              <div className="flex-1 space-y-1.5">
                <p className="text-[11px] text-slate-400">Selecciona una cara predeterminada o sube tu propia imagen:</p>
                <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                  {PLAYER_FACE_PRESETS.slice(0, 6).map((presetUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPhoto(presetUrl)}
                      className={`w-8 h-8 rounded-full overflow-hidden border transition-all shrink-0 ${
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
                placeholder="O pega una URL de imagen..."
                value={photo}
                onChange={(e) => setPhoto(e.target.value)}
                className="w-full bg-[#162234] border border-[#25364f] rounded-lg px-2.5 py-1 text-[11px] text-slate-300 focus:outline-none focus:border-[#00ff87]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-slate-400 font-semibold mb-1">Nombre Completo</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-[#00ff87]"
                placeholder="Nombre del jugador"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Dorsal (#)</label>
              <input
                type="number"
                min="1"
                max="99"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-[#00ff87]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Posición</label>
              <select
                value={position}
                onChange={(e) => handlePositionChange(e.target.value)}
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
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Edad</label>
              <input
                type="number"
                min="15"
                max="45"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-[#00ff87]"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Media (OVR)</label>
              <input
                type="number"
                min="45"
                max="99"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-emerald-400 font-bold focus:outline-none focus:border-[#00ff87]"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Potencial</label>
              <input
                type="number"
                min="45"
                max="99"
                value={potential}
                onChange={(e) => setPotential(e.target.value)}
                className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-sky-400 font-bold focus:outline-none focus:border-[#00ff87]"
              />
            </div>
          </div>

          <div>
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Valor de Mercado</label>
              <select
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-[#00ff87]"
              >
                {!MARKET_VALUE_OPTIONS.includes(value) && (
                  <option value={value}>{value}</option>
                )}
                {MARKET_VALUE_OPTIONS.map((v, i) => (
                  <option key={i} value={v}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Salario Semanal</label>
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
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Fin de Contrato</label>
              <select
                value={contract}
                onChange={(e) => setContract(e.target.value)}
                className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-[#00ff87]"
              >
                {!CONTRACT_YEAR_OPTIONS.includes(contract) && (
                  <option value={contract}>{contract}</option>
                )}
                {CONTRACT_YEAR_OPTIONS.map((y, i) => (
                  <option key={i} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Rol en el Equipo</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-[#00ff87]"
              >
                <option value="Titular">Titular Indiscutible</option>
                <option value="Rotación">Rotación</option>
                <option value="Suplente">Suplente</option>
                <option value="Promesa">Joven Promesa</option>
                <option value="Esporádico">Esporádico</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Moral</label>
              <select
                value={morale}
                onChange={(e) => setMorale(e.target.value)}
                className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-[#00ff87]"
              >
                <option value="Excelente">Excelente (Muy feliz)</option>
                <option value="Contento">Contento</option>
                <option value="Normal">Normal</option>
                <option value="Descontento">Descontento</option>
              </select>
            </div>
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
              {playerToEdit ? 'Actualizar Jugador' : 'Guardar en Plantilla'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
