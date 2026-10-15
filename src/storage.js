import { 
  getRealPlayerPhoto,
  ALL_PRESET_CLUBS, 
  LALIGA_CLUBS, 
  SEGUNDA_CLUBS, 
  PREMIER_LEAGUE_CLUBS, 
  SERIE_A_CLUBS, 
  BUNDESLIGA_CLUBS,
  ARGENTINA_CLUBS,
  getClubRoster, 
  getClubLogo 
} from './clubsData';
import { createManagerPost } from './postGenerator';

const STORAGE_KEY = 'ea_fc_career_hub_data_v2';
const ACTIVE_CAREER_KEY = 'ea_fc_active_career_id';
const ACTIVE_SEASON_KEY = 'ea_fc_active_season_id';
const USER_PROFILE_KEY = 'ea_fc_user_profile';

export function buildFreshCareer({
  managerName = 'Nuevo Mánager',
  clubName = 'Real Madrid',
  clubId = 'rma',
  clubLogo,
  league = 'LALIGA EA SPORTS',
  gameVersion = 'EA FC26',
  nationality = '🇪🇸 España',
  budget
} = {}) {
  const period = gameVersion === 'EA FC26' ? '2025/26' : '2026/27';
  const startDate = gameVersion === 'EA FC26' ? '01 jul 2025' : '01 jul 2026';
  
  const clubs = ALL_PRESET_CLUBS || [];
  const presetClub = clubs.find(c => 
    (clubId && c.id === clubId) || 
    c.name.toLowerCase() === clubName.toLowerCase()
  );
  
  const finalLogo = clubLogo || presetClub?.logo || presetClub?.badge || getClubLogo(clubName);
  const finalLeague = league || presetClub?.league || 'LALIGA EA SPORTS';
  const finalBudget = budget || presetClub?.budget || 60000000;

  // Determine league clubs for initial standings
  let leagueClubs = LALIGA_CLUBS;
  const lLower = finalLeague.toLowerCase();
  if (lLower.includes('hypermotion') || lLower.includes('segunda')) {
    leagueClubs = SEGUNDA_CLUBS;
  } else if (lLower.includes('premier')) {
    leagueClubs = PREMIER_LEAGUE_CLUBS;
  } else if (lLower.includes('serie')) {
    leagueClubs = SERIE_A_CLUBS;
  } else if (lLower.includes('argentina') || lLower.includes('libertadores') || lLower.includes('sudamericana')) {
    leagueClubs = ARGENTINA_CLUBS;
  } else if (lLower.includes('bundesliga')) {
    leagueClubs = BUNDESLIGA_CLUBS;
  } else if (lLower.includes('champions') || lLower.includes('ligue') || lLower.includes('europa') || lLower.includes('saudi') || lLower.includes('mls')) {
    leagueClubs = clubs.filter(c => c.league === finalLeague);
    if (!leagueClubs || leagueClubs.length === 0) {
      leagueClubs = BUNDESLIGA_CLUBS;
    }
  }

  const standings = (leagueClubs && leagueClubs.length > 0 ? leagueClubs : LALIGA_CLUBS).map((c, idx) => ({
    pos: idx + 1,
    team: c.name,
    logo: c.logo || c.badge,
    pj: 0,
    v: 0,
    e: 0,
    d: 0,
    gf: 0,
    gc: 0,
    dg: 0,
    pts: 0,
    zone: idx < 4 ? 'champions' : idx === 4 ? 'europa' : idx === 5 ? 'conference' : idx >= 17 ? 'relegation' : 'none',
    isUser: c.name.toLowerCase() === clubName.toLowerCase()
  }));

  if (!standings.some(t => t.isUser)) {
    standings[0] = {
      pos: 1,
      team: clubName,
      logo: finalLogo,
      pj: 0, v: 0, e: 0, d: 0, gf: 0, gc: 0, dg: 0, pts: 0,
      zone: 'champions',
      isUser: true
    };
  }

  const squad = getClubRoster(clubId || clubName) || [];

  const manager = {
    name: managerName,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    nationality,
    age: 38,
    club: clubName,
    clubLogo: finalLogo,
    league: finalLeague,
    startDate,
    currentDate: startDate,
    wage: "50.000 €/sem",
    reputation: "4.5 / 5.0",
    bio: `Inicio del proyecto deportivo con el ${clubName} en ${gameVersion}. Gran ilusión por construir un equipo competitivo y alcanzar todos los objetivos.`
  };

  const welcomePost = createManagerPost(manager, startDate);

  return {
    id: `career-${Date.now()}`,
    gameVersion,
    updatedAt: new Date().toISOString(),
    manager,
    trophies: [],
    seasons: [
      {
        id: `season-1-${Date.now()}`,
        name: "Temporada 1",
        period,
        status: "En curso",
        budget: {
          transfer: Number(finalBudget),
          wageWeekly: Math.round(Number(finalBudget) * 0.012),
          initialTransfer: Number(finalBudget)
        },
        stats: {
          position: "1º",
          points: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          goalsFor: 0,
          goalsAgainst: 0
        },
        transfersIn: [],
        transfersOut: [],
        objectives: [
          {
            id: `obj-init-1`,
            title: "Objetivo de Temporada",
            description: `Liderar al ${clubName} en ${finalLeague} y clasificar para competiciones europeas.`,
            category: "Éxito nacional",
            priority: "Crítica",
            deadline: "Final de temporada",
            completed: false
          },
          {
            id: `obj-init-2`,
            title: "Desarrollo de Cantera",
            description: "Promover al menos a 1 canterano de la academia al primer equipo.",
            category: "Fuerzas básicas",
            priority: "Media",
            deadline: "Final de temporada",
            completed: false
          }
        ],
        rules: [
          {
            id: "rule-init-1",
            text: "Realismo financiero: no gastar más del 80% de lo ingresado en ventas.",
            strict: true
          },
          {
            id: "rule-init-2",
            text: "Sin reintentar partidos: competir con deportividad en todos los resultados.",
            strict: true
          }
        ],
        squad,
        matches: [],
        standings,
        youthAcademy: [],
        trophies: [],
        moments: [
          {
            id: `mom-init-${Date.now()}`,
            title: `Presentación Oficial en ${clubName}`,
            date: startDate,
            type: "Institucional",
            badge: "Nueva Era",
            description: `${managerName} asume oficialmente la dirección técnica del ${clubName}.`,
            mediaUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80"
          }
        ]
      }
    ],
    posts: [welcomePost]
  };
}

