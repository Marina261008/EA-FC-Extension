const fs = require('fs');
const path = require('path');
const https = require('https');

// Resolved IDs for players who were previously missing or using generic silhouette
const RESOLVED_MAP = {
  // Superstars & Top Players
  "Samu Omorodion": "https://images.fotmob.com/image_resources/playerimages/1414859.png",
  "Samuel Aghehowa": "https://images.fotmob.com/image_resources/playerimages/1414859.png",
  "Wenderson Galeno": "https://images.fotmob.com/image_resources/playerimages/776972.png",
  "Galeno": "https://images.fotmob.com/image_resources/playerimages/776972.png",
  "Francisco Trincão": "https://images.fotmob.com/image_resources/playerimages/732282.png",
  "Trincão": "https://images.fotmob.com/image_resources/playerimages/732282.png",
  "Vitinha Ferreira": "https://images.fotmob.com/image_resources/playerimages/1061249.png",
  "Vitinha": "https://images.fotmob.com/image_resources/playerimages/1061249.png",
  "Kim Min-jae": "https://images.fotmob.com/image_resources/playerimages/1999309.png",
  "Kim Min-Jae": "https://images.fotmob.com/image_resources/playerimages/1999309.png",
  "Antony Matheus": "https://images.fotmob.com/image_resources/playerimages/967622.png",
  "Antony": "https://images.fotmob.com/image_resources/playerimages/967622.png",
  "Richarlison de Andrade": "https://images.fotmob.com/image_resources/playerimages/654908.png",
  "Richarlison": "https://images.fotmob.com/image_resources/playerimages/654908.png",
  "Gabri Veiga": "https://images.fotmob.com/image_resources/playerimages/1116734.png",
  "Gabriel Veiga": "https://images.fotmob.com/image_resources/playerimages/1116734.png",
  "Jorginho Frello": "https://images.fotmob.com/image_resources/playerimages/282775.png",
  "Jorginho": "https://images.fotmob.com/image_resources/playerimages/282775.png",
  "Florentino Luís": "https://images.fotmob.com/image_resources/playerimages/793255.png",
  "Florentino": "https://images.fotmob.com/image_resources/playerimages/793255.png",
  "Lucas Pérez": "https://images.fotmob.com/image_resources/playerimages/194660.png",
  "Pape Matar Sarr": "https://images.fotmob.com/image_resources/playerimages/1107280.png",
  "Pape Sarr": "https://images.fotmob.com/image_resources/playerimages/1107280.png",
  "Tino Livramento": "https://images.fotmob.com/image_resources/playerimages/1107910.png",
  "Valentino Livramento": "https://images.fotmob.com/image_resources/playerimages/1107910.png",
  "Gabriel Magalhães": "https://images.fotmob.com/image_resources/playerimages/795179.png",
  "Gabriel": "https://images.fotmob.com/image_resources/playerimages/795179.png",
  "Norberto Neto": "https://images.fotmob.com/image_resources/playerimages/176186.png",
  "Neto": "https://images.fotmob.com/image_resources/playerimages/176186.png",
  "Lee Kang-in": "https://images.fotmob.com/image_resources/playerimages/940976.png",
  "Kang-In Lee": "https://images.fotmob.com/image_resources/playerimages/940976.png",
  "Eddie Nketiah": "https://images.fotmob.com/image_resources/playerimages/860920.png",
  "Kostas Tsimikas": "https://images.fotmob.com/image_resources/playerimages/671529.png",
  "Konstantinos Tsimikas": "https://images.fotmob.com/image_resources/playerimages/671529.png",
  "Sammie Szmodics": "https://images.fotmob.com/image_resources/playerimages/491827.png",
  "Illia Zabarnyi": "https://images.fotmob.com/image_resources/playerimages/1140003.png",
  "Jens Cajuste": "https://images.fotmob.com/image_resources/playerimages/801120.png",
  "Dan James": "https://images.fotmob.com/image_resources/playerimages/717176.png",
  "Daniel James": "https://images.fotmob.com/image_resources/playerimages/717176.png",
  "Matt O'Riley": "https://images.fotmob.com/image_resources/playerimages/866686.png",
  "Joe Willock": "https://images.fotmob.com/image_resources/playerimages/860975.png",
  "Dan Neil": "https://images.fotmob.com/image_resources/playerimages/982246.png",
  "Dan Ballard": "https://images.fotmob.com/image_resources/playerimages/974268.png",
  "Danilo da Silva": "https://images.fotmob.com/image_resources/playerimages/208077.png",
  "Danilo": "https://images.fotmob.com/image_resources/playerimages/208077.png",
  "Patric Gabarrón": "https://images.fotmob.com/image_resources/playerimages/358149.png",
  "Patric": "https://images.fotmob.com/image_resources/playerimages/358149.png",
  "Junior Adamu": "https://images.fotmob.com/image_resources/playerimages/882163.png",
  "Jordan Siebatcheu": "https://images.fotmob.com/image_resources/playerimages/613714.png",
  "Joe Scally": "https://images.fotmob.com/image_resources/playerimages/959696.png",
  "Michael Murillo": "https://images.fotmob.com/image_resources/playerimages/643635.png",
  "David Pereira da Costa": "https://images.fotmob.com/image_resources/playerimages/1138769.png",
  "Cristian Cásseres Jr": "https://images.fotmob.com/image_resources/playerimages/845943.png",
  "Jubal Rocha": "https://images.fotmob.com/image_resources/playerimages/493731.png",
  "Rome-Jayden Owusu-Oduro": "https://images.fotmob.com/image_resources/playerimages/1321124.png",
  "Vinicius Souza": "https://images.fotmob.com/image_resources/playerimages/1655748.png",
  "İrfan Can Kahveci": "https://images.fotmob.com/image_resources/playerimages/316544.png",
  "Ângelo Gabriel": "https://images.fotmob.com/image_resources/playerimages/1199757.png",
  "Manu Sánchez": "https://images.fotmob.com/image_resources/playerimages/985327.png",
  "Pedro López": "https://images.fotmob.com/image_resources/playerimages/513707.png",
  "Carlos Hernández": "https://images.fotmob.com/image_resources/playerimages/477600.png",
  "Miguelete": "https://images.fotmob.com/image_resources/playerimages/1339434.png",
  "Rubén Martínez": "https://images.fotmob.com/image_resources/playerimages/640281.png",
  "Juanma García": "https://images.fotmob.com/image_resources/playerimages/523387.png",
  "José Calderón": "https://images.fotmob.com/image_resources/playerimages/1227600.png",
  "Kevin Miranda": "https://images.fotmob.com/image_resources/playerimages/1528178.png",
  "Ángel Rodríguez": "https://images.fotmob.com/image_resources/playerimages/41292.png",
  "Dani Ojeda": "https://images.fotmob.com/image_resources/playerimages/791263.png",
  "Sergio Castel": "https://images.fotmob.com/image_resources/playerimages/921819.png",
  "Georgios Kyriakopoulos": "https://images.fotmob.com/image_resources/playerimages/518633.png",
  "Kauã Santos": "https://images.fotmob.com/image_resources/playerimages/1418816.png",
  "Álex Fernández": "https://images.fotmob.com/image_resources/playerimages/213500.png",
  "Isaak Touré": "https://images.fotmob.com/image_resources/playerimages/1180547.png",
  "Milan Đurić": "https://images.fotmob.com/image_resources/playerimages/108381.png",
  "José Luis Palomino": "https://images.fotmob.com/image_resources/playerimages/185625.png",
  // Also correct Luka Modrić in playerPhotoMap
  "Luka Modrić": "https://images.fotmob.com/image_resources/playerimages/31097.png"
};

