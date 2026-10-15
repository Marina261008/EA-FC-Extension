import React, { useState } from 'react';
import { 
  Plus, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Trash2, 
  DollarSign, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Layers 
} from 'lucide-react';
import { getClubLogo } from '../../clubsData';

export default function TransfersTab({
  season,
  onOpenTransferModal,
  onDeleteTransfer
}) {
  const [activeTab, setActiveTab] = useState('in'); // 'in' | 'out'
  const [search, setSearch] = useState('');

  const transfersIn = season.transfersIn || [];
  const transfersOut = season.transfersOut || [];

  const totalSpent = transfersIn.reduce((acc, curr) => acc + (curr.costNumber || 0), 0);
  const totalEarned = transfersOut.reduce((acc, curr) => acc + (curr.costNumber || 0), 0);
  const netBalance = totalEarned - totalSpent;

  const currentList = activeTab === 'in' ? transfersIn : transfersOut;
  const filteredList = currentList.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.position.toLowerCase().includes(search.toLowerCase())
  );

  const formatMoney = (amount) => {
    return (amount / 1000000).toFixed(1) + ' M €';
  };

  const getRatingBadgeClass = (rating) => {
    if (rating >= 80) return 'bg-[#033b24] text-[#00ff87] border-[#00ff87]/40';
    if (rating >= 75) return 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30';
    return 'bg-amber-950/60 text-amber-300 border-amber-500/30';
  };

  return (
    <div className="space-y-6">
      
      {/* Financial Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Gastado */}
        <div className="bg-[#101724] border border-[#1e2a3f] rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Total Gastado (Altas)
            </p>
            <div className="text-2xl font-black text-white font-display">
              {formatMoney(totalSpent)}
            </div>
            <p className="text-[10px] text-slate-500 mt-1 font-medium">{transfersIn.length} incorporaciones</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-[#00ff87] flex items-center justify-center">
            <ArrowDownLeft className="w-5 h-5" />
          </div>
        </div>

        {/* Total Ingresado */}
        <div className="bg-[#101724] border border-[#1e2a3f] rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Total Ingresado (Bajas)
            </p>
            <div className="text-2xl font-black text-white font-display">
              {formatMoney(totalEarned)}
            </div>
            <p className="text-[10px] text-slate-500 mt-1 font-medium">{transfersOut.length} salidas</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>

        {/* Balance Neto */}
        <div className="bg-[#101724] border border-[#1e2a3f] rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Balance Neto
            </p>
            <div className={`text-2xl font-black font-display ${netBalance >= 0 ? 'text-[#00ff87]' : 'text-red-400'}`}>
              {netBalance >= 0 ? `+${formatMoney(netBalance)}` : `-${formatMoney(Math.abs(netBalance))}`}
            </div>
            <p className="text-[10px] text-slate-500 mt-1 font-medium">Gasto neto en traspasos</p>
          </div>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            netBalance >= 0 ? 'bg-emerald-500/20 text-[#00ff87]' : 'bg-red-500/20 text-red-400'
          }`}>
            {netBalance >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-[#101724] border border-[#1e2a3f] rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        
        {/* Subtabs & Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#182335]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('in')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'in'
                  ? 'bg-[#00ff87] text-[#090d14]'
                  : 'bg-[#151f30] text-slate-400 hover:text-white'
              }`}
            >
              <ArrowDownLeft className="w-3.5 h-3.5" />
              <span>Altas / Fichajes ({transfersIn.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('out')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'out'
                  ? 'bg-amber-500 text-white'
                  : 'bg-[#151f30] text-slate-400 hover:text-white'
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Bajas / Ventas ({transfersOut.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative min-w-[180px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar fichaje..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#151f30] border border-[#23334d] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00ff87]"
              />
            </div>

            <button
              onClick={() => onOpenTransferModal(activeTab)}
              className="flex items-center gap-1 bg-[#00ff87] hover:bg-[#00e676] text-[#090d14] font-bold text-xs px-3.5 py-1.5 rounded-xl shadow transition-all shrink-0"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{activeTab === 'in' ? 'Añadir Fichaje' : 'Añadir Venta'}</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[11px] text-slate-400 border-b border-[#182335]">
                <th className="pb-2.5 font-medium">Jugador/Posición</th>
                <th className="pb-2.5 font-medium text-center">Edad</th>
                <th className="pb-2.5 font-medium text-center">País</th>
                <th className="pb-2.5 font-medium text-center">Media</th>
                <th className="pb-2.5 font-medium text-center">
                  {activeTab === 'in' ? 'Club Procedencia' : 'Club Destino'}
                </th>
                <th className="pb-2.5 font-medium text-right">Coste / Precio</th>
                <th className="pb-2.5 font-medium text-right">
                  {activeTab === 'in' ? 'Salario Acordado' : 'Salario Ahorrado'}
                </th>
                <th className="pb-2.5 font-medium text-center">Fecha</th>
                <th className="pb-2.5 font-medium text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#162030]">
              {filteredList.map((player) => (
                <tr key={player.id} className="hover:bg-[#141d2d]/80 transition-colors group">
                  <td className="py-2.5 pr-2">
                    <div className="flex items-center gap-2.5">
                      {player.photo ? (
                        <img 
                          src={player.photo} 
                          alt={player.name} 
                          className="w-8 h-8 rounded-full object-cover border border-[#25354e] shrink-0 shadow bg-[#151f30]" 
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#172235] border border-[#25354e] flex items-center justify-center font-bold text-slate-300 text-[10px] shrink-0">
                          {player.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-white leading-tight">{player.name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`text-[10px] font-bold px-1 rounded ${
                            activeTab === 'in' ? 'text-emerald-400 bg-emerald-950/60' : 'text-amber-400 bg-amber-950/60'
                          }`}>
                            {player.position}
                          </span>
                          {activeTab === 'in' && player.contract && (
                            <span className="text-[10px] text-amber-300 font-bold bg-amber-950/40 border border-amber-500/30 px-1.5 py-0.2 rounded">
                              Hasta {player.contract}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 text-center text-slate-300 font-medium">
                    {player.age}
                  </td>
                  <td className="py-2.5 text-center text-base" title={player.country}>
                    {player.flag || '🏳️'}
                  </td>
                  <td className="py-2.5 text-center">
                    <span className={`inline-block text-[11px] font-extrabold px-1.5 py-0.5 rounded border ${getRatingBadgeClass(player.rating)}`}>
                      {player.rating}
                    </span>
                  </td>
                  <td className="py-2.5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <img 
                        src={player.clubLogo || getClubLogo(activeTab === 'in' ? player.clubFrom : player.clubTo)} 
                        alt="" 
                        className="w-4 h-4 object-contain"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      <span className="font-medium text-slate-300">
                        {activeTab === 'in' ? player.clubFrom : player.clubTo}
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 text-right font-black text-white">
                    {player.cost}
                  </td>
                  <td className="py-2.5 text-right text-slate-400 font-medium">
                    {activeTab === 'in' ? player.wage : player.wageSaved}
                  </td>
                  <td className="py-2.5 text-center text-slate-400 font-medium">
                    {player.date || '—'}
                  </td>
                  <td className="py-2.5 text-right">
                    <button
                      onClick={() => onDeleteTransfer(player.id, activeTab)}
                      className="p-1 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Eliminar movimiento"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredList.length === 0 && (
                <tr>
                  <td colSpan="9" className="py-8 text-center text-slate-500">
                    No se encontraron movimientos en esta sección.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
