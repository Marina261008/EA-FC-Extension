// Preset official background & announcement graphics for Communicados
export const PRESET_CATEGORIES = [
  { id: 'all', label: 'Todas', icon: '✨' },
  { id: 'institucional', label: 'Institucional & Prensa', icon: '🏛️' },
  { id: 'matchday', label: 'Día de Partido', icon: '⚽' },
  { id: 'fichajes', label: 'Fichajes & Vestuario', icon: '✍️' },
  { id: 'entrenamiento', label: 'Entrenamientos', icon: '🏃' },
  { id: 'celebracion', label: 'Celebración & Título', icon: '🏆' }
];

export const PRESET_POST_IMAGES = [
  // Institucional & Sala de Prensa
  {
    id: 'inst-1',
    category: 'institucional',
    title: 'Sala de Prensa Oficial',
    description: 'Micrófonos y fondo oficial de rueda de prensa',
    url: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&auto=format&fit=crop&q=80',
    tag: 'Comunicado Oficial'
  },
  {
    id: 'inst-2',
    category: 'institucional',
    title: 'Estadio de Gala',
    description: 'Panorámica solemne del estadio iluminado',
    url: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&auto=format&fit=crop&q=80',
    tag: 'Institucional'
  },
  {
    id: 'inst-3',
    category: 'institucional',
    title: 'Focos de Honor',
    description: 'Iluminación nocturna de máxima categoría',
    url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop&q=80',
    tag: 'Comunicado Oficial'
  },
  {
    id: 'inst-4',
    category: 'institucional',
    title: 'Firma en Despacho',
    description: 'Documento oficial y protocolo de la directiva',
    url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80',
    tag: 'Acuerdo Institucional'
  },

  // Matchday
  {
    id: 'match-1',
    category: 'matchday',
    title: 'Noche de Partido',
    description: 'Estadio a rebosar bajo los focos de la competición',
    url: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=800&auto=format&fit=crop&q=80',
    tag: 'Día de Partido'
  },
  {
    id: 'match-2',
    category: 'matchday',
    title: 'Césped y Balón',
    description: 'Balón oficial sobre el césped preparado para el pitido inicial',
    url: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800&auto=format&fit=crop&q=80',
    tag: 'Previa Oficial'
  },
  {
    id: 'match-3',
    category: 'matchday',
    title: 'Túnel de Salida',
    description: 'Perspectiva del túnel de acceso al terreno de juego',
    url: 'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?w=800&auto=format&fit=crop&q=80',
    tag: 'Concentración'
  },
  {
    id: 'match-4',
    category: 'matchday',
    title: 'Acción en el Terreno',
    description: 'Intensidad y disputa en el terreno de juego',
    url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80',
    tag: 'Matchday'
  },

  // Fichajes y Vestuario
  {
    id: 'sign-1',
    category: 'fichajes',
    title: 'Firma de Contrato',
    description: 'Rúbrica del nuevo contrato con el club',
    url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80',
    tag: 'Fichaje Oficial'
  },
  {
    id: 'sign-2',
    category: 'fichajes',
    title: 'Camisetas en Vestuario',
    description: 'Equipación colgada y preparada en la taquilla',
    url: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=800&auto=format&fit=crop&q=80',
    tag: 'Nueva Incorporación'
  },
  {
    id: 'sign-3',
    category: 'fichajes',
    title: 'Taquilla y Dorsal',
    description: 'Dorsal asignado al nuevo integrante de la plantilla',
    url: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&auto=format&fit=crop&q=80',
    tag: 'Renovación'
  },
  {
    id: 'sign-4',
    category: 'fichajes',
    title: 'Salto al Césped',
    description: 'Primeros pasos defendiendo el escudo en el campo',
    url: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&auto=format&fit=crop&q=80',
    tag: 'Presentación'
  },

  // Entrenamiento
  {
    id: 'train-1',
    category: 'entrenamiento',
    title: 'Sesión Preparatoria',
    description: 'Trabajo físico y táctico en la ciudad deportiva',
    url: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=800&auto=format&fit=crop&q=80',
    tag: 'Entrenamiento'
  },
  {
    id: 'train-2',
    category: 'entrenamiento',
    title: 'Balón a la Red',
    description: 'Ensayo de finalización de jugadas a puerta',
    url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&auto=format&fit=crop&q=80',
    tag: 'Puesta a Punto'
  },
  {
    id: 'train-3',
    category: 'entrenamiento',
    title: 'Calentamiento y Rondos',
    description: 'Dinámica de toque y velocidad de circulación',
    url: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&auto=format&fit=crop&q=80',
    tag: 'Sesión Táctica'
  },
  {
    id: 'train-4',
    category: 'entrenamiento',
    title: 'Velocidad y Ritmo',
    description: 'Preparación de alta intensidad para el fin de semana',
    url: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&auto=format&fit=crop&q=80',
    tag: 'Ciudad Deportiva'
  },

  // Celebraciones y Éxitos
  {
    id: 'celeb-1',
    category: 'celebracion',
    title: 'Victoria Épica',
    description: 'Celebración por todo lo alto tras lograr los 3 puntos',
    url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80',
    tag: 'Gran Victoria'
  },
  {
    id: 'celeb-2',
    category: 'celebracion',
    title: 'Trofeo de Campeón',
    description: 'Momento histórico levantando el título oficial',
    url: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&auto=format&fit=crop&q=80',
    tag: '¡CAMPEONES!'
  },
  {
    id: 'celeb-3',
    category: 'celebracion',
    title: 'Grada y Pasión',
    description: 'La afición empujando al equipo con cánticos y bufandas',
    url: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800&auto=format&fit=crop&q=80',
    tag: 'Nuestra Afición'
  }
];

