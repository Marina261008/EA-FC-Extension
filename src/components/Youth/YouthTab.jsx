import React from 'react';
import { Plus, Sprout, ArrowUpRight, Star, Trash2, Award, Zap } from 'lucide-react';

export default function YouthTab({
  season,
  onOpenYouthModal,
  onPromoteYouth,
  onDeleteYouth
}) {
  const youthAcademy = season.youthAcademy || [];

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#101724] border border-[#1e2a3f] p-4 rounded-2xl">
        <div>
          <h2 className="text-lg font-black text-white font-display flex items-center gap-2">
            <span>Cantera y Fuerzas Básicas</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950/60 text-[#00ff87] font-semibold border border-emerald-500/30">
              {youthAcademy.length} promesas
            </span>
          </h2>
          <p className="text-xs text-slate-400">Desarrollo de jóvenes talentos y ojeo de futuras estrellas mundiales</p>
        </div>

        <button
          onClick={onOpenYouthModal}
          className="flex items-center gap-1.5 bg-[#00ff87] hover:bg-[#00e676] text-[#090d14] font-bold text-xs px-3.5 py-2 rounded-xl shadow-lg shadow-[#00ff87]/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Fichar de la Cantera</span>
        </button>
      </div>

      {/* Grid of Prospects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {youthAcademy.map((prospect) => (
          <div
            key={prospect.id}
            className="bg-[#101724] border border-[#1e2a3f] hover:border-[#283955] rounded-2xl p-5 shadow-sm space-y-4 transition-all relative group"
          >
            {/* Top row: Name, pos, flag, delete */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#162234] to-[#0f1724] border border-[#23334d] flex items-center justify-center font-black text-sm text-[#00ff87]">
                  {prospect.position}
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base leading-tight">
                    {prospect.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <span>{prospect.age} años</span>
                    <span>•</span>
                    <span>{prospect.flag} {prospect.country}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onDeleteYouth(prospect.id)}
                className="text-slate-500 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Liberar canterano"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Ratings & Potential Meter */}
            <div className="bg-[#141d2c] border border-[#202d42] p-3.5 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Media Actual</span>
                  <span className="text-xl font-black text-white font-display">{prospect.rating}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Rango Potencial</span>
                  <span className="text-xl font-black text-[#00ff87] font-display">
                    {prospect.potentialMin} - {prospect.potentialMax}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[#1b2638] h-2 rounded-full overflow-hidden relative">
                <div 
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: `${(prospect.rating / 99) * 100}%` }}
                ></div>
                <div 
                  className="bg-[#00ff87]/30 h-full rounded-full absolute top-0"
                  style={{ 
                    left: `${(prospect.rating / 99) * 100}%`,
                    width: `${((prospect.potentialMax - prospect.rating) / 99) * 100}%`
                  }}
                ></div>
              </div>
            </div>

            {/* Attributes row */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#141d2c] px-2.5 py-1.5 rounded-lg border border-[#1e2a3f]">
                <span className="text-[10px] text-slate-400 block">Filigranas:</span>
                <span className="font-bold text-amber-400">{prospect.skills || '3★'}</span>
              </div>
              <div className="bg-[#141d2c] px-2.5 py-1.5 rounded-lg border border-[#1e2a3f]">
                <span className="text-[10px] text-slate-400 block">Pierna Mala:</span>
                <span className="font-bold text-amber-400">{prospect.weakFoot || '4★'}</span>
              </div>
            </div>

            {prospect.notes && (
              <p className="text-[11px] text-slate-400 italic line-clamp-2">
                "{prospect.notes}"
              </p>
            )}

            {/* Promote Action Button */}
            <button
              onClick={() => onPromoteYouth(prospect)}
              className="w-full py-2 px-3 rounded-xl bg-[#172336] hover:bg-[#00ff87] hover:text-[#090d14] text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-[#263753] group/btn"
            >
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400 group-hover/btn:text-[#090d14]" />
              <span>Promocionar al Primer Equipo</span>
            </button>

          </div>
        ))}

        {youthAcademy.length === 0 && (
          <div className="col-span-full text-center py-12 bg-[#101724] border border-[#1e2a3f] rounded-2xl p-6">
            <Sprout className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="font-bold text-white text-base mb-1">Academia sin canteranos</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
              Contrata ojeadores y añade las jóvenes promesas que descubras en tu modo carrera.
            </p>
            <button
              onClick={onOpenYouthModal}
              className="bg-[#00ff87] text-[#090d14] font-bold text-xs px-4 py-2 rounded-xl"
            >
              Añadir Primer Canterano
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
