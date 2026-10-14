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
  // --- SAUDI PRO LEAGUE (12 remaining to make 18 total) ---
  {
    id: "al_shabab",
    name: "Al-Shabab FC",
    shortName: "Al-Shabab",
    leagueId: "saudi",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/9758.png",
    stadium: "Al-Shabab Club Stadium",
    capacity: 15000,
    budget: 65000000,
    transferBudget: 28000000,
    wageBudget: 750000,
    primaryColor: "#000000",
    secondaryColor: "#ffffff",
    players: [
      { name: "Kim Seung-gyu", position: "GK", rating: 77, age: 33, nationality: "South Korea" },
      { name: "Robert Renan", position: "CB", rating: 76, age: 20, nationality: "Brazil" },
      { name: "Wesley Hoedt", position: "CB", rating: 76, age: 30, nationality: "Netherlands" },
      { name: "Mohammed Al-Thani", position: "RB", rating: 72, age: 27, nationality: "Saudi Arabia" },
      { name: "Hussain Al-Sibyani", position: "LB", rating: 71, age: 23, nationality: "Saudi Arabia" },
      { name: "Giacomo Bonaventura", position: "CM", rating: 80, age: 34, nationality: "Italy" },
      { name: "Gustavo Cuéllar", position: "CDM", rating: 77, age: 31, nationality: "Colombia" },
      { name: "Musab Al-Juwayr", position: "CM", rating: 74, age: 21, nationality: "Saudi Arabia" },
      { name: "Daniel Podence", position: "RW", rating: 78, age: 28, nationality: "Portugal" },
      { name: "Yannick Carrasco", position: "LW", rating: 82, age: 30, nationality: "Belgium" },
      { name: "Abderrazak Hamdallah", position: "ST", rating: 79, age: 33, nationality: "Morocco" },
      { name: "Haroune Camara", position: "ST", rating: 72, age: 26, nationality: "Saudi Arabia" }
    ]
  },
  {
    id: "al_taawoun",
    name: "Al-Taawoun FC",
    shortName: "Al-Taawoun",
    leagueId: "saudi",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/203496.png",
    stadium: "King Abdullah Sport City Stadium (Buraidah)",
    capacity: 25000,
    budget: 35000000,
    transferBudget: 12000000,
    wageBudget: 350000,
    primaryColor: "#ffd100",
    secondaryColor: "#0033a0",
    players: [
      { name: "Mailson", position: "GK", rating: 77, age: 28, nationality: "Brazil" },
      { name: "Andrei Girotto", position: "CB", rating: 77, age: 32, nationality: "Brazil" },
      { name: "Awn Al-Saluli", position: "CB", rating: 72, age: 25, nationality: "Saudi Arabia" },
      { name: "Saad Al-Nasser", position: "LB", rating: 72, age: 23, nationality: "Saudi Arabia" },
      { name: "Fahad Al-Jumayah", position: "RB", rating: 71, age: 29, nationality: "Saudi Arabia" },
      { name: "Aschraf El Mahdioui", position: "CDM", rating: 76, age: 28, nationality: "Netherlands" },
      { name: "Fayçal Fajr", position: "CM", rating: 76, age: 35, nationality: "Morocco" },
      { name: "Flávio Medeiros", position: "CM", rating: 75, age: 28, nationality: "Brazil" },
      { name: "Mohammed Al-Kuwaykibi", position: "RW", rating: 73, age: 29, nationality: "Saudi Arabia" },
      { name: "Musa Barrow", position: "LW", rating: 78, age: 25, nationality: "Gambia" },
      { name: "João Pedro Pereira", position: "ST", rating: 76, age: 31, nationality: "Brazil" },
      { name: "Abdulfattah Adam", position: "ST", rating: 72, age: 29, nationality: "Saudi Arabia" }
    ]
  },
  {
    id: "al_fateh",
    name: "Al-Fateh SC",
    shortName: "Al-Fateh",
    leagueId: "saudi",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/203497.png",
    stadium: "Al-Fateh Club Stadium",
    capacity: 11000,
    budget: 32000000,
    transferBudget: 10500000,
    wageBudget: 320000,
    primaryColor: "#0033a0",
    secondaryColor: "#009640",
    players: [
      { name: "Péter Szappanos", position: "GK", rating: 74, age: 33, nationality: "Hungary" },
      { name: "Marwane Saâdane", position: "CB", rating: 75, age: 32, nationality: "Morocco" },
      { name: "Ammar Al-Daheem", position: "CB", rating: 71, age: 30, nationality: "Saudi Arabia" },
      { name: "Saeed Baattia", position: "RB", rating: 70, age: 24, nationality: "Saudi Arabia" },
      { name: "Tawfiq Buhimed", position: "LB", rating: 70, age: 36, nationality: "Saudi Arabia" },
      { name: "Sofiane Bendebka", position: "CM", rating: 76, age: 32, nationality: "Algeria" },
      { name: "Mukhtar Ali", position: "CM", rating: 73, age: 26, nationality: "Saudi Arabia" },
      { name: "Lucas Zelarayán", position: "CAM", rating: 79, age: 32, nationality: "Armenia" },
      { name: "Mourad Batna", position: "RW", rating: 77, age: 34, nationality: "Morocco" },
      { name: "Amine Sbaï", position: "LW", rating: 73, age: 23, nationality: "Morocco" },
      { name: "Djaniny", position: "ST", rating: 76, age: 33, nationality: "Cape Verde" },
      { name: "Othman Al-Othman", position: "ST", rating: 69, age: 21, nationality: "Saudi Arabia" }
    ]
  },
  {
    id: "al_fayha",
    name: "Al-Fayha FC",
    shortName: "Al-Fayha",
    leagueId: "saudi",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/599424.png",
    stadium: "Al Majma'ah Sports City",
    capacity: 7000,
    budget: 30000000,
    transferBudget: 9500000,
    wageBudget: 300000,
    primaryColor: "#ff6600",
    secondaryColor: "#0033a0",
    players: [
      { name: "Orlando Mosquera", position: "GK", rating: 73, age: 29, nationality: "Panama" },
      { name: "Chris Smalling", position: "CB", rating: 79, age: 34, nationality: "England" },
      { name: "Sami Al-Khaibari", position: "CB", rating: 71, age: 34, nationality: "Saudi Arabia" },
      { name: "Mohammed Al-Baqawi", position: "RB", rating: 72, age: 26, nationality: "Saudi Arabia" },
      { name: "Faritz Al-Dawsari", position: "LB", rating: 70, age: 23, nationality: "Saudi Arabia" },
      { name: "Gojko Cimirot", position: "CDM", rating: 75, age: 31, nationality: "Bosnia and Herzegovina" },
      { name: "Otabek Shukurov", position: "CM", rating: 75, age: 28, nationality: "Uzbekistan" },
      { name: "Alejandro Pozuelo", position: "CAM", rating: 77, age: 32, nationality: "Spain" },
      { name: "Henry Onyekuru", position: "RW", rating: 76, age: 27, nationality: "Nigeria" },
      { name: "Fashion Sakala", position: "LW", rating: 77, age: 27, nationality: "Zambia" },
      { name: "Renzo López", position: "ST", rating: 74, age: 30, nationality: "Uruguay" },
      { name: "Malek Al-Abdulmenem", position: "ST", rating: 70, age: 26, nationality: "Saudi Arabia" }
    ]
  },
  {
    id: "al_khaleej",
    name: "Al-Khaleej FC",
    shortName: "Al-Khaleej",
    leagueId: "saudi",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/203498.png",
    stadium: "Prince Mohamed bin Fahd Stadium",
    capacity: 35000,
    budget: 28000000,
    transferBudget: 8500000,
    wageBudget: 280000,
    primaryColor: "#009640",
    secondaryColor: "#ffd100",
    players: [
      { name: "Ibrahim Sehic", position: "GK", rating: 75, age: 35, nationality: "Bosnia and Herzegovina" },
      { name: "Marcel Tisserand", position: "CB", rating: 75, age: 31, nationality: "DR Congo" },
      { name: "Mohammed Al-Khabrani", position: "CB", rating: 71, age: 30, nationality: "Saudi Arabia" },
      { name: "Pedro Rebocho", position: "LB", rating: 75, age: 29, nationality: "Portugal" },
      { name: "Saeed Al-Hamsal", position: "RB", rating: 71, age: 28, nationality: "Saudi Arabia" },
      { name: "Dimitrios Kourbelis", position: "CDM", rating: 75, age: 30, nationality: "Greece" },
      { name: "Mansour Hamzi", position: "CM", rating: 71, age: 32, nationality: "Saudi Arabia" },
      { name: "Kostas Fortounis", position: "CAM", rating: 78, age: 31, nationality: "Greece" },
      { name: "Khaled Narey", position: "RW", rating: 76, age: 30, nationality: "Togo" },
      { name: "Fábio Martins", position: "LW", rating: 77, age: 31, nationality: "Portugal" },
      { name: "Mohamed Sherif", position: "ST", rating: 75, age: 28, nationality: "Egypt" },
      { name: "Abdullah Al-Salem", position: "ST", rating: 71, age: 31, nationality: "Saudi Arabia" }
    ]
  },
  {
    id: "al_raed",
    name: "Al-Raed FC",
    shortName: "Al-Raed",
    leagueId: "saudi",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/203499.png",
    stadium: "King Abdullah Sport City Stadium (Buraidah)",
    capacity: 25000,
    budget: 27000000,
    transferBudget: 8000000,
    wageBudget: 270000,
    primaryColor: "#da291c",
    secondaryColor: "#000000",
    players: [
      { name: "André Moreira", position: "GK", rating: 74, age: 28, nationality: "Portugal" },
      { name: "Oumar Gonzalez", position: "CB", rating: 75, age: 26, nationality: "Cameroon" },
      { name: "Mubarak Al-Rajeh", position: "CB", rating: 70, age: 23, nationality: "Saudi Arabia" },
      { name: "Hamad Al-Jayzani", position: "RB", rating: 71, age: 31, nationality: "Saudi Arabia" },
      { name: "Abdullah Al-Yousef", position: "LB", rating: 70, age: 26, nationality: "Saudi Arabia" },
      { name: "Mathias Normann", position: "CDM", rating: 76, age: 28, nationality: "Norway" },
      { name: "Mehdi Abeid", position: "CM", rating: 75, age: 32, nationality: "Algeria" },
      { name: "Amir Sayoud", position: "CAM", rating: 77, age: 33, nationality: "Algeria" },
      { name: "Mohamed Fouzair", position: "RW", rating: 76, age: 32, nationality: "Morocco" },
      { name: "Yahya Sunbul", position: "LW", rating: 70, age: 26, nationality: "Saudi Arabia" },
      { name: "Karim El Berkaoui", position: "ST", rating: 76, age: 28, nationality: "Morocco" },
      { name: "Raed Al-Ghamdi", position: "ST", rating: 71, age: 30, nationality: "Saudi Arabia" }
    ]
  },
  {
    id: "damac",
    name: "Damac FC",
    shortName: "Damac",
    leagueId: "saudi",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/810903.png",
    stadium: "Damac Club Stadium",
    capacity: 5000,
    budget: 29000000,
    transferBudget: 8800000,
    wageBudget: 290000,
    primaryColor: "#da291c",
    secondaryColor: "#ffd100",
    players: [
      { name: "Florin Niță", position: "GK", rating: 75, age: 37, nationality: "Romania" },
      { name: "Abdelkader Bedrane", position: "CB", rating: 75, age: 32, nationality: "Algeria" },
      { name: "Farouk Chafaï", position: "CB", rating: 74, age: 34, nationality: "Algeria" },
      { name: "Sanousi Hawsawi", position: "RB", rating: 71, age: 26, nationality: "Saudi Arabia" },
      { name: "Dhari Al-Anazi", position: "LB", rating: 70, age: 24, nationality: "Saudi Arabia" },
      { name: "Tarek Hamed", position: "CDM", rating: 76, age: 35, nationality: "Egypt" },
      { name: "Nicolae Stanciu", position: "CAM", rating: 78, age: 31, nationality: "Romania" },
      { name: "François Kamano", position: "RW", rating: 75, age: 28, nationality: "Guinea" },
      { name: "Georges-Kévin Nkoudou", position: "LW", rating: 79, age: 29, nationality: "Cameroon" },
      { name: "Habib Diallo", position: "ST", rating: 77, age: 29, nationality: "Senegal" },
      { name: "Meshari Al-Nemer", position: "ST", rating: 70, age: 21, nationality: "Saudi Arabia" },
      { name: "Ayman Fallatah", position: "CM", rating: 69, age: 21, nationality: "Saudi Arabia" }
    ]
  },
  {
    id: "al_okhdood",
    name: "Al-Okhdood Club",
    shortName: "Al-Okhdood",
    leagueId: "saudi",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/1110023.png",
    stadium: "Prince Hathloul bin Abdul Aziz Sports City",
    capacity: 12000,
    budget: 25000000,
    transferBudget: 7500000,
    wageBudget: 250000,
    primaryColor: "#0033a0",
    secondaryColor: "#009640",
    players: [
      { name: "Samuel Portillo", position: "GK", rating: 72, age: 29, nationality: "Brazil" },
      { name: "Dino Arslanagic", position: "CB", rating: 73, age: 31, nationality: "Belgium" },
      { name: "Saeed Al-Rubaie", position: "CB", rating: 71, age: 30, nationality: "Saudi Arabia" },
      { name: "Hussain Al-Zabdani", position: "RB", rating: 70, age: 28, nationality: "Saudi Arabia" },
      { name: "Naif Asiri", position: "LB", rating: 69, age: 23, nationality: "Saudi Arabia" },
      { name: "Petros", position: "CDM", rating: 75, age: 35, nationality: "Brazil" },
      { name: "Juan Sebastián Pedroza", position: "CM", rating: 73, age: 25, nationality: "Colombia" },
      { name: "Knowledge Musona", position: "CAM", rating: 74, age: 34, nationality: "Zimbabwe" },
      { name: "Christian Bassogog", position: "RW", rating: 75, age: 28, nationality: "Cameroon" },
      { name: "Savior Godwin", position: "LW", rating: 74, age: 27, nationality: "Nigeria" },
      { name: "Ibrahima Koné", position: "ST", rating: 75, age: 25, nationality: "Mali" },
      { name: "Saleh Al-Harthi", position: "ST", rating: 69, age: 24, nationality: "Saudi Arabia" }
    ]
  },
  {
    id: "al_wehda",
    name: "Al-Wehda FC",
    shortName: "Al-Wehda",
    leagueId: "saudi",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/203503.png",
    stadium: "King Abdulaziz Sports City (Mecca)",
    capacity: 38000,
    budget: 30000000,
    transferBudget: 9000000,
    wageBudget: 300000,
    primaryColor: "#da291c",
    secondaryColor: "#ffffff",
    players: [
      { name: "Ignacio de Arruabarrena", position: "GK", rating: 75, age: 27, nationality: "Uruguay" },
      { name: "Jawad El Yamiq", position: "CB", rating: 76, age: 32, nationality: "Morocco" },
      { name: "Ali Makki", position: "CB", rating: 70, age: 25, nationality: "Saudi Arabia" },
      { name: "Saeed Al-Mowalad", position: "RB", rating: 71, age: 33, nationality: "Saudi Arabia" },
      { name: "Islam Hawsawi", position: "LB", rating: 71, age: 22, nationality: "Saudi Arabia" },
      { name: "Alexandru Cretu", position: "CDM", rating: 74, age: 32, nationality: "Romania" },
      { name: "Juninho Bacuna", position: "CM", rating: 76, age: 27, nationality: "Curaçao" },
      { name: "Alaa Al-Hejji", position: "CM", rating: 71, age: 28, nationality: "Saudi Arabia" },
      { name: "Craig Goodwin", position: "LW", rating: 77, age: 32, nationality: "Australia" },
      { name: "Youssef Amyn", position: "RW", rating: 72, age: 20, nationality: "Iraq" },
      { name: "Odion Ighalo", position: "ST", rating: 78, age: 35, nationality: "Nigeria" },
      { name: "Yahya Naji", position: "ST", rating: 69, age: 25, nationality: "Saudi Arabia" }
    ]
  },
  {
    id: "al_riyadh",
    name: "Al-Riyadh SC",
    shortName: "Al-Riyadh",
    leagueId: "saudi",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/203501.png",
    stadium: "Prince Turki bin Abdul Aziz Stadium",
    capacity: 15000,
    budget: 28000000,
    transferBudget: 8500000,
    wageBudget: 280000,
    primaryColor: "#da291c",
    secondaryColor: "#000000",
    players: [
      { name: "Milan Borjan", position: "GK", rating: 75, age: 36, nationality: "Canada" },
      { name: "Yoann Barbet", position: "CB", rating: 75, age: 31, nationality: "France" },
      { name: "Ahmad Asiri", position: "CB", rating: 71, age: 32, nationality: "Saudi Arabia" },
      { name: "Hussain Al-Nowaiqi", position: "RB", rating: 70, age: 28, nationality: "Saudi Arabia" },
      { name: "Abdulelah Al-Khaibari", position: "LB", rating: 70, age: 27, nationality: "Saudi Arabia" },
      { name: "Lucas Kal", position: "CDM", rating: 74, age: 28, nationality: "Brazil" },
      { name: "Tozé", position: "CM", rating: 76, age: 31, nationality: "Portugal" },
      { name: "Bernard Mensah", position: "CAM", rating: 78, age: 29, nationality: "Ghana" },
      { name: "Faïz Selemani", position: "LW", rating: 75, age: 30, nationality: "Comoros" },
      { name: "Ibrahim Bayesh", position: "RW", rating: 74, age: 24, nationality: "Iraq" },
      { name: "Mohamed Konaté", position: "ST", rating: 76, age: 26, nationality: "Burkina Faso" },
      { name: "Rayan Al-Bloushi", position: "ST", rating: 68, age: 23, nationality: "Saudi Arabia" }
    ]
  },
  {
    id: "al_kholood",
    name: "Al-Kholood Club",
    shortName: "Al-Kholood",
    leagueId: "saudi",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/810902.png",
    stadium: "Al-Hazem Club Stadium",
    capacity: 8000,
    budget: 26000000,
    transferBudget: 8000000,
    wageBudget: 260000,
    primaryColor: "#da291c",
    secondaryColor: "#ffffff",
    players: [
      { name: "Marcelo Grohe", position: "GK", rating: 78, age: 37, nationality: "Brazil" },
      { name: "William Troost-Ekong", position: "CB", rating: 77, age: 30, nationality: "Nigeria" },
      { name: "Norbert Gyömbér", position: "CB", rating: 74, age: 32, nationality: "Slovakia" },
      { name: "Hamdan Al-Shamrani", position: "LB", rating: 72, age: 27, nationality: "Saudi Arabia" },
      { name: "Sultan Al-Shehri", position: "RB", rating: 70, age: 28, nationality: "Saudi Arabia" },
      { name: "Kevin N'Doram", position: "CDM", rating: 75, age: 28, nationality: "France" },
      { name: "Aliou Dieng", position: "CM", rating: 76, age: 26, nationality: "Mali" },
      { name: "Álex Collado", position: "CAM", rating: 77, age: 25, nationality: "Spain" },
      { name: "Myziane Maolida", position: "LW", rating: 75, age: 25, nationality: "Comoros" },
      { name: "Hammam Al-Hammami", position: "RW", rating: 70, age: 21, nationality: "Saudi Arabia" },
      { name: "Jackson Muleka", position: "ST", rating: 76, age: 24, nationality: "DR Congo" },
      { name: "Bassem Al-Arini", position: "ST", rating: 68, age: 21, nationality: "Saudi Arabia" }
    ]
  },
  {
    id: "al_orobah",
    name: "Al-Orobah FC",
    shortName: "Al-Orobah",
    leagueId: "saudi",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/307406.png",
    stadium: "Al-Orobah Club Stadium",
    capacity: 7000,
    budget: 26000000,
    transferBudget: 8000000,
    wageBudget: 260000,
    primaryColor: "#ffd100",
    secondaryColor: "#008751",
    players: [
      { name: "Gaëtan Coucke", position: "GK", rating: 74, age: 25, nationality: "Belgium" },
      { name: "Kurt Zouma", position: "CB", rating: 78, age: 29, nationality: "France" },
      { name: "Hussein Al-Shuwaish", position: "CB", rating: 71, age: 34, nationality: "Saudi Arabia" },
      { name: "Ibrahim Al-Zubaidi", position: "LB", rating: 70, age: 35, nationality: "Saudi Arabia" },
      { name: "Hamed Al-Maghati", position: "RB", rating: 70, age: 31, nationality: "Saudi Arabia" },
      { name: "Jean Michaël Seri", position: "CM", rating: 77, age: 33, nationality: "Ivory Coast" },
      { name: "Karlo Muhar", position: "CDM", rating: 74, age: 28, nationality: "Croatia" },
      { name: "Jóhann Berg Gudmundsson", position: "CAM", rating: 75, age: 33, nationality: "Iceland" },
      { name: "Cristian Tello", position: "LW", rating: 76, age: 32, nationality: "Spain" },
      { name: "Fahad Al-Zubaidi", position: "RW", rating: 69, age: 22, nationality: "Saudi Arabia" },
      { name: "Emmanuel Boateng", position: "ST", rating: 74, age: 28, nationality: "Ghana" },
      { name: "Brad Young", position: "ST", rating: 70, age: 21, nationality: "England" }
    ]
  },

  // --- TURKISH SÜPER LIG (13 remaining to make 19 total) ---
  {
    id: "samsunspor",
    name: "Samsunspor",
    shortName: "Samsunspor",
    leagueId: "superlig",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/10184.png",
    stadium: "Samsun 19 Mayıs Stadium",
    capacity: 33919,
    budget: 22000000,
    transferBudget: 7000000,
    wageBudget: 220000,
    primaryColor: "#da291c",
    secondaryColor: "#ffffff",
    players: [
      { name: "Okan Kocuk", position: "GK", rating: 73, age: 29, nationality: "Turkey" },
      { name: "Rick van Drongelen", position: "CB", rating: 74, age: 25, nationality: "Netherlands" },
      { name: "Lubomir Satka", position: "CB", rating: 74, age: 28, nationality: "Slovakia" },
      { name: "Marc Bola", position: "LB", rating: 72, age: 26, nationality: "England" },
      { name: "Zeki Yavru", position: "RB", rating: 72, age: 32, nationality: "Turkey" },
      { name: "Youssef Aït Bennasser", position: "CDM", rating: 74, age: 28, nationality: "Morocco" },
      { name: "Olivier Ntcham", position: "CM", rating: 76, age: 28, nationality: "Cameroon" },
      { name: "Carlo Holse", position: "CAM", rating: 75, age: 25, nationality: "Denmark" },
      { name: "Emre Kılınç", position: "RW", rating: 74, age: 29, nationality: "Turkey" },
      { name: "Arbnor Muja", position: "LW", rating: 73, age: 25, nationality: "Albania" },
      { name: "Marius Mouandilmadji", position: "ST", rating: 74, age: 26, nationality: "Chad" },
      { name: "Landry Dimata", position: "ST", rating: 73, age: 26, nationality: "Belgium" }
    ]
  },
  {
    id: "sivasspor",
    name: "Sivasspor",
    shortName: "Sivasspor",
    leagueId: "superlig",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/10181.png",
    stadium: "New Sivas 4 Eylül Stadium",
    capacity: 27532,
    budget: 18000000,
    transferBudget: 5500000,
    wageBudget: 180000,
    primaryColor: "#da291c",
    secondaryColor: "#ffffff",
    players: [
      { name: "Ali Vural", position: "GK", rating: 72, age: 34, nationality: "Turkey" },
      { name: "Uros Radakovic", position: "CB", rating: 73, age: 30, nationality: "Serbia" },
      { name: "Samba Camara", position: "CB", rating: 72, age: 31, nationality: "Mali" },
      { name: "Ugurtan Ocak", position: "LB", rating: 70, age: 25, nationality: "Turkey" },
      { name: "Murat Paluli", position: "RB", rating: 71, age: 30, nationality: "Turkey" },
      { name: "Charis Charisis", position: "CM", rating: 74, age: 29, nationality: "Greece" },
      { name: "Samuel Moutoussamy", position: "CM", rating: 75, age: 27, nationality: "DR Congo" },
      { name: "Alex Pritchard", position: "CAM", rating: 73, age: 31, nationality: "England" },
      { name: "Queensy Menig", position: "LW", rating: 73, age: 28, nationality: "Netherlands" },
      { name: "Garry Rodrigues", position: "RW", rating: 74, age: 33, nationality: "Cape Verde" },
      { name: "Rey Manaj", position: "ST", rating: 77, age: 27, nationality: "Albania" },
      { name: "Keita Baldé", position: "ST", rating: 74, age: 29, nationality: "Senegal" }
    ]
  },
  {
    id: "antalyaspor",
    name: "Antalyaspor",
    shortName: "Antalyaspor",
    leagueId: "superlig",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/9759.png",
    stadium: "Corendon Airlines Park",
    capacity: 32537,
    budget: 19000000,
    transferBudget: 5800000,
    wageBudget: 190000,
    primaryColor: "#da291c",
    secondaryColor: "#ffffff",
    players: [
      { name: "Kenan Piric", position: "GK", rating: 73, age: 30, nationality: "Bosnia and Herzegovina" },
      { name: "Thalisson Kelven", position: "CB", rating: 73, age: 26, nationality: "Brazil" },
      { name: "Veysel Sarı", position: "CB", rating: 72, age: 36, nationality: "Turkey" },
      { name: "Güray Vural", position: "LB", rating: 73, age: 36, nationality: "Turkey" },
      { name: "Mert Yılmaz", position: "RB", rating: 71, age: 25, nationality: "Turkey" },
      { name: "Erdal Rakip", position: "CDM", rating: 73, age: 28, nationality: "North Macedonia" },
      { name: "Soner Dikmen", position: "CM", rating: 72, age: 30, nationality: "Turkey" },
      { name: "Sander van de Streek", position: "CAM", rating: 74, age: 31, nationality: "Netherlands" },
      { name: "Sam Larsson", position: "LW", rating: 75, age: 31, nationality: "Sweden" },
      { name: "Moussa Djenepo", position: "RW", rating: 74, age: 26, nationality: "Mali" },
      { name: "Adolfo Gaich", position: "ST", rating: 74, age: 25, nationality: "Argentina" },
      { name: "Braian Samudio", position: "ST", rating: 73, age: 28, nationality: "Paraguay" }
    ]
  },
  {
    id: "kasimpasa",
    name: "Kasımpaşa SK",
    shortName: "Kasımpaşa",
    leagueId: "superlig",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/9773.png",
    stadium: "Recep Tayyip Erdoğan Stadium",
    capacity: 14234,
    budget: 18000000,
    transferBudget: 5500000,
    wageBudget: 180000,
    primaryColor: "#002b49",
    secondaryColor: "#ffffff",
    players: [
      { name: "Andreas Gianniotis", position: "GK", rating: 73, age: 31, nationality: "Greece" },
      { name: "Nicholas Opoku", position: "CB", rating: 73, age: 26, nationality: "Ghana" },
      { name: "Sadık Çiftpınar", position: "CB", rating: 72, age: 31, nationality: "Turkey" },
      { name: "Yasin Özcan", position: "LB", rating: 73, age: 18, nationality: "Turkey" },
      { name: "Claudio Winck", position: "RB", rating: 74, age: 30, nationality: "Brazil" },
      { name: "Gökhan Gül", position: "CDM", rating: 72, age: 26, nationality: "Germany" },
      { name: "Aytaç Kara", position: "CM", rating: 75, age: 31, nationality: "Turkey" },
      { name: "Haris Hajradinovic", position: "CAM", rating: 77, age: 30, nationality: "Bosnia and Herzegovina" },
      { name: "Mamadou Fall", position: "RW", rating: 74, age: 32, nationality: "Senegal" },
      { name: "Mortadha Ben Ouanes", position: "LW", rating: 74, age: 30, nationality: "Tunisia" },
      { name: "Nuno da Costa", position: "ST", rating: 75, age: 33, nationality: "Cape Verde" },
      { name: "Josip Brekalo", position: "LW", rating: 75, age: 26, nationality: "Croatia" }
    ]
  },
  {
    id: "rizespor",
    name: "Çaykur Rizespor",
    shortName: "Rizespor",
    leagueId: "superlig",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/9764.png",
    stadium: "Çaykur Didi Stadium",
    capacity: 15558,
    budget: 17000000,
    transferBudget: 5000000,
    wageBudget: 170000,
    primaryColor: "#008751",
    secondaryColor: "#0033a0",
    players: [
      { name: "Gökhan Akkan", position: "GK", rating: 73, age: 29, nationality: "Turkey" },
      { name: "Khusniddin Alikulov", position: "CB", rating: 74, age: 25, nationality: "Uzbekistan" },
      { name: "Attila Mocsi", position: "CB", rating: 73, age: 24, nationality: "Hungary" },
      { name: "Casper Højer", position: "LB", rating: 73, age: 29, nationality: "Denmark" },
      { name: "Muhammet Taha Sahin", position: "RB", rating: 72, age: 23, nationality: "Turkey" },
      { name: "Ibrahim Olawoyin", position: "CM", rating: 74, age: 26, nationality: "Nigeria" },
      { name: "Amir Hadziahmetovic", position: "CDM", rating: 75, age: 27, nationality: "Bosnia and Herzegovina" },
      { name: "Dal Varesanovic", position: "CAM", rating: 74, age: 23, nationality: "Bosnia and Herzegovina" },
      { name: "Altin Zeqiri", position: "LW", rating: 73, age: 24, nationality: "Kosovo" },
      { name: "David Akintola", position: "RW", rating: 73, age: 28, nationality: "Nigeria" },
      { name: "Ali Sowe", position: "ST", rating: 75, age: 30, nationality: "Gambia" },
      { name: "Martin Minchev", position: "ST", rating: 72, age: 23, nationality: "Bulgaria" }
    ]
  },
  {
    id: "alanyaspor",
    name: "Alanyaspor",
    shortName: "Alanyaspor",
    leagueId: "superlig",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/371987.png",
    stadium: "Gain Park Stadium",
    capacity: 10128,
    budget: 18000000,
    transferBudget: 5400000,
    wageBudget: 180000,
    primaryColor: "#ff6600",
    secondaryColor: "#008751",
    players: [
      { name: "Ertugrul Taskiran", position: "GK", rating: 72, age: 34, nationality: "Turkey" },
      { name: "Fidan Aliti", position: "CB", rating: 74, age: 30, nationality: "Kosovo" },
      { name: "Nuno Lima", position: "CB", rating: 72, age: 23, nationality: "Portugal" },
      { name: "Jure Balkovec", position: "LB", rating: 73, age: 29, nationality: "Slovenia" },
      { name: "Florent Hadergjonaj", position: "RB", rating: 74, age: 30, nationality: "Kosovo" },
      { name: "Richard Coelho", position: "CDM", rating: 74, age: 30, nationality: "Brazil" },
      { name: "Gaius Makouta", position: "CM", rating: 73, age: 27, nationality: "Congo" },
      { name: "Efecan Karaca", position: "RW", rating: 75, age: 34, nationality: "Turkey" },
      { name: "Nicolas Janvier", position: "CAM", rating: 73, age: 26, nationality: "France" },
      { name: "Rony Lopes", position: "LW", rating: 75, age: 28, nationality: "Portugal" },
      { name: "Sergio Córdova", position: "ST", rating: 74, age: 27, nationality: "Venezuela" },
      { name: "Hwang Ui-jo", position: "ST", rating: 74, age: 31, nationality: "South Korea" }
    ]
  },
  {
    id: "gaziantep",
    name: "Gaziantep FK",
    shortName: "Gaziantep",
    leagueId: "superlig",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/176461.png",
    stadium: "Kalyon Stadium",
    capacity: 33502,
    budget: 17000000,
    transferBudget: 5000000,
    wageBudget: 170000,
    primaryColor: "#da291c",
    secondaryColor: "#000000",
    players: [
      { name: "Mustafa Burak Bozan", position: "GK", rating: 71, age: 24, nationality: "Turkey" },
      { name: "Arda Kızıldag", position: "CB", rating: 73, age: 25, nationality: "Turkey" },
      { name: "Enric Saborit", position: "CB", rating: 73, age: 32, nationality: "Spain" },
      { name: "Godfrey Bitok Stephen", position: "LB", rating: 71, age: 24, nationality: "Nigeria" },
      { name: "Salem M'Bakata", position: "RB", rating: 71, age: 26, nationality: "DR Congo" },
      { name: "Badou Ndiaye", position: "CDM", rating: 74, age: 33, nationality: "Senegal" },
      { name: "Kacper Kozlowski", position: "CM", rating: 74, age: 20, nationality: "Poland" },
      { name: "Alexandru Maxim", position: "CAM", rating: 76, age: 34, nationality: "Romania" },
      { name: "Deian Sorescu", position: "RW", rating: 74, age: 26, nationality: "Romania" },
      { name: "Christopher Lungoyi", position: "LW", rating: 72, age: 24, nationality: "Switzerland" },
      { name: "Kenan Kodro", position: "ST", rating: 74, age: 31, nationality: "Bosnia and Herzegovina" },
      { name: "David Okereke", position: "ST", rating: 74, age: 26, nationality: "Nigeria" }
    ]
  },
  {
    id: "konyaspor",
    name: "Konyaspor",
    shortName: "Konyaspor",
    leagueId: "superlig",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/10182.png",
    stadium: "Konya Metropolitan Municipality Stadium",
    capacity: 42000,
    budget: 18000000,
    transferBudget: 5500000,
    wageBudget: 180000,
    primaryColor: "#008751",
    secondaryColor: "#ffffff",
    players: [
      { name: "Jakub Slowik", position: "GK", rating: 73, age: 32, nationality: "Poland" },
      { name: "Adil Demirbag", position: "CB", rating: 73, age: 26, nationality: "Turkey" },
      { name: "Riechedly Bazoer", position: "CB", rating: 75, age: 27, nationality: "Netherlands" },
      { name: "Guilherme Sityá", position: "LB", rating: 75, age: 34, nationality: "Brazil" },
      { name: "Nikola Boranijasevic", position: "RB", rating: 72, age: 32, nationality: "Serbia" },
      { name: "Marko Jevtovic", position: "CDM", rating: 74, age: 31, nationality: "Serbia" },
      { name: "Ugurcan Yazgili", position: "CM", rating: 71, age: 25, nationality: "Turkey" },
      { name: "Pedrinho", position: "CAM", rating: 75, age: 31, nationality: "Portugal" },
      { name: "Danijel Aleksic", position: "CAM", rating: 74, age: 33, nationality: "Serbia" },
      { name: "Alassane Ndao", position: "RW", rating: 74, age: 27, nationality: "Senegal" },
      { name: "Blaž Kramer", position: "ST", rating: 74, age: 28, nationality: "Slovenia" },
      { name: "Umut Nayir", position: "ST", rating: 74, age: 31, nationality: "Turkey" }
    ]
  },
  {
    id: "kayserispor",
    name: "Kayserispor",
    shortName: "Kayserispor",
    leagueId: "superlig",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/9774.png",
    stadium: "RHG Enertürk Enerji Stadium",
    capacity: 32864,
    budget: 17000000,
    transferBudget: 5000000,
    wageBudget: 170000,
    primaryColor: "#ffd100",
    secondaryColor: "#da291c",
    players: [
      { name: "Bilal Bayazit", position: "GK", rating: 74, age: 25, nationality: "Netherlands" },
      { name: "Joseph Attamah", position: "CB", rating: 73, age: 30, nationality: "Ghana" },
      { name: "Majid Hosseini", position: "CB", rating: 74, age: 28, nationality: "Iran" },
      { name: "Lionel Carole", position: "LB", rating: 72, age: 33, nationality: "France" },
      { name: "Gökhan Sazdagi", position: "RB", rating: 73, age: 29, nationality: "Turkey" },
      { name: "Kartal Yılmaz", position: "CDM", rating: 73, age: 23, nationality: "Turkey" },
      { name: "Mehdi Bourabia", position: "CM", rating: 74, age: 33, nationality: "Morocco" },
      { name: "Carlos Mané", position: "RW", rating: 74, age: 30, nationality: "Guinea-Bissau" },
      { name: "Miguel Cardoso", position: "LW", rating: 75, age: 30, nationality: "Portugal" },
      { name: "Aylton Boa Morte", position: "RW", rating: 74, age: 30, nationality: "Portugal" },
      { name: "Duckens Nazon", position: "ST", rating: 74, age: 30, nationality: "Haiti" },
      { name: "Stéphane Bahoken", position: "ST", rating: 73, age: 32, nationality: "Cameroon" }
    ]
  },
  {
    id: "goztepe",
    name: "Göztepe SK",
    shortName: "Göztepe",
    leagueId: "superlig",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/10183.png",
    stadium: "Gürsel Aksel Stadium",
    capacity: 20035,
    budget: 20000000,
    transferBudget: 6200000,
    wageBudget: 200000,
    primaryColor: "#ffd100",
    secondaryColor: "#da291c",
    players: [
      { name: "Mateusz Lis", position: "GK", rating: 74, age: 27, nationality: "Poland" },
      { name: "Koray Günter", position: "CB", rating: 74, age: 29, nationality: "Germany" },
      { name: "Héliton", position: "CB", rating: 74, age: 28, nationality: "Brazil" },
      { name: "Taha Altıkardes", position: "CB", rating: 72, age: 20, nationality: "Turkey" },
      { name: "Djalma Silva", position: "LB", rating: 73, age: 29, nationality: "Brazil" },
      { name: "Ogün Bayrak", position: "RB", rating: 71, age: 25, nationality: "Turkey" },
      { name: "Anthony Dennis", position: "CDM", rating: 73, age: 20, nationality: "Nigeria" },
      { name: "David Tijanic", position: "CAM", rating: 73, age: 27, nationality: "Slovenia" },
      { name: "Isaac Solet", position: "CM", rating: 73, age: 23, nationality: "Central African Republic" },
      { name: "Romulo Cardoso", position: "ST", rating: 75, age: 22, nationality: "Brazil" },
      { name: "David Datro Fofana", position: "ST", rating: 75, age: 21, nationality: "Ivory Coast" },
      { name: "Kuryu Matsuki", position: "CAM", rating: 73, age: 21, nationality: "Japan" }
    ]
  },
  {
    id: "bodrum",
    name: "Bodrum FK",
    shortName: "Bodrum",
    leagueId: "superlig",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/9777.png",
    stadium: "Bodrum İlçe Stadium",
    capacity: 4563,
    budget: 15000000,
    transferBudget: 4500000,
    wageBudget: 150000,
    primaryColor: "#008751",
    secondaryColor: "#ffffff",
    players: [
      { name: "Diogo Sousa", position: "GK", rating: 72, age: 25, nationality: "Portugal" },
      { name: "Arlind Ajeti", position: "CB", rating: 73, age: 30, nationality: "Albania" },
      { name: "Ali Aytemur", position: "CB", rating: 71, age: 28, nationality: "Turkey" },
      { name: "Cenk Sen", position: "LB", rating: 70, age: 24, nationality: "Turkey" },
      { name: "Üzeyir Ergün", position: "RB", rating: 71, age: 31, nationality: "Turkey" },
      { name: "Musah Mohammed", position: "CDM", rating: 72, age: 22, nationality: "Ghana" },
      { name: "Samet Yalcin", position: "CM", rating: 72, age: 30, nationality: "Turkey" },
      { name: "Fredy Ribeiro", position: "CAM", rating: 74, age: 34, nationality: "Angola" },
      { name: "Zdravko Dimitrov", position: "LW", rating: 72, age: 25, nationality: "Bulgaria" },
      { name: "Gökdeniz Bayrakdar", position: "RW", rating: 73, age: 22, nationality: "Turkey" },
      { name: "George Puskas", position: "ST", rating: 74, age: 28, nationality: "Romania" },
      { name: "Taulant Seferi", position: "ST", rating: 73, age: 27, nationality: "Albania" }
    ]
  },
  {
    id: "hatayspor",
    name: "Hatayspor",
    shortName: "Hatayspor",
    leagueId: "superlig",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/10185.png",
    stadium: "Mersin Stadium",
    capacity: 25534,
    budget: 17000000,
    transferBudget: 5000000,
    wageBudget: 170000,
    primaryColor: "#da291c",
    secondaryColor: "#800000",
    players: [
      { name: "Erce Kardesler", position: "GK", rating: 72, age: 30, nationality: "Turkey" },
      { name: "Guy-Marcelin Kilama", position: "CB", rating: 74, age: 24, nationality: "Cameroon" },
      { name: "Burak Yılmaz", position: "CB", rating: 71, age: 28, nationality: "Turkey" },
      { name: "Cemali Sertel", position: "LB", rating: 71, age: 24, nationality: "Turkey" },
      { name: "Kamil Ahmet Çörekçi", position: "RB", rating: 71, age: 32, nationality: "Turkey" },
      { name: "Massanga Matondo", position: "CDM", rating: 73, age: 24, nationality: "Congo" },
      { name: "Görkem Saglam", position: "CM", rating: 73, age: 26, nationality: "Germany" },
      { name: "Rui Pedro", position: "CAM", rating: 73, age: 26, nationality: "Portugal" },
      { name: "Joelson Fernandes", position: "LW", rating: 73, age: 21, nationality: "Portugal" },
      { name: "Carlos Strandberg", position: "ST", rating: 74, age: 28, nationality: "Sweden" },
      { name: "Vincent Aboubakar", position: "ST", rating: 78, age: 32, nationality: "Cameroon" },
      { name: "Rigoberto Rivas", position: "RW", rating: 73, age: 25, nationality: "Honduras" }
    ]
  },
  {
    id: "adana_demirspor",
    name: "Adana Demirspor",
    shortName: "Adana Demir",
    leagueId: "superlig",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/10180.png",
    stadium: "New Adana Stadium",
    capacity: 33543,
    budget: 16000000,
    transferBudget: 4600000,
    wageBudget: 160000,
    primaryColor: "#0033a0",
    secondaryColor: "#008751",
    players: [
      { name: "Deniz Dönmezer", position: "GK", rating: 70, age: 15, nationality: "Turkey" },
      { name: "Semih Güler", position: "CB", rating: 73, age: 29, nationality: "Turkey" },
      { name: "Jovan Manev", position: "CB", rating: 72, age: 23, nationality: "North Macedonia" },
      { name: "Abdulsamet Burak", position: "LB", rating: 69, age: 28, nationality: "Turkey" },
      { name: "Arda Kurtulan", position: "RB", rating: 71, age: 21, nationality: "Albania" },
      { name: "Maestro", position: "CDM", rating: 74, age: 21, nationality: "Angola" },
      { name: "Tayfun Aydogan", position: "CM", rating: 72, age: 28, nationality: "Turkey" },
      { name: "Izzet Celik", position: "CM", rating: 70, age: 20, nationality: "Turkey" },
      { name: "Ali Yavuz Kol", position: "RW", rating: 71, age: 23, nationality: "Turkey" },
      { name: "Nabil Alioui", position: "LW", rating: 73, age: 25, nationality: "France" },
      { name: "Yusuf Barası", position: "ST", rating: 73, age: 21, nationality: "Turkey" },
      { name: "Salih Kavrazli", position: "ST", rating: 69, age: 22, nationality: "Turkey" }
    ]
  }
];

async function run() {
  console.log("Starting Batch 4 injection (Saudi & Süper Lig complete)...");
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
