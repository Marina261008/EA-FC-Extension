const fs = require('fs');
const path = require('path');
const https = require('https');

function fetchJson(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        try { resolve(JSON.parse(data)); } catch (e) { resolve(null); }
      });
    }).on("error", () => resolve(null));
  });
}

function checkImage(url) {
  return new Promise((resolve) => {
    https.request(url, { method: "HEAD", headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
      resolve(res.statusCode === 200);
    }).on("error", () => resolve(false)).end();
  });
}

async function resolvePlayerPhoto(playerName) {
  try {
    const url = `https://apigw.fotmob.com/searchapi/suggest?term=${encodeURIComponent(playerName)}`;
    const data = await fetchJson(url);
    const squadOpt = data?.squadMemberSuggest?.[0]?.options?.[0];
    const playerOpt = data?.playerSuggest?.[0]?.options?.[0];
    const opt = squadOpt || playerOpt;
    
    if (opt?.payload?.id) {
      const pid = opt.payload.id;
      const imgUrl = `https://images.fotmob.com/image_resources/playerimages/${pid}.png`;
      const ok = await checkImage(imgUrl);
      if (ok) return imgUrl;
    }
  } catch (e) {}
  return './default_player.svg';
}

const NEW_LEAGUES = [
  {
    id: 'portugal',
    name: 'Liga Portugal Betclic 26/27',
    shortName: 'Liga Portugal',
    icon: '🇵🇹',
    logo: 'https://images.fotmob.com/image_resources/logo/leaguelogo/61.png',
    localLogo: './leagues/portugal.png',
    color: '#006633'
  },
  {
    id: 'eredivisie',
    name: 'Eredivisie 26/27',
    shortName: 'Eredivisie',
    icon: '🇳🇱',
    logo: 'https://images.fotmob.com/image_resources/logo/leaguelogo/57.png',
    localLogo: './leagues/eredivisie.png',
    color: '#002f6c'
  },
  {
    id: 'championship',
    name: 'EFL Championship 26/27',
    shortName: 'Championship',
    icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    logo: 'https://images.fotmob.com/image_resources/logo/leaguelogo/48.png',
    localLogo: './leagues/championship.png',
    color: '#132257'
  },
  {
    id: 'superlig',
    name: 'Trendyol Süper Lig 26/27',
    shortName: 'Süper Lig',
    icon: '🇹🇷',
    logo: 'https://images.fotmob.com/image_resources/logo/leaguelogo/71.png',
    localLogo: './leagues/superlig.png',
    color: '#e30a17'
  },
  {
    id: 'argentina',
    name: 'Liga Profesional Argentina 26/27',
    shortName: 'Liga Profesional',
    icon: '🇦🇷',
    logo: 'https://images.fotmob.com/image_resources/logo/leaguelogo/112.png',
    localLogo: './leagues/argentina.png',
    color: '#74acdf'
  }
];

