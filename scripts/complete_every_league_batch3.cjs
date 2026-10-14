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

  photoMap[clean] = './default_player.svg';
  return './default_player.svg';
}

const newClubs = [
  // --- EREDIVISIE (12 remaining to make 18 total) ---
  {
    id: "heerenveen",
    name: "SC Heerenveen",
    shortName: "Heerenveen",
    leagueId: "eredivisie",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/10235.png",
    stadium: "Abe Lenstra Stadion",
    capacity: 26100,
    budget: 18000000,
    transferBudget: 6000000,
    wageBudget: 160000,
    primaryColor: "#004b97",
    secondaryColor: "#ffffff",
    players: [
      { name: "Andries Noppert", position: "GK", rating: 74, age: 30, nationality: "Netherlands" },
      { name: "Mickey van der Hart", position: "GK", rating: 70, age: 30, nationality: "Netherlands" },
      { name: "Pawel Bochniewicz", position: "CB", rating: 73, age: 28, nationality: "Poland" },
      { name: "Sam Kersten", position: "CB", rating: 71, age: 26, nationality: "Netherlands" },
      { name: "Mats Köhlert", position: "LB", rating: 72, age: 26, nationality: "Germany" },
      { name: "Oliver Braude", position: "RB", rating: 70, age: 20, nationality: "Norway" },
      { name: "Simon Olsson", position: "CM", rating: 73, age: 27, nationality: "Sweden" },
      { name: "Espen van Ee", position: "CM", rating: 69, age: 21, nationality: "Netherlands" },
      { name: "Luuk Brouwers", position: "CAM", rating: 72, age: 26, nationality: "Netherlands" },
      { name: "Levi Smans", position: "LW", rating: 70, age: 21, nationality: "Netherlands" },
      { name: "Ion Nicolaescu", position: "ST", rating: 73, age: 26, nationality: "Moldova" },
      { name: "Daniel Karlsbakk", position: "ST", rating: 69, age: 21, nationality: "Norway" }
    ]
  },
  {
    id: "go_ahead_eagles",
    name: "Go Ahead Eagles",
    shortName: "Go Ahead",
    leagueId: "eredivisie",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/6433.png",
    stadium: "De Adelaarshorst",
    capacity: 10400,
    budget: 14000000,
    transferBudget: 4500000,
    wageBudget: 120000,
    primaryColor: "#da291c",
    secondaryColor: "#fbe122",
    players: [
      { name: "Luca Plogmann", position: "GK", rating: 71, age: 24, nationality: "Germany" },
      { name: "Joris Kramer", position: "CB", rating: 72, age: 28, nationality: "Netherlands" },
      { name: "Gerrit Nauber", position: "CB", rating: 71, age: 32, nationality: "Germany" },
      { name: "Mats Deijl", position: "RB", rating: 73, age: 27, nationality: "Netherlands" },
      { name: "Aske Adelgaard", position: "LB", rating: 69, age: 20, nationality: "Denmark" },
      { name: "Evert Linthorst", position: "CM", rating: 71, age: 24, nationality: "Netherlands" },
      { name: "Enric Llansana", position: "CDM", rating: 72, age: 23, nationality: "Spain" },
      { name: "Jakob Breum", position: "CAM", rating: 72, age: 20, nationality: "Denmark" },
      { name: "Bobby Adekanye", position: "RW", rating: 73, age: 25, nationality: "Netherlands" },
      { name: "Oliver Antman", position: "LW", rating: 72, age: 23, nationality: "Finland" },
      { name: "Victor Edvardsen", position: "ST", rating: 73, age: 28, nationality: "Sweden" },
      { name: "Milan Smit", position: "ST", rating: 69, age: 21, nationality: "Netherlands" }
    ]
  },
  {
    id: "nec_nijmegen",
    name: "NEC Nijmegen",
    shortName: "NEC",
    leagueId: "eredivisie",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/8464.png",
    stadium: "Goffertstadion",
    capacity: 12500,
    budget: 16000000,
    transferBudget: 5000000,
    wageBudget: 140000,
    primaryColor: "#e30613",
    secondaryColor: "#009640",
    players: [
      { name: "Robin Roefs", position: "GK", rating: 71, age: 21, nationality: "Netherlands" },
      { name: "Bram Nuytinck", position: "CB", rating: 74, age: 34, nationality: "Netherlands" },
      { name: "Philippe Sandler", position: "CB", rating: 74, age: 27, nationality: "Netherlands" },
      { name: "Calvin Verdonk", position: "LB", rating: 73, age: 27, nationality: "Indonesia" },
      { name: "Brayann Pereira", position: "RB", rating: 71, age: 21, nationality: "France" },
      { name: "Dirk Proper", position: "CM", rating: 74, age: 22, nationality: "Netherlands" },
      { name: "Mees Hoedemakers", position: "CDM", rating: 71, age: 26, nationality: "Netherlands" },
      { name: "Rober González", position: "CAM", rating: 73, age: 23, nationality: "Spain" },
      { name: "Sontje Hansen", position: "RW", rating: 73, age: 22, nationality: "Netherlands" },
      { name: "Kodai Sano", position: "LW", rating: 72, age: 21, nationality: "Japan" },
      { name: "Koki Ogawa", position: "ST", rating: 73, age: 27, nationality: "Japan" },
      { name: "Kento Shiogai", position: "ST", rating: 68, age: 19, nationality: "Japan" }
    ]
  },
  {
    id: "sparta_rotterdam",
    name: "Sparta Rotterdam",
    shortName: "Sparta",
    leagueId: "eredivisie",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/8611.png",
    stadium: "Sparta Stadion Het Kasteel",
    capacity: 11000,
    budget: 15000000,
    transferBudget: 4800000,
    wageBudget: 130000,
    primaryColor: "#cf102d",
    secondaryColor: "#ffffff",
    players: [
      { name: "Nick Olij", position: "GK", rating: 76, age: 29, nationality: "Netherlands" },
      { name: "Rick Meissen", position: "CB", rating: 71, age: 22, nationality: "Netherlands" },
      { name: "Mike Eerdhuijzen", position: "CB", rating: 72, age: 24, nationality: "Netherlands" },
      { name: "Djevencio van der Kust", position: "LB", rating: 70, age: 23, nationality: "Suriname" },
      { name: "Boyd Reith", position: "RB", rating: 70, age: 25, nationality: "Netherlands" },
      { name: "Julian Baas", position: "CM", rating: 72, age: 22, nationality: "Netherlands" },
      { name: "Pelle Clement", position: "CM", rating: 72, age: 28, nationality: "Netherlands" },
      { name: "Arno Verschueren", position: "CAM", rating: 74, age: 27, nationality: "Belgium" },
      { name: "Shunsuke Mito", position: "LW", rating: 71, age: 22, nationality: "Japan" },
      { name: "Camiel Neghli", position: "RW", rating: 72, age: 23, nationality: "Algeria" },
      { name: "Tobias Lauritsen", position: "ST", rating: 75, age: 27, nationality: "Norway" },
      { name: "Charles-Andreas Brym", position: "ST", rating: 70, age: 26, nationality: "Canada" }
    ]
  },
  {
    id: "fortuna_sittard",
    name: "Fortuna Sittard",
    shortName: "Fortuna",
    leagueId: "eredivisie",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/6413.png",
    stadium: "Fortuna Sittard Stadion",
    capacity: 12500,
    budget: 13000000,
    transferBudget: 4000000,
    wageBudget: 110000,
    primaryColor: "#007a3d",
    secondaryColor: "#ffd100",
    players: [
      { name: "Mattijs Branderhorst", position: "GK", rating: 71, age: 30, nationality: "Netherlands" },
      { name: "Rodrigo Guth", position: "CB", rating: 73, age: 23, nationality: "Brazil" },
      { name: "Shawn Adewoye", position: "CB", rating: 70, age: 24, nationality: "Belgium" },
      { name: "Mitchell Dijks", position: "LB", rating: 72, age: 31, nationality: "Netherlands" },
      { name: "Ivo Pinto", position: "RB", rating: 72, age: 34, nationality: "Portugal" },
      { name: "Alen Halilovic", position: "CAM", rating: 74, age: 28, nationality: "Croatia" },
      { name: "Loreintz Rosier", position: "CDM", rating: 71, age: 26, nationality: "France" },
      { name: "Ryan Fosso", position: "CM", rating: 70, age: 22, nationality: "Switzerland" },
      { name: "Ezequiel Bullaude", position: "CAM", rating: 72, age: 23, nationality: "Argentina" },
      { name: "Kristoffer Peterson", position: "LW", rating: 71, age: 29, nationality: "Sweden" },
      { name: "Makan Aïko", position: "RW", rating: 70, age: 23, nationality: "France" },
      { name: "Kaj Sierhuis", position: "ST", rating: 73, age: 26, nationality: "Netherlands" }
    ]
  },
  {
    id: "pec_zwolle",
    name: "PEC Zwolle",
    shortName: "PEC Zwolle",
    leagueId: "eredivisie",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/6441.png",
    stadium: "MAC³PARK Stadion",
    capacity: 14000,
    budget: 12000000,
    transferBudget: 3500000,
    wageBudget: 100000,
    primaryColor: "#004b97",
    secondaryColor: "#ffffff",
    players: [
      { name: "Jasper Schendelaar", position: "GK", rating: 72, age: 24, nationality: "Netherlands" },
      { name: "Anselmo Garcia MacNulty", position: "CB", rating: 71, age: 21, nationality: "Republic of Ireland" },
      { name: "Simon Graves", position: "CB", rating: 70, age: 25, nationality: "Denmark" },
      { name: "Sherel Floranus", position: "RB", rating: 71, age: 26, nationality: "Curaçao" },
      { name: "Damian van der Haar", position: "LB", rating: 68, age: 20, nationality: "Netherlands" },
      { name: "Davy van den Berg", position: "CM", rating: 72, age: 24, nationality: "Netherlands" },
      { name: "Anouar El Azzouzi", position: "CDM", rating: 71, age: 23, nationality: "Morocco" },
      { name: "Jamiro Monteiro", position: "CAM", rating: 73, age: 30, nationality: "Cape Verde" },
      { name: "Younes Namli", position: "RW", rating: 74, age: 30, nationality: "Denmark" },
      { name: "Filip Krastev", position: "LW", rating: 72, age: 23, nationality: "Bulgaria" },
      { name: "Dylan Vente", position: "ST", rating: 72, age: 25, nationality: "Netherlands" },
      { name: "Dylan Mbayo", position: "RW", rating: 70, age: 23, nationality: "Belgium" }
    ]
  },
  {
    id: "heracles_almelo",
    name: "Heracles Almelo",
    shortName: "Heracles",
    leagueId: "eredivisie",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/9791.png",
    stadium: "Asito Stadion",
    capacity: 12080,
    budget: 11000000,
    transferBudget: 3200000,
    wageBudget: 95000,
    primaryColor: "#000000",
    secondaryColor: "#ffffff",
    players: [
      { name: "Fabian de Keijzer", position: "GK", rating: 70, age: 24, nationality: "Netherlands" },
      { name: "Damon Mirani", position: "CB", rating: 71, age: 28, nationality: "Netherlands" },
      { name: "Ivan Mesik", position: "CB", rating: 69, age: 23, nationality: "Slovakia" },
      { name: "Ruben Roosken", position: "LB", rating: 70, age: 24, nationality: "Netherlands" },
      { name: "Mimeirhel Benita", position: "RB", rating: 69, age: 20, nationality: "Netherlands" },
      { name: "Brian De Keersmaecker", position: "CM", rating: 71, age: 24, nationality: "Belgium" },
      { name: "Daniel van Kaam", position: "CM", rating: 70, age: 24, nationality: "Netherlands" },
      { name: "Sem Scheperman", position: "CDM", rating: 68, age: 22, nationality: "Netherlands" },
      { name: "Mario Engels", position: "LW", rating: 71, age: 30, nationality: "Germany" },
      { name: "Suf Podgoreanu", position: "RW", rating: 70, age: 22, nationality: "Israel" },
      { name: "Luka Kulenovic", position: "ST", rating: 71, age: 24, nationality: "Bosnia and Herzegovina" },
      { name: "Juho Talvitie", position: "RW", rating: 68, age: 19, nationality: "Finland" }
    ]
  },
  {
    id: "willem_ii",
    name: "Willem II Tilburg",
    shortName: "Willem II",
    leagueId: "eredivisie",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/8526.png",
    stadium: "Koning Willem II Stadion",
    capacity: 14750,
    budget: 12000000,
    transferBudget: 3500000,
    wageBudget: 100000,
    primaryColor: "#cf112d",
    secondaryColor: "#0c2340",
    players: [
      { name: "Thomas Didillon", position: "GK", rating: 71, age: 28, nationality: "France" },
      { name: "Raffael Behounek", position: "CB", rating: 71, age: 27, nationality: "Austria" },
      { name: "Tommy St. Jago", position: "CB", rating: 70, age: 24, nationality: "Netherlands" },
      { name: "Runar Thor Sigurgeirsson", position: "LB", rating: 69, age: 24, nationality: "Iceland" },
      { name: "Mickaël Tirpan", position: "RB", rating: 71, age: 30, nationality: "Belgium" },
      { name: "Boris Lambert", position: "CDM", rating: 70, age: 24, nationality: "Belgium" },
      { name: "Jesse Bosch", position: "CM", rating: 71, age: 24, nationality: "Netherlands" },
      { name: "Cisse Sandra", position: "CAM", rating: 71, age: 20, nationality: "Belgium" },
      { name: "Ringo Meerveld", position: "LW", rating: 72, age: 21, nationality: "Netherlands" },
      { name: "Nick Doodeman", position: "RW", rating: 70, age: 27, nationality: "Netherlands" },
      { name: "Kyan Vaesen", position: "ST", rating: 71, age: 23, nationality: "Belgium" },
      { name: "Amar Fatah", position: "LW", rating: 69, age: 20, nationality: "Sweden" }
    ]
  },
  {
    id: "nac_breda",
    name: "NAC Breda",
    shortName: "NAC Breda",
    leagueId: "eredivisie",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/9761.png",
    stadium: "Rat Verlegh Stadion",
    capacity: 19000,
    budget: 12500000,
    transferBudget: 3600000,
    wageBudget: 105000,
    primaryColor: "#ffd100",
    secondaryColor: "#000000",
    players: [
      { name: "Daniel Bielica", position: "GK", rating: 71, age: 25, nationality: "Poland" },
      { name: "Leo Greiml", position: "CB", rating: 70, age: 23, nationality: "Austria" },
      { name: "Jan Van den Bergh", position: "CB", rating: 71, age: 29, nationality: "Belgium" },
      { name: "Boy Kemper", position: "LB", rating: 70, age: 25, nationality: "Netherlands" },
      { name: "Cherrion Valerius", position: "RB", rating: 68, age: 19, nationality: "Netherlands" },
      { name: "Maximilien Balard", position: "CM", rating: 71, age: 23, nationality: "Australia" },
      { name: "Clint Leemans", position: "CM", rating: 70, age: 29, nationality: "Netherlands" },
      { name: "Dominik Janosek", position: "CAM", rating: 72, age: 26, nationality: "Czech Republic" },
      { name: "Matthew Garbett", position: "CM", rating: 70, age: 22, nationality: "New Zealand" },
      { name: "Leo Sauer", position: "LW", rating: 71, age: 18, nationality: "Slovakia" },
      { name: "Elías Már Ómarsson", position: "ST", rating: 70, age: 29, nationality: "Iceland" },
      { name: "Kacper Kostorz", position: "ST", rating: 70, age: 25, nationality: "Poland" }
    ]
  },
  {
    id: "fc_groningen",
    name: "FC Groningen",
    shortName: "Groningen",
    leagueId: "eredivisie",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/10167.png",
    stadium: "Euroborg",
    capacity: 22550,
    budget: 15000000,
    transferBudget: 4500000,
    wageBudget: 130000,
    primaryColor: "#007a3d",
    secondaryColor: "#ffffff",
    players: [
      { name: "Etienne Vaessen", position: "GK", rating: 73, age: 29, nationality: "Suriname" },
      { name: "Marco Rente", position: "CB", rating: 71, age: 27, nationality: "Germany" },
      { name: "Thijmen Blokzijl", position: "CB", rating: 71, age: 19, nationality: "Netherlands" },
      { name: "Finn Stam", position: "LB", rating: 69, age: 21, nationality: "Netherlands" },
      { name: "Leandro Bacuna", position: "RB", rating: 72, age: 33, nationality: "Curaçao" },
      { name: "Stije Resink", position: "CM", rating: 71, age: 21, nationality: "Netherlands" },
      { name: "Johan Hove", position: "CM", rating: 72, age: 24, nationality: "Norway" },
      { name: "Jorg Schreuders", position: "CAM", rating: 73, age: 20, nationality: "Netherlands" },
      { name: "Luciano Valente", position: "CAM", rating: 72, age: 21, nationality: "Italy" },
      { name: "Thom van Bergen", position: "ST", rating: 71, age: 20, nationality: "Netherlands" },
      { name: "Romano Postema", position: "ST", rating: 72, age: 22, nationality: "Netherlands" },
      { name: "Rui Mendes", position: "RW", rating: 70, age: 24, nationality: "Portugal" }
    ]
  },
  {
    id: "rkc_waalwijk",
    name: "RKC Waalwijk",
    shortName: "RKC Waalwijk",
    leagueId: "eredivisie",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/10219.png",
    stadium: "Mandemakers Stadion",
    capacity: 7500,
    budget: 9500000,
    transferBudget: 2500000,
    wageBudget: 85000,
    primaryColor: "#ffd100",
    secondaryColor: "#004b97",
    players: [
      { name: "Jeroen Houwen", position: "GK", rating: 69, age: 28, nationality: "Netherlands" },
      { name: "Roshon van Eijma", position: "CB", rating: 69, age: 26, nationality: "Curaçao" },
      { name: "Dario Van den Buijs", position: "CB", rating: 70, age: 28, nationality: "Belgium" },
      { name: "Liam van Gelderen", position: "RB", rating: 68, age: 23, nationality: "Netherlands" },
      { name: "Luuk Wouters", position: "LB", rating: 68, age: 25, nationality: "Netherlands" },
      { name: "Godfried Roemeratoe", position: "CDM", rating: 70, age: 25, nationality: "Curaçao" },
      { name: "Yassin Oukili", position: "CM", rating: 71, age: 23, nationality: "Morocco" },
      { name: "Richard van der Venne", position: "CAM", rating: 71, age: 32, nationality: "Netherlands" },
      { name: "Denilho Cleonise", position: "RW", rating: 69, age: 22, nationality: "Netherlands" },
      { name: "Chris Lokesa", position: "LW", rating: 69, age: 19, nationality: "Belgium" },
      { name: "Oskar Zawada", position: "ST", rating: 70, age: 28, nationality: "Poland" },
      { name: "Michiel Kramer", position: "ST", rating: 71, age: 35, nationality: "Netherlands" }
    ]
  },
  {
    id: "almere_city",
    name: "Almere City FC",
    shortName: "Almere City",
    leagueId: "eredivisie",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/6547.png",
    stadium: "Yanmar Stadion",
    capacity: 4500,
    budget: 9000000,
    transferBudget: 2400000,
    wageBudget: 80000,
    primaryColor: "#cf102d",
    secondaryColor: "#000000",
    players: [
      { name: "Nordin Bakker", position: "GK", rating: 70, age: 26, nationality: "Netherlands" },
      { name: "Ricardo Visus", position: "CB", rating: 69, age: 23, nationality: "Spain" },
      { name: "Theo Barbet", position: "CB", rating: 70, age: 23, nationality: "France" },
      { name: "Vasilios Zagaritis", position: "LB", rating: 69, age: 23, nationality: "Greece" },
      { name: "Hamdi Akujobi", position: "RB", rating: 69, age: 24, nationality: "Netherlands" },
      { name: "Thom Haye", position: "CDM", rating: 74, age: 29, nationality: "Indonesia" },
      { name: "Anas Tahiri", position: "CM", rating: 70, age: 29, nationality: "Morocco" },
      { name: "Jochem Ritmeester van de Kamp", position: "CM", rating: 68, age: 20, nationality: "Netherlands" },
      { name: "Junior Kadile", position: "LW", rating: 70, age: 21, nationality: "France" },
      { name: "Logan Delaurier-Chaubet", position: "RW", rating: 70, age: 22, nationality: "France" },
      { name: "Thomas Robinet", position: "ST", rating: 71, age: 28, nationality: "France" },
      { name: "Baptiste Guillaume", position: "ST", rating: 70, age: 28, nationality: "Belgium" }
    ]
  },

  // --- BRASILEIRÃO (12 remaining to make 20 total) ---
  {
    id: "internacional",
    name: "SC Internacional",
    shortName: "Internacional",
    leagueId: "brasileirao",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/9784.png",
    stadium: "Estádio Beira-Rio",
    capacity: 50128,
    budget: 42000000,
    transferBudget: 14000000,
    wageBudget: 380000,
    primaryColor: "#e30613",
    secondaryColor: "#ffffff",
    players: [
      { name: "Sergio Rochet", position: "GK", rating: 78, age: 31, nationality: "Uruguay" },
      { name: "Vitão", position: "CB", rating: 76, age: 24, nationality: "Brazil" },
      { name: "Gabriel Mercado", position: "CB", rating: 75, age: 37, nationality: "Argentina" },
      { name: "Alexandro Bernabei", position: "LB", rating: 75, age: 23, nationality: "Argentina" },
      { name: "Fabricio Bustos", position: "RB", rating: 76, age: 28, nationality: "Argentina" },
      { name: "Fernando Reges", position: "CDM", rating: 77, age: 36, nationality: "Brazil" },
      { name: "Bruno Henrique", position: "CM", rating: 76, age: 34, nationality: "Brazil" },
      { name: "Alan Patrick", position: "CAM", rating: 79, age: 33, nationality: "Brazil" },
      { name: "Wesley Ribeiro", position: "LW", rating: 76, age: 25, nationality: "Brazil" },
      { name: "Wanderson", position: "RW", rating: 76, age: 29, nationality: "Brazil" },
      { name: "Enner Valencia", position: "ST", rating: 78, age: 34, nationality: "Ecuador" },
      { name: "Rafael Borré", position: "ST", rating: 77, age: 28, nationality: "Colombia" }
    ]
  },
  {
    id: "cruzeiro",
    name: "Cruzeiro EC",
    shortName: "Cruzeiro",
    leagueId: "brasileirao",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/9781.png",
    stadium: "Mineirão",
    capacity: 61846,
    budget: 38000000,
    transferBudget: 12000000,
    wageBudget: 350000,
    primaryColor: "#003a70",
    secondaryColor: "#ffffff",
    players: [
      { name: "Cássio", position: "GK", rating: 78, age: 37, nationality: "Brazil" },
      { name: "Zé Ivaldo", position: "CB", rating: 75, age: 27, nationality: "Brazil" },
      { name: "João Marcelo", position: "CB", rating: 74, age: 24, nationality: "Brazil" },
      { name: "Marlon Xavier", position: "LB", rating: 76, age: 27, nationality: "Brazil" },
      { name: "William Furtado", position: "RB", rating: 76, age: 29, nationality: "Brazil" },
      { name: "Lucas Romero", position: "CDM", rating: 76, age: 30, nationality: "Argentina" },
      { name: "Matheus Henrique", position: "CM", rating: 77, age: 26, nationality: "Brazil" },
      { name: "Matheus Pereira", position: "CAM", rating: 80, age: 28, nationality: "Brazil" },
      { name: "Álvaro Barreal", position: "LW", rating: 76, age: 24, nationality: "Argentina" },
      { name: "Gabriel Veron", position: "RW", rating: 75, age: 21, nationality: "Brazil" },
      { name: "Kaio Jorge", position: "ST", rating: 75, age: 22, nationality: "Brazil" },
      { name: "Lautaro Díaz", position: "ST", rating: 74, age: 26, nationality: "Argentina" }
    ]
  },
  {
    id: "vasco_da_gama",
    name: "CR Vasco da Gama",
    shortName: "Vasco da Gama",
    leagueId: "brasileirao",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/10274.png",
    stadium: "Estádio São Januário",
    capacity: 21880,
    budget: 32000000,
    transferBudget: 10000000,
    wageBudget: 300000,
    primaryColor: "#000000",
    secondaryColor: "#ffffff",
    players: [
      { name: "Léo Jardim", position: "GK", rating: 78, age: 29, nationality: "Brazil" },
      { name: "Léo Pelé", position: "CB", rating: 75, age: 28, nationality: "Brazil" },
      { name: "João Victor", position: "CB", rating: 75, age: 26, nationality: "Brazil" },
      { name: "Lucas Piton", position: "LB", rating: 76, age: 23, nationality: "Brazil" },
      { name: "Paulo Henrique", position: "RB", rating: 74, age: 27, nationality: "Brazil" },
      { name: "Hugo Moura", position: "CDM", rating: 74, age: 26, nationality: "Brazil" },
      { name: "Mateus Cocão", position: "CM", rating: 73, age: 23, nationality: "Brazil" },
      { name: "Philippe Coutinho", position: "CAM", rating: 78, age: 32, nationality: "Brazil" },
      { name: "Dimitri Payet", position: "CAM", rating: 78, age: 37, nationality: "France" },
      { name: "David Corrêa", position: "LW", rating: 74, age: 28, nationality: "Brazil" },
      { name: "Pablo Vegetti", position: "ST", rating: 78, age: 35, nationality: "Argentina" },
      { name: "Rayan Vitor", position: "RW", rating: 71, age: 18, nationality: "Brazil" }
    ]
  },
  {
    id: "santos",
    name: "Santos FC",
    shortName: "Santos",
    leagueId: "brasileirao",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/9924.png",
    stadium: "Estádio Urbano Caldeira (Vila Belmiro)",
    capacity: 16068,
    budget: 30000000,
    transferBudget: 9000000,
    wageBudget: 280000,
    primaryColor: "#ffffff",
    secondaryColor: "#000000",
    players: [
      { name: "Gabriel Brazão", position: "GK", rating: 73, age: 23, nationality: "Brazil" },
      { name: "Gil", position: "CB", rating: 76, age: 37, nationality: "Brazil" },
      { name: "Joaquim Henrique", position: "CB", rating: 75, age: 25, nationality: "Brazil" },
      { name: "Gonzalo Escobar", position: "LB", rating: 74, age: 27, nationality: "Argentina" },
      { name: "JP Chermont", position: "RB", rating: 72, age: 18, nationality: "Brazil" },
      { name: "João Schmidt", position: "CDM", rating: 75, age: 31, nationality: "Brazil" },
      { name: "Diego Pituca", position: "CM", rating: 75, age: 31, nationality: "Brazil" },
      { name: "Giuliano", position: "CAM", rating: 76, age: 34, nationality: "Brazil" },
      { name: "Rómulo Otero", position: "RW", rating: 74, age: 31, nationality: "Venezuela" },
      { name: "Guilherme Augusto", position: "LW", rating: 75, age: 29, nationality: "Brazil" },
      { name: "Julio Furch", position: "ST", rating: 75, age: 34, nationality: "Argentina" },
      { name: "Willian Bigode", position: "ST", rating: 73, age: 37, nationality: "Brazil" }
    ]
  },
  {
    id: "fortaleza",
    name: "Fortaleza EC",
    shortName: "Fortaleza",
    leagueId: "brasileirao",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/9779.png",
    stadium: "Arena Castelão",
    capacity: 63903,
    budget: 28000000,
    transferBudget: 8500000,
    wageBudget: 260000,
    primaryColor: "#002b49",
    secondaryColor: "#c8102e",
    players: [
      { name: "João Ricardo", position: "GK", rating: 76, age: 35, nationality: "Brazil" },
      { name: "Benjamín Kuscevic", position: "CB", rating: 75, age: 28, nationality: "Chile" },
      { name: "Titi", position: "CB", rating: 74, age: 36, nationality: "Brazil" },
      { name: "Bruno Pacheco", position: "LB", rating: 75, age: 32, nationality: "Brazil" },
      { name: "Tinga", position: "RB", rating: 75, age: 30, nationality: "Brazil" },
      { name: "Lucas Sasha", position: "CDM", rating: 74, age: 34, nationality: "Brazil" },
      { name: "Hércules", position: "CM", rating: 75, age: 23, nationality: "Brazil" },
      { name: "Tomás Pochettino", position: "CAM", rating: 76, age: 28, nationality: "Argentina" },
      { name: "Yago Pikachu", position: "RW", rating: 76, age: 32, nationality: "Brazil" },
      { name: "Moisés Vieira", position: "LW", rating: 75, age: 27, nationality: "Brazil" },
      { name: "Juan Martín Lucero", position: "ST", rating: 77, age: 32, nationality: "Argentina" },
      { name: "Renato Kayzer", position: "ST", rating: 74, age: 28, nationality: "Brazil" }
    ]
  },
  {
    id: "bahia",
    name: "EC Bahia",
    shortName: "Bahia",
    leagueId: "brasileirao",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/9780.png",
    stadium: "Arena Fonte Nova",
    capacity: 48000,
    budget: 35000000,
    transferBudget: 11000000,
    wageBudget: 320000,
    primaryColor: "#0033a0",
    secondaryColor: "#da291c",
    players: [
      { name: "Marcos Felipe", position: "GK", rating: 75, age: 28, nationality: "Brazil" },
      { name: "Gabriel Xavier", position: "CB", rating: 75, age: 23, nationality: "Brazil" },
      { name: "Kanu", position: "CB", rating: 74, age: 27, nationality: "Brazil" },
      { name: "Luciano Juba", position: "LB", rating: 74, age: 24, nationality: "Brazil" },
      { name: "Santiago Arias", position: "RB", rating: 76, age: 32, nationality: "Colombia" },
      { name: "Caio Alexandre", position: "CDM", rating: 76, age: 25, nationality: "Brazil" },
      { name: "Jean Lucas", position: "CM", rating: 77, age: 26, nationality: "Brazil" },
      { name: "Éverton Ribeiro", position: "CAM", rating: 78, age: 35, nationality: "Brazil" },
      { name: "Cauly Oliveira", position: "CAM", rating: 77, age: 28, nationality: "Brazil" },
      { name: "Thaciano", position: "RW", rating: 76, age: 29, nationality: "Brazil" },
      { name: "Biel Teixeira", position: "LW", rating: 75, age: 23, nationality: "Brazil" },
      { name: "Everaldo Stum", position: "ST", rating: 75, age: 33, nationality: "Brazil" }
    ]
  },
  {
    id: "athletico_pr",
    name: "Club Athletico Paranaense",
    shortName: "Athletico-PR",
    leagueId: "brasileirao",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/10273.png",
    stadium: "Ligga Arena",
    capacity: 42372,
    budget: 33000000,
    transferBudget: 10500000,
    wageBudget: 310000,
    primaryColor: "#cc0000",
    secondaryColor: "#000000",
    players: [
      { name: "Bento Krepski", position: "GK", rating: 79, age: 25, nationality: "Brazil" },
      { name: "Kaique Rocha", position: "CB", rating: 74, age: 23, nationality: "Brazil" },
      { name: "Thiago Heleno", position: "CB", rating: 75, age: 35, nationality: "Brazil" },
      { name: "Lucas Esquivel", position: "LB", rating: 75, age: 22, nationality: "Argentina" },
      { name: "Madson", position: "RB", rating: 74, age: 32, nationality: "Brazil" },
      { name: "Fernandinho", position: "CDM", rating: 78, age: 39, nationality: "Brazil" },
      { name: "Erick Carvalho", position: "CM", rating: 76, age: 26, nationality: "Brazil" },
      { name: "Bruno Zapelli", position: "CAM", rating: 75, age: 22, nationality: "Argentina" },
      { name: "Tomás Cuello", position: "LW", rating: 75, age: 24, nationality: "Argentina" },
      { name: "Agustín Canobbio", position: "RW", rating: 77, age: 25, nationality: "Uruguay" },
      { name: "Gonzalo Mastriani", position: "ST", rating: 76, age: 31, nationality: "Uruguay" },
      { name: "Pablo Felipe", position: "ST", rating: 75, age: 32, nationality: "Brazil" }
    ]
  },
  {
    id: "rb_bragantino",
    name: "Red Bull Bragantino",
    shortName: "RB Bragantino",
    leagueId: "brasileirao",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/10271.png",
    stadium: "Estádio Nabi Abi Chedid",
    capacity: 17128,
    budget: 30000000,
    transferBudget: 9500000,
    wageBudget: 280000,
    primaryColor: "#ffffff",
    secondaryColor: "#cc0000",
    players: [
      { name: "Cleiton Schwengber", position: "GK", rating: 76, age: 27, nationality: "Brazil" },
      { name: "Pedro Henrique", position: "CB", rating: 74, age: 28, nationality: "Brazil" },
      { name: "Eduardo Santos", position: "CB", rating: 73, age: 26, nationality: "Brazil" },
      { name: "Juninho Capixaba", position: "LB", rating: 76, age: 27, nationality: "Brazil" },
      { name: "Nathan Mendes", position: "RB", rating: 74, age: 23, nationality: "Brazil" },
      { name: "Jadsom Silva", position: "CDM", rating: 74, age: 23, nationality: "Brazil" },
      { name: "Lucas Evangelista", position: "CM", rating: 76, age: 29, nationality: "Brazil" },
      { name: "Lincoln Henrique", position: "CAM", rating: 74, age: 25, nationality: "Brazil" },
      { name: "Helinho", position: "RW", rating: 76, age: 24, nationality: "Brazil" },
      { name: "Henry Mosquera", position: "LW", rating: 74, age: 22, nationality: "Colombia" },
      { name: "Eduardo Sasha", position: "ST", rating: 76, age: 32, nationality: "Brazil" },
      { name: "Thiago Borbas", position: "ST", rating: 74, age: 22, nationality: "Uruguay" }
    ]
  },
  {
    id: "juventude",
    name: "EC Juventude",
    shortName: "Juventude",
    leagueId: "brasileirao",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/9782.png",
    stadium: "Estádio Alfredo Jaconi",
    capacity: 19924,
    budget: 16000000,
    transferBudget: 4500000,
    wageBudget: 150000,
    primaryColor: "#008751",
    secondaryColor: "#ffffff",
    players: [
      { name: "Gabriel Vasconcelos", position: "GK", rating: 73, age: 31, nationality: "Brazil" },
      { name: "Zé Marcos", position: "CB", rating: 72, age: 26, nationality: "Brazil" },
      { name: "Danilo Boza", position: "CB", rating: 73, age: 26, nationality: "Brazil" },
      { name: "Alan Ruschel", position: "LB", rating: 72, age: 34, nationality: "Brazil" },
      { name: "João Lucas", position: "RB", rating: 73, age: 26, nationality: "Brazil" },
      { name: "Caíque Gonçalves", position: "CDM", rating: 73, age: 28, nationality: "Brazil" },
      { name: "Jadson Alves", position: "CM", rating: 73, age: 30, nationality: "Brazil" },
      { name: "Nenê", position: "CAM", rating: 74, age: 43, nationality: "Brazil" },
      { name: "Jean Carlos", position: "CAM", rating: 73, age: 32, nationality: "Brazil" },
      { name: "Lucas Barbosa", position: "RW", rating: 74, age: 23, nationality: "Brazil" },
      { name: "Erick Farias", position: "LW", rating: 72, age: 27, nationality: "Brazil" },
      { name: "Gilberto Souza", position: "ST", rating: 74, age: 35, nationality: "Brazil" }
    ]
  },
  {
    id: "criciuma",
    name: "Criciúma EC",
    shortName: "Criciúma",
    leagueId: "brasileirao",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/9783.png",
    stadium: "Estádio Heriberto Hülse",
    capacity: 19225,
    budget: 15000000,
    transferBudget: 4000000,
    wageBudget: 140000,
    primaryColor: "#ffd100",
    secondaryColor: "#000000",
    players: [
      { name: "Gustavo Silva", position: "GK", rating: 73, age: 31, nationality: "Brazil" },
      { name: "Rodrigo Fagundes", position: "CB", rating: 72, age: 37, nationality: "Brazil" },
      { name: "Wilker Ángel", position: "CB", rating: 73, age: 31, nationality: "Venezuela" },
      { name: "Marcelo Hermes", position: "LB", rating: 73, age: 29, nationality: "Brazil" },
      { name: "Claudinho", position: "RB", rating: 72, age: 23, nationality: "Brazil" },
      { name: "Barreto", position: "CDM", rating: 72, age: 28, nationality: "Brazil" },
      { name: "Newton Araújo", position: "CM", rating: 71, age: 24, nationality: "Brazil" },
      { name: "Matheusinho", position: "CAM", rating: 73, age: 26, nationality: "Brazil" },
      { name: "Fellipe Mateus", position: "CAM", rating: 74, age: 33, nationality: "Brazil" },
      { name: "Yannick Bolasie", position: "LW", rating: 74, age: 35, nationality: "DR Congo" },
      { name: "Allano", position: "RW", rating: 72, age: 29, nationality: "Brazil" },
      { name: "Éder Citadin", position: "ST", rating: 74, age: 37, nationality: "Italy" }
    ]
  },
  {
    id: "cuiaba",
    name: "Cuiabá EC",
    shortName: "Cuiabá",
    leagueId: "brasileirao",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/243763.png",
    stadium: "Arena Pantanal",
    capacity: 44097,
    budget: 16000000,
    transferBudget: 4200000,
    wageBudget: 145000,
    primaryColor: "#006633",
    secondaryColor: "#ffcc00",
    players: [
      { name: "Walter Artune", position: "GK", rating: 75, age: 36, nationality: "Brazil" },
      { name: "Marllon Borges", position: "CB", rating: 73, age: 32, nationality: "Brazil" },
      { name: "Bruno Alves", position: "CB", rating: 74, age: 33, nationality: "Brazil" },
      { name: "Ramon Ramos", position: "LB", rating: 73, age: 23, nationality: "Brazil" },
      { name: "Matheus Alexandre", position: "RB", rating: 73, age: 25, nationality: "Brazil" },
      { name: "Lucas Mineiro", position: "CDM", rating: 73, age: 28, nationality: "Brazil" },
      { name: "Fernando Sobral", position: "CM", rating: 74, age: 29, nationality: "Brazil" },
      { name: "Denilson Alves", position: "CM", rating: 73, age: 23, nationality: "Brazil" },
      { name: "Clayson", position: "LW", rating: 74, age: 29, nationality: "Brazil" },
      { name: "Derik Lacerda", position: "RW", rating: 72, age: 25, nationality: "Brazil" },
      { name: "Isidro Pitta", position: "ST", rating: 75, age: 25, nationality: "Paraguay" },
      { name: "Deyverson", position: "ST", rating: 75, age: 33, nationality: "Brazil" }
    ]
  },
  {
    id: "atletico_go",
    name: "Atlético Clube Goianiense",
    shortName: "Atlético-GO",
    leagueId: "brasileirao",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/10272.png",
    stadium: "Estádio Antônio Accioly",
    capacity: 12500,
    budget: 15000000,
    transferBudget: 4000000,
    wageBudget: 140000,
    primaryColor: "#cc0000",
    secondaryColor: "#000000",
    players: [
      { name: "Ronaldo Estrada", position: "GK", rating: 73, age: 27, nationality: "Brazil" },
      { name: "Adriano Martins", position: "CB", rating: 72, age: 27, nationality: "Brazil" },
      { name: "Alix Vinícius", position: "CB", rating: 73, age: 24, nationality: "Brazil" },
      { name: "Guilherme Romão", position: "LB", rating: 73, age: 26, nationality: "Brazil" },
      { name: "Maguinho", position: "RB", rating: 72, age: 32, nationality: "Brazil" },
      { name: "Gabriel Baralhas", position: "CDM", rating: 74, age: 25, nationality: "Brazil" },
      { name: "Rhaldney", position: "CM", rating: 73, age: 25, nationality: "Brazil" },
      { name: "Shaylon Kallyson", position: "CAM", rating: 75, age: 27, nationality: "Brazil" },
      { name: "Alejo Cruz", position: "LW", rating: 72, age: 23, nationality: "Uruguay" },
      { name: "Luiz Fernando", position: "LW", rating: 75, age: 27, nationality: "Brazil" },
      { name: "Derek Freitas", position: "ST", rating: 72, age: 26, nationality: "Brazil" },
      { name: "Emiliano Rodríguez", position: "ST", rating: 72, age: 21, nationality: "Uruguay" }
    ]
  }
];

