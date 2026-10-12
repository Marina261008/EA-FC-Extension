import React, { useState } from 'react';
import { 
  Eye, 
  Users, 
  Shield, 
  Plus, 
  Calendar, 
  ArrowUp,
  Sparkles,
  Trophy,
  Send
} from 'lucide-react';
import ClubPostCard from '../Feed/ClubPostCard';

export default function PresentationTab({
  career,
  activeSeason,
  posts = [],
  onEditPost,
  onReactPost,
  onOpenNewPostModal,
  creatorProfile,
  onUpdateCreatorProfile
}) {
  const { manager } = career;

  // Calculate dynamic creator name and initials
  const creatorName = creatorProfile?.name || manager.name || 'Entrenador';
  const creatorInitials = creatorName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('') || 'FC';

  // Calculate clubs stats for table
  const matchesCount = activeSeason?.matches?.length || 0;
  const winsCount = activeSeason?.stats?.wins || 0;
  const drawsCount = activeSeason?.stats?.draws || 0;
  const lossesCount = activeSeason?.stats?.losses || 0;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start relative">
      
      {/* LEFT SIDEBAR matching user screenshot */}
      <div className="w-full lg:w-72 shrink-0 space-y-4">
        
        {/* Card 1: Perfil del creador */}
        <div className="bg-[#101724] border border-[#1e2a3f] rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-emerald-400 font-extrabold text-xs">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Perfil del creador</span>
            </div>
            {onUpdateCreatorProfile && (
              <button
                onClick={() => {
                  const newName = prompt('Editar nombre de perfil de creador:', creatorName);
                  if (newName && newName.trim()) {
                    onUpdateCreatorProfile({ name: newName.trim() });
                  }
                }}
                className="text-[11px] text-slate-400 hover:text-[#00ff87] font-semibold transition-colors flex items-center gap-1"
                title="Cambiar nombre de creador"
              >
                <span>Editar</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 pt-1">
            <div className="w-10 h-10 rounded-full bg-[#182335] border border-[#263750] flex items-center justify-center font-bold text-xs text-[#00ff87] shrink-0">
              {creatorInitials}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-extrabold text-white text-sm leading-tight truncate">
                {creatorName}
              </h3>
              <p className="text-[11px] text-slate-400">0 seguidores</p>
            </div>
          </div>

          <div className="pt-2 border-t border-[#182335] space-y-1.5 text-xs text-slate-400">
            <div className="flex items-center gap-1.5 text-[11px]">
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              <span>0 Visitas</span>
              <span className="text-[10px] text-slate-500">· Solo las ves tú hasta llegar a 100</span>
            </div>
            <p className="text-[10px] text-slate-500">
              Última actualización: {manager.currentDate || '12 oct 2026'}
            </p>
          </div>
        </div>

        {/* Card 2: Temporada en curso */}
        <div className="bg-[#101724] border border-[#1e2a3f] rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs">
              <Calendar className="w-4 h-4" />
              <span>Temporada en curso</span>
            </div>
            <span className="text-xs text-slate-400 font-bold">{activeSeason.period}</span>
          </div>

          <div className="flex items-center gap-2.5 pt-1 pb-2 border-b border-[#182335]">
            <img
              src={manager.clubLogo}
              alt=""
              className="w-5 h-5 object-contain"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <span className="font-extrabold text-white text-xs">{manager.club}</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-[11px] font-medium">{manager.league}</span>
              <span className="font-bold text-white">{activeSeason.stats?.position || '—'}</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-[11px] font-medium">Copa de España</span>
              <span className="font-bold text-white">—</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-[11px] font-medium">Supercopa</span>
              <span className="font-bold text-white">—</span>
            </div>
          </div>
        </div>

        {/* Card 3: Clubes */}
        <div className="bg-[#101724] border border-[#1e2a3f] rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs">
            <Shield className="w-4 h-4" />
            <span>Clubes</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[10px] text-slate-400 border-b border-[#182335]">
                  <th className="pb-1.5 font-semibold">Equipo</th>
                  <th className="pb-1.5 font-semibold text-center">PJ</th>
                  <th className="pb-1.5 font-semibold text-center">V</th>
                  <th className="pb-1.5 font-semibold text-center">E</th>
                  <th className="pb-1.5 font-semibold text-center">D</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 flex items-center gap-1.5">
                    <img
                      src={manager.clubLogo}
                      alt=""
                      className="w-4 h-4 object-contain"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <div>
                      <p className="font-bold text-white text-[11px] leading-tight">{manager.club}</p>
                      <span className="text-[9px] text-slate-500">2025-</span>
                    </div>
                  </td>
                  <td className="py-2 text-center font-bold text-white">{matchesCount}</td>
                  <td className="py-2 text-center font-bold text-emerald-400">{winsCount}</td>
                  <td className="py-2 text-center font-bold text-amber-400">{drawsCount}</td>
                  <td className="py-2 text-center font-bold text-red-400">{lossesCount}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* RIGHT MAIN FEED: Social announcements & official communications */}
      <div className="flex-1 min-w-0 space-y-5">
        
        {/* Feed Header & Compose Button */}
        <div className="flex items-center justify-between bg-[#101724] border border-[#1e2a3f] px-5 py-3 rounded-2xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00ff87] animate-pulse"></span>
            <span className="font-extrabold text-white text-sm font-display tracking-wide">
              Canal Oficial de Noticias & Comunicados
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenNewPostModal}
              className="flex items-center gap-1.5 bg-[#00ff87] hover:bg-[#00e676] text-[#090d14] font-black text-xs px-3.5 py-1.5 rounded-xl shadow-md shadow-[#00ff87]/20 transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>📋 Publicar 11 Inicial</span>
            </button>
            <button
              onClick={onOpenNewPostModal}
              className="hidden sm:flex items-center gap-1.5 bg-[#172336] hover:bg-[#202e47] text-slate-200 font-bold text-xs px-3 py-1.5 rounded-xl border border-[#263753] transition-all"
            >
              <span>📢 Comunicado</span>
            </button>
          </div>
        </div>

        {/* Posts List */}
        <div className="space-y-5">
          {posts.map((post) => (
            <ClubPostCard
              key={post.id}
              post={post}
              clubLogo={manager.clubLogo}
              onEditPost={onEditPost}
              onReactPost={onReactPost}
            />
          ))}

          {posts.length === 0 && (
            <div className="text-center py-12 bg-[#101724] border border-[#1e2a3f] rounded-2xl p-6">
              <Sparkles className="w-10 h-10 text-slate-500 mx-auto mb-3" />
              <h3 className="font-bold text-white text-base">Sin comunicados aún</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto mb-4">
                Cada fichaje, venta, partido o debut de cantera generará automáticamente una publicación oficial del club aquí.
              </p>
              <button
                onClick={onOpenNewPostModal}
                className="bg-[#00ff87] text-[#090d14] font-bold text-xs px-4 py-2 rounded-xl"
              >
                Crear Primer Comunicado
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Floating Action Button (matching bottom-right green button in screenshot) */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#00ff87] hover:bg-[#00e676] active:scale-95 text-[#090d14] flex items-center justify-center shadow-2xl shadow-[#00ff87]/30 z-30 transition-all hover:scale-110"
        title="Volver arriba / Nuevo comunicado"
      >
        <ArrowUp className="w-5 h-5 stroke-[2.5]" />
      </button>

    </div>
  );
}
