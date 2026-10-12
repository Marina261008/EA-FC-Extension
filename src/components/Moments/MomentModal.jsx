import React, { useState } from 'react';
import { X, Camera, Sparkles } from 'lucide-react';

export default function MomentModal({ isOpen, onClose, onSaveMoment }) {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('15 sep 2025');
  const [type, setType] = useState('Partido');
  const [badge, setBadge] = useState('Momento Histórico');
  const [description, setDescription] = useState('');
  const [mediaUrl, setMediaUrl] = useState('https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&auto=format&fit=crop&q=80');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newMoment = {
      id: `mom-${Date.now()}`,
      title,
      date,
      type,
      badge,
      description,
      mediaUrl
    };
    onSaveMoment(newMoment);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#101724] border border-[#22314a] rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-[#162030] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-[#1c273a]">
          <div className="w-9 h-9 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white font-display">Añadir Momento Destacado</h2>
            <p className="text-xs text-slate-400">Guarda noticias, títulos, derbis o capturas de tu carrera</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Título del Momento</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-[#00ff87]"
              placeholder="Victoria en el derbi, Fichaje bomba, Campeón de Copa..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Categoría</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-[#00ff87]"
              >
                <option value="Partido">Partido Épico</option>
                <option value="Fichaje">Fichaje Galáctico</option>
                <option value="Venta">Venta Millonaria</option>
                <option value="Trofeo">Título / Trofeo</option>
                <option value="Cantera">Debut de Cantera</option>
                <option value="Institucional">Institucional</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Etiqueta / Badge</label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-[#00ff87]"
                placeholder="Derbi, Cláusula, Remontada..."
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Fecha en el juego</label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-[#00ff87]"
              placeholder="31 ago 2025"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">URL de la Imagen o Captura</label>
            <input
              type="url"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-[#00ff87]"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Descripción / Historia</label>
            <textarea
              rows="3"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#162234] border border-[#25364f] rounded-xl p-2.5 text-white focus:outline-none focus:border-[#00ff87]"
              placeholder="Detalla lo que sucedió en este momento clave de tu carrera..."
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
              Guardar Momento
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
