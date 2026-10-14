// Centralized Database Adapter for EA Sports FC 26 & 27
// Integrates 52 official clubs and 708+ authentic players from database.json
import rawDatabase from './data/database.json';

const CUSTOM_DB_KEY = 'ea_fc_custom_database_json';

export function getActiveDatabase() {
  try {
    const custom = localStorage.getItem(CUSTOM_DB_KEY);
    if (custom) {
      const parsed = JSON.parse(custom);
      if (parsed && Array.isArray(parsed.clubs) && parsed.clubs.length >= rawDatabase.clubs.length) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Error reading custom database from localStorage", err);
  }
  return rawDatabase;
}

export function saveCustomDatabase(newDatabaseObj) {
  try {
    localStorage.setItem(CUSTOM_DB_KEY, JSON.stringify(newDatabaseObj));
    return true;
  } catch (err) {
    console.error("Error saving custom database to localStorage", err);
    return false;
  }
}

export function resetDatabaseToDefault() {
  localStorage.removeItem(CUSTOM_DB_KEY);
}

// Helpers for Position & Nationality mapping
export function mapPositionToEs(pos) {
  const map = {
    'GK': 'POR',
    'CB': 'DFC',
    'LB': 'LI',
    'RB': 'LD',
    'LWB': 'CAI',
    'RWB': 'CAD',
    'CDM': 'MCD',
    'CM': 'MC',
    'CAM': 'MCO',
    'LM': 'MI',
    'RM': 'MD',
    'LW': 'EI',
    'RW': 'ED',
    'ST': 'DC'
  };
  return map[pos] || pos;
}

export function getPositionCategory(pos) {
  const p = mapPositionToEs(pos);
  if (p === 'POR') return 'POR';
  if (['DFC', 'LI', 'LD', 'CAD', 'CAI'].includes(p)) return 'DEF';
  if (['MCD', 'MC', 'MCO', 'MI', 'MD'].includes(p)) return 'MED';
  return 'DEL';
}

export function getCountryFlag(nat) {
  const flags = {
    'España': '🇪🇸',
    'Francia': '🇫🇷',
    'Brasil': '🇧🇷',
    'Argentina': '🇦🇷',
    'Alemania': '🇩🇪',
    'Inglaterra': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    'Portugal': '🇵🇹',
    'Italia': '🇮🇹',
    'Países Bajos': '🇳🇱',
    'Bélgica': '🇧🇪',
    'Uruguay': '🇺🇾',
    'Croacia': '🇭🇷',
    'Georgia': '🇬🇪',
    'Rumanía': '🇷🇴',
    'Noruega': '🇳🇴',
    'Polonia': '🇵🇱',
    'Colombia': '🇨🇴',
    'Marruecos': '🇲🇦',
    'Senegal': '🇸🇳',
    'Austria': '🇦🇹',
    'Ucrania': '🇺🇦',
    'Dinamarca': '🇩🇰',
    'Turquía': '🇹🇷',
    'Japón': '🇯🇵',
    'Corea del Sur': '🇰🇷',
    'Serbia': '🇷🇸',
    'Nigeria': '🇳🇬',
    'Ghana': '🇬🇭',
    'México': '🇲🇽',
    'Chile': '🇨🇱',
    'Ecuador': '🇪🇨',
    'Venezuela': '🇻🇪',
    'Paraguay': '🇵🇾',
    'Estados Unidos': '🇺🇸',
    'Canadá': '🇨🇦',
    'Suecia': '🇸🇪',
    'Suiza': '🇨🇭',
    'Gabón': '🇬🇦',
    'Finlandia': '🇫🇮',
    'Arabia Saudí': '🇸🇦',
    'Costa de Marfil': '🇨🇮',
    'Argelia': '🇩🇿',
    'Burkina Faso': '🇧🇫',
    'Grecia': '🇬🇷',
    'Eslovaquia': '🇸🇰',
    'Eslovenia': '🇸🇮',
    'Perú': '🇵🇪',
    'Gales': '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
    'Irlanda': '🇮🇪',
    'Irlanda del Norte': '🇬🇧',
    'Bosnia': '🇧🇦',
    'República Checa': '🇨🇿',
    'Montenegro': '🇲🇪',
    'RD del Congo': '🇨🇩',
    'Malí': '🇲🇱',
    'Sudáfrica': '🇿🇦',
    'Túnez': '🇹🇳',
    'Australia': '🇦🇺',
    'Israel': '🇮🇱',
    'Kosovo': '🇽🇰',
    'Albania': '🇦🇱',
    'Surinam': '🇸🇷',
    'Luxemburgo': '🇱🇺',
    'República Dominicana': '🇩🇴'
  };
  return flags[nat] || '🏳️';
}

export function convertRosterPlayerToSquad(player) {
  const posEs = mapPositionToEs(player.pos || 'CM');
  const cat = getPositionCategory(posEs);
  const rating = Number(player.ovr) || 75;
  const age = Number(player.age) || 24;
  const potential = Math.min(99, rating + (age < 21 ? 7 : age < 25 ? 4 : age < 29 ? 1 : 0));
  const valMil = player.val || Math.round(rating * 0.4);
  const wageNum = (player.wage || Math.round(rating * 0.35)) * 1000;

  return {
    id: player.id || `sq-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    name: player.name,
    position: posEs,
    category: cat,
    number: Number(player.number) || 99,
    age,
    country: player.nat || "España",
    flag: getCountryFlag(player.nat || "España"),
    rating,
    potential,
    photo: player.imageUrl || "./default_player.svg",
    value: `${valMil} M €`,
    wage: `${wageNum.toLocaleString('es-ES')} €/sem`,
    contract: "2029",
    matches: 0,
    goals: 0,
    assists: 0,
    cleanSheets: 0,
    yellowCards: 0,
    redCards: 0,
    avgRating: 7.0,
    status: "Titular",
    morale: "Excelente",
    pac: player.pac,
    sho: player.sho,
    pas: player.pas,
    dri: player.dri,
    def: player.def,
    phy: player.phy
  };
}

export function buildAuthenticSquad(rawRoster = []) {
  if (!rawRoster || rawRoster.length === 0) return [];

  // Convert raw players to squad format
  const converted = rawRoster.map(convertRosterPlayerToSquad);

  // Pool of players available for tactical formation, sorted by rating desc
  const pool = [...converted].sort((a, b) => (b.rating || 75) - (a.rating || 75));

  function pickBest(positions) {
    const idx = pool.findIndex(p => positions.includes(p.position));
    if (idx !== -1) {
      return pool.splice(idx, 1)[0];
    }
    return null;
  }

  // 11 positions for authentic tactical 4-3-3 lineup
  const gk = pickBest(['POR']) || pool.splice(0, 1)[0];
  const rb = pickBest(['LD', 'CAD']) || pickBest(['DFC', 'LI']) || pool.splice(0, 1)[0];
  const cb1 = pickBest(['DFC']) || pickBest(['LD', 'LI']) || pool.splice(0, 1)[0];
  const cb2 = pickBest(['DFC']) || pickBest(['LD', 'LI']) || pool.splice(0, 1)[0];
  const lb = pickBest(['LI', 'CAI']) || pickBest(['DFC', 'LD']) || pool.splice(0, 1)[0];
  const mcd = pickBest(['MCD', 'MC']) || pool.splice(0, 1)[0];
  const mc1 = pickBest(['MC', 'MCO']) || pool.splice(0, 1)[0];
  const mco = pickBest(['MCO', 'MC']) || pool.splice(0, 1)[0];
  const rw = pickBest(['ED', 'MD']) || pickBest(['DC', 'EI']) || pool.splice(0, 1)[0];
  const st = pickBest(['DC']) || pickBest(['ED', 'EI']) || pool.splice(0, 1)[0];
  const lw = pickBest(['EI', 'MI']) || pickBest(['DC', 'ED']) || pool.splice(0, 1)[0];

  const starters = [gk, rb, cb1, cb2, lb, mcd, mc1, mco, rw, st, lw]
    .filter(Boolean)
    .map((p, idx) => ({
      ...p,
      status: idx === 0 && p.rating >= 85 ? "Titular (Capitán)" : "Titular"
    }));

  // Next up to 7 players form the active bench (Suplentes)
  const bench = pool.splice(0, 7).map(p => ({
    ...p,
    status: "Suplente"
  }));

  // Rest of the players are reserves
  const reserves = pool.map(p => ({
    ...p,
    status: "Reserva"
  }));

  return [...starters, ...bench, ...reserves];
}

// Format raw clubs from database.json
const currentDb = getActiveDatabase();

function formatClub(c, leagueName) {
  let leagueDisplayName = leagueName || c.league || c.leagueId;
  if (c.leagueId === 'laliga') leagueDisplayName = 'LALIGA EA SPORTS';
  else if (c.leagueId === 'segunda') leagueDisplayName = 'LaLiga Hypermotion';
  else if (c.leagueId === 'premier') leagueDisplayName = 'Premier League';
  else if (c.leagueId === 'seriea') leagueDisplayName = 'Serie A';
  else if (c.leagueId === 'bundesliga') leagueDisplayName = 'Bundesliga';
  else if (c.leagueId === 'ligue1') leagueDisplayName = 'Ligue 1';
  else if (c.leagueId === 'portugal') leagueDisplayName = 'Liga Portugal Betclic';
  else if (c.leagueId === 'eredivisie') leagueDisplayName = 'Eredivisie';
  else if (c.leagueId === 'championship') leagueDisplayName = 'EFL Championship';
  else if (c.leagueId === 'superlig') leagueDisplayName = 'Trendyol Süper Lig';
  else if (c.leagueId === 'argentina') leagueDisplayName = 'Liga Profesional Argentina';
  else if (c.leagueId === 'mls') leagueDisplayName = 'MLS (EEUU)';
  else if (c.leagueId === 'saudi') leagueDisplayName = 'Saudi Pro League';
  else if (c.leagueId === 'promesas') leagueDisplayName = 'Liga Promesas & Ascenso';
  else if (c.leagueId === 'other') leagueDisplayName = 'Resto del Mundo';

  return {
    id: c.id,
    name: c.name,
    shortName: c.shortName || c.name.slice(0, 3).toUpperCase(),
    leagueId: c.leagueId,
    league: leagueDisplayName,
    logo: c.badge || c.badgeUrl || "https://crests.football-data.org/95.svg",
    badge: c.badge || c.badgeUrl,
    badgeUrl: c.badgeUrl || c.badge,
    country: c.leagueId === 'premier' || c.leagueId === 'championship' ? 'Inglaterra' :
             c.leagueId === 'seriea' ? 'Italia' :
             c.leagueId === 'bundesliga' ? 'Alemania' :
             c.leagueId === 'ligue1' ? 'Francia' :
             c.leagueId === 'portugal' ? 'Portugal' :
             c.leagueId === 'eredivisie' ? 'Países Bajos' :
             c.leagueId === 'superlig' ? 'Turquía' :
             c.leagueId === 'argentina' ? 'Argentina' :
             c.leagueId === 'mls' ? 'Estados Unidos' :
             c.leagueId === 'saudi' ? 'Arabia Saudí' :
             c.leagueId === 'segunda' || c.leagueId === 'laliga' ? 'España' : (c.country || 'Internacional'),
    city: c.city || '',
    stadium: c.stadium || 'Estadio Municipal',
    budget: (c.budget ? c.budget * 1000000 : 35000000),
    roster: (c.roster || []).map(p => ({
      ...p,
      team: c.name,
      teamId: c.id,
      leagueId: c.leagueId
    }))
  };
}

export const LALIGA_CLUBS = currentDb.clubs
  .filter(c => c.leagueId === 'laliga')
  .map(c => formatClub(c, 'LALIGA EA SPORTS'));

export const SEGUNDA_CLUBS = currentDb.clubs
  .filter(c => c.leagueId === 'segunda')
  .map(c => formatClub(c, 'LaLiga Hypermotion'));

export const PREMIER_LEAGUE_CLUBS = currentDb.clubs
  .filter(c => c.leagueId === 'premier')
  .map(c => formatClub(c, 'Premier League'));

export const SERIE_A_CLUBS = currentDb.clubs
  .filter(c => c.leagueId === 'seriea')
  .map(c => formatClub(c, 'Serie A'));

export const MLS_CLUBS = currentDb.clubs
  .filter(c => c.leagueId === 'mls')
  .map(c => formatClub(c, 'MLS (EEUU)'));

export const SAUDI_CLUBS = currentDb.clubs
  .filter(c => c.leagueId === 'saudi')
  .map(c => formatClub(c, 'Saudi Pro League'));

export const BUNDESLIGA_CLUBS = currentDb.clubs
  .filter(c => c.leagueId === 'bundesliga')
  .map(c => formatClub(c, 'Bundesliga'));

export const LIGUE1_CLUBS = currentDb.clubs
  .filter(c => c.leagueId === 'ligue1')
  .map(c => formatClub(c, 'Ligue 1'));

export const PORTUGAL_CLUBS = currentDb.clubs
  .filter(c => c.leagueId === 'portugal')
  .map(c => formatClub(c, 'Liga Portugal Betclic'));

export const EREDIVISIE_CLUBS = currentDb.clubs
  .filter(c => c.leagueId === 'eredivisie')
  .map(c => formatClub(c, 'Eredivisie'));

export const CHAMPIONSHIP_CLUBS = currentDb.clubs
  .filter(c => c.leagueId === 'championship')
  .map(c => formatClub(c, 'EFL Championship'));

export const SUPERLIG_CLUBS = currentDb.clubs
  .filter(c => c.leagueId === 'superlig')
  .map(c => formatClub(c, 'Trendyol Süper Lig'));

export const ARGENTINA_CLUBS = currentDb.clubs
  .filter(c => c.leagueId === 'argentina')
  .map(c => formatClub(c, 'Liga Profesional Argentina'));

export const BRASILEIRAO_CLUBS = currentDb.clubs
  .filter(c => c.leagueId === 'brasileirao')
  .map(c => formatClub(c, 'Brasileirão Betano'));

export const SCOTLAND_CLUBS = currentDb.clubs
  .filter(c => c.leagueId === 'scotland')
  .map(c => formatClub(c, 'Scottish Premiership'));

export const BELGIUM_CLUBS = currentDb.clubs
  .filter(c => c.leagueId === 'belgium')
  .map(c => formatClub(c, 'Jupiler Pro League'));

export const EUROPEAN_GIANTS = currentDb.clubs
  .filter(c => ['bundesliga', 'ligue1', 'portugal', 'eredivisie', 'scotland', 'belgium', 'other'].includes(c.leagueId))
  .map(c => formatClub(c));

export const PROMESAS_CLUBS = currentDb.clubs
  .filter(c => c.leagueId === 'promesas')
  .map(c => formatClub(c, 'Liga Promesas & Ascenso'));

// Include EVERY club present in currentDb.clubs!
export const ALL_PRESET_CLUBS = currentDb.clubs.map(c => formatClub(c));

export const DATABASE_CLUBS = ALL_PRESET_CLUBS;

// Flatten all players across clubs with leagueId, teamId, teamName and logo attached!
export const DATABASE_PLAYERS = ALL_PRESET_CLUBS.flatMap(club => 
  (club.roster || []).map(p => ({
    ...p,
    teamId: club.id,
    teamName: club.name,
    teamLogo: club.logo,
    leagueId: club.leagueId,
    league: club.league
  }))
);

export const DATABASE_LEAGUES = currentDb.leagues || [
  { id: 'laliga', name: 'La Liga EA Sports 26/27', shortName: 'LALIGA', icon: '🇪🇸', logo: 'https://images.fotmob.com/image_resources/logo/leaguelogo/87.png', localLogo: './leagues/laliga.png', color: '#ff4b44' },
  { id: 'premier', name: 'Premier League 26/27', shortName: 'Premier League', icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', logo: 'https://images.fotmob.com/image_resources/logo/leaguelogo/47.png', localLogo: './leagues/premier.png', color: '#38003c' },
  { id: 'seriea', name: 'Serie A Enilive 26/27', shortName: 'Serie A', icon: '🇮🇹', logo: 'https://images.fotmob.com/image_resources/logo/leaguelogo/55.png', localLogo: './leagues/seriea.png', color: '#024494' },
  { id: 'bundesliga', name: 'Bundesliga 26/27', shortName: 'Bundesliga', icon: '🇩🇪', logo: 'https://images.fotmob.com/image_resources/logo/leaguelogo/54.png', localLogo: './leagues/bundesliga.png', color: '#d20515' },
  { id: 'ligue1', name: "Ligue 1 McDonald's 26/27", shortName: 'Ligue 1', icon: '🇫🇷', logo: 'https://images.fotmob.com/image_resources/logo/leaguelogo/53.png', localLogo: './leagues/ligue1.png', color: '#091c3e' },
  { id: 'brasileirao', name: 'Brasileirão Betano 26/27', shortName: 'Brasileirão', icon: '🇧🇷', logo: 'https://images.fotmob.com/image_resources/logo/leaguelogo/268.png', localLogo: './leagues/brasileirao.png', color: '#009b3a' },
  { id: 'scotland', name: 'Scottish Premiership 26/27', shortName: 'Premiership', icon: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', logo: 'https://images.fotmob.com/image_resources/logo/leaguelogo/65.png', localLogo: './leagues/scotland.png', color: '#002d62' },
  { id: 'belgium', name: 'Jupiler Pro League 26/27', shortName: 'Pro League', icon: '🇧🇪', logo: 'https://images.fotmob.com/image_resources/logo/leaguelogo/40.png', localLogo: './leagues/belgium.png', color: '#1a1a1a' },
  { id: 'portugal', name: 'Liga Portugal Betclic 26/27', shortName: 'Liga Portugal', icon: '🇵🇹', logo: 'https://images.fotmob.com/image_resources/logo/leaguelogo/61.png', localLogo: './leagues/portugal.png', color: '#006633' },
  { id: 'eredivisie', name: 'Eredivisie 26/27', shortName: 'Eredivisie', icon: '🇳🇱', logo: 'https://images.fotmob.com/image_resources/logo/leaguelogo/57.png', localLogo: './leagues/eredivisie.png', color: '#002f6c' },
  { id: 'championship', name: 'EFL Championship 26/27', shortName: 'Championship', icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', logo: 'https://images.fotmob.com/image_resources/logo/leaguelogo/48.png', localLogo: './leagues/championship.png', color: '#132257' },
  { id: 'superlig', name: 'Trendyol Süper Lig 26/27', shortName: 'Süper Lig', icon: '🇹🇷', logo: 'https://images.fotmob.com/image_resources/logo/leaguelogo/71.png', localLogo: './leagues/superlig.png', color: '#e30a17' },
  { id: 'argentina', name: 'Liga Profesional Argentina 26/27', shortName: 'Liga Profesional', icon: '🇦🇷', logo: 'https://images.fotmob.com/image_resources/logo/leaguelogo/112.png', localLogo: './leagues/argentina.png', color: '#74acdf' },
  { id: 'segunda', name: 'LaLiga Hypermotion 26/27', shortName: 'Hypermotion', icon: '🥈', logo: 'https://images.fotmob.com/image_resources/logo/leaguelogo/140.png', localLogo: './leagues/segunda.png', color: '#e20613' },
  { id: 'mls', name: 'MLS (EEUU) 26/27', shortName: 'MLS', icon: '🇺🇸', logo: 'https://images.fotmob.com/image_resources/logo/leaguelogo/130.png', localLogo: './leagues/mls.png', color: '#1c355e' },
  { id: 'saudi', name: 'Saudi Pro League 26/27', shortName: 'Saudi Pro', icon: '🇸🇦', logo: 'https://images.fotmob.com/image_resources/logo/leaguelogo/9906.png', localLogo: './leagues/saudi.png', color: '#006847' },
  { id: 'other', name: 'Resto del Mundo & Europa 26/27', shortName: 'Champions', icon: '🌍', logo: 'https://images.fotmob.com/image_resources/logo/leaguelogo/42.png', localLogo: './leagues/champions.png', color: '#001489' },
  { id: 'promesas', name: 'Liga Promesas & Ascenso 26/27', shortName: 'Promesas', icon: '🌟', logo: './leagues/promesas.svg', localLogo: './leagues/promesas.svg', color: '#e5a600' }
];

export function getLeagueInfo(leagueIdOrName) {
  if (!leagueIdOrName) return null;
  const str = String(leagueIdOrName).trim().toLowerCase();
  return DATABASE_LEAGUES.find(l => 
    l.id.toLowerCase() === str || 
    l.name.toLowerCase() === str ||
    (l.shortName && l.shortName.toLowerCase() === str) ||
    str.includes(l.id.toLowerCase()) ||
    l.name.toLowerCase().includes(str)
  ) || null;
}

export function getLeagueLogo(leagueIdOrName) {
  const info = getLeagueInfo(leagueIdOrName);
  return info?.logo || info?.localLogo || './leagues/laliga.png';
}

const CLUB_ALIASES = {
  'm. city': 'mci',
  'man city': 'mci',
  'manchester city': 'mci',
  'm. united': 'mun',
  'man united': 'mun',
  'man utd': 'mun',
  'manchester united': 'mun',
  'spurs': 'tot',
  'tottenham hotspur': 'tot',
  'chelsea fc': 'che',
  'arsenal fc': 'ars',
  'liverpool fc': 'liv',
  'coventry': 'cov',
  'coventry city': 'cov',
  'coventry city fc': 'cov',
  'hull': 'hul',
  'hull city': 'hul',
  'ipswich': 'ips',
  'ipswich town': 'ips',
  'leeds united': 'leeds',
  'forest': 'nfo',
  'nottingham': 'nfo',
  'nottingham forest': 'nfo',
  'sunderland afc': 'sunderland',
  'benfica': 'benfica',
  'sl benfica': 'benfica',
  'sporting': 'sporting_cp',
  'sporting cp': 'sporting_cp',
  'porto': 'fc_porto',
  'fc porto': 'fc_porto',
  'braga': 'sc_braga',
  'sc braga': 'sc_braga',
  'ajax': 'ajax',
  'afc ajax': 'ajax',
  'psv': 'psv',
  'psv eindhoven': 'psv',
  'feyenoord': 'feyenoord',
  'az': 'az_alkmaar',
  'az alkmaar': 'az_alkmaar',
  'burnley': 'burnley',
  'burnley fc': 'burnley',
  'sheffield united': 'sheffield_utd',
  'sunderland': 'sunderland',
  'galatasaray': 'galatasaray',
  'fenerbahce': 'fenerbahce',
  'fenerbahçe': 'fenerbahce',
  'besiktas': 'besiktas',
  'beşiktaş': 'besiktas',
  'trabzonspor': 'trabzonspor',
  'boca juniors': 'boca_juniors',
  'boca': 'boca_juniors',
  'river plate': 'river_plate',
  'river': 'river_plate'
};

export function getClubLogo(clubName) {
  if (!clubName) return "https://crests.football-data.org/95.svg";
  const search = clubName.trim().toLowerCase();
  
  // Check alias map
  if (CLUB_ALIASES[search]) {
    const target = ALL_PRESET_CLUBS.find(c => c.id === CLUB_ALIASES[search]);
    if (target?.logo || target?.badge) return target.logo || target.badge;
  }

  const found = ALL_PRESET_CLUBS.find(c => 
    c.name.toLowerCase() === search || 
    (c.shortName && c.shortName.toLowerCase() === search) ||
    (c.id && c.id.toLowerCase() === search) ||
    c.name.toLowerCase().includes(search) ||
    search.includes(c.name.toLowerCase())
  );
  return found?.logo || found?.badge || "https://crests.football-data.org/95.svg";
}

export function getClubTheme(clubName = '') {
  const n = (clubName || '').toLowerCase();
  if (n.includes('madrid') && !n.includes('atlético') && !n.includes('atletico')) {
    return { primary: '#f6c343', secondary: '#001a4e', text: '#ffffff', border: '#f6c343' };
  }
  if (n.includes('barcelona') || n.includes('barça')) {
    return { primary: '#edbb00', secondary: '#a50044', text: '#ffffff', border: '#edbb00' };
  }
  if (n.includes('valencia')) {
    return { primary: '#ff6600', secondary: '#000000', text: '#ffffff', border: '#ff6600' };
  }
  if (n.includes('atlético') || n.includes('atletico')) {
    return { primary: '#cb3524', secondary: '#1b325f', text: '#ffffff', border: '#cb3524' };
  }
  if (n.includes('arsenal')) {
    return { primary: '#ef0107', secondary: '#023474', text: '#ffffff', border: '#fdb913' };
  }
  if (n.includes('city') || n.includes('mci')) {
    return { primary: '#6cabdd', secondary: '#1c2c5b', text: '#ffffff', border: '#6cabdd' };
  }
  if (n.includes('liverpool')) {
    return { primary: '#c8102e', secondary: '#00b2a9', text: '#ffffff', border: '#f6eb61' };
  }
  if (n.includes('chelsea')) {
    return { primary: '#034694', secondary: '#dba111', text: '#ffffff', border: '#dba111' };
  }
  if (n.includes('united') || n.includes('mun')) {
    return { primary: '#da291c', secondary: '#000000', text: '#ffffff', border: '#fbe122' };
  }
  if (n.includes('tottenham') || n.includes('spurs')) {
    return { primary: '#132257', secondary: '#ffffff', text: '#ffffff', border: '#132257' };
  }
  if (n.includes('betis')) {
    return { primary: '#009540', secondary: '#ffffff', text: '#ffffff', border: '#009540' };
  }
  if (n.includes('sevilla')) {
    return { primary: '#d4001f', secondary: '#ffffff', text: '#ffffff', border: '#d4001f' };
  }
  if (n.includes('athletic')) {
    return { primary: '#ee2524', secondary: '#000000', text: '#ffffff', border: '#ee2524' };
  }
  if (n.includes('villarr')) {
    return { primary: '#ffe600', secondary: '#0055a5', text: '#ffffff', border: '#ffe600' };
  }
  if (n.includes('sociedad')) {
    return { primary: '#0055a5', secondary: '#ffffff', text: '#ffffff', border: '#0055a5' };
  }
  return { primary: '#00ff87', secondary: '#0f172a', text: '#ffffff', border: '#00ff87' };
}

export function getClubRoster(clubNameOrId) {
  if (!clubNameOrId) return [];
  const search = clubNameOrId.trim().toLowerCase();
  const club = ALL_PRESET_CLUBS.find(c => 
    c.id.toLowerCase() === search || 
    c.name.toLowerCase() === search ||
    (c.shortName && c.shortName.toLowerCase() === search) ||
    c.name.toLowerCase().includes(search) ||
    search.includes(c.name.toLowerCase())
  );
  if (!club || !club.roster || club.roster.length === 0) return [];
  return buildAuthenticSquad(club.roster);
}

export function searchDatabasePlayers(query = '', options = {}) {
  const { excludeSquadNames = [], excludeClubName = '' } = options;
  const q = (query || '').toLowerCase().trim();

  let pool = DATABASE_PLAYERS;

  // Filter out any players already in user's squad
  if (excludeSquadNames && excludeSquadNames.length > 0) {
    const squadSet = new Set(excludeSquadNames.map(n => (n || '').toLowerCase().trim()));
    pool = pool.filter(p => !squadSet.has((p.name || '').toLowerCase().trim()));
  }

  // Filter out any players belonging to user's club (cannot buy your own players)
  if (excludeClubName) {
    const exc = excludeClubName.toLowerCase().trim();
    pool = pool.filter(p => {
      const team = (p.teamName || '').toLowerCase().trim();
      return team !== exc && !team.includes(exc) && !exc.includes(team);
    });
  }

  if (!q) return pool.slice(0, 50);

  return pool.filter(p => 
    p.name.toLowerCase().includes(q) ||
    p.teamName.toLowerCase().includes(q) ||
    p.pos.toLowerCase().includes(q) ||
    (p.nat && p.nat.toLowerCase().includes(q))
  );
}

import playerPhotoMap from './data/playerPhotoMap.json';

export function getRealPlayerPhoto(name, fallback = null) {
  if (!name) return fallback || "./default_player.svg";
  const clean = name.trim();
  if (playerPhotoMap[clean]) return playerPhotoMap[clean];

  const lower = clean.toLowerCase();
  for (const [k, v] of Object.entries(playerPhotoMap)) {
    if (k.toLowerCase() === lower || k.toLowerCase().includes(lower) || lower.includes(k.toLowerCase())) {
      return v;
    }
  }

  // Look up in DATABASE_PLAYERS
  if (Array.isArray(DATABASE_PLAYERS)) {
    const found = DATABASE_PLAYERS.find(p => 
      p.name && (p.name.toLowerCase() === lower || p.name.toLowerCase().includes(lower) || lower.includes(p.name.toLowerCase()))
    );
    if (found?.imageUrl && !found.imageUrl.includes('default_player')) {
      return found.imageUrl;
    }
  }

  return fallback || "./default_player.svg";
}

// Manager Presets for Career Creation with Real Photos
export const MANAGER_PRESETS = [
  {
    name: "Carlos Corberán",
    avatar: "https://images.fotmob.com/image_resources/playerimages/819528.png",
    nationality: "🇪🇸 España",
    age: 42,
    tactics: "4-3-3 Gegenpressing"
  },
  {
    name: "Pep Guardiola",
    avatar: "https://images.fotmob.com/image_resources/playerimages/41636.png",
    nationality: "🇪🇸 España",
    age: 54,
    tactics: "Fútbol de Posesión y Control"
  },
  {
    name: "Mikel Arteta",
    avatar: "https://images.fotmob.com/image_resources/playerimages/24011.png",
    nationality: "🇪🇸 España",
    age: 43,
    tactics: "Juego de Posición Dominante"
  },
  {
    name: "Xabi Alonso",
    avatar: "https://images.fotmob.com/image_resources/playerimages/30889.png",
    nationality: "🇪🇸 España",
    age: 43,
    tactics: "3-4-2-1 Transiciones Letales"
  },
  {
    name: "Carlo Ancelotti",
    avatar: "https://images.fotmob.com/image_resources/playerimages/78619.png",
    nationality: "🇮🇹 Italia",
    age: 66,
    tactics: "Equilibrio y Gestión de Estrellas"
  },
  {
    name: "Jürgen Klopp",
    avatar: "https://images.fotmob.com/image_resources/playerimages/78660.png",
    nationality: "🇩🇪 Alemania",
    age: 58,
    tactics: "Heavy Metal Football & Presión Alta"
  },
  {
    name: "Diego Simeone",
    avatar: "https://images.fotmob.com/image_resources/playerimages/2642.png",
    nationality: "🇦🇷 Argentina",
    age: 55,
    tactics: "Bloque Bajo y Contragolpe Letal"
  },
  {
    name: "Entrenador Creado (Tú Mismo)",
    avatar: "https://images.fotmob.com/image_resources/playerimages/819528.png",
    nationality: "🇪🇸 España",
    age: 35,
    tactics: "Filosofía Propia"
  }
];

// High-quality official player face cutouts
export const PLAYER_FACE_PRESETS = [
  "https://images.fotmob.com/image_resources/playerimages/701154.png", // Mbappé
  "https://images.fotmob.com/image_resources/playerimages/846033.png", // Vinícius Jr
  "https://images.fotmob.com/image_resources/playerimages/1077894.png", // Bellingham
  "https://images.fotmob.com/image_resources/playerimages/1467236.png", // Lamine Yamal
  "https://images.fotmob.com/image_resources/playerimages/737066.png", // Haaland
  "https://images.fotmob.com/image_resources/playerimages/1083323.png", // Pedri
  "https://images.fotmob.com/image_resources/playerimages/1202110.png", // Nico Williams
  "https://images.fotmob.com/image_resources/playerimages/675088.png", // Rodri
  "https://images.fotmob.com/image_resources/playerimages/184138.png", // Griezmann
  "https://images.fotmob.com/image_resources/playerimages/170323.png", // Courtois
  "https://images.fotmob.com/image_resources/playerimages/93447.png", // Lewandowski
  "https://images.fotmob.com/image_resources/playerimages/948800.png"  // Mamardashvili
];

// Helper to get dynamically filtered opponents based on competition and the user's club league
export function getOpponentsForContext(competition, userLeague, userClubName) {
  const comp = (competition || '').toLowerCase();
  const uLeague = (userLeague || '').toLowerCase();
  const myClub = (userClubName || '').trim().toLowerCase();

  const filterOutMe = (list) => (list || []).filter(c => c.name.trim().toLowerCase() !== myClub);

  let primary = [];
  let primaryLabel = '';
  let secondary = [];
  let secondaryLabel = '🌍 Otros Clubes Europeos / Amistosos';

  // 1. Premier League / FA Cup / Carabao Cup
  if (comp.includes('premier') || comp.includes('fa cup') || comp.includes('carabao')) {
    primary = filterOutMe(PREMIER_LEAGUE_CLUBS);
    primaryLabel = '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Rivales de Premier League';
    secondary = filterOutMe([...BUNDESLIGA_CLUBS, ...LIGUE1_CLUBS, ...SERIE_A_CLUBS, ...LALIGA_CLUBS, ...SEGUNDA_CLUBS]);
  }
  // 2. Serie A / Coppa Italia
  else if (comp.includes('serie a') || comp.includes('coppa italia')) {
    primary = filterOutMe(SERIE_A_CLUBS);
    primaryLabel = '🇮🇹 Rivales de Serie A';
    secondary = filterOutMe([...BUNDESLIGA_CLUBS, ...LIGUE1_CLUBS, ...PREMIER_LEAGUE_CLUBS, ...LALIGA_CLUBS, ...SEGUNDA_CLUBS]);
  }
  // 3. Bundesliga / DFB-Pokal / Supercopa Alemana
  else if (comp.includes('bundesliga') || comp.includes('dfb') || comp.includes('pokal')) {
    primary = filterOutMe(BUNDESLIGA_CLUBS);
    primaryLabel = '🇩🇪 Rivales de Bundesliga';
    secondary = filterOutMe([...LIGUE1_CLUBS, ...PREMIER_LEAGUE_CLUBS, ...SERIE_A_CLUBS, ...LALIGA_CLUBS]);
  }
  // 4. Ligue 1 / Coupe de France / Trophée des Champions
  else if (comp.includes('ligue 1') || comp.includes('ligue1') || comp.includes('coupe de france') || comp.includes('trophee')) {
    primary = filterOutMe(LIGUE1_CLUBS);
    primaryLabel = '🇫🇷 Rivales de Ligue 1';
    secondary = filterOutMe([...BUNDESLIGA_CLUBS, ...PREMIER_LEAGUE_CLUBS, ...SERIE_A_CLUBS, ...LALIGA_CLUBS]);
  }
  // 5. MLS (Major League Soccer) / US Open Cup
  else if (comp.includes('mls') || comp.includes('major league') || comp.includes('us open cup')) {
    primary = filterOutMe(MLS_CLUBS);
    primaryLabel = '🇺🇸 Rivales de MLS';
    secondary = filterOutMe([...SAUDI_CLUBS, ...LALIGA_CLUBS, ...PREMIER_LEAGUE_CLUBS]);
  }
  // 6. Saudi Pro League / King Cup
  else if (comp.includes('saudi') || comp.includes('pro league') || comp.includes('king cup')) {
    primary = filterOutMe(SAUDI_CLUBS);
    primaryLabel = '🇸🇦 Rivales de Saudi Pro League';
    secondary = filterOutMe([...MLS_CLUBS, ...EUROPEAN_GIANTS, ...LALIGA_CLUBS]);
  }
  // 7. LALIGA HYPERMOTION (Segunda División)
  else if (comp.includes('hypermotion') || comp.includes('segunda')) {
    primary = filterOutMe(SEGUNDA_CLUBS);
    primaryLabel = '🥈 Rivales de LALIGA HYPERMOTION';
    secondary = filterOutMe(LALIGA_CLUBS);
    secondaryLabel = '🇪🇸 Clubes de LALIGA EA SPORTS';
  }
  // 8. Copa del Rey
  else if (comp.includes('copa del rey')) {
    primary = filterOutMe(LALIGA_CLUBS);
    primaryLabel = '🇪🇸 LALIGA EA SPORTS';
    secondary = filterOutMe(SEGUNDA_CLUBS);
    secondaryLabel = '🥈 LALIGA HYPERMOTION';
  }
  // 9. Competiciones Europeas (UEFA Champions League, Europa League, Conference, Supercopa de Europa)
  else if (comp.includes('champions') || comp.includes('europa') || comp.includes('conference') || comp.includes('supercopa de europa')) {
    primary = filterOutMe([...BUNDESLIGA_CLUBS, ...LIGUE1_CLUBS, ...EUROPEAN_GIANTS]);
    primaryLabel = '🌍 Grandes de Europa (Champions / Europa)';
    secondary = filterOutMe([...PREMIER_LEAGUE_CLUBS, ...SERIE_A_CLUBS, ...LALIGA_CLUBS]);
    secondaryLabel = '🏆 Clubes de las Grandes Ligas Europeas';
  }
  // 10. LALIGA EA SPORTS / Supercopa de España
  else if (comp.includes('laliga') || comp.includes('supercopa de españa')) {
    primary = filterOutMe(LALIGA_CLUBS);
    primaryLabel = '🇪🇸 Rivales de LALIGA EA SPORTS';
    secondary = filterOutMe([...SEGUNDA_CLUBS, ...BUNDESLIGA_CLUBS, ...LIGUE1_CLUBS, ...PREMIER_LEAGUE_CLUBS, ...SERIE_A_CLUBS]);
    secondaryLabel = '🥈 LALIGA HYPERMOTION y Europa';
  }
  // 11. Context fallback based on user's active league
  else if (uLeague.includes('bundesliga')) {
    primary = filterOutMe(BUNDESLIGA_CLUBS);
    primaryLabel = '🇩🇪 Rivales de Bundesliga';
    secondary = filterOutMe([...PREMIER_LEAGUE_CLUBS, ...LIGUE1_CLUBS, ...SERIE_A_CLUBS, ...LALIGA_CLUBS]);
  }
  else if (uLeague.includes('ligue 1') || uLeague.includes('ligue1')) {
    primary = filterOutMe(LIGUE1_CLUBS);
    primaryLabel = '🇫🇷 Rivales de Ligue 1';
    secondary = filterOutMe([...BUNDESLIGA_CLUBS, ...PREMIER_LEAGUE_CLUBS, ...SERIE_A_CLUBS, ...LALIGA_CLUBS]);
  }
  else if (uLeague.includes('premier')) {
    primary = filterOutMe(PREMIER_LEAGUE_CLUBS);
    primaryLabel = '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Rivales de Premier League';
    secondary = filterOutMe([...BUNDESLIGA_CLUBS, ...LIGUE1_CLUBS, ...SERIE_A_CLUBS, ...LALIGA_CLUBS, ...SEGUNDA_CLUBS]);
  }
  else if (uLeague.includes('serie a')) {
    primary = filterOutMe(SERIE_A_CLUBS);
    primaryLabel = '🇮🇹 Rivales de Serie A';
    secondary = filterOutMe([...BUNDESLIGA_CLUBS, ...LIGUE1_CLUBS, ...PREMIER_LEAGUE_CLUBS, ...LALIGA_CLUBS, ...SEGUNDA_CLUBS]);
  }
  else if (uLeague.includes('mls')) {
    primary = filterOutMe(MLS_CLUBS);
    primaryLabel = '🇺🇸 Rivales de MLS';
    secondary = filterOutMe([...SAUDI_CLUBS, ...LALIGA_CLUBS, ...PREMIER_LEAGUE_CLUBS]);
  }
  else if (uLeague.includes('saudi')) {
    primary = filterOutMe(SAUDI_CLUBS);
    primaryLabel = '🇸🇦 Rivales de Saudi Pro League';
    secondary = filterOutMe([...MLS_CLUBS, ...LALIGA_CLUBS, ...PREMIER_LEAGUE_CLUBS]);
  }
  else if (uLeague.includes('hypermotion') || uLeague.includes('segunda')) {
    primary = filterOutMe(SEGUNDA_CLUBS);
    primaryLabel = '🥈 Rivales de LALIGA HYPERMOTION';
    secondary = filterOutMe(LALIGA_CLUBS);
    secondaryLabel = '🇪🇸 Rivales de Primera / Amistosos';
  }
  else {
    primary = filterOutMe(LALIGA_CLUBS);
    primaryLabel = '🇪🇸 Rivales de LALIGA EA SPORTS';
    secondary = filterOutMe([...BUNDESLIGA_CLUBS, ...LIGUE1_CLUBS, ...PREMIER_LEAGUE_CLUBS, ...SERIE_A_CLUBS, ...SEGUNDA_CLUBS]);
  }

  // Deduplicate secondary clubs that might already be in primary
  const primaryNames = new Set(primary.map(c => c.name.toLowerCase()));
  const filteredSecondary = secondary.filter(c => !primaryNames.has(c.name.toLowerCase()));

  return {
    primaryLabel,
    primaryClubs: primary,
    secondaryLabel,
    secondaryClubs: filteredSecondary,
    allAvailable: [...primary, ...filteredSecondary]
  };
}

