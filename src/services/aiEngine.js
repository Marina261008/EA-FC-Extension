// AI Engine 2.0 for EA Sports FC Career Hub
// Comprehensive Tactical Assistant, Youth Academy Director, Intelligent Scouting & Media Hub
import { DATABASE_PLAYERS, ALL_PRESET_CLUBS, convertRosterPlayerToSquad, getRealPlayerPhoto } from '../clubsData';

const GEMINI_KEY_STORAGE = 'ea_fc_gemini_api_key';

export function getSavedGeminiKey() {
  return localStorage.getItem(GEMINI_KEY_STORAGE) || '';
}

export function saveGeminiKey(key) {
  if (key && key.trim()) {
    localStorage.setItem(GEMINI_KEY_STORAGE, key.trim());
  } else {
    localStorage.removeItem(GEMINI_KEY_STORAGE);
  }
}

// COACH PERSONALITIES
export const COACH_PERSONALITIES = [
  {
    id: 'guardiola',
    name: 'Pep Guardiola',
    tag: '🧠 Posesión & Geometría',
    shortTitle: 'Filosofía Posicional',
    color: '#38bdf8',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    philosophy: 'Dominio mediante posesión, superioridad numérica interior y paciencia táctica.',
    formation: '4-3-3 Ofensivo / 3-2-4-1',
    motto: '"El balón es nuestro. Quien tiene la pelota no corre detrás de nadie."',
    speechStyle: 'reflexivo, apasionado del detalle y enfocado en la perfección de los pases'
  },
  {
    id: 'simeone',
    name: 'Cholo Simeone',
    tag: '⚔️ Garra & Muralla Defensiva',
    shortTitle: 'Cholismo Puro',
    color: '#ef4444',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    philosophy: 'Bloque bajo inexpugnable, solidaridad máxima, transiciones supersónicas y pelota parada.',
    formation: '4-4-2 Férreo / 5-3-2',
    motto: '"El esfuerzo no se negocia. Partido a partido, el corazón gana batallas."',
    speechStyle: 'enérgico, bélico, motivacional y centrado en la disciplina inquebrantable'
  },
  {
    id: 'klopp',
    name: 'Jürgen Klopp',
    tag: '⚡ Gegenpressing & Rock\'n\'Roll',
    shortTitle: 'Heavy Metal Football',
    color: '#f59e0b',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    philosophy: 'Presión asfixiante tras pérdida, verticalidad salvaje, sprints continuos y desmarques al espacio.',
    formation: '4-3-3 Alta Presión / 4-2-3-1',
    motto: '"El gegenpressing es el mejor creador de juego del planeta. ¡Jugamos a tope!"',
    speechStyle: 'efusivo, eléctrico, cercano y pidiendo máxima adrenalina a los futbolistas'
  },
  {
    id: 'ancelotti',
    name: 'Carlo Ancelotti',
    tag: '👑 Gestión de Estrellas & Calma',
    shortTitle: 'Mano Izquierda & Libertad',
    color: '#a855f7',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    philosophy: 'Equilibrio pragmático, libertad al talento diferencial, control de tiempos y frialdad en finales.',
    formation: '4-3-3 Flexible / 4-3-1-2',
    motto: '"El fútbol es sencillo si confías en el talento y mantienes la cabeza fría."',
    speechStyle: 'tranquilo, sabio, protector del vestuario e inspirador de confianza'
  }
];