const RAW_CLUBS = [
  // --- LIGA PORTUGAL ---
  {
    id: 'benfica',
    name: 'SL Benfica',
    shortName: 'BEN',
    leagueId: 'portugal',
    city: 'Lisboa',
    stadium: 'Estádio da Luz',
    capacity: 64642,
    budget: 75,
    wageBudget: 1200,
    primaryColor: '#E41B13',
    secondaryColor: '#FFFFFF',
    accentColor: '#FFD700',
    textColor: '#FFFFFF',
    kitPattern: 'plain',
    championsQualified: true,
    fotmobTeamId: 9772,
    roster: [
      { name: 'Anatoliy Trubin', number: 1, pos: 'GK', ovr: 81, nat: 'Ucrania', age: 23, pac: 80, sho: 81, pas: 74, dri: 82, def: 42, phy: 80 },
      { name: 'Alexander Bah', number: 6, pos: 'RB', ovr: 80, nat: 'Dinamarca', age: 27, pac: 83, sho: 65, pas: 75, dri: 78, def: 77, phy: 81 },
      { name: 'António Silva', number: 4, pos: 'CB', ovr: 82, nat: 'Portugal', age: 21, pac: 78, sho: 40, pas: 73, dri: 72, def: 83, phy: 82 },
      { name: 'Nicolás Otamendi', number: 30, pos: 'CB', ovr: 81, nat: 'Argentina', age: 37, pac: 58, sho: 56, pas: 68, dri: 62, def: 83, phy: 83 },
      { name: 'Álvaro Carreras', number: 3, pos: 'LB', ovr: 77, nat: 'España', age: 22, pac: 80, sho: 60, pas: 72, dri: 76, def: 74, phy: 74 },
      { name: 'Florentino Luís', number: 61, pos: 'CDM', ovr: 80, nat: 'Portugal', age: 25, pac: 68, sho: 55, pas: 75, dri: 73, def: 82, phy: 80 },
      { name: 'Fredrik Aursnes', number: 8, pos: 'CM', ovr: 81, nat: 'Noruega', age: 29, pac: 75, sho: 72, pas: 80, dri: 79, def: 78, phy: 80 },
      { name: 'Orkun Kökçü', number: 10, pos: 'CAM', ovr: 82, nat: 'Turquía', age: 24, pac: 74, sho: 80, pas: 83, dri: 81, def: 68, phy: 76 },
      { name: 'Ángel Di María', number: 11, pos: 'RW', ovr: 83, nat: 'Argentina', age: 37, pac: 76, sho: 81, pas: 85, dri: 86, def: 45, phy: 68 },
      { name: 'Vangelis Pavlidis', number: 14, pos: 'ST', ovr: 82, nat: 'Grecia', age: 26, pac: 81, sho: 82, pas: 74, dri: 80, def: 42, phy: 80 },
      { name: 'Kerem Aktürkoğlu', number: 17, pos: 'LW', ovr: 81, nat: 'Turquía', age: 26, pac: 87, sho: 77, pas: 76, dri: 83, def: 40, phy: 66 },
      { name: 'Arthur Cabral', number: 9, pos: 'ST', ovr: 78, nat: 'Brasil', age: 27, pac: 72, sho: 79, pas: 65, dri: 74, def: 38, phy: 82 },
      { name: 'Renato Sanches', number: 85, pos: 'CM', ovr: 78, nat: 'Portugal', age: 27, pac: 78, sho: 75, pas: 77, dri: 81, def: 72, phy: 81 },
      { name: 'Leandro Barreiro', number: 18, pos: 'CM', ovr: 79, nat: 'Luxemburgo', age: 25, pac: 73, sho: 68, pas: 76, dri: 77, def: 76, phy: 81 },
      { name: 'Gianluca Prestianni', number: 25, pos: 'RW', ovr: 75, nat: 'Argentina', age: 19, pac: 84, sho: 70, pas: 72, dri: 80, def: 35, phy: 60 }
    ]
  },
  {
    id: 'sporting_cp',
    name: 'Sporting CP',
    shortName: 'SCP',
    leagueId: 'portugal',
    city: 'Lisboa',
    stadium: 'Estádio José Alvalade',
    capacity: 50095,
    budget: 70,
    wageBudget: 1100,
    primaryColor: '#008050',
    secondaryColor: '#FFFFFF',
    accentColor: '#E6A100',
    textColor: '#FFFFFF',
    kitPattern: 'stripes',
    championsQualified: true,
    fotmobTeamId: 9768,
    roster: [
      { name: 'Franco Israel', number: 1, pos: 'GK', ovr: 78, nat: 'Uruguay', age: 24, pac: 77, sho: 78, pas: 72, dri: 79, def: 38, phy: 76 },
      { name: 'Geovany Quenda', number: 57, pos: 'RWB', ovr: 76, nat: 'Portugal', age: 18, pac: 86, sho: 70, pas: 74, dri: 81, def: 65, phy: 67 },
      { name: 'Eduardo Quaresma', number: 72, pos: 'CB', ovr: 78, nat: 'Portugal', age: 23, pac: 76, sho: 42, pas: 70, dri: 72, def: 79, phy: 78 },
      { name: 'Ousmane Diomande', number: 26, pos: 'CB', ovr: 81, nat: 'Costa de Marfil', age: 21, pac: 79, sho: 45, pas: 72, dri: 71, def: 82, phy: 84 },
      { name: 'Gonçalo Inácio', number: 25, pos: 'CB', ovr: 82, nat: 'Portugal', age: 23, pac: 77, sho: 50, pas: 79, dri: 74, def: 83, phy: 80 },
      { name: 'Nuno Santos', number: 11, pos: 'LWB', ovr: 80, nat: 'Portugal', age: 30, pac: 81, sho: 76, pas: 80, dri: 78, def: 71, phy: 74 },
      { name: 'Morten Hjulmand', number: 42, pos: 'CDM', ovr: 82, nat: 'Dinamarca', age: 25, pac: 71, sho: 69, pas: 78, dri: 76, def: 82, phy: 84 },
      { name: 'Hidemasa Morita', number: 5, pos: 'CM', ovr: 81, nat: 'Japón', age: 29, pac: 72, sho: 71, pas: 80, dri: 79, def: 78, phy: 77 },
      { name: 'Francisco Trincão', number: 17, pos: 'RW', ovr: 81, nat: 'Portugal', age: 25, pac: 82, sho: 78, pas: 79, dri: 84, def: 44, phy: 68 },
      { name: 'Viktor Gyökeres', number: 9, pos: 'ST', ovr: 85, nat: 'Suecia', age: 26, pac: 87, sho: 86, pas: 76, dri: 82, def: 48, phy: 89 },
      { name: 'Pedro Gonçalves', number: 8, pos: 'LW', ovr: 83, nat: 'Portugal', age: 26, pac: 78, sho: 83, pas: 82, dri: 83, def: 64, phy: 73 },
      { name: 'Daniel Bragança', number: 23, pos: 'CM', ovr: 79, nat: 'Portugal', age: 25, pac: 70, sho: 72, pas: 82, dri: 80, def: 72, phy: 68 },
      { name: 'Conrad Harder', number: 19, pos: 'ST', ovr: 75, nat: 'Dinamarca', age: 19, pac: 80, sho: 76, pas: 64, dri: 73, def: 36, phy: 78 },
      { name: 'Matheus Reis', number: 2, pos: 'LB', ovr: 77, nat: 'Brasil', age: 30, pac: 74, sho: 58, pas: 72, dri: 73, def: 77, phy: 78 },
      { name: 'Vladan Kovačević', number: 13, pos: 'GK', ovr: 77, nat: 'Bosnia', age: 26, pac: 76, sho: 77, pas: 70, dri: 78, def: 38, phy: 75 }
    ]
  },
  {
    id: 'fc_porto',
    name: 'FC Porto',
    shortName: 'FCP',
    leagueId: 'portugal',
    city: 'Porto',
    stadium: 'Estádio do Dragão',
    capacity: 50033,
    budget: 68,
    wageBudget: 1050,
    primaryColor: '#0038A8',
    secondaryColor: '#FFFFFF',
    accentColor: '#D21034',
    textColor: '#FFFFFF',
    kitPattern: 'stripes',
    championsQualified: true,
    fotmobTeamId: 9773,
    roster: [
      { name: 'Diogo Costa', number: 99, pos: 'GK', ovr: 84, nat: 'Portugal', age: 25, pac: 83, sho: 84, pas: 78, dri: 85, def: 45, phy: 83 },
      { name: 'Martim Fernandes', number: 52, pos: 'RB', ovr: 75, nat: 'Portugal', age: 19, pac: 80, sho: 55, pas: 71, dri: 75, def: 73, phy: 72 },
      { name: 'Nehuén Pérez', number: 24, pos: 'CB', ovr: 79, nat: 'Argentina', age: 24, pac: 72, sho: 45, pas: 68, dri: 67, def: 80, phy: 81 },
      { name: 'Zé Pedro', number: 97, pos: 'CB', ovr: 76, nat: 'Portugal', age: 27, pac: 68, sho: 40, pas: 66, dri: 65, def: 77, phy: 79 },
      { name: 'Francisco Moura', number: 74, pos: 'LB', ovr: 77, nat: 'Portugal', age: 25, pac: 79, sho: 63, pas: 73, dri: 75, def: 74, phy: 76 },
      { name: 'Alan Varela', number: 22, pos: 'CDM', ovr: 81, nat: 'Argentina', age: 23, pac: 71, sho: 66, pas: 78, dri: 76, def: 81, phy: 80 },
      { name: 'Stephen Eustáquio', number: 6, pos: 'CM', ovr: 78, nat: 'Canadá', age: 28, pac: 70, sho: 71, pas: 78, dri: 76, def: 75, phy: 77 },
      { name: 'Nico González', number: 16, pos: 'CM', ovr: 80, nat: 'España', age: 23, pac: 73, sho: 74, pas: 79, dri: 81, def: 75, phy: 79 },
      { name: 'Pepê', number: 11, pos: 'RW', ovr: 81, nat: 'Brasil', age: 28, pac: 86, sho: 74, pas: 77, dri: 84, def: 58, phy: 72 },
      { name: 'Samu Omorodion', number: 9, pos: 'ST', ovr: 81, nat: 'España', age: 20, pac: 86, sho: 80, pas: 64, dri: 76, def: 38, phy: 86 },
      { name: 'Wenderson Galeno', number: 13, pos: 'LW', ovr: 81, nat: 'Brasil', age: 27, pac: 90, sho: 78, pas: 75, dri: 82, def: 55, phy: 74 },
      { name: 'Iván Jaime', number: 17, pos: 'CAM', ovr: 77, nat: 'España', age: 24, pac: 74, sho: 75, pas: 78, dri: 80, def: 52, phy: 68 },
      { name: 'Danny Namaso', number: 19, pos: 'ST', ovr: 75, nat: 'Inglaterra', age: 24, pac: 78, sho: 74, pas: 68, dri: 76, def: 40, phy: 76 },
      { name: 'Cláudio Ramos', number: 14, pos: 'GK', ovr: 75, nat: 'Portugal', age: 33, pac: 74, sho: 75, pas: 68, dri: 75, def: 36, phy: 74 }
    ]
  },
  {
    id: 'sc_braga',
    name: 'SC Braga',
    shortName: 'SCB',
    leagueId: 'portugal',
    city: 'Braga',
    stadium: 'Estádio Municipal de Braga',
    capacity: 30286,
    budget: 45,
    wageBudget: 650,
    primaryColor: '#ED1C24',
    secondaryColor: '#FFFFFF',
    accentColor: '#1A1A1A',
    textColor: '#FFFFFF',
    kitPattern: 'plain',
    fotmobTeamId: 9764,
    roster: [
      { name: 'Matheus', number: 1, pos: 'GK', ovr: 79, nat: 'Brasil', age: 33, pac: 78, sho: 79, pas: 74, dri: 80, def: 40, phy: 77 },
      { name: 'Víctor Gómez', number: 2, pos: 'RB', ovr: 77, nat: 'España', age: 25, pac: 82, sho: 58, pas: 72, dri: 75, def: 74, phy: 74 },
      { name: 'Sikou Niakaté', number: 4, pos: 'CB', ovr: 78, nat: 'Malí', age: 25, pac: 75, sho: 40, pas: 65, dri: 66, def: 79, phy: 82 },
      { name: 'Paulo Oliveira', number: 15, pos: 'CB', ovr: 76, nat: 'Portugal', age: 33, pac: 60, sho: 42, pas: 66, dri: 62, def: 78, phy: 78 },
      { name: 'Adrián Marín', number: 19, pos: 'LB', ovr: 75, nat: 'España', age: 28, pac: 76, sho: 56, pas: 70, dri: 72, def: 73, phy: 73 },
      { name: 'João Moutinho', number: 8, pos: 'CM', ovr: 78, nat: 'Portugal', age: 38, pac: 52, sho: 70, pas: 84, dri: 77, def: 72, phy: 66 },
      { name: 'Rodrigo Zalazar', number: 11, pos: 'CAM', ovr: 79, nat: 'Uruguay', age: 25, pac: 76, sho: 79, pas: 79, dri: 80, def: 65, phy: 76 },
      { name: 'André Horta', number: 10, pos: 'CM', ovr: 77, nat: 'Portugal', age: 28, pac: 72, sho: 72, pas: 79, dri: 78, def: 68, phy: 70 },
      { name: 'Roger Fernandes', number: 77, pos: 'RW', ovr: 76, nat: 'Portugal', age: 19, pac: 88, sho: 71, pas: 70, dri: 80, def: 45, phy: 62 },
      { name: 'Amine El Ouazzani', number: 9, pos: 'ST', ovr: 76, nat: 'Marruecos', age: 23, pac: 78, sho: 76, pas: 66, dri: 74, def: 38, phy: 78 },
      { name: 'Ricardo Horta', number: 21, pos: 'LW', ovr: 80, nat: 'Portugal', age: 30, pac: 79, sho: 80, pas: 78, dri: 81, def: 52, phy: 70 },
      { name: 'Bruma', number: 7, pos: 'LW', ovr: 79, nat: 'Portugal', age: 30, pac: 88, sho: 75, pas: 74, dri: 83, def: 42, phy: 64 },
      { name: 'Gabri Martínez', number: 70, pos: 'RW', ovr: 75, nat: 'España', age: 22, pac: 82, sho: 72, pas: 70, dri: 77, def: 40, phy: 68 }
    ]
  },

  // --- EREDIVISIE ---
  {
    id: 'ajax',
    name: 'AFC Ajax',
    shortName: 'AJX',
    leagueId: 'eredivisie',
    city: 'Ámsterdam',
    stadium: 'Johan Cruyff Arena',
    capacity: 55865,
    budget: 75,
    wageBudget: 1100,
    primaryColor: '#D2122E',
    secondaryColor: '#FFFFFF',
    accentColor: '#000000',
    textColor: '#FFFFFF',
    kitPattern: 'stripes',
    fotmobTeamId: 8593,
    roster: [
      { name: 'Remko Pasveer', number: 40, pos: 'GK', ovr: 77, nat: 'Países Bajos', age: 41, pac: 74, sho: 76, pas: 78, dri: 77, def: 40, phy: 74 },
      { name: 'Devyne Rensch', number: 2, pos: 'RB', ovr: 78, nat: 'Países Bajos', age: 22, pac: 81, sho: 60, pas: 73, dri: 76, def: 77, phy: 75 },
      { name: 'Josip Šutalo', number: 37, pos: 'CB', ovr: 79, nat: 'Croacia', age: 25, pac: 74, sho: 45, pas: 71, dri: 70, def: 80, phy: 81 },
      { name: 'Youri Baas', number: 15, pos: 'CB', ovr: 75, nat: 'Países Bajos', age: 22, pac: 72, sho: 52, pas: 72, dri: 71, def: 75, phy: 74 },
      { name: 'Jorrel Hato', number: 4, pos: 'LB', ovr: 80, nat: 'Países Bajos', age: 19, pac: 80, sho: 54, pas: 75, dri: 76, def: 80, phy: 79 },
      { name: 'Jordan Henderson', number: 6, pos: 'CDM', ovr: 79, nat: 'Inglaterra', age: 34, pac: 63, sho: 70, pas: 81, dri: 75, def: 79, phy: 79 },
      { name: 'Kenneth Taylor', number: 8, pos: 'CM', ovr: 79, nat: 'Países Bajos', age: 23, pac: 74, sho: 76, pas: 80, dri: 79, def: 73, phy: 75 },
      { name: 'Davy Klaassen', number: 18, pos: 'CAM', ovr: 78, nat: 'Países Bajos', age: 32, pac: 67, sho: 78, pas: 77, dri: 76, def: 71, phy: 76 },
      { name: 'Bertrand Traoré', number: 10, pos: 'RW', ovr: 77, nat: 'Burkina Faso', age: 29, pac: 81, sho: 76, pas: 74, dri: 81, def: 44, phy: 72 },
      { name: 'Brian Brobbey', number: 9, pos: 'ST', ovr: 80, nat: 'Países Bajos', age: 23, pac: 85, sho: 80, pas: 68, dri: 78, def: 40, phy: 87 },
      { name: 'Mika Godts', number: 11, pos: 'LW', ovr: 76, nat: 'Bélgica', age: 19, pac: 85, sho: 72, pas: 71, dri: 81, def: 35, phy: 62 },
      { name: 'Wout Weghorst', number: 25, pos: 'ST', ovr: 78, nat: 'Países Bajos', age: 32, pac: 65, sho: 79, pas: 68, dri: 71, def: 52, phy: 86 },
      { name: 'Steven Berghuis', number: 23, pos: 'RW', ovr: 79, nat: 'Países Bajos', age: 33, pac: 71, sho: 80, pas: 82, dri: 80, def: 52, phy: 68 },
      { name: 'Chuba Akpom', number: 19, pos: 'ST', ovr: 76, nat: 'Inglaterra', age: 29, pac: 78, sho: 77, pas: 66, dri: 74, def: 42, phy: 78 }
    ]
  },
  {
    id: 'psv',
    name: 'PSV Eindhoven',
    shortName: 'PSV',
    leagueId: 'eredivisie',
    city: 'Eindhoven',
    stadium: 'Philips Stadion',
    capacity: 35119,
    budget: 80,
    wageBudget: 1250,
    primaryColor: '#EE1C25',
    secondaryColor: '#FFFFFF',
    accentColor: '#000000',
    textColor: '#FFFFFF',
    kitPattern: 'stripes',
    championsQualified: true,
    fotmobTeamId: 8640,
    roster: [
      { name: 'Walter Benítez', number: 1, pos: 'GK', ovr: 80, nat: 'Argentina', age: 32, pac: 80, sho: 80, pas: 72, dri: 81, def: 44, phy: 80 },
      { name: 'Rick Karsdorp', number: 2, pos: 'RB', ovr: 77, nat: 'Países Bajos', age: 30, pac: 78, sho: 64, pas: 74, dri: 76, def: 74, phy: 76 },
      { name: 'Ryan Flamingo', number: 6, pos: 'CB', ovr: 77, nat: 'Países Bajos', age: 22, pac: 74, sho: 58, pas: 71, dri: 72, def: 78, phy: 80 },
      { name: 'Olivier Boscagli', number: 18, pos: 'CB', ovr: 80, nat: 'Francia', age: 27, pac: 72, sho: 62, pas: 80, dri: 76, def: 81, phy: 78 },
      { name: 'Mauro Júnior', number: 17, pos: 'LB', ovr: 77, nat: 'Brasil', age: 25, pac: 80, sho: 68, pas: 74, dri: 78, def: 75, phy: 74 },
      { name: 'Jerdy Schouten', number: 22, pos: 'CDM', ovr: 82, nat: 'Países Bajos', age: 28, pac: 71, sho: 68, pas: 81, dri: 79, def: 82, phy: 81 },
      { name: 'Joey Veerman', number: 23, pos: 'CM', ovr: 81, nat: 'Países Bajos', age: 26, pac: 68, sho: 78, pas: 87, dri: 80, def: 72, phy: 76 },
      { name: 'Malik Tillman', number: 7, pos: 'CAM', ovr: 80, nat: 'Estados Unidos', age: 22, pac: 78, sho: 79, pas: 79, dri: 82, def: 65, phy: 78 },
      { name: 'Johan Bakayoko', number: 11, pos: 'RW', ovr: 81, nat: 'Bélgica', age: 21, pac: 87, sho: 78, pas: 76, dri: 84, def: 42, phy: 73 },
      { name: 'Luuk de Jong', number: 9, pos: 'ST', ovr: 81, nat: 'Países Bajos', age: 34, pac: 58, sho: 83, pas: 73, dri: 72, def: 54, phy: 85 },
      { name: 'Noa Lang', number: 10, pos: 'LW', ovr: 80, nat: 'Países Bajos', age: 25, pac: 83, sho: 78, pas: 78, dri: 84, def: 45, phy: 68 },
      { name: 'Guus Til', number: 20, pos: 'CAM', ovr: 78, nat: 'Países Bajos', age: 27, pac: 74, sho: 78, pas: 74, dri: 75, def: 66, phy: 78 },
      { name: 'Ricardo Pepi', number: 14, pos: 'ST', ovr: 77, nat: 'Estados Unidos', age: 22, pac: 79, sho: 78, pas: 65, dri: 74, def: 38, phy: 76 },
      { name: 'Ismael Saibari', number: 34, pos: 'CM', ovr: 78, nat: 'Marruecos', age: 23, pac: 76, sho: 75, pas: 77, dri: 81, def: 68, phy: 80 }
    ]
  },
  {
    id: 'feyenoord',
    name: 'Feyenoord Rotterdam',
    shortName: 'FEY',
    leagueId: 'eredivisie',
    city: 'Róterdam',
    stadium: 'De Kuip',
    capacity: 47500,
    budget: 65,
    wageBudget: 950,
    primaryColor: '#ED1C24',
    secondaryColor: '#FFFFFF',
    accentColor: '#000000',
    textColor: '#FFFFFF',
    kitPattern: 'halves',
    championsQualified: true,
    fotmobTeamId: 10235,
    roster: [
      { name: 'Timon Wellenreuther', number: 22, pos: 'GK', ovr: 78, nat: 'Alemania', age: 29, pac: 77, sho: 78, pas: 70, dri: 79, def: 42, phy: 76 },
      { name: 'Jordan Lotomba', number: 2, pos: 'RB', ovr: 76, nat: 'Suiza', age: 26, pac: 82, sho: 58, pas: 71, dri: 75, def: 74, phy: 75 },
      { name: 'Gernot Trauner', number: 18, pos: 'CB', ovr: 78, nat: 'Austria', age: 33, pac: 60, sho: 45, pas: 72, dri: 67, def: 81, phy: 82 },
      { name: 'Dávid Hancko', number: 33, pos: 'CB', ovr: 82, nat: 'Eslovaquia', age: 27, pac: 77, sho: 68, pas: 76, dri: 74, def: 83, phy: 82 },
      { name: 'Quilindschy Hartman', number: 5, pos: 'LB', ovr: 79, nat: 'Países Bajos', age: 23, pac: 82, sho: 64, pas: 76, dri: 78, def: 77, phy: 78 },
      { name: 'In-beom Hwang', number: 4, pos: 'CM', ovr: 79, nat: 'Corea del Sur', age: 28, pac: 75, sho: 73, pas: 81, dri: 80, def: 74, phy: 75 },
      { name: 'Quinten Timber', number: 8, pos: 'CM', ovr: 80, nat: 'Países Bajos', age: 23, pac: 77, sho: 75, pas: 78, dri: 81, def: 77, phy: 82 },
      { name: 'Calvin Stengs', number: 10, pos: 'CAM', ovr: 78, nat: 'Países Bajos', age: 26, pac: 75, sho: 76, pas: 81, dri: 81, def: 55, phy: 70 },
      { name: 'Igor Paixão', number: 14, pos: 'LW', ovr: 79, nat: 'Brasil', age: 24, pac: 86, sho: 77, pas: 74, dri: 81, def: 45, phy: 68 },
      { name: 'Santiago Giménez', number: 29, pos: 'ST', ovr: 82, nat: 'México', age: 23, pac: 81, sho: 83, pas: 68, dri: 78, def: 42, phy: 83 },
      { name: 'Antoni Milambo', number: 27, pos: 'RW', ovr: 76, nat: 'Países Bajos', age: 20, pac: 80, sho: 73, pas: 74, dri: 78, def: 62, phy: 72 },
      { name: 'Ayase Ueda', number: 9, pos: 'ST', ovr: 76, nat: 'Japón', age: 26, pac: 78, sho: 77, pas: 65, dri: 73, def: 40, phy: 76 },
      { name: 'Ramiz Zerrouki', number: 6, pos: 'CDM', ovr: 76, nat: 'Argelia', age: 26, pac: 68, sho: 65, pas: 75, dri: 74, def: 77, phy: 79 },
      { name: 'Justin Bijlow', number: 1, pos: 'GK', ovr: 78, nat: 'Países Bajos', age: 27, pac: 78, sho: 77, pas: 72, dri: 79, def: 40, phy: 76 }
    ]
  },
  {
    id: 'az_alkmaar',
    name: 'AZ Alkmaar',
    shortName: 'AZ',
    leagueId: 'eredivisie',
    city: 'Alkmaar',
    stadium: 'AFAS Stadion',
    capacity: 19500,
    budget: 42,
    wageBudget: 600,
    primaryColor: '#E30613',
    secondaryColor: '#FFFFFF',
    accentColor: '#000000',
    textColor: '#FFFFFF',
    kitPattern: 'plain',
    fotmobTeamId: 10229,
    roster: [
      { name: 'Rome-Jayden Owusu-Oduro', number: 1, pos: 'GK', ovr: 74, nat: 'Países Bajos', age: 20, pac: 73, sho: 74, pas: 68, dri: 75, def: 38, phy: 74 },
      { name: 'Seiya Maikuma', number: 16, pos: 'RB', ovr: 76, nat: 'Japón', age: 27, pac: 80, sho: 62, pas: 72, dri: 74, def: 74, phy: 75 },
      { name: 'Alexandre Penetra', number: 5, pos: 'CB', ovr: 76, nat: 'Portugal', age: 23, pac: 73, sho: 45, pas: 68, dri: 67, def: 77, phy: 78 },
      { name: 'Wouter Goes', number: 4, pos: 'CB', ovr: 75, nat: 'Países Bajos', age: 20, pac: 72, sho: 42, pas: 67, dri: 66, def: 76, phy: 77 },
      { name: 'David Møller Wolfe', number: 18, pos: 'LB', ovr: 75, nat: 'Noruega', age: 22, pac: 81, sho: 58, pas: 70, dri: 73, def: 73, phy: 75 },
      { name: 'Jordy Clasie', number: 8, pos: 'CDM', ovr: 78, nat: 'Países Bajos', age: 33, pac: 62, sho: 68, pas: 81, dri: 76, def: 78, phy: 75 },
      { name: 'Peer Koopmeiners', number: 6, pos: 'CM', ovr: 75, nat: 'Países Bajos', age: 24, pac: 70, sho: 68, pas: 76, dri: 74, def: 74, phy: 76 },
      { name: 'Sven Mijnans', number: 10, pos: 'CAM', ovr: 78, nat: 'Países Bajos', age: 24, pac: 74, sho: 77, pas: 79, dri: 78, def: 64, phy: 74 },
      { name: 'Ibrahim Sadiq', number: 11, pos: 'RW', ovr: 76, nat: 'Ghana', age: 24, pac: 86, sho: 73, pas: 68, dri: 77, def: 42, phy: 71 },
      { name: 'Troy Parrott', number: 9, pos: 'ST', ovr: 77, nat: 'Irlanda', age: 23, pac: 79, sho: 78, pas: 67, dri: 75, def: 40, phy: 76 },
      { name: 'Ruben van Bommel', number: 7, pos: 'LW', ovr: 76, nat: 'Países Bajos', age: 20, pac: 83, sho: 74, pas: 71, dri: 77, def: 45, phy: 68 },
      { name: 'Ernest Poku', number: 21, pos: 'RW', ovr: 73, nat: 'Países Bajos', age: 21, pac: 87, sho: 68, pas: 65, dri: 76, def: 35, phy: 65 }
    ]
  },

  // --- CHAMPIONSHIP ---
  {
    id: 'leeds',
    name: 'Leeds United',
    shortName: 'LEE',
    leagueId: 'championship',
    city: 'Leeds',
    stadium: 'Elland Road',
    capacity: 37890,
    budget: 60,
    wageBudget: 900,
    primaryColor: '#FFFFFF',
    secondaryColor: '#1D428A',
    accentColor: '#FFCD00',
    textColor: '#1D428A',
    kitPattern: 'plain',
    fotmobTeamId: 8463,
    roster: [
      { name: 'Illan Meslier', number: 1, pos: 'GK', ovr: 77, nat: 'Francia', age: 25, pac: 77, sho: 76, pas: 72, dri: 78, def: 40, phy: 76 },
      { name: 'Jayden Bogle', number: 2, pos: 'RB', ovr: 75, nat: 'Inglaterra', age: 24, pac: 81, sho: 62, pas: 70, dri: 74, def: 73, phy: 73 },
      { name: 'Joe Rodon', number: 6, pos: 'CB', ovr: 77, nat: 'Gales', age: 27, pac: 72, sho: 40, pas: 66, dri: 64, def: 78, phy: 80 },
      { name: 'Pascal Struijk', number: 5, pos: 'CB', ovr: 77, nat: 'Países Bajos', age: 25, pac: 70, sho: 55, pas: 72, dri: 68, def: 78, phy: 81 },
      { name: 'Junior Firpo', number: 3, pos: 'LB', ovr: 76, nat: 'República Dominicana', age: 28, pac: 79, sho: 64, pas: 72, dri: 75, def: 74, phy: 76 },
      { name: 'Ethan Ampadu', number: 4, pos: 'CDM', ovr: 77, nat: 'Gales', age: 24, pac: 74, sho: 58, pas: 74, dri: 73, def: 78, phy: 79 },
      { name: 'Ao Tanaka', number: 22, pos: 'CM', ovr: 76, nat: 'Japón', age: 26, pac: 72, sho: 71, pas: 77, dri: 76, def: 74, phy: 75 },
      { name: 'Brenden Aaronson', number: 11, pos: 'CAM', ovr: 76, nat: 'Estados Unidos', age: 24, pac: 80, sho: 71, pas: 75, dri: 79, def: 58, phy: 66 },
      { name: 'Daniel James', number: 7, pos: 'RW', ovr: 76, nat: 'Gales', age: 27, pac: 93, sho: 72, pas: 70, dri: 78, def: 48, phy: 68 },
      { name: 'Joël Piroe', number: 10, pos: 'ST', ovr: 77, nat: 'Países Bajos', age: 25, pac: 74, sho: 79, pas: 72, dri: 75, def: 40, phy: 76 },
      { name: 'Manor Solomon', number: 14, pos: 'LW', ovr: 77, nat: 'Israel', age: 25, pac: 83, sho: 74, pas: 74, dri: 81, def: 42, phy: 64 },
      { name: 'Wilfried Gnonto', number: 29, pos: 'RW', ovr: 78, nat: 'Italia', age: 21, pac: 87, sho: 75, pas: 73, dri: 82, def: 44, phy: 72 },
      { name: 'Mateo Joseph', number: 19, pos: 'ST', ovr: 75, nat: 'España', age: 21, pac: 80, sho: 75, pas: 65, dri: 74, def: 38, phy: 76 },
      { name: 'Patrick Bamford', number: 9, pos: 'ST', ovr: 74, nat: 'Inglaterra', age: 31, pac: 72, sho: 76, pas: 68, dri: 73, def: 45, phy: 75 }
    ]
  },
  {
    id: 'burnley',
    name: 'Burnley FC',
    shortName: 'BUR',
    leagueId: 'championship',
    city: 'Burnley',
    stadium: 'Turf Moor',
    capacity: 21944,
    budget: 55,
    wageBudget: 850,
    primaryColor: '#6C1D45',
    secondaryColor: '#99D6EA',
    accentColor: '#FEE12B',
    textColor: '#FFFFFF',
    kitPattern: 'plain',
    fotmobTeamId: 8191,
    roster: [
      { name: 'James Trafford', number: 1, pos: 'GK', ovr: 77, nat: 'Inglaterra', age: 22, pac: 77, sho: 77, pas: 72, dri: 78, def: 40, phy: 76 },
      { name: 'Connor Roberts', number: 14, pos: 'RB', ovr: 75, nat: 'Gales', age: 29, pac: 77, sho: 62, pas: 71, dri: 72, def: 74, phy: 76 },
      { name: 'Maxime Estève', number: 5, pos: 'CB', ovr: 77, nat: 'Francia', age: 22, pac: 73, sho: 42, pas: 68, dri: 65, def: 78, phy: 82 },
      { name: 'CJ Egan-Riley', number: 6, pos: 'CB', ovr: 74, nat: 'Inglaterra', age: 22, pac: 72, sho: 40, pas: 67, dri: 66, def: 75, phy: 76 },
      { name: 'Lucas Pires', number: 23, pos: 'LB', ovr: 74, nat: 'Brasil', age: 24, pac: 78, sho: 60, pas: 71, dri: 73, def: 72, phy: 73 },
      { name: 'Josh Cullen', number: 24, pos: 'CDM', ovr: 76, nat: 'Irlanda', age: 28, pac: 68, sho: 64, pas: 76, dri: 74, def: 76, phy: 76 },
      { name: 'Josh Brownhill', number: 8, pos: 'CM', ovr: 77, nat: 'Inglaterra', age: 29, pac: 73, sho: 75, pas: 77, dri: 76, def: 74, phy: 78 },
      { name: 'Hannibal Mejbri', number: 28, pos: 'CAM', ovr: 75, nat: 'Túnez', age: 22, pac: 76, sho: 68, pas: 75, dri: 78, def: 65, phy: 74 },
      { name: 'Luca Koleosho', number: 30, pos: 'RW', ovr: 76, nat: 'Italia', age: 20, pac: 89, sho: 71, pas: 69, dri: 81, def: 42, phy: 66 },
      { name: 'Lyle Foster', number: 17, pos: 'ST', ovr: 76, nat: 'Sudáfrica', age: 24, pac: 81, sho: 77, pas: 66, dri: 75, def: 38, phy: 77 },
      { name: 'Jeremy Sarmiento', number: 11, pos: 'LW', ovr: 75, nat: 'Ecuador', age: 22, pac: 83, sho: 71, pas: 72, dri: 79, def: 44, phy: 64 },
      { name: 'Zian Flemming', number: 19, pos: 'CAM', ovr: 76, nat: 'Países Bajos', age: 26, pac: 73, sho: 78, pas: 74, dri: 75, def: 62, phy: 80 }
    ]
  },
  {
    id: 'sheffield_utd',
    name: 'Sheffield United',
    shortName: 'SHU',
    leagueId: 'championship',
    city: 'Sheffield',
    stadium: 'Bramall Lane',
    capacity: 32050,
    budget: 50,
    wageBudget: 800,
    primaryColor: '#EE2737',
    secondaryColor: '#FFFFFF',
    accentColor: '#000000',
    textColor: '#FFFFFF',
    kitPattern: 'stripes',
    fotmobTeamId: 8657,
    roster: [
      { name: 'Michael Cooper', number: 1, pos: 'GK', ovr: 76, nat: 'Inglaterra', age: 25, pac: 75, sho: 76, pas: 70, dri: 77, def: 38, phy: 75 },
      { name: 'Alfie Gilchrist', number: 2, pos: 'RB', ovr: 74, nat: 'Inglaterra', age: 21, pac: 77, sho: 52, pas: 68, dri: 70, def: 75, phy: 76 },
      { name: 'Harry Souttar', number: 5, pos: 'CB', ovr: 76, nat: 'Australia', age: 26, pac: 58, sho: 40, pas: 66, dri: 60, def: 77, phy: 86 },
      { name: 'Anel Ahmedhodžić', number: 15, pos: 'CB', ovr: 77, nat: 'Bosnia', age: 26, pac: 74, sho: 54, pas: 70, dri: 68, def: 78, phy: 80 },
      { name: 'Harrison Burrows', number: 14, pos: 'LB', ovr: 75, nat: 'Inglaterra', age: 23, pac: 78, sho: 66, pas: 74, dri: 74, def: 73, phy: 74 },
      { name: 'Vinicius Souza', number: 21, pos: 'CDM', ovr: 76, nat: 'Brasil', age: 25, pac: 68, sho: 60, pas: 72, dri: 72, def: 78, phy: 82 },
      { name: 'Sydie Peck', number: 25, pos: 'CM', ovr: 73, nat: 'Inglaterra', age: 20, pac: 72, sho: 68, pas: 74, dri: 73, def: 70, phy: 72 },
      { name: 'Gustavo Hamer', number: 8, pos: 'CAM', ovr: 78, nat: 'Países Bajos', age: 27, pac: 76, sho: 78, pas: 79, dri: 78, def: 72, phy: 78 },
      { name: 'Jesurun Rak-Sakyi', number: 7, pos: 'RW', ovr: 75, nat: 'Inglaterra', age: 22, pac: 85, sho: 72, pas: 69, dri: 79, def: 40, phy: 64 },
      { name: 'Kieffer Moore', number: 9, pos: 'ST', ovr: 75, nat: 'Gales', age: 32, pac: 64, sho: 76, pas: 64, dri: 68, def: 48, phy: 86 },
      { name: 'Callum O\'Hare', number: 10, pos: 'LW', ovr: 76, nat: 'Inglaterra', age: 26, pac: 79, sho: 73, pas: 76, dri: 79, def: 55, phy: 68 },
      { name: 'Tyrese Campbell', number: 11, pos: 'ST', ovr: 73, nat: 'Inglaterra', age: 25, pac: 81, sho: 73, pas: 64, dri: 72, def: 35, phy: 74 }
    ]
  },
  {
    id: 'sunderland',
    name: 'Sunderland AFC',
    shortName: 'SUN',
    leagueId: 'championship',
    city: 'Sunderland',
    stadium: 'Stadium of Light',
    capacity: 49000,
    budget: 48,
    wageBudget: 700,
    primaryColor: '#EB172B',
    secondaryColor: '#FFFFFF',
    accentColor: '#000000',
    textColor: '#FFFFFF',
    kitPattern: 'stripes',
    fotmobTeamId: 8472,
    roster: [
      { name: 'Anthony Patterson', number: 1, pos: 'GK', ovr: 76, nat: 'Inglaterra', age: 24, pac: 76, sho: 75, pas: 70, dri: 76, def: 40, phy: 75 },
      { name: 'Trai Hume', number: 32, pos: 'RB', ovr: 75, nat: 'Irlanda del Norte', age: 23, pac: 77, sho: 58, pas: 71, dri: 72, def: 75, phy: 77 },
      { name: 'Chris Mepham', number: 26, pos: 'CB', ovr: 76, nat: 'Gales', age: 27, pac: 70, sho: 40, pas: 66, dri: 63, def: 77, phy: 79 },
      { name: 'Luke O\'Nien', number: 13, pos: 'CB', ovr: 74, nat: 'Inglaterra', age: 30, pac: 72, sho: 60, pas: 71, dri: 71, def: 74, phy: 76 },
      { name: 'Dennis Cirkin', number: 3, pos: 'LB', ovr: 75, nat: 'Inglaterra', age: 23, pac: 80, sho: 60, pas: 71, dri: 73, def: 74, phy: 75 },
      { name: 'Dan Neil', number: 24, pos: 'CDM', ovr: 76, nat: 'Inglaterra', age: 23, pac: 72, sho: 70, pas: 77, dri: 76, def: 74, phy: 74 },
      { name: 'Chris Rigg', number: 11, pos: 'CM', ovr: 75, nat: 'Inglaterra', age: 17, pac: 77, sho: 72, pas: 76, dri: 78, def: 68, phy: 70 },
      { name: 'Jobe Bellingham', number: 7, pos: 'CAM', ovr: 77, nat: 'Inglaterra', age: 19, pac: 78, sho: 76, pas: 76, dri: 79, def: 66, phy: 78 },
      { name: 'Patrick Roberts', number: 10, pos: 'RW', ovr: 76, nat: 'Inglaterra', age: 28, pac: 80, sho: 74, pas: 76, dri: 82, def: 42, phy: 60 },
      { name: 'Wilson Isidor', number: 18, pos: 'ST', ovr: 76, nat: 'Francia', age: 24, pac: 85, sho: 76, pas: 67, dri: 77, def: 38, phy: 75 },
      { name: 'Romaine Mundle', number: 14, pos: 'LW', ovr: 75, nat: 'Inglaterra', age: 21, pac: 86, sho: 72, pas: 70, dri: 78, def: 40, phy: 65 },
      { name: 'Alan Browne', number: 8, pos: 'CM', ovr: 74, nat: 'Irlanda', age: 29, pac: 70, sho: 72, pas: 74, dri: 73, def: 73, phy: 76 }
    ]
  },

  // --- SÜPER LIG ---
  {
    id: 'galatasaray',
    name: 'Galatasaray SK',
    shortName: 'GAL',
    leagueId: 'superlig',
    city: 'Estambul',
    stadium: 'RAMS Park',
    capacity: 52280,
    budget: 85,
    wageBudget: 1400,
    primaryColor: '#A32638',
    secondaryColor: '#FDB913',
    accentColor: '#000000',
    textColor: '#FFFFFF',
    kitPattern: 'halves',
    fotmobTeamId: 8637,
    roster: [
      { name: 'Fernando Muslera', number: 1, pos: 'GK', ovr: 80, nat: 'Uruguay', age: 38, pac: 79, sho: 80, pas: 74, dri: 81, def: 42, phy: 78 },
      { name: 'Kaan Ayhan', number: 23, pos: 'RB', ovr: 77, nat: 'Turquía', age: 30, pac: 70, sho: 64, pas: 76, dri: 72, def: 77, phy: 78 },
      { name: 'Davinson Sánchez', number: 6, pos: 'CB', ovr: 81, nat: 'Colombia', age: 28, pac: 80, sho: 45, pas: 68, dri: 68, def: 82, phy: 84 },
      { name: 'Abdülkerim Bardakcı', number: 42, pos: 'CB', ovr: 80, nat: 'Turquía', age: 30, pac: 72, sho: 55, pas: 75, dri: 68, def: 81, phy: 83 },
      { name: 'Ismail Jakobs', number: 4, pos: 'LB', ovr: 76, nat: 'Senegal', age: 25, pac: 85, sho: 60, pas: 71, dri: 75, def: 74, phy: 76 },
      { name: 'Lucas Torreira', number: 34, pos: 'CDM', ovr: 82, nat: 'Uruguay', age: 29, pac: 75, sho: 70, pas: 79, dri: 79, def: 82, phy: 81 },
      { name: 'Gabriel Sara', number: 20, pos: 'CM', ovr: 81, nat: 'Brasil', age: 25, pac: 76, sho: 78, pas: 82, dri: 81, def: 74, phy: 78 },
      { name: 'Dries Mertens', number: 10, pos: 'CAM', ovr: 81, nat: 'Bélgica', age: 37, pac: 74, sho: 81, pas: 82, dri: 83, def: 48, phy: 62 },
      { name: 'Barış Alper Yılmaz', number: 53, pos: 'RW', ovr: 80, nat: 'Turquía', age: 24, pac: 88, sho: 77, pas: 74, dri: 80, def: 60, phy: 82 },
      { name: 'Victor Osimhen', number: 45, pos: 'ST', ovr: 87, nat: 'Nigeria', age: 26, pac: 90, sho: 86, pas: 70, dri: 82, def: 42, phy: 85 },
      { name: 'Yunus Akgün', number: 11, pos: 'LW', ovr: 78, nat: 'Turquía', age: 24, pac: 83, sho: 75, pas: 77, dri: 81, def: 45, phy: 65 },
      { name: 'Mauro Icardi', number: 9, pos: 'ST', ovr: 83, nat: 'Argentina', age: 32, pac: 73, sho: 86, pas: 74, dri: 79, def: 40, phy: 78 },
      { name: 'Michy Batshuayi', number: 44, pos: 'ST', ovr: 78, nat: 'Bélgica', age: 31, pac: 78, sho: 80, pas: 68, dri: 77, def: 38, phy: 78 },
      { name: 'Hakim Ziyech', number: 22, pos: 'RW', ovr: 79, nat: 'Marruecos', age: 32, pac: 72, sho: 79, pas: 85, dri: 83, def: 48, phy: 64 }
    ]
  },
  {
    id: 'fenerbahce',
    name: 'Fenerbahçe SK',
    shortName: 'FEN',
    leagueId: 'superlig',
    city: 'Estambul',
    stadium: 'Ülker Stadyumu',
    capacity: 50530,
    budget: 80,
    wageBudget: 1300,
    primaryColor: '#002D72',
    secondaryColor: '#FFED00',
    accentColor: '#FFFFFF',
    textColor: '#FFFFFF',
    kitPattern: 'stripes',
    fotmobTeamId: 8695,
    roster: [
      { name: 'Dominik Livaković', number: 40, pos: 'GK', ovr: 81, nat: 'Croacia', age: 30, pac: 80, sho: 82, pas: 73, dri: 83, def: 44, phy: 79 },
      { name: 'Bright Osayi-Samuel', number: 21, pos: 'RB', ovr: 77, nat: 'Nigeria', age: 27, pac: 91, sho: 62, pas: 70, dri: 78, def: 73, phy: 76 },
      { name: 'Çağlar Söyüncü', number: 4, pos: 'CB', ovr: 79, nat: 'Turquía', age: 28, pac: 75, sho: 48, pas: 68, dri: 67, def: 80, phy: 82 },
      { name: 'Alexander Djiku', number: 6, pos: 'CB', ovr: 79, nat: 'Ghana', age: 30, pac: 74, sho: 45, pas: 72, dri: 68, def: 80, phy: 81 },
      { name: 'Jayden Oosterwolde', number: 24, pos: 'LB', ovr: 78, nat: 'Países Bajos', age: 23, pac: 86, sho: 58, pas: 70, dri: 74, def: 77, phy: 82 },
      { name: 'Sofyan Amrabat', number: 34, pos: 'CDM', ovr: 80, nat: 'Marruecos', age: 28, pac: 71, sho: 68, pas: 79, dri: 77, def: 80, phy: 84 },
      { name: 'Fred', number: 13, pos: 'CM', ovr: 81, nat: 'Brasil', age: 32, pac: 77, sho: 74, pas: 80, dri: 82, def: 77, phy: 77 },
      { name: 'Sebastian Szymański', number: 53, pos: 'CAM', ovr: 80, nat: 'Polonia', age: 25, pac: 81, sho: 78, pas: 80, dri: 81, def: 64, phy: 72 },
      { name: 'Dušan Tadić', number: 10, pos: 'RW', ovr: 81, nat: 'Serbia', age: 36, pac: 66, sho: 80, pas: 86, dri: 82, def: 46, phy: 74 },
      { name: 'Youssef En-Nesyri', number: 19, pos: 'ST', ovr: 81, nat: 'Marruecos', age: 27, pac: 83, sho: 81, pas: 65, dri: 74, def: 42, phy: 84 },
      { name: 'Allan Saint-Maximin', number: 97, pos: 'LW', ovr: 81, nat: 'Francia', age: 28, pac: 90, sho: 73, pas: 76, dri: 88, def: 35, phy: 73 },
      { name: 'Edin Džeko', number: 9, pos: 'ST', ovr: 81, nat: 'Bosnia', age: 39, pac: 56, sho: 84, pas: 76, dri: 75, def: 48, phy: 80 },
      { name: 'İrfan Can Kahveci', number: 17, pos: 'RW', ovr: 79, nat: 'Turquía', age: 29, pac: 73, sho: 79, pas: 82, dri: 80, def: 58, phy: 72 },
      { name: 'Cenk Tosun', number: 23, pos: 'ST', ovr: 75, nat: 'Turquía', age: 33, pac: 66, sho: 78, pas: 67, dri: 71, def: 40, phy: 77 }
    ]
  },
  {
    id: 'besiktas',
    name: 'Beşiktaş JK',
    shortName: 'BJK',
    leagueId: 'superlig',
    city: 'Estambul',
    stadium: 'Tüpraş Stadyumu',
    capacity: 42590,
    budget: 65,
    wageBudget: 1000,
    primaryColor: '#000000',
    secondaryColor: '#FFFFFF',
    accentColor: '#E30613',
    textColor: '#FFFFFF',
    kitPattern: 'stripes',
    fotmobTeamId: 10188,
    roster: [
      { name: 'Mert Günok', number: 34, pos: 'GK', ovr: 78, nat: 'Turquía', age: 36, pac: 77, sho: 78, pas: 75, dri: 78, def: 40, phy: 76 },
      { name: 'Jonas Svensson', number: 2, pos: 'RB', ovr: 75, nat: 'Noruega', age: 32, pac: 76, sho: 58, pas: 71, dri: 72, def: 74, phy: 76 },
      { name: 'Gabriel Paulista', number: 3, pos: 'CB', ovr: 79, nat: 'Brasil', age: 34, pac: 72, sho: 45, pas: 68, dri: 65, def: 80, phy: 80 },
      { name: 'Felix Uduokhai', number: 14, pos: 'CB', ovr: 78, nat: 'Alemania', age: 27, pac: 74, sho: 40, pas: 68, dri: 66, def: 79, phy: 82 },
      { name: 'Arthur Masuaku', number: 26, pos: 'LB', ovr: 77, nat: 'RD del Congo', age: 31, pac: 80, sho: 65, pas: 75, dri: 79, def: 73, phy: 75 },
      { name: 'Gedson Fernandes', number: 83, pos: 'CM', ovr: 80, nat: 'Portugal', age: 26, pac: 82, sho: 74, pas: 78, dri: 82, def: 75, phy: 81 },
      { name: 'Cher Ndour', number: 73, pos: 'CM', ovr: 76, nat: 'Italia', age: 20, pac: 73, sho: 72, pas: 76, dri: 77, def: 72, phy: 78 },
      { name: 'Rafa Silva', number: 27, pos: 'CAM', ovr: 82, nat: 'Portugal', age: 31, pac: 87, sho: 79, pas: 80, dri: 85, def: 48, phy: 64 },
      { name: 'Milot Rashica', number: 7, pos: 'RW', ovr: 78, nat: 'Kosovo', age: 28, pac: 84, sho: 76, pas: 76, dri: 80, def: 52, phy: 71 },
      { name: 'Ciro Immobile', number: 17, pos: 'ST', ovr: 81, nat: 'Italia', age: 35, pac: 75, sho: 84, pas: 70, dri: 76, def: 40, phy: 75 },
      { name: 'Semih Kılıçsoy', number: 9, pos: 'LW', ovr: 77, nat: 'Turquía', age: 19, pac: 83, sho: 78, pas: 70, dri: 80, def: 42, phy: 78 },
      { name: 'João Mário', number: 18, pos: 'LW', ovr: 78, nat: 'Portugal', age: 32, pac: 70, sho: 75, pas: 81, dri: 80, def: 65, phy: 70 },
      { name: 'Ernest Muçi', number: 10, pos: 'CAM', ovr: 76, nat: 'Albania', age: 24, pac: 80, sho: 76, pas: 74, dri: 79, def: 45, phy: 68 }
    ]
  },
  {
    id: 'trabzonspor',
    name: 'Trabzonspor',
    shortName: 'TRA',
    leagueId: 'superlig',
    city: 'Trebisonda',
    stadium: 'Papara Park',
    capacity: 40782,
    budget: 45,
    wageBudget: 700,
    primaryColor: '#800000',
    secondaryColor: '#00BFFF',
    accentColor: '#FFFFFF',
    textColor: '#FFFFFF',
    kitPattern: 'stripes',
    fotmobTeamId: 9912,
    roster: [
      { name: 'Uğurcan Çakır', number: 1, pos: 'GK', ovr: 79, nat: 'Turquía', age: 29, pac: 78, sho: 80, pas: 75, dri: 79, def: 42, phy: 78 },
      { name: 'Pedro Malheiro', number: 79, pos: 'RB', ovr: 76, nat: 'Portugal', age: 24, pac: 83, sho: 60, pas: 72, dri: 75, def: 73, phy: 74 },
      { name: 'Stefan Savić', number: 15, pos: 'CB', ovr: 79, nat: 'Montenegro', age: 34, pac: 68, sho: 40, pas: 65, dri: 62, def: 81, phy: 82 },
      { name: 'Stefano Denswil', number: 24, pos: 'CB', ovr: 76, nat: 'Surinam', age: 31, pac: 70, sho: 56, pas: 72, dri: 68, def: 76, phy: 79 },
      { name: 'Eren Elmalı', number: 18, pos: 'LB', ovr: 76, nat: 'Turquía', age: 24, pac: 81, sho: 55, pas: 71, dri: 74, def: 74, phy: 76 },
      { name: 'Okay Yokuşlu', number: 35, pos: 'CDM', ovr: 77, nat: 'Turquía', age: 31, pac: 65, sho: 68, pas: 76, dri: 72, def: 78, phy: 83 },
      { name: 'Batista Mendy', number: 6, pos: 'CM', ovr: 78, nat: 'Francia', age: 25, pac: 74, sho: 68, pas: 76, dri: 77, def: 78, phy: 82 },
      { name: 'Muhammed Cham', number: 10, pos: 'CAM', ovr: 76, nat: 'Austria', age: 24, pac: 77, sho: 76, pas: 78, dri: 79, def: 52, phy: 68 },
      { name: 'Edin Višća', number: 7, pos: 'RW', ovr: 78, nat: 'Bosnia', age: 35, pac: 78, sho: 79, pas: 79, dri: 79, def: 58, phy: 70 },
      { name: 'Simon Banza', number: 17, pos: 'ST', ovr: 79, nat: 'RD del Congo', age: 28, pac: 79, sho: 80, pas: 68, dri: 76, def: 40, phy: 82 },
      { name: 'Anthony Nwakaeme', number: 9, pos: 'LW', ovr: 77, nat: 'Nigeria', age: 36, pac: 70, sho: 78, pas: 76, dri: 82, def: 45, phy: 80 },
      { name: 'Denis Drăguș', number: 70, pos: 'ST', ovr: 76, nat: 'Rumanía', age: 25, pac: 82, sho: 77, pas: 68, dri: 78, def: 38, phy: 75 }
    ]
  },

  // --- ARGENTINA ---
  {
    id: 'boca_juniors',
    name: 'Boca Juniors',
    shortName: 'BOC',
    leagueId: 'argentina',
    city: 'Buenos Aires',
    stadium: 'Estadio Alberto J. Armando (La Bombonera)',
    capacity: 54000,
    budget: 50,
    wageBudget: 800,
    primaryColor: '#002F6C',
    secondaryColor: '#FFD100',
    accentColor: '#FFFFFF',
    textColor: '#FFFFFF',
    kitPattern: 'hoops',
    fotmobTeamId: 10077,
    roster: [
      { name: 'Sergio Romero', number: 1, pos: 'GK', ovr: 78, nat: 'Argentina', age: 38, pac: 76, sho: 79, pas: 72, dri: 78, def: 42, phy: 77 },
      { name: 'Luis Advíncula', number: 17, pos: 'RB', ovr: 77, nat: 'Perú', age: 35, pac: 86, sho: 68, pas: 71, dri: 76, def: 73, phy: 80 },
      { name: 'Cristian Lema', number: 2, pos: 'CB', ovr: 76, nat: 'Argentina', age: 35, pac: 50, sho: 52, pas: 62, dri: 58, def: 78, phy: 86 },
      { name: 'Marcos Rojo', number: 6, pos: 'CB', ovr: 78, nat: 'Argentina', age: 35, pac: 66, sho: 60, pas: 70, dri: 67, def: 79, phy: 82 },
      { name: 'Lautaro Blanco', number: 23, pos: 'LB', ovr: 76, nat: 'Argentina', age: 26, pac: 78, sho: 55, pas: 75, dri: 73, def: 74, phy: 76 },
      { name: 'Pol Fernández', number: 8, pos: 'CM', ovr: 76, nat: 'Argentina', age: 33, pac: 68, sho: 71, pas: 77, dri: 75, def: 73, phy: 75 },
      { name: 'Ignacio Miramón', number: 21, pos: 'CDM', ovr: 75, nat: 'Argentina', age: 22, pac: 72, sho: 58, pas: 74, dri: 74, def: 76, phy: 76 },
      { name: 'Cristian Medina', number: 36, pos: 'CM', ovr: 78, nat: 'Argentina', age: 22, pac: 76, sho: 72, pas: 79, dri: 81, def: 73, phy: 76 },
      { name: 'Kevin Zenón', number: 22, pos: 'LM', ovr: 78, nat: 'Argentina', age: 23, pac: 80, sho: 75, pas: 78, dri: 80, def: 65, phy: 74 },
      { name: 'Edinson Cavani', number: 10, pos: 'ST', ovr: 80, nat: 'Uruguay', age: 38, pac: 70, sho: 83, pas: 73, dri: 76, def: 52, phy: 78 },
      { name: 'Miguel Merentiel', number: 16, pos: 'ST', ovr: 78, nat: 'Uruguay', age: 29, pac: 79, sho: 79, pas: 68, dri: 76, def: 45, phy: 79 },
      { name: 'Exequiel Zeballos', number: 7, pos: 'RW', ovr: 76, nat: 'Argentina', age: 22, pac: 85, sho: 73, pas: 72, dri: 81, def: 38, phy: 64 },
      { name: 'Brian Aguirre', number: 33, pos: 'LW', ovr: 75, nat: 'Argentina', age: 22, pac: 84, sho: 72, pas: 70, dri: 79, def: 40, phy: 66 },
      { name: 'Leandro Brey', number: 12, pos: 'GK', ovr: 74, nat: 'Argentina', age: 22, pac: 74, sho: 74, pas: 68, dri: 75, def: 38, phy: 74 }
    ]
  },
  {
    id: 'river_plate',
    name: 'River Plate',
    shortName: 'RIV',
    leagueId: 'argentina',
    city: 'Buenos Aires',
    stadium: 'Estadio Monumental',
    capacity: 84567,
    budget: 55,
    wageBudget: 900,
    primaryColor: '#FFFFFF',
    secondaryColor: '#E30613',
    accentColor: '#000000',
    textColor: '#E30613',
    kitPattern: 'sash',
    fotmobTeamId: 10076,
    roster: [
      { name: 'Franco Armani', number: 1, pos: 'GK', ovr: 79, nat: 'Argentina', age: 38, pac: 78, sho: 80, pas: 72, dri: 79, def: 44, phy: 78 },
      { name: 'Fabricio Bustos', number: 16, pos: 'RB', ovr: 77, nat: 'Argentina', age: 28, pac: 81, sho: 60, pas: 73, dri: 75, def: 74, phy: 75 },
      { name: 'Germán Pezzella', number: 6, pos: 'CB', ovr: 79, nat: 'Argentina', age: 33, pac: 68, sho: 45, pas: 67, dri: 65, def: 81, phy: 82 },
      { name: 'Paulo Díaz', number: 17, pos: 'CB', ovr: 78, nat: 'Chile', age: 30, pac: 72, sho: 54, pas: 71, dri: 68, def: 79, phy: 80 },
      { name: 'Marcos Acuña', number: 24, pos: 'LB', ovr: 80, nat: 'Argentina', age: 33, pac: 76, sho: 74, pas: 79, dri: 81, def: 78, phy: 82 },
      { name: 'Matías Kranevitter', number: 5, pos: 'CDM', ovr: 76, nat: 'Argentina', age: 31, pac: 68, sho: 58, pas: 75, dri: 73, def: 77, phy: 78 },
      { name: 'Santiago Simón', number: 31, pos: 'CM', ovr: 76, nat: 'Argentina', age: 22, pac: 78, sho: 70, pas: 76, dri: 78, def: 71, phy: 73 },
      { name: 'Ignacio Fernández', number: 26, pos: 'CAM', ovr: 77, nat: 'Argentina', age: 35, pac: 68, sho: 75, pas: 80, dri: 78, def: 64, phy: 68 },
      { name: 'Claudio Echeverri', number: 19, pos: 'CAM', ovr: 77, nat: 'Argentina', age: 19, pac: 83, sho: 74, pas: 76, dri: 82, def: 42, phy: 62 },
      { name: 'Miguel Borja', number: 9, pos: 'ST', ovr: 79, nat: 'Colombia', age: 32, pac: 74, sho: 82, pas: 65, dri: 73, def: 40, phy: 83 },
      { name: 'Facundo Colidio', number: 11, pos: 'LW', ovr: 77, nat: 'Argentina', age: 25, pac: 81, sho: 76, pas: 74, dri: 79, def: 48, phy: 72 },
      { name: 'Franco Mastantuono', number: 30, pos: 'CAM', ovr: 76, nat: 'Argentina', age: 17, pac: 79, sho: 74, pas: 76, dri: 80, def: 48, phy: 66 },
      { name: 'Manuel Lanzini', number: 10, pos: 'CAM', ovr: 76, nat: 'Argentina', age: 32, pac: 73, sho: 75, pas: 78, dri: 80, def: 52, phy: 66 },
      { name: 'Jeremías Ledesma', number: 25, pos: 'GK', ovr: 77, nat: 'Argentina', age: 32, pac: 76, sho: 78, pas: 70, dri: 78, def: 40, phy: 76 }
    ]
  }
];

