import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CareerBanner from './components/CareerBanner';
import NavTabs from './components/NavTabs';
import SeasonSidebar from './components/SeasonSidebar';

// Subtab views
import OverviewTab from './components/Dashboard/OverviewTab';
import MatchesTab from './components/Matches/MatchesTab';
import StandingsTab from './components/Standings/StandingsTab';
import SquadTab from './components/Squad/SquadTab';
import TransfersTab from './components/Transfers/TransfersTab';
import YouthTab from './components/Youth/YouthTab';
import MomentsTab from './components/Moments/MomentsTab';
import StatsTab from './components/Stats/StatsTab';
import RulesObjectivesTab from './components/RulesObjectives/RulesObjectivesTab';

import PresentationTab from './components/Presentation/PresentationTab';
import MyCareerTab from './components/MyCareer/MyCareerTab';
import CommunityTab from './components/Community/CommunityTab';
import SettingsTab from './components/Settings/SettingsTab';
import DatabaseView from './components/Database/DatabaseView';
import { convertRosterPlayerToSquad, getClubRoster, getClubLogo } from './clubsData';

// Modals
import MatchModal from './components/Matches/MatchModal';
import PlayerModal from './components/Squad/PlayerModal';
import TransferModal from './components/Transfers/TransferModal';
import YouthModal from './components/Youth/YouthModal';
import MomentModal from './components/Moments/MomentModal';
import CareerCreationWizard from './components/Modals/CareerCreationWizard';
import EditManagerModal from './components/Modals/EditManagerModal';
import CalendarModal from './components/Modals/CalendarModal';
import TrophyModal from './components/Modals/TrophyModal';
import AIAssistantModal from './components/AI/AIAssistantModal';
import OnboardingModal from './components/Modals/OnboardingModal';
import LoadingScreen from './components/LoadingScreen';
import CareerSelectorHub from './components/CareerHub/CareerSelectorHub';
import { Sparkles } from 'lucide-react';

import EditPostModal from './components/Feed/EditPostModal';
import NewPostModal from './components/Feed/NewPostModal';
import { 
  createManagerPost, 
  createSigningPost, 
  createOriginFarewellPost,
  createSalePost, 
  createMatchPost, 
  createLineupPost,
  createGoalPost,
  createYouthPost,
  createTrophyPost,
  createRenewalPost,
  generateContextualComments
} from './postGenerator';
import { formatToFullEuros, parsePlayerValueInEuros } from './utils/formatters';

import { 
  loadCareers, 
  saveCareers, 
  getActiveCareerId, 
  setActiveCareerId, 
  getActiveSeasonId, 
  setActiveSeasonId, 
  resetToDefaults,
  hasSavedCareers,
  getUserProfile,
  saveUserProfile,
  buildFreshCareer
} from './storage';

