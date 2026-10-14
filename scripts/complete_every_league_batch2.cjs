const fs = require('fs');
const path = require('path');
const https = require('https');

function fetchJson(url) {
  return new Promise((resolve) => {
    const req = https.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        try { resolve(JSON.parse(data)); } catch (e) { resolve(null); }
      });
    });
    req.on("error", () => resolve(null));
    req.setTimeout(2500, () => { req.destroy(); resolve(null); });
  });
}

function checkImage(url) {
  return new Promise((resolve) => {
    const req = https.request(url, { method: "HEAD", headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
      resolve(res.statusCode === 200);
    });
    req.on("error", () => resolve(false));
    req.setTimeout(2000, () => { req.destroy(); resolve(false); });
    req.end();
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

const BATCH2_CLUBS = [
  // -------------------- 3. LIGA PORTUGAL (12 remaining clubs to reach 18) --------------------
  {
    id: 'boavista',
    name: 'Boavista FC',
    shortName: 'BOA',
    leagueId: 'portugal',
    city: 'Oporto',
    stadium: 'Estádio do Bessa Século XXI',
    capacity: 28263,
    budget: 16,
    wageBudget: 110,
    primaryColor: '#000000',
    secondaryColor: '#ffffff',
    accentColor: '#1a1a1a',
    textColor: '#ffffff',
    kitPattern: 'checkered',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/8613.png',
    rawPlayers: [
      { name: 'César Dutra', pos: 'GK', number: 99, age: 33, nat: 'Brasil', ovr: 74, pac: 72, sho: 75, pas: 68, dri: 72, def: 42, phy: 74 },
      { name: 'Rodrigo Abascal', pos: 'CB', number: 26, age: 31, nat: 'Uruguay', ovr: 74, pac: 66, sho: 40, pas: 64, dri: 60, def: 75, phy: 80 },
      { name: 'Filipe Ferreira', pos: 'LB', number: 20, age: 34, nat: 'Portugal', ovr: 73, pac: 75, sho: 54, pas: 70, dri: 71, def: 72, phy: 73 },
      { name: 'Pedro Gomes', pos: 'RB', number: 70, age: 22, nat: 'Portugal', ovr: 72, pac: 80, sho: 50, pas: 67, dri: 71, def: 72, phy: 73 },
      { name: 'Sebastián Pérez', pos: 'CDM', number: 24, age: 32, nat: 'Colombia', ovr: 76, pac: 70, sho: 68, pas: 78, dri: 76, def: 76, phy: 78 },
      { name: 'Ilija Vukotić', pos: 'CM', number: 88, age: 26, nat: 'Montenegro', ovr: 74, pac: 72, sho: 72, pas: 75, dri: 74, def: 70, phy: 75 },
      { name: 'Miguel Reisinho', pos: 'CM', number: 8, age: 26, nat: 'Portugal', ovr: 75, pac: 74, sho: 73, pas: 77, dri: 76, def: 68, phy: 72 },
      { name: 'Salvador Agra', pos: 'RW', number: 7, age: 33, nat: 'Portugal', ovr: 75, pac: 82, sho: 74, pas: 75, dri: 77, def: 52, phy: 68 },
      { name: 'Joel Silva', pos: 'CAM', number: 18, age: 22, nat: 'Portugal', ovr: 72, pac: 76, sho: 68, pas: 73, dri: 74, def: 62, phy: 70 },
      { name: 'Robert Boženík', pos: 'ST', number: 9, age: 25, nat: 'Eslovaquia', ovr: 76, pac: 79, sho: 78, pas: 64, dri: 74, def: 40, phy: 80 },
      { name: 'Tiago Machado', pos: 'LW', number: 79, age: 20, nat: 'Portugal', ovr: 71, pac: 82, sho: 68, pas: 66, dri: 73, def: 38, phy: 66 }
    ]
  },
  {
    id: 'rio_ave',
    name: 'Rio Ave FC',
    shortName: 'RAV',
    leagueId: 'portugal',
    city: 'Vila do Conde',
    stadium: 'Estádio dos Arcos',
    capacity: 5300,
    budget: 16,
    wageBudget: 110,
    primaryColor: '#006633',
    secondaryColor: '#ffffff',
    accentColor: '#1a1a1a',
    textColor: '#ffffff',
    kitPattern: 'stripes',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/7842.png',
    rawPlayers: [
      { name: 'Cezary Miszta', pos: 'GK', number: 1, age: 23, nat: 'Polonia', ovr: 74, pac: 74, sho: 76, pas: 70, dri: 74, def: 42, phy: 74 },
      { name: 'Aderllan Santos', pos: 'CB', number: 33, age: 36, nat: 'Brasil', ovr: 75, pac: 58, sho: 40, pas: 65, dri: 58, def: 77, phy: 80 },
      { name: 'Renato Pantalon', pos: 'CB', number: 4, age: 27, nat: 'Croacia', ovr: 74, pac: 70, sho: 38, pas: 64, dri: 62, def: 75, phy: 78 },
      { name: 'Omar Richards', pos: 'LB', number: 3, age: 27, nat: 'Inglaterra', ovr: 75, pac: 84, sho: 58, pas: 71, dri: 76, def: 73, phy: 74 },
      { name: 'Marios Vrousai', pos: 'RB', number: 23, age: 27, nat: 'Grecia', ovr: 74, pac: 81, sho: 65, pas: 73, dri: 75, def: 72, phy: 73 },
      { name: 'Amine Oudrhiri', pos: 'CDM', number: 8, age: 32, nat: 'Marruecos', ovr: 74, pac: 70, sho: 64, pas: 76, dri: 73, def: 75, phy: 77 },
      { name: 'Martim Neto', pos: 'CM', number: 17, age: 22, nat: 'Portugal', ovr: 74, pac: 75, sho: 68, pas: 76, dri: 76, def: 71, phy: 72 },
      { name: 'Kiko Bondoso', pos: 'LW', number: 7, age: 29, nat: 'Portugal', ovr: 75, pac: 83, sho: 73, pas: 74, dri: 79, def: 48, phy: 68 },
      { name: 'Tiago Morais', pos: 'RW', number: 11, age: 22, nat: 'Portugal', ovr: 74, pac: 85, sho: 72, pas: 72, dri: 78, def: 44, phy: 68 },
      { name: 'Clayton Silva', pos: 'ST', number: 9, age: 26, nat: 'Brasil', ovr: 76, pac: 79, sho: 78, pas: 65, dri: 75, def: 40, phy: 79 },
      { name: 'Brandon Aguilera', pos: 'CAM', number: 10, age: 22, nat: 'Costa Rica', ovr: 73, pac: 76, sho: 71, pas: 76, dri: 76, def: 55, phy: 68 }
    ]
  },
  {
    id: 'gil_vicente',
    name: 'Gil Vicente FC',
    shortName: 'GIL',
    leagueId: 'portugal',
    city: 'Barcelos',
    stadium: 'Estádio Cidade de Barcelos',
    capacity: 12504,
    budget: 15,
    wageBudget: 100,
    primaryColor: '#c3281e',
    secondaryColor: '#ffffff',
    accentColor: '#002f6c',
    textColor: '#ffffff',
    kitPattern: 'plain',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/7844.png',
    rawPlayers: [
      { name: 'Andrew Ventura', pos: 'GK', number: 42, age: 24, nat: 'Brasil', ovr: 76, pac: 76, sho: 78, pas: 73, dri: 76, def: 45, phy: 76 },
      { name: 'Rúben Fernandes', pos: 'CB', number: 26, age: 39, nat: 'Portugal', ovr: 74, pac: 58, sho: 42, pas: 65, dri: 58, def: 76, phy: 78 },
      { name: 'Jonathan Buatu', pos: 'CB', number: 39, age: 31, nat: 'Angola', ovr: 74, pac: 68, sho: 36, pas: 62, dri: 60, def: 75, phy: 80 },
      { name: 'Sandro Cruz', pos: 'LB', number: 23, age: 24, nat: 'Portugal', ovr: 73, pac: 79, sho: 54, pas: 70, dri: 73, def: 72, phy: 72 },
      { name: 'Zé Carlos', pos: 'RB', number: 2, age: 27, nat: 'Portugal', ovr: 74, pac: 81, sho: 56, pas: 71, dri: 74, def: 73, phy: 74 },
      { name: 'Mory Gbane', pos: 'CDM', number: 6, age: 24, nat: 'Costa de Marfil', ovr: 74, pac: 73, sho: 60, pas: 73, dri: 72, def: 76, phy: 80 },
      { name: 'Kanya Fujimoto', pos: 'CAM', number: 10, age: 26, nat: 'Japón', ovr: 77, pac: 76, sho: 75, pas: 82, dri: 80, def: 60, phy: 68 },
      { name: 'Jesús Castillo', pos: 'CM', number: 5, age: 24, nat: 'Perú', ovr: 73, pac: 74, sho: 64, pas: 74, dri: 74, def: 73, phy: 75 },
      { name: 'Félix Correia', pos: 'LW', number: 7, age: 24, nat: 'Portugal', ovr: 76, pac: 87, sho: 74, pas: 74, dri: 82, def: 45, phy: 68 },
      { name: 'Jordi Mboula', pos: 'RW', number: 11, age: 26, nat: 'España', ovr: 74, pac: 86, sho: 71, pas: 70, dri: 78, def: 42, phy: 70 },
      { name: 'Cauê dos Santos', pos: 'ST', number: 9, age: 22, nat: 'Brasil', ovr: 74, pac: 79, sho: 75, pas: 64, dri: 73, def: 38, phy: 79 }
    ]
  },
  {
    id: 'estoril',
    name: 'GD Estoril Praia',
    shortName: 'EST',
    leagueId: 'portugal',
    city: 'Estoril',
    stadium: 'Estádio António Coimbra da Mota',
    capacity: 8000,
    budget: 15,
    wageBudget: 100,
    primaryColor: '#f7d117',
    secondaryColor: '#002f6c',
    accentColor: '#ffffff',
    textColor: '#002f6c',
    kitPattern: 'plain',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/7845.png',
    rawPlayers: [
      { name: 'Marcelo Carné', pos: 'GK', number: 99, age: 35, nat: 'Brasil', ovr: 74, pac: 73, sho: 75, pas: 70, dri: 73, def: 44, phy: 74 },
      { name: 'Pedro Álvaro', pos: 'CB', number: 22, age: 25, nat: 'Portugal', ovr: 74, pac: 70, sho: 38, pas: 66, dri: 63, def: 75, phy: 78 },
      { name: 'Eliaquim Mangala', pos: 'CB', number: 4, age: 34, nat: 'Francia', ovr: 74, pac: 60, sho: 40, pas: 62, dri: 56, def: 76, phy: 84 },
      { name: 'Pedro Amaral', pos: 'LB', number: 5, age: 28, nat: 'Portugal', ovr: 73, pac: 78, sho: 54, pas: 71, dri: 73, def: 72, phy: 73 },
      { name: 'Wagner Pina', pos: 'RB', number: 18, age: 22, nat: 'Cabo Verde', ovr: 74, pac: 84, sho: 54, pas: 69, dri: 74, def: 73, phy: 75 },
      { name: 'Jandro Orellana', pos: 'CDM', number: 6, age: 25, nat: 'España', ovr: 75, pac: 72, sho: 66, pas: 80, dri: 77, def: 75, phy: 72 },
      { name: 'Jordan Holsgrove', pos: 'CM', number: 8, age: 25, nat: 'Escocia', ovr: 75, pac: 74, sho: 72, pas: 78, dri: 76, def: 72, phy: 74 },
      { name: 'Xeka', pos: 'CM', number: 88, age: 30, nat: 'Portugal', ovr: 75, pac: 72, sho: 71, pas: 78, dri: 76, def: 74, phy: 75 },
      { name: 'Yanis Begraoui', pos: 'LW', number: 9, age: 24, nat: 'Marruecos', ovr: 75, pac: 82, sho: 76, pas: 72, dri: 78, def: 40, phy: 72 },
      { name: 'Fabrício Garcia', pos: 'RW', number: 11, age: 24, nat: 'Cabo Verde', ovr: 74, pac: 84, sho: 72, pas: 70, dri: 77, def: 42, phy: 70 },
      { name: 'Alejandro Marqués', pos: 'ST', number: 10, age: 25, nat: 'Venezuela', ovr: 75, pac: 78, sho: 77, pas: 65, dri: 74, def: 38, phy: 80 }
    ]
  },
  {
    id: 'moreirense',
    name: 'Moreirense FC',
    shortName: 'MOR',
    leagueId: 'portugal',
    city: 'Moreira de Cónegos',
    stadium: 'Parque de Jogos Comendador Joaquim de Almeida Freitas',
    capacity: 6153,
    budget: 15,
    wageBudget: 95,
    primaryColor: '#006633',
    secondaryColor: '#ffffff',
    accentColor: '#1a1a1a',
    textColor: '#ffffff',
    kitPattern: 'checkered',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/7843.png',
    rawPlayers: [
      { name: 'Kewin Silva', pos: 'GK', number: 1, age: 30, nat: 'Brasil', ovr: 75, pac: 75, sho: 77, pas: 72, dri: 75, def: 44, phy: 75 },
      { name: 'Marcelo Oliveira', pos: 'CB', number: 14, age: 36, nat: 'Brasil', ovr: 74, pac: 60, sho: 38, pas: 64, dri: 58, def: 76, phy: 78 },
      { name: 'Maracás', pos: 'CB', number: 26, age: 31, nat: 'Brasil', ovr: 74, pac: 68, sho: 36, pas: 63, dri: 60, def: 75, phy: 80 },
      { name: 'Godfried Frimpong', pos: 'LB', number: 23, age: 26, nat: 'Países Bajos', ovr: 74, pac: 82, sho: 54, pas: 71, dri: 74, def: 73, phy: 74 },
      { name: 'Fabiano Silva', pos: 'RB', number: 2, age: 25, nat: 'Brasil', ovr: 74, pac: 81, sho: 56, pas: 70, dri: 73, def: 73, phy: 75 },
      { name: 'Lawrence Ofori', pos: 'CDM', number: 80, age: 27, nat: 'Ghana', ovr: 74, pac: 74, sho: 64, pas: 74, dri: 74, def: 76, phy: 78 },
      { name: 'Rúben Ismael', pos: 'CM', number: 6, age: 26, nat: 'Portugal', ovr: 73, pac: 72, sho: 66, pas: 74, dri: 73, def: 72, phy: 74 },
      { name: 'Alan Guimarães', pos: 'CAM', number: 11, age: 25, nat: 'Brasil', ovr: 75, pac: 78, sho: 73, pas: 78, dri: 80, def: 54, phy: 66 },
      { name: 'Madson Silva', pos: 'RW', number: 21, age: 26, nat: 'Brasil', ovr: 75, pac: 86, sho: 73, pas: 72, dri: 79, def: 45, phy: 70 },
      { name: 'Luís Asué', pos: 'ST', number: 9, age: 24, nat: 'Guinea Ecuatorial', ovr: 75, pac: 82, sho: 76, pas: 64, dri: 74, def: 40, phy: 78 },
      { name: 'Jeremy Antonisse', pos: 'LW', number: 7, age: 23, nat: 'Curazao', ovr: 73, pac: 84, sho: 70, pas: 70, dri: 77, def: 42, phy: 66 }
    ]
  },
  {
    id: 'santa_clara',
    name: 'CD Santa Clara',
    shortName: 'STC',
    leagueId: 'portugal',
    city: 'Ponta Delgada',
    stadium: 'Estádio de São Miguel',
    capacity: 13277,
    budget: 16,
    wageBudget: 100,
    primaryColor: '#c3281e',
    secondaryColor: '#ffffff',
    accentColor: '#1a1a1a',
    textColor: '#ffffff',
    kitPattern: 'plain',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/7840.png',
    rawPlayers: [
      { name: 'Gabriel Batista', pos: 'GK', number: 1, age: 27, nat: 'Brasil', ovr: 75, pac: 75, sho: 77, pas: 72, dri: 75, def: 44, phy: 75 },
      { name: 'Sidney Lima', pos: 'CB', number: 4, age: 28, nat: 'Brasil', ovr: 74, pac: 70, sho: 38, pas: 65, dri: 62, def: 75, phy: 80 },
      { name: 'Luís Rocha', pos: 'CB', number: 13, age: 39, nat: 'Portugal', ovr: 73, pac: 56, sho: 40, pas: 64, dri: 56, def: 75, phy: 76 },
      { name: 'Matheus Nunes', pos: 'LB', number: 6, age: 24, nat: 'Brasil', ovr: 73, pac: 79, sho: 54, pas: 70, dri: 73, def: 72, phy: 72 },
      { name: 'Diogo Calila', pos: 'RB', number: 2, age: 26, nat: 'Portugal', ovr: 74, pac: 80, sho: 55, pas: 71, dri: 73, def: 73, phy: 74 },
      { name: 'Pedro Ferreira', pos: 'CDM', number: 8, age: 27, nat: 'Portugal', ovr: 74, pac: 72, sho: 64, pas: 75, dri: 73, def: 76, phy: 77 },
      { name: 'Adriano Firmino', pos: 'CM', number: 35, age: 26, nat: 'Brasil', ovr: 74, pac: 74, sho: 68, pas: 75, dri: 75, def: 72, phy: 75 },
      { name: 'Bruno Almeida', pos: 'CAM', number: 10, age: 29, nat: 'Portugal', ovr: 75, pac: 75, sho: 74, pas: 78, dri: 77, def: 58, phy: 68 },
      { name: 'Gabriel Silva', pos: 'RW', number: 7, age: 23, nat: 'Brasil', ovr: 75, pac: 85, sho: 74, pas: 72, dri: 79, def: 44, phy: 70 },
      { name: 'Alisson Safira', pos: 'ST', number: 9, age: 30, nat: 'Brasil', ovr: 75, pac: 76, sho: 77, pas: 65, dri: 74, def: 42, phy: 82 },
      { name: 'Vinícius Lopes', pos: 'LW', number: 70, age: 26, nat: 'Brasil', ovr: 74, pac: 83, sho: 73, pas: 70, dri: 77, def: 42, phy: 72 }
    ]
  },
  {
    id: 'avs_futebol',
    name: 'AVS Futebol SAD',
    shortName: 'AVS',
    leagueId: 'portugal',
    city: 'Vila das Aves',
    stadium: 'Estádio do CD das Aves',
    capacity: 8560,
    budget: 14,
    wageBudget: 95,
    primaryColor: '#c3281e',
    secondaryColor: '#ffffff',
    accentColor: '#1a1a1a',
    textColor: '#ffffff',
    kitPattern: 'plain',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/1585885.png',
    rawPlayers: [
      { name: 'Guillermo Ochoa', pos: 'GK', number: 13, age: 40, nat: 'México', ovr: 77, pac: 75, sho: 78, pas: 73, dri: 78, def: 48, phy: 73 },
      { name: 'Cristian Devenish', pos: 'CB', number: 4, age: 24, nat: 'Colombia', ovr: 74, pac: 72, sho: 36, pas: 64, dri: 61, def: 75, phy: 80 },
      { name: 'Baptiste Roux', pos: 'CB', number: 5, age: 26, nat: 'Francia', ovr: 74, pac: 70, sho: 40, pas: 66, dri: 63, def: 75, phy: 78 },
      { name: 'Kiki Afonso', pos: 'LB', number: 24, age: 30, nat: 'Portugal', ovr: 73, pac: 78, sho: 54, pas: 70, dri: 72, def: 72, phy: 73 },
      { name: 'Fernando Fonseca', pos: 'RB', number: 2, age: 28, nat: 'Portugal', ovr: 73, pac: 79, sho: 52, pas: 69, dri: 72, def: 73, phy: 74 },
      { name: 'Gustavo Assunção', pos: 'CDM', number: 8, age: 25, nat: 'Brasil', ovr: 74, pac: 74, sho: 62, pas: 75, dri: 74, def: 76, phy: 76 },
      { name: 'Jaume Grau', pos: 'CM', number: 6, age: 28, nat: 'España', ovr: 74, pac: 71, sho: 66, pas: 76, dri: 73, def: 73, phy: 75 },
      { name: 'Lucas Piazon', pos: 'CAM', number: 7, age: 31, nat: 'Brasil', ovr: 75, pac: 75, sho: 74, pas: 79, dri: 78, def: 55, phy: 68 },
      { name: 'John Mercado', pos: 'LW', number: 11, age: 23, nat: 'Ecuador', ovr: 74, pac: 86, sho: 72, pas: 70, dri: 78, def: 42, phy: 68 },
      { name: 'Rodrigo Ribeiro', pos: 'ST', number: 18, age: 20, nat: 'Portugal', ovr: 74, pac: 80, sho: 75, pas: 66, dri: 76, def: 38, phy: 72 },
      { name: 'Nenê Anderson', pos: 'ST', number: 9, age: 42, nat: 'Brasil', ovr: 74, pac: 60, sho: 79, pas: 72, dri: 74, def: 38, phy: 72 }
    ]
  },
  {
    id: 'nacional_madeira',
    name: 'CD Nacional',
    shortName: 'NAC',
    leagueId: 'portugal',
    city: 'Funchal',
    stadium: 'Estádio da Madeira',
    capacity: 5200,
    budget: 13,
    wageBudget: 85,
    primaryColor: '#000000',
    secondaryColor: '#ffffff',
    accentColor: '#1a1a1a',
    textColor: '#ffffff',
    kitPattern: 'stripes',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/8614.png',
    rawPlayers: [
      { name: 'Lucas França', pos: 'GK', number: 1, age: 29, nat: 'Brasil', ovr: 73, pac: 73, sho: 75, pas: 70, dri: 73, def: 42, phy: 74 },
      { name: 'Ulisses Wilson', pos: 'CB', number: 38, age: 26, nat: 'Brasil', ovr: 73, pac: 70, sho: 36, pas: 63, dri: 60, def: 74, phy: 78 },
      { name: 'Zé Vítor', pos: 'CB', number: 5, age: 24, nat: 'Brasil', ovr: 73, pac: 68, sho: 38, pas: 64, dri: 60, def: 74, phy: 80 },
      { name: 'José Gomes', pos: 'LB', number: 25, age: 28, nat: 'Portugal', ovr: 72, pac: 78, sho: 50, pas: 68, dri: 71, def: 71, phy: 72 },
      { name: 'Gustavo García', pos: 'RB', number: 22, age: 23, nat: 'Brasil', ovr: 73, pac: 81, sho: 52, pas: 69, dri: 73, def: 72, phy: 74 },
      { name: 'Matheus Dias', pos: 'CDM', number: 8, age: 23, nat: 'Brasil', ovr: 74, pac: 73, sho: 62, pas: 74, dri: 73, def: 75, phy: 78 },
      { name: 'Luís Esteves', pos: 'CM', number: 10, age: 27, nat: 'Portugal', ovr: 74, pac: 74, sho: 72, pas: 77, dri: 76, def: 68, phy: 72 },
      { name: 'Daniel Penha', pos: 'CAM', number: 70, age: 27, nat: 'Brasil', ovr: 74, pac: 76, sho: 73, pas: 77, dri: 77, def: 56, phy: 68 },
      { name: 'Nigel Thomas', pos: 'RW', number: 11, age: 24, nat: 'Curazao', ovr: 73, pac: 85, sho: 71, pas: 69, dri: 77, def: 42, phy: 68 },
      { name: 'Tiago Reis', pos: 'ST', number: 9, age: 26, nat: 'Brasil', ovr: 74, pac: 77, sho: 76, pas: 64, dri: 73, def: 38, phy: 79 },
      { name: 'Rubén Macedo', pos: 'LW', number: 7, age: 29, nat: 'Portugal', ovr: 73, pac: 82, sho: 71, pas: 71, dri: 76, def: 45, phy: 66 }
    ]
  },
  {
    id: 'farense',
    name: 'SC Farense',
    shortName: 'FAR',
    leagueId: 'portugal',
    city: 'Faro',
    stadium: 'Estádio de São Luís',
    capacity: 7000,
    budget: 14,
    wageBudget: 90,
    primaryColor: '#000000',
    secondaryColor: '#ffffff',
    accentColor: '#1a1a1a',
    textColor: '#ffffff',
    kitPattern: 'plain',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/8615.png',
    rawPlayers: [
      { name: 'Ricardo Velho', pos: 'GK', number: 33, age: 27, nat: 'Portugal', ovr: 77, pac: 77, sho: 79, pas: 74, dri: 77, def: 46, phy: 77 },
      { name: 'Artur Jorge', pos: 'CB', number: 4, age: 31, nat: 'Portugal', ovr: 74, pac: 66, sho: 38, pas: 65, dri: 60, def: 75, phy: 79 },
      { name: 'Lucas Áfrico', pos: 'CB', number: 44, age: 30, nat: 'Brasil', ovr: 73, pac: 68, sho: 36, pas: 62, dri: 58, def: 74, phy: 80 },
      { name: 'Derick Poloni', pos: 'LB', number: 31, age: 32, nat: 'Brasil', ovr: 73, pac: 78, sho: 56, pas: 71, dri: 73, def: 72, phy: 73 },
      { name: 'Pastor', pos: 'RB', number: 2, age: 25, nat: 'Brasil', ovr: 74, pac: 82, sho: 54, pas: 70, dri: 74, def: 73, phy: 75 },
      { name: 'Cláudio Falcão', pos: 'CDM', number: 29, age: 31, nat: 'Brasil', ovr: 74, pac: 70, sho: 64, pas: 73, dri: 72, def: 76, phy: 80 },
      { name: 'Ângelo Neto', pos: 'CM', number: 8, age: 34, nat: 'Brasil', ovr: 74, pac: 70, sho: 68, pas: 76, dri: 74, def: 73, phy: 76 },
      { name: 'Filipe Soares', pos: 'CM', number: 21, age: 26, nat: 'Portugal', ovr: 74, pac: 74, sho: 70, pas: 76, dri: 76, def: 72, phy: 73 },
      { name: 'Marco Matias', pos: 'RW', number: 77, age: 36, nat: 'Portugal', ovr: 74, pac: 77, sho: 75, pas: 75, dri: 76, def: 52, phy: 68 },
      { name: 'Tomane', pos: 'ST', number: 9, age: 33, nat: 'Portugal', ovr: 74, pac: 74, sho: 76, pas: 66, dri: 73, def: 42, phy: 81 },
      { name: 'Álex Bermejo', pos: 'LW', number: 11, age: 26, nat: 'España', ovr: 74, pac: 81, sho: 74, pas: 72, dri: 77, def: 45, phy: 68 }
    ]
  },
  {
    id: 'casa_pia',
    name: 'Casa Pia AC',
    shortName: 'CAS',
    leagueId: 'portugal',
    city: 'Lisboa',
    stadium: 'Estádio Pina Manique',
    capacity: 7000,
    budget: 14,
    wageBudget: 90,
    primaryColor: '#000000',
    secondaryColor: '#ffffff',
    accentColor: '#1a1a1a',
    textColor: '#ffffff',
    kitPattern: 'plain',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/7846.png',
    rawPlayers: [
      { name: 'Patrick Sequeira', pos: 'GK', number: 1, age: 26, nat: 'Costa Rica', ovr: 75, pac: 75, sho: 77, pas: 72, dri: 75, def: 44, phy: 75 },
      { name: 'Duplexe Tchamba', pos: 'CB', number: 3, age: 27, nat: 'Camerún', ovr: 74, pac: 72, sho: 36, pas: 64, dri: 62, def: 75, phy: 80 },
      { name: 'João Goulart', pos: 'CB', number: 4, age: 25, nat: 'Portugal', ovr: 73, pac: 70, sho: 38, pas: 65, dri: 62, def: 74, phy: 78 },
      { name: 'Leonardo Lelo', pos: 'LB', number: 5, age: 25, nat: 'Portugal', ovr: 75, pac: 80, sho: 64, pas: 74, dri: 75, def: 73, phy: 74 },
      { name: 'Gaizka Larrazabal', pos: 'RB', number: 72, age: 27, nat: 'España', ovr: 74, pac: 84, sho: 62, pas: 72, dri: 75, def: 72, phy: 74 },
      { name: 'Télamo Miguel', pos: 'CDM', number: 8, age: 24, nat: 'Portugal', ovr: 73, pac: 73, sho: 60, pas: 73, dri: 72, def: 75, phy: 77 },
      { name: 'Rafael Brito', pos: 'CM', number: 14, age: 23, nat: 'Portugal', ovr: 73, pac: 74, sho: 64, pas: 75, dri: 74, def: 72, phy: 73 },
      { name: 'Nuno Moreira', pos: 'LW', number: 7, age: 26, nat: 'Portugal', ovr: 75, pac: 83, sho: 74, pas: 75, dri: 79, def: 48, phy: 68 },
      { name: 'Ruben Kluivert', pos: 'CB', number: 2, age: 24, nat: 'Países Bajos', ovr: 73, pac: 72, sho: 38, pas: 65, dri: 63, def: 74, phy: 78 },
      { name: 'Cassiano Moreira', pos: 'ST', number: 9, age: 36, nat: 'Brasil', ovr: 74, pac: 72, sho: 77, pas: 64, dri: 73, def: 40, phy: 80 },
      { name: 'Max Svensson', pos: 'ST', number: 11, age: 23, nat: 'España', ovr: 73, pac: 82, sho: 74, pas: 64, dri: 74, def: 42, phy: 75 }
    ]
  },
  {
    id: 'estrela_amadora',
    name: 'CF Estrela da Amadora',
    shortName: 'EST',
    leagueId: 'portugal',
    city: 'Amadora',
    stadium: 'Estádio José Gomes',
    capacity: 9288,
    budget: 14,
    wageBudget: 95,
    primaryColor: '#c3281e',
    secondaryColor: '#006633',
    accentColor: '#ffffff',
    textColor: '#ffffff',
    kitPattern: 'stripes',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/1251392.png',
    rawPlayers: [
      { name: 'Bruno Brígido', pos: 'GK', number: 30, age: 34, nat: 'Brasil', ovr: 74, pac: 73, sho: 75, pas: 70, dri: 73, def: 44, phy: 74 },
      { name: 'Ferro', pos: 'CB', number: 4, age: 28, nat: 'Portugal', ovr: 74, pac: 68, sho: 40, pas: 68, dri: 63, def: 75, phy: 78 },
      { name: 'Issiar Dramé', pos: 'CB', number: 13, age: 26, nat: 'Francia', ovr: 73, pac: 70, sho: 34, pas: 60, dri: 57, def: 74, phy: 84 },
      { name: 'Ruben Lima', pos: 'LB', number: 5, age: 35, nat: 'Portugal', ovr: 73, pac: 74, sho: 58, pas: 73, dri: 72, def: 72, phy: 72 },
      { name: 'Danilo Veiga', pos: 'RB', number: 22, age: 22, nat: 'Portugal', ovr: 73, pac: 83, sho: 52, pas: 69, dri: 73, def: 72, phy: 74 },
      { name: 'Igor Jesus', pos: 'CDM', number: 6, age: 22, nat: 'Brasil', ovr: 73, pac: 73, sho: 60, pas: 73, dri: 72, def: 75, phy: 78 },
      { name: 'Leonel Bucca', pos: 'CM', number: 18, age: 26, nat: 'Argentina', ovr: 73, pac: 73, sho: 68, pas: 74, dri: 74, def: 72, phy: 76 },
      { name: 'Alan Ruiz', pos: 'CAM', number: 10, age: 32, nat: 'Argentina', ovr: 75, pac: 68, sho: 77, pas: 80, dri: 78, def: 54, phy: 72 },
      { name: 'Nani', pos: 'LW', number: 17, age: 38, nat: 'Portugal', ovr: 76, pac: 73, sho: 78, pas: 79, dri: 81, def: 42, phy: 66 },
      { name: 'Kikas', pos: 'ST', number: 9, age: 27, nat: 'Portugal', ovr: 74, pac: 80, sho: 76, pas: 65, dri: 74, def: 40, phy: 78 },
      { name: 'André Luiz', pos: 'RW', number: 7, age: 23, nat: 'Brasil', ovr: 74, pac: 85, sho: 72, pas: 70, dri: 78, def: 42, phy: 68 }
    ]
  },
  {
    id: 'arouca',
    name: 'FC Arouca',
    shortName: 'ARO',
    leagueId: 'portugal',
    city: 'Arouca',
    stadium: 'Estádio Municipal de Arouca',
    capacity: 5600,
    budget: 15,
    wageBudget: 100,
    primaryColor: '#f7d117',
    secondaryColor: '#002f6c',
    accentColor: '#ffffff',
    textColor: '#002f6c',
    kitPattern: 'plain',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/7847.png',
    rawPlayers: [
      { name: 'Nico Mantl', pos: 'GK', number: 1, age: 25, nat: 'Alemania', ovr: 74, pac: 74, sho: 76, pas: 72, dri: 75, def: 42, phy: 75 },
      { name: 'Boris Popović', pos: 'CB', number: 44, age: 25, nat: 'Serbia', ovr: 74, pac: 70, sho: 38, pas: 65, dri: 62, def: 75, phy: 80 },
      { name: 'José Fontán', pos: 'CB', number: 6, age: 25, nat: 'España', ovr: 74, pac: 72, sho: 42, pas: 70, dri: 66, def: 75, phy: 76 },
      { name: 'Weverson', pos: 'LB', number: 26, age: 25, nat: 'Brasil', ovr: 73, pac: 79, sho: 54, pas: 70, dri: 73, def: 72, phy: 72 },
      { name: 'Tiago Esgaio', pos: 'RB', number: 28, age: 30, nat: 'Portugal', ovr: 74, pac: 78, sho: 60, pas: 72, dri: 74, def: 73, phy: 74 },
      { name: 'David Simão', pos: 'CM', number: 5, age: 35, nat: 'Portugal', ovr: 76, pac: 66, sho: 74, pas: 82, dri: 77, def: 72, phy: 70 },
      { name: 'Taichi Fukui', pos: 'CM', number: 8, age: 21, nat: 'Japón', ovr: 73, pac: 76, sho: 68, pas: 76, dri: 76, def: 68, phy: 70 },
      { name: 'Morlaye Sylla', pos: 'CAM', number: 2, age: 27, nat: 'Guinea', ovr: 75, pac: 77, sho: 73, pas: 77, dri: 79, def: 62, phy: 72 },
      { name: 'Jason Remeseiro', pos: 'RW', number: 10, age: 31, nat: 'España', ovr: 76, pac: 80, sho: 75, pas: 77, dri: 78, def: 55, phy: 70 },
      { name: 'Alfonso Trezza', pos: 'LW', number: 14, age: 26, nat: 'Uruguay', ovr: 74, pac: 84, sho: 72, pas: 71, dri: 77, def: 48, phy: 72 },
      { name: 'Güven Yalçın', pos: 'ST', number: 9, age: 26, nat: 'Turquía', ovr: 74, pac: 78, sho: 76, pas: 68, dri: 75, def: 38, phy: 76 }
    ]
  }
];

async function main() {
  console.log(`Starting Batch 2 injection (Portugal complete)...`);
  console.log(`Total new clubs to process: ${BATCH2_CLUBS.length}`);

  let totalPlayers = 0;
  let photosFound = 0;
  let defaultAvatars = 0;

  const processedClubs = [];

  for (const rawClub of BATCH2_CLUBS) {
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
        nat: p.nat || 'Portugal'
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

  console.log(`\nProcessed ${processedClubs.length} clubs and ${totalPlayers} players (${photosFound} authentic photos).`);

  // Load existing database
  const dbPath = path.resolve(__dirname, '../src/data/database.json');
  const publicDbPath = path.resolve(__dirname, '../public/database.json');
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

  // Add or update clubs
  for (const nClub of processedClubs) {
    const existingIdx = db.clubs.findIndex(c => c.id === nClub.id);
    if (existingIdx !== -1) {
      db.clubs[existingIdx] = nClub;
    } else {
      db.clubs.push(nClub);
    }
  }

  // Write files
  const formattedJson = JSON.stringify(db, null, 2);
  fs.writeFileSync(dbPath, formattedJson, 'utf8');
  fs.writeFileSync(publicDbPath, formattedJson, 'utf8');
  fs.writeFileSync(photoMapPath, JSON.stringify(photoMap, null, 2), 'utf8');

  console.log(`Database updated successfully! Total clubs now: ${db.clubs.length}`);
}

main().catch(console.error);
