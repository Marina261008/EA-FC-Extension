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
  // --- MAJOR LEAGUE SOCCER (22 remaining to make 29 total) ---
  {
    id: "ny_red_bulls",
    name: "New York Red Bulls",
    shortName: "NY Red Bulls",
    leagueId: "mls",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/9996.png",
    stadium: "Red Bull Arena",
    capacity: 25000,
    budget: 35000000,
    transferBudget: 12000000,
    wageBudget: 350000,
    primaryColor: "#da291c",
    secondaryColor: "#ffffff",
    players: [
      { name: "Carlos Coronel", position: "GK", rating: 74, age: 27, nationality: "Paraguay" },
      { name: "Sean Nealis", position: "CB", rating: 74, age: 27, nationality: "United States" },
      { name: "Andrés Reyes", position: "CB", rating: 73, age: 25, nationality: "Colombia" },
      { name: "John Tolkin", position: "LB", rating: 75, age: 22, nationality: "United States" },
      { name: "Dylan Nealis", position: "RB", rating: 72, age: 26, nationality: "United States" },
      { name: "Daniel Edelman", position: "CDM", rating: 73, age: 21, nationality: "United States" },
      { name: "Felipe Carballo", position: "CM", rating: 75, age: 28, nationality: "Uruguay" },
      { name: "Emil Forsberg", position: "CAM", rating: 79, age: 32, nationality: "Sweden" },
      { name: "Lewis Morgan", position: "LW", rating: 77, age: 27, nationality: "Scotland" },
      { name: "Cameron Harper", position: "RW", rating: 72, age: 22, nationality: "United States" },
      { name: "Dante Vanzeir", position: "ST", rating: 75, age: 26, nationality: "Belgium" },
      { name: "Elias Manoel", position: "ST", rating: 72, age: 22, nationality: "Brazil" }
    ]
  },
  {
    id: "philadelphia_union",
    name: "Philadelphia Union",
    shortName: "Philadelphia",
    leagueId: "mls",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/192036.png",
    stadium: "Subaru Park",
    capacity: 18500,
    budget: 32000000,
    transferBudget: 10000000,
    wageBudget: 320000,
    primaryColor: "#002b49",
    secondaryColor: "#b38808",
    players: [
      { name: "Andre Blake", position: "GK", rating: 77, age: 33, nationality: "Jamaica" },
      { name: "Jakob Glesnes", position: "CB", rating: 75, age: 30, nationality: "Norway" },
      { name: "Jack Elliott", position: "CB", rating: 74, age: 28, nationality: "England" },
      { name: "Kai Wagner", position: "LB", rating: 77, age: 27, nationality: "Germany" },
      { name: "Nathan Harriel", position: "RB", rating: 73, age: 23, nationality: "United States" },
      { name: "José Martínez", position: "CDM", rating: 75, age: 30, nationality: "Venezuela" },
      { name: "Leon Flach", position: "CM", rating: 73, age: 23, nationality: "United States" },
      { name: "Alejandro Bedoya", position: "CM", rating: 73, age: 37, nationality: "United States" },
      { name: "Dániel Gazdag", position: "CAM", rating: 77, age: 28, nationality: "Hungary" },
      { name: "Quinn Sullivan", position: "RW", rating: 73, age: 20, nationality: "United States" },
      { name: "Mikael Uhre", position: "ST", rating: 75, age: 29, nationality: "Denmark" },
      { name: "Tai Baribo", position: "ST", rating: 75, age: 26, nationality: "Israel" }
    ]
  },
  {
    id: "orlando_city",
    name: "Orlando City SC",
    shortName: "Orlando City",
    leagueId: "mls",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/500125.png",
    stadium: "Inter&Co Stadium",
    capacity: 25500,
    budget: 34000000,
    transferBudget: 11000000,
    wageBudget: 340000,
    primaryColor: "#61259e",
    secondaryColor: "#ffe100",
    players: [
      { name: "Pedro Gallese", position: "GK", rating: 77, age: 34, nationality: "Peru" },
      { name: "Robin Jansson", position: "CB", rating: 75, age: 32, nationality: "Sweden" },
      { name: "Rodrigo Schlegel", position: "CB", rating: 73, age: 27, nationality: "Argentina" },
      { name: "Rafael Santos", position: "LB", rating: 73, age: 26, nationality: "Brazil" },
      { name: "Dagur Dan Thórhallsson", position: "RB", rating: 73, age: 24, nationality: "Iceland" },
      { name: "César Araújo", position: "CDM", rating: 75, age: 23, nationality: "Uruguay" },
      { name: "Wilder Cartagena", position: "CDM", rating: 74, age: 29, nationality: "Peru" },
      { name: "Martín Ojeda", position: "CAM", rating: 76, age: 25, nationality: "Argentina" },
      { name: "Facundo Torres", position: "RW", rating: 78, age: 24, nationality: "Uruguay" },
      { name: "Iván Angulo", position: "LW", rating: 74, age: 25, nationality: "Colombia" },
      { name: "Duncan McGuire", position: "ST", rating: 75, age: 23, nationality: "United States" },
      { name: "Luis Muriel", position: "ST", rating: 76, age: 33, nationality: "Colombia" }
    ]
  },
  {
    id: "atlanta_united",
    name: "Atlanta United",
    shortName: "Atlanta Utd",
    leagueId: "mls",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/773958.png",
    stadium: "Mercedes-Benz Stadium",
    capacity: 42500,
    budget: 38000000,
    transferBudget: 13000000,
    wageBudget: 380000,
    primaryColor: "#800000",
    secondaryColor: "#000000",
    players: [
      { name: "Brad Guzan", position: "GK", rating: 73, age: 39, nationality: "United States" },
      { name: "Stian Gregersen", position: "CB", rating: 75, age: 29, nationality: "Norway" },
      { name: "Derrick Williams", position: "CB", rating: 73, age: 31, nationality: "Republic of Ireland" },
      { name: "Pedro Amador", position: "LB", rating: 73, age: 25, nationality: "Portugal" },
      { name: "Brooks Lennon", position: "RB", rating: 74, age: 26, nationality: "United States" },
      { name: "Tristan Muyumba", position: "CM", rating: 74, age: 27, nationality: "France" },
      { name: "Bartosz Slisz", position: "CDM", rating: 75, age: 25, nationality: "Poland" },
      { name: "Aleksei Miranchuk", position: "CAM", rating: 79, age: 28, nationality: "Russia" },
      { name: "Saba Lobjanidze", position: "RW", rating: 76, age: 29, nationality: "Georgia" },
      { name: "Xande Silva", position: "LW", rating: 73, age: 27, nationality: "Portugal" },
      { name: "Daniel Ríos", position: "ST", rating: 73, age: 29, nationality: "Mexico" },
      { name: "Jamal Thiaré", position: "ST", rating: 72, age: 31, nationality: "Senegal" }
    ]
  },
  {
    id: "charlotte_fc",
    name: "Charlotte FC",
    shortName: "Charlotte",
    leagueId: "mls",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/1218653.png",
    stadium: "Bank of America Stadium",
    capacity: 38000,
    budget: 33000000,
    transferBudget: 10500000,
    wageBudget: 330000,
    primaryColor: "#1a85c8",
    secondaryColor: "#000000",
    players: [
      { name: "Kristijan Kahlina", position: "GK", rating: 76, age: 32, nationality: "Croatia" },
      { name: "Adilson Malanda", position: "CB", rating: 75, age: 22, nationality: "France" },
      { name: "Andrew Privett", position: "CB", rating: 73, age: 23, nationality: "United States" },
      { name: "Tim Ream", position: "CB", rating: 74, age: 36, nationality: "United States" },
      { name: "Nathan Byrne", position: "RB", rating: 73, age: 32, nationality: "England" },
      { name: "Ashley Westwood", position: "CDM", rating: 75, age: 34, nationality: "England" },
      { name: "Junior Urso", position: "CM", rating: 73, age: 35, nationality: "Brazil" },
      { name: "Pep Biel", position: "CAM", rating: 76, age: 27, nationality: "Spain" },
      { name: "Liel Abada", position: "RW", rating: 76, age: 22, nationality: "Israel" },
      { name: "Kerwin Vargas", position: "LW", rating: 74, age: 22, nationality: "Colombia" },
      { name: "Karol Swiderski", position: "ST", rating: 76, age: 27, nationality: "Poland" },
      { name: "Patrick Agyemang", position: "ST", rating: 73, age: 23, nationality: "United States" }
    ]
  },
  {
    id: "nashville_sc",
    name: "Nashville SC",
    shortName: "Nashville",
    leagueId: "mls",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/936302.png",
    stadium: "GEODIS Park",
    capacity: 30109,
    budget: 32000000,
    transferBudget: 10000000,
    wageBudget: 320000,
    primaryColor: "#ece81a",
    secondaryColor: "#1f1646",
    players: [
      { name: "Joe Willis", position: "GK", rating: 74, age: 35, nationality: "United States" },
      { name: "Walker Zimmerman", position: "CB", rating: 77, age: 31, nationality: "United States" },
      { name: "Jack Maher", position: "CB", rating: 73, age: 24, nationality: "United States" },
      { name: "Daniel Lovitz", position: "LB", rating: 73, age: 32, nationality: "United States" },
      { name: "Shaq Moore", position: "RB", rating: 74, age: 27, nationality: "United States" },
      { name: "Aníbal Godoy", position: "CDM", rating: 74, age: 34, nationality: "Panama" },
      { name: "Sean Davis", position: "CM", rating: 73, age: 31, nationality: "United States" },
      { name: "Hany Mukhtar", position: "CAM", rating: 79, age: 29, nationality: "Germany" },
      { name: "Jacob Shaffelburg", position: "LW", rating: 75, age: 24, nationality: "Canada" },
      { name: "Alex Muyl", position: "RW", rating: 72, age: 28, nationality: "United States" },
      { name: "Sam Surridge", position: "ST", rating: 76, age: 25, nationality: "England" },
      { name: "Teal Bunbury", position: "ST", rating: 71, age: 34, nationality: "United States" }
    ]
  },
  {
    id: "toronto_fc",
    name: "Toronto FC",
    shortName: "Toronto FC",
    leagueId: "mls",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/77803.png",
    stadium: "BMO Field",
    capacity: 28351,
    budget: 36000000,
    transferBudget: 12000000,
    wageBudget: 360000,
    primaryColor: "#da291c",
    secondaryColor: "#53565a",
    players: [
      { name: "Sean Johnson", position: "GK", rating: 74, age: 35, nationality: "United States" },
      { name: "Kevin Long", position: "CB", rating: 73, age: 33, nationality: "Republic of Ireland" },
      { name: "Sigurd Rosted", position: "CB", rating: 73, age: 30, nationality: "Norway" },
      { name: "Raoul Petretta", position: "LB", rating: 73, age: 27, nationality: "Italy" },
      { name: "Richie Laryea", position: "RB", rating: 74, age: 29, nationality: "Canada" },
      { name: "Alonso Coello", position: "CDM", rating: 73, age: 24, nationality: "Spain" },
      { name: "Jonathan Osorio", position: "CM", rating: 75, age: 32, nationality: "Canada" },
      { name: "Deybi Flores", position: "CM", rating: 73, age: 28, nationality: "Honduras" },
      { name: "Federico Bernardeschi", position: "RW", rating: 78, age: 30, nationality: "Italy" },
      { name: "Lorenzo Insigne", position: "LW", rating: 78, age: 33, nationality: "Italy" },
      { name: "Prince Osei Owusu", position: "ST", rating: 74, age: 27, nationality: "Germany" },
      { name: "Deandre Kerr", position: "ST", rating: 71, age: 21, nationality: "Canada" }
    ]
  },
  {
    id: "cf_montreal",
    name: "CF Montréal",
    shortName: "CF Montréal",
    leagueId: "mls",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/249629.png",
    stadium: "Stade Saputo",
    capacity: 19619,
    budget: 28000000,
    transferBudget: 8500000,
    wageBudget: 280000,
    primaryColor: "#0033a0",
    secondaryColor: "#000000",
    players: [
      { name: "Jonathan Sirois", position: "GK", rating: 74, age: 23, nationality: "Canada" },
      { name: "Joel Waterman", position: "CB", rating: 74, age: 28, nationality: "Canada" },
      { name: "George Campbell", position: "CB", rating: 72, age: 23, nationality: "United States" },
      { name: "Tom Pearce", position: "LB", rating: 72, age: 26, nationality: "England" },
      { name: "Jahkeele Marshall-Rutty", position: "RB", rating: 71, age: 20, nationality: "Canada" },
      { name: "Samuel Piette", position: "CDM", rating: 74, age: 29, nationality: "Canada" },
      { name: "Nathan Saliba", position: "CM", rating: 73, age: 20, nationality: "Canada" },
      { name: "Caden Clark", position: "CAM", rating: 74, age: 21, nationality: "United States" },
      { name: "Bryce Duke", position: "CAM", rating: 73, age: 23, nationality: "United States" },
      { name: "Kwadwo Opoku", position: "RW", rating: 74, age: 23, nationality: "Ghana" },
      { name: "Josef Martínez", position: "ST", rating: 76, age: 31, nationality: "Venezuela" },
      { name: "Matías Cóccaro", position: "ST", rating: 74, age: 26, nationality: "Uruguay" }
    ]
  },
  {
    id: "dc_united",
    name: "D.C. United",
    shortName: "DC United",
    leagueId: "mls",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/9998.png",
    stadium: "Audi Field",
    capacity: 20000,
    budget: 30000000,
    transferBudget: 9500000,
    wageBudget: 300000,
    primaryColor: "#000000",
    secondaryColor: "#da291c",
    players: [
      { name: "Alex Bono", position: "GK", rating: 73, age: 30, nationality: "United States" },
      { name: "Lucas Bartlett", position: "CB", rating: 73, age: 26, nationality: "United States" },
      { name: "Matti Peltola", position: "CB", rating: 74, age: 22, nationality: "Finland" },
      { name: "Pedro Santos", position: "LB", rating: 73, age: 36, nationality: "Portugal" },
      { name: "Aaron Herrera", position: "RB", rating: 75, age: 27, nationality: "Guatemala" },
      { name: "Mateusz Klich", position: "CM", rating: 75, age: 34, nationality: "Poland" },
      { name: "Russell Canouse", position: "CDM", rating: 73, age: 29, nationality: "United States" },
      { name: "Gabriel Pirani", position: "CAM", rating: 74, age: 22, nationality: "Brazil" },
      { name: "Martin Rodriguez", position: "LW", rating: 73, age: 30, nationality: "Chile" },
      { name: "Jacob Murrell", position: "RW", rating: 70, age: 20, nationality: "United States" },
      { name: "Christian Benteke", position: "ST", rating: 78, age: 33, nationality: "Belgium" },
      { name: "Dominique Badji", position: "ST", rating: 72, age: 31, nationality: "Senegal" }
    ]
  },
  {
    id: "chicago_fire",
    name: "Chicago Fire",
    shortName: "Chicago Fire",
    leagueId: "mls",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/9999.png",
    stadium: "Soldier Field",
    capacity: 24955,
    budget: 32000000,
    transferBudget: 10000000,
    wageBudget: 320000,
    primaryColor: "#da291c",
    secondaryColor: "#002b49",
    players: [
      { name: "Chris Brady", position: "GK", rating: 74, age: 20, nationality: "United States" },
      { name: "Rafael Czichos", position: "CB", rating: 74, age: 34, nationality: "Germany" },
      { name: "Carlos Terán", position: "CB", rating: 73, age: 23, nationality: "Colombia" },
      { name: "Andrew Gutman", position: "LB", rating: 73, age: 27, nationality: "United States" },
      { name: "Arnaud Souquet", position: "RB", rating: 73, age: 32, nationality: "France" },
      { name: "Kellyn Acosta", position: "CDM", rating: 75, age: 29, nationality: "United States" },
      { name: "Gastón Giménez", position: "CM", rating: 74, age: 32, nationality: "Paraguay" },
      { name: "Brian Gutiérrez", position: "CAM", rating: 74, age: 21, nationality: "United States" },
      { name: "Chris Mueller", position: "RW", rating: 73, age: 27, nationality: "United States" },
      { name: "Maren Haile-Selassie", position: "LW", rating: 74, age: 25, nationality: "Switzerland" },
      { name: "Hugo Cuypers", position: "ST", rating: 77, age: 27, nationality: "Belgium" },
      { name: "Georgios Koutsias", position: "ST", rating: 71, age: 20, nationality: "Greece" }
    ]
  },
  {
    id: "new_england",
    name: "New England Revolution",
    shortName: "New England",
    leagueId: "mls",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/9997.png",
    stadium: "Gillette Stadium",
    capacity: 20000,
    budget: 31000000,
    transferBudget: 9500000,
    wageBudget: 310000,
    primaryColor: "#002b49",
    secondaryColor: "#da291c",
    players: [
      { name: "Aljaz Ivacic", position: "GK", rating: 74, age: 30, nationality: "Slovenia" },
      { name: "Xavier Arreaga", position: "CB", rating: 74, age: 29, nationality: "Ecuador" },
      { name: "Dave Romney", position: "CB", rating: 73, age: 31, nationality: "United States" },
      { name: "Peyton Miller", position: "LB", rating: 71, age: 16, nationality: "United States" },
      { name: "Brandon Bye", position: "RB", rating: 74, age: 28, nationality: "United States" },
      { name: "Matt Polster", position: "CDM", rating: 74, age: 31, nationality: "United States" },
      { name: "Mark-Anthony Kaye", position: "CM", rating: 73, age: 29, nationality: "Canada" },
      { name: "Carles Gil", position: "CAM", rating: 80, age: 31, nationality: "Spain" },
      { name: "Dylan Borrero", position: "LW", rating: 74, age: 22, nationality: "Colombia" },
      { name: "Esmir Bajraktarevic", position: "RW", rating: 73, age: 19, nationality: "United States" },
      { name: "Giacomo Vrioni", position: "ST", rating: 75, age: 25, nationality: "Albania" },
      { name: "Bobby Wood", position: "ST", rating: 72, age: 31, nationality: "United States" }
    ]
  },
  {
    id: "austin_fc",
    name: "Austin FC",
    shortName: "Austin FC",
    leagueId: "mls",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/1169002.png",
    stadium: "Q2 Stadium",
    capacity: 20738,
    budget: 34000000,
    transferBudget: 11000000,
    wageBudget: 340000,
    primaryColor: "#00b140",
    secondaryColor: "#000000",
    players: [
      { name: "Brad Stuver", position: "GK", rating: 75, age: 33, nationality: "United States" },
      { name: "Julio Cascante", position: "CB", rating: 74, age: 30, nationality: "Costa Rica" },
      { name: "Brendan Hines-Ike", position: "CB", rating: 73, age: 29, nationality: "United States" },
      { name: "Guilherme Biro", position: "LB", rating: 73, age: 24, nationality: "Brazil" },
      { name: "Jon Gallagher", position: "RB", rating: 74, age: 28, nationality: "Republic of Ireland" },
      { name: "Alexander Ring", position: "CDM", rating: 75, age: 33, nationality: "Finland" },
      { name: "Daniel Pereira", position: "CM", rating: 74, age: 24, nationality: "Venezuela" },
      { name: "Sebastián Driussi", position: "CAM", rating: 78, age: 28, nationality: "Argentina" },
      { name: "Osman Bukari", position: "RW", rating: 76, age: 25, nationality: "Ghana" },
      { name: "Owen Wolff", position: "LW", rating: 72, age: 19, nationality: "United States" },
      { name: "Gyasi Zardes", position: "ST", rating: 73, age: 32, nationality: "United States" },
      { name: "Diego Rubio", position: "ST", rating: 74, age: 31, nationality: "Chile" }
    ]
  },
  {
    id: "houston_dynamo",
    name: "Houston Dynamo",
    shortName: "Houston",
    leagueId: "mls",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/77801.png",
    stadium: "Shell Energy Stadium",
    capacity: 22039,
    budget: 33000000,
    transferBudget: 10500000,
    wageBudget: 330000,
    primaryColor: "#ff5800",
    secondaryColor: "#000000",
    players: [
      { name: "Steve Clark", position: "GK", rating: 74, age: 38, nationality: "United States" },
      { name: "Erik Sviatchenko", position: "CB", rating: 75, age: 32, nationality: "Denmark" },
      { name: "Micael dos Santos", position: "CB", rating: 73, age: 24, nationality: "Brazil" },
      { name: "Franco Escobar", position: "LB", rating: 74, age: 29, nationality: "Argentina" },
      { name: "Griffin Dorsey", position: "RB", rating: 74, age: 25, nationality: "United States" },
      { name: "Artur", position: "CDM", rating: 76, age: 28, nationality: "Brazil" },
      { name: "Héctor Herrera", position: "CM", rating: 78, age: 34, nationality: "Mexico" },
      { name: "Adalberto Carrasquilla", position: "CAM", rating: 77, age: 25, nationality: "Panama" },
      { name: "Amine Bassi", position: "CAM", rating: 75, age: 26, nationality: "Morocco" },
      { name: "Ibrahim Aliyu", position: "LW", rating: 73, age: 22, nationality: "Nigeria" },
      { name: "Ezequiel Ponce", position: "ST", rating: 76, age: 27, nationality: "Argentina" },
      { name: "Sebastian Kowalczyk", position: "RW", rating: 74, age: 25, nationality: "Poland" }
    ]
  },
  {
    id: "fc_dallas",
    name: "FC Dallas",
    shortName: "FC Dallas",
    leagueId: "mls",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/9995.png",
    stadium: "Toyota Stadium",
    capacity: 20500,
    budget: 32000000,
    transferBudget: 10000000,
    wageBudget: 320000,
    primaryColor: "#da291c",
    secondaryColor: "#002b49",
    players: [
      { name: "Maarten Paes", position: "GK", rating: 76, age: 26, nationality: "Indonesia" },
      { name: "Nkosi Tafari", position: "CB", rating: 74, age: 27, nationality: "United States" },
      { name: "Sebastien Ibeagha", position: "CB", rating: 73, age: 32, nationality: "United States" },
      { name: "Marco Farfan", position: "LB", rating: 73, age: 25, nationality: "United States" },
      { name: "Ema Twumasi", position: "RB", rating: 72, age: 27, nationality: "Ghana" },
      { name: "Asier Illarramendi", position: "CDM", rating: 77, age: 34, nationality: "Spain" },
      { name: "Show", position: "CM", rating: 74, age: 25, nationality: "Angola" },
      { name: "Sebastian Lletget", position: "CM", rating: 74, age: 31, nationality: "United States" },
      { name: "Paul Arriola", position: "RW", rating: 75, age: 29, nationality: "United States" },
      { name: "Alan Velasco", position: "LW", rating: 76, age: 22, nationality: "Argentina" },
      { name: "Petar Musa", position: "ST", rating: 77, age: 26, nationality: "Croatia" },
      { name: "Jesús Ferreira", position: "CAM", rating: 76, age: 23, nationality: "United States" }
    ]
  },
  {
    id: "sporting_kc",
    name: "Sporting Kansas City",
    shortName: "Sporting KC",
    leagueId: "mls",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/9994.png",
    stadium: "Children's Mercy Park",
    capacity: 18467,
    budget: 31000000,
    transferBudget: 9500000,
    wageBudget: 310000,
    primaryColor: "#93b1d7",
    secondaryColor: "#002b49",
    players: [
      { name: "Tim Melia", position: "GK", rating: 73, age: 38, nationality: "United States" },
      { name: "Andreu Fontàs", position: "CB", rating: 73, age: 34, nationality: "Spain" },
      { name: "Robert Voloder", position: "CB", rating: 72, age: 23, nationality: "Germany" },
      { name: "Logan Ndenbe", position: "LB", rating: 73, age: 24, nationality: "Belgium" },
      { name: "Jake Davis", position: "RB", rating: 74, age: 22, nationality: "United States" },
      { name: "Nemanja Radoja", position: "CDM", rating: 75, age: 31, nationality: "Serbia" },
      { name: "Rémi Walter", position: "CM", rating: 74, age: 29, nationality: "France" },
      { name: "Erik Thommy", position: "CAM", rating: 76, age: 29, nationality: "Germany" },
      { name: "Dániel Sallói", position: "LW", rating: 75, age: 28, nationality: "Hungary" },
      { name: "Johnny Russell", position: "RW", rating: 75, age: 34, nationality: "Scotland" },
      { name: "Alan Pulido", position: "ST", rating: 76, age: 33, nationality: "Mexico" },
      { name: "William Agada", position: "ST", rating: 74, age: 24, nationality: "Nigeria" }
    ]
  },
  {
    id: "st_louis_city",
    name: "St. Louis CITY SC",
    shortName: "St. Louis CITY",
    leagueId: "mls",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/1321453.png",
    stadium: "CITYPARK",
    capacity: 22423,
    budget: 33000000,
    transferBudget: 10500000,
    wageBudget: 330000,
    primaryColor: "#da291c",
    secondaryColor: "#002b49",
    players: [
      { name: "Roman Bürki", position: "GK", rating: 79, age: 33, nationality: "Switzerland" },
      { name: "Joakim Nilsson", position: "CB", rating: 74, age: 30, nationality: "Sweden" },
      { name: "Timo Horn", position: "GK", rating: 74, age: 31, nationality: "Germany" },
      { name: "Jannes Horn", position: "LB", rating: 73, age: 27, nationality: "Germany" },
      { name: "Tomas Totland", position: "RB", rating: 74, age: 24, nationality: "Norway" },
      { name: "Chris Durkin", position: "CDM", rating: 74, age: 24, nationality: "United States" },
      { name: "Eduard Löwen", position: "CM", rating: 77, age: 27, nationality: "Germany" },
      { name: "Marcel Hartel", position: "CAM", rating: 77, age: 28, nationality: "Germany" },
      { name: "Indiana Vassilev", position: "RW", rating: 73, age: 23, nationality: "United States" },
      { name: "Célio Pompeu", position: "LW", rating: 73, age: 24, nationality: "Brazil" },
      { name: "João Klauss", position: "ST", rating: 76, age: 27, nationality: "Brazil" },
      { name: "Simon Becher", position: "ST", rating: 73, age: 25, nationality: "United States" }
    ]
  },
  {
    id: "minnesota_united",
    name: "Minnesota United",
    shortName: "Minnesota Utd",
    leagueId: "mls",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/773959.png",
    stadium: "Allianz Field",
    capacity: 19600,
    budget: 32000000,
    transferBudget: 10000000,
    wageBudget: 320000,
    primaryColor: "#89cff0",
    secondaryColor: "#000000",
    players: [
      { name: "Dayne St. Clair", position: "GK", rating: 75, age: 27, nationality: "Canada" },
      { name: "Michael Boxall", position: "CB", rating: 74, age: 35, nationality: "New Zealand" },
      { name: "Jefferson Díaz", position: "CB", rating: 73, age: 23, nationality: "Colombia" },
      { name: "Joseph Rosales", position: "LB", rating: 74, age: 23, nationality: "Honduras" },
      { name: "Carlos Harvey", position: "RB", rating: 72, age: 24, nationality: "Panama" },
      { name: "Wil Trapp", position: "CDM", rating: 73, age: 31, nationality: "United States" },
      { name: "Hassani Dotson", position: "CM", rating: 73, age: 27, nationality: "United States" },
      { name: "Joaquín Pereyra", position: "CAM", rating: 76, age: 25, nationality: "Argentina" },
      { name: "Robin Lod", position: "RW", rating: 77, age: 31, nationality: "Finland" },
      { name: "Bongokuhle Hlongwane", position: "LW", rating: 75, age: 24, nationality: "South Africa" },
      { name: "Kelvin Yeboah", position: "ST", rating: 76, age: 24, nationality: "Italy" },
      { name: "Teemu Pukki", position: "ST", rating: 75, age: 34, nationality: "Finland" }
    ]
  },
  {
    id: "colorado_rapids",
    name: "Colorado Rapids",
    shortName: "Colorado",
    leagueId: "mls",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/9992.png",
    stadium: "Dick's Sporting Goods Park",
    capacity: 18061,
    budget: 31000000,
    transferBudget: 9500000,
    wageBudget: 310000,
    primaryColor: "#800000",
    secondaryColor: "#89cff0",
    players: [
      { name: "Zack Steffen", position: "GK", rating: 76, age: 29, nationality: "United States" },
      { name: "Andreas Maxsø", position: "CB", rating: 75, age: 30, nationality: "Denmark" },
      { name: "Lalas Abubakar", position: "CB", rating: 73, age: 29, nationality: "Ghana" },
      { name: "Sam Vines", position: "LB", rating: 73, age: 25, nationality: "United States" },
      { name: "Keegan Rosenberry", position: "RB", rating: 74, age: 30, nationality: "United States" },
      { name: "Oliver Larraz", position: "CDM", rating: 73, age: 22, nationality: "United States" },
      { name: "Cole Bassett", position: "CM", rating: 75, age: 23, nationality: "United States" },
      { name: "Djordje Mihailovic", position: "CAM", rating: 77, age: 25, nationality: "United States" },
      { name: "Kévin Cabral", position: "LW", rating: 73, age: 25, nationality: "France" },
      { name: "Omir Fernandez", position: "RW", rating: 73, age: 25, nationality: "United States" },
      { name: "Rafael Navarro", position: "ST", rating: 76, age: 24, nationality: "Brazil" },
      { name: "Darren Yapi", position: "ST", rating: 70, age: 19, nationality: "United States" }
    ]
  },
  {
    id: "real_salt_lake",
    name: "Real Salt Lake",
    shortName: "Real Salt Lake",
    leagueId: "mls",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/77802.png",
    stadium: "America First Field",
    capacity: 20213,
    budget: 33000000,
    transferBudget: 10500000,
    wageBudget: 330000,
    primaryColor: "#da291c",
    secondaryColor: "#002b49",
    players: [
      { name: "Zac MacMath", position: "GK", rating: 74, age: 32, nationality: "United States" },
      { name: "Justen Glad", position: "CB", rating: 75, age: 27, nationality: "United States" },
      { name: "Brayan Vera", position: "CB", rating: 75, age: 25, nationality: "Colombia" },
      { name: "Alexandros Katranis", position: "LB", rating: 74, age: 26, nationality: "Greece" },
      { name: "Bode Hidalgo", position: "RB", rating: 72, age: 22, nationality: "United States" },
      { name: "Braian Ojeda", position: "CDM", rating: 75, age: 24, nationality: "Paraguay" },
      { name: "Nelson Palacio", position: "CM", rating: 73, age: 23, nationality: "Colombia" },
      { name: "Matt Crooks", position: "CAM", rating: 74, age: 30, nationality: "England" },
      { name: "Diego Luna", position: "CAM", rating: 76, age: 20, nationality: "United States" },
      { name: "Diogo Gonçalves", position: "LW", rating: 76, age: 27, nationality: "Portugal" },
      { name: "Cristian Arango", position: "ST", rating: 79, age: 29, nationality: "Colombia" },
      { name: "Anderson Julio", position: "RW", rating: 74, age: 28, nationality: "Ecuador" }
    ]
  },
  {
    id: "portland_timbers",
    name: "Portland Timbers",
    shortName: "Portland",
    leagueId: "mls",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/216022.png",
    stadium: "Providence Park",
    capacity: 25218,
    budget: 35000000,
    transferBudget: 11500000,
    wageBudget: 350000,
    primaryColor: "#004812",
    secondaryColor: "#ffd100",
    players: [
      { name: "Maxime Crépeau", position: "GK", rating: 76, age: 30, nationality: "Canada" },
      { name: "Dario Zuparic", position: "CB", rating: 75, age: 32, nationality: "Croatia" },
      { name: "Kamal Miller", position: "CB", rating: 74, age: 27, nationality: "Canada" },
      { name: "Claudio Bravo", position: "LB", rating: 74, age: 27, nationality: "Argentina" },
      { name: "Juan Mosquera", position: "RB", rating: 75, age: 21, nationality: "Colombia" },
      { name: "Diego Chara", position: "CDM", rating: 76, age: 38, nationality: "Colombia" },
      { name: "David Ayala", position: "CM", rating: 74, age: 22, nationality: "Argentina" },
      { name: "Evander", position: "CAM", rating: 80, age: 26, nationality: "Brazil" },
      { name: "Santiago Moreno", position: "RW", rating: 76, age: 24, nationality: "Colombia" },
      { name: "Antony", position: "LW", rating: 75, age: 22, nationality: "Brazil" },
      { name: "Jonathan Rodríguez", position: "ST", rating: 78, age: 31, nationality: "Uruguay" },
      { name: "Felipe Mora", position: "ST", rating: 76, age: 31, nationality: "Chile" }
    ]
  },
  {
    id: "san_jose_earthquakes",
    name: "San Jose Earthquakes",
    shortName: "San Jose",
    leagueId: "mls",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/9991.png",
    stadium: "PayPal Park",
    capacity: 18000,
    budget: 30000000,
    transferBudget: 9000000,
    wageBudget: 300000,
    primaryColor: "#003da5",
    secondaryColor: "#000000",
    players: [
      { name: "Daniel de Sousa", position: "GK", rating: 75, age: 30, nationality: "Brazil" },
      { name: "Rodrigues", position: "CB", rating: 75, age: 26, nationality: "Brazil" },
      { name: "Bruno Wilson", position: "CB", rating: 73, age: 27, nationality: "Portugal" },
      { name: "Vitor Costa", position: "LB", rating: 73, age: 30, nationality: "Brazil" },
      { name: "Carlos Akapo", position: "RB", rating: 74, age: 31, nationality: "Equatorial Guinea" },
      { name: "Carlos Gruezo", position: "CDM", rating: 75, age: 29, nationality: "Ecuador" },
      { name: "Jackson Yueill", position: "CM", rating: 74, age: 27, nationality: "United States" },
      { name: "Hernán López", position: "CAM", rating: 76, age: 23, nationality: "Argentina" },
      { name: "Cristian Espinoza", position: "RW", rating: 78, age: 29, nationality: "Argentina" },
      { name: "Amahl Pellegrino", position: "LW", rating: 76, age: 34, nationality: "Norway" },
      { name: "Jeremy Ebobisse", position: "ST", rating: 75, age: 27, nationality: "United States" },
      { name: "Preston Judd", position: "ST", rating: 71, age: 25, nationality: "United States" }
    ]
  },
  {
    id: "vancouver_whitecaps",
    name: "Vancouver Whitecaps",
    shortName: "Vancouver",
    leagueId: "mls",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/216023.png",
    stadium: "BC Place",
    capacity: 22120,
    budget: 33000000,
    transferBudget: 10500000,
    wageBudget: 330000,
    primaryColor: "#002b49",
    secondaryColor: "#ffffff",
    players: [
      { name: "Yohei Takaoka", position: "GK", rating: 75, age: 28, nationality: "Japan" },
      { name: "Ranko Veselinovic", position: "CB", rating: 75, age: 25, nationality: "Serbia" },
      { name: "Tristan Blackmon", position: "CB", rating: 74, age: 28, nationality: "United States" },
      { name: "Mathías Laborda", position: "CB", rating: 73, age: 24, nationality: "Uruguay" },
      { name: "Sam Adekugbe", position: "LB", rating: 74, age: 29, nationality: "Canada" },
      { name: "Andrés Cubas", position: "CDM", rating: 76, age: 28, nationality: "Paraguay" },
      { name: "Sebastian Berhalter", position: "CM", rating: 74, age: 23, nationality: "United States" },
      { name: "Pedro Vite", position: "CAM", rating: 75, age: 22, nationality: "Ecuador" },
      { name: "Ryan Gauld", position: "CAM", rating: 79, age: 28, nationality: "Scotland" },
      { name: "Fafà Picault", position: "LW", rating: 74, age: 33, nationality: "Haiti" },
      { name: "Brian White", position: "ST", rating: 76, age: 28, nationality: "United States" },
      { name: "Stuart Armstrong", position: "CM", rating: 75, age: 32, nationality: "Scotland" }
    ]
  }
];

async function run() {
  console.log("Starting Batch 5B injection (MLS complete)...");
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