export default function App() {
  const [careers, setCareers] = useState(() => loadCareers());
  const [activeCareerId, setActiveCareerIdState] = useState(() => getActiveCareerId(careers));
  const [activeTab, setActiveTab] = useState('seasons'); // 'presentation' | 'seasons' | 'mycareer' | 'community' | 'settings' | 'database'
  const [activeSubTab, setActiveSubTab] = useState('overview'); // 'overview' | 'matches' | 'calendar' | 'standings' | 'squad' | 'transfers' | 'youth' | 'moments' | 'privacy' | 'stats' | 'rules'

  // Loading Screen & Career Selector Hub states
  const [isLoadingScreen, setIsLoadingScreen] = useState(true);
  const [loadingCareer, setLoadingCareer] = useState(null);
  const [isInCareerHub, setIsInCareerHub] = useState(true);
  const [careerToEdit, setCareerToEdit] = useState(null);

  // Onboarding & Creator Profile state
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [creatorProfile, setCreatorProfile] = useState(() => getUserProfile() || null);

  // Modal open states
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const [playerToEdit, setPlayerToEdit] = useState(null);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferDefaultType, setTransferDefaultType] = useState('in');
  const [isYouthModalOpen, setIsYouthModalOpen] = useState(false);
  const [isMomentModalOpen, setIsMomentModalOpen] = useState(false);
  const [isNewCareerModalOpen, setIsNewCareerModalOpen] = useState(false);
  const [isEditManagerModalOpen, setIsEditManagerModalOpen] = useState(false);
  const [isEditPostModalOpen, setIsEditPostModalOpen] = useState(false);
  const [postToEdit, setPostToEdit] = useState(null);
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [newPostModalMode, setNewPostModalMode] = useState('lineup');
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isTrophyModalOpen, setIsTrophyModalOpen] = useState(false);
  const [trophyModalInitialComp, setTrophyModalInitialComp] = useState('');

  const handleOpenTrophyModal = (compName = '') => {
    setTrophyModalInitialComp(compName || '');
    setIsTrophyModalOpen(true);
  };

  const handleOpenNewPostModal = (mode = 'lineup') => {
    setNewPostModalMode(mode);
    setIsNewPostModalOpen(true);
  };

  // Active career & season resolution
  const activeCareer = careers.find(c => c.id === activeCareerId) || careers[0];
  const activeSeasonId = getActiveSeasonId(activeCareer);
  const activeSeason = activeCareer.seasons.find(s => s.id === activeSeasonId) || activeCareer.seasons[0];

  // Save to localStorage whenever careers update (if user has active saved data or finished onboarding)
  useEffect(() => {
    if (hasSavedCareers() || !isOnboardingOpen) {
      saveCareers(careers);
    }
  }, [careers, isOnboardingOpen]);

  // Complete onboarding for new users / first-time visitors
  const handleCompleteOnboarding = ({ managerName, clubName, clubId, clubLogo, league, gameVersion, nationality }) => {
    const freshCareer = buildFreshCareer({
      managerName,
      clubName,
      clubId,
      clubLogo,
      league,
      gameVersion,
      nationality
    });

    const profile = { name: managerName };
    saveUserProfile(profile);
    setCreatorProfile(profile);

    saveCareers([freshCareer]);
    setCareers([freshCareer]);
    setActiveCareerIdState(freshCareer.id);
    setActiveCareerId(freshCareer.id);
    setIsOnboardingOpen(false);
  };

  // Update creator profile
  const handleUpdateCreatorProfile = (updates) => {
    const updated = { ...(creatorProfile || {}), ...updates };
    setCreatorProfile(updated);
    saveUserProfile(updated);
  };

  const handleLoadingFinish = () => {
    setIsLoadingScreen(false);
    if (loadingCareer) {
      setIsInCareerHub(false);
      setLoadingCareer(null);
    }
  };

  // Select another career
  const handleSelectCareer = (careerId) => {
    const target = careers.find(c => c.id === careerId) || activeCareer;
    setActiveCareerIdState(careerId);
    setActiveCareerId(careerId);
    setLoadingCareer(target);
    setIsLoadingScreen(true);
  };

  // Career Hub interaction handlers
  const handleSelectCareerFromHub = (careerId) => {
    const target = careers.find(c => c.id === careerId) || activeCareer;
    setActiveCareerIdState(careerId);
    setActiveCareerId(careerId);
    setLoadingCareer(target);
    setIsLoadingScreen(true);
  };

  const handleEditCareerFromHub = (career) => {
    setCareerToEdit(career);
    setIsEditManagerModalOpen(true);
  };

  const handleDeleteCareer = (careerIdToDelete) => {
    const updatedCareers = careers.filter(c => c.id !== careerIdToDelete);
    if (updatedCareers.length === 0) {
      const fresh = buildFreshCareer();
      setCareers([fresh]);
      setActiveCareerIdState(fresh.id);
      setActiveCareerId(fresh.id);
      saveCareers([fresh]);
    } else {
      setCareers(updatedCareers);
      saveCareers(updatedCareers);
      if (activeCareerId === careerIdToDelete) {
        setActiveCareerIdState(updatedCareers[0].id);
        setActiveCareerId(updatedCareers[0].id);
      }
    }
  };

  // Select another season inside active career
  const handleSelectSeason = (seasonId) => {
    setActiveSeasonId(activeCareer.id, seasonId);
    // Force re-render with updated season selection
    setCareers([...careers]);
  };

  // Toggle or switch Game Version (EA FC 26 vs EA FC 27)
  const handleGameVersionToggle = (version) => {
    // If a career with this version exists, switch to it, or update current career
    const matching = careers.find(c => c.gameVersion === version);
    if (matching) {
      handleSelectCareer(matching.id);
    } else {
      const updated = careers.map(c => {
        if (c.id === activeCareer.id) {
          return { ...c, gameVersion: version };
        }
        return c;
      });
      setCareers(updated);
    }
  };

  // Open Calendar Modal to view and advance in-game date
  const handleAdvanceDate = () => {
    setIsCalendarModalOpen(true);
  };

  // Save new in-game date from Calendar Modal with optional news publication
  const handleSaveCalendarDate = (newDateStr, { publishPost = false, daysAdvanced = 0 } = {}) => {
    if (!newDateStr || !newDateStr.trim()) return;
    const cleanDate = newDateStr.trim();

    let optionalNewPost = null;
    if (publishPost && daysAdvanced > 0) {
      optionalNewPost = {
        id: `post-cal-${Date.now()}`,
        author: activeCareer.manager.name,
        authorRole: "Entrenador",
        authorAvatar: activeCareer.manager.avatar,
        club: activeCareer.manager.club,
        clubLogo: activeCareer.manager.clubLogo,
        timeAgo: "Ahora",
        date: cleanDate,
        title: `🗓️ Calendario de Carrera: Avance al ${cleanDate}`,
        content: `El ${activeCareer.manager.club} avanza en la temporada hacia el ${cleanDate} (+${daysAdvanced} días transcurridos). El cuerpo técnico y la plantilla continúan trabajando al máximo nivel de cara a los próximos compromisos oficiales.`,
        tag: "Calendario",
        likes: Math.floor(Math.random() * 400) + 850,
        commentsCount: 4,
        comments: generateContextualComments('calendar', activeCareer.manager.club, activeCareer.manager.name, {
          daysAdvanced,
          newDate: cleanDate
        })
      };
    }

    const updated = careers.map(c => {
      if (c.id === activeCareer.id) {
        return {
          ...c,
          posts: optionalNewPost ? [optionalNewPost, ...(c.posts || [])] : (c.posts || []),
          manager: {
            ...c.manager,
            currentDate: cleanDate
          }
        };
      }
      return c;
    });
    setCareers(updated);
  };

  // Create next season
  const handleNewSeason = () => {
    const seasonNumber = activeCareer.seasons.length + 1;
    const currentPeriod = activeSeason.period; // e.g. 2025/26
    const [startYear, endYear] = currentPeriod.split('/').map(Number);
    const nextPeriod = `${startYear + 1}/${endYear + 1}`;

    const newSeason = {
      id: `season-${seasonNumber}-${Date.now()}`,
      name: `Temporada ${seasonNumber}`,
      period: nextPeriod,
      status: "En curso",
      budget: {
        transfer: activeSeason.budget?.transfer || 30000000,
        wageWeekly: activeSeason.budget?.wageWeekly || 300000,
        initialTransfer: 35000000
      },
      stats: {
        position: "—",
        points: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0
      },
      transfersIn: [],
      transfersOut: [],
      objectives: [
        {
          id: `obj-s-${seasonNumber}-1`,
          title: "Éxito en Liga",
          description: `Completar la temporada ${nextPeriod} alcanzando los objetivos pactados.`,
          category: "Éxito nacional",
          priority: "Alta",
          deadline: "Final de temporada",
          completed: false
        }
      ],
      rules: activeSeason.rules || [],
      squad: activeSeason.squad.map(p => ({
        ...p,
        age: p.age + 1,
        matches: 0,
        goals: 0,
        assists: 0,
        cleanSheets: 0,
        yellowCards: 0,
        redCards: 0
      })),
      matches: [],
      standings: activeSeason.standings.map(t => ({
        ...t,
        pj: 0, v: 0, e: 0, d: 0, gf: 0, gc: 0, dg: 0, pts: 0
      })),
      youthAcademy: activeSeason.youthAcademy || [],
      moments: [
        {
          id: `mom-s-${seasonNumber}-init`,
          title: `Inicio de la Temporada ${seasonNumber} (${nextPeriod})`,
          date: `01 jul ${startYear + 1}`,
          type: "Institucional",
          badge: `Temporada ${seasonNumber}`,
          description: `Arranca un nuevo curso futbolístico para el ${activeCareer.manager.club}.`,
          mediaUrl: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600&auto=format&fit=crop&q=80"
        }
      ]
    };

    const updated = careers.map(c => {
      if (c.id === activeCareer.id) {
        return {
          ...c,
          seasons: [...c.seasons, newSeason]
        };
      }
      return c;
    });

    setCareers(updated);
    setActiveSeasonId(activeCareer.id, newSeason.id);
  };

  // MATCH SAVE HANDLER
  const handleSaveMatch = (newMatch) => {
    const updated = careers.map(c => {
      if (c.id === activeCareer.id) {
        // 1. Generate pre-match Starting XI post (published before kickoff)
        const lineupPost = createLineupPost(
          newMatch, 
          activeSeason.squad || [], 
          c.manager.club, 
          c.manager.clubLogo, 
          c.manager.name, 
          c.manager.league
        );

        // 2. Generate individual goal celebration posts for each scorer
        const goalPosts = (newMatch.scorers || []).map((scorer, idx) =>
          createGoalPost(
            scorer, 
            newMatch, 
            activeSeason.squad || [], 
            c.manager.club, 
            c.manager.clubLogo, 
            c.manager.league, 
            idx
          )
        );

        // 3. Generate full time whistle post with team celebration screen and huge score numbers
        const finalMatchPost = createMatchPost(
          newMatch, 
          c.manager.club, 
          c.manager.clubLogo, 
          c.manager.league
        );

        // Check if this match defines winning a title / competition!
        let trophyPost = null;
        let trophyMoment = null;
        let trophyItem = null;

        if (newMatch.wonTitle) {
          const compName = newMatch.competition || c.manager.league;
          trophyPost = createTrophyPost(
            compName,
            c.manager.club,
            c.manager.clubLogo,
            c.manager.name,
            newMatch.date,
            {
              details: `¡Victoria ${newMatch.homeScore}-${newMatch.awayScore} en ${newMatch.matchday}! ¡El trofeo de ${compName} es nuestro!`,
              season: activeSeason.period || activeSeason.name
            }
          );

          const isEuropean = compName.toLowerCase().includes('champions') || compName.toLowerCase().includes('europa');
          const photoUrl = isEuropean 
            ? '/trophies/champions_trophy_celebration.jpg' 
            : '/trophies/league_trophy_celebration.jpg';

          trophyMoment = {
            id: `mom-trophy-${Date.now()}`,
            title: `🏆 ¡Campeones de ${compName}!`,
            date: newMatch.date,
            type: 'Trofeo',
            badge: 'Campeón Oficial',
            description: `El ${c.manager.club} dirigido por ${c.manager.name} se proclama campeón de ${compName} tras vencer ${newMatch.homeScore}-${newMatch.awayScore} en ${newMatch.matchday}.`,
            mediaUrl: photoUrl
          };

          trophyItem = {
            id: `trophy-${Date.now()}`,
            competition: compName,
            date: newMatch.date,
            season: activeSeason.period || activeSeason.name,
            image: photoUrl
          };
        }

        // Order in feed: Trophy (top if won) -> Final Whistle -> Goals -> Lineup
        const matchdayPosts = [
          ...(trophyPost ? [trophyPost] : []),
          finalMatchPost,
          ...([...goalPosts].reverse()),
          lineupPost
        ];

        return {
          ...c,
          trophies: [
            ...(trophyItem ? [trophyItem] : []),
            ...(c.trophies || [])
          ],
          seasons: c.seasons.map(s => {
            if (s.id === activeSeason.id) {
              const updatedMatches = [newMatch, ...(s.matches || [])];
              
              // Recalculate stats
              let wins = s.stats.wins || 0;
              let draws = s.stats.draws || 0;
              let losses = s.stats.losses || 0;
              let goalsFor = s.stats.goalsFor || 0;
              let goalsAgainst = s.stats.goalsAgainst || 0;

              const ourGoals = newMatch.homeTeam === c.manager.club ? newMatch.homeScore : newMatch.awayScore;
              const rivalGoals = newMatch.homeTeam === c.manager.club ? newMatch.awayScore : newMatch.homeScore;

              goalsFor += ourGoals;
              goalsAgainst += rivalGoals;

              if (ourGoals > rivalGoals) wins += 1;
              else if (ourGoals === rivalGoals) draws += 1;
              else losses += 1;

              const points = (wins * 3) + draws;

              // Update squad goal/assist/card stats
              const updatedSquad = s.squad.map(player => {
                let goalsScoredInMatch = 0;
                let assistsInMatch = 0;
                let yellowInMatch = 0;
                let redInMatch = 0;

                newMatch.scorers?.forEach(sc => {
                  if (sc.player === player.name) goalsScoredInMatch += 1;
                  if (sc.assist === player.name) assistsInMatch += 1;
                });

                newMatch.cards?.forEach(cd => {
                  if (cd.player === player.name) {
                    if (cd.type === 'yellow') yellowInMatch += 1;
                    else if (cd.type === 'second_yellow') {
                      yellowInMatch += 2;
                      redInMatch += 1;
                    } else if (cd.type === 'red') {
                      redInMatch += 1;
                    }
                  }
                });

                return {
                  ...player,
                  matches: player.matches + 1,
                  goals: player.goals + goalsScoredInMatch,
                  assists: player.assists + assistsInMatch,
                  yellowCards: (player.yellowCards || 0) + yellowInMatch,
                  redCards: (player.redCards || 0) + redInMatch
                };
              });

              // Update standings for user's team
              const updatedStandings = (s.standings || []).map(team => {
                if (team.isUser || team.team.toLowerCase() === c.manager.club.toLowerCase()) {
                  const pj = updatedMatches.length;
                  const dg = goalsFor - goalsAgainst;
                  return {
                    ...team,
                    pj,
                    v: wins,
                    e: draws,
                    d: losses,
                    gf: goalsFor,
                    gc: goalsAgainst,
                    dg,
                    pts: points
                  };
                }
                return team;
              });

              return {
                ...s,
                matches: updatedMatches,
                squad: updatedSquad,
                standings: updatedStandings,
                moments: [
                  ...(trophyMoment ? [trophyMoment] : []),
                  ...(s.moments || [])
                ],
                trophies: [
                  ...(trophyItem ? [trophyItem] : []),
                  ...(s.trophies || [])
                ],
                stats: {
                  ...s.stats,
                  wins,
                  draws,
                  losses,
                  goalsFor,
                  goalsAgainst,
                  points
                }
              };
            }
            return s;
          }),
          posts: [...matchdayPosts, ...(c.posts || [])]
        };
      }
      return c;
    });

    setCareers(updated);
    if (newMatch.wonTitle) {
      setActiveTab('presentation');
    }
  };

  const handleCelebrateTitle = (competitionName, customDetails, options = {}) => {
    const comp = competitionName || activeCareer.manager.league || 'LALIGA EA SPORTS';
    const dateStr = options.date || activeCareer.manager.currentDate || activeCareer.manager.startDate || '12 oct 2026';
    
    const trophyPost = createTrophyPost(
      comp,
      activeCareer.manager.club,
      activeCareer.manager.clubLogo,
      activeCareer.manager.name,
      dateStr,
      {
        details: customDetails || `¡Temporada histórica! El ${activeCareer.manager.club} se proclama campeón oficial de ${comp}.`,
        season: activeSeason.period || activeSeason.name,
        customImage: options.photoUrl
      }
    );

    const isEuropean = comp.toLowerCase().includes('champions') || comp.toLowerCase().includes('europa') || comp.toLowerCase().includes('libertadores');
    const defaultPhoto = isEuropean 
      ? '/trophies/champions_trophy_celebration.jpg' 
      : '/trophies/league_trophy_celebration.jpg';
    const photoUrl = options.photoUrl || defaultPhoto;

    const trophyMoment = {
      id: `mom-trophy-${Date.now()}`,
      title: `🏆 ¡Campeones de ${comp}!`,
      date: dateStr,
      type: 'Trofeo',
      badge: 'Campeón Oficial',
      description: `El ${activeCareer.manager.club} de ${activeCareer.manager.name} levanta el trofeo de ${comp} tras una campaña memorable.`,
      mediaUrl: photoUrl
    };

    const trophyItem = {
      id: `trophy-${Date.now()}`,
      competition: comp,
      date: dateStr,
      season: activeSeason.period || activeSeason.name,
      image: photoUrl
    };

    const updated = careers.map(c => {
      if (c.id === activeCareer.id) {
        return {
          ...c,
          trophies: [trophyItem, ...(c.trophies || [])],
          posts: [trophyPost, ...(c.posts || [])],
          seasons: c.seasons.map(s => {
            if (s.id === activeSeason.id) {
              return {
                ...s,
                moments: [trophyMoment, ...(s.moments || [])],
                trophies: [trophyItem, ...(s.trophies || [])]
              };
            }
            return s;
          })
        };
      }
      return c;
    });

    setCareers(updated);
    setActiveTab('presentation');
  };

  const handleDeleteMatch = (matchId) => {
    const updated = careers.map(c => {
      if (c.id === activeCareer.id) {
        return {
          ...c,
          seasons: c.seasons.map(s => {
            if (s.id === activeSeason.id) {
              return {
                ...s,
                matches: s.matches.filter(m => m.id !== matchId)
              };
            }
            return s;
          })
        };
      }
      return c;
    });
    setCareers(updated);
  };

  // SQUAD HANDLERS
  const handleRenewPlayer = (player, { renewalYear, wage, clause, autoPost = true, bgImage } = {}) => {
    const updatedContract = String(renewalYear);
    const updatedWage = wage || player.wage;
    const playerValEuros = parsePlayerValueInEuros(player.value);
    const updatedClause = clause 
      ? formatToFullEuros(clause) 
      : (player.clause ? formatToFullEuros(player.clause) : formatToFullEuros(Math.round(playerValEuros * 1.6)));

    const updatedPlayerData = {
      ...player,
      contract: updatedContract,
      wage: updatedWage,
      clause: updatedClause
    };

    let newPost = null;
    if (autoPost) {
      newPost = createRenewalPost(
        updatedPlayerData,
        activeCareer.manager.club,
        activeCareer.manager.clubLogo,
        updatedContract,
        updatedClause,
        activeCareer.manager.name,
        activeCareer.manager.currentDate || '12 oct 2026',
        { bgImage }
      );
    }

    const updatedCareers = careers.map(c => {
      if (c.id === activeCareer.id) {
        const updatedSeasons = c.seasons.map(s => {
          if (s.id === activeSeason.id) {
            const updatedSquad = (s.squad || []).map(p => p.id === player.id ? updatedPlayerData : p);
            return { ...s, squad: updatedSquad };
          }
          return s;
        });

        const updatedPosts = newPost ? [newPost, ...(c.posts || [])] : (c.posts || []);

        return {
          ...c,
          updatedAt: new Date().toISOString(),
          seasons: updatedSeasons,
          posts: updatedPosts
        };
      }
      return c;
    });

    setCareers(updatedCareers);
    saveCareers(updatedCareers);
  };

  const handleSavePlayer = (playerData) => {
    let renewalPost = null;
    // Check if contract was extended
    const existingPlayer = activeSeason.squad?.find(p => p.id === playerData.id);
    if (existingPlayer && playerData.contract && parseInt(playerData.contract, 10) > parseInt(existingPlayer.contract || '2026', 10)) {
      const playerValEuros = parsePlayerValueInEuros(playerData.value);
      const clause = playerData.clause 
        ? formatToFullEuros(playerData.clause) 
        : formatToFullEuros(Math.round(playerValEuros * 1.6));
      renewalPost = createRenewalPost(
        playerData,
        activeCareer.manager.club,
        activeCareer.manager.clubLogo,
        playerData.contract,
        clause,
        activeCareer.manager.name,
        activeCareer.manager.currentDate || '12 oct 2026'
      );
    }

    const updated = careers.map(c => {
      if (c.id === activeCareer.id) {
        const updatedSeasons = c.seasons.map(s => {
          if (s.id === activeSeason.id) {
            const existingIndex = s.squad.findIndex(p => p.id === playerData.id);
            let updatedSquad;
            if (existingIndex >= 0) {
              updatedSquad = [...s.squad];
              updatedSquad[existingIndex] = playerData;
            } else {
              updatedSquad = [...s.squad, playerData];
            }
            return { ...s, squad: updatedSquad };
          }
          return s;
        });

        const updatedPosts = renewalPost ? [renewalPost, ...(c.posts || [])] : (c.posts || []);

        return {
          ...c,
          updatedAt: new Date().toISOString(),
          seasons: updatedSeasons,
          posts: updatedPosts
        };
      }
      return c;
    });
    setCareers(updated);
    saveCareers(updated);
  };

  const handleDeletePlayer = (playerId) => {
    const updated = careers.map(c => {
      if (c.id === activeCareer.id) {
        return {
          ...c,
          seasons: c.seasons.map(s => {
            if (s.id === activeSeason.id) {
              return {
                ...s,
                squad: s.squad.filter(p => p.id !== playerId)
              };
            }
            return s;
          })
        };
      }
      return c;
    });
    setCareers(updated);
  };

  const handleResetToRealSquad = () => {
    const club = activeCareer.manager.club;
    const realRoster = getClubRoster(club);
    if (!realRoster || realRoster.length === 0) {
      alert(`No se encontró plantilla en la base de datos para "${club}".`);
      return;
    }
    if (window.confirm(`¿Quieres restaurar la plantilla del ${club} a su alineación real oficial de EA FC (11 titulares auténticos, 7 suplentes y reservas)?`)) {
      const updated = careers.map(c => {
        if (c.id === activeCareer.id) {
          return {
            ...c,
            seasons: c.seasons.map(s => {
              if (s.id === activeSeason.id) {
                return {
                  ...s,
                  squad: realRoster
                };
              }
              return s;
            })
          };
        }
        return c;
      });
      setCareers(updated);
      alert(`¡Plantilla del ${club} sincronizada con su alineación y plantilla oficial!`);
    }
  };

  // TRANSFER HANDLERS
  const handleSaveTransfer = (transferData, type) => {
    const currentYear = parseInt(activeCareer?.manager?.currentDate?.match(/\d{4}/)?.[0] || '2025', 10);
    const contractExpYear = transferData.contract || String(currentYear + 4);
    const enrichedTransferData = type === 'in' 
      ? { ...transferData, contract: contractExpYear } 
      : transferData;

    const updated = careers.map(c => {
      if (c.id === activeCareer.id) {
        return {
          ...c,
          seasons: c.seasons.map(s => {
            if (s.id === activeSeason.id) {
              if (type === 'in') {
                // If it's a buy, also add player to squad automatically if not present!
                const newPlayer = {
                  id: `sq-${Date.now()}`,
                  name: transferData.name,
                  position: transferData.position,
                  category: ['LD','LI','DFC'].includes(transferData.position) ? 'DEF' : 
                            ['MCD','MC','MCO'].includes(transferData.position) ? 'MED' :
                            transferData.position === 'POR' ? 'POR' : 'DEL',
                  number: 17,
                  age: transferData.age,
                  country: transferData.country,
                  flag: transferData.flag,
                  rating: transferData.rating,
                  potential: transferData.rating + 4,
                  value: transferData.cost,
                  wage: transferData.wage || '35.000 €/sem',
                  contract: contractExpYear,
                  matches: 0,
                  goals: 0,
                  assists: 0,
                  cleanSheets: 0,
                  yellowCards: 0,
                  redCards: 0,
                  avgRating: 7.0,
                  status: 'Titular',
                  morale: 'Excelente'
                };
                return {
                  ...s,
                  transfersIn: [enrichedTransferData, ...(s.transfersIn || [])],
                  squad: [...s.squad, newPlayer]
                };
              } else {
                // If it's a sell, remove or mark in squad
                return {
                  ...s,
                  transfersOut: [transferData, ...(s.transfersOut || [])],
                  squad: s.squad.filter(p => p.name.toLowerCase() !== transferData.name.toLowerCase())
                };
              }
            }
            return s;
          }),
          posts: [
            ...(type === 'in'
              ? [
                  createSigningPost(enrichedTransferData, c.manager.club, c.manager.clubLogo, transferData.date),
                  createOriginFarewellPost(transferData, c.manager.club, transferData.date)
                ]
              : [
                  createSalePost(transferData, c.manager.club, c.manager.clubLogo, transferData.date)
                ]
            ),
            ...(c.posts || [])
          ]
        };
      }
      return c;
    });
    setCareers(updated);
  };

  const handleDeleteTransfer = (transferId, type) => {
    const updated = careers.map(c => {
      if (c.id === activeCareer.id) {
        return {
          ...c,
          seasons: c.seasons.map(s => {
            if (s.id === activeSeason.id) {
              if (type === 'in') {
                return {
                  ...s,
                  transfersIn: s.transfersIn.filter(t => t.id !== transferId)
                };
              } else {
                return {
                  ...s,
                  transfersOut: s.transfersOut.filter(t => t.id !== transferId)
                };
              }
            }
            return s;
          })
        };
      }
      return c;
    });
    setCareers(updated);
  };

  // YOUTH HANDLERS
  const handleSaveYouth = (newProspect) => {
    const updated = careers.map(c => {
      if (c.id === activeCareer.id) {
        return {
          ...c,
          seasons: c.seasons.map(s => {
            if (s.id === activeSeason.id) {
              return {
                ...s,
                youthAcademy: [newProspect, ...(s.youthAcademy || [])]
              };
            }
            return s;
          })
        };
      }
      return c;
    });
    setCareers(updated);
  };

  const handlePromoteYouth = (prospect) => {
    const currentYear = parseInt(activeCareer?.manager?.currentDate?.match(/\d{4}/)?.[0] || '2025', 10);
    const promotedPlayer = {
      id: `sq-${Date.now()}`,
      name: prospect.name,
      position: prospect.position,
      category: ['LD','LI','DFC'].includes(prospect.position) ? 'DEF' : 
                ['MCD','MC','MCO'].includes(prospect.position) ? 'MED' :
                prospect.position === 'POR' ? 'POR' : 'DEL',
      number: 28,
      age: prospect.age,
      country: prospect.country,
      flag: prospect.flag,
      rating: prospect.rating,
      potential: prospect.potentialMax,
      value: '4,5 M €',
      wage: '12.000 €/sem',
      contract: String(currentYear + 4),
      matches: 0,
      goals: 0,
      assists: 0,
      cleanSheets: 0,
      yellowCards: 0,
      redCards: 0,
      avgRating: 7.0,
      status: 'Canterano Promocionado',
      morale: 'Pletórico'
    };

    const updated = careers.map(c => {
      if (c.id === activeCareer.id) {
        return {
          ...c,
          seasons: c.seasons.map(s => {
            if (s.id === activeSeason.id) {
              return {
                ...s,
                squad: [...s.squad, promotedPlayer],
                youthAcademy: s.youthAcademy.filter(y => y.id !== prospect.id),
                moments: [
                  {
                    id: `mom-prom-${Date.now()}`,
                    title: `Debut y Promoción de ${prospect.name}`,
                    date: activeCareer.manager.currentDate || 'Hoy',
                    type: "Cantera",
                    badge: "Joya Canterana",
                    description: `La perla de la academia con potencial ${prospect.potentialMin}-${prospect.potentialMax} asciende oficialmente al primer equipo.`,
                    mediaUrl: "https://images.unsplash.com/photo-1511886929837-354d827aae26?w=600&auto=format&fit=crop&q=80"
                  },
                  ...(s.moments || [])
                ]
              };
            }
            return s;
          }),
          posts: [createYouthPost(prospect, c.manager.club), ...(c.posts || [])]
        };
      }
      return c;
    });
    setCareers(updated);
    alert(`¡${prospect.name} ha sido promocionado al primer equipo con éxito!`);
  };

  const handleDeleteYouth = (youthId) => {
    const updated = careers.map(c => {
      if (c.id === activeCareer.id) {
        return {
          ...c,
          seasons: c.seasons.map(s => {
            if (s.id === activeSeason.id) {
              return {
                ...s,
                youthAcademy: s.youthAcademy.filter(y => y.id !== youthId)
              };
            }
            return s;
          })
        };
      }
      return c;
    });
    setCareers(updated);
  };

  // MOMENT HANDLERS
  const handleSaveMoment = (moment) => {
    const updated = careers.map(c => {
      if (c.id === activeCareer.id) {
        return {
          ...c,
          seasons: c.seasons.map(s => {
            if (s.id === activeSeason.id) {
              return {
                ...s,
                moments: [moment, ...(s.moments || [])]
              };
            }
            return s;
          })
        };
      }
      return c;
    });
    setCareers(updated);
  };

  const handleDeleteMoment = (momentId) => {
    const updated = careers.map(c => {
      if (c.id === activeCareer.id) {
        return {
          ...c,
          seasons: c.seasons.map(s => {
            if (s.id === activeSeason.id) {
              return {
                ...s,
                moments: s.moments.filter(m => m.id !== momentId)
              };
            }
            return s;
          })
        };
      }
      return c;
    });
    setCareers(updated);
  };

  // OBJECTIVES & RULES HANDLERS
  const handleToggleObjective = (objId) => {
    const updated = careers.map(c => {
      if (c.id === activeCareer.id) {
        return {
          ...c,
          seasons: c.seasons.map(s => {
            if (s.id === activeSeason.id) {
              return {
                ...s,
                objectives: s.objectives.map(o => o.id === objId ? { ...o, completed: !o.completed } : o)
              };
            }
            return s;
          })
        };
      }
      return c;
    });
    setCareers(updated);
  };

  const handleAddObjective = (newObj) => {
    const updated = careers.map(c => {
      if (c.id === activeCareer.id) {
        return {
          ...c,
          seasons: c.seasons.map(s => {
            if (s.id === activeSeason.id) {
              return {
                ...s,
                objectives: [...s.objectives, newObj]
              };
            }
            return s;
          })
        };
      }
      return c;
    });
    setCareers(updated);
  };

  const handleDeleteObjective = (objId) => {
    const updated = careers.map(c => {
      if (c.id === activeCareer.id) {
        return {
          ...c,
          seasons: c.seasons.map(s => {
            if (s.id === activeSeason.id) {
              return {
                ...s,
                objectives: s.objectives.filter(o => o.id !== objId)
              };
            }
            return s;
          })
        };
      }
      return c;
    });
    setCareers(updated);
  };

  const handleAddRule = (newRule) => {
    const updated = careers.map(c => {
      if (c.id === activeCareer.id) {
        return {
          ...c,
          seasons: c.seasons.map(s => {
            if (s.id === activeSeason.id) {
              return {
                ...s,
                rules: [...s.rules, newRule]
              };
            }
            return s;
          })
        };
      }
      return c;
    });
    setCareers(updated);
  };

  const handleDeleteRule = (ruleId) => {
    const updated = careers.map(c => {
      if (c.id === activeCareer.id) {
        return {
          ...c,
          seasons: c.seasons.map(s => {
            if (s.id === activeSeason.id) {
              return {
                ...s,
                rules: s.rules.filter((r, i) => (r.id ? r.id !== ruleId : i !== ruleId))
              };
            }
            return s;
          })
        };
      }
      return c;
    });
    setCareers(updated);
  };

  // STANDINGS HANDLERS
  const handleUpdateStandings = (newStandings) => {
    const updated = careers.map(c => {
      if (c.id === activeCareer.id) {
        return {
          ...c,
          seasons: c.seasons.map(s => {
            if (s.id === activeSeason.id) {
              return { ...s, standings: newStandings };
            }
            return s;
          })
        };
      }
      return c;
    });
    setCareers(updated);
  };

  const handleRecalculateFromMatches = () => {
    const matches = activeSeason.matches || [];
    let wins = 0;
    let draws = 0;
    let losses = 0;
    let gf = 0;
    let gc = 0;

    matches.forEach(m => {
      const isHome = m.homeTeam === activeCareer.manager.club;
      const ourScore = isHome ? m.homeScore : m.awayScore;
      const rivalScore = isHome ? m.awayScore : m.homeScore;

      gf += ourScore;
      gc += rivalScore;
      if (ourScore > rivalScore) wins++;
      else if (ourScore === rivalScore) draws++;
      else losses++;
    });

    const pts = (wins * 3) + draws;
    const pj = matches.length;
    const dg = gf - gc;

    const updatedStandings = (activeSeason.standings || []).map(t => {
      if (t.isUser || t.team.toLowerCase() === activeCareer.manager.club.toLowerCase()) {
        return {
          ...t,
          pj,
          v: wins,
          e: draws,
          d: losses,
          gf,
          gc,
          dg,
          pts
        };
      }
      return t;
    });

    updatedStandings.sort((a, b) => b.pts - a.pts || b.dg - a.dg);
    const reindexed = updatedStandings.map((t, i) => ({ ...t, pos: i + 1 }));

    handleUpdateStandings(reindexed);
    alert('¡Tabla de posiciones sincronizada con tus partidos!');
  };

  // SAVE NEW CAREER
  const handleSaveNewCareer = (newCareer) => {
    const careerToSave = {
      ...newCareer,
      updatedAt: new Date().toISOString(),
      posts: newCareer.posts && newCareer.posts.length > 0 
        ? newCareer.posts 
        : [createManagerPost(newCareer.manager)]
    };
    const updatedCareers = [careerToSave, ...careers];
    setCareers(updatedCareers);
    setActiveCareerIdState(newCareer.id);
    setActiveCareerId(newCareer.id);
    saveCareers(updatedCareers);
    setIsNewCareerModalOpen(false);
    setLoadingCareer(careerToSave);
    setIsLoadingScreen(true);
  };

  // POST HANDLERS
  const handleSaveEditedPost = (updatedPost) => {
    const updated = careers.map(c => {
      if (c.id === activeCareer.id) {
        return {
          ...c,
          updatedAt: new Date().toISOString(),
          posts: (c.posts || []).map(p => p.id === updatedPost.id ? updatedPost : p)
        };
      }
      return c;
    });
    setCareers(updated);
  };

  const handleDeletePost = (postId) => {
    const updated = careers.map(c => {
      if (c.id === activeCareer.id) {
        return {
          ...c,
          updatedAt: new Date().toISOString(),
          posts: (c.posts || []).filter(p => p.id !== postId)
        };
      }
      return c;
    });
    setCareers(updated);
  };

  const handleSaveNewCustomPost = (newPost) => {
    const updated = careers.map(c => {
      if (c.id === activeCareer.id) {
        return {
          ...c,
          updatedAt: new Date().toISOString(),
          posts: [newPost, ...(c.posts || [])]
        };
      }
      return c;
    });
    setCareers(updated);
  };

  const handleReactPost = () => {};

  // UPDATE ACTIVE CAREER (e.g. from EditManagerModal)
  const handleUpdateCareer = (updatedCareer) => {
    const updatedWithDate = {
      ...updatedCareer,
      updatedAt: new Date().toISOString()
    };
    const updated = careers.map(c => c.id === updatedWithDate.id ? updatedWithDate : c);
    setCareers(updated);
    saveCareers(updated);
  };

  // QUICK ADD DISPATCHER
  const handleOpenQuickAdd = (targetType) => {
    if (targetType === 'transferIn') {
      setTransferDefaultType('in');
      setIsTransferModalOpen(true);
    } else if (targetType === 'transferOut') {
      setTransferDefaultType('out');
      setIsTransferModalOpen(true);
    } else if (targetType === 'player') {
      setPlayerToEdit(null);
      setIsPlayerModalOpen(true);
    } else if (targetType === 'youth') {
      setIsYouthModalOpen(true);
    } else if (targetType === 'moment') {
      setIsMomentModalOpen(true);
    } else if (targetType === 'lineup' || targetType === 'post') {
      setIsNewPostModalOpen(true);
    } else if (targetType === 'objective' || targetType === 'rule') {
      setActiveTab('seasons');
      setActiveSubTab('rules');
    }
  };

  // SIGN PLAYER FROM DATABASE (supports custom origin club, fee & wage for multi-season realism)
  const handleSignPlayerFromDatabase = (player, overrides = {}) => {
    const currentYear = parseInt(activeCareer.manager.currentDate?.match(/\d{4}/)?.[0] || '2025', 10);
    const contractYear = overrides.contract || String(currentYear + 4);
    const baseSquad = convertRosterPlayerToSquad(player);
    const originClub = overrides.originClub || player.customClubFrom || player.teamName;
    const originLogo = overrides.originLogo || player.customClubLogo || getClubLogo(originClub) || player.teamLogo;

    const costMil = overrides.cost !== undefined 
      ? overrides.cost 
      : (player.customVal !== undefined ? player.customVal : (player.val || Math.round((player.ovr || 75) * 0.4)));
    const costNum = Number(costMil) * 1000000;

    const wageStr = overrides.wage || player.customWage || `${((player.wage || 35) * 1000).toLocaleString('es-ES')} €/sem`;
    const dateStr = overrides.date || activeCareer.manager.currentDate || activeCareer.manager.startDate;

    const squadPlayer = {
      ...baseSquad,
      contract: contractYear,
      value: overrides.cost !== undefined ? `${costMil} M €` : baseSquad.value,
      wage: wageStr
    };

    const newTransfer = {
      id: `tr-db-${Date.now()}`,
      name: player.name,
      position: squadPlayer.position,
      age: Number(player.age) || 24,
      country: player.nat || "España",
      flag: squadPlayer.flag,
      rating: Number(player.ovr) || 75,
      photo: player.imageUrl,
      cost: `${costMil} M €`,
      costNumber: costNum,
      wage: wageStr,
      contract: contractYear,
      clubFrom: originClub,
      clubLogo: originLogo,
      originClubLogo: originLogo,
      date: dateStr
    };

    const signingPost = createSigningPost(newTransfer, activeCareer.manager.club, activeCareer.manager.clubLogo, dateStr);
    const farewellPost = createOriginFarewellPost(newTransfer, activeCareer.manager.club, dateStr);

    const updatedCareers = careers.map(c => {
      if (c.id === activeCareer.id) {
        const updatedSeasons = c.seasons.map(s => {
          if (s.id === activeSeason.id) {
            const currentBudget = s.budget?.transfer || 50000000;
            const newTransferBudget = Math.max(0, currentBudget - costNum);
            return {
              ...s,
              budget: {
                ...s.budget,
                transfer: newTransferBudget
              },
              squad: [squadPlayer, ...(s.squad || [])],
              transfersIn: [newTransfer, ...(s.transfersIn || [])]
            };
          }
          return s;
        });

        const updatedPosts = [signingPost, farewellPost, ...(c.posts || [])];
        return {
          ...c,
          seasons: updatedSeasons,
          posts: updatedPosts
        };
      }
      return c;
    });

    setCareers(updatedCareers);
  };

  // RESET AND IMPORT HANDLERS
  const handleResetData = () => {
    const def = resetToDefaults();
    setCareers(def);
    setActiveCareerIdState(def[0].id);
    setActiveCareerId(def[0].id);
    setCreatorProfile(null);
    setIsInCareerHub(true);
  };

  const handleImportData = (importedCareers) => {
    setCareers(importedCareers);
    if (importedCareers[0]) {
      setActiveCareerIdState(importedCareers[0].id);
      setActiveCareerId(importedCareers[0].id);
    }
  };

  // 1. EA FC Loading Screen on initial visit / refresh or when entering a career
  if (isLoadingScreen) {
    return (
      <LoadingScreen
        career={loadingCareer}
        onFinish={handleLoadingFinish}
        duration={loadingCareer ? 4400 : 4800}
      />
    );
  }

  // 2. Career Selector Hub Menu ("cuadraditos con hover, nuevo modo carrera, acceder, modificar, eliminar")
  if (isInCareerHub) {
    return (
      <div className="min-h-screen bg-[#070b12] text-white flex flex-col font-sans selection:bg-[#00ff87] selection:text-[#070b12]">
        <CareerSelectorHub
          careers={careers}
          activeCareerId={activeCareerId}
          onSelectCareer={handleSelectCareerFromHub}
          onNewCareer={() => setIsNewCareerModalOpen(true)}
          onEditCareer={handleEditCareerFromHub}
          onDeleteCareer={handleDeleteCareer}
          onOpenDatabase={() => {
            setIsInCareerHub(false);
            setActiveTab('database');
          }}
          creatorProfile={creatorProfile}
        />

        {/* Modal: New Career Wizard */}
        <CareerCreationWizard
          isOpen={isNewCareerModalOpen}
          onClose={() => setIsNewCareerModalOpen(false)}
          onSaveCareer={handleSaveNewCareer}
        />

        {/* Modal: Edit Manager & Career Details */}
        <EditManagerModal
          isOpen={isEditManagerModalOpen}
          onClose={() => {
            setIsEditManagerModalOpen(false);
            setCareerToEdit(null);
          }}
          career={careerToEdit || activeCareer}
          activeSeasonId={activeSeason.id}
          onUpdateCareer={handleUpdateCareer}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080b10] text-slate-100 flex flex-col font-sans selection:bg-[#00ff87] selection:text-black">
      
      {/* 1. Header */}
      <Header
        careers={careers}
        activeCareer={activeCareer}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onSelectCareer={handleSelectCareer}
        onNewCareer={() => setIsNewCareerModalOpen(true)}
        onGameVersionToggle={handleGameVersionToggle}
        onImportData={handleImportData}
        onResetData={handleResetData}
        onOpenCareerHub={() => setIsInCareerHub(true)}
      />

      {/* 2. Career Profile Banner (Matches screenshot) */}
      <CareerBanner
        career={activeCareer}
        onOpenMatchModal={() => setIsMatchModalOpen(true)}
        onOpenQuickAddModal={handleOpenQuickAdd}
        onOpenEditManagerModal={() => setIsEditManagerModalOpen(true)}
        onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
        onAdvanceDate={handleAdvanceDate}
        onNewSeason={handleNewSeason}
        onCelebrateTitle={handleOpenTrophyModal}
      />

      {/* 3. Navigation Tabs */}
      <NavTabs
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* 4. Main Body Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        {activeTab === 'seasons' && (
          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* Season Sidebar Menu */}
            <SeasonSidebar
              seasons={activeCareer.seasons}
              activeSeason={activeSeason}
              activeSubTab={activeSubTab}
              onSelectSubTab={setActiveSubTab}
              onSelectSeason={handleSelectSeason}
              onAddSeason={handleNewSeason}
              momentsCount={activeSeason.moments?.length || 0}
            />

            {/* Subtab Dynamic Views */}
            <div className="flex-1 min-w-0">
              {activeSubTab === 'overview' && (
                <OverviewTab
                  season={activeSeason}
                  career={activeCareer}
                  onOpenQuickAddModal={handleOpenQuickAdd}
                  onToggleObjective={handleToggleObjective}
                  onNavigateToTab={(tab) => setActiveSubTab(tab)}
                />
              )}

              {activeSubTab === 'matches' && (
                <MatchesTab
                  season={activeSeason}
                  clubName={activeCareer.manager.club}
                  onOpenMatchModal={() => setIsMatchModalOpen(true)}
                  onDeleteMatch={handleDeleteMatch}
                />
              )}

              {activeSubTab === 'calendar' && (
                <MatchesTab
                  season={activeSeason}
                  clubName={activeCareer.manager.club}
                  onOpenMatchModal={() => setIsMatchModalOpen(true)}
                  onDeleteMatch={handleDeleteMatch}
                />
              )}

              {activeSubTab === 'standings' && (
                <StandingsTab
                  season={activeSeason}
                  clubName={activeCareer.manager.club}
                  onUpdateStandings={handleUpdateStandings}
                  onRecalculateFromMatches={handleRecalculateFromMatches}
                  onCelebrateTitle={handleOpenTrophyModal}
                />
              )}

              {activeSubTab === 'squad' && (
                <SquadTab
                  season={activeSeason}
                  clubName={activeCareer.manager.club}
                  clubLogo={activeCareer.manager.clubLogo}
                  manager={activeCareer.manager}
                  onOpenPlayerModal={() => { setPlayerToEdit(null); setIsPlayerModalOpen(true); }}
                  onEditPlayer={(p) => { setPlayerToEdit(p); setIsPlayerModalOpen(true); }}
                  onDeletePlayer={handleDeletePlayer}
                  onResetToRealSquad={handleResetToRealSquad}
                  onRenewPlayer={handleRenewPlayer}
                />
              )}

              {activeSubTab === 'transfers' && (
                <TransfersTab
                  season={activeSeason}
                  onOpenTransferModal={(type) => {
                    setTransferDefaultType(type);
                    setIsTransferModalOpen(true);
                  }}
                  onDeleteTransfer={handleDeleteTransfer}
                />
              )}

              {activeSubTab === 'youth' && (
                <YouthTab
                  season={activeSeason}
                  onOpenYouthModal={() => setIsYouthModalOpen(true)}
                  onPromoteYouth={handlePromoteYouth}
                  onDeleteYouth={handleDeleteYouth}
                />
              )}

              {activeSubTab === 'moments' && (
                <MomentsTab
                  season={activeSeason}
                  onOpenMomentModal={() => setIsMomentModalOpen(true)}
                  onDeleteMoment={handleDeleteMoment}
                />
              )}

              {activeSubTab === 'stats' && (
                <StatsTab
                  season={activeSeason}
                />
              )}

              {activeSubTab === 'rules' && (
                <RulesObjectivesTab
                  season={activeSeason}
                  onToggleObjective={handleToggleObjective}
                  onAddObjective={handleAddObjective}
                  onDeleteObjective={handleDeleteObjective}
                  onAddRule={handleAddRule}
                  onDeleteRule={handleDeleteRule}
                />
              )}

              {activeSubTab === 'privacy' && (
                <div className="bg-[#101724] border border-[#1e2a3f] p-8 rounded-2xl text-center space-y-3">
                  <span className="text-3xl">🔒</span>
                  <h3 className="font-extrabold text-white text-base">Modo Privado Activado</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Tus notas de carrera, cláusulas secretas y presupuestos están protegidos y solo se visualizan en este navegador local.
                  </p>
                </div>
              )}
            </div>

          </div>
        )}

        {activeTab === 'presentation' && (
          <PresentationTab
            career={activeCareer}
            activeSeason={activeSeason}
            posts={activeCareer.posts || []}
            onEditPost={(post) => {
              setPostToEdit(post);
              setIsEditPostModalOpen(true);
            }}
            onReactPost={handleReactPost}
            onOpenNewPostModal={handleOpenNewPostModal}
            creatorProfile={creatorProfile}
            onUpdateCreatorProfile={handleUpdateCreatorProfile}
            onUpdatePost={handleSaveEditedPost}
          />
        )}

        {activeTab === 'mycareer' && (
          <MyCareerTab
            career={activeCareer}
            onCelebrateTitle={handleOpenTrophyModal}
          />
        )}

        {activeTab === 'community' && (
          <CommunityTab
            career={activeCareer}
            activeSeason={activeSeason}
            careers={careers}
          />
        )}

        {activeTab === 'database' && (
          <DatabaseView
            activeCareer={activeCareer}
            onSignPlayer={handleSignPlayerFromDatabase}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsTab
            careers={careers}
            onResetData={handleResetData}
            onImportData={handleImportData}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1a2336] bg-[#070a0f] py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026-2027 FC Career Hub — Gestor de Modo Carrera para EA Sports FC 26 & EA Sports FC 27.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="hover:text-[#00ff87] cursor-pointer" onClick={() => setActiveTab('settings')}>Guardado Local</span>
            <span>•</span>
            <span className="hover:text-[#00ff87] cursor-pointer" onClick={() => setIsNewCareerModalOpen(true)}>+ Nueva Carrera</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      <MatchModal
        isOpen={isMatchModalOpen}
        onClose={() => setIsMatchModalOpen(false)}
        onSaveMatch={handleSaveMatch}
        squad={activeSeason.squad || []}
        clubName={activeCareer.manager.club}
        league={activeCareer.manager.league}
        currentDate={activeCareer.manager.currentDate || activeCareer.manager.startDate || '14 sep 2026'}
      />

      <PlayerModal
        isOpen={isPlayerModalOpen}
        onClose={() => { setIsPlayerModalOpen(false); setPlayerToEdit(null); }}
        onSavePlayer={handleSavePlayer}
        playerToEdit={playerToEdit}
      />

      <TransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        onSaveTransfer={handleSaveTransfer}
        defaultType={transferDefaultType}
        squad={activeSeason.squad || []}
        clubName={activeCareer.manager.club}
        currentDate={activeCareer.manager.currentDate || activeCareer.manager.startDate || '15 jul 2025'}
      />

      <YouthModal
        isOpen={isYouthModalOpen}
        onClose={() => setIsYouthModalOpen(false)}
        onSaveYouth={handleSaveYouth}
      />

      <MomentModal
        isOpen={isMomentModalOpen}
        onClose={() => setIsMomentModalOpen(false)}
        onSaveMoment={handleSaveMoment}
      />

      <CareerCreationWizard
        isOpen={isNewCareerModalOpen}
        onClose={() => setIsNewCareerModalOpen(false)}
        onSaveCareer={handleSaveNewCareer}
      />

      <EditManagerModal
        isOpen={isEditManagerModalOpen}
        onClose={() => {
          setIsEditManagerModalOpen(false);
          setCareerToEdit(null);
        }}
        career={careerToEdit || activeCareer}
        activeSeasonId={activeSeason.id}
        onUpdateCareer={handleUpdateCareer}
      />

      <CalendarModal
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
        career={activeCareer}
        season={activeSeason}
        onSaveDate={handleSaveCalendarDate}
      />

      <TrophyModal
        isOpen={isTrophyModalOpen}
        onClose={() => setIsTrophyModalOpen(false)}
        career={activeCareer}
        season={activeSeason}
        onConfirmCelebrate={handleCelebrateTitle}
        initialCompetition={trophyModalInitialComp}
      />

      <EditPostModal
        isOpen={isEditPostModalOpen}
        onClose={() => {
          setIsEditPostModalOpen(false);
          setPostToEdit(null);
        }}
        post={postToEdit}
        onSavePost={handleSaveEditedPost}
        onDeletePost={handleDeletePost}
      />

      <NewPostModal
        isOpen={isNewPostModalOpen}
        onClose={() => setIsNewPostModalOpen(false)}
        onSavePost={handleSaveNewCustomPost}
        clubName={activeCareer.manager.club}
        clubLogo={activeCareer.manager.clubLogo}
        managerName={activeCareer.manager.name}
        league={activeCareer.manager.league}
        squad={activeSeason.squad || []}
        initialMode={newPostModalMode}
      />

      {/* Floating Míster IA button */}
      <button
        onClick={() => setIsAIAssistantOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 bg-gradient-to-r from-[#00ff87] to-[#00dfa2] text-[#080d14] font-black text-xs sm:text-sm px-4 py-3 rounded-full shadow-2xl shadow-[#00ff87]/30 hover:shadow-[#00ff87]/60 hover:scale-105 active:scale-95 transition-all group border border-white/20"
        title="Abrir Míster IA (Asistente Táctico, Ojeador y Prensa)"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#080d14] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#080d14]"></span>
        </span>
        <Sparkles className="w-4 h-4 stroke-[2.5] text-[#080d14] group-hover:rotate-12 transition-transform" />
        <span className="tracking-wide">Míster IA</span>
      </button>

      {/* AI Assistant Modal */}
      <AIAssistantModal
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        career={activeCareer}
        season={activeSeason}
        onSignPlayer={handleSignPlayerFromDatabase}
        onAddPost={handleSaveNewCustomPost}
      />

      {/* Onboarding Modal for New Visitors */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onComplete={handleCompleteOnboarding}
      />

    </div>
  );
}
