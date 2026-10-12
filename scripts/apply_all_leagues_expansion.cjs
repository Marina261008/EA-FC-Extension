// Master script to apply Bundesliga, Ligue 1, Premier League & Serie A expansions
// Updates both src/data/database.json and public/database.json

const fs = require('fs');
const path = require('path');

const { BUNDESLIGA_NEW_CLUBS, BUNDESLIGA_BENCH_PLAYERS } = require('./data_bundesliga.cjs');
const { LIGUE1_NEW_CLUBS, LIGUE1_BENCH_PLAYERS } = require('./data_ligue1.cjs');
const { PREMIER_BENCH_PLAYERS } = require('./data_premier_benches.cjs');
const { SERIE_A_BENCH_PLAYERS } = require('./data_seriea_benches.cjs');

const dbPath = path.join(__dirname, '../src/data/database.json');
const publicDbPath = path.join(__dirname, '../public/database.json');

const rawData = fs.readFileSync(dbPath, 'utf8');
const db = JSON.parse(rawData);

console.log('--- PRE-EXPANSION STATS ---');
console.log('Existing clubs:', db.clubs.length);
let initialPlayerCount = 0;
db.clubs.forEach(c => initialPlayerCount += (c.roster ? c.roster.length : 0));
console.log('Existing players:', initialPlayerCount);

// Helper to normalize and attach club properties to players
function enrichRosterPlayer(p, club) {
  return {
    id: p.id,
    name: p.name,
    number: p.number || 99,
    team: club.name,
    leagueId: club.leagueId,
    kitPattern: club.kitPattern || "plain",
    pos: p.pos,
    imageUrl: p.imageUrl,
    val: p.val,
    budget: p.val,
    wage: p.wage,
    ovr: p.ovr,
    pac: p.pac,
    sho: p.sho,
    pas: p.pas,
    dri: p.dri,
    def: p.def,
    phy: p.phy,
    age: p.age,
    nat: p.nat
  };
}

// 1. Ingest new Bundesliga clubs
const existingClubIds = new Set(db.clubs.map(c => c.id));
let newBundesligaAdded = 0;

BUNDESLIGA_NEW_CLUBS.forEach(club => {
  if (!existingClubIds.has(club.id)) {
    const formattedRoster = (club.roster || []).map(p => enrichRosterPlayer(p, club));
    db.clubs.push({
      ...club,
      roster: formattedRoster
    });
    existingClubIds.add(club.id);
    newBundesligaAdded++;
  }
});
console.log(`Added ${newBundesligaAdded} new Bundesliga clubs.`);

// 2. Ingest new Ligue 1 clubs
let newLigue1Added = 0;
LIGUE1_NEW_CLUBS.forEach(club => {
  if (!existingClubIds.has(club.id)) {
    const formattedRoster = (club.roster || []).map(p => enrichRosterPlayer(p, club));
    db.clubs.push({
      ...club,
      roster: formattedRoster
    });
    existingClubIds.add(club.id);
    newLigue1Added++;
  }
});
console.log(`Added ${newLigue1Added} new Ligue 1 clubs.`);

// Helper to append bench players to existing club rosters
function addBenchPlayersToClub(clubId, benchList) {
  const club = db.clubs.find(c => c.id === clubId);
  if (!club) {
    console.warn(`Club ${clubId} not found in database!`);
    return 0;
  }
  if (!club.roster) club.roster = [];
  const existingPlayerNames = new Set(club.roster.map(p => p.name.toLowerCase()));
  let added = 0;

  benchList.forEach(p => {
    if (!existingPlayerNames.has(p.name.toLowerCase())) {
      club.roster.push(enrichRosterPlayer(p, club));
      existingPlayerNames.add(p.name.toLowerCase());
      added++;
    }
  });
  return added;
}

// 3. Add Bundesliga benches (Bayern, Dortmund, Leverkusen)
let bundesligaBenchesAdded = 0;
Object.entries(BUNDESLIGA_BENCH_PLAYERS).forEach(([clubId, benchList]) => {
  bundesligaBenchesAdded += addBenchPlayersToClub(clubId, benchList);
});
console.log(`Added ${bundesligaBenchesAdded} bench players to existing Bundesliga giants.`);

// 4. Add Ligue 1 benches (PSG)
let ligue1BenchesAdded = 0;
Object.entries(LIGUE1_BENCH_PLAYERS).forEach(([clubId, benchList]) => {
  ligue1BenchesAdded += addBenchPlayersToClub(clubId, benchList);
});
console.log(`Added ${ligue1BenchesAdded} bench players to PSG.`);

// 5. Add Premier League benches (all 20 clubs)
let plBenchesAdded = 0;
Object.entries(PREMIER_BENCH_PLAYERS).forEach(([clubId, benchList]) => {
  plBenchesAdded += addBenchPlayersToClub(clubId, benchList);
});
console.log(`Added ${plBenchesAdded} bench players to Premier League clubs.`);

// 6. Add Serie A benches (all 20 clubs)
let saBenchesAdded = 0;
Object.entries(SERIE_A_BENCH_PLAYERS).forEach(([clubId, benchList]) => {
  saBenchesAdded += addBenchPlayersToClub(clubId, benchList);
});
console.log(`Added ${saBenchesAdded} bench players to Serie A clubs.`);

// Ensure ligue1 is present in db.leagues
if (Array.isArray(db.leagues)) {
  const hasLigue1 = db.leagues.some(l => l.id === 'ligue1');
  if (!hasLigue1) {
    db.leagues.push({
      id: "ligue1",
      name: "Ligue 1 26/27",
      country: "Francia",
      icon: "🇫🇷"
    });
  }
  const hasBundesliga = db.leagues.some(l => l.id === 'bundesliga');
  if (!hasBundesliga) {
    db.leagues.push({
      id: "bundesliga",
      name: "Bundesliga 26/27",
      country: "Alemania",
      icon: "🇩🇪"
    });
  }
}

// Stats verification
console.log('\n--- POST-EXPANSION STATS ---');
console.log('Total clubs in DB:', db.clubs.length);
let finalPlayerCount = 0;
db.clubs.forEach(c => finalPlayerCount += (c.roster ? c.roster.length : 0));
console.log('Total players in DB:', finalPlayerCount);

const leagueCounts = {};
db.clubs.forEach(c => {
  leagueCounts[c.leagueId] = (leagueCounts[c.leagueId] || 0) + 1;
});
console.log('Clubs by league:', leagueCounts);

// Write to src/data/database.json and public/database.json
const updatedJson = JSON.stringify(db, null, 2);
fs.writeFileSync(dbPath, updatedJson, 'utf8');
console.log(`Successfully written to ${dbPath}`);

fs.writeFileSync(publicDbPath, updatedJson, 'utf8');
console.log(`Successfully written to ${publicDbPath}`);
