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

// Full club expansion definitions
const ALL_EXPANDED_CLUBS = [
  // -------------------- 1. SCOTLAND (8 remaining clubs to reach 12) --------------------
  {
    id: 'hibernian',
    name: 'Hibernian FC',
    shortName: 'HIB',
    leagueId: 'scotland',
    city: 'Edimburgo',
    stadium: 'Easter Road',
    capacity: 20421,
    budget: 14,
    wageBudget: 100,
    primaryColor: '#005a36',
    secondaryColor: '#ffffff',
    accentColor: '#1a1a1a',
    textColor: '#ffffff',
    kitPattern: 'plain',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/10251.png',
    rawPlayers: [
      { name: 'Josef Bursik', pos: 'GK', number: 1, age: 24, nat: 'Inglaterra', ovr: 74, pac: 73, sho: 75, pas: 72, dri: 74, def: 44, phy: 75 },
      { name: 'Warren O Hora', pos: 'CB', number: 4, age: 25, nat: 'Irlanda', ovr: 74, pac: 72, sho: 38, pas: 65, dri: 62, def: 75, phy: 78 },
      { name: 'Marvin Ekpiteta', pos: 'CB', number: 5, age: 29, nat: 'Inglaterra', ovr: 74, pac: 68, sho: 35, pas: 60, dri: 58, def: 75, phy: 82 },
      { name: 'Jordan Obita', pos: 'LB', number: 3, age: 31, nat: 'Inglaterra', ovr: 74, pac: 76, sho: 60, pas: 72, dri: 73, def: 73, phy: 74 },
      { name: 'Lewis Miller', pos: 'RB', number: 2, age: 24, nat: 'Australia', ovr: 74, pac: 80, sho: 52, pas: 68, dri: 71, def: 73, phy: 76 },
      { name: 'Joe Newell', pos: 'CM', number: 11, age: 32, nat: 'Inglaterra', ovr: 75, pac: 71, sho: 71, pas: 78, dri: 75, def: 72, phy: 74 },
      { name: 'Hyeon-gyu Kwon', pos: 'CDM', number: 6, age: 24, nat: 'Corea del Sur', ovr: 73, pac: 74, sho: 60, pas: 73, dri: 72, def: 74, phy: 76 },
      { name: 'Josh Campbell', pos: 'CAM', number: 32, age: 25, nat: 'Escocia', ovr: 73, pac: 75, sho: 70, pas: 73, dri: 74, def: 64, phy: 72 },
      { name: 'Martin Boyle', pos: 'RW', number: 10, age: 32, nat: 'Australia', ovr: 76, pac: 88, sho: 76, pas: 73, dri: 78, def: 48, phy: 72 },
      { name: 'Élie Youan', pos: 'LW', number: 23, age: 26, nat: 'Francia', ovr: 75, pac: 86, sho: 74, pas: 70, dri: 78, def: 40, phy: 74 },
      { name: 'Mykola Kukharevych', pos: 'ST', number: 99, age: 24, nat: 'Ucrania', ovr: 73, pac: 76, sho: 74, pas: 60, dri: 70, def: 35, phy: 78 }
    ]
  },
  {
    id: 'kilmarnock',
    name: 'Kilmarnock FC',
    shortName: 'KIL',
    leagueId: 'scotland',
    city: 'Kilmarnock',
    stadium: 'Rugby Park',
    capacity: 17889,
    budget: 10,
    wageBudget: 80,
    primaryColor: '#002f6c',
    secondaryColor: '#ffffff',
    accentColor: '#1a1a1a',
    textColor: '#ffffff',
    kitPattern: 'stripes',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/8597.png',
    rawPlayers: [
      { name: 'Kieran O Hara', pos: 'GK', number: 1, age: 29, nat: 'Irlanda', ovr: 73, pac: 72, sho: 74, pas: 68, dri: 72, def: 42, phy: 74 },
      { name: 'Robbie Deas', pos: 'CB', number: 5, age: 25, nat: 'Escocia', ovr: 73, pac: 68, sho: 36, pas: 62, dri: 58, def: 74, phy: 78 },
      { name: 'Stuart Findlay', pos: 'CB', number: 6, age: 29, nat: 'Escocia', ovr: 74, pac: 70, sho: 40, pas: 64, dri: 60, def: 75, phy: 80 },
      { name: 'Corrie Ndaba', pos: 'LB', number: 4, age: 25, nat: 'Irlanda', ovr: 73, pac: 76, sho: 48, pas: 68, dri: 70, def: 73, phy: 76 },
      { name: 'Lewis Mayo', pos: 'RB', number: 2, age: 25, nat: 'Escocia', ovr: 73, pac: 74, sho: 42, pas: 66, dri: 65, def: 74, phy: 76 },
      { name: 'David Watson', pos: 'CM', number: 22, age: 20, nat: 'Escocia', ovr: 74, pac: 76, sho: 72, pas: 75, dri: 75, def: 72, phy: 74 },
      { name: 'Liam Polworth', pos: 'CM', number: 8, age: 30, nat: 'Escocia', ovr: 73, pac: 68, sho: 68, pas: 76, dri: 73, def: 68, phy: 70 },
      { name: 'Danny Armstrong', pos: 'RW', number: 11, age: 28, nat: 'Escocia', ovr: 75, pac: 80, sho: 74, pas: 76, dri: 77, def: 52, phy: 68 },
      { name: 'Matty Kennedy', pos: 'LW', number: 17, age: 30, nat: 'Irlanda del Norte', ovr: 73, pac: 81, sho: 70, pas: 72, dri: 75, def: 46, phy: 66 },
      { name: 'Kyle Vassell', pos: 'ST', number: 9, age: 32, nat: 'Irlanda del Norte', ovr: 74, pac: 74, sho: 76, pas: 64, dri: 72, def: 42, phy: 85 },
      { name: 'Marley Watkins', pos: 'ST', number: 23, age: 34, nat: 'Gales', ovr: 73, pac: 75, sho: 73, pas: 66, dri: 73, def: 44, phy: 76 }
    ]
  },
  {
    id: 'motherwell',
    name: 'Motherwell FC',
    shortName: 'MOT',
    leagueId: 'scotland',
    city: 'Motherwell',
    stadium: 'Fir Park',
    capacity: 13677,
    budget: 10,
    wageBudget: 80,
    primaryColor: '#c5a059',
    secondaryColor: '#800000',
    accentColor: '#ffffff',
    textColor: '#800000',
    kitPattern: 'hoops',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/9990.png',
    rawPlayers: [
      { name: 'Aston Oxborough', pos: 'GK', number: 13, age: 27, nat: 'Inglaterra', ovr: 73, pac: 72, sho: 75, pas: 70, dri: 73, def: 42, phy: 74 },
      { name: 'Dan Casey', pos: 'CB', number: 5, age: 27, nat: 'Irlanda', ovr: 74, pac: 68, sho: 40, pas: 64, dri: 60, def: 75, phy: 80 },
      { name: 'Paul McGinn', pos: 'CB', number: 16, age: 34, nat: 'Escocia', ovr: 73, pac: 66, sho: 44, pas: 66, dri: 62, def: 74, phy: 76 },
      { name: 'Stephen O Donnell', pos: 'RWB', number: 2, age: 33, nat: 'Escocia', ovr: 73, pac: 74, sho: 56, pas: 70, dri: 71, def: 73, phy: 74 },
      { name: 'Ewan Wilson', pos: 'LWB', number: 23, age: 20, nat: 'Escocia', ovr: 72, pac: 80, sho: 52, pas: 67, dri: 72, def: 70, phy: 70 },
      { name: 'Lennon Miller', pos: 'CM', number: 8, age: 19, nat: 'Escocia', ovr: 75, pac: 76, sho: 72, pas: 78, dri: 77, def: 70, phy: 72 },
      { name: 'Andy Halliday', pos: 'CM', number: 11, age: 33, nat: 'Escocia', ovr: 73, pac: 68, sho: 70, pas: 74, dri: 72, def: 72, phy: 75 },
      { name: 'Tom Sparrow', pos: 'CM', number: 18, age: 22, nat: 'Gales', ovr: 72, pac: 74, sho: 64, pas: 71, dri: 72, def: 68, phy: 72 },
      { name: 'Tawanda Maswanhise', pos: 'RW', number: 55, age: 22, nat: 'Zimbabue', ovr: 73, pac: 85, sho: 71, pas: 68, dri: 76, def: 42, phy: 66 },
      { name: 'Apostolos Stamatelopoulos', pos: 'ST', number: 9, age: 26, nat: 'Australia', ovr: 74, pac: 78, sho: 76, pas: 65, dri: 73, def: 38, phy: 77 },
      { name: 'Zach Robinson', pos: 'ST', number: 17, age: 23, nat: 'Inglaterra', ovr: 72, pac: 79, sho: 73, pas: 60, dri: 71, def: 35, phy: 75 }
    ]
  },
  {
    id: 'dundee_fc',
    name: 'Dundee FC',
    shortName: 'DND',
    leagueId: 'scotland',
    city: 'Dundee',
    stadium: 'Dens Park',
    capacity: 11775,
    budget: 10,
    wageBudget: 75,
    primaryColor: '#002f6c',
    secondaryColor: '#ffffff',
    accentColor: '#c3281e',
    textColor: '#ffffff',
    kitPattern: 'plain',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/8596.png',
    rawPlayers: [
      { name: 'Trevor Carson', pos: 'GK', number: 1, age: 37, nat: 'Irlanda del Norte', ovr: 73, pac: 70, sho: 74, pas: 68, dri: 72, def: 44, phy: 73 },
      { name: 'Antonio Portales', pos: 'CB', number: 5, age: 29, nat: 'México', ovr: 74, pac: 70, sho: 40, pas: 65, dri: 62, def: 75, phy: 79 },
      { name: 'Clark Robertson', pos: 'CB', number: 4, age: 32, nat: 'Escocia', ovr: 73, pac: 66, sho: 42, pas: 65, dri: 60, def: 74, phy: 77 },
      { name: 'Ziyad Larkeche', pos: 'LB', number: 3, age: 22, nat: 'Francia', ovr: 72, pac: 80, sho: 54, pas: 69, dri: 73, def: 71, phy: 70 },
      { name: 'Ethan Ingram', pos: 'RB', number: 2, age: 22, nat: 'Inglaterra', ovr: 72, pac: 82, sho: 50, pas: 67, dri: 71, def: 71, phy: 73 },
      { name: 'Mohamad Sylla', pos: 'CDM', number: 6, age: 31, nat: 'Francia', ovr: 73, pac: 72, sho: 58, pas: 72, dri: 71, def: 75, phy: 80 },
      { name: 'Lyall Cameron', pos: 'CM', number: 17, age: 23, nat: 'Escocia', ovr: 75, pac: 77, sho: 74, pas: 76, dri: 77, def: 68, phy: 72 },
      { name: 'Finlay Robertson', pos: 'CM', number: 28, age: 22, nat: 'Escocia', ovr: 72, pac: 73, sho: 65, pas: 74, dri: 73, def: 68, phy: 70 },
      { name: 'Scott Tiffoney', pos: 'LW', number: 7, age: 27, nat: 'Escocia', ovr: 73, pac: 83, sho: 72, pas: 68, dri: 75, def: 44, phy: 68 },
      { name: 'Simon Murray', pos: 'ST', number: 9, age: 33, nat: 'Escocia', ovr: 74, pac: 78, sho: 76, pas: 65, dri: 73, def: 45, phy: 78 },
      { name: 'Seb Palmer-Houlden', pos: 'ST', number: 19, age: 21, nat: 'Inglaterra', ovr: 72, pac: 79, sho: 72, pas: 60, dri: 70, def: 36, phy: 76 }
    ]
  },
  {
    id: 'dundee_utd',
    name: 'Dundee United',
    shortName: 'DUT',
    leagueId: 'scotland',
    city: 'Dundee',
    stadium: 'Tannadice Park',
    capacity: 14223,
    budget: 11,
    wageBudget: 80,
    primaryColor: '#f37021',
    secondaryColor: '#000000',
    accentColor: '#ffffff',
    textColor: '#ffffff',
    kitPattern: 'plain',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/9992.png',
    rawPlayers: [
      { name: 'Jack Walton', pos: 'GK', number: 1, age: 27, nat: 'Inglaterra', ovr: 73, pac: 72, sho: 74, pas: 70, dri: 73, def: 42, phy: 74 },
      { name: 'Emmanuel Adegboyega', pos: 'CB', number: 5, age: 21, nat: 'Irlanda', ovr: 73, pac: 74, sho: 38, pas: 63, dri: 62, def: 74, phy: 79 },
      { name: 'Declan Gallagher', pos: 'CB', number: 31, age: 34, nat: 'Escocia', ovr: 74, pac: 62, sho: 40, pas: 64, dri: 56, def: 76, phy: 84 },
      { name: 'Will Ferry', pos: 'LB', number: 3, age: 24, nat: 'Irlanda', ovr: 73, pac: 80, sho: 56, pas: 71, dri: 74, def: 72, phy: 72 },
      { name: 'Luca Stephenson', pos: 'RB', number: 22, age: 22, nat: 'Inglaterra', ovr: 73, pac: 78, sho: 58, pas: 70, dri: 73, def: 73, phy: 74 },
      { name: 'Craig Sibbald', pos: 'CM', number: 14, age: 30, nat: 'Escocia', ovr: 74, pac: 72, sho: 71, pas: 77, dri: 75, def: 72, phy: 74 },
      { name: 'David Babunski', pos: 'CAM', number: 10, age: 31, nat: 'Macedonia del Norte', ovr: 74, pac: 73, sho: 73, pas: 78, dri: 77, def: 55, phy: 68 },
      { name: 'Vicko Ševelj', pos: 'CDM', number: 4, age: 25, nat: 'Croacia', ovr: 73, pac: 73, sho: 56, pas: 72, dri: 71, def: 74, phy: 76 },
      { name: 'Kristijan Trapanovski', pos: 'LW', number: 7, age: 26, nat: 'Macedonia del Norte', ovr: 74, pac: 85, sho: 73, pas: 71, dri: 77, def: 42, phy: 66 },
      { name: 'Glenn Middleton', pos: 'RW', number: 15, age: 25, nat: 'Escocia', ovr: 73, pac: 84, sho: 71, pas: 71, dri: 76, def: 45, phy: 68 },
      { name: 'Jort van der Sande', pos: 'ST', number: 9, age: 29, nat: 'Bonaire', ovr: 73, pac: 74, sho: 74, pas: 68, dri: 73, def: 42, phy: 78 }
    ]
  },
  {
    id: 'st_mirren',
    name: 'St. Mirren FC',
    shortName: 'STM',
    leagueId: 'scotland',
    city: 'Paisley',
    stadium: 'St. Mirren Park',
    capacity: 7937,
    budget: 10,
    wageBudget: 75,
    primaryColor: '#000000',
    secondaryColor: '#ffffff',
    accentColor: '#1a1a1a',
    textColor: '#ffffff',
    kitPattern: 'stripes',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/8598.png',
    rawPlayers: [
      { name: 'Ellery Balcombe', pos: 'GK', number: 1, age: 25, nat: 'Inglaterra', ovr: 73, pac: 73, sho: 74, pas: 70, dri: 73, def: 42, phy: 74 },
      { name: 'Alex Gogić', pos: 'CB', number: 5, age: 31, nat: 'Chipre', ovr: 75, pac: 68, sho: 52, pas: 68, dri: 65, def: 77, phy: 84 },
      { name: 'Marcus Fraser', pos: 'CB', number: 22, age: 31, nat: 'Escocia', ovr: 73, pac: 70, sho: 40, pas: 65, dri: 63, def: 74, phy: 76 },
      { name: 'Richard Taylor', pos: 'CB', number: 6, age: 25, nat: 'Inglaterra', ovr: 73, pac: 72, sho: 36, pas: 64, dri: 62, def: 74, phy: 79 },
      { name: 'Elvis Bwomono', pos: 'RWB', number: 19, age: 26, nat: 'Uganda', ovr: 72, pac: 80, sho: 48, pas: 67, dri: 71, def: 72, phy: 74 },
      { name: 'Scott Tanser', pos: 'LWB', number: 3, age: 30, nat: 'Inglaterra', ovr: 73, pac: 77, sho: 58, pas: 72, dri: 73, def: 72, phy: 74 },
      { name: 'Mark O Hara', pos: 'CM', number: 8, age: 29, nat: 'Escocia', ovr: 74, pac: 73, sho: 73, pas: 75, dri: 74, def: 73, phy: 78 },
      { name: 'Caolan Boyd-Munce', pos: 'CM', number: 14, age: 25, nat: 'Irlanda del Norte', ovr: 73, pac: 74, sho: 68, pas: 76, dri: 75, def: 68, phy: 70 },
      { name: 'Killian Phillips', pos: 'CM', number: 18, age: 23, nat: 'Irlanda', ovr: 72, pac: 74, sho: 66, pas: 72, dri: 73, def: 71, phy: 77 },
      { name: 'Toyosi Olusanya', pos: 'ST', number: 20, age: 27, nat: 'Inglaterra', ovr: 74, pac: 87, sho: 74, pas: 64, dri: 75, def: 42, phy: 78 },
      { name: 'Mikael Mandron', pos: 'ST', number: 9, age: 30, nat: 'Francia', ovr: 73, pac: 72, sho: 74, pas: 64, dri: 70, def: 40, phy: 82 }
    ]
  },
  {
    id: 'st_johnstone',
    name: 'St. Johnstone FC',
    shortName: 'STJ',
    leagueId: 'scotland',
    city: 'Perth',
    stadium: 'McDiarmid Park',
    capacity: 10696,
    budget: 9,
    wageBudget: 70,
    primaryColor: '#002f6c',
    secondaryColor: '#ffffff',
    accentColor: '#1a1a1a',
    textColor: '#ffffff',
    kitPattern: 'plain',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/8599.png',
    rawPlayers: [
      { name: 'Ross Sinclair', pos: 'GK', number: 1, age: 24, nat: 'Escocia', ovr: 72, pac: 71, sho: 73, pas: 68, dri: 71, def: 40, phy: 72 },
      { name: 'Kyle Cameron', pos: 'CB', number: 5, age: 28, nat: 'Inglaterra', ovr: 73, pac: 68, sho: 40, pas: 63, dri: 60, def: 74, phy: 79 },
      { name: 'Jack Sanders', pos: 'CB', number: 4, age: 26, nat: 'Inglaterra', ovr: 72, pac: 66, sho: 36, pas: 60, dri: 56, def: 73, phy: 80 },
      { name: 'Andre Raymond', pos: 'LB', number: 3, age: 24, nat: 'Trinidad y Tobago', ovr: 72, pac: 81, sho: 50, pas: 67, dri: 72, def: 71, phy: 72 },
      { name: 'Drey Wright', pos: 'RB', number: 2, age: 30, nat: 'Inglaterra', ovr: 73, pac: 78, sho: 62, pas: 71, dri: 73, def: 72, phy: 73 },
      { name: 'Matt Smith', pos: 'CM', number: 8, age: 25, nat: 'Gales', ovr: 74, pac: 74, sho: 68, pas: 77, dri: 76, def: 71, phy: 72 },
      { name: 'Jason Holt', pos: 'CM', number: 18, age: 32, nat: 'Escocia', ovr: 73, pac: 71, sho: 67, pas: 75, dri: 73, def: 71, phy: 72 },
      { name: 'Graham Carey', pos: 'CAM', number: 11, age: 36, nat: 'Irlanda', ovr: 73, pac: 66, sho: 76, pas: 77, dri: 74, def: 55, phy: 68 },
      { name: 'Benjamin Kimpioka', pos: 'ST', number: 22, age: 25, nat: 'Suecia', ovr: 74, pac: 85, sho: 75, pas: 66, dri: 77, def: 38, phy: 74 },
      { name: 'Adama Sidibeh', pos: 'ST', number: 9, age: 27, nat: 'Gambia', ovr: 73, pac: 84, sho: 74, pas: 62, dri: 73, def: 40, phy: 76 },
      { name: 'Nicky Clark', pos: 'ST', number: 10, age: 34, nat: 'Escocia', ovr: 72, pac: 68, sho: 75, pas: 66, dri: 71, def: 40, phy: 72 }
    ]
  },
  {
    id: 'ross_county',
    name: 'Ross County FC',
    shortName: 'ROS',
    leagueId: 'scotland',
    city: 'Dingwall',
    stadium: 'Victoria Park',
    capacity: 6541,
    budget: 9,
    wageBudget: 70,
    primaryColor: '#001489',
    secondaryColor: '#c3281e',
    accentColor: '#ffffff',
    textColor: '#ffffff',
    kitPattern: 'plain',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/8594.png',
    rawPlayers: [
      { name: 'Ross Laidlaw', pos: 'GK', number: 1, age: 33, nat: 'Escocia', ovr: 72, pac: 70, sho: 73, pas: 68, dri: 71, def: 42, phy: 73 },
      { name: 'Akpan Wright', pos: 'CB', number: 5, age: 28, nat: 'Inglaterra', ovr: 73, pac: 68, sho: 36, pas: 61, dri: 57, def: 74, phy: 80 },
      { name: 'Michee Efete', pos: 'RB', number: 2, age: 28, nat: 'RD del Congo', ovr: 72, pac: 79, sho: 48, pas: 66, dri: 70, def: 71, phy: 75 },
      { name: 'Ryan Leak', pos: 'CB', number: 4, age: 27, nat: 'Gales', ovr: 72, pac: 66, sho: 38, pas: 62, dri: 58, def: 73, phy: 78 },
      { name: 'Connor Randall', pos: 'CM', number: 6, age: 29, nat: 'Inglaterra', ovr: 73, pac: 73, sho: 60, pas: 73, dri: 72, def: 74, phy: 76 },
      { name: 'Joshua Nisbet', pos: 'CM', number: 8, age: 26, nat: 'Australia', ovr: 74, pac: 78, sho: 68, pas: 76, dri: 77, def: 68, phy: 66 },
      { name: 'Noah Chilvers', pos: 'CAM', number: 10, age: 24, nat: 'Inglaterra', ovr: 73, pac: 75, sho: 71, pas: 75, dri: 75, def: 60, phy: 68 },
      { name: 'Aidan Denholm', pos: 'CM', number: 17, age: 21, nat: 'Escocia', ovr: 71, pac: 74, sho: 64, pas: 71, dri: 72, def: 67, phy: 70 },
      { name: 'Ronan Hale', pos: 'ST', number: 9, age: 26, nat: 'Irlanda del Norte', ovr: 74, pac: 80, sho: 76, pas: 66, dri: 74, def: 38, phy: 74 },
      { name: 'Jordan White', pos: 'ST', number: 26, age: 33, nat: 'Escocia', ovr: 73, pac: 65, sho: 75, pas: 64, dri: 68, def: 44, phy: 85 },
      { name: 'Eamonn Brophy', pos: 'ST', number: 7, age: 29, nat: 'Escocia', ovr: 72, pac: 76, sho: 73, pas: 64, dri: 72, def: 38, phy: 74 }
    ]
  },

  // -------------------- 2. BELGIUM (12 remaining clubs to reach 16) --------------------
  {
    id: 'kaa_gent',
    name: 'KAA Gent',
    shortName: 'GNT',
    leagueId: 'belgium',
    city: 'Gante',
    stadium: 'Planet Group Arena',
    capacity: 20175,
    budget: 32,
    wageBudget: 200,
    primaryColor: '#0055a5',
    secondaryColor: '#ffffff',
    accentColor: '#1a1a1a',
    textColor: '#ffffff',
    kitPattern: 'plain',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/9991.png',
    rawPlayers: [
      { name: 'Davy Roef', pos: 'GK', number: 33, age: 31, nat: 'Bélgica', ovr: 76, pac: 75, sho: 77, pas: 73, dri: 75, def: 45, phy: 76 },
      { name: 'Stefan Mitrović', pos: 'CB', number: 20, age: 35, nat: 'Serbia', ovr: 75, pac: 60, sho: 40, pas: 65, dri: 58, def: 77, phy: 80 },
      { name: 'Tsuyoshi Watanabe', pos: 'CB', number: 4, age: 28, nat: 'Japón', ovr: 76, pac: 72, sho: 42, pas: 66, dri: 64, def: 77, phy: 78 },
      { name: 'Archie Brown', pos: 'LB', number: 3, age: 23, nat: 'Inglaterra', ovr: 76, pac: 85, sho: 60, pas: 72, dri: 77, def: 73, phy: 78 },
      { name: 'Hugo Gambor', pos: 'RB', number: 22, age: 22, nat: 'Francia', ovr: 74, pac: 78, sho: 50, pas: 68, dri: 71, def: 74, phy: 76 },
      { name: 'Atsuki Ito', pos: 'CDM', number: 15, age: 26, nat: 'Japón', ovr: 75, pac: 74, sho: 66, pas: 75, dri: 74, def: 75, phy: 77 },
      { name: 'Sven Kums', pos: 'CM', number: 24, age: 37, nat: 'Bélgica', ovr: 76, pac: 62, sho: 72, pas: 82, dri: 76, def: 74, phy: 70 },
      { name: 'Omri Gandelman', pos: 'CM', number: 6, age: 25, nat: 'Israel', ovr: 77, pac: 76, sho: 77, pas: 76, dri: 76, def: 74, phy: 80 },
      { name: 'Mathias Delorge', pos: 'CAM', number: 16, age: 20, nat: 'Bélgica', ovr: 75, pac: 76, sho: 71, pas: 78, dri: 78, def: 70, phy: 74 },
      { name: 'Max Dean', pos: 'ST', number: 9, age: 21, nat: 'Inglaterra', ovr: 76, pac: 80, sho: 78, pas: 68, dri: 76, def: 42, phy: 76 },
      { name: 'Andri Guðjohnsen', pos: 'ST', number: 19, age: 23, nat: 'Islandia', ovr: 75, pac: 76, sho: 77, pas: 66, dri: 73, def: 38, phy: 80 }
    ]
  },
  {
    id: 'antwerp',
    name: 'Royal Antwerp FC',
    shortName: 'ANT',
    leagueId: 'belgium',
    city: 'Amberes',
    stadium: 'Bosuilstadion',
    capacity: 16144,
    budget: 35,
    wageBudget: 220,
    primaryColor: '#c3281e',
    secondaryColor: '#ffffff',
    accentColor: '#1a1a1a',
    textColor: '#ffffff',
    kitPattern: 'plain',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/9988.png',
    rawPlayers: [
      { name: 'Senne Lammens', pos: 'GK', number: 1, age: 23, nat: 'Bélgica', ovr: 76, pac: 76, sho: 78, pas: 72, dri: 76, def: 45, phy: 76 },
      { name: 'Toby Alderweireld', pos: 'CB', number: 23, age: 36, nat: 'Bélgica', ovr: 80, pac: 58, sho: 68, pas: 80, dri: 68, def: 83, phy: 78 },
      { name: 'Zeno Van Den Bosch', pos: 'CB', number: 33, age: 22, nat: 'Bélgica', ovr: 76, pac: 72, sho: 40, pas: 68, dri: 66, def: 77, phy: 77 },
      { name: 'Jelle Bataille', pos: 'RB', number: 25, age: 26, nat: 'Bélgica', ovr: 75, pac: 80, sho: 58, pas: 72, dri: 74, def: 74, phy: 75 },
      { name: 'Kobe Corbanie', pos: 'LB', number: 2, age: 20, nat: 'Bélgica', ovr: 73, pac: 78, sho: 52, pas: 69, dri: 73, def: 72, phy: 72 },
      { name: 'Denis Odoi', pos: 'CDM', number: 6, age: 37, nat: 'Ghana', ovr: 74, pac: 70, sho: 58, pas: 72, dri: 71, def: 76, phy: 77 },
      { name: 'Mahamadou Doumbia', pos: 'CM', number: 8, age: 21, nat: 'Malí', ovr: 75, pac: 76, sho: 72, pas: 76, dri: 77, def: 72, phy: 76 },
      { name: 'Tjaronn Chery', pos: 'CAM', number: 10, age: 37, nat: 'Surinam', ovr: 77, pac: 74, sho: 80, pas: 80, dri: 79, def: 52, phy: 68 },
      { name: 'Gyrano Kerk', pos: 'RW', number: 7, age: 29, nat: 'Surinam', ovr: 76, pac: 88, sho: 74, pas: 72, dri: 79, def: 48, phy: 74 },
      { name: 'Vincent Janssen', pos: 'ST', number: 18, age: 31, nat: 'Países Bajos', ovr: 79, pac: 74, sho: 82, pas: 74, dri: 76, def: 48, phy: 84 },
      { name: 'Jacob Ondrejka', pos: 'LW', number: 11, age: 22, nat: 'Suecia', ovr: 76, pac: 84, sho: 75, pas: 74, dri: 80, def: 44, phy: 68 }
    ]
  },
  {
    id: 'standard_liege',
    name: 'Standard de Liège',
    shortName: 'STA',
    leagueId: 'belgium',
    city: 'Lieja',
    stadium: 'Stade Maurice Dufrasne',
    capacity: 27670,
    budget: 24,
    wageBudget: 160,
    primaryColor: '#c3281e',
    secondaryColor: '#ffffff',
    accentColor: '#1a1a1a',
    textColor: '#ffffff',
    kitPattern: 'plain',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/9985.png',
    rawPlayers: [
      { name: 'Matthieu Epolo', pos: 'GK', number: 16, age: 20, nat: 'Bélgica', ovr: 74, pac: 74, sho: 76, pas: 71, dri: 74, def: 42, phy: 74 },
      { name: 'Ibe Hautekiet', pos: 'CB', number: 4, age: 23, nat: 'Bélgica', ovr: 74, pac: 72, sho: 38, pas: 65, dri: 62, def: 75, phy: 78 },
      { name: 'Bosko Sutalo', pos: 'CB', number: 24, age: 25, nat: 'Croacia', ovr: 75, pac: 74, sho: 40, pas: 66, dri: 64, def: 76, phy: 80 },
      { name: 'Henry Lawrence', pos: 'LB', number: 13, age: 23, nat: 'Inglaterra', ovr: 73, pac: 82, sho: 52, pas: 68, dri: 73, def: 72, phy: 73 },
      { name: 'Marlon Fossey', pos: 'RB', number: 88, age: 26, nat: 'Estados Unidos', ovr: 75, pac: 86, sho: 60, pas: 71, dri: 76, def: 73, phy: 74 },
      { name: 'Aiden O Neill', pos: 'CDM', number: 6, age: 27, nat: 'Australia', ovr: 75, pac: 73, sho: 64, pas: 76, dri: 74, def: 76, phy: 78 },
      { name: 'Marko Bulat', pos: 'CM', number: 8, age: 23, nat: 'Croacia', ovr: 75, pac: 75, sho: 74, pas: 78, dri: 77, def: 71, phy: 73 },
      { name: 'Isaac Price', pos: 'CM', number: 7, age: 21, nat: 'Irlanda del Norte', ovr: 74, pac: 76, sho: 71, pas: 74, dri: 75, def: 71, phy: 74 },
      { name: 'Andi Zeqiri', pos: 'ST', number: 9, age: 26, nat: 'Suiza', ovr: 76, pac: 79, sho: 78, pas: 68, dri: 75, def: 42, phy: 78 },
      { name: 'Dennis Eckert Ayensa', pos: 'ST', number: 19, age: 28, nat: 'Alemania', ovr: 74, pac: 76, sho: 76, pas: 68, dri: 74, def: 40, phy: 75 },
      { name: 'Soufiane Benjdida', pos: 'LW', number: 27, age: 23, nat: 'Marruecos', ovr: 73, pac: 82, sho: 72, pas: 68, dri: 76, def: 38, phy: 72 }
    ]
  },
  {
    id: 'cercle_brugge',
    name: 'Cercle Brugge KSV',
    shortName: 'CER',
    leagueId: 'belgium',
    city: 'Brujas',
    stadium: 'Jan Breydel Stadion',
    capacity: 29062,
    budget: 22,
    wageBudget: 150,
    primaryColor: '#008749',
    secondaryColor: '#000000',
    accentColor: '#ffffff',
    textColor: '#ffffff',
    kitPattern: 'stripes',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/8612.png',
    rawPlayers: [
      { name: 'Warleson', pos: 'GK', number: 1, age: 28, nat: 'Brasil', ovr: 76, pac: 76, sho: 78, pas: 72, dri: 75, def: 45, phy: 76 },
      { name: 'Christiaan Ravych', pos: 'CB', number: 66, age: 23, nat: 'Bélgica', ovr: 75, pac: 73, sho: 40, pas: 66, dri: 64, def: 76, phy: 78 },
      { name: 'Senna Miangue', pos: 'CB', number: 4, age: 28, nat: 'Bélgica', ovr: 74, pac: 70, sho: 42, pas: 64, dri: 62, def: 75, phy: 80 },
      { name: 'Nazinho', pos: 'LB', number: 18, age: 22, nat: 'Portugal', ovr: 74, pac: 84, sho: 58, pas: 70, dri: 76, def: 72, phy: 74 },
      { name: 'Edgaras Utkus', pos: 'RB', number: 3, age: 25, nat: 'Lituania', ovr: 74, pac: 76, sho: 52, pas: 68, dri: 70, def: 75, phy: 78 },
      { name: 'Hannes Van Der Bruggen', pos: 'CDM', number: 28, age: 32, nat: 'Bélgica', ovr: 74, pac: 70, sho: 62, pas: 75, dri: 73, def: 76, phy: 75 },
      { name: 'Abu Francis', pos: 'CM', number: 17, age: 24, nat: 'Ghana', ovr: 75, pac: 78, sho: 68, pas: 75, dri: 76, def: 73, phy: 76 },
      { name: 'Thibo Somers', pos: 'CAM', number: 11, age: 26, nat: 'Bélgica', ovr: 75, pac: 80, sho: 74, pas: 74, dri: 76, def: 64, phy: 75 },
      { name: 'Alan Minda', pos: 'RW', number: 27, age: 22, nat: 'Ecuador', ovr: 76, pac: 91, sho: 72, pas: 72, dri: 82, def: 42, phy: 66 },
      { name: 'Kévin Denkey', pos: 'ST', number: 9, age: 24, nat: 'Togo', ovr: 78, pac: 83, sho: 80, pas: 66, dri: 77, def: 40, phy: 84 },
      { name: 'Felipe Augusto', pos: 'ST', number: 10, age: 21, nat: 'Brasil', ovr: 74, pac: 81, sho: 75, pas: 64, dri: 74, def: 36, phy: 76 }
    ]
  },
  {
    id: 'kv_mechelen',
    name: 'KV Mechelen',
    shortName: 'KVM',
    leagueId: 'belgium',
    city: 'Malinas',
    stadium: 'AFAS Stadion',
    capacity: 16672,
    budget: 18,
    wageBudget: 120,
    primaryColor: '#c3281e',
    secondaryColor: '#f7d117',
    accentColor: '#000000',
    textColor: '#ffffff',
    kitPattern: 'stripes',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/9993.png',
    rawPlayers: [
      { name: 'Ortwin De Wolf', pos: 'GK', number: 1, age: 28, nat: 'Bélgica', ovr: 74, pac: 74, sho: 76, pas: 71, dri: 74, def: 42, phy: 74 },
      { name: 'Jules Van Cleemput', pos: 'CB', number: 2, age: 28, nat: 'Bélgica', ovr: 73, pac: 72, sho: 40, pas: 65, dri: 62, def: 74, phy: 76 },
      { name: 'José Marsà', pos: 'CB', number: 3, age: 23, nat: 'España', ovr: 74, pac: 73, sho: 44, pas: 72, dri: 68, def: 75, phy: 76 },
      { name: 'Daam Foulon', pos: 'LB', number: 5, age: 26, nat: 'Bélgica', ovr: 74, pac: 80, sho: 60, pas: 72, dri: 74, def: 73, phy: 74 },
      { name: 'Rafik Belghali', pos: 'RB', number: 23, age: 23, nat: 'Argelia', ovr: 73, pac: 84, sho: 62, pas: 69, dri: 75, def: 70, phy: 72 },
      { name: 'Rob Schoofs', pos: 'CM', number: 16, age: 31, nat: 'Bélgica', ovr: 76, pac: 72, sho: 74, pas: 80, dri: 77, def: 74, phy: 75 },
      { name: 'Aziz Ouattara', pos: 'CDM', number: 8, age: 24, nat: 'Costa de Marfil', ovr: 73, pac: 74, sho: 58, pas: 71, dri: 72, def: 75, phy: 79 },
      { name: 'Kerim Mrabti', pos: 'CAM', number: 7, age: 31, nat: 'Suecia', ovr: 74, pac: 77, sho: 74, pas: 75, dri: 76, def: 58, phy: 72 },
      { name: 'Nikola Storm', pos: 'LW', number: 11, age: 31, nat: 'Bélgica', ovr: 75, pac: 82, sho: 75, pas: 75, dri: 78, def: 48, phy: 68 },
      { name: 'Benito Raman', pos: 'ST', number: 9, age: 30, nat: 'Bélgica', ovr: 75, pac: 84, sho: 76, pas: 68, dri: 77, def: 42, phy: 74 },
      { name: 'Lion Lauberbach', pos: 'ST', number: 20, age: 27, nat: 'Alemania', ovr: 73, pac: 76, sho: 75, pas: 62, dri: 71, def: 38, phy: 80 }
    ]
  },
  {
    id: 'charleroi',
    name: 'Sporting Charleroi',
    shortName: 'CHA',
    leagueId: 'belgium',
    city: 'Charleroi',
    stadium: 'Stade du Pays de Charleroi',
    capacity: 15000,
    budget: 18,
    wageBudget: 120,
    primaryColor: '#000000',
    secondaryColor: '#ffffff',
    accentColor: '#1a1a1a',
    textColor: '#ffffff',
    kitPattern: 'stripes',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/9984.png',
    rawPlayers: [
      { name: 'Mohamed Koné', pos: 'GK', number: 30, age: 23, nat: 'Costa de Marfil', ovr: 74, pac: 74, sho: 76, pas: 71, dri: 74, def: 42, phy: 74 },
      { name: 'Stelios Andreou', pos: 'CB', number: 21, age: 23, nat: 'Chipre', ovr: 74, pac: 72, sho: 38, pas: 64, dri: 62, def: 75, phy: 78 },
      { name: 'Aiham Ousou', pos: 'CB', number: 4, age: 25, nat: 'Siria', ovr: 74, pac: 74, sho: 36, pas: 65, dri: 63, def: 75, phy: 78 },
      { name: 'Vetle Dragsnes', pos: 'LB', number: 24, age: 31, nat: 'Noruega', ovr: 73, pac: 76, sho: 58, pas: 70, dri: 72, def: 72, phy: 74 },
      { name: 'Jeremy Petris', pos: 'RB', number: 2, age: 27, nat: 'Francia', ovr: 74, pac: 83, sho: 54, pas: 69, dri: 74, def: 73, phy: 76 },
      { name: 'Adem Zorgane', pos: 'CM', number: 8, age: 25, nat: 'Argelia', ovr: 77, pac: 74, sho: 73, pas: 80, dri: 79, def: 75, phy: 76 },
      { name: 'Etienne Camara', pos: 'CDM', number: 5, age: 22, nat: 'Francia', ovr: 73, pac: 72, sho: 58, pas: 72, dri: 72, def: 75, phy: 79 },
      { name: 'Daan Heymans', pos: 'CAM', number: 18, age: 26, nat: 'Bélgica', ovr: 76, pac: 76, sho: 77, pas: 76, dri: 76, def: 64, phy: 76 },
      { name: 'Parfait Guiagon', pos: 'LW', number: 10, age: 24, nat: 'Costa de Marfil', ovr: 75, pac: 86, sho: 73, pas: 72, dri: 81, def: 42, phy: 66 },
      { name: 'Antoine Bernier', pos: 'RW', number: 7, age: 27, nat: 'Bélgica', ovr: 73, pac: 81, sho: 71, pas: 72, dri: 75, def: 45, phy: 66 },
      { name: 'Oday Dabbagh', pos: 'ST', number: 9, age: 26, nat: 'Palestina', ovr: 74, pac: 79, sho: 76, pas: 65, dri: 74, def: 38, phy: 75 }
    ]
  },
  {
    id: 'stvv',
    name: 'Sint-Truidense VV',
    shortName: 'STV',
    leagueId: 'belgium',
    city: 'Sint-Truiden',
    stadium: 'Stayen',
    capacity: 14600,
    budget: 16,
    wageBudget: 110,
    primaryColor: '#f7d117',
    secondaryColor: '#002f6c',
    accentColor: '#ffffff',
    textColor: '#002f6c',
    kitPattern: 'plain',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/9994.png',
    rawPlayers: [
      { name: 'Leo Kokubo', pos: 'GK', number: 21, age: 24, nat: 'Japón', ovr: 74, pac: 74, sho: 76, pas: 72, dri: 75, def: 42, phy: 74 },
      { name: 'Shogo Taniguchi', pos: 'CB', number: 5, age: 34, nat: 'Japón', ovr: 76, pac: 66, sho: 48, pas: 72, dri: 65, def: 78, phy: 78 },
      { name: 'Rein Van Helden', pos: 'CB', number: 24, age: 23, nat: 'Bélgica', ovr: 73, pac: 72, sho: 36, pas: 63, dri: 60, def: 74, phy: 76 },
      { name: 'Ryoya Ogawa', pos: 'LB', number: 2, age: 28, nat: 'Japón', ovr: 73, pac: 78, sho: 55, pas: 71, dri: 73, def: 73, phy: 74 },
      { name: 'Louis Patris', pos: 'RB', number: 34, age: 24, nat: 'Bélgica', ovr: 74, pac: 82, sho: 58, pas: 71, dri: 74, def: 73, phy: 74 },
      { name: 'Joel Chima Fujita', pos: 'CDM', number: 8, age: 23, nat: 'Japón', ovr: 75, pac: 75, sho: 64, pas: 77, dri: 76, def: 75, phy: 76 },
      { name: 'Rihito Yamamoto', pos: 'CM', number: 6, age: 23, nat: 'Japón', ovr: 73, pac: 73, sho: 66, pas: 75, dri: 74, def: 72, phy: 72 },
      { name: 'Ryotaro Ito', pos: 'CAM', number: 13, age: 27, nat: 'Japón', ovr: 76, pac: 76, sho: 75, pas: 80, dri: 80, def: 54, phy: 66 },
      { name: 'Billal Brahimi', pos: 'RW', number: 11, age: 25, nat: 'Argelia', ovr: 74, pac: 85, sho: 73, pas: 73, dri: 79, def: 44, phy: 70 },
      { name: 'Adriano Bertaccini', pos: 'ST', number: 9, age: 25, nat: 'Bélgica', ovr: 76, pac: 84, sho: 78, pas: 66, dri: 76, def: 40, phy: 76 },
      { name: 'Kahveh Zahiroleslam', pos: 'ST', number: 15, age: 23, nat: 'Estados Unidos', ovr: 73, pac: 76, sho: 74, pas: 60, dri: 71, def: 38, phy: 80 }
    ]
  },
  {
    id: 'westerlo',
    name: 'KVC Westerlo',
    shortName: 'WES',
    leagueId: 'belgium',
    city: 'Westerlo',
    stadium: 'Het Kuipje',
    capacity: 8035,
    budget: 16,
    wageBudget: 110,
    primaryColor: '#f7d117',
    secondaryColor: '#002f6c',
    accentColor: '#ffffff',
    textColor: '#002f6c',
    kitPattern: 'plain',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/8344.png',
    rawPlayers: [
      { name: 'Sinan Bolat', pos: 'GK', number: 1, age: 36, nat: 'Turquía', ovr: 74, pac: 72, sho: 75, pas: 70, dri: 73, def: 45, phy: 75 },
      { name: 'Luka Vušković', pos: 'CB', number: 44, age: 18, nat: 'Croacia', ovr: 76, pac: 74, sho: 60, pas: 72, dri: 68, def: 77, phy: 82 },
      { name: 'Emin Bayram', pos: 'CB', number: 40, age: 22, nat: 'Turquía', ovr: 74, pac: 72, sho: 38, pas: 66, dri: 63, def: 75, phy: 78 },
      { name: 'Jordan Bos', pos: 'LB', number: 5, age: 22, nat: 'Australia', ovr: 74, pac: 84, sho: 62, pas: 72, dri: 76, def: 72, phy: 74 },
      { name: 'Bryan Reynolds', pos: 'RB', number: 22, age: 24, nat: 'Estados Unidos', ovr: 75, pac: 87, sho: 58, pas: 72, dri: 75, def: 73, phy: 76 },
      { name: 'Dogucan Haspolat', pos: 'CDM', number: 8, age: 25, nat: 'Turquía', ovr: 74, pac: 72, sho: 64, pas: 75, dri: 73, def: 75, phy: 77 },
      { name: 'Arthur Piedfort', pos: 'CM', number: 18, age: 20, nat: 'Bélgica', ovr: 73, pac: 74, sho: 65, pas: 74, dri: 74, def: 72, phy: 72 },
      { name: 'Alfie Devine', pos: 'CAM', number: 17, age: 21, nat: 'Inglaterra', ovr: 74, pac: 77, sho: 73, pas: 77, dri: 78, def: 58, phy: 68 },
      { name: 'Allahyar Sayyadmanesh', pos: 'RW', number: 7, age: 24, nat: 'Irán', ovr: 75, pac: 86, sho: 75, pas: 71, dri: 78, def: 48, phy: 74 },
      { name: 'Matija Frigan', pos: 'ST', number: 9, age: 22, nat: 'Croacia', ovr: 75, pac: 82, sho: 77, pas: 66, dri: 75, def: 42, phy: 76 },
      { name: 'Josimar Alcócer', pos: 'LW', number: 77, age: 21, nat: 'Costa Rica', ovr: 73, pac: 84, sho: 71, pas: 68, dri: 76, def: 40, phy: 68 }
    ]
  },
  {
    id: 'oh_leuven',
    name: 'OH Leuven',
    shortName: 'OHL',
    leagueId: 'belgium',
    city: 'Lovaina',
    stadium: 'King Power at Den Dreef',
    capacity: 10020,
    budget: 16,
    wageBudget: 110,
    primaryColor: '#ffffff',
    secondaryColor: '#c3281e',
    accentColor: '#006633',
    textColor: '#000000',
    kitPattern: 'plain',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/9989.png',
    rawPlayers: [
      { name: 'Tobe Leysen', pos: 'GK', number: 1, age: 23, nat: 'Bélgica', ovr: 75, pac: 75, sho: 77, pas: 72, dri: 75, def: 42, phy: 75 },
      { name: 'Federico Ricca', pos: 'CB', number: 5, age: 30, nat: 'Uruguay', ovr: 74, pac: 68, sho: 48, pas: 68, dri: 64, def: 76, phy: 79 },
      { name: 'Ewoud Pletinckx', pos: 'CB', number: 6, age: 24, nat: 'Bélgica', ovr: 74, pac: 70, sho: 38, pas: 65, dri: 62, def: 75, phy: 78 },
      { name: 'Takahiro Akimoto', pos: 'LB', number: 11, age: 27, nat: 'Japón', ovr: 73, pac: 80, sho: 60, pas: 71, dri: 74, def: 72, phy: 73 },
      { name: 'Manuel Osifo', pos: 'RB', number: 27, age: 22, nat: 'Bélgica', ovr: 72, pac: 81, sho: 50, pas: 68, dri: 72, def: 72, phy: 74 },
      { name: 'Birger Verstraete', pos: 'CDM', number: 8, age: 31, nat: 'Bélgica', ovr: 74, pac: 72, sho: 65, pas: 76, dri: 74, def: 76, phy: 77 },
      { name: 'Ezechiel Banzuzi', pos: 'CM', number: 7, age: 20, nat: 'Países Bajos', ovr: 73, pac: 75, sho: 68, pas: 74, dri: 75, def: 72, phy: 75 },
      { name: 'Youssef Maziz', pos: 'CAM', number: 10, age: 27, nat: 'Francia', ovr: 75, pac: 76, sho: 75, pas: 79, dri: 78, def: 55, phy: 66 },
      { name: 'William Balikwisha', pos: 'LW', number: 20, age: 26, nat: 'RD del Congo', ovr: 74, pac: 84, sho: 72, pas: 73, dri: 79, def: 45, phy: 68 },
      { name: 'Chukwubuikem Ikwuemesi', pos: 'ST', number: 19, age: 24, nat: 'Nigeria', ovr: 74, pac: 80, sho: 75, pas: 62, dri: 72, def: 38, phy: 84 },
      { name: 'Konan Ndri', pos: 'RW', number: 17, age: 24, nat: 'Costa de Marfil', ovr: 73, pac: 86, sho: 70, pas: 69, dri: 77, def: 42, phy: 68 }
    ]
  },
  {
    id: 'kv_kortrijk',
    name: 'KV Kortrijk',
    shortName: 'KOR',
    leagueId: 'belgium',
    city: 'Cortrique',
    stadium: 'Guldensporenstadion',
    capacity: 9399,
    budget: 14,
    wageBudget: 90,
    primaryColor: '#c3281e',
    secondaryColor: '#ffffff',
    accentColor: '#1a1a1a',
    textColor: '#ffffff',
    kitPattern: 'plain',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/8571.png',
    rawPlayers: [
      { name: 'Patrik Gunnarsson', pos: 'GK', number: 1, age: 24, nat: 'Islandia', ovr: 73, pac: 73, sho: 75, pas: 70, dri: 73, def: 42, phy: 74 },
      { name: 'Haruya Fujii', pos: 'CB', number: 24, age: 24, nat: 'Japón', ovr: 74, pac: 73, sho: 38, pas: 66, dri: 63, def: 75, phy: 78 },
      { name: 'Mark Mampassi', pos: 'CB', number: 4, age: 22, nat: 'Ucrania', ovr: 73, pac: 72, sho: 36, pas: 64, dri: 62, def: 74, phy: 77 },
      { name: 'Dion De Neve', pos: 'LB', number: 11, age: 24, nat: 'Bélgica', ovr: 73, pac: 79, sho: 62, pas: 70, dri: 74, def: 72, phy: 72 },
      { name: 'Gilles Dewaele', pos: 'RB', number: 2, age: 29, nat: 'Bélgica', ovr: 73, pac: 77, sho: 54, pas: 69, dri: 72, def: 73, phy: 74 },
      { name: 'Abdoulaye Sissako', pos: 'CDM', number: 6, age: 27, nat: 'Francia', ovr: 73, pac: 72, sho: 60, pas: 73, dri: 72, def: 75, phy: 79 },
      { name: 'Nayel Mehssatou', pos: 'CM', number: 27, age: 23, nat: 'Chile', ovr: 73, pac: 76, sho: 60, pas: 73, dri: 74, def: 73, phy: 73 },
      { name: 'Takuro Kaneko', pos: 'RW', number: 7, age: 28, nat: 'Japón', ovr: 74, pac: 82, sho: 73, pas: 74, dri: 78, def: 52, phy: 70 },
      { name: 'Abdelkahar Kadri', pos: 'CAM', number: 10, age: 25, nat: 'Argelia', ovr: 75, pac: 78, sho: 73, pas: 78, dri: 81, def: 58, phy: 66 },
      { name: 'Nacho Ferri', pos: 'ST', number: 9, age: 20, nat: 'España', ovr: 74, pac: 77, sho: 75, pas: 65, dri: 73, def: 38, phy: 80 },
      { name: 'Thierry Ambrose', pos: 'ST', number: 17, age: 28, nat: 'Guadalupe', ovr: 73, pac: 80, sho: 74, pas: 66, dri: 74, def: 40, phy: 74 }
    ]
  },
  {
    id: 'dender',
    name: 'FCV Dender EH',
    shortName: 'DEN',
    leagueId: 'belgium',
    city: 'Denderleeuw',
    stadium: 'Florent Beeckmanstadion',
    capacity: 6429,
    budget: 12,
    wageBudget: 80,
    primaryColor: '#002f6c',
    secondaryColor: '#ffffff',
    accentColor: '#1a1a1a',
    textColor: '#ffffff',
    kitPattern: 'plain',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/9996.png',
    rawPlayers: [
      { name: 'Michael Verrips', pos: 'GK', number: 13, age: 28, nat: 'Países Bajos', ovr: 73, pac: 72, sho: 75, pas: 70, dri: 73, def: 42, phy: 74 },
      { name: 'Kobe Cools', pos: 'CB', number: 4, age: 28, nat: 'Bélgica', ovr: 73, pac: 68, sho: 38, pas: 64, dri: 60, def: 74, phy: 78 },
      { name: 'Gilles Ruyssen', pos: 'CB', number: 3, age: 31, nat: 'Bélgica', ovr: 72, pac: 66, sho: 36, pas: 62, dri: 58, def: 73, phy: 79 },
      { name: 'Fabio Ferraro', pos: 'LB', number: 77, age: 22, nat: 'Bélgica', ovr: 72, pac: 81, sho: 54, pas: 68, dri: 72, def: 71, phy: 71 },
      { name: 'David Hrncar', pos: 'RB', number: 21, age: 27, nat: 'Eslovaquia', ovr: 73, pac: 82, sho: 64, pas: 72, dri: 74, def: 71, phy: 73 },
      { name: 'Nathan Rôdes', pos: 'CDM', number: 8, age: 27, nat: 'Bélgica', ovr: 73, pac: 72, sho: 64, pas: 74, dri: 73, def: 74, phy: 76 },
      { name: 'Malcolm Viltard', pos: 'CM', number: 18, age: 22, nat: 'Francia', ovr: 73, pac: 74, sho: 68, pas: 75, dri: 74, def: 72, phy: 73 },
      { name: 'Lennard Hens', pos: 'CM', number: 6, age: 29, nat: 'Bélgica', ovr: 72, pac: 70, sho: 66, pas: 73, dri: 72, def: 70, phy: 72 },
      { name: 'Bruny Nsimba', pos: 'ST', number: 9, age: 25, nat: 'Bélgica', ovr: 74, pac: 85, sho: 75, pas: 66, dri: 76, def: 40, phy: 76 },
      { name: 'Roman Kvet', pos: 'CAM', number: 20, age: 27, nat: 'República Checa', ovr: 73, pac: 73, sho: 74, pas: 75, dri: 74, def: 60, phy: 72 },
      { name: 'Mohamed Berte', pos: 'ST', number: 10, age: 23, nat: 'Bélgica', ovr: 72, pac: 81, sho: 72, pas: 62, dri: 71, def: 36, phy: 75 }
    ]
  },
  {
    id: 'beerschot',
    name: 'Beerschot VA',
    shortName: 'BEE',
    leagueId: 'belgium',
    city: 'Amberes',
    stadium: 'Olympisch Stadion',
    capacity: 12771,
    budget: 12,
    wageBudget: 80,
    primaryColor: '#492f92',
    secondaryColor: '#ffffff',
    accentColor: '#1a1a1a',
    textColor: '#ffffff',
    kitPattern: 'plain',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/9998.png',
    rawPlayers: [
      { name: 'Nick Shinton', pos: 'GK', number: 1, age: 24, nat: 'Bélgica', ovr: 72, pac: 72, sho: 74, pas: 68, dri: 72, def: 42, phy: 73 },
      { name: 'Herve Matthys', pos: 'CB', number: 4, age: 29, nat: 'Bélgica', ovr: 73, pac: 68, sho: 40, pas: 66, dri: 62, def: 74, phy: 78 },
      { name: 'Loïc Mbe Soh', pos: 'CB', number: 24, age: 24, nat: 'Francia', ovr: 73, pac: 73, sho: 38, pas: 65, dri: 63, def: 74, phy: 78 },
      { name: 'Apostolos Konstantopoulos', pos: 'CB', number: 5, age: 23, nat: 'Grecia', ovr: 72, pac: 70, sho: 36, pas: 62, dri: 58, def: 73, phy: 77 },
      { name: 'Colin Dagba', pos: 'RB', number: 2, age: 27, nat: 'Francia', ovr: 74, pac: 81, sho: 54, pas: 70, dri: 73, def: 73, phy: 73 },
      { name: 'Brian Plat', pos: 'LB', number: 3, age: 25, nat: 'Países Bajos', ovr: 72, pac: 75, sho: 48, pas: 68, dri: 68, def: 73, phy: 76 },
      { name: 'Ewan Henderson', pos: 'CM', number: 8, age: 25, nat: 'Escocia', ovr: 73, pac: 74, sho: 70, pas: 76, dri: 75, def: 68, phy: 70 },
      { name: 'Faisal Al-Ghamdi', pos: 'CDM', number: 18, age: 24, nat: 'Arabia Saudí', ovr: 73, pac: 74, sho: 64, pas: 74, dri: 73, def: 74, phy: 75 },
      { name: 'Marwan Al-Sahafi', pos: 'RW', number: 11, age: 21, nat: 'Arabia Saudí', ovr: 74, pac: 88, sho: 73, pas: 70, dri: 78, def: 45, phy: 68 },
      { name: 'Thibaud Verlinden', pos: 'LW', number: 10, age: 26, nat: 'Bélgica', ovr: 74, pac: 83, sho: 72, pas: 74, dri: 78, def: 46, phy: 66 },
      { name: 'Antoine Colassin', pos: 'ST', number: 9, age: 24, nat: 'Bélgica', ovr: 73, pac: 78, sho: 74, pas: 65, dri: 73, def: 38, phy: 74 }
    ]
  }
];

async function main() {
  console.log(`Starting completion of all leagues...`);
  console.log(`Total new clubs to process: ${ALL_EXPANDED_CLUBS.length}`);

  let totalPlayers = 0;
  let photosFound = 0;
  let defaultAvatars = 0;

  const processedClubs = [];

  for (const rawClub of ALL_EXPANDED_CLUBS) {
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
        nat: p.nat || 'Escocia'
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
