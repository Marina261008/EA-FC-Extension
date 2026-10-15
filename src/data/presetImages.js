// Preset official background & announcement graphics for Communicados
export const PRESET_CATEGORIES = [
  { id: 'all', label: 'Todas las Fotos', icon: '✨' },
  { id: 'renovaciones', label: 'Renovaciones & Contratos', icon: '✍️' },
  { id: 'matchday', label: 'Día de Partido', icon: '⚽' },
  { id: 'champions', label: 'Noches Europeas & Copas', icon: '⭐' },
  { id: 'fichajes', label: 'Fichajes & Presentación', icon: '✍️' },
  { id: 'institucional', label: 'Institucional & Prensa', icon: '🏛️' },
  { id: 'entrenamiento', label: 'Entrenamientos & Gym', icon: '🏃' },
  { id: 'celebracion', label: 'Celebración & Título', icon: '🏆' },
  { id: 'estadio', label: 'Estadio & Afición', icon: '🏟️' },
  { id: 'cantera', label: 'Cantera & Jóvenes', icon: '🌟' },
  { id: 'tactica', label: 'Táctica & Vestuario', icon: '📋' }
];

export const PRESET_POST_IMAGES = [
  // 0. RENOVACIONES & CONTRATOS (RENOVACIONES)
  {
    id: 'renov-1',
    category: 'renovaciones',
    title: 'Camiseta Oficial en Taquilla de Vestuario',
    description: 'La elástica colgada bajo los focos lista para la renovación',
    url: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=800&auto=format&fit=crop&q=80',
    tag: 'Renovación Oficial'
  },
  {
    id: 'renov-2',
    category: 'renovaciones',
    title: 'Dorsal y Elástica Lista para la Firma',
    description: 'Camiseta oficial con el dorsal preparado para sellar el acuerdo',
    url: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&auto=format&fit=crop&q=80',
    tag: 'Nuevo Contrato'
  },
  {
    id: 'renov-3',
    category: 'renovaciones',
    title: 'Mirada al Templo con la Camiseta de Espalda',
    description: 'Jugador contemplando el estadio luciendo los colores oficiales',
    url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80',
    tag: 'Blindaje de Estrella'
  },
  {
    id: 'renov-4',
    category: 'renovaciones',
    title: 'Firma y Rúbrica en el Despacho Oficial',
    description: 'Documento protocolario sellando la vinculación a largo plazo',
    url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80',
    tag: 'Firma Oficial'
  },
  {
    id: 'renov-5',
    category: 'renovaciones',
    title: 'Foco Cenital sobre la Camiseta en el Vestuario',
    description: 'Detalle de la camiseta en el santuario del equipo',
    url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80',
    tag: 'Ampliación Contractual'
  },
  {
    id: 'renov-6',
    category: 'renovaciones',
    title: 'Concentración Máxima en el Túnel con el Escudo',
    description: 'Mirada fija hacia el terreno de juego defendiendo los colores',
    url: 'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?w=800&auto=format&fit=crop&q=80',
    tag: 'Compromiso Total'
  },
  {
    id: 'renov-7',
    category: 'renovaciones',
    title: 'Pose de Espalda Bajo los Focos del Estadio',
    description: 'Focos encendidos iluminando la espalda con el dorsal',
    url: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&auto=format&fit=crop&q=80',
    tag: 'Hasta 2030'
  },
  {
    id: 'renov-8',
    category: 'renovaciones',
    title: 'Comparecencia y Posado de Ampliación de Contrato',
    description: 'Rueda de prensa y fotos oficiales ante los medios',
    url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=80',
    tag: 'Rueda de Prensa'
  },

  // 1. DÍA DE PARTIDO (MATCHDAY)
  {
    id: 'match-1',
    category: 'matchday',
    title: 'Noche de Partido en el Templo',
    description: 'Estadio a rebosar bajo los focos de la competición oficial',
    url: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=800&auto=format&fit=crop&q=80',
    tag: 'Día de Partido'
  },
  {
    id: 'match-2',
    category: 'matchday',
    title: 'Balón Oficial y Césped Cortado',
    description: 'Balón de partido sobre el césped preparado para el pitido inicial',
    url: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800&auto=format&fit=crop&q=80',
    tag: 'Previa Oficial'
  },
  {
    id: 'match-3',
    category: 'matchday',
    title: 'Túnel de Salida al Campo',
    description: 'Perspectiva del túnel de acceso con concentración máxima',
    url: 'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?w=800&auto=format&fit=crop&q=80',
    tag: 'Concentración'
  },
  {
    id: 'match-4',
    category: 'matchday',
    title: 'Disputa y Fuego en el Verde',
    description: 'Intensidad, velocidad y choque al límite en el césped',
    url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80',
    tag: 'Matchday'
  },
  {
    id: 'match-5',
    category: 'matchday',
    title: 'Duelo Aéreo en el Área',
    description: 'Lucha por arriba rematando un centro milimétrico',
    url: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800&auto=format&fit=crop&q=80',
    tag: 'Minuto a Minuto'
  },
  {
    id: 'match-6',
    category: 'matchday',
    title: 'Banderín y Balón Parado',
    description: 'Tensión en el lanzamiento de córner buscando el gol decisivo',
    url: 'https://images.unsplash.com/photo-1524015368236-bbf6f72545b6?w=800&auto=format&fit=crop&q=80',
    tag: 'Balón Parado'
  },

  // 2. NOCHES EUROPEAS & COPAS (CHAMPIONS)
  {
    id: 'champ-1',
    category: 'champions',
    title: 'Noche de Estrellas Europeas',
    description: 'Atmósfera solemne de torneo continental bajo los focos',
    url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop&q=80',
    tag: 'UEFA Champions League'
  },
  {
    id: 'champ-2',
    category: 'champions',
    title: 'El Gran Escenario Continental',
    description: 'Ambiente de semifinal y final donde se forjan las leyendas',
    url: 'https://images.unsplash.com/photo-1516733968668-dbdce39c4651?w=800&auto=format&fit=crop&q=80',
    tag: 'Noche Europea'
  },
  {
    id: 'champ-3',
    category: 'champions',
    title: 'Coliseo Iluminado para la Gloria',
    description: 'El feudo preparado para una gesta inolvidable',
    url: 'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=800&auto=format&fit=crop&q=80',
    tag: 'Europa League'
  },
  {
    id: 'champ-4',
    category: 'champions',
    title: 'Eliminatoria a Todo o Nada',
    description: 'Partido de vuelta a vida o muerte por un billete a la final',
    url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
    tag: 'Eliminatoria Directa'
  },

  // 3. FICHAJES & PRESENTACIÓN
  {
    id: 'sign-1',
    category: 'fichajes',
    title: 'Firma de Contrato Oficial',
    description: 'Rúbrica del acuerdo contractual con la directiva',
    url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80',
    tag: 'Fichaje Oficial'
  },
  {
    id: 'sign-2',
    category: 'fichajes',
    title: 'Camiseta y Dorsal de Gala',
    description: 'La nueva elástica colgada en la taquilla oficial',
    url: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&auto=format&fit=crop&q=80',
    tag: 'Nuevo Dorsal'
  },
  {
    id: 'sign-3',
    category: 'fichajes',
    title: 'Presentación en el Césped',
    description: 'Primeros toques con el balón y posado ante los medios',
    url: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&auto=format&fit=crop&q=80',
    tag: 'Presentación'
  },
  {
    id: 'sign-4',
    category: 'fichajes',
    title: 'Botas de Oro para el Crack',
    description: 'Calzado de gala preparado para marcar época',
    url: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&auto=format&fit=crop&q=80',
    tag: 'Refuerzo Galáctico'
  },
  {
    id: 'sign-5',
    category: 'fichajes',
    title: 'Reconocimiento Médico Superado',
    description: 'Pruebas físicas completadas con éxito en los servicios del club',
    url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
    tag: 'Apto Médico'
  },
  {
    id: 'sign-6',
    category: 'fichajes',
    title: 'Renovación y Blindaje',
    description: 'Acuerdo sellado para asegurar la continuidad de nuestra estrella',
    url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&auto=format&fit=crop&q=80',
    tag: 'Renovación'
  },

  // 4. INSTITUCIONAL & SALA DE PRENSA
  {
    id: 'inst-1',
    category: 'institucional',
    title: 'Sala de Prensa Oficial',
    description: 'Micrófonos y fondo oficial para comparecencias solemnes',
    url: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&auto=format&fit=crop&q=80',
    tag: 'Comunicado Oficial'
  },
  {
    id: 'inst-2',
    category: 'institucional',
    title: 'Estadio Institucional',
    description: 'Panorámica solemne del estadio iluminado con señorío',
    url: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&auto=format&fit=crop&q=80',
    tag: 'Institucional'
  },
  {
    id: 'inst-3',
    category: 'institucional',
    title: 'Despacho de Presidencia',
    description: 'Documento oficial y protocolo de la cúpula directiva',
    url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80',
    tag: 'Acuerdo Institucional'
  },
  {
    id: 'inst-4',
    category: 'institucional',
    title: 'Rueda de Prensa del Entrenador',
    description: 'El míster responde a las preguntas de los periodistas',
    url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=80',
    tag: 'Rueda de Prensa'
  },
  {
    id: 'inst-5',
    category: 'institucional',
    title: 'Reunión de la Junta Directiva',
    description: 'Planificación deportiva y presupuestaria del proyecto',
    url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
    tag: 'Junta Directiva'
  },

  // 5. ENTRENAMIENTOS & GYM
  {
    id: 'train-1',
    category: 'entrenamiento',
    title: 'Sesión Física en la Ciudad Deportiva',
    description: 'Trabajo físico de alta exigencia preparando el partido',
    url: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=800&auto=format&fit=crop&q=80',
    tag: 'Entrenamiento'
  },
  {
    id: 'train-2',
    category: 'entrenamiento',
    title: 'Pólvora y Tiro a Puerta',
    description: 'Ensayo de finalización ajustando disparos a la escuadra',
    url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&auto=format&fit=crop&q=80',
    tag: 'Puesta a Punto'
  },
  {
    id: 'train-3',
    category: 'entrenamiento',
    title: 'Rondos y Toque Rápido',
    description: 'Dinámica de posesión y velocidad de circulación del balón',
    url: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&auto=format&fit=crop&q=80',
    tag: 'Sesión Táctica'
  },
  {
    id: 'train-4',
    category: 'entrenamiento',
    title: 'Sprint y Potencia Aeróbica',
    description: 'Series de velocidad para mantener un ritmo demoledor',
    url: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&auto=format&fit=crop&q=80',
    tag: 'Ciudad Deportiva'
  },
  {
    id: 'train-5',
    category: 'entrenamiento',
    title: 'Gimnasio de Alto Rendimiento',
    description: 'Fortalecimiento muscular y prevención de lesiones',
    url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
    tag: 'Gimnasio Oficial'
  },
  {
    id: 'train-6',
    category: 'entrenamiento',
    title: 'Charla Táctica en el Verde',
    description: 'El staff técnico dando consignas clave antes de competir',
    url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&auto=format&fit=crop&q=80',
    tag: 'Instrucciones del Míster'
  },

  // 6. CELEBRACIÓN & TÍTULO
  {
    id: 'celeb-1',
    category: 'celebracion',
    title: 'Victoria Épica y Puño Arriba',
    description: 'Celebración por todo lo alto tras lograr los 3 puntos',
    url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80',
    tag: 'Gran Victoria'
  },
  {
    id: 'celeb-2',
    category: 'celebracion',
    title: 'Copa al Cielo de Campeones',
    description: 'Momento histórico levantando el trofeo oficial de la temporada',
    url: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&auto=format&fit=crop&q=80',
    tag: '¡CAMPEONES!'
  },
  {
    id: 'celeb-3',
    category: 'celebracion',
    title: 'Grada en Llamas con Bengalas',
    description: 'La afición empujando al equipo con cánticos y pasión desatada',
    url: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800&auto=format&fit=crop&q=80',
    tag: 'Nuestra Afición'
  },
  {
    id: 'celeb-4',
    category: 'celebracion',
    title: 'Piña de Gol en el Descuento',
    description: 'Abrazo unánime de toda la plantilla celebrando el triunfo',
    url: 'https://images.unsplash.com/photo-1520342868574-5fa3804e551c?w=800&auto=format&fit=crop&q=80',
    tag: '¡Éxtasis de Gol!'
  },
  {
    id: 'celeb-5',
    category: 'celebracion',
    title: 'Lluvia de Confeti y Vuelta de Honor',
    description: 'Agradecimiento a la hinchada con el trofeo en el césped',
    url: 'https://images.unsplash.com/photo-1471295253337-3ceaaedca402?w=800&auto=format&fit=crop&q=80',
    tag: 'Celebración Histórica'
  },

  // 7. ESTADIO & AFICIÓN
  {
    id: 'stad-1',
    category: 'estadio',
    title: 'El Templo Inexpugnable',
    description: 'El fortín del club iluminado donde nadie regala nada',
    url: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&auto=format&fit=crop&q=80',
    tag: 'Nuestro Estadio'
  },
  {
    id: 'stad-2',
    category: 'estadio',
    title: 'Mosaico de Gala en la Grada',
    description: 'Colorido y devoción en las tribunas animando sin parar',
    url: 'https://images.unsplash.com/photo-1486286701208-1d58e9338013?w=800&auto=format&fit=crop&q=80',
    tag: 'Grada de Animación'
  },
  {
    id: 'stad-3',
    category: 'estadio',
    title: 'Tribunas y Butacas del Feudo',
    description: 'El templo del club vestido con los colores oficiales',
    url: 'https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?w=800&auto=format&fit=crop&q=80',
    tag: 'El Coliseo'
  },

  // 8. CANTERA & JÓVENES
  {
    id: 'cant-1',
    category: 'cantera',
    title: 'El Futuro de la Academia',
    description: 'Jóvenes promesas formándose con la filosofía del escudo',
    url: 'https://images.unsplash.com/photo-1516726817505-f5ed825624d8?w=800&auto=format&fit=crop&q=80',
    tag: 'La Cantera'
  },
  {
    id: 'cant-2',
    category: 'cantera',
    title: 'Pasión y Sueños de Primera',
    description: 'Chicos compitiendo con orgullo para ganarse una oportunidad',
    url: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?w=800&auto=format&fit=crop&q=80',
    tag: 'Generación Dorada'
  },
  {
    id: 'cant-3',
    category: 'cantera',
    title: 'Informe del Departamento de Scouting',
    description: 'Seguimiento de jóvenes perlas y talentos mundiales',
    url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=80',
    tag: 'Ojeadores Oficiales'
  },

  // 9. TÁCTICA & VESTUARIO
  {
    id: 'tact-1',
    category: 'tactica',
    title: 'Vestuario Listo para la Batalla',
    description: 'Las taquillas, camisetas y brazalete antes de pisar el verde',
    url: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=800&auto=format&fit=crop&q=80',
    tag: 'Vestuario Oficial'
  },
  {
    id: 'tact-2',
    category: 'tactica',
    title: 'Pizarra Táctica y Balón Parado',
    description: 'Análisis minucioso del rival y jugadas ensayadas',
    url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&auto=format&fit=crop&q=80',
    tag: 'Estrategia Táctica'
  },
  {
    id: 'tact-3',
    category: 'tactica',
    title: 'Las Armas del Partido',
    description: 'Botas limpias, tacos afilados y vendas para dejarse la piel',
    url: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&auto=format&fit=crop&q=80',
    tag: 'Equipamiento'
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
    id: 'tmpl-champions',
    name: '⭐ Noche de Champions',
    tag: 'UEFA Champions League',
    title: '¡NOCHE DE GLORIA EUROPEA!',
    subtitle: 'Donde Nacen las Leyendas',
    imageId: 'champ-1',
    text: `🌟 Vuelven a sonar las notas del himno de las estrellas. Esta noche nuestro club disputa una batalla continental trascendental.\n\nJuntos hemos superado las mayores tormentas; hoy volveremos a demostrar de qué pasta estamos hechos.`
  },
  {
    id: 'tmpl-signing',
    name: '✍️ Fichaje Confirmado',
    tag: 'Principio de Acuerdo',
    title: '¡BIENVENIDO A TU NUEVA CASA!',
    subtitle: 'Refuerzo de Garantías',
    imageId: 'sign-3',
    text: `⚡ El club hace oficial la incorporación del futbolista a la disciplina del primer equipo tras superar satisfactoriamente el reconocimiento médico.\n\nLlega para aportar calidad, desequilibrio y hambre de títulos a nuestro proyecto.`
  },
  {
    id: 'tmpl-renewal',
    name: '✍️👕 Renovación de Jugador',
    tag: 'Renovación Oficial',
    title: 'BLINDAJE CONTRACTUAL',
    subtitle: 'Compromiso y Fidelidad',
    imageId: 'renov-1',
    text: `🤝✍️ El club y el futbolista han rubricado la ampliación oficial de su contrato.\n\nLa camiseta con su dorsal y nombre sigue en casa para orgullo de toda la afición. ¡A seguir haciendo historia juntos!`
  },
  {
    id: 'tmpl-medical',
    name: '🩺 Parte Médico',
    tag: 'Parte Médico Oficial',
    title: 'INFORME DE LOS SERVICIOS MÉDICOS',
    subtitle: 'Evolución Clínica',
    imageId: 'sign-5',
    text: `Tras las pruebas médicas realizadas esta mañana en la clínica del club, se confirma que el jugador sufre una sobrecarga muscular leve.\n\nSu evolución marcará la disponibilidad para la próxima convocatoria. ¡Te esperamos pronto en el verde!`
  },
  {
    id: 'tmpl-academy',
    name: '🌟 Debut de Canterano',
    tag: 'Orgullo de Cantera',
    title: 'EL SUEÑO DE UNA VIDA',
    subtitle: 'Forjado en Nuestras Categorías Inferiores',
    imageId: 'cant-1',
    text: `👏 Orgullo inmenso al ver a uno de los nuestros dar el salto definitivo al primer equipo.\n\nAños de sacrificio, disciplina y amor por estos colores le llevan a cumplir el sueño que todo niño tiene en la academia.`
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