// Quick templates for fast 1-click authoring
export const QUICK_ANNOUNCEMENT_TEMPLATES = [
  {
    id: 'tmpl-official',
    name: '🏛️ Comunicado Oficial',
    tag: 'Comunicado Oficial',
    title: 'COMUNICADO OFICIAL',
    subtitle: 'Dirección General del Club',
    imageId: 'inst-1',
    text: `El club desea informar a sus abonados, accionistas y medios de comunicación sobre la situación actual deportiva del primer equipo.\n\nReiteramos nuestro firme compromiso con el proyecto, la exigencia máxima en los entrenamientos y la ambición de alcanzar los objetivos trazados para esta temporada.`
  },
  {
    id: 'tmpl-renewal',
    name: '🔄 Renovación de Contrato',
    tag: 'Acuerdo de Renovación',
    title: '¡RENOVADO HASTA 2029!',
    subtitle: 'Compromiso y Pasión por el Escudo',
    imageId: 'sign-1',
    text: `🤝 El club y el jugador han alcanzado un acuerdo total para la ampliación de su contrato hasta junio de 2029.\n\nUna pieza fundamental para el presente y futuro del vestuario continuará defendiendo nuestros colores con la máxima entrega.`
  },
  {
    id: 'tmpl-matchday',
    name: '⚽ ¡Día de Partido!',
    tag: 'Matchday Oficial',
    title: '¡HOY JUGAMOS!',
    subtitle: 'Noche de Máxima Tensión',
    imageId: 'match-1',
    text: `🏟️ ¡Llegó el día! Saltamos al terreno de juego con un único objetivo: dejarnos el alma por este escudo y sumar 3 puntos fundamentales.\n\n¡Que rujan las gradas y sintamos el aliento de toda la afición desde el primer minuto!`
  },
  {
    id: 'tmpl-signing',
    name: '✍️ Fichaje Confirmado',
    tag: 'Principio de Acuerdo',
    title: '¡BIENVENIDO A TU NUEVA CASA!',
    subtitle: 'Refuerzo de Garantías',
    imageId: 'sign-2',
    text: `⚡ El club hace oficial la incorporación del futbolista a la disciplina del primer equipo tras superar satisfactoriamente el reconocimiento médico.\n\nLlega para aportar calidad, desequilibrio y hambre de títulos a nuestro proyecto.`
  },
  {
    id: 'tmpl-medical',
    name: '🩺 Parte Médico',
    tag: 'Parte Médico Oficial',
    title: 'INFORME DE LOS SERVICIOS MÉDICOS',
    subtitle: 'Evolución Clínica',
    imageId: 'inst-4',
    text: `Tras las pruebas médicas realizadas esta mañana en la clínica del club, se confirma que el jugador sufre una sobrecarga muscular leve.\n\nSu evolución marcará la disponibilidad para la próxima convocatoria. ¡Te esperamos pronto en el verde!`
  },
  {
    id: 'tmpl-fans',
    name: '👏 Mensaje a la Afición',
    tag: 'Agradecimiento',
    title: 'GRACIAS POR VUESTRO APOYO',
    subtitle: 'Unidos Somos Invencibles',
    imageId: 'celeb-3',
    text: `Queremos agradecer a toda nuestra afición el apoyo incondicional mostrado durante los 90 minutos.\n\nSois el corazón de este club y juntos no hay reto imposible. ¡A por el siguiente compromiso!`
  }
];

