import { getClubLogo } from './clubsData.js';

// Helper to generate realistic official club social media posts for every event

export function createManagerPost(manager, date = '12 oct 2026') {
  const clubHandle = `@${manager.club.replace(/[^a-zA-Z0-9]/g, '')}`;
  const clubTag = `#${manager.club.replace(/[^a-zA-Z0-9]/g, '')}`;

  return {
    id: `post-mgr-${Date.now()}`,
    type: 'manager',
    author: {
      name: manager.club,
      handle: clubHandle,
      verified: true,
      avatar: manager.clubLogo || getClubLogo(manager.club)
    },
    date: date || '12 oct 2026',
    text: `🤝 ${manager.name} toma las riendas del ${manager.club}.\n\nNuevo proyecto, la misma ambición. 💛`,
    hashtags: [clubTag],
    graphic: {
      tag: 'Nuevo entrenador',
      title: `¡Bienvenido, ${manager.name}!`,
      subtitle: `Temporada oficial`,
      image: manager.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      clubLogo: manager.clubLogo || getClubLogo(manager.club),
      theme: 'gold' // gold/amber/black gradient
    },
    likes: 1840,
    commentsCount: 92,
    reactions: ['❤️', '🔥', '👏']
  };
}

export function createSigningPost(transfer, club, clubLogoParam, date = '1 jul 2025') {
  const clubName = typeof club === 'object' ? club.club : (club || 'Mi Club');
  const userClubLogo = (typeof club === 'object' ? club.clubLogo : clubLogoParam) || getClubLogo(clubName);
  const clubHandle = `@${clubName.replace(/[^a-zA-Z0-9]/g, '')}`;
  const clubTag = `#${clubName.replace(/[^a-zA-Z0-9]/g, '')}`;
  const firstName = transfer.name.split(' ')[0];
  const originClub = transfer.clubFrom || 'mercado de fichajes';

  return {
    id: `post-sign-${Date.now()}`,
    type: 'transfer_in',
    author: {
      name: clubName,
      handle: clubHandle,
      verified: true,
      avatar: userClubLogo
    },
    date: transfer.date || date,
    text: `✍️ Te damos la bienvenida, ${firstName}. 💛\n\nEl ${transfer.position === 'POR' ? 'guardameta' : transfer.position.includes('D') ? 'defensa' : 'futbolista'} llega procedente del ${originClub}. ¡Muchos éxitos defendiendo nuestro escudo!`,
    hashtags: [clubTag, '#FichajeOficial', `#Bienvenido${transfer.name.split(' ').pop()}`],
    graphic: {
      tag: 'Nuevo fichaje',
      title: `¡Bienvenido, ${transfer.name}!`,
      subtitle: `${transfer.position} · Media: ${transfer.rating} OVR · Procedente del ${originClub}`,
      image: transfer.photo || "https://images.fotmob.com/image_resources/playerimages/701154.png",
      clubLogo: userClubLogo,
      rating: transfer.rating,
      position: transfer.position,
      cost: transfer.cost,
      countryFlag: transfer.flag || '🏳️',
      theme: 'emerald'
    },
    likes: 2450,
    commentsCount: 134,
    reactions: ['🔥', '👏', '😍']
  };
}

// Farewell post from origin club thanking the departing player
export function createOriginFarewellPost(transfer, club, date = '1 jul 2025') {
  const userClubName = typeof club === 'object' ? club.club : (club || 'Mi Club');
  const originClub = transfer.clubFrom || 'Club de procedencia';
  const originLogo = transfer.originClubLogo || 
    (transfer.clubLogo && transfer.clubLogo !== getClubLogo(userClubName) ? transfer.clubLogo : getClubLogo(originClub));
  const originHandle = `@${originClub.replace(/[^a-zA-Z0-9]/g, '')}`;
  const originTag = `#${originClub.replace(/[^a-zA-Z0-9]/g, '')}`;
  const surname = transfer.name.split(' ').pop();

  return {
    id: `post-farewell-${Date.now() + 1}`,
    type: 'transfer_out',
    author: {
      name: originClub,
      handle: originHandle,
      verified: true,
      avatar: originLogo
    },
    date: transfer.date || date,
    text: `🤝 Acuerdo para el traspaso de ${transfer.name} con destino al ${userClubName}.\n\n¡Gracias de corazón por tu profesionalidad, entrega y compromiso defendiendo nuestro escudo! Te deseamos la mayor de las suertes y muchos éxitos en tu nueva etapa deportiva en el ${userClubName}. 👏💙`,
    hashtags: [originTag, `#Gracias${surname}`, '#TraspasoOficial'],
    graphic: {
      tag: 'Despedida oficial',
      title: `¡Gracias, ${transfer.name}!`,
      subtitle: `Traspaso acordado con el ${userClubName} (${transfer.cost})`,
      image: transfer.photo || "https://images.fotmob.com/image_resources/playerimages/701154.png",
      clubLogo: originLogo,
      cost: transfer.cost,
      theme: 'amber'
    },
    likes: 1980,
    commentsCount: 84,
    reactions: ['👏', '❤️', '🤝']
  };
}