// 1. SQUAD ANALYSIS & AI SCOUTING 2.0
export function analyzeSquadAndRecommend(career, season, filterCategory = 'ALL') {
  const squad = season.squad || [];
  const budget = season.budget?.transfer || 35000000;
  const clubName = career.manager.club;

  // Key squad statistics
  const totalRating = squad.reduce((acc, p) => acc + (p.rating || 75), 0);
  const avgRating = squad.length > 0 ? (totalRating / squad.length).toFixed(1) : 77;
  const avgAge = squad.length > 0 ? (squad.reduce((acc, p) => acc + (p.age || 24), 0) / squad.length).toFixed(1) : 25;

  const porList = squad.filter(p => p.category === 'POR');
  const defList = squad.filter(p => p.category === 'DEF');
  const medList = squad.filter(p => p.category === 'MED');
  const delList = squad.filter(p => p.category === 'DEL');

  // Diagnostic logic
  let weakCategory = 'DEF';
  let weakReason = 'Falta fondo de armario defensivo y jerarquía en balones aéreos.';

  if (delList.length < 3 || delList.every(p => p.rating < 81)) {
    weakCategory = 'DEL';
    weakReason = 'El equipo necesita mayor pegada ofensiva para desatascar encuentros cerrados.';
  } else if (medList.length < 5 || medList.every(p => (p.ovr || p.rating) < 80)) {
    weakCategory = 'MED';
    weakReason = 'La sala de máquinas necesita más fluidez en la distribución y contención física.';
  } else if (defList.length < 6) {
    weakCategory = 'DEF';
    weakReason = 'Poco relevo en la zaga central; una lesión comprometería la temporada.';
  } else if (porList.length < 2 || (porList[0] && porList[0].age > 33)) {
    weakCategory = 'POR';
    weakReason = 'Conviene proyectar la portería del futuro con un relevo solvente.';
  }

  // Filter candidates from authentic database players (cannot scout own players or own club)
  const currentNames = new Set(squad.map(p => (p.name || '').toLowerCase().trim()));
  const clubLower = (clubName || '').toLowerCase().trim();
  const available = DATABASE_PLAYERS.filter(p => {
    const isOurPlayer = currentNames.has((p.name || '').toLowerCase().trim());
    const team = (p.teamName || '').toLowerCase().trim();
    const isOurClub = team === clubLower || (clubLower && (team.includes(clubLower) || clubLower.includes(team)));
    return !isOurPlayer && !isOurClub;
  });

  // 1. Prioridad Táctica (Weak Spot)
  const weakCandidates = available.filter(p => {
    const isAffordable = (p.val || 25) * 1000000 <= budget * 1.1;
    if (weakCategory === 'DEL') return ['ST', 'CF', 'LW', 'RW'].includes(p.pos) && isAffordable;
    if (weakCategory === 'MED') return ['CM', 'CDM', 'CAM', 'LM', 'RM'].includes(p.pos) && isAffordable;
    if (weakCategory === 'DEF') return ['CB', 'LB', 'RB', 'LWB', 'RWB'].includes(p.pos) && isAffordable;
    return (p.pos === 'GK') && isAffordable;
  }).sort((a, b) => (b.ovr || 0) - (a.ovr || 0));

  const topPick = weakCandidates[0] || available[0];

  // 2. Wonderkids Sub-21
  const wonderkids = available
    .filter(p => p.age <= 21 && (p.val || 20) * 1000000 <= budget)
    .sort((a, b) => ((b.ovr || 75) + (b.pac || 75)) - ((a.ovr || 75) + (a.pac || 75)));
  const wonderkidPick = wonderkids[0] || available[1];

  // 3. Gangas Calidad/Precio (< 18M € y >= 79 OVR)
  const bargains = available
    .filter(p => (p.val || 15) <= 20 && (p.ovr || 75) >= 78 && ((p.val || 15) * 1000000) <= budget)
    .sort((a, b) => (b.ovr || 0) / (b.val || 1) - (a.ovr || 0) / (a.val || 1));
  const bargainPick = bargains[0] || available[2];

  // 4. Estrella Consagrada (> 82 OVR)
  const stars = available
    .filter(p => (p.ovr || 75) >= 81 && (p.val || 35) * 1000000 <= budget * 1.3)
    .sort((a, b) => (b.ovr || 0) - (a.ovr || 0));
  const starPick = stars[0] || available[3];

  // 5. Oportunidades por posición
  const posMap = {
    'POR': ['GK'],
    'DEF': ['CB', 'LB', 'RB', 'LWB', 'RWB'],
    'MED': ['CM', 'CDM', 'CAM', 'LM', 'RM'],
    'DEL': ['ST', 'CF', 'LW', 'RW']
  };

  let positionPicks = [];
  if (filterCategory !== 'ALL' && posMap[filterCategory]) {
    positionPicks = available
      .filter(p => posMap[filterCategory].includes(p.pos) && (p.val || 20) * 1000000 <= budget * 1.15)
      .sort((a, b) => (b.ovr || 0) - (a.ovr || 0))
      .slice(0, 6);
  }

  const recommendations = [
    {
      id: 'rec-priority',
      type: 'Prioridad Táctica',
      badge: '🎯 Fichaje Imprescindible',
      matchScore: '98%',
      reason: `Soluciona la carencia crítica de ${weakCategory}. ${topPick.name} encaja directamente en el once titular del ${clubName}.`,
      player: topPick,
      financeImpact: `Consume el ${Math.min(100, Math.round(((topPick.val || 20) * 1000000 / budget) * 100))}% de tus fondos de traspaso.`
    },
    {
      id: 'rec-wonderkid',
      type: 'Perla de Futuro',
      badge: '💎 Wonderkid Sub-21',
      matchScore: '95%',
      reason: `Tiene solo ${wonderkidPick.age} años y una media de ${wonderkidPick.ovr}. Su margen de crecimiento potencial lo convertirá en estrella mundial.`,
      player: wonderkidPick,
      financeImpact: `Revalorización estimada: +${Math.round((wonderkidPick.val || 20) * 1.8)}M € en dos temporadas.`
    },
    {
      id: 'rec-bargain',
      type: 'Ganga de Mercado',
      badge: '💰 Relación Calidad-Precio',
      matchScore: '93%',
      reason: `Rendimiento de alto nivel a coste controlado (${bargainPick.val}M €). Salva tus cuentas sin resentir el plano deportivo.`,
      player: bargainPick,
      financeImpact: `Ahorras ${Math.max(5, (budget / 1000000 - (bargainPick.val || 10))).toFixed(0)}M € para otras operaciones.`
    },
    {
      id: 'rec-star',
      type: 'Fichaje Estrella',
      badge: '⭐ Salto de Calidad',
      matchScore: '89%',
      reason: `Un futbolista de élite (${starPick.ovr} OVR) capaz de decidir partidos grandes en Europa y liderar el vestuario.`,
      player: starPick,
      financeImpact: `Impacto en venta de camisetas y patrocinios comerciales estimado en +15%.`
    }
  ];

  return {
    diagnostics: {
      avgRating,
      avgAge,
      squadSize: squad.length,
      weakCategory,
      weakReason,
      transferBudgetFormatted: `${(budget / 1000000).toFixed(1)} M €`,
      wageBudgetFormatted: `${((season.budget?.wage || 800000) / 1000).toFixed(0)}k €/sem`
    },
    recommendations,
    positionPicks
  };
}

