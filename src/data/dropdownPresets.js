// Dropdown Presets & Options for EA Sports FC Career Hub
// Converts manual text typing into smooth, fast, console-like dropdown selections

export const COMPETITION_OPTIONS = [
  'LALIGA EA SPORTS',
  'LALIGA HYPERMOTION',
  'Premier League',
  'Serie A',
  'Bundesliga',
  'Ligue 1',
  'Liga Profesional Argentina',
  'Copa de la Liga Argentina',
  'Copa Argentina',
  'CONMEBOL Libertadores',
  'CONMEBOL Sudamericana',
  'UEFA Champions League',
  'UEFA Europa League',
  'UEFA Conference League',
  'Copa del Rey',
  'FA Cup',
  'Carabao Cup',
  'DFB-Pokal',
  'Coppa Italia',
  'Coupe de France',
  'Supercopa de España',
  'Supercopa de Europa',
  'Amistoso de Pretemporada'
];

export const MATCHDAY_OPTIONS = [
  ...Array.from({ length: 38 }, (_, i) => `Jornada ${i + 1}`),
  'Fase de Grupos · J1',
  'Fase de Grupos · J2',
  'Fase de Grupos · J3',
  'Fase de Grupos · J4',
  'Fase de Grupos · J5',
  'Fase de Grupos · J6',
  'Ronda Previa / Playoffs',
  'Dieciseisavos de Final',
  'Octavos de Final · Ida',
  'Octavos de Final · Vuelta',
  'Cuartos de Final · Ida',
  'Cuartos de Final · Vuelta',
  'Semifinales · Ida',
  'Semifinales · Vuelta',
  'Gran Final 🏆'
];

export const POST_TAG_OPTIONS = [
  '📢 Comunicado Oficial',
  '📋 11 Inicial del Partido',
  '✍️ Principio de Acuerdo',
  '✍️ Fichaje Confirmado',
  '⭐ Renovación de Contrato',
  '🏥 Parte Médico Oficial',
  '🏆 Celebración de Título',
  '🏃 Sesión de Entrenamiento',
  '🎙️ Rueda de Prensa',
  '👏 Mensaje a la Afición',
  '🔥 Arenga en el Vestuario',
  '📊 Análisis Táctico'
];

export const POST_TITLE_OPTIONS = [
  '¡COMUNICADO OFICIAL!',
  '¡ONCE TITULAR CONFIRMADO!',
  '¡BIENVENIDO A TU NUEVA CASA!',
  'PRINCIPIO DE ACUERDO',
  '¡RENOVACIÓN HASTA 2030!',
  'INFORME DE LOS SERVICIOS MÉDICOS',
  '¡CAMPEONES! NOCHE HISTÓRICA',
  '¡A POR LOS TRES PUNTOS!',
  'GRACIAS POR VUESTRO APOYO',
  'ENFOQUE MÁXIMO EN EL ENTRENAMIENTO',
  'PALABRAS DEL MÍSTER'
];