async function main() {
  console.log("Starting player photo resolution and database update...");
  
  const processedClubs = [];
  let totalPlayers = 0;
  let photosFound = 0;
  let defaultAvatars = 0;

  for (const rawClub of RAW_CLUBS) {
    console.log(`Processing club: ${rawClub.name} (${rawClub.leagueId})...`);
    const badgeUrl = `https://images.fotmob.com/image_resources/logo/teamlogo/${rawClub.fotmobTeamId}.png`;

    const clubRoster = [];
    for (const p of rawClub.roster) {
      totalPlayers++;
      const photoUrl = await resolvePlayerPhoto(p.name);
      if (photoUrl.startsWith('http')) {
        photosFound++;
      } else {
        defaultAvatars++;
      }

      const valMil = Math.round(p.ovr * 0.45);
      const wageNum = Math.round(p.ovr * 0.4);

      clubRoster.push({
        id: `${rawClub.id}_${p.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
        name: p.name,
        number: p.number,
        team: rawClub.name,
        leagueId: rawClub.leagueId,
        kitPattern: rawClub.kitPattern,
        pos: p.pos,
        imageUrl: photoUrl,
        val: valMil,
        budget: valMil,
        wage: wageNum,
        ovr: p.ovr,
        pac: p.pac,
        sho: p.sho,
        pas: p.pas,
        dri: p.dri,
        def: p.def,
        phy: p.phy,
        age: p.age,
        nat: p.nat
      });
    }

    processedClubs.push({
      id: rawClub.id,
      name: rawClub.name,
      shortName: rawClub.shortName,
      leagueId: rawClub.leagueId,
      city: rawClub.city,
      stadium: rawClub.stadium,
      capacity: rawClub.capacity,
      budget: rawClub.budget,
      wageBudget: rawClub.wageBudget,
      primaryColor: rawClub.primaryColor,
      secondaryColor: rawClub.secondaryColor,
      accentColor: rawClub.accentColor,
      textColor: rawClub.textColor,
      kitPattern: rawClub.kitPattern,
      championsQualified: !!rawClub.championsQualified,
      badge: badgeUrl,
      badgeUrl: badgeUrl,
      roster: clubRoster
    });
  }

  console.log(`\nResolution Summary:`);
  console.log(`Total players: ${totalPlayers}`);
  console.log(`Authentic FotMob photos: ${photosFound}`);
  console.log(`Default player avatars: ${defaultAvatars}`);

  // Load existing database
  const dbPath = path.resolve(__dirname, '../src/data/database.json');
  const publicDbPath = path.resolve(__dirname, '../public/database.json');
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

  // 1. Add new leagues if not present
  for (const nLeague of NEW_LEAGUES) {
    const existingIdx = db.leagues.findIndex(l => l.id === nLeague.id);
    if (existingIdx !== -1) {
      db.leagues[existingIdx] = nLeague;
    } else {
      db.leagues.push(nLeague);
    }
  }

  // 2. Add or update new clubs
  for (const nClub of processedClubs) {
    const existingIdx = db.clubs.findIndex(c => c.id === nClub.id);
    if (existingIdx !== -1) {
      db.clubs[existingIdx] = nClub;
    } else {
      db.clubs.push(nClub);
    }
  }

  // Write to src/data/database.json and public/database.json
  const formattedJson = JSON.stringify(db, null, 2);
  fs.writeFileSync(dbPath, formattedJson, 'utf8');
  fs.writeFileSync(publicDbPath, formattedJson, 'utf8');

  console.log(`Successfully written database with ${db.leagues.length} leagues and ${db.clubs.length} clubs to:`);
  console.log(`- ${dbPath}`);
  console.log(`- ${publicDbPath}`);
}

main().catch(console.error);