// 2. YOUTH ACADEMY & PROGRESION SUB-22
export function analyzeYouthAcademy(squad, clubName) {
  const youngsters = (squad || [])
    .filter(p => (p.age || 25) <= 23)
    .sort((a, b) => (a.age || 20) - (b.age || 20));

  if (youngsters.length === 0) {
    return {
      totalYoungsters: 0,
      reportSummary: `La plantilla del ${clubName} es veterana. El Míster IA aconseja peinar filiales o el mercado sub-21 para no comprometer el futuro.`,
      prospects: []
    };
  }

  const prospects = youngsters.map((p, idx) => {
    let focus = 'Desarrollo Equilibrado';
    let role = 'Rotación de Copa';
    let potentialRating = Math.min(96, (p.rating || 74) + (p.age <= 20 ? 8 : p.age <= 22 ? 5 : 3));

    if (p.category === 'DEL') {
      focus = 'Definición, Sangre Fría & Desmarques al Espacio';
      role = 'Revulsivo Minuto 60';
    } else if (p.category === 'MED') {
      focus = 'Visión de Juego, Pases Filtrados & Resistencia';
      role = 'Titular Progresivo';
    } else if (p.category === 'DEF') {
      focus = 'Anticipación, Duelos 1vs1 & Salida de Balón';
      role = 'Central de Futuro';
    } else {
      focus = 'Reflejos Felinos & Juego Aéreo';
      role = 'Guardián del Mañana';
    }

    return {
      id: p.id,
      name: p.name,
      age: p.age,
      position: p.position,
      rating: p.rating || 74,
      potentialRating,
      photo: p.photo,
      focus,
      role,
      statBoost: '+2 Ritmo / +2 Visión / +1 OVR',
      advice: `Dale al menos 15-20 partidos esta temporada para desbloquear su potencial de ${potentialRating} en EA Sports FC.`
    };
  });

  return {
    totalYoungsters: youngsters.length,
    reportSummary: `Dispones de ${youngsters.length} perlas con margen de crecimiento en el ${clubName}. Con el plan adecuado, serán la columna vertebral del proyecto.`,
    prospects
  };
}

