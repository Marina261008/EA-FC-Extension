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
  Shield,
  CheckCircle2,
  X,
  Sparkles,
  Calendar
} from 'lucide-react';
import PitchView from './PitchView';
import JerseyBackGraphic from '../Feed/JerseyBackGraphic';

export default function SquadTab({
  season,
  clubName = 'Mi Club',
  clubLogo = '',
  manager = {},
  onOpenPlayerModal,
  onEditPlayer,
  onDeletePlayer,
  onResetToRealSquad,
  onRenewPlayer
}) {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'pitch'
  const [playerToRenew, setPlayerToRenew] = useState(null);
  const [successToast, setSuccessToast] = useState('');

  const squad = season.squad || [];

  // Determine current career calendar year
  const dateStr = manager?.currentDate || season?.period || '2026';
  const match = dateStr.match(/\b(20\d\d)\b/);
  const currentYear = match ? parseInt(match[1], 10) : 2026;

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
      
      {/* Toast alert banner when contract is renewed */}
      {successToast && (
        <div className="bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 px-4 py-3 rounded-2xl flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-xs font-bold">{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast('')} className="text-emerald-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#101724] border border-[#1e2a3f] p-4 rounded-2xl">
        <div>
          <h2 className="text-lg font-black text-white font-display flex items-center gap-2">
            <span>Plantilla del Primer Equipo</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#172235] text-slate-400 font-medium">
              {squad.length} jugadores
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Años de contrato restantes, cláusulas de rescisión, medias de EA FC y renovaciones oficiales con camiseta
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="flex items-center bg-[#151f30] p-1 rounded-xl border border-[#23334d]">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'table' ? 'bg-[#00ff87] text-[#090d14]' : 'text-slate-400 hover:text-white'
              }`}
              title="Vista Lista / Tabla con Contratos"
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
                  <th className="pb-2.5 font-medium text-center">Contrato Restante</th>
                  <th className="pb-2.5 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#162030]">
                {filteredSquad.map((player) => {
                  const contractYear = parseInt(player.contract, 10) || (currentYear + 2);
                  const remainingYears = Math.max(0, contractYear - currentYear);

                  return (
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
                      
                      {/* CONTRACT REMAINING YEARS & QUICK RENEWAL BUTTON */}
                      <td className="py-2.5 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className={`text-[10px] px-2.5 py-0.5 rounded-full border whitespace-nowrap inline-flex items-center gap-1 font-bold ${
                            remainingYears <= 1
                              ? 'bg-red-500/20 text-red-300 border-red-500/40 font-black animate-pulse'
                              : remainingYears === 2
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          }`}>
                            {remainingYears <= 0 
                              ? '⚠️ Expira ya' 
                              : remainingYears === 1 
                              ? '⚠️ 1 año' 
                              : `🔒 ${remainingYears} años`} ({contractYear})
                          </span>
                          <button
                            onClick={() => setPlayerToRenew(player)}
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 hover:text-black bg-[#162030] hover:bg-gradient-to-r hover:from-amber-400 hover:to-yellow-300 border border-amber-500/30 hover:border-transparent px-2 py-0.5 rounded-md transition-all active:scale-95 shadow-sm"
                            title="Renovar contrato y publicar automáticamente en el Feed oficial con la camiseta"
                          >
                            <Award className="w-3 h-3 text-amber-400 stroke-[2.5]" />
                            <span>✍️ Renovar</span>
                          </button>
                        </div>
                      </td>

                      <td className="py-2.5 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onEditPlayer(player)}
                            className="p-1 text-slate-400 hover:text-white rounded"
                            title="Editar Jugador"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeletePlayer(player.id)}
                            className="p-1 text-slate-400 hover:text-red-400 rounded"
                            title="Eliminar Jugador"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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

      {/* QUICK RENEWAL MODAL */}
      {playerToRenew && (
        <QuickRenewalModal
          player={playerToRenew}
          clubName={clubName}
          clubLogo={clubLogo}
          managerName={manager?.name || 'Mánager'}
          currentYear={currentYear}
          currentDate={manager?.currentDate || '12 oct 2026'}
          onClose={() => setPlayerToRenew(null)}
          onConfirm={(renewalData) => {
            if (onRenewPlayer) {
              onRenewPlayer(playerToRenew, renewalData);
            }
            const name = playerToRenew.name;
            setPlayerToRenew(null);
            setSuccessToast(`¡Contrato de ${name} renovado hasta ${renewalData.renewalYear}! Comunicado oficial publicado en el Feed con la camiseta.`);
            setTimeout(() => setSuccessToast(''), 5000);
          }}
        />
      )}

    </div>
  );
}

// QUICK RENEWAL SUBCOMPONENT WITH LIVE JERSEY BACK PREVIEW
function QuickRenewalModal({
  player,
  clubName,
  clubLogo,
  managerName,
  currentYear,
  currentDate,
  onClose,
  onConfirm
}) {
  const currentContractYear = parseInt(player.contract, 10) || (currentYear + 2);
  const defaultNextYear = String(Math.max(currentYear + 3, currentContractYear + 2));

  const [renewalYear, setRenewalYear] = useState(defaultNextYear);
  const [wage, setWage] = useState(player.wage || '45.000 €/sem');
  
  // Calculate suggested buyout clause from value
  const numVal = parseFloat(String(player.value || '').replace(/[^0-9.]/g, '')) || 25;
  const defaultClause = player.clause || `${Math.round(numVal * 1.6)} M €`;
  const [clause, setClause] = useState(defaultClause);

  const [autoPost, setAutoPost] = useState(true);

  const availableYears = [
    String(currentYear + 1),
    String(currentYear + 2),
    String(currentYear + 3),
    String(currentYear + 4),
    String(currentYear + 5),
    String(currentYear + 6),
    String(currentYear + 7),
    String(currentYear + 8)
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm({
      renewalYear,
      wage,
      clause,
      autoPost
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#101724] border border-[#22314a] rounded-2xl max-w-3xl w-full p-5 sm:p-6 shadow-2xl relative animate-in fade-in zoom-in-95 my-6 max-h-[94vh] flex flex-col overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-[#162030] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#1c273a] shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 text-black flex items-center justify-center font-bold shadow-md shadow-amber-400/20">
            <Award className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white font-display flex items-center gap-2">
              <span>Renovar Contrato de {player.name}</span>
              <span className="text-xs bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded font-black">
                #{player.number || '10'} · {player.position}
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Modifica la duración del contrato y publica automáticamente el comunicado oficial con su camiseta de espalda
            </p>
          </div>
        </div>

        {/* Form and Live Preview Grid */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Left Column: Form Fields */}
            <div className="space-y-3.5 bg-[#0b1019] p-4 rounded-xl border border-[#1b273b]">
              <div>
                <label className="block text-slate-300 font-bold text-xs mb-1">
                  Ampliación de Contrato (Año de Vencimiento)
                </label>
                <select
                  value={renewalYear}
                  onChange={(e) => setRenewalYear(e.target.value)}
                  className="w-full bg-[#152132] border border-[#263750] rounded-xl px-3 py-2 text-amber-300 font-black text-sm focus:outline-none focus:border-amber-400"
                >
                  {availableYears.map((y) => {
                    const diff = Math.max(0, parseInt(y, 10) - currentYear);
                    return (
                      <option key={y} value={y}>
                        Hasta {y} ({diff} {diff === 1 ? 'año' : 'años'} de vinculación)
                      </option>
                    );
                  })}
                </select>
                <p className="text-[10px] text-slate-400 mt-1">
                  Contrato actual: <strong>{player.contract}</strong> ({Math.max(0, currentContractYear - currentYear)} años restantes)
                </p>
              </div>

              <div>
                <label className="block text-slate-300 font-bold text-xs mb-1">
                  Nuevo Salario Semanal
                </label>
                <input
                  type="text"
                  value={wage}
                  onChange={(e) => setWage(e.target.value)}
                  placeholder="Ej. 65.000 €/sem"
                  className="w-full bg-[#152132] border border-[#263750] rounded-xl px-3 py-2 text-white font-bold text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold text-xs mb-1">
                  Nueva Cláusula de Rescisión (Blindaje)
                </label>
                <input
                  type="text"
                  value={clause}
                  onChange={(e) => setClause(e.target.value)}
                  placeholder="Ej. 120.000.000 €"
                  className="w-full bg-[#152132] border border-[#263750] rounded-xl px-3 py-2 text-white font-bold text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Auto-publish toggle */}
              <div className="pt-2 border-t border-[#1d293d]">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={autoPost}
                    onChange={(e) => setAutoPost(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-slate-700 text-[#00ff87] focus:ring-0 focus:ring-offset-0 bg-[#162234]"
                  />
                  <div>
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Publicar automáticamente en el Feed Oficial</span>
                    </span>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                      Genera el post con la camiseta de espalda oficial de {clubName}, dorsal #{player.number || '10'} y comentarios realistas de la afición.
                    </p>
                  </div>
                </label>
              </div>

            </div>

            {/* Right Column: Live Jersey Preview */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Vista Previa: Camiseta Oficial de Espalda</span>
              </label>

              <div className="scale-95 origin-top">
                <JerseyBackGraphic
                  playerName={player.name}
                  playerNumber={player.number || 10}
                  clubName={clubName}
                  clubLogo={clubLogo}
                  renewalYear={renewalYear}
                  clause={clause}
                  playerPhoto={player.photo}
                  playerPosition={player.position}
                  playerRating={player.rating}
                  date={currentDate}
                />
              </div>
            </div>

          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1c273a]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-[#152132] hover:bg-[#1d2d44] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-amber-300 hover:to-yellow-200 text-black font-black text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-amber-400/25 transition-all active:scale-95"
            >
              <Award className="w-4 h-4 stroke-[2.5]" />
              <span>✍️👕 Confirmar Renovación y Publicar</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
