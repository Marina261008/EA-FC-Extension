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

const photoMapPath = path.resolve(__dirname, '../src/data/playerPhotoMap.json');
let photoMap = {};
try {
  photoMap = JSON.parse(fs.readFileSync(photoMapPath, 'utf8'));
} catch (e) {
  photoMap = {};
}

async function resolvePlayerPhoto(playerName) {
  const clean = playerName.trim();
  if (photoMap[clean] && !photoMap[clean].includes('default_player')) {
    return photoMap[clean];
  }

  try {
    const url = `https://apigw.fotmob.com/searchapi/suggest?term=${encodeURIComponent(clean)}`;
    const data = await fetchJson(url);
    const squadOpt = data?.squadMemberSuggest?.[0]?.options?.[0];
    const playerOpt = data?.playerSuggest?.[0]?.options?.[0];
    const opt = squadOpt || playerOpt;
    
    if (opt?.payload?.id) {
      const pid = opt.payload.id;
      const imgUrl = `https://images.fotmob.com/image_resources/playerimages/${pid}.png`;
      const ok = await checkImage(imgUrl);
      if (ok) {
        photoMap[clean] = imgUrl;
        return imgUrl;
      }
    }
  } catch (e) {}
  return './default_player.svg';
}

const NEW_LEAGUES = [
  {
    id: 'brasileirao',
    name: 'Brasileirão Betano 26/27',
    shortName: 'Brasileirão',
    icon: '🇧🇷',
    logo: 'https://images.fotmob.com/image_resources/logo/leaguelogo/268.png',
    localLogo: './leagues/brasileirao.png',
    color: '#009b3a'
  },
  {
    id: 'scotland',
    name: 'Scottish Premiership 26/27',
    shortName: 'Premiership',
    icon: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    logo: 'https://images.fotmob.com/image_resources/logo/leaguelogo/65.png',
    localLogo: './leagues/scotland.png',
    color: '#002d62'
  },
  {
    id: 'belgium',
    name: 'Jupiler Pro League 26/27',
    shortName: 'Pro League',
    icon: '🇧🇪',
    logo: 'https://images.fotmob.com/image_resources/logo/leaguelogo/40.png',
    localLogo: './leagues/belgium.png',
    color: '#1a1a1a'
  }
];