// 3. MATCH PREDICTION & COUNTER-TACTICAL SCOUTING
export function predictMatchAgainst(opponentName, userClub, season, personalityId = 'guardiola') {
  const oppClub = ALL_PRESET_CLUBS.find(c => c.name.toLowerCase() === opponentName.toLowerCase()) || ALL_PRESET_CLUBS[0];
  const squad = season.squad || [];
  const coach = COACH_PERSONALITIES.find(cp => cp.id === personalityId) || COACH_PERSONALITIES[0];

  const userRating = squad.length > 0 
    ? squad.reduce((acc, p) => acc + (p.rating || 75), 0) / squad.length
    : 78;
  const oppRating = oppClub.budget > 100000000 ? 85 : oppClub.budget > 50000000 ? 81 : 77;

  let winProb = Math.min(88, Math.max(12, Math.round(50 + (userRating - oppRating) * 6)));
  let drawProb = Math.round((100 - winProb) * 0.35);
  let lossProb = 100 - winProb - drawProb;

  const dangerPlayer = oppClub.roster?.[0]?.name || "la delantera rival";
  const weakSpot = oppRating > 82 
    ? "Espalda de sus laterales cuando suben al ataque desordenados." 
    : "Fragilidad en balones parados y pérdida de marcas en centros laterales.";

  // Tactical plans
  const tacticalPlans = [
    {
      id: 'dominate',
      name: 'Plan A: Asedio & Posesión',
      formation: '4-3-3 Ofensivo',
      depth: 70,
      width: 60,
      passingSpeed: 'Rápido y al primer toque',
      pressingStyle: 'Presión tras pérdida asfixiante',
      summary: `Inunda el campo rival y somete al ${oppClub.name} con posesiones largas hasta encontrar el desmarque interior.`
    },
    {
      id: 'balance',
      name: 'Plan B: Control Equilibrado',
      formation: '4-2-3-1 Clásico',
      depth: 52,
      width: 50,
      passingSpeed: 'Construcción equilibrada',
      pressingStyle: 'Bloque medio ordenado',
      summary: `Mantiene las líneas juntas para anular a ${dangerPlayer} y atacar los espacios vacíos con transiciones precisas.`
    },
    {
      id: 'counter',
      name: 'Plan C: Muralla & Contragolpe Letal',
      formation: '5-3-2 / 4-4-2 Férreo',
      depth: 35,
      width: 45,
      passingSpeed: 'Balones largos verticales al extremo',
      pressingStyle: 'Repliegue bajo y robo',
      summary: `Cierra todas las vías interiores. En cuanto recuperes la pelota, balón vertical hacia las bandas explotando que: ${weakSpot}`
    }
  ];

  return {
    opponent: oppClub,
    coach,
    probabilities: { win: winProb, draw: drawProb, loss: lossProb },
    dangerPlayer,
    weakSpot,
    tacticalPlans,
    keyAdvice: `El ${oppClub.name} basa su juego en transiciones de ${dangerPlayer}. Para contrarrestarlo bajo la batuta de ${coach.name}, ${coach.speechStyle}.`
  };
}

