const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, '../src/data/database.json');
const publicDbPath = path.resolve(__dirname, '../public/database.json');
const photoMapPath = path.resolve(__dirname, '../src/data/playerPhotoMap.json');

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
let photoMap = {};
try {
  photoMap = JSON.parse(fs.readFileSync(photoMapPath, 'utf8'));
} catch (e) {
  photoMap = {};
}

// 1. Move the 4 clubs not in the user's 18 to 'other'
const movedClubIds = ['montpellier', 'reims', 'nantes', 'asse'];
db.clubs.forEach(c => {
  if (movedClubIds.includes(c.id)) {
    c.leagueId = 'other';
    c.roster = (c.roster || []).map(p => ({ ...p, leagueId: 'other' }));
  }
});

// 2. Update existing 14 clubs with Spanish localized names & shortNames
const updates = {
  strasbourg: { name: 'RC Estrasburgo', shortName: 'Estrasburgo' },
  om: { name: 'Olympique de Marsella', shortName: 'Marsella' },
  monaco: { name: 'AS Mónaco', shortName: 'Mónaco' },
  nice: { name: 'OGC Niza', shortName: 'Niza' },
  ol: { name: 'Olympique de Lyon', shortName: 'Lyon' }
};

db.clubs.forEach(c => {
  if (updates[c.id]) {
    c.name = updates[c.id].name;
    c.shortName = updates[c.id].shortName;
    c.roster = (c.roster || []).map(p => ({ ...p, team: c.name }));
  }
});