async function run() {
  console.log("Starting Batch 3 injection (Eredivisie & Brasileirão complete)...");
  console.log(`Total new clubs to process: ${newClubs.length}`);

  let totalPlayers = 0;
  let authenticPhotos = 0;

  for (let cIdx = 0; cIdx < newClubs.length; cIdx++) {
    const club = newClubs[cIdx];
    for (let pIdx = 0; pIdx < club.players.length; pIdx++) {
      const p = club.players[pIdx];
      p.id = `${club.id}_p${pIdx + 1}`;
      p.photo = await resolvePlayerPhoto(p.name);
      if (p.photo && !p.photo.includes('default_player')) {
        authenticPhotos++;
      }
      totalPlayers++;
    }
    console.log(`[${cIdx + 1}/${newClubs.length}] Processed ${club.name}`);
  }

  // Update photo map
  fs.writeFileSync(photoMapPath, JSON.stringify(photoMap, null, 2), 'utf8');

  // Read current database
  const dbPath = path.resolve(__dirname, '../src/data/database.json');
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

  // Ensure unique IDs
  const existingIds = new Set(db.clubs.map(c => c.id));
  const clubsToAdd = newClubs.filter(c => !existingIds.has(c.id));

  db.clubs.push(...clubsToAdd);

  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
  fs.writeFileSync(path.resolve(__dirname, '../public/database.json'), JSON.stringify(db, null, 2), 'utf8');

  console.log(`\nProcessed ${newClubs.length} clubs and ${totalPlayers} players (${authenticPhotos} authentic photos).`);
  console.log(`Database updated successfully! Total clubs now: ${db.clubs.length}`);
}

run();