export function createSalePost(transfer, club, clubLogoParam, date = '4 jul 2025') {
  const clubName = typeof club === 'object' ? club.club : (club || 'Mi Club');
  const userClubLogo = (typeof club === 'object' ? club.clubLogo : clubLogoParam) || getClubLogo(clubName);
  const clubHandle = `@${clubName.replace(/[^a-zA-Z0-9]/g, '')}`;
  const clubTag = `#${clubName.replace(/[^a-zA-Z0-9]/g, '')}`;
  const destClub = transfer.clubTo || 'nuevo club';
  const surname = transfer.name.split(' ').pop();

  return {
    id: `post-sale-${Date.now()}`,
    type: 'transfer_out',
    author: {
      name: clubName,
      handle: clubHandle,
      verified: true,
      avatar: userClubLogo
    },
    date: transfer.date || date,
    text: `🤝 Acuerdo para la salida de ${transfer.name} con destino al ${destClub}.\n\n¡Gracias por tu profesionalidad y entrega defendiendo nuestro escudo! Te deseamos la mayor de las suertes en tu nueva etapa deportiva. 🦇`,
    hashtags: [clubTag, `#Gracias${surname}`],
    graphic: {
      tag: 'Salida oficial',
      title: `¡Gracias, ${transfer.name}!`,
      subtitle: `Traspasado al ${destClub} (${transfer.cost})`,
      image: transfer.photo || "https://images.fotmob.com/image_resources/playerimages/701154.png",
      clubLogo: userClubLogo,
      cost: transfer.cost,
      theme: 'amber'
    },
    likes: 980,
    commentsCount: 45,
    reactions: ['👏', '❤️', '🤝']
  };
}

export function createLineupPost(match, squad = [], club, clubLogoParam, managerName = 'Entrenador', leagueParam) {
  const clubName = typeof club === 'object' ? club.club : (club || 'Mi Club');
  const userClubLogo = (typeof club === 'object' ? club.clubLogo : clubLogoParam) || getClubLogo(clubName);
  const competition = match.competition || leagueParam || (typeof club === 'object' ? club.league : null) || 'LALIGA EA SPORTS';
  const rivalName = match.homeTeam === clubName ? match.awayTeam : match.homeTeam;
  const rivalLogo = getClubLogo(rivalName);
  const clubHandle = `@${clubName.replace(/[^a-zA-Z0-9]/g, '')}`;
  const clubTag = `#${clubName.replace(/[^a-zA-Z0-9]/g, '')}`;
  const matchTag = `#${clubName.replace(/[^a-zA-Z0-9]/g, '')}${rivalName.replace(/[^a-zA-Z0-9]/g, '')}`;
  const compTag = `#${competition.replace(/[^a-zA-Z0-9]/g, '')}`;

  // Pick 11 starters from squad (prioritizing Titulares)
  const starters = squad.filter(p => p.status === 'Titular');
  const starting11 = starters.length >= 11 ? starters.slice(0, 11) : squad.slice(0, 11);
  const bench = squad.filter(p => p.status === 'Suplente').slice(0, 7);

  const lineupData = {
    bgImage: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=1000&auto=format&fit=crop&q=80',
    formation: '4-3-3',
    starting11: starting11.map((p, idx) => ({
      id: p.id || `s-${idx}`,
      name: p.name,
      number: p.number || (idx + 1),
      position: p.position,
      photo: p.photo,
      rating: p.rating
    })),
    bench: bench.map((p, idx) => ({
      name: p.name,
      number: p.number || (idx + 12),
      position: p.position
    })),
    rivalName,
    rivalLogo,
    competition,
    matchday: match.matchday || 'Jornada Oficial',
    stadium: match.stadium || 'Estadio Principal'
  };

  return {
    id: `post-lineup-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    type: 'lineup',
    author: {
      name: clubName,
      handle: clubHandle,
      verified: true,
      avatar: userClubLogo
    },
    date: match.date || 'Previa del Partido',
    text: `📋 ¡NUESTRO ONCE TITULAR! ⚔️⚽\n\nEstos son los 11 elegidos por ${managerName} para enfrentarnos al ${rivalName} en ${competition}.\n\n¡Todos juntos a por la victoria! 💪🔥\n\n#11Inicial ${matchTag} ${compTag} ${clubTag}`,
    hashtags: ['#11Inicial', matchTag, compTag, clubTag],
    graphic: {
      isLineup: true,
      lineupData,
      tag: '11 Titular Oficial',
      title: `11 Inicial vs ${rivalName}`,
      clubLogo: userClubLogo,
      managerName
    },
    likes: 3450,
    commentsCount: 162,
    reactions: ['🔥', '👏', '💪']
  };
}