// 4. PRE-MATCH LOCKER ROOM SPEECH GENERATOR
export function generateLockerRoomSpeech(clubName, opponentName, personalityId = 'guardiola') {
  const coach = COACH_PERSONALITIES.find(cp => cp.id === personalityId) || COACH_PERSONALITIES[0];

  if (coach.id === 'simeone') {
    return {
      title: `⚔️ Arenga Cholista: Sangre, Sudor y Partido a Partido`,
      lead: `Vestuario antes de medirse al ${opponentName}`,
      speech: `¡Mírame a los ojos! ¿Sabéis qué significa vestir la camiseta del ${clubName}? Significa que hoy no regalamos ni un solo metro. Cada dividida es nuestra vida. Si nos golpean, nos levantamos más fuertes. El ${opponentName} podrá tener millones o nombres, pero no tienen el hambre que tenemos nosotros aquí dentro. ¡Salid ahí fuera, morded desde el segundo cero y dejadlo todo en el césped! ¡A POR ELLOS!`
    };
  }

  if (coach.id === 'klopp') {
    return {
      title: `⚡ Charla Heavy Metal: Gegenpressing al Máximo`,
      lead: `La caldera del vestuario antes del choque`,
      speech: `¡Muchachos! ¡Hoy quiero ver sonrisas y fuego en el pecho! Cuando ellos tengan el balón, que sientan que juegan contra 20 tíos. ¡PUM! ¡Presión inmediata tras pérdida! Que no respiren. Quiero ver ritmo eléctrico, diversión y valentía. Jugamos para la gente que se desgañita en la grada del ${clubName}. ¡Hagamos que esta noche sea inolvidable!`
    };
  }

  if (coach.id === 'ancelotti') {
    return {
      title: `👑 Charla Señorial: Tranquilidad y Jerarquía`,
      lead: `Serenidad en la previa del encuentro`,
      speech: `Tranquilos. Sabéis exactamente lo que hay que hacer. En el ${clubName} hemos nacido para ganar noches como esta. Confiad en vuestro talento y no os precipitéis. El ${opponentName} intentará incomodarnos, pero si conservamos el orden y jugamos con cabeza fría, los goles llegarán solos. Divertíos con responsabilidad.`
    };
  }

  // Guardiola default
  return {
    title: `🧠 Pizarra Magistral: El Balón es Nuestra Fuerza`,
    lead: `Instrucciones finales en la sala de gala`,
    speech: `Escuchadme bien: el balón no se regala jamás. Hacemos tres toques, abrimos el campo y encontramos al hombre libre entre líneas. El ${opponentName} no puede hacernos daño si no la huele. Tened paciencia, moveos en rombos y sed valientes para encarar en el último tercio. ¡Vamos a dar una lección de fútbol!`
  };
}

