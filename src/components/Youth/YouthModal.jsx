import React, { useState } from 'react';
import { X, Sprout, Star } from 'lucide-react';

export default function YouthModal({ isOpen, onClose, onSaveYouth }) {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [position, setPosition] = useState('MCO');
  const [age, setAge] = useState(16);
  const [country, setCountry] = useState('España');
  const [flag, setFlag] = useState('🇪🇸');
  const [rating, setRating] = useState(65);
  const [potentialMin, setPotentialMin] = useState(86);
  const [potentialMax, setPotentialMax] = useState(92);
  const [skills, setSkills] = useState('4★');
  const [weakFoot, setWeakFoot] = useState('4★');
  const [scoutedRegion, setScoutedRegion] = useState('España (Centrocampistas técnicos)');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProspect = {
      id: `ya-${Date.now()}`,
      name,
      position,
      age: Number(age),
      country,
      flag,
      rating: Number(rating),
      potentialMin: Number(potentialMin),
      potentialMax: Number(potentialMax),
      skills,
      weakFoot,
      scoutedDate: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
      scoutedRegion,
      status: 'En academia',
      notes
    };
    onSaveYouth(newProspect);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#101724] border border-[#22314a] rounded-2xl max-w-xl w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-[#162030] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-[#1c273a]">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white font-display">Añadir Canterano / Joya Ojeada</h2>
            <p className="text-xs text-slate-400">Registra un talento de la academia con su potencial estimado</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-slate-400 font-semibold mb-1">Nombre de la Promesa</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-[#00ff87]"
                placeholder="Marc Soler, Mateo Rossi..."
              />
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
              <label className="block text-slate-400 font-semibold mb-1">Edad (15-19)</label>
              <input
                type="number"
                min="15"
                max="19"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-[#00ff87]"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Media Actual</label>
              <input
                type="number"
                min="45"
                max="75"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-emerald-400 font-bold focus:outline-none focus:border-[#00ff87]"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Potencial Mín.</label>
              <input
                type="number"
                min="70"
                max="99"
                value={potentialMin}
                onChange={(e) => setPotentialMin(e.target.value)}
                className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-sky-400 font-bold focus:outline-none focus:border-[#00ff87]"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Potencial Máx.</label>
              <input
                type="number"
                min="70"
                max="99"
                value={potentialMax}
                onChange={(e) => setPotentialMax(e.target.value)}
                className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-[#00ff87] font-bold focus:outline-none focus:border-[#00ff87]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">País</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-[#00ff87]"
                placeholder="España"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Bandera</label>
              <input
                type="text"
                value={flag}
                onChange={(e) => setFlag(e.target.value)}
                className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-[#00ff87]"
                placeholder="🇪🇸"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Filigranas (Skills)</label>
              <select
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-[#00ff87]"
              >
                <option value="1★">1★</option>
                <option value="2★">2★</option>
                <option value="3★">3★</option>
                <option value="4★">4★</option>
                <option value="5★">5★</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Pierna Mala</label>
              <select
                value={weakFoot}
                onChange={(e) => setWeakFoot(e.target.value)}
                className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-[#00ff87]"
              >
                <option value="1★">1★</option>
                <option value="2★">2★</option>
                <option value="3★">3★</option>
                <option value="4★">4★</option>
                <option value="5★">5★</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Red de Ojeo</label>
              <input
                type="text"
                value={scoutedRegion}
                onChange={(e) => setScoutedRegion(e.target.value)}
                className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-[#00ff87]"
                placeholder="Región u ojeador"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Informe del Ojeador / Notas</label>
            <textarea
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#162234] border border-[#25364f] rounded-xl p-2.5 text-white focus:outline-none focus:border-[#00ff87]"
              placeholder="Visión de juego, regate, físico prometedor..."
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
              className="px-5 py-2 rounded-xl bg-[#00ff87] hover:bg-[#00e676] text-[#090d14] font-bold shadow-lg shadow-[#00ff87]/20 transition-all"
            >
              Guardar en Cantera
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
