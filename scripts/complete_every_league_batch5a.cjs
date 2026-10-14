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
  // --- EFL CHAMPIONSHIP (18 remaining to make 24 total) ---
  {
    id: "norwich",
    name: "Norwich City",
    shortName: "Norwich",
    leagueId: "championship",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/9850.png",
    stadium: "Carrow Road",
    capacity: 27244,
    budget: 35000000,
    transferBudget: 12000000,
    wageBudget: 350000,
    primaryColor: "#fff200",
    secondaryColor: "#00a650",
    players: [
      { name: "Angus Gunn", position: "GK", rating: 74, age: 28, nationality: "Scotland" },
      { name: "Shane Duffy", position: "CB", rating: 73, age: 32, nationality: "Republic of Ireland" },
      { name: "José Córdoba", position: "CB", rating: 72, age: 23, nationality: "Panama" },
      { name: "Callum Doyle", position: "LB", rating: 73, age: 20, nationality: "England" },
      { name: "Jack Stacey", position: "RB", rating: 73, age: 28, nationality: "England" },
      { name: "Kenny McLean", position: "CM", rating: 75, age: 32, nationality: "Scotland" },
      { name: "Marcelino Núñez", position: "CM", rating: 75, age: 24, nationality: "Chile" },
      { name: "Amankwah Forson", position: "CAM", rating: 72, age: 21, nationality: "Ghana" },
      { name: "Borja Sainz", position: "LW", rating: 76, age: 23, nationality: "Spain" },
      { name: "Christian Fassnacht", position: "RW", rating: 73, age: 30, nationality: "Switzerland" },
      { name: "Josh Sargent", position: "ST", rating: 77, age: 24, nationality: "United States" },
      { name: "Ante Crnac", position: "ST", rating: 72, age: 20, nationality: "Croatia" }
    ]
  },
  {
    id: "watford",
    name: "Watford FC",
    shortName: "Watford",
    leagueId: "championship",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/9817.png",
    stadium: "Vicarage Road",
    capacity: 22200,
    budget: 32000000,
    transferBudget: 10500000,
    wageBudget: 320000,
    primaryColor: "#fbee23",
    secondaryColor: "#ed2127",
    players: [
      { name: "Daniel Bachmann", position: "GK", rating: 73, age: 30, nationality: "Austria" },
      { name: "Francisco Sierralta", position: "CB", rating: 73, age: 27, nationality: "Chile" },
      { name: "Ryan Porteous", position: "CB", rating: 73, age: 25, nationality: "Scotland" },
      { name: "Yasser Larouci", position: "LB", rating: 71, age: 23, nationality: "Algeria" },
      { name: "Ryan Andrews", position: "RB", rating: 72, age: 20, nationality: "England" },
      { name: "Tom Dele-Bashiru", position: "CM", rating: 73, age: 24, nationality: "Nigeria" },
      { name: "Moussa Sissoko", position: "CM", rating: 75, age: 34, nationality: "France" },
      { name: "Edo Kayembe", position: "CM", rating: 74, age: 26, nationality: "DR Congo" },
      { name: "Giorgi Chakvetadze", position: "CAM", rating: 75, age: 24, nationality: "Georgia" },
      { name: "Ken Sema", position: "LW", rating: 73, age: 30, nationality: "Sweden" },
      { name: "Vakoun Bayo", position: "ST", rating: 73, age: 27, nationality: "Ivory Coast" },
      { name: "Kwadwo Baah", position: "RW", rating: 71, age: 21, nationality: "Germany" }
    ]
  },
  {
    id: "coventry",
    name: "Coventry City",
    shortName: "Coventry",
    leagueId: "championship",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/8669.png",
    stadium: "Coventry Building Society Arena",
    capacity: 32609,
    budget: 30000000,
    transferBudget: 9500000,
    wageBudget: 300000,
    primaryColor: "#00a3e0",
    secondaryColor: "#ffffff",
    players: [
      { name: "Oliver Dovin", position: "GK", rating: 73, age: 22, nationality: "Sweden" },
      { name: "Bobby Thomas", position: "CB", rating: 73, age: 23, nationality: "England" },
      { name: "Liam Kitching", position: "CB", rating: 73, age: 24, nationality: "England" },
      { name: "Jake Bidwell", position: "LB", rating: 72, age: 31, nationality: "England" },
      { name: "Milan van Ewijk", position: "RB", rating: 75, age: 23, nationality: "Netherlands" },
      { name: "Ben Sheaf", position: "CDM", rating: 75, age: 26, nationality: "England" },
      { name: "Josh Eccles", position: "CM", rating: 72, age: 24, nationality: "England" },
      { name: "Jack Rudoni", position: "CAM", rating: 74, age: 23, nationality: "England" },
      { name: "Tatsuhiro Sakamoto", position: "RW", rating: 74, age: 27, nationality: "Japan" },
      { name: "Haji Wright", position: "LW", rating: 76, age: 26, nationality: "United States" },
      { name: "Ellis Simms", position: "ST", rating: 75, age: 23, nationality: "England" },
      { name: "Norman Bassette", position: "ST", rating: 71, age: 19, nationality: "Belgium" }
    ]
  },
  {
    id: "blackburn",
    name: "Blackburn Rovers",
    shortName: "Blackburn",
    leagueId: "championship",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/8655.png",
    stadium: "Ewood Park",
    capacity: 31367,
    budget: 28000000,
    transferBudget: 8500000,
    wageBudget: 280000,
    primaryColor: "#0033a0",
    secondaryColor: "#da291c",
    players: [
      { name: "Aynsley Pears", position: "GK", rating: 73, age: 26, nationality: "England" },
      { name: "Dominic Hyam", position: "CB", rating: 74, age: 28, nationality: "Scotland" },
      { name: "Hayden Carter", position: "CB", rating: 73, age: 24, nationality: "England" },
      { name: "Harry Pickering", position: "LB", rating: 73, age: 25, nationality: "England" },
      { name: "Callum Brittain", position: "RB", rating: 73, age: 26, nationality: "England" },
      { name: "Sondre Tronstad", position: "CDM", rating: 74, age: 28, nationality: "Norway" },
      { name: "Lewis Travis", position: "CM", rating: 74, age: 26, nationality: "England" },
      { name: "Todd Cantwell", position: "CAM", rating: 75, age: 26, nationality: "England" },
      { name: "Tyrhys Dolan", position: "RW", rating: 74, age: 22, nationality: "England" },
      { name: "Ryan Hedges", position: "LW", rating: 73, age: 29, nationality: "Wales" },
      { name: "Yuki Ohashi", position: "ST", rating: 74, age: 28, nationality: "Japan" },
      { name: "Makhtar Gueye", position: "ST", rating: 72, age: 26, nationality: "Senegal" }
    ]
  },
  {
    id: "luton",
    name: "Luton Town",
    shortName: "Luton",
    leagueId: "championship",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/8344.png",
    stadium: "Kenilworth Road",
    capacity: 12000,
    budget: 34000000,
    transferBudget: 11000000,
    wageBudget: 340000,
    primaryColor: "#ff5800",
    secondaryColor: "#002b49",
    players: [
      { name: "Thomas Kaminski", position: "GK", rating: 76, age: 31, nationality: "Belgium" },
      { name: "Mark McGuinness", position: "CB", rating: 74, age: 23, nationality: "Republic of Ireland" },
      { name: "Teden Mengi", position: "CB", rating: 75, age: 22, nationality: "England" },
      { name: "Alfie Doughty", position: "LB", rating: 76, age: 24, nationality: "England" },
      { name: "Reuell Walters", position: "RB", rating: 71, age: 19, nationality: "England" },
      { name: "Marvelous Nakamba", position: "CDM", rating: 75, age: 30, nationality: "Zimbabwe" },
      { name: "Jordan Clark", position: "CM", rating: 73, age: 30, nationality: "England" },
      { name: "Tahith Chong", position: "CAM", rating: 75, age: 24, nationality: "Netherlands" },
      { name: "Carlton Morris", position: "ST", rating: 76, age: 28, nationality: "England" },
      { name: "Elijah Adebayo", position: "ST", rating: 76, age: 26, nationality: "England" },
      { name: "Jacob Brown", position: "RW", rating: 73, age: 26, nationality: "Scotland" },
      { name: "Liam Walsh", position: "CM", rating: 71, age: 26, nationality: "England" }
    ]
  },
  {
    id: "bristol_city",
    name: "Bristol City",
    shortName: "Bristol City",
    leagueId: "championship",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/8427.png",
    stadium: "Ashton Gate",
    capacity: 27000,
    budget: 27000000,
    transferBudget: 8000000,
    wageBudget: 270000,
    primaryColor: "#da291c",
    secondaryColor: "#ffffff",
    players: [
      { name: "Max O'Leary", position: "GK", rating: 73, age: 27, nationality: "Republic of Ireland" },
      { name: "Zak Vyner", position: "CB", rating: 74, age: 27, nationality: "England" },
      { name: "Luke McNally", position: "CB", rating: 73, age: 24, nationality: "Republic of Ireland" },
      { name: "Cameron Pring", position: "LB", rating: 73, age: 26, nationality: "England" },
      { name: "George Tanner", position: "RB", rating: 73, age: 24, nationality: "England" },
      { name: "Jason Knight", position: "CM", rating: 75, age: 23, nationality: "Republic of Ireland" },
      { name: "Joe Williams", position: "CM", rating: 73, age: 27, nationality: "England" },
      { name: "Max Bird", position: "CAM", rating: 73, age: 23, nationality: "England" },
      { name: "Yu Hirakawa", position: "RW", rating: 72, age: 23, nationality: "Japan" },
      { name: "Anis Mehmeti", position: "LW", rating: 73, age: 23, nationality: "Albania" },
      { name: "Sinclair Armstrong", position: "ST", rating: 73, age: 21, nationality: "Republic of Ireland" },
      { name: "Nahki Wells", position: "ST", rating: 72, age: 34, nationality: "Bermuda" }
    ]
  },
  {
    id: "swansea",
    name: "Swansea City",
    shortName: "Swansea",
    leagueId: "championship",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/10003.png",
    stadium: "Swansea.com Stadium",
    capacity: 21088,
    budget: 26000000,
    transferBudget: 7800000,
    wageBudget: 260000,
    primaryColor: "#ffffff",
    secondaryColor: "#000000",
    players: [
      { name: "Lawrence Vigouroux", position: "GK", rating: 73, age: 30, nationality: "Chile" },
      { name: "Ben Cabango", position: "CB", rating: 75, age: 24, nationality: "Wales" },
      { name: "Harry Darling", position: "CB", rating: 74, age: 25, nationality: "England" },
      { name: "Josh Tymon", position: "LB", rating: 74, age: 25, nationality: "England" },
      { name: "Josh Key", position: "RB", rating: 73, age: 24, nationality: "England" },
      { name: "Matt Grimes", position: "CM", rating: 76, age: 29, nationality: "England" },
      { name: "Gonçalo Franco", position: "CM", rating: 74, age: 23, nationality: "Portugal" },
      { name: "Ollie Cooper", position: "CAM", rating: 73, age: 24, nationality: "Wales" },
      { name: "Ronald Pereira", position: "RW", rating: 74, age: 23, nationality: "Brazil" },
      { name: "Eom Ji-sung", position: "LW", rating: 72, age: 22, nationality: "South Korea" },
      { name: "Liam Cullen", position: "ST", rating: 73, age: 25, nationality: "Wales" },
      { name: "Žan Vipotnik", position: "ST", rating: 73, age: 22, nationality: "Slovenia" }
    ]
  },
  {
    id: "stoke_city",
    name: "Stoke City",
    shortName: "Stoke",
    leagueId: "championship",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/10194.png",
    stadium: "bet365 Stadium",
    capacity: 30089,
    budget: 27000000,
    transferBudget: 8000000,
    wageBudget: 270000,
    primaryColor: "#da291c",
    secondaryColor: "#ffffff",
    players: [
      { name: "Viktor Johansson", position: "GK", rating: 75, age: 25, nationality: "Sweden" },
      { name: "Ben Gibson", position: "CB", rating: 73, age: 31, nationality: "England" },
      { name: "Ben Wilmot", position: "CB", rating: 73, age: 24, nationality: "England" },
      { name: "Eric Bocat", position: "LB", rating: 72, age: 25, nationality: "France" },
      { name: "Junior Tchamadeu", position: "RB", rating: 72, age: 20, nationality: "Cameroon" },
      { name: "Wouter Burger", position: "CDM", rating: 75, age: 23, nationality: "Netherlands" },
      { name: "Jordan Thompson", position: "CM", rating: 72, age: 27, nationality: "Northern Ireland" },
      { name: "Bae Jun-ho", position: "CAM", rating: 74, age: 21, nationality: "South Korea" },
      { name: "Million Manhoef", position: "RW", rating: 74, age: 22, nationality: "Netherlands" },
      { name: "Lewis Koumas", position: "LW", rating: 71, age: 18, nationality: "Wales" },
      { name: "Tom Cannon", position: "ST", rating: 74, age: 21, nationality: "Republic of Ireland" },
      { name: "Sam Gallagher", position: "ST", rating: 72, age: 29, nationality: "England" }
    ]
  },
  {
    id: "qpr",
    name: "Queens Park Rangers",
    shortName: "QPR",
    leagueId: "championship",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/10172.png",
    stadium: "Loftus Road",
    capacity: 18439,
    budget: 25000000,
    transferBudget: 7500000,
    wageBudget: 250000,
    primaryColor: "#0033a0",
    secondaryColor: "#ffffff",
    players: [
      { name: "Paul Nardi", position: "GK", rating: 73, age: 30, nationality: "France" },
      { name: "Steve Cook", position: "CB", rating: 73, age: 33, nationality: "England" },
      { name: "Jake Clarke-Salter", position: "CB", rating: 74, age: 26, nationality: "England" },
      { name: "Kenneth Paal", position: "LB", rating: 74, age: 27, nationality: "Suriname" },
      { name: "Jimmy Dunne", position: "RB", rating: 73, age: 26, nationality: "Republic of Ireland" },
      { name: "Jonathan Varane", position: "CDM", rating: 73, age: 22, nationality: "France" },
      { name: "Sam Field", position: "CM", rating: 73, age: 26, nationality: "England" },
      { name: "Nicolas Madsen", position: "CM", rating: 73, age: 24, nationality: "Denmark" },
      { name: "Koki Saito", position: "LW", rating: 74, age: 23, nationality: "Japan" },
      { name: "Paul Smyth", position: "RW", rating: 72, age: 26, nationality: "Northern Ireland" },
      { name: "Ilias Chair", position: "CAM", rating: 76, age: 26, nationality: "Morocco" },
      { name: "Žan Celar", position: "ST", rating: 73, age: 25, nationality: "Slovenia" }
    ]
  },
  {
    id: "millwall",
    name: "Millwall FC",
    shortName: "Millwall",
    leagueId: "championship",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/10004.png",
    stadium: "The Den",
    capacity: 20146,
    budget: 24000000,
    transferBudget: 7200000,
    wageBudget: 240000,
    primaryColor: "#002b49",
    secondaryColor: "#ffffff",
    players: [
      { name: "Lukas Jensen", position: "GK", rating: 72, age: 25, nationality: "Denmark" },
      { name: "Japhet Tanganga", position: "CB", rating: 75, age: 25, nationality: "England" },
      { name: "Jake Cooper", position: "CB", rating: 74, age: 29, nationality: "England" },
      { name: "Joe Bryan", position: "LB", rating: 73, age: 30, nationality: "England" },
      { name: "Ryan Leonard", position: "RB", rating: 72, age: 32, nationality: "England" },
      { name: "George Saville", position: "CM", rating: 74, age: 31, nationality: "Northern Ireland" },
      { name: "Casper De Norre", position: "CM", rating: 74, age: 27, nationality: "Belgium" },
      { name: "George Honeyman", position: "CAM", rating: 72, age: 29, nationality: "England" },
      { name: "Romain Esse", position: "RW", rating: 74, age: 19, nationality: "England" },
      { name: "Duncan Watmore", position: "LW", rating: 74, age: 30, nationality: "England" },
      { name: "Mihailo Ivanovic", position: "ST", rating: 73, age: 19, nationality: "Serbia" },
      { name: "Macaulay Langstaff", position: "ST", rating: 72, age: 27, nationality: "England" }
    ]
  },
  {
    id: "hull_city",
    name: "Hull City",
    shortName: "Hull",
    leagueId: "championship",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/8668.png",
    stadium: "MKM Stadium",
    capacity: 25586,
    budget: 28000000,
    transferBudget: 8500000,
    wageBudget: 280000,
    primaryColor: "#ff9900",
    secondaryColor: "#000000",
    players: [
      { name: "Ivor Pandur", position: "GK", rating: 72, age: 24, nationality: "Croatia" },
      { name: "Alfie Jones", position: "CB", rating: 73, age: 26, nationality: "England" },
      { name: "Sean McLoughlin", position: "CB", rating: 72, age: 27, nationality: "Republic of Ireland" },
      { name: "Cody Drameh", position: "RB", rating: 72, age: 22, nationality: "England" },
      { name: "Ryan Giles", position: "LB", rating: 73, age: 24, nationality: "England" },
      { name: "Regan Slater", position: "CM", rating: 73, age: 24, nationality: "England" },
      { name: "Óscar Zambrano", position: "CDM", rating: 73, age: 20, nationality: "Ecuador" },
      { name: "Abdülkadir Ömür", position: "CAM", rating: 75, age: 25, nationality: "Turkey" },
      { name: "Mohamed Belloumi", position: "RW", rating: 74, age: 22, nationality: "Algeria" },
      { name: "Liam Millar", position: "LW", rating: 74, age: 24, nationality: "Canada" },
      { name: "Chris Bedia", position: "ST", rating: 74, age: 28, nationality: "Ivory Coast" },
      { name: "Mason Burstow", position: "ST", rating: 71, age: 21, nationality: "England" }
    ]
  },
  {
    id: "preston",
    name: "Preston North End",
    shortName: "Preston",
    leagueId: "championship",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/8489.png",
    stadium: "Deepdale",
    capacity: 23408,
    budget: 23000000,
    transferBudget: 6800000,
    wageBudget: 230000,
    primaryColor: "#ffffff",
    secondaryColor: "#002b49",
    players: [
      { name: "Freddie Woodman", position: "GK", rating: 74, age: 27, nationality: "England" },
      { name: "Liam Lindsay", position: "CB", rating: 73, age: 28, nationality: "Scotland" },
      { name: "Jordan Storey", position: "CB", rating: 72, age: 26, nationality: "England" },
      { name: "Andrew Hughes", position: "LB", rating: 72, age: 32, nationality: "Wales" },
      { name: "Brad Potts", position: "RB", rating: 72, age: 30, nationality: "England" },
      { name: "Ali McCann", position: "CDM", rating: 73, age: 24, nationality: "Northern Ireland" },
      { name: "Ben Whiteman", position: "CM", rating: 74, age: 28, nationality: "England" },
      { name: "Mads Frøkjær-Jensen", position: "CAM", rating: 74, age: 25, nationality: "Denmark" },
      { name: "Sam Greenwood", position: "CAM", rating: 73, age: 22, nationality: "England" },
      { name: "Robbie Brady", position: "LW", rating: 72, age: 32, nationality: "Republic of Ireland" },
      { name: "Emil Riis Jakobsen", position: "ST", rating: 74, age: 26, nationality: "Denmark" },
      { name: "Milutin Osmajic", position: "ST", rating: 73, age: 25, nationality: "Montenegro" }
    ]
  },
  {
    id: "cardiff",
    name: "Cardiff City",
    shortName: "Cardiff",
    leagueId: "championship",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/8342.png",
    stadium: "Cardiff City Stadium",
    capacity: 33280,
    budget: 25000000,
    transferBudget: 7500000,
    wageBudget: 250000,
    primaryColor: "#0033a0",
    secondaryColor: "#ffffff",
    players: [
      { name: "Jak Alnwick", position: "GK", rating: 73, age: 31, nationality: "England" },
      { name: "Dimitrios Goutas", position: "CB", rating: 74, age: 30, nationality: "Greece" },
      { name: "Calum Chambers", position: "CB", rating: 74, age: 29, nationality: "England" },
      { name: "Perry Ng", position: "RB", rating: 74, age: 28, nationality: "England" },
      { name: "Callum O'Dowda", position: "LB", rating: 73, age: 29, nationality: "Republic of Ireland" },
      { name: "Manolis Siopis", position: "CDM", rating: 74, age: 30, nationality: "Greece" },
      { name: "David Turnbull", position: "CM", rating: 74, age: 25, nationality: "Scotland" },
      { name: "Rubin Colwill", position: "CAM", rating: 74, age: 22, nationality: "Wales" },
      { name: "Ollie Tanner", position: "RW", rating: 72, age: 22, nationality: "England" },
      { name: "Chris Willock", position: "LW", rating: 74, age: 26, nationality: "England" },
      { name: "Callum Robinson", position: "ST", rating: 74, age: 29, nationality: "Republic of Ireland" },
      { name: "Yakou Méïté", position: "ST", rating: 72, age: 28, nationality: "Ivory Coast" }
    ]
  },
  {
    id: "derby",
    name: "Derby County",
    shortName: "Derby",
    leagueId: "championship",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/8660.png",
    stadium: "Pride Park Stadium",
    capacity: 32956,
    budget: 25000000,
    transferBudget: 7500000,
    wageBudget: 250000,
    primaryColor: "#ffffff",
    secondaryColor: "#000000",
    players: [
      { name: "Jacob Widell Zetterström", position: "GK", rating: 74, age: 26, nationality: "Sweden" },
      { name: "Curtis Nelson", position: "CB", rating: 73, age: 31, nationality: "England" },
      { name: "Eiran Cashin", position: "CB", rating: 74, age: 22, nationality: "Republic of Ireland" },
      { name: "Callum Elder", position: "LB", rating: 71, age: 29, nationality: "Australia" },
      { name: "Kane Wilson", position: "RB", rating: 72, age: 24, nationality: "England" },
      { name: "Ebou Adams", position: "CDM", rating: 73, age: 28, nationality: "Gambia" },
      { name: "Kenzo Goudmijn", position: "CM", rating: 73, age: 22, nationality: "Netherlands" },
      { name: "Ben Osborn", position: "CM", rating: 72, age: 30, nationality: "England" },
      { name: "Kayden Jackson", position: "RW", rating: 73, age: 30, nationality: "England" },
      { name: "Nathaniel Mendez-Laing", position: "LW", rating: 73, age: 32, nationality: "Guatemala" },
      { name: "Jerry Yates", position: "ST", rating: 73, age: 27, nationality: "England" },
      { name: "James Collins", position: "ST", rating: 71, age: 33, nationality: "Republic of Ireland" }
    ]
  },
  {
    id: "sheffield_wed",
    name: "Sheffield Wednesday",
    shortName: "Sheff Wed",
    leagueId: "championship",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/10163.png",
    stadium: "Hillsborough Stadium",
    capacity: 39732,
    budget: 25000000,
    transferBudget: 7500000,
    wageBudget: 250000,
    primaryColor: "#0033a0",
    secondaryColor: "#ffffff",
    players: [
      { name: "James Beadle", position: "GK", rating: 73, age: 20, nationality: "England" },
      { name: "Di'Shon Bernard", position: "CB", rating: 74, age: 23, nationality: "Jamaica" },
      { name: "Akin Famewo", position: "CB", rating: 72, age: 25, nationality: "England" },
      { name: "Max Lowe", position: "LB", rating: 73, age: 27, nationality: "England" },
      { name: "Yan Valery", position: "RB", rating: 73, age: 25, nationality: "Tunisia" },
      { name: "Shea Charles", position: "CDM", rating: 74, age: 20, nationality: "Northern Ireland" },
      { name: "Barry Bannan", position: "CM", rating: 75, age: 34, nationality: "Scotland" },
      { name: "Svante Ingelsson", position: "CM", rating: 72, age: 26, nationality: "Sweden" },
      { name: "Josh Windass", position: "CAM", rating: 74, age: 30, nationality: "England" },
      { name: "Djeidi Gassama", position: "LW", rating: 73, age: 20, nationality: "Mauritania" },
      { name: "Anthony Musaba", position: "RW", rating: 73, age: 23, nationality: "Netherlands" },
      { name: "Michael Smith", position: "ST", rating: 72, age: 32, nationality: "England" }
    ]
  },
  {
    id: "portsmouth",
    name: "Portsmouth FC",
    shortName: "Portsmouth",
    leagueId: "championship",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/8462.png",
    stadium: "Fratton Park",
    capacity: 20895,
    budget: 22000000,
    transferBudget: 6500000,
    wageBudget: 220000,
    primaryColor: "#0033a0",
    secondaryColor: "#ffffff",
    players: [
      { name: "Will Norris", position: "GK", rating: 72, age: 31, nationality: "England" },
      { name: "Regan Poole", position: "CB", rating: 73, age: 26, nationality: "Wales" },
      { name: "Conor Shaughnessy", position: "CB", rating: 72, age: 28, nationality: "Republic of Ireland" },
      { name: "Connor Ogilvie", position: "LB", rating: 72, age: 28, nationality: "England" },
      { name: "Jordan Williams", position: "RB", rating: 71, age: 24, nationality: "England" },
      { name: "Marlon Pack", position: "CDM", rating: 73, age: 33, nationality: "England" },
      { name: "Freddie Potts", position: "CM", rating: 73, age: 20, nationality: "England" },
      { name: "Callum Lang", position: "CAM", rating: 73, age: 25, nationality: "England" },
      { name: "Paddy Lane", position: "RW", rating: 72, age: 23, nationality: "Northern Ireland" },
      { name: "Josh Murphy", position: "LW", rating: 73, age: 29, nationality: "England" },
      { name: "Mark O'Mahony", position: "ST", rating: 71, age: 19, nationality: "Republic of Ireland" },
      { name: "Colby Bishop", position: "ST", rating: 73, age: 27, nationality: "England" }
    ]
  },
  {
    id: "plymouth",
    name: "Plymouth Argyle",
    shortName: "Plymouth",
    leagueId: "championship",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/8401.png",
    stadium: "Home Park",
    capacity: 17900,
    budget: 21000000,
    transferBudget: 6000000,
    wageBudget: 210000,
    primaryColor: "#004d2c",
    secondaryColor: "#ffffff",
    players: [
      { name: "Daniel Grimshaw", position: "GK", rating: 72, age: 26, nationality: "England" },
      { name: "Lewis Gibson", position: "CB", rating: 73, age: 24, nationality: "England" },
      { name: "Kornél Szűcs", position: "CB", rating: 72, age: 22, nationality: "Hungary" },
      { name: "Bali Mumba", position: "LB", rating: 73, age: 22, nationality: "England" },
      { name: "Joe Edwards", position: "RB", rating: 71, age: 33, nationality: "England" },
      { name: "Adam Randell", position: "CM", rating: 73, age: 23, nationality: "England" },
      { name: "Darko Gyabi", position: "CM", rating: 72, age: 20, nationality: "England" },
      { name: "Rami Al Hajj", position: "CAM", rating: 73, age: 22, nationality: "Sweden" },
      { name: "Morgan Whittaker", position: "RW", rating: 76, age: 23, nationality: "England" },
      { name: "Ibrahim Cissoko", position: "LW", rating: 74, age: 21, nationality: "Netherlands" },
      { name: "Ryan Hardie", position: "ST", rating: 73, age: 27, nationality: "Scotland" },
      { name: "Michael Obafemi", position: "ST", rating: 73, age: 24, nationality: "Republic of Ireland" }
    ]
  },
  {
    id: "oxford_utd",
    name: "Oxford United",
    shortName: "Oxford Utd",
    leagueId: "championship",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/8653.png",
    stadium: "Kassam Stadium",
    capacity: 12500,
    budget: 20000000,
    transferBudget: 5500000,
    wageBudget: 200000,
    primaryColor: "#ffd100",
    secondaryColor: "#002b49",
    players: [
      { name: "Jamie Cumming", position: "GK", rating: 72, age: 24, nationality: "England" },
      { name: "Ciaron Brown", position: "CB", rating: 72, age: 26, nationality: "Northern Ireland" },
      { name: "Elliott Moore", position: "CB", rating: 73, age: 27, nationality: "England" },
      { name: "Greg Leigh", position: "LB", rating: 72, age: 29, nationality: "Jamaica" },
      { name: "Peter Kioso", position: "RB", rating: 72, age: 25, nationality: "Republic of Ireland" },
      { name: "Will Vaulks", position: "CDM", rating: 73, age: 30, nationality: "Wales" },
      { name: "Cameron Brannagan", position: "CM", rating: 74, age: 28, nationality: "England" },
      { name: "Idris El Mizouni", position: "CM", rating: 72, age: 23, nationality: "Tunisia" },
      { name: "Przemyslaw Placheta", position: "LW", rating: 72, age: 26, nationality: "Poland" },
      { name: "Siriki Dembélé", position: "RW", rating: 74, age: 27, nationality: "Scotland" },
      { name: "Mark Harris", position: "ST", rating: 73, age: 25, nationality: "Wales" },
      { name: "Dane Scarlett", position: "ST", rating: 72, age: 20, nationality: "England" }
    ]
  },

  // --- PRIMERA DIVISIÓN ARGENTINA (14 remaining to make 20 total) ---
  {
    id: "estudiantes",
    name: "Estudiantes de La Plata",
    shortName: "Estudiantes",
    leagueId: "argentina",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/10080.png",
    stadium: "Estadio Jorge Luis Hirschi (UNO)",
    capacity: 32530,
    budget: 26000000,
    transferBudget: 8000000,
    wageBudget: 260000,
    primaryColor: "#da291c",
    secondaryColor: "#ffffff",
    players: [
      { name: "Matías Mansilla", position: "GK", rating: 75, age: 28, nationality: "Argentina" },
      { name: "Luciano Lollo", position: "CB", rating: 74, age: 37, nationality: "Argentina" },
      { name: "Facundo Rodríguez", position: "CB", rating: 74, age: 24, nationality: "Argentina" },
      { name: "Gastón Benedetti", position: "LB", rating: 74, age: 23, nationality: "Argentina" },
      { name: "Eric Meza", position: "RB", rating: 74, age: 25, nationality: "Argentina" },
      { name: "Enzo Pérez", position: "CDM", rating: 77, age: 38, nationality: "Argentina" },
      { name: "Santiago Ascacíbar", position: "CM", rating: 77, age: 27, nationality: "Argentina" },
      { name: "José Sosa", position: "CAM", rating: 76, age: 39, nationality: "Argentina" },
      { name: "Tiago Palacios", position: "CAM", rating: 75, age: 23, nationality: "Uruguay" },
      { name: "Edwuin Cetré", position: "RW", rating: 75, age: 26, nationality: "Colombia" },
      { name: "Guido Carrillo", position: "ST", rating: 76, age: 33, nationality: "Argentina" },
      { name: "Luciano Giménez", position: "ST", rating: 72, age: 24, nationality: "Argentina" }
    ]
  },
  {
    id: "talleres",
    name: "Talleres de Córdoba",
    shortName: "Talleres",
    leagueId: "argentina",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/10081.png",
    stadium: "Estadio Mario Alberto Kempes",
    capacity: 57000,
    budget: 27000000,
    transferBudget: 8500000,
    wageBudget: 270000,
    primaryColor: "#002b49",
    secondaryColor: "#ffffff",
    players: [
      { name: "Guido Herrera", position: "GK", rating: 77, age: 32, nationality: "Argentina" },
      { name: "Matías Catalán", position: "CB", rating: 76, age: 31, nationality: "Chile" },
      { name: "Juan Gabriel Rodríguez", position: "CB", rating: 74, age: 30, nationality: "Argentina" },
      { name: "Miguel Navarro", position: "LB", rating: 74, age: 25, nationality: "Venezuela" },
      { name: "Gastón Benavídez", position: "RB", rating: 75, age: 28, nationality: "Argentina" },
      { name: "Juan Portilla", position: "CDM", rating: 75, age: 25, nationality: "Colombia" },
      { name: "Marcos Portillo", position: "CM", rating: 74, age: 24, nationality: "Argentina" },
      { name: "Rubén Botta", position: "CAM", rating: 77, age: 34, nationality: "Argentina" },
      { name: "Sebastián Palacios", position: "RW", rating: 75, age: 32, nationality: "Argentina" },
      { name: "Valentín Depietri", position: "LW", rating: 74, age: 23, nationality: "Argentina" },
      { name: "Federico Girotti", position: "ST", rating: 75, age: 25, nationality: "Argentina" },
      { name: "Cristian Tarragona", position: "ST", rating: 73, age: 33, nationality: "Argentina" }
    ]
  },
  {
    id: "rosario_central",
    name: "Rosario Central",
    shortName: "Rosario Central",
    leagueId: "argentina",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/10078.png",
    stadium: "Estadio Gigante de Arroyito",
    capacity: 48900,
    budget: 25000000,
    transferBudget: 7500000,
    wageBudget: 250000,
    primaryColor: "#0033a0",
    secondaryColor: "#ffd100",
    players: [
      { name: "Jorge Broun", position: "GK", rating: 75, age: 38, nationality: "Argentina" },
      { name: "Facundo Mallo", position: "CB", rating: 75, age: 29, nationality: "Uruguay" },
      { name: "Carlos Quintana", position: "CB", rating: 75, age: 36, nationality: "Argentina" },
      { name: "Agustín Sández", position: "LB", rating: 74, age: 23, nationality: "Paraguay" },
      { name: "Damián Martínez", position: "RB", rating: 74, age: 34, nationality: "Argentina" },
      { name: "Franco Ibarra", position: "CDM", rating: 74, age: 23, nationality: "Argentina" },
      { name: "Mauricio Martínez", position: "CM", rating: 74, age: 31, nationality: "Argentina" },
      { name: "Ignacio Malcorra", position: "CAM", rating: 77, age: 37, nationality: "Argentina" },
      { name: "Maximiliano Lovera", position: "RW", rating: 74, age: 25, nationality: "Argentina" },
      { name: "Jaminton Campaz", position: "LW", rating: 77, age: 24, nationality: "Colombia" },
      { name: "Marco Ruben", position: "ST", rating: 75, age: 37, nationality: "Argentina" },
      { name: "Enzo Copetti", position: "ST", rating: 75, age: 28, nationality: "Argentina" }
    ]
  },
  {
    id: "newells",
    name: "Newell's Old Boys",
    shortName: "Newell's",
    leagueId: "argentina",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/10077.png",
    stadium: "Estadio Marcelo Bielsa (El Coloso del Parque)",
    capacity: 42000,
    budget: 24000000,
    transferBudget: 7200000,
    wageBudget: 240000,
    primaryColor: "#000000",
    secondaryColor: "#da291c",
    players: [
      { name: "Ramiro Macagno", position: "GK", rating: 74, age: 27, nationality: "Argentina" },
      { name: "Gustavo Velázquez", position: "CB", rating: 75, age: 33, nationality: "Paraguay" },
      { name: "Saúl Salcedo", position: "CB", rating: 74, age: 26, nationality: "Paraguay" },
      { name: "Ángelo Martino", position: "LB", rating: 73, age: 26, nationality: "Argentina" },
      { name: "Armando Méndez", position: "RB", rating: 74, age: 28, nationality: "Uruguay" },
      { name: "Rodrigo Fernández", position: "CDM", rating: 74, age: 28, nationality: "Uruguay" },
      { name: "Éver Banega", position: "CM", rating: 78, age: 36, nationality: "Argentina" },
      { name: "Mateo Silvetti", position: "RW", rating: 73, age: 18, nationality: "Argentina" },
      { name: "Francisco González", position: "LW", rating: 73, age: 23, nationality: "Argentina" },
      { name: "Matko Miljevic", position: "CAM", rating: 73, age: 23, nationality: "Argentina" },
      { name: "Juan Ignacio Ramírez", position: "ST", rating: 75, age: 27, nationality: "Uruguay" },
      { name: "Juanchón García", position: "ST", rating: 72, age: 31, nationality: "Argentina" }
    ]
  },
  {
    id: "belgrano",
    name: "CA Belgrano",
    shortName: "Belgrano",
    leagueId: "argentina",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/10082.png",
    stadium: "Estadio Julio César Villagra (El Gigante de Alberdi)",
    capacity: 34830,
    budget: 22000000,
    transferBudget: 6500000,
    wageBudget: 220000,
    primaryColor: "#00a3e0",
    secondaryColor: "#ffffff",
    players: [
      { name: "Juan Espínola", position: "GK", rating: 74, age: 29, nationality: "Paraguay" },
      { name: "Alejandro Rébola", position: "CB", rating: 73, age: 35, nationality: "Argentina" },
      { name: "Mariano Troilo", position: "CB", rating: 72, age: 21, nationality: "Argentina" },
      { name: "Rafael Delgado", position: "LB", rating: 73, age: 34, nationality: "Argentina" },
      { name: "Gabriel Compagnucci", position: "RB", rating: 73, age: 32, nationality: "Argentina" },
      { name: "Esteban Rolón", position: "CDM", rating: 74, age: 29, nationality: "Argentina" },
      { name: "Facundo Quignón", position: "CM", rating: 73, age: 31, nationality: "Argentina" },
      { name: "Francisco González Metilli", position: "CAM", rating: 74, age: 27, nationality: "Argentina" },
      { name: "Bryan Reyna", position: "LW", rating: 75, age: 25, nationality: "Peru" },
      { name: "Juan Velázquez", position: "RW", rating: 72, age: 20, nationality: "Argentina" },
      { name: "Franco Jara", position: "ST", rating: 75, age: 36, nationality: "Argentina" },
      { name: "Nicolás Fernández", position: "ST", rating: 74, age: 28, nationality: "Argentina" }
    ]
  },
  {
    id: "argentinos_jrs",
    name: "Argentinos Juniors",
    shortName: "Argentinos",
    leagueId: "argentina",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/10083.png",
    stadium: "Estadio Diego Armando Maradona",
    capacity: 26000,
    budget: 23000000,
    transferBudget: 6800000,
    wageBudget: 230000,
    primaryColor: "#da291c",
    secondaryColor: "#ffffff",
    players: [
      { name: "Diego Rodríguez", position: "GK", rating: 75, age: 35, nationality: "Argentina" },
      { name: "Francisco Álvarez", position: "CB", rating: 74, age: 24, nationality: "Argentina" },
      { name: "Tobías Palacio", position: "CB", rating: 73, age: 17, nationality: "Argentina" },
      { name: "Román Vega", position: "LB", rating: 73, age: 20, nationality: "Argentina" },
      { name: "Kevin Coronel", position: "RB", rating: 72, age: 20, nationality: "Argentina" },
      { name: "Alan Rodríguez", position: "CM", rating: 75, age: 24, nationality: "Uruguay" },
      { name: "Francis Mac Allister", position: "CDM", rating: 73, age: 28, nationality: "Argentina" },
      { name: "Nicolás Oroz", position: "CAM", rating: 74, age: 30, nationality: "Argentina" },
      { name: "Alan Lescano", position: "CAM", rating: 75, age: 22, nationality: "Argentina" },
      { name: "Gastón Verón", position: "ST", rating: 73, age: 23, nationality: "Argentina" },
      { name: "Maximiliano Romero", position: "ST", rating: 74, age: 25, nationality: "Argentina" },
      { name: "José María Herrera", position: "LW", rating: 73, age: 21, nationality: "Argentina" }
    ]
  },
  {
    id: "huracan",
    name: "CA Huracán",
    shortName: "Huracán",
    leagueId: "argentina",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/10084.png",
    stadium: "Estadio Tomás Adolfo Ducó",
    capacity: 48314,
    budget: 22000000,
    transferBudget: 6500000,
    wageBudget: 220000,
    primaryColor: "#ffffff",
    secondaryColor: "#da291c",
    players: [
      { name: "Hernán Galíndez", position: "GK", rating: 76, age: 37, nationality: "Ecuador" },
      { name: "Fernando Tobio", position: "CB", rating: 74, age: 34, nationality: "Argentina" },
      { name: "Fabio Pereyra", position: "CB", rating: 73, age: 34, nationality: "Argentina" },
      { name: "César Ibáñez", position: "LB", rating: 73, age: 25, nationality: "Argentina" },
      { name: "Hernán De La Fuente", position: "RB", rating: 73, age: 27, nationality: "Argentina" },
      { name: "Federico Fattori", position: "CDM", rating: 74, age: 32, nationality: "Argentina" },
      { name: "Williams Alarcón", position: "CM", rating: 75, age: 23, nationality: "Chile" },
      { name: "Rodrigo Echeverría", position: "CM", rating: 76, age: 29, nationality: "Chile" },
      { name: "Walter Mazzantti", position: "RW", rating: 75, age: 27, nationality: "Argentina" },
      { name: "Héctor Fértoli", position: "LW", rating: 73, age: 29, nationality: "Argentina" },
      { name: "Eric Ramírez", position: "ST", rating: 74, age: 27, nationality: "Argentina" },
      { name: "Ramón Ábila", position: "ST", rating: 74, age: 34, nationality: "Argentina" }
    ]
  },
  {
    id: "lanus",
    name: "CA Lanús",
    shortName: "Lanús",
    leagueId: "argentina",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/10085.png",
    stadium: "Estadio Ciudad de Lanús (La Fortaleza)",
    capacity: 47027,
    budget: 23000000,
    transferBudget: 6800000,
    wageBudget: 230000,
    primaryColor: "#800000",
    secondaryColor: "#ffffff",
    players: [
      { name: "Nahuel Losada", position: "GK", rating: 75, age: 31, nationality: "Argentina" },
      { name: "Carlos Izquierdoz", position: "CB", rating: 75, age: 35, nationality: "Argentina" },
      { name: "Ezequiel Muñoz", position: "CB", rating: 74, age: 33, nationality: "Argentina" },
      { name: "Julio Soler", position: "LB", rating: 75, age: 19, nationality: "Argentina" },
      { name: "Nicolás Morgantini", position: "RB", rating: 73, age: 27, nationality: "Argentina" },
      { name: "Gonzalo Pérez", position: "CDM", rating: 73, age: 23, nationality: "Uruguay" },
      { name: "Felipe Peña Biafore", position: "CM", rating: 75, age: 23, nationality: "Argentina" },
      { name: "Marcelino Moreno", position: "CAM", rating: 77, age: 29, nationality: "Argentina" },
      { name: "Eduardo Salvio", position: "RW", rating: 76, age: 34, nationality: "Argentina" },
      { name: "Ramiro Carrera", position: "LW", rating: 74, age: 30, nationality: "Argentina" },
      { name: "Walter Bou", position: "ST", rating: 76, age: 30, nationality: "Argentina" },
      { name: "Leandro Díaz", position: "ST", rating: 74, age: 32, nationality: "Argentina" }
    ]
  },
  {
    id: "godoy_cruz",
    name: "Godoy Cruz",
    shortName: "Godoy Cruz",
    leagueId: "argentina",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/10086.png",
    stadium: "Estadio Malvinas Argentinas",
    capacity: 42500,
    budget: 21000000,
    transferBudget: 6000000,
    wageBudget: 210000,
    primaryColor: "#0033a0",
    secondaryColor: "#ffffff",
    players: [
      { name: "Franco Petroli", position: "GK", rating: 75, age: 26, nationality: "Argentina" },
      { name: "Pier Barrios", position: "CB", rating: 74, age: 34, nationality: "Argentina" },
      { name: "Federico Rasmussen", position: "CB", rating: 74, age: 32, nationality: "Argentina" },
      { name: "Elías Pereyra", position: "LB", rating: 72, age: 25, nationality: "Argentina" },
      { name: "Lucas Arce", position: "RB", rating: 74, age: 27, nationality: "Argentina" },
      { name: "Bruno Leyes", position: "CDM", rating: 74, age: 23, nationality: "Argentina" },
      { name: "Vicente Poggi", position: "CM", rating: 73, age: 22, nationality: "Uruguay" },
      { name: "Nicolás Fernández", position: "CM", rating: 73, age: 25, nationality: "Uruguay" },
      { name: "Santino Andino", position: "LW", rating: 73, age: 18, nationality: "Argentina" },
      { name: "Facundo Altamira", position: "RW", rating: 74, age: 23, nationality: "Argentina" },
      { name: "Salomón Rodríguez", position: "ST", rating: 75, age: 24, nationality: "Uruguay" },
      { name: "Martín Pino", position: "ST", rating: 71, age: 26, nationality: "Argentina" }
    ]
  },
  {
    id: "defensa_justicia",
    name: "Defensa y Justicia",
    shortName: "Defensa",
    leagueId: "argentina",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/10087.png",
    stadium: "Estadio Norberto Tomaghello",
    capacity: 20000,
    budget: 21000000,
    transferBudget: 6000000,
    wageBudget: 210000,
    primaryColor: "#008751",
    secondaryColor: "#ffd100",
    players: [
      { name: "Enrique Bologna", position: "GK", rating: 73, age: 42, nationality: "Argentina" },
      { name: "Emanuel Aguilera", position: "CB", rating: 73, age: 35, nationality: "Argentina" },
      { name: "Santiago Ramos Mingo", position: "CB", rating: 74, age: 22, nationality: "Argentina" },
      { name: "Alexis Soto", position: "LB", rating: 74, age: 30, nationality: "Argentina" },
      { name: "Tobías Rubio", position: "RB", rating: 72, age: 20, nationality: "Argentina" },
      { name: "Kevin Gutiérrez", position: "CDM", rating: 75, age: 27, nationality: "Argentina" },
      { name: "Benjamín Schamine", position: "CM", rating: 71, age: 20, nationality: "Argentina" },
      { name: "Aaron Molinas", position: "CAM", rating: 74, age: 24, nationality: "Argentina" },
      { name: "Gabriel Alanís", position: "LW", rating: 73, age: 30, nationality: "Argentina" },
      { name: "Luciano Herrera", position: "RW", rating: 72, age: 28, nationality: "Argentina" },
      { name: "Abiel Osorio", position: "ST", rating: 73, age: 21, nationality: "Argentina" },
      { name: "Juan Miritello", position: "ST", rating: 73, age: 25, nationality: "Argentina" }
    ]
  },
  {
    id: "gimnasia",
    name: "Gimnasia y Esgrima La Plata",
    shortName: "Gimnasia",
    leagueId: "argentina",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/10079.png",
    stadium: "Estadio Juan Carmelo Zerillo (El Bosque)",
    capacity: 24544,
    budget: 20000000,
    transferBudget: 5800000,
    wageBudget: 200000,
    primaryColor: "#002b49",
    secondaryColor: "#ffffff",
    players: [
      { name: "Marcos Ledesma", position: "GK", rating: 73, age: 28, nationality: "Argentina" },
      { name: "Leonardo Morales", position: "CB", rating: 74, age: 33, nationality: "Argentina" },
      { name: "Enzo Martínez", position: "CB", rating: 72, age: 25, nationality: "Uruguay" },
      { name: "Nicolás Colazo", position: "LB", rating: 72, age: 34, nationality: "Argentina" },
      { name: "Juan Pintado", position: "RB", rating: 74, age: 26, nationality: "Uruguay" },
      { name: "Martín Fernández", position: "CDM", rating: 73, age: 23, nationality: "Uruguay" },
      { name: "Lucas Castro", position: "CM", rating: 73, age: 35, nationality: "Argentina" },
      { name: "Pablo De Blasis", position: "CAM", rating: 75, age: 36, nationality: "Argentina" },
      { name: "David Zalazar", position: "LW", rating: 72, age: 22, nationality: "Argentina" },
      { name: "Matías Abaldo", position: "RW", rating: 74, age: 20, nationality: "Uruguay" },
      { name: "Rodrigo Castillo", position: "ST", rating: 74, age: 25, nationality: "Argentina" },
      { name: "Norberto Briasco", position: "ST", rating: 73, age: 28, nationality: "Armenia" }
    ]
  },
  {
    id: "banfield",
    name: "CA Banfield",
    shortName: "Banfield",
    leagueId: "argentina",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/10088.png",
    stadium: "Estadio Florencio Sola",
    capacity: 34901,
    budget: 19000000,
    transferBudget: 5500000,
    wageBudget: 190000,
    primaryColor: "#008751",
    secondaryColor: "#ffffff",
    players: [
      { name: "Facundo Sanguinetti", position: "GK", rating: 73, age: 23, nationality: "Argentina" },
      { name: "Alexis Maldonado", position: "CB", rating: 73, age: 27, nationality: "Argentina" },
      { name: "Nicolás Hernández", position: "CB", rating: 73, age: 26, nationality: "Colombia" },
      { name: "Mathías De Ritis", position: "LB", rating: 71, age: 21, nationality: "Uruguay" },
      { name: "Ramiro Di Luciano", position: "RB", rating: 71, age: 20, nationality: "Argentina" },
      { name: "Cristian Núñez", position: "CDM", rating: 73, age: 26, nationality: "Paraguay" },
      { name: "Martín Cañete", position: "CM", rating: 73, age: 25, nationality: "Argentina" },
      { name: "Ignacio Rodríguez", position: "CAM", rating: 73, age: 22, nationality: "Argentina" },
      { name: "Juan Pablo Álvarez", position: "RW", rating: 73, age: 28, nationality: "Argentina" },
      { name: "Gerónimo Rivera", position: "LW", rating: 74, age: 21, nationality: "Argentina" },
      { name: "Bruno Sepúlveda", position: "ST", rating: 74, age: 31, nationality: "Argentina" },
      { name: "Leandro Garate", position: "ST", rating: 72, age: 31, nationality: "Argentina" }
    ]
  },
  {
    id: "platense",
    name: "CA Platense",
    shortName: "Platense",
    leagueId: "argentina",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/10089.png",
    stadium: "Estadio Ciudad de Vicente López",
    capacity: 31030,
    budget: 18000000,
    transferBudget: 5000000,
    wageBudget: 180000,
    primaryColor: "#804000",
    secondaryColor: "#ffffff",
    players: [
      { name: "Juan Pablo Cozzani", position: "GK", rating: 74, age: 25, nationality: "Argentina" },
      { name: "Ignacio Vázquez", position: "CB", rating: 74, age: 27, nationality: "Argentina" },
      { name: "Gastón Suso", position: "CB", rating: 74, age: 33, nationality: "Argentina" },
      { name: "Sasha Marcich", position: "LB", rating: 73, age: 26, nationality: "Argentina" },
      { name: "Bautista Barros Schelotto", position: "RB", rating: 72, age: 24, nationality: "Argentina" },
      { name: "Leonel Picco", position: "CDM", rating: 74, age: 25, nationality: "Argentina" },
      { name: "Fernando Juárez", position: "CM", rating: 73, age: 26, nationality: "Argentina" },
      { name: "Guido Mainero", position: "RW", rating: 74, age: 29, nationality: "Argentina" },
      { name: "Ronaldo Martínez", position: "LW", rating: 74, age: 28, nationality: "Paraguay" },
      { name: "Vicente Taborda", position: "CAM", rating: 74, age: 23, nationality: "Argentina" },
      { name: "Mateo Pellegrino", position: "ST", rating: 75, age: 22, nationality: "Spain" },
      { name: "Ignacio Schor", position: "ST", rating: 71, age: 24, nationality: "Argentina" }
    ]
  },
  {
    id: "tigre",
    name: "CA Tigre",
    shortName: "Tigre",
    leagueId: "argentina",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/10090.png",
    stadium: "Estadio José Dellagiovanna",
    capacity: 26282,
    budget: 18000000,
    transferBudget: 5000000,
    wageBudget: 180000,
    primaryColor: "#0033a0",
    secondaryColor: "#da291c",
    players: [
      { name: "Felipe Zenobio", position: "GK", rating: 73, age: 24, nationality: "Argentina" },
      { name: "Nehuén Paz", position: "CB", rating: 73, age: 31, nationality: "Argentina" },
      { name: "Ramón Arias", position: "CB", rating: 73, age: 31, nationality: "Uruguay" },
      { name: "Nahuel Banegas", position: "LB", rating: 73, age: 27, nationality: "Argentina" },
      { name: "Martín Garay", position: "RB", rating: 73, age: 25, nationality: "Argentina" },
      { name: "Agustín Cardozo", position: "CDM", rating: 74, age: 27, nationality: "Argentina" },
      { name: "Santiago González", position: "CM", rating: 72, age: 22, nationality: "Argentina" },
      { name: "Gonzalo Maroni", position: "CAM", rating: 74, age: 25, nationality: "Argentina" },
      { name: "Tomás Galván", position: "CAM", rating: 73, age: 24, nationality: "Argentina" },
      { name: "Blas Armoa", position: "RW", rating: 73, age: 24, nationality: "Paraguay" },
      { name: "Florián Monzón", position: "ST", rating: 74, age: 23, nationality: "Argentina" },
      { name: "Eric Ramírez", position: "ST", rating: 72, age: 25, nationality: "Venezuela" }
    ]
  }
];

async function run() {
  console.log("Starting Batch 5A injection (Championship & Argentina complete)...");
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