export function createGoalPost(scorerEvent, match, squad = [], club, clubLogoParam, leagueParam, index = 0) {
  const clubName = typeof club === 'object' ? club.club : (club || 'Mi Club');
  const userClubLogo = (typeof club === 'object' ? club.clubLogo : clubLogoParam) || getClubLogo(clubName);
  const isUs = scorerEvent.team === 'us' || scorerEvent.team === clubName || !scorerEvent.team;
  const targetClub = isUs ? clubName : (match.homeTeam === clubName ? match.awayTeam : match.homeTeam);
  const targetLogo = isUs ? userClubLogo : getClubLogo(targetClub);
  const clubHandle = `@${targetClub.replace(/[^a-zA-Z0-9]/g, '')}`;
  const clubTag = `#${targetClub.replace(/[^a-zA-Z0-9]/g, '')}`;
  const rivalName = match.homeTeam === clubName ? match.awayTeam : match.homeTeam;
  const matchTag = `#${clubName.replace(/[^a-zA-Z0-9]/g, '')}${rivalName.replace(/[^a-zA-Z0-9]/g, '')}`;
  
  // Find player data in squad
  const playerInSquad = squad.find(p => p.name.toLowerCase() === (scorerEvent.player || '').toLowerCase());
  const playerPhoto = playerInSquad?.photo || "https://images.fotmob.com/image_resources/playerimages/701154.png";
  const playerNumber = playerInSquad?.number || 9;
  const playerRating = playerInSquad?.rating || 82;

  const goalType = scorerEvent.type || 'Gol en Jugada';
  const minute = scorerEvent.minute || "45'";
  const assist = scorerEvent.assist || '';

  return {
    id: `post-goal-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 5)}`,
    type: 'goal',
    author: {
      name: targetClub,
      handle: clubHandle,
      verified: true,
      avatar: targetLogo
    },
    date: match.date || 'En Directo',
    text: `⚽ ¡¡¡GOOOOOOOOOOOOOL DE ${scorerEvent.player}!!! (${minute})\n\n${assist ? `👟 Asistencia exquisita de ${assist}.\n\n` : ''}${goalType && goalType !== 'Gol en Jugada' ? `🎯 Definición: ${goalType}\n\n` : ''}${match.homeTeam} ${match.homeScore} - ${match.awayScore} ${match.awayTeam}\n\n#GOL ${matchTag} ${clubTag}`,
    hashtags: ['#GOL', matchTag, clubTag],
    graphic: {
      tag: `⚽ GOL (${minute})`,
      title: `¡GOOOOOL DE ${scorerEvent.player}!`,
      subtitle: `${minute} · ${goalType}${assist && assist.trim() ? ` · Asist: ${assist}` : ''}`,
      player: scorerEvent.player,
      minute,
      assist,
      goalType,
      image: playerPhoto,
      number: playerNumber,
      rating: playerRating,
      clubLogo: targetLogo,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      homeScore: match.homeScore,
      awayScore: match.awayScore,
      theme: 'emerald'
    },
    likes: 4120 + (index * 280),
    commentsCount: 185,
    reactions: ['⚽', '🔥', '🎉']
  };
}

