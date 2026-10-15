import { getClubLogo } from './clubsData.js';
import { formatToFullEuros } from './utils/formatters.js';
import { getTrophyImage } from './data/trophiesData.js';

// Utility to shuffle arrays for randomized comment selection
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Helper to generate realistic contextual fan & press comments for any post type
// Dynamically samples from large, rich pools to ensure varied, non-repetitive comments
export function generateContextualComments(type, clubName = 'Mi Club', managerName = 'Mánager', context = {}) {
  const personas = {
    marca: {
      author: 'Diario MARCA',
      handle: '@marca',
      avatar: 'https://upload.wikimedia.org/wikipedia/commons/1/16/Marca.svg',
      avatarBg: 'bg-white',
      mediaType: 'marca',
      badge: '🔴 MARCA Exclusiva',
      verified: true
    },
    as: {
      author: 'Diario AS',
      handle: '@diarioas',
      avatar: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Diario_AS.svg',
      avatarBg: 'bg-white',
      mediaType: 'as',
      badge: '📰 Diario AS',
      verified: true
    },
    dazn: {
      author: 'DAZN España',
      handle: '@DAZN_ES',
      avatar: 'https://upload.wikimedia.org/wikipedia/commons/0/06/DAZN_Logo_Master.svg',
      avatarBg: 'bg-[#111111]',
      mediaType: 'dazn',
      badge: '📺 DAZN Exclusiva',
      verified: true
    },
    relevo: {
      author: 'Relevo Mercato',
      handle: '@relevo',
      avatar: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Relevo-logo-purple.svg',
      avatarBg: 'bg-[#1a0f2e]',
      mediaType: 'relevo',
      badge: '💣 Rumor de Fichajes',
      verified: true
    },
    fabrizio: {
      author: 'Fabrizio Romano',
      handle: '@FabrizioRomano',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      badge: '🚨 HERE WE GO',
      verified: true
    },
    chiringuito: {
      author: 'El Chiringuito TV',
      handle: '@elchiringuitotv',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80',
      badge: '🔥 El Chiringuito',
      verified: true
    },
    cadena_ser: {
      author: 'Carrusel Deportivo',
      handle: '@carrusel',
      avatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=120&auto=format&fit=crop&q=80',
      badge: '📻 Cadena SER',
      verified: true
    },
    socio: {
      author: 'Carlos Mendizábal',
      handle: '@Carlos_Mendi',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      badge: '🎟️ Socio #4,120',
      verified: false
    },
    socio2: {
      author: 'Alberto Garrido',
      handle: '@AlbertoG_Socio',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      badge: '🎟️ Socio #1,894',
      verified: false
    },
    veterano: {
      author: 'Peña Los Veteranos',
      handle: '@PenaVeteranos',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
      badge: '🎖️ Peña Histórica',
      verified: false
    },
    ultra: {
      author: 'Grada & Pasión',
      handle: '@GradaPasionOficial',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      badge: '📣 Grada de Animación',
      verified: false
    },
    ultra2: {
      author: 'Frente Norte 1903',
      handle: '@FrenteNorte_Ultras',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
      badge: '🔥 Fondo de Animación',
      verified: false
    },
    analyst: {
      author: 'Fútbol & Pizarra',
      handle: '@AnalisisTactico_ES',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
      badge: '📊 Analista Táctico',
      verified: false
    },
    fan: {
      author: 'Laura Gómez',
      handle: '@LauraG_Futbol',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
      badge: '⭐ Fan Destacada',
      verified: false
    },
    fan2: {
      author: 'David Rivas',
      handle: '@David_RivasFut',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80',
      badge: '⚽ Fiel Seguidor',
      verified: false
    }
  };

  const makeComment = (persona, text) => {
    const times = ['6m', '14m', '22m', '38m', '45m', '1h', '2h'];
    const time = times[Math.floor(Math.random() * times.length)];
    const likes = Math.floor(Math.random() * 240) + 25;
    return {
      ...persona,
      id: `comm-${type}-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      time,
      likes,
      text
    };
  };

  const sampleDiverseComments = (pools, count = 4) => {
    const selected = [];
    const shuffledPools = pools.map(p => shuffleArray(p));
    
    // Pick at least one from distinct pools first to guarantee variety
    for (const pool of shuffledPools) {
      if (pool.length > 0 && selected.length < count) {
        selected.push(pool[0]);
      }
    }

    // Fill up to target count from remaining pool
    if (selected.length < count) {
      const usedTexts = new Set(selected.map(c => c.text));
      const remaining = pools.flat().filter(c => !usedTexts.has(c.text));
      const extra = shuffleArray(remaining).slice(0, count - selected.length);
      selected.push(...extra);
    }

    return shuffleArray(selected);
  };

  const name = context.name || context.playerName || 'el jugador';
  const rival = context.rivalName || 'el rival';
  const cost = context.cost || 'cifras importantes';
  const comp = context.competition || 'la competición';

  switch (type) {
    case 'manager': {
      const press = [
        makeComment(personas.marca, `🔴 EXCLUSIVA MARCA | Primeras peticiones de ${managerName} a la directiva del ${clubName}: ha pedido blindar la columna vertebral del equipo y exige la llegada de un mediocentro organizador antes de que avance el mercado.`),
        makeComment(personas.dazn, `📺 En DAZN analizamos la pizarra: ${managerName} quiere implantar una presión tras pérdida asfixiante. Fuentes del entorno confirman que ya maneja una lista con 3 posibles refuerzos contrastados.`),
        makeComment(personas.as, `📰 El nuevo libreto de ${managerName}: Doble sesión física diaria, nutricionista específico y videoanálisis personalizado para cada integrante del vestuario.`),
        makeComment(personas.relevo, `💣 RELEVO | El técnico llega acompañado de 4 ayudantes de su máxima confianza. Ya ha mantenido una charla individual con los capitanes del ${clubName}.`),
        makeComment(personas.chiringuito, `🔥 ¡ATENCIÓN EN EL PLATÓ! ${managerName} ha dejado claro que quien no corra no jugará. Máxima exigencia desde el primer minuto en el ${clubName}.`)
      ];
      const socios = [
        makeComment(personas.socio, `¡Bienvenido míster! Mucha suerte y ojalá nos lleves a lo más alto esta temporada. Confiamos en tu proyecto 👏`),
        makeComment(personas.socio2, `Entrenador metódico, serio y con las ideas muy claras. Ahora la directiva tiene que darle las herramientas necesarias para triunfar.`),
        makeComment(personas.veterano, `Desde la Peña le deseamos la mayor de las suertes. Trabajo humilde, respeto al escudo y exigencia máxima. ¡A por todas!`)
      ];
      const ultras = [
        makeComment(personas.ultra, `¡A muerte con ${managerName}! Queremos garra, intensidad y dejarlo todo por este escudo. ¡Vamos! 🔥⚔️`),
        makeComment(personas.ultra2, `Aquí se viene a sudar y a morir por estos colores. ¡Si das el 100%, esta grada te llevará en volandas hasta el final! 💪`)
      ];
      const fans = [
        makeComment(personas.analyst, `📊 Perfil ideal para el momento del ${clubName}: un 58% de posesión media y alta recuperación en campo contrario en sus anteriores equipos.`),
        makeComment(personas.fan, `Máxima ilusión con la llegada del nuevo míster. ¡A por todas esta temporada! ⭐`)
      ];
      return sampleDiverseComments([press, socios, ultras, fans], 4);
    }

    case 'transfer_in': {
      const contractText = context.contract ? `hasta ${context.contract}` : 'por varias temporadas';
      const press = [
        makeComment(personas.marca, `🔴 DETALLES DE LA OPERACIÓN | Fuentes de MARCA confirman que ${name} firma contrato ${contractText} con una cláusula de rescisión de más de 80M€. La llamada personal de ${managerName} fue decisiva para superar la puja de la Premier.`),
        makeComment(personas.relevo, `💣 RUMOR MERCATO | Blindaje contractual: ${name} queda vinculado ${contractText} con el ${clubName}. La secretaría técnica celebra el acuerdo y acelera contactos por un extremo desequilibrante.`),
        makeComment(personas.fabrizio, `🚨 HERE WE GO CONFIRMADO | ${name} ya es jugador oficial del ${clubName}. Firma contrato ${contractText}. Documentos firmados, acuerdo sellado y luz verde definitiva.`),
        makeComment(personas.dazn, `📺 Análisis DAZN: Con ${name} atado ${contractText}, ${managerName} gana una pieza diferencial en tres cuartos de campo. Su capacidad para romper líneas entre centrales será clave esta temporada.`),
        makeComment(personas.as, `📰 INFORME AS | El fichaje de ${name} (${contractText}) genera un impacto inmediato en el vestuario. Varios pesos pesados ya le han dado la bienvenida en el grupo de mensajería del equipo.`),
        makeComment(personas.chiringuito, `🔥 ¡BOMBAZO EN EL MERCADO! Exclusiva en el plató: ${name} firma ${contractText}, ya ha conocido la ciudad deportiva y mañana se pondrá a las órdenes de ${managerName}.`)
      ];
      const socios = [
        makeComment(personas.socio, `Bienvenido a nuestro club. Contrato ${contractText} para un jugador con un futuro enorme. A sudar y defender esta camiseta con orgullo y entrega cada jornada 🤝`),
        makeComment(personas.socio2, `Operación impecable de la dirección deportiva asegurando a ${name} ${contractText}. Perfil idóneo para el estilo que pide ${managerName}. Ahora a arroparle desde la grada.`),
        makeComment(personas.veterano, `Un jugador de equipo, trabajador y con gol. Si las lesiones le respetan, va a ser uno de los ídolos de la afición durante estos años.`)
      ];
      const ultras = [
        makeComment(personas.ultra, `¡¡VAYA BOMBAZO DE FICHAJE!! ${name} atado ${contractText}. Tiene una calidad descomunal, titular indiscutible desde ya 🔥🔥💣`),
        makeComment(personas.ultra2, `¡Bienvenido al infierno de nuestro estadio! A dejarse la piel por este escudo y a romperla en cada jugada ⚔️🔥`),
        makeComment(personas.fan2, `¡FICHAJAZO DE ÉPOCA! Este año sí que vamos con todo a pelear por todos los títulos. ¡¡A por ellos!! 🔴⚪`)
      ];
      const fans = [
        makeComment(personas.analyst, `📊 Análisis táctico: ${name} promedió más de un 84% de acierto en pase progresivo y 3.2 recuperaciones por partido. Encaja como un guante en el sistema de ${managerName}.`),
        makeComment(personas.fan, `¡Por fin un fichaje que ilusiona de verdad a toda la masa social! Ya tengo reservada la camiseta con su nombre 👕⭐`)
      ];
      return sampleDiverseComments([press, socios, ultras, fans], 4);
    }

    case 'transfer_out': {
      const press = [
        makeComment(personas.as, `📰 MERCADO AS | Tras cerrar este traspaso por ${cost}, la dirección deportiva del ${clubName} ya tiene seleccionado a su sustituto en una liga extranjera. Las conversaciones están muy avanzadas.`),
        makeComment(personas.dazn, `📺 RUMOR DAZN | Varias fuentes confirman que el dinero ingresado irá destinado a dos operaciones: un central de jerarquía y la renovación blindada de una de las perlas de la plantilla.`),
        makeComment(personas.relevo, `💣 RELEVO | El acuerdo incluye un 15% de una futura plusvalía y variables por objetivos europeos para el ${clubName}. Gran gestión económica en los despachos.`),
        makeComment(personas.marca, `🔴 DESPACHOS MARCA | Venta dolorosa en lo deportivo pero impecable en el aspecto financiero. Permite aligerar masa salarial e inscribir sin problemas a las nuevas caras.`),
        makeComment(personas.fabrizio, `🚨 OFFICIAL | Salida confirmada. El jugador emprende nuevo reto tras el acuerdo definitivo entre clubes.`)
      ];
      const socios = [
        makeComment(personas.socio, `Gracias por la profesionalidad y los buenos momentos defendiendo este escudo. Mucha suerte en tu nueva etapa deportiva 👏`),
        makeComment(personas.socio2, `Venta necesaria para sanear cuentas. Ahora le toca a la secretaría técnica no dormirse y traer un recambio de garantías.`),
        makeComment(personas.veterano, `Deja un buen recuerdo en el club. Ha cumplido su ciclo con honradez. ¡A invertir bien lo recaudado!`)
      ];
      const ultras = [
        makeComment(personas.ultra, `Siempre respetó nuestros colores y lo dio todo cuando saltó al césped. Respeto eterno y buen viaje 👏⚔️`),
        makeComment(personas.ultra2, `Nos deja huérfanos en esa posición, pero el fútbol es así. Quien vista esta camiseta tiene que querer estar aquí al 100%. ¡A por el sustituto!`)
      ];
      const fans = [
        makeComment(personas.analyst, `📊 Se pierden 1.8 regates completados por partido, pero se libera un 12% del límite salarial para acometer dos incorporaciones prioritarias.`),
        makeComment(personas.fan, `Buena cifra económica para las arcas del club. Ahora la directiva debe acertar de lleno con el recambio.`)
      ];
      return sampleDiverseComments([press, socios, ultras, fans], 4);
    }

    case 'lineup': {
      const press = [
        makeComment(personas.marca, `🔴 Ojo al once de ${managerName}: Varios ojeadores de la Premier League y la Serie A están acreditados hoy en el palco para seguir muy de cerca a dos piezas clave del ${clubName}.`),
        makeComment(personas.dazn, `📺 Pizarra táctica de DAZN: ${managerName} apuesta por carriles muy ofensivos para generar superioridad ante el ${rival}. Duelo de alta tensión táctica.`),
        makeComment(personas.as, `📰 Once con sorpresas: ${managerName} premia el gran estado de forma en los entrenamientos y agita el árbol con rotaciones valientes ante el ${rival}.`),
        makeComment(personas.cadena_ser, `📻 Todo listo en los vestuarios. Alineación de gala confirmada sin especulaciones. Salen a por el partido desde el pitido inicial.`),
        makeComment(personas.relevo, `💣 INFORMACIÓN | El cambio táctico en el centro del campo busca contrarrestar la velocidad en contragolpe del rival. Plan minuciosamente trabajado en la semana.`)
      ];
      const ultras = [
        makeComment(personas.ultra, `¡ONCE DE GALA! Hoy no se puede escapar la victoria ante el ${rival}, a morder desde el primer minuto ⚔️🔥`),
        makeComment(personas.ultra2, `¡¡VAMOOOOOOS!! Qué centro del campo tan jugón tenemos. Si salimos con ganas hoy les pasamos por encima 💪🔥`),
        makeComment(personas.fan2, `¡Equipazo para hoy! A por ellos sin contemplaciones. ¡Que se note quién manda en este estadio!`)
      ];
      const socios = [
        makeComment(personas.socio, `Me gusta mucho la alineación inicial. Con equilibrio y confianza a por los 3 puntos 💪`),
        makeComment(personas.socio2, `Buen once. Mucho ojo a las espaldas de nuestros laterales, pero arriba tenemos pólvora suficiente para ganar.`),
        makeComment(personas.veterano, `El equipo llega enchufado. Hay que mantener la calma y circular rápido el balón. ¡Vamos chavales!`)
      ];
      const fans = [
        makeComment(personas.analyst, `📊 Dibujo flexible: en fase ofensiva muta a 3-2-4-1 con el pivote incrustándose entre centrales. Lectura táctica muy interesante de ${managerName}.`),
        makeComment(personas.fan, `¡Qué ganas de que empiece ya el partido! Hoy mojamos seguro. ¡Vamos ${clubName}!`)
      ];
      return sampleDiverseComments([press, ultras, socios, fans], 4);
    }

    case 'goal': {
      const scorer = context.player || 'este crack';
      const press = [
        makeComment(personas.dazn, `📺 ¡GOLAZO ANTOLÓGICO! En DAZN ya lo catalogamos como uno de los candidatos al gol de la temporada. Qué pegada soberbia tiene ${scorer}.`),
        makeComment(personas.as, `📰 Golazo que despierta el interés en Europa. Informan que emisarios presentes en las gradas no dejan de tomar notas sobre el rendimiento de ${scorer}.`),
        makeComment(personas.marca, `🔴 QUÉ OBRA DE ARTE | Zapatazo imparable a la escuadra. El portero rival hizo la estatua ante la parábola perfecta de ${scorer}.`),
        makeComment(personas.chiringuito, `🔥 ¡QUÉ LOCURA DE GOL! La celebración con el banquillo demuestra la comunión total que existe en esta plantilla.`)
      ];
      const ultras = [
        makeComment(personas.ultra, `¡¡¡PERO QUÉ GOLAZO POR DIOS SANTOOOOO!!! Se cae el estadio abajo ⚽🚀🔥`),
        makeComment(personas.ultra2, `¡GOOOOOOOOOOOOOL! ¡Cómo la ha enchufado, madre mía de mi vida! ¡A celebrarlo con la grada!`),
        makeComment(personas.fan2, `¡Vaya misil tierra-aire! De los goles que se recuerdan durante años. ¡Grande ${scorer}!`)
      ];
      const socios = [
        makeComment(personas.socio, context.assist ? `La asistencia previa de ${context.assist} es medio gol, qué visión de juego 👟🎯` : `Definición de clase mundial absoluta. ¡A seguir empujando equipo!`),
        makeComment(personas.socio2, `Gol de videoteca. Ese control orientado previo vale su peso en oro. Qué futbolista tenemos señores 👏`),
        makeComment(personas.veterano, `Hacía tiempo que no cantaba un gol con tanta rabia. ¡Jugada de auténtica pizarra de ${managerName}!`)
      ];
      const fans = [
        makeComment(personas.analyst, `📊 Golpeo a 104 km/h desde 24 metros con una probabilidad de gol esperada (xG) de apenas 0.04. Genialidad pura.`),
        makeComment(personas.fan, `¡Me he quedado afónico gritándolo! Qué maravilla de jugador, vale cada céntimo que se pagó por él.`)
      ];
      return sampleDiverseComments([press, ultras, socios, fans], 4);
    }

    case 'match': {
      if (context.isVictoria) {
        const press = [
          makeComment(personas.as, `📰 CRÓNICA AS | El ${clubName} de ${managerName} presenta su firme candidatura con una exhibición de solidez y contundencia táctica que desató la fiesta en la grada.`),
          makeComment(personas.relevo, `💣 RUMOR | La exhibición de hoy acelera los planes: la directiva prepara una oferta de mejora contractual para el míster y varios titulares intocables.`),
          makeComment(personas.dazn, `📺 POST-PARTIDO DAZN | Qué masterclass táctica de ${managerName}. Supo leer las transiciones del rival y neutralizar totalmente su ataque.`),
          makeComment(personas.marca, `🔴 MARCA EN VIVO | 3 puntos de oro con sabor a liderato. El vestuario del ${clubName} es una piña y la afición despide al equipo puesta en pie.`),
          makeComment(personas.cadena_ser, `📻 Tertulia SER: Hacía tiempo que no veíamos al ${clubName} jugar con tanta personalidad y verticalidad. Este proyecto carbura a velocidad de crucero.`)
        ];
        const ultras = [
          makeComment(personas.ultra, `¡PARTIDAZO ÉPICO! 3 puntos de oro que saben a gloria. El equipo se dejó el alma sobre el césped 🙌🔥`),
          makeComment(personas.ultra2, `¡¡QUÉ ORGULLO DE EQUIPO!! Así se defienden estos colores, apretando los dientes y jugando al fútbol. ¡A por el siguiente!`),
          makeComment(personas.fan2, `¡Baño táctico de principio a fin! Qué delicia ver disfrutar así al estadio. ¡Hasta el final vamos!`)
        ];
        const socios = [
          makeComment(personas.socio, `Actuación redonda de todo el equipo. Da gusto venir al estadio a ver jugar a los nuestros con esta seriedad y compromiso 👏`),
          makeComment(personas.socio2, `Victoria de las que forjan títulos. Cuando el equipo compite con esta concentración defensiva, es dificilísimo meterle mano.`),
          makeComment(personas.veterano, `Sensaciones inmejorables. Hay fondo de armario y los recambios aportaron frescura de inmediato.`)
        ];
        const fans = [
          makeComment(personas.analyst, `📊 Dato clave: 0.42 xGA concedidos y una efectividad del 78% en duelos divididos. La mejor versión del bloque defensivo en meses.`),
          makeComment(personas.fan, `¡¡Qué felices nos hacéis!! Domingos así alegran la semana entera. ¡Aupa ${clubName}! ⚽🎉`)
        ];
        return sampleDiverseComments([press, ultras, socios, fans], 4);
      } else {
        const press = [
          makeComment(personas.marca, `🔴 AUTOCRÍTICA MARCA | En el vestuario del ${clubName} reina la serenidad pero ${managerName} ya planea variantes tácticas y rotaciones inmediatas de cara a la próxima jornada.`),
          makeComment(personas.dazn, `📺 RUMOR DAZN | Pese al resultado adverso, respaldo unánime de la directiva hacia ${managerName}. Desmienten rotundamente cualquier duda sobre el rumbo del banquillo.`),
          makeComment(personas.as, `📰 ANÁLISIS AS | Tarde gris y falta de puntería en los metros finales. Urge recuperar la contundencia en las áreas para no descolgarse de los objetivos.`),
          makeComment(personas.chiringuito, `🔥 DEBATE AL ROJO VIVO: ¿Faltó intensidad en la medular o planteamiento conservador? Los tertulianos analizan el tropiezo del ${clubName}.`)
        ];
        const ultras = [
          makeComment(personas.ultra, `¡CABEZA ARRIBA! Caerse está permitido, levantarse es una obligación. ¡El próximo partido la grada rugirá el doble! ⚔️🔥`),
          makeComment(personas.ultra2, `Autocrítica sana. Exigimos concentración los 90 minutos, pero a muerte con estos chavales y este escudo siempre.`)
        ];
        const socios = [
          makeComment(personas.socio, `Partido muy disputado. Faltó algo de fortuna en los metros finales, pero este equipo tiene orgullo y se levantará pronto.`),
          makeComment(personas.socio2, `Duro revés, pero en el fútbol las derrotas también enseñan. Hay plantilla de sobra para sobreponerse y ganar el fin de semana.`),
          makeComment(personas.veterano, `Toca apretar los dientes y hacer piña. En las malas es cuando más se demuestra el amor a unos colores.`)
        ];
        const fans = [
          makeComment(personas.analyst, `📊 Se generaron 1.9 xG pero faltó claridad en el último remate. El modelo de juego sigue siendo sólido pese al marcador.`),
          makeComment(personas.fan, `A seguir trabajando y corrigiendo detalles. ¡Siempre a muerte con estos colores!`)
        ];
        return sampleDiverseComments([press, ultras, socios, fans], 4);
      }
    }

    case 'youth': {
      const press = [
        makeComment(personas.relevo, `💣 RUMOR CANTERA | El ${clubName} acelera el blindaje de ${name}: cláusula que ascenderá a 50 millones. Dos clubes punteros de la Premier ya enviaron ojeadores a seguirlo.`),
        makeComment(personas.as, `📰 Los informes internos de la cantera son inmejorables: destacan su personalidad competitiva y madurez impropia de su edad. ${managerName} le tiene fe ciega.`),
        makeComment(personas.marca, `🔴 JOYA DE LA FÁBRICA | El debut en el primer equipo es cuestión de tiempo. En el cuerpo técnico alucinan con su velocidad y desborde en el 1 contra 1.`),
        makeComment(personas.dazn, `📺 Scouting DAZN: Recuerden bien su nombre. Tiene una lectura de juego y pausa impropia de un futbolista de su edad. Proyecto de crack mundial.`)
      ];
      const socios = [
        makeComment(personas.socio, `La cantera nunca falla. Mucho talento y ADN del club en sus botas. ¡A darle minutos sin miedo míster! ⭐`),
        makeComment(personas.socio2, `Este chico tiene ángel. Con paciencia, trabajo humilde y la tutela de los veteranos llegará lejíiisimos en el fútbol.`),
        makeComment(personas.veterano, `Ver a chavales criados en nuestra academia llegar al primer equipo es el mayor orgullo que puede tener un socio.`)
      ];
      const ultras = [
        makeComment(personas.ultra, `¡Un canterano más que cumple su sueño! A morder en cada balón y a defender esta camiseta como hiciste en las categorías inferiores 🔥`),
        makeComment(personas.ultra2, `¡Uno de los nuestros en el vestuario grande! Que no se le suba a la cabeza y a dejarse el alma por el club.`)
      ];
      const fans = [
        makeComment(personas.analyst, `📊 Perfil técnico muy pulido: 88% de acierto en regates en filial y gran visión espacial. La cantera es una mina de oro.`),
        makeComment(personas.fan, `Qué orgullo ver a chavales de la casa promocionar al primer equipo. ¡El futuro está asegurado!`)
      ];
      return sampleDiverseComments([press, socios, ultras, fans], 4);
    }

    case 'renewal': {
      const year = context.renewalYear || '2030';
      const press = [
        makeComment(personas.marca, `🔴 EXCLUSIVA MARCA | ${name} dio el 'SÍ' definitivo tras rechazar dos ofertas astronómicas del extranjero. Su nueva cláusula de rescisión blindará su continuidad en el ${clubName}.`),
        makeComment(personas.dazn, `📺 RUMOR DAZN | Firmada la renovación hasta ${year}, la secretaría técnica pasa al siguiente objetivo prioritario: asegurar la continuidad del segundo capitán.`),
        makeComment(personas.as, `📰 AS CONFIRMA | Las negociaciones que comenzaron hace dos meses concluyen con apretón de manos en el palco. Sintonía total entre jugador, agente y ${managerName}.`),
        makeComment(personas.relevo, `💣 RELEVO | El nuevo contrato sitúa a ${name} en el primer escalón salarial de la plantilla con bonus por títulos y premios individuales.`),
        makeComment(personas.fabrizio, `🚨 HERE WE GO | Trato cerrado y firmado. Compromiso a largo plazo para ${name} con el ${clubName}. Pilar inamovible del proyecto.`)
      ];
      const socios = [
        makeComment(personas.socio, `Orgullo de jugador. Ha demostrado que siente este escudo por encima de todo. ¡A por muchos más éxitos juntos! 👏👕`),
        makeComment(personas.socio2, `La mejor noticia de la temporada sin duda. Mantener a los mejores talentos es la base para ganar campeonatos.`),
        makeComment(personas.veterano, `Gestos como este ya no se ven en el fútbol moderno. Lealtad y compromiso. ¡Grande!`)
      ];
      const ultras = [
        makeComment(personas.ultra, `¡¡¡RENOVACIÓN HISTÓRICA!!! ${name} se queda en casa. Blindaje merecidísimo para nuestro ídolo 🔥✍️`),
        makeComment(personas.ultra2, `¡¡SIEMPRE EN NUESTRO BARCO!! El capitán de nuestro futuro se queda donde más le quieren. ¡Orgullo de club! ❤️`)
      ];
      const fans = [
        makeComment(personas.analyst, `📊 Blindar a un jugador con semejante ratio de impacto ofensivo y liderazgo en el vestuario es el mayor acierto del año.`),
        makeComment(personas.fan, `¡¡Qué alegría tan inmensa!! Ya podemos respirar tranquilos sabiendo que seguirá deleitándonos con su fútbol 🥂⭐`)
      ];
      return sampleDiverseComments([press, socios, ultras, fans], 4);
    }

    case 'trophy': {
      const press = [
        makeComment(personas.marca, `🔴 PORTADA MARCA | ¡EL ${clubName.toUpperCase()} TOCA LA GLORIA! ${managerName} inscribe su nombre con letras de oro en una temporada histórica. 🏆👑`),
        makeComment(personas.dazn, `📺 RUMOR EXCLUSIVO DAZN | Tras el título de campeón, la directiva del ${clubName} prepara una prima histórica y la firma de un contrato de larga duración para blindar a ${managerName}.`),
        makeComment(personas.as, `📰 EDICIÓN ESPECIAL AS | Temporada para la eternidad. El ${clubName} corona un año de récord con un fútbol brillante y una autoridad incontestable.`),
        makeComment(personas.cadena_ser, `📻 Fiesta en la fuente de la ciudad. Miles de aficionados celebran ya el título al grito de '¡Campeones, campeones!'. Noche mágica para la posteridad.`),
        makeComment(personas.fabrizio, `🏆 CHAMPIONS! Official celebration underway. Historic silverware for ${clubName} and ${managerName}. Deserved triumph after a magnificent journey.`)
      ];
      const ultras = [
        makeComment(personas.ultra, `¡¡¡SOMOS CAMPEOOOOONES!!! 🏆🍾🎉 Lágrimas de emoción en los ojos. ¡Gracias plantilla y míster ${managerName} por este día histórico!`),
        makeComment(personas.ultra2, `¡¡NOCHES QUE NUNCA SE OLVIDAN!! La copa ya está en casa y esta noche la ciudad no duerme. ¡¡GLORIA ETERNA A NUESTROS COLORES!! 🏆🔥`),
        makeComment(personas.fan2, `¡¡AQUÍ ESTÁN LOS CAMPEONES!! Qué orgullo más grande pertenecer a este sentimiento. ¡Copa al cielo! 🏆⭐`)
      ];
      const socios = [
        makeComment(personas.socio, `Muchos años sufriendo y hoy por fin tocamos el cielo. ¡A disfrutar la fiesta del título! ⭐🏆`),
        makeComment(personas.socio2, `Se me caen las lágrimas recordando a los que ya no están y disfrutaron tanto este club. Gracias de corazón a toda la plantilla y cuerpo técnico.`),
        makeComment(personas.veterano, `Una de las mayores alegrías de mi vida como socio. Este trofeo ya tiene un lugar de honor en nuestra sala de trofeos.`)
      ];
      const fans = [
        makeComment(personas.analyst, `📊 Dominio absoluto de principio a fin: mejor ataque, defensa menos goleada y una convicción arrolladora en las citas clave. Justísimos campeones.`),
        makeComment(personas.fan, `¡¡¡DÍA HISTÓRICO PARA RECORDAR TODA LA VIDA!!! ¡¡CAMPEONES DE ${comp}!! 🍾🎉🥳`)
      ];
      return sampleDiverseComments([press, ultras, socios, fans], 4);
    }

    case 'calendar': {
      const press = [
        makeComment(personas.marca, `🔴 AGENDA MARCA | Semana de máxima exigencia para el ${clubName}. ${managerName} intensifica las cargas de trabajo con la vista puesta en los próximos compromisos oficiales.`),
        makeComment(personas.dazn, `📺 DAZN Flash: La plantilla completa la sesión matinal sin incidencias. El cuerpo técnico trabaja minuciosamente las jugadas a balón parado.`),
        makeComment(personas.as, `📰 Calendario apretado: Vienen partidos cada tres días y las rotaciones de ${managerName} serán vitales para mantener el ritmo competitivo.`),
        makeComment(personas.cadena_ser, `📻 La enfermería se vacía justo a tiempo. El vestuario transmite optimismo ante el tramo decisivo de la temporada.`)
      ];
      const socios = [
        makeComment(personas.socio, `Semana decisiva para los intereses del club. Hay que sumar de tres en tres y consolidar sensaciones en el césped.`),
        makeComment(personas.veterano, `Paso a paso y con los pies en el suelo. Cada partido a partir de ahora es una auténtica final.`)
      ];
      const ultras = [
        makeComment(personas.ultra, `¡Contando las horas para el próximo partido! La grada ya está lista para dejarse la garganta animando 🔥⚽`),
        makeComment(personas.ultra2, `¡Todos a una con el equipo! Se acerca el momento de la verdad y el estadio tiene que ser una caldera.`)
      ];
      const fans = [
        makeComment(personas.fan, `¡A tope de moral! Con la piña que hay en el vestuario, estos chicos pueden con cualquier reto que venga 💪`),
        makeComment(personas.analyst, `📊 El bloque llega en su pico físico óptimo según los datos de rendimiento GPS de los últimos entrenamientos.`)
      ];
      return sampleDiverseComments([press, socios, ultras, fans], 4);
    }

    default: {
      const press = [
        makeComment(personas.as, `📰 Actualidad del ${clubName}: La secretaría técnica y ${managerName} siguen trabajando codo a codo en la planificación deportiva.`),
        makeComment(personas.marca, `🔴 INFORMACIÓN MARCA | El club mantiene abiertas varias vías estratégicas tanto en lo deportivo como en lo institucional.`),
        makeComment(personas.dazn, `📺 Seguimiento especial a los movimientos del ${clubName}. Semana de alta actividad en las oficinas del club.`)
      ];
      const socios = [
        makeComment(personas.socio, `Gran comunicado oficial del club. Máxima ilusión con el proyecto deportivo 👏`),
        makeComment(personas.socio2, `Transparencia y seriedad. Así se gestiona una entidad de este calibre.`),
        makeComment(personas.veterano, `Siempre al pie del cañón apoyando en las buenas y en las malas. ¡Vamos!`)
      ];
      const ultras = [
        makeComment(personas.ultra, `¡A defender este escudo con el alma siempre! ¡Orgullo y fidelidad a estos colores! 🔥`),
        makeComment(personas.ultra2, `¡Aquí nadie se rinde jamás! A muerte con el equipo hasta el último suspiro.`)
      ];
      const fans = [
        makeComment(personas.fan, `¡Siempre apoyando al equipo en cada paso del camino! 💪`),
        makeComment(personas.fan2, `¡Muy orgulloso de pertenecer a esta gran familia! ¡A por todos los objetivos!`)
      ];
      return sampleDiverseComments([press, socios, ultras, fans], 4);
    }
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
  const contractYear = transfer.contract || '2029';

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
    text: `✍️ Te damos la bienvenida, ${firstName}. 💛\n\nEl ${transfer.position === 'POR' ? 'guardameta' : transfer.position.includes('D') ? 'defensa' : 'futbolista'} llega procedente del ${originClub} y firma contrato oficial hasta junio de ${contractYear}. ¡Muchos éxitos defendiendo nuestro escudo!`,
    hashtags: [clubTag, '#FichajeOficial', `#Bienvenido${transfer.name.split(' ').pop()}`],
    graphic: {
      tag: 'Nuevo fichaje',
      title: `¡Bienvenido, ${transfer.name}!`,
      subtitle: `${transfer.position} · Media: ${transfer.rating} OVR · Contrato hasta ${contractYear} · Del ${originClub}`,
      image: transfer.photo || "./default_player.svg",
      clubLogo: userClubLogo,
      rating: transfer.rating,
      position: transfer.position,
      cost: transfer.cost,
      contractYear: contractYear,
      countryFlag: transfer.flag || '🏳️',
      theme: 'emerald'
    },
    likes: 2450,
    commentsCount: 134,
    comments: generateContextualComments('transfer_in', clubName, 'Mánager', { name: transfer.name, contract: contractYear }),
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
      trophyImage: options.trophyImage || getTrophyImage(competition),
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
