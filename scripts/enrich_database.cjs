const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../src/data/database.json');
const publicDbPath = path.join(__dirname, '../public/database.json');

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// 1. Add new leagues if missing
const existingLeagueIds = new Set(db.leagues.map(l => l.id));

const newLeagues = [
  {
    id: 'mls',
    name: 'MLS (EEUU) 26/27',
    country: 'Estados Unidos',
    icon: '🇺🇸',
    championsSpots: 4,
    europaSpots: 0,
    relegationSpots: 0
  },
  {
    id: 'saudi',
    name: 'Saudi Pro League 26/27',
    country: 'Arabia Saudí',
    icon: '🇸🇦',
    championsSpots: 3,
    europaSpots: 0,
    relegationSpots: 3
  },
  {
    id: 'other',
    name: 'Resto del Mundo & Europa 26/27',
    country: 'Internacional',
    icon: '🌍',
    championsSpots: 2,
    europaSpots: 1,
    relegationSpots: 0
  }
];

newLeagues.forEach(nl => {
  if (!existingLeagueIds.has(nl.id)) {
    db.leagues.push(nl);
  }
});

// Helper to make player
function makePlayer(p, clubName, leagueId) {
  return {
    id: p.id,
    name: p.name,
    number: p.number || 10,
    team: clubName,
    leagueId: leagueId,
    kitPattern: "plain",
    pos: p.pos,
    imageUrl: p.imageUrl || "https://images.fotmob.com/image_resources/playerimages/701154.png",
    val: p.val || 10,
    budget: p.val || 10,
    wage: p.wage || 25,
    ovr: p.ovr || 75,
    pac: p.pac || 72,
    sho: p.sho || 70,
    pas: p.pas || 72,
    dri: p.dri || 74,
    def: p.def || 60,
    phy: p.phy || 70,
    age: p.age || 25,
    nat: p.nat || "Estados Unidos"
  };
}

