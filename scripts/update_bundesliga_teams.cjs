const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, '../src/data/database.json');
const publicDbPath = path.resolve(__dirname, '../public/database.json');
const photoMapPath = path.resolve(__dirname, '../src/data/playerPhotoMap.json');

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
let photoMap = {};
try {
  photoMap = JSON.parse(fs.readFileSync(photoMapPath, 'utf8'));
} catch (e) {
  photoMap = {};
}

// 1. Move the 5 clubs not in the user's 18 to 'other'
const movedClubIds = ['wob', 'fch', 'stp', 'ksv', 'boc'];
db.clubs.forEach(c => {
  if (movedClubIds.includes(c.id)) {
    c.leagueId = 'other';
    c.roster = (c.roster || []).map(p => ({ ...p, leagueId: 'other' }));
  }
});

// 2. Adjust shortNames / Spanish localized names if needed
const updates = {
  fca: { name: 'FC Augsburgo', shortName: 'Augsburgo' },
  scf: { name: 'SC Freiburg', shortName: 'Friburgo' }
};

db.clubs.forEach(c => {
  if (updates[c.id]) {
    c.name = updates[c.id].name;
    c.shortName = updates[c.id].shortName;
    c.roster = (c.roster || []).map(p => ({ ...p, team: c.name }));
  }
});

