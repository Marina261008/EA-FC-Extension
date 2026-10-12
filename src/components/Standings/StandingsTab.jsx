import React, { useState } from 'react';
import { Trophy, RefreshCw, Plus, Edit2, Check, Shield } from 'lucide-react';
import { getClubLogo } from '../../clubsData';

export default function StandingsTab({
  season,
  clubName,
  onUpdateStandings,
  onRecalculateFromMatches,
  onCelebrateTitle
}) {
  const standings = season.standings || [];
  const [editingPos, setEditingPos] = useState(null);
  const [editForm, setEditForm] = useState({});

  const startEdit = (team) => {
    setEditingPos(team.pos);
    setEditForm({ ...team });
  };

  const saveEdit = () => {
    const updated = standings.map(t => {
      if (t.pos === editingPos) {
        const pj = Number(editForm.pj);
        const v = Number(editForm.v);
        const e = Number(editForm.e);
        const d = Number(editForm.d);
        const gf = Number(editForm.gf);
        const gc = Number(editForm.gc);
        const dg = gf - gc;
        const pts = (v * 3) + e;
        return {
          ...t,
          team: editForm.team,
          pj,
          v,
          e,
          d,
          gf,
          gc,
          dg,
          pts
        };
      }
      return t;
    });

    // Sort by points, then goal difference
    updated.sort((a, b) => b.pts - a.pts || b.dg - a.dg);
    // Re-assign pos
    const reindexed = updated.map((t, idx) => ({ ...t, pos: idx + 1 }));

    onUpdateStandings(reindexed);
    setEditingPos(null);
  };

  const getZoneIndicator = (pos) => {
    if (pos <= 4) return { color: 'bg-blue-500', label: 'UEFA Champions League' };
    if (pos === 5) return { color: 'bg-orange-500', label: 'UEFA Europa League' };
    if (pos === 6) return { color: 'bg-emerald-500', label: 'UEFA Conference League' };
    if (pos >= 18) return { color: 'bg-red-500', label: 'Descenso' };
    return null;
  };

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#101724] border border-[#1e2a3f] p-4 rounded-2xl">
        <div>
          <h2 className="text-lg font-black text-white font-display flex items-center gap-2">
            <span>Clasificación de la Liga</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#172235] text-emerald-400 font-semibold border border-emerald-500/20">
              LALIGA EA SPORTS
            </span>
          </h2>
          <p className="text-xs text-slate-400">Tabla de posiciones oficial de tu modo carrera</p>
        </div>

        <div className="flex items-center gap-2">
          {onCelebrateTitle && (
            <button
              onClick={() => onCelebrateTitle(season.competition || 'LALIGA EA SPORTS')}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-black font-black text-xs px-3.5 py-2 rounded-xl shadow-lg shadow-amber-500/20 transition-all cursor-pointer hover:scale-105 active:scale-95"
              title="Publicar celebración oficial de Campeón con trofeo y foto del equipo en el tablero"
            >
              <Trophy className="w-3.5 h-3.5 text-black stroke-[2.5]" />
              <span>¡Celebrar Título / Alirón!</span>
            </button>
          )}

          <button
            onClick={onRecalculateFromMatches}
            className="flex items-center gap-1.5 bg-[#172235] hover:bg-[#202e47] border border-[#273852] text-emerald-400 font-bold text-xs px-3.5 py-2 rounded-xl transition-all"
            title="Sincronizar puntos de tu club con los partidos registrados"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sincronizar Partidos</span>
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 bg-[#0e1420] p-3 rounded-xl border border-[#1b2639]">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
          <span>Champions League (1º - 4º)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
          <span>Europa League (5º)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>Conference League (6º)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
          <span>Descenso (18º - 20º)</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#101724] border border-[#1e2a3f] rounded-2xl p-4 sm:p-5 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[11px] text-slate-400 border-b border-[#182335]">
                <th className="pb-2.5 font-medium text-center w-10">Pos</th>
                <th className="pb-2.5 font-medium">Club</th>
                <th className="pb-2.5 font-medium text-center">PJ</th>
                <th className="pb-2.5 font-medium text-center">V</th>
                <th className="pb-2.5 font-medium text-center">E</th>
                <th className="pb-2.5 font-medium text-center">D</th>
                <th className="pb-2.5 font-medium text-center">GF</th>
                <th className="pb-2.5 font-medium text-center">GC</th>
                <th className="pb-2.5 font-medium text-center">DG</th>
                <th className="pb-2.5 font-medium text-center font-bold text-white">PTS</th>
                <th className="pb-2.5 font-medium text-right w-16">Editar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#162030]">
              {standings.map((row) => {
                const zone = getZoneIndicator(row.pos);
                const isUser = row.isUser || row.team.toLowerCase() === clubName.toLowerCase();
                const isEditing = editingPos === row.pos;

                return (
                  <tr
                    key={row.pos}
                    className={`transition-colors ${
                      isUser
                        ? 'bg-[#00ff87]/10 hover:bg-[#00ff87]/15 font-semibold text-white'
                        : 'hover:bg-[#141d2d]/80 text-slate-300'
                    }`}
                  >
                    {/* Pos */}
                    <td className="py-2 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {zone && <span className={`w-1 h-3.5 rounded-full ${zone.color}`}></span>}
                        <span className={`font-black ${isUser ? 'text-[#00ff87]' : 'text-slate-400'}`}>
                          {row.pos}
                        </span>
                      </div>
                    </td>

                    {/* Team */}
                    <td className="py-2 font-bold">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.team}
                          onChange={(e) => setEditForm({ ...editForm, team: e.target.value })}
                          className="bg-[#1b2639] border border-[#293c59] rounded px-1.5 py-0.5 text-xs text-white"
                        />
                      ) : (
                        <div className="flex items-center gap-2.5">
                          <img 
                            src={row.logo || getClubLogo(row.team)} 
                            alt={row.team} 
                            className="w-5 h-5 object-contain shrink-0" 
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                          <span className={isUser ? 'text-[#00ff87]' : 'text-white'}>
                            {row.team}
                          </span>
                          {isUser && (
                            <span className="text-[10px] bg-[#00ff87] text-[#090d14] px-1.5 py-0.2 rounded font-extrabold">
                              TU CLUB
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* PJ */}
                    <td className="py-2 text-center text-slate-400">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editForm.pj}
                          onChange={(e) => setEditForm({ ...editForm, pj: e.target.value })}
                          className="w-10 bg-[#1b2639] border border-[#293c59] rounded text-center text-xs text-white"
                        />
                      ) : row.pj}
                    </td>

                    {/* V */}
                    <td className="py-2 text-center">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editForm.v}
                          onChange={(e) => setEditForm({ ...editForm, v: e.target.value })}
                          className="w-10 bg-[#1b2639] border border-[#293c59] rounded text-center text-xs text-white"
                        />
                      ) : row.v}
                    </td>

                    {/* E */}
                    <td className="py-2 text-center">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editForm.e}
                          onChange={(e) => setEditForm({ ...editForm, e: e.target.value })}
                          className="w-10 bg-[#1b2639] border border-[#293c59] rounded text-center text-xs text-white"
                        />
                      ) : row.e}
                    </td>

                    {/* D */}
                    <td className="py-2 text-center">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editForm.d}
                          onChange={(e) => setEditForm({ ...editForm, d: e.target.value })}
                          className="w-10 bg-[#1b2639] border border-[#293c59] rounded text-center text-xs text-white"
                        />
                      ) : row.d}
                    </td>

                    {/* GF */}
                    <td className="py-2 text-center text-slate-400">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editForm.gf}
                          onChange={(e) => setEditForm({ ...editForm, gf: e.target.value })}
                          className="w-10 bg-[#1b2639] border border-[#293c59] rounded text-center text-xs text-white"
                        />
                      ) : row.gf}
                    </td>

                    {/* GC */}
                    <td className="py-2 text-center text-slate-400">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editForm.gc}
                          onChange={(e) => setEditForm({ ...editForm, gc: e.target.value })}
                          className="w-10 bg-[#1b2639] border border-[#293c59] rounded text-center text-xs text-white"
                        />
                      ) : row.gc}
                    </td>

                    {/* DG */}
                    <td className="py-2 text-center font-semibold">
                      <span className={row.dg > 0 ? 'text-emerald-400' : row.dg < 0 ? 'text-red-400' : 'text-slate-400'}>
                        {row.dg > 0 ? `+${row.dg}` : row.dg}
                      </span>
                    </td>

                    {/* PTS */}
                    <td className="py-2 text-center font-black text-sm">
                      <span className={isUser ? 'text-[#00ff87]' : 'text-white'}>
                        {row.pts}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-2 text-right">
                      {isEditing ? (
                        <button
                          onClick={saveEdit}
                          className="p-1 rounded bg-[#00ff87] text-[#090d14] font-bold"
                          title="Guardar"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => startEdit(row)}
                          className="p-1 text-slate-500 hover:text-white rounded"
                          title="Modificar estadísticas"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