export function createMatchPost(match, club, clubLogoParam, leagueParam) {
  const clubName = typeof club === 'object' ? club.club : (club || 'Mi Club');
  const userClubLogo = (typeof club === 'object' ? club.clubLogo : clubLogoParam) || getClubLogo(clubName);
  const competition = match.competition || leagueParam || (typeof club === 'object' ? club.league : null) || 'LALIGA EA SPORTS';
  const compTag = `#${competition.replace(/[^a-zA-Z0-9]/g, '')}`;
  const clubHandle = `@${clubName.replace(/[^a-zA-Z0-9]/g, '')}`;
  const clubTag = `#${clubName.replace(/[^a-zA-Z0-9]/g, '')}`;
  const hashtagMatch = `#${match.homeTeam.replace(/\s+/g, '')}${match.awayTeam.replace(/\s+/g, '')}`;

  const isHome = match.homeTeam === clubName;
  const ourScore = isHome ? match.homeScore : match.awayScore;
  const rivalScore = isHome ? match.awayScore : match.homeScore;

  const isVictoria = ourScore > rivalScore;
  const isEmpate = ourScore === rivalScore;

  let intro = `⏹️ FINAL en ${match.stadium || 'el estadio'} | ¡Victoria espectacular de los nuestros!`;
  if (isEmpate) intro = `⏹️ FINAL | Reparto de puntos tras un choque de máxima igualdad y entrega.`;
  if (!isVictoria && !isEmpate) intro = `⏹️ FINAL | Concluye el partido con resultado adverso. Toca reponerse y pensar en el próximo duelo.`;

  const scorersText = match.scorers && match.scorers.length > 0
    ? '\n\n' + match.scorers.map(s => `⚽ ${s.minute} ${s.player}${s.assist && s.assist.trim() ? ` (asist. ${s.assist})` : ''} ${s.type && s.type !== 'Gol en Jugada' ? `[${s.type}]` : ''}`.trim()).join('\n')
    : '';

  const cardsText = match.cards && match.cards.length > 0
    ? '\n\n' + match.cards.map(c => `${c.type === 'yellow' ? '🟨' : c.type === 'red' ? '🟥' : '🟨🟥'} ${c.minute} ${c.player}${c.reason && c.reason.trim() ? ` (${c.reason})` : ''}`).join('\n')
    : '';

  const subsText = match.substitutions && match.substitutions.length > 0
    ? '\n\n' + match.substitutions.map(sub => `🔄 ${sub.minute} Entra: ${sub.playerIn} ⇄ Sale: ${sub.playerOut}${sub.reason && sub.reason.trim() ? ` (${sub.reason})` : ''}`).join('\n')
    : '';

  // Stadium celebration or match atmosphere background photo
  const bgImage = isVictoria
    ? 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&auto=format&fit=crop&q=80'
    : isEmpate
    ? 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200&auto=format&fit=crop&q=80'
    : 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&auto=format&fit=crop&q=80';

  return {
    id: `post-match-${Date.now()}`,
    type: 'match',
    author: {
      name: clubName,
      handle: clubHandle,
      verified: true,
      avatar: userClubLogo
    },
    date: match.date || 'Jornada oficial',
    text: `${intro}\n\n${match.homeTeam} ${match.homeScore} - ${match.awayScore} ${match.awayTeam}${scorersText}${cardsText}${subsText}\n\n${match.notes ? `"${match.notes}"\n\n` : ''}${compTag} ${hashtagMatch} ${clubTag}`,
    hashtags: [clubTag, hashtagMatch, compTag],
    graphic: {
      isMatchResult: true,
      bgImage,
      tag: isVictoria ? '⏱️ Pitido Final · Victoria' : isEmpate ? '⏱️ Pitido Final · Empate' : '⏱️ Pitido Final',
      title: `${match.homeTeam} ${match.homeScore} - ${match.awayScore} ${match.awayTeam}`,
      subtitle: `${competition} · ${match.matchday || 'Jornada'}`,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      homeScore: match.homeScore,
      awayScore: match.awayScore,
      homeLogo: getClubLogo(match.homeTeam),
      awayLogo: getClubLogo(match.awayTeam),
      mvp: match.mvp,
      stadium: match.stadium,
      scorers: match.scorers || [],
      substitutions: match.substitutions || [],
      cards: match.cards || [],
      theme: isVictoria ? 'emerald' : isEmpate ? 'amber' : 'red'
    },
    likes: isVictoria ? 4950 : 2100,
    commentsCount: isVictoria ? 210 : 89,
    reactions: isVictoria ? ['🔥', '🎉', '👏'] : ['💪', '🤝', '👊']
  };
}