// 3. Define the 5 new clubs
const NEW_CLUBS = [
  {
    id: 'koln',
    name: '1. FC Köln',
    shortName: 'Köln',
    leagueId: 'bundesliga',
    city: 'Colonia',
    stadium: 'RheinEnergieStadion',
    capacity: 50000,
    budget: 45000000,
    wageBudget: 450000,
    primaryColor: '#e30613',
    secondaryColor: '#ffffff',
    accentColor: '#000000',
    textColor: '#ffffff',
    kitPattern: 'plain',
    championsQualified: false,
    badge: 'https://images.fotmob.com/image_resources/logo/teamlogo/8722.png',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/8722.png',
    roster: [
      { id: 'kol_schwabe', name: 'Marvin Schwäbe', number: 1, team: '1. FC Köln', leagueId: 'bundesliga', kitPattern: 'plain', pos: 'GK', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/573465.png', val: 7, budget: 7, wage: 30, ovr: 76, pac: 75, sho: 78, pas: 73, dri: 76, def: 42, phy: 76, age: 30, nat: 'Alemania', photo: 'https://images.fotmob.com/image_resources/playerimages/573465.png' },
      { id: 'kol_hubers', name: 'Timo Hübers', number: 4, team: '1. FC Köln', leagueId: 'bundesliga', kitPattern: 'plain', pos: 'CB', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/682385.png', val: 10, budget: 10, wage: 35, ovr: 77, pac: 72, sho: 40, pas: 68, dri: 64, def: 78, phy: 82, age: 29, nat: 'Alemania', photo: 'https://images.fotmob.com/image_resources/playerimages/682385.png' },
      { id: 'kol_pauli', name: 'Julian Pauli', number: 24, team: '1. FC Köln', leagueId: 'bundesliga', kitPattern: 'plain', pos: 'CB', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/1571179.png', val: 6, budget: 6, wage: 20, ovr: 73, pac: 74, sho: 35, pas: 62, dri: 60, def: 74, phy: 78, age: 20, nat: 'Alemania', photo: 'https://images.fotmob.com/image_resources/playerimages/1571179.png' },
      { id: 'kol_paqarada', name: 'Leart Paqarada', number: 17, team: '1. FC Köln', leagueId: 'bundesliga', kitPattern: 'plain', pos: 'LB', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/554979.png', val: 7, budget: 7, wage: 28, ovr: 75, pac: 76, sho: 64, pas: 77, dri: 75, def: 73, phy: 74, age: 30, nat: 'Kosovo', photo: 'https://images.fotmob.com/image_resources/playerimages/554979.png' },
      { id: 'kol_thielmann', name: 'Jan Thielmann', number: 7, team: '1. FC Köln', leagueId: 'bundesliga', kitPattern: 'plain', pos: 'RB', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/1119643.png', val: 10, budget: 10, wage: 32, ovr: 76, pac: 85, sho: 70, pas: 73, dri: 78, def: 72, phy: 76, age: 23, nat: 'Alemania', photo: 'https://images.fotmob.com/image_resources/playerimages/1119643.png' },
      { id: 'kol_martel', name: 'Eric Martel', number: 6, team: '1. FC Köln', leagueId: 'bundesliga', kitPattern: 'plain', pos: 'CDM', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/1199283.png', val: 12, budget: 12, wage: 35, ovr: 77, pac: 73, sho: 60, pas: 75, dri: 74, def: 78, phy: 82, age: 23, nat: 'Alemania', photo: 'https://images.fotmob.com/image_resources/playerimages/1199283.png' },
      { id: 'kol_husein', name: 'Denis Huseinbasic', number: 8, team: '1. FC Köln', leagueId: 'bundesliga', kitPattern: 'plain', pos: 'CM', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/1235068.png', val: 9, budget: 9, wage: 30, ovr: 76, pac: 75, sho: 72, pas: 77, dri: 77, def: 70, phy: 74, age: 24, nat: 'Bosnia', photo: 'https://images.fotmob.com/image_resources/playerimages/1235068.png' },
      { id: 'kol_ljubicic', name: 'Dejan Ljubicic', number: 7, team: '1. FC Köln', leagueId: 'bundesliga', kitPattern: 'plain', pos: 'CM', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/861668.png', val: 11, budget: 11, wage: 38, ovr: 77, pac: 76, sho: 74, pas: 78, dri: 78, def: 74, phy: 77, age: 27, nat: 'Austria', photo: 'https://images.fotmob.com/image_resources/playerimages/861668.png' },
      { id: 'kol_maina', name: 'Linton Maina', number: 37, team: '1. FC Köln', leagueId: 'bundesliga', kitPattern: 'plain', pos: 'LW', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/930035.png', val: 9, budget: 9, wage: 32, ovr: 76, pac: 88, sho: 72, pas: 74, dri: 79, def: 45, phy: 68, age: 26, nat: 'Alemania', photo: 'https://images.fotmob.com/image_resources/playerimages/930035.png' },
      { id: 'kol_waldschmidt', name: 'Luca Waldschmidt', number: 9, team: '1. FC Köln', leagueId: 'bundesliga', kitPattern: 'plain', pos: 'CAM', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/540073.png', val: 10, budget: 10, wage: 35, ovr: 76, pac: 75, sho: 78, pas: 77, dri: 79, def: 45, phy: 70, age: 29, nat: 'Alemania', photo: 'https://images.fotmob.com/image_resources/playerimages/540073.png' },
      { id: 'kol_lemperle', name: 'Tim Lemperle', number: 19, team: '1. FC Köln', leagueId: 'bundesliga', kitPattern: 'plain', pos: 'ST', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/1124825.png', val: 8, budget: 8, wage: 28, ovr: 75, pac: 82, sho: 76, pas: 68, dri: 76, def: 38, phy: 75, age: 23, nat: 'Alemania', photo: 'https://images.fotmob.com/image_resources/playerimages/1124825.png' },
      { id: 'kol_downs', name: 'Damion Downs', number: 21, team: '1. FC Köln', leagueId: 'bundesliga', kitPattern: 'plain', pos: 'ST', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/1363536.png', val: 7, budget: 7, wage: 24, ovr: 74, pac: 80, sho: 75, pas: 65, dri: 74, def: 35, phy: 78, age: 21, nat: 'Estados Unidos', photo: 'https://images.fotmob.com/image_resources/playerimages/1363536.png' },
      { id: 'kol_kainz', name: 'Florian Kainz', number: 11, team: '1. FC Köln', leagueId: 'bundesliga', kitPattern: 'plain', pos: 'CAM', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/187358.png', val: 7, budget: 7, wage: 35, ovr: 76, pac: 73, sho: 75, pas: 80, dri: 78, def: 52, phy: 68, age: 32, nat: 'Austria', photo: 'https://images.fotmob.com/image_resources/playerimages/187358.png' }
    ]
  },
  {
    id: 'hsv',
    name: 'Hamburger SV',
    shortName: 'Hamburgo',
    leagueId: 'bundesliga',
    city: 'Hamburgo',
    stadium: 'Volksparkstadion',
    capacity: 57000,
    budget: 52000000,
    wageBudget: 500000,
    primaryColor: '#005ca9',
    secondaryColor: '#ffffff',
    accentColor: '#000000',
    textColor: '#ffffff',
    kitPattern: 'plain',
    championsQualified: false,
    badge: 'https://images.fotmob.com/image_resources/logo/teamlogo/9790.png',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/9790.png',
    roster: [
      { id: 'hsv_fernandes', name: 'Daniel Heuer Fernandes', number: 1, team: 'Hamburger SV', leagueId: 'bundesliga', kitPattern: 'plain', pos: 'GK', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/406501.png', val: 7, budget: 7, wage: 30, ovr: 76, pac: 75, sho: 77, pas: 74, dri: 76, def: 42, phy: 75, age: 32, nat: 'Portugal', photo: 'https://images.fotmob.com/image_resources/playerimages/406501.png' },
      { id: 'hsv_schonlau', name: 'Sebastian Schonlau', number: 4, team: 'Hamburger SV', leagueId: 'bundesliga', kitPattern: 'plain', pos: 'CB', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/445204.png', val: 8, budget: 8, wage: 32, ovr: 76, pac: 70, sho: 40, pas: 68, dri: 64, def: 77, phy: 80, age: 31, nat: 'Alemania', photo: 'https://images.fotmob.com/image_resources/playerimages/445204.png' },
      { id: 'hsv_hadzi', name: 'Dennis Hadzikadunic', number: 5, team: 'Hamburger SV', leagueId: 'bundesliga', kitPattern: 'plain', pos: 'CB', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/797797.png', val: 8, budget: 8, wage: 28, ovr: 75, pac: 72, sho: 35, pas: 65, dri: 62, def: 76, phy: 81, age: 27, nat: 'Bosnia', photo: 'https://images.fotmob.com/image_resources/playerimages/797797.png' },
      { id: 'hsv_muheim', name: 'Miro Muheim', number: 28, team: 'Hamburger SV', leagueId: 'bundesliga', kitPattern: 'plain', pos: 'LB', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/759817.png', val: 10, budget: 10, wage: 32, ovr: 76, pac: 80, sho: 68, pas: 78, dri: 76, def: 73, phy: 76, age: 27, nat: 'Suiza', photo: 'https://images.fotmob.com/image_resources/playerimages/759817.png' },
      { id: 'hsv_hefti', name: 'Silvan Hefti', number: 2, team: 'Hamburger SV', leagueId: 'bundesliga', kitPattern: 'plain', pos: 'RB', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/678384.png', val: 8, budget: 8, wage: 30, ovr: 75, pac: 80, sho: 58, pas: 72, dri: 74, def: 74, phy: 76, age: 27, nat: 'Suiza', photo: 'https://images.fotmob.com/image_resources/playerimages/678384.png' },
      { id: 'hsv_meffert', name: 'Jonas Meffert', number: 23, team: 'Hamburger SV', leagueId: 'bundesliga', kitPattern: 'plain', pos: 'CDM', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/409818.png', val: 8, budget: 8, wage: 32, ovr: 76, pac: 70, sho: 62, pas: 78, dri: 75, def: 77, phy: 78, age: 30, nat: 'Alemania', photo: 'https://images.fotmob.com/image_resources/playerimages/409818.png' },
      { id: 'hsv_reis', name: 'Ludovit Reis', number: 14, team: 'Hamburger SV', leagueId: 'bundesliga', kitPattern: 'plain', pos: 'CM', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/869326.png', val: 14, budget: 14, wage: 38, ovr: 77, pac: 78, sho: 74, pas: 80, dri: 81, def: 72, phy: 76, age: 25, nat: 'Países Bajos', photo: 'https://images.fotmob.com/image_resources/playerimages/869326.png' },
      { id: 'hsv_dompe', name: 'Jean-Luc Dompé', number: 27, team: 'Hamburger SV', leagueId: 'bundesliga', kitPattern: 'plain', pos: 'LW', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/613260.png', val: 10, budget: 10, wage: 35, ovr: 76, pac: 88, sho: 74, pas: 76, dri: 84, def: 38, phy: 66, age: 29, nat: 'Francia', photo: 'https://images.fotmob.com/image_resources/playerimages/613260.png' },
      { id: 'hsv_jatta', name: 'Bakery Jatta', number: 18, team: 'Hamburger SV', leagueId: 'bundesliga', kitPattern: 'plain', pos: 'RW', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/763998.png', val: 8, budget: 8, wage: 30, ovr: 75, pac: 89, sho: 72, pas: 70, dri: 77, def: 52, phy: 78, age: 27, nat: 'Gambia', photo: 'https://images.fotmob.com/image_resources/playerimages/763998.png' },
      { id: 'hsv_glatzel', name: 'Robert Glatzel', number: 9, team: 'Hamburger SV', leagueId: 'bundesliga', kitPattern: 'plain', pos: 'ST', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/490489.png', val: 14, budget: 14, wage: 45, ovr: 78, pac: 78, sho: 81, pas: 70, dri: 76, def: 40, phy: 84, age: 31, nat: 'Alemania', photo: 'https://images.fotmob.com/image_resources/playerimages/490489.png' },
      { id: 'hsv_selke', name: 'Davie Selke', number: 27, team: 'Hamburger SV', leagueId: 'bundesliga', kitPattern: 'plain', pos: 'ST', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/501568.png', val: 9, budget: 9, wage: 35, ovr: 76, pac: 76, sho: 78, pas: 66, dri: 73, def: 42, phy: 84, age: 30, nat: 'Alemania', photo: 'https://images.fotmob.com/image_resources/playerimages/501568.png' },
      { id: 'hsv_konig', name: 'Ransford Königsdörffer', number: 11, team: 'Hamburger SV', leagueId: 'bundesliga', kitPattern: 'plain', pos: 'ST', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/1121170.png', val: 8, budget: 8, wage: 28, ovr: 75, pac: 85, sho: 75, pas: 68, dri: 78, def: 38, phy: 74, age: 23, nat: 'Ghana', photo: 'https://images.fotmob.com/image_resources/playerimages/1121170.png' }
    ]
  },
  {
    id: 'schalke',
    name: 'FC Schalke 04',
    shortName: 'Schalke 04',
    leagueId: 'bundesliga',
    city: 'Gelsenkirchen',
    stadium: 'Veltins-Arena',
    capacity: 62271,
    budget: 48000000,
    wageBudget: 480000,
    primaryColor: '#004b9b',
    secondaryColor: '#ffffff',
    accentColor: '#000000',
    textColor: '#ffffff',
    kitPattern: 'plain',
    championsQualified: false,
    badge: 'https://images.fotmob.com/image_resources/logo/teamlogo/10189.png',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/10189.png',
    roster: [
      { id: 's04_heekeren', name: 'Justin Heekeren', number: 1, team: 'FC Schalke 04', leagueId: 'bundesliga', kitPattern: 'plain', pos: 'GK', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/1310438.png', val: 6, budget: 6, wage: 22, ovr: 74, pac: 73, sho: 75, pas: 70, dri: 73, def: 40, phy: 74, age: 24, nat: 'Alemania', photo: 'https://images.fotmob.com/image_resources/playerimages/1310438.png' },
      { id: 's04_kalas', name: 'Tomas Kalas', number: 26, team: 'FC Schalke 04', leagueId: 'bundesliga', kitPattern: 'plain', pos: 'CB', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/201934.png', val: 7, budget: 7, wage: 30, ovr: 75, pac: 70, sho: 38, pas: 66, dri: 62, def: 76, phy: 80, age: 32, nat: 'República Checa', photo: 'https://images.fotmob.com/image_resources/playerimages/201934.png' },
      { id: 's04_kaminski', name: 'Marcin Kaminski', number: 35, team: 'FC Schalke 04', leagueId: 'bundesliga', kitPattern: 'plain', pos: 'CB', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/189190.png', val: 6, budget: 6, wage: 28, ovr: 74, pac: 66, sho: 40, pas: 68, dri: 60, def: 75, phy: 80, age: 33, nat: 'Polonia', photo: 'https://images.fotmob.com/image_resources/playerimages/189190.png' },
      { id: 's04_murkin', name: 'Derry Murkin', number: 2, team: 'FC Schalke 04', leagueId: 'bundesliga', kitPattern: 'plain', pos: 'LB', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/956736.png', val: 8, budget: 8, wage: 28, ovr: 75, pac: 83, sho: 65, pas: 72, dri: 75, def: 73, phy: 76, age: 26, nat: 'Inglaterra', photo: 'https://images.fotmob.com/image_resources/playerimages/956736.png' },
      { id: 's04_aydin', name: 'Mehmet Aydin', number: 23, team: 'FC Schalke 04', leagueId: 'bundesliga', kitPattern: 'plain', pos: 'RB', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/1237634.png', val: 7, budget: 7, wage: 25, ovr: 74, pac: 84, sho: 58, pas: 68, dri: 74, def: 72, phy: 74, age: 23, nat: 'Turquía', photo: 'https://images.fotmob.com/image_resources/playerimages/1237634.png' },
      { id: 's04_schallen', name: 'Ron Schallenberg', number: 6, team: 'FC Schalke 04', leagueId: 'bundesliga', kitPattern: 'plain', pos: 'CDM', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/820974.png', val: 9, budget: 9, wage: 32, ovr: 76, pac: 72, sho: 65, pas: 76, dri: 74, def: 77, phy: 80, age: 26, nat: 'Alemania', photo: 'https://images.fotmob.com/image_resources/playerimages/820974.png' },
      { id: 's04_seguin', name: 'Paul Seguin', number: 7, team: 'FC Schalke 04', leagueId: 'bundesliga', kitPattern: 'plain', pos: 'CM', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/520342.png', val: 9, budget: 9, wage: 32, ovr: 76, pac: 73, sho: 70, pas: 78, dri: 76, def: 73, phy: 76, age: 30, nat: 'Alemania', photo: 'https://images.fotmob.com/image_resources/playerimages/520342.png' },
      { id: 's04_mohr', name: 'Tobias Mohr', number: 29, team: 'FC Schalke 04', leagueId: 'bundesliga', kitPattern: 'plain', pos: 'LM', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/725835.png', val: 6, budget: 6, wage: 25, ovr: 74, pac: 80, sho: 70, pas: 75, dri: 74, def: 64, phy: 72, age: 30, nat: 'Alemania', photo: 'https://images.fotmob.com/image_resources/playerimages/725835.png' },
      { id: 's04_karaman', name: 'Kenan Karaman', number: 19, team: 'FC Schalke 04', leagueId: 'bundesliga', kitPattern: 'plain', pos: 'CAM', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/469763.png', val: 14, budget: 14, wage: 42, ovr: 78, pac: 78, sho: 80, pas: 78, dri: 81, def: 52, phy: 79, age: 31, nat: 'Turquía', photo: 'https://images.fotmob.com/image_resources/playerimages/469763.png' },
      { id: 's04_sylla', name: 'Moussa Sylla', number: 9, team: 'FC Schalke 04', leagueId: 'bundesliga', kitPattern: 'plain', pos: 'ST', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/860056.png', val: 12, budget: 12, wage: 36, ovr: 77, pac: 86, sho: 79, pas: 68, dri: 80, def: 38, phy: 76, age: 25, nat: 'Malí', photo: 'https://images.fotmob.com/image_resources/playerimages/860056.png' },
      { id: 's04_younes', name: 'Amin Younes', number: 8, team: 'FC Schalke 04', leagueId: 'bundesliga', kitPattern: 'plain', pos: 'LW', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/309505.png', val: 7, budget: 7, wage: 30, ovr: 75, pac: 80, sho: 73, pas: 77, dri: 84, def: 35, phy: 62, age: 32, nat: 'Alemania', photo: 'https://images.fotmob.com/image_resources/playerimages/309505.png' },
      { id: 's04_lasme', name: 'Bryan Lasme', number: 11, team: 'FC Schalke 04', leagueId: 'bundesliga', kitPattern: 'plain', pos: 'RW', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/815566.png', val: 6, budget: 6, wage: 25, ovr: 74, pac: 87, sho: 72, pas: 64, dri: 76, def: 38, phy: 78, age: 26, nat: 'Francia', photo: 'https://images.fotmob.com/image_resources/playerimages/815566.png' }
    ]
  },
  {
    id: 'paderborn',
    name: 'SC Paderborn 07',
    shortName: 'Paderborn',
    leagueId: 'bundesliga',
    city: 'Paderborn',
    stadium: 'Home Deluxe Arena',
    capacity: 15000,
    budget: 28000000,
    wageBudget: 300000,
    primaryColor: '#004b9b',
    secondaryColor: '#000000',
    accentColor: '#ffffff',
    textColor: '#ffffff',
    kitPattern: 'stripes',
    championsQualified: false,
    badge: 'https://images.fotmob.com/image_resources/logo/teamlogo/8460.png',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/8460.png',
    roster: [
      { id: 'pad_boevink', name: 'Pelle Boevink', number: 1, team: 'SC Paderborn 07', leagueId: 'bundesliga', kitPattern: 'stripes', pos: 'GK', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/831035.png', val: 5, budget: 5, wage: 20, ovr: 73, pac: 72, sho: 74, pas: 68, dri: 72, def: 40, phy: 74, age: 27, nat: 'Países Bajos', photo: 'https://images.fotmob.com/image_resources/playerimages/831035.png' },
      { id: 'pad_gotze', name: 'Felix Götze', number: 20, team: 'SC Paderborn 07', leagueId: 'bundesliga', kitPattern: 'stripes', pos: 'CB', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/767790.png', val: 7, budget: 7, wage: 24, ovr: 74, pac: 72, sho: 50, pas: 70, dri: 68, def: 75, phy: 78, age: 27, nat: 'Alemania', photo: 'https://images.fotmob.com/image_resources/playerimages/767790.png' },
      { id: 'pad_musliu', name: 'Visar Musliu', number: 4, team: 'SC Paderborn 07', leagueId: 'bundesliga', kitPattern: 'stripes', pos: 'CB', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/308469.png', val: 6, budget: 6, wage: 22, ovr: 74, pac: 68, sho: 36, pas: 62, dri: 58, def: 75, phy: 80, age: 30, nat: 'Macedonia del Norte', photo: 'https://images.fotmob.com/image_resources/playerimages/308469.png' },
      { id: 'pad_hoffmeier', name: 'Marcel Hoffmeier', number: 33, team: 'SC Paderborn 07', leagueId: 'bundesliga', kitPattern: 'stripes', pos: 'CB', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/970587.png', val: 5, budget: 5, wage: 20, ovr: 73, pac: 70, sho: 35, pas: 64, dri: 62, def: 74, phy: 78, age: 26, nat: 'Alemania', photo: 'https://images.fotmob.com/image_resources/playerimages/970587.png' },
      { id: 'pad_zehnter', name: 'Aaron Zehnter', number: 17, team: 'SC Paderborn 07', leagueId: 'bundesliga', kitPattern: 'stripes', pos: 'LB', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/1279034.png', val: 7, budget: 7, wage: 22, ovr: 74, pac: 82, sho: 62, pas: 74, dri: 75, def: 72, phy: 72, age: 20, nat: 'Alemania', photo: 'https://images.fotmob.com/image_resources/playerimages/1279034.png' },
      { id: 'pad_obermair', name: 'Raphael Obermair', number: 23, team: 'SC Paderborn 07', leagueId: 'bundesliga', kitPattern: 'stripes', pos: 'RB', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/784225.png', val: 6, budget: 6, wage: 24, ovr: 74, pac: 83, sho: 66, pas: 72, dri: 75, def: 72, phy: 74, age: 29, nat: 'Filipinas', photo: 'https://images.fotmob.com/image_resources/playerimages/784225.png' },
      { id: 'pad_castaneda', name: 'Santiago Castaneda', number: 8, team: 'SC Paderborn 07', leagueId: 'bundesliga', kitPattern: 'stripes', pos: 'CDM', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/1362492.png', val: 6, budget: 6, wage: 20, ovr: 73, pac: 73, sho: 58, pas: 72, dri: 72, def: 74, phy: 76, age: 20, nat: 'Estados Unidos', photo: 'https://images.fotmob.com/image_resources/playerimages/1362492.png' },
      { id: 'pad_klaas', name: 'Sebastian Klaas', number: 26, team: 'SC Paderborn 07', leagueId: 'bundesliga', kitPattern: 'stripes', pos: 'CM', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/840947.png', val: 5, budget: 5, wage: 20, ovr: 73, pac: 72, sho: 68, pas: 75, dri: 74, def: 68, phy: 72, age: 27, nat: 'Alemania', photo: 'https://images.fotmob.com/image_resources/playerimages/840947.png' },
      { id: 'pad_bilbija', name: 'Filip Bilbija', number: 7, team: 'SC Paderborn 07', leagueId: 'bundesliga', kitPattern: 'stripes', pos: 'CAM', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/1073007.png', val: 8, budget: 8, wage: 25, ovr: 75, pac: 80, sho: 74, pas: 76, dri: 78, def: 50, phy: 72, age: 25, nat: 'Alemania', photo: 'https://images.fotmob.com/image_resources/playerimages/1073007.png' },
      { id: 'pad_michel', name: 'Sven Michel', number: 10, team: 'SC Paderborn 07', leagueId: 'bundesliga', kitPattern: 'stripes', pos: 'ST', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/419774.png', val: 6, budget: 6, wage: 28, ovr: 75, pac: 76, sho: 77, pas: 72, dri: 75, def: 44, phy: 76, age: 35, nat: 'Alemania', photo: 'https://images.fotmob.com/image_resources/playerimages/419774.png' },
      { id: 'pad_grimaldi', name: 'Adriano Grimaldi', number: 39, team: 'SC Paderborn 07', leagueId: 'bundesliga', kitPattern: 'stripes', pos: 'ST', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/184556.png', val: 4, budget: 4, wage: 22, ovr: 73, pac: 66, sho: 74, pas: 60, dri: 68, def: 40, phy: 86, age: 34, nat: 'Alemania', photo: 'https://images.fotmob.com/image_resources/playerimages/184556.png' },
      { id: 'pad_ansah', name: 'Ilyas Ansah', number: 29, team: 'SC Paderborn 07', leagueId: 'bundesliga', kitPattern: 'stripes', pos: 'ST', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/1515977.png', val: 6, budget: 6, wage: 18, ovr: 73, pac: 84, sho: 73, pas: 64, dri: 75, def: 35, phy: 74, age: 20, nat: 'Alemania', photo: 'https://images.fotmob.com/image_resources/playerimages/1515977.png' }
    ]
  },
  {
    id: 'elversberg',
    name: 'SV Elversberg',
    shortName: 'Elversberg',
    leagueId: 'bundesliga',
    city: 'Spiesen-Elversberg',
    stadium: 'Ursapharm-Arena an der Kaiserlinde',
    capacity: 10000,
    budget: 25000000,
    wageBudget: 270000,
    primaryColor: '#ffffff',
    secondaryColor: '#000000',
    accentColor: '#000000',
    textColor: '#000000',
    kitPattern: 'plain',
    championsQualified: false,
    badge: 'https://images.fotmob.com/image_resources/logo/teamlogo/8232.png',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/8232.png',
    roster: [
      { id: 'elv_kristof', name: 'Nicolas Kristof', number: 20, team: 'SV Elversberg', leagueId: 'bundesliga', kitPattern: 'plain', pos: 'GK', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/1285926.png', val: 6, budget: 6, wage: 20, ovr: 74, pac: 73, sho: 75, pas: 70, dri: 74, def: 40, phy: 74, age: 25, nat: 'Austria', photo: 'https://images.fotmob.com/image_resources/playerimages/1285926.png' },
      { id: 'elv_pinckert', name: 'Lukas Pinckert', number: 19, team: 'SV Elversberg', leagueId: 'bundesliga', kitPattern: 'plain', pos: 'CB', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/1280560.png', val: 5, budget: 5, wage: 20, ovr: 73, pac: 72, sho: 35, pas: 62, dri: 60, def: 74, phy: 78, age: 25, nat: 'Alemania', photo: 'https://images.fotmob.com/image_resources/playerimages/1280560.png' },
      { id: 'elv_rohr', name: 'Maximilian Rohr', number: 6, team: 'SV Elversberg', leagueId: 'bundesliga', kitPattern: 'plain', pos: 'CB', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/1077911.png', val: 5, budget: 5, wage: 22, ovr: 73, pac: 68, sho: 40, pas: 65, dri: 62, def: 74, phy: 80, age: 30, nat: 'Alemania', photo: 'https://images.fotmob.com/image_resources/playerimages/1077911.png' },
      { id: 'elv_neubauer', name: 'Maurice Neubauer', number: 18, team: 'SV Elversberg', leagueId: 'bundesliga', kitPattern: 'plain', pos: 'LB', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/673045.png', val: 6, budget: 6, wage: 22, ovr: 74, pac: 79, sho: 60, pas: 73, dri: 74, def: 72, phy: 73, age: 29, nat: 'Alemania', photo: 'https://images.fotmob.com/image_resources/playerimages/673045.png' },
      { id: 'elv_fellhauer', name: 'Robin Fellhauer', number: 14, team: 'SV Elversberg', leagueId: 'bundesliga', kitPattern: 'plain', pos: 'RB', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/1185609.png', val: 6, budget: 6, wage: 24, ovr: 74, pac: 80, sho: 58, pas: 72, dri: 74, def: 73, phy: 75, age: 27, nat: 'Alemania', photo: 'https://images.fotmob.com/image_resources/playerimages/1185609.png' },
      { id: 'elv_sickinger', name: 'Carlo Sickinger', number: 4, team: 'SV Elversberg', leagueId: 'bundesliga', kitPattern: 'plain', pos: 'CDM', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/909433.png', val: 6, budget: 6, wage: 22, ovr: 74, pac: 70, sho: 60, pas: 74, dri: 72, def: 75, phy: 77, age: 28, nat: 'Alemania', photo: 'https://images.fotmob.com/image_resources/playerimages/909433.png' },
      { id: 'elv_sahin', name: 'Semih Sahin', number: 8, team: 'SV Elversberg', leagueId: 'bundesliga', kitPattern: 'plain', pos: 'CM', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/1083342.png', val: 7, budget: 7, wage: 22, ovr: 74, pac: 75, sho: 68, pas: 77, dri: 76, def: 70, phy: 72, age: 25, nat: 'Alemania', photo: 'https://images.fotmob.com/image_resources/playerimages/1083342.png' },
      { id: 'elv_damar', name: 'Muhammed Damar', number: 10, team: 'SV Elversberg', leagueId: 'bundesliga', kitPattern: 'plain', pos: 'CAM', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/1393387.png', val: 9, budget: 9, wage: 25, ovr: 75, pac: 78, sho: 74, pas: 78, dri: 79, def: 48, phy: 70, age: 21, nat: 'Alemania', photo: 'https://images.fotmob.com/image_resources/playerimages/1393387.png' },
      { id: 'elv_petkov', name: 'Lukas Petkov', number: 7, team: 'SV Elversberg', leagueId: 'bundesliga', kitPattern: 'plain', pos: 'RW', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/1093782.png', val: 7, budget: 7, wage: 22, ovr: 74, pac: 84, sho: 72, pas: 71, dri: 77, def: 44, phy: 72, age: 24, nat: 'Bulgaria', photo: 'https://images.fotmob.com/image_resources/playerimages/1093782.png' },
      { id: 'elv_asllani', name: 'Fisnik Asllani', number: 29, team: 'SV Elversberg', leagueId: 'bundesliga', kitPattern: 'plain', pos: 'ST', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/1219540.png', val: 10, budget: 10, wage: 30, ovr: 76, pac: 82, sho: 78, pas: 70, dri: 77, def: 38, phy: 77, age: 23, nat: 'Kosovo', photo: 'https://images.fotmob.com/image_resources/playerimages/1219540.png' },
      { id: 'elv_schnell', name: 'Luca Schnellbacher', number: 24, team: 'SV Elversberg', leagueId: 'bundesliga', kitPattern: 'plain', pos: 'ST', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/459010.png', val: 6, budget: 6, wage: 24, ovr: 74, pac: 77, sho: 75, pas: 68, dri: 74, def: 40, phy: 76, age: 31, nat: 'Alemania', photo: 'https://images.fotmob.com/image_resources/playerimages/459010.png' },
      { id: 'elv_stock', name: 'Paul Stock', number: 21, team: 'SV Elversberg', leagueId: 'bundesliga', kitPattern: 'plain', pos: 'CAM', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/1227391.png', val: 5, budget: 5, wage: 20, ovr: 73, pac: 74, sho: 72, pas: 74, dri: 74, def: 52, phy: 73, age: 28, nat: 'Alemania', photo: 'https://images.fotmob.com/image_resources/playerimages/1227391.png' }
    ]
  }
];

// Add each new club (avoiding duplicates if re-run)
NEW_CLUBS.forEach(nc => {
  const existingIdx = db.clubs.findIndex(c => c.id === nc.id);
  if (existingIdx !== -1) {
    db.clubs[existingIdx] = nc;
  } else {
    db.clubs.push(nc);
  }

  // Update photo map
  (nc.roster || []).forEach(p => {
    if (p.photo && !p.photo.includes('default_player')) {
      photoMap[p.name] = p.photo;
    }
  });
});

// Write to files
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
fs.writeFileSync(publicDbPath, JSON.stringify(db, null, 2), 'utf8');
fs.writeFileSync(photoMapPath, JSON.stringify(photoMap, null, 2), 'utf8');

const distDbPath = path.resolve(__dirname, '../dist/database.json');
if (fs.existsSync(distDbPath)) {
  fs.writeFileSync(distDbPath, JSON.stringify(db, null, 2), 'utf8');
}

console.log('Successfully updated database with Bundesliga clubs!');
const bClubs = db.clubs.filter(c => c.leagueId === 'bundesliga');
console.log('Total Bundesliga clubs count:', bClubs.length);
bClubs.forEach((c, idx) => console.log(`${idx + 1}. [${c.id}] ${c.name} (${c.shortName}) - ${c.roster.length} players`));