function hydrateCareerPhotos(career) {
  if (!career || !career.seasons) return career;
  career.seasons.forEach(season => {
    if (season.squad) {
      season.squad.forEach(p => {
        if (p.photo && p.photo.startsWith('data:image/')) return;
        const real = getRealPlayerPhoto(p.name);
        if (real && !real.includes('default_player')) {
          p.photo = real;
        } else if (!p.photo || p.photo.includes('unsplash') || p.photo.includes('pulse.ea.com') || (p.photo.includes('701154') && !p.name.toLowerCase().includes('mbapp'))) {
          p.photo = real || './default_player.svg';
        }
      });
    }
    if (season.transfersIn) {
      season.transfersIn.forEach(t => {
        if (t.photo && t.photo.startsWith('data:image/')) return;
        const real = getRealPlayerPhoto(t.name);
        if (real && !real.includes('default_player')) {
          t.photo = real;
        } else if (!t.photo || t.photo.includes('unsplash') || t.photo.includes('pulse.ea.com') || (t.photo.includes('701154') && !t.name.toLowerCase().includes('mbapp'))) {
          t.photo = real || './default_player.svg';
        }
      });
    }
    if (season.transfersOut) {
      season.transfersOut.forEach(t => {
        if (t.photo && t.photo.startsWith('data:image/')) return;
        const real = getRealPlayerPhoto(t.name);
        if (real && !real.includes('default_player')) {
          t.photo = real;
        } else if (!t.photo || t.photo.includes('unsplash') || t.photo.includes('pulse.ea.com') || (t.photo.includes('701154') && !t.name.toLowerCase().includes('mbapp'))) {
          t.photo = real || './default_player.svg';
        }
      });
    }
  });

  if (!career.updatedAt) {
    career.updatedAt = new Date().toISOString();
  }
  return career;
}

export function formatCareerDate(dateStr) {
  if (!dateStr) return 'Reciente';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffMins < 2) return 'Justo ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24 && now.getDate() === d.getDate()) {
      return `Hoy a las ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (yesterday.getDate() === d.getDate() && yesterday.getMonth() === d.getMonth()) {
      return `Ayer a las ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch(e) {
    return 'Reciente';
  }
}

export function loadCareers() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(hydrateCareerPhotos);
      }
    }
  } catch (err) {
    console.error("Error loading careers from localStorage:", err);
  }
  return [buildFreshCareer()];
}

export function saveCareers(careers) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(careers));
  } catch (err) {
    console.error("Error saving careers to localStorage:", err);
  }
}

export function getActiveCareerId(careers) {
  const saved = localStorage.getItem(ACTIVE_CAREER_KEY);
  if (saved && careers.some(c => c.id === saved)) {
    return saved;
  }
  return careers[0]?.id || "career-valencia-26";
}

export function setActiveCareerId(id) {
  localStorage.setItem(ACTIVE_CAREER_KEY, id);
}

export function getActiveSeasonId(career) {
  if (!career || !career.seasons || career.seasons.length === 0) return "";
  const saved = localStorage.getItem(`${ACTIVE_SEASON_KEY}_${career.id}`);
  if (saved && career.seasons.some(s => s.id === saved)) {
    return saved;
  }
  return career.seasons[0]?.id || "";
}

export function setActiveSeasonId(careerId, seasonId) {
  localStorage.setItem(`${ACTIVE_SEASON_KEY}_${careerId}`, seasonId);
}

export function exportCareersAsJSON(careers) {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(careers, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `ea_fc_careers_backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function hasSavedCareers() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return Boolean(data && JSON.parse(data)?.length > 0);
  } catch(e) {
    return false;
  }
}

export function getUserProfile() {
  try {
    const data = localStorage.getItem(USER_PROFILE_KEY);
    if (data) return JSON.parse(data);
  } catch(e) {}
  return null;
}

export function saveUserProfile(profile) {
  try {
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
  } catch(e) {}
}

export function resetToDefaults() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(ACTIVE_CAREER_KEY);
  localStorage.removeItem(USER_PROFILE_KEY);
  return [buildFreshCareer()];
}