export const NATIONALITY_OPTIONS = [
  { label: '🇪🇸 España', country: 'España', flag: '🇪🇸' },
  { label: '🇫🇷 Francia', country: 'Francia', flag: '🇫🇷' },
  { label: '🇧🇷 Brasil', country: 'Brasil', flag: '🇧🇷' },
  { label: '🇦🇷 Argentina', country: 'Argentina', flag: '🇦🇷' },
  { label: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Inglaterra', country: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { label: '🇩🇪 Alemania', country: 'Alemania', flag: '🇩🇪' },
  { label: '🇮🇹 Italia', country: 'Italia', flag: '🇮🇹' },
  { label: '🇵🇹 Portugal', country: 'Portugal', flag: '🇵🇹' },
  { label: '🇳🇱 Países Bajos', country: 'Países Bajos', flag: '🇳🇱' },
  { label: '🇧🇪 Bélgica', country: 'Bélgica', flag: '🇧🇪' },
  { label: '🇺🇾 Uruguay', country: 'Uruguay', flag: '🇺🇾' },
  { label: '🇨🇴 Colombia', country: 'Colombia', flag: '🇨🇴' },
  { label: '🇲🇽 México', country: 'México', flag: '🇲🇽' },
  { label: '🇨🇱 Chile', country: 'Chile', flag: '🇨🇱' },
  { label: '🇪🇨 Ecuador', country: 'Ecuador', flag: '🇪🇨' },
  { label: '🇻🇪 Venezuela', country: 'Venezuela', flag: '🇻🇪' },
  { label: '🇵🇾 Paraguay', country: 'Paraguay', flag: '🇵🇾' },
  { label: '🇭🇷 Croacia', country: 'Croacia', flag: '🇭🇷' },
  { label: '🇳🇴 Noruega', country: 'Noruega', flag: '🇳🇴' },
  { label: '🇵🇱 Polonia', country: 'Polonia', flag: '🇵🇱' },
  { label: '🇲🇦 Marruecos', country: 'Marruecos', flag: '🇲🇦' },
  { label: '🇸🇳 Senegal', country: 'Senegal', flag: '🇸🇳' },
  { label: '🇯🇵 Japón', country: 'Japón', flag: '🇯🇵' },
  { label: '🇰🇷 Corea del Sur', country: 'Corea del Sur', flag: '🇰🇷' },
  { label: '🇺🇸 Estados Unidos', country: 'Estados Unidos', flag: '🇺🇸' },
  { label: '🇨🇦 Canadá', country: 'Canadá', flag: '🇨🇦' }
];

export const TRANSFER_COST_OPTIONS = [
  'Libre / Fin de Contrato',
  'Cesión Simple',
  'Cesión con Opción de Compra',
  '2.000.000 €',
  '5.000.000 €',
  '8.000.000 €',
  '12.000.000 €',
  '15.000.000 €',
  '20.000.000 €',
  '25.000.000 €',
  '30.000.000 €',
  '40.000.000 €',
  '50.000.000 €',
  '65.000.000 €',
  '80.000.000 €',
  '100.000.000 €',
  '120.000.000 €',
  '150.000.000 €'
];

export const TRANSFER_DATE_OPTIONS = [
  '01 jul 2025 (Apertura Verano)',
  '15 jul 2025',
  '01 ago 2025',
  '15 ago 2025',
  '31 ago 2025 (Deadline Day)',
  '01 ene 2026 (Apertura Invierno)',
  '15 ene 2026',
  '31 ene 2026 (Cierre Invierno)',
  '01 jul 2026 (Verano EA FC 27)',
  '15 jul 2026',
  '01 ago 2026',
  '31 ago 2026 (Deadline Day)'
];

export const CONTRACT_YEAR_OPTIONS = [
  '2026',
  '2027',
  '2028',
  '2029',
  '2030',
  '2031',
  '2032',
  '2033',
  '2034',
  '2035'
];

export const WAGE_OPTIONS = [
  '5.000 €/sem',
  '15.000 €/sem',
  '25.000 €/sem',
  '35.000 €/sem',
  '50.000 €/sem',
  '75.000 €/sem',
  '100.000 €/sem',
  '150.000 €/sem',
  '220.000 €/sem',
  '350.000 €/sem'
];

export const MARKET_VALUE_OPTIONS = [
  '1.000.000 €',
  '3.000.000 €',
  '5.000.000 €',
  '8.000.000 €',
  '12.000.000 €',
  '18.000.000 €',
  '25.000.000 €',
  '35.000.000 €',
  '50.000.000 €',
  '70.000.000 €',
  '90.000.000 €',
  '120.000.000 €',
  '150.000.000 €'
];

export const MINUTE_OPTIONS = [
  "5'", "12'", "18'", "24'", "33'", "41'", "45'", "45'+2",
  "52'", "59'", "66'", "73'", "81'", "87'", "90'", "90'+3", "90'+5"
];

export const GOAL_TYPE_OPTIONS = [
  'Gol en Jugada',
  '⚽ De Penalti',
  '🎯 Falta Directa',
  '💥 De Cabeza',
  '🤦 En Propia Puerta'
];

export const SUB_REASON_OPTIONS = [
  'Táctico',
  'Lesión 🚑',
  'Cansancio ⚡',
  'Ovación 👏',
  'Rotación 🔄'
];

export const CARD_TYPE_OPTIONS = [
  { value: 'yellow', label: '🟨 Tarjeta Amarilla' },
  { value: 'red', label: '🟥 Roja Directa' },
  { value: 'second_yellow', label: '🟨🟥 Doble Amarilla' }
];

export const CARD_REASON_OPTIONS = [
  'Falta táctica',
  'Entrada a destiempo',
  'Protestas al árbitro',
  'Pérdida de tiempo',
  'Mano voluntaria',
  'Tángana / Discusión'
];

