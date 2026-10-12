import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  BrainCircuit, 
  TrendingUp, 
  Send, 
  Check, 
  MessageSquare, 
  FileText, 
  Mic, 
  Shield, 
  Users, 
  DollarSign, 
  Award, 
  ArrowRight,
  Flame,
  Settings,
  HelpCircle,
  Key,
  Target,
  Sliders,
  ChevronRight,
  UserCheck,
  Zap
} from 'lucide-react';
import { 
  COACH_PERSONALITIES,
  analyzeSquadAndRecommend, 
  analyzeYouthAcademy,
  generateMatchChronicle, 
  generatePressConference, 
  generateLockerRoomSpeech,
  predictMatchAgainst, 
  askMisterAI,
  getSavedGeminiKey,
  saveGeminiKey
} from '../../services/aiEngine';
import { ALL_PRESET_CLUBS, getClubLogo } from '../../clubsData';

export default function AIAssistantModal({ 
  isOpen, 
  onClose, 
  career, 
  season, 
  onSignPlayer, 
  onAddPost 
}) {
  if (!isOpen) return null;

  // Active Coach Personality
  const [activePersonality, setActivePersonality] = useState(COACH_PERSONALITIES[0].id);
  const currentCoach = COACH_PERSONALITIES.find(c => c.id === activePersonality) || COACH_PERSONALITIES[0];

  // Active Tab: 'scout' | 'tactics' | 'youth' | 'press' | 'chronicle' | 'chat'
  const [activeTab, setActiveTab] = useState('scout');

  // Scouting State
  const [scoutPosFilter, setScoutPosFilter] = useState('ALL'); // 'ALL' | 'POR' | 'DEF' | 'MED' | 'DEL'
  const [scoutingReport, setScoutingReport] = useState(() => analyzeSquadAndRecommend(career, season, 'ALL'));

  // Update scouting report when pos filter changes
  useEffect(() => {
    setScoutingReport(analyzeSquadAndRecommend(career, season, scoutPosFilter));
  }, [scoutPosFilter, career, season]);

  // Youth Academy State
  const [youthReport, setYouthReport] = useState(() => analyzeYouthAcademy(season.squad, career.manager.club));

  // Tactics Prediction State
  const [selectedOpponent, setSelectedOpponent] = useState(
    ALL_PRESET_CLUBS.find(c => c.name !== career.manager.club)?.name || "Real Madrid CF"
  );
  const [tacticsPreview, setTacticsPreview] = useState(() => 
    predictMatchAgainst(selectedOpponent, career.manager.club, season, activePersonality)
  );

  useEffect(() => {
    setTacticsPreview(predictMatchAgainst(selectedOpponent, career.manager.club, season, activePersonality));
  }, [selectedOpponent, activePersonality]);

  // Chronicle State
  const latestMatch = season.matches && season.matches.length > 0 
    ? season.matches[season.matches.length - 1] 
    : {
        homeTeam: career.manager.club,
        awayTeam: "Real Madrid CF",
        homeScore: 2,
        awayScore: 1,
        result: "Victoria",
        competition: "LALIGA EA SPORTS",
        mvp: season.squad?.[0]?.name || "Estrella del Club",
        scorers: [{ player: season.squad?.[0]?.name || "Goleador", minute: "38'" }]
      };
  const [chronicle, setChronicle] = useState(() => generateMatchChronicle(latestMatch, career.manager.club, career.manager.name));

  // Press & Speech State
  const [speech, setSpeech] = useState(() => generateLockerRoomSpeech(career.manager.club, selectedOpponent, activePersonality));
  useEffect(() => {
    setSpeech(generateLockerRoomSpeech(career.manager.club, selectedOpponent, activePersonality));
  }, [activePersonality, selectedOpponent, career.manager.club]);

  const [pressQuestions, setPressQuestions] = useState(() => generatePressConference(latestMatch, career.manager.club, career.manager.name, activePersonality));
  const [answeredQuestions, setAnsweredQuestions] = useState({});

  // Chat State
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `👋 ¡Saludos, ${career.manager.name}! Soy **${currentCoach.name}**, tu asesor técnico y estratega de cabecera en el **${career.manager.club}**.\n\n${currentCoach.motto}\n\nPuedo recomendarte fichajes que eleven el nivel competitivo, planificar el desarrollo de tus canteranos sub-22, trazar el plan anti-rival para tu próximo partido o preparar las arengas del vestuario. ¿Qué desafío abordamos hoy?`
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Update welcome message when personality changes if chat has only 1 message
  useEffect(() => {
    if (messages.length === 1) {
      setMessages([
        {
          sender: 'ai',
          text: `👋 ¡Saludos, ${career.manager.name}! Soy **${currentCoach.name}**, tu asesor técnico y estratega de cabecera en el **${career.manager.club}**.\n\n${currentCoach.motto}\n\nPuedo recomendarte fichajes que eleven el nivel competitivo, planificar el desarrollo de tus canteranos sub-22, trazar el plan anti-rival para tu próximo partido o preparar las arengas del vestuario. ¿Qué desafío abordamos hoy?`
        }
      ]);
    }
  }, [activePersonality]);

  // Gemini API Key config
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(() => getSavedGeminiKey());

  // Toast
  const [toast, setToast] = useState(null);
  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Handle chat submission
  const handleSendMessage = async (customText = null) => {
    const textToSend = customText || chatInput;
    if (!textToSend.trim()) return;

    const userMsg = { sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    if (!customText) setChatInput('');
    setIsTyping(true);

    try {
      const response = await askMisterAI(textToSend, career, season, activePersonality);
      setMessages(prev => [...prev, { sender: 'ai', text: response }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'ai', text: "Hubo un pequeño contratiempo en la comunicación táctica. ¿Puedes repetírmelo?" }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Sign recommended player
  const handleSignRecommendation = (player) => {
    if (onSignPlayer) {
      onSignPlayer(player);
      triggerToast(`¡${player.name} fichado con la IA para el ${career.manager.club}!`);
    }
  };

  // Apply youth development plan
  const handleApplyYouthPlan = (prospect) => {
    triggerToast(`⚡ ¡Plan "${prospect.focus}" activado para ${prospect.name}!`);
  };

  // Publish match chronicle to feed
  const handlePublishChronicle = () => {
    if (!chronicle || !onAddPost) return;
    const post = {
      id: `post-ai-chronicle-${Date.now()}`,
      type: 'news',
      author: {
        name: "Diario Deportivo Central",
        handle: "@PrensaEAFC",
        verified: true,
        avatar: "https://images.fotmob.com/image_resources/playerimages/701154.png"
      },
      date: latestMatch.date || 'Crónica Oficial',
      text: `📰 **${chronicle.headlines[0]}**\n\n${chronicle.lead}\n\n${chronicle.analysis}\n\n⭐ MVP del encuentro: ${latestMatch.mvp || 'El colectivo'}`,
      hashtags: ['#CronicaIA', `#${career.manager.club.replace(/\s+/g, '')}`, '#LALIGAEASPORTS'],
      graphic: {
        tag: '📰 Crónica Oficial de Prensa',
        title: chronicle.headlines[0],
        subtitle: `${latestMatch.homeTeam} ${latestMatch.homeScore} - ${latestMatch.awayScore} ${latestMatch.awayTeam}`,
        theme: 'emerald'
      },
      likes: 4210,
      commentsCount: 198,
      reactions: ['🔥', '👏', '😍']
    };
    onAddPost(post);
    triggerToast("¡Crónica de prensa publicada en el Feed!");
  };

  // Publish speech to feed
  const handlePublishSpeech = () => {
    if (!speech || !onAddPost) return;
    const post = {
      id: `post-ai-speech-${Date.now()}`,
      type: 'news',
      author: {
        name: `${career.manager.club} Comunicación`,
        handle: `@${career.manager.club.replace(/\s+/g, '')}`,
        verified: true,
        avatar: getClubLogo(career.manager.club)
      },
      date: 'Antesala de Partido',
      text: `🔥 **${speech.title}**\n\n"${speech.speech}"\n\nFilosofía técnica inspirada en ${currentCoach.name}. ¡Todos a una con el equipo!`,
      hashtags: ['#Arenga', '#ModoCarrera', `#${career.manager.club.replace(/\s+/g, '')}`],
      graphic: {
        tag: '🔥 Discurso en el Vestuario',
        title: speech.title,
        subtitle: `Rival: ${selectedOpponent}`,
        theme: 'gold'
      },
      likes: 5630,
      commentsCount: 240,
      reactions: ['🔥', '⚡', '💪']
    };
    onAddPost(post);
    triggerToast("¡Arenga del vestuario publicada en el Feed!");
  };

  // Publish tactical preview to feed
  const handlePublishTactics = (plan) => {
    if (!onAddPost) return;
    const post = {
      id: `post-ai-tactics-${Date.now()}`,
      type: 'news',
      author: {
        name: `Pizarra Táctica · ${currentCoach.name}`,
        handle: `@EstrategiaEAFC`,
        verified: true,
        avatar: currentCoach.avatar
      },
      date: 'Plan de Partido',
      text: `📊 **Plan de Partido vs ${selectedOpponent}**: ${plan.name}\n\n• Formación: **${plan.formation}**\n• Estilo de Presión: ${plan.pressingStyle}\n• Ritmo de Pase: ${plan.passingSpeed}\n\n${plan.summary}\n\n*Clave táctica:* ${tacticsPreview.keyAdvice}`,
      hashtags: ['#PizarraTactica', `#${career.manager.club.replace(/\s+/g, '')}`, '#EAFCCareer'],
      graphic: {
        tag: '📊 Plan Táctico Anti-Rival',
        title: `${plan.name} (${plan.formation})`,
        subtitle: `Vs ${selectedOpponent}`,
        theme: 'blue'
      },
      likes: 3820,
      commentsCount: 145,
      reactions: ['🎯', '🧠', '⚽']
    };
    onAddPost(post);
    triggerToast("¡Plan táctico publicado en el Feed!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-[#00ff87] text-[#080d14] font-black px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-emerald-300 animate-bounce">
          <Check className="w-5 h-5" />
          <span>{toast}</span>
        </div>
      )}

      <div className="bg-[#0b1019] border border-[#00ff87]/40 w-full max-w-5xl max-h-[94vh] rounded-3xl shadow-[0_0_60px_rgba(0,255,135,0.18)] flex flex-col overflow-hidden relative">
        
        {/* Glow Header */}
        <div className="bg-gradient-to-r from-[#101928] via-[#0d1522] to-[#141f33] p-4 sm:p-5 border-b border-[#1f2d45] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#00ff87] to-[#00b4d8] flex items-center justify-center shadow-lg shadow-[#00ff87]/30 shrink-0">
              <BrainCircuit className="w-6 h-6 text-[#080c14] stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black font-display text-white">
                  Míster IA 2.0 · Asistente Táctico & Ojeador Élite
                </h2>
                <span className="bg-[#00ff87]/20 text-[#00ff87] text-[10px] font-black px-2 py-0.5 rounded-full border border-[#00ff87]/30 animate-pulse">
                  ACTIVO
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                {career.manager.club} · Entrenador: <span className="text-slate-200 font-bold">{career.manager.name}</span> · EA Sports FC {career.gameVersion}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowKeyModal(!showKeyModal)}
              title="Configurar clave API de Gemini opcional"
              className="p-2 rounded-xl text-slate-400 hover:text-[#00ff87] bg-[#162133] hover:bg-[#1d2b42] border border-[#273852] transition-colors"
            >
              <Key className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-[#162133] hover:bg-[#1d2b42] border border-[#273852] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Coach Archetype Selector Bar */}
        <div className="bg-[#090e17] px-4 py-2.5 border-b border-[#1a2536] flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
            <UserCheck className="w-3.5 h-3.5 text-[#00ff87]" />
            <span>Personalidad:</span>
          </span>

          {COACH_PERSONALITIES.map(coach => {
            const isActive = activePersonality === coach.id;
            return (
              <button
                key={coach.id}
                onClick={() => setActivePersonality(coach.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 border ${
                  isActive
                    ? 'bg-[#18263a] text-white border-[#00ff87] shadow-sm shadow-[#00ff87]/20'
                    : 'bg-[#101724] text-slate-400 border-[#1f2b3e] hover:text-slate-200 hover:border-slate-600'
                }`}
              >
                <div 
                  className="w-2.5 h-2.5 rounded-full shrink-0" 
                  style={{ backgroundColor: coach.color }}
                />
                <span>{coach.name}</span>
                <span className="text-[10px] text-slate-400 font-normal hidden sm:inline">({coach.shortTitle})</span>
              </button>
            );
          })}
        </div>

        {/* Optional Gemini API Key Drawer */}
        {showKeyModal && (
          <div className="bg-[#121a28] p-4 border-b border-[#23334c] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#00ff87]" />
                <span>Google Gemini API Key (Opcional)</span>
              </span>
              <p className="text-slate-400 text-[11px]">
                Míster IA funciona al 100% con inteligencia local sin necesidad de claves. Si conectas tu clave de Gemini, las respuestas del chat se vuelven infinitamente variadas y creativas.
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="password"
                placeholder="Pega tu GEMINI_API_KEY..."
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                className="bg-[#172235] border border-[#283952] rounded-xl px-3 py-1.5 text-white text-xs w-full sm:w-56 focus:outline-none focus:border-[#00ff87]"
              />
              <button
                onClick={() => {
                  saveGeminiKey(apiKeyInput);
                  setShowKeyModal(false);
                  triggerToast("Clave de Gemini guardada correctamente.");
                }}
                className="bg-[#00ff87] text-[#080d14] font-black px-3 py-1.5 rounded-xl hover:bg-[#00e578] shrink-0"
              >
                Guardar
              </button>
            </div>
          </div>
        )}

        {/* Feature Nav Tabs */}
        <div className="bg-[#0d131f] border-b border-[#1d293d] px-4 flex items-center gap-1.5 overflow-x-auto py-2">
          {[
            { id: 'scout', label: '🎯 Ojeador IA 2.0', desc: 'Fichajes y Filtros' },
            { id: 'tactics', label: '📊 Pizarra & Anti-Rival', desc: 'Estrategia y Métricas' },
            { id: 'youth', label: '🌱 Cantera & Progresión', desc: 'Jóvenes Sub-22' },
            { id: 'press', label: '🎙️ Prensa & Arenga', desc: 'Discursos y Respuestas' },
            { id: 'chronicle', label: '📰 Crónica de Partido', desc: 'Portada Periodística' },
            { id: 'chat', label: '💬 Chat con Míster IA', desc: 'Conversación Libre' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 rounded-xl transition-all shrink-0 text-left ${
                activeTab === tab.id
                  ? 'bg-[#00ff87] text-[#080d14] shadow-md shadow-[#00ff87]/20 font-black'
                  : 'text-slate-400 hover:text-white hover:bg-[#151f30] font-bold'
              }`}
            >
              <div className="text-xs">{tab.label}</div>
              <div className={`text-[10px] ${activeTab === tab.id ? 'text-[#080d14]/75 font-semibold' : 'text-slate-500'}`}>
                {tab.desc}
              </div>
            </button>
          ))}
        </div>

        {/* TAB BODY (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0a0f18] text-slate-200">

          {/* 1. SCOUTING TAB */}
          {activeTab === 'scout' && (
            <div className="space-y-6">
              
              {/* Squad Diagnostics Bar */}
              <div className="bg-[#121a28] border border-[#202d42] p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[#00ff87]">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Diagnóstico del Once</span>
                    <p className="text-xs sm:text-sm font-bold text-white">
                      Carencia detectada: <span className="text-[#00ff87] font-black">{scoutingReport.diagnostics.weakCategory}</span> — {scoutingReport.diagnostics.weakReason}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-semibold">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Media Plantilla</span>
                    <span className="text-white font-extrabold text-sm">{scoutingReport.diagnostics.avgRating} OVR</span>
                  </div>
                  <div className="border-l border-[#24344c] pl-4">
                    <span className="text-slate-400 text-[10px] block">Presupuesto Traspasos</span>
                    <span className="text-[#00ff87] font-extrabold text-sm">{scoutingReport.diagnostics.transferBudgetFormatted}</span>
                  </div>
                </div>
              </div>

              {/* Position Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <span className="text-xs font-bold text-slate-400 mr-2">Filtrar demarcación:</span>
                {[
                  { id: 'ALL', label: 'Todos los Puestos' },
                  { id: 'POR', label: '🧤 Porteros' },
                  { id: 'DEF', label: '🛡️ Defensas' },
                  { id: 'MED', label: '🎯 Medios' },
                  { id: 'DEL', label: '⚡ Delanteros' }
                ].map(pos => (
                  <button
                    key={pos.id}
                    onClick={() => setScoutPosFilter(pos.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      scoutPosFilter === pos.id
                        ? 'bg-[#00ff87] text-[#090e17] font-black'
                        : 'bg-[#141d2c] text-slate-400 hover:text-white border border-[#223147]'
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>

              {/* Priority Recommendation Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {scoutingReport.recommendations.map(rec => {
                  const p = rec.player;
                  return (
                    <div 
                      key={rec.id}
                      className="bg-[#111826] border border-[#213047] hover:border-[#00ff87]/50 rounded-2xl p-4 transition-all hover:shadow-xl flex flex-col justify-between"
                    >
                      <div>
                        {/* Header Badge */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="bg-[#1b263b] text-[#00ff87] text-[10px] font-black px-2.5 py-1 rounded-lg border border-[#00ff87]/30">
                            {rec.badge}
                          </span>
                          <span className="text-[11px] font-black text-slate-400">
                            Afinidad: <span className="text-[#00ff87]">{rec.matchScore}</span>
                          </span>
                        </div>

                        {/* Player Header */}
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#182335] border border-[#2b3c54] shrink-0">
                            <img 
                              src={p.imageUrl || p.photo} 
                              alt={p.name} 
                              className="w-full h-full object-cover object-top" 
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-black text-white">{p.name}</h4>
                              <span className="bg-[#24344d] text-slate-200 text-[10px] font-black px-1.5 py-0.5 rounded">
                                {p.pos}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                              <span>{p.teamName}</span>
                              <span>•</span>
                              <span>{p.age} años</span>
                              <span>•</span>
                              <span className="text-yellow-400 font-extrabold">{p.ovr} OVR</span>
                            </p>
                          </div>
                        </div>

                        {/* Rationale & Financial Impact */}
                        <p className="text-xs text-slate-300 leading-relaxed mb-2 font-medium">
                          {rec.reason}
                        </p>
                        <p className="text-[11px] text-emerald-400/90 font-medium bg-[#13202e] p-2 rounded-xl border border-emerald-500/20 mb-3">
                          💼 {rec.financeImpact}
                        </p>
                      </div>

                      {/* Card Footer with Sign Button */}
                      <div className="flex items-center justify-between pt-3 border-t border-[#1b273b]">
                        <div>
                          <span className="text-[10px] text-slate-500 block">Coste Aproximado</span>
                          <span className="text-sm font-black text-white">{p.val} M €</span>
                        </div>
                        <button
                          onClick={() => handleSignRecommendation(p)}
                          className="bg-[#00ff87] hover:bg-[#00e578] text-[#080d14] font-black px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md shadow-[#00ff87]/20"
                        >
                          <span>✍️ Fichar Jugador con IA</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Extra Position Results if filtered */}
              {scoutPosFilter !== 'ALL' && scoutingReport.positionPicks && scoutingReport.positionPicks.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-black text-white mb-3 flex items-center gap-2">
                    <span>Otras opciones destacadas para el puesto de {scoutPosFilter}</span>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {scoutingReport.positionPicks.map(p => (
                      <div key={p.id} className="bg-[#121926] p-3 rounded-xl border border-[#213045] flex items-center justify-between">
                        <div className="flex items-center gap-2.5 truncate">
                          <img src={p.imageUrl} alt="" className="w-9 h-9 rounded-lg object-cover bg-[#192336] shrink-0" />
                          <div className="truncate">
                            <p className="text-xs font-bold text-white truncate">{p.name}</p>
                            <p className="text-[10px] text-slate-400">{p.ovr} OVR · {p.val}M €</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleSignRecommendation(p)}
                          className="bg-[#1b283d] hover:bg-[#00ff87] text-white hover:text-black font-black p-1.5 rounded-lg text-[10px] transition-colors shrink-0"
                          title="Fichar con IA"
                        >
                          Fichar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* 2. TACTICS TAB */}
          {activeTab === 'tactics' && (
            <div className="space-y-6">
              
              {/* Rival Picker */}
              <div className="bg-[#121a28] p-4 rounded-2xl border border-[#213045] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#182336] p-1.5 flex items-center justify-center shrink-0 border border-[#28384f]">
                    <img src={getClubLogo(selectedOpponent)} alt="" className="max-w-full max-h-full object-contain" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Próximo Rival a Analizar</span>
                    <h3 className="text-base font-black text-white">{selectedOpponent}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select
                    value={selectedOpponent}
                    onChange={(e) => setSelectedOpponent(e.target.value)}
                    className="bg-[#162133] border border-[#293951] text-white text-xs font-bold rounded-xl px-3 py-2 w-full sm:w-64 focus:outline-none focus:border-[#00ff87]"
                  >
                    {ALL_PRESET_CLUBS.map(club => (
                      <option key={club.id} value={club.name}>{club.name} ({club.league})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Scouting Intel Bar */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-[#111825] border border-[#202e42] p-4 rounded-2xl">
                  <span className="text-[10px] font-black uppercase text-amber-400 block mb-1">⚠️ Principal Amenaza Rival</span>
                  <p className="text-sm font-black text-white">{tacticsPreview.dangerPlayer}</p>
                  <p className="text-[11px] text-slate-400 mt-1">Conviene encimar con el MCD y no concederle tiro fácil.</p>
                </div>

                <div className="bg-[#111825] border border-[#202e42] p-4 rounded-2xl">
                  <span className="text-[10px] font-black uppercase text-emerald-400 block mb-1">🎯 Punto Débil a Explotar</span>
                  <p className="text-xs font-bold text-slate-200 mt-1">{tacticsPreview.weakSpot}</p>
                </div>

                <div className="bg-[#111825] border border-[#202e42] p-4 rounded-2xl">
                  <span className="text-[10px] font-black uppercase text-cyan-400 block mb-1">📈 Pronóstico de Victoria</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xl font-black text-[#00ff87]">{tacticsPreview.probabilities.win}%</span>
                    <span className="text-xs text-slate-400 font-semibold">(Empate: {tacticsPreview.probabilities.draw}% · Derrota: {tacticsPreview.probabilities.loss}%)</span>
                  </div>
                </div>
              </div>

              {/* 3 Counter Tactical Plans */}
              <div className="space-y-4">
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#00ff87]" />
                  <span>Planes de Partido Recomendados por {currentCoach.name}</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {tacticsPreview.tacticalPlans.map((plan, idx) => (
                    <div 
                      key={plan.id}
                      className="bg-[#111826] border border-[#213047] hover:border-[#00ff87]/60 rounded-2xl p-4 flex flex-col justify-between transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-black text-white">{plan.name}</span>
                          <span className="bg-[#1c293c] text-[#00ff87] text-[10px] font-black px-2 py-0.5 rounded">
                            {plan.formation}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed mb-3">
                          {plan.summary}
                        </p>

                        <div className="space-y-2 bg-[#0c131f] p-3 rounded-xl border border-[#1b2638] text-[11px] mb-3">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Presión:</span>
                            <span className="text-slate-200 font-bold">{plan.pressingStyle}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Ritmo de pase:</span>
                            <span className="text-slate-200 font-bold">{plan.passingSpeed}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Profundidad de bloque:</span>
                            <span className="text-[#00ff87] font-bold">{plan.depth} / 100</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handlePublishTactics(plan)}
                        className="w-full bg-[#182538] hover:bg-[#00ff87] text-white hover:text-black font-black py-2 rounded-xl text-xs transition-colors text-center"
                      >
                        📋 Publicar Plan Táctico en el Feed
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* 3. YOUTH ACADEMY & PROGRESION */}
          {activeTab === 'youth' && (
            <div className="space-y-6">
              <div className="bg-[#121a28] p-4 rounded-2xl border border-[#202e42] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">Cantera & Futuro</span>
                  <h3 className="text-sm font-black text-white">{youthReport.reportSummary}</h3>
                </div>
                <div className="bg-[#18253a] px-3 py-1.5 rounded-xl border border-[#24354c] text-xs font-black text-[#00ff87] shrink-0">
                  {youthReport.totalYoungsters} Jóvenes en plantilla
                </div>
              </div>

              {youthReport.prospects.length === 0 ? (
                <div className="text-center py-10 bg-[#121926] rounded-2xl border border-[#212f43]">
                  <p className="text-slate-400 text-sm">No hay futbolistas menores de 23 años en la plantilla actual.</p>
                  <button
                    onClick={() => setActiveTab('scout')}
                    className="mt-3 bg-[#00ff87] text-black font-black px-4 py-2 rounded-xl text-xs inline-flex items-center gap-2"
                  >
                    <span>Ir al Ojeador IA y buscar Perlas Sub-21</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {youthReport.prospects.map(prospect => (
                    <div 
                      key={prospect.id}
                      className="bg-[#111826] border border-[#213047] rounded-2xl p-4 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="bg-[#172436] text-amber-400 text-[10px] font-black px-2 py-0.5 rounded border border-amber-500/20">
                            Rol: {prospect.role}
                          </span>
                          <span className="text-xs font-black text-slate-300">
                            Potencial: <span className="text-[#00ff87] font-black">{prospect.potentialRating} OVR</span>
                          </span>
                        </div>

                        <div className="flex items-center gap-3 mb-3">
                          <img src={prospect.photo} alt="" className="w-12 h-12 rounded-xl object-cover bg-[#172233]" />
                          <div>
                            <h4 className="text-sm font-black text-white flex items-center gap-2">
                              <span>{prospect.name}</span>
                              <span className="text-[10px] bg-[#223249] px-1.5 py-0.5 rounded text-slate-300">{prospect.position}</span>
                            </h4>
                            <p className="text-xs text-slate-400">{prospect.age} años · Actual: <span className="text-white font-bold">{prospect.rating} OVR</span></p>
                          </div>
                        </div>

                        <div className="bg-[#0e1522] p-3 rounded-xl border border-[#1d2a3d] text-xs space-y-1.5 mb-3">
                          <p className="text-slate-300 font-semibold">
                            🎯 <span className="text-slate-400">Plan de Entrenamiento:</span> {prospect.focus}
                          </p>
                          <p className="text-[11px] text-emerald-400">
                            ⚡ Mejora estimada: {prospect.statBoost}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            💡 {prospect.advice}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleApplyYouthPlan(prospect)}
                        className="bg-[#18263a] hover:bg-[#00ff87] text-white hover:text-black font-black py-2 rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Aplicar Plan de Desarrollo</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 4. PRESS CONFERENCE & LOCKER ROOM SPEECH */}
          {activeTab === 'press' && (
            <div className="space-y-6">
              
              {/* Pre-Match Locker Room Speech */}
              <div className="bg-gradient-to-r from-[#172338] via-[#131c2d] to-[#152033] p-5 rounded-2xl border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-amber-400 flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
                    <span>{speech.title}</span>
                  </span>
                  <button
                    onClick={handlePublishSpeech}
                    className="bg-amber-500 hover:bg-amber-400 text-black font-black px-3 py-1.5 rounded-xl text-xs transition-colors"
                  >
                    📢 Publicar Arenga al Feed
                  </button>
                </div>

                <p className="text-sm italic font-medium text-slate-100 bg-black/30 p-4 rounded-xl border border-white/5 leading-relaxed">
                  "{speech.speech}"
                </p>
                <p className="text-[11px] text-slate-400">
                  Estilo motivacional generado a partir de la personalidad de <span className="text-white font-bold">{currentCoach.name}</span>.
                </p>
              </div>

              {/* Interactive Press Conference */}
              <div className="space-y-4">
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <Mic className="w-4 h-4 text-[#00ff87]" />
                  <span>Rueda de Prensa Oficial del {career.manager.club}</span>
                </h4>

                <div className="space-y-4">
                  {pressQuestions.map((q) => {
                    const answered = answeredQuestions[q.id];
                    return (
                      <div key={q.id} className="bg-[#121a28] border border-[#213147] rounded-2xl p-4 space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="bg-[#1c293c] text-slate-300 font-bold text-[10px] px-2 py-0.5 rounded">
                            {q.media}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">Pregunta de {q.journalist}:</span>
                        </div>

                        <p className="text-sm font-bold text-white">
                          "{q.question}"
                        </p>

                        <div className="space-y-2 pt-2">
                          {q.options.map((opt, optIdx) => (
                            <button
                              key={optIdx}
                              disabled={answered !== undefined}
                              onClick={() => {
                                setAnsweredQuestions(prev => ({ ...prev, [q.id]: opt }));
                                triggerToast(`Respuesta enviada: ${opt.moralImpact}`);
                              }}
                              className={`w-full text-left p-3 rounded-xl border transition-all text-xs font-semibold ${
                                answered === opt
                                  ? 'bg-[#00ff87]/20 border-[#00ff87] text-white'
                                  : answered !== undefined
                                  ? 'bg-[#101724] border-[#1d293d] text-slate-500 opacity-60'
                                  : 'bg-[#151f30] border-[#24334a] text-slate-300 hover:border-[#00ff87] hover:text-white'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span>"{opt.text}"</span>
                                <span className="text-[10px] text-emerald-400 font-bold ml-2 shrink-0">
                                  {opt.moralImpact}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* 5. MATCH CHRONICLE TAB */}
          {activeTab === 'chronicle' && (
            <div className="space-y-5">
              <div className="bg-[#111825] border border-[#223249] p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-[#202f45] pb-3">
                  <div>
                    <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">Portada Deportiva Oficial</span>
                    <h3 className="text-base font-black text-white mt-0.5">{chronicle.headlines[0]}</h3>
                  </div>
                  <button
                    onClick={handlePublishChronicle}
                    className="bg-[#00ff87] text-[#080d14] font-black px-4 py-2 rounded-xl text-xs hover:bg-[#00e578] transition-colors shrink-0"
                  >
                    📰 Publicar en el Feed
                  </button>
                </div>

                <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                  <p className="font-semibold text-white bg-[#152031] p-3 rounded-xl border border-[#23344d]">
                    {chronicle.lead}
                  </p>
                  <p>{chronicle.analysis}</p>
                </div>

                {/* Fan Quotes */}
                <div className="border-t border-[#1f2d43] pt-3 space-y-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Reacciones de la Afición</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {chronicle.fanReactions.map((f, idx) => (
                      <div key={idx} className="bg-[#151f30] p-2.5 rounded-xl border border-[#23334c] text-[11px]">
                        <span className="font-bold text-[#00ff87] block text-[10px]">{f.user}</span>
                        <span className="text-slate-300">{f.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 6. CHAT TAB */}
          {activeTab === 'chat' && (
            <div className="flex flex-col h-[520px]">
              
              {/* Quick Prompt Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-2 shrink-0">
                <span className="text-[11px] font-bold text-slate-400 shrink-0">Consultas Rápidas:</span>
                {[
                  "🔍 ¿A quién debo fichar para mejorar mi once?",
                  "🛡️ ¿Cómo gano a mi próximo rival?",
                  "🔥 Dame una arenga para motivar al equipo",
                  "🌱 ¿Qué perla de la cantera debo potenciar?",
                  "💼 ¿A qué jugadores me recomiendas vender?"
                ].map((promptText, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(promptText)}
                    className="bg-[#141d2d] hover:bg-[#1f2d45] text-slate-300 hover:text-white border border-[#24344d] rounded-xl px-3 py-1.5 text-xs font-semibold shrink-0 transition-colors"
                  >
                    {promptText}
                  </button>
                ))}
              </div>

              {/* Message List */}
              <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-[#0c121e] rounded-2xl border border-[#1f2d43] mb-3">
                {messages.map((m, idx) => {
                  const isAi = m.sender === 'ai';
                  return (
                    <div key={idx} className={`flex items-start gap-2.5 ${isAi ? '' : 'flex-row-reverse'}`}>
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                        isAi 
                          ? 'bg-[#00ff87] text-[#080d14]' 
                          : 'bg-[#293c59] text-white'
                      }`}>
                        {isAi ? 'IA' : 'TÚ'}
                      </div>
                      <div className={`max-w-[80%] rounded-2xl p-3.5 text-xs leading-relaxed whitespace-pre-wrap ${
                        isAi 
                          ? 'bg-[#151f30] text-slate-200 border border-[#22334c]' 
                          : 'bg-[#00ff87] text-[#080d14] font-bold shadow-md'
                      }`}>
                        {m.text}
                      </div>
                    </div>
                  );
                })}

                {isTyping && (
                  <div className="flex items-center gap-2 text-xs text-[#00ff87] italic p-2">
                    <span className="animate-spin">⚽</span>
                    <span>{currentCoach.name} está analizando la pizarra táctica...</span>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2 shrink-0"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={`Pregúntale a ${currentCoach.name} sobre táctica, fichajes, contratos o partidos...`}
                  className="flex-1 bg-[#131b29] border border-[#25354e] rounded-2xl px-4 py-3 text-white text-xs font-medium focus:outline-none focus:border-[#00ff87]"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="bg-[#00ff87] hover:bg-[#00e578] disabled:opacity-40 text-[#080d14] font-black px-5 py-3 rounded-2xl text-xs flex items-center gap-2 transition-all shadow-md shadow-[#00ff87]/20"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Enviar</span>
                </button>
              </form>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