const EXPANDED_CLUBS = [
  // ==================== BRASILEIRÃO (8 Clubes) ====================
  {
    id: 'flamengo',
    name: 'CR Flamengo',
    shortName: 'FLA',
    leagueId: 'brasileirao',
    city: 'Río de Janeiro',
    stadium: 'Estádio do Maracanã',
    capacity: 78838,
    budget: 65,
    wageBudget: 420,
    primaryColor: '#c3281e',
    secondaryColor: '#000000',
    accentColor: '#ffffff',
    textColor: '#ffffff',
    kitPattern: 'stripes',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/5926.png',
    rawPlayers: [
      { name: 'Agustín Rossi', pos: 'GK', number: 1, age: 29, nat: 'Argentina', ovr: 80, pac: 79, sho: 80, pas: 74, dri: 79, def: 42, phy: 78 },
      { name: 'Léo Ortiz', pos: 'CB', number: 3, age: 29, nat: 'Brasil', ovr: 79, pac: 72, sho: 45, pas: 72, dri: 68, def: 80, phy: 80 },
      { name: 'Fabrício Bruno', pos: 'CB', number: 15, age: 29, nat: 'Brasil', ovr: 78, pac: 80, sho: 38, pas: 62, dri: 61, def: 78, phy: 84 },
      { name: 'Ayrton Lucas', pos: 'LB', number: 6, age: 28, nat: 'Brasil', ovr: 78, pac: 87, sho: 65, pas: 73, dri: 78, def: 73, phy: 75 },
      { name: 'Guillermo Varela', pos: 'RB', number: 2, age: 32, nat: 'Uruguay', ovr: 76, pac: 78, sho: 54, pas: 71, dri: 74, def: 74, phy: 73 },
      { name: 'Erick Pulgar', pos: 'CDM', number: 5, age: 31, nat: 'Chile', ovr: 79, pac: 68, sho: 70, pas: 78, dri: 74, def: 79, phy: 80 },
      { name: 'Nicolás de la Cruz', pos: 'CM', number: 18, age: 28, nat: 'Uruguay', ovr: 82, pac: 83, sho: 78, pas: 82, dri: 82, def: 74, phy: 75 },
      { name: 'Gerson Santos', pos: 'CM', number: 8, age: 28, nat: 'Brasil', ovr: 82, pac: 78, sho: 76, pas: 83, dri: 84, def: 75, phy: 83 },
      { name: 'Giorgian de Arrascaeta', pos: 'CAM', number: 14, age: 31, nat: 'Uruguay', ovr: 83, pac: 77, sho: 80, pas: 87, dri: 85, def: 55, phy: 70 },
      { name: 'Pedro Guilherme', pos: 'ST', number: 9, age: 28, nat: 'Brasil', ovr: 81, pac: 76, sho: 83, pas: 73, dri: 78, def: 40, phy: 80 },
      { name: 'Gabriel Barbosa', pos: 'ST', number: 99, age: 29, nat: 'Brasil', ovr: 78, pac: 79, sho: 80, pas: 74, dri: 80, def: 42, phy: 76 },
      { name: 'Bruno Henrique', pos: 'LW', number: 27, age: 34, nat: 'Brasil', ovr: 78, pac: 85, sho: 77, pas: 72, dri: 78, def: 48, phy: 76 }
    ]
  },
  {
    id: 'palmeiras',
    name: 'SE Palmeiras',
    shortName: 'PAL',
    leagueId: 'brasileirao',
    city: 'São Paulo',
    stadium: 'Allianz Parque',
    capacity: 43713,
    budget: 60,
    wageBudget: 390,
    primaryColor: '#006437',
    secondaryColor: '#ffffff',
    accentColor: '#c5a059',
    textColor: '#ffffff',
    kitPattern: 'plain',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/10276.png',
    rawPlayers: [
      { name: 'Weverton', pos: 'GK', number: 21, age: 37, nat: 'Brasil', ovr: 80, pac: 78, sho: 80, pas: 76, dri: 79, def: 48, phy: 79 },
      { name: 'Gustavo Gómez', pos: 'CB', number: 15, age: 32, nat: 'Paraguay', ovr: 81, pac: 71, sho: 58, pas: 68, dri: 65, def: 83, phy: 84 },
      { name: 'Murilo Cerqueira', pos: 'CB', number: 26, age: 28, nat: 'Brasil', ovr: 79, pac: 75, sho: 52, pas: 67, dri: 66, def: 80, phy: 82 },
      { name: 'Joaquín Piquerez', pos: 'LB', number: 22, age: 26, nat: 'Uruguay', ovr: 79, pac: 82, sho: 69, pas: 76, dri: 77, def: 77, phy: 81 },
      { name: 'Marcos Rocha', pos: 'RB', number: 2, age: 36, nat: 'Brasil', ovr: 76, pac: 73, sho: 58, pas: 74, dri: 73, def: 75, phy: 74 },
      { name: 'Aníbal Moreno', pos: 'CDM', number: 5, age: 26, nat: 'Argentina', ovr: 78, pac: 74, sho: 66, pas: 77, dri: 76, def: 78, phy: 80 },
      { name: 'Zé Rafael', pos: 'CM', number: 8, age: 32, nat: 'Brasil', ovr: 78, pac: 73, sho: 74, pas: 78, dri: 78, def: 76, phy: 80 },
      { name: 'Raphael Veiga', pos: 'CAM', number: 23, age: 30, nat: 'Brasil', ovr: 82, pac: 77, sho: 84, pas: 83, dri: 81, def: 58, phy: 76 },
      { name: 'Felipe Anderson', pos: 'RW', number: 9, age: 32, nat: 'Brasil', ovr: 80, pac: 82, sho: 76, pas: 80, dri: 83, def: 56, phy: 68 },
      { name: 'Estêvão Willian', pos: 'RW', number: 41, age: 18, nat: 'Brasil', ovr: 80, pac: 88, sho: 77, pas: 78, dri: 86, def: 40, phy: 64 },
      { name: 'José Manuel López', pos: 'ST', number: 42, age: 24, nat: 'Argentina', ovr: 78, pac: 76, sho: 80, pas: 68, dri: 75, def: 42, phy: 80 },
      { name: 'Rony', pos: 'ST', number: 10, age: 30, nat: 'Brasil', ovr: 77, pac: 87, sho: 75, pas: 68, dri: 76, def: 52, phy: 77 }
    ]
  },
  {
    id: 'saopaulo',
    name: 'São Paulo FC',
    shortName: 'SAO',
    leagueId: 'brasileirao',
    city: 'São Paulo',
    stadium: 'Estádio do Morumbi',
    capacity: 66795,
    budget: 45,
    wageBudget: 310,
    primaryColor: '#e30613',
    secondaryColor: '#ffffff',
    accentColor: '#000000',
    textColor: '#ffffff',
    kitPattern: 'hoops',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/10277.png',
    rawPlayers: [
      { name: 'Rafael Pires', pos: 'GK', number: 23, age: 36, nat: 'Brasil', ovr: 78, pac: 76, sho: 78, pas: 74, dri: 77, def: 45, phy: 77 },
      { name: 'Robert Arboleda', pos: 'CB', number: 5, age: 33, nat: 'Ecuador', ovr: 78, pac: 72, sho: 40, pas: 64, dri: 62, def: 80, phy: 82 },
      { name: 'Alan Franco', pos: 'CB', number: 28, age: 28, nat: 'Argentina', ovr: 76, pac: 70, sho: 42, pas: 68, dri: 65, def: 77, phy: 78 },
      { name: 'Welington Damascena', pos: 'LB', number: 6, age: 24, nat: 'Brasil', ovr: 76, pac: 84, sho: 58, pas: 70, dri: 76, def: 73, phy: 74 },
      { name: 'Igor Vinícius', pos: 'RB', number: 2, age: 28, nat: 'Brasil', ovr: 75, pac: 83, sho: 56, pas: 70, dri: 74, def: 72, phy: 73 },
      { name: 'Pablo Maia', pos: 'CDM', number: 29, age: 23, nat: 'Brasil', ovr: 79, pac: 74, sho: 71, pas: 78, dri: 76, def: 79, phy: 81 },
      { name: 'Alisson Castro', pos: 'CM', number: 25, age: 32, nat: 'Brasil', ovr: 77, pac: 76, sho: 73, pas: 77, dri: 78, def: 70, phy: 74 },
      { name: 'Lucas Moura', pos: 'RW', number: 7, age: 33, nat: 'Brasil', ovr: 81, pac: 86, sho: 78, pas: 79, dri: 84, def: 52, phy: 73 },
      { name: 'Luciano Neves', pos: 'CAM', number: 10, age: 32, nat: 'Brasil', ovr: 78, pac: 75, sho: 80, pas: 76, dri: 79, def: 50, phy: 74 },
      { name: 'Jonathan Calleri', pos: 'ST', number: 9, age: 31, nat: 'Argentina', ovr: 80, pac: 75, sho: 82, pas: 68, dri: 74, def: 48, phy: 84 },
      { name: 'Ferreira', pos: 'LW', number: 47, age: 27, nat: 'Brasil', ovr: 77, pac: 85, sho: 72, pas: 72, dri: 81, def: 42, phy: 68 },
      { name: 'Luiz Gustavo', pos: 'CDM', number: 16, age: 38, nat: 'Brasil', ovr: 76, pac: 60, sho: 68, pas: 76, dri: 72, def: 78, phy: 78 }
    ]
  },
  {
    id: 'corinthians',
    name: 'SC Corinthians',
    shortName: 'COR',
    leagueId: 'brasileirao',
    city: 'São Paulo',
    stadium: 'Neo Química Arena',
    capacity: 49205,
    budget: 45,
    wageBudget: 340,
    primaryColor: '#ffffff',
    secondaryColor: '#000000',
    accentColor: '#c3281e',
    textColor: '#000000',
    kitPattern: 'plain',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/10274.png',
    rawPlayers: [
      { name: 'Hugo Souza', pos: 'GK', number: 1, age: 26, nat: 'Brasil', ovr: 77, pac: 76, sho: 77, pas: 73, dri: 75, def: 45, phy: 78 },
      { name: 'André Ramalho', pos: 'CB', number: 5, age: 33, nat: 'Brasil', ovr: 78, pac: 68, sho: 54, pas: 72, dri: 66, def: 80, phy: 80 },
      { name: 'Félix Torres', pos: 'CB', number: 3, age: 28, nat: 'Ecuador', ovr: 77, pac: 74, sho: 40, pas: 63, dri: 61, def: 78, phy: 82 },
      { name: 'Matheus Bidu', pos: 'LB', number: 21, age: 26, nat: 'Brasil', ovr: 75, pac: 82, sho: 60, pas: 71, dri: 74, def: 71, phy: 73 },
      { name: 'Fagner', pos: 'RB', number: 23, age: 36, nat: 'Brasil', ovr: 76, pac: 72, sho: 62, pas: 75, dri: 74, def: 76, phy: 74 },
      { name: 'Raniele', pos: 'CDM', number: 14, age: 28, nat: 'Brasil', ovr: 77, pac: 72, sho: 64, pas: 73, dri: 73, def: 78, phy: 82 },
      { name: 'José Martínez', pos: 'CDM', number: 70, age: 31, nat: 'Venezuela', ovr: 76, pac: 74, sho: 62, pas: 72, dri: 72, def: 77, phy: 80 },
      { name: 'Rodrigo Garro', pos: 'CAM', number: 10, age: 27, nat: 'Argentina', ovr: 81, pac: 78, sho: 79, pas: 84, dri: 82, def: 60, phy: 74 },
      { name: 'Memphis Depay', pos: 'ST', number: 94, age: 31, nat: 'Países Bajos', ovr: 83, pac: 81, sho: 84, pas: 81, dri: 85, def: 38, phy: 80 },
      { name: 'Yuri Alberto', pos: 'ST', number: 9, age: 24, nat: 'Brasil', ovr: 79, pac: 84, sho: 80, pas: 68, dri: 77, def: 44, phy: 78 },
      { name: 'Ángel Romero', pos: 'RW', number: 11, age: 33, nat: 'Paraguay', ovr: 77, pac: 76, sho: 76, pas: 73, dri: 76, def: 55, phy: 74 },
      { name: 'Talles Magno', pos: 'LW', number: 43, age: 23, nat: 'Brasil', ovr: 76, pac: 82, sho: 72, pas: 72, dri: 81, def: 42, phy: 68 }
    ]
  },
  {
    id: 'botafogo',
    name: 'Botafogo FR',
    shortName: 'BOT',
    leagueId: 'brasileirao',
    city: 'Río de Janeiro',
    stadium: 'Estádio Nilton Santos',
    capacity: 44661,
    budget: 50,
    wageBudget: 350,
    primaryColor: '#000000',
    secondaryColor: '#ffffff',
    accentColor: '#888888',
    textColor: '#ffffff',
    kitPattern: 'stripes',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/8517.png',
    rawPlayers: [
      { name: 'John Victor', pos: 'GK', number: 12, age: 29, nat: 'Brasil', ovr: 79, pac: 78, sho: 79, pas: 74, dri: 78, def: 45, phy: 79 },
      { name: 'Alexander Barboza', pos: 'CB', number: 20, age: 30, nat: 'Argentina', ovr: 78, pac: 68, sho: 48, pas: 67, dri: 62, def: 79, phy: 84 },
      { name: 'Bastos Quissanga', pos: 'CB', number: 15, age: 33, nat: 'Angola', ovr: 78, pac: 74, sho: 40, pas: 62, dri: 60, def: 79, phy: 82 },
      { name: 'Alex Telles', pos: 'LB', number: 13, age: 32, nat: 'Brasil', ovr: 79, pac: 78, sho: 74, pas: 81, dri: 78, def: 76, phy: 74 },
      { name: 'Vitinho Mota', pos: 'RB', number: 22, age: 26, nat: 'Brasil', ovr: 76, pac: 82, sho: 58, pas: 72, dri: 75, def: 73, phy: 74 },
      { name: 'Marlon Freitas', pos: 'CDM', number: 17, age: 30, nat: 'Brasil', ovr: 78, pac: 72, sho: 68, pas: 80, dri: 77, def: 76, phy: 78 },
      { name: 'Gregore de Magalhães', pos: 'CDM', number: 5, age: 31, nat: 'Brasil', ovr: 77, pac: 73, sho: 60, pas: 72, dri: 72, def: 78, phy: 83 },
      { name: 'Thiago Almada', pos: 'CAM', number: 23, age: 24, nat: 'Argentina', ovr: 82, pac: 84, sho: 79, pas: 83, dri: 85, def: 52, phy: 68 },
      { name: 'Luiz Henrique', pos: 'RW', number: 7, age: 24, nat: 'Brasil', ovr: 82, pac: 87, sho: 78, pas: 77, dri: 85, def: 46, phy: 78 },
      { name: 'Igor Jesus', pos: 'ST', number: 99, age: 24, nat: 'Brasil', ovr: 79, pac: 83, sho: 80, pas: 68, dri: 77, def: 40, phy: 80 },
      { name: 'Jefferson Savarino', pos: 'LW', number: 10, age: 28, nat: 'Venezuela', ovr: 79, pac: 84, sho: 76, pas: 78, dri: 82, def: 45, phy: 66 },
      { name: 'Tiquinho Soares', pos: 'ST', number: 9, age: 34, nat: 'Brasil', ovr: 78, pac: 72, sho: 81, pas: 73, dri: 75, def: 44, phy: 83 }
    ]
  },
  {
    id: 'fluminense',
    name: 'Fluminense FC',
    shortName: 'FLU',
    leagueId: 'brasileirao',
    city: 'Río de Janeiro',
    stadium: 'Estádio do Maracanã',
    capacity: 78838,
    budget: 40,
    wageBudget: 290,
    primaryColor: '#990000',
    secondaryColor: '#006633',
    accentColor: '#ffffff',
    textColor: '#ffffff',
    kitPattern: 'stripes',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/9867.png',
    rawPlayers: [
      { name: 'Fábio Deivson', pos: 'GK', number: 1, age: 44, nat: 'Brasil', ovr: 78, pac: 72, sho: 78, pas: 74, dri: 75, def: 48, phy: 76 },
      { name: 'Thiago Silva', pos: 'CB', number: 3, age: 40, nat: 'Brasil', ovr: 82, pac: 58, sho: 54, pas: 76, dri: 70, def: 85, phy: 78 },
      { name: 'Thiago Santos', pos: 'CB', number: 29, age: 35, nat: 'Brasil', ovr: 76, pac: 64, sho: 52, pas: 68, dri: 64, def: 77, phy: 80 },
      { name: 'Diogo Barbosa', pos: 'LB', number: 6, age: 33, nat: 'Brasil', ovr: 75, pac: 78, sho: 58, pas: 72, dri: 74, def: 72, phy: 72 },
      { name: 'Samuel Xavier', pos: 'RB', number: 2, age: 35, nat: 'Brasil', ovr: 76, pac: 78, sho: 56, pas: 72, dri: 74, def: 74, phy: 73 },
      { name: 'Facundo Bernal', pos: 'CDM', number: 5, age: 21, nat: 'Uruguay', ovr: 76, pac: 73, sho: 62, pas: 75, dri: 74, def: 76, phy: 77 },
      { name: 'Matheus Martinelli', pos: 'CM', number: 8, age: 23, nat: 'Brasil', ovr: 77, pac: 74, sho: 68, pas: 78, dri: 78, def: 74, phy: 75 },
      { name: 'Ganso', pos: 'CAM', number: 10, age: 35, nat: 'Brasil', ovr: 79, pac: 52, sho: 75, pas: 86, dri: 82, def: 48, phy: 66 },
      { name: 'Jhon Arias', pos: 'RW', number: 21, age: 28, nat: 'Colombia', ovr: 82, pac: 87, sho: 78, pas: 80, dri: 85, def: 60, phy: 74 },
      { name: 'Germán Cano', pos: 'ST', number: 14, age: 37, nat: 'Argentina', ovr: 80, pac: 72, sho: 84, pas: 68, dri: 74, def: 40, phy: 78 },
      { name: 'Keno', pos: 'LW', number: 11, age: 35, nat: 'Brasil', ovr: 76, pac: 82, sho: 73, pas: 72, dri: 81, def: 42, phy: 66 },
      { name: 'Kevin Serna', pos: 'LW', number: 90, age: 27, nat: 'Colombia', ovr: 76, pac: 86, sho: 71, pas: 70, dri: 79, def: 42, phy: 70 }
    ]
  },
  {
    id: 'atletico_mg',
    name: 'Atlético Mineiro',
    shortName: 'CAM',
    leagueId: 'brasileirao',
    city: 'Belo Horizonte',
    stadium: 'Arena MRV',
    capacity: 44892,
    budget: 45,
    wageBudget: 330,
    primaryColor: '#000000',
    secondaryColor: '#ffffff',
    accentColor: '#ffd700',
    textColor: '#ffffff',
    kitPattern: 'stripes',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/10272.png',
    rawPlayers: [
      { name: 'Everson Marques', pos: 'GK', number: 22, age: 34, nat: 'Brasil', ovr: 79, pac: 78, sho: 80, pas: 76, dri: 78, def: 45, phy: 78 },
      { name: 'Junior Alonso', pos: 'CB', number: 8, age: 32, nat: 'Paraguay', ovr: 79, pac: 72, sho: 48, pas: 72, dri: 66, def: 80, phy: 82 },
      { name: 'Rodrigo Battaglia', pos: 'CB', number: 21, age: 33, nat: 'Argentina', ovr: 78, pac: 68, sho: 64, pas: 73, dri: 71, def: 79, phy: 82 },
      { name: 'Guilherme Arana', pos: 'LB', number: 13, age: 28, nat: 'Brasil', ovr: 80, pac: 84, sho: 72, pas: 78, dri: 79, def: 76, phy: 78 },
      { name: 'Renzo Saravia', pos: 'RB', number: 26, age: 32, nat: 'Argentina', ovr: 76, pac: 79, sho: 54, pas: 70, dri: 73, def: 74, phy: 75 },
      { name: 'Otávio Santos', pos: 'CDM', number: 5, age: 31, nat: 'Brasil', ovr: 78, pac: 74, sho: 64, pas: 76, dri: 75, def: 79, phy: 80 },
      { name: 'Fausto Vera', pos: 'CM', number: 18, age: 25, nat: 'Argentina', ovr: 77, pac: 72, sho: 70, pas: 77, dri: 75, def: 76, phy: 79 },
      { name: 'Gustavo Scarpa', pos: 'CAM', number: 6, age: 31, nat: 'Brasil', ovr: 80, pac: 78, sho: 81, pas: 83, dri: 80, def: 58, phy: 72 },
      { name: 'Paulinho Henrique', pos: 'LW', number: 10, age: 24, nat: 'Brasil', ovr: 80, pac: 86, sho: 80, pas: 75, dri: 82, def: 44, phy: 74 },
      { name: 'Hulk Vieira', pos: 'ST', number: 7, age: 39, nat: 'Brasil', ovr: 82, pac: 75, sho: 87, pas: 79, dri: 80, def: 45, phy: 89 },
      { name: 'Deyverson Silva', pos: 'ST', number: 9, age: 34, nat: 'Brasil', ovr: 77, pac: 74, sho: 77, pas: 66, dri: 72, def: 48, phy: 82 },
      { name: 'Bernard Anício', pos: 'LW', number: 11, age: 32, nat: 'Brasil', ovr: 77, pac: 83, sho: 72, pas: 76, dri: 81, def: 42, phy: 60 }
    ]
  },
  {
    id: 'gremio',
    name: 'Grêmio FBPA',
    shortName: 'GRE',
    leagueId: 'brasileirao',
    city: 'Porto Alegre',
    stadium: 'Arena do Grêmio',
    capacity: 55662,
    budget: 40,
    wageBudget: 290,
    primaryColor: '#00adef',
    secondaryColor: '#000000',
    accentColor: '#ffffff',
    textColor: '#ffffff',
    kitPattern: 'stripes',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/5927.png',
    rawPlayers: [
      { name: 'Agustín Marchesín', pos: 'GK', number: 1, age: 37, nat: 'Argentina', ovr: 78, pac: 77, sho: 78, pas: 74, dri: 77, def: 48, phy: 76 },
      { name: 'Walter Kannemann', pos: 'CB', number: 4, age: 34, nat: 'Argentina', ovr: 78, pac: 66, sho: 44, pas: 65, dri: 60, def: 81, phy: 85 },
      { name: 'Rodrigo Ely', pos: 'CB', number: 5, age: 31, nat: 'Brasil', ovr: 76, pac: 68, sho: 42, pas: 64, dri: 61, def: 77, phy: 80 },
      { name: 'Reinaldo Silva', pos: 'LB', number: 6, age: 35, nat: 'Brasil', ovr: 76, pac: 76, sho: 72, pas: 76, dri: 75, def: 73, phy: 77 },
      { name: 'João Pedro Maturano', pos: 'RB', number: 18, age: 28, nat: 'Brasil', ovr: 76, pac: 81, sho: 60, pas: 71, dri: 74, def: 73, phy: 75 },
      { name: 'Mathías Villasanti', pos: 'CDM', number: 20, age: 28, nat: 'Paraguay', ovr: 80, pac: 77, sho: 68, pas: 79, dri: 78, def: 80, phy: 82 },
      { name: 'Dodi', pos: 'CM', number: 17, age: 29, nat: 'Brasil', ovr: 76, pac: 78, sho: 65, pas: 74, dri: 76, def: 74, phy: 76 },
      { name: 'Franco Cristaldo', pos: 'CAM', number: 10, age: 28, nat: 'Argentina', ovr: 79, pac: 75, sho: 78, pas: 82, dri: 81, def: 55, phy: 70 },
      { name: 'Yeferson Soteldo', pos: 'LW', number: 7, age: 28, nat: 'Venezuela', ovr: 79, pac: 88, sho: 74, pas: 77, dri: 86, def: 40, phy: 58 },
      { name: 'Martin Braithwaite', pos: 'ST', number: 22, age: 34, nat: 'Dinamarca', ovr: 79, pac: 80, sho: 80, pas: 74, dri: 79, def: 42, phy: 77 },
      { name: 'Diego Costa', pos: 'ST', number: 19, age: 36, nat: 'España', ovr: 78, pac: 70, sho: 80, pas: 68, dri: 74, def: 45, phy: 85 },
      { name: 'Cristian Pavón', pos: 'RW', number: 21, age: 29, nat: 'Argentina', ovr: 77, pac: 84, sho: 76, pas: 74, dri: 79, def: 48, phy: 74 }
    ]
  },

  // ==================== SCOTTISH PREMIERSHIP (4 Clubes) ====================
  {
    id: 'celtic',
    name: 'Celtic FC',
    shortName: 'CEL',
    leagueId: 'scotland',
    city: 'Glasgow',
    stadium: 'Celtic Park',
    capacity: 60411,
    budget: 55,
    wageBudget: 280,
    primaryColor: '#018749',
    secondaryColor: '#ffffff',
    accentColor: '#ffcc00',
    textColor: '#ffffff',
    kitPattern: 'hoops',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/9999.png',
    rawPlayers: [
      { name: 'Kasper Schmeichel', pos: 'GK', number: 1, age: 38, nat: 'Dinamarca', ovr: 80, pac: 79, sho: 81, pas: 77, dri: 79, def: 48, phy: 78 },
      { name: 'Cameron Carter-Vickers', pos: 'CB', number: 20, age: 27, nat: 'Estados Unidos', ovr: 78, pac: 72, sho: 40, pas: 66, dri: 65, def: 79, phy: 84 },
      { name: 'Liam Scales', pos: 'CB', number: 5, age: 27, nat: 'Irlanda', ovr: 75, pac: 70, sho: 44, pas: 67, dri: 63, def: 76, phy: 78 },
      { name: 'Greg Taylor', pos: 'LB', number: 3, age: 27, nat: 'Escocia', ovr: 76, pac: 78, sho: 58, pas: 74, dri: 74, def: 74, phy: 72 },
      { name: 'Alistair Johnston', pos: 'RB', number: 2, age: 26, nat: 'Canadá', ovr: 78, pac: 82, sho: 56, pas: 73, dri: 74, def: 77, phy: 80 },
      { name: 'Callum McGregor', pos: 'CDM', number: 42, age: 32, nat: 'Escocia', ovr: 80, pac: 74, sho: 75, pas: 82, dri: 80, def: 78, phy: 77 },
      { name: 'Reo Hatate', pos: 'CM', number: 41, age: 27, nat: 'Japón', ovr: 78, pac: 78, sho: 75, pas: 79, dri: 80, def: 72, phy: 76 },
      { name: 'Arne Engels', pos: 'CM', number: 27, age: 21, nat: 'Bélgica', ovr: 77, pac: 76, sho: 74, pas: 78, dri: 77, def: 73, phy: 76 },
      { name: 'Nicolas Kühn', pos: 'RW', number: 10, age: 25, nat: 'Alemania', ovr: 78, pac: 88, sho: 75, pas: 76, dri: 82, def: 45, phy: 68 },
      { name: 'Daizen Maeda', pos: 'LW', number: 38, age: 27, nat: 'Japón', ovr: 78, pac: 93, sho: 74, pas: 70, dri: 77, def: 62, phy: 81 },
      { name: 'Kyogo Furuhashi', pos: 'ST', number: 8, age: 30, nat: 'Japón', ovr: 79, pac: 86, sho: 80, pas: 70, dri: 80, def: 44, phy: 68 },
      { name: 'Adam Idah', pos: 'ST', number: 9, age: 24, nat: 'Irlanda', ovr: 76, pac: 81, sho: 76, pas: 64, dri: 73, def: 38, phy: 82 }
    ]
  },
  {
    id: 'rangers',
    name: 'Rangers FC',
    shortName: 'RAN',
    leagueId: 'scotland',
    city: 'Glasgow',
    stadium: 'Ibrox Stadium',
    capacity: 50817,
    budget: 45,
    wageBudget: 250,
    primaryColor: '#003399',
    secondaryColor: '#ffffff',
    accentColor: '#cc0000',
    textColor: '#ffffff',
    kitPattern: 'plain',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/8548.png',
    rawPlayers: [
      { name: 'Jack Butland', pos: 'GK', number: 1, age: 32, nat: 'Inglaterra', ovr: 79, pac: 78, sho: 80, pas: 73, dri: 78, def: 45, phy: 79 },
      { name: 'Robin Pröpper', pos: 'CB', number: 4, age: 31, nat: 'Países Bajos', ovr: 76, pac: 68, sho: 50, pas: 70, dri: 65, def: 77, phy: 78 },
      { name: 'John Souttar', pos: 'CB', number: 5, age: 28, nat: 'Escocia', ovr: 76, pac: 72, sho: 46, pas: 68, dri: 64, def: 77, phy: 80 },
      { name: 'Jefte', pos: 'LB', number: 3, age: 21, nat: 'Brasil', ovr: 74, pac: 83, sho: 58, pas: 68, dri: 74, def: 71, phy: 73 },
      { name: 'James Tavernier', pos: 'RB', number: 2, age: 33, nat: 'Inglaterra', ovr: 79, pac: 79, sho: 79, pas: 80, dri: 78, def: 74, phy: 78 },
      { name: 'Connor Barron', pos: 'CDM', number: 8, age: 22, nat: 'Escocia', ovr: 75, pac: 76, sho: 67, pas: 75, dri: 75, def: 74, phy: 75 },
      { name: 'Nicolas Raskin', pos: 'CM', number: 43, age: 24, nat: 'Bélgica', ovr: 76, pac: 77, sho: 68, pas: 77, dri: 78, def: 75, phy: 76 },
      { name: 'Nedim Bajrami', pos: 'CAM', number: 14, age: 26, nat: 'Albania', ovr: 77, pac: 78, sho: 76, pas: 78, dri: 80, def: 54, phy: 68 },
      { name: 'Václav Černý', pos: 'RW', number: 18, age: 27, nat: 'República Checa', ovr: 78, pac: 84, sho: 77, pas: 76, dri: 81, def: 45, phy: 66 },
      { name: 'Cyriel Dessers', pos: 'ST', number: 9, age: 30, nat: 'Nigeria', ovr: 76, pac: 78, sho: 77, pas: 66, dri: 74, def: 38, phy: 80 },
      { name: 'Danilo Pereira da Silva', pos: 'ST', number: 99, age: 26, nat: 'Brasil', ovr: 75, pac: 79, sho: 75, pas: 68, dri: 77, def: 40, phy: 72 },
      { name: 'Tom Lawrence', pos: 'CAM', number: 11, age: 31, nat: 'Gales', ovr: 75, pac: 74, sho: 77, pas: 75, dri: 76, def: 50, phy: 70 }
    ]
  },
  {
    id: 'aberdeen',
    name: 'Aberdeen FC',
    shortName: 'ABE',
    leagueId: 'scotland',
    city: 'Aberdeen',
    stadium: 'Pittodrie Stadium',
    capacity: 20866,
    budget: 15,
    wageBudget: 110,
    primaryColor: '#e2001a',
    secondaryColor: '#ffffff',
    accentColor: '#1a1a1a',
    textColor: '#ffffff',
    kitPattern: 'plain',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/8489.png',
    rawPlayers: [
      { name: 'Dimitar Mitov', pos: 'GK', number: 1, age: 28, nat: 'Bulgaria', ovr: 74, pac: 74, sho: 75, pas: 70, dri: 73, def: 42, phy: 74 },
      { name: 'Slobodan Rubežić', pos: 'CB', number: 33, age: 25, nat: 'Montenegro', ovr: 74, pac: 68, sho: 38, pas: 58, dri: 56, def: 75, phy: 83 },
      { name: 'Gavin Molloy', pos: 'CB', number: 4, age: 23, nat: 'Irlanda', ovr: 72, pac: 70, sho: 40, pas: 63, dri: 60, def: 73, phy: 75 },
      { name: 'Jack MacKenzie', pos: 'LB', number: 3, age: 25, nat: 'Escocia', ovr: 73, pac: 78, sho: 54, pas: 68, dri: 70, def: 72, phy: 75 },
      { name: 'Nicky Devlin', pos: 'RB', number: 22, age: 31, nat: 'Escocia', ovr: 74, pac: 77, sho: 56, pas: 68, dri: 71, def: 74, phy: 77 },
      { name: 'Graeme Shinnie', pos: 'CDM', number: 4, age: 34, nat: 'Escocia', ovr: 74, pac: 70, sho: 64, pas: 73, dri: 72, def: 75, phy: 79 },
      { name: 'Ante Palaversa', pos: 'CM', number: 18, age: 25, nat: 'Croacia', ovr: 74, pac: 72, sho: 68, pas: 76, dri: 74, def: 71, phy: 73 },
      { name: 'Leighton Clarkson', pos: 'CAM', number: 10, age: 23, nat: 'Inglaterra', ovr: 74, pac: 74, sho: 70, pas: 77, dri: 75, def: 60, phy: 66 },
      { name: 'Topi Keskinen', pos: 'LW', number: 81, age: 22, nat: 'Finlandia', ovr: 74, pac: 86, sho: 70, pas: 68, dri: 77, def: 42, phy: 68 },
      { name: 'Kevin Nisbet', pos: 'ST', number: 9, age: 28, nat: 'Escocia', ovr: 75, pac: 77, sho: 77, pas: 67, dri: 73, def: 40, phy: 76 },
      { name: 'Ester Sokler', pos: 'ST', number: 19, age: 26, nat: 'Eslovenia', ovr: 72, pac: 79, sho: 72, pas: 60, dri: 70, def: 35, phy: 74 }
    ]
  },
  {
    id: 'hearts',
    name: 'Heart of Midlothian FC',
    shortName: 'HEA',
    leagueId: 'scotland',
    city: 'Edimburgo',
    stadium: 'Tynecastle Park',
    capacity: 19852,
    budget: 15,
    wageBudget: 110,
    primaryColor: '#800000',
    secondaryColor: '#ffffff',
    accentColor: '#c5a059',
    textColor: '#ffffff',
    kitPattern: 'plain',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/9860.png',
    rawPlayers: [
      { name: 'Craig Gordon', pos: 'GK', number: 1, age: 42, nat: 'Escocia', ovr: 75, pac: 72, sho: 76, pas: 70, dri: 74, def: 45, phy: 73 },
      { name: 'Frankie Kent', pos: 'CB', number: 2, age: 29, nat: 'Inglaterra', ovr: 74, pac: 66, sho: 38, pas: 62, dri: 58, def: 76, phy: 80 },
      { name: 'Kye Rowles', pos: 'CB', number: 15, age: 27, nat: 'Australia', ovr: 74, pac: 72, sho: 40, pas: 65, dri: 62, def: 75, phy: 77 },
      { name: 'James Penrice', pos: 'LB', number: 3, age: 26, nat: 'Escocia', ovr: 73, pac: 78, sho: 56, pas: 69, dri: 71, def: 72, phy: 72 },
      { name: 'Daniel Oyegoke', pos: 'RB', number: 4, age: 22, nat: 'Inglaterra', ovr: 72, pac: 80, sho: 50, pas: 66, dri: 70, def: 71, phy: 74 },
      { name: 'Cammy Devlin', pos: 'CDM', number: 14, age: 27, nat: 'Australia', ovr: 74, pac: 76, sho: 60, pas: 72, dri: 73, def: 76, phy: 79 },
      { name: 'Beni Baningime', pos: 'CDM', number: 6, age: 27, nat: 'RD del Congo', ovr: 74, pac: 74, sho: 58, pas: 73, dri: 74, def: 76, phy: 78 },
      { name: 'Blair Spittal', pos: 'CAM', number: 8, age: 29, nat: 'Escocia', ovr: 74, pac: 74, sho: 74, pas: 76, dri: 74, def: 58, phy: 70 },
      { name: 'Kenneth Vargas', pos: 'RW', number: 7, age: 23, nat: 'Costa Rica', ovr: 74, pac: 85, sho: 72, pas: 68, dri: 77, def: 42, phy: 68 },
      { name: 'Lawrence Shankland', pos: 'ST', number: 9, age: 30, nat: 'Escocia', ovr: 78, pac: 74, sho: 81, pas: 72, dri: 75, def: 45, phy: 80 },
      { name: 'Alan Forrest', pos: 'LW', number: 17, age: 29, nat: 'Escocia', ovr: 73, pac: 80, sho: 70, pas: 68, dri: 75, def: 44, phy: 66 }
    ]
  },

  // ==================== JUPILER PRO LEAGUE (4 Clubes) ====================
  {
    id: 'club_brugge',
    name: 'Club Brugge KV',
    shortName: 'CLU',
    leagueId: 'belgium',
    city: 'Brujas',
    stadium: 'Jan Breydel Stadion',
    capacity: 29062,
    budget: 45,
    wageBudget: 270,
    primaryColor: '#003b7a',
    secondaryColor: '#000000',
    accentColor: '#ffffff',
    textColor: '#ffffff',
    kitPattern: 'stripes',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/8342.png',
    rawPlayers: [
      { name: 'Simon Mignolet', pos: 'GK', number: 22, age: 37, nat: 'Bélgica', ovr: 80, pac: 79, sho: 80, pas: 75, dri: 78, def: 46, phy: 78 },
      { name: 'Brandon Mechele', pos: 'CB', number: 44, age: 32, nat: 'Bélgica', ovr: 77, pac: 68, sho: 40, pas: 66, dri: 62, def: 78, phy: 80 },
      { name: 'Joel Ordóñez', pos: 'CB', number: 4, age: 21, nat: 'Ecuador', ovr: 76, pac: 76, sho: 38, pas: 64, dri: 64, def: 77, phy: 79 },
      { name: 'Maxim De Cuyper', pos: 'LB', number: 55, age: 24, nat: 'Bélgica', ovr: 79, pac: 83, sho: 72, pas: 79, dri: 78, def: 76, phy: 76 },
      { name: 'Joaquin Seys', pos: 'RB', number: 65, age: 20, nat: 'Bélgica', ovr: 75, pac: 81, sho: 58, pas: 72, dri: 74, def: 74, phy: 74 },
      { name: 'Raphael Onyedika', pos: 'CDM', number: 15, age: 24, nat: 'Nigeria', ovr: 78, pac: 75, sho: 66, pas: 76, dri: 77, def: 79, phy: 82 },
      { name: 'Ardon Jashari', pos: 'CM', number: 30, age: 23, nat: 'Suiza', ovr: 77, pac: 74, sho: 71, pas: 78, dri: 77, def: 75, phy: 77 },
      { name: 'Hans Vanaken', pos: 'CAM', number: 20, age: 33, nat: 'Bélgica', ovr: 81, pac: 66, sho: 79, pas: 85, dri: 80, def: 70, phy: 80 },
      { name: 'Andreas Skov Olsen', pos: 'RW', number: 7, age: 25, nat: 'Dinamarca', ovr: 80, pac: 84, sho: 80, pas: 78, dri: 82, def: 48, phy: 75 },
      { name: 'Christos Tzolis', pos: 'LW', number: 8, age: 23, nat: 'Grecia', ovr: 78, pac: 85, sho: 78, pas: 75, dri: 81, def: 42, phy: 70 },
      { name: 'Ferran Jutglà', pos: 'ST', number: 9, age: 26, nat: 'España', ovr: 77, pac: 80, sho: 78, pas: 71, dri: 78, def: 42, phy: 73 },
      { name: 'Gustaf Nilsson', pos: 'ST', number: 19, age: 28, nat: 'Suecia', ovr: 76, pac: 73, sho: 77, pas: 65, dri: 70, def: 40, phy: 84 }
    ]
  },
  {
    id: 'anderlecht',
    name: 'RSC Anderlecht',
    shortName: 'AND',
    leagueId: 'belgium',
    city: 'Bruselas',
    stadium: 'Lotto Park',
    capacity: 21500,
    budget: 35,
    wageBudget: 220,
    primaryColor: '#492f92',
    secondaryColor: '#ffffff',
    accentColor: '#1a1a1a',
    textColor: '#ffffff',
    kitPattern: 'plain',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/8600.png',
    rawPlayers: [
      { name: 'Colin Coosemans', pos: 'GK', number: 26, age: 33, nat: 'Bélgica', ovr: 75, pac: 74, sho: 76, pas: 70, dri: 74, def: 45, phy: 75 },
      { name: 'Jan Vertonghen', pos: 'CB', number: 14, age: 38, nat: 'Bélgica', ovr: 79, pac: 60, sho: 64, pas: 76, dri: 70, def: 82, phy: 78 },
      { name: 'Mathias Jørgensen', pos: 'CB', number: 25, age: 35, nat: 'Dinamarca', ovr: 75, pac: 66, sho: 42, pas: 65, dri: 62, def: 76, phy: 80 },
      { name: 'Moussa N Diaye', pos: 'LB', number: 5, age: 23, nat: 'Senegal', ovr: 74, pac: 82, sho: 52, pas: 68, dri: 73, def: 72, phy: 73 },
      { name: 'Killian Sardella', pos: 'RB', number: 54, age: 23, nat: 'Bélgica', ovr: 76, pac: 80, sho: 56, pas: 72, dri: 75, def: 75, phy: 74 },
      { name: 'Leander Dendoncker', pos: 'CDM', number: 32, age: 30, nat: 'Bélgica', ovr: 78, pac: 70, sho: 68, pas: 76, dri: 73, def: 79, phy: 83 },
      { name: 'Mats Rits', pos: 'CM', number: 23, age: 32, nat: 'Bélgica', ovr: 75, pac: 70, sho: 70, pas: 76, dri: 74, def: 74, phy: 76 },
      { name: 'Yari Verschaeren', pos: 'CAM', number: 10, age: 24, nat: 'Bélgica', ovr: 76, pac: 78, sho: 72, pas: 78, dri: 81, def: 55, phy: 64 },
      { name: 'Thorgan Hazard', pos: 'LW', number: 11, age: 32, nat: 'Bélgica', ovr: 78, pac: 78, sho: 77, pas: 80, dri: 81, def: 54, phy: 68 },
      { name: 'Anders Dreyer', pos: 'RW', number: 36, age: 27, nat: 'Dinamarca', ovr: 79, pac: 81, sho: 80, pas: 78, dri: 80, def: 52, phy: 72 },
      { name: 'Kasper Dolberg', pos: 'ST', number: 12, age: 27, nat: 'Dinamarca', ovr: 79, pac: 79, sho: 81, pas: 72, dri: 79, def: 40, phy: 77 },
      { name: 'Mario Stroeykens', pos: 'CAM', number: 29, age: 21, nat: 'Bélgica', ovr: 75, pac: 77, sho: 73, pas: 74, dri: 78, def: 50, phy: 74 }
    ]
  },
  {
    id: 'krc_genk',
    name: 'KRC Genk',
    shortName: 'GNK',
    leagueId: 'belgium',
    city: 'Genk',
    stadium: 'Cegeka Arena',
    capacity: 23718,
    budget: 30,
    wageBudget: 190,
    primaryColor: '#004b9b',
    secondaryColor: '#ffffff',
    accentColor: '#1a1a1a',
    textColor: '#ffffff',
    kitPattern: 'plain',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/9987.png',
    rawPlayers: [
      { name: 'Hendrik Van Crombrugge', pos: 'GK', number: 1, age: 32, nat: 'Bélgica', ovr: 75, pac: 74, sho: 76, pas: 72, dri: 74, def: 44, phy: 74 },
      { name: 'Mujaid Sadick', pos: 'CB', number: 46, age: 25, nat: 'España', ovr: 76, pac: 75, sho: 40, pas: 65, dri: 64, def: 77, phy: 80 },
      { name: 'Matte Smets', pos: 'CB', number: 6, age: 21, nat: 'Bélgica', ovr: 76, pac: 74, sho: 45, pas: 72, dri: 68, def: 77, phy: 76 },
      { name: 'Joris Kayembe', pos: 'LB', number: 18, age: 31, nat: 'RD del Congo', ovr: 75, pac: 80, sho: 64, pas: 72, dri: 76, def: 72, phy: 75 },
      { name: 'Zakaria El Ouahdi', pos: 'RB', number: 77, age: 23, nat: 'Marruecos', ovr: 77, pac: 84, sho: 62, pas: 73, dri: 78, def: 74, phy: 74 },
      { name: 'Ibrahima Bangoura', pos: 'CDM', number: 24, age: 21, nat: 'Guinea', ovr: 75, pac: 76, sho: 62, pas: 73, dri: 74, def: 76, phy: 78 },
      { name: 'Bryan Heynen', pos: 'CM', number: 8, age: 28, nat: 'Bélgica', ovr: 78, pac: 73, sho: 74, pas: 80, dri: 77, def: 75, phy: 78 },
      { name: 'Patrik Hrošovský', pos: 'CM', number: 17, age: 33, nat: 'Eslovaquia', ovr: 77, pac: 71, sho: 72, pas: 80, dri: 76, def: 74, phy: 74 },
      { name: 'Jarne Steuckers', pos: 'CAM', number: 21, age: 23, nat: 'Bélgica', ovr: 76, pac: 78, sho: 73, pas: 78, dri: 80, def: 52, phy: 68 },
      { name: 'Tolu Arokodare', pos: 'ST', number: 99, age: 24, nat: 'Nigeria', ovr: 78, pac: 81, sho: 79, pas: 64, dri: 74, def: 38, phy: 85 },
      { name: 'Christopher Bonsu Baah', pos: 'RW', number: 90, age: 20, nat: 'Ghana', ovr: 75, pac: 86, sho: 70, pas: 70, dri: 80, def: 42, phy: 68 },
      { name: 'Yira Sor', pos: 'LW', number: 14, age: 25, nat: 'Nigeria', ovr: 75, pac: 92, sho: 72, pas: 65, dri: 78, def: 38, phy: 73 }
    ]
  },
  {
    id: 'union_sg',
    name: 'Royale Union SG',
    shortName: 'USG',
    leagueId: 'belgium',
    city: 'Bruselas',
    stadium: 'Stade Joseph Marien',
    capacity: 9400,
    budget: 25,
    wageBudget: 170,
    primaryColor: '#ffdd00',
    secondaryColor: '#003399',
    accentColor: '#ffffff',
    textColor: '#003399',
    kitPattern: 'stripes',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/8354.png',
    rawPlayers: [
      { name: 'Anthony Moris', pos: 'GK', number: 49, age: 35, nat: 'Luxemburgo', ovr: 76, pac: 74, sho: 77, pas: 72, dri: 75, def: 45, phy: 75 },
      { name: 'Christian Burgess', pos: 'CB', number: 16, age: 33, nat: 'Inglaterra', ovr: 76, pac: 64, sho: 42, pas: 66, dri: 62, def: 78, phy: 83 },
      { name: 'Koki Machida', pos: 'CB', number: 28, age: 28, nat: 'Japón', ovr: 77, pac: 74, sho: 45, pas: 68, dri: 66, def: 78, phy: 80 },
      { name: 'Kevin Mac Allister', pos: 'CB', number: 5, age: 27, nat: 'Argentina', ovr: 77, pac: 76, sho: 52, pas: 70, dri: 70, def: 78, phy: 79 },
      { name: 'Alessio Castro-Montes', pos: 'RWB', number: 21, age: 28, nat: 'Bélgica', ovr: 76, pac: 80, sho: 68, pas: 74, dri: 76, def: 74, phy: 75 },
      { name: 'Ousseynou Niang', pos: 'LWB', number: 27, age: 23, nat: 'Senegal', ovr: 75, pac: 84, sho: 64, pas: 71, dri: 77, def: 71, phy: 74 },
      { name: 'Charles Vanhoutte', pos: 'CDM', number: 24, age: 26, nat: 'Bélgica', ovr: 77, pac: 73, sho: 65, pas: 76, dri: 75, def: 78, phy: 79 },
      { name: 'Mathias Rasmussen', pos: 'CM', number: 23, age: 27, nat: 'Noruega', ovr: 75, pac: 75, sho: 70, pas: 76, dri: 76, def: 72, phy: 74 },
      { name: 'Anan Khalaili', pos: 'RW', number: 25, age: 21, nat: 'Israel', ovr: 75, pac: 85, sho: 73, pas: 71, dri: 78, def: 48, phy: 70 },
      { name: 'Promise David', pos: 'ST', number: 12, age: 24, nat: 'Canadá', ovr: 76, pac: 82, sho: 77, pas: 62, dri: 72, def: 38, phy: 82 },
      { name: 'Franjo Ivanović', pos: 'ST', number: 17, age: 22, nat: 'Croacia', ovr: 76, pac: 79, sho: 77, pas: 68, dri: 77, def: 42, phy: 74 },
      { name: 'Sofiane Boufal', pos: 'LW', number: 7, age: 31, nat: 'Marruecos', ovr: 77, pac: 80, sho: 74, pas: 78, dri: 85, def: 40, phy: 62 }
    ]
  },

  // ==================== ARGENTINA EXPANSION (+4 Clubes) ====================
  {
    id: 'racing_club',
    name: 'Racing Club',
    shortName: 'RAC',
    leagueId: 'argentina',
    city: 'Avellaneda',
    stadium: 'Estadio Presidente Perón',
    capacity: 51389,
    budget: 30,
    wageBudget: 220,
    primaryColor: '#75aadb',
    secondaryColor: '#ffffff',
    accentColor: '#1a1a1a',
    textColor: '#ffffff',
    kitPattern: 'stripes',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/10078.png',
    rawPlayers: [
      { name: 'Gabriel Arias', pos: 'GK', number: 21, age: 37, nat: 'Chile', ovr: 79, pac: 77, sho: 79, pas: 74, dri: 78, def: 48, phy: 78 },
      { name: 'Marco Di Cesare', pos: 'CB', number: 3, age: 23, nat: 'Argentina', ovr: 76, pac: 73, sho: 38, pas: 65, dri: 63, def: 77, phy: 79 },
      { name: 'Santiago Sosa', pos: 'CB', number: 13, age: 26, nat: 'Argentina', ovr: 78, pac: 72, sho: 58, pas: 76, dri: 72, def: 79, phy: 80 },
      { name: 'Gabriel Rojas', pos: 'LB', number: 27, age: 28, nat: 'Argentina', ovr: 76, pac: 79, sho: 60, pas: 73, dri: 75, def: 73, phy: 74 },
      { name: 'Gastón Martirena', pos: 'RB', number: 15, age: 25, nat: 'Uruguay', ovr: 77, pac: 83, sho: 72, pas: 74, dri: 76, def: 74, phy: 76 },
      { name: 'Juan Nardoni', pos: 'CM', number: 5, age: 23, nat: 'Argentina', ovr: 77, pac: 78, sho: 68, pas: 76, dri: 77, def: 76, phy: 79 },
      { name: 'Agustín Almendra', pos: 'CM', number: 32, age: 25, nat: 'Argentina', ovr: 76, pac: 74, sho: 74, pas: 78, dri: 77, def: 72, phy: 75 },
      { name: 'Juan Fernando Quintero', pos: 'CAM', number: 8, age: 32, nat: 'Colombia', ovr: 80, pac: 68, sho: 81, pas: 86, dri: 83, def: 45, phy: 64 },
      { name: 'Maximiliano Salas', pos: 'LW', number: 7, age: 27, nat: 'Argentina', ovr: 76, pac: 82, sho: 75, pas: 70, dri: 76, def: 52, phy: 81 },
      { name: 'Adrián Martínez', pos: 'ST', number: 9, age: 33, nat: 'Argentina', ovr: 80, pac: 78, sho: 83, pas: 68, dri: 74, def: 44, phy: 82 },
      { name: 'Roger Martínez', pos: 'ST', number: 10, age: 31, nat: 'Colombia', ovr: 78, pac: 77, sho: 80, pas: 73, dri: 79, def: 42, phy: 79 }
    ]
  },
  {
    id: 'independiente',
    name: 'CA Independiente',
    shortName: 'IND',
    leagueId: 'argentina',
    city: 'Avellaneda',
    stadium: 'Estadio Libertadores de América',
    capacity: 48069,
    budget: 25,
    wageBudget: 190,
    primaryColor: '#e30613',
    secondaryColor: '#ffffff',
    accentColor: '#000000',
    textColor: '#ffffff',
    kitPattern: 'plain',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/10076.png',
    rawPlayers: [
      { name: 'Rodrigo Rey', pos: 'GK', number: 33, age: 34, nat: 'Argentina', ovr: 78, pac: 76, sho: 79, pas: 74, dri: 77, def: 46, phy: 77 },
      { name: 'Kevin Lomónaco', pos: 'CB', number: 26, age: 23, nat: 'Argentina', ovr: 77, pac: 74, sho: 45, pas: 70, dri: 68, def: 78, phy: 79 },
      { name: 'Joaquín Laso', pos: 'CB', number: 2, age: 35, nat: 'Argentina', ovr: 74, pac: 62, sho: 40, pas: 64, dri: 58, def: 76, phy: 80 },
      { name: 'Damián Pérez', pos: 'LB', number: 3, age: 36, nat: 'Argentina', ovr: 74, pac: 74, sho: 56, pas: 70, dri: 71, def: 73, phy: 72 },
      { name: 'Felipe Loyola', pos: 'RB', number: 4, age: 24, nat: 'Chile', ovr: 76, pac: 79, sho: 65, pas: 73, dri: 74, def: 76, phy: 78 },
      { name: 'Iván Marcone', pos: 'CDM', number: 23, age: 35, nat: 'Argentina', ovr: 76, pac: 62, sho: 60, pas: 75, dri: 72, def: 78, phy: 80 },
      { name: 'Federico Mancuello', pos: 'CM', number: 11, age: 36, nat: 'Argentina', ovr: 75, pac: 66, sho: 76, pas: 79, dri: 74, def: 68, phy: 72 },
      { name: 'Lucas González', pos: 'CM', number: 17, age: 25, nat: 'Argentina', ovr: 75, pac: 75, sho: 71, pas: 75, dri: 76, def: 72, phy: 74 },
      { name: 'Santiago Montiel', pos: 'LW', number: 44, age: 24, nat: 'Argentina', ovr: 76, pac: 83, sho: 72, pas: 74, dri: 78, def: 62, phy: 70 },
      { name: 'Gabriel Ávalos', pos: 'ST', number: 9, age: 34, nat: 'Paraguay', ovr: 77, pac: 72, sho: 79, pas: 66, dri: 72, def: 44, phy: 84 },
      { name: 'Matías Giménez Rojas', pos: 'ST', number: 34, age: 26, nat: 'Argentina', ovr: 74, pac: 76, sho: 75, pas: 64, dri: 73, def: 38, phy: 76 }
    ]
  },
  {
    id: 'san_lorenzo',
    name: 'CA San Lorenzo',
    shortName: 'SLO',
    leagueId: 'argentina',
    city: 'Buenos Aires',
    stadium: 'Estadio Pedro Bidegain',
    capacity: 47964,
    budget: 20,
    wageBudget: 170,
    primaryColor: '#002f6c',
    secondaryColor: '#c3281e',
    accentColor: '#ffffff',
    textColor: '#ffffff',
    kitPattern: 'stripes',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/10080.png',
    rawPlayers: [
      { name: 'Gastón Gómez', pos: 'GK', number: 25, age: 29, nat: 'Argentina', ovr: 75, pac: 74, sho: 76, pas: 70, dri: 74, def: 44, phy: 76 },
      { name: 'Jhohan Romaña', pos: 'CB', number: 4, age: 26, nat: 'Colombia', ovr: 77, pac: 76, sho: 36, pas: 62, dri: 60, def: 78, phy: 85 },
      { name: 'Gastón Campi', pos: 'CB', number: 22, age: 34, nat: 'Argentina', ovr: 75, pac: 62, sho: 48, pas: 68, dri: 61, def: 76, phy: 80 },
      { name: 'Malcom Braida', pos: 'LB', number: 21, age: 28, nat: 'Argentina', ovr: 76, pac: 80, sho: 68, pas: 74, dri: 77, def: 74, phy: 77 },
      { name: 'Gonzalo Luján', pos: 'RB', number: 35, age: 24, nat: 'Argentina', ovr: 74, pac: 76, sho: 48, pas: 68, dri: 68, def: 75, phy: 76 },
      { name: 'Eric Remedi', pos: 'CDM', number: 5, age: 30, nat: 'Argentina', ovr: 76, pac: 73, sho: 62, pas: 74, dri: 74, def: 78, phy: 79 },
      { name: 'Elián Irala', pos: 'CM', number: 17, age: 21, nat: 'Argentina', ovr: 75, pac: 76, sho: 66, pas: 75, dri: 76, def: 74, phy: 76 },
      { name: 'Iker Muniain', pos: 'CAM', number: 80, age: 32, nat: 'España', ovr: 79, pac: 75, sho: 76, pas: 82, dri: 83, def: 54, phy: 64 },
      { name: 'Ezequiel Cerutti', pos: 'RW', number: 7, age: 33, nat: 'Argentina', ovr: 74, pac: 81, sho: 70, pas: 72, dri: 76, def: 48, phy: 68 },
      { name: 'Nahuel Bustos', pos: 'ST', number: 77, age: 27, nat: 'Argentina', ovr: 76, pac: 80, sho: 78, pas: 70, dri: 78, def: 38, phy: 73 },
      { name: 'Alexis Cuello', pos: 'ST', number: 28, age: 25, nat: 'Argentina', ovr: 75, pac: 82, sho: 75, pas: 67, dri: 76, def: 42, phy: 74 }
    ]
  },
  {
    id: 'velez',
    name: 'Vélez Sarsfield',
    shortName: 'VEL',
    leagueId: 'argentina',
    city: 'Buenos Aires',
    stadium: 'Estadio José Amalfitani',
    capacity: 49540,
    budget: 22,
    wageBudget: 170,
    primaryColor: '#003399',
    secondaryColor: '#ffffff',
    accentColor: '#1a1a1a',
    textColor: '#ffffff',
    kitPattern: 'plain',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/10083.png',
    rawPlayers: [
      { name: 'Tomás Marchiori', pos: 'GK', number: 1, age: 30, nat: 'Argentina', ovr: 78, pac: 77, sho: 79, pas: 75, dri: 78, def: 48, phy: 77 },
      { name: 'Valentín Gómez', pos: 'CB', number: 31, age: 22, nat: 'Argentina', ovr: 78, pac: 76, sho: 42, pas: 72, dri: 68, def: 79, phy: 80 },
      { name: 'Emanuel Mammana', pos: 'CB', number: 2, age: 29, nat: 'Argentina', ovr: 76, pac: 70, sho: 46, pas: 70, dri: 67, def: 77, phy: 76 },
      { name: 'Elías Gómez', pos: 'LB', number: 3, age: 31, nat: 'Argentina', ovr: 75, pac: 78, sho: 64, pas: 73, dri: 74, def: 73, phy: 74 },
      { name: 'Agustín Bouzat', pos: 'CDM', number: 26, age: 31, nat: 'Argentina', ovr: 76, pac: 75, sho: 68, pas: 76, dri: 76, def: 75, phy: 76 },
      { name: 'Christian Ordóñez', pos: 'CM', number: 32, age: 21, nat: 'Argentina', ovr: 76, pac: 76, sho: 67, pas: 76, dri: 77, def: 74, phy: 77 },
      { name: 'Claudio Aquino', pos: 'CAM', number: 22, age: 34, nat: 'Argentina', ovr: 80, pac: 74, sho: 81, pas: 84, dri: 81, def: 50, phy: 68 },
      { name: 'Francisco Pizzini', pos: 'RW', number: 20, age: 31, nat: 'Argentina', ovr: 76, pac: 83, sho: 74, pas: 73, dri: 77, def: 52, phy: 72 },
      { name: 'Thiago Fernández', pos: 'LW', number: 27, age: 21, nat: 'Argentina', ovr: 76, pac: 84, sho: 74, pas: 73, dri: 80, def: 44, phy: 68 },
      { name: 'Braian Romero', pos: 'ST', number: 9, age: 34, nat: 'Argentina', ovr: 79, pac: 80, sho: 81, pas: 68, dri: 76, def: 48, phy: 79 },
      { name: 'Michael Santos', pos: 'ST', number: 7, age: 32, nat: 'Uruguay', ovr: 76, pac: 78, sho: 77, pas: 68, dri: 75, def: 40, phy: 75 }
    ]
  },

  // ==================== SAUDI PRO LEAGUE (+2 Clubes) ====================
  {
    id: 'al_qadsiah',
    name: 'Al-Qadsiah FC',
    shortName: 'QAD',
    leagueId: 'saudi',
    city: 'Khobar',
    stadium: 'Prince Saud bin Jalawi Stadium',
    capacity: 15000,
    budget: 80,
    wageBudget: 600,
    primaryColor: '#c3281e',
    secondaryColor: '#ffd700',
    accentColor: '#ffffff',
    textColor: '#ffffff',
    kitPattern: 'plain',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/101919.png',
    rawPlayers: [
      { name: 'Koen Casteels', pos: 'GK', number: 1, age: 33, nat: 'Bélgica', ovr: 82, pac: 81, sho: 83, pas: 78, dri: 81, def: 46, phy: 80 },
      { name: 'Nacho Fernández', pos: 'CB', number: 6, age: 35, nat: 'España', ovr: 81, pac: 75, sho: 50, pas: 72, dri: 68, def: 82, phy: 80 },
      { name: 'Jeison Murillo', pos: 'CB', number: 24, age: 33, nat: 'Colombia', ovr: 77, pac: 72, sho: 40, pas: 65, dri: 64, def: 78, phy: 80 },
      { name: 'Gastón Álvarez', pos: 'LB', number: 5, age: 25, nat: 'Uruguay', ovr: 77, pac: 78, sho: 55, pas: 70, dri: 71, def: 77, phy: 79 },
      { name: 'Mohammed Abu Al-Shamat', pos: 'RB', number: 2, age: 23, nat: 'Arabia Saudí', ovr: 74, pac: 80, sho: 52, pas: 68, dri: 72, def: 73, phy: 74 },
      { name: 'Nahitan Nández', pos: 'CM', number: 8, age: 29, nat: 'Uruguay', ovr: 79, pac: 81, sho: 70, pas: 76, dri: 78, def: 79, phy: 84 },
      { name: 'Ezequiel Fernández', pos: 'CM', number: 25, age: 23, nat: 'Argentina', ovr: 79, pac: 76, sho: 68, pas: 81, dri: 80, def: 77, phy: 78 },
      { name: 'Cameron Puertas', pos: 'CAM', number: 10, age: 27, nat: 'España', ovr: 80, pac: 77, sho: 79, pas: 83, dri: 81, def: 68, phy: 77 },
      { name: 'Julián Quiñones', pos: 'RW', number: 33, age: 28, nat: 'México', ovr: 79, pac: 86, sho: 80, pas: 74, dri: 80, def: 45, phy: 79 },
      { name: 'Pierre-Emerick Aubameyang', pos: 'ST', number: 9, age: 36, nat: 'Gabón', ovr: 82, pac: 85, sho: 84, pas: 74, dri: 80, def: 38, phy: 72 },
      { name: 'Turki Al-Ammar', pos: 'LW', number: 11, age: 25, nat: 'Arabia Saudí', ovr: 74, pac: 82, sho: 72, pas: 72, dri: 76, def: 45, phy: 68 }
    ]
  },
  {
    id: 'al_ettifaq',
    name: 'Al-Ettifaq FC',
    shortName: 'ETT',
    leagueId: 'saudi',
    city: 'Dammam',
    stadium: 'Al-Ettifaq Club Stadium',
    capacity: 15000,
    budget: 60,
    wageBudget: 450,
    primaryColor: '#006633',
    secondaryColor: '#c3281e',
    accentColor: '#ffffff',
    textColor: '#ffffff',
    kitPattern: 'plain',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/101897.png',
    rawPlayers: [
      { name: 'Marek Rodák', pos: 'GK', number: 1, age: 28, nat: 'Eslovaquia', ovr: 77, pac: 76, sho: 78, pas: 72, dri: 76, def: 44, phy: 76 },
      { name: 'Jack Hendry', pos: 'CB', number: 4, age: 30, nat: 'Escocia', ovr: 76, pac: 72, sho: 44, pas: 66, dri: 64, def: 77, phy: 81 },
      { name: 'Abdullah Madu', pos: 'CB', number: 3, age: 32, nat: 'Arabia Saudí', ovr: 74, pac: 66, sho: 36, pas: 60, dri: 58, def: 75, phy: 78 },
      { name: 'Radhi Al-Otaibi', pos: 'RB', number: 29, age: 25, nat: 'Arabia Saudí', ovr: 74, pac: 80, sho: 54, pas: 68, dri: 72, def: 72, phy: 74 },
      { name: 'Madallah Al-Olayan', pos: 'LB', number: 33, age: 30, nat: 'Arabia Saudí', ovr: 74, pac: 78, sho: 52, pas: 68, dri: 71, def: 73, phy: 74 },
      { name: 'Seko Fofana', pos: 'CM', number: 8, age: 30, nat: 'Costa de Marfil', ovr: 79, pac: 78, sho: 77, pas: 78, dri: 81, def: 77, phy: 84 },
      { name: 'Georginio Wijnaldum', pos: 'CM', number: 18, age: 34, nat: 'Países Bajos', ovr: 80, pac: 74, sho: 77, pas: 79, dri: 82, def: 75, phy: 78 },
      { name: 'Álvaro Medrán', pos: 'CAM', number: 10, age: 31, nat: 'España', ovr: 77, pac: 72, sho: 76, pas: 81, dri: 78, def: 64, phy: 70 },
      { name: 'Demarai Gray', pos: 'RW', number: 7, age: 29, nat: 'Jamaica', ovr: 77, pac: 87, sho: 74, pas: 73, dri: 81, def: 42, phy: 66 },
      { name: 'Karl Toko Ekambi', pos: 'LW', number: 17, age: 32, nat: 'Camerún', ovr: 78, pac: 83, sho: 79, pas: 74, dri: 79, def: 45, phy: 76 },
      { name: 'Moussa Dembélé', pos: 'ST', number: 9, age: 29, nat: 'Francia', ovr: 79, pac: 79, sho: 81, pas: 68, dri: 77, def: 42, phy: 82 }
    ]
  },

  // ==================== EFL CHAMPIONSHIP (+4 Clubes) ====================
  {
    id: 'burnley',
    name: 'Burnley FC',
    shortName: 'BUR',
    leagueId: 'championship',
    city: 'Burnley',
    stadium: 'Turf Moor',
    capacity: 21944,
    budget: 40,
    wageBudget: 280,
    primaryColor: '#6c1d45',
    secondaryColor: '#99d6ea',
    accentColor: '#ffffff',
    textColor: '#ffffff',
    kitPattern: 'plain',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/8191.png',
    rawPlayers: [
      { name: 'James Trafford', pos: 'GK', number: 1, age: 23, nat: 'Inglaterra', ovr: 78, pac: 78, sho: 79, pas: 75, dri: 77, def: 46, phy: 76 },
      { name: 'Maxime Estève', pos: 'CB', number: 5, age: 23, nat: 'Francia', ovr: 77, pac: 74, sho: 40, pas: 68, dri: 65, def: 78, phy: 82 },
      { name: 'CJ Egan-Riley', pos: 'CB', number: 6, age: 22, nat: 'Inglaterra', ovr: 74, pac: 73, sho: 42, pas: 67, dri: 66, def: 75, phy: 76 },
      { name: 'Lucas Pires', pos: 'LB', number: 23, age: 24, nat: 'Brasil', ovr: 75, pac: 82, sho: 60, pas: 72, dri: 75, def: 73, phy: 73 },
      { name: 'Connor Roberts', pos: 'RB', number: 14, age: 29, nat: 'Gales', ovr: 76, pac: 78, sho: 64, pas: 73, dri: 74, def: 75, phy: 76 },
      { name: 'Josh Brownhill', pos: 'CM', number: 8, age: 29, nat: 'Inglaterra', ovr: 78, pac: 74, sho: 76, pas: 80, dri: 77, def: 76, phy: 77 },
      { name: 'Josh Cullen', pos: 'CDM', number: 24, age: 29, nat: 'Irlanda', ovr: 76, pac: 72, sho: 64, pas: 78, dri: 75, def: 77, phy: 76 },
      { name: 'Hannibal Mejbri', pos: 'CAM', number: 28, age: 22, nat: 'Túnez', ovr: 76, pac: 77, sho: 71, pas: 77, dri: 79, def: 65, phy: 75 },
      { name: 'Luca Koleosho', pos: 'RW', number: 30, age: 20, nat: 'Italia', ovr: 76, pac: 91, sho: 68, pas: 70, dri: 82, def: 40, phy: 64 },
      { name: 'Jaidon Anthony', pos: 'LW', number: 11, age: 25, nat: 'Inglaterra', ovr: 75, pac: 84, sho: 72, pas: 73, dri: 78, def: 48, phy: 68 },
      { name: 'Lyle Foster', pos: 'ST', number: 17, age: 25, nat: 'Sudáfrica', ovr: 76, pac: 82, sho: 77, pas: 66, dri: 76, def: 38, phy: 79 }
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
    budget: 35,
    wageBudget: 250,
    primaryColor: '#ee2737',
    secondaryColor: '#ffffff',
    accentColor: '#000000',
    textColor: '#ffffff',
    kitPattern: 'stripes',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/8657.png',
    rawPlayers: [
      { name: 'Michael Cooper', pos: 'GK', number: 1, age: 26, nat: 'Inglaterra', ovr: 76, pac: 75, sho: 77, pas: 73, dri: 76, def: 44, phy: 76 },
      { name: 'Anel Ahmedhodžić', pos: 'CB', number: 15, age: 26, nat: 'Bosnia', ovr: 78, pac: 75, sho: 55, pas: 70, dri: 68, def: 79, phy: 82 },
      { name: 'Harry Souttar', pos: 'CB', number: 5, age: 26, nat: 'Australia', ovr: 76, pac: 64, sho: 40, pas: 64, dri: 58, def: 78, phy: 86 },
      { name: 'Harrison Burrows', pos: 'LB', number: 14, age: 23, nat: 'Inglaterra', ovr: 75, pac: 80, sho: 68, pas: 76, dri: 75, def: 73, phy: 74 },
      { name: 'Alfie Gilchrist', pos: 'RB', number: 2, age: 21, nat: 'Inglaterra', ovr: 75, pac: 78, sho: 45, pas: 68, dri: 70, def: 76, phy: 77 },
      { name: 'Vinicius Souza', pos: 'CDM', number: 21, age: 26, nat: 'Brasil', ovr: 77, pac: 72, sho: 62, pas: 74, dri: 73, def: 79, phy: 84 },
      { name: 'Oliver Arblaster', pos: 'CM', number: 4, age: 21, nat: 'Inglaterra', ovr: 76, pac: 75, sho: 70, pas: 78, dri: 77, def: 74, phy: 75 },
      { name: 'Gustavo Hamer', pos: 'CM', number: 8, age: 28, nat: 'Países Bajos', ovr: 79, pac: 77, sho: 78, pas: 82, dri: 80, def: 76, phy: 79 },
      { name: 'Callum O Hare', pos: 'CAM', number: 10, age: 27, nat: 'Inglaterra', ovr: 77, pac: 81, sho: 74, pas: 78, dri: 81, def: 58, phy: 70 },
      { name: 'Jesurun Rak-Sakyi', pos: 'RW', number: 7, age: 22, nat: 'Inglaterra', ovr: 75, pac: 86, sho: 72, pas: 72, dri: 80, def: 42, phy: 66 },
      { name: 'Kieffer Moore', pos: 'ST', number: 9, age: 33, nat: 'Gales', ovr: 76, pac: 68, sho: 78, pas: 64, dri: 68, def: 45, phy: 87 }
    ]
  },
  {
    id: 'middlesbrough',
    name: 'Middlesbrough FC',
    shortName: 'MID',
    leagueId: 'championship',
    city: 'Middlesbrough',
    stadium: 'Riverside Stadium',
    capacity: 34742,
    budget: 25,
    wageBudget: 190,
    primaryColor: '#e00000',
    secondaryColor: '#ffffff',
    accentColor: '#1a1a1a',
    textColor: '#ffffff',
    kitPattern: 'plain',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/8658.png',
    rawPlayers: [
      { name: 'Seny Dieng', pos: 'GK', number: 1, age: 30, nat: 'Senegal', ovr: 75, pac: 74, sho: 76, pas: 72, dri: 74, def: 45, phy: 75 },
      { name: 'Rav van den Berg', pos: 'CB', number: 3, age: 21, nat: 'Países Bajos', ovr: 76, pac: 74, sho: 40, pas: 68, dri: 66, def: 77, phy: 78 },
      { name: 'Matt Clarke', pos: 'CB', number: 5, age: 28, nat: 'Inglaterra', ovr: 75, pac: 66, sho: 44, pas: 64, dri: 60, def: 76, phy: 82 },
      { name: 'Neto Borges', pos: 'LB', number: 24, age: 29, nat: 'Brasil', ovr: 74, pac: 78, sho: 58, pas: 70, dri: 73, def: 73, phy: 76 },
      { name: 'Luke Ayling', pos: 'RB', number: 2, age: 34, nat: 'Inglaterra', ovr: 75, pac: 74, sho: 60, pas: 72, dri: 73, def: 75, phy: 76 },
      { name: 'Hayden Hackney', pos: 'CM', number: 7, age: 23, nat: 'Inglaterra', ovr: 76, pac: 77, sho: 72, pas: 79, dri: 78, def: 74, phy: 75 },
      { name: 'Aidan Morris', pos: 'CM', number: 8, age: 23, nat: 'Estados Unidos', ovr: 75, pac: 75, sho: 68, pas: 76, dri: 76, def: 76, phy: 78 },
      { name: 'Finn Azaz', pos: 'CAM', number: 20, age: 24, nat: 'Irlanda', ovr: 76, pac: 76, sho: 76, pas: 78, dri: 79, def: 54, phy: 72 },
      { name: 'Isaiah Jones', pos: 'RW', number: 11, age: 26, nat: 'Guyana', ovr: 75, pac: 89, sho: 68, pas: 71, dri: 78, def: 52, phy: 68 },
      { name: 'Emmanuel Latte Lath', pos: 'ST', number: 9, age: 26, nat: 'Costa de Marfil', ovr: 77, pac: 87, sho: 78, pas: 65, dri: 78, def: 38, phy: 76 },
      { name: 'Tommy Conway', pos: 'ST', number: 22, age: 23, nat: 'Escocia', ovr: 74, pac: 81, sho: 75, pas: 64, dri: 74, def: 36, phy: 72 }
    ]
  },
  {
    id: 'west_brom',
    name: 'West Bromwich Albion',
    shortName: 'WBA',
    leagueId: 'championship',
    city: 'West Bromwich',
    stadium: 'The Hawthorns',
    capacity: 26850,
    budget: 28,
    wageBudget: 200,
    primaryColor: '#122f67',
    secondaryColor: '#ffffff',
    accentColor: '#1a1a1a',
    textColor: '#ffffff',
    kitPattern: 'stripes',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/8659.png',
    rawPlayers: [
      { name: 'Alex Palmer', pos: 'GK', number: 1, age: 29, nat: 'Inglaterra', ovr: 76, pac: 75, sho: 77, pas: 72, dri: 76, def: 44, phy: 76 },
      { name: 'Semi Ajayi', pos: 'CB', number: 6, age: 31, nat: 'Nigeria', ovr: 75, pac: 74, sho: 40, pas: 62, dri: 60, def: 76, phy: 80 },
      { name: 'Torbjørn Heggem', pos: 'CB', number: 14, age: 26, nat: 'Noruega', ovr: 75, pac: 72, sho: 42, pas: 66, dri: 64, def: 76, phy: 78 },
      { name: 'Callum Styles', pos: 'LB', number: 3, age: 25, nat: 'Hungría', ovr: 74, pac: 78, sho: 66, pas: 73, dri: 75, def: 73, phy: 74 },
      { name: 'Darnell Furlong', pos: 'RB', number: 2, age: 29, nat: 'Inglaterra', ovr: 75, pac: 77, sho: 62, pas: 71, dri: 73, def: 75, phy: 78 },
      { name: 'Alex Mowatt', pos: 'CM', number: 8, age: 30, nat: 'Inglaterra', ovr: 76, pac: 72, sho: 76, pas: 80, dri: 76, def: 74, phy: 75 },
      { name: 'Jayson Molumby', pos: 'CM', number: 18, age: 26, nat: 'Irlanda', ovr: 75, pac: 76, sho: 68, pas: 75, dri: 75, def: 76, phy: 78 },
      { name: 'John Swift', pos: 'CAM', number: 10, age: 30, nat: 'Inglaterra', ovr: 76, pac: 73, sho: 77, pas: 80, dri: 78, def: 58, phy: 72 },
      { name: 'Grady Diangana', pos: 'LW', number: 11, age: 27, nat: 'RD del Congo', ovr: 75, pac: 83, sho: 72, pas: 73, dri: 80, def: 45, phy: 66 },
      { name: 'Karlan Grant', pos: 'RW', number: 17, age: 28, nat: 'Inglaterra', ovr: 75, pac: 84, sho: 76, pas: 68, dri: 77, def: 42, phy: 74 },
      { name: 'Josh Maja', pos: 'ST', number: 9, age: 26, nat: 'Nigeria', ovr: 76, pac: 78, sho: 78, pas: 70, dri: 77, def: 40, phy: 75 }
    ]
  },

  // ==================== EREDIVISIE (+2 Clubes) ====================
  {
    id: 'twente',
    name: 'FC Twente',
    shortName: 'TWE',
    leagueId: 'eredivisie',
    city: 'Enschede',
    stadium: 'De Grolsch Veste',
    capacity: 30205,
    budget: 22,
    wageBudget: 160,
    primaryColor: '#e30613',
    secondaryColor: '#ffffff',
    accentColor: '#1a1a1a',
    textColor: '#ffffff',
    kitPattern: 'plain',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/8611.png',
    rawPlayers: [
      { name: 'Lars Unnerstall', pos: 'GK', number: 1, age: 35, nat: 'Alemania', ovr: 80, pac: 78, sho: 81, pas: 72, dri: 77, def: 46, phy: 80 },
      { name: 'Mees Hilgers', pos: 'CB', number: 2, age: 24, nat: 'Indonesia', ovr: 76, pac: 76, sho: 38, pas: 68, dri: 66, def: 77, phy: 79 },
      { name: 'Max Bruns', pos: 'CB', number: 38, age: 22, nat: 'Países Bajos', ovr: 74, pac: 71, sho: 40, pas: 66, dri: 64, def: 75, phy: 77 },
      { name: 'Anass Salah-Eddine', pos: 'LB', number: 5, age: 23, nat: 'Países Bajos', ovr: 75, pac: 82, sho: 60, pas: 73, dri: 76, def: 74, phy: 72 },
      { name: 'Bart van Rooij', pos: 'RB', number: 28, age: 24, nat: 'Países Bajos', ovr: 75, pac: 83, sho: 58, pas: 72, dri: 75, def: 74, phy: 73 },
      { name: 'Mathias Kjølø', pos: 'CDM', number: 8, age: 24, nat: 'Noruega', ovr: 75, pac: 74, sho: 64, pas: 75, dri: 74, def: 76, phy: 76 },
      { name: 'Carel Eiting', pos: 'CM', number: 6, age: 27, nat: 'Países Bajos', ovr: 75, pac: 68, sho: 68, pas: 80, dri: 76, def: 73, phy: 72 },
      { name: 'Sem Steijn', pos: 'CAM', number: 14, age: 23, nat: 'Países Bajos', ovr: 80, pac: 78, sho: 82, pas: 78, dri: 79, def: 62, phy: 76 },
      { name: 'Michel Vlap', pos: 'LW', number: 18, age: 28, nat: 'Países Bajos', ovr: 76, pac: 76, sho: 76, pas: 78, dri: 78, def: 58, phy: 74 },
      { name: 'Daan Rots', pos: 'RW', number: 7, age: 24, nat: 'Países Bajos', ovr: 75, pac: 80, sho: 73, pas: 74, dri: 77, def: 52, phy: 72 },
      { name: 'Sam Lammers', pos: 'ST', number: 10, age: 28, nat: 'Países Bajos', ovr: 77, pac: 76, sho: 78, pas: 73, dri: 78, def: 40, phy: 76 },
      { name: 'Ricky van Wolfswinkel', pos: 'ST', number: 9, age: 36, nat: 'Países Bajos', ovr: 76, pac: 71, sho: 79, pas: 70, dri: 74, def: 44, phy: 74 }
    ]
  },
  {
    id: 'utrecht',
    name: 'FC Utrecht',
    shortName: 'UTR',
    leagueId: 'eredivisie',
    city: 'Utrecht',
    stadium: 'Stadion Galgenwaard',
    capacity: 23750,
    budget: 18,
    wageBudget: 140,
    primaryColor: '#c3281e',
    secondaryColor: '#ffffff',
    accentColor: '#1a1a1a',
    textColor: '#ffffff',
    kitPattern: 'plain',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/9908.png',
    rawPlayers: [
      { name: 'Vasilios Barkas', pos: 'GK', number: 1, age: 31, nat: 'Grecia', ovr: 77, pac: 76, sho: 78, pas: 71, dri: 76, def: 44, phy: 76 },
      { name: 'Mike van der Hoorn', pos: 'CB', number: 3, age: 33, nat: 'Países Bajos', ovr: 75, pac: 60, sho: 48, pas: 65, dri: 60, def: 77, phy: 82 },
      { name: 'Nick Viergever', pos: 'CB', number: 24, age: 36, nat: 'Países Bajos', ovr: 75, pac: 62, sho: 48, pas: 70, dri: 64, def: 77, phy: 76 },
      { name: 'Souffian El Karouani', pos: 'LB', number: 5, age: 24, nat: 'Marruecos', ovr: 76, pac: 83, sho: 62, pas: 74, dri: 76, def: 74, phy: 74 },
      { name: 'Siebe Horemans', pos: 'RB', number: 2, age: 27, nat: 'Bélgica', ovr: 75, pac: 80, sho: 58, pas: 72, dri: 74, def: 74, phy: 76 },
      { name: 'Alonzo Engwanda', pos: 'CDM', number: 27, age: 22, nat: 'Bélgica', ovr: 74, pac: 74, sho: 60, pas: 73, dri: 74, def: 75, phy: 76 },
      { name: 'Paxten Aaronson', pos: 'CM', number: 22, age: 22, nat: 'Estados Unidos', ovr: 76, pac: 78, sho: 73, pas: 77, dri: 79, def: 60, phy: 68 },
      { name: 'Jens Toornstra', pos: 'CAM', number: 7, age: 36, nat: 'Países Bajos', ovr: 75, pac: 68, sho: 76, pas: 77, dri: 75, def: 68, phy: 74 },
      { name: 'Yoann Cathline', pos: 'LW', number: 77, age: 23, nat: 'Francia', ovr: 76, pac: 87, sho: 74, pas: 72, dri: 81, def: 42, phy: 68 },
      { name: 'Taylor Booth', pos: 'RW', number: 10, age: 24, nat: 'Estados Unidos', ovr: 75, pac: 81, sho: 72, pas: 74, dri: 78, def: 54, phy: 68 },
      { name: 'Noah Ohio', pos: 'ST', number: 9, age: 22, nat: 'Países Bajos', ovr: 75, pac: 84, sho: 76, pas: 62, dri: 74, def: 36, phy: 79 }
    ]
  },

  // ==================== LIGA PORTUGAL (+2 Clubes) ====================
  {
    id: 'vitoria_sc',
    name: 'Vitória SC',
    shortName: 'VIT',
    leagueId: 'portugal',
    city: 'Guimarães',
    stadium: 'Estádio D. Afonso Henriques',
    capacity: 30029,
    budget: 20,
    wageBudget: 150,
    primaryColor: '#ffffff',
    secondaryColor: '#000000',
    accentColor: '#c5a059',
    textColor: '#000000',
    kitPattern: 'plain',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/7841.png',
    rawPlayers: [
      { name: 'Bruno Varela', pos: 'GK', number: 14, age: 30, nat: 'Cabo Verde', ovr: 78, pac: 76, sho: 79, pas: 74, dri: 77, def: 48, phy: 78 },
      { name: 'Toni Borevković', pos: 'CB', number: 4, age: 28, nat: 'Croacia', ovr: 76, pac: 70, sho: 38, pas: 64, dri: 62, def: 77, phy: 80 },
      { name: 'Mikel Villanueva', pos: 'CB', number: 3, age: 32, nat: 'Venezuela', ovr: 75, pac: 68, sho: 40, pas: 65, dri: 61, def: 76, phy: 78 },
      { name: 'João Mendes', pos: 'LB', number: 7, age: 30, nat: 'Portugal', ovr: 75, pac: 78, sho: 68, pas: 74, dri: 75, def: 72, phy: 73 },
      { name: 'Bruno Gaspar', pos: 'RB', number: 76, age: 32, nat: 'Angola', ovr: 75, pac: 81, sho: 58, pas: 71, dri: 74, def: 74, phy: 75 },
      { name: 'Tomás Händel', pos: 'CDM', number: 6, age: 24, nat: 'Portugal', ovr: 78, pac: 74, sho: 68, pas: 80, dri: 78, def: 77, phy: 76 },
      { name: 'Tiago Silva', pos: 'CM', number: 10, age: 32, nat: 'Portugal', ovr: 78, pac: 74, sho: 76, pas: 81, dri: 80, def: 70, phy: 74 },
      { name: 'Nuno Santos', pos: 'CAM', number: 11, age: 26, nat: 'Portugal', ovr: 77, pac: 78, sho: 75, pas: 78, dri: 79, def: 62, phy: 72 },
      { name: 'Kaio César', pos: 'RW', number: 77, age: 21, nat: 'Brasil', ovr: 75, pac: 86, sho: 70, pas: 70, dri: 79, def: 40, phy: 64 },
      { name: 'Nélson Oliveira', pos: 'ST', number: 22, age: 34, nat: 'Portugal', ovr: 76, pac: 74, sho: 78, pas: 72, dri: 75, def: 42, phy: 79 },
      { name: 'Jesús Ramírez', pos: 'ST', number: 9, age: 27, nat: 'Venezuela', ovr: 74, pac: 76, sho: 75, pas: 62, dri: 72, def: 38, phy: 78 }
    ]
  },
  {
    id: 'famalicao',
    name: 'FC Famalicão',
    shortName: 'FAM',
    leagueId: 'portugal',
    city: 'Vila Nova de Famalicão',
    stadium: 'Estádio Municipal de Famalicão',
    capacity: 5307,
    budget: 15,
    wageBudget: 120,
    primaryColor: '#002f6c',
    secondaryColor: '#ffffff',
    accentColor: '#1a1a1a',
    textColor: '#ffffff',
    kitPattern: 'plain',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/10260.png',
    rawPlayers: [
      { name: 'Ivan Zlobin', pos: 'GK', number: 1, age: 28, nat: 'Rusia', ovr: 75, pac: 75, sho: 76, pas: 70, dri: 75, def: 44, phy: 75 },
      { name: 'Enea Mihaj', pos: 'CB', number: 4, age: 27, nat: 'Albania', ovr: 75, pac: 70, sho: 38, pas: 64, dri: 62, def: 76, phy: 78 },
      { name: 'Justin de Haas', pos: 'CB', number: 16, age: 25, nat: 'Países Bajos', ovr: 74, pac: 71, sho: 40, pas: 65, dri: 63, def: 75, phy: 77 },
      { name: 'Rafa Soares', pos: 'LB', number: 3, age: 30, nat: 'Portugal', ovr: 75, pac: 78, sho: 60, pas: 73, dri: 74, def: 73, phy: 73 },
      { name: 'Lucas Calegari', pos: 'RB', number: 2, age: 23, nat: 'Brasil', ovr: 75, pac: 82, sho: 56, pas: 71, dri: 75, def: 74, phy: 74 },
      { name: 'Zaydou Youssouf', pos: 'CDM', number: 28, age: 26, nat: 'Francia', ovr: 78, pac: 76, sho: 72, pas: 78, dri: 79, def: 78, phy: 81 },
      { name: 'Mirko Topić', pos: 'CM', number: 6, age: 24, nat: 'Serbia', ovr: 75, pac: 73, sho: 66, pas: 76, dri: 75, def: 75, phy: 78 },
      { name: 'Gustavo Sá', pos: 'CAM', number: 20, age: 20, nat: 'Portugal', ovr: 77, pac: 78, sho: 74, pas: 78, dri: 80, def: 58, phy: 72 },
      { name: 'Gil Dias', pos: 'RW', number: 11, age: 28, nat: 'Portugal', ovr: 75, pac: 84, sho: 73, pas: 72, dri: 79, def: 48, phy: 68 },
      { name: 'Mario González Gutiérrez', pos: 'ST', number: 9, age: 29, nat: 'España', ovr: 76, pac: 79, sho: 78, pas: 66, dri: 75, def: 38, phy: 78 },
      { name: 'Óscar Aranda', pos: 'LW', number: 7, age: 23, nat: 'España', ovr: 74, pac: 83, sho: 73, pas: 70, dri: 77, def: 42, phy: 66 }
    ]
  },

  // ==================== TRENDYOL SÜPER LIG (+2 Clubes) ====================
  {
    id: 'basaksehir',
    name: 'İstanbul Başakşehir',
    shortName: 'IBFK',
    leagueId: 'superlig',
    city: 'Estambul',
    stadium: 'Başakşehir Fatih Terim Stadyumu',
    capacity: 17156,
    budget: 25,
    wageBudget: 210,
    primaryColor: '#f58220',
    secondaryColor: '#002f6c',
    accentColor: '#ffffff',
    textColor: '#ffffff',
    kitPattern: 'plain',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/10049.png',
    rawPlayers: [
      { name: 'Muhammed Şengezer', pos: 'GK', number: 16, age: 28, nat: 'Turquía', ovr: 76, pac: 75, sho: 77, pas: 72, dri: 75, def: 45, phy: 76 },
      { name: 'Jerome Opoku', pos: 'CB', number: 5, age: 26, nat: 'Ghana', ovr: 76, pac: 73, sho: 45, pas: 66, dri: 64, def: 77, phy: 82 },
      { name: 'Léo Duarte', pos: 'CB', number: 27, age: 29, nat: 'Brasil', ovr: 76, pac: 74, sho: 40, pas: 66, dri: 65, def: 77, phy: 78 },
      { name: 'Lucas Lima', pos: 'LB', number: 3, age: 33, nat: 'Brasil', ovr: 75, pac: 78, sho: 58, pas: 73, dri: 74, def: 73, phy: 73 },
      { name: 'Ömer Ali Şahiner', pos: 'RB', number: 42, age: 33, nat: 'Turquía', ovr: 75, pac: 78, sho: 66, pas: 73, dri: 74, def: 74, phy: 75 },
      { name: 'Berat Özdemir', pos: 'CDM', number: 6, age: 27, nat: 'Turquía', ovr: 76, pac: 72, sho: 64, pas: 76, dri: 74, def: 77, phy: 79 },
      { name: 'Miguel Crespo', pos: 'CM', number: 8, age: 28, nat: 'Portugal', ovr: 77, pac: 76, sho: 71, pas: 78, dri: 78, def: 76, phy: 78 },
      { name: 'Deniz Türüç', pos: 'RW', number: 23, age: 32, nat: 'Turquía', ovr: 77, pac: 78, sho: 78, pas: 79, dri: 78, def: 55, phy: 74 },
      { name: 'Serdar Gürler', pos: 'LW', number: 7, age: 34, nat: 'Turquía', ovr: 75, pac: 80, sho: 74, pas: 73, dri: 77, def: 48, phy: 68 },
      { name: 'Krzysztof Piątek', pos: 'ST', number: 9, age: 30, nat: 'Polonia', ovr: 79, pac: 78, sho: 82, pas: 68, dri: 76, def: 40, phy: 79 },
      { name: 'Philippe Keny', pos: 'ST', number: 11, age: 26, nat: 'Senegal', ovr: 74, pac: 83, sho: 73, pas: 62, dri: 73, def: 36, phy: 78 }
    ]
  },
  {
    id: 'eyupspor',
    name: 'Eyüpspor',
    shortName: 'EYU',
    leagueId: 'superlig',
    city: 'Estambul',
    stadium: 'Eyüp Stadı',
    capacity: 2500,
    budget: 15,
    wageBudget: 130,
    primaryColor: '#7d2238',
    secondaryColor: '#f7d117',
    accentColor: '#ffffff',
    textColor: '#ffffff',
    kitPattern: 'stripes',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/4681.png',
    rawPlayers: [
      { name: 'Berke Özer', pos: 'GK', number: 1, age: 25, nat: 'Turquía', ovr: 76, pac: 76, sho: 78, pas: 72, dri: 75, def: 45, phy: 76 },
      { name: 'Luccas Claro', pos: 'CB', number: 4, age: 33, nat: 'Brasil', ovr: 75, pac: 68, sho: 42, pas: 64, dri: 62, def: 76, phy: 80 },
      { name: 'Robin Yalçın', pos: 'CB', number: 6, age: 31, nat: 'Turquía', ovr: 74, pac: 68, sho: 54, pas: 70, dri: 66, def: 75, phy: 76 },
      { name: 'Caner Erkin', pos: 'LB', number: 88, age: 36, nat: 'Turquía', ovr: 76, pac: 68, sho: 74, pas: 84, dri: 76, def: 72, phy: 74 },
      { name: 'Léo Dubois', pos: 'RB', number: 15, age: 30, nat: 'Francia', ovr: 77, pac: 78, sho: 64, pas: 76, dri: 76, def: 76, phy: 75 },
      { name: 'Melih Kabasakal', pos: 'CDM', number: 28, age: 29, nat: 'Turquía', ovr: 74, pac: 72, sho: 60, pas: 73, dri: 73, def: 75, phy: 77 },
      { name: 'Fredrik Midtsjø', pos: 'CM', number: 18, age: 32, nat: 'Noruega', ovr: 77, pac: 74, sho: 70, pas: 78, dri: 77, def: 76, phy: 78 },
      { name: 'Emre Akbaba', pos: 'CAM', number: 10, age: 32, nat: 'Turquía', ovr: 77, pac: 75, sho: 78, pas: 79, dri: 78, def: 60, phy: 72 },
      { name: 'Ahmed Kutucu', pos: 'RW', number: 7, age: 25, nat: 'Turquía', ovr: 77, pac: 83, sho: 78, pas: 74, dri: 79, def: 52, phy: 76 },
      { name: 'Mame Thiam', pos: 'ST', number: 99, age: 32, nat: 'Senegal', ovr: 78, pac: 81, sho: 80, pas: 70, dri: 77, def: 45, phy: 80 },
      { name: 'Samu Sáiz', pos: 'LW', number: 11, age: 34, nat: 'España', ovr: 75, pac: 76, sho: 74, pas: 77, dri: 81, def: 42, phy: 66 }
    ]
  },

  // ==================== MAJOR LEAGUE SOCCER (+2 Clubes) ====================
  {
    id: 'nycfc',
    name: 'New York City FC',
    shortName: 'NYC',
    leagueId: 'mls',
    city: 'Nueva York',
    stadium: 'Yankee Stadium',
    capacity: 28743,
    budget: 35,
    wageBudget: 240,
    primaryColor: '#6caddf',
    secondaryColor: '#002f6c',
    accentColor: '#f15524',
    textColor: '#ffffff',
    kitPattern: 'plain',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/546238.png',
    rawPlayers: [
      { name: 'Matt Freese', pos: 'GK', number: 49, age: 27, nat: 'Estados Unidos', ovr: 77, pac: 76, sho: 78, pas: 72, dri: 76, def: 45, phy: 77 },
      { name: 'Thiago Martins', pos: 'CB', number: 13, age: 30, nat: 'Brasil', ovr: 77, pac: 74, sho: 40, pas: 68, dri: 65, def: 78, phy: 80 },
      { name: 'Birk Risa', pos: 'CB', number: 5, age: 27, nat: 'Noruega', ovr: 75, pac: 72, sho: 44, pas: 70, dri: 66, def: 76, phy: 77 },
      { name: 'Kevin O Toole', pos: 'LB', number: 22, age: 26, nat: 'Estados Unidos', ovr: 74, pac: 80, sho: 54, pas: 70, dri: 72, def: 72, phy: 73 },
      { name: 'Tayvon Gray', pos: 'RB', number: 35, age: 23, nat: 'Jamaica', ovr: 74, pac: 81, sho: 48, pas: 68, dri: 71, def: 73, phy: 76 },
      { name: 'James Sands', pos: 'CDM', number: 6, age: 25, nat: 'Estados Unidos', ovr: 76, pac: 72, sho: 56, pas: 74, dri: 72, def: 78, phy: 79 },
      { name: 'Keaton Parks', pos: 'CM', number: 55, age: 28, nat: 'Estados Unidos', ovr: 76, pac: 70, sho: 70, pas: 77, dri: 77, def: 74, phy: 79 },
      { name: 'Santiago Rodríguez', pos: 'CAM', number: 10, age: 25, nat: 'Uruguay', ovr: 79, pac: 82, sho: 77, pas: 80, dri: 82, def: 54, phy: 68 },
      { name: 'Hannes Wolf', pos: 'RW', number: 17, age: 26, nat: 'Austria', ovr: 77, pac: 82, sho: 74, pas: 76, dri: 80, def: 52, phy: 70 },
      { name: 'Alonso Martínez', pos: 'ST', number: 16, age: 26, nat: 'Costa Rica', ovr: 77, pac: 88, sho: 78, pas: 67, dri: 78, def: 38, phy: 74 },
      { name: 'Monsef Bakrar', pos: 'ST', number: 9, age: 24, nat: 'Argelia', ovr: 74, pac: 83, sho: 74, pas: 62, dri: 73, def: 36, phy: 75 }
    ]
  },
  {
    id: 'seattle_sounders',
    name: 'Seattle Sounders FC',
    shortName: 'SEA',
    leagueId: 'mls',
    city: 'Seattle',
    stadium: 'Lumen Field',
    capacity: 37722,
    budget: 30,
    wageBudget: 220,
    primaryColor: '#005595',
    secondaryColor: '#5d9732',
    accentColor: '#ffffff',
    textColor: '#ffffff',
    kitPattern: 'plain',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/9954.png',
    rawPlayers: [
      { name: 'Stefan Frei', pos: 'GK', number: 24, age: 39, nat: 'Suiza', ovr: 77, pac: 75, sho: 78, pas: 72, dri: 76, def: 45, phy: 75 },
      { name: 'Yeimar Gómez Andrade', pos: 'CB', number: 28, age: 33, nat: 'Colombia', ovr: 77, pac: 72, sho: 38, pas: 62, dri: 60, def: 79, phy: 84 },
      { name: 'Jackson Ragen', pos: 'CB', number: 25, age: 26, nat: 'Estados Unidos', ovr: 76, pac: 68, sho: 44, pas: 72, dri: 66, def: 77, phy: 80 },
      { name: 'Nouhou Tolo', pos: 'LB', number: 5, age: 28, nat: 'Camerún', ovr: 76, pac: 83, sho: 50, pas: 68, dri: 73, def: 76, phy: 82 },
      { name: 'Alex Roldan', pos: 'RB', number: 16, age: 29, nat: 'El Salvador', ovr: 75, pac: 78, sho: 60, pas: 73, dri: 74, def: 74, phy: 74 },
      { name: 'Cristian Roldan', pos: 'CM', number: 7, age: 30, nat: 'Estados Unidos', ovr: 77, pac: 77, sho: 72, pas: 77, dri: 77, def: 76, phy: 80 },
      { name: 'Obed Vargas', pos: 'CM', number: 18, age: 20, nat: 'México', ovr: 75, pac: 76, sho: 65, pas: 76, dri: 76, def: 73, phy: 75 },
      { name: 'Albert Rusnák', pos: 'CAM', number: 11, age: 31, nat: 'Eslovaquia', ovr: 78, pac: 76, sho: 78, pas: 82, dri: 80, def: 55, phy: 70 },
      { name: 'Pedro de la Vega', pos: 'RW', number: 10, age: 24, nat: 'Argentina', ovr: 77, pac: 85, sho: 74, pas: 75, dri: 81, def: 48, phy: 72 },
      { name: 'Jordan Morris', pos: 'ST', number: 13, age: 30, nat: 'Estados Unidos', ovr: 78, pac: 87, sho: 79, pas: 72, dri: 77, def: 52, phy: 81 },
      { name: 'Raúl Ruidíaz', pos: 'ST', number: 9, age: 35, nat: 'Perú', ovr: 76, pac: 75, sho: 80, pas: 71, dri: 77, def: 38, phy: 68 }
    ]
  }
];

async function main() {
  console.log(`Starting expanded leagues and clubs injection...`);
  console.log(`Total new clubs to process: ${EXPANDED_CLUBS.length}`);

  let totalPlayers = 0;
  let photosFound = 0;
  let defaultAvatars = 0;

  const processedClubs = [];

  for (const rawClub of EXPANDED_CLUBS) {
    console.log(`\nProcessing ${rawClub.name} (${rawClub.leagueId})...`);
    const clubRoster = [];

    for (const p of rawClub.rawPlayers) {
      totalPlayers++;
      const photoUrl = await resolvePlayerPhoto(p.name);
      if (photoUrl && !photoUrl.includes('default_player')) {
        photosFound++;
      } else {
        defaultAvatars++;
      }

      const pId = `${rawClub.id}_${p.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

      clubRoster.push({
        id: pId,
        name: p.name,
        number: p.number,
        team: rawClub.name,
        leagueId: rawClub.leagueId,
        kitPattern: rawClub.kitPattern,
        pos: p.pos,
        imageUrl: photoUrl,
        val: p.ovr ? Math.round(p.ovr * 0.45) : 15,
        budget: p.ovr ? Math.round(p.ovr * 0.45) : 15,
        wage: Math.round((p.ovr || 75) * 1.5),
        ovr: p.ovr || 75,
        pac: p.pac || 75,
        sho: p.sho || 70,
        pas: p.pas || 72,
        dri: p.dri || 74,
        def: p.def || 65,
        phy: p.phy || 72,
        age: p.age || 25,
        nat: p.nat || 'España'
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
      championsQualified: false,
      badge: rawClub.badgeUrl,
      badgeUrl: rawClub.badgeUrl,
      roster: clubRoster
    });
  }

  console.log(`\nSummary of Players Processed:`);
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

  // Also update playerPhotoMap.json
  fs.writeFileSync(photoMapPath, JSON.stringify(photoMap, null, 2), 'utf8');

  console.log(`\nSuccessfully updated database with ${db.leagues.length} leagues and ${db.clubs.length} clubs!`);
  console.log(`- ${dbPath}`);
  console.log(`- ${publicDbPath}`);
  console.log(`- ${photoMapPath}`);
}

main().catch(console.error);
