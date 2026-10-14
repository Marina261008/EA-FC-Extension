import React, { useState, useRef } from 'react';
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
  Shield,
  Send,
  Trash2,
  CornerDownRight
} from 'lucide-react';
import StartingXIGraphic from './StartingXIGraphic';
import { getClubLogo } from '../../clubsData';
import { generateContextualComments } from '../../postGenerator';

export default function ClubPostCard({
  post,
  clubLogo,
  clubName = 'Mi Club',
  managerName = 'Mánager',
  managerAvatar,
  onEditPost,
  onReactPost,
  onUpdatePost
}) {
  const [reacted, setReacted] = useState(false);
  const [activeReaction, setActiveReaction] = useState('❤️');
  const [showReactions, setShowReactions] = useState(false);
  const [reactionCounts, setReactionCounts] = useState(post.likes || 1200);
  const [showComments, setShowComments] = useState(false);
  
  // Initialize comments: use saved post.comments or generate realistic contextual comments
  const [comments, setComments] = useState(() => {
    if (post.comments && Array.isArray(post.comments) && post.comments.length > 0) {
      return post.comments;
    }
    return generateContextualComments(
      post.type, 
      clubName || post.author?.name || 'Mi Club', 
      managerName || 'Mánager', 
      { 
        ...post.graphic, 
        isVictoria: post.graphic?.isVictoria || post.graphic?.theme === 'emerald' 
      }
    );
  });

  const [newCommentText, setNewCommentText] = useState('');
  const commentInputRef = useRef(null);

  const handleToggleLike = () => {
    if (reacted) {
      setReactionCounts(prev => prev - 1);
      setReacted(false);
    } else {
      setReactionCounts(prev => prev + 1);
      setReacted(true);
      setActiveReaction('❤️');
    }
  };

  const handlePickReaction = (emoji) => {
    if (!reacted) {
      setReactionCounts(prev => prev + 1);
      setReacted(true);
    }
    setActiveReaction(emoji);
    setShowReactions(false);
  };

  // Toggle like on an individual comment
  const handleToggleCommentLike = (commentId) => {
    const updated = comments.map(c => {
      if (c.id === commentId) {
        const isLiked = c.userLiked;
        return {
          ...c,
          userLiked: !isLiked,
          likes: isLiked ? Math.max(0, (c.likes || 1) - 1) : (c.likes || 0) + 1
        };
      }
      return c;
    });

    setComments(updated);
    if (onUpdatePost) {
      onUpdatePost({
        ...post,
        comments: updated,
        commentsCount: updated.length
      });
    }
  };

  // Post a new comment as Manager
  const handleAddComment = (e) => {
    if (e) e.preventDefault();
    if (!newCommentText.trim()) return;

    const userComment = {
      id: `comm-mgr-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      author: `Tú (${managerName || 'Mánager'})`,
      handle: `@${managerName ? managerName.replace(/\s+/g, '').toLowerCase() : 'mister'}`,
      badge: '👔 Mánager Oficial',
      verified: true,
      avatar: managerAvatar || clubLogo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
      text: newCommentText.trim(),
      time: 'Ahora mismo',
      likes: 1,
      userLiked: true,
      isUserComment: true
    };

    const updated = [userComment, ...comments];
    setComments(updated);
    setNewCommentText('');
    setShowComments(true);

    if (onUpdatePost) {
      onUpdatePost({
        ...post,
        comments: updated,
        commentsCount: updated.length
      });
    }
  };

  // Quick reply chip for Manager
  const handleQuickManagerReply = (text) => {
    const userComment = {
      id: `comm-mgr-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      author: `Tú (${managerName || 'Mánager'})`,
      handle: `@${managerName ? managerName.replace(/\s+/g, '').toLowerCase() : 'mister'}`,
      badge: '👔 Mánager Oficial',
      verified: true,
      avatar: managerAvatar || clubLogo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
      text,
      time: 'Ahora mismo',
      likes: 2,
      userLiked: true,
      isUserComment: true
    };

    const updated = [userComment, ...comments];
    setComments(updated);
    setShowComments(true);

    if (onUpdatePost) {
      onUpdatePost({
        ...post,
        comments: updated,
        commentsCount: updated.length
      });
    }
  };

  // Reply to another user: prefills input with @handle
  const handleReplyTo = (authorHandle) => {
    setShowComments(true);
    setNewCommentText(`${authorHandle} `);
    setTimeout(() => {
      commentInputRef.current?.focus();
    }, 100);
  };

  // Delete own comment
  const handleDeleteComment = (commentId) => {
    const updated = comments.filter(c => c.id !== commentId);
    setComments(updated);
    if (onUpdatePost) {
      onUpdatePost({
        ...post,
        comments: updated,
        commentsCount: updated.length
      });
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`${post.author.name}: ${post.text}`);
    alert('¡Publicación copiada al portapapeles!');
  };

  const { author, graphic } = post;

  // Resolve correct crest for author avatar and graphic badge:
  const authorAvatar = (post.type === 'transfer_in' && clubLogo) 
    ? clubLogo 
    : (author.avatar || clubLogo);

  const graphicCrest = (post.type === 'transfer_in' && clubLogo)
    ? clubLogo
    : (graphic?.clubLogo || author.avatar || clubLogo);

  // Quick Manager reply options
  const quickReplies = [
    { emoji: '👏', text: '¡Gran trabajo de todo el equipo y gracias a la afición por empujar!' },
    { emoji: '🔥', text: '¡Seguimos con todo, paso a paso y con máxima ambición!' },
    { emoji: '🤝', text: 'El compromiso y la unión de todos es nuestra mayor fuerza.' },
    { emoji: '🎯', text: 'Humildad y trabajo diario para alcanzar nuestros objetivos.' }
  ];

  return (
    <article className="bg-[#101724] border border-[#1e2a3f] hover:border-[#283854] rounded-2xl p-4 sm:p-5 shadow-sm space-y-4 transition-all overflow-hidden">
      
      {/* 1. Header: Avatar + Club Name + Verified Badge + Handle + Date + [Editar] Button */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Club Avatar */}
          <div className="w-11 h-11 rounded-full bg-[#182335] border border-[#2b3c58] p-1.5 flex items-center justify-center shrink-0 shadow-inner">
            <img
              src={authorAvatar}
              alt={author.name}
              className="max-w-full max-h-full object-contain"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-extrabold text-white text-sm hover:underline cursor-pointer truncate">
                {author.name}
              </span>
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#00ff87] text-[#090d14] text-[10px] font-black shrink-0">
                ✓
              </span>
              <span className="text-xs text-slate-400 font-medium truncate">
                {author.handle} · {post.date}
              </span>
            </div>
          </div>
        </div>

        {/* Green [Editar] Button */}
        {onEditPost && (
          <button
            onClick={() => onEditPost(post)}
            className="flex items-center gap-1.5 bg-[#00ff87] hover:bg-[#00e676] active:scale-95 text-[#090d14] font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-sm transition-all shrink-0 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Editar</span>
          </button>
        )}
      </div>

      {/* 2. Post Content Text */}
      <div className="text-sm text-slate-100 whitespace-pre-line leading-relaxed font-normal">
        {post.text}
      </div>

      {/* 3. Graphic Announcement Card */}
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

          {/* Top Tag Pill */}
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
              <img 
                src={graphic.image || "/trophies/league_trophy_celebration.jpg"}
                alt="Celebración del Trofeo"
                className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.52] contrast-125 scale-105 pointer-events-none transition-transform duration-700"
                onError={(e) => {
                  e.target.src = "/trophies/league_trophy_celebration.jpg";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060a12]/95 via-amber-950/25 to-[#060a12]/75 pointer-events-none"></div>

              <div className="relative z-10 flex items-center justify-between gap-2 pt-6">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-black shadow-xl shadow-amber-500/30 uppercase tracking-widest animate-pulse">
                  <Trophy className="w-4 h-4 text-black stroke-[2.5]" />
                  <span>¡¡¡CAMPEONES OFICIALES!!!</span>
                </span>
                <span className="text-xs font-extrabold text-amber-300 bg-black/75 backdrop-blur-md px-3 py-1 rounded-full border border-amber-500/40 shadow">
                  ⭐ {graphic.season || 'Temporada Oficial'}
                </span>
              </div>

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

                {graphic.details && (
                  <div className="mt-3 bg-[#0a0f18]/85 backdrop-blur-md border border-amber-500/40 px-4 py-2 rounded-xl text-xs text-slate-100 font-semibold text-center shadow-lg max-w-md mx-auto">
                    {graphic.details}
                  </div>
                )}
              </div>

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
            /* MATCH RESULT GRAPHIC */
            <div className="relative min-h-[320px] sm:min-h-[360px] flex flex-col justify-between p-5 sm:p-7 overflow-hidden rounded-2xl">
              <img 
                src={graphic.bgImage || "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&auto=format&fit=crop&q=80"}
                alt="Match Atmosphere"
                className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.35] contrast-125 scale-105 pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070c14]/95 via-[#090f1a]/70 to-[#070c14]/80 pointer-events-none"></div>

              <div className="relative z-10 flex items-center justify-between gap-2 pt-6">
                <span className="text-xs font-bold text-slate-300 bg-[#090d14]/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 shadow">
                  {graphic.subtitle || 'Resultado Oficial'}
                </span>
                <span className="text-[11px] font-extrabold text-[#00ff87] bg-emerald-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-500/30">
                  {graphic.tag || 'Pitido Final'}
                </span>
              </div>

              <div className="relative z-10 my-6 flex items-center justify-around gap-2 sm:gap-6">
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

                <div className="flex items-center gap-3 sm:gap-5 bg-black/60 backdrop-blur-md px-5 sm:px-7 py-3 rounded-2xl border border-white/10 shadow-2xl">
                  <span className={`text-4xl sm:text-6xl font-black font-display ${
                    Number(graphic.homeScore) > Number(graphic.awayScore) ? 'text-[#00ff87]' : 'text-white'
                  }`}>
                    {graphic.homeScore}
                  </span>
                  <span className="text-2xl sm:text-4xl font-black text-slate-500">:</span>
                  <span className={`text-4xl sm:text-6xl font-black font-display ${
                    Number(graphic.awayScore) > Number(graphic.homeScore) ? 'text-[#00ff87]' : 'text-white'
                  }`}>
                    {graphic.awayScore}
                  </span>
                </div>

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

              <div className="relative z-10 flex items-center justify-between pt-3 border-t border-white/10 text-xs text-slate-400">
                <span>{graphic.stadium ? `📍 ${graphic.stadium}` : '🏟️ Partido Oficial'}</span>
                {graphic.mvp && (
                  <span className="text-[#00ff87] font-bold">
                    ⭐ MVP: {graphic.mvp}
                  </span>
                )}
              </div>
            </div>
          ) : (
            /* MANAGER / SIGNING / SALE / GOAL GRAPHIC */
            <div className="pt-12 pb-6 px-6 flex flex-col items-center justify-center relative z-10 space-y-4">
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

                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#162030] border-2 border-[#2b3c58] p-1 flex items-center justify-center shadow-lg">
                  <img
                    src={graphicCrest}
                    alt=""
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
              </div>

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
      <div className="pt-2 border-t border-[#1a2538] flex items-center justify-between text-xs text-slate-400 relative">
        
        {/* Reaccionar button & Picker */}
        <div className="relative" onMouseLeave={() => setShowReactions(false)}>
          {showReactions && (
            <div className="absolute bottom-full left-0 mb-2 bg-[#141e2e] border border-[#2b3d5c] rounded-2xl p-1.5 shadow-2xl flex items-center gap-1 z-30 animate-in fade-in zoom-in-95">
              {['❤️', '🔥', '👏', '⚽', '🏆'].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handlePickReaction(emoji)}
                  className="w-8 h-8 rounded-xl hover:bg-[#1f2e45] flex items-center justify-center text-lg hover:scale-125 transition-transform"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={handleToggleLike}
            onMouseEnter={() => setShowReactions(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-[#182335] transition-colors font-semibold cursor-pointer ${
              reacted ? 'text-[#00ff87]' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="text-sm">{reacted ? activeReaction : '🤍'}</span>
            <span>{reacted ? 'Reaccionado' : 'Reaccionar'}</span>
            <span className="font-bold text-slate-300">({reactionCounts})</span>
          </button>
        </div>

        {/* Comentar Button with Count */}
        <button
          onClick={() => setShowComments(!showComments)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-[#182335] transition-colors font-semibold cursor-pointer ${
            showComments ? 'text-[#00ff87] bg-[#182335]' : 'text-slate-400 hover:text-white'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          <span>Comentar</span>
          <span className="font-bold text-slate-300">({comments.length})</span>
        </button>

        {/* Compartir */}
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-[#182335] hover:text-white transition-colors font-semibold cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
          <span>Compartir</span>
        </button>

      </div>

      {/* 5. Rich Interactive Comments Section Drawer */}
      {showComments && (
        <div className="pt-4 border-t border-[#182335] space-y-4 animate-in fade-in duration-200">
          
          {/* Header of comments drawer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm">💬</span>
              <h4 className="font-extrabold text-white text-xs">
                Comentarios de la afición y prensa
              </h4>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#182335] text-slate-400 border border-[#273852]">
              {comments.length} en total
            </span>
          </div>

          {/* Quick Manager Responses (Chips) */}
          <div className="space-y-1.5 bg-[#0e1522] p-3 rounded-xl border border-[#1b2638]">
            <p className="text-[10px] font-black uppercase tracking-wider text-[#00ff87] flex items-center gap-1">
              <span>⚡</span>
              <span>Respuestas rápidas del Mánager:</span>
            </p>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {quickReplies.map((qr, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickManagerReply(qr.text)}
                  className="text-[11px] bg-[#152030] hover:bg-[#1d2c44] hover:text-[#00ff87] text-slate-300 font-medium px-2.5 py-1 rounded-lg border border-[#24344d] transition-all flex items-center gap-1 text-left cursor-pointer active:scale-95"
                  title="Publicar esta respuesta directa del Mánager"
                >
                  <span>{qr.emoji}</span>
                  <span className="line-clamp-1 max-w-[260px] sm:max-w-none">{qr.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* New Comment Input Form */}
          <form onSubmit={handleAddComment} className="flex gap-2 items-center">
            <div className="w-8 h-8 rounded-full bg-[#172336] border border-[#2b3d5b] flex items-center justify-center shrink-0 p-1">
              <img
                src={managerAvatar || clubLogo}
                alt="Manager"
                className="max-w-full max-h-full object-contain rounded-full"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>

            <input
              ref={commentInputRef}
              type="text"
              placeholder="Escribe un comentario o respuesta oficial..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              className="flex-1 min-w-0 bg-[#141d2c] border border-[#23334d] rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00ff87] transition-all"
            />

            <button
              type="submit"
              disabled={!newCommentText.trim()}
              className="bg-[#00ff87] hover:bg-[#00e676] disabled:opacity-50 disabled:hover:bg-[#00ff87] text-[#090d14] font-black text-xs px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1 shrink-0 active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Publicar</span>
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-2.5 pt-1">
            {comments.map((c) => {
              const isManager = c.isUserComment || c.badge?.includes('Mánager');
              const isPrensa = c.badge?.includes('Prensa') || c.badge?.includes('Periodista');
              const isSocio = c.badge?.includes('Socio');
              const isUltra = c.badge?.includes('Ultra') || c.badge?.includes('Grada');

              return (
                <div 
                  key={c.id || c.time} 
                  className={`p-3 rounded-xl border text-xs space-y-2 transition-all ${
                    isManager 
                      ? 'bg-[#0f1d24] border-emerald-500/40 shadow-sm' 
                      : 'bg-[#121a28] border-[#1d2a3f]'
                  }`}
                >
                  {/* Top Bar of Comment: Avatar + Author Info + Badges + Timestamp */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Avatar */}
                      <div className="w-7 h-7 rounded-full bg-[#182335] border border-[#273852] flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                        {c.avatar ? (
                          <img
                            src={c.avatar}
                            alt={c.author}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <span className="text-[10px] font-bold text-slate-300">
                            {c.author.slice(0, 2).toUpperCase()}
                          </span>
                        )}
                      </div>

                      {/* Author Name + Badges */}
                      <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                        <span className="font-extrabold text-white text-xs truncate">
                          {c.author}
                        </span>

                        {c.verified && (
                          <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-[#00ff87] text-[#090d14] text-[9px] font-black shrink-0" title="Verificado">
                            ✓
                          </span>
                        )}

                        {c.badge && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded shrink-0 ${
                            isManager ? 'bg-emerald-500/20 text-[#00ff87] border border-emerald-500/30' :
                            isPrensa ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' :
                            isSocio ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                            isUltra ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                            'bg-slate-700/60 text-slate-300'
                          }`}>
                            {c.badge}
                          </span>
                        )}

                        {c.handle && (
                          <span className="text-[10px] text-slate-500 hidden sm:inline">
                            {c.handle}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Timestamp & delete if user's own comment */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-slate-400 font-medium">
                        {c.time}
                      </span>
                      {c.isUserComment && (
                        <button
                          type="button"
                          onClick={() => handleDeleteComment(c.id)}
                          className="text-slate-500 hover:text-red-400 transition-colors p-0.5 rounded"
                          title="Eliminar mi comentario"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Comment Body */}
                  <p className="text-slate-200 text-xs pl-9 leading-relaxed font-normal">
                    {c.text.split(' ').map((word, wIdx) => {
                      if (word.startsWith('@')) {
                        return <span key={wIdx} className="font-bold text-[#00ff87] hover:underline cursor-pointer">{word} </span>;
                      }
                      return word + ' ';
                    })}
                  </p>

                  {/* Comment Action Footer: Like button + Responder button */}
                  <div className="flex items-center gap-3 pl-9 pt-1 text-[11px] text-slate-400">
                    <button
                      type="button"
                      onClick={() => handleToggleCommentLike(c.id)}
                      className={`flex items-center gap-1 font-bold transition-colors cursor-pointer ${
                        c.userLiked ? 'text-rose-400' : 'hover:text-white'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${c.userLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                      <span>{c.likes || 0}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleReplyTo(c.handle || `@${c.author.replace(/\s+/g, '')}`)}
                      className="flex items-center gap-1 hover:text-[#00ff87] transition-colors font-medium cursor-pointer"
                    >
                      <CornerDownRight className="w-3 h-3" />
                      <span>Responder</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

    </article>
  );
}
