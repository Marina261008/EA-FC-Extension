import React, { useState } from 'react';
import { 
  Plus, 
  Play, 
  Edit3, 
  Trash2, 
  Shield, 
  Clock, 
  User, 
  Trophy, 
  Sparkles, 
  ChevronRight,
  Database,
  Calendar,
  AlertTriangle,
  Flame,
  Search
} from 'lucide-react';
import { formatCareerDate } from '../../storage';

export default function CareerSelectorHub({
  careers = [],
  activeCareerId,
  onSelectCareer,
  onNewCareer,
  onEditCareer,
  onDeleteCareer,
  onOpenDatabase,
  creatorProfile
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [careerToDelete, setCareerToDelete] = useState(null);

  // Filter careers if search is typed
  const filteredCareers = careers.filter(c => {
    const q = searchTerm.toLowerCase();
    const club = c.manager?.club?.toLowerCase() || '';
    const manager = c.manager?.name?.toLowerCase() || '';
    const league = c.manager?.league?.toLowerCase() || '';
    return club.includes(q) || manager.includes(q) || league.includes(q);
  });

  const handleConfirmDelete = () => {
    if (careerToDelete) {
      onDeleteCareer(careerToDelete.id);
      setCareerToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-white flex flex-col relative overflow-x-hidden selection:bg-[#00ff87] selection:text-[#070b12]">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-[#00ff87]/10 via-[#00b4d8]/5 to-transparent blur-[140px]" />
        <div className="absolute bottom-10 -left-20 w-80 h-80 bg-[#00ff87]/5 rounded-full blur-[100px]" />
        <div className="absolute top-1/3 -right-20 w-80 h-80 bg-[#0077b6]/5 rounded-full blur-[100px]" />
      </div>

      {/* Top Bar / Navigation */}
      <header className="relative z-20 border-b border-[#162032] bg-[#090e18]/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#00ff87] to-[#00b4d8] flex items-center justify-center shadow-lg shadow-[#00ff87]/20">
              <span className="font-black text-[#070b12] text-lg tracking-tighter italic font-display">FC</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-white text-lg tracking-wider font-display">CAREER</span>
                <span className="bg-[#00ff87] text-[#070b12] font-black text-xs px-2 py-0.5 rounded tracking-wider">HUB</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Gestor de Modos Carrera</p>
            </div>
          </div>

          {/* Quick Actions in Header */}
          <div className="flex items-center gap-3">
            {onOpenDatabase && (
              <button
                onClick={onOpenDatabase}
                className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#121a28] hover:bg-[#1a2538] border border-[#202e45] text-xs font-semibold text-slate-300 hover:text-white transition-all shadow-sm"
              >
                <Database className="w-3.5 h-3.5 text-[#00ff87]" />
                <span>Base de Datos</span>
              </button>
            )}

            <button
              onClick={onNewCareer}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#00ff87] to-[#00dfa2] text-[#070b12] text-xs font-black tracking-wide shadow-lg shadow-[#00ff87]/25 hover:shadow-[#00ff87]/40 hover:scale-105 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Nuevo Modo Carrera</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-6 py-8 sm:py-12 flex flex-col">
        
        {/* Title & Subtitle */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#00ff87] uppercase tracking-widest mb-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Panel Principal de Partidas</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight font-display">
              Tus Modos Carrera
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Selecciona uno de tus proyectos deportivos para continuar gestionando tácticas, plantilla y fichajes, o añade uno nuevo.
            </p>
          </div>

          {/* Search Box if user has multiple careers */}
          {careers.length > 2 && (
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar club o mánager..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#101724] border border-[#1f2c42] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00ff87] transition-colors"
              />
            </div>
          )}
        </div>

        {/* Square Cards Grid ("como cuadraditos, hazlo visual con hover") */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          
          {/* ======================================================== */}
          {/* CARD 1: + AÑADIR NUEVO MODO CARRERA */}
          {/* ======================================================== */}
          <div
            onClick={onNewCareer}
            className="group relative flex flex-col items-center justify-center text-center p-8 rounded-3xl border-2 border-dashed border-[#1f2d44] hover:border-[#00ff87] bg-gradient-to-b from-[#0f1725]/40 to-[#090f1a]/60 hover:from-[#00ff87]/5 hover:to-[#00b4d8]/5 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,255,135,0.25)] min-h-[340px]"
          >
            {/* Glowing circle with Plus */}
            <div className="relative mb-5">
              <div className="absolute -inset-3 bg-[#00ff87]/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative w-16 h-16 rounded-2xl bg-[#141e2e] group-hover:bg-[#00ff87] border border-[#23334c] group-hover:border-[#00ff87] flex items-center justify-center transition-all duration-300 group-hover:rotate-90 group-hover:scale-110 shadow-lg">
                <Plus className="w-8 h-8 text-[#00ff87] group-hover:text-[#070b12] stroke-[2.5] transition-colors" />
              </div>
            </div>

            <h3 className="text-lg font-black text-white group-hover:text-[#00ff87] uppercase tracking-wide font-display transition-colors">
              Nuevo Modo Carrera
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed max-w-[220px]">
              Elige entre los <span className="text-white font-semibold">133 clubes oficiales</span> o crea tu club personalizado desde cero.
            </p>

            <div className="mt-6 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#162235] group-hover:bg-[#00ff87]/20 border border-[#24354f] group-hover:border-[#00ff87]/40 text-[11px] font-bold text-slate-300 group-hover:text-[#00ff87] transition-all">
              <span>Crear Carrera</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* ======================================================== */}
          {/* CARDS 2..N: CARRERAS YA CREADAS */}
          {/* ======================================================== */}
          {filteredCareers.map((career) => {
            const isCurrentlyActive = career.id === activeCareerId;
            const clubName = career.manager?.club || 'Club Desconocido';
            const clubLogo = career.manager?.clubLogo;
            const managerName = career.manager?.name || 'Mánager';
            const managerNat = career.manager?.nationality || '🇪🇸 España';
            const managerAvatar = career.manager?.avatar;
            const league = career.manager?.league || 'LALIGA EA SPORTS';
            const gameVersion = career.gameVersion || 'EA FC26';
            const activeSeason = career.seasons?.[0];
            const squadCount = activeSeason?.squad?.length || 0;
            const formattedDate = formatCareerDate(career.updatedAt);

            return (
              <div
                key={career.id}
                className={`group relative flex flex-col justify-between rounded-3xl border transition-all duration-300 min-h-[340px] overflow-hidden ${
                  isCurrentlyActive
                    ? 'bg-gradient-to-b from-[#141f32] via-[#0e1624] to-[#090f18] border-[#00ff87]/60 shadow-[0_15px_35px_-10px_rgba(0,255,135,0.2)]'
                    : 'bg-gradient-to-b from-[#101826] to-[#090e17] border-[#1b263a] hover:border-[#00ff87]/80 hover:shadow-[0_20px_45px_-10px_rgba(0,255,135,0.25)]'
                } hover:-translate-y-2`}
              >
                {/* Background Watermark Crest */}
                {clubLogo && (
                  <div className="absolute -right-6 -bottom-6 w-44 h-44 opacity-5 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none select-none">
                    <img 
                      src={clubLogo} 
                      alt="" 
                      className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                )}

                {/* Animated top highlight bar on hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00ff87] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Card Header: Badges & Edit/Delete Actions */}
                <div className="p-5 pb-0 flex items-start justify-between gap-2 relative z-10">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {/* Game Version Badge */}
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#162338] text-slate-300 border border-[#25354e]">
                      {gameVersion}
                    </span>

                    {/* Active Pill */}
                    {isCurrentlyActive && (
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#00ff87]/15 text-[#00ff87] border border-[#00ff87]/30 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00ff87] animate-pulse" />
                        Activa
                      </span>
                    )}
                  </div>

                  {/* Card Action Icons: Modify & Delete */}
                  <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditCareer(career);
                      }}
                      className="p-1.5 rounded-lg bg-[#141e2e] hover:bg-[#00ff87]/20 border border-[#23334c] hover:border-[#00ff87]/40 text-slate-300 hover:text-[#00ff87] transition-all"
                      title="Modificar datos de la carrera"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCareerToDelete(career);
                      }}
                      className="p-1.5 rounded-lg bg-[#141e2e] hover:bg-rose-500/20 border border-[#23334c] hover:border-rose-500/40 text-slate-300 hover:text-rose-400 transition-all"
                      title="Eliminar este modo carrera"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Card Center: Crest, Team Name & Manager */}
                <div className="px-5 py-4 flex flex-col items-center text-center relative z-10 flex-1 justify-center">
                  
                  {/* Escudo del Equipo */}
                  <div className="relative mb-3.5 group-hover:scale-105 transition-transform duration-300">
                    <div className="absolute -inset-2 bg-gradient-to-tr from-[#00ff87]/20 to-[#00b4d8]/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative w-20 h-20 rounded-2xl bg-[#0c1320] border border-[#22314a] p-2 flex items-center justify-center shadow-lg">
                      {clubLogo ? (
                        <img 
                          src={clubLogo} 
                          alt={clubName} 
                          className="w-full h-full object-contain filter drop-shadow-md"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://crests.football-data.org/95.svg';
                          }}
                        />
                      ) : (
                        <Shield className="w-10 h-10 text-slate-500" />
                      )}
                    </div>
                  </div>

                  {/* Nombre del Equipo */}
                  <h2 className="text-xl font-black text-white group-hover:text-[#00ff87] uppercase tracking-wide font-display transition-colors line-clamp-1">
                    {clubName}
                  </h2>
                  <p className="text-[11px] font-medium text-slate-400 line-clamp-1 mt-0.5">
                    {league}
                  </p>

                  {/* Manager info */}
                  <div className="mt-3 flex items-center gap-2 bg-[#121a28] px-3 py-1.5 rounded-xl border border-[#1f2d44]">
                    {managerAvatar ? (
                      <img 
                        src={managerAvatar} 
                        alt="" 
                        className="w-5 h-5 rounded-full object-cover shrink-0 border border-white/10"
                      />
                    ) : (
                      <User className="w-3.5 h-3.5 text-[#00ff87]" />
                    )}
                    <span className="text-xs font-bold text-slate-200 truncate max-w-[140px]">
                      {managerName}
                    </span>
                    <span className="text-xs">{managerNat.split(' ')[0]}</span>
                  </div>
                </div>

                {/* Card Bottom: Last Updated & Primary "Acceder" Button */}
                <div className="p-5 pt-3 border-t border-[#182337] bg-[#0c121e]/60 relative z-10 flex flex-col gap-3">
                  
                  {/* Fecha de actualización */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-[#00ff87]" />
                      <span>Actualizado:</span>
                    </span>
                    <span className="text-slate-300 font-semibold truncate max-w-[130px]">
                      {formattedDate}
                    </span>
                  </div>

                  {/* Botón Principal: Acceder */}
                  <button
                    onClick={() => onSelectCareer(career.id)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-200 bg-gradient-to-r from-[#00ff87] to-[#00dfa2] text-[#070b12] hover:brightness-110 shadow-md shadow-[#00ff87]/20 group-hover:shadow-[#00ff87]/40 active:scale-[0.98]"
                  >
                    <Play className="w-3.5 h-3.5 fill-[#070b12]" />
                    <span>Acceder al Modo Carrera</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty Search Fallback */}
        {filteredCareers.length === 0 && (
          <div className="text-center py-16 bg-[#0f1726]/40 rounded-3xl border border-[#1d2a3f] mt-4">
            <Shield className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No se encontraron modos carrera</h3>
            <p className="text-xs text-slate-400 mt-1">Prueba con otro término de búsqueda o crea una nueva carrera.</p>
            <button
              onClick={onNewCareer}
              className="mt-4 px-4 py-2 rounded-xl bg-[#00ff87] text-[#070b12] font-black text-xs"
            >
              + Crear Nueva Carrera
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#141e2e] py-6 px-6 text-center text-xs text-slate-500">
        <p>EA Sports FC Career Hub • Todas tus partidas se guardan localmente en tu navegador de forma segura.</p>
      </footer>

      {/* ======================================================== */}
      {/* MODAL DE CONFIRMACIÓN PARA ELIMINAR CARRERA */}
      {/* ======================================================== */}
      {careerToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f1726] border border-[#22324b] rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 text-center">
            
            {/* Warning Icon & Crest */}
            <div className="relative w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <div className="absolute inset-0 bg-rose-500/20 rounded-full blur-xl" />
              <div className="relative w-16 h-16 rounded-2xl bg-[#141f33] border border-rose-500/40 p-2 flex items-center justify-center shadow-lg">
                {careerToDelete.manager?.clubLogo ? (
                  <img 
                    src={careerToDelete.manager?.clubLogo} 
                    alt="" 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <AlertTriangle className="w-8 h-8 text-rose-400" />
                )}
              </div>
            </div>

            <h3 className="text-xl font-black text-white uppercase tracking-wide font-display">
              ¿Eliminar este Modo Carrera?
            </h3>
            
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Estás a punto de borrar la carrera del{' '}
              <strong className="text-white font-bold">{careerToDelete.manager?.club}</strong> dirigida por{' '}
              <strong className="text-[#00ff87] font-bold">{careerToDelete.manager?.name}</strong>.
            </p>
            <p className="text-[11px] text-rose-400/90 mt-2 font-medium bg-rose-500/10 py-1.5 px-3 rounded-lg border border-rose-500/20">
              ⚠️ Esta acción es irreversible y se perderán todos los datos, partidos y fichajes de esta carrera.
            </p>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setCareerToDelete(null)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#162235] hover:bg-[#1e2d45] border border-[#25354e] text-xs font-bold text-slate-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black tracking-wider transition-colors shadow-lg shadow-rose-600/30"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