// 2. Define new clubs and their authentic rosters
const newClubs = [
  // --- MLS CLUBS ---
  {
    id: "inter_miami",
    name: "Inter Miami CF",
    shortName: "MIA",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/1018598.png",
    leagueId: "mls",
    city: "Fort Lauderdale, Florida",
    stadium: "Chase Stadium",
    budget: 65,
    roster: [
      { id: "mia_messi", name: "Lionel Messi", number: 10, pos: "RW", imageUrl: "https://images.fotmob.com/image_resources/playerimages/30981.png", val: 30, wage: 120, ovr: 88, pac: 80, sho: 87, pas: 90, dri: 92, def: 33, phy: 64, age: 37, nat: "Argentina" },
      { id: "mia_suarez", name: "Luis Suárez", number: 9, pos: "ST", imageUrl: "https://images.fotmob.com/image_resources/playerimages/34380.png", val: 8, wage: 45, ovr: 82, pac: 68, sho: 85, pas: 77, dri: 79, def: 44, phy: 77, age: 37, nat: "Uruguay" },
      { id: "mia_busquets", name: "Sergio Busquets", number: 5, pos: "CDM", imageUrl: "https://images.fotmob.com/image_resources/playerimages/109249.png", val: 6, wage: 40, ovr: 81, pac: 40, sho: 59, pas: 80, dri: 78, def: 80, phy: 74, age: 36, nat: "España" },
      { id: "mia_alba", name: "Jordi Alba", number: 18, pos: "LB", imageUrl: "https://images.fotmob.com/image_resources/playerimages/130761.png", val: 5, wage: 35, ovr: 80, pac: 76, sho: 68, pas: 78, dri: 79, def: 74, phy: 68, age: 35, nat: "España" },
      { id: "mia_callender", name: "Drake Callender", number: 1, pos: "GK", imageUrl: "https://images.fotmob.com/image_resources/playerimages/1138243.png", val: 3, wage: 12, ovr: 74, pac: 72, sho: 70, pas: 74, dri: 73, def: 40, phy: 75, age: 27, nat: "Estados Unidos" },
      { id: "mia_redondo", name: "Federico Redondo", number: 55, pos: "CDM", imageUrl: "https://images.fotmob.com/image_resources/playerimages/1335265.png", val: 9, wage: 15, ovr: 75, pac: 70, sho: 60, pas: 76, dri: 75, def: 74, phy: 75, age: 21, nat: "Argentina" },
      { id: "mia_gomez", name: "Diego Gómez", number: 20, pos: "CM", imageUrl: "https://images.fotmob.com/image_resources/playerimages/1376823.png", val: 8, wage: 15, ovr: 75, pac: 75, sho: 72, pas: 74, dri: 74, def: 68, phy: 76, age: 21, nat: "Paraguay" },
      { id: "mia_aviles", name: "Tomás Avilés", number: 6, pos: "CB", imageUrl: "https://images.fotmob.com/image_resources/playerimages/1435214.png", val: 5, wage: 12, ovr: 73, pac: 68, sho: 40, pas: 65, dri: 62, def: 73, phy: 75, age: 20, nat: "Argentina" },
      { id: "mia_campana", name: "Leonardo Campana", number: 8, pos: "ST", imageUrl: "https://images.fotmob.com/image_resources/playerimages/1031976.png", val: 4, wage: 16, ovr: 74, pac: 74, sho: 75, pas: 62, dri: 72, def: 35, phy: 76, age: 24, nat: "Ecuador" },
      { id: "mia_gressel", name: "Julian Gressel", number: 24, pos: "RM", imageUrl: "https://images.fotmob.com/image_resources/playerimages/812678.png", val: 2, wage: 14, ovr: 73, pac: 72, sho: 70, pas: 77, dri: 71, def: 65, phy: 70, age: 30, nat: "Estados Unidos" },
      { id: "mia_taylor", name: "Robert Taylor", number: 16, pos: "LW", imageUrl: "https://images.fotmob.com/image_resources/playerimages/533036.png", val: 2, wage: 12, ovr: 72, pac: 77, sho: 71, pas: 70, dri: 74, def: 45, phy: 68, age: 29, nat: "Finlandia" },
      { id: "mia_farias", name: "Facundo Farías", number: 11, pos: "CAM", imageUrl: "https://images.fotmob.com/image_resources/playerimages/1131758.png", val: 6, wage: 14, ovr: 74, pac: 80, sho: 72, pas: 72, dri: 78, def: 40, phy: 62, age: 22, nat: "Argentina" },
      { id: "mia_weigandt", name: "Marcelo Weigandt", number: 57, pos: "RB", imageUrl: "https://images.fotmob.com/image_resources/playerimages/1020478.png", val: 3, wage: 12, ovr: 73, pac: 75, sho: 50, pas: 66, dri: 70, def: 72, phy: 74, age: 24, nat: "Argentina" }
    ]
  },
  {
    id: "lafc",
    name: "Los Angeles FC (LAFC)",
    shortName: "LAFC",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/850022.png",
    leagueId: "mls",
    city: "Los Angeles, California",
    stadium: "BMO Stadium",
    budget: 55,
    roster: [
      { id: "lafc_giroud", name: "Olivier Giroud", number: 9, pos: "ST", imageUrl: "https://images.fotmob.com/image_resources/playerimages/26274.png", val: 7, wage: 35, ovr: 82, pac: 42, sho: 83, pas: 73, dri: 74, def: 42, phy: 81, age: 38, nat: "Francia" },
      { id: "lafc_bouanga", name: "Denis Bouanga", number: 99, pos: "LW", imageUrl: "https://images.fotmob.com/image_resources/playerimages/533214.png", val: 18, wage: 30, ovr: 80, pac: 89, sho: 79, pas: 73, dri: 80, def: 45, phy: 74, age: 29, nat: "Gabón" },
      { id: "lafc_lloris", name: "Hugo Lloris", number: 1, pos: "GK", imageUrl: "https://images.fotmob.com/image_resources/playerimages/30737.png", val: 3, wage: 25, ovr: 79, pac: 40, sho: 75, pas: 68, dri: 76, def: 40, phy: 77, age: 37, nat: "Francia" },
      { id: "lafc_tillman", name: "Timothy Tillman", number: 11, pos: "CM", imageUrl: "https://images.fotmob.com/image_resources/playerimages/744421.png", val: 5, wage: 12, ovr: 74, pac: 74, sho: 68, pas: 75, dri: 76, def: 65, phy: 70, age: 25, nat: "Estados Unidos" },
      { id: "lafc_palencia", name: "Sergi Palencia", number: 14, pos: "RB", imageUrl: "https://images.fotmob.com/image_resources/playerimages/611956.png", val: 3, wage: 14, ovr: 74, pac: 78, sho: 55, pas: 69, dri: 71, def: 73, phy: 72, age: 28, nat: "España" },
      { id: "lafc_atuesta", name: "Eduard Atuesta", number: 20, pos: "CDM", imageUrl: "https://images.fotmob.com/image_resources/playerimages/810052.png", val: 6, wage: 15, ovr: 75, pac: 66, sho: 62, pas: 76, dri: 74, def: 73, phy: 74, age: 27, nat: "Colombia" },
      { id: "lafc_bogusz", name: "Mateusz Bogusz", number: 19, pos: "CAM", imageUrl: "https://images.fotmob.com/image_resources/playerimages/1000632.png", val: 7, wage: 14, ovr: 75, pac: 78, sho: 74, pas: 74, dri: 77, def: 55, phy: 70, age: 23, nat: "Polonia" },
      { id: "lafc_olivera", name: "Cristian Olivera", number: 27, pos: "RW", imageUrl: "https://images.fotmob.com/image_resources/playerimages/1118126.png", val: 5, wage: 12, ovr: 73, pac: 85, sho: 68, pas: 65, dri: 75, def: 38, phy: 66, age: 22, nat: "Uruguay" },
      { id: "lafc_murillo", name: "Jesús Murillo", number: 3, pos: "CB", imageUrl: "https://images.fotmob.com/image_resources/playerimages/548234.png", val: 3, wage: 12, ovr: 74, pac: 68, sho: 35, pas: 58, dri: 60, def: 74, phy: 78, age: 30, nat: "Colombia" },
      { id: "lafc_hollingshead", name: "Ryan Hollingshead", number: 24, pos: "LB", imageUrl: "https://images.fotmob.com/image_resources/playerimages/474138.png", val: 2, wage: 10, ovr: 73, pac: 75, sho: 66, pas: 68, dri: 71, def: 70, phy: 74, age: 33, nat: "Estados Unidos" },
      { id: "lafc_ilie", name: "Ilie Sánchez", number: 6, pos: "CDM", imageUrl: "https://images.fotmob.com/image_resources/playerimages/192244.png", val: 2, wage: 12, ovr: 73, pac: 55, sho: 60, pas: 75, dri: 71, def: 73, phy: 72, age: 33, nat: "España" }
    ]
  },
  {
    id: "la_galaxy",
    name: "LA Galaxy",
    shortName: "LAG",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/9726.png",
    leagueId: "mls",
    city: "Carson, California",
    stadium: "Dignity Health Sports Park",
    budget: 50,
    roster: [
      { id: "lag_puig", name: "Riqui Puig", number: 10, pos: "CM", imageUrl: "https://images.fotmob.com/image_resources/playerimages/936417.png", val: 20, wage: 35, ovr: 79, pac: 74, sho: 70, pas: 80, dri: 84, def: 58, phy: 59, age: 25, nat: "España" },
      { id: "lag_reus", name: "Marco Reus", number: 18, pos: "CAM", imageUrl: "https://images.fotmob.com/image_resources/playerimages/80562.png", val: 8, wage: 35, ovr: 81, pac: 69, sho: 82, pas: 82, dri: 81, def: 50, phy: 63, age: 35, nat: "Alemania" },
      { id: "lag_pec", name: "Gabriel Pec", number: 11, pos: "RW", imageUrl: "https://images.fotmob.com/image_resources/playerimages/1146816.png", val: 14, wage: 20, ovr: 77, pac: 85, sho: 74, pas: 72, dri: 78, def: 40, phy: 66, age: 23, nat: "Brasil" },
      { id: "lag_paintsil", name: "Joseph Paintsil", number: 28, pos: "LW", imageUrl: "https://images.fotmob.com/image_resources/playerimages/885694.png", val: 16, wage: 25, ovr: 78, pac: 92, sho: 75, pas: 70, dri: 80, def: 45, phy: 70, age: 26, nat: "Ghana" },
      { id: "lag_joveljic", name: "Dejan Joveljić", number: 9, pos: "ST", imageUrl: "https://images.fotmob.com/image_resources/playerimages/847721.png", val: 9, wage: 18, ovr: 76, pac: 76, sho: 77, pas: 66, dri: 74, def: 35, phy: 72, age: 25, nat: "Serbia" },
      { id: "lag_brugman", name: "Gastón Brugman", number: 5, pos: "CDM", imageUrl: "https://images.fotmob.com/image_resources/playerimages/212879.png", val: 3, wage: 14, ovr: 74, pac: 65, sho: 68, pas: 76, dri: 73, def: 72, phy: 72, age: 31, nat: "Uruguay" },
      { id: "lag_yoshida", name: "Maya Yoshida", number: 4, pos: "CB", imageUrl: "https://images.fotmob.com/image_resources/playerimages/122176.png", val: 1, wage: 12, ovr: 73, pac: 48, sho: 40, pas: 64, dri: 60, def: 75, phy: 76, age: 36, nat: "Japón" },
      { id: "lag_aude", name: "Julian Aude", number: 3, pos: "LB", imageUrl: "https://images.fotmob.com/image_resources/playerimages/1143828.png", val: 4, wage: 10, ovr: 72, pac: 76, sho: 50, pas: 66, dri: 71, def: 70, phy: 68, age: 21, nat: "Argentina" },
      { id: "lag_yamane", name: "Miki Yamane", number: 2, pos: "RB", imageUrl: "https://images.fotmob.com/image_resources/playerimages/774052.png", val: 2.5, wage: 12, ovr: 73, pac: 75, sho: 55, pas: 68, dri: 70, def: 72, phy: 70, age: 30, nat: "Japón" },
      { id: "lag_mccarthy", name: "John McCarthy", number: 77, pos: "GK", imageUrl: "https://images.fotmob.com/image_resources/playerimages/559404.png", val: 1.5, wage: 10, ovr: 72, pac: 70, sho: 68, pas: 70, dri: 71, def: 38, phy: 72, age: 32, nat: "Estados Unidos" }
    ]
  },
  {
    id: "columbus_crew",
    name: "Columbus Crew",
    shortName: "CLB",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/9723.png",
    leagueId: "mls",
    city: "Columbus, Ohio",
    stadium: "Lower.com Field",
    budget: 45,
    roster: [
      { id: "clb_cucho", name: "Cucho Hernández", number: 9, pos: "ST", imageUrl: "https://images.fotmob.com/image_resources/playerimages/737637.png", val: 24, wage: 30, ovr: 80, pac: 82, sho: 81, pas: 75, dri: 80, def: 44, phy: 76, age: 25, nat: "Colombia" },
      { id: "clb_rossi", name: "Diego Rossi", number: 10, pos: "LW", imageUrl: "https://images.fotmob.com/image_resources/playerimages/737478.png", val: 15, wage: 25, ovr: 78, pac: 84, sho: 76, pas: 73, dri: 79, def: 40, phy: 64, age: 26, nat: "Uruguay" },
      { id: "clb_nagbe", name: "Darlington Nagbe", number: 6, pos: "CM", imageUrl: "https://images.fotmob.com/image_resources/playerimages/213031.png", val: 4, wage: 20, ovr: 76, pac: 72, sho: 68, pas: 78, dri: 80, def: 71, phy: 72, age: 34, nat: "Estados Unidos" },
      { id: "clb_ramirez", name: "Christian Ramirez", number: 17, pos: "ST", imageUrl: "https://images.fotmob.com/image_resources/playerimages/557997.png", val: 2, wage: 12, ovr: 73, pac: 68, sho: 74, pas: 65, dri: 68, def: 35, phy: 76, age: 33, nat: "Estados Unidos" },
      { id: "clb_schulte", name: "Patrick Schulte", number: 28, pos: "GK", imageUrl: "https://images.fotmob.com/image_resources/playerimages/1325147.png", val: 5, wage: 12, ovr: 74, pac: 73, sho: 72, pas: 74, dri: 72, def: 40, phy: 74, age: 23, nat: "Estados Unidos" }
    ]
  },
  {
    id: "fc_cincinnati",
    name: "FC Cincinnati",
    shortName: "CIN",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/810695.png",
    leagueId: "mls",
    city: "Cincinnati, Ohio",
    stadium: "TQL Stadium",
    budget: 40,
    roster: [
      { id: "cin_acosta", name: "Luciano Acosta", number: 10, pos: "CAM", imageUrl: "https://images.fotmob.com/image_resources/playerimages/477439.png", val: 16, wage: 30, ovr: 80, pac: 80, sho: 75, pas: 81, dri: 85, def: 44, phy: 55, age: 30, nat: "Argentina" },
      { id: "cin_kelsy", name: "Kevin Kelsy", number: 19, pos: "ST", imageUrl: "https://images.fotmob.com/image_resources/playerimages/1376822.png", val: 4, wage: 10, ovr: 73, pac: 74, sho: 73, pas: 60, dri: 70, def: 30, phy: 78, age: 20, nat: "Venezuela" },
      { id: "cin_orellano", name: "Luca Orellano", number: 23, pos: "RWB", imageUrl: "https://images.fotmob.com/image_resources/playerimages/1020477.png", val: 7, wage: 15, ovr: 75, pac: 84, sho: 72, pas: 73, dri: 79, def: 64, phy: 68, age: 24, nat: "Argentina" },
      { id: "cin_robinson", name: "Miles Robinson", number: 12, pos: "CB", imageUrl: "https://images.fotmob.com/image_resources/playerimages/812679.png", val: 6, wage: 16, ovr: 75, pac: 76, sho: 35, pas: 60, dri: 62, def: 76, phy: 80, age: 27, nat: "Estados Unidos" },
      { id: "cin_benteke", name: "Christian Benteke", number: 20, pos: "ST", imageUrl: "https://images.fotmob.com/image_resources/playerimages/154938.png", val: 6, wage: 25, ovr: 78, pac: 68, sho: 79, pas: 66, dri: 72, def: 42, phy: 84, age: 33, nat: "Bélgica" },
      { id: "cin_forsberg", name: "Emil Forsberg", number: 10, pos: "CAM", imageUrl: "https://images.fotmob.com/image_resources/playerimages/169176.png", val: 10, wage: 30, ovr: 79, pac: 73, sho: 78, pas: 81, dri: 82, def: 50, phy: 66, age: 32, nat: "Suecia" }
    ]
  },

  // --- SAUDI PRO LEAGUE CLUBS ---
  {
    id: "al_nassr",
    name: "Al-Nassr FC",
    shortName: "NAS",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/7889.png",
    leagueId: "saudi",
    city: "Riyadh",
    stadium: "Al-Awwal Park",
    budget: 180,
    roster: [
      { id: "nas_cr7", name: "Cristiano Ronaldo", number: 7, pos: "ST", imageUrl: "https://images.fotmob.com/image_resources/playerimages/30893.png", val: 15, wage: 200, ovr: 86, pac: 77, sho: 88, pas: 75, dri: 80, def: 34, phy: 74, age: 39, nat: "Portugal" },
      { id: "nas_mane", name: "Sadio Mané", number: 10, pos: "LW", imageUrl: "https://images.fotmob.com/image_resources/playerimages/292462.png", val: 20, wage: 70, ovr: 83, pac: 83, sho: 81, pas: 77, dri: 84, def: 44, phy: 74, age: 32, nat: "Senegal" },
      { id: "nas_laporte", name: "Aymeric Laporte", number: 27, pos: "CB", imageUrl: "https://images.fotmob.com/image_resources/playerimages/288205.png", val: 25, wage: 65, ovr: 83, pac: 63, sho: 50, pas: 72, dri: 69, def: 84, phy: 80, age: 30, nat: "España" },
      { id: "nas_brozovic", name: "Marcelo Brozović", number: 77, pos: "CDM", imageUrl: "https://images.fotmob.com/image_resources/playerimages/233076.png", val: 18, wage: 60, ovr: 82, pac: 68, sho: 74, pas: 82, dri: 80, def: 79, phy: 78, age: 31, nat: "Croacia" },
      { id: "nas_otavio", name: "Otávio", number: 25, pos: "CAM", imageUrl: "https://images.fotmob.com/image_resources/playerimages/400508.png", val: 20, wage: 50, ovr: 81, pac: 76, sho: 74, pas: 81, dri: 83, def: 65, phy: 74, age: 29, nat: "Portugal" },
      { id: "nas_bento", name: "Bento", number: 24, pos: "GK", imageUrl: "https://images.fotmob.com/image_resources/playerimages/1146817.png", val: 15, wage: 30, ovr: 79, pac: 78, sho: 76, pas: 78, dri: 79, def: 42, phy: 80, age: 25, nat: "Brasil" },
      { id: "nas_simakan", name: "Mohamed Simakan", number: 3, pos: "CB", imageUrl: "https://images.fotmob.com/image_resources/playerimages/1020479.png", val: 22, wage: 35, ovr: 79, pac: 78, sho: 45, pas: 66, dri: 72, def: 80, phy: 81, age: 24, nat: "Francia" },
      { id: "nas_angelo", name: "Ângelo Gabriel", number: 20, pos: "RW", imageUrl: "https://images.fotmob.com/image_resources/playerimages/1253891.png", val: 12, wage: 20, ovr: 75, pac: 84, sho: 68, pas: 71, dri: 80, def: 35, phy: 58, age: 19, nat: "Brasil" },
      { id: "nas_alghannam", name: "Sultan Al-Ghannam", number: 2, pos: "RB", imageUrl: "https://images.fotmob.com/image_resources/playerimages/774053.png", val: 3, wage: 15, ovr: 75, pac: 79, sho: 58, pas: 70, dri: 72, def: 72, phy: 73, age: 30, nat: "Arabia Saudí" }
    ]
  },
  {
    id: "al_hilal",
    name: "Al-Hilal FC",
    shortName: "HIL",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/7888.png",
    leagueId: "saudi",
    city: "Riyadh",
    stadium: "Kingdom Arena",
    budget: 200,
    roster: [
      { id: "hil_neymar", name: "Neymar Jr", number: 10, pos: "LW", imageUrl: "https://images.fotmob.com/image_resources/playerimages/209705.png", val: 35, wage: 150, ovr: 87, pac: 84, sho: 81, pas: 85, dri: 91, def: 37, phy: 60, age: 32, nat: "Brasil" },
      { id: "hil_cancelo", name: "João Cancelo", number: 20, pos: "RB", imageUrl: "https://images.fotmob.com/image_resources/playerimages/386043.png", val: 32, wage: 65, ovr: 84, pac: 82, sho: 71, pas: 83, dri: 84, def: 78, phy: 71, age: 30, nat: "Portugal" },
      { id: "hil_mitrovic", name: "Aleksandar Mitrović", number: 9, pos: "ST", imageUrl: "https://images.fotmob.com/image_resources/playerimages/312005.png", val: 25, wage: 65, ovr: 83, pac: 68, sho: 84, pas: 68, dri: 74, def: 39, phy: 87, age: 30, nat: "Serbia" },
      { id: "hil_rubenneves", name: "Rúben Neves", number: 8, pos: "CM", imageUrl: "https://images.fotmob.com/image_resources/playerimages/526771.png", val: 38, wage: 70, ovr: 84, pac: 65, sho: 76, pas: 86, dri: 77, def: 76, phy: 76, age: 27, nat: "Portugal" },
      { id: "hil_milinkovic", name: "Sergej Milinković-Savić", number: 22, pos: "CM", imageUrl: "https://images.fotmob.com/image_resources/playerimages/474139.png", val: 35, wage: 70, ovr: 84, pac: 68, sho: 81, pas: 82, dri: 81, def: 77, phy: 84, age: 29, nat: "Serbia" },
      { id: "hil_bono", name: "Yassine Bounou (Bono)", number: 37, pos: "GK", imageUrl: "https://images.fotmob.com/image_resources/playerimages/283286.png", val: 18, wage: 50, ovr: 84, pac: 82, sho: 83, pas: 78, dri: 84, def: 45, phy: 80, age: 33, nat: "Marruecos" },
      { id: "hil_koulibaly", name: "Kalidou Koulibaly", number: 3, pos: "CB", imageUrl: "https://images.fotmob.com/image_resources/playerimages/233077.png", val: 15, wage: 55, ovr: 83, pac: 69, sho: 33, pas: 61, dri: 66, def: 84, phy: 84, age: 33, nat: "Senegal" },
      { id: "hil_malcom", name: "Malcom", number: 77, pos: "RW", imageUrl: "https://images.fotmob.com/image_resources/playerimages/604505.png", val: 28, wage: 50, ovr: 82, pac: 85, sho: 79, pas: 80, dri: 84, def: 40, phy: 66, age: 27, nat: "Brasil" },
      { id: "hil_lodi", name: "Renan Lodi", number: 6, pos: "LB", imageUrl: "https://images.fotmob.com/image_resources/playerimages/812680.png", val: 14, wage: 30, ovr: 78, pac: 83, sho: 64, pas: 75, dri: 79, def: 74, phy: 70, age: 26, nat: "Brasil" },
      { id: "hil_leonardo", name: "Marcos Leonardo", number: 11, pos: "ST", imageUrl: "https://images.fotmob.com/image_resources/playerimages/1146818.png", val: 20, wage: 25, ovr: 78, pac: 80, sho: 78, pas: 65, dri: 77, def: 35, phy: 74, age: 21, nat: "Brasil" }
    ]
  },
  {
    id: "al_ittihad",
    name: "Al-Ittihad Club",
    shortName: "ITT",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/7887.png",
    leagueId: "saudi",
    city: "Jeddah",
    stadium: "King Abdullah Sports City",
    budget: 170,
    roster: [
      { id: "itt_benzema", name: "Karim Benzema", number: 9, pos: "ST", imageUrl: "https://images.fotmob.com/image_resources/playerimages/30743.png", val: 22, wage: 120, ovr: 86, pac: 76, sho: 86, pas: 82, dri: 85, def: 39, phy: 76, age: 36, nat: "Francia" },
      { id: "itt_kante", name: "N'Golo Kanté", number: 7, pos: "CDM", imageUrl: "https://images.fotmob.com/image_resources/playerimages/373984.png", val: 22, wage: 80, ovr: 84, pac: 74, sho: 66, pas: 76, dri: 80, def: 85, phy: 81, age: 33, nat: "Francia" },
      { id: "itt_fabinho", name: "Fabinho", number: 8, pos: "CDM", imageUrl: "https://images.fotmob.com/image_resources/playerimages/400509.png", val: 22, wage: 55, ovr: 82, pac: 58, sho: 68, pas: 78, dri: 75, def: 82, phy: 81, age: 30, nat: "Brasil" },
      { id: "itt_diaby", name: "Moussa Diaby", number: 19, pos: "RW", imageUrl: "https://images.fotmob.com/image_resources/playerimages/812681.png", val: 35, wage: 60, ovr: 82, pac: 94, sho: 75, pas: 76, dri: 85, def: 42, phy: 55, age: 25, nat: "Francia" },
      { id: "itt_aouar", name: "Houssem Aouar", number: 10, pos: "CM", imageUrl: "https://images.fotmob.com/image_resources/playerimages/744422.png", val: 14, wage: 30, ovr: 78, pac: 72, sho: 74, pas: 79, dri: 82, def: 60, phy: 64, age: 26, nat: "Argelia" },
      { id: "itt_bergwijn", name: "Steven Bergwijn", number: 34, pos: "LW", imageUrl: "https://images.fotmob.com/image_resources/playerimages/604506.png", val: 15, wage: 35, ovr: 78, pac: 85, sho: 76, pas: 74, dri: 80, def: 44, phy: 73, age: 27, nat: "Países Bajos" },
      { id: "itt_rajkovic", name: "Predrag Rajković", number: 1, pos: "GK", imageUrl: "https://images.fotmob.com/image_resources/playerimages/474140.png", val: 12, wage: 25, ovr: 79, pac: 78, sho: 77, pas: 75, dri: 80, def: 42, phy: 78, age: 28, nat: "Serbia" },
      { id: "itt_danilo", name: "Danilo Pereira", number: 15, pos: "CB", imageUrl: "https://images.fotmob.com/image_resources/playerimages/212880.png", val: 8, wage: 30, ovr: 79, pac: 60, sho: 64, pas: 72, dri: 70, def: 80, phy: 83, age: 33, nat: "Portugal" }
    ]
  },
  {
    id: "al_ahli",
    name: "Al-Ahli Saudi FC",
    shortName: "AHL",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/7886.png",
    leagueId: "saudi",
    city: "Jeddah",
    stadium: "King Abdullah Sports City",
    budget: 160,
    roster: [
      { id: "ahl_mahrez", name: "Riyad Mahrez", number: 7, pos: "RW", imageUrl: "https://images.fotmob.com/image_resources/playerimages/220265.png", val: 22, wage: 80, ovr: 84, pac: 78, sho: 81, pas: 82, dri: 88, def: 37, phy: 58, age: 33, nat: "Argelia" },
      { id: "ahl_toney", name: "Ivan Toney", number: 99, pos: "ST", imageUrl: "https://images.fotmob.com/image_resources/playerimages/533215.png", val: 30, wage: 65, ovr: 82, pac: 78, sho: 82, pas: 72, dri: 79, def: 46, phy: 82, age: 28, nat: "Inglaterra" },
      { id: "ahl_firmino", name: "Roberto Firmino", number: 10, pos: "CF", imageUrl: "https://images.fotmob.com/image_resources/playerimages/209297.png", val: 15, wage: 50, ovr: 81, pac: 72, sho: 79, pas: 79, dri: 85, def: 55, phy: 73, age: 33, nat: "Brasil" },
      { id: "ahl_kessie", name: "Franck Kessié", number: 79, pos: "CM", imageUrl: "https://images.fotmob.com/image_resources/playerimages/531630.png", val: 28, wage: 55, ovr: 82, pac: 74, sho: 77, pas: 78, dri: 79, def: 81, phy: 86, age: 27, nat: "Costa de Marfil" },
      { id: "ahl_veiga", name: "Gabri Veiga", number: 24, pos: "CAM", imageUrl: "https://images.fotmob.com/image_resources/playerimages/1118743.png", val: 22, wage: 35, ovr: 78, pac: 78, sho: 76, pas: 77, dri: 80, def: 58, phy: 70, age: 22, nat: "España" },
      { id: "ahl_mendy", name: "Edouard Mendy", number: 16, pos: "GK", imageUrl: "https://images.fotmob.com/image_resources/playerimages/743534.png", val: 12, wage: 40, ovr: 81, pac: 80, sho: 81, pas: 74, dri: 81, def: 40, phy: 79, age: 32, nat: "Senegal" },
      { id: "ahl_ibanez", name: "Roger Ibañez", number: 3, pos: "CB", imageUrl: "https://images.fotmob.com/image_resources/playerimages/914459.png", val: 22, wage: 35, ovr: 80, pac: 81, sho: 40, pas: 64, dri: 68, def: 81, phy: 80, age: 25, nat: "Brasil" },
      { id: "ahl_demiral", name: "Merih Demiral", number: 28, pos: "CB", imageUrl: "https://images.fotmob.com/image_resources/playerimages/844416.png", val: 14, wage: 30, ovr: 78, pac: 72, sho: 38, pas: 55, dri: 60, def: 79, phy: 83, age: 26, nat: "Turquía" }
    ]
  },

  // --- BUNDESLIGA & GRANDES DE EUROPA ---
  {
    id: "bayer_leverkusen",
    name: "Bayer 04 Leverkusen",
    shortName: "B04",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/8178.png",
    leagueId: "bundesliga",
    city: "Leverkusen",
    stadium: "BayArena",
    budget: 85,
    roster: [
      { id: "b04_wirtz", name: "Florian Wirtz", number: 10, pos: "CAM", imageUrl: "https://images.fotmob.com/image_resources/playerimages/1118742.png", val: 95, wage: 75, ovr: 88, pac: 81, sho: 81, pas: 87, dri: 89, def: 53, phy: 68, age: 21, nat: "Alemania" },
      { id: "b04_xhaka", name: "Granit Xhaka", number: 34, pos: "CDM", imageUrl: "https://images.fotmob.com/image_resources/playerimages/213032.png", val: 30, wage: 60, ovr: 85, pac: 50, sho: 75, pas: 86, dri: 77, def: 80, phy: 81, age: 32, nat: "Suiza" },
      { id: "b04_grimaldo", name: "Alejandro Grimaldo", number: 20, pos: "LWB", imageUrl: "https://images.fotmob.com/image_resources/playerimages/373985.png", val: 42, wage: 55, ovr: 85, pac: 82, sho: 79, pas: 87, dri: 83, def: 77, phy: 70, age: 29, nat: "España" },
      { id: "b04_frimpong", name: "Jeremie Frimpong", number: 30, pos: "RWB", imageUrl: "https://images.fotmob.com/image_resources/playerimages/1077895.png", val: 45, wage: 50, ovr: 84, pac: 94, sho: 74, pas: 78, dri: 85, def: 74, phy: 72, age: 23, nat: "Países Bajos" },
      { id: "b04_tah", name: "Jonathan Tah", number: 4, pos: "CB", imageUrl: "https://images.fotmob.com/image_resources/playerimages/400510.png", val: 32, wage: 50, ovr: 84, pac: 74, sho: 35, pas: 66, dri: 66, def: 85, phy: 84, age: 28, nat: "Alemania" },
      { id: "b04_palacios", name: "Exequiel Palacios", number: 25, pos: "CM", imageUrl: "https://images.fotmob.com/image_resources/playerimages/812682.png", val: 35, wage: 45, ovr: 83, pac: 74, sho: 72, pas: 82, dri: 82, def: 78, phy: 77, age: 26, nat: "Argentina" },
      { id: "b04_boniface", name: "Victor Boniface", number: 22, pos: "ST", imageUrl: "https://images.fotmob.com/image_resources/playerimages/1020480.png", val: 35, wage: 40, ovr: 82, pac: 83, sho: 82, pas: 68, dri: 82, def: 35, phy: 84, age: 23, nat: "Nigeria" },
      { id: "b04_tapsoba", name: "Edmond Tapsoba", number: 12, pos: "CB", imageUrl: "https://images.fotmob.com/image_resources/playerimages/844417.png", val: 30, wage: 40, ovr: 82, pac: 76, sho: 50, pas: 72, dri: 72, def: 83, phy: 80, age: 25, nat: "Burkina Faso" },
      { id: "b04_hradecky", name: "Lukáš Hrádecký", number: 1, pos: "GK", imageUrl: "https://images.fotmob.com/image_resources/playerimages/169177.png", val: 10, wage: 35, ovr: 82, pac: 81, sho: 80, pas: 75, dri: 82, def: 42, phy: 80, age: 34, nat: "Finlandia" },
      { id: "b04_aleix", name: "Aleix García", number: 24, pos: "CM", imageUrl: "https://images.fotmob.com/image_resources/playerimages/623538.png", val: 22, wage: 40, ovr: 81, pac: 68, sho: 74, pas: 83, dri: 80, def: 74, phy: 71, age: 27, nat: "España" }
    ]
  },
  {
    id: "galatasaray",
    name: "Galatasaray SK",
    shortName: "GAL",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/8637.png",
    leagueId: "other",
    city: "Estambul",
    stadium: "Rams Park",
    budget: 50,
    roster: [
      { id: "gal_osimhen", name: "Victor Osimhen", number: 45, pos: "ST", imageUrl: "https://images.fotmob.com/image_resources/playerimages/802283.png", val: 75, wage: 90, ovr: 87, pac: 89, sho: 85, pas: 66, dri: 80, def: 42, phy: 82, age: 25, nat: "Nigeria" },
      { id: "gal_icardi", name: "Mauro Icardi", number: 9, pos: "ST", imageUrl: "https://images.fotmob.com/image_resources/playerimages/283287.png", val: 15, wage: 50, ovr: 81, pac: 68, sho: 84, pas: 72, dri: 76, def: 36, phy: 72, age: 31, nat: "Argentina" },
      { id: "gal_torreira", name: "Lucas Torreira", number: 34, pos: "CDM", imageUrl: "https://images.fotmob.com/image_resources/playerimages/604507.png", val: 18, wage: 40, ovr: 80, pac: 72, sho: 68, pas: 76, dri: 77, def: 81, phy: 76, age: 28, nat: "Uruguay" },
      { id: "gal_sanchez", name: "Davinson Sánchez", number: 6, pos: "CB", imageUrl: "https://images.fotmob.com/image_resources/playerimages/743535.png", val: 16, wage: 35, ovr: 79, pac: 78, sho: 35, pas: 60, dri: 65, def: 80, phy: 82, age: 28, nat: "Colombia" },
      { id: "gal_mertens", name: "Dries Mertens", number: 10, pos: "CAM", imageUrl: "https://images.fotmob.com/image_resources/playerimages/30744.png", val: 5, wage: 30, ovr: 79, pac: 74, sho: 80, pas: 80, dri: 82, def: 35, phy: 54, age: 37, nat: "Bélgica" },
      { id: "gal_sara", name: "Gabriel Sara", number: 20, pos: "CM", imageUrl: "https://images.fotmob.com/image_resources/playerimages/936418.png", val: 18, wage: 30, ovr: 78, pac: 74, sho: 75, pas: 79, dri: 79, def: 70, phy: 76, age: 25, nat: "Brasil" },
      { id: "gal_yilmaz", name: "Barış Alper Yılmaz", number: 53, pos: "RW", imageUrl: "https://images.fotmob.com/image_resources/playerimages/1146819.png", val: 18, wage: 25, ovr: 78, pac: 88, sho: 74, pas: 70, dri: 78, def: 55, phy: 79, age: 24, nat: "Turquía" },
      { id: "gal_muslera", name: "Fernando Muslera", number: 1, pos: "GK", imageUrl: "https://images.fotmob.com/image_resources/playerimages/37398.png", val: 2, wage: 25, ovr: 79, pac: 78, sho: 76, pas: 74, dri: 78, def: 40, phy: 77, age: 38, nat: "Uruguay" }
    ]
  },
  {
    id: "sporting_cp",
    name: "Sporting CP",
    shortName: "SCP",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/9768.png",
    leagueId: "other",
    city: "Lisboa",
    stadium: "Estádio José Alvalade",
    budget: 45,
    roster: [
      { id: "scp_gyokeres", name: "Viktor Gyökeres", number: 9, pos: "ST", imageUrl: "https://images.fotmob.com/image_resources/playerimages/812683.png", val: 55, wage: 50, ovr: 85, pac: 88, sho: 86, pas: 73, dri: 81, def: 45, phy: 89, age: 26, nat: "Suecia" },
      { id: "scp_goncalves", name: "Pedro Gonçalves", number: 8, pos: "LW", imageUrl: "https://images.fotmob.com/image_resources/playerimages/847722.png", val: 30, wage: 35, ovr: 82, pac: 78, sho: 82, pas: 81, dri: 83, def: 58, phy: 68, age: 26, nat: "Portugal" },
      { id: "scp_hjulmand", name: "Morten Hjulmand", number: 42, pos: "CDM", imageUrl: "https://images.fotmob.com/image_resources/playerimages/1000633.png", val: 25, wage: 30, ovr: 81, pac: 70, sho: 68, pas: 78, dri: 76, def: 81, phy: 82, age: 25, nat: "Dinamarca" },
      { id: "scp_inacio", name: "Gonçalo Inácio", number: 25, pos: "CB", imageUrl: "https://images.fotmob.com/image_resources/playerimages/1118127.png", val: 28, wage: 30, ovr: 80, pac: 74, sho: 45, pas: 75, dri: 72, def: 81, phy: 78, age: 23, nat: "Portugal" },
      { id: "scp_trincao", name: "Francisco Trincão", number: 17, pos: "RW", imageUrl: "https://images.fotmob.com/image_resources/playerimages/885695.png", val: 22, wage: 30, ovr: 80, pac: 80, sho: 76, pas: 77, dri: 84, def: 42, phy: 66, age: 24, nat: "Portugal" }
    ]
  },
  {
    id: "benfica",
    name: "SL Benfica",
    shortName: "SLB",
    badge: "https://images.fotmob.com/image_resources/logo/teamlogo/9773.png",
    leagueId: "other",
    city: "Lisboa",
    stadium: "Estádio da Luz",
    budget: 50,
    roster: [
      { id: "slb_dimaria", name: "Ángel Di María", number: 11, pos: "RW", imageUrl: "https://images.fotmob.com/image_resources/playerimages/37397.png", val: 12, wage: 45, ovr: 83, pac: 76, sho: 80, pas: 85, dri: 86, def: 46, phy: 64, age: 36, nat: "Argentina" },
      { id: "slb_kokcu", name: "Orkun Kökçü", number: 10, pos: "CM", imageUrl: "https://images.fotmob.com/image_resources/playerimages/914460.png", val: 32, wage: 40, ovr: 82, pac: 72, sho: 78, pas: 83, dri: 81, def: 68, phy: 74, age: 23, nat: "Turquía" },
      { id: "slb_aktürkoglu", name: "Kerem Aktürkoğlu", number: 17, pos: "LW", imageUrl: "https://images.fotmob.com/image_resources/playerimages/1077896.png", val: 22, wage: 30, ovr: 80, pac: 86, sho: 76, pas: 75, dri: 82, def: 44, phy: 66, age: 25, nat: "Turquía" },
      { id: "slb_silva", name: "António Silva", number: 4, pos: "CB", imageUrl: "https://images.fotmob.com/image_resources/playerimages/1253892.png", val: 30, wage: 25, ovr: 80, pac: 75, sho: 35, pas: 68, dri: 68, def: 82, phy: 79, age: 20, nat: "Portugal" },
      { id: "slb_trubin", name: "Anatoliy Trubin", number: 1, pos: "GK", imageUrl: "https://images.fotmob.com/image_resources/playerimages/1020481.png", val: 25, wage: 30, ovr: 80, pac: 80, sho: 79, pas: 76, dri: 81, def: 44, phy: 80, age: 23, nat: "Ucrania" }
    ]
  }
];

// Add formatted players to clubs and insert or update in db.clubs
newClubs.forEach(nc => {
  const existingIdx = db.clubs.findIndex(c => c.id === nc.id);
  const formattedRoster = nc.roster.map(p => makePlayer(p, nc.name, nc.leagueId));
  const clubToSave = {
    ...nc,
    roster: formattedRoster
  };

  if (existingIdx !== -1) {
    db.clubs[existingIdx] = clubToSave;
  } else {
    db.clubs.push(clubToSave);
  }
});

// Also ensure every player in EVERY club has leagueId and team properly set
db.clubs.forEach(c => {
  c.roster = (c.roster || []).map(p => ({
    ...p,
    team: c.name,
    leagueId: c.leagueId
  }));
});

// Write to src/data/database.json and public/database.json
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
fs.writeFileSync(publicDbPath, JSON.stringify(db, null, 2), 'utf8');

console.log("Successfully updated database.json!");
console.log("Total clubs:", db.clubs.length);
console.log("Total players:", db.clubs.reduce((acc, c) => acc + (c.roster?.length || 0), 0));