function checkImage(url) {
  return new Promise(resolve => {
    https.request(url, { method: "HEAD", headers: { "User-Agent": "Mozilla/5.0" } }, res => {
      resolve(res.statusCode === 200);
    }).on("error", () => resolve(false)).end();
  });
}

async function main() {
  console.log("Loading files...");
  const dbPath = path.resolve(__dirname, '../src/data/database.json');
  const publicDbPath = path.resolve(__dirname, '../public/database.json');
  const photoMapPath = path.resolve(__dirname, '../src/data/playerPhotoMap.json');

  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  const photoMap = JSON.parse(fs.readFileSync(photoMapPath, 'utf8'));

  let updatedInDb = 0;

  // 1. Update database.json
  for (const club of db.clubs) {
    for (const p of club.roster || []) {
      if (RESOLVED_MAP[p.name]) {
        p.imageUrl = RESOLVED_MAP[p.name];
        updatedInDb++;
      }
    }
  }

  // 2. Update playerPhotoMap with resolved entries
  for (const [name, url] of Object.entries(RESOLVED_MAP)) {
    photoMap[name] = url;
  }

  // 3. Clean broken entries from playerPhotoMap
  console.log("Cleaning playerPhotoMap of broken entries...");
  const entries = Object.entries(photoMap);
  const validMap = {};

  for (let i = 0; i < entries.length; i += 30) {
    const chunk = entries.slice(i, i + 30);
    const checks = await Promise.all(chunk.map(async ([name, url]) => {
      if (!url || !url.startsWith('http')) return { name, url, ok: false };
      const ok = await checkImage(url);
      return { name, url, ok };
    }));
    for (const c of checks) {
      if (c.ok) {
        validMap[c.name] = c.url;
      } else {
        console.log(`Removed broken photo for: ${c.name} (${c.url})`);
      }
    }
  }

  // Also ensure every player from database.json with a valid photo is in validMap!
  for (const club of db.clubs) {
    for (const p of club.roster || []) {
      if (p.imageUrl && p.imageUrl.startsWith('http') && !p.imageUrl.includes('default_player')) {
        if (!validMap[p.name]) {
          validMap[p.name] = p.imageUrl;
        }
      }
    }
  }

  console.log(`Total valid photoMap entries: ${Object.keys(validMap).length}`);
  console.log(`Updated in database: ${updatedInDb}`);

  // Write files
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
  fs.writeFileSync(publicDbPath, JSON.stringify(db, null, 2), 'utf8');
  fs.writeFileSync(photoMapPath, JSON.stringify(validMap, null, 2), 'utf8');

  console.log("Successfully updated database.json, public/database.json and playerPhotoMap.json!");
}

main().catch(console.error);