// 5. MATCH CHRONICLE & HEADLINES GENERATOR
export function generateMatchChronicle(match, clubName, managerName) {
  if (!match) return null;

  const isWin = match.result === 'Victoria';
  const isDraw = match.result === 'Empate';
  const opponent = match.homeTeam === clubName ? match.awayTeam : match.homeTeam;
  const userScore = match.homeTeam === clubName ? match.homeScore : match.awayScore;
  const oppScore = match.homeTeam === clubName ? match.awayScore : match.homeScore;
  const scorers = match.scorers || [];
  const topScorer = scorers[0]?.player || 'el bloque colectivo';

  let headlines = [];
  let lead = '';
  let analysis = '';

  if (isWin) {
    headlines = [
      `¡FESTIVAL DEL ${clubName.toUpperCase()}! GOLPE DE AUTORIDAD ANTE EL ${opponent.toUpperCase()} (${userScore}-${oppScore})`,
      `El plan maestro de ${managerName} desarbola al ${opponent}`,
      `Noche mágica: el ${clubName} enamora a la afición con un fútbol total`
    ];
    lead = `Una exhibición de pegada, orden y carácter catapultó al ${clubName} hacia un triunfo memorable. El conjunto dirigido por ${managerName} no dio opción al rival desde los primeros compases.`;
    analysis = `Con una presión coordinada y una circulación vertiginosa por bandas, la figura de ${topScorer} decantó una batalla táctica de altísimo nivel. La grada despidió al equipo con una sonora ovación en pie.`;
  } else if (isDraw) {
    headlines = [
      `TABLAS EN UN DERBI VIBRANTE: ${clubName.toUpperCase()} ${userScore} - ${oppScore} ${opponent.toUpperCase()}`,
      `Un punto de coraje: el ${clubName} sobrevive a la trampa del ${opponent}`,
      `Reparto de puntos tras noventa minutos de máxima tensión física`
    ];
    lead = `Un duelo cerrado y lleno de detalles tácticos concluyó con reparto de puntos. Ambos conjuntos buscaron el triunfo con ahínco hasta el silbato final.`;
    analysis = `El ${clubName} mostró entereza competitiva para resistir los arreones del ${opponent}, sumando un punto de gran valor para la tabla clasificatoria.`;
  } else {
    headlines = [
      `GOLPE DURO: EL ${opponent.toUpperCase()} SORPRENDE AL ${clubName.toUpperCase()} (${oppScore}-${userScore})`,
      `Tarde aciaga para los de ${managerName}: lecciones valiosas para levantarse`,
      `El ${clubName} tropieza en un partido marcado por la falta de puntería`
    ];
    lead = `La falta de contundencia en las áreas condenó al ${clubName} en un encuentro donde los detalles marcaron la balanza en su contra.`;
    analysis = `${managerName} reconoció la necesidad de ajustar la contundencia defensiva y prometió una respuesta contundente en la próxima jornada de liga.`;
  }

  return {
    headlines,
    lead,
    analysis,
    fanReactions: [
      { user: '@GolDeOro_Club', text: `¡Orgulloso de estos colores! ¡A muerte con el míster! 🙌🔥` },
      { user: '@AnalisisTacticoFC', text: `Partidazo en el plano posicional. Si seguimos así este año tocamos metal.` },
      { user: '@SocioNumero12', text: `Lo de ${topScorer} hoy ha sido para enmarcar. ¡Qué barbaridad de partido!` }
    ]
  };
}

