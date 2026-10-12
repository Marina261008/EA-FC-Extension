const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../src/data/database.json');
const publicDbPath = path.join(__dirname, '../public/database.json');
const mockDataPath = path.join(__dirname, '../src/mockData.js');

async function searchFotmobPlayer(name) {
  const cleanName = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  const searchTerms = [
    name,
    cleanName,
    cleanName.split(' ').slice(-1)[0], // last name
    cleanName.split(' ')[0] // first name
  ];

  for (const term of searchTerms) {
    if (!term || term.length < 3) continue;
    try {
      const res = await fetch(`https://apigw.fotmob.com/searchapi/suggest?term=${encodeURIComponent(term)}`);
      if (!res.ok) continue;
      const data = await res.json();
      const options = data.squadMemberSuggest?.[0]?.options || [];
      if (options.length > 0) {
        // Find best match
        const exact = options.find(o => o.text.toLowerCase().includes(cleanName.toLowerCase()));
        const picked = exact || options[0];
        if (picked?.payload?.id) {
          return {
            id: picked.payload.id,
            url: `https://images.fotmob.com/image_resources/playerimages/${picked.payload.id}.png`,
            matchedName: picked.text
          };
        }
      }
    } catch (e) {
      // ignore and continue
    }
  }
  return null;
}

async function run() {
  console.log("Reading database.json...");
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

  let totalPlayers = 0;
  let resolvedCount = 0;

  // Cache to avoid duplicate searches
  const cache = {};

  // Process with concurrency of 8
  const allPlayers = [];
  for (const club of db.clubs) {
    if (club.roster) {
      for (const player of club.roster) {
        allPlayers.push(player);
      }
    }
  }

  console.log(`Processing ${allPlayers.length} players with batch concurrency...`);

  const BATCH_SIZE = 8;
  for (let i = 0; i < allPlayers.length; i += BATCH_SIZE) {
    const batch = allPlayers.slice(i, i + BATCH_SIZE);
    await Promise.all(batch.map(async (player) => {
      totalPlayers++;
      const pName = player.name;
      if (!cache[pName]) {
        const found = await searchFotmobPlayer(pName);
        if (found) {
          cache[pName] = found.url;
          resolvedCount++;
        } else {
          cache[pName] = player.imageUrl;
        }
      }
      if (cache[pName]) {
        player.imageUrl = cache[pName];
      }
    }));
    if (i % 80 === 0) {
      console.log(`Progress: ${i} / ${allPlayers.length} players processed...`);
    }
  }

  console.log(`Resolved real photos for ${resolvedCount} / ${totalPlayers} players!`);

  // Write updated database.json
  const formattedJson = JSON.stringify(db, null, 2);
  fs.writeFileSync(dbPath, formattedJson, 'utf8');
  fs.writeFileSync(publicDbPath, formattedJson, 'utf8');
  console.log("Updated src/data/database.json and public/database.json!");

  // Also write playerPhotoMap.json so the app can lookup any player instantly
  const photoMapPath = path.join(__dirname, '../src/data/playerPhotoMap.json');
  fs.writeFileSync(photoMapPath, JSON.stringify(cache, null, 2), 'utf8');
  console.log("Saved player photo mapping to src/data/playerPhotoMap.json!");
}

run().catch(console.error);
