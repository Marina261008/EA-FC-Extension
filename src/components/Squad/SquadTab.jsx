import React, { useState } from 'react';
import { 
  Plus, 
  Users, 
  Search, 
  LayoutList, 
  LayoutGrid, 
  Edit3, 
  Trash2, 
  Heart, 
  DollarSign, 
  TrendingUp,
  Award,
  Shield
} from 'lucide-react';
import PitchView from './PitchView';

export default function SquadTab({
  season,
  clubName,
  onOpenPlayerModal,
  onEditPlayer,
  onDeletePlayer,
  onResetToRealSquad
}) {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'pitch'

  const squad = season.squad || [];

  const categories = [
    { id: 'ALL', label: 'Todos' },
    { id: 'TITULAR', label: '⭐ Titulares (11)' },
    { id: 'SUPLENTE', label: '🔄 Suplentes (7)' },
    { id: 'RESERVA', label: '📋 Reservas' },
    { id: 'POR', label: 'Porteros' },
    { id: 'DEF', label: 'Defensas' },
    { id: 'MED', label: 'Medios' },
    { id: 'DEL', label: 'Delanteros' }
  ];

  const filteredSquad = squad.filter(player => {
    let matchesCategory = false;
    if (activeCategory === 'ALL') matchesCategory = true;
    else if (activeCategory === 'TITULAR') matchesCategory = player.status === 'Titular';
    else if (activeCategory === 'SUPLENTE') matchesCategory = player.status === 'Suplente';
    else if (activeCategory === 'RESERVA') matchesCategory = player.status === 'Reserva' || !['Titular', 'Suplente'].includes(player.status);
    else matchesCategory = player.category === activeCategory;

    const matchesSearch = player.name.toLowerCase().includes(search.toLowerCase()) ||
                          player.position.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getRatingBadgeClass = (rating) => {
    if (rating >= 82) return 'bg-[#033b24] text-[#00ff87] border-[#00ff87]/40';
    if (rating >= 78) return 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40';
    if (rating >= 74) return 'bg-sky-950/70 text-sky-300 border-sky-500/40';
    return 'bg-slate-800 text-slate-300 border-slate-700';
  };

  const renderStatusBadge = (status) => {
    if (status === 'Titular') {
      return (
        <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-[#00ff87]/20 text-[#00ff87] border border-[#00ff87]/30 uppercase tracking-wider inline-flex items-center gap-0.5">
          ⭐ Titular
        </span>
      );
    }
    if (status === 'Suplente') {
      return (
        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30 inline-flex items-center gap-0.5">
          🔄 Suplente
        </span>
      );
    }
    return (
      <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
        {status || 'Reserva'}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#101724] border border-[#1e2a3f] p-4 rounded-2xl">
        <div>
          <h2 className="text-lg font-black text-white font-display flex items-center gap-2">
            <span>Plantilla del Primer Equipo</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#172235] text-slate-400 font-medium">
              {squad.length} jugadores
            </span>
          </h2>
          <p className="text-xs text-slate-400">Valores de mercado, contratos, estadísticas de la temporada y media</p>
        </div>

        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="flex items-center bg-[#151f30] p-1 rounded-xl border border-[#23334d]">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'table' ? 'bg-[#00ff87] text-[#090d14]' : 'text-slate-400 hover:text-white'
              }`}
              title="Vista Lista / Tabla"
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('pitch')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'pitch' ? 'bg-[#00ff87] text-[#090d14]' : 'text-slate-400 hover:text-white'
              }`}
              title="Vista Táctica / Campo"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          {onResetToRealSquad && (
            <button
              onClick={onResetToRealSquad}
              className="flex items-center gap-1.5 bg-[#141f30] hover:bg-[#1a2940] text-slate-200 border border-[#23354f] hover:border-[#00ff87]/50 font-bold text-xs px-3 py-2 rounded-xl transition-all shrink-0 cursor-pointer"
              title="Restaurar a la alineación titular y plantilla oficial de EA FC"
            >
              <Shield className="w-3.5 h-3.5 text-[#00ff87]" />
              <span className="hidden sm:inline">Plantilla Oficial</span>
            </button>
          )}

          <button
            onClick={() => onOpenPlayerModal()}
            className="flex items-center gap-1.5 bg-[#00ff87] hover:bg-[#00e676] text-[#090d14] font-bold text-xs px-3.5 py-2 rounded-xl shadow-lg shadow-[#00ff87]/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Añadir Jugador</span>
          </button>
        </div>
      </div>

      {viewMode === 'pitch' ? (
        <PitchView squad={squad} />
      ) : (
        <div className="bg-[#101724] border border-[#1e2a3f] rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#182335]">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveCategory(c.id)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all ${
                    activeCategory === c.id
                      ? 'bg-[#1b2639] text-[#00ff87] border border-[#2b3c59]'
                      : 'text-slate-400 hover:text-white hover:bg-[#151f30]'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar jugador..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#151f30] border border-[#23334d] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00ff87]"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[11px] text-slate-400 border-b border-[#182335]">
                  <th className="pb-2.5 font-medium">#</th>
                  <th className="pb-2.5 font-medium">Jugador</th>
                  <th className="pb-2.5 font-medium text-center">Pos</th>
                  <th className="pb-2.5 font-medium text-center">Edad</th>
                  <th className="pb-2.5 font-medium text-center">País</th>
                  <th className="pb-2.5 font-medium text-center">Media / Pot</th>
                  <th className="pb-2.5 font-medium text-center">PJ</th>
                  <th className="pb-2.5 font-medium text-center">Goles</th>
                  <th className="pb-2.5 font-medium text-center">Asist</th>
                  <th className="pb-2.5 font-medium text-right">Valor</th>
                  <th className="pb-2.5 font-medium text-right">Salario</th>
                  <th className="pb-2.5 font-medium text-center">Contrato</th>
                  <th className="pb-2.5 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#162030]">
                {filteredSquad.map((player) => (
                  <tr key={player.id} className="hover:bg-[#141d2d]/80 transition-colors group">
                    <td className="py-2.5 font-bold text-slate-500">
                      {player.number}
                    </td>
                    <td className="py-2.5 pr-2">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={player.photo || "./default_player.svg"} 
                          alt={player.name} 
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-full object-cover object-top border border-[#273752] shrink-0 shadow bg-[#151f30]" 
                          onError={(e) => { 
                            e.target.onerror = null;
                            e.target.src = "./default_player.svg"; 
                          }}
                        />
                        <div>
                          <p className="font-bold text-white leading-tight">{player.name}</p>
                          <div className="mt-0.5">
                            {renderStatusBadge(player.status)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 text-center">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#172336] text-emerald-400 border border-emerald-500/20">
                        {player.position}
                      </span>
                    </td>
                    <td className="py-2.5 text-center text-slate-300 font-medium">
                      {player.age}
                    </td>
                    <td className="py-2.5 text-center text-base" title={player.country}>
                      {player.flag || '🏳️'}
                    </td>
                    <td className="py-2.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className={`text-[11px] font-black px-1.5 py-0.5 rounded border ${getRatingBadgeClass(player.rating)}`}>
                          {player.rating}
                        </span>
                        <span className="text-[10px] text-sky-400 font-semibold">
                          ({player.potential})
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 text-center font-semibold text-slate-300">
                      {player.matches}
                    </td>
                    <td className="py-2.5 text-center font-bold text-emerald-400">
                      {player.goals}
                    </td>
                    <td className="py-2.5 text-center font-bold text-sky-400">
                      {player.assists}
                    </td>
                    <td className="py-2.5 text-right font-bold text-white">
                      {player.value}
                    </td>
                    <td className="py-2.5 text-right text-slate-400 font-medium">
                      {player.wage}
                    </td>
                    <td className="py-2.5 text-center text-slate-400 font-medium">
                      {player.contract}
                    </td>
                    <td className="py-2.5 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEditPlayer(player)}
                          className="p-1 text-slate-400 hover:text-white rounded"
                          title="Editar"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeletePlayer(player.id)}
                          className="p-1 text-slate-400 hover:text-red-400 rounded"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredSquad.length === 0 && (
                  <tr>
                    <td colSpan="13" className="py-8 text-center text-slate-500">
                      No se encontraron jugadores que coincidan con la búsqueda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