// 6. INTERACTIVE PRESS CONFERENCE GENERATOR
export function generatePressConference(match, clubName, managerName, personalityId = 'guardiola') {
  const isWin = match?.result === 'Victoria';
  const opponent = match?.homeTeam === clubName ? match?.awayTeam : match?.homeTeam;

  return [
    {
      id: 'q1',
      media: 'Diario MARCA',
      journalist: 'Redacción de Primera',
      question: isWin 
        ? `Míster, ¿ha sido este el partido más completo y maduro del ${clubName} en lo que va de curso?`
        : `Míster, tras el tropiezo frente al ${opponent}, ¿cree que el equipo ha acusado la fatiga o un error de planteamiento?`,
      options: isWin ? [
        {
          text: "Ha sido una victoria coral. Cuando todos corren y entienden la idea táctica, somos imparables.",
          moralImpact: "+5 Moral del Vestuario",
          boardImpact: "+3 Confianza Directiva"
        },
        {
          text: "Estoy satisfecho, pero podemos jugar aún mejor. La autoexigencia debe ser máxima.",
          moralImpact: "+3 Exigencia Competitiva",
          boardImpact: "+4 Liderazgo"
        },
        {
          text: "Hay que tener los pies en el suelo. Disfrutamos hoy y mañana a pensar en el siguiente reto.",
          moralImpact: "+4 Serenidad de Grupo",
          boardImpact: "+2 Estabilidad"
        }
      ] : [
        {
          text: "Asumo toda la responsabilidad técnica. Nos levantaremos juntos porque este vestuario es una familia.",
          moralImpact: "+4 Unión del Vestuario",
          boardImpact: "+2 Respeto Directivo"
        },
        {
          text: "Cometimos errores inadmisibles que en la élite se pagan caros. Hay que apretar los dientes.",
          moralImpact: "+2 Tensión Competitiva",
          boardImpact: "+1 Disciplina"
        },
        {
          text: "El calendario es exigente, pero no hay excusas. La autocrítica empezará en el entrenamiento de mañana.",
          moralImpact: "+3 Concentración",
          boardImpact: "+3 Foco Deportivo"
        }
      ]
    },
    {
      id: 'q2',
      media: 'El Chiringuito de Jugones',
      journalist: 'Enviado Especial',
      question: `¿Habrá movimientos en el mercado de fichajes en los próximos días o la plantilla actual es inamovible?`,
      options: [
        {
          text: "La dirección deportiva y yo tenemos muy claros los perfiles necesarios para dar un salto cualitativo.",
          moralImpact: "+2 Expectación de Mercado",
          boardImpact: "+3 Ambición Institucional"
        },
        {
          text: "Confío al 200% en los jugadores que tengo aquí. Este grupo tiene potencial de sobra.",
          moralImpact: "+6 Fidelidad del Vestuario",
          boardImpact: "+2 Paz Financiera"
        },
        {
          text: "Hasta el último minuto del mercado cualquier club grande está atento a las oportunidades.",
          moralImpact: "+3 Competencia Interna",
          boardImpact: "+2 Flexibilidad"
        }
      ]
    }
  ];
}