// Formation coordinate percentages on pitch (x: 0-100%, y: 0-100% where y: 88% is GK, y: 16-20% is ST)
export const FORMATION_COORDINATES = {
  '4-3-3': [
    { slot: 'POR', x: 50, y: 88 },
    { slot: 'LI',  x: 16, y: 70 },
    { slot: 'DFC', x: 38, y: 72 },
    { slot: 'DFC', x: 62, y: 72 },
    { slot: 'LD',  x: 84, y: 70 },
    { slot: 'MC',  x: 28, y: 50 },
    { slot: 'MCD', x: 50, y: 54 },
    { slot: 'MC',  x: 72, y: 50 },
    { slot: 'EI',  x: 20, y: 24 },
    { slot: 'DC',  x: 50, y: 18 },
    { slot: 'ED',  x: 80, y: 24 }
  ],
  '4-2-3-1': [
    { slot: 'POR', x: 50, y: 88 },
    { slot: 'LI',  x: 16, y: 70 },
    { slot: 'DFC', x: 38, y: 72 },
    { slot: 'DFC', x: 62, y: 72 },
    { slot: 'LD',  x: 84, y: 70 },
    { slot: 'MCD', x: 36, y: 55 },
    { slot: 'MCD', x: 64, y: 55 },
    { slot: 'MI',  x: 18, y: 36 },
    { slot: 'MCO', x: 50, y: 34 },
    { slot: 'MD',  x: 82, y: 36 },
    { slot: 'DC',  x: 50, y: 16 }
  ],
  '4-4-2': [
    { slot: 'POR', x: 50, y: 88 },
    { slot: 'LI',  x: 16, y: 70 },
    { slot: 'DFC', x: 38, y: 72 },
    { slot: 'DFC', x: 62, y: 72 },
    { slot: 'LD',  x: 84, y: 70 },
    { slot: 'MI',  x: 16, y: 48 },
    { slot: 'MC',  x: 38, y: 50 },
    { slot: 'MC',  x: 62, y: 50 },
    { slot: 'MD',  x: 84, y: 48 },
    { slot: 'DC',  x: 36, y: 20 },
    { slot: 'DC',  x: 64, y: 20 }
  ],
  '3-5-2': [
    { slot: 'POR', x: 50, y: 88 },
    { slot: 'DFC', x: 26, y: 72 },
    { slot: 'DFC', x: 50, y: 74 },
    { slot: 'DFC', x: 74, y: 72 },
    { slot: 'CAI', x: 12, y: 50 },
    { slot: 'MC',  x: 36, y: 52 },
    { slot: 'MCD', x: 50, y: 58 },
    { slot: 'MC',  x: 64, y: 52 },
    { slot: 'CAD', x: 88, y: 50 },
    { slot: 'DC',  x: 36, y: 20 },
    { slot: 'DC',  x: 64, y: 20 }
  ],
  '5-3-2': [
    { slot: 'POR', x: 50, y: 88 },
    { slot: 'LI',  x: 14, y: 68 },
    { slot: 'DFC', x: 32, y: 74 },
    { slot: 'DFC', x: 50, y: 76 },
    { slot: 'DFC', x: 68, y: 74 },
    { slot: 'LD',  x: 86, y: 68 },
    { slot: 'MC',  x: 28, y: 48 },
    { slot: 'MCD', x: 50, y: 52 },
    { slot: 'MC',  x: 72, y: 48 },
    { slot: 'DC',  x: 36, y: 20 },
    { slot: 'DC',  x: 64, y: 20 }
  ]
};