export function createYouthPost(prospect, club, date = '15 jul 2025') {
  const clubHandle = `@${club.replace(/[^a-zA-Z0-9]/g, '')}`;
  const clubTag = `#${club.replace(/[^a-zA-Z0-9]/g, '')}`;

  return {
    id: `post-youth-${Date.now()}`,
    type: 'youth',
    author: {
      name: club,
      handle: clubHandle,
      verified: true,
      avatar: ''
    },
    date: prospect.scoutedDate || date,
    text: `⭐ ¡La cantera no se detiene! ${prospect.name} (${prospect.age} años) promociona oficialmente al primer equipo.\n\nFormado en la academia con potencial de ${prospect.potentialMin}-${prospect.potentialMax}. ¡Orgullo y futuro! 🦇`,
    hashtags: [clubTag, '#CanteraDeOro', '#ADNValencianista'],
    graphic: {
      tag: 'Promesa de la cantera',
      title: `¡Bienvenido, ${prospect.name}!`,
      subtitle: `${prospect.position} · Potencial: ${prospect.potentialMin}-${prospect.potentialMax} · ${prospect.age} años`,
      image: "https://images.unsplash.com/photo-1511886929837-354d827aae26?w=600&auto=format&fit=crop&q=80",
      theme: 'sky'
    },
    likes: 1950,
    commentsCount: 78,
    reactions: ['⭐', '👏', '🦇']
  };
}

// Generates an epic official championship triumph publication with our AI celebration photo and team crest
export function createTrophyPost(competition, club, clubLogoParam, managerName = 'Entrenador', date = '12 oct 2026', options = {}) {
  const clubName = typeof club === 'object' ? club.club : (club || 'Mi Club');
  const userClubLogo = (typeof club === 'object' ? club.clubLogo : clubLogoParam) || getClubLogo(clubName);
  const clubHandle = `@${clubName.replace(/[^a-zA-Z0-9]/g, '')}`;
  const clubTag = `#${clubName.replace(/[^a-zA-Z0-9]/g, '')}`;
  const compTag = `#${(competition || 'Campeones').replace(/[^a-zA-Z0-9]/g, '')}`;

  const isEuropean = (competition || '').toLowerCase().includes('champions') ||
    (competition || '').toLowerCase().includes('europa') ||
    (competition || '').toLowerCase().includes('conference') ||
    (competition || '').toLowerCase().includes('supercopa de europa');

  // Authentic photos generated with generate_image
  const defaultTrophyPhoto = isEuropean 
    ? '/trophies/champions_trophy_celebration.jpg' 
    : '/trophies/league_trophy_celebration.jpg';

  const trophyImage = options.customImage || defaultTrophyPhoto;
  const seasonText = options.season || '2025/26';
  const triumphDetails = options.details || `¡Conquistamos el trofeo de ${competition}! Una gesta inolvidable para la historia de nuestro club.`;

  return {
    id: `post-trophy-${Date.now()}`,
    type: 'trophy',
    author: {
      name: clubName,
      handle: clubHandle,
      verified: true,
      avatar: userClubLogo
    },
    date: date || '12 oct 2026',
    text: `🏆 ¡¡¡SOMOS CAMPEONES DE ${competition.toUpperCase()}!!! 🍾🎉🥳\n\nNoche histórica y de máxima gloria para el ${clubName}. Conquistamos el título oficial de ${competition} bajo la dirección táctica de ${managerName}.\n\n¡Gracias de corazón a toda la afición por creer y empujar en cada jornada! ¡Este trofeo viaja directo a nuestras vitrinas! 💛🏆\n\n#CAMPEONES ${clubTag} ${compTag} #GloriaEterna #ModoCarrera`,
    hashtags: ['#CAMPEONES', clubTag, compTag, '#GloriaEterna'],
    graphic: {
      isTrophy: true,
      image: trophyImage,
      tag: '🏆 Título Oficial Conquistado',
      title: `¡CAMPEONES DE ${competition.toUpperCase()}!`,
      subtitle: `${clubName} · Míster ${managerName}`,
      clubName,
      clubLogo: userClubLogo,
      managerName,
      competition,
      season: seasonText,
      details: triumphDetails,
      date
    },
    likes: 19850,
    commentsCount: 940,
    reactions: ['🏆', '🔥', '🍾', '❤️']
  };
}

