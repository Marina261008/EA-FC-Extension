import React from 'react';
import { Share2, Download, Copy, Check, Sparkles, Trophy } from 'lucide-react';
import { exportCareersAsJSON } from '../../storage';

export default function CommunityTab({ career, activeSeason, careers }) {
  const [copied, setCopied] = React.useState(false);
  const { manager, gameVersion } = career;

  const copyCareerCard = () => {
    const text = `🎮 Mi Modo Carrera en ${gameVersion}:
👤 Entrenador: ${manager.name}
🛡️ Club: ${manager.club} (${manager.league})
📅 Temporada: ${activeSeason.period}
🏆 Posición: ${activeSeason.stats?.position || '7º'} (${activeSeason.stats?.points || 6} pts)
🔥 Fichaje Estrella: ${activeSeason.transfersIn[0]?.name || 'Andrei Rațiu'} (${activeSeason.transfersIn[0]?.cost || '24,6 M €'})
⚽ Máximo Goleador: ${activeSeason.squad?.sort((a,b)=>b.goals-a.goals)[0]?.name || 'Hugo Duro'} (${activeSeason.squad?.sort((a,b)=>b.goals-a.goals)[0]?.goals || 2} goles)
Registrado con FC Career Hub`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="bg-[#101724] border border-[#1e2a3f] p-6 rounded-3xl shadow-lg text-center space-y-2">
        <span className="text-xs font-bold text-[#00ff87] bg-[#033b24] px-3 py-1 rounded-full border border-[#00ff87]/30">
          Comunidad & Tarjeta Compartible
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-white font-display">
          Comparte tu Modo Carrera
        </h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Genera tu tarjeta de presentación o exporta tu archivo de guardado para compartirlo en Reddit, Discord o Twitter/X.
        </p>
      </div>

      {/* Shareable Card Preview */}
      <div className="bg-gradient-to-br from-[#121b2b] via-[#0d1421] to-[#142033] border-2 border-[#00ff87]/50 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00ff87]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-between border-b border-[#1f2d44] pb-4">
            <div className="flex items-center gap-2.5">
              <span className="bg-[#00ff87] text-[#090d14] font-black text-xs px-2 py-0.5 rounded tracking-wider">
                FC TOOLS HUB
              </span>
              <span className="text-xs font-bold text-slate-300">{gameVersion} CAREER</span>
            </div>
            <span className="text-xs text-[#00ff87] font-semibold">{activeSeason.period}</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#00ff87] shadow-xl shrink-0">
              <img src={manager.avatar} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="text-center sm:text-left space-y-1">
              <h3 className="text-2xl font-black text-white font-display">{manager.name}</h3>
              <p className="text-xs text-slate-300 flex items-center justify-center sm:justify-start gap-1.5 font-medium">
                <span>{manager.club}</span>
                <span>•</span>
                <span>{manager.league}</span>
                <span>•</span>
                <span>{manager.nationality}</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#0b1019]/80 border border-[#1d2b40] p-3 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Posición</span>
              <span className="text-xl font-black text-white font-display">{activeSeason.stats?.position || '7º'}</span>
            </div>
            <div className="bg-[#0b1019]/80 border border-[#1d2b40] p-3 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Puntos</span>
              <span className="text-xl font-black text-[#00ff87] font-display">{activeSeason.stats?.points || 6} pts</span>
            </div>
            <div className="bg-[#0b1019]/80 border border-[#1d2b40] p-3 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Plantilla</span>
              <span className="text-xl font-black text-white font-display">{activeSeason.squad?.length || 0} jug.</span>
            </div>
            <div className="bg-[#0b1019]/80 border border-[#1d2b40] p-3 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Canteranos</span>
              <span className="text-xl font-black text-sky-400 font-display">{activeSeason.youthAcademy?.length || 0}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#1f2d44]">
            <p className="text-[11px] text-slate-400">
              🎮 Guarda y gestiona tus carreras de EA Sports FC 26 y 27
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={copyCareerCard}
                className="flex items-center gap-1.5 bg-[#192437] hover:bg-[#22314a] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#00ff87]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '¡Copiado!' : 'Copiar Texto'}</span>
              </button>
              <button
                onClick={() => exportCareersAsJSON(careers)}
                className="flex items-center gap-1.5 bg-[#00ff87] text-[#090d14] text-xs font-bold px-3.5 py-2 rounded-xl transition-transform hover:scale-105"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar Backup JSON</span>
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