// 3. Define the 4 new clubs
const NEW_CLUBS = [
  {
    id: 'lorient',
    name: 'FC Lorient',
    shortName: 'Lorient',
    leagueId: 'ligue1',
    city: 'Lorient',
    stadium: 'Stade du Moustoir',
    capacity: 18110,
    budget: 42000000,
    wageBudget: 420000,
    primaryColor: '#f47920',
    secondaryColor: '#000000',
    accentColor: '#ffffff',
    textColor: '#ffffff',
    kitPattern: 'plain',
    championsQualified: false,
    badge: 'https://images.fotmob.com/image_resources/logo/teamlogo/8689.png',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/8689.png',
    roster: [
      { id: 'lor_mvogo', name: 'Yvon Mvogo', number: 38, team: 'FC Lorient', leagueId: 'ligue1', kitPattern: 'plain', pos: 'GK', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/274787.png', val: 9, budget: 9, wage: 35, ovr: 77, pac: 76, sho: 78, pas: 72, dri: 78, def: 44, phy: 78, age: 30, nat: 'Suiza', photo: 'https://images.fotmob.com/image_resources/playerimages/274787.png' },
      { id: 'lor_talbi', name: 'Montassar Talbi', number: 3, team: 'FC Lorient', leagueId: 'ligue1', kitPattern: 'plain', pos: 'CB', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/846392.png', val: 10, budget: 10, wage: 30, ovr: 76, pac: 72, sho: 38, pas: 68, dri: 65, def: 77, phy: 80, age: 27, nat: 'Túnez', photo: 'https://images.fotmob.com/image_resources/playerimages/846392.png' },
      { id: 'lor_laporte', name: 'Julien Laporte', number: 15, team: 'FC Lorient', leagueId: 'ligue1', kitPattern: 'plain', pos: 'CB', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/604349.png', val: 7, budget: 7, wage: 28, ovr: 75, pac: 68, sho: 35, pas: 64, dri: 60, def: 76, phy: 78, age: 31, nat: 'Francia', photo: 'https://images.fotmob.com/image_resources/playerimages/604349.png' },
      { id: 'lor_fmendy', name: 'Formose Mendy', number: 13, team: 'FC Lorient', leagueId: 'ligue1', kitPattern: 'plain', pos: 'CB', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/1053675.png', val: 9, budget: 9, wage: 25, ovr: 75, pac: 76, sho: 40, pas: 65, dri: 64, def: 75, phy: 82, age: 24, nat: 'Senegal', photo: 'https://images.fotmob.com/image_resources/playerimages/1053675.png' },
      { id: 'lor_kalulu', name: 'Gédéon Kalulu', number: 24, team: 'FC Lorient', leagueId: 'ligue1', kitPattern: 'plain', pos: 'RB', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/1022309.png', val: 7, budget: 7, wage: 24, ovr: 74, pac: 84, sho: 55, pas: 68, dri: 73, def: 73, phy: 75, age: 27, nat: 'RD del Congo', photo: 'https://images.fotmob.com/image_resources/playerimages/1022309.png' },
      { id: 'lor_bmendy', name: 'Benjamin Mendy', number: 22, team: 'FC Lorient', leagueId: 'ligue1', kitPattern: 'plain', pos: 'LB', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/280965.png', val: 7, budget: 7, wage: 35, ovr: 75, pac: 75, sho: 68, pas: 76, dri: 75, def: 72, phy: 78, age: 30, nat: 'Francia', photo: 'https://images.fotmob.com/image_resources/playerimages/280965.png' },
      { id: 'lor_abergel', name: 'Laurent Abergel', number: 6, team: 'FC Lorient', leagueId: 'ligue1', kitPattern: 'plain', pos: 'CDM', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/413525.png', val: 8, budget: 8, wage: 32, ovr: 76, pac: 72, sho: 64, pas: 77, dri: 75, def: 78, phy: 80, age: 32, nat: 'Francia', photo: 'https://images.fotmob.com/image_resources/playerimages/413525.png' },
      { id: 'lor_katseris', name: 'Panos Katseris', number: 77, team: 'FC Lorient', leagueId: 'ligue1', kitPattern: 'plain', pos: 'RM', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/1427808.png', val: 8, budget: 8, wage: 22, ovr: 74, pac: 85, sho: 64, pas: 71, dri: 76, def: 68, phy: 72, age: 23, nat: 'Grecia', photo: 'https://images.fotmob.com/image_resources/playerimages/1427808.png' },
      { id: 'lor_ponceau', name: 'Julien Ponceau', number: 10, team: 'FC Lorient', leagueId: 'ligue1', kitPattern: 'plain', pos: 'CM', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/955206.png', val: 10, budget: 10, wage: 28, ovr: 75, pac: 77, sho: 70, pas: 78, dri: 78, def: 66, phy: 70, age: 24, nat: 'Francia', photo: 'https://images.fotmob.com/image_resources/playerimages/955206.png' },
      { id: 'lor_pagis', name: 'Pablo Pagis', number: 27, team: 'FC Lorient', leagueId: 'ligue1', kitPattern: 'plain', pos: 'CAM', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/1331097.png', val: 9, budget: 9, wage: 22, ovr: 74, pac: 78, sho: 72, pas: 76, dri: 77, def: 45, phy: 68, age: 22, nat: 'Francia', photo: 'https://images.fotmob.com/image_resources/playerimages/1331097.png' },
      { id: 'lor_kroupi', name: 'Junior Kroupi', number: 22, team: 'FC Lorient', leagueId: 'ligue1', kitPattern: 'plain', pos: 'ST', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/1460534.png', val: 12, budget: 12, wage: 25, ovr: 75, pac: 83, sho: 76, pas: 72, dri: 79, def: 35, phy: 68, age: 19, nat: 'Francia', photo: 'https://images.fotmob.com/image_resources/playerimages/1460534.png' },
      { id: 'lor_bamba', name: 'Mohamed Bamba', number: 9, team: 'FC Lorient', leagueId: 'ligue1', kitPattern: 'plain', pos: 'ST', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/1202239.png', val: 12, budget: 12, wage: 30, ovr: 76, pac: 84, sho: 78, pas: 65, dri: 76, def: 35, phy: 78, age: 23, nat: 'Costa de Marfil', photo: 'https://images.fotmob.com/image_resources/playerimages/1202239.png' },
      { id: 'lor_tosin', name: 'Aiyegun Tosin', number: 11, team: 'FC Lorient', leagueId: 'ligue1', kitPattern: 'plain', pos: 'ST', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/841395.png', val: 8, budget: 8, wage: 24, ovr: 74, pac: 86, sho: 74, pas: 66, dri: 75, def: 38, phy: 74, age: 26, nat: 'Benín', photo: 'https://images.fotmob.com/image_resources/playerimages/841395.png' }
    ]
  },
  {
    id: 'parisfc',
    name: 'Paris FC',
    shortName: 'Paris FC',
    leagueId: 'ligue1',
    city: 'París',
    stadium: 'Stade Charléty',
    capacity: 20000,
    budget: 50000000,
    wageBudget: 500000,
    primaryColor: '#002f6c',
    secondaryColor: '#ffffff',
    accentColor: '#e30613',
    textColor: '#ffffff',
    kitPattern: 'plain',
    championsQualified: false,
    badge: 'https://images.fotmob.com/image_resources/logo/teamlogo/6379.png',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/6379.png',
    roster: [
      { id: 'pfc_nkambadio', name: 'Obed Nkambadio', number: 16, team: 'Paris FC', leagueId: 'ligue1', kitPattern: 'plain', pos: 'GK', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/1127125.png', val: 10, budget: 10, wage: 28, ovr: 75, pac: 74, sho: 76, pas: 71, dri: 75, def: 42, phy: 76, age: 22, nat: 'Francia', photo: 'https://images.fotmob.com/image_resources/playerimages/1127125.png' },
      { id: 'pfc_kolo', name: 'Timothée Kolodziejczak', number: 5, team: 'Paris FC', leagueId: 'ligue1', kitPattern: 'plain', pos: 'CB', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/150869.png', val: 6, budget: 6, wage: 35, ovr: 75, pac: 68, sho: 45, pas: 72, dri: 66, def: 76, phy: 78, age: 33, nat: 'Francia', photo: 'https://images.fotmob.com/image_resources/playerimages/150869.png' },
      { id: 'pfc_chergui', name: 'Samir Chergui', number: 2, team: 'Paris FC', leagueId: 'ligue1', kitPattern: 'plain', pos: 'CB', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/1039219.png', val: 8, budget: 8, wage: 25, ovr: 74, pac: 73, sho: 38, pas: 65, dri: 64, def: 75, phy: 80, age: 26, nat: 'Argelia', photo: 'https://images.fotmob.com/image_resources/playerimages/1039219.png' },
      { id: 'pfc_ollila', name: 'Tuomas Ollila', number: 15, team: 'Paris FC', leagueId: 'ligue1', kitPattern: 'plain', pos: 'LB', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/965666.png', val: 7, budget: 7, wage: 24, ovr: 74, pac: 82, sho: 60, pas: 71, dri: 73, def: 72, phy: 74, age: 25, nat: 'Finlandia', photo: 'https://images.fotmob.com/image_resources/playerimages/965666.png' },
      { id: 'pfc_tourraine', name: 'Mathys Tourraine', number: 22, team: 'Paris FC', leagueId: 'ligue1', kitPattern: 'plain', pos: 'RB', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/1438302.png', val: 8, budget: 8, wage: 24, ovr: 74, pac: 83, sho: 54, pas: 70, dri: 74, def: 73, phy: 74, age: 24, nat: 'Marruecos', photo: 'https://images.fotmob.com/image_resources/playerimages/1438302.png' },
      { id: 'pfc_lopez', name: 'Maxime Lopez', number: 21, team: 'Paris FC', leagueId: 'ligue1', kitPattern: 'plain', pos: 'CM', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/614207.png', val: 18, budget: 18, wage: 55, ovr: 78, pac: 74, sho: 72, pas: 84, dri: 82, def: 72, phy: 68, age: 27, nat: 'Francia', photo: 'https://images.fotmob.com/image_resources/playerimages/614207.png' },
      { id: 'pfc_camara', name: 'Adama Camara', number: 6, team: 'Paris FC', leagueId: 'ligue1', kitPattern: 'plain', pos: 'CM', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/1513317.png', val: 7, budget: 7, wage: 25, ovr: 74, pac: 72, sho: 65, pas: 74, dri: 74, def: 75, phy: 78, age: 28, nat: 'Francia', photo: 'https://images.fotmob.com/image_resources/playerimages/1513317.png' },
      { id: 'pfc_marchetti', name: 'Vincent Marchetti', number: 8, team: 'Paris FC', leagueId: 'ligue1', kitPattern: 'plain', pos: 'CM', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/640292.png', val: 7, budget: 7, wage: 25, ovr: 74, pac: 72, sho: 68, pas: 76, dri: 75, def: 72, phy: 73, age: 28, nat: 'Francia', photo: 'https://images.fotmob.com/image_resources/playerimages/640292.png' },
      { id: 'pfc_kebbal', name: 'Ilan Kebbal', number: 10, team: 'Paris FC', leagueId: 'ligue1', kitPattern: 'plain', pos: 'CAM', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/999690.png', val: 14, budget: 14, wage: 38, ovr: 77, pac: 82, sho: 75, pas: 80, dri: 84, def: 48, phy: 64, age: 27, nat: 'Argelia', photo: 'https://images.fotmob.com/image_resources/playerimages/999690.png' },
      { id: 'pfc_gory', name: 'Alimami Gory', number: 11, team: 'Paris FC', leagueId: 'ligue1', kitPattern: 'plain', pos: 'LW', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/765158.png', val: 7, budget: 7, wage: 25, ovr: 74, pac: 85, sho: 73, pas: 68, dri: 76, def: 40, phy: 72, age: 28, nat: 'Francia', photo: 'https://images.fotmob.com/image_resources/playerimages/765158.png' },
      { id: 'pfc_krasso', name: 'Jean-Philippe Krasso', number: 17, team: 'Paris FC', leagueId: 'ligue1', kitPattern: 'plain', pos: 'ST', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/853108.png', val: 12, budget: 12, wage: 36, ovr: 76, pac: 80, sho: 78, pas: 73, dri: 78, def: 42, phy: 80, age: 27, nat: 'Costa de Marfil', photo: 'https://images.fotmob.com/image_resources/playerimages/853108.png' },
      { id: 'pfc_hamel', name: 'Pierre-Yves Hamel', number: 29, team: 'Paris FC', leagueId: 'ligue1', kitPattern: 'plain', pos: 'ST', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/690119.png', val: 6, budget: 6, wage: 25, ovr: 74, pac: 74, sho: 75, pas: 68, dri: 72, def: 40, phy: 76, age: 31, nat: 'Francia', photo: 'https://images.fotmob.com/image_resources/playerimages/690119.png' }
    ]
  },
  {
    id: 'troyes',
    name: 'ESTAC Troyes',
    shortName: 'Troyes',
    leagueId: 'ligue1',
    city: 'Troyes',
    stadium: "Stade de l'Aube",
    capacity: 20400,
    budget: 32000000,
    wageBudget: 350000,
    primaryColor: '#004b9b',
    secondaryColor: '#ffffff',
    accentColor: '#e2001a',
    textColor: '#ffffff',
    kitPattern: 'plain',
    championsQualified: false,
    badge: 'https://images.fotmob.com/image_resources/logo/teamlogo/10242.png',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/10242.png',
    roster: [
      { id: 'tro_lemaitre', name: 'Nicolas Lemaître', number: 1, team: 'ESTAC Troyes', leagueId: 'ligue1', kitPattern: 'plain', pos: 'GK', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/625422.png', val: 6, budget: 6, wage: 22, ovr: 74, pac: 73, sho: 75, pas: 70, dri: 73, def: 40, phy: 74, age: 28, nat: 'Francia', photo: 'https://images.fotmob.com/image_resources/playerimages/625422.png' },
      { id: 'tro_monfray', name: 'Adrien Monfray', number: 4, team: 'ESTAC Troyes', leagueId: 'ligue1', kitPattern: 'plain', pos: 'CB', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/465719.png', val: 5, budget: 5, wage: 25, ovr: 74, pac: 66, sho: 36, pas: 64, dri: 60, def: 76, phy: 79, age: 34, nat: 'Francia', photo: 'https://images.fotmob.com/image_resources/playerimages/465719.png' },
      { id: 'tro_boura', name: 'Ismaël Boura', number: 12, team: 'ESTAC Troyes', leagueId: 'ligue1', kitPattern: 'plain', pos: 'LB', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/1177359.png', val: 8, budget: 8, wage: 22, ovr: 74, pac: 84, sho: 58, pas: 70, dri: 74, def: 72, phy: 73, age: 24, nat: 'Comoras', photo: 'https://images.fotmob.com/image_resources/playerimages/1177359.png' },
      { id: 'tro_mendes', name: 'Houboulang Mendes', number: 2, team: 'ESTAC Troyes', leagueId: 'ligue1', kitPattern: 'plain', pos: 'RB', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/764841.png', val: 7, budget: 7, wage: 24, ovr: 74, pac: 82, sho: 50, pas: 67, dri: 72, def: 73, phy: 77, age: 27, nat: 'Guinea-Bisáu', photo: 'https://images.fotmob.com/image_resources/playerimages/764841.png' },
      { id: 'tro_chavalerin', name: 'Xavier Chavalerin', number: 24, team: 'ESTAC Troyes', leagueId: 'ligue1', kitPattern: 'plain', pos: 'CM', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/354479.png', val: 6, budget: 6, wage: 30, ovr: 75, pac: 70, sho: 72, pas: 79, dri: 76, def: 74, phy: 75, age: 34, nat: 'Francia', photo: 'https://images.fotmob.com/image_resources/playerimages/354479.png' },
      { id: 'tro_diop', name: 'Mouhamed Diop', number: 8, team: 'ESTAC Troyes', leagueId: 'ligue1', kitPattern: 'plain', pos: 'CM', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/1321149.png', val: 8, budget: 8, wage: 22, ovr: 74, pac: 75, sho: 68, pas: 74, dri: 75, def: 72, phy: 76, age: 24, nat: 'Senegal', photo: 'https://images.fotmob.com/image_resources/playerimages/1321149.png' },
      { id: 'tro_mchangama', name: "Youssouf M'Changama", number: 10, team: 'ESTAC Troyes', leagueId: 'ligue1', kitPattern: 'plain', pos: 'CAM', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/308824.png', val: 6, budget: 6, wage: 28, ovr: 75, pac: 72, sho: 76, pas: 80, dri: 77, def: 55, phy: 70, age: 34, nat: 'Comoras', photo: 'https://images.fotmob.com/image_resources/playerimages/308824.png' },
      { id: 'tro_irie', name: 'Cyriaque Irié', number: 7, team: 'ESTAC Troyes', leagueId: 'ligue1', kitPattern: 'plain', pos: 'RW', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/1526221.png', val: 8, budget: 8, wage: 18, ovr: 73, pac: 86, sho: 70, pas: 68, dri: 77, def: 38, phy: 70, age: 20, nat: 'Costa de Marfil', photo: 'https://images.fotmob.com/image_resources/playerimages/1526221.png' },
      { id: 'tro_ripart', name: 'Renaud Ripart', number: 20, team: 'ESTAC Troyes', leagueId: 'ligue1', kitPattern: 'plain', pos: 'ST', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/348420.png', val: 6, budget: 6, wage: 26, ovr: 74, pac: 74, sho: 75, pas: 72, dri: 74, def: 60, phy: 78, age: 32, nat: 'Francia', photo: 'https://images.fotmob.com/image_resources/playerimages/348420.png' },
      { id: 'tro_dong', name: 'Kyliane Dong', number: 17, team: 'ESTAC Troyes', leagueId: 'ligue1', kitPattern: 'plain', pos: 'LW', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/1393660.png', val: 7, budget: 7, wage: 18, ovr: 73, pac: 85, sho: 69, pas: 67, dri: 76, def: 35, phy: 66, age: 20, nat: 'Francia', photo: 'https://images.fotmob.com/image_resources/playerimages/1393660.png' },
      { id: 'tro_bentayeb', name: 'Tawfik Bentayeb', number: 9, team: 'ESTAC Troyes', leagueId: 'ligue1', kitPattern: 'plain', pos: 'ST', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/1436306.png', val: 7, budget: 7, wage: 20, ovr: 73, pac: 78, sho: 74, pas: 62, dri: 73, def: 35, phy: 75, age: 23, nat: 'Marruecos', photo: 'https://images.fotmob.com/image_resources/playerimages/1436306.png' },
      { id: 'tro_nshimi', name: 'Jospin Nshimirimana', number: 19, team: 'ESTAC Troyes', leagueId: 'ligue1', kitPattern: 'plain', pos: 'ST', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/1140885.png', val: 5, budget: 5, wage: 18, ovr: 72, pac: 77, sho: 72, pas: 64, dri: 72, def: 42, phy: 76, age: 23, nat: 'Burundi', photo: 'https://images.fotmob.com/image_resources/playerimages/1140885.png' }
    ]
  },
  {
    id: 'lemans',
    name: 'Le Mans FC',
    shortName: 'Le Mans',
    leagueId: 'ligue1',
    city: 'Le Mans',
    stadium: 'Stade Marie-Marvingt',
    capacity: 25064,
    budget: 28000000,
    wageBudget: 300000,
    primaryColor: '#c8102e',
    secondaryColor: '#fcd116',
    accentColor: '#000000',
    textColor: '#ffffff',
    kitPattern: 'stripes',
    championsQualified: false,
    badge: 'https://images.fotmob.com/image_resources/logo/teamlogo/8682.png',
    badgeUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/8682.png',
    roster: [
      { id: 'lem_kocik', name: 'Nicolas Kocik', number: 1, team: 'Le Mans FC', leagueId: 'ligue1', kitPattern: 'stripes', pos: 'GK', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/722531.png', val: 5, budget: 5, wage: 20, ovr: 73, pac: 72, sho: 74, pas: 68, dri: 72, def: 40, phy: 73, age: 27, nat: 'Francia', photo: 'https://images.fotmob.com/image_resources/playerimages/722531.png' },
      { id: 'lem_voyer', name: 'Harold Voyer', number: 4, team: 'Le Mans FC', leagueId: 'ligue1', kitPattern: 'stripes', pos: 'CB', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/1311670.png', val: 5, budget: 5, wage: 20, ovr: 73, pac: 68, sho: 34, pas: 62, dri: 58, def: 74, phy: 78, age: 28, nat: 'Francia', photo: 'https://images.fotmob.com/image_resources/playerimages/1311670.png' },
      { id: 'lem_lauray', name: 'Alexandre Lauray', number: 5, team: 'Le Mans FC', leagueId: 'ligue1', kitPattern: 'stripes', pos: 'CB', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/1039807.png', val: 5, budget: 5, wage: 20, ovr: 73, pac: 70, sho: 35, pas: 64, dri: 60, def: 74, phy: 79, age: 28, nat: 'Francia', photo: 'https://images.fotmob.com/image_resources/playerimages/1039807.png' },
      { id: 'lem_yohou', name: 'Samuel Yohou', number: 24, team: 'Le Mans FC', leagueId: 'ligue1', kitPattern: 'stripes', pos: 'CB', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/660565.png', val: 4, budget: 4, wage: 22, ovr: 73, pac: 65, sho: 36, pas: 60, dri: 57, def: 74, phy: 82, age: 33, nat: 'Costa de Marfil', photo: 'https://images.fotmob.com/image_resources/playerimages/660565.png' },
      { id: 'lem_ribelin', name: 'Anthony Ribelin', number: 7, team: 'Le Mans FC', leagueId: 'ligue1', kitPattern: 'stripes', pos: 'RB', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/564859.png', val: 5, budget: 5, wage: 20, ovr: 73, pac: 81, sho: 62, pas: 69, dri: 74, def: 71, phy: 72, age: 29, nat: 'Francia', photo: 'https://images.fotmob.com/image_resources/playerimages/564859.png' },
      { id: 'lem_vincent', name: 'Alexandre Vincent', number: 10, team: 'Le Mans FC', leagueId: 'ligue1', kitPattern: 'stripes', pos: 'LB', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/575732.png', val: 5, budget: 5, wage: 22, ovr: 73, pac: 79, sho: 64, pas: 71, dri: 74, def: 70, phy: 72, age: 31, nat: 'Francia', photo: 'https://images.fotmob.com/image_resources/playerimages/575732.png' },
      { id: 'lem_quarshie', name: 'Edwin Quarshie', number: 6, team: 'Le Mans FC', leagueId: 'ligue1', kitPattern: 'stripes', pos: 'CDM', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/956661.png', val: 5, budget: 5, wage: 20, ovr: 73, pac: 70, sho: 60, pas: 72, dri: 71, def: 75, phy: 78, age: 29, nat: 'Francia', photo: 'https://images.fotmob.com/image_resources/playerimages/956661.png' },
      { id: 'lem_rossignol', name: 'Martin Rossignol', number: 8, team: 'Le Mans FC', leagueId: 'ligue1', kitPattern: 'stripes', pos: 'CM', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/1367269.png', val: 6, budget: 6, wage: 18, ovr: 72, pac: 74, sho: 64, pas: 74, dri: 75, def: 68, phy: 70, age: 21, nat: 'Francia', photo: 'https://images.fotmob.com/image_resources/playerimages/1367269.png' },
      { id: 'lem_colas', name: 'Erwan Colas', number: 11, team: 'Le Mans FC', leagueId: 'ligue1', kitPattern: 'stripes', pos: 'LW', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/1438609.png', val: 5, budget: 5, wage: 20, ovr: 73, pac: 83, sho: 71, pas: 68, dri: 75, def: 40, phy: 70, age: 27, nat: 'Francia', photo: 'https://images.fotmob.com/image_resources/playerimages/1438609.png' },
      { id: 'lem_rabillard', name: 'Antoine Rabillard', number: 9, team: 'Le Mans FC', leagueId: 'ligue1', kitPattern: 'stripes', pos: 'ST', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/717270.png', val: 5, budget: 5, wage: 20, ovr: 73, pac: 75, sho: 74, pas: 64, dri: 72, def: 38, phy: 76, age: 29, nat: 'Francia', photo: 'https://images.fotmob.com/image_resources/playerimages/717270.png' },
      { id: 'lem_gueye', name: 'Dame Gueye', number: 19, team: 'Le Mans FC', leagueId: 'ligue1', kitPattern: 'stripes', pos: 'ST', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/725256.png', val: 5, budget: 5, wage: 20, ovr: 73, pac: 77, sho: 74, pas: 62, dri: 71, def: 35, phy: 78, age: 29, nat: 'Senegal', photo: 'https://images.fotmob.com/image_resources/playerimages/725256.png' },
      { id: 'lem_vula', name: 'Arnold Vula', number: 29, team: 'Le Mans FC', leagueId: 'ligue1', kitPattern: 'stripes', pos: 'ST', imageUrl: 'https://images.fotmob.com/image_resources/playerimages/1552558.png', val: 5, budget: 5, wage: 18, ovr: 72, pac: 76, sho: 73, pas: 60, dri: 70, def: 36, phy: 77, age: 25, nat: 'RD del Congo', photo: 'https://images.fotmob.com/image_resources/playerimages/1552558.png' }
    ]
  }
];

// Add each new club (avoiding duplicates if re-run)
NEW_CLUBS.forEach(nc => {
  const existingIdx = db.clubs.findIndex(c => c.id === nc.id);
  if (existingIdx !== -1) {
    db.clubs[existingIdx] = nc;
  } else {
    db.clubs.push(nc);
  }

  // Update photo map
  (nc.roster || []).forEach(p => {
    if (p.photo && !p.photo.includes('default_player')) {
      photoMap[p.name] = p.photo;
    }
  });
});

// Write to files
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
fs.writeFileSync(publicDbPath, JSON.stringify(db, null, 2), 'utf8');
fs.writeFileSync(photoMapPath, JSON.stringify(photoMap, null, 2), 'utf8');

const distDbPath = path.resolve(__dirname, '../dist/database.json');
if (fs.existsSync(distDbPath)) {
  fs.writeFileSync(distDbPath, JSON.stringify(db, null, 2), 'utf8');
}

console.log('Successfully updated database with Ligue 1 clubs!');
const ligue1Clubs = db.clubs.filter(c => c.leagueId === 'ligue1');
console.log('Total Ligue 1 clubs count:', ligue1Clubs.length);
ligue1Clubs.forEach((c, idx) => console.log(`${idx + 1}. [${c.id}] ${c.name} (${c.shortName}) - ${c.roster.length} players`));
