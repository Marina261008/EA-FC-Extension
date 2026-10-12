import React, { useState } from 'react';
import { Plus, Camera, Calendar, Tag, Trash2 } from 'lucide-react';

export default function MomentsTab({
  season,
  onOpenMomentModal,
  onDeleteMoment
}) {
  const [filter, setFilter] = useState('ALL');
  const moments = season.moments || [];

  const types = ['ALL', ...new Set(moments.map(m => m.type))];
  const filteredMoments = filter === 'ALL'
    ? moments
    : moments.filter(m => m.type === filter);

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#101724] border border-[#1e2a3f] p-4 rounded-2xl">
        <div>
          <h2 className="text-lg font-black text-white font-display flex items-center gap-2">
            <span>Momentos Destacados de la Temporada</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#172235] text-pink-400 font-semibold border border-pink-500/20">
              {moments.length} momentos
            </span>
          </h2>
          <p className="text-xs text-slate-400">El diario visual de tu historia: grandes victorias, fichajes y títulos</p>
        </div>

        <button
          onClick={onOpenMomentModal}
          className="flex items-center gap-1.5 bg-[#00ff87] hover:bg-[#00e676] text-[#090d14] font-bold text-xs px-3.5 py-2 rounded-xl shadow-lg shadow-[#00ff87]/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Añadir Momento</span>
        </button>
      </div>

      {/* Categories Filter */}
      {types.length > 2 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all ${
                filter === t
                  ? 'bg-[#1b2639] text-[#00ff87] border border-[#2b3c59]'
                  : 'text-slate-400 hover:text-white hover:bg-[#151f30]'
              }`}
            >
              {t === 'ALL' ? 'Todos los momentos' : t}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMoments.map((m) => (
          <div
            key={m.id}
            className="bg-[#101724] border border-[#1e2a3f] hover:border-[#2b3d5b] rounded-2xl overflow-hidden shadow-sm transition-all group flex flex-col"
          >
            {/* Image */}
            <div className="relative h-44 bg-[#141d2c] overflow-hidden">
              <img
                src={m.mediaUrl || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&auto=format&fit=crop&q=80"}
                alt={m.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&auto=format&fit=crop&q=80";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101724] via-transparent to-black/30"></div>

              {/* Badge & Date */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#090d14]/80 backdrop-blur text-[#00ff87] border border-white/10">
                  {m.badge || m.type}
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#090d14]/80 backdrop-blur text-slate-300 flex items-center gap-1 border border-white/10">
                  <Calendar className="w-3 h-3" />
                  {m.date}
                </span>
              </div>

              {/* Delete button */}
              <button
                onClick={() => onDeleteMoment(m.id)}
                className="absolute bottom-3 right-3 p-1.5 rounded-lg bg-black/60 text-slate-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Eliminar momento"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
              <div>
                <h3 className="font-extrabold text-white text-sm sm:text-base leading-snug group-hover:text-[#00ff87] transition-colors">
                  {m.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mt-1.5">
                  {m.description}
                </p>
              </div>

              <div className="pt-2 border-t border-[#182335] flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {m.type}
                </span>
                <span className="text-emerald-400 font-semibold">Guardado</span>
              </div>
            </div>
          </div>
        ))}

        {filteredMoments.length === 0 && (
          <div className="col-span-full text-center py-12 bg-[#101724] border border-[#1e2a3f] rounded-2xl p-6">
            <Camera className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="font-bold text-white text-base mb-1">Sin momentos guardados</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
              Inmortaliza los mejores momentos de tu carrera de entrenador.
            </p>
            <button
              onClick={onOpenMomentModal}
              className="bg-[#00ff87] text-[#090d14] font-bold text-xs px-4 py-2 rounded-xl"
            >
              Añadir Primer Momento
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
