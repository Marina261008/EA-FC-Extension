// Centralized Trophy Assets & Metadata for EA Sports FC Career Hub

export function getTrophyImage(competitionName = '') {
  if (!competitionName) return '/trophies/generic_trophy.png';
  const c = competitionName.toLowerCase().trim();

  // 1. UEFA Competitions
  if (c.includes('champions league') || c.includes('orejona') || c.includes('ucl')) {
    return '/trophies/champions_league.jpg';
  }
  if (c.includes('europa league') || c.includes('uel')) {
    return '/trophies/europa_league.jpg';
  }
  if (c.includes('conference') || c.includes('uecl')) {
    return '/trophies/conference_league.jpg';
  }
  if (c.includes('supercopa de europa') || c.includes('super cup') || c.includes('uefa super')) {
    return '/trophies/supercup_europa.png';
  }

  // 2. Spain (LALIGA, Copa del Rey, Supercopa)
  if (c.includes('copa del rey') || c.includes('copa de s.m.') || c.includes('copa rey')) {
    return '/trophies/copa_del_rey.png';
  }
  if (c.includes('supercopa de españa') || c.includes('supercopa españa')) {
    return '/trophies/supercopa_espana.png';
  }
  if (c.includes('laliga') || c.includes('la liga') || c.includes('primera división') || c.includes('hypermotion') || c.includes('segunda')) {
    return '/trophies/laliga.png';
  }

  // 3. England (Premier, FA Cup, Carabao, Community Shield)
  if (c.includes('fa cup')) {
    return '/trophies/fa_cup.jpg';
  }
  if (c.includes('carabao') || c.includes('efl cup') || c.includes('copa de la liga')) {
    return '/trophies/carabao_cup.png';
  }
  if (c.includes('community shield')) {
    return '/trophies/community_shield.png';
  }
  if (c.includes('premier') || c.includes('championship')) {
    return '/trophies/premier_league.png';
  }

  // 4. Germany (Bundesliga, DFB-Pokal, DFL-Supercup)
  if (c.includes('dfb-pokal') || c.includes('dfb pokal') || c.includes('copa de alemania')) {
    return '/trophies/dfb_pokal.png';
  }
  if (c.includes('bundesliga') || c.includes('meisterschale')) {
    return '/trophies/meisterschale.jpg';
  }

  // 5. Italy (Serie A, Coppa Italia, Supercoppa)
  if (c.includes('coppa italia') || c.includes('copa de italia')) {
    return '/trophies/coppa_italia.jpg';
  }
  if (c.includes('serie a') || c.includes('scudetto') || c.includes('coppa campioni')) {
    return '/trophies/serie_a.png';
  }

  // 6. France (Ligue 1, Coupe de France)
  if (c.includes('coupe de france') || c.includes('ligue 1') || c.includes('trophée des champions')) {
    return '/trophies/coupe_de_france.png';
  }

  // 7. South America / CONMEBOL
  if (c.includes('libertadores') || c.includes('conmebol') || c.includes('sudamericana')) {
    return '/trophies/libertadores.png';
  }

  // 8. Worldwide & Middle East
  if (c.includes('mundial de clubes') || c.includes('club world cup') || c.includes('intercontinental')) {
    return '/trophies/club_world_cup.png';
  }
  if (c.includes('saudi') || c.includes('king cup') || c.includes('árabe') || c.includes('arabe') || c.includes('roshn')) {
    return '/trophies/saudi_cup.jpg';
  }

  // Default luxury golden trophy
  return '/trophies/generic_trophy.png';
}

export function getTrophyCelebrationBg(competitionName = '') {
  const c = (competitionName || '').toLowerCase();
  if (c.includes('champions') || c.includes('europa') || c.includes('conference') || c.includes('libertadores') || c.includes('mundial')) {
    return '/trophies/champions_trophy_celebration.jpg';
  }
  return '/trophies/league_trophy_celebration.jpg';
}
