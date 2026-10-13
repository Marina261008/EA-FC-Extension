import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Edit3, 
  Heart, 
  MessageCircle, 
  Share2, 
  Smile, 
  Trophy, 
  Sparkles,
  Flame,
  ThumbsUp,
  User,
  Shield
} from 'lucide-react';
import StartingXIGraphic from './StartingXIGraphic';
import { getClubLogo } from '../../clubsData';

export default function ClubPostCard({
  post,
  clubLogo,
  onEditPost,
  onReactPost
}) {
  const [reacted, setReacted] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [reactionCounts, setReactionCounts] = useState(post.likes || 1200);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([
    { author: 'AficionadoChe', text: '¡Vamooos! Con todo a por los puestos europeos este año 💪🦇', time: '1h' },
    { author: 'Mestalla1919', text: 'Gran acierto, ilusionados con el proyecto.', time: '45m' }
  ]);
  const [newCommentText, setNewCommentText] = useState('');

  const handleToggleLike = () => {
    if (reacted) {
      setReactionCounts(reactionCounts - 1);
      setReacted(false);
    } else {
      setReactionCounts(reactionCounts + 1);
      setReacted(true);
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    setComments([
      ...comments,
      { author: 'Tú (Mánager)', text: newCommentText.trim(), time: 'Ahora' }
    ]);
    setNewCommentText('');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`${post.author.name}: ${post.text}`);
    alert('¡Publicación copiada al portapapeles!');
  };

  const { author, graphic } = post;

  // Resolve correct crest for author avatar and graphic badge:
  // For transfer_in (alta / fichaje), it must ALWAYS display the user's club crest
  const authorAvatar = (post.type === 'transfer_in' && clubLogo) 
    ? clubLogo 
    : (author.avatar || clubLogo);

  const graphicCrest = (post.type === 'transfer_in' && clubLogo)
    ? clubLogo
    : (graphic?.clubLogo || author.avatar || clubLogo);

  return (
    <article className="bg-[#101724] border border-[#1e2a3f] hover:border-[#283854] rounded-2xl p-5 shadow-sm space-y-4 transition-all">
      
      {/* 1. Header: Avatar + Club Name + Verified Badge + Handle + Date + [Editar] Button */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Club Avatar */}
          <div className="w-11 h-11 rounded-full bg-[#182335] border border-[#2b3c58] p-1.5 flex items-center justify-center shrink-0 shadow-inner">
            <img
              src={authorAvatar}
              alt={author.name}
              className="max-w-full max-h-full object-contain"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>

          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-extrabold text-white text-sm hover:underline cursor-pointer">
                {author.name}
              </span>
              {/* Verified badge matching screenshot */}
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#00ff87] text-[#090d14] text-[10px] font-black shrink-0">
                ✓
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {author.handle} · {post.date}
              </span>
            </div>
          </div>
        </div>

        {/* Green [Editar] Button matching screenshot */}
        <button
          onClick={() => onEditPost(post)}
          className="flex items-center gap-1.5 bg-[#00ff87] hover:bg-[#00e676] active:scale-95 text-[#090d14] font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-sm transition-all shrink-0"
        >
          <Edit3 className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Editar</span>
        </button>
      </div>

      {/* 2. Post Content Text */}
      <div className="text-sm text-slate-100 whitespace-pre-line leading-relaxed font-normal">
        {post.text}
      </div>

      {/* 3. Graphic Announcement Card matching the screenshot! */}
      {graphic && (
        post.type === 'lineup' || graphic?.isLineup ? (
          <StartingXIGraphic
            lineupData={graphic.lineupData || graphic}
            clubName={author.name || graphic.clubName}
            clubLogo={graphic.clubLogo || author.avatar || clubLogo}
            managerName={graphic.managerName || "Mánager"}
          />
        ) : (
        <div className="relative rounded-2xl overflow-hidden border border-[#273852] shadow-2xl bg-gradient-to-br from-[#1b1a13] via-[#10141d] to-[#121926]">
          
          {/* Subtle glowing ambient background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-600/15 via-transparent to-transparent pointer-events-none"></div>

          {/* Top Tag Pill matching screenshot (e.g. 👤 Nuevo entrenador) */}
          {/* Top Tag Pill matching screenshot (e.g. 👤 Nuevo entrenador) */}
          <div className="absolute top-4 left-4 z-20">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#090d14]/80 backdrop-blur-md text-white border border-white/10 shadow-lg">
              {post.type === 'trophy' || post.graphic?.isTrophy ? (
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <User className="w-3.5 h-3.5 text-[#00ff87]" />
              )}
              <span>{graphic.tag || 'Comunicado Oficial'}</span>
            </span>
          </div>

          {/* Graphic Content depending on Post Type */}
          {post.type === 'trophy' || post.graphic?.isTrophy ? (
            /* CHAMPIONSHIP TROPHY VICTORY GRAPHIC */
            <div className="relative min-h-[380px] sm:min-h-[440px] flex flex-col justify-between p-5 sm:p-7 overflow-hidden rounded-2xl bg-[#090d14]">
              {/* High-res generated trophy celebration photo */}
              <img 
                src={graphic.image || "/trophies/league_trophy_celebration.jpg"}
                alt="Celebración del Trofeo"
                className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.52] contrast-125 scale-105 pointer-events-none transition-transform duration-700"
                onError={(e) => {
                  e.target.src = "/trophies/league_trophy_celebration.jpg";
                }}
              />
              {/* Dark golden vignette overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#060a12]/95 via-amber-950/25 to-[#060a12]/75 pointer-events-none"></div>

              {/* Golden celebration particles & badge banner */}
              <div className="relative z-10 flex items-center justify-between gap-2 pt-6">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-black shadow-xl shadow-amber-500/30 uppercase tracking-widest animate-pulse">
                  <Trophy className="w-4 h-4 text-black stroke-[2.5]" />
                  <span>¡¡¡CAMPEONES OFICIALES!!!</span>
                </span>
                <span className="text-xs font-extrabold text-amber-300 bg-black/75 backdrop-blur-md px-3 py-1 rounded-full border border-amber-500/40 shadow">
                  ⭐ {graphic.season || 'Temporada Oficial'}
                </span>
              </div>

              {/* Centerpiece: Club Crest in Golden Laurel & Huge Title */}
              <div className="relative z-10 my-4 flex flex-col items-center text-center">
                <div className="relative mb-3 group">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-500 p-1.5 shadow-2xl shadow-amber-500/50 flex items-center justify-center">
                    <div className="w-full h-full rounded-full bg-[#0a0f18] p-3 flex items-center justify-center border-2 border-amber-300/80">
                      <img 
                        src={graphic.clubLogo || author.avatar || clubLogo}
                        alt={graphic.clubName}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-2xl"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                  </div>
                  <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-black font-black text-[11px] px-3 py-0.5 rounded-full uppercase tracking-wider shadow-xl border border-yellow-200 shrink-0 whitespace-nowrap">
                    CAMPEÓN 🏆
                  </div>
                </div>

                <h2 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400 font-display tracking-tight drop-shadow-xl uppercase text-center leading-tight">
                  {graphic.title || '¡¡¡CAMPEONES!!!'}
                </h2>
                <p className="text-sm sm:text-base font-extrabold text-amber-300 drop-shadow mt-1 text-center">
                  {graphic.subtitle || `${graphic.clubName} · Míster ${graphic.managerName}`}
                </p>

                {/* Extra details (stadium / triumph notes / score) */}
                {graphic.details && (
                  <div className="mt-3 bg-[#0a0f18]/85 backdrop-blur-md border border-amber-500/40 px-4 py-2 rounded-xl text-xs text-slate-100 font-semibold text-center shadow-lg max-w-md mx-auto">
                    {graphic.details}
                  </div>
                )}
              </div>

              {/* Bottom Footer bar of graphic */}
              <div className="relative z-10 flex items-center justify-between pt-3 border-t border-amber-500/25 text-xs text-amber-200/90">
                <span className="font-semibold flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span>Trofeo oficial añadido a la vitrina del club</span>
                </span>
                <span className="font-mono font-bold text-amber-300">
                  {graphic.date || post.date}
                </span>
              </div>
            </div>
          ) : post.type === 'match' ? (
            /* MATCH RESULT GRAPHIC: Pantalla con foto del equipo y resultado con números en grande */
            <div className="relative min-h-[320px] sm:min-h-[360px] flex flex-col justify-between p-5 sm:p-7 overflow-hidden rounded-2xl">
              {/* Foto de fondo del equipo / estadio / celebración */}
              <img 
                src={graphic.bgImage || "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&auto=format&fit=crop&q=80"}
                alt="Match Atmosphere"
                className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.35] contrast-125 scale-105 pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070c14]/95 via-[#090f1a]/70 to-[#070c14]/80 pointer-events-none"></div>

              {/* Cabecera del Marcador */}
              <div className="relative z-10 flex items-center justify-between gap-2 pt-6">
                <span className="text-xs font-bold text-slate-300 bg-[#090d14]/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 shadow">
                  {graphic.subtitle || 'Resultado Oficial'}
                </span>
                <span className="text-[11px] font-extrabold text-[#00ff87] bg-emerald-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-500/30">
                  {graphic.tag || 'Pitido Final'}
                </span>
              </div>

              {/* MARCADOR CON NÚMEROS EN GRANDE Y ESCUDOS */}
              <div className="relative z-10 my-6 flex items-center justify-around gap-2 sm:gap-6">
                {/* Equipo Local */}
                <div className="flex-1 flex flex-col items-center text-center">
                  <img 
                    src={graphic.homeLogo || getClubLogo(graphic.homeTeam)} 
                    alt={graphic.homeTeam}
                    className="w-14 h-14 sm:w-20 sm:h-20 object-contain drop-shadow-2xl mb-2 hover:scale-105 transition-transform"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <p className="text-sm sm:text-base font-black text-white font-display leading-tight line-clamp-1">
                    {graphic.homeTeam}
                  </p>
                </div>

                {/* Marcador con Números en Grande */}
                <div className="bg-[#090e18]/90 backdrop-blur-md border-2 border-[#2b3e5c] px-5 sm:px-8 py-2.5 sm:py-4 rounded-3xl shadow-2xl flex items-center gap-3 sm:gap-6 shrink-0">
                  <span className="text-5xl sm:text-7xl font-black text-[#00ff87] font-display tracking-tight drop-shadow-md">
                    {graphic.homeScore}
                  </span>
                  <span className="text-3xl sm:text-5xl font-black text-slate-500 font-display">
                    -
                  </span>
                  <span className="text-5xl sm:text-7xl font-black text-white font-display tracking-tight drop-shadow-md">
                    {graphic.awayScore}
                  </span>
                </div>

                {/* Equipo Visitante */}
                <div className="flex-1 flex flex-col items-center text-center">
                  <img 
                    src={graphic.awayLogo || getClubLogo(graphic.awayTeam)} 
                    alt={graphic.awayTeam}
                    className="w-14 h-14 sm:w-20 sm:h-20 object-contain drop-shadow-2xl mb-2 hover:scale-105 transition-transform"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <p className="text-sm sm:text-base font-black text-white font-display leading-tight line-clamp-1">
                    {graphic.awayTeam}
                  </p>
                </div>
              </div>

              {/* Goleadores / Incidencias */}
              {graphic.scorers && graphic.scorers.length > 0 && (
                <div className="relative z-10 flex flex-wrap items-center justify-center gap-1.5 pt-3 border-t border-white/10">
                  {graphic.scorers.map((s, i) => (
                    <span key={i} className="bg-[#090e18]/85 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/10 font-bold text-[11px] text-slate-200 flex items-center gap-1 shadow">
                      <span>⚽</span>
                      <span className="text-[#00ff87]">{s.minute}</span>
                      <span>{s.player}</span>
                      {s.type && s.type !== 'Gol en Jugada' && (
                        <span className="text-[10px] text-amber-300">[{s.type}]</span>
                      )}
                    </span>
                  ))}
                </div>
              )}

              {/* MVP del Partido */}
              {graphic.mvp && (
                <div className="relative z-10 mt-2 flex justify-center">
                  <span className="bg-[#00ff87]/20 border border-[#00ff87]/40 text-[#00ff87] px-3 py-0.5 rounded-full text-xs font-black flex items-center gap-1.5 shadow">
                    <Trophy className="w-3.5 h-3.5 text-[#00ff87]" />
                    <span>MVP: {graphic.mvp}</span>
                  </span>
                </div>
              )}
            </div>
          ) : post.type === 'goal' ? (
            /* GOAL ALERT GRAPHIC */
            <div className="relative min-h-[260px] flex flex-col justify-between p-5 sm:p-6 overflow-hidden rounded-2xl bg-gradient-to-br from-[#072416] via-[#091522] to-[#071728]">
              {/* Stadium atmospheric background */}
              <img 
                src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1000&auto=format&fit=crop&q=80"
                alt="Goal Stadium"
                className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.22] scale-105 pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060b13]/95 via-transparent to-[#060b13]/80 pointer-events-none"></div>

              {/* Top Tag & Minute */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-[#00ff87] text-[#090d14] shadow-lg uppercase tracking-wider animate-pulse">
                  <span>⚽ ¡¡¡GOOOOOOOL!!!</span>
                </span>
                <span className="text-xs font-black text-[#00ff87] bg-[#090e18]/85 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-500/30">
                  ⏱️ Minuto {graphic.minute}
                </span>
              </div>

              {/* Scorer details card */}
              <div className="relative z-10 my-3 flex items-center justify-center gap-5 sm:gap-7">
                {/* Portrait with Crest */}
                <div className="relative shrink-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-[#00ff87] bg-[#141d2c] shadow-2xl">
                    <img 
                      src={graphic.image || "./default_player.svg"}
                      alt={graphic.player}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "./default_player.svg";
                      }}
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#162030] border-2 border-[#00ff87] p-0.5 flex items-center justify-center shadow-lg">
                    <img 
                      src={graphic.clubLogo || author.avatar || clubLogo}
                      alt=""
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                  {graphic.number && (
                    <span className="absolute -top-1 -left-1 bg-[#090d14] text-white font-black text-[10px] px-1.5 py-0.2 rounded-full border border-white/20">
                      #{graphic.number}
                    </span>
                  )}
                </div>

                {/* Scorer Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight truncate leading-tight drop-shadow-md">
                    {graphic.player}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-500/30">
                      {graphic.goalType || 'Gol en Jugada'}
                    </span>
                    {graphic.assist && (
                      <span className="text-xs text-slate-300 font-medium">
                        👟 Asist: <strong className="text-white">{graphic.assist}</strong>
                      </span>
                    )}
                  </div>
                  <div className="mt-2 text-xs font-bold text-slate-400">
                    Marcador: <span className="text-white font-black text-sm">{graphic.homeTeam} {graphic.homeScore} - {graphic.awayScore} {graphic.awayTeam}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* MANAGER / SIGNING / SALE GRAPHIC (Matches Carlos Corberán in screenshot!) */
            <div className="pt-12 pb-6 px-6 flex flex-col items-center justify-center relative z-10 space-y-4">
              
              {/* Portrait Container with Crest pinned at bottom-right */}
              <div className="relative group">
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-2 border-[#31425e] bg-[#141d2c] shadow-2xl relative">
                  <img
                    src={graphic.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"}
                    alt={graphic.title}
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80";
                    }}
                  />
                </div>

                {/* Mini Club Crest badge attached to portrait */}
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#162030] border-2 border-[#2b3c58] p-1 flex items-center justify-center shadow-lg">
                  <img
                    src={graphicCrest}
                    alt=""
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
              </div>

              {/* Title Typography matching screenshot */}
              <div className="text-center space-y-1">
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight font-display">
                  {graphic.title}
                </h3>
                {graphic.subtitle && (
                  <p className="text-xs text-slate-400 font-medium">
                    {graphic.subtitle}
                  </p>
                )}
              </div>

            </div>
          )}

        </div>
        )
      )}

      {/* 4. Action Footer: Reaccionar | Comentar | Compartir */}
      <div className="pt-2 border-t border-[#1a2538] flex items-center justify-between text-xs text-slate-400">
        
        {/* Reaccionar */}
        <div className="relative">
          <button
            onClick={handleToggleLike}
            onMouseEnter={() => setShowReactions(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-[#182335] transition-colors font-semibold ${
              reacted ? 'text-[#00ff87]' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smile className="w-4 h-4" />
            <span>Reaccionar</span>
            <span className="font-bold text-slate-300">({reactionCounts})</span>
          </button>
        </div>

        {/* Comentar */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-[#182335] hover:text-white transition-colors font-semibold"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Comentar</span>
          <span className="font-bold text-slate-300">({comments.length})</span>
        </button>

        {/* Compartir */}
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-[#182335] hover:text-white transition-colors font-semibold"
        >
          <Share2 className="w-4 h-4" />
          <span>Compartir</span>
        </button>

      </div>

      {/* Comments Section Drawer */}
      {showComments && (
        <div className="pt-3 border-t border-[#182335] space-y-3 animate-in fade-in">
          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              type="text"
              placeholder="Escribe un comentario..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              className="flex-1 bg-[#141d2c] border border-[#23334d] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00ff87]"
            />
            <button
              type="submit"
              className="bg-[#00ff87] text-[#090d14] font-bold text-xs px-3.5 py-2 rounded-xl"
            >
              Publicar
            </button>
          </form>

          <div className="space-y-2">
            {comments.map((c, i) => (
              <div key={i} className="bg-[#141d2c] p-2.5 rounded-xl border border-[#1e2a3f] text-xs">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-0.5">
                  <span className="font-bold text-white">{c.author}</span>
                  <span>{c.time}</span>
                </div>
                <p className="text-slate-300">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </article>
  );
}