// 7. FREE CHAT ASSISTANT (Hybrid Local NLP + Optional Gemini API)
export async function askMisterAI(prompt, career, season, personalityId = 'guardiola') {
  const apiKey = getSavedGeminiKey();
  const coach = COACH_PERSONALITIES.find(cp => cp.id === personalityId) || COACH_PERSONALITIES[0];

  // If user provided a Gemini API Key, call Gemini!
  if (apiKey) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Eres ${coach.name} (${coach.tag}), actuando como Asistente Técnico y Director Deportivo de Inteligencia Artificial para el club "${career.manager.club}" en el videojuego EA Sports FC.
Entrenador: ${career.manager.name}.
Filosofía: ${coach.philosophy}. Lema: ${coach.motto}.
Presupuesto: ${(season.budget?.transfer / 1000000).toFixed(1)} M €.
Plantilla: ${season.squad?.length || 20} jugadores (estrellas: ${season.squad?.slice(0, 3).map(p => p.name).join(', ')}).
Responde en primera persona con la personalidad de ${coach.name}, de forma apasionada, profesional, con jerga futbolística de EA FC, en español y con formato Markdown rico y emojis.

Pregunta del usuario: "${prompt}"`
            }]
          }]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      }
    } catch (e) {
      console.warn("Gemini API call failed, falling back to local football intelligence", e);
    }
  }

  // Enhanced Local Football Intelligence (100% Offline, instantaneous)
  const q = prompt.toLowerCase();
  const club = career.manager.club;
  const budgetMil = ((season.budget?.transfer || 35000000) / 1000000).toFixed(0);

  if (q.includes('fichar') || q.includes('fichaje') || q.includes('recomiend') || q.includes('ojeador')) {
    const analysis = analyzeSquadAndRecommend(career, season);
    const p1 = analysis.recommendations[0].player;
    const p2 = analysis.recommendations[1].player;
    const p3 = analysis.recommendations[2].player;

    return `🎯 **Informe del Ojeador IA (${coach.name}) para el ${club}:**\n\nAnalizando tus **${budgetMil} M €** de presupuesto disponible y las debilidades del esquema, te presento los 3 objetivos prioritarios:\n\n1. **${p1.name}** (${p1.ovr} OVR, ${p1.pos}, ${p1.teamName})\n   • *Motivo:* Cubre nuestra necesidad urgente en **${analysis.diagnostics.weakCategory}**.\n   • *Precio:* Aprox. **${p1.val}M €**.\n\n2. **${p2.name}** (${p2.ovr} OVR, ${p2.pos}, ${p2.age} años)\n   • *Motivo:* Wonderkid generacional con velocidad endiablada y techo potencial de élite.\n   • *Precio:* **${p2.val}M €**.\n\n3. **${p3.name}** (${p3.ovr} OVR, ${p3.pos})\n   • *Motivo:* Oportunidad de oro calidad/precio para oxigenar el banquillo.\n\n¿Quieres que preparemos la oferta formal en la pestaña del Mercado? ✍️`;
  }

  if (q.includes('cantera') || q.includes('joven') || q.includes('promesa') || q.includes('progresion')) {
    const youth = analyzeYouthAcademy(season.squad, club);
    if (youth.prospects.length === 0) {
      return `🌱 **Cantera del ${club}:**\n\nActualmente no tienes futbolistas menores de 23 años en la plantilla principal. Te recomiendo buscar perlas sub-20 en el Ojeador IA para asegurar el relevo generacional.`;
    }
    const y1 = youth.prospects[0];
    return `🌱 **Plan de Cantera & Progresión Sub-22 (${coach.name}):**\n\nTenemos en la plantilla a **${youth.totalYoungsters} jóvenes talentos**. El más prometedor es:\n\n⭐ **${y1.name}** (${y1.age} años, ${y1.position}, ${y1.rating} OVR)\n• **Potencial Máximo:** **${y1.potentialRating} OVR**\n• **Plan de Entrenamiento recomendado:** ${y1.focus}\n• **Rol en el equipo:** ${y1.role}\n\n${y1.advice}`;
  }

  if (q.includes('tactica') || q.includes('alineacion') || q.includes('formacion') || q.includes('jugar') || q.includes('pizarra')) {
    return `📋 **Pizarra Táctica de ${coach.name}:**\n\nPara el ${club}, mi propuesta innegociable es un sistema **${coach.formation}**:\n\n• **Estilo de Juego:** ${coach.philosophy}\n• **Instrucciones de Jugadores:**\n  - Laterales con 'Ataque equilibrado' para dar amplitud.\n  - Extremos con 'Cortar hacia dentro' y 'Tirar desmarques'.\n  - Mediocentro posicional 'Quedarse atrás al atacar' y 'Cubrir el centro'.\n• **Lema en el vestuario:** ${coach.motto}\n\n¡Dominarás los partidos con personalidad y pegada! ⚡`;
  }

  if (q.includes('discurso') || q.includes('motiva') || q.includes('arenga') || q.includes('charla')) {
    const speech = generateLockerRoomSpeech(club, "el próximo rival", personalityId);
    return `${speech.title}\n\n${speech.speech}`;
  }

  if (q.includes('vender') || q.includes('venta') || q.includes('dinero') || q.includes('presupuesto')) {
    const olderPlayers = (season.squad || []).filter(p => (p.age || 25) >= 29).slice(0, 2);
    const names = olderPlayers.map(p => `**${p.name}** (${p.value || '15M €'})`).join(' y ');
    return `💼 **Estrategia Financiera & Salidas (${coach.name}):**\n\nCon **${budgetMil} M €** en caja, podemos financiar grandes fichajes dando salida a activos amortizados:\n\n• Estudia ofertas por veteranos como ${names || 'jugadores de rotación con fichas altas'}.\n• Si liberas un 20% de masa salarial, podremos incorporar un futbolista franquicia de más de 84 de media.\n• Invierte los beneficios en perlas sub-21 para multiplicar su cotización.`;
  }

  // Default response
  return `👔 **${coach.name} al mando técnico del ${club}:**\n\n${coach.motto}\n\nDisponemos de **${budgetMil} M €** de presupuesto y una plantilla con ganas de hacer historia. ¿Quieres que ojee un fichaje, preparemos la táctica del próximo encuentro o tracemos el plan de desarrollo de los canteranos?`;
}
