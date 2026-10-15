import { getClubLogo } from './clubsData.js';
import { formatToFullEuros } from './utils/formatters.js';

// Helper to generate realistic contextual fan & press comments for any post type
export function generateContextualComments(type, clubName = 'Mi Club', managerName = 'Mánager', context = {}) {
  const personas = {
    marca: {
      id: `comm-marca-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      author: 'Diario MARCA',
      handle: '@marca',
      avatar: 'https://upload.wikimedia.org/wikipedia/commons/1/16/Marca.svg',
      avatarBg: 'bg-white',
      mediaType: 'marca',
      badge: '🔴 MARCA Exclusiva',
      verified: true,
      likes: 184,
      time: '35m'
    },
    as: {
      id: `comm-as-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      author: 'Diario AS',
      handle: '@diarioas',
      avatar: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Diario_AS.svg',
      avatarBg: 'bg-white',
      mediaType: 'as',
      badge: '📰 Diario AS',
      verified: true,
      likes: 156,
      time: '28m'
    },
    dazn: {
      id: `comm-dazn-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      author: 'DAZN España',
      handle: '@DAZN_ES',
      avatar: 'https://upload.wikimedia.org/wikipedia/commons/0/06/DAZN_Logo_Master.svg',
      avatarBg: 'bg-[#111111]',
      mediaType: 'dazn',
      badge: '📺 DAZN Exclusiva',
      verified: true,
      likes: 215,
      time: '18m'
    },
    relevo: {
      id: `comm-relevo-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      author: 'Relevo Mercato',
      handle: '@relevo',
      avatar: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Relevo-logo-purple.svg',
      avatarBg: 'bg-[#1a0f2e]',
      mediaType: 'relevo',
      badge: '💣 Rumor de Fichajes',
      verified: true,
      likes: 198,
      time: '12m'
    },
    socio: {
      id: `comm-socio-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      author: 'Carlos Mendizábal',
      handle: '@Carlos_Mendi',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      badge: '🎟️ Socio #4,120',
      verified: false,
      likes: 42,
      time: '1h'
    },
    ultra: {
      id: `comm-ultra-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      author: 'Grada & Pasión',
      handle: '@GradaPasionOficial',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      badge: '📣 Grada de Animación',
      verified: false,
      likes: 115,
      time: '25m'
    },
    fan: {
      id: `comm-fan-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      author: 'Laura Gómez',
      handle: '@LauraG_Futbol',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
      badge: '⭐ Fan Destacada',
      verified: false,
      likes: 29,
      time: '15m'
    }
  };

  switch (type) {
    case 'manager':
      return [
        {
          ...personas.marca,
          text: `🔴 EXCLUSIVA MARCA | Primeras peticiones de ${managerName} a la directiva del ${clubName}: ha pedido blindar la columna vertebral del equipo y exige la llegada de un mediocentro organizador antes de que avance el mercado.`
        },
        {
          ...personas.dazn,
          text: `📺 En DAZN analizamos la pizarra: ${managerName} quiere implantar una presión tras pérdida asfixiante. Fuentes del entorno confirman que ya maneja una lista con 3 posibles refuerzos contrastados.`
        },
        {
          ...personas.socio,
          text: `¡Bienvenido míster! Mucha suerte y ojalá nos lleves a lo más alto esta temporada. Confiamos en tu proyecto 👏`
        },
        {
          ...personas.ultra,
          text: `¡A muerte con ${managerName}! Queremos garra, intensidad y dejarlo todo por este escudo. ¡Vamos! 🔥⚔️`
        }
      ];

    case 'transfer_in':
      return [
        {
          ...personas.marca,
          text: `🔴 DETALLES DE LA OPERACIÓN | Fuentes de MARCA confirman que el contrato de ${context.name || 'la nueva incorporación'} incluye una cláusula de rescisión de más de 80M€. La llamada personal de ${managerName} fue decisiva para superar la puja de la Premier.`
        },
        {
          ...personas.relevo,
          text: `💣 RUMOR MERCATO | La llegada de ${context.name || 'este fichaje'} no cierra la ventana para el ${clubName}: la secretaría técnica acelera contactos con un extremo desequilibrante para apuntalar el ataque.`
        },
        {
          ...personas.ultra,
          text: `¡¡VAYA BOMBAZO DE FICHAJE!! ${context.name || 'El jugador'} tiene una calidad descomunal. Titular indiscutible desde ya 🔥🔥💣`
        },
        {
          ...personas.socio,
          text: `Bienvenido a nuestro club. A sudar y defender esta camiseta con orgullo y entrega cada jornada 🤝`
        }
      ];

    case 'transfer_out':
      return [
        {
          ...personas.as,
          text: `📰 MERCADO AS | Tras cerrar este traspaso por ${context.cost || 'una importante cantidad económica'}, la dirección deportiva del ${clubName} ya tiene seleccionado a su sustituto en una liga extranjera. Las conversaciones están muy avanzadas.`
        },
        {
          ...personas.dazn,
          text: `📺 RUMOR DAZN | Varias fuentes confirman que el dinero ingresado irá destinado a dos operaciones: un central de jerarquía y la renovación blindada de una de las perlas de la plantilla.`
        },
        {
          ...personas.socio,
          text: `Gracias por la profesionalidad y los buenos momentos defendiendo este escudo. Mucha suerte en tu nueva etapa deportiva 👏`
        },
        {
          ...personas.fan,
          text: `Buena cifra económica para las arcas del club. Ahora la directiva debe acertar de lleno con el recambio.`
        }
      ];

    case 'lineup':
      return [
        {
          ...personas.marca,
          text: `🔴 Ojo al once de ${managerName}: Varios ojeadores de la Premier League y la Serie A están acreditados hoy en el palco para seguir muy de cerca a dos piezas clave del ${clubName}.`
        },
        {
          ...personas.ultra,
          text: `¡ONCE DE GALA! Hoy no se puede escapar la victoria ante el ${context.rivalName || 'rival'}, a morder desde el primer minuto ⚔️🔥`
        },
        {
          ...personas.dazn,
          text: `📺 Pizarra táctica de DAZN: ${managerName} apuesta por carriles muy ofensivos para generar superioridad ante el ${context.rivalName || 'rival'}. Duelo de alta tensión táctica.`
        },
        {
          ...personas.socio,
          text: `Me gusta mucho la alineación inicial. Con equilibrio y confianza a por los 3 puntos 💪`
        }
      ];

    case 'goal':
      return [
        {
          ...personas.dazn,
          text: `📺 ¡GOLAZO ANTOLÓGICO! En DAZN ya lo catalogamos como uno de los candidatos al gol de la temporada. Qué pegada soberbia tiene ${context.player || 'este crack'}.`
        },
        {
          ...personas.ultra,
          text: `¡¡¡PERO QUÉ GOLAZO POR DIOS SANTOOOOO!!! Se cae el estadio abajo ⚽🚀🔥`
        },
        {
          ...personas.as,
          text: `📰 Golazo que despierta el interés en Europa. Informan que emisarios presentes en las gradas no dejan de tomar notas sobre el rendimiento de ${context.player || 'el futbolista'}.`
        },
        {
          ...personas.socio,
          text: context.assist 
            ? `La asistencia previa de ${context.assist} es medio gol, qué visión de juego 👟🎯` 
            : `Definición de clase mundial absoluta. ¡A seguir empujando equipo!`
        }
      ];

    case 'match':
      if (context.isVictoria) {
        return [
          {
            ...personas.as,
            text: `📰 CRÓNICA AS | El ${clubName} de ${managerName} presenta su firme candidatura con una exhibición de solidez y contundencia táctica que desató la fiesta en la grada.`
          },
          {
            ...personas.relevo,
            text: `💣 RUMOR | La exhibición de hoy acelera los planes: la directiva prepara una oferta de mejora contractual para el míster y varios titulares intocables.`
          },
          {
            ...personas.ultra,
            text: `¡PARTIDAZO ÉPICO! 3 puntos de oro que saben a gloria. El equipo se dejó el alma sobre el césped 🙌🔥`
          },
          {
            ...personas.socio,
            text: `Actuación redonda de todo el equipo. ¡Qué alegría ver al equipo compitiendo así! 👏`
          }
        ];
      } else {
        return [
          {
            ...personas.marca,
            text: `🔴 AUTOCRÍTICA MARCA | En el vestuario del ${clubName} reina la serenidad pero ${managerName} ya planea variantes tácticas y rotaciones inmediatas de cara a la próxima jornada.`
          },
          {
            ...personas.dazn,
            text: `📺 RUMOR DAZN | Pese al resultado adverso, respaldo unánime de la directiva hacia ${managerName}. Desmienten rotundamente cualquier duda sobre el rumbo del banquillo.`
          },
          {
            ...personas.socio,
            text: `Partido muy disputado. Faltó algo de fortuna en los metros finales, pero este equipo tiene orgullo y se levantará pronto.`
          },
          {
            ...personas.fan,
            text: `A seguir trabajando y corrigiendo detalles. ¡Siempre a muerte con estos colores!`
          }
        ];
      }

    case 'trophy':
      return [
        {
          ...personas.marca,
          text: `🔴 PORTADA MARCA | ¡EL ${clubName.toUpperCase()} TOCA LA GLORIA! ${managerName} inscribe su nombre con letras de oro en una temporada histórica. 🏆👑`
        },
        {
          ...personas.dazn,
          text: `📺 RUMOR EXCLUSIVO DAZN | Tras el título de campeón, la directiva del ${clubName} prepara una prima histórica y la firma de un contrato de larga duración para blindar a ${managerName}.`
        },
        {
          ...personas.ultra,
          text: `¡¡¡SOMOS CAMPEOOOOONES!!! 🏆🍾🎉 Lágrimas de emoción en los ojos. ¡Gracias plantilla y míster ${managerName} por este día histórico!`
        },
        {
          ...personas.socio,
          text: `Muchos años sufriendo y hoy por fin tocamos el cielo. ¡A disfrutar la fiesta del título! ⭐🏆`
        }
      ];

    case 'youth':
      return [
        {
          ...personas.relevo,
          text: `💣 RUMOR CANTERA | El ${clubName} acelera el blindaje de ${context.name || 'su nueva joya'}: cláusula que ascenderá a 50 millones. Dos clubes punteros de la Premier ya enviaron ojeadores a seguirlo.`
        },
        {
          ...personas.as,
          text: `📰 Los informes internos de la cantera son inmejorables: destacan su personalidad competitiva y madurez impropia de su edad. ${managerName} le tiene fe ciega.`
        },
        {
          ...personas.socio,
          text: `La cantera nunca falla. Mucho talento y ADN del club en sus botas. ¡A darle minutos sin miedo míster! ⭐`
        },
        {
          ...personas.fan,
          text: `Qué orgullo ver a chavales de la casa promocionar al primer equipo. ¡El futuro está asegurado!`
        }
      ];

    case 'renewal':
      return [
        {
          ...personas.marca,
          text: `🔴 EXCLUSIVA MARCA | ${context.playerName || 'La estrella'} dio el 'SÍ' definitivo tras rechazar dos ofertas astronómicas del extranjero. Su nueva cláusula de rescisión blindará su continuidad en el ${clubName}.`
        },
        {
          ...personas.dazn,
          text: `📺 RUMOR DAZN | Firmada la renovación hasta ${context.renewalYear || '2030'}, la secretaría técnica pasa al siguiente objetivo prioritario: asegurar la continuidad del segundo capitán.`
        },
        {
          ...personas.ultra,
          text: `¡¡¡RENOVACIÓN HISTÓRICA!!! ${context.playerName || 'La estrella'} se queda en casa. Blindaje merecidísimo para nuestro ídolo 🔥✍️`
        },
        {
          ...personas.socio,
          text: `Orgullo de jugador. Ha demostrado que siente este escudo por encima de todo. ¡A por muchos más éxitos juntos! 👏👕`
        }
      ];

    default:
      return [
        {
          ...personas.as,
          text: `📰 Actualidad del ${clubName}: La secretaría técnica y ${managerName} siguen trabajando codo a codo en la planificación deportiva.`
        },
        {
          ...personas.socio,
          text: `Gran comunicado oficial del club. Máxima ilusión con el proyecto deportivo 👏`
        },
        {
          ...personas.fan,
          text: `¡Siempre apoyando al equipo en cada paso del camino! 💪`
        }
      ];
  }
}

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
      theme: 'gold'
    },
    likes: 1840,
    commentsCount: 92,
    comments: generateContextualComments('manager', manager.club, manager.name),
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
      image: transfer.photo || "./default_player.svg",
      clubLogo: userClubLogo,
      rating: transfer.rating,
      position: transfer.position,
      cost: transfer.cost,
      countryFlag: transfer.flag || '🏳️',
      theme: 'emerald'
    },
    likes: 2450,
    commentsCount: 134,
    comments: generateContextualComments('transfer_in', clubName, 'Mánager', { name: transfer.name }),
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
      image: transfer.photo || "./default_player.svg",
      clubLogo: originLogo,
      cost: transfer.cost,
      theme: 'amber'
    },
    likes: 1980,
    commentsCount: 84,
    comments: generateContextualComments('transfer_out', originClub, 'Mánager', { cost: transfer.cost }),
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
    text: `🤝 Acuerdo para la salida de ${transfer.name} con destino al ${destClub}.\n\n¡Gracias por tu profesionalidad y entrega defendiendo nuestro escudo! Te deseamos la mayor de las suertes en tu nueva etapa deportiva. 👏`,
    hashtags: [clubTag, `#Gracias${surname}`],
    graphic: {
      tag: 'Salida oficial',
      title: `¡Gracias, ${transfer.name}!`,
      subtitle: `Traspasado al ${destClub} (${transfer.cost})`,
      image: transfer.photo || "./default_player.svg",
      clubLogo: userClubLogo,
      cost: transfer.cost,
      theme: 'amber'
    },
    likes: 980,
    commentsCount: 45,
    comments: generateContextualComments('transfer_out', clubName, 'Mánager', { cost: transfer.cost }),
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
    comments: generateContextualComments('lineup', clubName, managerName, { rivalName }),
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
  const playerPhoto = playerInSquad?.photo || "./default_player.svg";
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
    comments: generateContextualComments('goal', targetClub, 'Mánager', { player: scorerEvent.player, assist }),
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
    comments: generateContextualComments('match', clubName, 'Mánager', { isVictoria }),
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
    hashtags: [clubTag, '#CanteraDeOro', '#FuturoPrometedor'],
    graphic: {
      tag: 'Promesa de la cantera',
      title: `¡Bienvenido, ${prospect.name}!`,
      subtitle: `${prospect.position} · Potencial: ${prospect.potentialMin}-${prospect.potentialMax} · ${prospect.age} años`,
      image: "https://images.unsplash.com/photo-1511886929837-354d827aae26?w=600&auto=format&fit=crop&q=80",
      theme: 'sky'
    },
    likes: 1950,
    commentsCount: 78,
    comments: generateContextualComments('youth', club, 'Mánager', { name: prospect.name }),
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

  // Authentic photos
  const defaultTrophyPhoto = isEuropean 
    ? '/trophies/champions_trophy_celebration.jpg' 
    : '/trophies/league_trophy_celebration.jpg';

  const trophyImage = options.customImage || defaultTrophyPhoto;
  const seasonText = options.season || '2026/27';
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
    comments: generateContextualComments('trophy', clubName, managerName, { competition }),
    reactions: ['🏆', '🔥', '🍾', '❤️']
  };
}

export function createRenewalPost(player, club, clubLogoParam, renewalYear = '2030', clause = '120.000.000 €', managerName = 'Mánager', date = '12 oct 2026', options = {}) {
  const clubName = typeof club === 'object' ? club.club : (club || 'Mi Club');
  const userClubLogo = (typeof club === 'object' ? club.clubLogo : clubLogoParam) || getClubLogo(clubName);
  const clubHandle = `@${clubName.replace(/[^a-zA-Z0-9]/g, '')}`;
  const clubTag = `#${clubName.replace(/[^a-zA-Z0-9]/g, '')}`;
  const playerName = typeof player === 'object' ? player.name : (player || 'Jugador');
  const playerNumber = typeof player === 'object' ? (player.number || 10) : 10;
  const playerPhoto = typeof player === 'object' ? (player.photo || player.imageUrl || './default_player.svg') : './default_player.svg';
  const playerPosition = typeof player === 'object' ? (player.position || 'DEL') : 'DEL';
  const playerRating = typeof player === 'object' ? (player.rating || 82) : 82;

  const bgImage = options.bgImage || 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=1000&auto=format&fit=crop&q=80';
  const formattedClause = formatToFullEuros(clause, '120.000.000 €');

  return {
    id: `post-renew-${Date.now()}`,
    type: 'renewal',
    author: {
      name: clubName,
      handle: clubHandle,
      verified: true,
      avatar: userClubLogo
    },
    date: date || '12 oct 2026',
    text: `✍️👕 ¡OFICIAL | ${playerName.toUpperCase()} RENUEVA HASTA ${renewalYear}! 🤝💛\n\nEl ${clubName} y el futbolista han alcanzado un acuerdo oficial para la ampliación y blindaje de su contrato.\n\nUna pieza clave en el esquema del míster ${managerName} seguirá defendiendo nuestro escudo y haciendo vibrar a la afición. ¡Enhorabuena, crack!\n\n#RenovaciónOficial ${clubTag} #Hasta${renewalYear} #ModoCarrera`,
    hashtags: ['#RenovaciónOficial', clubTag, `#Hasta${renewalYear}`],
    graphic: {
      isRenewal: true,
      tag: '✍️ Renovación Oficial',
      title: `¡${playerName.toUpperCase()} HASTA ${renewalYear}!`,
      subtitle: `${playerPosition} · ${playerRating} OVR · Cláusula ${formattedClause}`,
      playerName,
      playerNumber,
      clubName,
      clubLogo: userClubLogo,
      renewalYear,
      clause: formattedClause,
      playerPhoto,
      playerPosition,
      playerRating,
      bgImage,
      date
    },
    likes: 4890,
    commentsCount: 168,
    comments: generateContextualComments('renewal', clubName, managerName, { playerName, renewalYear }),
    reactions: ['✍️', '👕', '🔥', '👏', '❤️']
  };
}
